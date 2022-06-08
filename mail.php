<?php
//get data from form  
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
?>