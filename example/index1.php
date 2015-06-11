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
$whiteboardpath = "https://lc.vidya.io/suman-repo/virtualclass/";

?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/styles.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/popup.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."bundle/jquery/css/base/jquery-ui.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/jquery.ui.chatbox.css" ?> />

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."codemirror/lib/codemirror.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/jquery.ui.chatbox.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/vceditor.css" ?> />

<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">



<style>
  .CodeMirror { height: auto; border: 1px solid #ddd; }
  .CodeMirror pre { padding-left: 7px; line-height: 1.25; }
</style>



<?php
include('js.debug.php');
//include('js.php');
// this url should be soemthing like this
// https://lc.vidya.io/virtualclass/example/index.php?id=103&r=t&name=moh&room=1422#

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


//$r = (isset($_GET['r'])) ? $_GET['r'] : 's';
if(isset($_GET['r'])){
    $r = $_GET['r'];
    if($r == 't' &&  !$isplay){
        $cont_class .= "teacher orginalTeacher";
    }else{
        $r = 's';
        $cont_class .= 'student';
    }
//    $cont_class = ($r == 't' &&  !$isplay) ? "teacher orginalTeacher" : 'student';
}else{
    $r = 's';
    $cont_class .= 'student';
}



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
    }
    
    <?php echo "wbUser.virtualclassPlay='$isplay';"; ?>
	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='".$room."';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	<?php // echo "wbUser.fname='".$fname."';"; ?>
    <?php echo "wbUser.lname='".$lname."';"; ?>
	window.io = io;
    
    window.whiteboardPath =  'https://lc.vidya.io/suman-repo/virtualclass/';
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
        <div id="playController">
            <div id="playProgress"> <div id="playProgressBar" class="progressBar" style="width: 0%;"></div> </div>
            <div id="recPlayCont" class="recButton"> <button id="recPlay"> Play </button></div>
            <div id="recPlayCont" class="recButton"> <button id="recPause"> Pause </button></div> 
            <div id="ff2Cont" class="recButton"> <button id="ff2" class="ff"> FF2 </button></div>
            <div id="ff8Cont" class="recButton"> <button id="ff8" class="ff"> FF8 </button></div>
            <div id="repTimeCont"> <span id="tillRepTime">0 </span> / <span id="totalRepTime">0</span> </div> 
        </div>
    <?php
        }
    ?>
    
    <div id="virtualclassWhiteboard" class="virtualclass">

       <div id="vcanvas" class="socketon">

        <div id="containerWb">

        </div>


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

<div id="audioWidget">
    <?php 
    if($r == 's'){
        $dap = "false";
        $classes = "audioTool deactive";
        $speakermsg = "Enable Speaker";
        $speakerimg = $whiteboardpath . "images/speakerpressing.png";
    } else {
        $classes = "audioTool active";
        $speakermsg = "Disable Speaker";
        //$dap = "true"; //display audio 
        $dap = "true";
        $speakerimg = $whiteboardpath . "images/speakerpressingactive.png";
    }?>
    
    <div id="mainAudioPanel">
        <div id="speakerPressOnce" class="<?php echo $classes; ?>" data-audio-playing="<?php echo $dap;?>">
        
<a id="speakerPressonceAnch" class="tooltip" data-title="Enable Audio" name="speakerPressonceAnch">
<span id="speakerPressonceLabel" class="silenceDetect" data-silence-detect="stop"> <i> </i> </span>

</a>
            
            
        </div>
        
        <div id="alwaysPress">
              <div class="<?php echo $classes; ?>" id="speakerPressing">
<!--                <a data-title="Press always to speak" class="tooltip" id="speakerPressingAnch"
                name="speakerPressingAnch">Push To Talk</a>-->
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
      <a data-title="Test Audio" class="tooltip" id="audiotestAnch" name=
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

            <div id="progressBarContainer">
                <div class="rv-vanilla-modal-header group">
                    <h2 class="rv-vanilla-modal-title"> <?php echo get_string('uploadsession'); ?> </h2>
                </div>

                <div class="rv-vanilla-modal-body">
                    <div style="width:200px; padding:50px;">
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
                </div>
                
                

            </div>
            
                <div id="waitPlay">
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
                            <button id="playButton">Play</button>
                        </div>
                        
                    </div>
                    
                </div>
            
        </div>
        
    </div>
</div>
</body>
</html>
