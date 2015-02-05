// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        _replay = function() {
            return {
                init: function(repMode, myfunc) {
                    var vcan = vApp.wb.vcan;
                    if(typeof myfunc != 'undefined'){
                        this.objs = vcan.getStates('replayObjs');
                    }else{
                        this.objs = recorder.items;
                    }
                    this.objNo = 0;
                    this.repMode = repMode;
                    this.callBkfunc = "";
                },
                renderObj: function(myfunc) {
                    //console.log("browser mode " + this.repMode);
                    vApp.wb.drawMode = true;
                    if (typeof this.objs[this.objNo] == 'undefined') {
                        console.log("is this happend");
                        return;
                    }
                    if (typeof myfunc != 'undefined') {
                        this.callBkfunc = myfunc;
                    }
                    if (this.objs[this.objNo].hasOwnProperty('cmd')) {
                        vApp.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                        vApp.wb.toolInit(this.objs[this.objNo].cmd, 'fromFile', true);
                    } else {
                        var event = "";
                        if(this.objs[this.objNo].ac == 'del'){
                            if(vcan.main.currObj != ""){
                                vApp.wb.utility.removeSelectedItem(vcan.main.currObj, true);
                            }
                        }else{
                            if (this.objs[this.objNo].ac == 'd') {
                                event = 'mousedown';
                            } else if ((this.objs[this.objNo].ac == 'm')) {
                                event = 'mousemove';
                            } else if (this.objs[this.objNo].ac == 'u') {
                                event = 'mouseup';
                            }
                            var currObj = this.objs[this.objNo];

                            if (currObj.hasOwnProperty('mtext')) {
                                var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y, mtext: currObj.mtext}}};
                            } else {
                                var eventObj = {detail: {cevent: {x: currObj.x, y: currObj.y}}};
                            }
                            var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                            vcan.main.canvas.dispatchEvent(eventConstruct);
                        }
                        //alert(this.objs[this.objNo].uid);
                        vApp.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                    }

                    if (typeof this.callBkfunc == 'function') {
                        if (this.objs[this.objs.length - 1].uid == vApp.wb.gObj.displayedObjId) {
                            this.callBkfunc('callBkfunc');
                        }
                    }

                    if (typeof this.objs[this.objNo + 1] == 'object') {
                        if (typeof this.repMode != 'undefined' && this.repMode == 'fromBrowser') {
                            vApp.wb.replayTime = 0;
                        }else{
                            if(this.objNo == 0){
                                vApp.wb.replayTime = this.objs[this.objNo].mt - vApp.wb.pageEnteredTime;
                            }else{
                                vApp.wb.replayTime = this.objs[this.objNo + 1].mt - this.objs[this.objNo].mt;
                            }
                        }
                        this.objNo++;
                        var that = this;
                        setTimeout(function (){
                            that.renderObj.call(that);
                        }, vApp.wb.replayTime);
                    }
                    return;
                }
            }
        }
        window._replay = _replay;
    }
)(window);
