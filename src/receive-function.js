/**
 * Helper functions for newmessage event
 * @type {receiveFunctions}
 */

const receiveFunctions = new function () {
  this.pong = function (e) {
    ioPingPong.pong(e);
  };

  this.pongAck = function (e) {
    ioPingPong.pongAck(e);
  };

  this.control = function (e) {
    if (roles.isStudent()) {
      virtualclass.user.control.onmessage(e);
    } else if (roles.hasControls()){

      virtualclass.editorRich.collborateToolStatus = e.message.status;
    }
  };

  // editor data
  this.eddata = function (e) {
    // virtualclass.editorRich.onmessage(e.message);
    if (Object.prototype.hasOwnProperty.call(e.message, 'et')) {
      if (e.message.et === 'editorRich') {
        virtualclass.editorRich.onmessage(e, 'EditorRich');
      } else {
        virtualclass.editorCode.onmessage(e, 'EditorCode');
      }
    }
  };

  this.videoStop = function () {
    if (roles.isStudent()) {
      const videoHostContainer = document.getElementById('videoHostContainer');
      if (videoHostContainer !== null) {
        videoHostContainer.classList.add('displayInterrupt');
      }
    }
  }

  /**
   * This functioon would invoke when the new user would join as
   * educator with overriding the role. This would at invoke at presenter window
   * for handle editor mode(read and write)
   * @param e.message has various required properties
   */
  this.nEd = function (e) {
    // localStorage.setItem('nEd', true);
    // TODO the editor should be dynamic
    const editorRichWriteModeBox = document.getElementById('EditorRichwriteModeBox');

    if (editorRichWriteModeBox != null) {
      if (editorRichWriteModeBox.dataset.writeMode === 'true') {
        localStorage.removeItem('nEd');
      } else {
        e.message.cf = 'control';
        // localStorage.setItem('editorCode', 'true');
        virtualclass.user.control.onmessage(e);
      }
    } else {
      // console.log('editor mode editorRichWriteModeBox null');
    }
    // console.log('Editor mode save');
  };

  this.bt = function () {
    virtualclass.vutil.removeBecomeTeacherWidget();
  };

  this.tConn = function (e) {
    // Lets Editor be the ready
    setTimeout(
      () => {
        virtualclass.vutil.setReadModeWhenTeacherIsConn('editorRich');
        virtualclass.vutil.setReadModeWhenTeacherIsConn('editorCode');
      }, 2000,
    );
  };

  // youtube share
  this.yts = function (e) {
    // nothing to do with self received packet
    if (e.fromUser.userid !== virtualclass.gObj.uid) {
      virtualclass.yts.onmessage(e.message);
    }
  };

  // silence audio
  this.sad = function (e) {
    let user; let
      anchorTag;
    if (e.message.sad) {
      user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', true);
      virtualclass.user.control.audioSign(user, 'create');
    } else {
      user = virtualclass.user.control.updateUser(e.fromUser.userid, 'ad', false);
      virtualclass.user.control.audioSign(user, 'remove');
      anchorTag = document.getElementById(`${user.id}contrAudAnch`);
      if (anchorTag != null) {
        anchorTag.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
      }
    }
    return true;
  };

  this.settings = function (e) {
    if (Object.prototype.hasOwnProperty.call(e.message, 'Hex')) {
      const newTime = virtualclass.vutil.UTCtoLocalTimeToSeconds(e.message.time);
      if (newTime > virtualclass.settings.currentTime) {
        virtualclass.settings.onMessage(e.message.Hex, e.message.toUser);
        virtualclass.settings.currentTime = newTime;
      }
    }
  };

  // enable audio
  this.ena = function (e) {
  };

  // disable audio
  this.dia = function (e) {
  };

  // enable all std audio
  this.aEna = function (e) {
  };

  // disable all std audio
  this.aDia = function (e) {
  };

  // chat message update
  this.msg = function (e) {
    messageUpdate(e); // chat update
  };

  // session end
  this.sEnd = async function () {
    // #967
    if (!virtualclass.isPlayMode) {
      const joinClass = document.querySelector('#joinClassModal');
      joinClass.style.display = 'none';

      const virtualclassApp = document.querySelector('#virtualclassCont #virtualclassApp');
      if (virtualclassApp != null) {
        virtualclassApp.style.display = 'flex';
      }
      await virtualclass.config.endSession();
      virtualclass.popup.sesseionEndWindow();
      virtualclass.gObj.endSession = true;
    }
  };

  // whiteboard ready
  this.dispWhiteboard = function (e) {
    // virtualclass.makeAppReady(virtualclass.apps.wb, undefined, e.message.d, e.message.ci);
    // virtualclass.makeAppReady(virtualclass.apps.wb, undefined, e.message.d);
    virtualclass.makeAppReady({ app: virtualclass.apps.wb, data: e.message.d });
    // virtualclass.vutil.createWhiteBoard(`_doc_${e.message.d}`);
  };
  this.ppt = function (e) {
    if (Object.prototype.hasOwnProperty.call(e.message, 'init')) {
      // virtualclass.makeAppReady(virtualclass.apps.sp);
      virtualclass.makeAppReady({ app: virtualclass.apps.sp });
    } else {
      if (typeof virtualclass.sharePt !== 'object') {
        // If virtualclass.ssharePt is not ready at participate side, then we
        // will create it first then only proceed to next ppt packet
        // virtualclass.makeAppReady(virtualclass.apps.sp);
        virtualclass.makeAppReady({ app: virtualclass.apps.sp });
        virtualclass.sharePt.onmessage({
          pptMsg: e.message.ppt.init,
          cf: 'ppt',
          user: 'all',
          cfpt: 'setUrl',
        });
      }
      virtualclass.sharePt.onmessage(e.message);
    }
 };

  // unshare schreen
  this.unshareScreen = function (e) {
    virtualclass.gObj.studentSSstatus.shareToAll = false;
    const app = e.message.st;
    if (typeof virtualclass[app] === 'object') {
      // console.log('Unshare the screen at student');
      virtualclass[app].prevImageSlices = [];
      virtualclass[app].removeStream();
      virtualclass.currApp = virtualclass.gObj.defaultApp;
    }
  };

  // notfound
  this.videoSlice = function (e) {
    virtualclass.media.playVideo(e.message.videoSlice);
  };

  // This is depricated from 26-08-2019, should be removed in future
  this.videoByImage = function () {
    // if (!virtualclass.media.existVideoContainer(e.message.videoByImage)) {
    //   virtualclass.media.video.createElement(e.message.videoByImage);
    // }
  };


  // not found
  this.chatPackResponsed = function (e) {
    if (e.message.byRequest === virtualclass.gObj.uid) {
      virtualclass.gObj.chat.displayMissedChats(e.message.chatPackResponsed);
    }
  };


  /**
   * remove presenter role when educator is join as teacher
   * @param e
   */

  // Assign Role

  // Clear All
  this.clearAll = function (e) {
    // console.log('====> WHITEBOARD APP DATA CLEAR ALL');
    // if (typeof virtualclass.wb !== 'object') {
    //   virtualclass.makeAppReady({ app: virtualclass.apps.wb });
    // }
    // virtualclass.wb[virtualclass.gObj.currWb].response.clearAll();
  };

  // Create mouse
  this.createArrow = function (e) {
    if (typeof virtualclass.wb === 'object') {
      if (!roles.hasControls() && virtualclass.wb[virtualclass.gObj.currWb]) {
        virtualclass.wb[virtualclass.gObj.currWb].response.createArrow(e.message);
      }
    }
  };

  // Display Whiteboard Data
  this.repObj = function (e) {
    if (typeof virtualclass.gObj.currWb !== 'undefined') {
      if (typeof virtualclass.wb[virtualclass.gObj.currWb] === 'object' && e.fromUser.role === 't') {
        virtualclass.wb[virtualclass.gObj.currWb].utility.drawInWhiteboards(e.message.repObj, virtualclass.gObj.currWb);
      }
    }

    // let i = 0;
    // for (; i < e.message.repObj.length; i++) {
    //   virtualclass.gObj.wbData[virtualclass.gObj.currWb].push(e.message.repObj[i]);
    // }
    virtualclass.vutil.storeWhiteboardAtInlineMemory(e.message.repObj);
  };

  // Replay All, TODO, need to do verify
  this.replayAll = function (e) {
    virtualclass.wb[virtualclass.gObj.currWb].response.replayAll();
  };


  // documnetation sharing
  this.dts = function (e) {
    if (Object.prototype.hasOwnProperty.call(e.message.dts, 'init')) {
      // console.log('====> final seek suman 4', e.message.dts);
      // console.log('====> document shareing 1');
      virtualclass.gObj.screenRh = 100;
      // virtualclass.makeAppReady('DocumentShare', undefined, e.message.dts);
      virtualclass.makeAppReady({ app: 'DocumentShare', data: e.message.dts });
      virtualclass.gObj.screenRh = 60;
    } else if (typeof virtualclass.dts === 'object') {
      virtualclass.dts.onmessage(e);
    }
  };
  this.poll = function (e) {
    // console.log(e.message.poll.pollMsg);
    if (e.message.poll.pollMsg === 'init') {
      // virtualclass.makeAppReady('Poll');
      // virtualclass.makeAppReady({ app: 'Poll' });
      virtualclass.makeAppReady({ app: 'Poll' });
    } else {
      if (typeof virtualclass.poll !== 'object') {
        // If virtualclass.ssharePt is not ready at participate side, then we
        // will create it first then only proceed to next ppt packet
        // virtualclass.makeAppReady('Poll');
        virtualclass.makeAppReady({ app: 'Poll' });
        virtualclass.poll.onmessage({ pollMsg: e.message.poll.init, cf: 'poll', user: 'all' });
      }
      virtualclass.poll.onmessage(e.message, e.fromUser);
    }
  };

  this.quiz = function (e) {
    // console.log(e.message.quiz.quizMsg);
    if (e.message.quiz.quizMsg === 'init') {
      // virtualclass.makeAppReady('Quiz');
      virtualclass.makeAppReady({ app: 'Quiz' });
    } else {
      if (typeof virtualclass.quiz !== 'object') {
        // virtualclass.makeAppReady('Quiz');
        virtualclass.makeAppReady({ app: 'Quiz' });

        virtualclass.quiz.onmessage({ quizMsg: e.message.quiz.init, cf: 'quiz', user: 'all' });
      }
      virtualclass.quiz.onmessage(e.message, e.fromUser);
    }
  };


  this.videoUl = function (e) {
    virtualclass.videoUl.onmessage(e.message);
  };

  this.congController = function (e) {
    const videoMode = e.message.congCtr.videoSwitch;

    if (e.fromUser.userid !== virtualclass.gObj.uid) {
      virtualclass.videoHost.onmessage(videoMode);
    }

    if (videoMode === 'off') {
      virtualclass.vutil.addClass('virtualclassCont', 'videoff');
      virtualclass.vutil.addClass('virtualclassAppRightPanel', 'hide');
      virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'show');
      virtualclass.videoHost.setUserIcon(e.fromUser.userid);
    } else {
      document.querySelector('#virtualclassCont').classList.remove('videoff');
      virtualclass.vutil.addClass('virtualclassAppRightPanel', 'show');
      virtualclass.vutil.removeClass('virtualclassAppRightPanel', 'hide');
    }
  };

  this.tsr = function (e) {
    return;
    const enable = e.message.ac;
    if (enable) {
      virtualclass.chat.enableTechSupport(e.message.uid);
    } else {
      virtualclass.chat.disableTechSupport(e.message.uid);
    }
  };

  // no audio
  this.na = function (e) {
    virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, 'icon-audioEnaOrange');
  },

  // yes audio
  this.ya = function (e) {
    virtualclass.user.control.iconAttrManupulate(e.fromUser.userid, 'icon-audioEnaGreen');
  },


  this.mem_add = function (e) {
    virtualclass.ioEventApi.member_added({
      type: 'member_added',
      newJoinUser: e.message.user,
      cmadd: true,
    });
  };

  this.mvid = function (e) {
    // console.log('multivideo, message received');
    virtualclass.multiVideo.onmessage(e.message, e.fromUser.userid);
  };

  this.sc = function (e) {
    // console.log('Recevied scroll');
    virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
  };

  this.scf = function (e) {
    // console.log('Recevied scroll first');
    console.dir(e.message);
    if (virtualclass.gObj.currWb != null) {
      virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(e.message);
    }
  };

  this.cwb = function (e) {
    if (Object.prototype.hasOwnProperty.call(e.message, 'diswb')) {
      const { wid } = e.message;
      virtualclass.gObj.currWb = wid;

      const idn = wid.split('_');
      if (idn.length > 0) {
        virtualclass.gObj.currSlide = idn[idn.length - 1];
      }
      virtualclass.gObj.currIndex = e.message.currIndex;
      if (!virtualclass.wbCommon.whiteboardExist(virtualclass.gObj.currWb)) {
        virtualclass.vutil.createWhiteBoard(virtualclass.gObj.currWb);
      } else {
        virtualclass.wbCommon.indexNav.updateNavigation();
      }
      virtualclass.wbCommon.displaySlide(wid);
      // localStorage.setItem('currIndex', virtualclass.gObj.currIndex);
    } else if (Object.prototype.hasOwnProperty.call(e.message, 'wbCount')) {
      virtualclass.gObj.wbCount = e.message.wbCount;
      virtualclass.gObj.currIndex = e.message.currIndex;
      virtualclass.wbCommon.indexNav.updateNavigation();
      // if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
      //   virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
      // } else {
      //   virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currIndex);
      // }


      // if (virtualclass.gObj.wIds.indexOf(Number(virtualclass.gObj.wbCount)) == -1) {
      //   virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
      //   virtualclass.gObj.currIndex = e.message.currIndex;
      //   virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currIndex);
      // }
      // localStorage.setItem('currIndex', virtualclass.gObj.currIndex);
    }
  };

  this.rearrangeWb = function (e) {
    virtualclass.orderList.Whiteboard.overrideOrder(e.message.order);
    virtualclass.wbCommon.rearrange(virtualclass.orderList.Whiteboard.ol.order);
  }

  /** *** Start Student Screen Sharing **** */
  /* Handle teacher request for screen sharing * */
  this.reqscreen = function (e) {
    if (e.message.cancel) {
      virtualclass.popup.closeElem();
    } else {
      virtualclass.gObj.studentSSstatus.receivedScreenShareRequest = true;
      if (virtualclass.system.device !== 'mobTab'
        && (virtualclass.system.mybrowser.name === 'Chrome' || virtualclass.system.mybrowser.name === 'Firefox'
        || virtualclass.system.mybrowser.name === 'Edge')) {
        const message = virtualclass.lang.getString('stdscreenshare');
        if (virtualclass.gObj.precheckScrn) {
          virtualclass.vutil.prechkScrnShare();
        }
        virtualclass.gesture.closeContinueWindow();
        virtualclass.popup.confirmInput(message, (confirm) => {
          delete virtualclass.gObj.studentSSstatus.receivedScreenShareRequest;
          if (confirm) {
            if (roles.isStudent()) {
              virtualclass.gObj.studentSSstatus.mesharing = true;
            }
            const appName = 'ScreenShare';
            virtualclass.makeAppReady({ app: appName, cusEvent: 'byclick' });
          } else {
            virtualclass.vutil.beforeSend({ sd: true, cf: 'colorIndicator' });
          }

          if (!virtualclass.media.readyAudioContext) {
            virtualclass.media.audio.initAudiocontext(); // Incase of audio context is not ready yet
            virtualclass.media.readyAudioContext = true;
          }
        });
      } else {
        virtualclass.vutil.beforeSend({ ext: true, cf: 'colorIndicator', nosupport: true });
      }
    }
  };

  /** Knows the id of student who is screen sharing * */
  this.sshare_user = (e) => {
    virtualclass.vutil.removeSSsharing();
    virtualclass.gObj.whoIsSharing = e.fromUser.userid;
    virtualclass.vutil.initssSharing(e.fromUser.userid);
  };

  // Self view, but display none to others
  this.sview = function (e) {
    virtualclass.gObj.studentSSstatus.shareToAll = false;
    if (virtualclass.ss) {
      virtualclass.ss.selfView(e.message);
    }
  };

  // Share screenshare to all
  this.sToAll = function () {
    virtualclass.gObj.studentSSstatus.shareToAll = true;
    virtualclass.gObj.studentSSstatus.sharing = true;
    if (virtualclass.ss) { // Only run when websocket is connected
      virtualclass.ss.shareToAll();
    }
  };

  /** This happens when student does page refresh during the share is being shared  * */
  this.rmStdScreen = function (e) {
    virtualclass.vutil.initDefaultApp();
    virtualclass.vutil.beforeSend({ unshareScreen: true, st: 'ss', cf: 'unshareScreen' });
    if (typeof virtualclass.ss === 'object') {
      virtualclass.ss.clearScreenShare();
    } else {
      virtualclass.vutil.removeSSsharing();
    }
  };
  /** *** End Student Screen Sharing **** */

  this.raiseHand = function (e) {
    virtualclass.raiseHand.onMsgRec(e);
  };
  this.colorIndicator = function (e) {
    const rMsg = e.message;
    const uid = e.fromUser.userid;
    if (rMsg.sd) {
      const elem = chatContainerEvent.elementFromShadowDom(`#ml${uid} .icon-stdscreenImg`);
      if (elem !== null) {
        elem.setAttribute('data-dcolor', 'red'); // Cancelled the sharing the screen
        elem.parentNode.dataset.title = virtualclass.lang.getString('screensharedenied');
      }
    } else {
      delete virtualclass.gObj.prvRequestScreenUser;
      if (rMsg.ext) {
        const color = Object.prototype.hasOwnProperty.call(rMsg, 'nosupport') ? 'nosupport' : 'orange'; // not support screen share
        const elem = chatContainerEvent.elementFromShadowDom(`#ml${uid} .icon-stdscreenImg`);
        if (elem !== null) {
          elem.setAttribute('data-dcolor', color);
          if (color === 'nosupport') {
            elem.parentNode.dataset.title = virtualclass.lang.getString('screensharenotsupport');
          }
        }
      }
    }
  };

  this.stdVideoCtrl = function (e) {
    if (e.fromUser.userid !== virtualclass.gObj.uid) {
      virtualclass.videoHost.stdVideoCtrlMsg(e);
    }
  };

  this.toggleVideo = function (e) {
  };

  this.destroyPlayer = function (e) {
    if (virtualclass.currApp === 'Video') {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'videoUl') && virtualclass.videoUl.videoUrl) {
        if (virtualclass.videoUl) {
          virtualclass.videoUl.destroyPlayer();
        }

        virtualclass.videoUl.videoUrl = '';
        virtualclass.videoUl.videoId = '';
        const frame = document.getElementById('dispVideo_Youtube_api'); // youtube video
        if (frame && frame.contentWindow) {
          frame.contentWindow.postMessage(
            '{"event":"command","func":"pauseVideo","args":""}',
            '*',
          );
        }
        const dispVideo = document.querySelector('.congrea #dispVideo'); // uploaded video
        if (dispVideo) {
          dispVideo.style.display = 'none';
          const video = document.querySelector('.congrea #dispVideo video');
          if (video) {
            video.setAttribute('src', '');
          }
        }
        const currPlayed = document.querySelector('#listvideo .playing');
        if (currPlayed) {
          currPlayed.classList.remove('playing');
        }
        const currCont = document.querySelector('#listvideo .removeCtr');
        if (currCont) {
          currCont.classList.remove('removeCtr');
        }

        if (typeof virtualclass.videoUl.player === 'object') {
          // console.log('====> Video player is destroyed  <======', virtualclass.videoUl.player);
          delete (virtualclass.videoUl.player);
        }
      }
    }
  };

  this.sync = function () {};

  /** setting * */
  this.recs = function (e) {
    if (virtualclass.isPlayMode) {
      /* Teacher video Off/On on recording after av recording off/on */
      if (virtualclass.videoHost.gObj.videoSwitch) {
        virtualclass.videoHost.onmessage('on');
      } else {
        virtualclass.videoHost.onmessage('off');
      }

      // e.message.ac === 11 ? virtualclass.videoHost.onmessage('off') : virtualclass.videoHost.onmessage('on');
    } else {
      if (virtualclass.settings.info.attendeeAV) {
        virtualclass.settings.onMessage(e.message);
      } else {
        if (roles.hasControls()) {
          virtualclass.settings.onMessage(e.message);
        }
      }
    }
  };

  this.rawSyncData = function (e) {
    virtualclass.serverData.onMessage(e.message);
  };

  this.screenShareId = function (e) {
    virtualclass.gObj.screenShareId = e.message.id;
  }

  this.readyContext = function () {
    console.log('===> do nothing ready context');
  }
}();
