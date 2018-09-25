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
// send auth detail to server
$authusername = substr(str_shuffle(MD5(microtime())), 0, 20);
$authpassword = substr(str_shuffle(MD5(microtime())), 0, 20);
/*
$licensekey = 'Wmqyg9MPQU9D1pOLBSvUN2mthVNhUMQ55RlA2wpn';
$secret = '8ww4umRbFIcTu92cJhrExXWNNAG7FDuN91RDoJO3s1XWa09UiBzPyvDl6ksLXXz6'; */

/*$licensekey = 'noqOqApeSflBnQn9VSibPQ19CHFxRjLuEWdzojnHVMrVNlRa';
$secret = 'iS3pXEWVgclNdEd2QezeJpwJDyGYn8LF0O5Ys1UJefxrUKtKZ3YJsvs6494rhP6i'; */


$licensekey = 'SR71Fv0dhKie3BuhPWFFTUy2QABCWkHL3E0qfMky8I582qGX';
$secret = 'wrbjepJzdXpByeqZEIyAkseCGPayMKAibMBpckYphn1QCrPgaoRuR66yVh7I1H0c';


/*
$licensekey = 'noqOqApeSflBnQn9VSibPQ19CHFxRjLuEWdzojnHVMrVNlRa';
$secret = 'iS3pXEWVgclNdEd2QezeJpwJDyGYn8LF0O5Ys1UJefxrUKtKZ3YJsvs6494rhP6i'; */



$r = isset($_GET['role'] ) ? $_GET['role'] : 's';

$post_data = array('authuser'=> $authusername,'authpass' => $authpassword, 'role' => $r, 'room' => $room);

$post_data = json_encode($post_data);
//echo $post_data;
$rid = my_curl_request("https://api.congrea.net/backend/auth", $post_data, $licensekey, $secret);
 // var_dump( $rid);exit;


if (!$rid = json_decode($rid)) {
    echo "{\"error\": \"403: Please make sure key & secret are correct. Please try again after 5 minutes. \"}";exit;
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
<?php echo " wbUser.room='".$room."';";?>
<?php echo " wbUser.lkey='".$licensekey."';"; ?>
<?php //echo "imageurl='./images/quality-support.png';"; ?>

/*
var Thread = {
	sleep: function(ms) {
		var start = Date.now();

		while (true) {
			var clock = (Date.now() - start);
			if (clock >= ms) break;
		}

	}
};

setInterval(
    function (){
        console.log('sleeping start');
        Thread.sleep(1500);
        console.log('sleeping stop');
    }, 2000
)
*/
</script>
