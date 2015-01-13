// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window, document) {
        var user  = function (config) { 
            return {
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
                // TODO this function should be normalize with other
                createControlDivs : function (controlCont, userId, controls){
                    var that  = this;
                    
                    //var userObj = localStorage.getItem(userId);
                    var uObj = false;
                    var userObj = localStorage.getItem('vApp'+userId);
                    
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
                            
                            var assignAnch = document.createElement('a');
                            assignAnch.id = userId + imgName + "Anch";
                            assignAnch.className = "tooltip";
                           // assignAnch.setAttribute('data-title', "Assign Role");
                            
                            assignAnch.appendChild(assignImg);
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(assignAnch);        
                            
                            controlCont.appendChild(imgCont);
                            //assignImg.className = 'contrAssign';
                            vApp.user.control.changeAttribute(userId, assignImg, aRoleEnable, 'assign', 'aRole');
                            assignImg.addEventListener('click', function (){ that.control.init.call(that, assignImg);});
                        
                        } else if(controls[i] == 'audio'){
                            var audBlock = document.createElement('img');
                            imgName = "contrAud";
                            audBlock.id = userId + imgName + "Img";
                            audBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                            
                            
                            var audAnch = document.createElement('a');
                            audAnch.id = userId + imgName + "Anch";
                            audAnch.className = "tooltip";
                            
                         //   audAnch.setAttribute('data-title', "Block Audio");
                            audAnch.appendChild(audBlock);
              
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(audAnch);      
                            
                            controlCont.appendChild(imgCont);
                            
                            if(uObj && userObj.hasOwnProperty('aud')){
                                var audEnable = (userObj.aud) ? true : false;
                            } else {
                                var audEnable = true;
                            }
                            vApp.user.control.changeAttribute(userId, audBlock, audEnable, 'audio', 'aud');

                            
                            audBlock.addEventListener('click', function (){ that.control.init.call(that, audBlock);});
                            
                        }else if (controls[i] == 'chat'){
                            var chatBlock = document.createElement('img');
                            imgName = "contrChat";
                            chatBlock.id = userId + imgName + "Img";
                            chatBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
                          
                            var chatAnch = document.createElement('a');
                            chatAnch.id = userId + imgName + "Anch";
                            chatAnch.className = "tooltip";
                       //     chatAnch.setAttribute('data-title', "Block Chat");
                            chatAnch.appendChild(chatBlock);
                            
                            
                            var imgCont = document.createElement('div');
                            imgCont.id = userId + imgName + "Cont";
                            imgCont.className = "controleCont";
                            imgCont.appendChild(chatAnch);        
                            controlCont.appendChild(imgCont);
                            
                            chatBlock.addEventListener('click', function (){ that.control.init.call(that, chatBlock);});
                            
                            if(uObj && userObj.hasOwnProperty('ch')){
                                var chEnable = (userObj.ch) ? true : false;
                            } else {
                                var chEnable = true;
                            }
                            vApp.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'ch');
                        }
                    }
                },
                control : {
                    changeAttribute : function (userId, elem, elemEnable, control, label){
                        if(elemEnable){
                            elem.parentNode.setAttribute('data-title', vApp.lang.getString(control + "Disable"));
                            elem.setAttribute('data-'+control+'-disable', "false");
                            
                            elem.className =  control+"Img tooltip enable";
                            vApp.user.control.updateUser(userId, label, true);
                            
                        }else{
                            if(control == 'assign'){
                                elem.parentNode.classList.remove('tooltip');
                            }
                            elem.parentNode.setAttribute('data-title', vApp.lang.getString(control + "Enable"));
                            elem.setAttribute('data-'+control+'-disable', 'true');
                            elem.className = control+"Img tooltip block";
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
                           if(!assignDisable){
                               this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                               vApp.user.control._assign(userId);
                               vApp.user.control.changeAttrToAssign('block');
                           }
                           
                           
                        }else if (control == 'Chat'){
                            var action;
                            if(tag.getAttribute('data-chat-disable') == 'true'){
                                tag.className = 'contrChatBlock';  
                                action = 'enable';
                              	this.control.changeAttribute(userId, tag, true, 'chat', 'ch');
                            }else{
                                action = 'block';
                                this.control.changeAttribute(userId, tag, false, 'chat', 'ch');
					        }
                            
                            this.control._chat(userId, action); 
                            
                        } else if (control == 'Aud'){
                            var action;
                            
                            if(tag.getAttribute('data-audio-disable') == 'true'){
                                action = 'enable';
                                this.control.changeAttribute(userId, tag, true, 'audio', 'aud');
                            }else{
                                action = 'block';
                                this.control.changeAttribute(userId, tag, false, 'audio', 'aud');
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
                            //if(controlContainer != null){
                                controlContainer.parentNode.removeChild(controlContainer);
                            //}
                        }
                    },
                    
                    _chat : function (userId, action){
                        if(action == 'enable'){
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
                    
                    //move into media.js
                    audioWidgetDisable : function (){
                        localStorage.setItem('audEnable', "false");
                        var studentSpeaker = document.getElementById('audioWidget');
                        studentSpeaker.style.opacity = "0.5";
                        studentSpeaker.style.pointerEvents = "none";
                        studentSpeaker.className = 'deactive';
                        vApp.gObj.video.audio.studentNotSpeak();
                        
                        vApp.gObj.video.audio.clickOnceSpeaker('speakerPressOnce', "alwaysDisable");
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
                        //var userId =  localStorage.getItem(uid);   
                        var userId =  localStorage.getItem('vApp' + uid);   
                        var uObj = {};
                        if(userId == null){
                            //userId = uid;
                            uObj.id = uid;
                        }else {
                            uObj = JSON.parse(userId);
                        }
                        uObj[key] = val;
                        
                        localStorage['vApp'+uObj.id] = JSON.stringify(uObj);
                        return uObj;
                    },
                    
                    audioSign : function (user, action){
                        if(action == 'create'){
                            if(document.getElementById(user.id + "AudEnableSign") == null){
                                //important
                                var audEnableSign = document.createElement('div');
                                audEnableSign.id = user.id + "AudEnableSign";
                                var audEnableImg = document.createElement('img');
                                imgName = "audioenable";
                                audEnableImg.id = user.id + imgName + "Img";
                                audEnableImg.src = window.whiteboardPath + "images/" + imgName + ".png";
                                
                                var enAudAnch = document.createElement('a');
                                enAudAnch.id = user.id + imgName + "Anch";
                             
                                enAudAnch.className = "audEnableSign tooltip controleCont";
                                enAudAnch.setAttribute('data-title', "student audio enable");
                                enAudAnch.appendChild(audEnableImg);
                                //audEnableSign.appendChild(audEnableImg);
                                
                                audEnableSign.appendChild(enAudAnch);
                                document.getElementById(user.id + "ControlContainer").appendChild(audEnableSign);
                            }
                        }else {
                            var audioEnableTag =  document.getElementById(user.id + "AudEnableSign");
                            audioEnableTag.parentNode.removeChild(audioEnableTag);
                        }
                    },
                    
                    shouldApply : function (uid){
                        var userObj = localStorage.getItem('vApp'+uid);
                        if(userObj != null){
                           userObj = JSON.parse(userObj);
                           if(userObj.ad){
                               vApp.user.control.audioSign({id:uid}, "create");
                           }
                        }
                    },
                    
                    changeAttrToAssign : function(action){
                        var allUserElem = document.getElementsByClassName("assignImg");
                        
                        for(var i=0; i<allUserElem.length; i++){
                            if(action == 'enable'){
                                allUserElem[i].classList.remove('block');
                                allUserElem[i].classList.add('enable');
                                allUserElem[i].parentNode.classList.add('tooltip');    
                                allUserElem[i].parentNode.setAttribute('data-title', vApp.lang.getString('assignDisable'));
                                allUserElem[i].setAttribute('data-assign-disable', 'false');
                            }else{
                                allUserElem[i].classList.remove('enable');
                                allUserElem[i].classList.add('block');
                                allUserElem[i].parentNode.classList.remove('tooltip')
                                
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
                    }
                }
            }
        };
    window.user = user;
})(window, document);
