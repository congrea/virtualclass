/** To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*  * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(window) {
    "use strict";
    var vutil = {
        createDOM: function(tag, id, _class) {
            var elem = document.createElement(tag);
            if (typeof id != 'undefined') {
                elem.id = id;
            }

            if (typeof _class != 'undefined') {
                var classes = "";
                if (_class.length > 0) {
                    for (var i = 0; i < _class.length; i++) {
                        classes += _class[i] + " ";
                    }
                }

                elem.className = classes;
            }

            return elem;
        },
        ab2str: function(buf) {
            return String.fromCharCode.apply(null, new Uint8ClampedArray(buf));
        },
        str2ab: function(str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8ClampedArray(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        },
        sidebarHeightInit: function() {
            var sidebar = document.getElementById("widgetRightSide");
            sidebar.style.height = (window.innerHeight) + "px";
        },
        //there function name should be change
        isSystemCompatible: function() {
            if (virtualclass.error.length > 0) {

                var errorMsg = (virtualclass.error.length > 1) ? (virtualclass.error.join("<br />")) : virtualclass.error[0];
                virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'chatWidget');

                if (virtualclass.gObj.hasOwnProperty('errIE')) {
                    virtualclass.vutil.disableVirtualClass();
                }

                if (virtualclass.gObj.hasOwnProperty('audIntDisable')) {
                    virtualclass.user.control.mediaWidgetDisable();
                }

                if (virtualclass.gObj.hasOwnProperty('errNotDesktop')) {
                    virtualclass.user.control.mediaWidgetDisable();
                    virtualclass.vutil.disableVirtualClass();
                }
            } else {
                if (virtualclass.gObj.hasOwnProperty('audIntDisable') || virtualclass.gObj.hasOwnProperty('vidIntDisable')) {
                    virtualclass.user.control.mediaWidgetDisable();
                }
            }
        },
        chkValueInLocalStorage: function(property) {
            if (localStorage.getItem(property) === null) {
                return false;
            } else {
                return localStorage[property];
            }
        },

        //TODO very critical and important for remove return
        /** Handle container dimension 1**/
        setContainerWidth : function(res, app) {
            return;
            if(app != null){
                var appId = 'virtualclass' + app;
            } else {
                var appId = 'virtualclassWhiteboard';
            }

            if (typeof virtualclass.previous != 'undefined') {

                if ('virtualclass' + app != virtualclass.previous) {
                    appId = 'virtualclass' + app;
                } else {
                    appId = virtualclass.previous;
                }
                //  appId = virtualclass.previous;
            }

            var appName = appId.split('virtualclass')[1];

            appId = 'virtualclass' + virtualclass.vutil.capitalizeFirstLetter(appName);

            var appCont = document.getElementById(appId);

            if(appCont != null){
                var rightOffSet, leftSideBarWidth, reduceHeight;

                var leftSideBar = document.getElementById("virtualclassOptionsCont");
                if (leftSideBar != null) {
                    var offset = virtualclass.vutil.getElementOffset(leftSideBar);
                    leftSideBarWidth = (leftSideBar.offsetWidth + offset.x) + 4;

                } else {
                    leftSideBarWidth = roles.hasControls() ? 60 : 5;
                }

                if (virtualclass.isPlayMode) {
                    reduceHeight += 75;
                }else {
                    if (app == 'SharePresentation') {
                        reduceHeight = (document.querySelector('#virtualclass' + app + '.pptSharing') != null) ? 80 : 28;
                    }else if(app == 'Video' || app == 'Yts'){
                        reduceHeight = 28;
                    }else if (app == 'EditorRich' || app == 'Poll' ||  app == 'Quiz'){
                        reduceHeight = 50;
                    }else {
                        reduceHeight = 60;
                    }
                }

                var containerHeight = document.getElementById('commandToolsWrapper');


                //console.log( ' leftSideBarWidth=' + leftSideBarWidth);
                var extraWidth = 20;
                if(virtualclass.currApp == 'Whiteboard' ||   virtualclass.currApp == 'DocumentShare' || virtualclass.currApp == 'SharePresentation'){
                    extraWidth = 20;
                }
                res.width = (extraWidth + res.width) - leftSideBarWidth;

                appCont.style.width = res.width + 'px';
                appCont.style.height = (res.height - reduceHeight) + 'px';

                if (appId == 'virtualclassScreenShare') {
                    //if(appId != 'virtualclassWhiteboard'){
                    var ssType = document.getElementById(appId + 'Local');
                    res.width = res.width - 10;
                    appCont.style.width = res.width;
                    ssType.style.width = res.width + "px";
                    virtualclass.vutil.setScreenInnerTagsWidth(appId);
                }else if(appId == 'virtualclassDocumentShare'){
                    var wb = virtualclass.gObj.currWb;
                    if(wb != null){
                        // This dimension is setting when window is being resized
                        var canWrapper = document.querySelector('#canvasWrapper' +wb);
                        canWrapper.style.width = res.width + "px";
                        //canvas wrapper height 2
                        canWrapper.style.height = (res.height-virtualclass.gObj.screenRh) + "px";

                        console.log('Canvas wrapper height ' + canWrapper.style.height);
                        // virtualclass.system.setAppDimension(wb, true);
                    }
                }

                console.log('Container width ' + appId + ' ' + res.width);
            }else {
                console.log(appCont + ' is not found ');
            }
        },
        
        setScreenInnerTagsWidth: function(currAppId) {
            var sId = currAppId;
            var screenShare = document.getElementById(sId);
            var screenShareWidth = screenShare.offsetWidth;
            var screenShareLocal = document.getElementById(sId + "Local");
            var screenShareLocalWidth = screenShareLocal.offsetWidth;
            var toBeLeft = screenShareWidth - screenShareLocalWidth;
            var screenShareLocalVideo = document.getElementById(sId + "LocalVideo");
            var screenShareLocalVideoWidth = screenShareLocalVideo.offsetWidth;
            screenShareLocalVideoWidth = screenShareLocalWidth - screenShareLocalVideoWidth;
        },

        makeActiveApp: function (app, prvTool) {
            if (app != prvTool && typeof prvTool != 'undefined') {
                prvTool = prvTool + 'Tool';
                //document.getElementById(prvTool).className = virtualclass.wb[virtualclass.gObj.currWb].utility.removeClassFromElement(prvTool, 'active');
                document.getElementById(prvTool).className = virtualclass.vutil.removeClassFromElement(prvTool, 'active');
            } else {

                // If there is remaining any active class on tool
                var appOptions = document.getElementsByClassName('appOptions');
                for(var i=0; i<appOptions.length; i++){
                    if(appOptions[i].classList.contains('active')){
                        appOptions[i].classList.remove('active');
                    }
                }
                // console.log('Whiteboard Tool class:- is ' + prvTool + ' with app ' + app);
            }
            document.getElementById(app + "Tool").className += ' active';
        },
        initInstallChromeExt: function(error) {
            if (error.name == 'EXTENSION_UNAVAILABLE') {
                console.log('ask for inline installation');
                this._inlineChomeExtensionStore();
            }
        },

        _inlineChomeExtensionStore : function (){
            //alert('ss' + chrome);
            chrome.webstore.install('https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl',
                function(arg) {
                    window.location.reload();
                },
                function(e) {
                    alert(e);
                }
            )
        },

        removeAppPanel: function() {
            var appPanel = document.getElementById('virtualclassOptionsCont');
            if (appPanel != null) {
                appPanel.parentNode.removeChild(appPanel);
            }
        },
        removeTempVideo: function(id) {
            var toBeRemove = document.getElementById(id);
            toBeRemove.parentNode.removeChild(toBeRemove)
        },
        createLocalTempVideo: function(mainCont, localTemp) {
            if (typeof mainCont == "string" || typeof mainCont == "String") {
                mainCont = document.getElementById(mainCont);
            }
            //var mainCont = document.getElementById(mcId);
            var locVidContTemp = virtualclass.vutil.createDOM("div", localTemp);
            var vidContTemp = virtualclass.vutil.createDOM("canvas", localTemp + "Video");
            locVidContTemp.appendChild(vidContTemp);
            mainCont.appendChild(locVidContTemp);
        },
        initLocCanvasCont: function(tempVideoId) {
            var app;
            if (virtualclass.currApp == "ScreenShare") {
                app = 'ss';
            } else {
                app = 'wss';
            }

            virtualclass[app].localtempCanvas = document.getElementById(tempVideoId);
            console.log(virtualclass[app].localtempCanvas);
            virtualclass[app].localtempCont = virtualclass[app].localtempCanvas.getContext('2d');
        },

        videoTeacher2Student: function (sid, notPutImage) {

            var app = sid;
            var id = "virtualclass" + sid + "LocalVideo";

            var localVideo = document.getElementById(id);

            if (localVideo != null && localVideo.tagName == "VIDEO") {
                //    alert('this would not performed');
                var stCanvas = document.createElement('canvas');
                stCanvas.id = localVideo.id;
                stCanvas.width = localVideo.offsetWidth;
                stCanvas.height = localVideo.offsetHeight;

                var tempVid = localVideo;
                localVideo.parentNode.replaceChild(stCanvas, localVideo);
                if (app == 'ScreenShare') {
                    app = "ss";
                }

                if (typeof notPutImage == 'undefined' && (typeof app != 'undefined' && (app == 'ss' || app == 'wss'))) {
                    virtualclass[app].localCanvas = stCanvas;
                    virtualclass[app].localCont = virtualclass[app].localCanvas.getContext('2d');

                    var imgData = virtualclass[app].localtempCont.getImageData(0, 0, virtualclass[app].localtempCanvas.width, virtualclass[app].localtempCanvas.height);
                    virtualclass[app].localCont.putImageData(imgData, 0, 0);
                }
                virtualclass.vutil.removeTempVideo("virtualclass" + sid + "LocalTemp");
            }
        },
        clickOutSideCanvas: function() {
            if (this.exitTextWrapper()) {
                virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.textUtility(virtualclass.wb[virtualclass.gObj.currWb].gObj.spx, virtualclass.wb[virtualclass.gObj.currWb].gObj.spy);
            }
        },
        exitTextWrapper: function() {
            var textBoxContainer = document.getElementsByClassName('textBoxContainer');
            return textBoxContainer.length > 0;
        },
        attachClickOutSideCanvas: function() {
            _attachClickOutSideCanvas('commandToolsWrapper');
            _attachClickOutSideCanvas('virtualclassOptionsCont');
            _attachClickOutSideCanvas('audioWidget');
            _attachClickOutSideCanvas('chatWidget');

            function _attachClickOutSideCanvas(id) {
                var elem = document.getElementById(id);
                if (elem != null) {

                    elem.onclick = function () {
                        if(roles.hasControls()){
                            virtualclass.vutil.clickOutSideCanvas();
                        }
                    };
                }
            }
        },
        dimensionMatch: function(wbc, ssc) {
            var wbcWidth = document.getElementById(wbc).offsetWidth;
            var optionsContWidth = document.getElementById("virtualclassOptionsCont").offsetWidth;
            var sscElem = document.getElementById(ssc);
            if(sscElem != null){
                var sscWidth = sscElem.offsetWidth + optionsContWidth;
                return (sscWidth == wbcWidth);
            }
            return false;
        },
        disableAppsBar: function() {
            var appBarCont = document.getElementById('virtualclassOptionsCont');
            if (appBarCont != null) {
                appBarCont.style.pointerEvents = "none";
            }
        },
        isMiniFileIncluded: function(src) {
//                var filePatt = new RegExp(src+".js$");
            var filePatt = new RegExp(src + ".js?=\*([0-9]*)"); //matched when src is mid of path, todo find it at end of path
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (filePatt.test(scripts[i].src)) {
                    return true;
                }
            }
            return false;
        },
        clearAllChat: function() {
            localStorage.removeItem(virtualclass.gObj.uid); //remove chat about user
            localStorage.clear('chatroom'); //all
            if(virtualclass.chat != null){
                virtualclass.chat.idList.length = 0;
            }

            clearAllChatBox();

            var allChat = document.getElementById("chatWidget").getElementsByClassName('ui-chatbox-msg');
            if (allChat.length > 0) {
                while (allChat[0] != null) {
                    allChat[0].parentNode.removeChild(allChat[0]);
                }
            }
        },
        isObjectEmpty: function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },
        removeSessionTool: function() {
            if (!roles.hasAdmin()) {
                var SessionEndTool = document.getElementById("virtualclassSessionEndTool");
                if (SessionEndTool != null) {
                    SessionEndTool.parentNode.removeChild(SessionEndTool);
                }
            }
        },
         
        Fullscreen: function() {
            var elem = document.getElementById("virtualclassCont");
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
            elem.classList.add("fullScreenMode");
        },

        closeFullscreen: function () {
            var elem = document.getElementById("virtualclassCont");
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
            elem.classList.remove("fullScreenMode");
          },
        
        // TODO
        /***
         * Add class at body according to role
         */

        addClass: function (elemId, className) {
            var elem = document.getElementById(elemId);
            if (virtualclass.vutil.elemHasAnyClass(elemId)) {
                elem.classList.add(className);
            } else {
                elem.className = className;
            }
        },
        removeClass: function(id, className) {
            var elem = document.getElementById(id);

            if (virtualclass.vutil.elemHasAnyClass(id) && elem.classList.contains(className)) {
                elem.classList.remove(className);
            }
        },
        breakIntoBytes: function(val, l) {
            var numstring = val.toString();
            for (var i = numstring.length; i < l; i++) {
                numstring = '0' + numstring;
            }
            return numstring.match(/[\S]{1,2}/g) || [];
        },
        numValidateFour: function(n1, n2, n3, n4) {
            n1 = this.preNumValidateTwo(n1);
            n2 = this.preNumValidateTwo(n2);
            n3 = this.preNumValidateTwo(n3);
            n4 = this.preNumValidateTwo(n4);
            var nres = n1 + n2 + n3 + n4;
            return parseInt(nres);
        },
        numValidateTwo: function(n1, n2) {
            n1 = this.preNumValidateTwo(n1);
            n2 = this.preNumValidateTwo(n2);
            var nres = n1 + n2;
            return parseInt(nres);
        },
        preNumValidateTwo: function(n) {
            var numstring = n.toString();
            if (numstring.length == 1) {
                return '0' + numstring;
            } else if (numstring.length == 2) {
                return numstring;
            }
        },
        elemHasAnyClass: function(elemId) {
            var elem = document.getElementById(elemId);
            if (elem != null) {
                return (typeof elem.classList != 'undefined');
            }
            return false;
        },
        userIsOrginalTeacher: function(userId) {
            return roles.hasAdmin();
        },
        isUserTeacher: function(userId) {
            return roles.hasControls();
        },
        initDisableAudVid: function() {
            virtualclass.gObj.audIntDisable = true;
            virtualclass.gObj.vidIntDisable = true;
        },
        initDisableVirtualClass: function() {
            this.initDisableAudVid();
            virtualclass.gObj.errNotDesktop = true;
            virtualclass.gObj.errNotScreenShare = true;
            virtualclass.gObj.errAppBar = true;
        },
        disableVirtualClass: function() {

            var virtualClass = document.getElementById('virtualclassCont');
            virtualClass.style.opacity = 0.6;
            virtualClass.style.pointerEvents = "none";
        },
        enableVirtualClass: function() {
            var virtualClass = document.getElementById('virtualclassCont');
            virtualClass.style.opacity = 1;
            virtualClass.style.pointerEvents = "visible";

        },
        firstiOSaudioCall: function() {
            if (virtualclass.gObj.hasOwnProperty('audioPlayMessage')) {
                //virtualclass.gObj.iosTabAudTrue = true;
                virtualclass.gObj.iosIpadbAudTrue = true;
                virtualclass.media.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
            }
        },

        beforeLoad: function () {
            if(virtualclass.currApp == 'DocumentShare'){
                if(!roles.hasControls()){
                    var rhElem = document.querySelector("#virtualclassCont.congrea #icHr");
                    var action = rhElem.getAttribute("data-action");
                    if(action == "disable"){
                        var toUser = virtualclass.vutil.whoIsTeacher();
                        ioAdapter.sendUser({
                            'data': {
                                user: wbUser.id,
                                action:action
                            },
                            'cf': 'raiseHand'
                        }, toUser);
                    }
                }
                io.disconnect();
            }

            // console.log("whiteboard --=-=-=- DISCONNECT IO");
            virtualclass.gObj.windowLoading = true;
            // If user does page refresh after session saved and does not start new session  by clicking on element
            // Then we need to clear the session on page refresh
            if(virtualclass.recorder.hasOwnProperty('doSessionClear')){
                virtualclass.clearSession();
                return;
            }
            // When user does clear history by browser feature, some data are storing
            // in that case we are not saving the data by clearing all storage data.

            if(localStorage.length == 0){
                virtualclass.storage.clearStorageData();
                return;
            }
            console.log('screen-detail init');

            //   localStorage.setItem('totalStored', virtualclass.storage.totalStored);
            localStorage.setItem('executedSerial', JSON.stringify(ioMissingPackets.executedSerial));
            localStorage.setItem('executedUserSerial', JSON.stringify(ioMissingPackets.executedUserSerial));
            if(typeof virtualclass.gObj.audioEnable != 'undefined' ){
                localStorage.setItem('audEnable', JSON.stringify({'ac' : virtualclass.gObj.audioEnable}));
            }

            localStorage.removeItem('otherRole');

            //critical, this can be critical

            if (!virtualclass.gObj.hasOwnProperty('audIntDisable')) {
                virtualclass.media.audio.studentNotSpeak();
            }

            virtualclass.vutil.clickOutSideCanvas();
            localStorage.setItem(wbUser.sid, JSON.stringify(virtualclass.chat.vmstorage));

            if (virtualclass.hasOwnProperty('editorRich')) {
                if (typeof virtualclass.editorRich.vcAdapter == 'object') {
                    virtualclass.editorRich.saveIntoLocalStorage();
                }
            }

            if (virtualclass.hasOwnProperty('editorCode')) {
                if (typeof virtualclass.editorCode.vcAdapter == 'object') {
                    virtualclass.editorCode.saveIntoLocalStorage();
                }
            }

            var prvAppObj = {name: virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp)};
            console.log(virtualclass.currApp);
            if (virtualclass.currApp == 'ScreenShare') {
                prvAppObj.name = virtualclass.gObj.defaultApp; //not saving screen share but show Editor Rich default window
                var teacherId = virtualclass.vutil.whoIsTeacher();
                if(virtualclass.gObj.studentSSstatus.mesharing){
                    ioAdapter.mustSendUser({'cf' : 'rmStdScreen'}, teacherId);
                }else if(roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing){
                    virtualclass.vutil.beforeSend({'unshareScreen': true, st: 'ss', 'cf': 'unshareScreen'});
                }

                if((roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing) || roles.hasControls()){
                    console.log('screen-detail is saving into storage');
                    localStorage.setItem('studentSSstatus', JSON.stringify(virtualclass.gObj.studentSSstatus));
                }

            } else if ((virtualclass.currApp == 'Yts')) {
                if (typeof virtualclass.yts.videoId != 'undefined' && typeof virtualclass.yts.player == 'object') {
                    prvAppObj.metaData = {
                        'init': virtualclass.yts.videoId,
                        startFrom: virtualclass.yts.player.getCurrentTime()
                    };
                }
            } else if ((virtualclass.currApp == 'SharePresentation')) {

                //virtualclass.sharePt.saveIntoLocalStorage();
                if (typeof virtualclass.sharePt != 'undefined' && typeof virtualclass.sharePt == 'object' && virtualclass.sharePt.pptUrl) {

                    console.log("beforeloadS" + virtualclass.sharePt.pptUrl);
                    prvAppObj.metaData = {
                        'init': virtualclass.sharePt.pptUrl,
                        startFrom: virtualclass.sharePt.state,
                        currId:virtualclass.sharePt.currId
                    };
                    console.log("start From"+virtualclass.sharePt.state);
                    virtualclass.sharePt.saveIntoLocalStorage(prvAppObj);
                } else {
                    prvAppObj.metaData = null; // if video is not started to share.
                }
            }else if(virtualclass.currApp=="Poll"){
                virtualclass.poll.saveInLocalStorage();
                console.log("currAppPoll");
            }else if(virtualclass.currApp=="Video"){
                    if(virtualclass.videoUl.player){
                        var start=virtualclass.videoUl.player.currentTime();
                    }

                    prvAppObj.metaData = {
                        'init': {
                            videoId:virtualclass.videoUl.videoId,
                            videoUrl:virtualclass.videoUl.videoUrl,
                            yts:virtualclass.videoUl.yts,
                            online:virtualclass.videoUl.online,
                            isPaused:virtualclass.videoUl.isPaused
                        },
                        startFrom: start,
                        isAutoplay:virtualclass.videoUl.autoPlayFlag

                    };

                    console.log(prvAppObj);
                        //nirmala
                  //  virtualclass.videoUl.saveVideosInLocalStr();

              //  }

            } else if(virtualclass.currApp == 'DocumentShare'){
                console.log('previous app success ' + virtualclass.currApp);
                if(virtualclass.dts.docs.hasOwnProperty('currDoc')){
                    var currDoc = virtualclass.dts.docs.currDoc;
                    console.log('currentDocument ' + currDoc);
                    // console.dir('currDoc ' + virtualclass.dts.docs[virtualclass.dts.docs.currDoc]);
                    //  var slideNumber = virtualclass.dts.docs.note.currNote;

                    if(virtualclass.dts.order.length > 0){
                        prvAppObj.metaData = {
                            'init': currDoc,
                            slideNumber : virtualclass.dts.docs.note.currNote,
                            order : JSON.stringify(virtualclass.dts.order)
                        };
                    }else {
                        var currDoc = 'layout';
                        prvAppObj.metaData = {
                            'init': currDoc,
                            slideNumber : null
                        };
                    }
                }else {
                    var currDoc = 'layout';
                    prvAppObj.metaData = {
                        'init': currDoc,
                        slideNumber : null
                    };
                }
                if(Object.keys(virtualclass.dts.pages).length > 0){
                    prvAppObj.metaData.docs = virtualclass.dts.pages;
                }

            } else if (virtualclass.currApp == "Quiz") {
                virtualclass.quiz.saveInLocalStorage();
                console.log("quiz data saved");
            }else if(virtualclass.currApp == "Whiteboard"){
                // var prvAppObj = {"name": "Whiteboard", "wbn": virtualclass.gObj.wbCount, "wbcs"  : virtualclass.gObj.currSlide};
                var prvAppObj = {"name": "Whiteboard", "wbn": virtualclass.gObj.wbCount};
            }

            localStorage.setItem('wIds', JSON.stringify(virtualclass.gObj.wIds));
            localStorage.setItem('wbOrder', JSON.stringify(virtualclass.wbCommon.order));

            if(virtualclass.zoom.canvasScale != null){
                var canvasScale = (+virtualclass.zoom.canvasScale);
                console.log('Canvas pdf scale ' + canvasScale);
                if(virtualclass.vutil.isNumeric(canvasScale)){
                 //   localStorage.setItem('wbcScale', canvasScale);
                }
                if(virtualclass.zoom.hasOwnProperty('canvasDimension')){
                    localStorage.setItem('canvasDimension', JSON.stringify(virtualclass.zoom.canvasDimension)); 
                }
            }

            // not storing the YouTube status on student's storage
            // Not showing the youtube video is at student if current app is not youtube
            if (roles.hasView()) {
                if (virtualclass.currApp == 'Yts') {
                    var prvAppObj = {"name": "Yts", "metaData": null};
                }
            }

            /**
             * This object is storing for retain the data
             * while user refresh the page at other App(eg:- video)
             * rather than document sharing
             */

            if(virtualclass.hasOwnProperty('dts') && virtualclass.dts != null){
                virtualclass.dts.upateInStorage();
            }

            localStorage.setItem('currSlide', virtualclass.gObj.currSlide);
            localStorage.setItem('currIndex', virtualclass.gObj.currIndex);

            if(!roles.hasControls()){
                var elem =  document.querySelector("#virtualclassCont.congrea #congHr.disable");
                if(elem){
                    elem.click();
                }
            }

            console.dir('Previous object ' + prvAppObj);

            localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
            // TODO this should be enable and should test proper way
            // localStorage.setItem('uRole', virtualclass.gObj.uRole);

            if(roles.hasControls()){
                localStorage.setItem('videoSwitch',virtualclass.videoHost.gObj.videoSwitch );
            }else{
                localStorage.setItem('stdVideoSwitch',virtualclass.videoHost.gObj.stdStopSmallVid);
                localStorage.setItem('allStdVideoOff',  virtualclass.videoHost.gObj.allStdVideoOff);

            }
            localStorage.setItem('chatWindow',virtualclass.chat.chatWindow);
            this.saveWbOrder();
            if(virtualclass.currApp != 'DocumentShare'){
                io.disconnect();
            }
        },

        initOnBeforeUnload: function(bname) {
            //debugger;
            if (bname == 'iOS') {
                document.body.onunload = function() {
                    virtualclass.vutil.beforeLoad();
                }
            } else {
                window.onbeforeunload = function() {
                    var editor = virtualclass.vutil.smallizeFirstLetter(virtualclass.currApp);
                    virtualclass.vutil.beforeLoad();

                    if (editor == 'editorRich' || editor == 'editorCode') {
                        var edState = virtualclass[editor].cmClient.state;
                        // We with till editor is in Sync.
                        // edState is an instance of constructor, to get the name of it
                        if (edState.constructor.name != 'Synchronized') {
                            return virtualclass.lang.getString('editorinsync');
                        }
                    }
                }
            }
        },
        isPlayMode: function() {
            return (window.wbUser.virtualclassPlay == true);
        },
        progressBar: function(totalVal, portion, pbar, pval) {
            if (portion > totalVal) {
                portion = totalVal;
                document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('playsessionmsg');
            }
            var totalProgress;
            if (totalVal == 0 && portion == 0) {
                totalProgress = 0;
            } else {
                totalProgress = Math.round((portion * 100) / totalVal);
            }

            document.getElementById(pbar).style.width = totalProgress + '%';
            document.getElementById(pval).innerHTML = totalProgress + '%';

        },
        hidePrevIcon: function(app) {
            //debugger;
            var prvScreen = document.getElementById(virtualclass.previous);
            if (prvScreen != null) {
                prvScreen.style.display = 'none';

                console.log('Hide previous screen with display new '  + app);
                if(app == 'ss'){
                    if(typeof virtualclass[app] == 'object'){
                        document.getElementById(virtualclass[app].id).style.display = 'block';
                    }
                }else {

                    document.getElementById(virtualclass[app].id).style.display = 'block';
                }
            }
        },
        /**
         * Return the value of provided key of particular user from prvovided user list
         * @param users user list
         * @param key kew of which return value
         * @param userId the user
         */
        getUserInfo: function(key, userId, users) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].userid == userId) {
                    return users[i][key];
                }
            }
        },

        /** TODO this function should be merged with above function **/
        getUserAllInfo: function(userId, users) {
           if(typeof userId != 'undefined' && typeof users != 'undefined'){
               for (var i = 0; i < users.length; i++) {
                   if (users[i].userid == userId) {
                       return users[i];
                   }
               }
               return false;
           }else  {
               console.log('Error user is not found' );
               return false;
           }
        },

        smallizeFirstLetter: function(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        },
        capitalizeFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        initDefaultInfo: function(role, appIs) {
            //debugger;
            if (role == 't' && appIs == 'Whiteboard') {
                if (!roles.hasAdmin()) {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.setOrginalTeacherContent();
                    var commandWrapperId = commandToolsWrapper + virtualclass.gObj.currWb;
                    virtualclass.wb[virtualclass.gObj.currWb].attachToolFunction(commandWrapperId, true);
                }
            } else if (role == 's') {
                // TODO this should be removed
                virtualclass.gObj.studentId = wbUser.id;

                if (!roles.hasControls()) {

                    // If student became teacher has educator role at localStorage then
                    // the user would not join as student but teacher
                    var uRole = localStorage.getItem('uRole');
                    if(uRole != null && uRole == 'e'){
                        role = 'e';
                    }

                    localStorage.setItem('uRole', role);
                }
                virtualclass.vutil.removeSessionTool();
            }

            if (!virtualclass.gObj.hasOwnProperty('audIntDisable') && !virtualclass.gObj.hasOwnProperty('vidIntDisable')) {
                setTimeout(
                    function (){
                        virtualclass.media.init();
                        virtualclass.media.isInitiator = true;
                    },500 // Let be ready every thing
                );
            }

            // vcan.oneExecuted = false;
            virtualclass.gObj.oneExecuted = false;
        },
        /**
         * Remove the given class name from givven element
         * @param prvTool
         * @param className
         * @returns {string}
         */
        removeClassFromElement: function(prvTool, className) {
            if (prvTool != "t_reclaim") {
                var prvToolElem = document.getElementById(prvTool);
                if (prvToolElem.classList.length > 0) { // If class list available only
                    prvToolElem.classList.remove(className);
                    return prvToolElem.className;
                } else {
                    console.log('Whiteboard Tool class:- could not remove ' + className);
                }
            }
        },
        /**
         * the operation before send message to server
         * @param {type} msg
         * @returns {undefined}
         */
        beforeSend: function(msg, toUser, notMust) {
            var wbId = virtualclass.gObj.currWb;
            ////debugger;
            // when we are in replay mode we don't need send the object to other user
            if (msg.hasOwnProperty('createArrow')) {
                var jobj = JSON.stringify(msg);
                virtualclass.wb[wbId].vcan.optimize.sendPacketWithOptimization(jobj, 300);
            } else {
                if (msg.hasOwnProperty('repObj')) { // For Whiteboard
                    if (typeof (msg.repObj[msg.repObj.length - 1]) == 'undefined') {
                        return;
                    }
                    virtualclass.wb[wbId].gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;
                    virtualclass.wb[wbId].gObj.displayedObjId = virtualclass.wb[wbId].gObj.rcvdPackId;
        //            console.log('Last send data ' + virtualclass.wb[wbId].gObj.rcvdPackId);
                }

                var jobj = JSON.stringify(msg);

                if (typeof notMust != 'undefined' && notMust === true) {
                    if (typeof toUser == 'undefined' || toUser === false || toUser === null) {
                        ioAdapter.send(msg);
                    } else {
                        ioAdapter.sendUser(msg, toUser);
                    }
                } else {
                    if (typeof toUser == 'undefined' || toUser === false || toUser === null) {
                        ioAdapter.mustSend(msg);
                    } else {
                        ioAdapter.mustSendUser(msg, toUser);
                    }
                }

            }
        },
        breakintobytes: function(val, l) {
            var numstring = val.toString();
            for (var i = numstring.length; i < l; i++) {
                numstring = '0' + numstring;
            }
            var parts = numstring.match(/[\S]{1,2}/g) || [];
            return parts;
        },

        createReclaimButton: function (cmdToolsWrapper) {
            this.createDiv('t_reclaim', 'educator', cmdToolsWrapper);
            var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
            var that = this;
            aTags[0].addEventListener('click', function() {
                that._reclaimRole();
            });
        },
        /**
         * this function does create the div
         * toolId expect id for command
         * text expects the text used for particular command
         * this whole output process should come by
         * html not javascript
         */
        createDiv: function(toolId, text, cmdToolsWrapper, cmdClass) {

            //console.log('class name ' + text);
            var toolName = text;
            var text = virtualclass.lang.getString(text);
            var ancTag = document.createElement('a');
            ancTag.href = '#';

            var lDiv = document.createElement('div');
            lDiv.id = toolId;
            if (typeof cmdClass != 'undefined') {
                lDiv.className = cmdClass;
            }

            lDiv.dataset.tool = toolName;

            var iconButton = document.createElement('span');
            iconButton.className = "icon-" + toolName;
            ancTag.appendChild(iconButton);
            ancTag.dataset.title = text;
            ancTag.className = 'tooltip';

            lDiv.appendChild(ancTag);
            if (toolId == 't_reclaim') {

                //var virtualclassCont = document.getElementById(virtualclass.html.id);

                var virtualclassCont = document.getElementById('virtualclassAppLeftPanel');

                cmdToolsWrapper.appendChild(lDiv);
                virtualclassCont.insertBefore(cmdToolsWrapper, virtualclassCont.firstChild);
            } else {
                cmdToolsWrapper.appendChild(lDiv);
            }
        },
        assignRole: function(studentId) {
            if (typeof virtualclass.wb == 'object') {
                var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                virtualclass.wb[virtualclass.gObj.currWb].tool = "";

                if (vcan.main.action == 'move') {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.deActiveFrmDragDrop();
                }
            }

            if (typeof studentId != 'undefined') {
                if (roles.isEducator()) {
                    // var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                    var commandToolsWrapperId = 'commandToolsWrapper_doc_0_0';
                    var cmdToolsWrapper = document.getElementById(commandToolsWrapperId);
                    // var cmdToolsWrapper = 'commandToolsWrapper_doc_0_0';
                    cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                    virtualclass.vutil.removeClass('virtualclassCont', 'educator');
                } else {
                    virtualclass.vutil.addClass('virtualclassCont', 'presenter')

                }

                virtualclass.gObj.uRole = (!roles.hasAdmin()) ? 'p' : 't';

                localStorage.setItem('uRole', virtualclass.gObj.uRole); // Role problem

                virtualclass.user.assignRole(virtualclass.gObj.uRole, virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp), studentId);

                if (typeof virtualclass.wb == 'object') {
                    vcan.utility.canvasCalcOffset(vcan.main.canid);
                }

                if (virtualclass.currApp == 'Yts') {

                    var virtualclassYts = document.getElementById('virtualclassYts');
                    if (virtualclassYts != null) {
                        if (document.getElementById('player') == null) {
                            virtualclass.yts.UI.createPlayerTag(virtualclassYts);
                        }
                    } else {
                        virtualclass.yts.UI.container();
                    }

                    virtualclass.yts.UI.inputURL();
                    if (typeof virtualclass.yts.player == 'object') {
                        virtualclass.yts.seekChangeInterval();
                    } else {
                        console.log('Player object is not ready');
                    }
                } else if (virtualclass.currApp == 'SharePresentation') {

                    var virtualclassppt = document.getElementById('virtualclassSharePresentation');
                    if (virtualclassppt != null) {

                        if (document.getElementById('iframecontainer') == null) {
                            virtualclass.sharePt.UI.createIframe();
                        }
                    } else {
                        virtualclass.sharePt.UI.container();
                    }

                    if (roles.hasControls()) {
                        virtualclass.sharePt.initTeacherLayout();

                    }

                    if (roles.hasView()) {
                        virtualclass.sharePt.eventsObj = [];
                    }

                    virtualclass.sharePt.attachEvent("submitpurl", "click", virtualclass.sharePt.initNewPpt);
                    virtualclass.sharePt.attachMessageEvent("message", virtualclass.sharePt.pptMessageEventHandler);
                }

            } else {
                if (virtualclass.currApp == 'Yts') {
                    virtualclass.yts.UI.removeinputURL();
                    if (virtualclass.yts.hasOwnProperty('tsc')) {
                        clearInterval(virtualclass.yts.tsc);
                    }
                }

                if (virtualclass.currApp == 'SharePresentation') {

                    if (roles.hasControls()) {
                        virtualclass.sharePt.initStudentLayout();
                    }

                    if (roles.hasView()) {
                        virtualclass.sharePt.eventsObj = [];
                        virtualclass.sharePt.hideElement('pptMessageLayout');
                        virtualclass.sharePt.UI.createUrlContainer();
                        virtualclass.sharePt.displayElement('urlcontainer');
                    }

                    virtualclass.sharePt.attachEvent("submitpurl", "click", virtualclass.sharePt.initNewPpt);
                    virtualclass.sharePt.attachMessageEvent("message", virtualclass.sharePt.pptMessageEventHandler);
                }

                virtualclass.gObj.uRole = (!roles.hasAdmin()) ? 's' : 'e';
                var commandToolsWrapperId = 'commandToolsWrapper_doc_0_0';
                // var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                var cmdToolsWrapper = document.getElementById(commandToolsWrapperId);

                if (cmdToolsWrapper != null) {
                    while (cmdToolsWrapper.hasChildNodes()) {
                        cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
                    }
                } else {
                    var cmdToolsWrapper = virtualclass.vutil.createRoleWrapper(); // incase of assign role without clicking whiteboard
                }

                if (typeof virtualclass.wb == 'object') {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
                }

                if (roles.hasAdmin()) {
                    var virtualclassCont = document.getElementById('virtualclassCont');
                    virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                    virtualclass.vutil.addClass('virtualclassCont', 'educator');
                } else {
                    virtualclass.vutil.removeClass('virtualclassCont', 'presenter');

                    cmdToolsWrapper = document.querySelector('#commandToolsWrapper_doc_0_0');
                    if (cmdToolsWrapper != null) {

                        cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                    }
                }

                localStorage.setItem('uRole', virtualclass.gObj.uRole); // should be store role student

                if (typeof virtualclass.wb == 'object') {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.uniqueArrOfObjsToStudent();
                }

            }

            virtualclass.system.setAppDimension();
            virtualclass.vutil.renderWhiteboardObjectsIfAny();

            /**
             * After assign the teacher Role, we need disconnect and reconnect
             * for pass the the reflected role to all other uses, because of problem
             * https://github.com/vidyamantra/virtualclass/issues/150
             *
             */

            // If teacher is disconnected then
            // there would come the porblem on editor of assigning role to student while continuous writting by him.

            if(!roles.hasAdmin()){
                io. disconnect();
                setTimeout(
                    function() {
                        virtualclass.uInfo.userobj.role = virtualclass.gObj.uRole;
                        io.init(virtualclass.uInfo);
                    }, 500
                );
            } else {
                /** We need to  update  the role at teacher side with virtualclass.uInfo.userobj.role
                 * because the older role is existing while new session is being created.
                 * TEST CASE:- assign role, page refresh both side, reclaim role, see io.cfg.userobj.role, you get the older role
                 * This happens only on teacher side, below st
                 * **/
                virtualclass.uInfo.userobj.role = virtualclass.gObj.uRole;
            }

        },
        renderWhiteboardObjectsIfAny: function() {
            if (typeof virtualclass.wb == 'object') {
                if (virtualclass.wb[virtualclass.gObj.currWb].vcan.main.children.length > 0) {
                    virtualclass.wb[virtualclass.gObj.currWb].vcan.renderAll();
                }
            }
        },

        createCommandWrapper: function(id) {
            var vcan = virtualclass.wb[id].vcan;
            var cmdToolsWrapper = document.createElement('div');
            cmdToolsWrapper.id = virtualclass.gObj.commandToolsWrapperId[id];
            cmdToolsWrapper.className = "commandToolsWrapper";
            var canvasElem = document.getElementById(vcan.canvasWrapperId);
            if (canvasElem != null) {
                document.getElementById('containerWb'+id).insertBefore(cmdToolsWrapper, canvasElem);
            } else {
                document.getElementById('containerWb'+id).appendChild(cmdToolsWrapper);
            }
            return cmdToolsWrapper;
        },

        createRoleWrapper : function() {
            var cmdToolsWrapper = document.createElement('div');
            cmdToolsWrapper.id = 'commandToolsWrapper_doc_0_0';
            cmdToolsWrapper.className = "commandToolsWrapper";
            return cmdToolsWrapper;
        },

        _reclaimRole: function () {

            virtualclass.vutil.beforeSend({'reclaimRole': true, 'cf': 'reclaimRole'});
            var reclaimButton = document.getElementById('t_reclaim');
            reclaimButton.style.pointerEvents = 'none';
            reclaimButton.style.opacity = "0.5";

            var that = this;
            setTimeout(
                function (){
                    that.reclaimRole();
                    virtualclass.user.control.changeAttrToAssign('enable');
                }, 2000
            );
        },

        reclaimRole: function() {
            virtualclass.gObj.controlAssign = false;
            this.vcResponseAssignRole(virtualclass.gObj.uid, virtualclass.gObj.uid, true);
        },
        //equivalent to response.assignRole from receive-messages-response.js//equivalen
        vcResponseAssignRole: function(fromUserId, id, reclaim) {
            if (fromUserId != id || typeof reclaim != 'undefined') {
                virtualclass.vutil.assignRole(id);
                if (typeof virtualclass.wb == 'object') {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.uniqueArrOfObjsToTeacher();
                }

                //create assing button only to student
                if (!roles.hasAdmin()) {
                    virtualclass.vutil.removeSessionTool();   //
                    var divContainer = chatContainerEvent.elementFromShadowDom("#ml" + fromUserId);
                    var controls = ['assign'];

                    var controlCont = document.getElementById(fromUserId + "ControlContainer");
                    if (controlCont != null) {
                        virtualclass.user.createAssignControl(controlCont, fromUserId, true);
                    } else {
                        var divControl = virtualclass.user.createControl(fromUserId, controls);
                        divContainer.appendChild(divControl);
                    }

                    localStorage.setItem('aId', fromUserId);
                    //virtualclass.vutil.toggleRoleClass();
                } else {
                    var currTeacherElem = document.getElementById('chat_div').getElementsByClassName('currTeacher')[0];
                    if (currTeacherElem != null) {
                        virtualclass.user.control.removeCurrTeacherFromControl(currTeacherElem.id);
                    }
                    virtualclass.user.control.changeAttrToAssign('enable');
                }
            }
            virtualclass.vutil.attachClickOutSideCanvas();
            if (virtualclass.system.device == 'mobTab') { //mobile or tablet
                virtualclass.vutil.disableVirtualClass();
                virtualclass.view.createErrorMsg(virtualclass.lang.getString('supportDesktop'), 'errorContainer', 'chatWidget');
            }
        },


        //equivalent to response.reclaimRole from receive-messages-response.js
        vcResponseAReclaimRole: function (formUserId, id) {
            console.log('Reclaim role :- Init');
            if (formUserId != id) {
                //virtualclsss.wb._replay.makeCustomEvent(virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs[virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs.length-1]);
                if(typeof virtualclass.wb == 'object'){
                    // if whiteboard is in mid state, vcan.main.action == 'move' means user is doing drag/rotate

                    var currObj = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs[virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs.length-1];

                    if(typeof currObj == 'object' && currObj.ac == 'del'){
                        console.log("Delete command:- Transferring the delete command");
                        virtualclass.vutil.beforeSend({'repObj': [currObj], 'cf': 'repObj'});
                    } else if(virtualclass.wb[virtualclass.gObj.currWb].tool.cmd == 't_text' && virtualclass.wb[virtualclass.gObj.currWb].vcan.main.action == 'create'){
                        var midReclaim = true;
                        virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.finalizeTextIfAny(midReclaim);
                        console.log("Text command:- Transferring text command");
                    } else if (((virtualclass.wb[virtualclass.gObj.currWb].tool.hasOwnProperty('started') && virtualclass.wb[virtualclass.gObj.currWb].tool.started == true) || virtualclass.wb[virtualclass.gObj.currWb].vcan.main.action == 'move')){
                        var tempObj = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs[virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs.length-1];

                        var currObj = vcan.extend({}, tempObj);
                        currObj.ac = 'u';
                        if (currObj.hasOwnProperty('mtext')) {
                            var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y, mtext: currObj.mtext}}};
                        } else {
                            var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y}}};
                        }

                        eventObj.detail.broadCast = true;
                        var eventConstruct = new CustomEvent('mouseup', eventObj); //this is not supported for ie9 and older ie browsers
                        vcan.main.canvas.dispatchEvent(eventConstruct);
                        console.log('Whiteboard:- Transfering the assign role to Teacher');

                    }

                    console.log('Role assign with reclaim');
                }


                virtualclass.user.control._assign(id, 'notsent', formUserId);
                console.log('Reclaim role :- peforme');
                virtualclass.user.displayStudentSpeaker(true);
                if (localStorage.getItem('aId') != null) {
                    localStorage.removeItem('aId');
                }
                virtualclass.user.control.removeAudioFromParticipate(formUserId);
                //virtualclass.vutil.toggleRoleClass(true);

                if (virtualclass.system.device == 'mobTab') { //mobile or tablet
                    //alert(App.system.mybrowser.name);
                    if ((virtualclass.system.mybrowser.name = "iOS" && virtualclass.system.mybrowser.version >= 8) && /(iPad)/g.test(navigator.userAgent)) {
                        virtualclass.vutil.enableVirtualClass();
                    }
                    var onlyLatest = true;
                    virtualclass.view.removeErrorMsg('errorContainer', onlyLatest);
                }
            }
        },

        createReclaimButtonIfNeed: function () {
            if (roles.isEducator()) {
                var cmdToolsWrapper = virtualclass.vutil.createRoleWrapper();
                virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                //virtualclass.gObj.uRole = 's';
                return true;
            }
            return false;
        },
        whoIsTeacher: function() {
            //TODO this function should call less frequently and may be called on member add function, status could be saved in a variable.

            if (virtualclass.hasOwnProperty('connectedUsers')) {
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if (virtualclass.connectedUsers[i].role == 't' || virtualclass.connectedUsers[i].role == 'e') {
                        return virtualclass.connectedUsers[i].userid;
                    }
                }
            }
            return 0;
        },

        getMySelf: function() {
            if (virtualclass.hasOwnProperty('connectedUsers')) {
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if (virtualclass.connectedUsers[i].userid == virtualclass.gObj.uid) {
                        return virtualclass.connectedUsers[i];
                    }
                }
            }
        },
        enablePresentatorEditors: function(touser) {
            var msg = {toUser: touser, status: true};

            virtualclass.user.control.received_editorRich(msg);
            virtualclass.user.control.received_editorCode(msg);
        },
        getClassName: function(role) {
            var className;

            if (role == 't') {
                className = 'teacher';
            } else if (role == 'e') {
                className = 'educator';
            } else if (role == 's') {
                className = 'student';

            }else if(role == 'p'){

                className = 'presenter';
            }
            return className;
        },


        isPresenterExist : function (){
            for(var i=0; i<virtualclass.connectedUsers.length; i++){
                if(virtualclass.connectedUsers[i].role == 'p'){

                    return true;
                }
            }
            return false;
        },


        setReadModeWhenTeacherIsDisConn : function (eType){
            if(!roles.hasAdmin()){
                var teacherDisConn = localStorage.getItem('oTDisconn');
                if(teacherDisConn != null){
                    teacherDisConn = JSON.parse(teacherDisConn);
                    if(teacherDisConn){ //If orginal teacher is disconnnected
                        if(virtualclass.hasOwnProperty(eType)){
                            if(typeof virtualclass[eType].cm == 'object'){

                                virtualclass[eType].cm.setOption('readOnly', 'nocursor');
                            } else {
                                console.log('Editor CM is notvutil defined for editor ' + eType);
                            }
                        } else {
                            console.log('Editor type ' + eType + ' is not ready.');
                        }

                    } else {
                        console.log('Teacher is connected.');
                    }
                }
            }
        },

        setReadModeWhenTeacherIsConn : function (eType){
            localStorage.removeItem('oTDisconn');
            var writeModeElem = document.getElementById(virtualclass.vutil.capitalizeFirstLetter(eType) +  'writeModeBox');
            if(writeModeElem != null){
                var writeMode = writeModeElem.getAttribute('data-write-mode');
                if(writeMode == 'true'){
                    virtualclass[eType].cm.setOption('readOnly', false);
                }else{

                    virtualclass[eType].cm.setOption('readOnly', 'nocursor');
                }
            } else {
                console.log('Editor:- writemode element is not found for ' + eType);
            }
        },


        isTeacherAlreadyExist : function(joinId){
            if(virtualclass.hasOwnProperty('connectedUsers')){
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 't' ||  virtualclass.connectedUsers[i].role == 'e')
                        && virtualclass.connectedUsers[i].userid != joinId) {

                        console.log('joni Id ' + joinId);
                        return true;
                    }
                }
            }
            return false;
        },

        isPresenterAlreadyExist : function (joinId){
            if(virtualclass.hasOwnProperty('connectedUsers')){
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 'p')
                        && virtualclass.connectedUsers[i].userid != joinId) {

                        console.log('joniId ' + joinId);
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * Get presenter id otherwise false
         * @returns {*}
         */

        getPresenterId :function (){
            if(virtualclass.hasOwnProperty('connectedUsers')){
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 'p')){

                        return virtualclass.connectedUsers[i].userid;
                        return true;
                    }
                }
            }
            return false;
        },

        isEducatorAlreadyExist : function (joinId){
            if(virtualclass.hasOwnProperty('connectedUsers')){
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 'e')
                        && virtualclass.connectedUsers[i].userid != joinId) {

                        console.log('joniId ' + joinId);
                        return true;
                    }
                }
            }
            return false;
        },

        isOrginalTeacherExist : function (joinId){
            if(virtualclass.hasOwnProperty('connectedUsers')){
                for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                    if ((virtualclass.connectedUsers[i].role == 't')
                        && virtualclass.connectedUsers[i].userid != joinId) {

                        console.log('joniId ' + joinId);
                        return true;
                    }
                }
            }
            return false;
        },

         /**
         * The widget for requset the Teacher Role
         */
        createBecomeTeacherWidget : function(){
            if(document.getElementById('beTeacher') == null){

                var beTeacher = document.createElement('div');
                beTeacher.id = 'beTeacher';

                var beTeacherLink = document.createElement('a');
                beTeacherLink.id = beTeacher.id + 'Anchor';
                beTeacherLink.innerHTML = virtualclass.lang.getString('becomeTeacher');
                beTeacher.appendChild(beTeacherLink);

                var virtualclassContElem = document.getElementById('virtualclassCont');
                virtualclassContElem.insertBefore(beTeacher, virtualclassContElem.firstChild);

                beTeacher.addEventListener('click', virtualclass.vutil.initTeacherRole);

                beTeacher.style.pointerEvents = 'none';
                beTeacher.style.opacity = '0.5';
                // For handle the case,  on where teacher refresh the page
                setTimeout(

                    function (){
                        beTeacher.style.pointerEvents = 'visible';
                        beTeacher.style.opacity = '1';
                    }, 60000 //60000
                )
            }
        },

        /**
         * Remove the teacher widget
         */
        removeBecomeTeacherWidget : function (){
            var becomeTeacherElem = document.getElementById('beTeacher');
            if(becomeTeacherElem != null){
                becomeTeacherElem.parentNode.removeChild(becomeTeacherElem);
            }
        },


        /**
         * This function would be trigger when
         * user try to become teacher and send the become Teacher flag to
         * other participates for delete the button
         * and this teacher would join after the time set by virtualclass.gObj.mySetTime
         */


        initTeacherRole : function (){
            // debugger;
            ioAdapter.send({'cf': 'bt'}); //become teacher
            virtualclass.vutil.removeBecomeTeacherWidget(); // remove button from self window
            setTimeout(
                function (){
                    if(!virtualclass.vutil.isOrginalTeacherExist(virtualclass.jId)){
                        virtualclass.vutil.overrideRoles('t');
                        localStorage.setItem('beTeacher',  true);
                        console.log('connected teacher');
                    } else {
                        console.log('Already connected teacher');
                    }
                    window.location.reload();
                }, virtualclass.gObj.mySetTime
            );
        },


        overrideRoles : function (role){

            virtualclass.uInfo.userobj.role = role;
            virtualclass.gObj.uRole = virtualclass.uInfo.userobj.role;
            wbUser.role = virtualclass.uInfo.userobj.role;
            var virtualclassCont = document.getElementById('virtualclassCont');
            virtualclass.vutil.overrideRolesFromElem(virtualclassCont, role);
        },

        /**
         * Override the class on elements according to given role
         * @param elem
         * @param role
         */

        overrideRolesFromElem : function (elem, role){
            if(role == 's'){

                elem.classList.remove('teacher');
                elem.classList.remove('orginalTeacher');
                elem.classList.remove('presenter');
                elem.classList.remove('educator');
                virtualclassCont.classList.add('student');
                //this.synchEditorTools();

            } else if(role == 'p'){

                elem.classList.remove('teacher');
                elem.classList.remove('orginalTeacher');
                elem.classList.remove('educator');
                virtualclassCont.classList.add('student');
                virtualclassCont.classList.add('presenter');

            } else if(role == 'e'){

                // By removing the teacher class would hide
                // the audio icon from footer control on reload
                //elem.classList.remove('teacher');
                elem.classList.add('teacher');
                elem.classList.remove('student');
                elem.classList.remove('presenter');
                elem.classList.add('educator');
                elem.classList.add('orginalTeacher');


            }else if(role == 't'){
                elem.classList.remove('student');
                elem.classList.remove('educator');
                elem.classList.remove('presenter');
                elem.classList.add('teacher');
                elem.classList.add('orginalTeacher');
                console.log('add Teacher');
            }
        },

        sesionEndMsgBoxIsExisting : function (){
            var sessionEndCont = document.getElementById('sessionEndMsgCont');
            return (sessionEndCont.hasAttribute('data-displaying') && sessionEndCont.dataset.displaying == 'true'); // do nothing if there is already sesion end box

        },

        removeVideoHostContainer : function(){
            var videoHostContainer = document.getElementById('videoHostContainer');
            if(videoHostContainer != null){
                videoHostContainer.parentNode.removeChild(videoHostContainer);
            }
        },

        createDummyUser : function (usersLength) {
            if(usersLength){
                usersLength = usersLength;
            }else {
                var usersLength = 5000;
            }

            var msg;
            var i = 0;
            var userId = 31;
            var createUser = setInterval(
                function () {
                    if (i > usersLength) {
                        clearInterval(createUser);
                        return;
                    }

                    userId += i;
                    msg = {
                        joinUser: {key: userId},
                        message: [{
                            lname: " ",
                            name: "User"+userId,
                            role: "s",
                            userid: userId
                        }],
                        newuser: null,
                        type: "member_added",
                        user: true,
                    }
                    i++;
                    virtualclass.ioEventApi.readyto_member_add(msg);

                }, 1
            );
        },

        // calculateChatHeight : function (){
        //     var topBarHeight = 100;
        //     var videoHeight = 240;
        //     //nirmala
        //     var other = 0;
        //     var chatHeight = 0;
        //
        //     var rightSidebarHeight = document.querySelector('#virtualclassCont');
        //     if(rightSidebarHeight != null){
        //         chatHeight = this.getVisibleHeightElem('#virtualclassCont') - (topBarHeight + videoHeight + other);
        //         console.log('Chat height ' + chatHeight);
        //         return chatHeight;
        //     }else{
        //         alert('There is no right side bar');
        //     }
        //
        // },

        /** TODO should be written pure javascript
         * To get the height of visible element
         * @param element expect the element to which calculate the height
         * @returns {number} return height
         */
        //removejquery
        getVisibleHeightElem : function(element) {
            var $el = $(element),
                scrollTop = $(window).scrollTop(),
                scrollBot = scrollTop + $(window).height(),
                elTop = $el.offset().top,
                elBottom = elTop + $el.outerHeight(),
                visibleTop = elTop < scrollTop ? scrollTop : elTop,
                visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
            return (visibleBottom - visibleTop);
        },

        applyHeight : function (elem){
            var rightPanel = document.getElementById('virtualclassAppRightPanel');
            var rightPanelHeight = this.getVisibleHeightElem('virtualclassCont');
            rightPanel.style.height = (rightPanelHeight != nul1) ? rightPanelHeight : window.innerHeight;
        },

        insertIntoLeftBar : function (tobeInsert){
            var element = document.querySelector("#virtualclassApp #virtualclassAppLeftPanel");
            if(element != null){
                element.appendChild(tobeInsert);
            } else {
                alert('Error:- There is no Element to insert it.');
            }
        },

        getWhiteboardId : function (elem){
            var docElem  =  elem.closest('.vcanvas');
            if(docElem != null){
                return docElem.dataset.wbId;
            } else {
                alert("doc element is null");
            }
        },

        getElementOffset: function (element) {
            //console.log(element.id + " should second ");
            // TODO : need to fix this method
            var valueT = 0, valueL = 0;
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            }
            while (element);
            return ({x: valueL, y: valueT});
        },

        updateCurrentDoc : function (slide){
            virtualclass.gObj.currWb = '_doc_'+ slide + '_' + slide ;
        },

        getParentTag : function (element, selector){
            return element.closest(selector);
        },


        attachEventToUploadTab : function (type, elemArr, cb) {
            var btn = document.getElementById("newDocBtn");
            if(btn != null){
                btn.removeEventListener('click', virtualclass.vutil._attachEventToUploadTab);
                btn.addEventListener("click", virtualclass.vutil._attachEventToUploadTab);

            }
        },

        _attachEventToUploadTab : function (){
            var element = document.querySelector('#DocumentShareDashboard .qq-upload-button-selector.qq-upload-button input');
            if(element != null){
                element.click(); // This function triggers funtion attached on fine-uploader 'Upoad button'
                var msz = document.querySelector("#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list");
                if(msz){
                    msz.style.display="block";
                }

            }else {
                alert('Element is null');
            }
        },
        attachEventToUpload : function (type, elemArr, cb) {
            var btn = document.getElementById("uploadVideo")
            if(btn != null){
                btn.addEventListener("click", function (){
                    var element = document.querySelector('#VideoDashboard .qq-upload-button-selector.qq-upload-button input');
                    if(element != null){
                        element.click(); // This function triggers funtion attached on fine-uploader 'Upoad button'
                    }else {
                        alert('Element is null');
                    }
                })

            }
        },

        modalPopup: function (type, elemArr) {
            var upload = {};
            if(type == 'video'){
                var currPlayed = document.querySelector("#listvideo .playing")
                if (currPlayed) {
                    var id = currPlayed.getAttribute('data-rid')
                    this.currPlaying = id;
                }
                upload.validation = [ "mp4", "avi",  "wmv", "mov", "webm", "mkv", "vob",  "mpeg"];
                upload.cb = virtualclass.videoUl.afterUploadVideo;
                upload.cthis = 'video';
                upload.maxSize=512*1000*1000; //512 mb
                //upload.requesteEndPoint = window.webapi + "&methodname=file_save&user="+virtualclass.gObj.uid;
                upload.requesteEndPoint = window.webapi + "&methodname=file_save&live_class_id="+virtualclass.gObj.congCourse+"&status=1&content_type_id=2&user="+virtualclass.gObj.uid;
            } else {
                upload.validation = ['doc', 'docx', 'txt', 'html', 'csv', 'pdf', 'ppt', 'pptx','xls', 'xlsx', 'xlt', 'png', 'jpg', 'gif', 'svg', 'tiff', 'rtf', 'xpm'];
                upload.cb = virtualclass.dts.onAjaxResponse;
                upload.cthis = 'docs';
                upload.maxSize=24*1000*1000; //24MB
                // upload.requesteEndPoint = window.webapi + "&methodname=congrea_image_converter&user="+virtualclass.gObj.uid;
                upload.requesteEndPoint = window.webapi + "&methodname=congrea_image_converter&live_class_id="+virtualclass.gObj.congCourse+"&status=1&content_type_id=1&user="+virtualclass.gObj.uid;
            }

            upload.multiple = false;

            //  virtualclass.fineUploader.generateModal(type, elemArr)
            // virtualclass.fineUploader.initModal(type);
            upload.wrapper = document.getElementById(elemArr[0]);


            //upload.requesteEndPoint = "https://local.vidya.io/congrea_te_online/example/upload.php";


            virtualclass.fineUploader.uploaderFn(upload);

            if(type != 'video') {
                var cont = document.querySelector("#DocumentShareDashboard #docsUploadMsz");
                var upMsz = document.createElement("div");
                if (cont) {
                    cont.appendChild(upMsz);
                }
            }

        },

        xhrSendWithForm : function (data, methodname, cb){
            var form_data = new FormData();
            for ( var key in data ) {
                form_data.append(key, data[key]);
            }
            if(typeof methodname == 'undefined'){
                var path = window.webapi;
            } else {
                var path = window.webapi + "&methodname="+ methodname +"&user="+virtualclass.gObj.uid;
            }

            if(typeof cb != 'undefined' ){
                virtualclass.xhr.sendFormData(form_data, path, cb);
            } else {
                virtualclass.xhr.sendFormData(form_data, path);
            }
        },

        createSaveButton : function (){
            var saveButton = document.createElement('div');
            saveButton.id = "tech_support_save";

            var span = document.createElement('span');
            span.innerHTML = 'Save Session';
            saveButton.appendChild(span);
            return saveButton;
        },


        setChatContHeight : function (height){
             return;
            $('#chatWidget').height(height);
            this.setChatHeight(height);
        },
        //removejquery
        setChatHeight : function (height){
            return;
            var height = height - 40;
            if(virtualclass.isPlayMode){
                var height = height+64;
            }
            $('#chat_div').height(height);
        },

        alreadyConnected : function (userId){
            if(virtualclass.connectedUsers.length > 0){
                var result = virtualclass.connectedUsers.filter(function( obj ) {
                    return obj.userid == userId;
                });
                return (result.length > 0);
            }else {
                return false;
            }
        },

        UTCtoLocalTime : function (time) {
            var date = new Date(time);

            // Hours part from the timestamp
            var hours = date.getHours();
            // Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
            // Seconds part from the timestamp
           // var seconds = "0" + date.getSeconds();

            // Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2);

            return formattedTime;
        },

        UTCtoLocalTimeToSeconds : function (time){
            var time = new Date(time).getTime();
            return time;
        },

        appIsForEducator : function (app){
            for(var i in virtualclass.apps){
                if(virtualclass.apps[i] == app){
                    return false;
                }
            }
            return true;
        },
        /**
         * Todo, this needs to move in dashboard.js
         * @param currVideo
         */
        initDashboardNav : function (currVideo){
            if(roles.hasControls()){
                var dashboardnav = document.querySelector('#dashboardnav button');

                if(dashboardnav == null){
                    var dbNavTemp = virtualclass.getTemplate('dashboardNav');
                    var context = {app : virtualclass.currApp};
                    var dbNavHtml = dbNavTemp(context);

                    //var virtualclassOptionsCont = document.querySelector('#virtualclassOptionsCont');

                    var virtualclassAppOptionsCont = document.querySelector('#virtualclassAppOptionsCont');
                    virtualclassAppOptionsCont.insertAdjacentHTML('beforeend', dbNavHtml);

                    var dashboardnav =  document.querySelector('#dashboardnav button');
                    if (dashboardnav != null) {
                        dashboardnav.addEventListener('click', function () {
                            var app = document.querySelector(".congrea #virtualclassApp");
                            if (this.classList.contains('clicked')) {
                                virtualclass.dashBoard.close();
                                if (app) {
                                    if (app.classList.contains("dashboard")) {
                                        app.classList.remove("dashboard");
                                    }
                                }

                            } else {
                                if (app) {
                                    if (!app.classList.contains("dashboard")) {
                                        app.classList.add("dashboard");
                                    }
                                }
                                
                                virtualclass.vutil.initDashboard(virtualclass.currApp);
                                this.classList.add('clicked');
                                var Dtype = "close";
                                virtualclass.dashBoard.dashBoardClickTooltip(Dtype);

                                if (virtualclass.currApp == 'DocumentShare' && virtualclass.hasOwnProperty('dts')) {
                                    virtualclass.dts.moveProgressbar();

                                    if (virtualclass.dts.docs.currNote != null) {
                                        virtualclass.dts.setCurrentNav(virtualclass.dts.docs.currNote);
                                    }

                                    var notes = document.querySelector(".dbContainer #listnotes .linknotes");
                                    if (notes) {
                                        var btn = document.querySelector(".congrea.teacher  #dashboardContainer .modal-header button.enable")
                                        if (!btn) {
                                            virtualclass.vutil.showFinishBtn();
                                        }
                                    } else {
                                        virtualclass.vutil.removeFinishBtn();
                                    }

                                }

                            }
                            // virtualclass.vutil.removeFinishBtn();
                        }
                        );
                        if(currVideo){
                            virtualclass.vutil.readyDashboard(currVideo);
                        }
                    }
                }

                if(virtualclass.currApp == 'DocumentShare'){
                    if(!virtualclass.dts.noteExist()){
                        this.readyDashboard();

                    } else {
                        if(!virtualclass.dts.isUploaderExist()){
                            virtualclass.vutil.modalPopup('docs', ["docsuploadContainer"]);
                        }
                        var dtitle = document.getElementById('dashboardnav');
                        dtitle.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
                    }
                }else if(virtualclass.currApp == 'Video'){
                    if(typeof currVideo == 'undefined'){
                        this.readyDashboard();
                    }
                    var playing = document.querySelector(".congrea #listvideo .linkvideo.playing")
                    if(!playing){
                        virtualclass.vutil.removeFinishBtn(); 
                    }

                } else {
                    this.readyDashboard();
                     var playing = document.querySelector(".congrea #listppt .linkppt.playing")
                    if(!playing){
                        virtualclass.vutil.removeFinishBtn(); 
                    }  
                    var sharing = document.querySelector(".congrea .pptSharing");
                    if (sharing) {
                        virtualclass.modal.hideModal();
                    }
                }

            }
        },

        modalCloseHandler : function (){
            var finish  =document.querySelector(".congrea .dashboardContainer .modal-header .close")
            if(finish){
                finish.addEventListener("click",function(){
                    var app = document.querySelector(".congrea #virtualclassApp");
                    if(app.classList.contains("dashboard")){
                        app.classList.remove("dashboard")
                    }
                    finish.setAttribute('data-dismiss',"modal");
                      
                    virtualclass.modal.hideModal()
                })

            }
        },

        readyDashboard : function (currVideo){
            console.log('Ready Dashboard');
            var currApp = virtualclass.currApp;

            if(document.querySelector('#congdashboard') ==  null){
                var dashboardTemp = virtualclass.getTemplate('dashboard');
                var dbHtml = dashboardTemp({app:currApp});
                document.querySelector('#dashboardContainer').innerHTML = dbHtml;
            }

            this.modalCloseHandler();

            // in any other application we can handle
            // dashoard content in own style
            if(currApp == 'DocumentShare'){
                var dtitle = document.getElementById('dashboardnav');
                dtitle.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
                if(document.querySelector('#'+currApp+'Dashboard') == null){
                    var elem = document.createElement("div");
                    var cont = document.querySelector('#congdashboard .modal-body')
                    cont.appendChild(elem);
                    elem.id =currApp+'Dashboard'
                }
                var docsDbCont= document.querySelector('#docsDbCont');
                if(docsDbCont){
                    docsDbCont.parentNode.removeChild(docsDbCont);
                }

                document.querySelector('#'+currApp+'Dashboard').innerHTML = this.getDocsDashBoard(currApp);
                virtualclass.dts.init();
                virtualclass.vutil.attachEventToUploadTab();
                if(!virtualclass.dts.isUploaderExist()){
                    virtualclass.vutil.modalPopup('docs', ["docsuploadContainer"]);
                }
                virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listnotes');
            }else if(currApp == 'Video'){
                var dtitle = document.getElementById('dashboardnav');
                if(document.querySelector('#'+currApp+'Dashboard') == null){
                    var elem = document.createElement("div");
                    var cont = document.querySelector('#congdashboard .modal-body')
                    cont.appendChild(elem);
                    elem.id =currApp+'Dashboard'
                }

                var videocont= document.querySelector('#videoPopup');
                if(!videocont){
                    var videoDashboard = virtualclass.getTemplate('popup','videoupload');
                    var dbHtml = videoDashboard();
                    var videodb = document.querySelector('#VideoDashboard');
                    videodb.insertAdjacentHTML('beforeend',dbHtml)
                    //$('#VideoDashboard').append(dbHtml);
                    var msz = document.querySelector("#videoPopup  #uploadMsz div");
                    if(msz){
                        msz.parentNode.removeChild(msz)
                    }
                    virtualclass.vutil.attachEventToUpload();
                    virtualclass.videoUl.UI.inputUrl()
                }
                /* modal need to be created again and old one to be deleted, to remove conflict
                 with events of drag drops */
                virtualclass.videoUl.UI.popup(currVideo);
                virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
                virtualclass.vutil.makeElementActive('#listvideo');

                 if(currVideo && currVideo.init.videoUrl){
                    var hidepopup= true;
                 }
                var dashboardnav =  document.querySelector('#dashboardnav button');
                if(dashboardnav != null && !hidepopup && !virtualclass.vutil.isDashboardOpened()){
                    dashboardnav.click();
                }

            } else if (currApp == "SharePresentation"){
                var dtitle = document.getElementById('dashboardnav');
                dtitle.setAttribute('data-title', virtualclass.lang.getString('SharePresentationdbHeading'));
                if(document.querySelector('#'+currApp+'Dashboard') == null){
                    var elem = document.createElement("div");
                    var cont = document.querySelector('#congdashboard .modal-body')
                    cont.appendChild(elem);
                    elem.id =currApp+'Dashboard'
                }

            }
            // in case dashboard already created and button is enabled in previous app

        },

        initDashboard : function (currApp, hidepopup){
            var mainContainer = document.querySelector('#mainContainer');
            if(currApp=="SharePresentation") {
                var dbcont = document.querySelector('#pptDbCont');
                if (!dbcont) {
                    // todo, nirmala, you have to finde below condition is correct
                    if (document.querySelector('.docsDbCont') == null) {
                        document.querySelector('#SharePresentationDashboard').innerHTML = virtualclass.vutil.getPptDashBoard("SharePresentation");
                    }
                    virtualclass.sharePt.attachEvent("submitpurl", "click", virtualclass.sharePt.initNewPpt);
                    if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
                        virtualclass.sharePt.showPpts(virtualclass.sharePt.ppts);
                        virtualclass.sharePt.retrieveOrder();
                    }
                }
            }
            var allDbContainer  = document.querySelectorAll('#congdashboard .dbContainer');
            for(var i=0; i<allDbContainer.length; i++){
                if(allDbContainer[i].dataset.app == virtualclass.currApp){
                    allDbContainer[i].style.display = 'block';
                }else {
                    allDbContainer[i].style.display = 'none';
                }
            }

            console.log('Dashboard is created for ' + virtualclass.currApp);
            if(currApp == "DocumentShare"){
                if(typeof hidepopup == 'undefined'){
                    //$('#congdashboard').modal();
                    virtualclass.modal.showModal()
                    virtualclass.dashBoard.clickCloseButton();
                }

                if(virtualclass.dts.noteExist()){
                    virtualclass.vutil.hideUploadMsg('docsuploadContainer'); // file uploader container
                }
               //  virtualclass.vutil.attachEventToUploadTab();

            }else if(currApp == "Video"){
                if(typeof hidepopup == 'undefined'){
//                    $('#congdashboard').modal({
//                        keyboard: false
//                    });
                virtualclass.modal.showModal() ;
                }
            } else {
                virtualclass.modal.showModal();
            }

            virtualclass.dashBoard.actualCloseHandler();

            var moodleHeader = document.querySelector('#congdashboard .modal-header h4');
            if(moodleHeader != null){
                moodleHeader.innerHTML = virtualclass.lang.getString(currApp + 'dbHeading');
            }


        },

        getDocsDashBoard : function (app){
            var dashboardTemp = virtualclass.getTemplate('dashboard', 'documentSharing');
            var context = {app : app, hasControls : roles.hasControls()};
            return dashboardTemp(context);
            // return "<div class='dbContainer' data-app='"+app+"'>"+app+"</div>";
        },
        getPptDashBoard : function (app){
            var dashboardTemp = virtualclass.getTemplate('dashboard', 'ppt');
            var context = {app : app, hasControls : roles.hasControls()};
            return dashboardTemp(context);
            // return "<div class='dbContainer' data-app='"+app+"'>"+app+"</div>";
        },

        removeDashboardNav : function (){
            var dashboardnav = document.querySelector('#dashboardnav');
            if(dashboardnav != null){
                dashboardnav.parentNode.removeChild(dashboardnav);
            }
        },

        makeElementDeactive : function (selector){
            console.log('drag drop Deactive element ' + selector);
            var element = document.querySelector(selector);
            if(element != null){
                element.style.pointerEvents = 'none';
            }
        },

        makeElementActive : function (selector){
            console.log('drag drop Active element ' + selector);
            var element = document.querySelector(selector);
            if(element != null){
                element.style.pointerEvents = 'visible';
            }
        },

        initCommonSortingChat : function (){
            setTimeout(
                 function (){
                      sortCommonChat();
                 }, 800
            );
        },

        triggerDashboard : function (currApp, hidepopup){
            if(currApp == 'DocumentShare'){
                var currentNote = document.querySelector('#screen-docs .note.current');
                if(currentNote == null){
                    if(typeof hidepopup ==  'undefined'){
                        virtualclass.vutil.initDashboard(currApp);
                    }else {
                        virtualclass.vutil.initDashboard(currApp, hidepopup);
                    }
                }else {
                    // virtualclass.zoom.zoomAction('fitToScreen');
                    // virtualclass.pdfRender[virtualclass.gObj.currWb].fitWhiteboardAtScale(virtualclass.gObj.currWb);
                    // virtualclass.wb[virtualclass.gObj.currWb].prvCanvasScale = virtualclass.zoom.canvasScale;
                }
            }else if(currApp == 'Video'){
                if(typeof hidepopup ==  'undefined'){

                    virtualclass.vutil.initDashboard(currApp);
                }else{
                    virtualclass.vutil.initDashboard(currApp, hidepopup);

                }

            } else {
                virtualclass.vutil.initDashboard(currApp);
            }
        },

        trimExtension : function (fname){
            return fname.replace(/\.[^/.]+$/, "")
        },

        hideUploadMsg : function (appId){
            var elem = document.querySelector('#'+appId+' .qq-uploader-selector.qq-uploader.qq-gallery');
            if(elem != null){
                elem.setAttribute('qq-drop-area-text', '')
            }
        },

        showUploadMsg : function (appId){
            var elem = document.querySelector('#'+appId+' .qq-uploader-selector.qq-uploader.qq-gallery');
            if(elem != null){
                elem.setAttribute('qq-drop-area-text', virtualclass.lang.getString('dropfilehere'));
            }
        },

        /** Enable or Disable the Audio **/
        audioStatus : function (tag, status){
            var anchor = tag.getElementsByClassName('congtooltip')[0];
            if(status == 'true'){
                tag.setAttribute('data-audio-playing', "true");
                anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
                tag.className = "audioTool active";
            }else {
                tag.setAttribute('data-audio-playing', "false");
                if(anchor){
                    anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
                }
                tag.className = "audioTool deactive";
            }
        },


        selfVideoStatus : function(){
            var svid = document.querySelector(".congrea .videoSwitchCont #videoSwitch");
            if(svid.classList.contains("off")){
                return "off";
            } else if(svid.classList.contains("on")){
                return "on";
            }
        },

        videoController: function () {
            var ctr = document.querySelector(".congrea .videoSwitchCont");
            if(ctr){
                ctr.addEventListener("click", function () {
                   virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() == 'off' ) ? 'on' : 'off');
                })
            }

        },

        videoHandler: function (action, notSend) {
            var video;
            var sw = document.querySelector(".congrea .videoSwitchCont #videoSwitch")
            // Action on means video is On or off means video is off

            if (action == "on") {
                sw.classList.remove("off");
                sw.classList.add("on");

                video = "on"
                var tooltip = document.querySelector(".videoSwitchCont");
                tooltip.dataset.title = "Video off"
                if (roles.hasControls()) {
                    virtualclass.videoHost.gObj.videoSwitch = 1;
                    console.log("videoswitch 1");
                } else {
                    virtualclass.videoHost.gObj.stdStopSmallVid = false;
                }

               // var hasImg = document.querySelector("#ml"+virtualclass.gObj.uid+" .user-details a span")||document.querySelector("#ml"+virtualclass.gObj.uid+" .user-details a img")

                var hasImg = chatContainerEvent.elementFromShadowDom("#ml"+virtualclass.gObj.uid+" .user-details a span") || chatContainerEvent.elementFromShadowDom("#ml"+virtualclass.gObj.uid+" .user-details a img");

                if(hasImg){
                    virtualclass.videoHost.removeUserIcon(virtualclass.gObj.uid );
                }else{
                    virtualclass.gObj.delayVid="hide"
                }

                if(roles.hasControls()){
                    virtualclass.videoHost.UI.displayTeacherVideo();
                }

                var mysmallVideo =  document.querySelector('#ml' + virtualclass.gObj.uid + ' video');
                if(mysmallVideo != null){
                    // mysmallVideo.srcObject.getVideoTracks()[0].stop();
                    setTimeout(
                        function (){
                            mysmallVideo.srcObject =  virtualclass.media.stream;
                        }, 100
                    );

                }
            } else if(action == "off"){
                sw.classList.remove("on");
                sw.classList.add("off");
                // virtualclass.videoHost.gObj.videoSwitch = 0;
                video = "off";
                var tooltip = document.querySelector(".videoSwitchCont");
                tooltip.dataset.title="Video on"
                if(roles.hasControls()){
                    virtualclass.videoHost.gObj.videoSwitch = 0;
                }else{
                    virtualclass.videoHost.gObj.stdStopSmallVid = true;
                }
                var hasVideo =  chatContainerEvent.elementFromShadowDom("#ml"+virtualclass.gObj.uid+" .user-details a .videoWrapper")

                if(hasVideo){
                    virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid);
                }else{
                    virtualclass.gObj.delayVid="display";
                }

                if(roles.hasControls()){
                    virtualclass.videoHost.UI.hideTeacherVideo();
                }
            }

            if(typeof notSend == 'undefined'){
                if(virtualclass.gObj.meetingMode){
                    let vaction = (action == "off") ? false : true;
                    virtualclass.multiVideo.setVideoStatus(vaction);
                }else if(virtualclass.gObj.uid ==   virtualclass.vutil.whoIsTeacher()){

                    ioAdapter.mustSend({'congCtr': {videoSwitch: video}, 'cf': 'congController'});
                }

                if(!roles.hasControls()){
                    ioAdapter.mustSend({'stdVideoCtr': {videoSwitch:  virtualclass.videoHost.gObj.stdStopSmallVid}, 'cf': 'stdVideoCtrl'});
                }
            }
        },

        isChromeExtension : function (){
            window.postMessage({type: 'isInstalled', id: 1}, '*');
            console.log('Chrome Extension:- Check');
            // setTimeout(
            //     function (){
            //         if(!virtualclass.gObj.chromeExt){
            //             virtualclass.gObj.chromeExt = true;
            //         }
            //     },
            //     1500
            // );

            window.addEventListener('message', function (event) {
                if (event.data.type == 'yes') {
                    virtualclass.gObj.chromeExt = true;
                }
                // console.log('Chrome Extension:- is available');
            });

        },

        setWidth : function (wbId, canvas, width){
            var canvas = document.querySelector('#canvas'+wbId);
            canvas.width = width;
        },

        setHeight : function(wbId, canvas, height){
            var canvas = document.querySelector('#canvas'+wbId);
            canvas.height =  height;
            // virtualclass.wb[wbId].vcan.renderAll();
        },

        getWidth : function(canvas){
            return canvas.width;
        },

        getHeight : function(canvas){
            return canvas.height;
        },

        getValueWithoutPixel : function (pxValue){
            return parseInt(pxValue, 10);
        },

        removeDecimal : function(number){
            return number.toFixed(2);
        },


        getElemM : function (wrapper, type){
            if(type == 'Y'){
                var res = document.querySelector('#' + wrapper).offsetHeight;
            }else if(type == 'X'){
                var res = document.querySelector('#' + wrapper).offsetWidth;
            }
            return this.getValueWithoutPixel(res);
        },

        getElemM2 : function (wrapper, type){
            if(type == 'Y'){
                var res = document.querySelector('#' + wrapper).offsetHeight;
            }else if(type == 'X'){
                var res = document.querySelector('#' + wrapper).offsetWidth;
            }
            return this.getValueWithoutPixel(res);
        },

        getElemHeight : function (wrapper){
            var heighPx = document.querySelector('#' + wrapper).offsetHeight;
            return this.getValueWithoutPixel(heighPx);
        },

        getElemWidth : function (wrapper){
            var widthPx = document.querySelector('#' + wrapper).offsetWidth;
            return this.getValueWithoutPixel(widthPx);
        },

        visibleElementHeighOldt : function (innerElem, wrapper){
            var offset = 0;
            var node = document.getElementById(innerElem);
            while (node.offsetParent && node.offsetParent.id != wrapper)
            {
                offset += node.offsetTop;
                node = node.offsetParent;
            }
            var visible = node.offsetHeight - offset;
            return visible;
        },

        elementIsVisible2 : function(el) {
            var elemTop = el.getBoundingClientRect().top;
            var elemBottom = el.getBoundingClientRect().bottom;

            // Only completely visible elements return true:
            var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            // Partially visible elements return true:
            //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
            return isVisible;
        },

        elementIsVisible : function(elm) {
            var rect = elm.getBoundingClientRect();
            var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
        },

        getVisibleHeight : function (el){
            // TODO this should be convert into pute javascript
            var $el = $('#'+el),
                scrollTop = $(window).scrollTop(),
                scrollBot = scrollTop + $(window).height(),
                elTop = $el.offset().top,
                elBottom = elTop + $el.outerHeight(),
                visibleTop = elTop < scrollTop ? scrollTop : elTop,
                visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
                return (visibleBottom-visibleTop);
        },

        isNumeric : function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },

        setContainerDimension : function (width, height){

        },

        setDefaultScroll : function (){
            if(roles.hasControls() && virtualclass.currApp == 'Whiteboard' || virtualclass.currApp == 'DocumentShare'){
                var wb = virtualclass.gObj.currWb;
                if(wb != null && virtualclass.pdfRender[wb].canvasWrapper != null){
                    // Defualt scroll trigger
                    virtualclass.pdfRender[wb].canvasWrapper.scrollTop = 1;
                }
            }
        },

        createWhiteBoard : async function (wId){
            var args = ['Whiteboard', 'byclick', wId];
            await virtualclass.appInitiator['Whiteboard'].apply(virtualclass, Array.prototype.slice.call(args));
            var measureRes = virtualclass.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
            virtualclass.system.setCanvasWrapperDimension(measureRes, wId);
        },

        createHashString : function (str){
            var res = 0,
                len = str.length;
            for (var i = 0; i < len; i++) {
                res = res * 31 + str.charCodeAt(i);
                res = res & res;
            }
            return res;
        },

        randomString : function (length) {
            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
            return result;
        },

        isBulkDataFetched : function (){
            return (virtualclass.serverData.rawData.video.length > 0
            || virtualclass.serverData.rawData.docs.length > 0
            || virtualclass.serverData.rawData.ppt.length > 0 );
        },

        sendOrder : function (type, order,cb){
            virtualclass.gObj.docOrder[type] = order;
            var data = {order: JSON.stringify(virtualclass.gObj.docOrder)};
            var url = virtualclass.api.UpdateRoomMetaData
            virtualclass.xhrn.sendData(data, url,cb);
        },
        saveWbOrder: function (order) {
            if (order) {
                console.log("nirmala" +order)
                localStorage.setItem("wbOrder", JSON.stringify(virtualclass.wbCommon.order))
            }
        },
        requestOrder : function (type, cb){
            var url = virtualclass.api.GetRoomMetaData;
            var cthis = this;
            virtualclass.xhrn.sendData({noting:true}, url, function (response) {
                if (response == "Error") {
                    console.log("page order retrieve failed");
                } else {
                    var response = JSON.parse(response).Item;
                    if(response != null && typeof response != 'undefined' && response != undefined){
                        if (response.order.S) {
                            if(virtualclass.vutil.IsJsonString(response.order.S)){
                                var responseData = JSON.parse(response.order.S);
                                virtualclass.gObj.docOrder = responseData;
                                cb(responseData[type]);
                            }
                        }
                    }
                }
            });
        },

        IsJsonString : function(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        removeChildrens : function (selector){
            // selector = selector + ' .qq-upload-list-selector.qq-upload-list li';
            console.log('children selector ' + selector);
            var uploadLists = document.querySelectorAll(selector);
            for(var i=0; i < uploadLists.length; i++){
                uploadLists[i].parentNode.removeChild(uploadLists[i]);
            }
        },


        initAcitveElement : function (){
            if(virtualclass.currApp == 'Video'){
                var activeElem = '#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery';
                var deactiveElem = '#listvideo';
            }else if(virtualclass.currApp == 'DocumentShare'){
                var activeElem = '#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery';
                var deactiveElem = '#listdocs';
            }

            var elem = document.querySelector('#'+ virtualclass.currApp + 'Dashboard');
            if(elem != null && !elem.classList.contains('uploading')) {
                virtualclass.vutil.makeElementActive(activeElem);
                virtualclass.vutil.makeElementDeactive(deactiveElem);

            }else{
                virtualclass.vutil.makeElementDeactive(activeElem);
            }

        },

        isResponseAvailable : function (reponse){
            return (reponse != undefined && reponse != 'undefined' && reponse != null)
        },

        navWhiteboard    : function (cthis, func, dthis){
            // this.removeAllTextWrapper();
            if(virtualclass.vutil.isTextWrapperExist()){
                virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.finalizeTextIfAny();
            }
            // if(virtualclass.gObj.hasOwnProperty('wbNav')){
            //     clearTimeout(virtualclass.gObj.wbNav);
            // }
            if(typeof dthis != 'undefined'){
                func.call(cthis, dthis);
            } else {
                func.call(cthis);
            }
            console.log('whiteboard nav time' + virtualclass.gObj.wbNavtime);
            // virtualclass.gObj.wbNav = setTimeout(
            //     function (){
            //         if(typeof dthis != 'undefined'){
            //             func.call(cthis, dthis);
            //         }else {
            //             func.call(cthis);
            //         }
            //         console.log('whiteboard nav time' + virtualclass.gObj.wbNavtime);
            //     }, virtualclass.gObj.wbNavtime
            // )
        },

        removeAllTextWrapper : function (){
            var allTextWrapper = document.querySelectorAll('.canvasWrapper .textBoxContainer');
            for(var i=0; i<allTextWrapper.length; i++){
                allTextWrapper[i].parentNode.removeChild(allTextWrapper[i]);
            }
        },

        isDashboardOpened : function (navButton){
            var navButton = document.querySelector('#dashboardnav button');
            return (navButton != null && navButton.classList.contains('clicked'));
        },

        stopConnection : function (){
            if(io.webSocketConnected()){
                // io.sock.close();
                io.disconnect();
            }
            virtualclass.gObj.invalidlogin = true;
        },

        initDefaultApp : () => {
            var defaultApp  = document.querySelector('#virtualclass'+virtualclass.gObj.defaultApp +'Tool a');
            if(defaultApp != null){
                defaultApp.click(defaultApp);
            }
        },

        /** Indicates the sign who(student) is screen sharing **/
        initssSharing : (uid) => {
            virtualclass.gObj.whoIsSharing = uid;
            // var elem = document.getElementById(uid + 'contrstdscreenImg');
            var elem = chatContainerEvent.elementFromShadowDom('#ml'+uid + ' .icon-stdscreenImg');
            if(elem != null){
                elem.setAttribute('data-dcolor', 'green');
            }
        },

        /** Remove the sign from the student that who was screen sharing **/
        removeSSsharing : () => {
            var controleCont = document.querySelector('#chat_div .controleCont.ssSharing');
            if(controleCont != null){
                controleCont.classList.remove('ssSharing');
            }
            delete virtualclass.gObj.whoIsSharing;
        },

        /** Inoforming to the teacher that I am sharing the screen **/
        informIamSharing : () => {
            var teacher = virtualclass.vutil.whoIsTeacher();
            if(roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing){
                ioAdapter.mustSendUser({
                    cf : 'sshare_user'
                }, teacher);
            }
        },

        resizeWindowIfBigger : function (){
            var currWb = virtualclass.gObj.currWb;
            var canvasWrapper = document.querySelector('#canvasWrapper' + currWb);
            if(canvasWrapper != null){
                var diff = window.innerWidth - (canvasWrapper.offsetWidth + 320);
                if(diff > 60){
                    console.log('Resize event is triggered');
                    system.initResize();
                }
            }
        },

        isTextWrapperExist : function (){
            return (document.querySelectorAll('.canvasWrapper .textBoxContainer').length > 0);
        },

        // insertAppLayout : function (html){
        //     $('#virtualclassAppContainer').append(containerhtml);
        // }

        insertAppLayout : (html) => {
            var appContainer = document.querySelector('#virtualclassAppContainer')
            //appContainer.insertAdjacentHTML('beforeend',html)
            $('#virtualclassAppContainer').append(html);
        },
        prechkScrnShare:function(){
            if(localStorage.getItem('precheck')){
                var virtualclassPreCheck = document.getElementById('preCheckcontainer');
                virtualclassPreCheck.style.display = 'none';
                var virtualclassApp = document.getElementById('virtualclassApp');
                virtualclassApp.style.display = 'block';
                virtualclass.videoHost._resetPrecheck();

            }else{
                virtualclass.popup.waitMsg();
                virtualclass.makeReadySocket();
                var virtualclassPreCheck = document.getElementById('preCheckcontainer');
                virtualclassPreCheck.style.display = 'none';
                var virtualclassApp = document.getElementById('virtualclassApp');
                virtualclassApp.style.display = 'block';
                localStorage.setItem('precheck', true);
                virtualclass.videoHost.afterSessionJoin();
            }
            virtualclass.gObj.precheckScrn=false;
        },
        showFinishBtn:function(){
            var btn = document.querySelector(".congrea #dashboardContainer .modal-header button") ;
            if(btn){
                btn.classList.add("enable")
            }

            if(virtualclass.currApp == 'DocumentShare'){
                var virtualclassContainer = document.querySelector('#virtualclassAppLeftPanel');
                virtualclassContainer.classList.add('showZoom');
                virtualclassContainer.classList.remove('hideZoom');
            }
        },

        removeFinishBtn:function(){
            var btn = document.querySelector(".congrea.teacher  #dashboardContainer .modal-header button.enable") ;
            if(btn){
                btn.classList.remove("enable")
            }
            if(virtualclass.currApp == 'DocumentShare'){
                var virtualclassContainer = document.querySelector('#virtualclassAppLeftPanel');
                virtualclassContainer.classList.add('hideZoom');
                virtualclassContainer.classList.remove('showZoom');
            }
        },

        removeSharingClass : function (){
            var virtualclassCont = document.querySelector('#virtualclassCont');
            if(virtualclassCont != ''){
                virtualclassCont.classList.remove('studentScreenSharing');
                document.querySelector('#chat_div').classList.remove('studentScreenSharing');
            }
        },
        
        addNoteClass : function (){
            if(roles.isStudent()){
                var docScreenContainer = document.querySelector('#docScreenContainer');
                if(docScreenContainer !=  null){
                    docScreenContainer.classList.add('noteDisplay');
                    console.log('add note display');
                }
            }
        },

        calcBrightness:function(color){
            var rgb = chroma(color).rgb();
            var c = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
            var brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
            console.log("brightne" + brightness);
            //alert(brightness);
            return brightness
        },

        removeStudenScreenStatus : function (){
            var allStdscreenImg  = chatContainerEvent.elementFromShadowDom('.stdscreenImg', 'all');
            for(var i=0; i<allStdscreenImg.length; i++){
                allStdscreenImg[i].dataset.dcolor = "";
            }
        },

        insertAfter : function (newNode, afterNode){
            afterNode.parentNode.insertBefore(newNode, afterNode.nextSibling);
        },

        triggerMouseEvent : function (node, eventType) {
			if(node != null){
				var clickEvent = document.createEvent ('MouseEvents');
				clickEvent.initEvent (eventType, true, true);
				node.dispatchEvent (clickEvent);
			}
        },

        getCookie : function(name) {
            function escape(s) { return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1'); };
            var match = document.cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
            return match ? match[1] : null;
        },

        sendCurrAppOnUserJoin : function (){
            if (typeof virtualclass.wb == 'object' && virtualclass.currApp == 'Whiteboard') {
                var objs = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs;
                if (objs.length > 0) {
                    ioAdapter.sendWithDelayAndDrop ({'repObj': objs, 'cf': 'repObj'}, null, 'mustSend', 'repObj', 1500);
                    // virtualclass.vutil.beforeSend({'repObj': objs, 'cf': 'repObj'});
                } else {
                    console.log('Could not send the whiteboard data');
                }
            }
        },

        setCurrApp : function (container, app){
            container.dataset.currapp = app;
            console.log('Data set curr app ' + app);
            var chat_div = document.getElementById('chat_div');
            if(chat_div != null){
                chat_div.dataset.currapp = app;
            }
        },

        selfJoin : function (jId) {
            if(jId == virtualclass.gObj.uid){
                // The speed needs to send only when self joining
                ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
                return true;
            }
            return false;
        },

        getUrlVars (url) {
            var vars = [], hash;
            var hashes = url.slice(url.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++)
            {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        clearSyncTimeInterval () {
            if(virtualclass.videoUl.hasOwnProperty('syncTimeInterval')){
                clearInterval(virtualclass.videoUl.syncTimeInterval);
            }

        },

        pageVisible () {
            var stateKey, eventKey, keys = {
                hidden: "visibilitychange",
                webkitHidden: "webkitvisibilitychange",
                mozHidden: "mozvisibilitychange",
                msHidden: "msvisibilitychange"
            };
            for (stateKey in keys) {
                if (stateKey in document) {
                    eventKey = keys[stateKey];
                    break;
                }
            }
            return function(c) {
                if (c) document.addEventListener(eventKey, c);
                return !document[stateKey];
            }
        },

        showZoom () {
            var zoom = document.querySelector("#virtualclassAppLeftPanel.hideZoom");
            if(zoom){
                zoom.classList.remove("hideZoom");
                zoom.classList.add("showZoom");
            }
        },
           
            removeBackgroundVideoApp:function(){
                virtualclass.videoUl.videoId = "";
                var frame = document.getElementById("dispVideo_Youtube_api");
                if (frame && frame.contentWindow) {
                    frame.contentWindow.postMessage(
                            '{"event":"command","func":"pauseVideo","args":""}',
                            '*');
                }

                var dispVideo = document.querySelector(".congrea #dispVideo")
                if (dispVideo) {
                    dispVideo.style.display = "none";
                    var video = document.querySelector(".congrea #dispVideo video")
                    if (video) {
                        video.setAttribute("src", '');
                    }
                }
                var currPlaying = document.querySelector("#listvideo .playing")
                if (currPlaying) {
                    currPlaying.classList.remove('playing')
                }
                var currCtr = document.querySelector("#listvideo .removeCtr")
                if (currCtr) {
                    currCtr.classList.remove('removeCtr')
                }

                if (!roles.hasControls()) {
                    if (virtualclass.gObj.hasOwnProperty('videoPauseTime')) {
                        clearTimeout(virtualclass.gObj.videoPauseTime);
                    }

                    if (typeof virtualclass.videoUl.player == 'object' && virtualclass.videoUl.player.player_ != null
                            && virtualclass.videoUl.player.paused()) {
                        console.log('==== Video is paused')
                        virtualclass.videoUl.player.pause();
                    }
                }
                if (typeof virtualclass.videoUl.player == 'object') {
                    delete(virtualclass.videoUl.player);
                }
                       
            }
        
    };
    window.vutil = vutil;
})(window);
