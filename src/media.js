// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides functionality to capture , transmit and play audio and
 * video for multiple users.
 *
 */

(function (window) {
    function breakintobytes(val, l) {
        var numstring = val.toString();
        for (var i = numstring.length; i < l; i++) {
            numstring = '0' + numstring;
        }
        var parts = numstring.match(/[\S]{1,2}/g) || [];
        return parts;
    }

    repMode = false;
    //var io = window.io;
    /**
     * To convert float to integer
     * @param  buffer: audio samples a Float32 bit  array
     * @returns buf : Int16Array buffer
     */
    function convertFloat32ToInt16(buffer) {

        l = buffer.length;
        buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf;
    }

    var responseErorr = function () {
        console.log("this error is come when the create and answer is occurring");
    };

    var ar = 0;
    var audioWasSent = 0;
    var preAudioSamp = 0;
    var preAvg = 0;
    var curAvg = 0;
    var minthreshold = 65535;
    var maxthreshold = 0;
    var audiotime = 0;

    var allAudioArr = {};

    var userSource = {}; //for contain the user specific audio source
    var sNode = {};
    var snNode;
    var ac = {};
    var sNodePak = {};
    var snNodePak;
    // alert('index.js3');
//        var AudioContext = AudioContext || webkitAudioContext;
    /**
     * this returns an object that contains various Properties
     * to facilitate the capturing , saving, transmitting and
     *  rendering audio or video.
     *
     */
    var media = function () {
        return {
            isChannelReady: '',// not being used
            isInitiator: false,
            isStarted: '',
            pc: [],
            cn: 0,
            ba: false,
            bb: false,
            bc: false,
            bNotRender: false,
            remoteStream: '',
            turnReady: '',
            oneExecuted: false,
            videoControlId: 'videoContainer',
            videoContainerId: "videos",
            CONFIG : {
                width :  { max :  268 },
                height : { max :  142 },
                frameRate : { max :  6 }
            },

            /**
             * Replaces image with  video
             * @param id Id of the user
             * @param vidCont Video wrapper to replace the image
             */
            util: {
                imageReplaceWithVideo: function (id, vidCont) {
                    var chatUser = document.getElementById("ml" + id);
                    if (virtualclass.vutil.elemHasAnyClass("ml" + id)) {
                        chatUser.classList.remove('userImg');
                    }

                    if(chatUser != null){
                        var childTag = chatUser.getElementsByTagName('a')[0];
                        var imgTag = childTag.getElementsByTagName('span')[0] ||  childTag.getElementsByTagName('img')[0];;
                        if(!childTag.classList.contains("hasVideo")){
                            childTag.className += ' hasVideo';
                        }
                        childTag.replaceChild(vidCont, imgTag);
                    } else {
                        console.log('chatUser is Null');
                    }
                }
            },

            audioVisual : {
                init : function (){
                    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    this.analyser = this.audioCtx.createAnalyser();
                    this.analyser.minDecibels = -90;
                    this.analyser.maxDecibels = -10;
                    this.analyser.smoothingTimeConstant = 0.85;

                    this.distortion = this.audioCtx.createWaveShaper();
                    this.gainNode = this.audioCtx.createGain();
                    this.biquadFilter = this.audioCtx.createBiquadFilter();
                    this.convolver = this.audioCtx.createConvolver();
                },

                readyForVisual : function (stream){
                    this.source = this.audioCtx.createMediaStreamSource(stream);
                    this.source.connect(this.analyser);
                    this.analyser.connect(this.distortion);
                    this.distortion.connect(this.biquadFilter);
                    this.biquadFilter.connect(this.convolver);
                    this.convolver.connect(this.gainNode);
                    this.gainNode.connect(this.audioCtx.destination);
                }
            },


            /**
             * This property contains various property and methods to capture,save and tranmit
             * and listen audio
             */
            audio: {
                audioStreamArr: [],
                tempAudioStreamArr: [],
                recordingLength: 0,
                bufferSize: 0,
                encMode: "alaw",
                recordAudio: false,
                rec: '',
                otherSound: false,
                audioNodes: [],
                sdElem: 'silenceDetect',
                snode : [], // To holds the user's id whose audio context is suspended

//                  sd : false,
                /*
                 *  Enables audio
                 *  calls function to attach functions on audio tools.
                 */
                init: function () {
                    var isEnableAudio = document.getElementById('speakerPressOnce').dataset.audioPlaying;
                    virtualclass.gObj.audMouseDown = (isEnableAudio == 'true') ? true : false;


                    //This part in not being used
                    this.graph = {
                        height: 56,
                        width: 4,
                        average: 0,

                        display: function () {
                            var cvideo = cthis.video;
                            if (roles.hasControls()) {
                                var avg = this.height - (this.height * this.average) / 100;
                                this._display(cvideo.tempVidCont, avg);
                            }
                        },

                        _display: function (context, avg) {
                            context.beginPath();
                            context.moveTo(this.width, this.height);
                            context.lineTo(this.width, avg);
                            context.lineWidth = this.width;
                            context.strokeStyle = "rgba(32, 37, 247, 0.8)";
                            context.closePath();
                            context.stroke();
                        }

                        // canvasForVideo: function () {
                        //     var videoParent = cthis.video.myVideo.parentNode;
                        //     var graphCanvas = document.createElement("canvas");
                        //     graphCanvas.width = this.width + 3;
                        //     graphCanvas.height = this.height;
                        //
                        //     graphCanvas.id = "graphCanvas";
                        //     videoParent.style.position = "relative";
                        //     graphCanvas.style.position = "absolute";
                        //     graphCanvas.style.left = 0;
                        //     graphCanvas.style.top = -7;
                        //     videoParent.appendChild(graphCanvas);
                        // }

                    };
                    this.attachFunctionsToAudioWidget();// to attach functions to audio widget
                },

                initAudiocontext : function (){
                    if(!this.hasOwnProperty('Html5Audio') && !virtualclass.gObj.meetingMode){
                        this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                        this.resampler = new Resampler(virtualclass.gObj.video.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
                        virtualclass.gObj.isAudioContextReady = true;
                        if(virtualclass.system.mediaDevices.hasMicrophone && !virtualclass.isPlayMode){
                            virtualclass.gObj.video.stream = cthis.video.tempStream;
                            virtualclass.gObj.video.audio._manuPulateStream();
                        }
                    }
                },

                /** Iniates the script processor node to play the audio **/
                initScriptNode : function (){
                    for(var i=0; i< this.snode.length; i++){
                        this._playWithFallback(this.snode[i]);
                    }
                    this.snode = [];
                },

                muteButtonToogle : function (){
                    var speakerPressOnce = document.querySelector('#speakerPressOnce');
                    if(speakerPressOnce != null && (speakerPressOnce.dataset.audioPlaying && speakerPressOnce.dataset.audioPlaying == 'true')){
                        speakerPressOnce.click();
                    }
                },

                /**
                 * To send message and
                 * To set audio status of the audio
                 * @param  msg Audio message
                 * @param adStatus status of the audio i.e. being sent aur not

                 */
                audioSend: function (msg, adStatus) {
                    if (virtualclass.gObj.audMouseDown && io.sock.readyState == 1) {
                        var uid = virtualclass.vutil.breakintobytes(virtualclass.gObj.uid, 8);
                        var scode = new Int8Array([101, uid[0], uid[1], uid[2], uid[3]]); // Status Code Audio
                        var sendmsg = new Int8Array(msg.length + scode.length);
                        sendmsg.set(scode);
                        sendmsg.set(msg, scode.length); // First element is status code (101)
                        ioAdapter.sendBinary(sendmsg);

                        virtualclass.gObj.video.audio.setAudioStatus(adStatus);
                    } else {
                        virtualclass.gObj.video.audio.setAudioStatus("stop");
                    }
                },
                // if there is silece then audio will not be transmitted
                silenceDetection: function (send, leftSix) {
                    var audStatus;
                    var vol = 0;
                    var sum = 0;
                    var rate = 0;
                    var a;
                    for (i = 0; i < leftSix.length; i++) {
//                            var a = Math.abs(leftSix[i]); // a should not be declared here
                        a = Math.abs(leftSix[i]); // a should not be declared here
                        if (vol < a) {
                            vol = a;
                        } // Vol is maximum volume in signal packet
                        sum = sum + a;
                    }

                    curAvg = sum / leftSix.length;
                    rate = Math.abs(curAvg ^ 2 - preAvg ^ 2);
                    preAvg = curAvg;

                    if (rate < 5) {
                        minthreshold = vol;
                    } // If rate is close to zero, it is likely to be noise.
                    if (minthreshold > vol) {
                        minthreshold = vol;
                    } // Minimum volume in historical signal
                    if (maxthreshold < vol) {
                        maxthreshold = vol;
                    } // Maximum volume in historical signal
                    if (minthreshold * 20 < maxthreshold) {
                        minthreshold = minthreshold * 5;
                    } // In case minimum sound (silance) is too low compared to speaking sound.
                    if (maxthreshold / 20 > minthreshold) {
                        maxthreshold = maxthreshold / 5;
                    } // In case Max volume (speaking sound) is too high compared with silance.
                    if (thdiff > 10) {
                        maxthreshold = maxthreshold*0.8;
                    } // Keep algo sensitive
                    var thdiff = maxthreshold / minthreshold;
                    var th = vol / minthreshold;

                    audStatus = "sending";
                    if ( thdiff >= 20 || // historical max minus min
                        th > 2 || // Difference between current volume and minimum
                        rate > minthreshold || rate > 25 || // Change in signal strength
                        vol > (minthreshold * 2) || // Current max volume
                        thdiff <= 4 ) { // We are not ready for this algo
                        this.audioSend(send, audStatus);
                        audioWasSent = 3;
                        // console.log('SEND Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff+' th '+th);
                    } else if (audioWasSent > 0) {
                        this.audioSend(send, audStatus);  // Continue sending Audio for next X samples
                        audioWasSent--;
                    } else if (thdiff < 2) { // We are not ready, send all samples
                        this.audioSend(send, audStatus);
                    } else {
                        // console.log('NOT Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff+' th '+th);
                        this.setAudioStatus("notSending");
                        ioAdapter.send({cf:'na'});
                    }
                    return send;
                },

                /**
                 *  Setting the attribute data-silence-detect to sending or notSending or stop
                 * @param  audStatus audio status such sending , notsending or stop
                 */
                setAudioStatus: function (audStatus) {
                    if (typeof silenceDetectElem == 'undefined') {
                        var silenceDetectElem = document.getElementById('audioWidget').getElementsByClassName(this.sdElem)[0];
                    }
                    silenceDetectElem.setAttribute('data-silence-detect', audStatus);
                },
                //TODO not being invoked
                makeIconNotDraggable: function (id, imgName) {
                    var canvas = document.getElementById(id, imgName);
                    var context = canvas.getContext('2d');
                    var imageObj = new Image();

                    imageObj.onload = function () {
                        context.drawImage(imageObj, 0, 0);
                    };
                    imageObj.src = window.whiteboardPath + "images/" + imgName;
                },

                /**
                 * Attaching functions to audioWidget
                 * Adding event listner on clicking audio tools
                 */
                attachFunctionsToAudioWidget: function () {
                    var audioWiget = document.getElementById('audioWidget');
                    var allAudTools = audioWiget.getElementsByClassName('audioTool');
                    var that = this;
                    for (var i = 0; i < allAudTools.length; i++) {
                        //allAudTools[i].addEventListener('click', function (){ that.audioToolInit.call(that,  allAudTools[i])});
                        if (allAudTools[i].id == 'speakerPressOnce') {
                            //allAudTools[i].setAttribute('data-audio-playing', "false");
                        } else if (allAudTools[i].id == 'speakerPressing') {
                            this.attachSpeakToStudent(allAudTools[i].id);
                        }
                        if (allAudTools[i].id != 'speakerPressing') {
                            allAudTools[i].addEventListener('click', that.audioToolInit);
                        }
                    }
                },

                /**
                 * It is invoked on clicking on or off button appeared on audio widget
                 * And it is invoked on clicking test audio
                 */
                audioToolInit: function () {
                    if(virtualclass.gObj.meetingMode){
                        var tag = document.getElementById(this.id);
                        // var anchor = tag.getElementsByClassName('tooltip')[0];
                        // if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
                        let action;
                        if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
                            virtualclass.vutil.audioStatus(tag, "true");
                            action = true;
                        } else {
                            virtualclass.vutil.audioStatus(tag, "false");
                            action = false;
                        }
                        virtualclass.multiVideo.setAudioStatus(action);
                    } else {
                        var that = virtualclass.gObj.video.audio;
                        if (this.id == 'speakerPressOnce') {
                            that.clickOnceSpeaker(this.id);
                        } else if (this.id == 'audioTest') {
                            var self = this;
                            virtualclass.popup.confirmInput(virtualclass.lang.getString('audioTest'), function (confirm) {
                                if (confirm) {
                                    that.testInit(self.id);
                                }

                            });
                        } else if (this.id == 'silenceDetect') {
                            var a = this.getElementsByTagName('a')[0];
                            if (that.sd) {
                                that.sd = false;
                                this.className = this.className + " sdDisable";
                            } else {
                                that.sd = true;
                                this.className = this.className + " sdEnable";
                            }
                        }
                    }

                },

                /**
                 * If Push to talk audio tool is pressed down then audio is active
                 * and studentSpeak is invoked.
                 * And if push to talk audio tool is pressed up audio is deactive
                 * studentNotSpeak function is invoked
                 * @param id Id of the audio tool that is being pressed
                 */
                attachSpeakToStudent: function (id) {
                    var that = this;
                    var alwaysPress = document.getElementById(id);
                    var beingPress = false;
                    alwaysPress.addEventListener('mousedown', function () {
                        if (!virtualclass.gObj.audMouseDown) {
                            that.studentSpeak(alwaysPress);
                            beingPress = true;
                            var pressOnceLabel = document.getElementById("speakerPressonceLabel");
                            if (pressOnceLabel != null) {
                                if (virtualclass.vutil.elemHasAnyClass('speakerPressonceLabel')) {
                                    if (pressOnceLabel.classList.contains('silenceDetect')) {
                                        pressOnceLabel.removeAttribute('data-silence-detect');
                                        pressOnceLabel.classList.remove('silenceDetect');
                                        if (pressOnceLabel.classList.length <= 0) {
                                            pressOnceLabel.removeAttribute('class');
                                        }


                                        var controller = pressOnceLabel.getElementsByTagName('i')[0];
                                        if (controller != null) {
                                            controller.setAttribute('data-silence-detect', "stop");
                                            controller.className = controller.className + ' silenceDetect';

                                        }
                                    }
                                }
                            }
                        }
                    });

                    alwaysPress.addEventListener('mouseup',
                        function () {
                            if (beingPress) {
                                that.studentNotSpeak(alwaysPress);
                                beingPress = false;
                                var pressOnceLabel = document.getElementById("speakerPressonceLabel");
                                var controller = pressOnceLabel.getElementsByTagName('i')[0];
                                if (typeof controller.classList != 'undefined' && controller.classList.contains('silenceDetect')) {
                                    controller.classList.remove('silenceDetect');
                                    if (controller.classList.length <= 0) {
                                        controller.removeAttribute('class');
                                    }
                                    pressOnceLabel.removeAttribute('data-silence-detect');
//                                        pressOnceLabel.setAttribute('data-silence-detect', "false");
                                }

                                if (pressOnceLabel !== null) {
                                    pressOnceLabel.setAttribute('data-silence-detect', "stop");
                                    pressOnceLabel.className = controller.className + ' silenceDetect';

                                }
                            }
                        });
                },

                /**
                 * Attching function to audio press once tool in the audio widget
                 *
                 */
                attachAudioPressOnce: function () {
                    var speakerPressOnce = document.getElementById('speakerPressOnce');
                    speakerPressOnce.setAttribute('data-audio-playing', "false");
                    var that = this;
                    speakerPressOnce.addEventListener('click', function () {
                        that.clickOnceSpeaker.call(that, speakerPressOnce.id)
                    });
                },

                /**
                 * If Audio is enabled then clicking on it disbles it
                 * And if it is disbled then clicking on it enables it
                 * @param  id : Id of the audio tool
                 */
                // TODO this function is being called with only one attribute
                clickOnceSpeaker: function (id, alwaysDisable) {
                    var tag = document.getElementById(id);
                    var alwaysPressElem = document.getElementById('speakerPressing');
                    var anchor = tag.getElementsByClassName('congtooltip')[0];
                    // var anchor = tag.getElementsByClassName('tooltip')[0];
                    // if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
                    if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
                        //this.studentSpeak(alwaysPressElem);
                        this.studentSpeak();

                        tag.setAttribute('data-audio-playing', "true");
                        anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
                        tag.className = "audioTool active";


                    } else {
                        this.studentNotSpeak();
                        tag.setAttribute('data-audio-playing', "false");
                        if(anchor){
                            anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
                        }
                        tag.className = "audioTool deactive";
                    }
                },
                /**
                 * Audio tool element 'Push to talk' is active
                 * User speaks on mouse press down
                 * @param elem audio tool element
                 */
                // TODO
                // there should not pass whole elem but id
                //varible button is not being used
                studentSpeak: function (elem) {

                    if (typeof elem != 'undefined') {
                        var button = document.getElementById(elem.id + "Button");
                        elem.classList.remove('deactive');
                        elem.classList.add('active');
                    }
                    virtualclass.gObj.audMouseDown = true;
                    virtualclass.vutil.beforeSend({'sad': true, 'cf': 'sad'});
                },
                /**
                 * Audio tool deactive
                 * @param elem audio tool element
                 */
                // varible button is not being used
                studentNotSpeak: function (elem) {
                    if (virtualclass.gObj.hasOwnProperty('audMouseDown') && virtualclass.gObj.audMouseDown) {
                        if (typeof elem != 'undefined') {
                            var button = document.getElementById(elem.id + "Button");
                            elem.classList.remove('active');
                            elem.classList.add('deactive');
                        }
                        var tag = document.getElementById("speakerPressOnce");
                        tag.setAttribute('data-audio-playing', "false");
                        tag.className = "audioTool deactive";
                        virtualclass.gObj.audMouseDown = false;
                        virtualclass.gObj.video.audio.setAudioStatus("stop");
                        virtualclass.vutil.beforeSend({'sad': false, 'cf': 'sad'}, null, true);
                    }
                },
                /**
                 * Conversion from array buffer to string
                 * @param buf arrayBuffer
                 * @return string
                 */
                ab2str: function (buf) {
                    return String.fromCharCode.apply(null, new Int8Array(buf));
                },
                /**
                 * Conversion from string to array buffer
                 * @param str string
                 * @return bufView Array Buffer
                 */
                str2ab: function (str) {
                    var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                    var bufView = new Int8Array(buf);
                    for (var i = 0, strLen = str.length; i < strLen; i++) {
                        bufView[i] = str.charCodeAt(i);
                    }
                    return bufView;
                },


                /**
                 * Resamples the audio and silence detection, and broadcast audio
                 */
               recorderProcess: function (left) {
                    var currTime = new Date().getTime();
                    if (!repMode) {
                        if (!this.recordAudio) {
                            this.recordingLength += this.bufferSize;
                        }

                        if (virtualclass.gObj.audMouseDown && (io.sock.readyState == 1)) {
                            // var left = e.inputBuffer.getChannelData(0);
                            var samples = this.resampler.resampler(left);
                            var leftSix = convertFloat32ToInt16(samples);
                            var send = this.audioInLocalStorage(leftSix);
                            this.silenceDetection(send, leftSix);
                        }

                    }
                },

                /**
                 * Resamples the audio and silence detection, and broadcast audio
                 * it's fallback method in case of not supporting audio worklet
                 */
                recorderProcessFallback : function (e) {
                    var currTime = new Date().getTime();
                    if (!repMode) {
                        if (!this.recordAudio) {
                            this.recordingLength += this.bufferSize;
                        }

                        if (virtualclass.gObj.audMouseDown && (io.sock.readyState == 1)) {
                            var left = e.inputBuffer.getChannelData(0);
                            var samples = this.resampler.resampler(left);
                            var leftSix = convertFloat32ToInt16(samples);
                            var send = this.audioInLocalStorage(leftSix);
                            this.silenceDetection(send, leftSix);
                        }
                    }
                },

                /**
                 * Encodes the sampled data
                 *@param leftSix audio data
                 *@return encoded  G711 encoded data
                 */
                //TODO function name should reflect the action
                audioInLocalStorage: function (leftSix) {
                    var encoded = G711.encode(leftSix, {
                        alaw: this.encMode == "alaw" ? true : false
                    });
                    return encoded;
                },
                /**
                 * To play recorded sound in audio testing after 5000ms of recording
                 * recoding is stored in an array audioForTest
                 * and to set the time out of audio testing
                 * @param id Id of the audio tool
                 *
                 */
                testInit: function (id) {
                    var audioTestElem = document.getElementById(id);
                    audioTestElem.classList.add("audioIsTesting");
                    this.studentNotSpeak();
                    virtualclass.gObj.audioForTest = [];
                    this.storeAudio = true;
                    var that = this;
                    that.otherSound = true;
                    if (that.hasOwnProperty('testAudio')) {
                        clearTimeout(that.testAudio);
                    }
                    var totTestTime = 5000;
                    that.testAudio = setTimeout(function () {
                        var pta = true;
                        that.playRecordedAudio(virtualclass.gObj.audioForTest, virtualclass.gObj.uid, pta);
                    }, totTestTime);

                    setTimeout(
                        function () {
                            console.log("testing");

                            audioTestElem.classList.remove("audioIsTesting");
                            that.otherSound = false;
                        }, ((totTestTime * 2) + 1000  )
                    )
                },
                /**
                 * pushing the encoded samples in audioForTest array
                 * setting the uid to false
                 * @param  leftSix audio samples
                 *
                 */
                audioForTesting: function (leftSix) {
                    var encoded = G711.encode(leftSix, {
                        alaw: this.encMode == "alaw" ? true : false
                    });
                    virtualclass.gObj.audioForTest.push(encoded);
                    virtualclass.gObj[virtualclass.gObj.uid] = false;
                },
                /**
                 * it playes the recoded audio
                 * @param encChuncks encoded channel buffer recordings
                 * @param  uid user id
                 * @param testAudio  boolean value
                 */
                playRecordedAudio: function (encChuncks, uid, testAudio) {
                    var samples, clip;
                    this.myaudioNodes = [];
                    var recordingLength = 0;
                    for (var i = 0; i < encChuncks.length; i++) {
                        clip = encChuncks[i];
                        this.myaudioNodes.push(clip);
                        recordingLength += clip.length;
                    }
                    samples = this.mergeBuffers(this.myaudioNodes, recordingLength);
                    (typeof testAudio != 'undefined') ? virtualclass.gObj.video.audio.play(samples, uid, testAudio) : virtualclass.gObj.video.audio.play(samples, uid);
                },


                /**
                 * This function plays the audio with using audio worklet
                 * @param  uid User id
                 * @param  audioChunks that need be played
                 */

                play: function (uid, audioChunks) {
                    if(!this.hasOwnProperty('Html5Audio') && !this.Html5Audio){
                        this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                    }

                    if(typeof sNode[uid] != 'object'){
                        cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(whiteboardPath+'worker/receiver-audio-processor.js').then(() => {
                            sNode[uid] = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'receiver-audio-processor');
                            sNode[uid].connect(cthis.audio.Html5Audio.audioContext.destination);

                       });
                    } else {
                        sNode[uid].port.postMessage({audio : audioChunks})
                    }

               },

                /**
                 * This function plays the audio with using Script Processor Node which is deprecated,
                 * it's a fallback method in case of audio worklet is not supported.
                 * @param  uid is User Id
                 * @param  audioChunks that need be played
                */
                playWithFallback :  function (uid)  {
                   var that = this;
                   if(this.Html5Audio.audioContext.state === 'suspended'){
                       /** Wait till 2 seconds and see if still it's suspended ***/
                       setTimeout(()=> {
                           if(that.Html5Audio.audioContext.state == 'suspended'){
                              that.snode.push(uid);
                              if(virtualclass.gObj.requestToScriptNode == null){
                                  that.Html5Audio.audioContext.resume();
                                  virtualclass.gesture.initAudioResume(uid);
                                  virtualclass.gObj.requestToScriptNode = true;
                              }
                           }
                       },2000);
                   }else {
                        this._playWithFallback(uid);
                   }
               },

               _playWithFallbackOld : function (uid){
                     var that = this;
                     if(typeof sNode[uid] != 'object'){
                       console.log('script processor node is created');
                       sNode[uid] = this.Html5Audio.audioContext.createScriptProcessor(16384, 1, 1);
                       sNodePak[uid] = 0;
                       sNode[uid].onaudioprocess = function (event){
                           var output = event.outputBuffer.getChannelData(0);
                           var newAud = that.getAudioChunks(uid);
                           if(typeof newAud != 'undefined'){
                               for (i = 0; i < newAud.length; i++) {
                                   output[i] = newAud[i];
                               }
                               sNodePak[uid] = newAud[16383];
                           }else {
                               for (i = 0; i < output.length; i++) {
                                   output[i] = sNodePak[uid];
                               }
                           }
                       };
                       sNode[uid].connect(this.Html5Audio.audioContext.destination);
                   }
               },


                _playWithFallback : function (uid){
                    var that = this;
                    if(typeof snNode != 'object'){
                        console.log('script processor node is created');
                        snNode = this.Html5Audio.audioContext.createScriptProcessor(16384, 1, 1);
                        snNodePak = 0;
                        snNode.onaudioprocess = function (event){
                            var output = event.outputBuffer.getChannelData(0);
                            var newAud = that.getAllAudioChunks(uid);
                            if(typeof newAud != 'undefined'){
                                for (i = 0; i < newAud.length; i++) {
                                    output[i] = newAud[i];
                                }
                                snNodePak = newAud[16383];
                            }else {
                                for (i = 0; i < output.length; i++) {
                                    output[i] = snNodePak;
                                }
                            }
                        };
                        snNode.connect(this.Html5Audio.audioContext.destination);
                    }
                },

                queueWithFallback : function (packets, uid) {
                    if (!this.hasOwnProperty('audioToBePlay')) {
                        this.audioToBePlay = {};
                    }
                    if (!this.hasOwnProperty('aChunksPlay')) {
                        this.aChunksPlay = {};
                    }
                    if (!this.audioToBePlay.hasOwnProperty(uid)) {
                        this.audioToBePlay[uid] = [];
                    }

                    var samples = G711.decode(packets, {
                        alaw: this.encMode == "alaw" ? true : false,
                        floating_point: true,
                        Eight: true
                    });

                    /** On absence of Webcam but Headphone,
                     The Audio context should be generated on Student side by following code */

                    if(typeof this.resamplerdecode != 'object'){
                        this.resamplerdecode  = {};
                    }

                    if(typeof this.resamplerdecode[uid] != 'object'){
                        if(typeof this.Html5Audio != 'object'){
                            this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                        }

                        if(typeof this.resamplerdecode[uid] != "object"){
                            this.resamplerdecode[uid] =  new Resampler(8000, this.Html5Audio.audioContext.sampleRate, 1, 32768);
                        }
                    }

                    var samples = this.resamplerdecode[uid].resampler(samples);
                    // this.audioToBePlay[uid].push(new Float32Array(samples));

                    if(typeof allAudioArr[uid] == 'undefined'){
                        allAudioArr[uid] = [];
                    }

                    /**
                     * Making single Queue Audio for specific user
                     */
                    for(var i=0; i<samples.length; i++){
                        allAudioArr[uid].push(samples[i]);
                    }

                    if(typeof ac[uid] == 'undefined'){
                        ac[uid] = 0;
                    }

                    /** Picking up an audio chunk and giving
                     * to Audio Queue, to handle 44.1khz and 48khz
                     */
                    while (allAudioArr[uid].length >= 16384) {
                        var arrChunk =  allAudioArr[uid].splice(0, 16384);
                        this.audioToBePlay[uid].push(new Float32Array(arrChunk));
                        ac[uid]++;
                    }

                },

                queue: function (packets, uid) {
                   var samples = G711.decode(packets, {
                        alaw: this.encMode == "alaw" ? true : false,
                        floating_point: true,
                        Eight: true
                    });

                    /** On absence of Webcam but Headphone,
                     The Audio context should be generated on Student side by following code */

                    if(typeof this.resamplerdecode != 'object'){
                        this.resamplerdecode  = {};
                    }

                    if(typeof this.resamplerdecode[uid] != 'object'){
                        if(typeof this.Html5Audio != 'object'){
                            this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                        }

                        if(typeof this.resamplerdecode[uid] != "object"){
                            this.resamplerdecode[uid] =  new Resampler(8000, this.Html5Audio.audioContext.sampleRate, 1, 32768);
                        }
                    }

                    var samples = this.resamplerdecode[uid].resampler(samples);
                    return samples;
                },


                /**
                 * Audio associated with the user id is played
                 * if length of audio is between 1 and 7
                 * the the audio is played
                 * @param  uid user id
                 * @param label
                 */
                getAudioChunks: function (uid) {
                  console.log("Audo queue " + Math.round(this.audioToBePlay[uid].length/3) + " seconds");
                    if(this.audioToBePlay != null){
                      if (this.audioToBePlay[uid].length >= 9) { // 3 seconds
                        while (this.audioToBePlay[uid].length >= 3) { // 1 second
                          virtualclass.gObj.video.audio.audioToBePlay[uid].shift();
                        }
                        this.aChunksPlay[uid] = true;
                        return virtualclass.gObj.video.audio.audioToBePlay[uid].shift();
                      } else if(this.audioToBePlay[uid].length >= 2) { // .7 second
                        this.aChunksPlay[uid] = true;
                        return virtualclass.gObj.video.audio.audioToBePlay[uid].shift();
                      } else if (this.audioToBePlay[uid].length > 0 && this.aChunksPlay[uid] == true) {
                        this.aChunksPlay[uid] = true;
                        return virtualclass.gObj.video.audio.audioToBePlay[uid].shift();
                      } else {
                        this.aChunksPlay[uid] = false;
                      }
                    }
                  },


                getAllAudioChunks2 : function () {
                    var allAudio = [];
                    var allSumAudio = new Float32Array(16384);
                    var nTemp = 0;

                    // var allAudioSend =  new Float32Array(16384);
                    for(let uid in virtualclass.audioToBePlay){
                        let temp = this.getAudioChunks(uid);

                        if (temp != null) {
                            if(!allSumAudio.length){
                                // add the temp value
                                allSumAudio = temp;
                                // update the number of temp
                                nTemp = 1;
                            } else {

                                // else add the temp values to their corresponding index values of allSumAudio
                                allSumAudio = allSumAudio.map(function(num,idx) {return num + temp[idx]} );
                                nTemp++;
                            }

                        }
                    }
                    return (nTemp < 2) ? allAudio : allSumAudio.map(num => num/nTemp);
                },



                // audioToBePlay[uid][1]16384
                getAllAudioChunks : function (uid) {
                    var allAudioSend = [];
                    var audioLen=0;
                    for(var uid in virtualclass.gObj.video.audio.audioToBePlay){
                        var temp = this.getAudioChunks(uid);
                        if (temp != null) {
                            audioLen++;
                            if (audioLen == 1) {
                                allAudioSend = temp;
                            } else {
                                for (var z = 0; z < 16384; z++) {
                                    allAudioSend[z] = allAudioSend[z] + temp[z];
                                }
                            }
                        }
                    }

                    if (audioLen == 1) {
                        return allAudioSend;
                    } else if (audioLen > 1) {
                        for (var z = 0; z < 16384; z++) {
                            allAudioSend[z] = allAudioSend[z]/audioLen;
                        }
                        return allAudioSend;
                    }
                },

                //TODO this function is not being invoked
                replay: function (inHowLong, offset) {
                    repMode = true;
                    var samples, whenTime, newBuffer, newSource, totArr8;
                    if (this.audioNodes.length > 0) {
                        samples = this.mergeBuffers(this.audioNodes);
                        whenTime = this.Html5Audio.audioContext.currentTime + inHowLong;
                        newBuffer = this.Html5Audio.audioContext.createBuffer(1, samples.length, 7800);
                        newBuffer.getChannelData(0).set(samples);

                        newSource = this.Html5Audio.audioContext.createBufferSource();
                        newSource.buffer = newBuffer;

                        newSource.connect(this.Html5Audio.audioContext.destination);
                        newSource.start(whenTime, offset);
                    }
                },

                /**
                 * Merging  the channel buffer recordings  in the form of Float32Array
                 * channel Buffer is an array of recording chunks , length of each specified by the recordingLength
                 * @param  channelBuffer buffer of recodings
                 * @param  recordingLength length of each recording
                 * @returns {Float32Array} result A merged array of channel buffer recording chunks
                 */
                mergeBuffers: function (channelBuffer, recordingLength) {
                    var result = new Float32Array(recordingLength);
                    var checklength = 0;
                    var offset = 0;
                    var lng = channelBuffer.length;
                    for (var i = 0; i < lng; i++) {
                        var buffer = channelBuffer[i];
                        // console.log("bf Length " + buffer.length);
                        checklength += buffer.length;
                        result.set(buffer, offset);
                        offset += buffer.length;
                    }
                    //console.log (checklength + '   ' + recordingLength);
                    return result;
                },

                // TODO to verify
                assignFromLocal: function (arrStream, audioRep) {
                    this.init();
                    for (var i = 0; i < arrStream.length; i++) {
                        var rec1 = LZString.decompressFromBase64(arrStream[i]);
                        var clip = this.str2ab(rec1);

                        samples = G711.decode(clip, {
                            alaw: this.encMode == "alaw" ? true : false,
                            floating_point: true,
                            Eight: true
                        });
                        this.audioNodes.push(new Float32Array(samples));
                        this.recordingLength += 16384;
                    }
                    if (typeof audioRep != 'undefined') {
                        audioRep();
                    }
                },

                _manuPulateStream : function (){
                    var cthis = virtualclass.gObj.video;
                    setTimeout(
                        function (){
                            if(cthis.detectAudioWorklet()) {
                                cthis.audio.manuPulateStream();

                            }else {
                                cthis.audio.manuPulateStreamWithFallback();
                            }
                        }, 1000
                    );
                },

                /***
                 * It connects the stream received from Mic/GetUserMedia to audio context,
                 * and getting the audio chunks from audio worklet
                 **/
                manuPulateStream: function () {
                    var stream = cthis.stream;
                    if(typeof audioNode != 'undefined'){
                        audioNode.disconnect();
                    }
                    cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(whiteboardPath+'worker/audio-processor.js').then(() => {
                        let audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);

                        filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
                        filter.type = "lowpass";
                        filter.frequency.value = 2000;

                        audioInput.connect(filter);

                        audioNode = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'audio-processor');
                        filter.connect(audioNode);
                        audioNode.connect(cthis.audio.Html5Audio.audioContext.destination);

                        audioNode.port.onmessage = function (event){
                            var audio = event.data.audio;
                            cthis.audio.recorderProcess(audio);
                        }
                    });
                },

                /**
                 * It connects the stream received from Mic/GetUserMedia to audio context,
                 * and getting the audio chunks from script processor node.
                 * It's a fallback method in case of not supporting Audio worklet
                 **/
                manuPulateStreamWithFallback : function () {
                    var stream = cthis.stream;

                    var audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);
                    cthis.audio.bufferSize = 16384;
                    // grec is being made global because recorderProcess with onaudioprocess is not triggered due to Garbage Collector
                    // https://code.google.com/p/chromium/issues/detail?id=360378
                    // cthis.audio.rec = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
                    grec = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
                    grec.onaudioprocess = cthis.audio.recorderProcessFallback.bind(cthis.audio);

                    filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
                    filter.type = "lowpass";
                    filter.frequency.value = 2000;

                    audioInput.connect(filter);
                    filter.connect(grec);
                    grec.connect(cthis.audio.Html5Audio.audioContext.destination);
                },

                /**
                 *  Setting the record start time to the current time
                 *  and setting the replay mode to false
                 *
                 */
                updateInfo: function () {
                    this.audioStreamArr = [];
                    //  virtualclass.wb[virtualclass.gObj.currWb].pageEnteredTime = virtualclass.wb[virtualclass.gObj.currWb].recordStarted = new Date().getTime();
                    this.recordAudio = false;
                    repMode = false;
                },
                /**
                 * Recives the audio message from the sender
                 * And  Plays the received audio
                 * @param  msg Audio message received from the sender
                 *
                 */
                receivedAudioProcess: function (msg) {
                    if (virtualclass.gObj.hasOwnProperty('isAudioContextReady')) {
                        var dataArr = this.extractData(msg);// extract data and user id from the message received
                        var uid = dataArr[0];

                        if (typeof adSign == 'undefined') {
                            var adSign = {};
                        }

                        if (!adSign.hasOwnProperty(uid)) {
                            adSign[uid] = {};
                            adSign[uid].ad = true;
                            var user = virtualclass.user.control.updateUser(uid, 'ad', true);// creates user object, that is stored in local storage and return the object
                            virtualclass.user.control.audioSign(user, "create");
                        }

                        virtualclass.gObj.video.audio.queueWithFallback(dataArr[1], uid); //dataArr[1] is audio
                        virtualclass.gObj.video.audio.playWithFallback(uid);    
                    }

                },
                /**
                 * To extract user id of sender and data from the receied message
                 * @param  msg recevied message from online users
                 * @returns {Array} userid received with the  message plus rest of the msz data
                 */
                extractData: function (msg) {
                    var data_pack = new Int8Array(msg);
                    var uid = virtualclass.vutil.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
                    return [uid, data_pack.subarray(5, data_pack.length)];
                },

                removeAudioFromLocalStorage : function (){
                    console.log('Remove audio from local storage');
                    localStorage.removeItem('audEnable');
                }

            },
            /**
             * video property contains all the properties and methods necessary for the manipulation
             * of the video
             */
            video: {
                width: 75,
                height: 56,
                tempVid: "",
                tempVidCont: "",
                myVideo: "",
                remoteVid: "",
                remoteVidCont: "",
                maxHeight: 250,
                // Setting the video container's max height
                init: function () {
                    this.videoCont = document.getElementById("allVideosCont");
                    if (this.videoCont != null) {
                        this.videoCont.style.maxHeight = this.maxHeight + "px";
                    }
                },
                // Calulates dimensions of the video to be displayed.
                calcDimension: function () {
                    this.myVideo.width = this.width;
                    this.myVideo.height = this.height;
                },
                /**
                 *  remove user and corresponding video element
                 * @param id userid of the user to be removed
                 */
                removeUser: function (id) {
                    var element = document.getElementById('user' + id);
                    if (element != null) {
                        element.parentNode.removeChild(element);
                    }
                },
                /**
                 * TO create Video container that replaces user image
                 * @param  user user object

                 */
                createElement: function (user) {
                    var videoWrapper = document.createElement('div');
                    videoWrapper.className = "videoWrapper";
                    var videoSubWrapper = document.createElement('div');
                    videoSubWrapper.className = "videoSubWrapper";
                    videoSubWrapper.id = "user" + user.id;
                    videoWrapper.appendChild(videoSubWrapper);
                    vidId = user.id;
                    var video = document.createElement('canvas');
                    video.id = "video" + vidId;
                    video.className = "userVideos";
                    video.width = this.width;
                    video.height = this.height;
                    video.muted = "muted";
                    var videoCont = this.videoCont;
                    videoSubWrapper.appendChild(video);
                    videoCont = videoWrapper;
                    virtualclass.gObj.video.util.imageReplaceWithVideo(user.id, videoCont);
                },
                // TODO This function is not being invoked
                updateHightInSideBar: function (videoHeight) {
                    //TODO this is not to do every time a function is called
                    var sidebar = document.getElementById('widgetRightSide');
                    var sidebarHeight = sidebar.offsetHeight;
                    var chatBox = document.getElementById("chatContainer");
                    var chatBoxHeight = sidebarHeight - videoHeight;
                    chatBox.style.height = chatBoxHeight + "px";
                },
                /**Send the small video and render it at the receiver's side
                 * And breaks user id into bytes
                 * Sets the interval for  send small video
                 * interval depends on the number of users
                 */
                //TODO function defined in function they can be separately defined



                sendInBinary: function (sendimage) {
                    var user = {
                        name: virtualclass.gObj.uName,
                        id: virtualclass.gObj.uid
                    };
                    if(io.webSocketConnected()) {
                       virtualclass.vutil.beforeSend({videoByImage: user, 'cf': 'videoByImage'}, null, true);
                        ioAdapter.sendBinary(sendimage);
                    }

                },

                send: function () {
                    if (virtualclass.gObj.video.hasOwnProperty('smallVid')) {
                        clearInterval(virtualclass.gObj.video.smallVid);
                    }
                    var cvideo = this;
                    var frame;
                    randomTime = Math.floor(Math.random()*(8000-3000+1)+3000); // Random number between 3000 & 8000
                    var totalMembers = -1;
                    var that = this;
                    function sendSmallVideo() {
                        var resA = 1;
                        var resB = 1;
                        cvideo.tempVidCont.clearRect(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
                        cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);

                        var user = {
                            name: virtualclass.gObj.uName,
                            id: virtualclass.gObj.uid
                        };

                        if (roles.hasControls()) {
                            user.role = virtualclass.gObj.uRole;
                        }

                        var d = {x: 0, y: 0};
                        // you increase the the value, increase the quality
                        // 0.4 and 9 need 400 to 500 kb/persecond
                        if (virtualclass.system.webpSupport) {
                            var sendimage = cvideo.tempVid.toDataURL("image/webp", 0.6);
                            var vidType = 1;
                        } else {
                            var sendimage = cvideo.tempVid.toDataURL("image/jpeg", 0.3);
                            var vidType = 0;
                        }

                        sendimage = virtualclass.videoHost.convertDataURIToBinary(sendimage);
                        if(!virtualclass.videoHost.gObj.stdStopSmallVid && !roles.hasControls() || (roles.hasControls() && virtualclass.videoHost.gObj.videoSwitch )){
                            var uid = breakintobytes(virtualclass.gObj.uid, 8);
                            var scode = new Uint8ClampedArray([11, uid[0], uid[1], uid[2], uid[3], vidType]);// First parameter represents  the protocol rest for user id
                            var sendmsg = new Uint8ClampedArray(sendimage.length + scode.length);
                            sendmsg.set(scode);
                            sendmsg.set(sendimage, scode.length);
                            that.sendInBinary(sendmsg);
                        }
                        clearInterval(virtualclass.gObj.video.smallVid);

                        var d = randomTime + (virtualclass.connectedUsers.length * 2500);
                        if (totalMembers != virtualclass.connectedUsers.length) {
                            totalMembers = virtualclass.connectedUsers.length;
                            var p = -1;
                            for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
                                if (virtualclass.connectedUsers[0].userid == virtualclass.gObj.uid) {
                                    p = i;
                                }
                            }
                            var td = d / totalMembers;
                            if(p < 0){
                                p  = 0;
                            }
                            var md = p * td;
                            virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, (d + md));
                        } else {
                            virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, d);
                        }
                    }


                    virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, randomTime);
                    // Breaking user id into bytes
                    function breakintobytes2(val, l) {
                        var numstring = val.toString();
                        for (var i = numstring.length; i < l; i++) {
                            numstring = '0' + numstring;
                        }
                        var parts = numstring.match(/[\S]{1,2}/g) || [];
                        return parts;
                    }
                },

                /**
                 * Calulate dimensions of the  video
                 * and sends the video
                 */
                startToStream: function () {
                    cthis.video.calcDimension();
                    cthis.video.send();
                },

                /**
                 * Play the received video with out slicing it
                 * @param  uid
                 * @param  msg video message received

                 */
                playWithoutSlice: function (uid, msg, vtype) {
                    //  console.log('uid ' + uid);
                    this.remoteVid = document.getElementById("video" + uid);
                    //TODO remove validation
                    if (this.remoteVid != null) {
                        this.remoteVidCont = this.remoteVid.getContext('2d');

                        this.remoteVidCont.putImageData(imgData, 0, 0);
                    }
                },

                drawReceivedImage : function(imgData, imgType, d, uid) {
                    this.remoteVid = document.getElementById("video" + uid);
                    if(this.remoteVid != null){
                        this.remoteVidCont = this.remoteVid.getContext('2d');

                        if (virtualclass.system.webpSupport || (imgType == "jpeg")) {
                            var img = new Image();
                            var that = this;
                            img.onload = function (){
                                that.remoteVidCont.drawImage(img, d.x, d.y);
                            };
                            img.src = imgData;
                        } else {

                            loadfile(imgData, this.remoteVid, this.videoPartCont); // for browsers that do not support webp
                        }
                    }
                },


                //TODO this function is not being used
                justForDemo: function () {
                    var maxHeight = 250;
                    var num = 0;
                    var videoCont = document.getElementById("allVideosCont");
                    videoCont.style.maxHeight = maxHeight + "px";

                    setInterval(
                        function () {
                            if (++num <= 20) {
                                videoCont = document.getElementById("allVideosCont");
                                var videoWrapper = document.createElement('div');
                                videoWrapper.className = "videoWrapper";
//                                        videoWrapper.setAttribute("data-uname", "suman" + num);
                                var videoSubWrapper = document.createElement('div');
                                videoSubWrapper.className = "videoSubWrapper";
                                videoSubWrapper.setAttribute("data-uname", + num);
                                videoWrapper.appendChild(videoSubWrapper);
                                var prvContHeight = videoCont.offsetHeight;
                                var video = document.createElement('video');
                                video.className = "userVideo";
                                video.muted = "muted";
                                video.src = "http://html5demos.com/assets/dizzy.mp4";
                                videoSubWrapper.appendChild(video);
                                videoCont.appendChild(videoWrapper);
                                var newContHeight = videoCont.offsetHeight;
                                if (videoCont.offsetHeight >= maxHeight) {
                                    if (videoCont.style.overflowY != 'undefined' && videoCont.style.overflowY != "scroll") {
                                        videoCont.style.overflowY = "scroll";
                                        document.getElementById(virtualclass.gObj.chat.mainChatBoxId).style.borderTop = "3px solid #bbb";
                                    }
                                }
                            }
                        },
                        200
                    );
                },
                /**
                 * Creates video element
                 * @returns video element
                 */
                createVideoElement: function () {
                    var vTag = "video";
                    var parElement = document.createElement('div');
                    parElement.className = 'videoWrapper';
                    var childElement = document.createElement('div');
                    childElement.className = 'videoSubWrapper';
                    parElement.appendChild(childElement);
                    var videoTag = document.createElement(vTag);
                    videoTag.id = "video" + virtualclass.gObj.uid;
                    videoTag.autoplay = true;
                    childElement.appendChild(videoTag);
                    return parElement;
                },

                /**
                 * To create canvas element to display video
                 * @param string beforInsert : The element before that video element to be inserted
                 */
                insertTempVideo: function (beforeInsert) {
                    var tempVideo = document.createElement('canvas');
                    tempVideo.id = 'tempVideo';

                    beforeInsert.parentNode.insertBefore(tempVideo, beforeInsert);
                },
                // To initalize canvas element to video and to create it's 2d context
                tempVideoInit: function () {
                    cthis.video.tempVid = document.getElementById('tempVideo');
                    cthis.video.tempVid.width = cthis.video.width;
                    cthis.video.tempVid.height = cthis.video.height;
                    cthis.video.tempVidCont = cthis.video.tempVid.getContext('2d');
                },
                /**
                 * Extracting the user id of sender from the sent  message
                 * separating it from the audio
                 * And playing the video by calling playWithoutSlice
                 * @param  msg : Received message

                 */
                process: function (msg) {
                    var data_pack = new Uint8ClampedArray(msg);
                    var uid = virtualclass.vutil.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
                    var recmsg = data_pack.subarray(6, data_pack.length);
                    if(data_pack[5] == 1){
                        var b64encoded = "data:image/webp;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                        var imgType = "webp";
                    }else {
                        var b64encoded = "data:image/jpeg;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                        var imgType = "jpeg";
                    }


                    // virtualclass.gObj.video.video.playWithoutSlice(uid, recmsg, imgType);
                    virtualclass.gObj.video.video.drawReceivedImage(b64encoded, imgType, {x:0, y:0}, uid);
                }
            },

            sessionConstraints : function (){
                var webcam = virtualclass.system.mediaDevices.hasWebcam ? true : false;

                /**
                 * Reduce the resolution and video frame rate to optimization CPU resource
                 *
                 **/

                if(virtualclass.gObj.meetingMode && webcam){
                    if(virtualclass.system.device == 'mobTab' && virtualclass.system.mybrowser.name == 'iOS'){
                        var webcam = true;
                    }else {
                        // 320 * 240
                        var webcam = this.CONFIG;
                        // webcam = true;
                    }
                }


                var session = {
                    //audio: virtualclass.gObj.multiVideo ? true :  audioOpts,
                    video: webcam,
                    audio : virtualclass.system.mediaDevices.hasMicrophone
                };

                return [webcam, session];
            },

            /**
             * It creates a mediator for getUSerMedia
             * and it prompts the user for permission to use video or audio device
             * it  inalizes the video
             */
            /* TODO @param vbool :no use of parameter vbool */


            init: function (vbool) {
                console.log('Video second, normal video');
                cthis = this; //TODO there should be done work for cthis

                virtualclass.gObj.oneExecuted = true;
                var webcam, session;

                [webcam, session] = this.sessionConstraints();

                cthis.video.init();
                // cthis.audio.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                // cthis.audio.resampler = new Resampler(cthis.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
                var that  = this;
                // Default we disable audio and video
                virtualclass.user.control.audioDisable();
                virtualclass.user.control.videoDisable();
                if (!virtualclass.vutil.isPlayMode()) {
                    if(virtualclass.adpt == null){
                        virtualclass.adpt = new virtualclass.adapter();
                    }

                    var cNavigator = virtualclass.adpt.init(navigator);
                    cNavigator.mediaDevices.getUserMedia(session).then(function (stream) {
                        that.handleUserMedia(stream)
                        if(virtualclass.gObj.meetingMode){
                            virtualclass.multiVideo.init();
                        }

                    }).catch(function (e) {
                        that.handleUserMediaError(e);
                    });
                }


                if (virtualclass.system.wbRtc.peerCon) { //TODO this should be deleted
                    if (typeof localStorage.wbrtcMsg == 'undefined') {
                        virtualclass.view.multiMediaMsg('WebRtc');
                        localStorage.wbrtcMsg = true;
                    }
                }

                if(webcam == false){
                    virtualclass.user.control.videoDisable();
                    virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
                    //virtualclass.videoHost.UI.hideVideo();

                }

            },


            /**
             * This function  is invoked with the resulting media stream object if the call to getUserMedia succeeds.
             * And invoke handleUSerMediaError in case of getusermedia error.
             * handleUSerMedia  initializes audio.
             * @param stream object
             */

            handleUserMedia: function (stream) {
                localStorage.removeItem('dvid');
                var audioWiget = document.getElementById('audioWidget');
                var audio = localStorage.getItem('audEnable');
                if(roles.isStudent()){
                    if(audio != null){
                        audio = JSON.parse(audio);
                        if ((audio.ac == 'false' || audio.ac == false)) {
                            virtualclass.gObj.audioEnable = false;
                            virtualclass.user.control.audioDisable(true);
                        } else if (audio.ac == 'true' || audio.ac == true) {
                            virtualclass.gObj.audioEnable = true;
                            virtualclass.user.control.audioWidgetEnable(true);
                        }
                    }else if(!virtualclass.gObj.stdaudioEnable){
                        virtualclass.user.control.audioDisable();
                    }
                }else {
                    if (virtualclass.system.mediaDevices.hasMicrophone) {
                        virtualclass.gObj.video.audioVisual.readyForVisual(stream);
                        if (audio != null) {
                            audio = JSON.parse(audio);
                            if ((audio.ac == 'false' || audio.ac == false)) {
                                virtualclass.gObj.audioEnable = false;
                                virtualclass.user.control.audioDisable(true);
                            } else if (audio.ac == 'true' || audio.ac == true) {
                                virtualclass.gObj.audioEnable = true;
                                virtualclass.user.control.audioWidgetEnable(true);
                            }
                        } else if (typeof stream != 'undefined') {
                            virtualclass.user.control.audioWidgetEnable(true);
                        }
                    } else {
                        virtualclass.user.control.audioDisable();
                    }
                }

                var that = this;
                var mediaStreamTrack = stream.getVideoTracks()[0];
                if (typeof mediaStreamTrack != "undefined") {
                    mediaStreamTrack.onended = function () {//for Chrome.
                        virtualclass.system.mediaDevices.webcamErr.push('webcambusy');
                        // virtualclass.gObj.video.audio.removeAudioFromLocalStorage();
                    }
                }  else {
                    virtualclass.system.mediaDevices.webcamErr.push('nopermission');
                    //virtualclass.gObj.video.audio.removeAudioFromLocalStorage();
                }

                cthis.video.tempStream = stream;
                cthis.audio.init();
                var userDiv = document.getElementById("ml" + virtualclass.gObj.uid);
                if (userDiv != null) {
                    var vidTag = userDiv.getElementsByTagName('video');
                    if (vidTag != null) {
                        cthis._handleUserMedia(virtualclass.gObj.uid);
                    }
                }

                if(roles.hasAdmin()){
                    virtualclass.videoHost.isDomReady(function (){
                        virtualclass.videoHost.renderSelfVideo(stream); // Teacher video
                    });
                }

                // if(virtualclass.system.mediaDevices.hasMicrophone){
                //     cthis.stream = cthis.video.tempStream;
                //     cthis.audio._manuPulateStream();
                // }

                var vidstatus = localStorage.getItem("allVideoAction");
                if(vidstatus == "disable" && roles.isStudent()){
                    virtualclass.user.control.videoDisable();
                }else {
                    virtualclass.user.control.videoEnable();
                }

                /**
                 * Disable teacher video by default, when he/she will join first time
                 */

                if(localStorage.getItem('prevApp') == null){
                    if(roles.hasControls()){
                        //virtualclass.vutil.videoHandler();
                        virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() == 'off' ) ? 'on' : 'off');
                    }else if(virtualclass.gObj.meetingMode){
                        virtualclass.vutil.videoHandler('off');
                    }
                }
            },


            /**
             * Adding the class student or teacher to the each user's div
             * @param  id User id
             * @param  role user role
             */
            addUserRole: function (userDiv,  role) {
                // TODO, IMPROVE PERFORMANCE, hitting on joining of new members. talentedge, 5.4%
                // Fixed it, now need to validate it
                // That userDiv is passing while creating container in displayUserChatList with member Update
                // var userDiv = document.getElementById("ml" + id);
                userDiv.dataset.role = role
                if(typeof role !='undefined'){
                    var userType = (role == 's') ? 'student' : 'teacher';
                    userDiv.classList.add(userType);
                }else{
                    userDiv.classList.add("student");
                }

                if(virtualclass.gObj.uRole == 't' && userType == 'student'){
                    document.getElementById('virtualclassCont').classList.remove('student');
                }
            },

            /**
             * Creates a video element
             * and  replaces the image with video
             * manipulates the audio
             * and sends the video
             * @param string userid
             */
            _handleUserMedia: function (userid) {
                var userMainDiv = document.getElementById(userid);
                var stream = cthis.video.tempStream;

                if (typeof stream != 'undefined') {
                    if(virtualclass.system.mediaDevices.hasWebcam) {
                        var vidContainer = cthis.video.createVideoElement();
                        virtualclass.gObj.video.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

                        cthis.video.insertTempVideo(vidContainer);
                        cthis.video.tempVideoInit();
                        cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
                        virtualclass.adpt.attachMediaStream(cthis.video.myVideo, stream);
                        cthis.video.myVideo.muted = true;
                        cthis.stream = cthis.video.tempStream;
                        cthis.video.myVideo.onloadedmetadata = function () {
                            cthis.video.startToStream();
                            //virtualclass.precheck.webcam.createVideo();
                        }
                    }
                }
                userMedia = true;
            },
            /**
             * Increasing chat container's height as number of users is increased
             * user box scroll, right bar scroll
             *
             */
            updateVideoContHeight: function () {
                console.log('Updating User');
                var elem = document.getElementById("virtualclassCont");
                //var offset = vcan.utility.getElementOffset(elem);
                var offset = virtualclass.vutil.getElementOffset(elem);
                var mh = virtualclass.chat.boxHeight;

                var chatDiv = document.getElementById("chat_div");
                if(chatDiv.scrollHeight >= (mh+1)){
                    chatDiv.style.overflowY = "scroll";
                }

                chatDiv.style.maxHeight = mh + "px";

                console.log('Chat height ' + chatDiv.offsetHeight);
                console.log('Max height ' + chatDiv.style.maxHeight);

                if(virtualclass.isPlayMode){
                    chatDiv.style.maxHeight = mh + 64 + "px";
                }



            },
            // Closeing the video
            close: function () {
                if (virtualclass.gObj.video.hasOwnProperty('smallVid')) {
                    clearInterval(virtualclass.gObj.video.smallVid);
                }
            },
            /**
             * Plays all videos of currentlly logged in users after an interval of 1040 ms
             * @param id footer chat  container id
             */
            dispAllVideo: function (id) {
                setTimeout(
                    function () {
                        var chatCont = document.getElementById(id);
                        if (chatCont != null) {
                            var allVideos = chatCont.getElementsByTagName("video");
                            for (var i = 0; i < allVideos.length; i++) {
                                allVideos[i].play();
                            }
                        }
                    },
                    1040
                );
            },

            /**
             *TODO this function is not being invoked
             */
            existVideoContainer: function (user) {
                var allVideos = document.getElementsByClassName('userVideos');
                for (var i = 0; i < allVideos.length; i++) {
                    if (allVideos[i].id == "video" + user.id) {
                        return true;
                    }
                }
                return false;
            },

            /**
             * The function to invoke with the resulting MediaStreamError if the call to getUSerMedia fails.
             * disableing audioWiget
             * Disappearing all containers
             * @param error error object
             */
            handleUserMediaError: function (error) {
                var errorMsg = (typeof error == 'object') ? virtualclass.lang.getString(error.name) : virtualclass.lang.getString(error);

                if (errorMsg == null) {
                  virtualclass.view.createErrorMsg(error, 'errorContainer', 'chatWidget');
                } else {
                  virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'chatWidget');
                }

                virtualclass.user.control.mediaWidgetDisable('vd');
                virtualclass.view.disappearBox('WebRtc');
                localStorage.setItem('dvid', true);
                console.log('navigator.getUserMedia error: ', error);

                var errorCode = "";
                switch (error.name) {
                    case 'NotFoundError':
                    case 'DevicesNotFoundError':
                        errorCode = 'nowebcam';
                        break;
                    case 'SourceUnavailableError':
                        errorCode = 'webcambusy';
                        break;
                    case 'PermissionDeniedError':
                    case 'SecurityError':
                        errorCode = 'nopermission';
                        virtualclass.gObj.disableCamByUser = true;
                        break;
                    case 'NotAllowedError':
                        errorCode = 'nopermission';
                        virtualclass.gObj.disableCamByUser = true;
                        break;
                    default:
                        errorCode = 'rejected';
                }

                virtualclass.system.mediaDevices.webcamErr.push(errorCode);
                //virtualclass.gObj.video.audio.removeAudioFromLocalStorage();
            },


            detectAudioWorklet : () => {
                if (typeof OfflineAudioContext == 'undefined' || virtualclass.isPlayMode) {
                    return false;
                }else {
                    let context = new OfflineAudioContext(1, 1, 44100);
                    return Boolean(
                        context.audioWorklet &&
                        typeof context.audioWorklet.addModule === 'function');
                }
            }
        }
    };
    window.media = media;
})(window);
