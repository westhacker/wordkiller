<?php
// Name : connDb.php

// Prevent caching.
///header('Cache-Control: no-cache, must-revalidate');
///header('Expires: Mon, 01 Jan 1996 00:00:00 GMT');

// The JSON standard MIME header.
///header('Content-type: application/json');
//$id = $_GET['id'];	// usefull if we need a specific record

	$dbhost  = "localhost";
	$dbname  = "336553";
	$dbuname = "root";
	$dbpass  = "325545200";
	
$connect = mysql_pconnect($dbhost, $dbuname, $dbpass) or die("Impossible de se connecter au serveur $server" + mysql_error()); 
//$connect = mysql_connect ($dbhost, $dbuname, $dbpass) or header("Location: ExpertUPDown.html"); //die(mysql_error());
$db= mysql_select_db($dbname) or die("Could not select database"+ mysql_error());

mysql_set_charset('utf8', $connect);		
?>