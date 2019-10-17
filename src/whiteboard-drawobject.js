// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  // var virtualclass = window.virtualclass;
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

  const draw_object = function (objType, canvas, thisobj, wid) {
    const wb = this;

    const tool = thisobj;
    thisobj.started = false;

    let startPosX;
    let startPosY;
    let endPosX;
    let endPosY;
    let dataChunk = [];
    // const { vcan } = virtualclass.wb[virtualclass.gObj.currWb];
    const { vcan } = virtualclass.wb[wid];

    /**
       * This function sets up the situation for draw the particular object
       * This function called when user selected particular tool eg:- rectangle, line and clicked over the canvas
       *
       */

    //
    // tool.mousedown = function (ev, cobj) {
    //   tool._mousedown(ev, cobj);
    // };
    // tool.mousemove = function (ev, mouseup) {
    //   tool._mousemove(ev, mouseup);
    // };
    // tool.mouseup = function (ev, cobj) {
    //   tool._mouseup(ev, cobj);
    // };

    tool.mousedown = function (ev, wId) {
      tool._mousedown(ev, wId);
    };
    tool.mousemove = function (ev, wId, mouseup) {
      tool._mousemove(ev, wId, mouseup);
    };
    tool.mouseup = function (ev, wId) {
      tool._mouseup(ev, wId);
    };

    tool.touchstart = function (ev, wId) {
      // in case we need to add some additional functionality for touch
      tool._mousedown(ev, wId);
      ev.preventDefault();
    };
    tool.touchmove = function (ev, wId, mouseup) {
      tool._mousemove(ev, wId, mouseup);
      ev.preventDefault();
    };
    tool.touchend = function (ev, wId) {
      tool._mouseup(ev, wId);
      ev.preventDefault();
    };

    tool._mousedown = function (ev, wId) {
      // console.log('Whiteboard draw down');
      // ev.currX =  ev.currX / virtualclass.zoom.canvasScale;
      // ev.currY =  ev.currY / virtualclass.zoom.canvasScale;


      // const wId = virtualclass.gObj.currWb;
      const ct = new Date().getTime();

      if (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')) {
        ev = virtualclass.wb[wId].utility.scaleCordinate(ev);

        ev.clientX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.clientY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.x = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.y = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.pageX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.pageY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.currX = ev.detail.cevent.x;
        ev.currY = ev.detail.cevent.y;
      }

      // // console.log("====> mouse down ", ev.currX, ev.currY);
      // console.log('=====> pointer start event x, y ',  ev.currX, ev.currY);

      var { vcan } = wb;
      virtualclass.gObj.lastmousemovetime = null;
      // tool.startPosX = ev.currX + scrollPos;
      // tool.startPosY = ev.currY + scrollPosY;

      tool.startPosX = ev.currX;
      tool.startPosY = ev.currY;

      // console.log('whiteboard create, start position x =' + tool.startPosX  + ' y = ' + tool.startPosY + ' scrollX='+virtualclass.leftPosX + ' scrollY='+virtualclass.topPosY);
      virtualclass.wb[wId].gObj.spx = tool.startPosX;
      virtualclass.wb[wId].gObj.spy = tool.startPosY;

      const currState = vcan.getStates('action');
      if (currState === 'create') {
        const currTime = new Date().getTime();
        if (objType !== 'text' && wb.tool.cmd !== `t_clearall${wId}`) {
          const currTransformState = vcan.getStates('currentTransform');
          if (!currTransformState || currTransformState == null) {
            // if(!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent') && objType != 'freeDrawing'){
            if (!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')) {
              // var currTime = new Date().getTime();
              vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
            }
            tool.started = true;
          }
        } else {
          wb.obj.drawTextObj.muser = false;
          if (!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent') && wb.tool.cmd !== `t_clearall${wId}`) { // creating for other browser
            if (wb.utility.clickOutSidebox(wb.obj.drawTextObj.textWriteMode)) {
              var { vcan } = virtualclass.wb[wId];
              if (vcan.main.currentTransform != null && vcan.main.currentTransform) {
                /** 'foundtext' is passed to notify that teacher clicks on text to edit on whiteboard * */
                vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY, 'foundtext');
              } else {
                vcan.optimize.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
              }
            }
          } else {
            wb.obj.drawTextObj.muser = true;
          }

          if (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')) {
            if (Object.prototype.hasOwnProperty.call(ev.detail.cevent, 'mtext')) {
              wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, ev.detail.cevent.mtext, wId);
            } else {
              wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, undefined, wId);
            }
          } else if (typeof wb.obj.drawTextObj === 'object') {
            wb.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, undefined, wId);
          }
        }
      }

      if (objType === 'freeDrawing' && wb.obj.freeDrawObj.freesvg === true) {
        wb.obj.freeDrawObj.drawStart(ev, wId);
        // console.log('free drawing start x=' +  ev.currX + ' drawing y=' + ev.currY);
      }
      // console.log('=====> CANVAS SCALE ===== down, xy', virtualclass.zoom.canvasScale, ev.currX, ev.currY);
    };

    /**
       * This function does create the particular object when user has already been
       * started to draw, at the same time the function made the information eg: creation time about parituclar
       * object and stored drawn object into replayObjs array
       * @param expects mousemove event
       */
    tool._mousemove = function (ev, wId, mouseup) {
      if (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')) {
        ev = virtualclass.wb[wId].utility.scaleCordinate(ev);
        ev.clientX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.clientY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.x = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.y = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.pageX = ev.detail.cevent.x + (wb.vcan.main.offset.x);
        ev.pageY = ev.detail.cevent.y + (wb.vcan.main.offset.y);
        ev.currX = ev.detail.cevent.x;
        ev.currY = ev.detail.cevent.y;
      }
      // console.log('=====> pointer move event x, y ',  ev.currX, ev.currY);
      if (tool.started && wb.tool.cmd !== 't_clearall') { // command code inserted after found the problem
        if (wb.obj.freeDrawObj !== undefined && wb.obj.freeDrawObj.freesvg === true) {
          if (wb.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
            wb.obj.freeDrawObj.wb_draw(ev, wId);
            if (!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
              || (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
              && Object.prototype.hasOwnProperty.call(ev.detail, 'broadCast'))) {
              if (typeof mouseup === 'undefined') {
                if (((typeof virtualclass.gObj.lastmousemovetime === 'undefined')
                  || (virtualclass.gObj.lastmousemovetime == null))) {
                  virtualclass.gObj.lastmousemovetime = new Date().getTime();
                  vcan.optimize.calculatePackets(virtualclass.gObj.lastmousemovetime, 'm', ev.currX, ev.currY);
                }
              } else {
                // console.log("====> mouse up finally", ev.currX);
              }

              var currTime = new Date().getTime();
              // var obj = vcan.makeStackObj(currTime, 'm', ev.currX + scrollPos, ev.currY + scrollPosY);
              const evx = ev.currX / virtualclass.zoom.canvasScale;
              const evy = ev.currY / virtualclass.zoom.canvasScale;
              const obj = vcan.makeStackObj(currTime, 'm', evx, evy);
              const presentMoveTime = virtualclass.gObj.presentmousemovetime;
              const lastMoveTime = virtualclass.gObj.lastmousemovetime;

              dataChunk.push(obj);

              if (typeof mouseup === 'undefined') {
                virtualclass.gObj.presentmousemovetime = new Date().getTime();
                if ((presentMoveTime - lastMoveTime) >= 2000) {	 // Optimized
                  for (let i = 0; i < dataChunk.length; i++) {
                    wb.uid++;
                    dataChunk[i].uid = wb.uid;
                    vcan.main.replayObjs.push(dataChunk[i]);
                  }

                  virtualclass.vutil.beforeSend({ repObj: dataChunk, cf: 'repObj' });
                  dataChunk = [];
                  virtualclass.gObj.lastmousemovetime = new Date().getTime();
                }
              } else {
                // console.log("====> mouse up finally", ev.currX);
              }
            }
          }
        } else {
          // endPosX = ev.currX+scrollPos;
          // endPosY = ev.currY+scrollPosY;

          endPosX = ev.currX;
          endPosY = ev.currY;
          //                     console.log('whiteboard create, move position x =' + ev.currX  + ' y = ' + ev.currY + ' scrollX='+virtualclass.leftPosX + ' scrollY='+virtualclass.topPosY);

          if (wb.prvObj) {
            wb.canvas.removeObject(wb.prvObj);
          }

          const currObject = wb.makeobj(tool.startPosX, tool.startPosY, endPosX, endPosY, objType);
          const rCurrObject = wb.canvas.readyObject(currObject, wId);

          wb.canvas.addObject(rCurrObject); // drawing the object/shape
          rCurrObject.coreObj.usrCurrAction = 'create';

          var currTime = new Date().getTime();

          if ((typeof virtualclass.gObj.lastmousemovetime === 'undefined')
            || (virtualclass.gObj.lastmousemovetime == null)) {
            virtualclass.gObj.lastmousemovetime = new Date().getTime();
            if ((!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
                || (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
                && Object.prototype.hasOwnProperty.call(ev.detail, 'broadCast')))
                && objType !== 'text' && wb.tool.cmd !== 't_clearall') {
              vcan.optimize.calculatePackets(currTime, 'm', endPosX, endPosY);
            }
          }

          virtualclass.gObj.presentmousemovetime = new Date().getTime();
          if ((virtualclass.gObj.presentmousemovetime - virtualclass.gObj.lastmousemovetime) >= 2000) { // Optimized
            if ((!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
                || (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
                && Object.prototype.hasOwnProperty.call(ev.detail, 'broadCast')))
                && objType !== 'text' && wb.tool.cmd !== 't_clearall') {
              vcan.optimize.calculatePackets(currTime, 'm', endPosX, endPosY);
            }
            virtualclass.gObj.lastmousemovetime = new Date().getTime();
          }
          wb.prvObj = rCurrObject.coreObj;
        }
        // console.log('=====> CANVAS SCALE ===== move x/y', virtualclass.zoom.canvasScale, ' ', endPosX, endPosY);
      } else if ((wb.vcan.main.action !== 'move')
            || ((!vcan.main.currentTransform || vcan.main.currentTransform == null)
            && wb.vcan.main.action === 'move')) {
        const x = ev.currX / virtualclass.zoom.canvasScale;
        const y = ev.currY / virtualclass.zoom.canvasScale;

        const sendData = {
          createArrow: true, x, y, cf: 'createArrow',
        };

        virtualclass.vutil.beforeSend(sendData);
      }
    };

    /**
       *  This function does finalize the object
       *  with last made object very specail
       */
    tool._mouseup = function (ev, wId) {
      // console.log('Whiteboard draw up');
      if (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')) {
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

      // // console.log("====> mouse up", ev.currX);
      endPosX = ev.currX;
      endPosY = ev.currY;

      virtualclass.gObj.lastmousemovetime = null;
      if (tool.started && objType !== 'text') {
        tool.mousemove(ev, wId, 'up');
        if ((!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
            || (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
            && Object.prototype.hasOwnProperty.call(ev.detail, 'broadCast'))) && objType !== 'freeDrawing') {
          var currTime = new Date().getTime();
          vcan.optimize.calculatePackets(currTime, 'u', endPosX, endPosY);
        }

        if ((wb.obj.freeDrawObj != undefined && wb.obj.freeDrawObj.freesvg === true)) {
          if (wb.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
            wb.obj.freeDrawObj.finalizeDraw(ev, wId);
          }

          if (!Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
            || (Object.prototype.hasOwnProperty.call(ev.detail, 'cevent')
            && Object.prototype.hasOwnProperty.call(ev.detail, 'broadCast'))) {
            if (dataChunk.length > 0) {
              var currTime = new Date().getTime();
              const ex = endPosX / virtualclass.zoom.canvasScale;
              const ey = endPosY / virtualclass.zoom.canvasScale;

              const obj = vcan.makeStackObj(currTime, 'u', ex, ey);

              dataChunk.push(obj);
              for (let i = 0; i < dataChunk.length; i++) {
                wb.uid++;
                dataChunk[i].uid = wb.uid;
                vcan.main.replayObjs.push(dataChunk[i]);
              }

              virtualclass.vutil.beforeSend({ repObj: dataChunk, cf: 'repObj' });

              // localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
              dataChunk = [];
            }
          }
        }

        if (wb.prvObj) {
          wb.prvObj = ''; // this should be into proper way
        }

        wb.prvObj = '';
        tool.started = false;
      }

      if (wb.vcan.wb.sentPack) {
        wb.vcan.wb.sentPack = false;
      }

      // console.log('=====> CANVAS SCALE ===== up ', virtualclass.zoom.canvasScale);
    };
  };
  window.draw_object = draw_object;
}(window));
