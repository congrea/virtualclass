/**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This worklet is responsible to play the received Audio
 */

class ReceiverAudioProcessor extends AudioWorkletProcessor {
	constructor() {
        super();
        this.audioToPlay = [];
        this.lastAudioTone;
        this.allAudioArr = [];
        var that = this;

		this.port.onmessage = (msg) => {
            that.queue(msg.data.audio);
        }
    }

    /**
     * Making single Queue Audio
     */
    queue (samples) {
        // Avoid tick sound
        for(let i=0; i<samples.length; i++){
            this.allAudioArr.push(samples[i]);
        }
        while (this.allAudioArr.length >= 128) {
            let arrChunk =  this.allAudioArr.splice(0, 128);
            this.audioToPlay.push(new Float32Array(arrChunk));
        }
	}

    /**
     * Remove audios from queue if it's long
     * @returns {*} the audio packet with length of 128
     */
    getAudioChunks () {
		if (this.audioToPlay.length >= (2432)) { // 7 seconds
            // if audio length is more than 7 seconds, truncate it to 3 seconds
			while (this.audioToPlay.length >= (1024)) { // 3 seconds
                this.audioToPlay.shift();
			}
			return this.audioToPlay.shift();
		} else if(this.audioToPlay.length >= 256) { // .7 second
            // Start playing once we have queue of at least 0.7 seconds
			return this.audioToPlay.shift();
		} else {
            return null;
        }
	}

    /**
     * Once the Audio node is connected to the Audio Context,
     * the following method is triggered continuously
     */
    process(inputs, outputs) {
        let input = this.getAudioChunks();
        if(input !== null){
            outputs[0][0].set(input, 0);
            this.lastAudioTone = input[127];
        } else {
            // Avoid tick sound
            for (let i = 0; i < 128; i++) {
                outputs[0][0][i] = this.lastAudioTone;
            }
        }
        return true;
    }
}

registerProcessor('receiver-audio-processor', ReceiverAudioProcessor);
