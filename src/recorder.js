// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function(window) {
        //var rObjs = localStorage.getItem('recObjs');
        var e = {};
        var recorder = {
            items : [],
            recImgPlay : false,
            objn : 0,
            playTimeout : "",
            init: function(repMode) {
                 //localStorage.removeItem('recObjs');
                var vcan = vApp.wb.vcan;
                if(typeof myfunc != 'undefined'){
                    this.objs = vcan.getStates('replayObjs');
                }else{
                    var that = this;
                    vApp.storage.getAllObjs(["allData"], function (){ that.play(); });
                }
            },
            // If binary, return buffer else return original value
            convertInto : function (e){
                if(typeof e.data == 'string'){
                    return e;
                }
                e.data =  e.data.buffer;
                return e;
            },
             
            play : function (){
                var that = this;
                if(typeof that.playTimeout != 'undefined' || that.playTimeout != ""){
                    clearTimeout(that.playTimeout);
                }
                if(!this.hasOwnProperty('playTime')){
                    this.playTime = this.items[0].playTime;
                    e.data =  JSON.parse(this.items[this.objn].recObjs);
                    io.cfg = e.data;
                    //vApp.gObj.uRole = io.cfg.userobj.role;
                    vApp.gObj.uRole = 's'; //it teacher sets there would ask for choose screen share
                    vApp.gObj.uName = io.cfg.userobj.name;
                    vApp.gObj.uid = io.cfg.userobj.userid;
                      
                      
                }
                if(typeof this.items[this.objn+1] == 'undefined'){
//                    e.data =  JSON.parse(this.items[this.objn].recObjs);
                    e.data =  this.items[this.objn].recObjs;
                    io.onRecMessage(that.convertInto(e)); 
                    
                    
                    //return;
                }else{
                  that.playTimeout = setTimeout( function (){
                        e.data =  that.items[that.objn].recObjs;
                        io.onRecMessage(that.convertInto(e)); 
                        that.play.call(that);
                        that.objn++;
                            
//                        if(that.objn != 0){
//                            io.onRecMessage(that.convertInto(e)); 
//                            that.play.call(that);
//                            that.objn++;
//                        }else{
//                            that.objn += 2; //skip first packet from replay 
//                        }
                        
                        that.playTime = that.items[that.objn].playTime;
                     }, that.playTime);
                }
            }
        };
        window.recorder = recorder;
    }
)(window);