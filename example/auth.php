<?php
function my_curl_request($url, $post_data, $key, $secret){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
    		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
                    array('Content-Type: application/json',
                    'x-api-key: ' . $key,
                    'x-congrea-secret: ' . $secret,
                  ));
        curl_setopt($ch, CURLOPT_TRANSFERTEXT, 0);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_PROXY, false);
        $result = @curl_exec($ch);
        curl_close($ch);
        return $result;
}

//send auth detail to server
$authusername = substr(str_shuffle(MD5(microtime())), 0, 20);
$authpassword = substr(str_shuffle(MD5(microtime())), 0, 20);

//Todo that key should be dyanamic, place licensekey
// $licensekey = 'r9E53R0eJG34REFMyhFun8mZWUQVeT3l5DBGSwQL';
// $secret = 'IogyMNj7UQoWyazdbeyNmCtscNgDqrw9PMHCA1JvR7rqi0DtfchCPL41zlFZMb9B';

$licensekey = 'r9E53R0eJG34REFMyhFun8mZWUQVeT3l5DBGSwQL';
$secret = 'IogyMNj7UQoWyazdbeyNmCtscNgDqrw9PMHCA1JvR7rqi0DtfchCPL41zlFZMb9B';

$room = '6500';

$post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'role' => 't', 'room' => $room);
$post_data = json_encode($post_data);
//echo $post_data;
$rid = my_curl_request("https://api.congrea.net/backend/auth", $post_data, $licensekey, $secret);
// var_dump( $rid);exit;



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
<?php echo " wbUser.rm='".$room."';";?>
<?php echo " wbUser.lkey='".$licensekey."';";?>




<?php //echo "imageurl='./images/quality-support.png';"; ?>
</script>


<script type="text/javascript">
	//earlier cookie is using
    <?php //echo "auth_user='".$authusername."';"; ?>
    <?php //echo "auth_pass='".$authpassword."';"; ?>
    <?php //echo "path='".$rid."';";?>
    <?php //echo "imageurl='./images/quality-support.png';";?>
</script>
