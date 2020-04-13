class WhiteboardMessage {
  send(data) {
    if (roles.hasControls()) {
      console.log('sending the data here guys ', JSON.stringify(data));
      console.log('====> free drawing ', JSON.stringify(data));
      ioAdapter.mustSend(data);
      if (data.wb[0].substring(0, 2) === 'sf') {
        virtualclass.wbWrapper.util.storeAtMemory(data.wb, virtualclass.gObj.currWb, data.v);
      } else {
        virtualclass.wbWrapper.util.storeAtMemory(data.wb, virtualclass.gObj.currWb);
      }
    }
  }

  onMessage(e) {
    const whiteboardShape = e.message.wb[0].substring(0, 2);
    if (whiteboardShape === 'sf') { // free drawing packet
      const fromUserRole = e.fromUser.role;
      const result = virtualclass.wbWrapper.protocol.generateFreeDrawingData(e.message.v, e.message.s, true);
      let event;
      for (let i = 0; i < result.length; i += 1) {
        event = { message: { wb: result[i] }, fromUser: { role: fromUserRole } };
        this.onMessage(event);
      }
    } else {
      if (!Array.isArray(e.message.wb)) e.message.wb = [e.message.wb];
      const executeData = e.message.wb;
      virtualclass.vutil.storeWhiteboardAtInlineMemory(e.message.wb);
      if (!virtualclass.zoom.canvasScale) return;
      if (virtualclass.gObj.currWb && typeof virtualclass.wb[virtualclass.gObj.currWb] === 'object'
        && e.fromUser.role === 't') {
        virtualclass.wbWrapper.util.applyCommand(executeData, virtualclass.gObj.currWb);
      }
    }
  }

  optimizeToSend(data, time, type) {
    virtualclass.wbWrapper.gObj.previousData = data;
    virtualclass.wbWrapper.gObj.presentSendDataTime = new Date().getTime();
    const timeDifference = (virtualclass.wbWrapper.gObj.presentSendDataTime - virtualclass.wbWrapper.gObj.lastSentDataTime);
    if (timeDifference >= time) {
      if (type) {
        const newData = virtualclass.wbWrapper.protocol.encode(type, data);
        this.send(newData);
      }
      virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
      if (type === 'sf') {
        // empty the free drarwing after bulk
        virtualclass.wb[virtualclass.gObj.currWb].freeDrawingObj.chunks.length = 0;
      }
    }
  }
}