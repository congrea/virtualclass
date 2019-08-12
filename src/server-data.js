// eslint-disable-next-line no-unused-vars
const serverData = {
  rawData: { video: [], ppt: [], docs: [] },
  syncComplete: false,
  syncxhr: axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': wbUser.lkey,
      'x-congrea-authuser': wbUser.auth_user,
      'x-congrea-authpass': wbUser.auth_pass,
      'x-congrea-room': wbUser.room,
      post: {
        'Content-Type': 'application/json',
      },
    },
  }),
  sdxhr: axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': wbUser.lkey,
      'x-congrea-authuser': wbUser.auth_user,
      'x-congrea-authpass': wbUser.auth_pass,
      'x-congrea-room': wbUser.room,
      post: {
        'Content-Type': 'application/json',
      },
    },
  }),

  onMessage(msg) {
    if (msg.rawData) {
      virtualclass.serverData.awsUrlArr(msg.rawData);
      virtualclass.serverData.syncComplete = true;
    }
  },

  syncAllData() {
    //console.log('====> Sync data init');
    return new Promise(((resolve) => {
      function syncAllDataInternal() {
        if (virtualclass.serverData.syncComplete === true) {
          resolve(true);
          return;
        }
        virtualclass.serverData.syncxhr.post(virtualclass.api.GetDocumentURLs, {})
          .then((response) => {
            virtualclass.serverData.awsUrlArr(response.data);
            //console.log('====> Sync data all ');
            ioAdapter.mustSend({ rawData: response.data, cf: 'rawSyncData' });
            virtualclass.serverData.syncComplete = true;
            resolve(true);
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error('Request failed with error ', error);
            setTimeout(() => syncAllDataInternal(), 1000);
          });
      }
      if (roles.hasControls()) {
        syncAllDataInternal();
      }
    }));
  },

  awsUrlArr(data) {
    this.rawData = { video: [], ppt: [], docs: [] };
    const processedArr = [];
    const arr = data.Items;
    const prefix = 'https://media.congrea.net/';
    const doc = 'https://media.congrea.net';
    let imageUrl; let pdfUrl;
    let thnailUrl;
    let cpath; // common path
    let obj;
    let count;

    function pad(n, length) {
      let len = length - (`${n}`).length;
      return (len > 0 ? new Array(++len).join('0') : '') + n;
    }

    for (let j = 0; j < arr.length; j += 1) {
      if (Object.prototype.hasOwnProperty.call(arr[j], 'filetype')) {
        // eslint-disable-next-line default-case
        switch (arr[j].filetype.S) {
          case 'doc':
            obj = this.processObj(arr[j]);
            cpath = arr[j].processed_data.M.commonpath.S;
            count = parseInt(arr[j].processed_data.M.count.N, 10);

            if (cpath != null && count != null) {
              const docPrefix = `${doc}/${arr[j].processed_data.M.commonpath.S}`;
              let num;
              let noteId;
              obj.notes = {};
              obj.notesarr = [];
              let deletedNotes = [];
              let disabledNotes = [];

              if (Object.prototype.hasOwnProperty.call(obj, 'deletednes')) {
                deletedNotes = obj.deletednes;
              }

              if (Object.prototype.hasOwnProperty.call(obj, 'disablednes')) {
                disabledNotes = obj.disablednes;
              }

              for (let i = 1; i <= count; i += 1) {
                num = pad(i, 3);
                imageUrl = `${docPrefix}/image/${num}.${arr[j].processed_data.M.image.M.type.S}`;
                pdfUrl = `${docPrefix}/pdf/${num}.pdf`;
                thnailUrl = `${docPrefix}/thumbnail/${num}.${arr[j].processed_data.M.thumbnail.M.type.S}`;
                virtualclass.createPrefetchLink(pdfUrl);
                if (i > 99) {
                  noteId = `${obj.fileuuid}_${i}`;
                } else if (i > 9) {
                  noteId = `${obj.fileuuid}_0${i}`;
                } else {
                  noteId = `${obj.fileuuid}_00${i}`;
                }
                const tobj = {};
                if (deletedNotes.length > 0) {
                  if (deletedNotes.indexOf(i) > -1) {
                    tobj.deletedn = noteId;
                  }
                }
                tobj.id = noteId;
                tobj.pdf = pdfUrl;
                tobj.image = imageUrl;
                tobj.thumbnail = thnailUrl;
                if (disabledNotes.length > 0) {
                  if (disabledNotes.indexOf(i) > -1) {
                    tobj.status = 0;
                  } else {
                    tobj.status = 1;
                  }
                } else {
                  tobj.status = 1;
                }
                obj.notes[noteId] = tobj;
                obj.notesarr.push(tobj);
              }
              processedArr.push(obj);
              this.rawData.docs.push(obj);
            }
            break;
          case 'video':
            if (arr[j].processed_data != null && arr[j].processed_data.S === 'COMPLETED') {
              obj = this.processObj(arr[j]);
              const add = obj.filepath.substr(0, obj.filepath.lastIndexOf('/'));
              obj.urls = {};
              obj.urls.thumbnail = {};
              obj.urls.videos = {};
              obj.urls.main_video = `${prefix + add}/video/play_video.m3u8`;
              obj.urls.videos['0400k'] = `${prefix + add}/video/0400k/video.m3u8`;
              obj.urls.videos['0600k'] = `${prefix + add}/video/0600k/video.m3u8`;
              obj.urls.videos['1000k'] = `${prefix + add}/video/1000k/video.m3u8`;
              obj.urls.videos['1500k'] = `${prefix + add}/video/1500k/video.m3u8`;
              obj.urls.videos['2000k'] = `${prefix + add}/video/2000k/video.m3u8`;
              obj.urls.thumbnail['0400k'] = `${prefix + add}/video/0400k/thumbs/00001.png`;
              obj.urls.thumbnail['0600k'] = `${prefix + add}/video/0600k/thumbs/00001.png`;
              obj.urls.thumbnail['1000k'] = `${prefix + add}/video/1000k/thumbs/00001.png`;
              obj.urls.thumbnail['1500k'] = `${prefix + add}/video/1500k/thumbs/00001.png`;
              obj.urls.thumbnail['2000k'] = `${prefix + add}/video/2000k/thumbs/00001.png`;
              processedArr.push(obj);
              this.rawData.video.push(obj);
            }
            break;
          case 'video_yts':
          case 'video_online':
            obj = this.processVidUrlObj(arr[j]);
            obj.urls = {};
            obj.urls.main_video = obj.URL;
            processedArr.push(obj);
            this.rawData.video.push(obj);
            break;
          case 'presentation':
            obj = this.processVidUrlObj(arr[j]);
            obj.urls = {};
            obj.urls.presentation = obj.URL;
            processedArr.push(obj);
            this.rawData.ppt.push(obj);
            break;
        }
      }
    }
  },

  processObj(obj) {
    const temp = {};
    // temp.filetag= obj.fileetag.S;
    temp.filename = obj.filename.S;
    temp.filepath = obj.filepath.S;
    temp.filetype = obj.filetype.S;
    temp.fileuuid = obj.fileuuid.S;
    temp.key_room = obj.key_room.S;

    if (Object.prototype.hasOwnProperty.call(obj, 'deleted')) {
      if (obj.deleted.NS[0] === '0') {
        temp.deleted = obj.deleted.NS[0];
      } else {
        temp.deletednes = obj.deleted.NS;
      }
    }

    if (Object.prototype.hasOwnProperty.call(obj, 'disabled')) {
      if (obj.disabled.NS[0] === '0') {
        temp.disabled = obj.disabled.NS[0];
      } else {
        temp.disablednes = obj.disabled.NS;
      }
    }
    return temp;
  },

  processVidUrlObj(obj) {
    const temp = {};
    // temp.filetag= obj.fileetag.S;
    temp.URL = obj.URL.S;
    temp.filename = temp.URL;
    temp.filetype = obj.filetype.S;
    temp.fileuuid = obj.fileuuid.S;
    temp.key_room = obj.key_room.S;
    if (Object.prototype.hasOwnProperty.call(obj, 'deleted')) {
      temp.deleted = obj.deleted.NS[0];
    }
    if (Object.prototype.hasOwnProperty.call(obj, 'disabled')) {
      temp.disabled = obj.disabled.NS[0];
    }
    return temp;
  },

  pollingStatus() {
    return new Promise((resolve) => {
      function pollingStatusInternal() {
        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'pollingDocumentStatus')) {
          clearTimeout(virtualclass.gObj.pollingDocumentStatus);
        }
        virtualclass.gObj.pollingDocumentStatus = setTimeout(
          () => {
            virtualclass.xhrn.vxhrn.post(virtualclass.api.GetDocumentStatus,
              { uuid: virtualclass.gObj.file.uuid }).then((response) => {
              const responseObj = response.data.Item;
              if (responseObj != null) {
                if (Object.prototype.hasOwnProperty.call(responseObj, 'processed_data')
                  && ((Object.prototype.hasOwnProperty.call(responseObj.processed_data, 'S')
                    && (responseObj.processed_data.S === 'COMPLETED'))
                  || (Object.prototype.hasOwnProperty.call(responseObj.processed_data, 'M')
                      && Object.prototype.hasOwnProperty.call(responseObj.processed_data.M, 'pdf')))) {
                  clearTimeout(virtualclass.gObj.pollingDocumentStatus);
                  virtualclass.serverData.syncComplete = false;
                  virtualclass.serverData.syncAllData().then(() => {
                    resolve();
                  });
                } else {
                  pollingStatusInternal();
                }
              }
            });
          }, 5000,
        );
      }
      pollingStatusInternal();
    });
  },
};
