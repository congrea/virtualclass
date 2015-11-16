/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
$.uiBackCompat = false;
$(document).ready(function () {
    "use strict";
    window.earlierWidth = window.innerWidth;
    window.earlierHeight = window.innerHeight;
    window.wbUser = wbUser;

    window.pageEnter = new Date().getTime();
    var virtualclass = new window.virtualclass();

    window.virtualclass = virtualclass; //Need virtualclass object in each file


    virtualclass.gObj.displayError = 1;

    // TODO Error when screenShare or YouTube is default application
    //  var appIs = "EditorRich";
    // var appIs = "Whiteboard";

    virtualclass.gObj.sessionClear = false;
    virtualclass.prvCurrUsersSame();


    wbUser.virtualclassPlay = parseInt(wbUser.virtualclassPlay, 10);
    if(wbUser.virtualclassPlay){
        virtualclass.gObj.sessionClear = true;
        //localStorage.removeItem('orginalTeacherId');
        virtualclass.gObj.role = 's';

        localStorage.removeItem('teacherId');
        //virtualclass.gObj.uid = 99955551230; // in replay mode the user can not be same which is using on actual program
        wbUser.id = 99955551230;

        virtualclass.gObj.uid =  wbUser.id;
    }

    var capitalizeFirstLetter  = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var previousApp = JSON.parse(localStorage.getItem('prevApp'));
    if(previousApp != null) {
        virtualclass.previousApp = previousApp;
        var appIs = capitalizeFirstLetter(previousApp.name);

        if(previousApp.name == 'Yts'){
            if(previousApp.metaData == null ){
                var videoObj = null;
            } else {
                var videoObj = previousApp.metaData;
                videoObj.fromReload = true;
            }
        }
    } else {
        var appIs = "EditorRich";
    }

    if (typeof videoObj == 'undefined') {
        var videoObj = null;
    }

    virtualclass.popup = new PopUp({
        showOverlay: true
    });

    virtualclass.popup.waitMsg();


    // If was in play mode before, start with fresh data
    if (!virtualclass.isPlayMode &&  localStorage.getItem('mySession') === 'thisismyplaymode') {
        console.log('DELETE PlayMode Data');
        localStorage.clear();
        virtualclass.init(wbUser.role, appIs, videoObj);
        virtualclass.storage.config.endSession();
    } else {
        virtualclass.init(wbUser.role, appIs, videoObj);
    }


    var alreadyInit = false;

    //TODO this both setinterval functions should be merged into one\

    if (!wbUser.virtualclassPlay){
        virtualclass.editorRich.veryInit();
        virtualclass.editorCode.veryInit();
    }

    /*
     if (localStorage.getItem('tc') !== null) {
     virtualclass.vutil.toggleRoleClass();
     } else {
     localStorage.setItem('tc', true);
     } */

    if (virtualclass.vutil.isMiniFileIncluded('wb.min')) {
        virtualclass.gObj.displayError = 0;
    }

    if (window.virtualclass.error.length > 2) {
        window.virtualclass.error = [];
        return;
    }

    if ((typeof vcan.teacher === 'undefined') && (!virtualclass.wb.stHasTeacher) && appIs == 'Whiteboard') {
        virtualclass.wb.utility.makeCanvasDisable();
    }

    //virtualclass.wb.utility.initDefaultInfo(wbUser.role);
    virtualclass.vutil.initDefaultInfo(wbUser.role, appIs);

    if (roles.isStudent()) {
        var audioEnable = localStorage.getItem('audEnable');
        if (audioEnable !== null) {
            if(audioEnable.ac === 'false'){
                virtualclass.user.control.audioWidgetDisable();
                virtualclass.gObj.audioEnable = false;
            }
        }
    }

    //TODO : this should be in proper place
    var encMode = "alaw";
    setTimeout(
        function () {
            window.postMessage({type: 'isInstalled', id: 1}, '*');
        },
        500
    );
    virtualclass.vutil.attachClickOutSideCanvas();

    //TODO this should be at virtualclass.js
    //virtualclass.popup = new PopUp({
    //    showOverlay: true
    //});

    //db transaction of indexeddb is not ready on page onload, 50 ms delay
    // OR find the alternative for this

    if (virtualclass.vutil.isPlayMode()) {
        setTimeout(
            function () {
                //earlier it was calling after requestDataFromServer
                // because of which the popup box for replay is not displaying
                clearEverthing();
                virtualclass.recorder.requestDataFromServer(wbUser.vcSid, 1);
            },
            150 //increase 100 ms for indexeddb which was not ready till popup was display
        );
    }



    $(document).on("user_logout", function (e) {
        virtualclass.gObj.video.video.removeUser(e.fromUser.userid);
        if((e.fromUser.role == 't' || e.fromUser.role == 'e') && (roles.isStudent() || roles.isPresenter())){
            localStorage.setItem('oTDisconn', true);
            disableEditor('editorRich');
            disableEditor('editorCode');
        }
    });

    var disableEditor = function (editor){
        if(typeof virtualclass.hasOwnProperty(editor) && typeof virtualclass[editor] == 'object'){
            if(virtualclass[editor].hasOwnProperty('cm') && typeof virtualclass[editor].cm == 'object'){
                virtualclass[editor].cm.setOption('readOnly', 'nocursor');
            } else {
                console.log('CM is not ready for' + editor);
            }
        } else {
            console.log(editor + ' is not ready');
        }
    }


    $(document).on("member_removed", function (e) {
        // critical removign this can be critical
        //  virtualclass.wb.utility.userIds = [];
        memberUpdate(e, "removed");
    });

    $(document).on("error", function (e) {
        if (virtualclass.gObj.displayError) {
            virtualclass.view.removeElement('serverErrorCont');

            if(typeof e.message.stack != 'undefined') {
                virtualclass.view.displayServerError('serverErrorCont', e.message.stack);
            } else {
                console.log('Error message ' + e.message.stack + ' could not display');
            }

            if (typeof e.message !== 'object') {
                display_error(e.message.stack);
            }
        } else {
            if (typeof e.message !== 'object') {
                console.log(e.message.stack);
            }
        }
    });

    $(document).on("member_added", function (e) {
        var sType;
        virtualclass.connectedUsers = e.message;
        //virtualclass.wb.clientLen = e.message.length;
        virtualclass.jId = e.message[e.message.length - 1].userid; // JoinID
        ioPingPong.ping(e);
        memberUpdate(e, 'added');
        if (typeof virtualclass.gObj.hasOwnProperty('updateHeight')) {
            virtualclass.gObj.video.updateVidContHeight();
            virtualclass.gObj.updateHeight = true;
        }


        if(roles.hasAdmin()){
            if(virtualclass.gObj.uid == virtualclass.jId){

                if(virtualclass.currApp.toUpperCase() == 'EDITORRICH' || virtualclass.currApp.toUpperCase() == 'EDITORCODE'){
                    ioAdapter.mustSend({'eddata' : 'currAppEditor', et: virtualclass.currApp});
                }

                // On reload or new connection, make sure all students have same editor data
                if(virtualclass.editorRich.isVcAdapterIsReady('editorRich')){
                    virtualclass.editorRich.responseToRequest();
                } else {
                    console.log('Editor Rich vcAdapter is not ready');
                }

                if(virtualclass.editorCode.isVcAdapterIsReady('editorCode')){
                    virtualclass.editorCode.responseToRequest();
                } else {
                    console.log('Editor Code vcAdapter is not ready');
                }

                if(virtualclass.currApp === 'Yts') {
                    if (typeof virtualclass.yts.player == 'object') {
                        ioAdapter.mustSendUser({
                            'yts': {
                                'init': virtualclass.yts.videoId,
                                startFrom: virtualclass.yts.player.getCurrentTime()
                            }, 'cf': 'yts'
                        }, virtualclass.jId);
                    }
                }


                ioAdapter.send({'cf': 'tConn'});
            }
        }

        // Greet new student with info, When other user join
        if (roles.hasControls() && virtualclass.gObj.uid != virtualclass.jId ) {
            // Greet new student with info
            if (typeof virtualclass.wb == 'object' && virtualclass.currApp == 'Whiteboard') {
            //if(typeof virtualclass.wb == 'object'){
                var objs = virtualclass.wb.vcan.main.replayObjs;
                if(objs.length > 0){
                    virtualclass.vutil.beforeSend({'repObj': objs, 'cf' : 'repObj'});
                } else {
                    console.log('Could not send the whiteboar data');
                }
            }

            if (virtualclass.currApp === 'ScreenShare') {
                sType = 'ss';
            } else if(virtualclass.currApp === 'Yts'){
                if(typeof virtualclass.yts.player == 'object'){
                    ioAdapter.mustSendUser({'yts': {'init': virtualclass.yts.videoId, startFrom : virtualclass.yts.player.getCurrentTime()}, 'cf' : 'yts'}, virtualclass.jId);
                } else {
                    ioAdapter.mustSendUser({'yts': {'init' : 'studentlayout'}, 'cf': 'yts'}, virtualclass.jId);
                }
            }

            if (typeof sType !== 'undefined' && sType !== null) {
                //TODO this should be into function
                if(typeof virtualclass.getDataFullScreen == 'function'){
                    sType = virtualclass.getDataFullScreen(sType);
                    var createdImg = virtualclass.getDataFullScreen('ss');
                    ioAdapter.sendBinary(createdImg);
                    sType = null;
                }
            }
        }
    });

    $(document).on("Multiple_login", function (e) {
        virtualclass.chat.removedPrvLoggedInDetail();
    });

    $(document).on("authentication_failed", function (e) {
        virtualclass.chat.removeCookieUserInfo(e);
    });

    $(document).on("connectionclose", function (e) {
        //virtualclass.popup.waitMsg();
        if(virtualclass.hasOwnProperty('recorder') && virtualclass.recorder.startUpload){
            console.log("During the upload process there would not any other popup box.");
        } else {
            virtualclass.popup.waitMsg();
        }

        virtualclass.chat.makeUserListEmpty();

    });

    $(document).on("connectionopen", function (e) {
        setTimeout(
            function (){
                virtualclass.popup.closePopup();
            }, 1000
        );

    });

    /**
     * Relieve all binary packets here
     */
    $(document).on("binrec", function (e) {
        // TODO here should be eith unit8clampped array or unit8array
        var data_pack = new Uint8Array(e.message);
        switch (data_pack[0]) {
            case 102:
            case 103:
            case 104:
            case 202:
            case 203:
            case 204:
                var stype = 'ss';
                var sTool = 'ScreenShare';
                if (!virtualclass.hasOwnProperty('studentScreen')) {
                    virtualclass.studentScreen = new studentScreen();
                }
                virtualclass.studentScreen.ssProcess(data_pack, e.message, stype, sTool);
                break;
            case 101: // Audio
                if (!virtualclass.gObj.video.audio.otherSound) {
                    virtualclass.gObj.video.audio.receivedAudioProcess(e.message);
                }
                break;
            case 11:  // user video image
                virtualclass.gObj.video.video.process(e.message);
                break;
        }
    });

    /**
     * On every new message from IOLib/Server
     */
    $(document).on("newmessage", function (e) {
        var recMsg = e.message, key;

        //critical, wrapping with if condition can be crtical,j validate proper if condition is not violating anything

        if(typeof virtualclass.wb == 'object'){
            if(virtualclass.wb.hasOwnProperty('vcan')){
                virtualclass.wb.gObj.myrepObj = virtualclass.wb.vcan.getStates('replayObjs');
            }
        }

        if(recMsg.hasOwnProperty('cf')){
            if(typeof receiveFunctions[recMsg.cf] == 'function'){
                receiveFunctions[recMsg.cf](e);
                return;
            } else {
                console.log('CF ' + recMsg.cf+ ' is not a function of receiveFunctions');
            }
        }


    });

    function clearEverthing() {

        localStorage.removeItem('editorRich');
        localStorage.removeItem('editorCode');

        virtualclass.notPLayed = true;
        virtualclass.storage.config.endSession();
        virtualclass.chat.chatroombox = false;
        var chat_room = document.getElementById('chatrm');
        if (chat_room !== null) {
            chat_room.parentNode.removeChild(chat_room);
        }
        var canvasElem = document.getElementById('canvas');
        if (canvasElem !== null) {
            canvasElem.style.pointerEvents = "none";
        }
    }

    /**
     * Helper functions for newmessage event
     * @type {receiveFunctions}
     */
    var receiveFunctions = new function () {

        this.pong = function (e){
            ioPingPong.pong(e);
        };

        this.pongAck = function (e){
            ioPingPong.pongAck(e);
        };

        this.control = function (e){
            virtualclass.user.control.onmessage(e);
        };

        //editor data
        this.eddata = function (e){
            //virtualclass.editorRich.onmessage(e.message);
            if(e.message.hasOwnProperty('et')){
                if(e.message.et == 'editorRich'){
                    virtualclass.editorRich.onmessage(e, 'EditorRich');
                }else {
                    virtualclass.editorCode.onmessage(e, 'EditorCode');
                }
            }
        };

        this.tConn = function (e){
            // Lets Editor be the ready
            setTimeout(
                function (){
                    virtualclass.vutil.setReadModeWhenTeacherIsConn('editorRich');
                    virtualclass.vutil.setReadModeWhenTeacherIsConn('editorCode');
                }, 2000
            );
        }

        //youtube share
        this.yts = function (e) {
            //nothing to do with self received packet
            if(e.fromUser.userid != virtualclass.gObj.uid){
                virtualclass.yts.onmessage(e.message);
            }


        };

        //silence audio
        this.sad = function (e) {
            var user, anchorTag;
            if (e.message.sad) {
                user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', true);
                virtualclass.user.control.audioSign(user, "create");
            } else {
                user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', false);
                virtualclass.user.control.audioSign(user, 'remove');
                anchorTag = document.getElementById(user.id + 'contrAudAnch');
                if(anchorTag != null){
                    anchorTag.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
                }
            }
            return true;
        };

        //enable chat
        this.enc = function (e) {
            if(e.message.hasOwnProperty('ouser')){
                virtualclass.user.control.enable(e.message.ouser, 'chat', 'Chat', 'chat');
            } else {
                virtualclass.user.control.allChatEnable();
                virtualclass.gObj.chatEnable = true;
                virtualclass.vutil.beforeSend({'enc': true, 'cf' : 'enc', ouser : e.message.toUser});
            }

        };

        //disable chat
        this.dic = function (e) {
            //if other user's control should be disabled
            if(e.message.hasOwnProperty('ouser')){
                virtualclass.user.control.disable(e.message.ouser, 'chat', 'Chat', 'chat');
            } else {
                virtualclass.user.control.allChatDisable();
                virtualclass.gObj.chatEnable = false;
                virtualclass.vutil.beforeSend({'dic': true, 'cf' : 'dic', ouser : e.message.toUser});
            }
        };

        //enable audio
        this.ena = function (e) {
            if (e.message.toUser == virtualclass.gObj.uid) {
                virtualclass.user.control.audioWidgetEnable();
                virtualclass.gObj.audioEnable = true;
            } else {
                virtualclass.user.control.enable(e.message.toUser, 'audio', 'Aud', 'aud');
            }
        };

        //disable audio
        this.dia = function (e) {
            if (e.message.toUser == virtualclass.gObj.uid) {
                virtualclass.user.control.audioWidgetDisable();
                virtualclass.gObj.audioEnable = false;
            } else {
                virtualclass.user.control.disable(e.message.toUser, 'audio', 'Aud', 'aud');
            }
        };

        //chat message update
        this.msg = function (e) {
            messageUpdate(e);  //chat update
        };

        //session end
        this.sEnd = function (e) {
            virtualclass.storage.config.endSession();
            virtualclass.popup.sesseionEndWindow();

            //location.reload();
        };

        //whiteboard ready
        this.dispWhiteboard = function (e) {
            virtualclass.makeAppReady(virtualclass.apps[0]);
        };

        //unshare schreen
        this.unshareScreen = function (e) {
            var app = e.message.st;
            if (typeof virtualclass[app] === 'object') {
                virtualclass[app].prevImageSlices = [];
                virtualclass[app].removeStream();
            }
        };

        //notfound
        this.videoSlice = function (e) {
            virtualclass.gObj.video.playVideo(e.message.videoSlice);
        };

        //screen share by image
        this.videoByImage = function (e) {
            if (!virtualclass.gObj.video.existVideoContainer(e.message.videoByImage)) {
                virtualclass.gObj.video.video.createElement(e.message.videoByImage);
            }
        };

        //not found
        this.userMsg = function (e) {
            virtualclass.gObj.chat.display(e.message.userMsg);
        };

        // not found
        this.requestPacketBy = function (e) {
            if (roles.hasControls()) {
                var requestBy = e.message.requestPacketBy; //request user
                virtualclass.gObj.chat.sendPackets(requestBy, e.message.sp);
            }
        };

        //not found
        this.chatPackResponsed = function (e) {
            if (e.message.byRequest === virtualclass.gObj.uid) {
                virtualclass.gObj.chat.displayMissedChats(e.message.chatPackResponsed);
            }
        };

        //not found
        this.checkUser = function (e) {
            var disconnect = virtualclass.wb.response.checkUser(e, wbUser.id, virtualclass.wb.stHasTeacher);
            if (typeof disconnect !== 'undefined') {
                if (disconnect === 'diconnect') {
                    //TODO : ?
                }
            }
        };

        //Reclaim Role
        this.reclaimRole = function (e) {
            //if (localStorage.getItem('teacherId') !== null) {
            if (roles.hasControls()) {
                virtualclass.vutil.vcResponseAReclaimRole(e.fromUser.userid, wbUser.id);
                //virtualclass.wb.response.reclaimRole(e.fromUser.userid, wbUser.id);
            }
        };

        //Assign Role
        this.assignRole = function (e) {
            if (e.message.toUser === virtualclass.gObj.uid) {
                virtualclass.vutil.vcResponseAssignRole(e.fromUser.userid, wbUser.id);
                //virtualclass.wb.response.assignRole(e.fromUser.userid, wbUser.id);
            }
        };

        //Clear All
        this.clearAll = function (e) {
            if(typeof virtualclass.wb != 'object'){
                virtualclass.makeAppReady(virtualclass.apps[0]);
            }
            virtualclass.wb.response.clearAll(e.fromUser.userid, wbUser.id, e.message, virtualclass.wb.oTeacher);
        };

        //Get missed packet
        this.getMsPckt = function (e) {
            virtualclass.wb.gObj.chunk = [];
            var chunk = virtualclass.wb.bridge.sendPackets(e, virtualclass.wb.gObj.chunk);
            virtualclass.vutil.beforeSend({'repObj': chunk, 'chunk': true, 'cf' : 'repObj'});
            //var chunk = virtualclass.wb.bridge.sendPackets(e, virtualclass.wb.gObj.chunk);
        };

        //Create mouse
        this.createArrow = function (e) {
            if(typeof virtualclass.wb == 'object'){
                if (!virtualclass.wb.oTeacher) {
                    virtualclass.wb.response.createArrow(e.message, virtualclass.wb.oTeacher);
                }
            }
        };

        //Display Whiteboard Data
        this.repObj = function (e) {
            if(typeof virtualclass.wb != 'object'){
                virtualclass.makeAppReady(virtualclass.apps[0]);
            } else {
                //if(!roles.hasControls()){
                    // Teacher does not need this message
                    virtualclass.wb.utility.removeWhiteboardMessage();
                //}

                // The packets came from teacher when he/she does not has control won't be display
                if(e.fromUser.role == 'p' ||  ((e.fromUser.role == 't' || (e.fromUser.role == 'e')) && !virtualclass.vutil.isPresenterExist())){
                    virtualclass.wb.utility.replayObjsByFilter(e.message.repObj);
                }
            }
        };

        //Replay All, TODO, need to do verify
        this.replayAll =    function (e) {
            virtualclass.wb.response.replayAll();
        };
    };
});