// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  // var vcan = window.vcan;

  /**
   *  @Class defined events
   *  the class initialize various method
   *  in future there can be more properties than now
   *  TODO this function should be improvement
   */

  function Events(id) {
    const { vcan } = virtualclass.wb[id];
    vcan.events = function () {
      return {
        bind(obj, type, handler) {
          obj[`on${type}`] = handler;
        },
        /**
         * Method that determines that which object we are clicking on
         * @method findTarget
         * @param {Event} e mouse event
         * @pointer refers x and y co-ordinate relative to canvas
         */
        findTarget(e, wId) {
          let target;
          // then check all of the objects on canvas
          // TODO use this should be obj

          const objs = vcan.main.children;
          for (let i = objs.length; i--;) {
            if (objs[i] && vcan.virtual_box.containsPoint(e, objs[i], wId)) {
              target = objs[i];
              break;
            }
          }

          if (target && target.selectable) {
            return target;
          }
        },
      };
    };
  }

  window.Events = Events;
}(window));
