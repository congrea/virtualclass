// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var io = window.io;

    /**
     * This is core object on which
     * all the  properties and methods  would initiated
     * eg:- vcan.extend(), eg:- vcan.main.currentTransform
     */
    var vcan = {
        //TODO these are constant value should be at proper place
        cmdWrapperDiv: 'commandToolsWrapper',
        /** extracts the canvas id
         * @param canvasId is canvas id
         * @returns {vcan.main}
         */
        create: function (canvasId) {
            if (canvasId.charAt(0) == '#') {
                var cid = canvasId.substring(1, canvasId.length);
                vcan.utility.canvasCalcOffset(cid);

                return new vcan.main(canvasId);
            } else {
                console.log("there is a problem with canvas id");
            }
        },
        /**
         *    initiates the various properties to vcan.main
         *  call mouse.init() function
         *  @param canvid is canvas's id
         */
        main: function (canvid) {
            vcan.main.children = []; //vcan.main should be converted into 'this' variable
            vcan.main.id = 0;
            vcan.main.uid = 0;
            vcan.main.canvas = document.querySelector(canvid);
            vcan.main.canid = canvid.substring(1, canvid.length);
            vcan.main.currentTransform = "";

            /**
             NOTE:- this can be critical
             it is disabled during the unit test
             vcan.main.upperCanvasEl = {};
             **/
            vcan.main.replayObjs = [];
            vcan.main.dragMode = false;
            vcan.main.scaleMode = false;
            vcan.main.usrCurrAction = "";
            vcan.main.currObj = ""; // TODO this should be achieved  through the vcan.main.currentTransform; this one

            vcan.main.textObj = false;
            vcan.main.action = 'create';  //the vcan.main.action should be change into another name eg:- vcan.main.cMode or anything else
            vcan.wb = {};
            vcan.wb.sentPack = false;
            vcan.activMouse = new vcan.mouse();
            vcan.activMouse.init();
        },
        /**
         * The function merge the property of passed second object to passed first object
         * and return the first object.
         * @param fobj on which the other properties would be merged
         * @param sobj the properties of object to be merged into fobj
         * TODO inside this function we are not replacing the same name from sobj to fobj but it updates it's property name from sobj to fobj
         * TODO this function should do optimization
         */
        extend: function (fobj, sobj) {
            if ((typeof fobj == 'object') && (typeof sobj == 'object')) {
                for (var prop in sobj) {
                    fobj[prop] = sobj[prop];
                }
                return fobj;
            } else {
                console.log("it seems that the arguments you passed are not object");
            }
        },
        /**
         * the particular obejct by rotating and scaling
         * @param ctx specified context
         * @param obj particular object
         * TODO this function should contain into the object
         */
        transform: function (ctx, obj) {
            ctx.translate(obj.x, obj.y);
            ctx.rotate(obj.theta);
            ctx.scale(
                obj.scaleX * (obj.flipX ? -1 : 1),
                obj.scaleY * (obj.flipY ? -1 : 1)
            );
        },
        /**
         * get the states of property of vcan.main
         * @param pname expects as a property name
         * returns the states of property
         */
        getStates: function (pname) {
            return vcan.main[pname];
        },
        /**
         * set the value of property to vcan.main
         * @param pname expects as a property name
         * returns the states of property
         */

        setValInMain: function (pname, value) {
            return vcan.main[pname] = value;
        },
        /**
         * get the position of object which is exist under the array
         * @param a sets for array of object where
         * @param fnc sets for comparison of properties of object
         */
        ArrayIndexOf: function (a, fnc) {
            if (!fnc || typeof (fnc) != 'function') {
                return -1;
            }
            if (!a || !a.length || a.length < 1) {
                return -1;
            }
            for (var i = 0; i < a.length; i++) {
                if (fnc(a[i])) {
                    return i;
                }
            }
            return -1;
        },
        /**
         * @method renderAll Renders all Object
         *
         */
        renderAll: function (ctx) {
            var length = vcan.main.children.length;

            if (typeof ctx != 'object') {
                var ctx = vcan.main.canvas.getContext('2d');
            }
            var canelem = vcan.main.canvas;
            vcan.clearContext(ctx);

            if (length) {
                for (var i = 0; i < length; ++i) {
                    var vcanvas = vcan.main.canvas;
                    if (vcan.main.children[i].type == 'freeDrawing') {
                        vcan.fhdRender(ctx, vcan.main.children[i]);
                    } else {
                        vcan.render(ctx, vcan.main.children[i]);
                    }
                }
            }
        },
        /**
         * Clears specified context of canvas element
         * @method clearContext
         * @param ctx  is specified context
         * return canvas element
         */
        clearContext: function (ctx) {
            var canElem = vcan.main.canvas;
            ctx.clearRect(0, 0, canElem.width, canElem.height);
            return canElem;
        },
        /**
         * Deactivates all objects by calling their setActive(false)
         * @method deactivateAll
         */
        deactivateAll: function () {
            var allObjects = vcan.main.children,
                i = 0,
                len = allObjects.length;
            for (; i < len; i++) {
                allObjects[i].setActive(false);
            }
        }
    };

    /**
     * initializes the functions for displayed(rendered) object,
     * here the displayed object means the object has been displayed into browsers
     * eg:- dragDrop(), setCoords()
     * @param object on which the operation would performed
     */
    vcan.makeDispObject = function (obj) {
        return {
            coreObj: obj,
            //TODO this function should be removed
            bind: function (evtype, handler) {
                this.addEventListener('on' + evtype, handler);
            }
        };
    };

    /**
     * Removes the passed object from canvas
     *  @param obj remvoe this object
     *  TODO it can return the index of object which is deleted
     */
    vcan.remove = function (obj) {
        var vcanvas = vcan.main.canvas;
        /**
         * multiuser is a flag used for removed the previous drawn data over the canvas
         * this chunk of data would display for multi user only not for self user
         */
        var rindex = vcan.ArrayIndexOf(vcan.main.children, function (pobj) {
            return pobj.id == obj.id && (pobj.mt == obj.mt || obj.multiuser == true)
        });
        if (rindex >= 0) {
            vcan.main.children.splice(rindex, 1);
        }

        var height = vcanvas.height;
        var width = vcanvas.width;
        var ctx = vcanvas.getContext('2d');
        ctx.beginPath();
        ctx.clearRect(0, 0, width, height);
        ctx.closePath();

        vcan.renderAll();
    };

    /**
     *  draws object, transform object, draws border on object
     * @param ctx context of canvas
     * @param obj all operation operated over this object
     * @param noTransform is undefined value
     */
    vcan.render = function (ctx, obj, noTransform) {
        ctx.beginPath(); //this added just now 25/9/13
        ctx.save();
        if (ctx.lineWidth !== undefined) {
            ctx.lineWidth = obj.lineWidth;
        } else {
            ctx.lineWidth = 2;
        }
        if (!noTransform) {
            vcan.transform(ctx, obj);
        }
        if (obj.borderColor != undefined) {
            ctx.strokeStyle = obj.borderColor;
        } else {
            ctx.strokeStyle = '#000000';
        }

        drawObject(ctx, obj, noTransform);

        if (obj.active && !noTransform) {
            obj.drawBorders(ctx);
            obj.hideCorners || obj.drawCorners(ctx);
        }
        ctx.closePath();
        ctx.restore();

    };

    /**
     * this function draws the object
     * itdentify the shich draw function should be called for particualr object
     * @param ctx current context of canvas on which the object would drawn
     * @param obj the object would be drawn
     *
     */

    var drawObject = function (ctx, obj, noTransform) {
        if (obj.type == 'rectangle') {
            vcan.objRect.draw(ctx, obj, noTransform);
        } else if (obj.type == 'line') {
            vcan.objLine.draw(ctx, obj, noTransform);
        } else if (obj.type == 'oval') {
            vcan.objOval.draw(ctx, obj, noTransform);
        } else if (obj.type == 'triangle') {
            vcan.objTri.draw(ctx, obj, noTransform);
        } else if (obj.type == 'text') {
            vcan.objTxt.draw(ctx, obj, noTransform);
        }
    };

    /***
     *  this function display the free draw object
     *  it is the copy of render function
     *  this function is created after store the objects into local storage
     *  that we can not pass the function into JSON.strinfigy for multi user
     * */
        //TODO this function should be into free draw object
    vcan.fhdRender = function (ctx, obj, noTransform) {
        ctx.save();
        var m = obj.transformMatrix;
        if (m) {
            ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
        }
        if (!noTransform) {
            vcan.transform(ctx, obj);
        }

        if (obj.overlayFill) {
            ctx.fillStyle = obj.overlayFill;
        }
        else if (obj.fill) {
            ctx.fillStyle = obj.fill;
        }

        if (obj.stroke) {
            ctx.strokeStyle = obj.stroke;
        }
        ctx.beginPath();
        fdMainRender(ctx, obj);
        if (obj.fill) {
            ctx.fill();
        }
        if (obj.stroke) {
            ctx.strokeStyle = obj.stroke;
            ctx.lineWidth = obj.strokeWidth;
            ctx.lineCap = ctx.lineJoin = 'round';
            ctx.stroke();
        }
        if (!noTransform && obj.active) {
            obj.drawBorders(ctx);
            obj.hideCorners || obj.drawCorners(ctx);
        }
        ctx.restore();
    };

    /*
     * this function display the co-ordinate for free draw
     *  it is the copy of _render function
     * */
    function fdMainRender(ctx, obj) {
        var current, // current instruction
            x = 0, // current x
            y = 0, // current y
            controlX = 0, // current control point x
            controlY = 0, // current control point y
            tempX,
            tempY,
            l = -(obj.width / 2),
            t = -(obj.height / 2);

        for (var i = 0, len = obj.path.length; i < len; ++i) {
            current = obj.path[i];

            switch (current[0]) { // first letter
                case 'L': // lineto, absolute
                    x = current[1];
                    y = current[2];
                    ctx.lineTo(x + l, y + t);
                    break;

                case 'M': // moveTo, absolute
                    x = current[1];
                    y = current[2];
                    ctx.moveTo(x + l, y + t);
                    break;

                    ctx.closePath();
                    break;
            }
        }
    }

    vcan.makeStackObj = function (time, action, x, y) {
        var obj = {'mt': time, 'ac': action, 'x': x, 'y': y};
        return obj;
    };
    window.vcan = vcan;
})(window, document);