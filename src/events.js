// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var vcan = window.vcan;

    /**
     *  @Class defined events
     *  the class initialize various method
     *  in future there can be more properties than now
     *  TODO this function should be improvement
     */
    vcan.events = function () {
        return {
            bind: function (obj, type, handler) {
                obj['on' + type] = handler;
            },
            /**
             * Method that determines that which object we are clicking on
             * @method findTarget
             * @param {Event} e mouse event
             * @pointer refers x and y co-ordinate relative to canvas
             */
            findTarget: function (e) {
                var target;
                // then check all of the objects on canvas
                //TODO use this should be obj

                var objs = vcan.main.children;
                for (var i = objs.length; i--;) {
                    if (objs[i] && vcan.virtual_box.containsPoint(e, objs[i])) {
                        target = objs[i];
                        break;
                    }
                }

                if (target && target.selectable) {
                    return target;
                }
            }
        }
    }
})(window);