// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  // var vcan = window.vcan;
  /**
   * TODO this object has some methods
   * through which the user can do interact with
   * created object eg:- drag, rotate.
   */

  function Interact(id) {
    const { vcan } = virtualclass.wb[id];

    vcan.interact = {
      /**
       * Rotates object by invoking its rotate method
       * @method rotateObject
       * @param x {Number} pointer's x coordinate
       * @param y {Number} pointer's y coordinate
       */
      rotateObject(x, y) {
        const t = vcan.main.currentTransform;
        // TODO we should get the offset through this o = this._offset;

        // o = calcOffset(vcan.main.canvas.id)
        const o = vcan.main.offset;
        if (t.target.lockRotation) {
          return;
        }
        const lastAngle = Math.atan2(t.ey - t.y - o.y, t.ex - t.x - o.x);
        const curAngle = Math.atan2(y - t.y - o.y, x - t.x - o.x);
        vcan.utility.setVal(t.target, 'theta', (curAngle - lastAngle) + t.theta);
      },
      /**
       * Scales object by invoking its scaleX/scaleY methods
       * @method scaleObject
       * @param x {Number} pointer's x coordinate
       * @param y {Number} pointer's y coordinate
       * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
       *                    When not provided, an object is scaled by both dimensions equally
       */
      scaleObject(x, y, by) {
        const t = vcan.main.currentTransform;
        const { offset } = vcan.main;
        const { target } = t;
        if (target.lockScalingX && target.lockScalingY) {
          return;
        }
        const lastLen = Math.sqrt(Math.pow(t.ey - t.y - offset.y, 2) + Math.pow(t.ex - t.x - offset.x, 2));
        const curLen = Math.sqrt(Math.pow(y - t.y - offset.y, 2) + Math.pow(x - t.x - offset.x, 2));

        target.scaling = true;
        if (!by) {
          target.lockScalingX || vcan.utility.setVal(target, 'scaleX', t.scaleX * curLen / lastLen);
          target.lockScalingY || vcan.utility.setVal(target, 'scaleY', t.scaleY * curLen / lastLen);
        } else if (by === 'x' && !target.lockUniScaling) {
          target.lockScalingX || vcan.utility.setVal(target, 'scaleX', t.scaleX * curLen / lastLen);
        } else if (by === 'y' && !target.lockUniScaling) {
          target.lockScalingY || vcan.utility.setVal(target, 'scaleY', t.scaleY * curLen / lastLen);
        }
      },
      /**
       * Translates object by "setting" its x/y
       * @method translateObject
       * @param x {Number} pointer's x coordinate
       * @param y {Number} pointer's y coordinate
       */

      translateObject(x, y) {
        const { target } = vcan.main.currentTransform;
        target.lockMovementX || vcan.utility.setVal(target, 'x', x - vcan.main.currentTransform.offsetX);
        target.lockMovementY || vcan.utility.setVal(target, 'y', y - vcan.main.currentTransform.offsetY);
        return target;
      },
    };
  }

  window.Interact = Interact;
}(window));
