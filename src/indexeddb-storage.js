// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    "use strict";
    var that;
    var dataStore = false;
    var dataAllStore = false;
    var storeFirstObj = false;
    var mc = false;

    var storage = {
        //  totalStored: (totalDataStored == null) ? 0 : JSON.parse(totalDataStored),
        version: 7,
        sessionEndFlag:false,
        init: async function () {

            /***
             * Which table, what doing
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

            this.tables = ["wbData", "chunkData",  "config", "dataAdapterAll", "dataUserAdapterAll",  "executedStoreAll",   "executedUserStoreAll", "dstdata","pollStorage","quizData", "dstall"];

            //  this.tables = ["wbData", "allData", "chunkData", "audioData", "config", "dataAdapterAll", "executedStoreAll", "dataUserAdapterAll"];

            //  Try and Catch not supporting here

            this.db = await virtualclass.virtualclassIDBOpen("vidya_apps", that.dbVersion, {
                upgrade(db, oldVersion, newVersion, transaction) {
                   that.onupgradeneeded(db)
                }
            });

            if(typeof this.db.objectStoreNames === 'object' && this.db.objectStoreNames != null){
                await this.onsuccess();
            } else {
                this.init();
            }
        },

        onupgradeneeded : function (db) {
            var thisDb = db;
            if (!thisDb.objectStoreNames.contains("wbData")) {
                thisDb.createObjectStore("wbData", {keyPath: 'did'});
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
        },

        onsuccess : async function () {
            if (virtualclass.gObj.sessionClear) {
                console.log("==== session clear endsession after room change");
                this.config.endSession(true);
            } else {

                var pos = this.tables.indexOf('wbData');

                if(pos > -1 ){
                    var tables = this.tables.slice(pos+1);
                } else {
                    var tables = this.tables;
                }

                await this.getAllObjs(tables, function (result) {
                    if (typeof result == 'undefined') {
                        that.config.createNewSession();
                    } else {
                        var roomCreatedTime = result.createdDate;
                        var baseDate = new Date().getTime();
                        var totalTime = baseDate - roomCreatedTime;
                        // Session is clear after 3 hour continous session
                        //////////////////////1sec-1min--1hr--3hr/////////
                        if (totalTime > (1000 * 60 * 60 * 3) || result.room != wbUser.room) {
                       // if (totalTime > (1000 * 6) || result.room != wbUser.room) {
                            console.log("==== session clear endsession after date expire");
                            that.config.endSession();
                        }
                    }
                });
            }
            console.log("==== Member add, config is ready");

            /** TODO, error handling **/
            // that.db.onerror = function (event) {
            //     console.dir(event.target);
            // };
        },


        store: function (data) {
            //console.log("whiteboard data store");
            const tx = that.db.transaction('wbData', 'readwrite');
            tx.store.put({repObjs: data, did : virtualclass.gObj.currWb, id: 1});
            tx.done.then(() => {
                //console.log('success')
            }, () => {console.log('failure')});
        },


        pollStore: function(store){
            const tx = that.db.transaction('pollStorage', 'readwrite');
            tx.store.add({pollResult:store, currTime:new Date().getTime(), id: 1});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')});
        },

        wbDataRemove : function (key){
            console.log('Whiteboard data remove');
            var tx = that.db.transaction(["wbData"], "readwrite");
            tx.store.delete(key);
        },

        dataExecutedStoreAll: async function (data, serialKey) {
            const tx = that.db.transaction('executedStoreAll', 'readwrite');
            tx.store.put({executedData: data, id: 6, serialKey: serialKey});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')});

            /** TODO, this should be enable **/

            // t.onerror = function ( e ) {
            //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
            //     e.preventDefault();
            // }
        },

        dataAdapterAllStore: function (data, serialKey) {
            const tx = that.db.transaction('dataAdapterAll', 'readwrite');
            tx.store.put({adaptData: data, id: 5, serialKey: serialKey});
            tx.done.then(() => {
                //console.log('success')
            }, () => {console.log('failure')});
            /** TODO, this should be enable **/
            // t.onerror = function ( e ) {
            //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
            //     e.preventDefault();
            // }
        },

        dataUserAdapterAllStore: function (data, serialKey) {
            const tx = that.db.transaction('dataUserAdapterAll', 'readwrite');
            tx.store.put({adaptUserData: data, id: 7, serialKey: serialKey});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')})

            // hack for firefox
            // problem https://bugzilla.mozilla.org/show_bug.cgi?id=872873
            // solution https://github.com/aaronpowell/db.js/issues/98
            // TODO, this should be enable
            // t.onerror = function ( e ) {
            //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
            //     e.preventDefault();
            // }
        },


        dataExecutedUserStoreAll:  function (data, serialKey) {
            const tx = that.db.transaction('executedUserStoreAll', 'readwrite');
            tx.store.put({executedUserData: data, id: 8, serialKey: serialKey});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')})

            // t.onerror = function ( e ) {
            //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
            //     e.preventDefault();
            // }
        },

        quizStorage: function(quizkey, data){
            const tx = that.db.transaction('quizData', 'readwrite');
            tx.store.put({qzData: data, quizkey: quizkey});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')})
        },

        getAllObjs: async function (tables, callback) {
            let cb = typeof callback !== 'undefined' ? callback : "";
            for (let i = 0; i < tables.length; i++) {
                let cursor = await this.db.transaction(tables[i]).store.openCursor();
                if (typeof cb === 'function') {
                    if (tables[i] !== 'chunkData' && tables[i] !== 'quizData' && tables[i] !== 'pollStorage') {
                       await this[tables[i]].handleResult(cursor, cb);
                    }
                } else {
                    await this[tables[i]].handleResult(cursor);
                }
            }
        },

        getAllDataOfPoll: async function (table, cb) {
            var wholeData = [];
            let cursor = await that.db.transaction('pollStorage').store.openCursor();

            while (cursor) {
                console.log(cursor.key, cursor.value);
                wholeData.push(cursor.value);
                cursor = await cursor.continue();
            }

            if(wholeData.length > 0){
                cb(wholeData);
            } else {
                console.log('No data fetched from indexedDb');
            }
        },

        wbData: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('repObjs')) {
                        if (typeof virtualclass.wb === 'object') {
                            console.log('Total Whiteboard Length ' + JSON.parse(cursor.value.repObjs).length + ' From indexeddb');
                            virtualclass.wb[virtualclass.gObj.currWb].utility.replayFromLocalStroage(JSON.parse(cursor.value.repObjs));
                        } else {
                            virtualclass.gObj.tempReplayObjs['_doc_0_0'] = JSON.parse(cursor.value.repObjs);
                        }
                        storeFirstObj = true;
                    }

                    cursor = await cursor.continue();
                }

                if (!storeFirstObj && virtualclass.currApp === 'Whiteboard') {
                    virtualclass.wb[virtualclass.gObj.currWb].utility.makeUserAvailable(); //at very first
                }
            }
        },


        dataAdapterAll: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('adaptData')) {
                        let data = JSON.parse(cursor.value.adaptData);
                        if (parseInt(cursor.value.serialKey) > ioAdapter.serial) {
                            ioAdapter.serial = parseInt(cursor.value.serialKey);
                        }
                        //debugger;
                        ioAdapter.adapterMustData[ioAdapter.serial] = data;
                    }
                    cursor = await cursor.continue();
                }
            }
        },

        dataUserAdapterAll: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('adaptUserData')) {
                        let data = JSON.parse(cursor.value.adaptUserData);
                        let usKey = cursor.value.serialKey.split('_'),
                            uid = parseInt(usKey[0]), serial = parseInt(usKey[1]);
                        ioAdapter.validateAllVariables(uid);
                        if (serial > ioAdapter.userSerial[uid]) {
                            ioAdapter.userSerial[uid] = serial;
                        }

                        ioAdapter.userAdapterMustData[uid][serial] = data;
                    }
                    cursor = await cursor.continue();
                }
            }
        },


        executedStoreAll: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('executedData')) {
                        var data = JSON.parse(cursor.value.executedData);
                        //ioMissingPackets.executedSerial = cursor.value.serialKey;
                        var akey = cursor.value.serialKey.split('_'),
                            uid = parseInt(akey[0]), serial = parseInt(akey[1]);
                        ioMissingPackets.validateAllVariables(uid);
                        ioMissingPackets.executedStore[uid][serial] = data;
                        //console.log('till now executed ' + cursor.value.serialKey);
                    }
                    cursor = await cursor.continue();
                }
            }
        },


        executedUserStoreAll: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('executedUserData')) {
                        var data = JSON.parse(cursor.value.executedUserData);

                        //ioMissingPackets.executedSerial = cursor.value.serialKey;
                        var akey = cursor.value.serialKey.split('_'),
                            uid = parseInt(akey[0]), serial = parseInt(akey[1]);

                        ioMissingPackets.validateAllUserVariables(uid);

                        ioMissingPackets.executedUserStore[uid][serial] = data;

                    }
                    cursor = await cursor.continue();
                }
            }
        },

        config: {
            handleResult: async function (cursor, cb) {
                if(cursor != null){
                    while (cursor) {
                        if (cursor) {
                            if (cursor.value.hasOwnProperty('myconfig')) {
                                var config = JSON.parse(cursor.value.myconfig);
                                if (typeof cb != 'undefined') {
                                    cb(config);
                                }
                            }
                            cursor = await cursor.continue();
                        }
                    }
                } else if (typeof cb != 'undefined') {
                    cb();
                }
            },

           createNewSession: function () {
                virtualclass.makeAppReady(virtualclass.gObj.defaultApp);
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
                delete virtualclass.connectedUsers;
                if(virtualclass.gObj.hasOwnProperty("memberUpdateDelayTimer")){
                    clearTimeout(virtualclass.gObj.memberUpdateDelayTimer);
                    virtualclass.gObj.memberlistpending.length  = 0;
                    delete virtualclass.gObj.memberUpdateDelayTimer;
                }

                if(virtualclass.hasOwnProperty('poll') && virtualclass.poll !== ''){
                    virtualclass.poll.pollState = {};
                    virtualclass.poll.dataRec = {};
                }

                var congrealogo = document.getElementById('congrealogo');
                if(congrealogo != null){
                    congrealogo.classList.remove('disbaleOnmousedown');
                }

                $('#chatroom_bt2').removeClass('ui-state-highlight');

                if(typeof virtualclass.videoUl  == 'object' && virtualclass.videoUl.hasOwnProperty('player')
                && typeof virtualclass.videoUl.player == 'object' && virtualclass.videoUl.player.player_ != null

                ){
                    virtualclass.videoUl.destroyPlayer();
                }

                if(typeof CDTimer != 'undefined'){
                    clearInterval(CDTimer);
                }

                var currApp = document.querySelector('#virtualclass' + virtualclass.currApp);
                if(currApp != null){
                    currApp.style.display = 'none';
                }

                if(virtualclass.hasOwnProperty('media')){
                    virtualclass.media.audio.muteButtonToogle();
                }

                //Remove all chat user list
                var chatUsers  = chatContainerEvent.elementFromShadowDom('.ui-memblist-usr', 'all');

                if(chatUsers != null && chatUsers.length > 0){
                    for(let i=0; i<chatUsers.length; i++){
                        if(chatUsers[i] != null){
                            chatUsers[i].parentNode.removeChild(chatUsers[i]);
                        }
                    }
                }

                if(virtualclass.gObj.precheckScrn){
                    virtualclass.vutil.prechkScrnShare();
                }

                // virtualclass.raiseHand.disableRaiseHand();
                virtualclass.gObj.audioEnable = (roles.hasControls()) ? true : virtualclass.gObj.stdaudioEnable;
                virtualclass.storage.config.sessionEndFlag =true;
                var newEducator = localStorage.getItem('nEd'); // new participate  who becomes educator
                var precheck = localStorage.getItem('precheck');
                localStorage.clear();
                if(virtualclass.chat != null){
                    delete virtualclass.chat.vmstorage;
                    virtualclass.chat.vmstorage = {};
                    virtualclass.chat.removeChatHighLight('chatrm');
                }
                virtualclass.recorder.items = [];
                virtualclass.recorder.totalSent = 0;
                virtualclass.gObj.tempReplayObjs.length = 0;
                virtualclass.wb = ""; // make white board empty
                delete virtualclass.gObj.currWb; //deleting current whiteboard
                virtualclass.gObj.studentSSstatus.mesharing = false;
                virtualclass.vutil.removeSharingClass();
                virtualclass.gObj.studentSSstatus.shareToAll = false;
                virtualclass.gObj.studentSSstatus.sharing = false;
                delete virtualclass.gObj.whoIsSharing;
                if(virtualclass.videoHost != null){
                    virtualclass.videoHost.gObj.stdStopSmallVid= false;
                    virtualclass.videoHost.gObj.allStdVideoOff=false;
                }


                virtualclass.gObj.wbTool = {};

                //virtualclass.recorder.rnum = 1; // set file to 1

                if(virtualclass.recorder.hasOwnProperty('startUpload')){
                    delete virtualclass.recorder.startUpload;
                }

                if(virtualclass.gObj.hasOwnProperty('downloadProgress')){
                    delete virtualclass.gObj.downloadProgress;
                }

                if (!onlyStoredData) {
                    if (typeof virtualclass.wb == 'object') {
                        alert('Clear all whiteboard');
                        virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
                        virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue();
                        if(typeof virtualclass.wb[virtualclass.gObj.currWb].replay == 'object'){
                            virtualclass.wb[virtualclass.gObj.currWb].replay.rendering = false;
                        }
                    }

                    virtualclass.vutil.clearAllChat();
                    if(virtualclass.editorRich != null){
                        virtualclass.editorRich.removeEditorData();
                    }
                    virtualclass.pdfRender = {}
                }

                virtualclass.vutil.removeClass('audioWidget', "fixed");
                virtualclass.storage.clearStorageData();


                virtualclass.wbCommon.removeAllContainers();
                virtualclass.gObj.wbCount = 0;
                virtualclass.gObj.currSlide = 0;

                //var prvAppObj = {name : "EditorRich"};
                virtualclass.currApp = virtualclass.gObj.defaultApp; // default app

                // hasMicrophone is true if audio is avaialble on hardware but the audio/video is disabled by user
                if(!virtualclass.gObj.hasOwnProperty('disableCamByUser')) {
                    virtualclass.user.control.audioWidgetEnable(true)
                }else {
                    virtualclass.user.control.audioDisable() // Enable the audio if disabled
                }

                virtualclass.user.control.allChatEnable(); // Enabble all chat if disabled
                virtualclass.user.control.resetmediaSetting();

                if(!virtualclass.gObj.meetingMode && roles.isStudent()){
                    var teacherVid = document.getElementById("videoHostContainer");
                    teacherVid.style.display = "none";

                    var leftPanel = document.getElementById("virtualclassAppRightPanel");
                    if(leftPanel.classList.contains("vidShow")){
                       leftPanel.classList.remove("vidShow");
                    }
                }


                if(roles.hasAdmin()){
                    // For remove the active tool
                    var sessionEndTool = document.getElementById('virtualclassSessionEndTool');
                    sessionEndTool.className = virtualclass.vutil.removeClassFromElement('virtualclassSessionEndTool', 'active');
                }



                if(typeof virtualclass.yts == 'object'){
                    clearInterval(virtualclass.yts.tsc); // Clear If youTube seekChange interval is exist
                }

                if(typeof virtualclass.sharePt == 'object') {
                    virtualclass.sharePt.UI.removeIframe();
                }

                console.log('Session End.');

                virtualclass.previous = "virtualclass" + virtualclass.currApp;

                // True when fethcing data from indexeddb, there would not data store into table of indexeddb if it is true
                //  so need to do false
                virtualclass.getContent = false;
                virtualclass.recorder.storeDone = 0;


                virtualclass.setPrvUser(); // Set Previous User

                workerIO.postMessage({'cmd' : 'sessionEndClose'});

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

                if(typeof virtualclass.raiseHand == 'object' && virtualclass.raiseHand != null){
                    if(!roles.hasControls()){
                        var rh = document.querySelector(".congrea .handRaise.disable");
                        if(rh){
                            rh.classList.remove('disable');
                            rh.classList.add('enable');
                            rh.setAttribute('data-title',virtualclass.lang.getString("RaiseHandStdEnabled"));
                            var icon = document.querySelector(".congrea .handRaise #icHr");
                            icon.setAttribute('data-action','enable')
                            virtualclass.raiseHand.stdRhEnable="enabled";
                        }

                    }else{
                        virtualclass.raiseHand.rhCount=0
                        virtualclass.raiseHand.rhCountR=0
                        var handBt = document.querySelector(".congrea .vmchat_bar_button .hand_bt.highlight");
                        if(handBt){
                            handBt.classList.remove('highlight');
                        }
                        var text = document.querySelector(".congrea .vmchat_bar_button .hand_bt #notifyText");
                        text.innerHTML="";
                    }
                }

                // var chatHighlight = document.querySelector("#virtualclassCont.congrea .vmchat_room_bt.ui-state-highlight");
                var chatHighlight = chatContainerEvent.elementFromShadowDom(".vmchat_room_bt.ui-state-highlight");
                if(chatHighlight){
                    chatHighlight.classList.remove('ui-state-highlight');
                }

                var videOff = document.querySelector("#virtualclassCont.congrea.student");
                if(videOff && videOff.classList.contains("videoff")){
                    videOff.classList.remove("videoff")
                }
                var userList = document.querySelector("#virtualclassCont #memlist");
                var chatrm = document.querySelector("#virtualclassCont #chatrm")

                var listTab = document.querySelector("#user_list");
                var chatroomTab = document.querySelector("#chatroom_bt2");


                if(userList && !userList.classList.contains("enable")){
                    userList.classList.add("enable");
                    userList.classList.remove("disable")
                    if(chatrm){
                        chatrm.classList.add("disable");
                        chatrm.classList.remove("enable")
                    }
                }

                if(chatroomTab != null){
                    if(!listTab.classList.contains("active")){
                        listTab.classList.add("active")
                    }
                    chatroomTab.classList.remove("active");
                }

                if(virtualclass.serverData != null){
                    virtualclass.serverData.rawData = {video:[], ppt:[], docs:[]};
                    if(roles.hasAdmin()){
                        virtualclass.serverData.fetchAllData();
                    }
                }

                virtualclass.gObj.wIds = [0];
                virtualclass.gObj.wbCount = 0;
                virtualclass.wbCommon.clearNavigation();
                delete virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
            }
        },

        // Store for document sharing data
        dstdata: {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('alldocs')) {
                        console.log('document share store');
                        dataStore = true;
                        virtualclass.gObj.docs = JSON.parse(cursor.value.alldocs);
                        // virtualclass.gObj.docs = 'init';

                        }
                    cursor = await cursor.continue();
                }

                if(!dataStore){
                    virtualclass.gObj.docs = 'init';
                    console.log("==== Docs init ");
                }
            }
        },

        dstAllStore : function (data){
            const tx = this.db.transaction('dstall', 'readwrite');
            tx.store.clear();

            let allNotes = JSON.stringify(virtualclass.dts.allNotes);
            tx.store.add({dstalldocs: JSON.stringify(data), allNotes : allNotes, timeStamp: new Date().getTime(), id: 10});
            tx.done.then(() => {console.log('success')}, () => {console.log('failure')});
        },

        dstall:  {
            handleResult : async function (cursor) {
                while (cursor) {
                    if (cursor.value.hasOwnProperty('dstalldocs')) {
                        console.log('document share store');
                        dataAllStore = true;
                        // We are not getting the data from local storage for now
                        virtualclass.gObj.dstAll = JSON.parse(cursor.value.dstalldocs);
                        virtualclass.gObj.dstAllNotes = JSON.parse(cursor.value.allNotes);
                    }
                    cursor = await cursor.continue();
                }

                if(!dataAllStore){
                    console.log('document share store init');
                    virtualclass.gObj.dstAll = 'init';
                }
            }
        },

        clearSingleTable : function (table, lastTable){
            const tx = this.db.transaction(table, 'readwrite');
            tx.store.clear();

            if(typeof lastTable !== 'undefined'){
                lastTable();
            }

            // if we clear the indexed db then we need to
            // that docs to be init
            if(table == 'dstdata'){
                virtualclass.gObj.docs = 'init';
                console.log("==== Docs init ");
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
                if(i+1 == this.tables.length){
                    this.clearSingleTable(this.tables[i], this.clearLastTable);
                } else {
                    this.clearSingleTable(this.tables[i]);
                }
            }
        },

        clearLastTable(){
            if(virtualclass.gObj.hasOwnProperty('sessionEndResolve')){
                virtualclass.gObj.sessionEndResolve();
            }
        },

        // Get quiz data, store in array based on
        // key and then return array of object
        getQuizData : async function (){
            var dataArr = [];
            let cursor = await this.db.transaction('quizData').store.openCursor();
            while (cursor) {
                var qdata = cursor.value;
                dataArr[cursor.value.quizkey] = cursor.value.qzData;
                cursor = await cursor.continue();
            }

            cb(dataArr);
        },

        // Clear all data from given table
        clearTableData: function (table) {
            const tx = this.db.transaction(table, 'readwrite');
            tx.store.clear();
        },

        // get whiteboard data accoring to whieboard id

        getWbData : async function (wbId){
            let tx = await this.db.transaction('wbData', 'readwrite');
            let store = tx.objectStore('wbData');
            let wb = await store.get(wbId);

            if(typeof wb !== 'undefined'){
                console.log('Whiteboard start store from local storage ' + wbId);
                virtualclass.gObj.tempReplayObjs[wbId] = [];
                virtualclass.gObj.tempReplayObjs[wbId] = JSON.parse(wb.repObjs);
            } else {
                virtualclass.gObj.tempReplayObjs[wbId] = 'nodata';
            }
        }
    };
    window.storage = storage;
})(window);
