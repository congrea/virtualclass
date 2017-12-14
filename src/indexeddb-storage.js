// This file is part of Vidyamantra - http:www.vidyamantra.com/
// This file is part of Vidyamantra - http:www.vidyamantra.com/
// This file is part of Vidyamantra - http:www.vidyamantra.com/
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
    var dataStore = false;
    var dataAllStore = false;
  //  var totalDataStored = localStorage.getItem('totalStored');
    function initToServer(cb) {
        if (typeof cb == 'function') {
            virtualclass.recorder.sendDataToServer();
            setTimeout(
                function () {
                    virtualclass.recorder.xhrsenddata();
                }, 100
            );
            cb.apply(virtualclass.recorder);
        }
    }

    var storage = {
      //  totalStored: (totalDataStored == null) ? 0 : JSON.parse(totalDataStored),
        dbVersion: 6,
        init: function (firstDataStore) {
             
            /***
             * Which table, what doing
             *  allData => For Store all the data of virtualclass for play session at later.
                executedStoreAll => To store the executed data of users till now
                dataAdapterAll => To store the must data of all user.
                dataUserAdapterAll =>  To Store the must data of all user on particular user
                chunkData => To save chunk data which would be convert into file as later.
                wbData => To store the whiteboard data. 
                config => For store the date of created session of particular room, 
                  By which, we calculate the time(after 48 hour we are 
                  ending the session for that particular room)
                executedUserStoreAll => for store the missed packet of according to user.
             */
            this.reclaim = roles.isEducator();
            that = this;
            //TODO these are not using because audio and video is not using

            this.tables = ["wbData", "allData", "chunkData",  "config", "dataAdapterAll", "dataUserAdapterAll",  "executedStoreAll",   "executedUserStoreAll", "dstdata","pollStorage","quizData", "dstall"];

             //  this.tables = ["wbData", "allData", "chunkData", "audioData", "config", "dataAdapterAll", "executedStoreAll", "dataUserAdapterAll"];

            //  Try and Catch not supporting here
            var openRequest = window.indexedDB.open("vidya_apps", that.dbVersion);

            openRequest.onerror = function (e) {
                console.log("Error opening db");
                console.dir(e);

                if(e.target.error.name == 'InvalidStateError'){
                    // http://stackoverflow.com/questions/14082932/invalid-state-error-in-firefox-for-indexed-db
                    alert(virtualclass.lang.getString('enablehistory'));
                }

                var request = indexedDB.deleteDatabase('vidya_apps');
                request.onsuccess = function () {
                    that.init();
                };

            };

            openRequest.onupgradeneeded = function (e) {
                //alert("by this there should create");
                var thisDb = e.target.result;
                var objectStore;

                // TODO this should be simplyfy
                if (!thisDb.objectStoreNames.contains("wbData")) {
                    thisDb.createObjectStore("wbData", {keyPath: 'did'});
                }

                if (!thisDb.objectStoreNames.contains("allData")) {

                    thisDb.createObjectStore("allData", {autoIncrement: true});
                }

                if (!thisDb.objectStoreNames.contains("config")) {
                    thisDb.createObjectStore("config", {keyPath: 'timeStamp', autoIncrement: true});
                }

                if (!thisDb.objectStoreNames.contains("chunkData")) {
                    thisDb.createObjectStore("chunkData", {autoIncrement: true});
                }

                if (!thisDb.objectStoreNames.contains("dataAdapterAll")) {
                    thisDb.createObjectStore("dataAdapterAll", {keyPath: 'serialKey'});
                }

                if (!thisDb.objectStoreNames.contains("dataUserAdapterAll")) {
                    thisDb.createObjectStore("dataUserAdapterAll", {keyPath: 'serialKey'});
                }

                if (!thisDb.objectStoreNames.contains("executedStoreAll")) {
                    thisDb.createObjectStore("executedStoreAll", {keyPath: 'serialKey'});
                }

                if (!thisDb.objectStoreNames.contains("executedUserStoreAll")) {
                    thisDb.createObjectStore("executedUserStoreAll", {keyPath: 'serialKey'});
                }

                if (!thisDb.objectStoreNames.contains("dstdata")) {
                    thisDb.createObjectStore("dstdata", {keyPath: 'timeStamp', autoIncrement: true});
                }  
                
                if (!thisDb.objectStoreNames.contains("pollStorage")) {
                    thisDb.createObjectStore("pollStorage", {keyPath: 'timeStamp',autoIncrement: true});
                }
                
                if (!thisDb.objectStoreNames.contains("quizData")) {
                    thisDb.createObjectStore("quizData", {keyPath: 'quizkey'});
                }
                
                if (!thisDb.objectStoreNames.contains("dstall")) {
                    thisDb.createObjectStore("dstall", {keyPath: 'timeStamp', autoIncrement: true});
                }
            };

            openRequest.onsuccess = function (e) {
                that.db = e.target.result;
                for (var i = 0; i < that.tables.length; i++) {
                    try {
                        that.db.transaction([that.tables[i]], "readwrite");
                    } catch (err) {
                        var request = indexedDB.deleteDatabase('vidya_apps');
                        request.onsuccess = function () {
                            that.init();
                        };
                        return;
                        //that.table.create(that.db, that.tables[i]);
                    }
                }

                var currTime = new Date().getTime();
                //meet condition when current and previous user are different
                if (virtualclass.gObj.sessionClear) {
                    that.config.endSession(true);
                } else {

                    var pos = that.tables.indexOf('wbData');
                    if(pos > -1 ){
                        var tables = that.tables.slice(pos+1);
                    } else {
                        var tables = that.tables;
                    }

                    that.getAllObjs(tables, function (result) {
                            if (typeof result == 'undefined') {
                                that.config.createNewSession();
                            } else {
                                var roomCreatedTime = result.createdDate;
                                var baseDate = new Date().getTime();
                                var totalTime = baseDate - roomCreatedTime;
                                //////////////////////1sec-1min--1hr--2hr/////////
                                if (totalTime > (1000 * 60 * 60 * 2) || result.room != wbUser.room) {
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
                // objectStore.clear();
                //  console.log('Whiteboard Total Store ' + JSON.parse(data).length );
                // localStorage.setItem('repObjs', data); Enable for debugging
                t.objectStore("wbData").put({repObjs: data, did : virtualclass.gObj.currWb, id: 1});

           // t.objectStore("dataUserAdapterAll").put({adaptUserData: data, id: 7, serialKey: serialKey}); // Using add can cause errors
            return false;
        },
        
        //related poll
        pollStore:function(store){
            setTimeout(function(){
                var t = that.db.transaction(["pollStorage"], "readwrite");
                var objectStore = t.objectStore("pollStorage");
                console.log('poll result data length' + JSON.parse(store).length );
                t.objectStore("pollStorage").add({pollResult:store, currTime:new Date().getTime(), id: 1});
                return false;

            },500)

        },

        wbDataRemove : function (key){
            var t = that.db.transaction(["wbData"], "readwrite");
            var objectStore = t.objectStore("wbData");
            objectStore.delete(key);
        },

        dataExecutedStoreAll: function (data, serialKey) {
            var t = that.db.transaction(["executedStoreAll"], "readwrite");
            var objectStore = t.objectStore("executedStoreAll");
            t.objectStore("executedStoreAll").put({executedData: data, id: 6, serialKey: serialKey}); // Using add can cause errors
            
            t.onerror = function ( e ) {
                // prevent Firefox from throwing a ConstraintError and aborting (hard)
                e.preventDefault();
            }
        },

        dataAdapterAllStore: function (data, serialKey) {
            var t = that.db.transaction(["dataAdapterAll"], "readwrite");
            var objectStore = t.objectStore("dataAdapterAll");
            t.objectStore("dataAdapterAll").put({adaptData: data, id: 5, serialKey: serialKey}); // Using add can cause errors
            
             t.onerror = function ( e ) {
                // prevent Firefox from throwing a ConstraintError and aborting (hard)
                e.preventDefault();
            }
        },

        dataUserAdapterAllStore: function (data, serialKey) {
            //TODO FIX this function
            var t = that.db.transaction(["dataUserAdapterAll"], "readwrite");
            var objectStore = t.objectStore("dataUserAdapterAll");
            t.objectStore("dataUserAdapterAll").put({adaptUserData: data, id: 7, serialKey: serialKey}); // Using add can cause errors
            
            // hack for firefox 
            // problem https://bugzilla.mozilla.org/show_bug.cgi?id=872873
            // solution https://github.com/aaronpowell/db.js/issues/98
            t.onerror = function ( e ) {
                // prevent Firefox from throwing a ConstraintError and aborting (hard)
                e.preventDefault();
            }
        },


        dataExecutedUserStoreAll: function (data, serialKey) {
            var t = that.db.transaction(["executedUserStoreAll"], "readwrite");
            var objectStore = t.objectStore("executedUserStoreAll");
            t.objectStore("executedUserStoreAll").put({executedUserData: data, id: 8, serialKey: serialKey}); // Using add can cause errors

            t.onerror = function ( e ) {
                // prevent Firefox from throwing a ConstraintError and aborting (hard)
                e.preventDefault();
            }
        },

        completeStorage: function (playTime, data, bdata, sessionEnd) {  //storing whiteboard and screenshare
            var t = that.db.transaction(["allData"], "readwrite");
            if (typeof sessionEnd != 'undefined') {
                t.objectStore("allData").add({recObjs: "", sessionEnd: true, id: 3});
            } else {
                if (typeof bdata == 'undefined') {
                    t.objectStore("allData").add({recObjs: data, playTime: playTime, id: 3});
                } else {
                    //console.log('data storing ' + this.totalStored);
                    t.objectStore("allData").add({recObjs: data, playTime: playTime, id: 3, bd: bdata.type});
                }
            }
        },

        // chunkStorage : function (value, row, trow, cn, d){
        chunkStorage: function (dobj) {
            console.log('Chunk Storage');
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
		quizStorage: function(quizkey, data){
			var t = that.db.transaction(["quizData"], "readwrite");
            var objectStore = t.objectStore("quizData");
            //objectStore.clear();

			t.objectStore("quizData").put({qzData: data, quizkey: quizkey});
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
                                //console.log('table name ' + tables[val]);
                                if (tables[val] != 'chunkData' && tables[val] != 'quizData'&& tables[val] != 'pollStorage') {
                                    that[tables[val]].handleResult(event, cb);
                                }
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
                    if(wholeData.length > 0){
                        cb(JSON.stringify(wholeData));
                    } else {
                        console.log('No data fetched from indexedDb');
                    }

                }

            }
        },
             // related poll 
        getAllDataOfPoll: function (table, cb) {

            var dbDefined = false;
            try {
                that.db.transaction(["pollStorage"], "readwrite");
                dbDefined = true;
            } catch (err) {

                setTimeout(
                    function (){
                        that.getAllDataOfPoll(table, cb);
                    }, 500
                );

            }

            if(dbDefined){
                var wholeData = [];
                var t = that.db.transaction(["pollStorage"], "readwrite");
                var objectStore = t.objectStore("pollStorage");
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        wholeData.push(cursor.value);
                        cursor.continue();
                    } else {
                        if(wholeData.length > 0){
                            cb(wholeData);
                        } else {
                            console.log('No data fetched from indexedDb');
                        }

                    }

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
                        cb(cursor.value, cursor.key);
                        return;
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
                        if (typeof virtualclass.wb == 'object') {
                            console.log('Total Whiteboard Length ' + JSON.parse(cursor.value.repObjs).length + ' From indexeddb');
                            virtualclass.wb[virtualclass.gObj.currWb].utility.replayFromLocalStroage(JSON.parse(cursor.value.repObjs));

                        } else {
                            virtualclass.gObj.tempReplayObjs['_doc_0_1'] = JSON.parse(cursor.value.repObjs);
                        }

                        virtualclass.gObj.tempReplayObjs['_doc_0_1'] = JSON.parse(cursor.value.repObjs);
                        storeFirstObj = true;
                    }
                    cursor.continue();
                } else {
                    if (typeof storeFirstObj == 'undefined' && virtualclass.currApp == 'Whiteboard') {
                        virtualclass.wb[virtualclass.gObj.currWb].utility.makeUserAvailable(); //at very first
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
                            console.log('Start Upload Process');
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
                }
            }
        },

        dataAdapterAll: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('adaptData')) {
                        var data = JSON.parse(cursor.value.adaptData);
                        if (parseInt(cursor.value.serialKey) > ioAdapter.serial) {
                            ioAdapter.serial = parseInt(cursor.value.serialKey);
                        }
                        //debugger;
                        ioAdapter.adapterMustData[ioAdapter.serial] = data;
                    }
                    cursor.continue();
                }
            }
        },


        dataUserAdapterAll: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('adaptUserData')) {
                        var data = JSON.parse(cursor.value.adaptUserData);
                        var usKey = cursor.value.serialKey.split('_'),
                            uid = parseInt(usKey[0]), serial = parseInt(usKey[1]);
                        ioAdapter.validateAllVariables(uid);
                        if (serial > ioAdapter.userSerial[uid]) {
                            ioAdapter.userSerial[uid] = serial;
                        }
                        //debugger;
                        ioAdapter.userAdapterMustData[uid][serial] = data;
                    }
                    cursor.continue();
                }
            }
        },

        executedStoreAll: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('executedData')) {
                        var data = JSON.parse(cursor.value.executedData);
                        //ioMissingPackets.executedSerial = cursor.value.serialKey;
                        var akey = cursor.value.serialKey.split('_'),
                            uid = parseInt(akey[0]), serial = parseInt(akey[1]);
                        ioMissingPackets.validateAllVariables(uid);
                        ioMissingPackets.executedStore[uid][serial] = data;
                        //console.log('till now executed ' + cursor.value.serialKey);
                    }
                    cursor.continue();
                }
            }
        },

        executedUserStoreAll: {
            handleResult: function (event, cb) {
                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('executedUserData')) {
                        var data = JSON.parse(cursor.value.executedUserData);

                        //ioMissingPackets.executedSerial = cursor.value.serialKey;
                        var akey = cursor.value.serialKey.split('_'),
                            uid = parseInt(akey[0]), serial = parseInt(akey[1]);

                        ioMissingPackets.validateAllUserVariables(uid);

                        ioMissingPackets.executedUserStore[uid][serial] = data;

                        //console.log('till now executed ' + cursor.value.serialKey);
                    }
                    cursor.continue();
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
                //debugger;
                virtualclass.recorder.sessionKey = randomString(11);
                //virtualclass.editorRich.init(0, [], "", "");
                if(roles.hasAdmin()){
                    ioStorage.completeStorage(JSON.stringify(virtualclass.uInfo));
                }

                virtualclass.makeAppReady(virtualclass.apps[3]);

                var currTime = new Date().getTime();
                if (typeof that.db != 'undefined') {
                    var t = that.db.transaction(["config"], "readwrite");
                    var objectStore = t.objectStore("config");
                    var config = JSON.stringify({createdDate: currTime, room: wbUser.room});
                    objectStore.add({myconfig: config, timeStamp: new Date().getTime()});
                } else {
                    console.log('The Datbase is not created for Applicatoin.');
                }
            },

            endSession: function (onlyStoredData) {
                //debugger;
                var newEducator = localStorage.getItem('nEd'); // new participate  who becomes educator
                var precheck = localStorage.getItem('precheck');
                localStorage.clear();

                virtualclass.recorder.items = [];
                virtualclass.recorder.totalSent = 0;
                virtualclass.gObj.tempReplayObjs.length = 0;
                virtualclass.wb = ""; // make white board empty
                delete virtualclass.gObj.currWb; //deleting current whiteboard

                //virtualclass.recorder.rnum = 1; // set file to 1

                if(virtualclass.recorder.hasOwnProperty('startUpload')){
                    delete virtualclass.recorder.startUpload;
                }

                //var recordFinishedMessageBox = document.getElementById('recordFinishedMessageBox');
                //recordFinishedMessageBox.style.display = 'none';


                if(virtualclass.gObj.hasOwnProperty('downloadProgress')){
                    delete virtualclass.gObj.downloadProgress;
                }

                if (!onlyStoredData) {
                    if (typeof virtualclass.wb == 'object') {
                        virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
                        virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue();
                        if(typeof virtualclass.wb[virtualclass.gObj.currWb].replay == 'object'){
                            virtualclass.wb[virtualclass.gObj.currWb].replay.rendering = false;
                        }
                    }

                    virtualclass.vutil.clearAllChat();
                    virtualclass.editorRich.removeEditorData();
                    virtualclass.editorCode.removeEditorData();
                    virtualclass.pdfRender = {}
                }

                virtualclass.vutil.removeClass('audioWidget', "fixed");
                if (!virtualclass.hasOwnProperty('notPLayed')) {
                    //debugger;
                    virtualclass.storage.clearStorageData();
                }

                virtualclass.wbCommon.removeAllContainers();
                virtualclass.gObj.wbCount = 0;
                virtualclass.gObj.currSlide = 0;

                //var prvAppObj = {name : "EditorRich"};
                virtualclass.currApp = "EditorRich"; // default app

                virtualclass.user.control.audioWidgetEnable(true) // Enable the audio if disabled

                virtualclass.user.control.allChatEnable(); // Enabble all chat if disabled



                if(roles.hasAdmin()){
                    // For remove the active tool
                    var sessionEndTool = document.getElementById('virtualclassSessionEndTool');
                    sessionEndTool.className = virtualclass.vutil.removeClassFromElement('virtualclassSessionEndTool', 'active');

                    //virtualclass.previrtualclass = "virtualclassEditorRichTool";
                }
                if(typeof virtualclass.yts == 'object'){
                    clearInterval(virtualclass.yts.tsc); // Clear If youTube seekChange interval is exist
                }
                
                if(typeof virtualclass.sharePt == 'object') {
                    virtualclass.sharePt.UI.removeIframe();
                }

                console.log('Session End.');

                virtualclass.previous = "virtualclassEditorRich";

                // True when fethcing data from indexeddb, there would not data store into table of indexeddb if it is true
                //  so need to do false
                virtualclass.getContent = false;
                virtualclass.recorder.storeDone = 0;

                virtualclass.chat.removeChatHighLight('chatrm');

                virtualclass.setPrvUser(); // Set Previous User

                if (io.sock) {
                    io.sock.close();
                }


                if(precheck != null ){
                    localStorage.setItem('precheck', JSON.parse(precheck));
                }

                // The new session is trying to open
                // overriding educator role (new teacher become educator) at where already has presenter
                if(newEducator != null){
                    console.log('Editor mode enable');
                    localStorage.setItem('editorRich', true);
                    localStorage.setItem('editorCode', true);
                    localStorage.removeItem('nEd');
                } else {
                    console.log('Editor mode disable');
                }
                
                console.log('New role before clear ' + virtualclass.gObj.uRole);
                //virtualclass.gObj.uRole // update the role at 
                that.config.createNewSession();
                console.log('New role after clear ' + virtualclass.gObj.uRole);
                if(!virtualclass.enablePreCheck){
                    // Only popup the message, if the precheck is not enabled
                    virtualclass.popup.waitMsg();
                }

                if(typeof virtualclass.dts == 'object' && virtualclass.dts != null){
                    virtualclass.dts.destroyDts();
                }
            }
        },

        shapesData: {
            handleResult: function () {
                virtualclass.recorder.items.push(JSON.parse(cursor.value.recObjs));
            }
        },

        dstStore : function (data){
            var t = that.db.transaction(["dstdata"], "readwrite");
            var objectStore = t.objectStore("dstdata");
            objectStore.clear();

            // localStorage.setItem('repObjs', data); Enable for debugging
            t.objectStore("dstdata").add({alldocs: data, timeStamp: new Date().getTime(), id: 9});
        }, 
        
        // Store for document sharing data
        dstdata : {
            handleResult : function(event){
                //alert('document share init');

                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('alldocs')) {
                        console.log('document share store suman');
                        dataStore = true;
                        virtualclass.gObj.docs = JSON.parse(cursor.value.alldocs);

                    }
                    cursor.continue();
                } else {
                    if(!dataStore){
                        console.log('document share store init');
                        virtualclass.gObj.docs = 'init';
                    }
                }
            }
        },
        
        dstAllStore : function (data){
            var data = JSON.stringify(data);
            var t = that.db.transaction(["dstall"], "readwrite");
            var objectStore = t.objectStore("dstall");
            objectStore.clear();
            

            // localStorage.setItem('repObjs', data); Enable for debugging
            t.objectStore("dstall").add({dstalldocs: data, timeStamp: new Date().getTime(), id: 10});
        },
        
        
        // Store for document sharing data
        dstall : {
            handleResult : function(event){
                //alert('document share init');

                var cursor = event.target.result;
                if (cursor) {
                    if (cursor.value.hasOwnProperty('dstalldocs')) {
                        console.log('document share store suman');
                        dataAllStore = true;
                        virtualclass.gObj.dstAll = JSON.parse(cursor.value.dstalldocs);

                    }
                    cursor.continue();
                } else {
                    if(!dataAllStore){
                        console.log('document share store init');
                        virtualclass.gObj.dstAll = 'init';
                    }
                }
            }
        },

        clearSingleTable : function (table){
            var t = this.db.transaction(table, "readwrite");
            if (typeof t != 'undefined') {
                var objectStore = t.objectStore(table);
                objectStore.clear();
                console.log('Cleared IDDB Table ' + table);
            } else {
                console.log('There is no table '+ table + ' at IDDB.');
            }
            // if we clear the indexed db then we need to
            // that docs to be init
            if(table == 'dstdata'){
                virtualclass.gObj.docs = 'init';
            }
            
            if(table == 'dstall'){
                virtualclass.gObj.dstall = 'init';
            }
        },

        clearStorageData: function () {
            ioAdapter.adapterMustData = [];
            ioAdapter.serial = -1;
            ioAdapter.userSerial = [];
            ioAdapter.userAdapterMustData = [];
            ioMissingPackets.executedStore =  [];
            ioMissingPackets.executedSerial = {};
            ioMissingPackets.missRequest =  [];
            ioMissingPackets.aheadPackets =  [];
            ioMissingPackets.missRequestFlag =  0;
            ioMissingPackets.executedUserStore =  [];
            ioMissingPackets.executedUserSerial =  {};
            ioMissingPackets.missUserRequest =  [];
            ioMissingPackets.aheadUserPackets =  [];
            ioMissingPackets.missUserRequestFlag =  0;

            for(var i=0; i<this.tables.length; i++){
                if (this.tables[i] == 'allData') {
                    if (!virtualclass.vutil.isPlayMode()) {
                        this.clearSingleTable(this.tables[i]);
                    }
                } else {
                    this.clearSingleTable(this.tables[i]);
                }
            }

        },

        handleResultNoUsing: function () {
            var cursor = event.target.result;
            if (cursor) {
                if (cursor.value.hasOwnProperty('repObjs')) {
                    var allObjs = JSON.parse(cursor.value.repObjs);
                    virtualclass.wb[virtualclass.gObj.currWb].utility.replayFromLocalStroage(allObjs);
                } else if (cursor.value.hasOwnProperty('audiostream')) {
                    var allObjs = JSON.parse(cursor.value.audiostream);
                    virtualclass.gObj.video.audio.assignFromLocal(allObjs);
                } else if (cursor.value.hasOwnProperty('recObjs')) {
                    virtualclass.recorder.items.push(JSON.parse(cursor.value.recObjs));
                }
                cursor.continue();
            }
        },
        
        // Get quiz data, store in array based on 
        // key and then return array of object
        getQuizData : function (cb){
            var dbDefined = false;
            try {
                that.db.transaction(["quizData"], "readonly");
                dbDefined = true;
            } catch (err) {
                setTimeout(
                    function (){
                        that.getQuizData(cb);
                    }, 500
                );
            }
            if(dbDefined){                
                var t = that.db.transaction(["quizData"], "readonly");
                var objectStore = t.objectStore("quizData");
                var dataArr = [];
                
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        var qdata = cursor.value;
                        dataArr[cursor.value.quizkey] = cursor.value.qzData;
                        cursor.continue();
                    } else {
                        cb(dataArr);    
                    }                    
                }
            }
        },
        
        // Clear all data from given table
        clearTableData: function (table) {
            var t = that.db.transaction([table], "readwrite");
            var objectStore = t.objectStore(table);
            objectStore.clear();
        },
        
        // get whiteboard data accoring to whieboard id
        getWbData : function (wbId, cb){
            var dbDefined = false;
            try {
                that.db.transaction(["wbData"], "readwrite");
                dbDefined = true;
            } catch (err) {
                setTimeout(
                    function (){
                        that.getWbData(wbId, cb);
                    }, 500
                );
            }

            if(dbDefined){
                console.log('GET DATA FROM LOCAL STORAGE');
                var t = that.db.transaction(["wbData"], "readwrite");
                //tx = db.transaction("MyObjectStore", "readwrite");
                var row = t.objectStore("wbData");
                var wb = row.get(wbId);
                wb.onsuccess = function (e){
                    if(typeof wb.result != 'undefined'){
                        virtualclass.gObj.tempReplayObjs[wbId] = [];
                        virtualclass.gObj.tempReplayObjs[wbId] = JSON.parse(wb.result.repObjs);
                        cb();
                    } else {
                        virtualclass.gObj.tempReplayObjs[wbId] = 'nodata';
                    }
                }
            }
        }
    };
    window.storage = storage;
})(window);
