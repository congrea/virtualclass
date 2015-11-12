<!DOCTYPE html>
<html>
<head>
<title>Virtual Class</title>
<?php
// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

include('en.php');
include('auth.php');

function get_string($phrase){
    global $string;
    $lang = $string;
    return $lang[$phrase];
}



//the www path for virtualclass
//$whiteboardpath = "https://loc.vidya.io/virtualclass/";
$whiteboardpath = "https://local.vidya.io/virtualclass/";

if(isset($_GET['theme'])){
    $theme = $_GET['theme'];
} else {
    $theme = 'white';
}

$pt = array('0' => 'disable', '1' => 'enable');

$pushtotalk = '0';
if(isset($_GET['pt'])){
    if($_GET['pt'] == '0' || $_GET['pt'] == '1'){
        $pushtotalk = $_GET['pt'];
    }
}

$pushtotalk = $pt[$pushtotalk];


?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."codemirror/lib/codemirror.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."bundle/jquery/css/base/".$theme."_jquery-ui.css" ?> />



<?php
$cssdebug = 0;

//define the script root
define( 'SCRIPT_ROOT', $whiteboardpath);
if($cssdebug){
    echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/styles.css">';
    echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/popup.css">';
    echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/jquery.ui.chatbox.css">';
    echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'/vceditor.css">';
} else {
	 echo '<link rel="stylesheet" type="text/css" href="'.SCRIPT_ROOT.'css/'.$theme.'.min.css">';
}
?>



<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">


<style>
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


<?php
include('js.debug.php');

//include('js.php');
// this url should be soemthing like this
// https://loc.vidya.io/virtualclass/example/index.php?id=103&r=t&name=moh&room=1422#

$isplay = false;

$cont_class = '';

if(isset($_GET['play']) && ($_GET['play'] == 'true')){
    $isplay = true;
    $cont_class .=  "playMode ";
}
    
if(isset($_GET['id'])){
    $uid = $_GET['id'];
    $sid = $uid;
}else{
    $uid = 100;
    $sid = 100;
}



if(isset($_GET['r'])){
    $r = $_GET['r'];
    if($r == 't' &&  !$isplay){
        $cont_class .= "teacher orginalTeacher";
    }else{
        $r = 's';
        $cont_class .= 'student';
    }
}else{
    $r = 's';
    $cont_class .= 'student';
}

 $cont_class  .=  ' pt_' . $pushtotalk;

$room = (isset($_GET['room'])) ? $_GET['room'] : '215';
//echo $room;
if(isset($_GET['name'])){
    $uname = $_GET['name'];
//    $fname = $uname;
//    $lname = $uname + ' lastname';
}else{
    $uname = 'My name';
//    $fname = $uname;
//    $lname = $uname + ' lastname';
}
if(isset($_GET['lname'])){
    $lname = $_GET['lname'];
}else{
    $lname = '';
}
?>
<script type="text/javascript">	
    if (!!window.Worker) {
        var sworker = new Worker("<?php echo $whiteboardpath."worker/screenworker.js" ?>");
        var mvDataWorker = new Worker("<?php echo $whiteboardpath."worker/json-chunks.js" ?>");
        var dtConWorker = new Worker("<?php echo $whiteboardpath."worker/storage-array-base64-converter.js" ?>");

    }
    
    <?php echo "wbUser.virtualclassPlay='$isplay';"; ?>
	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='".$room."';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	<?php echo "wbUser.vcSid='1';"; ?>
	<?php // echo "wbUser.fname='".$fname."';"; ?>

    <?php echo "wbUser.lname='".$lname."';"; ?>
	window.io = io;
    

    window.whiteboardPath =  'https://local.vidya.io/virtualclass/';

    window.importfilepath = window.whiteboardPath + 'import.php';
    window.exportfilepath = window.whiteboardPath + 'export.php';
    wbUser.imageurl = window.whiteboardPath + "images/quality-support.png"
</script>

</head>

<body>
    <!--
    <div id="dummyPlayCont">

    </div>
    -->

<div id="virtualclassCont" class="<?php echo $cont_class; ?>">
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
    
<!--    <div id="virtualclassYts" class="virtualclass" width="1400px" height="1200px">
        <div id="player"></div>
    </div>-->

<?php

$adarr = array('0' => 'deactive', '1' => 'active');
$audactive = '0';
if(isset($_GET['ad'])){
    if($_GET['ad'] == '0' || $_GET['ad'] == '1'){
        $audactive = $_GET['ad'];
    }
}

$audactive = $adarr[$audactive];


?>

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
        
        <div id="alwaysPress">
              <div class="<?php echo $classes; ?>" id="speakerPressing">
<!--                <a data-title="<?php echo get_string('pressAlwaysToSpeak') ?>  class="tooltip" id="speakerPressingAnch"
                name="speakerPressingAnch"><?php echo get_string('pushtotalk') ?></a>-->
                <a id="speakerPressingAnch" name="speakerPressingAnch">
                    <div id="speakerPressingButton" class="icon-speakerPressing"></div>
                    <div style="clear:both;"></div>
                    <div id="speakerPressingtext">&nbsp;Push 
                    
                    <br >To<br >Talk </div> &nbsp; &nbsp;
<!--                <img id="speakerPressingButton" src="<?php //echo $speakerimg; ?>" />-->
                
                </a>
              </div>
        </div>

        
    </div>
    
<!--    <div class="audioTool" id="silenceDetect" data-silence-detect="stop">
        
    </div>-->
    <div id="audioTest-box">
    <div class="audioTool" id="audioTest">
      <a data-title="<?php echo get_string('tpAudioTest') ?>" class="tooltip" id="audiotestAnch" name=
      "audiotestAnch">
<!--          <img src="<?php echo $whiteboardpath.'images/audiotest.png'; ?>" id="audiotestImg" /><br />Test-->
          <span id="audiotestImg" class="icon-audiotest"></span>
      </a>
    </div>
    </div>
    
</div>
    


<div id="chatWidget"> 
    <div id = "stickycontainer"> </div>
</div>
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
                        <span id="recordFinishedMessage">  <?php echo get_string('uploadedsession'); ?>. </span>
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

</body>
</html>
