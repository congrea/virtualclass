// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

/** CHAT code start from here **/
/*var cssId = 'myCss';
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = window.whiteboardPath+'../bundle/jquery/css/base/jquery-ui.css';
    link.media = 'all';
    head.appendChild(link);
}
var cssId = 'myCss1';
if (!document.getElementById(cssId)){
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = '../css/jquery.ui.chatbox.css';
    link.media = 'all';
    head.appendChild(link);
}
jQuery.cachedScript = function( url, options ) {
    // Allow user to set any option except for dataType, cache, and url
    options = $.extend( options || {}, {
        dataType: "script",
        cache: true,
        url: url
    });
    // Use $.ajax() since it is more flexible than $.getScript
    // Return the jqXHR object so we can chain callbacks
    return jQuery.ajax( options );
};
*/

/** CHAT code end from here **/

//$.when(
    /** CHAT code start from here **/
//    $.cachedScript( "../bundle/io/build/iolib.min.js" ),
//    $.cachedScript( "../csrc/footer.js" ),
//    $.cachedScript( "../csrc/jquery.ui.chatlist.js" ),
//    $.cachedScript( "../csrc/jquery.ui.chatbox.js" ),
//    $.cachedScript( "../csrc/jquery.ui.chatroom.js" ),
//    $.cachedScript( "../csrc/chatboxManager.js" ),
//    $.cachedScript( "../csrc/lib.js" ),
//    $.cachedScript( "../csrc/lang.en.js" )
    
    
    //$.cachedScript( "../build/chat.min.js" )
    /** CHAT code end from here **/

//).done(function(){
    
    $.uiBackCompat = false;
    
//    <?php echo "wbUser.name='$uname';"; ?>
//	<?php echo "wbUser.id='".$uid."';"; ?>
//	<?php echo "wbUser.socketOn='0';"; ?>
//	<?php echo "wbUser.dataInfo='1';"; ?>
//	<?php echo "wbUser.room='215';"; ?>
//	<?php echo "wbUser.sid='".$sid."';"; ?>
//	<?php echo "wbUser.role='".$r."';"; ?>
    
    
    $(document).ready(function(){
       
        window.earlierWidth = window.innerWidth;
        window.earlierHeight = window.innerHeight;
        window.wbUser = wbUser;
        
        
        
        window.pageEnter = new Date().getTime();
        var vApp = new window.vmApp();
        window.vApp = vApp; //make available to vApp object to each file
        
        var appIs = "Whiteboard";
        
        vApp.init(wbUser.role, appIs);
        
        
        if(localStorage.getItem('teacherId') != null){
            if(document.getElementById('speakerStudent') != null){
                vApp.user.displayStudentSpeaker(false);
            }
            
        }
        
        if(window.vApp.error.length > 2){
            window.vApp.error = [];
            return;
        }
        
       //     if ((typeof vcan.teacher == 'undefined') && (!storageHasTeacher) && (e.fromUser.userid == id) && (e.fromUser.userid == joinId)) {
        if ((typeof vcan.teacher == 'undefined') && (!vApp.wb.stHasTeacher)) {
            vApp.wb.utility.makeCanvasDisable();
        }

            //if (e.fromUser.userid == id ){
        vApp.wb.utility.initDefaultInfo(wbUser.role);
        
        if(wbUser.role == 's'){
            var audioEnable = localStorage.getItem('audEnable');
            if(audioEnable != null && audioEnable == 'false'){
                vApp.user.control.audioDisable();
                vApp.gObj.audioEnable = false;
            }
        }
        
        $(document).on("user_logout", function(e){
            removedMemberId = e.fromUser.userid;
            vApp.gObj.video.video.removeUser(removedMemberId);
        });

        $(document).on("member_removed", function(e){
            vApp.wb.utility.userIds = [];
             memberUpdate(e);
        });

        $(document).on("error", function(e){
            vApp.wb.view.removeElement('serverErrorCont');
            window.vApp.wb.view.displayServerError('serverErrorCont', e.message);
            
            if(typeof e.message != 'object'){
                display_error(e.message);
            }
            
        });
        
        var dn = 5;
        function createDemoUserList(){
            var dummyUser = {
                img : "./images/quality-support.png",
                name : "Student " + dn,
                userid : 100 + dn
            }

            duser.push(dummyUser);   
            memberUpdate({message : duser});
            
            dn++;
            if(dn <=30){
                myTimeout = setTimeout(createDemoUserList, 1000);
            }else{
                clearTimeout(myTimeout);
            }
        }
        
        function demoVideoTest(e){
            duser = [];
            duser.push(e.message);
            createDemoUserList();
        }
        
        $(document).on("member_added", function(e){
            
            vApp.wb.clientLen = e.message.length;
            var joinId = e.message[e.message.length - 1].userid;
            vApp.jId = joinId;
            
//            if(joinId ==  vApp.gObj.uid){
//                vApp.gObj.video._handleUserMedia(joinId);
//            }
            
            
            memberUpdate(e, 'added');
            if(typeof vApp.gObj.hasOwnProperty('updateHeight')){
                vApp.gObj.video.updateVidContHeight();
                vApp.gObj.updateHeight = true;
            }
            
//            if(joinId == vApp.gObj.uid && vApp.gObj.uRole == 't'){
//                alert('suman bogati');
//                if(vApp.user.teacherIsAlreadyExist()){
//                    
//                   //  alert('exist');
//                  //  usr.role = 's';
//                    vApp.gObj.uRole = 's';
//                }else{
//                    alert('SSS');
//                    if(document.getElementById('commandToolsWrapper') ==  null){
//                        vApp.user.assignRole(vApp.gObj.uRole, 'Whiteboard');
//                        vcan.utility.canvasCalcOffset(vcan.main.canid);
//                    }
//                }
//            }
            
           // if(joinId == vApp.gObj.uid && vApp.gObj.uRole != 't'){
				
       //         var sp = (vApp.gObj.chat.userChatList.length == 0 ) ? 0 : vApp.gObj.chat.userChatList.length;
         //       vApp.wb.utility.beforeSend({'requestPacketBy' : joinId, sp: sp});
         
                //vApp.wb.utility.beforeSend({'requestImagesBy' : joinId});
            //}
            
            if(vApp.gObj.uRole == 't'){
                //alert(vApp.currApp);
                
                if(vApp.currApp == 'ScreenShare'){
                    var sType = 'ss';
                }else if (vApp.currApp == 'WholeScreenShare'){
                    var sType = 'wss';
                }
                
                if(typeof sType != 'undefined'){
                    //TODO this should be into function
                    var sType = vApp.getDataFullScreen(sType)
                    var createdImg =  vApp.getDataFullScreen('ss');
                    io.sendBinary(createdImg);
                    delete sType;
                }
                
//			    var sp = (vApp.gObj.chat.userChatList.length == 0 ) ? 0 : vApp.gObj.chat.userChatList.length;
//                vApp.wb.utility.beforeSend({'requestPacketBy' : joinId, sp: sp});
            }
            
             //demoVideoTest(e); //for video demo
        });

        $(document).on("binrec", function(e){
            var data_pack = new Uint8Array(e.message);
            
            if(data_pack[0] == 101 || data_pack[0] == 102 || data_pack[0] == 103 || data_pack[0] == 104){
                var stype = 'ss';
                var sTool = 'ScreenShare';
            }else if (data_pack[0] == 201 || data_pack[0] == 202 || data_pack[0] == 203 || data_pack[0] == 204){
                var stype = 'wss';
                var sTool = 'WholeScreenShare';
            }
            
            if (data_pack[0] == 101) { // Audio
                var recmsg = data_pack.subarray(1,data_pack.length);
                
                if(!vApp.gObj.video.audio.otherSound){
                    vApp.gObj.video.audio.play(recmsg, 0 , 0);
                }
                
                return;
                
            //this may not need that we can achieve this by protocol 104    
            }else if(data_pack[0] == 102 || data_pack[0] == 202) { //full image
                
//                if(data_pack[0] == 102){
//                    var stype = 'ss';
//                    var sTool = 'ScreenShare';
//                }else{
//                    var stype = 'wss';
//                    var sTool = 'WholeScreenShare';
//                }
                
                
                var data_pack = new Uint8ClampedArray(e.message);
                var w = numValidateTwo(data_pack[1],data_pack[2]);
                var h = numValidateTwo(data_pack[3],data_pack[4]);
                var recmsg = data_pack.subarray(5,data_pack.length);
                vApp.initStudentScreen(recmsg, {w:w, h:h}, stype, sTool);
                
                return;
            }else if(data_pack[0] == 103 || data_pack[0] == 203) { //slice image
                var data_pack = new Uint8ClampedArray(e.message);
                var s = 7;
                for (var i = 0; (i+7) <= data_pack.length;i=l+1) {
                    var x = numValidateTwo(data_pack[i+1],data_pack[i+2]);
                    var y = numValidateTwo(data_pack[i+3],data_pack[i+4]);
                    var h = parseInt(data_pack[i+5]);
                    var w = parseInt(data_pack[i+6]);
                    var l = s+(h*w)-1;
                    var recmsg = data_pack.subarray(s,l+1);
                    var d = { x:x, y : y, w :w, h : h };
                    vApp.initStudentScreen(recmsg, d, stype, sTool);
                    s=l+7+1;
                }
                
            }else if (data_pack[0] == 104 || data_pack[0] == 204){ //full image with resize
                var data_pack = new Uint8ClampedArray(e.message);
                var dw = numValidateTwo(data_pack[1],data_pack[2]);
                var dh = numValidateTwo(data_pack[3],data_pack[4]);
                var vcw = numValidateTwo(data_pack[5],data_pack[6]);
                var vch = numValidateTwo(data_pack[7],data_pack[8]);
                var recmsg = data_pack.subarray(9,data_pack.length);
                var dimObj = { d : {w : dw, h : dh},  vc : {w : vcw, h : vch}};
                vApp.initStudentScreen(recmsg, dimObj, stype, sTool);
            } else if (data_pack[0] == 11) {
                
                var data_pack = new Uint8ClampedArray(e.message);
                var uid = numValidateFour(data_pack[1],data_pack[2],data_pack[3],data_pack[4]);
                var recmsg = data_pack.subarray(5,data_pack.length);
                vApp.gObj.video.video.playWithoutSlice(uid,recmsg);
                
            }
            function numValidateFour (n1,n2,n3,n4) {
                n1 = preNumValidateTwo(n1);
                n2 = preNumValidateTwo(n2);
                n3 = preNumValidateTwo(n3);
                n4 = preNumValidateTwo(n4);
                var nres = n1+n2+n3+n4;
                return parseInt(nres);
                
            }
            function numValidateTwo (n1,n2) {
                n1 = preNumValidateTwo(n1);
                n2 = preNumValidateTwo(n2);
                var nres = n1+n2;
                return parseInt(nres);
                
            }
            function preNumValidateTwo (n) {
                var numstring = n.toString();
                if (numstring.length == 1) {
                    return '0'+numstring;
                } else if (numstring.length == 2) {
                    return numstring;
                }
            }
        });
            
            
        $(document).on("newmessage", function(e){
            vApp.wb.view.removeElement('serverErrorCont');
                        
//            if(!e.message.hasOwnProperty('audioSamp') && !e.message.hasOwnProperty('videoByImage')){
//                alert('sss');
//                debugger;
//            }
            if(e.message.hasOwnProperty('sad')){
                if(vApp.gObj.uRole == 't'){
                    if(e.message.sad){
                        var user =  vApp.user.control.updateUser(e.fromUser.userid, 'ad', true);
                        vApp.user.control.audioSign(user, "create");
                    }else{
                        var user =  vApp.user.control.updateUser(e.fromUser.userid, 'ad', false);
                        vApp.user.control.audioSign(user, 'remove');
                    }
                }
               return true;
            } else if(e.message.hasOwnProperty('enc')){
                if(e.message.toUser == vApp.gObj.uid){
                    vApp.user.control.allChatEnable();
                    vApp.gObj.chatEnable = true;
                }
                return;
            }else if(e.message.hasOwnProperty('dic')){
                if(e.message.toUser == vApp.gObj.uid){
                    vApp.user.control.allChatDisable();
                    vApp.gObj.chatEnable = false;
                }
                return;
            }else if (e.message.hasOwnProperty('ena')){
                if(e.message.toUser == vApp.gObj.uid){
                    vApp.user.control.audioEnable();
                    vApp.gObj.audioEnable = true;
                }
                return;
            }else if (e.message.hasOwnProperty('dia')){
                if(e.message.toUser == vApp.gObj.uid){
                    vApp.user.control.audioDisable();
                    vApp.gObj.audioEnable = false;
                }
                return;
            }
            
            if(typeof e.message == 'string' || e.message.hasOwnProperty('msg')){
                messageUpdate(e);
                return;
            }if(e.message.hasOwnProperty('sEnd')){
                vApp.storage.config.endSession();
                return;
            }if(e.message.hasOwnProperty('dispWhiteboard')){
              //  if(e.fromUser.userid != wbUser.id){
                vApp.makeAppReady(vApp.apps[0]);
                return;
               // }
            } else if(e.message.hasOwnProperty('si')){ //screen share start
                if(vApp.gObj.uRole == 's'){
//                    if(e.message.st == 'ss'){
//                        vApp.currApp == 'ScreenShare';
//                    }else if(e.message.st == 'wss') {
//                        vApp.currApp == 'WholeScreenShare';
//                    }
                   if(!e.message.hasOwnProperty('resimg')){
                      vApp.initStudentScreen(e.message);
                   }else{
                        //  alert('requested image is received');
                       if(e.message.byRequest == vApp.gObj.uid){
						 //  alert('requested image is received');
                            vApp.initStudentScreen(e.message);
                        }
                   }
                }
               return;
           } else if(e.message.hasOwnProperty('requestImagesBy')){
                if(vApp.gObj.uRole == "t" && (vApp.currApp == vApp.apps[1] || vApp.currApp == vApp.apps[2])){
                    var requestBy = e.message.requestImagesBy; //request user
                    if(vApp.currApp == vApp.apps[1]){
                        vApp.ss.sendPackets(requestBy);
                    }else if(vApp.currApp == vApp.apps[2]){
                        vApp.wss.sendPackets(requestBy);
                    }
                }
                return;
            }else if(e.message.hasOwnProperty('imageResponsed')){
                if(e.message.byRequest == vApp.gObj.uid){
                    vApp.initStudentScreen(e.message);
                }
                return;
            }else if(e.message.hasOwnProperty('unshareScreen')){ //screen share end
                var app  =  e.message.st;
               // if(e.fromUser.userid != wbUser.id){
                    if(typeof vApp[app] == 'object'){
                        vApp[app].prevImageSlices = [];
                        vApp[app].removeStream();
                    }
                   
               // }
                return;
           }else if(e.message.hasOwnProperty('audioSamp')){
                //if(e.fromUser.userid != wbUser.id){
                    var data_pack = e.message.audioSamp;
                    vApp.gObj.video.audio.play(data_pack, 0 , 0);
                    
                //}
                return;
            } if(e.message.hasOwnProperty('videoSlice')){ //video share start
                vApp.gObj.video.playVideo(e.message.videoSlice);
                return;
            } else if(e.message.hasOwnProperty('videoByImage')){ //video end start
//                if(e.fromUser.userid != wbUser.id){ 
                    if(!vApp.gObj.video.existVideoContainer(e.message.videoByImage)){
                        vApp.gObj.video.video.createElement(e.message.videoByImage);
                    }
                    //vApp.gObj.video.video.playWithoutSlice(e.message);
                //}
                return;
            } else if(e.message.hasOwnProperty('userMsg')){ //chat start
                //vApp.gObj.chat.display(e.message.userMsg, e.fromUser.userid);
                vApp.gObj.chat.display(e.message.userMsg);
                return;
            } else if(e.message.hasOwnProperty('requestPacketBy')){
                if(vApp.gObj.uRole == "t"){
                    var requestBy = e.message.requestPacketBy; //request user
                    vApp.gObj.chat.sendPackets(requestBy, e.message.sp);
                }
                return;
            }else if(e.message.hasOwnProperty('chatPackResponsed')){ //chat end
                if(e.message.byRequest == vApp.gObj.uid){
                    vApp.gObj.chat.displayMissedChats(e.message.chatPackResponsed);
                }
                return;
            } else if(e.message.hasOwnProperty('checkUser')){
                var disconnect = vApp.wb.response.checkUser(e, wbUser.id, vApp.wb.stHasTeacher);
                if(typeof disconnect != 'undefined'){
                     if(disconnect == 'diconnect'){
                        return;
                     }
                 }
            }

            else if(e.message.hasOwnProperty('video')){
                
//                vApp.wb.response.video(e.fromUser.userid, wbUser.id, e.message.video);
                
            }else{
                if(e.message.hasOwnProperty('reclaimRole')){
                    //from that user only
                    if(localStorage.getItem('teacherId') !=  null){
                        vApp.wb.response.reclaimRole(e.fromUser.userid, wbUser.id);
                    }
                    return;
                }
                if(e.message.hasOwnProperty('assignRole')){
                    if(e.message.toUser == vApp.gObj.uid){
                        vApp.wb.response.assignRole(e.fromUser.userid , wbUser.id);
                    }
                     return;
                }
                vApp.wb.gObj.myrepObj = vApp.wb.vcan.getStates('replayObjs');
                if(e.message.hasOwnProperty('clearAll')){
                    vApp.wb.response.clearAll(e.fromUser.userid , wbUser.id, e.message, vApp.wb.oTeacher);
                }

                //if(e.fromUser.userid != wbUser.id){
                    if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
                        
                        if(e.message.repObj[0].hasOwnProperty('uid')){
                            if(vApp.previous !=  "vApp" + vApp.apps[0]){
                               vApp.makeAppReady(vApp.apps[0]);
                            }
                            vApp.wb.uid = e.message.repObj[e.message.repObj.length - 1].uid;
                        }
                        
                        if(vApp.wb.gObj.displayedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('chunk') && vApp.wb.gObj.rcvdPackId != 0){
                            vApp.wb.bridge.makeQueue(e);
                        }
                    }

                   if(e.message.hasOwnProperty('repObj')){
                       vApp.wb.response.repObjForMissedPkts(e.message.repObj);
                   }
              //  }

               // if(e.fromUser.userid != wbUser.id){
                    if(e.message.hasOwnProperty('getMsPckt')){
                        vApp.wb.gObj.chunk = [];
                        var chunk = vApp.wb.bridge.sendPackets(e, vApp.wb.gObj.chunk);
                        vApp.wb.utility.beforeSend({'repObj' : chunk, 'chunk' : true});
                    }
              //  }

              //  if(e.fromUser.userid != wbUser.id){
                    if(e.message.hasOwnProperty('createArrow')){
                        vApp.wb.response.createArrow(e.message, vApp.wb.oTeacher);
                    }else{
                        if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('checkUser')){
                            if(typeof e.message.repObj == 'undefined'){
                                
//                                alert('suman');
//                                debugger;
                                
                                vApp.wb.utility.updateRcvdInformation(e.message.repObj[0]);
                            }
                        }
                    }
              // }

                if(!e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('replayAll')){
                    if(e.message.hasOwnProperty('repObj')){
                        if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == wbUser.id){
                            //TODO this have to be simpliefied.
                        }else{
                            if(vApp.wb.gObj.rcvdPackId + 1 == e.message.repObj[0].uid) {
                                for (var i = 0; i < e.message.repObj.length; i++){
                                    vApp.wb.gObj.replayObjs.push(e.message.repObj[i]);
                                }
                            }

                            if(typeof e.message.repObj[e.message.repObj.length - 1] == 'object' ){
                                if(e.message.repObj[e.message.repObj.length - 1].hasOwnProperty('uid') && !e.message.hasOwnProperty('chunk')){
                                    vApp.wb.gObj.rcvdPackId = e.message.repObj[e.message.repObj.length - 1].uid;
                                    localStorage.setItem('rcvdPackId', vApp.wb.gObj.rcvdPackId);
                                }
                                //Missing one id.
                                if(vApp.wb.gObj.packQueue.length > 0 && !e.message.hasOwnProperty('chunk')){
                                    vApp.wb.gObj.rcvdPackId = vApp.wb.gObj.packQueue[vApp.wb.gObj.packQueue.length - 1].uid;
                                }
                            }

                            if(e.fromUser.userid != wbUser.id){
                                //localStorage.setItem('repObjs', JSON.stringify(vApp.wb.gObj.replayObjs));
                                vApp.storage.store(JSON.stringify(vApp.wb.gObj.replayObjs));
                            }else{
                                if(typeof vApp.wb.gObj.rcvdPackId != 'undefined'){
                                    vApp.wb.gObj.displayedObjId = vApp.wb.gObj.rcvdPackId;
                                }
                            }
                        }

                        if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != wbUser.id){
                            vApp.wb.response.chunk(e.fromUser.userid, wbUser.id,  e.message.repObj);
                        }
                    }

                    if(vApp.wb.oTeacher){
                    //    if(e.fromUser.userid != wbUser.id ){
                            if(e.message.hasOwnProperty('createArrow')){
                                vApp.wb.receivedPackets = vApp.wb.receivedPackets + (JSON.stringify(e.message).length);
                            }else if(!e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('checkUser') && !e.message.hasOwnProperty('videoInt')){
                                vApp.wb.receivedPackets = vApp.wb.receivedPackets + (JSON.stringify(e.message.repObj).length);
                            }
                            if(document.getElementById(vApp.wb.receivedPackDiv) != null){
                                document.getElementById(vApp.wb.receivedPackDiv).innerHTML = vApp.wb.receivedPackets;
                            }
                    //    }
                        if(typeof vApp.wb.receivedPackets != 'undefined'){
                            localStorage.receivedPackets = vApp.wb.receivedPackets;
                        }
                    }
                }

                if(e.fromUser.userid != wbUser.id && e.message.hasOwnProperty('repObj')){
                    vApp.wb.response.replayObj(e.message.repObj);
                }

                if(e.message.hasOwnProperty('replayAll')){
                    vApp.wb.response.replayAll();
                }
            }
            
            //Chat code start to check if message has chat
           // messageUpdate(e);

        });
        
        
        /** Chat code start from here **/
        
        counter = 0;
         idList = new Array();
         var box = null;
         $.htab = [];
         $.htabIndex = [];
         vmstorage = {};

         $('body').footerbar();

         if(localStorage.getItem('init') == 'false'){ // check footer is close
             $('#stickybar').removeClass('maximize').addClass('minimize');
             $('#hide_bar input').removeClass('close').addClass('expand');
         }
         tabs = $('#tabs').tabs({ cache: true, activeOnAdd: true});

         if (browserSupportsLocalStorage() == false)  { // check browser for local storage
             alert(lang.sterror);
             return;
         }
         // checking private chat local storage
         // Data stored in session key inside localStorage variable
         // sid is the session id
         if (localStorage.getItem(sid) != null)  {
                displayChatHistory();
                
                chatEnable = localStorage.getItem('chatEnable');
                if(chatEnable != null && chatEnable ==  "false"){
                    vApp.user.control.disbaleAllChatBox();
                }
                
//                var div = document.getElementById("chatrm");
//                if(div != null){
//                     vApp.user.control.makeElemDisable(div);
//                }
                
                vmstorage = JSON.parse(localStorage.getItem(sid));
         }

         //checking common chat local storage
         //Data stored inside sessionStorage variable
         if(sessionStorage.length > 0){
             displaycomChatHistory();
             if(typeof chatEnable != 'undefined' && chatEnable == "false"){
                 vApp.user.control.disableCommonChat();
             }
         }

         /* Remove user tab and chatbox when click on tab close icon */
         $('#tabs').delegate( "span.ui-icon-close", "click", function() {

             // delete box
             var tabid = $( this ).closest( "li" ).attr( "id").substring(5);
             $("#" + tabid).chatbox("option").boxClosed(tabid);
             $('div#cb' + tabid + '.ui-widget').hide();

             //delete tab
             var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
             $( "#" + panelId ).remove();

             delete vmstorage[tabid]; //delete variable storage
         });

         /* Hide box when click on user tab */
         $("#tabs").on("click", "li a", function(){
             var tabid = $( this ).closest( "li" ).attr( "id").substring(5);
             $("#" + tabid).chatbox('toggleContentbox');
             if(localStorage.getItem(tabid) == 'hidden'){
                 localStorage.removeItem(tabid);
             }else{
                 localStorage.setItem(tabid, 'hidden');
             }
         });

         // new message alert
         $('ul.tabs').on("click, focus", "li", function(){
             $("li[aria-controls='" + $(this).attr('id') + "']").removeClass('ui-state-highlight');
         });

         
         $(document).on("Multiple_login", function(e){
            //if same user login multiple times then
            //remove previously logged in detail

            $('.ui-memblist').remove();
            $('.ui-chatbox').remove();
            $('div#chatrm').remove();
            chatroombox = null;

            // delete open chat box
            for(key in io.uniquesids){
                if(key != io.cfg.userid){
                    chatboxManager.delBox(key);
                    $( "li#tabcb" + key ).remove(); //delete tab
                }
            }
            idList = new Array(); // chatbox
            $('#stickybar').removeClass('maximize').addClass('minimize');
            tabs.tabs( "refresh" );//tabs
         });

         $(document).on("authentication_failed", function(e){
            //delete cookie
            document.cookie = "auth_user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            document.cookie = "auth_pass=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            document.cookie = "path=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            display_error(e.message);
         });

//         $(document).on("error", function(e){
//            if(typeof e.message != 'object'){
//                display_error(e.message);
//            
//         });

         $(document).on("connectionclose", function(e){
             $("#user_list .inner_bt #usertab_icon").css({'background':  'url('+window.whiteboardPath+'images/offline.png)no-repeat top left'});
             $("#user_list .inner_bt #usertab_text").text(lang.whos + " (0)");
             $("#chatroom_bt .inner_bt #chatroom_text").text(lang.chatroom + " (0)");
             $('div#memlist').css('display','none');
         });

         $(window).bind('beforeunload',function(){
                var data = JSON.stringify(vmstorage);
                localStorage.setItem(sid, data);
         });
         
        /*** chat start from here ***/
        
        //this file have to be convert into function   
         var session = {
             audio: true,
             video: false
         };

         var recordRTC = null;
         var resampler = new Resampler(44100, 8000, 1, 4096);

         var Html5Audio = {};
         Html5Audio.audioContext = new AudioContext();

        var encMode = "alaw"; 
   });
//});
