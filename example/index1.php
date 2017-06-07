<!DOCTYPE html>
<html>
    <head>
        <title>Virtual Class</title>
        <?php
        // This file is part of Vidyamantra - http:www.vidyamantra.com/
        /*         * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
         * @author  Suman Bogati <http://www.vidyamantra.com>
         */

        include('en.php');
        include('auth.php');

        function get_string($phrase) {
            global $string;
            $lang = $string;
            return $lang[$phrase];
        }

//the www path for virtualclass
        $whiteboardpath = "https://local.vidya.io/congrea_te_online/";
//$whiteboardpath = "http://local.vidya.io/virtualclass/";

        if (isset($_GET['themecolor'])) {
            $theme = $_GET['themecolor'];
        } else {
            $theme = 'white';
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
        ?>
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/bootstrap/css/bootstrap.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "codemirror/lib/codemirror.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "bundle/jquery/css/base/" . $theme . "_jquery-ui.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/pbar.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/progress.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "css/custom.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "poll/graphs/c3.css" ?> />
        <link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath . "SlickQuiz/css/slickQuiz.css" ?> />

        <?php
        $cssdebug = 1;

        //define the script root
        define('SCRIPT_ROOT', $whiteboardpath);

        if ($cssdebug) {
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '/styles.css">';
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '/popup.css">';
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '/jquery.ui.chatbox.css">';
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '/vceditor.css">';
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '/document-share.css">';
        } else {
            echo '<link rel="stylesheet" type="text/css" href="' . SCRIPT_ROOT . 'css/' . $theme . '.min.css">';
        }
        ?>
        <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">
        <style>

            @font-face {
                font-family: 'icomoon';
                src:url('/congrea_te_online/fonts/icomoon.eot?-jjdyd0');
                src:url('/congrea_te_online/fonts/icomoon.eot?#iefix-jjdyd0') format('embedded-opentype'), url('/congrea_te_online/fonts/icomoon.woff?-jjdyd0') format('woff'), url('/congrea_te_online/fonts/icomoon.ttf?-jjdyd0') format('truetype'), url('/congrea_te_online/fonts/icomoon.svg?-jjdyd0#icomoon') format('svg');
                font-weight: normal;
                font-style: normal;
            }

            .CodeMirror { height: auto; border: 1px solid #c9c9c9; }
            .CodeMirror pre { padding-left: 7px; line-height: 1.25; }

            .CodeMirror { height: auto; border: 1px solid #ddd; }
            .CodeMirror pre { padding-left: 7px; line-height: 1.25; }

            /* this should be apply for only core virtualclassm, not with any other software */
            html, body {
                margin : 0;
                padding : 0;
            }

        </style>

        <link href="https://vjs.zencdn.net/5.8.8/video-js.css" rel="stylesheet">
        <script src="https://vjs.zencdn.net/5.8.8/video.js"></script>
        <!-- If you'd like to support IE8 -->
        <script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>  
        <link href="<?php echo $whiteboardpath . 'fileuploader/js/fine-uploader-gallery.css'; ?>" rel="stylesheet">

        <!-- Fine Uploader JS file
        ====================================================================== -->

        <script src ="<?php echo $whiteboardpath . 'fileuploader/js/fine-uploader.js'; ?>"></script>



        <?php
        include('js.debug.php');
//include('js.php');
// this url should be soemthing like this
// https://loc.vidya.io/virtualclass/example/index.php?id=103&r=t&name=moh&room=1422#

        $isplay = false;

        $cont_class = 'congrea ';

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

        $cont_class .= ' pt_' . $pushtotalk;

        $room = (isset($_GET['room'])) ? $_GET['room'] : '215';
//echo $room;
        if (isset($_GET['name'])) {
            $uname = $_GET['name'];
//    $fname = $uname;
//    $lname = $uname + ' lastname';
        } else {
            $uname = 'My name';
//    $fname = $uname;
//    $lname = $uname + ' lastname';
        }
        if (isset($_GET['lname'])) {
            $lname = $_GET['lname'];
        } else {
            $lname = '';
        }
        ?>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
        <script src="<?php echo $whiteboardpath . "poll/graphs/c3.js" ?>"></script>

        <script type="text/javascript">
            if (!!window.Worker) {
                var sworker = new Worker("<?php echo $whiteboardpath . "worker/screenworker.js" ?>");
                var mvDataWorker = new Worker("<?php echo $whiteboardpath . "worker/json-chunks.js" ?>");
                var dtConWorker = new Worker("<?php echo $whiteboardpath . "worker/storage-array-base64-converter.js" ?>");
                var webpToPng = new Worker("<?php echo $whiteboardpath . "worker/webptopng.js" ?>");

            }
$ts = (isset($_GET['ts'])) ? $_GET['ts'] : false;

<?php echo "wbUser.virtualclassPlay='$isplay';"; ?>
<?php echo "wbUser.name='$uname';"; ?>
<?php echo "wbUser.id='" . $uid . "';"; ?>
<?php echo "wbUser.socketOn='0';"; ?>
<?php echo "wbUser.dataInfo='0';"; ?>
<?php echo "wbUser.room='" . $room . "';"; ?>
<?php echo "wbUser.sid='" . $sid . "';"; ?>
<?php echo "wbUser.ts='" . $ts . "';"; ?>
<?php echo "wbUser.role='" . $r . "';"; ?>
<?php echo "wbUser.vcSid='1';"; ?>
<?php echo "wbUser.anyonepresenter='" . $anyonepresenter . "';"; ?>

<?php // echo "wbUser.fname='".$fname."';";   ?>

<?php echo "wbUser.lname='" . $lname . "';"; ?>
            window.io = io;


            window.whiteboardPath = 'https://local.vidya.io/congrea_te_online/';

            window.importfilepath = window.whiteboardPath + 'import.php';
            window.exportfilepath = window.whiteboardPath + 'export.php';
            wbUser.imageurl = window.whiteboardPath + "images/quality-support.png";


        </script>


    </head>

    <body>
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
                                           <ul class="progressbar" id = "congProgressbar"> 
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

                                            <div class="result"> <img src="<?php echo $whiteboardpath . 'images/progressbar.gif'; ?>" /> </div>
                                            <div id="bandwidthButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button>  <button type="button" class="next btn btn-default">Next</button> </div>
                                        </div>


                                        <div id="vcSpeakerCheck" class="precheck speaker">
                                            <div class="testName"> <?php echo get_string('testingspeaker'); ?>  </div>
                                            <!-- <div class="progress"> Progressing....</div> -->
                                            <audio id="vcSpeakerCheckAudio">
                                                <source src="<?php echo $whiteboardpath . 'audio/audio_music.ogg'; ?>"  type="audio/ogg">
                                                <source src="<?php echo $whiteboardpath . 'audio/audio-music.mp3'; ?>"  type="audio/mpeg">
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
                if (isset($_GET['audio'])) {
                    if ($_GET['audio'] == '0' || $_GET['audio'] == '1') {
                        $audactive = $_GET['audio'];
                    }
                }

                $audactive = $adarr[$audactive];
                ?>
                <!-- virtualclass right panel start -->

                <div id="virtualclassAppRightPanel" class="rightbar">
                    <div id="audioWidget">
                        <?php
                        if ($audactive == 'deactive') {
                            $dap = "false";
                            $classes = "audioTool";
                            $speakermsg = "Enable Speaker";
                            $speakerimg = $whiteboardpath . "images/speakerpressing.png";
                            $audio_tooltip = get_string('enableAudio');
                        } else {
                            $classes = "audioTool";
                            $speakermsg = "Disable Speaker";
                            //$dap = "true"; //display audio
                            $dap = "true";
                            $speakerimg = $whiteboardpath . "images/speakerpressingactive.png";
                            $audio_tooltip = get_string('disableAudio');
                        }

                        $classes .= ' ' . $audactive;
                        ?>

                        <div id="mainAudioPanel">
                            <div id="speakerPressOnce" class="<?php echo $classes; ?>" data-audio-playing="<?php echo $dap; ?>">
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
                            <div id="precheckTest" class="prechk">
                                <span id="precheckSetting" class="precheck tooltip" data-title="precheck test ">precheck</span>
                            </div>
                        </div>
                    </div>

                    <div id="videoHostContainer">
                        <?php if ($r == 't') { ?>
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
                    if ($isplay) {
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

                    <title>Fine Uploader Gallery View Demo</title>
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