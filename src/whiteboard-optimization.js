// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var optimize = {
        sendPacketWithOptimization: function (jobj, readyState, time) {
            if (typeof this.lastarrowtime == 'undefined') {
                this.lastarrowtime = new Date().getTime();
               // virtualclass.wb.sentPackets = virtualclass.wb.sentPackets + jobj.length;
                if (readyState == 1) {
                    virtualclass.vutil.beforeSend(JSON.parse(jobj));
                }

                virtualclass.wb.utility.updateSentInformation(jobj, true);
            }
            this.presentarrowtime = new Date().getTime();
            if ((this.presentarrowtime - this.lastarrowtime) >= time) {
          //      virtualclass.wb.sentPackets = virtualclass.wb.sentPackets + jobj.length;
                if (readyState == 1) {
                    //virutalclass.vutil.beforeSend(JSON.parse(jobj));
                    var msg = JSON.parse(jobj);

                    if (msg.hasOwnProperty('createArrow')) {
                        ioAdapter.send(msg);
                    } else {
                        ioAdapter.mustSend(msg);
                    }
                }
                virtualclass.wb.utility.updateSentInformation(jobj, true);
                this.lastarrowtime = new Date().getTime();
            }
        },

        doOptiMize: function (e) {
            if (((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
                lastmousemovetime = new Date().getTime();
                if (!e.detail.hasOwnProperty('cevent')) {
                    vcan.optimize.calculatePackets(lastmousemovetime, 'm', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                }
            }

            presentmousemovetime = new Date().getTime();

            if ((presentmousemovetime - lastmousemovetime) >= 2000) {	 // Optimized
                var currTime = new Date().getTime();
                if (!e.detail.hasOwnProperty('cevent')) {
                    vcan.optimize.calculatePackets(lastmousemovetime, 'm', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                }
                vcan.optimize.calculatePackets(lastmousemovetime, 'm', (e.clientX - vcan.main.offset.x), (e.clientY - vcan.main.offset.y));
                lastmousemovetime = new Date().getTime();
            }
        },

        calculatePackets: function (time, ac, x, y) {
            var obj = vcan.makeStackObj(time, ac, x, y);
            virtualclass.wb.uid++;
            obj.uid = virtualclass.wb.uid;
            vcan.main.replayObjs.push(obj);
            virtualclass.vutil.beforeSend({'repObj': [obj], 'cf': 'repObj'});
            virtualclass.storage.store(JSON.stringify(vcan.main.replayObjs));
        }
    };
    vcan.optimize = optimize;
})(window);