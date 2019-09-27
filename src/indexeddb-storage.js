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

      this.db = await virtualclass.virtualclassIDBOpen('congrea', this.version, {
        upgrade(db) {
          virtualclass.storage.onupgradeneeded(db);
        },
      });
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

    storeCacheAll(data, serialKey) {
      const tx = this.db.transaction('cacheAll', 'readwrite');
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
      const tx = this.db.transaction('cacheOut', 'readwrite');
      tx.store.put(data, serialKey);
      tx.done.then(() => {
        // console.log('success');
      }, () => {
        // console.log('failure');
      });
    },

    storeCacheIn(data, serialKey) {
      const tx = this.db.transaction('cacheIn', 'readwrite');
      tx.store.put(data, serialKey);
      tx.done.then(() => {
        // console.log('success');
      }, () => {
        // console.log('failure');
      });
    },

    async getDataFromCacheAll() {
      let cursor = await this.db.transaction('cacheAll').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(this.mycacheQueue[cursor.key[0]])) {
            this.mycacheQueue[cursor.key[0]] = [];
          }
          this.mycacheQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (this.mycacheQueue.length > 0) {
        for (const key1 in this.mycacheQueue) {
          ioMissingPackets.validateAllVariables(key1);
          for (const key2 in this.mycacheQueue[key1]) {
            const m = JSON.parse(this.mycacheQueue[key1][key2]);
            if (key1 === virtualclass.gObj.uid) {
              ioAdapter.validateAllVariables(key1);
              ioAdapter.serial = parseInt(key2, 10);
              ioAdapter.adapterMustData[ioAdapter.serial] = m;
            }
            ioMissingPackets.executedSerial[key1] = m.m.serial;
            ioMissingPackets.executedStore[key1][m.m.serial] = m;
            //console.log('====> MSG serial ', m.m.serial);
            io.onRecJson(m);
          }
        }
      }
    },

    async getDataFromCacheIn() {
      let cursor = await this.db.transaction('cacheIn').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(this.mycacheInQueue[cursor.key[0]])) {
            this.mycacheInQueue[cursor.key[0]] = [];
          }
          this.mycacheInQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (this.mycacheInQueue.length > 0) {
        for (const key1 in this.mycacheInQueue) {
          ioMissingPackets.validateAllUserVariables(key1);
          for (const key2 in this.mycacheInQueue[key1]) {
            const m = JSON.parse(this.mycacheInQueue[key1][key2]);
            ioMissingPackets.executedUserSerial[key1] = m.m.userSerial;
            ioMissingPackets.executedUserStore[key1][m.m.userSerial] = m;
            try {
              if (m.m.cf !== 'eddata' && m.m.cf !== 'colorIndicator' && m.m.cf !== 'reqscreen' && m.m.cf !== 'msg') {
                io.onRecJson(m);
              } else {
              }
            } catch (error) {
              // console.log(`Error ${error}`);
            }
          }
        }
      }
    },

    async getDataFromCacheOut() {
      let cursor = await this.db.transaction('cacheOut').store.openCursor();
      while (cursor) {
        if (cursor.value) {
          if (!Array.isArray(this.mycacheOutQueue[cursor.key[0]])) {
            this.mycacheOutQueue[cursor.key[0]] = [];
          }
          this.mycacheOutQueue[cursor.key[0]][cursor.key[1]] = cursor.value;
        }
        cursor = await cursor.continue();
      }

      if (this.mycacheOutQueue.length > 0) {
        for (const key1 in this.mycacheOutQueue) {
          for (const key2 in this.mycacheOutQueue[key1]) {
            const m = JSON.parse(this.mycacheOutQueue[key1][key2]);
            ioAdapter.validateAllVariables(key1);
            ioAdapter.userSerial[key1] = parseInt(key2, 10);
            ioAdapter.userAdapterMustData[key1][ioAdapter.userSerial[key1]] = m;
            try {
              if (m.m.cf !== 'eddata' && m.m.cf !== 'reqscreen' && m.m.cf !== 'msg') { // We do
                io.onRecJson(m);
              }
            } catch (error) {
              console.log(`Error ${error}`);
            }
          }
        }
      }
    },
    clearSingleTable(table, lastTable) {
      // console.log('Clear single table ', table);

      const tx = this.db.transaction(table, 'readwrite');
      tx.store.clear();

      if (typeof lastTable !== 'undefined') {
        lastTable();
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
  };
  window.storage = storage;
}(window));
