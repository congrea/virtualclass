<!DOCTYPE html>
<html>
<head>
<title>Virtual Class</title>
<?php
// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
include('auth.php');
//the www path for virtualclass
$whiteboardpath = "https://local.vidya.io/virtualclass/";
?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/styles.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."bundle/jquery/css/base/jquery-ui.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/jquery.ui.chatbox.css" ?> />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">


<?php
include('js.debug.php');
//include('js.php');
// this url should be soemthing like this
// https://local.vidya.io/virtualclass/example/index.php?id=103&r=t&name=moh&room=1422#
    
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
    $cont_class = $r == 't' ? "teacher orginalTeacher" : 'student';
}else{
    $r = 's';
    $cont_class = 'student';
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
    }
   
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
    window.whiteboardPath =  'https://local.vidya.io/virtualclass/';
    wbUser.imageurl = window.whiteboardPath + "images/quality-support.png"
</script>

</head>

<body>
<div id="vAppCont" class="<?php echo $cont_class; ?>">
    <div id="vAppWhiteboard" class="vmApp">

       <div id="vcanvas" class="socketon">

        <div id="containerWb">

        </div>


        <div id="mainContainer">

          <div id="packetContainer">

          </div>

          <div id="informationCont">

          </div>
        </div>

        <div class="clear"></div>
      </div>

    </div>


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
                    <span id="speakerPressingButton" class="icon-speakerPressing"></span>
                    <div style="clear:both;"></div>
                    <span id="speakerPressingtext">Push 
                    
                    <br >  To  <br > Talk </span> &nbsp; &nbsp;
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
</div>
</body>
</html>