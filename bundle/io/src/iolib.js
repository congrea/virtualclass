// This file is part of vidyamantra - http://vidyamantra.com/
/**
 * JavaScript core library for messaging
 *
 * @package    iocore
 * @copyright  2014 Pinky Sharma  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

var io = {
    cfg: {},
    sock: null,
    wsuri: null,
    error: null,
    uniquesids: null,
    init: function (cfg, callback) {
        "use strict";
        this.cfg = cfg;
        var that = this;
        this.wsconnect();
    },

    wsconnect: function () {
        "use strict";
        io.wsuri = "wss://" + this.cfg.rid;
        if ("WebSocket" in window) {
            this.sock = new WebSocket(io.wsuri);
        } else if ("MozWebSocket" in window) {
            this.sock = new MozWebSocket(io.wsuri);
        } else {
            console.log("Browser does not support WebSocket!");
            this.error = lang.wserror;
        }
        var scope = this;
        this.sock.onopen = function () {
            console.log("Connected to " + scope.cfg.rid);

            $.event.trigger({
                type: "connectionopen"
            });
            //authenticate user
            scope.userauthenticat();

            // user join chat room
            scope.addclient();
        };
        this.sock.binaryType = 'arraybuffer';
        this.sock.onmessage = function (e) {
            io.onRecMessage(e);
        };

        this.sock.onerror = function (e) {
            scope.error = e;
            console.log('Error:' + e);
            $.event.trigger({
                type: "error",
                message: e
            });

        };
        this.sock.onclose = function (e) {
            console.log('Connection Closed');

            $.event.trigger({
                type: "connectionclose",
                message: e.reason
            });
            console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
            //  setTimeout(function(){scope.wsconnect()}, 5000);
        };
    },

    userauthenticat: function () {
        "use strict";
        var obj = {
            cfun: 'authenticate',
            arg: {'authuser': this.cfg.authuser, 'authpass': this.cfg.authpass}
        };
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },

    addclient: function () {
        "use strict";
        var obj = {
            cfun: 'joinroom',
            arg: {'client': this.cfg.userid, 'roomname': this.cfg.room, 'user': this.cfg.userobj}
        };
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },

    send: function (msg) {
        if(this.sock == null){
            console.log("socket is not created");
            return;
        }

        "use strict";
        var bctype = 'broadcastToAll';

        if(msg.hasOwnProperty('eddata')){

            if(msg.eddata != 'initVcEditor' && msg.eddata != 'virtualclass-editor-operation'){
                if(virtualclass.currApp == "Editor" || virtualclass.currApp == "editor"){
                    msg.et = 'editor';
                } else if (virtualclass.currApp == "EditorCode" || virtualclass.currApp == "editorCode"){
                    msg.et = 'editorCode';
                }else {
                    msg.et = msg.et;
                }
            }

            bctype = 'broadcast';
        }

        var obj = {
            //cfun : 'broadcast',
            cfun: bctype,
            arg: {'msg': msg}
        };


        if (arguments.length > 1) {
            var uid = arguments[1];// user id to  whom msg is intented
            obj.arg.touser = this.uniquesids[uid];
        }

        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);

        if (arguments.length == 1) {
            // STORAGE
            var storObj = {
                //cfun : 'broadcast',
                type: bctype,
                m: msg,
                userto: obj.arg.hasOwnProperty('touser') ? obj.arg.touser : "",
                user: virtualclass.uInfo.userobj
            };

            if(storObj.type != 'broadcast'){
                var storjobj = JSON.stringify(storObj);
                //getMsPckt, can not request the packets from other user during replay
                if (!msg.hasOwnProperty('sEnd') && !msg.hasOwnProperty('getMsPckt')) {
                    this.completeStorage(storjobj);
                }
            }
        }

    },

    sendBinary: function (msg) {
        "use strict";
        this.sock.send(msg.buffer);
        this.dataBinaryStore(msg);
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

    sendBinary_old: function (msg) {
        "use strict";
        this.sock.send(msg.buffer);
        //2nd parameter about binary data
        var bcsv = Array.prototype.join.call(msg, ",");

        if (Object.prototype.toString.call(msg) == "[object Int8Array]") {
            bcsv = 'a,' + msg.length + ',' + bcsv;
        } else if (Object.prototype.toString.call(msg) == "[object Uint8ClampedArray]") {
            bcsv = 'c,' + msg.length + ',' + bcsv;
        }
        this.completeStorage(bcsv, true);
    },

    onRecMessage: function (e) {
        "use strict";
        //try {
            var scope = this;
            if (e.data instanceof ArrayBuffer) {
                $.event.trigger({
                    type: "binrec",
                    message: e.data
                });
                var data_pack = new Uint8Array(e.data);
                var msg = (data_pack[0] == 101) ? new Int8Array(data_pack) : new Uint8ClampedArray(data_pack);
                this.dataBinaryStore(msg);
            } else {
                var receivemsg = JSON.parse(e.data);
                if (!receivemsg.hasOwnProperty('userto') || (receivemsg.hasOwnProperty('userto') &&  receivemsg.m.hasOwnProperty('eddata'))) {
                    io.completeStorage(e.data);

                    //////TODO this has to be simpliyfied
                    //if(receivemsg.hasOwnProperty('m')){
                    //    if(receivemsg.m.hasOwnProperty('eddata')){
                    //        if(receivemsg.m.eddata != 'init'){
                    //            io.completeStorage(e.data);
                    //        }
                    //    }else {
                    //        io.completeStorage(e.data);
                    //    }
                    //} else {
                    //    io.completeStorage(e.data);
                    //}
                }
                var userto = '';
                switch (receivemsg.type) {
                    case "joinroom":
                        console.log("New user join room " + receivemsg.users);
                        /* identifying new user from list*/
                        var newuser = null;
                        if (scope.uniquesids != null) {
                            $.each(receivemsg.clientids, function (i, v) {
                                if (scope.uniquesids[i] == undefined) {
                                    newuser = i;
                                }
                            });
                        }
                        scope.uniquesids = receivemsg.clientids;
                        //update users
                        $.event.trigger({
                            type: "member_added",
                            message: receivemsg.users,
                            newuser: newuser
                        });
                        break;
                    case "broadcastToAll":
                    case "broadcast":
                        if (receivemsg.userto != undefined) {
                            userto = receivemsg.userto;
                        }
                        $.event.trigger({
                            type: "newmessage",
                            message: receivemsg.m,
                            fromUser: receivemsg.user,
                            toUser: userto
                        });
                        break;
                    case "userleft":
                        if (receivemsg.userto != undefined) {
                            userto = receivemsg.userto;
                        }
                        if (scope.uniquesids != null) {
                            delete scope.uniquesids[receivemsg.user.userid];
                        }
                        $.event.trigger({
                            type: "user_logout",
                            fromUser: receivemsg.user,
                            message: 'offline',
                            toUser: userto
                        });
                        break;
                    case "leftroom":
                        $.event.trigger({
                            type: "member_removed",
                            message: receivemsg.users
                        });
                        break;
                    case "Unauthenticated":
                        $.event.trigger({
                            type: "authentication_failed",
                            message: 'Authentication failed'
                        });
                        break;
                    case "Multiple_login":
                        $.event.trigger({
                            type: "Multiple_login"
                        });
                        break;
                }
            }
        //} catch (e) {
        //    console.log("Error catched   : " + e);
        //    $.event.trigger({
        //        type: "error",
        //        message: e
        //    });
        //}
    },

    disconnect: function () {
        this.sock.onclose = function () {
        };
        this.sock.close();
        console.log("i am closing this connection");
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