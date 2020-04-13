class WhiteboardReplay {
  init(wid) {
    this.objs = virtualclass.wb[wid].vcanMainReplayObjs;
    this.objNo = 0;
  }

  renderObj(wid) {
    const data = virtualclass.wbWrapper.protocol.decode(this.objs[this.objNo], wid);
    let eventType;
    let shape;
    let evt;
    switch (data.action) {
      case 'sp': // display/render/create shape, like, rectangle
        virtualclass.wb[wid].selectedTool = data.tool;
        eventType = data.event;
        shape = `${data.shape}Obj`;
        // mouseDown, mouseMove and mouseUp
        virtualclass.wb[wid][shape][eventType](data.actual, virtualclass.wb[wid]);
        break;
      case 'ac': // Active all
        virtualclass.wb[wid].selectedTool = data.tool;
        // todo innerMouseDown has to removed later
        if (data.event && (data.event === 'mousedown')) {
          virtualclass.wb[wid].innerToolbarHandler(virtualclass.wbWrapper.keyMap[data.action], wid);
        }
        evt = virtualclass.wbWrapper.util.readyMouseEvent(data.event, data.actual);
        evt.wId = wid;
        virtualclass.wb[wid].canvas.upperCanvasEl.dispatchEvent(evt);
        break;
      case 'cr': // Clear whiteboard
        virtualclass.wb[data.actual].clear();
        break;
      case 'ds': // Discard selection / Discard active object
        virtualclass.wb[data.actual].canvas.discardActiveObject();
        virtualclass.wb[data.actual].canvas.renderAll();
        break;
      case 'da': // Delete active object
        virtualclass.wbWrapper.util.deleteActiveObject();
        break;

      case 'ot': // other setting, font size, stroke size and color
        virtualclass.wbWrapper.util.changeToolProperty(data.tool, data.actual.value, wid);
        break;

      case 'tx': // Create text
        virtualclass.wb[wid].selectedTool = data.tool;
        virtualclass.wb[wid].textObj.renderText(data.actual, virtualclass.wb[wid]);

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