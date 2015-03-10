// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var system = {
            init : function (){
                this.wbRtc = {};
                this.wbRtc.className = 'webrtcCont';
                this.mybrowser = {};
                return this;
            },
            
            
//            isCanvasSupport : function(navigator, browserName, version) {
//                if (browserName == 'MSIE') {
////                    if (version != 9) {
////                        alert(canvas);
////                        
////                        //TODO there should be some good method to check exisitence of canvas element in IE browsers
////                        //vApp.error.push({'msg': vApp.lang.getString('notSupportCanvas'), 'id': 'errorCanvas', 'className': 'error'});
////                    }
////                    this.canvas = true;
//                    this.canvas = (version != 9) ? false : true;
//                } else {
//                   this.canvas = (!window.CanvasRenderingContext2D) ? false : true;
//                }
//            },
            
//            isWebRtcSupport : function(navigator, browser, version) {
//                if (browser == 'Firefox') {
//                    if (navigator.mozGetUserMedia) {
//                        this.wbRtc.userMedia = true;
//                        if (!window.mozRTCPeerConnection) {
//                            vApp.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
//                        } else {
//                            this.wbRtc.peerCon = true;
//                        }
//                    } else {
//                            this.wbRtc.peerCon = false;
////                        vApp.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
//                    }
//                } else if (browser == 'Chrome' || browser == 'Safari') {
//                    if (navigator.webkitGetUserMedia) {
//                        this.wbRtc.userMedia = true;
//                        if (!window.webkitRTCPeerConnection) {
//                            vApp.error.push({'msg': vApp.lang.getString('notSupportPeerConnect'), 'id': 'errorPeerConnect', 'className': 'error'});
//                        } else {
//                            this.wbRtc.peerCon = true;
//                        }
//                    } else {
//                        this.wbRtc.peerCon = false;
//                      //  vApp.error.push({'msg': vApp.lang.getString('notSupportGetUserMedia'), 'id': 'errorGetUserMedia', 'className': 'error'});
//                    }
//                } else if (browser == 'MSIE' && version <= 11) {
//                    this.wbRtc.peerCon = false;
//                    //vApp.error.push({'msg': vApp.lang.getString('notSupportWebRtc'), 'id': 'errorWebRtc', 'className': 'error'});
//                }
//            },
//          
            
            isCanvasSupport : function(navigator, browserName, version) {
                if (browserName == 'MSIE') {
                    return (version != 9) ? false : true;
                } else {
                   return (!window.CanvasRenderingContext2D) ? false : true;
                }
            },
            
            isWebSocketSupport : function(navigator, browser, version) {
                if (typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object') && window.WebSocket.hasOwnProperty('OPEN')){
                    return true;
                }else{
                    return false;
                }
                    
            },
            
            isLocalStorageSupport: function (){
                return (Storage !== void(0)) ? true : false;
            },
            
            isGetUserMediaSupport : function(browser, version) {
                navigator.getUserMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
               
                return (navigator.getUserMedia) ? true : false;
            },
            
            isIndexedDbSupport : function (){
               return (window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB) ? true : false;
            },
            
            isWorkerSupport : function (){
                return !!window.Worker ? true : false;
            },
            
            isAudioApiSupport : function (){
                return (window.AudioContext||window.webkitAudioContext) ? true : false;
            },
            
            isTypedArraySupport : function (){
                return ( 'ArrayBuffer' in window ) ? true : false;
            },
            
            isScreenShareSupport : function (bname, bversion){
                if(bname == 'Firefox'){
                    return (bversion >= 34) ?  true : false;
                }else if(bname == 'Chrome'){
                    return (bversion >= 39) ?  true : false;
                }
                return false;
            },
                
            setValue : function (key, value){
                this[key]  = value;
            },
            
            checkBrowserFunctions : function (bname, bversion){
                this.setValue('canvas', this.isCanvasSupport());
                this.setValue('webSocket', this.isWebSocketSupport());
                this.setValue('getusermedia', this.isGetUserMediaSupport());
                this.setValue('indexeddb', this.isIndexedDbSupport());
                this.setValue('webworker', this.isWorkerSupport());
                this.setValue('webaudio', this.isAudioApiSupport());
                this.setValue('typedarray', this.isTypedArraySupport());
                this.setValue('screenshare', this.isScreenShareSupport(bname, bversion));
                this.setValue('localstorage', this.isLocalStorageSupport());
            },     
            
            
//            isBrowserCompatible : function (browserName, version){
//                
////                vApp.error.push({'msg': vApp.lang.getString('notSupportChrome'), 'id': 'errorBrowser2', 'className': 'error'}); 
//                
//                
//                if(browserName == 'Chrome' && version < 40){
//                    vApp.error.push({'msg': vApp.lang.getString('notSupportChrome'), 'id': 'errorBrowser', 'className': 'error'}); 
//                    return false;
//                }
//                return true;
//            },
//            
//            isWebSocketSupport : function(navigator, browser, version) {
//                this.webSocket = {};
//                if (typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object') && window.WebSocket.hasOwnProperty('OPEN')) {
//                    this.webSocket = true;
//                } else {
//                    this.webSocket = false;
////                    vApp.error.push({'msg': vApp.lang.getString('notSupportWebSocket'), 'id': 'errorWebSocket', 'className': 'error'});
//                }
//            },
            
            measureResoultion : function(resolution) {
                var element = document.getElementById('vAppCont');
                var offset = vcan.utility.getElementOffset(element);
                var offsetLeft = offset.x;
                if (resolution.width < 1024) {
                    var width = 1024 - offsetLeft;
                } else {
                    var width = resolution.width - offsetLeft;
                }
                var height = resolution.height - offset.y;
                return {'width': (width), 'height': (height)};
            },
            setAppDimension : function() {
                var measureRes = this.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
                //var mainWrapper =  document.getElementById('vAppCont');
                vApp.vutil.setContainerWidth(measureRes);
                if(vApp.currApp == 'Whiteboard'){
                    system.setCanvasDimension(measureRes);
                }
            },
            setCanvasDimension : function (measureRes){
                if (typeof vcan.main.canvas != 'undefined') {
                    var canvas = vcan.main.canvas;
                    ctx = vcan.main.canvas.getContext('2d');

                    canvas.width = measureRes.width;
                    var toolWrapperHeight = (vApp.gObj.uRole == 't') ? (45 + 20) : 10
                    canvas.height = measureRes.height - toolWrapperHeight;
                    console.log("canvas width " + canvas.width);
                    //var element = document.getElementById('canvas');
                    var offset = vcan.utility.getElementOffset(document.getElementById('canvas'));
                    vcan.main.offset.x = offset.x;
                }
            },
            getResoultion : function(windowWidth) {
                var resolution = {};
                if (windowWidth < 1280) {
                    resolution.width = 1024;
                    resolution.height = 768;
                } else if (windowWidth >= 1280 && windowWidth < 1366) {
                    resolution.width = 1280;
                    resolution.height = 1024;
                } else if (windowWidth >= 1366 && windowWidth < 1920) {
                    resolution.width = 1366;
                    resolution.height = 768;
                } else if (windowWidth >= 1920) {
                    resolution.width = 1920;
                    resolution.height = 1080;
                }
                return resolution;
            },
            
            reportBrowser : function (user){
                var errors = this.getErrors(user);
//                alert('sss');
//                debugger;
//                if(errors.indexOf('errscreenshare') > -1){
//                    alert("hi brother what is up"); 
//                    debugger;
//                    vApp.wb.view.disableSSUI();
//                }
                
                if(errors.length > 1){
                   vApp.error.push(errors.join(",") + " are disabled in your browser.");
                }else if(errors.length == 1){
                   vApp.error.push(errors + ' is disabled in your browser.'); 
                }
                
                
                
            },
    
            getErrors : function (user){
                
                var errors = [];
                //webSocket to websocket
                var  apis = ['canvas', 'webSocket', 'getusermedia', 'webaudio', 'indexeddb', 'localstorage','typedarray'];
                if(user == 't') apis.push('webworker', 'screenshare');  
                for (var i=0; i<apis.length; i++){
                    if(!this[apis[i]]){
                        if(apis[i] == 'screenshare'){
                           vApp.gObj.errNotScreenShare = true;
                        }
                        errors.push(vApp.lang.getString('err'+ apis[i]));
                    }
                }
                return errors;
            },
            isiOSDevice : function(){
                var iOSVersion = parseFloat(
                ('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0,''])[1])
                .replace('undefined', '3_2').replace('_', '.').replace('_', '')
                ) || false;
                return iOSVersion; 
            },
            
            isAndroid : function (){
                var ua = navigator.userAgent.toLowerCase();
                return ua.indexOf("android") > -1;
            },
            
            check : function (){
               var iOS = this.isiOSDevice();
               
//               this.isAndroid();
               
                if(iOS){
                    var bname = "safariMobile";
                    var bversion = iOS;
                }else{
                    
                    var androidDevice = this.isAndroid();
                    var vendor = this.mybrowser.detection();
                    var bname = vendor[0];
                    var bversion = parseFloat(vendor[1]);
                   
                    this.mybrowser.name = bname;
                    this.mybrowser.version = bversion;
                }
                
                
//                bname = vendeor[0];
//                bversion = parseFloat(vendeor[1]);
                this.checkBrowserFunctions(bname, bversion);
//                vApp.vutil.initDisableVirtualClass();
                if(typeof androidDevice != 'undefined' && androidDevice || iOS){
                    if(vApp.gObj.uRole == 't'){
//                        vApp.gObj.errNotDesktop = true;
                        vApp.vutil.initDisableVirtualClass();
                        vApp.error.push("We support only desktop computer not  any tablet and mobile for teacher.");
                        return;
                    }else{
                        if(androidDevice){
                            if(bname == 'Chrome'){
                            if(bversion >= 40){
                                
                            //     DO : Disable Audio Controls and Cam Support for this user
                               vApp.vutil.initDisableAudVid();
                               
                            }else{
                               vApp.error.push( bname +  ' ' + bversion + ' ' + " is not supported, we support chrome  versoin 40 or newer on Android");
                            }
                          }else{
                              vApp.error.push( bname  + ' ' + " is not supported, we support Chrome 40 or newer on andorid");
                          }
                        }
                    }
                    
                }else if ( (bname == 'Chrome' &&   bversion  >= 40) || (bname == 'Firefox' &&   bversion  >= 35) || 
                        (vApp.gObj.uRole == 's' && bname == 'OPR' > bversion  >= 26)) {
                    this.reportBrowser(vApp.gObj.uRole);
                } else if ( (bname == 'Chrome' &&  bversion < 40) || (bname == 'Firefox' &&   bversion  < 35) ||
                        (vApp.gObj.uRole == 's' && bname == 'OPR' && bversion < 26)) {
                    this.reportBrowser(vApp.gObj.uRole);
                    vApp.error.push(bname +  ' ' + bversion +   vApp.lang.getString('chFireBrowsersIssue'));
                } else if(vApp.gObj.uRole == 't' && bname == 'OPR' &&  bversion >= 26 ){
                    this.reportBrowser(vApp.gObj.uRole);
                    vApp.error.push( bname +  ' ' + bversion + ' ' +   vApp.lang.getString('operaBrowserIssue'));
                } else if(vApp.gObj.uRole == 's' && bname == 'Safari' && bversion  >= 8) {
                    vApp.vutil.initDisableAudVid();
//                        vApp.gObj.audIntDisable = true;
//                        vApp.gObj.vidIntDisable = true;
                        
                    this.reportBrowser(vApp.gObj.uRole);
                    vApp.error.push(bname +  ' ' +   vApp.lang.getString('studentSafariBrowserIssue'));
                    vApp.user.control.audioWidgetDisable();
                    //DO : Disable Audio Controls and Cam Support for this user. 
                } else if(vApp.gObj.uRole == 's'&& bname == 'safariMobile' &&  bversion >= 7) { 
                    // here bversion is version of operating system 
                    // we have to disable the audio compability
                    vApp.vutil.initDisableAudVid();
                }else{
                    vApp.error.push( bname +  ' ' + bversion + ' ' + vApp.lang.getString('commonBrowserIssue'));
                }
            }   
            
//            check : function (){
//                var vendeor = this.mybrowser.detection();
//                bname = vendeor[0];
//                bversion = parseFloat(vendeor[1]);
//
////                this.isCanvasSupport(navigator, browserName, browserVersion);
////                this.isWebRtcSupport(navigator, browserName, browserVersion);
////                this.isWebSocketSupport(navigator, browserName, browserVersion);
//                this.checkBrowserFunctions();
////                this.isBrowserCompatible(browserName, browserVersion);
//                if ( this.mybrowser == 'Chrome' &&   bversion  >= 40 ||
//                        this.mybrowser == 'Firefox' &&   bversion  >= 35)  {
//                    this.reportBrowser(vApp.gObj.uRole);
//                }    
//            }
        };
        
        system = system.init();
         // There could be the problem
        window.addEventListener('resize',
            function (){
                if(window.earlierWidth != window.innerWidth){
                    system.setAppDimension();
                }
            }
        );

        window.addEventListener('resize',
            function (){
                if(window.earlierWidth != window.innerWidth){
                    vApp.wb.view.window.resize();
                }
            }
        );

        system.mybrowser.detection = function() {
            var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|opr|OPR(?=\/))\/?\s*([\d\.]+)/i) || []; //for opera especially
            if(M.length <= 0){
                M = ua.match(/(chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
            }
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                return 'IE ' + (tem[1] || '');
            }
            
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/([\.\d]+)/i)) != null){
                M[2] = tem[1];
            }
            // return M.join(' ');
            return M;
         },
        window.system = system;
    }
)(window);
