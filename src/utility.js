/** To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*  * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (window) {
    "use strict";
    var vutil = {
        createDOM: function (tag, id, _class) {
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

        ab2str: function (buf) {
            return String.fromCharCode.apply(null, new Uint8ClampedArray(buf));
        },

        str2ab: function (str) {
            var buf = new ArrayBuffer(str.length); // 2 bytes for each char
            var bufView = new Uint8ClampedArray(buf);
            for (var i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return bufView;
        },

        sidebarHeightInit: function () {
            var sidebar = document.getElementById("widgetRightSide");
            sidebar.style.height = (window.innerHeight) + "px";
        },

        //there function name should be change
        isSystemCompatible: function () {
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

        chkValueInLocalStorage: function (property) {
            if (localStorage.getItem(property) === null) {
                return false;
            } else {
                return localStorage[property];
            }
        },

        setContainerWidth: function (res, app) {
            var appId = 'virtualclassWhiteboard';
            if (typeof virtualclass.previous != 'undefined') {

                if('virtualclass'+app != virtualclass.previous){
                    appId = 'virtualclass'+app;
                } else {
                    appId = virtualclass.previous;
                }
                //  appId = virtualclass.previous;
            }

            var appName = appId.split('virtualclass')[1];

            appId = 'virtualclass' + virtualclass.vutil.capitalizeFirstLetter(appName);

            var appCont = document.getElementById(appId);
            var rightOffSet = 5;

            var extraWidth = 0;
            var leftSideBarWidth;


            if(app == 'Whiteboard'){
                leftSideBarWidth = 0;
            }else{
                var leftSideBar = document.getElementById("virtualclassOptionsCont");
                if (leftSideBar != null) {
                    var offset = vcan.utility.getElementOffset(leftSideBar);
                    leftSideBarWidth = leftSideBar.offsetWidth + offset.x;
                } else {
                    leftSideBarWidth = 0;
                }


                if(app == 'Yts'){
                    rightOffSet = 75; //youtube wrapper does not have inner div, TODO should be handle by css
                } else if (virtualclass.currApp == 'EditorRich' ||  virtualclass.currApp == 'EditorCode') {
                    if(leftSideBarWidth > 0){
                        rightOffSet = 12;
                    } else {
                        alert(virtualclass.gObj.uRole +'s')
                        if(virtualclass.gObj.uRole == 't'){
                            leftSideBarWidth = 70;
                        }else {
                            leftSideBarWidth = 5;
                        }

                    }
                } else if(app == 'ScreenShare'){
                    rightOffSet = 70;
                } else {
                    rightOffSet = 65;
                }
            }

            var reduceHeight = 70;

            var containerHeight = document.getElementById('commandToolsWrapper');
            if(containerHeight != null){
                reduceHeight =  reduceHeight + containerHeight.clientHeight + 3;
            }


            res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth);
            appCont.style.width = res.width + 'px';
            appCont.style.height = (res.height - reduceHeight)  + 'px';

            if (appId == 'virtualclassScreenShare') {
                //if(appId != 'virtualclassWhiteboard'){
                var ssType = document.getElementById(appId + 'Local');
                res.width = res.width - 10;
                appCont.style.width = res.width;
                ssType.style.width = res.width + "px";
                virtualclass.vutil.setScreenInnerTagsWidth(appId);
            }
        },

        setScreenInnerTagsWidth: function (currAppId) {
            var sId = currAppId;
            var screenShare = document.getElementById(sId);
            var screenShareWidth = screenShare.offsetWidth;
            var screenShareLocal = document.getElementById(sId + "Local");
            var screenShareLocalWidth = screenShareLocal.offsetWidth;
            var toBeLeft = screenShareWidth - screenShareLocalWidth;

            var screenShareLocalVideo = document.getElementById(sId + "LocalVideo");
            var screenShareLocalVideoWidth = screenShareLocalVideo.offsetWidth;
            screenShareLocalVideoWidth = screenShareLocalWidth - screenShareLocalVideoWidth;
            //screenShareLocalVideo.style.marginLeft = (screenShareLocalVideoWidth/2) + "px";
        },

        makeActiveApp: function (app, prvTool) {
            if (app != prvTool && typeof prvTool != 'undefined') {
                prvTool = prvTool + 'Tool';
                //document.getElementById(prvTool).className = virtualclass.wb.utility.removeClassFromElement(prvTool, 'active');
                document.getElementById(prvTool).className = virtualclass.vutil.removeClassFromElement(prvTool, 'active');
            }
            document.getElementById(app + "Tool").className += ' active';

        },

        initInstallChromeExt: function (error) {
            if (error.name == 'EXTENSION_UNAVAILABLE') {
                console.log('ask for inline installation');
                //alert('ss' + chrome);
                chrome.webstore.install('https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl',
                    function (arg) {
                        window.location.reload();
                    },
                    function (e) {
                        alert(e);
                    }
                )
            }
        },

        removeAppPanel: function () {
            var appPanel = document.getElementById('virtualclassOptionsCont');
            if (appPanel != null) {
                appPanel.parentNode.removeChild(appPanel);
            }
        },

        removeTempVideo: function (id) {
            var toBeRemove = document.getElementById(id);
            toBeRemove.parentNode.removeChild(toBeRemove)
        },

        createLocalTempVideo: function (mainCont, localTemp) {
            if (typeof mainCont == "string" || typeof mainCont == "String") {
                mainCont = document.getElementById(mainCont);
            }
            //var mainCont = document.getElementById(mcId);
            var locVidContTemp = virtualclass.vutil.createDOM("div", localTemp);
            var vidContTemp = virtualclass.vutil.createDOM("canvas", localTemp + "Video");
            locVidContTemp.appendChild(vidContTemp);
            mainCont.appendChild(locVidContTemp);
        },

        initLocCanvasCont: function (tempVideoId) {
            var app;
            if (virtualclass.currApp == "ScreenShare") {
                app = 'ss';
            } else {
                app = 'wss';
            }

            virtualclass[app].localtempCanvas = document.getElementById(tempVideoId);
            virtualclass[app].localtempCont = virtualclass[app].localtempCanvas.getContext('2d');
        },

        videoTeacher2Student: function (sid, notPutImage) {
            //virtualclassScreenShareLocalVideo
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

                //virtualclass.localtempCont.drawImage(tempVid, 0, 0, tempVid.offsetWidth, tempVid.offsetHeight);
                virtualclass.vutil.removeTempVideo("virtualclass" + sid + "LocalTemp");
            }
        },

        clickOutSideCanvas: function () {
            if (this.exitTextWrapper()) {
                virtualclass.wb.obj.drawTextObj.textUtility(virtualclass.wb.gObj.spx, virtualclass.wb.gObj.spy);
            }
        },

        exitTextWrapper: function () {
            var textBoxContainer = document.getElementsByClassName('textBoxContainer');
            return textBoxContainer.length > 0;
        },

        attachClickOutSideCanvas: function () {
            _attachClickOutSideCanvas('commandToolsWrapper');
            _attachClickOutSideCanvas('virtualclassOptionsCont');
            _attachClickOutSideCanvas('audioWidget');
            _attachClickOutSideCanvas('chatWidget');

            function _attachClickOutSideCanvas(id) {
                var elem = document.getElementById(id);
                if (elem != null) {
                    elem.onclick = function () {
                        virtualclass.vutil.clickOutSideCanvas();
                    };
                }
            }
        },

        dimensionMatch: function (wbc, ssc) {
            var wbcWidth = document.getElementById(wbc).offsetWidth;
            var optionsContWidth = document.getElementById("virtualclassOptionsCont").offsetWidth;
            var sscWidth = document.getElementById(ssc).offsetWidth + optionsContWidth;
            return (sscWidth == wbcWidth);
        },

        disableAppsBar: function () {
            var appBarCont = document.getElementById('virtualclassOptionsCont');
            if (appBarCont != null) {
                appBarCont.style.pointerEvents = "none";
            }
        },

        isMiniFileIncluded: function (src) {
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

        clearAllChat: function () {
            localStorage.removeItem(virtualclass.gObj.uid); //remove chat about user
            sessionStorage.clear('chatroom'); //all
            //idList = [];
//                idList.length = 0;
            virtualclass.chat.idList.length = 0;
            clearAllChatBox();

            var allChat = document.getElementById("chatWidget").getElementsByClassName('ui-chatbox-msg');
            if (allChat.length > 0) {
                while (allChat[0] != null) {
                    allChat[0].parentNode.removeChild(allChat[0]);
                }
            }
        },

        isObjectEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        removeSessionTool: function () {
            if (localStorage.getItem('orginalTeacherId') == null) {
                var SessionEndTool = document.getElementById("virtualclassSessionEndTool");
                if (SessionEndTool != null) {
                    SessionEndTool.parentNode.removeChild(SessionEndTool);
                }
            }
        },

        toggleRoleClass: function (reclaim) {
            if ((localStorage.getItem('teacherId') != null && localStorage.getItem('orginalTeacherId') == null) || reclaim) {
                document.getElementById("virtualclassCont").classList.toggle('teacher');
                document.getElementById("virtualclassCont").classList.toggle('student');
            }
        },

        addClass: function (elemId, className) {
            var elem = document.getElementById(elemId);
//                if(elem.hasOwnProperty('classList')){
            if (virtualclass.vutil.elemHasAnyClass(elemId)) {
                elem.classList.add(className);
            } else {
                elem.className = className;
            }
        },

        removeClass: function (id, className) {
            var elem = document.getElementById(id);

            if (virtualclass.vutil.elemHasAnyClass(id) && elem.classList.contains(className)) {
                elem.classList.remove(className);
            }
        },

        breakIntoBytes: function (val, l) {
            var numstring = val.toString();
            for (var i = numstring.length; i < l; i++) {
                numstring = '0' + numstring;
            }
            return numstring.match(/[\S]{1,2}/g) || [];
        },

        numValidateFour: function (n1, n2, n3, n4) {
            n1 = this.preNumValidateTwo(n1);
            n2 = this.preNumValidateTwo(n2);
            n3 = this.preNumValidateTwo(n3);
            n4 = this.preNumValidateTwo(n4);
            var nres = n1 + n2 + n3 + n4;
            return parseInt(nres);
        },

        numValidateTwo: function (n1, n2) {
            n1 = this.preNumValidateTwo(n1);
            n2 = this.preNumValidateTwo(n2);
            var nres = n1 + n2;
            return parseInt(nres);
        },

        preNumValidateTwo: function (n) {
            var numstring = n.toString();
            if (numstring.length == 1) {
                return '0' + numstring;
            } else if (numstring.length == 2) {
                return numstring;
            }
        },

        elemHasAnyClass: function (elemId) {
            var elem = document.getElementById(elemId);
            if (elem != null) {
                return (typeof elem.classList != 'undefined');
            }
            return false;
        },

        userIsOrginalTeacher: function (userId) {
            return localStorage.getItem('orginalTeacherId') != null;
        },

        isUserTeacher: function (userId) {
            return localStorage.getItem('teacherId') != null;
        },

        initDisableAudVid: function () {
            virtualclass.gObj.audIntDisable = true;
            virtualclass.gObj.vidIntDisable = true;
        },

        initDisableVirtualClass: function () {
            this.initDisableAudVid();
            virtualclass.gObj.errNotDesktop = true;
            virtualclass.gObj.errNotScreenShare = true;
            virtualclass.gObj.errAppBar = true;
        },

        disableVirtualClass: function () {
            var virtualClass = document.getElementById('virtualclassCont');
            virtualClass.style.opacity = 0.6;
            virtualClass.style.pointerEvents = "none";
            //document.getElementById('commandToolsWrapper').style.poniterEvents =   'none';

        },

        enableVirtualClass: function () {
            var virtualClass = document.getElementById('virtualclassCont');
            virtualClass.style.opacity = 1;
            virtualClass.style.pointerEvents = "visible";

        },

        firstiOSaudioCall: function () {
            if (virtualclass.gObj.hasOwnProperty('audioPlayMessage')) {
                //virtualclass.gObj.iosTabAudTrue = true;
                virtualclass.gObj.iosIpadbAudTrue = true;
                virtualclass.gObj.video.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
            }
        },

        beforeLoad: function () {
            if (typeof virtualclass.storage.wholeStoreData != 'undefined') {
                var obj = JSON.parse(virtualclass.storage.wholeStoreData);
                obj.beforeRefresh = true;
                virtualclass.storage.wholeStore(obj, "put");
            }

            localStorage.setItem('totalStored', virtualclass.storage.totalStored);

            localStorage.removeItem('otherRole');

            //critical, this can be critical

            //virtualclass.wb.utility.userIds = [];

            if (!virtualclass.gObj.hasOwnProperty('audIntDisable')) {
                virtualclass.gObj.video.audio.studentNotSpeak();
            }

            virtualclass.vutil.clickOutSideCanvas();
            localStorage.setItem(wbUser.sid, JSON.stringify(virtualclass.chat.vmstorage));

            if(virtualclass.hasOwnProperty('editorRich')){
                if(typeof virtualclass.editorRich.vcAdapter == 'object'){
                    virtualclass.editorRich.saveIntoLocalStorage();
                }
            }

            if(virtualclass.hasOwnProperty('editorCode')){
                if(typeof virtualclass.editorCode.vcAdapter == 'object'){
                    virtualclass.editorCode.saveIntoLocalStorage();
                }
            }

            var prvAppObj = {name : virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp)};

            if(virtualclass.currApp == 'ScreenShare'){
                prvAppObj.name = "EditorRich"; //not saving screen share but show Editor Rich default window
            }else if((virtualclass.currApp == 'Yts')){
                prvAppObj.metaData = {'init' : virtualclass.yts.videoId, startFrom : virtualclass.yts.player.getCurrentTime()};
            }

            // not storing the YouTube status on student's storage
            // Not showing the youtube video is at student if current app is not youtube
            if(virtualclass.gObj.uRole == 's' ){
                if(virtualclass.currApp != 'Yts'){
                    localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
                }
            }else {
                localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
            }

            //editor data save when page is being refreshed
            //if((typeof virtualclass.editorRich.vcAdapter == 'object' && virtualclass.editorRich.vcAdapter.operations.length > 0)){
            //    var wrappedOperations = virtualclass.editorRich.getWrappedOperations();
            //    localStorage.removeItem('allEditorOperations');
            //    localStorage.setItem('allEditorOperations',  JSON.stringify(wrappedOperations));
            //    localStorage.setItem('edOperationRev',  virtualclass.editorRich.cmClient.revision);
            //
            //}
            //
            io.disconnect();
        },

        initOnBeforeUnload: function (bname) {
            if (bname == 'iOS') {
                document.body.onunload = function () {
                    virtualclass.vutil.beforeLoad();
                }
            } else {
                window.onbeforeunload = function () {
                    virtualclass.vutil.beforeLoad();
                }
            }
        },

        isPlayMode: function () {
            return (window.wbUser.virtualclassPlay == true);
        },

        progressBar: function (totalVal, portion, pbar, pval) {
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

        hidePrevIcon: function (app) {
            var prvScreen = document.getElementById(virtualclass.previous);
            if (prvScreen != null) {
                prvScreen.style.display = 'none';
                document.getElementById(virtualclass[app].id).style.display = 'block';
            }
        },

        /**
         * Return the value of provided key of particular user from prvovided user list
         * @param users user list
         * @param key kew of which return value
         * @param userId the user
         */
        getUserInfo : function (key, userId, users){
            for(var i=0; i<users.length; i++){
                if(users[i].userid == userId){
                    return users[i][key];
                }
            }
        },

        smallizeFirstLetter : function (string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        },

        capitalizeFirstLetter : function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },


        initDefaultInfo: function (role, appIs) {
            if (role == 't'  && appIs == 'Whiteboard') {
                if (localStorage.getItem('orginalTeacherId') == null) {
                    virtualclass.wb.utility.setOrginalTeacherContent();
                    virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                }
                //} else if (role == 's' && newuser == null) {
            } else if (role == 's') {
                vcan.studentId = wbUser.id;

                if (localStorage.getItem('studentId') == null && localStorage.getItem('teacherId') == null) {
                    localStorage.setItem('studentId', wbUser.id);
                }
                virtualclass.vutil.removeSessionTool();
            }

            if (!virtualclass.gObj.hasOwnProperty('audIntDisable') && !virtualclass.gObj.hasOwnProperty('vidIntDisable')) {
                virtualclass.gObj.video.init();
                virtualclass.gObj.video.isInitiator = true;
            }
            //bad way
//                    virtualclass.gObj.video.init();
//                    virtualclass.gObj.video.isInitiator = true;
            vcan.oneExecuted = false;
        },

        removeClassFromElement: function (prvTool, className) {
            if (prvTool != "t_reclaim") {
                var prvTool = document.getElementById(prvTool).className;
                var classes = prvTool.split(" ");
                var retClass = [];
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i] != className) {
                        retClass.push(classes[i]);
                    }
                }
                if (retClass.length > 1) {
                    return retClass.join(" ");
                } else {
                    return retClass[0];
                }
            }
        },

        /**
         * the operation before send message to server
         * @param {type} msg
         * @returns {undefined}
         */
        beforeSend: function (msg, toUser) {
            // when we are in replay mode we don't need send the object to other user
            if (msg.hasOwnProperty('createArrow')) {
                var jobj = JSON.stringify(msg);
                virtualclass.wb.vcan.optimize.sendPacketWithOptimization(jobj, io.sock.readyState, 100);
            } else {
                if (msg.hasOwnProperty('repObj')) {
                    if (typeof (msg.repObj[msg.repObj.length - 1]) == 'undefined') {
                        return;
                    }
                    virtualclass.wb.gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;
                    virtualclass.wb.gObj.displayedObjId = virtualclass.wb.gObj.rcvdPackId;
                }
                var jobj = JSON.stringify(msg);

                if(typeof virtualclass.wb == 'object'){
                    virtualclass.wb.sentPackets = virtualclass.wb.sentPackets + jobj.length;
                }

                if (io.sock != null && io.sock.readyState == 1) {
                    typeof toUser == 'undefined' ? io.send(msg) : io.send(msg, toUser);
                }

                //TODO this should be enable
                var tempObj = JSON.parse(jobj);
                if (tempObj.hasOwnProperty('repObj')) {
                    virtualclass.wb.utility.updateSentInformation(jobj);
                }
            }
            localStorage.sentPackets = virtualclass.wb.sentPackets;
        },

        breakintobytes : function (val, l){
            var numstring = val.toString();
            for (var i = numstring.length; i < l; i++) {
                numstring = '0' + numstring;
            }
            var parts = numstring.match(/[\S]{1,2}/g) || [];
            return parts;
        },

        setOrginalTeacher : function (){
            if(localStorage.getItem('reclaim') ==  null){
                localStorage.setItem('teacherId', virtualclass.gObj.uid);

            }
            localStorage.setItem('orginalTeacherId', virtualclass.gObj.uid);
        },


        createReclaimButton: function (cmdToolsWrapper) {

            this.createDiv('t_reclaim', 'reclaim', cmdToolsWrapper);
            var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
            var that = this;
            aTags[0].addEventListener('click', function (){
                that._reclaimRole();
                //virtualclass.wb.objInit();
            });
        },

        /**
         * this function does create the div
         * toolId expect id for command
         * text expects the text used for particular command
         * this whole output process should come by
         * html not javascript
         */
        createDiv: function (toolId, text, cmdToolsWrapper, cmdClass) {
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
//
//                    ancTag.appendChild(imgTag);
//                    ancTag.innerHTML = "&nbsp;";
            //ancTag.innerHTML = text;
            //ancTag.title = '';
            ancTag.dataset.title = text;
            ancTag.className = 'tooltip';
//                    ancTag.className = 'tooltip ' + "icon-" +toolName;

            lDiv.appendChild(ancTag);

            if (toolId == 't_reclaim') {
                var virtualclassCont = document.getElementById(virtualclass.html.id);
                cmdToolsWrapper.appendChild(lDiv);
                virtualclassCont.insertBefore(cmdToolsWrapper, virtualclassCont.firstChild);

            } else {
                cmdToolsWrapper.appendChild(lDiv);
            }
        },

        assignRole: function (studentId) {
            if(typeof virtualclass.wb == 'object'){
                virtualclass.wb.tool = "";
                if (vcan.main.action == 'move') {
                    virtualclass.wb.utility.deActiveFrmDragDrop();
                }
            }

            if (typeof studentId != 'undefined') {
                if (localStorage.getItem('reclaim') != null) {
                    var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                    cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
                    localStorage.removeItem('reclaim');
                    virtualclass.vutil.removeClass('virtualclassCont', 'reclaim');

                } else {
                    virtualclass.vutil.addClass('virtualclassCont', 'assign');
                    virtualclass.vutil.removeClass('virtualclassCont', 'removedAssign')
                }

                localStorage.removeItem('studentId');
                localStorage.setItem('teacherId', studentId);

                virtualclass.gObj.uRole = 't';

                virtualclass.user.assignRole(virtualclass.gObj.uRole, virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp));

                if(typeof virtualclass.wb == 'object'){
                    vcan.utility.canvasCalcOffset(vcan.main.canid);
                }

                if (virtualclass.currApp == 'Yts') {
                    var virtualclassYts = document.getElementById('virtualclassYts');
                    if(virtualclassYts != null){
                        if(document.getElementById('player') == null){
                            virtualclass.yts.UI.createPlayerTag(virtualclassYts);
                        }
                    } else {
                        virtualclass.yts.UI.container();
                    }

                    virtualclass.yts.UI.inputURL();
                    virtualclass.yts.seekChangeInterval();
                }
                virtualclass.system.setAppDimension();
            } else {
                if (virtualclass.currApp == 'Yts') {
                    virtualclass.yts.UI.removeinputURL();
                    if (virtualclass.yts.hasOwnProperty('tsc')) {
                        clearInterval(virtualclass.yts.tsc);
                    }
                }


                virtualclass.gObj.uRole = 's';
                var cmdToolsWrapper = document.getElementById(virtualclass.gObj.commandToolsWrapperId);
                if (cmdToolsWrapper != null) {
                    while (cmdToolsWrapper.hasChildNodes()) {
                        cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
                    }
                } else {
                    var cmdToolsWrapper =  virtualclass.vutil.createCommandWrapper(); // incase of assign role without clicking whiteboard
                }

                if(typeof virtualclass.wb == 'object'){
                    virtualclass.wb.utility.makeCanvasDisable();
                }

                if (typeof localStorage.orginalTeacherId != 'undefined') {
                    var virtualclassCont = document.getElementById('virtualclassCont');
                    virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                    //localStorage.reclaim = true;
                    localStorage.setItem('reclaim', true);


                    virtualclass.vutil.addClass('virtualclassCont', 'reclaim');

                } else {

                    virtualclass.vutil.removeClass('virtualclassCont', 'assign');
                    virtualclass.vutil.addClass('virtualclassCont', 'removedAssign'); //TODO this is tricky handle by better way

                    if (cmdToolsWrapper != null) {
                        cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);

                    }

                    //var virtualclassCont = document.getElementById('virtualclassCont');

                }

                var tid = localStorage.getItem('teacherId');
                localStorage.removeItem('teacherId');
                localStorage.setItem('studentId', tid);

                if(typeof virtualclass.wb == 'object'){
                    virtualclass.wb.utility.uniqueArrOfObjsToStudent();
                }
                virtualclass.system.setAppDimension();
            }

            //if (localStorage.getItem('orginalTeacherId') == null) {
            virtualclass.vutil.toggleRoleClass(true);
            //}


        },
        createCommandWrapper: function () {
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
            this.reclaimRole();
            //virtualclass.wb.utility.sendRequest('reclaimRole', true);
            virtualclass.vutil.beforeSend({'reclaimRole': true})
            virtualclass.user.control.changeAttrToAssign('enable');
        },

        reclaimRole: function () {
            virtualclass.gObj.controlAssign = false;
            this.vcResponseAssignRole(virtualclass.gObj.uid, virtualclass.gObj.uid, true);
        },

        //equivalent to response.assignRole from receive-messages-response.js//equivalen
        vcResponseAssignRole : function (fromUserId, id, reclaim) {
            if (fromUserId != id || typeof reclaim != 'undefined') {
                virtualclass.vutil.assignRole(id);
                if(typeof virtualclass.wb == 'object'){
                    virtualclass.wb.utility.uniqueArrOfObjsToTeacher();
                }

                //create assing button only to student
                if (localStorage.getItem('orginalTeacherId') == null) {
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
            if (formUserId != id) {

                virtualclass.user.control._assign(id, 'notsent', formUserId);

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

        createReclaimButtonIfNeed : function (){
            if (virtualclass.vutil.chkValueInLocalStorage('reclaim') && virtualclass.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                var cmdToolsWrapper = virtualclass.vutil.createCommandWrapper();
                virtualclass.vutil.createReclaimButton(cmdToolsWrapper);
                virtualclass.gObj.uRole = 's';
                return true;
            }
            return false;
        }
    };
    window.vutil = vutil;
})(window);
