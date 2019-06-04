var ioStorage = {

  dataAdapterStore: function (allData, serialKey) {
    if (typeof virtualclass.storage == 'object' && typeof virtualclass.storage.db == 'object') {
      virtualclass.storage.dataAdapterAllStore(JSON.stringify(allData), serialKey);
    } else {
      setTimeout(
        function () {
          ioStorage.dataAdapterStore(allData, serialKey); //if table of indexeddb is not ready yet.
        },
        10
      );
    }
  },

  dataUserAdapterMustData: function (allData, serialKey) {
    //debugger;
    if (typeof virtualclass.storage == 'object' && typeof virtualclass.storage.db == 'object') {
      virtualclass.storage.dataUserAdapterAllStore(JSON.stringify(allData), serialKey);
    } else {
      setTimeout(
        function () {
          //debugger;
          ioStorage.dataUserAdapterMustData(allData, serialKey); //if table of indexeddb is not ready yet.
        },
        10
      );
    }
  },

  dataExecutedStoreAll: function (DataExecutedAll, serialKey) {
    virtualclass.storage.dataExecutedStoreAll(JSON.stringify(DataExecutedAll), serialKey);
  },

  dataExecutedUserStoreAll: function (DataExecutedUserAll, serialKey) {
    virtualclass.storage.dataExecutedUserStoreAll(JSON.stringify(DataExecutedUserAll), serialKey);
  }

};
