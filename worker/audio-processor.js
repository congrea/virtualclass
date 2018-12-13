/**@Copyright 2018  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
    The audio worklet is designed to capture the audio from GetUserMedia
 */

class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
	    super();
        this.audios = new Float32Array(4096);
        this.position = 0;
    }

    /**
     * Once the GetUsermedia stream is connected to the Audio Context,
     * the following method is triggered continuously
     */
    process(inputs, outputs) {
        let input = inputs[0][0];
        this.audios.set(input, this.position);
		this.position += input.length;
		if(this.position >= 4096){
			this.port.postMessage({audio : this.audios});
			this.audios = new Float32Array(4096);
			this.position =  0;
		}
		return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);
