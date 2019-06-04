/***
 * @copyright  2018 Suman Bogati  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * This file recevied the audio from audio worker send (worker-audio-send),
 * encode the audio and send it to io worker(worker-io.js)
 */
var workerAudioSendBlob = URL.createObjectURL(new Blob(['(', function (){
    importScripts('https://live.congrea.net/virtualclass/build/src/audio-g711-and-resampler.min.js');
    var workerAudioSend = {
        audioWorkletSend : null,
        workerIO : null,
        gObjUid : null,
        audMouseDown : false,
        precheck : false,
        repMode : false,
        minthreshold : 65535,
        audioWasSent : 0,
        preAvg : 0,
        curAvg : 0,
        maxthreshold : 0,

        convertFloat32ToInt16 (buffer) {
            var l = buffer.length;
            var buf = new Int16Array(l);
            while (l--) {
                buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
            }
            return buf;
        },

        encodeAudio (leftSix) {
            var encoded = G711.encode(leftSix, {
                alaw: true
            });
            return encoded;
        },

        breakintobytes (val, l) {
            var numstring = val.toString();
            for (var i = numstring.length; i < l; i++) {
                numstring = '0' + numstring;
            }
            var parts = numstring.match(/[\S]{1,2}/g) || [];
            return parts;
        },

        sendBinary (msg) {
            "use strict";
            if(this.workerIO != null){
                this.workerIO.postMessage({'cmd' : "sendBinary", msg : msg});
            }
        },

        audioSend (msg, adStatus) {
            if (this.audMouseDown && !this.precheck) {
                var uid = this.breakintobytes(this.gObjUid, 8);
                var scode = new Int8Array([101, uid[0], uid[1], uid[2], uid[3]]); // Status Code Audio
                var sendmsg = new Int8Array(msg.length + scode.length);
                sendmsg.set(scode);
                sendmsg.set(msg, scode.length); // First element is status code (101)
                this.sendBinary(sendmsg);
                postMessage({cmd : 'adStatus', msg : adStatus});
            } else {
                postMessage({cmd : 'adStatus', msg : 'stop'});
            }
        },

        silenceDetection (send, leftSix) {
            var audStatus, a;
            var vol = sum = rate = 0;



            for (i = 0; i < leftSix.length; i++) {
                a = Math.abs(leftSix[i]); // a should not be declared here
                if (vol < a) {
                    vol = a;
                } // Vol is maximum volume in signal packet
                sum = sum + a;
            }

            this.curAvg = sum / leftSix.length;
            rate = Math.abs(this.curAvg ^ 2 - this.preAvg ^ 2);
            this.preAvg = this.curAvg;

            if (rate < 5) {
                this.minthreshold = vol;
            } // If rate is close to zero, it is likely to be noise.
            if (this.minthreshold > vol) {
                this.minthreshold = vol;
            } // Minimum volume in historical signal
            if (this.maxthreshold < vol) {
                this.maxthreshold = vol;
            } // Maximum volume in historical signal
            if (this.minthreshold * 20 < this.maxthreshold) {
                this.minthreshold = this.minthreshold * 5;
            } // In case minimum sound (silance) is too low compared to speaking sound.
            if (this.maxthreshold / 20 > this.minthreshold) {
                this.maxthreshold = this.maxthreshold / 5;
            } // In case Max volume (speaking sound) is too high compared with silance.
            if (thdiff > 10) {
                this.maxthreshold = this.maxthreshold*0.8;
            } // Keep algo sensitive
            var thdiff = this.maxthreshold / this.minthreshold;
            var th = vol / this.minthreshold;
            audStatus = "sending";


            if (vol !== 0) {
                postMessage({cmd : 'unMuteAudio'});
            }
            // thediff is infinity when 1/0
            if (isFinite(thdiff)  && thdiff >= 20 || // historical max minus min
                th > 2 || // Difference between current volume and minimum
                rate > this.minthreshold || rate > 25 || // Change in signal strength
                vol > (this.minthreshold * 2) || // Current max volume
                thdiff <= 4 ) { // We are not ready for this algo
                this.audioSend(send, audStatus);
                this.audioWasSent = 6;
                // console.log('SEND Current '+vol+' Min '+this.minthreshold+' Max '+this.maxthreshold+' rate '+rate+' thdiff '+thdiff+' th '+th);
            } else if (this.audioWasSent > 0) {
                this.audioSend(send, audStatus);  // Continue sending Audio for next X samples
                this.audioWasSent--;
            } else if (thdiff < 2) { // We are not ready, send all samples
                this.audioSend(send, audStatus);
            } else {
                postMessage({cmd : 'adStatus', msg : 'notSending'});
                postMessage({cmd : 'ioAdapterSend', msg : {cf:'na'}});
                if (vol === 0) {
                    postMessage({cmd: 'muteAudio'});
                }
            }

            return send;
        },

        recorderProcess (left) {
            if (!this.repMode && this.audMouseDown && !this.precheck)  {
                // var left = e.inputBuffer.getChannelData(0);
                var samples = this.resampler.resampler(left);
                var leftSix = this.convertFloat32ToInt16(samples);
                var send = this.encodeAudio(leftSix);
                this.silenceDetection(send, leftSix);
            }
        },

        onMessage (e){
            switch(e.data.cmd) {
                case 'workerIO':
                    this.workerIO = e.ports[0];
                    // fromworkerIO from worker io
                    this.resampler = new Resampler(e.data.sampleRate, 8000, 1, 4096),
                        this.workerIO.onmessage = function (e){
                            console.log("From io lib");
                        };
                    this.gObjUid = e.data.uid;
                    break;

                case 'audioWorkletSend':
                    this.audioWorkletSend = e.ports[0];
                    this.repMode = e.data.msg.repMode;
                    // formAudioWorkletSend from Audio worklet send
                    var that = this;
                    this.audioWorkletSend.onmessage = this.formAudioWorkletSend.bind(this);
                    break;

                case 'audioMouseDown':
                    this.audMouseDown = e.data.msg.adMouseDown;
                    break;

                case 'precheck':
                    this.precheck = e.data.msg.precheck;
                    break;

                case 'rawAudio':
                    this.recorderProcess(e.data.msg);
                    break;

                // Send the message to receiver
                default:
                    console.log('Do nothing');
            };
        },

        formAudioWorkletSend (e) {
            if(e.data.hasOwnProperty('cmd') &&  e.data.cmd == 'rawAudio'){
                this.recorderProcess(e.data.msg);
            }
        }
    }

    onmessage = function (e){
        workerAudioSend.onMessage(e);
    }

}.toString(), ')()'], {type: 'application/javascript'}));

var workerAudioSend = new Worker(workerAudioSendBlob);
