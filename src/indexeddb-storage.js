// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var alData = 0;
    var adData = [];
    var wbDataArr = [];
    var that;
    var prArr = [];
    var tarr = [];
    var totalDataStored = localStorage.getItem('totalStored');

    function initToServer(cb) {
        if (typeof cb == 'function') {
            virtualclass.recorder.sendDataToServer();
            setTimeout(
                function () {
                    virtualclass.recorder.xhrsenddata();
                }, 100
            );
//                virtualclass.recorder.items = [];
            cb.apply(virtualclass.recorder);
        }
    }

    var storage = {
        totalStored: (totalDataStored == null) ? 0 : JSON.parse(totalDataStored),
        init: function (firstDataStore) {

            //this.firstDataStore = firstDataStore;
            this.reclaim = JSON.parse(virtualclass.vutil.chkValueInLocalStorage('reclaim'));
            that = this;
            //TODO these are not using because audio and video is not using
            this.tables = ["wbData", "allData", "audioData", "config"];
            //this.tables = ["wbData", "audioData", "config"];
            //second parameter is versoin of datbase
            var openRequest = window.indexedDB.open("vidya_apps", 1);

            openRequest.onerror = function (e) {
                console.log("Error opening db");
                console.dir(e);
            };
            openRequest.onupgradeneeded = function (e) {
                //alert("by this there should create");
                var thisDb = e.target.result;
                var objectStore;
                //Create Note OS
                if (!thisDb.objectStoreNames.contains("wbData")) {
                    thisDb.createObjectStore("wbData", {keyPath: 'timeStamp', autoIncrement: true});
                }
                if (!thisDb.objectStoreNames.contains("audioData")) {
                    thisDb.createObjectStore("audioData", {keyPath: 'timeStamp', autoIncrement: true});
                }
                if (!thisDb.objectStoreNames.contains("allData")) {
                    //thisDb.createObjectStore("allData", { keyPath : 'playTime', autoIncrement:true});
                    //thisDb.createObjectStore("allData", {autoIncrement:true});
                    thisDb.createObjectStore("allData", {autoIncrement: true});
                }

                if (!thisDb.objectStoreNames.contains("config")) {
                    thisDb.createObjectStore("config", {keyPath: 'timeStamp', autoIncrement: true});
                }

                if (!thisDb.objectStoreNames.contains("chunkData")) {
                    thisDb.createObjectStore("chunkData", {autoIncrement: true});
                }
            };

            openRequest.onsuccess = function (e) {
                that.db = e.target.result;
                var currTime = new Date().getTime();
                //meet condition when current and previous user are different
                if (virtualclass.gObj.sessionClear) {
                    that.config.endSession(true);

                } else {
                    that.getAllObjs(that.tables, function (result) {
                            if (typeof result == 'undefined') {
                                that.config.createNewSession();
                            } else {
                                var roomCreatedTime = result.createdDate;
                                var baseDate = new Date().getTime();
                                var totalTime = baseDate - roomCreatedTime;
                                //////////////////////1sec-1min--1hr--48hr/////////
                                if (totalTime > (1000 * 60 * 60 * 60 * 48) || result.room != wbUser.room) {
                                    that.config.endSession();
                                }
                            }
                        },
                        'allData'
                    );
                }
                that.db.onerror = function (event) {
                    console.dir(event.target);
                };
                firstDataStore();
            };
        },
        store: function (data) {
            //console.log("whiteboard data store");
            var t = that.db.transaction(["wbData"], "readwrite");
            var objectStore = t.objectStore("wbData");
            objectStore.clear();
            t.objectStore("wbData").add({repObjs: data, timeStamp: new Date().getTime(), id: 1});
            return false;
        },
        audioStore: function (data) {
            var t = that.db.transaction(["audioData"], "readwrite");
            t.objectStore("audioData").add({audiostream: data, timeStamp: new Date().getTime(), id: 2});
            return false;
        },
        wholeStore_working: function (dt, type) {
            var dtArr = [];
            var currTime = new Date().getTime();
            if (typeof dt == "object" && !(dt instanceof Array)) {
                dtArr.push(dt);
            } else {
                dtArr = dt;
            }
            for (var i = 0; i < dtArr.length; i++) {
                var dt = dtArr[i];
                currTime = dt.mt;
                dt.peTime = window.pageEnter;
                var data = JSON.stringify((dt));
                if (typeof this.prevTime != 'undefined' && currTime == this.prevTime) {
                    currTime = currTime + 1;
                }
                var t = that.db.transaction(["allData"], "readwrite");
                if (typeof type == 'undefined') {
                    t.objectStore("allData").add({recObjs: data, timeStamp: currTime, id: 3});
                } else {
                    t.objectStore("allData").put({recObjs: data, timeStamp: this.prevTime, id: 3});
                }
                this.wholeStoreData = data;
                this.prevTime = currTime;
            }
        },

        completeStorage: function (playTime, data, bdata, sessionEnd) {  //storing whiteboard and screenshare
            this.totalStored++;
            var t = that.db.transaction(["allData"], "readwrite");
            if (typeof sessionEnd != 'undefined') {
                t.objectStore("allData").add({recObjs: "", sessionEnd: true, id: 3});
            } else {
                if (typeof bdata == 'undefined') {
                    t.objectStore("allData").add({recObjs: data, playTime: playTime, id: 3});
                } else {
                    t.objectStore("allData").add({recObjs: data, playTime: playTime, id: 3, bd: bdata.type});
                }
            }
        },

        // chunkStorage : function (value, row, trow, cn, d){
        chunkStorage: function (dobj) {
            var t = that.db.transaction(["chunkData"], "readwrite");
            dobj.id = 4;
            t.objectStore("chunkData").add(dobj);
        },

        wholeStore: function (playTime, obj, type) {  //storing whiteboard and screenshare
            obj.peTime = window.pageEnter;
            var data = JSON.stringify(obj);
            var currTime = new Date().getTime();

            if (typeof this.prevTime != 'undefined' && currTime == this.prevTime) {
                currTime = currTime + 1;
            }
            var t = that.db.transaction(["allData"], "readwrite");
            if (typeof type == 'undefined') {
                t.objectStore("allData").add({recObjs: data, timeStamp: currTime, id: 3});
            } else {
                t.objectStore("allData").put({recObjs: data, timeStamp: this.prevTime, id: 3});
            }
            this.wholeStoreData = data;
            this.prevTime = currTime;
        },

        displayData: function () {
            var transaction = that.db.transaction(["virtualclass"], "readonly");
            var objectStore = transaction.objectStore("virtualclass");

            objectStore.openCursor().onsuccess = that.handleResult;
        },
        getAllObjs: function (tables, callback, exludeTable, row) {
            var cb = typeof callback != 'undefined' ? callback : "";
            for (var i = 0; i < tables.length; i++) {
                var transaction = that.db.transaction(tables[i], "readonly");
                var objectStore = transaction.objectStore(tables[i]);

                objectStore.openCursor().onsuccess = (function (val, cb) {
                    if (tables[val] == exludeTable) {
                        return;
                    }
                    return function (event) {
                        if (typeof cb == 'function') {
                            if (typeof row != 'undefined') {
                                that[tables[val]].handleResult(event, cb, row);
                            } else {
                                that[tables[val]].handleResult(event, cb);
                            }
                        } else {
                            if (typeof row != 'undefined') {
                                that[tables[val]].handleResult(event, undefined, row);
                            } else {
                                that[tables[val]].handleResult(event);
                            }
                        }
                    }
                })(i, cb);
            }
        },

        getAllDataForDownload: function (table, cb) {

            var wholeData = [];
            var transaction = that.db.transaction(table, "readonly");
            var objectStore = transaction.objectStore(table[0]);

            objectStore.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    wholeData.push(cursor.value);
                    cursor.continue();
                } else {
                    cb(JSON.stringify(wholeData));
                }

            }
        },

        getrowData: function (table, cb, row) {
            var transaction = that.db.transaction(table, "readonly");
            var objectStore = transaction.objectStore(table[0]);

            if (typeof row == 'string' && row == 'first') {
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
//                            if(cursor.value.hasOwnProperty('totalSent')){
                        cb(cursor.value, cursor.key);
                        return;
//                            }
                    }
                    cb("No Such Row");
                }
            } else {
                //that[table].handleResult(event, cb);
                var request = objectStore.get(row);

                request.onerror = function (event) {
                    return "No Such Row";
                };
                request.onsuccess = function (event) {
                    // Do something with the request.result!
                    cb(request.result);
                };
            }
        },

        wbData: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('repObjs')) {
                        virtualclass.wb.utility.replayFromLocalStroage(JSON.parse(cursor.value.repObjs));
                        storeFirstObj = true;
                    }
                    cursor.continue();
                } else {
                    if (typeof storeFirstObj == 'undefined') {
                        virtualclass.wb.utility.makeUserAvailable(); //at very first
                    }
                }
            }
        },
        audioData: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('audiostream')) {
                        adData.push(JSON.parse(cursor.value.audiostream));
                    }
                    cursor.continue();
                } else {
                    if (adData.length > 1) {
                        virtualclass.gObj.video.audio.recordingLength = 0;
                        if (typeof cb == 'function') {
                            virtualclass.gObj.video.audio.assignFromLocal(adData, cb);
                        } else {
                            virtualclass.gObj.video.audio.assignFromLocal(adData);
                        }
                    }
                }
            }
        },
        allData: {
            chunk: 0,
            handleResult: function (event, cb) {
                //virtualclass.recorder.item = [];
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('recObjs')) {
                        if (cursor.value.hasOwnProperty('sessionEnd')) {
                            virtualclass.recorder.items.push({
                                playTime: cursor.value.playTime,
                                recObjs: cursor.value.recObjs,
                                sessionEnd: true
                            });
                            initToServer(cb);
                            return;
                        } else {
                            if (cursor.value.hasOwnProperty('bd')) {
                                virtualclass.recorder.items.push({
                                    playTime: cursor.value.playTime,
                                    recObjs: cursor.value.recObjs,
                                    bd: cursor.value.bd
                                });
                            } else {
                                virtualclass.recorder.items.push({
                                    playTime: cursor.value.playTime,
                                    recObjs: cursor.value.recObjs
                                });
                            }
                        }
                    }
                    cursor.continue();
                } else {
                    //initToServer(cb);

//                        if(typeof cb == 'function'){
//                            virtualclass.recorder.sendDataToServer();
//                            setTimeout(
//                                function (){
//                                    virtualclass.recorder.xhrsenddata();
//                                }, 100
//                            );
//                            virtualclass.recorder.items = [];
//                            cb.apply(virtualclass.recorder);
//                        }
                }
            }
        },
        config: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('myconfig')) {
                        var config = JSON.parse(cursor.value.myconfig);
                        if (typeof cb != 'undefined') {
                            //TODO mc should be store into object
                            mc = true;
                            cb(config);
                        }
                    }
                    cursor.continue();
                } else {
                    if (typeof cb != 'undefined' && typeof mc == 'undefined') {
                        cb();
                    }
                }
            },
            createNewSession: function () {
                var currTime = new Date().getTime();
                var t = that.db.transaction(["config"], "readwrite");
                var objectStore = t.objectStore("config");
                var config = JSON.stringify({createdDate: currTime, room: wbUser.room});
                objectStore.add({myconfig: config, timeStamp: new Date().getTime()});
            },
            endSession: function (onlyStoredData) {
                if (!onlyStoredData) {
                    virtualclass.wb.utility.t_clearallInit();
                    virtualclass.wb.utility.makeDefaultValue();
                    virtualclass.vutil.clearAllChat();

                    virtualclass.editorRich.removeEditorData();
                    virtualclass.editorCode.removeEditorData();
                }
                virtualclass.vutil.removeClass('audioWidget', "fixed");
                if (!virtualclass.hasOwnProperty('notPLayed')) {
                    virtualclass.storage.clearStorageData();
                }
                that.config.createNewSession();
            }
        },
        shapesData: {
            handleResult: function () {
                virtualclass.recorder.items.push(JSON.parse(cursor.value.recObjs));
            }
        },
        clearStorageData: function () {

            for (var i = 0; i < this.tables.length; i++) {
                var t = this.db.transaction([this.tables[i]], "readwrite");
                if (typeof t != 'undefined') {
                    var objectStore = t.objectStore(this.tables[i]);
                    if (this.tables[i] == 'allData') {
                        if (!virtualclass.vutil.isPlayMode()) {
                            objectStore.clear();
                        }

                    } else {
                        objectStore.clear();
                    }

                }
            }
        },
        handleResultNoUsing: function () {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.hasOwnProperty('repObjs')) {
                    var allObjs = JSON.parse(cursor.value.repObjs);
                    virtualclass.wb.utility.replayFromLocalStroage(allObjs);
                } else if (cursor.value.hasOwnProperty('audiostream')) {
                    var allObjs = JSON.parse(cursor.value.audiostream);
                    virtualclass.gObj.video.audio.assignFromLocal(allObjs);
                } else if (cursor.value.hasOwnProperty('recObjs')) {
                    virtualclass.recorder.items.push(JSON.parse(cursor.value.recObjs));
                }
                cursor.continue();
            }
        }
    };
    window.storage = storage;
})(window);