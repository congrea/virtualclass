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
                    virtualclass.user.control.audioWidgetDisable();
                }

                if (virtualclass.gObj.hasOwnProperty('errNotDesktop')) {
                    virtualclass.user.control.audioWidgetDisable();
                    virtualclass.vutil.disableVirtualClass();
                }
            } else {
                if (virtualclass.gObj.hasOwnProperty('audIntDisable') || virtualclass.gObj.hasOwnProperty('vidIntDisable')) {
                    virtualclass.user.control.audioWidgetDisable();
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
        setContainerWidth: function(res, app) {
            var appId = 'virtualclassWhiteboard';
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

                var rightOffSet = 5;

                var extraWidth = 0;
                var leftSideBarWidth;


                if (app == 'Whiteboard') {
                    leftSideBarWidth = 0;
                } else {
                    var leftSideBar = document.getElementById("virtualclassOptionsCont");
                    if (leftSideBar != null) {
                        var offset = vcan.utility.getElementOffset(leftSideBar);
                        leftSideBarWidth = leftSideBar.offsetWidth + offset.x;
                    } else {
                        leftSideBarWidth = 0;
                    }


                    if (app == 'Yts') {

                        if (roles.hasControls()) {
                            rightOffSet = 60; //youtube wrapper does not have inner div, TODO should be handle by css
                        } else {
                            rightOffSet = 15;
                        }

                    } else if (app == 'SharePresentation') {

                        if(roles.hasControls()){

                            rightOffSet = 50; //youtube wrapper does not have inner div, TODO should be handle by css
                        } else {
                            rightOffSet = 15;
                        }

                    } else if (virtualclass.currApp == 'EditorRich' || virtualclass.currApp == 'EditorCode') {

                        if (leftSideBarWidth > 0) {
                            rightOffSet = 12;
                        } else {
                            if (roles.hasControls()) {
                                leftSideBarWidth = 70;
                            } else {
                                leftSideBarWidth = 5;
                            }

                        }
                    } else if (app == 'ScreenShare') {
                        rightOffSet = 70;
                    } else {
                        rightOffSet = 65;
                    }
                }



                var reduceHeight = 70;
                if (app == 'SharePresentation') {
                    if(document.querySelector('#virtualclass' + app + '.pptSharing') != null){
                        reduceHeight = 120;
                    }
                }

                if (virtualclass.isPlayMode) {
                    reduceHeight += 75;
                }

                var containerHeight = document.getElementById('commandToolsWrapper');
                if (containerHeight != null) {
                    reduceHeight = reduceHeight + containerHeight.clientHeight + 3;
                } else if ((roles.isEducator() || roles.hasControls()) && virtualclass.currApp == 'Whiteboard') {
                    // when page is refresh the toolbar/reclaim bar is not available so
                    reduceHeight = reduceHeight + 46 + 3;

                }


                res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth);
                appCont.style.width = res.width + 'px';
                appCont.style.height = (res.height - reduceHeight) + 'px';

                if (appId == 'virtualclassScreenShare') {
                    //if(appId != 'virtualclassWhiteboard'){
                    var ssType = document.getElementById(appId + 'Local');
                    res.width = res.width - 10;
                    appCont.style.width = res.width;
                    ssType.style.width = res.width + "px";
                    virtualclass.vutil.setScreenInnerTagsWidth(appId);
                }

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
                //document.getElementById(prvTool).className = virtualclass.wb.utility.removeClassFromElement(prvTool, 'active');
                document.getElementById(prvTool).className = virtualclass.vutil.removeClassFromElement(prvTool, 'active');
            } else {

                // If there is remaining any active class on tool
                var appOptions = document.getElementsByClassName('appOptions');
                for(var i=0; i<appOptions.length; i++){
                    if(appOptions[i].classList.contains('active')){
                        appOptions[i].classList.remove('active');
                    }
                }
                console.log('Whiteboard Tool class:- is ' + prvTool + ' with app ' + app);
            }
            document.getElementById(app + "Tool").className += ' active';
        },
        initInstallChromeExt: function(error) {
            if (error.name == 'EXTENSION_UNAVAILABLE') {
                console.log('ask for inline installation');
                //alert('ss' + chrome);
                chrome.webstore.install('https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl',
                        function(arg) {
                            window.location.reload();
                        },
                        function(e) {
                            alert(e);
                        }
                )
            }
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
                virtualclass.wb.obj.drawTextObj.textUtility(virtualclass.wb.gObj.spx, virtualclass.wb.gObj.spy);
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
            var sscWidth = document.getElementById(ssc).offsetWidth + optionsContWidth;
            return (sscWidth == wbcWidth);
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
            virtualclass.chat.idList.length = 0;
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
                virtualclass.gObj.video.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
            }
        },

        beforeLoad: function () {
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

            if (typeof virtualclass.storage.wholeStoreData != 'undefined') {
                var obj = JSON.parse(virtualclass.storage.wholeStoreData);
                obj.beforeRefresh = true;
                virtualclass.storage.wholeStore(obj, "put");
            }

            //   localStorage.setItem('totalStored', virtualclass.storage.totalStored);
            localStorage.setItem('executedSerial', JSON.stringify(ioMissingPackets.executedSerial));
            localStorage.setItem('executedUserSerial', JSON.stringify(ioMissingPackets.executedUserSerial));

            localStorage.removeItem('otherRole');

            //critical, this can be critical

            if (!virtualclass.gObj.hasOwnProperty('audIntDisable')) {
                virtualclass.gObj.video.audio.studentNotSpeak();
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
                prvAppObj.name = "EditorRich"; //not saving screen share but show Editor Rich default window
            } else if ((virtualclass.currApp == 'Yts')) {
                if (typeof virtualclass.yts.videoId != 'undefined' && typeof virtualclass.yts.player == 'object') {
                    prvAppObj.metaData = {
                        'init': virtualclass.yts.videoId,
                        startFrom: virtualclass.yts.player.getCurrentTime()
                    };
                }
            } else if ((virtualclass.currApp == 'SharePresentation')) {

                //virtualclass.sharePt.saveIntoLocalStorage();
                if (typeof virtualclass.sharePt != 'undefined' && typeof virtualclass.sharePt == 'object') {

                    console.log("beforeloadS" + virtualclass.sharePt.pptUrl);
                    prvAppObj.metaData = {
                        'init': virtualclass.sharePt.pptUrl,
                        startFrom: virtualclass.sharePt.state
                    };
                    console.log("start From"+virtualclass.sharePt.state);
                    virtualclass.sharePt.saveIntoLocalStorage(prvAppObj);
                } else {
                    prvAppObj.metaData = null; // if video is not started to share.
                }
            }

            // not storing the YouTube status on student's storage
            // Not showing the youtube video is at student if current app is not youtube
            if (roles.hasView()) {
                if (virtualclass.currApp == 'Yts') {
                    var prvAppObj = {"name": "Yts", "metaData": null};
                }
            }

            localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
            // TODO this should be enable and should test proper way
           // localStorage.setItem('uRole', virtualclass.gObj.uRole);
            io.disconnect();
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
                    virtualclass.wb.utility.setOrginalTeacherContent();
                    virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                }
            } else if (role == 's') {
                vcan.studentId = wbUser.id;

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
                virtualclass.gObj.video.init();
                virtualclass.gObj.video.isInitiator = true;
            }

            vcan.oneExecuted = false;
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
            ////debugger;
            // when we are in replay mode we don't need send the object to other user
            if (msg.hasOwnProperty('createArrow')) {
                var jobj = JSON.stringify(msg);
                virtualclass.wb.vcan.optimize.sendPacketWithOptimization(jobj, io.sock.readyState, 100);
            } else {
                if (msg.hasOwnProperty('repObj')) { // For Whiteboard
                    if (typeof (msg.repObj[msg.repObj.length - 1]) == 'undefined') {
                        return;
                    }
                    virtualclass.wb.gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;
                    virtualclass.wb.gObj.displayedObjId = virtualclass.wb.gObj.rcvdPackId;
                    console.log('Last send data ' + virtualclass.wb.gObj.rcvdPackId);
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

            var iconButton = document.createElement('span');
            iconButton.className = "icon-" + toolName;
            ancTag.appendChild(iconButton);
            ancTag.dataset.title = text;
            ancTag.className = 'tooltip';

            lDiv.appendChild(ancTag);
            if (toolId == 't_reclaim') {
                var virtualclassCont = document.getElementById(virtualclass.html.id);
                cmdToolsWrapper.appendChild(lDiv);
                virtualclassCont.insertBefore(cmdToolsWrapper, virtualclassCont.firstChild);
            } else {
                cmdToolsWrapper.appendChild(lDiv);
            }
        },
        assignRole: function(studentId) {
            if (typeof virtualclass.wb == 'object') {
                virtualclass.wb.tool = "";
                if (vcan.main.action == 'move') {
                    virtualclass.wb.utility.deActiveFrmDragDrop();
                }
            }

            if (typeof studentId != 'undefined') {
                if (roles.isEducator()) {
                    var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
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
                }
                
                virtualclass.gObj.uRole = (!roles.hasAdmin()) ? 's' : 'e';
                
                var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                if (cmdToolsWrapper != null) {
                    while (cmdToolsWrapper.hasChildNodes()) {
                        cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
                    }
                } else {
                    var cmdToolsWrapper = virtualclass.vutil.createCommandWrapper(); // incase of assign role without clicking whiteboard
                }

                if (typeof virtualclass.wb == 'object') {
                    virtualclass.wb.utility.makeCanvasDisable();
                }

                if (roles.hasAdmin()) {
                    var virtualclassCont = document.getElementById('virtualclassCont');
                    virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                    virtualclass.vutil.addClass('virtualclassCont', 'educator');
                } else {
                    virtualclass.vutil.removeClass('virtualclassCont', 'presenter');

                    if (cmdToolsWrapper != null) {
                        cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                    }
                }

                localStorage.setItem('uRole', virtualclass.gObj.uRole); // should be store role student

                if (typeof virtualclass.wb == 'object') {
                    virtualclass.wb.utility.uniqueArrOfObjsToStudent();
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
                if (virtualclass.wb.vcan.main.children.length > 0) {
                    virtualclass.wb.vcan.renderAll();
                }
            }
        },
        createCommandWrapper: function() {
            //alert(virtualclass.system.device);
            var cmdToolsWrapper = document.createElement('div');
            cmdToolsWrapper.id = virtualclass.gObj.commandToolsWrapperId;
            var canvasElem = document.getElementById(vcan.canvasWrapperId);
            if (canvasElem != null) {
                document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
            } else {
                document.getElementById('containerWb').appendChild(cmdToolsWrapper);
            }
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
                    virtualclass.wb.utility.uniqueArrOfObjsToTeacher();
                }

                //create assing button only to student
                if (!roles.hasAdmin()) {
                    virtualclass.vutil.removeSessionTool();   //
                    var divContainer = document.getElementById("ml" + fromUserId);
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
                //virtualclsss.wb._replay.makeCustomEvent(virtualclass.wb.gObj.replayObjs[virtualclass.wb.gObj.replayObjs.length-1]);
                if(typeof virtualclass.wb == 'object'){
                    // if whiteboard is in mid state, vcan.main.action == 'move' means user is doing drag/rotate

                    var currObj = virtualclass.wb.vcan.main.replayObjs[virtualclass.wb.vcan.main.replayObjs.length-1];

                    if(typeof currObj == 'object' && currObj.ac == 'del'){
                        console.log("Delete command:- Transferring the delete command");
                        virtualclass.vutil.beforeSend({'repObj': [currObj], 'cf': 'repObj'});
                    } else if(virtualclass.wb.tool.cmd == 't_text' && virtualclass.wb.vcan.main.action == 'create'){
                        var midReclaim = true;
                        virtualclass.wb.obj.drawTextObj.finalizeTextIfAny(midReclaim);
                        console.log("Text command:- Transferring text command");
                    } else if (((virtualclass.wb.tool.hasOwnProperty('started') && virtualclass.wb.tool.started == true) || virtualclass.wb.vcan.main.action == 'move')){
                        var tempObj = virtualclass.wb.vcan.main.replayObjs[virtualclass.wb.vcan.main.replayObjs.length-1];

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
                var cmdToolsWrapper = virtualclass.vutil.createCommandWrapper();
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
                                console.log('Editor CM is not defined for editor ' + eType);
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
         * This time would be set for delay when user(student) does try for teacher.
         * The time is set according to it's position
         * @param connectedUsers
         * @returns {number}
         */


        getMySetTime : function(connectedUsers){
            for(var i=0; i<connectedUsers.length; i++){
                if(connectedUsers[i].userid == virtualclass.gObj.uid){
                    return (((i+1) * 180 ) + 2000);

                }
            }
            return 2300;
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

        }

    };
    window.vutil = vutil;
})(window);