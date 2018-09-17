<!DOCTYPE html>
<html>
<head>
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

$room = (isset($_GET['room'])) ? $_GET['room'] : '2_15';
include('en.php');
include('auth.php');
function get_string($phrase) {
    global $string;
    $lang = $string;
    return $lang[$phrase];
}

//the www path for virtualclass
$whiteboardpath = "https://local.vidya.io/virtualclass/";

define('SCRIPT_ROOT', $whiteboardpath);

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

$anyonepresenter = 0;

/* Enable if it will be used in future
if (isset($_GET['anyonepresenter'])) {
    if ($_GET['anyonepresenter'] == '0' || $_GET['anyonepresenter'] == '1') {
        $anyonepresenter = $_GET['anyonepresenter'];
    }
} */

$isplay = false;
if (isset($_GET['play']) && ($_GET['play'] == 'true')) {
    $isplay = true;
    $cont_class .= "playMode ";
}

$uid = 100;
$sid = 100;
if (isset($_GET['id'])) {
    $uid = $_GET['id'];
    $sid = $uid;
}

/** for Teacher it's always true and for student we can choose according to our requirement
    Setting $audio_hidden/$video_hidden to false, student does not able click to enable/video the audio
 **/

$audio_hidden = true;
if (isset($_GET['audio_hidden'])) {
     $audio_hidden = $_GET['$audio_hidden'];
}

$video_hidden = true;
if (isset($_GET['video_hidden'])) {
     $video_hidden = $_GET['$video_hidden'];
}

if (isset($_GET['role'])) {
    $cont_class .= ( $_GET['role'] == 't' && !$isplay) ? "teacher orginalTeacher " : 'student ';
    $r = $_GET['role'];
} else {
    $r = 's';
    $cont_class .= 'student';
}

//meeting mode or normal mode
//class add when meetingmode or normalmode
if (isset($_GET['meetingmode'])) {
    $meetingmode = $_GET['meetingmode'];
    $cont_class .= 'meetingmode ';
} else {
    $meetingmode = 0;
    $cont_class .= 'normalmode ';
}

$uname = isset($_GET['name']) ? $_GET['name'] : 'My name';

$lname = isset($_GET['lname']) ? $_GET['lname'] : ' ';


// Chrome extension for desktop sharing.
echo '<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">';

// Set 1 to add source file else 0 to min file
$info = 1;
$audio_disabled_completely = true;
$cmid = 5;
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

<script type="text/javascript">
    virtualclassSetting = {};
    virtualclassSetting.classes = "audioTool deactive";
    virtualclassSetting.audio_tooltip = '<?php echo get_string('audioEnable','congrea'); ?>';
    virtualclassSetting.studentAuidioHidden = '<?php echo $audio_hidden; ?>';
    virtualclassSetting.studentVideoHidden = '<?php echo $video_hidden; ?>';
    virtualclassSetting.meetingMode = '<?php echo ($meetingmode == '1') ? true : false ?>';
    virtualclassSetting.theme={};
	virtualclassSetting.theme.selectedColor='<?php echo $selected_color; ?>';

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
