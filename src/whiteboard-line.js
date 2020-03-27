class WhiteboardLine extends WhiteboardCommonShape {
  constructor(name) {
    super(name);
    this.name = name;
  }

  mouseMove(pointer, whiteboard) {
    this.sendMouseMoveData(pointer);
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