let myCount = 0;
class WhiteboardReplay {
  init(wid) {
    this.objs = virtualclass.wb[wid].vcanMainReplayObjs;
    this.objNo = 0;
  }

  renderObj(wid) {
    if (this.objs[this.objNo].cmd) {
      virtualclass.wb[wid].selectedTool = this.objs[this.objNo].cmd;
    } else {
      const eventType = virtualclass.wbWrapper.keyMap[this.objs[this.objNo].ac];
      const data = this.objs[this.objNo];
      virtualclass.wb[wid].rectangleObj[eventType](data, virtualclass.wb[wid]);
    }
  }
}

class WhiteboardUtility {
  // earlier it waas drawInWhiteboards
  applyCommand(data, wid) {
    // for (let i = 0; i < data.length; i += 1) {
    //   if (Object.prototype.hasOwnProperty.call(data[i], 'cmd')) {
    //     if (data[i].cmd === 'clearAll') {
    //       if (typeof virtualclass.wb !== 'object') {
    //         virtualclass.makeAppReady({ app: virtualclass.apps.wb });
    //       }
    //       virtualclass.wb[wid].response.clearAll(wid);
    //     } else {
    //       if (roles.hasControls()) {
    //         const tool = data[i].cmd.slice(2, data[i].cmd.length);
    //         const currentShapeTool = document.querySelector(`${'#' + 'tool_wrapper'}${wid}`);
    //         const shapesElem = document.querySelector(`#tool_wrapper${wid}.shapesToolbox`);
    //         if (tool === 'triangle' || tool === 'line' || tool === 'oval' || tool === 'rectangle') {
    //           document.querySelector(`#shapeIcon${wid} a`).dataset.title = tool.charAt(0).toUpperCase() + tool.slice(1);
    //           currentShapeTool.dataset.currtool = tool;
    //           shapesElem.classList.add('active');
    //         } else {
    //           document.querySelector(`#shapeIcon${wid} a`).dataset.title = 'Shapes';
    //           currentShapeTool.dataset.currtool = 'shapes';
    //           shapesElem.classList.remove('active');
    //         }
    //       }
    //     }
    //   } else if (Object.prototype.hasOwnProperty.call(data[i], 'shapeColor')) {
    //     virtualclass.wb[wid].shapeColor = data[i].shapeColor;
    //     if (roles.hasControls()) {
    //       document.querySelector(`#shapeColor${wid} .disActiveColor`).style.backgroundColor = virtualclass.wb[wid].shapeColor;
    //       virtualclass.wb[wid].utility.selectElem(`#shapeColor${wid}`, data[i].elem);
    //     }
    //   } else if (Object.prototype.hasOwnProperty.call(data[i], 'strokeSize')) {
    //     virtualclass.wb[wid].strokeSize = data[i].strokeSize;
    //     if (roles.hasControls()) {
    //       document.querySelector(`#strokeSize${wid} ul`).dataset.stroke = virtualclass.wb[wid].strokeSize;
    //       virtualclass.wb[wid].utility.selectElem(`#strokeSize${wid}`, data[i].elem);
    //     }
    //   } else if (Object.prototype.hasOwnProperty.call(data[i], 'fontSize')) {
    //     virtualclass.wb[wid].fontSize = data[i].fontSize;
    //     if (roles.hasControls()) {
    //       document.querySelector(`#fontSize${wid} ul`).dataset.font = virtualclass.wb[wid].fontSize;
    //       virtualclass.wb[wid].utility.selectElem(`#fontSize${wid}`, data[i].elem);
    //     }
    //   }
    //   virtualclass.wb[wid].uid = data[i].uid;
    //   this.executeData(data[i], wid);
    // }

    for (let i = 0; i < data.length; i += 1) {
      this.executeData(data[i], wid);
    }
  }

  executeData(data, wId) {
    if (!virtualclass.wb[wId].replayObjs) virtualclass.wb[wId].replayObjs = [];
    virtualclass.wb[wId].replayObjs.push(data);
    this.replayData([data], wId);
  }

  replayData(data, wId) {
    virtualclass.wb[wId].vcanMainReplayObjs = [];
    if (data.length > 0) {
      virtualclass.wb[wId].vcanMainReplayObjs = data;
      this.replayInit(wId);
    }
  }

  replayInit(wId) {
    virtualclass.wbWrapper.replay.init(wId);
    virtualclass.wbWrapper.replay.renderObj(wId);
  }

  sendWhiteboardData(data) {
    if (roles.hasControls()) {
      ioAdapter.mustSend(data);
    }
  }

  createFabricNewInstance(wId) {
    if (virtualclass.wb[wId].canvas && virtualclass.wb[wId].canvas.lowerCanvasEl) {
      virtualclass.wb[wId].canvas.dispose();
    }
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
    if (typeof (Storage) !== 'undefined') {
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

  fitWhiteboardAtScale(wId) {
    if (typeof virtualclass.wb[wId] === 'object') {
      // const { vcan } = virtualclass.wb[wId];
      // const objects = vcan.main.children;
      // const objects = virtualclass.wb[wId].canvas.getObjects();
      // if (objects.length > 0) {
      //   // console.log('====> FIT to screen 3 whiteboard ', wId);
      //   for (const i in objects) {
      //     const { scaleX } = objects[i];
      //     const { scaleY } = objects[i];
      //
      //     const left = objects[i].x;
      //     const top = objects[i].y;
      //
      //     const orginalX = left / objects[i].scaleX;
      //     const orginalY = top / objects[i].scaleY;
      //
      //     const tempScaleX = ((scaleX / virtualclass.zoom.prvCanvasScale) * virtualclass.zoom.canvasScale);
      //     const tempScaleY = ((scaleY / virtualclass.zoom.prvCanvasScale) * virtualclass.zoom.canvasScale);
      //
      //     const tempLeft = tempScaleX * orginalX;
      //     const tempTop = tempScaleY * orginalY;
      //
      //     objects[i].scaleX = tempScaleX;
      //     objects[i].scaleY = tempScaleY;
      //
      //     objects[i].x = tempLeft;
      //     objects[i].y = tempTop;
      //
      //     objects[i].setCoords();
      //     // console.log("## WHITEBOARD scaleX", objects[i].scaleX)
      //   }
      // }
      virtualclass.wb[wId].canvas.setZoom(virtualclass.wb[wId].canvas.getZoom() * virtualclass.gObj.SCALE_FACTOR);
      // canvas.setHeight(canvas.getHeight() * virtualclass.gObj.SCALE_FACTOR);
      // canvas.setWidth(canvas.getWidth() * virtualclass.gObj.SCALE_FACTOR);
      virtualclass.wb[wId].canvas.renderAll();
    }
  }
}

class WhiteboardShape {
  constructor(shape) {
    this.name = shape;
    this.coreObj = {
      angle: 0,
      selectable: false,
      fill: '#ffffff',
      stroke: '#0a0a0a',
      transparentCorners: false,
      width: 0,
      height: 0,
      strokeWidth: 2,
    };
  }

  mouseDown(event, whiteboard) {
    const pointer = whiteboard.canvas.getPointer(event);
    this.innerMouseDown(pointer, whiteboard);
    virtualclass.gObj.lastSendDataTime = new Date().getTime();
    // ioAdapter.mustSend({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
    virtualclass.wbWrapper.util.sendWhiteboardData({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
  }

  innerMouseDown(pointer, whiteboard) {
    this.mousedown = true;
    this.startLeft = pointer.x;
    this.startTop = pointer.y;
    this.coreObj.left = this.startLeft;
    this.coreObj.top = this.startTop;
    this.coreObj.width = 1;
    this.coreObj.height = 1;
    const toolName = virtualclass.wbWrapper.keyMap[this.name];
    this[this.name] = new fabric[toolName](this.coreObj);
    whiteboard.canvas.add(this[this.name]);
    myCount++;
    console.log('====> create whiteboard ', myCount);
    console.log('==== coordination down x, y ', pointer.x, pointer.y);
  }

  mouseMove() {
    // if (!this.mousedown) return;
  }

  mouseUp() {
    // this.mousedown = false;
    // this[this.name].setCoords();
    this.innerMouseUp();
    if (this.previousShape) {
      virtualclass.wbWrapper.util.sendWhiteboardData(this.previousShape);
      delete this.previousShape;
    }
    virtualclass.wbWrapper.util.sendWhiteboardData({ wb: [{ ac: 'u' }], cf: 'wb' });
    delete virtualclass.gObj.lastSendDataTime;
  }

  innerMouseUp() {
    this.mousedown = false;
    this[this.name].setCoords();
    myCount++;
    console.log('====> create whiteboard ', myCount);
  }
}


class WhiteboardRectangle extends WhiteboardShape {
  constructor(name) {
    super(name);
    this.name = name;
  }

  mouseMove(event, whiteboard) {
    const pointer = whiteboard.canvas.getPointer(event.e);
    this.innerMouseMove(pointer, whiteboard);
    if (!virtualclass.gObj.lastSendDataTime) {
      virtualclass.gObj.lastSendDataTime = new Date().getTime();
    }

    virtualclass.gObj.presentSendDataTime = new Date().getTime();

    const timeDifference = (virtualclass.gObj.presentSendDataTime - virtualclass.gObj.lastSendDataTime);
    console.log('====> total time difference ', timeDifference);
    const currentCordination = { wb: [{ ac: 'm', x: pointer.x, y: pointer.y }], cf: 'wb' };
    this.previousShape = currentCordination;
    if (timeDifference > 2000) { // Optmize the sending data
      virtualclass.wbWrapper.util.sendWhiteboardData(currentCordination);
      virtualclass.gObj.lastSendDataTime = virtualclass.gObj.presentSendDataTime;
      myCount++;
    }
  }

  innerMouseMove(pointer, whiteboard) {
    if (!this.mousedown) return;
    const newLeft = pointer.x;
    const newTop = pointer.y;
    const width = newLeft - this.startLeft;
    const height = newTop - this.startTop;

    if (width > 0) { // Draw from left to right
      this.rectangle.set('width', width);
    } else {
      this.rectangle.set('left', newLeft); // Draw from right to left
      this.rectangle.set('width', width * -1);
    }

    if (height > 0) {
      this.rectangle.set('height', height); // Draw from top to bottom
    } else {
      this.rectangle.set('top', newTop); // Draw from bottom to top
      this.rectangle.set('height', height * -1);
    }

    whiteboard.canvas.renderAll();
    console.log('====> create whiteboard ', myCount);
  }
}

class Whiteboard {
  constructor() {
    this.canvas = null;
    this.selectedTool = null;
    this.rectangleObj = new WhiteboardRectangle('rectangle');
    this.gObj = {};
  }

  init(id) {
    this.wbId = id;
    this.attachToolbarHandler(id);
    console.log('====> canvas id ', `canvas${id}`);
    virtualclass.wbWrapper.util.createFabricNewInstance(id);
    // this.attachMouseMovementHandlers();
  }

  attachToolbarHandler(id) {
    const allTools = document.querySelectorAll(`#commandToolsWrapper${id} .tool a`);
    for (let i = 0; i < allTools.length; i++) {
      allTools[i].addEventListener('click', this.toolbarHandler.bind(this));
    }
  }

  attachMouseMovementHandlers() {
    this.canvas.on('mouse:down', this.handlerMouseDown.bind(this));
    this.canvas.on('mouse:move', this.handlerMouseMove.bind(this));
    this.canvas.on('mouse:up', this.handlerMouseUp.bind(this));
  }

  removeMouseMovementHandlers() {
    this.canvas.off('mouse:down', this.handlerMouseDown);
    this.canvas.off('mouse:move', this.handlerMouseMove);
    this.canvas.off('mouse:up', this.handlerMouseUp);
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
  }

  handlerMouseDown(o) {
    if (this.selectedTool && this.selectedTool !== 'freeDrawing') {
      this.mousedown = true;
      this[`${this.selectedTool}Obj`].mouseDown(o, this);
    }
  }

  handlerMouseMove(o) {
    if (this.mousedown && this.selectedTool !== 'freeDrawing') { this[`${this.selectedTool}Obj`].mouseMove(o, this); }
  }

  handlerMouseUp(o) {
    if (this.selectedTool && this.selectedTool !== 'freeDrawing') this[`${this.selectedTool}Obj`].mouseUp(o, this);
    this.mousedown = false;
  }

  toolbarHandler(ev) {
    this.canvas.isDrawingMode = false;
    const currentTool = ev.currentTarget.parentNode.dataset.tool;
    this.selectedTool = currentTool;
    virtualclass.wbWrapper.util.sendWhiteboardData({ wb: [{ cmd: this.selectedTool }], cf: 'wb' });
    if (this.selectedTool !== 'rectangle' && this.selectedTool !== 'oval' && this.selectedTool !== 'triangle') {
      this[currentTool]();
    }
  }

  shapes() {
    this.selectedTool = null;
    const shapesElem = document.querySelector(`#shapes${this.wbId}`);
    if (shapesElem.classList.contains('open')) {
      shapesElem.classList.remove('open');
      shapesElem.classList.add('close');
    } else {
      if (shapesElem.classList.contains('close')) {
        shapesElem.classList.remove('close');
      }
      shapesElem.classList.add('open');
      virtualclass. vutil.closeElement(document.querySelector(`#t_strk${this.wbId} .strkSizeList`));
      virtualclass.vutil.closeElement(document.querySelector(`#t_font${this.wbId} .fontSizeList`));
    }
  }

  freeDrawing() {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 1;
  }
}
