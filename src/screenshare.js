/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides all functionality needed to share screen.
 */
var globalImageData = {};
var newCanvas;


(function (window) {
    "use strict";

    var changeonresize, resizecalled, prvWidth, prvHeight, prvVWidth, prvVHeight, app, dim;
    var canvasCont, newCanvas, newCtx, imageData;

    function callback(error) {
        virtualclass.vutil.initInstallChromeExt(error);
    }

    var renderImage = function (imageData){
        if (canvasCont == null){
            canvasCont = document.querySelector('#virtualclassScreenShareLocal');
        }

        if(newCanvas == null){
            newCanvas = document.createElement('canvas');
            newCanvas.id = "virtualclassScreenShareLocalVideoNew";
            canvasCont.appendChild(newCanvas);
            newCanvas = document.querySelector('#virtualclassScreenShareLocalVideoNew');
        }

        newCanvas.width = imageData.width;
        newCanvas.height = imageData.height;

        if(virtualclass.studentScreen.base.width <=0 ){
            virtualclass.studentScreen.base.width = newCanvas.width;
            virtualclass.studentScreen.base.height = newCanvas.height;
        }

        if (newCtx == null) {
            newCtx = document.querySelector('#virtualclassScreenShareLocalVideoNew').getContext('2d');
        }

        newCtx.putImageData(imageData, 0, 0);
        virtualclass.ss.localCont.save();

        virtualclass.ss.localCont.clearRect(0, 0, window.innerWidth-300, window.innerHeight);

        virtualclass.ss.localCont.scale(virtualclass.studentScreen.scale, virtualclass.studentScreen.scale);

        virtualclass.ss.localCont.drawImage(newCanvas, 0, 0);
        virtualclass.ss.localCont.restore();
        if(typeof stype != 'undefined'){
            console.log('Screen type width ' + newCanvas.width);
            console.log('Screen type height ' + newCanvas.height);
        }
    };

    if (!!window.Worker) {
        sdworker.onmessage = function (e) {
            if (e.data.dtype == "drgb") {
                globalImageData = e.data.globalImageData;
                imageData = e.data.globalImageData;
                if(e.data.hasOwnProperty('stype')){
                    virtualclass.studentScreen.base.width = 0;
                    virtualclass.studentScreen.setDimension();
                    renderImage(imageData);
                    if(e.data.stype == 'full' && virtualclass.studentScreen.scale == 1){
                        virtualclass.studentScreen.scale = 1;
                        virtualclass.studentScreen.fitToScreen();
                    }
                }else {
                    renderImage(imageData, 'full');
                }
            }
        }
    }

    /**
     * This returns an object that contains methods to initilize student screen
     * @returns an object to initilize student screen
     */

    var studentScreen = function () {
        return {
            scale : 1,
            SCALE_FACTOR : 1.04,
            szoom : false,
            base : {width : 0, height : 0},
            /**
             * Calculating the width and height of the student screen according the requirement of the-
             * application to be shared
             * And calling a function with the appropriate data to inilaize student screen
             * @param data_pack data pack contains encoded data to sent receiver
             * @param  msg  is a unit8clampped array or unit8array based on the protocol saved a the first element in data_Pack
             * @param  stype type of the application such as "ss
             * @param  sTool tool for the application here it is screen share
             */

            ssProcess: function (data_pack, msg, stype, sTool) {
                var mycase = data_pack[0];
                // uint8
                data_pack = new Uint8ClampedArray(msg);
                var x, y, h, w, l, recmsg, dw, dh, vcw, vch, dimObj;
                switch (mycase) {
                    // Full Image
                    case 102:
                    case 202:
                        w = virtualclass.vutil.numValidateTwo(data_pack[1], data_pack[2]);
                        h = virtualclass.vutil.numValidateTwo(data_pack[3], data_pack[4]);
                        recmsg = data_pack.subarray(5, data_pack.length);
                        this.initStudentScreen(recmsg, {w: w, h: h}, stype, sTool);
                        break;
                    // Slice Image
                    case 103:
                    case 203:
                        /* Send to worker only if the screen layout is Ready already */
                        if(typeof virtualclass.ss == 'object'){
                            this.drawImageThroughWorker(data_pack);
                        }

                        break;
                    // Full Image with Resize
                    case 104:
                    case 204:
                        dw = virtualclass.vutil.numValidateTwo(data_pack[1], data_pack[2]);
                        dh = virtualclass.vutil.numValidateTwo(data_pack[3], data_pack[4]);
                        vcw = virtualclass.vutil.numValidateTwo(data_pack[5], data_pack[6]);
                        vch = virtualclass.vutil.numValidateTwo(data_pack[7], data_pack[8]);
                        recmsg = data_pack.subarray(9, data_pack.length);
                        dimObj = {d: {w: dw, h: dh}, vc: {w: vcw, h: vch}};
                        this.initStudentScreen(recmsg, dimObj, stype, sTool);
                        break;
                }
            },
            /**
             * Initializes the student screen, makes the application ready
             * calls functions to set dimension of student screen
             * setting dimension of student's screen
             * drwaing image on the screen of student
             * @param  imgData
             * @param  d dimension object
             * @param  stype type of the application such as ss for screen share
             * @param  stool  screen share
             */
            // TODO name of parameter d should be changed ,It also contains the property named d
            initStudentScreen: function (imgData, d, stype, stool) {

                app = stype;
                var screenCont = document.getElementById('virtualclass' +  virtualclass.apps.ss);

                if (typeof virtualclass[app] != 'object' || screenCont == null) {
                    if (typeof vtype != 'undefined') {
                        virtualclass.recorder.recImgPlay = true;
                    }
                    var stool = "ScreenShare";
                    virtualclass.makeAppReady(stool);
                } else {
                    if (virtualclass.currApp != "ScreenShare") {
                        virtualclass.vutil.hidePrevIcon(app);
                    }

                    virtualclass.currApp = stool;

                    var vcContainer = document.getElementById('virtualclassCont');
                    virtualclass.vutil.setCurrApp(vcContainer, virtualclass.currApp);
                }

                if (d.hasOwnProperty('d')) {
                    virtualclass[app].dimensionStudentScreenResize(d);
                    dim = true;
                    virtualclass[app].drawImages(imgData);
                } else {
                    if (typeof dim == 'undefined' || ((typeof prvWidth != 'undefined') && (prvWidth != d.w) && (!d.hasOwnProperty('x')))) {
                        dim = true;
                        virtualclass[app].dimensionStudentScreen(d.w, d.h);
                        prvWidth = d.w;
                        prvHeight = d.h;
                    }

                    if (d.hasOwnProperty('w')) {
                        if( virtualclass[app].localCanvas.width != d.w || virtualclass[app].localCanvas.height != d.h){
                            virtualclass[app].localCanvas.width = d.w;
                            virtualclass[app].localCanvas.height = d.h;
                        }
                    }
                    virtualclass[app].drawImages(imgData);
                }

                virtualclass.previous = virtualclass[app].id;

                if(!this.szoom){
                    this.initZoom();
                }
            },

            initZoom : function (){
                var zoomControler = virtualclass.getTemplate('zoomControl');
                var zoomControlerhtml = zoomControler({hasControls : roles.hasControls()});
                var container = document.querySelector('#virtualclass' + virtualclass.currApp);
                if(container != null){
                    container.insertAdjacentHTML('beforeend', zoomControlerhtml);
                    var zoomIn = document.querySelector('#virtualclass' + virtualclass.currApp + ' .zoomIn');
                    var zoomOut = document.querySelector('#virtualclass' + virtualclass.currApp + ' .zoomOut');
                    var fitScreen = document.querySelector('#virtualclass' + virtualclass.currApp + ' .fitScreen');

                    if(zoomIn != null){
                        var that = this;
                        zoomIn.onclick = function (elem){
                            that.zoomIn();
                        }
                    }

                    if(zoomOut != null){
                        var that = this;
                        zoomOut.onclick = function (){
                            that.zoomOut();
                        }
                    }

                    if(fitScreen != null){
                        var that = this;
                        fitScreen.onclick = function (){
                            that.fitToScreen();
                        }
                    }
                }

                this.szoom = true;
            },

            zoomIn : function (){
              virtualclass.ss.localCanvas.width = (+virtualclass.ss.localCanvas.width) * this.SCALE_FACTOR;
              virtualclass.ss.localCanvas.height = (+virtualclass.ss.localCanvas.height) * this.SCALE_FACTOR;
              this.scale = this.scale * this.SCALE_FACTOR;
              renderImage(globalImageData);

              this.addScroll();
            },

            zoomOut : function (){
              this.scale = this.scale / this.SCALE_FACTOR;
              virtualclass.ss.localCanvas.width = (+virtualclass.ss.localCanvas.width) * (1/this.SCALE_FACTOR);
              virtualclass.ss.localCanvas.height = (+virtualclass.ss.localCanvas.height) *(1/this.SCALE_FACTOR);
              renderImage(globalImageData);
                this.addScroll();
            },



            addScroll : function (){
                var canvasWidth = virtualclass.ss.localCanvas.width;
                var canvasWrapperWidth = virtualclass.ss.localCanvas.parentNode.style.width;
                canvasWidth = virtualclass.vutil.getValueWithoutPixel(canvasWidth);
                canvasWrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvasWrapperWidth);
                if(canvasWidth > canvasWrapperWidth){
                    virtualclass.ss.localCanvas.parentNode.classList.add('scrollX');
                }else {
                    virtualclass.ss.localCanvas.parentNode.classList.remove('scrollX');
                }
            },

            fitToScreen : function (){
                var dimen  = this.setDimension();
                this.scale = virtualclass.ss.getScale(this.base.width, dimen.width);
                if(this.scale >= 1){
                    this.scale = 1;
                    virtualclass.ss.localCanvas.width = globalImageData.width;
                    virtualclass.ss.localCanvas.height = globalImageData.height;
                }else {
                    virtualclass.ss.localCanvas.width = dimen.width;
                    virtualclass.ss.localCanvas.height = dimen.height;
                }

                renderImage(globalImageData);
                virtualclass.ss.localCanvas.parentNode.classList.remove('scrollX');
            },

            setDimension : function (){
                var dimension = this.getCanvasContainerDimension();
                var width = dimension.width;
                var height = dimension.height;
                width = virtualclass.vutil.getValueWithoutPixel(width);
                height = virtualclass.vutil.getValueWithoutPixel(height) ;
                this.setCanvasContainerDimension(width, height);
                return {width:width, height: height}
            },



            getCanvasContainerDimension : function (){
                var screenApp = document.querySelector('#virtualclass'+ virtualclass.currApp);
                var width = screenApp.style.width;
                var height = screenApp.style.height;

                if(width == null || width == '' || width == undefined ){
                    width = screenApp.offsetWidth;
                }

                if(height == null || height == '' || height == undefined ){
                    height = screenApp.offsetHeight;
                }

                width = virtualclass.vutil.getValueWithoutPixel(width)- 40;
                height = virtualclass.vutil.getValueWithoutPixel(height) ;

                return {width:width, height:height};
            },

            setCanvasContainerDimension : function (width, height){
                var canvaScontainer =  document.querySelector('#virtualclassScreenShareLocal');
                canvaScontainer.style.width= width +'px';
                canvaScontainer.style.height= (height)+'px';
            },


            drawImageThroughWorker : function (data_pack){
                if (!!window.Worker) {
                    sdworker.postMessage({
                        data_pack: data_pack,
                        dtype: "drgbs"
                    }, [data_pack.buffer]);
                }
            }
        }
    };
    /**
     * This function returns an object that contains all the functions necessary to use the application share screen
     * such as to initalize screen, get screen(screen selector window) on different browsers,
     * Creating container,
     * Recording screen ,
     * sharing on student's screen
     * @param  config is an object containg id and class properties of the application to be shared,
     * on student's screen.
     * @return  returns an object containing various methods for screen share
     *
     */
    var screenShare = function (config) {
        /**
         *
         */
        virtualclass.getSceenFirefox = function () {
            var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
            if (ffver >= 33) {
                var constraints = {
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window'
                    }
                };
                if(virtualclass.adpt == null){
                    virtualclass.adpt = new virtualclass.adapter();
                }

                var navigator2 = virtualclass.adpt.init(navigator);

                navigator2.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    virtualclass.ss._init();
                    if((roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing) || virtualclass.gObj.studentSSstatus.mesharing){
                        //callback(err, stream);
                        virtualclass.ss.initializeRecorder.call(virtualclass.ss, stream);

                        // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
                        if (typeof err == 'undefined') {
                            var lastTime = stream.currentTime;
                            var polly = window.setInterval(function () {
                                if (!stream) window.clearInterval(polly);
                                if (stream.currentTime == lastTime) {
                                    window.clearInterval(polly);
                                    if (stream.onended) {
                                        stream.onended();
                                    }
                                }
                                lastTime = stream.currentTime;
                            }, 500);
                        }
                    } else {
                        console.log('Set previous app as current app if teacher reclaim role during screen share');
                        virtualclass.ss.setCurrentApp();
                    }

                }).catch(function (error) { //cancel screen share
                    virtualclass.ss.setCurrentApp();

                    if(virtualclass.currApp == "Video") {
                        var option = document.getElementById("virtualclassVideoTool");
                    }else if(virtualclass.currApp == "SharePresentation"){
                        var option = document.getElementById("virtualclassSharePresentationTool");
                    }else if(virtualclass.currApp == "DocumentShare"){
                        var option = document.getElementById("virtualclassDocumentShareTool");
                    }
                    var dashboard = option.getElementsByTagName('a')[0];
                    virtualclass.initlizer(dashboard);

                    if (typeof error == 'string') {
                        //PERMISSION_DENIED
                        if (error === 'PERMISSION_DENIED') {
                            //this url is need to be changed
                            window.open("https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/").focus();
                        }
                    } else if (typeof error == 'object') {   //latest firefox
                        if (error.name === 'PermissionDeniedError' || error.name == 'SecurityError') {
                            window.open("https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/").focus();
                        }
                    }
                    if (roles.hasControls()) {
                        if (virtualclass.currApp == 'Video' || virtualclass.currApp == 'SharePresentation' || virtualclass.currApp == 'DocumentShare') {
                            virtualclass.ss.showDashboard();
                        }
                    }        
                });
            } else {
                alert(virtualclass.lang.getString('notSupportBrowser', [ffver]));
            }
        };

        return {
            prevStream: false,

            /**
             * This function is invoked on clicking screen share icon .
             * At the teacher's window screen share application is started ,
             * And on student's window _init function is invoked to inilize screen
             * @param screen screen object

             */
            init: function (screen) {
  
                this.type = screen.type;
                this.ssByClick = true;
                this.manualStop = false;

                //if(roles.hasControls() && !virtualclass.hasOwnProperty('repType')){
                if (roles.hasControls() && !virtualclass.recorder.recImgPlay && !virtualclass.gObj.studentSSstatus.mesharing) {
                    //if(!virtualclass.hasOwnProperty('repType')){
                    this.readyTostart(screen.app);
                    //this.tempCurrApp = virtualclass.vutil.capitalizeFirstLetter(screen.app);
                    //}
                } else if(roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing){
                    this.readyTostart(screen.app);
                }else {
                    this._init();
                }
            },

            /**
             * Called when user select the screenshare
             * configuring the screen
             * inilizing student screen
             *
             */
            _init: function () {
                console.log('Init screen');
                this.currApp = this.tempCurrApp;
                virtualclass.currApp = virtualclass.apps.ss;
                //add current app to main container
                var vcContainer = document.getElementById('virtualclassCont');
                virtualclass.vutil.setCurrApp(vcContainer, virtualclass.currApp);
                if (virtualclass.previous != config.id) {
                    document.getElementById(virtualclass.previous).style.display = 'none';
                    virtualclass.previous = config.id;
                }
                var ss = document.getElementById(config.id);
                if (ss != null) {
                    ss.style.display = 'block';
                }

                if (!this.hasOwnProperty('id')) {
                    this.dc = virtualclass.dirtyCorner;
                    this.postFix = "Cont";
                    this.id = config.hasOwnProperty('id') ? config.id : "virtualclassScreenShare";
                    this.className = "virtualclass";
                    this.label = "Local",
                        this.local = this.id + this.label;
                    this.localTemp = this.id + this.label + "Temp";
                    this.classes = config.hasOwnProperty('class') ? config.classes : "";

                    //this.prevImageSlices = [];
                    this.initPrevImage();
                    var ssUI = document.getElementById(this.id);
                    if (ssUI != null) {
                        ssUI.parentNode.removeChild(ssUI);
                    }

                    this.html.UI.call(this, virtualclass.gObj.uRole);
                    if (((roles.hasControls() && !virtualclass.recorder.recImgPlay) && !virtualclass.gObj.studentSSstatus.mesharing) ||
                        roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing){
                        virtualclass.vutil.initLocCanvasCont(this.localTemp + "Video");
                    }
                }

            },

            /**
             * This function gets  screen reloaded with the url
             * @param app it stores the string screenshare
             */
            readyTostart: function (app) {
                if (app == virtualclass.apps.ss) {
                    this.getScreen();
                }

            },
            /**
             * Displays the error if any
             * @param e error
             *
             */
         
            onError: function (e) {
               // virtualclass.ss.setCurrentApp();
                if(virtualclass.previous){
                    var previous =virtualclass.previous
                    virtualclass.currApp =  previous.split('virtualclass')[1];
                    virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);

                } else if(virtualclass.hasOwnProperty('previousApp') && typeof virtualclass.previousApp == 'object'){
                    virtualclass.currApp = virtualclass.previousApp.name;
                    virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
                }
                if (roles.hasControls()) {
                    if (virtualclass.currApp == 'Video' || virtualclass.currApp == 'SharePresentation' || virtualclass.currApp == 'DocumentShare') {
                        virtualclass.ss.showDashboard();
                    }
                }
                console.log("Error " + e);
            },
            
            showDashboard: function () {
                virtualclass.vutil.initDashboardNav();
                if (virtualclass.currApp == 'Video') {
                    ioAdapter.mustSend({'videoUl': {init: 'destroyPlayer'}, 'cf': 'destroyPlayer'});
                    ioAdapter.mustSend({'videoUl': {init: 'studentlayout'}, 'cf': 'videoUl'});
                }else if(virtualclass.currApp == 'SharePresentation'){
                    virtualclass.vutil.initDashboard();
                }
            },
            /**
             * To Get screen for Firefox and chrome,
             * in case of crome if desktop extension is added it is used otherwise
             * it is added from the crome webstore
             * @param callback is unused
             */
            getScreen: function (callback) {
                if (virtualclass.system.mybrowser.name == 'Chrome') {
                    if (virtualclass.gObj.hasOwnProperty('ext') && virtualclass.gObj.ext) {
                        window.postMessage({type: 'getScreen', id: 1}, '*');
                    } else {
                        virtualclass.vutil.beforeSend({'ext': true, 'cf': 'colorIndicator'});
                        var url = 'https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl';
                        virtualclass.popup.chromeExtMissing();
                        virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
                        if (roles.hasControls()) {
                            if (virtualclass.currApp == 'Video' || virtualclass.currApp == 'SharePresentation' || virtualclass.currApp == 'DocumentShare') {
                                virtualclass.ss.showDashboard();
                            }
                        }      
                    }
                } else if (virtualclass.system.mybrowser.name == 'Firefox') {
                    virtualclass.getSceenFirefox();
                }else if(virtualclass.system.mybrowser.name == 'Edge') {
                    navigator.getDisplayMedia().then(stream => {        //teacher share his screen using edge browser
                        virtualclass.ss._init();
                        virtualclass.ss.initializeRecorder.call(virtualclass.ss, stream);
                    }, error => {
                        console.log("Unable to acquire screen capture", error);
                    });
                }
            },
            /**
             *  clear previous screen from teacher's window
             *  The operation beforeSend is performed that
             *  sends data to the student that previous screen is to be unshared
             *
             */
            unShareScreen: function () {
                console.log('Unshare the screen');
                this.video.src = "";
                this.localtempCont.clearRect(0, 0, this.localtempCanvas.width, this.localtempCanvas.height);
                clearInterval(virtualclass.clear);
                //this.prevImageSlices = [];
                this.initPrevImage();
                if (this.hasOwnProperty('currentStream')) {
                    // this.currentStream.stop(); is depricated from Google Chrome 45
                    // https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en
                    this.currentStream.getTracks()[0].stop();
                }
                virtualclass.vutil.beforeSend({'unshareScreen': true, st: this.type, 'cf': 'unshareScreen'});
                this.clearScreenShare();
            },

            clearScreenShare : function (){
                console.log('Clear the screen');
                if(typeof virtualclass.prevScreen != 'undefined' && virtualclass.prevScreen.hasOwnProperty('currentStream')){
                    delete virtualclass.prevScreen.currentStream;
                }
                virtualclass.gObj.studentSSstatus.mesharing = false;
                virtualclass.vutil.removeSharingClass();
                virtualclass.gObj.studentSSstatus.shareToAll = false;
                virtualclass.gObj.studentSSstatus.sharing = false;
                localStorage.setItem('studentSSstatus', JSON.stringify(virtualclass.gObj.studentSSstatus));
                var elem = document.querySelector('#virtualclassScreenShare');
                if(elem != null){
                    elem.parentNode.removeChild(elem);
                }
                virtualclass.vutil.removeSSsharing();
                delete virtualclass.ss;
                if(virtualclass.hasOwnProperty('studentScreen')){
                    delete virtualclass.studentScreen;
                }
                virtualclass.zoom.removeZoomController();
                virtualclass.ss = '';

            },

            /**
             * It clears the canvas
             */
            removeStream: function () {
                virtualclass.vutil.removeClass('audioWidget', "fixed");
                this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
                this.clearScreenShare();
            },
            /**
             * Initializing the recorder to record the scrren that will be shared
             * And creating canvas element for the screen share,attaching
             * the media stream to the canvas element
             * it calls sharing function that share's the screen in the form of video to the student screen
             * clears the screen on cancelling screen share
             * @param stream
             */

            initializeRecorder: function (stream) {
                //virtualclass.vutil.addClass("audioWidget", "fixed");
                changeonresize = 1;
                resizecalled = 0;

                if (this.prevStream) {
                    this.ssByClick = false;
                }
                if (typeof virtualclass.prevScreen != 'undefined') {
                    if (virtualclass.prevScreen.hasOwnProperty('currentStream')) {

                        virtualclass.prevScreen.unShareScreen();
                    }
                }

                this.video = document.getElementById(this.local + "Video");
                this.videoSmall = document.getElementById(this.local + "Videosmall");


                if (this.video.tagName != "VIDEO") {
                    var earlierVideo = this.video;
                    var video = document.getElementById(this.local + "video");
                    this.video.parentNode.replaceChild(video, this.video);
                    this.video = document.getElementById(this.local + "Video");
                    this.video.autoplay = true;
                    virtualclass.vutil.initLocCanvasCont(this.local + "Temp" + "Video");
                }
                this.currentStream = stream;
                var that = this;
                //("video changed");
                virtualclass.adpt.attachMediaStream(this.video, stream);
                virtualclass.adpt.attachMediaStream(this.videoSmall, stream);
                this.prevStream = true;
                // Event handler ON current stream ends ,clearing canvas and unsharing on student's screen
                this.currentStream.getVideoTracks()[0].onended = function (name) {
                    if (that.ssByClick) {
                        var elem = document.querySelector("#virtualclassScreenShareLocalSmall");
                        if(elem){
                            elem.style.display="none";
                        }
                        that.video.src = "";
                        that.localtempCont.clearRect(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                        clearInterval(virtualclass.clear);

                        that.initPrevImage();
                        that.clearScreenShare();
                        virtualclass.vutil.beforeSend({'unshareScreen': true, st: that.type, 'cf': 'unshareScreen'});
                        console.log('Sending unshare screen with users ' + virtualclass.gObj.totalUser);
                        if(roles.hasControls() ){
                            // virtualclass.vutil.initDefaultApp();
                            if(!virtualclass.gObj.hasOwnProperty('windowLoading')){
                                virtualclass.vutil.initDefaultApp();
                            }

                        }else {
                            // Student unshares the screen by clicking stop button
                            var teacherId = virtualclass.vutil.whoIsTeacher();
                            ioAdapter.mustSendUser({'cf' : 'rmStdScreen'}, teacherId);
                        }

                        that.prevStream = false;
                        that.prevScreen = "";
                        virtualclass.prevScreen = ""; //todo:- that.prevScreen and virtualclass.prevScreen should be same


                        console.log('Stop by clicking');

                    } else {
                        that.ssByClick = true;
                    }
                };

                var container = {};
                container.width = window.innerWidth;
                container.height = window.innerHeight - 140;

                var vidContainer = document.getElementById(this.local);
                var dimension = this.html.getDimension(container);
                vidContainer.style.width = Math.round(dimension.width) + "px";
                vidContainer.style.height = Math.round(dimension.height) + "px";

                //setStyleToElement(vidContainer, width, height);
                var that = this;
                var video;
                /**
                 * Event handler on loading meta data of the video
                 * Setting container width
                 * calling sharing function to share screen
                 * making screenshare active application and removing previous application
                 */
                this.video.onloadedmetadata = function () {
                    that.width = dimension.width;
                    that.height = dimension.height;

                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;

                    virtualclass.prevScreen = that;
                    var res = virtualclass.system.measureResoultion({
                        'width': window.innerWidth,
                        'height': window.innerHeight
                    });

                    that.sharing();
                    virtualclass.vutil.setContainerWidth(res, virtualclass.currApp);

                    if (roles.hasControls()) {
                        //TODO This should be invoke at one place
                        virtualclass.vutil.makeActiveApp(that.id, virtualclass.previrtualclass);
                        if (virtualclass.previrtualclass == 'virtualclassYts') {
                            virtualclass.yts.destroyYT();
                        }

                    }
                    virtualclass.previrtualclass = that.id;
                }
            },

            /**
             * sendi bng the video to the student in the form of encoded data
             * status code is also sent with the encoded data
             *screen is shared in the form of video
             *@return sendmsg encoded data and status code together
             */
            // function is too large
            sharing: function () {
                var tempObj, encodedData, stringData, d, matched, imgData;
                var resA = Math.round(this.localtempCanvas.height / 12);
                var resB = Math.round(this.localtempCanvas.width / 12);
                var prvResA = resA;
                var prvResB = resB;
                var that = this;
                var uniqcount = 0;
                var uniqmax = (resA * resB) / 5;
                var sendObj;
                //var changeonresize=1;
                //randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                if (virtualclass.hasOwnProperty('wholeImage')) {
                    clearInterval(virtualclass.wholeImage);
                }

                if (virtualclass.hasOwnProperty('clear')) {
                    clearInterval(virtualclass.clear);
                }

                if(resA == 0 && resB == 0){
                    virtualclass.view.createErrorMsg('screensharereload', 'errorContainer', 'chatWidget');
                }

                var screenIntervalTime = 1000;
                /**
                 * To send full  encoded image data and status code
                 * @param  type type of the application
                 * @returns sendmsg message containg imagedata and encoded data
                 */
                virtualclass.getDataFullScreen = function (type) {
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);

                    //if(typeof firstTimeDisp == 'undefined'){
                    var imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                    var encodedData = that.dc.encodeRGB(imgData.data);
                    var h = breakintobytes(that.localtempCanvas.height, 4);
                    var w = breakintobytes(that.localtempCanvas.width, 4);
                    var statusCode = null;
                    statusCode = (type == 'ss') ? 102 : 202;
                    var scode = new Uint8ClampedArray([statusCode, w[0], w[1], h[0], h[1]]);
                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(encodedData, scode.length);
                    return sendmsg;

                };
                /** Encoded message is sent to student,
                 * Getting full video data on resize of the window
                 * @param  stype implies screenshare
                 * @returns {Uint8ClampedArray}
                 */
                function getDataFullScreenResize(stype) {
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);

                    var imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                    var encodedData = that.dc.encodeRGB(imgData.data);

                    var wdw = Math.round((that.localtempCanvas.width) / resB);
                    var wdh = Math.round((that.localtempCanvas.height) / resA);
                    var dw, dh, vcw, vch;

                    var contDimension = that.getContainerDimension();
                    if (typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined') {
                        dw = breakintobytes(prvVWidth, 4);
                        dh = breakintobytes(prvVHeight, 4);
                        vcw = breakintobytes(contDimension.width, 4);
                        vch = breakintobytes(contDimension.height, 4);
                    } else {
                        dw = breakintobytes(that.video.offsetWidth, 4);
                        dh = breakintobytes(that.video.offsetHeight, 4);
                        vcw = breakintobytes(contDimension.width, 4);
                        vch = breakintobytes(contDimension.height, 4);
                    }

                    var appCode = (stype == 'ss' ) ? 104 : 204;
                    var scode = new Uint8ClampedArray([appCode, dw[0], dw[1], dh[0], dh[1], vcw[0], vcw[1], vch[0], vch[1]]);
                    var sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
                    sendmsg.set(scode);
                    sendmsg.set(encodedData, scode.length);
                    if (!!window.Worker) {
                        sworker.postMessage({
                            img: encodedData,
                            resize: 1,
                            resA: resA,
                            resB: resB,
                            dw: wdw,
                            dh: wdh,
                            offsetWidth: that.video.offsetWidth,
                            offsetHeight: that.video.offsetHeight
                        }, [encodedData.buffer]);
                    }
                    return sendmsg;
                }

                /**
                 * Breaking  value into parts
                 * @param  val width or height
                 * @param l  length to make of val by appending zero
                 * @returns returning comma separated string
                 */
                function breakintobytes(val, l) {

                    var numstring = val.toString();
                    for (var i = numstring.length; i < l; i++) {
                        numstring = '0' + numstring;

                    }
                    var parts = numstring.match(/[\S]{1,2}/g) || [];
                    return parts;
                }

                /**
                 * finding out whether previous dimention are same or not to the current  video dimension
                 * if there is change in dimension   resized window  data is sent
                 * otherwise image data slices will be sent
                 */
                function sendScreen() {
                    clearInterval(virtualclass.clear);
                    if (typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined') {
                        if (prvVWidth != that.video.offsetWidth || prvVHeight != that.video.offsetHeight) {
                            changeonresize = 1;
                        }
                    } else {
                        prvVWidth = that.video.offsetWidth;
                        prvVHeight = that.video.offsetHeight;
                    }

                    if (changeonresize == 1) {
                        setTimeout(sendResizeWindow, 2000);
                    } else {
                        sendDataImageSlices(that.type);
                    }

                }

                /**
                 * Setting screen interval time based on the size of image to be sent
                 * @param  localBandwidth image size that is to be sent
                 *
                 */
                function calcBandwidth(localBandwidth) {
                    switch (true) {
                        case localBandwidth <= 300 || typeof localBandwidth == 'undefined':
                            screenIntervalTime = 300;
                            break;
                        case localBandwidth <= 3000:
                            screenIntervalTime = localBandwidth;
                            break;
                        case localBandwidth <= 5000:
                            screenIntervalTime = 3000;
                            break;
                        default:
                            screenIntervalTime = 5000;
                    }
                }

                /**
                 * Getting the changed width and height of the new screen
                 * Creating image nd calculating bandwidth
                 * And sending binary data of image
                 * setting the interval for function send screen
                 */
                function sendResizeWindow() {
                    console.log('RESIZE screen share');
                    if(roles.hasControls() || virtualclass.gObj.studentSSstatus.mesharing){
                        prvVWidth = that.video.offsetWidth;
                        prvVHeight = that.video.offsetHeight;
                        if(that.localtempCanvas.width > 5 && that.localtempCanvas.height > 5){
                            resA = Math.round(that.localtempCanvas.height / 12);
                            resB = Math.round(that.localtempCanvas.width / 12);
                            prvResA = resA;
                            prvResB = resB;
                        }else {
                            /** Uses previous resolution if dimension of localtempCanvas is less than 5 **/
                            resA = prvResA;
                            resB = prvResB;
                        }

                        var createdImg = getDataFullScreenResize(that.type);
                        virtualclass.vutil.informIamSharing();
                        ioAdapter.sendBinary(createdImg);

                        calcBandwidth(createdImg.length / 128); // In Kbps
                        changeonresize = 0;
                        clearInterval(virtualclass.clear);
                        virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
                    }
                }

                //  TODO this function is unused ,should be removed
                function w(val, l) {
                    var numstring = val.toString();
                    for (var i = numstring.length; i < l; i++) {
                        numstring = '0' + numstring;
                    }
                    var parts = numstring.match(/[\S]{1,2}/g) || [];
                    return parts;
                }

                /**
                 * Sending data in the form of  slices , to send only that part that is changed in the video of screen share
                 * image data is provided to the worker that is calulating change part for the main javascript thread
                 * @param type : type of the application
                 */
                function sendDataImageSlices(type) {
                    //var localBandwidth = 0;
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    //can be problem for crash
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
                    var needFullScreen = 0;
                    var dw = Math.round((that.localtempCanvas.width) / resB);
                    var dh = Math.round((that.localtempCanvas.height) / resA);
                    var x, y, cx, cy = 0;

                    var masterImgData = that.localtempCont.getImageData(0, 0, that.video.offsetWidth, that.video.offsetHeight);

                    if (!!window.Worker) {
                        sworker.postMessage({
                            img: masterImgData.data,
                            resA: resA,
                            resB: resB,
                            dw: dw,
                            dh: dh,
                            offsetWidth: that.video.offsetWidth,
                            offsetHeight: that.video.offsetHeight,
                            type: that.type
                        }, [masterImgData.data.buffer]);

                        // Every time the data is sending the function
                        // is declaring as expression which is not good
                        sworker.onmessage = function (e) {
                            if (e.data.needFullScreen == 1) { //sending full screen here

                                var createdImg = virtualclass.getDataFullScreen(that.type);
                                virtualclass.vutil.informIamSharing();

                                ioAdapter.sendBinary(createdImg);

                                var localBandwidth = (createdImg.length / 128); // In Kbps
                            } else if (e.data.masterSlice != null) {
                                ioAdapter.sendBinary(e.data.masterSlice);
                                var localBandwidth = (e.data.masterSlice.length / 128); // In Kbps
                            }
                            calcBandwidth(localBandwidth);
                            clearInterval(virtualclass.clear);
                            virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
                        }
                    }
                    clearInterval(virtualclass.clear);
                }
                clearInterval(virtualclass.clear);
                virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
            },
            /**
             *  returnting  width and height of screen share container
             * @return  an object  containing width and height
             */
            getContainerDimension: function () {
                var vidCont = document.getElementById(this.id + "Local");
                return {width: vidCont.offsetWidth, height: vidCont.offsetHeight};
            },
            /**
             * Drawing the image over the canvas
             * @param rec image data
             * @param d dimension of the image
             */
            drawImages: function (rec) {
                sdworker.postMessage({
                    encodeArr: rec,
                    // globalImageData: globalImageData,globalImageDataglobalImageData
                    cw : virtualclass.ss.localCanvas.width,
                    ch : virtualclass.ss.localCanvas.height,
                    dtype: "drgb"
                }, [rec.buffer]); // [[rec.buffer]] is passed to make available in Worker
            },
            /**
             * Setting with and height of container canvas at student's screen
             * @param cWidth width
             * @param cHeight height
             *
             */

            dimensionStudentScreen: function (cWidth, cHeight) {
                this.localCanvas = document.getElementById(virtualclass[app].local + "Video");
                this.localCont = virtualclass[app].localCanvas.getContext('2d');
                this.localCanvas.width = cWidth;
                this.localCanvas.height = cHeight;
                console.log("normal width " + this.localCanvas.width);
            },
            /**
             * setting dimension of virtual class container and setting dimension of screen share canvas
             * at student's side
             * @param msg  dimension object for local canvas for screen share and virtual container
             * @param vtype this variable is not being used
             */
            dimensionStudentScreenResize: function (msg, vtype) {
                if (!this.hasOwnProperty('vac')) {
                    this.vac = true;
                    this.localCanvas = document.getElementById(virtualclass[app].local + "Video");
                    this.localCont = virtualclass[app].localCanvas.getContext('2d');
                }

                if (msg.hasOwnProperty('d')) {
                    this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
                    this.localCanvas.width = msg.d.w;
                    this.localCanvas.height = msg.d.h;
                }

                if (msg.hasOwnProperty('vc')) {
                    var vc = document.getElementById(virtualclass[app].local);
                    vc.style.width = msg.vc.w + "px";
                    vc.style.height = msg.vc.h + "px";
                }

                if (virtualclass.previous == 'virtualclassScreenShare') {
                    virtualclass.vutil.setScreenInnerTagsWidth(virtualclass.previous);
                }
            },

            isAbleToScreenShare : function (){
                  if(roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing){
                      return true;
                  }else if((roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing)){
                      return true;
                  }
                  return false;
            },
            /**
             * Creating user interface part for the screen share
             */
            html: {
                /**
                 * Creating main catainer and local container for screen share
                 * @user role of the user
                 */
                UI: function (user) {
                        var hascontrol = virtualclass.ss.isAbleToScreenShare();
                        var viewcontrol = roles.hasControls();
                        var recImgPlay = virtualclass.recorder.recImgPlay;
                        var main = virtualclass.getTemplate('ssmainDiv');
                        var roleControl = {
                            control: hascontrol,
                            recImg: recImgPlay,
                            scrctrl : viewcontrol
                        };

                        var mainConthtml = main(roleControl);

                        // $('#virtualclassAppLeftPanel').append(mainConthtml);

                        virtualclass.vutil.insertAppLayout(mainConthtml);

                        if(roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing){
                            var ss = document.querySelector('#virtualclassCont  #stopScreenShare');
                            if(ss){
                                ss.addEventListener("click",function(){
                                    virtualclass.vutil.initDefaultApp();
                                })
                            }
                        }

                         if(viewcontrol){
                            this.html.initScreenController();
                        }
                         var app= document.querySelector(".congrea #virtualclassApp");
                        if(!hascontrol){

                             if(!app.classList.contains('zoomCtr')){
                                 app.classList.add("zoomCtrAdd");
                             }

                        }else{
                            app.classList.remove("zoomCtrAdd");
                        }

                        function css(element, styles) {
                            if (typeof styles == 'string') {
                                element.style.cssText += ';' + styles;
                            }
                        }
                        if(roles.hasControls() && virtualclass.gObj.studentSSstatus.mesharing) {
                            var that  = this;

                            setTimeout(() => {
                                var elem = document.querySelector('#screenController .share');
                                if(virtualclass.gObj.studentSSstatus.shareToAll){
                                    that.html.changeSsInfoSelf(elem);
                                    var view = 'sToAll';
                                }else {
                                    that.html.changeSsInfoShareToAll(elem);
                                    var view = 'sview';
                                }
                                ioAdapter.mustSend({'cf': view, firstSs : true});

                            }, 2000);

                            var ss = document.querySelector('#virtualclassCont  #stopScreenShare');
                            if(ss){
                                ss.addEventListener("click",function(){
                                    virtualclass.vutil.initDefaultApp();
                                    var cont = document.querySelector("#virtualclassCont.studentScreenSharing")
                                    if(cont){
                                        cont.classList.remove("studentScreenSharing");
                                        document.querySelector('#chat_div').classList.remove('studentScreenSharing');
                                    }
                                    virtualclass.vutil.removeStudenScreenStatus();
                                })
                            }
                        }
                    // return mainCont;
                },

                initScreenController : function (){
                    var elem =  document.querySelector('#screenController .share');
                    if(elem != null){
                        var that = this;
                        elem.onclick = function(elem){
                            var share;
                            var classList = elem.currentTarget.classList;
                            if(classList.contains('selfView')){ // Screen is sharing to all
                                that.changeSsInfoSelf(elem.currentTarget);
                                share = 'sToAll';
                            }else if(classList.contains('shareToAll')){ // Screen is sharing to self
                                that.changeSsInfoShareToAll(elem.currentTarget);
                                share = 'sview';
                            }
                            ioAdapter.mustSend({'cf': share});
                        }
                    }
                },

                changeSsInfoSelf : function (elem){
                    elem.classList.remove('selfView');
                    elem.classList.add('shareToAll');
                    elem.children[0].innerHTML = virtualclass.lang.getString('selfview'); // for next time
                    virtualclass.gObj.studentSSstatus.shareToAll = true;
                },

                changeSsInfoShareToAll : function (elem){
                    elem.classList.remove('shareToAll');
                    elem.classList.add('selfView');
                    elem.children[0].innerHTML = virtualclass.lang.getString('sharetoall'); // for next time
                    virtualclass.gObj.studentSSstatus.shareToAll = false;
                },

                /**
                 * @param container object containg width and height property
                 * @aspectRatio a fractional value
                 * @return  an object containing modified width and height
                 */
                getDimension: function (container, aspectRatio) {
                    var aspectRatio = aspectRatio || (3 / 4),
                        height = (container.width * aspectRatio),
                        res = {};

                    return {
                        height: container.height,
                        width: container.width
                    };
                }
            },
            // to initialize previous image
            initPrevImage: function () {
                sworker.postMessage({'initPrevImg': true});
            },

            setCurrentApp : function (){
                if(virtualclass.hasOwnProperty('previous') && typeof virtualclass.previous != 'undefined'){
                    virtualclass.currApp = virtualclass.previous.slice(12);
                    virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
                }
            },

            getScale : function (baseWidth, givenWidth){
                console.log('Screen type base width ' + baseWidth);
                 var newScale = givenWidth / baseWidth;
                 return newScale;
            },


            initShareScreen (sType, setTime){
                if (typeof virtualclass.getDataFullScreen == 'function') {
                    if(virtualclass.gObj.hasOwnProperty('sendScreen')){
                        clearTimeout(virtualclass.gObj.sendScreen);
                    }

                    virtualclass.gObj.sendScreen = setTimeout(
                        function (){
                            sType = virtualclass.getDataFullScreen(sType);
                            var createdImg = virtualclass.getDataFullScreen('ss');
                            ioAdapter.sendBinary(createdImg);
                            virtualclass.vutil.informIamSharing();
                            sType = null;
                            console.log('Send full-screen image');
                        },setTime
                    );
                }
            }
        }
    };
    window.studentScreen = studentScreen;
    window.screenShare = screenShare;
})(window);
