let myWhiteboardData = 0;
const shapeName = {
  triangle: 'Triangle',
  oval: 'Circle',
  rectangle: 'Rect',
  line: 'Line',
  text: 'Text',
}

class WhiteboardReplay {
  init(wid) {
    this.objs = virtualclass.wb[wid].vcanMainReplayObjs;
    this.objNo = 0;
  }

  renderObj(wid) {
    let event;
    if (this.objs[this.objNo].cmd) {
      virtualclass.wb[wid].selectedTool = this.objs[this.objNo].cmd;
    } else {
      if (this.objs[this.objNo].ac === 'd') {
        event = 'innerMouseDown';
      } else if ((this.objs[this.objNo].ac === 'm')) {
        event = 'innerMouseMove';
      } else if (this.objs[this.objNo].ac === 'u') {
        event = 'innerMouseUp';
      }
      const data = this.objs[this.objNo];
      virtualclass.wb[wid].rectangleObj[event](data, virtualclass.wb[wid]);
    }
  }
}

class WhiteboardUtility {
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
    virtualclass.wbReplay.init(wId);
    virtualclass.wbReplay.renderObj(wId);
  }

  sendOptimizeData(data) {
    if (roles.hasControls()) {
      ioAdapter.mustSend(data);
      console.log('====> sending data ', data);
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
    // ioAdapter.mustSend({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
    virtualclass.wbUtil.sendOptimizeData({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
  }

  innerMouseDown(pointer, whiteboard) {
    this.mousedown = true;
    this.startLeft = pointer.x;
    this.startTop = pointer.y;
    this.coreObj.left = this.startLeft;
    this.coreObj.top = this.startTop;
    this.coreObj.width = 1;
    this.coreObj.height = 1;

    this[this.name] = new fabric[shapeName[this.name]](this.coreObj);
    whiteboard.canvas.add(this[this.name]);
    myWhiteboardData++;
    console.log('====> create whiteboard ===DOWN===', myWhiteboardData);
  }

  mouseMove() {
    // if (!this.mousedown) return;
  }

  mouseUp() {
    // this.mousedown = false;
    // this[this.name].setCoords();
    this.innerMouseUp();
    virtualclass.wbUtil.sendOptimizeData({ wb: [{ ac: 'u' }], cf: 'wb' });
  }

  innerMouseUp() {
    console.log('====> create whiteboard ===UP===', myWhiteboardData);
    this.mousedown = false;
    this[this.name].setCoords();
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
    virtualclass.wbUtil.sendOptimizeData({ wb: [{ ac: 'm', x: pointer.x, y: pointer.y }], cf: 'wb' });
  }

  innerMouseMove(pointer, whiteboard) {
    if (!this.mousedown) return;
    const newLeft = pointer.x;
    const newTop = pointer.y;
    const width = newLeft - this.startLeft;
    const height = newTop - this.startTop;

    if (width > 0) { // Draw from left to right
      console.log('====> rectangle Draw from left to right');
      this.rectangle.set('width', width);
    } else {
      this.rectangle.set('left', newLeft); // Draw from right to left
      console.log('====> rectangle Draw from right to left');
      this.rectangle.set('width', width * -1);
    }

    if (height > 0) {
      console.log('====> rectangle  Draw from top to bottom');
      this.rectangle.set('height', height); // Draw from top to bottom
    } else {
      console.log('====> rectangle  Draw from bottom to top');
      this.rectangle.set('top', newTop); // Draw from bottom to top
      this.rectangle.set('height', height * -1);
    }

    whiteboard.canvas.renderAll();
    // ioAdapter.mustSend([{ wb: { ac: 'm', x: pointer.x, y: pointer.y }, cf: 'wb' }]);
    // virtualclass.wbUtil.sendOptimizeData({ wb: [{ ac: 'm', x: pointer.x, y: pointer.y }], cf: 'wb' });
    myWhiteboardData++;
    console.log('====> create whiteboard ===MOVE===', myWhiteboardData);
  }
}

class Whiteboard {
  constructor() {
    this.canvas = null;
    this.selectedTool = null;
    this.rectangleObj = new WhiteboardRectangle('rectangle');
  }

  init(id) {
    this.wbId = id;
    this.attachToolbarHandler(id);
    console.log('====> canvas id ', `canvas${id}`);
    this.canvas = new fabric.Canvas(`canvas${id}`, { selection: false });
    this.attachMouseMovementHandlers();
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
  }

  toolbarHandler(ev) {
    this.canvas.isDrawingMode = false;
    const currentTool = ev.currentTarget.parentNode.dataset.tool;
    this.selectedTool = currentTool;
    // ioAdapter.mustSend({ wb: [{ cmd: this.selectedTool }], cf: 'wb' });
    virtualclass.wbUtil.sendOptimizeData({ wb: [{ cmd: this.selectedTool }], cf: 'wb' });
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
    // this.removeMouseMovementHandlers();
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.width = 1;
  }
}
