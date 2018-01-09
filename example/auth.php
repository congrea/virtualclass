<?php
function my_curl_request($url, $post_data, $key){
        $ch = curl_init();
                        curl_setopt($ch, CURLOPT_VERBOSE, true);

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
            curl_setopt($ch, CURLOPT_HTTPHEADER,
                        array('Content-Type: application/json',
                        'x-api-key: ' . $key,
                      ));
        curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        curl_setopt($ch, CURLOPT_CAINFO, "D:\xampp\htdocs\virtualclass\cacert.pem");

        $result = @curl_exec($ch);
        if($result === false)
	{
		echo 'Curl error: ' . curl_error($ch);
	}

        curl_close($ch);

        return $result;
}

//send auth detail to server
$authusername = substr(str_shuffle(MD5(microtime())), 0, 20);
$authpassword = substr(str_shuffle(MD5(microtime())), 0, 20);
 $licensekey = '2895-sg-245-CXnaPcnUGCgFBVd2HPpweRaq9XEZzENTJVPZUYuwwwNt9RV3';
// $licensekey = '2210-sg-245-uqGwY3qnHMamdpwBMmKXXns8qqZVFDhAmksJ8gMXap59JMHz';
$post_data = array('authuser'=> $authusername,'authpass' => $authpassword);
$post_data = json_encode($post_data);
//echo $post_data;
$rid = my_curl_request("https://api.congrea.com/auth", $post_data, $licensekey);
//print_r( $rid);exit;


if (!$rid = json_decode($rid)) {
    echo "{\"error\": \"403\"}";exit;
} elseif (isset($rid->message)) {
    echo "{\"error\": \"$rid->message\"}";exit;
} elseif (!isset($rid->result)) {
    echo "{\"error\": \"invalid\"}";exit;
}

$rid = "wss://$rid->result";

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
