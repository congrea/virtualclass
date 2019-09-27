// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const _replay = function () {
    return {
      init(repMode, wid, myfunc) {
        // const { vcan } = virtualclass.wb[virtualclass.gObj.currWb];
        const { vcan } = virtualclass.wb[wid];
        if (typeof myfunc !== 'undefined') {
          this.objs = vcan.getStates('replayObjs');
        } else {
          this.objs = recorder.items;
        }
        this.objNo = 0;
        this.repMode = repMode;
        this.callBkfunc = '';
        this.rendering = false;
      },

      makeCustomEvent(obj, broadCast) {
        if (Object.prototype.hasOwnProperty.call(obj, 'mtext')) {
          var eventObj = { detail: { cevent: { x: obj.x, y: obj.y, mtext: obj.mtext } } };
        } else {
          var eventObj = { detail: { cevent: { x: obj.x, y: obj.y } } };
        }

        if (typeof broadCast !== 'undefined') {
          eventObj.detail.broadCast = true; // For send packet to other.
        }

        const eventConstruct = new CustomEvent(event, eventObj); // this is not supported for ie9 and older ie browsers
        vcan.main.canvas.dispatchEvent(eventConstruct);

        //                return new CustomEvent(event, eventObj); // This is not supported for ie9 and older ie browsers
      },

      renderObj(wid, myfunc) {
        // const wid = virtualclass.gObj.currWb;
        const { vcan } = virtualclass.wb[wid];

        if (typeof this.objs[this.objNo] === 'undefined') {
          // console.log(`${this.objs}is undefined cannot continue play.`);
          return;
        }

        // virtualclass.wb[virtualclass.gObj.currWb].drawMode = true; // TODO this should be removed
        this.rendering = true;
        if (typeof myfunc !== 'undefined') {
          this.callBkfunc = myfunc;
        }
        if (Object.prototype.hasOwnProperty.call(this.objs[this.objNo], 'cmd')) {
        // virtualclass.wb[virtualclass.gObj.currWb].toolInit(this.objs[this.objNo].cmd, 'fromFile', true);

          const data = {
            cmd: this.objs[this.objNo].cmd,
            fromWhere: 'fromFile',
            multiUser: true,
            wbId: wid,
          };
          virtualclass.wb[wid].toolInit(data);
        } else {
          let event = '';
          if (this.objs[this.objNo].ac === 'del') {
            if (vcan.main.currObj) {
              virtualclass.wb[wid].utility.removeSelectedItem(vcan.main.currObj, true, true);
              // console.log('Whiteboard Delete:-  Performing delete operation:-');
            }
          } else {
            if (this.objs[this.objNo].ac === 'd') {
              event = 'mousedown';
            } else if ((this.objs[this.objNo].ac === 'm')) {
              event = 'mousemove';
            } else if (this.objs[this.objNo].ac === 'u') {
              event = 'mouseup';
            }

            const currObj = this.objs[this.objNo];

            // this.makeCustomEvent(currObj);

            if (Object.prototype.hasOwnProperty.call(currObj, 'mtext')) {
              var eventObj = { detail: { cevent: { x: currObj.x, y: currObj.y, mtext: currObj.mtext } } };
            } else {
              var eventObj = { detail: { cevent: { x: currObj.x, y: currObj.y } } };
              if (Object.prototype.hasOwnProperty.call(currObj, 'scy')) {
                eventObj.detail.cevent.scy = currObj.scy;
              }
              if (Object.prototype.hasOwnProperty.call(currObj, 'scx')) {
                eventObj.detail.cevent.scx = currObj.scx;
              }
            }

            if (Object.prototype.hasOwnProperty.call(currObj, 'foundText')) {
              eventObj.detail.foundText = true;
            }
            const eventConstruct = new CustomEvent(event, eventObj); // this is not supported for ie9 and older ie browsers

            vcan.main.canvas.dispatchEvent(eventConstruct);
          }
          // virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId = this.objs[this.objNo].uid;
        }

        // console.log('Whiteboard : Till now play ' + virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId);

        // if (this.objs[this.objs.length - 1].uid == virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId) {
        //   if (typeof this.callBkfunc === 'function') {
        //     this.callBkfunc('callBkfunc');
        //   }
        //   this.rendering = false; // Now rendering is finished
        // }

        // if (roles.hasControls()) {
        //   if (virtualclass.wb[virtualclass.gObj.currWb].gObj.tempRepObjs[virtualclass.wb[virtualclass.gObj.currWb].gObj.tempRepObjs.length - 1].uid == virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId) {
        //     vcan.main.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.tempRepObjs;
        //   }
        // }


        // if (typeof this.objs[this.objNo + 1] === 'object') {
        //   if (typeof this.repMode !== 'undefined' && this.repMode == 'fromBrowser') {
        //     // virtualclass.wb[virtualclass.gObj.currWb].replayTime = 0;
        //     virtualclass.wb[virtualclass.gObj.currWb].replayTime = 0;
        //   } else if (this.objNo == 0) {
        //     // virtualclass.wb[virtualclass.gObj.currWb].replayTime = this.objs[this.objNo].mt - virtualclass.wb[virtualclass.gObj.currWb].pageEnteredTime;
        //     virtualclass.wb[virtualclass.gObj.currWb].replayTime = 0;
        //   } else {
        //     virtualclass.wb[virtualclass.gObj.currWb].replayTime = this.objs[this.objNo + 1].mt - this.objs[this.objNo].mt;
        //   }
        //   this.objNo++;
        //   const that = this;
        //   // self = this; compile error
        //   setTimeout(() => {
        //     // / var temp = self;
        //     that.renderObj.call(that);
        //   }, virtualclass.wb[virtualclass.gObj.currWb].replayTime);
        // }
      },
    };
  };
  window._replay = _replay;
}(window));
