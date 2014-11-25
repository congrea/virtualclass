<?php 
function my_curl_request($url, $post_data)
{
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

$licen = get_config('local_getkey', 'keyvalue');
//$licen = '10-30-82c1c09515ae50a73e3e6e';
//send auth detail to python script 
$authusername = substr(str_shuffle(MD5(microtime())), 0, 12);
$authpassword = substr(str_shuffle(MD5(microtime())), 0, 12);

$post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'licensekey' => $licen);
$post_data = json_encode($post_data);
 
     
$rid = my_curl_request("https://c.vidya.io", $post_data); // REMOVE HTTP
//print_r( $rid);exit;//8000.vidya.io
 
if(empty($rid) or strlen($rid) > 32){
  	echo "Chat server is unavailable!";
  	exit;
}
//use if required  
//setcookie('auth_user', $authusername, 0, '/');
//setcookie('auth_pass', $authpassword, 0, '/');
//setcookie('path', $rid, 0, '/');

if ($USER->id) {
    $userpicture = moodle_url::make_pluginfile_url(context_user::instance($USER->id)->id, 'user', 'icon', null, '/', 'f2');
    $src = $userpicture->out(false);
}else{
    $src = 'bundle/virtualclass/images/quality-support.png';
}
?>
<script type="text/javascript">
    <?php 
    echo "var wbUser = {};";
    echo "wbUser.auth_user='".$authusername."';"; 
    echo "wbUser.auth_pass='".$authpassword."';"; 
    echo "wbUser.path='".$rid."';";
    echo "auth_user='".$authusername."';"; 
    echo "auth_pass='".$authpassword."';"; 
    echo "path='".$rid."';";

//use if required     
//    echo "auth_user='".$_COOKIE['auth_user']."';"; 
//    echo "auth_pass='".$_COOKIE['auth_pass']."';"; 
//    echo "path='".$_COOKIE['path']."';";
    
    echo "imageurl='".$src."';";
    ?>
</script>
