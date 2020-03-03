/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * @author  Jai Gupta
 * This file provides all functionality needed to share screen.
 */
let globalImageData = {};

(function screenShare(window) {
  let changeonresize; let prvWidth; let prvVWidth; let prvVHeight; let app;
  let canvasCont; let newCanvas; let newCtx; let
    imageData;

  // function callback(error) {
  //   virtualclass.vutil.initInstallChromeExt(error);
  // }

  function isNewerVersion(data) {
    return (data === virtualclass.gObj.screenShareVersion);
  }

  const renderImage = function renderImage(imgData) {
    if (canvasCont == null) {
      canvasCont = document.querySelector('#virtualclassScreenShareLocal');
    }

    if (newCanvas == null) {
      newCanvas = document.createElement('canvas');
      newCanvas.id = 'virtualclassScreenShareLocalVideoNew';
      canvasCont.appendChild(newCanvas);
      newCanvas = document.querySelector('#virtualclassScreenShareLocalVideoNew');
    }

    newCanvas.width = imgData.width;
    newCanvas.height = imgData.height;

    if (virtualclass.studentScreen.base.width <= 0) {
      virtualclass.studentScreen.base.width = newCanvas.width;
      virtualclass.studentScreen.base.height = newCanvas.height;
    }

    if (newCtx == null) {
      newCtx = document.querySelector('#virtualclassScreenShareLocalVideoNew').getContext('2d');
    }

    newCtx.putImageData(imgData, 0, 0);
    virtualclass.ss.localCont.save();

    virtualclass.ss.localCont.clearRect(0, 0, window.innerWidth - 300, window.innerHeight);

    virtualclass.ss.localCont.scale(virtualclass.studentScreen.scale, virtualclass.studentScreen.scale);

    virtualclass.ss.localCont.drawImage(newCanvas, 0, 0);
    virtualclass.ss.localCont.restore();
  };

  if (window.Worker) {
    sdworker.onmessage = function onmessage(e) {
      if (e.data.dtype === 'drgb') {
        globalImageData = e.data.globalImageData;
        imageData = e.data.globalImageData;
        if (Object.prototype.hasOwnProperty.call(e.data, 'stype')) {
          virtualclass.studentScreen.base.width = 0;
          virtualclass.studentScreen.setDimension();
          renderImage(imageData);
          // virtualclass.studentScreen.triggerFitToScreen(e.data.stype);
          virtualclass.studentScreen.triggerNormalView(e.data.stype);
          const teacher = virtualclass.vutil.getUserAllInfo(e.data.uid, virtualclass.connectedUsers);
          if ((teacher && teacher.role !== 't' && roles.isStudent() && !virtualclass.gObj.studentSSstatus.shareToAll)) {
            receiveFunctions.sview({ message: 'firstSs' });
          }
        } else {
          renderImage(imageData);
        }
      }
    };
  }

  /**
   * This returns an object that contains methods to initilize student screen
   * @returns an object to initilize student screen
   */

  const studentScreen = function studentScreen() {
    return {
      scale: 1,
      SCALE_FACTOR: 1.04,
      szoom: false,
      base: { width: 0, height: 0 },
      /**
       * Calculating the width and height of the student screen according the requirement of the-
       * application to be shared
       * And calling a function with the appropriate data to inilaize student screen
       * @param  msg  is a unit8clampped array or unit8array based on the protocol
       * saved a the first element in data_Pack
       * @param  stype type of the application such as "ss
       * @param  sTool tool for the application here it is screen share
       */

      ssProcess(msg, stype, sTool) {
        const dataPack = new Uint8ClampedArray(msg);
        const mycase = dataPack[0];
        let h; let w; let recmsg; let dw; let dh; let vcw; let vch; let
          dimObj;
        switch (mycase) {
          // Full Image
          case 102:
          case 202:
            if (isNewerVersion(dataPack[1])) {
              const uid = virtualclass.vutil.numValidateFour(dataPack[2], dataPack[3], dataPack[4], dataPack[5]);
              w = virtualclass.vutil.numValidateTwo(dataPack[6], dataPack[7]);
              h = virtualclass.vutil.numValidateTwo(dataPack[8], dataPack[9]);
              recmsg = dataPack.subarray(10, dataPack.length);
              this.initStudentScreen(recmsg, { w, h }, stype, sTool, uid);
            } else {
              w = virtualclass.vutil.numValidateTwo(dataPack[1], dataPack[2]);
              h = virtualclass.vutil.numValidateTwo(dataPack[3], dataPack[4]);
              recmsg = dataPack.subarray(5, dataPack.length);
              this.initStudentScreen(recmsg, { w, h }, stype, sTool);
            }
            break;
          // Slice Image
          case 103:
          case 203:
            /* Send to worker only if the screen layout is Ready already */
            if (typeof virtualclass.ss === 'object') {
              let receiveMsg;
              if (isNewerVersion(dataPack[1])){
                receiveMsg = dataPack.subarray(6, dataPack.length);
                this.drawImageThroughWorker(receiveMsg);
              } else {
                this.drawImageThroughWorker(dataPack);
              }
            }
            break;
          // Full Image with Resize
          case 104:
          case 204:
            if (isNewerVersion(dataPack[1])) {
              const uid = virtualclass.vutil.numValidateFour(dataPack[2], dataPack[3], dataPack[4], dataPack[5]);
              dw = virtualclass.vutil.numValidateTwo(dataPack[6], dataPack[7]);
              dh = virtualclass.vutil.numValidateTwo(dataPack[8], dataPack[9]);
              vcw = virtualclass.vutil.numValidateTwo(dataPack[10], dataPack[11]);
              vch = virtualclass.vutil.numValidateTwo(dataPack[12], dataPack[13]);
              recmsg = dataPack.subarray(14, dataPack.length);
              dimObj = { d: { w: dw, h: dh }, vc: { w: vcw, h: vch } };

              this.initStudentScreen(recmsg, dimObj, stype, sTool, uid);
            } else {
              dw = virtualclass.vutil.numValidateTwo(dataPack[1], dataPack[2]);
              dh = virtualclass.vutil.numValidateTwo(dataPack[3], dataPack[4]);
              vcw = virtualclass.vutil.numValidateTwo(dataPack[5], dataPack[6]);
              vch = virtualclass.vutil.numValidateTwo(dataPack[7], dataPack[8]);

              recmsg = dataPack.subarray(9, dataPack.length);
              dimObj = { d: { w: dw, h: dh }, vc: { w: vcw, h: vch } };
              this.initStudentScreen(recmsg, dimObj, stype, sTool);
            }
            break;
        }
      },

      triggerNormalView(stype) {
        if (stype === 'full' && virtualclass.studentScreen.scale === 1) {
          virtualclass.studentScreen.scale = 1;
          // virtualclass.studentScreen.fitToScreen();
          virtualclass.studentScreen.normalView();
        }
      },
      /**
       * Initializes the student screen, makes the application ready
       * calls functions to set dimension of student screen
       * setting dimension of student's screen
       * drwaing image on the screen of student
       * @param  imgData
       * @param  d dimension object
       * @param  stype type of the application such as ss for screen share
       * @param  stool  screen share
       */
      // TODO name of parameter d should be changed ,It also contains the property named d
      initStudentScreen(imgData, d, stype, stool, uid) {
        const whoIsTeacher = virtualclass.vutil.whoIsTeacher();
        if ((+whoIsTeacher) === uid) {
          virtualclass.gObj.studentSSstatus.shareToAll = true;
        }
        app = stype;
        let screenCont = document.getElementById(`virtualclass${virtualclass.apps.ss}`);

        if (typeof virtualclass[app] !== 'object' || screenCont == null) {
          if (typeof vtype !== 'undefined') {
            virtualclass.recorder.recImgPlay = true;
          }
          const shtool = 'ScreenShare';
          virtualclass.makeAppReady({ app: shtool });

        } else {
          if (virtualclass.currApp !== 'ScreenShare') {
            virtualclass.vutil.hidePrevIcon(app);
          }

          virtualclass.currApp = stool;

          const vcContainer = document.getElementById('virtualclassCont');
          virtualclass.vutil.setCurrApp(vcContainer, virtualclass.currApp);
        }

        if (Object.prototype.hasOwnProperty.call(d, 'd')) {
          virtualclass[app].dimensionStudentScreenResize(d);
          virtualclass[app].dim = true;
          (typeof uid === 'undefined') ? virtualclass[app].drawImages(imgData) : virtualclass[app].drawImages(imgData, uid);
        } else {
          if (!virtualclass[app].dim || ((typeof prvWidth !== 'undefined')
            && (prvWidth !== d.w) && (!Object.prototype.hasOwnProperty.call(d, 'x')))) {
            virtualclass[app].dim = true;
            virtualclass[app].dimensionStudentScreen(d.w, d.h);
            prvWidth = d.w;
          }

          if (Object.prototype.hasOwnProperty.call(d, 'w')) {
            if (virtualclass[app].localCanvas.width !== d.w || virtualclass[app].localCanvas.height !== d.h) {
              virtualclass[app].localCanvas.width = d.w;
              virtualclass[app].localCanvas.height = d.h;
              virtualclass[app].canvasOriginalWidth = virtualclass[app].localCanvas.width;
              virtualclass[app].canvasOriginalHeight = virtualclass[app].localCanvas.height;
            }
          }
          (typeof uid === 'undefined') ? virtualclass[app].drawImages(imgData) : virtualclass[app].drawImages(imgData, uid);
        }

        virtualclass.previous = virtualclass[app].id;

        if (!this.szoom) this.initZoom();
        screenCont = document.getElementById(`virtualclass${virtualclass.apps.ss}`);
        if (virtualclass.gObj.screenShareId) screenCont.dataset.screenshareid = virtualclass.gObj.screenShareId;
        virtualclass.userInteractivity.makeReadyContext();

      },

      initZoom() {
        const zoomControler = virtualclass.getTemplate('zoomControl');
        const zoomControlerhtml = zoomControler({ hasControls: roles.hasControls() });
        const container = document.querySelector(`#virtualclass${virtualclass.currApp}`);
        if (container != null) {
          container.insertAdjacentHTML('beforeend', zoomControlerhtml);
          const zoomIn = document.querySelector(`#virtualclass${virtualclass.currApp} .zoomIn`);
          const zoomOut = document.querySelector(`#virtualclass${virtualclass.currApp} .zoomOut`);
          const fitScreen = document.querySelector(`#virtualclass${virtualclass.currApp} .fitScreen`);

          if (zoomIn != null) {
            zoomIn.onclick = function onclick() {
              virtualclass.studentScreen.zoomIn();
            };
          }

          if (zoomOut != null) {
            zoomOut.onclick = function onclick() {
              virtualclass.studentScreen.zoomOut();
            };
          }

          if (fitScreen != null) {
            fitScreen.addEventListener('click', this.triggerFitControl.bind(this));
          }
        }
        this.szoom = true;
      },

      triggerFitControl() {
        const fitScreen = document.querySelector('#virtualclassScreenShare .zoomControler .fitScreen');
        if (this.doOpposite) {
          if (fitScreen.dataset.currstate === 'normalview') {
            virtualclass.studentScreen.fitToScreen();
          } else {
            virtualclass.studentScreen.normalView();
          }
          delete this.doOpposite;
        } else {
          if (fitScreen.dataset.currstate === 'normalview') {
            virtualclass.studentScreen.normalView();
          } else {
            virtualclass.studentScreen.fitToScreen();
          }
        }
      },

      zoomIn() {
        virtualclass.ss.localCanvas.width = (+virtualclass.ss.localCanvas.width) * this.SCALE_FACTOR;
        virtualclass.ss.localCanvas.height = ((+virtualclass.ss.localCanvas.height) * this.SCALE_FACTOR) + 5;
        this.scale = this.scale * this.SCALE_FACTOR;
        renderImage(globalImageData);

        this.addScroll();
      },

      fitToScreen() {
        const fitToScreen = document.querySelector('#virtualclassScreenShare .zoomControler .fitScreen');
        if (fitToScreen) {
          fitToScreen.dataset.currstate = 'normalview';
          const dataTitleElem = document.querySelector('#virtualclassScreenShare .fitScreen.congtooltip');
          dataTitleElem.dataset.title = virtualclass.lang.getString('normalView');
        }

        this.setDimension();
        const canvasParentWidth = document.querySelector('#virtualclassScreenShare').offsetWidth;
        this.scale = virtualclass.ss.getScale(virtualclass.ss.canvasOriginalWidth, canvasParentWidth);
        virtualclass.ss.localCanvas.width = canvasParentWidth - 10;
        virtualclass.ss.localCanvas.height = Math.round(virtualclass.ss.canvasOriginalHeight * this.scale);
        renderImage(globalImageData);
        this.addScroll();
      },

      normalView() {
        const fitToScreen = document.querySelector('#virtualclassScreenShare .zoomControler .fitScreen');
        if (fitToScreen) {
          fitToScreen.dataset.currstate = 'fittoscreen';
          const dataTitleElem = document.querySelector('#virtualclassScreenShare .fitScreen.congtooltip');
          dataTitleElem.dataset.title = virtualclass.lang.getString('fitToScreen');
        }

        const dimen = this.setDimension();
        this.scale = virtualclass.ss.getScale(this.base.width, dimen.width);
        // if (this.scale >= 1) {
        //   this.scale = 1;
        //   virtualclass.ss.localCanvas.width = globalImageData.width;
        //   virtualclass.ss.localCanvas.height = globalImageData.height;
        // } else {
        //   virtualclass.ss.localCanvas.width = dimen.width;
        //   virtualclass.ss.localCanvas.height = dimen.height;
        // }
        this.scale = 1;
        virtualclass.ss.localCanvas.width = globalImageData.width;
        virtualclass.ss.localCanvas.height = globalImageData.height;

        renderImage(globalImageData);
        virtualclass.ss.localCanvas.parentNode.classList.remove('scrollX');
      },

      zoomOut() {
        this.scale = this.scale / this.SCALE_FACTOR;
        virtualclass.ss.localCanvas.width = (+virtualclass.ss.localCanvas.width) * (1 / this.SCALE_FACTOR);
        virtualclass.ss.localCanvas.height = (+virtualclass.ss.localCanvas.height) * (1 / this.SCALE_FACTOR) + 5;
        renderImage(globalImageData);
        this.addScroll();
      },


      addScroll() {
        let canvasWidth = virtualclass.ss.localCanvas.width;
        let canvasWrapperWidth = virtualclass.ss.localCanvas.parentNode.style.width;
        canvasWidth = virtualclass.vutil.getValueWithoutPixel(canvasWidth);
        canvasWrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvasWrapperWidth);
        if (canvasWidth > canvasWrapperWidth) {
          virtualclass.ss.localCanvas.parentNode.classList.add('scrollX');
        } else {
          virtualclass.ss.localCanvas.parentNode.classList.remove('scrollX');
        }
      },
      //

      setDimension() {
        const virtualclassScreenShare = document.getElementById('virtualclassScreenShare');
        const width = virtualclassScreenShare.offsetWidth;
        const height = virtualclassScreenShare.offsetHeight;
        this.setCanvasContainerDimension(width, height);
        return { width, height };
      },


      getCanvasContainerDimension() {
        const screenApp = document.querySelector(`#virtualclass${virtualclass.currApp}`);
        let { width } = screenApp.style;
        let { height } = screenApp.style;

        if (width == null || width === '') {
          width = screenApp.offsetWidth;
        }

        if (height == null || height === '') {
          height = screenApp.offsetHeight;
        }

        width = virtualclass.vutil.getValueWithoutPixel(width) - 40;
        height = virtualclass.vutil.getValueWithoutPixel(height);

        return { width, height };
      },

      setCanvasContainerDimension(width, height) {
        return;
        const canvaScontainer = document.querySelector('#virtualclassScreenShareLocal');
        canvaScontainer.style.width = `${width}px`;
        canvaScontainer.style.height = `${height}px`;
      },

      drawImageThroughWorker(dataPack) {
        if (window.Worker) {
          sdworker.postMessage({
            data_pack: dataPack,
            dtype: 'drgbs',
          }, [dataPack.buffer]);
        }
      },
    };
  };
  /**
   * This function returns an object that contains all the functions necessary to use the application share screen
   * such as to initalize screen, get screen(screen selector window) on different browsers,
   * Creating container,
   * Recording screen ,
   * sharing on student's screen
   * @param  config is an object containg id and class properties of the application to be shared,
   * on student's screen.
   * @return  returns an object containing various methods for screen share
   *
   */
  const funScreenShare = function funScreenShare(config) {
    /**
     *
     */
    virtualclass.getSceenFirefox = function getSceenFirefox() {
      const ffver = parseInt(window.navigator.userAgent.match(/Firefox\/(.*)/)[1], 10);
      if (ffver >= 33) {
        const constraints = {
          video: {
            mozMediaSource: 'window',
            mediaSource: 'window',
          },
        };
        if (virtualclass.adpt == null) {
          virtualclass.adpt = new virtualclass.adapter();
        }

        const navigator2 = virtualclass.adpt.init(navigator);

        navigator2.mediaDevices.getUserMedia(constraints).then((stream) => {
          virtualclass.ss.initInternal();
          if ((roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing)
            || virtualclass.gObj.studentSSstatus.mesharing) {
            // callback(err, stream);
            virtualclass.ss.initializeRecorder.call(virtualclass.ss, stream);

            // workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1045810
            if (typeof err === 'undefined') {
              let lastTime = stream.currentTime;
              var polly = window.setInterval(() => {
                if (!stream) window.clearInterval(polly);
                if (stream.currentTime === lastTime) {
                  window.clearInterval(polly);
                  if (stream.onended) {
                    stream.onended();
                  }
                }
                lastTime = stream.currentTime;
              }, 500);
            }
          } else {
            // Set previous app as current app if teacher reclaim role during screen share
            virtualclass.ss.setCurrentApp();
          }
        }).catch((error) => { // cancel screen share
          virtualclass.ss.setCurrentApp();

          let option;
          if (virtualclass.currApp === 'Video') {
            option = document.getElementById('virtualclassVideoTool');
          } else if (virtualclass.currApp === 'SharePresentation') {
            option = document.getElementById('virtualclassSharePresentationTool');
          } else if (virtualclass.currApp === 'DocumentShare') {
            option = document.getElementById('virtualclassDocumentShareTool');
          }
          const dashboard = option.getElementsByTagName('a')[0];
          virtualclass.initlizer(dashboard);

          if (typeof error === 'string') {
            // PERMISSION_DENIED
            if (error === 'PERMISSION_DENIED') {
              // this url is need to be changed
              window.open('https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/').focus();
            }
          } else if (typeof error === 'object') { // latest firefox
            if (error.name === 'PermissionDeniedError' || error.name === 'SecurityError') {
              window.open('https://addons.mozilla.org/en-US/firefox/addon/ff_screenshare/').focus();
            }
          }
          if (roles.hasControls()) {
            if (virtualclass.currApp === 'Video' || virtualclass.currApp === 'SharePresentation'
              || virtualclass.currApp === 'DocumentShare') {
              virtualclass.ss.showDashboard();
            }
          }
        });
      } else {
        alert(virtualclass.lang.getString('notSupportBrowser', [ffver])); // TODO Show this as proper error
      }
    };

    return {
      prevStream: false,

      /**
       * This function is invoked on clicking screen share icon .
       * At the teacher's window screen share application is started ,
       * And on student's window initInternal function is invoked to inilize screen
       * @param screen screen object

       */
      init(screen) {
        this.type = screen.type;
        this.ssByClick = true;
        this.manualStop = false;

        // if(roles.hasControls() && !Object.prototype.hasOwnProperty.call(virtualclass, 'repType')){
        if (roles.hasControls() && !virtualclass.recorder.recImgPlay && !virtualclass.gObj.studentSSstatus.mesharing) {
          // if(!Object.prototype.hasOwnProperty.call(virtualclass, 'repType')){
          this.readyTostart(screen.app);
          // this.tempCurrApp = virtualclass.vutil.capitalizeFirstLetter(screen.app);
          // }
        } else if (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing) {
          this.readyTostart(screen.app);
        } else {
          if (roles.isStudent()) {
            const chromeExtMiss = document.getElementById('chromeExtClose');
            if (chromeExtMiss) {
              chromeExtMiss.click();
            }
          }
          this.initInternal();
        }
      },

      /**
       * Called when user select the screenshare
       * configuring the screen
       * inilizing student screen
       *
       */
      initInternal() {
        this.currApp = this.tempCurrApp;
        virtualclass.currApp = virtualclass.apps.ss;
        // add current app to main container
        const vcContainer = document.getElementById('virtualclassCont');
        virtualclass.vutil.setCurrApp(vcContainer, virtualclass.currApp);
        if (virtualclass.previous !== config.id) {
          document.getElementById(virtualclass.previous).style.display = 'none';
          virtualclass.previous = config.id;
        }
        const ss = document.getElementById(config.id);
        if (ss != null) {
          ss.style.display = 'block';
        }

        if (!Object.prototype.hasOwnProperty.call(this, 'id')) {
          this.dc = virtualclass.dirtyCorner;
          this.postFix = 'Cont';
          this.id = Object.prototype.hasOwnProperty.call(config, 'id') ? config.id : 'virtualclassScreenShare';
          this.className = 'virtualclass';
          this.label = 'Local';
          this.local = this.id + this.label;
          this.localTemp = `${this.id + this.label}Temp`;
          this.classes = Object.prototype.hasOwnProperty.call(config, 'class') ? config.classes : '';

          // this.prevImageSlices = [];
          this.initPrevImage();
          const ssUI = document.getElementById(this.id);
          if (ssUI != null) {
            ssUI.parentNode.removeChild(ssUI);
          }

          this.html.UI.call(this, virtualclass.gObj.uRole);
          if (((roles.hasControls() && !virtualclass.recorder.recImgPlay)
            && !virtualclass.gObj.studentSSstatus.mesharing)
            || (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing)) {
            virtualclass.vutil.initLocCanvasCont(`${this.localTemp}Video`);
          }
        }
      },

      /**
       * This function gets  screen reloaded with the url
       * @param myapp it stores the string screenshare
       */
      readyTostart(myapp) {
        if (myapp === virtualclass.apps.ss) {
          this.getScreen();
        }
      },
      /**
       * Displays the error if any
       * @param e error
       *
       */

      onError(e) {
        // virtualclass.ss.setCurrentApp();
        if (virtualclass.previous) {
          const { previous } = virtualclass;
          virtualclass.currApp = previous.split('virtualclass')[1];
          virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
        } else if (Object.prototype.hasOwnProperty.call(virtualclass, 'previousApp')
          && typeof virtualclass.previousApp === 'object') {
          virtualclass.currApp = virtualclass.previousApp.name;
          virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
        }
        if (roles.hasControls()) {
          if (virtualclass.currApp === 'Video' || virtualclass.currApp === 'SharePresentation'
            || virtualclass.currApp === 'DocumentShare') {
            virtualclass.ss.showDashboard();
          }
        }

        if (virtualclass.gObj.studentSSstatus.mesharing) {
          virtualclass.gObj.studentSSstatus.mesharing = false;
        }
        // TODO Show error to user in an proper way
        // console.log(`Error ${e}`);
      },

      showDashboard() {
        virtualclass.dashboard.initDashboardNav();
        if (virtualclass.currApp === 'Video') {
          ioAdapter.mustSend({ videoUl: { init: 'destroyPlayer' }, cf: 'destroyPlayer' });
          ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
        } else if (virtualclass.currApp === 'SharePresentation') {
          virtualclass.dashboard.init();
        }
      },

      getScreenStream(cnavigator) {
        const videoConstratints = { video: {
          mandatory: {
            maxWidth: 1440,
            maxHeight: 9999,
          }
        }};

        return cnavigator.mediaDevices.getDisplayMedia(videoConstratints);
      },

      /**
       * To Get screen for Firefox and chrome,
       * in case of crome if desktop extension is added it is used otherwise
       * it is added from the crome webstore
       */
      async getScreen() {
        const cnavigator = virtualclass.adpt.init(navigator);
        if (cnavigator.mediaDevices.getDisplayMedia) {
          const mediaStream = await this.getScreenStream(cnavigator);
          virtualclass.ss.initInternal();
          virtualclass.ss.initializeRecorder.call(virtualclass.ss, mediaStream);
        } else if (virtualclass.system.mybrowser.name === 'Chrome') { // Fallback will be depricated in future
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'ext') && virtualclass.gObj.ext) {
            window.postMessage({ type: 'getScreen', id: 1 }, '*');
          } else {
            virtualclass.vutil.beforeSend({ ext: true, cf: 'colorIndicator' });
            // const url = 'https://chrome.google.com/webstore/detail/' + 'ijhofagnokdeoghaohcekchijfeffbjl';
            virtualclass.popup.chromeExtMissing();
            virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
            if (roles.hasControls() && (virtualclass.currApp === 'Video' || virtualclass.currApp === 'SharePresentation'
              || virtualclass.currApp === 'DocumentShare')) {
              virtualclass.ss.showDashboard();
            }
          }
        } else if (virtualclass.system.mybrowser.name === 'Firefox') {
          virtualclass.getSceenFirefox();
        }
      },
      /**
       *  clear previous screen from teacher's window
       *  The operation beforeSend is performed that
       *  sends data to the student that previous screen is to be unshared
       *
       */
      unShareScreen() {
        this.video.src = '';
        this.localtempCont.clearRect(0, 0, this.localtempCanvas.width, this.localtempCanvas.height);
        clearInterval(virtualclass.clear);
        // this.prevImageSlices = [];
        this.initPrevImage();
        if (Object.prototype.hasOwnProperty.call(this, 'currentStream')) {
          // this.currentStream.stop(); is depricated from Google Chrome 45
          // https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en
          this.currentStream.getTracks()[0].stop();
        }
        virtualclass.vutil.beforeSend({ unshareScreen: true, st: this.type, cf: 'unshareScreen' });
        this.clearScreenShare();
        virtualclass.vutil.setScreenShareDefualtColor();
      },

      clearScreenShare() {
        if (typeof virtualclass.prevScreen !== 'undefined'
          && Object.prototype.hasOwnProperty.call(virtualclass.prevScreen, 'currentStream')) {
          delete virtualclass.prevScreen.currentStream;
        }
        virtualclass.gObj.studentSSstatus.mesharing = false;
        virtualclass.removeSharingClass();
        virtualclass.gObj.studentSSstatus.shareToAll = false;
        virtualclass.gObj.studentSSstatus.sharing = false;
        // localStorage.setItem('studentSSstatus', JSON.stringify(virtualclass.gObj.studentSSstatus));
        const elem = document.querySelector('#virtualclassScreenShare');
        if (elem != null) {
          elem.parentNode.removeChild(elem);
        }
        virtualclass.vutil.removeSSsharing();
        delete virtualclass.ss;
        if (Object.prototype.hasOwnProperty.call(virtualclass, 'studentScreen')) {
          delete virtualclass.studentScreen;
        }
        virtualclass.zoom.removeZoomController();
        virtualclass.ss = '';
      },

      /**
       * It clears the canvas
       */
      removeStream() {
        virtualclass.vutil.removeClass('audioWidget', 'fixed');
        if (this.localCont) {
          this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
        }
        this.clearScreenShare();
      },
      /**
       * Initializing the recorder to record the scrren that will be shared
       * And creating canvas element for the screen share,attaching
       * the media stream to the canvas element
       * it calls sharing function that share's the screen in the form of video to the student screen
       * clears the screen on cancelling screen share
       * @param stream
       */

      initializeRecorder(stream) {
        const that = this;
        // virtualclass.vutil.addClass("audioWidget", "fixed");
        changeonresize = 1;

        if (this.prevStream) {
          this.ssByClick = false;
        }
        if (typeof virtualclass.prevScreen !== 'undefined') {
          if (Object.prototype.hasOwnProperty.call(virtualclass.prevScreen, 'currentStream')) {
            virtualclass.prevScreen.unShareScreen();
          }
        }

        this.video = document.getElementById(`${this.local}Video`);
        this.videoSmall = document.getElementById(`${this.local}Videosmall`);


        if (this.video.tagName !== 'VIDEO') {
          // const earlierVideo = this.video;
          const video = document.getElementById(`${this.local}video`);
          this.video.parentNode.replaceChild(video, this.video);
          this.video = document.getElementById(`${this.local}Video`);
          this.video.autoplay = true;
          virtualclass.vutil.initLocCanvasCont(`${this.local}TempVideo`);
        }
        this.currentStream = stream;

        // ("video changed");
        virtualclass.adpt.attachMediaStream(this.video, stream);
        virtualclass.adpt.attachMediaStream(this.videoSmall, stream);
        this.prevStream = true;
        // Event handler ON current stream ends ,clearing canvas and unsharing on student's screen
        this.currentStream.getVideoTracks()[0].onended = function onended() {
          if (that.ssByClick) {
            const elem = document.querySelector('#virtualclassScreenShareLocalSmall');
            if (elem) {
              elem.style.display = 'none';
            }
            that.video.src = '';
            that.localtempCont.clearRect(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
            clearInterval(virtualclass.clear);

            that.initPrevImage();
            that.clearScreenShare();
            virtualclass.vutil.beforeSend({ unshareScreen: true, st: that.type, cf: 'unshareScreen' });
            if (roles.hasControls()) {
              // virtualclass.vutil.initDefaultApp();
              if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'windowLoading')) {
                virtualclass.vutil.initDefaultApp();
              }
            } else {
              // Student unshares the screen by clicking stop button
              const teacherId = virtualclass.vutil.whoIsTeacher();
              // console.log('====> me sharing rmStdScreen');
              ioAdapter.mustSendUser({ cf: 'rmStdScreen' }, teacherId);
            }

            that.prevStream = false;
            that.prevScreen = '';
            virtualclass.prevScreen = ''; // todo:- that.prevScreen and virtualclass.prevScreen should be same
          } else {
            that.ssByClick = true;
          }
        };

        const container = {};
        container.width = window.innerWidth;
        container.height = window.innerHeight - 140;

        // const vidContainer = document.getElementById(this.local);
        // // const dimension = this.html.getDimension(container);
        // vidContainer.style.width = `${Math.round(container.width)}px`;
        // vidContainer.style.height = `${Math.round(container.height)}px`;

        // setStyleToElement(vidContainer, width, height);
        /**
         * Event handler on loading meta data of the video
         * Setting container width
         * calling sharing function to share screen
         * making screenshare active application and removing previous application
         */
        this.video.onloadedmetadata = function onloadedmetadata() {
          const date = new Date();
          const timeInMiliseconds = date.getTime();
          virtualclass.gObj.screenShareId = `ss_${timeInMiliseconds}`;
          virtualclass.userInteractivity.makeReadyContext();
          ioAdapter.mustSend({ cf: 'screenShareId', id: virtualclass.gObj.screenShareId});
          that.width = container.width;
          that.height = container.height;

          that.localtempCanvas.width = that.video.offsetWidth;
          that.localtempCanvas.height = that.video.offsetHeight;

          virtualclass.prevScreen = that;
          const res = virtualclass.system.measureResoultion({
            width: window.innerWidth,
            height: window.innerHeight,
          });

          that.sharing();

          if (roles.hasControls()) {
            // TODO This should be invoke at one place
            virtualclass.vutil.makeActiveApp(that.id, virtualclass.previrtualclass);
            if (virtualclass.previrtualclass === 'virtualclassYts') {
              virtualclass.yts.destroyYT();
            }
          }
          virtualclass.previrtualclass = that.id;
        };
      },

      /**
       * sendi bng the video to the student in the form of encoded data
       * status code is also sent with the encoded data
       *screen is shared in the form of video
       *@return sendmsg encoded data and status code together
       */
      // function is too large
      sharing() {
        // let tempObj; let encodedData; let stringData; let d; let matched; let
        //   imgData;
        let resA = Math.round(this.localtempCanvas.height / 12);
        let resB = Math.round(this.localtempCanvas.width / 12);
        let prvResA = resA;
        let prvResB = resB;
        const that = this;
        // const uniqcount = 0;
        // const uniqmax = (resA * resB) / 5;
        // let sendObj;
        // var changeonresize=1;
        // randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
        if (Object.prototype.hasOwnProperty.call(virtualclass, 'wholeImage')) {
          clearInterval(virtualclass.wholeImage);
        }

        if (Object.prototype.hasOwnProperty.call(virtualclass, 'clear')) {
          clearInterval(virtualclass.clear);
        }

        if (resA === 0 && resB === 0) {
          virtualclass.view.createErrorMsg('screensharereload', 'errorContainer', 'virtualclassAppFooterPanel');
        }

        let screenIntervalTime = 1000;

        /**
         * Breaking  value into parts
         * @param  val width or height
         * @param l  length to make of val by appending zero
         * @returns returning comma separated string
         */
        function breakintobytes(val, l) {
          let numstring = val.toString();
          for (let i = numstring.length; i < l; i += 1) {
            numstring = `0${numstring}`;
          }
          return numstring.match(/[\S]{1,2}/g) || [];
        }

        /**
         * To send full  encoded image data and status code
         * @param  type type of the application
         * @returns sendmsg message containg imagedata and encoded data
         */
        virtualclass.getDataFullScreen = function getDataFullScreen(type) {
          that.localtempCanvas.width = that.video.offsetWidth;
          that.localtempCanvas.height = that.video.offsetHeight;
          that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);

          // if(typeof firstTimeDisp == 'undefined'){
          const imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width,
            that.localtempCanvas.height);
          const encodedData = that.dc.encodeRGB(imgData.data);
          const h = breakintobytes(that.localtempCanvas.height, 4);
          const w = breakintobytes(that.localtempCanvas.width, 4);
          let statusCode = null;
          statusCode = (type === 'ss') ? 102 : 202;
          const uId = breakintobytes(virtualclass.gObj.uid, 8);
          const scode = new Uint8ClampedArray([statusCode, virtualclass.gObj.screenShareVersion, uId[0], uId[1], uId[2], uId[3], w[0], w[1], h[0], h[1]]);
          const sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
          sendmsg.set(scode);
          sendmsg.set(encodedData, scode.length);
          return sendmsg;
        };

        /** Encoded message is sent to student,
         * Getting full video data on resize of the window
         * @param  stype implies screenshare
         * @returns {Uint8ClampedArray}
         */
        function getDataFullScreenResize(stype) {
          that.localtempCanvas.width = that.video.offsetWidth;
          that.localtempCanvas.height = that.video.offsetHeight;
          that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);

          const imgData = that.localtempCont.getImageData(0, 0, that.localtempCanvas.width,
            that.localtempCanvas.height);
          const encodedData = that.dc.encodeRGB(imgData.data);

          const wdw = Math.round((that.localtempCanvas.width) / resB);
          const wdh = Math.round((that.localtempCanvas.height) / resA);
          let dw; let dh; let vcw; let vch;

          const uId = breakintobytes(virtualclass.gObj.uid, 8);

          const contDimension = that.getContainerDimension();
          if (typeof prvVWidth !== 'undefined' && typeof prvVHeight !== 'undefined') {
            dw = breakintobytes(prvVWidth, 4);
            dh = breakintobytes(prvVHeight, 4);
            vcw = breakintobytes(contDimension.width, 4);
            vch = breakintobytes(contDimension.height, 4);
          } else {
            dw = breakintobytes(that.video.offsetWidth, 4);
            dh = breakintobytes(that.video.offsetHeight, 4);
            vcw = breakintobytes(contDimension.width, 4);
            vch = breakintobytes(contDimension.height, 4);
          }

          const appCode = (stype === 'ss') ? 104 : 204;
          const scode = new Uint8ClampedArray([appCode, virtualclass.gObj.screenShareVersion, uId[0], uId[1], uId[2], uId[3], dw[0], dw[1], dh[0], dh[1], vcw[0], vcw[1], vch[0], vch[1]]);
          const sendmsg = new Uint8ClampedArray(encodedData.length + scode.length);
          sendmsg.set(scode);
          sendmsg.set(encodedData, scode.length);
          if (window.Worker) {
            sworker.postMessage({
              img: encodedData,
              resize: 1,
              resA,
              resB,
              dw: wdw,
              dh: wdh,
              offsetWidth: that.video.offsetWidth,
              offsetHeight: that.video.offsetHeight,
            }, [encodedData.buffer]);
          }
          return sendmsg;
        }

        /**
         * Setting screen interval time based on the size of image to be sent
         * @param  localBandwidth image size that is to be sent
         *
         */
        function calcBandwidth(localBandwidth) {
          switch (true) {
            case localBandwidth <= 300 || typeof localBandwidth === 'undefined':
              screenIntervalTime = 300;
              break;
            case localBandwidth <= 3000:
              screenIntervalTime = localBandwidth;
              break;
            case localBandwidth <= 5000:
              screenIntervalTime = 3000;
              break;
            default:
              screenIntervalTime = 5000;
          }
        }

        /**
         * Getting the changed width and height of the new screen
         * Creating image nd calculating bandwidth
         * And sending binary data of image
         * setting the interval for function send screen
         */
        function sendResizeWindow() {
          if (roles.hasControls() || virtualclass.gObj.studentSSstatus.mesharing) {
            prvVWidth = that.video.offsetWidth;
            prvVHeight = that.video.offsetHeight;
            if (that.localtempCanvas.width > 5 && that.localtempCanvas.height > 5) {
              resA = Math.round(that.localtempCanvas.height / 12);
              resB = Math.round(that.localtempCanvas.width / 12);
              prvResA = resA;
              prvResB = resB;
            } else {
              /** Uses previous resolution if dimension of localtempCanvas is less than 5 * */
              resA = prvResA;
              resB = prvResB;
            }

            const createdImg = getDataFullScreenResize(that.type);
            virtualclass.vutil.informIamSharing();
            ioAdapter.sendBinary(createdImg);

            calcBandwidth(createdImg.length / 128); // In Kbps
            changeonresize = 0;
            clearInterval(virtualclass.clear);
            virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
          }
        }

        /**
         * Sending data in the form of  slices , to send only that part that is changed in the video of screen share
         * image data is provided to the worker that is calulating change part for the main javascript thread
         * @param type : type of the application
         */
        function sendDataImageSlices() {
          // var localBandwidth = 0;
          that.localtempCanvas.width = that.video.offsetWidth;
          that.localtempCanvas.height = that.video.offsetHeight;
          // can be problem for crash
          that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);
          const dw = Math.round((that.localtempCanvas.width) / resB);
          const dh = Math.round((that.localtempCanvas.height) / resA);

          const masterImgData = that.localtempCont.getImageData(0, 0, that.video.offsetWidth, that.video.offsetHeight);

          if (window.Worker) {
            sworker.postMessage({
              img: masterImgData.data,
              resA,
              resB,
              dw,
              dh,
              offsetWidth: that.video.offsetWidth,
              offsetHeight: that.video.offsetHeight,
              type: that.type,
              uid: virtualclass.gObj.uid,
            }, [masterImgData.data.buffer]);

            // Every time the data is sending the function
            // is declaring as expression which is not good
            sworker.onmessage = function onmessage(e) {
              let localBandwidth;
              if (e.data.needFullScreen === 1) { // sending full screen here
                const createdImg = virtualclass.getDataFullScreen(that.type);
                virtualclass.vutil.informIamSharing();
                ioAdapter.sendBinary(createdImg);
                localBandwidth = (createdImg.length / 128); // In Kbps
              } else if (e.data.sendMasterSlice != null) {
                ioAdapter.sendBinary(e.data.sendMasterSlice);
                localBandwidth = (e.data.sendMasterSlice.length / 128); // In Kbps
              }
              calcBandwidth(localBandwidth);
              clearInterval(virtualclass.clear);
              virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
            };
          }
          clearInterval(virtualclass.clear);
        }

        /**
         * finding out whether previous dimention are same or not to the current  video dimension
         * if there is change in dimension   resized window  data is sent
         * otherwise image data slices will be sent
         */
        function sendScreen() {
          clearInterval(virtualclass.clear);
          if (typeof prvVWidth !== 'undefined' && typeof prvVHeight !== 'undefined') {
            if (prvVWidth !== that.video.offsetWidth || prvVHeight !== that.video.offsetHeight) {
              changeonresize = 1;
            }
          } else {
            prvVWidth = that.video.offsetWidth;
            prvVHeight = that.video.offsetHeight;
          }

          if (changeonresize === 1) {
            virtualclass.ss.sendResizeWindowTime = setTimeout(sendResizeWindow, 2000);
          } else {
            sendDataImageSlices();
          }
        }

        clearInterval(virtualclass.clear);
        virtualclass.clear = setInterval(sendScreen, screenIntervalTime);
      },
      /**
       *  returnting  width and height of screen share container
       * @return  an object  containing width and height
       */
      getContainerDimension() {
        const vidCont = document.getElementById(`${this.id}Local`);
        // apply codacy rule
        const obj = { width: vidCont.offsetWidth, height: vidCont.offsetHeight };
        return obj;
      },
      /**
       * Drawing the image over the canvas
       * @param rec image data
       */
      drawImages(rec, uid) {
        sdworker.postMessage({
          encodeArr: rec,
          // globalImageData: globalImageData,globalImageDataglobalImageData
          cw: virtualclass.ss.localCanvas.width,
          ch: virtualclass.ss.localCanvas.height,
          dtype: 'drgb',
          uid: (typeof uid === 'undefined' ? null : uid),
        }, [rec.buffer]); // [[rec.buffer]] is passed to make available in Worker
      },
      /**
       * Setting with and height of container canvas at student's screen
       * @param cWidth width
       * @param cHeight height
       *
       */

      dimensionStudentScreen(cWidth, cHeight) {
        this.localCanvas = document.getElementById(`${virtualclass[app].local}Video`);
        this.localCont = virtualclass[app].localCanvas.getContext('2d');
        this.canvasOriginalWidth = cWidth;
        this.canvasOriginalHeight = cHeight;
        this.localCanvas.width = cWidth;
        this.localCanvas.height = cHeight;
      },
      /**
       * setting dimension of virtual class container and setting dimension of screen share canvas
       * at student's side
       * @param msg  dimension object for local canvas for screen share and virtual container
       */
      dimensionStudentScreenResize(msg) {
        if (!Object.prototype.hasOwnProperty.call(this, 'vac')) {
          this.vac = true;
          this.localCanvas = document.getElementById(`${virtualclass[app].local}Video`);
          this.localCont = virtualclass[app].localCanvas.getContext('2d');
        }

        if (Object.prototype.hasOwnProperty.call(msg, 'd')) {
          this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
          this.localCanvas.width = msg.d.w;
          this.localCanvas.height = msg.d.h;
          this.canvasOriginalWidth = this.localCanvas.width;
          this.canvasOriginalHeight = this.localCanvas.height;
        }

        // if (Object.prototype.hasOwnProperty.call(msg, 'vc')) {
        //   const vc = document.getElementById(virtualclass[app].local);
        //   vc.style.width = `${msg.vc.w}px`;
        //   vc.style.height = `${msg.vc.h}px`;
        // }

        if (virtualclass.previous === 'virtualclassScreenShare') {
          virtualclass.vutil.setScreenInnerTagsWidth(virtualclass.previous);
        }
      },

      isAbleToScreenShare() {
        if (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing) {
          return true;
        }
        return !!(roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing);
      },

      /**
       * Creating user interface part for the screen share
       */
      html: {
        /**
         * Creating main catainer and local container for screen share
         * @user role of the user
         */
        UI() {
          const hascontrol = virtualclass.ss.isAbleToScreenShare();
          const viewcontrol = roles.hasControls();
          const { recImgPlay } = virtualclass.recorder;
          const main = virtualclass.getTemplate('ssmainDiv');
          const roleControl = {
            control: hascontrol,
            recImg: recImgPlay,
            scrctrl: viewcontrol,
          };

          const mainConthtml = main(roleControl);

          // $('#virtualclassAppLeftPanel').append(mainConthtml);

          virtualclass.vutil.insertAppLayout(mainConthtml);

          if (roles.hasControls() && !virtualclass.gObj.studentSSstatus.mesharing) {
            const ss = document.querySelector('#virtualclassCont  #stopScreenShare');
            if (ss) {
              ss.addEventListener('click', () => {
                if (virtualclass.ss && virtualclass.ss.sendResizeWindowTime) {
                  clearTimeout(virtualclass.ss.sendResizeWindowTime);
                }
                virtualclass.vutil.initDefaultApp();
              });
            }
          }

          if (viewcontrol) {
            this.html.initScreenController();
            if (virtualclass.gObj.studentSSstatus.shareToAll && virtualclass.gObj.studentSSstatus.mesharing) {
              let element = document.querySelector('#screenController .selfView');
              if (element) {
                this.html.changeSsInfoSelf(element);
              }
            }
          }
          const mapp = document.querySelector('.congrea #virtualclassApp');
          if (!hascontrol) {
            if (!mapp.classList.contains('zoomCtr')) {
              mapp.classList.add('zoomCtrAdd');
            }
          } else {
            mapp.classList.remove('zoomCtrAdd');
          }

          // function css(element, styles) {
          //   if (typeof styles === 'string') {
          //     element.style.cssText += `;${styles}`;
          //   }
          // }

          if (roles.hasControls() && virtualclass.gObj.studentSSstatus.mesharing) {
            const ss = document.querySelector('#virtualclassCont  #stopScreenShare');
            if (ss) {
              ss.addEventListener('click', () => {
                virtualclass.vutil.initDefaultApp();
                const cont = document.querySelector('#virtualclassCont.studentScreenSharing');
                if (cont) {
                  cont.classList.remove('studentScreenSharing');
                  document.querySelector('#chat_div').classList.remove('studentScreenSharing');
                }
                virtualclass.vutil.setScreenShareDefualtColor();
                // virtualclass.vutil.removeStudenScreenStatus();
              });
            }
          }
          // return mainCont;
        },

        initScreenController() {
          const elem = document.querySelector('#screenController .share');
          if (elem != null) {
            const that = this;
            elem.onclick = function onclick(myelem) {
              let share;
              const { classList } = myelem.currentTarget;
              if (classList.contains('selfView')) { // Screen is sharing to all
                that.changeSsInfoSelf(myelem.currentTarget);
                share = 'sToAll';
              } else if (classList.contains('shareToAll')) { // Screen is sharing to self
                that.changeSsInfoShareToAll(myelem.currentTarget);
                share = 'sview';
              }
              ioAdapter.mustSend({ cf: share });
            };
          }
        },

        changeSsInfoSelf(elem) {
          elem.classList.remove('selfView');
          elem.classList.add('shareToAll');
          elem.setAttribute('data-title', virtualclass.lang.getString('selfview'));
          // elem.children[0].innerHTML = virtualclass.lang.getString('selfview'); // for next time
          virtualclass.gObj.studentSSstatus.shareToAll = true;
        },

        changeSsInfoShareToAll(elem) {
          elem.classList.remove('shareToAll');
          elem.classList.add('selfView');
          elem.setAttribute('data-title', virtualclass.lang.getString('sharetoall'));
          // elem.children[0].innerHTML = virtualclass.lang.getString('sharetoall'); // for next time
          virtualclass.gObj.studentSSstatus.shareToAll = false;
        },

        // /**
        //  * @param container object containg width and height property
        //  * @param aspectRatio
        //  * @aspectRatio a fractional value
        //  * @return  an object containing modified width and height
        //  */
        // getDimension(container, aspectRatio) {
        //   // let aspectRatio = aspectRatio || (3 / 4);
        //   // const height = (container.width * (aspectRatio || (3 / 4)));
        //   // const res = {};
        //
        //   return {
        //     height: container.height,
        //     width: container.width,
        //   };
        // },
      },
      // to initialize previous image
      initPrevImage() {
        sworker.postMessage({ initPrevImg: true });
      },

      setCurrentApp() {
        if (Object.prototype.hasOwnProperty.call(virtualclass, 'previous')
          && typeof virtualclass.previous !== 'undefined') {
          virtualclass.currApp = virtualclass.previous.slice(12);
          virtualclass.vutil.setCurrApp(document.getElementById('virtualclassCont'), virtualclass.currApp);
        }
      },

      getScale(baseWidth, givenWidth) {
        return givenWidth / baseWidth;
      },


      initShareScreen(sType, setTime) {
        if (typeof virtualclass.getDataFullScreen === 'function') {
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'sendScreen')) {
            clearTimeout(virtualclass.gObj.sendScreen);
          }

          virtualclass.gObj.sendScreen = setTimeout(
            () => {
              sType = virtualclass.getDataFullScreen(sType);
              const createdImg = virtualclass.getDataFullScreen('ss');
              ioAdapter.sendBinary(createdImg);
              virtualclass.vutil.informIamSharing();
              sType = null;
            }, setTime,
          );
        }
      },

      selfView(message) {
        const elem = document.getElementById('virtualclassScreenShareLocal');
        if (roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing) {
          if (elem != null) {
            console.log('====> Screen share dislay none');
            elem.style.display = 'none';
          }
        }
        if (Object.prototype.hasOwnProperty.call(message, 'firstSs')) {
          virtualclass.gObj.studentSSstatus.sharing = true;
        }
        virtualclass.gObj.studentSSstatus.shareToAll = false;
      },

      shareToAll() {
        const elem = document.getElementById('virtualclassScreenShareLocal');
        if (elem != null) {
          elem.style.display = 'block';
        }
        // virtualclass.gObj.studentSSstatus.shareToAll = true;
        // virtualclass.gObj.studentSSstatus.sharing = true;
      },

      triggerFitToScreen() {
        const fitToScreen = document.querySelector('#virtualclassScreenShare .zoomControler .fitScreen');
        if (fitToScreen != null && fitToScreen.dataset.currstate === 'normalview'){
          virtualclass.zoom.zoomAction('fitToScreen');
        }
      },
    };
  };
  window.studentScreen = studentScreen;
  window.screenShare = funScreenShare;
}(window));
