// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(   
    function(window) {
        
        var binData;
        var e = {};
        var reqFile = 0;
        
        //this should be include intto recorder function
        var sentFile = 0;
//        var xhrCall = 0;
        var chunkNum = 0;
        
         errInterval = setInterval(
            function (){
                if(chunkNum == 2){
                    vApp.recorder.startDownloadProcess();
                    clearInterval(errInterval);
                }
            }, 1000
        );

        function destroyClickedElement(event){
            document.body.removeChild(event.target);
        }

        var fromFille = 0;
        var recorder = {
            items : [],
            recImgPlay : false,
            objn : 0,
            playTimeout : "",
            totalSent : 0,
            fileQueue : [],
            rnum : 1,
            storeDone : 0,
            emn : 0,
            allFileFound : false,
            waitServer : false,
            waitPopup : false,
            tempRecData : [],
            alreadyAskForPlay : false,
            playStart : false,
            error : 0,
            mkDownloadLink : "",
            init : function(data) {
                 //localStorage.removeItem('recObjs');
                var vcan = vApp.wb.vcan;
                if(typeof myfunc != 'undefined'){
                    this.objs = vcan.getStates('replayObjs');
                }else{
                    var that = this;
                    if(data == 'fromplay'){
                       vApp.storage.getAllObjs(["allData"], function (){ that.play(); });
                          
                    } else {
                        if(!this.hasOwnProperty('prvNum')){
                            var i = 0;
                       //     var totalLength =  0 + tempData.length;
                        }else{
                            i  = this.prvNum;
                         //   totalLength =  totalLength + tempData.length;
                        }
                        
                        var tempData = data;
//                        var tempData =  JSON.parse(data);
                        
                        //TODO, this should be adjust at below loop
                        for(var m = 0; m < tempData.length; m++){
                            this.items.push(tempData[m]);
                        }
                        
                        for(k=0; k<tempData.length; k++){
                            if(tempData[k].hasOwnProperty('bd')){
                                if(tempData[k].bd == 'a') {
                                    binData = vApp.dtCon.base64DecToArrInt(tempData[k].recObjs);
                                } else if(tempData[k].bd == 'c') {
                                    binData = vApp.dtCon.base64DecToArrclm(tempData[k].recObjs);
                                }
                                
                                this.items[i].recObjs = binData;
                                for(var j = 0; j< binData.length; j++){
                                    this.items[i].recObjs[j] = binData[j];
                                }
                            }
                            i++;
                        }
                        
                        if(!this.hasOwnProperty('prvNum')){
                            that.play();
                        }
                       this.prvNum = i;
                    }
                }
            },
            
            startUploadProcess : function (){
                vApp.recorder.exportData(function (){});
                vApp.popup.sendBackOtherElems();
            },
            
            exportData : function (cb){
               vApp.popup.openProgressBar();
               vApp.recorder.items = [];
               vApp.storage.getAllObjs(["allData"], function (){
                   if(typeof cb == 'function'){
                       cb();
                   }
               });  
            },
            
            // If binary, return buffer else return original value
            convertInto : function (e){
                if(typeof e.data == 'string'){
                    return e;
                }
                e.data =  e.data.buffer;
                return e;
            },
            
            clearPopups : function (){
                vApp.popup.closeElem();
                vApp.vutil.progressBar(0, 0, 'progressBar', 'progressValue');
                vApp.storage.config.endSession();
            },
            
            xhrsenddata : function (rnum, err, cb){
                if(typeof err != 'undefined'){
                    vApp.recorder.error = 1;
//                    error = "error";
                }
                if(typeof cb != 'undefined'){
                    vApp.recorder.mkDownloadLink =  cb; // mkDownloadLink should be localize
                }
                
                //this is not happend but in any case
                if(vApp.recorder.storeDone == 1){
                    return;
                }
                
                if(typeof earlierTimeout != 'undefined'){
                    clearTimeout(earlierTimeout);
                }
                
                if((typeof rnum == 'undefined') || rnum == ''){
                    var rnum = 'first';
                }
                
                vApp.recorder.rnum = rnum;
                
                vApp.storage.getrowData(['chunkData'], function (dObj,  frow){
                    if((typeof dObj == 'string' || typeof dObj == 'undefined')){
                        console.log("should invoke only once");
                        earlierTimeout = setTimeout (
                            function (){
                               vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                            },
                            1000
                        );
                    } else {
                        
                        if((dObj.hasOwnProperty('status')) && (dObj.status == 'done')){
                            vApp.recorder.storeDone = 1;
                            if(typeof vApp.recorder.mkDownloadLink != 'undefined' || vApp.recorder.mkDownloadLink != ""){
                                vApp.recorder.mkDownloadLink();
                            }
                            return;
                        }   
                        
                        if(typeof frow != 'undefined'){
                            vApp.recorder.rnum = frow;
                        }
                        
//                        typeof error != 'undefined'){
                        if(vApp.recorder.error == 1){
                            if(vApp.recorder.storeDone == 0){
                                vApp.recorder.xhrsenddata(vApp.recorder.rnum, 'error');
                                vApp.recorder.rnum++;
                            }
                        } else {
                            var formData = new FormData();
                            formData.append("record_data", JSON.stringify(dObj));
                            formData.append("user", vApp.gObj.uid); 
                            formData.append("cn", chunkNum);

                            vApp.vutil.progressBar(dObj.totalStore, dObj.totalSent, 'progressBar', 'progressValue');

                            vApp.recorder.items = []; //empty on each chunk sent

                            vApp.xhr.send(formData, 'import.php', function (msg){ //TODO Handle more situations
                                if (msg == 'File created') {
                                    vApp.recorder.rnum++;
                                    chunkNum++;
                                    vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                                } else {
                                    setTimeout (
                                        function (){
                                            // Show Message "Retring [Retry Number]"
                                           //console.log("Trying to connnect " + (++vApp.recorder.emn));
                                           if(vApp.recorder.emn <= 1){
                                                vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                                                vApp.recorder.emn++;
                                           }else{
                                               // vApp.recorder.startDownloadProcess(); //if error occurred
                                           }
                                        },
                                        1000
                                    );
                                }
                            });
                        }
                    }
                }, vApp.recorder.rnum);
            },
            
            
            makeAvailDownloadFile : function (){
                var pbar = document.getElementById('progressBarContainer');
                var downloadLinkCont  = document.createElement('div');
                downloadLinkCont.id = "downloadFileCont";

                var downloadMsg  = document.createElement('div');
                downloadMsg.id = "errormsessage";

                downloadLinkCont.appendChild(downloadMsg);
                
                var downloadButton = document.createElement('button');
                downloadButton.id = 'downloadButton';
                downloadButton.innerHTML = "Download File";
                
                
                var downloadLink  = document.createElement('a');
                downloadLink.id = "dlink";
                downloadLink.href = "";
                downloadLink.download="session.vcp";
                
                //downloadLink.innerHTML = "DOWNLOAD";

                downloadLinkCont.appendChild(downloadButton);

                pbar.appendChild(downloadLinkCont);

                vApp.storage.getAllDataForDownload(['chunkData'], function (data){
                    var textFileAsBlob = new Blob([data], {type: "application/virtualclass"});
                    
                    downloadButton.addEventListener('click', function (){
                         if (window.webkitURL != null){
                            // Chrome allows the link to be clicked
                            // without actually adding it to the DOM.
                            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                        } else {
                            // Firefox requires the link to be added to the DOM
                            // before it can be clicked.
                            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                            downloadLink.onclick = destroyClickedElement;
                            document.body.appendChild(downloadLink);
                        }
                        downloadLink.click();
                    });
                });
            },
            
            startDownloadProcess : function (){
                console.log('this should not happend ' + vApp.recorder.storeDone);
                if(!vApp.recorder.storeDone) {
                    var that = this;
                    vApp.recorder.xhrsenddata(vApp.recorder.rnum, 'error', that.makeAvailDownloadFile);
                } else {
                    this.makeAvailDownloadFile();
                }
                //here we start the download process
            },
            
            sendDataToServer : function (){
                var that = this;
                
                var t = vApp.storage.db.transaction(["chunkData"], "readwrite");
                var objectStore = t.objectStore("chunkData");
                objectStore.clear();
              
                vApp.popup.waitBlockAction('none');

                if (!!window.Worker) {
                    mvDataWorker.postMessage({
                        rdata : vApp.recorder.items,
                        totalStored :vApp.storage.totalStore,
                        makeChunk : true
                    });

                    // Every time the data is sending, the function 
                    // is declaring as expression which is not good
                    mvDataWorker.onmessage = function (e) {
                        vApp.storage.chunkStorage(e.data);
                    } 
                }
            },
            
            displayWaitPopupIfNot : function (){
                if(this.waitPopup == false){
                    vApp.popup.sendBackOtherElems();
                 
                    var progressBarContainer = document.getElementById("progressBarContainer");
                    progressBarContainer.style.display = "none";
                    
                    vApp.popup.waitBlockAction('block');
                    
                    vApp.vutil.progressBar(0, 0, 'downloadProgressBar', 'downloadProgressValue');
                    
                    var element = document.getElementById('about-modal');
                    vApp.popup.open(element);

                    this.waitPopup = true;
                }
            },
            
            requestDataFromServer : function (reqFile){
                this.displayWaitPopupIfNot(vApp.lang.getString("plswaitwhile"));
                var formData = new FormData();
                formData.append("record_data", "true");
                formData.append("prvfile", reqFile); 
                formData.append("user", vApp.gObj.uid);
                    
                //vApp.xhr.send("record_data=true&prvfile="+reqFile+"&user="+vApp.gObj.uid, 'export.php', function
                vApp.xhr.send(formData, 'export.php', function
                    (data){
                        vApp.recorder.sendToWorker(data);
                    }
                );
            },
            
            sendToWorker : function (encodeData){
                if (!!window.Worker) {
                    mvDataWorker.postMessage({
                        rdata: encodeData,
                        getData : true
                    });
                    
                    mvDataWorker.onmessage = function (e) {
                        reqFile++;
                        var isUptoBase = vApp.recorder.isUptoBaseValue(e.data.alldata.totalSent, e.data.alldata.totalStore, 30);
                        
                        vApp.recorder.ctotalStore =  e.data.alldata.totalStore;
                        vApp.recorder.ctotalSent =  e.data.alldata.totalSent;
                        
                        vApp.vutil.progressBar(e.data.alldata.totalStore, e.data.alldata.totalSent, 'downloadProgressBar', 'downloadProgressValue');
                        
                        if(isUptoBase && !vApp.recorder.alreadyAskForPlay){
                            if(e.data.alldata.totalSent > e.data.alldata.totalStore){
                                vApp.recorder.askToPlay("completed");
                            }else{
                                vApp.recorder.askToPlay();
                            }
                            
                            vApp.recorder.alreadyAskForPlay = true;
                            vApp.recorder.tempRecData.push(e.data.alldata.rdata);
                        }else if(isUptoBase && vApp.recorder.playStart && vApp.recorder.waitServer == false){
                            vApp.recorder.init(e.data.alldata.rdata);
                        }else {
                            vApp.recorder.tempRecData.push(e.data.alldata.rdata);
                            if(vApp.recorder.waitServer == true){
                                 vApp.recorder.alreadyPlayed = true;
                            }
                        }
                        
                        if(!e.data.alldata.rdata[e.data.alldata.rdata.length-1].hasOwnProperty('sessionEnd')){
                            vApp.recorder.requestDataFromServer(reqFile);
                        }else{
                            vApp.recorder.allFileFound = true;
                            if(vApp.recorder.waitServer == true){ //if earlier replay is interrupt 
                                
                                vApp.storage.config.endSession();
                                var mainData = vApp.recorder.tempRecData.reduce(function(a, b) {
                                    return a.concat(b);
                                });
                                
                                vApp.recorder.objn = 0;
                                vApp.recorder.init(mainData);
                                vApp.recorder.play();
                                vApp.recorder.waitServer = false;
                                vApp.popup.closeElem();
                                return;
                            }
                        }
//                        
                    }
                }
            },
            
            
            playInt : function (){
                //convert [[1, 3], [3, 5]] TO [1, 3, 3, 5]
                var mainData = vApp.recorder.tempRecData.reduce(function(a, b) {
                    return a.concat(b);
                });
                vApp.popup.closeElem();
                vApp.recorder.init(mainData);
                vApp.recorder.playStart = true;
                vApp.recorder.tempRecData.length = 0;
            },
            
            askToPlay : function (downloadFinish){
//                var playMessage = vApp.lang.getString('askUser');
                if(typeof downloadFinish !=  'undefined'){
                    document.getElementById('askplayMessage').innerHTML = vApp.lang.getString('playsessionmsg'); 
                }else{
                    document.getElementById('askplayMessage').innerHTML = vApp.lang.getString('askplayMessage');
                }
                
                
                var that = this;
                var playButton = document.getElementById("playButton");
                if(playButton != null){
                    playButton.style.display = 'block';
                    playButton.addEventListener('click', that.playInt);
                }
            },
            
            isUptoBaseValue : function (totalRecevied, totalPack, base){
                if(totalRecevied >=  (totalPack * base)/100) {
                    return true;
                }
                return false;
            },
            
            play : function (){
                var that = this;
                if(typeof that.playTimeout != 'undefined' || that.playTimeout != ""){
                    clearTimeout(that.playTimeout);
                }
                if(!this.hasOwnProperty('playTime')){
                    this.playTime = this.items[0].playTime;
                    e.data =  JSON.parse(this.items[this.objn].recObjs);
                    io.cfg = e.data;
                    //vApp.gObj.uRole = io.cfg.userobj.role;
                    vApp.gObj.uRole = 's'; //it teacher sets there would ask for choose screen share
                    vApp.gObj.uName = io.cfg.userobj.name;
                    vApp.gObj.uid = io.cfg.userobj.userid;
                }
                
//                if(this.items[this.objn] == 'undefined'){
//                    alert("suman bogati");
//                    debugger;
//                }
                if((typeof this.items[this.objn+1] == 'undefined') || (this.items[this.objn].hasOwnProperty('sessionEnd'))){
//                if(this.items[this.objn].hasOwnProperty('sessionEnd')){
                    if(!this.items[this.objn].hasOwnProperty('sessionEnd')){
                        e.data =  this.items[this.objn].recObjs;
                        io.onRecMessage(that.convertInto(e)); 
                    }
                    
                    if(vApp.recorder.allFileFound == false){
                        //waiting for server response
                        vApp.recorder.waitServer = true;
                        vApp.recorder.waitPopup = false;     
                        this.displayWaitPopupIfNot();
                        if(vApp.recorder.hasOwnProperty('ctotalStore') || vApp.recorder.hasOwnProperty('ctotalSent')){
//                            vApp.recorder.ctotalStore = e.data.alldata.totalStore;
//                            vApp.recorder.ctotalSent = e.data.alldata.totalStore
                            vApp.vutil.progressBar(vApp.recorder.ctotalStore, vApp.recorder.ctotalSent, 'downloadProgressBar', 'downloadProgressValue');
                        }
                    }
                    //return;
                }else{
                    that.playTimeout = setTimeout( function (){
                        var ev = {};
                        ev.data =  that.items[that.objn].recObjs;
                        io.onRecMessage(that.convertInto(ev)); 
                        that.objn++;
                        that.play.call(that);
                        
                        if(typeof that.items[that.objn] == 'object'){
                            that.playTime = that.items[that.objn].playTime;
                        }
                        
                    }, that.playTime);
                }
            }
        };
        window.recorder = recorder;
    }
)(window);