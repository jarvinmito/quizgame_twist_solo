this["App"] = this["App"] || {};
this["App"]["Templates"] = this["App"]["Templates"] || {};

this["App"]["Templates"]["achievement-list"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul class=\"achievement__list\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.list : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "		<li>\r\n			<h3>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.title : depth0), depth0))
    + "</h3>\r\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.desc : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "		</li>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "			<p>"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.desc : depth0), depth0))
    + "</p>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.list : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["App"]["Templates"]["button-exit"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<svg enable-background=\"new 0 0 512 512\" id=\"Layer_1\" version=\"1.1\" viewBox=\"0 0 512 512\" width=\"512px\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><path d=\"M74.966,437.013c-99.97-99.97-99.97-262.065,0-362.037c100.002-99.97,262.066-99.97,362.067,0  c99.971,99.971,99.971,262.067,0,362.037C337.032,536.998,174.968,536.998,74.966,437.013z M391.782,120.227  c-75.001-74.985-196.564-74.985-271.534,0c-75.001,74.985-75.001,196.55,0,271.535c74.97,74.986,196.533,74.986,271.534,0  C466.754,316.775,466.754,195.212,391.782,120.227z M188.124,369.137l-45.251-45.266l67.876-67.877l-67.876-67.876l45.251-45.267  L256,210.743l67.877-67.892l45.25,45.267l-67.876,67.876l67.876,67.877l-45.25,45.266L256,301.245L188.124,369.137z\"/></svg>";
},"useData":true});

this["App"]["Templates"]["header-player"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "assets/images/player-1.png";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.icon : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"header__player\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.place : stack1), depth0))
    + "\">\r\n	<img class=\"player__avatar--small image--hasfallback\" src=\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.icon : stack1),"",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" alt=\"\">\r\n  <div class=\"player__details\">\r\n	<h4 class=\"player__name\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h4>\r\n	<p class=\"player__badge\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.badge : stack1), depth0))
    + "</p>\r\n	<p class=\"player__score\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.score : stack1), depth0))
    + "</p>\r\n  </div>\r\n</div>";
},"useData":true});

this["App"]["Templates"]["header-points"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<p class=\"points__value\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.game : depth0)) != null ? stack1.points : stack1), depth0))
    + "</p>\r\n<p class=\"points__title\">Points</p>";
},"useData":true});

this["App"]["Templates"]["header"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"header header__solo\">\r\n"
    + ((stack1 = container.invokePartial(partials["header-player"],depth0,{"name":"header-player","hash":{"player":(depth0 != null ? depth0.player : depth0)},"data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "	<div class=\"header__points points\">\r\n"
    + ((stack1 = container.invokePartial(partials["header-points"],depth0,{"name":"header-points","hash":{"game":(depth0 != null ? depth0.game : depth0)},"data":data,"indent":"\t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "	</div>\r\n	<div class=\"header__back-btn\"  data-id=\"b\">\r\n      <button class=\"game-button game-leave game-button--red\" type=\"button\">BACK</button>\r\n    </div>\r\n</div>";
},"usePartial":true,"useData":true});

this["App"]["Templates"]["landing"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<input type=\"text\" id=\"name\" placeholder=\"Type your name here\" />\r\n<button class=\"btn btn-default btn__play\">Play</button>\r\n<button class=\"btn btn-default btn__follow\">Follow</button>\r\n<button class=\"btn btn-default btn__rank\">Rankings</button>\r\n<button class=\"btn btn-default btn__leave\">Leave</button>";
},"useData":true});

this["App"]["Templates"]["loading"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"loading-screen\"></div>\r\n<div class=\"loading-screen__sky\"></div>\r\n<div class=\"loading-screen__clouds\"></div>\r\n\r\n<img class=\"loading-screen__cloud-one\" src=\"./assets/images/cloud-one.svg\" alt=\"\">\r\n<img class=\"loading-screen__cloud-two\" src=\"./assets/images/cloud-two.svg\" alt=\"\">\r\n<img class=\"loading-screen__cloud-three\" src=\"./assets/images/cloud-three.svg\" alt=\"\">\r\n<img class=\"loading-screen__cloud-four\" src=\"./assets/images/cloud-four.svg\" alt=\"\">\r\n<img class=\"loading-screen__cloud-five\" src=\"./assets/images/cloud-five.svg\" alt=\"\">\r\n\r\n<img class=\"loading-screen__flag\" src=\"./assets/images/flag.svg\" alt=\"\">\r\n<img class=\"loading-screen__jeep\" src=\"./assets/images/jeepney.svg\" alt=\"\">";
},"useData":true});

this["App"]["Templates"]["modal"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "pop-up--achievement";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      <a class=\"pop-up__close\" href=\"javascript:;\">"
    + ((stack1 = container.invokePartial(partials["button-exit"],depth0,{"name":"button-exit","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</a>\r\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "achievement";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["achievement-list"],depth0,{"name":"achievement-list","hash":{"list":((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.list : stack1)},"data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.message : stack1), depth0))
    + "\r\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "is-half";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.buttons : stack1),{"name":"each","hash":{},"fn":container.program(14, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "          <a class=\"pop-up__button "
    + alias2(alias1((depth0 != null ? depth0["class"] : depth0), depth0))
    + "\" href=\"javascript:;\">"
    + alias2(alias1((depth0 != null ? depth0.caption : depth0), depth0))
    + "</a>\r\n";
},"16":function(container,depth0,helpers,partials,data) {
    return "          <a class=\"pop-up__button pop-up__exit\" href=\"javascript:;\">Go Back</a>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"pop-up "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.isAchievement : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n  <div class=\"pop-up__wrap animate-in\">\r\n    <div class=\"pop-up__header\">\r\n      <h4 class=\"pop-up__title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.title : stack1), depth0))
    + "</h4>\r\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.hasclosebtn : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"pop-up__body "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.isAchievement : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.list : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\r\n    <div class=\"pop-up__footer "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.isprompt : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\r\n"
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.modal : depth0)) != null ? stack1.buttons : stack1),{"name":"if","hash":{},"fn":container.program(13, data, 0),"inverse":container.program(16, data, 0),"data":data})) != null ? stack1 : "")
    + "    </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});

this["App"]["Templates"]["options-buttons"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "	<li><a href=\"javascript:;\" class=\"text-twist__item "
    + alias2(alias1((depth0 != null ? depth0.mode : depth0), depth0))
    + "\" "
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,(depth0 != null ? depth0.mode : depth0),"buttons",{"name":"ifCond","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + " data-text=\""
    + alias2(alias1((depth0 != null ? depth0.text : depth0), depth0))
    + "\">"
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias4).call(alias3,(depth0 != null ? depth0.text : depth0),"_",{"name":"ifCond","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "")
    + "</a></li>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "data-sindex=\""
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.sindex : depth0), depth0))
    + "\"";
},"4":function(container,depth0,helpers,partials,data) {
    return "";
},"6":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(container.lambda((depth0 != null ? depth0.text : depth0), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["App"]["Templates"]["options"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"text-twist__output\">\r\n  <ul class=\"text-twist__list\">\r\n"
    + ((stack1 = container.invokePartial(partials["options-buttons"],depth0,{"name":"options-buttons","hash":{"data":((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.blanks : stack1)},"data":data,"indent":"  \t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </ul>\r\n</div>\r\n<div class=\"text-twist__input\">\r\n  <ul class=\"text-twist__list\">\r\n"
    + ((stack1 = container.invokePartial(partials["options-buttons"],depth0,{"name":"options-buttons","hash":{"data":((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.options : stack1)},"data":data,"indent":"  \t","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "  </ul>\r\n</div>\r\n<div class=\"text-twist__action\">\r\n  <button class=\"game-button game-button--ttclear game-button--red\" type=\"button\">CLEAR</button>\r\n  <button class=\"game-button game-button--ttpass game-button--yellow\" type=\"button\">PASS</button>\r\n  <button class=\"game-button game-button--ttsubmit game-button--blue-green\" type=\"button\">SUBMIT</button>\r\n</div>";
},"usePartial":true,"useData":true});

this["App"]["Templates"]["question-waiting"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p>You have answered all the questions and it looks like your opponent is having a hard time...</p>";
},"useData":true});

this["App"]["Templates"]["question"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = (helpers.stripSlashes || (depth0 && depth0.stripSlashes) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.question : stack1),{"name":"stripSlashes","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    return "Guess the Picture";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"text-twist__question\">\r\n	<span class=\"text-twist__count\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.round : stack1), depth0))
    + " of "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.maxround : stack1), depth0))
    + "</span>\r\n	<p  class=\"text-twist__title\">"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.question : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "</p>\r\n	<div class=\"text-twist__img-wrap\">\r\n	 	<img src=\""
    + alias2(((helper = (helper = helpers.imagepath || (depth0 != null ? depth0.imagepath : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"imagepath","hash":{},"data":data}) : helper)))
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.image : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.data : depth0)) != null ? stack1.question : stack1), depth0))
    + "\">\r\n	</div>\r\n</div>";
},"useData":true});

this["App"]["Templates"]["results-buttons"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "		<button class=\"game-button result-page__button game-button--"
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + " game-button--"
    + alias2(alias1((depth0 != null ? depth0.color : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.caption : depth0), depth0))
    + "</button>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"result-page__list\">\r\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.buttons : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["App"]["Templates"]["results"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "assets/images/player-1.png";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.me : stack1)) != null ? stack1.icon : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"result-page result-page--parent result-page--"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.result : stack1), depth0))
    + " result-page--solo animate--in\">\r\n<!--   <div class=\"result-page result-page--win animate--in\">-->\r\n<!--    <div class=\"result-page result-page--lose animate--in\">-->\r\n  <h1 class=\"result-page__title\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.status : stack1), depth0))
    + "</h1>\r\n\r\n  <div class=\"result-page__main-player main-player\" data-id=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.me : stack1)) != null ? stack1.place : stack1), depth0))
    + "\" >\r\n    <img class=\"image--hasfallback main-player__avatar\" src=\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.me : stack1)) != null ? stack1.icon : stack1),"",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" alt=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.me : stack1)) != null ? stack1.name : stack1), depth0))
    + "\">\r\n    <div class=\"main-player__details ribbon-content\">\r\n      <h4 class=\"main-player__name \">Great Job!</h4>\r\n      <span class=\"main-player__score\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.me : stack1)) != null ? stack1.score : stack1), depth0))
    + " POINTS</span>\r\n    </div>\r\n    <p class=\"main-player__footer\">You finished the Game</p>\r\n  </div>\r\n\r\n</div>";
},"useData":true});

this["App"]["Templates"]["round"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "assets/images/vanamo_logo.png";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.icon : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.lambda, alias4=container.escapeExpression;

  return "<div class=\"waiting-screen\">\r\n  <div class=\"waiting-screen__holder\">\r\n	  <img class=\"waiting-screen__logo\" src=\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.icon : stack1),"",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" alt=\""
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\r\n	  <h3 class=\"waiting-screen__topic\">"
    + alias4(alias3(((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\r\n	  <p>"
    + alias4(((helper = (helper = helpers.round || (depth0 != null ? depth0.round : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"round","hash":{},"data":data}) : helper)))
    + "</p>\r\n  </div>\r\n</div>";
},"useData":true});

this["App"]["Templates"]["versus"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "assets/images/player-1.png";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.icon : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"versus\">\r\n  <div class=\"player--one solo-game animate--in\">\r\n    <img class=\"player__avatar player__avatar--left image--hasfallback\" src=\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.icon : stack1),"",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">\r\n    <div class=\"player__details\">\r\n      <div class=\"player__name\"><b>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.name : stack1), depth0))
    + "</b></div>\r\n      <div class=\"player__badge\"><small>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.player : depth0)) != null ? stack1.badge : stack1), depth0))
    + "</small></div>\r\n      <div class=\"player__score\"></div>\r\n    </div>\r\n\r\n  </div>\r\n  <div class=\"versus__one player--one animate--in\"></div>\r\n  <div class=\"versus__two player--two animate--in\"></div>\r\n</div>";
},"useData":true});

this["App"]["Templates"]["waiting-rematch"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"result-page__rematch rematch\">\r\n	<h3 class=\"rematch__title\">Waiting for the other player</h3>\r\n	<time class=\"rematch__time\">"
    + ((stack1 = container.invokePartial(partials["waiting-timer"],depth0,{"name":"waiting-timer","hash":{"time":(depth0 != null ? depth0.time : depth0)},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</time>\r\n	<button class=\"game-button result-page__button game-button--cancel game-button--red \">Cancel</button>\r\n</div>";
},"usePartial":true,"useData":true});

this["App"]["Templates"]["waiting-timer"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression((helpers.timeToMinutes || (depth0 && depth0.timeToMinutes) || helpers.helperMissing).call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.time : depth0),{"name":"timeToMinutes","hash":{},"data":data}));
},"useData":true});

this["App"]["Templates"]["waiting"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "assets/images/vanamo_logo.png";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.icon : stack1), depth0));
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"waiting-screen\">\r\n	<div class=\"waiting-screen__holder\">\r\n	  <img class=\"waiting-screen__logo\" src=\""
    + ((stack1 = (helpers.ifCond || (depth0 && depth0.ifCond) || helpers.helperMissing).call(depth0 != null ? depth0 : {},((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.icon : stack1),"",{"name":"ifCond","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\" alt=\"\">\r\n	  <h3 class=\"waiting-screen__topic\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.topic : depth0)) != null ? stack1.name : stack1), depth0))
    + "</h3>\r\n	  <div class=\"waiting-screen__wrap\">\r\n	  	<p>waiting for the player to accept the challenge</p>\r\n	  	<time class=\"waiting-screen__timer\">"
    + ((stack1 = container.invokePartial(partials["waiting-timer"],depth0,{"name":"waiting-timer","hash":{"time":(depth0 != null ? depth0.time : depth0)},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "</time>\r\n	  </div>\r\n  </div>\r\n</div>";
},"usePartial":true,"useData":true});