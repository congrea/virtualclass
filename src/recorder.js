// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(   
    function(window) {
        //var rObjs = localStorage.getItem('recObjs');
        var e = {};
        var reqFile = 1;
        var recorder = {
            items : [],
            recImgPlay : false,
            objn : 0,
            playTimeout : "",
            totalSent : 0,
            
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
                        
                        var tempData =  JSON.parse(data);
                        
                        //TODO, this should be adjust at below loop
                        for(var m = 0; m < tempData.length; m++){
                            this.items.push(tempData[m]);
                        }
                        
//                        alert('suman bogati hello');
//                        debugger;
                        
                        var binData;
                        for(k=0; k<tempData.length; k++){
                            
                            if(typeof tempData[k].recObjs == 'Object' || typeof tempData[k].recObjs == 'object' ){
                          //      binData = Object.keys(this.items[i].recObjs);
                                binData = Object.keys(tempData[k].recObjs).map(function (key) {return tempData[k].recObjs[key]});
                                newBinData = new Uint8Array(binData.length);
                                this.items[i].recObjs = newBinData;
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
                   
//                   alert('upload finished');
                   //var stringifyData = JSON.stringify(vApp.recorder.items);
                   // var blob = new Blob([stringifyData], {type: "application/json"});
                   
                   //var blob = new Blob(vApp.recorder.items,  {'type': 'application/octet-stream'});
//                   var blob = new Blob([stringifyData], {type: "application/json"});
//                   
//                   var downloadLink = document.getElementById('mydata');
//                   downloadLink.href = window.URL.createObjectURL(blob);
                   
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
            
            sendDataToServer : function (fetchFinished){
                var that = this;
                
                vApp.popup.waitBlockAction('none');
//                var wait = document.getElementById("waitPlay");
//                wait.style.display = 'none';
                    
                if(!this.hasOwnProperty('cn')){
                    this.cn = 0;
                }
                
                this.cn++;
                this.totalSent += vApp.recorder.items.length;
               
                if(fetchFinished == 'finished'){
                    vApp.storage.totalStored = this.totalSent;
                    setTimeout(
                        function (){
                            vApp.popup.closeElem();
                            setTimeout(function (){
                                vApp.vutil.progressBar(0, 0);
                                that.cn = 0; //or stored the previos chunk number
                            }, 3000);
                        },
                        2000
                    );
                }
                
                vApp.vutil.progressBar(vApp.storage.totalStored, this.totalSent);
                
                var stringifyData = JSON.stringify(vApp.recorder.items);
                var data = LZString.compressToEncodedURIComponent(stringifyData);
                vApp.xhr.send("record_data=" + data + '&user='+vApp.gObj.uid+'&cn='+this.cn, 'import.php');
            },
            
            requestDataFromServer : function (reqFile){
//                var wait = document.getElementById("waitPlay");
//                wait.style.display = 'block';
                
                vApp.popup.waitBlockAction('block');
                
                vApp.popup.sendBackOtherElems();
                
                var progressBarContainer = document.getElementById("progressBarContainer");
                progressBarContainer.style.display = "none";

                var element = document.getElementById('about-modal');
                vApp.popup.open(element);
                
                var that = this;
                vApp.xhr.send("record_data=true&prvfile="+reqFile+"&user="+vApp.gObj.uid, 'export.php', function
                    (data){
                        if(document.getElementById('waitPlay').style.display == 'block'){
                             vApp.popup.closeElem();
                        }
                        that.afterResponse(data);
                    }
                );
            },
            
            afterResponse : function (encodeData){
                reqFile++;
                var decodeLzString = LZString.decompressFromEncodedURIComponent(encodeData);
                this.init(decodeLzString);
                this.requestDataFromServer(reqFile);
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