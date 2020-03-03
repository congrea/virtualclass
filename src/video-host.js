/**
 * This file is responsible  for getting  teacher/host video
 * and send it other participates and, if participate in firefox Browser
 * then it converst webp images to png images for enable the video in
 * firefox as well
 */


const BASE64_MARKER = ';base64,';
let videoPartCont; let
  sampleRate;
var videoHost = {
  gObj: {},
  setDefaultValue(speed) {
    virtualclass.videoHost.gObj.MYSPEED = speed || 1;
    virtualclass.videoHost.gObj.teacherVideoQuality = this.getTeacherVideoQuality();
  },
  /**
   * initialize various actions like, for get user media,
   * set dimension for various canvas,
   * @param width expects width for various canvas
   * @param height expects width for various canvas
   */
  init(width, height) {
    this.sl = 0;
    this.width = width;
    this.height = height;
    this.gObj.videoSwitch = 1;// nirmala
    // console.log('videoSwitch 1');
    this.gObj.stdStopSmallVid = false;
    this.domReady = false;
    this.allStdVideoOff = false;
    let swVideo;
    if (roles.hasAdmin()) {
      this._init();
      // var session = { audio: false, video: { width: width, height: height } };
      /*
       var session = {
       audio: false,
       video: {
       width: {ideal: width, max: 320 },
       height: { ideal: height, max: 240 }
       }
       }; */

      const canvas = document.createElement('canvas');
      canvas.id = 'dummyCanvas';
      canvas.width = 40;
      canvas.height = 40;
      document.querySelector('#virtualclassCont').appendChild(canvas);

      WebPDecDemo('dummyCanvas');

      this.domReady = true;
    } else {
      this.setCanvasAttr('videoPartCan', 'videoParticipate');
      // this.setCanvasAttr('videoPartCan', 'videoParticipate');
      // this would be used for converting webp image to png image
      WebPDecDemo('videoParticipate');
      virtualclass.videoHost.UI.hideTeacherVideo(); // hideTeacherVideo();
    }

    const rightPanel = document.querySelector('#virtualclassAppRightPanel');
    if (rightPanel != null) {
      let teacherVideo = localStorage.getItem('tvideo');
      if (teacherVideo == null) {
        teacherVideo = 'show';
      }
      rightPanel.classList.add(teacherVideo);
      if (roles.hasControls()) {
        swVideo = localStorage.getItem('videoSwitch');
        if (swVideo && swVideo === '0') {
          if (virtualclass.connectedUsers && virtualclass.connectedUsers.length) {
            virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid);
          } else {
            virtualclass.gObj.delayVid = 'display';
          }
          virtualclass.videoHost.UI.hideTeacherVideo();
        }
      } else {
        swVideo = JSON.parse(localStorage.getItem('stdVideoSwitch'));
        if (swVideo) {
          if (virtualclass.connectedUsers && virtualclass.connectedUsers.length) {
            virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid);
          } else {
            virtualclass.gObj.delayVid = 'display';
          }
          virtualclass.videoHost.UI.hideTeacherVideo();
        }
        // console.log(swVideo);
      }
    }
  },

  renderSelfVideo(stream) {
    if (typeof virtualclass.media.tempStream === 'undefined') {
      // console.log('Media attached stream');
      this.getMediaStream(stream);
    }
  },

  isDomReady(cb) {
    const that = this;
    if (!this.domReady) {
      this.domreadyCheck = setTimeout(
        () => {
          that.isDomReady(cb);
        }, 1000,
      );
    } else {
      if (this.domreadyCheck != null) {
        clearTimeout(this.domreadyCheck);
      }
      cb();
    }
  },


  /**
   * Initialsize the various canvas attribute
   *  for slice canvas, host canvas and participate canvas
   * @private
   */
  _init() {
    // Canvas for host/teacvher
    this.setCanvasAttr('vidHost', 'videoHost');

    this.setCanvasAttr('vidHostSlice', 'videoHostSlice');
    this.vidHostSlice.globalAlpha = 0.5;
    this.vidHostSlice.globalCompositeOperation = 'multiply';
  },


  onmessage(videoSwitch) {
    // console.log("==== draw teacher video ", videoSwitch);
    if (videoSwitch === 'on') {
      virtualclass.videoHost.gObj.videoSwitch = 1;
      // console.log('videoSwitch 1');
      this.UI.displayTeacherVideo();
      localStorage.tvideo = 'show';
    } else if (videoSwitch === 'off') {
      virtualclass.videoHost.gObj.videoSwitch = 0;
      this.UI.hideTeacherVideo();
      localStorage.tvideo = 'hide';
    }
  },

  stdVideoCtrlMsg(data) {
    const { userid } = data.fromUser;
    if (data.message.stdVideoCtr.videoSwitch) {
      this.setUserIcon(userid);
    } else {
      this.removeUserIcon(userid);
    }
  },

  toggleVideoMsg(action) {
    const videoSwitchCont = document.querySelector('#congCtrBar');
    if (action === 'enable') {
      videoSwitchCont.style.pointerEvents = 'visible';
      videoSwitchCont.style.opacity = '1';
      virtualclass.videoHost.gObj.allStdVideoOff = false;
    } else {
      videoSwitchCont.style.pointerEvents = 'none';
      videoSwitchCont.style.opacity = '0.5';
      virtualclass.videoHost.gObj.allStdVideoOff = true;
    }
  },
  toggleStdVideoIcon(action) {
    const swCont = document.querySelector('.congrea .videoSwitchCont');
    const sw = document.querySelector('.congrea #rightCtlr #videoSwitch');
    if (action === 'enable') {
      sw.setAttribute('data-action', 'disable');
      sw.className = 'video on';
      swCont.setAttribute('data-title', 'Video off');
    } else {
      sw.setAttribute('data-action', 'enable');
      sw.className = 'video off';
      swCont.setAttribute('data-title', 'Video on');
    }
  },

  setUserIcon(userid) {
    let img;
    const isVideo = chatContainerEvent.elementFromShadowDom(`#ml${userid} .user-details a .videoWrapper`);
    if (isVideo) {
      isVideo.parentNode.removeChild(isVideo);
    }


    const imgCont = chatContainerEvent.elementFromShadowDom(`#ml${userid} .user-details a`);
    const imgElem = chatContainerEvent.elementFromShadowDom(`#ml${userid} .user-details a span`) || chatContainerEvent.elementFromShadowDom(`#ml${userid} .user-details a img`);
    if (!imgElem && imgCont != null) {
      if (virtualclass.gObj.chatIconColors[userid] && !virtualclass.gObj.chatIconColors[userid].savedImg) {
        img = document.createElement('span');
        img.innerHTML = virtualclass.gObj.chatIconColors[userid].initial;
        img.style.backgroundColor = virtualclass.gObj.chatIconColors[userid].bgColor;
        img.style.color = virtualclass.gObj.chatIconColors[userid].textColor;
        img.dataset.event = 'ub';
        img.classList.add('chat-img', 'media-object');
        imgCont.appendChild(img);
      } else if (virtualclass.gObj.chatIconColors[userid] && virtualclass.gObj.chatIconColors[userid].savedImg) {
        img = document.createElement('img');
        img.setAttribute('src', virtualclass.gObj.chatIconColors[userid].savedImg);
        img.classList.add('chat-img', 'media-object');
        imgCont.appendChild(img);
      } else {
        // todo to add default img
      }
      // console.log('set User icon');
    } else {
      // console.log('Image container is null');
    }
  },
  removeUserIcon(userid) {
    const cthis = virtualclass.media;
    // console.log('Remove User icon');
    if (virtualclass.gObj.uid === userid) { // for self
      const vidContainer = cthis.video.createVideoElement();

      virtualclass.media.util.imageReplaceWithVideo(virtualclass.gObj.uid, vidContainer);
      const canvas = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid} #tempVideo`);
      if (!canvas) {
        cthis.video.insertTempVideo(vidContainer);
        cthis.video.tempVideoInit();
      }
      cthis.video.myVideo = chatContainerEvent.elementFromShadowDom(`#video${virtualclass.gObj.uid}`);
      cthis.video.myVideo.muted = true;
      virtualclass.adpt.attachMediaStream(cthis.video.myVideo, cthis.video.tempStream);
    }
  },


  // nirmala
  // todo *to be called only if flag  available in localstorage
  // todo to modify later
  fromLocalStorage() {
    let videoSwitch = '';
    let stdVideoSwitch;
    if (roles.hasControls()) {
      videoSwitch = localStorage.getItem('videoSwitch');
      localStorage.removeItem('videoSwitch');
    } else {
      const stdSwitch = localStorage.getItem('stdVideoSwitch');
      stdVideoSwitch = (stdSwitch != null && (stdSwitch != 'undefined')) ? JSON.parse(stdSwitch) : false;

      localStorage.removeItem('stdVideoSwitch');

      const allStdvideo = localStorage.getItem('allStdVideoOff');

      const allStdVideoOff = (allStdvideo != null && allStdvideo != 'undefined') ? JSON.parse(allStdvideo) : false;
      virtualclass.videoHost.gObj.allStdVideoOff = allStdVideoOff;
      localStorage.removeItem('stdVideoSwitch');
    }

    /** TODO
     * videoHandler at utility.js and below block should be merged
     * * */
    if (typeof videoSwitch !== 'undefined' && videoSwitch) {
      virtualclass.videoHost.gObj.videoSwitch = +videoSwitch;
      if (roles.hasControls()) {
        const sw = document.getElementById('videoSwitch');
        if (sw) {
          if (+videoSwitch) {
            if (sw.classList.contains('off')) {
              sw.classList.add('on');
              sw.classList.remove('off');
              // console.log('Video controller on');
            }
          } else if (sw.classList.contains('on')) {
            // console.log('Video controller off');
            sw.classList.add('off');
            sw.classList.remove('on');
            if (virtualclass.gObj.meetingMode) {
              virtualclass.multiVideo.setVideoStatus(false);
            }
          }
        }
      } else if (!virtualclass.gObj.meetingMode) {
        if (+videoSwitch) {
          virtualclass.videoHost.UI.displayTeacherVideo();
        } else {
          virtualclass.videoHost.UI.hideTeacherVideo();
        }
      }
      // localStorage.removeItem("videoSwitch");
    }
    if (!roles.hasControls()) {
      if (typeof stdVideoSwitch !== 'undefined' && stdVideoSwitch) {
        virtualclass.videoHost.gObj.stdStopSmallVid = stdVideoSwitch;

        if (stdVideoSwitch) {
          virtualclass.videoHost.toggleStdVideoIcon('disable');
          virtualclass.multiVideo.setVideoStatus(false);
        } else {
          virtualclass.videoHost.toggleStdVideoIcon('enable');
        }
      }
      if (virtualclass.videoHost.gObj.allStdVideoOff || !virtualclass.system.mediaDevices.hasWebcam) {
        virtualclass.videoHost.toggleVideoMsg('disable');
      } else if (virtualclass.gObj.videoEnable) {
        virtualclass.videoHost.toggleVideoMsg('enable');
      } else {
        virtualclass.videoHost.toggleStdVideoIcon('disable');
      }
    }
  },
  /** Setting canvas attribut like
   * width, height, context etc
   * @param canvas expect key for canvas
   * @param id expects canvas id
   */
  setCanvasAttr(canvas, id) {
    this[canvas] = document.getElementById(id);
    this[canvas].width = this.width;
    this[canvas].height = this.height;
    this[`${canvas}Con`] = this[canvas].getContext('2d');
  },
  /**
   *  Getting the stream for teacher/host video
   *  @param stream expects medea stream, eventually converts into video
   */


  getMediaStream(stream) {
    this.videoHostSrc = document.getElementById('videoHostSource');
    this.videoHostSrc.width = this.width;
    // this.videoHostSrc.height = this.height;

    // virtualclass.vhAdpt.attachMediaStream(this.videoHostSrc, stream);
    virtualclass.adpt.attachMediaStream(this.videoHostSrc, stream);
    const that = this;
    // TODO remove setTimeout
    setTimeout(
      () => {
        that.shareVideo();
      }, 2000,
    );
  },
  /**
   * It shares the video,
   * It gets the user picture in various slices according to resolution
   * and send it to other users
   */

  shareVideo() {
    const resA = 1;
    const resB = 1;
    this.imageSlices = this.getImageSlices(resA, resB);
    this.clearTeacherVideoTime();
    videoHost.gObj.shareVideoInterval = setInterval(
      () => {
        if (this.gObj.videoSwitch && io.webSocketConnected() && virtualclass.system.mediaDevices.hasWebcam) {
          this._shareVideo(resA, resB);
        }
      },
      120,
    );
  },

  clearTeacherVideoTime() {
    if (Object.prototype.hasOwnProperty.call(videoHost.gObj, 'shareVideoInterval')) {
      clearInterval(videoHost.gObj.shareVideoInterval);
    }
  },

  _shareVideo(resA, resB) {
    let d;
    for (this.sl = 0; this.sl < (resA * resB); this.sl++) {
      this.vidHostCon.drawImage(this.videoHostSrc, 0, 0, this.width, this.height);
      d = this.imageSlices[this.sl];
      const imgData = this.vidHostCon.getImageData(d.x, d.y, d.w, d.h);
      this.vidHostSliceCon.putImageData(imgData, d.x, d.y);
    }

    if (this.sl === resA * resB) {
      d = { x: 0, y: 0 };
      // you increase the the value, increase the quality
      // 0.4 and 9 need 400 to 500 kb/persecond
      let sendimage;
      let videoType;
      if (virtualclass.system.webpSupport) {
        sendimage = this.vidHostSlice.toDataURL('image/webp', 0.6);
        videoType = 1;
      } else {
        sendimage = this.vidHostSlice.toDataURL('image/jpeg', 0.3);
        videoType = 0;
      }
      this.vidHostSliceCon.clearRect(0, 0, this.width, this.height);
      this.sendInBinary(sendimage, videoType);
    }
  },
  sendInBinary(sendimage, vidType) {
    sendimage = this.convertDataURIToBinary(sendimage);
    const scode = new Int8Array([21, vidType]); // Status Code teacher video
    const sendmsg = new Int8Array(sendimage.length + scode.length);
    sendmsg.set(scode);
    sendmsg.set(sendimage, scode.length); // First element is status code (101)
    ioAdapter.sendBinary(sendmsg);
  },
  convertDataURIToBinary(dataURI) {
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  },
  /**
   * The teacher/host video is shown at participate side
   * @param imgData expects image which has to be drawn
   * @param d expects destination x and y
   */
  drawReceivedImage(imgData, imgType, d) {
    if (typeof vid0eoPartCont === 'undefined') {
      // canvas2 = document.getElementById('mycanvas2');
      this.videoPartCan = document.getElementById('videoParticipate');
      this.videoPartCont = this.videoPartCan.getContext('2d');
      videoPartCont = true;
    }

    // 371 audio latency of buffered audio
    // for sync the audio and video
    const that = this;

    if (typeof virtualclass.media.audio.Html5Audio !== 'undefined') {
      sampleRate = virtualclass.media.audio.Html5Audio.audioContext.sampleRate;
    } else if (typeof sampleRate === 'undefined') {
      sampleRate = new (window.AudioContext || window.webkitAudioContext)().sampleRate;
    }
    if (virtualclass.gObj.isReadyForVideo) {
      if (document.querySelector('#virtualclassCont.congrea #videoHostContainer.hide')) {
        virtualclass.videoHost.UI.displayTeacherVideo();
      }
    }

    setTimeout(
      () => {
        if (virtualclass.isPlayMode || virtualclass.videoHost.gObj.MYSPEED < 3) {
          if (virtualclass.system.webpSupport || (imgType === 'jpeg')) {
            const img = new Image();
            img.onload = function () {
              that.videoPartCont.drawImage(img, d.x, d.y);
            };
            img.src = imgData;
          } else if (virtualclass.gObj.isReadyForVideo) {
            virtualclass.gObj.isReadyForVideo = false;
            loadfile(imgData, that.videoPartCan, that.videoPartCont); // for browsers that do not support webp
          }
        }
      }, 260, // ((4096/sampleRate)*1000*3)
    );
  },
  onError(err) {
    // console.log(`MediaStream Error ${err}`);
  },
  /**
   *
   * @param resA, resB defines the total number of slices of images
   * returns the array which has slices of image,
   * each slice has x, y, width and height of image
   */
  getImageSlices(resA, resB) {
    // resB ==  y
    // resA ==  x
    const imgSlicesArr = [];
    const totLen = resA * resB;
    const width = Math.floor(this.vidHost.width / resB);
    const height = Math.floor(this.vidHost.height / resA);

    for (let i = 0; i < totLen; i++) {
      const eachSlice = this._getSingleSliceImg(i, width, height, resA, resB);
      imgSlicesArr.push(eachSlice);
    }
    return imgSlicesArr;
  },
  /** Getting the single slice of image according to given i
   *
   * @param i
   * @param width of single slice of image
   * @param height of single slice of image
   * @param resA, resB defines the total number of slices
   * @returns the an image block from where it should strart by given x and y,
   * and height and width of that single image
   */
  _getSingleSliceImg(i, width, height, resA, resB) {
    const imgSlice = {};
    let x; let y; let cx; let cy; const
      ci = 0;

    if (i == 0) {
      x = 0;
      y = 0;
    } else {
      cx = i % resB; // for x
      cy = Math.floor(i / resB); // for y

      x = cx * width;
      y = cy * height;
    }
    return {
      x, y, w: width, h: height,
    };
  },
  Uint8ToString(u8a) {
    const CHUNK_SZ = 0x8000;
    const c = [];
    for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
    }
    return c.join('');
  },
  getTeacherVideoQuality() {
    virtualclass.videoHost.gObj.teacherVideoQuality = 16;
    const videoHostSource = document.querySelector('#virtualclassCont.teacher #videoHostSource');
    if (videoHostSource != null) {
      if (!videoHostSource.src) {
        virtualclass.videoHost.gObj.teacherVideoQuality = 0;
      }
    }
    return virtualclass.videoHost.gObj.teacherVideoQuality;
  },

  afterSessionJoin() {
    const speed = roles.hasAdmin() ? 1 : virtualclass.videoHost.gObj.MYSPEED;
    this.setDefaultValue(speed);
    // this.initVideoInfo();

    virtualclass.network.initToPing(10000); // Wait 10 seconds for everything to be ready
    this.fromLocalStorage();
    this.resetPrecheck();
  },


  // nirmala
  resetPrecheck() {
    this._resetPrecheck();
    const joinSession = document.querySelector('#joinSession .next');
    if (joinSession != null) {
      const btn = document.createElement('button');
      joinSession.parentNode.appendChild(btn);
      joinSession.parentNode.removeChild(joinSession);
      btn.classList.add('precheckComplete', 'btn', 'btn-default');
      btn.innerHTML = virtualclass.lang.getString('prechkcmplt');
    }

    const skip = document.querySelector('#preCheckcontainer .skip');
    if (skip) {
      skip.addEventListener('click', () => {
        micTesting.makeAudioEmpty();
        const virtualclassPreCheck = document.getElementById('preCheckcontainer');
        virtualclassPreCheck.style.display = 'none';
        const virtualclassApp = document.getElementById('virtualclassApp');
        virtualclassApp.style.display = 'flex';
        // localStorage.setItem('precheck', true);
        virtualclass.videoHost._resetPrecheck();
      });
    }
  },
  // nirmala
  _resetPrecheck() {
    const pbar = document.querySelectorAll('#congProgressbar .active');
    for (let i = 0; i < pbar.length; i++) {
      if (i > 0) {
        pbar[i].classList.remove('active');
      }
    }

    if (pbar.length > 0) {
      const matches = document.querySelectorAll('#myModal .precheck');
      const precheckElems = [].slice.call(matches, 0);
      precheckElems.forEach((item) => {
        item.style.display = 'none';
      });
      const info = document.querySelector('#vcBrowserCheck .information');
      if (info) {
        info.parentNode.removeChild(info);
      }

      if (virtualclass.precheck.totalTest) {
        virtualclass.precheck.totalTest.forEach((elem) => {
          if (typeof virtualclass.precheck[elem] !== 'undefined' && Object.prototype.hasOwnProperty.call(virtualclass.precheck[elem], 'alreadyDone')) {
            if (elem === 'mic') {
              delete virtualclass.precheck[elem].alreadyDone;
            }
          }
        });
      }
    }
  },

  UI: {
    displayTeacherVideo() {
      if (!virtualclass.gObj.meetingMode) {
        const host = document.querySelector('.congrea #videoHostContainer');
        host.classList.add('show');
        host.classList.remove('hide');
        const rightbar = document.querySelector('.congrea #virtualclassAppRightPanel');
        const footerBar = document.querySelector('#virtualclassCont.congrea #virtualclassAppFooterPanel');
        rightbar.classList.add('vidShow');
        footerBar.classList.add('vidShow');
        rightbar.classList.remove('vidHide');
        footerBar.classList.remove('vidHide');
      }
    },

    hideTeacherVideo() {
      if (!virtualclass.gObj.meetingMode) {
        const host = document.querySelector('.congrea #videoHostContainer');
        host.classList.remove('show');
        host.classList.add('hide');
        const rightbar = document.querySelector('.congrea #virtualclassAppRightPanel');
        const footerBar = document.querySelector('#virtualclassCont.congrea #virtualclassAppFooterPanel');
        rightbar.classList.add('vidHide');
        rightbar.classList.remove('vidShow');
        footerBar.classList.add('vidHide');
        footerBar.classList.remove('vidShow');
      }
    },
  },
};
