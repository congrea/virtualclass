// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const response = {
    clearAll(wId) {
      virtualclass.wb[wId].tool = new virtualclass.wb[wId].toolObj('t_clearall', wId);
      virtualclass.wb[wId].utility.t_clearallInit(wId);
      virtualclass.wb[wId].utility.makeDefaultValue(undefined, wId);
      // virtualclass.storage.clearStorageData();
    },

    // TODO this is not used any more
    // should be deleted
    replayAll() {
      // console.log('=JAI= ASSIGN');
      virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs;
      virtualclass.wb[virtualclass.gObj.currWb].utility.clearAll(false, virtualclass.gObj.currWb);

      const data = {
        cmd: 't_replay',
        fromWhere: 'fromFile',
        wbId: virtualclass.gObj.currWb,
      };
      //           virtualclass.wb[virtualclass.gObj.currWb].toolInit(this.objs[this.objNo].cmd, 'fromFile', true);
      virtualclass.wb[virtualclass.gObj.currWb].toolInit(data);
    },

    createArrow(eMessage) {
      const wid = virtualclass.gObj.currWb;
      const imageElm = virtualclass.wb[wid].arrImg;
      const obj = {};
      obj.mp = { x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale };

      // virtualclass.posY = (obj.mp.y - wrapper.scrollTop);
      // virtualclass.posX = (obj.mp.x - wrapper.scrollLeft);

      virtualclass.posY = (obj.mp.y);
      virtualclass.posX = (obj.mp.x);

      // console.log('vm mouse cursor y=' + (virtualclass.posY));

      virtualclass.wb[virtualclass.gObj.currWb].utility.drawArrowImg(imageElm, obj);


      if (virtualclass.pdfRender[wid].scroll.Y != null) {
        virtualclass.pdfRender[wid].customMoustPointer({ y: virtualclass.posY }, 'Y', virtualclass.posY);
      }

      if (virtualclass.pdfRender[wid].scroll.X != null) {
        virtualclass.pdfRender[wid].customMoustPointer({ x: virtualclass.posX }, 'X', virtualclass.posX);
      }
      // console.log('Mouse cursor x=' + obj.mp.x  + ' y=' + obj.mp.y);
    },

    replayObj(repObj, wId) {
      virtualclass.wb[wId].vcan.main.replayObjs = [];
      if (repObj.length > 0) {
        virtualclass.wb[wId].vcan.main.replayObjs = repObj;
        const data = {
          cmd: 't_replay',
          fromWhere: 'fromBrowser',
          multiUser: true,
          myfunc: virtualclass.wb[wId].utility.triggerCanvasEnable,
          wbId: wId,
        };
        // virtualclass.wb[virtualclass.gObj.currWb].toolInit(
        // 't_replay', 'fromBrowser', true, virtualclass.wb[virtualclass.gObj.currWb].utility.triggerCanvasEnable);

        virtualclass.wb[wId].toolInit(data);
        // virtualclass.wb[virtualclass.gObj.currWb].utility.triggerCanvasEnable();
      }
    },
  };
  window.response = response;
}(window));
