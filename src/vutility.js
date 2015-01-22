/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
    function (window){
        var vutil = {
             createDOM : function (tag, id, _class){
                var elem = document.createElement(tag);
                if(typeof id != 'undefined'){
                    elem.id = id;
                }
                
                if(typeof _class != 'undefined'){
                    var classes = "";
                    if(_class.length > 0){
                        for(var i=0; i<_class.length; i++){
                           classes += _class[i] + " ";
                        }
                     }
                    
                    elem.className = classes;
                }

                return elem;
            },
            
            ab2str : function(buf) {
                return String.fromCharCode.apply(null, new Uint8ClampedArray(buf));
            },
            
            str2ab : function(str) {
               var buf = new ArrayBuffer(str.length); // 2 bytes for each char
               var bufView = new Uint8ClampedArray(buf);
               for (var i=0, strLen=str.length; i<strLen; i++) {
                 bufView[i] = str.charCodeAt(i);
               }
               return bufView;
            },
            
            sidebarHeightInit : function (){
                var sidebar = document.getElementById("widgetRightSide");
                sidebar.style.height = (window.innerHeight) + "px";
            },
            
             isSystemCompatible: function() {
                if (window.vApp.error.length > 0) {
                    for (var i = 0; i < window.vApp.error.length; i++) {
                        var error = window.vApp.error[i];
                        if (error.hasOwnProperty('msg')) {
                            vApp.wb.view.displayMessage(error.msg, error.id, error.className);
                        }
                    }
                }
            },
            
            chkValueInLocalStorage : function(property) {
                if (localStorage.getItem(property) === null) {
                    return false;
                } else {
                    return localStorage[property];
                }
            },
            
            setContainerWidth : function (res){
                var appId = 'vAppWhiteboard';
                if(typeof vApp.previous != 'undefined'){
                   appId = vApp.previous;
                }
                
                var appCont = document.getElementById(appId);
                var rightOffSet = 5;
                
                var extraWidth = 0;
                
                if(vApp.currApp == 'ScreenShare'){
                    var leftSideBar = document.getElementById("vAppOptionsCont");
                    if(leftSideBar != null){
                        var offset = vcan.utility.getElementOffset(leftSideBar);
                        leftSideBarWidth = leftSideBar.offsetWidth + offset.x;
                    }else{
                        leftSideBarWidth = 0;
                    }
                }else{
                    leftSideBarWidth = 0;
                }
                
                //res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth + 5) ;
                res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth) ;
                appCont.style.width = res.width + 'px';
                
                if(appId != 'vAppWhiteboard'){
                    var ssType = document.getElementById(appId + 'Local');
                    res.width = res.width - 10;
                    appCont.style.width = res.width;
                    ssType.style.width = res.width  + "px";
                    vApp.vutil.setScreenInnerTagsWidth(appId);
                }
            },
            
            setScreenInnerTagsWidth : function(currAppId){
                var sId = currAppId;
                var screenShare = document.getElementById(sId);
                var screenShareWidth = screenShare.offsetWidth;
                var screenShareLocal  = document.getElementById(sId + "Local");
                var screenShareLocalWidth = screenShareLocal.offsetWidth;
                var toBeLeft  = screenShareWidth-screenShareLocalWidth;

                var screenShareLocalVideo = document.getElementById(sId+"LocalVideo");
                var screenShareLocalVideoWidth = screenShareLocalVideo.offsetWidth;

                var screenShareLocalVideoWidth = screenShareLocalWidth - screenShareLocalVideoWidth
                //screenShareLocalVideo.style.marginLeft = (screenShareLocalVideoWidth/2) + "px";
            }, 
            
            makeActiveApp : function (app, prvTool){
                if(typeof prvTool != 'undefined'){
                     var prvTool = prvTool+'Tool';
                     var classes = vApp.wb.utility.removeClassFromElement(prvTool, 'active');
                     document.getElementById(prvTool).className = classes;
                 }
                 
                document.getElementById(app + "Tool").className += ' active';
                 
            },
            
            
            initInstallChromeExt : function(error){
                if(error.name == 'EXTENSION_UNAVAILABLE'){
                    console.log('ask for inline installation');
                    //alert('ss' + chrome);
                    chrome.webstore.install('https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl',
                        function (arg) {
                            window.location.reload();
                        },
                        function (e){
                            alert(e);
                        }
                    )
                }
            },
            
            removeAppPanel : function (){
                var appPanel = document.getElementById('vAppOptionsCont');
                if(appPanel != null){
                    appPanel.parentNode.removeChild(appPanel);
                }
            },
            
            
            removeTempVideo : function (id){
                var toBeRemove = document.getElementById(id);
                toBeRemove.parentNode.removeChild(toBeRemove)
            },
            
             createLocalTempVideo : function (mainCont, localTemp){
                if(typeof mainCont == "string" || typeof mainCont == "String"){
                    mainCont = document.getElementById(mainCont);
                }
                //var mainCont = document.getElementById(mcId);
                
                var locVidContTemp =  vApp.vutil.createDOM("div", localTemp);
                var vidContTemp =  vApp.vutil.createDOM("canvas", localTemp+"Video");
                locVidContTemp.appendChild(vidContTemp);
                mainCont.appendChild(locVidContTemp);
            },
            
            initLocCanvasCont : function (tempVideoId){
                if(vApp.currApp == "ScreenShare"){
                    var app = 'ss';
                }else{
                    var app = 'wss';
                }
                
                vApp[app].localtempCanvas = document.getElementById(tempVideoId);
                vApp[app].localtempCont =  vApp[app].localtempCanvas.getContext('2d');
            },
            
            videoTeacher2Student : function (sid, notPutImage){
                //vAppScreenShareLocalVideo
                var app = sid;
                var id = "vApp" + sid + "LocalVideo";
                
                
                var localVideo = document.getElementById(id);
                
                if(localVideo !=  null && localVideo.tagName == "VIDEO"){
                //    alert('this would not performed');
                    var stCanvas = document.createElement('canvas');
                    stCanvas.id =  localVideo.id;
                    stCanvas.width = localVideo.offsetWidth;
                    stCanvas.height = localVideo.offsetHeight;
                    
                    var tempVid = localVideo;
                    localVideo.parentNode.replaceChild(stCanvas, localVideo);
                    var app;
                    if(app  == 'ScreenShare'){
                        app = "ss";
                    }else if(app  == 'WholeScreenShare'){
                        app = "wss";
                    }
                    
                    if(typeof notPutImage == 'undefined' && (typeof app != 'undefined' && (app == 'ss' || app == 'wss'))){
                        vApp[app].localCanvas = stCanvas;
                        vApp[app].localCont =  vApp[app].localCanvas.getContext('2d');

                        var imgData = vApp[app].localtempCont.getImageData(0, 0, vApp[app].localtempCanvas.width, vApp[app].localtempCanvas.height);
                        vApp[app].localCont.putImageData(imgData, 0, 0);
                    }
                    
                    //vApp.localtempCont.drawImage(tempVid, 0, 0, tempVid.offsetWidth, tempVid.offsetHeight);
                    vApp.vutil.removeTempVideo("vApp" + sid+"LocalTemp");
                }
            },
            
            createSlienceDetect : function (){
                var appOptCont = document.getElementById('vAppOptionsCont');
                vApp.html.createDiv("vAppSlienceDetectTool", "silencedetect", appOptCont, 'appOptions');
            },
            
            clickOutSideCanvas : function (){
                if(this.exitTextWrapper()){
                    vApp.wb.obj.drawTextObj.textUtility(vApp.wb.gObj.spx, vApp.wb.gObj.spy);
                }
            },
            
            exitTextWrapper : function (){
                var textBoxContainer = document.getElementsByClassName('textBoxContainer');
                return textBoxContainer.length > 0 ? true : false;
            },
            
            attachClickOutSideCanvas :function(){
                _attachClickOutSideCanvas('commandToolsWrapper');
                _attachClickOutSideCanvas('vAppOptionsCont');
                _attachClickOutSideCanvas('audioWidget');
                _attachClickOutSideCanvas('chatWidget');

                function _attachClickOutSideCanvas(id){
                    var elem = document.getElementById(id);
                    if(elem != null){
                        elem.onclick = function (){vApp.vutil.clickOutSideCanvas();};
                    }
                }
            },
            
            dimensionMatch : function (wbc, ssc){
                var wbcWidth  = document.getElementById(wbc).offsetWidth;
                var optionsContWidth = document.getElementById("vAppOptionsCont").offsetWidth;
                var sscWidth = document.getElementById(ssc).offsetWidth + optionsContWidth;
                return (sscWidth == wbcWidth) ? true : false;
            },
            
             disableAppsBar : function (){
                var appBarCont = document.getElementById('vAppOptionsCont');
                if(appBarCont !=  null){
                    appBarCont.style.pointerEvents = "none";
                }
            },
            
            isMiniFileIncluded :  function (src){
                var filePatt = new RegExp(src+".js$");
                var scripts = document.getElementsByTagName("script");
                for(var i = 0; i < scripts.length; i++) {
                    if(filePatt.test(scripts[i].src)){
                        return true;
                    }
                }
                return false;
            },
            
            clearAllChat : function (){
                sessionStorage.clear('chatroom'); //all 
                //idList = [];
                idList.length = 0;
                clearAllChatBox();
                
                var allChat = document.getElementById("chatWidget").getElementsByClassName('ui-chatbox-msg');
                if(allChat.length > 0){
                    while(allChat[0] != null ){
                        allChat[0].parentNode.removeChild(allChat[0]);
                    }
                }
            },
            
            isObjectEmpty : function(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return true;
            },
            
            removeSessionTool : function (){
                if(localStorage.getItem('orginalTeacherId') ==  null){
                    var SessionEndTool = document.getElementById("vAppSessionEndTool");
                    if(SessionEndTool != null){
                        SessionEndTool.parentNode.removeChild(SessionEndTool);
                    } 
                }
            },
            
            toggleRoleClass : function (reclaim){
                if((localStorage.getItem('teacherId') != null && localStorage.getItem('orginalTeacherId') == null) || reclaim){
                    document.getElementById("vAppCont").classList.toggle('teacher');
                    document.getElementById("vAppCont").classList.toggle('student');
                }
            },
            
            addClass : function (elemId, className){
                var elem = document.getElementById(elemId);
                if(elem.hasOwnProperty('classList')){
                    elem.classList.add(className);
                }else{
                    elem.className = className;
                }
            },
            
            removeClass : function (id,  className){
                var elem = document.getElementById(id);
                if(elem.hasOwnProperty('classList') && elem.classList.contains(className)){
                    elem.classList.remove(className);
                }
            },
            
            breakIntoBytes : function (val,l){
                var numstring = val.toString();
                for (var i = numstring.length; i < l; i++) {
                    numstring = '0' + numstring;
                }
                var parts = numstring.match(/[\S]{1,2}/g) || [];
                return parts;
            }
        }
        
        window.vutil = vutil;
        window.onbeforeunload = function() {
            //if(typeof window.wholeStoreData != 'undefined'){
            if(typeof vApp.storage.wholeStoreData != 'undefined'){
                var obj = JSON.parse(vApp.storage.wholeStoreData);
                obj.beforeRefresh = true;
                //vApp.storage.wholeStore(JSON.stringify(obj), "put");
                vApp.storage.wholeStore(obj, "put");
            }
            
            localStorage.removeItem('otherRole');
            vApp.wb.utility.userIds = [];
            
            vApp.gObj.video.audio.studentNotSpeak();
            vApp.vutil.clickOutSideCanvas();
            
            //var data = JSON.stringify(vmstorage);
            if(!vApp.vutil.isObjectEmpty(vmstorage)){
                localStorage.setItem(wbUser.sid, JSON.stringify(vmstorage));
            }
          
//            var data = JSON.stringify(vmstorage);
         //   localStorage.setItem(wbUser.sid, JSON.stringify(vmstorage))
            cthis.sendMessage('bye');
            io.disconnect();
        }
    }
)(window);
