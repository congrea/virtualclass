/** *
 * @copyright  2018 Suman Bogati  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * This file gets audio continuously from getUserMedia, and
 * send it to send audio worker (worker-audio-send.js)
 */
const workletAudioSendBlob = URL.createObjectURL(new Blob(['(', function () {
  // console.log('== init audio worklet 1');
  class workletAudioSend extends AudioWorkletProcessor {
    constructor() {
      super();
      this.audios = new Float32Array(4096);
      this.position = 0;
      const that = this;
      this.port.onmessage = function (e) {
        if (Object.prototype.hasOwnProperty.call(e.data, 'cmd') && e.data.cmd == 'workerAudioSend') {
          that.workerAudioSend = e.ports[0];
          that.workerAudioSend.onmessage = that.fromworkerAudioSend;
        }
      };
    }

    fromworkerAudioSend() {
      // console.log('This is from audio sender');
    }

    /**
     * Once the GetUsermedia stream is connected to the Audio Context,
     * the following method is triggered continuously
     */
    process(inputs, outputs) {
      const input = inputs[0][0];
      this.audios.set(input, this.position);
      this.position += input.length;
      if (this.position >= 4096) {
        if (Object.prototype.hasOwnProperty.call(this, 'workerAudioSend')) {
          this.workerAudioSend.postMessage({ cmd: 'rawAudio', msg: this.audios });
        }
        this.audios = new Float32Array(4096);
        this.position = 0;
      }
      return true;
    }
  }
  registerProcessor('worklet-audio-send', workletAudioSend);
}.toString(), ')()'], { type: 'application/javascript' }));
