var ioAdapter = {
    adapterMustData: [], // It contains all data that is must for all users to have
    serial: -1, // It is serial number of sent packet, normally set to current number
    userSerial: [], // It is serial number of sent packet to individual user
    userAdapterMustData: [], // It contains all data that is must for all users to have for individual users
    //TODO - Store to IndexDB


    validateAllVariables: function (uid) {
        "use strict";
        if (typeof this.userSerial == 'undefined' || this.userSerial == null) {
            this.userSerial = [];
        }
        if (typeof this.userSerial[uid] == 'undefined') {
            this.userSerial[uid] = -1;
        }
        if (typeof this.userAdapterMustData == 'undefined' || this.userAdapterMustData == null) {
            this.userAdapterMustData = [];
        }
        if (typeof this.userAdapterMustData[uid] == 'undefined') {
            this.userAdapterMustData[uid] = [];
        }
    },

    mustSend: function (msg) {
        "use strict";
        this.serial++;
        console.log('s.n ' + this.serial);
        msg.serial = this.serial;
        this.adapterMustData[this.serial] = {type: 'broadcast', m: msg};
        this.send(msg);
        ioStorage.dataAdapterStore({type: 'broadcast', user: wbUser.id, m: msg}, this.serial);
    },

    send: function (msg) {
        "use strict";
        var cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
        io.send(msg, cfun, null);
        ioStorage.sendStore(msg, cfun);
    },

    mustSendAll: function (msg) {
        "use strict";
        // var orisend = JSON.parse(JSON.stringify(msg));
        this.mustSendUser(msg, virtualclass.gObj.uid);
        this.mustSend(msg);

    },

    sendAll: function (msg) {
        "use strict";
        var cfun = 'broadcast'; // Broadcast (send to self) - Editor
        io.send(msg, cfun, null);
    },

    //TODO Function below still needs to have missing packets functionality
    mustSendUser: function (msg, touser) {
        "use strict";
        this.validateAllVariables(touser);
        if (typeof msg.serial != 'undefined' && msg.serial) {
            msg.serial = null;
        }
        this.userSerial[touser]++;
        console.log('USER s.n ' + this.userSerial[touser] + ' user ' + touser);
        msg.userSerial = this.userSerial[touser];
        this.userAdapterMustData[touser][msg.userSerial] = {type: 'broadcastToAll', m: msg};
        this.sendUser(msg, touser);
        //TODO need to fix following
        ioStorage.dataUserAdapterMustData({type: 'broadcastToAll', user: wbUser.id, m: msg}, touser + '_' + msg.userSerial);
    },

    sendUser: function (msg, touser) {
        "use strict";
        var cfun = 'broadcastToAll';
        io.send(msg, cfun, touser);
        //
        //if(io.sock != null && io.sock.readyState == 1){
        //    if (touser) {
        //        touser = io.uniquesids[touser];
        //        if(touser == 'undefined' || typeof touser == 'undefined'){
        //            console.log("Couldn't send packet, " + touser + " " + " is not connected.");
        //        } else {
        //            io.send(msg, cfun, touser);
        //        }
        //    }
        //} else {
        //    console.log('Socket is not created.');
        //}
    },

    sendBinary: function (msg) {
        "use strict";
        io.sendBinary(msg);
        ioStorage.dataBinaryStore(msg)
    }
};