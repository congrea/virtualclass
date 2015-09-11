// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;
    vcan.utility = {
        /**
         * Calculates canvas element offset relative to the document
         * @param cid is canvas's id
         * @return {offset} calculated value value
         */
        canvasCalcOffset: function (cid) {
            /*alert('suman');
             debugger; */
            var vcanMain = vcan.main;
            //TODO cid should be happened as in fabric
            var canvasEl = document.getElementById(cid);
            var offset = vcan.utility.getElementOffset(canvasEl);
            vcanMain.offset = offset;
            return offset;
        },
        /**
         * Returns offset for a given element
         * @method getElementOffset
         * @param {HTMLElement} element Element to get offset for
         * @return {Object} Object with "left" and "top" properties
         */
        getElementOffset: function (element) {
            //console.log(element.id + " should second ");
            // TODO : need to fix this method
            var valueT = 0, valueL = 0;
            do {
                valueT += element.offsetTop || 0;
                valueL += element.offsetLeft || 0;
                element = element.offsetParent;
            }
            while (element);
            return ({x: valueL, y: valueT});
        },
        /**
         * this function does set the value on property of passed object
         * @param obj expect object on which the property of value should be stored
         * @param property expects the property name on which the value would be stored
         * @param the value would be stored on property of object
         * TODO this function should transfer to object method
         */
        setVal: function (obj, property, value) {
            var shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < obj.MIN_SCALE_LIMIT;
            if (shouldConstrainValue) {
                value = obj.MIN_SCALE_LIMIT;
            }
            if (typeof property == 'object') {
                for (var prop in property) {
                    vcan.utility.setVal(obj, prop, property[prop]);
                }
            }
            else {
                if (property === 'angle') {
                    vcan.utility.setAngle(obj, value);
                }
                else {
                    obj[property] = value;
                }
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
        getVal: function (obj, property) {
            return obj[property];
        },
        /**
         * Sets object's angle
         * @param value {Number} angle value
         * @return {Object} thisArg
         */
        setAngle: function (obj, value) {
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
        actualPointer: function (event) {
            // TODO this method needs fixing
            return {x: vcan.utility.pointerX(event), y: vcan.utility.pointerY(event)};
        },
        /**
         * Gets the actual horizontal position
         * expects as event object as parameter
         * @param event is event object
         * returns horizontal position
         */
        pointerX: function (event) {
            /* TODO follow the standard as framework done */
            var docElement = document.documentElement,
                body = document.body || {scrollLeft: 0};
            // looks like in IE (<9) clientX at certain point (apparently when mouseup fires on VML element)
            // is represented as COM object, with all the consequences, like "unknown" type and error on [[Get]]
            // need to investigate later
            return event.pageX || ((typeof event.clientX != 'unknown' ? event.clientX : 0) +
                (docElement.scrollLeft || body.scrollLeft) -
                (docElement.clientLeft || 0));

        },
        /**
         * Gets the actual vertical position
         * expects as event object as parameter
         * @param is an event object
         * returns vertical position
         */
        pointerY: function (event) {
            /*TODO follow the standard as framework done*/
            var docElement = document.documentElement,
                body = document.body || {scrollTop: 0};
            return event.pageY || ((typeof event.clientY != 'unknown' ? event.clientY : 0) +
                (docElement.scrollTop || body.scrollTop) -
                (docElement.clientTop || 0));

        },
        /**
         * Returns pointer coordinates relative to canvas.
         * @method getReltivePoint
         * @param e is ean event object
         * @return {Object} object with "x" and "y" number values
         */

        getReltivePoint: function (e) {
            var offset = vcan.main.offset;
            var pointer = vcan.utility.actualPointer(e);
            return {
                x: pointer.x - offset.x,
                y: pointer.y - offset.y
            };
        },
        /**
         * Transforms degrees to radians.
         * @static
         * @method degreesToRadians
         * @param {Number} degrees value in degrees
         * @return {Number} value in radians
         */
        degreesToRadians: function (degrees) {
            var PiBy180 = Math.PI / 180;
            return degrees * PiBy180;
        },
        /**
         * Sets given object as active object
         * @method setActiveObject
         * @param object is the object which have to be active
         * @returns return particular that object
         */
        setActiveObject: function (object) {
            if (vcan.main.activeObject) {
                vcan.main.activeObject.setActive(false);
            }
            vcan.main.activeObject = object;
            object.setActive(true);
            return object;
        },
        /* TODO this funciton should be optimized in future
         this function should be done properly
         this is not good way to talk	it woulld be greater if we can ignore this function */
        updateObj: function (obj) {
            var newObj = {};
            for (prop in obj) {
                if (prop != 'oCoords') {
                    newObj[prop] = obj[prop];
                } else {
                    newObj.start = {};
                    newObj.end = {};
                    newObj.start.x = obj[prop].tl.x;
                    newObj.start.y = obj[prop].tl.y;
                    newObj.end.x = obj[prop].br.x;
                    newObj.end.y = obj[prop].br.y;
                }
            }
            return newObj;
        },
        /*
         * imporant right now this funciton is not using
         */
        /**
         * Sets the cursor depending on where the canvas is being hovered.
         * Note: very buggy in Opera
         * @method setCursorFromEvent
         * @param e {Event} Event object
         * @param target {Object} Object that the mouse is hovering, if so.
         */

        setCursorFromEvent: function (vcanMain, e, target) {
            var s = vcanMain.upperCanvasEl.style;
            if (!target) {
                s.cursor = this.defaultCursor;
                return false;
            } else {
                var corner = target.findTargetCorner(e);
                if (!corner) {
                    s.cursor = vcanMain.hoverCursor;
                }
                else {
                    if (corner in vcanMain.cursorMap) {
                        s.cursor = vcanMain.cursorMap[corner];
                    } else if (corner === 'mtr' && target.hasRotatingPoint) {
                        s.cursor = vcanMain.rotationCursor;
                    } else {
                        s.cursor = this.defaulCursor;
                        return false;
                    }
                }
            }
            return true;
        },
        /**
         * this function returns the number object
         * those have created on canavas
         * TODO this function should used
         * instead of vcan.main.children
         */
        getChildren: function () {
            return vcan.main.children;
        }
    }
})(window);