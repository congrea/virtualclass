/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
$.uiBackCompat = false;
$(document).ready(function () {
    // for calculate the
    // Internet Speed, Frame Rate and Internet Latency
    // This need to call after join the session
    window.onload  = async function () {
        "use strict";
        var initAudios = 0;
        console.log('Whiteboard init very start');
        window.earlierWidth = window.innerWidth;
        window.earlierHeight = window.innerHeight;
        window.wbUser = wbUser;
        window.pageEnter = new Date().getTime();
        var virtualclass = new window.virtualclass();
        virtualclass.virtualclassIDBOpen = window.virtualclassOpenDB;

        window.virtualclass = virtualclass; //Need virtualclass object in each file

        virtualclass.gObj.displayError = 1;
        virtualclass.lang = {};
        virtualclass.lang.getString = window.getString;
        virtualclass.lang.message = window.message;

        virtualclass.createMainContainer();

        // TODO Error when screenShare or YouTube is default application
        //  var appIs = "EditorRich";
        // var appIs = "Whiteboard";

        virtualclass.gObj.sessionClear = false;
        virtualclass.settings = window.settings;
        virtualclass.settings.init();
        virtualclass.handleCurrentUserWithPrevious();

        virtualclass.gObj.mobileVchOffset = vhCheck();
        var wIds = localStorage.getItem('wIds');

        if(wIds != null){
            wIds = JSON.parse(wIds);
            virtualclass.gObj.wids = wIds;
            virtualclass.gObj.wbCount = wIds.length - 1;
        }

        var anypresenter = localStorage.getItem('anyp');
        if (anypresenter == null) {
            localStorage.setItem('anyp', wbUser.anyonepresenter)
        } else {
            // If status of anypresenter is switched then we remove the role
            // from local storage
            if (anypresenter != wbUser.anyonepresenter) {
                localStorage.removeItem('uRole');
                localStorage.setItem('anyp', wbUser.anyonepresenter)
            }
        }

        wbUser.virtualclassPlay = parseInt(wbUser.virtualclassPlay, 10);
        if (wbUser.virtualclassPlay) {
            virtualclass.gObj.sessionClear = true;
            //localStorage.removeItem('orginalTeacherId');
            virtualclass.gObj.role = 's';

            localStorage.removeItem('teacherId');
            //virtualclass.gObj.uid = 99955551230; // in replay mode the user can not be same which is using on actual program
            wbUser.id = 99955551230;

            virtualclass.gObj.uid = wbUser.id;
        }

        var capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };

        var previousApp = JSON.parse(localStorage.getItem('prevApp'));

        virtualclass.gObj.prevApp = previousApp;



        if (previousApp != null) {
            virtualclass.previousApp = previousApp;
            var appIs = capitalizeFirstLetter(previousApp.name);
            if (previousApp.name == 'Yts' || (previousApp.name == 'DocumentShare')) {
                if (previousApp.metaData == null) {
                    var videoObj = null;
                } else {
                    var videoObj = previousApp.metaData;
                    videoObj.fromReload = true;
                }
            }else if(previousApp.name == 'Video'){
                if(previousApp.metaData == null ||previousApp.metaData.init==null ){
                    var videoObj = null;
                } else {
                    var videoObj = previousApp.metaData;
                    videoObj.fromReload = true;
                }
            }else if(previousApp.name == 'Whiteboard'){
                if(wIds == null){
                    virtualclass.gObj.wbCount = previousApp.wbn;
                }
                // if(previousApp.hasOwnProperty('wbcs')){
                //     virtualclass.gObj.currSlide = previousApp.wbcs;
                // }

                var currSlide = localStorage.getItem('currSlide');
                if(currSlide != null){
                    virtualclass.gObj.currSlide = currSlide;
                }
            }
        } else {
            var appIs = virtualclass.gObj.defaultApp;
        }

        if (typeof videoObj == 'undefined') {
            var videoObj = null;
        }

        virtualclass.popup = new PopUp({
            showOverlay: true
        });

        virtualclass.precheck = localStorage.getItem('precheck');
        //virtualclass.precheck = true; //TODO this should be removed

        // For enable the precheck, you just need to
        //


        var isPrecheck = localStorage.getItem('precheck');
        if (isPrecheck != null) {
            virtualclass.isPrecheck = JSON.parse(isPrecheck);
        }

        if(wbUser.virtualclassPlay){
            virtualclass.isPrecheck = false;
            virtualclass.enablePreCheck = false;
        }else{
            virtualclass.precheck = localStorage.getItem('precheck');

            virtualclass.enablePreCheck = true;

            var isPrecheck = localStorage.getItem('precheck');
            if (isPrecheck != null) {
                virtualclass.isPrecheck = JSON.parse(isPrecheck);
            }
        }


        //TODO this should be removed
        // virtualclass.isPrecheck  = true;

        if (virtualclass.enablePreCheck && ( virtualclass.isPrecheck == null || !virtualclass.isPrecheck)) {
            virtualclass.makePreCheckAvailable = true;
        } else {
            virtualclass.makePreCheckAvailable = false;
            virtualclass.popup.waitMsg('refresh');
        }



        //  virtualclass.popup.waitMsg();

        // If the page is being refreshed from Become Teacher Link

        if (localStorage.getItem('beTeacher') != null) {
            // Set flag for delete the session when
            // new student become teacher
            virtualclass.gObj.doEndSession = true;
            virtualclass.gObj.beTeacher = true;
            wbUser.role = 't';
            virtualclass.gObj.uRole = 't';
            localStorage.setItem('uRole', 't');
            localStorage.removeItem('beTeacher');
            console.log('From locastorage:- beteacher found');
        } else {
            console.log('From locastorage:- beteacher not found');
        }
        virtualclass.gObj.fromPageRefresh = true;
        // If was in play mode before, start with fresh data
        if (!virtualclass.isPlayMode && localStorage.getItem('mySession') === 'thisismyplaymode') {
            console.log('DELETE PlayMode Data');
            localStorage.clear();
            await virtualclass.init(wbUser.role, appIs, videoObj);
            virtualclass.storage.config.endSession();
        } else {
            await virtualclass.init(wbUser.role, appIs, videoObj);
        }


        if(virtualclass.system.mybrowser.name == 'Edge'){
            var virtualclassContainer = document.getElementById('virtualclassCont');
            if(virtualclassContainer != null){
                virtualclassContainer.classList.add('edge');
            }
        }


        var alreadyInit = false;

        //TODO this both setinterval functions should be merged into one\

        if (!wbUser.virtualclassPlay) {
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

        // IMPORTANT, remove because of vcan
        // can be critical
        //if ((typeof vcan.teacher === 'undefined') && (!virtualclass.wb[virtualclass.gObj.currWb].stHasTeacher) && appIs == 'Whiteboard') {
        //    virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
        //}

        //virtualclass.wb[virtualclass.gObj.currWb].utility.initDefaultInfo(wbUser.role);
        virtualclass.vutil.initDefaultInfo(wbUser.role, appIs);

        if (roles.isStudent()) {
            var audioEnable = localStorage.getItem('audEnable');
            if (audioEnable !== null) {
                if (audioEnable.ac === 'false') {
                    virtualclass.user.control.mediaWidgetDisable();
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

        /** We start comminute with server only after access validation**/
        var initRequestToServer = function  (){
            if(virtualclass.gObj.readyToCommunicate){
                // if(virtualclass.recorder.totalRecordingFiles.length > 0){
                //     virtualclass.recorder.requestDataFromServer(virtualclass.recorder.totalRecordingFiles.shift().S);
                // }
                // virtualclass.recorder.requestDataFromServer(wbUser.vcSid, 1);
            }else {
                setTimeout(()=> {
                    initRequestToServer();
                    // virtualclass.recorder.requestListOfFiles();
                },700)
            }
        }

        if (virtualclass.vutil.isPlayMode()) {
            setTimeout(
                function () {
                    //earlier it was calling after requestDataFromServer
                    // because of which the popup box for replay is not displaying
                    clearEverthing();

                    initRequestToServer();
                },
                500 //increase 500 ms for indexeddb which was not ready till popup was display
            );
        }




        if (virtualclass.isPrecheck != null) {
            if (typeof virtualclass.videoHost.gObj.MYSPEED == 'undefined') {
                virtualclass.videoHost.gObj.MYSPEED = 1;
            }
            virtualclass.videoHost.afterSessionJoin();
        }



        var disableEditor = function (editor) {
            if (typeof virtualclass.hasOwnProperty(editor) && typeof virtualclass[editor] == 'object') {
                if (virtualclass[editor].hasOwnProperty('cm') && typeof virtualclass[editor].cm == 'object') {
                    virtualclass[editor].cm.setOption('readOnly', 'nocursor');
                } else {
                    console.log('CM is not ready for' + editor);
                }
            } else {
                console.log(editor + ' is not ready');
            }
        }


        var isTeacherExistWhenRemoveUser = function (users) {
            if (virtualclass.hasOwnProperty('connectedUsers')) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].role == 't' || users[i].role == 'e') {
                        return true;
                    }
                }
            }
            return false;
        }


        var removeAppsDom = function () {
            // remove whiteboard tool wrapper
            var commandToolsWrapper = document.getElementById('commandToolsWrapper');
            if (commandToolsWrapper != null) {
                commandToolsWrapper.parentNode.removeChild(commandToolsWrapper);
            }


            // remove virtualclass app tool
            var virtualclassAppCont = document.getElementById('virtualclassOptionsCont');
            if (virtualclassAppCont != null) {
                virtualclassAppCont.parentNode.removeChild(virtualclassAppCont);
            }
        }

        var removeSessionEndTool = function () {
            var virtualclassSessionEndTool = document.getElementById('virtualclassSessionEndTool');
            if (virtualclassSessionEndTool != null) {
                virtualclassSessionEndTool.parentNode.removeChild(virtualclassSessionEndTool);
                console.log("App Tool:- Remove session tool");
            }
        }

        var getUserId = function (joinId) {
            if (virtualclass.hasOwnProperty('connectedUsers')) {
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 'p')
                        && virtualclass.connectedUsers[i].userid != joinId) {
                        return virtualclass.connectedUsers[i].userid;

                    }
                }
            }
            return false;
        }

        var checkWithTeacher = function (e) {
            if ((virtualclass.jId == virtualclass.gObj.uid && virtualclass.vutil.isTeacherAlreadyExist(virtualclass.jId))) {
                return true;
            } else {
                return false;
            }
        }


        var isPresenterAlreadyExist = function (e) {
            if ((virtualclass.jId == virtualclass.gObj.uid) && virtualclass.vutil.isPresenterAlreadyExist(virtualclass.jId)) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * By this funciton overriding the role and
         * and adjusting the layout/html according to the given role
         * @param role
         */
        var overrideOperation = function (role) {
            if (role == 's') {
                virtualclass.view.disappearBox('drawArea'); //remove draw message box
                removeAppsDom();
                if (typeof virtualclass.wb == 'object') {
                    // make canvas disable if there canvas is disabled
                    virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
                }
            } else if (role == 'e') {
                var userId = getUserId(virtualclass.jId);
                if (userId) {
                    var virtualclassCont = document.getElementById('virtualclassCont');
                    virtualclassCont.classList.add('orginalTeacher');
                    // sending flag as new user become educator is joined
                    //virtualclass.vutil.beforeSend({
                    //    'status': true,
                    //    control: 'editorRich',
                    //    toUser: userId,
                    //    'cf': 'nEd'
                    //}, userId);
                    // transferControl(userId);
                }
                console.log('Member add :- join as educator');
            } else {
                console.log('Member add :- join as ' + role);
            }

            io.disconnect();

            virtualclass.vutil.overrideRoles(role);
            /**If we invoke io.init() without time(1500 miliseconds), then
             * teacher received both events member_joined and member_removed
             * at same time, only time difference is 2 or 3 miliseconds,
             * the sequence of event is incorrect member_added and user_logout ,
             * After delay some time, event sequence is correct user_logout and member_added,
             * **/
            io.init(virtualclass.uInfo);

        }

        /**
         * If educator role is override then
         * by this function, transfer the educator role to presenter
         * @param userId
         */
        var transferControl = function (userId) {
            // virtualclass.clearSession();
            // We need handle to   the bindary data
            //debugger;
            setTimeout(
                function () {
                    virtualclass.gObj.veryFirstJoin = false;
                    virtualclass.user.control._assign(userId);
                    var elem = document.getElementById(userId + 'contrAssignImg');
                    elem.setAttribute('data-assign-disable', false);
                    document.getElementById(userId + 'contrAssignImg').click();
                },
                2000
            );
        }

        function joinAsTeacher (jId){
            virtualclass.gObj.veryFirstJoin = false;
            if (!virtualclass.vutil.isOrginalTeacherExist(jId)) {
                overrideOperation('t');
                console.log('Member add :- join as teacher');
            }

            if (virtualclass.gObj.hasOwnProperty('doEndSession') && roles.isTeacher()) {
                overrideRoleTeacher();
            }
        }

        function initOverrideRoleTeacher (jId){
            if (virtualclass.gObj.hasOwnProperty('doEndSession') && selfJoin(jId) && virtualclass.joinUser.role == 't') {
                overrideRoleTeacher();
            }
        }

        function sayHelloToNewUser(e, iamObj, jId){
            if(!e.hasOwnProperty('cmadd')){
                ioAdapter.sendUser(iamObj, jId);
                if(roles.hasControls()){
                    var wid = virtualclass.gObj.currWb;
                    if(virtualclass.pdfRender[wid] != null ){
                        virtualclass.pdfRender[wid].sendCurrentScroll(jId);
                    }
                }
                console.log('Member, ping to new user, From ' + virtualclass.gObj.uid + ' To ' + virtualclass.jId);
            }
        }

        function sendCursorToNewUser(e, jId){
            if(!e.hasOwnProperty('cmadd')){
                if(roles.hasControls()){
                    var wid = virtualclass.gObj.currWb;
                    if(virtualclass.pdfRender[wid] != null ){
                        virtualclass.pdfRender[wid].sendCurrentScroll(jId);
                    }
                }
            }
        }

        var memberUpdateWithDelay_timer;
        virtualclass.gObj.memberlistpending =[];

        function isAlreadyInPendingList (user){
            if(virtualclass.gObj.memberlistpending.length > 0){
                var index = virtualclass.gObj.memberlistpending.findIndex(function (userObj){
                        return userObj.userid == user.userid
                });
                return (index > -1);
            }
        }

        function memberUpdateWithDelay(e, f) {
            if(f ==  'removed') {
                /** Removing the disconnected user from queue(memberlistpending) and DOM **/
                var index = virtualclass.gObj.memberlistpending.findIndex(x => x.userid == e.removeUser);
                if (index > -1) {
                    virtualclass.gObj.memberlistpending.splice(index, 1);
                    console.log("===== JOIN user left call");
                } else {
                    setTimeout(function (){
                        console.log("===== JOIN user left call");
                        memberUpdate(e,f);
                    },0)
                }
            } else {
                /** Making the user list queue (memberlistpending) here, on every user join **/

                var userlist = e.message;
                if(virtualclass.isPlayMode){
                    /**
                     * When user sought recording, there would displayed multiple instances of same user on chat list
                     * It avoids to add the same users on memberlistpending array and same way on chat list,
                     * **/
                    for(var i=0; i<userlist.length; i++) {
                        if(!isAlreadyInPendingList(userlist[i])){
                            virtualclass.gObj.memberlistpending.push(userlist[i])
                        }
                    }
                }else {
                    for(var i=0; i<userlist.length; i++) {
                        virtualclass.gObj.memberlistpending.push(userlist[i])
                    }
                }
                console.log('member list pending(memberlistpending) udpate ');
            }

            /**
             * This ensures memberUpdate would be invoked and memberUpdateDelayTimer(setTimeout) would be set only
             * after every 1500 miliseconds, which means the setimeout would not be set on every user joined
             * **/
            if (virtualclass.gObj.memberlistpending.length > 0) {
                if (!virtualclass.gObj.hasOwnProperty("memberUpdateDelayTimer")) {
                    virtualclass.gObj.memberUpdateDelayTimer = setTimeout(function () {
                        memberUpdate(null, 'added');
                        delete virtualclass.gObj.memberUpdateDelayTimer;
                        if(!virtualclass.gObj.hasOwnProperty('addEventToChatDiv')){
                            var chatDiv = virtualclass.gObj.testChatDiv.shadowRoot.querySelector('#subchat');
                            chatDiv.addEventListener('click', function (element){
                                var targetElem = element.srcElement;
                                chatContainerEvent.onEvent(targetElem, chatboxManager);

                            });
                            virtualclass.gObj.addEventToChatDiv = true;

                        }
                    }, 1500)
                }
            }
        }

        /**
         * This is performing default action when member is added
         * Which means after role overrides/confirmation
         * @param expect
         * @param sType
         *
         */

        var defaultOperation = function (e, sType) {

            if ((virtualclass.jId == virtualclass.gObj.uid)) {
                // Override the roles for removing Class from virtualclass container.
                if (virtualclass.joinUser.role != 't') {
                    virtualclass.vutil.overrideRoles(virtualclass.joinUser.role);
                    if (virtualclass.joinUser.role == 's') {
                        removeAppsDom();
                    } else if (virtualclass.joinUser.role != 'e') {
                        removeSessionEndTool(); // remove session tool if there is any
                    }
                }


                if (virtualclass.gObj.hasOwnProperty('doEndSession') && virtualclass.joinUser.role == 't') {
                    overrideRoleTeacher();
                    console.log('From localStorage, perform the override role action');
                } else {
                    console.log('From localStorage, cannot perform the override role action');
                }
            } else {
                console.log('Does not need to say hello to new user');
                // We nee to send the current cursor to new user for for whiteboards
                //sendCursorToNewUser(e, virtualclass.jId);
            }

            ioPingPong.ping(e);

            // e.message.sort(sortUserList);
            // e.message = [virtualclass.joinUser];
            if(!Array.isArray(e.message)){
                e.message = [e.message];
            }

            memberUpdateWithDelay(e, 'added');

            // virtualclass.media.updateVideoContHeight();

            //  TODO this should be enable after remove the bewlow testing code
            //  virtualclass.media.updateVideoContHeight();
            // virtualclass.vutil.createDummyUser();

            // iMPORTANT this is for testing purpose only
            /* setTimeout(
             function (){
             // virtualclass.vutil.createDummyUser();
             //virtualclass.media.updateVideoContHeight();
             },2000
             ); */

            if (roles.hasAdmin()) {
                if (virtualclass.gObj.uid == virtualclass.jId) {
                    if(!virtualclass.gObj.studentSSstatus.mesharing){
                        if (virtualclass.currApp.toUpperCase() == 'EDITORRICH' || virtualclass.currApp.toUpperCase() == 'EDITORCODE') {
                            ioAdapter.mustSend({'eddata': 'currAppEditor', et: virtualclass.currApp});
                        }

                        // On reload or new connection, make sure all students have same editor data
                        if (virtualclass.editorRich.isVcAdapterIsReady('editorRich')) {
                            virtualclass.editorRich.responseToRequest();
                        } else {
                            console.log('Editor Rich vcAdapter is not ready');
                        }

                        if (virtualclass.editorCode.isVcAdapterIsReady('editorCode')) {
                            virtualclass.editorCode.responseToRequest();
                        } else {
                            console.log('Editor Code vcAdapter is not ready');
                        }
                    }

                     if (virtualclass.currApp === 'SharePresentation') {
                        if (typeof virtualclass.sharePt == 'object') {
                            ioAdapter.mustSendUser({
                                'ppt': {
                                    'init': virtualclass.sharePt.pptUrl,
                                    startFrom: virtualclass.sharePt.state
                                }, 'cf': 'ppt'
                            }, virtualclass.jId);
                        }
                    }else if(virtualclass.currApp ==='Video'){
                        if (typeof virtualclass.videoUl.player == 'object') {
                            ioAdapter.mustSendUser({
                                'videoUl': {
                                    'init': {
                                        videoId:virtualclass.videoUl.videoId,
                                        videoUrl:virtualclass.videoUl.videoUrl,
                                    },
                                    startFrom: virtualclass.videoUl.player.currentTime()
                                }, 'cf': 'videoUl'
                            }, virtualclass.jId);
                        }
                    }

                }

                // Send to everyone that the teacher is connected
                // for remove for extra cover of read only mode with editor
                ioAdapter.sendWithDelayAndDrop ({'cf': 'tConn'}, null, 'send', 'tConn', 1000);

            }

            // Greet new student with info, When other user join
            if (roles.hasControls() && virtualclass.gObj.uid != virtualclass.jId) {
                // Greet new student with info
                virtualclass.vutil.sendCurrAppOnUserJoin();

                if (virtualclass.currApp === 'ScreenShare') {
                    sType = 'ss';
                }  else if (virtualclass.currApp === 'SharePresentation') {
                    console.log("sharePPt");
                    //debugger;
                    if (typeof virtualclass.sharePt == 'object') {
                        ioAdapter.mustSendUser({
                            'ppt': {
                                'init': virtualclass.sharePt.pptUrl,
                                startFrom: virtualclass.sharePt.state
                            }, 'cf': 'ppt'
                        }, virtualclass.jId);
                    } else {
                        // TODO Need more validation  from nirmala
                        ioAdapter.mustSendUser({'ppt': {'init': 'studentlayout'}, 'cf': 'ppt'}, virtualclass.jId);
                    }
                } else if (virtualclass.currApp === 'DocumentShare') {

                    // ioAdapter.mustSendUser({'ppt': {'init': virtualclass.sharePt.pptUrl, startFrom : virtualclass.sharePt.state}, 'cf' : 'ppt'}, virtualclass.jId);

                    if (roles.hasControls() && virtualclass.dts.docs.hasOwnProperty('currDoc')) {
                        if(virtualclass.gObj.currWb != null){
                            var doc = virtualclass.dts.docs.currDoc;
                            //ioAdapter.mustSendUser({'ppt': {'init': virtualclass.sharePt.pptUrl, startFrom : virtualclass.sharePt.state}, 'cf' : 'ppt'}, virtualclass.jId);
                            ioAdapter.mustSendUser({
                                'dts': {
                                    slideTo: virtualclass.dts.docs.note.currNote,
                                    docn: virtualclass.dts.docs.currDoc
                                }, 'cf': 'dts'
                            }, virtualclass.jId);
                            console.log('Document share send :- Complete slide');
                        }
                    } else {
                        ioAdapter.mustSendUser({'dts': {init: 'studentlayout'}, 'cf': 'dts'}, virtualclass.jId);
                        console.log('Document share send :- Layout');
                    }
                }else if(virtualclass.currApp === 'Video'){
                    if(typeof virtualclass.videoUl.player == 'object'){
                        if(virtualclass.videoUl.videoUrl){
                            ioAdapter.mustSendUser({'videoUl': {'init': {id:virtualclass.videoUl.videoId,videoUrl:virtualclass.videoUl.videoUrl },
                            startFrom : virtualclass.videoUl.player.currentTime(),isPaused:virtualclass.videoUl.player.paused()}, 'cf' : 'videoUl'}, virtualclass.jId);
                        }
                    } else {
                        ioAdapter.mustSendUser({'videoUl': {'init' : 'studentlayout'}, 'cf': 'videoUl'}, virtualclass.jId);
                    }
                }

                if (typeof sType !== 'undefined' && sType !== null) {
                    triggerInitShareScreen(sType, 6000); //There might need some time to executing missed packets
                }
            }else if (roles.isStudent() && virtualclass.gObj.uid != virtualclass.jId && virtualclass.gObj.studentSSstatus.mesharing) {
                sType = 'ss';
                //There might need some time to executing missed packets
                triggerInitShareScreen(sType, 6000);
            }
        }

        function triggerInitShareScreen (sType, setTime){
            if (typeof virtualclass.getDataFullScreen == 'function') {
                virtualclass.ss.initShareScreen(sType, setTime);
            }
        }

        function isAnyOnePresenter() {
            var isPresenter = parseInt(wbUser.anyonepresenter, 10);
            return (isPresenter == 1);
        }

        virtualclass.gObj.veryFirstJoin = true;

        function getUserObj (arr, uid){
            var index = arr.findIndex(function(o){
                if(o.userid === uid){
                    return o;
                }
            });
        }

        function getPosition (connectedUsers, uid){
            var index = connectedUsers.findIndex(function(o){
                return o.userid == uid;
            });
            return index;
        }

        var overrideRoleTeacher = function () {
            console.log('Member add:- End session override teacher');
            virtualclass.storage.config.endSession();
            localStorage.setItem('uRole', 't');
            delete virtualclass.gObj['doEndSession'];
        }

        function processImage(msg, vtype) {
            var data_pack = new Uint8ClampedArray(msg);
            var recmsg = data_pack.subarray(2, data_pack.length);
            if(vtype == 1){
                var b64encoded = "data:image/webp;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                var imgType = "webp";
            }else {
                var b64encoded = "data:image/jpeg;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                var imgType = "jpeg";
            }

            virtualclass.videoHost.drawReceivedImage(b64encoded, imgType, {x: 0, y: 0});
        }

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

            this.pong = function (e) {
                ioPingPong.pong(e);
            };

            this.pongAck = function (e) {
                ioPingPong.pongAck(e);
            };

            this.control = function (e) {
                virtualclass.user.control.onmessage(e);
            };

            //editor data
            this.eddata = function (e) {
                //virtualclass.editorRich.onmessage(e.message);
                if (e.message.hasOwnProperty('et')) {
                    if (e.message.et == 'editorRich') {
                        virtualclass.editorRich.onmessage(e, 'EditorRich');
                    } else {
                        virtualclass.editorCode.onmessage(e, 'EditorCode');
                    }
                }
            };

            /**
             * This functioon would invoke when the new user would join as
             * educator with overriding the role. This would at invoke at presenter window
             * for handle editor mode(read and write)
             * @param e.message has various required properties
             */
            this.nEd = function (e) {
                localStorage.setItem('nEd', true);
                //TODO the editor should be dynamic
                var editorRichWriteModeBox = document.getElementById('EditorRichwriteModeBox');

                if (editorRichWriteModeBox != null) {
                    if (editorRichWriteModeBox.dataset.writeMode == 'true') {
                        localStorage.removeItem('nEd');
                    } else {
                        e.message.cf = 'control';
                        localStorage.setItem('editorCode', 'true');
                        virtualclass.user.control.onmessage(e);
                    }

                } else {
                    console.log('editor mode editorRichWriteModeBox null');

                }
                console.log('Editor mode save');
            };

            this.bt = function () {
                virtualclass.vutil.removeBecomeTeacherWidget();

            }

            this.tConn = function (e) {
                // Lets Editor be the ready
                setTimeout(
                    function () {

                        virtualclass.vutil.setReadModeWhenTeacherIsConn('editorRich');
                        virtualclass.vutil.setReadModeWhenTeacherIsConn('editorCode');
                    }, 2000
                );
            }

            //youtube share
            this.yts = function (e) {
                //nothing to do with self received packet
                if (e.fromUser.userid != virtualclass.gObj.uid) {
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
                    if (anchorTag != null) {
                        anchorTag.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
                    }
                }
                return true;
            };

            this.settings = function (e){
                if(e.message.hasOwnProperty("Hex")) {
                   virtualclass.settings.onMessage(e.message.Hex, e.message.toUser);
                }
            };

            //enable chat
            this.enc = function (e) {
                if (e.message.hasOwnProperty('ouser')) {
                    virtualclass.user.control.enable(e.message.ouser, 'chat', 'Chat', 'chat');
                } else {
                    virtualclass.user.control.allChatEnable();
                    virtualclass.gObj.chatEnable = true;
                    // virtualclass.vutil.beforeSend({'enc': true, 'cf': 'enc', ouser: e.message.toUser});
                }
                document.querySelector('#chatWidget').classList.remove('chat_disabled');
                document.querySelector('#chat_div').classList.remove('chat_disabled');

            };

            //disable chat
            this.dic = function (e) {
                //if other user's control should be disabled
                if (e.message.hasOwnProperty('ouser')) {
                    virtualclass.user.control.disable(e.message.ouser, 'chat', 'Chat', 'chat');
                } else {
                    virtualclass.user.control.allChatDisable();
                    virtualclass.gObj.chatEnable = false;
                    // virtualclass.vutil.beforeSend({'dic': true, 'cf': 'dic', ouser: e.message.toUser});
                }
            };

            //enable audio
            this.ena = function (e) {
                // if (e.message.toUser == virtualclass.gObj.uid) {
                //     virtualclass.user.control.audioWidgetEnable(true);
                //     virtualclass.gObj.audioEnable = true;
                // } else {
                //     virtualclass.user.control.enable(e.message.toUser, 'audio', 'Aud', 'aud');
                // }
            };

            //disable audio
            this.dia = function (e) {
                // virtualclass.gObj.audioEnable = false;
                // var speakerPressOnce = document.querySelector('#speakerPressOnce');
                // if(speakerPressOnce.dataset.audioPlaying == true || speakerPressOnce.dataset.audioPlaying == 'true'){
                //     virtualclass.media.audio.clickOnceSpeaker('speakerPressOnce');
                // }
                //
                // if (e.message.toUser == virtualclass.gObj.uid) {
                //     // virtualclass.user.control.mediaWidgetDisable();
                //     virtualclass.user.control.audioDisable();
                //     virtualclass.gObj.audioEnable = false;
                // } else {
                //     virtualclass.user.control.disable(e.message.toUser, 'audio', 'Aud', 'aud');
                // }
            };

            //enable all std audio
            this.aEna = function (e){
                //virtualclass.user.control.audioWidgetEnable(true);
                //virtualclass.gObj.audioEnable = true;
            };

            // disable all std audio
            this.aDia = function (e){
                //var speakerPressOnce = document.querySelector('#speakerPressOnce');
                //if(speakerPressOnce.dataset.audioPlaying == true || speakerPressOnce.dataset.audioPlaying == 'true'){
               //     virtualclass.media.audio.clickOnceSpeaker('speakerPressOnce');
               // }
                //virtualclass.user.control.audioDisable();
                //virtualclass.gObj.audioEnable = false;

            };

            //chat message update
            this.msg = function (e) {
                messageUpdate(e);  //chat update
            };

            //session end
            this.sEnd = function (e) {
                // #967
                var joinClass = document.querySelector('#joinClassModal');
                joinClass.style.display = "none";

                var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
                if(virtualclassApp != null ){
                    virtualclassApp.style.display =  'block';
                }
                virtualclass.storage.config.endSession();
                virtualclass.popup.sesseionEndWindow();
                virtualclass.gObj.endSession = true;
            };

            //whiteboard ready
            this.dispWhiteboard = function (e) {
                virtualclass.makeAppReady(virtualclass.apps.wb, undefined, e.message.d);
            };
            this.ppt = function (e) {
                if (e.fromUser.userid != virtualclass.gObj.uid) {
                    if (e.message.hasOwnProperty('init')) {
                        virtualclass.makeAppReady(virtualclass.apps.sp);
                    } else {
                        if (typeof virtualclass.sharePt != 'object') {
                            //If virtualclass.ssharePt is not ready at participate side, then we
                            // will create it first then only proceed to next ppt packet
                            virtualclass.makeAppReady(virtualclass.apps.sp);
                            virtualclass.sharePt.onmessage({
                                pptMsg: e.message.ppt.init,
                                cf: 'ppt',
                                user: "all",
                                cfpt: 'setUrl'
                            });
                        }
                        virtualclass.sharePt.onmessage(e.message);
                    }
                }
            };

            //unshare schreen
            this.unshareScreen = function (e) {
                var app = e.message.st;
                if (typeof virtualclass[app] === 'object') {
                    console.log('Unshare the screen at student');
                    virtualclass[app].prevImageSlices = [];
                    virtualclass[app].removeStream();
                    virtualclass.currApp = virtualclass.gObj.defaultApp;
                }
            };

            //notfound
            this.videoSlice = function (e) {
                virtualclass.media.playVideo(e.message.videoSlice);
            };

            //screen share by image
            this.videoByImage = function (e) {
                if (!virtualclass.media.existVideoContainer(e.message.videoByImage)) {
                    virtualclass.media.video.createElement(e.message.videoByImage);
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
                var disconnect = virtualclass.wb[virtualclass.gObj.currWb].response.checkUser(e, wbUser.id, virtualclass.wb[virtualclass.gObj.currWb].stHasTeacher);
                if (typeof disconnect !== 'undefined') {
                    if (disconnect === 'diconnect') {
                        //TODO : ?
                    }
                }
            };

            //Reclaim Role
            this.reclaimRole = function (e) {
                // debugger;
                console.log('Role reclaim');
                //if (localStorage.getItem('teacherId') !== null) {
                if (roles.hasControls()) {

                    virtualclass.vutil.vcResponseAReclaimRole(e.fromUser.userid, wbUser.id);

                    //virtualclass.wb[virtualclass.gObj.currWb].response.reclaimRole(e.fromUser.userid, wbUser.id);
                }
            };

            /**
             * remove presenter role when educator is join as teacher
             * @param e
             */
            this.rpr = function (e) {
                this.reclaimRole(e);
                console.log('reclaim role');
            }

            //Assign Role
            this.assignRole = function (e) {
                //debugger;
                if (e.message.toUser === virtualclass.gObj.uid) {
                    console.log('Role assign');
                    if (typeof virtualclass.wb == 'object') {
                        virtualclass.wb[virtualclass.gObj.currWb].utility.removeWhiteboardMessage();
                    }
                    virtualclass.vutil.vcResponseAssignRole(e.fromUser.userid, wbUser.id);
                    //virtualclass.wb[virtualclass.gObj.currWb].response.assignRole(e.fromUser.userid, wbUser.id);
                }
            };

            //Clear All
            this.clearAll = function (e) {
                if (typeof virtualclass.wb != 'object') {
                    virtualclass.makeAppReady(virtualclass.apps.wb);
                }
                virtualclass.wb[virtualclass.gObj.currWb].response.clearAll(e.fromUser.userid, wbUser.id, e.message, virtualclass.wb[virtualclass.gObj.currWb].oTeacher);
            };

            //Get missed packet
            this.getMsPckt = function (e) {
                virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk = [];
                var chunk = virtualclass.wb[virtualclass.gObj.currWb].bridge.sendPackets(e, virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk);
                virtualclass.vutil.beforeSend({'repObj': chunk, 'chunk': true, 'cf': 'repObj'});
                //var chunk = virtualclass.wb[virtualclass.gObj.currWb].bridge.sendPackets(e, virtualclass.wb[virtualclass.gObj.currWb].gObj.chunk);
            };

            //Create mouse
            this.createArrow = function (e) {
                if (typeof virtualclass.wb == 'object') {
                    if (!roles.hasControls()) {
                        virtualclass.wb[virtualclass.gObj.currWb].response.createArrow(e.message);
                    }
                }
            };

            //Display Whiteboard Data
            this.repObj = function (e) {
           //     console.log("whiteboard Incomming UID ===== " + e.message.repObj[0].uid);

                if (typeof virtualclass.wb != 'object' && virtualclass.currApp != 'DocumentShare') {
                    virtualclass.makeAppReady(virtualclass.apps.wb);
                }

                if(typeof virtualclass.gObj.currWb != 'undefined' ){
                    virtualclass.wb[virtualclass.gObj.currWb].utility.removeWhiteboardMessage();

                    // The packets came from teacher when he/she does not has control won't be display
                    if (e.fromUser.role == 'p' || ((e.fromUser.role == 't' || (e.fromUser.role == 'e')) && !virtualclass.vutil.isPresenterExist())) {
                        virtualclass.wb[virtualclass.gObj.currWb].utility.replayObjsByFilter(e.message.repObj);
                    } else {
                        console.log("whiteboard -------------------------- We just lost a packet");
                    }
                }
            };

            //Replay All, TODO, need to do verify
            this.replayAll = function (e) {
                virtualclass.wb[virtualclass.gObj.currWb].response.replayAll();
            };


            // documnetation sharing
            this.dts = function (e) {
                // virtualclass.dts.onmessage(e);
                console.log('Document share :- message received ' + e.message.serial);
                console.dir(e.message.dts);
                if (e.message.dts.hasOwnProperty('init')) {
                    virtualclass.gObj.screenRh = 100;
                    virtualclass.makeAppReady('DocumentShare', undefined, e.message.dts);
                    virtualclass.gObj.screenRh = 60;
                } else if (typeof virtualclass.dts == 'object') {
                    virtualclass.dts.onmessage(e);
                }
            }
            this.poll= function(e){
                console.log(e.message.poll.pollMsg);
                if (e.message.poll.pollMsg=="init") {
                    virtualclass.makeAppReady("Poll");
                }else {
                    if(typeof virtualclass.poll != 'object'){
                        //If virtualclass.ssharePt is not ready at participate side, then we
                        // will create it first then only proceed to next ppt packet
                        virtualclass.makeAppReady("Poll");
                        virtualclass.poll.onmessage({pollMsg: e.message.poll.init,  cf: 'poll',  user: "all"});
                    }
                    virtualclass.poll.onmessage(e.message,e.fromUser);
                }
            }

            this.quiz = function(e){
                console.log(e.message.quiz.quizMsg);
                if (e.message.quiz.quizMsg=="init") {

                    virtualclass.makeAppReady("Quiz");
                }else {
                    if(typeof virtualclass.quiz != 'object'){
                        virtualclass.makeAppReady("Quiz");
                        virtualclass.quiz.onmessage({quizMsg: e.message.quiz.init,  cf: 'quiz',  user: "all"});
                    }
                    virtualclass.quiz.onmessage(e.message,e.fromUser);
                }
            }


            this.videoUl= function(e){
                if(e.fromUser.userid != virtualclass.gObj.uid){
                    virtualclass.videoUl.onmessage(e.message);
                }
            }
            //nirmala
            this.congController= function(e){
                if(e.fromUser.userid != virtualclass.gObj.uid){
                    virtualclass.videoHost.onmessage(e.message);
                }

                var videoMode = e.message.congCtr.videoSwitch;
                if(videoMode == 'off'){
                    virtualclass.vutil.addClass('virtualclassCont', 'videoff');
                    virtualclass.vutil.addClass('virtualclassAppRightPanel', 'hide');
                    virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'show');
                    virtualclass.videoHost.setUserIcon(e.fromUser.userid );
                }else {
                   document.querySelector('#virtualclassCont').classList.remove('videoff');
                    virtualclass.vutil.addClass('virtualclassAppRightPanel', 'show');
                    virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'hide');
                }

            }

            this.tsr = function (e){
                return;
                var enable = e.message.ac;
                if(enable){
                    virtualclass.chat.enableTechSupport(e.message.uid);
                }else {
                    virtualclass.chat.disableTechSupport(e.message.uid);
                }
            }

            // no audio
            this.na = function (e){
                virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, "icon-audioEnaOrange");
            },

            //yes audio
            this.ya = function (e){
                virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, "icon-audioEnaGreen");
            },



            this.mem_add = function (e){
                virtualclass.ioEventApi.member_added({
                    type: "member_added",
                    newJoinUser: e.message.user,
                    cmadd : true
                });
            }

            this.mvid = function (e){
                console.log('multivideo, message received');
                virtualclass.multiVideo.onmessage(e.message, e.fromUser.userid);
            }

            this.sc = function (e){
                console.log('Recevied scroll');
                virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
            }

            this.scf = function (e){
                console.log('Recevied scroll first');
                console.dir(e.message);
                if(virtualclass.gObj.currWb != null){
                    virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
                }
            }

            this.cwb = function (e){
                if(e.message.hasOwnProperty('diswb')){
                   var wid = e.message.wid;
                    virtualclass.gObj.currWb = wid;
                    if(!virtualclass.wbCommon.whiteboardExist(virtualclass.gObj.currWb)){
                        virtualclass.vutil.createWhiteBoard(virtualclass.gObj.currWb);
                    }
                    var idn = wid.split('_');
                    if(idn.length > 0){
                       virtualclass.gObj.currSlide = idn[idn.length-1];
                    }
                    virtualclass.wbCommon.displaySlide(wid);
                    console.log('whiteboard slide received=' + wid);
                    virtualclass.vutil.resizeWindowIfBigger();
                }else if(e.message.hasOwnProperty('wbCount')){
                    virtualclass.gObj.wbCount = e.message.wbCount;
                    virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
                }
            }

            /***** Start Student Screen Sharing *****/
            /* Handle teacher request for screen sharing **/
            this.reqscreen = function(e){
                if(virtualclass.system.device != 'mobTab' &&
                    (virtualclass.system.mybrowser.name == 'Chrome' || virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'Edge')){
                    var message = virtualclass.lang.getString('stdscreenshare');
                    if(virtualclass.gObj.precheckScrn){
                        virtualclass.vutil.prechkScrnShare();
                    }
                    virtualclass.popup.confirmInput(message,function (confirm){
                        if(confirm){
                            if(roles.isStudent()){
                                virtualclass.gObj.studentSSstatus.mesharing = true;

                            }
                            var appName = "ScreenShare";
                            virtualclass.makeAppReady(appName, "byclick");
                        }else{
                            virtualclass.vutil.beforeSend({'sd': true, 'cf': 'colorIndicator'});
                        }
                    });
                } else {
                    virtualclass.vutil.beforeSend({'ext': true, 'cf': 'colorIndicator', 'nosupport' : true});
                }
            }

            /** Knows the id of student who is screen sharing **/
            this.sshare_user = (e) => {
                virtualclass.vutil.removeSSsharing();
                virtualclass.gObj.whoIsSharing = e.fromUser.userid;
                virtualclass.vutil.initssSharing(e.fromUser.userid);
            }

            // Self view, but display none to others
            this.sview = function(e){
                var elem = document.getElementById("virtualclassScreenShareLocal");
                if(roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing) {
                    if(elem != null){
                        elem.style.display = "none";
                    }
                }
                if(e.message.hasOwnProperty('firstSs')){
                    virtualclass.gObj.studentSSstatus.sharing = true;

                }
                virtualclass.gObj.studentSSstatus.shareToAll = false;
                console.log('Share, self view');
            }

            // Share screenshare to all
            this.sToAll = function () {
                var elem = document.getElementById("virtualclassScreenShareLocal");
                if (elem != null) {
                    elem.style.display = 'block';
                }
                virtualclass.gObj.studentSSstatus.shareToAll = true;
                virtualclass.gObj.studentSSstatus.sharing = true;
                console.log('Share, to all');
            }

            /** This happens when student does page refresh during the share is being shared  **/
            this.rmStdScreen = function(e){
                virtualclass.vutil.initDefaultApp();
                virtualclass.vutil.beforeSend({'unshareScreen': true, st: 'ss', 'cf': 'unshareScreen'});
                if(typeof virtualclass.ss == 'object'){
                    virtualclass.ss.clearScreenShare();
                }else {
                    virtualclass.vutil.removeSSsharing();
                }
            }
            /***** End Student Screen Sharing *****/

            this.raiseHand= function(e){
                virtualclass.raiseHand.onMsgRec(e);
            }
            this.colorIndicator= function(e){
                var rMsg = e.message;
                var uid = e.fromUser.userid;
                if(rMsg.sd){
                    var elem = chatContainerEvent.elementFromShadowDom('#ml'+uid + ' .icon-stdscreenImg');
                    if(elem != null){
                        elem.setAttribute('data-dcolor', 'red');

                    }
                }else if(rMsg.ext){
                    var color = rMsg.hasOwnProperty('nosupport') ? 'nosupport' : 'orange';


                    var elem = chatContainerEvent.elementFromShadowDom('#ml'+uid + ' .icon-stdscreenImg');
                    if(elem != null){
                        elem.setAttribute('data-dcolor', color);
                    }
                }
            }


            this.stdVideoCtrl= function(e){
                if(e.fromUser.userid != virtualclass.gObj.uid){
                    virtualclass.videoHost.stdVideoCtrlMsg(e);
                }
            }

            this.toggleVideo=function(e){
                // if(e.fromUser.userid != virtualclass.gObj.uid){
                //     var sw = document.querySelector(".videoSwitchCont #videoSwitch");
                //     if(sw.classList.contains("off") &&  e.message.action == "disable"){
                //         console.log("do nothing");
                //     }else if(sw.classList.contains("on")  &&  e.message.action == "enable") {
                //         console.log("do nothing");
                //     }else if(sw.classList.contains("on")  &&  e.message.action == "disable"){
                //         //sw.click();
                //         //when user enable his video teacher disable his video.
                //         virtualclass.vutil.videoHandler("off");
                //     }
                //     virtualclass.videoHost.toggleVideoMsg(e.message.action);
                //     localStorage.setItem("allVideoAction" , e.message.action);
                // }
            }

            this.destroyPlayer = function (e) {
                if (virtualclass.currApp == "Video") {
                    if (virtualclass.hasOwnProperty('videoUl') && virtualclass.videoUl.videoUrl) {
                        virtualclass.videoUl.videoUrl = "";
                        virtualclass.videoUl.videoId = "";
                        var frame = document.getElementById("dispVideo_Youtube_api"); //youtube video
                        if (frame && frame.contentWindow) {
                            frame.contentWindow.postMessage(
                                    '{"event":"command","func":"pauseVideo","args":""}',
                                    '*');
                        }
                        var dispVideo = document.querySelector(".congrea #dispVideo"); //uploaded video
                        if (dispVideo) {
                            dispVideo.style.display = "none";
                            var video = document.querySelector(".congrea #dispVideo video");
                            if (video) {
                                video.setAttribute("src", '');
                            }
                        }
                        var currPlayed = document.querySelector('#listvideo .playing');
                        if(currPlayed){
                            currPlayed.classList.remove('playing')
                        }
                        var currCont = document.querySelector("#listvideo .removeCtr");
                        if(currCont){
                            currCont.classList.remove('removeCtr');
                        }

//                        $('.congrea #listvideo .playing').removeClass('playing');
//                        $('.congrea #listvideo .removeCtr').removeClass('removeCtr');

                        if(typeof virtualclass.videoUl.player == 'object'){
                           delete(virtualclass.videoUl.player);
                        }
                    }

                }

            }

            this.sync = function  (){
                // console.log('nothing for sync ');
            }

            /** Record setting **/
            this.recs = function (e){
                if(!virtualclass.isPlayMode){
                    virtualclass.settings.recording.onMessage(e.message);
                }
            }
        };

        // TODO this shoudl be remove, after precheck feature is enabled
        /**
         * @author(Current)  Suman Bogati  2018 <http://www.vidyamantra.com>  */
        var ioEventApi = {
            readyto_member_add : function (e){
                if(typeof e.joinUser == 'object' ){
                    var te = {};
                    var i = 0;

                    for(let key in e.joinUser){
                        if(wbUser.id != key){
                            console.log('Don t join');
                            te.joinUser = {key : key }
                            te.message = e.message[i];
                            te.newuser = e.newuser;
                            te.type = e.type;
                            te.user =  e.user;
                            i++;
                            this.member_added(te);
                        }
                    }
                } else {
                    this.member_added(e);
                }
            },

            member_added : function (e){
                // console.log('===== JOIN user ' + e.message.length);
                // console.log('===== JOIN user ' + e.message);
                var sType;
                if(typeof virtualclass.connectedUsers == 'undefined'){
                    virtualclass.connectedUsers = [];
                }
                // console.log('===== JOIN user member_added call ');
                if(e.hasOwnProperty('user')){
                    var joinUserObj = e.message;
                    virtualclass.jId = joinUserObj.userid;

                    console.log('===== JOIN users ' + virtualclass.jId);


                    var upos = getPosition(virtualclass.connectedUsers, virtualclass.jId);
                    if(upos != -1){
                        virtualclass.connectedUsers.splice(upos, 1);
                    }
                    virtualclass.gObj.allUserObj[virtualclass.jId] = joinUserObj;
                    virtualclass.connectedUsers.push(joinUserObj);

                    // Get the new joinecr user id and object
                    virtualclass.joinUser = joinUserObj;

                }else if(e.hasOwnProperty('users')){

                    virtualclass.jId = e.joinUser;
                    console.log('===== JOIN users ' + virtualclass.jId);

                    virtualclass.connectedUsers = e.message;
                    for(var i = 0; i<virtualclass.connectedUsers.length; i++) {
                        virtualclass.gObj.allUserObj[virtualclass.connectedUsers[i].userid] = virtualclass.connectedUsers[i];
                    }
                    virtualclass.joinUser = this.getJoinUser(virtualclass.connectedUsers, virtualclass.jId);

                }else {
                    console.log('User packet is not receving');
                }

                // set the default value related about video quality, internet latency and frame rate
                if (virtualclass.jId == virtualclass.gObj.uid) {
                    // var speed = roles.hasAdmin() ? 1 :  0;
                    if (typeof virtualclass.videoHost.gObj.MYSPEED == 'undefined') {
                        var speed = 1;
                    } else {
                        var speed = virtualclass.videoHost.gObj.MYSPEED;
                    }
                    virtualclass.videoHost.setDefaultValue(speed);
                    virtualclass.vutil.setDefaultScroll();
                }

                // virtualclass.gObj.mySetTime = virtualclass.vutil.getMySetTime(virtualclass.connectedUsers);
                virtualclass.gObj.mySetTime = 2000;

                // console.log('Member add :- join user id ' + virtualclass.joinUser.userid + ' with ' + virtualclass.joinUser.role);
                if ((virtualclass.vutil.selfJoin(virtualclass.jId) && virtualclass.gObj.veryFirstJoin) && virtualclass.joinUser.role == 't') {
                    if (virtualclass.vutil.isTeacherAlreadyExist(virtualclass.jId)) {
                        virtualclass.gObj.veryFirstJoin = false;
                        overrideOperation('s');
                        console.log('Member add :- Join As Student');
                    } else if (virtualclass.gObj.veryFirstJoin && virtualclass.vutil.isPresenterAlreadyExist(virtualclass.jId)) {
                        //overrideOperation('e');

                        var presenterId = virtualclass.vutil.getPresenterId();
                        if (presenterId) {
                            ioAdapter.sendUser({
                                'cf': 'rpr' // remove presenter role
                            }, presenterId);

                            overrideRoleTeacher();

                        } else {
                            console.log('There some problem on joining as');
                        }

                    } else {

                        /* Clouser is used to retain the joined userid on SetTimeout */
                        (function(jId){
                            setTimeout(function () {
                                joinAsTeacher(jId)
                                var wid = virtualclass.gObj.currWb;
                                if(virtualclass.pdfRender[wid] != null){
                                    virtualclass.pdfRender[wid].sendScroll(); // when user Join as teacher
                                }
                            }, virtualclass.gObj.mySetTime);
                        }(virtualclass.jId));

                    }
                    // If user try to join as Presenter OR Educator
                } else if (((virtualclass.vutil.selfJoin(virtualclass.jId) && virtualclass.gObj.veryFirstJoin))
                    && (virtualclass.joinUser.role == 'p'
                    && (virtualclass.vutil.isPresenterAlreadyExist(virtualclass.jId))
                    || (virtualclass.joinUser.role == 'e' &&
                    (virtualclass.vutil.isEducatorAlreadyExist(virtualclass.jId) || virtualclass.vutil.isOrginalTeacherExist(virtualclass.jId))))) {
                    virtualclass.gObj.veryFirstJoin = false;
                    overrideOperation('s');
                    console.log('Member add :- join as student. Earlier was educator OR teacher');
                } else {
                    // this will be the usual case:-
                    defaultOperation(e, sType);
                    if (isAnyOnePresenter() && virtualclass.vutil.selfJoin(virtualclass.jId) && !virtualclass.vutil.isTeacherAlreadyExist(virtualclass.jId) &&
                        (virtualclass.joinUser.role == 's' || virtualclass.joinUser.role == 'p')) {
                        virtualclass.vutil.createBecomeTeacherWidget();
                    }
                }



                (function (jId){
                    setTimeout(function (){
                        initOverrideRoleTeacher(jId);
                    }, virtualclass.gObj.mySetTime + 200)
                }(virtualclass.jId));


                if (isAnyOnePresenter() && (virtualclass.joinUser.role == 't' || virtualclass.joinUser.role == 'e') && virtualclass.jId != virtualclass.gObj.uid) {
                    virtualclass.vutil.removeBecomeTeacherWidget();

                }
                if (roles.hasControls()) {
                    virtualclass.poll.updateUsersOnPoll();
                }

                if (typeof virtualclass.quiz != 'undefined') {
                    if ((virtualclass.quiz.uniqueUsers.indexOf(virtualclass.jId) < 0)) {
                        virtualclass.quiz.uniqueUsers.push(virtualclass.jId);

                        for (var i in io.uniquesids) {

                            if (virtualclass.quiz.uniqueUsers.indexOf(i) < 0) {
                                virtualclass.quiz.uniqueUsers.push(i);
                            }
                        }
                    }
                }
                if (virtualclass.joinUser.role == 's' && virtualclass.gObj.has_ts_capability){
                    ioAdapter.mustSend({'uid': virtualclass.gObj.uid, ac:true, 'cf': 'tsr'});
                }

                if(virtualclass.gObj.uid != virtualclass.jId && virtualclass.gObj.meetingMode ){
                    virtualclass.multiVideo.onUserJoin(virtualclass.jId);
                }

                if(!roles.hasControls()) {
                    if (e.message[0].role == 't' || ((virtualclass.gObj.uid == virtualclass.jId)&& virtualclass.vutil.whoIsTeacher())) {
                        var vcCont = document.querySelector("#virtualclassCont.congrea");
                        if (!vcCont.classList.contains('tr_available')) {
                            vcCont.classList.add("tr_available");
                        }
                    }
                }
            },

            newmessage : function (e){
                var recMsg = e.message, key;
                if (recMsg.hasOwnProperty('cf')) {
                    if (typeof receiveFunctions[recMsg.cf] == 'function') {
                        receiveFunctions[recMsg.cf](e);
                        return;
                    } else {
                        console.log('CF ' + recMsg.cf + ' is not a function of receiveFunctions');
                    }
                }
            },

            readyto_user_logout : function (msg){
                var e = {};
                for(var uid in msg.action){
                    e = {type : "user_logout", fromUser : uid,  message : 'offline'};
                    virtualclass.ioEventApi.user_logout(e);
                }
            },

            user_logout : function (e){
                console.log('user_logout');
                if (isAnyOnePresenter() && !isTeacherExistWhenRemoveUser(virtualclass.connectedUsers)) {
                    if (virtualclass.gObj.uRole != 't' && virtualclass.gObj.uRole != 'e') {
                        virtualclass.vutil.createBecomeTeacherWidget();
                    }
                }


                if(!roles.hasControls()) {
                    if(!virtualclass.gObj.hasOwnProperty('whoIsTeacher')){
                        virtualclass.gObj.whoIsTeacher = virtualclass.vutil.whoIsTeacher();
                    }
                    // if teacher is log out
                    if (virtualclass.gObj.whoIsTeacher == e.fromUser) {
                        var vcCont = document.querySelector("#virtualclassCont.congrea");
                        if (vcCont && vcCont.classList.contains('tr_available')) {
                            vcCont.classList.remove("tr_available");
                        }
                    }
                }


                //virtualclass.media.video.removeUser(e.fromUser.userid);
                virtualclass.media.video.removeUser(e.fromUser);
                // TODO this should be update accordiing to new user

                if(virtualclass.chat.isTechSupportExist(e.fromUser)){
                    virtualclass.chat.disableTechSupport(e.fromUser);
                }

                if ((e.fromUser.role == 't' || e.fromUser.role == 'e') && (roles.isStudent() || roles.isPresenter())) {
                    localStorage.setItem('oTDisconn', true);
                    disableEditor('editorRich');
                    disableEditor('editorCode');
                }

                var removeUser = e.fromUser;
                delete virtualclass.gObj.allUserObj[removeUser];
                var userPos = getPosition(virtualclass.connectedUsers, removeUser);
                if(userPos !== -1){
                    virtualclass.connectedUsers.splice(userPos, 1);
                }
                var e = {removeUser : removeUser};

                memberUpdateWithDelay(e, 'removed')

                if(virtualclass.gObj.meetingMode){
                    virtualclass.multiVideo.onUserRemove(removeUser);
                }

                /** Update users in user list until total user is more than 500 **/
                if(virtualclass.connectedUsers.length < virtualclass.gObj.userToBeDisplay){
                    virtualclass.gObj.insertUser = true;
                }
            },
            error : function (e){
                if (virtualclass.gObj.displayError) {
                    virtualclass.view.removeElement('serverErrorCont');

                    if (typeof e.message.stack != 'undefined') {
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
            },

            Text_Limit_Exeed : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Text_Limit_Exeed'), 'errorContainer', 'chatWidget', {className : 'Text_Limit_Exeed'});
            },

            Binary_Limit_Exeed : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Binary_Limit_Exeed'), 'errorContainer', 'chatWidget', {className : 'Binary_Limit_Exeed'});
            },

            Unauthenticated : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Unauthenticated'), 'errorContainer', 'chatWidget', {className : 'Unauthenticated'});
                virtualclass.vutil.stopConnection();
            },

            Multiple_login : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Multiple_login'), 'errorContainer', 'chatWidget', {className : 'Multiple_login'});
                virtualclass.vutil.stopConnection();
            },

            Max_rooms : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_rooms'), 'errorContainer', 'chatWidget', {className : 'Max_rooms'});
            },

            Max_users : function (e){
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_users'), 'errorContainer', 'chatWidget', {className : 'Max_users'});
            },

            PONG : function (e){
                virtualclass.network.latency = e.timeStamp - e.message;
                virtualclass.network.initToPing(1000);
            },

            authentication_failed : function (e){
                virtualclass.chat.removeCookieUserInfo(e);
            },

            connectionclose : function (e){
                if (virtualclass.hasOwnProperty('recorder') && virtualclass.recorder.startUpload) {
                    console.log("During the upload process there would not any other popup box.");
                } else {
                    if (virtualclass.recorder.smallData && virtualclass.recorder.hasOwnProperty('rdlength') && virtualclass.recorder.rdlength < 100000) {
                        console.log('Do not show the waiting popupbox if there small chunks of data');
                    } else {
                        virtualclass.popup.waitMsg();
                    }
                }
                virtualclass.chat.makeUserListEmpty();
            },

            connectionopen : function (e){
                virtualclass.gObj.invalidlogin = false;
                var setTimeReady = 6000;
                // There will take more time to connect socket when teacher will
                // Come from become Teacher
                if (virtualclass.gObj.hasOwnProperty('doEndSession')) {
                    console.log('From Become Teacher');
                    setTimeReady = 10000;
                }
                setTimeout(
                    function () {

                        if (!virtualclass.vutil.sesionEndMsgBoxIsExisting() && !virtualclass.gObj.hasOwnProperty('downloadProgress') && !(virtualclass.recorder.startUpload)) {
                            virtualclass.popup.closePopup();
                            virtualclass.vutil.setDefaultScroll();
                            var popupContainer = document.getElementById('popupContainer');
                            if (popupContainer != null) {
                                popupContainer.style.display = 'none';
                            }

                            console.log('Popup box Close All');
                        } else {
                            console.log('Popup box Could not close');
                        }
                    }, setTimeReady // Wait for everything is to be ready

                );
            },
            binrec : function (e){
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
                        if(roles.hasControls()){
                            virtualclass.gObj.studentSSstatus.mesharing = true;
                            var virtualclassCont = document.querySelector('#virtualclassCont');
                            if(virtualclassCont != ''){
                                virtualclassCont.classList.add('studentScreenSharing');
                                /** Remove following statement after fully support of SHADOW DOM **/
                                document.querySelector('#chat_div').classList.add('studentScreenSharing');
                            }
                        }

                        if (!virtualclass.hasOwnProperty('studentScreen')) {
                            virtualclass.studentScreen = new studentScreen();
                        }

                        if(virtualclass.gObj.precheckScrn){
                            virtualclass.vutil.prechkScrnShare();
                        }

                        // The binary data is coming on teacher when user download the session
                        // which actually should not, workaround for now

                        if (!roles.hasControls() || virtualclass.gObj.studentSSstatus.mesharing) {
                            virtualclass.studentScreen.ssProcess(data_pack, e.message, stype, sTool);
                        }

                        if(virtualclass.gObj.studentSSstatus.sharing && roles.isStudent()){
                            var elem = document.getElementById("virtualclassScreenShareLocal");
                            if(virtualclass.gObj.studentSSstatus.shareToAll){
                                if(elem != null){
                                    elem.style.display = 'block';
                                }
                            }else{
                                if(elem != null){
                                    elem.style.display = 'none';
                                }
                            }
                        }

                        break;
                    case 11:  // user video image
                        virtualclass.media.video.process(e.message);
                        break;
                    case 21 : // teacher big video
                        processImage(e.message, data_pack[1]);
                }
            },

            getJoinUser(users, uid) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].userid == uid) {
                        return users[i];
                    }
                }
            }

        };

        virtualclass.ioEventApi = ioEventApi;

        virtualclass.gObj.testChatDiv = document.querySelector('#chat_div');
        virtualclass.gObj.testChatDiv.attachShadow({  mode: 'open' });
    }
});
