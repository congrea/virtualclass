// This is responsible to create the whiteboard shape
class WhiteboardRectangle extends WhiteboardCommonShape {
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
    virtualclass.wbWrapper.msg.optimizeToSend(newData, 2000, 'sp');
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
  }
}