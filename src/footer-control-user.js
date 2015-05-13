// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var user = function (config) {
        return {
            //TODO function name should be change
            assignRole: function (role, app) {
                if (role == 't') {
                    virtualclass.html.optionsWithWrapper();
                    virtualclass.attachFunction();

                    var virtualclassOptionsContWidth = document.getElementById("virtualclassOptionsCont").offsetWidth;
                    window.virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);

                    if (virtualclass.gObj.uRole == 't') {
//                            if(app == 'Whiteboard') {
                        if (virtualclass.hasOwnProperty('previrtualclass')) {
                            virtualclass.vutil.makeActiveApp("virtualclass" + app, virtualclass.previrtualclass);
                        } else {
                            virtualclass.vutil.makeActiveApp("virtualclass" + app);
                        }
                        virtualclass.wb.utility.makeCanvasEnable();
//                            }
                    }
                }
            },

            teacherIsAlreadyExist: function () {
                var allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');
                var role;
                for (var i = 0; i < allExistedUser.length; i++) {
                    role = allExistedUser[i].getAttribute('data-role');
                    if (role == 't') {
                        return true;
                    }
                }
                return false;
            },

            createControl: function (userId, controls) {
                var controlCont = document.createElement('div');
                controlCont.id = userId + "ControlContainer";
                controlCont.className = "controls";
                this.createControlDivs(controlCont, userId, controls);
                return controlCont;
            },

            createAssignControl: function (controlCont, userId, aRoleEnable, currTeacher) {
                var that = this;
                var assignImg = document.createElement('span');
                var imgName = "contrAssign";
                assignImg.id = userId + imgName + "Img";

                //  assignImg.src = window.whiteboardPath + "images/" + imgName + ".png";
//                    assignImg.innerHTML = "&nbsp;";

                var assignAnch = document.createElement('a');
                assignAnch.id = userId + imgName + "Anch";
                assignAnch.className = "tooltip";
                // assignAnch.setAttribute('data-title', "Assign Role");
                assignAnch.appendChild(assignImg);
                var imgCont = document.createElement('div');
                imgCont.id = userId + imgName + "Cont";
                imgCont.className = "controleCont";
                imgCont.appendChild(assignAnch);

                var controllerDiv = document.getElementById(userId + 'ControlContainer');

                if (controllerDiv != null) {
                    var controllers = controllerDiv.getElementsByClassName('controleCont');
                    if (controllers.length <= 0) {
                        controllerDiv.appendChild(imgCont);
                    } else {
                        controllerDiv.insertBefore(imgCont, controllerDiv.firstChild);
                    }
                } else {
                    controlCont.appendChild(imgCont);
                }

//                    alert(userId);
//                    debugger;
                //assignImg.className = 'contrAssign';
                virtualclass.user.control.changeAttribute(userId, assignImg, aRoleEnable, 'assign', 'aRole');

                if (typeof currTeacher != 'undefined') {
                    assignImg.className = assignImg.className + ' currTeacher';
                }
                assignImg.addEventListener('click', function () {
                    that.control.init.call(that, assignImg);
                });

            },

            // TODO this function should be normalize with other
            createControlDivs: function (controlCont, userId, controls) {
                var that = this;
                //var userObj = localStorage.getItem(userId);
                var uObj = false;
                var userObj = localStorage.getItem('virtualclass' + userId);
                if (userObj != null) {
                    uObj = true;
                    userObj = JSON.parse(userObj);
                    if (userObj.hasOwnProperty('currTeacher')) {
                        virtualclass.gObj[userId + 'currTeacher'] = {};
                        if (userObj.currTeacher == true) {
                            virtualclass.user.control.currTeacherAlready = true;
                            var currTeacher = true;
                            virtualclass.gObj[userId + 'currTeacher'].ct = true;
                        } else {
                            virtualclass.gObj[userId + 'currTeacher'].ct = false;
                        }
                    }
                }


                var assignDisable = localStorage.getItem('reclaim');
                if (assignDisable != null && assignDisable) {
                    var aRoleEnable = false;
                } else {
                    var aRoleEnable = true;
                }

                var orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
                var isUserTeacher = virtualclass.vutil.isUserTeacher(userId);
                //var this should be in normalize in function
                for (var i = 0; i < controls.length; i++) {
                    if (controls[i] == 'assign' && orginalTeacher) {
                        if (typeof currTeacher != 'undefined') {
                            this.createAssignControl(controlCont, userId, aRoleEnable, currTeacher);
                        } else {
                            this.createAssignControl(controlCont, userId, aRoleEnable);
                        }


//                            var assignImg = document.createElement('img');
//                            var assignImg = document.createElement('span'); 
//                            var imgName = "contrAssign";
//                            assignImg.id = userId + imgName + "Img";
//                          //  assignImg.src = window.whiteboardPath + "images/" + imgName + ".png";
//                            assignImg.innerHTML = "&nbsp;";
//                            
//                            var assignAnch = document.createElement('a');
//                            assignAnch.id = userId + imgName + "Anch";
//                            assignAnch.className = "tooltip";
//                           // assignAnch.setAttribute('data-title', "Assign Role");
//                            assignAnch.appendChild(assignImg);
//                            var imgCont = document.createElement('div');
//                            imgCont.id = userId + imgName + "Cont";
//                            imgCont.className = "controleCont";
//                            imgCont.appendChild(assignAnch);
//                            
//                            var controllerDiv = document.getElementById(userId+'ControlContainer');
//                            
//                            if(controllerDiv != null){
//                                var controllers = controllerDiv.getElementsByClassName('controleCont');
//                                    
//                                if(controllers.length <= 0){
//                                    controllerDiv.appendChild(imgCont);
//                                }else{
//                                    controllerDiv.insertBefore(imgCont, controllerDiv.firstChild);
//                                }
//                            }else{
//                                controlCont.appendChild(imgCont);
//                            }


                        //assignImg.className = 'contrAssign';
//                            virtualclass.user.control.changeAttribute(userId, assignImg, aRoleEnable, 'assign', 'aRole');
//                            
////                            if(orginalTeacher){
//                                assignImg.addEventListener('click', function (){ that.control.init.call(that, assignImg);});
//                            }


                    } else if (controls[i] == 'audio') {
                        var audBlock = document.createElement('span');
//                            var audBlock = document.createElement('img');
                        imgName = "contrAud";
                        audBlock.id = userId + imgName + "Img";
//                            audBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
//                            audBlock.innerHTML = "&nbsp;";
                        var audAnch = document.createElement('a');
                        audAnch.id = userId + imgName + "Anch";
                        audAnch.className = "tooltip";
                        audAnch.appendChild(audBlock);
                        var imgCont = document.createElement('div');
                        imgCont.id = userId + imgName + "Cont";
                        imgCont.className = "controleCont";
                        imgCont.appendChild(audAnch);
                        controlCont.appendChild(imgCont);

                        if (uObj && userObj.hasOwnProperty('aud')) {
                            var audEnable = (userObj.aud) ? true : false;
                        } else {
                            var audEnable = true;
                        }
                        virtualclass.user.control.changeAttribute(userId, audBlock, audEnable, 'audio', 'aud');

                        if (orginalTeacher) {
                            audBlock.addEventListener('click', function () {
                                that.control.init.call(that, audBlock);
                            });
                        }

                    } else if (controls[i] == 'chat') {
//                            var chatBlock = document.createElement('img');
                        var chatBlock = document.createElement('span');
                        imgName = "contrChat";
                        chatBlock.id = userId + imgName + "Img";
//                            chatBlock.innerHTML = "&nbsp;";
//                            chatBlock.src = window.whiteboardPath + "images/" + imgName + ".png";
//                            chatBlock.innerHTML = "S";
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

                        if (orginalTeacher) {
                            chatBlock.addEventListener('click', function () {
                                that.control.init.call(that, chatBlock);
                            });
                        }

                        if (uObj && userObj.hasOwnProperty('ch')) {
                            var chEnable = (userObj.ch) ? true : false;
                        } else {
                            var chEnable = true;
                        }

                        virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'ch');
                    }
                }
            },
            control: {
                addCurrTeacherToControl: function (id) {

                    var elem = document.getElementById(id);
                    if (elem != null) {
                        if (virtualclass.vutil.elemHasAnyClass(id)) {
                            elem.classList.add('currTeacher');
                        } else {
                            elem.className = 'currTeacher';
                        }
                    }
                },

                removeCurrTeacherFromControl: function (id) {

                    var elem = document.getElementById(id);
                    if (virtualclass.vutil.elemHasAnyClass(id)) {
                        elem.classList.remove('currTeacher');
                        var uidPos = id.indexOf("contr");
                        var userId = id.substring(0, uidPos);
                        virtualclass.user.control.updateUser(userId, 'currTeacher', false);
                    }
                },

                removeAudioFromParticipate: function (id) {
                    var tobeDeleted = document.getElementById(id + 'contrAssignCont');
                    if (tobeDeleted != null) {
                        tobeDeleted.parentNode.removeChild(tobeDeleted);
                    }
                },

                disable: function (toUser, control, contIdPart, label) {
                    var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
                    virtualclass.user.control._disable(elem, control, toUser, label);
                },

                _disable: function (elem, control, userId, label) {
//                        if(control == 'assign'){
//                           elem.parentNode.classList.remove('tooltip');
//                           this.addCurrTeacherToControl(elem.id);
//                            //alert(userId + ' ' +elem.id);
//                        }

//                        alert('suman bogati');
//                        debugger;

                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
                    elem.setAttribute('data-' + control + '-disable', 'true');

                    if (control == 'audio') {
//                            elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
                        elem.className = "icon-" + control + "DisImg block" + ' ' + control + 'DisImg';
                    } else {
                        elem.className = "icon-" + control + "Img block" + ' ' + control + 'Img';
                    }

                    if (control == 'assign') {
                        elem.parentNode.classList.remove('tooltip');
                        this.addCurrTeacherToControl(elem.id);
                        var userObj = localStorage.getItem('virtualclass' + userId);
                        userObj = JSON.parse(userObj);


//                            if(!virtualclass.user.control.hasOwnProperty('currTeacherAlready') ){
//                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
//                            }
                        if (virtualclass.gObj.hasOwnProperty(userId + 'currTeacher')) {
                            if (virtualclass.gObj[userId + 'currTeacher'].ct || (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssign && userObj.currTeacher)) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }
                        } else {

                            if (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssignId == userId) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }

                        }


//                            if(!userObj.hasOwnProperty('currTeacher')){
//                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
//                            }else {
//                                if(userObj.currTeacher){
//                                    virtualclass.user.control.updateUser(userId, 'currTeacher', true);
//                                }
//                            }

                        //alert(userId + ' ' +elem.id);
                    }

                    virtualclass.user.control.updateUser(userId, label, false);

                },

                enable: function (toUser, control, contIdPart, label) {
                    var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
                    virtualclass.user.control._enable(elem, control, toUser, label);
                },
                _enable: function (elem, control, userId, label) {
                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Enable"));
                    if (control == 'audio') {
                        elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
                    }
                    elem.setAttribute('data-' + control + '-disable', "false");
                    elem.className = "icon-" + control + "Img enable" + ' ' + control + 'Img';


                    virtualclass.user.control.updateUser(userId, label, true);
                },

                changeAttribute: function (userId, elem, elemEnable, control, label) {
//                        alert(control + ' ' + label)
                    if (elemEnable) {
                        virtualclass.user.control._enable(elem, control, userId, label);

//                            elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
//                            elem.setAttribute('data-' + control + '-disable', "false");
//                            elem.className = "icon-"+control + "Img enable" + ' '+ control + 'Img';
//                            virtualclass.user.control.updateUser(userId, label, true);

                    } else {
//                            alert(elem.id + ' ' + label);
                        virtualclass.user.control._disable(elem, control, userId, label);


//                            if(control == 'assign'){
//                                elem.parentNode.classList.remove('tooltip');
//                            }
//                            
//                            elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Enable"));
//                            elem.setAttribute('data-' + control + '-disable', 'true');
//                            
//                            if(control == 'audio'){
//                                elem.className =  "icon-"+control + "DisImg block" + ' '+ control + 'DisImg' ;
//                            }else{ 
//                                elem.className =  "icon-"+control + "Img block"+ ' '+ control + 'Img';
//                            }
//                            virtualclass.user.control.updateUser(userId, label, false);
                    }
                },
                init: function (tag) {
                    var compId = tag.id;
                    var ep = compId.indexOf("contr");
                    var userId = compId.substring(0, ep);
                    var restString = compId.split('contr')[1];
                    var imgPos = restString.indexOf("Img");
                    var control = restString.substring(0, imgPos);
                    if (control == 'Assign') {
                        virtualclass.gObj.controlAssign = true;
                        virtualclass.gObj.controlAssignId = userId;
                        var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                        if (!assignDisable) {
                            this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                            virtualclass.user.control._assign(userId);
                            virtualclass.user.control.changeAttrToAssign('block');
                        }

                        if (localStorage.getItem('orginalTeacherId') == null) {
                            virtualclass.user.control.removeAudioFromParticipate(userId);
                        }
                    } else if (control == 'Chat') {
                        var action;
                        if (tag.getAttribute('data-chat-disable') == 'true') {
                            tag.className = 'contrChatBlock';
                            action = 'enable';
                            this.control.changeAttribute(userId, tag, true, 'chat', 'ch');
                        } else {
                            action = 'block';
                            this.control.changeAttribute(userId, tag, false, 'chat', 'ch');
                        }
                        this.control._chat(userId, action);
                    } else if (control == 'Aud') {
                        var action;
                        if (tag.getAttribute('data-audio-disable') == 'true') {
                            action = 'enable';
                            this.control.changeAttribute(userId, tag, true, 'audio', 'aud');
                        } else {
                            action = 'block';
                            this.control.changeAttribute(userId, tag, false, 'audio', 'aud');
                        }
                        this.control._audio(userId, action);
                    }
                },

                _assign: function (userId, notsent, fromUserId) {

                    virtualclass.wb.utility.assignRole();
                    virtualclass.vutil.removeAppPanel();
                    if (!virtualclass.vutil.chkValueInLocalStorage('orginalTeacherId')) {
                        var canvasWrapper = document.getElementById("vcanvas");
                        canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                        canvasWrapper.className = 'student';
                    }
                    localStorage.setItem('canvasDrwMsg', true);
                    var ssVideo = document.getElementById('virtualclassScreenShareLocalVideo');
                    if (ssVideo != null && ssVideo.tagName == "VIDEO") {
                        virtualclass.vutil.videoTeacher2Student('ScreenShare', true);
                    }

//                        var wssVideo = document.getElementById('virtualclassWholeScreenShareLocalVideo');
//                        if(wssVideo != null && wssVideo.tagName == "VIDEO"){
//                            virtualclass.vutil.videoTeacher2Student('WholeScreenShare', true);
//                        }

                    var app;
                    if (virtualclass.currApp == "ScreenShare") {
                        app = 'ss';

                        if (virtualclass[app].hasOwnProperty('currentStream')) {
                            virtualclass[app].currentStream.stop();
                        }
                        virtualclass[app] = "";

                    }
//                        else if(virtualclass.currApp == "WholeScreenShare"){
//                            app = 'wss';
//                        }
//                        if(virtualclass.currApp != "Whiteboard"){
//                            if(virtualclass[app].hasOwnProperty('currentStream')){
//                                virtualclass[app].currentStream.stop();
//                            }
//                            virtualclass[app] = "";
//                        }

                    if (typeof notsent == 'undefined') {
                        virtualclass.wb.utility.beforeSend({'assignRole': true, toUser: userId});
                    }
                    if (localStorage.getItem('orginalTeacherId') == null) {
                        if (typeof fromUserId == 'undefined') {
                            fromUserId = userId;
                        }
                        var controlContainer = document.getElementById(fromUserId + 'ControlContainer').getElementsByClassName('controleCont')[0];
                        controlContainer.removeChild(controlContainer.firstChild);

                        //controlContainer.parentNode.removeChild(controlContainer);
                    }
                },
                _chat: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.wb.utility.beforeSend({'enc': true, toUser: userId});
                    } else {
                        var user = virtualclass.user.control.updateUser(userId, 'ch', false);
                        virtualclass.wb.utility.beforeSend({'dic': true, toUser: userId});
                    }
                },
                _audio: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.wb.utility.beforeSend({'ena': true, toUser: userId});
                    } else {
                        virtualclass.wb.utility.beforeSend({'dia': true, toUser: userId});
                    }
                },
                audioWidgetEnable: function () {
                    localStorage.setItem('audEnable', "true");
                    var studentSpeaker = document.getElementById('audioWidget');
                    studentSpeaker.className = 'active';
                    studentSpeaker.style.opacity = "1";
                    studentSpeaker.style.pointerEvents = "visible";
                },
                //move into media.js
                audioWidgetDisable: function () {
                    localStorage.setItem('audEnable', "false");
                    var studentSpeaker = document.getElementById('audioWidget');
                    studentSpeaker.style.opacity = "0.5";
                    studentSpeaker.style.pointerEvents = "none";
                    studentSpeaker.className = 'deactive';
                    var alwaysPressElem = document.getElementById('speakerPressing');
                    if (virtualclass.gObj.hasOwnProperty('video')) {
                        virtualclass.gObj.video.audio.studentNotSpeak(alwaysPressElem);
                        virtualclass.gObj.video.audio.clickOnceSpeaker('speakerPressOnce', "alwaysDisable");
                    }


                },
                allChatDisable: function () {
                    localStorage.setItem('chatEnable', "false");
                    this.disableCommonChat();
                    this.disbaleAllChatBox();
                    this.disableOnLineUser();
                },
                disableCommonChat: function () {
                    var div = document.getElementById("chatrm");
                    if (div != null) {
                        this.makeElemDisable(div);
                    }
                },
                disbaleAllChatBox: function () {
                    var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                    for (var i = 0; i < allChatBoxes.length; i++) {
                        this.makeElemDisable(allChatBoxes[i]);
                    }
                },
                disableOnLineUser: function () {
                    var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
                    for (var i = 0; i < allChatDivCont.length; i++) {
                        allChatDivCont[i].style.pointerEvents = "none";
                    }
                },
                makeElemDisable: function (elem) {

//                        if(elem.hasOwnProperty('classList')){
                    if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
                        elem.classList.remove('enable');
                        elem.classList.add('disable');
                    } else {
                        elem.className = "disable";
                    }
                    var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                    if (inputBox != null) {
                        inputBox.disabled = true;
                    }
                },
                allChatEnable: function () {
                    localStorage.setItem('chatEnable', "true");
                    //common chat
                    var div = document.getElementById("chatrm");
                    if (div != null) {
                        this.makeElemEnable(div);
                    }
                    var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
                    for (var i = 0; i < allChatBoxes.length; i++) {
                        this.makeElemEnable(allChatBoxes[i]);
                    }
                    var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
                    for (var i = 0; i < allChatDivCont.length; i++) {
                        allChatDivCont[i].style.pointerEvents = "visible";
                    }
                },
                makeElemEnable: function (elem) {
//                        if(elem.hasOwnProperty('classList')){
                    if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
                        elem.classList.remove('disable');
                        elem.classList.add('enable');
                    } else {
                        elem.className = "enable";
                    }
                    //elem.style.opacity = "1";
                    var inputBox = elem.getElementsByClassName("ui-chatbox-input-box")[0];
                    if (inputBox != null) {
                        inputBox.disabled = false;
                    }
                },
                updateUser: function (uid, key, val) {
                    //var userId =  localStorage.getItem(uid);
                    var userId = localStorage.getItem('virtualclass' + uid);
                    var uObj = {};
                    if (userId == null) {
                        //userId = uid;
                        uObj.id = uid;
                    } else {
                        uObj = JSON.parse(userId);
                    }
                    uObj[key] = val;
                    localStorage['virtualclass' + uObj.id] = JSON.stringify(uObj);
                    return uObj;
                },
                audioSign2: function (user, action) {
                    if (action == 'create') {
                        if (document.getElementById(user.id + "AudEnableSign") == null) {
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
                    } else {
                        var audioEnableTag = document.getElementById(user.id + "AudEnableSign");
                        audioEnableTag.parentNode.removeChild(audioEnableTag);
                    }


                },

                audioSign: function (user, action) {
                    if (action == 'create') {
//                            alert('hello brother');
//                            debugger;
//                            123contrAudImg
                        // this.changeAttrToAssign();
                        this.iconAttrManupulate(user.id, "icon-audioEnaGreen");


//                                for(var i=0; i<audioImg.classList.length; i++){
//                                    if(audioImg.classList[i].substring(0, 5) ==  'icon-'){
//                                       audioImg.classList.remove(audioImg.classList[i]);
//                                       audioImg.classList.add("icon-audioEnaGreen") ;
//                                       break;  
//                                    }
//                                }

                    } else {
                        if (user.aud) {
                            this.iconAttrManupulate(user.id, "icon-audioImg");
                        } else {
                            this.iconAttrManupulate(user.id, "icon-audioDisImg");
                        }


//                            var audioEnableTag = document.getElementById(user.id + "AudEnableSign");
//                            audioEnableTag.parentNode.removeChild(audioEnableTag);
                    }
                },

                iconAttrManupulate: function (uid, classToBeAdd) {
                    var audioImg = document.getElementById(uid + 'contrAudImg');
                    if (audioImg != null) {
                        for (var i = 0; i < audioImg.classList.length; i++) {
                            if (audioImg.classList[i].substring(0, 5) == 'icon-') {
                                audioImg.classList.remove(audioImg.classList[i]);
                                audioImg.classList.add(classToBeAdd);
                                break;
                            }
                        }
                    }
                },

                shouldApply: function (uid) {
                    var userObj = localStorage.getItem('virtualclass' + uid);
                    if (userObj != null) {
                        userObj = JSON.parse(userObj);
                        console.log('uid ' + uid + " " + userObj.ad);
                        if (userObj.ad) {
                            virtualclass.user.control.audioSign({id: uid}, "create");
                        }
                    }
                },


                changeAttrToAssign: function (action) {
                    var allUserElem = document.getElementById('chatWidget').getElementsByClassName("assignImg");
                    for (var i = 0; i < allUserElem.length; i++) {
                        if (action == 'enable') {
                            allUserElem[i].classList.remove('block');
                            allUserElem[i].classList.add('enable');
                            allUserElem[i].parentNode.classList.add('tooltip');
                            allUserElem[i].parentNode.setAttribute('data-title', virtualclass.lang.getString('assignEnable'));
                            allUserElem[i].setAttribute('data-assign-disable', 'false');
                        } else {
                            allUserElem[i].classList.remove('enable');
//                                allUserElem[i].parentNode.setAttribute('data-title', virtualclass.lang.getString('assignDisable'));
                            allUserElem[i].classList.add('block');
                            allUserElem[i].parentNode.classList.remove('tooltip');
                            allUserElem[i].setAttribute('data-assign-disable', 'true');
                        }
                    }
                }
            },
            displayStudentSpeaker: function (display) {
                var alwaysPress = document.getElementById('alwaysPress');
                if (alwaysPress != null) {
                    if (display) {
                        alwaysPress.style.display = 'block';
                    } else {
                        alwaysPress.style.display = 'none';
                    }
                }
            }
        }
    };
    window.user = user;
})(window, document);