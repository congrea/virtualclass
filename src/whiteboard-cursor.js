/**
 * This class draws the cursor on canvas for student side
  * @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author Suman Bogati <http://www.vidyamantra.com>
 */

class WhiteboardCursor {
  init() {
    if (!this.arrImg) {
      this.arrImg = new Image();
      this.arrImg.src = 'https://cdn.congrea.net/resources/images/arrow.png';
      this.arrImgDraw = false;
      this.arrImg.onload = () => {
        this.arrImgDraw = true;
      };
    }
  }

  send(msg) {
    const time = 100;
    if (!this.lastarrowtime) {
      this.lastarrowtime = new Date().getTime();
    }
    this.presentarrowtime = new Date().getTime();
    if (((this.presentarrowtime - this.lastarrowtime) >= time)
    && !virtualclass.wb[virtualclass.gObj.currWb].mousedown) {
      // console.log('====> creating arrow ', JSON.stringify(msg));
      ioAdapter.send(msg);
      this.lastarrowtime = new Date().getTime();
    }
  }

  handle(event) {
    if (!event.isTrusted) return;
    const whiteboard = virtualclass.wb[virtualclass.gObj.currWb];
    const pointer = whiteboard.canvas.getPointer(event, true);
    const afterChange = WhiteboardProtocol.changeWithScale('divide', pointer);
    this.send({ msg: `${afterChange.x}_${afterChange.y}`, cf: 'ca' });
  }

  onMessage(message) {
    const pointer = {};
    const dataArr = message.msg.split('_');
    pointer.x = dataArr[0];
    pointer.y = dataArr[1];
    this.create(pointer);
  }

  create(eMessage) {
    const wid = virtualclass.gObj.currWb;
    // console.log('====> creating arrow before scale ', eMessage.x, eMessage.y);
    const obj = { x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale };
    // console.log('====> whiteboard pdf create mouse mouse', obj.x, obj.y);

    virtualclass.posY = (obj.y);
    virtualclass.posX = (obj.x);

    this.draw(obj, wid);

    if (virtualclass.pdfRender[wid].scroll.Y != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ y: virtualclass.posY }, 'Y', virtualclass.posY);
    }

    if (virtualclass.pdfRender[wid].scroll.X != null) {
      virtualclass.pdfRender[wid].customMoustPointer({ x: virtualclass.posX }, 'X', virtualclass.posX);
    }
    // console.log('Mouse cursor x=' + obj.mp.x  + ' y=' + obj.mp.y);
  }

  draw(obj, wId) {
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
}
