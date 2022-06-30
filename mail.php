<?php
//get data from form  
$server = "sql202.epizy.com";
$username = "epiz_31992531";
$password = "rvBEP9MNeC";
$dbname = "epiz_31992531_portfoliowebsite";

$conn = mysqli_connect($server, $username, $password, $dbname);

if(!$conn){
    die("Connection failed: ".mysqli_connect_error());
}
else{
    $name = $_POST['name'];
    $email= $_POST['email'];
    $subjectUser= $_POST['subject'];
    $message= $_POST['message'];
    
    $to = "shahadatanik777@gmail.com";
    
    $subject = "Mail From Shahadat Anik website";
    
    $txt ="Name: ". $name . "\r\n  Email: " . $email . "\r\n  Subject: " . $subjectUser . "\r\n Message: " . $message;
    
    $headers = "From: noreply@yoursite.com" . "\r\n" .
    "CC: somebodyelse@example.com";
    
    if($email!=NULL){
        mail($to,$subject,$txt,$headers);
    }
    
    //redirect
    header("Location:contact.html");
}

?>