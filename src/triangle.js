// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;

    /**
     * @Class defined triangle for drawing triangle
     *  methods initilized for creating triangle object
     *  in future there can be more properties than now
     */
    vcan.triangle = function () {
        return {
            type: 'triangle',
            /**
             * initiates the properties to object
             * calcualte the width and height absolute x and absolute y for triangle object
             * @param obj the properties would initates on it
             */
            init: function (obj) {
                obj.fillStyle = obj.fillColor;
                if (obj.dRoad == undefined) {
                    obj.dRoad = 'ltr';
                }

                if (obj.width == undefined) {
                    obj.width = obj.ex - obj.sx;
                }

                if (obj.height == undefined) {
                    obj.height = obj.ey - obj.sy;
                }

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
             * it draws the triangle object according to the properties of passed object
             * @param ctx current context
             * @param obj would be drawn
             */
            draw: function (ctx, obj, noTransform) {
                ctx.beginPath();

                if (obj.dRoad == 't2b') {  //TODO this condtion should be re thinkable
                    var widthBy2 = obj.width / 2,
                        heightBy2 = obj.height / 2;
                } else {
                    //if user draw the object from right to left side
                    var widthBy2 = -obj.width / 2,
                        heightBy2 = -obj.height / 2;
                }

                ctx.lineWidth = obj.lineWidth;
                if (obj.borderColor != undefined) {
                    ctx.strokeStyle = obj.borderColor;
                }

                ctx.moveTo(-widthBy2, heightBy2);

                //left vertical line in case of ltr
                ctx.lineTo(0, -heightBy2);

                //right vertical line in case of rtl
                ctx.lineTo(widthBy2, heightBy2);

                ctx.closePath();

                if (obj.fillStyle != undefined) {
                    ctx.fillStyle = obj.fillStyle;
                    ctx.fill();
                }
                ctx.stroke();
            }
        };
    }
})(window);