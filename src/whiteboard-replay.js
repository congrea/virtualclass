class WhiteboardReplay {
  init(wid) {
    this.objs = virtualclass.wb[wid].vcanMainReplayObjs;
    this.objNo = 0;
  }

  renderObj(wid) {
    const data = virtualclass.wbWrapper.protocol.decode(this.objs[this.objNo]);
    let eventType;
    let shape;
    let evt;
    switch (data.action) {
      case 'sp': // display / render shape, like, rectangle
        virtualclass.wb[wid].selectedTool = data.tool;
        eventType = data.event;
        shape = `${data.shape}Obj`;
        // mouseDown, mouseMove and mouseUp
        virtualclass.wb[wid][shape][eventType](data.actual, virtualclass.wb[wid]);
        break;
      case 'ac': // active all
        // todo innerMouseDown has to removed later
        if (data.event && (data.event === 'mousedown')) {
          virtualclass.wb[wid].innerToolbarHandler(virtualclass.wbWrapper.keyMap[data.action]);
        }

        console.log('====> whiteboard pdf ========================== before active', data.actual.x, data.actual.y);

        evt = virtualclass.wbWrapper.util.readyMouseEvent(data.event, data.actual);
        virtualclass.wb[wid].canvas.upperCanvasEl.dispatchEvent(evt);
        break;
      case 'cr': // clear whiteboard
        virtualclass.wb[data.actual].clear();

      default:
        console.log('====> do nothing');
    }
  }

  replayInit(wId) {
    this.init(wId);
    this.renderObj(wId);
  }

  replayData(data, wId) {
    virtualclass.wb[wId].vcanMainReplayObjs = [];
    if (data.length > 0) {
      virtualclass.wb[wId].vcanMainReplayObjs = data;
      this.replayInit(wId);
    }
  }
}