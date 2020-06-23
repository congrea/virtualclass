 /**
 * This file is responsible for display teacher/presenter live video to other participantes
 */
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
    

    // this.prefixUrl = `https://stream.congrea.net/${wbUser.lkey}/${wbUser.room}/${virtualclass.gObj.currentSession}`;
    this.xhr = axios.create({
      responseType: 'arraybuffer',
      withCredentials: true,
    }),
    
    this.constraints = {
      audio: {
        echoCancellation: {exact: true}
      },

      video: {
        width: { ideal: 460 },
        height: { ideal: 400 }
      }
    };
  }
  
  init() {
    if (!this.alreadyInit) {
      if (localStorage.mySession != null) {
        this.prefixUrl = `${this.uploadEndPoint}/${wbUser.lkey}/${wbUser.room}/${localStorage.mySession}`;
      } else {
        this.prefixUrl = `${this.uploadEndPoint}/${wbUser.lkey}/${wbUser.room}/${virtualclass.gObj.currentSession}`;
      }
      
      if (roles.hasControls()) {
        console.log('==> attach click event ');
        const startSharingElement = document.getElementById('startLiveStream');
        startSharingElement.addEventListener('click', this.handlLiveStream.bind(this));
      }
      this.alreadyInit = true;
    }
  }

  requestStream(url) {
    if (!url || url == undefined) {
      console.log("Invalid URL"); return;
    }
    console.log('====> remain queue length ', this.fileList.ol.order.length);
    console.log('request url ', url);
    this.xhr.get(url)
    .then(async (response) => {
      this.afterReceivedStream(response);
    })
  }
  
  getFileName (url) {
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
    console.log('play start data received');
    const finalData = response.data.slice(4, response.data.length);
    const fileName = this.getFileName(response.config.url);
    this.listStream[fileName] = finalData;
    console.log('reponse receive at very start, Play start 0 ', fileName);
    this.playIfReady(fileName);
    console.log('====> response received for file ', fileName);
  }

  onBuffer (buffer) {
    if (this.sourceBuffer) {
      const mydata = new Uint8Array(buffer);
      console.log('play start first four ', mydata[0], mydata[1], mydata[2], mydata[3])
      console.log('Append buffer actual');
      this.sourceBuffer.appendBuffer(buffer);
    }
  }

  readyParticipateVideo() {
    if (!this.remoteVideo) {
      this.remoteVideo = document.getElementById('liveStream');
      this.remoteVideo.srcObject = null;
      this.remoteVideo.currentTime = 0
    }
  }

  initPLayerForParticipaes() {
    console.log('current mode LIVE STREAM');
    this.mediaSource = new MediaSource();
    this.mediaSource.addEventListener('sourceopen', this.mediaSourceOpen.bind(this));
    this.readyParticipateVideo();
    this.remoteVideo.src = URL.createObjectURL(this.mediaSource);
  }

  mediaSourceOpen() {
    console.log('step 1');
    this.sourceBuffer = this.mediaSource.addSourceBuffer(this.mimeType);
    this.sourceBuffer.addEventListener('error', function (e) {})
    this.sourceBuffer.addEventListener('updateend', function () {
      console.log('append buffer ended');
      const next =  virtualclass.liveStream.fileList.getNextByID(virtualclass.liveStream.currentExecuted);
      console.log(' ===> actual PLAY START 2');
      if (next)  virtualclass.liveStream.playIfReady(next.id);
    });
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

  async startToShare() {
    this.stopTraditionalVideo();
    var startLiveStream = startLiveStream = document.getElementById('startLiveStream')
    startLiveStream.dataset.sharinglivestream = '1';
    const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
    this.handleSuccess(stream);
  }

  handleSuccess (stream){
    console.log('getUserMedia() got stream:', stream);
    this.stream = stream;
    virtualclass.dashboard.close();
    this.showLiveStreamHTML();
    const liveSreamVideoTag = document.getElementById('liveStream');
    liveSreamVideoTag.srcObject = this.stream;
    this.startRecorder();
  }

  startRecorder () {
    console.log('current mode LIVE STREAM');
    if (!MediaRecorder.isTypeSupported(this.mimeType)) console.error(`${this.mimeType} is not supported`);
    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: this.mimeType});
    this.mediaRecorder.addEventListener('stop', this.stopHandler.bind(this))
    this.mediaRecorder.addEventListener('dataavailable', this.handleLiveStreamData.bind(this))
    this.mediaRecorder.start(1500);
  }

  stopHandler() {
    console.log("====STOP 1");
  }

  handleLiveStreamData(event) {
    console.log('====> triggering data ');
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') this.saveToStreamServer(event.data);
  }

  async saveToStreamServer(blob){
    let data = await this.videoTypedArray(blob);
    ioAdapter.sendStream(data);
  }

  async videoTypedArray(blob){
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
    var startLiveStream = startLiveStream = document.getElementById('startLiveStream')
    startLiveStream.dataset.sharinglivestream = '0';
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }

    this.hideLiveStreamHTML();
    let stopTriggerTime = 0;
    
    const streamElement = document.getElementById('startLiveStream');
    if (streamElement != null) streamElement.classList.add('disabled');
    if (roles.hasControls()) {
      ioAdapter.mustSend({
       cf: 'liveStream',
       stop: true,
     });
     this.clearEveryThing();
   }

    setTimeout(() => {
      streamElement.classList.remove('disabled');
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
      this.stream.getTracks().forEach(function(track) { track.stop(); });
    }

    if (this.mediaRecorder) delete this.mediaRecorder;

    if (this.sourceBuffer) {
      if (this.sourceBuffer.updating) {
        this.sourceBuffer.abort();
        console.log('Source buffer abort');
      } else {
        this.sourceBuffer.remove(0, 300);
        console.log('Source buffer remove');
      }
      
    // virtualclass.LiveStream.sourceBuffer.abort();
      delete this.sourceBuffer;
      delete this.mediaSource;
    }
    this.startedStream = false;
    const liveStreamVideo = document.getElementById('liveStream');
    if (liveStreamVideo != null) liveStreamVideo.src = null;
    delete this.firstFile;
    console.log('====> Empty the list 2a');
    delete this.startingPoint;
    delete this.startedAppending;
    this.fileList.emptyList();
  }

  showLiveStreamHTML () {
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    virtualclassVideo.dataset.currapp = 'liveStream';
    document.getElementById('startLiveStream').innerHTML = virtualclass.lang.getString('stopLiveSharing');
  }

  hideLiveStreamHTML() {
    const virtualclassVideo = document.getElementById('virtualclassVideo');
    virtualclassVideo.dataset.currapp = 'normalVideo';
    document.getElementById('startLiveStream').innerHTML = virtualclass.lang.getString('startLiveSharing');
  }

  isLiveStreamMode() {
    const virtualclassVideo = document.getElementById('virtualclassVideo').dataset.currapp;
    return (virtualclassVideo === 'liveStream');
  }

  onMessage(e) {
    if (e.message.fileName) {
      console.log('Received file from server ', e.message.fileName);
      setTimeout(() => {
        if (virtualclass.currApp === 'Video' && this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          console.log('====> send file ', e.message.fileName);
          ioAdapter.mustSend({
            cf: 'liveStream',
            url: e.message.fileName
          }); 
        }
      }, 3000);
    } else if (e.message.stop) {
      this.clearEveryThing();
    } else if (e.message.stopVideo) { 
      this.stopTraditionalVideo();
    } else if (e.message.url && virtualclass.currApp === 'Video') {
      if (virtualclass.gObj.hasOwnProperty('videoMode')) return;
      if (roles.isStudent()) {
        console.log('====> Empty the list 2');
        if (!this.firstFile) this.firstFile = e.message.url;
    
        console.log('=====> received from socket');
        this.fileList.insert(e.message.url, `${this.prefixUrl}/${e.message.url}.chvs`);
        
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
              console.log('live stream, start from first ', this.fileList.ol.order.length);
            } else {
              this.startFromPageRefresh = true; // Play start fromw when page refresh
              this.requestInitializePacket();
              console.log('live stream, start from latest', this.fileList.ol.order.length);
            }
          } else {
            this.triggerStart(e.message.url); // normal case
          }
          console.log('page refresh remove');
          this.pageRefresh = false;
          this.insertTime = false;
          console.log('live video suman 1');
        }, 100);
        console.log('====> live stream receive file ', e.message.url, ' queue length ', this.fileList.ol.order.length);
      } else {
        if (this.playTime) clearTimeout(this.playTime); 
        this.playTime = setTimeout(() => {
          if (!virtualclass.gObj.hasOwnProperty('videoMode')) {
            const startSharingElement = document.getElementById('startLiveStream');
            startSharingElement.click();
          }
        }, 1000);
      }
    }
  }

  requestInitializePacket() {
    if (this.xhrInitPacket) return; // todo, remove this;
    this.stopTraditionalVideo();
    this.initPLayerForParticipaes();
    this.xhrInitPacket = axios.create({
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': wbUser.lkey,
        'x-congrea-authuser': wbUser.auth_user,
        'x-congrea-authpass': wbUser.auth_pass,
        'x-congrea-room': wbUser.room,
        get: {
          'Accept': 'video/webm;codecs=vp8,opus',
        }
      },
    });

    const currentSession = localStorage.mySession != null ? localStorage.mySession : virtualclass.gObj.currentSession;  
    const url  = `https://api.congrea.net/data/stream?session=${currentSession}`;
    console.log('request url init packet ', url);
    this.xhrInitPacket.get(url)
    .then(async (response) => {
      this.currentFile = response.headers['x-congrea-seg'].split('.chvs')[0];
      console.log('request url live stream receive init data ', this.currentFile);
      
      this.startedStream = true;
      this.listStream[this.currentFile] = response.data;
      this.firstFile = response.headers['x-congrea-seg'].split('.chvs')[0];
      delete this.startingPoint;
      console.log('calculate starting point');
      this.readyStartingPoint();
    })
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

  inStreamList (file) {
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
      if (current != this.firstFile) this.startingPoint = current;
    }
  }

  playIfReady(file) {
    const buffer = this.inStreamList(file);
    if (this.startingPoint && file === this.startingPoint && this.inStreamList(this.firstFile)) {
      const firstBuffer = this.inStreamList(this.firstFile);
      this.onBuffer(firstBuffer);
      delete this.listStream[this.firstFile];
      this.currentExecuted = this.firstFile;
      console.log(' ===> actual PLAY START 1', this.firstFile);
      this.startedAppending = true;
      this.duringPlayFirstPacket();
      if (this.startFromPageRefresh) {
        setTimeout(() => { document.getElementById('liveStream').currentTime = this.MAX_TIME; }, 1000);
      }
    } else  if (this.startedAppending && this.isMyTurn(file) && buffer) {
      this.onBuffer(buffer);
      delete this.listStream[file];
      this.currentExecuted = file;
      console.log(' ===> actual PLAY START 3', file);
    }
  }
}