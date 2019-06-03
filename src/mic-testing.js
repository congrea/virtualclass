var micTesting = {
    audioPlayerNode: false,
    manipulateStreamFallback (stream){
        this.playAudio = true;
        this.audioToBePlay = [];
        this.allAudioArr = [];
        this.bufferSize = 16384;
        if (stream != null) {

            if (!virtualclass.media.audioVisual.hasOwnProperty('audioCtx') ||
                (virtualclass.media.audioVisual.hasOwnProperty('audioCtx') && virtualclass.media.audioVisual.audioCtx == null)) {
                virtualclass.media.audioVisual.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            if (virtualclass.system.mediaDevices.hasMicrophone) {
                if (this.audioCreatorNode == null || this.audioCreatorNode == undefined || typeof this.audioCreatorNode == 'undefined') {
                    console.log('processor intialize');
                    this.audioInput = virtualclass.media.audioVisual.audioCtx.createMediaStreamSource(stream);
                    this.audioCreatorNode = virtualclass.media.audioVisual.audioCtx.createScriptProcessor(this.bufferSize, 1, 1);
                    this.audioCreatorNode.onaudioprocess = this.recorderProcessFallback.bind(this);
                    this.audioInput.connect(this.audioCreatorNode);
                    this.audioCreatorNode.connect(virtualclass.media.audioVisual.audioCtx.destination);

                } else {
                    console.log("No audio ");
                }
            } else {
                console.log('There is no microphone');
            }
        } else {
            console.log("No stream is found");
        }
    },

    recorderProcessFallback (e) {
        if (this.playAudio) {
            /** for edge browser **/
            if (!virtualclass.precheck.mic.graph.microphone.hasOwnProperty('localAudioBuffer') || virtualclass.precheck.mic.graph.microphone.localAudioBuffer == null) {
                virtualclass.precheck.mic.graph.microphone.localAudioBuffer = virtualclass.media.audioVisual.audioCtx.createBuffer(1, this.bufferSize, virtualclass.media.audioVisual.audioCtx.sampleRate);
            }

            var left = e.inputBuffer.getChannelData(0);
            this.queueWithFallback(left);
            this.playWithFallback();
            virtualclass.precheck.mic.graph.microphone.reloadBufferFunction(e);
        }
    },

    queueWithFallback (left){
        for (var i = 0; i < left.length; i++) {
            this.allAudioArr.push(left[i]);
        }
        while (this.allAudioArr.length >= this.bufferSize) {
            var arrChunk = this.allAudioArr.splice(0, this.bufferSize);
            this.audioToBePlay.push(new Float32Array(arrChunk));
        }
    },

    playWithFallback () {
        var that = this;
        if (!this.audioPlayerNode) {
            this.audioPlayerNode = virtualclass.media.audioVisual.audioCtx.createScriptProcessor(this.bufferSize, 1, 1);
            var snNodePak = 0;
            this.audioPlayerNode.onaudioprocess = function (event) {
                if (micTesting.playAudio) {
                    var output = event.outputBuffer.getChannelData(0);
                    var newAud = that.getAudioChunks();
                    if (newAud != null) {
                        for (i = 0; i < newAud.length; i++) {
                            output[i] = newAud[i];
                        }
                    }
                } else {
                    var output = event.outputBuffer.getChannelData(0);
                    for (i = 0; i < output.length; i++) {
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
        } else if (this.audioToBePlay.length >= 2) { // 743.03 miliseconds
            this.aChunksPlay = true;
            return this.audioToBePlay.shift();
        } else if (this.audioToBePlay.length > 0 && this.aChunksPlay === true) {
            this.aChunksPlay = true;
            return this.audioToBePlay.shift();
        } else {
            this.aChunksPlay = false;
        }
    },

    makeAudioEmpty (){
        this.playAudio = false;
        this.audioToBePlay = [];
    },

    destroyAudioNode (){
        this.makeAudioEmpty();
        if (virtualclass.gObj.meetingMode) {
            var tracks = virtualclass.multiVideo.localStream.getTracks();  // if only one media track
            for (var i = 0; i < tracks.length; i++) {
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
                if (virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'iOS' || virtualclass.system.mybrowser.name == 'Safari') {
                    virtualclass.media.audioVisual.audioCtx.close();
                }

                /**Audio context for graph **/
                if (virtualclass.precheck.mic.hasOwnProperty('graphProcessor')) {
                    if (virtualclass.precheck.mic.graphProcessor != null) {
                        virtualclass.precheck.mic.graphProcessor.disconnect(virtualclass.precheck.mic.graphContext.destination);
                    }
                }

                /** Need for firefox and sarari on Mobile**/
                if (virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'iOS' || virtualclass.system.mybrowser.name == 'Safari') {
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
        //     if(virtualclass.precheck.mic.hasOwnProperty('graphProcessor')){
        //         virtualclass.precheck.mic.graphProcessor.disconnect(virtualclass.precheck.mic.graphContext.destination);
        //     }
        //
        //     /** Need for firefox and sarari on Mobile**/
        //     if(virtualclass.system.mybrowser.name == 'Firefox' || virtualclass.system.mybrowser.name == 'iOS' || virtualclass.system.mybrowser.name == 'Safari' ){
        //         virtualclass.gObj.video.audioVisual.audioCtx.close();
        //         virtualclass.precheck.mic.graphContext.close();
        //     }
        //
        //     delete virtualclass.gObj.video.audioVisual.audioCtx;
        // }

    }
}