// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var binData;
    var e = {};
    var reqFile = 1;

    //this should be include intto recorder function

    var sentFile = 0;
    var chunkNum = 1;

    function destroyClickedElementForFirefox(event) {
        document.body.removeChild(event.target);
    }
    var errorCodes = ['VCE4', 'VCE5', 'VCE6', 'invalidcmid', 'cmidmissing', 'nomdlroot', 'usermissing', 'cnmissing', 'sesseionkeymissing', 'recorddatamissing', 'keymissing', "invalidurl", 'VCE2'];
    var fromFille = 0;
    var recorder = {
        items: [],
        recImgPlay: false,
        objn: 0,
        playTimeout: "",
        totalSent: 0,
        fileQueue: [],
        rnum: 1,
        storeDone: 0,
        emn: 0,
        allFileFound: false,
        waitServer: false,
        waitPopup: false,
        tempRecData: [],
        alreadyAskForPlay: false,
        playStart: false,
        error: 0,
        mkDownloadLink: "",
        tillPlayTime: 0,
        getPlayTotTime: false,
        /* improtfilepath : 'import.php' */
        importfilepath: window.importfilepath,
        /* exportfilepath:'export.php', */
        exportfilepath: window.exportfilepath,
        sessionKey: randomString(11),
        alreadyDownload : false,
        smallData : false,
        uploadInProcess : false,
        init: function (data) {
            //localStorage.removeItem('recObjs');
            if(typeof virtualclass.wb == 'object' ){
                var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
            }
            if (typeof myfunc != 'undefined') {
                this.objs = vcan.getStates('replayObjs');
            } else {
                var that = this;
                if (data == 'fromplay') {
                    virtualclass.storage.getAllObjs(["allData"], function () {
                        that.play();
                    });

                } else {
                    if (!this.hasOwnProperty('prvNum')) {
                        var i = 0;
                    } else {
                        i = this.prvNum;
                    }

                    var tempData = data;

                    //TODO, this should be adjust at below loop
                    for (var m = 0; m < tempData.length; m++) {
                        this.items.push(tempData[m]);
                    }

                    for (k = 0; k < tempData.length; k++) {
                        if (tempData[k].hasOwnProperty('bd')) {
                            if (tempData[k].bd == 'a') {
                                binData = virtualclass.dtCon.base64DecToArrInt(tempData[k].recObjs);
                            } else if (tempData[k].bd == 'c') {
                                binData = virtualclass.dtCon.base64DecToArrclm(tempData[k].recObjs);
                            }
                            this.items[i].recObjs = binData;
                            for (var j = 0; j < binData.length; j++) {
                                this.items[i].recObjs[j] = binData[j];
                            }
                        }
                        i++;
                    }

                    if (!this.hasOwnProperty('prvNum')) {
                        that.play();
                    }
                    this.prvNum = i;
                }
            }
        },
        
        initMakeAvailDownloadFile : function (){
            virtualclass.gObj.downloadProgress = true;
            virtualclass.recorder.dataCame = setTimeout(
                function (){
                    if(virtualclass.recorder.hasOwnProperty('recordDone')){
                        if(!virtualclass.recorder.alreadyDownload){
                           console.log('Recorder:- From Interval');
                           virtualclass.recorder.makeAvailDownloadFile();
                        }

                        // clearInterval(virtualclass.recorder.dataCame);
                        // There was calling fequenlty event after clear the interval, because of which there is trying make file for
                        // download

                        clearTimeout(virtualclass.recorder.dataCame);
                    }
                }

            ,1500);
        },

        replayFromStart: function () {
            var tempItems = [];
            tempItems = this.items;
            virtualclass.storage.config.endSession();
            virtualclass.popup.closeElem();

            // For disable the common chant on every replay from start
            disCommonChatInput();

            this.recImgPlay = false;
            this.objn = 0;
            this.playTimeout = "";
            this.totalSent = 0;
            this.fileQueue = [];
            this.rnum = 1;
            this.storeDone = 0;
            this.emn = 0;
            //76this.allFileFound= false;
            this.waitServer = false;
            this.waitPopup = false;
            this.tempRecData = [];
            this.alreadyAskForPlay = false;
            this.playStart = false;
            this.error = 0;
            this.mkDownloadLink = "";
            this.tillPlayTime = 0;
            this.getPlayTotTime = false;
            this.controller.ff = 1;
            this.items = tempItems;
            this.playProgressBar();
            this.play();

        },

        startUploadProcess: function () {
            virtualclass.recorder.startUpload = true;
            virtualclass.recorder.uploadInProcess=true;
            virtualclass.recorder.exportData(function () {});
            virtualclass.popup.sendBackOtherElems();
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

        clearPopups: function () {
            virtualclass.popup.closeElem();
            virtualclass.pbar.renderProgressBar(0, 0, 'progressBar', 'progressValue');
            virtualclass.storage.config.endSession();
        },

        playProgressBar: function () {
            //CONVERT [{pt : 560}, {pt : 160}] TO 720
            if (!this.getPlayTotTime) {
                this.totPlayTime = this.items.reduce(function (a, b) { // a = previous value, b = current value
                    if (b.hasOwnProperty('playTime')) {
                        return {playTime: a.playTime + b.playTime};  //at each iteration of reduce there is need to expect paramter as object
                    } else {
                        return a.playTime;
                    }
                });
                this.getPlayTotTime = true;
            }


            if (this.tillPlayTime > 0) {
                if (this.tillPlayTime > this.totPlayTime) {
                    this.tillPlayTime = this.totPlayTime;
                }

                virtualclass.pbar.renderProgressBar(this.totPlayTime, this.tillPlayTime, 'playProgressBar', undefined);

                var time = this.convertIntoReadable(this.tillPlayTime);
                document.getElementById('tillRepTime').innerHTML = time.m + ' : ' + time.s;

                if (typeof alreadyCalcTotTime == 'undefined') {
                    var ttime = this.convertIntoReadable(this.totPlayTime);
                    document.getElementById('totalRepTime').innerHTML = ttime.m + ' : ' + ttime.s;
                    alreadyCalcTotTime = true;
                }
            } else {
                virtualclass.pbar.renderProgressBar(this.totPlayTime, 0, 'playProgressBar', undefined);
            }
        },

        convertIntoReadable: function (ms) {
            var x = ms / 1000;
            var seconds = Math.floor(x % 60);
            var minutes = Math.floor(x / 60);
            return {s: seconds, m: minutes};
        },

        xhrsenddata: function (rnum, err, cb) {
            if (typeof err != 'undefined') {
                virtualclass.recorder.error = 1;
            }

            if (typeof cb != 'undefined') {
                virtualclass.recorder.mkDownloadLink = cb; // mkDownloadLink should be localize
            }

            //this is not happend but in any case
            if (virtualclass.recorder.storeDone == 1) {
                return;
            }

            if (typeof earlierTimeout != 'undefined') {
                clearTimeout(earlierTimeout);
            }

            if ((typeof rnum == 'undefined') || rnum == '') {
                var rnum = 'first';
            }

            
            virtualclass.recorder.rnum = rnum;
            
            virtualclass.storage.getrowData(['chunkData'], function (dObj, frow) {
                if(chunkNum == 1 && dObj.hasOwnProperty('rdata')){
                    virtualclass.recorder.rdlength = dObj.rdata.length;
                }
                
                if ((typeof dObj == 'string' || typeof dObj == 'undefined')) {
                    earlierTimeout = setTimeout(
                        function () {
                            virtualclass.recorder.xhrsenddata(virtualclass.recorder.rnum);
                        },
                        1000
                    );
                } else {
                    // this has been performed when all files are stored
                    if ((dObj.hasOwnProperty('status')) && (dObj.status == 'done')) {
                        console.log("should invoked download function on ");
                        virtualclass.recorder.storeDone = 1;
                        console.log('From here actuall recorder finished');
                        if (typeof virtualclass.recorder.mkDownloadLink != 'undefined' && ((virtualclass.recorder.mkDownloadLink != ""))) {
                            virtualclass.recorder.mkDownloadLink();
                        } else {

                            var recordSetTimeout = 1000;
                            setTimeout(
                                function () {
                                    virtualclass.recorder.afterRecording();
                                },
                                recordSetTimeout
                            );
                        }
                        return;
                    }

                    if (typeof frow != 'undefined') {
                        virtualclass.recorder.rnum = frow;
                    }

                    if (virtualclass.recorder.error == 1) {
                        if (virtualclass.recorder.storeDone == 0) {
                            virtualclass.recorder.xhrsenddata(virtualclass.recorder.rnum, 'error');
                            virtualclass.recorder.rnum++;
                        }
                    } else {
                        var formData = new FormData();
                        formData.append("record_data", JSON.stringify(dObj));
                        formData.append("user", virtualclass.gObj.uid);
                        formData.append("cn", chunkNum);
                        formData.append('sesseionkey', virtualclass.recorder.sessionKey);

                        ////TODO: display progress after file save
                        //virtualclass.pbar.renderProgressBar(dObj.totalStore, dObj.totalSent, 'progressBar', 'progressValue');

                        virtualclass.recorder.items = []; //empty on each chunk sent
                        if(roles.isStudent() && virtualclass.gObj.has_ts_capability){
                            //this fake path is for let technical support download the file
                            var importfilepath = "https://local.vidya.io/fake.php";  
                        } else {
                            var importfilepath = this.importfilepath;
                        } 
                        
                        virtualclass.xhr.send(formData, importfilepath, function (msg) { //TODO Handle more situations
                            //TODO: display progress after file save
                            //Recording is finished //upload finished
                            if (msg === "done") {
                                virtualclass.pbar.renderProgressBar(dObj.totalStore, dObj.totalSent, 'progressBar', 'progressValue');
                                virtualclass.recorder.rnum++;
                                chunkNum++;
                                virtualclass.recorder.xhrsenddata(virtualclass.recorder.rnum);
                            } else if (msg === "ERROR") {
                                //TODO Show msg to user
                                //virtualclass.recorder.tryForReTransmit();
                                virtualclass.recorder.initMakeAvailDownloadFile();
                            } else {
                                //TODO Show msg to user
                                //create function & pass error msg as param
                               if(errorCodes.indexOf(msg) >= 0){
                                   var totProgressCont = document.querySelector('#totProgressCont');
                                   var errorCont = document.querySelector('#totProgressCont .recordingError');

                                   if(errorCont == null){
                                       var divCreated = "<div class='recordingError'>"+virtualclass.lang.getString(msg)+"</div>";
                                       totProgressCont.insertAdjacentHTML('afterbegin', divCreated);
                                   }else {
                                       errorCont.innerHTML = virtualclass.lang.getString(msg);
                                   }

                                   if(roles.hasAdmin()){
                                       virtualclass.recorder.initMakeAvailDownloadFile();
                                   }
                               } else {
                                  console.log("Error message not found");
                               }
                            }
                        });
                    }
                }
            }, virtualclass.recorder.rnum);

        },

        uploadFinishedBox : function (){
            var recordFinishedMessageBox = document.getElementById('recordFinishedMessageBox');
            recordFinishedMessageBox.style.display = 'block';
            this.initRecordFinishEvent('recordingClose');
            //this.initRecordFinishEvent('recordingCloseButton');
        },

        initRecordFinishEvent : function (id){
           var recordingHeaderCont = document.getElementById('recordingHeader');
            //recordingHeaderCont.innerHTML = virtualclass.lang.getString('uploadsessionfinish'); // reset the value for upload message for next time
            recordingHeaderCont.innerHTML = ''; // reset the value for upload message for next time
            //recordingHeaderCont.classList.add('removeHeader');
            recordingHeaderCont.parentNode.classList.add('removeHeader');

            // For clear session If user does refresh page without click on close button
            virtualclass.recorder.doSessionClear = true;
            var recordingCloseElem = document.getElementById(id);
            recordingCloseElem.addEventListener('click', function (){
                    virtualclass.recorder.uploadInProcess = false;
                setTimeout(
                    function (){
                        delete virtualclass.recorder.doSessionClear;
                        var recordingContainer = document.getElementById('progressContainer');
                        recordingContainer.style.display = 'block';

                        var recordFinishedMessageBox = document.getElementById('recordFinishedMessageBox');
                        recordFinishedMessageBox.style.display = 'none';
                        recordingHeaderCont.innerHTML = virtualclass.lang.getString('uploadsession') //Set default message

                        //recordingHeaderCont.classList.remove('removeHeader');
                        recordingHeaderCont.parentNode.classList.remove('removeHeader');

                        virtualclass.recorder.startNewSessionAfterFinish();
                        console.log('Socket ' + io.sock.readyState);
                        virtualclass.popup.closePopup(); // Does not need popup, it says application is trying to connect
                        io.disconnect();
                        setTimeout(
                            function(){
                                if(io.sock.readyState != 1){
                                    // wait and see if there application is connected by io
                                    // if not connect, connect it
                                    io.wsconnect();
                                }
                            }, 1500
                        );

                    }, 300
                );
            });
        },

        startNewSessionAfterFinish : function (){
            var recordingContainer = document.getElementById('recordingContainer');
            recordingContainer.classList.add('recordingFinished');

            console.log('Record :- after recording');
            notSend = "nosend";
            virtualclass.clearSession(notSend);

            virtualclass.pbar.renderProgressBar(0, 0, 'progressBar', 'progressValue');
            virtualclass.pbar.renderProgressBar(0, 0, 'indProgressBar', 'indProgressValue');
            recordingContainer.classList.remove('recordingFinished');
        },

        afterRecording: function () {
            chunkNum = 1;
            virtualclass.recorder.rdlength  = 0;
            var progressBarContainer = document.getElementById('progressContainer');
            progressBarContainer.style.display = 'none';
            virtualclass.recorder.uploadFinishedBox();

        },


        makeAvailDownloadFile: function () {
            console.log('Recorder:- DOWNLLOAD MESSAGE');
            // var pbar = document.getElementById('recordingContainer');
            var pbar = document.getElementById('recordingContainer')
            var elemDisp = window.getComputedStyle(pbar).display;
            if(elemDisp == 'none' || elemDisp != 'block'){
                // if there is another popup, we displays the download popup
                // this happens when user is disconnected
                // and try to reconnect, we do display the popup for download session
                // set timeout set because there is multiple tries for connection which is a problem

                setTimeout(
                    function (){
                        virtualclass.popup.openProgressBar();
                        io.disconnect();
                    }, 3000
                );
            }


            var downloadLinkCont = document.getElementById('downloadFileCont');
            if(downloadLinkCont == null){
                downloadLinkCont = document.createElement('div');
                downloadLinkCont.id = "downloadFileCont";
            }


            var downloadMsg = document.createElement('div');
            downloadMsg.id = "errormsessage";
            downloadMsg.innerHTML = virtualclass.lang.getString('msgForDownloadStart');

            var progressContainer = document.getElementById('progressContainer');
            progressContainer.style.display = 'none';

            downloadLinkCont.appendChild(downloadMsg);
            var pbar2 = document.querySelector('#recordingContainer .rv-vanilla-modal-body');
            pbar2.appendChild(downloadLinkCont);

            this.alreadyDownload = true;
            var that = this;
            
            virtualclass.storage.getAllDataForDownload(['chunkData'], function (data) {
                // diconnecting with others for prevent to send any unknown packets.
                virtualclass.gObj.saveSession = true;
                var downloadButton = document.createElement('button');
                downloadButton.id = 'downloadButton';
                downloadButton.className = 'cgText';
                downloadButton.innerHTML = virtualclass.lang.getString('downloadFile');


                var downloadLink = document.createElement('a');
                downloadLink.id = "dlink";
                downloadLink.href = "";
                downloadLink.download = "session.vcp";
                downloadLink.innerHTML = virtualclass.lang.getString('download');
                if(roles.isStudent() && virtualclass.gObj.has_ts_capability){
                     downloadMsg.innerHTML = virtualclass.lang.getString('filetsaveTS');
                } else {
                    downloadMsg.innerHTML = virtualclass.lang.getString('filenotsave');
                }
                
                
                downloadLinkCont.appendChild(downloadButton);
                var recordingHeaderCont = document.getElementById('recordingHeader');
                recordingHeaderCont.innerHTML = virtualclass.lang.getString('downloadFile');

                var textFileAsBlob = new Blob([data], {type: "application/virtualclass"});
                if (virtualclass.hasOwnProperty('prevScreen') && virtualclass.prevScreen.hasOwnProperty('currentStream')) {
                    virtualclass.prevScreen.unShareScreen();
                }

                downloadButton.addEventListener('click', function () {
                    //virtualclass.clearSession();
                    if (window.webkitURL != null) {
                        // Chrome allows the link to be clicked
                        // without actually adding it to the DOM.
                        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                    } else {
                        // Firefox requires the link to be added to the DOM
                        // before it can be clicked.
                        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                        downloadLink.onclick = destroyClickedElementForFirefox;
                        document.body.appendChild(downloadLink);
                    }
                    downloadLink.click();


                    recordingHeaderCont = document.getElementById('recordingHeader');
                    recordingHeaderCont.innerHTML = virtualclass.lang.getString('uploadsession'); // reset the value for upload message for next time
                    downloadLinkCont.parentNode.removeChild(downloadLinkCont);
                    progressContainer.style.display = 'block';
                    if(virtualclass.recorder.hasOwnProperty('dataCame')){
                        clearTimeout(virtualclass.recorder.dataCame);
                    }
                    
                    delete virtualclass.gObj.saveSession;
                    
                    if(!virtualclass.gObj.has_ts_capability){
                        virtualclass.clearSession();
                        io.disconnect(); // there was not completely disconnected
                        io.init(virtualclass.uInfo); // During the download session we don't try for new socket connection but here.
                    }else {
                        that.alreadyDownload = false;
                        if(virtualclass.recorder.hasOwnProperty('startUpload')){
                            delete virtualclass.recorder.startUpload;
                        }

                        if(virtualclass.gObj.hasOwnProperty('downloadProgress')){
                            delete virtualclass.gObj.downloadProgress;
                        }
                        virtualclass.recorder.storeDone = 0;
                        virtualclass.popup.closeElem();
                    }

                    virtualclass.popup.closePopup();
                });
            });
        },

        sendDataToServer: function () {
            var that = this;

            var t = virtualclass.storage.db.transaction(["chunkData"], "readwrite");
            var objectStore = t.objectStore("chunkData");
            objectStore.clear();

            virtualclass.popup.waitBlockAction('none');

            if (!!window.Worker) {
                mvDataWorker.postMessage({
                    rdata: virtualclass.recorder.items,
                    //  totalStored: virtualclass.storage.totalStore,
                    makeChunk: true
                });

                // Every time the data is sending, the function
                // is declaring as expression which is not good
                mvDataWorker.onmessage = function (e) {
                    if(e.data.hasOwnProperty('done_problem')){
                        console.log('done problem');
                        // TODO this should be removed
                    }else if(e.data.hasOwnProperty('status')){
                        if(e.data.status == 'done'){
                            console.log('Recorder:- done');
                            delete virtualclass.recorder.startUpload;

                            virtualclass.recorder.recordDone = true;
                        }
                    }
                    virtualclass.storage.chunkStorage(e.data);
                }
            }
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

        /**
         * vcSessionId =  recording session id
         * reqFile = File number (starting from 1)
         **/
        requestDataFromServer: function (vcSessionId, reqFile) {
            this.displayWaitPopupIfNot(virtualclass.lang.getString("plswaitwhile"));
            var formData = new FormData();
            //formData.append("record_data", "true");
            formData.append("prvfile", reqFile);
            formData.append("fileBundelId", vcSessionId);
            //formData.append("user", virtualclass.gObj.uid);

            /* Course moudle id is required by Moodle 
             * for validation and security. In export file path
             * cmid is attached as query string. Here we extract
             * name & value of query string and passed to moodle
             * play_recording file
             */
            var urlquery = getUrlVars(exportfilepath);
            if(urlquery.hasOwnProperty('cmid')){
                formData.append("id", urlquery.cmid);
            }

            //virtualclass.xhr.send("record_data=true&prvfile="+reqFile+"&user="+virtualclass.gObj.uid, 'export.php', function
            virtualclass.xhr.send(formData, exportfilepath, function
                    (data) {
                    virtualclass.recorder.sendToWorker(data, vcSessionId);
                }
            );
        },

        sendToWorker: function (encodeData, vcSessionId) {
            if (!!window.Worker) {
                mvDataWorker.postMessage({
                    rdata: encodeData,
                    getData: true
                });

                mvDataWorker.onmessage = function (e) {

                    reqFile++;
                    var isUptoBase = virtualclass.recorder.isUptoBaseValue(e.data.alldata.totalSent, e.data.alldata.totalStore, 30);

                    virtualclass.recorder.ctotalStore = e.data.alldata.totalStore;
                    virtualclass.recorder.ctotalSent = e.data.alldata.totalSent;


                    virtualclass.pbar.renderProgressBar(e.data.alldata.totalStore, e.data.alldata.totalSent, 'downloadProgressBar', 'downloadProgressValue');

                    if (isUptoBase && !virtualclass.recorder.alreadyAskForPlay) {
                        if (e.data.alldata.totalSent > e.data.alldata.totalStore) {
                            virtualclass.recorder.askToPlay("completed");
                        } else {
                            virtualclass.recorder.askToPlay();
                        }

                        virtualclass.recorder.alreadyAskForPlay = true;
                        virtualclass.recorder.tempRecData.push(e.data.alldata.rdata);
                    } else if (isUptoBase && virtualclass.recorder.playStart && virtualclass.recorder.waitServer == false) {
                        virtualclass.recorder.init(e.data.alldata.rdata);
                    } else {
                        virtualclass.recorder.tempRecData.push(e.data.alldata.rdata);
                        if (virtualclass.recorder.waitServer == true) {
                            virtualclass.recorder.alreadyPlayed = true;
                        }
                    }


                    if (!e.data.alldata.rdata[e.data.alldata.rdata.length - 1].hasOwnProperty('sessionEnd')) {
                        console.log("request file");
                        virtualclass.recorder.requestDataFromServer(vcSessionId, reqFile);
                    } else {
                        console.log('Request file  Finished Here');
                        virtualclass.recorder.allFileFound = true;

                        if (virtualclass.recorder.waitServer == true) { //if earlier replay is interrupt
                            virtualclass.storage.config.endSession();
                            var mainData = virtualclass.recorder.tempRecData.reduce(function (a, b) {
                                return a.concat(b);
                            });

                            virtualclass.recorder.objn = 0;
                            virtualclass.recorder.init(mainData);
                            virtualclass.recorder.play();
                            virtualclass.recorder.waitServer = false;
                            virtualclass.popup.closeElem();

                        }
                    }
                }
            }
        },


        playInt: function () {
            //convert [[1, 3], [3, 5]] TO [1, 3, 3, 5]
            var mainData = virtualclass.recorder.tempRecData.reduce(function (a, b) {
                return a.concat(b);
            });
            virtualclass.popup.closeElem();
            virtualclass.recorder.init(mainData);
            virtualclass.recorder.playStart = true;
            virtualclass.recorder.tempRecData.length = 0;
            localStorage.setItem('mySession', 'thisismyplaymode');
            virtualclass.recorder.initController();

//                var playController = document.getElementById('playController');
//                playController.style.display = 'block';
        },


        /**
         * If packet is ready(40% for now) then ask to user for play.
         * @param downloadFinish is expecting the lable for finishing the download session
         */
        askToPlay: function (downloadFinish) {
            if (typeof downloadFinish != 'undefined') {
                document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('playsessionmsg');

            } else {

                document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('askplayMessage');
            }

            var askPlayCont = document.getElementById('askPlay');
            askPlayCont.style.display = 'block';

            var that = this;
            var playButton = document.getElementById("playButton");
            if (playButton != null) {
                playButton.style.display = 'block';
                playButton.addEventListener('click', that.playInt);
            }
        },

        isUptoBaseValue: function (totalRecevied, totalPack, base) {
            if (totalRecevied >= (totalPack * base) / 100) {
                return true;
            }
            return false;
        },

        play: function () {
            if (this.objn == 0) {
                var recPlayCont = document.getElementById("recPlay");
                //recPlayCont.classList.add("controlActive");
                this.doControlActive(recPlayCont);
            }

            var that = this;

            if (this.controller.pause) {
                return;
            }

            if (typeof that.playTimeout != 'undefined' || that.playTimeout != "") {
                clearTimeout(that.playTimeout);
            }
            if (!this.hasOwnProperty('playTime')) {

                this.playTime = this.items[0].playTime;
                if(this.playTime > 3000){
                    this.playTime = 3000;
                }
                e.data = JSON.parse(this.items[this.objn].recObjs);
                io.cfg = e.data;

                //virtualclass.gObj.uRole = io.cfg.userobj.role;

                virtualclass.gObj.uRole = 's'; //if teacher sets there would ask for choose screen share
                // TODO this need to find why this below line are using
                // TODO validate also After disabled, all recording are working properly

                //virtualclass.gObj.uName = io.cfg.userobj.name;
                //virtualclass.gObj.uid = io.cfg.userobj.userid;


            }

            if ((typeof this.items[this.objn + 1] == 'undefined') || (this.items[this.objn].hasOwnProperty('sessionEnd'))) {
//                if(this.items[this.objn].hasOwnProperty('sessionEnd')){
                if (!this.items[this.objn].hasOwnProperty('sessionEnd')) {
                    e.data = this.items[this.objn].recObjs;
                    io.onRecMessage(that.convertInto(e));
                }

                if (virtualclass.recorder.allFileFound == false) {
                    //waiting for server response
                    virtualclass.recorder.waitServer = true;
                    virtualclass.recorder.waitPopup = false;
                    this.displayWaitPopupIfNot();
                    if (virtualclass.recorder.hasOwnProperty('ctotalStore') || virtualclass.recorder.hasOwnProperty('ctotalSent')) {
//                            virtualclass.recorder.ctotalStore = e.data.alldata.totalStore;
//                            virtualclass.recorder.ctotalSent = e.data.alldata.totalStore
                        virtualclass.pbar.renderProgressBar(virtualclass.recorder.ctotalStore, virtualclass.recorder.ctotalSent, 'downloadProgressBar', 'downloadProgressValue');
                    }
                } else {

                    //Play finished here
                    if (this.items[this.objn].hasOwnProperty('sessionEnd')) {
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

                //return;
            } else {
                that.playTimeout = setTimeout(function () {
                    var ev = {};
                    ev.data = that.items[that.objn].recObjs;
                    try {
                        io.onRecMessage(that.convertInto(ev));
                    } catch (e) {
                        console.log('PLAY ERROR ' + e.errorCode);
                    }
                    that.objn++;
                    that.play.call(that);

                    if (typeof that.items[that.objn] == 'object') {
                        that.playTime = that.items[that.objn].playTime / that.controller.ff;
                        that.tillPlayTime += (that.playTime * that.controller.ff);

                        if ((that.allFileFound) && typeof that.items[that.objn + 1] == 'object') {
                            that.playProgressBar();
                            virtualclass.popup.sendBackOtherElems();
                        }
                    }
                    // && that.totPlayTime > 0

                }, that.playTime);
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
                });

                //init pause
                var recPause = document.getElementById('recPause');
                recPause.addEventListener('click', function () {
                    that.controller._pause();
                    that.doControlActive(this)
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
                this.ff = 1;
                this.pause = false;
                virtualclass.recorder.play();
            },

            _pause: function () {
                if (this.puase) {
                    //  alert('This is in already pause mode.');
                } else {
                    this.pause = true;
                }
            },

            fastForward: function (by) {
                this.ff = by;
                this.pause = false;
                virtualclass.recorder.play();

            }
        }
    };
    window.recorder = recorder;
})(window);

/** todo use from virtualclass.utility **/
function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

//function to extract query string 
// from given URL with name and value

function getUrlVars(url) {
    var vars = [], hash;
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
