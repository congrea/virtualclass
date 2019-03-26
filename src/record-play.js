// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    const TIME_TO_REQUEST = 3 * 60 * 1000; // every request would be performeed in given milisecond
    const RECORDING_TIME = 15 * 60 * 1000; // If elapsed time goes beyond the
    function XHR  (){
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

    XHR.prototype.send = function (){
        this.cb = cb;
        this.httpObj.open("POST", file, true);
        this.httpObj.send(data);
    }

    XHR.prototype.loadData = function (url, cb){
        this.cb = cb;
        this.httpObj.open("GET", url, true);
        this.httpObj.send();
    }

    var recorder = {
        playTime : 150,
        tempPlayTime : 150,
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
        uploadInProcess : false,
        totalRecordingFiles : [],
        totalPlayTimeInMin : 0,
        totalTimeInMilSeconds : 0,
        subRecordings : null,
        attachSeekHandler : false,
        rawDataQueue : {},
        xhr : [],
        session : wbUser.session,
        elapsedPlayTime: 0,
        prevFile : null,
        refrenceTime : null,
        totalElements : 0,
        lastFileTime : null,
        lastRecordings : 0,
        firstTimeRequest : true,
        alreadyRequested : {},
        init: function () {
            if(!this.attachSeekHandler){
                var downloadProgressBar = document.querySelector('#downloadProgressBar');
                downloadProgressBar.addEventListener('click', this.seekHandler.bind(this));
                downloadProgressBar.addEventListener('mousemove', this.displayTimeInHover.bind(this));

                var playProgressBar = document.querySelector('#playProgressBar');
                playProgressBar.addEventListener('mousemove', this.displayTimeInHover.bind(this));
                playProgressBar.addEventListener('click', this.seekHandler.bind(this));
                this.attachSeekHandler = true;

                downloadProgressBar.addEventListener('mouseleave',  this.removeHandler.bind(this, downloadProgressBar));
                playProgressBar.addEventListener('mouseleave',  this.removeHandler.bind(this, playProgressBar));

                virtualclass.pageVisible(this.handlPageActiveness.bind(this));
            }

            if (!this.hasOwnProperty('prvNum')) {
                this.subRecordingIndex = 0;
                this.masterIndex = 0;
                this.subRecordings = this.masterRecordings[this.masterIndex];
                this.play();
                this.prvNum = this.masterIndex;
                // virtualclass.popup.loadingWindow();
            }
        },

        handlPageActiveness (){
            if(virtualclass.pageVisible()){
                this.controller._play();
            }else {
                this.controller._pause();
            }
        },

        removeHandler (element) {
            element.removeEventListener('click', this.seekHandler.bind(this));
            document.getElementById('timeInHover').style.display = 'none';
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

            this.alreadyAskForPlay = false;
            this.playStart = false;
            this.error = 0;
            // this.mkDownloadLink = "";
            this.elapsedPlayTime = 0;
            // this.getPlayTotTime = false;
            this.controller.ff = 1;
            this.masterRecordings = tempMasterRecordings;
           // this.playProgressBar(this.playTime, 0);
            this.playProgressBar(this.playTime);
            delete this.prvNum;
            this.init();
        },

        exportData: function (cb) {
            virtualclass.popup.openProgressBar();
            virtualclass.recorder.items = [];
            virtualclass.storage.getAllObjs(["allData"], function () {
                if (typeof cb == 'function') {
                    cb();
                }
            });
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
            console.log('total play time ' + playTime + ' elapsed time2 ' + playTime);
            if (playTime > 0) {
                virtualclass.pbar.renderProgressBar(this.totalTimeInMin * 60 * 1000 , playTime, 'playProgressBar', undefined);

                var time = this.convertIntoReadable(playTime);
                document.getElementById('tillRepTime').innerHTML = time.m + ' : ' + time.s;
                if (!this.alreadyCalcTotTime) {
                    var ttime = this.convertIntoReadable(this.totalTimeInMin * 60 * 1000);
                    document.getElementById('totalRepTime').innerHTML = ttime.m + ' : ' + ttime.s;
                    this.alreadyCalcTotTime = true;
                }
            } else {
                virtualclass.pbar.renderProgressBar((this.lastTimeInSeconds * 1000), 0, 'playProgressBar', undefined);
            }
        },

        convertIntoReadable: function (ms) {
            ms = ms/1000;
            var seconds = Math.floor(ms % 60);
            var minutes = Math.floor(ms / 60);
            return {s: seconds, m: minutes};
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
            if(this.isFileVcp(file)){
                if(!this.alreadyRequested[file]){
                    console.log('requested file ' + file);
                    // this.displayWaitPopupIfNot(virtualclass.lang.getString("plswaitwhile"));

                    var fileUrl = "https://recording.congrea.net/" + wbUser.lkey+ '/' + wbUser.room+ '/' + virtualclass.recorder.session+'/' + file;
                    virtualclass.recorder.xhr[file] =  new XHR();
                    virtualclass.recorder.xhr[file].init();
                    virtualclass.recorder.xhr[file].loadData(fileUrl, this.afterDownloading.bind(this, file));

                }else {
                    console.log('Already requested file ' + file);
                    if (virtualclass.recorder.totalRecordingFiles.length > 0){
                        var NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
                        virtualclass.recorder.requestDataFromServer(NextfileName);
                    }
                }
            }
        },

        afterDownloading (file, data) {
            if(data == 'ERROR'){
                setTimeout( ()=> { virtualclass.recorder.requestDataFromServer(file); }, 500);
            } else {
                if (virtualclass.recorder.totalRecordingFiles.length > 0){
                    var NextfileName = virtualclass.recorder.totalRecordingFiles.shift(); // Call Next
                    virtualclass.recorder.requestDataFromServer(NextfileName);

                }
                virtualclass.recorder.rawDataQueue[file] = {file: file, data : data};
                this.UIdownloadProgress(file);
                this.formatRecording(file)
                this.alreadyRequested[file] = true;
            }
        },

        isFirstPacket (file){
            var fileObj = virtualclass.recorder.orginalListOfFiles[file];
            return (fileObj != null && fileObj.index == 0);
        },

        isPacketInSerial (file) {
            if(this.prevFile != null){
              return (this.orginalListOfFiles[this.prevFile].next === file || this.orginalListOfFiles[this.prevFile].next === 'end');
            }
        },

        formatRecording (file){
            if(this.isFirstPacket(file) || this.isPacketInSerial(file) && Object.keys(this.rawDataQueue).length > 0){
                let recording = this.rawDataQueue[file];
                if(recording != null){
                    this.makeRecordingQueue(recording.file, recording.data);
                    delete this.rawDataQueue[recording.file];
                    this.prevFile = recording.file;
                    var nextFile = this.orginalListOfFiles[recording.file].next;
                    if(nextFile !== 'end' ){
                        this.formatRecording(nextFile);
                    }
                }
            }
        },

        isFileVcp (file) {
            return file != null  && file.match(/^.*\.(vcp)$/) != null;
        },

        calculateNextTime (currentTime, nextPacket) {
            metaData = nextPacket.substring(0, 21);
            data =  nextPacket.substring(22, nextPacket.length)
            var [time, type] = metaData.split(' ');
            time = Math.trunc(time / 1000000);
            return Math.trunc((time - currentTime));

        },

        insertPacketInto (chunk, miliSeconds) {
            let totalSeconds = Math.trunc(miliSeconds/1000);
            if(!isNaN(totalSeconds) && totalSeconds > 1){
                var data = {playTime : 1000, 'recObjs' : '{"0{"user":{"userid":"2"},"m":{"app":"nothing","cf":"sync"}} ', type :'J'};
                for(let s = 0; s<totalSeconds; s++){
                    chunk.push(data);
                }
                this.totalTimeInMilSeconds += miliSeconds;
            }else {
                //this.totalTimeInMilSeconds += this.tempPlayTime;
            }
            return chunk;
        },
        makeRecordingQueue(file, rawData) {
            console.log('File formatting ' + file);
            var data, metaData;
            var chunk = [];
            var nextMinus = null;
            var allRecordigns =  rawData.trim().split(/(?:\r\n|\r|\n)/g); // Getting recordings line by line

            for(var i=0; i<allRecordigns.length; i++){

                if(allRecordigns[i] != null && allRecordigns[i] != ''){
                    this.totalElements++
                    metaData = allRecordigns[i].substring(0, 21);
                    data =  allRecordigns[i].substring(22, allRecordigns[i].length)
                    var [time, type] = metaData.split(' ');
                    time = Math.trunc(time / 1000000); /** Converting time, from macro to mili seconds **/

                    if(this.refrenceTime != null){
                        if(nextMinus){
                            this.tempPlayTime = (time - this.refrenceTime ) - nextMinus;
                            nextMinus = null;
                        }else {
                            this.tempPlayTime = (time - this.refrenceTime );
                        }
                    }

                    if(data  != null && data != ''){
                        if(this.lastFileTime && i === 0){
                            let prvTotalMiliSeconds =  Math.trunc((time - this.lastFileTime));
                            console.log('Previous mili seconds ' + prvTotalMiliSeconds);
                            chunk = this.insertPacketInto(chunk, prvTotalMiliSeconds);
                            this.tempPlayTime = (prvTotalMiliSeconds > 1000) ? prvTotalMiliSeconds % 1000 : prvTotalMiliSeconds;
                        }

                        if(i === (allRecordigns.length - 1)){
                            this.lastFileTime = time;
                        }

                        chunk.push({playTime : this.tempPlayTime, 'recObjs' : data, type :type});

                        if(typeof allRecordigns[i+1] != 'undefined') {
                            let nextMiliSeconds = this.calculateNextTime(time, allRecordigns[i + 1]);
                            chunk = this.insertPacketInto(chunk, nextMiliSeconds);
                            if(nextMiliSeconds > 1000){
                                nextMinus = (Math.trunc(nextMiliSeconds/1000) * 1000);
                                this.totalTimeInMilSeconds += nextMiliSeconds % 1000;
                            } else {
                                // console.log('total time less than one seconds' + this.tempPlayTime);
                                this.totalTimeInMilSeconds += this.tempPlayTime;
                            }
                        }
                        this.refrenceTime = time;
                    }
                }

            }

            console.log('totalTime in seconds ' + (this.totalTimeInMilSeconds / 1000));
            var binData;
            for (var k = 0; k < chunk.length; k++) {
                if (chunk[k].type == 'B') {
                    binData = virtualclass.dtCon.base64DecToArr(chunk[k].recObjs);
                    chunk[k].recObjs = binData;
                }
            }

            this.masterRecordings.push(chunk);
            if(this.currentMin > 3 && this.masterRecordings.length > 0 ) { // Starts playing after 5 mins of download
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
            }
        },

        isDownloadedAllRecordings (singleFileTime) {
            if(this.sessionStartTime > RECORDING_TIME){
                return (singleFileTime >= virtualclass.recorder.lastTimeInSeconds)
            }else {
                return false;
            }

        },

        finishRequestDataFromServer (singleFileTime) {
            if(this.isDownloadedAllRecordings(singleFileTime)){
                virtualclass.recorder.allFileFound = true;
                if(!virtualclass.recorder.alreadyAskForPlay){
                    virtualclass.recorder.askToPlay("completed");
                } else {
                    var askToPlayMsg = document.getElementById('askplayMessage');
                    if(askToPlayMsg != null){
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
            virtualclass.pbar.renderProgressBar(virtualclass.recorder.totalTimeInMin, virtualclass.recorder.currentMin, 'downloadProgressBar', 'downloadProgressValue');
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


        /**
         * If packet is ready(40% for now) then ask to user for play.
         * @param downloadFinish is expecting the lable for finishing the download session
         */
        askToPlay: function (downloadFinish) {
            document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString(typeof downloadFinish != 'undefined' ? 'playsessionmsg' : 'askplayMessage');
            document.getElementById('askPlay').style.display = 'block';

            var playButton = document.getElementById("playButton");
            if (playButton != null) {
                console.log('attach event listener');
                playButton.style.display = 'block';
                playButton.addEventListener('click', this.playInt.bind(this));
            }
        },

        seekHandler (ev){
            console.log('Seek Handler');
            var clickedPosition =  ev.offsetX;

            if(ev.currentTarget.id == 'playProgressBar'){
                var totalWidth = ev.currentTarget.parentNode.offsetWidth;
            }else {
                var totalWidth = ev.currentTarget.offsetWidth;
            }

            let seekValueInPer = (clickedPosition / totalWidth) * 100;
            this.seek(seekValueInPer);
            this.controller._play();
        },

        seek (seekPointPercent) {
            let index = this.getSeekPoint(seekPointPercent);
            // console.log('Total till play, Index val master index ' + index.master + ' sub index' + index.sub + ' in percent' + seekPointPercent);
            let subLength;

            if((index.master < this.masterIndex) || (index.master == this.masterIndex && index.sub < this.subRecordingIndex) ){
                this.replayFromStart();
            }

            this.controller._pause();
            var syncMsg = null;
            var binarySyncMsg = null;
            var syncPoll = null;
            // var binarySyncUnshareMsg = null;
            while (this.masterIndex <= index.master){
                subLength = (this.masterIndex != index.master) ? this.masterRecordings[this.masterIndex].length : index.sub;
                for(let j =  this.subRecordingIndex; j < subLength; j++ ){
                    try {
                        if(this.subRecordings[this.subRecordingIndex].type != 'B'){
                           var msg =  io.cleanRecJson(this.subRecordings[this.subRecordingIndex].recObjs);
                            if(msg.indexOf('"m":{"unshareScreen"') > -1){
                                binarySyncMsg = null;
                            }else if(msg.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1){
                                // syncMsg =  {app : 'Poll', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                                virtualclass.poll.recordStartTime = {app : 'Poll', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                            }  else if (msg.indexOf('"m":{"videoUl":{"content_path"') > -1){
                                virtualclass.videoUl.videoStartTime = {app : 'Video', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                                console.log('Capture video');
                            }else if(msg.indexOf('"m":{"quiz":{"quizMsg":"stdPublish"') > -1){
                                console.log('Capture Quiz');
                                virtualclass.quiz.quizStartTime = {app : 'Quiz', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}};
                            }

                            io.onRecMessage(this.convertInto({data : msg}));
                            console.log('Execute sync packet', msg);
                        } else { // Binary
                            let msg = this.subRecordings[this.subRecordingIndex].recObjs;

                            if(msg[0] == 104 || msg[0] == 204 || msg[0] == 102 || msg[0] == 202){ // Full Image of screen share
                                if (msg[1] == 0 || msg[1] == 1) { // Either first packet or full packet
                                    binarySyncMsg = {data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}};
                                }
                            }

                            if (virtualclass.currApp == 'ScreenShare') {
                                if(msg[0] == 104 || msg[0] == 204 || msg[0] == 103 || msg[0] == 203 || msg[0] == 102 || msg[0] == 202){
                                    // console.log('Screen type', msg[0] + ' masterIndex ' + this.masterIndex + ' secondaryIndex ' + this.subRecordingIndex);
                                    io.onRecMessage(this.convertInto({data : msg}));
                                    binarySyncMsg = null;
                                }
                            }
                        }
                        this.collectElapsedPlayTime();
                    } catch (e) {
                        console.log('PLAY ERROR ' + e.errorCode);
                    }
                    this.subRecordingIndex++;
                }

                this.elapsedRecTime = this.elapsedTime = this.elapsedPlayTime;

                /* When seek point is found exit the while loop**/
                if(this.masterIndex == index.master && index.sub == this.subRecordingIndex){
                    this.triggerPlayProgress();
                    console.log('===== Elapsed time 1 ==== ' + this.elapsedPlayTime);
                    if(binarySyncMsg){
                        // this.handleSyncPacket (syncMsg, binarySyncMsg);
                        this.handleSyncPacket (binarySyncMsg);
                    }
                    this.handleSyncStringPacket();

                    console.log('Total till play time in milisecondds ' + this.elapsedPlayTime + ' execute indexes master ' + this.masterIndex + ' sub' + this.subRecordingIndex);
                    break;
                } else {
                    this.subRecordingIndex = 0;
                    this.masterIndex++;
                    this.subRecordings = this.masterRecordings[this.masterIndex];
                }
            }
            console.log('seek is finished');
        },

        handleSyncStringPacket () {
            if(virtualclass.currApp == 'Poll' && typeof virtualclass.poll.pollState.data == 'object' && virtualclass.poll.hasOwnProperty('recordStartTime')){
                var pollStartTime = this.getTotalTimeInMilSeconds(virtualclass.poll.recordStartTime.data.masterIndex, virtualclass.poll.recordStartTime.data.subIndex) ;
                if(virtualclass.poll.dataRec.setting.timer){ // showTimer() for remaining time
                    var pollData = virtualclass.poll.pollState;
                    this.pollUpdateTime(pollStartTime, pollData);
                }else {
                    var pollElapsedtime = this.elapsedPlayTime - pollStartTime;
                    var timer = this.convertIntoReadable(pollElapsedtime);
                    virtualclass.poll.dataRec.newTime.min = timer.m;
                    virtualclass.poll.dataRec.newTime.sec = timer.s;
                    virtualclass.poll.elapsedTimer();
                    // for elapsed timer
                }
            }else if(virtualclass.currApp == 'Video' && typeof virtualclass.videoUl == 'object' &&
                virtualclass.videoUl.hasOwnProperty('videoStartTime')){
                var videoStartTime = this.getTotalTimeInMilSeconds(virtualclass.videoUl.videoStartTime.data.masterIndex, virtualclass.videoUl.videoStartTime.data.subIndex) ;
                var videoElapsedtime = this.elapsedPlayTime - videoStartTime;
                virtualclass.videoUl.playVideo(videoElapsedtime/1000);
                console.log('Captured video play from ', (videoElapsedtime/1000));
            }else if(virtualclass.currApp == 'Quiz' && typeof virtualclass.quiz == 'object'){
                // virtualclass.quiz.plugin.method.completeQuiz({callback: virtualclass.quiz.plugin.config.animationCallbacks.completeQuiz});

                var timeDisplayInto  = document.querySelector('#qztime');
                var quizStartTime = this.getTotalTimeInMilSeconds(virtualclass.quiz.quizStartTime.data.masterIndex, virtualclass.quiz.quizStartTime.data.subIndex);
                if(+(virtualclass.quiz.plugin.config.quizTime) > 0){
                    var quizTimeInMiliSeconds = virtualclass.quiz.plugin.config.quizTime * 1000;
                    var quizElapsedTime = (quizTimeInMiliSeconds - (this.elapsedPlayTime - quizStartTime));
                    virtualclass.quiz.plugin.method.startTimer(quizElapsedTime/1000, timeDisplayInto, 'desc', 'vmQuiz');
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

        handleSyncPacket (binarySyncMsg) {
            if (binarySyncMsg){
                // if(binarySyncMsg != null && syncMsg.app == 'ss' && !binarySyncMsg.hasOwnProperty('unshareScreen')){
                console.log('Get full screen share');
                let startSubIndex = binarySyncMsg.data.subIndex;
                let startMindex = binarySyncMsg.data.masterIndex;

                while(startMindex <= this.masterIndex){
                    console.log('Start from master index ' + startMindex + ' from Subindex ' + startSubIndex);
                    let subRecordings =  this.masterRecordings[startMindex];
                    let subLength =  null;

                    if(this.masterIndex != startMindex){
                        subLength =  this.masterRecordings[this.masterIndex].length;
                    } else {
                        subLength =  this.subRecordingIndex;
                    }
                    let j;
                    for(j =  startSubIndex; j <= subLength; j++ ){
                        let msg = subRecordings[j] ;
                        try {
                            if(msg != null && msg.type == 'B'){
                                msg = msg.recObjs;
                                if(msg[0] == 104 || msg[0] == 204 || msg[0] == 103 || msg[0] == 203 || msg[0] == 102 || msg[0] == 202){
                                    io.onRecMessage(this.convertInto({data : msg}));
                                }
                            }else {
                                console.log('Either msg is null or string');
                            }

                        } catch (e) {
                            console.log('PLAY ERROR ' + e.errorCode);
                        }
                    }

                    if (this.masterIndex == startMindex && j == this.subRecordingIndex ){
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
            let seekVal = Math.trunc((this.totalTimeInMilSeconds * seekPointPercent ) / 100);

            /** Todo THIS should be optimize, don't use nested loop **/
            var totalTimeMil = 0;
            for (var i=0; i<this.masterRecordings.length; i++){
                for (var j=0; j<this.masterRecordings[i].length; j++){
                    totalTimeMil += this.masterRecordings[i][j].playTime;
                    if(totalTimeMil == seekVal){
                        return {master :  i, sub : j};
                    }else if (totalTimeMil >= seekVal){
                        if (j > 0) {
                            j--;
                        } else {
                            i--;
                            j = (this.masterRecordings[i].length - 1);
                        }
                        return {master :  i, sub : j};
                    }
                }
            }
        },


        play: function () {
            if (this.controller.pause) { return;}
            this.config();
            if(this.isPlayFinished()){
                if(this.allFileFound){
                    this.askAgainToPlay();
                }else {
                    /** wait till next file is downloaded**/
                    this.controller._pause();
                    virtualclass.popup.loadingWindow();
                    this.isPausedByNotPresent = true;
                }
            }else {
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
                this.doControlActive(recPlayCont);
            }

            if (typeof this.playTimeout != 'undefined' &&  this.playTimeout != "") {
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
            this.playTimeout = setTimeout(()=> {
                this.triggerPlayProgress();
                try {
                    if(this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"cf":"sync"') < 0 ){
                        // console.log('Execute real packet', this.subRecordings[this.subRecordingIndex].recObjs);
                        console.log("==== ElapsedTime playtime ", this.playTime + ' index='+this.masterIndex + ' subindex'+ this.subRecordingIndex);
                        io.onRecMessage(this.convertInto({data : this.subRecordings[this.subRecordingIndex].recObjs}));
                        if(virtualclass.currApp == 'Poll' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('},"m":{"poll":{"pollMsg":"stdPublish",') > -1){
                            virtualclass.poll.recordStartTime = {app : 'Poll', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                        }else if(virtualclass.currApp == 'Video' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"videoUl":{"content_path"') > -1){
                            virtualclass.videoUl.videoStartTime = {app : 'Video', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}}
                            console.log('Capture video');
                        } else if(virtualclass.currApp == 'Quiz' &&
                            this.subRecordings[this.subRecordingIndex].recObjs.indexOf('"m":{"quiz":{"quizMsg":"stdPublish",') > -1){
                            virtualclass.quiz.quizStartTime = {app : 'Quiz', data : {masterIndex : this.masterIndex, subIndex : this.subRecordingIndex}};
                        }
                    }
                } catch (e) {
                    console.log('PLAY ERROR ' + e.errorCode);
                }
                this.calcPlayTimeNext();
                this.play();
            }, this.playTime);
        } ,


        isPlayFinished (){
            return ((typeof this.masterRecordings[this.masterIndex]  == 'undefined') &&
                (typeof this.subRecordings == 'undefined' || typeof this.subRecordings[this.subRecordingIndex]  == 'undefined')  ||
                ((typeof this.subRecordings != 'undefined' && typeof this.subRecordings[this.subRecordingIndex]  != 'undefined') &&
                    this.subRecordings[this.subRecordingIndex].type == 'J' &&
                 this.subRecordings[this.subRecordingIndex].recObjs.indexOf('{"sEnd"') > -1)
            );
        },

        askAgainToPlay () {
            if (this.subRecordings[this.subRecordingIndex].recObjs.indexOf('sEnd') < 0) {
                var e = {data:this.subRecordings[this.subRecordingIndex].recObjs};
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
                    var playAct = document.querySelector("#dispVideo");
                    if(virtualclass.videoUl && virtualclass.videoUl.player && playAct.classList.contains("vjs-playing")){
                        virtualclass.videoUl.player.pause();
                    }
                    virtualclass.popup.replayWindow();
                    virtualclass.popup.sendBackOtherElems();
                    document.getElementById('replayClose').addEventListener('click',
                        function () {
                            window.close(); //handle to moodle way
                        }
                    );
                    document.getElementById('replayButton').addEventListener('click', function () {
                        virtualclass.recorder.replayFromStart.call(virtualclass.recorder);
                    });
                }
            }
        },

        /** TODO, this should handle in proper way **/
        getCurrentPacket (){
            let currrentPacket = 0;
            if(this.masterIndex > 0){
                for(let i=0; i< this.masterIndex; i++){
                    currrentPacket += this.masterRecordings[i].length;
                }
            }
            return (currrentPacket + this.subRecordingIndex);
        },

        collectElapsedPlayTime () {
            this.elapsedPlayTime += this.subRecordings[this.subRecordingIndex].playTime;
            console.log("==== elapsedPlayTime ",this.elapsedPlayTime);
        },

        triggerPlayProgress () {
            this.collectElapsedPlayTime();
            if(this.masterIndex == 0 && this.subRecordingIndex == 0){
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
            if((this.subRecordingIndex+1) == this.subRecordings.length){
                this.masterIndex++;
                this.subRecordings =  this.masterRecordings[this.masterIndex];
                this.subRecordingIndex =  0 ;
            }else {
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
                        if(virtualclass.videoUl && virtualclass.videoUl.player && pauseAct.classList.contains("vjs-paused")){
                            virtualclass.videoUl.player.play();
                        }

                        if(this.parentNode.id != 'replayFromStart'){
                            that.doControlActive(this)
                        }
                    };
                }

                //init play
                var recPlay = document.getElementById('recPlay');
                recPlay.addEventListener('click', function () {
                    that.controller._play();
                    that.doControlActive(this);
                    if(virtualclass.videoUl && virtualclass.videoUl.player){
                        virtualclass.videoUl.player.play();
                    }
                });

                //init pause
                var recPause = document.getElementById('recPause');
                recPause.addEventListener('click', function () {
                    that.controller._pause();
                    that.doControlActive(this);
                    if(virtualclass.videoUl && virtualclass.videoUl.player){
                        virtualclass.videoUl.player.pause();
                    }
                });

                var replayFromStart = document.getElementById('replayFromStart');
                replayFromStart.addEventListener('click', function () {
                    that.replayFromStart();
                });
            }
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
                console.log('====== video play');
            },

            _pause: function () {
                this.pause = true;
                console.log('====== video play');
            },

            fastForward: function (by) {
                this.ff = by;
                this.pause = false;
                virtualclass.recorder.play();
            }
        },

        sendData: function (data, url, cb) {
            this.cb = cb;
            var params =  JSON.stringify(data);
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
            function compare(a,b) {
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
            for(let i=0; i<list.length; i++){
                if((list[i + 1] != null)){
                    data[list[i]] = {index : i, next : list[i+1]};
                }else {

                    data[list[i]] = {index : i, next : 'end'};

                }
                // data[list[i]] = (list[i + 1] != null) ? {index : i, next : list[i+1]} : {index : i, next : 'end'};

            }
            return data;
        },

        triggerDownloader (){
            console.log('Init trigger time to request 1');
            this.tryNumberOfTimes = 1;
            if(this.hasOwnProperty('triggerDownloaderTime')){
                clearInterval(this.triggerDownloaderTime);
            }
            if(this.hasOwnProperty('startTimeCounter')){
                clearInterval(this.startTimeCounter);
            }

            let timerCounter = 0;
            this.startTimeCounter = setInterval(() => {
                timerCounter++;
                console.log('=====Timer ===' + timerCounter);
            }, 1000);

            this.triggerDownloaderTime = setInterval(() => {
                console.log('Init trigger time to request 2');
                if(this.tryNumberOfTimes > 3){
                    virtualclass.recorder.allFileFound = true;
                    clearInterval(this.triggerDownloaderTime.triggerDownloaderTime);
                    if(this.isPlayFinished()){
                        this.askAgainToPlay();
                    }

                } else {
                    virtualclass.xhrn.sendData({session : this.session}, virtualclass.api.recordingFiles, this.afterDownloadingList.bind(this));
                }

               console.log('Time to request ' + TIME_TO_REQUEST);

            }, TIME_TO_REQUEST); // 3 is now, but that could be 5 minute
        },

        afterDownloadingList (data) {
            var rawData = JSON.parse(data);
            if(rawData != null && rawData.hasOwnProperty('Item')){
                var sessionStart  =  +(rawData.Item.time.N);
                var currentTime = new Date().getTime();
                this.sessionStartTime = (currentTime - sessionStart);

                /** Removing element, if there in any **/
                let listOfFiles = [...new Set(rawData.Item.list.L.map(item => item.S))];
                var tempListOfFilesLength = listOfFiles.length;

                if(this.lastRecordings && (listOfFiles.length == this.lastRecordings)){
                    this.tryNumberOfTimes = (!this.tryNumberOfTimes ) ? 1 : ++this.tryNumberOfTimes;
                } else {
                    delete this.alreadyCalcTotTime;
                    this.totalRecordingFiles = this.sortingFiles(listOfFiles);
                    this.orginalListOfFiles = this.setOrginalListOfFiles(this.totalRecordingFiles);

                    this.calculateTotalPlayTime();

                    var fileName = this.totalRecordingFiles.shift();
                    this.requestDataFromServer(fileName);

                    if(this.totalRecordingFiles.length > 0){
                        var NextfileName = this.totalRecordingFiles.shift(); // Call Next
                        this.requestDataFromServer(NextfileName);
                    }

                    // if(this.firstTimeRequest){
                    //     if(this.sessionStartTime < RECORDING_TIME){
                    //         this.triggerDownloader();
                    //     }
                    //     this.firstTimeRequest = false;
                    // } else {
                    //     this.tryNumberOfTimes = 0;
                    //     this.triggerDownloader();
                    // }

                    if(this.sessionStartTime < RECORDING_TIME){
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
            virtualclass.popup.loadingWindow();
            virtualclass.xhrn.sendData({session : virtualclass.recorder.session}, virtualclass.api.recordingFiles, this.afterDownloadingList.bind(this));
        },

        calculateTotalPlayTime (){
            // var firstTime = this.getTimeFromFile(virtualclass.recorder.totalRecordingFiles[0].S);
            var firstTime = (+(virtualclass.recorder.totalRecordingFiles[0].split("-")[0]) / 1000000000); // converting nano to seconds
            var lastTime =  this.getTimeFromFile(virtualclass.recorder.totalRecordingFiles[virtualclass.recorder.totalRecordingFiles.length-1]);
            console.log('Total time in miliseconds ' + (lastTime - firstTime) * 1000);
            this.totalTimeInMin = (lastTime - firstTime) / 60 ;

            this.lastTimeInSeconds = lastTime;
            this.firstTimeInSeconds = firstTime;
        },

        getTimeFromFile (file) {
            return (+(file.split("-")[1].split(".")[0]) / 1000000000); // Converting nanoseconds to miliseconds
        },

        totalPlayTime () {
            var totalTimeInSec = 0;
            for(var i=0; i<virtualclass.recorder.masterRecordings.length; i++){
                for(var j=0; j<virtualclass.recorder.masterRecordings[i].length; j++){
                    totalTimeInSec += virtualclass.recorder.masterRecordings[i][j].playTime;
                }
            }
            return totalTimeInSec/1000;
        },

        getTotalTimeInMilSeconds (master, subIndex) {
            var mi  = 0;
            var totalTimeInMiliSeconds = 0;
            while(mi <= master){
                for(let i = 0; i< virtualclass.recorder.masterRecordings[mi].length; i++){
                    totalTimeInMiliSeconds += virtualclass.recorder.masterRecordings[mi][i].playTime;
                    if((master == mi) && (subIndex == i)){
                        break;
                    }
                }
                mi++;
            }

            return totalTimeInMiliSeconds;
        },

        getTotalElementLength () {
            var totalLength = 0;
            for (let i=0; i<virtualclass.recorder.masterRecordings.length; i++){
                totalLength += virtualclass.recorder.masterRecordings[i].length;
            }
            return totalLength;
        },

        displayTimeInHover (ev){

            console.log('Mouse movement with timer section');
            if(ev.currentTarget.id == 'playProgressBar'){
                var totalWidth = ev.currentTarget.parentNode.offsetWidth;
            }else {
                var totalWidth = ev.currentTarget.offsetWidth;
            }

            var clickedPosition =  ev.offsetX;
            let seekValueInPer = (clickedPosition / totalWidth) * 100;

            var totalMiliSeconds = (seekValueInPer * this.totalTimeInMilSeconds) / 100;

            var time = this.convertIntoReadable(totalMiliSeconds);

            var timeInHover = document.getElementById('timeInHover');
            timeInHover.style.display = 'block';
            timeInHover.style.marginLeft = clickedPosition + 'px';
            document.getElementById('timeInHover').innerHTML = time.m + ':' + time.s;

        }
    };
    window.recorder = recorder;
})(window);
