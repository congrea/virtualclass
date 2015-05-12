// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;

    /**
     * @Class defined oval for drawing the object oval
     *  methods initilized for creating oval object
     *  the arc() function used to create the oval object
     */
    vcan.oval = function () {
        return {
            type: 'oval',
            /**
             * initiates the properties to oval object
             * @param obj the properties would initates on it
             */
            init: function (obj) {
                if (obj.width == undefined) {
                    obj.width = obj.rx * 2;
                }

                if (obj.height == undefined) {
                    obj.height = obj.ry * 2;
                }

                if (obj.borderColor == undefined) {
                    obj.borderColor = "#000000";
                }

                if (obj.fillColor != undefined) {
                    obj.fillStyle = obj.fillColor;
                }

                return obj;
            },
            /**
             * it draws the oval object
             * @param ctx current context of canvas
             * @param obj contains the information eg: x, y, rx, ry
             */

            draw: function (ctx, obj, noTransform) {
                ctx.beginPath();
                ctx.save();
                // move from center (of virtual box) to its left/top corner
                var startingPoint = 0;
                var endingPoint = 2 * Math.PI;
                var counterClockWise = false;

                ctx.lineWidth = obj.lineWidth;

                //this is handling for into linux for firefox
                var rNumber = obj.ry / obj.rx;
                rNumber = rNumber.toFixed(3);
                if (rNumber == 0.00) {
                    rNumber = 0.01;
                }

                ctx.transform(1, 0, 0, rNumber, 0, 0);
                ctx.arc(noTransform ? obj.x : 0, noTransform ? obj.y : 0, obj.rx, 0, endingPoint, counterClockWise);
                ctx.closePath();
                if (obj.fillStyle != undefined) {
                    ctx.fillStyle = obj.fillStyle;
                    ctx.fill();
                }
                if (obj.borderColor != undefined) {
                    ctx.fillStyle = obj.borderColor;
                    ctx.stroke();
                }
                ctx.restore();

            }
        };
    }
})(window);
