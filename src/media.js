// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides functionality to capture , transmit and play audio and
 * video for multiple users.
 *
 */
(function (window) {
    repMode = false;
    //var io = window.io;
    /*
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
//        var AudioContext = AudioContext || webkitAudioContext;
    /*
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
            localStream: '',
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
            /*
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
                    var childTag = chatUser.getElementsByTagName('a')[0];
                    var imgTag = childTag.getElementsByTagName('img')[0];
                    childTag.className += ' hasVideo';

                    childTag.replaceChild(vidCont, imgTag);
                }
            },
            /*
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
                resampler: new Resampler(44100, 8000, 1, 4096),
                rec: '',
                otherSound: false,
                audioNodes: [],
                sdElem: 'silenceDetect',
//                  sd : false,
                Html5Audio: {audioContext: new (window.AudioContext || window.webkitAudioContext)()},
                /*
                 *  Enables audio
                 *  calls function to attach functions on audio tools.
                 */
                init: function () {
                    //if (roles.hasAdmin()) {
                    //    virtualclass.gObj.audMouseDown = true;
                    //    //can be critical
                    //    //this.clickOnceSpeaker('speakerPressOnce');
                    //}

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
                        },
                        canvasForVideo: function () {
                            var videoParent = cthis.video.myVideo.parentNode;
                            var graphCanvas = document.createElement("canvas");
                            graphCanvas.width = this.width + 3;
                            graphCanvas.height = this.height;

                            graphCanvas.id = "graphCanvas";
                            videoParent.style.position = "relative";
                            graphCanvas.style.position = "absolute";
                            graphCanvas.style.left = 0;
                            graphCanvas.style.top = -7;
                            videoParent.appendChild(graphCanvas);
                        }
                    };
                    this.attachFunctionsToAudioWidget();// to attach functions to audio widget 
                },
                /*
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
                slienceDetection: function (send, leftSix) {
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
                    if (minthreshold * 50 < maxthreshold) {
                        minthreshold = minthreshold * 5;
                    } // In case minimum sound (silance) is too low compared to speaking sound.
                    if (maxthreshold / 50 > minthreshold) {
                        maxthreshold = vol;
                    } // In case Max volume (speaking sound) is too high compared with silance.
                    var thdiff = maxthreshold / minthreshold;

                    switch (true) {
                        case (thdiff > 8):
                            var th = 2.5;
                            break;
                        case (thdiff > 5):
                            var th = 2.0;
                            break;
                        case (thdiff > 3):
                            var th = 1.2;
                            break;
                        default:
                            th = 1;
                    }
                    // If rate greater then 20, it is likely to be sound
                    // if difference between max and min (thdiff) is less than 2, we are not ready for this algo.
                    // If Volume is greater than min threashold * multiple then it is likely to be sound.

                    audStatus = "sending";
                    if ((thdiff >= 2 && vol >= minthreshold * th)) {
                        if (audioWasSent == 0 && preAudioSamp != 0) { // Send previous sound sample to avoid clicking noise
                            //        console.log('SEND PRE');
                            this.audioSend(preAudioSamp);
                            preAudioSamp = 0;
                        }
                        //     console.log('Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff+' th '+th);
                        this.audioSend(send, audStatus);
                        audioWasSent = 9;

                    } else if (audioWasSent > 0) {

                        //    console.log('SEND NEXT');
                        this.audioSend(send, audStatus);  // Continue sending Audio for next X samples
                        audioWasSent--;
                    } else if (thdiff < 2) { // We are not ready, send all samples
                        //     console.log('Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff);
                        this.audioSend(send, audStatus);
                    } else {
//                            if(virtualclass.gObj.audMouseDown){
                        this.setAudioStatus("notSending");
//                            }
                        // console.log('NOT SENT Vol '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff);
                        if (thdiff > 10) { // If diff is huge, reduce max volume in historical signal
                            maxthreshold = maxthreshold * 0.8;
                        }
                        preAudioSamp = send;
                    }
//                        this.setAudioStatus(audStatus);
                    return send;
                },
                /*
                 *  Setting the attribute data-silence-detect to sending or notSending or stop
                 * @param  audStatus audio status such sending , notsending or stop
                 */
                setAudioStatus: function (audStatus) {
                    if (typeof silenceDetectElem == 'undefined') {
                        var silenceDetectElem = document.getElementById('audioWidget').getElementsByClassName(this.sdElem)[0];

//                            var silenceDetectElem = document.getElementById(this.sdElem);
                    }
                    silenceDetectElem.setAttribute('data-silence-detect', audStatus);
//                          silenceDetectElem.setAttribute('data-silence-detect',  'notSending');

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
                /*
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
                /*
                 * It is invoked on clicking on or off button appeared on audio widget
                 * And it is invoked on clicking test audio
                 */
                audioToolInit: function () {
                    var that = virtualclass.gObj.video.audio;
                    if (this.id == 'speakerPressOnce') {
                        that.clickOnceSpeaker(this.id);
                    } else if (this.id == 'audioTest') {
                        //if (confirm(virtualclass.lang.getString('audioTest'), function (){})) {
                        //    that.testInit(this.id);
                        //}
                        var self = this;
                        virtualclass.popup.confirmInput(virtualclass.lang.getString('audioTest'), function (confirm) {
                            if (confirm) {
                                that.testInit(self.id);
                            }

                        });
                    } else if (this.id == 'silenceDetect') {
                        var a = this.getElementsByTagName('a')[0];
//                            var img = this.getElementsByTagName('img')[0];
                        if (that.sd) {
                            that.sd = false;
                            this.className = this.className + " sdDisable";
//                               img.src = window.whiteboardPath + "images/silencedetectdisable.png";
                        } else {
                            that.sd = true;
                            this.className = this.className + " sdEnable";
//                               var img = this.getElementsByTagName('img')[0];
//                               img.src = window.whiteboardPath + "images/silencedetectenable.png";
                        }
                    }
                },
                /*
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
//                                            pressOnceLabel.setAttribute('data-silence-detect', "false");
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
                /*
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
                /*
                 * If Audio is enabled then clicking on it disbles it 
                 * And if it is disbled then clicking on it enables it
                 * @param  id : Id of the audio tool
                 */
                // TODO this function is being called with only one attribute
                clickOnceSpeaker: function (id, alwaysDisable) {
                    var tag = document.getElementById(id);
                    var alwaysPressElem = document.getElementById('speakerPressing');
                    var anchor = tag.getElementsByClassName('tooltip')[0];


                    if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
                        this.studentSpeak(alwaysPressElem);
//                            this.studentSpeak(alwaysPressElem);
                        tag.setAttribute('data-audio-playing', "true");
                        anchor.setAttribute('data-title', virtualclass.lang.getString('disableSpeaker'));
                        tag.className = "audioTool active";


                    } else {
                        this.studentNotSpeak(alwaysPressElem);
                        tag.setAttribute('data-audio-playing', "false");
                        anchor.setAttribute('data-title', virtualclass.lang.getString('enableSpeaker'));
                        tag.className = "audioTool deactive";
                    }
                },
                /*
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
                        //    button.src  = window.whiteboardPath + "images/speakerpressingactive.png";

//                          alert(elem.id);
//
//                            var silenceDetecElem = document.getElementById('speakerPressOnce').getElementsByClassName('silenceDetect')[0];
//                            
//                            if(silenceDetecElem == null){
//                                var speakerPressonce  = document.getElementById('speakerPressonceLabel')
//                                speakerPressonce.className = speakerPressonce.className + 'silenceDetect';
//                                speakerPressonce.setAttribute('data-silence-detect', 'stop');
//                            }

                        elem.classList.remove('deactive');

                        elem.classList.add('active');
                    }

//                        alert('speak');
//                        debugger;
                    virtualclass.gObj.audMouseDown = true;
                    virtualclass.vutil.beforeSend({'sad': true, 'cf': 'sad'});
                },
                /*
                 * Audio tool deactive
                 * @param elem audio tool element 
                 */
                // varible button is not being used
                studentNotSpeak: function (elem) {
                    if (virtualclass.gObj.hasOwnProperty('audMouseDown') && virtualclass.gObj.audMouseDown) {
                        if (typeof elem != 'undefined') {
//                                var silenceDetecElem = document.getElementById('speakerPressOnce').getElementsByClassName('silenceDetect')[0];

//                                if(silenceDetecElem != null){
//                                    silenceDetecElem.classList.remove('silenceDetect');
//                                    silenceDetecElem.setAttribute('data-silence-detect', '');
//                                }

                            var button = document.getElementById(elem.id + "Button");
                            // button.src  = window.whiteboardPath + "images/speakerpressing.png";
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
                /*
                 * Conversion from array buffer to string
                 * @param buf arrayBuffer
                 * @return string
                 */
                ab2str: function (buf) {
                    return String.fromCharCode.apply(null, new Int8Array(buf));
                },
                /* 
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
                /*
                 * recorderProcess is bind with the audio 
                 * downsamples channel data
                 * encodes the samples
                 * Calls silenceDetection function to detect silence
                 * @param e where e is the event object  
                 */
                recorderProcess: function (e) {
                    var currTime = new Date().getTime();
                    if (!repMode) {
                        var left = e.inputBuffer.getChannelData(0);
//                            alert('hi guys what is up');
//                            debugger;
                        var samples = this.resampler.resampler(left);
//                            alert('sumna');
//                            debugger;

                        if (!this.recordAudio) {
                            this.recordingLength += this.bufferSize;
                        }

//                            console.log('recordingLength ' + this.recordingLength);


                        var leftSix = convertFloat32ToInt16(samples);

                        var send = this.audioInLocalStorage(leftSix);

                        if (this.hasOwnProperty('storeAudio') && this.storeAudio) {
                            this.audioForTesting(leftSix);
                        }

//                            if(this.sd){
                        if (virtualclass.gObj.audMouseDown && (io.sock.readyState == 1)) {
                            this.slienceDetection(send, leftSix);
                        }

//                            }else{
//                                this.audioSend(send);
//                            }
                    }
                },
                /*
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
                /*
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
                /*
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
                /*
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
                        samples = G711.decode(clip, {
                            alaw: this.encMode == "alaw" ? true : false,
                            floating_point: true,
                            Eight: true
                        });
                        this.myaudioNodes.push(new Float32Array(samples));
                        recordingLength += samples.length;
                    }
                    samples = this.mergeBuffers(this.myaudioNodes, recordingLength);
                    (typeof testAudio != 'undefined') ? virtualclass.gObj.video.audio.play(samples, uid, testAudio) : virtualclass.gObj.video.audio.play(samples, uid);
                },
                /*
                 * To connect the context nodes from source to destination
                 * And to play the audio
                 * @param  receivedAudio A float32Array of merged recordings
                 * @param  uid User id
                 * @param  testAudio A boolean value , is true if there is a test audio to be played
                 * otherwise set to false
                 */

                play: function (receivedAudio, uid, testAudio) {
                    var userObj = JSON.parse(localStorage.getItem('virtualclass' + uid));
                    if (typeof receivedResampler == 'undefined') {
                        receivedResampler = new Resampler(8000, 44100, 1, 16384000); // this value increased for large audio chunks
                    }

                    //alert('sss');
                    //debugger;
                    // receivedResampler = new Resampler(8000, 44100, 1, 16384000);

                    var samples = receivedResampler.resampler(receivedAudio);
                    // samples = receivedAudio;


                    //console.log('receivedAudio ' + receivedAudio.length +' samples ' + samples.length);
                    var newBuffer = this.Html5Audio.audioContext.createBuffer(1, samples.length, 44100); //8100 when sound is being delay
                    newBuffer.getChannelData(0).set(samples);
                    var newSource = this.Html5Audio.audioContext.createBufferSource();
                    newSource.buffer = newBuffer;
                    var gainNode = this.Html5Audio.audioContext.createGain();
                    gainNode.gain.value = 0.9;
                    newSource.connect(gainNode);
                    gainNode.connect(this.Html5Audio.audioContext.destination);

                    if (userObj != null && userObj.ad && userObj.aud) {
                        virtualclass.user.control.iconAttrManupulate(uid, "icon-audioEnaGreen");
                        var anchorTag = document.getElementById(userObj.id + 'contrAudAnch');
                        if (anchorTag != null) {
                            anchorTag.setAttribute('data-title', virtualclass.lang.getString('audioOn'));
                        }
                    }
                    // To excute when an audio has ended
                    newSource.onended = function () {
                        userObj = JSON.parse(localStorage.getItem('virtualclass' + uid));
                        // console.log("UID " + uid+  " video ended  Duration :"+newSource.buffer.duration);
                        if (typeof testAudio == 'undefined') {
//                                console.log("Stack length " +  virtualclass.gObj.video.audio.audioToBePlay[uid].length + "; UID " + uid + " video Start  Duration :"+newSource.buffer.duration);
                            clearTimeout(virtualclass.gObj[uid].out);
                            virtualclass.gObj[uid].isplaying = false;
                            if (virtualclass.gObj.video.audio.audioToBePlay[uid].length > 0) {
                                virtualclass.gObj.video.audio.getChunks(uid);
                            } else {
                                if (userObj  != null && userObj.ad && userObj.aud) {
                                    virtualclass.user.control.iconAttrManupulate(uid, "icon-audioEnaOrange");
                                }
                            }
                        }
                    };
                    /*
                     * Starts the audio buffer playing from the beginning
                     */
                    newSource.start(1);
//                        console.log("stack length " +  this.audioToBePlay[uid].length + " UID " + uid + " video Start  Duration :"+newSource.buffer.duration);
                    virtualclass.gObj[uid].isplaying = true;
                    //   console.log("Current time : "+ this.Html5Audio.audioContext.currentTime +" Duration :"+newSource.buffer.duration);
                    if (typeof testAudio == 'undefined') {
                        virtualclass.gObj[uid].out = setTimeout(
                            function () {
//                                    console.log("Stack length " +  virtualclass.gObj.video.audio.audioToBePlay[uid].length + "; UID " + uid + " video ended OUT :"+newSource.buffer.duration);
                                //                                console.log("UID " + uid+ " video ended  Duration OUT :"+newSource.buffer.duration);

                                virtualclass.gObj[uid].isplaying = false;
                                if (virtualclass.gObj.video.audio.audioToBePlay[uid].length > 0) {
                                    virtualclass.gObj.video.audio.getChunks(uid);
                                }
                            },
                            (newSource.buffer.duration * 1000) + 10
                        );
                    }

//                        }
                },
                // TODO this is not being invoked
                calcAverage: function () {
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var values = 0;
                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        values += array[i];
                    }
                    this.graph.average = values / length;
                },
                //this is not using right now
                audioInGraph: function () {
                    var cvideo = cthis.video;
                    if (roles.hasControls()) {
                        var avg = this.graph.height - (this.graph.height * this.graph.average) / 100;
                        cvideo.tempVidCont.beginPath();
                        cvideo.tempVidCont.moveTo(cvideo.tempVid.width - this.graph.width, this.graph.height);
                        cvideo.tempVidCont.lineTo(cvideo.tempVid.width - this.graph.width, avg);
                        cvideo.tempVidCont.lineWidth = this.graph.width;
                        cvideo.tempVidCont.strokeStyle = "rgba(247, 25, 77, 1)";
                        cvideo.tempVidCont.closePath();
                        cvideo.tempVidCont.stroke();
                    }
                },
                //this has been removed as of now it has another play
//                    play : function (receivedAudio, inHowLong, offset){/*..*/},
                queue: function (packets, uid) {
                    if (!this.hasOwnProperty('audioToBePlay')) {
                        this.audioToBePlay = {};
                    }
                    if (!this.audioToBePlay.hasOwnProperty(uid)) {
                        this.audioToBePlay[uid] = [];
                    }
                    this.audioToBePlay[uid].push(packets);
                },
                /*
                 * Audio associated with the user id is played
                 * if length of audio is between 1 and 7
                 * the the audio is played
                 * @param  uid user id
                 * @param label

                 */
                // TODO this(getChunks) should be rename into getAudioChunks()
                getChunks: function (uid, label) {
//                        alert('suman bogati');
//                        debugger;
////                        console.log(label + ' Audio Stack Length  '+this.audioToBePlay[uid].length + ' UID : '+ uid)
                    if (this.audioToBePlay[uid].length > 8) {
                        this.audioToBePlay[uid].length = 0;
                        virtualclass.gObj[uid].isplaying = false;
                    } else if (this.audioToBePlay[uid].length > 0) {
//                            console.log("play twice time");
//                            virtualclass.gObj[uid].isplaying = true;
                        this.playRecordedAudio(this.audioToBePlay[uid], uid);
                        this.audioToBePlay[uid].length = 0;
                    } else {
                        virtualclass.gObj[uid].isplaying = false;
                    }

                },
                //TODO  this function is not being invoked
//                replayInit: function () {
//                    virtualclass.storage.getAllObjs(["audioData"], repCallback);
//                    function repCallback() {
//                        virtualclass.gObj.video.audio.replay(0, 0)
//                    }
//                },
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
                /*
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
//                          console.log("bf Length " + buffer.length);
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
                /*
                 * It creates a mediaStreamSourceNode object
                 * It creates the buffer to process the audio 
                 * and connects mediaStreamSourceNode to buffer
                 * which is connected to gain node that controles the volume
                 * it eventually plays audio
                 */
                manuPulateStream: function () {
                    var stream = cthis.stream;
                   /* if (!virtualclass.vutil.chkValueInLocalStorage('recordStart')) {
                        virtualclass.wb.recordStarted = new Date().getTime();
                        localStorage.setItem('recordStart', virtualclass.wb.recordStarted);
                    } else {
                        virtualclass.wb.recordStarted = localStorage.getItem('recordStart');
                    } */
                    var audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);
                    cthis.audio.bufferSize = 16384;
                    //grec is being made global because recorderProcess with onaudioprocess is not triggered due to Garbage Collector
                    //https://code.google.com/p/chromium/issues/detail?id=360378
//                        cthis.audio.rec = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
                    grec = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
                    grec.onaudioprocess = cthis.audio.recorderProcess.bind(cthis.audio);
                    var gainNode = cthis.audio.Html5Audio.audioContext.createGain();
                    gainNode.gain.value = 0.9;
                    audioInput.connect(gainNode);
                    gainNode.connect(grec);
                    grec.connect(cthis.audio.Html5Audio.audioContext.destination);
                },
                /*
                 *  Setting the record start time to the current time 
                 *  and setting the replay mode to false
                 *
                 */
                updateInfo: function () {
                    this.audioStreamArr = [];
                    //  virtualclass.wb.pageEnteredTime = virtualclass.wb.recordStarted = new Date().getTime();
                    this.recordAudio = false;
                    repMode = false;
                },
                /*
                 * Recives the audio message from the sender
                 * And  Plays the received audio
                 * @param  msg Audio message received from the sender
                 *
                 */
                receivedAudioProcess: function (msg) {
                    if (virtualclass.gObj.hasOwnProperty('iosTabAudTrue') && virtualclass.gObj.iosTabAudTrue == false) {
                        return;
                    }

                    var dataArr = this.extractData(msg);// extract data and user id from the message received 

//                        io.dataBinaryStore(dataArr); //for store received audio

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
                    virtualclass.gObj.video.audio.queue(dataArr[1], uid); //dataArr[1] is audio
                    if (!virtualclass.gObj.hasOwnProperty(uid) || !virtualclass.gObj[uid].hasOwnProperty('isplaying')) {
                        virtualclass.gObj[uid] = {};
                        virtualclass.gObj[uid].isplaying = true;
                        virtualclass.gObj.video.audio.getChunks(uid);

                    } else if (virtualclass.gObj[uid].isplaying == false) {
                        virtualclass.gObj.video.audio.getChunks(uid);
                    }
                },
                /*
                 * To extract user id of sender and data from the receied message 
                 * @param  msg recevied message from online users
                 * @returns {Array} userid received with the  message plus rest of the msz data
                 */
                extractData: function (msg) {
                    // the audio sent in Int8Array
//                      var data_pack = new Uint8ClampedArray(msg);
                    var data_pack = new Int8Array(msg);

                    var uid = virtualclass.vutil.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
                    return [uid, data_pack.subarray(5, data_pack.length)];
                }

            },
            /*
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
                /*
                 *  remove user and corresponding video element
                 * @param id userid of the user to be removed
                 */
                removeUser: function (id) {
                    var element = document.getElementById('user' + id);
                    if (element != null) {
                        element.parentNode.removeChild(element);
                    }
                },
                /*
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
                /*Send the small video and render it at the receiver's side
                 * And breaks user id into bytes
                 * Sets the interval for  send small video
                 * interval depends on the number of users
                 */
                //TODO function defined in function they can be separately defined
                send: function () {
                    // debugger;
                    if (virtualclass.gObj.video.hasOwnProperty('smallVid')) {
                        clearInterval(virtualclass.gObj.video.smallVid);
                    }
                    var cvideo = this;
                    var frame;
                    randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                    var totalMembers = -1;

                    function sendSmallVideo() {
                        if (roles.hasControls()) {

                            // this block of code is not producing any output
                            if (typeof graphCanvas == "undefined") {

                                var graphCanvas = document.getElementById("graphCanvas");
                                if (graphCanvas != null) {
                                    cthis.audio.graph.cvCont = graphCanvas.getContext('2d');
                                }
                            }
                            if (graphCanvas != null) {

                                cthis.audio.graph.cvCont.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
                            }
                        }
                        cvideo.tempVidCont.clearRect(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
                        if (window.navigator.userAgent.match('Firefox')) {
                            drawVideoForFireFox();
                        } else {
                            cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);
                        }
                        //Firefox issue, the video is not available for image at early stage
                        function drawVideoForFireFox() {
                            try {
                                cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);
                            } catch (e) {
                                if (e.name == "NS_ERROR_NOT_AVAILABLE") {
                                    // Wait a bit before trying again; you may wish to change the
                                    // length of this delay.
                                    setTimeout(drawVideoForFireFox, 100);
                                } else {
                                    throw e;
                                }
                            }
                        }

                        if (roles.hasControls()) {
                            cthis.audio.graph.display();
                        }
                        //frame = cvideo.tempVid.toDataURL("image/jpg", 0.2);
                        var user = {
                            name: virtualclass.gObj.uName,
                            id: virtualclass.gObj.uid
                        };
                        if (roles.hasControls()) {
                            user.role = virtualclass.gObj.uRole;
                        }

                        //TODO Find out why the would send each time rather than one

                        virtualclass.vutil.beforeSend({videoByImage: user, 'cf': 'videoByImage'}, null, true);

                        var frame = cvideo.tempVidCont.getImageData(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
                        var encodedframe = virtualclass.dirtyCorner.encodeRGB(frame.data);
                        var uid = breakintobytes(virtualclass.gObj.uid, 8);
                        var scode = new Uint8ClampedArray([11, uid[0], uid[1], uid[2], uid[3]]);// First parameter represents  the protocol rest for user id
                        var sendmsg = new Uint8ClampedArray(encodedframe.length + scode.length);
                        sendmsg.set(scode);
                        sendmsg.set(encodedframe, scode.length);
                        ioAdapter.sendBinary(sendmsg);
                        clearInterval(virtualclass.gObj.video.smallVid);
                        var d = 2000 + (virtualclass.gObj.totalUser.length * 2500);
                        if (totalMembers != virtualclass.gObj.totalUser) { // BUG : totalUser  is not a number it is an array
                            totalMembers = virtualclass.gObj.totalUser.length;
                            var p = virtualclass.gObj.totalUser.indexOf(virtualclass.gObj.uId);
                            var td = d / totalMembers;
                            var md = p * td;
                            virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, (d + md));
                            //console.log("send time " + (d + md) + new Date().getSeconds());
                        } else {
                            virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, d);
                            //console.log("send time " + d + new Date().getSeconds());
                        }
                    }

                    virtualclass.gObj.video.smallVid = setInterval(sendSmallVideo, 300);
                    // Breaking user id into bytes
                    function breakintobytes(val, l) {
                        var numstring = val.toString();
                        for (var i = numstring.length; i < l; i++) {
                            numstring = '0' + numstring;
                        }
                        var parts = numstring.match(/[\S]{1,2}/g) || [];
                        return parts;
                    }
                },
                /*
                 * Calulate dimensions of the  video 
                 * and sends the video
                 */
                startToStream: function () {
                    cthis.video.calcDimension();
                    cthis.video.send();
                },
                /*
                 * Play the received video with out slicing it
                 * @param  uid
                 * @param  msg video message received

                 */
                playWithoutSlice: function (uid, msg) {
                    //  console.log('uid ' + uid);
                    this.remoteVid = document.getElementById("video" + uid);
                    //TODO remove validation
                    if (this.remoteVid != null) {
                        this.remoteVidCont = this.remoteVid.getContext('2d');
                        var imgData = virtualclass.dirtyCorner.decodeRGB(msg, this.remoteVidCont, this.remoteVid);
                        this.remoteVidCont.putImageData(imgData, 0, 0);
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
                                videoSubWrapper.setAttribute("data-uname", "suman" + num);
                                videoWrapper.appendChild(videoSubWrapper);
                                var prvContHeight = videoCont.offsetHeight;
                                var video = document.createElement('video');
                                video.className = "userVideo";
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
                /*
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
//                    imageReplaceWithVideo : function (id, vidCont){
//                        var chatUser = document.getElementById("ml" + id);
//                        var childTag = chatUser.getElementsByTagName('a')[0];
//                        var imgTag = childTag.getElementsByTagName('img')[0];
//                        childTag.replaceChild(vidCont, imgTag);
//                    },
                /*
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
                /*
                 * Extracting the user id of sender from the sent  message
                 * separating it from the audio
                 * And playing the video by calling playWithoutSlice
                 * @param  msg : Received message 

                 */
                process: function (msg) {
                    var data_pack = new Uint8ClampedArray(msg);
//                        io.dataBinaryStore(data_pack); // storing received video
                    var uid = virtualclass.vutil.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
                    var recmsg = data_pack.subarray(5, data_pack.length);
                    virtualclass.gObj.video.video.playWithoutSlice(uid, recmsg);
                }
            },

            /*
             * It creates a mediator for getUSerMedia
             * and it prompts the user for permission to use video or audio device 
             * it  inalizes the video 
             */
            /* TODO @param vbool :no use of parameter vbool */

            init: function (vbool) {
                //    alert("hello borther");
                cthis = this; //TODO there should be done work for cthis
                vcan.oneExecuted = true;
                var audio = true;
                var session = {
                    audio: audio,
                    video: true
                };

                cthis.video.init();
                if (!virtualclass.vutil.isPlayMode()) {
                    virtualclass.adpt = new virtualclass.adapter();
                    var cNavigator = virtualclass.adpt.init(navigator);
                    cNavigator.getUserMedia(session, this.handleUserMedia, this.handleUserMediaError);
                }

                if (virtualclass.system.wbRtc.peerCon) { //TODO this should be deleted
                    if (typeof localStorage.wbrtcMsg == 'undefined') {
                        virtualclass.view.multiMediaMsg('WebRtc');
                        localStorage.wbrtcMsg = true;
                    }
                }
            },

            /*
             * This function  is invoked with the resulting media stream object if the call to getUserMedia succeeds.
             * And invoke handleUSerMediaError in case of getusermedia error.
             * handleUSerMedia  initializes audio.
             * @param stream object
             */


            handleUserMedia: function (stream) {
                localStorage.removeItem('dvid');
                var audioWiget = document.getElementById('audioWidget');
                var audio = localStorage.getItem('audEnable');

                if(audio != null){
                    audio = JSON.parse(audio);
                    if(audio.ac == 'false'){
                        // if reason is video disabled from browser.
                        if(audio.r == 'vd'){
                            virtualclass.user.control.audioWidgetEnable();
                        } else {
                            virtualclass.user.control.audioWidgetDisable();
                        }

                    }else {
                        virtualclass.user.control.audioWidgetEnable();
                    }
                } else if(virtualclass.vutil.elemHasAnyClass('audioWidget') && audioWiget.classList.contains('deactive')){
                    virtualclass.user.control.audioWidgetEnable();
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
            },
            /*
             * Adding the class student or teacher to the each user's div
             * @param  id User id
             * @param  role user role
             */
            addUserRole: function (id, role) {
                var userDiv = document.getElementById("ml" + id);
                userDiv.setAttribute("data-role", role);
                var userType = (role == 's') ? 'student' : 'teacher';
                userDiv.classList.add(userType);
            },
            /*
             * Creates a video element
             * and  replaces the image with video
             * manipulates the audio
             * and sends the video
             * @param string userid
             */
            _handleUserMedia: function (userid) {
                var userMainDiv = document.getElementById(userid);
                var stream = cthis.video.tempStream;
//                    var userDiv = document.getElementById("ml" + virtualclass.gObj.uid);
//                    if(userDiv != null){
//                       userDiv.classList.add("mySelf");
//                    }
                if (typeof stream != 'undefined') {
                    var vidContainer = cthis.video.createVideoElement();
                    virtualclass.gObj.video.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);
//                        cthis.video.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

                    cthis.video.insertTempVideo(vidContainer);
                    cthis.video.tempVideoInit();
                    cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
                    virtualclass.adpt.attachMediaStream(cthis.video.myVideo, stream);
                    cthis.video.myVideo.muted = true;
                    //todo this should be removed
                    stream.ontimeupdate = function () {
                        console.log("raja" + stream.currentTime);
                    };
                    if (virtualclass.jId == virtualclass.gObj.uid) {
                        cthis.stream = cthis.video.tempStream;
                        cthis.audio.manuPulateStream();
                        cthis.audio.graph.canvasForVideo();
                    }
                    cthis.video.myVideo.onloadedmetadata = function () {
                        cthis.video.startToStream();
                    }
                }
                userMedia = true;
            },
            /*
             * Increasing chat container's height as number of users is increased
             */
            updateVidContHeight: function () {
                var elem = document.getElementById("virtualclassCont");
                var offset = vcan.utility.getElementOffset(elem);
                var mh = window.innerHeight - (offset.y + 75);
                document.getElementById("chat_div").style.maxHeight = mh + "px";
            },
            // Closeing the video
            close: function () {
                if (virtualclass.gObj.video.hasOwnProperty('smallVid')) {
                    clearInterval(virtualclass.gObj.video.smallVid);
                }
            },
            /*
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
//                sendMessage: function(message) {
//                    if (arguments.length > 1) {
//                      virtualclass.vutil.beforeSend({'video': message}, arguments[1]);
//                    } else {
//                      virtualclass.vutil.beforeSend({'video': message});
//                    }
//                },
            /*
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
            /*
             * The function to invoke with the resulting MediaStreamError if the call to getUSerMedia fails.
             * disableing audioWiget
             * Disappearing all containers
             * @param error error object
             */
            handleUserMediaError: function (error) {
                var error = (typeof error == 'object') ? virtualclass.lang.getString(error.name) : virtualclass.lang.getString(error);
                virtualclass.view.createErrorMsg(error, 'errorContainer', 'chatWidget');
                virtualclass.user.control.audioWidgetDisable('vd');
                virtualclass.view.disappearBox('WebRtc');
                localStorage.setItem('dvid', true);
                console.log('navigator.getUserMedia error: ', error);
            }
        }
    };
    window.media = media;
})(window);
