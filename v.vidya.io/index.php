<?php
// $version = '20161221618';
$version = '201710091125';
$domain=$_SERVER['HTTP_HOST'];
$whiteboardpath = "https://$domain/virtualclass/";
define('SCRIPT_ROOT', $whiteboardpath);

if (isset($_REQUEST['debug']) && $_REQUEST['debug'] == 'true') {
    $debug = true;
} else {
    $debug = false;
}

$debug = true;

//if ($_SERVER['REQUEST_URI'] == '/') {
if ($_SERVER['REQUEST_URI'] == '/') {
    unset($_COOKIE['name']);
    unset($_COOKIE['sid']);
    unset($_COOKIE['role']);
    unset($_COOKIE['room']);
    inRoom(null, 't');
} else {
    $subject = $_SERVER['REQUEST_URI'];
    $pattern = '/\/[a-zA-Z0-9]+\//';
    preg_match($pattern, $subject, $matches);
    if (!$matches[0]) {
        echo 'Not a valid Room: Error 0';
        exit();
    }
    $subject = $matches[0];
    $pattern = '/[a-zA-Z0-9]+/';
    preg_match($pattern, $subject, $matches);
    if (!$matches[0]) {
        echo 'Not a valid Room: Error 1';
        exit();
    } else {
        inRoom($matches[0], 's');
    }
}

// suman bogati
$name = $_COOKIE['name'];
$sid = $_COOKIE['sid'];
$role = $_COOKIE['role'];
$room = $_COOKIE['room'];
$ts = (isset($_COOKIE['room'])) ? $_GET['ts'] : false;
?>

<link href="https://vjs.zencdn.net/5.8.8/video-js.css" rel="stylesheet">
<script src="https://vjs.zencdn.net/5.8.8/video.js"></script>
<!-- If you'd like to support IE8 -->
<script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>  
<link href="<?php echo $whiteboardpath . 'fileuploader/js/fine-uploader-gallery.css'; ?>" rel="stylesheet">

<!-- Fine Uploader JS file
====================================================================== -->
<script src ="<?php echo $whiteboardpath . 'fileuploader/js/fine-uploader.js'; ?>"></script>
        
<?php
$isplay = false;
$cont_class = 'congrea ';

if (isset($_GET['play']) && ($_GET['play'] == 'true')) {
    $isplay = true;
    $cont_class .= "playMode ";
}

if (isset($role)) {
    if ($role == 't' && !$isplay) {
        $cont_class .= "teacher orginalTeacher";
    } else {
        $role = 's';
        $cont_class .= 'student';
    }
} else {
    $role = 's';
    $cont_class .= 'student';
}

if (isset($_GET['meetingmode'])) {
    $meetingmode = $_GET['meetingmode'];
} else {
    $meetingmode = 1;
}

if($meetingmode){
   $cont_class .= ' meetingmode';
}else {
    $cont_class .= ' normalmode';
}


include('./virtualclass/example/en.php');
function get_string($phrase)
{
    global $string;
    $lang = $string;
    return $lang[$phrase];
}

if(isset($_GET['theme'])){
    $theme = $_GET['theme'];
} else {
    $theme = 'gray';
}

$pt = array('0' => 'disable', '1' => 'enable');



$pushtotalk = '0';
if(isset($_GET['pt'])){
    if($_GET['pt'] == 'enable' || $_GET['pt'] == 'disable'){
        $pushtotalk = $_GET['pt'];
    }
}

$pushtotalk = $pt[$pushtotalk];

$anyonepresenter = 0;
if(isset($_GET['anyonepresenter'])){
    if($_GET['anyonepresenter'] == '0' || $_GET['anyonepresenter'] == '1'){
        $anyonepresenter = $_GET['anyonepresenter'];
    }
}

if ($room) {

    if (!$matches[0]) {
        //header("Location: https://v.vidya.io/$room/");
        header("Location: https://$domain/$room/");
    } else if ($matches[0] != $room) {
        unset($_COOKIE['name']);
        setcookie('name', null, -1, '/');
        unset($_COOKIE['sid']);
        setcookie('sid', null, -1,  '/');
        unset($_COOKIE['role']);
        setcookie('role', null, -1, '/');
        unset($_COOKIE['room']);
        setcookie('room', null, -1, '/');
        nameForm();
        exit();
    }


   //send auth detail to server
   $authusername = substr(str_shuffle(MD5(microtime())), 0, 20);
   $authpassword = substr(str_shuffle(MD5(microtime())), 0, 20);
   $licensekey = '2210-sg-245-uqGwY3qnHMamdpwBMmKXXns8qqZVFDhAmksJ8gMXap59JMHz';
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


	<!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Congrea Virtual Class</title>
    <meta charset="utf-8">

    <?php
    if($debug){
        //  echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/styles.css">';
        // echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/popup.css">';
        // echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/jquery.ui.chatbox.css">';
        // echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/vceditor.css">';
        // echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/document-share.css">';
    ?>
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT."css/bootstrap/css/bootstrap.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT."codemirror/lib/codemirror.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT."bundle/jquery/css/base/".$theme."_jquery-ui.css" ?> />


        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT."css/modules/custom.css" ?> />

        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT."poll/graphs/c3.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "SlickQuiz/css/slickQuiz.css" ?> />

        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/styles.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/popup.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/vceditor.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/document-share.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/editor.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/icon.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/media.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/poll.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/quiz.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/screenshare.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/sharepresentation.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/video.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/peervideo.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/whiteboard.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/youtube.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/jquery.ui.chatbox.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/progress.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/pbar.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/modules/multivideo.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/bootstrap/css/bootstrap.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo SCRIPT_ROOT . "css/theme/$theme".".css" ?> />
    <?php
    } else {
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'.min.css">';
    }
    ?>
    <link rel="chrome-webstore-item"
          href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">

    <style>
    @font-face {
    	font-family: 'icomoon';
    	src:url('/virtualclass/fonts/icomoon.eot?-jjdyd0');
    	src:url('/virtualclass/fonts/icomoon.eot?#iefix-jjdyd0') format('embedded-opentype'), url('/virtualclass/fonts/icomoon.woff?-jjdyd0') format('woff'), url('/virtualclass/fonts/icomoon.ttf?-jjdyd0') format('truetype'), url('/virtualclass/fonts/icomoon.svg?-jjdyd0#icomoon') format('svg');
    	font-weight: normal;
    	font-style: normal;
    }

        .CodeMirror {
            height: auto;
            border: 1px solid #c9c9c9;
        }

        .CodeMirror pre {
            padding-left: 7px;
            line-height: 1.25;
        }

        .CodeMirror {
            height: auto;
            border: 1px solid #ddd;
        }

        .CodeMirror pre {
            padding-left: 7px;
            line-height: 1.25;
        }

        /* this should be apply for only core virtualclassm, not with any other software */
        html, body {
            margin: 0;
            padding: 0;
        }
    </style>
    <!-- earlier it was 1.9.1 -->
    <script type="text/javascript"
            src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js?ver=<?php echo $version ?>"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="<?php echo $whiteboardpath."poll/graphs/c3.js" ?>"></script>

    <script type="text/javascript"
            src="/virtualclass/bundle/jquery/jquery-ui.min.js?ver=<?php echo $version ?>"></script>
            <script type="text/javascript">
                var sdworker = new Worker("<?php echo $whiteboardpath."worker/screendecode.js" ?>");
            </script>
    <?php
    if (!$debug) {
        ?>
        <script type="text/javascript"
                src="/virtualclass/bundle/io/build/iolib.min.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/build/wb.min.js?ver=<?php echo $version ?>"></script>
    <?php
    } else {
    ?>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.8/handlebars.js"></script>
        <script type="text/javascript"
                src="/virtualclass/bundle/io/src/iolib.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/roles.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/io-storage.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/io-missing-packets.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/io-adapter.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/io-ping-pong.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/virtualclass.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-canvas.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/whiteboard.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-utility.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/lang-en.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/lang.js?ver=<?php echo $version ?>"></script>

           <script type="text/javascript" src="/virtualclass/src/view.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/environment-validation.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-packetcontainer.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-drawobject.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-make-object.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-canvas-utility.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-canvas-main.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-events.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-virtualbox.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-interact.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-rectangle.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-oval.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-triangle.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-line.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-text.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-freedrawing.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-path.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-mouse.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-readyfreehandobj.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-refresh-play.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-readytextobj.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-keyboard.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/webrtc-adapter.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/audio-resampler.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/media.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/pptshare.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-packet-queue.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/whiteboard-optimization.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/receive-messages-response.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/lzstring.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/audio-codec-g711.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/screenshare-getscreen.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/screenshare-dirtycorner.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/utility.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/screenshare.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/record-play.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/indexeddb-storage.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/footer-control-user.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/xhr.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/popup.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/storage-array-base64-converter.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/progressbar.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/youtube-iframe-api.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/youtube.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/codemirror/lib/codemirror.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/codemirror/addon/edit/continuelist.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/codemirror/mode/xml/xml.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/codemirror/mode/markdown/markdown.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/ot-server.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/editor-utils.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-rich-toolbar.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-text-op.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/ot-text-operation.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/ot-wrapped-operation.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/ot-cursor.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/ot-undo-manager.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/ot-client.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/ot-editor-client.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/editor-span.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-annotation-list.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-attribute-constants.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-line-formatting.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-serialize-html.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/editor-parse-html.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/ot-codemirror-adapter.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/ot-adapter.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/vceditor.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/src/editor.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/chat/chat.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/chat/footer.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/chat/jquery.ui.chatlist.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/chat/jquery.ui.chatbox.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/chat/jquery.ui.chatroom.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/chat/chatboxManager.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/chat/lib.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/chat/lang.en.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript"
                src="/virtualclass/src/precheck.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-base64.min.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-ajax.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-script.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-host.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/dashboard.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/poll.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/upload-video.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/congrea-uploader.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/page.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/document-share.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>SlickQuiz/js/mo_slickQuiz.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/quiz.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/templates_view.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/doNotesMain.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/multi-video.js?ver=<?php echo $version ?>"></script>

    <?php
    }
    ?>
    <script type="text/javascript" src="/virtualclass/index.js?ver=<?php echo $version ?>"></script>
    <script type="text/javascript">
        if (!!window.Worker) {
            var sworker = new Worker("/virtualclass/worker/screenworker.js");
            var mvDataWorker = new Worker("/virtualclass/worker/json-chunks.js");
            var dtConWorker = new Worker("/virtualclass/worker/storage-array-base64-converter.js");
            var webpToPng = new Worker("<?php echo $whiteboardpath."worker/webptopng.js" ?>");
        }
	
        <?php echo "var wbUser = {};";?>
        <?php echo " wbUser.auth_user='".$authusername."';"; ?>
        <?php echo " wbUser.auth_pass='".$authpassword."';"; ?>
        <?php echo " wbUser.path='".$rid."';";?>
        <?php echo "wbUser.virtualclassPlay='$isplay';"; ?>
        <?php echo "wbUser.name='$name';"; ?>
        <?php echo "wbUser.id='".$sid."';"; ?>
        <?php echo "wbUser.socketOn='0';"; ?>
        <?php echo "wbUser.dataInfo='0';"; ?>
        <?php echo "wbUser.room='".$room."';"; ?>
        <?php echo "wbUser.sid='".$sid."';"; ?>
        <?php echo "wbUser.role='".$role."';"; ?>
        <?php echo "wbUser.ts='".$ts."';"; ?>
        <?php echo "wbUser.vcSid='1';"; ?>
        <?php echo "wbUser.anyonepresenter='".$anyonepresenter."';"; ?>
        <?php echo "wbUser.fname='".$name."';"; ?>
        <?php echo "wbUser.lname='';"; ?>
	
        window.io = io;
        window.whiteboardPath = 'https://v.vidya.io/virtualclass/';
        wbUser.imageurl = window.whiteboardPath + "images/quality-support.png";
        window.importfilepath = '/importnotallowed.php';
        window.exportfilepath = '/exportnotallowed.php';
        wbUser.meetingMode =  '<?php echo $meetingmode; ?>';
    </script>

    </head>
    <body>
		<?php
			$adarr = array('0' => 'deactive', '1' => 'active');
			$audactive = '0';
			if(isset($_GET['audio'])){
				if($_GET['audio'] == '0' || $_GET['audio'] == '1'){
					$audactive = $_GET['audio'];
				}
			}

			$audactive = $adarr[$audactive];
			$classes .= ' ' .$audactive;

			if($audactive == 'deactive'){
				$dap = "false";
				$classes = "audioTool";
				$speakermsg = "Enable Speaker";
				$audio_tooltip =  get_string('enableAudio');
			} else {
				$classes = "audioTool";
				$speakermsg = "Disable Speaker";
				$dap = "true";
				$audio_tooltip =  get_string('disableAudio');
			}
		 ?>	
			<script type="text/javascript">

			virtualclassSetting = {};
			virtualclassSetting.dap = '<?php echo $dap; ?>';
			virtualclassSetting.classes = '<?php echo $classes; ?>';
			virtualclassSetting.audio_tooltip = '<?php echo $audio_tooltip; ?>';
			virtualclassSetting.meetingMode = '<?php echo ($meetingmode == '1') ? true : false ?>';
			</script>
    
    <script type="text/template" id="qq-template-gallery"> <?php include('fine-upload.php'); ?> </script>
    <div id="virtualclassCont" class="<?php echo $cont_class; ?>">

    </div>
    </body>
    </html>
<?php
}
// Lib Functions
function my_curl_request($url, $post_data, $key){
       $ch = curl_init();
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
       $result = @curl_exec($ch);
       curl_close($ch);
       return $result;
}

function notInRoom()
{
    if ($_SERVER['REQUEST_URI'] == '/') {
        inRoom(null, 1);
        exit();
    } else {

    }
}

function inRoom($room, $role)
{
    if (isset($_POST['name']) && !isset($_COOKIE['name'])) {
        $name = $_POST['name'];
        $sid = rand(10000000, 99999999);
        if ($_SERVER['REQUEST_URI'] == '/') {
            $room = generateRandomString();
        }
        setcookie('name', $name, null, '/');
        setcookie('sid', $sid, null, '/');
        setcookie('role', $role, null, '/');
        setcookie('room', $room, null, '/');
        $_COOKIE['name'] = $name;
        $_COOKIE['sid'] = $sid;
        $_COOKIE['role'] = $role;
        $_COOKIE['room'] = $room;
    }

    if (!isset($_COOKIE['name'])) {
        if ($_SERVER['REQUEST_URI'] == '/') {
            nameFormRoot();
        } else {
            nameForm();
        }
    }

}

function nameForm()
{
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Vidya.io Demo</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

        <!--earlier it was 3.2.0 -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    </head>
    <body>

    <div class="container">
        <h2>Join Room</h2>

        <form role="form" action="" method="post">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" name="name" class="form-control" id="name" placeholder="Your Name">
            </div>
            <button type="submit" id="submit" class="btn btn-default">Submit</button>
        </form>
    </div>
    </body>
    </html>
<?php
}

function nameFormRoot()
{
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Vidya.io Demo</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>


        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    </head>
    <body>

    <div class="container">
        <h2>Create Your Room</h2>

        <form role="form" action="" method="post">
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" name="name" class="form-control" id="name" placeholder="Your Name">
            </div>
            <button type="submit" id="submit" class="btn btn-default">Submit</button>
        </form>
    </div>
    </body>
    </html>
<?php
}

function generateRandomString($length = 20)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

?>
