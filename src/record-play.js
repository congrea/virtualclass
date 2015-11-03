// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {

    //var  closeButton = document.getElementById('recordingClose');
    //closeButton.addEventListener('click', function (){
    //    virtualclass.popup.closeElem();
    //});

    var binData;
    var e = {};
    var reqFile = 1;

    //this should be include intto recorder function
    var sentFile = 0;
//        var xhrCall = 0;
    var chunkNum = 1;

//         errInterval = setInterval(
//            function (){
//                if(chunkNum == 2){
//                    virtualclass.recorder.makeAvailDownloadFile();
//                    clearInterval(errInterval);
//                }
//            }, 1000
//        );
//        var atime = 0;
//        var btime = 0;
    function destroyClickedElementForFirefox(event) {
        document.body.removeChild(event.target);
    }

    //var  closeButton = document.getElementById('recordingClose');
    //closeButton.addEventListener('click', function (){
    //    alert('suman bogati');
    //    debugger;
    //    virtualclass.popup.closeElem();
    //});


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
        init: function (data) {
            //localStorage.removeItem('recObjs');
            var vcan = virtualclass.wb.vcan;
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
                        //     var totalLength =  0 + tempData.length;
                    } else {
                        i = this.prvNum;
                        //   totalLength =  totalLength + tempData.length;
                    }

                    var tempData = data;
//                  var tempData =  JSON.parse(data);

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

        replayFromStart: function () {
            var tempItems = [];
            tempItems = this.items;
            virtualclass.storage.config.endSession();
            virtualclass.popup.closeElem();

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

//                    for(var i=0; i<this.items.length; i++){
//                        if(this.items[i].hasOwnProperty('playTime')){
//                             atime += this.items[i].playTime;
//                        }
//                    }

//                    this.totPlayTime = atime;
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

//            convertIntoReadable : function(ms){
//               	var x = ms / 1000;
//                var seconds = Math.floor(x % 60);
//                x /= 60;
//                var minutes = Math.floor(x % 60);
//                x /= 60;
//                var hours = Math.floor(x % 24);
//                return {s:seconds, m : minutes, h : hours};
//                
//                
//            }, 
//            
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
                            setTimeout(
                                function () {
                                    virtualclass.recorder.afterRecording();
                                },
                                1000
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
                                if(!virtualclass.recorder.alreadyDownload){
                                    virtualclass.recorder.makeAvailDownloadFile();
                                }

                                //alert(msg);
                            } else {
                                //TODO Show msg to user
                                //create function & pass error msg as param
                                alert(msg);
                            }
                        });
                    }
                }
            }, virtualclass.recorder.rnum);

        },

        afterRecording: function () {
            virtualclass.clearSession();
            //virtualclass.storage.config.endSession();

            var progressBarContainer = document.getElementById('progressContainer');
            progressBarContainer.style.display = 'none';

            var recordFinishedMessageBox = document.getElementById('recordFinishedMessageBox');
            recordFinishedMessageBox.style.display = 'block';
            recordFinishedMessageBox.classList.add('MessageBoxFinished');


            var recordingContainer = document.getElementById('recordingContainer');
            recordingContainer.classList.add('recordingFinished');


            var recordingClose = document.getElementById('recordingClose');

            //For dont provide the download link (will be available after five minute of XHR progress at progressbar
            virtualclass.recorder.alreadyDownload = true;
            recordingClose.addEventListener('click',
                function () {
                    //virtualclass.popup.closeElem();
                    //window.location.reload();
                    virtualclass.popup.closeElem();

                    // After clear the default look for progress bar

                    var progressBarContainer = document.getElementById('progressContainer');
                    recordFinishedMessageBox.style.display = 'none';
                    progressBarContainer.style.display = 'block';

                    virtualclass.pbar.renderProgressBar(0, 0, 'progressBar', 'progressValue');
                    virtualclass.pbar.renderProgressBar(0, 0, 'indProgressBar', 'indProgressValue');
                    recordingContainer.classList.remove('recordingFinished');


                }
            );
        },

            //tryForReTransmit: function () {
            //    var that = this;
            //    setTimeout(
            //        function () {
            //            // Show Message "Retring [Retry Number]"
            //            //console.log("Trying to connnect " + (++virtualclass.recorder.emn));
            //            if (that.emn <= 1) {
            //                that.xhrsenddata(virtualclass.recorder.rnum);
            //                that.emn++;
            //            } else {
            //                if(!that.alreadyDownload){
            //                    that.startDownloadProcess(); //if error occurred and is not downloaded the session yet.
            //                }
            //            }
            //        },
            //        1000
            //    );
            //},

        makeAvailDownloadFile: function () {
            console.log('DOWNLLOAD MESSAGE');
            var pbar = document.getElementById('recordingContainer');
            var downloadLinkCont = document.createElement('div');
            downloadLinkCont.id = "downloadFileCont";

            var downloadMsg = document.createElement('div');
            downloadMsg.id = "errormsessage";
            downloadMsg.innerHTML = virtualclass.lang.getString('msgForDownloadStart');

            var progressContainer = document.getElementById('progressContainer');
            progressContainer.style.display = 'none';


            downloadLinkCont.appendChild(downloadMsg);

            //var downloadButton = document.createElement('button');
            //downloadButton.id = 'downloadButton';
            //downloadButton.innerHTML = "Download File";
            //
            //
            //var downloadLink = document.createElement('a');
            //downloadLink.id = "dlink";
            //downloadLink.href = "";
            //downloadLink.download = "session.vcp";

            //downloadLink.innerHTML = "DOWNLOAD";

            //downloadLinkCont.appendChild(downloadButton);

            pbar.appendChild(downloadLinkCont);

            this.alreadyDownload = true;

            virtualclass.storage.getAllDataForDownload(['chunkData'], function (data) {
                // diconnecting with others for prevent to send any unknown packets.
                virtualclass.gObj.saveSession = true;

                var downloadButton = document.createElement('button');
                downloadButton.id = 'downloadButton';
                downloadButton.innerHTML = virtualclass.lang.getString('downloadFile');


                var downloadLink = document.createElement('a');
                downloadLink.id = "dlink";
                downloadLink.href = "";
                downloadLink.download = "session.vcp";
                downloadLink.innerHTML = virtualclass.lang.getString('download');
                downloadMsg.innerHTML = virtualclass.lang.getString('filenotsave');
                downloadLinkCont.appendChild(downloadButton);

                var recordingHeaderCont = document.getElementById('recordingHeader');
                recordingHeaderCont.innerHTML = virtualclass.lang.getString('downloadFile');

                var textFileAsBlob = new Blob([data], {type: "application/virtualclass"});

                downloadButton.addEventListener('click', function () {
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
                    virtualclass.storage.config.endSession();
                });
            });
        },

        //startDownloadProcess: function () {
        //
        //    this.makeAvailDownloadFile();
        //
        //    //console.log('Problem on upload process. Start Download Process.');
        //    //
        //    //if (!virtualclass.recorder.storeDone) {
        //    //    var that = this;
        //    //    virtualclass.recorder.xhrsenddata(virtualclass.recorder.rnum, 'error', that.makeAvailDownloadFile);
        //    //} else {
        //    //
        //    //    this.makeAvailDownloadFile();
        //    //}
        //
        //    //virtualclass.recorder.alreadyDownload = true;
        //    //here we start the download process
        //},

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

                //var element = document.getElementById('about-modal');
                //virtualclass.popup.open(element);

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
                playControllerCont.style.display = 'block';

                var that = this;
                //init fast forward
                var recButton = document.getElementsByClassName('ff');
                for (var i = 0; i < recButton.length; i++) {
                    recButton[i].onclick = function () {
                        var ffBy = this.id.split('ff')[1];
                        that.controller.fastForward(parseInt(ffBy, 10));
                        that.doControlActive(this)
                    };
                }

                //init play
                var recPlay = document.getElementById('recPlay');
                recPlay.addEventListener('click', function () {
                    that.controller._play();
                    that.doControlActive(this);

                    //var controlButtons = document.getElementById('playControllerCont').getElementsByClassName('recButton');
                    //for(var i=0; i<controlButtons.length; i++){
                    //    controlButtons[i].classList.remove("controlActive");
                    //}
                    //
                    //this.classList.add("controlActive");
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
//                    this.pause = false; 
//                    virtualclass.recorder.play();
                //       this.ff = 1; //when click on play it should be normal

                //if (!this.pause &&  this.ff == 1){
                //
                //    //alert('This is in already play mode');
                //} else {
                //
                //    this.ff = 1;
                //    this.pause = false;
                //    virtualclass.recorder.play();
                //
                //}
                this.ff = 1;
                //if (this.pause){
                this.pause = false;
                virtualclass.recorder.play();
                //}
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

function randomString(length) {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
