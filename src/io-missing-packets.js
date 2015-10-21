var ioMissingPackets = {
    // Variables for broadcast messages
    executedStore: [], // It contains all executed data by current user (at receiver side), used by ahead packets
    executedSerial: (localStorage.getItem('executedSerial') != null) ? JSON.parse(localStorage.getItem('executedSerial'))  : {},
    missRequest: [], // Status for Request for missed packets
    aheadPackets: [],
    missRequestFlag: 0, // Flag to show status of Miss Packet request

    // Variables for individual messages (usersend)
    executedUserStore: [],
    executedUserSerial: (localStorage.getItem('executedUserSerial') != null) ? JSON.parse(localStorage.getItem('executedUserSerial'))  : {},

    missUserRequest: [], // Status for Request for missed packets
    aheadUserPackets: [],


    missUserRequestFlag: 0, // Flag to show status of Miss Packet request
    //TODO - Store to IndexDB

    validateAllVariables: function (uid) {
        "use strict";
        if (typeof this.executedSerial == 'undefined' || this.executedSerial == null) {
            this.executedSerial = {};
        }
        if (typeof this.executedSerial[uid] == 'undefined') {
            this.executedSerial[uid] = -1;
        }
        if (typeof this.missRequest[uid] == 'undefined') {
            this.missRequest[uid] = 0;
        }
        if (typeof this.executedStore[uid] == 'undefined') {
            this.executedStore[uid] = [];
        }
        if (typeof this.aheadPackets[uid] == 'undefined') {
            this.aheadPackets[uid] = [];
        }
    },
    validateAllUserVariables: function (uid) {
        "use strict";
        if (typeof this.executedUserSerial == 'undefined' || this.executedUserSerial == null) {
            this.executedUserSerial = {};
        }
        if (typeof this.executedUserSerial[uid] == 'undefined') {
            this.executedUserSerial[uid] = -1;
        }
        if (typeof this.missUserRequest[uid] == 'undefined') {
            this.missUserRequest[uid] = 0;
        }
        if (typeof this.executedUserStore[uid] == 'undefined') {
            this.executedUserStore[uid] = [];
        }
        if (typeof this.aheadUserPackets[uid] == 'undefined') {
            this.aheadUserPackets[uid] = [];
        }
    },


    /**
     * 1) Check if packet is missed and request for missing packets
     * 2) If a request is already in queue, do not send more requests.
     * 3) Finally call, io.onRecJson function when queue is normal (all missing packets received).
     */
    checkMissing: function (msg) {
        "use strict";
        var uid = msg.user.userid;
        this.validateAllVariables(uid);

        if(msg.m.hasOwnProperty('ping') && msg.m.hasOwnProperty('session')){
            var mySession = localStorage.getItem('mySession');
            if(mySession != null && msg.m.session != mySession){
                // TODO Finish Session and start gracefully
                if (!virtualclass.isPlayMode) {
                    localStorage.removeItem('mySession');
                    virtualclass.storage.config.endSession();
                    localStorage.setItem('mySession', msg.m.session);
                    console.log('REFRESH SESSION');
                } else {
                    localStorage.setItem('mySession', 'thisismyplaymode');
                }
                return;
            }
        }

        if (msg.m.missedpackets == 1) {
            this.fillExecutedStore(msg);
        } else if (typeof msg.m.serial != 'undefined' && msg.m.serial != null) {
            if (msg.m.serial == (this.executedSerial[uid] + 1)) {
                // Everything is good and in order
                console.log('UID ' + uid + ' Object with Serial ' + msg.m.serial);
                this.executedSerial[uid] = msg.m.serial;
                this.executedStore[uid][msg.m.serial] = msg;
                ioStorage.dataExecutedStoreAll(msg, uid + '_' + msg.m.serial);
                this.onRecSave(msg);
                io.onRecJson(msg);
            } else if (msg.m.serial > (this.executedSerial[uid] + 1)) {
                console.log('UID ' + uid + ' requst miss packet');
                //we should not need the request packet when self packet is recieved
                //if(msg.user.userid != virtualclass.gObj.uid){
                var from = this.executedSerial[uid] + 1;
                this.requestMissedPackets(from, msg.m.serial, msg, uid);
                //}

            } else { // We will not execute packets that has serial lesser then current packet but let us still store them
                console.log('UID ' + uid + ' no action current packet ' + this.executedSerial[uid] + ' coming at ' + msg.m.serial);
                this.executedStore[uid][msg.m.serial] = msg;
            }
        } else {
            console.log('UID ' + uid + ' checkMissing should not be called without serial');
        }
    },

    /**
     * Only applicable for messages send individually to a user
     * 1) Check if packet is missed and request for missing packets
     * 2) If a request is already in queue, do not send more requests.
     * 3) Finally call, io.onRecJson function when queue is normal (all missing packets received).
     */
    userCheckMissing: function (msg) {
        "use strict";
        var uid = msg.user.userid;
        this.validateAllUserVariables(uid);

        if (msg.m.missedpackets == 1) {
            this.fillExecutedStore(msg);
        } else if (typeof msg.m.userSerial != 'undefined' && msg.m.userSerial != null) {
            if (msg.m.userSerial == (this.executedUserSerial[uid] + 1)) {
                // Everything is good and in order
                console.log('UID ' + uid + ' Object with userSerial ' + msg.m.userSerial);
                this.executedUserSerial[uid] = msg.m.userSerial;
                this.onRecSave(msg);
                io.onRecJson(msg);
                this.executedUserStore[uid][msg.m.userSerial] = msg;
                ioStorage.dataExecutedStoreAll(msg, uid + '_' + msg.m.userSerial);
            } else if (msg.m.userSerial > (this.executedUserSerial[uid] + 1)) {
                console.log('UID ' + uid + ' requst miss packet');
                var from = this.executedUserSerial[uid] + 1;
                this.userRequestMissedPackets(from, msg.m.userSerial, msg, uid);
            } else { // We will not execute packets that has userSerial lesser then current packet but let us still store them
                console.log('UID ' + uid + ' no action current packet ' + this.executedUserSerial[uid] + ' coming at ' + msg.m.userSerial);
                this.executedUserStore[uid][msg.m.userSerial] = msg;
            }
        } else {
            console.log('UID ' + uid + ' checkMissing should not be called without userSerial');
        }
    },

    requestMissedPackets: function (from, till, msg, uid) {
        //debugger;
        if (from < 0) { // Make sure from is not negative
            from = 0;
        }

        "use strict";
        if (this.missRequest[uid] == 0) {
            // Save current packet
            this.aheadPackets[uid].unshift(msg.m.serial);
            this.executedStore[uid][msg.m.serial] = msg;
            till--; // We do not need to request current packet.
            console.log('UID ' + uid + ' request packet from ' + from + ' to ' + till);
            this.waitAndResetmissRequest(uid);
            var sendMsg = {
                reqMissPac: 1,
                from: from,
                till: till
            };
            //var tid = virtualclass.vutil.whoIsTeacher();
            ioAdapter.sendUser(sendMsg, uid)
        } else {
            console.log('UID ' + uid + ' ahead packet' + msg.m.serial);
            this.aheadPackets[uid].unshift(msg.m.serial);
            this.executedStore[uid][msg.m.serial] = msg;
        }
    },

    userRequestMissedPackets: function (from, till, msg, uid) {
        //debugger;
        if (from < 0) { // Make sure from is not negative
            from = 0;
        }

        "use strict";
        if (this.missUserRequest[uid] == 0) {
            // Save current packet
            this.aheadUserPackets[uid].unshift(msg.m.userSerial);
            this.executedUserStore[uid][msg.m.userSerial] = msg;
            till--; // We do not need to request current packet.
            console.log('UID ' + uid + ' User request packet from ' + from + ' to ' + till);
            this.userWaitAndResetmissUserRequest(uid);
            var sendMsg = {
                userReqMissPac: 1,
                from: from,
                till: till
            };
            //var tid = virtualclass.vutil.whoIsTeacher();
            ioAdapter.sendUser(sendMsg, uid)
        } else {
            console.log('UID ' + uid + ' User ahead packet' + msg.m.userSerial);
            this.aheadUserPackets[uid].unshift(msg.m.userSerial);
            this.executedUserStore[uid][msg.m.userSerial] = msg;
        }
    },


    /**
     * Set missRequest variable and Reset it after delay time so that another attempt could be made
     */
    waitAndResetmissRequest: function (uid) {
        ioMissingPackets.missRequest[uid] = 1;
        ioMissingPackets.missRequestFlag = 1;
        setTimeout(function () {
            ioMissingPackets.missRequest[uid] = 0;
            ioMissingPackets.missRequestFlag = 0;
        }, 15000);
    },

    /**
     * Set missUserRequest variable and Reset it after delay time so that another attempt could be made
     */
    userWaitAndResetmissUserRequest: function (uid) {
        ioMissingPackets.missUserRequest[uid] = 1;
        ioMissingPackets.missUserRequestFlag = 1;
        setTimeout(function () {
            ioMissingPackets.missUserRequest[uid] = 0;
            ioMissingPackets.missUserRequestFlag = 0;
        }, 15000);
    },

    sendMissedPackets: function (msg) {
        "use strict";
        var uid = msg.user.userid;
        this.validateAllVariables(uid);

        var from = msg.m.from;
        if (from < 0) { // Make sure from is not negative
            from = 0;
        }
        var till = msg.m.till + 1; // slice extracts up to but not including end.
        var senddata = ioAdapter.adapterMustData.slice(from, till);

        var sendmsg = {
            missedpackets: 1,
            data: senddata
        };

        ioAdapter.sendUser(sendmsg, msg.user.userid); //to user
        console.log('UID ' + uid + ' send packet total chunk length ' + senddata.length);
    },

    userSendMissedPackets: function (msg) {
        "use strict";
        var uid = msg.user.userid;
        this.validateAllUserVariables(uid);

        var from = msg.m.from;
        if (from < 0) { // Make sure from is not negative
            from = 0;
        }
        var till = msg.m.till + 1; // slice extracts up to but not including end.
        var senddata = ioAdapter.userAdapterMustData[uid].slice(from, till);

        var sendmsg = {
            userMissedpackets: 1,
            data: senddata
        };

        ioAdapter.sendUser(sendmsg, msg.user.userid); // Will avoid using 'Must' Send for 'Must' Send miss request
        console.log('UID ' + uid + ' send packet total chunk length ' + senddata.length);
    },

    /**
     * Fill ExecutedStore with missing packets and executed them one by one
     * If aheadPackets are available, process them
     * @param msg
     */

    fillExecutedStore: function (msg) {

        "use strict";
        var uid = msg.user.userid;
        this.validateAllVariables(uid);

        //console.log('received packet');
        if (msg.m.data.length > 0) {
            console.log('UID ' + uid + ' received packet from ' + msg.m.data[0].m.serial + ' to ' + msg.m.data[msg.m.data.length - 1].m.serial);
        } else {
            console.log('UID ' + uid + ' empty data object');
        }

        var dataLength = msg.m.data.length,
            i, ex;
        for (i = 0; i < dataLength; i++) {
            if (msg.m.data[i] != null) {
                //the serial should not be null and undefined
                if (typeof msg.m.data[i].m.serial != 'undefined' && msg.m.data[i].m.serial != null) {
                    this.executedSerial[uid] = msg.m.data[i].m.serial;
                    ioStorage.dataExecutedStoreAll(msg.m.data[i], uid + '_' + msg.m.data[i].m.serial);
                    this.onRecSave(msg.m.data[i]);
                    msg.m.data[i].user = msg.user;

                    this.executedStore[uid][msg.m.data[i].m.serial] = msg.m.data[i];

                    try {
                        console.log('UID ' + uid + ' Object with Serial ' + msg.m.data[i].m.serial);

                        if(!msg.m.data[i].m.hasOwnProperty('receiver')){ // if not common chat
                            io.onRecJson(msg.m.data[i]);
                        }

                    } catch (error) {
                        console.log("Error " + error);
                    }
                } else {
                    console.log('UID ' + uid + ' Received Packed missing serial')
                }
            }
        }

        this.aheadPackets[uid] = this.aheadPackets[uid].sort(function (a, b) {
            return b - a
        }); // Make sure packets are in correct order.
        while (ex = this.aheadPackets[uid].pop()) {
            if (typeof ex != 'undefined' && ex != null) {

                if(typeof this.executedStore[uid][ex] != 'undefined'){
                    this.executedSerial[uid] = ex;

                    this.onRecSave(this.executedStore[uid][ex]);
                    console.log('UID ' + uid + ' Object with Serial ' + this.executedStore[uid][ex].m.serial);
                    ioStorage.dataExecutedStoreAll(this.executedStore[uid][ex], uid + '_' + this.executedStore[uid][ex].m.serial);
                    io.onRecJson(this.executedStore[uid][ex]);
                } else {
                    console.log('fillExecutedStore undefined');
                    return; //
                }

            } else {
                console.log('UID ' + uid + ' ahead Packed missing serial')
            }
        }
        this.missRequest[uid] = 0;
        ioMissingPackets.missRequestFlag = 0;
    },

    /**
     * Fill executedUserStore with missing packets and executed them one by one
     * If aheadUserPackets are available, process them
     * @param msg
     */

    userFillExecutedStore: function (msg) {
        "use strict";
        var uid = msg.user.userid;
        this.validateAllUserVariables(uid);

        //console.log('received packet');
        if (msg.m.data.length > 0) {
            console.log('UID ' + uid + ' received user packet from ' + msg.m.data[0].m.userSerial + ' to ' + msg.m.data[msg.m.data.length - 1].m.userSerial);
        } else {
            console.log('UID ' + uid + ' empty user data object');
        }

        var dataLength = msg.m.data.length,
            i, ex;
        for (i = 0; i < dataLength; i++) {
            if (msg.m.data[i] != null) {
                //the serial should not be null and undefined
                if (typeof msg.m.data[i].m.userSerial != 'undefined' && msg.m.data[i].m.userSerial != null) {
                    this.executedUserSerial[uid] = msg.m.data[i].m.userSerial;
                    ioStorage.dataExecutedUserStoreAll(msg.m.data[i], uid + '_' + msg.m.data[i].m.userSerial, msg.m.data[i].m.userSerial);
                    this.onRecSave(msg.m.data[i]);
                    msg.m.data[i].user = msg.user;
                    msg.m.data[i].userto =  msg.userto;

                    try {
                        console.log('UID ' + uid + ' Object with user Serial ' + msg.m.data[i].m.userSerial);
                        io.onRecJson(msg.m.data[i]);
                    } catch (error) {
                        console.log("Error " + error);
                    }
                    this.executedUserStore[uid][msg.m.data[i].m.userSerial] = msg.m.data[i];
                } else {
                    console.log('UID ' + uid + ' Received Packed missing User serial')
                }
            }
        }

        this.aheadUserPackets[uid] = this.aheadUserPackets[uid].sort(function (a, b) {
            return b - a
        }); // Make sure packets are in correct order.
        while (ex = this.aheadUserPackets[uid].pop()) {
            if (typeof ex != 'undefined' && ex != null) {
                this.executedUserSerial[uid] = ex;
                this.onRecSave(this.executedUserStore[uid][ex]);
                console.log('UID ' + uid + ' Object with Serial ' + this.executedUserStore[uid][ex].m.userSerial);
                io.onRecJson(this.executedUserStore[uid][ex]);
                //TODO Add proper Store
                //ioStorage.dataexecutedUserStoreAll(this.executedUserStore[uid][ex], uid + '_' + this.executedUserStore[uid][ex].m.userSerial);
            } else {
                console.log('UID ' + uid + ' ahead Packed missing serial')
            }
        }
        this.missUserRequest[uid] = 0;
        ioMissingPackets.missUserRequestFlag = 0;
    },

    //save for recording process
    onRecSave: function (msg) {
        var edata = JSON.stringify(msg);
        io.onRecSave(msg, edata);
    }

};