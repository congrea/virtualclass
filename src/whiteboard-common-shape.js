
class WhiteboardCommonShape {
  constructor(shape) {
    this.name = shape;
    this.default = {
      rotatingPointOffset: 40,
      cornerSize: 13,
      stroke: 1,
    }
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

  sendMouseDownData(pointer) {
    virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    const newData = {
      event: 'd',
      name: this.name,
      x: pointer.x,
      y: pointer.y,
    };
    const data = virtualclass.wbWrapper.protocol.encode('sp', newData);
    virtualclass.wbWrapper.msg.send(data);
    virtualclass.wbWrapper.gObj.previousData = newData;
  }

  sendMouseMoveData(pointer) {
    if (!virtualclass.gObj.lastSendDataTime) {
      virtualclass.gObj.lastSendDataTime = new Date().getTime();
    }
    const newData = {
      event: 'm',
      name: this.name,
      x: pointer.x,
      y: pointer.y
    };
    virtualclass.wbWrapper.msg.optimizeToSend(newData, 2000, 'sp');
  }

  mouseDown(pointer, whiteboard, event) {
    this.innerMouseDown(pointer, whiteboard, event);
    if (!event.e.isTrusted) return;
    virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    if (this.name === 'freeDrawing') {
      whiteboard.canvas.freeDrawingBrush.width = this.coreObj.strokeWidth * virtualclass.zoom.canvasScale;
      this.mousedown = true;
      
      // virtualclass.gObj.startTime = new Date().getTime();
      this.chunks.push(`${pointer.x}_${pointer.y}_d`);
      console.log('====> actual x, y sendin =============FREE DRAWING==== before scale ', pointer.x, pointer.y);
      virtualclass.wbWrapper.gObj.previousData = pointer;
    } else {
      // ioAdapter.mustSend({ wb: [{ ac: 'd', x: pointer.x, y: pointer.y }], cf: 'wb' });
      this.sendMouseDownData(pointer);
    }
  }

  innerMouseDown(pointer, whiteboard, event) {
    this.mousedown = true;
    if (this.name === 'freeDrawing') {
      whiteboard.canvas.freeDrawingBrush.width = this.coreObj.strokeWidth * virtualclass.zoom.canvasScale;
      console.log('====> free drawing mousedown', JSON.stringify(pointer));
      if (!whiteboard.myPencil) {
        whiteboard.myPencil = new fabric.PencilBrush(whiteboard.canvas);
      }

      if (!event)  event = { e: {isPrimary: true} };
      whiteboard.myPencil.onMouseDown(pointer, event);
    } else {
      this.startLeft = pointer.x;
      this.startTop = pointer.y;
      this.coreObj.left = this.startLeft;
      this.coreObj.top = this.startTop;
      this.coreObj.width = 1;
      this.coreObj.height = 1;
      this.coreObj.rotatingPointOffset = this.default.rotatingPointOffset * virtualclass.zoom.canvasScale;
      this.coreObj.cornerSize = this.default.cornerSize * virtualclass.zoom.canvasScale;
      this.coreObj.strokeWidth = virtualclass.zoom.canvasScale;
      if (whiteboard.currStrkSize) {
        this.coreObj.strokeWidth =  +(whiteboard.currStrkSize);
      }
      const toolName = virtualclass.wbWrapper.keyMap[this.name];
      if (this.name === 'line') {
        this.coreObj.points = [pointer.x, pointer.y, pointer.x, pointer.y]
        this[this.name] = new fabric[toolName](this.coreObj.points, this.coreObj); // add object
      } else {
        this[this.name] = new fabric[toolName](this.coreObj); // add object
      }
      whiteboard.canvas.add(this[this.name]);
    }
  }

  mouseMove() {
    // if (!this.mousedown) return;
  }

  mouseUp(pointer, whiteboard, event) {
    // this.mousedown = false;
    // this[this.name].setCoords();
    if (this.name === 'freeDrawing') {
      this.innerMouseUp(pointer, whiteboard, event);
      if (!event.e.isTrusted) return;
      if (virtualclass.wbWrapper.gObj.previousData) {
        virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
        this.chunks.push(`${pointer.x}_${pointer.y}_u`);
        const data = virtualclass.wbWrapper.protocol.encode('sf', this.chunks);
        virtualclass.wbWrapper.msg.send(data);
        this.chunks.length = 0;
      }
      this.mousedown = false;
      whiteboard.activeAllObj.disableLastElement(virtualclass.gObj.currWb);
    } else {
      this.innerMouseUp(pointer, whiteboard, true);
      if (!event.e.isTrusted) return;
      if (virtualclass.wbWrapper.gObj.previousData) {
        let data = virtualclass.wbWrapper.protocol.encode('sp', virtualclass.wbWrapper.gObj.previousData);
        virtualclass.wbWrapper.msg.send(data);
        const newData = {
          event: 'u',
          name: this.name,
          x: virtualclass.wbWrapper.gObj.previousData.x,
          y: virtualclass.wbWrapper.gObj.previousData.y,
        };
        data = virtualclass.wbWrapper.protocol.encode('sp', newData);
        virtualclass.wbWrapper.msg.send(data);
        console.log('sending the data here guys ==== MOUSE UP', JSON.stringify(data));
      }
    }
    console.log(" DELETE==JAI ");
    delete virtualclass.wbWrapper.gObj.previousData;
    delete this.freeDrawPrevious;
    delete virtualclass.gObj.lastSendDataTime;
  }

  innerMouseUp (pointer, whiteboard, event) {
    this.mousedown = false;
    if (this.name !== 'freeDrawing') {
      this[this.name].setCoords();
    } else {
      console.log('====> free drawing up', JSON.stringify(pointer));
      // whiteboard.canvas.upperCanvasEl.dispatchEvent(virtualclass.wbWrapper.util.readyMouseEvent('mouseup', pointer));
      if (!event) event = {isPrimary: true};
      whiteboard.myPencil.onMouseUp(event);
      const allObjects = whiteboard.canvas.getObjects();
      const lastObject = allObjects[allObjects.length - 1];
      lastObject.set({
        rotatingPointOffset: this.default.rotatingPointOffset * virtualclass.zoom.canvasScale,
        cornerSize: this.default.cornerSize * virtualclass.zoom.canvasScale,
      });
    }
    delete whiteboard.myPencil;
  }
}