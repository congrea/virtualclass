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
                
                this.httpObj.upload.addEventListener("progress", function(evt) { 
//                    var percentComplete = (evt.loaded / evt.total) * 100; 
                    vApp.vutil.progressBar(evt.loaded, evt.total, 'indProgressBar', 'indProgressValue');
                    
                    if(evt.loaded == evt.total){
                        setTimeout(
                            function (){
                                vApp.vutil.progressBar(0, 0, 'indProgressBar', 'indProgressValue');
                            }, 1000
                        );
                        
                    }
                });
                //this.onprogress();
                this.onReadStateChange();
            },
            
//            onprogress : function (){
//                var num = 0;
//                this.httpObj.onprogress = function (evt){
//                    if (evt.lengthComputable) {
//                        var percentComplete = (evt.loaded / evt.total) * 100; 
//                        
//                        if(evt.loaded == evt.total){
//                            vApp.vutil.progressBar(evt.loaded, evt.total, 'indProgressBar', 'indProgressValue');
//                        }
//                        
//                    }else {
//                        console.log("Unable to compute progress information since the total size is unknown");
//                    }
//                }
//            },
            
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
                //this.httpObj.open("POST", window.whiteboardPath + "uploader.php", true);
                this.httpObj.open("POST", window.whiteboardPath + file, true);
                
                //for send data like form sbumit
//                this.httpObj.setRequestHeader("Content-type", "text/plain");
//                if(file == 'export.php'){
//                    this.httpObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//                }
                this.httpObj.send(data);
            }
        }
        window.xhr = xhr;
    }
)(window);
