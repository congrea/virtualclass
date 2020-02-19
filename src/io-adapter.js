var ioAdapter = {
  adapterMustData: [], // It contains all data that is must for all users to have
  serial: -1, // It is serial number of sent packet, normally set to current number
  userSerial: [], // It is serial number of sent packet to individual user
  userAdapterMustData: [], // It contains all data that is must for all users to have for individual users
  sendWithDelayIdentifier: {},
  // TODO - Store to IndexDB


  validateAllVariables(uid) {
    // debugger;


    if (typeof this.userSerial === 'undefined' || this.userSerial == null) {
      this.userSerial = [];
    }
    if (typeof this.userSerial[uid] === 'undefined') {
      this.userSerial[uid] = -1;
    }
    if (typeof this.userAdapterMustData === 'undefined' || this.userAdapterMustData == null) {
      this.userAdapterMustData = [];
    }
    if (typeof this.userAdapterMustData[uid] === 'undefined') {
      this.userAdapterMustData[uid] = [];
    }
  },

  /*
   Sends message after a delay.
   If we get more msgs from same uniqueIdentifier before it was sent,
   it would drop last msg and preserve latest message.
   */
  sendWithDelayAndDrop(msg, msgarg, sendFunction, uniqueIdentifier, delay) {
    if (msg == null || sendFunction == null) {
      return;
    }

    if (uniqueIdentifier == null) {
      uniqueIdentifier = 0;
    }
    if (delay == null) {
      delay = 1000;
    }

    if (Object.prototype.hasOwnProperty.call(this.sendWithDelayIdentifier, uniqueIdentifier) && ioAdapter.sendWithDelayIdentifier[uniqueIdentifier]) {
      // console.log ("Cancelling send " + sendFunction + " message " + JSON.stringify(msg));
      // console.log(`Cancelling send ${sendFunction} message ${msg.cf}`);
      clearTimeout(ioAdapter.sendWithDelayIdentifier[uniqueIdentifier]);
      ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = 0;
    }

    ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = setTimeout(() => {
      // console.log(`Sending With Delay ${sendFunction} message ${msg.cf}`);
      ioAdapter[sendFunction](msg);
      ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = 0;
    }, delay);
  },

  mustSend(msg) {
    if (!virtualclass.config.makeWebSocketReady) {
      return;
    }
    this.serial++;
    msg.serial = this.serial;
    this.adapterMustData[this.serial] = { type: 'broadcast', m: msg };
    this.send(msg);
    if (msg.cf && msg.cf === 'repObj') {
      // this is for storing the whiteboards data while unslecting and selecting the document
      virtualclass.vutil.storeWhiteboardAtInlineMemory(msg.repObj);
    }
  },

  send(msg) {
    if (!virtualclass.config.makeWebSocketReady) {
      return;
    }
    const cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
    // console.log('Packet sending');
    io.send(msg, cfun, null);
  },

  mustSendAll(msg) {
    if (!virtualclass.config.makeWebSocketReady) {
      return;
    }
    // var orisend = JSON.parse(JSON.stringify(msg));
    // const data = {
    //   m: msg,
    //   type: 'broadcastToAll',
    //   user: virtualclass.vutil.getUserAllInfo(virtualclass.gObj.uid, virtualclass.connectedUsers),
    //   userto: virtualclass.gObj.uid
    // }
    this.mustSendUser(msg, virtualclass.gObj.uid);
    // io.onRecJson(data);
    this.mustSend(msg);
  },

  // not using any where
  // sendAll: function (msg) {
  //    "use strict";
  //    var cfun = 'broadcast'; // Broadcast (send to self) - Editor
  //    io.send(msg, cfun, null);
  // },

  // TODO Function below still needs to have missing packets functionality
  mustSendUser(msg, touser) {
    if (!virtualclass.config.makeWebSocketReady) {
      return;
    }

    this.validateAllVariables(touser);
    if (typeof msg.serial !== 'undefined' && msg.serial) {
      msg.serial = null;
    }
    this.userSerial[touser]++;
    // console.log(`USER s.n ${this.userSerial[touser]} user ${touser}`);
    msg.userSerial = this.userSerial[touser];
    this.userAdapterMustData[touser][msg.userSerial] = { type: 'broadcastToAll', m: msg };
    this.sendUser(msg, touser);
  },

  sendUser(msg, touser) {
    if (!virtualclass.config.makeWebSocketReady) {
      return;
    }
    const cfun = 'broadcastToAll';
    io.send(msg, cfun, touser);
  },

  sendPing(time) {
    const cfun = 'ping';
    io.send(time, cfun);
  },

  sendSpeed(msg) {
    console.log('===send speed ', msg);
    ioAdapter.sendWithDelayAndDrop(msg, null, 'realSendSpeed', 'sendSpeed', 1000);
  },

  realSendSpeed(msg) {
    const cfun = 'speed';
    io.send(msg, cfun);
  },

  sendBinary(msg) {
    io.sendBinary(msg);
  },

  setRecording() {
    if (!virtualclass.isPlayMode && virtualclass.settings.info.enableRecording) {
      if (!roles.hasControls() && !virtualclass.settings.info.attendeerecording) {
        return; // Do not run when role is student and recording is disabled TODO (Validate this)
      }
      const sendData = virtualclass.settings.recording.sendYesOrNo();
      const obj = {
        cfun: 'recording',
        arg: { msg: sendData },
      };
      io.realSend(obj);
      io.recordingSet = true;
      // console.log(`==== Send Recording a/v ${sendData}`);
    }
  },

  setSession(session) { // Recording Session
    const obj = {
      cfun: 'session',
      arg: { msg: session }, // My session
    };
    io.realSend(obj);
  },

  initSetSession(session) {
    const localSession = localStorage.getItem('mySession');
    if (localSession === null) {
      console.log('====> hi helllo 1 set session');
      localStorage.setItem('mySession', session);
      io.sessionSet = true;
    } else if (localSession !== session) {
      this.setSession(localSession);
    } else {
      io.sessionSet = true;
    }
  },

  sync(msg) {
    const cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
    io.send(msg, cfun, null);
  },
};
