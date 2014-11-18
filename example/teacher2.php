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

include('auth.php') ;

?>


<link rel="stylesheet" type="text/css" href="../css/styles.css">


<?php
//the www path for whiteboard
$whiteboard_path = "http://192.168.1.118/whiteboard/";
//include('js.php') ;
include('js.debug.php');
//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/c190214.js'));

//$PAGE->requires->js(new moodle_url($CFG->wwwroot .'/mod/onetoone/whiteboard/js/min.js'));
// Output starts here

$r = 't';
$sid = 12;
//$r = 's';
?>
	
	<script type="text/javascript">
	<?php echo "wbUser.name='teache2';"; ?>
	<?php echo "wbUser.id='4';"; ?>
	<?php echo "wbUser.socketOn='1';"; ?>
	<?php echo "wbUser.dataInfo='1';"; ?>
	<?php echo "wbUser.room='215';"; ?>
	<?php echo "wbUser.sid='".$sid."';"; ?>
	<?php echo "wbUser.role='".$r."';"; ?>
	
	window.io = io;
    //the www path for whiteboard
    var whiteboardPath =  'http://192.168.1.114/whiteboard/';
	</script>

   <div id="vcanvas" class="socketon teacher" >
    <div id="containerWb">
      
    </div>

    <div id="videos">
      <div id="videoContainer" style="z-index: 2;">
        

        <div class="dynDiv_resizeDiv_tl" style="cursor: nw-resize;"></div>

        <div class="dynDiv_moveParentDiv" style="cursor: move;">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <video id="localVideo" autoplay=""></video>
<video id="remoteVideo" class="remoteVideo" autoplay=""> </video>
        </div>

        <div class="clear"></div>
      </div>
    </div>

    <div id="mainContainer">
      <h4 id="dataInfoHeading">Data Details</h4>

      <div id="packetContainer">
        <div id="dataInformation">
          <div id="blankDiv">
            &nbsp;<br />
            &nbsp;
          </div>

          <div id="perSecData">
            Per Second
          </div>

          <div id="totalDataLabel">
            Total
          </div>
        </div>

        <div id="sendPackCont">
          <div id="sentPacketsLabel">
            Sent<br />
            <span>Packets</span>
          </div>

          <div id="sendPackPsCont">
            <div id="sentPacketPS">
              0
            </div>
          </div>

          <div id="totSendPackCont">
            <div id="sentPacket">
              14391
            </div>
          </div>
        </div>

        <div id="receivePackCont">
          <div id="receivedPacketsLabel">
            Received<br />
            <span>Pacekts</span>
          </div>

          <div id="receivePackPsCont">
            <div id="receivedNumberPS">
              0
            </div>
          </div>

          <div id="totReceivedPackCont">
            <div id="receivedNumber">
              0
            </div>
          </div>
        </div>
      </div>

      <div id="informationCont">
        <div id="sentMsgInfoContainer">
          <label>Sent Message<br />
          <span>Information</span></label>

          <div id="sentMsgInfo"></div>
        </div>

        <div id="receivedMsgInfoContainer">
          <label>Received Message<br />
          <span>information</span></label>

          <div id="rcvdMsgInfo"></div>
        </div>
      </div>
    </div>

    <div class="clear"></div>
  </div>


