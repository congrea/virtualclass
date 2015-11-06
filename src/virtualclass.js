(function (window) {
    window.virtualclass = function () {
        var playMode = (wbUser.virtualclassPlay != '' ? parseInt(wbUser.virtualclassPlay, 10) : 0);
        return {
            isPlayMode :playMode,
            apps: ["Whiteboard", "ScreenShare", 'Yts', 'EditorRich', 'EditorCode'],
            appSessionEnd: "virtualclassSessionEnd",
            appAudioTest: "virtualclassAudioTest",

            //appAudioTestPlay : "virtualclassAudioTestPlay",
            rWidgetConfig: {id: 'audioWidget'},
            wb: "",
            ss: "",
            wss: "",
            rw: "",
            lang: {},
            error: [],
            gObj: {
                uid: window.wbUser.id,
                uRole: window.wbUser.role,
                uName: window.wbUser.name,
                tempReplayObjs: [], //for store temp replayObjs
                alreadyReplayFromStorage: false,
                commandToolsWrapperId: 'commandToolsWrapper',
                editorInitDone: 0,
                resize : false
            },

            clearSession: function () {
                window.pageEnter = new Date().getTime();

                virtualclass.vutil.beforeSend({sEnd: true, 'cf': 'sEnd'}, null, true);
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

                this.wbConfig = {id: "virtualclass" + this.apps[0], classes: "appOptions"};
                this.ssConfig = {id: "virtualclass" + this.apps[1], classes: "appOptions"};
                this.ytsConfig = {id: "virtualclass" + this.apps[2], classes: "appOptions"};
                this.edConfig = {id: "virtualclass" + this.apps[3], classes: "appOptions"};
                this.edCodeConfig = {id: "virtualclass" + this.apps[4], classes: "appOptions"};

                //this.wssConfig = { id : "virtualclass" + this.apps[2], classes : "appOptions"};
                this.user = new window.user();
                this.lang.getString = window.getString;
                this.lang.message = window.message;
                this.vutil = window.vutil;
                this.media = window.media;
                //    this.chat = window.chat;
                this.system = window.system;
                this.recorder = window.recorder;
                this.converter = window.converter;
                this.clear = "";
                this.currApp = this.vutil.capitalizeFirstLetter(app);

                this.storage = window.storage;
                //if (virtualclass.system.indexeddb) {

                
                this.storage.init(function () {
                    if (!virtualclass.vutil.isPlayMode()) {
                        ioStorage.completeStorage(JSON.stringify(virtualclass.uInfo));
                    }
                });


                this.dirtyCorner = window.dirtyCorner;

                this.html.init(this);
                this.adapter = window.adapter;

                virtualclass.chat = new Chat();
                virtualclass.chat.init();
                virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
                virtualclass.xhr = window.xhr;
                virtualclass.xhr.init();

                virtualclass.dtCon = virtualclass.converter();
                virtualclass.pbar = progressBar;

                //editor which is rich text editor which has various options

                virtualclass.editorRich = window.editor('editorRich', 'virtualclassEditorRich', 'virtualclassEditorRichBody');

                //simple code editor with markdown
                virtualclass.editorCode = window.editor('editorCode', 'virtualclassEditorCode', 'virtualclassEditorCodeBody');

                virtualclass.yts = window.yts();


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

                //first this line is befre this.dirtyCorner assigned neard about 51 line number
                // here because check for old browsers which does not support indexeddb,
                //inside storage.init() we are using indexeddb so, by above position there would
                // system coampablity error could not be generated.

                //this.storage = window.storage;
                //if (virtualclass.system.indexeddb) {
                //    this.storage.init(function () {
                //        if (!virtualclass.vutil.isPlayMode()) {
                //            ioStorage.completeStorage(JSON.stringify(io.cfg));
                //        }
                //    });
                //}

                //1
                //virtualclass.wb.utility.displayCanvas();
                //virtualclass.yts = window.yts();

                if (app == this.apps[1]) {
                    this.system.setAppDimension();
                }

                virtualclass.vutil.createReclaimButtonIfNeed();

                   //To teacher
                virtualclass.user.assignRole(virtualclass.gObj.uRole, app);

                this.gObj.video = new window.virtualclass.media();

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
                    var appsLen = document.getElementsByClassName('appOptions');
                    if (appsLen.length > 0) {
                        return; //which means the left app bar is already created
                    }

                    var appCont = document.getElementById(this.id);
                    var appOptCont = this.createElement('div', 'virtualclassOptionsCont');
                    appCont.insertBefore(appOptCont, appCont.firstChild);

                    this.createDiv(virtualclass.edConfig.id + "Tool", "editorRich", appOptCont, virtualclass.edConfig.classes);
                    this.createDiv(virtualclass.wbConfig.id + "Tool", "whiteboard", appOptCont, virtualclass.wbConfig.classes);
                    this.createDiv(virtualclass.ssConfig.id + "Tool", "screenshare", appOptCont, virtualclass.ssConfig.classes);
                    this.createDiv(virtualclass.ytsConfig.id + "Tool", "youtubeshare", appOptCont, virtualclass.ytsConfig.classes);
                    this.createDiv(virtualclass.edCodeConfig.id + "Tool", "editorCode", appOptCont, virtualclass.edCodeConfig.classes);

                    if (virtualclass.gObj.hasOwnProperty('errNotScreenShare')) {
                        virtualclass.view.disableSSUI();
                    }

                    if (roles.hasControls()) {
                        this.createDiv(virtualclass.appSessionEnd + "Tool", "sessionend", appOptCont, 'appOptions');
                    }
                    if (virtualclass.gObj.hasOwnProperty('errAppBar')) {
                        virtualclass.view.disableLeftAppBar();
                    }

                },

                createDiv: function (toolId, text, cmdToolsWrapper, cmdClass, toBeReplace) {
                    var ancTag = document.createElement('a');
                    ancTag.href = '#';

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
                //appId =
                if (typeof this.previous != 'undefined') {
                    //TODO this should be handle by better way, this is very rough
                    // remove case situation
                    if (this.previous.toUpperCase() != ('virtualclass' + this.currApp).toUpperCase()) {
                        document.getElementById(virtualclass.previous).style.display = 'none';

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

            makeAppReady: function (app, cusEvent, videoObj) {
                console.log('Application is ready' + app);

                this.view = window.view;
                this.currApp = virtualclass.vutil.capitalizeFirstLetter(app);

                console.log('Current App init ' + this.currApp);

                //TODO this should be simplyfied
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
                
                // call the function with passing dynamic variables
                this.appInitiator[app].apply(virtualclass,  Array.prototype.slice.call(arguments));

                this.previrtualclass = this.previous;

                if (app != this.apps[0] && app != this.apps[1]) {
                    virtualclass.system.setAppDimension();
                }

                if (app != this.apps[1] && app != this.apps[2] && virtualclass.hasOwnProperty('yts')) {
                    virtualclass.yts.destroyYT();
                }
            },
            
            // Helper functions for making the app is ready
            appInitiator : {
                Whiteboard : function (app, cusEvent){
                    if (typeof this.ss == 'object') {
                        this.ss.prevStream = false;
                    }

                    if (typeof this.previous != 'undefined') {
                        if (typeof cusEvent != 'undefined' && cusEvent == "byclick") {
                            virtualclass.vutil.beforeSend({'dispWhiteboard': true, cf: 'dispWhiteboard'});
                        }
                    }
                    //this.dispvirtualclassLayout(this.wbConfig.id);
                    //this should be checked with solid condition
                    if (typeof this.wb != 'object') {
                        this.wb = new window.whiteboard(this.wbConfig);
                        this.wb.utility = new window.utility();
                        this.wb.alreadyReplay = false;
                        //this.view = window.view;

                        this.wb.packContainer = new window.packContainer();
                        this.wb.draw_object = window.draw_object;
                        this.wb.makeobj = window.makeobj;
                        this.wb.readyFreeHandObj = window.readyFreeHandObj;
                        this.wb._replay = _replay;
                        this.wb.readyTextObj = window.readyTextObj;

                        this.wb.bridge = window.bridge;
                        this.wb.response = window.response;
//                        var olddata = "";
//                        this.wb.utility.initUpdateInfo(olddata);
                        virtualclass.wb.utility.displayCanvas(); // TODO this should be invoke only once

                        if (roles.hasControls()) {
                            // window.virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true); //copy from initDefaultInfo at utility.js
                            //if (localStorage.getItem('orginalTeacherId') == null) {
                            virtualclass.wb.utility.setOrginalTeacherContent(app);
                            // }

                            virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);

                            //if (localStorage.getItem('orginalTeacherId') == null) {
                            //    virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true); // after assign role whene refresh there would coming toolbar and reclaimb bar
                            //}


                            vcan.utility.canvasCalcOffset(vcan.main.canid);
                        }

                        // Only need to  serve on after page refresh
                        if (!this.alreadyReplayFromStorage && this.gObj.tempReplayObjs.length > 0) {
                            this.wb.utility.replayFromLocalStroage(this.gObj.tempReplayObjs);
                        }


                    } else {
                        //if command tool wrapper is not added
                        var commandToolsWrapper = document.getElementById('commandToolsWrapper');
                        if (commandToolsWrapper == null && roles.hasControls()) {
                            virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                        }
                    }

                    if (typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
                        this.prevScreen.unShareScreen();
                    }

                    //important this need only if user draw the whiteboard
                    // after received image with teacher role.
                    //offset problem have to think about this
                    if (document.getElementById('canvas') != null) {
                        vcan.utility.canvasCalcOffset(vcan.main.canid);
                        if (this.gObj.tempReplayObjs.length == 0) {
                            virtualclass.wb.utility.makeCanvasEnable();
                        }
                    }

                    if (this.previous == 'virtualclassScreenShare' && roles.hasControls()) {
                        if (!virtualclass.vutil.dimensionMatch("virtualclassWhiteboard", "virtualclassScreenShare")) {
                            virtualclass.wb.utility.lockvirtualclass();
                        }
                    }

                    this.previous = this.wbConfig.id;
                    if(roles.hasControls() && virtualclass.gObj.resize){
                        virtualclass.wb.utility.lockvirtualclass();
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
                
                
                editor : function (app){
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
                }
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
                                   // window.location.reload();
                                }
                            )
                        } else {
                            ioStorage.completeStorage(undefined, undefined, 'sessionend');
                            setTimeout(function () {
                                    virtualclass.getContent = true;
                                    virtualclass.vutil.beforeSend({sEnd: true, 'cf': 'sEnd'}); //before close, clear student virtualclass data
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
            }

            //TODO remove this function
            //the same function is defining at script.js
        };
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
})(window);
