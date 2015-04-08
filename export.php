	<?php 
    //echo "hello";
    if (isset($_POST['request_data'])) {
        if (isset($_POST['user'])) {
            $useid = $_POST['user']; 
            
            $filenum = $_POST['prvfile'];
            
            $filenum =  (int)$_POST['prvfile'];
            $filenum = ++$filenum;
            
            //$filename = "user".$use_id."*.txt";
            $file = "uploads/user.".$filenum;
                if(file_exists($file)){
                    $data = file_get_contents($file);
                    $arr = array($filenum, $data);
                }else{
                    $arr = array("filnotfound");
                }
                
                echo json_encode($arr);      
            
        }
        //array(key=>value,key=>value,key=>value,etc.);
    }
?>
