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
        
        //vApp.wb.utility.makeUserAvailable();
        
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
            
            if(joinId == vApp.gObj.uid && vApp.gObj.uRole != 't'){
				
       //         var sp = (vApp.gObj.chat.userChatList.length == 0 ) ? 0 : vApp.gObj.chat.userChatList.length;
         //       vApp.wb.utility.beforeSend({'requestPacketBy' : joinId, sp: sp});
                vApp.wb.utility.beforeSend({'requestImagesBy' : joinId});
            }
            
             //demoVideoTest(e); //for video demo
        });

        $(document).on("newaudio", function(e){
            //var data_pack = e.message;
            var data_pack = new Uint8Array(e.message);
            vApp.gObj.video.audio.play(data_pack, 0 , 0);
            return;
        });
            
            
        $(document).on("newmessage", function(e){
            vApp.wb.view.removeElement('serverErrorCont');
                        
//            if(!e.message.hasOwnProperty('audioSamp') && !e.message.hasOwnProperty('videoByImage')){
//                alert('sss');
//                debugger;
//            }

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
                    vApp[app].prevImageSlices = [];
                    vApp[app].removeStream();
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
                    if(!vApp.gObj.video.existVideoContainer(e.message.user)){
                        vApp.gObj.video.video.createElement(e.message.user);
                    }
                    vApp.gObj.video.video.playWithoutSlice(e.message);
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
                    vApp.wb.response.reclaimRole(e.fromUser.userid, wbUser.id);
                    return;
                }
                if(e.message.hasOwnProperty('assignRole')){
                    vApp.wb.response.assignRole(e.fromUser.userid , wbUser.id, e.message.socket, e.message.toolHeight);
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
             vmstorage = JSON.parse(localStorage.getItem(sid));
         }

         //checking common chat local storage
         //Data stored inside sessionStorage variable
         if(sessionStorage.length > 0){
             displaycomChatHistory();
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
//            }
//         });

         $(document).on("connectionclose", function(e){
             $("#user_list .inner_bt #usertab_icon").css({'background': 'url(/images/offline.png)no-repeat top left'});
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
