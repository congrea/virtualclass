class WhiteboardProtocol {
  encode(action, data) {
    return this[action](data, 'encode');
  }

  decode(data) {
    const dataArr = data.split('_');
    return this[dataArr[0]](dataArr, 'decode');
  }

  sp(data, type) { // decode data for creating the objects
    let newData = {};
    if (type === 'encode') {
      const shortShapeName = virtualclass.wbWrapper.keyMap[`${data.name}Short`];
      newData = {
        //wb: [`sp_${shortShapeName}_${data.event}_${Math.round(data.x * 100) / 100}_${Math.round(data.y * 100) / 100}`],
        // wb: [`sp_${shortShapeName}_${data.event}_${data.x * virtualclass.zoom.canvasScale}_${data.y * virtualclass.zoom.canvasScale}`],
        wb: [`sp_${shortShapeName}_${data.event}_${data.x}_${data.y}`],
        cf: 'wb',
      };
    } else if (type === 'decode') {
      newData = {};
      // dataArr { shape, too, event, x, y} = data.split('_');
      newData.action = data[0];
      newData.tool =  virtualclass.wbWrapper.keyMap[data[1]];
      newData.shape = virtualclass.wbWrapper.keyMap[data[1]];
      newData.event = virtualclass.wbWrapper.keyMap[data[2]];
      console.log('====> creating arrow befor rect before scale ', data[3], data[4]);
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
    // result.x = Math.round(result.x * 100) / 10000;
    // result.y = Math.round(result.y * 100) / 10000;
    return result;
  }

  ac(data, type) { // active all
    const newData = {};
    if (type === 'encode') {
      console.log('==== sending before encode ', data.x, data.y);
      const newCord = this.changeWithScale('divide', data);
      // const newCord = data;
      // newData.y = data.y / virtualclass.zoom.canvasScale;
      // newData.wb = [`ac_${data.event}_${Math.round(newData.x * 100) / 100}_${Math.round(newData.y * 100) / 100}`];
      newData.wb = [`ac_${data.event}_${newCord.x}_${newCord.y}`];
      newData.cf = 'wb';
    } else if (type === 'decode') {
      newData.action = data[0];
      newData.tool = virtualclass.wbWrapper.keyMap[data[1]];
      if (data.length > 3) {
        newData.event = virtualclass.wbWrapper.keyMap[`ac${data[1]}`];
        console.log('==== convert, before convert x, y ', newData.event, data[2], data[3]);
        const newCord = this.changeWithScale('multiply', { x: data[2], y: data[3] });
        // const newCord = { x: +data[2], y: +data[3] };
        newData.actual = { x: newCord.x, y: newCord.y };
        if (roles.hasControls()) {
          const toolBar = document.getElementById(`commandToolsWrapper${virtualclass.gObj.currWb}`);
          newData.actual.y += toolBar ? toolBar.offsetHeight : 44;
          const appOptionsToolbar = document.getElementById('virtualclassAppOptionsCont');
          newData.actual.x += appOptionsToolbar ? appOptionsToolbar.offsetWidth : 55;
        } else {
          // const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
          // newData.actual.x -= canvasWrapper.scrollLeft;
          // newData.actual.y -= canvasWrapper.scrollTop;
        }
        const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
        newData.actual.x -= canvasWrapper.scrollLeft;
        newData.actual.y -= canvasWrapper.scrollTop;
      }
      console.log('====> active data suman here ', JSON.stringify(newData));
    }
    return newData;
  }

  cr(data, type) {
    let newData;
    if (type === 'encode') {
      const dataArr = data.split('_');
      const whiteboardId = dataArr[dataArr.length - 1];
      newData = { wb: [`cr_${whiteboardId}`], cf: 'wb' };
    } else {
      const whiteboardId = `_doc_${data[data.length - 1]}_${data[data.length - 1]}`;
      newData = { action: data[0], actual: whiteboardId};
    }
    return newData;
  }

  sf(data, type) { // shape free drawing
    let newData;
    if (type === 'encode') {
      newData = {
        wb: ['sf'],
        cf: 'wb',
        s: virtualclass.zoom.canvasScale, // scale
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

  generateFreeDrawingData(msg, scaleMultiply) {
    const result = [];
    let msgArr;
    let x;
    let y;
    let scaleFreeDrawing = 1;
    // if (scaleMultiply) scaleFreeDrawing = virtualclass.zoom.canvasScale;
    const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
    for (let i = 0; i < msg.length; i += 1) {
      msgArr = msg[i].split('_');
      x = ((+(msgArr[0])) * scaleFreeDrawing);
      y = ((+(msgArr[1])) * scaleFreeDrawing);
      if (msgArr.length > 2) {
        // 2 -> down/up, 0 -> x, 1 -> y
        result.push(`sp_f_${msgArr[2]}_${x}_${y}`);
      } else {
        result.push(`sp_f_m_${x}_${y}`);
      }
      console.log('====> creating arrow =============== free drawing before scale ', x, y);
    }
    return result;
  }
}
