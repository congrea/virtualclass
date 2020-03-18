<?php
    $version = 20190911001;
?>

<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">

<style>
	@font-face {
		font-family: 'icomoon';
		src:url('https://live.congrea.net/virtualclass/resources/fonts/icomoon.eot?-jjdyd0&ver=<?php echo $version ?>');
		src:url('https://live.congrea.net/virtualclass/resources/fonts/icomoon.eot?#iefix-jjdyd0&ver=<?php echo $version ?>') format('embedded-opentype'), url('https://live.congrea.net/virtualclass/resources/fonts/icomoon.woff?-jjdyd0&ver=<?php echo $version ?>') format('woff'), url('https://live.congrea.net/virtualclass/resources/fonts/icomoon.ttf?-jjdyd0&ver=<?php echo $version ?>') format('truetype'), url('https://live.congrea.net/virtualclass/resources/fonts/icomoon.svg?-jjdyd0#icomoon&ver=<?php echo $version ?>') format('svg');
		font-weight: normal;
		font-style: normal;
	}

    .CodeMirror { height: auto; }
    .CodeMirror pre { padding-left: 7px; line-height: 1.25; }

    /* this should be apply for only core virtualclass, not with any other software */
    html, body {
        margin : 0;
        padding : 0;
    }
</style>

<?php
/**
 * Prints a particular instance of congrea
 *
 * You can have a rather longer description of the file as well,
 * if you like, and it can span multiple lines.
 *
 * @package    mod_congrea
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
define('DEBUG', true);
// you want all errors to be triggered
error_reporting(E_ALL);
ini_set('display_errors', 1);

$room = (isset($_GET['room'])) ? $_GET['room'] : '3_27';
include('en.php');
include('auth.php');

/** For demo recording purpose ***/
/*** include('demo-auth.php'); **/

function get_string($phrase) {
    global $string;
    $lang = $string;
    return $lang[$phrase];
}

//the www path for virtualclass

$whiteboardpath = "https://live.congrea.net/virtualclass/";

$cont_class = 'congrea ';

/** This disables Poll and Quiz, if Congrea is not served from CMS/LMS **/
//$_POST['fromcms'] = true;
$from_cms = false;
if (isset($_POST['fromcms'])) {
	if($_POST['fromcms'] || $_POST['fromcms'] == 'true'){
		$from_cms = true;
		$fromcmsclass = "cms ";
	}
}else {
    $fromcmsclass = "nocms ";
}

$cont_class .= $fromcmsclass;

//congrea color set default and use can select congrea color as per need
$selected_color = isset($_POST['color']) ? $_POST['color'] : "#021317";

$isplay = false;
if (isset($_GET['play']) && ($_GET['play'] == 'true')) {
    $isplay = true;
    $cont_class .= "playMode ";
}

$saverecording = false;
if (isset($_GET['recording']) && ($_GET['recording'] == 'true' || $_GET['recording'] == '1')) {
    $saverecording = true;
}

if (isset($_GET['session'])) {
    $session = $_GET['session'];
} else {
    $session = 'nosession';
}

$sid = 100;
if (isset($_GET['id'])) {
    $uid = $_GET['id'];
    $sid = $uid;
}

/** For demo recording purpose ***/

/*
$room = '3_27';
$isplay = true;
$session = 'a750392f-3895-4d54-b686-5fcec5fa37bd';
$uid = 1930000000;
$cont_class .= "playMode ";
*/

$uname = isset($_GET['name']) ? $_GET['name'] : 'Randy"';
$lname = isset($_GET['lname']) ? $_GET['lname'] : ' ';

if (isset($_GET['role']) && $_GET['role'] == 't' && !$isplay) {
	$cont_class .= 'teacher orginalTeacher ';
	$r = $_GET['role'];
} else {
    $r = 's';
    $cont_class .= 'student ';
}

//meeting mode or normal mode
//class add when meetingmode or normalmode

$meetingmode = 0;
$cont_class .= 'normalmode ';

// Set 1 to add source file else 0 to min file
$info = 1;
$audio_disabled_completely = true;
$cmid = 5;

$allow_presenter_av = 0;
$show= 1;

/* show the status icon for student**/
$disable_attendee_av = 0;
$allow_attendee_av = 1;
$show = 1;

?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/overrideimage.css" ?> />
<?php
if($info) {
?>
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/poll-c3.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/slickQuiz.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/video-js.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/fine-uploader-gallery.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "external/css/codemirror.css" ?> />

	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/black_jquery-ui.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/custom.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/styles.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/popup.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/vceditor.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/document-share.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/editor.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/icon.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/media.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/poll.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/quiz.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/screenshare.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/sharepresentation.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/video.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/peervideo.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/whiteboard.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/youtube.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/jquery.ui.chatbox.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/progress.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/pbar.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/dashboard.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/dashboard.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/dbPpt.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/dbVideo.css" ?> />

	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/multivideo.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/right-sidebar.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/network.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/main-container-layout.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/color.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/modules/askQuestion.css" ?> />
	<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/bootstrap/css/bootstrap.css" ?> />
<?php
} else {
?>
	<link rel="stylesheet" type="text/css" href=  "https://live.congrea.net/virtualclass/build/css/modules.min.css?ver=<?php echo $version ?>" />
	<link rel="stylesheet" type="text/css" href=  "https://live.congrea.net/virtualclass/build/css/external.min.css?ver=<?php echo $version ?>" />
	<link rel="stylesheet" type="text/css" href=  "https://live.congrea.net/virtualclass/external/css/slickQuiz.min.css?ver=<?php echo $version ?>" />
	<link rel="stylesheet" type="text/css" href=  "https://live.congrea.net/virtualclass/external/css/fine-uploader-gallery.min.css?ver=<?php echo $version ?>" />
	<link rel="stylesheet" type="text/css" href=  "https://live.congrea.net/virtualclass/css/bootstrap/css/bootstrap.min.css?ver=<?php echo $version ?>" />

  <?php
}
?>

<script type="text/javascript">
   "user strict";
    let virtualclassSetting = {};
    virtualclassSetting.settings = "00000";
    virtualclassSetting.classes = "audioTool deactive";
    virtualclassSetting.audio_tooltip = '<?php echo get_string('audioEnable','congrea'); ?>';
    virtualclassSetting.meetingMode = '<?php echo ($meetingmode == '1') ? true : false ?>';

    virtualclassSetting.theme={};
    virtualclassSetting.theme.selectedColor='<?php echo $selected_color; ?>';
    wbUser.session = '<?php echo $session; ?>';
    wbUser.virtualclassPlay = '<?php echo $isplay; ?>';
    wbUser.vcSid = '<?php echo "1"; ?>';
    wbUser.imageurl =  '';
    wbUser.id =  '<?php echo $uid; ?>';
    wbUser.socketOn =  '<?php echo $info; ?>';
    wbUser.dataInfo =  '0';
    wbUser.room =  '<?php echo $room; ?>';
    wbUser.sid =  '<?php echo $sid; ?>';
    wbUser.role =  '<?php echo $r; ?>';
    wbUser.lname =  '<?php echo $lname; ?>';
    wbUser.name =  '<?php echo $uname; ?>';
    wbUser.from_cms =  '<?php echo $from_cms; ?>';
    wbUser.meetingMode =  '<?php echo $meetingmode; ?>';
    wbUser.anyonepresenter =  '0';
    window.whiteboardPath =  '<?php echo $whiteboardpath; ?>';
    window.webapi = "<?php echo $whiteboardpath ."webapi.php?cmid=".$cmid; ?>";
    window.congCourse =  "<?php echo $cmid ?>";
</script>
<?php

if ($info) {
    include('js.debug.php');
} else {
    include('js.php');
}

?>

<!-- Fine Uploader JS file
====================================================================== -->
<script type="text/template" id="qq-template-gallery"> <?php include('../fine-upload.php'); ?> </script>

</head>
<body>
    <div id="virtualclassCont" class="<?php echo $cont_class; ?>"> </div>
    <div id="chat_div"></div>
</body>
</html>
