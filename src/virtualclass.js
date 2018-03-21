(function (window) {
    window.virtualclass = function () {
        // canvasScale = 1; //global
        SCALE_FACTOR = 1.02;//global 18/05/2015
        var dstData = null;
        var playMode = (wbUser.virtualclassPlay != '' ? parseInt(wbUser.virtualclassPlay, 10) : 0);
        var  studentSSstatus = localStorage.getItem('studentSSstatus');
        if(studentSSstatus != null){
            studentSSstatus = JSON.parse(localStorage.getItem('studentSSstatus'));
        }else {
            studentSSstatus = {sharing:false, mesharing: false, shareToAll : false};
        }

        return {

            isPlayMode :playMode,
            apps: ["Whiteboard", "ScreenShare", 'Yts', 'EditorRich', 'EditorCode', 'SharePresentation','Poll','Video', 'DocumentShare','Quiz', 'MultiVideo'],
            appSessionEnd: "virtualclassSessionEnd",
            appAudioTest: "virtualclassAudioTest",

            // rWidgetConfig: {id: 'audioWidget'},
            rWidgetConfig: {id: 'virtualclassAppRightPanel'},
            wb: "",
            ss: "",
            wss: "",
            rw: "",
            poll:"",
            quiz:"",
            raiseHand:"",
            //lang: {},
            error: [],
            pdfRender : {},
            clearGlobalLock : '',

            gObj: {
                uid: window.wbUser.id,
                uRole: window.wbUser.role,
                uName: window.wbUser.name,
                tempReplayObjs: {}, //for store temp replayObjs
                // commandToolsWrapperId: 'commandToolsWrapper',
                commandToolsWrapperId: {},
                editorInitDone: 0,
                resize : false,
                has_ts_capability : (wbUser.ts == 1 || wbUser.ts == true) ? true : false,
                meetingMode : +(wbUser.meetingMode),
                chromeExt : false,
                pdfdebugg : false, //To draw scroll for debugging process
                wbInitHandle : false,
                wbCount : 0,
                prvWindowSize : false,
                wIds : [0],
                wbRearrang : false,
                currSlide : (localStorage.getItem('currSlide') != null) ? localStorage.getItem('currSlide') : 0,
                uploadingFiles : [],
                docOrder : {},
                fetchedData : false,
                wbNavtime : 0, // virtualclass.gObj.studentSSstatus.mesharing
                studentSSstatus : studentSSstatus,
                screenRh : 60,
            },

            enablePreCheck : true,
            clearSession: function () {
                window.pageEnter = new Date().getTime();
                virtualclass.vutil.beforeSend({sEnd: true, 'cf': 'sEnd'}, null, true);
                if (typeof virtualclass.videoUl == 'object') {
                    if (typeof virtualclass.videoUl.player == "object") {
                        virtualclass.videoUl.player.dispose();

                    }
                }
                virtualclass.storage.config.endSession();
                if (virtualclass.hasOwnProperty('prevScreen') && virtualclass.prevScreen.hasOwnProperty('currentStream')) {

                    virtualclass.prevScreen.unShareScreen();
                }

                virtualclass.previrtualclass = "virtualclassEditorRich";
            },

            init: function (urole, app, videoObj) {
                var wbUser = window.wbUser;
                virtualclass.uInfo = {
                    'userid': wbUser.id,
                    'sid': wbUser.sid,
                    'rid': wbUser.path,
                    'authuser': wbUser.auth_user,
                    'authpass': wbUser.auth_pass,
                    'userobj': {
                        'userid': wbUser.id,
                        'name': wbUser.name,
                        'lname': wbUser.lname,
                        'img': wbUser.imageurl,

                        //role: wbUser.role
                        role : (localStorage.getItem('uRole') != null) ? localStorage.getItem('uRole')  :  wbUser.role

                    },
                    'room': wbUser.room
                };

                // this actually is particular session, it can be anything like course, particular activity on course
                // for example, in moodle this is course moodle id,
                // with other sysytem it might differ.

                this.gObj.congCourse = typeof (window.congCourse != 'undefiend') ? window.congCourse : 0;

                this.wbConfig = {id: "virtualclass" + this.apps[0], classes: "appOptions"};
                this.ssConfig = {id: "virtualclass" + this.apps[1], classes: "appOptions"};
                // this.ytsConfig = {id: "virtualclass" + this.apps[2], classes: "appOptions"};
                this.edConfig = {id: "virtualclass" + this.apps[3], classes: "appOptions"};
                this.edCodeConfig = {id: "virtualclass" + this.apps[4], classes: "appOptions"};
                this.ptConfig = {id: "virtualclass" + this.apps[5], classes: "appOptions"};
                this.plConfig ={id:"virtualclass"+this.apps[6],classes:"appOptions"};
                this.viConfig ={id:"virtualclass"+this.apps[7],classes:"appOptions"};
                this.dtsConfig = {id: "virtualclass" + this.apps[8], classes: "appOptions"};
                this.qzConfig = {id:"virtualclass"+this.apps[9],classes:"appOptions"};
                this.mvConfig = {id:"virtualclass"+this.apps[10],classes:"appOptions"};

                //this.wssConfig = { id : "virtualclass" + this.apps[2], classes : "appOptions"};
                this.user = new window.user();
                // this.lang.getString = window.getString;
                // this.lang.message = window.message;
                this.vutil = window.vutil;
                this.media = window.media
                this.sharePt= window.sharePt;
                this.fineUploader= window.fineUploader;
                this.system = window.system;
                this.recorder = window.recorder;
                this.converter = window.converter;
                this.clear = "";
                this.currApp = this.vutil.capitalizeFirstLetter(app);
                this.storage = window.storage;
                this.dashBoard  = dashBoard;
                this.multiVideo = window.MultiVideo;
                this.vutil.isChromeExtension();
                this.wbCommon = window.wbCommon;

                // this.pdfRender = window.pdfRender();

                if(this.system.isIndexedDbSupport()){
                    this.storage.init(function () {
                        if (!virtualclass.vutil.isPlayMode()) {
                            ioStorage.completeStorage(JSON.stringify(virtualclass.uInfo));
                        }
                    });
                }else {
                    console.log('Indexeddb does not support');
                }

                virtualclass.modernizr = Modernizr;
                this.system.webpInit();

                this.dirtyCorner = window.dirtyCorner;
                this.html.init(this);
                this.adapter = window.adapter;


                if(!virtualclass.system.mybrowser.hasOwnProperty('name')){
                    this.system.setBrowserDetails();
                }

                virtualclass.api = window.api;

                virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
                virtualclass.xhr = window.xhr;
                virtualclass.xhr.init();

                /** This both have to merge **/
                virtualclass.xhrn = window.xhrn;

                virtualclass.xhrn.init();
                this.xhrn.getAcess(function (response){
                    if(response != 'ERROR' || response != 'Error'){
                        console.log('get access');
                    }
                });

                virtualclass.chat = new Chat();
                virtualclass.chat.init();

                virtualclass.dtCon = virtualclass.converter();
                virtualclass.pbar = progressBar;

                //editor which is rich text editor which has various options

                virtualclass.editorRich = window.editor('editorRich', 'virtualclassEditorRich', 'virtualclassEditorRichBody');

                //simple code editor with markdown
                virtualclass.editorCode = window.editor('editorCode', 'virtualclassEditorCode', 'virtualclassEditorCodeBody');

                virtualclass.yts = window.yts();
                virtualclass.poll= window.poll();
                virtualclass.quiz= window.quiz();
                virtualclass.videoUl= window.videoUl();

                virtualclass.videoHost = window.videoHost;
                virtualclass.precheck  = window.precheck;
                virtualclass.page =  page;
                virtualclass.zoom = window.zoomWhiteboard();


                this.serverData = serverData;
                if(roles.hasControls()){
                    this.serverData.fetchAllData(); // gets all data from server at very first
                }
                if (localStorage.uRole != null) {
                    virtualclass.gObj.uRole = localStorage.uRole; //this done only for whiteboard in _init()
                    var vcContainer = document.getElementById('virtualclassCont');
                    vcContainer.classList.add(virtualclass.vutil.getClassName(virtualclass.gObj.uRole));
                }

                if (typeof videoObj == 'undefined' || videoObj == null) {
                    this.makeAppReady(app, "byclick");
                } else {
                    this.makeAppReady(app, "byclick", videoObj);
                }

                //TODO system checking function should be invoked before makeAppReady

                this.system.check();
                this.vutil.isSystemCompatible(); //this should be at environment-validation.js file
                this.system.mediaDevices.getMediaDeviceInfo();



                if (app == this.apps[1]) {
                    this.system.setAppDimension();
                }

                virtualclass.vutil.createReclaimButtonIfNeed();

                //To teacher
                virtualclass.user.assignRole(virtualclass.gObj.uRole, app);

                this.gObj.video = new window.virtualclass.media();

                this.gObj.video.audioVisual.init();

                var precheck = localStorage.getItem('precheck');
                if(precheck != null){
                    precheck = JSON.parse(precheck);
                }

                if(virtualclass.makePreCheckAvailable){
                    virtualclass.precheck.init();
                } else {
                    virtualclass.makeReadySocket();
                }
                // For initialize the Teacher Video
                if(!virtualclass.gObj.meetingMode){
                    virtualclass.videoHost.init(320 , 240);
                    virtualclass.networkStatus();
                } else {
                    // virtualclass.multiVideo.init();

                    // virtualclass.user.control.audioDisable()
                    // if(roles.hasAdmin()){
                    //     virtualclass.user.control.videoDisable()
                    // }
                }

                virtualclass.vutil.videoController();

                if(virtualclass.gObj.has_ts_capability && !virtualclass.vutil.isPlayMode()){
                    virtualclass.vutil.initTechSupportUi();
                }
                //nirmala
                var precheck = document.getElementById("precheckSetting");
                precheck.addEventListener("click",function(){
                    virtualclass.precheck.init(virtualclass.precheck);
                })

                this.raiseHand= window.raiseHand;
                this.raiseHand.init();
            },

            networkStatus: function(){
                virtualclass.videoHost.initVideoInfo();
            },

            makeReadySocket : function (){
                if (!virtualclass.vutil.isPlayMode()) {
                    // Init Socket only after both editor instances are ready.

                    var that = this;
                    var initSocket = setInterval(function () {
                        if (that.gObj.editorInitDone >= 2) {
                            that.initSocketConn();
                            clearInterval(initSocket);
                        }
                    }, 100);

                }
            },

            // makeThemeReady : function (editorbtn,allbg,active,hover){
            //
            //     var css="#virtualclassCont.congrea a.vceditor-btn{background-color: "+editorbtn.color+"} " +
            //         "#virtualclassCont.congrea .ui-widget-header{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
            //         "#virtualclassCont.congrea #virtualclassOptionsCont:first-child, #virtualclassOptionsCont,#virtualclassCont.congrea #navigator,#virtualclassCont.congrea #layoutQuiz .navbar," +
            //         "#virtualclassCont.congrea .vceditor-toolbar,#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget," +
            //         "#virtualclassCont.congrea #chatWidget .chatBarTab, #virtualclassCont.congrea .commandToolsWrapper," +
            //         "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton, #virtualclassCont.congrea #playButton," +
            //         "#virtualclassCont.congrea #confirmCancel #confirmCancelButton,#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText{background: linear-gradient(to right, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)}"+
            //         "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active,#virtualclassCont.congrea .commandToolsWrapper .tool.active a," +
            //         "#virtualclassCont.congrea .vmchat_room_bt.active,#virtualclassCont.congrea[data-currapp="+"EditorRich"+"] .vmchat_bar_button.active," +
            //         "#virtualclassCont.congrea .vmchat_support.active {background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100%)}"+
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassScreenShareTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassSessionEndTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassYtsTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassEditorRichTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassVideoTool:hover," +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassPollTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassQuizTool:hover , " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassSharePresentationTool:hover," +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassDocumentShareTool:hover," +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassEditorCodeTool:hover, " +
            //         "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassWhiteboardTool:hover, " +
            //         "#virtualclassCont.congrea #containerWb .commandToolsWrapper .tool a:hover, " +
            //         "#virtualclassCont.congrea #audioTest-box:hover, #virtualclassCont.congrea a.vceditor-btn:hover," +
            //         "#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover, #virtualclassCont.congrea #playButton:hover," +
            //         "#virtualclassCont.congrea #alwaysPress:hover,#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, " +
            //         "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover, " +
            //         "#virtualclassCont.congrea .commandToolsWrapper .tool.active a:hover{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}";
            //     function addcss(css){
            //         var head = document.getElementsByTagName('head')[0];
            //         var s = document.createElement('style');
            //         s.setAttribute('type', 'text/css');
            //         if (s.styleSheet) {   // IE
            //             s.styleSheet.cssText = css;
            //         } else {                // the world
            //             s.appendChild(document.createTextNode(css));
            //         }
            //         head.appendChild(s);
            //     }
            //     addcss(css);
            //
            // },

            initSocketConn: function () {
                if (this.system.webSocket) {
                    io.init(virtualclass.uInfo);
                    window.userdata = virtualclass.uInfo;
                }
            },

            html: {
                id: "virtualclassCont",
                optionsClass: "appOptions",
                init: function (cthis) {
                    this.virtualclass = cthis;
                },

                //TODO this should be created throught the simple html
                // Create left virtualclass app bar
                leftAppBar: function () {
                    //debugger;
                    var appsLen = document.getElementsByClassName('appOptions');
                    if (appsLen.length > 0) {
                        return; //which means the left app bar is already created
                    }

                    //var appCont = document.getElementById(this.id);

                    var appCont = document.querySelector('#virtualclassApp #virtualclassAppLeftPanel');
                    var appOptCont = virtualclass.getTemplate('appTools');
                    var appOptCont1=appOptCont();
                    $('#virtualclassAppLeftPanel').append(appOptCont1);
                    if (virtualclass.gObj.hasOwnProperty('errNotScreenShare')) {
                        virtualclass.view.disableSSUI();
                    }
                    if(virtualclass.gObj.hasOwnProperty('errAppBar')) {
                        virtualclass.view.disableLeftAppBar();
                    }

                    // Fix problem when the role is being reclaimed
                    // With current active application is whiteboard
                    //appOptCont1.style.zIndex = 100; //to do verify

                },

                createDiv: function (toolId, text, cmdToolsWrapper, cmdClass, toBeReplace) {

                    var ancTag = document.createElement('a');
                    ancTag.href = '#';
//                    if(text == 'documentShare'){
//                        ancTag.innerHTML = text;
//                    }
                    var lDiv = document.createElement('div');
                    lDiv.id = toolId;
                    if (typeof cmdClass != 'undefined ') {
                        lDiv.className = cmdClass;
                    }

                    var iconButton = document.createElement('span');
                    iconButton.className = "icon-" + text;
                    ancTag.appendChild(iconButton);

                    ancTag.dataset.title = virtualclass.lang.getString(text);

                    ancTag.className = 'tooltip';

                    if(toolId == 'virtualclassWhiteboardTool'){
                        // ancTag.dataset.doc = '_doc_0_0';
                        ancTag.dataset.doc = '_doc_0'+ '_' + virtualclass.gObj.wbCount;
                    }
                    lDiv.appendChild(ancTag);

                    if (typeof toBeReplace != 'undefined') {
                        var toBeReplace = document.getElementById('virtualclassScreenShareTool');
                        cmdToolsWrapper.replaceChild(lDiv, toBeReplace);
                    } else {
                        cmdToolsWrapper.appendChild(lDiv);
                    }
                },

                //todo transfered into vutility
                createElement: function (tag, id, _class) {
                    var elem = document.createElement(tag);
                    if (typeof id != 'undefined') {
                        elem.id = id;
                    }

                    if (typeof _class != 'undefined') {
                        if (_class.length > 1) {
                            for (var i = 0; i < _class.length; i++) {
                                elem.className += _class[i] + " ";
                            }
                        }
                    }
                    return elem;
                }
            },

            //TODO dispvirtualclassLayout should be renamed it with dispvirtualclassLayout
            dispvirtualclassLayout: function (appId) {
                if (typeof this.previous != 'undefined') {
                    //TODO this should be handle by better way, this is very rough
                    // remove case situation
                    if (this.previous.toUpperCase() != ('virtualclass' + this.currApp).toUpperCase()) {
                        //try{
                        let prevElem = document.getElementById(virtualclass.previous);
                        if(prevElem != null){
                            prevElem.style.display = 'none';
                        }

                        if (typeof appId != 'undefined') {
                            if (appId.toUpperCase() == "EDITORRICH") {
                                var editorCode = document.getElementById("virtualclassEditorCode");
                                if (editorCode != null) {
                                    editorCode.style.display = 'none';
                                }
                            }else{
                                console.log('EditorRich can not be display:none ' + appId);
                            }

                            if (appId.toUpperCase() == "EDITORCODE") {
                                var editor = document.getElementById("virtualclassEditorRich");
                                if (editor != null) {
                                    editor.style.display = 'none';
                                }
                            } else {
                                console.log('EditorCode can not be display:none ' + appId);
                            }

                        } else{
                            console.log('appId ' + appId + ' undefined');
                        }
                    } else {
                        //tricky case  when previous and current are same hide other appilcations but current
                        var allApps = document.getElementById('virtualclassCont').getElementsByClassName('virtualclass');
                        for (var i = 0; i < allApps.length; i++) {
                            allApps[i].style.display = 'none';
                        }
                    }
                }
                if (typeof appId != 'undefined') {
                    appId = "virtualclass" + capitalizeFirstLetter(appId);
                }
                var appElement = document.getElementById(appId);
                if (appElement != null) {
                    appElement.style.display = 'block';
                    console.log('App ' + appId + ' block');
                }
            },

            makeAppReady: function (app, cusEvent, data) {
                // var congdashboardClose = document.querySelector('#congdashboard button.close');
                // if(congdashboardClose != null){
                //     congdashboardClose.click();
                // }
                virtualclass.dashBoard.close();
                console.log('Application is ready' + app);
                this.view = window.view;
                this.currApp = virtualclass.vutil.capitalizeFirstLetter(app);
                console.log('Current App init ' + this.currApp);
                if (app != this.apps[1]) {
                    if (virtualclass.hasOwnProperty('previrtualclass') && roles.hasControls()) {
                        virtualclass.vutil.makeActiveApp("virtualclass" + app, virtualclass.previrtualclass);
                    }
                }

                //hiding editor controllers from footer
                if (typeof this.previous != 'undefined') {
                    if (this.previous == 'virtualclassEditorRich' || this.previous == 'virtualclassEditorCode') {
                        var editorType = this.previous.split('virtualclass')[1];
                        this.user.control.toggleDisplayEditorController(editorType, 'none');
                    }
                }

                //if not screen share
                if (app != this.apps[1]) {
                    this.dispvirtualclassLayout(app);
                    //add current app to main container
                    var vcContainer = document.getElementById('virtualclassCont');
                    vcContainer.dataset.currapp =  this.currApp;
                }

                if (typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
                    this.prevScreen.unShareScreen();
                }

                // call the function with passing dynamic variablesc
                if (app == "SharePresentation") {
                    //debugger;
                    if ("virtualclass" + app != virtualclass.previous) {

                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
                    }

                } else if (app == "DocumentShare") {
                    this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
                    if(roles.hasControls()){
                        if(!virtualclass.dts.firstRequest){
                            virtualclass.vutil.triggerDashboard(app);
                        } else{

                            /* For the request of Docs, we need to hide the popup Dashboard,
                             * If the notes order is not available from database then the application
                             * shows the popup Dashboard later
                             */
                            virtualclass.vutil.triggerDashboard(app, 'hidepopup');
                        }

                    }
                    system.initResize();
                } else {
                    var prevapp = localStorage.getItem('prevApp');
                    if (prevapp != null) {
                        var preapp = JSON.parse(prevapp);
                        if (preapp['name'] == "SharePresentation") {
                            preapp['name'] = "";
                            localStorage.setItem("prevApp", JSON.stringify(preapp));
                        }
                    }

                    if (app == "Whiteboard"){
                        var args = [];
                        for(var i=0; i<arguments.length; i++){
                            args.push(arguments[i]);
                        }
                        if(typeof cusEvent == 'undefined'){
                            args[1] = (cusEvent);
                        }

                        var id =  (typeof data != 'undefined') ? '_doc_' + data : '_doc_0_'+virtualclass.gObj.currSlide;
                        args[2] = id;

                        args.push('virtualclassWhiteboard');

                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(args));

                        prevapp = JSON.parse(prevapp);


                        //if(!virtualclass.gObj.wbRearrang && prevapp != null && prevapp.hasOwnProperty('wbcs')){
                        if(!virtualclass.gObj.wbRearrang && prevapp != null && localStorage.getItem('currSlide') != null){
                             var wIds = localStorage.getItem('wIds');
                             wIds = JSON.parse(wIds);
                             if(wIds != null && wIds.length > 0 ){
                                virtualclass.wbCommon.readyElements(wIds);
                                //virtualclass.gObj.currSlide = prevapp.wbcs;
                                //virtualclass.wbCommon.currentWhiteboard('_doc_0_'+virtualclass.gObj.currSlide);
                                virtualclass.wbCommon.reArrangeElements(wIds);
                                virtualclass.gObj.wbRearrang = true;
                                virtualclass.gObj.wIds = wIds;
                             }
                            //virtualclass.gObj.currWb = '_doc_0_'+virtualclass.gObj.currSlide;
                        }

                    //    virtualclass.gObj.currWb = '_doc_'+virtualclass.gObj.currSlide+'_'+virtualclass.gObj.currSlide;

                       virtualclass.wbCommon.identifyFirstNote(virtualclass.gObj.currWb);
                        system.initResize();
                    } else {
                        var currVideo= Array.prototype.slice.call(arguments)[2];
                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
                        // if(roles.hasControls() && app == 'Video' && !(currVideo && currVideo.init&&(currVideo.init.videoUrl|| currVideo.fromReload))){
                        //     virtualclass.vutil.triggerDashboard(app);
                        // }

                        if(currVideo && currVideo.init && currVideo.init.videoUrl  && currVideo.fromReload ){
                            var hidepopup =true;
                        }


                        if(roles.hasControls() && app == 'Video'){
                            if ("virtualclass" + app != virtualclass.previous) {


                                var dashboardnav = document.querySelector('#dashboardnav button');
                                if (dashboardnav != null) {
                                    dashboardnav.setAttribute("data-currapp","Video")
                                    if (dashboardnav.classList.contains('clicked')) {
                                        dashboardnav.classList.remove("clicked")  ;

                                    }
                                }
                            }
                            virtualclass.vutil.triggerDashboard(app,hidepopup);
                        }


                    }
                }
                this.previrtualclass = this.previous;

                if (app != this.apps[0] && app != this.apps[1] ) {
                    virtualclass.system.setAppDimension();
                }

                if (app != this.apps[1] && app != this.apps[2]&& app != this.apps[7] && virtualclass.hasOwnProperty('yts')) {
                    virtualclass.yts.destroyYT();
                }
                if (app != "Video" && virtualclass.hasOwnProperty('videoUl')) {
                    // to verify this
                    virtualclass.videoUl.videoUrl ="";
                    virtualclass.videoUl.videoId ="";

                    var dispVideo = document.getElementById("dispVideo")
                    if (dispVideo) {
                        dispVideo.style.display = "none";
                    }


                    $('.congrea #listvideo .playing').removeClass('playing');
                    $('.congrea #listvideo .removeCtr').removeClass('removeCtr');

                    if (typeof virtualclass.videoUl.player == 'object') {
                        // debugger;
                        virtualclass.videoUl.player.reset();
                        delete( virtualclass.videoUl.player);
                    }

                }
                if(roles.hasControls()) {
                    var currVideo= Array.prototype.slice.call(arguments)[2];
                    if (virtualclass.currApp == 'SharePresentation' || (virtualclass.currApp == 'Video')) {
                        virtualclass.vutil.initDashboardNav(currVideo);
                        if(virtualclass.currApp == 'Video'){
                            console.log('currApp ' + virtualclass.currApp);
                        }else{
                            if(!(virtualclass.sharePt.localStoragFlag)){
                                var dashboardnav =  document.querySelector('#dashboardnav button');
                                if(dashboardnav != null){
                                    dashboardnav.click();
                                }
                            }
                        }

                    } else if(virtualclass.currApp == 'DocumentShare'){
                        // this.checkDsTable();
                    }else {
                        virtualclass.vutil.removeDashboardNav();
                    }
                }

            },


            // Helper functions for making the app is ready
            appInitiator : {
                Whiteboard : function (app, cusEvent, id, container){
                    if(virtualclass.currApp == 'Whiteboard' &&  virtualclass.previous != 'virtualclassWhiteboard'){
                        virtualclass.view.window.resize(id);
                    }

                    if (typeof this.ss == 'object') {
                        this.ss.prevStream = false;
                    }

                    if (typeof this.previous != 'undefined') {
                        if (typeof cusEvent != 'undefined' && cusEvent == "byclick" && roles.hasControls() && virtualclass.currApp == 'Whiteboard') {
                            var docid = id.split('_doc_')[1];
                            virtualclass.vutil.beforeSend({'dispWhiteboard': true, cf: 'dispWhiteboard', 'd':docid});
                        }
                    }
                    //this.dispvirtualclassLayout(this.wbConfig.id);
                    //this should be checked with solid condition
                    virtualclass.gObj.currWb = id;
                    var wid = id;

                    if(typeof this.pdfRender[wid] != 'object'){
                        this.pdfRender[wid] = window.pdfRender();
                    }else if(virtualclass.currApp == 'Whiteboard' || virtualclass.currApp == 'DocumentShare'){
                        virtualclass.zoom.normalRender();
                    }
                    if(roles.isStudent() && virtualclass.currApp == 'Whiteboard'){
                         virtualclass.wbCommon.setCurrSlideNumber(id);
                    }

                    if(typeof id != 'undefined'){
                        if (typeof this.wb[id] != 'object') {
                            if(typeof this.wb != 'object'){
                                this.wb = {};
                            }
                            virtualclass.gObj.commandToolsWrapperId[id] =  'commandToolsWrapper' + id;
                            this.wb[id] = {};
                            virtualclass.gObj.tempReplayObjs[id] = [];

                            this.wb[id] = new window.whiteboard(this.wbConfig, id);

                            // this.wb[id].UI.mainContainer(container, id);
                            if(virtualclass.currApp == 'Whiteboard'){
                                var whiteboardContainer = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
                                if(!virtualclass.gObj.wbInitHandle){
                                    virtualclass.wbCommon.initNavHandler();
                                    virtualclass.gObj.wbInitHandle = true;
                                }
                            }else {
                                var whiteboardContainer = document.getElementById('cont' + id);
                            }

                            if(whiteboardContainer != null){
                                if(document.querySelector('vcanvas'+id) == null){
                                    var wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
                                    if(virtualclass.currApp == 'Whiteboard'){
                                        virtualclass.wbCommon.hideElement();
                                        var wnoteid = 'note' + id;
                                        var wnote = document.querySelector('#' +wnoteid);
                                        if(wnote != null){
                                             wnote.classList.add('canvasContainer', 'current');
                                             var wbHtml = wbTemplate({cn:id, hasControl : roles.hasControls()});
                                             wnote.innerHTML = wbHtml;
                                        }else {
                                             var wbHtml = "<div id='"+wnoteid+"' data-wb-id='"+id+"' class='canvasContainer current'>" + wbTemplate({cn:id, hasControl : roles.hasControls()}) + "</div>";

                                            if(id != '_doc_0_0'){
                                                whiteboardContainer.insertAdjacentHTML('beforeend', wbHtml);
                                            } else {
                                                whiteboardContainer.innerHTML = wbHtml;
                                                var vcanvas_doc = document.querySelector('#note_doc_0_0');
                                                if(vcanvas_doc != null){
                                                    vcanvas_doc.classList.add('current');
                                                }
                                            }
                                        }
                                    }else {
                                        var wbHtml =  wbTemplate({cn:id, hasControl : roles.hasControls()});
                                        whiteboardContainer.innerHTML = wbHtml;
                                    }
                                    var canvas = document.querySelector('#canvas' + id);
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


                                var vcan = virtualclass.wb[id].vcan;
                                if (roles.hasControls()) {
                                    virtualclass.wb[id].utility.setOrginalTeacherContent(app);
                                    virtualclass.wb[id].attachToolFunction(virtualclass.gObj.commandToolsWrapperId[id], true, id);
                                   var myoffset =  vcan.utility.canvasCalcOffset(vcan.main.canid);
                                   console.log('whietboard offset x=' + myoffset.x + ' ' + ' y=' + myoffset.y);
                                }

                                if(virtualclass.currApp == 'DocumentShare') {
                                    // var currNote = virtualclass.dts.docs.currNote; // this is obsolete here
                                    var currNote = virtualclass.dts.docs.note.currNote;

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

                                }  else {
                                     virtualclass.pdfRender[wid].init(canvas);
                                }

                                // Only need to  serve on after page refresh
                                var that = this;
                                virtualclass.storage.getWbData(id, function (){
                                    console.log('The data has been received from local storage');
                                });
                            }else{
                                alert('whiteboard container is null');
                            }
                        } else {
                            //if command tool wrapper is not added
                            var commonWrapperId = 'commandToolsWrapper'+id;
                            var commandToolsWrapper = document.getElementById('commandToolsWrapper'+id);
                            if (commandToolsWrapper == null && roles.hasControls()) {
                                virtualclass.wb[id].attachToolFunction(commonWrapperId, true, id);
                            }
                        }


                        var vcan = virtualclass.wb[id].vcan;
                        //important this need only if user draw the whiteboard
                        // after received image with teacher role.
                        //offset problem have to think about this
                        if (document.getElementById('canvas'+id) != null) {
                            vcan.utility.canvasCalcOffset(vcan.main.canid);
                            if (this.gObj.tempReplayObjs[id].length == 0) {
                                virtualclass.wb[id].utility.makeCanvasEnable();
                            }
                        }

                        if (this.previous == 'virtualclassScreenShare' && roles.hasControls()) {
                            if (!virtualclass.vutil.dimensionMatch("virtualclassWhiteboard", "virtualclassScreenShare")) {
                                virtualclass.wb[id].utility.lockvirtualclass();
                            }
                        }

                        this.previous = this.wbConfig.id;
                        if(roles.hasControls() && virtualclass.gObj.resize){
                            virtualclass.wb[id].utility.lockvirtualclass();
                        }
                    }else{
                        alert('id is undefined');
                    }
                    virtualclass.zoom.init();
                    // virtualclass.pdfRender[wid].initScaleController();
                },

                ScreenShare : function (app){
                    if (typeof this.ss != 'object') {
                        this.ss = new window.screenShare(virtualclass.ssConfig);
                    }
                    this.ss.init({type: 'ss', app: app});
                },

                Yts : function (app, custEvent, videoObj){
                    //this.dispvirtualclassLayout(virtualclass.ytsConfig.id);
                    // if there is not already sharing the youtube video
                    if (typeof videoObj != 'undefined' && videoObj != null) {
                        virtualclass.yts.init(videoObj, videoObj.startFrom);
                    } else {
                        // only display the layout if youtube is not sharing
                        if(document.querySelector("iframe#player") == null){
                            virtualclass.yts.init();
                        }
                    }

                    this.previous = virtualclass.ytsConfig.id;

                },

                EditorRich : function (app){
                    this.appInitiator.editor.call(virtualclass, app);
                },

                EditorCode : function (app){
                    this.appInitiator.editor.call(virtualclass, app);
                },

                SharePresentation: function(app, cusEvent) {
                    if (typeof this.ss == 'object') {
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
                    virtualclass.sharePt.attachMessageEvent("message", virtualclass.sharePt.pptMessageEventHandler);
                },

                Poll : function (app){

                    //alert("init Poll");
                    virtualclass.poll.init();
                },
                Quiz : function (app) {
                    virtualclass.quiz.init();
                },

                Video: function (app, custEvent, videoObj) {
                    if(typeof videoObj != 'undefined' && videoObj != null){
                        if (typeof videoObj.type == 'undefined'){
                            virtualclass.videoUl.init(videoObj, videoObj.startFrom);

                        }else if(videoObj.type == 'video_yts'){
                            virtualclass.videoUl.init();
                            virtualclass.yts.init(videoObj, videoObj.startFrom);

                        }else{

                            virtualclass.videoUl.init();

                        }

                    }else{
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

                editor: function(app) {
                    //showing controllers from footer
                    this.user.control.toggleDisplayEditorController(app.substring(app.indexOf('virtualclass'), app.length), 'block');

                    var revision = 0;
                    var clients = [];
                    var docs = "";
                    var operations = "";

                    if (app == this.apps[3]) {
                        virtualclass.editorRich.init(revision, clients, docs, operations);
                        this.previous = virtualclass.edConfig.id;
                    } else {
                        virtualclass.editorCode.init(revision, clients, docs, operations);
                        this.previous = virtualclass.edCodeConfig.id;
                    }

                    var writeMode = JSON.parse(localStorage.getItem(virtualclass.vutil.smallizeFirstLetter(app)));
                    var etType = virtualclass.vutil.smallizeFirstLetter(app);

                    if (!roles.hasAdmin()) {
                        if (writeMode == null) {
                            this[etType].cm.setOption('readOnly', 'nocursor');
                            this.user.control.toggleDisplayWriteModeMsgBox(app, false);
                            console.log('message box is created ' + app);
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



                //SharePresentation: function(app, cusEvent) {
                //if (typeof this.ss == 'object') {
                //    this.ss.prevStream = false;
                //}

                makeReadyDsShare : function (app, customEvent, docsObj){

                    if(!virtualclass.dts.docs.hasOwnProperty('currDoc')){
                        if(typeof docsObj != 'undefined'){
                            setTimeout(
                                function (){
                                     virtualclass.dts.init(docsObj);
                                },1000
                            )

                        } else {
                            virtualclass.dts.init();
                        }

                    }else {
                        // send the initialize for the user layout
                        if(roles.hasControls()){
                            ioAdapter.mustSend({'dts': {init: 'studentlayout'}, 'cf': 'dts'});
                            console.log('doc share current' );
                            virtualclass.dts.sendCurrentDoc();
                            virtualclass.dts.sendCurrentSlide();
                            //var slide = virtualclass.dts.docs[virtualclass.dts.docs.currDoc].currSlide;
                        }
                        
                        var slide = virtualclass.dts.docs.currNote;
                        // if( typeof slide != 'undefined' ){
                        if( typeof slide != 'undefined' ){
                            virtualclass.vutil.updateCurrentDoc(slide);
                        }
                    }



                    virtualclass.previous = virtualclass.dtsConfig.id;
                },

                DocumentShare: function(app, customEvent, docsObj) {
                    if(!virtualclass.hasOwnProperty('dts') || virtualclass.dts == null){
                        virtualclass.dts  = window.documentShare();
                    }else{
                        virtualclass.dts.firstRequest = false;
                    }

                    //if(!virtualclass.dts.docs.hasOwnProperty('currDoc')){
                    //      if(typeof docsObj != 'undefined'){
                    //           virtualclass.dts.init(docsObj);
                    //      } else {
                    //          virtualclass.dts.init();
                    //      }
                    //}else {
                    //    // send the initialize for the user layout
                    //    if(roles.hasControls()){
                    //        ioAdapter.mustSend({'dts': {init: 'studentlayout'}, 'cf': 'dts'});
                    //        console.log('doc share current' );
                    //        virtualclass.dts.sendCurrentDoc();
                    //        virtualclass.dts.sendCurrentSlide();
                    //    }
                    //}

                    //virtualclass.dts.init();
                    //this.previous = virtualclass.dtsConfig.id;

                    var args = [];

                    if(typeof app != 'undefined'){
                        args.push(app);
                    }

                    if(typeof customEvent != 'undefined'){
                        args.push(customEvent);
                    }

                    if(typeof docsObj != 'undefined'){
                        args.push(docsObj);
                    }

                    //  virtualclass.appInitiator.makeReadyDsShare.apply(virtualclass.appInitiator, args);

                    //  By doing below, There will be problem on replaying or executing the all packets for new user
                    var cthis = virtualclass;

                    if(!virtualclass.gObj.hasOwnProperty('docs')){
                        dstData = setTimeout(
                            function (){
                                /*  Handles alerting element is null
                                    If user comes to session after 2 hour,
                                    and the application was Document share when he left the session
                                 */
                                if(virtualclass.currApp == 'DocumentShare'){
                                    cthis.appInitiator.DocumentShare.apply(cthis.appInitiator, args);
                                }
                            },100
                        )
                    } else {
                        // IndexDb is not initialise
                        // misspacket on new user does not work
                        cthis.appInitiator.makeReadyDsShare.apply(cthis.appInitiator, args);
                        virtualclass.vutil.initDashboardNav();

                        /** This condition is satisfied when user page refresh without selecting any docs **/
                        if(!virtualclass.dts.firstRequest && !virtualclass.dts.noteExist()){
                            var dashboardnav =  document.querySelector('#dashboardnav button');
                            if(dashboardnav != null) {
                                dashboardnav.click();
                            }
                        }

                        if(dstData != null){
                            clearTimeout(dstData);
                        }

                        if(virtualclass.gObj.currWb != null){
                            if(virtualclass.currApp == 'DocumentShare' && virtualclass.pdfRender[virtualclass.gObj.currWb].page != null){
                                virtualclass.zoom.normalRender();
                            }
                        }

                    }
                },

                MultiVideo : function (){
                    var that = this;

                    if(!that.multiVideo.hasOwnProperty('initDone')){
                        setTimeout(
                            function (){
                                that.appInitiator.MultiVideo.apply(virtualclass);
                            }, 2000
                        );
                    }else {
                        that.multiVideo._init();
                    }
                    this.previous = virtualclass.mvConfig.id;
                },
            },

            attachFunction: function () {
                var allAppOptions = document.getElementsByClassName("appOptions");
                for (var i = 0; i < allAppOptions.length; i++) {
                    var anchTag = allAppOptions[i].getElementsByTagName('a')[0];
                    var that = this;
                    clickedAnchor = anchTag;
                    anchTag.onclick = function () {
                        that.initlizer(this);
                    };
                }
            },

            initlizer: function (elem) {
                var appName = elem.parentNode.id.split("virtualclass")[1];
                if (appName == 'SessionEndTool') {
                    virtualclass.popup.confirmInput(virtualclass.lang.getString('savesession'), function (confirm) {
                        if (!confirm) {
                            virtualclass.popup.confirmInput(virtualclass.lang.getString('startnewsession'),
                                function (confirm) {
                                    if (!confirm) {
                                        console.log('Not start new session');
                                        return;
                                    }

                                    virtualclass.clearSession();
                                    if(virtualclass.gObj.hasOwnProperty('beTeacher')){
                                        if(roles.isTeacher()){
                                            localStorage.setItem('uRole', 't');
                                        }
                                    }

                                }
                            )
                        } else {
                            ioStorage.completeStorage(undefined, undefined, 'sessionend');
                            setTimeout(function () {
                                    virtualclass.enablePreCheck = false; // to hanlde popup on session end
                                    if(virtualclass.recorder.hasOwnProperty('recordDone')){
                                        console.log('deleete recordDone');
                                        delete virtualclass.recorder.recordDone;
                                    }
                                    virtualclass.recorder.alreadyDownload = false;
                                    virtualclass.getContent = true;
                                    virtualclass.vutil.beforeSend({sEnd: true, 'cf': 'sEnd'}); //before close, clear student virtualclass data

                                    virtualclass.recorder.smallData = true;

                                    io.sock.close();

                                    virtualclass.recorder.startUploadProcess();
                                }, 300
                            );
                        }
                    });


                } else {
                    //alert(virtualclass.currApp);
                    appName = appName.substring(0, appName.indexOf("Tool"));
                    //  this.currApp = appName; //could be dangerous
                    if (!this.PrvAndCurrIsWss(this.previous, appName)) {
                        if(virtualclass.currApp == 'DocumentShare'){
                            virtualclass.gObj.screenRh = 160;
                        }
                        this.makeAppReady(appName, "byclick");
                        setTimeout(
                            function (){
                                virtualclass.gObj.screenRh = 60;
                            },
                            1500
                        );
                    } else {
                        alert(virtualclass.lang.getString('screensharealready'));
                    }
                }
                if (appName != "ScreenShare") {
                    virtualclass.vutil.removeClass('audioWidget', "fixed");
                }
            },

            PrvAndCurrIsWss: function (previous, appName) {
                return (previous == 'virtualclassWholeScreenShare' && appName == this.apps[2]) ? true : false;
            },

            prvCurrUsersSame: function () {
                var prvUser = localStorage.getItem('prvUser');
                if (prvUser == null) {
                    virtualclass.setPrvUser();
                } else {
                    prvUser = JSON.parse(prvUser);
                    if (prvUser.id != wbUser.id || prvUser.room != wbUser.room) {
                        virtualclass.gObj.sessionClear = true;
                        virtualclass.setPrvUser();
                        if (roles.hasControls()) {
                            localStorage.setItem('uRole', this.gObj.uRole);
                        }
                    }
                }
            },

            setPrvUser: function () {
                localStorage.clear();
                var prvUser = {id: wbUser.id, room: wbUser.room};
                localStorage.setItem('prvUser', JSON.stringify(prvUser));
            },

            registerPartial : function (){
                var contPara = {'whiteboardPath' : whiteboardPath};

                /** Registering the partials which have setting paramter **/
                var initTemplates = ["precheck", 'teacherVideo', 'audioWidget', 'appTools', 'popupCont', 'appToolsMeeting'];

                var isControl = {hasControl : roles.hasControls()};
                var context;
                for(var i=0; i<initTemplates.length; i++){
                    context = null;
                    if(initTemplates[i] == 'precheck' || initTemplates[i] == 'popupCont'){
                        context = contPara;
                    }else if(initTemplates[i] == 'audioWidget'){
                        context = virtualclassSetting;
                        context.isControl= roles.hasControls();
                        context.isMettingMode= (virtualclass.gObj.meetingMode) && (roles.isStudent());

                    }else if(initTemplates[i] == 'teacherVideo' || initTemplates[i] == 'appTools'){
                        context = isControl;
                    }
                    this.makeReadyTemplate(initTemplates[i], context);
                }

                /** Registering the partials which does not have context **/
                Handlebars.registerPartial({
                    docNotesMain: this.getTemplate('notesMain', 'documentSharing') ,
                    whiteboardToolbar: this.getTemplate('toolbar', 'whiteboard') ,
                    rightBar: this.getTemplate('rightBar') ,
                    recordingControl: this.getTemplate('recordingControl') ,
                    leftBar: this.getTemplate('leftBar') ,
                    main: this.getTemplate('main') ,
                    whiteboard: this.getTemplate('main', 'whiteboard'),
                    dashboardCont: this.getTemplate('dashboardCont'),
                    multiVideo: this.getTemplate('multiVideo'),

                });
            },

            registerHelper : function (){
                /** helper who returns the language String For template**/
                Handlebars.registerHelper("getString", function(string) {
                    // console.log('Language ' + string);
                    return virtualclass.lang.getString(string);
                });

                /** For debugging the handlebars code **/
                Handlebars.registerHelper("debug", function(optionalValue) {
                    console.log("Current Context");
                    console.log("====================");
                    console.log(this);

                    if (optionalValue) {
                        console.log("Value");
                        console.log("====================");
                        console.log(optionalValue);
                    }
                });

                Handlebars.registerHelper("getVideoType", function(optionalValue) {
                    if(virtualclass.gObj.meetingMode){
                        return 'multiVideo';
                    }else {
                        return 'teacherVideo';
                    }
                });

            },

            //the same function is defining at script.js
            createMainContainer : function (){

                var mainContainer = document.querySelector('#'+virtualclass.html.id);
                this.registerHelper();
                this.registerPartial();
                /** Inserting the main container of virtualclass **/
                var mainTemplate = this.getTemplate('main');

                var mainCont = {
                    isPlay : virtualclass.isPlayMode,
                    hasControls : roles.hasControls(),
                    meetingMode : virtualclass.gObj.meetingMode
                }

                var mainHtml = mainTemplate(mainCont);

                mainContainer.insertAdjacentHTML('afterbegin', mainHtml);
               // this.makeThemeReadyMain( virtualclassSetting.theme);


            },

            makeThemeReadyMain:function(color){

                var editorbtn={};
                var allbg={};
                var active={};
                var hover= {}
                // var frontColor=virtualclassSetting.themeSetting.mainFrontColor;
                // editorbtn.bgcolor= virtualclassSetting.themeSetting.edbtnBgColor;
                // editorbtn.color= virtualclassSetting.themeSetting.edbtnFrontColor;
                // allbg.fcolor=virtualclassSetting.themeSetting.allbgFcolor;
                // allbg.scolor= virtualclassSetting.themeSetting.allbgScolor;
                //
                // active.fcolor=virtualclassSetting.themeSetting.activeFcolor;
                // active.scolor=virtualclassSetting.themeSetting.activeScolor;
                // active.frontColor=virtualclassSetting.themeSetting.activeFrontColor;
                //
                // hover.fcolor=virtualclassSetting.themeSetting.hoverFcolor;
                // hover.scolor=virtualclassSetting.themeSetting.hoverScolor;
                // hover.frontColor=virtualclassSetting.themeSetting.hoverFrontColor;

                var frontColor="#f58a31"
                editorbtn.bgcolor= "#a1a3ee"
                editorbtn.color= "#1c22ee"
                allbg.fcolor="#004d00"
                allbg.scolor="#004d12"

                active.fcolor="#c5cc19";
                active.scolor="#008010";
                active.frontColor="#ee2e7f";

                hover.fcolor="#ee3938";
                hover.scolor="#ff315d";
                hover.frontColor="#008000";


                /**
                 * This code is needed during the color-developement
                 */
                // if(color =="green"){
                    // if(!editorbtn.color || editorbtn.color =="ns"){
                    //     editorbtn.color="#689057"
                    // }
                    // if(!allbg.fcolor || allbg.fcolor =="ns"){
                    //     allbg.fcolor="#004d00"
                    // }
                    // if(!allbg.scolor || allbg.scolor =="ns"){
                    //     allbg.scolor="#008000"
                    // }
                    // if(!active.fcolor || active.fcolor =="ns"){
                    //     active.fcolor="#abcc46"
                    // }
                    // if(!active.scolor || active.scolor =="ns"){
                    //     active.scolor="#008000"
                    // }
                    // if(!hover.fcolor || hover.fcolor =="ns"){
                    //     hover.fcolor="#18891d"
                    // }
                    // if( !hover.scolor || hover.scolor =="ns"){
                    //     hover.scolor="#aaff48"
                    // }
                    // editorbtn.color="#689057"
                    // allbg.fcolor="#004d00";
                    // allbg.scolor="#008000";
                    //
                    // active.fcolor="#abcc46";
                    // active.scolor="#008000";
                    //
                    // hover.fcolor="#18891d"
                    // hover.scolor="#aaff48";

              //  }


                this.makeThemeReady(frontColor,editorbtn,allbg,active,hover);
                this.makeThemeReadyVideo(frontColor,editorbtn,allbg,active,hover);
                this.makeThemeReadyPoll(frontColor,editorbtn,allbg,active,hover);
                this.makeThemeReadyPresentation(frontColor,editorbtn,allbg,active,hover);
                this.makeThemeReadyDocument(frontColor,editorbtn,allbg,active,hover);

            },

            makeThemeReady : function (frontColor,editorbtn,allbg,active,hover){

                var css="#virtualclassCont.congrea a.vceditor-btn{background-color: "+editorbtn.bgcolor+"} " +
                    "#virtualclassCont.congrea a.vceditor-btn{color: "+editorbtn.color+"} " +
                    "#virtualclassCont.congrea #alleditorRichContainer{background-color: "+editorbtn.color+"} " +
                    "#virtualclassCont.congrea .ui-widget-header{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea #virtualclassAppLeftPanel #dashboardnav .btn.clicked{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont:first-child, #virtualclassOptionsCont,#virtualclassCont.congrea #navigator,#virtualclassCont.congrea #layoutQuiz .navbar," +
                    "#virtualclassCont.congrea .vceditor-toolbar,#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget," +
                    "#virtualclassCont.congrea #chatWidget .chatBarTab, #virtualclassCont.congrea .commandToolsWrapper," +
                    "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton, #virtualclassCont.congrea #playButton," +
                    "#virtualclassCont.congrea #confirmCancel #confirmCancelButton,#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText{background: linear-gradient(to right, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active,#virtualclassCont.congrea .commandToolsWrapper .tool.active a," +
                    "#virtualclassCont.congrea .vmchat_room_bt.active,#virtualclassCont.congrea[data-currapp="+"EditorRich"+"] .vmchat_bar_button.active," +
                    "#virtualclassCont.congrea .vmchat_support.active {background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100%)}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions:hover, " +
                    "#virtualclassCont.congrea .containerWb .commandToolsWrapper .tool a:hover, " +
                    "#virtualclassCont.congrea #audioTest-box:hover, #virtualclassCont.congrea a.vceditor-btn:hover, " +
                    "#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover, #virtualclassCont.congrea #playButton:hover, " +
                    "#virtualclassCont.congrea #alwaysPress:hover,#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, " +
                    "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover, " +
                    "#virtualclassCont.congrea #stickycontainer .inner_bt:hover, "+
                    "#virtualclassCont.congrea #stickycontainer #contrAudioAll:hover, "+
                    "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover, "+
                    "#virtualclassCont.congrea #virtualclassAppRightPanel li a:hover"+
                    "{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea .appOptions:hover .cgIcon:before{color:"+hover.frontColor +"!important}"+
                    "#virtualclassCont.congrea .active .cgIcon:before{color:"+active.frontColor +"!important}"+
                    "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgIcon:before{color:"+hover.frontColor +"!important}"+
                    "#virtualclassCont.congrea a.vceditor-btn:hover .vceditor-btn-group a{color:"+hover.frontColor +"!important}"+
                    "#virtualclassCont.congrea .commandToolsWrapper .tool:hover .cgIcon:before{color:"+hover.frontColor +"!important}"+
                    "#virtualclassCont.congrea .commandToolsWrapper .tool.active .cgIcon:before{color:"+active.frontColor +"!important}"+
                    "#virtualclassCont.congrea #virtualclassAppRightPanel li:hover .cgText{color:"+hover.frontColor +"!important}"+
                    "#virtualclassCont.congrea .cgIcon:before{color:"+frontColor+"!important}"+
                    "#virtualclassCont.congrea .cgText{color:"+frontColor+"!important}";


                // "#virtualclassCont.congrea #virtualclassAppRightPanel li a:focus"+
                // "{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}";
                // function addcss(css){
                //     var head = document.getElementsByTagName('head')[0];
                //     var s = document.createElement('style');hover
                //     s.setAttribute('type', 'text/css');
                //     if (s.styleSheet) {   // IE
                //         s.styleSheet.cssText = css;
                //     } else {                // the world
                //         s.appendChild(document.createTextNode(css));
                //     }
                //     head.appendChild(s);
                // }
                this.addCss(css);

            },

            makeThemeReadyVideo:function(frontColor,btn,allbg,active,hover){
                var css="#virtualclassCont.congrea #VideoDashboard #congreaShareVideoUrlCont button{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important} " +
                    "#virtualclassCont.congrea .ui-widget-header{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea #listvideo .linkvideo .videoTitleCont:before, " +
                    "#virtualclassCont.congrea #listvideo .linkvideo .controls .editanch:before, "+
                    "#virtualclassCont.congrea #listvideo .linkvideo .controls:before{color:"+allbg.fcolor+"!important}"+
                    "#virtualclassCont.congrea #VideoDashboard button{color:"+frontColor+"!important}"+
                    "#virtualclassCont.congrea #listvideo .linkvideo.playing{border:solid "+allbg.fcolor+" 1px!important}";
                this.addCss(css);
            },

            makeThemeReadyPoll:function(frontColor,btn,allbg,active,hover){
                var css= "#virtualclassCont.congrea #virtualclassPoll .btn.btn-default, "+
                    "#virtualclassCont.congrea #virtualclassPoll #resultLayoutHead button, "+
                    "#virtualclassCont.congrea #virtualclassPoll #stdPollContainer #btnVote"+
                    "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+";}"+
                    "#virtualclassCont.congrea .bootstrap .pollNavBar > li > a {color:"+frontColor+" ; }"+
                    "#virtualclassCont.congrea .bootstrap .navListTab:hover"+
                    "{background: linear-gradient(to bottom, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important;color:"+hover.frontColor+"!important;}"+
                    "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, "+
                    "#virtualclassCont.congrea #virtualclassPoll .controlIcon:before{color:"+allbg.fcolor+"!important}" ;

                this.addCss(css);
            },
            makeThemeReadyPresentation:function(frontColor,btn,allbg,active,hover){
                var css= "#virtualclassCont.congrea #SharePresentationDashboard .btn-default"+
                    "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+"!important;}"+
                    "#virtualclassCont.congrea #virtualclassPoll #chartMenuCont a, "+
                    "#virtualclassCont.congrea #SharePresentationDashboard .controls:before{color:"+allbg.fcolor+"!important}" ;
                this.addCss(css);
            },

            makeThemeReadyDocument:function(frontColor,btn,allbg,active,hover){
                var css= "#virtualclassCont.congrea #DocumentShareDashboard #newDocBtn, "+
                    "#virtualclassCont.congrea #DocumentShareDashboard .linkdocs.links[data-selected='0']"+
                    "{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important;color:"+frontColor+"!important;}"+
                    "#virtualclassCont.congrea #DocumentShareDashboard .linkdocs.links[data-selected='1']"+
                    "{background: linear-gradient(to bottom, "+active.fcolor+" 0%,"+active.scolor+" 100%) !important;;color:"+active.frontColor+"!important;}";

                this.addCss(css);
            },

            addCss:function(css){
                var head = document.getElementsByTagName('head')[0];
                var s = document.createElement('style');
                s.setAttribute('type', 'text/css');
                if (s.styleSheet) {   // IE
                    s.styleSheet.cssText = css;
                } else {                // the world
                    s.appendChild(document.createTextNode(css));
                }
                head.appendChild(s);
            },

            makeReadyTemplate : function (tempname, context){
                var template = JST['templates/'+tempname+'.hbs'];
                Handlebars.registerPartial(tempname, template(context));
            },

            /**
             *  This function returns the template
             *  name expects the template name
             *  submodule expects the sub folder
             */
            getTemplate : function (name, submodule){
                if(typeof submodule == 'undefined'){
                    var template = JST['templates/'+name+'.hbs'];
                } else {
                    var template = JST['templates/'+submodule+'/'+name+'.hbs'];
                }
                return template;
            }
        };

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

})(window);
