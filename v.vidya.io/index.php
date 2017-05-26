
<?php
$version = '20161221618';
$domain=$_SERVER['HTTP_HOST'];
$whiteboardpath = "https://$domain/virtualclass/";
define( 'SCRIPT_ROOT', $whiteboardpath);

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
$ts = (isset($_COOKIE['room')) ? $_GET['ts'] : false;
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
    $theme = 'black';
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


    $authusername = substr(str_shuffle(MD5(microtime())), 0, 12);
    $authpassword = substr(str_shuffle(MD5(microtime())), 0, 12);
    $licen = '100-1139e6899fdeda0db594a5';


    $post_data = array('authuser' => $authusername, 'authpass' => $authpassword, 'licensekey' => $licen);
    $post_data = json_encode($post_data);
    $rid = my_curl_request("https://c.congrea.com", $post_data); // REMOVE HTTP
    $rid = "wss://$rid";

    if (empty($rid) or strlen($rid) > 31) {
        echo "Chat server is unavailable!";
        exit;
    }



    ?>

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Congrea Virtual Class</title>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/bootstrap/css/bootstrap.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."codemirror/lib/codemirror.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."bundle/jquery/css/base/".$theme."_jquery-ui.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/pbar.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/progress.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/custom.css" ?> />
    <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."poll/graphs/c3.css" ?> />
    


    <?php
    if($debug){
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/styles.css">';
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/popup.css">';
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/jquery.ui.chatbox.css">';
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/vceditor.css">';
        echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/document-share.css">';
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
    <?php
    if (!$debug) {
        ?>
        <script type="text/javascript"
                src="/virtualclass/bundle/io/build/iolib.min.js?ver=<?php echo $version ?>"></script>
        <script type="text/javascript" src="/virtualclass/build/wb.min.js?ver=<?php echo $version ?>"></script>
    <?php
    } else {
    ?>
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
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-base64.min.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-ajax.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-script.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/video-host.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/upload-video.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/congrea-uploader.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/page.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>src/document-share.js"></script>
        <script type="text/javascript" src="<?php echo $whiteboardpath;?>index.js"></script>
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
    </script>

    </head>
    <body>
    <!--
<div id="dummyPlayCont">
</div>
-->
     <div id="virtualclassCont" class="<?php echo $cont_class; ?>">

        <div id="virtualclassPreCheck" class="bootstrap">

            <div id="preCheckcontainer">

                 <div class="container ">

                      <!-- Modal -->
                      <div class="modal fade" id="myModal" role="dialog">
                        <div class="modal-dialog modal-lg">

                          <!-- Modal content-->
                          <div class="modal-content">

                               <div class="modal-body">
                                    <div id="preCheckProgress">
                                         <ul class="progressbar">
                                             <li class="screen1 browser active">  </li>
                                             <li class="screen2 bandwidth">  </li>
                                             <li class="screen5 speaker"> </li>
                                             <li class="screen4 mic" > </li>
                                             <li class="screen3 webcam" > </li>
                                         </ul>
                                    </div>


                                  <div id="vcBrowserCheck" class="precheck browser">

                                      <div class="testName"> <?php echo get_string('testingbrowser'); ?> </div>

                                      <!-- <div class="progress"> Progressing .... </div> -->

                                      <div class="result"> </div>

                                      <div id="browserButtons" class="button clearfix"><button type="button" class="next btn btn-default">Next</button> </div>
                                  </div>

                                  <div id="vcBandWidthCheck" class="precheck bandwidth">
                                      <div class="testName"> <?php echo get_string('testinginternetspeed'); ?></div>

                                      <!-- <div class="progress"> Progressing....</div> -->

                                      <div class="result"> <img src="<?php echo $whiteboardpath.'images/progressbar.gif'; ?>" /> </div>
                                      <div id="bandwidthButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button>  <button type="button" class="next btn btn-default">Next</button> </div>
                                  </div>


                                  <div id="vcSpeakerCheck" class="precheck speaker">
                                        <div class="testName"> <?php echo get_string('testingspeaker'); ?>  </div>
                                        <!-- <div class="progress"> Progressing....</div> -->
                                        <audio id="vcSpeakerCheckAudio">
                                            <source src="<?php echo $whiteboardpath.'audio/audio_music.ogg'; ?>"  type="audio/ogg">
                                            <source src="<?php echo $whiteboardpath.'audio/audio-music.mp3'; ?>"  type="audio/mpeg">
                                        </audio>
                                        <div class="result"> </div>
                                        <div id="speakerButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button> <button type="button" class="next btn btn-default">Next</button> </div>

                                  </div>

                                  <div id="vcMicCheck" class="precheck mic">
                                        <div class="testName">  <?php echo get_string('testingmichrophone'); ?> </div>
                                        <!-- <div class="progress"> Progressing....</div> -->
                                        <div id="audioVisualaizerCont">
                                            <canvas id="audioVisualaizer" class="visualizer" width="60" ></canvas>
                                        </div>

                                        <div class="result"> </div>


                                        <div id="micButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button>  <button type="button" class="next btn btn-default">Next </button> </div>

                                  </div>

                                  <div id="vcWebCamCheck" class="precheck webcam">
                                        <div class="testName">  <?php echo get_string('testingwebcam'); ?> </div>
                                        <!-- <div class="progress"> Progressing....</div> -->
                                        <div id="webcamTempVideoCon">
                                          <video id="webcamTempVideo"></video>
                                        </div>
                                        <div class="result"> </div>

                                        <div id="joinSession" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button> <button type="button" class="next btn btn-default">Join Session</button> </div>

                                  </div>

                               </div>
                          </div>

                        </div>
                      </div>

                </div>

            </div>

        </div>

     <div id="virtualclassApp">
         <?php

    $adarr = array('0' => 'deactive', '1' => 'active');
    $audactive = '0';
    if(isset($_GET['audio'])){
        if($_GET['audio'] == '0' || $_GET['audio'] == '1'){
            $audactive = $_GET['audio'];
        }
    }

    $audactive = $adarr[$audactive];


    ?>
    <!-- virtualclass right panel start -->

    <div id="virtualclassAppRightPanel" class="rightbar">
        <div id="audioWidget">
            <?php
            if($audactive == 'deactive'){
                $dap = "false";
                $classes = "audioTool";
                $speakermsg = "Enable Speaker";
                $speakerimg = $whiteboardpath . "images/speakerpressing.png";
                $audio_tooltip =  get_string('enableAudio');
            } else {
                $classes = "audioTool";
                $speakermsg = "Disable Speaker";
                //$dap = "true"; //display audio
                $dap = "true";
                $speakerimg = $whiteboardpath . "images/speakerpressingactive.png";
                $audio_tooltip =  get_string('disableAudio');

            }

            $classes .= ' ' .$audactive;

            ?>

            <div id="mainAudioPanel">
                <div id="speakerPressOnce" class="<?php echo $classes; ?>" data-audio-playing="<?php echo $dap;?>">
                    <a id="speakerPressonceAnch" class="tooltip" data-title="<?php echo $audio_tooltip; ?>" name="speakerPressonceAnch">
                    <span id="speakerPressonceLabel" class="silenceDetect" data-silence-detect="stop"> <i> </i> </span>

                    </a>
                </div>
                <div id="videoPacketInfo">
                        <span id="videoSpeed">
                        <span id="videSpeedNumber" class="suggestion tooltip" data-suggestion="<?php echo $suggestion; ?>"  data-title="<?php echo get_string('proposedspeed'); ?>">  </span>
                        <span id="videLatency" class="latency  tooltip" data-latency="<?php echo $latency; ?>" data-title="<?php echo get_string('audiolatency'); ?>">  </span>
                        <span id="videoFrameRate" class="quality  tooltip" data-quality="<?php echo $quality; ?>" data-title="<?php echo get_string('videoquality'); ?>"> </span>
                    </span>
                </div>
            </div>
        </div>

        <div id="videoHostContainer">
                <?php if($role == 't') { ?>
                    <video id="videoHostSource" autoplay=""> </video>

                        <!--
                            <div id="videoPacketInfo">
                                <span id="videoSpeed"><b >Proposed Speed : </b> <span id="videSpeedNumber"> Low </span> <br />
                                    <b> Audio Latency  : </b> <span id="videLatency"> Fast </span> <br />
                                    <b> Video Quality : </b> <span id="videoFrameRate"> High </span>

                                </span>
                            </div>
                        -->

                        <canvas id="videoHost"> </canvas>
                        <canvas id="videoHostSlice"> </canvas>

                <?php } else {
                ?>
                    <div id="fromServer">
                        <!-- <canvas id="videoParticipate" width="320" height="240"> </canvas> -->
                        <canvas id="videoParticipate" > </canvas>
                        <!--
                        <div id="videoPacketInfo">
                            <span id="videoSpeed"><b >Proposed Speed : </b> <span id="videSpeedNumber"> Low </span> <br />
                                <b> Audio Latency  : </b> <span id="videLatency"> Slow </span> <br />
                                <b> Video Quality : </b> <span id="videoFrameRate"> Low </span>

                            </span>
                        </div>
                        -->

                    </div>
                <?php
                    }
            ?>
        </div>

        <div id="chatWidget">
            <div id = "stickycontainer"> </div>
            <div id ="congreaChatCont"></div>
        </div>
    </div>

     <div id="virtualclassAppLeftPanel" class="leftbar">

        <?php
            if($isplay){
                ?>

                    <div id="playControllerCont">
                        <div id="playController">
                            <div id="recPlayCont" class="recButton"> <button id="recPlay" class="icon-play tooltip" data-title="Play"></button></div>
                            <div id="recPauseCont" class="recButton "> <button id="recPause" class="icon-pause tooltip" data-title="Pause"></button></div>
                            <div id="ff2Cont" class="recButton"> <button id="ff2" class="ff icon-forward tooltip" data-title="Fast Forward 2"></button></div>
                            <div id="ff8Cont" class="recButton"> <button id="ff8" class="ff icon-fast-forward tooltip" data-title="Fast Forward 8"></button></div>
                            <div id="playProgress"> <div id="playProgressBar" class="progressBar" style="width: 0%;"></div> </div>
                            <div id="repTimeCont"> <span id="tillRepTime">00:00</span> / <span id="totalRepTime">00:00</span> </div>
                       </div>
                       <div id="replayFromStart"> <button  class="ff icon-Replayfromstart tooltip" data-title="Replay from Start."></button> </div>
                   </div>

        <?php
            }
        ?>

        <div id="virtualclassWhiteboard" class="virtualclass">

           <div id="vcanvas" class="socketon">

            <div id="containerWb">

            </div>

            <!-- this need to be deleted -->
            <div id="mainContainer">
                <div id="packetContainer" >

                </div>

                <div id="informationCont">

                </div>
            </div>

            <div class="clear"></div>
          </div>

        </div>
         
          <!-- Fine Uploader Gallery template
                        ====================================================================== -->
                        <script type="text/template" id="qq-template-gallery">

                            <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
                            <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
                            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
                            </div>
                            <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
                            <span class="qq-upload-drop-area-text-selector"></span>
                            </div>
                            <div class="qq-upload-button-selector qq-upload-button">
                            <div>Upload a file</div>
                            </div>
                            <span class="qq-drop-processing-selector qq-drop-processing">
                            <span>Processing dropped files...</span>
                            <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
                            </span>
                            <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
                            <li>
                            <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
                            <div class="qq-progress-bar-container-selector qq-progress-bar-container">
                            <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
                            </div>
                            <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
                            <div class="qq-thumbnail-wrapper">
                            <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
                            </div>
                            <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
                            <button type="button" class="qq-upload-retry-selector qq-upload-retry">
                            <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
                            Retry
                            </button>

                            <div class="qq-file-info">
                            <div class="qq-file-name">
                            <span class="qq-upload-file-selector qq-upload-file"></span>
                            <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>
                            </div>
                            <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                            <span class="qq-upload-size-selector qq-upload-size"></span>
                            <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                            <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
                            </button>
                            <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                            <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
                            </button>
                            <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                            <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
                            </button>
                            </div>
                            </li>
                            </ul>

                            <dialog class="qq-alert-dialog-selector">
                            <div class="qq-dialog-message-selector"></div>
                            <div class="qq-dialog-buttons">
                            <button type="button" class="qq-cancel-button-selector">Close</button>
                            </div>
                            </dialog>

                            <dialog class="qq-confirm-dialog-selector">
                            <div class="qq-dialog-message-selector"></div>
                            <div class="qq-dialog-buttons">
                            <button type="button" class="qq-cancel-button-selector">No</button>
                            <button type="button" class="qq-ok-button-selector">Yes</button>
                            </div>
                            </dialog>

                            <dialog class="qq-prompt-dialog-selector">
                            <div class="qq-dialog-message-selector"></div>
                            <input type="text">
                            <div class="qq-dialog-buttons">
                            <button type="button" class="qq-cancel-button-selector">Cancel</button>
                            <button type="button" class="qq-ok-button-selector">Ok</button>
                            </div>
                            </dialog>
                            </div>

                        </script>
                        
        </div>



    <!-- virtualclass right panel end -->
        <div id="popupContainer">
            <div id="about-modal" class="rv-vanilla-modal">

                <!-- for uploading progress bar -->

                <div id="recordingContainer" class="popupWindow">

                    <div class="rv-vanilla-modal-header group" id="recordingHeaderContainer">
                        <h2 class="rv-vanilla-modal-title" id="recordingHeader"> <?php echo get_string('uploadsession'); ?> </h2>
                    </div>

                    <div class="rv-vanilla-modal-body">

                        <div id="progressContainer">

                            <div id="totProgressCont">
                                <div id="totalProgressLabel"> <?php echo get_string('totalprogress'); ?> </div>

                                <div id="progress">
                                    <div id="progressBar" class="progressBar"></div>
                                    <div id="progressValue" class="progressValue"> 0%</div>
                                </div>
                            </div>

                            <div id="indvProgressCont">
                                <div id="indvProgressLabel"> <?php echo get_string('indvprogress'); ?> </div>

                                <div id="indProgress">
                                    <div id="indProgressBar" class="progressBar">
                                    </div>

                                    <div id="indProgressValue" class="progressValue"> 0%
                                    </div>
                                </div>


                            </div>

                        </div>

                        <div id="recordFinishedMessageBox">
                            <span id="recordFinishedMessage">  <?php echo get_string('uploadedsession'); ?></span>
                            <span id="recordingClose" class="icon-close"></span>

                        </div>

                    </div>

                </div>

                <!-- for play window -->
                <div id="recordPlay" class="popupWindow">
                    <div class="rv-vanilla-modal-body">
                        <div id="downloadPcCont">
                            <div id="downloadSessionText"> <?php echo get_string('downloadsession'); ?> </div>

                            <div id="downloadPrgressLabel"> <?php echo get_string('overallprogress'); ?>  </div>
                            <div id="downloadProgress">
                                <div id="downloadProgressBar" class="progressBar"></div>
                                <div id="downloadProgressValue" class="progressValue"> 0% </div>
                            </div>

                        </div>

                        <div id="askPlay">
                            <div id="askplayMessage"> </div>

                             <button id="playButton" class="icon-play"><?php echo get_string('play'); ?> </button>

                        </div>
                    </div>
                 </div>


             <!--for replay window -->
             <div id="replayContainer" class="popupWindow">
                 <p id="replayMessage"><?php echo get_string('replay_message'); ?>  </p>
                 <div id="replayClose" class="close icon-close"></div>
                 <button id="replayButton" class="icon-repeat"><?php echo get_string('replay'); ?> </button>

             </div>

             <!--For confirm window-->
              <div id="confirm" class="popupWindow simple-box">
              </div>

               <!-- For Session End window -->
               <div id="sessionEndMsgCont" class="popupWindow">
               <span id="sessionEndClose" class="icon-close"></span>

               <span id="sessionEndMsg"> <?php echo get_string('sessionendmsg'); ?> </span>
               </div>

                <!--For confirm window-->
                <div id="waitMsgCont" class="popupWindow">
                    <span id="waitMsg"> <?php echo get_string('waitmsgconnect'); ?> </span>
                </div>

            </div>

             <!--For wait message window-->
        </div>

    </div>
    </div>
    </body>
    </html>
<?php

}
// Lib Functions
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
    if ($result === false) {
        echo 'Curl error: ' . curl_error($ch);
        exit;
    }
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
