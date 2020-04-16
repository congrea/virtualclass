class WhiteboardProtocol {
  encode(action, data) {
    return this[action](data, 'encode');
  }

  decode(data, wId) {
    const dataArr = data.split('_');
    return this[dataArr[0]](dataArr, 'decode', wId);
  }

  // Creating the shapes/objects, rectangle, oval, etc
  sp(data, type) { 
    let newData = {};
    if (type === 'encode') {  
      const shortShapeName = virtualclass.wbWrapper.keyMap[`${data.name}Short`];
      if (!shortShapeName) {
        alert('Capture the problem with ', JSON.stringify(data));
        debugger;
      }
      newData = {
        wb: [`sp_${shortShapeName}_${data.event}_${data.x}_${data.y}`],
        cf: 'wb',
      };
    } else if (type === 'decode') {
      newData = {};
      newData.action = data[0];
      newData.tool =  virtualclass.wbWrapper.keyMap[data[1]];
      newData.shape = virtualclass.wbWrapper.keyMap[data[1]];
      newData.event = virtualclass.wbWrapper.keyMap[data[2]];
      newData.actual = { x: +data[3], y: +data[4] };
    }
    return newData;
  }

  // Change co-ordination/coordination X,Y with scale
  changeWithScale(type, data) {
    const result = {}
    if (type === 'divide') {
      result.x = data.x / virtualclass.zoom.canvasScale;
      result.y = data.y / virtualclass.zoom.canvasScale;
    } else {
      result.x = (+data.x) * virtualclass.zoom.canvasScale;
      result.y = (+data.y) * virtualclass.zoom.canvasScale;
    }
    return result;
  }

  // Active All, for Drag, Drop and Move the objects
  ac(data, type, wId) {
    const newData = {};
    if (type === 'encode') {
      // console.log('==== sending before encode ', data.x, data.y);
      const newCord = this.changeWithScale('divide', data);
      newData.wb = [`ac_${data.event}_${newCord.x}_${newCord.y}`];
      newData.cf = 'wb';
    } else if (type === 'decode') {
      newData.action = data[0];
      newData.tool = virtualclass.wbWrapper.keyMap[data[0]];
      if (data.length > 3) {
        newData.event = virtualclass.wbWrapper.keyMap[`ac${data[1]}`];
        // console.log('==== convert, before convert x, y ', newData.event, data[2], data[3]);
        const newCord = this.changeWithScale('multiply', { x: data[2], y: data[3] });
        // const newCord = { x: +data[2], y: +data[3] };
        newData.actual = { x: newCord.x, y: newCord.y };
        if (roles.hasControls()) {
          const toolBar = document.getElementById(`commandToolsWrapper${wId}`);
          newData.actual.y += toolBar ? toolBar.offsetHeight : 44;
          const appOptionsToolbar = document.getElementById('virtualclassAppOptionsCont');
          newData.actual.x += appOptionsToolbar ? appOptionsToolbar.offsetWidth : 55;
        }
        const canvasWrapper = document.querySelector(`#canvasWrapper${wId}`);
        newData.actual.x -= canvasWrapper.scrollLeft;
        newData.actual.y -= canvasWrapper.scrollTop;
      }
      // console.log('====> active data suman here ', JSON.stringify(newData));
    }
    return newData;
  }

  generateWhiteboardId(data, type) {
    let whiteboardId;
    if (type === 'encode') {
      const dataArr = data.split('_');
      if (data.length > 10) { // document's id
        whiteboardId = `${dataArr[dataArr.length - 2]}::${dataArr[dataArr.length - 1]}`;
      } else {
        whiteboardId = dataArr[dataArr.length - 1]; // whiteboard id
      }
    } else {
      if (data[data.length - 1].length > 10) {
        const idInChunks = data[data.length - 1].split("::");
        const docId = `${idInChunks[idInChunks.length - 2]}_${idInChunks[idInChunks.length - 1]}`;
        whiteboardId = `_doc_${docId}_${docId}`; // document id
      } else {
        whiteboardId = `_doc_0_${data[data.length - 1]}`; // whiteboard id
      }
    }
    return whiteboardId;
  }

  // Clear Whiteboard
  cr(data, type) {
    let newData;
    const whiteboardId = this.generateWhiteboardId(data, type);
    if (type === 'encode') {
      newData = { wb: [`cr_${whiteboardId}`], cf: 'wb' };
    } else {
      newData = { action: data[0], actual: whiteboardId};
    }
    return newData;
  }

  /* Clubing the Free Drawing packets into one packet */
  sf(data, type) {
    let newData;
    if (type === 'encode') {
      newData = {
        wb: ['sf'],
        cf: 'wb',
        v: [],
      };
      
      // Assigning the direct values with data to v 
      // would empty the adapter must send data after 
      // truncate the sent free drawing data
      for (let i = 0; i < data.length; i++){
        newData.v.push(data[i]);
      }
    }
    return newData;
  }

  // Generating the free drawing data, which finally invokes above sp
  generateFreeDrawingData(msg) {
    const result = [];
    let msgArr;
    let x;
    let y;
    for (let i = 0; i < msg.length; i += 1) {
      msgArr = msg[i].split('_');
      x = +msgArr[0];
      y = +msgArr[1];
      if (msgArr.length > 2) {
        // 2 -> down/up, 0 -> x, 1 -> y
        result.push(`sp_f_${msgArr[2]}_${x}_${y}`);
      } else {
        result.push(`sp_f_m_${x}_${y}`);
      }
    }
    return result;
  }

  tx(data, type) { // Creating the text
    let newData;
    if (type === 'encode') {
      let encData = `tx_${data.x}_${data.y}_${data.text}`;
      if (data.index != null) {
        encData += `_${data.index}`;
      } else {
        encData += '_-1';
      } 

      if (data.fontSize) {
        encData += `_${data.fontSize}`;
      } else {
        encData += `_0`;
      }

      if (data.fontColor) {
        encData += `_${data.fontColor}`;
      } else {
        encData += `_0`;
      }

      newData = {
        wb:  [encData],
        cf: 'wb',
      };
    } else {
      newData = {
        action: 'tx',
        tool: 'text',
        shape: 'text',
        event: 'mousedown',
        actual: { x: +data[1], y: +data[2], value: data[3] },
      };
      if (+data[4] !== -1) {
        newData.actual.index = data[4];
      }

      if (+data[5] !== 0) {
        newData.actual.fontSize = +data[5];
      }

      if (+data[6] !== 0) {
        newData.actual.fontColor = data[6];
      }
    }
    return newData;
  }
  
  ds(data, type) { // discard selection
    let newData;
    const whiteboardId = this.generateWhiteboardId(data, type);
    if (type === 'encode') {
      newData = { wb: [`ds_${whiteboardId}`], cf: 'wb' };
    } else {
      newData = { action: data[0], actual: whiteboardId };
    }
    return newData;
  }

  da(data, type) { // delete active, todo, da should be merge with ds
    let newData;
    const whiteboardId = this.generateWhiteboardId(data, type);
    if (type === 'encode') {
      newData = { wb: [`da_${whiteboardId}`], cf: 'wb' };
    } else {
      newData = { action: data[0], actual: whiteboardId };
    }
    return newData;
  }

  ot(data, type) { // other data, 
    let newData;
    if (type === 'encode') {
       newData = { wb: [`ot_${virtualclass.wbWrapper.keyMap[data.type]}_${data.value}`], cf: 'wb' };
    } else {
      newData = {
        action: data[0],
        tool: virtualclass.wbWrapper.keyMap[data[1]],
        actual: {value: data[2] },
      }
    }
    return newData;
  }
}