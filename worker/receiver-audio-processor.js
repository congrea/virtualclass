/**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This worklet is responsible to play the received Audio
 */

class ReceiverAudioProcessor extends AudioWorkletProcessor {
	constructor() {
        super();
        this.audioToBePlay = [];
        this.allAudioArr = [];
        this.ac = 0;
        var that = this;

		this.port.onmessage = (msg) => {
            var audio = msg.data.audio;
            that.queue(audio);
        }
    }

    /**
     * Making single Queue Audio
     */
    queue (samples) {
        for(var i=0; i<samples.length; i++){
            this.allAudioArr.push(samples[i]);
        }

        /* Picking up an audio chunk and giving
		 * to Audio Queue, to handle 44.1khz and 48khz
		 */
        while (this.allAudioArr.length >= 128) {
            var arrChunk = this.allAudioArr.splice(0, 128);
            this.audioToBePlay.push(new Float32Array(arrChunk));
            this.ac++;
        }
	}

    /**
     * Remove audios from queue if it's long
     * @returns {*} the audio packet with length of 128
     */
    getAudioChunks () {
		if(this.audioToBePlay.length == 0){
			this.ac = 0;
		}
		if (this.audioToBePlay.length >= (13 * 128)) { // 5 seconds
			while (this.audioToBePlay.length >= (5 * 128)) { // 2 seconds
                this.audioToBePlay.shift();
			}
			return this.audioToBePlay.shift();
		} else if(this.ac >= 2 * 128) { // .7 second
			return this.audioToBePlay.shift();
		}
	}

    /**
     * Once the Audio node is connected to the Audio Context,
     * the following method is triggered continuously
     */
    process(inputs, outputs) {
        let input = this.getAudioChunks();
        if(typeof input != 'undefined'){
            let output =  outputs[0][0];
            for (let i = 0; i < output.length; ++i) {
                output[i] = (input[i]);
            }
		}
		return true;
    }
}

registerProcessor('receiver-audio-processor', ReceiverAudioProcessor);
