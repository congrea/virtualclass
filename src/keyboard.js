class VirtualclassKeyboard {
  init(wId) {
    // const canvas = document.querySelector(`#canvasWrapper${wId} .upper-canvas`);
    // if(canvas) canvas.addEventListener('keydown', this.handlerKeyDown);
    const canvasWrapper = document.querySelector(`#canvasWrapper${wId}`);
    canvasWrapper.tabIndex = 1000;
    canvasWrapper.addEventListener('keydown', this.constructor.handlerKeyDown, false);
  }

  static handlerKeyDown(evt) {
    // This is used for removed the selected object.
    // var currTime = new Date().getTime();
    // 8 is used for delete on mac
    if (evt.keyCode === 8 || evt.keyCode === 46) {
      WhiteboardUtility.deleteActiveObject(evt, virtualclass.gObj.currWb);
    }
  }
}