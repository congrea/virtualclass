// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const TIME_TO_REQUEST = 3 * 60 * 1000; // every request would be performeed in given milisecond
  const RECORDING_TIME = 15 * 60 * 1000; // If elapsed time goes beyond the
  const PLAY_START_TIME = 3 * 60 * 1000;
  const recorder = {
    playTime: 150,
    tempPlayTime: 150,
    items: [],
    objn: 0,
    playTimeout: '',
    allFileFound: false,
    playTimePreviousSeconds: 0,
    waitServer: false,
    waitPopup: false,
    masterRecordings: [],
    alreadyAskForPlay: false,
    playStart: false,
    error: 0,
    currentMin: 0,
    // importfilepath: window.importfilepath,
    // exportfilepath: window.exportfilepath,
    uploadInProcess: false,
    totalRecordingFiles: [],
    totalPlayTimeInMin: 0,
    totalTimeInMiliSeconds: 0,
    subRecordings: null,
    attachSeekHandler: false,
    rawDataQueue: {},
    xhr: [],
    session: null,
    elapsedPlayTime: 0,
    prevFile: null,
    refrenceTime: null,
    totalElements: 0,
    lastFileTime: null,
    lastRecordings: 0,
    firstTimeRequest: true,
    alreadyRequested: {},
    binarySyncMsg: null,
    msg: null,
    orginalTimes: [], // Todo, this and it's related variables and functions should be removed
    startSeek: false,
    initPlay: false,
    isTrimRecordingNow: false,
    joinRoomRecevied: false,
    totalTrimTime: 0,
    trimofftime: 0,
    trimontime: 0,
    totalRecordingTime: 0,
    actualPlayRecordingTime: 0,
    timeStamp: null,
    totalTimeTillNow: 0,
    markData: [],
    recViewData: {
      'x-api-key': wbUser.lkey,
      'x-congrea-authuser': wbUser.auth_user,
      'x-congrea-authpass': wbUser.auth_pass,
      'x-congrea-room': wbUser.room,
      'x-congrea-session': wbUser.session,
      data: {},
    },
    recording: 'on',
    viewPoint: null,
    count: 0,
    remainingSeconds: 0,
    recData: null,
    recDataOne: null,
    recordingOn: 0,
    recordingOff: 0,
    init() {
      if (!this.attachSeekHandler) {
        this.initRecordViewHandler();
        this.attachSeekHandler = true;
        const virtualclassApp = document.querySelector('#virtualclassCont');
        const downloadProgressBar = document.querySelector('#allMarksinformation');
        // const playProgressBar = document.querySelector('#playProgressBar');

        downloadProgressBar.addEventListener('mousedown', this.seekHandler.bind(this));
        // playProgressBar.addEventListener('mousedown', this.seekHandler.bind(this));
        virtualclassApp.addEventListener('mousemove', this.seekWithMouseMove.bind(this));
        window.addEventListener('mouseup', this.finalSeek.bind(this));
        // window.addEventListener('onunload', this.recDataSend(this));

        virtualclassApp.addEventListener('touchmove', this.seekWithMouseMove.bind(this));
        virtualclassApp.addEventListener('touchend', this.finalSeek.bind(this));

        /** For iPad and mobile * */
        downloadProgressBar.addEventListener('touchstart', this.seekHandler.bind(this));
        // playProgressBar.addEventListener('touchstart', this.seekHandler.bind(this));
        virtualclassApp.addEventListener('touchmove', this.seekWithMouseMove.bind(this));
        virtualclassApp.addEventListener('touchend', this.finalSeek.bind(this));

        downloadProgressBar.addEventListener('mousemove', this.handlerDisplayTime.bind(this));
        // playProgressBar.addEventListener('mousemove', this.handlerDisplayTime.bind(this));

        downloadProgressBar.addEventListener('mouseleave', this.removeHandler.bind(this, downloadProgressBar));
        // playProgressBar.addEventListener('mouseleave', this.removeHandler.bind(this, playProgressBar));
        virtualclass.pageVisible(this.handlPageActiveness.bind(this));
      }

      if (!Object.prototype.hasOwnProperty.call(this, 'prvNum')) {
        this.subRecordingIndex = 0;
        this.masterIndex = 0;
        this.subRecordings = this.masterRecordings[this.masterIndex];
        this.play();
        this.prvNum = this.masterIndex;
      }
    },

    recDataSend() { // data send to server when browser unload, beforeload and recording complete.
      let startTime = 0;
      let timeStamp = 0;
      if (this.recData && this.recData.length > 0) {
        for (let i = 0; i <= this.recData.length; i++) {
          if (timeStamp !== this.recData[i] || this.recData[i] === undefined) {
            if (timeStamp !== 0 && timeStamp !== undefined && !this.recViewData.data.hasOwnProperty(timeStamp)) {
              this.recViewData.data[timeStamp] = [];
            }
            if (timeStamp !== 0 && timeStamp !== undefined) {
              this.recViewData.data[timeStamp].push({ [startTime]: i });
            }
          } else if (this.recData[i] !== undefined) {
            if (i === this.recData.length) {
              this.recViewData.data[this.recData[i]].push({ [startTime]: i });
            }
          }
          if (timeStamp !== this.recData[i]) {
            startTime = i;
          }
          timeStamp = this.recData[i];
        }
      }
      // this.recData.length = 0;
      console.log('====> sent data ', JSON.stringify(this.recViewData));
      const recordingTottalTime = this.recViewData.data.rtt;
      navigator.sendBeacon('https://api.congrea.net/data/analytics/recording', JSON.stringify(this.recViewData));
      delete this.recViewData.data;
      this.recViewData.data = {};
      this.recViewData.data.rtt = recordingTottalTime;
    },

    handlPageActiveness() {
      if (virtualclass.pageVisible()) {
        if (!this.earlierPause) {
          this.controller._play();
          delete this.earlierPause;
        }
      } else {
        this.earlierPause = this.controller.pause;
        this.controller._pause();
      }
    },

    removeHandler(element) {
      element.removeEventListener('mousedown', this.seekHandler.bind(this));
      document.getElementById('timeInHover').style.display = 'none';
      const virtualclassCont = document.querySelector('#virtualclassCont');
      virtualclassCont.classList.remove('recordSeeking');
    },

    async replayFromStart() {
      // console.log('Replay from start');
      this.playTime = 150;
      this.tempPlayTime = this.playTime;
      const tempMasterRecordings = this.masterRecordings;
      await virtualclass.config.endSession();
      virtualclass.popup.closeElem();

      // For disable the common chant on every replay from start
      disCommonChatInput();

      // this.recImgPlay = false;
      this.playTimeout = '';
      this.waitServer = false;
      this.waitPopup = false;

      // this.alreadyAskForPlay = false;
      this.playStart = false;
      this.error = 0;
      // this.mkDownloadLink = "";
      this.elapsedPlayTime = 0;
      // this.getPlayTotTime = false;
      this.controller.ff = 1;
      this.masterRecordings = tempMasterRecordings;
      this.playTimePreviousSeconds = 0;
      // this.playProgressBar(this.playTime, 0);
      this.playProgressBar(this.playTime);
      delete this.prvNum;
      virtualclass.wbCommon.indexNav.init();
      this.init();
      delete virtualclass.ss;
      virtualclass.ss = '';

      virtualclass.makeAppReady({ app: 'Whiteboard' });
    },

    // If binary, return buffer else return original value
    convertInto(e) {
      if (typeof e.data === 'string') {
        return e;
      }
      e.data = e.data.buffer;
      return e;
    },

    playProgressBar(playTime) {
      if (playTime > 0) {
        virtualclass.pbar.renderProgressBar(this.totalTimeInMiliSeconds, playTime, 'playProgressBar', undefined);
        const time = this.convertIntoReadable(playTime);
        document.getElementById('tillRepTime').innerHTML = `${time.h}:${time.m}:${time.s}`;
        if (!this.alreadyCalcTotTime) {
          this.updateTotalTime();
          this.alreadyCalcTotTime = true;
        }
      } else {
        virtualclass.pbar.renderProgressBar((this.lastTimeInSeconds * 1000), 0, 'playProgressBar', undefined);
      }
    },

    updateTotalTime() {
      const ttime = this.convertIntoReadable(this.totalTimeInMiliSeconds);
      document.getElementById('totalRepTime').innerHTML = `${ttime.h}:${ttime.m}:${ttime.s}`;
    },

    convertIntoReadable(ms) {
      ms /= 1000;
      let hour = 0;
      let seconds = Math.floor(ms % 60);
      let minutes = Math.floor(ms / 60);

      if (minutes >= 60) {
        hour = Math.floor(minutes / 60);
        minutes %= 60;
      }

      if (hour < 10) {
        hour = `0${hour}`;
      }

      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }
      const obj = { h: hour, m: minutes, s: seconds };
      return obj;
    },

    displayWaitPopupIfNot() {
      if (this.waitPopup === false) {
        virtualclass.popup.sendBackOtherElems();
        const recordingContainer = document.getElementById('recordingContainer');
        recordingContainer.style.display = 'none';
        virtualclass.popup.waitBlockAction('block');
        virtualclass.pbar.renderProgressBar(0, 0, 'downloadProgressBar', 'downloadProgressValue');
        virtualclass.popup.waitBlock();
        this.waitPopup = true;
      }
    },

    requestDataFromServer(file, xhr) {
      if (this.isFileVcp(file)) {
        if (!this.alreadyRequested[file]) {
          // console.log(`requested file ${file}`);
          // this.displayWaitPopupIfNot(virtualclass.lang.getString("plswaitwhile"));
          const recorderSession = virtualclass.recorder.session;
          const fileUrl = `https://recording.congrea.net/${wbUser.lkey}/${wbUser.room}/${recorderSession}/${file}`;

          if (virtualclass.gObj.readyToCommunicate !== true) {
            setTimeout(() => {
              virtualclass.recorder.requestDataFromServer(file, xhr);
            }, 1000);
            return;
          }
          xhr.get(fileUrl)
            .then((response) => {
              virtualclass.recorder.afterDownloading(file, response.data, xhr);
            })
            .catch((error) => {
                console.error('Request failed with error ', error);
                setTimeout(() => {
                  virtualclass.recorder.requestDataFromServer(file, xhr);
                }, 1000);
              }
            );

          // virtualclass.recorder.xhr[file] = new XHR();
          // virtualclass.recorder.xhr[file].init();
          // virtualclass.recorder.xhr[file].loadData(fileUrl, this.afterDownloading.bind(this, file));
        } else {
          // console.log(`Already requested file ${file}`);
          if (virtualclass.recorder.totalRecordingFiles.length > 0) {
            const NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
            virtualclass.recorder.requestDataFromServer(NextfileName, xhr);
          }
        }
      }
    },

    afterDownloading(file, data, xhr) {
      if (virtualclass.recorder.totalRecordingFiles.length > 0) {
        const NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
        virtualclass.recorder.requestDataFromServer(NextfileName, xhr);
      }
      virtualclass.recorder.rawDataQueue[file] = { file, data };
      this.formatRecording(file);
      this.alreadyRequested[file] = true;
      // this.UIdownloadProgress(file);
    },

    isFirstPacket(file) {
      const fileObj = virtualclass.recorder.orginalListOfFiles[file];
      return (fileObj != null && fileObj.index === 0);
    },

    isPacketInSerial(file) {
      if (this.prevFile != null) {
        return (this.orginalListOfFiles[this.prevFile].next === file
        || this.orginalListOfFiles[this.prevFile].next === 'end');
      }
    },

    formatRecording(file) {
      if ((this.isFirstPacket(file) || this.isPacketInSerial(file)) && Object.keys(this.rawDataQueue).length > 0) {
        const recording = this.rawDataQueue[file];
        if (recording != null) {
          this.makeRecordingQueue(recording.file, recording.data);
          delete this.rawDataQueue[recording.file];
          this.prevFile = recording.file;
          const nextFile = this.orginalListOfFiles[recording.file].next;
          if (nextFile !== 'end') {
            this.formatRecording(nextFile);
          }
        }
      }
    },

    isFileVcp(file) {
      return file != null && file.match(/^.*\.(vcp)$/) != null;
    },

    calculateNextTime(currentTime, nextPacket) {
      const metaData = nextPacket.substring(0, 21);
      const data = nextPacket.substring(22, nextPacket.length);
      let [time, type] = metaData.split(' ');
      time = Math.trunc(time / 1000000);
      return ((time - currentTime));
    },

    insertPacketInto(chunk, miliSeconds) {
      const totalSeconds = Math.trunc(miliSeconds / 1000);
      let playTime = 0;
      if (!isNaN(totalSeconds) && totalSeconds >= 1 && !this.isTrimRecordingNow) {
        playTime = 1000;

        const data = {
          playTime,
          recObjs: '{"0{"user":{"userid":"2"},"m":{"app":"nothing","cf":"sync"}} ',
          type: 'J',
        };

        for (let s = 0; s < totalSeconds; s++) {
          chunk.push(data);
          this.totalTimeTillNow += 1000;
        }
      }
      return chunk;
    },

    renderContextMark(tilNowTime, allmark, context) {
      const markPoint = (tilNowTime * 100) / this.totalTimeInMiliSeconds;
      const contextMark = virtualclass.getTemplate('context-mark');

      virtualclass.gObj.lastContext = context;
      const ctimeId = 'ctime' + markPoint;
      const data = Object.assign({}, allmark, { id: ctimeId, width: markPoint, context });
      const contextMarkHtml = contextMark(data);
      document.getElementById('allMarksinformation').insertAdjacentHTML('beforeend', contextMarkHtml);
    },

    makeRecordingQueue(file, rawData) {
      // console.log(`File formatting ${file}`);
      let data; let
        metaData;
      let chunk = [];
      let nextMinus = null;
      const allRecordigns = rawData.trim().split(/(?:\r\n|\r|\n)/g); // Getting recordings line by line
      let time;
      let type;

      for (let i = 0; i < allRecordigns.length; i++) {
        if (allRecordigns[i] != null && allRecordigns[i]) {
          this.totalElements++;
          metaData = allRecordigns[i].substring(0, 21);
          data = allRecordigns[i].substring(22, allRecordigns[i].length);
          [time, type] = metaData.split(' ');
          time = Math.trunc(time / 1000000);
          /** Converting time, from macro to mili seconds * */
          if (this.refrenceTime != null) {
            if (nextMinus) {
              this.tempPlayTime = (time - this.refrenceTime) - nextMinus;
              nextMinus = null;
            } else {
              this.tempPlayTime = (time - this.refrenceTime);
            }
          }

          if (data != null && data) {
            if (!this.joinRoomRecevied && data.indexOf('"type":"joinroom"') > -1) {
              this.joinRoomRecevied = true;
              const joinMsg = JSON.parse(data);
              joinMsg.clientids = joinMsg.action;
              data = JSON.stringify(joinMsg);
            }

            if (this.lastFileTime && i === 0) {
              const prvTotalMiliSeconds = Math.trunc((time - this.lastFileTime));
              chunk = this.insertPacketInto(chunk, prvTotalMiliSeconds);
              this.tempPlayTime = (prvTotalMiliSeconds > 1000) ? prvTotalMiliSeconds % 1000 : prvTotalMiliSeconds;
            }

            if (i === (allRecordigns.length - 1)) {
              this.lastFileTime = time;
            }

            // virtualclass.settings.info.trimRecordings = true;
            if (virtualclass.settings.info.trimRecordings) {
              if (this.isTrimRecordingNow) { // Recording off
                chunk.push({ playTime: 0, recObjs: data, type });
                if (data.indexOf('{"ac":21,"cf":"recs"') > -1) { // Check if recording turned on, trim off
                  // console.log('=== trim off');
                  this.trimofftime = time;
                  this.isTrimRecordingNow = false;
                  const trimdifftime = this.trimofftime - this.trimontime;
                  this.totalTimeInMiliSeconds = this.totalTimeInMiliSeconds - trimdifftime;
                  this.trimofftime = 0;
                  this.trimontime = 0;
                }
              } else if (data.indexOf('{"ac":11,"cf":"recs"') > -1) { // Check if recording turned off, trim on
                // console.log('=== trim on');
                this.isTrimRecordingNow = true;
                chunk.push({ playTime: 0, recObjs: data, type });
                this.trimontime = time;
              } else {
                chunk.push({ playTime: this.tempPlayTime, recObjs: data, type });
                this.totalTimeTillNow += this.tempPlayTime;
              }
            } else {
              this.recordingTotalTime(data, time);
              chunk.push({ playTime: this.tempPlayTime, recObjs: data, type });
              // this.totalTimeTillNow += this.tempPlayTime;
              this.totalTimeTillNow += this.tempPlayTime;
            }
            this.handleMarkSign(data);
            if (typeof allRecordigns[i + 1] !== 'undefined') {
              const nextMiliSeconds = this.calculateNextTime(time, allRecordigns[i + 1]);
              chunk = this.insertPacketInto(chunk, nextMiliSeconds, i, time, allRecordigns[i + 1].substring(0, 21));
              // console.log('====> chunck length ', nextMiliSeconds);

              if (nextMiliSeconds >= 1000) {
                nextMinus = (Math.trunc(nextMiliSeconds / 1000) * 1000);
              }
            }
            this.refrenceTime = time;
          }
        }
      }
      let binData;
      for (let k = 0; k < chunk.length; k++) {
        if (chunk[k].type === 'B') {
          binData = virtualclass.dtCon.base64DecToArr(chunk[k].recObjs);
          chunk[k].recObjs = binData;
        }
      }

      this.masterRecordings.push(chunk);
      const singleFileTime = virtualclass.recorder.getTimeFromFile(file); // Getting time stamp 112021210
      this.finishRequestDataFromServer(singleFileTime);

      // In case of total file is downloaded and recoring on command is not found
      if (this.isTrimRecordingNow && this.allFileFound) {
        this.totalTimeInMiliSeconds = this.totalTimeInMiliSeconds - (time - this.trimontime);
        this.isTrimRecordingNow = false;
      }

      // console.log ('==== actual recording play time', this.actualTotalPlayTime);
      if (virtualclass.settings.info.trimRecordings && this.masterRecordings.length > 0) {
        const masterIndex = this.masterRecordings.length - 1;
        const subIndex = this.masterRecordings[this.masterRecordings.length - 1].length - 1;
        this.actualTotalPlayTime = this.getTotalTimeInMilSeconds(masterIndex, subIndex);
        this.currentMin = this.actualTotalPlayTime / 1000 / 60;
      } else {
        // this.actualTotalPlayTime = this.currentMin;
        const currentMin = (singleFileTime - this.firstTimeInSeconds) / 60;
        if (currentMin > this.currentMin) {
          this.currentMin = currentMin;
        }
      }

      // console.log('==== downloaded total min ', this.currentMin);

      this.updateTotalTime();
      this.UIdownloadProgress();


      // Init to play after 3 minute or if last file is downloaded
      if (((this.currentMin * 60 * 1000) >= PLAY_START_TIME
        || this.lastFile === file) && this.masterRecordings.length > 0) {
        if (this.playStart) {
          this.startToPlay();
        } else if (!this.alreadyAskForPlay) {
          this.alreadyAskForPlay = true;
          this.askToPlay();
        }
      }
    },

    handleMarkSign(data) {
      if (data.indexOf('readyContext') > -1) {
        if (virtualclass.settings.info.trimRecordings) {
          this.markData.push({ data, totalTimeTillNow: this.totalTimeTillNow });
        } else {
          this.initDisplayContextMark(data, this.totalTimeTillNow);
        }
      }
    },

    initDisplayContextMark(data, totalTimeTillNow) {
      const msg = JSON.parse(io.cleanRecJson(data));
      const allMark = { question: false, note: false, bookmark: false };

      if (virtualclass.userInteractivity.allMarks[msg.m.context]) {
        if (virtualclass.userInteractivity.allMarks[msg.m.context].question
          && virtualclass.userInteractivity.allMarks[msg.m.context].question.length > 0) {
          allMark.question = true;
        }

        if (virtualclass.userInteractivity.allMarks[msg.m.context].note) {
          console.log('This context has note ', msg.m.context);
          allMark.note = true;
        }

        if (virtualclass.userInteractivity.allMarks[msg.m.context].bookmark) {
          allMark.bookmark = true;
        }
      }

      this.renderContextMark(totalTimeTillNow, allMark, msg.m.context);
    },

    disaplayAllMarkSign() {
      document.getElementById('allMarksinformation').innerHTML = "";
      for (let i = 0; i < this.markData.length; i++) {
        this.initDisplayContextMark(this.markData[i].data, this.markData[i].totalTimeTillNow);
      }
    },

    recordingTotalTime(data, time) { // check if recording turned off or on
      let trimtime;
      let totalTimeInMiliSec;
      let totalRecTime;
      if (data.indexOf('{"ac":11,"cf":"recs"') > -1) {
        this.recordingOff = time;
      } else if (data.indexOf('{"ac":21,"cf":"recs"') > -1) {
        this.recordingOn = time;
        trimtime = this.recordingOn - this.recordingOff;
        totalTimeInMiliSec = this.totalTimeInMiliSeconds - trimtime;
        totalRecTime = this.totalRecordingTime - trimtime;
        this.totalRecordingTime = (!this.totalRecordingTime) ? totalTimeInMiliSec : totalRecTime;
        this.recordingOff = 0;
        this.recordingOn = 0;
      }
    },

    handleStartToPlay(ev) {
      const ContinueBtn = document.querySelector('.rv-vanilla-modal-overlay.is-shown');
      if (ContinueBtn != null) {
        ContinueBtn.removeEventListener('click', this.handleStartToPlay.bind(this));
      }
      virtualclass.gesture.clickToContinue();
      // console.log('===== Start to play');
      this.startToPlay();
      ev.currentTarget.classList.remove('askToPlayCont');
    },

    startToPlay() {
      if (!this.playStart) {
        if (virtualclass.settings.info.trimRecordings) this.disaplayAllMarkSign();
        this.playStart = true;
        this.playInt();
        virtualclass.popup.closeElem();
      } else if (Object.prototype.hasOwnProperty.call(this, 'isPausedByNotPresent')) {
        delete this.isPausedByNotPresent;
        this.subRecordingIndex = 0;
        this.subRecordings = this.masterRecordings[this.masterIndex];
        this.controller._play();
        virtualclass.popup.closeElem();
      }
    },

    isDownloadedAllRecordings(singleFileTime) {
      if (this.sessionStartTime > RECORDING_TIME) {
        return (singleFileTime >= virtualclass.recorder.lastTimeInSeconds);
      }
      return false;
    },
    finishRequestDataFromServer(singleFileTime) {
      if (this.isDownloadedAllRecordings(singleFileTime)) {
        if (virtualclass.settings.info.trimRecordings) this.disaplayAllMarkSign();
        virtualclass.recorder.allFileFound = true;
        if (!virtualclass.recorder.alreadyAskForPlay) {
          // virtualclass.recorder.askToPlay("completed");
        } else {
          const askToPlayMsg = document.getElementById('askplayMessage');
          if (askToPlayMsg != null) {
            askToPlayMsg.innerHTML = virtualclass.lang.getString('playsessionmsg');
          }
        }
      }
    },

    UIdownloadProgress() {
      const totalMin = (virtualclass.recorder.totalTimeInMiliSeconds) / 1000 / 60;
      this.downloadInPercentage = ((this.currentMin * 100) / totalMin);
      virtualclass.pbar.renderProgressBar(totalMin, this.currentMin, 'downloadProgressBar', 'downloadProgressValue');

      if (virtualclass.recorder.playStart && !virtualclass.recorder.waitServer) {
        virtualclass.recorder.init();
      }
    },

    playInt() {
      // console.log('=====Play init recording=====');
      virtualclass.popup.closeElem();
      virtualclass.recorder.init(virtualclass.recorder.masterRecordings);
      // virtualclass.recorder.playStart = true;
      virtualclass.config.setNewSession('thisismyplaymode');
      virtualclass.recorder.initController();
      virtualclass.media.audio.initAudiocontext();
    },


    askToPlay() {
      // const loadingWindow = document.querySelector('#loadingWindowCont .loading');
      //             loadingWindow.style.display = 'none';
      //
      // const askToPlay = document.querySelector('#loadingWindowCont .askToPlay');
      //            askToPlay.style.display = 'block';
      //
      // const loadingWindowCont = document.querySelector('#loadingWindowCont');
      const ContinueBtn = document.querySelector('.rv-vanilla-modal-overlay.is-shown');
      ContinueBtn.addEventListener('click', this.handleStartToPlay.bind(this));

      const loadingAskToPlay = document.querySelector('#loadingWindowCont .askToPlay');
      if (loadingAskToPlay != null) {
        loadingAskToPlay.addEventListener('click', this.handleStartToPlay.bind(this));
      }

      const playPopup = document.getElementById('popupContainer');
      playPopup.classList.add('playPopup');

      ContinueBtn.classList.add('askToPlayCont');
    },

    playProgressOutput(ev) {
      // console.log('Offset ', ev.offsetX);
    },

    getOffset(e) {
      if (e.type === 'touchend') {
        e = this.lastEvent;
      } else {
        if(e.touches) {
          e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
          e.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
        } else {
          e = 0;
        }

      }
      this.lastEvent = e;
      return e;
    },

    seekHandler(ev) {
      if (ev.offsetX == null) {
        ev = this.getOffset(ev);
      }
      this.pauseBeforeSeek = this.controller.pause;

      if (!this.startSeek) {
        this.startSeek = true;
        const virtualclassCont = document.querySelector('#virtualclassCont');
        if (virtualclassCont != null) {
          virtualclassCont.classList.add('recordSeeking');
        }

        const clickedPosition = ev.offsetX;
        const containerWidth = this.getCustomWidth();
        const seekValueInPer = (clickedPosition / containerWidth) * 100;

        this.seekValueInPercentage = seekValueInPer;

        // console.log(`====Seek start ${this.seekValueInPercentage} ev current target=${ev.currentTarget.id}`);
      } else {
        // console.log('Earlier seek start is not end yet.');
      }
    },

    getCustomWidth() { // 1 is given to handle long session
      const widthPlayProgress = document.getElementById('downloadProgress').clientWidth - 1;
      return widthPlayProgress;
    },

    async seek(seekPointPercent) {
      // console.log('====> final seek suman 2', this.seekValueInPercentage);
      virtualclass.videoHost.UI.hideTeacherVideo();
      const index = this.getSeekPoint(seekPointPercent);
      // console.log('Total till play, Index val master index ' +
      // index.master + ' sub index' + index.sub + ' in percent' + seekPointPercent);
      if ((index.master < this.masterIndex)
        || (index.master === this.masterIndex && index.sub < this.subRecordingIndex)) {
        await this.replayFromStart();
      }
      await this._seek(index);
      // console.log('seek is finished');
      this.triggerSynchPacket();
    },

    triggerSynchPacket() {
      this.triggerPlayProgress();
      // console.log('===== Elapsed time 1 ==== ' + this.elapsedPlayTime);
      if (this.binarySyncMsg) {
        // this.handleSyncPacket (syncMsg, this.binarySyncMsg);
        this.handleSyncPacket();
        this.binarySyncMsg = null;
      }
      this.handleSyncStringPacket();
    },

    _seek(index) {
      // console.log('====> final seek suman 3', this.seekValueInPercentage);
      this.controller._pause();
      let subLength;
      // while (index ? this.masterIndex <= index.master : !this.seekFinished()){
      while (true) {
        // while (true){
        if (index != null) {
          subLength = (this.masterIndex !== index.master) ? this.masterRecordings[this.masterIndex].length : index.sub;
        } else {
          subLength = this.masterRecordings[this.masterIndex].length;
        }

        for (let j = this.subRecordingIndex; j < subLength; j++) {
          try {
            if (this.subRecordings[this.subRecordingIndex].type !== 'B') {
              this.msg = io.cleanRecJson(this.subRecordings[this.subRecordingIndex].recObjs);
              if (this.msg.indexOf('"m":{"unshareScreen"') > -1) {
                this.binarySyncMsg = null;
              } else if (this.msg.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1) {
                // syncMsg =  {app : 'Poll', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                virtualclass.poll.recordStartTime = {
                  app: 'Poll',
                  data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
                };
              } else if (this.msg.indexOf('"m":{"videoUl":{"content_path"') > -1) {
                virtualclass.videoUl.videoStartTime = {
                  app: 'Video',
                  data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
                };
                // console.log('Capture video');
              } else if (this.msg.indexOf('"m":{"quiz":{"quizMsg":"stdPublish"') > -1) {
                // console.log('Capture Quiz');
                virtualclass.quiz.quizStartTime = {
                  app: 'Quiz',
                  data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
                };
              }
              io.onRecMessage(this.convertInto({ data: this.msg }));
            } else { // Binary
              this.msg = this.subRecordings[this.subRecordingIndex].recObjs;

              if (this.msg[0] === 104 || this.msg[0] === 204 || this.msg[0] === 102
                || this.msg[0] === 202) { // Full Image of screen share
                if (this.msg[1] === 0 || this.msg[1] === 1) { // Either first packet or full packet
                  this.binarySyncMsg = {
                    data: {
                      masterIndex: this.masterIndex,
                      subIndex: this.subRecordingIndex,
                    },
                  };
                }
              }

              if (virtualclass.currApp === 'ScreenShare') {
                if (this.msg[0] === 104 || this.msg[0] === 204 || this.msg[0] === 103
                  || this.msg[0] === 203 || this.msg[0] === 102 || this.msg[0] === 202) {
                  // console.log('Screen type', this.msg[0] + ' masterIndex ' +
                  // this.masterIndex + ' secondaryIndex ' + this.subRecordingIndex);
                  io.onRecMessage(this.convertInto({ data: this.msg }));
                  this.binarySyncMsg = null;
                }
              }
            }
            this.collectElapsedPlayTime();
          } catch (e) {
            // console.log('PLAY ERROR ' + e.errorCode);
          }

          this.subRecordingIndex++;
        }

        this.elapsedRecTime = this.elapsedTime = this.elapsedPlayTime;

        /* When seek point is found exit the while loop* */

        if (index != undefined && this.masterIndex === index.master && index.sub === this.subRecordingIndex) {
          break;
        } else {
          this.subRecordingIndex = 0;
          this.masterIndex++;
          this.subRecordings = this.masterRecordings[this.masterIndex];
        }
      }

      // console.log('==== recording final 1');
    },

    handleSyncStringPacket() {
      let quizElapsedTime;
      let subInd;
      let masterInd;
      if (virtualclass.currApp === 'Poll' && typeof virtualclass.poll.pollState.data === 'object'
        && Object.prototype.hasOwnProperty.call(virtualclass.poll, 'recordStartTime')) {
        subInd = virtualclass.poll.recordStartTime.data.subIndex;
        masterInd = virtualclass.poll.recordStartTime.data.masterIndex;
        const pollStartTime = this.getTotalTimeInMilSeconds(masterInd, subInd);
        if (virtualclass.poll.dataRec.setting.timer) { // showTimer() for remaining time
          const pollData = virtualclass.poll.pollState;
          this.pollUpdateTime(pollStartTime, pollData);
        } else {
          const pollElapsedtime = this.elapsedPlayTime - pollStartTime;
          const timer = this.convertIntoReadable(pollElapsedtime);
          virtualclass.poll.dataRec.newTime.min = timer.m;
          virtualclass.poll.dataRec.newTime.sec = timer.s;
          virtualclass.poll.elapsedTimer();
          // for elapsed timer
        }
      } else if (virtualclass.currApp === 'Video' && typeof virtualclass.videoUl === 'object'
        && Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'videoStartTime')) {
        subInd = virtualclass.videoUl.videoStartTime.data.subIndex;
        masterInd = virtualclass.videoUl.videoStartTime.data.masterIndex;
        const videoStartTime = this.getTotalTimeInMilSeconds(masterInd, subInd);
        // const videoElapsedtime = (this.elapsedPlayTime - videoStartTime);
        const videoSeekTime = (this.elapsedPlayTime - videoStartTime) / 1000;

        if (typeof virtualclass.videoUl.player === 'object') {
          virtualclass.videoUl.playVideo(videoSeekTime);
        } else {
          // console.log('====Video init to play start');
          if (this.pauseBeforeSeek) {
            virtualclass.videoUl.isPaused = true;
          } else {
            virtualclass.videoUl.isPaused = false;
          }
          virtualclass.videoUl.startTime = videoSeekTime;
        }
      } else if (virtualclass.currApp === 'Quiz' && typeof virtualclass.quiz === 'object') {
        // virtualclass.quiz.plugin.method.completeQuiz(
        // {callback: virtualclass.quiz.plugin.config.animationCallbacks.completeQuiz});
        subInd = virtualclass.quiz.quizStartTime.data.subIndex;
        masterInd = virtualclass.quiz.quizStartTime.data.masterIndex;
        const timeDisplayInto = document.querySelector('#qztime');s
        const quizStartTime = this.getTotalTimeInMilSeconds(masterInd, subInd);
        if (+(virtualclass.quiz.plugin.config.quizTime) > 0) {
          const quizTimeInMiliSeconds = virtualclass.quiz.plugin.config.quizTime * 1000;
          quizElapsedTime = (quizTimeInMiliSeconds - (this.elapsedPlayTime - quizStartTime));
          virtualclass.quiz.plugin.method.startTimer(quizElapsedTime / 1000, timeDisplayInto, 'desc', 'vmQuiz');
        } else {
          quizElapsedTime = (this.elapsedPlayTime - quizStartTime) / 1000;
          virtualclass.quiz.plugin.method.startTimer(quizElapsedTime, timeDisplayInto, 'asc', 'vmQuiz');
        }
      }
    },

    pollUpdateTime(pollStartTime, pollData) {
      // const minMiliseconds = pollData.data.stdPoll.newTime.min * 60 * 1000;
      // const secMiliseconds = pollData.data.stdPoll.newTime.sec * 1000;
      // const totalMiniSeconds = (minMiliseconds + secMiliseconds);
      const totalMiniSeconds = pollData.data.setting.time.totalInSeconds * 1000;
      const toSeekTime = (totalMiniSeconds - (this.elapsedPlayTime - pollStartTime));
      const timer = this.convertIntoReadable(toSeekTime);
      // virtualclass.poll.newTimer.sec = timer.s;
      // virtualclass.poll.newTimer.min = timer.m;
      virtualclass.poll.remainingTimer({min: timer.m, sec: timer.s});
    },

    handleSyncPacket() {
      if (this.binarySyncMsg) {
        // if(this.binarySyncMsg != null && syncMsg.app == 'ss' &&
        // !Object.prototype.hasOwnProperty.call(this.binarySyncMsg, 'unshareScreen')){
        // console.log('Get full screen share');
        let startSubIndex = this.binarySyncMsg.data.subIndex;
        let startMindex = this.binarySyncMsg.data.masterIndex;

        while (startMindex <= this.masterIndex) {
          // console.log(`Start from master index ${startMindex} from Subindex ${startSubIndex}`);
          const subRecordings = this.masterRecordings[startMindex];
          let subLength = null;

          if (this.masterIndex != startMindex) {
            subLength = this.masterRecordings[this.masterIndex].length;
          } else {
            subLength = this.subRecordingIndex;
          }
          let j;
          for (j = startSubIndex; j <= subLength; j++) {
            this.msg = subRecordings[j];
            try {
              if (this.msg != null && this.msg.type === 'B') {
                this.msg = this.msg.recObjs;
                if (this.msg[0] === 104 || this.msg[0] === 204 || this.msg[0] === 103
                  || this.msg[0] === 203 || this.msg[0] === 102 || this.msg[0] === 202) {
                  io.onRecMessage(this.convertInto({ data: this.msg }));
                }
              } else {
                // console.log('Either this.msg is null or string');
              }
            } catch (e) {
              // console.log(`PLAY ERROR ${e.errorCode}`);
            }
          }

          if (this.masterIndex === startMindex && j === this.subRecordingIndex) {
            break; // exit from main loop
          } else {
            startMindex++;
            startSubIndex = 0;
          }
        }
        // console.log(`===== Elapsed time 2 ==== ${this.elapsedPlayTime}`);
        this.playProgressBar(this.elapsedPlayTime);
        // }
      }
    },

    fetchRecViewData() {
      const url = 'https://api.congrea.net/data/analytics/recording/fetch';
      axios.post(url,
        {
          session: wbUser.session,
          uid: wbUser.rid,
        },
        {
          method: 'POST',
          headers: {
            'x-api-key': wbUser.lkey,
            'x-congrea-authuser': wbUser.auth_user,
            'x-congrea-authpass': wbUser.auth_pass,
            'x-congrea-room': wbUser.room,
            'content-type': 'application/json',
          },
        }).then((response) => {
        this.viewPoint = this.mapper(response.data.Items[0]);
        // console.log('recording view data '+data);
      });
    },

    // this function use for convert recording view data into object
    mapper(data) {
      const S = 'S';
      const SS = 'SS';
      const NN = 'NN';
      const NS = 'NS';
      const BS = 'BS';
      const BB = 'BB';
      const N = 'N';
      const BOOL = 'BOOL';
      const NULL = 'NULL';
      const M = 'M';
      const L = 'L';
      if (isObject(data)) {
        const keys = Object.keys(data);
        while (keys.length) {
          const key = keys.shift();
          const types = data[key];

          if (isObject(types) && types.hasOwnProperty(S)) {
            data[key] = types[S];

          } else if (isObject(types) && types.hasOwnProperty(N)) {
            data[key] = parseFloat(types[N]);
          } else if (isObject(types) && types.hasOwnProperty(BOOL)) {
            data[key] = types[BOOL];
          } else if (isObject(types) && types.hasOwnProperty(NULL)) {
            data[key] = null;
          } else if (isObject(types) && types.hasOwnProperty(M)) {
            data[key] = this.mapper(types[M]);
          } else if (isObject(types) && types.hasOwnProperty(L)) {
            data[key] = this.mapper(types[L]);
          } else if (isObject(types) && types.hasOwnProperty(SS)) {
            data[key] = types[SS];
          } else if (isObject(types) && types.hasOwnProperty(NN)) {
            data[key] = types[NN];
          } else if (isObject(types) && types.hasOwnProperty(BB)) {
            data[key] = types[BB];
          } else if (isObject(types) && types.hasOwnProperty(NS)) {
            data[key] = types[NS];
          } else if (isObject(types) && types.hasOwnProperty(BS)) {
            data[key] = types[BS];
          }
        }
      }
      return data;

      function isObject(value) {
        return typeof value === 'object' && value !== null;
      }
    },

    getSeekPoint(seekPointPercent) {
      const seekVal = Math.trunc((this.totalTimeInMiliSeconds * seekPointPercent) / 100);
      this.count = Math.floor(seekVal / 5000);
      // console.log(`Seek index ${seekVal}`);
      /** Todo THIS should be optimize, don't use nested loop * */
      let totalTimeMil = 0;
      for (let i = 0; i < this.masterRecordings.length; i++) {
        for (let j = 0; j < this.masterRecordings[i].length; j++) {
          totalTimeMil += this.masterRecordings[i][j].playTime;
          if (totalTimeMil === seekVal) {
            return { master: i, sub: j };
            // console.log(`Seek index i = ${i} j=${j} totalTime=${totalTimeMil}`);
          } if (totalTimeMil >= seekVal) {
            if (j > 0) {
              j--;
            } else {
              i--;
              if (i >= 0) {
                j = (this.masterRecordings[i].length - 1);
              } else {
                j = 0;
              }
            }
            // console.log(`Seek index i = ${i} j=${j} totalTime=${totalTimeMil}`);
            const obj = { master: i, sub: j };
            return obj;
          }
        }
      }
    },


    play() {
      if (this.controller.pause) {
        return;
      }
      this.config();
      if (this.isPlayFinished()) {
        // Sometimes there would come session end packet before 1 or 2 towards end packets
        // In that case, let play time would be equal to total time
        if ((this.masterRecordings[this.masterIndex]
          && this.masterRecordings[this.masterIndex][this.subRecordingIndex].recObjs.indexOf('"cf":"sEnd"') > -1)) {
          this.playProgressBar(this.totalTimeInMiliSeconds);
        }
        if (this.allFileFound) {
          this.askAgainToPlay();
        } else {
          /** wait till next file is downloaded* */
          this.controller._pause();
          // virtualclass.popup.loadingWindow();
          this.initReplayWindow();
          const loading = document.querySelector('#loadingWindowCont .loading');
          loading.style.display = 'block';

          const askToPlay = document.querySelector('#loadingWindowCont .askToPlay');
          askToPlay.style.display = 'none';
          this.isPausedByNotPresent = true;
        }
      } else {
        this.executePacketToPlay();
      }
    },

    config() {
      if (this.masterIndex === 0 && this.subRecordingIndex === 0) {
        this.startTime = performance.now();
        this.elapsedTime = 0;
        this.elapsedRecTime = 0;
        this.playTimePreviousSeconds = 0;
        this.reserveTime = 0;
        const recPlayCont = document.getElementById('recPlay');
        this.doControlActive(recPauseCont);
      }

      if (typeof this.playTimeout !== 'undefined' && this.playTimeout) {
        clearTimeout(this.playTimeout);
      }

      if (!Object.prototype.hasOwnProperty.call(this, 'playTime')) {
        this.subRecordings = this.masterRecordings[this.masterIndex];
        io.cfg = JSON.parse(this.subRecordings[this.subRecordingIndex].recObjs);
        virtualclass.gObj.uRole = 's'; // if teacher sets there would ask for choose screen share
      }
    },

    executePacketToPlay() {
      this.calcPlayTime();
      if (this.playTime === 0) {
        this.triggerPlayProgress();
        this.executePacketToPlayActual();
        this.calcPlayTimeNext();
        this.play();
      } else {
        this.playTimeout = setTimeout(() => {
          this.triggerPlayProgress();
          this.executePacketToPlayActual();
          this.calcPlayTimeNext();
          this.play();
        }, this.playTime);
      }
    },

    executePacketToPlayActual() {
      try {
        if (this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"cf":"sync"') < 0) {
          io.onRecMessage(this.convertInto({ data: this.subRecordings[this.subRecordingIndex].recObjs }));
          if (virtualclass.currApp === 'Poll'
            && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1) {
            virtualclass.poll.recordStartTime = {
              app: 'Poll',
              data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
            };
          } else if (virtualclass.currApp === 'Video'
            && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"videoUl":{"content_path"') > -1) {
            virtualclass.videoUl.videoStartTime = {
              app: 'Video',
              data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
            };
            // console.log('Capture video');
          } else if (virtualclass.currApp === 'Quiz'
            && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"quiz":{"quizMsg":"stdPublish",') > -1) {
            virtualclass.quiz.quizStartTime = {
              app: 'Quiz',
              data: { masterIndex: this.masterIndex, subIndex: this.subRecordingIndex },
            };
          }
        }

        this.recordingViewByStudent();
      } catch (e) {
        // console.log(`PLAY ERROR ${e.errorCode}`);
      }
    },

    recordingViewByStudent() {
      if (this.timeStamp === null) {
        this.timeStamp = new Date(new Date().toUTCString()).getTime(); // get time once when recording play.
        this.recViewData.data[this.timeStamp] = [];
        const recordingTime = (!this.totalRecordingTime) ? this.totalTimeInMiliSeconds : this.totalRecordingTime;
        const length = Math.floor(recordingTime / 5000);
        if (this.viewPoint !== undefined) {
          this.recDataConvertIntoArrayForm(length);
        } else {
          this.recData = new Array(length);
        }
        this.recViewData.data.rtt = recordingTime;
        this.recViewData['x-congrea-uid'] = wbUser.rid;
      }
      if (this.subRecordings[this.subRecordingIndex].recObjs.indexOf('{"ac":11,"cf":"recs"') > -1) {
        this.recording = 'off';
      } else if (this.subRecordings[this.subRecordingIndex].recObjs.indexOf('{"ac":21,"cf":"recs"') > -1) {
        this.recording = 'on';
      }
      if (this.recording === 'on') { // add time of actual play recording packets but trim packets time not added.
        this.actualPlayRecordingTime += this.subRecordings[this.subRecordingIndex].playTime;
        if (this.actualPlayRecordingTime >= 5000) {
          this.remainingSeconds = this.actualPlayRecordingTime - 5000;
          if (this.recData[this.count] === undefined) {
            this.recData.splice(this.count, 1, this.timeStamp);
          }
          this.count++;
          this.actualPlayRecordingTime = this.remainingSeconds;
        }
      }
    },

    recDataConvertIntoArrayForm(length) {
      const data = this.viewPoint.data[Object.keys(this.viewPoint.data)[0]];
      this.recData = new Array(length);
      if (data !== null) {
        for (const prop in this.viewPoint.data) {
          const property = prop;
          const val = this.viewPoint.data[prop];
          for (let i = 0; i < val.length; i++) {
            const dataProp = (parseInt(Object.keys(val[i])[0]));
            const value = (Object.values(val[i])[0]);
            for (let j = dataProp; j < value; j++) {
              this.recData.splice(j, 1, parseInt(property));
            }
          }
        }
      }
    },

    isPlayFinished() {
      return (typeof this.masterRecordings[this.masterIndex] === 'undefined'
      && (typeof this.subRecordings === 'undefined'
      || typeof this.subRecordings[this.subRecordingIndex] === 'undefined'
      || typeof this.subRecordings !== 'undefined')
      && typeof this.subRecordings[this.subRecordingIndex] !== 'undefined'
      && this.subRecordings[this.subRecordingIndex].type === 'J'
      && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('{"sEnd"') > -1);
    },

    triggerPauseVideo() {
      // const playAct = document.querySelector('#dispVideo');
      if (virtualclass.videoUl && virtualclass.videoUl.player) {
        // console.log('VIDEO IS PAUSED');
        virtualclass.videoUl.player.pause();
        virtualclass.videoUl.isPaused = true;
      }
    },


    triggerPlayVideo() {
      if (virtualclass.currApp === 'Video' && virtualclass.videoUl && virtualclass.videoUl.player) {
        // console.log('VIDEO IS Played');
        virtualclass.videoUl.player.play();
        virtualclass.videoUl.isPaused = false;
      }
    },

    askAgainToPlay() {
      if (this.subRecordings && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('sEnd') < 0) {
        const e = { data: this.subRecordings[this.subRecordingIndex].recObjs };
        // e.data = this.subRecordings[this.subRecordingIndex].recObjs;
        io.onRecMessage(this.convertInto(e));
      }

      if (!virtualclass.recorder.allFileFound) {
        virtualclass.recorder.waitServer = true;
        virtualclass.recorder.waitPopup = false;
        this.displayWaitPopupIfNot();
      } else {
        // Play finished here
        if (virtualclass.recorder.allFileFound) {
          this.initReplayWindow();
          // this.triggerPauseVideo();
          // virtualclass.popup.replayWindow();
          // virtualclass.popup.sendBackOtherElems();
          // document.getElementById('replayClose').addEventListener('click',
          //     function () {
          //         window.close(); //handle to moodle way
          //     }
          // );
          // document.getElementById('replayButton').addEventListener('click', function () {
          //     virtualclass.recorder.replayFromStart.call(virtualclass.recorder);
          // });
        }
      }
    },

    initReplayWindow() {
      this.triggerPauseVideo();
      virtualclass.popup.replayWindow();
      virtualclass.popup.sendBackOtherElems();
      document.getElementById('replayClose').addEventListener('click',
        () => {
          window.close(); // handle to moodle way
        });
      document.getElementById('replayButton').addEventListener('click', () => {
        virtualclass.recorder.controller.pause = false;
        virtualclass.recorder.replayFromStart.call(virtualclass.recorder);
      });
    },


    /** TODO, this should handle in proper way * */
    getCurrentPacket() {
      let currrentPacket = 0;
      if (this.masterIndex > 0) {
        for (let i = 0; i < this.masterIndex; i++) {
          currrentPacket += this.masterRecordings[i].length;
        }
      }
      return (currrentPacket + this.subRecordingIndex);
    },

    collectElapsedPlayTime() {
      this.elapsedPlayTime += this.subRecordings[this.subRecordingIndex].playTime;
      // console.log("==== elapsedPlayTime ",this.elapsedPlayTime);
    },

    triggerPlayProgress() {
      this.collectElapsedPlayTime();
      if (this.masterIndex === 0 && this.subRecordingIndex === 0) {
        this.playProgressBar(this.elapsedPlayTime);
      } else {
        this.playTimeNowSeconds = Math.round(this.elapsedPlayTime / 1000);
        if (this.playTimeNowSeconds > this.playTimePreviousSeconds) {
          // this.playProgressBar(this.elapsedPlayTime, this.getCurrentPacket());
          this.playProgressBar(this.elapsedPlayTime);
          virtualclass.popup.sendBackOtherElems();
          this.playTimePreviousSeconds = this.playTimeNowSeconds;
        }
      }
    },

    calcPlayTime() {
      if (typeof this.subRecordings[this.subRecordingIndex] === 'object') {
        this.playTimePak = this.subRecordings[this.subRecordingIndex].playTime / this.controller.ff;
      }

      this.timeNow = performance.now();
      this.diffTime = this.timeNow - this.startTime;
      this.startTime = this.timeNow;
      this.elapsedTime += this.diffTime;
      this.playTime = Math.round(this.playTimePak - (this.elapsedTime - this.elapsedRecTime));
      this.elapsedRecTime += this.playTimePak;

      if (this.playTime < 0) {
        this.playTime = 0;
      }
    },

    calcPlayTimeNext() {
      if ((this.subRecordingIndex + 1) == this.subRecordings.length) {
        this.masterIndex++;
        this.subRecordings = this.masterRecordings[this.masterIndex];
        this.subRecordingIndex = 0;
      } else {
        this.subRecordingIndex++;
      }
    },


    initController() {
      const playControllerCont = document.getElementById('playControllerCont');
      if (playControllerCont != null) {
        var that = this; // TODO Remove that
        // init fast forward
        const recButton = document.getElementsByClassName('ff');
        for (let i = 0; i < recButton.length; i++) {
          recButton[i].onclick = function () {
            const ffBy = this.id.split('ff')[1];
            that.controller.fastForward(parseInt(ffBy, 10));
            const pauseAct = document.querySelector('#dispVideo');
            if (virtualclass.videoUl && virtualclass.videoUl.player && pauseAct.classList.contains('vjs-paused')) {
              virtualclass.videoUl.player.play();
            }

            if (this.parentNode.id !== 'replayFromStart') {
              that.doControlActive(this);
            }
          };
        }

        var that = this;
        const recPause = document.getElementById('recPause');
        recPause.addEventListener('click', () => {
          if (recPause.parentNode.classList.contains('recordingPlay')) {
            that.initRecPause();
          } else {
            that.initRecPlay();
          }
        });
      }
    },


    initRecPause() {
      const recPause = document.getElementById('recPause');
      this.controller._pause();
      this.doControlActive(recPause);
      virtualclass.recorder.triggerPauseVideo();
      recPause.parentNode.classList.remove('recordingPlay');
      recPause.dataset.title = 'Play';
    },

    initRecPlay() {
      const recPause = document.getElementById('recPause');
      this.controller._play();
      this.doControlActive(recPause);
      if (virtualclass.videoUl && virtualclass.videoUl.player) {
        virtualclass.videoUl.player.play();
      }
      recPause.parentNode.classList.add('recordingPlay');
      recPause.dataset.title = 'Pause';
    },

    doControlActive(elem) {
      const controlButtons = document.getElementById('playControllerCont').getElementsByClassName('recButton');
      for (let i = 0; i < controlButtons.length; i++) {
        controlButtons[i].classList.remove('controlActive');
      }
      elem.parentNode.classList.add('controlActive');
    },

    controller: {
      pause: false,
      ff: 1,
      _play() {
        virtualclass.recorder.startTime = performance.now();
        this.ff = 1;
        this.pause = false;
        virtualclass.recorder.play();
        // console.log('====== Recording play');
      },

      _pause() {
        this.pause = true;
        // console.log('====== Recording pause');
      },

      fastForward(by) {
        this.ff = by;
        this.pause = false;
        virtualclass.recorder.play();
      },
    },

    sendData(data, url, cb) {
      this.cb = cb;
      const params = JSON.stringify(data);
      this.httpObj.open('POST', url);

      this.httpObj.setRequestHeader('x-api-key', wbUser.lkey);

      this.httpObj.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
      this.httpObj.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);

      this.httpObj.setRequestHeader('x-congrea-room', wbUser.room);
      this.httpObj.setRequestHeader('Content-Type', 'application/json');
      this.httpObj.withCredentials = false;
      this.httpObj.send(params);
    },


    sortingFiles(list) {
      function compare(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      }

      return list.sort(compare);
    },

    setOrginalListOfFiles(list) {
      const data = {};
      for (let i = 0; i < list.length; i++) {
        if ((list[i + 1] != null)) {
          data[list[i]] = { index: i, next: list[i + 1] };
        } else {
          data[list[i]] = { index: i, next: 'end' };
        }
        // data[list[i]] = (list[i + 1] != null) ? {index : i, next : list[i+1]} : {index : i, next : 'end'};
      }
      return data;
    },

    triggerDownloader() {
      // console.log('Init trigger time to request 1');
      this.tryNumberOfTimes = 1;
      if (Object.prototype.hasOwnProperty.call(this, 'triggerDownloaderTime')) {
        clearInterval(this.triggerDownloaderTime);
      }
      if (Object.prototype.hasOwnProperty.call(this, 'startTimeCounter')) {
        clearInterval(this.startTimeCounter);
      }

      let timerCounter = 0;
      this.startTimeCounter = setInterval(() => {
        timerCounter++;
        // console.log(`=====Timer ===${timerCounter}`);
      }, 1000);

      this.triggerDownloaderTime = setInterval(() => {
        // console.log('Init trigger time to request 2');
        if (this.tryNumberOfTimes > 3) {
          virtualclass.recorder.allFileFound = true;
          clearInterval(this.triggerDownloaderTime.triggerDownloaderTime);
          if (this.isPlayFinished()) {
            // Sometime there would come session end packet before 1 or 2 end packet
            // In that case, let play time would be equal to total time
            if (this.masterRecordings[this.masterIndex][this.subRecordingIndex].recObjs.indexOf('"cf":"sEnd"') > -1) {
              this.playProgressBar(this.totalTimeInMiliSeconds);
            }
            this.askAgainToPlay();
          }
        } else {
          virtualclass.xhrn.vxhrn.post(virtualclass.api.recordingFiles, data).then((response) => {
            this.afterDownloadingList(response.data);
          });
        }

        // console.log(`Time to request ${TIME_TO_REQUEST}`);
      }, TIME_TO_REQUEST); // 3 is now, but that could be 5 minute
    },

    afterDownloadingList(rawData) {
      let recSession;
      let recFile;
      if (rawData != null && Object.prototype.hasOwnProperty.call(rawData, 'Item')) {
        const sessionStart = +(rawData.Item.time.N);
        const currentTime = new Date().getTime();
        this.sessionStartTime = (currentTime - sessionStart);

        /** Removing element, if there in any * */
        const listOfFiles = [...new Set(rawData.Item.list.L.map(item => item.S))];
        const tempListOfFilesLength = listOfFiles.length;

        if (this.lastRecordings && (listOfFiles.length === this.lastRecordings)) {
          this.tryNumberOfTimes = (!this.tryNumberOfTimes) ? 1 : ++this.tryNumberOfTimes;
        } else {
          delete this.alreadyCalcTotTime;
          this.totalRecordingFiles = this.sortingFiles(listOfFiles);
          this.lastFile = this.totalRecordingFiles[this.totalRecordingFiles.length - 1];

          this.orginalListOfFiles = this.setOrginalListOfFiles(this.totalRecordingFiles);

          this.calculateTotalPlayTime();

          const fileName = this.totalRecordingFiles.shift();
          this.firstxhr = axios.create({
            timeout: 600000,
            withCredentials: true,
          });

          this.requestDataFromServer(fileName, this.firstxhr);

          for (const nfile in this.totalRecordingFiles) {
            recSession = virtualclass.recorder.session;
            recFile = this.totalRecordingFiles[nfile];
            const nfileUrl = `https://recording.congrea.net/${wbUser.lkey}/${wbUser.room}/${recSession}/${recFile}`;
            virtualclass.createPrefetchLink(nfileUrl);
          }

          // if (this.totalRecordingFiles.length > 0) {
          //   const NextfileName = this.totalRecordingFiles.shift(); // Call Next
          //   this.nextxhr = axios.create({
          //     timeout: 600000,
          //     withCredentials: true,
          //   });
          //   this.requestDataFromServer(NextfileName, this.nextxhr);
          // }

          if (this.sessionStartTime < RECORDING_TIME) {
            this.triggerDownloader();
          }
        }
        this.lastRecordings = tempListOfFilesLength;
      } else {
        this.tryNumberOfTimes = (!this.tryNumberOfTimes) ? 1 : ++this.tryNumberOfTimes;
        this.triggerDownloader();
      }
    },

    requestListOfFiles() {
      this.fetchRecViewData();
      this.actualTotalPlayTime = 0;
      this.session = wbUser.session;
      // virtualclass.popup.loadingWindow();
      virtualclass.xhrn.vxhrn.post(virtualclass.api.recordingFiles, { session: virtualclass.recorder.session })
        .then((response) => {
          this.afterDownloadingList(response.data);
        });
    },

    calculateTotalPlayTime() {
      const totalRecFiles = virtualclass.recorder.totalRecordingFiles;
      const firstTime = Math.trunc(+(totalRecFiles[0].split('-')[0]) / 1000000); // converting nano to seconds
      const lastTime = Math.trunc(+(totalRecFiles[totalRecFiles.length - 1].split('-')[1].split('.')[0]) / 1000000);
      // converting nano to seconds

      this.totalTimeInMiliSeconds = (lastTime - firstTime);

      this.lastTimeInSeconds = Math.trunc(lastTime / 1000);
      this.firstTimeInSeconds = Math.trunc(firstTime / 1000);
    },

    getTimeFromFile(file) {
      return (+(file.split('-')[1].split('.')[0]) / 1000000000); // Converting nanoseconds to miliseconds
    },

    totalPlayTime() {
      let totalTimeInSec = 0;
      for (let i = 0; i < virtualclass.recorder.masterRecordings.length; i++) {
        for (let j = 0; j < virtualclass.recorder.masterRecordings[i].length; j++) {
          totalTimeInSec += virtualclass.recorder.masterRecordings[i][j].playTime;
        }
      }
      return totalTimeInSec / 1000;
    },

    getTotalTimeInMilSeconds(master, subIndex) {
      let mi = 0;
      let totalTimeInMiliSeconds = 0;
      while (mi <= master) {
        for (let i = 0; i < virtualclass.recorder.masterRecordings[mi].length; i++) {
          totalTimeInMiliSeconds += virtualclass.recorder.masterRecordings[mi][i].playTime;
          if ((master === mi) && (subIndex === i)) {
            break;
          }
        }
        mi += 1;
      }

      return totalTimeInMiliSeconds;
    },

    getTempTotalTimeInMilSeconds(master, subIndex) {
      let mi = 0;
      let totalTimeInMiliSeconds = 0;
      while (mi <= master) {
        for (let i = 0; i < this.orginalTimes[mi].length; i++) {
          totalTimeInMiliSeconds += this.orginalTimes[mi][i];
          if ((master === mi) && (subIndex === i)) {
            break;
          }
        }
        mi++;
      }

      return totalTimeInMiliSeconds;
    },

    getTotalElementLength() {
      let totalLength = 0;
      for (let i = 0; i < virtualclass.recorder.masterRecordings.length; i++) {
        totalLength += virtualclass.recorder.masterRecordings[i].length;
      }
      return totalLength;
    },

    seekWithMouseMove(ev) {
      if (ev.offsetX == null) {
        ev = this.getOffset(ev);
      }

      if (this.startSeek) {
        this.controller._pause();
        const seekValueInPercentage = this.getSeekValueInPercentage(ev);
        this.seekValueInPercentage = seekValueInPercentage;
        if (this.downloadInPercentage < this.seekValueInPercentage) {
          // this.seekValueInPercentage = Math.trunc(this.downloadInPercentage) - 1;
          this.seekValueInPercentage = Math.trunc(this.downloadInPercentage);
        }
        this.setPlayProgressTime(this.seekValueInPercentage);
        const seekTimeInMilseconds = (this.seekTimeWithMove.m * 60 * 1000) + this.seekTimeWithMove.s * 1000;
        const timeInMiliSec = this.totalTimeInMiliSeconds;
        virtualclass.pbar.renderProgressBar(timeInMiliSec, seekTimeInMilseconds, 'playProgressBar', undefined);
        const hour = this.seekTimeWithMove.h;
        const min = this.seekTimeWithMove.m;
        const sec = this.seekTimeWithMove.s;
        document.querySelector('#tillRepTime').innerHTML = `${hour}:${min}:${sec}`;
        this.displayTimeInHover(ev, this.seekValueInPercentage);
      }
    },

    getSeekValueInPercentage(ev) {
      const containerWidth = this.getCustomWidth();
      const clickedPosition = ev.offsetX;
      const seekValueInPer = (clickedPosition / containerWidth) * 100;
      return seekValueInPer;
    },

    handlerDisplayTime(ev) {
      const seekValueInPercentage = this.getSeekValueInPercentage(ev);
      // console.log('Seek value time in percentage ' + seekValueInPercentage);
      this.displayTimeInHover(ev, seekValueInPercentage);
    },

    displayTimeInHover(ev, seekValueInPer) {
      this.setPlayProgressTime(seekValueInPer);
      let offset;
      if (ev.offsetX < 20) {
        offset = 3;
      } else if ((window.innerWidth - ev.offsetX) < 5) {
        offset = ev.offsetX - 65;
      } else if ((window.innerWidth - ev.offsetX) < 30) {
        offset = ev.offsetX - 60;
      } else if ((window.innerWidth - ev.offsetX) < 40) {
        offset = ev.offsetX - 35;
      } else {
        offset = ev.offsetX - 25;
      }

      const timeInHover = document.getElementById('timeInHover');
      timeInHover.style.display = 'block';

      timeInHover.style.marginLeft = `${offset}px`;
      const hour = this.seekTimeWithMove.h;
      const min = this.seekTimeWithMove.m;
      const sec = this.seekTimeWithMove.s;

      document.getElementById('timeInHover').innerHTML = `${hour}:${min}:${sec}`;
      const virtualclassCont = document.querySelector('#virtualclassCont');
      virtualclassCont.classList.add('recordSeeking');
    },

    setPlayProgressTime(seekValueInPer) {
      const totalMiliSeconds = (seekValueInPer * this.totalTimeInMiliSeconds) / 100;
      const time = this.convertIntoReadable(totalMiliSeconds);
      this.seekTimeWithMove = time;
    },

    async finalSeek(ev) {
      if (!ev.offsetX) {
        ev = this.getOffset(ev);
      }
      if (this.startSeek && Object.prototype.hasOwnProperty.call(this, 'seekValueInPercentage')) {
        // console.log(`====Seek up ${this.seekValueInPercentage}`);
        if (this.downloadInPercentage < this.seekValueInPercentage) {
          this.seekValueInPercentage = Math.trunc(this.downloadInPercentage);
        }
        if (this.seekValueInPercentage > 0) {
          // console.log('====> final seek suman ', this.seekValueInPercentage);
          await this.seek(this.seekValueInPercentage);
        }


        if (this.pauseBeforeSeek) {
          // console.log('=== Video pause ');
          this.controller._pause();
          this.triggerPauseVideo();
        } else {
          // console.log('=== Video play ');
          // console.log('==== recording final 2');
          this.controller._play();
          this.triggerPlayVideo();
        }
        document.getElementById('timeInHover').style.display = 'none';
      }

      const virtualclassCont = document.querySelector('#virtualclassCont');
      virtualclassCont.classList.remove('recordSeeking');


      // console.log(ev.offsetX);
      delete this.seekValueInPercentage;
      this.startSeek = false;

      const congrealogo = document.getElementById('congrealogo');
      if (congrealogo != null) {
        congrealogo.classList.remove('disbaleOnmousedown');
      }
    },

    initRecordViewHandler() {
      let alreadySend = false;
      window.addEventListener('unload', () => {
        if (!alreadySend) {
          virtualclass.recorder.recDataSend();
          console.log('Send recording view data 1');
          alreadySend = true;
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (!alreadySend && document.visibilityState === 'hidden') {
          // sendData('visibilitychange___');
          virtualclass.recorder.recDataSend();
          console.log('Send recording view data 2');
          alreadySend = true;
        }
        if (document.visibilityState === 'visible') {
          alreadySend = false;
        }
      });

      // To detect the back press button event on chrome of Android-Mobile
      // Using jQuery Plugin http://www.vvaves.net/jquery-backDetect/
      if (virtualclass.system.device === 'mobTab') {
        backDection.backDetect('#virtualclassCont', () => {
          if (!alreadySend) {
            virtualclass.recorder.recDataSend();
            alreadySend = true;
            setTimeout(() => { virtualclassSetting.congreaWindow.close(); }, 500);
          }
        });
      }
    },
  };
  window.recorder = recorder;
}(window));
