/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
function (window){
    window.vmApp = function (){
//        vmApp.storage = window.storage;
//        vmApp.storage.init();

        return {
            apps : ["Whiteboard", "ScreenShare", "WholeScreenShare"],
            appSessionEnd : "vAppSessionEnd",
            appAudioTest : "vAppAudioTest",
            //appAudioTestPlay : "vAppAudioTestPlay",
            rWidgetConfig : {id: 'audioWidget' },
            wb : "", 
            ss : "",
            wss: "",
            rw : "",
            lang : {},
            error: [],
            gObj : {
              uid : window.wbUser.id,
              uRole : window.wbUser.role,
              uName : window.wbUser.name
            },
            
              
            //init : function (urole, app, sessionClear){
            init : function (urole, app){
//                if(urole == 't'){
//                    if(localStorage.getItem('orginalTeacherId') == null){
//                        localStorage.setItem('orginalTeacherId', this.gObj.uid);
//                    }
//                }
                
                
                this.wbConfig = { id : "vApp" + this.apps[0], classes : "appOptions"};
                this.ssConfig = { id : "vApp" + this.apps[1], classes : "appOptions"};
                this.wssConfig = { id : "vApp" + this.apps[2], classes : "appOptions"};
                this.user = new window.user();
                this.lang.getString = window.getString;
                this.lang.message = window.message;
                this.vutil = window.vutil;
                this.media = window.media; 
            //    this.chat = window.chat;
                this.system = window.system;
                this.recorder = window.recorder;
                this.clear = "";
                this.currApp = app;

                this.storage = window.storage;
                this.storage.init();
                //this.sessionClear = sessionClear;
               
                this.dirtyCorner = window.dirtyCorner;
                

                this.html.init(this);
                this.adapter = window.adapter;
                
//                if(this.sessionClear){
//                  //   localStorage.clear(); //clear all when user/room is changed
////                    var prvUser = {id:wbUser.id, room : wbUser.room};
////                    localStorage.setItem('prvUser', JSON.stringify(prvUser));
//                    vApp.setPrvUser();
//                    if(this.gObj.uRole == 't'){
//                        localStorage.setItem('teacherId', wbUser.id);
//                    }
//                }
                
                this.makeAppReady(app, "byclick");
                
                //this should be at top
                this.system.check();
                this.vutil.isSystemCompatible();
                
                
//                if(vApp.gObj.sessionClear){
//                    localStorage.clear(); //clear all when user/room is changed
//                    var prvUser = {id:wbUser.id, room : wbUser.room};
//                    localStorage.setItem('prvUser', JSON.stringify(prvUser));
//                }
                
                vApp.wb.utility.displayCanvas();
                
                
                if(app == this.apps[1]){
                    this.system.setCanvasDimension();
                }

                  //To teacher
                vApp.user.assignRole(vApp.gObj.uRole, app);

                if(vApp.gObj.uRole == 't'){
                    vcan.utility.canvasCalcOffset(vcan.main.canid);
                }

                this.gObj.video = new window.vApp.media();
                this.initSocketConn();                  
                
            },
              
            initSocketConn : function (){
                //window.imageurl = "http://localhost/whiteboard/images/quality-support.png";
                if(this.system.webSocket){
                  var wbUser = window.wbUser;
                  vApp.uInfo = {
                      'userid':wbUser.id, 
                      'sid':wbUser.sid,
                      'rid': wbUser.path,
                      'authuser':wbUser.auth_user,
                      'authpass':wbUser.auth_pass,
                      'userobj': {'userid':wbUser.id,'name':wbUser.name, 'img' : window.imageurl, role :  wbUser.role},
                      'room':wbUser.room
                      };
                      io.init(vApp.uInfo);
                      window.userdata = vApp.uInfo;
                  }
        
            },
              
            html : {
                id : "vAppCont",
                optionsClass : "appOptions",
                init : function (cthis){
                    this.vapp = cthis;   
                },
                
                //TODO this should be created throught the simple html
                
                optionsWithWrapper : function (){
                    var appCont = document.getElementById(this.id);
                    var appOptCont =  this.createElement('div', 'vAppOptionsCont');
                    appCont.insertBefore(appOptCont, appCont.firstChild);
                        
                    this.createDiv(vApp.wbConfig.id + "Tool", "whiteboard", appOptCont, vApp.wbConfig.classes);
                    this.createDiv(vApp.ssConfig.id + "Tool", "screenshare", appOptCont, vApp.ssConfig.classes);
                    
//                    if(localStorage.getItem('orginalTeacherId') != null){
//                         this.createDiv(vApp.appSessionEnd + "Tool", "sessionend", appOptCont, 'appOptions');
//                    }
                    if(vApp.gObj.uRole == 't'){
                        this.createDiv(vApp.appSessionEnd + "Tool", "sessionend", appOptCont, 'appOptions');
                    }    
                    
                },  
                
                createDiv: function(toolId, text, cmdToolsWrapper, cmdClass, toBeReplace) {
                    var ancTag = document.createElement('a');
                    ancTag.href = '#';

                    var lDiv = document.createElement('div');
                    lDiv.id = toolId;
                    if (typeof cmdClass != 'undefined') {
                        lDiv.className = cmdClass;
                    }

                    var imgTag = document.createElement('img');
                    
                    imgTag.alt = this.vapp.lang.getString(text);
                    if(typeof window.whiteboardPath != 'undefined'){
                        imgTag.src = window.whiteboardPath + '/images/' + text + ".png";
                    }else{
                        imgTag.src = '/images/' + text + ".png";
                    }
                    ancTag.appendChild(imgTag);
                    //ancTag.title = '';
                    
                    ancTag.dataset.title = vApp.lang.getString(text);;
                    ancTag.className = 'tooltip';

                    lDiv.appendChild(ancTag);
                    
                    if(typeof toBeReplace != 'undefined'){
                        var toBeReplace = document.getElementById('vAppScreenShareTool');
                        cmdToolsWrapper.replaceChild(lDiv, toBeReplace);
                    }else{
                        cmdToolsWrapper.appendChild(lDiv);
                    }
                },
                
                //todo transfered into vutility
                createElement : function (tag, id, _class){
                    var elem = document.createElement(tag);
                    if(typeof id != 'undefined'){
                        elem.id = id;
                    }

                    if(typeof _class != 'undefined'){
                        if(_class.length > 1){
                          for(var i=0; i<_class.length; i++){
                             elem.className += _class[i] + " ";
                          }
                        }
                    }
                    return elem;
                }
              },
              
              
              makeAppReady : function (app, cusEvent){
                  if(app == this.apps[0]){
                        if(typeof this.ss == 'object'){
                              this.ss.prevStream = false;   
                        } 
                      
                        if(typeof this.previous != 'undefined'){
                            if(typeof cusEvent != 'undefined' && cusEvent == "byclick"){
                                vApp.wb.utility.beforeSend({'dispWhiteboard' : true});
                            }
                            document.getElementById(vApp.previous).style.display = 'none';
                        }
                        
                        var wb = document.getElementById(this.wbConfig.id);
                        
                        if(wb != null){
                            wb.style.display = 'block';
                        }
                        
                        //this should be checked with solid condition
                        if(typeof this.wb != 'object'){
                            this.wb = new window.whiteboard(this.wbConfig); 
                            this.wb.utility = new window.utility();


                            this.wb.view = window.view;

                            this.wb.packContainer = new window.packContainer();
                            this.wb.draw_object = window.draw_object;
                            this.wb.makeobj =  window.makeobj;
                            this.wb.readyFreeHandObj = window.readyFreeHandObj;
                            this.wb._replay = _replay;
                            this.wb.readyTextObj = window.readyTextObj;

                            this.wb.bridge = window.bridge;
                            this.wb.response = window.response;
                            var olddata = "";
                            this.wb.utility.initUpdateInfo(olddata);
                            
                        }
                        
                        if(typeof this.prevScreen != 'undefined' && this.prevScreen.hasOwnProperty('currentStream')){
                            this.prevScreen.unShareScreen();    
                        }
                        if(vApp.hasOwnProperty('prevApp') && vApp.gObj.uRole == 't'){
                            vApp.vutil.makeActiveApp("vApp" + app, vApp.prevApp);    
                        }
                      

                        //important
                        //this need only if user draw the whiteboard
                        // after received image with teacher role.
                        //offset problem have to think about this
                        if(document.getElementById('canvas') != null){
                            vcan.utility.canvasCalcOffset(vcan.main.canid);
                            if(this.prevApp == "vAppScreenShare" || this.prevApp == "WholeScreenShare"){
                              //important can be crtical
                              //vApp.wb.utility.makeCanvasEnable();  
                            }
                            vApp.wb.utility.makeCanvasEnable();
                        }
                        this.previous = this.wbConfig.id;
                        this.prevApp = this.wbConfig.id;
                        
                  }else if(app == this.apps[1]){
                        if(typeof this.ss != 'object'){
                            this.ss = new window.screenShare(vApp.ssConfig);
                        }
                        this.ss.init({type: 'ss', app : app});
                  }else if(app == this.apps[2]){
                      if(typeof this.wss != 'object'){
                        this.wss = new window.screenShare(vApp.wssConfig);
                      }
                      this.wss.init({type: 'wss', app : app});
                  }
              },
              
     
              
              attachFunction :function (){
                  var allAppOptions = document.getElementsByClassName("appOptions");
                  for(var i=0; i<allAppOptions.length; i++){
                      var anchTag = allAppOptions[i].getElementsByTagName('a')[0];
                      var that = this;
                      clickedAnchor = anchTag;
                      anchTag.onclick = function (){
                          that.initlizer(this);
                      };
                  }
              },
              
            initlizer : function (elem){
                var appName = elem.parentNode.id.split("vApp")[1];
                if(appName == 'SessionEndTool'){
                    appName = appName.substring(0, appName.indexOf("Tool"));
                   
                    vApp.vutil.makeActiveApp("vApp" + appName, vApp.previous);
                    vApp.storage.config.endSession();
                    vApp.wb.utility.beforeSend({sEnd : true});
                    
                    if(vApp.hasOwnProperty('prevScreen') && vApp.prevScreen.hasOwnProperty('currentStream')){
                        vApp.prevScreen.unShareScreen();
                    }
                    vApp.prevApp = "vApp" + appName;
                } else{
                    appName = appName.substring(0, appName.indexOf("Tool"));
                    this.currApp = appName;
                    if(!this.PrvAndCurrIsWss(this.previous, appName)){
                        this.makeAppReady(appName, "byclick");
                    }else{
                        alert("Already the whole screen is being shared.");
                    }
                }
            },
              
            PrvAndCurrIsWss : function (previous, appName){
                return (previous == 'vAppWholeScreenShare' && appName == this.apps[2]) ? true : false;
            },
              
              
            initStudentScreen : function (imgData, d, stype, stool){
                app = stype;
                if(typeof vApp[app] != 'object' ){
                     if(typeof vtype != 'undefined'){
                         vApp.recorder.recImgPlay = true;
                     }
                     vApp.makeAppReady(stool);

                }else{
                     var prvScreen = document.getElementById(vApp.previous);
                     if(prvScreen != null){
                         prvScreen.style.display = 'none';
                         document.getElementById(vApp[app].id).style.display = 'block';
                     }
                }

                if(d.hasOwnProperty('d')){
                    vApp[app].dimensionStudentScreenResize(d);
                    vApp[app].drawImages(imgData);
                }else{
                    if(typeof dim == 'undefined' || ((typeof prvWidth != 'undefined') && (prvWidth != d.w) && (!d.hasOwnProperty('x')))){
                        dim = true
                        vApp[app].dimensionStudentScreen(d.w, d.h);
                        prvWidth = d.w;
                        prvHeight = d.h;
                    }

                    if(d.hasOwnProperty('x')){
                        vApp[app].drawImages(imgData, d);
                    }else{
                        if(d.hasOwnProperty('w')){
                           vApp[app].localCanvas.width = d.w;
                           vApp[app].localCanvas.height = d.h;
                        }
                        vApp[app].drawImages(imgData);
                    }
                }

                vApp.previous =  vApp[app].id;
            },
            
            prvCurrUsersSame : function (){
                var prvUser = localStorage.getItem('prvUser');
                if(prvUser == null){
                    //alert("suman bogati");
                    //localStorage.clear();
//                    var prvUser = {id:wbUser.id, room : wbUser.room};
//                    localStorage.setItem('prvUser', JSON.stringify(prvUser));
                   vApp.setPrvUser();
                }else{
                    prvUser = JSON.parse(prvUser);
                    if(prvUser.id != wbUser.id || prvUser.room != wbUser.room){
                        vApp.gObj.sessionClear = true;
                        vApp.setPrvUser();
                        if(this.gObj.uRole == 't'){
                             localStorage.setItem('teacherId', wbUser.id);
                        }
                    }
                }
            },
            
            setPrvUser : function (){
                localStorage.clear();
                var prvUser = {id:wbUser.id, room : wbUser.room};
                localStorage.setItem('prvUser', JSON.stringify(prvUser));
            }
               
            //TODO remove this function
            //the same function is defining at script.js
          }
      }
  }
)(window);
