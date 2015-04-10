<?php 
   
if (isset($_POST['record_data'])) {
    if (isset($_POST['user'])) {
        $useid = $_POST['user']; 
        $filenum = $_POST['prvfile'];

//            $filenum =  (int)$_POST['prvfile'];
//            $filenum = ++$filenum;

        //$filename = "user".$use_id."*.txt";
        $file = "uploads/user.".$filenum;
      
            if(file_exists($file)){
                $data = file_get_contents($file);
            }else{
                $data = "filenotfound";
            }
            //echo json_encode($arr);      
            echo $data;
    }
}
?>
