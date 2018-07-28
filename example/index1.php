<!DOCTYPE html>
<html>
<head>
<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
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

include('en.php');

$room = (isset($_GET['room'])) ? $_GET['room'] : '2_15';

include('auth.php');

function get_string($phrase) {
    global $string;
    $lang = $string;
    return $lang[$phrase];
}

//the www path for virtualclass
$whiteboardpath = "https://192.168.1.169/virtualclass/";
//$whiteboardpath = "http://local.vidya.io/virtualclass/";

if (isset($_GET['themecolor'])) {
    $theme = $_GET['themecolor'];
} else {
    $theme = 'black';
}

/** This disables Poll and Quiz, if Congrea is not served from CMS/LMS **/
$_POST['fromcms'] = true;
$from_cms = false;
$fromcmsclass = "nocms ";
if (isset($_POST['fromcms'])) {
	if($_POST['fromcms'] || $_POST['fromcms'] == 'true'){
		$from_cms = true;
		$fromcmsclass = "cms ";
	}
}

$cont_class = $fromcmsclass;

if (isset($_POST['color'])) {
    $selected_color = $_POST['color'];
}
else{
	/* to change color */

	 $selected_color = "#021317";
	  // $selected_color = "#34404c";
	 //  $selected_color = "#22673D";
	 // $selected_color = "#25606F";
	  // $selected_color = "#5B7DC8";
	   // $selected_color = "#A83841";
	    // $selected_color = "#9fa1a3";
	 //   $selected_color = "#a2c5e8";
}

if (isset($_GET['meetingmode'])) {
    $meetingmode = $_GET['meetingmode'];
} else {
    $meetingmode = 0;
}

$pt = array('0' => 'disable', '1' => 'enable');

$pushtotalk = '0';
if (isset($_GET['pushtotalk'])) {
    if ($_GET['pushtotalk'] == '0' || $_GET['pushtotalk'] == '1') {
        $pushtotalk = $_GET['pushtotalk'];
    }
}
$pushtotalk = $pt[$pushtotalk];
$anyonepresenter = 0;
if (isset($_GET['anyonepresenter'])) {
    if ($_GET['anyonepresenter'] == '0' || $_GET['anyonepresenter'] == '1') {
        $anyonepresenter = $_GET['anyonepresenter'];
    }
}

$suggestion = 'low';
$latency = 'slow';
$quality = 'low';
?>

<?php

define('SCRIPT_ROOT', $whiteboardpath);
?>
<style>
/*
    @font-face {
        font-family: 'icomoon';
        src:url('/virtualclass/resources/fonts/icomoon.eot?-jjdyd0');
        src:url('/virtualclass//resources/fonts/icomoon.eot?#iefix-jjdyd0') format('embedded-opentype'), url('/virtualclass/resources/fonts/icomoon.woff?-jjdyd0') format('woff'), url('/virtualclass/resources/fonts/icomoon.ttf?-jjdyd0') format('truetype'), url('/virtualclass/resources/fonts/icomoon.svg?-jjdyd0#icomoon') format('svg');
        font-weight: normal;
        font-style: normal;
    } */

        @font-face {
                font-family: 'icomoon';
                src:url('https://cdn.congrea.net/resources/fonts/icomoon.eot?-jjdyd0');
                src:url('https://cdn.congrea.net/resources/fonts/icomoon.eot?#iefix-jjdyd0') format('embedded-opentype'),
                url('https://cdn.congrea.net/resources/fonts/icomoon.woff?-jjdyd0') format('woff'),
                url('https://cdn.congrea.net/resources/fonts/icomoon.ttf?-jjdyd0') format('truetype'),
                url('https://cdn.congrea.net/resources/fonts/icomoon.svg?-jjdyd0#icomoon') format('svg');
                font-weight: normal;
                font-style: normal;
            }
    
    .CodeMirror { height: auto; }
    .CodeMirror pre { padding-left: 7px; line-height: 1.25; }

    .CodeMirror { height: auto; }*/
    .CodeMirror pre { padding-left: 7px; line-height: 1.25; }

    /* this should be apply for only core virtualclassm, not with any other software */

    html, body {
        margin : 0;
        padding : 0;
    }
</style>


<?php
$isplay = false;
$cont_class .= 'congrea ';
if (isset($_GET['play']) && ($_GET['play'] == 'true')) {
    $isplay = true;
    $cont_class .= "playMode ";
}

if (isset($_GET['id'])) {
    $uid = $_GET['id'];
    $sid = $uid;
} else {
    $uid = 100;
    $sid = 100;
}

$suggestion = 'low';
$latency = 'slow';
$quality = 'low';

if (isset($_GET['role'])) {
    $r = $_GET['role'];
    if ($r == 't' && !$isplay) {
        $cont_class .= "teacher orginalTeacher";
        $latency = "fast";
        $quantity = "high";
    } else {
        $r = 's';
        $cont_class .= 'student';
    }
} else {
    $r = 's';
    $cont_class .= 'student';
}

if($meetingmode){
   $cont_class .= ' meetingmode';
}else {
    $cont_class .= ' normalmode';
}

$cont_class .= ' pt_' . $pushtotalk;


if (isset($_GET['name'])) {
    $uname = $_GET['name'];
} else {
    $uname = 'My name';
}
if (isset($_GET['lname'])) {
    $lname = $_GET['lname'];
} else {
    $lname = '';
}



// Chrome extension for desktop sharing.
echo '<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">';
// Mark viewed by user (if required).
//$completion = new completion_info($course);
//$completion->set_module_viewed($cm);
// Checking moodle deugger is unable or disable.

// File included if debugging on

$info = 1;
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
  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/bootstrap/css/bootstrap.css" ?> />
<?php
} else {
?>

  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "/build/css/modules.min.css" ?> />
  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "/build/css/external.min.css" ?> />
  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "/external/css/slickQuiz.min.css" ?> />
  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "/external/css/fine-uploader-gallery.min.css" ?> />
  <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/bootstrap/css/bootstrap.min.css" ?> />

  <?php
}

?>

<?php

$sid = $uid;
$role  = 'student';


$cont_class .= $role;
if(empty($congrea->moderatorid)) {
    $anyonepresenter = 1;
} else {
    $anyonepresenter = 0;
}
$pushtotalk = 0;
// Push to talk
$cont_class .= $pushtotalk ? ' pt_enable' : ' pt_disable';
// Audio enable/disable
$adarr = array('0' => 'deactive', '1' => 'active');
$audactive = '0';
if (isset($_GET['audio'])) {
    if ($_GET['audio'] == '0' || $_GET['audio'] == '1') {
        $audactive = $_GET['audio'];
    }
}

$audactive = $adarr[$audactive];
$audactive = false;
if($audactive){
    $classes = "audioTool active";
    $dap = "true";
    $audio_tooltip =  get_string('audioDisable','congrea');
} else {
    $dap = "false";
    $classes = "audioTool deactive";
    $audio_tooltip =  get_string('audioEnable','congrea');
}
?>



<script>
    window.WeinreServerURL='http://192.168.1.169:8888/';
    virtualclassSetting = {};
    virtualclassSetting.dap = '<?php echo $dap; ?>';
    virtualclassSetting.classes = '<?php echo $classes; ?>';
    virtualclassSetting.audio_tooltip = '<?php echo $audio_tooltip; ?>';
    virtualclassSetting.meetingMode = '<?php echo ($meetingmode == '1') ? true : false ?>';
    virtualclassSetting.theme={};
	virtualclassSetting.theme.selectedColor='<?php echo $selected_color; ?>';


</script>

<?php
// Output starts here.

// Default image if webcam disable.
//$src = '/virtualclass/resources/images/quality-support.png';
$cmid = 5;

?>
<script type="text/javascript">
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


    wbUser.anyonepresenter =  '<?php echo $anyonepresenter ?>';
    window.whiteboardPath =  '<?php echo $whiteboardpath; ?>';
    window.importfilepath = "<?php echo $whiteboardpath . "impport.php" ?>";
    window.exportfilepath = "<?php echo $whiteboardpath . "export.php" ?>";



    window.webapi = "<?php echo $whiteboardpath ."webapi.php?cmid=".$cmid; ?>";

    window.congCourse =  "<?php echo $cmid ?>";
    if (!!window.Worker) {
        var sworker = new Worker("<?php echo $whiteboardpath."worker/screenworker.js" ?>");
        var sdworker = new Worker("<?php echo $whiteboardpath."worker/screendecode.js" ?>");
        var mvDataWorker = new Worker("<?php echo $whiteboardpath."worker/json-chunks.js" ?>");
        var dtConWorker = new Worker("<?php echo $whiteboardpath."worker/storage-array-base64-converter.js" ?>");
        var webpToPng = new Worker("<?php echo $whiteboardpath."worker/webptopng.js" ?>");

    }
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
</body>
</html>
