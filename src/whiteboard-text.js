class WhiteboardText {
  constructor(name) {
    this.default = {
      rotatingPointOffset: 40,
      cornerSize: 13,
      fontSize: 20,
      fill: '#00f',
    }
    this.name = name;
    // this.selected = false,
    this.coreObj = {
      fontWeight: 'normal',
      // fontSize: 30,
      fontFamily: 'arial',
      padding: 7 ,
    };
  }
  isObjectInEditingMode(whiteboard) {
     const allObjects = whiteboard.canvas.getObjects('i-text');
     for(let i=0; i < allObjects.length; i++) {
      if (allObjects[i].isEditing) {
        whiteboard.canvas.trigger('text:editing:exited', {target: allObjects[i]});
      }
     }
  }

  mouseDown(pointer, whiteboard) {
    if (!virtualclass.wbWrapper.gObj.textSelected && !this.textEditing) {
      this.renderText(pointer, whiteboard);
    } else if (virtualclass.wbWrapper.gObj.textSelected && !whiteboard.activeAllObj.activeDown) {
      virtualclass.wbWrapper.gObj.textSelected.enterEditing();
      let  allTexts = whiteboard.canvas.getObjects('i-text');
      if (virtualclass.wbWrapper.gObj.textSelected.text.trim() != 'Enter your text') {
        this.editingIndex = allTexts.indexOf(virtualclass.wbWrapper.gObj.textSelected);
      }
      whiteboard.activeAllObj.disable(virtualclass.gObj.currWb, 'i-text');
      this.textEditing = true;
    }
  }

  updateText(textObj, whiteboard, foundObject) {
    if (textObj.text) {
      foundObject.set('text', textObj.text);
    } else {
      foundObject.set('text', textObj.value);
    }
    if (textObj.fontSize)  foundObject.set('fontSize', textObj.fontSize);
    if (textObj.fontColor)  foundObject.set('fill', textObj.fontColor);
    whiteboard.canvas.renderAll();
  }

  renderText(textObj, whiteboard) {
    const textChildren = whiteboard.canvas.getObjects('i-text');
    console.log('====> text coordination ', JSON.stringify(textObj));
    if (textChildren.length > 0 && textObj.index != null) {
      const foundObject = textChildren[textObj.index];
      if (foundObject) {
        this.updateText(textObj, whiteboard, foundObject);
      } else {
        this.createText(textObj, whiteboard);
      }
    } else {
      this.createText(textObj, whiteboard);
    }
  }

  createText(textObj, whiteboard) {
    if (textObj.value == '') return;
    if (this.isEmptyText(whiteboard)) return;
    console.log('found traget suman receive ', JSON.stringify(textObj));
    this.startLeft = textObj.x;
    this.startTop = textObj.y;
    this.coreObj.left = this.startLeft;
    this.coreObj.top = this.startTop;
    const textValue = (textObj.value) ? textObj.value : 'Enter your text';
    this.coreObj.rotatingPointOffset = this.default.rotatingPointOffset * virtualclass.zoom.canvasScale;
    this.coreObj.cornerSize = this.default.cornerSize * virtualclass.zoom.canvasScale;
    // this.coreObj.strokeWidth = virtualclass.zoom.canvasScale;
    this.coreObj.fontSize = this.default.fontSize;
    if (whiteboard.textFontSize) {
      this.coreObj.fontSize = +(whiteboard.textFontSize);
    }

    this.coreObj.fill = this.default.fill;
    if (whiteboard.activeToolColor) {
      this.coreObj.fill =  whiteboard.activeToolColor;
    }

    this[this.name] = new fabric.IText(textValue, this.coreObj); // add object
    //this[this.name].on('selected', this.afterSelected.bind(this));
    whiteboard.canvas.add(this[this.name]);
  }

  isEmptyText (whiteboard) {
    const allText = whiteboard.canvas.getObjects('i-text');
    for (let i = 0; i < allText.length; i++) {
      if (allText[i].text === 'Enter your text') {
        return true;
      }
    }
    return false;
  }

  finalizeText(textObj) {
    const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
    this.textEditing = false;
    if (this.isDefault(textObj.target)) return;
    console.log('is text editing ', this.editingIndex);
    virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    console.log('found traget suman without zoom send x, y ', textObj.target.left, textObj.target.top);
    let data = {x: textObj.target.left, y: textObj.target.top, text: textObj.target.text};
    if (this.editingIndex != null) data.index = this.editingIndex;

    if (+whiteboard.textFontSize && textObj.target.fontSize !== +(whiteboard.textFontSize)) {
      data.fontSize = whiteboard.textFontSize;
    }

    if (whiteboard.activeToolColor && textObj.target.fill !== whiteboard.activeToolColor) {
      data.fontColor = whiteboard.activeToolColor;
    }

    
    virtualclass.wbWrapper.msg.optimizeToSend(data, 0, 'tx');
    delete this.editingIndex;
    whiteboard.activeAllObj.enable(virtualclass.gObj.currWb, 'i-text');
    if (data.fontColor || data.fontSize) {
      this.updateText(data, whiteboard, textObj.target);
    }
  }

  isDefault(textObj) {
    return (textObj.text.trim() == 'Enter your text');
  }

  afterSelected(obj) {
    console.log('selected 1');
    virtualclass.wbWrapper.gObj.textSelected = obj;
  }

  afterDeSelected() {
    console.log('deselected 1');
    virtualclass.wbWrapper.gObj.textSelected = null;
  }

  mouseMove() {
    console.log('mouse move');
  }

  mouseUp() {
    console.log('mouse up');
  }
}