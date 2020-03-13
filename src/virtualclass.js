(function (window) {
  window.virtualclass = function () {
    /** TODO, this below data should be move into config ** */
    // const dstData = null;
    const playMode = (wbUser.virtualclassPlay ? parseInt(wbUser.virtualclassPlay, 10) : 0);
    let studentSSstatus = localStorage.getItem('studentSSstatus');
    if (studentSSstatus != null) {
      studentSSstatus = JSON.parse(localStorage.getItem('studentSSstatus'));
    } else {
      studentSSstatus = { sharing: false, mesharing: false, shareToAll: false };
    }

    return {
      isPlayMode: playMode,
      /* TODO, editorCode should be removed in proper way */
      apps: {
        wb: 'Whiteboard',
        ss: 'ScreenShare',
        yt: 'Yts',
        er: 'EditorRich',
        ec: 'EditorCode',
        sp: 'SharePresentation',
        poll: 'Poll',
        vid: 'Video',
        ds: 'DocumentShare',
        quiz: 'Quiz',
        mv: 'MultiVideo',
      },

      appSessionEnd: 'virtualclassSessionEnd',
      appAudioTest: 'virtualclassAudioTest',

      // rWidgetConfig: {id: 'audioWidget'},
      rWidgetConfig: { id: 'virtualclassAppRightPanel' },
      wb: '',
      ss: '',
      wss: '',
      rw: '',
      poll: '',
      quiz: '',
      raiseHand: '',
      // lang: {},
      error: [],
      pdfRender: {},
      clearGlobalLock: '',
      queueCreatePrefetchLink: [],
      pqueueCreatePrefetchLink: [],
      countCreatePrefetchLink: 0,
      gObj: {
        SCALE_FACTOR: 1.02,
        nextPdf: {}, // prefetch next pdf
        uid: window.wbUser.id,
        uRole: window.wbUser.role,
        uName: window.wbUser.name,
        tempReplayObjs: {}, // for store temp replayObjs
        // commandToolsWrapperId: 'commandToolsWrapper',
        commandToolsWrapperId: {},
        resize: false,
        has_ts_capability: !!((wbUser.ts === 1 || wbUser.ts === true)),
        // meetingMode : +(wbUser.meetingMode),
        meetingMode: 0,
        chromeExt: false,
        pdfdebugg: true, // To draw scroll for debugging process
        wbInitHandle: false,
        wbCount: 0,
        prvWindowSize: false,
        wIds: [0],
        wbRearrang: false,
        currSlide: (localStorage.getItem('currSlide') != null) ? localStorage.getItem('currSlide') : 0,
        currIndex: (localStorage.getItem('currIndex') != null) ? localStorage.getItem('currIndex') : 1,
        uploadingFiles: [],
        fetchedData: false,
        wbNavtime: 50, // virtualclass.gObj.studentSSstatus.mesharing
        studentSSstatus,
        screenRh: 60,
        isReadyForVideo: true,
        defaultApp: 'Whiteboard',
        chatIconColors: {},
        prevApp: null,
        myworker: null, // It contains a pdf worker for all PDFS of whiteboard and document sharing
        requestToScriptNode: null,
        readyToCommunicate: false,
        tempPrefix: 'dest_temp/templates',
        allUserObj: {},
        docPdfFirstTime: false,
        defalutStrk: '1',
        defalutFont: '25',
        defalutFntOptn: '1',
        defaultcolor: '#0000ff',
        sendAudioStatus: false,
        audioRecWorkerReady: false,
        wbTool: {},
        fullScreenMode: false,
        rightbarFullScreenMode: false,
        hideRightbar : JSON.parse(localStorage.getItem('hideRightbar')),
        lastmousemovetime: null,
        CDTimer: null,
        wbData: {},
        screenShareVersion: 123,
      },

      enablePreCheck: true,
      async clearSession() {
        window.pageEnter = new Date().getTime();
        if (typeof notSend === 'undefined') {
          virtualclass.vutil.beforeSend({ sEnd: true, cf: 'sEnd' }, null, true);
        }
        if (typeof virtualclass.videoUl === 'object') {
          if (typeof virtualclass.videoUl.player === 'object') {
            if (typeof virtualclass.videoUl.player.dispose !== 'undefined') {
              virtualclass.videoUl.destroyPlayer();
            }
          }
        }
        await virtualclass.config.endSession(); // by Teacher
        if (Object.prototype.hasOwnProperty.call(virtualclass, 'prevScreen')
          && Object.prototype.hasOwnProperty.call(virtualclass.prevScreen, 'currentStream')) {
          virtualclass.prevScreen.unShareScreen();
        }
        virtualclass.previrtualclass = `virtualclass${virtualclass.gObj.defaultApp}`;
      },

      createPrefetchLink(url) {
        const LINKSCOUNT = 20; // Number of links to process at once.
        if (url) {
          for (let i = 0; i < virtualclass.pqueueCreatePrefetchLink.length; i += 1) {
            if (virtualclass.pqueueCreatePrefetchLink[i] === url) {
              return; // Return if link is duplicate (already processed).
            }
          }
          virtualclass.queueCreatePrefetchLink.push(url);
          virtualclass.pqueueCreatePrefetchLink.push(url);
        }

        if (virtualclass.queueCreatePrefetchLink.length > 0) {
          for (let i = 0; i < virtualclass.queueCreatePrefetchLink.length; i += 1) {
            if (virtualclass.countCreatePrefetchLink < LINKSCOUNT) {
              virtualclass.createPrefetchLinkActual(virtualclass.queueCreatePrefetchLink.shift());
            } else {
              break;
            }
          }

          if (virtualclass.delaycreatePrefetchLink) {
            clearTimeout(virtualclass.delaycreatePrefetchLink);
            virtualclass.delaycreatePrefetchLink = 0;
          }

          virtualclass.delaycreatePrefetchLink = setTimeout(() => {
            document.getElementsByTagName('head')[0].appendChild(virtualclass.linkFragment);
            virtualclass.linkFragment = document.createDocumentFragment();
            virtualclass.countCreatePrefetchLink = 0;
            virtualclass.createPrefetchLink();
          }, 2000);
        }
      },

      createPrefetchLinkActual(url) {
        if (!virtualclass.linkFragment) {
          virtualclass.linkFragment = document.createDocumentFragment();
        }
        const hint = document.createElement('link');
        hint.setAttribute('rel', 'prefetch');
        hint.setAttribute('crossOrigin', 'use-credentials');
        hint.setAttribute('href', url);
        virtualclass.linkFragment.appendChild(hint);
        virtualclass.countCreatePrefetchLink += 1;
      },

      init(urole, app) {
        if (window.innerWidth > window.innerHeight) { // Apply only on landscape mode
          virtualclass.gObj.initHeight = window.innerHeight;
        }
        const vcContainer = document.getElementById('virtualclassCont');
        vcContainer.classList.add('loading');
        const { wbUser } = window;
        //   this.saveRecording = +(wbUser.recording.enableRecording);
        virtualclass.uInfo = {
          userid: wbUser.id,
          sid: wbUser.sid,
          rid: wbUser.path,
          authuser: wbUser.auth_user,
          authpass: wbUser.auth_pass,
          userobj: {
            userid: wbUser.id,
            name: wbUser.name,
            lname: wbUser.lname,
            img: wbUser.imageurl,

            // role: wbUser.role
            role: (localStorage.getItem('uRole') != null) ? localStorage.getItem('uRole') : wbUser.role,

          },
          room: wbUser.room,
        };


        this.gObj.congCourse = (typeof window.congCourse !== 'undefiend') ? window.congCourse : 0;

        this.wbConfig = { id: `virtualclass${virtualclass.apps.wb}`, classes: 'appOptions' };
        this.ssConfig = { id: `virtualclass${virtualclass.apps.ss}`, classes: 'appOptions' };
        // this.ytsConfig = {id: "virtualclass" + virtualclass.apps.yt, classes: "appOptions"};
        this.edConfig = { id: `virtualclass${virtualclass.apps.er}`, classes: 'appOptions' };
        this.edCodeConfig = { id: `virtualclass${virtualclass.apps.ec}`, classes: 'appOptions' };
        this.ptConfig = { id: `virtualclass${virtualclass.apps.sp}`, classes: 'appOptions' };
        this.plConfig = { id: `virtualclass${virtualclass.apps.poll}`, classes: 'appOptions' };
        this.viConfig = { id: `virtualclass${virtualclass.apps.vid}`, classes: 'appOptions' };
        this.dtsConfig = { id: `virtualclass${virtualclass.apps.ds}`, classes: 'appOptions' };
        this.qzConfig = { id: `virtualclass${this.apps.quiz}`, classes: 'appOptions' };
        this.mvConfig = { id: `virtualclass${this.apps.mv}`, classes: 'appOptions' };

        this.sharePt = window.sharePt;
        this.fineUploader = window.fineUploader;
        this.converter = converter;
        this.clear = '';
        this.currApp = this.vutil.capitalizeFirstLetter(app);
        // this.storage = window.storage;
        this.dashboard = dashboard;
        this.multiVideo = window.MultiVideo;
        this.vutil.isChromeExtension();

        this.pageNavigation = window.pageIndexNav;
        this.modal = window.modal;
        this.zoom = window.zoomWhiteboard();
        this.pageIndexNav = window.pageIndexNav;
        if (this.currApp !== 'Quiz' && virtualclass.gObj.CDTimer != null) {
          clearInterval(virtualclass.gObj.CDTimer != null);
        }

        virtualclass.modernizr = Modernizr;
        this.system.webpInit();

        this.dirtyCorner = window.dirtyCorner;
        this.html.init(this);
        this.adapter = window.adapter;

        virtualclass.api = api;

        virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
        virtualclass.xhr = window.xhr;
        virtualclass.xhr.init();

        /** This both have to merge * */
        virtualclass.xhrn = window.xhrn;

        virtualclass.xhrn.init();

        virtualclass.xhrn.getAccess();

        if (virtualclass.vutil.isPlayMode()) {
          // virtualclass.recorder.requestListOfFiles();
          virtualclass.popup.loadingWindow();
        }
        // virtualclass.chat = new Chat();

        virtualclass.chat.init();

        virtualclass.dtCon = virtualclass.converter();
        virtualclass.pbar = progressBar;

        // editor which is rich text editor which has various options

        virtualclass.editorRich = window.editor('editorRich', 'virtualclassEditorRich', 'virtualclassEditorRichBody');

        // simple code editor with markdown
        virtualclass.editorCode = window.editor('editorCode', 'virtualclassEditorCode', 'virtualclassEditorCodeBody');

        //                virtualclass.yts = window.yts();
        virtualclass.poll = window.poll();
        virtualclass.quiz = window.quiz();
        virtualclass.videoUl = window.videoUl();

        virtualclass.videoHost = window.videoHost;
        virtualclass.precheck = preCheck;
        virtualclass.page = page;
        virtualclass.userInteractivity = new UserInteractivity();
        // For the realitme, it will be invoked from member_added
        virtualclass.userInteractivity.init();
        if (virtualclass.isPlayMode) {
          virtualclass.userInteractivity.initFirebaseOperatoin();
        }

        virtualclass.rightbar = new Rightbar();

        this.orderList = {};
        if (virtualclass.vutil.isSessionEnded()) {
          return true;
        }

        virtualclass.network = new Network();
        virtualclass.gesture = gesture;


        this.serverData = serverData;
        this.view = window.view;
        // if (roles.hasControls()) {
        //   // this.serverData.fetchAllData(); // gets all data from server at very first
        //   virtualclass.serverData.syncAllData();
        // }
        if (localStorage.uRole != null) {
          virtualclass.gObj.uRole = localStorage.uRole; // this done only for whiteboard in _init()
          vcContainer.classList.add(virtualclass.vutil.getClassName(virtualclass.gObj.uRole));
        }

        // this.makeAppReady(app, 'byclick');

        this.makeAppReady({ app: app, cusEvent: 'byclick' });

        // TODO system checking function should be invoked before makeAppReady
        this.system.check();
        this.vutil.isSystemCompatible(); // this should be at environment-validation.js file
        this.pageVisible = virtualclass.vutil.pageVisible();

        // To teacher
        virtualclass.user.readyLeftBar(virtualclass.gObj.uRole, app);
        this.media = new window.media();

        // var precheck = localStorage.getItem('precheck');
        // if (precheck != null) {
        //   precheck = JSON.parse(precheck);
        // }

        if (virtualclass.makePreCheckAvailable) {
          virtualclass.precheck.init();
        } else {
          virtualclass.makeReadySocket();
          if (!virtualclass.isPlayMode) {
            virtualclass.gesture.initClassJoin();
          }
        }

        vcContainer.classList.remove('loading');

        virtualclass.gObj.precheckScrn = false;


        // For initialize the Teacher Video
        if (!virtualclass.gObj.meetingMode) {
          virtualclass.videoHost.init(320, 240);
          // virtualclass.networkStatus();
        }

        virtualclass.vutil.videoController();

        // if(virtualclass.gObj.has_ts_capability && !virtualclass.vutil.isPlayMode()){
        //     virtualclass.vutil.initTechSupportUi();
        // }
        // nirmala
        // var precheckBtn = document.getElementsByClassName('pre-check-btn');
        const precheck = document.getElementById('precheckBtn');
        precheck.addEventListener('click', () => {
          virtualclass.gObj.precheckScrn = true;
          virtualclass.precheck.init(virtualclass.precheck);
        });

        // this.raiseHand = window.raiseHand;
        // this.raiseHand.init();

        // this.rtcIo= window.rtcIo;
        // this.rtcIo.init();

        this.appSetting = window.appSetting;
        this.appSetting.init();

        virtualclass.colorSelector = window.colorSelector;
        if (virtualclassSetting.theme.selectedColor) {
          this.colorSelector.makeThemeReady();
        }

        const virtualclassCont = document.getElementById('virtualclassCont');
        if (virtualclassCont != null) {
          virtualclassCont.classList.add(virtualclass.system.mybrowser.name);
        }

        const fullScreenBtn = document.getElementById('fullScreenButton');
        if (fullScreenBtn != null) {
          fullScreenBtn.addEventListener('click', virtualclass.vutil.Fullscreen);
        }

        const fullScreenExitBtn = document.getElementById('fullScreenExitButton');
        if (fullScreenExitBtn != null) {
          fullScreenExitBtn.addEventListener('click', virtualclass.vutil.closeFullscreen);
        }

        const askfullScreenBtn = document.getElementById('askFullscreen');
        if (askfullScreenBtn != null) {
          askfullScreenBtn.addEventListener('click', virtualclass.vutil.Fullscreen);
        }

        const askfullScreenExitBtn = document.getElementById('askExitFullscreen');
        if (askfullScreenExitBtn != null) {
          askfullScreenExitBtn.addEventListener('click', virtualclass.vutil.closeFullscreen);
        }

        const chat_div = document.getElementById('chat_div');
        const rightSidebarBtn = document.getElementById('sidebarButton');

        if(rightSidebarBtn != null) {
          rightSidebarBtn.addEventListener('click', function () {
            const elem = document.getElementById('virtualclassApp');
            if (elem.classList.contains('openRightbar')) {
              elem.classList.remove('openRightbar');
              elem.classList.add('collapsedRightbar');
              chat_div.classList.add('collapsedRightbar');
              localStorage.setItem('hideRightbar',true);
              virtualclass.gObj.hideRightbar = localStorage.getItem('hideRightbar');
              if (roles.isStudent()) {
                ioAdapter.sendSpeed(3);
              }
            } else {
              localStorage.removeItem('hideRightbar');
              localStorage.setItem('hideRightbar',false);
              virtualclass.gObj.hideRightbar = localStorage.getItem('hideRightbar');
              elem.classList.remove('collapsedRightbar');
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
                if (virtualclass.currApp === 'Poll') {
                  virtualclass.poll.makeGraphResponsive();
                }
              }
            }

            if (virtualclass.currApp === 'ScreenShare') {
              if ((roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing)
                || (roles.isTeacher() && virtualclass.gObj.studentSSstatus.mesharing)) {
                virtualclass.studentScreen.doOpposite = true;
                virtualclass.studentScreen.triggerFitControl();
                virtualclass.ss.triggerFitToScreen();
              }
            } else {
              virtualclass.zoom.doOpposite = true;
              virtualclass.zoom.triggerFitToScreen();
            }
          });
        }

        const virtualclassApp = document.getElementById('virtualclassApp');
        if (virtualclass.gObj.hideRightbar) {
          virtualclassApp.classList.remove('openRightbar');
          virtualclassApp.classList.add('collapsedRightbar');
          chat_div.classList.add('collapsedRightbar');
          ioAdapter.sendSpeed(3);
        } else {
          if (virtualclass.system.device === 'mobTab') {
            const techVideo = document.querySelector('#techVideo.active');
            if (techVideo == null) {
              virtualclass.vutil.sendSpeedByMobile(3);
            }
          }
        }

        document.addEventListener('fullscreenchange', () => {
          virtualclass.onfullscreenchange();
        }, false);

        document.addEventListener('mozfullscreenchange', () => {
          virtualclass.onfullscreenchange();
        }, false);

        document.addEventListener('webkitfullscreenchange', () => {
          virtualclass.onfullscreenchange();
        }, false);

        document.addEventListener('msfullscreenchange', () => {
          virtualclass.onfullscreenchange();
        }, false);

        if (virtualclass.isPlayMode) {
          virtualclass.settings.triggerSettings();
        } else {
          if (virtualclass.vutil.checkUserRole()) { virtualclass.settings.triggerSettings(); }
        }

      },

      onfullscreenchange() {
        console.log('====> on full screen change')
        // On fullscreenchange for rightbarfullscreen
        if(event.target.id == 'virtualclassAppRightPanel') {
          if (!virtualclass.gObj.rightbarFullScreenMode) {
            virtualclass.gObj.rightbarFullScreenMode = true;
            console.log('=====> full screen show ask show exit ');
          } else {
            if(document.getElementById('virtualclassAppRightPanel').classList.contains('fullScreenMode')) {
              document.getElementById('virtualclassAppRightPanel').classList.remove('fullScreenMode');
            }
            console.log('=====> full screen show ask hide exit');
            virtualclass.gObj.rightbarFullScreenMode = false;
            if (!virtualclass.gObj.ignoreFullScreen) {
              virtualclass.vutil.showFullScreenButton();
            }
          }
        } else {
          // On fullscreenchange for full application
          if (!virtualclass.gObj.fullScreenMode) {
            virtualclass.vutil.hideFullScreenButton();
          } else {

            virtualclass.vutil.showFullScreenButton();
          }
        }
        delete virtualclass.gObj.ignoreFullScreen;
      },

      makeReadySocket() {
        if (!virtualclass.vutil.isPlayMode() && virtualclass.config.makeWebSocketReady
          && !virtualclass.gObj.initsocketws) {
          virtualclass.gObj.initsocketws = true;
          this.initSocketConn();
        }
      },

      initSocketConn() {
        if (this.system.webSocket) {
          // io.ioInit({'msg' : virtualclass.uInfo, cmd : 'init'});
          // ioInit.sendToWorker({'msg' : virtualclass.uInfo, cmd : 'init'});
          io.init(virtualclass.uInfo);
          window.userdata = virtualclass.uInfo;
        }
      },

      html: {
        id: 'virtualclassCont',
        optionsClass: 'appOptions',
        init(cthis) {
          this.virtualclass = cthis;
        },

        // TODO this should be created throught the simple html
        // Create left virtualclass app bar
        leftAppBar() {
          // debugger;
          const appsLen = document.getElementsByClassName('appOptions');
          if (appsLen.length > 0) {
            return; // which means the left app bar is already created
          }

          // var appCont = document.getElementById(this.id);

          const appCont = document.querySelector('#virtualclassApp #virtualclassAppLeftPanel');
          const appOptCont = virtualclass.getTemplate('appTools');
          const appOptCont1 = appOptCont();
          // $('#virtualclassAppLeftPanel').append(appOptCont1);
          virtualclass.vutil.insertAppLayout(appOptCont1);
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'errNotScreenShare')) {
            virtualclass.view.disableSSUI();
          }
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'errAppBar')) {
            virtualclass.view.disableLeftAppBar();
          }

          // Fix problem when the role is being reclaimed
          // With current active application is whiteboard
          // appOptCont1.style.zIndex = 100; //to do verify
        },

        createDiv(toolId, text, cmdToolsWrapper, cmdClass, toBeReplace) {
          const ancTag = document.createElement('a');
          ancTag.href = '#';
          //                    if(text == 'documentShare'){
          //                        ancTag.innerHTML = text;
          //                    }
          const lDiv = document.createElement('div');
          lDiv.id = toolId;
          if (typeof cmdClass !== 'undefined') {
            lDiv.className = cmdClass;
          }

          const iconButton = document.createElement('span');
          iconButton.className = `icon-${text}`;
          ancTag.appendChild(iconButton);

          ancTag.dataset.title = virtualclass.lang.getString(text);

          ancTag.className = 'tooltip';

          if (toolId === 'virtualclassWhiteboardTool') {
            // ancTag.dataset.doc = '_doc_0_0';
            ancTag.dataset.doc = `${'_doc_0' + '_'}${virtualclass.gObj.wbCount}`;
          }
          lDiv.appendChild(ancTag);

          if (typeof toBeReplace !== 'undefined') {
            const toBeReplace = document.getElementById('virtualclassScreenShareTool');
            cmdToolsWrapper.replaceChild(lDiv, toBeReplace);
          } else {
            cmdToolsWrapper.appendChild(lDiv);
          }
        },

        // todo transfered into vutility
        createElement(tag, id, _class) {
          const elem = document.createElement(tag);
          if (typeof id !== 'undefined') {
            elem.id = id;
          }

          if (typeof _class !== 'undefined') {
            if (_class.length > 1) {
              for (let i = 0; i < _class.length; i++) {
                elem.className += `${_class[i]} `;
              }
            }
          }
          return elem;
        },
      },

      dispvirtualclassLayout(appId) {
        // console.log('====> My App init ', appId, 'previous ', this.previous);
        if (typeof this.previous !== 'undefined') {
          // TODO this should be handle by better way, this is very rough
          // remove case situation
          if (this.previous.toUpperCase() !== (`virtualclass${this.currApp}`).toUpperCase()) {
            const prevElem = document.getElementById(virtualclass.previous);
            if (prevElem != null) {
              prevElem.style.display = 'none';
              // console.log('====> My App hide', virtualclass.previous);
            }

            if (typeof appId !== 'undefined') {
              if (appId.toUpperCase() === 'EDITORRICH') {
                const editorCode = document.getElementById('virtualclassEditorCode');
                if (editorCode != null) {
                  editorCode.style.display = 'none';
                  // console.log('====> My App hide', appId);
                }
              }
            }
          } else {
            // tricky case  when previous and current are same hide other appilcations but current
            const allApps = document.getElementById('virtualclassCont').getElementsByClassName('virtualclass');
            for (let i = 0; i < allApps.length; i++) {
              allApps[i].style.display = 'none';
              // console.log('====> My App hide', allApps[i].id);
            }
          }
        }
        if (typeof appId !== 'undefined') {
          appId = `virtualclass${capitalizeFirstLetter(appId)}`;
        }
        const appElement = document.getElementById(appId);
        if (appElement != null) {
          appElement.style.display = 'block';
          // console.log('====> My App SHOW', appId);
          // console.log(`App ${appId} block`);
        }
      },

      // makeAppReady(app, cusEvent, data) {
      makeAppReady(setting) {
        if (roles.hasControls()) {
          virtualclass.vutil.triggerFinalizeTextIfAny();
        }
        if (virtualclass.gObj.studentSSstatus.receivedScreenShareRequest){
          virtualclass.popup.closeElem();
          delete virtualclass.gObj.studentSSstatus.receivedScreenShareRequest;
        }

        let app;
        let cusEvent;
        let data;

        if (setting.app) {
          app = setting.app;
        }

        if (setting.cusEvent) {
          cusEvent = setting.cusEvent;
        }

        if (setting.data) {
          data = setting.data;
        }

        virtualclass.dashboard.close();
        const tempApp = virtualclass.vutil.capitalizeFirstLetter(app);
        if (tempApp !== 'ScreenShare') {
          this.currApp = tempApp;
        }

        if (app !== 'DocumentShare') {
          virtualclass.gObj.docPdfFirstTime = false;
        }

        if ((roles.hasControls() && Object.prototype.hasOwnProperty.call(virtualclass, 'previrtualclass'))
          && (app !== virtualclass.apps.ss
          || (virtualclass.gObj.studentSSstatus.mesharing && virtualclass.apps.ss === 'ScreenShare'))) {
          virtualclass.vutil.makeActiveApp(`virtualclass${app}`, virtualclass.previrtualclass);
        }
        // hiding editor controllers from footer
        if (typeof this.previous !== 'undefined') {
          if (this.previous === 'virtualclassEditorRich') {
            const editorType = this.previous.split('virtualclass')[1];
            this.user.control.toggleDisplayEditorController(editorType, 'none');
          } else if (virtualclass.previous === 'virtualclassSharePresentation') {
            virtualclass.sharePt.remvovePLayClass();
          } else if (virtualclass.previous === 'virtualclassVideo') {
            let playingStripbar = document.querySelector('#listvideo .playing');
            if (playingStripbar != null) {
              playingStripbar.classList.remove('playing');
            }
            virtualclass.videoUl.videoUrl = '';
          }
        }

        // if not screen share
        if (app !== virtualclass.apps.ss) {
          this.dispvirtualclassLayout(app);
          const vcContainer = document.getElementById('virtualclassCont');
          virtualclass.vutil.setCurrApp(vcContainer, this.currApp);
          const vcAppContainer = document.querySelector('#virtualclassApp');
          if (vcAppContainer !== null) {
            if (this.currApp === 'DocumentShare' || this.currApp === 'SharePresentation' || this.currApp === 'Video') {
              virtualclass.vutil.setCurrApp(vcAppContainer, vcContainer.dataset.currapp);
            } else {
              vcAppContainer.dataset.currapp = '';
            }
          }
        }

        if (typeof this.prevScreen !== 'undefined'
          && Object.prototype.hasOwnProperty.call(this.prevScreen, 'currentStream')) {
          this.prevScreen.unShareScreen();
        }

        // call the function with passing dynamic variablesc
        if (app === 'SharePresentation') {
          if (`virtualclass${app}` !== virtualclass.previous) {
            // this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
            this.appInitiator[app].call(virtualclass, setting);
          }
        } else if (app === 'DocumentShare') {
          // console.log('====> document shareing 2');
          this.appInitiator[app].call(virtualclass, setting);
          // console.log('====> document shareing 3');
          if (roles.hasControls()) {
            if (!virtualclass.serverData.syncComplete) {
              virtualclass.vutil.triggerDashboard(app);
            } else {
              /* For the request of Docs, we need to hide the popup Dashboard,
               * If the notes order is not available from database then the application
               * shows the popup Dashboard later
               */
              virtualclass.vutil.triggerDashboard(app, 'hidepopup');
              // console.log('====> document shareing 4');
            }
            if (virtualclass.dts.noteExist()) {
              virtualclass.zoom.normalRender();
            }
          } else if (!virtualclass.dts.noteExist()) {
            virtualclass.vutil.hidePageNumber();
          }
          // virtualclass.zoom.zoomAction('fitToScreen');
        } else {
          if (app === 'Whiteboard') {
            if (typeof this.orderList[app] !== 'object') {
              this.orderList[app] = new OrderedList();
            }
            // this.handleWhiteboardReady(arguments, cusEvent, data);
            this.handleWhiteboardReady(app, cusEvent, data);
            if (virtualclass.currApp === 'Whiteboard') {
              // To maintain the scale on whiteboard
              virtualclass.zoom.normalRender();
              virtualclass.zoom.fitToElementTooltip('fitToScreen');
            }
          } else {
            let hidepopup;
            const currVideo = Array.prototype.slice.call(arguments)[2];

            // this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
            this.appInitiator[app].call(virtualclass, setting);

            if (currVideo && currVideo.init && currVideo.init.videoUrl && currVideo.fromReload) {
              hidepopup = true;
            }

            if (roles.hasControls() && app === 'Video') {
              if (`virtualclass${app}` !== virtualclass.previous) {
                const dashboardnav = document.querySelector('#dashboardnav button');
                if (dashboardnav != null) {
                  dashboardnav.setAttribute('data-currapp', 'Video');
                  if (dashboardnav.classList.contains('clicked')) {
                    dashboardnav.classList.remove('clicked');
                  }
                }
              }
              virtualclass.vutil.triggerDashboard(app, hidepopup);
            }
          }
        }

        this.previrtualclass = this.previous;

        if (app !== 'Video' && Object.prototype.hasOwnProperty.call(virtualclass, 'videoUl')
          && Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'player')) {
          virtualclass.videoUl.destroyPlayer();
        }


        if (roles.hasControls()) {
          const currVideo = Array.prototype.slice.call(arguments)[2];
          if (app !== 'ScreenShare' && (virtualclass.currApp === 'SharePresentation'
            || (virtualclass.currApp === 'Video'))) {
            virtualclass.dashboard.initDashboardNav(currVideo);
          } else if (virtualclass.currApp !== 'DocumentShare') {
            virtualclass.vutil.removeDashboardNav();
          }
        }

        // virtualclass.userInteractivity.makeReadyContext();
      },

      // TODO, this and app inittiator should be merged
      handleWhiteboardReady(app, cusEvent, data) {
        // console.log('=====> Handle whiteboard ');
        data = (data !== undefined) ? data : '_doc_0_0';
        const setting = { app: app, cusEvent: cusEvent, data: data, container: 'virtualclassWhiteboard' }
        this.appInitiator.Whiteboard.call(virtualclass, setting);
      },

      whitboardWrapper(wbId) {
        // console.log('=== Whiteboard wrapper ', wbId);
        const whiteboard = document.createElement('div');
        whiteboard.className = 'whiteboard';

        whiteboard.dataset.wid = wbId;
        whiteboard.id = `cont${whiteboard.dataset.wid}`;
        const params = wbId.split('_');
        const slide = `${params[2]}_${params[3]}`;

        const query = `.note[data-slide='${slide}']`;
        const elem = document.querySelector(query);
        if (elem != null) {
          elem.insertBefore(whiteboard, elem.firstChild);
          // console.log('====> suman whiteboard canvas is created');
          // console.log('##==jai 3b ', slide);
          // virtualclass.vutil.createWhiteBoard(whiteboard.dataset.wid);
        }
      },

      // Helper functions for making the app is ready
      appInitiator: {
        Whiteboard(setting) {
          let app;
          let cusEvent;
          let id;
          let position;
          ({ app, cusEvent, position, ...setting } = setting);
          if (setting.data) id = setting.data;

          // console.log('##==jai 3c ', virtualclass.currApp, virtualclass.gObj.currWb);

          virtualclass.gObj.currWb = id;

          /**
           *  We can not use passed app, because from document share app, it will pass the whiteboard as app
           *  and we require the object orderList according to app, like  orderList.Whiteboard and orderList.DocumentShare
           *  using app make orderList.Whiteboard in both case
           * */

          if (typeof this.orderList[virtualclass.currApp] === 'object'
            && this.orderList[virtualclass.currApp].ol.order.indexOf(virtualclass.gObj.currWb) <= -1
            && virtualclass.currApp !== 'DocumentShare' && virtualclass.gObj.currWb.length <= 10) {
            // virtualclass.gObj.currWb.length < 10, to check id is related to document sharing or not
            // Find the better way to replace the condition virtualclass.gObj.currWb.length <= 10
            if (position != undefined) {
              this.orderList[virtualclass.currApp].insert(virtualclass.gObj.currWb, null, position);
            } else {
              this.orderList[virtualclass.currApp].insert(virtualclass.gObj.currWb, null);
            }
          }

          if (virtualclass.currApp === 'Whiteboard') {
            virtualclass.gObj.currentWbSlide = virtualclass.gObj.currWb;
          }

          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'getDocumentTimeout')) {
            clearTimeout(virtualclass.gObj.getDocumentTimeout);
          }

          if (virtualclass.isPlayMode) {
            virtualclass.gObj.getDocumentTimeout = setTimeout(() => {
              if (app === 'DocumentShare') {
                this.whitboardWrapper(id);
              }
              this.appInitiator.whiteboardActual.call(this, app, cusEvent, id);
              virtualclass.gObj.getDocumentTimer = false;
            }, 100);
          } else if (virtualclass.gObj.getDocumentTimer == null || virtualclass.gObj.getDocumentTimer === false) {
            virtualclass.gObj.getDocumentTimer = true;
            if (app === 'DocumentShare') {
              this.whitboardWrapper(id);
            }
            this.appInitiator.whiteboardActual.call(this, app, cusEvent, id);
            virtualclass.gObj.getDocumentTimeout = setTimeout(() => {
              virtualclass.gObj.getDocumentTimer = false;
            }, 1000);
          } else {
            virtualclass.gObj.getDocumentTimeout = setTimeout(() => {
              if (app === 'DocumentShare') {
                this.whitboardWrapper(id);
              }
              this.appInitiator.whiteboardActual.call(this, app, cusEvent, id);
              virtualclass.gObj.getDocumentTimer = false;
            }, 300);
          }

          this.previous = this.wbConfig.id;
        },


        whiteboardActual(app, cusEvent, id) {
          virtualclass.gObj.readyToCreate = true;
          // console.log('====> call whiteboard actual');
          let whiteboardContainer;
          if (app === 'Whiteboard') {
            whiteboardContainer = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
            // virtualclass.wbCommon.indexNav.updateNavigation();
          } else {
            whiteboardContainer = document.getElementById(`cont${id}`);
          }

          if (whiteboardContainer == null) {
            return;
          }

          // console.log('##==jai, whiteboard actual ' + id);

          let vcan;
          if (typeof this.ss === 'object') {
            this.ss.prevStream = false;
          }

          if (roles.hasControls() && typeof this.previous !== 'undefined' && typeof cusEvent !== 'undefined'
          && cusEvent === 'byclick' && roles.hasControls() && app === 'Whiteboard') {
            virtualclass.vutil.beforeSend({ dispWhiteboard: true, cf: 'dispWhiteboard', d: id });
          }

          virtualclass.gObj.currWb = id;
          const wid = id;

          if (typeof this.pdfRender[wid] !== 'object') {
            this.pdfRender[wid] = window.pdfRender();
          }

          if (typeof id !== 'undefined') {
            if (typeof this.wb[id] !== 'object') {
              if (typeof this.wb !== 'object') {
                this.wb = {};
              }

              virtualclass.gObj.commandToolsWrapperId[id] = `commandToolsWrapper${id}`;
              this.wb[id] = {};
              virtualclass.gObj.tempReplayObjs[id] = [];
              // console.log('====> vcan is creating', id, ' ', id, ' ', virtualclass.wb[id].vcan);
              // console.log('====> jai 1 ', id, ' ', virtualclass.wb[id].vcan);
              this.wb[id] = new window.whiteboard(this.wbConfig, id);
              // console.log('=====> whiteboard ready 1');
              let wbHtml;
              let canvas;
              // console.log('====> jai 2 ', id, ' ', virtualclass.wb[id].vcan);

              if (app === 'Whiteboard') {
                if (roles.hasControls() && !virtualclass.gObj.wbInitHandle) {
                  virtualclass.wbCommon.initNavHandler();
                  virtualclass.gObj.wbInitHandle = true;
                }
              }
              // console.log('====> jai 3 ', id, ' ', virtualclass.wb[id].vcan);

              if (whiteboardContainer !== null) {
                if (document.querySelector(`vcanvas${id}`) === null) {
                  const wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
                  if (app === 'Whiteboard') {
                    virtualclass.wbCommon.hideElement();
                    const wnoteid = `note${id}`;
                    const wnote = document.querySelector(`#${wnoteid}`);
                    if (wnote !== null) {
                      console.log('udit current ', id);
                      wnote.classList.add('canvasContainer', 'current');
                      wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
                      wnote.innerHTML = wbHtml;
                    } else {
                      console.log('udit current ', id);
                      wbHtml = `<div id='${wnoteid}' data-wb-id='${id}' class='canvasContainer current'>${wbTemplate({
                        cn: id,
                        hasControl: roles.hasControls(),
                      })}</div>`;

                      if (id !== '_doc_0_0') {
                        whiteboardContainer.insertAdjacentHTML('beforeend', wbHtml);
                      } else {
                        whiteboardContainer.innerHTML = wbHtml;
                        const vcanvasDoc = document.querySelector('#note_doc_0_0');
                        if (vcanvasDoc !== null) {
                          vcanvasDoc.classList.add('current');
                        }
                      }
                    }
                  } else {
                    wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
                    whiteboardContainer.innerHTML = wbHtml;
                  }
                  canvas = document.querySelector(`#canvas${id}`);
                }
                // console.log('====> jai 4 ', id, ' ', virtualclass.wb[id].vcan);

                this.wb[id].utility = new window.utility();
                this.wb[id].alreadyReplay = false;
                this.wb[id].packContainer = new window.packContainer();
                this.wb[id].draw_object = window.draw_object;
                this.wb[id].makeobj = window.makeobj;
                this.wb[id].readyFreeHandObj = window.readyFreeHandObj;
                this.wb[id]._replay = _replay;
                this.wb[id].readyTextObj = window.readyTextObj;
                this.wb[id].bridge = window.bridge;
                this.wb[id].response = window.response;
                virtualclass.wb[id].utility.displayCanvas(id);
                // console.log('====> jai 5 ', id, ' ', virtualclass.wb[id].vcan);

                if (roles.hasControls()) {
                  virtualclass.wb[id].attachToolFunction(virtualclass.gObj.commandToolsWrapperId[id], true, id);
                }
                // console.log('====> jai 6 ', id, ' ', virtualclass.wb[id].vcan);
                // console.log(`##==jai, whiteboard 2 ` + id);
                if (app === 'DocumentShare') {
                  const { currNote } = virtualclass.dts.docs.note;
                  // console.log('##==jai.1', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                  virtualclass.pdfRender[wid].init(canvas, currNote);
                  // console.log('##==jai.2', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                } else {
                  // console.log('##==jai.3', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                  virtualclass.pdfRender[wid].init(canvas);
                  // console.log('##==jai.4', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                }
              } else {
                alert('whiteboard container is null');
              }
            } else {
              const commonWrapperId = `commandToolsWrapper${id}`;
              const commandToolsWrapper = document.getElementById(`commandToolsWrapper${id}`);
              if (commandToolsWrapper == null && roles.hasControls()) {
                virtualclass.wb[id].attachToolFunction(commonWrapperId, true, id);
              }
            }
            // console.log('====> jai 7 ', id, ' ', id, ' ', virtualclass.wb[id].vcan);
            vcan = virtualclass.wb[id].vcan;
            // this.previous = this.wbConfig.id;
          } else {
            alert('id is undefined');
          }

          virtualclass.zoom.init();
          const activeWbTool = localStorage.getItem('activeTool');
          if (activeWbTool !== null) {
            const activeWbToolElem = document.querySelector(`#${activeWbTool}`);
            if (activeWbToolElem !== null) {
              activeWbToolElem.classList.add('active');
              virtualclass.wb[wid].prvTool = activeWbTool;
            }
          }

          if (roles.hasControls()) {
            if (document.getElementById(`canvas${id}`) !== null) {
              vcan.utility.canvasCalcOffset(vcan.main.canid);
              virtualclass.wb[id].utility.makeCanvasEnable();
            }

            /** TODO, move code to utilit.js and should not be invoked from here **/
            console.log('=====> whiteboard mouse up ');
            virtualclass.vutil.attachWhiteboardPopupHandler(id);
          } else {
            if (roles.isStudent() && app === 'Whiteboard') {
              virtualclass.wbCommon.setCurrSlideNumber(id);
            }
          }

          // if (typeof virtualclass.wb.indexNav === 'undefined') {
          //   virtualclass.wb.indexNav = new virtualclass.pageIndexNav('WB');
          // }

          if (app === 'Whiteboard') {
            if (typeof virtualclass.wbCommon.indexNav === 'undefined') {
              virtualclass.wbCommon.indexNav =  new pageIndexNav('WB');
            }

            if (!virtualclass.gObj.wbRearrang) {
              const wIds = this.orderList.Whiteboard.ol.order;
              if (wIds !== null) {
                if (wIds.length > 0) {
                  virtualclass.wbCommon.readyElements(wIds);
                  virtualclass.gObj.wbRearrang = true;
                }
              }
            }
            virtualclass.wbCommon.initNav(virtualclass.orderList.Whiteboard.ol.order);
            if (roles.hasControls()) {
              if (virtualclass.gObj.wbRearrang) {
                virtualclass.wbCommon.indexNav.addActiveNavigation(id);
              }
              virtualclass.wbCommon.identifyFirstNote(id);
              virtualclass.wbCommon.identifyLastNote(id);
            }

            virtualclass.wbCommon.indexNav.updateNavigation();
          }
          if (virtualclass.currApp === 'Whiteboard') virtualclass.userInteractivity.makeReadyContext();
        },

        ScreenShare(setting) {
          let app = setting.app;
          if (typeof this.ss !== 'object') {
            this.ss = new window.screenShare(virtualclass.ssConfig);
          }
          this.ss.init({ type: 'ss', app });
        },

        Yts(app, custEvent, videoObj) {
          // this.dispvirtualclassLayout(virtualclass.ytsConfig.id);
          // if there is not already sharing the youtube video
          if (typeof videoObj !== 'undefined' && videoObj != null) {
            virtualclass.yts.init(videoObj);
          } else {
            // only display the layout if youtube is not sharing
            if (document.querySelector('iframe#player') == null) {
              virtualclass.yts.init();
            }
          }

          this.previous = virtualclass.ytsConfig.id;
        },

        EditorRich(setting) {
          this.appInitiator.editor.call(virtualclass, setting);
        },

        EditorCode(setting) {
          this.appInitiator.editor.call(virtualclass, setting);
        },

        SharePresentation(setting) {
          let app;
          let cusEvent
          if (setting.app) {
            app = setting.app;
          }

          if (setting.cusEvent) {
            cusEvent = setting.cusEvent;
          }

          if (typeof this.ss === 'object') {
            this.ss.prevStream = false;
          }

          this.sharePt = new window.sharePt();

          // console.log(virtualclass.sharePt.pptUrl);
          this.sharePt.init(app, cusEvent);
          // console.log(virtualclass.sharePt.pptUrl);
          this.previous = virtualclass.ptConfig.id;
          virtualclass.sharePt.attachMessageEvent('message', virtualclass.sharePt.pptMessageEventHandler);
        },

        Poll() {
          this.userListEnable();
          virtualclass.poll.init();
        },
        Quiz() {
          this.userListEnable();
          virtualclass.quiz.init();
        },


        Video(app, custEvent, videoObj) {
          if (typeof videoObj !== 'undefined' && videoObj != null) {
            if (typeof videoObj.type === 'undefined') {
              virtualclass.videoUl.init(videoObj);
            } else if (videoObj.type === 'video_yts') {
              virtualclass.videoUl.init();
              // virtualclass.yts.init(videoObj, videoObj.startFrom);
            } else {
              virtualclass.videoUl.init();
            }
          } else {
            virtualclass.videoUl.init();
          }
        },

        editor(setting) {
          const app = setting.app;
          this.user.control.toggleDisplayEditorController(app.substring(app.indexOf('virtualclass'), app.length), 'block');
          const revision = 0;
          const clients = [];
          const docs = '';
          const operations = '';

          if (app === virtualclass.apps.er) {
            virtualclass.editorRich.init(revision, clients, docs, operations);
            this.previous = virtualclass.edConfig.id;
          } else {
            virtualclass.editorCode.init(revision, clients, docs, operations);
            this.previous = virtualclass.edCodeConfig.id;
          }

          // const writeMode = JSON.parse(localStorage.getItem(virtualclass.vutil.smallizeFirstLetter(app)));
          const writeMode = (virtualclass.editorRich) ? virtualclass.editorRich.editorStatus : false;
          if (roles.isStudent()) {
            const etType = virtualclass.vutil.smallizeFirstLetter(app);
            if (!writeMode) {
              this[etType].cm.setOption('readOnly', 'nocursor');
            } else {
              this[etType].cm.setOption('readOnly', false);
            }
            this.user.control.toggleDisplayWriteModeMsgBox(app, writeMode);
            virtualclass.vutil.setReadModeWhenTeacherIsDisConn(etType);
          }
        },


        // SharePresentation: function(app, cusEvent) {
        // if (typeof this.ss == 'object') {
        //    this.ss.prevStream = false;
        // }

        makeReadyDocumentShare() {
          if (Object.prototype.hasOwnProperty.call(virtualclass.dts.docs, 'currDoc')) {
            if (roles.hasControls()) {
              // console.log('====> DOCUMENT SHARE SUMAN 1');
              ioAdapter.mustSend({ dts: { init: 'studentlayout' }, cf: 'dts' });
            }

            const slide = virtualclass.dts.docs.currNote;
            if (typeof slide !== 'undefined') {
              virtualclass.vutil.updateCurrentDoc(slide);
            }
          }
          virtualclass.previous = virtualclass.dtsConfig.id;

        },

        DocumentShare(setting) {
          let data;
          if (setting.data) {
            data = setting.data;
          }

          if (!Object.prototype.hasOwnProperty.call(virtualclass, 'dts') || virtualclass.dts == null) {
            virtualclass.dts = window.documentShare();
          } else {
            // console.log('====> document shareing 2b');
            virtualclass.dts.indexNav.init();
            if (data != null) {
              if (data.slideTo) {
                const note = document.getElementById(data.slideTo);
                virtualclass.dts.docs.note.getScreen(note);
              } else if (data.init && virtualclass.dts.docs.currNote !== 0
                && !(virtualclass.dts.pdfRender
                && typeof virtualclass.dts.pdfRender[`_doc_${virtualclass.dts.docs.currNote}_${virtualclass.dts.docs.currNote}`] === 'object')) {
                const note = document.getElementById(`note${virtualclass.dts.docs.currNote}`);
                if (note != null) {
                  virtualclass.dts.docs.note.getScreen(note);
                } else {
                  console.log('note/slide container is not ready yet');
                }

              }
            }
          }

          if (typeof virtualclass.dts.indexNav === 'undefined') {
            virtualclass.dts.indexNav = new virtualclass.pageIndexNav('documentShare');
          }


          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'docs')) {
            // console.log('====> document shareing 2c');
            virtualclass.appInitiator.makeReadyDocumentShare();
            virtualclass.dashboard.initDashboardNav();

            // Open the document dashboard if there is no any note to display
            if (virtualclass.serverData.syncComplete && !virtualclass.dts.noteExist()) {
              const dashboardnav = document.querySelector('#dashboardnav button');
              if (dashboardnav != null) {
                virtualclass.dashboard.open();
              }
            }

            if (virtualclass.gObj.currWb != null
              && typeof virtualclass.pdfRender[virtualclass.gObj.currWb] !== 'undefined'
              && virtualclass.currApp === 'DocumentShare') {
              if (virtualclass.orderList.DocumentShare.ol.order.length > 0) {
                // if (typeof virtualclass.dts.indexNav === 'undefined') {
                //   virtualclass.dts.indexNav = new virtualclass.pageIndexNav('documentShare');
                // }
                if (roles.hasControls()) {
                  virtualclass.dts.indexNav.createIndex();
                  virtualclass.userInteractivity.makeReadyContext();
                } else {
                  virtualclass.dts.indexNav.studentDocNavigation(virtualclass.dts.docs.currNote);
                }
              }
            }
          }

          const reload = document.querySelector('#virtualclassAppLeftPanel .zoomControler .reloadNote span');
          if (reload) {
            reload.setAttribute('data-title', virtualclass.lang.getString('reloadDoc'));
          }
        },

        MultiVideo() {
          const that = this;

          if (!Object.prototype.hasOwnProperty.call(that.multiVideo, 'initDone')) {
            // TODO remove setTimeout
            setTimeout(
              () => {
                that.appInitiator.MultiVideo.apply(virtualclass);
              }, 2000,
            );
          } else {
            that.multiVideo._init();
          }
          this.previous = virtualclass.mvConfig.id;
        },
      },

      attachFunction() {
        let that;
        const allAppOptions = document.getElementsByClassName('appOptions');
        for (let i = 0; i < allAppOptions.length; i++) {
          const anchTag = allAppOptions[i].getElementsByTagName('a')[0];
          // DON'T attach editor code tool
          if (allAppOptions[i].id !== 'virtualclassEditorCodeTool') {
            that = this;
            anchTag.onclick = function () {
              // console.log('==== DST init click');
              that.initlizer(this);
            };
          }
        }
      },

      initlizer(elem) {
        // console.log('====> modal trigger');
        let appName = elem.parentNode.id.split('virtualclass')[1];
        if (appName === 'SessionEndTool') {
          virtualclass.popup.confirmInput(virtualclass.lang.getString('startnewsession'),
            (confirm) => {
              if (!confirm) {
                // console.log('Not start new session');
                return;
              }

              virtualclass.gObj.endSession = true;
              // if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'beTeacher') && roles.isTeacher()) {
              //   // localStorage.setItem('uRole', 't');
              // }
              localStorage.clear();

              const allFinish = new Promise(((resolve) => {
                virtualclass.gObj.sessionEndResolve = resolve;
                virtualclass.clearSession();
              }));

              allFinish.then(() => {
                delete virtualclass.gObj.sessionEndResolve;
                virtualclass.popup.sesseionEndWindow();
              }, (error) => {
                // console.log(`ERRROR ${error}`);
              });
            });
        } else {
          appName = appName.substring(0, appName.indexOf('Tool'));
          if (!this.PrvAndCurrIsWss(this.previous, appName)) {
            if (virtualclass.currApp === 'DocumentShare') {
              virtualclass.gObj.screenRh = 160;
            }
            // console.log('==== DST init makeAppReady');
            // this.makeAppReady(appName, 'byclick');
            const setting = { app: appName, cusEvent: 'byclick' };
            if (appName === 'Whiteboard') {
              // setting.data = document.querySelector('#virtualclassWhiteboard .canvasContainer.current').dataset.wbId;
              setting.data = virtualclass.gObj.currentWbSlide;
            } else if (appName === 'DocumentShare') {
              const currentNoteElem = document.querySelector('#screen-docs .note.current');
              if (currentNoteElem !== null) {
                const currentNote = `_doc_${currentNoteElem.dataset.slide}_${currentNoteElem.dataset.slide}`;
                if (typeof virtualclass.pdfRender[currentNote] !== 'object') {
                  setting.data = { slideTo: currentNoteElem.id };
                }
              }
            }

            this.makeAppReady(setting);
            setTimeout(
              () => {
                virtualclass.gObj.screenRh = 60;
              },
              1500,
            );
          } else {
            alert(virtualclass.lang.getString('screensharealready'));
          }
        }
        if (appName !== 'ScreenShare') {
          virtualclass.vutil.removeClass('audioWidget', 'fixed');
        }
      },

      PrvAndCurrIsWss(previous, appName) {
        return !!((previous === 'virtualclassWholeScreenShare' && appName === virtualclass.apps.yt));
      },

      setPrvUser() {
        const prvUser = {
          id: wbUser.id,
          room: wbUser.room,
          role: wbUser.role,
          settings: virtualclassSetting.settings,
        };
        // console.log('previosu user');
        localStorage.setItem('prvUser', JSON.stringify(prvUser));
        // console.log('====> Settings store', virtualclassSetting.settings);
      },

      registerPartial() {
        const contPara = { whiteboardPath };

        /** Registering the partials which have setting paramter * */
        const initTemplates = ['precheck', 'rightBarHeader', 'teacherVideo', 'audioWidget', 'appTools', 'popupCont', 'appToolsMeeting', 'appSettingDetail', 'joinclass'];

        const isControl = { hasControl: roles.hasControls() };
        let context;
        for (let i = 0; i < initTemplates.length; i++) {
          context = null;
          if (initTemplates[i] === 'precheck' || initTemplates[i] === 'popupCont') {
            context = contPara;
          } else if (initTemplates[i] === 'audioWidget') {
            context = virtualclassSetting;
            context.isControl = roles.hasControls();
            context.isMettingMode = (virtualclass.gObj.meetingMode) && (roles.isStudent());
          } else if (initTemplates[i] === 'teacherVideo' || initTemplates[i] === 'appTools'
            || initTemplates[i] === 'appSettingDetail') {
            context = isControl;
          } else if (initTemplates[i] === 'rightBarHeader') {
            context = { std: roles.isStudent(), isPlayMode: virtualclass.isPlayMode };
          }
          this.makeReadyTemplate(initTemplates[i], context);
        }

        /** Registering the partials which does not have context * */
        Handlebars.registerPartial({
          docNotesMain: this.getTemplate('notesMain', 'documentSharing'),
          whiteboardToolbar: this.getTemplate('toolbar', 'whiteboard'),
          rightBar: this.getTemplate('rightBar'),
          recordingControl: this.getTemplate('recordingControl'),
          leftBar: this.getTemplate('leftBar'),
          footerBar: this.getTemplate('footerBar'),
          mobileLandscapeWarn: this.getTemplate('mobileLandscapeWarn'),
          main: this.getTemplate('main'),
          whiteboard: this.getTemplate('main', 'whiteboard'),
          dashboardCont: this.getTemplate('dashboardCont'),
          multiVideo: this.getTemplate('multiVideo'),

        });
      },

      registerHelper() {
        /** helper who returns the language String For template* */
        Handlebars.registerHelper('getString', string =>
          // console.log('Language ' + string);
          virtualclass.lang.getString(string));

        /** For debugging the handlebars code * */
        Handlebars.registerHelper('debug', function (optionalValue) {
          // console.log('Current Context');
          // console.log('====================');
          // console.log(this);

          if (optionalValue) {
            // console.log('Value');
            // console.log('====================');
            // console.log(optionalValue);
          }
        });

        Handlebars.registerHelper('getVideoType', (optionalValue) => {
          if (virtualclass.gObj.meetingMode) {
            return 'multiVideo';
          }
          return 'teacherVideo';
        });
      },

      // the same function is defining at script.js
      createMainContainer() {
        const mainContainer = document.querySelector(`#${virtualclass.html.id}`);
        this.registerHelper();
        this.registerPartial();
        /** Inserting the main container of virtualclass * */
        const mainTemplate = this.getTemplate('main');

        const mainCont = {
          isPlay: virtualclass.isPlayMode,
          hasControls: roles.hasControls(),
          meetingMode: virtualclass.gObj.meetingMode,
        };

        const mainHtml = mainTemplate(mainCont);

        mainContainer.insertAdjacentHTML('afterbegin', mainHtml);
      },

      makeReadyTemplate(tempname, context) {
        const template = JST[`${virtualclass.gObj.tempPrefix}/${tempname}.hbs`];
        Handlebars.registerPartial(tempname, template(context));
      },

      /**
       *  This function returns the template
       *  name expects the template name
       *  submodule expects the sub folder
       */
      getTemplate(name, submodule) {
        let template;
        if (typeof submodule === 'undefined') {
          template = JST[`${virtualclass.gObj.tempPrefix}/${name}.hbs`];
        } else {
          template = JST[`${virtualclass.gObj.tempPrefix}/${submodule}/${name}.hbs`];
        }
        return template;
      },

      isMiniFileIncluded(src) {
        const filePatt = new RegExp(`${src}.js?=\*([0-9]*)`); // matched when src is mid of path, todo find it at end of path
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          if (filePatt.test(scripts[i].src)) {
            return true;
          }
        }
        return false;
      },

      stickybarWidth() {
        const leftBarWidth = (document.querySelector('#virtualclassApp #virtualclassAppLeftPanel').offsetWidth) + 'px';
        document.querySelector('#stickybar').style.width = leftBarWidth;
      },

      // chatBarTabWidth() {
      //   const rightBarWidth = (document.querySelector('#virtualclassApp #virtualclassAppRightPanel').offsetWidth) + 'px';
      //   document.querySelector('.chatBarTab').style.width = rightBarWidth;
      // },

      removeSharingClass() {
        const virtualclassCont = document.querySelector('#virtualclassCont');
        if (virtualclassCont) {
          virtualclassCont.classList.remove('studentScreenSharing');
          document.querySelector('#chat_div').classList.remove('studentScreenSharing');
        }
      },

      clearAllChat() {
        localStorage.removeItem(virtualclass.gObj.uid); // remove chat about user
        localStorage.clear('chatroom'); // all
        if (virtualclass.chat != null) {
          virtualclass.chat.idList.length = 0;
        }

        clearAllChatBox();

        const allChat = document.getElementById('chatWidget').getElementsByClassName('ui-chatbox-msg');
        if (allChat.length > 0) {
          while (allChat[0] != null) {
            allChat[0].parentNode.removeChild(allChat[0]);
          }
        }
      },
      userListEnable() {
        const userList = document.querySelector('#user_list');
        if (userList) {
          userList.click();
        }
      },

    };

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };
}(window));
