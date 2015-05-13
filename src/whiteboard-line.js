// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;
    /**
     * @Class defined class for line
     *  methods initilized for creating line object
     *  in future there can be more properties than now
     */
    vcan.line = function () {
        return {
            type: 'line',
            /**
             * initiates the properties to object
             * @param obj the properties would initates on it
             */

            init: function (obj) {
                var sx = obj.start.x;
                var sy = obj.start.y;
                var ex = obj.end.x;
                var ey = obj.end.y;

                if (obj.width == undefined) {
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
            draw: function (ctx, obj, noTransform) {
                ctx.beginPath();
                // move from center (of virtual box) to its left/top corner
                var sx = obj.width === 1 ? 0 : (-obj.width / 2);
                var sy = obj.height === 1 ? 0 : (-obj.height / 2);
                var ex = obj.width === 1 ? 0 : (obj.width / 2);
                var ey = obj.height === 1 ? 0 : (obj.height / 2);

                ctx.moveTo(sx, sy);
                ctx.lineTo(ex, ey);
                ctx.lineWidth = obj.lineWidth;
                if (obj.lineColor != undefined) {
                    ctx.strokeStyle = obj.lineColor;
                }
                ctx.closePath();
                ctx.stroke();
            }
        };
    }
})(window);