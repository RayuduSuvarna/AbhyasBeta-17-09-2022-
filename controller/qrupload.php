<?php

$extension = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);

$id = time();
$myname = $id.".".$extension;

/* Location */
$location = '../assets/questionimg/';
$path = 'assets/questionimg/';

$response = array(); 
/* Upload file */ 
if(move_uploaded_file($_FILES['file']['tmp_name'],$location.$myname)){
    $response['name'] = $path.$myname; 
    
} else{ 
    $response['name'] = "File not uploaded."; 
    
} 
echo json_encode($response); 
exit;
?>