var ioMissingPackets = {
    executedStore: [], // It contains all executed data by current user (at receiver side)
    executedSerial: 0, // It is serial number of received/executed packet.
    missRequest: 0, // Status for Request for missed packets
    aheadPackets: [],
    //TODO - Store to IndexDB

    /**
     * 1) Check if packet is missed and request for missing packets
     * 2) If a request is already in queue, do not send more requests.
     * 3) Finally call, io.onRecMessage function when queue is normal (all missing packets received).
     */
    checkMissing: function (msg) {
        "use strict";
        if (msg.missedpackets == 1) {
            this.fillExecutedStore(msg);
        } else if (msg.serial) {
            if (msg.serial == (this.executedSerial + 1)) {
                this.executedSerial = msg.serial;
                io.onRecMessage(msg);
                this.executedStore[msg.serial] = msg;
            } else if (msg.serial > (this.executedSerial + 1)) {
                this.requestMissedPackets(this.executedSerial, msg.serial, msg);
            } else { // We will not execute packets that has serial lesser then current packet but let us still store them
                this.executedStore[msg.serial] = msg;
            }
        } else {
            console.log('checkMissing should not be called without serial');
        }
    },

    requestMissedPackets: function (from, till, msg) {
        "use strict";
        if (this.missRequest == 0) {
            this.waitAndResetmissRequest();
            var sendMsg = {
                reqMissPac: 1,
                from: from,
                till: till
            };
            var tid = virtualclass.vutil.whoIsTeacher();
            ioAdapter.mustSendUser(sendMsg, tid)
        } else {
            this.aheadPackets.unshift(msg.serial);
            this.executedStore[msg.serial] = msg;
        }
    },

    /**
     * Set missRequest variable and Reset it after delay time so that another attempt could be made
     */
    waitAndResetmissRequest: function () {
        this.missRequest = 1;
        setTimeout(function () {
            ioAdapter.missRequest = 0;
        }, 10000);
    },

    sendMissedPackets: function (msg) {
        "use strict";
        var senddata = ioAdapter.adapterMustData.slice(msg.from, msg.till);
        var sendmsg = {
            missedpackets: 1,
            data: senddata
        };
        ioAdapter.mustSendUser(sendmsg, msg.userto)
    },

    /**
     * Fill ExecutedStore with missing packets and executed them one by one
     * If aheadPackets are available, process them
     * @param msg
     */

    fillExecutedStore: function (msg) {
        "use strict";
        this.missRequest = 0;
        var dataLength = msg.data.length,
            i, ex;
        for (i = 0; i < dataLength; i++) {
            this.executedSerial = msg.data[i].serial;
            io.onRecMessage(msg.data[i]);
            this.executedStore[msg.data[i].serial] = msg.data[i];
        }

        // TODO It is possible that incoming packets are not in order
        while (ex = this.aheadPackets.pop()) {
            this.executedSerial = ex;
            io.onRecMessage(this.executedStore[ex]);
        }
    }

};