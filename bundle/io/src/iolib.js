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
    packetQueue: [],
    init: function(cfg, callback) {
        "use strict";
        this.cfg = cfg;
        this.wsconnect();
    },
    wsconnect: function() {

        "use strict";
        console.log('init for socket connect');
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
        this.sock.onopen = function() {
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
        this.sock.onmessage = function(e) {
            if (e.data instanceof ArrayBuffer) {
                io.onRecBinary(e)
            } else {
                var msg = JSON.parse(e.data); //msg.user is from user
                if (msg.hasOwnProperty('m')) {
                    if (msg.m.hasOwnProperty('serial')) {
                        ioMissingPackets.checkMissing(msg);
                    } else if (msg.m.hasOwnProperty('reqMissPac')) {
                        // there is bing upload the content then we will not send miss packet
                        if (!virtualclass.recorder.hasOwnProperty('startUpload')) {
                            ioMissingPackets.sendMissedPackets(msg);
                        }

                    } else if (msg.m.hasOwnProperty('missedpackets')) {
                        ioMissingPackets.fillExecutedStore(msg);
                    } else if (msg.m.hasOwnProperty('userSerial')) {
                        ioMissingPackets.userCheckMissing(msg);
                    } else if (msg.m.hasOwnProperty('userReqMissPac')) {
                        // there is bing upload the content then we will not send miss packet
                        if (!virtualclass.recorder.hasOwnProperty('startUpload')) {
                            ioMissingPackets.userSendMissedPackets(msg);
                        }

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

        this.sock.onerror = function(e) {
            scope.error = e;
            console.log('Error:' + e);
            $.event.trigger({
                type: "error",
                message: e
            });

        };
        this.sock.onclose = function(e) {
            console.log('Connection Closed');

            $.event.trigger({
                type: "connectionclose",
                message: e.reason
            });
            console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");

            // downloadProgress is used to validate that the popup box is removing
            // when download button is suppose to appear
            // this happens at l.vidya.io
            setTimeout(function() {
                // For prevent to send any packet to other during save session
                // and download session
                if (!virtualclass.gObj.hasOwnProperty('saveSession') && !virtualclass.gObj.hasOwnProperty('downloadProgress') && !virtualclass.recorder.uploadInProcess) {
                    scope.wsconnect();
                }
            }, 5000);
        };

    },
    userauthenticat: function() {
        "use strict";
        var obj = {
            cfun: 'authenticate',
            arg: {'authuser': this.cfg.authuser, 'authpass': this.cfg.authpass}
        };
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },
    addclient: function() {
        "use strict";
        var obj = {
            cfun: 'joinroom',
            arg: {'client': this.cfg.userid, 'roomname': this.cfg.room, 'user': this.cfg.userobj}
        };
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },
    send: function(msg, cfun, touser) {
        "use strict";
        if (msg.hasOwnProperty('m')) {
            if (msg.m.user == 'all') {
                alert('som packet are sending');
                
            }
        }
        var obj = {
            cfun: cfun,
            arg: {'msg': msg}
        };

        if (touser) {
            obj.arg.touser = touser;
        }


        //if(io.sock != null && io.sock.readyState == 1){
        //    if (touser) {
        //        touser = io.uniquesids[touser];
        //        if(touser == 'undefined' || typeof touser == 'undefined'){
        //            console.log("Couldn't send packet, " + touser + " " + " is not connected.");
        //        } else {
        //            io.send(msg, cfun, touser);
        //        }
        //    }
        //} else {
        //    console.log('Socket is not created.');
        //}

        var jobj;

        if (this.sock && this.sock.readyState == 1) { // If Socket is ready
            if (io.packetQueue.length > 0) {
                for (var i = 0; i < io.packetQueue.length; i++) {
                    var tmp_jobj = JSON.parse(io.packetQueue[i]);
                    this.realSend(tmp_jobj);
                }
                io.packetQueue.length = 0;
            }
            // Now send requested msg
            this.realSend(obj);
        } else { // Save msg in queue
            console.log("SOCKET is not ready.");
            jobj = JSON.stringify(obj);
            io.packetQueue.push(jobj);
        }
    },
    realSend: function(obj) {
        "use strict";
        if (typeof obj.arg.touser != 'undefined') {

            obj.arg.touser = io.uniquesids[obj.arg.touser];

            if (typeof obj.arg.touser == 'undefined') {
                console.log("User is not connected." + obj.arg.touser);
                return;
            }
        }
        var jobj = JSON.stringify(obj);

        this.sock.send(jobj);
        this.sock.onerror = function(error) {

        }
        //this.sock.onclose = function (e){
        //    debugger;
        //    alert('close');
        //}

    },
    sendBinary: function(msg) {
        "use strict";
        if ((this.sock && this.sock.readyState == 1)) {
            this.sock.send(msg.buffer);
        }

    },
    onRecMessage: function(e) {
        if (e.data instanceof ArrayBuffer) {
            this.onRecBinary(e)
        } else {
            var msg = JSON.parse(e.data);
            this.onRecSave(msg, e.data);
            io.onRecJson(msg, e.data);
        }
    },
    onRecSave: function(msg, edata) {
        if (!msg.hasOwnProperty('userto') || (msg.hasOwnProperty('userto') && msg.m.hasOwnProperty('eddata'))) {
            ioStorage.completeStorage(edata);
        }
    },
    onRecBinary: function(e) {
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
    onRecJson: function(receivemsg) {
//        if( typeof receivemsg.m !='undefined') {
//            if( typeof receivemsg.m.ppt !='undefined') {
//                if( typeof receivemsg.m.ppt.startFrom !='undefined') {
//                    virtualclass.sharePt.startFromFlag=1;
//                    var frame= document.getElementById('pptiframe') 
//                    if(frame !=null){
//                     if (receivemsg.m.ppt.init.search("postMessage") < 0) {
//                    frame.setAttribute("src", receivemsg.m.ppt.init+ "?postMessage=true&postMessageEvents=true");
//                } else {
//                   frame.setAttribute("src", receivemsg.m.ppt.init);
//                }   
//                   setTimeout(function(){
//                     frame.contentWindow.postMessage(JSON.stringify({method: 'slide', args:[receivemsg.m.ppt.startFrom.indexh,receivemsg.m.ppt.startFrom.indexv,receivemsg.m.ppt.startFrom.indexf] }), '*'); 
//                   },2000)
//                    
//                   }
//                }
//            }
//        }
        var userto = '';
        switch (receivemsg.type) {
            case "joinroom":
                console.log("New user join room " + receivemsg.users);
                /* identifying new user from list*/
                var newuser = null;
                if (io.uniquesids != null) {
                    $.each(receivemsg.clientids, function(i, v) {
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

                //   console.log('broad cast');
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
                console.log('Case:- userleft');
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
                console.log('Case:- leftroom');
                $.event.trigger({
                    type: "member_removed",
                    message: receivemsg.users
                });
                break;
            case "Unauthenticated":
                console.log('Case:- unauthenticated');
                $.event.trigger({
                    type: "authentication_failed",
                    message: 'Authentication failed'
                });
                break;
            case "Multiple_login":
                console.log('Case:- Multiple_login');
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
    disconnect: function() {
        this.sock.onclose = function() {
        };
        this.sock.close();
        console.log("i am closing this connection");
    }
};

