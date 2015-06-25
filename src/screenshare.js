/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 */

(function (window) {
    "use strict";
    var changeonresize, resizecalled, prvWidth, prvHeight, prvVWidth, prvVHeight, app, dim;
    function callback(error) {
        virtualclass.vutil.initInstallChromeExt(error);
    }

    var studentScreen = function () {
        return {
            ssProcess: function (data_pack, msg, stype, sTool) {
                var mycase = data_pack[0];
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
                        var s = 7;
                        for (var i = 0; (i + 7) <= data_pack.length; i = l + 1) {
                            x = virtualclass.vutil.numValidateTwo(data_pack[i + 1], data_pack[i + 2]);
                            y = virtualclass.vutil.numValidateTwo(data_pack[i + 3], data_pack[i + 4]);
                            h = parseInt(data_pack[i + 5]);
                            w = parseInt(data_pack[i + 6]);
                            l = s + (h * w) - 1;
                            recmsg = data_pack.subarray(s, l + 1);
                            var d = {x: x, y: y, w: w, h: h};
                            this.initStudentScreen(recmsg, d, stype, sTool);
                            s = l + 7 + 1;
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

            initStudentScreen: function (imgData, d, stype, stool) {

//                io.dataBinaryStore(imgData); //storing received screen

                virtualclass.vutil.addClass('audioWidget', "fixed");
                app = stype;
                if (typeof virtualclass[app] != 'object') {
                    if (typeof vtype != 'undefined') {
                        virtualclass.recorder.recImgPlay = true;
                    }
                    virtualclass.makeAppReady(stool);
                } else {

                    virtualclass.vutil.hidePrevIcon(app);

//                     var prvScreen = document.getElementById(virtualclass.previous);
//                     if(prvScreen != null){
//                         prvScreen.style.display = 'none';
//                         document.getElementById(virtualclass[app].id).style.display = 'block';
//                     }
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

                    if (d.hasOwnProperty('x')) {
                        virtualclass[app].drawImages(imgData, d);
                    } else {
                        if (d.hasOwnProperty('w')) {
                            virtualclass[app].localCanvas.width = d.w;
                            virtualclass[app].localCanvas.height = d.h;
                        }
                        virtualclass[app].drawImages(imgData);
                    }
                }

                virtualclass.previous = virtualclass[app].id;
            }
        }
    };

    var screenShare = function (config) {
        virtualclass.getSceenFirefox = function () {
            var ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
            if (ffver >= 33) {
                var constraints = {
                    video: {
                        mozMediaSource: 'window',
                        mediaSource: 'window'
                    }
                };
                virtualclass.adpt = new virtualclass.adapter();
                var navigator2 = virtualclass.adpt.init(navigator);

                navigator2.getUserMedia(constraints, function (stream, err) {
                        //callback(err, stream);
                        virtualclass.ss._init();
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
                    },

                    function (error) {
                        if (typeof error == 'string') {
                            //PERMISSION_DENIED
                            if (error === 'PERMISSION_DENIED') {
                                //this url is need to be changed
                                window.open("https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/").focus();
                            }
                        } else if (typeof error == 'object') {   //latest firefox
                            if (error.name === 'PermissionDeniedError') {
                                window.open("https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/").focus();
                            }
                        }
                    }
                );
            } else {
                alert(virtualclass.lang.getString('notSupportBrowser', [ffver]));
            }
        };

        return {
            prevStream: false,
            init: function (screen) {

                this.type = screen.type;
                this.ssByClick = true;
                this.manualStop = false;
                //if(virtualclass.gObj.uRole == 't' && !virtualclass.hasOwnProperty('repType')){
                if (virtualclass.gObj.uRole == 't' && !virtualclass.recorder.recImgPlay) {
                    //if(!virtualclass.hasOwnProperty('repType')){
                    this.readyTostart(screen.app);
                    //}
                } else {
                    this._init();
                }
            },

            //called when user select the screencall
            _init: function () {
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
//                    alert('suman bogati');
//                    debugger;
                    ssUI = this.html.UI.call(this, virtualclass.gObj.uRole);
                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                    document.getElementById(virtualclass.html.id).insertBefore(ssUI, beforeAppend);

                    if (virtualclass.gObj.uRole == 't' && !virtualclass.recorder.recImgPlay) {
                        virtualclass.vutil.initLocCanvasCont(this.localTemp + "Video");
                    }
                }
            },

            readyTostart: function (app) {
                if (app == virtualclass.apps[1]) {
                    this.getScreen();
                }

            },

            onError: function (e) {
                console.log("Error " + e);
            },

            getScreen: function (callback) {

//                alert(chrome.desktopCapture);
//                debugger;
                if (virtualclass.system.mybrowser.name == 'Chrome') {
                    if (virtualclass.gObj.hasOwnProperty('ext') && virtualclass.gObj.ext) {
                        window.postMessage({type: 'getScreen', id: 1}, '*');
                    } else {
                        var url = 'https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl';
                        chrome.webstore.install(url, function () {
                            window.location.reload();
                        });
                    }
                } else if (virtualclass.system.mybrowser.name == 'Firefox') {
                    virtualclass.getSceenFirefox();
                }
            },

            unShareScreen: function () {
                this.video.src = "";
                this.localtempCont.clearRect(0, 0, this.localtempCanvas.width, this.localtempCanvas.height);
                clearInterval(virtualclass.clear);
                //this.prevImageSlices = [];
                this.initPrevImage();

                if (this.hasOwnProperty('currentStream')) {
                    this.currentStream.stop();
                }

              virtualclass.vutil.beforeSend({'unshareScreen': true, st: this.type});
            },

            removeStream: function () {
                virtualclass.vutil.removeClass('audioWidget', "fixed");
                this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
            },

            initializeRecorder: function (stream) {
                virtualclass.vutil.addClass("audioWidget", "fixed");
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

                if (this.video.tagName != "VIDEO") {
                    var earlierVideo = this.video;
                    var video = document.createElement('video');
                    video.id = earlierVideo.id;
                    this.video.parentNode.replaceChild(video, this.video);

                    this.video = document.getElementById(this.local + "Video");
                    this.video.autoplay = true;
                    virtualclass.vutil.createLocalTempVideo("virtualclassScreenShare", this.local + "Temp");
                    virtualclass.vutil.initLocCanvasCont(this.local + "Temp" + "Video");
                }
                this.currentStream = stream;
                var that = this;

                console.log("video changed");

                virtualclass.adpt.attachMediaStream(this.video, stream);
                this.prevStream = true;

                this.currentStream.onended = function (name) {
                    if (that.ssByClick) {
                        that.video.src = "";
                        that.localtempCont.clearRect(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                        clearInterval(virtualclass.clear);
                        //that.prevImageSlices = [];
                        that.initPrevImage();
                      virtualclass.vutil.beforeSend({'unshareScreen': true, st: that.type});
                        that.prevStream = false;
                        that.prevScreen = "";
                        virtualclass.prevScreen = ""; //todo:- that.prevScreen and virtualclass.prevScreen should be same
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

                    if (virtualclass.gObj.uRole == 't') {
                        //TODO This should be invoke at one place
                        virtualclass.vutil.makeActiveApp(that.id, virtualclass.previrtualclass);
                        if (virtualclass.previrtualclass == 'virtualclassYts') {
                            virtualclass.yts.destroyYT();
                        }

                    }
                    virtualclass.previrtualclass = that.id;
                }
            },
            sharing: function () {
                var tempObj, encodedData, stringData, d, matched, imgData;
                var resA = Math.round(this.localtempCanvas.height / 12);
                var resB = Math.round(this.localtempCanvas.width / 12);
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

                var screenIntervalTime = 1000;
                var pscreenIntervalTime = 1000;

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

                function breakintobytes(val, l) {
                    var numstring = val.toString();
                    for (var i = numstring.length; i < l; i++) {
                        numstring = '0' + numstring;
                    }
                    var parts = numstring.match(/[\S]{1,2}/g) || [];
                    return parts;
                }

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

                function calcBandwidth(localBandwidth) {
                    if (localBandwidth <= 400 || typeof localBandwidth == 'undefined') {
                        screenIntervalTime = 400;
                    } else if (localBandwidth >= 10000) {
                        screenIntervalTime = localBandwidth / 2;
                    }
                    else {
                        screenIntervalTime = localBandwidth;
                    }
                    // Avoid Sharp Curve
                    if ((pscreenIntervalTime * 4) < screenIntervalTime) {
                        screenIntervalTime = pscreenIntervalTime * 4;
                    }
//                    console.log ('Bandwidth '+ localBandwidth+'Kbps' + 'New Time ' + screenIntervalTime);
                    if (screenIntervalTime > 400) {
                        console.trace();
                    }
                    pscreenIntervalTime = screenIntervalTime;
                }

                function sendResizeWindow() {
                    console.log('RESIZE');
                    prvVWidth = that.video.offsetWidth;
                    prvVHeight = that.video.offsetHeight;
                    resA = Math.round(that.localtempCanvas.height / 12);
                    resB = Math.round(that.localtempCanvas.width / 12);
                    var createdImg = getDataFullScreenResize(that.type);
                    io.sendBinary(createdImg);
                    calcBandwidth(createdImg.length / 128); // In Kbps
                    changeonresize = 0;
                    clearInterval(virtualclass.clear);
//                    console.log ('RESIZE Bandwidth '+ (createdImg.length / 128)+'Kbps' + 'New Time ' + screenIntervalTime);
                    virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
                }

                function w(val, l) {
                    var numstring = val.toString();
                    for (var i = numstring.length; i < l; i++) {
                        numstring = '0' + numstring;
                    }
                    var parts = numstring.match(/[\S]{1,2}/g) || [];
                    return parts;
                }

                function sendDataImageSlices(type) {
                    var localBandwidth = 0;
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
                                io.sendBinary(createdImg);
                                var localBandwidth = (createdImg.length / 128); // In Kbps
                            } else if (e.data.masterSlice != null) {
                                io.sendBinary(e.data.masterSlice);
                                var localBandwidth = (e.data.masterSlice.length / 128); // In Kbps
                            }
                            calcBandwidth(localBandwidth);
                        }

                    }
                    clearInterval(virtualclass.clear);
                    virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
                }

                clearInterval(virtualclass.clear);
                virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
            },
            getContainerDimension: function () {
                var vidCont = document.getElementById(this.id + "Local");
                return {width: vidCont.offsetWidth, height: vidCont.offsetHeight};
            },
            drawImages: function (rec, d) {
                if (typeof d != 'undefined') {
                    var imgData = this.dc.decodeRGBSlice(rec, this.localCont, d);
                    this.localCont.putImageData(imgData, d.x, d.y);
                } else {
                    var imgData = this.dc.decodeRGB(rec, this.localCont, this.localCanvas);
                    this.localCont.putImageData(imgData, 0, 0);
                }
            },
            drawSingleImage: function (rec) {
                var imgData = this.dc.decodeRGB(rec, this.localCont, this.localCanvas);
                this.localCont.putImageData(imgData, 0, 0);
            },
            dimensionStudentScreen: function (cWidth, cHeight) {
                this.localCanvas = document.getElementById(virtualclass[app].local + "Video");
                this.localCont = virtualclass[app].localCanvas.getContext('2d');
                this.localCanvas.width = cWidth;
                this.localCanvas.height = cHeight;
                console.log("normal width " + this.localCanvas.width);
            },
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

                //if (virtualclass.previous != 'virtualclassWhiteboard') {
                //    virtualclass.vutil.setScreenInnerTagsWidth(virtualclass.previous);
                //}
            },
            html: {
                UI: function (user) {
                    var mainCont = virtualclass.vutil.createDOM("div", this.id, [this.className]);
                    var locVidCont = virtualclass.vutil.createDOM("div", this.local, [this.label]);
                    if ((user == 't')) {

                        //if(virtualclass.hasOwnProperty('repType')){
                        if (virtualclass.recorder.recImgPlay) {
                            var vidCont = virtualclass.vutil.createDOM("canvas", this.local + "Video");
                            //vidCont.setAttribute("autoplay", true);
                        } else {
                            var vidCont = virtualclass.vutil.createDOM("video", this.local + "Video");
                            vidCont.setAttribute("autoplay", true);
                        }

                        css(locVidCont, "position:relative");

                    } else {
                        var vidCont = virtualclass.vutil.createDOM("canvas", this.local + "Video");
                    }

                    locVidCont.appendChild(vidCont);
                    mainCont.appendChild(locVidCont);

                    if (user == 't' && !virtualclass.recorder.recImgPlay) {
                        virtualclass.vutil.createLocalTempVideo(mainCont, this.localTemp);
                    }

                    function css(element, styles) {
                        if (typeof styles == 'string') {
                            element.style.cssText += ';' + styles;
                        }
                    }

                    return mainCont;
                },
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

            initPrevImage: function () {
                sworker.postMessage({'initPrevImg': true});
            }
        }
    };
    window.studentScreen = studentScreen;
    window.screenShare = screenShare;
})(window);
