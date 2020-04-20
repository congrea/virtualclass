class WhiteboardActiveAll {
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

  enable(wId, component) {
    let allObjects;
    if (component) {
      allObjects = virtualclass.wb[wId].canvas.getObjects(component);
    } else {
      allObjects = virtualclass.wb[wId].canvas.getObjects();
    }
    for (let i = 0; i < allObjects.length; i += 1) {
      console.log('====> active all');
      allObjects[i].set('selectable', true);
    }
  }

  makeTextUnEditable(wId) {
    let allObjects = virtualclass.wb[wId].canvas.getObjects('i-text');
    for (let i = 0; i < allObjects.length; i += 1) {
      console.log('====> active all');
      allObjects[i].set('editable', false);
    }
  }

  makeTextEditable(wId) {
    let allObjects = virtualclass.wb[wId].canvas.getObjects('i-text');
    for (let i = 0; i < allObjects.length; i += 1) {
      allObjects[i].set('editable', true);
    }
  }

  disable(wId, component) {
    const allObjects = component ? virtualclass.wb[wId].canvas.getObjects(component) : virtualclass.wb[wId].canvas.getObjects();
    for (let i = 0; i < allObjects.length; i += 1) {
      allObjects[i].set('selectable', false);
    }
  }

  disableBut(wId, component) {
    const allObjects = virtualclass.wb[wId].canvas.getObjects();
    for (let i = 0; i < allObjects.length; i += 1) {
      if (allObjects[i].type !== component) {
        allObjects[i].set('selectable', false);
      }
    }
  }

  disableLastElement(wId) {
    const allObjects = virtualclass.wb[wId].canvas.getObjects();
    allObjects[allObjects.length - 1].set('selectable', false);
  }

  mouseDown(pointer, whiteboard, event) {
    const myPointer = whiteboard.canvas.getPointer(event, true)
    console.log('==== convert actives all mouse down', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    this.down = true;
    if (this.activeDown) {
      virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    }
    const newData = this.generateData(event, whiteboard, 'd');
    virtualclass.wbWrapper.gObj.previousData = newData;
    WhiteboardMessage.send(newData);
  }

  mouseMove(pointer, whiteboard, event) {
    if (!event.e.isTrusted) return;
    // console.log('====> shoud not invoke');
    if (this.activeDown && this.down) {
      // whiteboard.canvas.renderAll();
      const newData = this.generateData(event, whiteboard, 'm');
      virtualclass.wbWrapper.msg.optimizeToSend(newData, 2000);
    }
  }

  mouseUp(pointer, whiteboard, event) {
    const myPointer = whiteboard.canvas.getPointer(event, true)
    console.log('==== actives all mouse up', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    if (this.activeDown && this.down) {
      this.down = false;
      WhiteboardMessage.send(virtualclass.wbWrapper.gObj.previousData);
      const newData = this.generateData(event, whiteboard, 'u');
      WhiteboardMessage.send(newData);
    }
  }
}
