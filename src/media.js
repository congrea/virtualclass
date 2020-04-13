// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides functionality to capture , transmit and play audio and
 * video for multiple users.
 *
 */

(function (window) {
  let repMode; let buf; let vidId; let randomTime; let
    cthis;

  const audioToBePlay = {};
  const aChunksPlay = {};
  const allAudioArr = {};
  let luid;
  let allAudioSend = [];
  let audioLen = 0;
  let workletAudioSend;
  let workletAudioRec;
  let initchannel;

  function breakintobytes(val, l) {
    let numstring = val.toString();
    for (let i = numstring.length; i < l; i++) {
      numstring = `0${numstring}`;
    }
    const parts = numstring.match(/[\S]{1,2}/g) || [];
    return parts;
  }

  repMode = false;
  // var io = window.io;
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

  const responseErorr = function () {
    // console.log('this error is come when the create and answer is occurring');
  };

  const ar = 0;
  const audioWasSent = 0;
  const preAudioSamp = 0;
  const preAvg = 0;
  const curAvg = 0;
  const audiotime = 0;
  const workerAudioSendOnmessage = false;
  let workerAudioRecOnmessage = false;

  // var allAudioArr = {};

  const userSource = {}; // for contain the user specific audio source
  const sNode = {};

  const ac = {};
  const sNodePak = {};
  let snNodePak;

  /**
   * this returns an object that contains various Properties
   * to facilitate the capturing , saving, transmitting and
   *  rendering audio or video.
   *
   */
  const media = function () {
    return {
      isChannelReady: '', // not being used
      isStarted: '',
      pc: [],
      cn: 0,
      ba: false,
      bb: false,
      bc: false,
      bNotRender: false,
      remoteStream: '',
      turnReady: '',
      videoControlId: 'videoContainer',
      videoContainerId: 'videos',
      CONFIG: {
        width: { max: 268 },
        height: { max: 142 },
        frameRate: { max: 6 },
      },

      audioPlayerNode: null,
      audioCreatorNode: null,


      /**
       * Replaces image with  video
       * @param id Id of the user
       * @param vidCont Video wrapper to replace the image
       */
      util: {
        imageReplaceWithVideo(id, vidCont) {
          const chatUser = chatContainerEvent.elementFromShadowDom(`#ml${id}`);
          if (chatContainerEvent.elementFromShadowDom(`#ml${id}`)) {
            chatUser.classList.remove('userImg');
          }

          if (chatUser != null) {
            const childTag = chatUser.getElementsByTagName('a')[0];
            const imgTag = childTag.getElementsByTagName('span')[0] || childTag.getElementsByTagName('img')[0];
            if (!childTag.classList.contains('hasVideo')) {
              childTag.className += ' hasVideo';
            }
            const videoWrapper = childTag.querySelector('.videoWrapper');
            if (imgTag == null && imgTag == null && videoWrapper != null) {
              childTag.removeChild(videoWrapper);
              childTag.appendChild(vidCont);
            } else {
              childTag.replaceChild(vidCont, imgTag);
            }
          } else {
            // console.log('chatUser is Null');
          }
        },
      },

      audioVisual: {
        init() {
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

        readyForVisual(stream) {
          this.source = this.audioCtx.createMediaStreamSource(stream);
          this.source.connect(this.analyser);
          this.analyser.connect(this.distortion);
          this.distortion.connect(this.biquadFilter);
          this.biquadFilter.connect(this.convolver);
          this.convolver.connect(this.gainNode);
          this.gainNode.connect(this.audioCtx.destination);
        },
      },

      workerAudioSendOnmessage() {
        workerAudioSend.onmessage = function (e) {
          if (Object.prototype.hasOwnProperty.call(e.data, 'cmd')) {
            if (e.data.cmd === 'muteAudio') {
              cthis.audio.notifiyMuteAudio();
            } else if (e.data.cmd === 'unMuteAudio') {
              cthis.audio.notifiyUnmuteAudio();
            }
          }
        };
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
        encMode: 'alaw',
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
        init() {
          const isEnableAudio = document.getElementById('speakerPressOnce').dataset.audioPlaying;
          virtualclass.gObj.audMouseDown = (isEnableAudio === 'true');


          // This part in not being used
          this.graph = {
            height: 56,
            width: 4,
            average: 0,

            display() {
              const cvideo = cthis.video;
              if (roles.hasControls()) {
                const avg = this.height - (this.height * this.average) / 100;
                this.initDisplay(cvideo.tempVidCont, avg);
              }
            },

            initDisplay(context, avg) {
              context.beginPath();
              context.moveTo(this.width, this.height);
              context.lineTo(this.width, avg);
              context.lineWidth = this.width;
              context.strokeStyle = 'rgba(32, 37, 247, 0.8)';
              context.closePath();
              context.stroke();
            },
          };
          this.attachFunctionsToAudioWidget(); // to attach functions to audio widget
        },

        initAudiocontext() {
          if (!Object.prototype.hasOwnProperty.call(this, 'Html5Audio') && !virtualclass.gObj.meetingMode) {
            this.Html5Audio = { audioContext: new (window.AudioContext || window.webkitAudioContext)() };
            if (virtualclass.media.audio.Html5Audio.audioContext == null) {
              alert('audio context is null');
            }
            this.resampler = new Resampler(virtualclass.media.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
            virtualclass.gObj.isAudioContextReady = true;
            this.audioContextReady = true;
            if (virtualclass.system.mediaDevices.hasMicrophone && !virtualclass.isPlayMode
              && cthis.video.tempStream != null) {
              virtualclass.media.stream = cthis.video.tempStream;
              virtualclass.media.audio.actualManiPulateStream();
            }
          }
        },

        /** Iniates the script processor node to play the audio * */
        initScriptNode() {
          for (let i = 0; i < this.snode.length; i++) {
            this.innerPlayWithFallback(this.snode[i]);
          }
          this.snode = [];
        },

        attachAudioStopHandler(stream) {
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack != null) {
            audioTrack.onended = this.notifiyMuteAudio; // TODO, re initate media stream
            audioTrack.onmute = this.notifiyMuteAudio;
            audioTrack.onunmute = this.notifiyUnmuteAudio;
          }
        },

        notifiyMuteAudio() {
          this.notifyAudioMute = true;
          if (virtualclass.gObj.audMouseDown) {
            if (virtualclass.gObj.mutedomop) {
              if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'mutedomopto')
                || virtualclass.gObj.mutedomopto === null) {
                virtualclass.gObj.mutedomopto = setTimeout(() => {
                  cthis.audio.notifiyMuteAudioDom();
                }, 2000);
              }
            } else {
              cthis.audio.notifiyMuteAudioDom();
            }
          }
        },

        notifiyUnmuteAudio() {
          this.notifyAudioMute = false;
          virtualclass.gObj.mutedomop = true;
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'mutedomopto')) {
            clearTimeout(virtualclass.gObj.mutedomopto);
            virtualclass.gObj.mutedomopto = null;
          }
          cthis.audio.notifiyUnmuteAudioDom();
        },

        notifiyUnmuteAudioDom() {
          // console.log('==== notify unmute audio');
          if (Object.prototype.hasOwnProperty.call(this, 'speakerPressOnce') && this.speakerPressOnce != null
            && this.speakerPressOnce.classList.contains('audioMute')) {
            this.speakerPressOnce.classList.remove('audioMute');
          }
        },

        notifiyMuteAudioDom() {
          if (!Object.prototype.hasOwnProperty.call(this, 'speakerPressOnce')) {
            this.speakerPressOnce = document.querySelector('#speakerPressOnce');
          }

          if (this.speakerPressOnce != null && !this.speakerPressOnce.classList.contains('audioMute')) {
            this.speakerPressOnce.classList.add('audioMute');
          }
        },


        muteButtonToogle() {
          const speakerPressOnce = document.querySelector('#speakerPressOnce');
          if (speakerPressOnce != null && (speakerPressOnce.dataset.audioPlaying
            && speakerPressOnce.dataset.audioPlaying === 'true')) {
            speakerPressOnce.click();
          }
        },

        /**
         * To send message and
         * To set audio status of the audio
         * @param  msg Audio message
         * @param adStatus status of the audio i.e. being sent aur not

         */
        audioSend(msg, adStatus) {
          if (virtualclass.gObj.audMouseDown && io.webSocketConnected()) {
            const uid = virtualclass.vutil.breakintobytes(virtualclass.gObj.uid, 8);
            const scode = new Int8Array([101, uid[0], uid[1], uid[2], uid[3]]); // Status Code Audio
            const sendmsg = new Int8Array(msg.length + scode.length);
            sendmsg.set(scode);
            sendmsg.set(msg, scode.length); // First element is status code (101)
            ioAdapter.sendBinary(sendmsg);

            virtualclass.media.audio.setAudioStatus(adStatus);
          } else {
            virtualclass.media.audio.setAudioStatus('stop');
          }
        },

        /**
         *  Setting the attribute data-silence-detect to sending or notSending or stop
         * @param  audStatus audio status such sending , notsending or stop
         */
        setAudioStatus(audStatus) {
          let silenceDetectElem;
          if (typeof silenceDetectElem === 'undefined') {
            silenceDetectElem = document.getElementById('audioWidget').getElementsByClassName(this.sdElem)[0];
          }
          silenceDetectElem.setAttribute('data-silence-detect', audStatus);
        },
        // TODO not being invoked
        makeIconNotDraggable(id, imgName) {
          const canvas = document.getElementById(id, imgName);
          const context = canvas.getContext('2d');
          const imageObj = new Image();

          imageObj.onload = function () {
            context.drawImage(imageObj, 0, 0);
          };
          imageObj.src = `${window.whiteboardPath}images/${imgName}`;
        },

        /**
         * Attaching functions to audioWidget
         * Adding event listner on clicking audio tools
         */
        attachFunctionsToAudioWidget() {
          const audioWiget = document.getElementById('audioWidget');
          const allAudTools = audioWiget.getElementsByClassName('audioTool');
          const that = this; // TODO Remove that
          for (let i = 0; i < allAudTools.length; i++) {
            // allAudTools[i].addEventListener('click', function (){ that.audioToolInit.call(that,  allAudTools[i])});
            if (allAudTools[i].id === 'speakerPressOnce') {
              // allAudTools[i].setAttribute('data-audio-playing', "false");
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
        audioToolInit() {
          if (virtualclass.gObj.meetingMode) {
            const tag = document.getElementById(this.id);
            // var anchor = tag.getElementsByClassName('tooltip')[0];
            // if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
            let action;
            if (tag.getAttribute('data-audio-playing') === 'false' && typeof alwaysDisable === 'undefined') {
              virtualclass.vutil.audioStatus(tag, 'true');
              action = true;
            } else {
              virtualclass.vutil.audioStatus(tag, 'false');
              action = false;
            }
            virtualclass.multiVideo.setAudioStatus(action);
          } else {
            const that = virtualclass.media.audio;
            if (this.id === 'speakerPressOnce') {
              that.clickOnceSpeaker(this.id);
            } else if (this.id === 'silenceDetect') {
              const a = this.getElementsByTagName('a')[0];
              if (that.sd) {
                that.sd = false;
                this.className = `${this.className} sdDisable`;
              } else {
                that.sd = true;
                this.className = `${this.className} sdEnable`;
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
        attachSpeakToStudent(id) {
          const that = this;
          const alwaysPress = document.getElementById(id);
          let beingPress = false;
          alwaysPress.addEventListener('mousedown', () => {
            if (!virtualclass.gObj.audMouseDown) {
              that.studentSpeak(alwaysPress);
              beingPress = true;
              const pressOnceLabel = document.getElementById('speakerPressonceLabel');
              if (pressOnceLabel != null) {
                if (virtualclass.vutil.elemHasAnyClass('speakerPressonceLabel')) {
                  if (pressOnceLabel.classList.contains('silenceDetect')) {
                    pressOnceLabel.removeAttribute('data-silence-detect');
                    pressOnceLabel.classList.remove('silenceDetect');
                    if (pressOnceLabel.classList.length <= 0) {
                      pressOnceLabel.removeAttribute('class');
                    }

                    const controller = pressOnceLabel.getElementsByTagName('i')[0];
                    if (controller != null) {
                      controller.setAttribute('data-silence-detect', 'stop');
                      controller.className += ' silenceDetect';
                    }
                  }
                }
              }
            }
          });

          alwaysPress.addEventListener('mouseup',
            () => {
              if (beingPress) {
                that.studentNotSpeak(alwaysPress);
                beingPress = false;
                const pressOnceLabel = document.getElementById('speakerPressonceLabel');
                const controller = pressOnceLabel.getElementsByTagName('i')[0];
                if (typeof controller.classList !== 'undefined' && controller.classList.contains('silenceDetect')) {
                  controller.classList.remove('silenceDetect');
                  if (controller.classList.length <= 0) {
                    controller.removeAttribute('class');
                  }
                  pressOnceLabel.removeAttribute('data-silence-detect');
                  //                                        pressOnceLabel.setAttribute('data-silence-detect', "false");
                }

                if (pressOnceLabel !== null) {
                  pressOnceLabel.setAttribute('data-silence-detect', 'stop');
                  pressOnceLabel.className = `${controller.className} silenceDetect`;
                }
              }
            });
        },

        /**
         * Attching function to audio press once tool in the audio widget
         *
         */
        attachAudioPressOnce() {
          const speakerPressOnce = document.getElementById('speakerPressOnce');
          speakerPressOnce.setAttribute('data-audio-playing', 'false');
          const that = this;
          speakerPressOnce.addEventListener('click', () => {
            that.clickOnceSpeaker.call(that, speakerPressOnce.id);
          });
        },

        /**
         * If Audio is enabled then clicking on it disbles it
         * And if it is disbled then clicking on it enables it
         * @param  id : Id of the audio tool
         */
        // TODO this function is being called with only one attribute
        clickOnceSpeaker(id, alwaysDisable) {
          const tag = document.getElementById(id);
          const alwaysPressElem = document.getElementById('speakerPressing');
          const anchor = tag.getElementsByClassName('congtooltip')[0];
          // var anchor = tag.getElementsByClassName('tooltip')[0];
          // if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
          if (tag.getAttribute('data-audio-playing') === 'false' && typeof alwaysDisable === 'undefined') {
            // this.studentSpeak(alwaysPressElem);
            this.studentSpeak();

            tag.setAttribute('data-audio-playing', 'true');
            anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
            tag.className = 'audioTool active';
          } else {
            this.studentNotSpeak();
            tag.setAttribute('data-audio-playing', 'false');
            if (anchor) {
              anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
            }
            tag.className = 'audioTool deactive';
          }
        },

        initProcessorEvent() {
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'initProcessorTime')) {
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
        studentSpeak(elem) {
          this.notifyAudioMute = true;
          this.initProcessorEvent();
          if (typeof elem !== 'undefined') {
            const button = document.getElementById(`${elem.id}Button`);
            elem.classList.remove('deactive');
            elem.classList.add('active');
          }
          virtualclass.gObj.audMouseDown = true;
          workerAudioSend.postMessage({
            cmd: 'audioMouseDown',
            msg: { adMouseDown: virtualclass.gObj.audMouseDown },
          });
          virtualclass.vutil.beforeSend({ sad: true, cf: 'sad' });
        },
        /**
         * Audio tool deactive
         * @param elem audio tool element
         */
        // varible button is not being used
        studentNotSpeak(elem) {
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audMouseDown')
            && virtualclass.gObj.audMouseDown) {
            if (typeof elem !== 'undefined') {
              const button = document.getElementById(`${elem.id}Button`);
              elem.classList.remove('active');
              elem.classList.add('deactive');
            }
            const tag = document.getElementById('speakerPressOnce');
            tag.setAttribute('data-audio-playing', 'false');
            tag.className = 'audioTool deactive';
            virtualclass.gObj.audMouseDown = false;
            workerAudioSend.postMessage({
              cmd: 'audioMouseDown',
              msg: { audMouseDown: virtualclass.gObj.audMouseDown },
            });
            virtualclass.media.audio.setAudioStatus('stop');
            virtualclass.vutil.beforeSend({ sad: false, cf: 'sad' }, null, true);
          }
        },
        /**
         * Conversion from array buffer to string
         * @param buf arrayBuffer
         * @return string
         */
        ab2str(buf) {
          return String.fromCharCode.apply(null, new Int8Array(buf));
        },
        /**
         * Conversion from string to array buffer
         * @param str string
         * @return bufView Array Buffer
         */
        str2ab(str) {
          const buf = new ArrayBuffer(str.length); // 2 bytes for each char
          const bufView = new Int8Array(buf);
          for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
          }
          return bufView;
        },


        /**
         * Resamples the audio and silence detection, and broadcast audio
         */
        recorderProcess(left) {
          const currTime = new Date().getTime();
          if (!repMode) {
            if (!this.recordAudio) {
              this.recordingLength += this.bufferSize;
            }

            if (virtualclass.gObj.audMouseDown && (io.webSocketConnected())) {
              // var left = e.inputBuffer.getChannelData(0);
              const samples = this.resampler.resampler(left);
              const leftSix = convertFloat32ToInt16(samples);
              const send = this.encodeAudio(leftSix);
              this.silenceDetection(send, leftSix);
            }
          }
        },

        /**
         * Resamples the audio and silence detection, and broadcast audio
         * it's fallback method in case of not supporting audio worklet
         */
        recorderProcessFallback(e) {
          workerAudioSend.postMessage({ cmd: 'rawAudio', msg: e.inputBuffer.getChannelData(0) });
        },

        /**
         * Encodes the sampled data
         *@param leftSix audio data
         *@return encoded  G711 encoded data
         */
        // TODO function name should reflect the action
        encodeAudio(leftSix) {
          const encoded = G711.encode(leftSix, {
            alaw: this.encMode === 'alaw',
          });
          return encoded;
        },

        /**
         * pushing the encoded samples in audioForTest array
         * setting the uid to false
         * @param  leftSix audio samples
         *
         */
        audioForTesting(leftSix) {
          const encoded = G711.encode(leftSix, {
            alaw: this.encMode === 'alaw',
          });
          virtualclass.gObj.audioForTest.push(encoded);
          virtualclass.gObj[virtualclass.gObj.uid] = false;
        },

        initPlayWithFallback() {
          if (!Object.prototype.hasOwnProperty.call(this, 'Html5Audio') && !this.Html5Audio) {
            this.Html5Audio = { audioContext: new (window.AudioContext || window.webkitAudioContext)() };
          }

          if (!workerAudioRecOnmessage) {
            const audioReadyChannel = new MessageChannel();
            workerIO.postMessage({
              cmd: 'workerAudioRec',
            }, [audioReadyChannel.port1]);

            // Setup the connection: Port 2 is for worker 2
            workerAudioRec.postMessage({
              cmd: 'workerIO',
              sampleRate: this.Html5Audio.audioContext.sampleRate,
            }, [audioReadyChannel.port2]);

            workerAudioRec.postMessage({ cmd: 'audioWorklet', msg: false });
            workerAudioRec.onmessage = function (e) {
              switch (e.data.cmd) {
                case 'noAudioWorklet':
                  virtualclass.media.audio.queueWithFalback(e.data.msg.data, e.data.msg.uid);
                  virtualclass.media.audio.playWithFallback(e.data.msg.uid);
                  break;
                default:
                // console.log('do nothing');
              }
            };
            workerAudioRecOnmessage = true;
            // virtualclass.gObj.workerAudio = true;
            virtualclass.gObj.audioRecWorkerReady = true;
          }
        },

        initPlay() {
          if (!Object.prototype.hasOwnProperty.call(this, 'Html5Audio') && !this.Html5Audio) {
            this.Html5Audio = { audioContext: new (window.AudioContext || window.webkitAudioContext)() };
          }

          if (typeof workletAudioRec !== 'object') {
            cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(workletAudioRecBlob).then(() => {
              // Setup the connection: Port 1 is for worker 1
              if (typeof initchannel === 'undefined') {
                workletAudioRec = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'worklet-audio-rec');
                cthis.audio.Html5Audio.MediaStreamDest = cthis.audio.Html5Audio.audioContext.createMediaStreamDestination();
                workletAudioRec.connect(cthis.audio.Html5Audio.audioContext.destination);


                if (virtualclass.system.mybrowser.name === 'Chrome') {
                  // console.log('==== Chrome after change');
                  cthis.audio.bug_687574_callLocalPeers();
                }

                const audioReadyChannel = new MessageChannel();
                workerIO.postMessage({
                  cmd: 'workerAudioRec',
                }, [audioReadyChannel.port1]);

                // Setup the connection: Port 2 is for worker 2
                workerAudioRec.postMessage({
                  cmd: 'workerIO',
                  sampleRate: cthis.audio.Html5Audio.audioContext.sampleRate,
                }, [audioReadyChannel.port2]);

                const audoPlaychannel = new MessageChannel();

                workerAudioRec.postMessage({
                  cmd: 'workletAudioRec',
                }, [audoPlaychannel.port1]);

                // Setup the connection: Port 2 is for worker 2
                workletAudioRec.port.postMessage({
                  cmd: 'workerAudioRec',
                }, [audoPlaychannel.port2]);
                workerAudioRec.postMessage({ cmd: 'audioWorklet', msg: true });
                initchannel = true;
                virtualclass.gObj.audioRecWorkerReady = true;
              }
              // virtualclass.gObj.workerAudio = true;
            });
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
        playWithFallback(uid) {
          if (this.Html5Audio.audioContext.state === 'suspended') {
            /** Wait till 2 seconds and see if still it's suspended ** */
            if (!Object.prototype.hasOwnProperty.call(this, 'audioSuspendTime')) {
              this.audioSuspendTime = setTimeout(() => {
                if (this.Html5Audio.audioContext.state === 'suspended') {
                  this.snode.push(uid);
                  if (virtualclass.gObj.requestToScriptNode === null) {
                    this.Html5Audio.audioContext.resume();
                    virtualclass.gesture.initAudioResume(uid);
                    virtualclass.gObj.requestToScriptNode = true;
                  }
                  delete this.audioSuspendTime;
                }
              }, 2000);
            }
          } else {
            this.innerPlayWithFallback();
            if (this.audioSuspendTime) {
              delete this.audioSuspendTime;
            }
          }
        },

        innerPlayWithFallback() {
          const that = this;
          if (virtualclass.media.audioPlayerNode === null
            || virtualclass.media.audioPlayerNode.context.state === 'closed') {
            // console.log('script processor node is created');
            if (virtualclass.media.audioPlayerNode !== null) {
              virtualclass.media.audioPlayerNode.disconnect();
            }

            virtualclass.media.audioPlayerNode = this.Html5Audio.audioContext.createScriptProcessor(4096, 1, 1);
            snNodePak = 0;
            virtualclass.media.audioPlayerNode.onaudioprocess = function (event) {
              const output = event.outputBuffer.getChannelData(0);
              const newAud = that.getMergedAudio();
              if (newAud !== null && newAud !== undefined) {
                for (let i = 0; i < newAud.length; i++) {
                  output[i] = newAud[i];
                }
                snNodePak = newAud[4095];
              } else {
                for (let i = 0; i < output.length; i++) {
                  output[i] = snNodePak;
                }
              }
            };
            virtualclass.media.audioPlayerNode.connect(this.Html5Audio.audioContext.destination);
          }
        },

        queueWithFalback(packets, uid) {
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
            const arrChunk = allAudioArr[uid].splice(0, 4096);
            audioToBePlay[uid].push(new Float32Array(arrChunk));
          }
        },


        /** Return Merged audio which received from different sources * */
        getMergedAudio() {
          // console.log('AUDIO' + allAudioArr[158].length);
          allAudioSend = [];
          audioLen = 0;
          for (luid in audioToBePlay) {
            const temp = this.getAudioChunks(luid);
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
          } if (audioLen > 1) {
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
        getAudioChunks(uid) {
          if (audioToBePlay !== null) {
            if (audioToBePlay[uid].length >= 9) { // 835.918371 ms
              while (audioToBePlay[uid].length >= 3) { // 278.639457 ms
                audioToBePlay[uid].shift();
              }
              aChunksPlay[uid] = true;
              return audioToBePlay[uid].shift();
            } if (audioToBePlay[uid].length >= 2) { // 185.759638 ms
              aChunksPlay[uid] = true;
              return audioToBePlay[uid].shift();
            } if (audioToBePlay[uid].length > 0 && aChunksPlay[uid] === true) {
              aChunksPlay[uid] = true;
              return audioToBePlay[uid].shift();
            }
            aChunksPlay[uid] = false;
            if (audioToBePlay[uid].length === 0) {
              delete audioToBePlay[uid];
            }
          }
        },


        actualManiPulateStream() {
          // console.log('Manipulate stream');
          this.triggermaniPulateStream = true;
          const cthis = virtualclass.media;
          // TODO remove setTimeout
          setTimeout(
            () => {
              if (cthis.detectAudioWorklet()) {
                cthis.audio.maniPulateStream();
              } else {
                cthis.audio.maniPulateStreamWithFallback();
              }
            }, 1000,
          );
        },


        /** *
         * It connects the stream received from Mic/GetUserMedia to audio context,
         * and getting the audio chunks from audio worklet
         * */
        maniPulateStream() {
          const { stream } = cthis;
          if (typeof workletAudioSend !== 'undefined') {
            workletAudioSend.disconnect();
          }
          if (typeof stream !== 'undefined' && stream != null) {
            // console.log('Audio worklet init add module');
            cthis.audio.Html5Audio.audioContext.audioWorklet.addModule(workletAudioSendBlob).then(() => {
              // console.log('== init audio worklet 3');
              const audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);

              const filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.value = 2000;
              audioInput.connect(filter);

              workletAudioSend = new AudioWorkletNode(cthis.audio.Html5Audio.audioContext, 'worklet-audio-send');

              workletAudioSend.onprocessorerror = function (e) {
                cthis.audio.notifiyMuteAudio();
              };
              filter.connect(workletAudioSend);
              workletAudioSend.connect(cthis.audio.Html5Audio.audioContext.destination);

              const IOAudioSendWorker = new MessageChannel();

              workerAudioSend.postMessage({
                cmd: 'workerIO',
                sampleRate: this.Html5Audio.audioContext.sampleRate,
                uid: virtualclass.gObj.uid,
              }, [IOAudioSendWorker.port1]);

              // Setup the connection: Port 2 is for worker 2
              workerIO.postMessage({
                cmd: 'workerAudioSend',
              }, [IOAudioSendWorker.port2]);


              const workerWorkletAudioSend = new MessageChannel();

              workerAudioSend.postMessage({
                cmd: 'audioWorkletSend',
                msg: { repMode },
              }, [workerWorkletAudioSend.port1]);

              // Setup the connection: Port 2 is for worker 2
              workletAudioSend.port.postMessage({
                cmd: 'workerAudioSend',
              }, [workerWorkletAudioSend.port2]);

              cthis.workerAudioSendOnmessage();
              // console.log('Audio worklet ready audio worklet module');
            }).catch((e) => {
              cthis.audio.notifiyMuteAudio();
            });
          }
        },

        /**
         * It connects the stream received from Mic/GetUserMedia to audio context,
         * and getting the audio chunks from script processor node.
         * It's a fallback method in case of not supporting Audio worklet
         * */
        maniPulateStreamWithFallback() {
          if (typeof cthis.stream !== 'undefined' && cthis.stream != null) {
            const { stream } = cthis;

            const audioInput = cthis.audio.Html5Audio.audioContext.createMediaStreamSource(stream);
            cthis.audio.bufferSize = 4096;
            // virtualclass.media.audioCreatorNode is being made global because recorderProcess with
            // onaudioprocess is not triggered due to Garbage Collector
            // https://code.google.com/p/chromium/issues/detail?id=360378

            virtualclass.media.audioCreatorNode = cthis.audio.Html5Audio.audioContext.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
            virtualclass.media.audioCreatorNode.onaudioprocess = cthis.audio.recorderProcessFallback.bind(cthis.audio);

            const filter = cthis.audio.Html5Audio.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 2000;

            audioInput.connect(filter);
            filter.connect(virtualclass.media.audioCreatorNode);
            virtualclass.media.audioCreatorNode.connect(cthis.audio.Html5Audio.audioContext.destination);


            const IOAudioSendWorker = new MessageChannel();

            workerAudioSend.postMessage({
              cmd: 'workerIO',
              uid: virtualclass.gObj.uid,
              sampleRate: cthis.audio.Html5Audio.audioContext.sampleRate,
            }, [IOAudioSendWorker.port1]);

            // Setup the connection: Port 2 is for worker 2
            workerIO.postMessage({
              cmd: 'workerAudioSend',
            }, [IOAudioSendWorker.port2]);

            cthis.workerAudioSendOnmessage();
          } else {
            // console.log('No stream is found');
          }
        },

        /**
         *  Setting the record start time to the current time
         *  and setting the replay mode to false
         *
         */
        updateInfo() {
          this.audioStreamArr = [];
          // virtualclass.wb[virtualclass.gObj.currWb].pageEnteredTime = virtualclass.wb[virtualclass.gObj.currWb].recordStarted = new Date().getTime();
          this.recordAudio = false;
          repMode = false;
        },


        /**
         * To extract user id of sender and data from the receied message
         * @param  msg recevied message from online users
         * @returns {Array} userid received with the  message plus rest of the msz data
         */
        extractData(msg) {
          const dataPack = new Int8Array(msg);
          const uid = virtualclass.vutil.numValidateFour(dataPack[1], dataPack[2], dataPack[3], dataPack[4]);
          return [uid, dataPack.subarray(5, dataPack.length)];
        },

        removeAudioFromLocalStorage() {
          // console.log('Remove audio from local storage');
          localStorage.removeItem('audEnable');
        },

        async bug_687574_callLocalPeers() {
          let lc1; let
            lc2;
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
            if (event.currentTarget.connectionState === 'connected') {
              try { // TODO Dirty try hack
                // console.log('PEER connected webrtc');
                workletAudioRec.disconnect(cthis.audio.Html5Audio.audioContext.destination);
                workletAudioRec.connect(cthis.audio.Html5Audio.MediaStreamDest);
              } catch (e) {
              }
            } else if (event.currentTarget.connectionState === 'disconnected') {
              // console.log('PEER disconnected');
              lc1.close();
              lc2.close();
              lc1 = null;
              lc2 = null;
              try {
                workletAudioRec.disconnect(cthis.audio.Html5Audio.MediaStreamDest);
                workletAudioRec.connect(cthis.audio.Html5Audio.audioContext.destination);
                // console.log('PEER connected normal audio api');
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
            const audio = document.createElement('audio');
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
              if (event.candidate.type === 'host') { // We only want to connect over LAN
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
            // console.log('PEER fallback');
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
        },
      },
      /**
       * video property contains all the properties and methods necessary for the manipulation
       * of the video
       */
      video: {
        width: 75,
        height: 56,
        tempVid: '',
        tempVidCont: '',
        myVideo: '',
        remoteVid: '',
        remoteVidCont: '',
        maxHeight: 250,
        // Setting the video container's max height
        init() {
          this.videoCont = document.getElementById('allVideosCont');
          if (this.videoCont != null) {
            this.videoCont.style.maxHeight = `${this.maxHeight}px`;
          }
        },
        // Calulates dimensions of the video to be displayed.
        calcDimension() {
          this.myVideo.width = this.width;
          this.myVideo.height = this.height;
        },
        /**
         *  remove user and corresponding video element
         * @param id userid of the user to be removed
         */
        removeUser(id) {
          const element = document.getElementById(`user${id}`);
          if (element != null) {
            element.parentNode.removeChild(element);
          }
        },
        /**
         * TO create Video container that replaces user image
         * @param  user user object

         */
        createElement(user) {
          const videoWrapper = document.createElement('div');
          videoWrapper.className = 'videoWrapper';
          const videoSubWrapper = document.createElement('div');
          videoSubWrapper.className = 'videoSubWrapper';
          videoSubWrapper.id = `user${user.id}`;
          videoWrapper.appendChild(videoSubWrapper);
          vidId = user.id;

          const video = document.createElement('canvas');
          video.id = `video${vidId}`;
          video.className = 'userVideos';
          video.width = this.width;
          video.height = this.height;
          video.muted = 'muted';
          let { videoCont } = this;
          videoSubWrapper.appendChild(video);
          videoCont = videoWrapper;
          virtualclass.media.util.imageReplaceWithVideo(user.id, videoCont);
        },
        // TODO This function is not being invoked
        updateHightInSideBar(videoHeight) {
          // TODO this is not to do every time a function is called
          const sidebar = document.getElementById('widgetRightSide');
          const sidebarHeight = sidebar.offsetHeight;
          const chatBox = document.getElementById('chatContainer');
          const chatBoxHeight = sidebarHeight - videoHeight;
          chatBox.style.height = `${chatBoxHeight}px`;
        },
        /** Send the small video and render it at the receiver's side
         * And breaks user id into bytes
         * Sets the interval for  send small video
         * interval depends on the number of users
         */
        // TODO function defined in function they can be separately defined
        sendInBinary(sendimage) {
          const user = {
            name: virtualclass.gObj.uName,
            id: virtualclass.gObj.uid,
          };
          if (io.webSocketConnected()) {
            //  console.log('====> video by image ');
            // virtualclass.vutil.beforeSend({ videoByImage: user, cf: 'videoByImage' }, null, true);
            ioAdapter.sendBinary(sendimage);
          }
        },

        send() {
          if (Object.prototype.hasOwnProperty.call(virtualclass.media, 'smallVid')) {
            clearInterval(virtualclass.media.smallVid);
          }
          const cvideo = this;
          let frame;
          let sendimage;
          let vidType;
          randomTime = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000); // Random number between 3000 & 8000
          let totalMembers = -1;
          const that = this;

          function sendSmallVideo() {
            const resA = 1;
            const resB = 1;
            cvideo.tempVidCont.clearRect(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
            cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);

            const user = {
              name: virtualclass.gObj.uName,
              id: virtualclass.gObj.uid,
            };

            if (roles.hasControls()) {
              user.role = virtualclass.gObj.uRole;
            }

            // const d = { x: 0, y: 0 };
            // you increase the the value, increase the quality
            // 0.4 and 9 need 400 to 500 kb/persecond
            if (virtualclass.system.webpSupport) {
              sendimage = cvideo.tempVid.toDataURL('image/webp', 0.6);
              vidType = 1;
            } else {
              sendimage = cvideo.tempVid.toDataURL('image/jpeg', 0.3);
              vidType = 0;
            }

            sendimage = virtualclass.videoHost.convertDataURIToBinary(sendimage);
            if (!virtualclass.videoHost.gObj.stdStopSmallVid && (!roles.hasControls()
              || (roles.hasControls()) && virtualclass.videoHost.gObj.videoSwitch)) {
              const uid = breakintobytes(virtualclass.gObj.uid, 8);
              const scode = new Uint8ClampedArray([11, uid[0], uid[1], uid[2], uid[3], vidType]);// First parameter represents  the protocol rest for user id
              const sendmsg = new Uint8ClampedArray(sendimage.length + scode.length);
              sendmsg.set(scode);
              sendmsg.set(sendimage, scode.length);
              that.sendInBinary(sendmsg);
            }
            clearInterval(virtualclass.media.smallVid);

            if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
              const d = randomTime + (virtualclass.connectedUsers.length * 2500);
              if (totalMembers !== virtualclass.connectedUsers.length) {
                totalMembers = virtualclass.connectedUsers.length;
                let p = -1;
                for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
                  if (virtualclass.connectedUsers[0].userid === virtualclass.gObj.uid) {
                    p = i;
                  }
                }
                const td = d / totalMembers;
                if (p < 0) {
                  p = 0;
                }
                const md = p * td;
                virtualclass.media.smallVid = setInterval(sendSmallVideo, (d + md));
              } else {
                virtualclass.media.smallVid = setInterval(sendSmallVideo, d);
              }
            }
          }

          virtualclass.media.smallVid = setInterval(sendSmallVideo, randomTime);
          // Breaking user id into bytes
          function breakintobytes2(val, l) {
            let numstring = val.toString();
            for (let i = numstring.length; i < l; i++) {
              numstring = `0${numstring}`;
            }
            const parts = numstring.match(/[\S]{1,2}/g) || [];
            return parts;
          }
        },

        /**
         * Calulate dimensions of the  video
         * and sends the video
         */
        startToStream() {
          cthis.video.calcDimension();
          cthis.video.send();
        },

        /**
         * Play the received video with out slicing it
         * @param  uid
         * @param  msg video message received

         */
        playWithoutSlice(uid, msg, vtype) {
          //  console.log('uid ' + uid);
          this.remoteVid = document.getElementById(`video${uid}`);
          // TODO remove validation
          if (this.remoteVid != null) {
            this.remoteVidCont = this.remoteVid.getContext('2d');

            this.remoteVidCont.putImageData(imgData, 0, 0);
          }
        },

        drawReceivedImage(imgData, imgType, d, uid) {
          this.remoteVid = chatContainerEvent.elementFromShadowDom(`#video${uid}`);
          if (this.remoteVid != null) {
            this.remoteVidCont = this.remoteVid.getContext('2d');
            if (virtualclass.system.webpSupport || (imgType === 'jpeg')) {
              const img = new Image();
              const that = this;
              img.onload = function () {
                that.remoteVidCont.drawImage(img, d.x, d.y);
              };
              img.src = imgData;
            } else {
              loadfile(imgData, this.remoteVid, this.videoPartCont); // for browsers that do not support webp
            }
          }
        },


        // TODO this function is not being used
        justForDemo() {
          const maxHeight = 250;
          let num = 0;
          let videoCont = document.getElementById('allVideosCont');
          videoCont.style.maxHeight = `${maxHeight}px`;

          setInterval(
            () => {
              if (++num <= 20) {
                videoCont = document.getElementById('allVideosCont');
                const videoWrapper = document.createElement('div');
                videoWrapper.className = 'videoWrapper';
                //                                        videoWrapper.setAttribute("data-uname", "suman" + num);
                const videoSubWrapper = document.createElement('div');
                videoSubWrapper.className = 'videoSubWrapper';
                videoSubWrapper.setAttribute('data-uname', +num);
                videoWrapper.appendChild(videoSubWrapper);
                const prvContHeight = videoCont.offsetHeight;
                const video = document.createElement('video');
                video.className = 'userVideo';
                video.muted = 'muted';
                video.src = 'http://html5demos.com/assets/dizzy.mp4';
                videoSubWrapper.appendChild(video);
                videoCont.appendChild(videoWrapper);
                const newContHeight = videoCont.offsetHeight;
                if (videoCont.offsetHeight >= maxHeight) {
                  if (videoCont.style.overflowY != null && videoCont.style.overflowY !== 'scroll') {
                    videoCont.style.overflowY = 'scroll';
                    document.getElementById(virtualclass.gObj.chat.mainChatBoxId).style.borderTop = '3px solid #bbb';
                  }
                }
              }
            },
            200,
          );
        },
        /**
         * Creates video element
         * @returns video element
         */
        createVideoElement() {
          const vTag = 'video';
          const parElement = document.createElement('div');
          parElement.className = 'videoWrapper';
          const childElement = document.createElement('div');
          childElement.className = 'videoSubWrapper';
          parElement.appendChild(childElement);
          const videoTag = document.createElement(vTag);
          videoTag.id = `video${virtualclass.gObj.uid}`;
          videoTag.autoplay = true;
          childElement.appendChild(videoTag);
          return parElement;
        },

        /**
         * To create canvas element to display video
         * @param string beforInsert : The element before that video element to be inserted
         */
        insertTempVideo(beforeInsert) {
          const tempVideo = document.createElement('canvas');
          tempVideo.id = 'tempVideo';

          beforeInsert.parentNode.insertBefore(tempVideo, beforeInsert);
        },
        // To initalize canvas element to video and to create it's 2d context
        tempVideoInit() {
          // cthis.video.tempVid = document.getElementById('tempVideo');
          cthis.video.tempVid = chatContainerEvent.elementFromShadowDom('#tempVideo');
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

        process(msg) {
          let b64encoded;
          let imgType;
          const dataPack = new Uint8ClampedArray(msg);
          const uid = virtualclass.vutil.numValidateFour(dataPack[1], dataPack[2], dataPack[3], dataPack[4]);

          const userInfo = { id: uid };
          if (!virtualclass.media.existVideoContainer(userInfo)) {
            virtualclass.media.video.createElement(userInfo);
          }
          const recmsg = dataPack.subarray(6, dataPack.length);

          if (dataPack[5] === 1) {
            b64encoded = `data:image/webp;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
            imgType = 'webp';
          } else {
            b64encoded = `data:image/jpeg;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
            imgType = 'jpeg';
          }

          virtualclass.media.video.drawReceivedImage(b64encoded, imgType, { x: 0, y: 0 }, uid);
        },
      },

      sessionConstraints() {
        let webcam = !!virtualclass.system.mediaDevices.hasWebcam;

        /**
         * Reduce the resolution and video frame rate to optimization CPU resource
         *
         * */

        if (virtualclass.gObj.meetingMode && webcam) {
          if (virtualclass.system.device === 'mobTab' && virtualclass.system.mybrowser.name === 'iOS'
            || virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'Safari') {
            webcam = true;
          } else {
            webcam = {
              width: { max: 268 },
              height: { max: 142 },
              frameRate: { max: 6 },
            };
            // webcam = true;
          }
        }

        if (virtualclass.system.mediaDevices.hasMicrophone) {
          var audioConstraint = {
            echoCancellation: true,
            autoGainControl: true,
            channelCount: 1,
            noiseSuppression: true,
          };
        } else {
          var audioConstraint = false;
        }


        const session = {
          // audio: virtualclass.gObj.multiVideo ? true :  audioOpts,
          video: webcam,
          audio: audioConstraint,
        };

        return [webcam, session];
      },

      /**
       * It creates a mediator for getUSerMedia
       * and it prompts the user for permission to use video or audio device
       * it  inalizes the video
       */
      /* TODO @param vbool :no use of parameter vbool */


      async init() {
        // console.log('Video second, normal video');
        cthis = this; // TODO there should be done work for cthis

        if (virtualclass.gesture.classJoin) {
          virtualclass.gesture.attachHandler();
          delete virtualclass.gesture.classJoin;
        }

        let webcam; let
          session;
        [webcam, session] = this.sessionConstraints();

        cthis.video.init();
        // cthis.audio.Html5Audio = {audioContext: new (window.AudioContext || window.webkitAudioContext)()};
        // cthis.audio.resampler = new Resampler(cthis.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
        // const that = this;
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
            const tracks = virtualclass.media.video.tempStream.getTracks(); // if only one media track
            for (let i = 0; i < tracks.length; i++) {
              tracks[i].stop();
            }
          }


          const cNavigator = virtualclass.adpt.init(navigator);
          let stream = null;
          try {
            stream = await cNavigator.mediaDevices.getUserMedia(session);
          } catch (e) {
            this.handleUserMediaError(e);
            this.audio.notifiyMuteAudio();
          }
          if (stream !== null) {
            this.handleUserMedia(stream);
          }
        }


        if (virtualclass.system.wbRtc.peerCon) { // TODO this should be deleted
          if (typeof localStorage.wbrtcMsg === 'undefined') {
            virtualclass.view.multiMediaMsg('WebRtc');
            localStorage.wbrtcMsg = true;
          }
        }

        if (webcam === false) {
          virtualclass.user.control.videoDisable();
          virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
          // virtualclass.videoHost.UI.hideVideo();
        }
      },


      /**
       * This function  is invoked with the resulting media stream object if the call to getUserMedia succeeds.
       * And invoke handleUSerMediaError in case of getusermedia error.
       * handleUSerMedia  initializes audio.
       * @param stream object
       */

      handleUserMedia(stream) {
        localStorage.removeItem('dvid');
        let audio = localStorage.getItem('audEnable');
        if (roles.isStudent() && virtualclass.system.mediaDevices.hasMicrophone) {
          virtualclass.settings.userAudioIcon();
        } else if (virtualclass.system.mediaDevices.hasMicrophone) {
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
          } else if (typeof stream !== 'undefined') {
            virtualclass.user.control.audioWidgetEnable(true);
          }
        } else {
          virtualclass.user.control.audioDisable();
        }

        const mediaStreamTrack = stream.getVideoTracks()[0];
        if (typeof mediaStreamTrack !== 'undefined') {
          mediaStreamTrack.onended = function () { // for Chrome.
            if (roles.hasControls()) {
              virtualclass.videoHost.clearTeacherVideoTime();
              virtualclass.system.mediaDevices.webcamErr.push('webcambusy');
              const videoHostContainer = document.getElementById('videoHostContainer');
              if (videoHostContainer !== null) {
                videoHostContainer.classList.add('displayInterrupt');
              }

              ioAdapter.mustSend({ cf: 'videoStop' });
            }

            // virtualclass.media.audio.removeAudioFromLocalStorage();
          };
        } else {
          virtualclass.system.mediaDevices.webcamErr.push('nopermission');
        }

        cthis.video.tempStream = stream;
        cthis.audio.init();
        cthis.audio.attachAudioStopHandler(stream);

        const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
        if (userDiv != null) {
          const vidTag = userDiv.getElementsByTagName('video');
          if (vidTag != null) {
            cthis.innerHandleUserMedia(virtualclass.gObj.uid);
          }
        }

        if (roles.hasAdmin()) {
          virtualclass.videoHost.isDomReady(() => {
            virtualclass.videoHost.renderSelfVideo(stream); // Teacher video
          });
        }
        virtualclass.settings.userVideoIcon();

        /**
         * Disable teacher video by default, when he/she will join first time
         */

        if (localStorage.getItem('prevApp') == null) {
          if (roles.hasControls()) {
            // true is passed, because, we don't want to pass video control on precheck
            virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off') ? 'on' : 'off', true);
          } else if (virtualclass.gObj.meetingMode) {
            virtualclass.vutil.videoHandler('off');
          }
        }

        if (cthis.audio.audioContextReady
          && !Object.prototype.hasOwnProperty.call(cthis.audio, 'triggermaniPulateStream')) {
          cthis.stream = cthis.video.tempStream;
          cthis.audio.actualManiPulateStream();
        }
      },


      /**
       * Adding the class student or teacher to the each user's div
       * @param  id User id
       * @param  role user role
       */
      addUserRole(userDiv, role) {
        // TODO, IMPROVE PERFORMANCE, hitting on joining of new members. talentedge, 5.4%
        // Fixed it, now need to validate it
        // That userDiv is passing while creating container in displayUserChatList with member Update
        // var userDiv = document.getElementById("ml" + id);
        let userType;
        userDiv.dataset.role = role;
        if (typeof role !== 'undefined') {
          userType = (role === 's') ? 'student' : 'teacher';
          userDiv.classList.add(userType);
        } else {
          userDiv.classList.add('student');
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
      innerHandleUserMedia(userid) {
        if (typeof cthis !== 'undefined') {
          const stream = cthis.video.tempStream;

          if (typeof stream !== 'undefined') {
            if (virtualclass.system.mediaDevices.hasWebcam) {
              const vidContainer = cthis.video.createVideoElement();
              virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

              cthis.video.insertTempVideo(vidContainer);
              cthis.video.tempVideoInit();
              // cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
              cthis.video.myVideo = chatContainerEvent.elementFromShadowDom(`#video${virtualclass.gObj.uid}`);
              virtualclass.adpt.attachMediaStream(cthis.video.myVideo, stream);
              cthis.video.myVideo.muted = true;
              cthis.stream = cthis.video.tempStream;
              cthis.video.myVideo.onloadedmetadata = function () {
                cthis.video.startToStream();
                // virtualclass.precheck.webcam.createVideo();
              };
            }
          }
        } else {
          // console.log('Media: it seems media is not ready');
        }
      },
      /**
       * Increasing chat container's height as number of users is increased
       * user box scroll, right bar scroll
       *
       */
      updateVideoContHeight() {
        // console.log('Updating User');
        const elem = document.getElementById('virtualclassCont');
        // var offset = vcan.utility.getElementOffset(elem);
        const offset = virtualclass.vutil.getElementOffset(elem);
        const mh = virtualclass.chat.boxHeight;

        const chatDiv = document.getElementById('chat_div');
        if (chatDiv.scrollHeight >= (mh + 1)) {
          chatDiv.style.overflowY = 'scroll';
        }

        chatDiv.style.maxHeight = `${mh}px`;

        // console.log(`Chat height ${chatDiv.offsetHeight}`);
        // console.log(`Max height ${chatDiv.style.maxHeight}`);

        if (virtualclass.isPlayMode) {
          chatDiv.style.maxHeight = `${mh + 64}px`;
        }
      },
      // Closeing the video
      close() {
        if (Object.prototype.hasOwnProperty.call(virtualclass.media, 'smallVid')) {
          clearInterval(virtualclass.media.smallVid);
        }
      },
      /**
       * Plays all videos of currentlly logged in users after an interval of 1040 ms
       * @param id footer chat  container id
       */
      dispAllVideo(id) {
        setTimeout(
          () => {
            const chatCont = document.getElementById(id);
            if (chatCont != null) {
              const allVideos = chatCont.getElementsByTagName('video');
              for (let i = 0; i < allVideos.length; i++) {
                allVideos[i].play();
              }
            }
          },
          1040,
        );
      },

      /**
       *TODO this function is not being invoked
       */
      existVideoContainer(user) {
        const allVideos = chatContainerEvent.elementFromShadowDom('.userVideos', 'all');
        for (let i = 0; i < allVideos.length; i++) {
          if (allVideos[i].id === `video${user.id}`) {
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
      handleUserMediaError(error) {
        const errorString = virtualclass.lang.getString(error);
        const errorMsg = (typeof error === 'object') ? virtualclass.lang.getString(error.name) : errorString;

        if (errorMsg == null) {
          virtualclass.view.createErrorMsg(error, 'errorContainer', 'virtualclassAppFooterPanel');
        } else {
          virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'virtualclassAppFooterPanel');
        }

        virtualclass.user.control.mediaWidgetDisable('vd');
        virtualclass.view.disappearBox('WebRtc');
        // localStorage.setItem('dvid', true);
        // console.log('navigator.getUserMedia error: ', error);

        let errorCode = '';
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

        // cthis.audio.notifiyMuteAudio();
        // virtualclass.media.audio.removeAudioFromLocalStorage();
      },

      detectAudioWorklet: () => {
        if (typeof OfflineAudioContext === 'undefined') {
          return false;
        }
        const context = new OfflineAudioContext(1, 1, 44100);
        return Boolean(
          context.audioWorklet
          && typeof context.audioWorklet.addModule === 'function',
        );
      },
    };
  };
  window.media = media;
}(window));
