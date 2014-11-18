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
$whiteboard_path = "https://192.168.1.114/whiteboard/";
include('js.debug.php');
//include('js.php');
//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/c190214.js'));

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/min.js'));
// Output starts here

$r = 's';
$sid = 102;
$uid = 102;
//$r = 's';

$uname = "Student2";

?>
<script type="text/javascript">	
    <?php echo "name='".$uname."';"; ?>
    <?php echo "id='".$uid."';"; ?>
    <?php echo "sid='".$sid."';";?>
</script>

<script type="text/javascript">
	<?php echo "wbUser.name='$uname';"; ?>
	<?php echo "wbUser.id='".$uid."';"; ?>
	<?php echo "wbUser.socketOn='0';"; ?>
	<?php echo "wbUser.dataInfo='0';"; ?>
	<?php echo "wbUser.room='215';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	
	window.io = io;
    window.whiteboardPath =  'https://192.168.1.114/whiteboard/';
    var encMode = "alaw"; 
</script>


<div id="vAppCont">

 
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
    
<div id="widgetRightSide">
    <div id="allVideosCont">
<!--        <canvas id="tempVideo"> </canvas> 
        <div class="videoWrapper">
            <div class="videoSubWrapper" data-uname = "<?php //echo $uname; ?>" id="<?php //echo 'user'.$uid; ?>">
                <video id="video<?php //echo $uid?>"  autoplay>    </video>
            </div>
        </div>-->
        
        
    </div>

    <div id="chatContainer">
    </div>
    
</div> 

<div id="chatWidget"> 
    <div id = "stickycontainer"> </div>
</div>   
    
</div>
