// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  function Mouse(id) {
    let canvasElement;
    const { vcan } = virtualclass.wb[id];
    vcan.mouse = function () {
      return {
        init() {
          this.bindHandlers();
        },
        /**
         * Attach the various event handlers onto canvas
         * eg: mousedown, mouseup
         */
        bindHandlers() {
          // console.log('Whiteboard ');
          canvasElement = vcan.main.canvas;
          // TODO the types should be store into main/core funtion
          // the place of this object should not be here
          const types = {
            mousedown: 'mousedown',
            mousemove: 'mousemove',
            mouseup: 'mouseup',
            touchstart: 'touchstart',
            touchmove: 'touchmove',
            touchend: 'touchend',
          };

          for (const type in types) {
            if (type === 'mousedown') {
              canvasElement.addEventListener(type, (ev) => { this._mousedown(ev, id) }, false);
            } else if (type === 'mousemove') {
              // canvasElement.addEventListener(type, this._mousemove, false);
              canvasElement.addEventListener(type, (ev) => { this._mousemove(ev, id) }, false);
            } else if (type === 'mouseup') {
              // canvasElement.addEventListener(type, this._mouseup, false);
              canvasElement.addEventListener(type, (ev) => { this._mouseup(ev, id) }, false);
            } else if (type === 'touchstart') {
              // canvasElement.addEventListener(type, this._touchstart, false);
              canvasElement.addEventListener(type, (ev) => { this._touchstart(ev, id) }, false);
            } else if (type === 'touchmove') {
              // canvasElement.addEventListener(type, this._touchmove, false);
              canvasElement.addEventListener(type, (ev) => { this._touchmove(ev, id) }, false);
            } else if (type === 'touchend') {
              // canvasElement.addEventListener(type, this._touchend, false);
              canvasElement.addEventListener(type, (ev) => { this._touchend(ev, id) }, false);

            }
          }
        },

        _mousedown(e, wid) {
          vcan.activMouse.mousedown(e, wid);
        },
        _mousemove(e, wid) {
          vcan.activMouse.mousemove(e, wid);
        },
        _mouseup(e, wid) {
          vcan.activMouse.mouseup(e, wid);
        },
        _touchstart(e, wid) {
          vcan.activMouse.mousedown(e, wid);
          // to stop mouse event
          e.preventDefault();
        },
        _touchmove(e, wid) {
          vcan.activMouse.mousemove(e, wid);
          e.preventDefault();
        },
        _touchend(e) {
          vcan.activMouse.mouseup(e, wid);
          e.preventDefault();
        },

        /**
         * @Class mousedown
         * setupCurrentTransform,  setActiveObject, setZindex kind of methods are called from this funciton
         * @param e is event object
         */

        mousedown(e, wId) {
          const clogo = document.getElementById('congrealogo');
          clogo.classList.add('disbaleOnmousedown');
          // var newpointer = vcan.utility.getReltivePoint(e);
          // console.log('Whiteboard position drag start x=' + e.offsetX + ' y=' + e.offsetY);

          if (Object.prototype.hasOwnProperty.call(e.detail, 'cevent') && (vcan.main.action !== 'create')) {
            // console.log('Whiteboard drag start before scale x=' + (e.detail.cevent.x - vcan.main.offset.x) + ' y=' + ( e.detail.cevent.y - vcan.main.offset.y));
            e = virtualclass.wb[wId].utility.putScrollWithCevent(e); // Page refresh
            e.clientX = vcan.main.offset.x + e.detail.cevent.x;
            e.clientY = vcan.main.offset.y + e.detail.cevent.y;
            e.x = vcan.main.offset.x + e.detail.cevent.x;
            e.y = vcan.main.offset.y + e.detail.cevent.y;
            e.pageX = vcan.main.offset.x + e.detail.cevent.x;
            e.pageY = vcan.main.offset.y + e.detail.cevent.y;
            e.currX = e.detail.cevent.x;
            e.currY = e.detail.cevent.y;
          }



          virtualclass.gObj.lastmousemovetime = null;
          this.moveChunk = []; // todo this should be remove

          if (vcan.main.action === 'move') {
            const vcanmain = vcan.main;
            if (vcanmain.currentTransform) {
              return;
            }
            var foundTarget = vcan.events().findTarget(e, wId);

            if (foundTarget) {
              if (vcan.main.children.length > 0) {
                foundTarget.setZindex();
              }
              foundTarget.downObj = true;
              foundTarget.setupCurrentTransform(e, wId);
              vcan.utility.setActiveObject(foundTarget);

              /** TODO VERY IMPORTANT
               * this is using at vcan.main.currObj, we should achive this thorugh
               * currentTransform at script.js and should be removed
               * from here
               */
              vcan.main.currObj = foundTarget;
            } else {
              vcan.deactivateAll();
            }

            if (foundTarget != null) {
              vcan.renderAll();
            }

            if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
              if (roles.hasControls()) {
                e = vcan.utility.updateCordinate(e, wId);
              }
              const currTime = new Date().getTime();
              const obj = vcan.makeStackObj(currTime, 'd', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));

              obj.x /= virtualclass.zoom.canvasScale;
              obj.y /= virtualclass.zoom.canvasScale;

              // console.log('Whiteboard drag start x=' + (e.clientX - vcan.main.offset.x) + ' y=' + ( e.clientY - vcan.main.offset.y) + ' x=' + (obj.x) + ' y=' + (obj.y));

              virtualclass.wb[wId].uid++;
              // console.log(`uid ${virtualclass.wb[wId].uid}`);
              obj.uid = virtualclass.wb[wId].uid;

              // obj = virtualclass.wb[wId].utility.putScrollPositionInObj(obj);


              vcan.main.replayObjs.push(obj);
              virtualclass.vutil.beforeSend({ repObj: [obj], cf: 'repObj' });
            }

            // these code run when user is trying to create particular object.
          } else if (vcan.main.action === 'create') {
            if (Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
              /** If user click on text to edit, we need to map the position according to
               *  current scale so we called putScrollWithCevent, foundText represents teacher clicks on text. We don't need
               *  to map the position when user creates the new text
               * * */
              if (Object.prototype.hasOwnProperty.call(e.detail, 'foundText')) {
                e = virtualclass.wb[wId].utility.putScrollWithCevent(e);
              }

              e.clientX = e.detail.cevent.x + (virtualclass.wb[wId].vcan.main.offset.x);
              e.clientY = e.detail.cevent.y + (virtualclass.wb[wId].vcan.main.offset.y);

              e.x = e.detail.cevent.x + (virtualclass.wb[wId].vcan.main.offset.x);
              e.y = e.detail.cevent.x + (virtualclass.wb[wId].vcan.main.offset.y);
              e.pageX = e.detail.cevent.x + (virtualclass.wb[wId].vcan.main.offset.x);
              e.pageY = e.detail.cevent.y + (virtualclass.wb[wId].vcan.main.offset.y);
              e.currX = e.detail.cevent.x;
              e.currY = e.detail.cevent.y;
            }

            // console.log('main offset X ' + virtualclass.wb[wId].vcan.main.offset.x);
            // console.log('main offset Y ' + virtualclass.wb[wId].vcan.main.offset.y);
            // console.dir(e);

            var foundTarget = vcan.events().findTarget(e, wId);

            if (foundTarget && foundTarget.type === 'text' && virtualclass.wb[wId].tool.cmd === `t_text${wId}`) {
              foundTarget.setupCurrentTransform(e);
            }
          }
        },
        /**
         * performs operation like rotating, scaling, dragging, renderAll
         * @param e is event object
         * very important function for framework
         */

        mousemove(e, wId) {
          // var newpointer = vcan.utility.getReltivePoint(e);

          if (Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
            if (vcan.main.action === 'move') {
              e = virtualclass.wb[wId].utility.putScrollWithCevent(e);
              // e = virtualclass.wb[wId].utility.scaleCordinate(e);
            }

            e.clientX = vcan.main.offset.x + e.detail.cevent.x;
            e.clientY = vcan.main.offset.y + e.detail.cevent.y;
            e.x = vcan.main.offset.x + e.detail.cevent.x;
            e.y = vcan.main.offset.y + e.detail.cevent.y;
            e.pageX = vcan.main.offset.x + e.detail.cevent.x;
            e.pageY = vcan.main.offset.y + e.detail.cevent.y;
            e.currX = e.detail.cevent.x;
            e.currY = e.detail.cevent.y;
          }

          // console.log('====> mouse x, y', e.currX, e.currY);

          // this condition is set because of performance reason
          // we don't want to execute below code when user is
          // drawing the object
          if (vcan.main.action === 'move') {
            // console.log('Whiteboard drag move x=' + newpointer.x + ' y=' + newpointer.y);
          //  let tempObj;// IMPORTANT this is the added during the UNIT TESTING, can be critical
            const obj = vcan.main;
            if (!obj.currentTransform) {

              // var target = vcan.events().findTarget(e);

              // this.moveChunk.push(obj.currentTransform.target);
            } else {
              // var pointer = vcan.utility.actualPointer(e),
              const pointer = vcan.utility.actualPointer(e, wId);

              const { x } = pointer;
              const { y } = pointer;

              obj.currentTransform.target.isMoving = true;

              if (obj.currentTransform.action === 'rotate') {
                vcan.interact.rotateObject(x, y);
                if (!obj.currentTransform.target.hasRotatingPoint) {
                  vcan.interact.scaleObject(x, y);
                }

                if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
                  vcan.optimize.doOptiMize(e, wId);
                }
              } else if (obj.currentTransform.action === 'scale') {
                if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
                  vcan.optimize.doOptiMize(e, wId);
                }
                vcan.interact.scaleObject(x, y);
              } else if (obj.currentTransform.action === 'scaleX') {
                if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
                  vcan.optimize.doOptiMize(e, wId);
                }
                vcan.interact.scaleObject(x, y, 'x');
              } else if (obj.currentTransform.action === 'scaleY') {
                if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
                  vcan.optimize.doOptiMize(e, wId);
                }
                vcan.interact.scaleObject(x, y, 'y');
              } else if (obj.currentTransform.target.draggable) {
                /** *
                   *  NOTE disabled during the unit testing
                   * vcan.main.mode = 'drag';
                   * */

                var tempTarget = vcan.extend({}, vcan.main.currentTransform.target);
                if (obj.currentTransform.target.downObj === true) {
                  vcan.main.dragMode = true;

                  /**
                     * multiuser is a flag used for removed the previous drawn data over the canvas
                     * this chunk of data would display for multi user only not for self user
                     * below block of code is handle to delete the object for multi user
                     */

                  // this.moveChunk = vcan.utility.setMoveChunk(this.moveChunk, currAdTime);
                  // can be critical if there is used
                  // vcan.main.starter_obj_id = obj.currentTransform.target.id;
                  obj.currentTransform.target.downObj = false;
                }

                var tempTarget = vcan.interact.translateObject(x, y);
                if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
                  vcan.optimize.doOptiMize(e, wId);
                }
                // console.log('Whiteboard drag move x=' + (e.clientX ) + ' y=' + (e.clientY));

                tempTarget.setActive(true);
                tempTarget.setCoords();
              }

              // push the object into replayObjs
              if (obj.currentTransform.action === 'scaleX' || obj.currentTransform.action === 'scaleY'
                || (obj.currentTransform.action === 'rotate' && !obj.currentTransform.target.hasRotatingPoint)) {
                vcan.main.scaleMode = true;

                // if (obj.currentTransform.target.downObj == true) {
                if (obj.currentTransform.target.downObj) {
                  obj.currentTransform.target.downObj = false;
                }
                var tempTarget = vcan.extend({}, vcan.main.currentTransform.target);
                tempTarget.setCoords();
              }

              vcan.renderAll();
            }
          }
        },
        /**
         * Sets co-ordination for particular object
         * @param e event object
         *  it occures when the mouse rellease over the canvas
         */
        mouseup(e, wId) {
          const removeclogo = document.getElementById('congrealogo');
          removeclogo.classList.remove('disbaleOnmousedown');
          if (Object.prototype.hasOwnProperty.call(e.detail, 'cevent')) {
            e.clientX = vcan.main.offset.x + e.detail.cevent.x;
            e.clientY = vcan.main.offset.y + e.detail.cevent.y;
            e.x = vcan.main.offset.x + e.detail.cevent.x;
            e.y = vcan.main.offset.y + e.detail.cevent.y;
            e.pageX = vcan.main.offset.x + e.detail.cevent.x;
            e.pageY = vcan.main.offset.y + e.detail.cevent.y;
            e.currX = e.detail.cevent.x;
            e.currY = e.detail.cevent.y;
          }

          virtualclass.gObj.lastmousemovetime = null;
          if (vcan.main.action === 'move') {
            vcan.activMouse.mousemove(e, wId);
            const mainCan = vcan.main;
            if (mainCan.currentTransform) {
              const transform = mainCan.currentTransform;
              const { target } = transform;
              if (target.scaling) {
                target.scaling = false;
              }

              // determine the new coords everytime the image changes its position
              // after enabled this statement the drag, drop and rotate function have been smoothed.
              let i = mainCan.children.length;
              while (i--) {
                mainCan.children[i].setCoords(); // todo should think about this statment
              }
            }

            // TODO this object should not be but null but empty
            mainCan.currentTransform = null;
            vcan.renderAll();

            // every time(either the action in scale or drag mode) there would be checked that if the object is existing
            //  which have to be deleted duplicate object
            if (vcan.main.dragMode === true || vcan.main.scaleMode === true) {
              if (roles.hasControls()) {
                e = vcan.utility.updateCordinate(e, wId);
              }

              var currTime = new Date().getTime();
              if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')
                || (Object.prototype.hasOwnProperty.call(e.detail, 'cevent')
                && Object.prototype.hasOwnProperty.call(e.detail, 'broadCast'))) {
                vcan.optimize.calculatePackets(currTime, 'u', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
              }

              // if (vcan.main.dragMode == true) {
              if (vcan.main.dragMode) {
                vcan.main.dragMode = false;
              }

              // if (vcan.main.scaleMode == true) {
              if (vcan.main.scaleMode) {
                vcan.main.scaleMode = false;
              }
            } else if (!Object.prototype.hasOwnProperty.call(e.detail, 'cevent')
              && Object.prototype.hasOwnProperty.call(e.detail, 'cevent')
              && Object.prototype.hasOwnProperty.call(e.detail, 'broadCast')) {
              vcan.optimize.calculatePackets(currTime, 'u', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
            }
            vcan.wb.sentPack = true;
          }
        },
      };
    };
  }

  window.Mouse = Mouse;
}(window));
