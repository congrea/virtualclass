// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(   
    function(window) {
        var binData;
        var e = {};
        var reqFile = 0;
        var recorder = {
            items : [],
            recImgPlay : false,
            objn : 0,
            playTimeout : "",
            totalSent : 0,
            fileQueue : [],
            
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
                        
                        
//                        if(cursor.value.hasOwnProperty('bd')){
//                                tarr = cursor.value.recObjs;
//                                prArr = tarr.splice(0, 2);
//                                
//                                if(prArr[0] == ''){
//                                    
//                                }
//                                
//                                view = new Uint8Array(arr);
//                                return view.buffer;
//                                
//                        }
//                            
                        
                        for(k=0; k<tempData.length; k++){
                            if(tempData[k].hasOwnProperty('bd')){
                                
                                tempArr = tempData[k].recObjs.split(",");
                                
                                prArr = tempArr.splice(0, 2);
                                
                                if(prArr [0] == 'a') {
                                    binData = new Int8Array(tempArr);
                                } else if(prArr[0] == 'c'){
                                    binData = new Uint8ClampedArray(tempArr);
                                }
                                
                                

//                                if(prArr [0] == 'a') {
//                                    tpdArr = new Int8Array(tempArr);
//                                } else if(prArr[0] == 's'){
//                                    tpdArr = new Uint8ClampedArray(tempArr);
//                                }

//                                binData = Object.keys(tempData[k].recObjs).map(function (key) {return tempData[k].recObjs[key]});
//                                newBinData = new Uint8Array(binData.length);
                                
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
            
            init2 : function(data) {
                 //localStorage.removeItem('recObjs');
                var vcan = vApp.wb.vcan;
                if(typeof myfunc != 'undefined'){
                    this.objs = vcan.getStates('replayObjs');
                }else{
                    var that = this;
                    if(data == 'fromplay'){
                       vApp.storage.getAllObjs(["allData"], function (){ that.play(); });
                          
                    }else{
                        var totalLength = 0;
                        this.items =  JSON.parse(data);
                        var binData;
                        
                        for(var i=0; i<this.items.length; i++){
                            if(typeof this.items[i].recObjs == 'Object' || typeof this.items[i].recObjs == 'object' ){
                          //      binData = Object.keys(this.items[i].recObjs);
                                binData = Object.keys(this.items[i].recObjs).map(function (key) {return that.items[i].recObjs[key]});
                                newBinData = new Uint8Array(binData.length);
                                this.items[i].recObjs = newBinData;
                                for(var j = 0; j< binData.length; j++){
                                    this.items[i].recObjs[j] = binData[j];
                                }
                            }
                        }
                        
                        that.play();
                    }

                   // vApp.storage.getAllObjs(["allData"], function (){ that.play(); })
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
            
            sendDataToServer : function (){
                var that = this;
                vApp.popup.waitBlockAction('none');

                if (!!window.Worker) {
                    mvDataWorker.postMessage({
                        rdata : vApp.recorder.items,
                        totalStored :vApp.storage.totalStored,
                        makeChunk : true
                    });
                }
                
                // Every time the data is sending the function 
                // is declaring as expression which is not good
                
                mvDataWorker.onmessage = function (e) {
                    if(e.data.hasOwnProperty('import')){
                        vApp.recorder.cn = e.data.cn;
                        vApp.recorder.totalSent +=  e.data.currData;
                
                        if(e.data.hasOwnProperty('status')){
                            if(e.data.fetch == 'done'){
                                vApp.storage.totalStored = vApp.recorder.totalSent;
                                setTimeout(
                                    function (){
                                        vApp.popup.closeElem();
                                        vApp.vutil.progressBar(0, 0);
                                        vApp.recorder.cn = 0;
                                        vApp.clearSession('SessionEndTool'); //sesionend was invoking earlier at vmApp.js\
                                        window.location.reload();
                                    },
                                    2000
                                );
                            }
                        }
                        
//                        fileQueue.push("record_data=" + e.data.rdata + '&user='+vApp.gObj.uid+'&cn='+vApp.recorder.cn);
                        
                        
                        vApp.xhr.send("record_data=" + e.data.rdata + '&user='+vApp.gObj.uid+'&cn='+vApp.recorder.cn, 'import.php', function (){
                            
                        });
                        vApp.vutil.progressBar(e.data.totalStore, vApp.recorder.totalSent);
                    } 
                }
            },
            
            requestDataFromServer : function (reqFile){
                if(typeof waitPopup == 'undefined'){
                    vApp.popup.waitBlockAction('block');
                    vApp.popup.sendBackOtherElems();

                    var progressBarContainer = document.getElementById("progressBarContainer");
                    progressBarContainer.style.display = "none";

                    var element = document.getElementById('about-modal');
                    vApp.popup.open(element);
                    var that = this;
                    waitPopup = true;
                }
                
                vApp.xhr.send("record_data=true&prvfile="+reqFile+"&user="+vApp.gObj.uid, 'export.php', function
                    (data){
                        if(document.getElementById('waitPlay').style.display == 'block'){
                             vApp.popup.closeElem();
                        }
                        if(data == 'filenotfound'){
                            return;
                        }
//                        that.afterResponse(data);
                        vApp.recorder.afterResponse(data);
                    }
                );
            },
            
            afterResponse : function (encodeData){
             //   reqFile++;
                //var decodeLzString = LZString.decompressFromEncodedURIComponent(encodeData);
                
                if (!!window.Worker) {
                    mvDataWorker.postMessage({
                        rdata: encodeData,
                        getData : true
                    });
                }
                
                 mvDataWorker.onmessage = function (e) {
                    if(e.data.hasOwnProperty('export')){
                        reqFile++;
                        vApp.recorder.init(e.data.rdata);
                        vApp.recorder.requestDataFromServer(reqFile);
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
                    
                    //return;
                }else{
                  that.playTimeout = setTimeout( function (){
                        e.data =  that.items[that.objn].recObjs;
                        io.onRecMessage(that.convertInto(e)); 
                        that.play.call(that);
                        that.objn++;
                        that.playTime = that.items[that.objn].playTime;
                     }, that.playTime);
                }
            }
        };
        window.recorder = recorder;
    }
)(window);