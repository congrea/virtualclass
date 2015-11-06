var ioStorage = {

    sendStore: function (msg, cfun) {
        "use strict";
        var storObj, storjobj;

        storObj = {
            //cfun : 'broadcast',
            type: cfun,
            m: msg,
            userto: null,
            user: virtualclass.uInfo.userobj
        };

        storjobj = JSON.stringify(storObj);
        //getMsPckt, can not request the packets from other user during replay
        if (!msg.hasOwnProperty('sEnd') && !msg.hasOwnProperty('getMsPckt')) {
            this.completeStorage(storjobj);
        }
    },

    dataBinaryStore: function (msg) {
        "use strict";
        var dtype;
        if (Object.prototype.toString.call(msg) == "[object Int8Array]") {
            dtype = 'a';

            //dtConWorker.postMessage({dt:});

            //msg = virtualclass.dtCon.base64EncArrInt(msg);

        } else if (Object.prototype.toString.call(msg) == "[object Uint8ClampedArray]") {
            dtype = 'c';
            //msg = virtualclass.dtCon.base64EncArr(msg);
        }

        dtConWorker.postMessage({dt : dtype, 'msg' : msg});
        var that = this;
        dtConWorker.onmessage = function (e){
            that.completeStorage(e.data.msg, {type: e.data.dt});
        }
    },

    dataAdapterStore: function (allData, serialKey) {
        if (typeof virtualclass.storage == 'object' && typeof virtualclass.storage.db == 'object') {
            virtualclass.storage.dataAdapterAllStore(JSON.stringify(allData), serialKey);
        } else {
            setTimeout(
                function () {
                    ioStorage.dataAdapterStore(allData, serialKey); //if table of indexeddb is not ready yet.
                },
                10
            );
        }
    },

    dataUserAdapterMustData: function (allData, serialKey) {
        if (typeof virtualclass.storage == 'object' && typeof virtualclass.storage.db == 'object') {
            virtualclass.storage.dataUserAdapterAllStore(JSON.stringify(allData), serialKey);
        } else {
            setTimeout(
                function () {
                    ioStorage.dataUserAdapterMustData(allData, serialKey); //if table of indexeddb is not ready yet.
                },
                10
            );
        }
    },

    dataExecutedStoreAll: function (DataExecutedAll, serialKey) {
        virtualclass.storage.dataExecutedStoreAll(JSON.stringify(DataExecutedAll), serialKey);
    },

    dataExecutedUserStoreAll: function (DataExecutedUserAll, serialKey) {
        virtualclass.storage.dataExecutedUserStoreAll(JSON.stringify(DataExecutedUserAll), serialKey);
    },



    ioCompleteStorageInit : function (data) {
        try {
            ioStorage.completeStorage(data);
        } catch (error) {
            var that = this;
            setTimeout(function () {
                that.ioCompleteStorageInit(data);
            }, 10);
        }
    },

    completeStorage: function (data, bdata, sessionEnd) {
        if (virtualclass.hasOwnProperty('getContent') && virtualclass.getContent == true) {
            return; // not store when data is fetching from indexeddb
        }

        if (typeof firstTime == 'undefined') {
            referenceTime = window.pageEnter;
            firstTime = true;
            if (!virtualclass.vutil.isPlayMode()) {
                //TODO this should be handle gracefully
                try {
                    var t = virtualclass.storage.db.transaction(['allData'], "readwrite");
                } catch (error) {
                    this.ioCompleteStorageInit(data);
                    return;
                }

                var t = virtualclass.storage.db.transaction(['allData'], "readwrite");
                if (typeof t != 'undefined') {
                    //should check first row is authuser/authpass
                    // clear if differnt else leave as it is
                    var objectStore = t.objectStore('allData');
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value.hasOwnProperty('recObjs')) {
                                if (!cursor.value.hasOwnProperty('bd')) {
                                    var recObs = JSON.parse(cursor.value.recObjs);
                                    if (!recObs.hasOwnProperty('authuser')) {
                                       objectStore.clear();
                                    }
                                } else {
                                      objectStore.clear();
                                }
                            }
                        }
                    };
                }

            }
        }

        var currTime = new Date().getTime();
        var playTime = currTime - referenceTime;

        if (typeof sessionEnd != 'undefined') {
            //undefined for data and bindary data
            virtualclass.storage.completeStorage(playTime, undefined, undefined, sessionEnd)
        } else {
            (typeof bdata == 'undefined') ? virtualclass.storage.completeStorage(playTime, data) : virtualclass.storage.completeStorage(playTime, data, bdata);
        }

        referenceTime = currTime;
    }

};