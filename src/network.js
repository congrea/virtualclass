/**
 * This file is responsible for Network related tasks, eg: mesauring Bandwidth, Latency
 * and Controlling speed etc.
 * @type {{}}
 */

function Network () {};

Network.prototype.msgReceived = function(ptime) {
    return virtualclass.gObj.pingstatus[ptime];
};

Network.prototype.pingToServer = function(time) {
    if(io.webSocketConnected()) {
        console.log('PING ' + time);
        ioAdapter.sendPing(time);
    }
};

/**
 * Sleeps for 10 seconds if PONG msg does receive from server
 * @param time is miliseconds at which the applicaton pings the server
 */
Network.prototype.initToPing = function(time) {
    if(virtualclass.gObj.hasOwnProperty('initToPingTime')){
        clearTimeout(virtualclass.gObj.initToPingTime);
    }
    virtualclass.gObj.initToPingTime = setTimeout(
        () => {
            var ptime = Date.now();
            virtualclass.gObj.pingstatus[ptime] = false;
            this.pingToServer(ptime);
            var that = this;
            (function(ptime){
                setTimeout( () => {
                    var time = that.msgReceived(ptime) ? 1000 : 10000;
                    that.initToPing(time);
                    delete virtualclass.gObj.pingstatus[ptime];
                }, 2000);
            }(ptime));
        },time
    );
};