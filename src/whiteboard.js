/**
 * This class is used to represent a new instance of Whiteboard.
 * Every action performs on whiteboard, eg: selecting tool for creating, clearing and deleting shapes;
 * changing the font size, stroke size and color, all actions start to execute from this file
 * @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author Suman Bogati <http://www.vidyamantra.com>
 */

class Whiteboard {
  constructor() {
    this.canvas = null;
    this.selectedTool = null;
    this.rectangleObj = new WhiteboardRectangle('rectangle');
    this.activeAllObj = new WhiteboardActiveAll();
    this.freeDrawingObj = new WhiteboardFreeDrawing('freeDrawing');
    this.lineObj = new WhiteboardLine('line');
    this.triangleObj = new WhiteboardTriangle('triangle');
    this.circleObj = new WhiteboardCircle('circle');
    this.textObj = new WhiteboardText('text');
    this.gObj = {};
  }

  init(id) {
    this.wbId = id;
    delete virtualclass.wbWrapper.gObj.textSelected;
    this.textObj.textEditing = false;
    this.attachToolbarHandler(id);
    virtualclass.wbWrapper.util.createFabricNewInstance(id);
    // this.attachMouseMovementHandlers();
    virtualclass.keyboard.init(id);
  }

  attachToolbarHandler(id) {
    const allTools = document.querySelectorAll(`#commandToolsWrapper${id} .tool a`);
    for (let i = 0; i < allTools.length; i += 1) {
      allTools[i].addEventListener('click', this.toolbarHandler.bind(this));
    }
  }

  attachMouseMovementHandlers() {
    this.canvas.on('selection:created', this.handlerSelection.bind(this));
    this.canvas.on('selection:cleared', this.handlerSelection.bind(this));
    this.canvas.on('mouse:down', this.handlerMouseDown.bind(this));
    this.canvas.on('mouse:move', this.handlerMouseMove.bind(this));
    this.canvas.on('mouse:up', this.handlerMouseUp.bind(this));
    this.canvas.on('text:editing:entered', this.handlePlaceHolder.bind(this));
    this.canvas.on('text:editing:exited', (textObj) => { // TODO, Settimeout needs to be removed
      setTimeout(() => { this.textObj.finalizeText(textObj); }, 0);
    });
  }

  handlePlaceHolder(e) {
    if (e.target.type === 'i-text' && e.target.text === this.textObj.placeHolder) {
      // this.textObj.updateText({ text: 'a' }, this, e.target);
      e.target.text = '';
      e.target.hiddenTextarea.value = '';
      this.canvas.renderAll();
    }
  }

  handlerSelection(event) {
    if (event.selected && this.selectedTool === 'activeAll') {
      this.activeAllObj.activeDown = true;
    } else if (event.selected && event.selected[0].type === 'i-text') {
      virtualclass.wbWrapper.gObj.textSelected = event.selected[0];
      console.log('====> selected text ', virtualclass.wbWrapper.gObj.textSelected);
    } else if (event.deselected) {
      this.activeAllObj.activeDown = false;
      virtualclass.wbWrapper.gObj.textSelected = false;
    }
  }

  triggerGetPointer(e) {
    const wId = e.wId ? e.wId : virtualclass.gObj.currWb;
    const pointer = virtualclass.wb[wId].canvas.getPointer(e);
    return pointer;
  }

  handlerMouseDown(o) {
    if (!o.e.isTrusted) return;
    // We do not need to invoke on clearAll
    if (this.selectedTool && this[`${this.selectedTool}Obj`]) {
      this.mousedown = true;
      const pointer = this.triggerGetPointer(o.e);
      this[`${this.selectedTool}Obj`].mouseDown(pointer, this, o);
    }
  }

  handlerMouseMove(o) {
    if (!o.e.isTrusted) return;
    const pointer = this.triggerGetPointer(o.e);
    if (this.mousedown && this.selectedTool) {
      // console.log('=====> SUMAN BOGATI MOUSE 2');
      this[`${this.selectedTool}Obj`].mouseMove(pointer, this, o);
    }
    virtualclass.wbWrapper.cursor.handle(o.e);
  }

  handlerMouseUp(o) {
    if (!o.e.isTrusted) return;
    const pointer = this.triggerGetPointer(o.e);
    if (this.mousedown && this.selectedTool) this[`${this.selectedTool}Obj`].mouseUp(pointer, this, o);
    this.mousedown = false;
    // console.log('=====> SUMAN BOGATI MOUSE 3');
  }

  toolbarHandler(ev) {
    const { parentNode } = ev.currentTarget;
    this.innerToolbarHandler(parentNode.dataset.tool, virtualclass.gObj.currWb);
    const activeObject = virtualclass.wb[virtualclass.gObj.currWb].canvas.getActiveObjects();
    if (activeObject.length > 0) {
      virtualclass.wb[virtualclass.gObj.currWb].canvas.discardActiveObject();
      virtualclass.wb[virtualclass.gObj.currWb].canvas.renderAll();
      const encodeData = virtualclass.wbWrapper.protocol.encode('ds', virtualclass.gObj.currWb);
      WhiteboardMessage.send(encodeData);
    }
    if (virtualclass.wbWrapper.shapes.includes(parentNode.dataset.tool) || parentNode.dataset.tool === 'activeAll') {
      virtualclass.wbWrapper.util.makeActiveTool(parentNode.id, virtualclass.gObj.currWb);
    }
  }

  selectTool(tool) { // todo, need to improve
    if (tool === 'rectangle' || tool === 'line' || tool === 'circle' || tool === 'triangle' || tool === 'text'
      || tool === 'activeAll' || tool === 'freeDrawing') {
      this.selectedTool = tool;
    }

    if (tool !== 'stroke' && tool !== 'font') {
      if (tool !== 'activeAll' && tool !== 'text') {
        WhiteboardUtility.strokeSizeSelector();
      } else if (tool === 'text') {
        WhiteboardUtility.fontSizeSelector();
      }
    }
  }

  innerToolbarHandler(tool, wId) {
    WhiteboardUtility.closeTray();
    // this.canvas.isDrawingMode = false;
    const currentTool = tool;
    this.selectTool(tool);

    if (tool !== 'rectangle' && tool !== 'line' && tool !== 'circle' && tool !== 'triangle' && tool !== 'text') {
      this[currentTool](wId);
    } else if (currentTool === 'text') {
      this.activeAllObj.enable(wId, 'i-text');
      this.activeAllObj.disableBut(wId, 'i-text');
      delete virtualclass.wbWrapper.gObj.textSelected; // Clear text selection if there is any
      this.textObj.textEditing = false;
    } else {
      this.activeAllObj.disable(wId);
    }
  }

  shapes() {
    // this.selectedTool = null;
    const shapesElem = document.querySelector(`#shapes${this.wbId}`);
    virtualclass.wbWrapper.util.handleTrayDisplay(shapesElem);
  }

  stroke() {
    const shapesElem = document.querySelector(`#commandToolsWrapper${this.wbId} .strkSizeList`);
    virtualclass.wbWrapper.util.handleTrayDisplay(shapesElem);
    virtualclass.wbWrapper.util.initActiveElement(`#t_strk${this.wbId} ul`, { type: 'strk', prop: 'stroke' });
  }

  font() {
    const fontElem = document.querySelector(`#commandToolsWrapper${this.wbId} .fontSizeList`);
    virtualclass.wbWrapper.util.handleTrayDisplay(fontElem);
    virtualclass.wbWrapper.util.initActiveElement(`#t_font${this.wbId} ul`, { type: 'font', prop: 'font' });
  }

  color() {
    const colorElem = document.querySelector(`#commandToolsWrapper${this.wbId} .table`);
    virtualclass.wbWrapper.util.handleTrayDisplay(colorElem);
    virtualclass.wbWrapper.util.initActiveElement(`#colorList${this.wbId}`, { type: 'color', prop: 'color' });
  }

  freeDrawing(wId) {
    // this.canvas.isDrawingMode = false;
    this.activeAllObj.disable(wId);
  }

  activeAll(wId) {
    this.activeAllObj.enable(wId);
    console.log('====> I am being active here ');
  }

  clearAll(wId) {
    const cofirmMessage = virtualclass.lang.getString('clearAllWarnMessageW');
    virtualclass.popup.confirmInput(cofirmMessage, (confirm) => {
      if (confirm){
        this.clear();
        const encodeData = virtualclass.wbWrapper.protocol.encode('cr', wId);
        WhiteboardMessage.send(encodeData);
      }
    });
  }

  clear() {
    this.canvas.clear();
    this.replayObjs = [];
    this.canvas._objects = [];
    delete virtualclass.wbWrapper.gObj.textSelected;
    this.textObj.textEditing = false;
  }
}