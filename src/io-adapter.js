var ioAdapter = {
    adapterMustData: [], // It contains all data that is must for all users to have
    serial: -1, // It is serial number of sent packet, normally set to current number
    //TODO - Store to IndexDB

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
        this.sendUser(msg, touser);
    },

    sendUser: function (msg, touser) {
        "use strict";
        var cfun = 'broadcastToAll';
        io.send(msg, cfun, touser);
    },

    sendBinary: function (msg) {
        "use strict";
        io.sendBinary(msg);
        ioStorage.dataBinaryStore(msg)
    }
};