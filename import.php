<?php 

if (isset($_POST['user'])) {
    $user  = $_POST['user'];
}

if (isset($_POST['cn'])) {
    $chunk_num  = $_POST['cn'];
} else {
    die ('CN Not recieved.');
}

if (!file_exists('uploads')) {
    mkdir('uploads', 0777, true);
}

//$file_name = "user".$user.".".$chunk_num;
$file_name = "user.".$chunk_num;

if (isset($_POST['record_data'])) {
    if(file_put_contents('uploads/'.$file_name, $_POST['record_data']) != false ){
        echo "done";
    }else{
        echo $file_name;
    }
}else{
    echo "No Recorded Data";
}

?>