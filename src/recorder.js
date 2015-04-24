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
        /*
         * QUEUE CODE
        function sendData(data){
            vApp.xhr.send(data, 'import.php', function (){
                if(vApp.recorder.fileQueue.length > 0 ){
                    sentFile++;
                    sendData(vApp.recorder.fileQueue.splice(0, 1)[0]);
                    vApp.vutil.progressBar(vApp.storage.totalStored, vApp.recorder.totalSent);
                    console.log('file is sent ' + sentFile);
                }
            });
        } */
        
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
            
            exportData : function (cb){
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
            
            
            xhrsenddata : function (rnum){
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
                        earlierTimeout = setTimeout (
                            function (){
                               vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                            },
                            1000
                        );
                    } else {
                        if((dObj.hasOwnProperty('status')) && (dObj.status == 'done')){
                            vApp.recorder.storeDone = 1;
                            return;
                        }   
                        
                        if(typeof frow != 'undefined'){
                            vApp.recorder.rnum = frow;
                        }
                        
//                        var tmpsenddata = JSON.stringify(dObj);
                        
                        var formData = new FormData();
                        formData.append("record_data", JSON.stringify(dObj));
                        formData.append("user", vApp.gObj.uid); 
                        formData.append("cn", chunkNum);
                        vApp.vutil.progressBar(dObj.totalStore, dObj.totalSent, 'progressBar', 'progressValue');
                        
                        vApp.xhr.send(formData, 'import.php', function (msg){ //TODO Handle more situations
                            if (msg == 'File created') {
                                vApp.recorder.rnum++;
                                chunkNum++;
                                vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                            } else {
                                setTimeout (
                                    function (){
                                        // Show Message "Retring [Retry Number]"
                                       console.log("Trying to connnect " + (++vApp.recorder.emn));
                                       vApp.recorder.xhrsenddata(vApp.recorder.rnum);
                                       
                                    },
                                    1000
                                );
                            }
                        });
                        
                    }
                }, vApp.recorder.rnum);
            },
            
            sendDataToServer : function (){
                var t = vApp.storage.db.transaction(["chunkData"], "readwrite");
                var objectStore = t.objectStore("chunkData");
                objectStore.clear();
                        
                var that = this;
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
            
            displayWaitPopupIfNot : function (msg){
                if(this.waitPopup == false){
                    vApp.popup.waitBlockAction('block');
                    vApp.popup.sendBackOtherElems();

                    var progressBarContainer = document.getElementById("progressBarContainer");
                    progressBarContainer.style.display = "none";
                    
                    if(typeof msg != 'undefined'){
                        document.getElementById('waitMsg').innerHTML = msg;
                    }

                    var element = document.getElementById('about-modal');
                    vApp.popup.open(element);
//                    var that = this;
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
                        vApp.popup.closeElem();
                        vApp.popup.updLoadedFile(reqFile+1);
                        
//                      //from where would know, we don't have to request
                        if(data == 'filenotfound'){
                            vApp.recorder.allFileFound = true;
                            if(vApp.recorder.waitServer == true){
                                var toBePlayItems = vApp.recorder.items;
                                vApp.storage.config.endSession();
                                vApp.recorder.objn = 0;
                                vApp.recorder.items = toBePlayItems;
                                vApp.recorder.play();
                                vApp.recorder.waitServer = false;
                                vApp.popup.closeElem();
                            }
                            return;  
                        }
//                        that.afterResponse(data);
                        vApp.recorder.afterResponse(data);
                    }
                );
            },
            
            afterResponse : function (encodeData){
                if (!!window.Worker) {
                    mvDataWorker.postMessage({
                        rdata: encodeData,
                        getData : true
                    });

                    mvDataWorker.onmessage = function (e) {
//                        if(e.data.hasOwnProperty('export')){
                            reqFile++;
    //                      var ori3 = base64DecToArrclm(e.data.rdata);
    
//                            e.data.alldata.rdata
//                            e.data.alldata.totalSent
//                            e.data.alldata.totalStore
//                            e.data.alldata.cn
                            vApp.recorder.init(e.data.alldata.rdata);
                            vApp.recorder.requestDataFromServer(reqFile);
//                        }
                    }
                }
              
//                this.init(decodeLzString);
//                this.requestDataFromServer(reqFile);
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
                if(typeof this.items[this.objn+1] == 'undefined'){
//                    e.data =  JSON.parse(this.items[this.objn].recObjs);
                    e.data =  this.items[this.objn].recObjs;
                    io.onRecMessage(that.convertInto(e)); 
                    
                    if(vApp.recorder.allFileFound == false){
                        //waiting for server response
                        vApp.recorder.waitServer = true;
                        vApp.recorder.waitPopup = false;     
                        this.displayWaitPopupIfNot();
                    }
                    
                    //return;
                }else{
                  that.playTimeout = setTimeout( function (){
                        e.data =  that.items[that.objn].recObjs;
                        io.onRecMessage(that.convertInto(e)); 
                        that.play.call(that);
                        that.objn++;
                        
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