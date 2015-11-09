// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
    var user = function (config) {
        return {
            //TODO function name should be change
            assignRole: function (role, app, toUser) {

                if (roles.hasControls()) {
                    if (!roles.isEducator()) {
                        // if role is presentator
                      //  virtualclass.vutil.enablePresentatorEditors(toUser);
                        virtualclass.html.leftAppBar();
                    }
                    virtualclass.attachFunction();

                    if (app == 'Whiteboard') {
                        window.virtualclass.wb.attachToolFunction(vcan.cmdWrapperDiv, true);
                    }

                    // This is already Check at above, no need here
                    //if (roles.hasControls()) {

                    if (virtualclass.hasOwnProperty('previrtualclass')) {
                        virtualclass.vutil.makeActiveApp("virtualclass" + app, virtualclass.previrtualclass);
                    } else {
                        virtualclass.vutil.makeActiveApp("virtualclass" + app);
                    }

                    //if (app == 'Whiteboard') {
                    if(typeof virtualclass.wb == 'object'){
                        virtualclass.wb.utility.makeCanvasEnable();
                    }
                }
            },

            teacherIsAlreadyExist: function () {
                var allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');
                var role;
                for (var i = 0; i < allExistedUser.length; i++) {
                    role = allExistedUser[i].getAttribute('data-role');
                    if (role == 't' || role == 'e') {
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

            createControllerElement: function (userId, imgName) {
                var elemBlock = document.createElement('span');
                elemBlock.id = userId + imgName + "Img";

                var elemAnch = document.createElement('a');
                elemAnch.id = userId + imgName + "Anch";
                elemAnch.className = "tooltip";
                elemAnch.appendChild(elemBlock);

                var imgCont = document.createElement('div');
                imgCont.id = userId + imgName + "Cont";
                imgCont.className = "controleCont";
                imgCont.appendChild(elemAnch);

                return [imgCont, elemBlock];
            },

            createAssignControl: function (controlCont, userId, aRoleEnable, currTeacher) {
                var that = this;

                //TODO var [a, , b] = [1,2,3]; this would be available in ecmascript 6, will have to convert
                var elems = this.createControllerElement(userId, "contrAssign");
                var controller = elems[0];
                var assignBlock = elems[1];

                var controllerDiv = document.getElementById(userId + 'ControlContainer');

                if (controllerDiv != null) {
                    var controllers = controllerDiv.getElementsByClassName('controleCont');
                    if (controllers.length <= 0) {
                        controllerDiv.appendChild(controller);
                    } else {
                        controllerDiv.insertBefore(controller, controllerDiv.firstChild);
                    }
                } else {
                    controlCont.appendChild(controller);
                }

                virtualclass.user.control.changeAttribute(userId, assignBlock, aRoleEnable, 'assign', 'aRole');

                if (typeof currTeacher != 'undefined') {
                    assignBlock.className = assignBlock.className + ' currTeacher';
                }
                assignBlock.addEventListener('click', function () {
                    that.control.init.call(that, assignBlock);
                });

            },


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


                //var assignDisable = localStorage.getItem('reclaim');
                //if (roles.isEducator()) {
                //    var aRoleEnable = false;
                //} else {
                //    var aRoleEnable = true;
                //}

                var aRoleEnable = roles.isEducator() ? false : true;

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

                    } else if (controls[i] == 'audio') {

                        var elems = this.createControllerElement(userId, "contrAud");
                        var controller = elems[0];
                        var audBlock = elems[1];
                        controlCont.appendChild(controller);

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

                        var elems = this.createControllerElement(userId, "contrChat");

                        var controller = elems[0];
                        var chatBlock = elems[1];

                        controlCont.appendChild(controller);

                        if (orginalTeacher) {
                            chatBlock.addEventListener('click', function () {
                                that.control.init.call(that, chatBlock);
                            });
                        }

                        if (uObj && userObj.hasOwnProperty('chat')) {
                            var chEnable = (userObj.chat) ? true : false;
                        } else {
                            var chEnable = true;
                        }
                        virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'chat');

                    } else if (controls[i] == 'editorRich' || (controls[i] == 'editorCode')) {
                        if (roles.hasAdmin()) {
                            if (uObj && userObj.hasOwnProperty(controls[i])) {
                                var editorBlockEnable = (userObj[controls[i]]) ? true : false;
                            } else {
                                var editorBlockEnable = false; //By default it would be false
                            }

                            var elems = this.createControllerElement(userId, 'contr' + controls[i]);
                            var controller = elems[0];
                            var editorBlock = elems[1];
                            controller.className += ' controller' + controls[i];

                            controlCont.appendChild(controller);

                            if (virtualclass.currApp != virtualclass.vutil.capitalizeFirstLetter(controls[i])) {
                                controller.style.display = 'none';
                            }

                            virtualclass.user.control.changeAttribute(userId, editorBlock, editorBlockEnable, controls[i], controls[i]);

                            if (orginalTeacher) {
                                editorBlock.addEventListener('click', that.closureEditor(that, editorBlock));
                            }
                        }
                    }
                }
            },

            closureEditor: function (that, editorBlock) {
                return function () {
                    that.control.init.call(that, editorBlock);
                }
            },

            control: {

                /**
                 * Display message box with showing read only and write and read mode
                 * @param editorType type of editor
                 * @param writeMode readonly OR write and read mode
                 */
                toggleDisplayWriteModeMsgBox: function (editorType, writeMode) {

                    var writeModeBox = document.getElementById(editorType + 'writeModeBox');
                    var modeMessage = (writeMode) ? virtualclass.lang.getString("writemode") : virtualclass.lang.getString("readonlymode");
                    var editorBody = document.getElementById('virtualclass' + editorType + 'Body');

                    if (writeModeBox == null && editorBody != null) {
                        writeModeBox = document.createElement('div');
                        writeModeBox.id = editorType + 'writeModeBox';
                        editorBody.appendChild(writeModeBox);
                    }
                    if(writeModeBox != null){
                        writeModeBox.className = 'writeModeBox';
                        writeModeBox.dataset.writeMode = writeMode;
                        writeModeBox.innerHTML = modeMessage;
                    }

                    if (editorType == "EditorRich") {
                        this.tooglDisplayEditorToolBar(writeMode);
                    }
                },

                /**
                 * Either enable or disable toolbar of Editor Rich Text
                 * @param writeMode expects true or flase
                 */
                tooglDisplayEditorToolBar: function (writeMode) {
                    var editorToolBars = document.getElementsByClassName('vceditor-toolbar');
                    var editorToolBar = editorToolBars[0];
                    if (editorToolBars.length > 0) {
                        if (writeMode) {
                            editorToolBar.style.pointerEvents = 'visible';
                            editorToolBar.style.opacity = "1";
                        } else {
                            editorToolBar.style.pointerEvents = 'none';
                            editorToolBar.style.opacity = "0.5";
                        }

                    }
                },

                // TODO this funciton should be improved with received_editorCode
                received_editorRich: function (msg) {
                    var action;
                    if (msg.status ) {

                        if (virtualclass.gObj.uid == msg.toUser) {
                            if(typeof virtualclass.editorRich.cm == 'object' && !virtualclass.isPlayMode){
                                virtualclass.editorRich.cm.setOption('readOnly', false);
                            }

                        } else {
                            this.enable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
                        }

                        if(virtualclass.isPlayMode){
                            virtualclass.editorRich.control.toggleDisplayWriteModeMsgBox(false);
                        }
                        action = true;
                        localStorage.setItem('editorRich', action);
                    } else {
                        if (virtualclass.gObj.uid == msg.toUser) {
                            if(typeof virtualclass.editorRich.cm == 'object'){
                                virtualclass.editorRich.cm.setOption('readOnly', 'nocursor');
                            }
                        } else {
                            this.disable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
                        }
                        action = false;
                        localStorage.setItem('editorRich', action);
                    }

                    if (!roles.hasAdmin()) {
                        this.toggleDisplayWriteModeMsgBox('EditorRich', action);
                    }

                    virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorRich');

                },

                /**
                 * When enable and disable editor code by footer control
                 * @param msg infomration about control
                 */
                // TODO this function should be improved with received_editorRich
                received_editorCode: function (msg) {
                    var action;
                    if (msg.status) {
                        if (virtualclass.gObj.uid == msg.toUser) {
                            if(typeof virtualclass.editorCode.cm == 'object' && !virtualclass.isPlayMode){
                                virtualclass.editorCode.cm.setOption('readOnly', false);
                            }

                        } else {
                            this.enable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
                        }

                        if(virtualclass.isPlayMode){
                            virtualclass.editorCode.control.toggleDisplayWriteModeMsgBox(false);
                        }
                        action = true;
                        localStorage.setItem('editorCode', action);
                    } else {
                        if (virtualclass.gObj.uid == msg.toUser) {
                            if(typeof virtualclass.editorCode.cm == 'object'){
                                virtualclass.editorCode.cm.setOption('readOnly', 'nocursor');
                            }

                        } else {
                            this.disable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
                        }
                        action = false;
                        localStorage.setItem('editorCode', action);
                    }

                    if (!roles.hasAdmin()) {
                        this.toggleDisplayWriteModeMsgBox('EditorCode', action);
                    }

                    virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorCode');
                },

                onmessage: function (e) {
                    this['received_' + e.message.control](e.message);

                    //if(virtualclass.gObj.uid == e.message.toUser){
                    //    this['received_' + e.message.control](e.message);
                    //}
                },

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
                    if (elem == null) {
                        return;
                    }
                    virtualclass.user.control._disable(elem, control, toUser, label);

                },


                _disable: function (elem, control, userId, label) {

                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Disable"));
                    elem.setAttribute('data-' + control + '-disable', 'true');

                    elem.className = "icon-" + control + "Img block" + ' ' + control + 'Img';
                    if (control == 'assign') {
                        elem.parentNode.classList.remove('tooltip');
                        this.addCurrTeacherToControl(elem.id);
                        var userObj = localStorage.getItem('virtualclass' + userId);
                        userObj = JSON.parse(userObj);

                        if (virtualclass.gObj.hasOwnProperty(userId + 'currTeacher')) {
                            if (virtualclass.gObj[userId + 'currTeacher'].ct || (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssign && userObj.currTeacher)) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }
                        } else {

                            if (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssignId == userId) {
                                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
                            }
                        }
                    } else if (control == 'audio') {
                        elem.className = "icon-" + control + "DisImg block" + ' ' + control + 'DisImg';
                    }
                    /*					else {
                     elem.className = "icon-" + control + "Img block" + ' ' + control + 'Img';
                     }
                     */
                    virtualclass.user.control.updateUser(userId, label, false);
                },


                enable: function (toUser, control, contIdPart, label) {
                    var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
                    if (elem == null) {
                        console.log("Element is Null");
                        return;
                    }
                    virtualclass.user.control._enable(elem, control, toUser, label);
                },
                _enable: function (elem, control, userId, label) {
                    elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Enable"));
                    if (control == 'audio') {
                        elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Off"));
                    }
                    elem.setAttribute('data-' + control + '-disable', "false");
                    elem.className = "icon-" + control + "Img enable" + ' ' + control + 'Img';


                    virtualclass.user.control.updateUser(userId, label, true);
                },

                changeAttribute: function (userId, elem, elemEnable, control, label) {
                    if (elemEnable) {
                        virtualclass.user.control._enable(elem, control, userId, label);
                    } else {
                        virtualclass.user.control._disable(elem, control, userId, label);
                    }
                },

                init: function (tag, defaultAction, searchBy) {

                    if (typeof searchBy != 'undefined') {
                        searchBy = searchBy;
                    } else {
                        searchBy = "Img";
                    }

                    var compId = tag.id;
                    var ep = compId.indexOf("contr");
                    var userId = compId.substring(0, ep);
                    var restString = compId.split('contr')[1];
                    var imgPos = restString.indexOf(searchBy);

                    var control = restString.substring(0, imgPos);
                    //TODO this function should be generalise
                    if (control == 'Assign') {
                        virtualclass.gObj.controlAssign = true;
                        virtualclass.gObj.controlAssignId = userId;
                        var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                        if (!assignDisable) {
                            this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                            virtualclass.user.control._assign(userId);
                            virtualclass.user.control.changeAttrToAssign('block');
                        }

                        if (!roles.hasAdmin()) {
                            virtualclass.user.control.removeAudioFromParticipate(userId);
                        }
                    } else {
                        var action, ctrType, boolVal;
                        //TODO this should be generalise
                        if (control == 'Chat') {
                            tag.className = 'contrChatBlock';
                            ctrType = 'chat'
                        } else if (control == 'Aud') {
                            ctrType = 'audio';
                        } else {
                            ctrType = control;
                        }

                        if (typeof defaultAction != 'undefined') {
                            boolVal = (defaultAction == 'enable') ? true : false;

                            action = (boolVal) ? 'enable' : 'block';

                        } else {
                            if (tag.getAttribute('data-' + ctrType + '-disable') == 'true') {
                                action = 'enable';
                                boolVal = true;

                            } else {
                                action = 'block';
                                boolVal = false;

                            }
                        }

                        this.control.changeAttribute(userId, tag, boolVal, ctrType, virtualclass.vutil.smallizeFirstLetter(control));
                        this.control['_' + ctrType].call(this.control, userId, action);

                    }
                },

                init_old: function (tag) {
                    var compId = tag.id;
                    var ep = compId.indexOf("contr");
                    var userId = compId.substring(0, ep);
                    var restString = compId.split('contr')[1];
                    var imgPos = restString.indexOf("Img");
                    var control = restString.substring(0, imgPos);
                    //TODO this function should be generalise
                    if (control == 'Assign') {
                        virtualclass.gObj.controlAssign = true;
                        virtualclass.gObj.controlAssignId = userId;
                        var assignDisable = (tag.getAttribute('data-assign-disable') == 'true') ? true : false;
                        if (!assignDisable) {
                            this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                            virtualclass.user.control._assign(userId);
                            virtualclass.user.control.changeAttrToAssign('block');
                        }

                        if (!roles.hasAdmin()) {
                            virtualclass.user.control.removeAudioFromParticipate(userId);
                        }
                    } else if (control == 'Chat') {

                        var action;
                        if (tag.getAttribute('data-chat-disable') == 'true') {
                            tag.className = 'contrChatBlock';
                            action = 'enable';
                            this.control.changeAttribute(userId, tag, true, 'chat', 'chat');
                        } else {
                            action = 'block';
                            this.control.changeAttribute(userId, tag, false, 'chat', 'chat');
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
                    virtualclass.vutil.assignRole();
                    virtualclass.vutil.removeAppPanel();
                    //if(virtualclass.currApp != 'Whiteboard'){
                        virtualclass.system.setAppDimension();
                        // After resize we need tor render all the drawn object on whiteboard
                        virtualclass.vutil.renderWhiteboardObjectsIfAny();
                    //}
                    if (!roles.hasAdmin()) {
                        var canvasWrapper = document.getElementById("vcanvas");
                        canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
                        canvasWrapper.className = 'student';
                    }
                    localStorage.setItem('canvasDrwMsg', true);
                    var ssVideo = document.getElementById('virtualclassScreenShareLocalVideo');
                    if (ssVideo != null && ssVideo.tagName == "VIDEO") {
                        virtualclass.vutil.videoTeacher2Student('ScreenShare', true);
                    }

                    var app;
                    if (virtualclass.currApp == "ScreenShare") {
                        app = 'ss';

                        if (virtualclass[app].hasOwnProperty('currentStream')) {
                            virtualclass[app].currentStream.stop();
                        }
                        virtualclass[app] = "";
                    }

                    if (typeof notsent == 'undefined') {
                        virtualclass.vutil.beforeSend({'assignRole': true, toUser: userId, 'cf': 'assignRole'}, userId);

                        if(roles.hasAdmin()){
                            var erContId =  userId + 'contreditorRichImg';
                            var erContTag = document.getElementById(erContId);

                            if(erContTag.dataset.editorrichDisable == 'true'){
                                virtualclass.user.control.init.call(virtualclass.user, erContTag);
                            }


                            var ecContId =  userId + 'contreditorCodeImg';
                            var ecContTag = document.getElementById(ecContId);

                            if(ecContTag.dataset.editorcodeDisable == 'true'){
                                virtualclass.user.control.init.call(virtualclass.user, ecContTag);
                            }
                        }

                        //var editorEditorSpan = document.getElementById(userId + 'contreditorCodeImg');
                        //virtualclass.user.control.init.call(virtualclass.user, editorEditorSpan);

                    }

                    // if role is student
                    if (!roles.hasAdmin()) {
                        if (typeof fromUserId == 'undefined') {
                            fromUserId = userId;
                        }
                        var controlContainer = document.getElementById(fromUserId + 'ControlContainer').getElementsByClassName('controleCont')[0];
                        controlContainer.removeChild(controlContainer.firstChild);
                        localStorage.removeItem('aId');

                        //controlContainer.parentNode.removeChild(controlContainer);
                    }
                },
                _chat: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({'enc': true, toUser: userId, 'cf': 'enc'}, userId);
                    } else {
                        var user = virtualclass.user.control.updateUser(userId, 'chat', false);
                        virtualclass.vutil.beforeSend({'dic': true, toUser: userId, 'cf' : 'dic'}, userId);
                    }
                },

                _audio: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({'ena': true, toUser: userId, 'cf': 'ena'}, userId);
                    } else {
                        virtualclass.vutil.beforeSend({'dia': true, toUser: userId, 'cf': 'dia'}, userId);
                    }
                },


                _audioAll : function (userId, action) {

                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({'ena': true, toUser: userId, 'cf': 'ena'}, userId);
                    } else {
                        virtualclass.vutil.beforeSend({'dia': true, toUser: userId, 'cf': 'dia'}, userId);
                    }
                },

                _editorRich: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({
                            'status': true,
                            control: 'editorRich',
                            toUser: userId,
                            'cf': 'control'
                        }, userId);
                    } else {
                        virtualclass.vutil.beforeSend({
                            'status': false,
                            control: 'editorRich',
                            toUser: userId,
                            'cf': 'control'
                        }, userId);
                    }
                },


                _editorCode: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({
                            'status': true,
                            control: 'editorCode',
                            toUser: userId,
                            'cf': 'control'
                        }, userId);
                    } else {
                        virtualclass.vutil.beforeSend({
                            'status': false,
                            control: 'editorCode',
                            toUser: userId,
                            'cf': 'control'
                        }, userId);
                    }
                },


                _audio: function (userId, action) {
                    if (action == 'enable') {
                        virtualclass.vutil.beforeSend({'ena': true, toUser: userId, 'cf': 'ena'}, userId);
                    } else {
                        virtualclass.vutil.beforeSend({'dia': true, toUser: userId, 'cf': 'dia'}, userId);
                    }
                },


                audioWidgetEnable: function () {
                    localStorage.setItem('audEnable', JSON.stringify({ac:'true'}));
                    if(localStorage.getItem('dvid') == null){
                        var studentSpeaker = document.getElementById('audioWidget');
                        studentSpeaker.className = 'active';
                        studentSpeaker.style.opacity = "1";
                        studentSpeaker.style.pointerEvents = "visible";
                    }


                },

                //move into media.js
                audioWidgetDisable: function (reason) {
                    var ad = {ac:'false'};

                    var aud = localStorage.getItem('audEnable');
                    if(aud != null){
                        aud = JSON.parse(aud);
                        if(aud.ac != 'false' && typeof reason != 'undefined'){
                            ad.r = reason;
                        }
                    }else if(typeof reason != 'unefined'){
                        ad.r = reason;
                    }


                    localStorage.setItem('audEnable', JSON.stringify(ad));

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

                /**
                 * Is use for either diable/enable provided  editor for all user
                 * @param edType
                 */
                toggleAllEditorController: function (edType, action) {
                    edType = virtualclass.vutil.smallizeFirstLetter(edType);
                    var allUsersDom = document.getElementsByClassName('controleCont');
                    if (allUsersDom.length > 0) {
                        for (var i = 0; i < allUsersDom.length; i++) {
                            if (allUsersDom[i].id.indexOf(edType) > 0) {
                                var idPartPos = allUsersDom[i].id.indexOf('Cont');
                                if (idPartPos > 0) {
                                    var idPart = allUsersDom[i].id.substr(0, idPartPos);
                                    var elem = document.getElementById(idPart + 'Img');
                                    this.control.init.call(this, elem, action);
                                }
                            }
                        }
                    }
                },

                /**
                 * Either Show OR Hidden all editor controller
                 * @param editor editor type
                 * @param action show or hidden
                 */
                toggleDisplayEditorController: function (editor, action) {
                    editor = virtualclass.vutil.smallizeFirstLetter(editor);

                    var allEditorController = document.getElementsByClassName('controller' + editor);
                    for (var i = 0; i < allEditorController.length; i++) {
                        allEditorController[i].style.display = action;
                    }
                },

                //TODO this function name should be convert into updateControlAtLocalStorage
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
                            enAudAnch.setAttribute('data-title', virtualclass.lang.getString('studentAudEnable'));

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
                        this.iconAttrManupulate(user.id, "icon-audioEnaGreen");
                    } else {
                        if (user.aud) {
                            this.iconAttrManupulate(user.id, "icon-audioImg");
                        } else {
                            this.iconAttrManupulate(user.id, "icon-audioDisImg");
                        }
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
                        //console.log('uid ' + uid + " " + userObj.ad);
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
            },

            /**
             * disable/enable all the audio
             * @param action expect either enable/disable
             */
                toggleAllAudio: function (action) {
                var allUsersDom = document.getElementsByClassName('controleCont');
                if (allUsersDom.length > 0) {
                    for (var i = 0; i < allUsersDom.length; i++) {
                        if (allUsersDom[i].id.indexOf('Aud') > 0) {
                            var idPartPos = allUsersDom[i].id.indexOf('Cont');
                            if (idPartPos > 0) {
                                var idPart = allUsersDom[i].id.substr(0, idPartPos);
                                var elem = document.getElementById(idPart + 'Img');


                                this.control.init.call(this, elem, action);


                            }
                        }
                    }
                }
            },

            /**
             * Create Audio all Enable/Disable buttons with
             * it's helper function
             * @param mainTagId
             * @param tagClass
             * @constructor
             */
            UIaudioAll : function (mainTagId, tagClass){
                var anchorTag = document.createElement('a');
                anchorTag.id = 'contrAudioAll';



                var spanTag = document.createElement('span');
                spanTag.id = 'contrAudioAllImg';


                var allAudAction = localStorage.getItem('allAudAction');

                if(allAudAction != null &&  allAudAction == 'disable'){
                    //spanTag.innerHTML = "En Aud All";
                    spanTag.setAttribute('data-action', 'enable');
                    spanTag.className = 'icon-all-audio-enable tooltip';
                    spanTag.dataset.title = virtualclass.lang.getString('unmuteAll');
                }else{
                    //spanTag.innerHTML = "Dis Aud All";
                    spanTag.setAttribute('data-action', 'disable');
                    spanTag.className = 'icon-all-audio-disable tooltip';
                    spanTag.dataset.title = virtualclass.lang.getString('muteAll');
                }


                if(virtualclass.isPlayMode){
                    anchorTag.pointerEvents = "none";
                    anchorTag.style.cursor = "default";
                } else {
                    var that = this;
                    spanTag.addEventListener('click', function (){
                        var audioController = document.getElementById('contrAudioAllImg');
                        var actionToPerform = that.toogleAudioIcon();
                        if(typeof actionToPerform != 'undefined'){
                            localStorage.setItem('allAudAction', actionToPerform);
                            that.toggleAllAudio.call(virtualclass.user, actionToPerform);
                        }
                    });
                }

                anchorTag.appendChild(spanTag);
                var parentNode = document.getElementById(mainTagId).getElementsByClassName(tagClass)[0];
                parentNode.appendChild(anchorTag);
            },

            toogleAudioIcon : function (){
                var audioController = document.getElementById('contrAudioAllImg');
                if (audioController != null) {
                    actionToPerform = audioController.dataset.action;

                    if (audioController.dataset.action == 'enable') {

                        audioController.dataset.action = 'disable';
                        //audioController.innerHTML = "Dis Aud All";
                        audioController.className = 'icon-all-audio-disable tooltip';

                        audioController.dataset.title = virtualclass.lang.getString('muteAll');

                    } else {
                        audioController.dataset.action = 'enable';
                        //audioController.innerHTML = "En Aud All";
                        audioController.className = 'icon-all-audio-enable tooltip';
                        audioController.dataset.title = virtualclass.lang.getString('unmuteAll');

                    }
                    return actionToPerform;
                }
            },

            changeRoleOnFooter : function (id, role){
                var footerDiv = document.getElementById("ml" + id);
                footerDiv.dataset.role = role;
            }
        }
    };
    window.user = user;
})(window, document);