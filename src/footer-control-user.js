// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
  "use strict";
  const user = function (config) {
    return {
      // TODO function name should be change
      assignRole(role, app, toUser) {
        if (roles.hasControls()) {
          if (!roles.isEducator()) {
            virtualclass.html.leftAppBar();
          }
          virtualclass.attachFunction();

          if (app == 'Whiteboard') {
            const { vcan } = window.virtualclass.wb[virtualclass.gObj.currWb];
            window.virtualclass.wb[virtualclass.gObj.currWb].attachToolFunction(virtualclass.gObj.commandToolsWrapperId[virtualclass.gObj.currWb], true, virtualclass.gObj.currWb);
          }
          // This is already Check at above, no need here
          if (virtualclass.hasOwnProperty('previrtualclass')) {
            virtualclass.vutil.makeActiveApp(`virtualclass${app}`, virtualclass.previrtualclass);
          } else {
            virtualclass.vutil.makeActiveApp(`virtualclass${app}`);
          }

          // if (app == 'Whiteboard') {
          if (typeof virtualclass.wb === 'object') {
            virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasEnable();
          }
        }
      },

      teacherIsAlreadyExist() {
        const allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');
        let role;
        for (let i = 0; i < allExistedUser.length; i++) {
          role = allExistedUser[i].getAttribute('data-role');
          if (role == 't' || role == 'e') {
            return true;
          }
        }
        return false;
      },

      // createControl: function (userId, controls) {
      //     // var controlCont = document.getElementById(userId+"ControlContainer");
      //     var controlCont = document.createElement('div');
      //     this.createControlDivs(controlCont, userId, controls);
      // },

      createControl(userId, controls) {
        const controlCont = document.createElement('div');
        controlCont.id = `${userId}ControlContainer`;
        controlCont.className = 'controls';
        this.createControlDivs(controlCont, userId, controls);
        return controlCont;
      },

      createControllerElement(userId, imgName) {
        const elemBlock = document.createElement('span');
        elemBlock.id = `${userId + imgName}Img`;

        const elemAnch = document.createElement('a');
        elemAnch.id = `${userId + imgName}Anch`;
        elemAnch.className = 'congtooltip';
        elemAnch.appendChild(elemBlock);

        const imgCont = document.createElement('div');
        imgCont.id = `${userId + imgName}Cont`;
        imgCont.className = 'controleCont';
        imgCont.appendChild(elemAnch);

        return [imgCont, elemBlock];
      },

      createAssignControl(controlCont, userId, aRoleEnable, currTeacher) {
        const that = this;

        // TODO var [a, , b] = [1,2,3]; this would be available in ecmascript 6, will have to convert
        const elems = this.createControllerElement(userId, 'contrAssign');
        const controller = elems[0];
        const assignBlock = elems[1];

        const controllerDiv = document.getElementById(`${userId}ControlContainer`);

        if (controllerDiv != null) {
          const controllers = controllerDiv.getElementsByClassName('controleCont');
          if (controllers.length <= 0) {
            controllerDiv.appendChild(controller);
          } else {
            controllerDiv.insertBefore(controller, controllerDiv.firstChild);
          }
        } else {
          controlCont.appendChild(controller);
        }

        virtualclass.user.control.changeAttribute(userId, assignBlock, aRoleEnable, 'assign', 'aRole');

        if (typeof currTeacher !== 'undefined') {
          assignBlock.className += ' currTeacher';
        }
        assignBlock.addEventListener('click', () => {
          that.control.init.call(that, assignBlock);
        });
      },


      createControlDivs(controlCont, userId, controls) {
        const that = this;
        // var userObj = localStorage.getItem(userId);
        let uObj = false;
        let userObj = localStorage.getItem(`virtualclass${userId}`);
        if (userObj != null) {
          uObj = true;
          userObj = JSON.parse(userObj);
          if (userObj.hasOwnProperty('currTeacher')) {
            virtualclass.gObj[`${userId}currTeacher`] = {};
            if (userObj.currTeacher == true) {
              virtualclass.user.control.currTeacherAlready = true;
              var currTeacher = true;
              virtualclass.gObj[`${userId}currTeacher`].ct = true;
            } else {
              virtualclass.gObj[`${userId}currTeacher`].ct = false;
            }
          }
        }


        const aRoleEnable = !roles.isEducator();
        const orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
        const isUserTeacher = virtualclass.vutil.isUserTeacher(userId);
        // var this should be in normalize in function
        for (let i = 0; i < controls.length; i++) {
          if (controls[i] == 'assign' && orginalTeacher) {
            if (typeof currTeacher !== 'undefined') {
              this.createAssignControl(controlCont, userId, aRoleEnable, currTeacher);
            } else {
              this.createAssignControl(controlCont, userId, aRoleEnable);
            }
          } else if (controls[i] == 'audio') {
            var elems = this.createControllerElement(userId, 'contrAud');
            var controller = elems[0];
            var audBlock = elems[1];
            controlCont.appendChild(controller);

            if (uObj && userObj.hasOwnProperty('aud')) {
              var audEnable = !!(userObj.aud);
            } else {
              var audEnable = true;
            }

            virtualclass.user.control.changeAttribute(userId, audBlock, audEnable, 'audio', 'aud');

            if (orginalTeacher) {
              audBlock.addEventListener('click', () => {
                that.control.init.call(that, audBlock);
              });
            }

            if (roles.hasAdmin()) {
              if (audBlock.dataset.audioDisable == 'false') {
                const allAudAction = localStorage.getItem('allAudAction');
                if (allAudAction != null && allAudAction == 'disable') {
                  audBlock.click();
                }
              }
            }
          } else if (controls[i] == 'chat') {
            var elems = this.createControllerElement(userId, 'contrChat');

            var controller = elems[0];
            var chatBlock = elems[1];

            controlCont.appendChild(controller);

            if (orginalTeacher) {
              chatBlock.addEventListener('click', () => {
                that.control.init.call(that, chatBlock);
              });
            }

            if (uObj && userObj.hasOwnProperty('chat')) {
              var chEnable = !!(userObj.chat);
            } else {
              var chEnable = true;
            }
            virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'chat');
          } else if (controls[i] == 'editorRich' || (controls[i] == 'editorCode')) {
            if (roles.hasAdmin()) {
              if (uObj && userObj.hasOwnProperty(controls[i])) {
                var editorBlockEnable = !!(userObj[controls[i]]);
              } else {
                var editorBlockEnable = false; // By default it would be false
              }

              var elems = this.createControllerElement(userId, `contr${controls[i]}`);
              var controller = elems[0];
              const editorBlock = elems[1];
              controller.className += ` controller${controls[i]}`;

              controlCont.appendChild(controller);


              if (virtualclass.currApp != virtualclass.vutil.capitalizeFirstLetter(controls[i])) {
                controller.style.display = 'none';
              }

              virtualclass.user.control.changeAttribute(userId, editorBlock, editorBlockEnable, controls[i], controls[i]);

              if (orginalTeacher) {
                editorBlock.addEventListener('click', that.closureEditor(that, editorBlock));
              }
            }
          } else if (controls[i] == 'RaiseHand') {
            if (uObj && userObj.hasOwnProperty('raiseHand')) {
              var rhEnable = !!(userObj.raiseHand);
            } else {
              var rhEnable = true;
            }
            virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'RaiseHand', 'RaiseHand');
          }
        }
      },

      closureEditor(that, editorBlock) {
        return function () {
          that.control.init.call(that, editorBlock);
        };
      },

      control: {

        /**
         * Display message box with showing read only and write and read mode
         * @param editorType type of editor
         * @param writeMode readonly OR write and read mode
         */
        toggleDisplayWriteModeMsgBox(editorType, writeMode) {
          let writeModeBox = document.getElementById(`${editorType}writeModeBox`);
          const modeMessage = (writeMode) ? virtualclass.lang.getString('writemode') : virtualclass.lang.getString('readonlymode');
          const editorBody = document.getElementById(`virtualclass${editorType}Body`);

          if (writeModeBox == null && editorBody != null) {
            writeModeBox = document.createElement('div');
            writeModeBox.id = `${editorType}writeModeBox`;
            editorBody.appendChild(writeModeBox);
          }
          if (writeModeBox != null) {
            writeModeBox.className = 'writeModeBox';
            writeModeBox.dataset.writeMode = writeMode;
            writeModeBox.innerHTML = modeMessage;
          }

          if (editorType == 'EditorRich') {
            this.tooglDisplayEditorToolBar(writeMode);
          }
        },

        /**
         * Either enable or disable toolbar of Editor Rich Text
         * @param writeMode expects true or flase
         */
        tooglDisplayEditorToolBar(writeMode) {
          const editorToolBars = document.getElementsByClassName('vceditor-toolbar');
          const editorToolBar = editorToolBars[0];
          if (editorToolBars.length > 0) {
            if (writeMode) {
              editorToolBar.style.pointerEvents = 'visible';
              editorToolBar.style.opacity = '1';
            } else {
              editorToolBar.style.pointerEvents = 'none';
              editorToolBar.style.opacity = '0.5';
            }
          }
        },

        // TODO this funciton should be improved with received_editorCode
        received_editorRich(msg) {
          let action;
          // If editor rich is enabled
          if (msg.status) {
            if (virtualclass.gObj.uid == msg.toUser) {
              if (typeof virtualclass.editorRich.cm === 'object' && !virtualclass.isPlayMode) {
                virtualclass.editorRich.cm.setOption('readOnly', false);
              }
            } else {
              // TODO this should be optimized
              this.enable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
            }

            if (virtualclass.isPlayMode) {
              // TODO validate this statement
              virtualclass.editorRich.control.toggleDisplayWriteModeMsgBox(false);
            }
            action = true;
            localStorage.setItem('editorRich', action);
          } else {
            // If editor rich is disabled
            if (virtualclass.gObj.uid == msg.toUser) {
              if (typeof virtualclass.editorRich.cm === 'object') {
                virtualclass.editorRich.cm.setOption('readOnly', 'nocursor');
              }
            } else {
              // TODO this should be optimized
              this.disable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
            }
            action = false;
            localStorage.setItem('editorRich', action);
          }

          if (!roles.hasAdmin()) {
            this.toggleDisplayWriteModeMsgBox('EditorRich', action);
          }

          // if((roles.isStudent() || roles.isEducator()) && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()){
          if ((!roles.hasAdmin()) && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()) {
            if (msg.status) {
              virtualclass.editorRich.enableEditorByOuterLayer();
            } else {
              virtualclass.editorRich.disableEditorByOuterLayer();
            }
          }
          virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorRich');
        },

        /**
         * When enable and disable editor code by footer control
         * @param msg infomration about control
         */
        // TODO this function should be improved with received_editorRich
        received_editorCode(msg) {
          let action;
          // If editor code is enabled
          if (msg.status) {
            if (virtualclass.gObj.uid == msg.toUser) {
              if (typeof virtualclass.editorCode.cm === 'object' && !virtualclass.isPlayMode) {
                virtualclass.editorCode.cm.setOption('readOnly', false);
              }
            } else {
              this.enable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
            }

            if (virtualclass.isPlayMode) {
              virtualclass.editorCode.control.toggleDisplayWriteModeMsgBox(false);
            }
            action = true;
            localStorage.setItem('editorCode', action);
          } else {
            // If editor code is disabled
            if (virtualclass.gObj.uid == msg.toUser) {
              if (typeof virtualclass.editorCode.cm === 'object') {
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
          // if((roles.isStudent() || roles.isEducator()) && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()){
          if ((!roles.hasAdmin()) && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()) {
            if (msg.status) {
              virtualclass.editorCode.enableEditorByOuterLayer();
            } else {
              virtualclass.editorCode.disableEditorByOuterLayer();
            }
          }
          virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorCode');
        },

        onmessage(e) {
          if (!e.message.hasOwnProperty('toUser')) {
            e.message.toUser = virtualclass.gObj.uid;
          }
          this[`received_${e.message.control}`](e.message);
        },

        addCurrTeacherToControl(id) {
          const elem = document.getElementById(id);
          if (elem != null) {
            if (virtualclass.vutil.elemHasAnyClass(id)) {
              elem.classList.add('currTeacher');
            } else {
              elem.className = 'currTeacher';
            }
          }
        },

        removeCurrTeacherFromControl(id) {
          const elem = document.getElementById(id);
          if (virtualclass.vutil.elemHasAnyClass(id)) {
            elem.classList.remove('currTeacher');
            const uidPos = id.indexOf('contr');
            const userId = id.substring(0, uidPos);
            virtualclass.user.control.updateUser(userId, 'currTeacher', false);
          }
        },

        removeAudioFromParticipate(id) {
          const tobeDeleted = document.getElementById(`${id}contrAssignCont`);
          if (tobeDeleted != null) {
            tobeDeleted.parentNode.removeChild(tobeDeleted);
          }
        },

        disable(toUser, control, contIdPart, label) {
          const selector = `.${control}Control${toUser} ` + ' .contImg';
          const elem = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(selector);
          // var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
          if (elem == null) {
            return;
          }
          virtualclass.user.control._disable(elem, control, toUser, label);
        },


        _disable(elem, control, userId, label) {
          elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${control}Disable`));
          // elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "On"));
          elem.setAttribute(`data-${control}-disable`, 'true');

          elem.className = `icon-${control}Img block` + ` ${control}Img`;
          if (control == 'assign') {
            elem.parentNode.classList.remove('tooltip');
            this.addCurrTeacherToControl(elem.id);
            let userObj = localStorage.getItem(`virtualclass${userId}`);
            userObj = JSON.parse(userObj);

            if (virtualclass.gObj.hasOwnProperty(`${userId}currTeacher`)) {
              if (virtualclass.gObj[`${userId}currTeacher`].ct || (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssign && userObj.currTeacher)) {
                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
              }
            } else if (virtualclass.gObj.hasOwnProperty('controlAssign') && virtualclass.gObj.controlAssignId == userId) {
              virtualclass.user.control.updateUser(userId, 'currTeacher', true);
            }
          } else if (control == 'audio') {
            elem.className = `icon-${control}DisImg block` + ` ${control}DisImg`;
          }

          virtualclass.user.control.updateUser(userId, label, false);
        },


        enable(toUser, control, contIdPart, label) {
          // var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
          const selector = `.${control}Control${toUser} .contImg`;
          const elem = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(selector);

          if (elem == null) {
            console.log('Element is Null');
            return;
          }
          virtualclass.user.control._enable(elem, control, toUser, label);
        },
        _enable(elem, control, userId, label) {
          elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${control}Enable`));
          // if (control == 'audio') {
          //     elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Off"));
          // }
          elem.setAttribute(`data-${control}-disable`, 'false');
          elem.className = `icon-${control}Img enable` + ` ${control}Img`;
          if (control == 'RaiseHand') {
            virtualclass.raiseHand._raiseHand(userId);
          }
          virtualclass.user.control.updateUser(userId, label, true);
        },


        changeAttribute(userId, elem, elemEnable, control, label) {
          if (elemEnable) {
            virtualclass.user.control._enable(elem, control, userId, label);
          } else {
            virtualclass.user.control._disable(elem, control, userId, label);
          }
        },

        init(tag, defaultAction, searchBy, actSend) {
          if (typeof searchBy !== 'undefined') {
            searchBy = searchBy;
          } else {
            searchBy = 'Img';
          }
          const compId = tag.id;
          const ep = compId.indexOf('contr');
          const userId = compId.substring(0, ep);
          const restString = compId.split('contr')[1];
          const imgPos = restString.indexOf(searchBy);

          const control = restString.substring(0, imgPos);
          // TODO this function should be generalise
          if (control == 'Assign') {
            // this condition only true when the app is not quiz, poll, docs, and video
            if (virtualclass.vutil.appIsForEducator(virtualclass.currApp)) {
              virtualclass.gObj.controlAssign = true;
              virtualclass.gObj.controlAssignId = userId;
              const assignDisable = (tag.getAttribute('data-assign-disable') == 'true');
              if (!assignDisable) {
                this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                virtualclass.user.control._assign(userId);
                virtualclass.user.control.changeAttrToAssign('block');
              }

              if (!roles.hasAdmin()) {
                virtualclass.user.control.removeAudioFromParticipate(userId);
              }
            }
          } else {
            let action; let ctrType; let
              boolVal;
            // TODO this should be generalise
            if (control == 'stdscreen') {
              // if teacher share his screen
              if (roles.hasControls() && virtualclass.previous == 'virtualclassScreenShare') {
                virtualclass.vutil.initDefaultApp();
              }
              ctrType = 'stdscreen';
              this.control[`_${ctrType}`].call(this.control, userId);
              if (virtualclass.currApp == 'Video' && virtualclass.videoUl.player) {
                ioAdapter.mustSend({ videoUl: { init: 'destroyPlayer' }, cf: 'destroyPlayer' });
                ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
                virtualclass.vutil.initDashboard();
                virtualclass.vutil.removeBackgroundVideoApp();
              }
            } else {
              if (control == 'Chat') {
                tag.className = 'contrChatBlock';
                ctrType = 'chat';
              } else if (control == 'Aud') {
                ctrType = 'audio';
              } else {
                ctrType = control;
              }

              if (typeof defaultAction !== 'undefined') {
                boolVal = (defaultAction == 'enable');

                action = (boolVal) ? 'enable' : 'block';
              } else if (tag.getAttribute(`data-${ctrType}-disable`) == 'true') {
                action = 'enable';
                boolVal = true;
              } else {
                action = 'block';
                boolVal = false;
              }

              this.control.changeAttribute(userId, tag, boolVal, ctrType, virtualclass.vutil.smallizeFirstLetter(control));
              if (actSend == undefined) {
                this.control[`_${ctrType}`].call(this.control, userId, action);
              }
            }
          }
        },
        init_old(tag) {
          const compId = tag.id;
          const ep = compId.indexOf('contr');
          const userId = compId.substring(0, ep);
          const restString = compId.split('contr')[1];
          const imgPos = restString.indexOf('Img');
          const control = restString.substring(0, imgPos);
          // TODO this function should be generalise
          if (control == 'Assign') {
            virtualclass.gObj.controlAssign = true;
            virtualclass.gObj.controlAssignId = userId;
            const assignDisable = (tag.getAttribute('data-assign-disable') == 'true');
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

        _assign(userId, notsent, fromUserId) {
          // debugger;
          virtualclass.vutil.assignRole();
          virtualclass.vutil.removeAppPanel();
          virtualclass.system.setAppDimension();
          // After resize we need tor render all the drawn object on whiteboard
          virtualclass.vutil.renderWhiteboardObjectsIfAny();

          if (!roles.hasAdmin()) {
            const canvasWrapper = document.getElementById('vcanvas');
            canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
            canvasWrapper.className = 'student';
          }

          localStorage.setItem('canvasDrwMsg', true);
          const ssVideo = document.getElementById('virtualclassScreenShareLocalVideo');
          if (ssVideo != null && ssVideo.tagName == 'VIDEO') {
            virtualclass.vutil.videoTeacher2Student('ScreenShare', true);
          }

          let app;
          if (virtualclass.currApp == 'ScreenShare') {
            app = 'ss';
            if (virtualclass[app].hasOwnProperty('currentStream')) {
              // this.currentStream.stop(); is depricated from Google Chrome 45
              // https://developers.google.com/web/updates/2015/07/mediastream-deprecations?hl=en
              virtualclass[app].currentStream.getTracks()[0].stop();
              // virtualclass[app].currentStream.stop();
            }
            virtualclass[app] = '';
          }

          if (typeof notsent === 'undefined') {
            console.log('role transfer');
            virtualclass.vutil.beforeSend({ assignRole: true, toUser: userId, cf: 'assignRole' }, userId);

            if (roles.hasAdmin()) {
              const erContId = `${userId}contreditorRichImg`;
              const erContTag = document.getElementById(erContId);

              if (erContTag.dataset.editorrichDisable == 'true') {
                virtualclass.user.control.init.call(virtualclass.user, erContTag);
              }
              const ecContId = `${userId}contreditorCodeImg`;
              const ecContTag = document.getElementById(ecContId);

              if (ecContTag.dataset.editorcodeDisable == 'true') {
                virtualclass.user.control.init.call(virtualclass.user, ecContTag);
              }
            }
          }

          // if role is student
          if (!roles.hasAdmin()) {
            if (typeof fromUserId === 'undefined') {
              fromUserId = userId;
            }
            const controlContainer = document.getElementById(`${fromUserId}ControlContainer`).getElementsByClassName('controleCont')[0];
            controlContainer.removeChild(controlContainer.firstChild);
            localStorage.removeItem('aId');
          }
        },


        _chat(userId, action) {
          if (action == 'enable') {
            //virtualclass.vutil.beforeSend({ enc: true, toUser: userId, cf: 'enc' }, userId);
             virtualclass.settings.applySettings(true, "disableAttendeePc", userId);
          } else {
            const user = virtualclass.user.control.updateUser(userId, 'chat', false);
            //virtualclass.vutil.beforeSend({ dic: true, toUser: userId, cf: 'dic' }, userId);
             virtualclass.settings.applySettings(false, "disableAttendeePc", userId);
          }
        },

        _audioAll(userId, action) {
          if (action == 'enable') {
            virtualclass.vutil.beforeSend({ ena: true, toUser: userId, cf: 'ena' }, userId);
          } else {
            virtualclass.vutil.beforeSend({ dia: true, toUser: userId, cf: 'dia' }, userId);
          }
        },

        _editorRich(userId, action) {
          if (action == 'enable') {
            virtualclass.vutil.beforeSend({
              status: true,
              control: 'editorRich',
              toUser: userId,
              cf: 'control',
            }, userId);
          } else {
            virtualclass.vutil.beforeSend({
              status: false,
              control: 'editorRich',
              toUser: userId,
              cf: 'control',
            }, userId);
          }
        },


        _editorCode(userId, action) {
          if (action == 'enable') {
            virtualclass.vutil.beforeSend({
              status: true,
              control: 'editorCode',
              toUser: userId,
              cf: 'control',
            }, userId);
          } else {
            virtualclass.vutil.beforeSend({
              status: false,
              control: 'editorCode',
              toUser: userId,
              cf: 'control',
            }, userId);
          }
        },

        _audio(userId, action) {
          if (action == 'enable') {
            // virtualclass.vutil.beforeSend({'ena': true, toUser: userId, 'cf': 'ena'}, userId);
            virtualclass.settings.applySettings(true, 'disableAttendeeAudio', userId);
          } else {
            // virtualclass.vutil.beforeSend({'dia': true, toUser: userId, 'cf': 'dia'}, userId);
            virtualclass.settings.applySettings(false, 'disableAttendeeAudio', userId);
          }
        },
        _RaiseHand(userId, action) {
          // to disable only ..
          virtualclass.raiseHand.disableRaiseHand(userId);
        },

        _stdscreen(userId) {
          virtualclass.vutil.beforeSend({ reqscreen: true, toUser: userId, cf: 'reqscreen' }, userId);
        },

        audioWidgetEnable(notActive) {
          console.log('Audio enable true');
          localStorage.setItem('audEnable', JSON.stringify({ ac: 'true' }));
          if (localStorage.getItem('dvid') == null) {
            const studentSpeaker = document.getElementById('speakerPressOnce');
            if (typeof notActive === 'undefined') {
              studentSpeaker.className = 'active';
            }
            studentSpeaker.style.opacity = '1';
            studentSpeaker.style.pointerEvents = 'visible';
          }
        },

        // move into media.js
        mediaWidgetDisable(reason) {
          virtualclass.system.mediaDevices.hasWebcam = false;
          const ad = { ac: 'false' };

          let aud = localStorage.getItem('audEnable');
          if (aud != null) {
            aud = JSON.parse(aud);
            if (aud.ac != 'false' && typeof reason !== 'undefined') {
              ad.r = reason;
            }
          } else if (typeof reason !== 'unefined') {
            ad.r = reason;
          }

          console.log(`audEnable ${ad}`);
          // localStorage.setItem('audEnable', JSON.stringify(ad));

          const studentSpeaker = document.getElementById('audioWidget');
          studentSpeaker.style.opacity = '1';
          studentSpeaker.style.pointerEvents = 'visible';
          studentSpeaker.className = 'deactive';
          this.audioDisable();
          this.videoDisable();

          // var alwaysPressElem = document.getElementById('speakerPressing');
          if (virtualclass.gObj.hasOwnProperty('video')) {
            virtualclass.media.audio.studentNotSpeak();
            virtualclass.media.audio.clickOnceSpeaker('speakerPressOnce', 'alwaysDisable');
          }

          virtualclass.vutil.addClass('virtualclassCont', 'nowebcam');
        },

        audioDisable() {
          const mic = document.getElementById('speakerPressOnce');
          if (mic != null) {
            mic.style.opacity = '0.5';
            mic.style.pointerEvents = 'none';
          }
        },

        videoDisable() {
          const videoIcon = document.getElementById('congCtrBar');
          if (videoIcon != null) {
            videoIcon.style.opacity = '0.5';
            videoIcon.style.pointerEvents = 'none';
          }
        },

        videoEnable() {
          const videoIcon = document.getElementById('congCtrBar');
          if (videoIcon != null) {
            videoIcon.style.opacity = '1';
            videoIcon.style.pointerEvents = 'visible';
          }
        },

        allChatDisable() {
          this.disableCommonChat();
          this.disbaleAllChatBox();
          this.disableOnLineUser();
        },

        disableCommonChat() {
          const div = document.getElementById('chatrm');
          if (div != null) {
            this.makeElemDisable(div);
          }
          const chatInput = document.querySelector('#virtualclassCont.congrea #ta_chrm2');
          if (chatInput) {
            chatInput.classList.add('disable');
            chatInput.disabled = true;
          }
        },
        disbaleAllChatBox() {
          localStorage.setItem('chatEnable', 'false');
          const chat_div = document.querySelector('#virtualclassAppRightPanel');
          chat_div.classList.add('chat_disabled');
          document.querySelector('#chat_div').classList.add('chat_disabled');
          chat_div.classList.remove('chat_enabled');

          const allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
          for (let i = 0; i < allChatBoxes.length; i++) {
            this.makeElemDisable(allChatBoxes[i]);
          }
        },

        /** TODO this function should be removed, use the mechanism, which is using at chat.init() in chat.js * */
        disableOnLineUser() {
          const allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
          for (let i = 0; i < allChatDivCont.length; i++) {
            allChatDivCont[i].style.pointerEvents = 'none';
          }
        },

        makeElemDisable(elem) {
          if (elem.id != 'chatrm') {
            if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
              elem.classList.remove('enable');
              elem.classList.add('disable');
            } else {
              elem.className = 'disable';
            }
          }

          const inputBox = elem.getElementsByClassName('ui-chatbox-input-box')[0];
          if (inputBox != null) {
            inputBox.disabled = true;
          }
        },
        allChatEnable() {
          localStorage.setItem('chatEnable', 'true');
          const chat_div = document.querySelector('#virtualclassAppRightPanel');
          chat_div.classList.remove('chat_disabled');
          document.querySelector('#chat_div').classList.remove('chat_disabled');

          chat_div.classList.add('chat_enabled');

          const chatInput = document.querySelector('#virtualclassCont.congrea #ta_chrm2');
          if (chatInput) {
            chatInput.classList.remove('disable');
            chatInput.disabled = false;
          }


          // var allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
          const allChatBoxes = document.getElementById('stickycontainer').getElementsByClassName('ui-chatbox');
          for (var i = 0; i < allChatBoxes.length; i++) {
            this.makeElemEnable(allChatBoxes[i]);
          }
          var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
          for (var i = 0; i < allChatDivCont.length; i++) {
            if (!allChatDivCont[i].classList.contains('mySelf')) {
              allChatDivCont[i].style.pointerEvents = 'visible';
              // virtualclass.user.control.enable(allChatDivCont[i].id.slice(2), 'chat', 'Chat', 'chat');
            }
            const chatIcon = allChatDivCont[i].querySelector('.icon-chatImg');
            if (chatIcon && !chatIcon.classList.contains('enable')) {
              chatIcon.classList.add('enable');
              chatIcon.setAttribute('data-chat-disable', 'false');
            }

            const txteditorIcon = allChatDivCont[i].querySelector('.icon-editorRichImg');
            if (txteditorIcon && txteditorIcon.classList.contains('enable')) {
              txteditorIcon.classList.remove('enable');
              txteditorIcon.classList.add('block');
              txteditorIcon.parentNode.setAttribute('data-title', virtualclass.lang.getString('writemode'));
              txteditorIcon.setAttribute('data-editorrich-disable', 'true');
            }

            const codeeditorIcon = allChatDivCont[i].querySelector('.icon-editorCodeImg');
            if (codeeditorIcon && codeeditorIcon.classList.contains('enable')) {
              codeeditorIcon.classList.remove('enable');
              codeeditorIcon.classList.add('block');
              codeeditorIcon.parentNode.setAttribute('data-title', virtualclass.lang.getString('editorCodeDisable'));
              codeeditorIcon.setAttribute('data-editorcode-disable', 'true');
            }

            const muteIcon = allChatDivCont[i].querySelector('.icon-audioDisImg');
            if (muteIcon && muteIcon.classList.contains('block')) {
              muteIcon.parentNode.setAttribute('data-title', virtualclass.lang.getString('audioEnable'));
              muteIcon.setAttribute('data-audio-disable', 'false');
            }
          }

          const userList = document.querySelector('#virtualclassCont #memlist.enable');
          const chatrm = document.querySelector('#virtualclassCont #chatrm.enable');

          const listTab = document.querySelector('#user_list');
          const chatroomTab = document.querySelector('#chatroom_bt2');
          if (userList && !listTab.classList.contains('active')) {
            if (!listTab.classList.contains('active')) {
              listTab.classList.add('active');
            }
            chatroomTab.classList.remove('active');
            virtualclass.chat.chatWindow = 'private';
          }
          // var supportTab = document.querySelector("#congreaSupport");
          // if(supportTab.classList.contains("active")){
          //     supportTab.classList.remove("active")
          // }

          if (chatrm) {
            if (!chatroomTab.classList.contains('active')) {
              chatroomTab.classList.add('active');
            }
            listTab.classList.remove('active');
            virtualclass.chat.chatWindow = 'common';
          }

          var allChatDivCont = document.getElementsByClassName('ui-memblist-usr');
          for (var i = 0; i < allChatBoxes.length; i++) {
            this.makeElemEnable(allChatBoxes[i]);
          }
        },

        resetmediaSetting() { // if mute all contains enable
          // todo need to configure meeting,
          // The functionality should same as normal mode
          if (roles.isStudent()) {
            if (!virtualclass.gObj.stdaudioEnable) {
              virtualclass.user.control.audioDisable();
            } else {
              // TODO check if need to audio enable
            }

            if (virtualclass.system.mediaDevices.hasWebcam) {
              /* stdvideoEnable means it's click able for ON,
               *  and user need cick that button to share the video
               * */
              if (virtualclass.gObj.stdvideoEnable) {
                virtualclass.vutil.videoHandler('off');
                virtualclass.videoHost.toggleVideoMsg('enable');
              } else {
                virtualclass.videoHost.toggleVideoMsg('disable');
                const vidIcon = document.querySelector('#videoSwitch');
                // TODO try to remove the section vidIcon.classList.contains("on")
                if (vidIcon != null && vidIcon.classList.contains('on')) {
                  vidIcon.classList.remove('on');
                  vidIcon.classList.add('off');
                }
              }
            }
          } else {
            const mutebtn = document.getElementById('contrAudioAllImg');

            if (mutebtn && mutebtn.classList.contains('icon-all-audio-enable')) {
              mutebtn.classList.remove('icon-all-audio-enable');
              mutebtn.classList.add('icon-all-audio-disable');
              mutebtn.setAttribute('data-title', virtualclass.lang.getString('muteAll'));
              if (mutebtn.dataset.action == 'enable') {
                mutebtn.dataset.action = 'disable';
              }
            }

            const vidbtn = document.getElementById('videoSwitch');
            if (virtualclass.system.mediaDevices.hasWebcam && vidbtn.classList.contains('video')) {
              const tvideoElem = document.getElementById('rightCtlr');
              if (vidbtn.classList.contains('on')) {
                virtualclass.vutil.videoHandler('off');
                tvideoElem.parentNode.setAttribute('data-title', virtualclass.lang.getString('videoon'));
              }
            }


            this.mediaSliderSetting('audio');
            this.mediaSliderSetting('video');
          }

          if (roles.hasAdmin()) {
            virtualclass.gObj.delayVid = 'display';
          }
        },

        /** *
         * This funciton is used to control enable/disable all audio and enable/disable all video at teacher side
         */
        mediaSliderSetting(type) {
          const lable = (type == 'audio') ? 'Audio' : 'Video';
          const defaultMediaSetting = (type == 'audio') ? virtualclass.gObj.stdaudioEnable : virtualclass.gObj.stdvideoEnable;
          const allAction = {
            action: defaultMediaSetting ? 'enable' : 'disable',
            enable: 'disable',
            disable: 'enable',
          };

          // allAction.action = 'enable' means green, now user able to click the audio
          // allAction.action = 'disable' means gray, now user does not able to click the audio

          // media represents audio or video
          const media = document.querySelector(`.congrea #contr${lable}All.${allAction.action}`);
          if (media) {
            media.classList.remove(allAction.action);
            media.classList.add(allAction[allAction.action]);
            const chbox = document.querySelector(`.congrea #contr${lable}All input`);
            if (chbox) {
              chbox.removeAttribute('checked');
            }
          }

          const mediaIcon = document.querySelector(`.congrea .slider.icon-all-${type}-${allAction.action}`);
          if (mediaIcon) {
            mediaIcon.className = `slider round congtooltip icon-all-${type}-${allAction[allAction.action]}`;
            mediaIcon.setAttribute('data-action', allAction[allAction.action]);
            mediaIcon.setAttribute('data-title', virtualclass.lang.getString(`${allAction[allAction.action]}All${lable}`));
          }
        },


        makeElemEnable(elem) {
          if (virtualclass.vutil.elemHasAnyClass(elem.id)) {
            elem.classList.remove('disable');
            elem.classList.add('enable');
          } else {
            elem.className = 'enable';
          }

          // elem.style.opacity = "1";
          const inputBox = elem.getElementsByClassName('ui-chatbox-input-box')[0];
          if (inputBox != null) {
            inputBox.disabled = false;
          }
        },

        /**
         * Is use for either diable/enable provided  editor for all user
         * @param edType
         */
        toggleAllEditorController(edType, action) {
          edType = virtualclass.vutil.smallizeFirstLetter(edType);

          const allUsersDom = chatContainerEvent.elementFromShadowDom('.controleCont', 'all');
          // var allUsersDom = document.getElementsByClassName('controleCont');

          // var allUsersDom = document.getElementsByClassName('controleCont');
          if (allUsersDom.length > 0) {
            for (let i = 0; i < allUsersDom.length; i++) {
              if (allUsersDom[i].id.indexOf(edType) > 0) {
                const idPartPos = allUsersDom[i].id.indexOf('Cont');
                if (idPartPos > 0) {
                  const idPart = allUsersDom[i].id.substr(0, idPartPos);
                  // var elem = document.getElementById(idPart + 'Img');
                  const elem = chatContainerEvent.elementFromShadowDom(`${idPart}Img`, null, true);
                  this.control.init.call(this, elem, action, undefined, 'actnotSend');
                }
              }
            }
          }

          if (action == 'enable') {
            virtualclass.vutil.beforeSend({ status: true, control: 'editorRich', cf: 'control' });
          } else {
            virtualclass.vutil.beforeSend({ status: false, control: 'editorRich', cf: 'control' });
          }
        },

        /**
         * Either Show OR Hidden all editor controller
         * @param editor editor type
         * @param action show or hidden
         */
        toggleDisplayEditorController(editor, action) {
          var editor = virtualclass.vutil.smallizeFirstLetter(editor);

          // var allEditorController = document.getElementsByClassName('controller' + editor);
          if (virtualclass.gObj.hasOwnProperty('testChatDiv')) {
            const allEditorController = chatContainerEvent.elementFromShadowDom(`.controller${editor}`, 'all');
            for (let i = 0; i < allEditorController.length; i++) {
              allEditorController[i].style.display = action;
            }
          }
        },

        // TODO this function name should be convert into updateControlAtLocalStorage
        updateUser(uid, key, val) {
          // var userId =  localStorage.getItem(uid);
          const userId = localStorage.getItem(`virtualclass${uid}`);
          let uObj = {};
          if (userId == null) {
            // userId = uid;
            uObj.id = uid;
          } else {
            uObj = JSON.parse(userId);
          }
          uObj[key] = val;
          localStorage[`virtualclass${uObj.id}`] = JSON.stringify(uObj);
          return uObj;
        },

        audioSign2(user, action) {
          if (action == 'create') {
            if (document.getElementById(`${user.id}AudEnableSign`) == null) {
              // important
              const audEnableSign = document.createElement('div');
              audEnableSign.id = `${user.id}AudEnableSign`;
              const audEnableImg = document.createElement('img');
              imgName = 'audioenable';
              audEnableImg.id = `${user.id + imgName}Img`;
              audEnableImg.src = `${window.whiteboardPath}images/${imgName}.png`;
              const enAudAnch = document.createElement('a');
              enAudAnch.id = `${user.id + imgName}Anch`;
              enAudAnch.className = 'audEnableSign tooltip controleCont';
              enAudAnch.setAttribute('data-title', virtualclass.lang.getString('studentAudEnable'));

              enAudAnch.appendChild(audEnableImg);
              // audEnableSign.appendChild(audEnableImg);
              audEnableSign.appendChild(enAudAnch);
              document.getElementById(`${user.id}ControlContainer`).appendChild(audEnableSign);
            }
          } else {
            const audioEnableTag = document.getElementById(`${user.id}AudEnableSign`);
            audioEnableTag.parentNode.removeChild(audioEnableTag);
          }
        },

        audioSign(user, action) {
          if (action == 'create') {
            this.iconAttrManupulate(user.id, 'icon-audioEnaGreen');
          } else if (user.aud) {
            this.iconAttrManupulate(user.id, 'icon-audioImg');
          } else {
            this.iconAttrManupulate(user.id, 'icon-audioDisImg');
          }
        },

        iconAttrManupulate(uid, classToBeAdd) {
          const audioImg = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(`#ml${uid} .audioImg`);
          if (audioImg != null) {
            for (let i = 0; i < audioImg.classList.length; i++) {
              if (audioImg.classList[i].substring(0, 5) == 'icon-') {
                audioImg.classList.remove(audioImg.classList[i]);
                audioImg.classList.add(classToBeAdd);
                break;
              }
            }
          }
        },

        shouldApply(uid) {
          let userObj = localStorage.getItem(`virtualclass${uid}`);
          if (userObj != null) {
            userObj = JSON.parse(userObj);
            // console.log('uid ' + uid + " " + userObj.ad);
            if (userObj.ad) {
              virtualclass.user.control.audioSign({ id: uid }, 'create');
            }
          }
        },


        changeAttrToAssign(action) {
          const allUserElem = document.getElementById('chatWidget').getElementsByClassName('assignImg');
          for (let i = 0; i < allUserElem.length; i++) {
            if (action == 'enable') {
              allUserElem[i].classList.remove('block');
              allUserElem[i].classList.add('enable');
              allUserElem[i].parentNode.classList.add('tooltip');
              allUserElem[i].parentNode.setAttribute('data-title', virtualclass.lang.getString('transferControls'));
              allUserElem[i].setAttribute('data-assign-disable', 'false');
            } else {
              allUserElem[i].classList.remove('enable');
              allUserElem[i].classList.add('block');
              allUserElem[i].parentNode.classList.remove('tooltip');
              allUserElem[i].setAttribute('data-assign-disable', 'true');
            }
          }
        },
      },

      displayStudentSpeaker(display) {
        const alwaysPress = document.getElementById('alwaysPress');
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
      toggleAllAudio(action) {
        const allUsersDom = chatContainerEvent.elementFromShadowDom('.controleCont', 'all');
        // var allUsersDom = document.getElementsByClassName('controleCont');
        if (allUsersDom.length > 0) {
          for (let i = 0; i < allUsersDom.length; i++) {
            if (allUsersDom[i].id.indexOf('Aud') > 0) {
              const idPartPos = allUsersDom[i].id.indexOf('Cont');
              if (idPartPos > 0) {
                const idPart = allUsersDom[i].id.substr(0, idPartPos);
                const elem = chatContainerEvent.elementFromShadowDom(`${idPart}Img`, null, true);
                // var elem = document.getElementById(idPart + 'Img');
                this.control.init.call(this, elem, action, undefined, 'actnotSend');
              }
            }
          }
        }

        // if (action == 'enable') {
        //     virtualclass.vutil.beforeSend({'aEna': true, 'cf': 'aEna'});
        // } else {
        //     virtualclass.vutil.beforeSend({'aDia': true, 'cf': 'aDia'});
        // }
      },
      toggleAllVideo(action) {
        ioAdapter.mustSend({ action, cf: 'toggleVideo' });
      },
      /**
       * Create Audio all Enable/Disable buttons with
       * it's helper function
       */
      mediaSliderUI(type) {
        const lable = (type == 'audio') ? 'Audio' : 'Video';
        var spanTag = document.querySelector(`.bulkUserActions #contr${lable}AllImg`);
        const settings = virtualclass.settings.info;
        // var settings = localStorage.getItem("settings");
        // if(getSettings !== null) {
        // var applyedSettings = virtualclass.settings.onLoadSettings(getSettings);
        const getMediaAction = virtualclass.user.defaultSettings(type, settings);
        // }

        // var getMediaAction = (type == 'audio') ? localStorage.getItem('allAudAction') : localStorage.getItem('allVideoAction');
        const localAction = (getMediaAction == 'enable') ? 'disable' : 'enable';
        if (getMediaAction != null) {
          spanTag.setAttribute('data-action', localAction);
          spanTag.className = `slider round icon-all-${type}-${localAction} enable congtooltip cgIcon`;
          spanTag.dataset.title = virtualclass.lang.getString(`${localAction}All${lable}`);
          var input = document.querySelector(`.bulkUserActions #contr${lable}All input`);
          input.setAttribute('checked', 'true');
          var cont = document.querySelector(`.congrea #contr${lable}All`);
          cont.classList.add(localAction);
        } else {
          // var defaultMediaSetting =  (type == 'audio') ? virtualclass.gObj.stdaudioEnable : virtualclass.gObj.stdvideoEnable;
          //
          // var defaultMediaSetting = virtualclass.user.defaultSettings(type, settings);
          const allAction = {
            action: getMediaAction ? 'enable' : 'disable',
            enable: 'disable',
            disable: 'enable',
          };
          var spanTag = document.querySelector(`.bulkUserActions #contr${lable}AllImg`);
          spanTag.setAttribute('data-action', allAction[allAction.action]);
          spanTag.className = `slider round icon-all-${type}-${allAction[allAction.action]} congtooltip cgIcon`;
          spanTag.dataset.title = virtualclass.lang.getString(`${allAction[allAction.action]}All${lable}`);
          var input = document.querySelector(`.bulkUserActions #contr${lable}All input`);
          input.removeAttribute('checked');
          var cont = document.querySelector(`.congrea #contr${lable}All`);
          cont.classList.add(allAction[allAction.action]);
        }

        if (virtualclass.isPlayMode) {
          anchorTag.pointerEvents = 'none';
          anchorTag.style.cursor = 'default';
        } else {
          const that = this;
          spanTag.addEventListener('click', () => {
            if (type == 'audio') {
              var actionToPerform = that.toogleAudioIcon();
              const actAudio = (actionToPerform == 'enable');
              virtualclass.settings.applySettings(actAudio, 'disableAttendeeAudio');

              if (typeof actionToPerform !== 'undefined') {
                localStorage.setItem('allAudAction', actionToPerform);
                that.toggleAllAudio.call(virtualclass.user, actionToPerform);
              }
            } else {
              var actionToPerform = that.toggleVideoIcon();
              const actVideo = (actionToPerform == 'enable');
              virtualclass.settings.applySettings(actVideo, 'disableAttendeeVideo');
              if (typeof actionToPerform !== 'undefined') {
                localStorage.setItem('allVideoAction', actionToPerform);
                that.toggleAllVideo(actionToPerform);
              }
            }
          });
        }
      },

      defaultSettings(type, obj) {
        let actionAV; let
          value;
        // TODO, review this code
        for (const propname in obj) {
          value = obj[propname];
          if (type === 'audio' && propname === 'disableAttendeeAudio' || type === 'video' && propname === 'disableAttendeeVideo') {
            actionAV = (value === true) ? 'enable' : 'disable';
          }
        }
        return actionAV;
      },

      chatBoxesSwitch() {
        // debugger;
        if (virtualclass.chat.chatroombox) {
          toggleCommonChatBox();
        } else if ($('div#chat_room').length == 0) {
          const d = document.createElement('ul');
          d.id = 'chat_room';
          document.body.appendChild(d);

          virtualclass.chat.chatroombox = $('#chat_room').chatroom({
            id: 'chat_room',
            user: { name: 'test' },
            title: lang.chatroom_header,
            offset: '20px',
            messageSent(user, msg) {
              $('#chat_room').chatroom('option', 'boxManager').addMsg(user.name, msg);
            },
          });

          if (virtualclass.gObj.hasOwnProperty('chatEnable')) {
            if (!virtualclass.gObj.chatEnable) {
              const chatCont = document.getElementById('chatrm');
              if (chatCont != null) {
                virtualclass.user.control.makeElemDisable(chatCont);
              }
            }
          }
          const iconarrowButton = document.getElementById('cc_arrow_button');
          iconarrowButton.classList.add('icon-arrow-down');
          iconarrowButton.classList.remove('icon-arrow-up');
        }
      },

      toogleAudioIcon() {
        const audioController = document.querySelector('.bulkUserActions #contrAudioAllImg');
        if (audioController != null) {
          let actionToPerform = audioController.dataset.action;

          if (audioController.dataset.action == 'enable') {
            audioController.dataset.action = 'disable';
            // audioController.innerHTML = "Dis Aud All";

            audioController.className = 'slider round icon-all-audio-disable congtooltip';

            audioController.dataset.title = virtualclass.lang.getString('muteAll');

            var cont = document.querySelector('.congrea .bulkUserActions #contrAudioAll');
            cont.classList.add('disable');
            cont.classList.remove('enable');
          } else {
            audioController.dataset.action = 'enable';
            // audioController.innerHTML = "En Aud All";
            audioController.className = 'slider round icon-all-audio-enable congtooltip';
            audioController.dataset.title = virtualclass.lang.getString('unmuteAll');
            var cont = document.querySelector('.congrea .bulkUserActions #contrAudioAll');
            cont.classList.add('enable');
            cont.classList.remove('disable');
          }
          return actionToPerform;
        }
      },
      toggleVideoIcon() {
        const videoController = document.querySelector('.bulkUserActions #contrVideoAllImg');
        if (videoController != null) {
          let actionToPerform = videoController.dataset.action;
          if (videoController.dataset.action == 'enable') {
            videoController.dataset.action = 'disable';
            videoController.className = 'slider round icon-all-video-disable congtooltip';
            videoController.dataset.title = virtualclass.lang.getString('disableAllVideo');
            var cont = document.querySelector('.congrea .bulkUserActions #contrVideoAll');
            cont.classList.add('disable');
            cont.classList.remove('enable');
          } else {
            videoController.dataset.action = 'enable';
            videoController.className = 'slider round icon-all-video-enable congtooltip';
            videoController.dataset.title = virtualclass.lang.getString('enableAllVideo');
            var cont = document.querySelector('.congrea .bulkUserActions #contrVideoAll');
            cont.classList.add('enable');
            cont.classList.remove('disable');
          }
          return actionToPerform;
        }
      },

      changeRoleOnFooter(id, role) {
        const footerDiv = chatContainerEvent.elementFromShadowDom(`#ml${id}`);
        footerDiv.dataset.role = role;
      },

      initControlHandler(userId) {
        const orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
        // Assign event handler
        const that = this;

        // shadow dom

        const allSpans = chatContainerEvent.elementFromShadowDom(`#ml${userId} .contImg`, 'all');

        let uObj = false;
        let userObj = localStorage.getItem(`virtualclass${userId}`);
        if (userObj != null) {
          uObj = true;
          userObj = JSON.parse(userObj);
          if (userObj.hasOwnProperty('currTeacher')) {
            virtualclass.gObj[`${userId}currTeacher`] = {};
            if (userObj.currTeacher == true) {
              virtualclass.user.control.currTeacherAlready = true;
              const currTeacher = true;
              virtualclass.gObj[`${userId}currTeacher`].ct = true;
            } else {
              virtualclass.gObj[`${userId}currTeacher`].ct = false;
            }
          }
        }

        for (let i = 0; i < allSpans.length; i++) {
          // (
          //     function (i){
          //
          //         allSpans[i].addEventListener('click',
          //             function (){
          //                 that.control.init.call(that, allSpans[i]);
          //             }
          //         );
          //
          //     }
          // )(i);


          if (allSpans[i].className.indexOf('chat') > -1) {
              if (uObj && userObj.hasOwnProperty('chat')) {
                if(virtualclass.settings.user.hasOwnProperty(userId)) {
                   var userSettings = virtualclass.settings.onLoadSettings(virtualclass.settings.user[userId]);
                   var chEnable = userSettings.disableAttendeePc;
                }else{
                   var chEnable = virtualclass.settings.info.disableAttendeePc;
                }
            } else {
                var chEnable = virtualclass.settings.info.disableAttendeePc;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], chEnable, 'chat', 'chat');
          } else if (allSpans[i].className.indexOf('aud') > -1) {
              if (uObj && userObj.hasOwnProperty('aud')) {
                  if(virtualclass.settings.user.hasOwnProperty(userId)) {
                     var userSettings = virtualclass.settings.onLoadSettings(virtualclass.settings.user[userId]);
                     var audEnable = userSettings.disableAttendeeAudio;
                  }else{
                     var audEnable = virtualclass.settings.info.disableAttendeeAudio;
                  }
            } else {
                  var elem = document.querySelector("#contrAudioAll");
                  if(virtualclass.jId != null && elem.classList.contains("disable")){
                     var audEnable = virtualclass.settings.info.disableAttendeeAudio;
                  }else {
                     var audEnable = virtualclass.gObj.stdaudioEnable;       //default value for userlist mic enable or disable
                  }
            }

            virtualclass.user.control.changeAttribute(userId, allSpans[i], audEnable, 'audio', 'aud');

            // if (orginalTeacher) {
            //     allSpans[i].addEventListener('click', function () {
            //         that.control.init.call(that, allSpans[i]);
            //     });
            // }

            if (roles.hasAdmin()) {
              if (allSpans[i].dataset.audioDisable == 'false') {
                const allAudAction = localStorage.getItem('allAudAction');
                if (allAudAction != null && allAudAction == 'disable') {
                  // allSpans[i].click();
                }
              }
            }
          } else if (allSpans[i].className.indexOf('RaiseHand') > -1) {
            if (uObj && userObj.hasOwnProperty('raiseHand')) {
              var rhEnable = !!(userObj.raiseHand);
            } else {
              var rhEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], rhEnable, 'RaiseHand', 'RaiseHand');
          } else if (allSpans[i].className.indexOf('stdscreen') > -1) {
            if (virtualclass.gObj.studentSSstatus.hasOwnProperty('whoIsSharing')) {
              virtualclass.vutil.initssSharing(virtualclass.gObj.whoIsSharing);
            }
          } else if (allSpans[i].className.indexOf('editorRich') > -1 && virtualclass.currApp == 'EditorRich') {
            var elem = document.querySelector('#alleditorRichContainerAnch');
            if (uObj && userObj.hasOwnProperty('editorRich')) {
              var edEnable = !!(userObj.editorRich);
            } else {
              var edEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], edEnable, 'editorRich', 'editorRich');
          } else if (allSpans[i].className.indexOf('editorCode') > -1) {
            if (uObj && userObj.hasOwnProperty('editorCode')) {
              var edcEnable = !!(userObj.editorCode);
            } else {
              var edcEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], edcEnable, 'editorCode', 'editorCode');
          }
        }
      },
    };
  };
  window.user = user;
}(window, document));
