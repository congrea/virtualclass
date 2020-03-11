/** To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*  * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (window) {
  const vutil = {
    createDOM(tag, id, _class) {
      const elem = document.createElement(tag);
      if (typeof id !== 'undefined') {
        elem.id = id;
      }

      if (typeof _class !== 'undefined') {
        let classes = '';
        if (_class.length > 0) {
          for (let i = 0; i < _class.length; i++) {
            classes += `${_class[i]} `;
          }
        }

        elem.className = classes;
      }

      return elem;
    },
    ab2str(buf) {
      return String.fromCharCode.apply(null, new Uint8ClampedArray(buf));
    },
    str2ab(str) {
      const buf = new ArrayBuffer(str.length); // 2 bytes for each char
      const bufView = new Uint8ClampedArray(buf);
      for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
    },
    sidebarHeightInit() {
      const sidebar = document.getElementById('widgetRightSide');
      sidebar.style.height = `${window.innerHeight}px`;
    },
    // there function name should be change
    isSystemCompatible() {
      if (virtualclass.error.length > 0) {
        const errorMsg = (virtualclass.error.length > 1) ? (virtualclass.error.join('<br />')) : virtualclass.error[0];
        virtualclass.view.createErrorMsg(errorMsg, 'errorContainer', 'virtualclassAppFooterPanel');

        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'errIE')) {
          virtualclass.vutil.disableVirtualClass();
        }

        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audIntDisable')) {
          virtualclass.user.control.mediaWidgetDisable();
        }

        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'errNotDesktop')) {
          virtualclass.user.control.mediaWidgetDisable();
          virtualclass.vutil.disableVirtualClass();
        }
      } else if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audIntDisable') || Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'vidIntDisable')) {
        virtualclass.user.control.mediaWidgetDisable();
      }
    },
    chkValueInLocalStorage(property) {
      if (localStorage.getItem(property) === null) {
        return false;
      }
      return localStorage[property];
    },

    setScreenInnerTagsWidth(currAppId) {
      const sId = currAppId;
      const screenShare = document.getElementById(sId);
      const screenShareWidth = screenShare.offsetWidth;
      const screenShareLocal = document.getElementById(`${sId}Local`);
      const screenShareLocalWidth = screenShareLocal.offsetWidth;
      const toBeLeft = screenShareWidth - screenShareLocalWidth;
      const screenShareLocalVideo = document.getElementById(`${sId}LocalVideo`);
      let screenShareLocalVideoWidth = screenShareLocalVideo.offsetWidth;
      screenShareLocalVideoWidth = screenShareLocalWidth - screenShareLocalVideoWidth;
    },

    makeActiveApp(app, prvTool) {
      if (app !== prvTool && typeof prvTool !== 'undefined') {
        prvTool += 'Tool';
        // document.getElementById(prvTool).className =
        // virtualclass.wb[virtualclass.gObj.currWb].utility.removeClassFromElement(prvTool, 'active');
        document.getElementById(prvTool).className = virtualclass.vutil.removeClassFromElement(prvTool, 'active');
      } else {
        // If there is remaining any active class on tool
        const appOptions = document.getElementsByClassName('appOptions');
        for (let i = 0; i < appOptions.length; i++) {
          if (appOptions[i].classList.contains('active')) {
            appOptions[i].classList.remove('active');
          }
        }
        // console.log('Whiteboard Tool class:- is ' + prvTool + ' with app ' + app);
      }
      document.getElementById(`${app}Tool`).className += ' active';
    },
    initInstallChromeExt(error) {
      if (error.name === 'EXTENSION_UNAVAILABLE') {
        // console.log('ask for inline installation');
        this._inlineChomeExtensionStore();
      }
    },

    _inlineChomeExtensionStore() {
      // alert('ss' + chrome);
      chrome.webstore.install('https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl',
        (arg) => {
          window.location.reload();
        },
        (e) => {
          alert(e);
        });
    },

    removeAppPanel() {
      const appPanel = document.getElementById('virtualclassOptionsCont');
      if (appPanel != null) {
        appPanel.parentNode.removeChild(appPanel);
      }
    },
    removeTempVideo(id) {
      const toBeRemove = document.getElementById(id);
      toBeRemove.parentNode.removeChild(toBeRemove);
    },
    createLocalTempVideo(mainCont, localTemp) {
      if (typeof mainCont === 'string' || typeof mainCont === 'String') {
        mainCont = document.getElementById(mainCont);
      }
      // var mainCont = document.getElementById(mcId);
      const locVidContTemp = virtualclass.vutil.createDOM('div', localTemp);
      const vidContTemp = virtualclass.vutil.createDOM('canvas', `${localTemp}Video`);
      locVidContTemp.appendChild(vidContTemp);
      mainCont.appendChild(locVidContTemp);
    },
    initLocCanvasCont(tempVideoId) {
      let app;
      if (virtualclass.currApp === 'ScreenShare') {
        app = 'ss';
      } else {
        app = 'wss';
      }

      virtualclass[app].localtempCanvas = document.getElementById(tempVideoId);
      // console.log(virtualclass[app].localtempCanvas);
      virtualclass[app].localtempCont = virtualclass[app].localtempCanvas.getContext('2d');
    },

    videoTeacher2Student(sid, notPutImage) {
      let app = sid;
      const id = `virtualclass${sid}LocalVideo`;

      const localVideo = document.getElementById(id);

      if (localVideo != null && localVideo.tagName === 'VIDEO') {
        //    alert('this would not performed');
        const stCanvas = document.createElement('canvas');
        stCanvas.id = localVideo.id;
        stCanvas.width = localVideo.offsetWidth;
        stCanvas.height = localVideo.offsetHeight;

        const tempVid = localVideo;
        localVideo.parentNode.replaceChild(stCanvas, localVideo);
        if (app === 'ScreenShare') {
          app = 'ss';
        }

        if (typeof notPutImage === 'undefined' && (typeof app !== 'undefined' && (app === 'ss' || app === 'wss'))) {
          virtualclass[app].localCanvas = stCanvas;
          virtualclass[app].localCont = virtualclass[app].localCanvas.getContext('2d');

          const imgData = virtualclass[app].localtempCont.getImageData(0, 0, virtualclass[app].localtempCanvas.width, virtualclass[app].localtempCanvas.height);
          virtualclass[app].localCont.putImageData(imgData, 0, 0);
        }
        virtualclass.vutil.removeTempVideo(`virtualclass${sid}LocalTemp`);
      }
    },
    clickOutSideCanvas() {
      if (this.exitTextWrapper()) {
        virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.textUtility(virtualclass.wb[virtualclass.gObj.currWb].gObj.spx, virtualclass.wb[virtualclass.gObj.currWb].gObj.spy);
      }
    },
    exitTextWrapper() {
      const textBoxContainer = document.getElementsByClassName('textBoxContainer');
      return textBoxContainer.length > 0;
    },
    attachClickOutSideCanvas() {
      _attachClickOutSideCanvas('commandToolsWrapper');
      _attachClickOutSideCanvas('virtualclassOptionsCont');
      _attachClickOutSideCanvas('audioWidget');
      _attachClickOutSideCanvas('chatWidget');

      function _attachClickOutSideCanvas(id) {
        const elem = document.getElementById(id);
        if (elem != null) {
          elem.onclick = function () {
            if (roles.hasControls()) {
              virtualclass.vutil.clickOutSideCanvas();
            }
          };
        }
      }
    },
    dimensionMatch(wbc, ssc) {
      const wbcWidth = document.getElementById(wbc).offsetWidth;
      const optionsContWidth = document.getElementById('virtualclassOptionsCont').offsetWidth;
      const sscElem = document.getElementById(ssc);
      if (sscElem != null) {
        const sscWidth = sscElem.offsetWidth + optionsContWidth;
        return (sscWidth === wbcWidth);
      }
      return false;
    },
    disableAppsBar() {
      const appBarCont = document.getElementById('virtualclassOptionsCont');
      if (appBarCont != null) {
        appBarCont.style.pointerEvents = 'none';
      }
    },
    // isMiniFileIncluded(src) {
    //   //                var filePatt = new RegExp(src+".js$");
    //   const filePatt = new RegExp(`${src}.js?=\*([0-9]*)`);
    // matched when src is mid of path, todo find it at end of path
    //   const scripts = document.getElementsByTagName('script');
    //   for (let i = 0; i < scripts.length; i++) {
    //     if (filePatt.test(scripts[i].src)) {
    //       return true;
    //     }
    //   }
    //   return false;
    // },

    isObjectEmpty(obj) {
      for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
      }

      return true;
    },
    removeSessionTool() {
      if (!roles.hasAdmin()) {
        const SessionEndTool = document.getElementById('virtualclassSessionEndTool');
        if (SessionEndTool != null) {
          SessionEndTool.parentNode.removeChild(SessionEndTool);
        }
      }
    },

    Fullscreen(event) {
      let elem;
      /* Making virtualclassCont is fullScreen, displays the background is black on virtualclassCont */
      // const elem = document.getElementById('virtualclassCont');
      if (event.target.id === 'askFullscreen') {
        elem = document.getElementById('virtualclassAppRightPanel');
      } else {
        elem = document.documentElement;
      }

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
      elem.classList.add('fullScreenMode');
    },

    closeFullscreen(event) {
      let elem;
      // const elem = document.getElementById('virtualclassCont');
      if (event.target.id === 'askExitFullscreen') {
        elem = document.getElementById('virtualclassAppRightPanel');
        virtualclass.gObj.ignoreFullScreen = true;
      } else {
        elem = document.documentElement;
      }
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      elem.classList.remove('fullScreenMode');
    },

    closedRightbar() {
      const elem = document.getElementById('virtualclassApp');
      elem.classList.remove('openRightbar');
      elem.classList.add('collapsedRightbar');
      chat_div.classList.add('collapsedRightbar');
      localStorage.setItem('hideRightbar', true);
      virtualclass.gObj.hideRightbar = localStorage.getItem('hideRightbar');
      if (roles.isStudent()) {
        ioAdapter.sendSpeed(3);
      }
      // const rightbarTabs = document.querySelector('#stickycontainer .chatBarTab');
      // for(var i =0 ; i < rightbarTabs.children.length ; i++) {
      //   rightbarTabs.children[i].classList.remove("active");
      // }
    },

    openRightbar() {
      localStorage.removeItem('hideRightbar');
      const elem = document.getElementById('virtualclassApp');
      localStorage.setItem('hideRightbar', false);
      virtualclass.gObj.hideRightbar = localStorage.getItem('hideRightbar');
      elem.classList.remove('collapsedRightba');
      elem.classList.add('openRightbar');
      chat_div.classList.remove('collapsedRightbar');
      if (roles.isStudent()) {
        if (virtualclass.system.device === 'desktop') {
          ioAdapter.sendSpeed(1);
        } else {
          const techVideo = document.querySelector('#techVideo.active');
          if (techVideo != null) {
            virtualclass.vutil.sendSpeedByMobile(1);
          }
        }
      }
    },

    // TODO
    /** *
     * Add class at body according to role
     */

    addClass(elemId, className) {
      const elem = document.getElementById(elemId);
      if (virtualclass.vutil.elemHasAnyClass(elemId)) {
        elem.classList.add(className);
      } else {
        elem.className = className;
      }
    },
    removeClass(id, className) {
      const elem = document.getElementById(id);

      if (virtualclass.vutil.elemHasAnyClass(id) && elem.classList.contains(className)) {
        elem.classList.remove(className);
      }
    },
    breakIntoBytes(val, l) {
      let numstring = val.toString();
      for (let i = numstring.length; i < l; i++) {
        numstring = `0${numstring}`;
      }
      return numstring.match(/[\S]{1,2}/g) || [];
    },
    numValidateFour(n1, n2, n3, n4) {
      n1 = this.preNumValidateTwo(n1);
      n2 = this.preNumValidateTwo(n2);
      n3 = this.preNumValidateTwo(n3);
      n4 = this.preNumValidateTwo(n4);
      const nres = n1 + n2 + n3 + n4;
      return parseInt(nres);
    },
    numValidateTwo(n1, n2) {
      n1 = this.preNumValidateTwo(n1);
      n2 = this.preNumValidateTwo(n2);
      const nres = n1 + n2;
      return parseInt(nres);
    },
    preNumValidateTwo(n) {
      const numstring = n.toString();
      if (numstring.length === 1) {
        return `0${numstring}`;
      } if (numstring.length === 2) {
        return numstring;
      }
    },
    elemHasAnyClass(elemId) {
      const elem = document.getElementById(elemId);
      if (elem != null) {
        return (typeof elem.classList !== 'undefined');
      }
      return false;
    },
    userIsOrginalTeacher(userId) {
      return roles.hasAdmin();
    },
    isUserTeacher(userId) {
      return roles.hasControls();
    },
    initDisableAudVid() {
      virtualclass.gObj.audIntDisable = true;
      virtualclass.gObj.vidIntDisable = true;
    },
    initDisableVirtualClass() {
      this.initDisableAudVid();
      virtualclass.gObj.errNotDesktop = true;
      virtualclass.gObj.errNotScreenShare = true;
      virtualclass.gObj.errAppBar = true;
    },
    disableVirtualClass() {
      const virtualClass = document.getElementById('virtualclassCont');
      virtualClass.style.opacity = 0.6;
      virtualClass.style.pointerEvents = 'none';
    },
    enableVirtualClass() {
      const virtualClass = document.getElementById('virtualclassCont');
      virtualClass.style.opacity = 1;
      virtualClass.style.pointerEvents = 'visible';
    },
    firstiOSaudioCall() {
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audioPlayMessage')) {
        // virtualclass.gObj.iosTabAudTrue = true;
        virtualclass.gObj.iosIpadbAudTrue = true;
        virtualclass.media.audio.receivedAudioProcess(virtualclass.gObj.audioPlayMessage);
      }
    },

    async beforeLoad() {
      if (virtualclass.isPlayMode) {
        // We need to clear everything when user first play-recoring and join the live class
        // console.log('==== Clear Session PlayMode');
        return;
      }

      if (roles.hasControls() && document.querySelector('#virtualclassAppRightPanel.vidShow') !== null) { // if teacher video is enabled
        ioAdapter.mustSend({ congCtr: { videoSwitch: 'off' }, cf: 'congController' });
      }
      if (virtualclass.gObj.prvRequestScreenUser && virtualclass.config.makeWebSocketReady) {
        ioAdapter.mustSendUser({ cancel: true, cf: 'reqscreen' }, virtualclass.gObj.prvRequestScreenUser);
      }

      // if (virtualclass.currApp === 'DocumentShare') {
      //   if (!roles.hasControls()) {
      //     const rhElem = document.querySelector('#virtualclassCont.congrea #icHr');
      //     const action = rhElem.getAttribute('data-action');
      //     if (action === 'disable') {
      //       const toUser = virtualclass.vutil.whoIsTeacher();
      //       ioAdapter.sendUser({
      //         data: {
      //           user: wbUser.id,
      //           action,
      //         },
      //         cf: 'raiseHand',
      //       }, toUser);
      //     }
      //   }
      //   io.disconnect();
      // }

      if (virtualclass.userInteractivity.rendererObj.noteEvent) {
        console.log('====> send note on page load');
        virtualclass.userInteractivity.handler(virtualclass.userInteractivity.rendererObj.noteEvent);
      }
      // console.log('====> BEFORE LOAD dts order ', virtualclass.orderList[virtualclass.dts.appName].ol.order);
      //
      // console.log("whiteboard --=-=-=- DISCONNECT IO");
      virtualclass.gObj.windowLoading = true;
      // If user does page refresh after session saved and does not start new session  by clicking on element
      // Then we need to clear the session on page refresh
      if (Object.prototype.hasOwnProperty.call(virtualclass.recorder, 'doSessionClear')) {
        virtualclass.clearSession();
        return;
      }
      // When user does clear history by browser feature, some data are storing
      // in that case we are not saving the data by clearing all storage data.

      if (localStorage.length === 0) {
        virtualclass.storage.clearStorageData();
        return;
      }
      // console.log('screen-detail init');

      //   // localStorage.setItem('totalStored', virtualclass.storage.totalStored);
      // localStorage.setItem('executedSerial', JSON.stringify(ioMissingPackets.executedSerial));
      // localStorage.setItem('executedUserSerial', JSON.stringify(ioMissingPackets.executedUserSerial));
      if (typeof virtualclass.gObj.audioEnable !== 'undefined') {
        // localStorage.setItem('audEnable', JSON.stringify({ ac: virtualclass.gObj.audioEnable }));
      }

      localStorage.removeItem('otherRole');

      // critical, this can be critical

      if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audIntDisable')) {
        virtualclass.media.audio.studentNotSpeak();
      }

      virtualclass.vutil.clickOutSideCanvas();
      // localStorage.setItem(wbUser.sid, JSON.stringify(virtualclass.chat.vmstorage));

      if (Object.prototype.hasOwnProperty.call(virtualclass, 'editorRich')) {
        if (typeof virtualclass.editorRich.vcAdapter === 'object') {
          virtualclass.editorRich.saveIntoLocalStorage();
        }
      }

      if (Object.prototype.hasOwnProperty.call(virtualclass, 'editorCode')) {
        if (typeof virtualclass.editorCode.vcAdapter === 'object') {
          virtualclass.editorCode.saveIntoLocalStorage();
        }
      }

      var prvAppObj = { name: virtualclass.vutil.capitalizeFirstLetter(virtualclass.currApp) };
      // console.log(virtualclass.currApp);
      if (virtualclass.currApp === 'ScreenShare') {
        prvAppObj.name = virtualclass.gObj.defaultApp; // not saving screen share but show Editor Rich default window
        const teacherId = virtualclass.vutil.whoIsTeacher();
        if (virtualclass.gObj.studentSSstatus.mesharing && roles.isStudent()) {
          // console.log('====> me sharing rmStdScreen');
          ioAdapter.mustSendUser({ cf: 'rmStdScreen' }, teacherId);
        } else if (roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing) {
          const currElem = document.querySelector('#virtualclassWhiteboard .canvasContainer.current');
          const wId = (currElem != null) ? currElem.dataset.wbId : '_doc_0_0';
          await ioAdapter.mustSend({ dispWhiteboard: true, cf: 'dispWhiteboard', d: wId });
          await ioAdapter.mustSend(({ unshareScreen: true, st: 'ss', cf: 'unshareScreen' }));
        }

        if ((roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing) || roles.hasControls()) {
          // console.log('screen-detail is saving into storage');
          // localStorage.setItem('studentSSstatus', JSON.stringify(virtualclass.gObj.studentSSstatus));
        }
      } else if ((virtualclass.currApp === 'Yts')) {
        if (typeof virtualclass.yts.videoId !== 'undefined' && typeof virtualclass.yts.player === 'object') {
          prvAppObj.metaData = {
            init: virtualclass.yts.videoId,
            startFrom: virtualclass.yts.player.getCurrentTime(),
          };
        }
      } else if ((virtualclass.currApp === 'SharePresentation')) {
        // virtualclass.sharePt.saveIntoLocalStorage();
        if (typeof virtualclass.sharePt !== 'undefined' && typeof virtualclass.sharePt === 'object' && virtualclass.sharePt.pptUrl) {
          // console.log(`beforeloadS${virtualclass.sharePt.pptUrl}`);
          prvAppObj.metaData = {
            init: virtualclass.sharePt.pptUrl,
            startFrom: virtualclass.sharePt.state,
            currId: virtualclass.sharePt.currId,
          };
          // console.log(`start From${virtualclass.sharePt.state}`);
          virtualclass.sharePt.saveIntoLocalStorage(prvAppObj);
        } else {
          prvAppObj.metaData = null; // if video is not started to share.
        }
      } else if (virtualclass.currApp === 'Poll') {
        // virtualclass.poll.saveInLocalStorage();
        // console.log('currAppPoll');
      } else if (virtualclass.currApp === 'Video') {
        if (virtualclass.videoUl.player) {
          var start = virtualclass.videoUl.player.currentTime();
        }

        prvAppObj.metaData = {
          init: {
            videoId: virtualclass.videoUl.videoId,
            videoUrl: virtualclass.videoUl.videoUrl,
            yts: virtualclass.videoUl.yts,
            online: virtualclass.videoUl.online,
            isPaused: virtualclass.videoUl.isPaused,
          },
          startFrom: start,
          isAutoplay: virtualclass.videoUl.autoPlayFlag,

        };
      } else if (virtualclass.currApp === 'DocumentShare') {
        // console.log(`previous app success ${virtualclass.currApp}`);
        if (Object.prototype.hasOwnProperty.call(virtualclass.dts.docs, 'currDoc')) {
          var { currDoc } = virtualclass.dts.docs;
          // console.log(`currentDocument ${currDoc}`);
          // console.dir('currDoc ' + virtualclass.dts.docs[virtualclass.dts.docs.currDoc]);
          //  var slideNumber = virtualclass.dts.docs.note.currNote;

          if (virtualclass.orderList['DocumentShare'].ol.order.length > 0) {
            prvAppObj.metaData = {
              init: currDoc,
              slideNumber: virtualclass.dts.docs.note.currNote,
              order: JSON.stringify(virtualclass.orderList['DocumentShare'].ol.order),
            };
          } else {
            var currDoc = 'layout';
            prvAppObj.metaData = {
              init: currDoc,
              slideNumber: null,
            };
          }
        } else {
          var currDoc = 'layout';
          prvAppObj.metaData = {
            init: currDoc,
            slideNumber: null,
          };
        }
        if (Object.keys(virtualclass.dts.pages).length > 0) {
          prvAppObj.metaData.docs = virtualclass.dts.pages;
        }
      } else if (virtualclass.currApp === 'Quiz') {
        // virtualclass.quiz.saveInLocalStorage();
        // console.log('quiz data saved');
      } else if (virtualclass.currApp === 'Whiteboard') {
        // var prvAppObj = {"name": "Whiteboard", "wbn": virtualclass.gObj.wbCount, "wbcs"  : virtualclass.gObj.currSlide};
        var prvAppObj = { name: 'Whiteboard', wbn: virtualclass.gObj.wbCount };
      }
      // if (virtualclass.gObj.wIds.length > 0) {
      //    localStorage.setItem('wIds', JSON.stringify(virtualclass.gObj.wIds));
      // }

      if (roles.hasControls()) {
        // localStorage.setItem('wbOrder', JSON.stringify(virtualclass.wbCommon.order));
      }

      if (virtualclass.zoom.canvasScale != null) {
        const canvasScale = (+virtualclass.zoom.canvasScale);
        // console.log(`Canvas pdf scale ${canvasScale}`);
        if (virtualclass.vutil.isNumeric(canvasScale)) {
          //   // localStorage.setItem('wbcScale', canvasScale);
        }
        if (Object.prototype.hasOwnProperty.call(virtualclass.zoom, 'canvasDimension')) {
          // localStorage.setItem('canvasDimension', JSON.stringify(virtualclass.zoom.canvasDimension));
        }
      }

      // not storing the YouTube status on student's storage
      // Not showing the youtube video is at student if current app is not youtube
      if (roles.hasView()) {
        if (virtualclass.currApp === 'Yts') {
          var prvAppObj = { name: 'Yts', metaData: null };
        }
      }

      /**
       * This object is storing for retain the data
       * while user refresh the page at other App(eg:- video)
       * rather than document sharing
       */

      if (!roles.hasControls()) {
        const elem = document.querySelector('#virtualclassCont.congrea #congAskQuestion.disable');
        if (elem) {
          elem.click();
        }
      }

      console.dir(`Previous object ${prvAppObj}`);

      // localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
      // TODO this should be enable and should test proper way
      // // localStorage.setItem('uRole', virtualclass.gObj.uRole);

      if (roles.hasControls()) {
        // localStorage.setItem('videoSwitch', virtualclass.videoHost.gObj.videoSwitch);
      } else {
        // localStorage.setItem('stdVideoSwitch', virtualclass.videoHost.gObj.stdStopSmallVid);
        // localStorage.setItem('allStdVideoOff', virtualclass.videoHost.gObj.allStdVideoOff);
      }
      // localStorage.setItem('chatWindow', virtualclass.chat.chatWindow);
      this.saveWbOrder();
      if (virtualclass.isPlayMode) {
        localStorage.clear();
      }
      if (virtualclass.currApp !== 'DocumentShare') {
        io.disconnect();
      }
    },

    initOnBeforeUnload(bname) {
      if (bname === 'iOS') {
        document.body.onunload = function () {
          virtualclass.vutil.beforeLoad();
        };
      } else {
        window.onbeforeunload = function () {
          const editor = virtualclass.vutil.smallizeFirstLetter(virtualclass.currApp);
          virtualclass.vutil.beforeLoad();

          if (editor === 'editorRich' || editor === 'editorCode') {
            const edState = virtualclass[editor].cmClient.state;
            // We with till editor is in Sync.
            // edState is an instance of constructor, to get the name of it
            if (edState.constructor.name !== 'Synchronized') {
              return virtualclass.lang.getString('editorinsync');
            }
          }
        };
      }
    },


    isPlayMode() { // TODO
      // apply codacy rule
      return (+window.wbUser.virtualclassPlay);
    },
    progressBar(totalVal, portion, pbar, pval) {
      if (portion > totalVal) {
        portion = totalVal;
        document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('playsessionmsg');
      }
      let totalProgress;
      if (totalVal === 0 && portion === 0) {
        totalProgress = 0;
      } else {
        totalProgress = Math.round((portion * 100) / totalVal);
      }

      document.getElementById(pbar).style.width = `${totalProgress}%`;
      document.getElementById(pval).innerHTML = `${totalProgress}%`;
    },
    hidePrevIcon(app) {
      // debugger;
      const prvScreen = document.getElementById(virtualclass.previous);
      if (prvScreen != null) {
        prvScreen.style.display = 'none';

        // console.log(`Hide previous screen with display new ${app}`);
        if (app === 'ss') {
          if (typeof virtualclass[app] === 'object') {
            document.getElementById(virtualclass[app].id).style.display = 'block';
          }
        } else {
          document.getElementById(virtualclass[app].id).style.display = 'block';
        }
      }
    },
    /**
     * Return the value of provided key of particular user from prvovided user list
     * @param users user list
     * @param key kew of which return value
     * @param userId the user
     */
    getUserInfo(key, userId, users) {
      if (users != null) {
        for (let i = 0; i < users.length; i++) {
          if ((+users[i].userid) === (+userId)) {
            return users[i][key];
          }
        }
      }
    },

    /** TODO this function should be merged with above function * */
    getUserAllInfo(userId, users) {
      if (typeof userId !== 'undefined' && typeof users !== 'undefined') {
        for (let i = 0; i < users.length; i++) {
          if ((+users[i].userid) === (+userId)) {
            return users[i];
          }
        }
        return false;
      }
      // console.log('Error user is not found');
      return false;
    },

    smallizeFirstLetter(string) {
      return string.charAt(0).toLowerCase() + string.slice(1);
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    // initDefaultInfo(role, appIs) {
    //   if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'audIntDisable') && !Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'vidIntDisable')) {
    //     setTimeout(
    //       () => {
    //         virtualclass.media.init();
    //       }, 500, // Let be ready every thing
    //     );
    //   }
    // },

    /**
     * Remove the given class name from givven element
     * @param prvTool
     * @param className
     * @returns {string}
     */
    removeClassFromElement(prvTool, className) {
      const prvToolElem = document.getElementById(prvTool);
      if (prvToolElem !== null && prvToolElem.classList.length > 0) { // If class list available only
        prvToolElem.classList.remove(className);
        return prvToolElem.className;
      }
    },
    /**
     * the operation before send message to server
     * @param {type} msg
     * @returns {undefined}
     */
    beforeSend(msg, toUser, notMust) {
      const wbId = virtualclass.gObj.currWb;
      // //debugger;
      // when we are in replay mode we don't need send the object to other user
      if (Object.prototype.hasOwnProperty.call(msg, 'createArrow')) {
        var jobj = JSON.stringify(msg);
        virtualclass.wb[wbId].vcan.optimize.sendPacketWithOptimization(jobj, 300);
      } else {
        if (Object.prototype.hasOwnProperty.call(msg, 'repObj')) { // For Whiteboard
          if (typeof (msg.repObj[msg.repObj.length - 1]) === 'undefined') {
            return;
          }
        //  virtualclass.wb[wbId].gObj.rcvdPackId = msg.repObj[msg.repObj.length - 1].uid;
          // virtualclass.wb[wbId].gObj.displayedObjId = virtualclass.wb[wbId].gObj.rcvdPackId;
          //            console.log('Last send data ' + virtualclass.wb[wbId].gObj.rcvdPackId);
        }

        var jobj = JSON.stringify(msg);

        if (typeof notMust !== 'undefined' && notMust === true) {
          if (typeof toUser === 'undefined' || toUser === false || toUser === null) {
            ioAdapter.send(msg);
          } else {
            ioAdapter.sendUser(msg, toUser);
          }
        } else if (typeof toUser === 'undefined' || toUser === false || toUser === null) {
          ioAdapter.mustSend(msg);
        } else {
          ioAdapter.mustSendUser(msg, toUser);
        }
      }
    },
    breakintobytes(val, l) {
      let numstring = val.toString();
      for (let i = numstring.length; i < l; i++) {
        numstring = `0${numstring}`;
      }
      const parts = numstring.match(/[\S]{1,2}/g) || [];
      return parts;
    },

    /**
     * this function does create the div
     * toolId expect id for command
     * text expects the text used for particular command
     * this whole output process should come by
     * html not javascript
     */
    createDiv(toolId, text, cmdToolsWrapper, cmdClass) {
      // console.log('class name ' + text);
      const toolName = text;
      const str = virtualclass.lang.getString(text);
      const ancTag = document.createElement('a');
      ancTag.href = '#';

      const lDiv = document.createElement('div');
      lDiv.id = toolId;
      if (typeof cmdClass !== 'undefined') {
        lDiv.className = cmdClass;
      }

      lDiv.dataset.tool = toolName;

      const iconButton = document.createElement('span');
      iconButton.className = `icon-${toolName}`;
      ancTag.appendChild(iconButton);
      ancTag.dataset.title = str;
      ancTag.className = 'tooltip';

      lDiv.appendChild(ancTag);
      if (toolId === 't_reclaim') {
        // var virtualclassCont = document.getElementById(virtualclass.html.id);

        const virtualclassCont = document.getElementById('virtualclassAppLeftPanel');

        cmdToolsWrapper.appendChild(lDiv);
        virtualclassCont.insertBefore(cmdToolsWrapper, virtualclassCont.firstChild);
      } else {
        cmdToolsWrapper.appendChild(lDiv);
      }
    },

    renderWhiteboardObjectsIfAny() {
      if (typeof virtualclass.wb === 'object') {
        if (virtualclass.wb[virtualclass.gObj.currWb].vcan.main.children.length > 0) {
          virtualclass.wb[virtualclass.gObj.currWb].vcan.renderAll();
        }
      }
    },

    createCommandWrapper(id) {
      const { vcan } = virtualclass.wb[id];
      const cmdToolsWrapper = document.createElement('div');
      cmdToolsWrapper.id = virtualclass.gObj.commandToolsWrapperId[id];
      cmdToolsWrapper.className = 'commandToolsWrapper';
      const canvasElem = document.getElementById(vcan.canvasWrapperId);
      if (canvasElem != null) {
        document.getElementById(`containerWb${id}`).insertBefore(cmdToolsWrapper, canvasElem);
      } else {
        document.getElementById(`containerWb${id}`).appendChild(cmdToolsWrapper);
      }
      return cmdToolsWrapper;
    },

    createRoleWrapper() {
      const cmdToolsWrapper = document.createElement('div');
      cmdToolsWrapper.id = 'commandToolsWrapper_doc_0_0';
      cmdToolsWrapper.className = 'commandToolsWrapper';
      return cmdToolsWrapper;
    },

    whoIsTeacher() {
      // TODO this function should call less frequently and may be called on member add function, status could be saved in a variable.

      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if (virtualclass.connectedUsers[i].role === 't') {
            return virtualclass.connectedUsers[i].userid;
          }
        }
      }
      return undefined;
    },


    getTeacherInstance() {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if (virtualclass.connectedUsers[i].role === 't') {
            return virtualclass.connectedUsers[i];
          }
        }
      }
      return 0;
    },

    getMySelf() {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if (virtualclass.connectedUsers[i].userid === virtualclass.gObj.uid) {
            return virtualclass.connectedUsers[i];
          }
        }
      }
    },
    enablePresentatorEditors(touser) {
      const msg = { toUser: touser, status: true };

      virtualclass.user.control.receivedEditorRich(msg);
      virtualclass.user.control.receivedEditorCode(msg);
    },
    getClassName(role) {
      let className;

      if (role === 't') {
        className = 'teacher';
      } else if (role === 'e') {
        className = 'educator';
      } else if (role === 's') {
        className = 'student';
      } else if (role === 'p') {
        className = 'presenter';
      }
      return className;
    },


    isPresenterExist() {
      for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
        if (virtualclass.connectedUsers[i].role === 'p') {
          return true;
        }
      }
      return false;
    },


    setReadModeWhenTeacherIsDisConn(eType) {
      if (!roles.hasAdmin()) {
        let teacherDisConn = localStorage.getItem('oTDisconn');
        if (teacherDisConn != null) {
          teacherDisConn = JSON.parse(teacherDisConn);
          if (teacherDisConn) { // If orginal teacher is disconnnected
            if (Object.prototype.hasOwnProperty.call(virtualclass, eType)) {
              if (typeof virtualclass[eType].cm === 'object') {
                virtualclass[eType].cm.setOption('readOnly', 'nocursor');
              } else {
                // console.log(`Editor CM is notvutil defined for editor ${eType}`);
              }
            } else {
              // console.log(`Editor type ${eType} is not ready.`);
            }
          } else {
            // console.log('Teacher is connected.');
          }
        }
      }
    },

    setReadModeWhenTeacherIsConn(eType) {
      localStorage.removeItem('oTDisconn');
      const writeModeElem = document.getElementById(`${virtualclass.vutil.capitalizeFirstLetter(eType)}writeModeBox`);
      if (writeModeElem != null) {
        const writeMode = writeModeElem.getAttribute('data-write-mode');
        if (writeMode === 'true') {
          virtualclass[eType].cm.setOption('readOnly', false);
        } else {
          virtualclass[eType].cm.setOption('readOnly', 'nocursor');
        }
      } else {
        // console.log(`Editor:- writemode element is not found for ${eType}`);
      }
    },


    isTeacherAlreadyExist(joinId) {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if ((virtualclass.connectedUsers[i].role === 't' || virtualclass.connectedUsers[i].role === 'e')
            && virtualclass.connectedUsers[i].userid !== joinId) {
            // console.log(`joni Id ${joinId}`);
            return true;
          }
        }
      }
      return false;
    },


    /**
     * Get presenter id otherwise false
     * @returns {*}
     */
    getPresenterId() {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if ((virtualclass.connectedUsers[i].role === 'p')) {
            return virtualclass.connectedUsers[i].userid;
            return true;
          }
        }
      }
      return false;
    },

    isEducatorAlreadyExist(joinId) {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if ((virtualclass.connectedUsers[i].role === 'e')
            && virtualclass.connectedUsers[i].userid !== joinId) {
            // console.log(`joniId ${joinId}`);
            return true;
          }
        }
      }
      return false;
    },

    isOrginalTeacherExist(joinId) {
      if (Object.prototype.hasOwnProperty.call(virtualclass, 'connectedUsers')) {
        for (let i = 0; i < virtualclass.connectedUsers.length; i++) {
          if ((virtualclass.connectedUsers[i].role === 't')
            && virtualclass.connectedUsers[i].userid !== joinId) {
            // console.log(`joniId ${joinId}`);
            return true;
          }
        }
      }
      return false;
    },

    /**
     * The widget for requset the Teacher Role
     */
    createBecomeTeacherWidget() {
      if (document.getElementById('beTeacher') == null) {
        const beTeacher = document.createElement('div');
        beTeacher.id = 'beTeacher';

        const beTeacherLink = document.createElement('a');
        beTeacherLink.id = `${beTeacher.id}Anchor`;
        beTeacherLink.innerHTML = virtualclass.lang.getString('becomeTeacher');
        beTeacher.appendChild(beTeacherLink);

        const virtualclassContElem = document.getElementById('virtualclassCont');
        virtualclassContElem.insertBefore(beTeacher, virtualclassContElem.firstChild);

        beTeacher.addEventListener('click', virtualclass.vutil.initTeacherRole);

        beTeacher.style.pointerEvents = 'none';
        beTeacher.style.opacity = '0.5';
        // For handle the case,  on where teacher refresh the page
        // TODO remove setTimeout
        setTimeout(
          () => {
            beTeacher.style.pointerEvents = 'visible';
            beTeacher.style.opacity = '1';
          }, 60000, // 60000
        );
      }
    },

    /**
     * Remove the teacher widget
     */
    removeBecomeTeacherWidget() {
      const becomeTeacherElem = document.getElementById('beTeacher');
      if (becomeTeacherElem != null) {
        becomeTeacherElem.parentNode.removeChild(becomeTeacherElem);
      }
    },


    /**
     * This function would be trigger when
     * user try to become teacher and send the become Teacher flag to
     * other participates for delete the button
     * and this teacher would join after the time set by virtualclass.gObj.mySetTime
     */


    initTeacherRole() {
      // debugger;
      ioAdapter.send({ cf: 'bt' }); // become teacher
      virtualclass.vutil.removeBecomeTeacherWidget(); // remove button from self window
      setTimeout(
        () => {
          if (!virtualclass.vutil.isOrginalTeacherExist(virtualclass.jId)) {
            virtualclass.vutil.overrideRoles('t');
            // localStorage.setItem('beTeacher', true);
            // console.log('connected teacher');
          } else {
            // console.log('Already connected teacher');
          }
          window.location.reload();
        }, virtualclass.gObj.mySetTime,
      );
    },


    overrideRoles(role) {
      virtualclass.uInfo.userobj.role = role;
      virtualclass.gObj.uRole = virtualclass.uInfo.userobj.role;
      wbUser.role = virtualclass.uInfo.userobj.role;
      const virtualclassCont = document.getElementById('virtualclassCont');
      virtualclass.vutil.overrideRolesFromElem(virtualclassCont, role);
    },

    /**
     * Override the class on elements according to given role
     * @param elem
     * @param role
     */

    overrideRolesFromElem(elem, role) {
      if (role === 's') {
        elem.classList.remove('teacher');
        elem.classList.remove('orginalTeacher');
        elem.classList.remove('presenter');
        elem.classList.remove('educator');
        virtualclassCont.classList.add('student');
        // this.synchEditorTools();
      } else if (role === 'p') {
        elem.classList.remove('teacher');
        elem.classList.remove('orginalTeacher');
        elem.classList.remove('educator');
        virtualclassCont.classList.add('student');
        virtualclassCont.classList.add('presenter');
      } else if (role === 'e') {
        // By removing the teacher class would hide
        // the audio icon from footer control on reload
        // elem.classList.remove('teacher');
        elem.classList.add('teacher');
        elem.classList.remove('student');
        elem.classList.remove('presenter');
        elem.classList.add('educator');
        elem.classList.add('orginalTeacher');
      } else if (role === 't') {
        elem.classList.remove('student');
        elem.classList.remove('educator');
        elem.classList.remove('presenter');
        elem.classList.add('teacher');
        elem.classList.add('orginalTeacher');
        // console.log('add Teacher');
      }
    },

    sesionEndMsgBoxIsExisting() {
      const sessionEndCont = document.getElementById('sessionEndMsgCont');
      return (sessionEndCont.hasAttribute('data-displaying') && sessionEndCont.dataset.displaying === 'true'); // do nothing if there is already sesion end box
    },

    removeVideoHostContainer() {
      const videoHostContainer = document.getElementById('videoHostContainer');
      if (videoHostContainer != null) {
        videoHostContainer.parentNode.removeChild(videoHostContainer);
      }
    },

    createDummyUser(usersLength) {
      if (usersLength) {
        usersLength = usersLength;
      } else {
        var usersLength = 5000;
      }

      let msg;
      let i = 0;
      let userId = 31;
      var createUser = setInterval(
        () => {
          if (i > usersLength) {
            clearInterval(createUser);
            return;
          }

          userId += i;
          msg = {
            joinUser: { key: userId },
            message: [{
              lname: ' ',
              name: `User${userId}`,
              role: 's',
              userid: userId,
            }],
            newuser: null,
            type: 'member_added',
            user: true,
          };
          i++;
          virtualclass.ioEventApi.readyto_member_add(msg);
        }, 1,
      );
    },

    // calculateChatHeight : function (){
    //     var topBarHeight = 100;
    //     var videoHeight = 240;
    //     //nirmala
    //     var other = 0;
    //     var chatHeight = 0;
    //
    //     var rightSidebarHeight = document.querySelector('#virtualclassCont');
    //     if(rightSidebarHeight != null){
    //         chatHeight = this.getVisibleHeightElem('#virtualclassCont') - (topBarHeight + videoHeight + other);
    //         console.log('Chat height ' + chatHeight);
    //         return chatHeight;
    //     }else{
    //         alert('There is no right side bar');
    //     }
    //
    // },

    /** TODO should be written pure javascript
     * To get the height of visible element
     * @param element expect the element to which calculate the height
     * @returns {number} return height
     */
    // removejquery
    getVisibleHeightElem(element) {
      const $el = $(element);
      const scrollTop = $(window).scrollTop();
      const scrollBot = scrollTop + $(window).height();
      const elTop = $el.offset().top;
      const elBottom = elTop + $el.outerHeight();
      const visibleTop = elTop < scrollTop ? scrollTop : elTop;
      const visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
      return (visibleBottom - visibleTop);
    },

    applyHeight(elem) {
      const rightPanel = document.getElementById('virtualclassAppRightPanel');
      const rightPanelHeight = this.getVisibleHeightElem('virtualclassCont');
      rightPanel.style.height = (rightPanelHeight != null) ? rightPanelHeight : window.innerHeight;
    },

    insertIntoLeftBar(tobeInsert) {
      const element = document.querySelector('#virtualclassApp #virtualclassAppLeftPanel');
      if (element != null) {
        element.appendChild(tobeInsert);
      } else {
        alert('Error:- There is no Element to insert it.');
      }
    },

    getWhiteboardId(elem) {
      const docElem = elem.closest('.vcanvas');
      if (docElem != null) {
        return docElem.dataset.wbId;
      }
      alert('doc element is null');
    },

    getElementOffset(element) {
      // console.log(element.id + " should second ");
      // TODO : need to fix this method
      let valueT = 0; let
        valueL = 0;
      do {
        valueT += element.offsetTop || 0;
        valueL += element.offsetLeft || 0;
        element = element.offsetParent;
      }
      while (element);
      return ({ x: valueL, y: valueT });
    },

    updateCurrentDoc(slide) {
      virtualclass.gObj.currWb = `_doc_${slide}_${slide}`;
    },

    getParentTag(element, selector) {
      return element.closest(selector);
    },


    attachEventToUploadTab(type, elemArr, cb) {
      const btn = document.getElementById('newDocBtn');
      if (btn != null) {
        btn.removeEventListener('click', virtualclass.vutil._attachEventToUploadTab);
        btn.addEventListener('click', virtualclass.vutil._attachEventToUploadTab);
      }
    },

    _attachEventToUploadTab() {
      const element = document.querySelector('#DocumentShareDashboard .qq-upload-button-selector.qq-upload-button input');
      if (element != null) {
        element.click(); // This function triggers funtion attached on fine-uploader 'Upoad button'
        const msz = document.querySelector('#DocumentShareDashboard .qq-upload-list-selector.qq-upload-list');
        if (msz) {
          msz.style.display = 'block';
        }
      } else {
        alert('Element is null');
      }
    },
    attachEventToUpload(type, elemArr, cb) {
      const btn = document.getElementById('uploadVideo');
      if (btn != null) {
        btn.addEventListener('click', () => {
          const element = document.querySelector('#VideoDashboard .qq-upload-button-selector.qq-upload-button input');
          if (element != null) {
            element.click(); // This function triggers funtion attached on fine-uploader 'Upoad button'
          } else {
            alert('Element is null');
          }
        });
      }
    },

    modalPopup(type, elemArr) {
      const upload = {};
      if (type === 'video') {
        const currPlayed = document.querySelector('#listvideo .playing');
        if (currPlayed) {
          const id = currPlayed.getAttribute('data-rid');
          this.currPlaying = id;
        }
        upload.validation = ['mp4', 'avi', 'wmv', 'mov', 'webm', 'mkv', 'vob', 'mpeg'];
        upload.cb = virtualclass.videoUl.afterUploadVideo;
        upload.cthis = 'video';
        upload.maxSize = 512 * 1000 * 1000; // 512 mb
        // upload.requesteEndPoint = window.webapi + "&methodname=file_save&user="+virtualclass.gObj.uid;
        upload.requesteEndPoint = `${window.webapi}&methodname=file_save&live_class_id=${virtualclass.gObj.congCourse}&status=1&content_type_id=2&user=${virtualclass.gObj.uid}`;
      } else {
        upload.validation = ['doc', 'docx', 'txt', 'html', 'csv', 'pdf', 'ppt', 'pptx', 'xls', 'xlsx', 'xlt', 'png', 'jpg', 'gif', 'svg', 'tiff', 'rtf', 'xpm'];
        upload.cb = virtualclass.dts.onAjaxResponse;
        upload.cthis = 'docs';
        upload.maxSize = 100 * 1000 * 1000; // 100MB
        // upload.requesteEndPoint = window.webapi + "&methodname=congrea_image_converter&user="+virtualclass.gObj.uid;
        upload.requesteEndPoint = `${window.webapi}&methodname=congrea_image_converter&live_class_id=${virtualclass.gObj.congCourse}&status=1&content_type_id=1&user=${virtualclass.gObj.uid}`;
      }

      upload.multiple = false;

      //  virtualclass.fineUploader.generateModal(type, elemArr)
      // virtualclass.fineUploader.initModal(type);
      upload.wrapper = document.getElementById(elemArr[0]);


      // upload.requesteEndPoint = "https://local.vidya.io/congrea_te_online/example/upload.php";

      virtualclass.fineUploader.uploaderFn(upload);

      if (type !== 'video') {
        const cont = document.querySelector('#DocumentShareDashboard #docsUploadMsz');
        const upMsz = document.createElement('div');
        if (cont) {
          cont.appendChild(upMsz);
        }
      }
    },

    async xhrSendWithForm(data, methodname) {
      const formData = new FormData();
      let path;
      for (const key in data) {
        formData.append(key, data[key]);
      }
      if (typeof methodname === 'undefined') {
        path = window.webapi;
      } else {
        path = `${window.webapi}&methodname=${methodname}&user=${virtualclass.gObj.uid}`;
      }

      return await this.vxhr.post(path, formData);
    },

    createSaveButton() {
      const saveButton = document.createElement('div');
      saveButton.id = 'tech_support_save';

      const span = document.createElement('span');
      span.innerHTML = 'Save Session';
      saveButton.appendChild(span);
      return saveButton;
    },


    setChatContHeight(height) {
      return;
      $('#chatWidget').height(height);
      this.setChatHeight(height);
    },
    // removejquery
    setChatHeight(height) {
      return;
      let chatHeight;
      chatHeight = height - 40;
      if (virtualclass.isPlayMode) {
        chatHeight = height + 64;
      }
      $('#chat_div').height(chatHeight);
    },

    alreadyConnected(userId) {
      if (virtualclass.connectedUsers.length > 0) {
        const result = virtualclass.connectedUsers.filter(obj => obj.userid == userId);
        return (result.length > 0);
      }
      return false;
    },

    miliSecondsToFormatedTime(milliseconds) {
      const seconds = Math.floor((milliseconds / 1000) % 60);
      const minutes = Math.floor(((milliseconds / (1000 * 60)) % 60));
      const hours = Math.floor(((milliseconds / (1000 * 60 * 60)) % 24));
      return [hours, minutes, seconds];
    },

    localToUTC() {
      const date = new Date();
      const nowUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
      return new Date(nowUtc);
    },

    UTCtoLocalTimeToSeconds(time) {
      return new Date(time).getTime();
    },

    appIsForEducator(app) {
      for (const i in virtualclass.apps) {
        if (virtualclass.apps[i] === app) {
          return false;
        }
      }
      return true;
    },

    getDocsDashBoard(app) {
      const dashboardTemp = virtualclass.getTemplate('dashboard', 'documentSharing');
      const context = { app, hasControls: roles.hasControls() };
      return dashboardTemp(context);
      // return "<div class='dbContainer' data-app='"+app+"'>"+app+"</div>";
    },
    getPptDashBoard(app) {
      const dashboardTemp = virtualclass.getTemplate('dashboard', 'ppt');
      const context = { app, hasControls: roles.hasControls() };
      return dashboardTemp(context);
      // return "<div class='dbContainer' data-app='"+app+"'>"+app+"</div>";
    },

    removeDashboardNav() {
      const dashboardnav = document.querySelector('#dashboardnav');
      if (dashboardnav != null) {
        dashboardnav.parentNode.removeChild(dashboardnav);
      }
    },

    makeElementDeactive(selector) {
      // console.log(`drag drop Deactive element ${selector}`);
      const element = document.querySelector(selector);
      if (element != null) {
        element.style.pointerEvents = 'none';
      }
    },

    makeElementActive(selector) {
      // console.log(`drag drop Active element ${selector}`);
      const element = document.querySelector(selector);
      if (element != null) {
        element.style.pointerEvents = 'visible';
      }
    },

    initCommonSortingChat() {
      setTimeout(
        () => {
          sortCommonChat();
        }, 800,
      );
    },

    triggerDashboard(currApp, hidepopup) {
      if (currApp === 'DocumentShare') {
        const currentNote = document.querySelector('#screen-docs .note.current');
        if (currentNote == null) {
          hidepopup ? virtualclass.dashboard.init(currApp, hidepopup) : virtualclass.dashboard.init(currApp);
        }
      } else if (currApp === 'Video') {
        hidepopup ? virtualclass.dashboard.init(currApp, hidepopup) : virtualclass.dashboard.init(currApp);
      } else {
        virtualclass.dashboard.init(currApp);
      }
    },

    trimExtension(fname) {
      return fname.replace(/\.[^/.]+$/, '');
    },

    hideUploadMsg(appId) {
      const elem = document.querySelector(`#${appId} .qq-uploader-selector.qq-uploader.qq-gallery`);
      if (elem != null) {
        elem.setAttribute('qq-drop-area-text', '');
      }
    },

    showUploadMsg(appId) {
      const elem = document.querySelector(`#${appId} .qq-uploader-selector.qq-uploader.qq-gallery`);
      if (elem != null) {
        elem.setAttribute('qq-drop-area-text', virtualclass.lang.getString('dropfilehere'));
      }
    },

    /** Enable or Disable the Audio * */
    audioStatus(tag, status) {
      const anchor = tag.getElementsByClassName('congtooltip')[0];
      if (status === 'true') {
        tag.setAttribute('data-audio-playing', 'true');
        anchor.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
        tag.className = 'audioTool active';
      } else {
        tag.setAttribute('data-audio-playing', 'false');
        if (anchor) {
          anchor.setAttribute('data-title', virtualclass.lang.getString('audioDisable'));
        }
        tag.className = 'audioTool deactive';
      }
    },


    selfVideoStatus() {
      const svid = document.querySelector('.congrea .videoSwitchCont #videoSwitch');
      if (svid.classList.contains('off')) {
        return 'off';
      } if (svid.classList.contains('on')) {
        return 'on';
      }
    },

    videoController() {
      const ctr = document.querySelector('.congrea .videoSwitchCont');
      if (ctr) {
        ctr.addEventListener('click', () => {
          virtualclass.vutil.videoHandler((virtualclass.vutil.selfVideoStatus() === 'off') ? 'on' : 'off');
        });
      }
    },

    videoHandler(action, notSend) {
      let video;
      let tooltip;
      const sw = document.querySelector('.congrea .videoSwitchCont #videoSwitch');
      // Action on means video is On or off means video is off

      if (action === 'on') {
        sw.classList.remove('off');
        sw.classList.add('on');

        video = 'on';
        tooltip = document.querySelector('.videoSwitchCont');
        tooltip.dataset.title = 'Video off';
        if (roles.hasControls()) {
          virtualclass.videoHost.gObj.videoSwitch = 1;
          // console.log('videoswitch 1');
        } else {
          virtualclass.videoHost.gObj.stdStopSmallVid = false;
        }

        // var hasImg = document.querySelector("#ml"+virtualclass.gObj.uid+" .user-details a span")
        // ||document.querySelector("#ml"+virtualclass.gObj.uid+" .user-details a img")

        const hasImg = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid} .user-details a span`) || chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid} .user-details a img`);

        if (hasImg) {
          virtualclass.videoHost.removeUserIcon(virtualclass.gObj.uid);
        } else {
          virtualclass.gObj.delayVid = 'hide';
        }

        if (roles.hasControls()) {
          virtualclass.videoHost.UI.displayTeacherVideo();
        }

        const mysmallVideo = document.querySelector(`#ml${virtualclass.gObj.uid} video`);
        if (mysmallVideo != null) {
          // mysmallVideo.srcObject.getVideoTracks()[0].stop();
          // TODO remove setTimeout
          setTimeout(
            () => {
              mysmallVideo.srcObject = virtualclass.media.stream;
            }, 100,
          );
        }
      } else if (action === 'off') {
        sw.classList.remove('on');
        sw.classList.add('off');
        // virtualclass.videoHost.gObj.videoSwitch = 0;
        video = 'off';
        tooltip = document.querySelector('.videoSwitchCont');
        tooltip.dataset.title = 'Video on';
        if (virtualclass.videoHost) {
          if (roles.hasControls()) {
            virtualclass.videoHost.gObj.videoSwitch = 0;
          } else {
            virtualclass.videoHost.gObj.stdStopSmallVid = true;
          }
        }


        const hasVideo = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.uid} .user-details a .videoWrapper`);

        if (hasVideo) {
          virtualclass.videoHost.setUserIcon(virtualclass.gObj.uid);
        } else {
          virtualclass.gObj.delayVid = 'display';
        }

        if (roles.hasControls()) {
          virtualclass.videoHost.UI.hideTeacherVideo();
        }
      }

      if (typeof notSend === 'undefined') {
        if (virtualclass.gObj.meetingMode) {
          const vaction = action !== 'off';
          virtualclass.multiVideo.setVideoStatus(vaction);
        } else if (virtualclass.gObj.uid === virtualclass.vutil.whoIsTeacher()) {
          ioAdapter.mustSend({ congCtr: { videoSwitch: video }, cf: 'congController' });
        }

        if (!roles.hasControls()) {
          ioAdapter.mustSend({
            stdVideoCtr: { videoSwitch: virtualclass.videoHost.gObj.stdStopSmallVid },
            cf: 'stdVideoCtrl',
          });
        }
      }
    },

    isChromeExtension() {
      window.postMessage({ type: 'isInstalled', id: 1 }, '*');
      // console.log('Chrome Extension:- Check');
      // setTimeout(
      //     function (){
      //         if(!virtualclass.gObj.chromeExt){
      //             virtualclass.gObj.chromeExt = true;
      //         }
      //     },
      //     1500
      // );

      window.addEventListener('message', (event) => {
        if (event.data.type === 'yes') {
          virtualclass.gObj.chromeExt = true;
        }
        // console.log('Chrome Extension:- is available');
      });
    },

    setWidth(wbId, canvas, width) {
      const canvasElem = document.querySelector(`#canvas${wbId}`);
      canvasElem.width = width;
    },

    setHeight(wbId, canvas, height) {
      const canvasElem = document.querySelector(`#canvas${wbId}`);
      canvasElem.height = height;
      // virtualclass.wb[wbId].vcan.renderAll();
    },

    getWidth(canvas) {
      return canvas.width;
    },

    getHeight(canvas) {
      return canvas.height;
    },

    getValueWithoutPixel(pxValue) {
      return parseInt(pxValue, 10);
    },

    removeDecimal(number) {
      return number.toFixed(2);
    },


    getElemM(wrapper, type) {
      let res;
      if (type === 'Y') {
        res = document.querySelector(`#${wrapper}`).offsetHeight;
      } else if (type === 'X') {
        res = document.querySelector(`#${wrapper}`).offsetWidth;
      }
      return this.getValueWithoutPixel(res);
    },

    getElemM2(wrapper, type) {
      let res;
      if (type === 'Y') {
        res = document.querySelector(`#${wrapper}`).offsetHeight;
      } else if (type === 'X') {
        res = document.querySelector(`#${wrapper}`).offsetWidth;
      }
      return this.getValueWithoutPixel(res);
    },

    getElemHeight(wrapper) {
      const heighPx = document.querySelector(`#${wrapper}`).offsetHeight;
      return this.getValueWithoutPixel(heighPx);
    },

    getElemWidth(wrapper) {
      const widthPx = document.querySelector(`#${wrapper}`).offsetWidth;
      return this.getValueWithoutPixel(widthPx);
    },

    visibleElementHeighOldt(innerElem, wrapper) {
      let offset = 0;
      let node = document.getElementById(innerElem);
      while (node.offsetParent && node.offsetParent.id !== wrapper) {
        offset += node.offsetTop;
        node = node.offsetParent;
      }
      const visible = node.offsetHeight - offset;
      return visible;
    },

    elementIsVisible2(el) {
      const elemTop = el.getBoundingClientRect().top;
      const elemBottom = el.getBoundingClientRect().bottom;

      // Only completely visible elements return true:
      const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
      // Partially visible elements return true:
      // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
      return isVisible;
    },

    elementIsVisible(elm) {
      const rect = elm.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
    },

    getVisibleHeight(el) {
      // TODO this should be convert into pute javascript
      const $el = $(`#${el}`);
      const scrollTop = $(window).scrollTop();
      const scrollBot = scrollTop + $(window).height();
      const elTop = $el.offset().top;
      const elBottom = elTop + $el.outerHeight();
      const visibleTop = elTop < scrollTop ? scrollTop : elTop;
      const visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
      return (visibleBottom - visibleTop);
    },

    isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    setContainerDimension(width, height) {

    },

    setDefaultScroll() {
      if (roles.hasControls() && (virtualclass.currApp === 'Whiteboard' || virtualclass.currApp === 'DocumentShare')) {
        const wb = virtualclass.gObj.currWb;
        if (wb != null && typeof virtualclass.pdfRender[wb] === 'object'
          && virtualclass.pdfRender[wb].canvasWrapper != null) {
          // Defualt scroll trigger
          virtualclass.pdfRender[wb].canvasWrapper.scrollTop = 1;
        }
      }
    },

    createWhiteBoard(wId, position) {
      // virtualclass.appInitiator.Whiteboard.call(virtualclass, { app: 'Whiteboard', cusEvent: 'byclick', data: wId });
      virtualclass.appInitiator.Whiteboard.call(virtualclass, {
        app: virtualclass.currApp, cusEvent: 'byclick', data: wId, position,
      });
    },

    createHashString(str) {
      let res = 0;
      const len = str.length;
      for (let i = 0; i < len; i++) {
        res = res * 31 + str.charCodeAt(i);
        res &= res;
      }
      return res;
    },

    randomString(length) {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
      return result;
    },

    isBulkDataFetched() {
      return (virtualclass.serverData.rawData.video.length > 0
      || virtualclass.serverData.rawData.docs.length > 0
      || virtualclass.serverData.rawData.ppt.length > 0);
    },

    sendOrder(type, order) {
      let appName;
      if (type === 'vid') {
        appName = 'Video';
      } else if (type === 'docs') {
        appName = 'DocumentShare';
      } else if (type === 'presentation') {
        appName = 'SharePresentation';
      } else {
        appName = virtualclass.currApp;
      }
      virtualclass.orderList[appName].ol.order = order;
      if (virtualclass.config.makeWebSocketReady) {
        const data = { order: JSON.stringify(virtualclass.orderList)};
        const url = virtualclass.api.UpdateRoomMetaData;
        virtualclass.xhrn.vxhrn.post(url, data).then((res) => {
          console.log(res);
        });
      }
    },

    saveWbOrder(order) {
      if (order) {
        // localStorage.setItem('wbOrder', JSON.stringify(virtualclass.wbCommon.order));
      }
    },

    requestOrder(cb) {
      if (virtualclass.config.makeWebSocketReady) {
        const url = virtualclass.api.GetRoomMetaData;
        virtualclass.xhrn.vxhrn.post(url, { noting: true }).then((response) => {
          if (response.data.Item != null && response.data.Item.order.S) {
            if (virtualclass.vutil.IsJsonString(response.data.Item.order.S)) {
              const responseData = JSON.parse(response.data.Item.order.S);
              // virtualclass.gObj.allOrder = responseData;
              for (const key in responseData) {
                if (key === 'SharePresentation' || key === 'DocumentShare' || key === 'Video') {
                  if (typeof virtualclass.orderList[key] !== 'object') {
                    virtualclass.orderList[key] = new OrderedList();
                  }
                  virtualclass.orderList[key].ol = responseData[key].ol;
                }
              }
              cb('ok');
              // cb(responseData[apptype]);
              // virtualclass.gObj.docOrder = responseData;
            }
          }
        });
      }
    },

    IsJsonString(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    removeChildrens(selector) {
      // selector = selector + ' .qq-upload-list-selector.qq-upload-list li';
      // console.log(`children selector ${selector}`);
      const uploadLists = document.querySelectorAll(selector);
      for (let i = 0; i < uploadLists.length; i++) {
        uploadLists[i].parentNode.removeChild(uploadLists[i]);
      }
    },


    initAcitveElement() {
      let activeElem;
      let deactiveElem;
      if (virtualclass.currApp === 'Video') {
        activeElem = '#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery';
        deactiveElem = '#listvideo';
      } else if (virtualclass.currApp === 'DocumentShare') {
        activeElem = '#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery';
        deactiveElem = '#listdocs';
      }

      const elem = document.querySelector(`#${virtualclass.currApp}Dashboard`);
      if (elem != null && !elem.classList.contains('uploading')) {
        virtualclass.vutil.makeElementActive(activeElem);
        virtualclass.vutil.makeElementDeactive(deactiveElem);
      } else {
        virtualclass.vutil.makeElementDeactive(activeElem);
      }
    },

    isResponseAvailable(reponse) {
      return (reponse != null && typeof reponse !== 'undefined' && reponse != null);
    },

    navWhiteboard(cthis, func, dthis) {
      if (virtualclass.vutil.isTextWrapperExist()) {
        virtualclass.wb[virtualclass.gObj.currWb].obj.drawTextObj.finalizeTextIfAny(undefined, virtualclass.gObj.currWb);
      }
      // virtualclass.userInteractivity.makeReadyContext();

      if (typeof dthis !== 'undefined') {
        func.call(cthis, dthis);
      } else {
        func.call(cthis);
      }
    },

    removeAllTextWrapper() {
      const allTextWrapper = document.querySelectorAll('.canvasWrapper .textBoxContainer');
      for (let i = 0; i < allTextWrapper.length; i++) {
        allTextWrapper[i].parentNode.removeChild(allTextWrapper[i]);
      }
    },

    isDashboardOpened(navButton) {
      const navButtonElem = document.querySelector('#dashboardnav button');
      return (navButtonElem != null && navButtonElem.classList.contains('clicked'));
    },

    stopConnection() {
      if (io.webSocketConnected()) {
        // io.sock.close();
        io.disconnect();
      }
      virtualclass.gObj.invalidlogin = true;
    },

    initDefaultApp: () => {
      const defaultApp = document.querySelector(`#virtualclass${virtualclass.gObj.defaultApp}Tool a`);
      if (defaultApp != null) {
        defaultApp.click(defaultApp);
      }
    },

    /** Indicates the sign who(student) is screen sharing * */
    initssSharing: (uid) => {
      virtualclass.gObj.whoIsSharing = uid;
      // var elem = document.getElementById(uid + 'contrstdscreenImg');
      const elem = chatContainerEvent.elementFromShadowDom(`#ml${uid} .icon-stdscreenImg`);
      if (elem != null) {
        elem.setAttribute('data-dcolor', 'green');
      }
    },

    /** Remove the sign from the student that who was screen sharing * */
    removeSSsharing: () => {
      const controleCont = document.querySelector('#chat_div .controleCont.ssSharing');
      if (controleCont != null) {
        controleCont.classList.remove('ssSharing');
      }
      delete virtualclass.gObj.whoIsSharing;
      virtualclass.vutil.removeStudenScreenStatus();
    },

    /** Inoforming to the teacher that I am sharing the screen * */
    informIamSharing: () => {
      const teacher = virtualclass.vutil.whoIsTeacher();
      if (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing) {
        ioAdapter.mustSendUser({
          cf: 'sshare_user',
        }, teacher);
      }
    },

    resizeWindowIfBigger() {
      const { currWb } = virtualclass.gObj;
      const canvasWrapper = document.querySelector(`#canvasWrapper${currWb}`);
      if (canvasWrapper != null) {
        const diff = window.innerWidth - (canvasWrapper.offsetWidth + 320);
        if (diff > 60) {
          // console.log('Resize event is triggered');
          system.initResize();
        }
      }
    },

    isTextWrapperExist() {
      return (document.querySelectorAll('.canvasWrapper .textBoxContainer').length > 0);
    },

    // insertAppLayout : function (html){
    //     $('#virtualclassAppContainer').append(containerhtml);
    // }

    insertAppLayout: (html) => {
      const appContainer = document.querySelector('#virtualclassAppContainer');
      // appContainer.insertAdjacentHTML('beforeend',html)
      $('#virtualclassAppContainer').append(html);
    },

    prechkScrnShare() {
      const virtualclassPreCheck = document.getElementById('preCheckcontainer');
      virtualclassPreCheck.style.display = 'none';
      const virtualclassApp = document.getElementById('virtualclassApp');
      virtualclassApp.style.display = 'flex';

      if (localStorage.getItem('precheck')) {
        virtualclass.videoHost._resetPrecheck();
      } else {
        /* TODO, this need to verify, it's using or not  * */
        virtualclass.popup.waitMsg();
        virtualclass.makeReadySocket();
        // localStorage.setItem('precheck', true);
        virtualclass.videoHost.afterSessionJoin();
      }
      virtualclass.gObj.precheckScrn = false;
    },

    showFinishBtn() {
      const btn = document.querySelector('.congrea #dashboardContainer .modal-header button');
      if (btn) {
        btn.classList.add('enable');
      }

      if (virtualclass.currApp === 'DocumentShare') {
        const virtualclassContainer = document.querySelector('#virtualclassAppLeftPanel');
        virtualclassContainer.classList.add('showZoom');
        virtualclassContainer.classList.remove('hideZoom');
      }
    },

    removeFinishBtn() {
      const btn = document.querySelector('.congrea.teacher  #dashboardContainer .modal-header button.enable');
      if (btn) {
        btn.classList.remove('enable');
      }
      if (virtualclass.currApp === 'DocumentShare') {
        const virtualclassContainer = document.querySelector('#virtualclassAppLeftPanel');
        virtualclassContainer.classList.add('hideZoom');
        virtualclassContainer.classList.remove('showZoom');
      }
    },

    addNoteClass() {
      if (roles.isStudent()) {
        const docScreenContainer = document.querySelector('#docScreenContainer');
        if (docScreenContainer != null) {
          docScreenContainer.classList.add('noteDisplay');
          // console.log('add note display');
        }
      }
    },

    calcBrightness(color) {
      const rgb = chroma(color).rgb();
      const c = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
      const brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
      // console.log(`brightne${brightness}`);
      // alert(brightness);
      return brightness;
    },

    removeStudenScreenStatus() {
      // console.log('Remove screen share icon color');
      const allStdscreenImg = chatContainerEvent.elementFromShadowDom('.stdscreenImg', 'all');
      for (let i = 0; i < allStdscreenImg.length; i++) {
        allStdscreenImg[i].dataset.dcolor = '';
      }
    },

    insertAfter(newNode, afterNode) {
      afterNode.parentNode.insertBefore(newNode, afterNode.nextSibling);
    },

    triggerMouseEvent(node, eventType) {
      if (node != null) {
        const clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
      }
    },

    getCookie(name) {
      function escape(s) {
        return s.replace(/([.*+?\^${}()|\[\]\/\\])/g, '\\$1');
      }
      const match = document.cookie.match(RegExp(`(?:^|;\\s*)${escape(name)}=([^;]*)`));
      return match ? match[1] : null;
    },

    sendCurrAppOnUserJoin() {
      return; // TODO remove this gracefully
      if (typeof virtualclass.wb === 'object' && virtualclass.currApp === 'Whiteboard') {
        const objs = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.replayObjs;
        if (objs.length > 0) {
          ioAdapter.sendWithDelayAndDrop({ repObj: objs, cf: 'repObj' }, null, 'mustSend', 'repObj', 1500);
          // virtualclass.vutil.beforeSend({'repObj': objs, 'cf': 'repObj'});
        } else {
          // console.log('Could not send the whiteboard data');
        }
      }
    },

    setCurrApp(container, app) {
      container.dataset.currapp = app;
      // console.log(`Data set curr app ${app}`);
      const chat_div = document.getElementById('chat_div');
      if (chat_div != null) {
        chat_div.dataset.currapp = app;
      }
    },

    selfJoin(jId) {
      if (jId === virtualclass.gObj.uid) {
        // The speed needs to send only when self joining
        ioAdapter.sendSpeed(virtualclass.videoHost.gObj.MYSPEED);
        return true;
      }
      return false;
    },

    getUrlVars(url) {
      const vars = []; let
        hash;
      const hashes = url.slice(url.indexOf('?') + 1).split('&');
      for (let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },

    clearSyncTimeInterval() {
      if (Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'syncTimeInterval')) {
        clearInterval(virtualclass.videoUl.syncTimeInterval);
      }
    },

    pageVisible() {
      let stateKey; let eventKey; const
        keys = {
          hidden: 'visibilitychange',
          webkitHidden: 'webkitvisibilitychange',
          mozHidden: 'mozvisibilitychange',
          msHidden: 'msvisibilitychange',
        };
      for (stateKey in keys) {
        if (stateKey in document) {
          eventKey = keys[stateKey];
          break;
        }
      }
      return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
      };
    },

    showZoom() {
      const zoom = document.querySelector('#virtualclassAppLeftPanel.hideZoom');
      if (zoom) {
        zoom.classList.remove('hideZoom');
        zoom.classList.add('showZoom');
      }
    },

    removeBackgroundVideoApp() {
      virtualclass.videoUl.videoId = '';
      const frame = document.getElementById('dispVideo_Youtube_api');
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*',
        );
      }

      const dispVideo = document.querySelector('.congrea #dispVideo');
      if (dispVideo) {
        dispVideo.style.display = 'none';
        const video = document.querySelector('.congrea #dispVideo video');
        if (video) {
          video.setAttribute('src', '');
        }
      }
      const currPlaying = document.querySelector('#listvideo .playing');
      if (currPlaying) {
        currPlaying.classList.remove('playing');
      }
      const currCtr = document.querySelector('#listvideo .removeCtr');
      if (currCtr) {
        currCtr.classList.remove('removeCtr');
      }

      if (!roles.hasControls()) {
        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'videoPauseTime')) {
          clearTimeout(virtualclass.gObj.videoPauseTime);
        }

        if (typeof virtualclass.videoUl.player === 'object' && virtualclass.videoUl.player.player_ != null
          && virtualclass.videoUl.player.paused()) {
          // console.log('==== Video is paused');
          virtualclass.videoUl.player.pause();
        }
      }
      if (typeof virtualclass.videoUl.player === 'object') {
        // console.log('=====> Video delete <==== ',  virtualclass.videoUl.player);
        delete (virtualclass.videoUl.player);
      }
    },

    removeSessionEndTool() {
      const virtualclassSessionEndTool = document.getElementById('virtualclassSessionEndTool');
      if (virtualclassSessionEndTool != null) {
        virtualclassSessionEndTool.parentNode.removeChild(virtualclassSessionEndTool);
      }
    },


    // clearEverthing() {
    //   virtualclass.notPLayed = true;
    //   virtualclass.config.endSession();
    //   virtualclass.chat.chatroombox = false;
    //   const chatRoom = document.getElementById('chatrm');
    //   if (chatRoom !== null) {
    //     chatRoom.parentNode.removeChild(chatRoom);
    //   }
    //   const canvasElem = document.getElementById('canvas');
    //   if (canvasElem !== null) {
    //     canvasElem.style.pointerEvents = 'none';
    //   }
    // },

    WebPDecodeAndDraw(data, canvas, context) {
      if (window.Worker) {
        webpToPng.postMessage({
          vdata: data,
          canid: canvas.id,
        });
      }

      if (window.Worker) {
        webpToPng.onmessage = function (e) {
          if (e.data.canid === 'videoParticipate') {
            // Teacher's big video which is outside of the Shadow Dom
            var canvas = document.querySelector(`#${e.data.canid}`);
          } else {
            var canvas = chatContainerEvent.elementFromShadowDom(`#${e.data.canid}`);
          }

          const context = canvas.getContext('2d');
          const output = context.createImageData(canvas.width, canvas.height);

          canvas.height = e.data.bh;
          canvas.width = e.data.bw;

          // output.data =  new Uint8ClampedArray(outputData);
          output.data.set(e.data.vdata);
          context.putImageData(output, 0, 0);
          virtualclass.gObj.isReadyForVideo = true;
        };
      }
      canvas = canvas;
    },

    isSessionEnded() {
      if (!virtualclass.isPlayMode && virtualclass.endSession) {
        localStorage.clear();
        return true;
      }
    },

    afterPdfPrefetch(noteId, data) {
      virtualclass.gObj.nextPdf = {};
      virtualclass.gObj.nextPdf[noteId] = data;
    },

    getCurrentFormattedTime(time) {
      time = this.UTCtoLocalTimeToSeconds(time);

      const date = new Date(time);

      // Hours part from the timestamp
      const hours = date.getHours();
      // Minutes part from the timestamp
      const minutes = `0${date.getMinutes()}`;
      // Seconds part from the timestamp
      // var seconds = "0" + date.getSeconds();

      // Will display time in 10:30:23 format
      const formattedTime = `${hours}:${minutes.substr(-2)}`;

      return formattedTime;
    },

    hideFullScreenButton() {
      console.log('=====> full screen show hide');
      document.querySelector('#fullScreenButton').style.display = 'none';
      document.querySelector('#fullScreenExitButton').style.display = 'block';
      virtualclass.gObj.fullScreenMode = true;
      virtualclass.gObj.notHandleInputFocusHandler = true;
    },

    showFullScreenButton() {
      console.log('=====> full screen show show');
      document.querySelector('#fullScreenButton').style.display = 'block';
      document.querySelector('#fullScreenExitButton').style.display = 'none';
      virtualclass.gObj.fullScreenMode = false;
      virtualclass.gObj.notHandleInputFocusHandler = true;
    },

    showFullScreenButtonIfNeed() {
      console.log('====> show video full screen 1');
      if (virtualclass.gObj.fullScreenMode) {
        this.showFullScreenButton();
      }
    },

    storeWhiteboardAtInlineMemory(repObj) {
      if (typeof virtualclass.gObj.wbData[virtualclass.gObj.currWb] !== 'object') {
        virtualclass.gObj.wbData[virtualclass.gObj.currWb] = [];
      }
      virtualclass.gObj.wbData[virtualclass.gObj.currWb] = virtualclass.gObj.wbData[virtualclass.gObj.currWb].concat(repObj);
    },

    attachWhiteboardPopupHandler(wId) {
      window.addEventListener('mouseup', (ev) => {
        const currApp = document.querySelector('#virtualclassCont').dataset.currapp;
        const moreElemClose = document.querySelector('#askQuestion .moreControls .item.open');
        if (moreElemClose) {
          moreElemClose.classList.remove('open');
          moreElemClose.classList.add('close');
        }
        if (currApp != null && (currApp === 'Whiteboard' || currApp === 'DocumentShare') && wId) {
          if (Object.prototype.hasOwnProperty.call(ev.target.dataset, 'stroke') || Object.prototype.hasOwnProperty.call(ev.target.dataset, 'font')) {
            const dropDown = (Object.prototype.hasOwnProperty.call(ev.target.dataset, 'stroke')) ? document.querySelector(`#t_strk${wId} .strkSizeList`) : document.querySelector(`#t_font${wId} .fontSizeList`);
            virtualclass.wb[wId].closeElem(dropDown);
          } else if (ev.target.classList.contains('icon-color') || ev.target.classList.contains('selected') || ev.target.classList.contains('congtooltip')) {
            virtualclass.wb[wId].closeElem(document.querySelector(`#shapes${wId}`));
          } else if (ev.target.classList.contains('icon-rectangle') || ev.target.classList.contains('icon-line')
            || ev.target.classList.contains('icon-oval') || ev.target.classList.contains('icon-triangle')) {
            virtualclass.wb[wId].closeElem(document.querySelector(`#shapes${wId}`));
          } else {
            const stroke = document.querySelector(`#t_strk${wId} .strkSizeList`);
            const font = document.querySelector(`#t_font${wId} .fontSizeList`);
            const colorList = document.querySelector(`#colorList${wId}`);
            if (stroke !== null && stroke.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
              virtualclass.wb[wId].closeElem(stroke);
            } else if (font !== null && font.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
              virtualclass.wb[wId].closeElem(font);
            } else if (colorList !== null && colorList.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
              virtualclass.wb[wId].closeElem(colorList);
            }

            if (!ev.target.classList.contains('icon-shapes') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
              const shapes = document.querySelector(`#shapes${wId}`);
              if (shapes !== null && shapes.classList.contains('open')) {
                virtualclass.wb[wId].closeElem(shapes);
              }
            }
          }
        }
      });
    },

    setScreenShareDefualtColor() {
      if (virtualclass.gObj.prvRequestScreenUser) {
        const prvReq = chatContainerEvent.elementFromShadowDom(`#ml${virtualclass.gObj.prvRequestScreenUser} .icon-stdscreenImg`);
        if (prvReq !== null) {
          prvReq.setAttribute('data-dcolor', 'black');
          prvReq.parentNode.setAttribute('data-title', virtualclass.lang.getString('requestScreenShare'));
        }
      }
    },

    hidePageNumber() {
      const nav = document.querySelector('#docShareNav');
      if (nav !== null) {
        nav.classList.add('hide');
        nav.classList.remove('show');
      }
    },

    sendSpeedByMobile(speed) {
      if (virtualclass.system.desktop === 'mobTab') {
        ioAdapter.sendSpeed(speed);
      }
    },

    isRefreshMode() {
      return virtualclass.config.makeWebSocketReady;
    },

    triggerFinalizeTextIfAny(wbId) {
      const id = wbId || virtualclass.gObj.currWb;
      if ((virtualclass.currApp === 'Whiteboard' || virtualclass.currApp === 'DocumentShare')
        && typeof virtualclass.wb[id] === 'object' && virtualclass.wb[id].obj.drawTextObj) {
        virtualclass.wb[id].obj.drawTextObj.finalizeTextIfAny(undefined, id);
      }
    },

    // text area focus input element
    inputFocusHandler(searchUser) {
      console.log('====> focus input');

      if (searchUser && typeof searchUser !== 'string') {
        if (virtualclass.isPlayMode) virtualclass.userInteractivity.triggerPause();
      }

      if (window.innerWidth > window.innerHeight) { // Apply only on landscape mode
        virtualclass.gObj.initHeight = window.innerHeight;
        const isFocusElement = document.querySelector('#tabs .ui-state-focus');
        if (virtualclass.system.device === 'mobTab' && isFocusElement == null && virtualclass.system.mybrowser.name != 'Safari') {
          document.getElementById('virtualclassCont').classList.add('focusInput');
        }
      }
    },

    inputFocusOutHandler() {
      console.log('====> focus output');
      if (virtualclass.system.device === 'mobTab') {
        document.getElementById('virtualclassCont').classList.remove('focusInput');
      }
    },

    checkUserRole() {
      if (virtualclass.isPlayMode) {
        return (wbUser.orginalUserRole === 't');
      } else {
        return (virtualclass.gObj.uRole === 't' || virtualclass.gObj.uRole === 'p');
      }
    },

  };
  window.vutil = vutil;
}(window));
