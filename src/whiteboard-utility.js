class WhiteboardUtility {
  // earlier it waas drawInWhiteboards
  applyCommand(data, wid) {
    for (let i = 0; i < data.length; i += 1) {
      this.executeData(data[i], wid);
    }
  }

  // executeWhiteboardData
  executeData(data, wId) {
    this.storeAtMemory(data, (wId));
    virtualclass.wbWrapper.replay.replayData([data], wId);
  }

  storeAtMemory(data, wId, freeDrawing) {
    if (!virtualclass.wb[wId].replayObjs) virtualclass.wb[wId].replayObjs = [];
    let toBeSendData;
    if (freeDrawing) {
      toBeSendData = virtualclass.wbWrapper.protocol.generateFreeDrawingData(freeDrawing);
    } else {
      toBeSendData = data;
    }
    if (Array.isArray(data)) {
      for (let i = 0; i < toBeSendData.length; i += 1) {
        virtualclass.wb[wId].replayObjs.push(toBeSendData[i]);
      }
    } else {
      virtualclass.wb[wId].replayObjs.push(data);
    }
  }

  createFabricNewInstance(wId) {
    if (virtualclass.wb[wId].canvas && virtualclass.wb[wId].canvas.upperCanvasEl) {
      virtualclass.wb[wId].canvas.dispose();
    }
    delete virtualclass.wb[wId].canvas;
    virtualclass.wb[wId].canvas = new fabric.Canvas(`canvas${wId}`, { selection: false });
    virtualclass.wb[wId].attachMouseMovementHandlers();
    this.createCanvasPdfInstance(wId, virtualclass.wb[wId].canvas.upperCanvasEl);
  }

  createCanvasPdfInstance(wId, mainCanvas) {
    const canvasPdf = document.createElement('canvas');
    canvasPdf.id = `canvas${wId}_pdf`;
    canvasPdf.className = 'pdfs';
    canvasPdf.width = mainCanvas.width;
    canvasPdf.height = mainCanvas.height;

    mainCanvas.parentNode.insertBefore(canvasPdf, mainCanvas);
    // virtualclass.vutil.insertAfter(canvasPdf, mainCanvas);
  }

  replayFromLocalStroage(allRepObjs, wid) {
     console.log('====> whiteboard pdf suman draw whiteboard')
    if (typeof (Storage) !== 'undefined') {
      virtualclass.wb[wid].clear(wid);
      virtualclass.wb[wid].replayObjs = [];
      virtualclass.wb[wid].gObj.tempRepObjs = allRepObjs;
      if (allRepObjs.length > 0) {
        this.applyCommand(allRepObjs, wid);
      }

      // Todo, this is need to be re-enable
      // if (roles.hasControls()) {
      //   const fontTool = document.querySelector(`#t_font${wid}`);
      //   const strkTool = document.querySelector(`#t_strk${wid}`);
      //   if (virtualclass.wb[wid].tool.cmd === `t_text${wid}`) {
      //     if (fontTool.classList.contains('hide')) {
      //       fontTool.classList.remove('hide');
      //       fontTool.classList.add('show');
      //     }
      //     strkTool.classList.add('hide');
      //   } else if (!fontTool.classList.contains('hide')) {
      //     fontTool.classList.add('hide');
      //   }
      // }
    }
  }

  fitWhiteboardAtScale(wid) {
    console.log('====> canvas set zoom scale ', virtualclass.zoom.canvasScale);
    virtualclass.wb[wid].canvas.setZoom(virtualclass.zoom.canvasScale);
    if (typeof virtualclass.wb[wid] === 'object') {
      delete virtualclass.wb[wid].myPencil;
      if (virtualclass.wb[wid].replayObjs && virtualclass.wb[wid].replayObjs.length > 0) {
        this.replayFromLocalStroage(virtualclass.wb[wid].replayObjs, wid);
      }
    }
    // virtualclass.wb[wId].canvas.renderAll();
  }

  readyMouseEvent(event, pointer) {
    return new MouseEvent(event, {
      clientX: pointer.x,
      clientY: pointer.y,
      buttons: 1,
      bubbles: true,
      which: 1,
      composed: true,
    });
  }

  closeShapeContainer(elem) {
    this.selectedTool = null;
    const shapeContainer = elem ? elem : document.querySelector(`#shapes${virtualclass.gObj.currWb}`);
    if (shapeContainer) {
      shapeContainer.classList.remove('open');
      shapeContainer.classList.add('close');
    }
  }

  openShapeContainer(elem) {
    this.selectedTool = null;
    const shapeContainer = elem ? elem : document.querySelector(`#shapes${virtualclass.gObj.currWb}`);
    if (shapeContainer) {
      shapeContainer.classList.remove('close');
      shapeContainer.classList.add('open');
    }
  }
}