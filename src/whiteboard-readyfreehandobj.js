// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */(function (window) {
  //   virtualclass.wb = window.virtualclass.wb;

  /**
   * this class initializes the functions
   * thorugh which the free hand object is drawn
   */
  // NOTE:- have changed during the unit testing
  const readyFreeHandObj = function (borderColor, lineWidth) {
    return {
      /**
         * this function does intialize the value which is required for drawing the object
         * @returns nothing
         */

      init() {
        this.freesvg = true;
        this.fdObj = {};
        this.borderColor = borderColor;
        this.freeDrawingLineWidth = lineWidth;
      },
      /**
         * this function does setup the drawing object fdObj for free drawing
         * it is called when user click on canvas
         * It expects mouse down event
         * @returns nothing
         */

      drawStart(ev, wId) {
        const { vcan } = virtualclass.wb[wId];
        // if(vcan.main.freesvg == true){
        if (virtualclass.wb[wId].obj.freeDrawObj.freesvg === true) {
          const ctx = vcan.main.canvas.getContext('2d');
          // borderColor = "red";
          // this.fdObj = vcan.main.freeHandDrawing(ev, {borderColor: borderColor});
          this.fdObj = vcan.main.freeHandDrawing({
            borderColor: this.borderColor,
            lineWidth: this.freeDrawingLineWidth,
          });
          this.fdObj.init();
          this.fdObj.fhdStart(ctx, vcan.utility.getReltivePoint(ev, wId));

          // }
        }
      },
      /**
         * this function calls the function through
         * which the free hand draw object is drawn as user move the mouse
         * @param ev expects the mouse move event
         * @returns nothing
         */
      wb_draw(ev, wId) {
        const { vcan } = virtualclass.wb[wId];
        const pointer = vcan.utility.getReltivePoint(ev, wId);
        this.fdObj.fhRendering(pointer);
      },
      finalizeDraw(ev, wbId) {
        const { vcan } = virtualclass.wb[wbId];
        // TODO this(finalizeDrawingPath) should be called over the object.
        virtualclass.wb[wbId].prvObj = this.fdObj.finalizeDrawingPath(virtualclass.wb[wbId].canvas, wbId);
        const lastChild = vcan.main.children[vcan.main.children.length - 1];
        lastChild.mt = virtualclass.wb[wbId].utility.stringToNumber(virtualclass.wb[wbId].prvObj.path[virtualclass.wb[wbId].prvObj.path.length - 1][3]);
      },
    };
  };
  window.readyFreeHandObj = readyFreeHandObj;
}(window));
