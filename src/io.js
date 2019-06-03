// This file is part of vidyamantra - http://vidyamantra.com/
/**
 * JavaScript core library for messaging
 * * @package    iocore
 * @copyright  2014 Suman Bogati, Pinky Sharma and Jai Gupta  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
var io = {
    cfg: {},
    sock: null,
    wsuri: null,
    error: null,
    uniquesids: null,
    serial: null,
    globallock: false,
    readyToSend: false,
    globalmsgjson: [],
    packetQueue: [],
    binMsgQueue: [],
    jsnMsgQueue: [],
    recBinMsgQueue: [],
    recjsnMsgQueue: null,
    stockReadyState: false,
    workerIOOnmessage: false,
    sessionSet: false,
    init: function (cfg) {
        this.cfg = cfg;
        "use strict";
        console.log("==== io init ");
        ioInit.sendToWorker({cmd: 'init', msg: cfg});
    },

    send: function (msg, cfun, touser) {
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

        var jobj;

        if (this.webSocketConnected() && io.sessionSet) { // If Socket is ready
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

    realSend: function (obj) {
        "use strict";
        if (typeof obj.arg.touser != 'undefined') {
            if (io.uniquesids == null) {
                console.log('uniqueid is null');
            } else {
                obj.arg.touser = io.uniquesids[obj.arg.touser];
                if (typeof obj.arg.touser == 'undefined') {
                    console.log("User is not connected." + obj.arg.touser);
                    return;
                }
            }
        }

        // earlier the below information sent by server
        //var userObj = { name : wbUser.name, lname : wbUser.lname, role:wbUser.role, userid : wbUser.id};
        var userObj = {userid: wbUser.id};
        switch (obj.cfun) {
            case "broadcastToAll":
                if (typeof obj.arg.touser == "undefined") {
                    var sobj = {
                        //type: 'broadcastToAll',
                        user: userObj,
                        m: obj.arg.msg
                    };
                    var jobj = 'F-BR-{"0' + JSON.stringify(sobj);
                } else {
                    var sobj = {
                        //type: 'broadcastToAll',
                        //user: virtualclass.gObj.uid,
                        user: userObj,
                        m: obj.arg.msg,
                        userto: obj.arg.touser
                    };
                    var touser = obj.arg.touser;
                    while (touser.length < 12) {
                        touser = '0' + touser;
                    }
                    var jobj = 'F-BRU-{"' + touser + '{"0' + JSON.stringify(sobj);
                }
                break;
            case "ping":
                var sobj = {
                    type: 'PONG',
                    m: obj.arg.msg
                };
                var jobj = 'F-PI-' + JSON.stringify(sobj);
                break;

            case "speed":
                var jobj = 'F-SPE-{"' + obj.arg.msg;
                break;

            case "session":
                var jobj = 'F-SS-{"' + obj.arg.msg;
                break;

            case "recording":
                var jobj = 'F-SR-{"' + obj.arg.msg;
                break;

            default:
                var jobj = JSON.stringify(obj);
        }

        // console.log('Total time ' + timeSec +', String send ' + jobj);
        if (jobj.length <= 600000) { //600k
            // this.sock.send(jobj);
            workerIO.postMessage({cmd: 'send', msg: jobj});

            //this.sock.onerror = function(error) {}
        } else {
            this.jsnMsgQueue = this.chunkSubstr(jobj, 550000); // 550k
            if (this.jsnMsgQueue) {
                for (var i = 0; i < this.jsnMsgQueue.length; i++) {
                    // this.sock.send(this.jsnMsgQueue[i]);
                    workerIO.postMessage({cmd: 'send', msg: this.jsnMsgQueue[i]});
                }
            }
            this.jsnMsgQueue = [];
        }
    },

    chunkSubstr: function (str, size) {
        if (str.startsWith('F-BR-{"0')) {
            var prefix = 'F-BR-{"';
            str = str.replace('F-BR-{"0', '');
        } else if (str.startsWith('F-BRU-{"')) {
            var prefix = str.substring(0, 22);
            str = str.substring(23, str.length);
        } else {
            return false;
        }
        const numChunks = Math.ceil(str.length / size);
        const chunks = new Array(numChunks);
        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
            chunks[i] = str.substr(o, size)
            if (i == 0) {
                chunks[i] = prefix + '1' + chunks[i];
            } else if (i < numChunks - 1) {
                chunks[i] = prefix + '2' + chunks[i];
            } else {
                chunks[i] = prefix + '3' + chunks[i];
            }
        }
        return chunks
    },

    cleanRecJson: function (str) {
        if (!str.startsWith('{"0{"') && !str.startsWith('{"1{"') && !str.startsWith('{"2') && !str.startsWith('{"3')) {
            return str;
        } else if (str.startsWith('{"0{"')) {
            str = str.replace('{"0{"', '{"');
            return str;
        }
        if (str.startsWith('{"1{"')) {
            this.recjsnMsgQueue = str.replace('{"1{"', '{"');
        } else if (str.startsWith('{"2')) {
            if (this.recjsnMsgQueue.length > 0) {
                this.recjsnMsgQueue = this.recjsnMsgQueue + str.replace('{"2', '');
            }
        } else if (str.startsWith('{"3')) {
            if (this.recjsnMsgQueue.length > 0) {
                this.recjsnMsgQueue = this.recjsnMsgQueue + str.replace('{"3', '');
                return this.recjsnMsgQueue;
            }
        } else {
            this.recjsnMsgQueue = '';
            return false;
        }
        return false;
    },

    sendBinary: function (msg) {
        workerIO.postMessage({cmd: 'sendBinary', msg: msg});
    },

    onRecMessage: function (e) {
        if (e.data instanceof ArrayBuffer) {
            // this.onRecBinary(e)
            workerIO.postMessage({'cmd': 'onRecBinary', msg: e.data});
        } else {
            // console.log("==== ElapsedTime playtime REC : ", e.data);
            ioInit.onmessage({data: {cmd: 'receivedJson', msg: e.data}});

            // var msg = JSON.parse(e.data);
            // this.onRecSave(msg, e.data);
            // io.onRecJson(msg, e.data);
        }
    },

    // Check if websocket is ready to send
    webSocketConnected: function () {
        return (io.stockReadyState == 1 && this.readyToSend == true)
    },

    onRecJson: function (receivemsg) {
        if (io.globallock === false) {
            if (io.globalmsgjson.length > 0) {
                while (io.globalmsgjson.length > 0 && io.globallock === false) {
                    var recmsg = io.globalmsgjson.shift();
                    io.onRecJsonIndividual(recmsg);
                }
            } else if (receivemsg != null && io.globallock === false && io.globalmsgjson.length == 0) {
                io.onRecJsonIndividual(receivemsg);
            } else if (receivemsg != null) {
                io.globalmsgjson.push(receivemsg);
            }
        } else if (receivemsg != null) {
            io.globalmsgjson.push(receivemsg);
        }
    },

    onRecJsonIndividual: function (receivemsg) {
        var userto = '';
        switch (receivemsg.type) {
            case "joinroom":
                if (receivemsg.hasOwnProperty('users')) { // When self web socket is connected
                    ioAdapter.setRecording();
                    if (!roles.hasControls()) {
                        ioAdapter.makeSessionReady();
                    }
                    console.log("==== Member add, join room");
                } else {
                    console.log("No users");
                }

                this.readyToSend = true;

                workerIO.postMessage({cmd: 'readyToSend'});

                /* identifying new user from list*/
                var newuser = null;
                if (io.uniquesids != null) {
                    for (let i in receivemsg.clientids) {
                        if (io.uniquesids[i] == undefined) {
                            newuser = i;
                        }
                    }
                }

                io.uniquesids = receivemsg.clientids;
                //update users
                var msg = {
                    type: "member_added",
                    newuser: newuser,
                    joinUser: receivemsg.action
                }

                if (receivemsg.hasOwnProperty('users')) {
                    msg.message = receivemsg.users;
                    msg.users = true;

                } else if (receivemsg.hasOwnProperty('user')) {
                    msg.message = receivemsg.user;
                    msg.user = true;
                }


                if ((!virtualclass.vutil.isPlayMode() ||
                    receivemsg.hasOwnProperty('clientids') && !virtualclass.hasOwnProperty('connectedUsers') || // When self joined the room
                    virtualclass.hasOwnProperty('connectedUsers') && !receivemsg.hasOwnProperty('clientids'))) { // When other join the room
                    virtualclass.ioEventApi.readyto_member_add(msg);
                }
                break;
            case "broadcastToAll":
            case "broadcast":
                if (receivemsg !== null) {
                    if (receivemsg.userto != undefined) {
                        userto = receivemsg.userto;
                    }

                    virtualclass.ioEventApi.newmessage({
                        type: "newmessage",
                        message: receivemsg.m,
                        fromUser: receivemsg.user,
                        // toUser is user on which the action to be performed
                        toUser: virtualclass.vutil.getUserAllInfo(userto, virtualclass.connectedUsers)
                    });
                }
                break;
            case "userleft":

                if (receivemsg.userto != undefined) {
                    userto = receivemsg.userto;
                }
                if (io.uniquesids != null) {
                    for (let uid in receivemsg.action) {
                        console.log('===== JOIN user left call ' + uid);
                        delete io.uniquesids[uid];
                    }
                }

                virtualclass.ioEventApi.readyto_user_logout(receivemsg);

                break;
            case "Unauthenticated":
                console.log('Case:- unauthenticated');
                virtualclass.ioEventApi.authentication_failed({
                    type: "authentication_failed",
                    message: 'Authentication failed'
                });
                break;
            case "Multiple_login":
                console.log('Case:- Multiple_login');
                virtualclass.ioEventApi.Multiple_login({
                    type: "Multiple_login"
                });
                break;
            case "PONG":
                // console.log('Case:- PONG');
                virtualclass.ioEventApi.PONG({
                    type: "PONG",
                    message: receivemsg.m
                });
                break;

            case "Text_Limit_Exeed":
                // console.log('Case:- PONG');
                virtualclass.ioEventApi.Text_Limit_Exeed({
                    type: "Text_Limit_Exeed"
                });
                break;

            case "Binary_Limit_Exeed":
                // console.log('Case:- PONG');
                virtualclass.ioEventApi.Binary_Limit_Exeed({
                    type: "Binary_Limit_Exeed"
                });
                break;

            case "Max_rooms":
                // console.log('Case:- PONG');
                virtualclass.ioEventApi.Max_rooms({
                    type: "Max_rooms"
                });
                break;

            case "Max_users":
                // console.log('Case:- PONG');
                virtualclass.ioEventApi.Max_users({
                    type: "Max_users"
                });
                break;

            case "setSession":
                if (roles.hasControls()) {
                    ioAdapter.initSetSession(receivemsg.session);
                }
                break;

        }

    },

    disconnect: function () {
        workerIO.postMessage({cmd: 'disconnect'});
    }
};

workerIO.onmessage = function (e) {
    ioInit.onmessage(e);
};

var ioInit = {
    sendToWorker (msg){
        workerIO.postMessage(msg);
    },

    onmessage (e) {
        switch (e.data.cmd) {
            case "connectionopen" :
                io.stockReadyState = 1;
                virtualclass.ioEventApi.connectionopen(e.data.msg);
                break;

            case 'receivedJson':
                var cleanJson = io.cleanRecJson(e.data.msg);
                if (cleanJson) {
                    var msg = JSON.parse(cleanJson); //msg.user is from user/*
                    if (!msg.hasOwnProperty('type') && msg.hasOwnProperty('user')) {
                        // workerIO.postMessage({cmd : 'mkUser', msg:msg});

                        msg.type = "broadcastToAll";
                        if (typeof virtualclass.gObj.allUserObj[msg.user.userid] == 'undefined') {
                            virtualclass.gObj.allUserObj[msg.user.userid] = {};
                            virtualclass.gObj.allUserObj[msg.user.userid].userid = msg.user.userid;
                            virtualclass.gObj.allUserObj[msg.user.userid].lname = ' ';
                            virtualclass.gObj.allUserObj[msg.user.userid].name = 'student';
                            virtualclass.gObj.allUserObj[msg.user.userid].role = 's';
                        }

                        if (virtualclass.gObj.allUserObj[msg.user.userid].userid == msg.user.userid) {
                            msg.user.lname = virtualclass.gObj.allUserObj[msg.user.userid].lname;
                            msg.user.name = virtualclass.gObj.allUserObj[msg.user.userid].name;
                            msg.user.role = virtualclass.gObj.allUserObj[msg.user.userid].role;
                        }
                    }
                    this.recjsnMsgQueue = '';

                    if (msg.hasOwnProperty('m')) {
                        if (msg.m.hasOwnProperty('serial')) {
                            ioMissingPackets.checkMissing(msg);
                        } else if (msg.m.hasOwnProperty('reqMissPac')) {
                            // there is bing upload the content then we will not send miss packet
                            if (!virtualclass.recorder.hasOwnProperty('startUpload')) {
                                ioMissingPackets.sendMissedPackets(msg);
                            }
                        } else if (msg.m.hasOwnProperty('missedpackets')) {
                            console.log('Execute missed packets');
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
                            // return; // for temporary
                            // workerIO.postMessage({cmd : "saveJson", msg :  {msg:msg, cj : cleanJson}});

                            io.onRecJson(msg);
                        }
                    } else {
                        //return; // for temporary
                        io.onRecJson(msg);
                        //  workerIO.postMessage({cmd : "saveJson", msg : {msg:msg, cj : cleanJson}});
                    }
                }

                break;

            case 'onRecBinary':
                io.onRecBinary(e);
                break;

            case 'iamclosing':
                io.stockReadyState = 0;
                break;

            case 'error':
                io.stockReadyState = 0;
                virtualclass.ioEventApi.error({
                    type: "error",
                    message: e.data.msg
                });
                break;

            case 'close':
                io.stockReadyState = 0;
                virtualclass.ioEventApi.connectionclose({
                    type: "connectionclose",
                    message: e.data.msg
                });

                setTimeout(function () {
                    // For prevent to send any packet to other during save session
                    // and download session
                    if (!virtualclass.gObj.hasOwnProperty('endSession') &&
                        !virtualclass.gObj.hasOwnProperty('downloadProgress') &&
                        !virtualclass.recorder.uploadInProcess &&
                        !(virtualclass.gObj.hasOwnProperty('invalidlogin') && virtualclass.gObj.invalidlogin)) {
                        // scope.wsconnect();
                        workerIO.postMessage({cmd: 'wsconnect'});

                    }
                }, 5000);
                break;
            case 'initAudioWorklet':
                if (virtualclass.gObj.hasOwnProperty('isAudioContextReady') && !virtualclass.gObj.audioRecWorkerReady) {
                    if (virtualclass.media.detectAudioWorklet()) {
                        virtualclass.media.audio.initPlay();
                    } else {
                        virtualclass.media.audio.initPlayWithFallback();
                    }
                }

                break;

            case 'stBinary': // storage binary
                if (e.data.hasOwnProperty('triggerBinRec')) {
                    virtualclass.ioEventApi.binrec({
                        type: "binrec",
                        message: e.data.msg.buffer
                    });
                }
                break;

            case 'notaudio': // storage binary
                virtualclass.ioEventApi.binrec({
                    type: "binrec",
                    message: e.data.msg
                });
                break;

            case 'endBinary': // storage binary
                var msg = e.data.msg;
                if (msg.constructor === Int8Array) {
                    var msg1 = new Int8Array(msg.length + 2);
                } else if (msg.constructor === Uint8ClampedArray) {
                    var msg1 = new Uint8ClampedArray(msg.length + 2);
                }
                /** Appending the data for recording **/
                msg1[0] = msg[0];
                msg1[1] = 0;
                msg1.set(msg, 2);
                virtualclass.ioEventApi.binrec({
                    type: "binrec",
                    message: msg.buffer
                });
                break;

            case 'firstAudio': // audio received first time
                var user = virtualclass.user.control.updateUser(e.data.msg.userId, 'ad', true);// creates user object, that is stored in local storage and return the object
                virtualclass.user.control.audioSign(user, "create");
                break;

            case 'audioSign': // audio received first time
                virtualclass.user.control.audioSign(user, "create");
                break;


            default :
                console.log("Do nothing");
        }
    }
};
