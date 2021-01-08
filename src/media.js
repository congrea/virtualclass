/**
 * This file captures audio and video and send it other particpates
 * It also captures the medium video of presenter
 * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 */

function MediaWrapper(window) {
  virtualclass.adpt = new virtualclass.adapter();
  const cNavigator = virtualclass.adpt.init(navigator);

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
          video: webcam,
          audio: audioConstraint,
        };

        return { webcam, session };
      },

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
            console.log('====> get user media init add stream');
            stream = await cNavigator.mediaDevices.getUserMedia(session);
            if (this.video.enable && this.audio.enable) {
              this.handleUserMediaAudio(stream);
              this.handleUserMediaVideo(stream);
            } else if (this.video.enable && !this.audio.enable) {
              this.handleUserMediaVideo(stream);
            } else if (this.audio.enable && !this.video.enable) {
              this.handleUserMediaAudio(stream);
            }

            console.log('====> get user media init 2 add stream');

            this.status = 1;
          } catch (e) {
            this.status = 2;
            this.handleUserMediaError(e);
            this.audio.notifiyMuteAudio();
            console.log(e);
          }
        }


        if (!this.status) {
          virtualclass.user.control.videoDisable();
          virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
        }
      },

      handleUserMediaAudio(stream) {
        // stream audio
        this.stream = stream;
        this.audio.init(stream);
        if (this.audio.audioContextReady) this.audio.actualManiPulateStream();
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
          if (vidTag != null) this.innerHandleUserMedia(); // TODO, the function name should be chagned// really using ?????
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
          if (vidTag != null) this.innerHandleUserMedia(); // TODO, the function name should be chagned// really using ?????
        }

        virtualclass.settings.userVideoIcon();
        virtualclass.vutil.videoHandler('on');
      },

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
        this.stream = stream;
        this.audio.init(stream);

        if (this.audio.audioContextReady) this.audio.actualManiPulateStream();
        // STREAM // Teacher video
        if (roles.hasAdmin()) virtualclass.videoHost.isDomReady(() => virtualclass.videoHost.renderSelfVideo(stream));
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

      innerHandleUserMedia() {
        if (typeof this.stream !== 'undefined' && virtualclass.system.mediaDevices.hasWebcam) {
          console.log('====> inner HTML VIDEO ', virtualclass.system.mediaDevices.hasWebcam);
          const vidContainer = this.video.createVideoElement();
          virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);

          this.video.insertTempVideo(vidContainer);
          this.video.tempVideoInit();
          // this.video.myVideo = document.getElementById("video" + virtualclass.gObj.uid);
          this.video.myVideo = chatContainerEvent.elementFromShadowDom(`#video${virtualclass.gObj.uid}`);
          virtualclass.adpt.attachMediaStream(this.video.myVideo, this.stream);
          this.video.myVideo.muted = true;
          this.video.myVideo.onloadedmetadata = (() => this.video.startToStream());
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
        if (chatDiv.scrollHeight >= (mh + 1)) chatDiv.style.overflowY = 'scroll';
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
      },

      detectAudioWorklet: () => {
        if (typeof OfflineAudioContext === 'undefined') return false;
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