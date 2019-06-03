// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {

    //var virtualclass = window.virtualclass;
    /**
     * this class has methods by which the user can draw the particular object at different mouse event
     * @param objType is the particular object type which has to be drawn
     * @canvas canvas is the canvas element on which the object would be drawn
     * @thisobj is current tool object
     */

        // var scrollPos = 150;
        // var scrollPosY = 430;

        // var scrollPos = 0;
        // var scrollPosY = 600;

    var draw_object = function (objType, canvas, thisobj) {

            var wb = this;

            var tool = thisobj;
            thisobj.started = false;

            var startPosX;
            var startPosY;
            var endPosX;
            var endPosY;
            var dataChunk = [];
            var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;

            /**
             * This function sets up the situation for draw the particular object
             * This function called when user selected particular tool eg:- rectangle, line and clicked over the canvas
             *
             */


            tool.mousedown = function (ev, cobj) {
                tool._mousedown(ev, cobj);
            }
            tool.mousemove = function (ev, mouseup) {
                tool._mousemove(ev, mouseup);
            }
            tool.mouseup = function (ev, cobj) {
                tool._mouseup(ev, cobj);
            }
            tool.touchstart = function (ev, cobj) {
                // in case we need to add some additional functionality for touch
                tool._mousedown(ev, cobj);
                ev.preventDefault()
            }
            tool.touchmove = function (ev, mouseup) {
                tool._mousemove(ev, mouseup);
                ev.preventDefault();
            }
            tool.touchend = function (ev, cobj) {
                tool._mouseup(ev, cobj);
                ev.preventDefault();
            }

            tool._mousedown = function (ev, cobj) {
                // console.log('Whiteboard draw down');
                // ev.currX =  ev.currX / virtualclass.zoom.canvasScale;
                // ev.currY =  ev.currY / virtualclass.zoom.canvasScale;


                var wId = virtualclass.gObj.currWb;
                var ct = new Date().getTime();

                if (ev.detail.hasOwnProperty('cevent')) {
                    ev = virtualclass.wb[virtualclass.gObj.currWb].utility.scaleCordinate(ev);

                    ev.clientX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.x = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }

                var vcan = wb.vcan;
                lastmousemovetime = null;
                // tool.startPosX = ev.currX + scrollPos;
                // tool.startPosY = ev.currY + scrollPosY;

                tool.startPosX = ev.currX;
                tool.startPosY = ev.currY;

                // console.log('whiteboard create, start position x =' + tool.startPosX  + ' y = ' + tool.startPosY + ' scrollX='+virtualclass.leftPosX + ' scrollY='+virtualclass.topPosY);
                virtualclass.wb[wId].gObj.spx = tool.startPosX;
                virtualclass.wb[wId].gObj.spy = tool.startPosY;

                var currState = vcan.getStates('action');
                if (currState == 'create') {
                    var currTime = new Date().getTime();
                    if (objType != 'text' && wb.tool.cmd != 't_clearall' + wId) {
                        var currTransformState = vcan.getStates('currentTransform');
                        if (currTransformState == "" || currTransformState == null) {
                            //	if(!ev.detail.hasOwnProperty('cevent') && objType != 'freeDrawing'){
                            if (!ev.detail.hasOwnProperty('cevent')) {
                                //var currTime = new Date().getTime();
                                vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
                            }
                            tool.started = true;
                        }
                    } else {
                        wb.obj.drawTextObj.muser = false;
                        if (!ev.detail.hasOwnProperty('cevent') && wb.tool.cmd != 't_clearall' + wId) { //creating for other browser
                            if (wb.utility.clickOutSidebox(wb.obj.drawTextObj.textWriteMode)) {
                                var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                                if (vcan.main.currentTransform != undefined && vcan.main.currentTransform != '') {
                                    /** 'foundtext' is passed to notify that teacher clicks on text to edit on whiteboard **/
                                    vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY, 'foundtext');
                                } else {
                                    vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
                                }
                            }
                        } else {
                            wb.obj.drawTextObj.muser = true;
                        }

                        if (ev.detail.hasOwnProperty('cevent')) {
                            if (ev.detail.cevent.hasOwnProperty('mtext')) {
                                wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, ev.detail.cevent.mtext);
                            } else {
                                wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
                            }
                        } else {
                            if (typeof wb.obj.drawTextObj == 'object') {
                                wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
                            }
                        }
                    }
                }

                if (objType == 'freeDrawing' && wb.obj.freeDrawObj.freesvg == true) {
                    wb.obj.freeDrawObj.drawStart(ev);
                    // console.log('free drawing start x=' +  ev.currX + ' drawing y=' + ev.currY);
                }
            };

            /**
             * This function does create the particular object when user has already been
             * started to draw, at the same time the function made the information eg: creation time about parituclar
             * object and stored drawn object into replayObjs array
             * @param expects mousemove event
             */
            tool._mousemove = function (ev, mouseup) {
                // console.log('Whiteboard draw move');
                // ev.currX = ev.currX / virtualclass.zoom.canvasScale;
                // ev.currY = ev.currY / virtualclass.zoom.canvasScale;

                if (ev.detail.hasOwnProperty('cevent')) {
                    ev = virtualclass.wb[virtualclass.gObj.currWb].utility.scaleCordinate(ev);
                    ev.clientX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.x = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }
                if (tool.started && wb.tool.cmd != 't_clearall') { //command code inserted after found the problem
                    //this function should be conveted into appended with freedrawing module.
                    if (wb.obj.freeDrawObj != undefined && wb.obj.freeDrawObj.freesvg == true) {
                        if (wb.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
                            wb.obj.freeDrawObj.wb_draw(ev);
                            // console.log('free drawing move x=' +  ev.currX + ' drawing y=' + ev.currY);

                            if (!ev.detail.hasOwnProperty('cevent') || (ev.detail.hasOwnProperty('cevent') && ev.detail.hasOwnProperty('broadCast'))) {
                                if (typeof mouseup == 'undefined') {
                                    if (((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
                                        lastmousemovetime = new Date().getTime();
                                        vcan.optimize.calculatePackets(lastmousemovetime, 'm', ev.currX, ev.currY);
                                    }
                                }

                                var currTime = new Date().getTime();
                                // var obj = vcan.makeStackObj(currTime, 'm', ev.currX + scrollPos, ev.currY + scrollPosY);
                                var evx = ev.currX / virtualclass.zoom.canvasScale;
                                var evy = ev.currY / virtualclass.zoom.canvasScale;
                                var obj = vcan.makeStackObj(currTime, 'm', evx, evy);
                                // console.log('whiteboard create, move position x =' + ev.currX + ' y = ' + ev.currY);
                                // console.log('whiteboard create, move position x =' + ev.currX  + ' y = ' + ev.currY + ' scrollX='+virtualclass.leftPosX + ' scrollY='+virtualclass.topPosY);


                                dataChunk.push(obj);

                                if (typeof mouseup == 'undefined') {
                                    presentmousemovetime = new Date().getTime();
                                    if ((presentmousemovetime - lastmousemovetime) >= 2000) {	 // Optimized
                                        for (var i = 0; i < dataChunk.length; i++) {
                                            wb.uid++;
                                            dataChunk[i].uid = wb.uid;
                                            vcan.main.replayObjs.push(dataChunk[i]);
                                            // console.log('free drawing move x=' +  dataChunk[i].x + ' drawing y=' + dataChunk[i].y);
                                        }

                                        virtualclass.vutil.beforeSend({'repObj': dataChunk, 'cf': 'repObj'});
                                        virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));

                                        dataChunk = [];
                                        lastmousemovetime = new Date().getTime();
                                    }
                                }

                            } else {
                                //                          console.log('free drawing move x=' +  ev.currX + ' drawing y=' + ev.currY);
                            }

                        }
                    } else {
                        // endPosX = ev.currX+scrollPos;
                        // endPosY = ev.currY+scrollPosY;

                        endPosX = ev.currX;
                        endPosY = ev.currY;
//                     console.log('whiteboard create, move position x =' + ev.currX  + ' y = ' + ev.currY + ' scrollX='+virtualclass.leftPosX + ' scrollY='+virtualclass.topPosY);

                        if (wb.prvObj != '') {
                            wb.canvas.removeObject(wb.prvObj);
                        }

                        var currObject = wb.makeobj(tool.startPosX, tool.startPosY, endPosX, endPosY, objType);
                        var rCurrObject = wb.canvas.readyObject(currObject);

                        wb.canvas.addObject(rCurrObject); // drawing the object/shape
                        rCurrObject.coreObj.usrCurrAction = 'create';

                        var currTime = new Date().getTime();

                        if ((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null)) {
                            lastmousemovetime = new Date().getTime();
                            if ((!ev.detail.hasOwnProperty('cevent') ||
                                (ev.detail.hasOwnProperty('cevent') && ev.detail.hasOwnProperty('broadCast'))) && objType != 'text' && wb.tool.cmd != 't_clearall') {
                                vcan.optimize.calculatePackets(currTime, 'm', endPosX, endPosY);
                            }
                        }

                        presentmousemovetime = new Date().getTime();
                        if ((presentmousemovetime - lastmousemovetime) >= 2000) { // Optimized
                            if ((!ev.detail.hasOwnProperty('cevent') ||
                                (ev.detail.hasOwnProperty('cevent') && ev.detail.hasOwnProperty('broadCast'))) && objType != 'text' && wb.tool.cmd != 't_clearall') {
                                vcan.optimize.calculatePackets(currTime, 'm', endPosX, endPosY);
                            }
                            lastmousemovetime = new Date().getTime();
                        }

                        /****
                         *
                         * This would I have disbaled can be critical
                         * wb.replay.replayObjs.push(currObject);
                         *
                         ****/

                        wb.prvObj = rCurrObject.coreObj;
                    }
                } else {
                    if ((wb.vcan.main.action != 'move') ||
                        ((vcan.main.currentTransform == "" || vcan.main.currentTransform == null) && wb.vcan.main.action == "move")) {
                        var x = ev.currX / virtualclass.zoom.canvasScale;
                        var y = ev.currY / virtualclass.zoom.canvasScale;

                        var sendData = {'createArrow': true, x: x, y: y, 'cf': 'createArrow'}

                        virtualclass.vutil.beforeSend(sendData);
                    }
                }
            };

            /**
             *  This function does finalize the object
             *  with last made object very specail
             */
            tool._mouseup = function (ev, cobj) {
                //console.log('Whiteboard draw up');
                if (ev.detail.hasOwnProperty('cevent')) {
                    ev.clientX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    //  console.log('whiteboard create, end position x =' + ev.clientX  + ' y = ' + ev.clientY);
                    ev.x = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }

                endPosX = ev.currX;
                endPosY = ev.currY;

                lastmousemovetime = null;
                if (tool.started && objType != 'text') {
                    tool.mousemove(ev, 'up');
                    if ((!ev.detail.hasOwnProperty('cevent') ||
                        (ev.detail.hasOwnProperty('cevent') && ev.detail.hasOwnProperty('broadCast'))) && objType != 'freeDrawing') {
                        var currTime = new Date().getTime();
                        vcan.optimize.calculatePackets(currTime, 'u', endPosX, endPosY);
                    }

                    if ((wb.obj.freeDrawObj != undefined && wb.obj.freeDrawObj.freesvg == true)) {
                        if (wb.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
                            wb.obj.freeDrawObj.finalizeDraw(ev);

                        }

                        if (!ev.detail.hasOwnProperty('cevent') || (ev.detail.hasOwnProperty('cevent') && ev.detail.hasOwnProperty('broadCast'))) {
                            if (dataChunk.length > 0) {
                                var currTime = new Date().getTime();
                                var ex = endPosX / virtualclass.zoom.canvasScale;
                                var ey = endPosY / virtualclass.zoom.canvasScale;

                                var obj = vcan.makeStackObj(currTime, 'u', ex, ey);

                                dataChunk.push(obj);
                                for (var i = 0; i < dataChunk.length; i++) {
                                    wb.uid++;
                                    dataChunk[i].uid = wb.uid;
                                    vcan.main.replayObjs.push(dataChunk[i]);
                                }

                                virtualclass.vutil.beforeSend({'repObj': dataChunk, 'cf': 'repObj'});

                                //localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
                                virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
                                dataChunk = [];
                            }
                        }
                    }

                    if (wb.prvObj != '') {
                        wb.prvObj = ""; //this should be into proper way
                    }

                    wb.prvObj = "";
                    tool.started = false;
                }

                if (wb.vcan.wb.sentPack) {
                    wb.vcan.wb.sentPack = false;
                }
            };
        };
    window.draw_object = draw_object;
})(window);