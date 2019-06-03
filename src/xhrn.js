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
            var params = JSON.stringify(data);
            this.httpObj.open('POST', url);

            this.httpObj.setRequestHeader('x-api-key', wbUser.lkey);
            this.httpObj.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
            this.httpObj.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);
            // this.httpObj.setRequestHeader('x-congrea-authuser', '23a8763096c20afd1213');
            // this.httpObj.setRequestHeader('x-congrea-authpass', '9a63d3aae4d374f30360');
            this.httpObj.setRequestHeader('x-congrea-room', wbUser.room);
            this.httpObj.setRequestHeader('Content-Type', 'application/json');
            this.httpObj.withCredentials = false;
            this.httpObj.send(params);
        },

        getAcess: function (cb) {
            this.cb = cb;
            // 'https://api.congrea.net/data/access';
            var url = virtualclass.api.access;
            this.httpObj.open('GET', url);

            this.httpObj.setRequestHeader('x-api-key', wbUser.lkey);
            this.httpObj.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
            this.httpObj.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);
            this.httpObj.setRequestHeader('x-congrea-room', wbUser.room);

            this.httpObj.setRequestHeader('Content-Type', 'application/json');
            this.httpObj.withCredentials = true;
            this.httpObj.send();
        }
    };
    window.xhrn = xhrn;
})(window);
