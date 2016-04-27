<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");


$basePath = "http://192.168.20.75/engage/api/texttsql";
// $basePath = "http://localhost/engage/api/texttsql";
// $basePath = "http://localhost/engage_uat/engage/api/quizsql";

// $hostname = "localhost";
// $dbname = "engage_cms";
// $dbuser = "root";
// $dbpass = "";

// // Create connection
// $conn = mysqli_connect($hostname, $dbuser, $dbpass, $dbname);

// // Check connection
// if (!$conn) {
//     die("Connection failed: " . mysqli_connect_error());
// }
function curlPost($data,$url)
{
	$username = "admin";
	$password = "1234";
	$data_string = json_encode($data);
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
	curl_setopt($curl, CURLOPT_HTTPHEADER, array(
												'Content-Type: application/json',
												'Content-Length:'.strlen($data_string))
											);
	curl_setopt($curl, CURLOPT_USERPWD, $username . ':' . $password);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);  // Make it so the data coming back is put into a string
	curl_setopt($curl, CURLOPT_POSTFIELDS, $data_string);  // Insert the data
	// Send the request
	$result = curl_exec($curl);
	// Free up the resources $curl is using
	return $result;
	curl_close($curl);
}
?>