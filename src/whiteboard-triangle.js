class WhiteboardTriangle extends WhiteboardCommonShape {
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
    const newLeft = pointer.x;
    const newTop = pointer.y;
    const width = newLeft - this.startLeft;
    const height = newTop - this.startTop;

    // Setting the width of triangle
    if (width > 0) {
      this.triangle.set('width', width); // Left to Right
    } else {
      this.triangle.set('width', width * -1); // Right to Left
    }

    // Setting the height of triangle
    if (height > 0) {
      this.triangle.set('angle', 0);
      this.triangle.set('height', height); // Top to bottom
      if (width > 0) {
        this.triangle.set('left', newLeft - width);
      } else {
        this.triangle.set('left', newLeft);
      }
    } else {
      this.triangle.set('angle', 180);
      this.triangle.set('height', height * -1);
      this.triangle.set('top', newTop + height * -1); // Bottom to top
      if (width > 0) {
        this.triangle.set('left', newLeft);
      } else {
        this.triangle.set('left', newLeft + width * -1);
      }
    }
    whiteboard.canvas.renderAll();
  }
}
