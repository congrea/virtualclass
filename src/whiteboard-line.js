// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const { vcan } = window;

  /**
   * @Class defined class for line
   *  methods initilized for creating line object
   *  in future there can be more properties than now
   */


  function Line(id) {
    const { vcan } = virtualclass.wb[id];

    vcan.line = function () {
      return {
        type: 'line',
        /**
         * initiates the properties to object
         * @param obj the properties would initates on it
         */

        init(obj) {
          const sx = obj.start.x;
          const sy = obj.start.y;
          const ex = obj.end.x;
          const ey = obj.end.y;

          if (obj.width == null) {
            obj.width = (ex - sx);
            obj.height = (ey - sy);
          }

          obj.x = (sx + (ex - sx) / 2);
          obj.y = (sy + (ey - sy) / 2);
          return obj;
        },
        /**
         * it draws the object line according to properties which can get thorugh
         * the passed object
         * @param ctx current context
         * @param obj would be drawn into the canvas
         */
        draw(ctx, obj, noTransform) {
          ctx.beginPath();
          // move from center (of virtual box) to its left/top corner
          const sx = obj.width === 1 ? 0 : (-obj.width / 2);
          const sy = obj.height === 1 ? 0 : (-obj.height / 2);
          const ex = obj.width === 1 ? 0 : (obj.width / 2);
          const ey = obj.height === 1 ? 0 : (obj.height / 2);

          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.lineWidth = obj.stroke;
          if (obj.lineColor != null) {
            ctx.strokeStyle = obj.lineColor;
          }
          ctx.strokeStyle = obj.color;
          ctx.closePath();
          ctx.stroke();
        },
      };
    };
  }

  window.Line = Line;
}(window));
