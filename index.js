// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

$.uiBackCompat = false;
    $(document).ready(function(){
        window.earlierWidth = window.innerWidth;
        window.earlierHeight = window.innerHeight;
        window.wbUser = wbUser;
        
        window.pageEnter = new Date().getTime();
        var vApp = new window.vmApp();
        window.vApp = vApp; //make available to vApp object to each file
        
        vApp.gObj.displayError = 1;
        
        var appIs = "Whiteboard";
        vApp.gObj.sessionClear = false;
        vApp.prvCurrUsersSame();
        vApp.init(wbUser.role, appIs);
        if(localStorage.getItem('tc') != null){
            vApp.vutil.toggleRoleClass();
        }else{
            localStorage.setItem('tc', true);
        }

        if(vApp.vutil.isMiniFileIncluded('wb.min')){
            vApp.gObj.displayError = 0;
        }
        
        if(window.vApp.error.length > 2){
            window.vApp.error = [];
            return;
        }
        
        if ((typeof vcan.teacher == 'undefined') && (!vApp.wb.stHasTeacher)) {
            vApp.wb.utility.makeCanvasDisable();
        }

        vApp.wb.utility.initDefaultInfo(wbUser.role);
        
        if(wbUser.role == 's'){
            var audioEnable = localStorage.getItem('audEnable');
            if(audioEnable != null && audioEnable == 'false'){
                vApp.user.control.audioWidgetDisable();
                vApp.gObj.audioEnable = false;
            }
        }
        
        $(document).on("user_logout", function(e){
            removedMemberId = e.fromUser.userid;
            vApp.gObj.video.video.removeUser(removedMemberId);
        });

        $(document).on("member_removed", function(e){
            vApp.wb.utility.userIds = [];
             memberUpdate(e, "removed");
        });

        $(document).on("error", function(e){
            if(vApp.gObj.displayError){
                vApp.wb.view.removeElement('serverErrorCont');
                vApp.wb.view.displayServerError('serverErrorCont', e.message.stack);
                if(typeof e.message != 'object'){
                    display_error(e.message.stack);
                }
            }else{
                if(typeof e.message != 'object'){
                    console.log(e.message.stack);
                }
            }
        });
        
        $(document).on("member_added", function(e){
            vApp.wb.clientLen = e.message.length;
            var joinId = e.message[e.message.length - 1].userid;
            vApp.jId = joinId;
            
            memberUpdate(e, 'added');
            if(typeof vApp.gObj.hasOwnProperty('updateHeight')){
                vApp.gObj.video.updateVidContHeight();
                vApp.gObj.updateHeight = true;
            }
            
            if(vApp.gObj.uRole == 't'){
                if(vApp.currApp == 'ScreenShare'){
                    var sType = 'ss';
                }
                
                if(typeof sType != 'undefined'){
                    //TODO this should be into function
                    var sType = vApp.getDataFullScreen(sType)
                    var createdImg =  vApp.getDataFullScreen('ss');
                    io.sendBinary(createdImg);
                    delete sType;
                }
            }
        });
        
        $(document).on("Multiple_login", function(e){
            vApp.chat.removedPrvLoggedInDetail(); 
        });

        $(document).on("authentication_failed", function(e){
           vApp.chat.removeCookieUserInfo();
        });

        $(document).on("connectionclose", function(e){
            vApp.chat.makeUserListEmpty();
        });
        
        $(document).on("binrec", function(e){
            //vApp.gObj.video.audio []
            var data_pack = new Uint8Array(e.message);
            
            if(data_pack[0] == 101 || data_pack[0] == 102 || data_pack[0] == 103 || data_pack[0] == 104){
                var stype = 'ss';
                var sTool = 'ScreenShare';
            }
            
            if (data_pack[0] == 101) { // Audio
                if(!vApp.gObj.video.audio.otherSound){
                    vApp.gObj.video.audio.receivedAudioProcess(e.message);
                }
                return;
            } else if (data_pack[0] == 11) { // user video image
                vApp.gObj.video.video.process(e.message);
                return;
            } else{
                if(!vApp.hasOwnProperty('studentScreen')){
                    vApp.studentScreen = new studentScreen();
                }
                vApp.studentScreen.ssProcess(data_pack, e.message, stype, sTool);
                return
            }
        });
        
        $(document).on("newmessage", function(e){
            if(e.message.hasOwnProperty('sad')){
                if(localStorage.getItem('orginalTeacherId') != null){
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
                    vApp.user.control.audioWidgetEnable();
                    vApp.gObj.audioEnable = true;
                }
                return;
            }else if (e.message.hasOwnProperty('dia')){
                if(e.message.toUser == vApp.gObj.uid){
                    vApp.user.control.audioWidgetDisable();
                    vApp.gObj.audioEnable = false;
                }
                return;
            }
            
            if(typeof e.message == 'string' || e.message.hasOwnProperty('msg')){
                messageUpdate(e);  //chat update
                return;
            }
            
            if(e.message.hasOwnProperty('sEnd')){
                vApp.storage.config.endSession();
                return;
            }
            
            if(e.message.hasOwnProperty('dispWhiteboard')){
                vApp.makeAppReady(vApp.apps[0]);
                return;
            }else if(e.message.hasOwnProperty('unshareScreen')){ //screen share end
                var app  =  e.message.st;
                if(typeof vApp[app] == 'object'){
                    vApp[app].prevImageSlices = [];
                    vApp[app].removeStream();
                }
                return;
           }else if(e.message.hasOwnProperty('videoSlice')){ //video share start
                vApp.gObj.video.playVideo(e.message.videoSlice);
                return;
            } else if(e.message.hasOwnProperty('videoByImage')){ //video end start
                if(!vApp.gObj.video.existVideoContainer(e.message.videoByImage)){
                    vApp.gObj.video.video.createElement(e.message.videoByImage);
                }
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
            } else {
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
                if(e.message.hasOwnProperty('getMsPckt')){
                    vApp.wb.gObj.chunk = [];
                    var chunk = vApp.wb.bridge.sendPackets(e, vApp.wb.gObj.chunk);
                    vApp.wb.utility.beforeSend({'repObj' : chunk, 'chunk' : true});
                }
                if(e.message.hasOwnProperty('createArrow')){
                    vApp.wb.response.createArrow(e.message, vApp.wb.oTeacher);
                }else{
                    if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('checkUser')){
                        if(typeof e.message.repObj == 'undefined'){
                            vApp.wb.utility.updateRcvdInformation(e.message.repObj[0]);
                        }
                    }
                }

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
                        if(e.message.hasOwnProperty('createArrow')){
                            vApp.wb.receivedPackets = vApp.wb.receivedPackets + (JSON.stringify(e.message).length);
                        }else if(!e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('checkUser') && !e.message.hasOwnProperty('videoInt')){
                            vApp.wb.receivedPackets = vApp.wb.receivedPackets + (JSON.stringify(e.message.repObj).length);
                        }
                        if(document.getElementById(vApp.wb.receivedPackDiv) != null){
                            document.getElementById(vApp.wb.receivedPackDiv).innerHTML = vApp.wb.receivedPackets;
                        }
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
         
        //this should be in proper place
        var encMode = "alaw"; 
        setTimeout(
            function (){
                window.postMessage({ type: 'isInstalled', id: 1 }, '*');
            },
            500
        );
        vApp.vutil.attachClickOutSideCanvas();
   });
//});
