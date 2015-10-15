// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var vcan = window.vcan;
    vcan.mouse = function () {
        return {
            init: function () {
                this.bindHandlers();

            },
            /**
             * Attach the various event handlers onto canvas
             * eg: mousedown, mouseup
             */
            bindHandlers: function () {
                canvasElement = vcan.main.canvas;
                //TODO the types should be store into main/core funtion
                // the place of this object should not be here
                var types = {
                    'mousedown': 'mousedown',
                    'mousemove': 'mousemove',
                    'mouseup': 'mouseup'
                };

                for (type in types) {
                    if (type == 'mousedown') {
                        canvasElement.addEventListener(type, this.mousedown, false);
                    } else if (type == 'mousemove') {
                        canvasElement.addEventListener(type, this.mousemove, false);
                    } else if (type == 'mouseup') {
                        canvasElement.addEventListener(type, this.mouseup, false);
                    }
                }
            },
            /**
             * @Class mousedown
             * setupCurrentTransform,  setActiveObject, setZindex kind of methods are called from this funciton
             * @param e is event object
             */
            mousedown: function (e, cobj) {

                if (e.detail.hasOwnProperty('cevent') && (vcan.main.action != 'create')) {
                    e.clientX = vcan.main.offset.x + e.detail.cevent.x;
                    e.clientY = vcan.main.offset.y + e.detail.cevent.y;
                    e.x = vcan.main.offset.x + e.detail.cevent.x;
                    e.y = vcan.main.offset.y + e.detail.cevent.y;
                    e.pageX = vcan.main.offset.x + e.detail.cevent.x;
                    e.pageY = vcan.main.offset.y + e.detail.cevent.y;
                    e.currX = e.detail.cevent.x;
                    e.currY = e.detail.cevent.y;
                }

                lastmousemovetime = null;
                this.moveChunk = []; //todo this should be remove

                if (vcan.main.action == 'move') {
                    var vcanmain = vcan.main;
                    if (vcanmain.currentTransform) {
                        return;
                    }
                    var foundTarget = vcan.events().findTarget(e),
                        pointer = vcan.utility.getReltivePoint(e);
                    if (foundTarget) {
                        if (vcan.main.children.length > 0) {
                            foundTarget.setZindex();
                        }
                        foundTarget.downObj = true;
                        foundTarget.setupCurrentTransform(e);
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

                    if (foundTarget != undefined) {
                        vcan.renderAll();
                    }

                    if (!e.detail.hasOwnProperty('cevent')) {
                        var currTime = new Date().getTime();
                        var obj = vcan.makeStackObj(currTime, 'd', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                        virtualclass.wb.uid++;
                        console.log('uid ' + virtualclass.wb.uid);
                        obj.uid = virtualclass.wb.uid;
                        vcan.main.replayObjs.push(obj);
                        virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
                    }

                    //these code run when user is trying to create particular object.
                } else if (vcan.main.action == 'create') {
                    if (e.detail.hasOwnProperty('cevent')) {
                        e.clientX = e.detail.cevent.x + (virtualclass.wb.vcan.main.offset.x);
                        e.clientY = e.detail.cevent.y + (virtualclass.wb.vcan.main.offset.y);

                        e.x = e.detail.cevent.x + (virtualclass.wb.vcan.main.offset.x);
                        e.y = e.detail.cevent.x + (virtualclass.wb.vcan.main.offset.y);
                        e.pageX = e.detail.cevent.x + (virtualclass.wb.vcan.main.offset.x);
                        e.pageY = e.detail.cevent.y + (virtualclass.wb.vcan.main.offset.y);
                        e.currX = e.detail.cevent.x;
                        e.currY = e.detail.cevent.y;
                    }

                    var foundTarget = vcan.events().findTarget(e),
                        pointer = vcan.utility.getReltivePoint(e);

                    if (foundTarget && foundTarget.type == 'text' && virtualclass.wb.tool.cmd == 't_text') {
                        foundTarget.setupCurrentTransform(e);
                    }
                }

            },
            /**
             * performs operation like rotating, scaling, dragging, renderAll
             * @param e is event object
             * very important function for framework
             */

            mousemove: function (e) {
                if (e.detail.hasOwnProperty('cevent')) {
                    e.clientX = vcan.main.offset.x + e.detail.cevent.x;
                    e.clientY = vcan.main.offset.y + e.detail.cevent.y;
                    e.x = vcan.main.offset.x + e.detail.cevent.x;
                    e.y = vcan.main.offset.y + e.detail.cevent.y;
                    e.pageX = vcan.main.offset.x + e.detail.cevent.x;
                    e.pageY = vcan.main.offset.y + e.detail.cevent.y;
                    e.currX = e.detail.cevent.x;
                    e.currY = e.detail.cevent.y;
                }

                // this condition is set because of performance reason
                // we don't want to execute below code when user is
                // drawing the object
                if (vcan.main.action == 'move') {
                    var tempObj;//IMPORTANT this is the added during the UNIT TESTING, can be critical
                    var obj = vcan.main;
                    if (!obj.currentTransform) {
                        var target = vcan.events().findTarget(e);

                        //this.moveChunk.push(obj.currentTransform.target);
                    } else {
                        var pointer = vcan.utility.actualPointer(e),
                            x = pointer.x,
                            y = pointer.y;

                        obj.currentTransform.target.isMoving = true;

                        if (obj.currentTransform.action === 'rotate') {
                            vcan.interact.rotateObject(x, y);
                            if (!obj.currentTransform.target.hasRotatingPoint) {
                                vcan.interact.scaleObject(x, y);
                            }

                            if (!e.detail.hasOwnProperty('cevent')) {
                                vcan.optimize.doOptiMize(e);
                            }
                        } else if (obj.currentTransform.action === 'scale') {
                            if (!e.detail.hasOwnProperty('cevent')) {
                                vcan.optimize.doOptiMize(e);
                            }
                            vcan.interact.scaleObject(x, y);
                        } else if (obj.currentTransform.action === 'scaleX') {
                            if (!e.detail.hasOwnProperty('cevent')) {
                                vcan.optimize.doOptiMize(e);
                            }
                            vcan.interact.scaleObject(x, y, 'x');
                        } else if (obj.currentTransform.action === 'scaleY') {
                            if (!e.detail.hasOwnProperty('cevent')) {
                                vcan.optimize.doOptiMize(e);
                            }
                            vcan.interact.scaleObject(x, y, 'y');
                        } else {
                            if (obj.currentTransform.target.draggable) {

                                /***
                                 *  NOTE disabled during the unit testing
                                 * vcan.main.mode = 'drag';
                                 * */

                                var tempTarget = vcan.extend({}, vcan.main.currentTransform.target);

                                var currAdTime = new Date().getTime();
                                if (obj.currentTransform.target.downObj == true) {
                                    vcan.main.dragMode = true;

                                    /**
                                     * multiuser is a flag used for removed the previous drawn data over the canvas
                                     * this chunk of data would display for multi user only not for self user
                                     * below block of code is handle to delete the object for multi user
                                     */

                                        //this.moveChunk = vcan.utility.setMoveChunk(this.moveChunk, currAdTime);
                                        //can be critical if there is used
                                        //vcan.main.starter_obj_id = obj.currentTransform.target.id;
                                    obj.currentTransform.target.downObj = false;

                                }

                                var tempTarget = vcan.interact.translateObject(x, y);
                                if (!e.detail.hasOwnProperty('cevent')) {
                                    vcan.optimize.doOptiMize(e);
                                }

                                tempTarget.setActive(true);
                                tempTarget.setCoords();

                            }
                        }

                        //push the object into replayObjs
                        if (obj.currentTransform.action === 'scaleX' || obj.currentTransform.action === 'scaleY' ||
                            (obj.currentTransform.action === 'rotate' && !obj.currentTransform.target.hasRotatingPoint)) {
                            vcan.main.scaleMode = true;

                            var currAdTime = new Date().getTime();
                            //if (obj.currentTransform.target.downObj == true) {
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
            mouseup: function (e) {
                if (e.detail.hasOwnProperty('cevent')) {
                    e.clientX = vcan.main.offset.x + e.detail.cevent.x;
                    e.clientY = vcan.main.offset.y + e.detail.cevent.y;
                    e.x = vcan.main.offset.x + e.detail.cevent.x;
                    e.y = vcan.main.offset.y + e.detail.cevent.y;
                    e.pageX = vcan.main.offset.x + e.detail.cevent.x;
                    e.pageY = vcan.main.offset.y + e.detail.cevent.y;
                    e.currX = e.detail.cevent.x;
                    e.currY = e.detail.cevent.y;
                }
                lastmousemovetime = null;
                if (vcan.main.action == 'move') {
                    vcan.activMouse.mousemove(e);
                    var mainCan = vcan.main;
                    if (mainCan.currentTransform) {
                        var transform = mainCan.currentTransform,
                            target = transform.target;
                        if (target.scaling) {
                            target.scaling = false;
                        }

                        // determine the new coords everytime the image changes its position
                        //after enabled this statement the drag, drop and rotate function have been smoothed.
                        var i = mainCan.children.length;
                        while (i--) {
                            mainCan.children[i].setCoords(); //todo should think about this statment
                        }
                    }

                    //TODO this object should not be but null but empty
                    mainCan.currentTransform = null;
                    vcan.renderAll();

                    // every time(either the action in scale or drag mode) there would be checked that if the object is existing
                    //  which have to be deleted duplicate object
                    if (vcan.main.dragMode == true || vcan.main.scaleMode == true) {
                        var pointer = vcan.utility.actualPointer(e);
                        var currTime = new Date().getTime();
                        if (!e.detail.hasOwnProperty('cevent') || (e.detail.hasOwnProperty('cevent') &&  e.detail.hasOwnProperty('broadCast'))) {
                            vcan.optimize.calculatePackets(currTime, 'u', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                        }

                        //if (vcan.main.dragMode == true) {
                        if (vcan.main.dragMode) {
                            vcan.main.dragMode = false;
                        }

                        //if (vcan.main.scaleMode == true) {
                        if (vcan.main.scaleMode) {
                            vcan.main.scaleMode = false;
                        }
                    } else {

                        if (!e.detail.hasOwnProperty('cevent') &&  e.detail.hasOwnProperty('cevent') &&  e.detail.hasOwnProperty('broadCast')) {
                            vcan.optimize.calculatePackets(currTime, 'u', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                        }
                    }
                    vcan.wb.sentPack = true;
                }
            }
        }
    }
})(window);