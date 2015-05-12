// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;

    /**
     * @Class defined rectangle for rectangle
     *  methods initilized for creating rectangle object
     *  in future there can be more properties than one
     */
    vcan.rectangle = function () {
        return {
            type: 'rectangle',
            /**
             * TOD0 we need to extend this function in future
             * initiates the properties of object
             * @param obj the properties would initates on it
             */
            init: function (obj) {

                if (obj.x == undefined) {
                    var absx = obj.ex - (obj.width / 2);
                    obj.x = absx;
                }

                if (obj.y == undefined) {
                    var absy = obj.ey - (obj.height / 2);
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
            draw: function (ctx, obj, noTransform) {

                //TODO
                // this funciton should be done through the proper process
                var x = -obj.width / 2,
                    y = -obj.height / 2,
                    w = obj.width,
                    h = obj.height;

                ctx.beginPath();

                ctx.strokeStyle = (obj.borderColor != undefined) ? '"' + obj.strokeColor + '"' : "#000";

                //alert(ctx.strokeStyle);

                ctx.moveTo(x, y);
                ctx.stroke();

                ctx.lineTo(x + w, y);
                ctx.stroke();

                ctx.lineTo(x + w, y + h);
                ctx.stroke();

                ctx.lineTo(x, y + h);
                ctx.stroke();

                ctx.lineTo(x, y);
                ctx.fillStyle = (obj.fillColor != undefined) ? obj.fillColor : " ";

                ctx.closePath();
                ctx.stroke();
                // todo this should be enable
                if (obj.fillColor != undefined) {
                    ctx.fillStyle = obj.fillColor;
                    ctx.fill();
                }

            }
        };
    }
})(window);