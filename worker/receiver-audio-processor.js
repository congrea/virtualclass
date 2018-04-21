/**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This worklet is responsible to play the received Audio
 */

class ReceiverAudioProcessor extends AudioWorkletProcessor {
	constructor() {
        super();
        this.audioToPlay = [];
        this.lastAudioTone;
        this.audioDelaySent = false;
        this.audioDelay = false;
        var that = this;

		this.port.onmessage = (msg) => {
            that.queue(msg.data.audio);
        }
    }

    /**
     * Making single Queue Audio
     */
    queue (samples) {
        for (let i=0, c=128; c <= samples.length; i=c, c=c+128) {
            this.audioToPlay.push(samples.slice(i, c));
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
