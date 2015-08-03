var ioAdapter = {

    adapterMustData : [], // It contains all data that is must for all users to have
    serial : 0, // It is serial number of packet, normally set to corrent number
    //TODO - Store adapterMustData and serial to IndexDB

    mustSend: function (msg) {
        "use strict";
        serial++;
        msg.serial = serial;
        adapterMustData[serial] = msg;
        this.send(msg);
    },

    send: function (msg) {
        "use strict";
        var cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
        io.send(msg, cfun, null);
        ioStorage.sendStore(msg, cfun);
    },

    mustSendAll: function (msg) {
        "use strict";

        if (msg.hasOwnProperty('eddata')) {
            if (msg.eddata != 'initVcEditor' && msg.eddata != 'virtualclass-editor-operation') {
                if (virtualclass.currApp == "EditorRich" || virtualclass.currApp == "editorRich") {
                    msg.et = 'editorRich';
                } else if (virtualclass.currApp == "EditorCode" || virtualclass.currApp == "editorCode") {
                    msg.et = 'editorCode';
                }
            }
        }

        this.sendAll(msg)
    },

    sendAll: function (msg) {
        "use strict";
        var cfun = 'broadcast'; // Broadcast (send to self) - Editor
        io.send(msg, cfun, null);
    },

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
    },

    /**
     * TODO
     * 1) Check if packet is missed, wait for one second and then request for missing packets
     * 2) If a request is already in queue, do not send more requests.
     * 3) Finally call, io.onRecMessage function when queue is normal (all missing packets received).
     */
    checkMissing : function () {

    }

};