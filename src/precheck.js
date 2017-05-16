var precheck = {
    init : function (){
        // $("#myModal").modal();
        $('#myModal').modal({backdrop: 'static', keyboard: false});

        this.totalTest = ['browser', 'bandWidth', 'webcam', 'speaker', 'mic'];

        //virtualclass.error.push("something wrong happend");

        //this.totalTest = [
        //{curr :'browser', next : 'bandWidth'},
        //{curr :'bandWidth', next:'speaker'},
        //{curr :'speaker', next: 'mic'},
        //{curr :'mic', next : 'webcam'},
        //{curr :'webcam', next : null}
        //]

        //var that = this;

        var preCheckContainer = document.querySelector('#virtualclassCont #preCheckcontainer');
        if(preCheckContainer != null ){
            preCheckContainer.style.display =  'block';
        }

        var virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
        if(virtualclassApp != null ){
            virtualclassApp.style.display =  'none';
        }
        var that = this;
        that.wholeSytemCheck();

        //setTimeout(
        //    function (){
        //        that.wholeSytemCheck();
        //    }, 10000
        //);
    },

    wholeSytemCheck : function () {
        this[this.totalTest[0]].perform();
    },

    _next : function (curr, cb){
        var test = this[curr].next;
        virtualclass.precheck.updateProgressBar(test);
        if(!this[test].hasOwnProperty('alreadyDone')){
            // Only perform the test if it's not already done
            this[test].perform();
        }else {
            // if already done just show the text
            virtualclass.precheck.display('#preCheckcontainer .precheck.'+test);

            if(test == 'speaker'){
                this[test]._play(); //play the audio while next buttong is clicked
            }
        }

        virtualclass.precheck.hide('#preCheckcontainer .precheck.'+curr);
        if(typeof cb != 'undefined'){
            cb();
        }
        this[test].alreadyDone = true;

    },


    _prev : function (curr, cb){
        var test = this[curr].prev;
        virtualclass.precheck.hide('#preCheckcontainer .precheck.'+curr);
        virtualclass.precheck.display('#preCheckcontainer .precheck.'+test);

        document.querySelector('#preCheckcontainer  #preCheckProgress .'+curr).classList.remove('active', 'current');
        document.querySelector('#preCheckcontainer  #preCheckProgress .'+test).classList.add('current');

        if(test == 'speaker'){
            this[test]._play(); //play the audio while previous button is clicked
        }

        if(typeof cb != 'undefined'){
            cb();
        }
    },

    display : function (selector){
        document.querySelector(selector).style.display = 'block';
    },

    hide : function (selector){
        document.querySelector(selector).style.display = 'none';
    },

    createMessage : function (selector, msg, msgType){
        var divErr = document.createElement('div');
        divErr.className = msgType;
        divErr.innerHTML = msg;
        document.querySelector(selector).appendChild(divErr);

    },

    initHandler : function (selector, currSec, cb){
        var that = this;
        var nextButton = document.querySelector(selector);
        if(nextButton != null){
            nextButton.addEventListener('click', function (){
                //alert(this.className);

                if(this.classList.contains('next')){
                    virtualclass.precheck._next(currSec);
                }else if(this.classList.contains('prev')){
                    virtualclass.precheck._prev(currSec);
                }

                if(typeof cb != 'undefined'){
                    cb();
                }
            });
        }
    },

    browser : {
        curr: 'browser',
        next :  'bandwidth',

        // TODO This should be simplyfied with isSystemCompatible() function at isSystemCompatible()

        perform : function (){
            // virtualclass.precheck.updateProgressBar(this.curr);
            var preCheck = "#preCheckcontainer .precheck";

            virtualclass.precheck.display(preCheck +  '.'+this.curr);
            var msgSelector = preCheck + ' .result';

            if (virtualclass.error.length > 0) {
                var errorMsg = (virtualclass.error.length > 1) ? (virtualclass.error.join("<br />")) : virtualclass.error[0];
                virtualclass.precheck.createMessage(msgSelector, errorMsg, 'error');
            }


            if(virtualclass.system.mybrowser.name != 'Chrome'){
                var msg =  virtualclass.lang.getString('notsupportbrowser', [virtualclass.system.mybrowser.name]);
                if(roles.hasAdmin()){
                    virtualclass.vutil.removeVideoHostContainer();
                }
            }else {
                var msg =  virtualclass.lang.getString('congreainchrome');
            }

            virtualclass.precheck.createMessage(msgSelector, msg, 'information');

            //var nextButton =  document.querySelector(preCheck+ this.curr + 'Next .next');

            virtualclass.precheck.initHandler((preCheck+ ' #'+this.curr + 'Buttons .next'), this.curr);

           // document.querySelector(preCheck + ' .progress').innerHTML = virtualclass.lang.getString(this.curr + 'testcomp');
            //preCheck.innerHTML = virtualclass.lang.getString(this.curr + 'testcomplete');


        }
    },

    bandwidth : {
        prev : 'browser',
        curr: 'bandwidth',
        next :  'speaker',
        perform : function (){
            var preCheck = "#preCheckcontainer .precheck";

            // virtualclass.precheck.updateProgressBar(this.curr);
            virtualclass.precheck.display('#preCheckcontainer .precheck.'+this.curr);
            var that = this;

            //virtualclass.precheck._perform(4000, that.curr); // till the development is going on

            //virtualclass.precheck.initHandler((preCheck+ ' #'+that.curr + 'Buttons .prev'), that.curr);
            //virtualclass.precheck.initHandler((preCheck+ ' #'+that.curr + 'Buttons .next'), that.curr);
            //return;

            // inspired from
            // http://stackoverflow.com/questions/5529718/how-to-detect-internet-speed-in-javascript

            var msgSelector = '#preCheckcontainer .precheck.'+this.curr+' .result';
             this.imageAddr = window.whiteboardPath + "images/bandwidth-check.jpeg";
            //this.imageAddr = 'https://raw.githubusercontent.com/sumanbogati/html_css/master/bandwidth-check.jpeg';
            this.downloadSize = 1000000; // bytes


            var that = this;
            this.measureConnectionSpeed(function (speedKbps){

                document.querySelector(msgSelector).innerHTML = "";
                var bandWidthText = that.bandWidthInWords(speedKbps);
                msgSelector.innerHTML = "";

                var bandWidthMsg = virtualclass.lang.getString(bandWidthText+'BandWidthSpeed');

                virtualclass.precheck.createMessage(msgSelector, bandWidthMsg, 'information');

                //document.querySelector(preCheck + '.'+that.curr+' .progress').innerHTML = virtualclass.lang.getString(that.curr + 'testcomp');

                virtualclass.precheck.initHandler((preCheck+ ' #'+that.curr + 'Buttons .prev'), that.curr);
                virtualclass.precheck.initHandler((preCheck+ ' #'+that.curr + 'Buttons .next'), that.curr);

            });
        },

        bandWidthInWords : function (speed){
            console.log('bandwidth speed ' + speed);
            var bandwidthText;
            if(speed > 600){
                bandwidthText = "high";
                virtualclass.videoHost.gObj.MYSPEED = 1;
            }else if (speed > 400){
                bandwidthText = "medium";
                virtualclass.videoHost.gObj.MYSPEED = 2;
                ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
            }else {
                virtualclass.videoHost.gObj.MYSPEED = 3;
                ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
                bandwidthText = "low";
            }
            return bandwidthText;
        },


        measureConnectionSpeed : function (cb) {
            var download = new Image();
            var that = this;
            download.onload = function () {
                that.endTime = (new Date()).getTime();
                var speedKbps = that.calculateSpeed();
                cb(speedKbps);
            }

            download.onerror = function (err, msg) {
                ShowProgressMessage("Invalid image, or error downloading");
            }

            this.startTime = (new Date()).getTime();
            var cacheBuster = "?nnn=" + this.startTime; // everytime the page is refrsh, the browser treat the image file as new file
            download.src = this.imageAddr + cacheBuster;

        },

        calculateSpeed : function (){
            var duration = (this.endTime - this.startTime) / 1000;
            var bitsLoaded = this.downloadSize * 8;
            var speedBps = (bitsLoaded / duration).toFixed(2);
            var speedKbps = (speedBps / 1024).toFixed(2);
            //var speedMbps = (speedKbps / 1024).toFixed(2);
            return Math.round(speedKbps);
        }

    },

    speaker : {
        prev : 'bandwidth',
        curr :  'speaker',
        next :  'mic',
        perform : function (){

            // virtualclass.precheck.updateProgressBar(this.curr);

            var speakerLable =  document.createElement('div');
            speakerLable.innerHTML = virtualclass.lang.getString('speakerTest');
            var selectorId = '#preCheckcontainer .precheck.'+this.curr;
            document.querySelector(selectorId + ' .result').appendChild(speakerLable);

            this._play();

            // audio.onended = function (){
                //virtualclass.precheck._perform(1000, that.curr);
            // }
        },

        _play : function (){
            var preCheck = "#preCheckcontainer .precheck";
            virtualclass.precheck.display('#preCheckcontainer .precheck.'+this.curr);


            var testAudio = document.getElementById('vcSpeakerCheckAudio');
                testAudio.loop = true;
                testAudio.play();

            virtualclass.precheck.initHandler((preCheck+ ' #'+this.curr + 'Buttons .prev'), this.curr, function (){
                // stop the audio
                testAudio.pause();
                testAudio.currentTime = 0
            });

            virtualclass.precheck.initHandler((preCheck+ ' #'+this.curr + 'Buttons .next'), this.curr, function (){
                // stop the audio
                testAudio.pause();
                testAudio.currentTime = 0
            });
        }
    },

    mic : {
        prev : 'speaker',
        curr : 'mic',
        next : 'webcam',
        perform : function (){
            var preCheck = "#preCheckcontainer .precheck";
            //virtualclass.precheck.updateProgressBar(this.curr);
            virtualclass.precheck.display(preCheck + '.'+this.curr);
            this.visualize();
            // var joinSession = document.getElementById('joinSession');


            var selectorId = preCheck+'.'+this.curr;
            //virtualclass.precheck.initHandler((preCheck+ ' #joinSession .prev'), this.curr);

            //var joinSession = document.querySelector('#joinSession .next');
            //if(joinSession != null){
            //    joinSession.addEventListener('click', function (){
            //        virtualclass.popup.waitMsg();
            //        virtualclass.makeReadySocket();
            //
            //        var virtualclassPreCheck = document.getElementById('preCheckcontainer');
            //        virtualclassPreCheck.style.display = 'none';
            //
            //        var virtualclassPreCheck = document.getElementById('preCheckcontainer');
            //        virtualclassPreCheck.style.display = 'none';
            //
            //        var virtualclassApp = document.getElementById('virtualclassApp');
            //            virtualclassApp.style.display = 'block';
            //        localStorage.setItem('precheck', true);
            //
            //
            //    });
            //}

            var micLable =  document.createElement('div');
            micLable.innerHTML = virtualclass.lang.getString('mictesting');
            document.querySelector(selectorId + ' .result').appendChild(micLable);
        },

        visualize : function (){
            var canvas = document.querySelector('.visualizer');
            var canvasCtx = canvas.getContext("2d");

            var intendedWidth = 60;
            canvas.setAttribute('width',intendedWidth);
            canvas.setAttribute('height',200);

            WIDTH = canvas.width;
            HEIGHT = canvas.height;

            virtualclass.gObj.video.audioVisual.analyser.fftSize = 256;
            var bufferLength = virtualclass.gObj.video.audioVisual.analyser.frequencyBinCount;
            console.log(bufferLength);
            var dataArray = new Uint8Array(bufferLength);

            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

            function draw() {
                requestAnimationFrame(draw);

                /*
                 setTimeout(function (){
                 draw();
                 }, 40); */

                virtualclass.gObj.video.audioVisual.analyser.getByteFrequencyData(dataArray);

                canvasCtx.fillStyle = 'rgb(0, 0, 0)';
                canvasCtx.fillRect(0, 0, WIDTH, HEIGHT + 100);

                var barWidth = (WIDTH / bufferLength) * 2.5;
                var barHeight;
                var x = 0;
                var soundBarWidth = 100;
                for(var i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i];
                    //canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
                    canvasCtx.fillStyle = 'rgb(0, 128, 0)';

                    canvasCtx.fillRect(x,barHeight,soundBarWidth,barHeight);

                    // x += barWidth + 1;
                    // x = 1; // for single line
                    x =  1;
                }
            };



            draw();

            // roate the canvas, TODO imrprove the way to present audio visualization

            document.getElementById("audioVisualaizer").style.transform = "rotate(-90deg)";

            virtualclass.precheck.initHandler(('#preCheckcontainer .precheck #'+this.curr + 'Buttons .prev'), this.curr);
            virtualclass.precheck.initHandler(('#preCheckcontainer .precheck #'+this.curr + 'Buttons .next'), this.curr);


            //if(virtualclass.system.mybrowser.name == 'Chrome'){
            //    document.getElementById("audioVisualaizer").style.WebkitTransform = "rotate(90deg)";
            //}else if (virtualclass.system.mybrowser.name == 'Firefox'){
            //    document.getElementById("audioVisualaizer").style.MozTransform = "rotate(90deg)";
            //}

            //document.getElementById("audioVisualaizer").style.WebkitTransform = "rotate(90deg)";

        }

    },


    webcam : {
        // testCode,
        test : {1:'noWebCam', 2:'nopermission', 3: 'webcambuys'},
        prev : 'mic',
        curr : 'webcam',


        perform : function (){

            var preCheck = "#preCheckcontainer .precheck";

            var selectorId = '#preCheckcontainer .precheck.'+this.curr;

            var videoLable =  document.createElement('div');
            var msg, wclassName;

            if(virtualclass.system.mediaDevices.hasWebcam){
                if(virtualclass.system.mediaDevices.webcamErr.length > 0){
                    msg = virtualclass.system.mediaDevices.webcamErr[virtualclass.system.mediaDevices.webcamErr.length-1];

                    // We want descriptive message only in pre check section
                    if(msg == 'PermissionDeniedError' || msg == 'SecurityError' || msg == 'nopermission' ){
                        msg += 'Ext';
                        if(virtualclass.system.mybrowser.name == 'Firefox'){
                            msg += 'FF';
                        }
                    }

                    msg = virtualclass.lang.getString(msg);
                    wclassName  = videoLable.className + ' error';

                } else {

                    wclassName  = videoLable.className + ' general';
                    var videoLable =  document.createElement('div');
                    msg = virtualclass.lang.getString('webcamerainfo')
                }
            } else {
                wclassName  = videoLable.className + ' error';
                msg  = virtualclass.lang.getString('nowebcam');
            }

            videoLable.className = wclassName;
            videoLable.innerHTML = msg;

            document.querySelector(selectorId + ' .result').appendChild(videoLable);

            // virtualclass.precheck.updateProgressBar(this.curr);
            virtualclass.precheck.display(selectorId);

            if(!videoLable.classList.contains('error')){
                this.createVideo();
            } else {
                var tempVideo = document.getElementById("webcamTempVideo");
                tempVideo.className = 'novideo';
            }

            //virtualclass.precheck.initHandler(('#preCheckcontainer .precheck #'+this.curr + 'Buttons .prev'), this.curr);

//            virtualclass.precheck.initHandler((preCheck+ ' #joinSession .prev'), this.curr);
            virtualclass.precheck.initHandler((preCheck+ ' #joinSession .prev'), this.curr);


//            virtualclass.precheck.initHandler((preCheck+ ' #joinSession' + ' .prev'), this.curr);



            var joinSession = document.querySelector('#joinSession .next');
            if(joinSession != null){
                joinSession.addEventListener('click', function (){
                    virtualclass.popup.waitMsg();
                    virtualclass.makeReadySocket();

                    var virtualclassPreCheck = document.getElementById('preCheckcontainer');
                    virtualclassPreCheck.style.display = 'none';

                    var virtualclassPreCheck = document.getElementById('preCheckcontainer');
                    virtualclassPreCheck.style.display = 'none';

                    var virtualclassApp = document.getElementById('virtualclassApp');
                    virtualclassApp.style.display = 'block';
                    localStorage.setItem('precheck', true);

                    virtualclass.videoHost.afterSessionJoin();

                    //setTimeout(
                    //    function (){
                    //        //virtualclass.gObj.afterJoinSession();
                    //        virtualclass.videoHost.afterSessionJoin();
                    //
                    //    }, 2000
                    //);

                });
            }

            //virtualclass.precheck._perform(4000, this.curr)
        },

        createVideo : function (){
            var tempVideo = document.getElementById("webcamTempVideo");
            tempVideo.width = 320;
            tempVideo.height = 240;
            if(typeof  cthis.video.tempStream != 'undefined'){
                virtualclass.adpt.attachMediaStream(tempVideo,  cthis.video.tempStream);
                tempVideo.muted = true;
                var videoContainer = document.getElementById('webcamTempVideo');
                if(videoContainer != null){
                    tempVideo.play();
                }
            }
        }
    },



    startSession : function (){
        var virtualclassApp = document.getElementById('virtualclassApp');
        virtualclassApp.style.display = 'block';

        var virtualclassPreCheck = document.getElementById('virtualclassPreCheck');

        if(virtualclassPreCheck != null){
            virtualclassPreCheck.parentNode.removeChild(virtualclassPreCheck);
        }
    },


    updateProgressBar : function(screen) {
        var currElement = document.querySelector("#progressbarScreen ." + screen);
        var allTestsLists =  document.querySelectorAll('#preCheckProgress .progressbar li');

        for(var i=0; i<allTestsLists.length; i++){
            allTestsLists[i].classList.add('active');

            if(allTestsLists[i].classList.contains(screen)){
                if(i > 0){
                    allTestsLists[i-1].classList.remove('current');
                }

                allTestsLists[i].classList.add('current');
                break;
            }
        }
    }
}

