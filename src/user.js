// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window, document) {
        var user  = function (config) { 
            return {
                init  : function (){

                },

                //TODO function name should be change
                assignRole : function (role, app){
                     if(role == 't'){
                         
                          vApp.html.optionsWithWrapper();
                          vApp.attachFunction();
                          
                          var vAppOptionsContWidth = document.getElementById("vAppOptionsCont").offsetWidth;
                          window.vApp.wb.attachToolFunction(vcan.cmdWrapperDiv, true);

                          if(app == 'Whiteboard' && vApp.gObj.uRole == 't'){
                              if(vApp.hasOwnProperty('prevApp')){
                                  vApp.vutil.makeActiveApp("vApp" + app, vApp.prevApp);
                              } else{
                                  vApp.vutil.makeActiveApp("vApp" + app);
                              }

                              vApp.wb.utility.makeCanvasEnable();
                          }

                     }else{
                       //  vApp.html
                         
                     }
                },

                teacherIsAlreadyExist : function (){
                    var allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');

                    var role;
                    for(var i=0; i<allExistedUser.length; i++){
                        role = allExistedUser[i].getAttribute('data-role');
                        if(role  == 't'){
                            return true;
                        }
                    }
                    return false;
                },

                createControl : function (userId, controls){
                    var controlCont = document.createElement('div');
                    controlCont.id = userId + "ControlContainer";
                    controlCont.className = "controls";
                    this.createControlDivs(controlCont, userId, controls);
                    return controlCont;
                },
                
                createConroller : function (){
                    
                },
                
                // important
                // TODO this function should be normalize
                createControlDivs : function (controlCont, userId, controls){
                    var that  = this;
                    
                    //var userObj = localStorage.getItem(userId);
                    var uObj = false;
                    var userObj = localStorage.getItem(userId);
                    
                    if(userObj != null){
                        uObj =  true;
                        userObj = JSON.parse(userObj);
                    }
                    
                    var assignDisable = localStorage.getItem('reclaim');

                    if(assignDisable != null && assignDisable){
                        var aRoleEnable =  false;
                    }else{
                        var aRoleEnable =  true;
                    }


                    //var this should be in normalize in function 
                    for(var i=0; i<controls.length; i++){
                        if(controls[i] == 'assign'){
                            var assignImg = document.createElement('img');
                            var imgName = "contrAssign";
                            assignImg.id = userId + imgName + "Img";
                            assignImg.src = window.whiteboardPath +  "images/" + imgName + ".png";
                            assignImg.className = "toolTip";
                            
                            assignImg.setAttribute('data-title', "assignRole");
                            
                            
//                            var assignAnch = document.createElement('a');
//                            assignAnch.id = userId + imgName + "Anch";
//                            assignAnch.className = "tooltip";
//                            
//                            assignAnch.appendChild(assignImg);
//                            
                            
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(assignImg);        
                            
                            controlCont.appendChild(imgCont);
                            assignImg.className = 'contrAssign';
                            vApp.user.control.changeAttrbute(userId, assignImg, aRoleEnable, 'assign', 'aRole');
                            assignImg.addEventListener('click', function (){ that.control.init.call(that, assignImg);});
                        
                        } else if(controls[i] == 'audio'){  
                            var audBlock = document.createElement('img');
                            imgName = "contrAud";
                            audBlock.id = userId + imgName + "Img";
                            audBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            
                            audBlock.className = "toolTip";
                            audBlock.setAttribute('data-title', "audioDisable");
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(audBlock);        
                            controlCont.appendChild(imgCont);
                            
                            if(uObj && userObj.hasOwnProperty('aud')){
                                var audEnable = (userObj.aud) ? true : false;
                            } else {
                                var audEnable = true;
                            }
                            vApp.user.control.changeAttrbute(userId, audBlock, audEnable, 'audio', 'aud');

                            
                            audBlock.addEventListener('click', function (){ that.control.init.call(that, audBlock);});
                            
                        }else if (controls[i] == 'chat'){
                            var chatBlock = document.createElement('img');
                            imgName = "contrChat";
                            chatBlock.id = userId + imgName + "Img";
                            chatBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            chatBlock.className = "toolTip";
                            chatBlock.setAttribute('data-title', "chatDisable"); 
                            
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(chatBlock);        
                            controlCont.appendChild(imgCont);
                            
                            chatBlock.addEventListener('click', function (){ that.control.init.call(that, chatBlock);});
                            
                            
                            
                            if(uObj && userObj.hasOwnProperty('ch')){
                                var chEnable = (userObj.ch) ? true : false;
                            } else {
                                var chEnable = true;
                            }
                            vApp.user.control.changeAttrbute(userId, chatBlock, chEnable, 'chat', 'ch');
                        }
                    }
                },
                control : {
                    changeAttrbute : function (userId, elem, elemEnable, control, label){
                        if(elemEnable){
                            elem.setAttribute('data-'+control+'-disable', "false");
                            
                            elem.className =  control+"Img  enable";
                            vApp.user.control.updateUser(userId, label, true);
                        }else{
                            elem.setAttribute('data-'+control+'-disable', 'true');
                            elem.className = control+"Img  block";
                            vApp.user.control.updateUser(userId, label, false);
                        }
                    },

                    init : function (tag){
                        var compId = tag.id;  
                        var ep = compId.indexOf("contr");
                        var userId = compId.substring(0, ep);

                        var restString = compId.split('contr')[1];
                        var imgPos = restString.indexOf("Img");
                        var control = restString.substring(0, imgPos);
                        
                        if(control == 'Assign'){
                            var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                            
//                            if(tag.getAttribute('data-assign-disable') == 'true'){
//                                this.control.changeAttrbute(userId, tag, true, 'assign', 'aRole');
//                            }else{
//                                this.control.changeAttrbute(userId, tag, false, 'assign', 'aRole');
//                            }
//                            
//                            
                           //this.control.changeAttrbute(userId, tag, assignDisable, 'assign', 'aRole');
                           
                           if(!assignDisable){
                               this.control.changeAttrbute(userId, tag, assignDisable, 'assign', 'aRole');
                              
                               vApp.user.control._assign(userId);
                               
//                               var allUserElem = document.getElementsByClassName("assignImg");
//                               for(var i=0; i<allUserElem.length; i++){
//                                   allUserElem[i].className = "assignImg block";
//                               }

                             vApp.user.control.addClassToAssign('block');
                               
                           }
                           
//                           addClassToAssign(action){
//                               var allUserElem = document.getElementsByClassName("assignImg");
//                               for(var i=0; i<allUserElem.length; i++){
//                                   allUserElem[i].className = "assignImg " + action;
//                               }
//                           }
                           
                           
                           
                        }else if (control == 'Chat'){
                            var action;
                            if(tag.getAttribute('data-chat-disable') == 'true'){
                                tag.className = 'contrChatBlock';  
                                action = 'enable';
                              	this.control.changeAttrbute(userId, tag, true, 'chat', 'ch');
                            }else{
                                action = 'block';
                                this.control.changeAttrbute(userId, tag, false, 'chat', 'ch');
					        }
                            
                            this.control._chat(userId, action); 
                            
                        } else if (control == 'Aud'){
                            var action;
                            
                            if(tag.getAttribute('data-audio-disable') == 'true'){
                                action = 'enable';
                                this.control.changeAttrbute(userId, tag, true, 'audio', 'aud');

//                                tag.setAttribute('data-audio-disable', 'false');
//                                tag.className = 'enable';
//                                vApp.user.control.updateUser(userId, 'aud', true);
                                
                                
                            }else{
                                action = 'block';
                                this.control.changeAttrbute(userId, tag, false, 'audio', 'aud');
                                
                                
//                                tag.setAttribute('data-audio-disable', 'true');
//                                tag.className = 'block';
//                                vApp.user.control.updateUser(userId, 'aud', false);
                            }
                            
                            
                            
                            this.control._audio(userId, action);
                        }
                    },
                    
                    _assign : function (userId, notsent){
                        vApp.wb.utility.assignRole();
                        vApp.vutil.removeAppPanel();
                        
                        if (!vApp.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                            var canvasWrapper = document.getElementById("vcanvas");
                            canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                            canvasWrapper.className = 'student';
                        }
                        
                        
                        localStorage.setItem('canvasDrwMsg', true);
                        
                        var ssVideo = document.getElementById('vAppScreenShareLocalVideo');
                        if(ssVideo != null && ssVideo.tagName == "VIDEO"){
                            vApp.vutil.videoTeacher2Student('ScreenShare', true);
                        }


                        var wssVideo = document.getElementById('vAppWholeScreenShareLocalVideo');
                        if(wssVideo != null && wssVideo.tagName == "VIDEO"){
                            vApp.vutil.videoTeacher2Student('WholeScreenShare', true);
                        }

                        
//                        if(vApp.hasOwnProperty('prevScreen')){
//                            
//                            //alert(vApp.prevScreen.id);
//                            //vApp.vutil.videoTeacher2Student(vApp.prevScreen.id + "LocalVideo", vApp.currApp);
//                            
//                            var ssVideo = document.getElementById('vAppScreenShareLocalVideo');
//                            if(ssVideo != null && ssVideo.tagName){
//                                vApp.vutil.videoTeacher2Student('ScreenShare', true);
//                            }
//                            
//                            
//                            var wssVideo = document.getElementById('vAppWholeScreenShareLocalVideo');
//                            if(wssVideo != null && wssVideo.tagName){
//                                vApp.vutil.videoTeacher2Student('WholeScreenShare', true);
//                            }
// 
//                            
//                            
//                            
//                            if(vApp.currApp == 'WholeScreenShare'){
//                               //vApp.vutil.videoTeacher2Student("vAppScreenShareLocalVideo", "ScreenShare");
//                               vApp.vutil.videoTeacher2Student("ScreenShare", true);
//                            }else{
//                                vApp.vutil.videoTeacher2Student("WholeScreenShare", true);
//                            }
//                            
//                            
//                        } else{
//                            
//                            if(typeof vApp.ss == 'object' || typeof vApp.wss == 'object'){
//                                 //vApp.vutil.videoTeacher2Student("vApp" + vApp.currApp+"LocalVideo", vApp.currApp);
//                                vApp.vutil.videoTeacher2Student(vApp.currApp);
//
//                                if(vApp.currApp == 'WholeScreenShare'){
//                                   vApp.vutil.videoTeacher2Student("ScreenShare", true);
//                                }else{
//                                    vApp.vutil.videoTeacher2Student("WholeScreenShare", true);
//                                }
//                            }
//                           
//                        }
                        
                        var app;
                        if(vApp.currApp == "ScreenShare"){
                            app = 'ss';
                        }else if(vApp.currApp == "WholeScreenShare"){
                            app = 'wss';
                        }
                        
                        if(vApp.currApp != "Whiteboard"){
                            if(vApp[app].hasOwnProperty('currentStream')){
                                vApp[app].currentStream.stop(); 
                            }
                            vApp[app] = "";    
                        }
                        
                        if(typeof notsent == 'undefined'){
                            vApp.wb.utility.beforeSend({'assignRole' : true, toUser : userId});
                        }
                        
                        if(localStorage.getItem('orginalTeacherId') == null){
                            var controlContainer = document.getElementById('chat_div').getElementsByClassName('controls')[0];
                            controlContainer.parentNode.removeChild(controlContainer);
                        }
                        //alert(vApp.gObj.uRole);
                    },
                    
                    _chat : function (userId, action){
                        if(action == 'enable'){
                            //var user =  vApp.user.control.updateUser(userId, 'ch', true);
                            vApp.wb.utility.beforeSend({'enc' : true, toUser : userId});
                            
                            
                        }else{
                            var user =  vApp.user.control.updateUser(userId, 'ch', false);
                            vApp.wb.utility.beforeSend({'dic' : true, toUser : userId});
                        }
                    },
                    
                    _audio : function (userId, action){
                        if(action == 'enable'){
                            vApp.wb.utility.beforeSend({'ena' : true, toUser : userId});
                        }else{
                            vApp.wb.utility.beforeSend({'dia' : true, toUser : userId});
                        }
                    },
                    
                    audioWidgetEnable : function (){
                        localStorage.setItem('audEnable', "true");
                        var studentSpeaker = document.getElementById('audioWidget');
                        studentSpeaker.className = 'active';
                        studentSpeaker.style.opacity = "1";
                        studentSpeaker.style.pointerEvents = "visible";
                    },
                    
                    audioWidgetDisable : function (){
                        localStorage.setItem('audEnable', "false");
                        var studentSpeaker = document.getElementById('audioWidget');
                        studentSpeaker.style.opacity = "0.5";
                        studentSpeaker.style.pointerEvents = "none";
                        studentSpeaker.className = 'deactive';
                        vApp.gObj.video.audio.studentNotSpeak();
                        
                        vApp.gObj.video.audio.clickOnceSpeaker(document.getElementById('speakerPressOnce'), "alwaysDisable");
                 //       document.getElementById('speakerPressOnce').className = 'deactive';
                    },
                    
                    allChatDisable : function (){
                        localStorage.setItem('chatEnable', "false");
                        this.disableCommonChat();
                        this.disbaleAllChatBox();
                        this.disableOnLineUser();
                    }, 
                    
                    disableCommonChat : function (){
                        var div = document.getElementById("chatrm");
                        if(div != null){
                            this.makeElemDisable(div);
                        }
                    },
                    
                    disbaleAllChatBox : function (){
                        var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                        for(var i=0; i<allChatBoxes.length; i++){
                            this.makeElemDisable(allChatBoxes[i]);
                        }
                    },
                    
                    disableOnLineUser : function (){
                        var allChatDivCont  = document.getElementsByClassName('ui-memblist-usr');  
                        for(var i=0; i<allChatDivCont.length; i++){
                            allChatDivCont[i].style.pointerEvents = "none";
                        }
                    },
                    
                    makeElemDisable : function (elem){
               //         localStorage.setItem('chatEnable', "true");
                        elem.style.opacity = "0.4";
                        var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                        if(inputBox != null){
                            inputBox.disabled = true;
                        }
                    },
                    
                    allChatEnable : function (){
                        localStorage.setItem('chatEnable', "true");
                        //common chat
                        var div = document.getElementById("chatrm");
                        if(div != null){
                            this.makeElemEnable(div);
                        }
                        
                        var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                        for(var i=0; i<allChatBoxes.length; i++){
                            this.makeElemEnable(allChatBoxes[i]);
                        }
                        
                        var allChatDivCont  = document.getElementsByClassName('ui-memblist-usr');  
                        for(var i=0; i<allChatDivCont.length; i++){
                            allChatDivCont[i].style.pointerEvents = "visible";
                        }
                    }, 
                    
                    makeElemEnable : function (elem){
                        elem.style.opacity = "1";
                        var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                        if(inputBox != null){
                            inputBox.disabled = false;
                        }
                    },
                    
                    updateUser : function (uid, key, val){
                        var userId =  localStorage.getItem(uid);   
                        var uObj = {};
                        if(userId == null){
                            userId = uid;
                            uObj.id = userId;
                        }else {
                            uObj = JSON.parse(userId);
                        }
                        uObj[key] = val;
                        
                        localStorage[uObj.id] = JSON.stringify(uObj);
                        return uObj;
                    },
                    
                    audioSign : function (user, action){
                        if(action == 'create'){
                            if(document.getElementById(user.id + "AudEnableSign") == null){
                                var audEnableSign = document.createElement('div');
                                audEnableSign.id = user.id + "AudEnableSign";
                                audEnableSign.className = "audEnableSign";
                                document.getElementById(user.id + "ControlContainer").appendChild(audEnableSign);
                            }
                            
                        }else {
                            var audioSign =  document.getElementById(user.id + "AudEnableSign");
                            audioSign.parentNode.removeChild(audioSign);
                        }
                    },
                    
                    
                    shouldApply : function (uid){
                        var userObj = localStorage.getItem(uid);
                        if(userObj != null){
                           userObj = JSON.parse(userObj);
                           if(userObj.ad){
                               vApp.user.control.audioSign({id:uid}, "create");
                           }
                           
                         //  var elem = document.getElementById(userObj.id + 'contrChatImg');
                           
//                           if(userObj.hasOwnProperty('ch')){
//                               if(userObj.ch){
//                               //vApp.user.control.audioSign(elem, "create");
//                                    this.control.changeAttrbute(userObj.id, elem, false);
//                                }else{
//                                    this.control.changeAttrbute(userObj.id, elem, true);
//                                }
//                           }
                        }
                    },
                    
                    addClassToAssign : function(action){
                        var allUserElem = document.getElementsByClassName("assignImg");
                        for(var i=0; i<allUserElem.length; i++){
                            allUserElem[i].className = "assignImg " + action;
                            
                            if(action == 'enable'){
                                 allUserElem[i].setAttribute('data-assign-disable', 'false');
                            }else{
                                  allUserElem[i].setAttribute('data-assign-disable', 'true');
                            }
                             
                        }
                    }
                },
                
                
                displayStudentSpeaker : function(display){
                    var speakerStudent = document.getElementById('speakerStudent');
                    if(speakerStudent != null){
                        if(display){
                            speakerStudent.style.display = 'block';
                        }else {
                            speakerStudent.style.display = 'none';
                        }
                        
                        //speakerStudent.parentNode.removeChild(speakerStudent);
                    }
                }
                
                
            }
        };
    window.user = user;
})(window, document);
