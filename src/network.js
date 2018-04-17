/**
 * This file is responsible for Network related tasks, eg: Mesauring bandwidth, Latency
 * and Controlling speed etc.
 * @type {{}}
 */

function Network () {
    this.latency = 0;
    this.sumLatency = 0;
    this.minLatency = 999999;
    this.countLatency = 0;
    this.avgLatency = 1;
    this.audioPlayLength = 1;
    this.MYSPEED_COUNTER_OK = 0;
    this.MYSPEED_COUNTER_HIGH = 0;

};

Network.prototype.pingToServer = function() {
    if(io.webSocketConnected()) {
        var time = Date.now();
        console.log('PING ' + time);
        ioAdapter.sendPing(time);
    }
};

/**
 * Sleeps for 10 seconds if PONG msg is received from server after two seconds
 * @param time is miliseconds at which, the applicaton pings the server
 */
Network.prototype.initToPing = function(time) {
    if(this.hasOwnProperty('initToPingTime')){
        clearTimeout(this.initToPingTime);
    }
    if(this.hasOwnProperty('sleepTime')){
        clearTimeout(this.sleepTime);
    }
    this.initToPingTime = setTimeout(
        () => {
            this.pingToServer();
            var that = this;
            this.sleepTime = setTimeout( () => {
                this.latency = 2000;
                that.initToPing(10000);
            }, 2000);
        },time
    );

    this.variations();
};

Network.prototype.variations = function() {
    console.log('Ping latency ' + this.latency);
    if (this.latency && this.latency < 2000) {
        this.sumLatency = this.sumLatency + this.latency;
        this.countLatency++;
        this.avgLatency = this.sumLatency / this.countLatency;
        if (this.latency < this.minLatency && this.latency > 10) {
            this.minLatency = this.latency;
        }
    }
    this.adaptiveMedia();
};

// SPEED 1 is best, 5 is worst
Network.prototype.adaptiveMedia = function() {
    if (virtualclass.videoHost.gObj.MYSPEED <= 4 && (
                this.latency > (this.avgLatency * 4) ||
                this.audioPlayLength > 4 ||
                this.avgLatency > this.minLatency * 2)
        ) {
        // Very high latency or incorrect LipSync or high average latency, disable video
        this.MYSPEED_COUNTER_OK = 0;
        this.setSpeed(5);
    } else if (virtualclass.videoHost.gObj.MYSPEED <= 4 && (this.latency > (this.avgLatency * 2))) {
        // High latency, reduce video frame rate
        this.MYSPEED_COUNTER_OK = 0;
        this.MYSPEED_COUNTER_HIGH++;
        if (this.MYSPEED_COUNTER_HIGH > 2){
            this.MYSPEED_COUNTER_HIGH = 0;
            this.setSpeed(5);
        }
    } else if (this.latency < (this.avgLatency * 1.2) && virtualclass.videoHost.gObj.MYSPEED > 1) {
        // Latency is ok, giving a chance of video recovery
        this.MYSPEED_COUNTER_OK++;
        this.MYSPEED_COUNTER_HIGH = 0;
        if (this.audioPlayLength && this.audioPlayLength <= 3 && this.MYSPEED_COUNTER_OK > 10) { // LipSync is correct
            this.MYSPEED_COUNTER_OK = 0;
            this.setSpeed(--virtualclass.videoHost.gObj.MYSPEED);
            if (virtualclass.videoHost.gObj.MYSPEED == 1) { // reset all counters
                this.sumLatency = 0;
                this.countLatency = 0;
                this.avgLatency = 1;
            }
        }
    }
};

Network.prototype.setSpeed = function(speed) {
    virtualclass.videoHost.gObj.MYSPEED = speed;
    ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
    console.log("CHANGE SPEED TO " + virtualclass.videoHost.gObj.MYSPEED);
    this.hideTeacherVideo(speed);
};

Network.prototype.hideTeacherVideo = function(speed) {
    if(roles.isStudent() && speed >= 5){
        var videoCanvas = document.querySelector('#videoParticipate');
        var videoCanvasContext = videoCanvas.getContext('2d');
        videoCanvasContext.fillStyle = "#000000";
        videoCanvasContext.fillRect(0, 0, videoCanvas.offsetWidth, videoCanvas.offsetHeight);
    }
}