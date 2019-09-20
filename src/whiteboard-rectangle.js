// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  /**
   * @Class defined rectangle for rectangle
   *  methods initilized for creating rectangle object
   *  in future there can be more properties than one
   */

  function Rectangle(id) {
    const { vcan } = virtualclass.wb[id];
    // var vcan = virtualclass.wb[id];
    vcan.rectangle = function () {
      return {
        type: 'rectangle',
        /**
         * TOD0 we need to extend this function in future
         * initiates the properties of object
         * @param obj the properties would initates on it
         */
        init(obj) {
          if (obj.x == null) {
            const absx = obj.ex - (obj.width / 2);
            obj.x = absx;
          }

          if (obj.y == null) {
            const absy = obj.ey - (obj.height / 2);
            obj.y = absy;
          }

          return obj;
        },
        /**
         * it draws the object according to information passed by object
         * the funciton does not use the rect() funciton to create
         * rectangle object but uses the moveTo/lineTo object
         * @param ctx current context
         * @param obj would be drawn
         */
        draw(ctx, obj, noTransform) {
          // console.log('====> whiteboard data actual sx=', obj.sx, ' sy=', obj.sy, ' ex=', obj.ex, ' ey=', obj.ey);
          const x = -obj.width / 2;
          const y = -obj.height / 2;
          const w = obj.width;
          const h = obj.height;

          ctx.beginPath();

          ctx.strokeStyle = (obj.borderColor != null) ? `"${obj.strokeColor}"` : '#000';

          // alert(ctx.strokeStyle);

          ctx.moveTo(x, y);
          ctx.stroke();

          ctx.strokeStyle = obj.color;
          ctx.stroke();

          ctx.lineWidth = obj.stroke;
          ctx.stroke();

          ctx.lineTo(x + w, y);
          ctx.stroke();

          ctx.lineTo(x + w, y + h);
          ctx.stroke();

          ctx.lineTo(x, y + h);
          ctx.stroke();

          ctx.lineTo(x, y);
          ctx.stroke();

          ctx.fillStyle = (obj.fillColor != null) ? obj.fillColor : ' ';
          ctx.closePath();
          ctx.stroke();
          // todo this should be enable
          if (obj.fillColor != null) {
            ctx.fillStyle = obj.fillColor;
            ctx.fill();
          }

          // console.log('=====> whiteboard ', virtualclass.gObj.currWb);
          // console.log('=====> whiteboard length', virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs.length);
        },
      };
    };
  }

  window.Rectangle = Rectangle;
}(window));
