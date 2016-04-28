/*!---------------------------------------------------------------------
 * ---------------------------------------------------------------------
 * ------------██╗---██╗-██████╗-███╗---██╗██████╗-██╗---██╗------------
 * ------------╚██╗-██╔╝██╔═══██╗████╗--██║██╔══██╗██║---██║------------
 * -------------╚████╔╝-██║---██║██╔██╗-██║██║--██║██║---██║------------
 * --------------╚██╔╝--██║---██║██║╚██╗██║██║--██║██║---██║------------
 * ---------------██║---╚██████╔╝██║-╚████║██████╔╝╚██████╔╝------------
 * ---------------╚═╝----╚═════╝-╚═╝--╚═══╝╚═════╝  ╚═════╝-------------
 * ---------------------------------------------------------------------
 * ----------------------Technology Made Human--------------------------
 * ---------------------------------------------------------------------
 * ---------------------------------------------------------------------
*/
// Project Name :: Project Engage
// Quiz type    :: Text Twist


// Prototyepe for Shuffling
String.prototype.shuffle = function () {
	'use strict';
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    // return a.join("");
    return a;
};

// App Core Functions

var App = (function(){
	var serverPath = config.serverPath;
	var apiBasePath = config.serverPath+config.apiBasePath;
	var qimagePath = config.serverPath+config.qimagePath;
	// var qimagePath = serverPath+"/sites/elgg/mod/engage/images/question/"; // DON SERVER
	// var qimagePath = "assets/images/questions/"; // LOCAL
	// var apiBasePath = "../../engage/api/quizsql";

	// Start Setup
	// Purpose : Holds necessary information about the Game App
	var configMap = {
			open_type : null,
			plstore : {
				id : 'PLAYER__ID',
				name : 'PLAYER__NAME',
				username : 'PLAYER__USERNAME',
				match : 'ENGAGE__MATCH',
				mode : 'OPEN__TYPE'
			},
			apis : {
				base : '../app/api/',
				// base : '../quiz_multichoice/api/',
				api : {
					'find' : 'fm.php',
					'create' : 'cm.php',
					'wait' : 'wm.php',
					'update-score' : 'update-score.php',
					'get-updates' : 'get-updates.php',
					'players' : 'players.php',
					'questions' : 'questions.php',
					'get-match-status' : 'get-match-status.php',
					'check-statuses' : 'checkStatuses.php'
				},
				ch_api : {
					// Params for API 1
					// topic_id, game_id, player_a name, player_b name
					'api1' : apiBasePath+'/challengePlayer/',
					
					// Params for API 2
					// match_id
					'api2' : apiBasePath+'/sendChallenge/',

					// Params for API 3
					// topic_id, game_id, player_a name, player_b name, match_status = 'ongoing'
					'api3' : apiBasePath+'/acceptChallenge/',

					// Params for API 4
					// match_id, match_status = 'reject'
					'api4' : apiBasePath+'/rejectChallenge/',

					// Params for API 7
					// match_id, player_a name, player_b name
					'api7' : apiBasePath+'/existingRematch/',

					// Params for API 8
					// player_a name, player_b name
					'api8' : apiBasePath+'/searchRematch/',

					// Params for API 9
					// match_id, player_id, game_id, topic_id, match_result, xp_points
					'api9' : apiBasePath+'/matchLogs/',

					// Params for API 10
					// match_id, player_id
					'api10' : apiBasePath+'/leaveMatch/',

					// Params for API 11
					// qt_id, topic_id, qnum, is_solo
					'api11' : apiBasePath+'/loadQuestion/'
				}
			},
			// Questions
			// { questions : { question : question text, options : [ answer, answer etc. ], answer : correct answer } }
			qs : {},
			// Players
			// { players : { a : {name : name, badge : badge, place : place, score : score } } }
			ps : {},
			topic : {},
			match : {},
			player : {}, //current player
			playerLocalPos : {}, // location of players locally
			// Scoreboard
			// { round : { playera : { score : score, answer : answer }, playerb : { score : score, answer : answer } } }
			scores : {},
			matchid : 0,
			matchStatus : 'find', // find, create, wait
			playStatus : 0, // 0 = waiting a match, 1 = ongoing match, 2 = ended match
			// 1000
			waitTimer : { timing : null, delay : 1000, currentTime : 1},
			// 3000
			findMatchTimer : { timing : null, delay : 3000, maxTries : 30, currentTries : 1},
			// 5000
			matchTimer : { timing : null, delay : 5000 },
			// 2000
			roundTimer : { timing : null, delay : 2000 },
			// 2000
			questTimer : { timing : null, delay : 0 },
			// 1000
			gameTimer : { timing : null, delay : 1000, points : 150 },
			// 3000
			roundEndTimer : { timing : null, delay : 3000 },
			// 2000
			resultTimer : {timing : null, delay : 1000, currentTime : 1},
			maxScorePerRound : 10,
			currentRound : 1,
			currentRoundCount : 1,
			currentRoundisFin : false,
			currentScore : {},
			hasAnswered : false,
			roundHasEnded : false,
			modal : {},
			browser : null,
			bridge : null,
			mod_marker : false,
			// findmatch - finding a matching
			// waiting - waiting for other player's response (in random)
			// waiting-ch - waiting for other player in challenge mode
			// waiting-rm - waiting for other player in rematch mode
			// versus - display the versus page
			// round - display the current round
			// question - render players and scores, question and choices
			// result - display result page
			currentScreen : 'findmatch',
			audio : {
				files : {
					bg_random : ['assets/audio/bg_random1.mp3'],
					sfx_correct : ['assets/audio/sfx-correct.mp3'],
					sfx_incorrect : ['assets/audio/sfx-incorrect1.mp3'],
					sfx_versus : ['assets/audio/sfx-versus1.mp3']
				},
				sfx : {}
			},
			xhrRequests : {
				'searchRematch' : null,
				'getUpdates' : null
			},
			isRequested : {
				'challengePlayer' : false,
				'searchRematch' : false,
				'acceptChallenge' : false 
			},
			req_marker : false,
			getMatchStatus : null,
			checkStatuses : null,

			// FOR TEXT TWIST
			currentAnswer : [],
			currentScramOriginal : null,
			currentScram : null
		},
		jqueryMap = {
			$main : $('.engage'),
			$header : $('<div/>').addClass('engage__header'),
			$ingame : $('<div/>').addClass('engage__body')
		};
	// End Setup

	// Start Module /initSetup/
	// Purpose : Defaults all properties in the game
	var initSetup = function(){
		console.log('INITSETUP()');
		if( configMap.isStatic ){
			// Static
			configMap.game = {
				"id" : 2,
				"name" : "Text Twist",
				"type" : "Text Twist"
			};

			configMap.topic = {
				"id" : 1,
				"name" : "Paborito ng mga Pinoy",
				"icon" : "assets/images/vanamo_logo.png"
			};

			configMap.match = {
				"id" : 1,
				"status" : "ongoing",
				"isactive" : {
				    "a" : true,
				    "b" : true
				}
			};

			configMap.qs = {
				"questions" : [
					{
						"id" : 1,
						"question" : "Guess the Character",
						"image" : "2.jpg",
						"answer" : "blossom"
					},
					{
						"id" : 2,
						"question" : "Guess the Character",
						"image" : "3.jpg",
						"answer" : "aurora"
					},
					// {
					// 	"id" : 3,
					// 	"question" : "Guess the Word",
					// 	"image" : "assets/images/questions/4.jpg",
					// 	"answer" : "pickachu"
					// },
					// {
					// 	"id" : 4,
					// 	"question" : "Guess the Word",
					// 	"image" : "assets/images/questions/5.jpg",
					// 	"answer" : "spongebob"
					// },
					// {
					// 	"id" : 5,
					// 	"question" : "Guess the Word",
					// 	"image" : "assets/images/questions/6.jpg",
					// 	"answer" : "wolverine"
					// },
					// {
					// 	"id" : 6,
					// 	"question" : "Guess the Word",
					// 	"image" : "assets/images/questions/1.jpg",
					// 	"answer" : "blossom"
					// },
					{
						"id" : 7,
						"question" : "Guess the Character",
						"image" : "4.jpg",
						"answer" : "pikachu"
					}
				]
			};

			configMap.ps = {
				"players" : {
					"a" : {
						"id" : 1,
						"name" : "Kalabaw",
						"username" : "kalabaw.23891231",
						"badge" : "Handa",
						"place" : "a",
						"icon" : "",
						"score" : 0,
						"isactive" : true
					},
					"b" : {
						"id" : 2,
						"name" : "Baka",
						"username" : "baka.123872312",
						"badge" : "Handa",
						"place" : "b",
						"icon" : "",
						"score" : 0,
						"isactive" : true
					}
				}
			};
		}else{
			var match_details = localStorage[configMap.plstore.match];
			var match_json = stringToJSON(match_details);

			console.log('match_json --> ', match_json);

			var gameDefault = {
				"id" : 2,
				"name" : "Quiz Game",
				"type" : "multiple choice"
			};

			var topicDefault = {
				"id" : 1,
				"name" : "Paborito ng mga Pinoy",
				"icon" : "assets/images/vanamo_logo.png"
			};

			var matchDefault = {
				"id" : 0,
				"isactive" : {
					"a" : true,
					"b" : true
				}
			};

			if( match_json.game ){
				configMap.game = match_json.game;
			}else{
				configMap.game = gameDefault;
			}

			if( match_json.topic ){
				configMap.topic = match_json.topic;
			}else{
				configMap.topic = topicDefault;
			}

			if( match_json.ps ){
				configMap.ps = match_json.ps;
			}else if( match_json.players ){
				configMap.ps = { "players" : match_json.players };
			}else{
				configMap.ps = {};
			}

			if( match_json.qs ){
				configMap.qs = match_json.qs;
			}else{
				configMap.qs = {};
			}


			if( match_json.data ){
				configMap.game = match_json.data.game;
				configMap.topic = match_json.data.topic;
				configMap.match = match_json.data.match;
				configMap.qs = match_json.data.qs;
				configMap.ps = { "players" : match_json.data.players };
			}else if( match_json.match ){
				configMap.match = match_json.match;
			}else{
				configMap.match = matchDefault;
			}

			configMap.match.result = { a : null, b : null };

		}

		configMap.scores = {};

		// Client-side
		configMap.playerLocalPos = {};
		configMap.matchid = configMap.match.id;
		// configMap.matchStatus = 'find';
		configMap.matchStatus = configMap.match.status;
		configMap.currentRound = 1;
		configMap.currentRoundisFin = false;
		configMap.hasAnswered = false;

		// Set local storage value for player
		// later to be changed to localStorage[configMap.plstore.id]
		// if( !localStorage[configMap.plstore.name] ){
		// 	configMap.player.name = 'Kalabaw' + Math.random().toString(36).substr(2,5);
		// 	localStorage[configMap.plstore.name] = configMap.player.name;
		// }
		var nameStr = localStorage[configMap.plstore.name];
		// uncomment this if using LOCALSTORAGE
		configMap.player.username = localStorage[configMap.plstore.username];
		configMap.player.name = nameStr.trim();
		configMap.player.id = localStorage[configMap.plstore.id];
		configMap.player.score = 0;
		configMap.player.place = 'a'; // For solo play
		configMap.ps.players.a.score = 0;

		configMap.isRequested['challengePlayer'] = false;
		configMap.isRequested['acceptChallenge'] = false;
		configMap.isRequested['searchRematch'] = false;

		configMap.req_marker = false;


		// Timer Resets
		configMap.gameTimer.points = 150;
		configMap.resultTimer.currentTime = 1;

		// if( !sessionStorage[configMap.plstore.name] ){
			// comment next line if using LOCALSTORAGE
			// configMap.player.name = 'Kalabaw' + Math.random().toString(36).substr(2,5);
			// sessionStorage[configMap.plstore.name] = configMap.player.name;
		// }

		// configMap.player.name = sessionStorage[configMap.plstore.name];
		console.log(' Current config map ',configMap);

		var reqData = {
			qt_id : configMap.game.id,
			topic_id : configMap.topic.id,
			qnum : 10,
			q_status : 'solo'
		};

		console.log(reqData);

		$.ajax({
			url : configMap.apis.ch_api['api11'],
			data : reqData,
			method : 'post',
			dataType : 'json',
			success : function(response){
				console.log(response);
				configMap.qs = { "questions" : response };
				// setup user_answer for each questions
				var qslen = configMap.qs.questions.length;
				for(var q = 0 ; q < qslen ; q++){
					configMap.qs.questions[q].user_answer = null;
					// configMap.qs.questions[q].ispassed = false;
				}
				// OK
				startTimer(configMap.matchTimer);
			}
		});
	};
	// End Module /initSetup/

	// Start Module /resetSetup/
	// Purpose : resets the App settings
	var resetSetup = function(){
		configMap.game = {};
		configMap.topic = {};
		configMap.ps = {};
		configMap.qs = {};
	};
	// End Module /resetSetup/

	// Start Module /startTimer/
	// Purpose : Executes timer function depending on mode / page
	// Modes : versusDelay, roundDelay, questionDelay, timer
	var startTimer = function(mode){
		mode.timing = setTimeout(function(){
			mode.callback();
		}, mode.delay);
	};
	// End Module /startTimer/

	// Start Module /endTimer/
	// Purpose : Ends timer function depending on mode / page
	// Modes : versusDelay, roundDelay, questionDelay, timer
	var endTimer = function(mode){
		clearTimeout(mode.timing);
	};
	// End Module /endTimer/


	// Start Module /bind/
	// Purpose : Binds click on each option
	var bind = function(){

		// disable everything when modal is active
		if( !configMap.modal.isActive ){

			// Main Play button
			if( $('.btn__play').length ){
				$('.btn__play').unbind('click');
				$('.btn__play').click(function(e){
					e.preventDefault();
					configMap.player.name =  $('#name').val() || 'Kalabaw' + Math.random().toString(36).substr(2,5);
					findMatch();
				});
			}

			if( $('.options').length ){
				$('.options').unbind('click');
				$('.options').click(function(e){
					e.preventDefault();
					checkAnswer($(this));
				});
			}

			if( $('.btn__play-again').length ){
				$('.btn__play-again').unbind('click');
				$('.btn__play-again').click(function(e){
					e.preventDefault();
					// Match for the same players
					findMatch();
				});
			}

			if( $('.btn__stats').length ){
				$('.btn__stats').unbind('click');
				$('.btn__stats').click(function(e){
					e.preventDefault();
					// Displays Statistics page
					renderStats();
				});
			}
		}

		// START : Semi-Global button
		if( $('.game-exit').length ){
			$('.game-exit').unbind('click');
			$('.game-exit').click(function(e){
				e.preventDefault();
				history.go(-1);
			});
		}

		if( $('.game-leave').length ){
			$('.game-leave').unbind('click');;
			$('.game-leave').click(function(e){
				e.preventDefault();
				history.go(-1);
			});
		}
		// END : Semi-Global button

		// START : Results Page Buttons
		if( $('.game-button--again').length ){
			$('.game-button--again').unbind('click');
			$('.game-button--again').click(function(e){
				e.preventDefault();
				// Play Again
				initModule();
			});
		}

		// START : Results Page Buttons
		if( $('.game-button--rematch').length ){
			$('.game-button--rematch').unbind('click');
			$('.game-button--rematch').click(function(e){
				e.preventDefault();
				// Match for another random player
				configMap.req_marker = true;
				renderWaitingRematch();
				// initModule();
			});
		}

		if( $('.game-button--cancel').length ){
			$('.game-button--cancel').unbind('click');
			$('.game-button--cancel').click(function(e){
				e.preventDefault();
				// Cancel Rematch
				destroyWaitingRematch();
				renderResultButtons();
				// add exception to api10;
				callApi10(true);
				startTimer(configMap.resultTimer);
				// Stop waiting
				// initModule();
			});
		}

		if( $('.game-button--random').length ){
			$('.game-button--random').unbind('click');
			$('.game-button--random').click(function(e){
				e.preventDefault();
				// Match for another random player
				// Reset OPEN__TYPE
				localStorage.removeItem(configMap.plstore.mode);
				localStorage.setItem(configMap.plstore.mode, 'random');
				// localStorage[configMap.plstore.mode] = 'random';
				configMap.open_type = 'random';

				// Stop all timers
				freeze();
				callApi10(true);
				// Initialize the game
				initModule();
			});
		}

		if( $('.game-button--leave').length ){
			$('.game-button--leave').unbind('click');
			$('.game-button--leave').click(function(e){
				e.preventDefault();
				callApi10();
			});
		}

		if( $('.result-page__share').length ){
			$('.result-page__share').unbind('click');
			$('.result-page__share').click(function(e){
				e.preventDefault();
				var data = {};
				var players = getPlayerProps();
				var sentence = '';

				players.me.result = (players.me.score > players.op.score) ? 'win' : (players.me.score == players.op.score) ? 'draw' : 'lose' ;
				players.op.result = (players.op.score > players.me.score) ? 'win' : (players.op.score == players.me.score) ? 'draw' : 'lose' ;

				data.topic = configMap.topic;
				data.game = configMap.game;
				data.match = configMap.match;
				data.me = players.me;
				data.op = players.op;

				switch( data.me.result ){
					case 'win': sentence = 'I just defeated '+data.op.name+' in '+data.topic.name+' ('+data.game.name+')!'; break;
					case 'draw': sentence = 'I had a tie with '+data.op.name+' in '+data.topic.name+' ('+data.game.name+')!'; break;
					default : sentence = 'I just lost from '+data.op.name+' in '+data.topic.name+' ('+data.game.name+')!'; break;
				}

				data.sentence = sentence;

				console.log(data);
				var stringdata = jsonToString(data);

				if( configMap.browser === 'ios' ){
					// call iOS share method here
					configMap.bridge.callHandler('share', stringdata);
				}else{
					// Call Android share method here
					Android.share(stringdata);
					Android.shareCompat(stringdata);
				}

			});
		}
		// END : Results Page Buttons

		// Modal Section
		if( $('.pop-up__exit').length ){
			$('.pop-up__exit').unbind('click');
			$('.pop-up__exit').click(function(e){
				e.preventDefault();
				destroyModal();
				// If the user is from the waiting screen
				// Add a screen in the array if exit function is to be executed
				var screensToExit = ['loading', 'waiting-ch', 'findmatch', 'round', 'question'];
				if( screensToExit.indexOf(configMap.currentScreen) !== -1 ){
					// Leave the webview
					callApi10();
				}

				if( configMap.currentScreen !== 'result' ){
					freeze();
				}
				// resetSetup();
				// window.close();
			});
		}

		if( $('.pop-up__close').length ){
			$('.pop-up__close').unbind('click');
			$('.pop-up__close').click(function(e){
				e.preventDefault();
				// freeze();
				destroyModal();
				// window.close();
			});
		}

		if( $('.pop-up__leave--yes').length ){
			$('.pop-up__leave--yes').unbind('click');
			$('.pop-up__leave--yes').click(function(e){
				e.preventDefault();
				// Calls API 10
				// Updates DB match_status = cancelled
				// Updates player isactive status = false
				// Exit the game
				callApi10();
			});
		}

		if( $('.pop-up__leave--no').length ){
			$('.pop-up__leave--no').unbind('click');
			$('.pop-up__leave--no').click(function(e){
				e.preventDefault();
				// Remove modal
				destroyModal();
			});
		}

		if( $('.pop-up__yes').length ){
			$('.pop-up__yes').unbind('click');
			$('.pop-up__yes').click(function(e){
				e.preventDefault();
				// Calls API 3
				// Updates DB match_status = ongoing
				// Starts the game
				callApi3();
			});
		}

		if( $('.pop-up__no').length ){
			$('.pop-up__no').unbind('click');
			$('.pop-up__no').click(function(e){
				e.preventDefault();
				// Closes the window
				// Updates DB match_status = rejected
				callApi4();
				renderResultButtons(true);
			});
		}



		// Bind on Text Twist Sections
		if( $('.text-twist a.buttons').length ){
			$('.text-twist').on('click', 'a.buttons', function(){
				var buttonElem = $(this);
				var answerElem = $('a.blank[data-text="_"]').first();
				var index = $('a.buttons').index(buttonElem);
				var text = buttonElem.attr('data-text');
				
				if(buttonElem.attr('data-text') != "_" && configMap.currentAnswer.indexOf("_") !== -1 ){
					// console.log('button clicked');

					buttonElem.attr('data-text','_').html('');
					answerElem.attr('data-text',text).html(text)
					answerElem.attr('data-sindex', buttonElem.attr('data-sindex'));
					
					configMap.currentAnswer.splice(answer.indexOf("_"), 1, text);
					configMap.currentScram.splice(index, 1, '_');
				}

				$('.text-twist').removeClass('is-invalid');
			});
		}

		if( $('.text-twist a.blank').length ){
			$('.text-twist').on('click', 'a.blank', function(){
				var answerElem = $(this);
				var sIndex = answerElem.attr('data-sindex');
				var buttonElem = $('a.buttons[data-sindex="'+sIndex+'"]');
				var index = $('a.blank').index(answerElem);
				var text = answerElem.attr('data-text');

				if(answerElem.attr('data-text') != "_"){
					answerElem.attr('data-text','_').html('');
					buttonElem.attr('data-text',text).html(text)

					configMap.currentScram.splice(sIndex, 1, text);
					configMap.currentAnswer.splice(index, 1, '_');

					answerElem.removeAttr('data-sindex');
				}

				$('.text-twist').removeClass('is-invalid');
			});
		}

		// Clear answer
		if( $('.game-button--ttclear').length ){
			$('.game-button--ttclear').unbind('click');
			$('.game-button--ttclear').click(function(e){
				e.preventDefault();

				var qslen = configMap.qs.questions[configMap.currentRound - 1].answer.length;
				var resetQ = configMap.currentScramOriginal;

				configMap.currentScram = resetQ.join().split(",");
				resetAnswer(qslen);


				var blanks = genLetters();
				var options = genLetters('buttons');
				var output = $('.text-twist__output').find('.text-twist__list');
				var input = $('.text-twist__input').find('.text-twist__list');

				output.html(App.Templates['options-buttons']({ data : blanks }));
				input.html(App.Templates['options-buttons']({ data : options }));

				$('.text-twist').removeClass('is-invalid');
			});
		}

		// Pass - Go to next unanswered question
		if( $('.game-button--ttpass').length ){
			$('.game-button--ttpass').unbind('click');
			$('.game-button--ttpass').click(function(e){
				e.preventDefault();
				console.log('PASS ------>');

				var all = 0;
				var questions = configMap.qs.questions;
				for( var key in questions ){
					if( questions[key].user_answer !== null ){
						all++;
					}
				}

				if( questions.length - all !== 1  ){
					getNextQuestion();
				}
			});
		}

		// Submit - Go to next unanswered question
		if( $('.game-button--ttsubmit').length ){
			$('.game-button--ttsubmit').unbind('click');
			$('.game-button--ttsubmit').click(function(e){
				e.preventDefault();

				// Sends the current answer
				var answer = configMap.currentAnswer;

				if( answer.indexOf('_') === -1 ){
					checkAnswer();
					$(this).unbind('click');
				}else{
					$('.text-twist').removeClass('is-correct is-wrong');
					$('.text-twist').addClass('is-invalid');
				}

			});
		}

	};
	// End Module /bind/

	// Start Module /bindImage/
	var bindImage = function(){
		if( $('img.image--hasfallback').length ){
			$('img.image--hasfallback').error(function(){
				$(this).attr('src', './assets/images/default-img.png');
			});
		}
	};
	// End Module /bindImage/

	// Start Module /bind/
	// Purpose : Binds click on each option
	var unbind = function(){
		if( $('.options').length ){
			$('.options').unbind('click');
		}
	};
	// End Module /bind/


	// Start Module /checkAnswer/
	// Purpose : Check current answer locally
	var checkAnswer = function(){
		// console.log(input);
		var $twist = $('.text-twist'),
			answer = configMap.currentAnswer.join("").toLowerCase(),
			question = configMap.qs.questions[configMap.currentRound - 1],
			qanswer = question.answer.toLowerCase(),
			pts = 10,
			isCorrect = false;

		console.log(answer, qanswer);

		if(answer === qanswer){
			isCorrect = true;
			// Play sfx
			// configMap.audio.sfx.sfx_correct.play();
			$twist.removeClass('is-invalid is-wrong');
			$twist.addClass('is-correct');
		}else{
			pts = 0;

			// Play sfx
			// configMap.audio.sfx.sfx_incorrect.play();
			$twist.removeClass('is-invalid is-correct');
			$twist.addClass('is-wrong');
		}

		configMap.qs.questions[configMap.currentRound - 1].user_answer = answer;
		// Update Database here
		updateScore(answer, pts, isCorrect);
		unbind();
	};
	// End Module /checkAnswer/

	// Start Module /updateScore/
	// Purpose : Updates score locally and server-side-ly lol!
	var updateScore = function(answer, points, isCorrect){
		// Update codes to server
		// update score locally
		 // score = configMap.player.score || 0, // The Score ... to be changed later
		var player = $('.header__player[data-id="a"]'); // Current Player Container

		// configMap.currentScore[configMap.currentRound - 1] = score;
		if(isCorrect){
			// Update score locally
			var players = configMap.ps.players[configMap.player.place],
				curRound = configMap.currentRound,
				rounds = configMap.qs.questions.length;

			// Double points if last 2 rounds
			// points = (curRound >= rounds - 1) ? parseInt(points, 10) * 2 : points ;

			// for(var key in players){

			// if(players.place == configMap.player.place){
			configMap.ps.players.a.score = configMap.ps.players.a.score + points;
			configMap.player.score = configMap.ps.players.a.score;
			// }
			// }
			// console.log('place -->', players.place, 'score -->', configMap.player.score);
			// Updates the Score container of the Player
			// var total = parseInt(player.find('.player__score').html()) + points;
			player.find('.player__score').html(configMap.player.score);

			// for(var idx in configMap.ps.players){
			// 	if(configMap.ps.players[idx].place == configMap.player.place){
			// 		console.log(configMap.ps.players[idx].score);
			// 		configMap.ps.players[idx].score = total;
			// 		console.log(configMap.ps.players[idx].score);
			// 	}
			// }
		}
		// reserve for later coding
		// insert server side request here hehe
		// var pdata = {
		// 		matchid : configMap.matchid,
		// 		currRound : configMap.currentRound,
		// 		position : configMap.player.place,
		// 		score : points,
		// 		answer : answer
		// 	},
		// 	durl = configMap.apis.base + configMap.apis.api['update-score'];

		// $.ajax({
		// 	url : durl,
		// 	method : 'post',
		// 	data : pdata,
		// 	cache: false,
		// 	success : function(result){
		// 		// configMap.currentRoundisFin = (result['score'].length == 2) ? true : false;
		// 		// console.log('update happened', result);
		// 	},
		// 	error: function(xhr ,t, m){
		// 		console.log('error!');
		// 		// Display error handler
		// 		errorConnectionHandler(xhr, t, m);
		// 	}
		// });
		// update score here -- get score on the other side
		// if the update is complete (with player score and opponent score)
		// mark round as end
		// var complete = true; // this is just a sample

		setTimeout(getNextQuestion, 1000);
	};
	// End Module /updateScore/

	// Start Module /endRound/
	// Purpose : Mark as end round
	var endRound = function(){
		console.log('Score recap -->', configMap.scores);

		configMap.currentRoundCount = 1;

		endTimer(configMap.gameTimer);
		configMap.gameTimer.timing = null;

		var questions = configMap.qs.questions,
			correctAnswer = questions[configMap.currentRound - 1].answer;

		// This shows the Correct answer
		$('.options[data-value="'+correctAnswer+'"]').addClass('btn-success');
		
		configMap.currentRound = configMap.currentRound + 1;
		console.log('END ROUND -->',' Current '+ configMap.currentRound, 'Qlength ' + questions.length);
		configMap.gameTimer.points = 10;
		configMap.roundEndTimer.callback = (configMap.currentRound <= questions.length) ? renderBattlefield : renderResults;
		
		console.log('CALLBACK -->', configMap.roundEndTimer.callback);

		configMap.roundHasEnded = true;
		console.log('roundhas ended on roundend', configMap.roundHasEnded);

		console.log('roundhas ended on renderBattlefield', configMap.roundHasEnded);
		startTimer(configMap.roundEndTimer);

	};
	// End Module /endRound/

	// Start Module /getPlayerProps/
	// Purpose : separated player
	var getPlayerProps = function(){
		var me = configMap.player,
			op = '';
		for(var p in configMap.ps.players){
			if(p != me.place){
				op = configMap.ps.players[p];
			}
		}

		return {
			me : me,
			op : op
		};
	};
	// End Module /getPlayerProps/

	// Start Module /renderStats/
	// Purpose : Displays the statistics of the match
	var renderStats = function(){
		jqueryMap.$main.html(App.Templates['statistics']({}));
	};
	// End Module /renderStats/


	// Start Module /renderResults/
	// Purpose : Displays the result of the match
	var renderResults = function(){

		endTimer(configMap.gameTimer);

		// Reset Modal
		configMap.modal = {};

		// Set screen
		configMap.currentScreen = 'result';

		var players = getPlayerProps(),
			me = players.me,
			op = players.op,
			status, result, oresult;

		// if(me.score > op.score){
		// 	status = 'Yehey!';
		// 	result = 'win';
		// 	oresult = 'lose';
		// }else if(me.score == op.score){
		// 	status = 'It\'s a tie!';
		// 	result = 'draw';
		// 	oresult = 'draw';
		// }else{
		// 	status = 'Boohoo!';
		// 	result = 'lose';
		// 	oresult = 'win';
		// }
		var status = 'Yehey!';
		var result = 'win';

		configMap.player.icon = configMap.ps.players.a.photo_url;

		var playerdata = { me : configMap.player, status : status, result : result };
		var engage = jqueryMap.$main;
		engage.html(App.Templates['results']({ player : playerdata }));

		applyXButton();
		bindImage();
		
		// $('.extra').append('rendered result!<br/>');
		// var resultPage = engage.find('.result-page--parent');
		// var resultButtons = resultPage.find('.result-page__list');
		// configMap.match.result[me.place] = result;
		// configMap.match.result[op.place] = oresult;
		// Reset ENGAGE__MATCH
		localStorage.removeItem(configMap.plstore.mode);
		localStorage.setItem(configMap.plstore.mode, 'random');
		// localStorage[configMap.plstore.mode] = 'random';
		configMap.open_type = 'random';

		// if( !resultButtons.length ){
		renderResultButtons();
		// }

		bindImage();

		// bind();
		
		// Reset States here
		// initSetup();
		// to be safe on refreshing
		
		// callApi9();
		// startTimer(configMap.resultTimer);
	};
	// End Module /renderResults/

	// Start Module /renderModal/
	// Purpose : Displays an info modal
	var renderModal = function(){
		var $container = jqueryMap.$main;
		var $modal = $container.find('.pop-up');

		// to avoid clicking back again
		history.go(1);
		
		if( !$modal.length ){
			$container.append(App.Templates['modal']({ modal : configMap.modal }));
			bind();
		}
	};
	// End Module /renderModal/

	// Start Module /destroyModal/
	var destroyModal = function(){
		var $container = jqueryMap.$main;
		var $modal = $container.find('.pop-up');

		configMap.modal = {};

		if( $modal.length ){
			$modal.fadeOut(250, function(){
				$(this).remove();
			});
		}
	};
	// End Module /destroyModal/

	// Start Module /renderResultButtons/
	var renderResultButtons = function(type){
		var $container = jqueryMap.$main;
		var $result = $container.find('.result-page--parent');
		var $rematch = $result.find('.rematch');
		var $buttons = $result.find('.result-page__list');
		var buttons = [];

		var players = getPlayerProps(),
			me = players.me;

		var myResult = configMap.match.result[me.place];

		if( $rematch.length ){
			$rematch.remove();
		}

		if( $buttons.length ){
			$buttons.remove();
		}

		// if( !type && myResult === 'lose'){
		// 	buttons.push({
		// 		type : 'rematch',
		// 		color : 'light-blue',
		// 		caption : 'Rematch'
		// 	});
		// }else{
		// 	var caption = 'Waiting for a rematch...';
		// 	var resultTitle = $('.result-page__title').text();

		// 	if( resultTitle.toLowerCase() == 'boohoo!' ){
		// 		caption = 'Opponent has left the game';
		// 	}

		// 	buttons.push({
		// 		type : 'parag',
		// 		caption : caption,
		// 		pclass : 'result-page__notify'
		// 	});
		// }

		// buttons.push({
		// 	type : 'random',
		// 	color : 'blue-green',
		// 	caption : 'Another Opponent'
		// });
		buttons.push({
			type : 'again',
			color : 'light-blue',
			caption : 'Play Again'
		});

		buttons.push({
			type : 'leave',
			color : 'red',
			caption : 'Leave game'
		});


		$result.append(App.Templates['results-buttons']({ buttons : buttons }));
		bind();
		// $('.extra').append('render result buttons<br />');

	};
	// End Module /renderResultButtons/

	// Start Module /destroyWaitingRematch/
	// Purpose : Removes the waiting section inside the Result page
	var destroyWaitingRematch = function(){
		console.log('destroying Waiting section');

		var $container = jqueryMap.$main;
		var $waiting = $container.find('.rematch');

		if( $waiting.length ){
			endTimer(configMap.waitTimer);
			$waiting.remove();
		}
	};
	// End Module /destroyWaitingRematch/
	// Start Module /renderWaitingRematch/
	// Purpose : Displays the waiting section inside the Result page
	var renderWaitingRematch = function(){
		// Abort search rematch
		console.log('xhrRequests should be aborted here');
		// configMap.xhrRequests['searchRematch'].abort();

		console.log('rendering Waiting section');

		// Set screen
		configMap.currentScreen = 'waiting-rm';

		// Set time to start
		configMap.waitTimer.currentTime = 0;

		var $container = jqueryMap.$main;
		var time = configMap.waitTimer.currentTime;
		var con = $container.find('.result-page--parent');
		var buttons = con.find('.result-page__list');
		var rematch = con.find('.rematch');

		if( rematch.length ){
			rematch.remove();
		}

		buttons.remove();
		con.append(App.Templates['waiting-rematch']({ time : time }));
		endTimer(configMap.resultTimer);


		// Check if there is an existing rematch request
		var data = {
			match_id : configMap.match.id,
			player_a : configMap.ps.players.a.username,
			player_b : configMap.ps.players.b.username
		};


		// Call API 7: checking for an existing rematch
		$.ajax({
			url : configMap.apis.ch_api['api7'],
			data : data,
			method : 'post',
			cache: false,
			success : function(result){
				// configMap.xhrRequests['searchRematch'].abort();
				console.log('API 7 existing rematch check -->', result);
				console.log('Active Ajax -->', $.ajax.active);
				if( result.rematch === true){
					// Set the current match to the rematch id
					configMap.match = result.match;
					configMap.match.result = { "a" : null, "b" : null };
					// then call api3 to accept rematch
					callApi3();
				}else{
					// Call Api1 to create a rematch
					callApi1();
				}
			},
			error : function(xhr, t, m){
				// Display error handler
				errorConnectionHandler(xhr, t, m);
			}
		});
	};
	// End Module /renderWaitingRematch/


	// Start Module /callApi1/
	// Purpose : Challenging a player
	var callApi1 = function(){
		var data = {
			topic_id : configMap.topic.id,
			game_id : configMap.game.id,
			player_a : configMap.ps.players.a.username,
			player_b : configMap.ps.players.b.username
		};

		// Set this to say that the challengePlayer has been requested
		// Currently a countermeasure in the issue of /searchRematch/ activating
		// even if the resultTimer has been ended.
		
		// Call API 1
		$.ajax({
			url : configMap.apis.ch_api['api1'],
			method : 'post',
			data : data,
			cache: false,
			success : function(result){
				// Setup all new data
				console.log('API 1 ito!!! ---> ', result);
				var obj = result;
				var objData = obj.data;

				result.ps = {
					'players' : result.players
				};

				localStorage[configMap.plstore.match] = jsonToString(result);
				// Reset ENGAGE__MATCH
				localStorage.removeItem(configMap.plstore.mode);
				localStorage.setItem(configMap.plstore.mode, 'challenger');
				// localStorage[configMap.plstore.mode] = 'challenger';
				configMap.open_type = 'challenger';

				initSetup();
				bind();
				startTimer(configMap.waitTimer);
			},
			error : function(xhr, t, m){
				// Display error handler
				errorConnectionHandler(xhr, t, m);
			}
		});
	};
	// End Module /callApi1/

	// Start Module /callApi3/
	// Purpose : Accepting a challenge
	var callApi3 = function(){
		var data = {
			topic_id : configMap.topic.id,
			game_id : configMap.game.id,
			player_a : configMap.ps.players.a.username,
			player_b : configMap.ps.players.b.username,
			match_status : 'ongoing',
			match_id : configMap.match.id
		};

		// Set this to say that the challengePlayer has been requested
		// Currently a countermeasure in the issue of /searchRematch/ activating
		// even if the resultTimer has been ended.
		configMap.isRequested['acceptChallenge'] = true;

		// remove Modal
		destroyModal();

		// Call API 3
		$.ajax({
			url : configMap.apis.ch_api['api3'],
			method : 'post',
			data : data,
			cache: false,
			success : function(response){
				if( response.response_code === 0){
					var result = response.data;
					// Setup all new data
					console.log('API 3 ito!! ---> ', result);

					localStorage[configMap.plstore.match] = jsonToString(result);
					localStorage.removeItem(configMap.plstore.mode);
					localStorage.setItem(configMap.plstore.mode, 'join');
					// localStorage[configMap.plstore.mode] = 'join';
					configMap.open_type = 'join';
					
					destroyModal();
					initModule();
				}else{
					// Display error handler
					// Considered as match has been cancelled
					configMap.modal.title = "Uh ohh...";
					configMap.modal.message = "Your opponent cancelled the rematch.";
					configMap.modal.buttons = {
						"exit" : { "caption" : "Close", "class" : "pop-up__exit is-yellow" }
					};
					configMap.modal.isActive = true;

					renderModal();

					var $resultButtons = $('.result-page__list');
					var $parag = $resultButtons.find('p');
					var optext = 'Opponent has left the game';
					if( $parag.length ){
						$parag.text(optext);
					}else{
						$resultButtons.prepend($('<p>'+optext+'</p>'));
					}
				}
			},
			error : function(xhr, t ,m){
				// Display error handler
				// Considered as match has been cancelled
				configMap.modal.title = "Uh ohh...";
				configMap.modal.message = "Your opponent cancelled the rematch.";
				configMap.modal.buttons = {
					"exit" : { "caption" : "Close", "class" : "pop-up__exit is-yellow" }
				};
				configMap.modal.isActive = true;
				console.log(t,m);

				renderModal();

				var $resultButtons = $('.result-page__list');
				var $parag = $resultButtons.find('p');
				var optext = 'Opponent has left the game';
				if( $parag.length ){
					$parag.text(optext);
				}else{
					$resultButtons.prepend($('<p>'+optext+'</p>'));
				}
				//errorConnectionHandler(xhr, t, m);
			}
		});

		endTimer(configMap.resultTimer);
	};
	// End Module /callApi3/

	// Start Module /callApi4/
	// Purpose : Rejecting a challenge
	var callApi4 = function(){
		var data = {
			match_id : configMap.match.id,
			match_status : 'reject'
		};

		// remove Modal
		destroyModal();

		// Call API 4
		$.ajax({
			url : configMap.apis.ch_api['api4'],
			method : 'post',
			data : data,
			cache: false,
			success : function(result){
				console.log(result);
			}
		});
	};
	// End Module /callApi4/

	// Start Module /callApi9/
	// Purpose : End of Match
	var callApi9 = function(){
		// match_id, player_id, game_id, topic_id, match_result, xp_points
		var players = getPlayerProps();
		var me = players.me;

		var data = {
			match_id : configMap.matchid,
			player_id : configMap.player.username,
			player_type : me.place,
			game_id : configMap.game.id,
			topic_id : configMap.topic.id,
			result : configMap.match.result[me.place],
			xp_points : me.score
		};

		// Call API 9
		$.ajax({
			url : configMap.apis.ch_api['api9'],
			method : 'post',
			data : data,
			cache: false,
			success : function(response){
				console.log(response);
				var result = response.data;
				console.log(result);
				if( typeof result != 'string'){
					// Start listing achievements and badges earned
					var expected = ['achievement_wins', 'achievement_score', 'badge'];
					var list = [];
					var ei = 0;
					var ex_len = expected.length;

					for(ei ; ei < ex_len ; ei++){
						var currResult = result[expected[ei]];
						if( currResult ){
							switch( expected[ei] ){
								case "badge" :
									list.push({
										title : currResult.badge,
										desc : 'Badge'
									});
								break;
								default:
									if( !currResult.message ){
										list.push({
											title : currResult.name,
											desc : currResult.description
										});
									}
								break;
							}
						}
					}

					configMap.modal.title = "Achievement Unlocked!";
					configMap.modal.list = list;
					configMap.modal.hasclosebtn = true;
					configMap.modal.isAchievement = true;
					configMap.modal.buttons = {
						"ok" : { "caption" : "Close", "class" : "pop-up__leave--no is-yellow" }
					};
					configMap.modal.isActive = true;
					renderModal();
				}
			},
			error : function(xhr, t, m){
				// Display error handler
				errorConnectionHandler(xhr, t, m);
			}
		});
	};
	// End Module /callApi9/

	// Start Module /callApi10/
	// Purpose : Leaving the game
	var callApi10 = function(exception){
		// var data = {
		// 	match_id : configMap.matchid,
		// 	player_id : configMap.player.username,
		// 	player_place : configMap.player.place || 'a'
		// };
		var browser = configMap.browser;

		// var callback = function(browser){

			// console.log('num of active ajax', $.ajax.active);

			if( browser === 'ios' ){
				// insert ios exit webview here
				// call ios bridge
				// console.log(configMap.bridge);
				configMap.bridge.callHandler('dismissViewController', '{a:"a",b:"b"}');
			}else{
				// call android  leave method
				Android.leave();
				Android.leaveCompat();
			}
		// };

		console.log(data);
		// remove Modal
		var screens = ['waiting-rm','result'];

		// if( screens.indexOf(configMap.currentScreen) == -1 ){
			destroyModal();
		// }

		// if( data.match_id !== 0 ){
		// 	// Call API 10
		// 	$.ajax({
		// 		url : configMap.apis.ch_api['api10'],
		// 		method : 'post',
		// 		data : data,
		// 		cache: false,
		// 		success : function(result){

		// 			// Call for the Android close webview
		// 			// Android.leave();
		// 			freeze();
		// 			console.log('you have left -- complete details');

		// 			// Call for the iOS close webview
		// 			// closeWindowFeature;
		// 			if(!exception){
		// 				callback(configMap.browser);
		// 			}
		// 		},
		// 		error : function(xhr, t, m){
		// 			// Display error handler
		// 			errorConnectionHandler(xhr, t, m);
		// 		}
		// 	});
		// }else{
		// 	// In the midst of joining a match
		// 	// no match id yet. so nothing to update
		// 	freeze();
		// 	console.log('you have left -- joining');
		// 	// closeWindowFeature;
		// 	callback(configMap.browser);
		// }
	};
	// End Module /callApi10/

	// Start Module /renderWaiting/
	// Purpose : Displays the waiting page when the user has sent a challenge request
	var renderWaiting = function(){
		console.log('rendering Waiting Page ---->');

		var $container = jqueryMap.$main;
		var time = configMap.waitTimer.currentTime;
		var $con = $container;

		configMap.currentScreen = 'waiting-ch';

		$container.html(App.Templates['waiting']({time : time, topic : configMap.topic }));
		applyXButton();

		startTimer(configMap.waitTimer);
	};
	// End Module /renderWaiting/

	// Start Module /waitTimer/
	// Purpose : Increase time and format to minutes
	var renderTimer = function(){
		var time = configMap.waitTimer.currentTime;
		time++;
		configMap.waitTimer.currentTime = time;

		var $container = jqueryMap.$main;
		var $timer = $container.find('.waiting-screen__timer, .rematch__time');

		$timer.html(App.Templates['waiting-timer']({ time : configMap.waitTimer.currentTime }));
		
		// Every 2 seconds get an update form server
		if( time % 2 === 0 ){
			getMatchStatus();
		}
		// else if( configMap.currentScreen == 'waiting-rm' && time % 30 === 0){
		// 	getMatchStatus();
		// }

		endTimer(configMap.waitTimer);
		startTimer(configMap.waitTimer);
	};
	// End Module /waitTimer/

	// Start Module /checkStatuses/
	// Purpose : continually checks the statuses of the player
	var checkStatuses = function(){

		// var matchid = configMap.match.id;
		var data = {
			player_a : configMap.ps.players.a.username,
			player_b : configMap.ps.players.b.username
		};

		console.log('checking statuses');
		console.log('isrequested', configMap.isRequested);

		endTimer(configMap.resultTimer);
		
		var rtime = configMap.resultTimer.currentTime;
		configMap.resultTimer.currentTime = rtime + 1;

		startTimer(configMap.resultTimer);

		console.log('TIMER RESULT _----->', configMap.resultTimer.currentTime);
		

		var resulttime = configMap.resultTimer.currentTime;

		// Every 5 second check for rematch
		if( resulttime % 5 === 0 ){
			// Avoid bubbling ajax calls
			if( configMap.checkStatuses !== null ){
				configMap.checkStatuses.abort();
				configMap.checkStatuses = null;
			}

			// Call api 8
			configMap.checkStatuses = $.ajax({
				method : 'post',
				url : configMap.apis.ch_api['api8'],
				// url : configMap.apis.base + configMap.apis.api['check-statuses'],
				data : data,
				cache: false,
				success : function(result){
					console.log(result);
					if( configMap.req_marker === false ){
						if( result ){
							var newMatch = result.match;
							var rematch = result.rematch;

							if( rematch == "true" ){
								// This is viewed by the winner
								// Render a modal -- a rematch has been detected
								configMap.modal.title = "Up for another?";
								configMap.modal.message = "Your opponent wants a rematch.";
								configMap.modal.isprompt = true;
								configMap.modal.buttons = {
									"no" : { "caption" : "No", "class" : "pop-up__no is-yellow" },
									"yes" : { "caption" : "Yes", "class" : "pop-up__yes" }
								};
								configMap.modal.isActive = true;

								configMap.match = newMatch;
								configMap.match.result = { "a" : null, "b" : null };
								renderModal();

								// delete text "waiting for rematch..."
								var $resultButtons = $('.result-page__list');
								$resultButtons.find('p').text('');

							}else{

								// 20 seconds to assume other player has left the game
								if( configMap.resultTimer.currentTime > 20 ){
									// This is viewed by the loser
									// startTimer(configMap.resultTimer);
									// Player has left the Game
									var $rematchBtn = $('.game-button--rematch');
									var $notify = $('.result-page__notify');
									var $list = $('.result-page__list');
									$rematchBtn.unbind('click');
									$rematchBtn.remove();
									if( $notify.length ){
										// $notify.addClass('is-red');
										$notify.text('Opponent has left the game');
									}else{
										$list.prepend('<p class="result-page__notify">Opponent has left the game</p>');
									}

									// Leave the match
									callApi10(true);
								}
							}
						}
					}
				},
				error : function(xhr, t, m){
					// Display error handler
					// errorConnectionHandler(xhr, t, m);
				}
			});

		}

		// configMap.xhrRequests['searchRematch']();

	};
	// End Module /checkStatuses/


	// CALLING API 2
	// Start Module /getMatchStatus/
	// Purpose : To get the match status
	// Access Mode : Challenger
	var getMatchStatus = function(){

		var data = {
			match_id : configMap.match.id//,
			// name : configMap.player.name
		};
		
		// Avoid bubbling ajax calls
		if( configMap.getMatchStatus !== null ){
			configMap.getMatchStatus.abort();
			configMap.getMatchStatus = null;
		}


		configMap.getMatchStatus = $.ajax({
			method : 'post',
			url : configMap.apis.ch_api['api2'],
			// url : configMap.apis.base + configMap.apis.api['get-match-status'],
			data : data,
			cache: false,
			success : function(response){
				var result = response.data;
				console.log(data, result, configMap.match);
				if( result.match.status ){
					var status = result.match.status;
					
					if( status == 'ongoing' ){
						// Set to local configuration
						configMap.match.status = status;

						// End Timer
						endTimer(configMap.waitTimer);

						// Render VS
						renderVS();
					}else if( status == 'reject' ){

						// Reset to random for refresh purposes
						// Reset ENGAGE__MATCH
						localStorage.removeItem(configMap.plstore.mode);
						localStorage.setItem(configMap.plstore.mode, 'random');
						// localStorage[configMap.plstore.mode] = 'random';
						configMap.open_type = 'random';

						// End Timer
						endTimer(configMap.waitTimer);

						// Set to local configuration
						configMap.match.status = status;

						var modalCloseBtn = 'pop-up__leave--no';
						if( configMap.currentScreen === 'waiting-ch' ){
							modalCloseBtn = 'pop-up__exit';
						}

						// Render Modal
						destroyModal();
						configMap.modal.title = "Awww...";
						configMap.modal.message = "Your opponent did not accept your challenge."
						configMap.modal.isActive = true;
						configMap.modal.buttons = {
								"back" : { "caption" : "Close", "class" : modalCloseBtn+" is-yellow" }
							};
						renderModal();

						destroyWaitingRematch();
						renderResultButtons(true);
					}else{
						// If 30 secs has past, leave and cancel
						if( configMap.waitTimer.currentTime >= 30){

							destroyModal();

							configMap.modal.title = "Uh oh...";
							configMap.modal.message = "Your opponent has left the game.";
							configMap.modal.isActive = true;
							configMap.modal.buttons = {
									"back" : { "caption" : "Close", "class" : "pop-up__leave--no is-yellow" }
								};
							renderModal();

							destroyWaitingRematch();
							renderResultButtons(true);

							callApi10(true);
						}
					}

				}else{
					console.log(result);
				}
			},
			error : function(xhr, t, m){
				// Display error handler
				errorConnectionHandler(xhr, t, m);
			}
		});
	};
	// End Module /getMatchStatus/


	// Start Module /renderBattlefield/
	// Purpose : Displays the current round of the match
	// Modes : versusDelay, roundDelay, questionDelay, timer
	var renderBattlefield = function(){
		console.log('rendering Battlefield --->', configMap.currentRound);

		// Reset Modal
		configMap.modal = {};

		configMap.currentScreen = 'round';
		// render Header
		var $container = jqueryMap.$main,
			$header = jqueryMap.$header,
			$ingame = jqueryMap.$ingame,
			questions = configMap.qs.questions,
			// round = (configMap.currentRound == questions.length) ? 'final' : configMap.currentRound;
			roundText = "Get Ready!";
		
		$container.html($header.html(App.Templates['header']({player : configMap.ps.players.a, game : configMap.gameTimer})));
		
		// configMap.hasAnswered = false;
		configMap.roundHasEnded = false;
		// render Round
		$container.append($ingame.html(App.Templates['round']({round : roundText, topic : configMap.topic })));
		
		// Play sound
		// roundCaller(round);
		bind();
		bindImage();

		endTimer(configMap.matchTimer);
		startTimer(configMap.roundTimer);
	};
	// End Module /renderBattlefield/


	// Start Module /renderVS/
	// Purpose : displays the Versus page
	// First Step that will happen after launching
	var renderVS = function(){
		console.log('rendering Versus ---->');

		// Fix badge no result
		// var abadge = configMap.ps.players.a.badge;
		// var bbadge = configMap.ps.players.b.badge;
		
		// configMap.ps.players.a.badge = (abadge.toLowerCase() == 'no result' ) ? 'Baguhan' : abadge;
		// configMap.ps.players.b.badge = (bbadge.toLowerCase() == 'no result' ) ? 'Baguhan' : bbadge;

		// Reset Modal
		configMap.modal = {};
		
		// Set screen
		configMap.currentScreen = 'versus';

		// var players = configMap.ps.players;
		configMap.ps.players.a.icon = configMap.ps.players.a.photo_url;
		var player = configMap.ps.players.a;//name;

		// var player_a = configMap.match.isactive.a;
		// var player_b = configMap.match.isactive.b;

		// if( player_a !== "true" && player_b !== "true" && localStorage[configMap.plstore.mode] == "join"){
		// 	// Render Modal
		// 	configMap.modal.title = "Uh oh...";
		// 	configMap.modal.message = "Your opponent has left the game.";
		// 	configMap.modal.isActive = true;
		// 	configMap.modal.buttons = {
		// 		"back" : { "caption" : "Leave game", "class" : "pop-up__exit is-yellow" }
		// 	};
		// 	renderModal();
		// }else{
			
		// 	// Find current player and set his place/position
		// 	for(var key in players){
		// 		if (players.hasOwnProperty(key)){
		// 			if(players[key].name == player){

		// 				console.log(' LEFT SIDE : ', player);
		// 				configMap.playerLocalPos.left = players[key];
		// 				// configMap.player = players[key];
		// 				// Set final value for player inside the local storage
		// 				// include player id here later........
		// 				// uncomment me later....
		// 				// localStorage[configMap.plstore.name] = configMap.player.name;
		// 				// sessionStorage[configMap.plstore.name] = configMap.player.name;
		// 				configMap.player.place = players[key].place;
		// 				configMap.player.badge = players[key].badge;
		// 				configMap.player.icon = players[key].icon;
		// 			}else{
		// 				console.log(' RIGHT SIDE : ', players[key]);
		// 				configMap.playerLocalPos.right = players[key];
		// 			}
		// 		}
		// 	}
			// var checkMyPos = function(){
			// 	var me = configMap.player;
			// 	var op = '';

			// 	for( var p in configMap.ps.players){
			// 		if( p !== '' ){

			// 		}
			// 	}
			// };

			// var players = getPlayerProps();
			// var me = players.me;
			// var op = players.op;

			// configMap.playerLocalPos.left = me;
			// configMap.playerLocalPos.right = op;

			console.log('PLAYERS --> ', configMap.playerLocalPos);

			jqueryMap.$main.html(App.Templates['versus']({player : player }));

			// Play sfx
			// configMap.audio.sfx.bg_random.stop();
			// configMap.audio.sfx.sfx_versus.play();
			bindImage();

			// startTimer(configMap.matchTimer);
		// }
	};
	// End Module /renderVS/

	// Start Module /renderQuestion/
	// Purpose : displays the Question
	var renderQuestionWaiting = function(){
		console.log('rendering Question ---->');
		// Set screen
		configMap.currentScreen = 'question-wt';
		var $container = jqueryMap.$ingame.html($('<div class="text-twist"/>'));

		$container.find('.text-twist').html(App.Templates['question-waiting']({}));
	};
	// End Module /renderQuestion/

	// Start Module /renderQuestion/
	// Purpose : displays the Question
	var renderQuestion = function(){
		console.log('rendering Question ---->');
		// Set screen
		configMap.currentScreen = 'question';

		var q = configMap.qs.questions[configMap.currentRound - 1],
			// Add is-correct in class if correct;
			$container = jqueryMap.$ingame.html($('<div class="text-twist"/>'));

		q.round = configMap.currentRound;
		q.maxround = configMap.qs.questions.length;

		//var $question = $('<div class="ingame__question" />');
		//var $image = $('<div class="ingame__image" />');
		var $options = $('<div class="ingame__options" />');
		// var $main = ( !q.image ) ? $question : $image;

		$container.find('.text-twist').html(App.Templates['question']({ data : q, imagepath : qimagePath }));
		// $container.append($options);

		endTimer(configMap.roundTimer);
		startTimer(configMap.questTimer);
	};
	// End Module /renderQuestion/


	// Start Module /renderOptions/
	// Purpose : displays the choices for the question
	var renderOptions = function(){
		console.log('rendering Options ---->');
		
		console.log('reset answer');
		
		var q = configMap.qs.questions[configMap.currentRound - 1],
			$container = jqueryMap.$ingame;

		// var optionClass = (q.image) ? 'ingame__options--half' : 'ingame__options--full';

		// GET THE SHUFFLED LETTERS HERE
		var question = q.answer;

		resetAnswer(question.length);
		question += addRandomChars(question.length);
		
		var shuffled = question.shuffle();
		configMap.currentScram = shuffled;

		var unshuffle = shuffled.join();
		configMap.currentScramOriginal = unshuffle.split(",");


		var blankLetters = genLetters();
		var optionLetters = genLetters('buttons');
		var data = {
			blanks : blankLetters,
			options : optionLetters
		};

		console.log(data);

		$container.find('.text-twist').append(App.Templates['options']({ data : data }));
		bind();
		endTimer(configMap.questTimer);

		if( configMap.gameTimer.points  === 150){
			startTimer(configMap.gameTimer);
		}
	};
	// End Module /renderOptions/

	// Start Module /renderLanding/
	// Purpose : Displays Initial Page
	var renderLanding = function(){
		jqueryMap.$main.html(App.Templates['landing']());
		bind();
	};
	// End Module /renderLanding/

	// Start Module /renderUpdatedScore/
	// Purpose : Displays the updated score that came from the server
	var renderUpdatedScore = function(data){
		// Accumulate point updates from server
		// for(var cpos in configMap.ps.players){
		// 	var totalScore = 0;

		// 	for(var rpos in configMap.scores ){
		// 		for(var ipos in configMap.scores[rpos]){
		// 			if(cpos == ipos){
		// 				totalScore = totalScore + parseInt(configMap.scores[rpos][ipos].score,10);
		// 			}
		// 		}
		// 	}

		// 	configMap.ps.players[cpos].score = totalScore;
		// }
		var players = getPlayerProps();
		var me = players.me;
		var op = players.op;

		console.log(data);

		configMap.ps.players[me.place].score = data[me.place].score;
		configMap.ps.players[op.place].score = data[op.place].score;

		console.log(configMap.ps.players, players);

		$('.header__player[data-id="'+me.place+'"]').find('.player__score').html(configMap.ps.players[me.place].score);
		$('.header__player[data-id="'+op.place+'"]').find('.player__score').html(configMap.ps.players[op.place].score);

		// $.each($('.header__player'), function(){
		// 	var id = $(this).data('id');
		// 	// console.log('scores --->', id, configMap.ps.players[id].score);
		// 	$(this).find('.player__score').html(configMap.ps.players[id].score);
		// });

		// Render Result after the match has finished
		if( data[me.place].isfinished && data[op.place].isfinished ){
			renderResults();
		}

	};
	// End Module /renderUpdatedScore/


	// ====================== SERVER METHODS ======================
	// Start Module /getUpdates/
	// Purpose : Check server for updates
	var getUpdates = function(){
		// console.log('getUpdates ---->', configMap.scores);

		configMap.gameTimer.points = configMap.gameTimer.points - 1;

		endTimer(configMap.gameTimer);
		startTimer(configMap.gameTimer);

		if (configMap.gameTimer.points >= 0 && configMap.gameTimer.timing !== null){
			$('.header__points').html(App.Templates['header-points']({ game : configMap.gameTimer }));

			if(configMap.gameTimer.points === 0){
				// if(!configMap.hasAnswered){
				// 	checkAnswer();
				// }
				// End match over here
				renderResults();
			}

		}else if(configMap.gameTimer.points < 0){
			unbind();
		}

		console.log('current round!!! --> ', configMap.currentRound );

		// Update from server here
		// if( configMap.gameTimer.points % 5 === 0){
		// 	var uurl = configMap.apis.base + configMap.apis.api['get-updates'],
		// 		udata = {};

		// 		udata.matchid = configMap.matchid;
		// 		// udata.currRound = configMap.currentRound;

		// 	$.ajax({
		// 		url : uurl,
		// 		method : 'post',
		// 		data : udata,
		// 		dataType : 'json',
		// 		cache: false,
		// 		success : function(result){

		// 			// if( configMap.roundHasEnded === false ){
		// 				// var count = configMap.currentRoundCount;

		// 				// configMap.scores[configMap.currentRound] = result;
		// 				// console.log(configMap.matchid, configMap.player.name);

		// 				// resLen = 0;
		// 				// for(var i in result){
		// 				// 	resLen++;
		// 				// }

		// 				// configMap.currentRoundisFin = (resLen == 2) ? true : false;
						
		// 				// console.log('results and shit ---->');
		// 				// console.log(result.score);
		// 				// console.log(configMap.currentRoundisFin, configMap.scores);
		// 				// if( count >= (configMap.maxScorePerRound * 1.5) ){
		// 				// if( count >= (configMap.maxScorePerRound * 1) ){
		// 				// 	configMap.modal.title = "Uh oh...";
		// 				// 	configMap.modal.message = "Your opponent has left the game.";
		// 				// 	configMap.modal.buttons = {
		// 				// 		"back" : { "caption" : "Leave game", "class" : "pop-up__leave--yes is-yellow" }
		// 				// 	};
		// 				// 	configMap.modal.isActive = true;

		// 				// 	renderModal();
		// 				// }

		// 				// count++;
		// 				// configMap.currentRoundCount = count;

		// 				// console.log('scores ------> ', configMap.scores);

		// 				// if( configMap.currentRoundisFin ){
		// 					// show opponent's answer
		// 					// var players = getPlayerProps();
							
		// 					// console.log('players ----->', players);
		// 					// console.log('score for the round ---->', configMap.scores[configMap.currentRound]);

		// 					// var oppP = players.op.place,
		// 					// 	oppA = configMap.scores[configMap.currentRound][oppP].answer,
		// 					// 	gq = configMap.qs.questions[configMap.currentRound - 1], // GameQuestion
		// 					// 	ga = gq.answer; // GameAnswer

		// 					// if( oppA !== ""){
		// 					// 	var buttonAnswer = $('.options[data-value="'+oppA+'"]');
		// 					// 	if( ga == oppA ){
		// 					// 		buttonAnswer.addClass('btn-success');
		// 					// 	}else{
		// 					// 		buttonAnswer.addClass('btn-danger');
		// 					// 	}

		// 					// 	var newAnswer = $('<span/>');
		// 					// 	newAnswer.addClass('answer-opponent');

		// 					// 	buttonAnswer.append(newAnswer);
		// 					// }

		// 					// show updated scores
		// 					renderUpdatedScore(result);
							
		// 					// ends the round and start a new
		// 					// endRound();
		// 					// console.log('fudge!', configMap.currentRoundisFin);
		// 				// }
		// 			// }
		// 		},
		// 		error : function(xhr, t, m){
		// 			console.log('oh noe!');
		// 			// Display modal
		// 			errorConnectionHandler(xhr, t, m);
		// 		}
		// 	});

		// 	// configMap.xhrRequests['getUpdates']();
		// }
	};
	// End Module /getUpdates/

	// Start Module /initPlayers/
	// Purpose : set the states of the players
	// var initPlayers = function(){

	// };
	// End Module /initPlayers/

	// Start Module /getFile/
	// Purpose : retrieve json files depending on "mode"
	// Modes : ps -> players.json, qs -> questions.json etc. 
	var getFile = function(mode, callback){
		var urls = {
				'ps' : {
					url : configMap.apis.base + configMap.apis.api.players,
					udata : {
						matchid : configMap.matchid
					}
				},
				'qs' : {
					// url : 'http://admin:1234@192.168.20.75/engage/api/mchoice/dtl/id/quiz/format/json',
					url : configMap.apis.base + configMap.apis.api.questions,
					udata : {
						'topic_id' : configMap.topic.id,
						'qt_id' : configMap.game.id,
						'qnum' : 10,
						'is_solo' : false
					}
				}
			},
			data = (urls[mode].udata) ? urls[mode].udata : {},
			url = urls[mode].url;

		$.ajax({
			url : url,
			method : 'post',
			data : data,
			cache: false,
			success : function(result){
				console.log('PS has been called', result);
				configMap[mode] = result;
				if( mode === 'ps' ){
					configMap.match.isactive = {
						'a' : result.players.a.isactive,
						'b' : result.players.b.isactive
					};

					configMap.match.result = {
						'a' : null,
						'b' : null
					};
				}

				console.log(mode, configMap[mode]);
				if(typeof callback == 'function'){
					callback();
				}
			},
			error : function(xhr, t, m){
				console.log('fudge on loading profiles! ', xhr);
				// Display error handler
				errorConnectionHandler(xhr, t, m);
			}
		});
	};
	// End Module /getFile/

	// Start Module /createMatch/
	// Purpose : started when no available room
	// var createMatch = function(){
	// 	console.log('Create a match ---->');

	// 	configMap.matchStatus = 'create';
	// 	// configMap.findMatchTimer.callback = waitCallback('create');
	// 	startTimer(configMap.findMatchTimer);
	// };
	// End Module /createMatch/

	var applyXButton = function(){
		// Close Button
		var xbutton = $('<a class="game-exit"></a>').html(App.Templates['button-exit']());
		jqueryMap.$main.append(xbutton);
		bind();
	};

	// Start Module /findMatch/
	// Purpose : After Clicking play, creates/joins a match
	var findMatch = function(){
		console.log('Find a match ---->');
		configMap.matchStatus = 'find';

		configMap.currentScreen = 'findmatch';
		// Play sound
		// configMap.audio.sfx.bg_random.play();
		jqueryMap.$main.html(App.Templates['loading']());
		applyXButton();

		configMap.matchid = 0; 

		configMap.findMatchTimer.callback = waitCallback;
		startTimer(configMap.findMatchTimer);
	};
	// End Module  /findMatch/

	// Start Module /waitMatch/
	// Purpose : started when no available room
	var waitMatch = function(){
		console.log('waiting a match ---->');

		configMap.matchStatus = 'wait';
		// configMap.findMatchTimer.callback = waitCallback('create');
		startTimer(configMap.findMatchTimer);
	};
	// End Module /waitMatch/

	// Start Module /waitCallback/
	// Purpose : called when finding / creating a match
	var waitCallback = function(){
		var urls = configMap.apis.api,
			base = configMap.apis.base,
			data = {
				name : configMap.player.username,
				// name : configMap.player.name,
				matchid : configMap.matchid,
				topic_id : configMap.topic.id,
				qt_id : configMap.game.id
			},
			timer = configMap.findMatchTimer;

		console.log('configmap player -->',configMap.player);
		console.log('username -->', configMap.player.username, 'match_status ' + configMap.matchStatus);

		if(timer.currentTries <= timer.maxTries){
			$.ajax({
				url : base + urls[configMap.matchStatus],
				method : 'POST',
				data : data,
				cache: false,
				success : function(result){
					if( configMap.matchStatus === 'find' ){
						// Load Quesitons
						// UNCOMMENT THIS LATER
						configMap.qs = result.qs;

						// setup user_answer for each questions
						var qslen = configMap.qs.questions.length;
						for(var q = 0 ; q < qslen ; q++){
							configMap.qs.questions[q].user_answer = null;
							// configMap.qs.questions[q].ispassed = false;
						}
					}
					ajxCallback(result);
				},
				error : function(xhr, t, m){
					console.log('fudge on finding match! ', xhr);
					// Display error handler
					errorConnectionHandler(xhr, t, m);
				}
			});
			
		}else{
			console.log('end timer ---->');
			endTimer(configMap.findMatchTimer);
			configMap.findMatchTimer.currentTries = 1;
		}
	};
	// End Module /waitCallback/


	// Start Module /ajxCallback/
	// Purpose : async callback
	var ajxCallback = function(result){
		var maxTries = configMap.findMatchTimer.maxTries,
			curTries = configMap.findMatchTimer.currentTries;

		console.log(configMap.matchStatus, 'Match ID: ' + configMap.matchid, 'Player: ' + configMap.player.name);
		console.log(configMap.findMatchTimer.currentTries);

		configMap.matchid = result.matchid;

		if(result.isWaiting){
			
			if(result.matchid !== 0){
				// Match is already created
				if(maxTries > curTries){
					// not met max tries.. still waiting
					configMap.findMatchTimer.currentTries = curTries + 1;
					console.log('Waiting...' + configMap.findMatchTimer.currentTries);
					waitMatch();
				}else{
					// abort waiting..
					configMap.findMatchTimer.currentTries = 1;
					console.log('Abort Waiting...');
					endTimer(configMap.findMatchTimer);


					// Display Quit message
					// saying that the waiting time is too long
					configMap.modal.title = "Oops..";
					configMap.modal.message = "Looks like there are no available player for this topic.";
					configMap.modal.buttons = {
						"exit" : { "caption" : "Leave game", "class" : "pop-up__exit is-yellow" }
					};
					configMap.modal.isActive = true;

					// $('.extra').append('display Modal ---><br />');
					renderModal();
				}
			}
		}else{
			// Start game
			configMap.findMatchTimer.currentTries = 1;
			configMap.match = result.match;
			configMap.match.result = { "a" : null, "b" : null };

			endTimer(configMap.findMatchTimer);
			console.log('Start the game......');
			
			// Initialize Game
			// initGame();
			// get questions
			// getFile('qs');
			// get profiles
			getFile('ps', renderVS);
			// sh*t pants
		}

	};
	// End Module /ajxCallback/

	// for back button
	var closeWindow = function(state){
		var currScreen = configMap.currentScreen;
		var modal = $('.pop-up');

		console.log('state -->', state, (location.hash !== "") ? location.hash : 'yeah wala' );
		// $('.extra').appen(location.hash);
		// Reset Modal
		// if( modal.length ){
		// 	// Close modal

		// }else{
			if ( state === null ){
				if( configMap.mod_marker === true ){
					configMap.modal.title = "Oops..";
					configMap.modal.message = "Are you sure you want to exit the game?";
					configMap.modal.isprompt = true;
					configMap.modal.hasclosebtn = true;
					configMap.modal.buttons = {
						"no" : { "caption" : "No", "class" : "pop-up__leave--no is-yellow" },
						"yes" : { "caption" : "Yes", "class" : "pop-up__leave--yes" }
					};
					configMap.modal.isActive = true;

					// $('.extra').append('display Modal ---><br />');
					renderModal();
					// location.hash = "play";
				}
			}
			// else{
			// 	// if( location.hash != "play" ){
			// 	destroyModal();
			// 	// $('.extra').append('hide Modal ---><br />');
			// 	// }
			// }
		// }
		
		configMap.mod_marker = true;
	};

	// Start Module /initGame/
	// Purpose : Initializes our Game
	var initGame = function(){
		// Instantiate popstate listener
		if( !window.popstate ){

			window.addEventListener('popstate' , function(e){
				var s = e.state;
				console.log('popstate changed --->');
				closeWindow(s);
			});
			// For the back button
			// var state = 0;
			var Obj = { "state" : 1 },
				title = "project engage",
				url = "#play";

			// state++;
			// Push the state and change the url
			self.location.href = '#play';
			history.pushState(Obj, title, url);
			history.go(1);

			console.log('pushState executed --->', history);
		}

		// Browser Detection
		var standalone = window.navigator.standalone,
		    userAgent = window.navigator.userAgent.toLowerCase(),
		    safari = /safari/.test( userAgent ),
		    ios = /iphone|ipod|ipad/.test( userAgent );

		if( ios ) {
			configMap.browser = 'ios';

		    if ( !standalone && safari ) {
		        //browser
		        closeWindowFeature = "yeah";
		    } else if ( standalone && !safari ) {
		        //standalone
		    } else if ( !standalone && !safari ) {
		        //uiwebview
		        // Insert initialization of iOS features
		    }
		} else {
		    //not iOS

		    // execute android commands
	    	// closeWindowFeature = Android.leave;
	    	configMap.browser = 'android';
		}


		// Create Bridge for iOS
		setupWebViewJavascriptBridge(iOS_callback);
		// configMap.bridge.registerHandler('jsdismissViewController', function(data, responseCallback) {
		// 	console.log('ObjC called testJavascriptHandler with', data);
		// 	var responseData = { 'Javascript Says':'Right back atcha!' };
		// 	console.log('JS responding with', responseData);
		// 	responseCallback(responseData);
	 //    });

		// Reset Elements
		var main = $('.engage');
		main.html('');
		if( main.hasClass('preloader') ){
			main.removeClass('preloader');
		}

		// Register Callbacks for each timer
		configMap.resultTimer.callback = checkStatuses;
		configMap.waitTimer.callback = renderTimer;
		configMap.matchTimer.callback = renderBattlefield;
		configMap.roundTimer.callback = renderQuestion;
		configMap.questTimer.callback = renderOptions;
		configMap.gameTimer.callback = getUpdates;

		// Sounds
		// BG for Finding a Random Match
		// configMap.audio.sfx.bg_random = new Howl({
		// 	urls : configMap.audio.files.bg_random,
		// 	loop: true,
		// 	volume : 0.25
		// });

		// // SFX for Correct Answer
		// configMap.audio.sfx.sfx_correct = new Howl({
		// 	urls : configMap.audio.files.sfx_correct,
		// 	volume : 0.5
		// });

		// // SFX for Incorrect Answer
		// configMap.audio.sfx.sfx_incorrect = new Howl({
		// 	urls : configMap.audio.files.sfx_incorrect,
		// 	volume : 0.5
		// });

		// // SFX when displaying Versus Page
		// configMap.audio.sfx.sfx_versus = new Howl({
		// 	urls : configMap.audio.files.sfx_versus,
		// 	volume : 0.5
		// });


		// // street fighter sfx
		// configMap.audio.sfx.sfx_fight = new Howl({ urls : ['assets/audio/street_fighter/56H.wav'] });
		// configMap.audio.sfx.sfx_round = new Howl({
		// 	urls : ['assets/audio/street_fighter/5FH.wav'],
		// 	onend : function(){
		// 		configMap.audio.sfx['sfx_'+configMap.currentRound].play();
		// 	}
		// });
		// configMap.audio.sfx.sfx_roundx = new Howl({ urls : ['assets/audio/street_fighter/5FH.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_1 = new Howl({ urls : ['assets/audio/street_fighter/60H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_2 = new Howl({ urls : ['assets/audio/street_fighter/61H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_3 = new Howl({ urls : ['assets/audio/street_fighter/62H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_4 = new Howl({ urls : ['assets/audio/street_fighter/63H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_5 = new Howl({ urls : ['assets/audio/street_fighter/64H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_6 = new Howl({ urls : ['assets/audio/street_fighter/65H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_7 = new Howl({ urls : ['assets/audio/street_fighter/66H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_8 = new Howl({ urls : ['assets/audio/street_fighter/67H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_9 = new Howl({ urls : ['assets/audio/street_fighter/68H.wav'], onend : function(){ playFight(); } });
		// configMap.audio.sfx.sfx_final = new Howl({
		// 	urls : ['assets/audio/street_fighter/69H.wav'],
		// 	onend : function(){
		// 		configMap.audio.sfx.sfx_roundx.play();
		// 	}
		// });

		// var playFight = function(){
		// 	configMap.audio.sfx.sfx_fight.play();
		// };


		// console.log('Audio has been set');

	};
	// End Module /initGame/

	var errorConnectionHandler = function(x, t, m){
		var caption = "Leave game";

		configMap.modal.title = "Uh ohh...";
		switch( t ){
			case "timeout" :
				configMap.modal.message = "It looks like the server takes too long to respond.";
			break;
			// case "error" :
			// 	configMap.modal.message = "There has been an error from the server!";
			// break;
			// case "abort" :
			// 	configMap.modal.message = "Server connection has been aborted!";
			// break;
			default:
				configMap.modal.message = "Something went wrong, Please check your internet connection.";
			break;
		}
		
		var screens = ['result', 'waiting-rm'];
		if( screens.indexOf(configMap.currentScreen) !== -1){
			caption = "close";
		}

		configMap.modal.buttons = {
			"exit" : { "caption" : caption, "class" : "pop-up__exit is-yellow" }
		};
		configMap.modal.isActive = true;
		console.log(t,m);

		if( t !== 'abort' ){
			renderModal();
		}
	};

	var roundCaller = function(round){
		if( round != "final" ){
			configMap.audio.sfx['sfx_round'].play();
		}else{
			configMap.audio.sfx['sfx_final'].play();
		}
	};

	
	// Start Module /initModule/
	// Purpose : Initializes our Environment App
	var initModule = function(){
		// mainit
		// initialization code for app here
		console.log('It\'s alive!!!');
		console.log('INITMODULE()');
		var t;
		var init = function(){
			console.log('interval running....');

			if( localStorage[configMap.plstore.match].length ){

				// For debugging
				// configMap.isStatic = true;
				initSetup();
				initGame();

				// Start
				renderVS();

				clearTimeout(t);
			}else{
				initTimer();
			}
		};

		var initTimer = function(){
			t = setTimeout(init, 2000);
		}

		initTimer();
		
	};


	// -----------------------------------------------------------------------------
	// ------------------- TEXT TWIST GAME PLAY Integration ------------------------
	// -----------------------------------------------------------------------------

	// Start Module : /getNextQuestion/
	// Purpose : gets the next question
	var getNextQuestion = function(){
		var questions = configMap.qs.questions;
		var current = configMap.currentRound;

		configMap.currentRound = current + 1;

		if(configMap.currentRound > questions.length){
			configMap.currentRound = 1;
		}

		if( questions[configMap.currentRound - 1].user_answer !== null ){
			var all = 0;
			for( var key in questions ){
				if( questions[key].user_answer !== null ){
					all++;
				}
			}

			if( questions.length !== all ){
				getNextQuestion();
			}else{
				renderResults();
			}
		}else{
			renderQuestion();
		}
	};
	// End Module : /getNextQuestion/

	// Method Start -- genLetters
	// Purpose -- Generate box for each letter depending on mode (i.e, buttons, blank)
	var genLetters = function(mode){
		mode = mode || "blank";
		var data = [];
		// html += "<ul class='"+mode+"'>";

		var refArray = (mode == "buttons") ? configMap.currentScram : configMap.currentAnswer;

		for(var mb in refArray){
			data.push({
				mode : mode,
				text : refArray[mb],
				sindex : (mode == "buttons") ? mb : ""
			});
			// html += "<li><a href='#' class='"+mode+"' "+((mode == "buttons") ? "data-sindex='"+mb+"'" : "" )+" data-text='"+refArray[mb]+"'>"+((refArray[mb] != "_") ? refArray[mb] : "" )+"</a></li>";
		}

		return data;
	};
	// Method End -- genLetters

	// Start Module : /resetAnswer/
	// Purpose : Adds random characters based on the length of the current word
	var resetAnswer = function(strlen){
		answer = [];
		// Create Blank -- Start
		for(var b = 0; b < strlen; b++){
			answer.push("_"); // Insert blank answer
		}

		configMap.currentAnswer = answer;
	};
	// End Module : /resetAnswer/


	// Start Module : /addRandomChars/
	// Purpose : Adds random characters based on the length of the current word
	var addRandomChars = function(strlen){
		// Max of 10 chars only for the word
		var max = 10;
		var ilen = (max > strlen) ? max - strlen : 0;
		var possible = "abcdefghijklmnopqrstuvwxyz";
		var text = "";
		if( ilen !== 0){
			for( var i = 0 ; i < ilen ; i++){
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
		}

		return text;
	};
	// End Module : /addRandomChars/ 



	// -----------------------------------------------------------------------------
	// -------------------------- NATIVE Integration -------------------------------
	// -----------------------------------------------------------------------------

	// For iOS integration
	// Start Module /setupWebViewJavascriptBridge/
	var setupWebViewJavascriptBridge = function(callback) {
	    if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
	    if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
	    window.WVJBCallbacks = [callback];
	    var WVJBIframe = document.createElement('iframe');
	    WVJBIframe.style.display = 'none';
	    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	    document.documentElement.appendChild(WVJBIframe);
	    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0);
	};
	// End Module /setupWebViewJavascriptBridge/

	var iOS_callback = function(bridge) {

	    /* Initialize your app here */
	    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
			console.log('ObjC called testJavascriptHandler with', data);
			var responseData = { 'Javascript Says':'Right back atcha!' }
			console.log('JS responding with', responseData);
			responseCallback(responseData);
		});

		bridge.registerHandler('callbackfromJS', function(data, responseCallback){
			console.log('Ojbc called callbackfromJS with ',data);
			var responseData = { 'Webview said' : 'Such wow!' };
			console.log('JS responds with ', responseData);
			responseCallback(responseData);
		});

	    configMap.bridge = bridge;
	};

	// var iOS_share = function(bridge){
	// 	bridge.callHandler('shareViewController');
	// };

	var stringToJSON = function(str){
		return eval("(" + str + ")");
	};

	var jsonToString = function(json){
		return JSON.stringify(json);
	};

	// Jarvin utility functions
	// to be deleted on production

	var freeze = function(){
		endTimer(configMap.waitTimer);
		endTimer(configMap.roundTimer);
		endTimer(configMap.matchTimer);
		endTimer(configMap.questTimer);
		endTimer(configMap.gameTimer);
		endTimer(configMap.roundEndTimer);
		endTimer(configMap.resultTimer);

		// configMap.audio.sfx.bg_random.stop();
		// configMap.audio.sfx.sfx_correct.stop();
		// configMap.audio.sfx.sfx_incorrect.stop();
		// configMap.audio.sfx.sfx_versus.stop();

		return false;
	};

	var setType = function(type){
		localStorage.setItem('OPEN__TYPE', type);
	};

	var setUser = function(user){
		localStorage.setItem('PLAYER__NAME', user);
	};

	var setStorage = function(){
		var data = {
			matchid : 0,
			ps : 'player1',
			qs : 'questions'
		};

		localStorage.setItem('ENGAGE__MATCH', JSON.stringify(data));
	};

	var getStorage = function(){
		var data = localStorage.getItem('ENGAGE__MATCH');
		var evaluate = eval("(" + data + ")");
		var json = JSON.stringify(evaluate);

		return evaluate;
	};


	return {
		initModule : initModule,
		freeze : freeze,
		setType : setType,
		setUser : setUser,
		setStorage : setStorage,
		getStorage : getStorage,
		configMap : configMap
	};

}());