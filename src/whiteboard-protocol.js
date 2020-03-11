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
        wb: [`sp_${shortShapeName}_${data.event}_${Math.round(data.x * 100) / 100}_${Math.round(data.y * 100) / 100}`],
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

  ac(data, type) {
    let newData;
    if (type === 'encode') {
      newData = {
        wb: [`ac_${data.event}_${Math.round(data.x * 100) / 100}_${Math.round(data.y * 100) / 100}`],
        cf: 'wb',
      };
    } else if (type === 'decode') {
      newData = {};
      newData.action = data[0];
      newData.tool = virtualclass.wbWrapper.keyMap[data[1]];
      if (data.length > 3) {
        newData.event = virtualclass.wbWrapper.keyMap[data[2]];
        newData.actual = { x: +data[2], y: +data[3] };
      }
    }
    return newData;
  }
}
