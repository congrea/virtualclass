class WhiteboardUtility {
  // earlier it waas drawInWhiteboards
  initArrowImage() {
    if (!this.arrImg) {
      this.arrImg = new Image();
      this.arrImg.src = 'https://cdn.congrea.net/resources/images/arrow.png';
      this.arrImgDraw = false;
      this.arrImg.onload = function () {
        this.arrImgDraw = true;
      };
    }
  }

  applyCommand(data, wid) {
    for (let i = 0; i < data.length; i += 1) {
      this.executeData(data[i], wid);
    }
  }

  // executeWhiteboardData
  executeData(data, wId) {
    this.storeAtMemory(data, (wId));
    virtualclass.wbWrapper.replay.replayData([data], wId);
  }

  storeAtMemory(data, wId, freeDrawing) {
    if (!virtualclass.wb[wId].replayObjs) virtualclass.wb[wId].replayObjs = [];
    let toBeSendData;
    if (freeDrawing) {
      toBeSendData = virtualclass.wbWrapper.protocol.generateFreeDrawingData(freeDrawing);
    } else {
      toBeSendData = data;
    }
    if (Array.isArray(data)) {
      for (let i = 0; i < toBeSendData.length; i += 1) {
        virtualclass.wb[wId].replayObjs.push(toBeSendData[i]);
      }
    } else {
      virtualclass.wb[wId].replayObjs.push(data);
    }
  }

  // replayData(data, wId) {
  //   virtualclass.wb[wId].vcanMainReplayObjs = [];
  //   if (data.length > 0) {
  //     virtualclass.wb[wId].vcanMainReplayObjs = data;
  //     virtualclass.wbWrapper.replay.replayInit(wId);
  //   }
  // }

  // replayInit(wId) {
  //   virtualclass.wbWrapper.replay.init(wId);
  //   virtualclass.wbWrapper.replay.renderObj(wId);
  // }

  sendWhiteboardData(data) {
    if (roles.hasControls()) {
      console.log('sending the data here guys ', JSON.stringify(data));
      console.log('====> free drawing ', JSON.stringify(data));
      ioAdapter.mustSend(data);
      if (data.wb[0].substring(0, 2) === 'sf') {
        this.storeAtMemory(data.wb, virtualclass.gObj.currWb, data.v);
      } else {
        this.storeAtMemory(data.wb, virtualclass.gObj.currWb);
      }
    }
  }

  sendArrow(msg) {
    const time = 100;
    if (!this.lastarrowtime) {
      this.lastarrowtime = new Date().getTime();
    }
    this.presentarrowtime = new Date().getTime();
    if (((this.presentarrowtime - this.lastarrowtime) >= time) && !virtualclass.wb[virtualclass.gObj.currWb].mousedown) {
      console.log('====> creating arrow ', JSON.stringify(msg));
      ioAdapter.send(msg);
      this.lastarrowtime = new Date().getTime();
    }
  }

  createFabricNewInstance(wId) {
    if (virtualclass.wb[wId].canvas && virtualclass.wb[wId].canvas.upperCanvasEl) {
      virtualclass.wb[wId].canvas.dispose();
    }
    delete virtualclass.wb[wId].canvas;
    virtualclass.wb[wId].canvas = new fabric.Canvas(`canvas${wId}`, { selection: false });
    virtualclass.wb[wId].attachMouseMovementHandlers();
    this.createCanvasPdfInstance(wId, virtualclass.wb[wId].canvas.upperCanvasEl);
  }

  createCanvasPdfInstance(wId, mainCanvas) {
    const canvasPdf = document.createElement('canvas');
    canvasPdf.id = `canvas${wId}_pdf`;
    canvasPdf.className = 'pdfs';
    canvasPdf.width = mainCanvas.width;
    canvasPdf.height = mainCanvas.height;

    mainCanvas.parentNode.insertBefore(canvasPdf, mainCanvas);
    // virtualclass.vutil.insertAfter(canvasPdf, mainCanvas);
  }

  replayFromLocalStroage(allRepObjs, wid) {
     console.log('====> whiteboard pdf suman draw whiteboard')
    if (typeof (Storage) !== 'undefined') {
      virtualclass.wb[wid].clear(wid);
      virtualclass.wb[wid].replayObjs = [];
      virtualclass.wb[wid].gObj.tempRepObjs = allRepObjs;
      if (allRepObjs.length > 0) {
        this.applyCommand(allRepObjs, wid);
      }

      // Todo, this is need to be re-enable
      // if (roles.hasControls()) {
      //   const fontTool = document.querySelector(`#t_font${wid}`);
      //   const strkTool = document.querySelector(`#t_strk${wid}`);
      //   if (virtualclass.wb[wid].tool.cmd === `t_text${wid}`) {
      //     if (fontTool.classList.contains('hide')) {
      //       fontTool.classList.remove('hide');
      //       fontTool.classList.add('show');
      //     }
      //     strkTool.classList.add('hide');
      //   } else if (!fontTool.classList.contains('hide')) {
      //     fontTool.classList.add('hide');
      //   }
      // }
    }
  }

  fitWhiteboardAtScale(wid) {
    console.log('====> canvas set zoom scale ', virtualclass.zoom.canvasScale);
    virtualclass.wb[wid].canvas.setZoom(virtualclass.zoom.canvasScale);
    if (typeof virtualclass.wb[wid] === 'object') {
      delete virtualclass.wb[wid].myPencil;
      if (virtualclass.wb[wid].replayObjs && virtualclass.wb[wid].replayObjs.length > 0) {
        this.replayFromLocalStroage(virtualclass.wb[wid].replayObjs, wid);
      }
    }


    // virtualclass.wb[wId].canvas.renderAll();
  }

  handleGetPointer(event, whiteboard){
    const pointer = whiteboard.canvas.getPointer(event, true);
    return pointer;
  }

  onMessage(e) {
    const whiteboardShape = e.message.wb[0].substring(0, 2);
    if (whiteboardShape === 'sf') { // free drawing packet
      const fromUserRole = e.fromUser.role;
      const result = virtualclass.wbWrapper.protocol.generateFreeDrawingData(e.message.v, e.message.s, true);
      let event;
      for (let i = 0; i < result.length; i += 1) {
        event = { message: { wb: result[i] },  fromUser: { role : fromUserRole} };
        this.onMessage(event);
      }
    } else {
      if (!Array.isArray(e.message.wb)) e.message.wb = [e.message.wb];
      const executeData = e.message.wb;
      virtualclass.vutil.storeWhiteboardAtInlineMemory(e.message.wb);
      if (!virtualclass.zoom.canvasScale) return;
      if (virtualclass.gObj.currWb && typeof virtualclass.wb[virtualclass.gObj.currWb] === 'object'
        && e.fromUser.role === 't') {
        virtualclass.wbWrapper.util.applyCommand(executeData, virtualclass.gObj.currWb);
      }
    }
  }

  handleArrow(event) {
    const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
    const pointer = whiteboard.canvas.getPointer(event, true);
    const afterChange = virtualclass.wbWrapper.protocol.changeWithScale('divide', pointer);
    this.sendArrow({ msg: `${afterChange.x}_${afterChange.y}`, cf: 'ca' });
  }

  onArrowMessageReceived(message) {
    const pointer = {};
    const dataArr = message.msg.split('_');
    pointer.x = dataArr[0];
    pointer.y = dataArr[1];
    this.createArrow(pointer);
  }

  createArrow(eMessage) {
    const wid = virtualclass.gObj.currWb;
    console.log('====> creating arrow before scale ', eMessage.x, eMessage.y);
    const obj = { x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale };
    console.log('====> whiteboard pdf create mouse mouse', obj.x, obj.y);

    virtualclass.posY = (obj.y);
    virtualclass.posX = (obj.x);

    // console.log('vm mouse cursor y=' + (virtualclass.posY));

    this.drawArrowImage(obj, wid);

    if (virtualclass.pdfRender[wid].scroll.Y != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ y: virtualclass.posY }, 'Y', virtualclass.posY);
    }

    if (virtualclass.pdfRender[wid].scroll.X != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ x: virtualclass.posX }, 'X', virtualclass.posX);
    }
    // console.log('Mouse cursor x=' + obj.mp.x  + ' y=' + obj.mp.y);
  }

  drawArrowImage(obj, wId) {
    const img = this.arrImg;
    const ctx = virtualclass.wb[wId].canvas.getContext('2d');
    ctx.clearRect(0, 0, virtualclass.wb[wId].canvas.width, virtualclass.wb[wId].canvas.height);
    virtualclass.wb[wId].canvas.renderAll();
    ctx.save();
    ctx.beginPath();
    ctx.translate(obj.x, obj.y);
    ctx.drawImage(img, -3, -3, 18, 24);
    ctx.closePath();
    ctx.restore();
  }

  readyMouseEvent(event, pointer) {
    return new MouseEvent(event, {
      clientX: pointer.x,
      clientY: pointer.y,
      buttons: 1,
      bubbles: true,
      which: 1,
      composed: true,
    });
  }

  sendOptimizeData(data, time, type) {
    virtualclass.wbWrapper.gObj.previousData = data;
    virtualclass.wbWrapper.gObj.presentSendDataTime = new Date().getTime();
    const timeDifference = (virtualclass.wbWrapper.gObj.presentSendDataTime - virtualclass.wbWrapper.gObj.lastSentDataTime);
    if (timeDifference > time) {
      if (type) {
        data = virtualclass.wbWrapper.protocol.encode(type, data);
      } 
      virtualclass.wbWrapper.util.sendWhiteboardData(data);
      virtualclass.wbWrapper.gObj.lastSentDataTime = new Date().getTime();
      if (type === 'sf') {
        virtualclass.wb[virtualclass.gObj.currWb].freeDrawingObj.chunks.length = 0; // empty the free drarwing after bulk
      } 
    }
  }
}