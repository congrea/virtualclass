class WhiteboardText {
  constructor(name) {
    this.name = name;
    // this.selected = false,
    this.coreObj = {
      fill: '#333',
      fontWeight: 'normal',
      fontSize: 30,
      fontFamily: 'arial',
      padding: 10 ,
    };
  }

  mouseDown(pointer, whiteboard) {
    if (!virtualclass.wbWrapper.gObj.textSelected && !virtualclass.wbWrapper.gObj.textEditing) {
      console.log('after selection selected 2');
      this.startLeft = pointer.x;
      this.startTop = pointer.y;
      this.coreObj.left = this.startLeft;
      this.coreObj.top = this.startTop;
      this[this.name] = new fabric.IText('ener your text', this.coreObj); // add object
      this[this.name].on('selected', this.afterSelected.bind(this));
      whiteboard.canvas.add(this[this.name]);
    } else if (virtualclass.wbWrapper.gObj.textSelected) {
      virtualclass.wbWrapper.gObj.textSelected.target.enterEditing();
      virtualclass.wbWrapper.gObj.textEditing = true;
    }
  }

  afterSelected(obj) {
    console.log('selected 1');
    virtualclass.wbWrapper.gObj.textSelected = obj;
  }

  afterDeSelected(obj) {
    console.log('deselected 1');
    virtualclass.wbWrapper.gObj.textSelected = obj;
  }

  mouseMove() {
    console.log('mouse move');
  }

  mouseUp() {
    console.log('mouse up');
  }
}