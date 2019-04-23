<?php
	if(!empty($_POST['prvfile'])){
		$filenum = $_POST['prvfile'];
		$file = "uploads/suman.csv";

		if(file_exists($file)){
			$data = file_get_contents($file);
		}else{
			$data = "filenotfound";
		}
		//echo json_encode($arr);
		echo $data;
	}else{
		echo "some error";
	}
?>
