class MediaAudio {
  constructor() {
    this.audioStreamArr = [];
    this.tempAudioStreamArr = [];
    this.recordingLength = 0;
    this.bufferSize = 0;
    this.encMode = 'alaw';
    this.recordAudio = false;
    this.rec = '';
    this.otherSound = false;
    this.audioNodes = [];
    this.sdElem = 'silenceDetect';
    this.snode = []; // To holds the user's id whose audio context is suspended
    this.workletAudioRec = false;
    this.audioContextReady = false;
    this.enable = false;
    this.filterAudioWorklet = false;
    this.workletAudioSend = false;
    this.workerAudioRecOnmessage = false;
    this.allAudioSend = null;
    this.audioLen = 0;
    this.snNodePak = 0;
    this.audioInputForAudioWorklet = false;
    this.l = 0;
    this.buff = null;
    this.audioToBePlay = {};
    this.aChunksPlay = {};
    this.allAudioArr = {};
    this.repMode = null;
    this.attachFunctionsToAudioWidget();
  }

  init(stream) {
    const isEnableAudio = document.getElementById('speakerPressOnce').dataset.audioPlaying;
    virtualclass.gObj.audMouseDown = (isEnableAudio === 'true');


    // This part in not being used
    this.graph = {
      height: 56,
      width: 4,
      average: 0,

      display() {
        const cvideo = virtualclass.media.video;
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
    // this.attachFunctionsToAudioWidget(); // to attach functions to audio widget
    this.attachAudioStopHandler(stream);
  }

  convertFloat32ToInt16(buffer) {
    this.l = buffer.length;
    this.buf = new Int16Array(this.l);
    while (this.l--) {
      this.buf[this.l] = Math.min(1, buffer[this.l]) * 0x7FFF;
    }
    return this.buf;
  }

  initAudiocontext() {
    if (!Object.prototype.hasOwnProperty.call(this, 'Html5Audio') && !virtualclass.gObj.meetingMode) {
      console.log('====> audio context start');
      this.Html5Audio = { audioContext: new (window.AudioContext || window.webkitAudioContext)() };
      this.audioContextReady = true;
      // if (virtualclass.system.mediaDevices.hasMicrophone && !virtualclass.isPlayMode
      //   && virtualclass.media.video.tempStream != null) {
      //   virtualclass.media.stream = virtualclass.media.video.tempStream;
      //   virtualclass.media.audio.actualManiPulateStream();
      // }
    }

    if (!this.resampler) {
      this.resampler = new Resampler(virtualclass.media.audio.Html5Audio.audioContext.sampleRate, 8000, 1, 4096);
    }
  }

  closeContext() {
    if (Object.prototype.hasOwnProperty.call(virtualclass.media.audio, 'Html5Audio')
    && Object.prototype.hasOwnProperty.call(virtualclass.media.audio.Html5Audio, 'audioContext')
    && this.Html5Audio.audioContext != null) {
      // To handle the cracking sound on the side who performes precheck
      // Html5Audio.audioContext to generate the sending audio
      console.log('====> audio context close');
      this.Html5Audio.audioContext.close();
    }

    if (Object.prototype.hasOwnProperty.call(virtualclass.media.audio, 'Html5Audio')) {
      delete virtualclass.media.audio.Html5Audio;
    }
  }

  /** Iniates the script processor node to play the audio * */
  initScriptNode() {
    for (let i = 0; i < this.snode.length; i++) {
      this.innerPlayWithFallback(this.snode[i]);
    }
    this.snode = [];
  }

  attachAudioStopHandler(stream) {
    const audioTrack = stream.getAudioTracks()[0];
    if (audioTrack != null) {
      audioTrack.onended = this.notifiyMuteAudio; // TODO, re initate media stream
      audioTrack.onmute = this.notifiyMuteAudio;
      audioTrack.onunmute = this.notifiyUnmuteAudio;
    }
  }

  notifiyMuteAudio() {
    this.notifyAudioMute = true;
    if (virtualclass.gObj.audMouseDown) {
      if (virtualclass.gObj.mutedomop) {
        if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'mutedomopto')
          || virtualclass.gObj.mutedomopto === null) {
          virtualclass.gObj.mutedomopto = setTimeout(() => {
            virtualclass.media.audio.notifiyMuteAudioDom();
          }, 2000);
        }
      } else {
        virtualclass.media.audio.notifiyMuteAudioDom();
      }
    }
  }

  notifiyUnmuteAudio() {
    this.notifyAudioMute = false;
    virtualclass.gObj.mutedomop = true;
    if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'mutedomopto')) {
      clearTimeout(virtualclass.gObj.mutedomopto);
      virtualclass.gObj.mutedomopto = null;
    }
    virtualclass.media.audio.notifiyUnmuteAudioDom();
  }

  notifiyUnmuteAudioDom() {
    // console.log('==== notify unmute audio');
    if (Object.prototype.hasOwnProperty.call(this, 'speakerPressOnce') && this.speakerPressOnce != null
      && this.speakerPressOnce.classList.contains('audioMute')) {
      this.speakerPressOnce.classList.remove('audioMute');
    }
  }

  notifiyMuteAudioDom() {
    if (!Object.prototype.hasOwnProperty.call(this, 'speakerPressOnce')) {
      this.speakerPressOnce = document.querySelector('#speakerPressOnce');
    }

    if (this.speakerPressOnce != null && !this.speakerPressOnce.classList.contains('audioMute')) {
      this.speakerPressOnce.classList.add('audioMute');
    }
  }


  muteButtonToogle() {
    const speakerPressOnce = document.querySelector('#speakerPressOnce');
    if (speakerPressOnce != null && (speakerPressOnce.dataset.audioPlaying
      && speakerPressOnce.dataset.audioPlaying === 'true')) {
      speakerPressOnce.click();
    }
  }

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
  }

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
  }

  /**
   * Attaching functions to audioWidget
   * Adding event listner on clicking audio tools
   */
  attachFunctionsToAudioWidget() {
    const audioWiget = document.getElementById('audioWidget');
    const allAudTools = audioWiget.getElementsByClassName('audioTool');
    for (let i = 0; i < allAudTools.length; i++) {
      if (allAudTools[i].id === 'speakerPressing') {
        this.attachSpeakToStudent(allAudTools[i].id); // really in use ???
      }

      if (allAudTools[i].id !== 'speakerPressing') {
        allAudTools[i].addEventListener('click', this.audioToolInit.bind(this));
      }
    }
  }

  /**
   * It is invoked on clicking on or off button appeared on audio widget
   * And it is invoked on clicking test audio
   */
  audioToolInit(evt) {
    const elem = evt.currentTarget;
    if (virtualclass.gObj.meetingMode) {
      const tag = document.getElementById(elem.id);
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
    } else if (elem.id === 'speakerPressOnce') {
      this.clickOnceSpeaker(elem.id); // todo, this funciton name should be changed into audioUI
    } else if (elem.id === 'silenceDetect') {
      if (this.sd) {
        this.sd = false;
        elem.className = `${elem.className} sdDisable`;
      } else {
        this.sd = true;
        elem.className = `${elem.className} sdEnable`;
      }
    }
  }

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
  }

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
  }

  /**
   * If Audio is enabled then clicking on it disbles it
   * And if it is disbled then clicking on it enables it
   * @param  id : Id of the audio tool
   */
  // TODO this function is being called with only one attribute
  clickOnceSpeaker(id, alwaysDisable) {
    const tag = document.getElementById(id);
    const anchor = tag.getElementsByClassName('congtooltip')[0];
    // var anchor = tag.getElementsByClassName('tooltip')[0];
    // if (tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined') {
    if (tag.getAttribute('data-audio-playing') === 'false' && typeof alwaysDisable === 'undefined') {
      // this.studentSpeak(alwaysPressElem);
      this.studentSpeak();

      tag.setAttribute('data-audio-playing', 'true');
      anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
      tag.className = 'audioTool active';
      this.enable = true;
      virtualclass.media.startMedia();
    } else {
      this.studentNotSpeak();
      tag.setAttribute('data-audio-playing', 'false');
      if (anchor) {
        anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
      }
      tag.className = 'audioTool deactive';
      this.enable = false;
      virtualclass.media.stopMedia();
      if (virtualclass.media.video.enable) virtualclass.media.startMedia();
    }
  }

  initProcessorEvent() {
    if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'initProcessorTime')) {
      clearInterval(virtualclass.gObj.initProcessorTime);
    }
    virtualclass.gObj.initProcessorTime = setInterval(() => {
      if (virtualclass.media.audio.notifyAudioMute) {
        virtualclass.media.audio.notifiyMuteAudio();
      }
    }, 2000);
  }

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
  }
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
  }
  /**
   * Conversion from array buffer to string
   * @param buf arrayBuffer
   * @return string
   */
  ab2str(buf) {
    return String.fromCharCode.apply(null, new Int8Array(buf));
  }
  /**
   * Conversion from string to array buffer
   * @param str string
   * @return bufView Array Buffer
   */
  str2ab(str) {
    const arrBuf = new ArrayBuffer(str.length); // 2 bytes for each char
    const bufView = new Int8Array(arrBuf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView;
  }


  /**
   * Resamples the audio and silence detection, and broadcast audio
   */
  recorderProcess(left) {
    if (!this.repMode) {
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
  }

  /**
   * Resamples the audio and silence detection, and broadcast audio
   * it's fallback method in case of not supporting audio worklet
   */
  recorderProcessFallback(e) {
    workerAudioSend.postMessage({ cmd: 'rawAudio', msg: e.inputBuffer.getChannelData(0) });
  }

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
  }

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
  }

  initPlayWithFallback() {
    if (!Object.prototype.hasOwnProperty.call(this, 'Html5Audio') && !this.Html5Audio) {
      this.Html5Audio = { audioContext: new (window.AudioContext || window.webkitAudioContext)() };
    }

    if (!this.workerAudioRecOnmessage) {
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
      workerAudioRec.onmessage = (e) => {
        switch (e.data.cmd) {
          case 'noAudioWorklet':
            virtualclass.media.audio.queueWithFalback(e.data.msg.data, e.data.msg.uid);
            virtualclass.media.audio.playWithFallback(e.data.msg.uid);
            break;
          default:
          // console.log('do nothing');
        }
      };
      this.workerAudioRecOnmessage = true;
      // virtualclass.gObj.workerAudio = true;
      virtualclass.gObj.audioRecWorkerReady = true;
    }
  }

  initPlay() {
    if (!this.addingWorkletPending) {
      if (this.workletAudioRec) {
        console.log('audio worklet disconnect');
        this.workletAudioRec.disconnect();
      }

      if (!Object.prototype.hasOwnProperty.call(this, 'audioContextRec') && !this.audioContextRec) {
        // this.audioContextRec = new (window.AudioContext || window.webkitAudioContext)();
        this.Html5Audio = { audioContextRec: new (window.AudioContext || window.webkitAudioContext)() };
      }

      this.addingWorkletPending = true;
      virtualclass.media.audio.Html5Audio.audioContextRec.audioWorklet.addModule(workletAudioRecBlob).then(() => {
      // Setup the connection: Port 1 is for worker 1
        this.workletAudioRec = new AudioWorkletNode(this.Html5Audio.audioContextRec, 'worklet-audio-rec');
        virtualclass.media.audio.Html5Audio.MediaStreamDest = this.Html5Audio.audioContextRec.createMediaStreamDestination();
        this.workletAudioRec.connect(this.Html5Audio.audioContextRec.destination);

        virtualclass.gObj.workletAudioRec = this.workletAudioRec;
        if (virtualclass.system.mybrowser.name === 'Chrome') {
          // console.log('==== Chrome after change');
          virtualclass.media.audio.bug_687574_callLocalPeers();
        }

        const audioReadyChannel = new MessageChannel();
        workerIO.postMessage({
          cmd: 'workerAudioRec',
        }, [audioReadyChannel.port1]);

        // Setup the connection: Port 2 is for worker 2
        workerAudioRec.postMessage({
          cmd: 'workerIO',
          sampleRate: this.Html5Audio.audioContextRec.sampleRate,
        }, [audioReadyChannel.port2]);

        const audoPlaychannel = new MessageChannel();

        workerAudioRec.postMessage({
          cmd: 'workletAudioRec',
        }, [audoPlaychannel.port1]);

        // Setup the connection: Port 2 is for worker 2
        this.workletAudioRec.port.postMessage({
          cmd: 'workerAudioRec',
        }, [audoPlaychannel.port2]);
        workerAudioRec.postMessage({ cmd: 'audioWorklet', msg: true });
        virtualclass.gObj.audioRecWorkerReady = true;

        // virtualclass.gObj.workerAudio = true;
        delete virtualclass.media.audio.addingWorkletPending;

      }).catch((error) => {
        console.log('ERROR ', error);
      });
    };
  }

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
  }

  innerPlayWithFallback() {
    const that = this;
    if (virtualclass.media.audioPlayerNode === null
      || virtualclass.media.audioPlayerNode.context.state === 'closed') {
      // console.log('script processor node is created');
      if (virtualclass.media.audioPlayerNode !== null) {
        virtualclass.media.audioPlayerNode.disconnect();
      }

      virtualclass.media.audioPlayerNode = this.Html5Audio.audioContext.createScriptProcessor(4096, 1, 1);
      this.snNodePak = 0;
      virtualclass.media.audioPlayerNode.onaudioprocess = (event) => {
        const output = event.outputBuffer.getChannelData(0);
        const newAud = that.getMergedAudio();
        if (newAud !== null && newAud !== undefined) {
          for (let i = 0; i < newAud.length; i++) {
            output[i] = newAud[i];
          }
          this.snNodePak = newAud[4095];
        } else {
          for (let i = 0; i < output.length; i++) {
            output[i] = this.snNodePak;
          }
        }
      };
      virtualclass.media.audioPlayerNode.connect(this.Html5Audio.audioContext.destination);
    }
  }

  queueWithFalback(packets, uid) {
    if (this.audioToBePlay[uid] == null) {
      this.audioToBePlay[uid] = [];
    }

    if (this.allAudioArr[uid] == null) {
      this.allAudioArr[uid] = [];
    }

    for (let i = 0; i < packets.length; i++) {
      this.allAudioArr[uid].push(packets[i]);
    }

    while (this.allAudioArr[uid].length >= 4096) {
      const arrChunk = this.allAudioArr[uid].splice(0, 4096);
      this.audioToBePlay[uid].push(new Float32Array(arrChunk));
    }
  }


  /** Return Merged audio which received from different sources * */
  getMergedAudio() {
    // console.log('AUDIO' + this.allAudioArr[158].length);
    this.allAudioSend = [];
    this.audioLen = 0;
    for (letluid in this.audioToBePlay) {
      const temp = this.getAudioChunks(luid);
      if (temp != null) {
        this.audioLen++;
        if (this.audioLen === 1) {
          // this.allAudioSend = temp;
          for (let z = 0; z < 4096; z++) {
            this.allAudioSend[z] = temp[z];
          }
        } else {
          for (let z = 0; z < 4096; z++) {
            this.allAudioSend[z] = allAudioSend[z] + temp[z];
          }
        }
      }
    }

    if (this.audioLen === 1) {
      return this.allAudioSend;
    } if (this.audioLen > 1) {
      for (let z = 0; z < 4096; z++) {
        this.allAudioSend[z] = this.allAudioSend[z] / this.audioLen;
      }
      return this.allAudioSend;
    }
  }


  /**
   * Remove audios from queue if it's long
   * @returns {*} the audio packet with length of 128
   */
  getAudioChunks(uid) {
    if (this.audioToBePlay !== null) {
      if (this.audioToBePlay[uid].length >= 9) { // 835.918371 ms
        while (this.audioToBePlay[uid].length >= 3) { // 278.639457 ms
          this.audioToBePlay[uid].shift();
        }
        this.aChunksPlay[uid] = true;
        return this.audioToBePlay[uid].shift();
      } if (this.audioToBePlay[uid].length >= 2) { // 185.759638 ms
        this.aChunksPlay[uid] = true;
        return this.audioToBePlay[uid].shift();
      } if (this.audioToBePlay[uid].length > 0 && this.aChunksPlay[uid] === true) {
        this.aChunksPlay[uid] = true;
        return this.audioToBePlay[uid].shift();
      }
      this.aChunksPlay[uid] = false;
      if (this.audioToBePlay[uid].length === 0) {
        delete this.audioToBePlay[uid];
      }
    }
  }


  actualManiPulateStream() {
    // console.log('Manipulate stream');
    // this.triggermaniPulateStream = true;
    virtualclass.media = virtualclass.media;
    // TODO remove setTimeout
    setTimeout(
      () => {
        if (virtualclass.media.detectAudioWorklet()) {
          virtualclass.media.audio.maniPulateStream();
        } else {
          virtualclass.media.audio.maniPulateStreamWithFallback();
        }
      }, 1000,
    );
  }


  /** *
   * It connects the stream received from Mic/GetUserMedia to audio context,
   * and getting the audio chunks from audio worklet
   * */
  maniPulateStream() {
    const { stream } = virtualclass.media;
    // if (typeof workletAudioSend !== 'undefined') {
    //   // workletAudioSend.disconnect();
    //   // console.log('====> disconnect audio');
    // }

    if (typeof stream !== 'undefined' && stream != null) {
      // console.log('Audio worklet init add module');
      virtualclass.media.audio.Html5Audio.audioContext.audioWorklet.addModule(workletAudioSendBlob).then(() => {
        // console.log('== init audio worklet 3');
        console.log('====> Add stream on media source ', stream);
        if (this.audioInputForAudioWorklet) {
          this.audioInputForAudioWorklet.disconnect();
          this.filterAudioWorklet.disconnect();
        }

        this.audioInputForAudioWorklet = virtualclass.media.audio.Html5Audio.audioContext.createMediaStreamSource(stream);

        this.filterAudioWorklet = virtualclass.media.audio.Html5Audio.audioContext.createBiquadFilter();
        this.filterAudioWorklet.type = 'lowpass';
        this.filterAudioWorklet.frequency.value = 2000;
        this.audioInputForAudioWorklet.connect(this.filterAudioWorklet);

        this.workletAudioSend = new AudioWorkletNode(virtualclass.media.audio.Html5Audio.audioContext, 'worklet-audio-send');

        this.workletAudioSend.onprocessorerror = (e) => {
          console.log('this is on process error');
          virtualclass.media.audio.notifiyMuteAudio();
          virtualclass.media.audio.isProcessError = true;
        };
        this.filterAudioWorklet.connect(this.workletAudioSend);
        this.workletAudioSend.connect(virtualclass.media.audio.Html5Audio.audioContext.destination);

        virtualclass.gObj.workletAudioSend = this.workletAudioSend;

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
          msg: { repMode: this.repMode },
        }, [workerWorkletAudioSend.port1]);

        // Setup the connection: Port 2 is for worker 2
        this.workletAudioSend.port.postMessage({
          cmd: 'workerAudioSend',
        }, [workerWorkletAudioSend.port2]);

        virtualclass.media.audio.workerAudioSendOnmessage();
        // console.log('Audio worklet ready audio worklet module');
      }).catch((e) => {
        virtualclass.media.audio.notifiyMuteAudio();
      });
    }
  }

  workerAudioSendOnmessage() {
    workerAudioSend.onmessage = (e) => {
      if (Object.prototype.hasOwnProperty.call(e.data, 'cmd')) {
        if (e.data.cmd === 'muteAudio') {
          this.notifiyMuteAudio();
        } else if (e.data.cmd === 'unMuteAudio') {
          this.notifiyUnmuteAudio();
        }
      }
    };
  }

  /**
   * It connects the stream received from Mic/GetUserMedia to audio context,
   * and getting the audio chunks from script processor node.
   * It's a fallback method in case of not supporting Audio worklet
   * */
  maniPulateStreamWithFallback() {
    if (typeof virtualclass.media.stream !== 'undefined' && virtualclass.media.stream != null) {
      const { stream } = virtualclass.media;

      const audioInput = virtualclass.media.audio.Html5Audio.audioContext.createMediaStreamSource(stream);
      virtualclass.media.audio.bufferSize = 4096;
      // virtualclass.media.audioCreatorNode is being made global because recorderProcess with
      // onaudioprocess is not triggered due to Garbage Collector
      // https://code.google.com/p/chromium/issues/detail?id=360378

      virtualclass.media.audioCreatorNode = virtualclass.media.audio.Html5Audio.audioContext.createScriptProcessor(virtualclass.media.audio.bufferSize, 1, 1);
      virtualclass.media.audioCreatorNode.onaudioprocess = virtualclass.media.audio.recorderProcessFallback.bind(virtualclass.media.audio);

      const filter = virtualclass.media.audio.Html5Audio.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      audioInput.connect(filter);
      filter.connect(virtualclass.media.audioCreatorNode);
      virtualclass.media.audioCreatorNode.connect(virtualclass.media.audio.Html5Audio.audioContext.destination);


      const IOAudioSendWorker = new MessageChannel();

      workerAudioSend.postMessage({
        cmd: 'workerIO',
        uid: virtualclass.gObj.uid,
        sampleRate: virtualclass.media.audio.Html5Audio.audioContext.sampleRate,
      }, [IOAudioSendWorker.port1]);

      // Setup the connection: Port 2 is for worker 2
      workerIO.postMessage({
        cmd: 'workerAudioSend',
      }, [IOAudioSendWorker.port2]);

      virtualclass.media.workerAudioSendOnmessage();
    } else {
      // console.log('No stream is found');
    }
  }

  /**
   *  Setting the record start time to the current time
   *  and setting the replay mode to false
   *
   */
  updateInfo() {
    this.audioStreamArr = [];
    // virtualclass.wb[virtualclass.gObj.currWb].pageEnteredTime = virtualclass.wb[virtualclass.gObj.currWb].recordStarted = new Date().getTime();
    this.recordAudio = false;
    this.repMode = false;
  }


  /**
   * To extract user id of sender and data from the receied message
   * @param  msg recevied message from online users
   * @returns {Array} userid received with the  message plus rest of the msz data
   */
  extractData(msg) {
    const dataPack = new Int8Array(msg);
    const uid = virtualclass.vutil.numValidateFour(dataPack[1], dataPack[2], dataPack[3], dataPack[4]);
    return [uid, dataPack.subarray(5, dataPack.length)];
  }

  removeAudioFromLocalStorage() {
    // console.log('Remove audio from local storage');
    localStorage.removeItem('audEnable');
  }

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

    virtualclass.media.audio.Html5Audio.MediaStreamDest.stream.getTracks().forEach(track => lc1.addTrack(track, virtualclass.media.audio.Html5Audio.MediaStreamDest.stream));

    function onconnectionstatechange(pc, event) {
      if (event.currentTarget.connectionState === 'connected') {
        try { // TODO Dirty try hack
          // console.log('PEER connected webrtc');
          virtualclass.media.audio.workletAudioRec.disconnect();
          virtualclass.media.audio.workletAudioRec.connect(virtualclass.media.audio.Html5Audio.MediaStreamDest);
        } catch (e) {
          console.log('Audio error ', e);
        }
      } else if (event.currentTarget.connectionState === 'disconnected') {
        // console.log('PEER disconnected');
        lc1.close();
        lc2.close();
        lc1 = null;
        lc2 = null;
        try {
          virtualclass.media.audio.workletAudioRec.disconnect();
          virtualclass.media.audio.workletAudioRec.connect(virtualclass.media.audio.Html5Audio.audioContext.destination);
          // console.log('PEER connected normal audio api');
        } catch (e) {
          console.log('Audio error ', e);
        }
        virtualclass.media.audio.bug_687574_callLocalPeers();
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
        virtualclass.media.audio.virtualclass.media.audio.connect(virtualclass.media.audio.Html5Audio.audioContext.destination);
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
}