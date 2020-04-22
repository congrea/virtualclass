
/**
 * This class is reponsible to draw each whiteboard packet
 * on participate side, on resizing, on page refresh and on recoding play
 * @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author Suman Bogati <http://www.vidyamantra.com>
 */

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
        console.log('====> selected id suman for  ', wid, virtualclass.wb[wid].selectedTool);
        eventType = data.event;
        shape = `${data.shape}Obj`;
        virtualclass.wb[wid][shape][eventType](data.actual, virtualclass.wb[wid]);
        break;
      case 'ac': // Active all
        virtualclass.wb[wid].selectedTool = data.tool;
        // todo innerMouseDown has to removed later
        if (data.event && (data.event === 'mousedown')) {
          virtualclass.wb[wid].innerToolbarHandler(virtualclass.wbWrapper.keyMap[data.action], wid);
        }
        evt = WhiteboardUtility.readyMouseEvent(data.event, data.actual);
        evt.wId = wid;
        virtualclass.wb[wid].canvas.upperCanvasEl.dispatchEvent(evt);
        if (data.event && (data.event === 'mousedown')) {
          let eventTypePrefix = virtualclass.wb[wid].canvas._getEventPrefix();
          fabric.util.removeListener(fabric.document, eventTypePrefix + 'move', virtualclass.wb[wid].canvas._onMouseMove, {'passive': false
          });
          fabric.util.removeListener(fabric.document, eventTypePrefix + 'up', virtualclass.wb[wid].canvas._onMouseUp, {'passive': false
          });
          fabric.util.addListener(virtualclass.wb[wid].canvas.upperCanvasEl, eventTypePrefix + 'move', virtualclass.wb[wid].canvas._onMouseMove, {'passive': false});

          fabric.util.addListener(virtualclass.wb[wid].canvas.upperCanvasEl, eventTypePrefix + 'up', virtualclass.wb[wid].canvas._onMouseUp, {'passive': false});

        }
        
        
        break;
      case 'cr': // Clear whiteboard
        virtualclass.wb[data.actual].clear();
        break;
      case 'ds': // Discard selection / Discard active object
        virtualclass.wb[data.actual].canvas.discardActiveObject();
        virtualclass.wb[data.actual].canvas.renderAll();
        break;
      case 'da': // Delete active object
        WhiteboardUtility.deleteActiveObject(false, wid);
        break;
      case 'ot': // other setting, font size, stroke size and color
        WhiteboardUtility.updateToolStyle(data.tool, data.actual.value, wid);
        break;

      case 'tx': // Create text
        virtualclass.wb[wid].selectedTool = data.tool;
        virtualclass.wb[wid].textObj.renderText(data.actual, virtualclass.wb[wid]);
        break;
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

  replayFromLocalStroage(allRepObjs, wId) {
    if (typeof (Storage) !== 'undefined') {
      virtualclass.wb[wId].clear(wId);
      virtualclass.wb[wId].replayObjs = [];
      delete virtualclass.wb[wId].strokeSize;
      delete virtualclass.wb[wId].toolColor;
      virtualclass.wb[wId].gObj.tempRepObjs = allRepObjs;
      if (allRepObjs.length > 0) this.triggerReplay(allRepObjs, wId);
    }
  }

  triggerReplay(data, wId) {
    for (let i = 0; i < data.length; i += 1) {
      WhiteboardUtility.storeAtMemory([data[i]], (wId));
      this.replayData([data[i]], wId);
    }
  }
}
