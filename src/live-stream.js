// This file is responsible to display presenter's live video to other participantes
class LiveStream {
  constructor() {
    this.mimeType = 'video/webm;codecs=vp8,opus';
    this.queue = [];
    this.MAX_TIME = 999999999999;
    this.startedStream = false;
    this.uploadEndPoint = 'https://stream.congrea.net';
    this.fileList = new OrderedList(); // Contain the urls of stream
    this.streamQueue = [];
    this.sendFiles = [];
    this.bufferLength = 2;
    this.listStream = {};
    this.sharing = false;
    this.playByOgv = false;
    this.iOS = false;
    this.resoluation = {
      qga: { width: { ideal: 320 }, height: { ideal: 240 } },

      vga: { width: { ideal: 640 }, height: { ideal: 480 } },

      vga2: { width: { ideal: 800 }, height: { ideal: 600 } },

      vga3: { width: { ideal: 960 }, height: { ideal: 720 } },

      vga4: { width: { ideal: 1024 }, height: { ideal: 768 } },

      hd: { width: { ideal: 1280 }, height: { ideal: 720 } },

      fullhd: { width: { ideal: 1920 }, height: { ideal: 1080 } },

      fourk: { width: { ideal: 4096 }, height: { ideal: 2160 } },

      eightk: { width: { ideal: 7680 }, height: { ideal: 4320 } }
    };

    this.xhr = axios.create({ responseType: 'arraybuffer', withCredentials: true });
    this.constraints = {
      audio: { echoCancellation: { exact: true } },
      video: this.resoluation.fullhd,
    };
    this.constraints.video.frameRate = { ideal: 15 };
  }

  init() {
    setTimeout(() => {
      const roomConnecting = document.querySelector('#networkStatusContainer.connecting-room');
      if (!roomConnecting) {
        const startLiveStream = document.getElementById('startLiveStream');
        if (startLiveStream != null) startLiveStream.classList.remove('disabled');
      }
    }, 1500);

    if (!this.alreadyInit) {
      if (virtualclass.isPlayMode) {
        this.prefixUrl = `${this.uploadEndPoint}/${wbUser.lkey}/${wbUser.room}/${wbUser.session}`;
        // console.log('Prefix url recording', this.prefixUrl);
      } else if (localStorage.mySession != null) {
        this.prefixUrl = `${this.uploadEndPoint}/${wbUser.lkey}/${wbUser.room}/${localStorage.mySession}`;
        // console.log('Prefix url localstorage', this.prefixUrl);
      } else if (virtualclass.gObj.currentSession) {
        this.prefixUrl = `${this.uploadEndPoint}/${wbUser.lkey}/${wbUser.room}/${virtualclass.gObj.currentSession}`;
      }

      if (!this.prefixUrl) {
        setTimeout(() => {
          // console.log('Prefix was not found', this.prefixUrl);
          this.init();
        }, 1500);
        return;
      }

      if (roles.hasControls()) {
        // console.log('==> attach click event ');
        const startSharingElement = document.getElementById('startLiveStream');
        startSharingElement.addEventListener('click', this.handlLiveStream.bind(this));
      }

      this.alreadyInit = true;
      const virtualclassCont = document.getElementById('virtualclassCont');
      if (virtualclassCont != null) {
        virtualclassCont.classList.add('ogvPlayer');
      }
    }

    if (virtualclass.system.mybrowser.name === 'Safari') {
      this.playByOgv = true;
    }

    if (this.playByOgv && !this.isScriptAlreadyIncluded('/virtualclass/build/ogv/ogv.js')) {
      virtualclass.vutil.loadFile('/virtualclass/build/ogv/ogv.js', 'js');
    }
  }

  requestStream(url) {
    if (!url) return;
    // console.log('====> live stream request url');
    this.xhr.get(url).then(async (response) => {
      // console.log('====> live stream got response ', url);
      this.afterReceivedStream(response);
    }).catch((error) => {
      console.log('ERROR:- REQUEST URL ', error);
    });
  }

  getFileName(url) {
    const lastslashindex = url.lastIndexOf('/');
    return url.substring(lastslashindex  + 1).replace(".chvs","");
  }

  duringPlayFirstPacket() {
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    if (virtualclassVideo)  virtualclassVideo.dataset.currapp = 'liveStream';
    const messageCont = document.getElementById('messageLayoutVideo');
    if (messageCont) messageCont.style.display = 'none';
  }

  afterReceivedStream(response) {
    // console.log('play start data received');
    const finalData = response.data.slice(4, response.data.length);
    const fileName = this.getFileName(response.config.url);
    this.listStream[fileName] = finalData;
    // console.log('request url, stream receive init data ', fileName);

    // console.log('reponse receive at very start, Play start 0 ', fileName);
    this.playIfReady(fileName);
    // console.log('====> response received for file ', fileName);
  }

  onBuffer(buffer) {
    if (this.sourceBuffer) {
      // const mydata = new Uint8Array(buffer);
      // console.log('play start first four ', mydata[0], mydata[1], mydata[2], mydata[3])
      this.sourceBuffer.appendBuffer(buffer);
    }
  }

  readyParticipateVideo() {
    if (!this.remoteVideo) {
      this.remoteVideo = document.getElementById('liveStream');
      this.remoteVideo.srcObject = null;
      this.remoteVideo.currentTime = 0;
    }
  }

  initPLayerForParticipaes() {
    // console.log('current mode LIVE STREAM');
    if (typeof MediaSource != 'undefined') {
      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', this.mediaSourceOpen.bind(this));
      this.readyParticipateVideo();
      this.remoteVideo.src = URL.createObjectURL(this.mediaSource);
    }
  }

  mediaSourceOpen() {
    // console.log('step 1');
    if (this.mediaSource.readyState === 'open') {
      this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);
      this.sourceBuffer.addEventListener('error', (e) => { console.log(e); });
      this.sourceBuffer.addEventListener('updateend', () => {
        // virtualclass.liveStream.appendStarted = true;
        // console.log('====> appended start: remove 2');
        const next = this.fileList.getNextByID(virtualclass.liveStream.currentExecuted);
        // console.log(' ===> actual PLAY START 2');
        if (next) this.playIfReady(next.id);
      });
    }
  }

  handlLiveStream(element) {  
    if (element.currentTarget.dataset.sharinglivestream === '0' ) {
      this.startToShare();
    } else {
      this.stop();
      // Open video dashboard
      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null) {
        dashboardnav.click();
      }
    }
  }

  disableLiveStreamButton() {
    const streamElement = document.getElementById('startLiveStream');
    if (streamElement != null) streamElement.classList.add('disabled');
  }

  async startToShare() {
    this.stopTraditionalVideo();
    const startLiveStream = document.getElementById('startLiveStream')
    startLiveStream.dataset.sharinglivestream = '1';
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    } catch (error) {
      this.disableLiveStreamButton();
      virtualclass.media.handleUserMediaError(error);
    }
    if (stream) this.handleSuccess(stream);
  }

  handleSuccess(stream) {
    const videoTrack = stream.getVideoTracks()[0];
    const streamSettings = videoTrack.getSettings();
    console.dir('====> camera settings ', streamSettings);

    const videoConstraints = videoTrack.getSettings();
    console.log('Video constraints: media settings:', JSON.stringify(videoConstraints));

    const audioTrack = stream.getAudioTracks()[0];
    const audioConstraints = audioTrack.getSettings();
    console.log('Audio constraints: media settings: ', JSON.stringify(audioConstraints));

    this.stream = stream;
    virtualclass.dashboard.close();
    this.showLiveStreamHTML();
    const liveSreamVideoTag = document.getElementById('liveStream');
    liveSreamVideoTag.srcObject = this.stream;
    this.startRecorder(streamSettings.width);
  }

  // 320 * 240  => 100kbps
  // 640 * 480 => 200kb
  startRecorder(videoWidth) {
    let videoBitsPerSecond = 250000; // 250kbs
    if (videoWidth > 640 && videoWidth <= 1920) {
      videoBitsPerSecond = 500000; // 500kbs
    } else if (videoWidth > 1920) { // high quality video
      videoBitsPerSecond = 1000000; // 1 Mbs
    }
    console.log('current mode LIVE STREAM');
    console.log('video bit per second ', videoBitsPerSecond);
    if (!MediaRecorder.isTypeSupported(this.mimeType)) console.error(`${this.mimeType} is not supported`);
    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: this.mimeType, videoBitsPerSecond }); // 250kbps
    this.mediaRecorder.addEventListener('stop', this.stopHandler.bind(this))
    this.mediaRecorder.addEventListener('dataavailable', this.handleLiveStreamData.bind(this))
    this.mediaRecorder.start(2000);
  }

  stopHandler() {
    console.log('====STOP 1');
  }

  handleLiveStreamData(event) {
    console.log('====> triggering data ');
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') this.saveToStreamServer(event.data);
  }

  async saveToStreamServer(blob) {
    const data = await this.videoTypedArray(blob);
    ioAdapter.sendStream(data);
  }

  async videoTypedArray(blob) {
    let ab = await blob.arrayBuffer();
    let a = new Uint8Array(ab);
    
    let b = new (a.constructor)(2);
    b[0] = 72;
    b[1] = 78;
    let c = new (a.constructor)(a.length + b.length);
    c.set(b, 0);
    c.set(a, b.length);
    return c;
  }

  stop() {
    const startLiveStream = document.getElementById('startLiveStream')
    startLiveStream.dataset.sharinglivestream = '0';
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.hideLiveStreamHTML();

    this.disableLiveStreamButton();  
    if (roles.hasControls()) {
      ioAdapter.mustSend({
        cf: 'liveStream',
        stop: true,
      });
      this.clearEveryThing();
    }

    setTimeout(() => {
      const streamElement = document.getElementById('startLiveStream');
      if (streamElement != null) streamElement.classList.remove('disabled');
    }, 5000);
  }

  stopTraditionalVideo() {
    if (Object.prototype.hasOwnProperty.call(virtualclass, 'videoUl')
      && Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'player')) {
      virtualclass.videoUl.destroyPlayer();
    }
    const videoPlayerCont = document.getElementById('videoPlayerCont');
    if (videoPlayerCont) videoPlayerCont.style.display = 'none';
    if (roles.hasControls()) ioAdapter.mustSend({ cf: 'liveStream', stopVideo: true }); 
  }

  clearEveryThing() {
    console.log('Removed live stream')
    // Stop getting stream from camera
    delete virtualclass.gObj.videoMode;
    console.log('delete normal video');
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    if (virtualclassVideo != null) {
      virtualclassVideo.dataset.currapp = 'normalVideo';
      const messageCont = document.getElementById('messageLayoutVideo');
      if (messageCont) messageCont.style.display = 'block';
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => { track.stop(); });
    }

    if (this.mediaRecorder) delete this.mediaRecorder;

    if (this.sourceBuffer) {
      if (this.sourceBuffer.updating) {
        this.sourceBuffer.abort();
        console.log('Source buffer abort');
      } else {
        try {
          this.sourceBuffer.remove(0, 300); // throws error when immediate calling after appendBuffer
        } catch (e) {
          this.sourceBuffer.abort();
        }
        console.log('====> appended start: remove 3');
        console.log('Source buffer remove');
      }

      // virtualclass.LiveStream.sourceBuffer.abort();
      delete this.sourceBuffer;
      delete this.mediaSource;
      delete this.startReadyFile;
    }

    this.startedStream = false;
    const liveStreamVideo = document.getElementById('liveStream');
    if (liveStreamVideo != null) liveStreamVideo.src = null;
    delete this.firstFile;
    console.log('====> Empty the list 2a');
    delete this.startingPoint;
    delete this.startedAppending;
    this.fileList.emptyList();
    delete this.lastFileRequested;
    delete virtualclass.liveStream.callFromSeek;
    delete this.startFromPageRefresh;
    delete this.currentExecuted;
    // delete this.appendStarted;
    console.log('====> appended start: remove 1');

    if (this.playByOgv) {
      this.destroyOGVPlayer();
    }

    if (roles.hasControls() && virtualclass.media.audio.isProcessError) {
      virtualclass.precheck.afterComplete(true); // Passing true means dosen't require to get stream again
      delete virtualclass.media.audio.isProcessError;
    }
  }

  showLiveStreamHTML() {
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    virtualclassVideo.dataset.currapp = 'liveStream';
  }

  hideLiveStreamHTML() {
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    virtualclassVideo.dataset.currapp = 'normalVideo';
  }

  isLiveStreamMode() {
    const virtualclassVideo = document.getElementById('virtualclassVideo').dataset.currapp;
    return (virtualclassVideo === 'liveStream');
  }

  onMessage(e) {
    if (e.message.fileName) {
      // console.log('Received file from server ', e.message.fileName);
      setTimeout(() => {
        if (virtualclass.currApp === 'Video' && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          // console.log('====> send file ', e.message.fileName);
          ioAdapter.mustSend({
            cf: 'liveStream',
            url: e.message.fileName,
          });
        }
      }, 3000);
    } else if (e.message.stop) {
      this.clearEveryThing();
    } else if (e.message.stopVideo) { 
      this.stopTraditionalVideo();
    } else if (e.message.url && virtualclass.currApp === 'Video') {
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'videoMode')) return;
      if (roles.isStudent()) {
        // console.log('====> Empty the list 2');
        if (!this.firstFile) {
          this.firstFile = e.message.url;
          console.log('This is first file ', this.firstFile);
        }

        this.lastFileRequested = e.message.url;
        // console.log('Last file request ', this.lastFileRequested);
        this.fileList.insert(e.message.url, `${this.prefixUrl}/${e.message.url}.chvs`);
        // console.log('====> insert list suman ', e.message.url);
        if (!this.startingPoint && this.fileList.ol.order.length >= this.bufferLength) {
          this.readyStartingPoint();
        }

        if (this.insertTime) {
          clearTimeout(this.insertTime);
          this.pageRefresh = true;
        }

        this.insertTime = setTimeout(() => {
          if (this.pageRefresh) {
            if (this.fileList.ol.order.length <= 5) { // Play from first file
              const firstFile = this.fileList.ol.order[0];
              this.triggerStart(firstFile);
              // console.log('live stream, start from first ', this.fileList.ol.order.length);
            } else if (!this.startFromPageRefresh) {
              this.startFromPageRefresh = true; // Play start fromw when page refresh
              if (!virtualclass.liveStream.callFromSeek) {
                this.requestInitializePacket();
              }
              // console.log('live stream, start from latest', this.fileList.ol.order.length);
            }
          } else {
            this.triggerStart(e.message.url); // normal case
          }
          // console.log('page refresh remove');
          this.pageRefresh = false;
          this.insertTime = false;
          // console.log('live video suman 1');
        }, 100);
      }
    }
  }

  requestInitializePacket(file) {
    this.stopTraditionalVideo();
    this.initPLayerForParticipaes();
    if (!this.xhrInitPacket) {
      this.xhrInitPacket = axios.create({
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': wbUser.lkey,
          'x-congrea-authuser': wbUser.auth_user,
          'x-congrea-authpass': wbUser.auth_pass,
          'x-congrea-room': wbUser.room,
          get: { Accept: 'video/webm;codecs=vp8,opus' }
        },
      });
    }

    let currentSession;
    if (virtualclass.isPlayMode) {
      currentSession = wbUser.session;
    } else {
      currentSession = localStorage.mySession != null ? localStorage.mySession : virtualclass.gObj.currentSession;
    }

    let url;
    if (file) {
      url = `https://api.congrea.net/data/stream?session=${currentSession}&file=${file}`;
    } else {
      url = `https://api.congrea.net/data/stream?session=${currentSession}`;
    }

    // console.log('request url init packet ', url);
    this.requestInitializePacketFinal(url);
  }

  requestInitializePacketFinal(url) {
    this.latesRequetInitUrl = url;
    // console.log('request url live stream init data ', url);
    this.xhrInitPacket.get(url).then(async (response) => {
      if (this.latesRequetInitUrl === response.config.url) {
        this.currentFile = response.headers['x-congrea-seg'].split('.chvs')[0];
        // console.log('request url, stream receive init data ', this.currentFile, response.config.url.split('?')[1]);
        this.startedStream = true;
        this.listStream[this.currentFile] = response.data;
        this.firstFile = response.headers['x-congrea-seg'].split('.chvs')[0];
        // console.log('This is first file ', this.firstFile);
        delete this.startingPoint;
        // console.log('calculate starting point ', this.firstFile);
        this.readyStartingPoint();
      }
    }).catch((error) => {
      console.log('ERROR:- REQUEST STARTING PACKET ', error);
    });
  }

  triggerStart(fileName) {
    // console.log("In order 2");
    if (!this.startedStream) {
      // this.stopTraditionalVideo();
      this.initPLayerForParticipaes();
      this.requestStream(this.fileList.getCurrent(fileName));
      this.currentFile = fileName;
      this.startedStream = true;
    } else if (this.startedStream && this.fileList.ol.order.length > 0) {
      const nextItem = this.fileList.getNextByID(this.currentFile);
      this.requestStream(nextItem.data);
      this.currentFile = nextItem.id;
    }
  }

  isMyTurn(file) {
    const next = this.fileList.getNextByID(this.currentExecuted);
    console.log('is my turn curernt, next ', this.currentExecuted, next.id, file);
    return (next.id === file);
  }

  inStreamList(file) {
    if (this.listStream[file]) return this.listStream[file];
    return false;
  }

  readyStartingPoint() {
    let current = this.firstFile;
    const isFileinList = this.fileList.getCurrentPosition(current);
    if (isFileinList <= -1) {
      console.log('NOT FOUND ON LIST');
      return;
    }
    let next;
    if (this.bufferLength > 1) {
      for (let i = 1; i < this.bufferLength; i++) {
        next = this.fileList.getNextByID(current);
        if (next) current = next.id;
      }
      if (current !== this.firstFile) this.startingPoint = current;
    }
  }

  playIfReady(file) {
    if (this.playByOgv) {
      this.playIfReadyOGV(file);
    } else {
      this.playIfReadyNormal(file);
    }
  }

  playIfReadyNormal (file) {
    const buffer = this.inStreamList(file);
    if (this.startingPoint && file === this.startingPoint && this.inStreamList(this.firstFile)) {
      const firstBuffer = this.inStreamList(this.firstFile);
      try {
        this.onBuffer(firstBuffer);
        console.log('Actual append buffer ', this.firstFile);
        this.currentExecuted = this.firstFile;
        delete this.listStream[this.firstFile];
        this.startedAppending = true;
        this.duringPlayFirstPacket();
        if (this.startFromPageRefresh) {
          const refreshTime = virtualclass.isPlayMode ? 700 : 1600;
          setTimeout(() => { 
            document.getElementById('liveStream').currentTime = this.MAX_TIME; 
            console.log('REFRESH THE SCREEN');
          }, refreshTime);
        }
      } catch (error) {
        this.requestInitializePacket(file);
        console.log('====> Error handlling request packet');
      }
    } else if (this.startedAppending && this.isMyTurn(file) && buffer) {
      try {
        this.onBuffer(buffer);
        console.log('Actual append buffer ', file);
        delete this.listStream[file];
        this.currentExecuted = file;
      } catch (error) {
        this.requestInitializePacket(file);
        console.log('====> Error handlling request packet');
      }
    }
  }

  playIfReadyOGV() {
    if (!this.ogvPlayerReady && this.inStreamList(this.firstFile)
    && Object.keys(this.listStream).length > 1 && virtualclass.liveStream.fileList.ol.order.length > 1) {
      this.readyOGVInstance();
      this.ogvPlayerReady = true;
      const firstBuffer = this.inStreamList(this.firstFile);
      this.ogvPlayer._loadCodec(firstBuffer, (buf) => {virtualclass.liveStream.afterLoadedCodec(buf)});
    }
  }

  afterLoadedCodec(buf) {
    // console.log('Laxmi ogv play ', virtualclass.liveStream.firstFile);
    this.currentExecuted = this.firstFile;
    this.ogvPlayer._startProcessingVideo(buf);

    console.log('Current executed file input ', this.currentExecuted);
    delete this.listStream[this.firstFile];
    // console.log('====> DELETE LIVE STREAM FILE ', this.firstFile);
    this.startedAppending = true;
    this.duringPlayFirstPacket();

    if (this.ogvPlayerLoadedMedia) {
      clearInterval(this.ogvPlayerLoadedMedia);
    }

    this.ogvPlayerLoadedMedia = setInterval(() => {
      // todo, this has to be improved
      if (this.ogvPlayer && this.ogvPlayer._codec && this.ogvPlayer._codec.loadedAllMetadata) {
        clearInterval(this.ogvPlayerLoadedMedia);
        // iOS nees user's gesture
        if (virtualclass.system.mybrowser.iOS) {
          virtualclass.popup.infoMsg(virtualclass.lang.getString('continueToLiveStream'), () => {
            virtualclass.liveStream.ogvPlayer.play();
          });
        } else {
          this.ogvPlayer.play();
        }
      }
    }, 500);
  }

  destroyOGVPlayer() {
    if (this.ogvPlayer) {
      this.ogvPlayer._stopPlayback();
      this.ogvPlayer.stop();
    }

    delete this.ogvPlayer;
    delete virtualclass.liveStream.listStream;
    virtualclass.liveStream.listStream = {};

    // this.ogvPlayer.stop();
    delete this.ogvPlayerReady;
    const ogvVideoContainer = document.getElementById('ogvVideoContainer');
    if (ogvVideoContainer != null) {
      ogvVideoContainer.parentNode.removeChild(ogvVideoContainer);
    }
  }

  readyOGVInstance() {
    const playerOptions = { forceWebGL: true, debug: false };
    this.ogvPlayer = new OGVPlayer(playerOptions);
    const container = document.createElement('div');
    container.id = 'ogvVideoContainer';
    container.appendChild(this.ogvPlayer);
    document.getElementById('liveStreamCont').appendChild(container);
  }

  getChunkForOgvPlayer() {
    const nextFile = this.fileList.getNextByID(this.currentExecuted);
    if (nextFile) {
      virtualclass.liveStream.tempFile = nextFile.id;
      const stream = this.inStreamList(nextFile.id);
      return stream;
    }

    // console.log('suman ogv total file execute play not');
    return false;
  }

  isScriptAlreadyIncluded(src){
    var scripts = document.getElementsByTagName("script");
    for(var i = 0; i < scripts.length; i++) 
       if(scripts[i].getAttribute('src') == src) return true;
    return false;
  }
}
