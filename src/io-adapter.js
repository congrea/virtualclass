var ioAdapter = {

    adapterMustData: [], // It contains all data that is must for all users to have
    serial: -1, // It is serial number of sent packet, normally set to current number
    //TODO - Store to IndexDB

    mustSend: function (msg) {
        "use strict";
        this.serial++;
        console.log('s.n ' + this.serial);
        msg.serial = this.serial;
        this.adapterMustData[this.serial] = {type:'broadcast',m:msg};
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
        //TODO Move editor code below to right place
        if (msg.hasOwnProperty('eddata')) {
            if (msg.eddata != 'initVcEditor' && msg.eddata != 'virtualclass-editor-operation') {
                if (virtualclass.currApp == "EditorRich" || virtualclass.currApp == "editorRich") {
                    msg.et = 'editorRich';
                } else if (virtualclass.currApp == "EditorCode" || virtualclass.currApp == "editorCode") {
                    msg.et = 'editorCode';
                }
            }

            //this.sendAll(msg);
            //virtualclass[msg.et].vcAdapter.teacherAck(msg); // mannual acknowledgement
            //return;
        }

        //this.serial++;
        //console.log('ed serial ' + ioAdapter.serial);
        //msg.serial = ioAdapter.serial;
        //this.adapterMustData[this.serial] = {type:'broadcast',m:msg};
        this.sendAll(msg);
        //ioStorage.dataAdapterStore({type: 'broadcastToAll', user: wbUser.id, m: msg}, this.serial);
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
    }
};