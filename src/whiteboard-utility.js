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

  closeTray() {
   // this.selectedTool = null;
    const elem = document.querySelector(`#commandToolsWrapper${virtualclass.gObj.currWb} .openTray`);
    if (elem) elem.classList.remove('openTray')
  }

  openTray(elem) {
    // this.selectedTool = null;
    if (elem) elem.classList.add('openTray');
  }

  handleTrayDisplay(element) {
    if (element.classList.contains('openTray')) {
      this.selectedTool = null;
      virtualclass.wbWrapper.util.closeTray();
    } else {
      virtualclass.wbWrapper.util.openTray(element);
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

  deleteActiveObject(event){
    const whitebaord = virtualclass.wb[virtualclass.gObj.currWb];
    whitebaord.canvas.remove(whitebaord.canvas.getActiveObject());
    if (event) {
      const encodeData = virtualclass.wbWrapper.protocol.encode('da', virtualclass.gObj.currWb);
      virtualclass.wbWrapper.msg.send(encodeData);
    }
  }

  initActiveElement(selector, tool) {
    const elem = document.querySelector(selector);
    if (typeof virtualclass.gObj.wbTool[virtualclass.gObj.currWb] === 'undefined') {
      virtualclass.gObj.wbTool[virtualclass.gObj.currWb] = {};
    }
    if (typeof virtualclass.gObj.wbTool[virtualclass.gObj.currWb][tool.type] === 'undefined') {
      elem.addEventListener('click', this.activeElementHandler.bind(this, tool));
      virtualclass.gObj.wbTool[virtualclass.gObj.currWb][tool.type] = true;
    }
  }

  activeElementHandler(tool, ev) {
    // console.log('many times clicked');
    this.activeElement(ev, tool);
  }

  activeElement(ev, tool) {
    const prevSelectedTool = document.querySelector(`#t_${tool.type}${virtualclass.gObj.currWb} .selected`);
    if (prevSelectedTool != null) {
      prevSelectedTool.classList.remove('selected');
    }

    const currElementValue = ev.target.dataset[tool.prop];
    if (currElementValue != null) {
      ev.target.classList.add('selected');
      this.changeToolProperty(tool.type, currElementValue);
      if (tool.type === 'color') {
        document.querySelector(`#t_color${virtualclass.gObj.currWb} .disActiveColor`).style.backgroundColor = virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
      }
      const encodeData = virtualclass.wbWrapper.protocol.encode('ot', {type: tool.type, value : currElementValue});
      virtualclass.wbWrapper.msg.send(encodeData);
    }
  }

  changeToolProperty(attr, value) { //
    if (attr === 'color') {
      virtualclass.wb[virtualclass.gObj.currWb].activeToolColor = value;
    } else if (attr === 'strk') {
      virtualclass.wb[virtualclass.gObj.currWb].currStrkSize = value;
    } else if (attr === 'font') {
      virtualclass.wb[virtualclass.gObj.currWb].textFontSize = value;
    }

    // const currTime = new Date().getTime();
    // let selectElem;
    // let obj;
    // if (attr === 'color') {
    //   selectElem = document.querySelector(`#colorList${virtualclass.gObj.currWb} .selected`).id;
    //   virtualclass.wb[virtualclass.gObj.currWb].activeToolColor = value;
    //   document.querySelector(`#t_color${virtualclass.gObj.currWb} .disActiveColor`).style.backgroundColor = virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
    //   obj = { color: value, elem: selectElem, mt: currTime };
    // } else if (attr === 'strk') {
    //   selectElem = document.querySelector(`#t_strk${virtualclass.gObj.currWb} .selected`).id;
    //   virtualclass.wb[virtualclass.gObj.currWb].currStrkSize = value;
    //   obj = { strkSize: value, elem: selectElem, mt: currTime };
    // } else if (attr === 'font') {
    //   selectElem = document.querySelector(`#t_font${virtualclass.gObj.currWb} .selected`).id;
    //   virtualclass.wb[virtualclass.gObj.currWb].textFontSize = value;
    //   obj = { fontSize: value, elem: selectElem, mt: currTime };
    // }

    // const { vcan } = virtualclass.wb[virtualclass.gObj.currWb];
    // virtualclass.wb[virtualclass.gObj.currWb].uid++;
    // obj.uid = virtualclass.wb[virtualclass.gObj.currWb].uid;
    // vcan.main.replayObjs.push(obj);
    //virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' });
  }

  strokeSizeSelector(){
    const fontElement = document.querySelector(`#t_font${virtualclass.gObj.currWb}`);
    if (fontElement != null) {
      fontElement.classList.remove('show');
      fontElement.classList.add('hide');
    }

    const strokeElement = document.querySelector(`#t_strk${virtualclass.gObj.currWb}`);
    if (strokeElement != null) {
      strokeElement.classList.remove('hide');
      strokeElement.classList.add('show');
    }
  }

  fontSizeSelector(){
    const strokeElement = document.querySelector(`#t_strk${virtualclass.gObj.currWb}`);
    if (strokeElement != null) {
      strokeElement.classList.remove('show');
      strokeElement.classList.add('hide');
    }

    const fontElement = document.querySelector(`#t_font${virtualclass.gObj.currWb}`);
    if (fontElement != null) {
      fontElement.classList.remove('hide');
      fontElement.classList.add('show');
    }
  }
  
}