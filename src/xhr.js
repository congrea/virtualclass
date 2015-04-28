// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
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
                    console.log("Error " + err);
                }
                
                this.httpObj.onabort = function (evt){
                    console.log("Error abort " + evt);
                }
            },
            
            //this is not inbuilt onprogress
            onProgress : function (evt){
                vApp.vutil.progressBar(evt.total, evt.loaded, 'indProgressBar', 'indProgressValue');
                
//                if(evt.loaded == evt.total){
//                    vApp.vutil.progressBar(0, 0, 'indProgressBar', 'indProgressValue');
//                }
            },
            
            onReadStateChange : function (){
                var that = this;
                this.httpObj.onreadystatechange  = function (){
//                    console.log('rs' + that.httpObj.readyState);
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
//                this.httpObj.open("POST", window.whiteboardPath + file, true);
                this.httpObj.open("POST", 'https://www.testserver.activemoodle.com/vc/' +  file, true);
                this.httpObj.send(data);
            }
        }
        window.xhr = xhr;
    }
)(window);
