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
            
//            ab2str : function (buf) {
//                return String.fromCharCode.apply(null, new Int8Array(buf));
//            },
//            
//            str2ab : function (str) {
//                var buf = new ArrayBuffer(str.length); // 2 bytes for each char
//                var bufView = new Int8Array(buf);
//                for (var i=0, strLen=str.length; i<strLen; i++) {
//                  bufView[i] = str.charCodeAt(i);
//                }
//                return bufView;
//            },

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
                
                //rightsidebar
                //var rightOffSet = document.getElementById(vApp.rWidgetConfig.id).offsetWidth;
               // var rightOffSet = 20;
                 var rightOffSet = 20;
                //alert(vApp.wb.utility.getElementRightOffSet);
                
               // var extraWidth = 25;
                var extraWidth = 0;
                var leftSideBar = document.getElementById("vAppOptionsCont");
                
                if(leftSideBar != null){
                    var offset = vcan.utility.getElementOffset(leftSideBar);
                    leftSideBarWidth = leftSideBar.offsetWidth + offset.x;
                }else{
                    leftSideBarWidth = 0;
                }
                
                //res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth + 5) ;
                res.width = res.width - (rightOffSet + leftSideBarWidth + extraWidth) ;
                appCont.style.width = res.width + 'px';
                
                if(appId != 'vAppWhiteboard'){
                    var ssType = document.getElementById(appId + 'Local');
                    ssType.style.width = res.width + "px";
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

                //screenShareLocal.style.marginLeft = (toBeLeft/2) + "px";

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
                    var reloadId = "screenShareReload";
                    var cmdToolsWrapper = document.getElementById("vAppOptionsCont");
                    vApp.html.createDiv("screenShareReloadTool", "reload_ss", cmdToolsWrapper, "appOptions", "vAppScreenShareTool");
                    var reloadTool = document.getElementById("screenShareReloadTool").getElementsByTagName('a')[0];
                    reloadTool.onclick = function (){
                        window.location.reload();
                    }
                    
                    window.open('https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl', '_blank', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1200,height=600, top=250, left = 100');
                }
            }
        }
        window.vutil = vutil;
    }
)(window);