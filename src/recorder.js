// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function(window) {
        //var rObjs = localStorage.getItem('recObjs');
        var recorder = {
            
          //  items :  (rObjs != null) ? JSON.parse(rObjs) : [],
            items : [],
            recImgPlay : false,
            
            init: function(repMode) {
                 //localStorage.removeItem('recObjs');
                var vcan = vApp.wb.vcan;
                if(typeof myfunc != 'undefined'){
                    this.objs = vcan.getStates('replayObjs'); 
                }else{
                    //recorder.items;
//                    this.objs = recorder.items;
                    vApp.storage.getAllObjs(["allData"], repInit);
                }
                
                var that = this;
                
                function repInit (){
                    that.objs = vApp.recorder.items;
                    that.objNo = 0;
                    that.repMode = repMode;
                    that.callBkfunc = "";

                    vApp.ss = "";
                    vApp.wss = "";

                    var allChildrens;
                    var screenShare = document.getElementById('vApp'+ vApp.apps[1]);

                    if(screenShare != null){
                       screenShare.parentNode.removeChild(screenShare);
                    }

                    var wholeScreenShare = document.getElementById('vApp'+ vApp.apps[2]);

                    if(wholeScreenShare != null){
                       wholeScreenShare.parentNode.removeChild(wholeScreenShare);
                    }
                    
                    var obj = that.objs[0];
                    var repTime = obj.mt - vApp.wb.pageEnteredTime;
                   
                    setTimeout(
                        function (){
                            vApp.recorder.renderObj();
                        },
                        repTime
                    );
                }
                
                var audioRepTime = vApp.wb.recordStarted - vApp.wb.pageEnteredTime;
                
                setTimeout(
                    function (){
                        if(typeof vApp.gObj.video != 'undefined'){
                            //vApp.gObj.video.audio.replay(0, 0);
                            vApp.gObj.video.audio.replayInit();
                        }
                    },
                    audioRepTime
                );
             },
                
            renderObj : function(myfunc) {
                vApp.wb.drawMode = true;
                
                if (typeof this.objs[this.objNo] == 'undefined') {
                    console.log("is this happend");
                    return;
                }
                
                if (this.objs[this.objNo].hasOwnProperty('cmd')) {
                    vApp.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                    vApp.wb.toolInit(this.objs[this.objNo].cmd, 'fromFile', true);
                } else {
                    if(this.objs[this.objNo].hasOwnProperty('si')){
                        vApp.initStudentScreen(this.objs[this.objNo], "recImgPlay");
                    }else if(this.objs[this.objNo].hasOwnProperty('cuser')){
                        vApp.gObj.chat.userChatList = [];
                        vApp.gObj.chat.display(this.objs[this.objNo].cuser, 'cevent');
                    }else{
                        if(vApp.previous != "vApp"+vApp.apps[0]){
                           document.getElementById('vApp' + vApp.apps[0]).style.display = 'block';
                           document.getElementById(vApp.previous).style.display = 'none';
                           vApp.previous =  "vApp"+vApp.apps[0] 
                        }
                        
                        var event = "";
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
                        
                        if(this.objs[this.objNo].hasOwnProperty('uid')){
                            alert('suman bogati');
                            vApp.wb.gObj.displayedObjId = this.objs[this.objNo].uid;
                            var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                            vcan.main.canvas.dispatchEvent(eventConstruct);
                        }
                    }
                }

                if (typeof this.objs[this.objNo + 1] == 'object') {
                    if (typeof this.repMode != 'undefined' && this.repMode == 'fromBrowser') {
                        vApp.wb.replayTime = 0;
                    }else{
                        if(this.objs[this.objNo].hasOwnProperty('beforeRefresh')){
                            vApp.wb.replayTime = (this.objs[this.objNo+1].mt - this.objs[this.objNo + 1].peTime)+1000;
                            //vApp.wb.replayTime = 0;
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
        };
        window.recorder = recorder;
    }
)(window);