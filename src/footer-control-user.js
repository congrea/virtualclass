// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window, document) {
  const user = function () {
    return {
      readyLeftBar(role, app) {
        if (roles.hasControls()) {
          if (!roles.isEducator()) {
            virtualclass.html.leftAppBar();
          }
          virtualclass.attachFunction();

          // if (app === 'Whiteboard') {
          //   const { vcan } = window.virtualclass.wb[virtualclass.gObj.currWb];
          //   window.virtualclass.wb[virtualclass.gObj.currWb].attachToolFunction(
          // virtualclass.gObj.commandToolsWrapperId[virtualclass.gObj.currWb], true, virtualclass.gObj.currWb);
          // }
          // This is already Check at above, no need here
          if (Object.prototype.hasOwnProperty.call(virtualclass, 'previrtualclass')) {
            virtualclass.vutil.makeActiveApp(`virtualclass${app}`, virtualclass.previrtualclass);
          } else {
            virtualclass.vutil.makeActiveApp(`virtualclass${app}`);
          }

          // if (app == 'Whiteboard') {
          // if (typeof virtualclass.wb === 'object') {
          //   virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasEnable();
          // }
        }
      },

      // TODO this function not in use
      teacherIsAlreadyExist() {
        const allExistedUser = document.getElementById('chat_div').getElementsByClassName('ui-memblist-usr');
        let role;
        for (let i = 0; i < allExistedUser.length; i++) {
          role = allExistedUser[i].getAttribute('data-role');
          if (role === 't' || role === 'e') {
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
      // TODO this function not in use
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

      // TODO this function not in use
      createControlDivs(controlCont, userId, controls) {
        const that = this;
        let currTeacher;
        let elems;
        let controller;
        let audBlock;
        let chatBlock;
        let audEnable;
        let chEnable;
        let editorBlockEnable;
        // let rhEnable;
        let editorBlock;
        // var userObj = localStorage.getItem(userId);
        let uObj = false;
        let userObj = localStorage.getItem(`virtualclass${userId}`);
        if (userObj != null) {
          uObj = true;
          userObj = JSON.parse(userObj);
          if (Object.prototype.hasOwnProperty.call(userObj, 'currTeacher')) {
            virtualclass.gObj[`${userId}currTeacher`] = {};
            if (userObj.currTeacher === true) {
              virtualclass.user.control.currTeacherAlready = true;
              currTeacher = true;
              virtualclass.gObj[`${userId}currTeacher`].ct = true;
            } else {
              virtualclass.gObj[`${userId}currTeacher`].ct = false;
            }
          }
        }


        const aRoleEnable = !roles.isEducator();
        const orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
        // const isUserTeacher = virtualclass.vutil.isUserTeacher(userId);
        // var this should be in normalize in function
        for (let i = 0; i < controls.length; i++) {
          if (controls[i] === 'assign' && orginalTeacher) {
            if (typeof currTeacher !== 'undefined') {
              this.createAssignControl(controlCont, userId, aRoleEnable, currTeacher);
            } else {
              this.createAssignControl(controlCont, userId, aRoleEnable);
            }
          } else if (controls[i] === 'audio') {
            elems = this.createControllerElement(userId, 'contrAud');
            controller = elems[0];
            audBlock = elems[1];
            controlCont.appendChild(controller);

            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'aud')) {
              audEnable = !!(userObj.aud);
            } else {
              audEnable = true;
            }

            virtualclass.user.control.changeAttribute(userId, audBlock, audEnable, 'audio', 'aud');

            if (orginalTeacher) {
              audBlock.addEventListener('click', () => {
                that.control.init.call(that, audBlock);
              });
            }

            if (roles.hasAdmin()) {
              if (audBlock.dataset.audioDisable === 'false') {
                const allAudAction = localStorage.getItem('allAudioAction');
                if (allAudAction != null && allAudAction === 'disable') {
                  audBlock.click();
                }
              }
            }
          } else if (controls[i] === 'chat') {
            elems = this.createControllerElement(userId, 'contrChat');
            controller = elems[0];
            chatBlock = elems[1];

            controlCont.appendChild(controller);

            if (orginalTeacher) {
              chatBlock.addEventListener('click', () => {
                that.control.init.call(that, chatBlock);
              });
            }

            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'chat')) {
              chEnable = !!(userObj.chat);
            } else {
              chEnable = true;
            }
            virtualclass.user.control.changeAttribute(userId, chatBlock, chEnable, 'chat', 'chat');
          } else if (controls[i] === 'editorRich' || (controls[i] === 'editorCode')) {
            if (roles.hasAdmin()) {
              if (uObj && Object.prototype.hasOwnProperty.call(userObj, controls[i])) {
                editorBlockEnable = !!(userObj[controls[i]]);
              } else {
                editorBlockEnable = false; // By default it would be false
              }

              elems = this.createControllerElement(userId, `contr${controls[i]}`);
              controller = elems[0];
              editorBlock = elems[1];
              controller.className += ` controller${controls[i]}`;

              controlCont.appendChild(controller);


              if (virtualclass.currApp !== virtualclass.vutil.capitalizeFirstLetter(controls[i])) {
                controller.style.display = 'none';
              }

              virtualclass.user.control.changeAttribute(userId,
                editorBlock, editorBlockEnable, controls[i], controls[i]);

              if (orginalTeacher) {
                editorBlock.addEventListener('click', that.closureEditor(that, editorBlock));
              }
            }
          } else if (controls[i] === 'RaiseHand') {
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'raiseHand')) {
              rhEnable = !!(userObj.raiseHand);
            } else {
              rhEnable = true;
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
          const getStringReadMode = virtualclass.lang.getString('readonlymode');
          const getStringWriteMode = virtualclass.lang.getString('writemode');
          const modeMessage = (writeMode) ? getStringWriteMode : getStringReadMode;
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

          if (editorType === 'EditorRich') {
            this.tooglDisplayEditorToolBar(writeMode);
          }
        },

        /**
         * Either enable or disable toolbar of Editor Rich Text
         * @param writeMode expects true or flase
         */
        tooglDisplayEditorToolBar(writeMode) {
          // this.editorStatus = writeMode;
          // console.log('====> editor Write mode ', writeMode);
          virtualclass.editorRich.editorStatus = writeMode;
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
        receivedEditorRich(msg) {
          let action;
          // If editor rich is enabled
          if (msg.status) {
            if (virtualclass.gObj.uid === msg.toUser) {
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
            // localStorage.setItem('editorRich', action);
          } else {
            // If editor rich is disabled
            if (virtualclass.gObj.uid === msg.toUser) {
              if (typeof virtualclass.editorRich.cm === 'object') {
                virtualclass.editorRich.cm.setOption('readOnly', 'nocursor');
                const inputImageUrl = document.querySelector('#virtualclassEditorRichBody #overlay');
                if (inputImageUrl) {
                  inputImageUrl.parentNode.removeChild(inputImageUrl);
                }

                const openDialogBox = document.querySelector('#virtualclassEditorRichBody .vceditor-toolbar .open');
                if (openDialogBox != null) {
                  openDialogBox.classList.remove('open');
                  openDialogBox.classList.add('close');
                }
              }
            } else {
              // TODO this should be optimized
              this.disable(msg.toUser, 'editorRich', 'editorRich', 'editorRich');
            }
            action = false;
            // localStorage.setItem('editorRich', action);
          }

          if (!roles.hasAdmin()) {
            this.toggleDisplayWriteModeMsgBox('EditorRich', action);
          }

          // if ((!roles.hasAdmin()) && virtualclass.system.mybrowser.name === 'iOS' && virtualclass.system.isIPad()) {
          //   if (msg.status) {
          //     virtualclass.editorRich.enableEditorByOuterLayer();
          //   } else {
          //     virtualclass.editorRich.disableEditorByOuterLayer();
          //   }
          // }
          // virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorRich');
        },

        /**
         * When enable and disable editor code by footer control
         * @param msg infomration about control
         */
        // TODO this function should be improved with received_editorRich
        receivedEditorCode(msg) {
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
            // localStorage.setItem('editorCode', action);
          } else {
            // If editor code is disabled
            if (virtualclass.gObj.uid === msg.toUser) {
              if (typeof virtualclass.editorCode.cm === 'object') {
                virtualclass.editorCode.cm.setOption('readOnly', 'nocursor');
              }
            } else {
              this.disable(msg.toUser, 'editorCode', 'editorCode', 'editorCode');
            }
            action = false;
            // localStorage.setItem('editorCode', action);
          }

          if (!roles.hasAdmin()) {
            this.toggleDisplayWriteModeMsgBox('EditorCode', action);
          }
          // if((roles.isStudent() || roles.isEducator())
          // && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()){
          // if ((!roles.hasAdmin()) && virtualclass.system.mybrowser.name == 'iOS' && virtualclass.system.isIPad()) {
          //   if (msg.status) {
          //     virtualclass.editorCode.enableEditorByOuterLayer();
          //   } else {
          //     virtualclass.editorCode.disableEditorByOuterLayer();
          //   }
          // }
          virtualclass.vutil.setReadModeWhenTeacherIsDisConn('editorCode');
        },

        onmessage(e) {
          if (!Object.prototype.hasOwnProperty.call(e.message, 'toUser')) {
            e.message.toUser = virtualclass.gObj.uid;
          }
          const capitalizeFirstLetter = virtualclass.vutil.capitalizeFirstLetter(e.message.control);
          this[`received${capitalizeFirstLetter}`](e.message);
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

        // disable(toUser, control, contIdPart, label) {
        //   const selector = `.${control}Control${toUser} ` + ' .contImg';
        //   const elem = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(selector);
        //   // var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
        //   if (elem == null) {
        //     return;
        //   }
        //   virtualclass.user.control._disable(elem, control, toUser, label);
        // },


        disable(elem, control, userId, label) {
          elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${control}Disable`));
          // elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "On"));
          elem.setAttribute(`data-${control}-disable`, 'true');

          elem.className = `icon-${control}Img block ${control}Img`;
          if (control === 'assign') { // TODO unused condition
            elem.parentNode.classList.remove('tooltip');
            this.addCurrTeacherToControl(elem.id);
            let userObj = localStorage.getItem(`virtualclass${userId}`);
            userObj = JSON.parse(userObj);

            if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, `${userId}currTeacher`)) {
              if (virtualclass.gObj[`${userId}currTeacher`].ct
                || (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'controlAssign')
                && virtualclass.gObj.controlAssign && userObj.currTeacher)) {
                virtualclass.user.control.updateUser(userId, 'currTeacher', true);
              }
            } else if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'controlAssign')
              && virtualclass.gObj.controlAssignId === userId) {
              virtualclass.user.control.updateUser(userId, 'currTeacher', true);
            }
          } else if (control === 'audio' || control === 'chat') {
            elem.className = `icon-${control}DisImg block ${control}DisImg`;
          }

          virtualclass.user.control.updateUser(userId, label, false);
        },


        // enable(toUser, control, contIdPart, label) {
        //   // var elem = document.getElementById(toUser + 'contr' + contIdPart + 'Img');
        //   const selector = `.${control}Control${toUser} .contImg`;
        //   const elem = virtualclass.gObj.testChatDiv.shadowRoot.querySelector(selector);
        //
        //   if (elem == null) {
        //     // console.log('Element is Null');
        //     return;
        //   }
        //   virtualclass.user.control._enable(elem, control, toUser, label);
        // },
        enable(elem, control, userId, label) {
          const getElem = elem;
          getElem.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${control}Enable`));
          // if (control == 'audio') {
          //     elem.parentNode.setAttribute('data-title', virtualclass.lang.getString(control + "Off"));
          // }
          getElem.setAttribute(`data-${control}-disable`, 'false');
          getElem.className = `icon-${control}Img enable ${control}Img`;
          // if (control === 'RaiseHand') {
          //   virtualclass.raiseHand._raiseHand(userId);
          // }
          virtualclass.user.control.updateUser(userId, label, true);
        },


        changeAttribute(userId, elem, elemEnable, control, label) {
          if (elemEnable) {
            virtualclass.user.control.enable(elem, control, userId, label);
          } else {
            virtualclass.user.control.disable(elem, control, userId, label);
          }
        },

        init(tag, defaultAction, searchBy, actSend) {
          let searchByPos = searchBy;
          if (typeof searchBy !== 'undefined') {
            searchByPos = searchBy;
          } else {
            searchByPos = 'Img';
          }
          const compId = tag.id;
          const ep = compId.indexOf('contr');
          const userId = compId.substring(0, ep);
          const restString = compId.split('contr')[1];
          const imgPos = restString.indexOf(searchByPos);

          const control = restString.substring(0, imgPos);
          // TODO this function should be generalise
          if (control === 'Assign') { // TODO unused
            // this condition only true when the app is not quiz, poll, docs, and video
            if (virtualclass.vutil.appIsForEducator(virtualclass.currApp)) {
              virtualclass.gObj.controlAssign = true;
              virtualclass.gObj.controlAssignId = userId;
              const assignDisable = (tag.getAttribute('data-assign-disable') === 'true');
              if (!assignDisable) {
                this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
                // virtualclass.user.control._assign(userId);
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
            if (control === 'stdscreen') {
              // if teacher share his screen
              if (roles.hasControls() && virtualclass.previous === 'virtualclassScreenShare') {
                virtualclass.vutil.initDefaultApp();
              }
              ctrType = 'stdscreen';
              this.control[`${ctrType}`].call(this.control, userId);
              if (virtualclass.currApp === 'Video' && virtualclass.videoUl.player) {
                ioAdapter.mustSend({ videoUl: { init: 'destroyPlayer' }, cf: 'destroyPlayer' });
                ioAdapter.mustSend({ videoUl: { init: 'studentlayout' }, cf: 'videoUl' });
                virtualclass.dashboard.init();
                virtualclass.vutil.removeBackgroundVideoApp();
              }
            } else {
              if (control === 'Chat') {
                tag.className = 'contrChatBlock';
                ctrType = 'chat';
              } else if (control === 'Aud') {
                ctrType = 'audio';
              } else {
                ctrType = control;
              }

              if (typeof defaultAction !== 'undefined') {
                boolVal = (defaultAction === 'enable');

                action = (boolVal) ? 'enable' : 'block';
              } else if (tag.getAttribute(`data-${ctrType}-disable`) === 'true') {
                action = 'enable';
                boolVal = true;
              } else {
                action = 'block';
                boolVal = false;
              }
              const controlType = virtualclass.vutil.smallizeFirstLetter(control);
              this.control.changeAttribute(userId, tag, boolVal, ctrType, controlType);
              if (actSend == null) {
                this.control[`${ctrType}`].call(this.control, userId, action);
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
          let action;
          // TODO this function should be generalise
          if (control === 'Assign') {
            virtualclass.gObj.controlAssign = true;
            virtualclass.gObj.controlAssignId = userId;
            const assignDisable = (tag.getAttribute('data-assign-disable') === 'true');
            if (!assignDisable) {
              this.control.changeAttribute(userId, tag, assignDisable, 'assign', 'aRole');
              // virtualclass.user.control._assign(userId);
              virtualclass.user.control.changeAttrToAssign('block');
            }

            if (!roles.hasAdmin()) {
              virtualclass.user.control.removeAudioFromParticipate(userId);
            }
          } else if (control === 'Chat') {
            if (tag.getAttribute('data-chat-disable') === 'true') {
              tag.className = 'contrChatBlock';
              action = 'enable';
              this.control.changeAttribute(userId, tag, true, 'chat', 'chat');
            } else {
              action = 'block';
              this.control.changeAttribute(userId, tag, false, 'chat', 'chat');
            }
            this.control._chat(userId, action);
          } else if (control === 'Aud') {
            if (tag.getAttribute('data-audio-disable') === 'true') {
              action = 'enable';
              this.control.changeAttribute(userId, tag, true, 'audio', 'aud');
            } else {
              action = 'block';
              this.control.changeAttribute(userId, tag, false, 'audio', 'aud');
            }
            this.control._audio(userId, action);
          }
        },

        // _assign(userId, notsent, fromUserId) {
        //
        // },


        chat(userId, action) {
          if (action === 'enable') {
            virtualclass.settings.applySettings(true, 'studentpc', userId);
          } else {
            // const user = virtualclass.user.control.updateUser(userId, 'chat', false);
            virtualclass.settings.applySettings(false, 'studentpc', userId);
          }
        },

        _audioAll(userId, action) {
          if (action === 'enable') {
            virtualclass.vutil.beforeSend({ ena: true, toUser: userId, cf: 'ena' }, userId);
          } else {
            virtualclass.vutil.beforeSend({ dia: true, toUser: userId, cf: 'dia' }, userId);
          }
        },

        editorRich(userId, action) {
          if (action === 'enable') {
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


        editorCode(userId, action) {
          if (action === 'enable') {
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

        audio(userId, action) {
          if (action === 'enable') {
            // virtualclass.vutil.beforeSend({'ena': true, toUser: userId, 'cf': 'ena'}, userId);
            virtualclass.settings.applySettings(true, 'studentaudio', userId);
          } else {
            // virtualclass.vutil.beforeSend({'dia': true, toUser: userId, 'cf': 'dia'}, userId);
            virtualclass.settings.applySettings(false, 'studentaudio', userId);
          }
        },
        RaiseHand(userId) {
          // to disable only ..
          virtualclass.raiseHand.raisehand(userId);
        },

        stdscreen(userId) {
          if (virtualclass.gObj.prvRequestScreenUser && (virtualclass.gObj.prvRequestScreenUser !== userId)
            && virtualclass.config.makeWebSocketReady) {
            ioAdapter.mustSendUser({ cancel: true, cf: 'reqscreen' }, virtualclass.gObj.prvRequestScreenUser);
            virtualclass.vutil.setScreenShareDefualtColor();
          }
          const currElem = chatContainerEvent.elementFromShadowDom(`#ml${userId} .icon-stdscreenImg`);
          if (currElem !== null) {
            currElem.setAttribute('data-dcolor', 'blue');
            currElem.parentNode.setAttribute('data-title', virtualclass.lang.getString('requestedScreenShare'));
          }

          virtualclass.vutil.beforeSend({ reqscreen: true, toUser: userId, cf: 'reqscreen' }, userId);
          virtualclass.gObj.prvRequestScreenUser = userId;

          if (virtualclass.currApp === 'Video' && virtualclass.videoUl != null) {
            ioAdapter.mustSend({ videoUl: { init: 'destroyPlayer' }, cf: 'destroyPlayer' });
            virtualclass.videoUl.destroyPlayer();
          }
        },

        audioWidgetEnable(notActive) {
          // console.log('Audio enable true');
          // localStorage.setItem('audEnable', JSON.stringify({ ac: 'true' }));
          if (localStorage.getItem('dvid') == null) {
            const studentSpeaker = document.getElementById('speakerPressOnce');
            if (studentSpeaker !== null) {
              if (typeof notActive === 'undefined') {
                studentSpeaker.className = 'active';
              }
              studentSpeaker.style.opacity = '1';
              studentSpeaker.style.pointerEvents = 'visible';
            }
          }
        },

        // move into media.js
        mediaWidgetDisable(reason) {
          virtualclass.system.mediaDevices.hasWebcam = false;
          const ad = { ac: 'false' };

          let aud = localStorage.getItem('audEnable');
          if (aud != null) {
            aud = JSON.parse(aud);
            if (aud.ac !== 'false' && typeof reason !== 'undefined') {
              ad.r = reason;
            }
          } else if (typeof reason !== 'undefined') {
            ad.r = reason;
          }

          // console.log(`audEnable ${ad}`);
          // localStorage.setItem('audEnable', JSON.stringify(ad));

          const studentSpeaker = document.getElementById('audioWidget');
          studentSpeaker.style.opacity = '1';
          studentSpeaker.style.pointerEvents = 'visible';
          studentSpeaker.className = 'deactive';
          this.audioDisable();
          this.videoDisable();

          // var alwaysPressElem = document.getElementById('speakerPressing');
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'video')) {
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

        disableCommonChat() {
          const div = document.getElementById('chatrm');
          if (div != null) {
            this.makeElemDisable(div);
            div.classList.add('chat_disable');
          }
          const chatInput = document.querySelector('#virtualclassCont.congrea #ta_chrm2');
          if (chatInput) {
            chatInput.classList.add('disable');
            chatInput.disabled = true;
          }
        },
        disbaleAllChatBox() {
          document.querySelector('#chat_div').classList.add('chat_disabled');
          const allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
          for (let i = 0; i < allChatBoxes.length; i++) {
            this.makeElemDisable(allChatBoxes[i]);
          }
        },

        makeElemDisable(elem) {
          if (elem.id !== 'chatrm') {
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
        allChatEnable(act) {
          if (act === 'pc') {
            document.querySelector('#chat_div').classList.remove('chat_disabled');
            const allChatBoxes = document.getElementById('stickybar').getElementsByClassName('ui-chatbox');
            for (let i = 0; i < allChatBoxes.length; i++) {
              this.makeElemEnable(allChatBoxes[i]);
            }
          } else if (act === 'gc') {
            const div = document.getElementById('chatrm');
            if (div != null) {
              // virtualclass.user.control.makeElemEnable(div);
              div.classList.remove('chat_disable');
            }
            const chatInput = document.querySelector('#virtualclassCont.congrea #ta_chrm2');
            if (chatInput) {
              chatInput.classList.remove('disable');
              chatInput.disabled = false;
            }
          }

          const chatrm = document.querySelector('#virtualclassCont #chatrm.enable');
          const chatroomTab = document.querySelector('#chatroom_bt2');

          if (chatrm) {
            if (!chatroomTab.classList.contains('active')) {
              chatroomTab.classList.add('active');
            }
            virtualclass.chat.chatWindow = 'common';
          }
        },

        resetmediaSetting() { // if mute all contains enable
          // todo need to configure meeting,
          // The functionality should same as normal mode
          if (roles.isStudent()) {
            // if (virtualclass.settings.info.studentaudio === false) {
            //   virtualclass.user.control.audioDisable();
            // } else {
            //   // TODO check if need to audio enable
            // }
            virtualclass.settings.userAudioIcon();

            if (virtualclass.system.mediaDevices.hasWebcam) {
              /* stdvideoEnable means it's click able for ON,
               *  and user need cick that button to share the video
               * */
              // if (virtualclass.videoHost) {
              //   if (virtualclass.gObj.stdvideoEnable) {
              //     virtualclass.vutil.videoHandler('off');
              //     virtualclass.videoHost.toggleVideoMsg('enable');
              //   } else {
              //     virtualclass.videoHost.toggleVideoMsg('disable');
              //     const vidIcon = document.querySelector('#videoSwitch');
              //     // TODO try to remove the section vidIcon.classList.contains("on")
              //     if (vidIcon != null && vidIcon.classList.contains('on')) {
              //       vidIcon.classList.remove('on');
              //       vidIcon.classList.add('off');
              //     }
              //   }
              // }
              virtualclass.settings.userVideoIcon();
            }
          } else {
            const mutebtn = document.getElementById('contrAudioAllImg');

            if (mutebtn && mutebtn.classList.contains('icon-all-audio-enable')) {
              mutebtn.classList.remove('icon-all-audio-enable');
              mutebtn.classList.add('icon-all-audio-disable');
              mutebtn.setAttribute('data-title', virtualclass.lang.getString('muteAll'));
              if (mutebtn.dataset.action === 'enable') {
                mutebtn.dataset.action = 'disable';
              }
            }

            const vidbtn = document.getElementById('videoSwitch');
            if (vidbtn != null && virtualclass.system.mediaDevices.hasWebcam && vidbtn.classList.contains('video')) {
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
          const lable = (type === 'audio') ? 'Audio' : 'Video';
          const stdaudEnable = virtualclass.gObj.stdaudioEnable;
          const stdvidEnable = virtualclass.gObj.stdvideoEnable;
          const defaultMediaSetting = (type === 'audio') ? stdaudEnable : stdvidEnable;
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
            const dataTitleString = virtualclass.lang.getString(`${allAction[allAction.action]}All${lable}`);
            mediaIcon.setAttribute('data-title', dataTitleString);
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

          if (action === 'enable') {
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
          const editorType = virtualclass.vutil.smallizeFirstLetter(editor);
          // var allEditorController = document.getElementsByClassName('controller' + editor);
          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'testChatDiv')) {
            const allEditorController = chatContainerEvent.elementFromShadowDom(`.controller${editorType}`, 'all');
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
          if (action === 'create') {
            if (document.getElementById(`${user.id}AudEnableSign`) == null) {
              // important
              const audEnableSign = document.createElement('div');
              audEnableSign.id = `${user.id}AudEnableSign`;
              const audEnableImg = document.createElement('img');
              const imgName = 'audioenable';
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
          if (action === 'create') {
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
              if (audioImg.classList[i].substring(0, 5) === 'icon-') {
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
            if (action === 'enable') {
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
      toggleAllUserListIcon(action, type) {
        let actType;
        if (type === 'audio') {
          actType = 'Aud';
        } else {
          actType = 'Chat';
        }
        const allUsersDom = chatContainerEvent.elementFromShadowDom('.controleCont', 'all');
        // var allUsersDom = document.getElementsByClassName('controleCont');
        if (allUsersDom.length > 0) {
          for (let i = 0; i < allUsersDom.length; i++) {
            if (allUsersDom[i].id.indexOf(actType) > 0) {
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
        let action;
        let getMediaAction;
        const lable = virtualclass.vutil.capitalizeFirstLetter(type);
        let spanTag = document.querySelector(`.bulkUserActions #contr${lable}AllImg`);
        if (type === 'chat') {
          action = 'pc';
        } else if (type === 'groupChat') {
          action = 'gc';
        } else if (type === 'audio' || type === 'video') {
          action = type;
        }

        if (type === 'askQuestion' || type === 'userlist' || type === 'qaMarkNotes') {
          getMediaAction = virtualclass.settings.info[type];
        } else {
          getMediaAction = virtualclass.settings.info[`student${action}`];
        }
        const input = document.querySelector(`.bulkUserActions #contr${lable}All input`);
        const cont = document.querySelector(`.congrea #contr${lable}All`);
        const localAction = (getMediaAction === true) ? 'disable' : 'enable';
        if (getMediaAction !== null) {
          spanTag.setAttribute('data-action', localAction);
          spanTag.className = `slider round icon-all-${type}-${localAction} enable congtooltip cgIcon`;
          spanTag.dataset.title = virtualclass.lang.getString(`${localAction}All${lable}`);
          input.setAttribute('checked', 'true');
          cont.classList.add(localAction);
        } else {
          const allAction = {
            action: getMediaAction ? 'enable' : 'disable',
            enable: 'disable',
            disable: 'enable',
          };
          spanTag = document.querySelector(`.bulkUserActions #contr${lable}AllImg`);
          spanTag.setAttribute('data-action', allAction[allAction.action]);
          spanTag.className = `slider round icon-all-${type}-${allAction[allAction.action]} congtooltip cgIcon`;
          spanTag.dataset.title = virtualclass.lang.getString(`${allAction[allAction.action]}All${lable}`);
          input.removeAttribute('checked');
          cont.classList.add(allAction[allAction.action]);
        }

        if (virtualclass.isPlayMode) {
          // anchorTag.pointerEvents = 'none';
          // anchorTag.style.cursor = 'default';
        } else {
          const that = this;
          spanTag.addEventListener('click', () => {
            // const setLable = virtualclass.vutil.capitalizeFirstLetter(type);
            const actionToPerform = that.toogleIcon(type);
            const act = (actionToPerform === 'enable');
            let typeSend;
            if (type === 'chat') {
              typeSend = 'pc';
            } else if (type === 'groupChat') {
              typeSend = 'gc';
            } else if (type === 'askQuestion' || type === 'userlist' || type === 'qaMarkNotes') {
              virtualclass.settings.applySettings(act, type);
            } else {
              typeSend = type;
            }
            if (type !== 'raisehand' || type !== 'userlist') {
              virtualclass.settings.applySettings(act, `student${typeSend}`);
            }

            if (typeof actionToPerform !== 'undefined') {
              // localStorage.setItem(`all${setLable}Action`, actionToPerform);
              // if (type === 'video') {
              //   that.toggleAllVideo.call(virtualclass.user, actionToPerform, type);
              // } else
              if (type === 'audio' || type === 'chat') {
                that.toggleAllUserListIcon.call(virtualclass.user, actionToPerform, type);
              }
            }
          });
        }
      },

      chatBoxesSwitch() {
        // debugger;
        if (virtualclass.chat.chatroombox) {
          toggleCommonChatBox();
        } else if ($('div#chat_room').length === 0) {
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

          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'chatEnable')) {
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

      toogleIcon(type) {
        const lable = virtualclass.vutil.capitalizeFirstLetter(type);
        const Controller = document.querySelector(`.bulkUserActions #contr${lable}AllImg`);
        if (Controller != null) {
          const actionToPerform = Controller.dataset.action;
          if (Controller.dataset.action === 'enable') {
            Controller.dataset.action = 'disable';
            Controller.className = `slider round icon-all-${type}-disable congtooltip`;
            Controller.dataset.title = virtualclass.lang.getString(`disableAll${lable}`);
            const cont = document.querySelector(`.congrea .bulkUserActions #contr${lable}All`);
            cont.classList.add('disable');
            cont.classList.remove('enable');
          } else {
            Controller.dataset.action = 'enable';
            Controller.className = `slider round icon-all-${type}-enable congtooltip`;
            Controller.dataset.title = virtualclass.lang.getString(`enableAll${lable}`);
            const cont = document.querySelector(`.congrea .bulkUserActions #contr${lable}All`);
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
        // const orginalTeacher = virtualclass.vutil.userIsOrginalTeacher(userId);
        // Assign event handler
        // const that = this;

        // shadow dom
        let edcEnable;
        let edEnable;
        let rhEnable;
        const allSpans = chatContainerEvent.elementFromShadowDom(`#ml${userId} .contImg`, 'all');

        let uObj = false;
        let userObj = localStorage.getItem(`virtualclass${userId}`);
        if (userObj != null) {
          uObj = true;
          userObj = JSON.parse(userObj);
          if (Object.prototype.hasOwnProperty.call(userObj, 'currTeacher')) {
            virtualclass.gObj[`${userId}currTeacher`] = {};
            if (userObj.currTeacher === true) {
              virtualclass.user.control.currTeacherAlready = true;
              // const currTeacher = true;
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
            let chEnable;
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'chat')) {
              if (Object.prototype.hasOwnProperty.call(virtualclass.settings.user, userId)) {
                const userSettings = virtualclass.settings.parseSettings(virtualclass.settings.user[userId]);
                chEnable = userSettings.studentpc;
              } else {
                chEnable = virtualclass.settings.info.studentpc;
              }
            } else {
              chEnable = virtualclass.settings.info.studentpc;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], chEnable, 'chat', 'chat');
          } else if (allSpans[i].className.indexOf('aud') > -1) {
            let audEnable;
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'aud')) {
              if (Object.prototype.hasOwnProperty.call(virtualclass.settings.user, userId)) {
                const userSettings = virtualclass.settings.parseSettings(virtualclass.settings.user[userId]);
                audEnable = userSettings.studentaudio;
              } else {
                audEnable = virtualclass.settings.info.studentaudio;
              }
            } else {
              const elem = document.querySelector('#contrAudioAll');
              if (virtualclass.jId != null && elem.classList.contains('disable')) {
                audEnable = virtualclass.settings.info.studentaudio;
              } else {
                audEnable = virtualclass.settings.info.studentaudio; // default value for userlist mic enable or disable
              }
            }

            virtualclass.user.control.changeAttribute(userId, allSpans[i], audEnable, 'audio', 'aud');

            // if (orginalTeacher) {
            //     allSpans[i].addEventListener('click', function () {
            //         that.control.init.call(that, allSpans[i]);
            //     });
            // }

            if (roles.hasAdmin()) {
              if (allSpans[i].dataset.audioDisable === 'false') {
                const allAudAction = localStorage.getItem('allAudioAction');
                if (allAudAction != null && allAudAction === 'disable') {
                  // allSpans[i].click();
                }
              }
            }
          } else if (allSpans[i].className.indexOf('RaiseHand') > -1) {
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'raiseHand')) {
              rhEnable = !!(userObj.raiseHand);
            } else {
              rhEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], rhEnable, 'RaiseHand', 'RaiseHand');
          } else if (allSpans[i].className.indexOf('stdscreen') > -1) {
            if (Object.prototype.hasOwnProperty.call(virtualclass.gObj.studentSSstatus, 'whoIsSharing')) {
              virtualclass.vutil.initssSharing(virtualclass.gObj.whoIsSharing);
            }
          } else if (allSpans[i].className.indexOf('editorRich') > -1 && virtualclass.currApp === 'EditorRich') {
            // const elem = document.querySelector('#alleditorRichContainerAnch');
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'editorRich')) {
              edEnable = !!(userObj.editorRich);
            } else {
              edEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], edEnable, 'editorRich', 'editorRich');
          } else if (allSpans[i].className.indexOf('editorCode') > -1) {
            if (uObj && Object.prototype.hasOwnProperty.call(userObj, 'editorCode')) {
              edcEnable = !!(userObj.editorCode);
            } else {
              edcEnable = false;
            }
            virtualclass.user.control.changeAttribute(userId, allSpans[i], edcEnable, 'editorCode', 'editorCode');
          }
        }
      },
    };
  };
  window.user = user;
}(window, document));
