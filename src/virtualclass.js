

(function (window) {
    window.virtualclass = function () {
        return {
//            apps : ["Whiteboard", "ScreenShare", "WholeScreenShare"],
            apps : ["Whiteboard", "ScreenShare", 'Yts', 'Editor'],
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
                uName: window.wbUser.name
            },
            clearSession: function (appName) {
                window.pageEnter = new Date().getTime();
                appName = appName.substring(0, appName.indexOf("Tool")); //this should be rmove

                virtualclass.vutil.makeActiveApp("virtualclass" + appName, virtualclass.previous);
                virtualclass.storage.config.endSession();
                virtualclass.wb.utility.beforeSend({sEnd: true});

                if (virtualclass.hasOwnProperty('prevScreen') && virtualclass.prevScreen.hasOwnProperty('currentStream')) {
                    virtualclass.prevScreen.unShareScreen();
                }
                virtualclass.previrtualclass = "virtualclass" + appName;
            },
            init: function (urole, app) {
                this.wbConfig = {id: "virtualclass" + this.apps[0], classes: "appOptions"};
                this.ssConfig = {id: "virtualclass" + this.apps[1], classes: "appOptions"};
                this.ytsConfig = {id: "virtualclass" + this.apps[2], classes: "appOptions"};
                this.edConfig = { id : "virtualclass" + this.apps[3], classes : "appOptions"};
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
                this.currApp = app;

//                this.storage = window.storage;
//                this.storage.init();
                //this.sessionClear = sessionClear;

                this.dirtyCorner = window.dirtyCorner;

                this.html.init(this);
                this.adapter = window.adapter;

                this.makeAppReady(app, "byclick");

                //TODO system checking function should be invoked before makeAppReady

                this.system.check();
                this.vutil.isSystemCompatible(); //this should be at environment-validation.js file

                //first this line is befre this.dirtyCorner assigned neard about 51 line number
                // here because check for old browsers which does not support indexeddb, 
                //inside storage.init() we are using indexeddb so, by above position there would 
                // system coampablity error could not be generated.
                this.storage = window.storage;
//                virtualclass.storeFirstData = function (){
//                    alert("hi brother");
//                }
                //!virtualclass.vutil.isPlayMode()
                if (virtualclass.system.indexeddb) {
                    this.storage.init(function () {
                        if (!virtualclass.vutil.isPlayMode()) {
                            io.completeStorage(JSON.stringify(io.cfg));
                        }
                    });
                }

                virtualclass.wb.utility.displayCanvas();
                virtualclass.yts = window.yts();

                if (app == this.apps[1]) {
                    this.system.setAppDimension();
                }

                //To teacher
                virtualclass.user.assignRole(virtualclass.gObj.uRole, app);

                if (virtualclass.gObj.uRole == 't') {
                    vcan.utility.canvasCalcOffset(vcan.main.canid);
                }

                this.gObj.video = new window.virtualclass.media();

                if (!virtualclass.vutil.isPlayMode()) {
                    this.initSocketConn();
                }

                virtualclass.chat = new Chat();
                virtualclass.chat.init();
                virtualclass.vutil.initOnBeforeUnload(virtualclass.system.mybrowser.name);
                virtualclass.xhr = window.xhr;
                virtualclass.xhr.init();
                virtualclass.dtCon = virtualclass.converter();
                virtualclass.pbar = progressBar;
                virtualclass.editor = window.editor();

            },

            initSocketConn: function () {
                if (this.system.webSocket) {
                    var wbUser = window.wbUser;
                    //  wbUser.imageurl = window.whiteboardPath + "images/quality-support.png";
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
                            role: wbUser.role
                        },
                        'room': wbUser.room
                    };
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
                optionsWithWrapper: function () {
                    var appCont = document.getElementById(this.id);
                    var appOptCont = this.createElement('div', 'virtualclassOptionsCont');
                    appCont.insertBefore(appOptCont, appCont.firstChild);


                    this.createDiv(virtualclass.wbConfig.id + "Tool", "whiteboard", appOptCont, virtualclass.wbConfig.classes);
                    this.createDiv(virtualclass.ssConfig.id + "Tool", "screenshare", appOptCont, virtualclass.ssConfig.classes);
                    this.createDiv(virtualclass.ytsConfig.id + "Tool", "youtubeshare", appOptCont, virtualclass.ssConfig.classes);
                    this.createDiv(virtualclass.edConfig.id + "Tool", "editor", appOptCont, virtualclass.edConfig.classes);


                    if (virtualclass.gObj.hasOwnProperty('errNotScreenShare')) {
                        virtualclass.wb.view.disableSSUI();
                    }

                    if (virtualclass.gObj.uRole == 't') {
                        this.createDiv(virtualclass.appSessionEnd + "Tool", "sessionend", appOptCont, 'appOptions');
                    }
                    if (virtualclass.gObj.hasOwnProperty('errAppBar')) {
                        virtualclass.wb.view.disableLeftAppBar();
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

            dispvirtualclassLayout: function (appId) {

                if (typeof this.previous != 'undefined') {
                    if(this.previous != 'virtualclass'+this.currApp){
                        document.getElementById(virtualclass.previous).style.display = 'none';
                    }
                }

                var appElement = document.getElementById(appId);
                if (appElement != null) {
                    appElement.style.display = 'block';
                }
            },

            makeAppReady: function (app, cusEvent, videoId) {

                this.currApp = app;

                //TODO this should be simplyfied
                if (app != this.apps[1]) {
                    if (virtualclass.hasOwnProperty('previrtualclass') && virtualclass.gObj.uRole == 't') {
                        virtualclass.vutil.makeActiveApp("virtualclass" + app, virtualclass.previrtualclass);
                    }
                }

                //if not screen share

                if(app != this.apps[1] ){
                   this.dispvirtualclassLayout('virtualclass' +app);
                }


                if (app == this.apps[0]) {
                    if (typeof this.ss == 'object') {
                        this.ss.prevStream = false;
                    }

                    if (typeof this.previous != 'undefined') {
                        if (typeof cusEvent != 'undefined' && cusEvent == "byclick") {
                            virtualclass.wb.utility.beforeSend({'dispWhiteboard': true});
                        }
                    }

                    //this.dispvirtualclassLayout(this.wbConfig.id);

                    //this should be checked with solid condition
                    if (typeof this.wb != 'object') {
                        this.wb = new window.whiteboard(this.wbConfig);
                        this.wb.utility = new window.utility();

                        this.wb.view = window.view;

                        this.wb.packContainer = new window.packContainer();
                        this.wb.draw_object = window.draw_object;
                        this.wb.makeobj = window.makeobj;
                        this.wb.readyFreeHandObj = window.readyFreeHandObj;
                        this.wb._replay = _replay;
                        this.wb.readyTextObj = window.readyTextObj;

                        this.wb.bridge = window.bridge;
                        this.wb.response = window.response;
                        var olddata = "";
                        this.wb.utility.initUpdateInfo(olddata);

                    }

                    if (typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')) {
                        this.prevScreen.unShareScreen();
                    }

                    //important this need only if user draw the whiteboard
                    // after received image with teacher role.
                    //offset problem have to think about this
                    if (document.getElementById('canvas') != null) {
                        vcan.utility.canvasCalcOffset(vcan.main.canid);
                        virtualclass.wb.utility.makeCanvasEnable();
                    }

                    if (this.previous == 'virtualclassScreenShare' && virtualclass.gObj.uRole == 't') {
                        if (!virtualclass.vutil.dimensionMatch("virtualclassWhiteboard", "virtualclassScreenShare")) {
                            virtualclass.wb.utility.lockvirtualclass();
                        }
                    }

                    this.previous = this.wbConfig.id;
                    //    this.previrtualclass = this.previous;

//                        currAppId = this.wbConfig.id;
                    //TODO this should be into same varible
                } else if (app == this.apps[1]) {
                    if (typeof this.ss != 'object') {
                        this.ss = new window.screenShare(virtualclass.ssConfig);
                    }
                    this.ss.init({type: 'ss', app: app});
                } else if (app == this.apps[2]) {
                    //this.dispvirtualclassLayout(virtualclass.ytsConfig.id);

                    if (typeof videoId != 'undefined') {
                        virtualclass.yts.init(videoId);
                    } else {
                        virtualclass.yts.init();
                    }

                    this.previous = virtualclass.ytsConfig.id;

                    var measureRes = virtualclass.system.measureResoultion({
                        'width': window.innerWidth,
                        'height': window.innerHeight
                    });

                    virtualclass.vutil.setContainerWidth(measureRes);

                } else if (app == this.apps[3]) {

                    //this.dispvirtualclassLayout(virtualclass.ytsConfig.edConfig);

                    //var whiteboard = document.getElementById('virtualclassWhiteboard');
                    //whiteboard.style.display = 'none';

                    var revision = 0;
                    var clients = [];
                    var docs = "";
                    var operations = "";
                    virtualclass.editor.init(revision, clients, docs, operations);
                    this.previous = virtualclass.edConfig.id;
                }

                //this.createDiv(vApp.edConfig.id + "Tool", "editor", appOptCont, vApp.edConfig.classes);

                this.previrtualclass = this.previous;

                if(app == this.apps[2] || app == this.apps[3]){
                    var measureRes = virtualclass.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
                    virtualclass.vutil.setContainerWidth(measureRes);
                }

                if (app != this.apps[1] && app != this.apps[2] && virtualclass.hasOwnProperty('yts')) {
                    virtualclass.yts.destroyYT();
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
                    if (!confirm(virtualclass.lang.getString('savesession'))) {
                        if (!confirm(virtualclass.lang.getString('startnewsession'))) {
                            return;
                        }
                        virtualclass.clearSession(appName);
                        window.location.reload();
                    } else {
                        io.completeStorage(undefined, undefined, 'sessionend');
                        setTimeout(function () {
                                virtualclass.getContent = true;
                                io.sock.close();
                                virtualclass.recorder.startUploadProcess();
                            }, 300
                        );
                    }
                } else {
                    appName = appName.substring(0, appName.indexOf("Tool"));
                    //  this.currApp = appName; //could be dangerous
                    if (!this.PrvAndCurrIsWss(this.previous, appName)) {
                        this.makeAppReady(appName, "byclick");
                    } else {
                        alert("Already the whole screen is being shared.");
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
                        if (this.gObj.uRole == 't') {
                            localStorage.setItem('teacherId', wbUser.id);
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
        }
    }
})(window);
