/**
 * This file provides functionalies of capturing, transmiting and playing audio/video.
 * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 */

function MediaWrapper(window) {
  // const audioToBePlay = {};
  // const aChunksPlay = {};
  // const allAudioArr = {};

  // let repMode = false;
  // let buf;
  // let vidId;
  // let randomTime;
  // let luid;
  // let allAudioSend = [];
  // let audioLen = 0;
  // let workletAudioSend;
  // let workletAudioRec;
  // let workerAudioRecOnmessage = false;
  // let l;
  // let snNodePak;
  let cthis;
  // let audioInputForAudioWorklet = false;
  // let filterAudioWorklet;
  virtualclass.adpt = new virtualclass.adapter();
  const cNavigator = virtualclass.adpt.init(navigator);

  // function breakintobytes(val, l) {
  //   let numstring = val.toString();
  //   for (let i = numstring.length; i < l; i++) {
  //     numstring = `0${numstring}`;
  //   }
  //   const parts = numstring.match(/[\S]{1,2}/g) || [];
  //   return parts;
  // }

  /**
   * To convert float to integer
   * @param  buffer: audio samples a Float32 bit  array
   * @returns buf : Int16Array buffer
   */
  // function convertFloat32ToInt16(buffer) {
  //   l = buffer.length;
  //   buf = new Int16Array(l);
  //   while (l--) {
  //     buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
  //   }
  //   return buf;
  // }

  /**
   * this returns an object that contains various Properties
   * to facilitate the capturing , saving, transmitting and
   *  rendering audio or video.
   *
   */
  function Media() {
    return {
      isStarted: '',
      pc: [],
      cn: 0,
      ba: false,
      bb: false,
      bc: false,
      bNotRender: false,
      remoteStream: '',
      turnReady: '',
      videoControlId: 'videoContainer',
      videoContainerId: 'videos',
      CONFIG: {
        width: { max: 268 },
        height: { max: 142 },
        frameRate: { max: 6 },
      },

      audioPlayerNode: null,
      audioCreatorNode: null,
      status: 0, // 0 = No webCam, 1 = Webcam Success, 2 = Webcam error

      init() {
        cthis = this;
        this.audio = new MediaAudio();
        this.video = new MediaVideo();
      },

      /**
       * Replaces image with  video
       * @param id Id of the user
       * @param vidCont Video wrapper to replace the image
       */
      util: {
        imageReplaceWithVideo(id, vidCont) {
          const chatUser = chatContainerEvent.elementFromShadowDom(`#ml${id}`);
          if (chatContainerEvent.elementFromShadowDom(`#ml${id}`)) {
            chatUser.classList.remove('userImg');
          }

          if (chatUser != null) {
            const childTag = chatUser.getElementsByTagName('a')[0];
            const imgTag = childTag.getElementsByTagName('span')[0] || childTag.getElementsByTagName('img')[0];
            if (!childTag.classList.contains('hasVideo')) {
              childTag.className += ' hasVideo';
            }
            const videoWrapper = childTag.querySelector('.videoWrapper');
            if (imgTag == null && imgTag == null && videoWrapper != null) {
              childTag.removeChild(videoWrapper);
              childTag.appendChild(vidCont);
            } else {
              childTag.replaceChild(vidCont, imgTag);
            }
          } else {
            // console.log('chatUser is Null');
          }
        },
      },

      audioVisual: {
        init() {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          this.analyser = this.audioCtx.createAnalyser();
          this.analyser.minDecibels = -90;
          this.analyser.maxDecibels = -10;
          this.analyser.smoothingTimeConstant = 0.85;

          this.distortion = this.audioCtx.createWaveShaper();
          this.gainNode = this.audioCtx.createGain();
          this.biquadFilter = this.audioCtx.createBiquadFilter();
          this.convolver = this.audioCtx.createConvolver();
        },

        readyForVisual(stream) {
          this.source = this.audioCtx.createMediaStreamSource(stream);
          this.source.connect(this.analyser);
          this.analyser.connect(this.distortion);
          this.distortion.connect(this.biquadFilter);
          this.biquadFilter.connect(this.convolver);
          this.convolver.connect(this.gainNode);
          this.gainNode.connect(this.audioCtx.destination);
        },
      },

      sessionConstraints() {
        let webcam = !!virtualclass.system.mediaDevices.hasWebcam;

        /**
         * Reduce the resolution and video frame rate to optimization CPU resource
         *
         * */

        if (virtualclass.gObj.meetingMode && webcam) {
          if (virtualclass.system.device === 'mobTab' && virtualclass.system.mybrowser.name === 'iOS'
            || virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'Safari') {
            webcam = true;
          } else {
            webcam = {
              width: { max: 268 },
              height: { max: 142 },
              frameRate: { max: 6 },
            };
            // webcam = true;
          }
        }
        let audioConstraint;
        if (virtualclass.system.mediaDevices.hasMicrophone) {
          audioConstraint = {
            echoCancellation: true,
            autoGainControl: true,
            channelCount: 1,
            noiseSuppression: true,
          };
        } else {
          audioConstraint = false;
        }


        const session = {
          // audio: virtualclass.gObj.multiVideo ? true :  audioOpts,
          video: webcam,
          audio: audioConstraint,
        };

        return { webcam, session };
      },

      // init() {
      //   // console.log('Video second, normal video');
      //   cthis = this; // TODO there should be done work for cthis

      //   if (virtualclass.gesture.classJoin) { // todo, this shouldn't be here
      //     virtualclass.gesture.attachHandler();
      //     delete virtualclass.gesture.classJoin;
      //   }
      //   // this.startMedia();
      // },

      stopMedia() {
        this.audio.closeContext();
        if (virtualclass.media.stream != null) {
          const tracks = virtualclass.media.stream.getTracks(); // if only one media track
          tracks.forEach((track) => { track.stop(); });
        }

        if (this.audio.workletAudioSend) {
          this.audio.workletAudioSend.disconnect();
          console.log('====> disconnect audio from stopMedia');
        }

        virtualclass.vutil.videoHandler('off');
        delete virtualclass.media.tempStream;
        this.audio.audioContextReady = false;
      },

      async startMedia() {
        this.status = 0;
        if (!virtualclass.vutil.isPlayMode()) {
          if (this.video.enable || this.audio.enable) this.stopMedia();
          this.audio.initAudiocontext();
          const { session } = this.sessionConstraints();
          if (this.audio.enable && !this.video.enable) {
            session.video = false;
          } else if (this.video.enable && !this.audio.enable) {
            session.audio = false;
          }

          let stream = null;
          try {
            stream = await cNavigator.mediaDevices.getUserMedia(session);
            if (this.video.enable && this.audio.enable) {
              this.handleUserMediaAudio(stream);
              this.handleUserMediaVideo(stream);
            } else if (this.video.enable && !this.audio.enable) {
              this.handleUserMediaVideo(stream);
            } else if (this.audio.enable && !this.video.enable) {
              this.handleUserMediaAudio(stream);
            }

            this.status = 1;
            // this.handleUserMedia(stream);
            // this.handleUserMediaUISuccess();
          } catch (e) {
            this.status = 2;
            this.handleUserMediaError(e);
            this.audio.notifiyMuteAudio();
            console.log(e);
          }
        }

        // this.handleUserMediaUI();

        if (!this.status) {
          virtualclass.user.control.videoDisable();
          virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
        }
      },

      handleUserMediaAudio(stream) {
        // stream audio
        this.stream = stream;
        this.audio.init(stream);

        if (this.audio.audioContextReady) {
          this.audio.actualManiPulateStream();
        }
        this.handleUserMediaAudioUI();
      },

      handleUserMediaAudioUI() {
        if (virtualclass.system.mediaDevices.hasMicrophone) {
          if (roles.isStudent()) virtualclass.settings.userAudioIcon();
          else if (typeof this.stream !== 'undefined') virtualclass.user.control.audioWidgetEnable(true);
        } else {
          virtualclass.user.control.audioDisable();
        }
      },

      handleUserMediaVideoUI() {
        const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
        if (userDiv != null) {
          const vidTag = userDiv.getElementsByTagName('video');
          if (vidTag != null) cthis.innerHandleUserMedia(); // TODO, the function name should be chagned// really using ?????
        }

        virtualclass.settings.userVideoIcon();
        virtualclass.vutil.videoHandler('on');
      },

      handleUserMediaVideo(stream) {
        this.stream = stream;
        const mediaStreamTrack = stream.getVideoTracks()[0];
        if (typeof mediaStreamTrack !== 'undefined') mediaStreamTrack.onended = this.triggerVideoEnd;
        // STREAM // Teacher video
        if (roles.hasAdmin()) virtualclass.videoHost.isDomReady(() => virtualclass.videoHost.renderSelfVideo(stream));
        this.handleUserMediaVideoUI();
      },


      // handleUserMediaUI() {
      //   if (!this.status) {
      //     virtualclass.user.control.videoDisable();
      //     virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
      //   } else if (this.status === 1) {
      //     this.handleUserMediaUISuccess();
      //   } else {
      //     this.handleUserMediaError(this.mediaEvent);
      //     this.audio.notifiyMuteAudio();
      //   }
      // },

      handleUserMediaUISuccess() {
        const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
        if (virtualclass.system.mediaDevices.hasMicrophone) {
          if (roles.isStudent()) virtualclass.settings.userAudioIcon();
          else if (typeof stream !== 'undefined') virtualclass.user.control.audioWidgetEnable(true);
        } else {
          virtualclass.user.control.audioDisable();
        }

        if (userDiv != null) {
          const vidTag = userDiv.getElementsByTagName('video');
          if (vidTag != null) cthis.innerHandleUserMedia(); // TODO, the function name should be chagned// really using ?????
        }

        virtualclass.settings.userVideoIcon();
        virtualclass.vutil.videoHandler('on');


        // if (roles.isStudent() && virtualclass.system.mediaDevices.hasMicrophone) {
        //   virtualclass.settings.userAudioIcon();
        // } else if (virtualclass.system.mediaDevices.hasMicrophone) {
        //   if (typeof stream !== 'undefined') {
        //     virtualclass.user.control.audioWidgetEnable(true);
        //   }
        // } else {
        //   virtualclass.user.control.audioDisable();
        // }

        // const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
        // if (userDiv != null) {
        //   const vidTag = userDiv.getElementsByTagName('video');
        //   if (vidTag != null) cthis.innerHandleUserMedia(); // TODO, the function name should be chagned
        // }

        // UI
        // virtualclass.settings.userVideoIcon();

        /**
         * Disable teacher video by default, when he/she will join first time
         */

        // UI
        // if (localStorage.getItem('prevApp') == null) {
        //   if (roles.hasControls()) {
        //     // true is passed, because, we don't want to pass video control on precheck
        //     // virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off') ? 'on' : 'off', true);
        //   } else if (virtualclass.gObj.meetingMode) {
        //     virtualclass.vutil.videoHandler('off');
        //   }
        // }
      },

      /**
       * It creates a mediator for getUSerMedia
       * and it prompts the user for permission to use video or audio device
       * it  inalizes the video
       */
      // async initNew() {
      //   // console.log('Video second, normal video');
      //   cthis = this; // TODO there should be done work for cthis: that shoudl be in top

      //   if (virtualclass.gesture.classJoin) {
      //     virtualclass.gesture.attachHandler();
      //     delete virtualclass.gesture.classJoin;
      //   }

      //   const [webcam, session] = this.sessionConstraints();
      //   // this.video.init();

      //   virtualclass.user.control.audioDisable();
      //   virtualclass.user.control.videoDisable();

      //   if (!virtualclass.vutil.isPlayMode() && virtualclass.media.video.tempStream != null) {
      //     const tracks = virtualclass.media.video.tempStream.getTracks(); // if only one media track
      //     for (let i = 0; i < tracks.length; i++) {
      //       tracks[i].stop();
      //     }
      //     let stream = null;
      //     try {
      //       stream = await cthis.cNavigator.mediaDevices.getUserMedia(session);
      //     } catch (e) {
      //       this.handleUserMediaError(e);
      //       this.audio.notifiyMuteAudio();
      //     }
      //     if (stream !== null) this.handleUserMedia(stream);
      //   }

      //   if (webcam === false) {
      //     virtualclass.user.control.videoDisable();
      //     virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
      //   }
      // },


      /**
       * This function  is invoked with the resulting media stream object if the call to getUserMedia succeeds.
       * And invoke handleUSerMediaError in case of getusermedia error.
       * handleUSerMedia  initializes audio.
       * @param stream object
       */

      // handleUserMediaOld(stream) {
      //   if (roles.isStudent() && virtualclass.system.mediaDevices.hasMicrophone) {
      //     virtualclass.settings.userAudioIcon();
      //   } else if (virtualclass.system.mediaDevices.hasMicrophone) {
      //     if (typeof stream !== 'undefined') {
      //       virtualclass.user.control.audioWidgetEnable(true);
      //     }
      //   } else {
      //     virtualclass.user.control.audioDisable();
      //   }

      //   const mediaStreamTrack = stream.getVideoTracks()[0];
      //   if (typeof mediaStreamTrack !== 'undefined') {
      //     mediaStreamTrack.onended = () => { // for Chrome.
      //       if (roles.hasControls()) {
      //         virtualclass.videoHost.clearTeacherVideoTime();
      //         virtualclass.system.mediaDevices.webcamErr.push('webcambusy');
      //         const videoHostContainer = document.getElementById('videoHostContainer');
      //         if (videoHostContainer !== null) {
      //           videoHostContainer.classList.add('displayInterrupt');
      //         }
      //         ioAdapter.mustSend({ cf: 'videoStop' });
      //       }
      //     };
      //   } else {
      //     virtualclass.system.mediaDevices.webcamErr.push('nopermission');
      //   }

      //   // stream audio
      //   cthis.video.tempStream = stream;
      //   cthis.audio.init();
      //   cthis.audio.attachAudioStopHandler(stream);

      //   const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
      //   if (userDiv != null) {
      //     const vidTag = userDiv.getElementsByTagName('video');
      //     if (vidTag != null) {
      //       cthis.innerHandleUserMedia(virtualclass.gObj.uid);
      //     }
      //   }

      //   // STREAM
      //   if (roles.hasAdmin()) {
      //     virtualclass.videoHost.isDomReady(() => {
      //       virtualclass.videoHost.renderenderSelfVideo(stream); // Teacher video
      //     });
      //   }

      //   // UI
      //   virtualclass.settings.userVideoIcon();

      //   /**
      //    * Disable teacher video by default, when he/she will join first time
      //    */

      //   // UI
      //   if (localStorage.getItem('prevApp') == null) {
      //     if (roles.hasControls()) {
      //       // true is passed, because, we don't want to pass video control on precheck
      //       virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off') ? 'on' : 'off', true);
      //     } else if (virtualclass.gObj.meetingMode) {
      //       virtualclass.vutil.videoHandler('off');
      //     }
      //   }

      //   // STREAM
      //   if (cthis.audio.audioContextReady
      //     && !Object.prototype.hasOwnProperty.call(cthis.audio, 'triggermaniPulateStream')) {
      //     cthis.stream = cthis.video.tempStream;
      //     cthis.audio.actualManiPulateStream();
      //   }
      // },

      // for Chrome.
      triggerVideoEnd() {
        if (roles.hasControls()) {
          virtualclass.videoHost.clearTeacherVideoTime();
          virtualclass.system.mediaDevices.webcamErr.push('webcambusy');
          const videoHostContainer = document.getElementById('videoHostContainer');
          if (videoHostContainer !== null) {
            videoHostContainer.classList.add('displayInterrupt');
          }
          ioAdapter.mustSend({ cf: 'videoStop' });
        }
      },

      handleUserMedia(stream) {
        const mediaStreamTrack = stream.getVideoTracks()[0];
        if (typeof mediaStreamTrack !== 'undefined') mediaStreamTrack.onended = this.triggerVideoEnd;

        // stream audio
        cthis.stream = stream;
        cthis.audio.init(stream);

        // if (cthis.audio.audioContextReady
        //   && !Object.prototype.hasOwnProperty.call(cthis.audio, 'triggermaniPulateStream')) {
        if (cthis.audio.audioContextReady) {
          cthis.stream = cthis.stream;
          cthis.audio.actualManiPulateStream();
        }

        // STREAM // Teacher video
        if (roles.hasAdmin()) virtualclass.videoHost.isDomReady(() => virtualclass.videoHost.renderSelfVideo(stream));

        // if (roles.isStudent() && virtualclass.system.mediaDevices.hasMicrophone) {
        //   virtualclass.settings.userAudioIcon();
        // } else if (virtualclass.system.mediaDevices.hasMicrophone) {
        //   if (typeof stream !== 'undefined') {
        //     virtualclass.user.control.audioWidgetEnable(true);
        //   }
        // } else {
        //   virtualclass.user.control.audioDisable();
        // }

        // const userDiv = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid}`);
        // if (userDiv != null) {
        //   const vidTag = userDiv.getElementsByTagName('video');
        //   if (vidTag != null) cthis.innerHandleUserMedia(); // TODO, the function name should be chagned
        // }

        // // UI
        // virtualclass.settings.userVideoIcon();

        // /**
        //  * Disable teacher video by default, when he/she will join first time
        //  */

        // // UI
        // if (localStorage.getItem('prevApp') == null) {
        //   if (roles.hasControls()) {
        //     // true is passed, because, we don't want to pass video control on precheck
        //     virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off') ? 'on' : 'off', true);
        //   } else if (virtualclass.gObj.meetingMode) {
        //     virtualclass.vutil.videoHandler('off');
        //   }
        // }
      },


      /**
       * Adding the class student or teacher to the each user's div
       * @param  id User id
       * @param  role user role
       */
      addUserRole(userDiv, role) {
        // TODO, IMPROVE PERFORMANCE, hitting on joining of new members. talentedge, 5.4%
        // Fixed it, now need to validate it
        // That userDiv is passing while creating container in displayUserChatList with member Update
        // var userDiv = document.getElementById("ml" + id);
        let userType;
        userDiv.dataset.role = role;
        if (typeof role !== 'undefined') {
          userType = (role === 's') ? 'student' : 'teacher';
          userDiv.classList.add(userType);
        } else {
          userDiv.classList.add('student');
        }

        if (virtualclass.gObj.uRole === 't' && userType === 'student') {
          document.getElementById('virtualclassCont').classList.remove('student');
        }
      },

      /**
       * Creates a video element
       * and  replaces the image with video
       * manipulates the audio
       * and sends the video
       * @param string userid
       */
      // innerHandleUserMediaOld() {
      //   if (typeof cthis !== 'undefined') {
      //     const stream = cthis.video.tempStream;
      //     if (typeof stream !== 'undefined') {
      //       if (virtualclass.system.mediaDevices.hasWebcam) {
      //         const vidContainer = cthis.video.createVideoElement();
      //         virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

      //         cthis.video.insertTempVideo(vidContainer);
      //         cthis.video.tempVideoInit();
      //         // cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
      //         cthis.video.myVideo = chatContainerEvent.elementFromShadowDom(`#video${virtualclass.gObj.uid}`);
      //         virtualclass.adpt.attachMediaStream(cthis.video.myVideo, stream);
      //         cthis.video.myVideo.muted = true;
      //         cthis.stream = cthis.video.tempStream;
      //         cthis.video.myVideo.onloadedmetadata = () => {
      //           cthis.video.startToStream();
      //           // virtualclass.precheck.webcam.createVideo();
      //         };
      //       }
      //     }
      //   } else {
      //     // console.log('Media: it seems media is not ready');
      //   }
      // },


      innerHandleUserMedia() {
        if (typeof cthis !== 'undefined' && typeof cthis.stream !== 'undefined'
          && virtualclass.system.mediaDevices.hasWebcam) {
          console.log('====> inner HTML VIDEO ', virtualclass.system.mediaDevices.hasWebcam);
          const vidContainer = cthis.video.createVideoElement();
          virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

          cthis.video.insertTempVideo(vidContainer);
          cthis.video.tempVideoInit();
          // cthis.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
          cthis.video.myVideo = chatContainerEvent.elementFromShadowDom(`#video${virtualclass.gObj.uid}`);
          virtualclass.adpt.attachMediaStream(cthis.video.myVideo, cthis.stream);
          cthis.video.myVideo.muted = true;
          cthis.stream = cthis.stream;
          cthis.video.myVideo.onloadedmetadata = (() => cthis.video.startToStream());
        }
      },


      /**
       * Increasing chat container's height as number of users is increased
       * user box scroll, right bar scroll
       *
       */
      updateVideoContHeight() {
        const mh = virtualclass.chat.boxHeight;

        const chatDiv = document.getElementById('chat_div');
        if (chatDiv.scrollHeight >= (mh + 1)) {
          chatDiv.style.overflowY = 'scroll';
        }

        chatDiv.style.maxHeight = `${mh}px`;

        // console.log(`Chat height ${chatDiv.offsetHeight}`);
        // console.log(`Max height ${chatDiv.style.maxHeight}`);

        if (virtualclass.isPlayMode) {
          chatDiv.style.maxHeight = `${mh + 64}px`;
        }
      },
      // Closeing the video
      close() {
        if (Object.prototype.hasOwnProperty.call(virtualclass.media, 'smallVid')) {
          clearInterval(virtualclass.media.smallVid);
        }
      },
      /**
       * Plays all videos of currentlly logged in users after an interval of 1040 ms
       * @param id footer chat  container id
       */
      dispAllVideo(id) {
        setTimeout(
          () => {
            const chatCont = document.getElementById(id);
            if (chatCont != null) {
              const allVideos = chatCont.getElementsByTagName('video');
              for (let i = 0; i < allVideos.length; i++) {
                allVideos[i].play();
              }
            }
          },
          1040,
        );
      },

      /**
       *TODO this function is not being invoked
       */
      existVideoContainer(user) {
        const allVideos = chatContainerEvent.elementFromShadowDom('.userVideos', 'all');
        for (let i = 0; i < allVideos.length; i++) {
          if (allVideos[i].id === `video${user.id}`) {
            return true;
          }
        }
        return false;
      },

      /**
       * The function to invoke with the resulting MediaStreamError if the call to getUSerMedia fails.
       * disableing audioWiget
       * Disappearing all containers
       * @param error error object
       */
      handleUserMediaError(error) {
        const errorString = virtualclass.lang.getString(error);
        const errorMsg = (typeof error === 'object') ? virtualclass.lang.getString(error.name) : errorString;

        if (errorMsg == null) {
          virtualclass.view.createErrorMsg(error, 'errorContainer', 'virtualclassAppFooterPanel');
        } else if (typeof error === 'object') {
          virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'virtualclassAppFooterPanel', { className: error.name });
        } else {
          virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'virtualclassAppFooterPanel');
        }

        virtualclass.user.control.mediaWidgetDisable('vd');
        virtualclass.view.disappearBox('WebRtc');
        // localStorage.setItem('dvid', true);
        // console.log('navigator.getUserMedia error: ', error);

        let errorCode = '';
        switch (error.name) {
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorCode = 'nowebcam';
            break;
          case 'SourceUnavailableError':
            errorCode = 'webcambusy';
            break;
          case 'PermissionDeniedError':
          case 'SecurityError':
            errorCode = 'nopermission';
            virtualclass.gObj.disableCamByUser = true;
            break;
          case 'NotAllowedError':
            errorCode = 'nopermission';
            virtualclass.gObj.disableCamByUser = true;
            break;
          default:
            errorCode = 'rejected';
        }

        virtualclass.system.mediaDevices.webcamErr.push(errorCode);

        // cthis.audio.notifiyMuteAudio();
        // virtualclass.media.audio.removeAudioFromLocalStorage();
      },

      detectAudioWorklet: () => {
        if (typeof OfflineAudioContext === 'undefined') {
          return false;
        }
        const context = new OfflineAudioContext(1, 1, 44100);
        return Boolean(
          context.audioWorklet
          && typeof context.audioWorklet.addModule === 'function',
        );
      },
    };
  }
  return Media;
}