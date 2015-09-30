// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    "use strict";
    var packetQueue = {
        requestPackets: function (msgRepObj) {
            //more than one packets comes after connection on
            if (msgRepObj.length > 1) {
                virtualclass.wb.gObj.myArr = msgRepObj;
            }

            virtualclass.wb.sentReq = true;
            // If there is not dispayed any object yet
            // Then request for the object from start

            if (virtualclass.wb.gObj.displayedObjId == 0) {
                var sp = 0;
            } else {
                var sp = virtualclass.wb.gObj.rcvdPackId;
            }


            var ep = msgRepObj[0].uid;
            return [sp, ep];
        },

        makeQueue2: function (e) {
            if (virtualclass.wb.gObj.rcvdPackId != virtualclass.wb.gObj.displayedObjId) {
                virtualclass.wb.gObj.packQueue = virtualclass.wb.gObj.packQueue.concat(e.message.repObj);
                //console.log('Making Queue' + e.message.repObj[0].uid + '; Should not come.');
            }
        },

        makeQueue3: function (e) {
            for(var i=0; i < e.message.repObj.length; i++){
                virtualclass.wb.gObj.packQueue[e.message.repObj[i].uid] = e.message.repObj[i];
            }

           //console.log('Making Queue' + e.message.repObj[0].uid + '; Should not come.');
        },

        makeQueue: function (rec) {
                virtualclass.wb.gObj.queue[rec.uid] = rec;
            //console.log('Making Queue' + e.message.repObj[0].uid + '; Should not come.');
        },

        sendPackets: function (e, chunk) {
            if (e.message.getMsPckt[0] == 0) {
                var i = -1;
            } else {
                var fs = e.message.getMsPckt[0].uid;
                //TODO myrepObj should be changed into another name.
                for (var i = 0; i < virtualclass.wb.gObj.myrepObj.length; i++) {
                    if (e.message.getMsPckt[0] == virtualclass.wb.gObj.myrepObj[i].uid) {
                        fs = e.message.getMsPckt[0];
                        break;
                    }
                }
            }

            for (var j = i + 1; j < e.message.getMsPckt[1]; j++) {
                chunk.push(virtualclass.wb.gObj.myrepObj[j]);
            }
            return chunk;
        },

        handleMissedPackets: function (fromUserId, id, repObj) {
            var repObj = this.removeDupObjs(repObj);
            virtualclass.wb.gObj.replayObjs = virtualclass.wb.gObj.replayObjs.concat(repObj);
            packetQueue.sortingReplyObjs();

            if (fromUserId != id) {
                virtualclass.storage.store(JSON.stringify(virtualclass.wb.gObj.replayObjs));
            }
            this.containsIfQueuePacks(fromUserId, id, virtualclass.wb.gObj.displayedObjId, repObj);
        },

        removeDupObjs: function (repObj) {
            if (virtualclass.wb.gObj.myArr.length > 0) {
                if (repObj[repObj.length - 1].uid == virtualclass.wb.gObj.myArr[0].uid) {
                    if (!virtualclass.wb.gObj.myArr[0].hasOwnProperty('cmd')) {
                        virtualclass.wb.gObj.myArr.shift();
                    }
                }
                repObj = repObj.concat(virtualclass.wb.gObj.myArr);
                virtualclass.wb.gObj.myArr = [];
            }
            return repObj;
        },

        containsIfQueuePacks: function (fromUserId, id, dispId, repObj) {
            if (fromUserId != id && (dispId + 1 != repObj[0].uid)) {
                if (virtualclass.wb.gObj.packQueue.length > 0) {
                    if (repObj[repObj.length - 1].uid == virtualclass.wb.gObj.packQueue[0].uid) {
                        var fArr = repObj;
                        virtualclass.wb.gObj.packQueue = fArr.concat(virtualclass.wb.gObj.packQueue);
                    }
                }
            }
        },
        sortingReplyObjs: function () {
            virtualclass.wb.gObj.replayObjs = virtualclass.wb.gObj.replayObjs.sort(function (a, b) {
                return a.uid - b.uid;
            });
        }
    };
    window.bridge = packetQueue;
})(window);