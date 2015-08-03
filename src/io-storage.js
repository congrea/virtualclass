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
            msg = virtualclass.dtCon.base64EncArrInt(msg);
        } else if (Object.prototype.toString.call(msg) == "[object Uint8ClampedArray]") {
            dtype = 'c';
            msg = virtualclass.dtCon.base64EncArr(msg);
        }
        this.completeStorage(msg, {type: dtype});
    },

    completeStorage: function (data, bdata, sessionEnd) {

        if (virtualclass.hasOwnProperty('getContent') && virtualclass.getContent == true) {
            return; // not store when data is fetching from indexeddb
        }

        if (typeof firstTime == 'undefined') {
            referenceTime = window.pageEnter;
            firstTime = true;

            if (!virtualclass.vutil.isPlayMode()) {
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