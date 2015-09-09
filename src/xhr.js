// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {

    var xhr = {
        init: function () {
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                this.httpObj = new XMLHttpRequest();
            } else {
                this.httpObj = new ActiveXObject("Microsoft.XMLHTTP");
            }

            this.httpObj.upload.addEventListener("progress", this.onProgress);

            this.onReadStateChange();

            this.httpObj.onerror = function (err) {
                //TODO Add msg to user

                if(!virtualclass.recorder.alreadyDownload){
                    virtualclass.recorder.makeAvailDownloadFile();
                }
                //virtualclass.recorder.tryForReTransmit();
                console.log("Error " + err);
            };

            this.httpObj.onabort = function (evt) {
                console.log("Error abort " + evt);
            }
        },

        //this is not inbuilt onprogress
        onProgress: function (evt) {
            virtualclass.pbar.currVal = evt.loaded;
            //if(virtualclass.pbar.prvVal == '' || typeof virtualclass.pbar.prvVal == 'undefined'){
            // first time
            if ((virtualclass.pbar.prvVal == '' || typeof virtualclass.pbar.prvVal == 'undefined') && !virtualclass.isPlayMode) {
                virtualclass.pbar.progressInit();
            }

            virtualclass.pbar.renderProgressBar(evt.total, evt.loaded, 'indProgressBar', 'indProgressValue');
        },

        onReadStateChange: function () {
            var that = this;
            this.httpObj.onreadystatechange = function () {
                if (that.httpObj.readyState == 4) {
                    if (typeof that.cb != 'undefined') {
                        if (that.httpObj.status == 200) {
                            that.cb(that.httpObj.responseText);
                        } else {
                            that.cb("ERROR");
                            /*                             that.cb("ERROR " + that.httpObj.status); */
                        }
                    }
                }
            }
        },

        send: function (data, file, cb) {
            this.cb = cb;
            //this.httpObj.open("POST", window.whiteboardPath + file, true);
            this.httpObj.open("POST", file, true);
            this.httpObj.send(data);
        }
    };
    window.xhr = xhr;
})(window);
