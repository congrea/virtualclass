/**
 * JavaScript core library for messaging
 * @package    iocore
 * @copyright  2018 Suman Bogati  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * This file sends/receives packet to/from  Server through websocket
 */

const workerIOBlob = URL.createObjectURL(new Blob(['(', function () {
  const workerIO = {
    workerAudioRec: false,
    workerAudioSend: false,
    binMsgQueue: [],
    recBinMsgQueue: [],
    packetQueue: [],

    init(cfg) {
      this.cfg = cfg;
      this.wsconnect();
    },

    userauthenticate() {
      const obj = { authuser: this.cfg.authuser, authpass: this.cfg.authpass };
      const jobj = `F-AH-${JSON.stringify(obj)}`;
      // this.sock.send(jobj);
      this.finallySend(jobj);
    },
    addclient() {
      const obj = { client: this.cfg.userid, roomname: this.cfg.room, user: this.cfg.userobj };
      const jobj = `F-JR-${JSON.stringify(obj)}`;
      // this.sock.send(jobj);
      this.finallySend(jobj);
    },

    wsconnect() {
      // console.log('member_added init for socket connect');
      workerIO.wsuri = this.cfg.rid;

      if (typeof WebSocket !== 'undefined') {
        // console.log(`rid ${workerIO.wsuri}`);
        this.sock = new WebSocket(workerIO.wsuri);
      } else {
        // console.log('Browser does not support WebSocket!');
        this.error = lang.wserror;
      }

      const scope = this;

      this.sock.onopen = function () {
        // console.log(`member_added Connected to ${scope.cfg.rid}`);
        scope.userauthenticate();
        // user join chat room
        scope.addclient();

        postMessage({ cmd: 'connectionopen', msg: { type: 'connectionopen' } });
      };

      this.sock.binaryType = 'arraybuffer';

      this.sock.onmessage = function (e) {
        if (e.data instanceof ArrayBuffer) {
          workerIO.onRecBinary(e);
        } else {
          postMessage({ cmd: 'receivedJson', msg: e.data });
        }
      };

      this.sock.onerror = function (e) {
        scope.error = e;
        // console.log(`Error:${e}`);
        postMessage({ cmd: 'error', msg: e.reason });
      };

      this.sock.onclose = function (e) {
        // console.log('Connection Closed');
        postMessage({ cmd: 'close', msg: e.reason });
      };
    },

    disconnect() {
      this.sock.onclose = function () {
      };
      this.sock.close();
      // console.log('i am closing this connection');
      postMessage({ cmd: 'iamclosing' });
    },

    onRecBinary(e) {
      // try {
      const scope = this;
      if (e.data instanceof ArrayBuffer) {
        let data_pack = new Uint8Array(e.data);
        if (data_pack[1] == 0) { // All OK
          // Saving in local storage required 2 packets for later play back
          const msg1 = (data_pack[2] == 101) ? new Int8Array(data_pack) : new Uint8ClampedArray(data_pack);
          postMessage({ cmd: 'stBinary', msg: msg1 });
          // ioStorage.dataBinaryStore(msg1);

          data_pack = data_pack.subarray(2);
          var msg = (data_pack[0] == 101) ? new Int8Array(data_pack) : new Uint8ClampedArray(data_pack);

          if (data_pack[0] == 101) {
            if (!this.workerAudioRec) {
              postMessage({ cmd: 'initAudioWorklet' });
              // console.log('workerAudioRec is not defined');
            } else {
              this.workerAudioRec.postMessage({ cmd: 'ad', msg: data_pack }, [data_pack.buffer]);
            }
          } else {
            // console.log('Binary data than audio need to be send to Main thread');
            postMessage({ cmd: 'notaudio', msg: msg.buffer });
          }
        } else if (data_pack[1] == 1) { // Start of packet
          this.recBinMsgQueue = [];
          this.recBinMsgQueue[0] = data_pack.subarray(2);
        } else if (data_pack[1] == 2) { // Continue packet
          if (this.recBinMsgQueue.length > 0) {
            this.recBinMsgQueue.push(data_pack.subarray(2));
          }
        } else if (data_pack[1] == 3) { // End packet
          if (this.recBinMsgQueue.length > 0) {
            this.recBinMsgQueue.push(data_pack.subarray(2));
            let totalsize = 0;
            for (var i = 0; i < this.recBinMsgQueue.length; i++) {
              totalsize += this.recBinMsgQueue[i].length;
            }

            var msg = (data_pack[0] == 101) ? new Int8Array(totalsize) : new Uint8ClampedArray(totalsize);
            for (var i = 0, s = 0; i < this.recBinMsgQueue.length; i++) {
              msg.set(this.recBinMsgQueue[i], s);
              s += this.recBinMsgQueue[i].length;
            }
            postMessage({ cmd: 'endBinary', msg });
          }
        }
      }
    },

    finallySend(msg) {
      if (this.sock.readyState) {
        this.sock.send(msg);
      }
    },

    sendBinary(msg) {
      if (this.sock.readyState && msg.length) {
        if (msg.length <= 600000) { // Less than 600K
          if (msg.constructor === Int8Array) {
            var msg1 = new Int8Array(msg.length + 2);
          } else if (msg.constructor === Uint8ClampedArray) {
            var msg1 = new Uint8ClampedArray(msg.length + 2);
          }
          msg1.set([msg[0], 0]);
          msg1.set(msg, 2);
          this.finallySend(msg1.buffer);
          postMessage({ cmd: 'stBinary', msg: msg1 });
        } else {
          this.binMsgQueue = [];
          const len = 550000; // 550k
          for (let i = 0, c = 0; i < msg.length; c++) {
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
          this.binMsgQueue[0][1] = 1; // Start
          this.binMsgQueue[this.binMsgQueue.length - 1][1] = 3; // End
          for (let i = 0; i < this.binMsgQueue.length; i++) {
            // this.sock.send(this.binMsgQueue[i].buffer);
            this.finallySend(this.binMsgQueue[i].buffer);
            postMessage({ cmd: 'stBinary', msg: this.binMsgQueue[i] });
          }
          this.binMsgQueue = [];
        }
      }
    },

    onMessage(e) {
      switch (e.data.cmd) {
        case 'init':
          this.init(e.data.msg);
          break;

        case 'wsconnect':
          this.wsconnect();
          break;

        case 'disconnect':
          this.disconnect();
          break;

        case 'sessionEndClose':
          if (this.sock) {
            this.sock.close();
          }
          break;

        case 'workerAudioRec':
          this.workerAudioRec = e.ports[0];
          // fromWorkerAudioRec; from workder audio received
          this.workerAudioRec.onmessage = function (e) {
            if (Object.prototype.hasOwnProperty.call(e.data, 'dest')) {
              if (e.data.dest == 'mainthread') {
                postMessage(e.data);
              }
            }
          };
          break;

        case 'send':
          if (this.sock.readyState) {
            if (workerIO.packetQueue.length > 0) {
              for (let i = 0; i < workerIO.packetQueue.length; i++) {
                this.finallySend(workerIO.packetQueue[i]);
              }
              workerIO.packetQueue.length = 0;
            }
            this.finallySend(e.data.msg);
          } else {
            workerIO.packetQueue.push(e.data.msg);
          }
          break;

        case 'sendBinary':
          this.sendBinary(e.data.msg);
          break;

        case 'workerAudioSend':
          this.workerAudioSend = e.ports[0];
          // fromWorkerAudioSend from worker audio send
          this.workerAudioSend.onmessage = this.fromWorkerAudioSend.bind(this);
          break;

        case 'onRecBinary':
          this.onRecBinary({ data: e.data.msg });
          break;

        default:
          this.finallySend(e.data.msg);
      }
    },

    fromWorkerAudioSend(e) {
      if (Object.prototype.hasOwnProperty.call(e.data, 'cmd')) {
        this.sendBinary(e.data.msg);
      }
    },

  };

  onmessage = function (e) {
    workerIO.onMessage(e);
  };
}.toString(), ')()'], { type: 'application/javascript' }));

const workerIO = new Worker(workerIOBlob);
