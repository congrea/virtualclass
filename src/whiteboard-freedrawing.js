class WhiteboardFreeDrawing extends WhiteboardCommonShape {
  constructor(name) {
    super(name);
    this.name = name;
    this.chunks = [];
  }

  innerMouseMove(pointer, whiteboard, event) {
    console.log('====> free drawing mousemove', JSON.stringify(pointer));
    if (!event) event = { e: {isPrimary: true}};
    whiteboard.myPencil.onMouseMove(pointer, event);
  }

  mouseMove(pointer, whiteboard, event) {
    this.innerMouseMove(pointer, whiteboard, event);
    if (!event.e.isTrusted) return;
    this.collectingData(pointer);
    virtualclass.wbWrapper.util.sendOptimizeData(this.chunks, 3000, 'sf');
  }

  collectingData(pointer) {
    const newData = {
      x: pointer.x,
      y: pointer.y,
    };

    if ((!this.freeDrawPrevious)
      || (((Math.abs(newData.x - this.freeDrawPrevious.x) > 1) || (Math.abs(newData.y - this.freeDrawPrevious.y) > 1)))) {
      this.freeDrawPrevious = newData;
      this.chunks.push(`${newData.x}_${newData.y}`);
      console.log('====> actual x, y sendin =============FREE DRAWING==== before scale ', newData.x, newData.y);
    }

    virtualclass.wbWrapper.gObj.previousData = newData;
  }
}