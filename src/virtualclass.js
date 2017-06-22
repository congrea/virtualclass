(function (window) {
    window.virtualclass = function () {
        var dstData = null;
        var playMode = (wbUser.virtualclassPlay != '' ? parseInt(wbUser.virtualclassPlay, 10) : 0);
        return {
            isPlayMode :playMode,
            apps: ["Whiteboard", "ScreenShare", 'Yts', 'EditorRich', 'EditorCode', 'SharePresentation','Poll','Video', 'DocumentShare','Quiz'],
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
            //lang: {},
            error: [],
            gObj: {
                uid: window.wbUser.id,
                uRole: window.wbUser.role,
                uName: window.wbUser.name,
                tempReplayObjs: {}, //for store temp replayObjs
                // commandToolsWrapperId: 'commandToolsWrapper',
                commandToolsWrapperId: {},
                editorInitDone: 0,
                resize : false,
                has_ts_capability : (wbUser.ts == 1 || wbUser.ts == true) ? true : false
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
                        lname: wbUser.lname,
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
                this.ytsConfig = {id: "virtualclass" + this.apps[2], classes: "appOptions"};
                this.edConfig = {id: "virtualclass" + this.apps[3], classes: "appOptions"};
                this.edCodeConfig = {id: "virtualclass" + this.apps[4], classes: "appOptions"};
                this.ptConfig = {id: "virtualclass" + this.apps[5], classes: "appOptions"};
                this.plConfig ={id:"virtualclass"+this.apps[6],classes:"appOptions"};
                this.viConfig ={id:"virtualclass"+this.apps[7],classes:"appOptions"};
                this.dtsConfig = {id: "virtualclass" + this.apps[8], classes: "appOptions"};
                this.qzConfig = {id:"virtualclass"+this.apps[9],classes:"appOptions"};

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
//                this.storage.init(function () {
//                    if (!virtualclass.vutil.isPlayMode()) {
//                        ioStorage.completeStorage(JSON.stringify(virtualclass.uInfo));
//                    }
//                });

                if(this.system.isIndexedDbSupport()){
                    this.storage.init(function () {
                        if (!virtualclass.vutil.isPlayMode()) {
                            ioStorage.completeStorage(JSON.stringify(virtualclass.uInfo));
                        }
                    });
                }else {
                    console.log('Indexeddb does not support');
                }

                this.dirtyCorner = window.dirtyCorner;
                this.html.init(this);
                this.adapter = window.adapter;

              
                if(!virtualclass.system.mybrowser.hasOwnProperty('name')){
                    this.system.setBrowserDetails();
                }

                virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
                virtualclass.xhr = window.xhr;
                virtualclass.xhr.init();

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

                //For change color uncomment this and give the appropriate values
                // var editorbtn={color : 'blue'}
                // var allbg = {fcolor : '#777999', scolor : '#666999'};
                // var active = {fcolor : '#459878', scolor : '#698568'};
                // var hover = {fcolor : '#989655', scolor : '#837394'};
                // virtualclass.makeThemeReady(editorbtn, allbg,active,hover);

                // For initialize the Teacher Video
                virtualclass.videoHost.init(320 , 240);

                // dts means document sharing
                //virtualclass.dts  = window.documentShare();

                //virtualclass.documentShare.init();
                
                if(virtualclass.gObj.has_ts_capability && !virtualclass.vutil.isPlayMode()){
                    virtualclass.vutil.initTechSupportUi();
                }
                //nirmala
                var precheck = document.getElementById("precheckSetting");
                precheck.addEventListener("click",function(){
                    
                 virtualclass.precheck.init(virtualclass.precheck);
                    
                })
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

            makeThemeReady : function (editorbtn,allbg,active,hover){

                var css="#virtualclassCont.congrea a.vceditor-btn{background-color: "+editorbtn.color+"} " +
                    "#virtualclassCont.congrea .ui-widget-header{background: linear-gradient(to bottom, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%) !important}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont:first-child, #virtualclassOptionsCont,#virtualclassCont.congrea #navigator,#virtualclassCont.congrea #layoutQuiz .navbar," +
                    "#virtualclassCont.congrea .vceditor-toolbar,#virtualclassCont.congrea #virtualclassAppRightPanel #audioWidget," +
                    "#virtualclassCont.congrea #chatWidget .chatBarTab, #virtualclassCont.congrea .commandToolsWrapper," +
                    "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton, #virtualclassCont.congrea #playButton," +
                    "#virtualclassCont.congrea #confirmCancel #confirmCancelButton,#virtualclassCont.congrea #recordPlay .rv-vanilla-modal-body #downloadPcCont #downloadSessionText{background: linear-gradient(to right, "+allbg.fcolor+" 0%,"+allbg.scolor+" 100%)}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont .appOptions.active,#virtualclassCont.congrea .commandToolsWrapper .tool.active a," +
                    "#virtualclassCont.congrea .vmchat_room_bt.active,#virtualclassCont.congrea[data-currapp="+"EditorRich"+"] .vmchat_bar_button.active," +
                    "#virtualclassCont.congrea .vmchat_support.active {background: radial-gradient(ellipse at center, "+active.fcolor+" 0%,"+active.scolor+" 100%)}"+
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassScreenShareTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassSessionEndTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassYtsTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassEditorRichTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassVideoTool:hover," +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassPollTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassQuizTool:hover , " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassSharePresentationTool:hover," +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassDocumentShareTool:hover," +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassEditorCodeTool:hover, " +
                    "#virtualclassCont.congrea #virtualclassOptionsCont #virtualclassWhiteboardTool:hover, " +
                    "#virtualclassCont.congrea #containerWb .commandToolsWrapper .tool a:hover, " +
                    "#virtualclassCont.congrea #audioTest-box:hover, #virtualclassCont.congrea a.vceditor-btn:hover," +
                    "#virtualclassCont.congrea #audioWidget #speakerPressOnce:hover, #virtualclassCont.congrea #playButton:hover," +
                    "#virtualclassCont.congrea #alwaysPress:hover,#virtualclassCont.congrea #confirmCancel #confirmCancelButton:hover, " +
                    "#virtualclassCont.congrea #confirm.popupWindow #confirmOk #confirmOkButton:hover, " +
                    "#virtualclassCont.congrea .commandToolsWrapper .tool.active a:hover{background: radial-gradient(ellipse at center, "+hover.fcolor+" 0%,"+hover.scolor+" 100%) !important}";
                function addcss(css){
                    var head = document.getElementsByTagName('head')[0];
                    var s = document.createElement('style');
                    s.setAttribute('type', 'text/css');
                    if (s.styleSheet) {   // IE
                        s.styleSheet.cssText = css;
                    } else {                // the world
                        s.appendChild(document.createTextNode(css));
                    }
                    head.appendChild(s);
                }
                addcss(css);

            },

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
                    var appOptCont = this.createElement('div', 'virtualclassOptionsCont');
                    appCont.insertBefore(appOptCont, appCont.firstChild);
                    
                    if(roles.hasAdmin()){
                        this.createDiv(virtualclass.viConfig.id + "Tool", "videoUpload", appOptCont, virtualclass.viConfig.classes);
                        this.createDiv(virtualclass.plConfig.id + "Tool", "poll", appOptCont, virtualclass.plConfig.classes);
                        this.createDiv(virtualclass.qzConfig.id + "Tool", "quiz", appOptCont, virtualclass.qzConfig.classes);
                    }


                    this.createDiv(virtualclass.edConfig.id + "Tool", "editorRich", appOptCont, virtualclass.edConfig.classes);
                    this.createDiv(virtualclass.wbConfig.id + "Tool", "whiteboard", appOptCont, virtualclass.wbConfig.classes);
                    this.createDiv(virtualclass.ssConfig.id + "Tool", "screenshare", appOptCont, virtualclass.ssConfig.classes);
                    this.createDiv(virtualclass.ytsConfig.id + "Tool", "youtubeshare", appOptCont, virtualclass.ytsConfig.classes);
                    this.createDiv(virtualclass.edCodeConfig.id + "Tool", "editorCode", appOptCont, virtualclass.edCodeConfig.classes);
                    this.createDiv(virtualclass.ptConfig.id + "Tool", "sharePresentation", appOptCont, virtualclass.ptConfig.classes);

                    if(roles.hasAdmin()){
                        this.createDiv(virtualclass.dtsConfig.id + "Tool", "documentShare", appOptCont, virtualclass.dtsConfig.classes);
                        this.createDiv(virtualclass.appSessionEnd + "Tool", "sessionend", appOptCont, 'appOptions');
                    }

                    if (virtualclass.gObj.hasOwnProperty('errNotScreenShare')) {
                        virtualclass.view.disableSSUI();
                    }


                    if (virtualclass.gObj.hasOwnProperty('errAppBar')) {
                        virtualclass.view.disableLeftAppBar();
                    }

                    // Fix problem when the role is being reclaimed
                    // With current active application is whiteboard
                    appOptCont.style.zIndex = 1;

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
                        ancTag.dataset.doc = '_doc0_0';
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
                        document.getElementById(virtualclass.previous).style.display = 'none';
//                        }catch(e){
//                            
//                        }
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

                // call the function with passing dynamic variablesc
                if (app == "SharePresentation") {
                    //debugger;
                    if ("virtualclass" + app != virtualclass.previous) {
                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
                    }
                } else if (app == "DocumentShare") {
                    this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
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
                        var id =  (typeof data != 'undefined') ? '_doc_' + data : '_doc_0_0';
                        args[2] = id;

                        args.push('virtualclassWhiteboard');

                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(args));
                    }else {
                        this.appInitiator[app].apply(virtualclass, Array.prototype.slice.call(arguments));
                    }
                }
                this.previrtualclass = this.previous;

                if (app != this.apps[0] && app != this.apps[1] ) {
                    virtualclass.system.setAppDimension();
                }

                if (app != this.apps[1] && app != this.apps[2] && virtualclass.hasOwnProperty('yts')) {
                    virtualclass.yts.destroyYT();
                }
                if (app != "Video" && virtualclass.hasOwnProperty('videoUl')) {

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

            },

            // Helper functions for making the app is ready
            appInitiator : {
                Whiteboard : function (app, cusEvent, id, container){


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
                              var whiteboardContainer = document.getElementById('virtualclassWhiteboard');
                            }else {
                              var whiteboardContainer = document.getElementById('cont' + id);
                            }

                            if(whiteboardContainer != null){
                              if(document.querySelector('vcanvas'+id) == null){
                                var wbTemplate = virtualclass.getTemplate('main', 'whiteboard');
                                var wbHtml = wbTemplate({cn:id, hasControl : roles.hasControls()});
                                whiteboardContainer.innerHTML = wbHtml;
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
                                vcan.utility.canvasCalcOffset(vcan.main.canid);
                              }

                              // Only need to  serve on after page refresh
                              var that = this;
                              virtualclass.storage.getWbData(id, function (){
                                // if (!that.alreadyReplayFromStorage && that.gObj.tempReplayObjs[id].length > 0) {
                                if (that.gObj.tempReplayObjs[id].length > 0) {
                                  that.wb[id].utility.replayFromLocalStroage(that.gObj.tempReplayObjs[id]);
                                }
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

                        if (typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
                            this.prevScreen.unShareScreen();
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

                    if (typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
                        this.prevScreen.unShareScreen();
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

                    if (typeof videoObj != 'undefined' && videoObj != null) {
                        virtualclass.videoUl.init(videoObj, videoObj.startFrom);
                    } else {

                        virtualclass.videoUl.init();

                    }

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
                            virtualclass.dts.init(docsObj);
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
                            var slide = virtualclass.dts.docs.currNote;
                            if( slide > 0 ){
                                virtualclass.vutil.updateCurrentDoc(slide);
                            }
                        }
                    }

                    virtualclass.previous = virtualclass.dtsConfig.id;
                },

                DocumentShare: function(app, customEvent, docsObj) {
                    if(!virtualclass.hasOwnProperty('dts') || virtualclass.dts == null){
                        virtualclass.dts  = window.documentShare();
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
                                cthis.appInitiator.DocumentShare.apply(cthis.appInitiator, args);
                            },100
                        )
                    } else {
                        // IndexDb is not initialise
                        // misspacket on new user does not work
                        cthis.appInitiator.makeReadyDsShare.apply(cthis.appInitiator, args);

                        if(dstData != null){
                            clearTimeout(dstData);
                        }
                    }
                }
            },

            attachFunction: function () {
                //debugger;
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

                    appName = appName.substring(0, appName.indexOf("Tool"));
                    //  this.currApp = appName; //could be dangerous
                    if (!this.PrvAndCurrIsWss(this.previous, appName)) {
                        this.makeAppReady(appName, "byclick");
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
              var initTemplates = ["precheck", 'teacherVideo', 'audioWidget', 'appTools', 'popupCont'];

              var isControl = {hasControl : roles.hasControls()};
              var context;
              for(var i=0; i<initTemplates.length; i++){
                context = null;
                if(initTemplates[i] == 'precheck' || initTemplates[i] == 'popupCont'){
                  context = contPara;
                }else if(initTemplates[i] == 'audioWidget'){
                  context = virtualclassSetting;
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
              });
            },

            registerHelper : function (){
              /** helper who returns the language String For template**/
              Handlebars.registerHelper("getString", function(string) {
                console.log('Language ' + string);
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
            },

            //the same function is defining at script.js
            createMainContainer : function (){
                var mainContainer = document.querySelector('#'+virtualclass.html.id);
                this.registerHelper();
                this.registerPartial();
                /** inserting the main container of virtualclass **/
                var mainTemplate = this.getTemplate('main');
                var mainHtml = mainTemplate();
                mainContainer.insertAdjacentHTML('afterbegin', mainHtml);
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
