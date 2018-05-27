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
        this.allAudioArr = [];
				this.b0 = 0;
				this.b1 = 0;
				this.b2 = 0;
        var that = this;

		this.port.onmessage = (msg) => {
            that.queue(msg.data.audio);
        }
    }

    /**
     * Making single Queue Audio
     */
    queue (samples) {
        // Avoid tick sound and average out signal
        for(let i=0; i<samples.length; i++){
					  this.b0 = this.b1;
					  this.b1 = this.b2;
					  this.b2 = samples[i];
					  samples[i] = (this.b0 + this.b1 + this.b2) / 3; // Comment this line to turn it off
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
      if (this.audioToPlay.length >= (1152)) { // 3 seconds
          // if audio length is more than 3 seconds, truncate it to 1 second
		      while (this.audioToPlay.length >= (384)) { // 1 second
            this.audioToPlay.shift();
		      }
					this.aChunksPlay = true;
		      return this.audioToPlay.shift();
      } else if(this.audioToPlay.length >= 256) { // .7 second
          // Start playing once we have queue of at least 0.7 seconds
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
        if(input !== null){
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
