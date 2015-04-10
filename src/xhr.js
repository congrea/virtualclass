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
                
                this.onReadStateChange();
            },
            
            onReadStateChange : function (){
                var that = this;
                this.httpObj.onreadystatechange  = function (){
                    if (that.httpObj.readyState==4 && that.httpObj.status==200){
                         //   alert(that.httpObj.responseText);
                            if(typeof that.cb != 'undefined'){
                                that.cb(that.httpObj.responseText);
                            }
                       }
                }
            },
            
            send : function (data, file, cb){
                this.cb = cb;
                //this.httpObj.open("POST", window.whiteboardPath + "uploader.php", true);
                this.httpObj.open("POST", window.whiteboardPath + file, true);

                //for send data like form sbumit
                this.httpObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//                if(file == 'export.php'){
//                    this.httpObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//                }
                this.httpObj.send(data);
            }
        }
        window.xhr = xhr;
    }
)(window);
