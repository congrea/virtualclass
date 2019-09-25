const ioStorage = {
  storeCacheAllDataSend(data, key) {
    const msg = {
      user: { userid: wbUser.id },
      m: data.arg.msg,
    };
    msg.user.lname = virtualclass.gObj.allUserObj[virtualclass.gObj.uid].lname;
    msg.user.name = virtualclass.gObj.allUserObj[virtualclass.gObj.uid].name;
    msg.user.role = virtualclass.gObj.allUserObj[virtualclass.gObj.uid].role;
    msg.type = 'broadcastToAll';
    virtualclass.storage.storeCacheAll(JSON.stringify(msg), key);
  },

  storeCacheAllData(data, key) {
    const msg = ioStorage.addUserObj(data);
    virtualclass.storage.storeCacheAll(JSON.stringify(msg), key);
  },

  storeCacheOutData(data, key) {
    // if (data.m.cf !== 'eddata') {
    const msg = ioStorage.addUserObj(data);
    virtualclass.storage.storeCacheOut(JSON.stringify(msg), key);
    // }
  },

  addUserObj(msg) {
    if (!Object.prototype.hasOwnProperty.call(msg, 'type') && Object.prototype.hasOwnProperty.call(msg, 'user')) {
      msg.type = 'broadcastToAll';
      if (typeof virtualclass.gObj.allUserObj[msg.user.userid] === 'undefined') {
        virtualclass.gObj.allUserObj[msg.user.userid] = {};
        virtualclass.gObj.allUserObj[msg.user.userid].userid = msg.user.userid;
        virtualclass.gObj.allUserObj[msg.user.userid].lname = ' ';
        virtualclass.gObj.allUserObj[msg.user.userid].name = 'student';
        virtualclass.gObj.allUserObj[msg.user.userid].role = 's';
      }

      if (virtualclass.gObj.allUserObj[msg.user.userid].userid === msg.user.userid) {
        msg.user.lname = virtualclass.gObj.allUserObj[msg.user.userid].lname;
        msg.user.name = virtualclass.gObj.allUserObj[msg.user.userid].name;
        msg.user.role = virtualclass.gObj.allUserObj[msg.user.userid].role;
      }
    }
    return msg;
  },

  storeCacheInData(data, key) {
    // if (data.m.cf !== 'eddata') {
    virtualclass.storage.storeCacheIn(JSON.stringify(data), key);
    // }
  },
};
