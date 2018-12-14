/**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This worklet is responsible to play the received Audio
 */

class ReceiverAudioProcessor extends AudioWorkletProcessor {
	constructor() {
        super();
        this.audioToPlay = [];
				this.aChunksPlay = false;
        this.lastAudioTone = 0;
        var that = this;

		this.port.onmessage = (msg) => {
            that.queue(msg.data.audio);
        }
    }

    /**
     * Making single Queue Audio
     */
    queue (samples) {
        while (samples.length >= 128) {
            let arrChunk =  samples.splice(0, 128);
            this.audioToPlay.push(new Float32Array(arrChunk));
        }
	}

    /**
     * Remove audios from queue if it's long
     * @returns {*} the audio packet with length of 128
     */
    getAudioChunks () {
			if (this.audioToPlay.length >= (288)) { // 835.918371 ms
		      while (this.audioToPlay.length >= (96)) { // 278.639457 ms
            this.audioToPlay.shift();
		      }
					this.aChunksPlay = true;
		      return this.audioToPlay.shift();
      } else if(this.audioToPlay.length >= 64) { // 185.759638 ms
					this.aChunksPlay = true;
	        return this.audioToPlay.shift();
      } else if (this.audioToPlay.length > 0 && this.aChunksPlay == true) {
					this.aChunksPlay = true;
          return this.audioToPlay.shift();
      } else {
          this.aChunksPlay = false;
					return null;
			}
	}

    /**
     * Once the Audio node is connected to the Audio Context,
     * the following method is triggered continuously
     */
    process(inputs, outputs) {
        var input = this.getAudioChunks();
        if(input != null){
            outputs[0][0].set(input, 0);
            this.lastAudioTone = input[127];
        } else {
            // Avoid tick sound
            for (var i = 0; i < 128; i++) {
                outputs[0][0][i] = this.lastAudioTone;
            }
        }
        return true;
    }
}

registerProcessor('receiver-audio-processor', ReceiverAudioProcessor);
