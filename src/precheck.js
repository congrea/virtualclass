const preCheck = {
  currTest: '',
  playTestAudio: false,
  session: null,
  cNavigator: null,
  handlers: [],
  videoAction: false,
  donePrecheck: false,
  cameraStreamStatus: 2, // 2 = not receving anything, 1 = media stream received, some, 0 = some error on receving media
  init() {
    const modal = document.querySelector('#myModal');
    if (modal) {
      modal.className = 'modal in';
    }

    if (roles.hasControls()) {
      this.videoAction = virtualclass.videoHost.gObj.videoSwitch;
    } else if (Object.prototype.hasOwnProperty.call(virtualclass.videoHost.gObj, 'stdStopSmallVid')) {
      this.videoAction = !(virtualclass.videoHost.gObj.stdStopSmallVid); // false means video off
    } else {
      this.videoAction = false;
    }

    // $('#myModal').modal({backdrop: 'static', keyboard: false});
    this.totalTest = ['browser', 'bandWidth', 'webcam', 'speaker', 'mic'];
    this.currTest = 'browser';

    const preCheckContainer = document.querySelector('#virtualclassCont #preCheckcontainer');

    if (preCheckContainer != null) {
      preCheckContainer.style.display = 'block';
      document.getElementById('virtualclassCont').dataset.currwindow = 'precheck';
    }

    const virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
    if (virtualclassApp != null) {
      virtualclassApp.style.display = 'FLEX';
    }

    this.startToCheckWholeSytem();
    // console.log('Precheck init skip');
    const skip = document.querySelector('#preCheckcontainer .skip');

    if (skip) {
      skip.removeEventListener('click', this.initSkip);
      skip.addEventListener('click', this.initSkip);
    }

    virtualclass.precheck.donePrecheck = true;

    if (workerAudioSend != null) {
      workerAudioSend.postMessage({ cmd: 'precheck', msg: { precheck: virtualclass.precheck.donePrecheck } });
    }
  },

  initSkip() {
    let virtualclassPreCheck;
    let virtualclassApp;
    // console.log('Skip clicked');
    micTesting.makeAudioEmpty();
    if (localStorage.getItem('precheck')) {
      virtualclassPreCheck = document.getElementById('preCheckcontainer');
      virtualclassPreCheck.style.display = 'none';
      virtualclassApp = document.getElementById('virtualclassApp');
      virtualclassApp.style.display = 'flex';
      // virtualclass.videoHost._resetPrecheck();
      // virtualclass.media.audio.initAudiocontext();
    } else {
      // virtualclass.media.audio.initAudiocontext();
      virtualclass.popup.waitMsg();
      virtualclass.makeReadySocket();
      virtualclassPreCheck = document.getElementById('preCheckcontainer');
      virtualclassPreCheck.style.display = 'none';
      virtualclassApp = document.getElementById('virtualclassApp');
      virtualclassApp.style.display = 'flex';
      localStorage.setItem('precheck', true);
      virtualclass.videoHost.afterSessionJoin();
    }

    document.getElementById('virtualclassCont').dataset.currwindow = 'normal';

    // virtualclass.media.audio.initAudiocontext();


    const testAudio = document.getElementById('vcSpeakerCheckAudio');
    if (testAudio) {
      testAudio.pause();
      testAudio.currentTime = 0;
    }

    virtualclass.gObj.precheckScrn = false;
    virtualclass.precheck.afterComplete();
    // virtualclass.stickybarWidth();
    // virtualclass.chatBarTabWidth();
  },

  cancelAudioGraph() {
    if (this.graph != null && this.graph != null) {
      this.graph.microphone.stop();
    }
  },

  startToCheckWholeSytem() {
    if (!this.attachHandler) {
      console.log('====> attach handler precheck');
      const allNextButtons = document.querySelectorAll('#preCheckcontainer .precheck .btn');
      for (let i=0; i< allNextButtons.length; i++) {
        allNextButtons[i].addEventListener('click', this.triggerInitHandler.bind(this, allNextButtons[i]));
      }
      this.attachHandler = true;
    }
    this[this.totalTest[0]].perform();
  },

  _next(curr, cb) {
    console.log('Clicked next');

    if (curr === 'browser') {
      virtualclass.media.audio.initAudiocontext();
    }
    virtualclass.precheck.cancelAudioGraph();
    micTesting.makeAudioEmpty();

    const test = this[curr].next;
    if (test) {
      virtualclass.precheck.currTest = test;
      virtualclass.precheck.updateProgressBar(test);
      if ((!Object.prototype.hasOwnProperty.call(this[test], 'alreadyDone')
        || Object.prototype.hasOwnProperty.call(this[test], 'alreadyDone') && (test === 'bandwidth') ||
        (test === 'webcam') || (test === 'mic'))) {
        this[test].perform();
      } else {
        virtualclass.precheck.display(`#preCheckcontainer .precheck.${test}`);
        if (test === 'speaker') {
          this[test]._play(); // play the audio while next buttong is clicked
        } else if (test === 'mic') {
          // this[test].visualize();
          this[test].audioOperation();
        } else if (test === 'webcam') {
          virtualclass.precheck.webcam.initHandler();
          virtualclass.precheck.webcam.createVideo();
        }
      }

      virtualclass.precheck.hide(`#preCheckcontainer .precheck.${curr}`);
      if (typeof cb !== 'undefined') {
        cb();
      }
      this[test].alreadyDone = true;
    }
 },

  _prev(curr, cb) {
    virtualclass.precheck.cancelAudioGraph();
    micTesting.makeAudioEmpty();
    const test = this[curr].prev;
    if (test) {
      virtualclass.precheck.hide(`#preCheckcontainer .precheck.${curr}`);
      virtualclass.precheck.display(`#preCheckcontainer .precheck.${test}`);
  
      document.querySelector(`#preCheckcontainer  #preCheckProgress .${curr}`).classList.remove('active', 'current');
      document.querySelector(`#preCheckcontainer  #preCheckProgress .${test}`).classList.add('current');
  
      if (test === 'speaker') {
        this[test]._play(); // play the audio while previous button is clicked
      } else if (test === 'mic') {
        // micTesting.playAudio = true;
        // this[test].audioOperation();
        this[test].perform();
      } else if (test === 'webcam') {
        // virtualclass.precheck.webcam.initHandler();
        this[test].perform();
      }
  
      if (typeof cb !== 'undefined') {
        cb();
      }
    }
  },

  display(selector) {
    document.querySelector(selector).style.display = 'block';
  },

  hide(selector) {
    document.querySelector(selector).style.display = 'none';
  },

  createMessage(selector, msg, msgType) {
    const divErr = document.createElement('div');
    divErr.className = msgType;
    divErr.innerHTML = msg;
    document.querySelector(selector).appendChild(divErr);
  },

  removeAllListener() {
    for (let i = 0; i < this.handlers.length; i++) {
      document.querySelector(this.handlers[i].id).removeEventListener('click', this.handlers[i].handler);
    }
    this.handlers = [];
  },


  // triggerInitHandler(currSec, cb) {
  triggerInitHandler(currElement) {
   
    const currSec = currElement.closest('.precheck').dataset.currpreq;
    // const currSec = this[currentPreq].next;

    if (currElement.classList.contains('next')) {
      virtualclass.precheck._next(currSec);
      // console.log('Trigger handle Next');
    } else if (currElement.classList.contains('prev')) {
      virtualclass.precheck._prev(currSec);
      // console.log('Trigger handle previous');
    }
    if (this[currSec].next === 'mic') {
      this.speaker.pause();
    }
  },

  browser: {
    curr: 'browser',
    next: 'bandwidth',

    perform() {
      console.log('current status browser ');
      const preCheck = '#preCheckcontainer .precheck';

      virtualclass.precheck.display(`${preCheck}.${this.curr}`);
      const msgSelector = `${preCheck} .result`;

      if (virtualclass.error.length > 0) {
        const errorMsg = (virtualclass.error.length > 1) ? (virtualclass.error.join('<br />')) : virtualclass.error[0];
        virtualclass.precheck.createMessage(msgSelector, errorMsg, 'error');
      }
      if (!virtualclass.system.mybrowser.notSuppport) {
        const msg = virtualclass.lang.getString('congreainchrome');
        virtualclass.precheck.createMessage(msgSelector, msg, 'information');
      }

    },
  },

  bandwidth: {
    prev: 'browser',
    curr: 'bandwidth',
    next: 'speaker',
    perform() {
      console.log('current status bandwidth ');
      const preCheck = '#preCheckcontainer .precheck';
      virtualclass.precheck.display(`#preCheckcontainer .precheck.${this.curr}`);


      /** Inspired from, http://stackoverflow.com/questions/5529718/how-to-detect-internet-speed-in-javascript * */

      const msgSelector = `#preCheckcontainer .precheck.${this.curr} .result`;
      this.imageAddr = 'https://dl.congrea.com/bandwidth.jpg';

      this.downloadSize = 1000000; // bytes

      this.measureConnectionSpeed((msg) => {
        document.querySelector(msgSelector).innerHTML = '';
        virtualclass.precheck.createMessage(msgSelector, msg, 'information');
      });

    },

    bandWidthInWords(speed) {
      // console.log(`bandwidth speed ${speed}`);
      let bandwidthText;
      if (speed > 600) {
        bandwidthText = 'high';
        virtualclass.videoHost.gObj.MYSPEED = 1;
      } else if (speed > 400) {
        bandwidthText = 'medium';
        virtualclass.videoHost.gObj.MYSPEED = 2;
      } else {
        virtualclass.videoHost.gObj.MYSPEED = 3;
        bandwidthText = 'low';
      }
      ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
      return bandwidthText;
    },

    measureConnectionSpeed(cb) {
      const bandWidthImage = new Image();
      bandWidthImage.onload = () => {
        this.endTime = (new Date()).getTime();
        const speedKbps = this.calculateSpeed();
        cb(virtualclass.lang.getString(`${this.bandWidthInWords(speedKbps)}BandWidthSpeed`));
      };

      bandWidthImage.onerror = function (err, msg) {
        cb(virtualclass.lang.getString('bandwitdhImageNotFound'));
      };

      this.startTime = (new Date()).getTime();
      const cacheBuster = `?nnn=${this.startTime}`; // everytime the page is refrsh, the browser treat the image file as new file
      bandWidthImage.src = this.imageAddr + cacheBuster;
    },

    calculateSpeed() {
      const duration = (this.endTime - this.startTime) / 1000;
      const bitsLoaded = this.downloadSize * 8;
      const speedBps = (bitsLoaded / duration).toFixed(2);
      const speedKbps = (speedBps / 1024).toFixed(2);
      return Math.round(speedKbps);
    },
  },

  async startMedia (session) {
    this.stopMedia();
    if (virtualclass.adpt == null) virtualclass.adpt = new virtualclass.adapter();
    if (!virtualclass.precheck.cNavigator) virtualclass.precheck.cNavigator = virtualclass.adpt.init(navigator);
    try {
      console.log('===> start media before');
      virtualclass.precheck.mediaStream = await virtualclass.precheck.cNavigator.mediaDevices.getUserMedia(session);
      console.log('===> start media after');
    } catch(e) {
      virtualclass.media.handleUserMediaError(e);
      const [msg, wclassName] = virtualclass.precheck.webcam.currentStatus();
      const selectorId = `#preCheckcontainer .precheck.${virtualclass.precheck.webcam.curr}`;
      const existingContainer = document.querySelector(`${selectorId} .msg`);
      if (existingContainer !== null) {
        existingContainer.parentNode.removeChild(existingContainer);
      }
      virtualclass.precheck.webcam.displayMessage(selectorId, wclassName, msg);
      virtualclass.precheck.cameraStreamStatus = 0;
    }
    

    // virtualclass.precheck.cNavigator.mediaDevices.getUserMedia(session).then((stream) => {
    //   virtualclass.precheck.mediaStream = stream;
    // }).catch(function(e) {
    //   virtualclass.media.handleUserMediaError(e);
    //   const [msg, wclassName] = virtualclass.precheck.webcam.currentStatus();
    //   const selectorId = `#preCheckcontainer .precheck.${virtualclass.precheck.webcam.curr}`;
    //   const existingContainer = document.querySelector(`${selectorId} .msg`);
    //   if (existingContainer !== null) {
    //     existingContainer.parentNode.removeChild(existingContainer);
    //   }
    //   virtualclass.precheck.webcam.displayMessage(selectorId, wclassName, msg);
    //   virtualclass.precheck.cameraStreamStatus = 0;
    // });
  },

  speaker: {
    prev: 'bandwidth',
    curr: 'speaker',
    next: 'mic',
    perform() {
      const speakerLable = document.createElement('div');
      speakerLable.innerHTML = virtualclass.lang.getString('speakerTest');
      const selectorId = `#preCheckcontainer .precheck.${this.curr}`;
      document.querySelector(`${selectorId} .result`).appendChild(speakerLable);
      this._play();
    },

    _play() {
      const preCheck = '#preCheckcontainer .precheck';
      virtualclass.precheck.display(`#preCheckcontainer .precheck.${this.curr}`);

      const testAudio = document.getElementById('vcSpeakerCheckAudio');
      testAudio.loop = true;
      testAudio.play();
      this.playTestAudio = true;
      virtualclass.precheck.cancelAudioGraph();
    },

    pause () {
      const testAudio = document.getElementById('vcSpeakerCheckAudio');
      testAudio.pause();
      testAudio.currentTime = 0;
    }
  },


  mic: {
    prev: 'speaker',
    curr: 'mic',
    next: 'webcam',
    graphProcessor: null,
    graph: null,
    async perform() {
      console.log('current status mic ');
      const audioSettigns = virtualclass.media.sessionConstraints().session;
      audioSettigns.video = false;
      await virtualclass.precheck.startMedia(audioSettigns);
      micTesting.manipulateStreamFallback(virtualclass.precheck.mediaStream);

      let preCheck = '#preCheckcontainer .precheck';

      // virtualclass.precheck.updateProgressBar(this.curr);
      virtualclass.precheck.display(`${preCheck}.${this.curr}`);
      this.visualize();

      if (document.querySelector('#micTest') == null) {
        const micLable = document.createElement('div');
        micLable.id = 'micTest';
        // micLable.innerHTML = virtualclass.lang.getString('mictesting');

        const selectorId = `${preCheck}.${this.curr}`;
        document.querySelector(`${selectorId} .result`).appendChild(micLable);
      }

      if (virtualclass.system.mybrowser.name === 'safari' || virtualclass.system.mybrowser.name === 'iOS') {
        // Safari 11 or newer automatically suspends new AudioContext's that aren't
        // created in response to a user-gesture, like a click or tap, so create one
        // here (inc. the script processor)

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.graphContext = new AudioContext();
        this.graphProcessor = this.graphContext.createScriptProcessor(1024, 1, 1);
      }

      this.initAudioGraph();

      // this.graph.microphone.start();
    },

    initAudioGraph() {
      const micLable = document.getElementById('micTest');
      micLable.innerHTML = virtualclass.lang.getString('microphoneNotConnected');
      if (virtualclass.precheck.mediaStream) {
        const audioTrackStream = virtualclass.precheck.mediaStream.getAudioTracks();
        if (audioTrackStream.length > 0) {
          if (Object.prototype.hasOwnProperty.call(this, 'graph') && this.graph != null) {
            const waveElem = document.querySelector('#audioGraph wave');
            if (waveElem != null) {
              waveElem.parentNode.removeChild(waveElem);
            }
          }

          this.graph = WaveSurfer.create({
            container: '#audioGraph',
            waveColor: 'green',
            interact: false,
            cursorWidth: 0,
            audioContext: this.graphContext || null,
            audioScriptProcessor: this.graphProcessor || null,
            plugins: [WaveSurfer.microphone.create()],
            height: 20,
            maxCanvasWidth: 500,
          });

          this.graph.microphone.on('deviceReady', () => {
            console.info('Device ready!');
          });

          this.graph.microphone.on('deviceError', (code) => {
            console.warn(`Device error: ${code}`);
          });
          micLable.innerHTML = virtualclass.lang.getString('mictesting');
        }
      }
    },

    audioOperation() {
      micTesting.playAudio = true;
      /**
       * For safari, we need to get the new stream every time after
       * destroying the audio processor node
       */
      // virtualclass.precheck.cNavigator.mediaDevices.getUserMedia(
      // virtualclass.precheck.session).then(function (stream) {
      //     virtualclass.precheck.mediaStream = stream;
      //     micTesting.manipulateStreamFallback(virtualclass.precheck.mediaStream);
      // });

      this.visualize();
    },

    visualize() {
      // if (this.graph != null && this.graph != undefined) {
      // this.graph.microphone.start()
      // }
      
    },

  },


  webcam: {
    test: { 1: 'noWebCam', 2: 'nopermission', 3: 'webcambuys' },
    prev: 'mic',
    curr: 'webcam',

    currentStatus() {
      let msg ='';
      let wclassName;
      if (virtualclass.system.mediaDevices.hasWebcam) {
        if (virtualclass.system.mediaDevices.webcamErr.length > 0) {
          msg = virtualclass.system.mediaDevices.webcamErr[virtualclass.system.mediaDevices.webcamErr.length - 1];

          // We want descriptive message only in pre check section
          if (msg === 'PermissionDeniedError' || msg === 'SecurityError' || msg === 'nopermission') {
            msg += 'Ext';
            if (virtualclass.system.mybrowser.name === 'Firefox') {
              msg += 'FF';
            }
          }
          msg = virtualclass.lang.getString(msg);
          wclassName = `error`;
        } else if (virtualclass.precheck.cameraStreamStatus === 2) {
          wclassName = `error`;
          msg = virtualclass.lang.getString('nowebcamconnectedyet');
        } else {
          wclassName = `general`;
          msg = virtualclass.lang.getString('webcamerainfo');
        }
      } else {
        wclassName = `error`;
        msg = virtualclass.lang.getString('nowebcam');
      }
      return [msg, wclassName];
    },

    displayMessage(appendInto, wclassName, msg)  {
      let videoLable = document.querySelector(`${appendInto} .result .msg`);
      if (videoLable !== null) {
        videoLable.parentNode.removeChild(videoLable);
      }
      videoLable = document.createElement('div');
      videoLable.className = `msg ${wclassName}`;
      videoLable.innerHTML = msg;
      document.querySelector(`${appendInto} .result`).appendChild(videoLable);
    },

    async perform() {
      const videoSettings = virtualclass.media.sessionConstraints().session;
      videoSettings.audio = false;
      console.log('Start media 1 perform');
      const selectorId = `#preCheckcontainer .precheck.${this.curr}`;
      this.displayMessage(selectorId, '', 'Loading...');
      virtualclass.precheck.display(selectorId);
      const webcamTempVideoCon = document.querySelector('#webcamTempVideoCon');
      if (webcamTempVideoCon) webcamTempVideoCon.style.display = 'none';
      await virtualclass.precheck.startMedia(videoSettings);
     
      if (virtualclass.precheck.mediaStream) virtualclass.precheck.cameraStreamStatus = 1;
      const [msg, wclassName] = this.currentStatus();
      this.displayMessage(selectorId, wclassName, msg);
      if (webcamTempVideoCon) webcamTempVideoCon.style.display = 'block';
      // virtualclass.precheck.updateProgressBar(this.curr);
     
      if (wclassName.indexOf('error') > -1) {
        document.getElementById('webcamTempVideo').className = 'novideo';
      } else {
        this.createVideo();
      }
      this.initHandler();
    },

    initHandler() {
      const preCheck = '#preCheckcontainer .precheck';
      
      const joinSession = document.querySelector('#joinSession .next');
      if (joinSession != null) {
        joinSession.removeEventListener('click', this.joinSession.bind(this));
        joinSession.addEventListener('click', this.joinSession.bind(this));
      } else {
        const precheck = document.querySelector('#joinSession .precheckComplete');
        if (precheck != null && !this.alreladyAttachedPrecheck) {
          this.alreladyAttachedPrecheck  = true;
          precheck.removeEventListener('click', this.initHidePrecheck.bind(this));
          precheck.addEventListener('click', this.initHidePrecheck.bind(this));
        }
      }
    },

    initHidePrecheck() {
      console.log('SUMAN HIDE PRECHECK');
      const virtualclassPreCheck = document.getElementById('preCheckcontainer');
      virtualclassPreCheck.style.display = 'none';

      const virtualclassApp = document.getElementById('virtualclassApp');
      virtualclassApp.style.display = 'flex';
      // localStorage.setItem('precheck', true);
      virtualclass.videoHost._resetPrecheck();
      virtualclass.precheck.afterComplete();
      // virtualclass.stickybarWidth();
      // virtualclass.chatBarTabWidth();
    },

    joinSession() {
      virtualclass.popup.waitMsg();
      virtualclass.makeReadySocket();

      const virtualclassPreCheck = document.getElementById('preCheckcontainer');
      virtualclassPreCheck.style.display = 'none';

      const virtualclassApp = document.getElementById('virtualclassApp');
      virtualclassApp.style.display = 'flex';
      localStorage.setItem('precheck', true);

      virtualclass.videoHost.afterSessionJoin();
      virtualclass.precheck.afterComplete();
    },

    createVideo() {
      if (virtualclass.system.mediaDevices.hasWebcam && typeof virtualclass.precheck.mediaStream !== 'undefined') {
        const tempVideo = document.getElementById('webcamTempVideo');
        if (virtualclass.system.device === 'mobTab') {
          tempVideo.width = 320;
          tempVideo.height = 100;
        } else {
          tempVideo.width = 320;
          tempVideo.height = 240;
        }

        virtualclass.adpt.attachMediaStream(tempVideo, virtualclass.precheck.mediaStream);
        tempVideo.muted = true;
        tempVideo.play();
      }
    },
  },

  startSession() {
    const virtualclassApp = document.getElementById('virtualclassApp');
    virtualclassApp.style.display = 'flex';

    const virtualclassPreCheck = document.getElementById('virtualclassPreCheck');

    if (virtualclassPreCheck != null) {
      virtualclassPreCheck.parentNode.removeChild(virtualclassPreCheck);
    }
  },

  updateProgressBar(screen) {
    const currElement = document.querySelector(`#progressbarScreen .${screen}`);
    const allTestsLists = document.querySelectorAll('#preCheckProgress .progressbar li');

    for (let i = 0; i < allTestsLists.length; i++) {
      allTestsLists[i].classList.add('active');

      if (allTestsLists[i].classList.contains(screen)) {
        if (i > 0) {
          allTestsLists[i - 1].classList.remove('current');
        }

        allTestsLists[i].classList.add('current');
        break;
      }
    }
  },

  async afterComplete(notRequiredStream) {
    virtualclass.videoHost._resetPrecheck();
    micTesting.destroyAudioNode();
    virtualclass.precheck.removeAllListener();
    if (typeof workletAudioSend !== 'undefined') {
      workletAudioSend.disconnect();
    } else if (virtualclass.gObj.audioPlayerNode != null) {
      virtualclass.gObj.audioPlayerNode.disconnect(virtualclass.media.audio.Html5Audio.audioContext.destination);
      virtualclass.gObj.audioPlayerNode = null;
    }

    if (typeof virtualclass.media.audioCreatorNode !== 'undefined' && virtualclass.media.audioCreatorNode != null) {
      virtualclass.media.audioCreatorNode.disconnect(virtualclass.media.audio.Html5Audio.audioContext.destination);
      virtualclass.media.audioCreatorNode = null;
    }

    virtualclass.media.audio.closeContext();

    // console.log('Fetching media stream');
    const videoAction = this.videoAction ? 'on' : 'off';
    if (!notRequiredStream) await virtualclass.gesture.triggerAttachHandler(); // todo, remove await
    virtualclass.vutil.videoHandler(videoAction, 'notSendStatus');
    virtualclass.media.audio.initAudiocontext();
    virtualclass.precheck.speaker.playTestAudio = false;
    virtualclass.media.audio.studentNotSpeak();
    virtualclass.precheck.donePrecheck = false;
  
    if (virtualclass.media.detectAudioWorklet()) {
      virtualclass.media.audio.initPlay(); // ready worklet for playing audio 
    } else {
      virtualclass.media.audio.initPlayWithFallback(); // ready worklet for playing audio 
    }
    if (workerAudioSend != null) {
      workerAudioSend.postMessage({ cmd: 'precheck', msg: { precheck: virtualclass.precheck.donePrecheck } });
    }
    this.stopMedia();
  },

  stopMedia() {
    if (virtualclass.precheck.mediaStream) {
      console.log('====> STOP precheck');
      const tracks = virtualclass.precheck.mediaStream.getTracks(); // if only one media track
      tracks.forEach((track) => { track.stop(); });
    }
  }
};