<?php 

if (isset($_POST['record_data'])) {
    $record_data  = $_POST['record_data'];
}

if (isset($_POST['user'])) {
    $user  = $_POST['user'];
    //echo $user;
}

if (isset($_POST['user'])) {
    $chunk_num  = $_POST['cn'];
}

if (!file_exists('uploads')) {
    mkdir('uploads', 0777, true);
}

//$file_name = "user".$user.".".$chunk_num;

$file_name = "user.".$chunk_num;

//$file_name = "user".$user.'_'.$chunk_num.'.txt';

if(file_put_contents('uploads/'.$file_name, $record_data) != false ){
    echo "File created (".basename($file_name).")";
}

?>