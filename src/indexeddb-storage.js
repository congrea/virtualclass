// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  const storage = {
    version: 1,
    mycacheQueue: [],
    mycacheInQueue: [],
    mycacheOutQueue: [],
    async init() {
      this.tables = [
        'cacheAll',
        'cacheOut',
        'cacheIn',
      ];

      virtualclass.storage.db = await virtualclass.virtualclassIDBOpen('congrea', virtualclass.storage.version, {
        upgrade(db) {
          virtualclass.storage.onupgradeneeded(db);
        },
      });

      if (typeof virtualclass.storage.db.objectStoreNames === 'object' && virtualclass.storage.db.objectStoreNames != null) {
        await virtualclass.storage.onsuccess();
      } else {
        virtualclass.storage.init();
      }
    },

    onupgradeneeded(db) {
      if (!db.objectStoreNames.contains('cacheAll')) {
        db.createObjectStore('cacheAll');
      }

      if (!db.objectStoreNames.contains('cacheOut')) {
        db.createObjectStore('cacheOut');
      }

      if (!db.objectStoreNames.contains('cacheIn')) {
        db.createObjectStore('cacheIn');
      }
    },

    async onsuccess() {
    },

    pollStore(store) {

    },

    wbDataRemove(key) {

    },

    storeCacheAll(data, serialKey) {
      const tx = virtualclass.storage.db.transaction('cacheAll', 'readwrite');
      serialKey[0] = parseInt(serialKey[0]);
      serialKey[1] = parseInt(serialKey[1]);

      tx.store.put(data, serialKey);
      tx.done.then(() => {
        // console.log('success');
      }, () => {
        // console.log('failure');
      });
    },


    storeCacheOut(data, serialKey) {
      const tx = virtualclass.storage.db.transaction('cacheOut', 'readwrite');
      tx.store.put(data, serialKey);
      tx.done.then(() => {
        // console.log('success');
      }, () => {
        // console.log('failure');
      });
    },

    storeCacheIn(data, serialKey) {
      const tx = virtualclass.storage.db.transaction('cacheIn', 'readwrite');
      tx.store.put(data, serialKey);
      tx.done.then(() => {
        // console.log('success');
      }, () => {
        // console.log('failure');
      });
    },

    async getDataFromCacheAll() {
      let cursor = await virtualclass.storage.db.transaction('cacheAll').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(virtualclass.storage.mycacheQueue[cursor.key[0]])) {
            virtualclass.storage.mycacheQueue[cursor.key[0]] = [];
          }
          virtualclass.storage.mycacheQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (virtualclass.storage.mycacheQueue.length > 0) {
        for (const key1 in virtualclass.storage.mycacheQueue) {
          ioMissingPackets.validateAllVariables(key1);
          for (const key2 in virtualclass.storage.mycacheQueue[key1]) {
            const m = JSON.parse(virtualclass.storage.mycacheQueue[key1][key2]);
            if (key1 === virtualclass.gObj.uid) {
              ioAdapter.validateAllVariables(key1);
              ioAdapter.serial = parseInt(key2, 10);
              ioAdapter.adapterMustData[ioAdapter.serial] = m;
            }
            ioMissingPackets.executedSerial[key1] = m.m.serial;
            ioMissingPackets.executedStore[key1][m.m.serial] = m;
            //console.log('onrecevie json ', JSON.stringify(m));
            io.onRecJson(m);

            // try {
            //   console.log('Execute till now ', ioMissingPackets.executedSerial[key1]);
            //   io.onRecJson(m);
            // } catch (error) {
            //   console.log(`Error ${error}`);
            // }
          }
        }
      }
    },

    async getDataFromCacheIn() {
      let cursor = await virtualclass.storage.db.transaction('cacheIn').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(virtualclass.storage.mycacheInQueue[cursor.key[0]])) {
            virtualclass.storage.mycacheInQueue[cursor.key[0]] = [];
          }
          virtualclass.storage.mycacheInQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (virtualclass.storage.mycacheInQueue.length > 0) {
        for (const key1 in virtualclass.storage.mycacheInQueue) {
          ioMissingPackets.validateAllUserVariables(key1);
          for (const key2 in virtualclass.storage.mycacheInQueue[key1]) {
            const m = JSON.parse(virtualclass.storage.mycacheInQueue[key1][key2]);
            ioMissingPackets.executedUserSerial[key1] = m.m.userSerial;
            ioMissingPackets.executedUserStore[key1][m.m.userSerial] = m;
            try {
              if (m.m.cf !== 'eddata') {
                io.onRecJson(m);
              }
            } catch (error) {
              // console.log(`Error ${error}`);
            }
          }
        }
      }
    },

    async getDataFromCacheOut() {
      let cursor = await virtualclass.storage.db.transaction('cacheOut').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(virtualclass.storage.mycacheOutQueue[cursor.key[0]])) {
            virtualclass.storage.mycacheOutQueue[cursor.key[0]] = [];
          }
          virtualclass.storage.mycacheOutQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (virtualclass.storage.mycacheOutQueue.length > 0) {
        for (const key1 in virtualclass.storage.mycacheOutQueue) {
          for (const key2 in virtualclass.storage.mycacheOutQueue[key1]) {
            const m = JSON.parse(virtualclass.storage.mycacheOutQueue[key1][key2]);
            ioAdapter.validateAllVariables(key1);
            ioAdapter.userSerial[key1] = parseInt(key2, 10);
            ioAdapter.userAdapterMustData[key1][ioAdapter.userSerial[key1]] = m;

            try {
              if (m.m.cf !== 'eddata') {
                io.onRecJson(m);
              }
            } catch (error) {
               console.log(`Error ${error}`);
            }
          }
        }
      }
    },

    quizStorage(quizkey, data) {

    },


    async getAllDataOfPoll(table, cb) {
      const wholeData = [];
      let cursor = await virtualclass.storage.db.transaction('pollStorage').store.openCursor();

      while (cursor) {
        // console.log(cursor.key, cursor.value);
        wholeData.push(cursor.value);
        cursor = await cursor.continue();
      }

      if (wholeData.length > 0) {
        cb(wholeData);
      } else {
        // console.log('No data fetched from indexedDb');
      }
    },

    clearSingleTable(table, lastTable) {
      // console.log('Clear single table ', table);

      const tx = virtualclass.storage.db.transaction(table, 'readwrite');
      tx.store.clear();

      if (typeof lastTable !== 'undefined') {
        lastTable();
      }

      // if we clear the indexed db then we need to
      // that docs to be init
      if (table == 'dstdata') {
        virtualclass.gObj.docs = 'init';
        // console.log('==== Docs init ');
      }

      if (table == 'dstall') {
        virtualclass.gObj.dstall = 'init';
      }
    },

    async clearStorageData() {
      ioAdapter.adapterMustData = [];
      ioAdapter.serial = -1;
      ioAdapter.userSerial = [];
      ioAdapter.userAdapterMustData = [];
      ioMissingPackets.executedStore = [];
      ioMissingPackets.executedSerial = {};
      ioMissingPackets.missRequest = [];
      ioMissingPackets.aheadPackets = [];
      ioMissingPackets.missRequestFlag = 0;
      ioMissingPackets.executedUserStore = [];
      ioMissingPackets.executedUserSerial = {};
      ioMissingPackets.missUserRequest = [];
      ioMissingPackets.aheadUserPackets = [];
      ioMissingPackets.missUserRequestFlag = 0;
      await Promise.all([
        this.clearSingleTable('cacheAll'),
        this.clearSingleTable('cacheIn'),
        this.clearSingleTable('cacheOut'),
      ]);
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'sessionEndResolve')) {
        virtualclass.gObj.sessionEndResolve();
      }
    },

    clearLastTable() {
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'sessionEndResolve')) {
        virtualclass.gObj.sessionEndResolve();
      }
    },

    // Get quiz data, store in array based on
    // key and then return array of object
    async getQuizData(cb) {

    },

    // Clear all data from given table
    clearTableData(table) {

    },

  };
  window.storage = storage;
}(window));
