let myCount = 0;
class WhiteboardReplay {
  init(wid) {
    this.objs = virtualclass.wb[wid].vcanMainReplayObjs;
    this.objNo = 0;
  }

  renderObj(wid) {
    // if (this.objs[this.objNo].cmd) {
    //   virtualclass.wb[wid].selectedTool = this.objs[this.objNo].cmd;
    // } else {
    //   const eventType = virtualclass.wbWrapper.keyMap[this.objs[this.objNo].ac];
    //   const data = this.objs[this.objNo];
    //   virtualclass.wb[wid].rectangleObj[eventType](data, virtualclass.wb[wid]);
    // }

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
}

// This class is to handle the selection of object with mouse down, move, and up
class ActiveAll {
  generateData(event, whiteboard, type) {
    const pointer = whiteboard.canvas.getPointer(event, true);
    const newData = {
      event: type,
      x: pointer.x,
      y: pointer.y,
    };
    // console.log('====> mouse active all ', JSON.stringify(newData));
    return virtualclass.wbWrapper.protocol.encode('ac', newData);
  }

  enable(wId) {
    const allObjects = virtualclass.wb[wId].canvas.getObjects();
    for (let i = 0; i < allObjects.length; i += 1) {
      allObjects[i].set('selectable', true);
    }
  }

  disable(wId) {
    const allObjects = virtualclass.wb[wId].canvas.getObjects();
    for (let i = 0; i < allObjects.length; i += 1) {
      allObjects[i].set('selectable', false);
    }
  }

  mouseDown(event, whiteboard) {
    const myPointer = whiteboard.canvas.getPointer(event, true)
    console.log('====> whiteboard pdf ========================== active mouse trigger', myPointer.x, myPointer.y);
    console.log('==== convert actives all mouse down', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    this.down = true;
    if (this.activeDown) {
      virtualclass.gObj.lastSendDataTime = virtualclass.gObj.presentSendDataTime = new Date().getTime();
    }
    const newData = this.generateData(event, whiteboard, 'd');
    this.previousActiveData = newData;
    console.log('====> mouse ac down for activeness ', JSON.stringify(newData));
    virtualclass.wbWrapper.util.sendWhiteboardData(newData);
  }

  mouseMove(event, whiteboard) {
    const myPointer = whiteboard.canvas.getPointer(event, true);
    console.log('==== actives all mouse move', myPointer.x, myPointer.y, ' orginal x, y', event.e.clientX, event.e.clientY);
    if (!event.e.isTrusted) return;
    // console.log('====> shoud not invoke');
    if (this.activeDown && this.down) {
      // whiteboard.canvas.renderAll();
      const newData = this.generateData(event, whiteboard, 'm')
      virtualclass.gObj.presentSendDataTime = new Date().getTime();
      this.previousActiveData = newData;
      const timeDifference = (virtualclass.gObj.presentSendDataTime - virtualclass.gObj.lastSendDataTime);
      if (timeDifference > 2000) { // Optmize the sending data
        virtualclass.wbWrapper.util.sendWhiteboardData(newData);
        virtualclass.gObj.lastSendDataTime = virtualclass.gObj.presentSendDataTime;
      }
    }
  }

  mouseUp(event, whiteboard) {
    const myPointer = whiteboard.canvas.getPointer(event, true)
    console.log('==== actives all mouse up', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    console.log('====> shoud not invoke');
    if (this.activeDown && this.down) {
      this.down = false;
      virtualclass.wbWrapper.util.sendWhiteboardData(this.previousActiveData);
      const newData = this.generateData(event, whiteboard, 'u');
      virtualclass.wbWrapper.util.sendWhiteboardData(newData);
    }
  }
}

// This class is to handle the utility functions of whiteboard
class WhiteboardUtility {
  // earlier it waas drawInWhiteboards
  initArrowImage() {
    if (!this.arrImg) {
      this.arrImg = new Image();
      this.arrImg.src = 'https://cdn.congrea.net/resources/images/arrow.png';
      this.arrImgDraw = false;
      this.arrImg.onload = function () {
        this.arrImgDraw = true;
      };
    }
  }

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

  // executeWhiteboardData
  executeData(data, wId) {
    this.storeAtMemory(data, (wId));
    this.replayData([data], wId);
  }

  storeAtMemory(data, wId, freeDrawing) {
    if (!virtualclass.wb[wId].replayObjs) virtualclass.wb[wId].replayObjs = [];
    if (freeDrawing) {
      const freeDrawingData = virtualclass.wbWrapper.protocol.generateFreeDrawingData(freeDrawing);
      for (let i = 0; i < freeDrawingData.length; i += 1) {
        virtualclass.wb[wId].replayObjs.push(freeDrawingData[i]);
      }
    } else {
      virtualclass.wb[wId].replayObjs.push(data);
    }
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
      console.log('sending the data here guys ', JSON.stringify(data));
      console.log('====> free drawing ', JSON.stringify(data));
      ioAdapter.mustSend(data);
      if (data.wb[0].substring(0, 2) === 'sf') {
        this.storeAtMemory(data.wb, virtualclass.gObj.currWb, data.v);
      } else {
        this.storeAtMemory(data.wb, virtualclass.gObj.currWb);
      }
    }
  }

  sendArrow(msg) {
    const time = 100;
    if (!this.lastarrowtime) {
      this.lastarrowtime = new Date().getTime();
    }
    this.presentarrowtime = new Date().getTime();
    if (((this.presentarrowtime - this.lastarrowtime) >= time) && !virtualclass.wb[virtualclass.gObj.currWb].mousedown) {
      console.log('====> creating arrow ', JSON.stringify(msg));
      ioAdapter.send(msg);
      this.lastarrowtime = new Date().getTime();
    }
  }

  createFabricNewInstance(wId) {
    if (virtualclass.wb[wId].canvas && virtualclass.wb[wId].canvas.lowerCanvasEl) {
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
    if (typeof virtualclass.wb[wid] === 'object' && virtualclass.wb[wid].replayObjs
      && virtualclass.wb[wid].replayObjs.length > 0) {
      this.replayFromLocalStroage(virtualclass.wb[wid].replayObjs, wid);
    }
    // virtualclass.wb[wId].canvas.renderAll();
  }

  handleGetPointer(event, whiteboard){
    const pointer = whiteboard.canvas.getPointer(event, true);
    return pointer;
  }

  onMessage(e) {
    const whiteboardShape = e.message.wb[0].substring(0, 2);
    if (whiteboardShape === 'sf') {
      const fromUserRole = e.fromUser.role;
      const result = virtualclass.wbWrapper.protocol.generateFreeDrawingData(e.message.v, e.message.s, true);
      let event;
      for (let i = 0; i < result.length; i += 1) {
        event = { message: { wb: result[i] },  fromUser: { role : fromUserRole} };
        this.onMessage(event);
      }
    } else {
      const executeData = e.message.wb;
      virtualclass.vutil.storeWhiteboardAtInlineMemory(e.message.wb);
      if (!virtualclass.zoom.canvasScale) return;
      if (virtualclass.gObj.currWb && typeof virtualclass.wb[virtualclass.gObj.currWb] === 'object'
        && e.fromUser.role === 't') {
        virtualclass.wbWrapper.util.applyCommand(executeData, virtualclass.gObj.currWb);
      }
    }
  }

  handleArrow(event) {
    const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
    const pointer = whiteboard.canvas.getPointer(event, true);
    const afterChange = virtualclass.wbWrapper.protocol.changeWithScale('divide', pointer);
    this.sendArrow({ msg: `${afterChange.x}_${afterChange.y}`, cf: 'ca' });
  }

  onArrowMessageReceived(message) {
    const pointer = {};
    const dataArr = message.msg.split('_');
    pointer.x = dataArr[0];
    pointer.y = dataArr[1];
    this.createArrow(pointer);
  }

  createArrow(eMessage) {
    const wid = virtualclass.gObj.currWb;
    console.log('====> creating arrow before scale ', eMessage.x, eMessage.y);
    const obj = { x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale };
    console.log('====> whiteboard pdf create mouse mouse', obj.x, obj.y);

    virtualclass.posY = (obj.y);
    virtualclass.posX = (obj.x);

    // console.log('vm mouse cursor y=' + (virtualclass.posY));

    this.drawArrowImage(obj, wid);


    if (virtualclass.pdfRender[wid].scroll.Y != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ y: virtualclass.posY }, 'Y', virtualclass.posY);
    }

    if (virtualclass.pdfRender[wid].scroll.X != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ x: virtualclass.posX }, 'X', virtualclass.posX);
    }
    // console.log('Mouse cursor x=' + obj.mp.x  + ' y=' + obj.mp.y);
  }

  drawArrowImage(obj, wId) {
    const img = this.arrImg;
    const ctx = virtualclass.wb[wId].canvas.getContext('2d');
    ctx.clearRect(0, 0, virtualclass.wb[wId].canvas.width, virtualclass.wb[wId].canvas.height);
    virtualclass.wb[wId].canvas.renderAll();
    ctx.save();
    ctx.beginPath();
    ctx.translate(obj.x, obj.y);
    ctx.drawImage(img, -3, -3, 18, 24);
    ctx.closePath();
    ctx.restore();
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
}

// This class is responsible to create various shapes, eg:, rectangle, oval and triangle
class WhiteboardShape {
  constructor(shape) {
    this.name = shape;
    this.coreObj = {
      angle: 0,
      selectable: false,
      fill: 'none',
      stroke: '#0a0a0a',
      transparentCorners: false,
      width: 0,
      height: 0,
      strokeWidth: 1,
      backgroundColor: 'transparent',
    };
  }

  mouseDown(pointer, whiteboard, event) {
    if (this.name === 'freeDrawing') {
      whiteboard.canvas.freeDrawingBrush.width = this.coreObj.strokeWidth * virtualclass.zoom.canvasScale;

      this.mousedown = true;
      virtualclass.gObj.startTime = new Date().getTime();
      this.chunks.push(`${pointer.x}_${pointer.y}_d`);
      console.log('====> actual x, y sendin =============FREE DRAWING==== before scale ', pointer.x, pointer.y);
    } else {
      virtualclass.gObj.lastSendDataTime = new Date().getTime();
      // ioAdapter.mustSend({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
      const newData = {
        event: 'd',
        name: this.name,
        x: pointer.x,
        y: pointer.y,
      };
      const data = virtualclass.wbWrapper.protocol.encode('sp', newData);
      virtualclass.wbWrapper.util.sendWhiteboardData(data);
    }
    this.innerMouseDown(pointer, whiteboard, event);
    this.previousShape = pointer;
  }

  innerMouseDown(pointer, whiteboard, event) {
    this.mousedown = true;
    if (this.name === 'freeDrawing') {
      whiteboard.canvas.freeDrawingBrush.width = this.coreObj.strokeWidth * virtualclass.zoom.canvasScale;
      // if (actualEvent) return;
      const cwhiteboard = whiteboard;
      // cwhiteboard.canvas.isDrawingMode = true;
      // const event = virtualclass.wbWrapper.util.readyMouseEvent('mousedown', pointer);
      // whiteboard.canvas.upperCanvasEl.dispatchEvent(event);
      console.log('====> free drawing mousedown', JSON.stringify(pointer));
      if (!whiteboard.myPencil) {
        whiteboard.myPencil = new fabric.PencilBrush(whiteboard.canvas);
      }

      if (event) {
        whiteboard.myPencil.onMouseDown(pointer, event);
      } else {
        const mevent = virtualclass.wbWrapper.util.readyMouseEvent('mousedown', pointer);
        whiteboard.canvas.fire('mouse:down', { e: mevent, target: null});
        // whiteboard.myPencil.onMouseDown(pointer);
      }
    } else {
      this.startLeft = pointer.x;
      this.startTop = pointer.y;
      this.coreObj.left = this.startLeft;
      this.coreObj.top = this.startTop;
      this.coreObj.width = 1;
      this.coreObj.height = 1;
      this.coreObj.rotatingPointOffset = 40 * virtualclass.zoom.canvasScale;
      this.coreObj.cornerSize = 13 * virtualclass.zoom.canvasScale;
      this.coreObj.strokeWidth = 1 * virtualclass.zoom.canvasScale;
      const toolName = virtualclass.wbWrapper.keyMap[this.name];
      this[this.name] = new fabric[toolName](this.coreObj); // add object
      whiteboard.canvas.add(this[this.name]);
      myCount++;
    }
    console.log('====> create whiteboard ', myCount);
    console.log('==== coordination down x, y ', pointer.x, pointer.y);
  }

  mouseMove() {
    // if (!this.mousedown) return;
  }

  mouseUp(pointer, whiteboard, event) {
    // this.mousedown = false;
    // this[this.name].setCoords();
    if (this.name === 'freeDrawing') {
      if (this.previousShape) {
        virtualclass.gObj.startTime = new Date().getTime();
        // this.chunks.push(`${this.previousShape.x}_${this.previousShape.y}_m`);
        // this.chunks.push(`${this.previousShape.x}_${this.previousShape.y+0.5}_m`);
        // this.chunks.push(`${this.previousShape.x}_${this.previousShape.y + 25}_m`);
        // this.chunks.push(`${this.previousShape.x}_${this.previousShape.y + 35}_m`);
        this.chunks.push(`${pointer.x}_${pointer.y}_u`);
        const data = virtualclass.wbWrapper.protocol.encode('sf', this.chunks);
        virtualclass.wbWrapper.util.sendWhiteboardData(data);
        this.chunks.length = 0;
      }
      this.mousedown = false;
      this.innerMouseUp(pointer, whiteboard, event);
    } else {
      if (this.previousShape) {
        let data = virtualclass.wbWrapper.protocol.encode('sp', this.previousShape);
        virtualclass.wbWrapper.util.sendWhiteboardData(data);
        const newData = {
          event: 'u',
          name: this.name,
          x: this.previousShape.x,
          y: this.previousShape.y,
        };
        data = virtualclass.wbWrapper.protocol.encode('sp', newData);
        virtualclass.wbWrapper.util.sendWhiteboardData(data);
        console.log('sending the data here guys ==== MOUSE UP', JSON.stringify(data));
        this.innerMouseUp(pointer, whiteboard, true);
      }
    }
    console.log(" DELETE==JAI ");
    delete this.previousShape;
    delete this.freeDrawPrevious;
    delete virtualclass.gObj.lastSendDataTime;
  }

  innerMouseUp (pointer, whiteboard, event) {
    this.mousedown = false;
    if (this.name !== 'freeDrawing') {
      this[this.name].setCoords();
    } else {
      // if (isTrusted) return true;
      console.log('====> free drawing up', JSON.stringify(pointer));
      // const eventMove = virtualclass.wbWrapper.util.readyMouseEvent('mousemove', pointer);
      // whiteboard.canvas.upperCanvasEl.dispatchEvent(eventMove);

      // whiteboard.canvas.upperCanvasEl.dispatchEvent(virtualclass.wbWrapper.util.readyMouseEvent('mouseup', pointer));
      if (event) {
        whiteboard.myPencil.onMouseUp(event);
      } else {
        // whiteboard.myPencil.onMouseUp(pointer);
        const mevent = virtualclass.wbWrapper.util.readyMouseEvent('mouseup', pointer);
        whiteboard.canvas.fire('mouse:up', { e: mevent, target: null});
      }

    }
  }
}

class WhiteboardFreeDrawing extends WhiteboardShape {
  constructor(name) {
    super(name);
    this.name = name;
    this.chunks = [];
  }

  innerMouseMove(pointer, whiteboard, event) {
    console.log('====> free drawing mousemove', JSON.stringify(pointer));
    // const event = virtualclass.wbWrapper.util.readyMouseEvent('mousemove', pointer);
    // whiteboard.canvas.upperCanvasEl.dispatchEvent(event);
    if (event) {
      whiteboard.myPencil.onMouseMove(pointer, event);
    } else {
      // whiteboard.myPencil.onMouseMove(pointer);
      const mevent = virtualclass.wbWrapper.util.readyMouseEvent('mousemove', pointer);
      whiteboard.canvas.fire('mouse:move', { e: mevent, target: null});
    }
  }

  mouseMove(pointer, whiteboard, event) {
    // this.chunks.push(`${pointer.x}_${pointer.y}`);
    virtualclass.gObj.currentTime = new Date().getTime();

    this.collectingData(pointer);
    const timeDifference = (virtualclass.gObj.currentTime - virtualclass.gObj.startTime);

    if (timeDifference > 3000) {
      const data = virtualclass.wbWrapper.protocol.encode('sf', this.chunks);
      // Club and send
      virtualclass.wbWrapper.util.sendWhiteboardData(data);
      // Club and send
      virtualclass.gObj.startTime = new Date().getTime();
      this.chunks.length = 0;
    }
    this.innerMouseMove(pointer, whiteboard, event);
  }

  collectingData(pointer) {
    const newData = {
      x: pointer.x,
      y: pointer.y,
    };

    if ((!this.freeDrawPrevious)
      || (((Math.abs(newData.x - this.freeDrawPrevious.x) > 1) || (Math.abs(newData.y - this.freeDrawPrevious.y) > 1)))) {
      this.freeDrawPrevious = newData;
      this.chunks.push(`${newData.x}_${newData.y}`);
      console.log('====> actual x, y sendin =============FREE DRAWING==== before scale ', newData.x, newData.y);
    }

    this.previousShape = newData;
  }
}

// This is responsible to create the whiteboard shape
class WhiteboardRectangle extends WhiteboardShape {
  constructor(name) {
    super(name);
    this.name = name;
  }

  mouseMove(pointer, whiteboard) {
    if (!virtualclass.gObj.lastSendDataTime) {
      virtualclass.gObj.lastSendDataTime = new Date().getTime();
    }

    const newData = {
      event: 'm',
      name: this.name,
      x: pointer.x,
      y: pointer.y,
    };

    this.previousShape = newData;
    virtualclass.gObj.presentSendDataTime = new Date().getTime();
    const timeDifference = (virtualclass.gObj.presentSendDataTime - virtualclass.gObj.lastSendDataTime);
    console.log('====> total time difference ', timeDifference);
    if (timeDifference > 2000) { // Optmize the sending data
      const data = virtualclass.wbWrapper.protocol.encode('sp', newData);
      virtualclass.wbWrapper.util.sendWhiteboardData(data);
      virtualclass.gObj.lastSendDataTime = virtualclass.gObj.presentSendDataTime;
      myCount++;
    }
    this.innerMouseMove(pointer, whiteboard);
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
    this.activeAllObj = new ActiveAll();
    this.freeDrawingObj = new WhiteboardFreeDrawing('freeDrawing');
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
    console.log('====> init whiteboard add ');
    this.canvas.on('selection:created', this.handlerSelection.bind(this));
    this.canvas.on('selection:cleared', this.handlerSelection.bind(this));
    this.canvas.on('mouse:down', this.handlerMouseDown.bind(this));
    this.canvas.on('mouse:move', this.handlerMouseMove.bind(this));
    this.canvas.on('mouse:up', this.handlerMouseUp.bind(this));
  }

  removeMouseMovementHandlers() {
    console.log('====> init whiteboard remove');
    this.canvas.off('mouse:down', this.handlerMouseDown);
    this.canvas.off('mouse:move', this.handlerMouseMove);
    this.canvas.off('mouse:up', this.handlerMouseUp);
    this.canvas.isDrawingMode = false;
    this.canvas.selection = false;
  }

  handlerSelection(event) {
    if (event.selected) {
      console.log('====> mouse down for activeness');
      this.activeAllObj.activeDown = true;
    } else if (event.deselected) {
      this.activeAllObj.activeDown = false;
    }
  }

  handlerMouseDown(o) {
    if (this.selectedTool) {
      this.mousedown = true;
      const pointer = virtualclass.wb[virtualclass.gObj.currWb].canvas.getPointer(o.e);

      this[`${this.selectedTool}Obj`].mouseDown(pointer, this, o);
    }
  }

  handlerMouseMove(o) {
    const pointer = virtualclass.wb[virtualclass.gObj.currWb].canvas.getPointer(o.e);
    if (this.mousedown && this.selectedTool) {
      this[`${this.selectedTool}Obj`].mouseMove(pointer, this, o);
    }
    virtualclass.wbWrapper.util.handleArrow(pointer);
  }

  handlerMouseUp(o) {
    const pointer = virtualclass.wb[virtualclass.gObj.currWb].canvas.getPointer(o.e);
    if (this.selectedTool) this[`${this.selectedTool}Obj`].mouseUp(pointer, this, o);
    this.mousedown = false;
  }

  toolbarHandler(ev) {
    // this.canvas.isDrawingMode = false;
    // const currentTool = ev.currentTarget.parentNode.dataset.tool;
    // this.selectedTool = currentTool;
    // // virtualclass.wbWrapper.util.sendWhiteboardData({ wb: [{ cmd: this.selectedTool }], cf: 'wb' });
    // if (this.selectedTool !== 'rectangle' && this.selectedTool !== 'oval' && this.selectedTool !== 'triangle') {
    //   this[currentTool]();
    // } else {
    //   this.activeAllObj.disable(virtualclass.gObj.currWb);
    // }
    this.innerToolbarHandler(ev.currentTarget.parentNode.dataset.tool);
  }

  innerToolbarHandler(tool) {
    this.canvas.isDrawingMode = false;
    const currentTool = tool;
    this.selectedTool = currentTool;
    if (this.selectedTool !== 'rectangle' && this.selectedTool !== 'oval' && this.selectedTool !== 'triangle') {
      this[currentTool]();
    } else {
      this.activeAllObj.disable(virtualclass.gObj.currWb);
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
      virtualclass.vutil.closeElement(document.querySelector(`#t_strk${this.wbId} .strkSizeList`));
      virtualclass.vutil.closeElement(document.querySelector(`#t_font${this.wbId} .fontSizeList`));
    }
  }

  freeDrawing() {
    this.canvas.isDrawingMode = false;
    // this.isDrawingMode = true;
  }

  activeAll() {
    this.activeAllObj.enable(virtualclass.gObj.currWb);
    console.log('====> I am being active here ');
  }

  clearAll() {
    const cofirmMessage = virtualclass.lang.getString('clearAllWarnMessageW');
    virtualclass.popup.confirmInput(cofirmMessage, (confirm) => {
      if (confirm){
        this.clear();
        // const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
        // whiteboard.myPencil = new fabric.PencilBrush(whiteboard.canvas);
        const encodeData = virtualclass.wbWrapper.protocol.encode('cr', virtualclass.gObj.currWb);
        virtualclass.wbWrapper.util.sendWhiteboardData(encodeData);
      }
    });
  }

  clear() {
    this.canvas.clear();
    this.replayObjs = [];
  }
}
