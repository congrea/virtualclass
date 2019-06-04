/***
 * @copyright  2018 Suman Bogati  {@link http://vidyamantra.com}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * This file(Audio worklet) plays the received Audio from received audio worker(worker-audio-rec.js)
 */


var workletAudioRecBlob = URL.createObjectURL(new Blob(['(', function (){
    var audioToBePlay = {};
    var aChunksPlay = {};
    var lastAudioTone = 0;
    var allAudioArr = {};
    var luid;
    var workerAudioRec;
    var allAudioSend = [];
    var audioLen=0;

    function initRecWorkerAud (msg) {
        if(msg.data.hasOwnProperty('cmd') && msg.data.cmd === 'workerAudioRec'){
            workerAudioRec = msg.ports[0];
            workerAudioRec.onmessage = fromWorkerAudioRec;
        }
    }

    function fromWorkerAudioRec (e) {
        if(e.data.hasOwnProperty('cmd') && e.data.cmd  === 'audio'){
            queue(e.data.msg.data, e.data.msg.uid);
        }
    }

    /**
     * Remove audios from queue if it's long
     * @returns {*} the audio packet with length of 128
     */
    function getAudioChunks (uid) {
        if(audioToBePlay !== null){
            if (audioToBePlay[uid].length >= 288) { // 835.918371 ms
                while (audioToBePlay[uid].length >= 96) { // 278.639457 ms
                    audioToBePlay[uid].shift();
                }
                aChunksPlay[uid] = true;
                return audioToBePlay[uid].shift();
            } else if(audioToBePlay[uid].length >= 64) { // 185.759638 ms
                aChunksPlay[uid] = true;
                return audioToBePlay[uid].shift();
            } else if (audioToBePlay[uid].length > 0 && aChunksPlay[uid] === true) {
                aChunksPlay[uid] = true;
                return audioToBePlay[uid].shift();
            } else {
                aChunksPlay[uid] = false;
                if (audioToBePlay[uid].length === 0) {
                    delete audioToBePlay[uid];
                }
            }
        }
    }

    /** Return Merged audio which received from different sources **/
    function getMergedAudio () {
        // allAudioSend = [];
        allAudioSend.length = 0;
        audioLen=0;
        for(luid in audioToBePlay){
            let temp = getAudioChunks(luid);
            if (temp != null) {
                audioLen++;
                if (audioLen === 1) {
                    // allAudioSend = temp;
                    for (let z = 0; z < 128; z++) {
                        allAudioSend[z] = temp[z];
                    }
                } else {
                    for (let z = 0; z < 128; z++) {
                        allAudioSend[z] = allAudioSend[z] + temp[z];
                    }
                }
            }
        }

        if (audioLen === 1) {
            return allAudioSend;
        } else if (audioLen > 1) {
            for (let z = 0; z < 128; z++) {
                allAudioSend[z] = allAudioSend[z]/audioLen;
            }
            return allAudioSend;
        }
    }

    /**
     * Making individual audio Queue with packets of length 128
     */
    function queue (packets, uid) {
        if(audioToBePlay[uid] == null){
            audioToBePlay[uid] = [];
        }

        if(allAudioArr[uid] == null){
            allAudioArr[uid] = [];
        }

        for(let i=0; i<packets.length; i++){
            allAudioArr[uid].push(packets[i]);
        }

        while (allAudioArr[uid].length >= 128) {
            let arrChunk =  allAudioArr[uid].splice(0, 128);
            audioToBePlay[uid].push(new Float32Array(arrChunk));
        }
    }

    function workerAudioRecMsg (data){
        console.log('data received from audio ready');
    }


    class workletAudioRec extends AudioWorkletProcessor {
        constructor() {
            super();
            this.port.onmessage = initRecWorkerAud;
        }

        /**
         * Once the Audio node is connected to the Audio Context,
         * the following method is triggered continuously
         */
        process(inputs, outputs) {
            let input = getMergedAudio();
            if(input != null){
                outputs[0][0].set(input, 0);
                lastAudioTone = input[127];
            } else {
                // Avoid tick sound
                if(lastAudioTone !== null){
                    for (let i = 0; i < 128; i++) {
                        outputs[0][0][i] = lastAudioTone;
                    }
                }
            }
            return true;
        }
    }
    registerProcessor('worklet-audio-rec', workletAudioRec);
}.toString(), ')()'], {type: 'application/javascript'}));