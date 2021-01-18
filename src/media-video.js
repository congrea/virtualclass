class MediaVideo {
  constructor() {
    this.width = 75;
    this.height = 56;
    this.tempVid = '';
    this.tempVidCont = '';
    this.myVideo = '';
    this.remoteVid = '';
    this.remoteVidCont = '';
    this.enable = false;
    this.randomTime = 0;
    this.vidId = null;
    virtualclass.settings.studentvideo(virtualclass.settings.info.studentvideo)
  }

  // maxHeight: 250,
  // Setting the video container's max height
  init() {
    this.videoCont = document.getElementById('allVideosCont');
    if (this.videoCont != null) {
      this.videoCont.style.maxHeight = `${this.maxHeight}px`; // TODO, this should be removed from here
    }
  }

  // Calulates dimensions of the video to be displayed.
  calcDimension() {
    this.myVideo.width = this.width;
    this.myVideo.height = this.height;
  }
  /**
   *  remove user and corresponding video element
   * @param id userid of the user to be removed
   */
  removeUser(id) {
    const element = document.getElementById(`user${id}`);
    if (element != null) {
      element.parentNode.removeChild(element);
    }
  }
  /**
   * TO create Video container that replaces user image
   * @param  user user object

    */
  createElement(user) {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'videoWrapper';
    const videoSubWrapper = document.createElement('div');
    videoSubWrapper.className = 'videoSubWrapper';
    videoSubWrapper.id = `user${user.id}`;
    videoWrapper.appendChild(videoSubWrapper);
    this.vidId = user.id;

    const video = document.createElement('canvas');
    video.id = `video${this.vidId}`;
    video.className = 'userVideos';
    video.width = this.width;
    video.height = this.height;
    video.muted = 'muted';
    let { videoCont } = this;
    videoSubWrapper.appendChild(video);
    videoCont = videoWrapper;
    virtualclass.media.util.imageReplaceWithVideo(user.id, videoCont);
  }
  // TODO This function is not being invoked
  updateHightInSideBar(videoHeight) {
    // TODO this is not to do every time a function is called
    const sidebar = document.getElementById('widgetRightSide');
    const sidebarHeight = sidebar.offsetHeight;
    const chatBox = document.getElementById('chatContainer');
    const chatBoxHeight = sidebarHeight - videoHeight;
    chatBox.style.height = `${chatBoxHeight}px`;
  }

  /** Send the small video and render it at the receiver's side
   * And breaks user id into bytes
   * Sets the interval for  send small video
   * interval depends on the number of users
   */
  // TODO function defined in function they can be separately defined
  sendInBinary(sendimage) {
    if (io.webSocketConnected()) ioAdapter.sendBinary(sendimage);
  }

  send() {
    if (Object.prototype.hasOwnProperty.call(virtualclass.media, 'smallVid')) {
      clearInterval(virtualclass.media.smallVid);
    }
    const cvideo = this;
    let sendimage;
    let vidType;
    this.randomTime = Math.floor(Math.random() * (8000 - 3000 + 1) + 3000); // Random number between 3000 & 8000
    let totalMembers = -1;
    const that = this;

    function sendSmallVideo() {
      cvideo.tempVidCont.clearRect(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
      cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);

      const user = {
        name: virtualclass.gObj.uName,
        id: virtualclass.gObj.uid,
      };

      if (roles.hasControls()) {
        user.role = virtualclass.gObj.uRole;
      }

      // const d = { x: 0, y: 0 };
      // you increase the the value, increase the quality
      // 0.4 and 9 need 400 to 500 kb/persecond
      if (virtualclass.system.webpSupport) {
        sendimage = cvideo.tempVid.toDataURL('image/webp', 0.6);
        vidType = 1;
      } else {
        sendimage = cvideo.tempVid.toDataURL('image/jpeg', 0.3);
        vidType = 0;
      }

      sendimage = virtualclass.videoHost.convertDataURIToBinary(sendimage);
      if (!virtualclass.videoHost.gObj.stdStopSmallVid && (!roles.hasControls()
        || (roles.hasControls()) && virtualclass.videoHost.gObj.videoSwitch)) {
        const uid = virtualclass.vutil.breakintobytes(virtualclass.gObj.uid, 8);
        const scode = new Uint8ClampedArray([11, uid[0], uid[1], uid[2], uid[3], vidType]);// First parameter represents  the protocol rest for user id
        const sendmsg = new Uint8ClampedArray(sendimage.length + scode.length);
        sendmsg.set(scode);
        sendmsg.set(sendimage, scode.length);
        that.sendInBinary(sendmsg);
      }
      clearInterval(virtualclass.media.smallVid);

      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        const d = virtualclass.media.video.randomTime + (virtualclass.connectedUsers.length * 2500);
        if (totalMembers !== virtualclass.connectedUsers.length) {
          totalMembers = virtualclass.connectedUsers.length;
          let p = -1;
          for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
            if (virtualclass.connectedUsers[0].userid === virtualclass.gObj.uid) {
              p = i;
            }
          }
          const td = d / totalMembers;
          if (p < 0) {
            p = 0;
          }
          const md = p * td;
          virtualclass.media.smallVid = setInterval(sendSmallVideo, (d + md));
        } else {
          virtualclass.media.smallVid = setInterval(sendSmallVideo, d);
        }
      }
    }

    virtualclass.media.smallVid = setInterval(sendSmallVideo, this.randomTime);
  }

  /**
   * Calulate dimensions of the  video
   * and sends the video
   */
  startToStream() {
    virtualclass.media.video.calcDimension();
    virtualclass.media.video.send();
  }

  /**
   * Play the received video with out slicing it
   * @param  uid
   * @param  msg video message received

    */
  playWithoutSlice(uid) {
    //  console.log('uid ' + uid);
    this.remoteVid = document.getElementById(`video${uid}`);
    // TODO remove validation
    if (this.remoteVid != null) {
      this.remoteVidCont = this.remoteVid.getContext('2d');

      this.remoteVidCont.putImageData(imgData, 0, 0);
    }
  }

  drawReceivedImage(imgData, imgType, d, uid) {
    this.remoteVid = chatContainerEvent.elementFromShadowDom(`#video${uid}`);
    if (this.remoteVid != null) {
      this.remoteVidCont = this.remoteVid.getContext('2d');
      if (virtualclass.system.webpSupport || (imgType === 'jpeg')) {
        const img = new Image();
        const that = this;
        img.onload = () => {
          that.remoteVidCont.drawImage(img, d.x, d.y);
        };
        img.src = imgData;
      } else {
        loadfile(imgData, this.remoteVid, this.videoPartCont); // for browsers that do not support webp
      }
    }
  }

/**
   * Creates video element
   * @returns video element
   */
  createVideoElement() {
    const vTag = 'video';
    const parElement = document.createElement('div');
    parElement.className = 'videoWrapper';
    const childElement = document.createElement('div');
    childElement.className = 'videoSubWrapper';
    parElement.appendChild(childElement);
    const videoTag = document.createElement(vTag);
    videoTag.id = `video${virtualclass.gObj.uid}`;
    videoTag.autoplay = true;
    childElement.appendChild(videoTag);
    return parElement;
  }

  /**
   * To create canvas element to display video
   * @param string beforInsert : The element before that video element to be inserted
   */
  insertTempVideo(beforeInsert) {
    const tempVideo = document.createElement('canvas');
    tempVideo.id = 'tempVideo';
    beforeInsert.parentNode.insertBefore(tempVideo, beforeInsert);
  }
  // To initalize canvas element to video and to create it's 2d context
  tempVideoInit() {
    // virtualclass.media.video.tempVid = document.getElementById('tempVideo');
    virtualclass.media.video.tempVid = chatContainerEvent.elementFromShadowDom('#tempVideo');
    virtualclass.media.video.tempVid.width = virtualclass.media.video.width;
    virtualclass.media.video.tempVid.height = virtualclass.media.video.height;
    virtualclass.media.video.tempVidCont = virtualclass.media.video.tempVid.getContext('2d');
  }
  /**
   * Extracting the user id of sender from the sent  message
   * separating it from the audio
   * And playing the video by calling playWithoutSlice
   * @param  msg : Received message

    */

  process(msg) {
    let b64encoded;
    let imgType;
    const dataPack = new Uint8ClampedArray(msg);
    const uid = virtualclass.vutil.numValidateFour(dataPack[1], dataPack[2], dataPack[3], dataPack[4]);

    const userInfo = { id: uid };
    if (!virtualclass.media.existVideoContainer(userInfo)) {
      virtualclass.media.video.createElement(userInfo);
    }
    const recmsg = dataPack.subarray(6, dataPack.length);

    if (dataPack[5] === 1) {
      b64encoded = `data:image/webp;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
      imgType = 'webp';
    } else {
      b64encoded = `data:image/jpeg;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
      imgType = 'jpeg';
    }
    virtualclass.media.video.drawReceivedImage(b64encoded, imgType, { x: 0, y: 0 }, uid);
  }

  async handleVideoControl() {
    const currentVideoStatus = virtualclass.vutil.selfVideoStatus();
    if (currentVideoStatus === 'off') {
      this.enable = true;
      await virtualclass.media.startMedia();
    } else {
      this.enable = false;
      // virtualclass.vutil.videoHandler('off');
      virtualclass.media.stopMedia();
      if (virtualclass.media.audio.enable) virtualclass.media.startMedia();
    }
  }
}