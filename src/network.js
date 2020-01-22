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
}

Network.prototype.pingToServer = function () {
  if (io.webSocketConnected()) {
    const time = Date.now();
    ioAdapter.sendPing(time);
  }
};

/**
 * Sleeps for 10 seconds if PONG msg is received from server after two seconds.
 * @param time is miliseconds at which, the applicaton pings the server
 */
Network.prototype.initToPing = function (time) {
  if (Object.prototype.hasOwnProperty.call(this, 'initToPingTime')) {
    clearTimeout(this.initToPingTime);
  }
  if (Object.prototype.hasOwnProperty.call(this, 'sleepTime')) {
    clearTimeout(this.sleepTime);
  }
  this.initToPingTime = setTimeout(
    () => {
      this.pingToServer();
      const that = this;
      this.sleepTime = setTimeout(() => {
        this.latency = 3000;
        that.initToPing(5000);
      }, 3000);
    }, time,
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
  if (virtualclass.videoHost.gObj.MYSPEED < 3
    && (this.latency >= 3000 || (this.minLatency < 999999 && (this.latency > (this.minLatency * 3))))) {
    // Very high latency, disable video
    this.MYSPEED_COUNTER_OK = 0;
    this.MYSPEED_COUNTER_HIGH += 1;
    this.updateNetworkInfo('medium');
    if (virtualclass.videoHost.gObj.MYSPEED === 1 && this.MYSPEED_COUNTER_HIGH >= 2) {
      this.MYSPEED_COUNTER_HIGH = 0;
      this.updateNetworkInfo('medium');
      this.setSpeed(2);
    } else if (virtualclass.videoHost.gObj.MYSPEED === 2 && this.MYSPEED_COUNTER_HIGH >= 4) {
      this.MYSPEED_COUNTER_HIGH = 0;
      this.updateNetworkInfo('slow');
      this.setSpeed(3);
    }
  } else if (virtualclass.videoHost.gObj.MYSPEED > 1 && this.minLatency < 999999
    && this.latency < (this.minLatency * 2)) {
    // Latency is ok, giving a chance of video recovery
    this.MYSPEED_COUNTER_OK += 1;
    this.MYSPEED_COUNTER_HIGH = 0;
    this.updateNetworkInfo('medium');
    if (virtualclass.videoHost.gObj.MYSPEED > 2 && this.MYSPEED_COUNTER_OK >= 4) {
      this.MYSPEED_COUNTER_OK = 0;
      this.updateNetworkInfo('medium');
      this.setSpeed(2);
    } else if (virtualclass.videoHost.gObj.MYSPEED > 1 && this.MYSPEED_COUNTER_OK >= 10) {
      this.MYSPEED_COUNTER_OK = 0;
      this.updateNetworkInfo('fast');
      this.setSpeed(1);
    }
  } else {
    if (this.latency > 1000) {
      this.updateNetworkInfo('medium');
    } else {
      this.updateNetworkInfo('fast');
    }
    this.MYSPEED_COUNTER_OK = 0;
    this.MYSPEED_COUNTER_HIGH = 0;
  }
};

Network.prototype.updateNetworkInfo = function (latency) {
  let speed;
  if (virtualclass.videoHost.gObj.MYSPEED === 1) {
    speed = 'high';
  } else if (virtualclass.videoHost.gObj.MYSPEED === 2) {
    speed = 'medium';
  } else if (virtualclass.videoHost.gObj.MYSPEED === 3) {
    speed = 'low';
  }


  // var videoSpeed = document.getElementById('videSpeedNumber');
  const videoSpeed = document.getElementById('proposedSpeed');
  if (videoSpeed) {
    videoSpeed.dataset.suggestion = speed;
  }

  // videoFrameRate.innerHTML = frameRate;
  // todo to  validate
  const networkLatency = document.getElementById('networkLatency');
  if (networkLatency) {
    networkLatency.dataset.latency = latency;
    const text = virtualclass.lang.getString(`band${latency}`);
    networkLatency.dataset.title = text;
  }
};

Network.prototype.setSpeed = function (speed) {
  virtualclass.videoHost.gObj.MYSPEED = speed;
  ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
  // console.log(`Latency - CHANGE SPEED TO ${virtualclass.videoHost.gObj.MYSPEED}`);
  this.hideTeacherVideo();
  this.resetVariations();
};

Network.prototype.hideTeacherVideo = function () {
  if (roles.isStudent() && virtualclass.videoHost.gObj.MYSPEED >= 3) {
    const videoCanvas = document.querySelector('#videoParticipate');
    const videoCanvasContext = videoCanvas.getContext('2d');
    videoCanvasContext.fillStyle = '#000000';
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
  const networkStatusContainer = document.querySelector('#networkStatusContainer');
  const virtualclassContConatiner = document.querySelector('#virtualclassCont');
  if (networkStatusContainer == null) {
    const that = this;
    virtualclass.gObj.connectingRoom = setTimeout(
      () => {
        that.netWorkElementIsReady();
      }, 1000,
    );
  } else {
    networkStatusContainer.classList.add('connecting-room');
    if (!virtualclass.isPlayMode) virtualclassContConatiner.classList.add('connecting');
    clearTimeout(virtualclass.gObj.connectingRoom);
  }
};
