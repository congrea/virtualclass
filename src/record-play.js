// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    "use strict";
    const TIME_TO_REQUEST = 3 * 60 * 1000; // every request would be performeed in given milisecond
    const RECORDING_TIME = 15 * 60 * 1000; // If elapsed time goes beyond the

    function XHR() {
        console.log('Define XHR class');
    }

    XHR.prototype.init = function () {
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            this.httpObj = new XMLHttpRequest();
        } else {
            this.httpObj = new ActiveXObject("Microsoft.XMLHTTP");
        }

        this.onReadStateChange();

        this.httpObj.onerror = function (err) {
            console.log("Error " + err);
            this.cb("ERROR");
        };

        this.httpObj.withCredentials = true;

        this.httpObj.onabort = function (evt) {
            console.log("Error abort " + evt);
        }

        return this.httpObj;
    };

    XHR.prototype.onReadStateChange = function () {
        var that = this;
        this.httpObj.onreadystatechange = function () {
            if (that.httpObj.readyState == 4 && typeof that.cb != 'undefined') {
                that.httpObj.status == 200 ? that.cb(that.httpObj.responseText) : that.cb("ERROR");
            }
        }
    }

    XHR.prototype.send = function () {
        this.cb = cb;
        this.httpObj.open("POST", file, true);
        this.httpObj.send(data);
    }

    XHR.prototype.loadData = function (url, cb) {
        this.cb = cb;
        this.httpObj.open("GET", url, true);
        this.httpObj.send();
    }

    var recorder = {
        playTime: 150,
        tempPlayTime: 150,
        items: [],
        objn: 0,
        playTimeout: "",
        allFileFound: false,
        playTimePreviousSeconds: 0,
        waitServer: false,
        waitPopup: false,
        masterRecordings: [],
        alreadyAskForPlay: false,
        playStart: false,
        error: 0,
        currentMin: 0,
        importfilepath: window.importfilepath,
        exportfilepath: window.exportfilepath,
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
        init: function () {
            if (!this.attachSeekHandler) {
                this.attachSeekHandler = true;
                var virtualclassApp = document.querySelector('#virtualclassCont');
                var downloadProgressBar = document.querySelector('#downloadProgressBar');
                var playProgressBar = document.querySelector('#playProgressBar');

                downloadProgressBar.addEventListener('mousedown', this.seekHandler.bind(this));
                playProgressBar.addEventListener('mousedown', this.seekHandler.bind(this));
                virtualclassApp.addEventListener('mousemove', this.seekWithMouseMove.bind(this));
                window.addEventListener('mouseup', this.finalSeek.bind(this));

                virtualclassApp.addEventListener('touchmove', this.seekWithMouseMove.bind(this));
                virtualclassApp.addEventListener('touchend', this.finalSeek.bind(this));

                /** For iPad and mobile **/
                downloadProgressBar.addEventListener('touchstart', this.seekHandler.bind(this));
                playProgressBar.addEventListener('touchstart', this.seekHandler.bind(this));
                virtualclassApp.addEventListener('touchmove', this.seekWithMouseMove.bind(this));
                virtualclassApp.addEventListener('touchend', this.finalSeek.bind(this));

                downloadProgressBar.addEventListener('mousemove', this.handlerDisplayTime.bind(this));
                playProgressBar.addEventListener('mousemove', this.handlerDisplayTime.bind(this));

                downloadProgressBar.addEventListener('mouseleave', this.removeHandler.bind(this, downloadProgressBar));
                playProgressBar.addEventListener('mouseleave', this.removeHandler.bind(this, playProgressBar));

                virtualclass.pageVisible(this.handlPageActiveness.bind(this));
            }

            if (!this.hasOwnProperty('prvNum')) {
                this.subRecordingIndex = 0;
                this.masterIndex = 0;
                this.subRecordings = this.masterRecordings[this.masterIndex];
                this.play();
                this.prvNum = this.masterIndex;
            }
        },

        handlPageActiveness (){
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

        removeHandler (element) {
            element.removeEventListener('mousedown', this.seekHandler.bind(this));
            document.getElementById('timeInHover').style.display = 'none';
            var virtualclassCont = document.querySelector('#virtualclassCont');
            virtualclassCont.classList.remove('recordSeeking');
        },

        replayFromStart: function () {
            console.log("Replay from start");
            this.playTime = 150;
            this.tempPlayTime = this.playTime;
            var tempMasterRecordings = this.masterRecordings;
            virtualclass.storage.config.endSession();
            virtualclass.popup.closeElem();

            // For disable the common chant on every replay from start
            disCommonChatInput();

            // this.recImgPlay = false;
            this.playTimeout = "";
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
            this.init();
        },

        // If binary, return buffer else return original value
        convertInto: function (e) {
            if (typeof e.data == 'string') {
                return e;
            }
            e.data = e.data.buffer;
            return e;
        },

        playProgressBar: function (playTime) {
            // console.log('total play time ' + playTime + ' elapsed time2 ' + playTime);
            if (playTime > 0) {
                virtualclass.pbar.renderProgressBar(this.totalTimeInMiliSeconds, playTime, 'playProgressBar', undefined);

                var time = this.convertIntoReadable(playTime);
                document.getElementById('tillRepTime').innerHTML = time.h + ':' + time.m + ':' + time.s;
                if (!this.alreadyCalcTotTime) {
                    this.updateTotalTime();
                    this.alreadyCalcTotTime = true;
                }
            } else {
                virtualclass.pbar.renderProgressBar((this.lastTimeInSeconds * 1000), 0, 'playProgressBar', undefined);
            }
        },

        updateTotalTime () {
            var ttime = this.convertIntoReadable(this.totalTimeInMiliSeconds);
            document.getElementById('totalRepTime').innerHTML = ttime.h + ':' + ttime.m + ':' + ttime.s;
        },

        convertIntoReadable: function (ms) {
            ms = ms / 1000;
            var hour = 0;
            var seconds = Math.floor(ms % 60);
            var minutes = Math.floor(ms / 60);

            if (minutes >= 60) {
                hour = Math.floor(minutes / 60);
                minutes = minutes % 60;
            }

            if (hour < 10) {
                hour = '0' + hour;
            }

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            return {h: hour, m: minutes, s: seconds};
        },

        displayWaitPopupIfNot: function () {
            if (this.waitPopup == false) {
                virtualclass.popup.sendBackOtherElems();
                var recordingContainer = document.getElementById("recordingContainer");
                recordingContainer.style.display = "none";
                virtualclass.popup.waitBlockAction('block');
                virtualclass.pbar.renderProgressBar(0, 0, 'downloadProgressBar', 'downloadProgressValue');
                virtualclass.popup.waitBlock();
                this.waitPopup = true;
            }
        },

        requestDataFromServer: function (file) {
            if (this.isFileVcp(file)) {
                if (!this.alreadyRequested[file]) {
                    console.log('requested file ' + file);
                    // this.displayWaitPopupIfNot(virtualclass.lang.getString("plswaitwhile"));

                    var fileUrl = "https://recording.congrea.net/" + wbUser.lkey + '/' + wbUser.room + '/' + virtualclass.recorder.session + '/' + file;
                    virtualclass.recorder.xhr[file] = new XHR();
                    virtualclass.recorder.xhr[file].init();
                    virtualclass.recorder.xhr[file].loadData(fileUrl, this.afterDownloading.bind(this, file));

                } else {
                    console.log('Already requested file ' + file);
                    if (virtualclass.recorder.totalRecordingFiles.length > 0) {
                        var NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
                        virtualclass.recorder.requestDataFromServer(NextfileName);
                    }
                }
            }
        },

        afterDownloading (file, data) {
            if (data == 'ERROR') {
                setTimeout(() => {
                    virtualclass.recorder.requestDataFromServer(file);
                }, 500);
            } else {
                if (virtualclass.recorder.totalRecordingFiles.length > 0) {
                    var NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
                    virtualclass.recorder.requestDataFromServer(NextfileName);

                }
                virtualclass.recorder.rawDataQueue[file] = {file: file, data: data};
                this.formatRecording(file)
                this.alreadyRequested[file] = true;
                // this.UIdownloadProgress(file);
            }
        },

        isFirstPacket (file){
            var fileObj = virtualclass.recorder.orginalListOfFiles[file];
            return (fileObj != null && fileObj.index == 0);
        },

        isPacketInSerial (file) {
            if (this.prevFile != null) {
                return (this.orginalListOfFiles[this.prevFile].next === file || this.orginalListOfFiles[this.prevFile].next === 'end');
            }
        },

        formatRecording (file){
            if (this.isFirstPacket(file) || this.isPacketInSerial(file) && Object.keys(this.rawDataQueue).length > 0) {
                let recording = this.rawDataQueue[file];
                if (recording != null) {
                    this.makeRecordingQueue(recording.file, recording.data);
                    delete this.rawDataQueue[recording.file];
                    this.prevFile = recording.file;
                    var nextFile = this.orginalListOfFiles[recording.file].next;
                    if (nextFile !== 'end') {
                        this.formatRecording(nextFile);
                    }
                }
            }
        },

        isFileVcp (file) {
            return file != null && file.match(/^.*\.(vcp)$/) != null;
        },

        calculateNextTime (currentTime, nextPacket) {
            var metaData = nextPacket.substring(0, 21);
            var data = nextPacket.substring(22, nextPacket.length);
            var [time, type] = metaData.split(' ');
            time = Math.trunc(time / 1000000);
            return ((time - currentTime));

        },

        insertPacketInto (chunk, miliSeconds) {
            let totalSeconds = Math.trunc(miliSeconds / 1000);
            let playTime = 0;
            if (!isNaN(totalSeconds) && totalSeconds >= 1) {
                if (!this.isTrimRecordingNow) {
                    playTime = 1000;
                }

                var data = {
                    playTime: playTime,
                    'recObjs': '{"0{"user":{"userid":"2"},"m":{"app":"nothing","cf":"sync"}} ',
                    type: 'J'
                };

                for (let s = 0; s < totalSeconds; s++) {
                    this.totalTimeInMiliSeconds += playTime;
                    chunk.push(data);
                }
            }
            return chunk;
        },

        makeRecordingQueue(file, rawData) {
            console.log('File formatting ' + file);
            var data, metaData;
            var chunk = [];
            var nextMinus = null;
            var tempChunk = [];
            var allRecordigns = rawData.trim().split(/(?:\r\n|\r|\n)/g); // Getting recordings line by line

            for (var i = 0; i < allRecordigns.length; i++) {
                if (allRecordigns[i] != null && allRecordigns[i] != '') {
                    this.totalElements++
                    metaData = allRecordigns[i].substring(0, 21);
                    data = allRecordigns[i].substring(22, allRecordigns[i].length)
                    var [time, type] = metaData.split(' ');
                    this.tempTime = time;
                    time = Math.trunc(time / 1000000);
                    /** Converting time, from macro to mili seconds **/
                    if (this.refrenceTime != null) {
                        if (nextMinus) {
                            this.tempPlayTime = (time - this.refrenceTime ) - nextMinus;
                            nextMinus = null;
                        } else {
                            this.tempPlayTime = (time - this.refrenceTime );
                        }
                    }

                    if (this.hasOwnProperty('tempRefrenceTime')) {
                        tempChunk.push(Math.trunc((this.tempTime - this.tempRefrenceTime) / 1000000));
                    } else {
                        tempChunk.push(150);
                    }

                    if (data != null && data != '') {
                        if (!this.joinRoomRecevied && data.indexOf('"type":"joinroom"') > -1) {
                            this.joinRoomRecevied = true;
                            let joinMsg = JSON.parse(data);
                            joinMsg.clientids = joinMsg.action;
                            data = JSON.stringify(joinMsg);
                        }

                        if (this.lastFileTime && i === 0) {
                            let prvTotalMiliSeconds = Math.trunc((time - this.lastFileTime));
                            chunk = this.insertPacketInto(chunk, prvTotalMiliSeconds);
                            this.tempPlayTime = (prvTotalMiliSeconds > 1000) ? prvTotalMiliSeconds % 1000 : prvTotalMiliSeconds;
                        }

                        if (i === (allRecordigns.length - 1)) {
                            this.lastFileTime = time;
                        }

                        // chunk.push({playTime : this.tempPlayTime, 'recObjs' : data, type :type});

                        if (this.isTrimRecordingNow) {
                            chunk.push({playTime: 0, 'recObjs': data, type: type});
                            console.log("==== TRIM ")
                        } else {
                            if (virtualclass.settings.recording.trimRecordings && data.indexOf('{"ac":false,"cf":"recs"') > -1) {
                                this.isTrimRecordingNow = true;
                                chunk.push({playTime: 0, 'recObjs': data, type: type});
                                console.log("==== TRIM ")
                            } else {
                                chunk.push({playTime: this.tempPlayTime, 'recObjs': data, type: type});
                            }
                        }

                        this.totalTimeInMiliSeconds += chunk[chunk.length - 1].playTime;

                        if (virtualclass.settings.recording.trimRecordings && data.indexOf('{"ac":true,"cf":"recs"') > -1) {
                            this.isTrimRecordingNow = false;
                        }

                        if (typeof allRecordigns[i + 1] != 'undefined') {
                            let nextMiliSeconds = this.calculateNextTime(time, allRecordigns[i + 1]);
                            chunk = this.insertPacketInto(chunk, nextMiliSeconds, true);
                            if (nextMiliSeconds >= 1000) {
                                nextMinus = (Math.trunc(nextMiliSeconds / 1000) * 1000);
                            }
                        }
                        this.refrenceTime = time;
                        this.tempRefrenceTime = this.tempTime
                    }
                }
            }

            console.log('totalTime in seconds ' + (this.totalTimeInMiliSeconds / 1000));
            var binData;
            for (var k = 0; k < chunk.length; k++) {
                if (chunk[k].type == 'B') {
                    binData = virtualclass.dtCon.base64DecToArr(chunk[k].recObjs);
                    chunk[k].recObjs = binData;
                }
            }

            this.masterRecordings.push(chunk);

            this.orginalTimes.push(tempChunk);

            this.UIdownloadProgress(file);

            if ((this.currentMin > 3 || this.lastFile == file ) && this.masterRecordings.length > 0) { // Starts playing after 5 mins of download
                if (this.playStart) {
                    this.startToPlay();
                    this.updateTotalTime();
                } else {
                    if (!this.alreadyAskForPlay) {
                        this.alreadyAskForPlay = true;
                        this.askToPlay();
                    }
                }
            }
        },

        handleStartToPlay (ev) {
            var ContinueBtn = document.querySelector(".rv-vanilla-modal-overlay.is-shown");
            if (ContinueBtn != null) {
                ContinueBtn.removeEventListener('click', this.handleStartToPlay.bind(this));
            }
            virtualclass.gesture.clickToContinue();
            console.log('===== Start to play');
            this.startToPlay();
            ev.currentTarget.classList.remove('askToPlayCont');
        },

        startToPlay (){
            if (!this.playStart) {
                this.playStart = true;
                this.playInt();
                virtualclass.popup.closeElem();
            } else if (this.hasOwnProperty('isPausedByNotPresent')) {
                delete this.isPausedByNotPresent;
                this.subRecordingIndex = 0;
                this.subRecordings = this.masterRecordings[this.masterIndex];
                this.controller._play()
                virtualclass.popup.closeElem();
            }
        },

        isDownloadedAllRecordings (singleFileTime) {
            if (this.sessionStartTime > RECORDING_TIME) {
                return (singleFileTime >= virtualclass.recorder.lastTimeInSeconds)
            } else {
                return false;
            }
        },

        finishRequestDataFromServer (singleFileTime) {
            if (this.isDownloadedAllRecordings(singleFileTime)) {
                virtualclass.recorder.allFileFound = true;
                if (!virtualclass.recorder.alreadyAskForPlay) {
                    // virtualclass.recorder.askToPlay("completed");
                } else {
                    var askToPlayMsg = document.getElementById('askplayMessage');
                    if (askToPlayMsg != null) {
                        askToPlayMsg.innerHTML = virtualclass.lang.getString('playsessionmsg');
                    }
                }
            }
        },

        UIdownloadProgress (file) {
            var singleFileTime = virtualclass.recorder.getTimeFromFile(file); // Getting time stamp 112021210
            var currentMin = ( singleFileTime - this.firstTimeInSeconds) / 60;
            if (currentMin > this.currentMin) {
                this.currentMin = currentMin;
            }

            let totalMin = virtualclass.recorder.totalTimeInMiliSeconds / 1000 / 60;
            this.downloadInPercentage = ((this.currentMin * 100) / totalMin);
            virtualclass.pbar.renderProgressBar(totalMin, this.currentMin, 'downloadProgressBar', 'downloadProgressValue');
            this.finishRequestDataFromServer(singleFileTime);

            if (virtualclass.recorder.playStart && !virtualclass.recorder.waitServer) {
                virtualclass.recorder.init();
            }
        },

        playInt: function () {
            console.log('=====Play init recording=====');
            virtualclass.popup.closeElem();
            virtualclass.recorder.init(virtualclass.recorder.masterRecordings);
            // virtualclass.recorder.playStart = true;
            localStorage.setItem('mySession', 'thisismyplaymode');
            virtualclass.recorder.initController();
            virtualclass.media.audio.initAudiocontext();
        },


        askToPlay: function () {
            var loadingWindow = document.querySelector('#loadingWindowCont .loading');
//            loadingWindow.style.display = 'none';

            var askToPlay = document.querySelector('#loadingWindowCont .askToPlay');
//            askToPlay.style.display = 'block';

            var loadingWindowCont = document.querySelector('#loadingWindowCont');
            var ContinueBtn = document.querySelector(".rv-vanilla-modal-overlay.is-shown");
            ContinueBtn.addEventListener('click', this.handleStartToPlay.bind(this));

            var loadingAskToPlay = document.querySelector('#loadingWindowCont .askToPlay');
            if (loadingAskToPlay != null) {
                loadingAskToPlay.addEventListener('click', this.handleStartToPlay.bind(this));
            }

            var playPopup = document.getElementById("popupContainer");
            playPopup.classList.add("playPopup");

            ContinueBtn.classList.add('askToPlayCont');
        },

        playProgressOutput (ev){
            console.log('Offset ', ev.offsetX);
        },

        getOffset (e){
            if (e.type == 'touchend') {
                e = this.lastEvent
            } else {
                e.offsetX = e.touches[0].pageX - e.touches[0].target.offsetLeft;
                e.offsetY = e.touches[0].pageY - e.touches[0].target.offsetTop;
            }
            this.lastEvent = e;
            return e;
        },

        seekHandler (ev){
            if (ev.offsetX == undefined) {
                ev = this.getOffset(ev);
            }

            this.pauseBeforeSeek = this.controller.pause;

            if (!this.startSeek) {
                this.startSeek = true;
                var virtualclassCont = document.querySelector('#virtualclassCont');
                if (virtualclassCont != null) {
                    virtualclassCont.classList.add('recordSeeking');
                }

                let clickedPosition = ev.offsetX;
                let containerWidth = this.getCustomWidth();
                let seekValueInPer = (clickedPosition / containerWidth) * 100;

                this.seekValueInPercentage = seekValueInPer;

                console.log("====Seek start " + this.seekValueInPercentage + ' ev current target=' + ev.currentTarget.id);
            } else {
                console.log('Earlier seek start is not end yet.');
            }
        },

        getCustomWidth () {
            var widthPlayProgress = document.getElementById('downloadProgress').clientWidth - 1; // 1 is given to handle long session
            return widthPlayProgress;
        },

        seek (seekPointPercent) {
            let index = this.getSeekPoint(seekPointPercent);
            // console.log('Total till play, Index val master index ' + index.master + ' sub index' + index.sub + ' in percent' + seekPointPercent);
            if ((index.master < this.masterIndex) || (index.master == this.masterIndex && index.sub < this.subRecordingIndex)) {
                this.replayFromStart();
            }
            this._seek(index);
            console.log('seek is finished');
            this.triggerSynchPacket();
        },

        selfSeek () {
            console.log('Start self seek');
            this.selfStartSeek = true
            this._seek();
            this.triggerSynchPacket();

            this.controller._play();
        },

        triggerSynchPacket (){
            this.triggerPlayProgress();
            // console.log('===== Elapsed time 1 ==== ' + this.elapsedPlayTime);
            if (this.binarySyncMsg) {
                // this.handleSyncPacket (syncMsg, this.binarySyncMsg);
                this.handleSyncPacket();
                this.binarySyncMsg = null;
            }
            this.handleSyncStringPacket();
        },

        seekFinished(index){
            if (index == undefined && this.masterRecordings[this.masterIndex][this.subRecordingIndex] != undefined) {
                return (this.masterRecordings[this.masterIndex][this.subRecordingIndex].recObjs.indexOf('{"ac":true,"cf":"recs"') > -1);
            }
        },

        _seek (index) {
            this.controller._pause();
            let subLength;
            // while (index ? this.masterIndex <= index.master : !this.seekFinished()){
            while (true) {
                // while (true){
                if (index != null) {
                    subLength = (this.masterIndex != index.master) ? this.masterRecordings[this.masterIndex].length : index.sub;
                } else {
                    subLength = this.masterRecordings[this.masterIndex].length;
                }

                for (let j = this.subRecordingIndex; j < subLength; j++) {
                    try {
                        if (this.subRecordings[this.subRecordingIndex].type != 'B') {
                            this.msg = io.cleanRecJson(this.subRecordings[this.subRecordingIndex].recObjs);
                            if (this.msg.indexOf('"m":{"unshareScreen"') > -1) {
                                this.binarySyncMsg = null;
                            } else if (this.msg.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1) {
                                // syncMsg =  {app : 'Poll', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                                virtualclass.poll.recordStartTime = {
                                    app: 'Poll',
                                    data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                                }
                            } else if (this.msg.indexOf('"m":{"videoUl":{"content_path"') > -1) {
                                virtualclass.videoUl.videoStartTime = {
                                    app: 'Video',
                                    data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                                }
                                // console.log('Capture video');
                            } else if (this.msg.indexOf('"m":{"quiz":{"quizMsg":"stdPublish"') > -1) {
                                // console.log('Capture Quiz');
                                virtualclass.quiz.quizStartTime = {
                                    app: 'Quiz',
                                    data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                                };
                            }

                            io.onRecMessage(this.convertInto({data: this.msg}));

                        } else { // Binary
                            this.msg = this.subRecordings[this.subRecordingIndex].recObjs;

                            if (this.msg[0] == 104 || this.msg[0] == 204 || this.msg[0] == 102 || this.msg[0] == 202) { // Full Image of screen share
                                if (this.msg[1] == 0 || this.msg[1] == 1) { // Either first packet or full packet
                                    this.binarySyncMsg = {
                                        data: {
                                            masterIndex: this.masterIndex,
                                            subIndex: this.subRecordingIndex
                                        }
                                    };
                                }
                            }

                            if (virtualclass.currApp == 'ScreenShare') {
                                if (this.msg[0] == 104 || this.msg[0] == 204 || this.msg[0] == 103 || this.msg[0] == 203 || this.msg[0] == 102 || this.msg[0] == 202) {
                                    // console.log('Screen type', this.msg[0] + ' masterIndex ' + this.masterIndex + ' secondaryIndex ' + this.subRecordingIndex);
                                    io.onRecMessage(this.convertInto({data: this.msg}));
                                    this.binarySyncMsg = null;
                                }
                            }
                        }
                        this.collectElapsedPlayTime();
                    } catch (e) {
                        // console.log('PLAY ERROR ' + e.errorCode);
                    }

                    if (virtualclass.settings.recording.trimRecordings && this.selfStartSeek && this.seekFinished()) {
                        this.selfSeekFinished = true;
                        break;
                    }
                    this.subRecordingIndex++;
                }

                this.elapsedRecTime = this.elapsedTime = this.elapsedPlayTime;

                /* When seek point is found exit the while loop**/

                if ((index != undefined && this.masterIndex === index.master && index.sub === this.subRecordingIndex) || this.selfSeekFinished) {
                    break;
                } else {
                    this.subRecordingIndex = 0;
                    this.masterIndex++;
                    this.subRecordings = this.masterRecordings[this.masterIndex];
                }
            }
        },

        handleSyncStringPacket () {
            if (virtualclass.currApp == 'Poll' && typeof virtualclass.poll.pollState.data == 'object' && virtualclass.poll.hasOwnProperty('recordStartTime')) {
                var pollStartTime = this.getTotalTimeInMilSeconds(virtualclass.poll.recordStartTime.data.masterIndex, virtualclass.poll.recordStartTime.data.subIndex);
                if (virtualclass.poll.dataRec.setting.timer) { // showTimer() for remaining time
                    var pollData = virtualclass.poll.pollState;
                    this.pollUpdateTime(pollStartTime, pollData);
                } else {
                    var pollElapsedtime = this.elapsedPlayTime - pollStartTime;
                    var timer = this.convertIntoReadable(pollElapsedtime);
                    virtualclass.poll.dataRec.newTime.min = timer.m;
                    virtualclass.poll.dataRec.newTime.sec = timer.s;
                    virtualclass.poll.elapsedTimer();
                    // for elapsed timer
                }
            } else if (virtualclass.currApp == 'Video' && typeof virtualclass.videoUl == 'object' &&
                virtualclass.videoUl.hasOwnProperty('videoStartTime')) {
                var videoStartTime = this.getTotalTimeInMilSeconds(virtualclass.videoUl.videoStartTime.data.masterIndex, virtualclass.videoUl.videoStartTime.data.subIndex);
                var videoElapsedtime = (this.elapsedPlayTime - videoStartTime);
                var videoSeekTime = (this.elapsedPlayTime - videoStartTime) / 1000;

                if (typeof virtualclass.videoUl.player == 'object') {
                    virtualclass.videoUl.playVideo(videoSeekTime);
                } else {
                    console.log('====Video init to play start');
                    if (this.pauseBeforeSeek) {
                        virtualclass.videoUl.isPaused = true;
                    } else {
                        virtualclass.videoUl.isPaused = false;
                    }
                    virtualclass.videoUl.startTime = videoSeekTime;


                }
            } else if (virtualclass.currApp == 'Quiz' && typeof virtualclass.quiz == 'object') {
                // virtualclass.quiz.plugin.method.completeQuiz({callback: virtualclass.quiz.plugin.config.animationCallbacks.completeQuiz});

                var timeDisplayInto = document.querySelector('#qztime');
                var quizStartTime = this.getTotalTimeInMilSeconds(virtualclass.quiz.quizStartTime.data.masterIndex, virtualclass.quiz.quizStartTime.data.subIndex);
                if (+(virtualclass.quiz.plugin.config.quizTime) > 0) {
                    var quizTimeInMiliSeconds = virtualclass.quiz.plugin.config.quizTime * 1000;
                    var quizElapsedTime = (quizTimeInMiliSeconds - (this.elapsedPlayTime - quizStartTime));
                    virtualclass.quiz.plugin.method.startTimer(quizElapsedTime / 1000, timeDisplayInto, 'desc', 'vmQuiz');
                } else {
                    var quizElapsedTime = (this.elapsedPlayTime - quizStartTime) / 1000;
                    virtualclass.quiz.plugin.method.startTimer(quizElapsedTime, timeDisplayInto, 'asc', 'vmQuiz');
                }
            }
        },

        pollUpdateTime (pollStartTime, pollData){
            var minMiliseconds = pollData.data.stdPoll.newTime.min * 60 * 1000;
            var secMiliseconds = pollData.data.stdPoll.newTime.sec * 1000;
            var totalMiniSeconds = (minMiliseconds + secMiliseconds);
            var toSeekTime = (totalMiniSeconds - (this.elapsedPlayTime - pollStartTime));
            var timer = this.convertIntoReadable(toSeekTime);
            virtualclass.poll.newTimer.sec = timer.s;
            virtualclass.poll.newTimer.min = timer.m;
            virtualclass.poll.showTimer(virtualclass.poll.newTimer);
        },

        handleSyncPacket () {
            if (this.binarySyncMsg) {
                // if(this.binarySyncMsg != null && syncMsg.app == 'ss' && !this.binarySyncMsg.hasOwnProperty('unshareScreen')){
                console.log('Get full screen share');
                let startSubIndex = this.binarySyncMsg.data.subIndex;
                let startMindex = this.binarySyncMsg.data.masterIndex;

                while (startMindex <= this.masterIndex) {
                    console.log('Start from master index ' + startMindex + ' from Subindex ' + startSubIndex);
                    let subRecordings = this.masterRecordings[startMindex];
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
                            if (this.msg != null && this.msg.type == 'B') {
                                this.msg = this.msg.recObjs;
                                if (this.msg[0] == 104 || this.msg[0] == 204 || this.msg[0] == 103 || this.msg[0] == 203 || this.msg[0] == 102 || this.msg[0] == 202) {
                                    io.onRecMessage(this.convertInto({data: this.msg}));
                                }
                            } else {
                                console.log('Either this.msg is null or string');
                            }

                        } catch (e) {
                            console.log('PLAY ERROR ' + e.errorCode);
                        }
                    }

                    if (this.masterIndex == startMindex && j == this.subRecordingIndex) {
                        break; //exit from main loop
                    } else {
                        startMindex++
                        startSubIndex = 0;
                    }
                }
                console.log('===== Elapsed time 2 ==== ' + this.elapsedPlayTime);
                this.playProgressBar(this.elapsedPlayTime);
                // }
            }
        },

        getSeekPoint (seekPointPercent) {
            var seekVal = Math.trunc((this.totalTimeInMiliSeconds * seekPointPercent ) / 100);
            console.log('Seek index ' + seekVal);
            /** Todo THIS should be optimize, don't use nested loop **/
            var totalTimeMil = 0;
            for (var i = 0; i < this.masterRecordings.length; i++) {
                for (var j = 0; j < this.masterRecordings[i].length; j++) {
                    totalTimeMil += this.masterRecordings[i][j].playTime;
                    if (totalTimeMil == seekVal) {
                        return {master: i, sub: j};
                        console.log('Seek index i = ' + i + ' j=' + j + ' totalTime=' + totalTimeMil);
                    } else if (totalTimeMil >= seekVal) {
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
                        console.log('Seek index i = ' + i + ' j=' + j + ' totalTime=' + totalTimeMil);
                        return {master: i, sub: j};
                    }
                }
            }
        },


        play: function () {
            if (this.controller.pause) {
                return;
            }
            this.config();
            if (this.isPlayFinished()) {
                if (this.allFileFound) {
                    this.askAgainToPlay();
                } else {
                    /** wait till next file is downloaded**/
                    this.controller._pause();
                    // virtualclass.popup.loadingWindow();
                    this.initReplayWindow();
                    var loading = document.querySelector('#loadingWindowCont .loading');
                    loading.style.display = 'block';

                    var askToPlay = document.querySelector('#loadingWindowCont .askToPlay');
                    askToPlay.style.display = 'none';
                    this.isPausedByNotPresent = true;
                }
            } else {
                this.executePacketToPlay();
            }
        },

        config () {
            if (this.masterIndex == 0 && this.subRecordingIndex == 0) {
                this.startTime = performance.now();
                this.elapsedTime = 0;
                this.elapsedRecTime = 0;
                this.playTimePreviousSeconds = 0;
                this.reserveTime = 0;
                var recPlayCont = document.getElementById("recPlay");
                this.doControlActive(recPauseCont);
            }

            if (typeof this.playTimeout != 'undefined' && this.playTimeout != "") {
                clearTimeout(this.playTimeout);
            }

            if (!this.hasOwnProperty('playTime')) {
                this.subRecordings = this.masterRecordings[this.masterIndex];
                io.cfg = JSON.parse(this.subRecordings[this.subRecordingIndex].recObjs);
                virtualclass.gObj.uRole = 's'; //if teacher sets there would ask for choose screen share
            }
        },

        executePacketToPlay() {
            this.calcPlayTime();
            this.playTimeout = setTimeout(() => {
                this.triggerPlayProgress();
                try {
                    if (this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"cf":"sync"') < 0) {
                        // console.log('Execute real packet', this.subRecordings[this.subRecordingIndex].recObjs);
                        // console.log("==== ElapsedTime playtime ", this.playTime + ' index='+this.masterIndex + ' subindex'+ this.subRecordingIndex);
                        io.onRecMessage(this.convertInto({data: this.subRecordings[this.subRecordingIndex].recObjs}));
                        if (virtualclass.currApp == 'Poll' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1) {
                            virtualclass.poll.recordStartTime = {
                                app: 'Poll',
                                data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                            }
                        } else if (virtualclass.currApp == 'Video' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"videoUl":{"content_path"') > -1) {
                            virtualclass.videoUl.videoStartTime = {
                                app: 'Video',
                                data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                            }
                            console.log('Capture video');
                        } else if (virtualclass.currApp == 'Quiz' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"quiz":{"quizMsg":"stdPublish",') > -1) {
                            virtualclass.quiz.quizStartTime = {
                                app: 'Quiz',
                                data: {masterIndex: this.masterIndex, subIndex: this.subRecordingIndex}
                            };
                        } else if (virtualclass.settings.recording.trimRecordings && this.masterRecordings[this.masterIndex][this.subRecordingIndex].recObjs.indexOf('{"ac":false,"cf":"recs"') > -1) {
                            virtualclass.recorder.selfSeek();
                        }
                    }
                } catch (e) {
                    console.log('PLAY ERROR ' + e.errorCode);
                }
                this.calcPlayTimeNext();
                this.play();
            }, this.playTime);
        },


        isPlayFinished (){
            return ((typeof this.masterRecordings[this.masterIndex] == 'undefined') &&
                (typeof this.subRecordings == 'undefined' || typeof this.subRecordings[this.subRecordingIndex] == 'undefined') ||
                ((typeof this.subRecordings != 'undefined' && typeof this.subRecordings[this.subRecordingIndex] != 'undefined') &&
                this.subRecordings[this.subRecordingIndex].type == 'J' &&
                this.subRecordings[this.subRecordingIndex].recObjs.indexOf('{"sEnd"') > -1)
            );
        },

        triggerPauseVideo (){
            var playAct = document.querySelector("#dispVideo");
            if (virtualclass.videoUl && virtualclass.videoUl.player) {
                console.log('VIDEO IS PAUSED');
                virtualclass.videoUl.player.pause();
                virtualclass.videoUl.isPaused = true;
            }
        },


        triggerPlayVideo (){
            if (virtualclass.currApp == 'Video' && virtualclass.videoUl && virtualclass.videoUl.player) {
                console.log('VIDEO IS Played');
                virtualclass.videoUl.player.play();
                virtualclass.videoUl.isPaused = false;
            }
        },

        askAgainToPlay () {
            if (this.subRecordings && this.subRecordings[this.subRecordingIndex].recObjs.indexOf('sEnd') < 0) {
                var e = {data: this.subRecordings[this.subRecordingIndex].recObjs};
                // e.data = this.subRecordings[this.subRecordingIndex].recObjs;
                io.onRecMessage(this.convertInto(e));
            }

            if (!virtualclass.recorder.allFileFound) {
                virtualclass.recorder.waitServer = true;
                virtualclass.recorder.waitPopup = false;
                this.displayWaitPopupIfNot();

            } else {
                //Play finished here
                if (virtualclass.recorder.allFileFound) {
                    this.initReplayWindow()
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

        initReplayWindow  (){
            this.triggerPauseVideo();
            virtualclass.popup.replayWindow();
            virtualclass.popup.sendBackOtherElems();
            document.getElementById('replayClose').addEventListener('click',
                function () {
                    window.close(); //handle to moodle way
                }
            );
            document.getElementById('replayButton').addEventListener('click', function () {
                virtualclass.recorder.controller.pause = false;
                virtualclass.recorder.replayFromStart.call(virtualclass.recorder);

            });
        },


        /** TODO, this should handle in proper way **/
        getCurrentPacket (){
            let currrentPacket = 0;
            if (this.masterIndex > 0) {
                for (let i = 0; i < this.masterIndex; i++) {
                    currrentPacket += this.masterRecordings[i].length;
                }
            }
            return (currrentPacket + this.subRecordingIndex);
        },

        collectElapsedPlayTime () {
            this.elapsedPlayTime += this.subRecordings[this.subRecordingIndex].playTime;
            // console.log("==== elapsedPlayTime ",this.elapsedPlayTime);
        },

        triggerPlayProgress () {
            this.collectElapsedPlayTime();
            if (this.masterIndex == 0 && this.subRecordingIndex == 0) {
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
            if (typeof this.subRecordings[this.subRecordingIndex] == 'object') {
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


        initController: function () {
            var playControllerCont = document.getElementById('playControllerCont');
            if (playControllerCont != null) {

                var that = this;
                //init fast forward
                var recButton = document.getElementsByClassName('ff');
                for (var i = 0; i < recButton.length; i++) {
                    recButton[i].onclick = function () {
                        var ffBy = this.id.split('ff')[1];
                        that.controller.fastForward(parseInt(ffBy, 10));
                        var pauseAct = document.querySelector("#dispVideo");
                        if (virtualclass.videoUl && virtualclass.videoUl.player && pauseAct.classList.contains("vjs-paused")) {
                            virtualclass.videoUl.player.play();
                        }

                        if (this.parentNode.id != 'replayFromStart') {
                            that.doControlActive(this)
                        }
                    };
                }

                var that = this;
                var recPause = document.getElementById('recPause');
                recPause.addEventListener('click', function () {
                    if (recPause.parentNode.classList.contains('recordingPlay')) {
                        that.initRecPause();
                    } else {
                        that.initRecPlay();
                    }
                });
            }
        },


        initRecPause (){
            var recPause = document.getElementById('recPause');
            this.controller._pause();
            this.doControlActive(recPause);
            virtualclass.recorder.triggerPauseVideo();
            recPause.parentNode.classList.remove("recordingPlay");
            recPause.dataset.title = 'Play';
        },

        initRecPlay (){
            var recPause = document.getElementById('recPause');
            this.controller._play();
            this.doControlActive(recPause);
            if (virtualclass.videoUl && virtualclass.videoUl.player) {
                virtualclass.videoUl.player.play();
            }
            recPause.parentNode.classList.add("recordingPlay");
            recPause.dataset.title = 'Pause';
        },

        doControlActive: function (elem) {
            var controlButtons = document.getElementById('playControllerCont').getElementsByClassName('recButton');
            for (var i = 0; i < controlButtons.length; i++) {
                controlButtons[i].classList.remove("controlActive");
            }
            elem.parentNode.classList.add("controlActive");
        },

        controller: {
            pause: false,
            ff: 1,
            _play: function () {
                virtualclass.recorder.startTime = performance.now();
                this.ff = 1;
                this.pause = false;
                virtualclass.recorder.play();
                console.log('====== Recording play');
            },

            _pause: function () {
                this.pause = true;
                console.log('====== Recording pause');
            },

            fastForward: function (by) {
                this.ff = by;
                this.pause = false;
                virtualclass.recorder.play();
            }
        },

        sendData: function (data, url, cb) {
            this.cb = cb;
            var params = JSON.stringify(data);
            this.httpObj.open('POST', url);

            this.httpObj.setRequestHeader('x-api-key', wbUser.lkey);

            this.httpObj.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
            this.httpObj.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);

            this.httpObj.setRequestHeader('x-congrea-room', wbUser.room);
            this.httpObj.setRequestHeader('Content-Type', 'application/json');
            this.httpObj.withCredentials = false;
            this.httpObj.send(params);
        },


        sortingFiles (list) {
            function compare(a, b) {
                if (a < b)
                    return -1;
                if (a > b)
                    return 1;
                return 0;
            }

            return list.sort(compare);
        },

        setOrginalListOfFiles (list) {
            var data = {};
            for (let i = 0; i < list.length; i++) {
                if ((list[i + 1] != null)) {
                    data[list[i]] = {index: i, next: list[i + 1]};
                } else {

                    data[list[i]] = {index: i, next: 'end'};

                }
                // data[list[i]] = (list[i + 1] != null) ? {index : i, next : list[i+1]} : {index : i, next : 'end'};

            }
            return data;
        },

        triggerDownloader (){
            console.log('Init trigger time to request 1');
            this.tryNumberOfTimes = 1;
            if (this.hasOwnProperty('triggerDownloaderTime')) {
                clearInterval(this.triggerDownloaderTime);
            }
            if (this.hasOwnProperty('startTimeCounter')) {
                clearInterval(this.startTimeCounter);
            }

            let timerCounter = 0;
            this.startTimeCounter = setInterval(() => {
                timerCounter++;
                console.log('=====Timer ===' + timerCounter);
            }, 1000);

            this.triggerDownloaderTime = setInterval(() => {
                console.log('Init trigger time to request 2');
                if (this.tryNumberOfTimes > 3) {
                    virtualclass.recorder.allFileFound = true;
                    clearInterval(this.triggerDownloaderTime.triggerDownloaderTime);
                    if (this.isPlayFinished()) {
                        this.askAgainToPlay();
                    }

                } else {
                    virtualclass.xhrn.sendData({session: this.session}, virtualclass.api.recordingFiles, this.afterDownloadingList.bind(this));
                }

                console.log('Time to request ' + TIME_TO_REQUEST);

            }, TIME_TO_REQUEST); // 3 is now, but that could be 5 minute
        },

        afterDownloadingList (data) {
            var rawData = JSON.parse(data);
            if (rawData != null && rawData.hasOwnProperty('Item')) {
                var sessionStart = +(rawData.Item.time.N);
                var currentTime = new Date().getTime();
                this.sessionStartTime = (currentTime - sessionStart);

                /** Removing element, if there in any **/
                let listOfFiles = [...new Set(rawData.Item.list.L.map(item => item.S))];
                var tempListOfFilesLength = listOfFiles.length;

                if (this.lastRecordings && (listOfFiles.length == this.lastRecordings)) {
                    this.tryNumberOfTimes = (!this.tryNumberOfTimes ) ? 1 : ++this.tryNumberOfTimes;
                } else {
                    delete this.alreadyCalcTotTime;
                    this.totalRecordingFiles = this.sortingFiles(listOfFiles);
                    this.lastFile = this.totalRecordingFiles[this.totalRecordingFiles.length - 1];

                    this.orginalListOfFiles = this.setOrginalListOfFiles(this.totalRecordingFiles);

                    this.calculateTotalPlayTime();

                    var fileName = this.totalRecordingFiles.shift();
                    this.requestDataFromServer(fileName);

                    if (this.totalRecordingFiles.length > 0) {
                        var NextfileName = this.totalRecordingFiles.shift(); // Call Next
                        this.requestDataFromServer(NextfileName);
                    }

                    if (this.sessionStartTime < RECORDING_TIME) {
                        this.triggerDownloader();
                    }

                }
                this.lastRecordings = tempListOfFilesLength;
            } else {
                this.tryNumberOfTimes = (!this.tryNumberOfTimes ) ? 1 : ++this.tryNumberOfTimes;
                this.triggerDownloader();
            }
        },

        requestListOfFiles () {
            this.session = wbUser.session
            virtualclass.popup.loadingWindow();
            virtualclass.xhrn.sendData({session: virtualclass.recorder.session}, virtualclass.api.recordingFiles, this.afterDownloadingList.bind(this));
        },

        calculateTotalPlayTime (){
            var firstTime = Math.trunc(+(virtualclass.recorder.totalRecordingFiles[0].split("-")[0]) / 1000000); // converting nano to seconds
            var lastTime = Math.trunc(+(virtualclass.recorder.totalRecordingFiles[virtualclass.recorder.totalRecordingFiles.length - 1].split("-")[1].split(".")[0]) / 1000000);
            // converting nano to seconds

            // this.totalTimeInMiliSeconds = (lastTime - firstTime);

            this.lastTimeInSeconds = Math.trunc(lastTime / 1000);
            this.firstTimeInSeconds = Math.trunc(firstTime / 1000);
        },

        getTimeFromFile (file) {
            return (+(file.split("-")[1].split(".")[0]) / 1000000000); // Converting nanoseconds to miliseconds
        },

        totalPlayTime () {
            var totalTimeInSec = 0;
            for (var i = 0; i < virtualclass.recorder.masterRecordings.length; i++) {
                for (var j = 0; j < virtualclass.recorder.masterRecordings[i].length; j++) {
                    totalTimeInSec += virtualclass.recorder.masterRecordings[i][j].playTime;
                }
            }
            return totalTimeInSec / 1000;
        },

        getTotalTimeInMilSeconds (master, subIndex) {
            var mi = 0;
            var totalTimeInMiliSeconds = 0;
            while (mi <= master) {
                for (let i = 0; i < virtualclass.recorder.masterRecordings[mi].length; i++) {
                    totalTimeInMiliSeconds += virtualclass.recorder.masterRecordings[mi][i].playTime;
                    if ((master == mi) && (subIndex == i)) {
                        break;
                    }
                }
                mi++;
            }

            return totalTimeInMiliSeconds;
        },

        getTempTotalTimeInMilSeconds (master, subIndex) {
            var mi = 0;
            var totalTimeInMiliSeconds = 0;
            while (mi <= master) {
                for (let i = 0; i < this.orginalTimes[mi].length; i++) {
                    totalTimeInMiliSeconds += this.orginalTimes[mi][i];
                    if ((master == mi) && (subIndex == i)) {
                        break;
                    }
                }
                mi++;
            }

            return totalTimeInMiliSeconds;
        },

        getTotalElementLength () {
            var totalLength = 0;
            for (let i = 0; i < virtualclass.recorder.masterRecordings.length; i++) {
                totalLength += virtualclass.recorder.masterRecordings[i].length;
            }
            return totalLength;
        },

        seekWithMouseMove  (ev) {
            if (ev.offsetX == undefined) {
                ev = this.getOffset(ev);
            }

            if (this.startSeek) {
                this.controller._pause();
                var seekValueInPercentage = this.getSeekValueInPercentage(ev);
                this.seekValueInPercentage = seekValueInPercentage;
                if (this.downloadInPercentage < this.seekValueInPercentage) {
                    //this.seekValueInPercentage = Math.trunc(this.downloadInPercentage) - 1;
                    this.seekValueInPercentage = Math.trunc(this.downloadInPercentage);
                }
                this.setPlayProgressTime(this.seekValueInPercentage);
                var seekTimeInMilseconds = (this.seekTimeWithMove.m * 60 * 1000) + this.seekTimeWithMove.s * 1000;
                virtualclass.pbar.renderProgressBar(this.totalTimeInMiliSeconds, seekTimeInMilseconds, 'playProgressBar', undefined);
                document.querySelector('#tillRepTime').innerHTML = this.seekTimeWithMove.h + ':' + this.seekTimeWithMove.m + ':' + this.seekTimeWithMove.s;
                this.displayTimeInHover(ev, this.seekValueInPercentage);
            }
        },

        getSeekValueInPercentage (ev) {
            let containerWidth = this.getCustomWidth();
            var clickedPosition = ev.offsetX;
            let seekValueInPer = (clickedPosition / containerWidth) * 100;
            return seekValueInPer;
        },

        handlerDisplayTime (ev) {
            var seekValueInPercentage = this.getSeekValueInPercentage(ev);
            // console.log('Seek value time in percentage ' + seekValueInPercentage);
            this.displayTimeInHover(ev, seekValueInPercentage);
        },

        displayTimeInHover (ev, seekValueInPer){
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

            var timeInHover = document.getElementById('timeInHover');
            timeInHover.style.display = 'block';

            timeInHover.style.marginLeft = offset + 'px';

            document.getElementById('timeInHover').innerHTML = this.seekTimeWithMove.h + ':' + this.seekTimeWithMove.m + ':' + this.seekTimeWithMove.s;
            var virtualclassCont = document.querySelector('#virtualclassCont');
            virtualclassCont.classList.add('recordSeeking');
        },

        setPlayProgressTime (seekValueInPer) {
            var totalMiliSeconds = (seekValueInPer * this.totalTimeInMiliSeconds) / 100;
            var time = this.convertIntoReadable(totalMiliSeconds);
            this.seekTimeWithMove = time;
        },

        finalSeek (ev){
            if (!ev.offsetX) {
                ev = this.getOffset(ev);
            }
            if (this.startSeek && this.hasOwnProperty('seekValueInPercentage')) {
                console.log("====Seek up " + this.seekValueInPercentage);
                if (this.downloadInPercentage < this.seekValueInPercentage) {
                    this.seekValueInPercentage = Math.trunc(this.downloadInPercentage);
                }
                if (this.seekValueInPercentage > 0) {
                    this.seek(this.seekValueInPercentage);
                }


                if (this.pauseBeforeSeek) {
                    console.log("=== Video pause ");
                    this.controller._pause();
                    this.triggerPauseVideo();
                } else {
                    console.log("=== Video play ");
                    this.controller._play();
                    this.triggerPlayVideo();
                }
                document.getElementById('timeInHover').style.display = 'none'
            }

            var virtualclassCont = document.querySelector('#virtualclassCont');
            virtualclassCont.classList.remove('recordSeeking');


            console.log(ev.offsetX);
            delete this.seekValueInPercentage;
            this.startSeek = false;

            var congrealogo = document.getElementById('congrealogo');
            if (congrealogo != null) {
                congrealogo.classList.remove('disbaleOnmousedown');
            }
        },
    };


    window.recorder = recorder;
})(window);
