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
                
                // important
                // TODO this function should be normalize
                createControlDivs : function (controlCont, userId, controls){
                    var that  = this;
                    for(var i=0; i<controls.length; i++){
                        if(controls[i] == 'assign'){
                            var assignImg = document.createElement('img');
                            var imgName = "contrAssign";
                            assignImg.id = userId + imgName + "Img";
                            assignImg.src = window.whiteboardPath +  "images/" + imgName + ".png";
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(assignImg);        
                            controlCont.appendChild(imgCont);
                            
                            //assignImg.addEventListener('click', vApp.user.control.init);
                            assignImg.className = 'contrAssign';
                            assignImg.addEventListener('click', function (){ that.control.init.call(that, assignImg);});

                        } else if(controls[i] == 'audio'){
                            var audBlock = document.createElement('img');
                            imgName = "contrAud";
                            audBlock.id = userId + imgName + "Img";
                            audBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(audBlock);        
                            controlCont.appendChild(imgCont);
                            
                          //  audBlock.addEventListener('click', vApp.user.control.init);
                            audBlock.className = 'contrAudBlock';
                            audBlock.setAttribute('data-audio-disable', "false");
                            audBlock.className = 'enable';
                            
                            audBlock.addEventListener('click', function (){ that.control.init.call(that, audBlock);});
                        }else if (controls[i] == 'chat'){
                            var chatBlock = document.createElement('img');
                            imgName = "contrChat";
                            chatBlock.id = userId + imgName + "Img";
                            chatBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(chatBlock);        
                            controlCont.appendChild(imgCont);
                            
                            //  var that = this;
                            //chatBlock.addEventListener('click', function (){ that.control.init.call(that, chatBlock);});
                            //that.control.changAttrbute(chatBlock.id, true);
                            chatBlock.addEventListener('click', function (){ that.control.init.call(that, chatBlock);});
                            
                            var userObj = localStorage.getItem(userId);
                             
                            if(userObj != null){
                                userObj = JSON.parse(userObj);
                                if(userObj.hasOwnProperty('ch')){
                                  if(userObj.ch){
                                       vApp.user.control.changeAttrbute(userObj.id, chatBlock, true);
                                   }else{
                                       vApp.user.control.changeAttrbute(userObj.id, chatBlock, false);
                                   }
                                }
                            }else {
                                vApp.user.control.changeAttrbute(userId, chatBlock, true);  // third param true means chat enable
                            }
                        }
                    }
                },
                control : {
                    changeAttrbute : function (userId, elem, chEnable){
                        var chatBlock = elem;
                        if(chEnable){
                            chatBlock.className = 'contrChatBlock';  
                            chatBlock.setAttribute('data-chat-disable', "false");
                            chatBlock.className = 'enable';
                            var user =  vApp.user.control.updateUser(userId, 'ch', true);
                        }else{
                            chatBlock.setAttribute('data-chat-disable', 'true');
                            chatBlock.className = 'block';
//                            action = 'block';
                            var user =  vApp.user.control.updateUser(userId, 'ch', false);
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
                           vApp.user.control._assign(userId);
                        }else if (control == 'Chat'){
                            var action;
                            if(tag.getAttribute('data-chat-disable') == 'false'){
                                this.control.changeAttrbute(userId, tag, false);
								action = 'block';
                            }else{
								action = 'enable';
								this.control.changeAttrbute(userId, tag, true);  
                            }
                            
                            this.control._chat(userId, action); 
                        } else if (control == 'Aud'){
                            
                            if(tag.getAttribute('data-audio-disable') == 'false'){
                                tag.setAttribute('data-audio-disable', 'true');
                                tag.className = 'block';
                                action = 'block';
                            }else{
                                tag.setAttribute('data-audio-disable', 'false');
                                tag.className = 'enable';
                                action = 'enable';
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
                        
                        if(vApp.hasOwnProperty('prevScreen')){
                            //alert(vApp.prevScreen.id);
                            vApp.vutil.videoTeacher2Student(vApp.prevScreen.id + "LocalVideo");
                        }else{
                            vApp.vutil.videoTeacher2Student("vApp" + vApp.currApp+"LocalVideo");
                        }
                        
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
                    
                    audioEnable : function (){
                        localStorage.setItem('audEnable', "true");
                        var studentSpeaker = document.getElementById('speakerStudent');
                        studentSpeaker.className = 'active';
                        studentSpeaker.style.opacity = "1";
                        studentSpeaker.style.pointerEvents = "visible";
                    },
                    
                    audioDisable : function (){
                        localStorage.setItem('audEnable', "false");
                        var studentSpeaker = document.getElementById('speakerStudent');
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
                    }
                }
            }
        };
    window.user = user;
})(window, document);
