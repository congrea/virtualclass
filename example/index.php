<head>
<?php

// This file is part of Vidyamantra - http:www.vidyamantra.com/

/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

include('auth.php');

//the www path for virtualclass
$whiteboard_path = "https://local.vidya.io/virtualclass/";

?>

<link rel="stylesheet" type="text/css" href="../css/styles.css">
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/styles.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."bundle/jquery/css/base/jquery-ui.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/jquery.ui.chatbox.css" ?> />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">


<?php
include('js.debug.php');
//include('js.php');

// this url should be soemthing like this
// https://local.vidya.io/virtualclass/example/index.php?id=1&r=t&name=raju
    
if(isset($_GET['id'])){
    $uid = $_GET['id'];
    $sid = $uid;
}else{
    $uid = 100;
    $sid = 100;
}

$r = (isset($_GET['r'])) ? $_GET['r'] : 's';

$room = (isset($_GET['room'])) ? $_GET['room'] : '215';
//echo $room;

if(isset($_GET['name'])){
    $uname = $_GET['name'];
    $fname = $uname;
    $lname = $uname + ' lastname';
}else{
    $uname = 'My name';
    $fname = $uname;
    $lname = $uname + ' lastname';
}

?>
<script type="text/javascript">	
    if (!!window.Worker) {
        var sworker = new Worker("<?php echo $whiteboard_path."src/screenworker.js" ?>");
    }
	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='".$room."';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	<?php echo "wbUser.fname='".$fname."';"; ?>
    <?php echo "wbUser.lname='".$lname."';"; ?>
	window.io = io;
    window.whiteboardPath =  'https://local.vidya.io/virtualclass/';
    
</script>

</head>
<div id="vAppCont" class="teacher">
    

 
    <div id="vAppWhiteboard" class="vmApp">

       <div id="vcanvas" class="socketon teacher">

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
    ?>
        <div id="speakerStudent">
          <div class="audioTool deactive" id="speakerPressing">
            <a data-title="Press always to speak" class="tooltip" id="speakerPressingAnch"
            name="speakerPressingAnch"><img src=
            "https://local.vidya.io/virtualclass/images/speakerpressing.png"
            id="speakerPressingImg" /></a>
          </div>
        </div>
        
<?php }else{
          $classes = "audioTool active";
          $dap = "true";
      }?>

    <div id="speakerPressOnce" class="<?php echo $classes; ?>" data-audio-playing="<?php echo $dap;?>">
      <a id="speakerPressonceAnch" class="tooltip" data-title="Press once to speak" name=
      "speakerPressonceAnch"><img id="speakerPressonceImg" src=
      "https://local.vidya.io/virtualclass/images/speakerpressonce.png" /></a>
    </div>

    <div class="audioTool" id="audioTest">
      <a data-title="Audio Testing" class="tooltip" id="audiotestAnch" name=
      "audiotestAnch"><img src=
      "https://local.vidya.io/virtualclass/images/audiotest.png"
      id="audiotestImg" /></a>
    </div>

    <div class="audioTool" id="silenceDetect">
      <a data-title="Silence Detection" class="tooltip sdDisable" id="silenceDetectAnch"
      name="silenceDetectAnch"><img src=
      "https://local.vidya.io/virtualclass/images/silencedetectdisable.png"
      id="silencedetectImg" /></a>
    </div>
</div>

<div id="chatWidget"> 
    <div id = "stickycontainer"> </div>
</div>   
    
</div>