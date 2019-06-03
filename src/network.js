/**
 * This file is responsible for Network related tasks, eg: Mesauring bandwidth, Latency
 * and Controlling speed etc.
 * @type {{}}
 */

function Network() {
    this.latency = 0;
    this.sumLatency = 0;
    this.minLatency = 999999;
    this.countLatency = 0;
    this.avgLatency = 1;
    this.MYSPEED_COUNTER_OK = 0;
    this.MYSPEED_COUNTER_HIGH = 0;

};

Network.prototype.pingToServer = function () {
    if (io.webSocketConnected()) {
        var time = Date.now();
        ioAdapter.sendPing(time);
    }
};

/**
 * Sleeps for 10 seconds if PONG msg is received from server after two seconds.
 * @param time is miliseconds at which, the applicaton pings the server
 */
Network.prototype.initToPing = function (time) {
    if (this.hasOwnProperty('initToPingTime')) {
        clearTimeout(this.initToPingTime);
    }
    if (this.hasOwnProperty('sleepTime')) {
        clearTimeout(this.sleepTime);
    }
    this.initToPingTime = setTimeout(
        () => {
            this.pingToServer();
            var that = this;
            this.sleepTime = setTimeout(() => {
                this.latency = 3000;
                that.initToPing(5000);
            }, 3000);
        }, time
    );

    this.variations();
};

Network.prototype.variations = function () {
    if (this.latency && this.latency < 3000 && this.latency > 0) {
        this.sumLatency = this.sumLatency + this.latency;
        this.countLatency++;
        this.avgLatency = Math.round(this.sumLatency / this.countLatency);
        if (this.latency < this.minLatency && this.latency > 10) {
            this.minLatency = this.latency;
        }
    }
    if (this.avgLatency > this.minLatency * 2) {
        this.resetVariations();
    }
    this.adaptiveMedia();

};

// SPEED 1 is best, 5 is worst
Network.prototype.adaptiveMedia = function () {
    if (virtualclass.videoHost.gObj.MYSPEED < 3 && (this.latency >= 3000 || ( this.minLatency < 999999 && (this.latency > (this.minLatency * 3))))) {
        // Very high latency, disable video
        this.MYSPEED_COUNTER_OK = 0;
        this.MYSPEED_COUNTER_HIGH++;
        this.updateNetworkInfo("slow");
        //console.log('HIGH count ' + this.MYSPEED_COUNTER_HIGH + ' Latency ' + this.latency + ' minLatency ' + this.minLatency + " speed " + virtualclass.videoHost.gObj.MYSPEED);
        if (virtualclass.videoHost.gObj.MYSPEED == 1 && this.MYSPEED_COUNTER_HIGH >= 3) {
            this.MYSPEED_COUNTER_HIGH = 0;
            this.setSpeed(2);
        } else if (virtualclass.videoHost.gObj.MYSPEED == 2 && this.MYSPEED_COUNTER_HIGH >= 4) {
            this.MYSPEED_COUNTER_HIGH = 0;
            this.setSpeed(3);
        }
    } else if (virtualclass.videoHost.gObj.MYSPEED > 1 && this.minLatency < 999999 && this.latency < (this.minLatency * 2)) {
        // Latency is ok, giving a chance of video recovery
        this.MYSPEED_COUNTER_OK++;
        this.MYSPEED_COUNTER_HIGH = 0;
        this.updateNetworkInfo("fast");
        // console.log('OK count ' + this.MYSPEED_COUNTER_OK + ' Latency ' + this.latency + ' minLatency ' + this.minLatency + " speed " + virtualclass.videoHost.gObj.MYSPEED);
        if (virtualclass.videoHost.gObj.MYSPEED > 2 && this.MYSPEED_COUNTER_OK >= 4) {
            this.MYSPEED_COUNTER_OK = 0;
            this.setSpeed(2);
        } else if (virtualclass.videoHost.gObj.MYSPEED > 1 && this.MYSPEED_COUNTER_OK >= 10) {
            this.MYSPEED_COUNTER_OK = 0;
            this.setSpeed(1);
        }
    } else {
        if (this.latency > 2000) {
            this.updateNetworkInfo("slow");
        } else {
            this.updateNetworkInfo("fast");
        }
        //  console.log('Latency ' + this.latency + ' minLatency ' + this.minLatency + " speed " + virtualclass.videoHost.gObj.MYSPEED);
        this.MYSPEED_COUNTER_OK = 0;
        this.MYSPEED_COUNTER_HIGH = 0;
    }
};

Network.prototype.updateNetworkInfo = function (latency) {
    var speed;
    if (virtualclass.videoHost.gObj.MYSPEED == 1) {
        speed = "high";
    } else if (virtualclass.videoHost.gObj.MYSPEED == 2) {
        speed = "medium";
    } else if (virtualclass.videoHost.gObj.MYSPEED == 3) {
        speed = "low";
    }

    // var videoSpeed = document.getElementById('videSpeedNumber');
    var videoSpeed = document.getElementById('proposedSpeed');
    if (videoSpeed) {
        videoSpeed.dataset.suggestion = speed;
    }

    //videoFrameRate.innerHTML = frameRate;
    // todo to  validate
    var networkLatency = document.getElementById('networkLatency');
    if (networkLatency) {
        networkLatency.dataset.latency = latency;
        var text = virtualclass.lang.getString('band' + latency);
        networkLatency.dataset.title = text;
    }
};

Network.prototype.setSpeed = function (speed) {
    virtualclass.videoHost.gObj.MYSPEED = speed;
    ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
    console.log("Latency - CHANGE SPEED TO " + virtualclass.videoHost.gObj.MYSPEED);
    this.hideTeacherVideo();
    this.resetVariations();
};

Network.prototype.hideTeacherVideo = function () {
    if (roles.isStudent() && virtualclass.videoHost.gObj.MYSPEED >= 3) {
        var videoCanvas = document.querySelector('#videoParticipate');
        var videoCanvasContext = videoCanvas.getContext('2d');
        videoCanvasContext.fillStyle = "#000000";
        videoCanvasContext.fillRect(0, 0, videoCanvas.offsetWidth, videoCanvas.offsetHeight);
    }
};

Network.prototype.resetVariations = function () {
    this.sumLatency = 0;
    this.countLatency = 0;
    this.avgLatency = 1;
    this.minLatency = 999999;
};


Network.prototype.netWorkElementIsReady = function () {
    var networkStatusContainer = document.querySelector('#networkStatusContainer');
    if (networkStatusContainer == null) {
        var that = this;
        virtualclass.gObj.connectingRoom = setTimeout(
            function () {
                that.netWorkElementIsReady();
            }, 1000
        );
    } else {
        networkStatusContainer.classList.add('connecting-room');
        clearTimeout(virtualclass.gObj.connectingRoom);
    }
}

