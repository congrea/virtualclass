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
 * Prints a particular instance of newmodule
 *
 * You can have a rather longer description of the file as well,
 * if you like, and it can span multiple lines.
 *
 * @package    mod_newmodule
 * @copyright  2011 Your Name
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/// (Replace newmodule with the name of your module and remove this line)

include('auth.php');

?>


<link rel="stylesheet" type="text/css" href="../css/styles.css">



<?php

//the www path for whiteboard
$whiteboard_path = "https://local.vidya.io/virtualclass/";
?>

<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/styles.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."bundle/jquery/css/base/jquery-ui.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboard_path."css/jquery.ui.chatbox.css" ?> />
<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">


<?php
include('js.debug.php');
//include('js.php');

?>




<?php

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/c190214.js'));

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/min.js'));
// Output starts here

$r = 's';
$sid = 102;
$uid = 102;
//$r = 's';

$uname = "studnet2";
$fname = "Student2";
$lname = "Student2";

?>
<script type="text/javascript">	
    if (!!window.Worker) {
        var sworker = new Worker("<?php echo $whiteboard_path."src/screenworker.js" ?>");
    }
    <?php echo "name='".$uname."';"; ?>
    <?php echo "id='".$uid."';"; ?>
    <?php echo "sid='".$sid."';";?>
    <?php echo "fname='".$fname."';"; ?>
    <?php echo "lname='".$lname."';"; ?>

	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='215';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	
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
    <div id="speakerStudent">
      <div class="audioTool deactive" id="speakerPressing">
        <a data-title="Press always to speak" class="tooltip" id="speakerPressingAnch"
        name="speakerPressingAnch"><img src=
        "https://local.vidya.io/virtualclass/images/speakerpressing.png"
        id="speakerPressingImg" /></a>
      </div>
    </div>

    <div data-audio-playing="false" class="audioTool deactive" id="speakerPressOnce">
      <a data-title="Press once to speak" class="tooltip" id="speakerPressonceAnch" name=
      "speakerPressonceAnch"><img src=
      "https://local.vidya.io/virtualclass/images/speakerpressonce.png"
      id="speakerPressonceImg" /></a>
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

