(function (window) {
  window.virtualclass = function () {
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
      /* TODO, editorCode should be removed in proper way,
       the apps should not be in array but should handle in better way I */
      //            apps: ["Whiteboard", "ScreenShare", 'Yts', 'EditorRich', 'EditorCode', 'SharePresentation','Poll','Video', 'DocumentShare','Quiz', 'MultiVideo'],
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
        currIndex: (localStorage.getItem('currIndex') != null) ? localStorage.getItem('currIndex') : 0,
        uploadingFiles: [],
        docOrder: {},
        fetchedData: false,
        wbNavtime: 50, // virtualclass.gObj.studentSSstatus.mesharing
        studentSSstatus,
        screenRh: 60,
        isReadyForVideo: true,
        defaultApp: 'Whiteboard',
        tempQueue: {},
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
      },

      enablePreCheck: true,
      clearSession() {
        window.pageEnter = new Date().getTime();
        if (typeof notSend === 'undefined') {
          virtualclass.vutil.beforeSend({ sEnd: true, cf: 'sEnd' }, null, true);
        }
        if (typeof virtualclass.videoUl === 'object') {
          if (typeof virtualclass.videoUl.player === 'object') {
            if (typeof virtualclass.videoUl.player.dispose !== 'undefined') {
              virtualclass.videoUl.player.dispose();
            }
          }
        }
        virtualclass.storage.config.endSession();
        if (virtualclass.hasOwnProperty('prevScreen') && virtualclass.prevScreen.hasOwnProperty('currentStream')) {
          virtualclass.prevScreen.unShareScreen();
        }

        virtualclass.previrtualclass = `virtualclass${virtualclass.gObj.defaultApp}`;
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
        this.user = new window.user();
        // this.lang.getString = window.getString;
        // this.lang.message = window.message;
        this.vutil = window.vutil;
        // this.media = window.media
        this.sharePt = window.sharePt;
        this.fineUploader = window.fineUploader;
        this.system = window.system;
        this.recorder = window.recorder;
        this.converter = converter;
        this.clear = '';
        this.currApp = this.vutil.capitalizeFirstLetter(app);
        this.storage = window.storage;
        this.dashBoard = dashBoard;
        this.multiVideo = window.MultiVideo;
        this.vutil.isChromeExtension();
        this.wbCommon = window.wbCommon;
        this.pageNavigation = window.pageIndexNav;
        this.modal = window.modal;
        // this.settings = window.settings;
        // virtualclass.settings.init();

        this.zoom = window.zoomWhiteboard();
        virtualclass.pageIndexNav = window.pageIndexNav;
        if (this.system.isIndexedDbSupport()) {
          await this.storage.init();
        } else {
          console.log('Indexeddb does not support');
        }

        // this.pdfRender = window.pdfRender();
        if (this.currApp != 'Quiz' && typeof CDTimer !== 'undefined') {
          clearInterval(CDTimer);
        }

        virtualclass.modernizr = Modernizr;
        this.system.webpInit();

        this.dirtyCorner = window.dirtyCorner;
        this.html.init(this);
        this.adapter = window.adapter;


        if (!virtualclass.system.mybrowser.hasOwnProperty('name')) {
          this.system.setBrowserDetails();
        }

        virtualclass.api = api;

        virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
        virtualclass.xhr = window.xhr;
        virtualclass.xhr.init();

        /** This both have to merge * */
        virtualclass.xhrn = window.xhrn;

        virtualclass.xhrn.init();

        if (virtualclass.vutil.getCookie('readyToCommunicate')) {
          virtualclass.gObj.readyToCommunicate = true;
        }
        this.xhrn.getAcess((response) => {
          if (response != 'ERROR' || response != 'Error') {
            virtualclass.gObj.readyToCommunicate = true;
            console.log('get access');
            if (virtualclass.vutil.isPlayMode()) {
              virtualclass.recorder.requestListOfFiles();
            }
          }
        });

        virtualclass.chat = new Chat();
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
        console.log('==== session clear zoom object ready ');
        virtualclass.network = new Network();
        virtualclass.gesture = gesture;
        /*  virtualclass.pageIndexNav=window.pageIndexNav; */

        // virtualclass.settings.recording = recordSettings;
        // virtualclass.settings.recording.init();

        this.serverData = serverData;
        if (roles.hasControls()) {
          this.serverData.fetchAllData(); // gets all data from server at very first
        }
        if (localStorage.uRole != null) {
          virtualclass.gObj.uRole = localStorage.uRole; // this done only for whiteboard in _init()
          vcContainer.classList.add(virtualclass.vutil.getClassName(virtualclass.gObj.uRole));
        }

        if (typeof videoObj === 'undefined' || videoObj == null) {
          this.makeAppReady(app, 'byclick');
        } else {
          this.makeAppReady(app, 'byclick', videoObj);
        }

        // TODO system checking function should be invoked before makeAppReady

        this.system.check();
        this.vutil.isSystemCompatible(); // this should be at environment-validation.js file
        this.system.mediaDevices.getMediaDeviceInfo();
        this.pageVisible = virtualclass.vutil.pageVisible();


        if (app == virtualclass.apps.ss) {
          this.system.setAppDimension();
        }

        virtualclass.vutil.createReclaimButtonIfNeed();

        // To teacher
        virtualclass.user.assignRole(virtualclass.gObj.uRole, app);

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
        var precheck = document.getElementById('precheckSetting');
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
        if (!virtualclass.vutil.isPlayMode()) {
          // Init Socket only after both editor instances are ready.

          const that = this;
          var initSocket = setInterval(() => {
            if (that.gObj.editorInitDone >= 2) {
              that.initSocketConn();
              clearInterval(initSocket);
            }
          }, 100);
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
          if (virtualclass.gObj.hasOwnProperty('errNotScreenShare')) {
            virtualclass.view.disableSSUI();
          }
          if (virtualclass.gObj.hasOwnProperty('errAppBar')) {
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
                console.log(`EditorRich can not be display:none ${appId}`);
              }

              if (appId.toUpperCase() == 'EDITORCODE') {
                const editor = document.getElementById('virtualclassEditorRich');
                if (editor != null) {
                  editor.style.display = 'none';
                }
              } else {
                console.log(`EditorCode can not be display:none ${appId}`);
              }
            } else {
              console.log(`appId ${appId} undefined`);
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
          console.log(`App ${appId} block`);
        }
      },

      async makeAppReady(app, cusEvent, data) {
        // var congdashboardClose = document.querySelector('#congdashboard button.close');
        // if(congdashboardClose != null){
        //     congdashboardClose.click();
        // }
        virtualclass.dashBoard.close();
        console.log(`Application is ready${app}`);
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
        console.log(`Current App init ${this.currApp}`);
        if ((roles.hasControls() && virtualclass.hasOwnProperty('previrtualclass'))
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
            if (this.currApp == 'DocumentShare' || this.currApp == 'SharePresentation' || this.currApp == 'Video') {
              virtualclass.vutil.setCurrApp(vcAppContainer, vcContainer.dataset.currapp);
            } else {
              vcAppContainer.dataset.currapp = '';
            }
          }
        }

        if (typeof this.prevScreen !== 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
          this.prevScreen.unShareScreen();
        }

        // call the function with passing dynamic variablesc
        if (app == 'SharePresentation') {
          // debugger;
          if (`virtualclass${app}` != virtualclass.previous) {
            this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
          }
        } else if (app == 'DocumentShare') {
          this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
          if (roles.hasControls()) {
            if (!virtualclass.dts.firstRequest) {
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
              localStorage.setItem('prevApp', JSON.stringify(preapp));
            }
          }

          if (app == 'Whiteboard') {
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

            this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(args));

            prevapp = JSON.parse(prevapp);
            // if(wIds != null && wIds.length > 0 ){
            //    virtualclass.wbCommon.initNav(virtualclass.gObj.wIds);
            // }
            virtualclass.wbCommon.initNav(virtualclass.gObj.wIds);
            // if(!virtualclass.gObj.wbRearrang && prevapp != null && prevapp.hasOwnProperty('wbcs')){
            if (!virtualclass.gObj.wbRearrang && prevapp != null && localStorage.getItem('currSlide') != null) {
              let wIds = localStorage.getItem('wIds');
              wIds = JSON.parse(wIds);
              if (wIds != null && wIds.length > 0) {
                virtualclass.wbCommon.readyElements(wIds);
                virtualclass.wbCommon.initNav(wIds);


                // virtualclass.gObj.currSlide = prevapp.wbcs;

                // virtualclass.wbCommon.currentWhiteboard('_doc_0_'+virtualclass.gObj.currSlide);
                if (virtualclass.gObj.hasOwnProperty('currSlide') && wIds.indexOf(Number(virtualclass.gObj.currSlide)) == -1) {
                  console.log('wids, From virtualclass ');
                  wIds.push(virtualclass.gObj.currSlide);
                }
                virtualclass.wbCommon.reArrangeElements(wIds);
                virtualclass.gObj.wbRearrang = true;
                virtualclass.gObj.wIds = wIds;
                if (roles.hasControls()) {
                  virtualclass.wbCommon.rearrange(virtualclass.wbCommon.order);
                  virtualclass.wbCommon.indexNav.addActiveNavigation(virtualclass.gObj.currWb);
                }

                //                                if (!roles.hasControls()) {
                //                                    if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
                //                                        virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currSlide);
                //                                    }
                //                                }
              }


              // virtualclass.gObj.currWb = '_doc_0_'+virtualclass.gObj.currSlide;
            }

            //    virtualclass.gObj.currWb = '_doc_'+virtualclass.gObj.currSlide+'_'+virtualclass.gObj.currSlide;

            virtualclass.wbCommon.identifyFirstNote(virtualclass.gObj.currWb);
            virtualclass.wbCommon.identifyLastNote(virtualclass.gObj.currWb);
            // system.initResize();

            // virtualclass.zoom.zoomAction('fitToScreen');
          } else {
            var currVideo = Array.prototype.slice.call(arguments)[2];
            this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
            // if(roles.hasControls() && app == 'Video' && !(currVideo && currVideo.init&&(currVideo.init.videoUrl|| currVideo.fromReload))){
            //     virtualclass.vutil.triggerDashboard(app);
            // }

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

        // if (app != virtualclass.apps.ss && app != virtualclass.apps.yt&& app != virtualclass.apps.vid && virtualclass.hasOwnProperty('yts')) {
        //     virtualclass.yts.destroyYT();
        // }
        if (app != 'Video' && virtualclass.hasOwnProperty('videoUl')) {
          // to verify this
          // virtualclass.videoUl.videoUrl ="";
          virtualclass.videoUl.videoId = '';
          // $('.vjs-tech').each(function(){
          //     var el_src = $(this).attr("src");
          //     $(this).attr("src",el_src);
          // });
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
          //                    $('.congrea #listvideo .playing').removeClass('playing');
          //                    $('.congrea #listvideo .removeCtr').removeClass('removeCtr');
          if (!roles.hasControls()) {
            if (virtualclass.gObj.hasOwnProperty('videoPauseTime')) {
              clearTimeout(virtualclass.gObj.videoPauseTime);
            }

            if (typeof virtualclass.videoUl.player === 'object' && virtualclass.videoUl.player.player_ != null
              && virtualclass.videoUl.player.paused()) {
              console.log('==== Video is paused');
              virtualclass.videoUl.player.pause();
            }
          }
          if (typeof virtualclass.videoUl.player === 'object') {
            delete (virtualclass.videoUl.player);
          }
        }
        if (roles.hasControls()) {
          var currVideo = Array.prototype.slice.call(arguments)[2];
          if (app != 'ScreenShare' && (virtualclass.currApp == 'SharePresentation' || (virtualclass.currApp == 'Video'))) {
            virtualclass.vutil.initDashboardNav(currVideo);
            if (virtualclass.currApp == 'Video') {
              console.log(`currApp ${virtualclass.currApp}`);
            } else if (!(virtualclass.sharePt.localStoragFlag)) {
              var dashboardnav = document.querySelector('#dashboardnav button');
              if (dashboardnav != null) {
                dashboardnav.click();
              }
            }
          } else if (virtualclass.currApp == 'DocumentShare' || virtualclass.currApp == 'SharePresentation') {
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
          // if(virtualclass.currApp == 'Whiteboard' &&  virtualclass.previous != 'virtualclassWhiteboard'){
          //     // virtualclass.view.window.resize(id);
          // }

          if (typeof this.ss === 'object') {
            this.ss.prevStream = false;
          }

          if (typeof this.previous !== 'undefined') {
            if (typeof cusEvent !== 'undefined' && cusEvent == 'byclick' && roles.hasControls() && virtualclass.currApp == 'Whiteboard') {
              const docid = id.split('_doc_')[1];
              virtualclass.vutil.beforeSend({ dispWhiteboard: true, cf: 'dispWhiteboard', d: docid });
            }
          }
          // this.dispvirtualclassLayout(this.wbConfig.id);
          // this should be checked with solid condition
          virtualclass.gObj.currWb = id;
          const wid = id;

          if (typeof this.pdfRender[wid] !== 'object') {
            this.pdfRender[wid] = window.pdfRender();
          } else if (virtualclass.currApp == 'Whiteboard' || virtualclass.currApp == 'DocumentShare') {
            // TODO, USE adjustScreenOnDifferentPdfWidth instead of normalRender
            virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
            // virtualclass.zoom.normalRender();
          }
          if (roles.isStudent() && virtualclass.currApp == 'Whiteboard') {
            virtualclass.wbCommon.setCurrSlideNumber(id);
          }

          if (typeof id !== 'undefined') {
            if (typeof this.wb[id] !== 'object') {
              // if (this.wb[id] != null && this.wb[id].hasOwnProperty("gObj") && this.wb[id].gObj.queue != null) {
              //     var myQueue = this.wb[id].gObj.queue;
              // } else {
              //     var myQueue = [];
              // }

              // if(typeof this.gObj.tempQueue[id] != 'undefined'){
              //     var myQueue = this.gObj.tempQueue[id];
              // }else {
              //     var myQueue = [];
              // }

              if (typeof this.wb !== 'object') {
                this.wb = {};
              }


              virtualclass.gObj.commandToolsWrapperId[id] = `commandToolsWrapper${id}`;
              this.wb[id] = {};
              virtualclass.gObj.tempReplayObjs[id] = [];


              this.wb[id] = new window.whiteboard(this.wbConfig, id);

              if (this.gObj.tempQueue[id] != null) {
                this.wb[id].gObj.queue = this.gObj.tempQueue[id].slice();
                this.gObj.tempQueue[id] = null;
              }

              // this.wb[id].UI.mainContainer(container, id);
              if (virtualclass.currApp == 'Whiteboard') {
                var whiteboardContainer = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
                if (!virtualclass.gObj.wbInitHandle) {
                  virtualclass.wbCommon.initNavHandler();
                  virtualclass.gObj.wbInitHandle = true;
                }
              } else {
                var whiteboardContainer = document.getElementById(`cont${id}`);
              }

              if (whiteboardContainer != null) {
                if (document.querySelector(`vcanvas${id}`) == null) {
                  const wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
                  if (virtualclass.currApp == 'Whiteboard') {
                    virtualclass.wbCommon.hideElement();
                    const wnoteid = `note${id}`;
                    const wnote = document.querySelector(`#${wnoteid}`);
                    if (wnote != null) {
                      wnote.classList.add('canvasContainer', 'current');
                      var wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
                      wnote.innerHTML = wbHtml;
                    } else {
                      var wbHtml = `<div id='${wnoteid}' data-wb-id='${id}' class='canvasContainer current'>${wbTemplate({
                        cn: id,
                        hasControl: roles.hasControls(),
                      })}</div>`;

                      if (id != '_doc_0_0') {
                        whiteboardContainer.insertAdjacentHTML('beforeend', wbHtml);
                      } else {
                        whiteboardContainer.innerHTML = wbHtml;
                        const vcanvas_doc = document.querySelector('#note_doc_0_0');
                        if (vcanvas_doc != null) {
                          vcanvas_doc.classList.add('current');
                        }
                      }
                    }
                  } else {
                    var wbHtml = wbTemplate({ cn: id, hasControl: roles.hasControls() });
                    whiteboardContainer.innerHTML = wbHtml;
                  }
                  var canvas = document.querySelector(`#canvas${id}`);
                }

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
                virtualclass.wb[id].utility.displayCanvas(id); // TODO this should be invoke only once


                var { vcan } = virtualclass.wb[id];
                if (roles.hasControls()) {
                  virtualclass.wb[id].utility.setOrginalTeacherContent(app);
                  virtualclass.wb[id].attachToolFunction(virtualclass.gObj.commandToolsWrapperId[id], true, id);
                  const myoffset = vcan.utility.canvasCalcOffset(vcan.main.canid);
                  console.log(`whietboard offset x=${myoffset.x} ` + ` y=${myoffset.y}`);
                }

                if (virtualclass.currApp == 'DocumentShare') {
                  // var currNote = virtualclass.dts.docs.currNote; // this is obsolete here
                  const { currNote } = virtualclass.dts.docs.note;

                  // io.globallock = true;
                  // console.log("I am in of INIT PDF");
                  //
                  // if(this.clearGlobalLock != ''){
                  //     clearTimeout(this.clearGlobalLock);
                  // }
                  // this.clearGlobalLock  = setTimeout(
                  //     function (){
                  //         io.globallock = false;
                  //         console.log("I am out of INIT PDF");
                  //         io.onRecJson(null);
                  //         virtualclass.zoom.normalRender();
                  //     },1000
                  // );

                  virtualclass.pdfRender[wid].init(canvas, currNote);
                } else {
                  virtualclass.pdfRender[wid].init(canvas);
                }

                // Only need to  serve on after page refresh
                const that = this;
                await virtualclass.storage.getWbData(id);
                //                                console.log("==== SESSION CLEAR");
              } else {
                alert('whiteboard container is null');
              }
            } else {
              // if command tool wrapper is not added
              const commonWrapperId = `commandToolsWrapper${id}`;
              const commandToolsWrapper = document.getElementById(`commandToolsWrapper${id}`);
              if (commandToolsWrapper == null && roles.hasControls()) {
                virtualclass.wb[id].attachToolFunction(commonWrapperId, true, id);
              }
            }


            var { vcan } = virtualclass.wb[id];
            // important this need only if user draw the whiteboard
            // after received image with teacher role.
            // offset problem have to think about this
            if (document.getElementById(`canvas${id}`) != null) {
              vcan.utility.canvasCalcOffset(vcan.main.canid);
              if (this.gObj.tempReplayObjs[id].length === 0 || this.gObj.tempReplayObjs[id] === 'nodata') {
                virtualclass.wb[id].utility.makeCanvasEnable();
              }
            }

            console.log(`==== previous set ${this.wbConfig.id}`);
            this.previous = this.wbConfig.id;
          } else {
            alert('id is undefined');
          }
          console.log('==== SESSION CLEAR');
          virtualclass.zoom.init();
          // virtualclass.wbCommon.indexNav.init();
          // virtualclass.pdfRender[wid].initScaleController();

          const activeWbTool = localStorage.getItem('activeTool');
          if (activeWbTool != null) {
            const activeWbToolElem = document.querySelector(`#${activeWbTool}`);
            if (activeWbToolElem != null) {
              activeWbToolElem.classList.add('active');
              virtualclass.wb[wid].prvTool = activeWbTool;
            }
          }

          if (roles.hasControls()) {
            window.addEventListener('mouseup', (ev) => {
              const currApp = document.querySelector('#virtualclassCont').dataset.currapp;
              if (currApp != null && (currApp == 'Whiteboard' || currApp == 'DocumentShare')) {
                if (ev.target.dataset.hasOwnProperty('stroke') || ev.target.dataset.hasOwnProperty('font')) {
                  const dropDown = (ev.target.dataset.hasOwnProperty('stroke')) ? document.querySelector(`#t_strk${virtualclass.gObj.currWb} .strkSizeList`) : document.querySelector(`#t_font${virtualclass.gObj.currWb} .fontSizeList`);
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
                  if (stroke != null && stroke.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(stroke);
                  } else if (font != null && font.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(font);
                  } else if (colorList != null && colorList.classList.contains('open') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    virtualclass.wb[virtualclass.gObj.currWb].closeElem(colorList);
                  }

                  if (!ev.target.classList.contains('icon-shapes') && !document.querySelector('#virtualclassApp').classList.contains('dashboard')) {
                    const shapes = document.querySelector(`#shapes${virtualclass.gObj.currWb}`);
                    if (shapes != null && shapes.classList.contains('open')) {
                      virtualclass.wb[virtualclass.gObj.currWb].closeElem(shapes);
                    }
                  }
                }
              }
            });
          }

          if (typeof virtualclass.wb.indexNav === 'undefined') {
            virtualclass.wb.indexNav = new virtualclass.pageIndexNav('WB');
          }
          // virtualclass.wb.indexNav.init();
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

          console.log(virtualclass.sharePt.pptUrl);
          this.sharePt.init(app, cusEvent);
          console.log(virtualclass.sharePt.pptUrl);
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
              console.log(`message box is created ${app}`);
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

        makeReadyDsShare(app, customEvent, docsObj) {
          if (!virtualclass.dts.docs.hasOwnProperty('currDoc')) {
            if (typeof docsObj !== 'undefined') {
              setTimeout(
                () => {
                  virtualclass.dts.init(docsObj);
                }, 1000,
              );
            } else {
              virtualclass.dts.init();
            }
          } else {
            // send the initialize for the user layout
            if (roles.hasControls()) {
              ioAdapter.mustSend({ dts: { init: 'studentlayout' }, cf: 'dts' });
              console.log('doc share current');
              virtualclass.dts.sendCurrentDoc();
              virtualclass.dts.sendCurrentSlide();
              // var slide = virtualclass.dts.docs[virtualclass.dts.docs.currDoc].currSlide;
            }

            const slide = virtualclass.dts.docs.currNote;
            // if( typeof slide != 'undefined' ){
            if (typeof slide !== 'undefined') {
              virtualclass.vutil.updateCurrentDoc(slide);
            }
          }

          virtualclass.previous = virtualclass.dtsConfig.id;
          console.log(`==== previous ${virtualclass.previous}`);
        },

        DocumentShare(app, customEvent, docsObj) {
          if (!virtualclass.hasOwnProperty('dts') || virtualclass.dts == null) {
            virtualclass.dts = window.documentShare();
          } else {
            virtualclass.dts.firstRequest = false;
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


          if (virtualclass.gObj.hasOwnProperty('docs')) {
            virtualclass.appInitiator.makeReadyDsShare.apply(virtualclass.appInitiator, args);
            virtualclass.vutil.initDashboardNav();


            if (!virtualclass.dts.firstRequest && !virtualclass.dts.noteExist()) {
              const dashboardnav = document.querySelector('#dashboardnav button');
              if (dashboardnav != null) {
                dashboardnav.click();
              }
            } else {
              console.log('===== DOCUMENT EXIST');
              virtualclass.zoom.adjustScreenOnDifferentPdfWidth();
            }

            if (dstData != null) {
              clearTimeout(dstData);
            }

            if (virtualclass.gObj.currWb != null && typeof virtualclass.pdfRender[virtualclass.gObj.currWb] !== 'undefined'
              && virtualclass.currApp == 'DocumentShare' && virtualclass.pdfRender[virtualclass.gObj.currWb].hasOwnProperty('page')
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

          if (!that.multiVideo.hasOwnProperty('initDone')) {
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
              that.initlizer(this);
            };
          }
        }
      },

      initlizer(elem) {
        let appName = elem.parentNode.id.split('virtualclass')[1];
        if (appName == 'SessionEndTool') {
          virtualclass.popup.confirmInput(virtualclass.lang.getString('startnewsession'),
            (confirm) => {
              if (!confirm) {
                console.log('Not start new session');
                return;
              }

              virtualclass.gObj.endSession = true;
              if (virtualclass.gObj.hasOwnProperty('beTeacher') && roles.isTeacher()) {
                localStorage.setItem('uRole', 't');
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
                console.log(`ERRROR ${error}`);
              });
            });
        } else {
          // alert(virtualclass.currApp);
          appName = appName.substring(0, appName.indexOf('Tool'));
          //  this.currApp = appName; //could be dangerous
          if (!this.PrvAndCurrIsWss(this.previous, appName)) {
            if (virtualclass.currApp == 'DocumentShare') {
              virtualclass.gObj.screenRh = 160;
            }
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

      handleCurrentUserWithPrevious() {
        let prvUser = localStorage.getItem('prvUser');
        if (prvUser == null) {
          virtualclass.setPrvUser();
        } else {
          prvUser = JSON.parse(prvUser);
          if (prvUser.id != wbUser.id || prvUser.room != wbUser.room || wbUser.role != prvUser.role || prvUser.recording != virtualclass.settings.recording.enableRecording) {
            virtualclass.gObj.sessionClear = true;
            virtualclass.setPrvUser();
            if (roles.hasControls()) {
              localStorage.setItem('uRole', this.gObj.uRole);
            }
          }
        }
      },

      setPrvUser() {
        localStorage.clear();
        const prvUser = {
          id: wbUser.id,
          room: wbUser.room,
          role: wbUser.role,
          recording: virtualclass.settings.recording.enableRecording,
        };
        console.log('previosu user');
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
          console.log('Current Context');
          console.log('====================');
          console.log(this);

          if (optionalValue) {
            console.log('Value');
            console.log('====================');
            console.log(optionalValue);
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
    };

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  };
}(window));
