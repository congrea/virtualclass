// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
let newScrollVal = 0;
(function (window) {
  function vcanUtility(id) {
    const { vcan } = virtualclass.wb[id];

    vcan.utility = {
      /**
       * sCalculates canvas element offset relative to the document
       * @param cid is canvas's id
       * @return {offset} calculated value value
       */
      canvasCalcOffset(cid) {
        const vcanMain = vcan.main;
        // TODO cid should be happened as in fabric
        const canvasEl = document.getElementById(cid);

        const offset = vcan.utility.getElementOffset(canvasEl);
        // If offset is 0 then we have to give default offset
        // if(roles.hasControls() && offset.x == 0){
        if (roles.hasControls() && offset.x == 0) {
          offset.x = 53;
          offset.y = 48;
        }
        vcanMain.offset = offset;
        //    vcanMain.offset.x = 0;
        return offset;
      },
      /**
       * Returns offset for a given element
       * @method getElementOffset
       * @param {HTMLElement} element Element to get offset for
       * @return {Object} Object with "left" and "top" properties
       */
      getElementOffset(element) {
        // console.log(element.id + " should second ");
        // TODO : need to fix this method
        let valueT = 0; let
          valueL = 0;
        do {
          valueT += element.offsetTop || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        }
        while (element);
        return ({ x: valueL, y: valueT });
      },
      /**
       * this function does set the value on property of passed object
       * @param obj expect object on which the property of value should be stored
       * @param property expects the property name on which the value would be stored
       * @param the value would be stored on property of object
       * TODO this function should transfer to object method
       */
      setVal(obj, property, value) {
        const shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < obj.MIN_SCALE_LIMIT;
        if (shouldConstrainValue) {
          value = obj.MIN_SCALE_LIMIT;
        }
        if (typeof property === 'object') {
          for (const prop in property) {
            vcan.utility.setVal(obj, prop, property[prop]);
          }
        } else if (property === 'angle') {
          vcan.utility.setAngle(obj, value);
        } else {
          obj[property] = value;
        }

        return obj;
      },
      /**
       *  This function returns the value with passed property from passed object
       *  @param obj expects the object
       *  @property expects the property name
       *  return the value
       *  TODO this function should transfer to object method
       */
      getVal(obj, property) {
        return obj[property];
      },
      /**
       * Sets object's angle
       * @param value {Number} angle value
       * @return {Object} thisArg
       */
      setAngle(obj, value) {
        obj.theta = value / 180 * Math.PI;
        obj.angle = value;
        return obj;
      },
      /**
       * Gets the actual horizontal and vertical position
       * expects as event object as parameter
       * @param event is event object
       * returns horizontal and vertical position
       */
      actualPointer(event, wId) {
        // if (wId == undefined) {
        //   debugger;
        // }
        // console.log('===> suman wb id ', wId);
        // TODO this method needs fixing
        // virtualclass.leftPosX defines the scroll position from left side
        // virtualclass.topPosY defines the scroll position from top side
        let posY = 0;
        let posX = 0;
        if (wId != null) {
          if (typeof virtualclass.pdfRender[wId].topPosY === 'undefined') {
            posY = 0;
          } else {
            posY = virtualclass.pdfRender[wId].topPosY;
          }

          if (typeof virtualclass.pdfRender[wId].leftPosX === 'undefined') {
            posX = 0;
          } else {
            posX = virtualclass.pdfRender[wId].leftPosX;
          }
        }
        return { x: vcan.utility.pointerX(event) + posX, y: vcan.utility.pointerY(event) + posY };
      },
      /**
       * Gets the actual horizontal position
       * expects as event object as parameter
       * @param event is event object
       * returns horizontal position
       */
      pointerX(event) {
        const ev = event.type.indexOf('touch') >= 0 ? 'touch' : 'mouse';
        // console.log('Actual pointer clientX ' + event.clientX);
        /* TODO follow the standard as framework done */
        const docElement = document.documentElement;
        const body = document.body || { scrollLeft: 0 };
        // looks like in IE (<9) clientX at certain point (apparently when mouseup fires on VML element)
        // is represented as COM object, with all the consequences, like "unknown" type and error on [[Get]]
        // need to investigate later
        // todo to simplify
        if (ev === 'mouse') {
          return ((typeof event.clientX !== 'undefined' ? event.clientX : 0)
          + (docElement.scrollLeft || body.scrollLeft)
          - (docElement.clientLeft || 0));
        } if (event.type === 'touchend') {
          return ((event.changedTouches[0] && typeof event.changedTouches[0].clientX !== 'undefined' ? event.changedTouches[0].clientX : 0)
            + (docElement.scrollLeft || body.scrollLeft)
            - (docElement.clientLeft || 0));
        }
        return ((event.targetTouches[0] && typeof event.targetTouches[0].clientX !== 'undefined' ? event.targetTouches[0].clientX : 0)
            + (docElement.scrollLeft || body.scrollLeft)
            - (docElement.clientLeft || 0));
      },
      // /**
      //  * Gets the actual vertical position
      //  * expects as event object as parameter
      //  * @param is an event object
      //  * returns vertical position
      //  */
      // pointerYOld(event) {
      //   /* TODO follow the standard as framework done */
      //   const docElement = document.documentElement;
      //   const body = document.body || { scrollTop: 0 };
      //
      //   return ((typeof event.clientY !== 'unknown' ? event.clientY : 0)
      //   + (docElement.scrollTop || body.scrollTop)
      //   - (docElement.clientTop || 0));
      // },

      pointerY(event) {
        const ev = event.type.indexOf('touch') >= 0 ? 'touch' : 'mouse';
        // console.log('Actual pointer clientY ' + event.clientY);
        /* TODO follow the standard as framework done */
        const docElement = document.documentElement;
        const body = document.body || { scrollTop: 0 };
        newScrollVal = (docElement.scrollTop || body.scrollTop) - (docElement.clientTop || 0);
        // if(!roles.hasControls()){
        //     newScrollVal = 0;
        // }
        if (ev === 'mouse') {
          return (typeof event.clientY !== 'undefined' ? event.clientY : 0) + newScrollVal;
        } if (event.type === 'touchend') {
          return (event.changedTouches[0] && typeof event.changedTouches[0].clientY !== 'undefined' ? event.changedTouches[0].clientY : 0) + newScrollVal;
        }
        return (event.targetTouches[0] && typeof event.targetTouches[0].clientY !== 'undefined' ? event.targetTouches[0].clientY : 0) + newScrollVal;
      },
      /**
       * Returns pointer coordinates relative to canvas.
       * @method getReltivePoint
       * @param e is ean event object
       * @return {Object} object with "x" and "y" number values
       */

      getReltivePoint(e, wId) {
        const { offset } = vcan.main;
        const pointer = vcan.utility.actualPointer(e, wId);
        // console.log('whiteboard canvas offset x = ' + (pointer.x - offset.x) + ' y =' + (pointer.y - offset.y));
        return {
          x: (pointer.x - offset.x),
          y: (pointer.y - offset.y),
        };
      },
      /**
       * Transforms degrees to radians.
       * @static
       * @method degreesToRadians
       * @param {Number} degrees value in degrees
       * @return {Number} value in radians
       */
      degreesToRadians(degrees) {
        const PiBy180 = Math.PI / 180;
        return degrees * PiBy180;
      },
      /**
       * Sets given object as active object
       * @method setActiveObject
       * @param object is the object which have to be active
       * @returns return particular that object
       */
      setActiveObject(object) {
        if (vcan.main.activeObject) {
          vcan.main.activeObject.setActive(false);
        }
        vcan.main.activeObject = object;
        object.setActive(true);
        return object;
      },
      // /* TODO this funciton should be optimized in future
      //  this function should be done properly
      //  this is not good way to talk	it woulld be greater if we can ignore this function */
      // updateObj(obj) {
      //   const newObj = {};
      //   for (prop in obj) {
      //     if (prop != 'oCoords') {
      //       newObj[prop] = obj[prop];
      //     } else {
      //       newObj.start = {};
      //       newObj.end = {};
      //       newObj.start.x = obj[prop].tl.x;
      //       newObj.start.y = obj[prop].tl.y;
      //       newObj.end.x = obj[prop].br.x;
      //       newObj.end.y = obj[prop].br.y;
      //     }
      //   }
      //   return newObj;
      // },
      // /*
      //  * imporant right now this funciton is not using
      //  */
      // /**
      //  * Sets the cursor depending on where the canvas is being hovered.
      //  * Note: very buggy in Opera
      //  * @method setCursorFromEvent
      //  * @param e {Event} Event object
      //  * @param target {Object} Object that the mouse is hovering, if so.
      //  */
      //
      // setCursorFromEvent(vcanMain, e, target) {
      //   const s = vcanMain.upperCanvasEl.style;
      //   if (!target) {
      //     s.cursor = this.defaultCursor;
      //     return false;
      //   }
      //   const corner = target.findTargetCorner(e);
      //   if (!corner) {
      //     s.cursor = vcanMain.hoverCursor;
      //   } else if (corner in vcanMain.cursorMap) {
      //     s.cursor = vcanMain.cursorMap[corner];
      //   } else if (corner === 'mtr' && target.hasRotatingPoint) {
      //     s.cursor = vcanMain.rotationCursor;
      //   } else {
      //     s.cursor = this.defaulCursor;
      //     return false;
      //   }
      //
      //   return true;
      // },
      // /**
      //  * this function returns the number object
      //  * those have created on canavas
      //  * TODO this function should used
      //  * instead of vcan.main.children
      //  */
      // getChildren() {
      //   return vcan.main.children;
      // },
      //
      // isCeventExist(event) {
      //   if (Object.prototype.hasOwnProperty.call(event, 'detail')) {
      //     return Object.prototype.hasOwnProperty.call(event, 'cevent');
      //   }
      //   return false;
      // },

      updateCordinate(e, wId) {
        const pointer = vcan.utility.actualPointer(e, wId);
        const customEve = {};
        customEve.detail = {}; // that should be elimanted
        customEve.clientX = pointer.x;
        customEve.clientY = pointer.y;
        return customEve;
      },
    };
  }

  window.vcanUtility = vcanUtility;
}(window));
