/**
 * This file is responsible  for getting  teacher/host video
 * and send it other participates and, if participate in firefox Browser
 * then it converst webp images to png images for enable the video in
 * firefox as well
 */

var BASE64_MARKER = ';base64,';
var videoHost = {
    gObj: {},


    setDefaultValue: function (speed) {
        virtualclass.videoHost.gObj.MYSPEED = speed || 1;
        virtualclass.videoHost.gObj.teacherVideoQuality = this.getTeacherVideoQuality();
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
        console.log("videoSwitch 1");
        this.gObj.stdStopSmallVid =false;
        this.domReady = false;
        this.allStdVideoOff=false;
        if (roles.hasAdmin()) {

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

            let canvas  = document.createElement('canvas');
            canvas.id = 'dummyCanvas';
            canvas.width = 40;
            canvas.height = 40;
            document.querySelector('#virtualclassApp').appendChild(canvas);

            WebPDecDemo('dummyCanvas');

            this.domReady = true;
        } else {


            this.setCanvasAttr('videoPartCan', 'videoParticipate');
            //this.setCanvasAttr('videoPartCan', 'videoParticipate');
            // this would be used for converting webp image to png image
            WebPDecDemo('videoParticipate');
            virtualclass.videoHost.UI.hideTeacherVideo(); //hideTeacherVideo();

        }

        var rightPanel = document.querySelector('#virtualclassAppRightPanel');
        if(rightPanel != null){
            var teacherVideo = localStorage.getItem('tvideo');
            if(teacherVideo == null){
                teacherVideo = 'show';
            }
            rightPanel.classList.add(teacherVideo);
            if(roles.hasControls()){
                var swVideo = localStorage.getItem('videoSwitch');
                if(swVideo && swVideo == "0"){
                    if(virtualclass.connectedUsers && virtualclass.connectedUsers.length){
                        virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid );
                    }else{
                        virtualclass.gObj.delayVid="display";
                    }
                    virtualclass.videoHost.UI.hideTeacherVideo();
                }

            }else{
                var swVideo = JSON.parse(localStorage.getItem('stdVideoSwitch'));
                if(swVideo){
                    if(virtualclass.connectedUsers && virtualclass.connectedUsers.length){
                        virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid );
                    }else{
                        virtualclass.gObj.delayVid="display";
                    }
                    virtualclass.videoHost.UI.hideTeacherVideo();

                }
                console.log(swVideo);

            }
        }
    },

    renderSelfVideo : function (stream){
        if(typeof virtualclass.media.tempStream == 'undefined'){
            console.log('Media attached stream');
            this.getMediaStream(stream);
        }
    },

    isDomReady : function (cb){
        var that = this;
        if(!this.domReady){
            this.domreadyCheck = setTimeout(
                function (){
                    that.isDomReady(cb);
                },1000
            );
        }else {
            if(this.domreadyCheck !=  null){
                clearTimeout(this.domreadyCheck);
            }
            cb();
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


    onmessage: function (msg) {
        console.log(msg);
        if (msg.congCtr.videoSwitch == "on") {
            virtualclass.videoHost.gObj.videoSwitch = 1;
            console.log("videoSwitch 1");
            this.UI.displayTeacherVideo();
            localStorage.tvideo = 'show';
        } else if (msg.congCtr.videoSwitch == "off") {
            virtualclass.videoHost.gObj.videoSwitch = 0;
            this.UI.hideTeacherVideo();
            localStorage.tvideo = 'hide';
        }
    },

    stdVideoCtrlMsg:function(data){
        var userid = data.fromUser.userid;
        if(data.message.stdVideoCtr.videoSwitch) {
            this.setUserIcon(userid);
        }else{
            this.removeUserIcon(userid);
        }
    },

    toggleVideoMsg:function(action){
        var videoSwitchCont = document.querySelector('#congCtrBar');
        if(action == "enable") {
            videoSwitchCont.style.pointerEvents ="visible";
            videoSwitchCont.style.opacity = "1";
            virtualclass.videoHost.gObj.allStdVideoOff= false;
        }
        else{
            videoSwitchCont.style.pointerEvents = "none";
            videoSwitchCont.style.opacity = "0.5";
            virtualclass.videoHost.gObj.allStdVideoOff= true;
        }
    },
    toggleStdVideoIcon:function(action){
        var swCont = document.querySelector(".congrea .videoSwitchCont")
        var sw  = document.querySelector('.congrea #rightCtlr #videoSwitch');
         if(action == "enable") {
             sw.setAttribute("data-action","disable")
             sw.className ="video on"
             swCont.setAttribute("data-title","Video off");
        }
         else{
             sw.setAttribute("data-action","enable")
             sw.className ="video off";
             swCont.setAttribute("data-title","Video on");

         }
    },

    setUserIcon:function(userid){
        var isVideo = chatContainerEvent.elementFromShadowDom("#ml"+userid+" .user-details a .videoWrapper");
        if(isVideo){
            isVideo.parentNode.removeChild(isVideo);
        }



        var imgCont = chatContainerEvent.elementFromShadowDom("#ml"+userid+" .user-details a")
        var imgElem = chatContainerEvent.elementFromShadowDom("#ml"+userid+" .user-details a span") || chatContainerEvent.elementFromShadowDom("#ml"+userid+" .user-details a img");
        if(!imgElem && imgCont != null){
            if(virtualclass.gObj.chatIconColors[userid] && !virtualclass.gObj.chatIconColors[userid].savedImg ){
                var img = document.createElement('span');
                img.innerHTML= virtualclass.gObj.chatIconColors[userid].initial;
                img.style.backgroundColor=virtualclass.gObj.chatIconColors[userid].bgColor ;
                img.style.color=virtualclass.gObj.chatIconColors[userid].textColor ;
                img.dataset.event = "ub";
                img.classList.add('chat-img','media-object');
                imgCont.appendChild(img);
            }else if(virtualclass.gObj.chatIconColors[userid] && virtualclass.gObj.chatIconColors[userid].savedImg ){
                var img = document.createElement('img');
                img.setAttribute("src",virtualclass.gObj.chatIconColors[userid].savedImg );
                img.classList.add('chat-img','media-object');
                imgCont.appendChild(img);
            }else{
                //todo to add default img
            }
            console.log("set User icon");
        }else{
            console.log("Image container is null");
        }
    },
    removeUserIcon:function(userid){
        console.log("Remove User icon");
         if(virtualclass.gObj.uid == userid){// for self
             var vidContainer = cthis.video.createVideoElement();

             virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);
              var canvas = chatContainerEvent.elementFromShadowDom("#ml"+virtualclass.gObj.uid +" #tempVideo");
              if(!canvas){
                  cthis.video.insertTempVideo(vidContainer);
                  cthis.video.tempVideoInit();
              }
             cthis.video.myVideo = chatContainerEvent.elementFromShadowDom("#video" + virtualclass.gObj.uid);
             cthis.video.myVideo.muted = true;
             virtualclass.adpt.attachMediaStream(cthis.video.myVideo, cthis.video.tempStream);
             // cthis.video.myVideo.muted = true;
             // cthis.stream = cthis.video.tempStream;
             // cthis.video.myVideo.onloadedmetadata = function () {
             //     cthis.video.startToStream();
             //     //virtualclass.precheck.webcam.createVideo();
             // }


         }

    },


    //nirmala
    //todo *to be called only if flag  available in localstorage
    //todo to modify later
    fromLocalStorage: function () {
        var videoSwitch ="";
        if(roles.hasControls()){
             videoSwitch = localStorage.getItem("videoSwitch");
             localStorage.removeItem("videoSwitch");
        }else{
            var stdSwitch = localStorage.getItem("stdVideoSwitch");
            var stdVideoSwitch = (stdSwitch != null && (stdSwitch != 'undefined'))  ? JSON.parse(stdSwitch) : false;

            localStorage.removeItem("stdVideoSwitch");

            let allStdvideo = localStorage.getItem("allStdVideoOff");

            var allStdVideoOff = (allStdvideo != null && allStdvideo != 'undefined' ) ? JSON.parse(allStdvideo) : false;
            virtualclass.videoHost.gObj.allStdVideoOff =allStdVideoOff;
            localStorage.removeItem("stdVideoSwitch");
        }

        /** TODO
         * videoHandler at utility.js and below block should be merged
         * **/
        if (typeof videoSwitch != 'undefined' && videoSwitch) {
            virtualclass.videoHost.gObj.videoSwitch = +videoSwitch;
            if (roles.hasControls()) {
                var sw = document.getElementById("videoSwitch");
                if (sw) {
                    if (+videoSwitch) {
                        if (sw.classList.contains("off")) {
                            sw.classList.add("on");
                            sw.classList.remove("off");
                            console.log('Video controller on');
                        }
                    } else {
                        if (sw.classList.contains("on")) {
                            console.log('Video controller off');
                            sw.classList.add("off");
                            sw.classList.remove("on");
                            if(virtualclass.gObj.meetingMode){
                                virtualclass.multiVideo.setVideoStatus(false);
                            }
                        }
                    }
                }

            }else {
                if(!virtualclass.gObj.meetingMode){
                    if (+videoSwitch) {
                        virtualclass.videoHost.UI.displayTeacherVideo();
                    } else {
                        virtualclass.videoHost.UI.hideTeacherVideo();
                    }
                }
            }
           // localStorage.removeItem("videoSwitch");
        }
        if(!roles.hasControls()){
            if (typeof stdVideoSwitch != 'undefined' && stdVideoSwitch) {
                virtualclass.videoHost.gObj.stdStopSmallVid = stdVideoSwitch;

                    if (stdVideoSwitch) {
                        virtualclass.videoHost.toggleStdVideoIcon('disable');
                        virtualclass.multiVideo.setVideoStatus(false);
                    } else {
                        virtualclass.videoHost.toggleStdVideoIcon('enable');
                    }

            }
            if(virtualclass.videoHost.gObj.allStdVideoOff || ! virtualclass.system.mediaDevices.hasWebcam){
                virtualclass.videoHost.toggleVideoMsg('disable');
            }else{
                if(virtualclass.gObj.videoEnable) {
                    virtualclass.videoHost.toggleVideoMsg('enable');
                }else{
                    virtualclass.videoHost.toggleStdVideoIcon('disable');
                }
            }

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

        //virtualclass.vhAdpt.attachMediaStream(this.videoHostSrc, stream);
        virtualclass.adpt.attachMediaStream(this.videoHostSrc, stream);
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

    shareVideo: function () {
        var resA = 1;
        var resB = 1;

        this.imageSlices = this.getImageSlices(resA, resB);
        var that = this;

        if(videoHost.gObj.hasOwnProperty('shareVideoInterval')){
            clearInterval(videoHost.gObj.shareVideoInterval);
        }

        videoHost.gObj.shareVideoInterval =  setInterval(
            function () {
                if (that.gObj.videoSwitch) {
                    if (io.webSocketConnected()&& virtualclass.system.mediaDevices.hasWebcam){
                       that._shareVideo(that, resA, resB);
                    }
                }
            },
        120);
    },

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
            if (virtualclass.system.webpSupport) {
                var sendimage = that.vidHostSlice.toDataURL("image/webp", 0.6);
                var vidType = 1;
            } else {
                var sendimage = that.vidHostSlice.toDataURL("image/jpeg", 0.3);
                var vidType = 0;
            }

            that.vidHostSliceCon.clearRect(0, 0, that.width, that.height);
            that.sendInBinary(sendimage, vidType);
            // ioAdapter.send({'videoSlice' : sendimage, 'des' : d, 'cf' : 'teacherVideo'});
        }

    },
    sendInBinary: function (sendimage, vidType) {
        sendimage = this.convertDataURIToBinary(sendimage);
        var scode = new Int8Array([21, vidType]); // Status Code teacher video
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
    drawReceivedImage : function(imgData, imgType, d) {
        if(typeof vid0eoPartCont == 'undefined'){
            // canvas2 = document.getElementById('mycanvas2');
            this.videoPartCan = document.getElementById('videoParticipate');
            this.videoPartCont = this.videoPartCan.getContext('2d');
            videoPartCont = true;
        }

        // 371 audio latency of buffered audio
        // for sync the audio and video
        var that = this;

        if(typeof virtualclass.media.audio.Html5Audio != 'undefined'){
               sampleRate = virtualclass.media.audio.Html5Audio.audioContext.sampleRate;
        }else {
            if(typeof sampleRate == 'undefined'){
                sampleRate = new (window.AudioContext || window.webkitAudioContext)().sampleRate;
            }
        }
        if(virtualclass.gObj.isReadyForVideo){
            if(document.querySelector("#virtualclassCont.congrea #videoHostContainer.hide")){
                virtualclass.videoHost.UI.displayTeacherVideo();
            }

        }

        setTimeout(
            function (){
                if (virtualclass.isPlayMode || virtualclass.videoHost.gObj.MYSPEED < 3) {
                    if (virtualclass.system.webpSupport || (imgType == "jpeg")) {
                        var img = new Image();
                        img.onload = function (){
                            that.videoPartCont.drawImage(img, d.x, d.y);
                        };
                        img.src = imgData;
                    } else {
                        if(virtualclass.gObj.isReadyForVideo){
                            virtualclass.gObj.isReadyForVideo = false;
                            loadfile(imgData, that.videoPartCan, that.videoPartCont); // for browsers that do not support webp
                         }
                    }
                }
            }, 260 //((4096/sampleRate)*1000*3)
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

    afterSessionJoin: function () {
        var speed = roles.hasAdmin() ? 1 : virtualclass.videoHost.gObj.MYSPEED;
        this.setDefaultValue(speed);
        // this.initVideoInfo();

        virtualclass.network.initToPing(10000); // Wait 10 seconds for everything to be ready
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
            btn.innerHTML = virtualclass.lang.getString('prechkcmplt');
        }

        var skip =   document.querySelector('#preCheckcontainer .skip');
        if(skip){
            skip.addEventListener('click', function () {
                micTesting.makeAudioEmpty();
                var virtualclassPreCheck = document.getElementById('preCheckcontainer');
                virtualclassPreCheck.style.display = 'none';
                var virtualclassApp = document.getElementById('virtualclassApp');
                virtualclassApp.style.display = 'block';
                // localStorage.setItem('precheck', true);
                virtualclass.videoHost._resetPrecheck();

            });

        }
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
                    if (typeof virtualclass.precheck[elem] != 'undefined' && virtualclass.precheck[elem].hasOwnProperty('alreadyDone')) {
                        if(elem == 'mic'){
                            delete virtualclass.precheck[elem].alreadyDone;
                        }

                    }
                })

            }
        }

   },

    UI: {
        displayTeacherVideo: function () {
            if(!virtualclass.gObj.meetingMode){
                var host = document.querySelector(".congrea #videoHostContainer");
                host.classList.add("show")
                host.classList.remove("hide");
                var rightbar = document.querySelector(".congrea #virtualclassAppRightPanel");
                rightbar.classList.add("vidShow")
                rightbar.classList.remove("vidHide")
            }

        },

        hideTeacherVideo: function () {
            if(!virtualclass.gObj.meetingMode){
                var host = document.querySelector(".congrea #videoHostContainer");
                host.classList.remove("show");
                host.classList.add("hide");
                var rightbar = document.querySelector(".congrea #virtualclassAppRightPanel");
                rightbar.classList.add("vidHide")
                rightbar.classList.remove("vidShow")
            }
        }
    }
};
