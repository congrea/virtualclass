// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides functionality to capture , transmit and play audio and
 * video for multiple users.
 *
 */

(function (window) {
    "use strict";
    var repMode, buf, vidId, randomTime, cthis;

    var audioToBePlay = {};
    var aChunksPlay = {};
    var allAudioArr = {};
    var luid;
    var allAudioSend = [];
    var audioLen = 0;

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
    var audiotime = 0;
    var workerAudioSendOnmessage = false;
    var workerAudioRecOnmessage = false;

    // var allAudioArr = {};

    var userSource = {}; //for contain the user specific audio source
    var sNode = {};

    var ac = {};
    var sNodePak = {};
    var snNodePak;

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
            CONFIG: {
                width: {max: 268},
                height: {max: 142},
                frameRate: {max: 6}
            },

            audioPlayerNode: null,
            audioCreatorNode: null,


            /**
             * Replaces image with  video
             * @param id Id of the user
             * @param vidCont Video wrapper to replace the image
             */
            util: {
                imageReplaceWithVideo: function (id, vidCont) {
                    var chatUser = chatContainerEvent.elementFromShadowDom("#ml" + id);
                    if (chatContainerEvent.elementFromShadowDom("#ml" + id)) {
                        chatUser.classList.remove('userImg');
                    }

                    if (chatUser != null) {
                        var childTag = chatUser.getElementsByTagName('a')[0];
                        var imgTag = childTag.getElementsByTagName('span')[0] || childTag.getElementsByTagName('img')[0];
                        if (!childTag.classList.contains("hasVideo")) {
                            childTag.className += ' hasVideo';
                        }
                        var videoWrapper = childTag.querySelector('.videoWrapper');
                        if (imgTag == null && imgTag == undefined && videoWrapper != null) {
                            childTag.removeChild(videoWrapper);
                            childTag.appendChild(vidCont);

                        } else {
                            childTag.replaceChild(vidCont, imgTag);
                        }

                    } else {
                        console.log('chatUser is Null');
                    }
                }
            },

            audioVisual: {
                init: function () {
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

                readyForVisual: function (stream) {
                    this.source = this.audioCtx.createMediaStreamSource(stream);
                    this.source.connect(this.analyser);
                    this.analyser.connect(this.distortion);
                    this.distortion.connect(this.biquadFilter);
                    this.biquadFilter.connect(this.convolver);
                    this.convolver.connect(this.gainNode);
                    this.gainNode.connect(this.audioCtx.destination);
                }
            },

            workerAudioSendOnmessage (){
                workerAudioSend.onmessage = function (e) {
                    if (e.data.hasOwnProperty('cmd')) {
                        if (e.data.cmd === 'adStatus') {
                            virtualclass.media.audio.setAudioStatus(e.data.msg);
                            if (!virtualclass.gObj.sendAudioStatus && e.data.msg == 'sending') {
                                ioAdapter.send({cf: 'ya'}); // yes audio
                                virtualclass.gObj.sendAudioStatus = true
                            }

                        } else if (e.data.cmd === 'ioAdapterSend') {
                            if (e.data.msg.cf === 'na') { // yes audio
                                virtualclass.gObj.sendAudioStatus = false;
                            } else {
                                virtualclass.gObj.sendAudioStatus = true;
                            }
                            ioAdapter.send(e.data.msg);
                        } else if (e.data.cmd === 'muteAudio') {
                            cthis.audio.notifiyMuteAudio();
                        } else if (e.data.cmd === 'unMuteAudio') {
                            cthis.audio.notifiyUnmuteAudio();
                        }
                    }
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
                snode: [], // To holds the user's id whose audio context is suspended
                workletAudioRec: false,
                aChunksPlay: false,
                audioContextReady: false,
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
                    };
                    this.attachFunctionsToAudioWidget(); // to attach functions to audio widget

                },

                initAudiocontext: function () {
                    if (!this.hasOwnProperty('Html5Audio') && !virtualclass.gObj.meetingMode) {
                        this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                        if (virtualclass.media.audio.Html5Audio.audioContext == null) {
                            alert('audio context is null');
                        }
                        this.resampler = new Resampler(virtualclass.media.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
                        virtualclass.gObj.isAudioContextReady = true;
                        this.audioContextReady = true;

                        if (virtualclass.system.mediaDevices.hasMicrophone && !virtualclass.isPlayMode && cthis.video.tempStream != null) {
                            virtualclass.media.stream = cthis.video.tempStream;
                            virtualclass.media.audio._maniPulateStream();
                        }
                    }
                },

                /** Iniates the script processor node to play the audio **/
                initScriptNode: function () {
                    for (var i = 0; i < this.snode.length; i++) {
                        this._playWithFallback(this.snode[i]);
                    }
                    this.snode = [];
                },

                attachAudioStopHandler (stream){
                    audioTrack = stream.getAudioTracks()[0];
                    if (audioTrack != null) {
                        audioTrack.onended = this.notifiyMuteAudio; // TODO, re initate media stream
                        audioTrack.onmute = this.notifiyMuteAudio;
                        audioTrack.onunmute = this.notifiyUnmuteAudio;
                    }
                },

                notifiyMuteAudio(){
                    this.notifyAudioMute = true;
                    if (virtualclass.gObj.audMouseDown) {
                        if (virtualclass.gObj.mutedomop) {
                            if (!virtualclass.gObj.hasOwnProperty('mutedomopto') || virtualclass.gObj.mutedomopto === null) {
                                virtualclass.gObj.mutedomopto = setTimeout(() => {
                                    cthis.audio.notifiyMuteAudioDom();
                                }, 2000)
                            }
                        } else {
                            cthis.audio.notifiyMuteAudioDom();
                        }
                    }
                },

                notifiyUnmuteAudio(){
                    this.notifyAudioMute = false;
                    virtualclass.gObj.mutedomop = true;
                    if (virtualclass.gObj.hasOwnProperty('mutedomopto')) {
                        clearTimeout(virtualclass.gObj.mutedomopto);
                        virtualclass.gObj.mutedomopto = null;
                    }
                    cthis.audio.notifiyUnmuteAudioDom();
                },

                notifiyUnmuteAudioDom(){
                    // console.log('==== notify unmute audio');
                    if (this.hasOwnProperty('speakerPressOnce') && this.speakerPressOnce != null && this.speakerPressOnce.classList.contains('audioMute')) {
                        this.speakerPressOnce.classList.remove('audioMute');
                    }
                },

                notifiyMuteAudioDom(){
                    if (!this.hasOwnProperty('speakerPressOnce')) {
                        this.speakerPressOnce = document.querySelector('#speakerPressOnce');
                    }

                    if (this.speakerPressOnce != null && !this.speakerPressOnce.classList.contains('audioMute')) {
                        this.speakerPressOnce.classList.add('audioMute');
                    }
                },


                muteButtonToogle: function () {
                    var speakerPressOnce = document.querySelector('#speakerPressOnce');
                    if (speakerPressOnce != null && (speakerPressOnce.dataset.audioPlaying && speakerPressOnce.dataset.audioPlaying == 'true')) {
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
                    if (virtualclass.gObj.audMouseDown && io.webSocketConnected()) {
                        var uid = virtualclass.vutil.breakintobytes(virtualclass.gObj.uid, 8);
                        var scode = new Int8Array([101, uid[0], uid[1], uid[2], uid[3]]); // Status Code Audio
                        var sendmsg = new Int8Array(msg.length + scode.length);
                        sendmsg.set(scode);
                        sendmsg.set(msg, scode.length); // First element is status code (101)
                        ioAdapter.sendBinary(sendmsg);

                        virtualclass.media.audio.setAudioStatus(adStatus);
                    } else {
                        virtualclass.media.audio.setAudioStatus("stop");
                    }
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
                        if (allAudTools[i].id === 'speakerPressOnce') {
                            //allAudTools[i].setAttribute('data-audio-playing', "false");
                        } else if (allAudTools[i].id === 'speakerPressing') {
                            this.attachSpeakToStudent(allAudTools[i].id);
                        }
                        if (allAudTools[i].id !== 'speakerPressing') {
                            allAudTools[i].addEventListener('click', that.audioToolInit);
                        }
                    }
                },

                /**
                 * It is invoked on clicking on or off button appeared on audio widget
                 * And it is invoked on clicking test audio
                 */
                audioToolInit: function () {
                    if (virtualclass.gObj.meetingMode) {
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
                        var that = virtualclass.media.audio;
                        if (this.id === 'speakerPressOnce') {
                            that.clickOnceSpeaker(this.id);
                        } else if (this.id === 'silenceDetect') {
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
                    if (tag.getAttribute('data-audio-playing') === 'false' && typeof alwaysDisable == 'undefined') {
                        //this.studentSpeak(alwaysPressElem);
                        this.studentSpeak();

                        tag.setAttribute('data-audio-playing', "true");
                        anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
                        tag.className = "audioTool active";


                    } else {
                        this.studentNotSpeak();
                        tag.setAttribute('data-audio-playing', "false");
                        if (anchor) {
                            anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
                        }
                        tag.className = "audioTool deactive";
                    }
                },

                initProcessorEvent () {
                    if (virtualclass.gObj.hasOwnProperty('initProcessorTime')) {
                        clearInterval(virtualclass.gObj.initProcessorTime);
                    }
                    virtualclass.gObj.initProcessorTime = setInterval(() => {
                        if (cthis.audio.notifyAudioMute) {
                            cthis.audio.notifiyMuteAudio();
                        }
                    }, 2000);
                },

                /**
                 * Audio tool element 'Push to talk' is active
                 * User speaks on mouse press down
                 * @param elem audio tool element
                 */
                studentSpeak: function (elem) {
                    this.notifyAudioMute = true;
                    this.initProcessorEvent();
                    if (typeof elem != 'undefined') {
                        var button = document.getElementById(elem.id + "Button");
                        elem.classList.remove('deactive');
                        elem.classList.add('active');
                    }
                    virtualclass.gObj.audMouseDown = true;
                    workerAudioSend.postMessage({
                        'cmd': 'audioMouseDown',
                        msg: {adMouseDown: virtualclass.gObj.audMouseDown}
                    });
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
                        workerAudioSend.postMessage({
                            'cmd': 'audioMouseDown',
                            msg: {audMouseDown: virtualclass.gObj.audMouseDown}
                        });
                        virtualclass.media.audio.setAudioStatus("stop");
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

                        if (virtualclass.gObj.audMouseDown && (io.webSocketConnected())) {
                            // var left = e.inputBuffer.getChannelData(0);
                            var samples = this.resampler.resampler(left);
                            var leftSix = convertFloat32ToInt16(samples);
                            var send = this.encodeAudio(leftSix);
                            this.silenceDetection(send, leftSix);
                        }

                    }
                },

                /**
                 * Resamples the audio and silence detection, and broadcast audio
                 * it's fallback method in case of not supporting audio worklet
                 */
                recorderProcessFallback: function (e) {
                    workerAudioSend.postMessage({'cmd': 'rawAudio', msg: e.inputBuffer.getChannelData(0)});
                },

                /**
                 * Encodes the sampled data
                 *@param leftSix audio data
                 *@return encoded  G711 encoded data
                 */
                //TODO function name should reflect the action
                encodeAudio: function (leftSix) {
                    var encoded = G711.encode(leftSix, {
                        alaw: this.encMode === "alaw" ? true : false
                    });
                    return encoded;
                },

                /**
                 * pushing the encoded samples in audioForTest array
                 * setting the uid to false
                 * @param  leftSix audio samples
                 *
                 */
                audioForTesting: function (leftSix) {
                    var encoded = G711.encode(leftSix, {
                        alaw: this.encMode === "alaw" ? true : false
                    });
                    virtualclass.gObj.audioForTest.push(encoded);
                    virtualclass.gObj[virtualclass.gObj.uid] = false;
                },

                initPlayWithFallback (){
                    if (!this.hasOwnProperty('Html5Audio') && !this.Html5Audio) {
                        this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                    }

                    if (!workerAudioRecOnmessage) {

                        var audioReadyChannel = new MessageChannel();
                        workerIO.postMessage({
                            cmd: "workerAudioRec",
                        }, [audioReadyChannel.port1]);

                        // Setup the connection: Port 2 is for worker 2
                        workerAudioRec.postMessage({
                            cmd: "workerIO",
                            sampleRate: this.Html5Audio.audioContext.sampleRate,
                        }, [audioReadyChannel.port2]);

                        workerAudioRec.postMessage({'cmd': 'audioWorklet', msg: false});
                        workerAudioRec.onmessage = function (e) {

                            switch (e.data.cmd) {
                                case "noAudioWorklet" :
                                    virtualclass.media.audio.queueWithFalback(e.data.msg.data, e.data.msg.uid);
                                    virtualclass.media.audio.playWithFallback(e.data.msg.uid);
                                    break;
                                default :
                                    console.log('do nothing');
                            }
                        }
                        workerAudioRecOnmessage = true;
                        // virtualclass.gObj.workerAudio = true;
                        virtualclass.gObj.audioRecWorkerReady = true;
                    }
                },

                initPlay: function () {
                    if (!this.hasOwnProperty('Html5Audio') && !this.Html5Audio) {
                        this.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                    }

                    if (typeof workletAudioRec != 'object') {
                        cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(workletAudioRecBlob).then(() => {
                            // Setup the connection: Port 1 is for worker 1
                            if (typeof initchannel == 'undefined') {

                                workletAudioRec = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'worklet-audio-rec');
                                cthis.audio.Html5Audio.MediaStreamDest = cthis.audio.Html5Audio.audioContext.createMediaStreamDestination();
                                workletAudioRec.connect(cthis.audio.Html5Audio.audioContext.destination);


                                if (virtualclass.system.mybrowser.name === 'Chrome') {
                                    console.log("==== Chrome after change");
                                    cthis.audio.bug_687574_callLocalPeers();
                                }

                                var audioReadyChannel = new MessageChannel();
                                workerIO.postMessage({
                                    cmd: "workerAudioRec",
                                }, [audioReadyChannel.port1]);

                                // Setup the connection: Port 2 is for worker 2
                                workerAudioRec.postMessage({
                                    cmd: "workerIO",
                                    sampleRate: cthis.audio.Html5Audio.audioContext.sampleRate,
                                }, [audioReadyChannel.port2]);

                                var audoPlaychannel = new MessageChannel();

                                workerAudioRec.postMessage({
                                    cmd: "workletAudioRec",
                                }, [audoPlaychannel.port1]);

                                // Setup the connection: Port 2 is for worker 2
                                workletAudioRec.port.postMessage({
                                    cmd: "workerAudioRec",
                                }, [audoPlaychannel.port2]);
                                workerAudioRec.postMessage({'cmd': 'audioWorklet', msg: true});
                                initchannel = true;
                                virtualclass.gObj.audioRecWorkerReady = true;
                            }
                            // virtualclass.gObj.workerAudio = true;
                        })
                    }
                },

                /**
                 * This function plays the audio with using audio worklet
                 * @param  uid User id
                 * @param  audioChunks that need be played
                 */


                /**
                 * This function plays the audio with using Script Processor Node which is deprecated,
                 * it's a fallback method in case of audio worklet is not supported.
                 * @param  uid is User Id
                 * @param  audioChunks that need be played
                 */
                playWithFallback: function (uid) {
                    if (this.Html5Audio.audioContext.state === 'suspended') {
                        /** Wait till 2 seconds and see if still it's suspended ***/
                        if (this.hasOwnProperty('audioSuspendTime')) {
                            clearTimeout(this.audioSuspendTime);
                        }

                        this.audioSuspendTime = setTimeout(() => {
                            if (this.Html5Audio.audioContext.state === 'suspended') {
                                this.snode.push(uid);
                                if (virtualclass.gObj.requestToScriptNode === null) {
                                    this.Html5Audio.audioContext.resume();
                                    virtualclass.gesture.initAudioResume(uid);
                                    virtualclass.gObj.requestToScriptNode = true;
                                }
                            }
                        }, 2000);

                    } else {
                        this._playWithFallback();
                    }
                },

                _playWithFallback: function () {
                    var that = this;
                    if (virtualclass.media.audioPlayerNode === null || virtualclass.media.audioPlayerNode.context.state === 'closed') {
                        console.log('script processor node is created');
                        if (virtualclass.media.audioPlayerNode !== null) {
                            virtualclass.media.audioPlayerNode.disconnect();
                        }

                        virtualclass.media.audioPlayerNode = this.Html5Audio.audioContext.createScriptProcessor(4096, 1, 1);
                        snNodePak = 0;
                        virtualclass.media.audioPlayerNode.onaudioprocess = function (event) {
                            var output = event.outputBuffer.getChannelData(0);
                            var newAud = that.getMergedAudio();
                            if (newAud !== null && newAud !== undefined) {
                                for (var i = 0; i < newAud.length; i++) {
                                    output[i] = newAud[i];
                                }
                                snNodePak = newAud[4095];
                            } else {
                                for (var i = 0; i < output.length; i++) {
                                    output[i] = snNodePak;
                                }
                            }
                        };
                        virtualclass.media.audioPlayerNode.connect(this.Html5Audio.audioContext.destination);
                    }
                },

                queueWithFalback (packets, uid) {
                    if (audioToBePlay[uid] == null) {
                        audioToBePlay[uid] = [];
                    }

                    if (allAudioArr[uid] == null) {
                        allAudioArr[uid] = [];
                    }

                    for (let i = 0; i < packets.length; i++) {
                        allAudioArr[uid].push(packets[i]);
                    }

                    while (allAudioArr[uid].length >= 4096) {
                        let arrChunk = allAudioArr[uid].splice(0, 4096);
                        audioToBePlay[uid].push(new Float32Array(arrChunk));
                    }
                },


                /** Return Merged audio which received from different sources **/
                getMergedAudio: function () {
                    // console.log('AUDIO' + allAudioArr[158].length);
                    allAudioSend = [];
                    audioLen = 0;
                    for (luid in audioToBePlay) {
                        let temp = this.getAudioChunks(luid);
                        if (temp != null) {
                            audioLen++;
                            if (audioLen === 1) {
                                // allAudioSend = temp;
                                for (let z = 0; z < 4096; z++) {
                                    allAudioSend[z] = temp[z];
                                }
                            } else {
                                for (let z = 0; z < 4096; z++) {
                                    allAudioSend[z] = allAudioSend[z] + temp[z];
                                }
                            }
                        }
                    }

                    if (audioLen === 1) {
                        return allAudioSend;
                    } else if (audioLen > 1) {
                        for (let z = 0; z < 4096; z++) {
                            allAudioSend[z] = allAudioSend[z] / audioLen;
                        }
                        return allAudioSend;
                    }
                },


                /**
                 * Remove audios from queue if it's long
                 * @returns {*} the audio packet with length of 128
                 */
                getAudioChunks (uid) {
                    if (audioToBePlay !== null) {
                        if (audioToBePlay[uid].length >= 9) { // 835.918371 ms
                            while (audioToBePlay[uid].length >= 3) { // 278.639457 ms
                                audioToBePlay[uid].shift();
                            }
                            aChunksPlay[uid] = true;
                            return audioToBePlay[uid].shift();
                        } else if (audioToBePlay[uid].length >= 2) { // 185.759638 ms
                            aChunksPlay[uid] = true;
                            return audioToBePlay[uid].shift();
                        } else if (audioToBePlay[uid].length > 0 && aChunksPlay[uid] === true) {
                            aChunksPlay[uid] = true;
                            return audioToBePlay[uid].shift();
                        } else {
                            aChunksPlay[uid] = false;
                            if (audioToBePlay[uid].length === 0) {
                                delete audioToBePlay[uid];
                            }
                        }
                    }
                },


                _maniPulateStream: function () {
                    console.log("Manipulate stream");
                    this.triggermaniPulateStream = true;
                    var cthis = virtualclass.media;
                    setTimeout(
                        function () {
                            if (cthis.detectAudioWorklet()) {
                                cthis.audio.maniPulateStream();
                            } else {
                                cthis.audio.maniPulateStreamWithFallback();
                            }
                        }, 1000
                    );
                },


                /***
                 * It connects the stream received from Mic/GetUserMedia to audio context,
                 * and getting the audio chunks from audio worklet
                 **/
                maniPulateStream: function () {
                    var stream = cthis.stream;
                    if (typeof workletAudioSend != 'undefined') {
                        workletAudioSend.disconnect();
                    }
                    if (typeof stream != 'undefined' && stream != null) {
                        console.log('Audio worklet init add module');
                        cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(workletAudioSendBlob).then(() => {

                            let audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);

                            filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
                            filter.type = "lowpass";
                            filter.frequency.value = 2000;
                            audioInput.connect(filter);

                            workletAudioSend = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'worklet-audio-send');

                            workletAudioSend.onprocessorerror = function (e) {
                                cthis.audio.notifiyMuteAudio();
                            }
                            filter.connect(workletAudioSend);
                            workletAudioSend.connect(cthis.audio.Html5Audio.audioContext.destination);

                            var IOAudioSendWorker = new MessageChannel();

                            workerAudioSend.postMessage({
                                cmd: "workerIO",
                                sampleRate: this.Html5Audio.audioContext.sampleRate,
                                uid: virtualclass.gObj.uid
                            }, [IOAudioSendWorker.port1]);

                            // Setup the connection: Port 2 is for worker 2
                            workerIO.postMessage({
                                cmd: "workerAudioSend"
                            }, [IOAudioSendWorker.port2]);


                            var workerWorkletAudioSend = new MessageChannel();

                            workerAudioSend.postMessage({
                                cmd: "audioWorkletSend",
                                msg: {repMode: repMode},
                            }, [workerWorkletAudioSend.port1]);

                            // Setup the connection: Port 2 is for worker 2
                            workletAudioSend.port.postMessage({
                                cmd: "workerAudioSend",
                            }, [workerWorkletAudioSend.port2]);

                            cthis.workerAudioSendOnmessage();
                            console.log('Audio worklet ready audio worklet module');
                        }).catch(e => {
                            cthis.audio.notifiyMuteAudio();
                        });
                    }
                },

                /**
                 * It connects the stream received from Mic/GetUserMedia to audio context,
                 * and getting the audio chunks from script processor node.
                 * It's a fallback method in case of not supporting Audio worklet
                 **/
                maniPulateStreamWithFallback: function () {
                    if (typeof cthis.stream != 'undefined' && cthis.stream != null) {
                        var stream = cthis.stream;

                        var audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);
                        cthis.audio.bufferSize = 4096;
                        // virtualclass.media.audioCreatorNode is being made global because recorderProcess with onaudioprocess is not triggered due to Garbage Collector
                        // https://code.google.com/p/chromium/issues/detail?id=360378

                        virtualclass.media.audioCreatorNode = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
                        virtualclass.media.audioCreatorNode.onaudioprocess = cthis.audio.recorderProcessFallback.bind(cthis.audio);

                        filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
                        filter.type = "lowpass";
                        filter.frequency.value = 2000;

                        audioInput.connect(filter);
                        filter.connect(virtualclass.media.audioCreatorNode);
                        virtualclass.media.audioCreatorNode.connect(cthis.audio.Html5Audio.audioContext.destination);


                        let IOAudioSendWorker = new MessageChannel();

                        workerAudioSend.postMessage({
                            cmd: "workerIO",
                            uid: virtualclass.gObj.uid,
                            sampleRate: cthis.audio.Html5Audio.audioContext.sampleRate
                        }, [IOAudioSendWorker.port1]);

                        // Setup the connection: Port 2 is for worker 2
                        workerIO.postMessage({
                            cmd: "workerAudioSend"
                        }, [IOAudioSendWorker.port2]);

                        cthis.workerAudioSendOnmessage();

                    } else {
                        console.log("No stream is found");
                    }
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
                 * To extract user id of sender and data from the receied message
                 * @param  msg recevied message from online users
                 * @returns {Array} userid received with the  message plus rest of the msz data
                 */
                extractData: function (msg) {
                    var data_pack = new Int8Array(msg);
                    var uid = virtualclass.vutil.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
                    return [uid, data_pack.subarray(5, data_pack.length)];
                },

                removeAudioFromLocalStorage: function () {
                    console.log('Remove audio from local storage');
                    localStorage.removeItem('audEnable');
                },

                bug_687574_callLocalPeers: async function () {
                    let lc1, lc2;
                    lc1 = new RTCPeerConnection();
                    lc1.count = 0;
                    lc1.addEventListener('icecandidate', e => onIceCandidate(lc1, e));
                    lc1.addEventListener('connectionstatechange', e => onconnectionstatechange(lc1, e));

                    lc2 = new RTCPeerConnection();
                    lc2.count = 0;
                    lc2.addEventListener('icecandidate', e => onIceCandidate(lc2, e));
                    lc2.addEventListener('connectionstatechange', e => onconnectionstatechange(lc2, e));
                    lc2.addEventListener('track', gotRemoteStream);

                    cthis.audio.Html5Audio.MediaStreamDest.stream.getTracks().forEach(track => lc1.addTrack(track, cthis.audio.Html5Audio.MediaStreamDest.stream));

                    function onconnectionstatechange(pc, event) {
                        if (event.currentTarget.connectionState === "connected") {
                            try { // TODO Dirty try hack
                                console.log('PEER connected webrtc');
                                workletAudioRec.disconnect(cthis.audio.Html5Audio.audioContext.destination);
                                workletAudioRec.connect(cthis.audio.Html5Audio.MediaStreamDest);
                            } catch (e) {
                            }
                        } else if (event.currentTarget.connectionState === "disconnected") {
                            console.log('PEER disconnected');
                            lc1.close();
                            lc2.close();
                            lc1 = null;
                            lc2 = null;
                            try {
                                workletAudioRec.disconnect(cthis.audio.Html5Audio.MediaStreamDest);
                                workletAudioRec.connect(cthis.audio.Html5Audio.audioContext.destination);
                                console.log('PEER connected normal audio api');
                            } catch (e) {
                            }
                            cthis.audio.bug_687574_callLocalPeers();
                        }
                    }

                    try {
                        const offer = await lc1.createOffer();
                        await onCreateOfferSuccess(offer);
                    } catch (e) {
                        onError();
                    }

                    function gotRemoteStream(e) {
                        let audio = document.createElement('audio');
                        audio.srcObject = e.streams[0];
                        audio.autoplay = true;
                    }

                    async function onCreateOfferSuccess(desc) {
                        try {
                            await lc1.setLocalDescription(desc);
                            await lc2.setRemoteDescription(desc);
                        } catch (e) {
                            onError();
                        }
                        try {
                            const answer = await lc2.createAnswer();
                            await onCreateAnswerSuccess(answer);
                        } catch (e) {
                            onError();
                        }
                    }

                    async function onCreateAnswerSuccess(desc) {
                        try {
                            await lc2.setLocalDescription(desc);
                            await lc1.setRemoteDescription(desc);
                        } catch (e) {
                            onError();
                        }
                    }

                    async function onIceCandidate(pc, event) {
                        if (event.candidate) {
                            if (event.candidate.type === "host") { // We only want to connect over LAN
                                try {
                                    await (getOtherPc(pc).addIceCandidate(event.candidate));
                                } catch (e) {
                                    onError();
                                }
                            }
                        }
                    }

                    function getOtherPc(pc) {
                        return (pc === lc1) ? lc2 : lc1;
                    }

                    function onError() {
                        // Peer connection failed, fallback to standard
                        console.log('PEER fallback');
                        try {
                            workletAudioRec.connect(cthis.audio.Html5Audio.audioContext.destination);
                            lc1.close();
                            lc2.close();
                            lc1 = null;
                            lc2 = null;
                        } catch (e) {
                            lc1 = null;
                            lc2 = null;
                        }
                    }
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
                    virtualclass.media.util.imageReplaceWithVideo(user.id, videoCont);
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
                    if (io.webSocketConnected()) {
                        virtualclass.vutil.beforeSend({videoByImage: user, 'cf': 'videoByImage'}, null, true);
                        ioAdapter.sendBinary(sendimage);
                    }

                },

                send: function () {
                    if (virtualclass.media.hasOwnProperty('smallVid')) {
                        clearInterval(virtualclass.media.smallVid);
                    }
                    var cvideo = this;
                    var frame;
                    randomTime = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000); // Random number between 3000 & 8000
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
                        if (!virtualclass.videoHost.gObj.stdStopSmallVid && !roles.hasControls() || (roles.hasControls() && virtualclass.videoHost.gObj.videoSwitch )) {
                            var uid = breakintobytes(virtualclass.gObj.uid, 8);
                            var scode = new Uint8ClampedArray([11, uid[0], uid[1], uid[2], uid[3], vidType]);// First parameter represents  the protocol rest for user id
                            var sendmsg = new Uint8ClampedArray(sendimage.length + scode.length);
                            sendmsg.set(scode);
                            sendmsg.set(sendimage, scode.length);
                            that.sendInBinary(sendmsg);
                        }
                        clearInterval(virtualclass.media.smallVid);

                        if (virtualclass.hasOwnProperty('connectedUsers')) {
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
                                if (p < 0) {
                                    p = 0;
                                }
                                var md = p * td;
                                virtualclass.media.smallVid = setInterval(sendSmallVideo, (d + md));
                            } else {
                                virtualclass.media.smallVid = setInterval(sendSmallVideo, d);
                            }
                        }
                    }

                    virtualclass.media.smallVid = setInterval(sendSmallVideo, randomTime);
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

                drawReceivedImage: function (imgData, imgType, d, uid) {
                    this.remoteVid = chatContainerEvent.elementFromShadowDom("#video" + uid);
                    if (this.remoteVid != null) {
                        this.remoteVidCont = this.remoteVid.getContext('2d');
                        if (virtualclass.system.webpSupport || (imgType === "jpeg")) {
                            var img = new Image();
                            var that = this;
                            img.onload = function () {
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
                                videoSubWrapper.setAttribute("data-uname", +num);
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
                    //cthis.video.tempVid = document.getElementById('tempVideo');
                    cthis.video.tempVid = chatContainerEvent.elementFromShadowDom("#tempVideo");
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
                    if (data_pack[5] === 1) {
                        var b64encoded = "data:image/webp;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                        var imgType = "webp";
                    } else {
                        var b64encoded = "data:image/jpeg;base64," + btoa(virtualclass.videoHost.Uint8ToString(recmsg));
                        var imgType = "jpeg";
                    }


                    // virtualclass.media.video.playWithoutSlice(uid, recmsg, imgType);
                    virtualclass.media.video.drawReceivedImage(b64encoded, imgType, {x: 0, y: 0}, uid);
                }
            },

            sessionConstraints: function () {
                var webcam = virtualclass.system.mediaDevices.hasWebcam ? true : false;

                /**
                 * Reduce the resolution and video frame rate to optimization CPU resource
                 *
                 **/

                if (virtualclass.gObj.meetingMode && webcam) {
                    if (virtualclass.system.device === 'mobTab' && virtualclass.system.mybrowser.name === 'iOS' ||
                        virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'Safari') {
                        var webcam = true;
                    } else {
                        var webcam = {
                            width: {max: 268},
                            height: {max: 142},
                            frameRate: {max: 6}
                        };
                        // webcam = true;
                    }
                }

                if (virtualclass.system.mediaDevices.hasMicrophone) {
                    var audioConstraint = {
                        echoCancellation: true,
                        autoGainControl: true,
                        channelCount: 1,
                        noiseSuppression: true
                    }
                } else {
                    var audioConstraint = false;
                }


                var session = {
                    //audio: virtualclass.gObj.multiVideo ? true :  audioOpts,
                    video: webcam,
                    audio: audioConstraint
                };

                return [webcam, session];
            },

            /**
             * It creates a mediator for getUSerMedia
             * and it prompts the user for permission to use video or audio device
             * it  inalizes the video
             */
            /* TODO @param vbool :no use of parameter vbool */


            init: function (cb) {
                console.log('Video second, normal video');
                cthis = this; //TODO there should be done work for cthis
                virtualclass.gObj.oneExecuted = true;

                if (virtualclass.gesture.classJoin) {
                    virtualclass.gesture.attachHandler();
                    delete virtualclass.gesture.classJoin;
                }

                var webcam, session;
                [webcam, session] = this.sessionConstraints();

                cthis.video.init();
                // cthis.audio.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
                // cthis.audio.resampler = new Resampler(cthis.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
                var that = this;
                // Default we disable audio and video

                virtualclass.user.control.audioDisable();
                virtualclass.user.control.videoDisable();

                if (!virtualclass.vutil.isPlayMode()) {
                    if (virtualclass.adpt == null) {
                        virtualclass.adpt = new virtualclass.adapter();
                    }

                    if (virtualclass.media.video.tempStream != null) {
                        // var tracks = virtualclass.media.video.tempStream.getTracks()[0];  // if only one media track
                        // track.stop();
                        var tracks = virtualclass.media.video.tempStream.getTracks();  // if only one media track
                        for (let i = 0; i < tracks.length; i++) {
                            tracks[i].stop();
                        }
                    }


                    var cNavigator = virtualclass.adpt.init(navigator);
                    cNavigator.mediaDevices.getUserMedia(session).then(function (stream) {
                        that.handleUserMedia(stream)

                        if (virtualclass.gObj.meetingMode) {
                            virtualclass.multiVideo.init();
                        }

                        if (typeof cb != 'undefined') {
                            cb('success');
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

                if (webcam == false) {
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
                if (roles.isStudent() && virtualclass.system.mediaDevices.hasMicrophone) {
                    // virtualclass.media.audioVisual.readyForVisual(stream);
                    //var str = localStorage.getItem("settings");
                    //var settings = (str !== null) ? virtualclass.settings.onLoadSettings(str) : virtualclass.settings.onLoadSettings(virtualclassSetting.settings);

                    //audio = JSON.parse(audio);

                    if ((virtualclass.settings.info.disableAttendeeAudio === false)) {
                        virtualclass.gObj.audioEnable = false;
                        virtualclass.user.control.audioDisable(true);
                    } else if (virtualclass.settings.info.disableAttendeeAudio === true) {
                        virtualclass.gObj.audioEnable = true;
                        virtualclass.user.control.audioWidgetEnable(true);
                    } else if (virtualclass.settings.info.disableAttendeeAudio !== true) {
                        virtualclass.user.control.audioDisable();
                    }

                    /*/
                     if(str != null){
                     //audio = JSON.parse(audio);
                     if ((virtualclass.settings.info..disableAttendeeAudio === false)) {
                     virtualclass.gObj.audioEnable = false;
                     virtualclass.user.control.audioDisable(true);
                     } else if (settings..disableAttendeeAudio === true) {
                     virtualclass.gObj.audioEnable = true;
                     virtualclass.user.control.audioWidgetEnable(true);
                     }
                     }else if(settings..disableAttendeeAudio !== true){
                     virtualclass.user.control.audioDisable();
                     }else if(settings..disableAttendeeAudio === true){
                     virtualclass.gObj.audioEnable = true;
                     virtualclass.user.control.audioWidgetEnable(true);
                     } */

                } else {
                    if (virtualclass.system.mediaDevices.hasMicrophone) {
                        // virtualclass.media.audioVisual.readyForVisual(stream);
                        if (audio != null) {
                            audio = JSON.parse(audio);
                            if ((audio.ac === 'false' || audio.ac === false)) {
                                virtualclass.gObj.audioEnable = false;
                                virtualclass.user.control.audioDisable(true);
                            } else if (audio.ac === 'true' || audio.ac === true) {
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
                        // virtualclass.media.audio.removeAudioFromLocalStorage();
                    }
                } else {
                    virtualclass.system.mediaDevices.webcamErr.push('nopermission');
                }

                cthis.video.tempStream = stream;
                cthis.audio.init();
                cthis.audio.attachAudioStopHandler(stream);

                var userDiv = chatContainerEvent.elementFromShadowDom("#ml" + virtualclass.gObj.uid);
                if (userDiv != null) {
                    var vidTag = userDiv.getElementsByTagName('video');
                    if (vidTag != null) {
                        cthis._handleUserMedia(virtualclass.gObj.uid);
                    }
                }

                if (roles.hasAdmin()) {
                    virtualclass.videoHost.isDomReady(function () {
                        virtualclass.videoHost.renderSelfVideo(stream); // Teacher video
                    });
                }

                //var vidstatus = localStorage.getItem("allVideoAction");
                if (virtualclass.settings.info.disableAttendeeVideo === false && roles.isStudent()) {
                    virtualclass.user.control.videoDisable();
                } else {
                    //!virtualclass.gObj.stdvideoEnable
                    if (roles.isStudent() && virtualclass.settings.info.disableAttendeeVideo !== true) {
                        virtualclass.vutil.videoHandler("off");
                        virtualclass.videoHost.toggleVideoMsg('disable');
                    } else {
                        virtualclass.user.control.videoEnable();
                        if (roles.isStudent()) {
                            // after refresh video disable when user enable his video etc.
                            virtualclass.vutil.videoHandler("off");
                        }
                    }

                    //var videoAction = localStorage.getItem("allVideoAction");
                    if (virtualclass.settings.info.disableAttendeeVideo === true) {
                        virtualclass.user.control.videoEnable();
                    }
                }

                /**
                 * Disable teacher video by default, when he/she will join first time
                 */

                if (localStorage.getItem('prevApp') == null) {
                    if (roles.hasControls()) {
                        //virtualclass.vutil.videoHandler();
                        virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off' ) ? 'on' : 'off');
                    } else if (virtualclass.gObj.meetingMode) {
                        virtualclass.vutil.videoHandler('off');
                    }
                }

                if (cthis.audio.audioContextReady && !cthis.audio.hasOwnProperty('triggermaniPulateStream')) {
                    cthis.stream = cthis.video.tempStream;
                    cthis.audio._maniPulateStream();
                }
            },


            /**
             * Adding the class student or teacher to the each user's div
             * @param  id User id
             * @param  role user role
             */
            addUserRole: function (userDiv, role) {
                // TODO, IMPROVE PERFORMANCE, hitting on joining of new members. talentedge, 5.4%
                // Fixed it, now need to validate it
                // That userDiv is passing while creating container in displayUserChatList with member Update
                // var userDiv = document.getElementById("ml" + id);
                userDiv.dataset.role = role
                if (typeof role != 'undefined') {
                    var userType = (role === 's') ? 'student' : 'teacher';
                    userDiv.classList.add(userType);
                } else {
                    userDiv.classList.add("student");
                }

                if (virtualclass.gObj.uRole === 't' && userType === 'student') {
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
                if (typeof cthis != 'undefined') {
                    var stream = cthis.video.tempStream;

                    if (typeof stream != 'undefined') {
                        if (virtualclass.system.mediaDevices.hasWebcam) {
                            var vidContainer = cthis.video.createVideoElement();
                            virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

                            cthis.video.insertTempVideo(vidContainer);
                            cthis.video.tempVideoInit();
                            // cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
                            cthis.video.myVideo = chatContainerEvent.elementFromShadowDom("#video" + virtualclass.gObj.uid);
                            virtualclass.adpt.attachMediaStream(cthis.video.myVideo, stream);
                            cthis.video.myVideo.muted = true;
                            cthis.stream = cthis.video.tempStream;
                            cthis.video.myVideo.onloadedmetadata = function () {
                                cthis.video.startToStream();
                                //virtualclass.precheck.webcam.createVideo();
                            }
                        }
                    }
                } else {
                    console.log('Media: it seems media is not ready');
                }


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
                if (chatDiv.scrollHeight >= (mh + 1)) {
                    chatDiv.style.overflowY = "scroll";
                }

                chatDiv.style.maxHeight = mh + "px";

                console.log('Chat height ' + chatDiv.offsetHeight);
                console.log('Max height ' + chatDiv.style.maxHeight);

                if (virtualclass.isPlayMode) {
                    chatDiv.style.maxHeight = mh + 64 + "px";
                }


            },
            // Closeing the video
            close: function () {
                if (virtualclass.media.hasOwnProperty('smallVid')) {
                    clearInterval(virtualclass.media.smallVid);
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
                var allVideos = chatContainerEvent.elementFromShadowDom('.userVideos', 'all')
                for (var i = 0; i < allVideos.length; i++) {
                    if (allVideos[i].id === "video" + user.id) {
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

                cthis.audio.notifiyMuteAudio();
                //virtualclass.media.audio.removeAudioFromLocalStorage();
            },

            detectAudioWorklet: () => {
                if (typeof OfflineAudioContext == 'undefined') {
                    return false;
                } else {
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