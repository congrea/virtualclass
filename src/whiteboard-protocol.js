class WhiteboardProtocol {
  encode(action, data) {
    return this[action](data, 'encode');
  }

  decode(data) {
    const dataArr = data.split('_');
    return this[dataArr[0]](dataArr, 'decode');
  }

  sp(data, type) {
    let newData = {};
    if (type === 'encode') {
      const shortShapeName = virtualclass.wbWrapper.keyMap[`${data.name}Short`];
      newData = {
        //wb: [`sp_${shortShapeName}_${data.event}_${Math.round(data.x * 100) / 100}_${Math.round(data.y * 100) / 100}`],
        wb: [`sp_${shortShapeName}_${data.event}_${data.x}_${data.y}`],
        cf: 'wb',
      };
    } else if (type === 'decode') {
      newData = {};
      // dataArr { shape, too, event, x, y} = data.split('_');
      newData.action = data[0];
      newData.tool = virtualclass.wbWrapper.keyMap[data[1]];
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
      console.log('====> whiteboard pdf ========================== active mouse', result.x, result.y);
    }
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
          const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
          newData.actual.x -= canvasWrapper.scrollLeft;
          newData.actual.y -= canvasWrapper.scrollTop;
        }
      }
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

  an (data, type) { // encode, decode angle object
    let newData;
    if (type === 'encode') {
      newData = {
        wb: [`an_${data.angle}`],
        cf: 'wb',
      };
    } else {
      newData = { action: 'an', angle: +data[1] };
    }
    return newData;
  }
}
