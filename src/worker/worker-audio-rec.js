/**
 *@copyright  2018 Suman Bogati  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * This file receives the audio from workerio and
 * decode the audio and send this to reciever audio worklert(worklet-audio-rec.js)
 */
const workerAudioRecBlob = URL.createObjectURL(new Blob(['(', function () {
  importScripts('https://cdn.congrea.net/build/src/audio-g711-and-resampler.min.js');

  const workerAudioRec = {
    workletAudioRec: null,
    workerIO: null,
    samples: null,
    allAudioArr: {},
    audioToBePlay: {},
    gAudio: {},
    adSign: {},
    resamplerdecode: {},
    mergeAllAudioSend: [],
    allAudioSend: [],
    supportAudioWorklet: false,
    sampleRate: null,

    extractData(msg) {
      const data_pack = new Int8Array(msg);
      const uid = this.numValidateFour(data_pack[1], data_pack[2], data_pack[3], data_pack[4]);
      return [uid, data_pack.subarray(5, data_pack.length)];
    },

    numValidateFour(n1, n2, n3, n4) {
      n1 = this.preNumValidateTwo(n1);
      n2 = this.preNumValidateTwo(n2);
      n3 = this.preNumValidateTwo(n3);
      n4 = this.preNumValidateTwo(n4);
      const nres = n1 + n2 + n3 + n4;
      return parseInt(nres);
    },

    numValidateTwo(n1, n2) {
      n1 = this.preNumValidateTwo(n1);
      n2 = this.preNumValidateTwo(n2);
      const nres = n1 + n2;
      return parseInt(nres);
    },

    preNumValidateTwo(n) {
      const numstring = n.toString();
      if (numstring.length == 1) {
        return `0${numstring}`;
      } if (numstring.length == 2) {
        return numstring;
      }
    },

    resample(packets, uid) {
      if (!Object.prototype.hasOwnProperty.call(this.audioToBePlay, uid)) {
        this.audioToBePlay[uid] = [];
      }

      this.samples = G711.decode(packets, {
        floating_point: true,
        Eight: true,
      });

      if (typeof this.resamplerdecode[uid] !== 'object') {
        this.resamplerdecode[uid] = new Resampler(8000, this.sampleRate, 1, 32768);
      }

      this.samples = this.resamplerdecode[uid].resampler(this.samples);

      return this.samples;
    },

    onMessage(e) {
      if (Object.prototype.hasOwnProperty.call(e.data, 'cmd')) {
        switch (e.data.cmd) {
          case 'workerIO':
            this.workerIO = e.ports[0];
            this.sampleRate = e.data.sampleRate;
            this.workerIO.onmessage = this.fromworkerIO.bind(this);
            break;

          case 'workletAudioRec':
            this.workletAudioRec = e.ports[0];
            this.workletAudioRec.onmessage = this.fromworkletAudioRec.bind(this);
            break;

          case 'audioWorklet':
            this.supportAudioWorklet = e.data.msg;
            break;
          default:
            // console.log('do nothing');
        }
      }
    },

    fromworkletAudioRec() {
      // console.log('from audio worklet');
    },

    fromworkerIO(e) {
      if (Object.prototype.hasOwnProperty.call(e.data, 'msg')) {
        const { msg } = e.data;
        const dataArr = this.extractData(msg);// extract data and user id from the message received
        const uid = dataArr[0];

        if (!Object.prototype.hasOwnProperty.call(this.adSign, uid)) {
          this.adSign[uid] = {};
          this.adSign[uid].ad = true;
          this.workerIO.postMessage({ cmd: 'firstAudio', msg: { userId: uid }, dest: 'mainthread' });
        }

        const packet = this.resample(dataArr[1], uid); // dataArr[1] is audio

        if (this.supportAudioWorklet) {
          this.workletAudioRec.postMessage({ cmd: 'audio', msg: { data: packet, uid } });
        } else {
          postMessage({ cmd: 'noAudioWorklet', msg: { data: packet, uid } });
        }
      }
    },
  };

  onmessage = function (e) {
    workerAudioRec.onMessage(e);
  };
}.toString(), ')()'], { type: 'application/javascript' }));

const workerAudioRec = new Worker(workerAudioRecBlob);
