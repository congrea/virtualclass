// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const response = {
    clearAll(formUserId, id, eMessage, orginalTeacherId) {
      if (formUserId != id) {
        virtualclass.wb[virtualclass.gObj.currWb].tool = new virtualclass.wb[virtualclass.gObj.currWb].tool_obj('t_clearall');
        virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
        virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue();
        // virtualclass.storage.clearStorageData();
        virtualclass.storage.wbDataRemove(virtualclass.gObj.currWb);
      }
    },

    // TODO this is not used any more
    // should be deleted
    replayAll() {
      console.log("=JAI= ASSIGN");
      window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs;
      virtualclass.wb[virtualclass.gObj.currWb].utility.clearAll(false);
      virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_replay', 'fromFile');
    },

    createArrow(eMessage) {
      const wid = virtualclass.gObj.currWb;
      const imageElm = virtualclass.wb[wid].arrImg;
      const obj = {};
      obj.mp = { x: eMessage.x * virtualclass.zoom.canvasScale, y: eMessage.y * virtualclass.zoom.canvasScale };

      const wrapper = document.querySelector(`#canvasWrapper${wid}`);
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

    replayObj(repObj) {
      console.log("=JAI= BLANK 2");
      window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = [];
      if (repObj.length > 0) {
        console.log("=JAI= ASSIGN 2");
        window.virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs = repObj;
        virtualclass.wb[virtualclass.gObj.currWb].toolInit('t_replay', 'fromBrowser', true, virtualclass.wb[virtualclass.gObj.currWb].utility.dispQueuePacket);
      }
    },
  };
  window.response = response;
}(window));
