var ioMissingPackets = {
    executedStore: [], // It contains all executed data by current user (at receiver side)
    executedSerial: 0, // It is serial number of received/executed packet.
    missRequest: 0, // Status for Request for missed packets
    aheadPackets: [],
    //TODO - Store to IndexDB

    /**
     * 1) Check if packet is missed and request for missing packets
     * 2) If a request is already in queue, do not send more requests.
     * 3) Finally call, io.onRecJson function when queue is normal (all missing packets received).
     */
    checkMissing: function (msg) {
        "use strict";
        if (msg.m.missedpackets == 1) {
            this.fillExecutedStore(msg);
        } else if (msg.m.serial) {
            if (msg.m.serial == (this.executedSerial + 1)) {
                console.log('Displaying Object ' + msg.m.serial);
                this.executedSerial = msg.m.serial;
                this.onRecSave(msg);
                io.onRecJson(msg);
                this.executedStore[msg.m.serial] = msg;

            } else if (msg.m.serial > (this.executedSerial + 1)) {
                this.requestMissedPackets(this.executedSerial, msg.m.serial, msg);
            } else { // We will not execute packets that has serial lesser then current packet but let us still store them
                this.executedStore[msg.m.serial] = msg;
            }
        } else {
            console.log('checkMissing should not be called without serial');
        }
    },

    requestMissedPackets: function (from, till, msg) {
        console.log('request packet from ' + from + ' to ' + till);
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
            console.log('ahead packet' + msg.m.serial);
            this.aheadPackets.unshift(msg.m.serial);
            this.executedStore[msg.m.serial] = msg;
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
        var senddata = ioAdapter.adapterMustData.slice(msg.m.from, msg.m.till);
        console.log('send packet ' + ' from ' +  msg.m.from+ ' to ' + msg.m.till + 'for ' + msg.m.userto);
        var sendmsg = {
            missedpackets: 1,
            data: senddata
        };
        ioAdapter.mustSendUser(sendmsg, msg.m.userto)
    },

    /**
     * Fill ExecutedStore with missing packets and executed them one by one
     * If aheadPackets are available, process them
     * @param msg
     */

    fillExecutedStore: function (msg) {
        "use strict";
        console.log('received packet from ' + msg.m.data[0].serial + ' to ' + msg.m.data[msg.m.data.length-1].serial);
        this.missRequest = 0;
        var dataLength = msg.m.data.length,
            i, ex;
        for (i = 0; i < dataLength; i++) {
            this.executedSerial = msg.m.data[i].serial;
            this.onRecSave(msg.m.data[i]);
            io.onRecJson(msg.m.data[i]);
            this.executedStore[msg.m.data[i].serial] = msg.m.data[i];
        }

        // TODO It is possible that incoming packets are not in order
        while (ex = this.aheadPackets.pop()) {
            this.executedSerial = ex;
            this.onRecSave(this.executedStore[ex]);
            io.onRecJson(this.executedStore[ex]);
        }
    },

    onRecSave: function (msg) {
        var edata = JSON.stringify(msg);
        io.onRecSave(msg, edata);
    }

};