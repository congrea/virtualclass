(function (window) {
  const videoUl = function () {
    return {
      videos: [],
      uploaderParam: {},
      videoObj: {},
      videoId: '',
      videoUrl: '',
      isfullscreen: false,
      // order: [],
      currPlaying: '',
      autoPlayFlag: 1,
      status: 0,
      yts: false,
      online: false,
      listEndPause: false,
      attachPlayer: false,
      lastSeek: 0,
      appName: 'Video',

      /*
       * it creates the the necessary layout and containers to place
       * video
       * Call to the function to create player object
       * @param  videoObj
       */
      init() {
        if (!virtualclass.orderList[virtualclass.videoUl.appName]) {
          // console.log('====> ORDER LIST IS CREATING ');
          virtualclass.orderList[virtualclass.videoUl.appName] = new OrderedList();
        }

        this.videoInit = true;
        this.currPlaying = '';
        this.pages = {};
        virtualclass.previrtualclass = 'virtualclassVideo';
        virtualclass.previous = 'virtualclassVideo';
        this.autoPlayFlag = 1;
        this.UI.container();
        if (roles.hasControls()) {
          const dashboardnav = document.querySelector('#dashboardnav button');
          if (dashboardnav) {
            dashboardnav.click();
          }
          if (virtualclass.config.makeWebSocketReady) {
            ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
          }
        } else {
          const videoLayoutMessage = document.getElementById('messageLayoutVideo');
          if (videoLayoutMessage) {
            videoLayoutMessage.style.display = 'block';
          }
        }
      },

      reArrangeElements(order) {
        const container = document.getElementById('listvideo');
        const tmpdiv = document.createElement('div');
        tmpdiv.id = 'listvideo';
        tmpdiv.className = 'videos';
        const videos = this.getActiveVideos();
        let orderChange = false;
        for (let j = 0; j < videos.length; j++) {
          if (order.indexOf(videos[j].fileuuid) <= -1) {
            order.push(videos[j].fileuuid);
            orderChange = true;
          }
        }
        if (orderChange) {
          // virtualclass.videoUl.order = order;
          virtualclass.orderList[virtualclass.videoUl.appName].ol.order = order;
          // console.log('====> order change ', virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
          virtualclass.videoUl.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
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
        for (let i = 0; i < virtualclass.serverData.rawData.video.length; i++) {
          if (!Object.prototype.hasOwnProperty.call(virtualclass.serverData.rawData.video[i], 'deleted')) {
            activeVideos.push(virtualclass.serverData.rawData.video[i]);
          }
        }
        return activeVideos;
      },

      requestOrder() {
        virtualclass.vutil.requestOrder((response) => {
          if (response === 'Error') {
            console.log('page order retrieve failed');
          } else if (typeof response !== 'undefined' && response != null) {
          // virtualclass.orderList[virtualclass.videoUl.appName].ol.order = response;
            if (virtualclass.orderList[virtualclass.videoUl.appName].ol.order.length > 0) {
              virtualclass.videoUl.reArrangeElements(virtualclass.orderList[virtualclass.videoUl.appName].ol.order); // 1
            }
          }
        });
      },

      // updateOrder() {
      //   const activeVideos = this.getActiveVideos();
      //   if (activeVideos.length !== this.order.length) {
      //     const videos = activeVideos.map(video => video.fileuuid);
      //     this.order = videos;
      //   }
      //   this.sendOrder(this.order);
      // },

      afterUploadVideo(id, xhr, res) {
        if (res.success) {
          // this.updateOrder();
          // virtualclass.videoUl.order.push(virtualclass.gObj.file.uuid);
          virtualclass.orderList[virtualclass.videoUl.appName].insert(virtualclass.gObj.file.uuid);
          virtualclass.videoUl.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
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
            // console.log(`File uploading ${fileObj.filename}`);
            this.afterUploadFile(fileObj);
          }
          virtualclass.gObj.uploadingFiles = [];
          virtualclass.serverData.pollingStatus().then(() => {
            virtualclass.videoUl.UI.rawVideoList();
            // virtualclass.orderList[virtualclass.videoUl.appName].insert(virtualclass.gObj.file.uuid);
            virtualclass.videoUl.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
          });
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
        // console.log('====> VIDEO RETRIVE');
        this.requestOrder();
      },


      afterUploadFile(vidObj) {
        const idPostfix = vidObj.fileuuid;
        // var docId = 'docs' + doc;
        this.pages[idPostfix] = new virtualclass.page('videoList', 'video', 'virtualclassVideo', 'videoUl', vidObj.status, vidObj.filetype);
        if (vidObj.filetype === 'video_yts') {
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

        if (Object.prototype.hasOwnProperty.call(vidObj, 'disabled')) {
          this.disable(vidObj.fileuuid);
          if (vid) {
            vid.classList.add('disable');
            vid.dataset.status = 0;
          }
        } else {
          this.enable(vidObj.fileuuid);
          if (vid) {
            vid.classList.add('enable');
            vid.dataset.status = 1;
          }
        }
        controlElem.dataset.status = vid.dataset.status;
        this.calculateHeight();

        if (Object.prototype.hasOwnProperty.call(vidObj, 'noVideo')) {
          vid.classList.add('noVideo');
          document.querySelector('.noVideo .playDisable').title = virtualclass.lang.getString('uploading');
        }
      },


      calculateHeight() {
        const element = document.querySelector('#listvideo');
        $('.qq-uploader-selector').css({
          minHeight: element.offsetHeight,
        });
      },

      showVideos() {
        if (roles.hasControls()) {
          virtualclass.videoUl.showVideoList();
        }

        if (virtualclass.videoUl.videoUrl) {
          virtualclass.videoUl.activeVideoClass(virtualclass.videoUl.videoId);
          virtualclass.vutil.showFinishBtn();
        }
      },

      showVideoList() {
        const elem = document.getElementById('listvideo');
        if (elem) {
          for (let i = 0; i < elem.childNodes.length - 1; i++) {
            elem.childNodes[i].parentNode.removeChild(elem.childNodes[i]);
          }
        }
        if (virtualclass.serverData.rawData.video && virtualclass.serverData.rawData.video.length) {
          virtualclass.serverData.rawData.video.forEach((vidObj, i) => {
            if (!Object.prototype.hasOwnProperty.call(vidObj, 'deleted')) {
              const elem = document.querySelector(`#linkvideo${vidObj.fileuuid}`);
              if (elem != null) {
                const playDisable = document.querySelector('.noVideo .playDisable');
                if (playDisable != null) {
                  playDisable.title = virtualclass.lang.getString('Play');
                }
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
        if (virtualclass.serverData.rawData.video.length === 1 && !video && link != null) {
          link.classList.add('singleVideo');
        } else if (virtualclass.serverData.rawData.video.length > 1 && video) {
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
            // console.log('====> VIDEO CLICK ');
            virtualclass.videoUl.isPaused = false;
            if (vidObj.filetype === 'video_yts') {
              virtualclass.videoUl.yts = true;
              virtualclass.videoUl.online = false;
            } else if (vidObj.filetype === 'video_online') {
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
              virtualclass.dashboard.close();
              virtualclass.userInteractivity.makeReadyContext();
            }
          });
        }
      },

      activeVideoClass(currId) {
        const controlCont = document.getElementsByClassName('controlCont');
        for (let i = 0; i < controlCont.length; i++) {
          if (controlCont[i].classList.contains('removeCtr')) {
            controlCont[i].classList.remove('removeCtr');
          }
        }
        const controlElem = document.getElementById(`controlContvideo${currId}`);
        if (controlElem && !controlElem.classList.contains('removeCtr')) {
          controlElem.classList.add('removeCtr');
        }

        const linkvideos = document.getElementsByClassName('linkvideo');
        for (let i = 0; i < linkvideos.length; i++) {
          if (linkvideos[i].classList.contains('playing')) {
            linkvideos[i].classList.remove('playing');
          }
        }

        const currentVideo = document.getElementById(`linkvideo${currId}`);
        if (currentVideo && !currentVideo.classList.contains('playing')) {
          currentVideo.classList.add('playing');
        }
      },

      destroyPl() {
        if (typeof virtualclass.videoUl.player === 'object') {
          if (virtualclass.currApp === 'ScreenShare') {
            ioAdapter.mustSend({ video: 'destroyPl', cf: 'video' });
          }
          // console.log('==== video player ready dispose');
          // virtualclass.videoUl.player.dispose();

          virtualclass.videoUl.destroyPlayer();
        }

      },

      _rearrange(order) {
        virtualclass.orderList[virtualclass.videoUl.appName].ol.order = order;
        // console.log('====> order change ', virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
        // this.order = order;
        this.reArrangeElements(virtualclass.orderList[virtualclass.videoUl.appName].ol.order); // 2, rearrange
        this.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
        // this.sendOrder(this.order);
      },

      async editTitle(id, title, videotype) {
        const formData = new FormData();
        const data = {
          lc_content_id: id, action: 'edit', title, user: virtualclass.gObj.uid,
        };
        for (const key in data) {
          formData.append(key, data[key]);
          // console.log(data[key]);
        }

        await this.vxhr.post(`${window.webapi}&user=${virtualclass.gObj.uid}&methodname=update_content_video`, formData)
          .then((response) => {
            const elem = document.getElementById(`videoTitle${id}`);
            if (elem) {
              elem.innerHTML = title;
              elem.style.display = 'inline';
              // virtualclass.videoUl.order=[];
              if (virtualclass.serverData.rawData.video && virtualclass.serverData.rawData.video.length) {
                virtualclass.serverData.rawData.video.forEach((video) => {
                  if (video.id === id) {
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

      sendOrder(order) {
        const type = 'vid';
        virtualclass.vutil.sendOrder(type, order);
        ioAdapter.mustSend({ videoUl: { order }, cf: 'videoUl' });
      },


      /*
       * message  handled at student's end
       * and new order to save in dabase
       * @param message from teacher

       */
      onmessage(msg) {
        // console.log('====> receving message ', msg);
        if (typeof msg.videoUl === 'string') {
          if (msg.videoUl === 'play') {
            this.handlePlayEvent(msg, msg.play);
          } else if (msg.videoUl === 'pause') {
            this.handlePauseEvent(msg);
            // virtualclass.videoUl.player.lastSeek = msg.currTime;
            // this.pauseVideo();
            // virtualclass.videoUl.isPaused = true;
          } else if (msg.videoUl === 'destroyPlayer') {
            virtualclass.videoUl.destroyPlayer();
          } else if (msg.videoUl === 'enterFullScreen') {
            virtualclass.videoUl.enterFullScreen();
          } else if (msg.videoUl === 'exitFullScreen') {
            virtualclass.videoUl.exitFullScreen();
          } else if (msg.videoUl === 'videoDelete') {
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
          if (msg.videoUl.type === 'video_yts') {
            virtualclass.videoUl.yts = true;
            virtualclass.videoUl.online = false;
          } else if (msg.videoUl.type === 'video_online') {
            virtualclass.videoUl.online = true;
            virtualclass.videoUl.yts = false;
          } else {
            virtualclass.videoUl.yts = false;
            virtualclass.videoUl.online = false;
          }
        }

        if (Object.prototype.hasOwnProperty.call(msg.videoUl, 'init')) {
          // virtualclass.videoUl.yts=false;
          virtualclass.videoUl.rec = msg.videoUl;
          // console.log(virtualclass.videoUl.rec);
          if (msg.videoUl.init === 'studentlayout') {
            // virtualclass.makeAppReady('Video', undefined, msg.videoUl);
            virtualclass.makeAppReady({ app: 'Video', data:  msg.videoUl });

            // console.log('====> Video play 1');
            const msz = document.getElementById('messageLayoutVideo');
            if (msz) {
              msz.style.display = 'block';
            }
          } else if (Object.prototype.hasOwnProperty.call(msg.videoUl.init, 'videoUrl')) {
            virtualclass.videoUl.videoId = msg.videoUl.init.id;
            virtualclass.videoUl.videoUrl = msg.videoUl.init.videoUrl;
            virtualclass.videoUl.UI.displayVideo(msg.videoUl.init.id, msg.videoUl.init.videoUrl);
            virtualclass.userInteractivity.makeReadyContext();
          }
        } else if (Object.prototype.hasOwnProperty.call(msg.videoUl, 'content_path')) {
          virtualclass.videoUl.videoId = msg.videoUl.id;
          virtualclass.videoUl.videoUrl = msg.videoUl.content_path;
          virtualclass.videoUl.title = msg.videoUl.title;
          virtualclass.videoUl.UI.displayVideo(msg.videoUl.id, virtualclass.videoUl.videoUrl);
          virtualclass.userInteractivity.makeReadyContext();
        } else if (Object.prototype.hasOwnProperty.call(msg.videoUl, 'play')) {
          this.handlePlayEvent(msg, msg.videoUl.play);
        } else if (Object.prototype.hasOwnProperty.call(msg.videoUl, 'order')) {
          // virtualclass.videoUl.order = msg.videoUl.order;
          virtualclass.orderList[virtualclass.videoUl.appName].ol.order = msg.videoUl.order;
          if (roles.hasControls() && !virtualclass.config.makeWebSocketReady
          && virtualclass.orderList[virtualclass.videoUl.appName].ol.order.length > 0) {
            virtualclass.videoUl.showVideos();
            virtualclass.videoUl.reArrangeElements(virtualclass.orderList[virtualclass.videoUl.appName].ol.order); // 1
          }
          // console.log('====> order change ', virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
        }
      },

      calculateVideoTime(time) {
        const lastPlayTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(time);
        const currentTime = (new Date().getTime());
        return (currentTime - lastPlayTime) / 1000;
      },

      handlePlayEvent(msg, playTime) {

        virtualclass.videoUl.lastSeek = playTime;
        if (msg.videoTime && !virtualclass.isPlayMode) {
          virtualclass.videoUl.lastSeek += this.calculateVideoTime(msg.videoTime);
        }
        // console.log('====> video event play event ', virtualclass.videoUl.lastSeek);
        // console.log('====> last seek ', virtualclass.videoUl.lastSeek);
        this.playVideo();
        virtualclass.videoUl.isPaused = false;
        // console.log('====> seek pause false ', virtualclass.videoUl.isPaused);
      },

      handlePauseEvent(msg) {
        console.log('====> video pause event');
        virtualclass.videoUl.lastSeek = msg.currTime;
        // console.log('====> last seek ', virtualclass.videoUl.lastSeek);
        this.pauseVideo();
        virtualclass.videoUl.isPaused = true;
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

      // clearEverThing () {
      //
      //   // virtualclass.videoUl.videoId = '';
      //   // const dispVideo = document.querySelector('.congrea #dispVideo');
      //   // if (dispVideo) {
      //   //   dispVideo.style.display = 'none';
      //   //   const video = document.querySelector('.congrea #dispVideo video');
      //   //   if (video) {
      //   //     video.setAttribute('src', '');
      //   //   }
      //   // }
      //   // const currPlaying = document.querySelector('#listvideo .playing');
      //   // if (currPlaying) {
      //   //   currPlaying.classList.remove('playing');
      //   // }
      //   // const currCtr = document.querySelector('#listvideo .removeCtr');
      //   // if (currCtr) {
      //   //   currCtr.classList.remove('removeCtr');
      //   // }
      // },

      destroyPlayer() {
        virtualclass.videoUl.player.dispose();
        delete virtualclass.videoUl.player;
        this.UI.attachPlayer = false;
        // console.log('====> Video player is finished end <======', virtualclass.videoUl.player);
      },

      playVideo(videoTime) {
        virtualclass.videoUl.lastSeek = videoTime || virtualclass.videoUl.lastSeek;
        // console.log('====> video event play event ', virtualclass.videoUl.lastSeek);
        // console.log('====> seek play', virtualclass.videoUl.player.lastSeek / 60);
        // console.log('====> Video 1 play', virtualclass.videoUl.lastSeek);
        virtualclass.videoUl.player.currentTime(virtualclass.videoUl.lastSeek);
        virtualclass.videoUl.player.play();
      },

      pauseVideo() {
        // console.log('====> video event pause event ', virtualclass.videoUl.lastSeek);
        // console.log('====> Video 2 pause', virtualclass.videoUl.lastSeek);
        virtualclass.videoUl.player.currentTime(virtualclass.videoUl.lastSeek);
        // console.log('====> seek pause ', virtualclass.videoUl.player.lastSeek / 60);
        virtualclass.videoUl.player.pause();
        virtualclass.videoUl.isPaused = true;
      },

      /*
       * to play next video from the  the playlist
       * @param index  of next enabled video in the videolist array
       */

      autoPlayList(index) {
        const videos = this.getActiveVideos();
        const nextIndex = index;
        // var nextId = virtualclass.videoUl.order[index + 1];
        let currVideoObj = this.findNextObj(nextIndex);
        if (currVideoObj && typeof currVideoObj !== 'object') {
          const nxIndex = currVideoObj;
          if (nxIndex < videos.length) {
            currVideoObj = this.autoPlayList(nxIndex);
          }
        } else {
          const toStd = {};
          toStd.id = currVideoObj.fileuuid;
          toStd.title = currVideoObj.filename;
          toStd.type = currVideoObj.filetype;

          if (!virtualclass.videoUl.listEnd && currVideoObj) {
            if (currVideoObj.filetype === 'video_online') {
              virtualclass.videoUl.yts = false;
              virtualclass.videoUl.online = true;
              //  virtualclass.videoUl.UI.displayVideo(currVideoObj.id, currVideoObj.URL);
              virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
              virtualclass.videoUl.videoToStudent(currVideoObj);
              this.activeVideoClass(currVideoObj.id);
              toStd.content_path = currVideoObj.URL;
            } else {
              virtualclass.videoUl.online = false;
              if (currVideoObj.filetype === 'video_yts') {
                virtualclass.videoUl.yts = true;
                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.URL);
                toStd.content_path = currVideoObj.URL;
              } else {
                virtualclass.videoUl.yts = false;
                virtualclass.videoUl.UI.displayVideo(currVideoObj.fileuuid, currVideoObj.urls.main_video);
                toStd.content_path = currVideoObj.urls.main_video;
              }
              virtualclass.videoUl.videoToStudent(toStd);
            }

            if (virtualclass.videoUl.player) {
              virtualclass.videoUl.player.ready(function () {
                const myPlayer = this;
                console.log('====> video play ');
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
        const nextId = this.findNextVideo(index);
        let currVideoObj = false;
        const videos = this.getActiveVideos();
        for (let i = 0; i < videos.length; i++) {
          // for (var j in virtualclass.serverData.rawData.video[i]) {
          if (videos[i].fileuuid === nextId) {
            const vid = document.getElementById(`linkvideo${videos[i].fileuuid}`);
            if (vid.getAttribute('data-status') === '1') {
              currVideoObj = videos[i];
              break;
            }
            currVideoObj = index + 1;
            break;
          }
        }
        return currVideoObj;
      },

      findNextVideo(index) {
        const list = document.querySelectorAll('#listvideo .linkvideo');
        if (index < list.length) {
          return list[index].getAttribute('data-rid');
        }
        return false;
      },

      /*
       * to disable  video in the videolist
       */

      disable(_id) {
        const linkvideo = document.querySelector(`#linkvideo${_id}`);
        linkvideo.classList.add('playDisable');
        const video = document.getElementById(`mainpvideo${_id}`);
        video.style.opacity = 0.3;
        video.style.pointerEvents = 'none';

        if (virtualclass.serverData.rawData.video && virtualclass.serverData.rawData.video.length) {
          virtualclass.serverData.rawData.video.forEach((elem, i) => {
            if (elem.fileuuid === _id) {
              elem.disabled = 0;
              elem.status = 0;
            }
          });
        }
      },

      /*
       * to enable  video in the videolist
       */
      enable(_id) {
        const linkvideo = document.querySelector(`#linkvideo${_id}`);
        linkvideo.classList.remove('playDisable');


        const video = document.getElementById(`mainpvideo${_id}`);
        if (video) {
          video.style.opacity = 1;
          video.style.pointerEvents = 'auto';
          if (virtualclass.serverData.rawData.video && virtualclass.serverData.rawData.video.length) {
            virtualclass.serverData.rawData.video.forEach((elem, i) => {
              if (elem.fileuuid === _id) {
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
      delete(id) {
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
        if (msg !== 'ERROR') {
          const type = 'saved';
          const elem = document.getElementById(`linkvideo${id}`);
          if (elem) {
            elem.parentNode.removeChild(elem);
            // if current playing video is deleted
            if (virtualclass.videoUl.videoId === id) {
              const playerCont = document.querySelector('#videoPlayerCont');
              if (playerCont) {
                playerCont.style.display = 'none';
                ioAdapter.mustSend({ videoUl: 'videoDelete', cf: 'videoUl' });
                virtualclass.videoUl.videoId = null;
                virtualclass.videoUl.videoUrl = null;
                const video = document.querySelector('.congrea #dispVideo video');
                const ytube = document.querySelector('.congrea #dispVideo iframe');
                const cont = video || ytube;
                if (cont) {
                  cont.setAttribute('src', '');
                }
                virtualclass.vutil.removeFinishBtn();
              }
            }

            if (virtualclass.serverData.rawData.video && virtualclass.serverData.rawData.video.length) {
              virtualclass.serverData.rawData.video.forEach((video) => {
                if (video.fileuuid === id) {
                  const index = virtualclass.serverData.rawData.video.indexOf(video);
                  if (index >= 0) {
                    virtualclass.serverData.rawData.video.splice(index, 1);
                    // console.log(virtualclass.serverData.rawData.video);
                  }
                }
              });
            }

            // const idIndex = virtualclass.videoUl.order.indexOf(id);
            // const idIndex = virtualclass.videoUl.order.indexOf(id);
            const idIndex = virtualclass.orderList.Video.ol.order.indexOf(id);

            if (idIndex >= 0) {
              // virtualclass.videoUl.order.splice(idIndex, 1);
              virtualclass.orderList.Video.ol.order.splice(idIndex, 1);
              // console.log(virtualclass.videoUl.order);
              // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
              virtualclass.videoUl.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
            }
            if (!virtualclass.serverData.rawData.video.length) {
              virtualclass.vutil.removeFinishBtn();
            } else if (virtualclass.serverData.rawData.video.length === 1) {
              const video = document.querySelector('.congrea #listvideo .linkvideo');
              if (video) {
                video.classList.add('singleVideo');
              }
            }
          }
        }
      },

      // xhrOrderSend(order) {
      //   const data = { order: order.toString() };
      //   const url = virtualclass.api.UpdateRoomMetaData;
      //   virtualclass.xhrn.vxhrn.post(url, data).then(() => {
      //     if (virtualclass.config.makeWebSocketReady) {
      //       virtualclass.serverData.syncAllData().then(() => {
      //         virtualclass.videoUl.UI.rawVideoList();
      //       });
      //     }
      //   });
      // },

      videoToStudent(videoObj) {
        ioAdapter.mustSend({ videoUl: videoObj, cf: 'videoUl', videoTime: virtualclass.vutil.localToUTC() });
      },

      getVideoId(url) {
        const rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
        const m = url.match(rx);
        if (m != null && m.length > 1) {
          const r = m[1].substring(0, 11);
          if (r.length === 11) {
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

        displayVideo(vidId, videoUrl) {
          if (typeof virtualclass.videoUl.player === 'object') {
            if (Object.prototype.hasOwnProperty.call(virtualclass.videoUl.player, 'dispose')) {
              // virtualclass.videoUl.player.dispose();
              virtualclass.videoUl.destroyPlayer();
            }
          }
          virtualclass.videoUl.videoUrl = videoUrl;
          virtualclass.videoUl.videoId = vidId;
          // var videourl = "https://dev.muzioapp.com.s3-website-us-east-1.amazonaws.com/content/ourMuzeVid1.webm";
          let videoPlayerCont = document.getElementById('videoPlayerCont');
          if (videoPlayerCont) {
            videoPlayerCont.style.display = 'block';
          } else {
            virtualclass.videoUl.UI.container();
            videoPlayerCont = document.getElementById('videoPlayerCont');
          }
          const ply = document.querySelector('iframe#player');
          if (ply) {
            ply.remove();
          }

          virtualclass.videoUl.UI.switchDisplay(videoPlayerCont, videoUrl);
          virtualclass.videoUl.UI.videojsPlayer(videoUrl, vidId);
          // virtualclass.modal.hideModal();
          virtualclass.dashboard.close();
          virtualclass.userInteractivity.makeReadyContext();
        },

        videojsPlayer(videoUrl, vidId) {
          if (!virtualclass.videoUl.player) {
            virtualclass.videoUl.player = videojs('dispVideo', {
              controlBar: {
                pictureInPictureToggle: false,
              },
            }); // TODO, generating error need to handle
            // console.log('====> Video player is ready <====== 0');
            if (roles.hasControls()) {
              if (!($('.vjs-autoPlay-button').length)) {
                virtualclass.videoUl.UI.appendAutoPlayButton(virtualclass.videoUl.player);
              }
              const autoPlayBtn = document.getElementById('autoPlayListBtn');
              if (autoPlayBtn) {
                // autoPlayBtn.innerHTML = virtualclass.videoUl.innerHtml;
                autoPlayBtn.className = virtualclass.videoUl.autoPlayClass;
              }
            }

            // console.log('==== video player ready 1', virtualclass.videoUl.player);
            virtualclass.videoUl.UI.attachPlayerHandler(virtualclass.videoUl.player, vidId, videoUrl);
          }
          virtualclass.videoUl.lastSeek = 0;
          virtualclass.videoUl.UI.onEndedHandler(virtualclass.videoUl.player, vidId, videoUrl);

          if (virtualclass.videoUl.setPlayerUrlTime) {
            clearTimeout(virtualclass.videoUl.setPlayerUrlTime);
          }
          virtualclass.videoUl.setPlayerUrlTime = setTimeout(() => {
            if (typeof virtualclass.videoUl.player === 'object') {
              virtualclass.videoUl.UI.setPlayerUrl(virtualclass.videoUl.player, videoUrl);
            }
          }, 100);
        },

        attachPlayerHandler(player) {
          if (!this.attachPlayer) {
            this.attachPlayer = true;
            // console.log('====> video attaching the player');
            // console.log('Attach video player');
            player.on('pause', (e) => {
              // console.log('paused');
              if (roles.hasControls()) {
                ioAdapter.mustSend({ videoUl: 'pause', cf: 'videoUl', currTime : player.currentTime()});
              }
              virtualclass.videoUl.isPaused = true;
            });

            // console.log('====> seek play init ');
            player.on('play', (e) => {
              // console.log('====> video play on');
              if (roles.hasControls()) {
                ioAdapter.mustSend({ videoUl: { play: player.currentTime() }, cf: 'videoUl', videoTime: virtualclass.vutil.localToUTC() });
              }
              virtualclass.videoUl.isPaused = false;
              // console.log('====> seek pause false ', virtualclass.videoUl.isPaused);
            });

            player.on('fullscreenchange', (e) => {
              setTimeout(() => {
                virtualclass.vutil.showFullScreenButtonIfNeed();
              }, 0);
            });
          }
        },


        switchDisplay(videoCont, videoUrl) {
          const dispVideo = document.getElementById('dispVideo');
          if (dispVideo) {
            dispVideo.style.display = 'block';
          } else {
            virtualclass.videoUl.UI.createVideoElem(videoCont);
          }

          const msz = document.getElementById('messageLayoutVideo');
          if (typeof videoUrl === 'undefined') {
            videoCont.style.display = 'none';
            if (msz) {
              msz.style.display = 'block';
            }
          } else {
            videoCont.style.display = 'block';
            if (msz) {
              msz.style.display = 'none';
            }
          }
        },

        createVideoElem(videoCont) {
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

        setPlayerUrl(player, videoUrl) {
          // console.log('====> Video 0 start');
          // console.log('====> loadstart set url  ', videoUrl);
          if (player.poster_) {
            player.poster_ = '';
          }

          const dispVideo = document.querySelector('#dispVideo');
          if (virtualclass.videoUl.yts) {
            dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],"preload": "auto"}');
            player.src({ type: 'video/youtube', src: videoUrl });
            // console.log('====> Video 1 b Finished youtube');
            const playerElem = document.querySelector('#videoPlayerCont .vjs-error-display');
            if (playerElem) {
              playerElem.classList.add('vjs-hidden');
            }
          } else if (virtualclass.videoUl.online) {
            dispVideo.setAttribute('data-setup', '{"preload": "auto" }');
            player.src({ type: 'video/webm', src: videoUrl });
            player.src({ type: 'video/mp4', src: videoUrl });
            // console.log('====> Video 1 b Finished uploaded');
          } else {
            dispVideo.setAttribute('data-setup', '{"preload": "auto"}');
            player.src({ type: 'application/x-mpegURL', withCredentials: true, src: videoUrl });
            // console.log('====> Video 1 b normal');
          }

          player.any('loadstart', () => {
            // console.log('====> loadstart 2 ', virtualclass.videoUl.lastSeek);
            virtualclass.videoUl.alreadySetPlayerUrl = true;
            if (virtualclass.videoUl.isPaused) {
              if (virtualclass.videoUl.lastSeek) {
                virtualclass.videoUl.player.currentTime(virtualclass.videoUl.lastSeek);
              }
              // console.log('====> video event pause event ', virtualclass.videoUl.lastSeek);

              /* TODO, pause state isn't working with uploaded video on page refresh, however it's fine with youtube videos */
              player.pause();
              // console.log('====> Video 2 finished pause');
            } else if (virtualclass.system.device === 'desktop') { // TODO, WHY only on desktop
              if (virtualclass.videoUl.lastSeek) {
                virtualclass.videoUl.player.currentTime(virtualclass.videoUl.lastSeek);
              }
              player.play();
              // console.log('====> video event play event ', virtualclass.videoUl.lastSeek);
              // console.log('====> Video 2 finished play');
            }

          });

          player.on('error', () => {
            const error = player.error();
            if (error.code === 1150) { // Handling private video error
              const playerElem = document.querySelector('#videoPlayerCont .vjs-error-display');
              if (playerElem) {
                playerElem.classList.remove('vjs-hidden');
              }
            }
          })
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
          player.on('ended', () => {
            // console.log('====> on ended video ');
            // virtualclass.videoUl.UI.onEnded(player, vidId, videoUrl);
            if (roles.hasControls()) {
              virtualclass.videoUl.UI.onEnded(player, vidId);
            }
          });
        },

        // onEnded(player, vidId, videoUrl) {
        onEnded(player, vidId, videoUrl) {
          // player.reset();
          // const dispVideo = document.querySelector('#dispVideo');
          // if (virtualclass.videoUl.yts) {
          //   dispVideo.setAttribute('data-setup', '{ techOrder: [youtube],controls: true,}');
          //   player.src({ type: 'video/youtube', src: videoUrl });
          // } else if (virtualclass.videoUl.online) {
          //   dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
          //   player.src({ type: 'video/webm', src: videoUrl });
          //   player.src({ type: 'video/mp4', src: videoUrl });
          // } else {
          //   dispVideo.setAttribute('data-setup', '{"preload": "auto", "controls": true, }');
          //   player.src({ type: 'application/x-mpegURL', withCredentials: true, src: videoUrl });
          // }

          const list = document.querySelectorAll('#listvideo .linkvideo');
          let index = 0;
          for (let i = 0; i < list.length; i++) {
            if (list[i].getAttribute('data-rid') === vidId) {
              index = i;
              break;
            }
          }


          if (virtualclass.videoUl.autoPlayFlag) {
            if (player.poster_) {
              player.poster_ = '';
            }
            if (virtualclass.videoUl.findNextVideo(index + 1)) {
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
              // console.log('==== Video is paused');
              virtualclass.videoUl.player.pause();
              // console.log('====> video event pause event ', virtualclass.videoUl.lastSeek);
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
              const uploaderVideoCont = document.querySelector('.congrea #congreavideoContBody');
              uploaderVideoCont.style.display = 'block';
              const uploaderListvideo = document.querySelector('.congrea #listvideo');
              uploaderListvideo.style.display = 'none';
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
            // virtualclass.videoUl.updateOrder();
            // virtualclass.videoUl.order.push(vidObj.uuid);
            virtualclass.orderList[virtualclass.videoUl.appName].insert(vidObj.uuid);
            if (virtualclass.config.makeWebSocketReady) {
              virtualclass.serverData.syncComplete = false;
              virtualclass.serverData.syncAllData().then(() => {
                virtualclass.videoUl.UI.rawVideoList();
                virtualclass.videoUl.sendOrder(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
              });
            }
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
              // console.log('video not found');
            } else {
              title = data.items[0].snippet.title;
              virtualclass.videoUl.UI.setYtsTitle(vidObj, title);
            }
          }).fail((jqXHR, textStatus, errorThrown) => {
            // console.log('unable to fetch you tube title');
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
        popup() {
          const dropArea = document.querySelector('#congreavideoContBody');
          if (dropArea && dropArea.lastChild != null) {
            dropArea.removeChild(dropArea.lastChild);
          }
          const elemArr = ['congreavideoContBody', 'congreaShareVideoUrlCont'];
          const upload = {};
          const currPlayed = document.querySelector('#listvideo .playing');
          if (currPlayed) {
            this.currPlaying = currPlayed.getAttribute('data-rid');
          }

          upload.validation = ['mp4', 'avi', 'wmv', 'mov', 'webm', 'mkv', 'vob', 'mpeg'];
          upload.cb = virtualclass.videoUl.afterUploadVideo;
          upload.cthis = 'video';
          upload.multiple = false;
          upload.maxSize = 512 * 1000 * 1000; // 512 MB

          upload.requesteEndPoint = `${window.webapi}&methodname=file_save&live_class_id=${virtualclass.gObj.congCourse}&status=1&content_type_id=2&user=${virtualclass.gObj.uid}`;
          upload.wrapper = document.getElementById(elemArr[0]);
          virtualclass.fineUploader.uploaderFn(upload);

          if (!virtualclass.serverData.syncComplete) {
            virtualclass.serverData.syncAllData().then(() => {
              virtualclass.videoUl.UI.rawVideoList();
            });
          } else if (!virtualclass.serverData.rawData.video.length) {
            this.rawVideoList();
          } else {
            virtualclass.videoUl.showVideos();
            virtualclass.videoUl.reArrangeElements(virtualclass.orderList[virtualclass.videoUl.appName].ol.order);
          }

          const dropMsz = document.querySelector('#virtualclassCont.congrea #VideoDashboard .qq-uploader.qq-gallery');
          dropMsz.setAttribute('qq-drop-area-text', 'Drop videos here');

          const uploadMesssage = document.querySelector('#uploadMsz');
          /** Creating list (li) for displaying the upload video **/
          const videoContBody = '#congreavideoContBody .qq-upload-list-selector.qq-upload-list';
          const uploadMessageList = document.querySelector(videoContBody);
          uploadMessageList.style.display = 'block';

          let upMsz = document.querySelector('#uploadMsz div');
          if (!upMsz) {
            upMsz = document.createElement('div');
            uploadMesssage.appendChild(upMsz);
          }
          upMsz.appendChild(uploadMessageList);
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

          const btnUpload = document.querySelector('#uploadVideo');
          btnUpload.addEventListener('click', () => {
            uploadMesssage.style.display = 'block';
            const btn = document.querySelector('#videoPopup .qq-upload-list-selector.qq-upload-button input');
            if (btn) {
              btn.click();
            }
          });
        },

        rawVideoList() {
          // virtualclass.videoUl.videos = virtualclass.serverData.rawData.video;
          virtualclass.videoUl.showVideos();
          // virtualclass.videoUl.retrieveOrder();
          virtualclass.videoUl.requestOrder();
        },
      },
    };
  };
  window.videoUl = videoUl;
}(window));
