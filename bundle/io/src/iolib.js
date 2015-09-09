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
        serial: null,

        init: function (cfg, callback) {
            "use strict";
            this.cfg = cfg;
            this.wsconnect();
        },

        wsconnect: function () {
            "use strict";
            io.wsuri = this.cfg.rid;
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

                if (e.data instanceof ArrayBuffer) {
                    io.onRecBinary(e)
                } else {
                    var msg = JSON.parse(e.data); //msg.user is from user
                    if (msg.hasOwnProperty('m')) {
                        if (msg.m.hasOwnProperty('serial')) {
                            ioMissingPackets.checkMissing(msg);
                        } else if (msg.m.hasOwnProperty('reqMissPac')) {
                            ioMissingPackets.sendMissedPackets(msg);
                        } else if (msg.m.hasOwnProperty('missedpackets')) {
                            ioMissingPackets.fillExecutedStore(msg);
                        }  else if (msg.m.hasOwnProperty('userSerial')) {
                            ioMissingPackets.userCheckMissing(msg);
                        } else if (msg.m.hasOwnProperty('userReqMissPac')) {
                            ioMissingPackets.userSendMissedPackets(msg);
                        } else if (msg.m.hasOwnProperty('userMissedpackets')) {
                            ioMissingPackets.userFillExecutedStore(msg);
                        } else {
                            io.onRecSave(msg, e.data);
                            io.onRecJson(msg);
                        }
                    } else {
                        io.onRecSave(msg, e.data);
                        io.onRecJson(msg);
                    }
                }

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
                setTimeout(function () {
                    scope.wsconnect()
                }, 5000);
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

        send: function (msg, cfun, touser) {
            "use strict";

            if (this.sock == null) {
                console.log("socket is not created");
                return;
            }
            var obj = {
                cfun: cfun,
                arg: {'msg': msg}
            };

            if (touser) {
                obj.arg.touser = touser;
            }

            var jobj = JSON.stringify(obj);
            this.sock.send(jobj);


        },

        sendBinary: function (msg) {
            "use strict";
            this.sock.send(msg.buffer);
        },

        onRecMessage: function (e) {
            if (e.data instanceof ArrayBuffer) {
                this.onRecBinary(e)
            } else {
                var msg = JSON.parse(e.data);
                this.onRecSave(msg, e.data);
                io.onRecJson(msg, e.data);
            }
        },

        onRecSave: function (msg,edata) {
            if (!msg.hasOwnProperty('userto') || (msg.hasOwnProperty('userto') && msg.m.hasOwnProperty('eddata'))) {
                ioStorage.completeStorage(edata);
            }
        },

        onRecBinary: function (e) {
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
                    ioStorage.dataBinaryStore(msg);
                }
            //} catch (e) {
            //    console.log("Error catched   : " + e);
            //    $.event.trigger({
            //        type: "error",
            //        message: e
            //    });
            //}
        },


        onRecJson: function (receivemsg) {
        //    try {
                //if (!receivemsg.hasOwnProperty('userto') || (receivemsg.hasOwnProperty('userto') && receivemsg.m.hasOwnProperty('eddata'))) {
                //    ioStorage.completeStorage(savedata);
                //}
                var userto = '';
                switch (receivemsg.type) {
                    case "joinroom":
                        console.log("New user join room " + receivemsg.users);
                        /* identifying new user from list*/
                        var newuser = null;
                        if (io.uniquesids != null) {
                            $.each(receivemsg.clientids, function (i, v) {
                                if (io.uniquesids[i] == undefined) {
                                    newuser = i;
                                }
                            });
                        }
                        io.uniquesids = receivemsg.clientids;
                        //update users
                        $.event.trigger({
                            type: "member_added",
                            message: receivemsg.users,
                            newuser: newuser
                        });
                        break;
                    case "broadcastToAll":
                    case "broadcast":
                        if (receivemsg !== null) {
                            if (receivemsg.userto != undefined) {
                                userto = receivemsg.userto;
                            }
                            $.event.trigger({
                                type: "newmessage",
                                message: receivemsg.m,
                                fromUser: receivemsg.user,
                                toUser: userto
                            });
                        }
                        break;
                    case "userleft":
                        if (receivemsg.userto != undefined) {
                            userto = receivemsg.userto;
                        }
                        if (io.uniquesids != null) {
                            delete io.uniquesids[receivemsg.user.userid];
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
        }


    }
    ;
