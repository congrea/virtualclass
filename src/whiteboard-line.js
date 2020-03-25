class WhiteboardLine extends WhiteboardCommonShape {
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
    this.line.set({
      x2: pointer.x,
      y2: pointer.y
    });
    whiteboard.canvas.renderAll();
  }
}