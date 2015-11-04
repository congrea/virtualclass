// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    _replay = function () {
        return {
            init: function (repMode, myfunc) {
                var vcan = virtualclass.wb.vcan;
                if (typeof myfunc != 'undefined') {
                    this.objs = vcan.getStates('replayObjs');
                } else {
                    this.objs = recorder.items;
                }
                this.objNo = 0;
                this.repMode = repMode;
                this.callBkfunc = "";
                this.rendering = false;
            },

            makeCustomEvent : function (obj, broadCast){
                if (obj.hasOwnProperty('mtext')) {
                    var eventObj = {detail: {cevent: {x: obj.x, y: obj.y, mtext: obj.mtext}}};
                } else {
                    var eventObj = {detail: {cevent: {x: obj.x, y: obj.y}}};
                }

                if(typeof broadCast != 'undefined'){
                     eventObj.detail.broadCast  = true; //For send packet to other.
                }

                var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                vcan.main.canvas.dispatchEvent(eventConstruct);

//                return new CustomEvent(event, eventObj); // This is not supported for ie9 and older ie browsers
            },

            renderObj: function (myfunc) {
                if (typeof this.objs[this.objNo] == 'undefined') {
                    console.log(this.objs + "is undefined cannot continue play.");
                    return;
                }

                virtualclass.wb.drawMode = true; // TODO this should be removed
                this.rendering = true;
                if (typeof myfunc != 'undefined') {
                    this.callBkfunc = myfunc;
                }
                if (this.objs[this.objNo].hasOwnProperty('cmd')) {
                    virtualclass.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                    virtualclass.wb.toolInit(this.objs[this.objNo].cmd, 'fromFile', true);
                } else {
                    var event = "";
                    if (this.objs[this.objNo].ac == 'del') {
                        if (vcan.main.currObj != "") {
                            virtualclass.wb.utility.removeSelectedItem(vcan.main.currObj, true, true);
                            console.log('Whiteboard Delete:-  Performing delete operation:-');
                        }
                    } else {
                        if (this.objs[this.objNo].ac == 'd') {
                            event = 'mousedown';
                        } else if ((this.objs[this.objNo].ac == 'm')) {
                            event = 'mousemove';
                        } else if (this.objs[this.objNo].ac == 'u') {
                            event = 'mouseup';
                        }

                        var currObj = this.objs[this.objNo];

                        //this.makeCustomEvent(currObj);

                        if (currObj.hasOwnProperty('mtext')) {
                            var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y, mtext: currObj.mtext}}};
                        } else {
                            var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y}}};
                        }
                        var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                        vcan.main.canvas.dispatchEvent(eventConstruct);
                    }

                    //console.log('Whiteboard objects length ' + this.objs.length);

                    //alert(this.objs[this.objNo].uid);
                    virtualclass.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                }

                console.log('Whiteboard : Till now play ' + virtualclass.wb.gObj.displayedObjId);

                if (this.objs[this.objs.length - 1].uid == virtualclass.wb.gObj.displayedObjId) {
                    if (typeof this.callBkfunc == 'function') {
                        this.callBkfunc('callBkfunc');
                    }
                    this.rendering = false; // Now rendering is finished
                }

                if(roles.hasControls()){
                    if (virtualclass.wb.gObj.tempRepObjs[virtualclass.wb.gObj.tempRepObjs.length-1].uid == virtualclass.wb.gObj.displayedObjId){

                        vcan.main.replayObjs = virtualclass.wb.gObj.tempRepObjs;
                    }
                }


                if (typeof this.objs[this.objNo + 1] == 'object') {

                    if (typeof this.repMode != 'undefined' && this.repMode == 'fromBrowser') {
                        //virtualclass.wb.replayTime = 0;
                        virtualclass.wb.replayTime = 0;
                    } else {
                        if (this.objNo == 0) {
                            //virtualclass.wb.replayTime = this.objs[this.objNo].mt - virtualclass.wb.pageEnteredTime;
                            virtualclass.wb.replayTime = 0;
                        } else {
                            virtualclass.wb.replayTime = this.objs[this.objNo + 1].mt - this.objs[this.objNo].mt;
                        }
                    }
                    this.objNo++;
                    var that = this;
                    //self = this; compile error
                    setTimeout(function () {
                        /// var temp = self;
                        that.renderObj.call(that);

                    }, virtualclass.wb.replayTime);
                }

            }
        }
    };
    window._replay = _replay;
})(window);
