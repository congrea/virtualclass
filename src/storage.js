// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        var adData = [];
        var wbDataArr = [];
        var that;
        
        var storage = {
            init : function (){
                this.reclaim = JSON.parse(vApp.vutil.chkValueInLocalStorage('reclaim'));
                that = this;
                
                //TODO these are not using because audio and video is not using
                this.tables = ["wbData", "allData", "audioData", "config"];
                var openRequest = window.indexedDB.open("vidya_app", 3);
                
                openRequest.onerror = function(e) {
                    console.log("Error opening db");
                    console.dir(e);
                };
                
                openRequest.onupgradeneeded = function(e) {
                    var thisDb = e.target.result;
                    var objectStore;
                    //Create Note OS
                    
                    if(!thisDb.objectStoreNames.contains("wbData")) {
                        thisDb.createObjectStore("wbData", { keyPath : 'timeStamp', autoIncrement:true});
                    }
                    
                    if(!thisDb.objectStoreNames.contains("audioData")) {
                        thisDb.createObjectStore("audioData", { keyPath : 'timeStamp', autoIncrement:true});
                    }
                    
                    if(!thisDb.objectStoreNames.contains("allData")) {
                       thisDb.createObjectStore("allData", { keyPath : 'timeStamp', autoIncrement:true});
                     //   thisDb.createObjectStore("allData", {autoIncrement:true});
                    }
                    
                    if(!thisDb.objectStoreNames.contains("config")) {
                       thisDb.createObjectStore("config", { keyPath : 'timeStamp', autoIncrement:true});
                    }
                };
                
                openRequest.onsuccess = function(e) {
                    that.db = e.target.result;
                    var currTime = new Date().getTime();
                    
                    //meet condition when current and previous user are different
                    if(vApp.gObj.sessionClear){
                        that.config.endSession(true);
                    }else{
                        that.getAllObjs(that.tables, function (result){
                        if(typeof result == 'undefined'){
                              that.config.createNewSession();
                        }else{
                            var roomCreatedTime = result.createdDate;
                            var baseDate = new Date().getTime();
                            var totalTime =  baseDate - roomCreatedTime;
                            //////////////////////1sec-1min--1hr--48hr///////// 
                            if(totalTime > (1000 * 60 * 60 * 60 * 48) || result.room != wbUser.room){
                                that.config.endSession();
                            }
                        }
                        });
                    }
                    
                    
                    
                    that.db.onerror = function(event) {
                        console.dir(event.target);
                    };
                };
            },
            
            store : function (data){
                //console.log("whiteboard data store");
                var t = that.db.transaction(["wbData"], "readwrite");  
                var objectStore = t.objectStore("wbData");
                objectStore.clear();
                t.objectStore("wbData").add({repObjs :data , timeStamp : new Date().getTime(), id : 1})
                return false;
            },
            
            audioStore : function (data){
                var t = that.db.transaction(["audioData"], "readwrite");
                t.objectStore("audioData").add({audiostream :data , timeStamp: new Date().getTime(), id : 2});
                return false;
            },
            
            wholeStore_working : function (dt, type){
                var dtArr = [];
                var currTime = new Date().getTime();
                if(typeof dt == "object" && !(dt instanceof Array) ) {
                    dtArr.push(dt);
                }else{
                    dtArr = dt;
                }
                 
                for(var i=0; i<dtArr.length; i++){
                    var dt = dtArr[i];
                    currTime = dt.mt;
                    
                    console.log("current Time " + currTime);
                    
                    dt.peTime = window.pageEnter;
                    var data = JSON.stringify((dt));
                    
                    if(typeof this.prevTime != 'undefined' && currTime == this.prevTime){
                        currTime = currTime + 1;
                    }

                    var t = that.db.transaction(["allData"], "readwrite");

                    if(typeof type == 'undefined'){
                        t.objectStore("allData").add({recObjs :data, timeStamp : currTime, id : 3});
                    }else{
                        t.objectStore("allData").put({recObjs :data, timeStamp :this.prevTime, id : 3});
                    }
                    
                    this.wholeStoreData = data;
                    this.prevTime = currTime;
                } 
            },
            
            wholeStore : function (obj, type){
                obj.peTime = window.pageEnter;
                
                var data = JSON.stringify(obj);
                
                var currTime = new Date().getTime();
                
                if(typeof this.prevTime != 'undefined' && currTime == this.prevTime){
                    currTime = currTime + 1;
                }
                
                var t = that.db.transaction(["allData"], "readwrite");
                
                if(typeof type == 'undefined'){
                    t.objectStore("allData").add({recObjs :data, timeStamp : currTime, id : 3});
                }else{
                    t.objectStore("allData").put({recObjs :data, timeStamp :this.prevTime, id : 3});
                }
                
                this.wholeStoreData = data;
                this.prevTime = currTime;
            },
            
            displayData : function (){
                var transaction = that.db.transaction(["vapp"], "readonly"); 
                var objectStore = transaction.objectStore("vapp");
                objectStore.openCursor().onsuccess =  that.handleResult;
            },
            
            getAllObjs : function (tables, callback){
                var cb =  typeof callback != 'undefined' ? callback : "";
                for(var i=0; i<tables.length; i++){
                    var transaction = that.db.transaction(tables[i], "readonly"); 
                    var objectStore = transaction.objectStore(tables[i]);
                    
                    objectStore.openCursor().onsuccess =  (
                        function (val, cb){
                            return function (event){
                                if(typeof cb == 'function'){
                                    that[tables[val]].handleResult(event, cb);
                                }else{
                                    that[tables[val]].handleResult(event);
                                }
                            }
                        }
                    )(i, cb);
                }
            },
            
            
            wbData : {
                handleResult : function (event, cb){
                    var cursor = event.target.result;  
                    if (cursor) {
                        if(cursor.value.hasOwnProperty('repObjs')){
                            vApp.wb.utility.replayFromLocalStroage(JSON.parse(cursor.value.repObjs));
                            storeFirstObj = true;
                        }
                        cursor.continue();  
                    }else{
                        if(typeof storeFirstObj == 'undefined'){
                            vApp.wb.utility.makeUserAvailable(); //at very first
                        }
                    }
                 }
            },
            
            audioData : {
                handleResult : function (event, cb){
                    var cursor = event.target.result;  
                    if (cursor) {
                        if(cursor.value.hasOwnProperty('audiostream')){
                            adData.push(JSON.parse(cursor.value.audiostream));
                        }
                        cursor.continue();    
                    } else {
                        if(adData.length > 1){
                            vApp.gObj.video.audio.recordingLength = 0;
                            if(typeof cb == 'function'){
                                vApp.gObj.video.audio.assignFromLocal(adData, cb);
                            }else{
                                vApp.gObj.video.audio.assignFromLocal(adData);
                            }
                        }
                    }
                 }
            },
            
            allData : {
                handleResult : function (event, cb){
                    var cursor = event.target.result;  
                    if (cursor) {
                        if(cursor.value.hasOwnProperty('recObjs')){
                            vApp.recorder.items.push(JSON.parse(cursor.value.recObjs));
                        }
                        cursor.continue();    
                    }else{
                        if(typeof cb == 'function'){
                            cb();
                        }
                    }
                }
            },
            
            config : {
                handleResult : function (event, cb){
                    
                    var cursor = event.target.result;  
                    if (cursor) {
                        if(cursor.value.hasOwnProperty('myconfig')){
                            var config = JSON.parse(cursor.value.myconfig);
                            if(typeof cb != 'undefined'){
                                //TODO mc should be store into object
                                mc = true;
                                cb(config); 
                            }
                        }
                        cursor.continue();  
                    }else{
                        if(typeof cb != 'undefined' && typeof mc == 'undefined'){
                            cb(); 
                        }
                    }
                    
                },
                
                createNewSession : function(){
                    var currTime = new Date().getTime();
                    var t = that.db.transaction(["config"], "readwrite");  
                    var objectStore = t.objectStore("config");
                    var config = JSON.stringify({createdDate : currTime,  room : wbUser.room});
                    objectStore.add({myconfig : config, timeStamp : new Date().getTime()});
                },
                
                endSession : function (onlyStoredData){
                    if(!onlyStoredData){
                        vApp.wb.utility.t_clearallInit();
                        vApp.wb.utility.makeDefaultValue();
                        vApp.vutil.clearAllChat();
//                        if(vApp.hasOwnProperty('ss')){
//                            //vApp['ss'].initPrevImage();
//                        }
                    }
                    
                    vApp.vutil.removeClass('audioWidget', "fixed");
                    vApp.storage.clearStorageData();
                    that.config.createNewSession();
                }
            },
            
            shapesData : {
                handleResult : function (){
                    vApp.recorder.items.push(JSON.parse(cursor.value.recObjs));
                }
            },
            
            clearStorageData : function (){
                for(var i=0; i<this.tables.length; i++){
                    var t = this.db.transaction([this.tables[i]], "readwrite");  
                    if(typeof t != 'undefined'){
                        var objectStore = t.objectStore(this.tables[i]);
                        objectStore.clear();  
                    }
                }
            },
            
            handleResultNoUsing : function (){
                var cursor = event.target.result;  
                if (cursor) {
                    if(cursor.value.hasOwnProperty('repObjs')){
                        var allObjs = JSON.parse(cursor.value.repObjs);
                        vApp.wb.utility.replayFromLocalStroage(allObjs);
                    }else if(cursor.value.hasOwnProperty('audiostream')){
                        
                        var allObjs = JSON.parse(cursor.value.audiostream);
                        vApp.gObj.video.audio.assignFromLocal(allObjs);
                        
                    }else  if (cursor.value.hasOwnProperty('recObjs')){
                        vApp.recorder.items.push(JSON.parse(cursor.value.recObjs));
                    }
                    cursor.continue();
                }
            }
        }
        window.storage = storage;
    }
)(window);
