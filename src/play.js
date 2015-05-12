// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var i = 0;
    var records = [];
    var e = {}; //event object;
    var recordPlayer = function () {
        return {
            play: function () {
                var that = this;
                if (!this.hasOwnProperty('playTime')) {
                    this.playTime = records[0].playTime;
                }
                if (typeof records[i + 1] == 'undefined') {
                    e.data = records[i].recObjs;
                    io.onRecMessage(e);
                } else {
                    setTimeout(function () {
                        e.data = records[i].recObjs;
                        io.onRecMessage(e);
                        that.play();
                        i++;
                        that.playTime = records[i].playTime;
                    }, that.playTime);
                }
            }
        }
    };
    window.recordPlayer = recordPlayer;
})(window);