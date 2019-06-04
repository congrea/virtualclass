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

        virtualclass.gObj.sessionClear = false;
        virtualclass.settings = window.settings;
        virtualclass.settings.init();
        virtualclass.handleCurrentUserWithPrevious();
        virtualclass.ioEventApi = ioEventApi;

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

        function triggerInitShareScreen (sType, setTime){
            if (typeof virtualclass.getDataFullScreen == 'function') {
                virtualclass.ss.initShareScreen(sType, setTime);
            }
        }

        virtualclass.gObj.veryFirstJoin = true;

        function getUserObj (arr, uid){
            var index = arr.findIndex(function(o){
                if(o.userid === uid){
                    return o;
                }
            });
        }

        var overrideRoleTeacher = function () {
            console.log('Member add:- End session override teacher');
            virtualclass.storage.config.endSession();
            localStorage.setItem('uRole', 't');
            delete virtualclass.gObj['doEndSession'];
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

        virtualclass.gObj.testChatDiv = document.querySelector('#chat_div');
        virtualclass.gObj.testChatDiv.attachShadow({  mode: 'open' });
    }
});
