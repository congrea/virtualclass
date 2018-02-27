// This file is part of vidyamantra - http://vidyamantra.com/
/**
 * JavaScript core library for messaging
 *
 * @package    iocore
 * @copyright  2014 Pinky Sharma  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

// var timeSec = 0;
// var totalSendata = 0;
// setInterval(
//     function (){
//         timeSec++;
//     }, 1000
// );

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
            this.readyToSend = false;
            console.log("Connected to " + scope.cfg.rid);

            $.event.trigger({
                type: "connectionopen"
            });
            //authenticate user
            scope.userauthenticate();

            // user join chat room
            scope.addclient();
        };
        this.sock.binaryType = 'arraybuffer';
        this.sock.onmessage = function(e) {
            if (e.data instanceof ArrayBuffer) {
                //return;
                io.onRecBinary(e)
            } else {
                var cleanJson = io.cleanRecJson(e.data);
                if (cleanJson) {
                  var msg = JSON.parse(cleanJson); //msg.user is from user/*
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
                          //return; // for temporary
                          io.onRecSave(msg, cleanJson);
                          io.onRecJson(msg);
                      }
                  } else {
                      //return; // for temporary
                      io.onRecSave(msg, cleanJson);
                      io.onRecJson(msg);
                  }
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
                if (!virtualclass.gObj.hasOwnProperty('saveSession') &&
                    !virtualclass.gObj.hasOwnProperty('downloadProgress') &&
                    !virtualclass.recorder.uploadInProcess &&
                    !(virtualclass.gObj.hasOwnProperty('invalidlogin') && virtualclass.gObj.invalidlogin)) {
                    scope.wsconnect();
                }
            }, 5000);
        };

    },
    userauthenticate: function() {
        "use strict";
        var obj = {'authuser': this.cfg.authuser, 'authpass': this.cfg.authpass}
        var jobj = 'F-AH-'+JSON.stringify(obj);
        this.sock.send(jobj);
    },
    addclient: function() {
        "use strict";
        var obj = {'client': this.cfg.userid, 'roomname': this.cfg.room, 'user': this.cfg.userobj}
        var jobj = 'F-JR-'+JSON.stringify(obj);
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

        var jobj;

        if (this.webSocketConnected()) { // If Socket is ready
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
			if(io.uniquesids == null){
				console.log('uniqueid is null');
			}else {
				obj.arg.touser = io.uniquesids[obj.arg.touser];
				if (typeof obj.arg.touser == 'undefined') {
					console.log("User is not connected." + obj.arg.touser);
					return;
				}
			}
        }

        // earlier the below information sent by server
        var userObj = { name : wbUser.name, lname : wbUser.lname, role:wbUser.role, userid : wbUser.id};

        switch (obj.cfun) {
            case "broadcastToAll":
                if (typeof obj.arg.touser == "undefined") {
                    var sobj = {
                        type: 'broadcastToAll',
                        user: userObj,
                        m: obj.arg.msg
                    };
                    var jobj = 'F-BR-{"0'+JSON.stringify(sobj);
                } else {
                    var sobj = {
                        type: 'broadcastToAll',
                        //user: virtualclass.gObj.uid,
                        user: userObj,
                        m: obj.arg.msg,
                        userto: obj.arg.touser
                    };
                    var touser = obj.arg.touser;
                    while (touser.length < 12) {
                        touser = '0'+touser;
                    }
                    var jobj = 'F-BRU-{"'+touser+'{"0'+JSON.stringify(sobj);
                }
                break;
            case "ping":
                var sobj = {
                    type: 'PONG',
                    m: obj.arg.msg
                };
                var jobj = 'F-PI-'+JSON.stringify(sobj);
                break;

            case "speed":
                var jobj = 'F-SPE-{"'+obj.arg.msg;
                break;

            default:
                var jobj = JSON.stringify(obj);
        }

        // console.log('Total time ' + timeSec +', String send ' + jobj);
        if (jobj.length <= 600000) { //600k
          this.sock.send(jobj);
          this.sock.onerror = function(error) {
          }
        } else {
          this.jsnMsgQueue = this.chunkSubstr(jobj, 550000); // 550k
          if (this.jsnMsgQueue) {
            for (var i=0; i<this.jsnMsgQueue.length; i++) {
              this.sock.send(this.jsnMsgQueue[i]);
            }
          }
          this.jsnMsgQueue = [];
        }
    },
    chunkSubstr: function(str, size) {
      if (str.startsWith('F-BR-{"0')) {
        var prefix = 'F-BR-{"';
        str = str.replace('F-BR-{"0','');
      } else if (str.startsWith('F-BRU-{"')) {
        var prefix = str.substring(0, 22);
        str = str.substring(23, str.length);
      } else {
        return false;
      }
      const numChunks = Math.ceil(str.length / size)
      const chunks = new Array(numChunks)
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
        if (i == 0) {
          chunks[i] = prefix + '1' + chunks[i];
        } else if (i < numChunks-1) {
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
      } else if (str.startsWith('{"0{"')){
        str = str.replace('{"0{"','{"');
        return str;
      }
      if (str.startsWith('{"1{"')){
        this.recjsnMsgQueue = str.replace('{"1{"','{"');
      } else if (str.startsWith('{"2')){
          if (this.recjsnMsgQueue.length > 0){
              this.recjsnMsgQueue = this.recjsnMsgQueue + str.replace('{"2','');
          }
      } else if (str.startsWith('{"3')) {
          if (this.recjsnMsgQueue.length > 0){
              this.recjsnMsgQueue = this.recjsnMsgQueue + str.replace('{"3','');
              return this.recjsnMsgQueue;
          }
      } else {
        this.recjsnMsgQueue = '';
        return false;
      }
      return false;
    },
    sendBinary: function(msg) {
        "use strict";
        var type = null;
        if (this.webSocketConnected() && msg.length) {
          if (msg.length <= 600000) { // Less than 600K
            if (msg.constructor === Int8Array) {
              var msg1 = new Int8Array(msg.length + 2);
            } else if (msg.constructor === Uint8ClampedArray) {
              var msg1 = new Uint8ClampedArray(msg.length + 2);
            }
            msg1.set([msg[0], 0]);
            msg1.set(msg, 2);
            this.sock.send(msg1.buffer);
            ioStorage.dataBinaryStore(msg1);
          } else {
            this.binMsgQueue = [];
            const len = 550000; // 550k
            for (let i=0, c=0; i<msg.length;c++){
              const chunk = msg.slice(i, i + len);
              if (msg.constructor === Int8Array) {
                this.binMsgQueue[c] = new Int8Array(chunk.length + 2);
              } else if (msg.constructor === Uint8ClampedArray) {
                this.binMsgQueue[c] = new Uint8ClampedArray(chunk.length + 2);
              }
              this.binMsgQueue[c].set([msg[0], 2]); // Continue
              this.binMsgQueue[c].set(chunk, 2);
              if (chunk.length) {
                i += chunk.length;
              }
            }
            this.binMsgQueue[0][1]=1; // Start
            this.binMsgQueue[this.binMsgQueue.length-1][1]=3; // End
            for (let i=0; i<this.binMsgQueue.length; i++) {
              this.sock.send(this.binMsgQueue[i].buffer);
              ioStorage.dataBinaryStore(this.binMsgQueue[i]);
            }
            this.binMsgQueue = [];
          }
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
            var data_pack = new Uint8Array(e.data);
            if (data_pack[1] == 0) { // All OK

              data_pack = data_pack.subarray(2);
              var msg = (data_pack[0] == 101) ? new Int8Array(data_pack) : new Uint8ClampedArray(data_pack);
              ioStorage.dataBinaryStore(msg);
              $.event.trigger({
                  type: "binrec",
                  message: msg.buffer
              });

            } else if (data_pack[1] == 1) { // Start of packet
              this.recBinMsgQueue = [];
              this.recBinMsgQueue[0]=data_pack.subarray(2);
            } else if (data_pack[1] == 2) { // Continue packet
              if (this.recBinMsgQueue.length > 0) {
                this.recBinMsgQueue.push(data_pack.subarray(2));
              }
            } else if (data_pack[1] == 3) { // End packet
              if (this.recBinMsgQueue.length > 0) {
                this.recBinMsgQueue.push(data_pack.subarray(2));
                var totalsize=0;
                for (var i=0; i<this.recBinMsgQueue.length; i++) {
                  totalsize = totalsize + this.recBinMsgQueue[i].length;
                }
                var msg = (data_pack[0] == 101) ? new Int8Array(totalsize) : new Uint8ClampedArray(totalsize);
                for (var i=0,s=0; i<this.recBinMsgQueue.length; i++) {
                  msg.set(this.recBinMsgQueue[i], s);
                  s = s + this.recBinMsgQueue[i].length;
                }
                ioStorage.dataBinaryStore(msg);
                $.event.trigger({
                    type: "binrec",
                    message: msg.buffer
                });

              }
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

    // Check if websocket is ready to send
    webSocketConnected: function (){
        return (io.sock && io.sock.readyState == 1 && this.readyToSend == true);
    },

    onRecJson: function(receivemsg) {
        if (io.globallock === false ) {
            if (io.globalmsgjson.length > 0) {
                while (io.globalmsgjson.length > 0 && io.globallock === false){
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

    onRecJsonIndividual: function(receivemsg) {
        var userto = '';
        switch (receivemsg.type) {
            case "joinroom":
                console.log("New user join room " + receivemsg.users);
                this.readyToSend = true;
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
                var msg = {
                    type: "member_added",
                    newuser: newuser,
                    joinUser : receivemsg.action
                }

                if(receivemsg.hasOwnProperty('users')){
                    msg.message = receivemsg.users;
                    msg.users = true;

                }else if(receivemsg.hasOwnProperty('user')){
                    msg.message = receivemsg.user;
                    msg.user = true;
                }

                $.event.trigger(msg);
                break;
            case "broadcastToAll":
            case "broadcast":
                //return;
                //   console.log('broad cast');
                if (receivemsg !== null) {
                    if (receivemsg.userto != undefined) {
                        userto = receivemsg.userto;
                    }
                    $.event.trigger({
                        type: "newmessage",
                        message: receivemsg.m,
                        fromUser: receivemsg.user,
                        //   toUser: userto
                        toUser:  virtualclass.vutil.getUserAllInfo(userto, virtualclass.connectedUsers)
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
                    // toUser: userto
                    toUser : virtualclass.vutil.getUserAllInfo(userto, virtualclass.connectedUsers)
                });
                break;
            case "leftroom":
                console.log('Case:- leftroom');
                $.event.trigger({
                    type: "member_removed",
                    message: receivemsg.user
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
            case "PONG":
                // console.log('Case:- PONG');
                $.event.trigger({
                    type: "PONG",
                    message: receivemsg.m
                });
                break;

            case "Text_Limit_Exeed":
                // console.log('Case:- PONG');
                $.event.trigger({
                    type: "Text_Limit_Exeed"
                });
                break;

            case "Binary_Limit_Exeed":
                // console.log('Case:- PONG');
                $.event.trigger({
                    type: "Binary_Limit_Exeed"
                });
                break;

            case "Max_rooms":
                // console.log('Case:- PONG');
                $.event.trigger({
                    type: "Max_rooms"
                });
                break;

            case "Max_users":
                // console.log('Case:- PONG');
                $.event.trigger({
                    type: "Max_rooms"
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
