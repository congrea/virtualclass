<?php 
function my_curl_request($url, $post_data){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_HEADER, 'content-type: text/plain;');
        curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, false);
		curl_setopt($ch, CURLOPT_SSLVERSION, 1);

        $result = @curl_exec($ch);
		if($result === false){  
		    echo 'Curl error: ' . curl_error($ch);
			exit;
		}
        curl_close($ch);

        return $result;
}

//send auth detail to server
 $authusername = substr(str_shuffle(MD5(microtime())), 0, 12);
 $authpassword = substr(str_shuffle(MD5(microtime())), 0, 12);
 $licen = '';
 
//license key
// 100-77087b83dcd4c4f7779587
// 100-1139e6899fdeda0db594a5
// 100-193dbd7a54da898a52f969

$post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'licensekey' => '100-193dbd7a54da898a52f969');
// $post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'licensekey' => '100-5454676903fc3060e4849a');
 
 $post_data = json_encode($post_data);
 
if (true) { // False for local server deployment
 $rid = my_curl_request("https://c.vidya.io", $post_data); // REMOVE HTTP
 //$rid = "8000.vidya.io";
//print_r( $rid);exit;//8000.vidya.io
 
 //$rid = "8002.vidya.io";
// $rid = "8002.vidya.io";
 
 if(empty($rid) or strlen($rid) > 32){
  	echo "Chat server is unavailable!";
  	exit;
  }
  
//setcookie('auth_user', $authusername, 0, '/');
//setcookie('auth_pass', $authpassword, 0, '/');
//setcookie('path', $rid, 0, '/');
     $rid = "wss://$rid";
} else {
    $rid = "ws://127.0.0.1:8080";
}
  //$rid='8000.vidya.io';
?>

<script type="text/javascript">
<?php echo "var wbUser = {};";?>
<?php echo " wbUser.auth_user='".$authusername."';"; ?>
<?php echo " wbUser.auth_pass='".$authpassword."';"; ?>
<?php echo " wbUser.path='".$rid."';";?>
<?php //echo "imageurl='./images/quality-support.png';"; ?>
</script>


<script type="text/javascript">
	//earlier cookie is using
    <?php //echo "auth_user='".$authusername."';"; ?>
    <?php //echo "auth_pass='".$authpassword."';"; ?>
    <?php //echo "path='".$rid."';";?>
    <?php //echo "imageurl='./images/quality-support.png';";?>
</script>
