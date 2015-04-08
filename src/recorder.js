// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function(window) {
        //var rObjs = localStorage.getItem('recObjs');
        var e = {};
        var recorder = {
            items : [],
            recImgPlay : false,
            objn : 0,
            playTimeout : "",
            
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
            
            exportData : function (){
               vApp.recorder.items = [];
               vApp.storage.getAllObjs(["allData"], function (){
                   alert('upload finished');
                   
                   //var stringifyData = JSON.stringify(vApp.recorder.items);
                 
                 //  var blob = new Blob([stringifyData], {type: "application/json"});
                   
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
            
            sendDataToServer : function (){
                if(!this.hasOwnProperty('cn')){
                    this.cn = 0;
                }
                this.cn++;
                
                var stringifyData = JSON.stringify(vApp.recorder.items);
                var data = LZString.compressToBase64(stringifyData);
                data = encodeURIComponent(data);
                
                vApp.xhr.send("record_data=" + data + '&user='+vApp.gObj.uid+'&cn='+this.cn, 'import.php');
            },
            
            requestDataFromServer : function (prvFile){
                var that = this;
                vApp.xhr.send("request_data=true&prvfile="+prvFile+"&user="+vApp.gObj.uid, 'export.php', function
                    (data){
                        that.afterResponse(data);
                    }
                );
            },
            
            afterResponse : function (data){
                var dataArr = JSON.parse(data);
                if(dataArr.length > 1){
                    var arrivedFile = dataArr[0];
                    var encodeData = dataArr[1];

                    var decodeLzString = LZString.decompressFromBase64(encodeData);
                    this.init(decodeLzString);
                    this.requestDataFromServer(arrivedFile);
                    
                }else {
                    alert("file not found");
                }
                
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