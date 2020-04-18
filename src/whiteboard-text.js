/**
 * This class is used to create Text on whiteboard
 * @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author Suman Bogati <http://www.vidyamantra.com>
 */

class WhiteboardText {
  constructor(name) {
    this.placeHolder = virtualclass.lang.getString('textPlaceholder');
    this.name = name;
    // this changes according to
    this.default = {  
      rotatingPointOffset: 40,
      cornerSize: 13,
      fontSize: 20,
      fill: '#00f',
    };

    // this does not change
    this.coreObj = {
      fontWeight: 'normal',
      fontFamily: 'arial',
      padding: 7,
      editingBorderColor: '#08518f',
    };
  }

  isObjectInEditingMode(whiteboard) {
     const allObjects = whiteboard.canvas.getObjects('i-text');
     for(let i=0; i < allObjects.length; i += 1) {
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
      const allTexts = whiteboard.canvas.getObjects('i-text');
      if (virtualclass.wbWrapper.gObj.textSelected.text.trim() !== this.placeHolder) {
        this.editingIndex = allTexts.indexOf(virtualclass.wbWrapper.gObj.textSelected);
        // Todo, improve this condition
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

  isEmptyText(whiteboard) {
    const allText = whiteboard.canvas.getObjects('i-text');
    for (let i = 0; i < allText.length; i += 1) {
      if (allText[i].text === this.placeHolder) {
        return true;
      }
    }
    return false;
  }

  createText(textObj, whiteboard) {
    if (textObj.value === '') return;
    if (this.isEmptyText(whiteboard)) return;
    this.startLeft = textObj.x;
    this.startTop = textObj.y;
    this.coreObj.left = this.startLeft;
    this.coreObj.top = this.startTop;
    const textValue = (textObj.value) ? textObj.value : this.placeHolder;
    this.coreObj.rotatingPointOffset = this.default.rotatingPointOffset * virtualclass.zoom.canvasScale;
    this.coreObj.cornerSize = this.default.cornerSize * virtualclass.zoom.canvasScale;
    // this.coreObj.strokeWidth = virtualclass.zoom.canvasScale;
    this.coreObj.fontSize = this.default.fontSize;
    if (whiteboard.fontSize) {
      this.coreObj.fontSize = +(whiteboard.fontSize);
    }

    this.coreObj.fill = this.default.fill;
    if (whiteboard.toolColor) {
      this.coreObj.fill = whiteboard.toolColor;
    }
    this[this.name] = new fabric.IText(textValue, this.coreObj); // add object
    whiteboard.canvas.add(this[this.name]);
  }

  finalizeText(textObj) {
    const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
    this.textEditing = false;
    if (this.isDefault(textObj.target)) return;
    virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
    const data = { x: textObj.target.left, y: textObj.target.top, text: textObj.target.text };
    if (this.editingIndex != null) data.index = this.editingIndex;

    if (+whiteboard.fontSize && textObj.target.fontSize !== +(whiteboard.fontSize)) {
      data.fontSize = whiteboard.fontSize;
    }

    if (whiteboard.toolColor && textObj.target.fill !== whiteboard.toolColor) {
      data.fontColor = whiteboard.toolColor;
    }

    virtualclass.wbWrapper.msg.optimizeToSend(data, 0, 'tx');
    delete this.editingIndex;
    whiteboard.activeAllObj.enable(virtualclass.gObj.currWb, 'i-text');
    if (data.fontColor || data.fontSize) {
      this.updateText(data, whiteboard, textObj.target);
    }
  }

  isDefault(textObj) {
    return (textObj.text.trim() === this.placeHolder);
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
    // console.log('mouse move');
  }

  mouseUp() {
    // console.log('mouse up');
  }
}