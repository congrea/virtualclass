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

  disable(wId) {
    const allObjects = virtualclass.wb[wId].canvas.getObjects();
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
    console.log('====> whiteboard pdf ========================== active mouse trigger', myPointer.x, myPointer.y);
    console.log('==== convert actives all mouse down', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    this.down = true;
    if (this.activeDown) {
      virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    }
    const newData = this.generateData(event, whiteboard, 'd');
    virtualclass.wbWrapper.gObj.previousData = newData;
    virtualclass.wbWrapper.msg.send(newData);
  }

  mouseMove(pointer, whiteboard, event) {
    const myPointer = whiteboard.canvas.getPointer(event, true);
    console.log('==== actives all mouse move', myPointer.x, myPointer.y, ' orginal x, y', event.e.clientX, event.e.clientY);
    if (!event.e.isTrusted) return;
    // console.log('====> shoud not invoke');
    if (this.activeDown && this.down) {
      // whiteboard.canvas.renderAll();
      const newData = this.generateData(event, whiteboard, 'm')
      //this.previousData = newData
      virtualclass.wbWrapper.msg.optimizeToSend(newData, 2000);
    }
  }

  mouseUp(pointer, whiteboard, event) {
    const myPointer = whiteboard.canvas.getPointer(event, true)
    console.log('==== actives all mouse up', myPointer.x, myPointer.y);
    if (!event.e.isTrusted) return;
    console.log('====> shoud not invoke');
    if (this.activeDown && this.down) {
      this.down = false;
      virtualclass.wbWrapper.msg.send(virtualclass.wbWrapper.gObj.previousData);
      const newData = this.generateData(event, whiteboard, 'u');
      virtualclass.wbWrapper.msg.send(newData);
    }
  }
}