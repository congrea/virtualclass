// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  var packetQueue = {
    requestPackets(msgRepObj) {
      // more than one packets comes after connection on
      if (msgRepObj.length > 1) {
        virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr = msgRepObj;
      }

      virtualclass.wb[virtualclass.gObj.currWb].sentReq = true;
      // If there is not dispayed any object yet
      // Then request for the object from start

      if (virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId == 0) {
        var sp = 0;
      } else {
        var sp = virtualclass.wb[virtualclass.gObj.currWb].gObj.rcvdPackId;
      }


      const ep = msgRepObj[0].uid;
      return [sp, ep];
    },

    makeQueue(rec) {
      //  console.log('Whiteboard making in queue ' + rec.uid);
      virtualclass.wb[virtualclass.gObj.currWb].gObj.queue[rec.uid] = rec;
      // console.log('Making Queue' + e.message.repObj[0].uid + '; Should not come.');
    },

    sendPackets(e, chunk) {
      if (e.message.getMsPckt[0] == 0) {
        var i = -1;
      } else {
        let fs = e.message.getMsPckt[0].uid;
        // TODO myrepObj should be changed into another name.
        for (var i = 0; i < virtualclass.wb[virtualclass.gObj.currWb].gObj.myrepObj.length; i++) {
          if (e.message.getMsPckt[0] == virtualclass.wb[virtualclass.gObj.currWb].gObj.myrepObj[i].uid) {
            fs = e.message.getMsPckt[0];
            break;
          }
        }
      }

      for (let j = i + 1; j < e.message.getMsPckt[1]; j++) {
        chunk.push(virtualclass.wb[virtualclass.gObj.currWb].gObj.myrepObj[j]);
      }
      return chunk;
    },

    handleMissedPackets(fromUserId, id, repObj) {
      var repObj = this.removeDupObjs(repObj);
      virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs.concat(repObj);
      packetQueue.sortingReplyObjs();

      if (fromUserId != id) {
        virtualclass.storage.store(JSON.stringify(virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs));
      }
      this.containsIfQueuePacks(fromUserId, id, virtualclass.wb[virtualclass.gObj.currWb].gObj.displayedObjId, repObj);
    },

    removeDupObjs(repObj) {
      if (virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr.length > 0) {
        if (repObj[repObj.length - 1].uid == virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr[0].uid) {
          if (!virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr[0].hasOwnProperty('cmd')) {
            virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr.shift();
          }
        }
        repObj = repObj.concat(virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr);
        virtualclass.wb[virtualclass.gObj.currWb].gObj.myArr = [];
      }
      return repObj;
    },

    containsIfQueuePacks(fromUserId, id, dispId, repObj) {
      if (fromUserId != id && (dispId + 1 != repObj[0].uid)) {
        if (virtualclass.wb[virtualclass.gObj.currWb].gObj.packQueue.length > 0) {
          if (repObj[repObj.length - 1].uid == virtualclass.wb[virtualclass.gObj.currWb].gObj.packQueue[0].uid) {
            const fArr = repObj;
            virtualclass.wb[virtualclass.gObj.currWb].gObj.packQueue = fArr.concat(virtualclass.wb[virtualclass.gObj.currWb].gObj.packQueue);
          }
        }
      }
    },
    sortingReplyObjs() {
      virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs = virtualclass.wb[virtualclass.gObj.currWb].gObj.replayObjs.sort((a, b) => a.uid - b.uid);
    },
  };
  window.bridge = packetQueue;
}(window));
