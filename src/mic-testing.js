var micTesting = {
    snNode : false,
    manipulateStreamFallback (stream){
        this.audioToBePlay = [];
        this.allAudioArr = [];
        this.bufferSize = 16384;
        if(stream !=  null){
            if(!virtualclass.gObj.video.audioVisual.hasOwnProperty('audioCtx')){
                virtualclass.gObj.video.audioVisual.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            // var bufferSize = 16384;

            if(virtualclass.gObj.video.audioVisual.hasOwnProperty('audioCtx')){
                var audioInput = virtualclass.gObj.video.audioVisual.audioCtx.createMediaStreamSource(stream);
                this.grec = virtualclass.gObj.video.audioVisual.audioCtx.createScriptProcessor(this.bufferSize, 1, 1);
                this.grec.onaudioprocess = this.recorderProcessFallback.bind(this);
                audioInput.connect(this.grec);
                this.grec.connect(virtualclass.gObj.video.audioVisual.audioCtx.destination);
            }else {
                console.log("No audio ");
            }
        }else {
            console.log("No stream is found");
        }
    },

    recorderProcessFallback (e) {
        var left = e.inputBuffer.getChannelData(0);
        this.queueWithFallback(left);
        this.playWithFallback();
    },

    queueWithFallback (left){
        for(var i=0; i< left.length; i++){
            this.allAudioArr.push(left[i]);
        }
        while (this.allAudioArr.length >= this.bufferSize) {
            var arrChunk =  this.allAudioArr.splice(0, this.bufferSize);
            this.audioToBePlay.push(new Float32Array(arrChunk));
        }
    },

    playWithFallback () {
        var that = this;
        if(!this.snNode){
            // console.log('script processor node is created');
            this.snNode = virtualclass.gObj.video.audioVisual.audioCtx.createScriptProcessor(16384, 1, 1);
            var snNodePak = 0;
            this.snNode.onaudioprocess = function (event){
                var output = event.outputBuffer.getChannelData(0);
                var newAud = that.getAudioChunks();
                if(newAud != null){
                    for (i = 0; i < newAud.length; i++) {
                        output[i] = newAud[i];
                    }
                }
            };
            this.snNode.connect(virtualclass.gObj.video.audioVisual.audioCtx.destination);
        }
    },

    getAudioChunks() {
         // console.log("Audio Packet Len "+ this.audioToBePlay.length)
        if (this.audioToBePlay.length >= (5)) { // 1857.5 miliseconds
            while (this.audioToBePlay.length >= (2)) { // 743.03 miliseconds
                this.audioToBePlay.shift();
            }
            this.aChunksPlay = true;
            //return this.audioToBePlay.shift();
        } else if(this.audioToBePlay.length >= 2) { // 743.03 miliseconds
            this.aChunksPlay = true;
            return this.audioToBePlay.shift();
        }
    },

    destroyAudio (){
        // console.log('DESTROY AUDIO');
        if(this.snNode){
            this.snNode.disconnect(virtualclass.gObj.video.audioVisual.audioCtx);
            this.grec.disconnect(virtualclass.gObj.video.audioVisual.audioCtx);
            delete virtualclass.gObj.video.audioVisual.audioCtx;
            delete this.snNode;
            this.snNode = false;
            delete this.grec;
        }
    }
}