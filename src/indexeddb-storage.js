// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  "use strict";
  let that;
  let dataStore = false;
  let dataAllStore = false;
  let storeFirstObj = false;
  const mc = false;

  const storage = {
    //  totalStored: (totalDataStored == null) ? 0 : JSON.parse(totalDataStored),
    version: 7,
    sessionEndFlag: false,
    async init() {
      /** *
       * Which table, what doing
       executedStoreAll => To store the executed data of users till now
       dataAdapterAll => To store the must data of all user.
       dataUserAdapterAll =>  To Store the must data of all user on particular user
       chunkData => To save chunk data which would be convert into file as later.
       wbData => To store the whiteboard data.
       config => For store the date of created session of particular room,
       By which, we calculate the time(after 48 hour we are
       ending the session for that particular room)
       executedUserStoreAll => for store the missed packet of according to user.
       */

      that = this;
      // TODO these are not using because audio and video is not using

      this.tables = ['wbData', 'chunkData', 'dataAdapterAll', 'dataUserAdapterAll', 'executedStoreAll', 'executedUserStoreAll', 'dstdata', 'pollStorage', 'quizData', 'dstall'];

      //  this.tables = ["wbData", "allData", "chunkData", "audioData", "config", "dataAdapterAll", "executedStoreAll", "dataUserAdapterAll"];

      //  Try and Catch not supporting here

      this.db = await virtualclass.virtualclassIDBOpen('vidya_apps', that.dbVersion, {
        upgrade(db, oldVersion, newVersion, transaction) {
          that.onupgradeneeded(db);
        },
      });

      if (typeof this.db.objectStoreNames === 'object' && this.db.objectStoreNames != null) {
        await this.onsuccess();
      } else {
        this.init();
      }
    },

    onupgradeneeded(db) {
      const thisDb = db;
      if (!thisDb.objectStoreNames.contains('wbData')) {
        thisDb.createObjectStore('wbData', { keyPath: 'did' });
      }


      // if (!thisDb.objectStoreNames.contains('config')) {
      //   thisDb.createObjectStore('config', { keyPath: 'timeStamp', autoIncrement: true });
      // }

      if (!thisDb.objectStoreNames.contains('chunkData')) {
        thisDb.createObjectStore('chunkData', { autoIncrement: true });
      }

      if (!thisDb.objectStoreNames.contains('dataAdapterAll')) {
        thisDb.createObjectStore('dataAdapterAll', { keyPath: 'serialKey' });
      }

      if (!thisDb.objectStoreNames.contains('dataUserAdapterAll')) {
        thisDb.createObjectStore('dataUserAdapterAll', { keyPath: 'serialKey' });
      }

      if (!thisDb.objectStoreNames.contains('executedStoreAll')) {
        thisDb.createObjectStore('executedStoreAll', { keyPath: 'serialKey' });
      }

      if (!thisDb.objectStoreNames.contains('executedUserStoreAll')) {
        thisDb.createObjectStore('executedUserStoreAll', { keyPath: 'serialKey' });
      }

      if (!thisDb.objectStoreNames.contains('dstdata')) {
        thisDb.createObjectStore('dstdata', { keyPath: 'timeStamp', autoIncrement: true });
      }

      if (!thisDb.objectStoreNames.contains('pollStorage')) {
        thisDb.createObjectStore('pollStorage', { keyPath: 'timeStamp', autoIncrement: true });
      }

      if (!thisDb.objectStoreNames.contains('quizData')) {
        thisDb.createObjectStore('quizData', { keyPath: 'quizkey' });
      }

      if (!thisDb.objectStoreNames.contains('dstall')) {
        thisDb.createObjectStore('dstall', { keyPath: 'timeStamp', autoIncrement: true });
      }
    },

    async onsuccess() {
      const pos = this.tables.indexOf('wbData');
      if (pos > -1) {
        var tables = this.tables.slice(pos + 1);
      } else {
        var { tables } = this;
      }

      await this.getAllObjs(tables, (result) => {
        if (virtualclass.gObj.myConfig === null) {
          that.config.createNewSession();
        }
      });
    },


    store(data) {
      // console.log("whiteboard data store");
      const tx = that.db.transaction('wbData', 'readwrite');
      tx.store.put({ repObjs: data, did: virtualclass.gObj.currWb, id: 1 });
      tx.done.then(() => {
        // console.log('success')
      }, () => {
        console.log('failure');
      });
    },


    pollStore(store) {
      const tx = that.db.transaction('pollStorage', 'readwrite');
      tx.store.add({ pollResult: store, currTime: new Date().getTime(), id: 1 });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });
    },

    wbDataRemove(key) {
      console.log('Whiteboard data remove');
      const tx = that.db.transaction(['wbData'], 'readwrite');
      tx.store.delete(key);
    },

    async dataExecutedStoreAll(data, serialKey) {
      const tx = that.db.transaction('executedStoreAll', 'readwrite');
      tx.store.put({ executedData: data, id: 6, serialKey });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });

      /** TODO, this should be enable * */

      // t.onerror = function ( e ) {
      //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
      //     e.preventDefault();
      // }
    },

    dataAdapterAllStore(data, serialKey) {
      const tx = that.db.transaction('dataAdapterAll', 'readwrite');
      tx.store.put({ adaptData: data, id: 5, serialKey });
      tx.done.then(() => {
        // console.log('success')
      }, () => {
        console.log('failure');
      });
      /** TODO, this should be enable * */
      // t.onerror = function ( e ) {
      //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
      //     e.preventDefault();
      // }
    },

    dataUserAdapterAllStore(data, serialKey) {
      const tx = that.db.transaction('dataUserAdapterAll', 'readwrite');
      tx.store.put({ adaptUserData: data, id: 7, serialKey });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });

      // hack for firefox
      // problem https://bugzilla.mozilla.org/show_bug.cgi?id=872873
      // solution https://github.com/aaronpowell/db.js/issues/98
      // TODO, this should be enable
      // t.onerror = function ( e ) {
      //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
      //     e.preventDefault();
      // }
    },


    dataExecutedUserStoreAll(data, serialKey) {
      const tx = that.db.transaction('executedUserStoreAll', 'readwrite');
      tx.store.put({ executedUserData: data, id: 8, serialKey });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });

      // t.onerror = function ( e ) {
      //     // prevent Firefox from throwing a ConstraintError and aborting (hard)
      //     e.preventDefault();
      // }
    },

    quizStorage(quizkey, data) {
      const tx = that.db.transaction('quizData', 'readwrite');
      tx.store.put({ qzData: data, quizkey });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });
    },

    async getAllObjs(tables, callback) {
      const cb = typeof callback !== 'undefined' ? callback : '';
      for (let i = 0; i < tables.length; i++) {
        const cursor = await this.db.transaction(tables[i]).store.openCursor();
        if (typeof cb === 'function') {
          if (tables[i] !== 'chunkData' && tables[i] !== 'quizData' && tables[i] !== 'pollStorage') {
            await this[tables[i]].handleResult(cursor, cb);
          }
        } else {
          await this[tables[i]].handleResult(cursor);
        }
      }
    },

    async getAllDataOfPoll(table, cb) {
      const wholeData = [];
      let cursor = await that.db.transaction('pollStorage').store.openCursor();

      while (cursor) {
        console.log(cursor.key, cursor.value);
        wholeData.push(cursor.value);
        cursor = await cursor.continue();
      }

      if (wholeData.length > 0) {
        cb(wholeData);
      } else {
        console.log('No data fetched from indexedDb');
      }
    },

    wbData: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('repObjs')) {
            if (typeof virtualclass.wb === 'object') {
              console.log(`Total Whiteboard Length ${JSON.parse(cursor.value.repObjs).length} From indexeddb`);
              virtualclass.wb[virtualclass.gObj.currWb].utility.replayFromLocalStroage(JSON.parse(cursor.value.repObjs));
            } else {
              virtualclass.gObj.tempReplayObjs._doc_0_0 = JSON.parse(cursor.value.repObjs);
            }
            storeFirstObj = true;
          }

          cursor = await cursor.continue();
        }

        if (!storeFirstObj && virtualclass.currApp === 'Whiteboard') {
          virtualclass.wb[virtualclass.gObj.currWb].utility.makeUserAvailable(); // at very first
        }
      },
    },


    dataAdapterAll: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('adaptData')) {
            const data = JSON.parse(cursor.value.adaptData);
            if (parseInt(cursor.value.serialKey) > ioAdapter.serial) {
              ioAdapter.serial = parseInt(cursor.value.serialKey);
            }
            // debugger;
            ioAdapter.adapterMustData[ioAdapter.serial] = data;
          }
          cursor = await cursor.continue();
        }
      },
    },

    dataUserAdapterAll: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('adaptUserData')) {
            const data = JSON.parse(cursor.value.adaptUserData);
            const usKey = cursor.value.serialKey.split('_');
            const uid = parseInt(usKey[0]); const
              serial = parseInt(usKey[1]);
            ioAdapter.validateAllVariables(uid);
            if (serial > ioAdapter.userSerial[uid]) {
              ioAdapter.userSerial[uid] = serial;
            }

            ioAdapter.userAdapterMustData[uid][serial] = data;
          }
          cursor = await cursor.continue();
        }
      },
    },


    executedStoreAll: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('executedData')) {
            const data = JSON.parse(cursor.value.executedData);
            // ioMissingPackets.executedSerial = cursor.value.serialKey;
            const akey = cursor.value.serialKey.split('_');
            const uid = parseInt(akey[0]); const
              serial = parseInt(akey[1]);
            ioMissingPackets.validateAllVariables(uid);
            ioMissingPackets.executedStore[uid][serial] = data;
            // console.log('till now executed ' + cursor.value.serialKey);
          }
          cursor = await cursor.continue();
        }
      },
    },


    executedUserStoreAll: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('executedUserData')) {
            const data = JSON.parse(cursor.value.executedUserData);

            // ioMissingPackets.executedSerial = cursor.value.serialKey;
            const akey = cursor.value.serialKey.split('_');
            const uid = parseInt(akey[0]); const
              serial = parseInt(akey[1]);

            ioMissingPackets.validateAllUserVariables(uid);

            ioMissingPackets.executedUserStore[uid][serial] = data;
          }
          cursor = await cursor.continue();
        }
      },
    },

    config: {
      async handleResult(cursor, cb) {
        if (cursor != null) {
          while (cursor) {
            if (cursor) {
              if (cursor.value.hasOwnProperty('myconfig')) {
                const config = JSON.parse(cursor.value.myconfig);
                if (typeof cb !== 'undefined') {
                  cb(config);
                }
              }
              cursor = await cursor.continue();
            }
          }
        } else if (typeof cb !== 'undefined') {
          cb();
        }
      },

      createNewSession() {
        virtualclass.makeAppReady(virtualclass.gObj.defaultApp);
        const currTime = new Date().getTime();
        const configData = JSON.stringify({ createdDate: currTime});
        localStorage.setItem('myConfig', configData);
      },

      endSession:  async function  (onlyStoredData) {
        console.log('==== End the session here');
        delete virtualclass.connectedUsers;
        if (virtualclass.gObj.hasOwnProperty('memberUpdateDelayTimer')) {
          clearTimeout(virtualclass.gObj.memberUpdateDelayTimer);
          virtualclass.gObj.memberlistpending.length = 0;
          delete virtualclass.gObj.memberUpdateDelayTimer;
        }

        if (virtualclass.hasOwnProperty('poll') && virtualclass.poll !== '') {
          virtualclass.poll.pollState = {};
          virtualclass.poll.dataRec = {};
        }

        const congrealogo = document.getElementById('congrealogo');
        if (congrealogo != null) {
          congrealogo.classList.remove('disbaleOnmousedown');
        }

        $('#chatroom_bt2').removeClass('ui-state-highlight');

        if (typeof virtualclass.videoUl === 'object' && virtualclass.videoUl.hasOwnProperty('player')
          && typeof virtualclass.videoUl.player === 'object' && virtualclass.videoUl.player.player_ != null

        ) {
          virtualclass.videoUl.destroyPlayer();
        }

        if (virtualclass.gObj.CDTimer != null) {
          clearInterval(virtualclass.gObj.CDTimer);
        }

        const currApp = document.querySelector(`#virtualclass${virtualclass.currApp}`);
        if (currApp != null) {
          currApp.style.display = 'none';
        }

        if (virtualclass.hasOwnProperty('media')) {
          virtualclass.media.audio.muteButtonToogle();
        }

        // Remove all chat user list
        const chatUsers = chatContainerEvent.elementFromShadowDom('.ui-memblist-usr', 'all');

        if (chatUsers != null && chatUsers.length > 0) {
          for (let i = 0; i < chatUsers.length; i++) {
            if (chatUsers[i] != null) {
              chatUsers[i].parentNode.removeChild(chatUsers[i]);
            }
          }
        }

        if (virtualclass.gObj.precheckScrn) {
          virtualclass.vutil.prechkScrnShare();
        }

        // virtualclass.raiseHand.raisehand();
        virtualclass.gObj.audioEnable = (roles.hasControls()) ? true : virtualclass.gObj.stdaudioEnable;
        virtualclass.storage.config.sessionEndFlag = true;
        const precheck = localStorage.getItem('precheck');
        // localStorage.clear();
        if (virtualclass.chat != null) {
          delete virtualclass.chat.vmstorage;
          virtualclass.chat.vmstorage = {};
          virtualclass.chat.removeChatHighLight('chatrm');
        }
        virtualclass.recorder.items = [];
        virtualclass.recorder.totalSent = 0;
        virtualclass.gObj.tempReplayObjs.length = 0;
        virtualclass.wb = ''; // make white board empty
        delete virtualclass.gObj.currWb; // deleting current whiteboard
        virtualclass.gObj.studentSSstatus.mesharing = false;
        virtualclass.removeSharingClass();
        virtualclass.gObj.studentSSstatus.shareToAll = false;
        virtualclass.gObj.studentSSstatus.sharing = false;
        delete virtualclass.gObj.whoIsSharing;
        if (virtualclass.videoHost != null) {
          virtualclass.videoHost.gObj.stdStopSmallVid = false;
          virtualclass.videoHost.gObj.allStdVideoOff = false;
        }

        virtualclass.gObj.wbTool = {};

        // virtualclass.recorder.rnum = 1; // set file to 1

        if (virtualclass.recorder.hasOwnProperty('startUpload')) {
          delete virtualclass.recorder.startUpload;
        }

        if (virtualclass.gObj.hasOwnProperty('downloadProgress')) {
          delete virtualclass.gObj.downloadProgress;
        }

        if (!onlyStoredData) {
          if (typeof virtualclass.wb === 'object') {
            alert('Clear all whiteboard');
            virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
            virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue();
            if (typeof virtualclass.wb[virtualclass.gObj.currWb].replay === 'object') {
              virtualclass.wb[virtualclass.gObj.currWb].replay.rendering = false;
            }
          }

          // virtualclass.clearAllChat();
          if (virtualclass.editorRich != null) {
            virtualclass.editorRich.removeEditorData();
          }
          virtualclass.pdfRender = {};
        }

        virtualclass.vutil.removeClass('audioWidget', 'fixed');
        virtualclass.storage.clearStorageData();


        virtualclass.wbCommon.removeAllContainers();
        virtualclass.gObj.wbCount = 0;
        virtualclass.gObj.currSlide = 0;

        // var prvAppObj = {name : "EditorRich"};
        virtualclass.currApp = virtualclass.gObj.defaultApp; // default app

        // hasMicrophone is true if audio is avaialble on hardware but the audio/video is disabled by user
        if (!virtualclass.gObj.hasOwnProperty('disableCamByUser')) {
          virtualclass.user.control.audioWidgetEnable(true);
        } else {
          virtualclass.user.control.audioDisable(); // Enable the audio if disabled
        }

        virtualclass.user.control.allChatEnable(); // Enabble all chat if disabled
        virtualclass.user.control.resetmediaSetting();

        if (roles.isStudent()) {
          const teacherVid = document.getElementById('videoHostContainer');
          if (teacherVid !== null) {
            teacherVid.style.display = 'none';
          }
          const leftPanel = document.getElementById('virtualclassAppRightPanel');
          if (leftPanel !== null && leftPanel.classList.contains('vidShow')) {
            leftPanel.classList.remove('vidShow');
          }
        } else {
          const sessionEndTool = document.getElementById('virtualclassSessionEndTool');
          if (sessionEndTool !== null) {
            sessionEndTool.className = virtualclass.vutil.removeClassFromElement('virtualclassSessionEndTool', 'active');
          }
        }

        if (typeof virtualclass.yts === 'object') {
          clearInterval(virtualclass.yts.tsc); // Clear If youTube seekChange interval is exist
        }

        if (typeof virtualclass.sharePt === 'object') {
          virtualclass.sharePt.UI.removeIframe();
        }

        console.log('Session End.');

        virtualclass.previous = `virtualclass${virtualclass.currApp}`;

        // True when fethcing data from indexeddb, there would not data store into table of indexeddb if it is true
        //  so need to do false
        virtualclass.getContent = false;
        virtualclass.recorder.storeDone = 0;


        workerIO.postMessage({ cmd: 'sessionEndClose' });
        if (precheck != null) {
          localStorage.setItem('precheck', JSON.parse(precheck));
        }

        console.log(`New role before clear ${virtualclass.gObj.uRole}`);
        virtualclass.settings.user = {};

        const virtualclassWhiteboard = document.querySelector('#virtualclassWhiteboard');
        if (virtualclassWhiteboard !== null) {
          virtualclassWhiteboard.style.display = 'none';
        }

        const virtualclassCont = document.querySelector('#virtualclassCont');
        if (virtualclassCont !== null) {
          virtualclassCont.classList.remove('loading');
        }

        localStorage.clear();

        // TODO, CHECK WHERE WE NEED TO PUT BELOW CREATENEWFUNCTION()
        // that.config.createNewSession();

        if (virtualclass.videoHost && roles.isStudent() && !virtualclass.isPlayMode) {
          const rightPanelElem = document.querySelector("#virtualclassAppRightPanel");
          if (rightPanelElem !== null && !rightPanelElem.classList.contains("vidHide")) {
            rightPanelElem.classList.add('vidHide');
          }
        }

        console.log(`New role after clear ${virtualclass.gObj.uRole}`);
        if (!virtualclass.enablePreCheck) {
        // Only popup the message, if the precheck is not enabled
          virtualclass.popup.waitMsg();
        }

        if (typeof virtualclass.dts === 'object' && virtualclass.dts != null) {
          virtualclass.dts.destroyDts();
        }

        if (typeof virtualclass.raiseHand === 'object' && virtualclass.raiseHand != null) {
          if (!roles.hasControls()) {
            const rh = document.querySelector('.congrea .handRaise.disable');
            if (rh) {
              rh.classList.remove('disable');
              rh.classList.add('enable');
              rh.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdEnabled'));
              const icon = document.querySelector('.congrea .handRaise #icHr');
              icon.setAttribute('data-action', 'enable');
              virtualclass.raiseHand.stdRhEnable = 'enabled';
            }
          } else {
            virtualclass.raiseHand.rhCount = 0;
            virtualclass.raiseHand.rhCountR = 0;
            const handBt = document.querySelector('.congrea .vmchat_bar_button .hand_bt.highlight');
            if (handBt) {
              handBt.classList.remove('highlight');
            }
            const text = document.querySelector('.congrea .vmchat_bar_button .hand_bt #notifyText');
            if (text) {
              text.innerHTML = '';
            }
          }
        }

        const chatDiv = document.getElementById('chat_div');
        if (chatDiv !== null) {
          const chatHighlight = chatContainerEvent.elementFromShadowDom('.vmchat_room_bt.ui-state-highlight');
          if (chatHighlight) {
            chatHighlight.classList.remove('ui-state-highlight');
          }

          const videOff = document.querySelector('#virtualclassCont.congrea.student');
          if (videOff && videOff.classList.contains('videoff')) {
            videOff.classList.remove('videoff');
          }
          const userList = document.querySelector('#virtualclassCont #memlist');
          const chatrm = document.querySelector('#virtualclassCont #chatrm');

          const listTab = document.querySelector('#user_list');
          const chatroomTab = document.querySelector('#chatroom_bt2');


          if (userList && !userList.classList.contains('enable')) {
            userList.classList.add('enable');
            userList.classList.remove('disable');
            if (chatrm) {
              chatrm.classList.add('disable');
              chatrm.classList.remove('enable');
            }
          }

          if (chatroomTab != null) {
            if (!listTab.classList.contains('active')) {
              listTab.classList.add('active');
            }
            chatroomTab.classList.remove('active');
          }
        }

        if (virtualclass.serverData != null) {
          virtualclass.serverData.rawData = { video: [], ppt: [], docs: [] };
          if (roles.hasAdmin()) {
            virtualclass.serverData.fetchAllData();
          }
        }

        virtualclass.gObj.wIds = [0];
        virtualclass.wbCommon.order = [0];
        virtualclass.gObj.wbCount = 0;
        virtualclass.wbCommon.clearNavigation();
        if (typeof virtualclass.wb === 'object') {
          delete virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
        }
        virtualclass.gObj.currIndex = 1;
      },
    },

    // Store for document sharing data
    dstdata: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('alldocs')) {
            console.log('document share store');
            dataStore = true;
            virtualclass.gObj.docs = JSON.parse(cursor.value.alldocs);
            // virtualclass.gObj.docs = 'init';
          }
          cursor = await cursor.continue();
        }

        if (!dataStore) {
          virtualclass.gObj.docs = 'init';
          console.log('==== Docs init ');
        }
      },
    },

    dstAllStore(data) {
      const tx = this.db.transaction('dstall', 'readwrite');
      tx.store.clear();

      const allNotes = JSON.stringify(virtualclass.dts.allNotes);
      tx.store.add({
        dstalldocs: JSON.stringify(data),
        allNotes,
        timeStamp: new Date().getTime(),
        id: 10,
      });
      tx.done.then(() => {
        console.log('success');
      }, () => {
        console.log('failure');
      });
    },

    dstall: {
      async handleResult(cursor) {
        while (cursor) {
          if (cursor.value.hasOwnProperty('dstalldocs')) {
            console.log('document share store');
            dataAllStore = true;
            // We are not getting the data from local storage for now
            virtualclass.gObj.dstAll = JSON.parse(cursor.value.dstalldocs);
            virtualclass.gObj.dstAllNotes = JSON.parse(cursor.value.allNotes);
          }
          cursor = await cursor.continue();
        }

        if (!dataAllStore) {
          console.log('document share store init');
          virtualclass.gObj.dstAll = 'init';
        }
      },
    },

    clearSingleTable(table, lastTable) {
      const tx = this.db.transaction(table, 'readwrite');
      tx.store.clear();

      if (typeof lastTable !== 'undefined') {
        lastTable();
      }

      // if we clear the indexed db then we need to
      // that docs to be init
      if (table == 'dstdata') {
        virtualclass.gObj.docs = 'init';
        console.log('==== Docs init ');
      }

      if (table == 'dstall') {
        virtualclass.gObj.dstall = 'init';
      }
    },

    clearStorageData() {
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


      for (let i = 0; i < this.tables.length; i++) {
        if (i + 1 == this.tables.length) {
          this.clearSingleTable(this.tables[i], this.clearLastTable);
        } else {
          this.clearSingleTable(this.tables[i]);
        }
      }
    },

    clearLastTable() {
      if (virtualclass.gObj.hasOwnProperty('sessionEndResolve')) {
        virtualclass.gObj.sessionEndResolve();
      }
    },

    // Get quiz data, store in array based on
    // key and then return array of object
    async getQuizData(cb) {
      const dataArr = [];
      let cursor = await this.db.transaction('quizData').store.openCursor();
      while (cursor) {
        const qdata = cursor.value;
        dataArr[cursor.value.quizkey] = cursor.value.qzData;
        cursor = await cursor.continue();
      }

      cb(dataArr);
    },

    // Clear all data from given table
    clearTableData(table) {
      const tx = this.db.transaction(table, 'readwrite');
      tx.store.clear();
    },

    // get whiteboard data accoring to whieboard id

    async getWbData(wbId) {
      const tx = await this.db.transaction('wbData', 'readwrite');
      const store = tx.objectStore('wbData');
      const wb = await store.get(wbId);

      if (typeof wb !== 'undefined') {
        console.log(`Whiteboard start store from local storage ${wbId}`);
        virtualclass.gObj.tempReplayObjs[wbId] = [];
        virtualclass.gObj.tempReplayObjs[wbId] = JSON.parse(wb.repObjs);
      } else {
        virtualclass.gObj.tempReplayObjs[wbId] = 'nodata';
      }
    },
  };
  window.storage = storage;
}(window));
