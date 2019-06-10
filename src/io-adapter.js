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

    if (this.sendWithDelayIdentifier.hasOwnProperty(uniqueIdentifier) && ioAdapter.sendWithDelayIdentifier[uniqueIdentifier]) {
      // console.log ("Cancelling send " + sendFunction + " message " + JSON.stringify(msg));
      console.log(`Cancelling send ${sendFunction} message ${msg.cf}`);
      clearTimeout(ioAdapter.sendWithDelayIdentifier[uniqueIdentifier]);
      ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = 0;
    }

    ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = setTimeout(() => {
      console.log(`Sending With Delay ${sendFunction} message ${msg.cf}`);
      ioAdapter[sendFunction](msg);
      ioAdapter.sendWithDelayIdentifier[uniqueIdentifier] = 0;
    }, delay);
  },

  mustSend(msg) {
    this.serial++;
    msg.serial = this.serial;
    this.adapterMustData[this.serial] = { type: 'broadcast', m: msg };
    this.send(msg);
    ioStorage.dataAdapterStore({ type: 'broadcast', user: wbUser.id, m: msg }, this.serial);
  },

  send(msg) {
    const cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
    // console.log('Packet sending');
    io.send(msg, cfun, null);
  },

  mustSendAll(msg) {
    // var orisend = JSON.parse(JSON.stringify(msg));
    this.mustSendUser(msg, virtualclass.gObj.uid);
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
    // debugger;


    this.validateAllVariables(touser);
    if (typeof msg.serial !== 'undefined' && msg.serial) {
      msg.serial = null;
    }
    this.userSerial[touser]++;
    console.log(`USER s.n ${this.userSerial[touser]} user ${touser}`);
    msg.userSerial = this.userSerial[touser];
    this.userAdapterMustData[touser][msg.userSerial] = { type: 'broadcastToAll', m: msg };
    this.sendUser(msg, touser);
    // TODO need to fix following
    ioStorage.dataUserAdapterMustData({
      type: 'broadcastToAll',
      user: wbUser.id,
      m: msg,
    }, `${touser}_${msg.userSerial}`);
  },

  sendUser(msg, touser) {
    const cfun = 'broadcastToAll';
    io.send(msg, cfun, touser);
  },

  sendPing(time) {
    const cfun = 'ping';
    io.send(time, cfun);
  },

  sendSpeed(msg) {
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
    if (!virtualclass.isPlayMode && virtualclass.settings.recording.enableRecording) {
      const sendData = virtualclass.settings.recording.sendYesOrNo();
      const obj = {
        cfun: 'recording',
        arg: { msg: sendData },
      };
      io.realSend(obj);
      console.log(`==== Send Recording a/v ${sendData}`);
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
    if (virtualclass.isPlayMode) {
      return;
    }
    const localSession = localStorage.getItem('serverSession');
    if (localSession === null) {
      localStorage.setItem('serverSession', session);
    } else if (localSession !== session) {
      io.readyToSend = true;
      workerIO.postMessage({ cmd: 'readyToSend' });
      this.setSession(localSession);
    }
    io.sessionSet = true;
  },

  sync(msg) {
    const cfun = 'broadcastToAll'; // BroadcastToALl (Do not send to self)
    io.send(msg, cfun, null);
  },
};
