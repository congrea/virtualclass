// This file is part of google
/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
    var xhrn = {
        init: function () {
            if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
                this.httpObj = new XMLHttpRequest();
            } else {
                this.httpObj = new ActiveXObject("Microsoft.XMLHTTP");
            }

            this.httpObj.upload.addEventListener("progress", this.onProgress);

            this.onReadStateChange();

            this.httpObj.onerror = function (err) {
                console.log("Error " + err);
            };

            this.httpObj.onabort = function (evt) {
                console.log("Error abort " + evt);
            }
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

        sendData: function (data, url, cb) {
            this.cb = cb;
            // var params = typeof data == 'string' ? data : Object.keys(data).map(
            //     function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            // ).join('&');
            var params =  JSON.stringify(data);
            this.httpObj.open('POST', url);
            this.httpObj.setRequestHeader('x-api-key', 'yJaR3lEhER3470dI88CMD5s0eCUJRINc2lcjKCu2');
            this.httpObj.setRequestHeader('x-congrea-authuser', '46ecba46bc1598c1ec4c');
            this.httpObj.setRequestHeader('x-congrea-authpass', '2bf8d3535fdff8a74c01');
            this.httpObj.setRequestHeader('x-congrea-room', '12323');
            this.httpObj.setRequestHeader('Content-Type', 'application/json');

            this.httpObj.send(params);
        }
    };
    window.xhrn = xhrn;
})(window);
