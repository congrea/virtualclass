/**
 * This file is responsible  for getting  teacher/host video
 * and send it other participates and, if participate in firefox Browser
 * then it converst webp images to png images for enable the video in
 * firefox as well
 */

var BASE64_MARKER = ';base64,';

var videoHost = {
    gObj: {},
    // Contain all the related variables
    //
    //
    //gObj : {
    //    MYSPEED : 1,
    //    MYSPEED_COUNTER : 0,
    //    time_diff : 0,
    //    teacherVideoQuality : 16,
    //    video_count : 0
    //},


    setDefaultValue: function (speed) {
        virtualclass.videoHost.gObj.MYSPEED = speed || 1;
        virtualclass.videoHost.gObj.MYSPEED_COUNTER = 0;
        virtualclass.videoHost.gObj.time_diff = 0;
        virtualclass.videoHost.gObj.teacherVideoQuality = this.getTeacherVideoQuality();
        virtualclass.videoHost.gObj.video_count = 0;
    },
    /**
     * initialize various actions like, for get user media,
     * set dimension for various canvas,
     * @param width expects width for various canvas
     * @param height expects width for various canvas
     */
    init: function (width, height) {
        this.sl = 0;
        this.width = width;
        this.height = height;
        this.gObj.videoSwitch = 1;//nirmala
        if (roles.hasAdmin()) {
            if ((virtualclass.system.mybrowser.name == 'Chrome')) {
                this._init();
                //var session = { audio: false, video: { width: width, height: height } };
                /*
                 var session = {
                 audio: false,
                 video: {
                 width: {ideal: width, max: 320 },
                 height: { ideal: height, max: 240 }
                 }
                 }; */

                var session = {
                    audio: false,
                    video: true
                };


                var that = this;

                virtualclass.vhAdpt = virtualclass.adapter();
                var cNavigator = virtualclass.vhAdpt.init(navigator);
                cNavigator.getUserMedia(session, function (stream) {
                    that.getMediaStream(stream);
                }, this.onError);
                this.UI.controller();//nirmala
            }
        } else {
            this.setCanvasAttr('videoPartCan', 'videoParticipate');
            //this.setCanvasAttr('videoPartCan', 'videoParticipate');
            // this would be used for converting webp image to png image
            WebPDecDemo('videoParticipate');
        }
    },
    /**
     * Initialsize the various canvas attribute
     *  for slice canvas, host canvas and participate canvas
     * @private
     */
    _init: function () {
        // Canvas for host/teacvher
        this.setCanvasAttr('vidHost', 'videoHost');

        this.setCanvasAttr('vidHostSlice', 'videoHostSlice');
        this.vidHostSlice.globalAlpha = 0.5;
        this.vidHostSlice.globalCompositeOperation = "multiply";
    },
    //nirmala
    videoHandler: function (that) {
        var video;
        if (that.classList.contains("on")) {
            that.classList.remove("on");
            that.classList.add("off");
            virtualclass.videoHost.gObj.videoSwitch = 0;
            video = "off";
        } else {
            that.classList.remove("off");
            that.classList.add("on");
            virtualclass.videoHost.gObj.videoSwitch = 1;
            video = "on"
        }

        ioAdapter.mustSend({'congCtr': {videoSwitch: video}, 'cf': 'congController'});

    },
    //nirmala
    onmessage: function (msg) {
        console.log(msg);
        if (msg.congCtr.videoSwitch == "on") {
            virtualclass.videoHost.gObj.videoSwitch = 1;
            this.UI.displayVideo();

        } else if (msg.congCtr.videoSwitch == "off") {
            virtualclass.videoHost.gObj.videoSwitch = 0;            this.UI.hideVideo();

        }

    },
    //nirmala 
    //todo *to be called only if flag  available in localstorage
    //todo to modify later
    fromLocalStorage: function () {
        var videoSwitch = localStorage.getItem("videoSwitch");
        if (typeof videoSwitch != 'undefined' && videoSwitch) {
            virtualclass.videoHost.gObj.videoSwitch = +videoSwitch;

            if (roles.hasControls()) {
                var sw = document.getElementById("videoSwitch");
                if (sw) {
                    if (+videoSwitch) {
                        if (sw.classList.contains("off")) {
                            sw.classList.add("on");
                            sw.classList.remove("off");
                        }
                    } else {
                        if (sw.classList.contains("on")) {
                            sw.classList.add("off");
                            sw.classList.remove("on");
                        }

                    }
                }

            } else {
                if (+videoSwitch) {
                    virtualclass.videoHost.UI.displayVideo();
                } else {
                    virtualclass.videoHost.UI.hideVideo();
                }
            }
            localStorage.removeItem("videoSwitch");
        }

    },
    /** Setting canvas attribut like
     * width, height, context etc
     * @param canvas expect key for canvas
     * @param id expects canvas id
     */
    setCanvasAttr: function (canvas, id) {
        this[canvas] = document.getElementById(id);
        this[canvas].width = this.width;
        this[canvas].height = this.height;
        this[canvas + 'Con'] = this[canvas].getContext('2d');

    },
    /**
     *  Getting the stream for teacher/host video
     *  @param stream expects medea stream, eventually converts into video
     */
    getMediaStream: function (stream) {
        this.videoHostSrc = document.getElementById("videoHostSource");
        this.videoHostSrc.width = this.width;
        this.videoHostSrc.height = this.height;

        virtualclass.vhAdpt.attachMediaStream(this.videoHostSrc, stream);
        var that = this;
        setTimeout(
                function () {
                    that.shareVideo();
                }, 2000
                );
    },
    /**
     * It shares the video,
     * It gets the user picture in various slices according to resolution
     * and send it to other users
     */

    //nirmala
    shareVideo: function () {
        var resA = 1;
        var resB = 1;

        this.imageSlices = this.getImageSlices(resA, resB);
        var that = this;
        setInterval(
                function () {
                    if (that.gObj.videoSwitch) {
                        that._shareVideo(that, resA, resB);
                    }

                },
                120
                );
    },
    //nirmala
    _shareVideo: function (that, resA, resB) {
        for (that.sl = 0; that.sl < (resA * resB); that.sl++) {
            that.vidHostCon.drawImage(that.videoHostSrc, 0, 0, that.width, that.height);
            var d = that.imageSlices[that.sl];
            var imgData = that.vidHostCon.getImageData(d.x, d.y, d.w, d.h);
            that.vidHostSliceCon.putImageData(imgData, d.x, d.y);
        }

        if (that.sl == resA * resB) {
            var d = {x: 0, y: 0};
            // you increase the the value, increase the quality
            // 0.4 and 9 need 400 to 500 kb/persecond
            var sendimage = that.vidHostSlice.toDataURL("image/webp", 0.6);
            that.vidHostSliceCon.clearRect(0, 0, that.width, that.height);
            that.sendInBinary(sendimage);
            // ioAdapter.send({'videoSlice' : sendimage, 'des' : d, 'cf' : 'teacherVideo'});
        }


    },
    sendInBinary: function (sendimage) {
        sendimage = this.convertDataURIToBinary(sendimage);
        var scode = new Int8Array([21]); // Status Code teacher video
        var sendmsg = new Int8Array(sendimage.length + scode.length);
        sendmsg.set(scode);
        sendmsg.set(sendimage, scode.length); // First element is status code (101)
        ioAdapter.sendBinary(sendmsg);
    },
    convertDataURIToBinary: function (dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;

    },
    /**
     * The teacher/host video is shown at participate side
     * @param imgData expects image which has to be drawn
     * @param d expects destination x and y
     */
    drawReceivedImage : function(imgData, d) {
        if(typeof videoPartCont == 'undefined'){
            // canvas2 = document.getElementById('mycanvas2');
            this.videoPartCan = document.getElementById('videoParticipate');
            this.videoPartCont = this.videoPartCan.getContext('2d');
            videoPartCont = true;
        }

        // 371 audio latency of buffered audio
        // for synch the audio and video
        var that = this;
        setTimeout(
            function (){
                if(virtualclass.system.mybrowser.name == 'Chrome'){
                    var img = new Image();
                    img.onload = function (){
                        that.videoPartCont.drawImage(img, d.x, d.y);
                    }
                    img.src = imgData;
                } else {
                    loadfile(imgData, that.videoPartCont); // for firefox
                }
            }, myVideoDelay = (16382/virtualclass.gObj.video.audio.Html5Audio.audioContext.sampleRate)*1000*4
        );
    },
    onError: function (err) {
        console.log('MediaStream Error ' + err);
    },
    /**
     *
     * @param resA, resB defines the total number of slices of images
     * returns the array which has slices of image,
     * each slice has x, y, width and height of image
     */
    getImageSlices: function (resA, resB) {
        //resB ==  y
        //resA ==  x
        var imgSlicesArr = [];
        var totLen = resA * resB;
        var width = Math.floor(this.vidHost.width / resB);
        var height = Math.floor(this.vidHost.height / resA);

        for (var i = 0; i < totLen; i++) {
            var eachSlice = this._getSingleSliceImg(i, width, height, resA, resB);
            imgSlicesArr.push(eachSlice);
        }
        return imgSlicesArr;
    },
    /** Getting the single slice of image according to given i
     *
     * @param i
     * @param width of single slice of image
     * @param height of single slice of image
     * @param resA, resB defines the total number of slices
     * @returns the an image block from where it should strart by given x and y,
     * and height and width of that single image
     */
    _getSingleSliceImg: function (i, width, height, resA, resB) {
        var imgSlice = {};
        var x, y, cx, cy, ci = 0;

        if (i == 0) {
            x = 0;
            y = 0;
        } else {
            cx = i % resB; // for x
            cy = Math.floor(i / resB); // for y

            x = cx * width;
            y = cy * height;
            ;
        }
        return {'x': x, 'y': y, 'w': width, 'h': height}
    },
    Uint8ToString: function (u8a) {
        var CHUNK_SZ = 0x8000;
        var c = [];
        for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
            c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
        }
        return c.join("");
    },
    updateVideoInfo: function (speed, frameRate, latency) {
        //   console.log("frame rate " + frameRate);

        if (speed == 1) {
            speed = "high";
        } else if (speed == 2) {
            speed = "medium";
        } else if (speed == 3) {
            speed = "low";
        }

        if (frameRate >= 6) {
            frameRate = "high";
        } else if (frameRate >= 2) {
            frameRate = "medium";
        } else if (frameRate >= 0) {
            frameRate = "low";
        }

        if (latency >= 1000) {
            latency = "slow";
        } else if (latency >= 700) {
            latency = "medium";
        } else {
            latency = "fast";
        }

        var videoSpeed = document.getElementById('videSpeedNumber');
        if(videoSpeed){
            videoSpeed.dataset.suggestion = speed;
        }

        // todo to  validate
        var videoFrameRate = document.getElementById('videoFrameRate');
        if(videoFrameRate){
            videoFrameRate.dataset.quality = frameRate;
        }

        //videoFrameRate.innerHTML = frameRate;
        // todo to  validate
        var videLatency = document.getElementById('videLatency');
        if(videLatency){
            videLatency.dataset.latency = latency;
        }
        //videLatency.innerHTML =  latency;

    },
    getTeacherVideoQuality: function () {
        virtualclass.videoHost.gObj.teacherVideoQuality = 16;
        var videoHostSource = document.querySelector('#virtualclassCont.teacher #videoHostSource');
        if (videoHostSource != null) {
            if (videoHostSource.src == '') {
                virtualclass.videoHost.gObj.teacherVideoQuality = 0;
            }
        }
        return virtualclass.videoHost.gObj.teacherVideoQuality;
    },
    initVideoInfo: function () {
        var that = this;
        if (roles.hasAdmin() && virtualclass.system.mybrowser.name == 'Firefox') {
            virtualclass.vutil.removeVideoHostContainer();
        } else {
            that.videoInfoInterval =  setInterval(
                function () {
                    // MYSPEED, internet connection
                    //  virtualclass.videoHost.gObj.video_count, frame rate
                    // time_diff, Latency

                    if (roles.hasAdmin()) {
                        virtualclass.videoHost.gObj.video_count = virtualclass.videoHost.gObj.teacherVideoQuality;
                    }
                    //for now, we are disabling the video infor

                    virtualclass.videoHost.updateVideoInfo(virtualclass.videoHost.gObj.MYSPEED, virtualclass.videoHost.gObj.video_count, virtualclass.videoHost.gObj.time_diff);
                    //
                }, 1000
            );

        }
    },
    afterSessionJoin: function () {
        var speed = roles.hasAdmin() ? 1 : virtualclass.videoHost.gObj.MYSPEED;
        this.setDefaultValue(speed);
        // this.initVideoInfo();

        setInterval(
                function () {
                    //console.log("Video Frame Rate :" +  virtualclass.videoHost.gObj.video_count);
                    virtualclass.videoHost.gObj.video_count = 0;
                }, 1000
                );

        setInterval(
                function () {
                    ioAdapter.sendPing();
                }, 1000
                );
        //nirmala
        this.fromLocalStorage();
        this.resetPrecheck();

    },
    //nirmala
    resetPrecheck: function () {
        this._resetPrecheck();
        var joinSession = document.querySelector('#joinSession .next');
        if (joinSession != null) {
            var btn = document.createElement("button");
            joinSession.parentNode.appendChild(btn);
            joinSession.parentNode.removeChild(joinSession)
            btn.classList.add('precheckComplete', 'btn', 'btn-default');
            btn.innerHTML = "precheck complete"
        }

        var precheck = document.querySelector('#joinSession .precheckComplete');
        precheck.addEventListener('click', function () {
            var virtualclassPreCheck = document.getElementById('preCheckcontainer');
            virtualclassPreCheck.style.display = 'none';

            var virtualclassPreCheck = document.getElementById('preCheckcontainer');
            virtualclassPreCheck.style.display = 'none';

            var virtualclassApp = document.getElementById('virtualclassApp');
            virtualclassApp.style.display = 'block';
            // localStorage.setItem('precheck', true);
            virtualclass.videoHost._resetPrecheck();

        });

    },
    //nirmala
    _resetPrecheck: function () {
        var pbar = document.querySelectorAll('#congProgressbar .active');
        for(var i=0; i<pbar.length; i++){
             if(i>0){
                 pbar[i].classList.remove('active');
             }
        }

        if (pbar.length >0) {
            var matches = document.querySelectorAll("#myModal .precheck");
            var precheckElems = [].slice.call(matches, 0);
            precheckElems.forEach(function (item) {
                item.style.display = "none";
            })
            var info = document.querySelector("#vcBrowserCheck .information");
            if (info) {
                info.parentNode.removeChild(info);
            }

            if (virtualclass.precheck.totalTest) {
                virtualclass.precheck.totalTest.forEach(function (elem) {
                    if (elem.hasOwnProperty('alreadyDone')) {
                        elem.removeAttribute('alreayDone');

                    }
                })

            }

    }

   },
    //nirmala
    UI: {
        controller: function () {
            // var mainctr = document.getElementById("congCtrBar");
            // var swcont = document.createElement("div");
            // swcont.id = "rightCtlr";
            // mainctr.appendChild(swcont);
            //
            // var elem = document.createElement("span");
            // elem.id = "videoSwitch";
            // elem.className = "video on"
            // swcont.appendChild(elem);
            var elem = document.getElementById("videoSwitch");
            if(elem){
                elem.addEventListener("click", function () {
                    virtualclass.videoHost.videoHandler(this);

                })
            }

        },
        displayVideo: function () {
            var host = document.getElementById("videoHostContainer");
            host.style.display = "block";
            virtualclass.view._windowResizeFinished();

        },
        hideVideo: function () {
            var host = document.getElementById("videoHostContainer");
            host.style.display = "none";
            virtualclass.view._windowResizeFinished();


        }

    }
};
