(function (window) {
  window.virtualclass = function () {
    /** TODO, this below data should be move into config ** */
    const dstData = null;
    const playMode = (wbUser.virtualclassPlay != '' ? parseInt(wbUser.virtualclassPlay, 10) : 0);
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
        next: {}, // prefetch next pdf
        uid: window.wbUser.id,
        uRole: window.wbUser.role,
        uName: window.wbUser.name,
        tempReplayObjs: {}, // for store temp replayObjs
        // commandToolsWrapperId: 'commandToolsWrapper',
        commandToolsWrapperId: {},
        editorInitDone: 0,
        resize: false,
        has_ts_capability: !!((wbUser.ts == 1 || wbUser.ts == true)),
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
        docOrder: {},
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
        lastmousemovetime: null,
        CDTimer: null,
        wbData: {},
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
        if (Object.prototype.hasOwnProperty.call(virtualclass, 'prevScreen') && Object.prototype.hasOwnProperty.call(virtualclass.prevScreen, 'currentStream')) {
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

      async init(urole, app, videoObj) {
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

        // this actually is particular session, it can be anything like course, particular activity on course
        // for example, in moodle this is course moodle id,
        // with other sysytem it might differ.

        this.gObj.congCourse = typeof (window.congCourse != 'undefiend') ? window.congCourse : 0;

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

        // this.wssConfig = { id : "virtualclass" + virtualclass.apps.yt, classes : "appOptions"};
        // this.user = new window.user();
        // this.lang.getString = window.getString;
        // this.lang.message = window.message;
        // this.vutil = window.vutil;
        // this.media = window.media
        this.sharePt = window.sharePt;
        this.fineUploader = window.fineUploader;

        // this.system = window.system;

        // this.recorder = window.recorder;
        this.converter = converter;
        this.clear = '';
        this.currApp = this.vutil.capitalizeFirstLetter(app);
        // this.storage = window.storage;
        this.dashBoard = dashBoard;
        this.multiVideo = window.MultiVideo;
        this.vutil.isChromeExtension();

        this.pageNavigation = window.pageIndexNav;
        this.modal = window.modal;
        // this.settings = window.settings;
        // virtualclass.settings.init();

        this.zoom = window.zoomWhiteboard();
        virtualclass.pageIndexNav = window.pageIndexNav;

        // if (this.system.isIndexedDbSupport()) {
        //   await this.storage.init();
        // } else {
        //   console.log('Indexeddb does not support');
        // }

        // this.pdfRender = window.pdfRender();
        if (this.currApp != 'Quiz' && virtualclass.gObj.CDTimer != null) {
          clearInterval(virtualclass.gObj.CDTimer != null);
        }

        virtualclass.modernizr = Modernizr;
        this.system.webpInit();

        this.dirtyCorner = window.dirtyCorner;
        this.html.init(this);
        this.adapter = window.adapter;


        if (!Object.prototype.hasOwnProperty.call(virtualclass.system.mybrowser, 'name')) {
          this.system.setBrowserDetails();
        }

        virtualclass.api = api;

        virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
        virtualclass.xhr = window.xhr;
        virtualclass.xhr.init();

        /** This both have to merge * */
        virtualclass.xhrn = window.xhrn;

        virtualclass.xhrn.init();

        virtualclass.xhrn.getAccess();
        if (virtualclass.vutil.isPlayMode()) {
          virtualclass.recorder.requestListOfFiles();
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
        // virtualclass.zoom = window.zoomWhiteboard();
        if (virtualclass.vutil.isSessionEnded()) {
          return true;
        }


        // console.log('==== session clear zoom object ready ');
        virtualclass.network = new Network();
        virtualclass.gesture = gesture;
        /*  virtualclass.pageIndexNav=window.pageIndexNav; */

        // virtualclass.settings.recording = recordSettings;
        // virtualclass.settings.recording.init();

        this.serverData = serverData;
        if (roles.hasControls()) {
          // this.serverData.fetchAllData(); // gets all data from server at very first
          virtualclass.serverData.syncAllData();
        }
        if (localStorage.uRole != null) {
          virtualclass.gObj.uRole = localStorage.uRole; // this done only for whiteboard in _init()
          vcContainer.classList.add(virtualclass.vutil.getClassName(virtualclass.gObj.uRole));
        }

        if (typeof videoObj === 'undefined' || videoObj == null) {
          await this.makeAppReady(app, 'byclick');
        } else {
          await this.makeAppReady(app, 'byclick', videoObj);
        }

        // TODO system checking function should be invoked before makeAppReady

        this.system.check();
        this.vutil.isSystemCompatible(); // this should be at environment-validation.js file

        this.pageVisible = virtualclass.vutil.pageVisible();


        if (app == virtualclass.apps.ss) {
          this.system.setAppDimension();
        }


        // To teacher
        virtualclass.user.readyLeftBar(virtualclass.gObj.uRole, app);
        this.media = new window.media();

        //  this.gObj.video.audioVisual.init();

        var precheck = localStorage.getItem('precheck');
        if (precheck != null) {
          precheck = JSON.parse(precheck);
        }

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
        var precheck = document.getElementById('precheckBtn');
        precheck.addEventListener('click', () => {
          virtualclass.gObj.precheckScrn = true;
          virtualclass.precheck.init(virtualclass.precheck);
        });

        this.raiseHand = window.raiseHand;
        this.raiseHand.init();

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

        document.onfullscreenchange = function (event) {
          if (!virtualclass.gObj.fullScreenMode) {
            document.querySelector('#fullScreenButton').style.display = 'none';
            document.querySelector('#fullScreenExitButton').style.display = 'block';
            virtualclass.gObj.fullScreenMode = true;
          } else {
            document.querySelector('#fullScreenButton').style.display = 'block';
            document.querySelector('#fullScreenExitButton').style.display = 'none';
            virtualclass.gObj.fullScreenMode = false;
          }
        };
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
          if (typeof cmdClass !== 'undefined ') {
            lDiv.className = cmdClass;
          }

          const iconButton = document.createElement('span');
          iconButton.className = `icon-${text}`;
          ancTag.appendChild(iconButton);

          ancTag.dataset.title = virtualclass.lang.getString(text);

          ancTag.className = 'tooltip';

          if (toolId == 'virtualclassWhiteboardTool') {
            // ancTag.dataset.doc = '_doc_0_0';
            ancTag.dataset.doc = `${'_doc_0' + '_'}${virtualclass.gObj.wbCount}`;
          }
          lDiv.appendChild(ancTag);

          if (typeof toBeReplace !== 'undefined') {
            var toBeReplace = document.getElementById('virtualclassScreenShareTool');
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

      // TODO dispvirtualclassLayout should be renamed it with dispvirtualclassLayout
      dispvirtualclassLayout(appId) {
        if (typeof this.previous !== 'undefined') {
          // TODO this should be handle by better way, this is very rough
          // remove case situation
          if (this.previous.toUpperCase() != (`virtualclass${this.currApp}`).toUpperCase()) {
            // try{
            const prevElem = document.getElementById(virtualclass.previous);
            if (prevElem != null) {
              prevElem.style.display = 'none';
            }

            if (typeof appId !== 'undefined') {
              if (appId.toUpperCase() == 'EDITORRICH') {
                const editorCode = document.getElementById('virtualclassEditorCode');
                if (editorCode != null) {
                  editorCode.style.display = 'none';
                }
              } else {
                // console.log(`EditorRich can not be display:none ${appId}`);
              }

              if (appId.toUpperCase() == 'EDITORCODE') {
                const editor = document.getElementById('virtualclassEditorRich');
                if (editor != null) {
                  editor.style.display = 'none';
                }
              } else {
                // console.log(`EditorCode can not be display:none ${appId}`);
              }
            } else {
              // console.log(`appId ${appId} undefined`);
            }
          } else {
            // tricky case  when previous and current are same hide other appilcations but current
            const allApps = document.getElementById('virtualclassCont').getElementsByClassName('virtualclass');
            for (let i = 0; i < allApps.length; i++) {
              allApps[i].style.display = 'none';
            }
          }
        }
        if (typeof appId !== 'undefined') {
          appId = `virtualclass${capitalizeFirstLetter(appId)}`;
        }
        const appElement = document.getElementById(appId);
        if (appElement != null) {
          appElement.style.display = 'block';
          // console.log(`App ${appId} block`);
        }
      },

      async makeAppReady(app, cusEvent, data) {
        // var congdashboardClose = document.querySelector('#congdashboard button.close');
        // if(congdashboardClose != null){
        //     congdashboardClose.click();
        // }
        virtualclass.dashBoard.close();
        // console.log(`Application is ready${app}`);
        this.view = window.view;
        /**
         Screen share be applied to current app only when the screen share
         is being shared
         * */
        const tempApp = virtualclass.vutil.capitalizeFirstLetter(app);
        if (tempApp != 'ScreenShare') {
          this.currApp = tempApp;
        }

        if (app != 'DocumentShare') {
          virtualclass.gObj.docPdfFirstTime = false;
        }
        // console.log(`Current App init ${this.currApp}`);
        if ((roles.hasControls() && Object.prototype.hasOwnProperty.call(virtualclass, 'previrtualclass'))
          && (app != virtualclass.apps.ss || (virtualclass.gObj.studentSSstatus.mesharing && virtualclass.apps.ss == 'ScreenShare'))) {
          virtualclass.vutil.makeActiveApp(`virtualclass${app}`, virtualclass.previrtualclass);
        }

        // hiding editor controllers from footer
        if (typeof this.previous !== 'undefined') {
          if (this.previous == 'virtualclassEditorRich' || this.previous == 'virtualclassEditorCode') {
            const editorType = this.previous.split('virtualclass')[1];
            this.user.control.toggleDisplayEditorController(editorType, 'none');
          }
        }

        // if not screen share
        if (app != virtualclass.apps.ss) {
          this.dispvirtualclassLayout(app);
          const vcContainer = document.getElementById('virtualclassCont');
          virtualclass.vutil.setCurrApp(vcContainer, this.currApp);
          const vcAppContainer = document.querySelector('#virtualclassApp');
          if (vcAppContainer != null) {
            if (this.currApp === 'DocumentShare' || this.currApp === 'SharePresentation' || this.currApp === 'Video') {
              virtualclass.vutil.setCurrApp(vcAppContainer, vcContainer.dataset.currapp);
            } else {
              vcAppContainer.dataset.currapp = '';
            }
          }
        }

        if (typeof this.prevScreen !== 'undefined' && Object.prototype.hasOwnProperty.call(this.prevScreen, 'currentStream')) {
          this.prevScreen.unShareScreen();
        }

        // call the function with passing dynamic variablesc
        if (app == 'SharePresentation') {
          // debugger;
          if (`virtualclass${app}` != virtualclass.previous) {
            // console.log('==== DST init appInitiator');

            this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
          }
        } else if (app == 'DocumentShare') {
          this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
          if (roles.hasControls()) {
            if (!virtualclass.serverData.syncComplete) {
              virtualclass.vutil.triggerDashboard(app);
            } else {
              /* For the request of Docs, we need to hide the popup Dashboard,
               * If the notes order is not available from database then the application
               * shows the popup Dashboard later
               */
              virtualclass.vutil.triggerDashboard(app, 'hidepopup');
            }
          }

          // virtualclass.zoom.zoomAction('fitToScreen');
        } else {
          let prevapp = localStorage.getItem('prevApp');
          if (prevapp != null) {
            const preapp = JSON.parse(prevapp);
            if (preapp.name == 'SharePresentation') {
              preapp.name = '';
              // localStorage.setItem('prevApp', JSON.stringify(preapp));
            }
          }

          if (app === 'Whiteboard') {
            const args = [];
            for (let i = 0; i < arguments.length; i++) {
              args.push(arguments[i]);
            }
            if (typeof cusEvent === 'undefined') {
              args[1] = (cusEvent);
            }

            const id = (typeof data !== 'undefined') ? `_doc_${data}` : `_doc_0_${virtualclass.gObj.currSlide}`;
            args[2] = id;
            args.push('virtualclassWhiteboard');

            await this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(args));
            prevapp = JSON.parse(prevapp);

            if (!virtualclass.gObj.wbRearrang && prevapp != null && localStorage.getItem('currSlide') != null) {
              let wIds = localStorage.getItem('wIds');
              if (wIds !== null) {
                wIds = JSON.parse(wIds);
                if (wIds.length > 0) {
                  virtualclass.wbCommon.readyElements(wIds);
                  if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'currSlide') && wIds.indexOf(+(virtualclass.gObj.currSlide)) === -1) {
                    // console.log('wids, From virtualclass ');
                    wIds.push(virtualclass.gObj.currSlide);
                  }
                  //
                  // virtualclass.wbCommon.reArrangeElements(wIds);
                  virtualclass.gObj.wbRearrang = true;
                  virtualclass.gObj.wIds = wIds;
                }
              }
            }

            virtualclass.wbCommon.initNav(virtualclass.gObj.wIds);

            if (virtualclass.gObj.wbRearrang) {
              if (roles.hasControls()) {
                virtualclass.wbCommon.rearrange(virtualclass.wbCommon.order);
                virtualclass.wbCommon.indexNav.addActiveNavigation(virtualclass.gObj.currWb);
              }

              // else {
              //    virtualclass.wbCommon.rearrange(virtualclass.gObj.wIds);
              // }
            }

            virtualclass.wbCommon.identifyFirstNote(virtualclass.gObj.currWb);
            virtualclass.wbCommon.identifyLastNote(virtualclass.gObj.currWb);
          } else {
            var currVideo = Array.prototype.slice.call(arguments)[2];
            this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
            if (currVideo && currVideo.init && currVideo.init.videoUrl && currVideo.fromReload) {
              var hidepopup = true;
            }
            if (roles.hasControls() && app == 'Video') {
              if (`virtualclass${app}` != virtualclass.previous) {
                var dashboardnav = document.querySelector('#dashboardnav button');
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

        if (app != virtualclass.apps.wb && app != virtualclass.apps.ss) {
          virtualclass.system.setAppDimension();
        }

        // if (app !== 'Video' && Object.prototype.hasOwnProperty.call(virtualclass, 'videoUl')) {
        //   virtualclass.videoUl.clearEverThing();
        //
        //   virtualclass.videoUl.videoId = '';
        //   const frame = document.getElementById('dispVideo_Youtube_api');
        //   if (frame && frame.contentWindow) {
        //     frame.contentWindow.postMessage(
        //       '{"event":"command","func":"pauseVideo","args":""}',
        //       '*',
        //     );
        //   }
        //
        //   const dispVideo = document.querySelector('.congrea #dispVideo');
        //   if (dispVideo) {
        //     dispVideo.style.display = 'none';
        //     const video = document.querySelector('.congrea #dispVideo video');
        //     if (video) {
        //       video.setAttribute('src', '');
        //     }
        //   }
        //   const currPlaying = document.querySelector('#listvideo .playing');
        //   if (currPlaying) {
        //     currPlaying.classList.remove('playing');
        //   }
        //   const currCtr = document.querySelector('#listvideo .removeCtr');
        //   if (currCtr) {
        //     currCtr.classList.remove('removeCtr');
        //   }
        //
        // }

        if (app !== 'Video' && Object.prototype.hasOwnProperty.call(virtualclass, 'videoUl')
          &&  Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'player')) {
          virtualclass.videoUl.destroyPlayer();
        }


        if (roles.hasControls()) {
          var currVideo = Array.prototype.slice.call(arguments)[2];
          if (app !== 'ScreenShare' && (virtualclass.currApp === 'SharePresentation' || (virtualclass.currApp === 'Video'))) {
            virtualclass.vutil.initDashboardNav(currVideo);
            if (virtualclass.currApp === 'Video') {
              // console.log(`currApp ${virtualclass.currApp}`);
            } else if (!(virtualclass.sharePt.localStoragFlag)) {
              var dashboardnav = document.querySelector('#dashboardnav button');
              if (dashboardnav != null) {
                dashboardnav.click();
              }
            }
          } else if (virtualclass.currApp === 'DocumentShare' || virtualclass.currApp === 'SharePresentation') {
            // this.checkDsTable();
          } else {
            virtualclass.vutil.removeDashboardNav();
          }

          if (virtualclass.currApp != 'SharePresentation') {
            const playing = document.querySelector('#listppt .playing');
            if (playing) {
              playing.classList.remove('playing');
            }
          }
        }
      },


      // Helper functions for making the app is ready
      appInitiator: {
        async Whiteboard(app, cusEvent, id, container) {
          let vcan;
          if (typeof this.ss === 'object') {
            this.ss.prevStream = false;
          }

          if (roles.hasControls() && typeof this.previous !== 'undefined' && typeof cusEvent !== 'undefined'
          && cusEvent === 'byclick' && roles.hasControls() && virtualclass.currApp === 'Whiteboard') {
            const docid = id.split('_doc_')[1];
            virtualclass.vutil.beforeSend({ dispWhiteboard: true, cf: 'dispWhiteboard', d: docid });
          }

          virtualclass.gObj.currWb = id;
          const wid = id;

          if (typeof this.pdfRender[wid] !== 'object') {
            this.pdfRender[wid] = window.pdfRender();
          } else if (virtualclass.currApp === 'Whiteboard' || virtualclass.currApp === 'DocumentShare') {
            // TODO, USE adjustScreenOnDifferentPdfWidth instead of normalRender
            virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
            // virtualclass.zoom.normalRender();
          }

          if (typeof id !== 'undefined') {
            if (typeof this.wb[id] !== 'object') {
              if (typeof this.wb !== 'object') {
                this.wb = {};
              }

              virtualclass.gObj.commandToolsWrapperId[id] = `commandToolsWrapper${id}`;
              this.wb[id] = {};
              virtualclass.gObj.tempReplayObjs[id] = [];
              console.log('====> vcan is creating', id, ' ', id, ' ', virtualclass.wb[id].vcan);
              console.log('====> jai 1 ', id, ' ', virtualclass.wb[id].vcan);
              this.wb[id] = new window.whiteboard(this.wbConfig, id);
              let whiteboardContainer;
              let wbHtml;
              let canvas;
              console.log('====> jai 2 ', id, ' ', virtualclass.wb[id].vcan);

              if (virtualclass.currApp === 'Whiteboard') {
                whiteboardContainer = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
                if (roles.hasControls() && !virtualclass.gObj.wbInitHandle) {
                  virtualclass.wbCommon.initNavHandler();
                  virtualclass.gObj.wbInitHandle = true;
                }
              } else {
                whiteboardContainer = document.getElementById(`cont${id}`);
              }
              console.log('====> jai 3 ', id, ' ', virtualclass.wb[id].vcan);

              if (whiteboardContainer !== null) {
                if (document.querySelector(`vcanvas${id}`) === null) {
                  const wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
                  if (virtualclass.currApp === 'Whiteboard') {
                    virtualclass.wbCommon.hideElement();
                    const wnoteid = `note${id}`;
                    const wnote = document.querySelector(`#${wnoteid}`);
                    if (wnote !== null) {
                      wnote.classList.add('canvasContainer', 'current');
                      wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
                      wnote.innerHTML = wbHtml;
                    } else {
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
                console.log('====> jai 4 ', id, ' ', virtualclass.wb[id].vcan);

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
                console.log('====> jai 5 ', id, ' ', virtualclass.wb[id].vcan);

                if (roles.hasControls()) {
                  virtualclass.wb[id].attachToolFunction(virtualclass.gObj.commandToolsWrapperId[id], true, id);
                }
                console.log('====> jai 6 ', id, ' ', virtualclass.wb[id].vcan);

                if (virtualclass.currApp === 'DocumentShare') {
                  const { currNote } = virtualclass.dts.docs.note;
                  console.log('====> jai 6.1', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                  await virtualclass.pdfRender[wid].init(canvas, currNote);
                  console.log('====> jai 6.2', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                } else {
                  console.log('====> jai 6.3', id, ' ', id, ' ', virtualclass.wb[id].vcan);
                  await virtualclass.pdfRender[wid].init(canvas);
                  console.log('====> jai 6.4', id, ' ', id, ' ', virtualclass.wb[id].vcan);
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
            console.log('====> jai 7 ', id, ' ', id, ' ', virtualclass.wb[id].vcan);
            vcan = virtualclass.wb[id].vcan;
            this.previous = this.wbConfig.id;
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
            console.log("=====> whiteboard mouse up ");

            window.addEventListener('mouseup', (ev) => {
              const currApp = document.querySelector('#virtualclassCont').dataset.currapp;
              if (currApp != null && (currApp === 'Whiteboard' || currApp === 'DocumentShare')) {
                if (Object.prototype.hasOwnProperty.call(ev.target.dataset, 'stroke') || Object.prototype.hasOwnProperty.call(ev.target.dataset, 'font')) {
                  const dropDown = (Object.prototype.hasOwnProperty.call(ev.target.dataset, 'stroke')) ? document.querySelector(`#t_strk${virtualclass.gObj.currWb} .strkSizeList`) : document.querySelector(`#t_font${virtualclass.gObj.currWb} .fontSizeList`);
                  virtualclass.wb[virtualclass.gObj.currWb].closeElem(dropDown);
                } else if (ev.target.classList.contains('icon-color') || ev.target.classList.contains('selected') || ev.target.classList.contains('congtooltip')) {
                  virtualclass.wb[virtualclass.gObj.currWb].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
                } else if (ev.target.classList.contains('icon-rectangle') || ev.target.classList.contains('icon-line')
                  || ev.target.classList.contains('icon-oval') || ev.target.classList.contains('icon-triangle')) {
                  virtualclass.wb[virtualclass.gObj.currWb].closeElem(document.querySelector(`#shapes${virtualclass.gObj.currWb}`));
                } else {
                  const stroke = document.querySelector(`#t_strk${virtualclass.gObj.currWb} .strkSizeList`);
                  const font = document.querySelector(`#t_font${virtualclass.gObj.currWb} .fontSizeList`);
                  const colorList = document.querySelector(`#colorList${virtualclass.gObj.currWb}`);
                  if (stroke !== null && stroke.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(stroke);
                  } else if (font !== null && font.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(font);
                  } else if (colorList !== null && colorList.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(colorList);
                  }

                  if (!ev.target.classList.contains('icon-shapes') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    const shapes = document.querySelector(`#shapes${virtualclass.gObj.currWb}`);
                    if (shapes !== null && shapes.classList.contains('open')) {
                      virtualclass.wb[virtualclass.gObj.currWb].closeElem(shapes);
                    }
                  }
                }
              }
            });

          } else {
            if (roles.isStudent() && virtualclass.currApp === 'Whiteboard') {
              virtualclass.wbCommon.setCurrSlideNumber(id);
            }
          }

          if (typeof virtualclass.wb.indexNav === 'undefined') {
            virtualclass.wb.indexNav = new virtualclass.pageIndexNav('WB');
          }
        },

        ScreenShare(app) {
          if (typeof this.ss !== 'object') {
            this.ss = new window.screenShare(virtualclass.ssConfig);
          }
          this.ss.init({ type: 'ss', app });
        },

        Yts(app, custEvent, videoObj) {
          // this.dispvirtualclassLayout(virtualclass.ytsConfig.id);
          // if there is not already sharing the youtube video
          if (typeof videoObj !== 'undefined' && videoObj != null) {
            virtualclass.yts.init(videoObj, videoObj.startFrom);
          } else {
            // only display the layout if youtube is not sharing
            if (document.querySelector('iframe#player') == null) {
              virtualclass.yts.init();
            }
          }

          this.previous = virtualclass.ytsConfig.id;
        },

        EditorRich(app) {
          this.appInitiator.editor.call(virtualclass, app);
        },

        EditorCode(app) {
          this.appInitiator.editor.call(virtualclass, app);
        },

        SharePresentation(app, cusEvent) {
          if (typeof this.ss === 'object') {
            this.ss.prevStream = false;
          }
          //                    if (typeof this.previous != 'undefined') {
          //                        if (typeof cusEvent != 'undefined' && cusEvent == "byclick") {
          //                            virtualclass.vutil.beforeSend({'ppt': true,init:'makeAppReady', cf: 'ppt'});
          //                        }
          //                    }
          this.sharePt = new window.sharePt();

          // console.log(virtualclass.sharePt.pptUrl);
          this.sharePt.init(app, cusEvent);
          // console.log(virtualclass.sharePt.pptUrl);
          this.previous = virtualclass.ptConfig.id;
          virtualclass.sharePt.attachMessageEvent('message', virtualclass.sharePt.pptMessageEventHandler);
        },

        Poll(app) {
          // alert("init Poll");
          virtualclass.poll.init();
        },
        Quiz(app) {
          virtualclass.quiz.init();
        },

        Video(app, custEvent, videoObj) {
          if (typeof videoObj !== 'undefined' && videoObj != null) {
            if (typeof videoObj.type === 'undefined') {
              virtualclass.videoUl.init(videoObj, videoObj.startFrom);
            } else if (videoObj.type == 'video_yts') {
              virtualclass.videoUl.init();
              // virtualclass.yts.init(videoObj, videoObj.startFrom);
            } else {
              virtualclass.videoUl.init();
            }
          } else {
            virtualclass.videoUl.init();
          }

          // if (typeof videoObj.type == 'undefined') {
          //     if (typeof videoObj != 'undefined' && videoObj != null) {
          //         virtualclass.videoUl.init(videoObj, videoObj.startFrom);
          //     } else {
          //         virtualclass.videoUl.init();
          //     }
          // }else if(typeof videoObj.type == 'yts'){
          //     if (typeof videoObj != 'undefined' && videoObj != null) {
          //         virtualclass.yts.init(videoObj, videoObj.startFrom);
          //     } else {
          //         virtualclass.yts.init();
          //     }
          //
          // }else{
          //
          //     if (typeof videoObj != 'undefined' && videoObj != null) {
          //         virtualclass.videoUl.init(videoObj, videoObj.startFrom);
          //     } else {
          //         virtualclass.videoUl.init();
          //     }
          //
          // }
        },

        editor(app) {
          // showing controllers from footer
          this.user.control.toggleDisplayEditorController(app.substring(app.indexOf('virtualclass'), app.length), 'block');
          const revision = 0;
          const clients = [];
          const docs = '';
          const operations = '';

          if (app == virtualclass.apps.er) {
            virtualclass.editorRich.init(revision, clients, docs, operations);
            this.previous = virtualclass.edConfig.id;
          } else {
            virtualclass.editorCode.init(revision, clients, docs, operations);
            this.previous = virtualclass.edCodeConfig.id;
          }

          const writeMode = JSON.parse(localStorage.getItem(virtualclass.vutil.smallizeFirstLetter(app)));
          const etType = virtualclass.vutil.smallizeFirstLetter(app);

          if (!roles.hasAdmin()) {
            if (writeMode == null) {
              this[etType].cm.setOption('readOnly', 'nocursor');
              this.user.control.toggleDisplayWriteModeMsgBox(app, false);
              // console.log(`message box is created ${app}`);
            } else {
              this.user.control.toggleDisplayWriteModeMsgBox(app, writeMode);
              if (!writeMode) {
                this[etType].cm.setOption('readOnly', 'nocursor');
              } else {
                this[etType].cm.setOption('readOnly', false);
              }
            }
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
              ioAdapter.mustSend({ dts: { init: 'studentlayout' }, cf: 'dts' });
            }

            const slide = virtualclass.dts.docs.currNote;
            if (typeof slide !== 'undefined') {
              virtualclass.vutil.updateCurrentDoc(slide);
            }
          }
          virtualclass.previous = virtualclass.dtsConfig.id;

        },

        DocumentShare(app, customEvent, docsObj) {
          if (!Object.prototype.hasOwnProperty.call(virtualclass, 'dts') || virtualclass.dts == null) {
            virtualclass.dts = window.documentShare();
          } else {
            virtualclass.dts.indexNav.init();
          }

          const args = [];

          if (typeof app !== 'undefined') {
            args.push(app);
          }

          if (typeof customEvent !== 'undefined') {
            args.push(customEvent);
          }

          if (typeof docsObj !== 'undefined') {
            args.push(docsObj);
          }

          if (typeof virtualclass.dts.indexNav === 'undefined') {
            virtualclass.dts.indexNav = new virtualclass.pageIndexNav('documentShare');
          }


          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'docs')) {
            virtualclass.appInitiator.makeReadyDocumentShare();
            virtualclass.vutil.initDashboardNav();


            if (!virtualclass.serverData.syncComplete && !virtualclass.dts.noteExist()) {
              const dashboardnav = document.querySelector('#dashboardnav button');
              if (dashboardnav != null) {
                // TODO, Need to enable later
                dashboardnav.click();
              }
            } else {
              // console.log('===== DOCUMENT EXIST');
              virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
            }

            if (dstData != null) {
              clearTimeout(dstData);
            }

            if (virtualclass.gObj.currWb != null && typeof virtualclass.pdfRender[virtualclass.gObj.currWb] !== 'undefined'
              && virtualclass.currApp === 'DocumentShare' && Object.prototype.hasOwnProperty.call(virtualclass.pdfRender[virtualclass.gObj.currWb], 'page')
              && virtualclass.pdfRender[virtualclass.gObj.currWb].page != null) {
              if (virtualclass.dts.order) {
                if (typeof virtualclass.dts.indexNav === 'undefined') {
                  virtualclass.dts.indexNav = new virtualclass.pageIndexNav('documentShare');
                }
                if (roles.hasControls()) {
                  virtualclass.dts.indexNav.createIndex();
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
        const allAppOptions = document.getElementsByClassName('appOptions');
        for (let i = 0; i < allAppOptions.length; i++) {
          const anchTag = allAppOptions[i].getElementsByTagName('a')[0];
          // DON'T attach editor code tool
          if (allAppOptions[i].id != 'virtualclassEditorCodeTool') {
            var that = this;
            anchTag.onclick = function () {
              // console.log('==== DST init click');
              that.initlizer(this);
            };
          }
        }
      },

      initlizer(elem) {
        let appName = elem.parentNode.id.split('virtualclass')[1];
        if (appName === 'SessionEndTool') {
          virtualclass.popup.confirmInput(virtualclass.lang.getString('startnewsession'),
            (confirm) => {
              if (!confirm) {
                // console.log('Not start new session');
                return;
              }

              virtualclass.gObj.endSession = true;
              if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'beTeacher') && roles.isTeacher()) {
                // localStorage.setItem('uRole', 't');
              }
              localStorage.clear();

              const allFinish = new Promise(((resolve, reject) => {
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
          // alert(virtualclass.currApp);
          appName = appName.substring(0, appName.indexOf('Tool'));
          //  this.currApp = appName; //could be dangerous
          if (!this.PrvAndCurrIsWss(this.previous, appName)) {
            if (virtualclass.currApp === 'DocumentShare') {
              virtualclass.gObj.screenRh = 160;
            }
            // console.log('==== DST init makeAppReady');
            this.makeAppReady(appName, 'byclick');
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
        if (appName != 'ScreenShare') {
          virtualclass.vutil.removeClass('audioWidget', 'fixed');
        }
      },

      PrvAndCurrIsWss(previous, appName) {
        return !!((previous == 'virtualclassWholeScreenShare' && appName == virtualclass.apps.yt));
      },

      // handleCurrentUserWithPrevious() {
      //   let prvUser = localStorage.getItem('prvUser');
      //   if (prvUser == null) {
      //     virtualclass.setPrvUser();
      //   } else {
      //     prvUser = JSON.parse(prvUser);
      //     if (prvUser.id != wbUser.id || prvUser.room != wbUser.room || wbUser.role != prvUser.role || prvUser.recording != virtualclassSetting.settings.enableRecording) {
      //       virtualclass.gObj.sessionClear = true;
      //       virtualclass.setPrvUser();
      //       if (roles.hasControls()) {
      //         // localStorage.setItem('uRole', this.gObj.uRole);
      //       }
      //     }
      //   }
      // },

      setPrvUser() {
        const prvUser = {
          id: wbUser.id,
          room: wbUser.room,
          role: wbUser.role,
          settings: virtualclassSetting.settings,
        };
        // console.log('previosu user');
        localStorage.setItem('prvUser', JSON.stringify(prvUser));
      },

      registerPartial() {
        const contPara = { whiteboardPath };

        /** Registering the partials which have setting paramter * */
        const initTemplates = ['precheck', 'teacherVideo', 'audioWidget', 'appTools', 'popupCont', 'appToolsMeeting', 'appSettingDetail', 'joinclass'];

        const isControl = { hasControl: roles.hasControls() };
        let context;
        for (let i = 0; i < initTemplates.length; i++) {
          context = null;
          if (initTemplates[i] == 'precheck' || initTemplates[i] == 'popupCont') {
            context = contPara;
          } else if (initTemplates[i] == 'audioWidget') {
            context = virtualclassSetting;
            context.isControl = roles.hasControls();
            context.isMettingMode = (virtualclass.gObj.meetingMode) && (roles.isStudent());
          } else if (initTemplates[i] == 'teacherVideo' || initTemplates[i] == 'appTools' || initTemplates[i] == 'appSettingDetail') {
            context = isControl;
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
        if (typeof submodule === 'undefined') {
          var template = JST[`${virtualclass.gObj.tempPrefix}/${name}.hbs`];
        } else {
          var template = JST[`${virtualclass.gObj.tempPrefix}/${submodule}/${name}.hbs`];
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

      removeSharingClass() {
        const virtualclassCont = document.querySelector('#virtualclassCont');
        if (virtualclassCont != '') {
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
    };

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };
}(window));
