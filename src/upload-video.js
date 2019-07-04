(function (window) {
  const videoUl = function () {
    return {
      videos: [],
      uploaderParam: {},
      videoObj: {},
      videoId: '',
      videoUrl: '',
      isfullscreen: false,
      order: [],
      currPlaying: '',
      autoPlayFlag: 1,
      status: 0,
      yts: false,
      online: false,
      listEndPause: false,
      attachPlayer: false,

      /*
       * it creates the the necessary layout and containers to place
       * video
       * Call to the function to create player object
       * @param  videoObj
       * @param  startFrom the position from where to start playing video in second

       */
      init(videoObj, startFrom) {
        this.videoInit = true;
        this.currPlaying = '';
        this.pages = {};
        virtualclass.previrtualclass = 'virtualclass' + 'Video';
        virtualclass.previous = 'virtualclass' + 'Video';
        this.autoPlayFlag = 1;
        if (typeof videoObj !== 'undefined') {
          if (videoObj.init != 'studentlayout') {
            this.videoId = videoObj.init.videoId || videoObj.init;
            this.videoUrl = videoObj.init.videoUrl;
            this.yts = videoObj.init.yts;
            this.online = videoObj.init.online;
            this.isPaused = videoObj.init.isPaused;
          }
          if (typeof videoObj.isAutoplay !== 'undefined') {
            this.autoPlayFlag = videoObj.isAutoplay;
          }
        }

        if (!roles.hasAdmin() || (roles.isEducator())) {
          if (typeof this.videoId === 'undefined' && roles.isStudent() && !virtualclass.videoUl.yts) {
          } else {
            this.UI.container();
            if (roles.hasControls()) {
              ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
              ioAdapter.mustSend({
                videoUl: {
                  init: { id: virtualclass.videoUl.videoId, videoUrl: virtualclass.videoUl.videoUrl },
                  startFrom: virtualclass.videoUl.player.currentTime(),
                },
                cf: 'videoUl',
              });
            } else if (typeof videoObj !== 'undefined') {
              // this.UI.defaultLayoutForStudent();
              // to b e modified
              if (!videoObj.hasOwnProperty('fromReload')) {
                if (this.videoId == undefined || typeof this.videoId === 'undefined') {
                  // this.UI.defaultLayoutForStudent();
                } else if (typeof this.videoId === 'object' && this.videoId.yts == false) {
                  // this.UI.defaultLayoutForStudent();
                } else {
                  const url = videoObj.url || videoObj.init.videoUrl;
                  if (typeof url !== 'undefined' && url != '' && videoObj.init != 'studentlayout') {
                    (typeof startFrom === 'undefined') ? this.UI.displayVideo(videoObj.id, url) : this.UI.displayVideo(videoObj.id, url, startFrom);
                  }
                }
              } else {
                this.fromReload(this.videoId, this.videoUrl, startFrom);
              }
            } else {
              // this.UI.defaultLayoutForStudent();
              const msz = document.getElementById('messageLayoutVideo');
              if (msz) {
                msz.style.display = 'block';
              }
            }
          }
        } else {
          this.UI.container();
          const dashboardnav = document.querySelector('#dashboardnav button');
          if (dashboardnav != null) {
            dashboardnav.click();
          }

          if (typeof startFrom !== 'undefined') {
            this.fromReload(this.videoId, this.videoUrl, startFrom);
          } else {
            ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
          }
        }
        // if(!virtualclass.isPlayMode){
        //     this.startsync();
        // }
      },

      isPlayerReady() {
        return (virtualclass.videoUl.hasOwnProperty('player') && typeof virtualclass.videoUl.player === 'object');
      },

      // startsync () {
      //     virtualclass.vutil.clearSyncTimeInterval();
      //     virtualclass.videoUl.syncTimeInterval = setInterval(() => {
      //         if(virtualclass.videoUl.videoUrl != null && virtualclass.videoUl.videoUrl != "" && virtualclass.videoUl.player != null){
      //             ioAdapter.sync({time : virtualclass.videoUl.player.currentTime(), 'app': 'video', 'cf': 'sync'});
      //         }
      //     }, 1000);
      // },


      createPageModule() {
        if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
          virtualclass.videoUl.videos.forEach((vidObj, i) => {
            const idPostfix = vidObj.id;
            virtualclass.videoUl.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status);
          });
        }
      },

      reArrangeElements(order) {
        const container = document.getElementById('listvideo');
        const tmpdiv = document.createElement('div');
        tmpdiv.id = 'listvideo';
        tmpdiv.className = 'videos';

        const videos = this.getActiveVideos();
        const sortedItems = [];

        let orderChange = false;
        for (let j = 0; j < videos.length; j++) {
          if (order.indexOf(videos[j].fileuuid) <= -1) {
            order.push(videos[j].fileuuid);
            orderChange = true;
          }
        }
        if (orderChange) {
          virtualclass.videoUl.order = order;
          virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
          orderChange = false;
        }

        for (let i = 0; i < order.length; i++) {
          const elem = document.getElementById(`linkvideo${order[i]}`);
          if (elem) {
            tmpdiv.appendChild(elem);
          }
        }

        container.parentNode.replaceChild(tmpdiv, container);
      },

      getActiveVideos() {
        const activeVideos = [];
        for (let i = 0; i < virtualclass.videoUl.videos.length; i++) {
          if (!virtualclass.videoUl.videos[i].hasOwnProperty('deleted')) {
            activeVideos.push(virtualclass.videoUl.videos[i]);
          }
        }
        return activeVideos;
      },

      /*
       * after reload video state is retrived from localstorage
       * @param  id id of video
       * @param  url of the video
       * @param  startFrom place from where to start the video

       */
      fromReload(id, url, startFrom) {
        virtualclass.videoUl.UI.container();
        if (url) {
          virtualclass.videoUl.UI.displayVideo(id, url, startFrom);
        } else {
          const obj = {};
          obj.init = id;
          // virtualclass.yts.init(obj,startFrom);
        }
      },

      /*
       * saves current list and current order in localstorage on reload

       */
      saveVideosInLocalStr() {
        const { order } = virtualclass.videoUl;
        console.log(order);
        console.log('videosinlocalstorage');
        console.log(virtualclass.videoUl.videos);
        // localStorage.setItem('videoList', JSON.stringify(virtualclass.videoUl.videos));
        // localStorage.setItem('videoOrder', JSON.stringify(virtualclass.videoUl.order));
      },


      requestOrder() {
        virtualclass.vutil.requestOrder('vid',
          (response) => {
            if (response == 'Error') {
              console.log('page order retrieve failed');
            } else if (typeof response !== 'undefined' && response != undefined) {
              virtualclass.videoUl.order = [];
              virtualclass.videoUl.order = response;
              if (virtualclass.videoUl.order.length > 0) {
                virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order); // 1
              }
            }
          });
      },

      /*
       * after upload video callbback function to update  order of videolist
       * and new order to save in dabase
       * @param response message

       */
      // new

      afterDocStatus(response) {
        const object = response;
      },

      updateOrder() {
        const activeVideos = this.getActiveVideos();
        if (activeVideos.length != this.order.length) {
          const videos = activeVideos.map(video => video.fileuuid);
          this.order = videos;
        }
        this.sendOrder(this.order);
      },

      afterUploadVideo(id, xhr, res) {
        var res = res.success;
        if (res) {
          const url = virtualclass.api.GetDocumentStatus;
          const that = this;
          that.updateOrder();
          virtualclass.videoUl.order.push(virtualclass.gObj.file.uuid);
          virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
          virtualclass.videoUl.showUploadMsz('Video uploaded successfully', 'alert-success');
          const popup = document.querySelector('.congrea #VideoDashboard #videoPopup');
          if (popup) {
            if (!popup.classList.contains('uploadSuccess')) {
              popup.classList.add('uploadSuccess');
            }
          }

          for (let i = 0; i < virtualclass.gObj.uploadingFiles.length; i++) {
            const fileObj = {};
            fileObj.filename = `${virtualclass.gObj.uploadingFiles[i].name} (Processing...)`;
            fileObj.fileuuid = virtualclass.gObj.uploadingFiles[i].uuid;
            fileObj.filetype = 'video';
            fileObj.key_room = `${virtualclass.gObj.sessionInfo.key}_${virtualclass.gObj.sessionInfo.room}`;
            fileObj.noVideo = true;
            console.log(`File uploading ${fileObj.filename}`);
            this.afterUploadFile(fileObj);
          }

          virtualclass.gObj.uploadingFiles = [];
          virtualclass.serverData.pollingStatus(virtualclass.videoUl.UI.awsVideoList);
        } else {
          virtualclass.videoUl.showUploadMsz('video upload failed', 'alert-error');
        }

        const msz = document.querySelector('#videoPopup .qq-upload-list-selector.qq-upload-list');
        if (msz) {
          msz.style.display = 'none';
        }
      },

      showUploadMsz(msg, type) {
        const mszCont = document.querySelector('#VideoDashboard #uploadMsz');
        const alertMsz = document.querySelector('#VideoDashboard #uploadMsz .alert');
        if (alertMsz) {
          alertMsz.parentNode.removeChild(alertMsz);
        }
        const elem = document.createElement('div');
        elem.className = 'alert  alert-dismissable';
        elem.classList.add(type);
        elem.innerHTML = msg;
        mszCont.appendChild(elem);

        const btn = document.createElement('button');
        btn.className = 'close';
        btn.setAttribute('data-dismiss', 'alert');
        btn.innerHTML = '&times';
        btn.addEventListener('click', () => {
          const msz = document.querySelector('#uploadMsz');
          if (msz) {
            msz.style.display = 'none';
          }
          const popup = document.querySelector('.congrea #VideoDashboard #videoPopup');
          if (popup) {
            popup.classList.remove('uploadSuccess');
          }
          elem.parentNode.removeChild(elem);
        });
        elem.appendChild(btn);
      },

      retrieveOrder() {
        this.requestOrder();
      },


      afterUploadFile(vidObj) {
        const idPostfix = vidObj.fileuuid;
        // var docId = 'docs' + doc;
        this.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status, vidObj.filetype);
        if (vidObj.filetype == 'video_yts') {
          const ytsId = virtualclass.videoUl.getVideoId(vidObj.URL);
          virtualclass.videoUl.UI.fetchYtsTitle(vidObj, ytsId);
        }
        this.pages[idPostfix].init(idPostfix, vidObj.filename);
        this.videoDisplayHandler(vidObj);
        const vid = document.getElementById(`linkvideo${vidObj.fileuuid}`);
        const title = document.getElementById(`videoTitle${vidObj.fileuuid}`);
        if (title) {
          title.innerHTML = vidObj.filename;
        }

        const controlElem = vid.getElementsByClassName('status')[0];

        if (vidObj.hasOwnProperty('disabled')) {
          this._disable(vidObj.fileuuid);
          if (vid) {
            vid.classList.add('disable');
            vid.dataset.status = 0;
          }
        } else {
          this._enable(vidObj.fileuuid);
          if (vid) {
            vid.classList.add('enable');
            vid.dataset.status = 1;
          }
        }
        controlElem.dataset.status = vid.dataset.status;
        this.calculateHeight();

        if (vidObj.hasOwnProperty('noVideo')) {
          vid.classList.add('noVideo');
        }
      },


      calculateHeight() {
        const element = document.querySelector('#listvideo');
        const fineUploader = document.querySelector('.congrea .qq-uploader-selector');
        console.log(element.offsetHeight);
        const h = element.offsetHeight;
        console.log(fineUploader.offsetHeight);
        $('.qq-uploader-selector').css({
          minHeight: h,

        });
      },

      showVideos(content, storedId) {
        if (roles.hasControls()) {
          virtualclass.videoUl.showVideoList();
        }
        const currId = virtualclass.videoUl.currPlaying || storedId;
        if (virtualclass.videoUl.videoUrl) {
          virtualclass.videoUl.activeVideoClass(virtualclass.videoUl.videoId);
          virtualclass.vutil.showFinishBtn();
        }
      },

      showVideoList() {
        const list = document.getElementById('videoList');
        const elem = document.getElementById('listvideo');
        if (elem) {
          for (let i = 0; i < elem.childNodes.length - 1; i++) {
            elem.childNodes[i].parentNode.removeChild(elem.childNodes[i]);
          }
        }
        if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
          virtualclass.videoUl.videos.forEach((vidObj, i) => {
            if (!vidObj.hasOwnProperty('deleted')) {
              const elem = document.querySelector(`#linkvideo${vidObj.fileuuid}`);
              if (elem != null) {
                elem.classList.remove('noVideo');
              }
              virtualclass.videoUl.afterUploadFile(vidObj);
            }
          });
        }
        // virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');


        // virtualclass.vutil.removeFinishBtn();
        virtualclass.vutil.makeElementActive('#listvideo');
        const video = document.querySelector('.congrea #listvideo .linkvideo.singleVideo');
        const link = document.querySelector('.congrea #listvideo .linkvideo');
        if (virtualclass.videoUl.videos.length == 1 && !video) {
          link.classList.add('singleVideo');
        } else if (virtualclass.videoUl.videos.length > 1 && video) {
          video.classList.remove('singleVideo');
        }
      },

      videoDisplayHandler(vidObj) {
        const video = document.getElementById(`mainpvideo${vidObj.fileuuid}`);
        if (video && !vidObj.status) {
          if (!video.classList.contains('playDisable')) {
            video.classList.add('playDisable');
          }
        } else if (video && video.classList.contains('playDisable')) {
          video.classList.remove('playDisable');
        }
        if (video) {
          video.addEventListener('click', () => {
            virtualclass.videoUl.isPaused = false;
            if (vidObj.filetype == 'video_yts') {
              virtualclass.videoUl.yts = true;
              virtualclass.videoUl.online = false;
            } else if (vidObj.filetype == 'video_online') {
              virtualclass.videoUl.yts = false;
              virtualclass.videoUl.online = true;
            } else {
              virtualclass.videoUl.yts = false;
              virtualclass.videoUl.online = false;
            }

            if (vidObj.urls) {
              const url = vidObj.urls.main_video;
              virtualclass.videoUl.UI.displayVideo(vidObj.fileuuid, url);
              virtualclass.videoUl.activeVideoClass(vidObj.fileuuid);

              const toStd = {};
              toStd.content_path = url;
              toStd.id = vidObj.fileuuid;
              toStd.title = vidObj.filename;
              toStd.type = vidObj.filetype;

              virtualclass.videoUl.videoToStudent(toStd);
              virtualclass.videoUl.videoId = vidObj.fileuuid;
              virtualclass.vutil.showFinishBtn();
              virtualclass.dashBoard.close();
            }
          });
        }
      },

      activeVideoClass(currId) {
        var otherElems = document.getElementsByClassName('controlCont');
        for (var i = 0; i < otherElems.length; i++) {
          if (otherElems[i].classList.contains('removeCtr')) {
            otherElems[i].classList.remove('removeCtr');
          }
        }
        const controlElem = document.getElementById(`controlContvideo${currId}`);
        if (controlElem && !controlElem.classList.contains('removeCtr')) {
          controlElem.classList.add('removeCtr');
        }

        var otherElems = document.getElementsByClassName('linkvideo');
        for (var i = 0; i < otherElems.length; i++) {
          if (otherElems[i].classList.contains('playing')) {
            otherElems[i].classList.remove('playing');
          }
        }

        const currentVideo = document.getElementById(`linkvideo${currId}`);
        if (currentVideo && !currentVideo.classList.contains('playing')) {
          currentVideo.classList.add('playing');
        }
      },

      shareVideo(videoUrl) {
        const videoObj = {};
        const id = 'no';
        virtualclass.videoUl.UI.displayVideo(id, videoUrl);
        videoObj.instantVideo = true;
        videoObj.content_path = videoUrl;
        virtualclass.videoUl.videoToStudent(videoObj);
      },

      destroyPl() {
        if (typeof virtualclass.videoUl.player === 'object') {
          if (virtualclass.currApp == 'ScreenShare') {
            ioAdapter.mustSend({ video: 'destroyPl', cf: 'video' });
          }
          virtualclass.videoUl.player.dispose();
        }
      },


      _rearrange(order) {
        this.order = order;
        this.reArrangeElements(order); // 2, rearrange
        this.sendOrder(this.order);
      },

      async _editTitle(id, title, videotype) {
        var form_data = new FormData();
        const data = {
          lc_content_id: id, action: 'edit', title, user: virtualclass.gObj.uid,
        };
        var form_data = new FormData();
        for (const key in data) {
          form_data.append(key, data[key]);
          console.log(data[key]);
        }

        await this.vxhr.post(`${window.webapi}&user=${virtualclass.gObj.uid}&methodname=update_content_video`, form_data)
          .then((response) => {
            const elem = document.getElementById(`videoTitle${id}`);
            if (elem) {
              elem.innerHTML = title;
              elem.style.display = 'inline';
              // virtualclass.videoUl.order=[];
              if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
                virtualclass.videoUl.videos.forEach((video, index) => {
                  if (video.id == id) {
                    console.log(video);
                    video.title = title;
                  }
                });
              }
            }
          })
          .catch((error) => {
            console.error('Request failed with error ', error);
          });
      },

      sendOrder(order, type) {
        type = 'vid';
        virtualclass.vutil.sendOrder(type, order);
      },


      /*
       * message  handled at student's end
       * and new order to save in dabase
       * @param message from teacher

       */
      onmessage(msg) {
        if (typeof msg.videoUl === 'string') {
          if (msg.videoUl == 'play') {
            this.playVideo(msg);
            virtualclass.videoUl.isPaused = false;
          } else if (msg.videoUl == 'pause') {
            this.pauseVideo();
            virtualclass.videoUl.isPaused = true;
          } else if (msg.videoUl == 'destroyPlayer') {
            virtualclass.videoUl.destroyPlayer();
          } else if (msg.videoUl == 'enterFullScreen') {
            // alert("enter full screen");
            virtualclass.videoUl.enterFullScreen();
          } else if (msg.videoUl == 'exitFullScreen') {
            // alert("exit full screen");
            virtualclass.videoUl.exitFullScreen();
          } else if (msg.videoUl == 'videoDelete') {
            const playerCont = document.querySelector('#videoPlayerCont');
            if (playerCont) {
              playerCont.style.display = 'none';
              const msz = document.querySelector('#messageLayoutVideo');
              if (msz) {
                msz.style.display = 'block';
              }
              virtualclass.videoUl.videoId = null;
              virtualclass.videoUl.videoUrl = null;
              const video = document.querySelector('.congrea #dispVideo video');
              const ytube = document.querySelector('.congrea #dispVideo iframe');
              const cont = video || ytube;
              if (cont) {
                cont.setAttribute('src', '');
              }
            }
          }
        } else {
          this.onmessageObj(msg);
        }
      },

      /*
       * message  handled at student's end
       * and new order to save in dabase
       * @param message from teacher

       */

      onmessageObj(msg) {
        if (msg.videoUl.type) {
          if (msg.videoUl.type == 'video_yts') {
            virtualclass.videoUl.yts = true;
            virtualclass.videoUl.online = false;
          } else if (msg.videoUl.type == 'video_online') {
            virtualclass.videoUl.online = true;
            virtualclass.videoUl.yts = false;
          } else {
            virtualclass.videoUl.yts = false;
            virtualclass.videoUl.online = false;
          }
        }

        if (msg.videoUl.hasOwnProperty('init')) {
          // virtualclass.videoUl.yts=false;
          virtualclass.videoUl.rec = msg.videoUl;
          console.log(virtualclass.videoUl.rec);
          if (msg.videoUl.init == 'studentlayout') {
            virtualclass.makeAppReady('Video', undefined, msg.videoUl);
            const msz = document.getElementById('messageLayoutVideo');
            if (msz) {
              msz.style.display = 'block';
            }
          } else if (msg.videoUl.init.hasOwnProperty('videoUrl')) {
            virtualclass.videoUl.videoId = msg.videoUl.init.id;
            virtualclass.videoUl.videoUrl = msg.videoUl.init.videoUrl;
            virtualclass.videoUl.UI.displayVideo(msg.videoUl.init.id, msg.videoUl.init.videoUrl, msg.videoUl.startFrom);
            // if (msg.videoUl.isPaused) {
            //     if (virtualclass.videoUl.player){
            //         virtualclass.videoUl.player.pause();
            //     }
            // }
          }
        } else if (msg.videoUl.hasOwnProperty('content_path')) {
          virtualclass.videoUl.videoId = msg.videoUl.id;
          virtualclass.videoUl.videoUrl = msg.videoUl.content_path;
          virtualclass.videoUl.title = msg.videoUl.title;
          virtualclass.videoUl.UI.displayVideo(msg.videoUl.id, virtualclass.videoUl.videoUrl);
        } else if (msg.videoUl.hasOwnProperty('play')) {
          this.playVideo(msg.videoUl.play);
          virtualclass.videoUl.isPaused = false;
        }
      },

      enablePlayer() {
        const stdVideo = document.getElementById('videoPlayerCont');
        if (stdVideo) {
          stdVideo.style.display = 'block';
        }
      },

      disablePlayer() {
        const stdVideo = document.getElementById('videoPlayerCont');
        if (stdVideo) {
          stdVideo.style.display = 'none';
        }
      },

      destroyPlayer() {
        virtualclass.videoUl.player.dispose();
      },

      playVideo(seekVal) {
        if (virtualclass.videoUl.isPlayerReady()) {
          console.log('====Video play');
          virtualclass.videoUl.player.currentTime(seekVal);
          virtualclass.videoUl.player.play();
        }
      },

      pauseVideo() {
        // todo pass paused time to students
        if (virtualclass.videoUl.isPlayerReady()) {
          console.log('====Video pause');
          virtualclass.videoUl.player.pause();
          virtualclass.videoUl.isPaused = true;
        }
      },

      /*
       * to play next video from the  the playlist
       * @param index  of next enabled video in the videolist array
       */

      autoPlayList(index) {
        const videos = this.getActiveVideos();
        const videoUrl = '';
        const nextIndex = index;
        // var nextId = virtualclass.videoUl.order[index + 1];
        let currVideoObj = this.findNextObj(nextIndex);
        if (typeof currVideoObj !== 'object') {
          const nxIndex = currVideoObj;
          if (nxIndex < videos.length) {
            currVideoObj = this.autoPlayList(nxIndex);
          }
        } else {
          const toStd = {};
          toStd.id = currVideoObj.fileuuid;
          toStd.title = currVideoObj.filename;
          toStd.type = currVideoObj.filetype;

          if (!virtualclass.videoUl.listEnd) {
            if (currVideoObj.filetype == 'video_online') {
              virtualclass.videoUl.yts = false;
              virtualclass.videoUl.online = true;
              //  virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.URL);
              virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
              virtualclass.videoUl.videoToStudent(currVideoObj);

              if (virtualclass.videoUl.player) {
                // virtualclass.videoUl.player.on("ready",function() {
                //     virtualclass.videoUl.player.play();
                // })
              }
              this.activeVideoClass(currVideoObj.id);

              toStd.content_path = currVideoObj.URL;
            } else {
              virtualclass.videoUl.online = false;
              if (currVideoObj.filetype == 'video_yts') {
                virtualclass.videoUl.yts = true;
                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
                toStd.content_path = currVideoObj.URL;
              } else {
                virtualclass.videoUl.yts = false;
                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.urls.main_video);
                toStd.content_path = currVideoObj.urls.main_video;
              }

              // virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid,currVideoObj.urls.main_video);

              virtualclass.videoUl.videoToStudent(toStd);
            }

            if (virtualclass.videoUl.player) {
              virtualclass.videoUl.player.ready(function () {
                const myPlayer = this;
                myPlayer.play();
              });
            }
            this.activeVideoClass(currVideoObj.fileuuid);
          }
        }
      },
      /*
       * to find next video from the videolist

       */
      findNextObj(index) {
        const nextId = this.findNextVideoId(index);
        let currVideoObj = false;
        const videos = this.getActiveVideos();
        for (let i = 0; i < videos.length; i++) {
          // for (var j in virtualclass.videoUl.videos[i]) {
          if (videos[i].fileuuid == nextId) {
            const vid = document.getElementById(`linkvideo${videos[i].fileuuid}`);
            if (vid.getAttribute('data-status') == '1') {
              currVideoObj = videos[i];
              return currVideoObj;
            }
            return index + 1;
          }
        }
      },

      findNextVideoId(index) {
        const list = document.querySelectorAll('#listvideo .linkvideo');
        if (index < list.length) {
          return list[index].getAttribute('data-rid');
        }
        return false;
      },
      findVideoIndex(vidId) {
        const list = document.querySelectorAll('#listvideo .linkvideo');
        let index = 0;
        for (let i = 0; i < list.length; i++) {
          if (list[i].getAttribute('data-rid') == vidId) {
            index = i;
            return index;
          }
        }
      },

      /*
       * to disable  video in the videolist
       */

      _disable(_id) {
        const linkvideo = document.querySelector(`#linkvideo${_id}`);
        linkvideo.classList.add('playDisable');
        const video = document.getElementById(`mainpvideo${_id}`);
        video.style.opacity = 0.3;
        video.style.pointerEvents = 'none';

        if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
          virtualclass.videoUl.videos.forEach((elem, i) => {
            if (elem.fileuuid == _id) {
              elem.disabled = 0;
              elem.status = 0;
            }
          });
        }
      },

      /*
       * to enable  video in the videolist
       */
      _enable(_id) {
        const linkvideo = document.querySelector(`#linkvideo${_id}`);
        linkvideo.classList.remove('playDisable');


        const video = document.getElementById(`mainpvideo${_id}`);
        if (video) {
          video.style.opacity = 1;
          video.style.pointerEvents = 'auto';
          if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
            virtualclass.videoUl.videos.forEach((elem, i) => {
              if (elem.fileuuid == _id) {
                delete (elem.disabled);
                elem.status = 1;
              }
            });
          }
        }
      },

      /*
       * to delete  video from list and from the database
       */
      _delete(id) {
        const data = {
          uuid: id,
          action: 'delete',
          page: 0,
        };
        const videoid = id;
        const url = virtualclass.api.UpdateDocumentStatus;
        const that = this;
        // virtualclass.xhrn.sendFormData({uuid:videoid}, url, function (msg) {
        //     that.afterDeleteCallback(msg)
        // });

        virtualclass.xhrn.vxhrn.post(url, data).then((msg) => {
          that.afterDeleteCallback(msg.data, id);
        });
      },

      afterDeleteCallback(msg, id) {
        if (msg != 'ERROR') {
          const type = 'saved';
          const elem = document.getElementById(`linkvideo${id}`);
          if (elem) {
            elem.parentNode.removeChild(elem);

            // if current playing video is deleted
            if (virtualclass.videoUl.videoId == id) {
              // if(type !="yts"){
              const playerCont = document.querySelector('#videoPlayerCont');
              if (playerCont) {
                playerCont.style.display = 'none';
                ioAdapter.mustSend({ videoUl: 'videoDelete', cf: 'videoUl' });
                virtualclass.videoUl.videoId = null;
                virtualclass.videoUl.videoUrl = null;
                var video = document.querySelector('.congrea #dispVideo video');
                const ytube = document.querySelector('.congrea #dispVideo iframe');
                const cont = video || ytube;
                if (cont) {
                  cont.setAttribute('src', '');
                }
                virtualclass.vutil.removeFinishBtn();
              }
            }
            if (virtualclass.videoUl.videos && virtualclass.videoUl.videos.length) {
              virtualclass.videoUl.videos.forEach((video, index) => {
                if (video.fileuuid == id) {
                  var index = virtualclass.videoUl.videos.indexOf(video);
                  if (index >= 0) {
                    virtualclass.videoUl.videos.splice(index, 1);
                    console.log(virtualclass.videoUl.videos);
                  }
                }
              });
            }

            const idIndex = virtualclass.videoUl.order.indexOf(id);
            if (idIndex >= 0) {
              virtualclass.videoUl.order.splice(idIndex, 1);
              console.log(virtualclass.videoUl.order);
              // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
              virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
            }
            if (!virtualclass.videoUl.videos.length) {
              virtualclass.vutil.removeFinishBtn();
            } else if (virtualclass.videoUl.videos.length == 1) {
              var video = document.querySelector('.congrea #listvideo .linkvideo');
              if (video) {
                video.classList.add('singleVideo');
              }
            }
          }
        }
      },

      xhrOrderSend(order) {
        const data = { order: order.toString() };
        const url = virtualclass.api.UpdateRoomMetaData;
        virtualclass.xhrn.vxhrn.post(url, data).then(() => {
          // virtualclass.videoUl.UI.awsr();
          virtualclass.serverData.syncAllData().then(() => {
            virtualclass.videoUl.UI.awsVideoList();
          });
          // virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
        });
      },

      videoToStudent(videoObj) {
        ioAdapter.mustSend({ videoUl: videoObj, cf: 'videoUl' });
      },

      getVideoId(url) {
        const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const m = url.match(rx);
        if (m != null && m.length > 1) {
          const r = m[1].substring(0, 11);
          if (r.length == 11) {
            return r;
          }
        }
        return false;
      },

      /*
       * this object is for user interface
       */
      UI: {
        id: 'virtualclassVideo',
        class: 'bootstrap virtualclass',
        /*
         * Creates container for the video and appends the container before audio widget
         */
        container() {
          let videoCont = document.getElementById('virtualclassVideo');
          if (!videoCont) {
            const control = !!roles.hasAdmin();
            const data = { control };
            const template = JST[`${virtualclass.gObj.tempPrefix}/videoupload/videoupload.hbs`];
            // $('#virtualclassAppLeftPanel').append(template(data));
            virtualclass.vutil.insertAppLayout(template(data));

            videoCont = document.getElementById(this.id);
          }
          if (!roles.hasControls()) {
            const msz = document.getElementById('messageLayoutVideo');
            if (msz) {
              msz.style.display = 'block';
            }
          }
        },
        createYoutubeUrlCont(cont) {
          const list = document.createElement('div');
          list.id = 'listvideo';
          cont.appendChild(list);
        },

        displayVideo(vidId, videoUrl, startFrom) {
          const that = this;
          if (virtualclass.videoUl.hasOwnProperty('displayVideoTime')) {
            clearTimeout(virtualclass.videoUl.displayVideoTime);
          }
          virtualclass.videoUl.displayVideoTime = setTimeout(
            () => {
              if (virtualclass.currApp == 'Video') {
                that._displayVideo(vidId, videoUrl, startFrom);
              }
            }, 300,
          );
        },

        _displayVideo(vidId, videoUrl, startFrom) {
          if (typeof virtualclass.videoUl.player === 'object') {
            if (virtualclass.videoUl.player.hasOwnProperty('dispose')) {
              virtualclass.videoUl.player.dispose();
            }
          }
          virtualclass.videoUl.videoUrl = videoUrl;
          virtualclass.videoUl.videoId = vidId;
          // var videourl = "https://dev.muzioapp.com.s3-website-us-east-1.amazonaws.com/content/ourMuzeVid1.webm";
          var videoCont = document.getElementById('videoPlayerCont');
          if (videoCont) {
            videoCont.style.display = 'block';
          } else {
            virtualclass.videoUl.UI.container();
            var videoCont = document.getElementById('videoPlayerCont');
          }
          const ply = document.querySelector('iframe#player');
          if (ply) {
            ply.remove();
          }

          virtualclass.videoUl.UI.switchDisplay(videoCont, videoUrl);
          virtualclass.videoUl.UI.videojsPlayer(videoUrl, vidId, startFrom);
          virtualclass.modal.hideModal();
        },

        videojsPlayer(videoUrl, vidId, startFrom) {
          if (!virtualclass.videoUl.player) {
            const player = videojs('dispVideo'); // TODO, generating error need to handle
            if (roles.hasControls()) {
              if (!($('.vjs-autoPlay-button').length)) {
                virtualclass.videoUl.UI.appendAutoPlayButton(player);
              }
              const autoPlayBtn = document.getElementById('autoPlayListBtn');
              if (autoPlayBtn) {
                // autoPlayBtn.innerHTML = virtualclass.videoUl.innerHtml;
                autoPlayBtn.className = virtualclass.videoUl.autoPlayClass;
              }
            }

            virtualclass.videoUl.player = player;
            virtualclass.videoUl.UI.attachPlayerHandler(virtualclass.videoUl.player, vidId, videoUrl);
          }
          // virtualclass.videoUl.player.reset();
          virtualclass.videoUl.UI.onEndedHandler(virtualclass.videoUl.player, vidId, videoUrl);
          virtualclass.videoUl.UI.setPlayerUrl(virtualclass.videoUl.player, videoUrl, startFrom);
        },
        attachPlayerHandler(player, vidId, videoUrl) {
          if (!this.attachPlayer) {
            this.attachPlayer = true;
            console.log('Attach video player');
            player.on('pause', (e) => {
              console.log('paused');
              if (roles.hasControls()) {
                ioAdapter.mustSend({ videoUl: 'pause', cf: 'videoUl' });
              }
              virtualclass.videoUl.isPaused = true;
            });

            player.on('play', (e) => {
              console.log('play');
              if (roles.hasControls()) {
                ioAdapter.mustSend({ videoUl: { play: player.currentTime() }, cf: 'videoUl' });
              }
              virtualclass.videoUl.isPaused = false;
            });
          }
        },
        // todo to modify
        switchDisplay(videoCont, videoUrl) {
          var elem = document.getElementById('dispVideo');
          if (!elem) {
            virtualclass.videoUl.UI.createVideoElem(videoCont);
          } else {
            elem.style.display = 'block';
          }

          var elem = document.getElementById('videoPlayerCont');
          const msz = document.getElementById('messageLayoutVideo');
          if (typeof videoUrl === 'undefined') {
            elem.style.display = 'none';
            if (msz) {
              msz.style.display = 'block';
            } else {
              var elem = document.createElement('div');
              elem.id = 'messageLayoutVideo';
            }
          } else {
            elem.style.display = 'block';
            if (msz) {
              msz.style.display = 'none';
            }
          }
        },
        // n
        createVideoElem(videoCont, type) {
          const video = '<video id="dispVideo" class="video-js" autoplay controls  preload="auto" data-setup="{}" >';
          videoCont.insertAdjacentHTML('beforeend', video);
          // $(videoCont).append(video);
          const vn = document.createElement('p');
          vn.setAttribute('class', 'vjs-no-js');
          const videoElem = document.getElementById('dispVideo');
          videoElem.appendChild(vn);

          const a = document.createElement('a');
          a.setAttribute('href', 'https://videojs.com/html5-video-support/');
          a.setAttribute('target', '_blank');
          a.innerHTML = 'supports HTML5 video';
          vn.appendChild(a);
        },

        setPlayerUrl(player, videoUrl, startFrom) {
          console.log('====Video init to play start');
          if (startFrom == undefined && virtualclass.videoUl.startTime) {
            startFrom = virtualclass.videoUl.startTime;
          }

          if (player.poster_) {
            player.poster_ = '';
          }

          /* player.reset(); */
          const dispVideo = document.querySelector('#dispVideo');
          if (virtualclass.videoUl.yts) {
            dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],"preload": "auto"}');
            player.src({ type: 'video/youtube', src: videoUrl });
          } else if (virtualclass.videoUl.online) {
            dispVideo.setAttribute('data-setup', '{"preload": "auto" }');
            player.src({ type: 'video/webm', src: videoUrl });
            player.src({ type: 'video/mp4', src: videoUrl });
          } else {
            dispVideo.setAttribute('data-setup', '{"preload": "auto"}');
            player.src({ type: 'application/x-mpegURL', withCredentials: true, src: videoUrl });
          }


          player.ready(function () {
            const myPlayer = this;
            /** When video is loaded * */
            myPlayer.on('loadedmetadata', () => {
              if (virtualclass.videoUl.isPaused) {
                myPlayer.pause();
              } else if (virtualclass.system.device == 'desktop') {
                myPlayer.play();
              }
              if (startFrom) {
                myPlayer.currentTime(startFrom);
                if (virtualclass.videoUl.yts && !virtualclass.videoUl.isPaused && virtualclass.system.device == 'desktop') {
                  myPlayer.play();
                }
              }
            });
          });

          console.log(startFrom);
        },
        //  todo  modify
        appendAutoPlayButton(player) {
          // var on = '<div>auto play is on</div>'
          // var off = '<div>auto play is off</div>'
          // virtualclass.videoUl.innerHtml = virtualclass.videoUl.autoPlayFlag ? on : off;
          virtualclass.videoUl.autoPlayClass = virtualclass.videoUl.autoPlayFlag ? 'vjs-autoPlay-button vjs-control on' : 'vjs-autoPlay-button vjs-control off';

          player.controlBar.addChild('button', {
            el: videojs.createEl('button', {
              className: 'vjs-autoPlay-button vjs-control on',
              // innerHTML: '<div>auto play</div>',
              id: 'autoPlayListBtn',
              role: 'button',
              title: 'Auto Play',
              onclick() {
                virtualclass.videoUl.UI.autoPlayFn(this);
              },
            }),
          });
        },
        autoPlayFn(cthis) {
          if (cthis.classList.contains('off')) {
            virtualclass.videoUl.autoPlayFlag = 1;
            cthis.classList.remove('off');
            cthis.classList.add('on');
            // cthis.innerHTML = "auto play is on"
            cthis.style.color = 'green';
          } else {
            virtualclass.videoUl.autoPlayFlag = 0;
            cthis.classList.remove('on');
            cthis.classList.add('off');
            // cthis.innerHTML = "auto play is off";
            cthis.style.color = 'red';
          }
        },
        onEndedHandler(player, vidId, videoUrl) {
          player.off('ended');

          player.on('ended', (e) => {
            virtualclass.videoUl.UI.onEnded(player, vidId, videoUrl);
          });
        },

        onEnded(player, vidId, videoUrl) {
          // player.reset();
          const dispVideo = document.querySelector('#dispVideo');
          if (virtualclass.videoUl.yts) {
            dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],controls: true,}');
            player.src({ type: 'video/youtube', src: videoUrl });
          } else if (virtualclass.videoUl.online) {
            dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
            player.src({ type: 'video/webm', src: videoUrl });
            player.src({ type: 'video/mp4', src: videoUrl });
          } else {
            dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
            player.src({ type: 'application/x-mpegURL', withCredentials: true, src: videoUrl });
          }
          console.log(`ended${vidId}`);


          const list = document.querySelectorAll('#listvideo .linkvideo');
          let index = 0;
          for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute('data-rid') == vidId) {
              index = i;
              break;
            }
          }


          if (virtualclass.videoUl.autoPlayFlag) {
            if (player.poster_) {
              player.poster_ = '';
            }
            if (virtualclass.videoUl.findNextVideoId(index + 1)) {
              virtualclass.videoUl.autoPlayList(index + 1, list);
            } else {
              virtualclass.videoUl.UI.autoVideoPause();
            }
          } else {
            virtualclass.videoUl.UI.autoVideoPause();
          }
        },

        autoVideoPause() {
          virtualclass.videoUl.isPaused = true;
          const paused = virtualclass.videoUl.isPaused;
          virtualclass.videoUl.listEndPause = true;
          virtualclass.videoUl.player.on('play', () => {
            if (virtualclass.videoUl.listEndPause) {
              console.log('==== Video is paused');
              virtualclass.videoUl.player.pause();
              virtualclass.videoUl.listEndPause = false;
            }
          });
        },


        inputUrl() {
          const videocont = document.getElementById('congreaShareVideoUrlCont');
          const studentMessage = document.getElementById('messageLayout');
          if (studentMessage != null) {
            studentMessage.parentNode.removeChild(studentMessage);
          }

          const submitURL = document.getElementById('submitURL');
          submitURL.addEventListener('click', () => {
            const input = document.querySelector('.congrea #videourl');
            const isURL = virtualclass.videoUl.UI.validateURL(input.value);
            if (isURL) {
              const playing = document.querySelector(' #listvideo .playing');
              if (playing) {
                playing.classList.remove('playing');
              }
              const ctr = document.querySelector(' #listvideo .removeCtr');
              if (ctr) {
                ctr.classList.remove('removeCtr');
              }

              //                            $('.congrea #listvideo .playing').removeClass('playing');
              //                            $('.congrea #listvideo .removeCtr').removeClass('removeCtr');
              // slice(1, -1) is used to remove first and last character
              const id = virtualclass.vutil.createHashString(input.value) + virtualclass.vutil.randomString(32).slice(1, -1);

              virtualclass.videoUl.UI.saveYtsUrl(id);
            }
          });

          const upload = document.querySelector('.congrea #newVideoBtn');
          if (upload) {
            upload.addEventListener('click', () => {
              var uploader = document.querySelector('.congrea #congreavideoContBody');
              uploader.style.display = 'block';
              var uploader = document.querySelector('.congrea #listvideo');
              uploader.style.display = 'none';
            });
          }
        },

        saveYtsUrl(id) {
          const input = document.querySelector('.congrea #videourl');
          const vidObj = {};
          vidObj.uuid = id;
          vidObj.URL = input.value;
          vidObj.title = input.value;

          const url = virtualclass.api.addURL;

          const videoId = virtualclass.videoUl.getVideoId(input.value);

          if (typeof videoId === 'boolean') {
            vidObj.type = 'video_online';
          } else {
            vidObj.type = 'video_yts';
          }
          virtualclass.xhrn.vxhrn.post(url, vidObj).then(() => {
            virtualclass.videoUl.updateOrder();
            virtualclass.videoUl.order.push(vidObj.uuid);

            // TODO, Critical this need be re-enable
            virtualclass.videoUl.sendOrder(virtualclass.videoUl.order);
            virtualclass.serverData.syncAllData().then(() => {
              virtualclass.videoUl.UI.awsVideoList();
            });
            // virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
          });

          document.querySelector('.congrea #videourl').value = '';
        },


        fetchYtsTitle(vidObj, videoid) {
          $.getJSON('https://www.googleapis.com/youtube/v3/videos', {
            key: 'AIzaSyCt1SQWwanpucKGFlzytu-mDdr6vRKzJGA',
            part: 'snippet,statistics',
            id: videoid,
          }, (data) => {
            let title = '';
            if (data.items.length === 0) {
              console.log('video not found');
            } else {
              title = data.items[0].snippet.title;
              virtualclass.videoUl.UI.setYtsTitle(vidObj, title);
            }
          }).fail((jqXHR, textStatus, errorThrown) => {
            console.log('unable to fetch you tube title');
            return 'ERROR';
          });
        },
        validateURL(url) {
          const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
          if (res == null) {
            virtualclass.popup.validateurlPopup('video');
            return false;
          } return true;
        },
        setYtsTitle(vidObj, title) {
          const yts = document.querySelector(`#listvideo #videoTitle${vidObj.fileuuid}`);
          if (yts) {
            yts.innerHTML = title;
          }
        },

        /*
         * removeing the video url container
         */
        removeinputURL() {
          const inputContainer = document.getElementById('youtubeUrlContainer');
          if (inputContainer != null) {
            inputContainer.parentNode.removeChild(inputContainer);
          }
        },
        popup(currVideo) {
          const dropArea = document.querySelector('#congreavideoContBody');
          if (dropArea && dropArea.lastChild != null) {
            dropArea.removeChild(dropArea.lastChild);
          }
          const elemArr = ['congreavideoContBody', 'congreaShareVideoUrlCont'];
          const upload = {};
          const currPlayed = document.querySelector('#listvideo .playing');
          if (currPlayed) {
            // var currPlayed = document.querySelector('#listvideo .playing')
            const id = currPlayed.getAttribute('data-rid');
            this.currPlaying = id;
          }
          //                        upload.validation = ["avi", "flv", "wmv", "mov", "mp4", "webm", "mkv", "vob", "ogv", "ogg", "drc", "mng", "qt", "yuv", "rm", "rmvb", "asf", "amv", "m4p",
          //                        "m4v", "mpg", "mp2", "mpeg", "mpe", "mpv", "m2v", "svi", "3gp", "3g2", "mxf", "roq", "nsv", "f4v", "f4p", "f4a", "f4b"];
          upload.validation = ['mp4', 'avi', 'wmv', 'mov', 'webm', 'mkv', 'vob', 'mpeg'];
          upload.cb = virtualclass.videoUl.afterUploadVideo;
          upload.cthis = 'video';
          upload.multiple = false;
          upload.maxSize = 512 * 1000 * 1000; // 512 MB
          upload.requesteEndPoint = `${window.webapi}&methodname=file_save&live_class_id=${virtualclass.gObj.congCourse}&status=1&content_type_id=2&user=${virtualclass.gObj.uid}`;
          upload.wrapper = document.getElementById(elemArr[0]);
          virtualclass.fineUploader.uploaderFn(upload);
          if (!virtualclass.vutil.isBulkDataFetched() || !virtualclass.videoUl.videos.length) {
            virtualclass.serverData.syncAllData().then(() => {
              virtualclass.videoUl.UI.awsVideoList();
            });
            // virtualclass.serverData.fetchAllData(virtualclass.videoUl.UI.awsVideoList);
          } else {
            virtualclass.videoUl.showVideos(virtualclass.videoUl.videos);
            if (virtualclass.videoUl.order.length > 0) {
              virtualclass.videoUl.reArrangeElements(virtualclass.videoUl.order); // 1
            }
          }
          // virtualclass.videoUl.getVideoList();

          const dropMsz = document.querySelector('#virtualclassCont.congrea #VideoDashboard .qq-uploader.qq-gallery');
          if (dropMsz) {
            dropMsz.setAttribute('qq-drop-area-text', 'Drop videos here');
          }
          const cont = document.querySelector('#uploadMsz');
          var msz = document.querySelector('#videoPopup #congreavideoContBody .qq-upload-list-selector.qq-upload-list');
          if (msz) {
            msz.style.display = 'block';
          }

          let upMsz = document.querySelector('#uploadMsz div');
          if (!upMsz) {
            upMsz = document.createElement('div');
            cont.appendChild(upMsz);
          }
          upMsz.appendChild(msz);
          const lists = document.querySelectorAll('#videoPopup #uploadMsz ul');
          // two ul not to be deleted(one is with li as a child and another recent):when we have started upload,
          // we change current app and after that return to video
          if (lists.length > 2) {
            for (let i = 0; i < lists.length - 1; i++) {
              if (!lists[i].querySelector('li')) {
                lists[i].parentNode.removeChild(lists[i]);
              }
            }
          }

          var msz = document.querySelector('#videoPopup #uploadMsz .qq-upload-list-selector.qq-upload-list');
          const btnUpload = document.querySelector('#uploadVideo');
          btnUpload.addEventListener('click', () => {
            const btn = document.querySelector('#videoPopup .qq-upload-list-selector.qq-upload-button input');
            const msz = document.querySelector('#uploadMsz');
            if (msz) {
              msz.style.display = 'block';
            }
            if (btn) {
              btn.click();
            }
          });
        },
        // nirmala aws
        awsr() {
          const data = 'Demo';
          console.log('Request get document url 2');
          this.postAjax(virtualclass.api.GetDocumentURLs, data);
        },


        awsVideoList() {
          const data = virtualclass.awsData;
          const videos = [];
          for (let i = 0; i < data.length; i++) {
            if ((data[i].filetype == 'video' || data[i].filetype == 'video_yts' || data[i].filetype == 'video_online') && !data[i].hasOwnProperty('deleted')) {
              videos.push(data[i]);
            }
          }
          console.log(videos);
          virtualclass.videoUl.videos = videos;
          virtualclass.serverData.rawData.video = videos;

          // virtualclass.videoUl.allPages = content;
          // var type = "video";
          // var firstId = "congrea" + type + "ContBody";
          // var secondId = "congreaShareVideoUrlCont";
          // var elemArr = [firstId, secondId];
          virtualclass.videoUl.showVideos(videos);
          virtualclass.videoUl.retrieveOrder();
        },
      },
    };
  };
  window.videoUl = videoUl;
}(window));
