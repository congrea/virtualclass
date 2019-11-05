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
  recordingSet: false,
  init(cfg) {
    this.cfg = cfg;
    'use strict';
    // console.log('==== io init ');
    ioInit.sendToWorker({ cmd: 'init', msg: cfg });
  },

  send(msg, cfun, touser) {
    if (Object.prototype.hasOwnProperty.call(msg, 'm')) {
      if (msg.m.user === 'all') {
        alert('som packet are sending');
      }
    }
    const obj = {
      cfun,
      arg: { msg },
    };

    if (touser) {
      obj.arg.touser = touser;
    }

    let jobj;

    if (this.webSocketConnected()) { // If Socket is ready
      if (io.packetQueue.length > 0) {
        for (let i = 0; i < io.packetQueue.length; i++) {
          const tmp_jobj = JSON.parse(io.packetQueue[i]);
          this.realSend(tmp_jobj);
        }
        io.packetQueue.length = 0;
      }
      // Now send requested msg
      this.realSend(obj);
    } else { // Save msg in queue
      // console.log('SOCKET is not ready.');
      const jobj = JSON.stringify(obj);
      io.packetQueue.push(jobj);
    }
  },

  realSend(obj) {
    if (typeof obj.arg.touser !== 'undefined') {
      if (io.uniquesids == null) {
        // console.log('uniqueid is null');
      } else {
        obj.arg.touser = io.uniquesids[obj.arg.touser];
        if (typeof obj.arg.touser === 'undefined') {
          // console.log(`User is not connected.${obj.arg.touser}`);
          return;
        }
      }
    }

    // earlier the below information sent by server
    // var userObj = { name : wbUser.name, lname : wbUser.lname, role:wbUser.role, userid : wbUser.id};
    const userObj = { userid: wbUser.id };
    let jobj;
    let sobj;
    switch (obj.cfun) {
      case 'broadcastToAll':
        if (typeof obj.arg.touser === 'undefined') {
          sobj = {
            // type: 'broadcastToAll',
            user: userObj,
            m: obj.arg.msg,
          };
          if (Object.prototype.hasOwnProperty.call(obj.arg.msg, 'serial')) {
            ioStorage.storeCacheAllData(sobj, [virtualclass.gObj.uid, obj.arg.msg.serial]);
          }
          jobj = `F-BR-{"0${JSON.stringify(sobj)}`;
        } else {
          sobj = {
            // type: 'broadcastToAll',
            // user: virtualclass.gObj.uid,
            user: userObj,
            m: obj.arg.msg,
            userto: obj.arg.touser,
          };
          let { touser } = obj.arg;
          while (touser.length < 12) {
            touser = `0${touser}`;
          }
          if (Object.prototype.hasOwnProperty.call(obj.arg.msg, 'userSerial')) {
            ioStorage.storeCacheOutData(sobj, [obj.arg.touser, obj.arg.msg.userSerial]);
          }
          jobj = `F-BRU-{"${touser}{"0${JSON.stringify(sobj)}`;
        }
        break;
      case 'ping':
        sobj = {
          type: 'PONG',
          m: obj.arg.msg,
        };
        jobj = `F-PI-${JSON.stringify(sobj)}`;
        break;

      case 'speed':
        jobj = `F-SPE-{"${obj.arg.msg}`;
        break;

      case 'session':
        jobj = `F-SS-{"${obj.arg.msg}`;
        break;

      case 'recording':
        jobj = `F-SR-{"${obj.arg.msg}`;
        break;

      default:
        jobj = JSON.stringify(obj);
    }

    // console.log('Total time ' + timeSec +', String send ' + jobj);
    if (jobj.length <= 600000) { // 600k
      // this.sock.send(jobj);
      workerIO.postMessage({ cmd: 'send', msg: jobj });

      // this.sock.onerror = function(error) {}
    } else {
      this.jsnMsgQueue = this.chunkSubstr(jobj, 550000); // 550k
      if (this.jsnMsgQueue) {
        for (let i = 0; i < this.jsnMsgQueue.length; i++) {
          // this.sock.send(this.jsnMsgQueue[i]);
          workerIO.postMessage({ cmd: 'send', msg: this.jsnMsgQueue[i] });
        }
      }
      this.jsnMsgQueue = [];
    }
  },

  chunkSubstr(str, size) {
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
      chunks[i] = str.substr(o, size);
      if (i === 0) {
        chunks[i] = `${prefix}1${chunks[i]}`;
      } else if (i < numChunks - 1) {
        chunks[i] = `${prefix}2${chunks[i]}`;
      } else {
        chunks[i] = `${prefix}3${chunks[i]}`;
      }
    }
    return chunks;
  },

  cleanRecJson(str) {
    if (!str.startsWith('{"0{"') && !str.startsWith('{"1{"') && !str.startsWith('{"2') && !str.startsWith('{"3')) {
      return str;
    } if (str.startsWith('{"0{"')) {
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

  sendBinary(msg) {
    workerIO.postMessage({ cmd: 'sendBinary', msg });
  },

  onRecMessage(e) {
    if (e.data instanceof ArrayBuffer) {
      // this.onRecBinary(e)
      workerIO.postMessage({ cmd: 'onRecBinary', msg: e.data });
    } else {
      // console.log("==== ElapsedTime playtime REC : ", e.data);
      ioInit.onmessage({ data: { cmd: 'receivedJson', msg: e.data } });

      // var msg = JSON.parse(e.data);
      // this.onRecSave(msg, e.data);
      // io.onRecJson(msg, e.data);
    }
  },

  // Check if websocket is ready to send
  webSocketConnected() {
    // Handle Set Session for teacher
    if (roles.hasControls()) {
      if (!io.sessionSet) {
        return false;
      }
    }

    // Handle recording for everyone if enabled
    if (virtualclass.settings.recording.enableRecording) {
      if (!io.recordingSet) {
        return false;
      }
    }

    // Check if application ready
    if (!io.readyToSend) {
      return false;
    }

    // Check Socket Ready
    return io.stockReadyState;
  },

  onRecJson(receivemsg) {
    // console.log("====> re-play ", JSON.stringify(receivemsg));
    if (io.globallock === false) {
      if (io.globalmsgjson.length > 0) {
        while (io.globalmsgjson.length > 0 && io.globallock === false) {
          const recmsg = io.globalmsgjson.shift();
          io.onRecJsonIndividual(recmsg);
        }
      } else if (receivemsg != null && io.globallock === false && io.globalmsgjson.length === 0) {
        io.onRecJsonIndividual(receivemsg);
      } else if (receivemsg != null) {
        io.globalmsgjson.push(receivemsg);
      }
    } else if (receivemsg != null) {
      io.globalmsgjson.push(receivemsg);
    }
  },

  onRecJsonIndividual(receivemsg) {
    let userto = '';
    switch (receivemsg.type) {
      case 'joinroom':
        if (Object.prototype.hasOwnProperty.call(receivemsg, 'users')) { // When self web socket is connected
          ioAdapter.setRecording();
          // console.log('==== Member add, join room');
        } else {
          // console.log('No users');
        }

        io.readyToSend = true;

        /* identifying new user from list */
        var newuser = null;
        if (io.uniquesids != null) {
          for (const i in receivemsg.clientids) {
            if (io.uniquesids[i] == null) {
              newuser = i;
            }
          }
        }

        io.uniquesids = receivemsg.clientids;
        // update users
        var msg = {
          type: 'member_added',
          newuser,
          joinUser: receivemsg.action,
        };

        if (Object.prototype.hasOwnProperty.call(receivemsg, 'users')) {
          msg.message = receivemsg.users;
          msg.users = true;
        } else if (Object.prototype.hasOwnProperty.call(receivemsg, 'user')) {
          msg.message = receivemsg.user;
          msg.user = true;
        }


        if ((!virtualclass.vutil.isPlayMode()
          || Object.prototype.hasOwnProperty.call(receivemsg, 'clientids') && !Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers') // When self joined the room
          || Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers') && !Object.prototype.hasOwnProperty.call(receivemsg, 'clientids'))) { // When other join the room
          virtualclass.ioEventApi.readyto_member_add(msg);
        }
        break;
      case 'broadcastToAll':
      case 'broadcast':
        if (receivemsg !== null) {
          if (receivemsg.userto != null) {
            userto = receivemsg.userto;
          }

          virtualclass.ioEventApi.newmessage({
            type: 'newmessage',
            message: receivemsg.m,
            fromUser: receivemsg.user,
            // toUser is user on which the action to be performed
            toUser: virtualclass.vutil.getUserAllInfo(userto, virtualclass.connectedUsers),
          });
        }
        break;
      case 'userleft':

        if (receivemsg.userto != null) {
          userto = receivemsg.userto;
        }
        if (io.uniquesids != null) {
          for (const uid in receivemsg.action) {
            // console.log(`===== JOIN user left call ${uid}`);
            delete io.uniquesids[uid];
          }
        }

        virtualclass.ioEventApi.readyto_user_logout(receivemsg);
        break;
      case 'Unauthenticated':
        // console.log('Case:- unauthenticated');
        virtualclass.ioEventApi.authentication_failed({
          type: 'authentication_failed',
          message: 'Authentication failed',
        });
        break;
      case 'Multiple_login':
        // console.log('Case:- Multiple_login');
        virtualclass.ioEventApi.Multiple_login({
          type: 'Multiple_login',
        });
        break;
      case 'PONG':
        // console.log('Case:- PONG');
        virtualclass.ioEventApi.PONG({
          type: 'PONG',
          message: receivemsg.m,
        });
        break;

      case 'Text_Limit_Exeed':
        // console.log('Case:- PONG');
        virtualclass.ioEventApi.Text_Limit_Exeed({
          type: 'Text_Limit_Exeed',
        });
        break;

      case 'Binary_Limit_Exeed':
        // console.log('Case:- PONG');
        virtualclass.ioEventApi.Binary_Limit_Exeed({
          type: 'Binary_Limit_Exeed',
        });
        break;

      case 'Max_rooms':
        // console.log('Case:- PONG');
        virtualclass.ioEventApi.Max_rooms({
          type: 'Max_rooms',
        });
        break;

      case 'Max_users':
        // console.log('Case:- PONG');
        virtualclass.ioEventApi.Max_users({
          type: 'Max_users',
        });
        break;

      case 'setSession':
        if (roles.hasControls()) {
          ioAdapter.initSetSession(receivemsg.session);
        }
        break;
    }
  },

  disconnect() {
    workerIO.postMessage({ cmd: 'disconnect' });
  },
};

workerIO.onmessage = function (e) {
  // console.log();
  ioInit.onmessage(e);
};

var ioInit = {
  sendToWorker(msg) {
    workerIO.postMessage(msg);
  },

  async onmessage(e) {
    switch (e.data.cmd) {
      case 'connectionopen':
        io.stockReadyState = true;
        virtualclass.ioEventApi.connectionopen(e.data.msg);
        break;

      case 'receivedJson':
        var cleanJson = io.cleanRecJson(e.data.msg);
        if (cleanJson) {
          var msg = JSON.parse(cleanJson); // msg.user is from user/*
          if (!Object.prototype.hasOwnProperty.call(msg, 'type') && Object.prototype.hasOwnProperty.call(msg, 'user')) {
            // workerIO.postMessage({cmd : 'mkUser', msg:msg});

            msg.type = 'broadcastToAll';
            if (typeof virtualclass.gObj.allUserObj[msg.user.userid] === 'undefined') {
              virtualclass.gObj.allUserObj[msg.user.userid] = {};
              virtualclass.gObj.allUserObj[msg.user.userid].userid = msg.user.userid;
              virtualclass.gObj.allUserObj[msg.user.userid].lname = ' ';
              virtualclass.gObj.allUserObj[msg.user.userid].name = 'student';
              virtualclass.gObj.allUserObj[msg.user.userid].role = 's';
            }

            if (virtualclass.gObj.allUserObj[msg.user.userid].userid === msg.user.userid) {
              msg.user.lname = virtualclass.gObj.allUserObj[msg.user.userid].lname;
              msg.user.name = virtualclass.gObj.allUserObj[msg.user.userid].name;
              msg.user.role = virtualclass.gObj.allUserObj[msg.user.userid].role;
            }
          }
          this.recjsnMsgQueue = '';

          if (Object.prototype.hasOwnProperty.call(msg, 'm')) {
            if (Object.prototype.hasOwnProperty.call(msg.m, 'serial')) {
              await ioMissingPackets.checkMissing(msg);
            } else if (Object.prototype.hasOwnProperty.call(msg.m, 'reqMissPac')) {
              // there is bing upload the content then we will not send miss packet
              if (!Object.prototype.hasOwnProperty.call(virtualclass.recorder, 'startUpload')) {
                ioMissingPackets.sendMissedPackets(msg);
              }
            } else if (Object.prototype.hasOwnProperty.call(msg.m, 'missedpackets')) {
              // console.log('Execute missed packets');
              ioMissingPackets.fillExecutedStore(msg);
            } else if (Object.prototype.hasOwnProperty.call(msg.m, 'userSerial')) {
              ioMissingPackets.userCheckMissing(msg);
            } else if (Object.prototype.hasOwnProperty.call(msg.m, 'userReqMissPac')) {
              // there is bing upload the content then we will not send miss packet
              if (!Object.prototype.hasOwnProperty.call(virtualclass.recorder, 'startUpload')) {
                ioMissingPackets.userSendMissedPackets(msg);
              }
            } else if (Object.prototype.hasOwnProperty.call(msg.m, 'userMissedpackets')) {
              ioMissingPackets.userFillExecutedStore(msg);
            } else {
              // return; // for temporary
              // workerIO.postMessage({cmd : "saveJson", msg :  {msg:msg, cj : cleanJson}});

              io.onRecJson(msg);
            }
          } else {
            // return; // for temporary
            io.onRecJson(msg);
            //  workerIO.postMessage({cmd : "saveJson", msg : {msg:msg, cj : cleanJson}});
          }
        }

        break;

      case 'onRecBinary':
        io.onRecBinary(e);
        break;

      case 'iamclosing':
        io.stockReadyState = false;
        io.sessionSet = false;
        io.recordingSet = false;
        break;

      case 'error':
        io.stockReadyState = false;
        io.sessionSet = false;
        io.recordingSet = false;
        virtualclass.ioEventApi.error({
          type: 'error',
          message: e.data.msg,
        });
        break;

      case 'close':
        io.stockReadyState = false;
        io.sessionSet = false;
        io.recordingSet = false;
        virtualclass.ioEventApi.connectionclose({
          type: 'connectionclose',
          message: e.data.msg,
        });
        // TODO Do we need this?
        setTimeout(() => {
          // For prevent to send any packet to other during save session
          // and download session
          if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'endSession')
            && !Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'downloadProgress')
            && !virtualclass.recorder.uploadInProcess
            && !(Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'invalidlogin') && virtualclass.gObj.invalidlogin)) {
            // scope.wsconnect();
            workerIO.postMessage({ cmd: 'wsconnect' });
          }
        }, 5000);
        break;
      case 'initAudioWorklet':
        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'isAudioContextReady') && !virtualclass.gObj.audioRecWorkerReady) {
          if (virtualclass.media.detectAudioWorklet()) {
            virtualclass.media.audio.initPlay();
          } else {
            virtualclass.media.audio.initPlayWithFallback();
          }
        }

        break;

      case 'stBinary': // storage binary
        if (Object.prototype.hasOwnProperty.call(e.data, 'triggerBinRec')) {
          virtualclass.ioEventApi.binrec({
            type: 'binrec',
            message: e.data.msg.buffer,
          });
        }
        break;

      case 'notaudio': // storage binary
        virtualclass.ioEventApi.binrec({
          type: 'binrec',
          message: e.data.msg,
        });
        break;

      case 'endBinary': // storage binary
        var { msg } = e.data;
        if (msg.constructor === Int8Array) {
          var msg1 = new Int8Array(msg.length + 2);
        } else if (msg.constructor === Uint8ClampedArray) {
          var msg1 = new Uint8ClampedArray(msg.length + 2);
        }
        /** Appending the data for recording * */
        msg1[0] = msg[0];
        msg1[1] = 0;
        msg1.set(msg, 2);
        virtualclass.ioEventApi.binrec({
          type: 'binrec',
          message: msg.buffer,
        });
        break;

      case 'firstAudio': // audio received first time
        var user = virtualclass.user.control.updateUser(e.data.msg.userId, 'ad', true);// creates user object, that is stored in local storage and return the object
        virtualclass.user.control.audioSign(user, 'create');
        break;

      case 'audioSign': // audio received first time
        virtualclass.user.control.audioSign(user, 'create');
        break;


      default:
      // console.log('Do nothing');
    }
  },
};
