function CommonXHR() {
    this.init();
}

CommonXHR.prototype.init = function () {
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        this.httpObj = new XMLHttpRequest();
    } else {
        this.httpObj = new ActiveXObject("Microsoft.XMLHTTP");
    }

    this.onReadStateChange();
}

CommonXHR.prototype.onReadStateChange = function () {
    var that = this;
    this.httpObj.onreadystatechange = function () {
        if (that.httpObj.readyState == 4) {
            if (typeof that.cb != 'undefined') {
                if (that.httpObj.status == 200) {
                    that.cb(that.httpObj.response);
                } else {
                    that.cb("ERROR");
                    /* that.cb("ERROR " + that.httpObj.status); */
                }
            }
        }
    }
}

CommonXHR.prototype.send = function (url, cb, responseType) {
    console.log('Common URL ' + url);
    this.cb = cb;
    this.httpObj.open("GET", url, true);
    this.httpObj.responseType = responseType;

    this.httpObj.setRequestHeader('x-api-key', wbUser.lkey);
    this.httpObj.setRequestHeader('x-congrea-authuser', wbUser.auth_user);
    this.httpObj.setRequestHeader('x-congrea-authpass', wbUser.auth_pass);
    this.httpObj.setRequestHeader('x-congrea-room', wbUser.room);

    this.httpObj.withCredentials = true;
    this.httpObj.send();
}
