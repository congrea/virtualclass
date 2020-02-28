const shapeName = {
  triangle: 'Triangle',
  oval: 'Circle',
  rectangle: 'Rect',
  line: 'Line',
  text: 'Text',
}

class WhiteboardShape {
  constructor(shape) {
    this.name = shape;
    this.coreObj = {
      originX: 'left',
      originY: 'top',
      angle: 0,
      selectable: false,
      fill: '#ffffff',
      stroke: '#0a0a0a',
      transparentCorners: false,
      width: 0,
      height: 0,
      strokeWidth: 2,
    }
  }

  mouseDown(o, whiteboard) {
    this.mousedown = true;
    const pointer = whiteboard.canvas.getPointer(o.e);
    this.startLeft = pointer.x;
    this.startTop = pointer.y;
    this.coreObj.left = this.startLeft;
    this.coreObj.top = this.startTop;
    this.coreObj.width = 0;
    this.coreObj.height = 0;

    // this.tri = new fabric.Triangle(this.coreObj);
    this[this.name] = new fabric[shapeName[this.name]](this.coreObj);
    whiteboard.canvas.add(this[this.name]);
  }

  mouseMove() {
    if (!this.mousedown) return;
  }

  mouseUp() {
    this.mousedown = false;
    this[this.name].setCoords();
  }
}

class WhiteboardRectangle extends WhiteboardShape {
  constructor(name) {
    super(name);
    this.name = name;
  }

  mouseMove(o, whiteboard) {
    if (!this.mousedown) return;
    const pointer = whiteboard.canvas.getPointer(o.e);

    if (this.startLeft > pointer.x) {
      this.rectangle.set({ left: Math.abs(pointer.x) });
    }

    if (this.startTop > pointer.y) {
      this.rectangle.set({ top: Math.abs(pointer.y) });
    }

    this.rectangle.set({ width: Math.abs(this.startLeft - pointer.x) });
    this.rectangle.set({ height: Math.abs(this.startTop - pointer.y) });
    whiteboard.canvas.renderAll();
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
    if (this.selectedTool !== 'freeDrawing') {
      this.mousedown = true;
      this[`${this.selectedTool}Obj`].mouseDown(o, this);
    }
  }

  handlerMouseMove(o) {
    if (this.mousedown && this.selectedTool !== 'freeDrawing') { this[`${this.selectedTool}Obj`].mouseMove(o, this); }
  }

  handlerMouseUp(o) {
    if (this.selectedTool !== 'freeDrawing') this[`${this.selectedTool}Obj`].mouseUp(o, this);
  }

  toolbarHandler(ev) {
    this.canvas.isDrawingMode = false;
    const currentTool = ev.currentTarget.parentNode.dataset.tool;
    this.selectedTool = currentTool;
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
