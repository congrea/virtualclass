const micTesting = {
  audioPlayerNode: false,
  manipulateStreamFallback(stream) {
    if (virtualclass.media.audioVisual.audioCtx) micTesting.destroyAudioNode();
    this.playAudio = true;
    this.audioToBePlay = [];
    this.allAudioArr = [];
    this.bufferSize = 16384;
    if (stream != null) {
      virtualclass.media.audioVisual.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

      if (virtualclass.system.mediaDevices.hasMicrophone) {
          // console.log('processor intialize');
        this.audioInput = virtualclass.media.audioVisual.audioCtx.createMediaStreamSource(stream);
        this.audioCreatorNode = virtualclass.media.audioVisual.audioCtx.createScriptProcessor(this.bufferSize, 1, 1);
        this.audioCreatorNode.onaudioprocess = this.recorderProcessFallback.bind(this);
        this.audioInput.connect(this.audioCreatorNode);
        this.audioCreatorNode.connect(virtualclass.media.audioVisual.audioCtx.destination);
        
      } else {
        // console.log('There is no microphone');
      }
    } else {
      // console.log('No stream is found');
    }
  },

  recorderProcessFallback(e) {
    if (this.playAudio) {
      /** for edge browser * */
      if (!Object.prototype.hasOwnProperty.call(virtualclass.precheck.mic.graph.microphone, 'localAudioBuffer')
        || virtualclass.precheck.mic.graph.microphone.localAudioBuffer == null) {
        virtualclass.precheck.mic.graph.microphone.localAudioBuffer = virtualclass.media.audioVisual.audioCtx.createBuffer(1, this.bufferSize, virtualclass.media.audioVisual.audioCtx.sampleRate);
      }

      const left = e.inputBuffer.getChannelData(0);
      this.queueWithFallback(left);
      this.playWithFallback();
      virtualclass.precheck.mic.graph.microphone.reloadBufferFunction(e);
    }
  },

  queueWithFallback(left) {
    for (let i = 0; i < left.length; i++) {
      this.allAudioArr.push(left[i]);
    }
    while (this.allAudioArr.length >= this.bufferSize) {
      const arrChunk = this.allAudioArr.splice(0, this.bufferSize);
      this.audioToBePlay.push(new Float32Array(arrChunk));
    }
  },

  playWithFallback() {
    const that = this;
    let output;
    if (!this.audioPlayerNode) {
      this.audioPlayerNode = virtualclass.media.audioVisual.audioCtx.createScriptProcessor(this.bufferSize, 1, 1);
      const snNodePak = 0;
      this.audioPlayerNode.onaudioprocess = function (event) {
        if (micTesting.playAudio) {
          output = event.outputBuffer.getChannelData(0);
          const newAud = that.getAudioChunks();
          if (newAud != null) {
            for (let i = 0; i < newAud.length; i++) {
              output[i] = newAud[i];
            }
          }
        } else {
          output = event.outputBuffer.getChannelData(0);
          for (let i = 0; i < output.length; i++) {
            output[i] = 0;
          }
        }
      };
      this.audioPlayerNode.connect(virtualclass.media.audioVisual.audioCtx.destination);
    }
  },

  getAudioChunks() {
    if (this.audioToBePlay.length >= (5)) { // 1857.5 miliseconds
      while (this.audioToBePlay.length >= (2)) { // 743.03 miliseconds
        this.audioToBePlay.shift();
      }
      this.aChunksPlay = true;
      return this.audioToBePlay.shift();
    } if (this.audioToBePlay.length >= 2) { // 743.03 miliseconds
      this.aChunksPlay = true;
      return this.audioToBePlay.shift();
    } if (this.audioToBePlay.length > 0 && this.aChunksPlay === true) {
      this.aChunksPlay = true;
      return this.audioToBePlay.shift();
    }
    this.aChunksPlay = false;
  },

  makeAudioEmpty() {
    this.playAudio = false;
    this.audioToBePlay = [];
  },

  destroyAudioNode() {
    this.makeAudioEmpty();
    if (virtualclass.gObj.meetingMode) {
      const tracks = virtualclass.multiVideo.localStream.getTracks(); // if only one media track
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].stop();
      }
    } else {
      if (this.audioPlayerNode) {
        this.audioPlayerNode.disconnect(virtualclass.media.audioVisual.audioCtx.destination);
        delete this.audioPlayerNode;
        this.audioPlayerNode = false;
      }

      if (this.audioCreatorNode) {
        this.audioCreatorNode.disconnect(virtualclass.media.audioVisual.audioCtx.destination);
        delete this.audioCreatorNode;
        if (virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'iOS'
          || virtualclass.system.mybrowser.name === 'Safari') {
          virtualclass.media.audioVisual.audioCtx.close();
        }

        /** Audio context for graph * */
        if (Object.prototype.hasOwnProperty.call(virtualclass.precheck.mic, 'graphProcessor')) {
          if (virtualclass.precheck.mic.graphProcessor != null) {
            virtualclass.precheck.mic.graphProcessor.disconnect(virtualclass.precheck.mic.graphContext.destination);
          }
        }

        /** Need for firefox and sarari on Mobile* */
        if (virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'iOS'
          || virtualclass.system.mybrowser.name === 'Safari') {
          if (virtualclass.precheck.mic.graphContext != null) {
            virtualclass.precheck.mic.graphContext.close();
          }
        }

        delete virtualclass.media.audioVisual.audioCtx;
      }
    }


    //
    //
    //
    //
    //
    // if(this.grec){
    //     console.log('Destroy this.rec');
    //     this.grec.disconnect(virtualclass.gObj.video.audioVisual.audioCtx.destination);
    //     delete this.grec;
    //
    //     if(Object.prototype.hasOwnProperty.call(virtualclass.precheck.mic, 'graphProcessor')){
    //         virtualclass.precheck.mic.graphProcessor.disconnect(virtualclass.precheck.mic.graphContext.destination);
    //     }
    //
    //     /** Need for firefox and sarari on Mobile**/
    //     if(virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'iOS'
    // || virtualclass.system.mybrowser.name == 'Safari' ){
    //         virtualclass.gObj.video.audioVisual.audioCtx.close();
    //         virtualclass.precheck.mic.graphContext.close();
    //     }
    //
    //     delete virtualclass.gObj.video.audioVisual.audioCtx;
    // }
  },
};