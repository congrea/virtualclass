// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        // individual progress bar
        var idvPcb = {
            prvVal : '',
            currVal : '',
            progressInit : function (){
                var that = this;
                currTimeout = setTimeout(
                    function (){
                        if(that.prvVal == that.currVal){
                            vApp.recorder.tryForTransmit();
                        }else{
                            clearTimeout(currTimeout);
                            that.progressInit();
                        }
                    }
                );
            }
        }
//        function progressInit(){
//            currTimeout = setTimeout(
//                function (){
//                    if(prvVal == currVal){
//                        vApp.recorder.tryForTransmit();
//                    }else{
//                        clearTimeout(currTimeout);
//                        progressInit();
//                    }
//                },
//                5000
//            );
//        }
//        
        
        var xhr  = {
            init : function (){
                if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                    this.httpObj = new XMLHttpRequest();
                } else {
                    this.httpObj = new ActiveXObject("Microsoft.XMLHTTP");
                }
                
                this.httpObj.upload.addEventListener("progress", this.onProgress);
                
                this.onReadStateChange();
                
                this.httpObj.onerror = function (err){
                    vApp.recorder.tryForTransmit();
                    console.log("Error " + err);
                }
                
                this.httpObj.onabort = function (evt){
                    console.log("Error abort " + evt);
                }
            },
            
            //this is not inbuilt onprogress
            onProgress : function (evt){
                if(idvPcb.prvVal == '' || typeof idvPcb.prvVal == 'undefined'){
                    progressInit();
                    firstTime = true;
                }
                idvPcb.currVal = evt.loaded;
                vApp.vutil.progressBar(evt.total, evt.loaded, 'indProgressBar', 'indProgressValue');
                idvPcb.prvVal = that.currVal;
            },
            
            onReadStateChange : function (){
                var that = this;
                this.httpObj.onreadystatechange  = function (){
                    if (that.httpObj.readyState==4){
                        if(typeof that.cb != 'undefined'){
                            if (that.httpObj.status==200) {
                                that.cb(that.httpObj.responseText);
                            } else {
                                that.cb("ERROR "+that.httpObj.status);
                            }
                        }
                    }
                }
            },
            
            send : function (data, file, cb){
                this.cb = cb;
                this.httpObj.open("POST", window.whiteboardPath + file, true);
//                this.httpObj.open("POST", 'https://www.testserver.activemoodle.com/vc/' +  file, true);
                this.httpObj.send(data);
            }
        }
        window.xhr = xhr;
    }
)(window);
