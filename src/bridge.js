// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */

(
    function(window) {
        
        var bridge = {
            requestPackets : function(msgRepObj) {
                
                //more than one packets comes after connection on
                if (msgRepObj.length > 1) {
                    vApp.wb.gObj.myArr = msgRepObj;
                }

                vApp.wb.sentReq = true;
                var sp = vApp.wb.gObj.rcvdPackId;
                var ep = msgRepObj[0].uid;
                return [sp, ep];
            },

            makeQueue  : function(e) {
                if (vApp.wb.gObj.rcvdPackId != vApp.wb.gObj.displayedObjId) {
                    vApp.wb.gObj.packQueue = vApp.wb.gObj.packQueue.concat(e.message.repObj);
                }
            },

            sendPackets :function(e, chunk) {
                if (e.message.getMsPckt[0] == 0) {
                    var i = -1;
                } else {
                    var fs = e.message.getMsPckt[0].uid;
                    //TODO myrepObj should be changed into another name.
                    for (var i = 0; i < vApp.wb.gObj.myrepObj.length; i++) {
                        if (e.message.getMsPckt[0] == vApp.wb.gObj.myrepObj[i].uid) {
                            fs = e.message.getMsPckt[0];
                            break;
                        }
                    }
                }

                for (var j = i + 1; j < e.message.getMsPckt[1]; j++) {
                    chunk.push(vApp.wb.gObj.myrepObj[j]);
                }
                return chunk;
            },

            handleMissedPackets : function(fromUserId, id, repObj) {
                var repObj = this.removeDupObjs(repObj);
                vApp.wb.gObj.replayObjs = vApp.wb.gObj.replayObjs.concat(repObj);
                bridge.sortingReplyObjs();

                if (fromUserId != id) {
                    vApp.storage.store(JSON.stringify(vApp.wb.gObj.replayObjs));
                }
                this.containsIfQueuePacks(fromUserId, id, vApp.wb.gObj.displayedObjId, repObj);
            },

            removeDupObjs : function(repObj) {
                if (vApp.wb.gObj.myArr.length > 0) {
                    if (repObj[repObj.length - 1].uid == vApp.wb.gObj.myArr[0].uid) {
                        if (!vApp.wb.gObj.myArr[0].hasOwnProperty('cmd')) {
                            vApp.wb.gObj.myArr.shift();
                        }
                    }
                    repObj = repObj.concat(vApp.wb.gObj.myArr);
                    vApp.wb.gObj.myArr = [];
                }
                return repObj;
            },

            containsIfQueuePacks : function(fromUserId, id, dispId, repObj) {
                if (fromUserId != id && (dispId + 1 != repObj[0].uid)) {
                    if (vApp.wb.gObj.packQueue.length > 0) {
                        if (repObj[repObj.length - 1].uid == vApp.wb.gObj.packQueue[0].uid) {
                            var fArr = repObj;
                            vApp.wb.gObj.packQueue = fArr.concat(vApp.wb.gObj.packQueue);
                        }
                    }
                }
            },
            sortingReplyObjs : function() {
                vApp.wb.gObj.replayObjs = vApp.wb.gObj.replayObjs.sort(function(a, b) {
                    return a.uid - b.uid;
                });
            }
        }
        window.bridge = bridge;
    }
)(window);