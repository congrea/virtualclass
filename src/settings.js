(function (window) {
  const settings = {
    info: {},
    user: {},
    currentTime: 0,
    init() { // default settings applyed from here
      const coreSettings = virtualclassSetting.settings;
      virtualclass.settings.info = virtualclass.settings.parseSettings(coreSettings);
      const userSetting = localStorage.getItem('userSettings');
      if (userSetting) {
        console.log('setting ', userSetting);
        virtualclass.settings.user = JSON.parse(userSetting);
      }
      this.recording.init();
      // virtualclass.settings.info.trimRecordings = true;
    },

    triggerSettings() {
      this.qaMarkNotes(virtualclass.settings.info.qaMarkNotes);
      this.askQuestion(virtualclass.settings.info.askQuestion);
      this.qaAnswer(virtualclass.settings.info.qaAnswer);
      this.qaComment(virtualclass.settings.info.qaComment);
      this.qaUpvote(virtualclass.settings.info.qaUpvote);
    },

    // settings object values assign to array for get a hax code
    settingsToHex(s) {
      const localSettings = [];
      localSettings[0] = +s.allowoverride;
      localSettings[1] = +s.studentaudio;
      localSettings[2] = +s.studentvideo;
      localSettings[3] = +s.studentpc;
      localSettings[4] = +s.studentgc;
      localSettings[5] = +s.askQuestion;
      localSettings[6] = +s.userlist;
      localSettings[7] = +s.enableRecording;
      localSettings[8] = +s.recAllowpresentorAVcontrol;
      localSettings[9] = +s.recShowPresentorRecordingStatus;
      localSettings[10] = +s.attendeeAV;
      localSettings[11] = +s.recallowattendeeAVcontrol;
      localSettings[12] = +s.showAttendeeRecordingStatus;
      localSettings[13] = +s.trimRecordings;
      localSettings[14] = +s.attendeerecording;
      localSettings[15] = +s.qaMarkNotes;
      localSettings[16] = +s.qaAnswer;
      localSettings[17] = +s.qaComment;
      localSettings[18] = +s.qaUpvote;
      localSettings[19] = +s.upcomingSetting;
      return virtualclass.settings.binaryToHex(localSettings.join(''));
    },

    // return data into true, false
    // student side
    parseSettings(s) {
      // console.log('====> Settings parse');
      const parsedSettings = {};
      let localSettings = virtualclass.settings.hexToBinary(s);
      localSettings = localSettings.split('');
      parsedSettings.allowoverride = !!+localSettings[0];
      parsedSettings.studentaudio = !!+localSettings[1];
      parsedSettings.studentvideo = !!+localSettings[2];
      parsedSettings.studentpc = !!+localSettings[3];
      parsedSettings.studentgc = !!+localSettings[4];
      parsedSettings.askQuestion = !!+localSettings[5];
      parsedSettings.userlist = !!+localSettings[6];
      parsedSettings.enableRecording = !!+localSettings[7];
      parsedSettings.recAllowpresentorAVcontrol = !!+localSettings[8];
      parsedSettings.recShowPresentorRecordingStatus = !!+localSettings[9];
      parsedSettings.attendeeAV = !!+localSettings[10];
      parsedSettings.recallowattendeeAVcontrol = !!+localSettings[11];
      parsedSettings.showAttendeeRecordingStatus = !!+localSettings[12];
      parsedSettings.trimRecordings = !!+localSettings[13];
      parsedSettings.attendeerecording = !!+localSettings[14];
      parsedSettings.qaMarkNotes = !!+localSettings[15];
      parsedSettings.qaAnswer = !!+localSettings[16];
      parsedSettings.qaComment = !!+localSettings[17];
      parsedSettings.qaUpvote = !!+localSettings[18];
      parsedSettings.upcomingSetting = !!+localSettings[19];
      return parsedSettings;
    },

    // Hex convert into binary
    hexToBinary(s) {
      let i;
      let ret = '';
      // lookup table for easier conversion. '0' characters are padded for '1' to '7'
      const lookupTable = {
        0: '0000',
        1: '0001',
        2: '0010',
        3: '0011',
        4: '0100',
        5: '0101',
        6: '0110',
        7: '0111',
        8: '1000',
        9: '1001',
        a: '1010',
        b: '1011',
        c: '1100',
        d: '1101',
        e: '1110',
        f: '1111',
        A: '1010',
        B: '1011',
        C: '1100',
        D: '1101',
        E: '1110',
        F: '1111',
      };
      for (i = 0; i < s.length; i += 1) {
        if (Object.prototype.hasOwnProperty.call(lookupTable, s[i])) {
          ret += lookupTable[s[i]];
        } else {
          return false;
        }
      }
      return ret;
    },

    // convert binary into Hex
    binaryToHex(s) {
      let i; let k; let part; let accum; let ret = '';
      for (i = s.length - 1; i >= 3; i -= 4) {
        // extract out in substrings of 4 and convert to hex
        part = s.substr(i + 1 - 4, 4);
        accum = 0;
        for (k = 0; k < 4; k += 1) {
          if (part[k] !== '0' && part[k] !== '1') {
            // invalid character
            return false;
          }
          // compute the length 4 substring
          accum = accum * 2 + parseInt(part[k], 10);
        }
        if (accum >= 10) {
          // 'A' to 'F'
          ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
        } else {
          // '0' to '9'
          ret = String(accum) + ret;
        }
      }
      // remaining characters, i = 0, 1, or 2
      if (i >= 0) {
        accum = 0;
        // convert from front
        for (k = 0; k <= i; k += 1) {
          if (s[k] !== '0' && s[k] !== '1') {
            return false;
          }
          accum = accum * 2 + parseInt(s[k], 10);
        }
        // 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
        ret = String(accum) + ret;
      }
      return ret;
    },

    // Object's properties value true or false into binary
    applySettings(value, settingName, userId) {
      if (roles.hasControls()) {
        if ((value === true || value === false)
          && Object.prototype.hasOwnProperty.call(virtualclass.settings.info, settingName)) {
          if (typeof userId === 'undefined') {
            virtualclass.settings.applyPresentorGlobalSetting(value, settingName);
            if (settingName === 'askQuestion' || settingName === 'qaMarkNotes') {
              this.triggerSettings(value);
            }
            // virtualclass.setPrvUser();
          } else {
            virtualclass.settings.applySpecificAttendeeSetting(value, settingName, userId);
          }
          return true;
        }
        return false;
      }
    },

    applyPresentorGlobalSetting(value, settingName) {
      localStorage.removeItem('userSettings');
      virtualclass.settings.info[settingName] = value;
      const str = virtualclass.settings.settingsToHex(virtualclass.settings.info);
      ioAdapter.mustSend({ cf: 'settings', Hex: str, time: Date.now() });
      virtualclassSetting.settings = str;
      // console.log('====> Settings ', str);
      for (const propname in virtualclass.settings.user) {
        virtualclass.user.control.changeAttribute(propname,
          virtualclass.gObj.testChatDiv.shadowRoot.getElementById(`${propname}contrAudImg`),
          virtualclass.settings.info.studentaudio, 'audio', 'aud');
        virtualclass.user.control.changeAttribute(propname,
          virtualclass.gObj.testChatDiv.shadowRoot.getElementById(`${propname}contrChatImg`),
          virtualclass.settings.info.studentpc, 'chat', 'chat');
      }
      virtualclass.settings.user = {};
    },

    applySpecificAttendeeSetting(value, settingName, userId) {
      let specificSettings;
      if (Object.prototype.hasOwnProperty.call(virtualclass.settings.user, userId)) {
        const user = virtualclass.settings.user[userId];
        const setting = virtualclass.settings.parseSettings(user);
        setting[settingName] = value;
        specificSettings = virtualclass.settings.settingsToHex(setting);
      } else {
        const individualSetting = {};
        for (const propname in virtualclass.settings.info) {
          individualSetting[propname] = virtualclass.settings.info[propname];
        }
        individualSetting[settingName] = value;
        specificSettings = virtualclass.settings.settingsToHex(individualSetting);
      }
      ioAdapter.mustSendUser({ cf: 'settings', Hex: specificSettings, toUser: userId, time: Date.now() }, userId);
      virtualclass.settings.user[userId] = specificSettings;
      localStorage.setItem('userSettings', JSON.stringify(virtualclass.settings.user));
    },

    applyAttendeeSetting(obj) {
      // console.log('my setting change ', JSON.stringify(obj));
      const rec = ['enableRecording', 'recAllowpresentorAVcontrol', 'recShowPresentorRecordingStatus', 'attendeeAV',
        'recallowattendeeAVcontrol', 'showAttendeeRecordingStatus', 'attendeerecording'];
      for (const propname in obj) {
        if (virtualclass.settings.info[propname] !== obj[propname]) {
          if (virtualclass.isPlayMode) {
            if (propname !== 'qaMarkNotes' && propname !== 'askQuestion' && propname !== 'qaAnswer'
              && propname !== 'qaUpvote' && propname !== 'qaComment') {
              virtualclass.settings.info[propname] = obj[propname];
            }
          } else {
            virtualclass.settings.info[propname] = obj[propname];
          }

          if (propname !== 'trimRecordings') { // avoid trim recordings
            const recSettings = rec.indexOf(propname);
            const value = (recSettings !== -1) ? obj : obj[propname];
            if (virtualclass.isPlayMode) {
              if (propname !== 'qaMarkNotes' && propname !== 'askQuestion' && propname !== 'qaAnswer'
                && propname !== 'qaUpvote' && propname !== 'qaComment') {
                virtualclass.settings[propname](value);
              }
            } else {
              virtualclass.settings[propname](value);
            }
          }
        }
      }
    },

    // Apply settings on student side
    onMessage(msg, userId) {
      if (roles.hasControls()) {
        if (typeof msg === 'string' && userId == null) {
          if (!virtualclass.gObj.refreshSession) {
            virtualclass.settings.info = virtualclass.settings.parseSettings(msg);
          }
          delete virtualclass.gObj.refreshSession;
          // virtualclass.settings.info = virtualclass.settings.parseSettings(msg);
        }
      } else {
        if (typeof msg === 'string') {
          if (roles.isStudent()) {
            // console.log('====> Settings received ', msg);
            const stdSettings = virtualclass.settings.parseSettings(msg);
            this.applyAttendeeSetting(stdSettings);
          }
        } else {
          this.recording.triggerSetting(msg);
        }
      }
    },

    // Mute or Unmute all student audio or particular student mute or unmute
    studentaudio(value) {
      if (roles.isStudent()) {
        if (value === true) {
          virtualclass.user.control.audioWidgetEnable(true);
          virtualclass.gObj.audioEnable = true;
        } else if (value === false) {
          const speakerPressOnce = document.querySelector('#speakerPressOnce');
          if (speakerPressOnce.dataset.audioPlaying === true || speakerPressOnce.dataset.audioPlaying === 'true') {
            virtualclass.media.audio.clickOnceSpeaker('speakerPressOnce');
          }
          virtualclass.user.control.audioDisable();
          virtualclass.gObj.audioEnable = false;
        }
      }
    },

    allowoverride() {
      // console.log('TO DO');
    },

    studentpc(value) { // student chat enable/disable
      if (roles.isStudent()) {
        if (value === true) {
          virtualclass.user.control.allChatEnable('pc');
        } else if (value === false) {
          virtualclass.user.control.disbaleAllChatBox();
        }
      }
    },

    studentgc(value) { // student group chat enable/disable
      if (roles.isStudent()) {
        if (value === true) {
          virtualclass.user.control.allChatEnable('gc');
        } else {
          virtualclass.user.control.disableCommonChat();
        }
      }
    },

    studentvideo(value) { // All student video enable, disable
      if (roles.isStudent()) {
        const sw = document.querySelector('.videoSwitchCont #videoSwitch');
        if (sw.classList.contains('off') && value === false) {
          // console.log('do nothing');
        } else if (sw.classList.contains('on') && value === true) {
          // console.log('do nothing');
        } else if (sw.classList.contains('on') && value === false) {
          virtualclass.vutil.videoHandler('off');
        }
        const action = (value === false) ? 'disable' : 'enable';
        virtualclass.videoHost.toggleVideoMsg(action);
      }
    },

    askQuestion(value) {
      const askQuestion = document.querySelector('#congAskQuestion');
      const rightSubContainer = document.getElementById('virtualclassAppRightPanel');
      if (value === true) {
        askQuestion.classList.remove('askQuestionDisable');
        askQuestion.classList.add('askQuestionEnable');
        rightSubContainer.dataset.askQuestion = 'askQuestionEnable';
      } else {
        // document.querySelector('#user_list').click();
        askQuestion.classList.remove('askQuestionEnable');
        askQuestion.classList.add('askQuestionDisable');
        rightSubContainer.dataset.askQuestion = 'askQuestionDisable';
      }
    },

    userlist(value) {
      if (roles.isStudent()) {
        const userList = document.querySelector('#memlist');
        if (userList !== null) {
          const searchUserInput = document.querySelector('#congchatBarInput #congreaUserSearch');
          const vmlist = document.querySelector('#user_list.vmchat_bar_button');
          // const askQuestionElem = document.querySelector('#congAskQuestion');
          // const notesElem = document.querySelector('#virtualclassnote');
          if (value === true) {
            userList.classList.remove('hideList');
            searchUserInput.classList.remove('hideInput');
            vmlist.classList.remove('disable');
          } else {
            userList.classList.add('hideList');
            searchUserInput.classList.add('hideInput');
            vmlist.classList.add('disable');
            // TODO remove commented code
            // if (!askQuestionElem.classList.contains('active') && !notesElem.classList.contains('active')) {
            //   const vmchat = document.querySelector('.vmchat_room_bt .inner_bt');
            //   vmchat.click();
            // }
            handleCommonChat();
          }
        }
      }
    },

    attendeerecording(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    enableRecording(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    recAllowpresentorAVcontrol(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    recShowPresentorRecordingStatus(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    attendeeAV(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    recallowattendeeAVcontrol(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    showAttendeeRecordingStatus(obj) {
      virtualclass.settings.recordingSettings(obj);
    },

    qaMarkNotes(value) {
      // TODO handle on default settings
      const notesElem = document.querySelector('#virtualclassnote');
      const rightSubContainer = document.getElementById('virtualclassAppRightPanel');
      const bookmarkElem = document.querySelector('#bookmark');
      if (value === true) {
        notesElem.classList.remove('notesDisable');
        notesElem.classList.add('notesEnable');
        bookmarkElem.classList.remove('bookmarkDisable');
        bookmarkElem.classList.add('bookmarkEnable');
        rightSubContainer.dataset.qaNote = 'enable';
      } else {
        notesElem.classList.remove('notesEnable');
        notesElem.classList.add('notesDisable');
        bookmarkElem.classList.remove('bookmarkEnable');
        bookmarkElem.classList.add('bookmarkDisable');
        rightSubContainer.dataset.qaNote = 'disbale';
      }
    },

    qaAnswer(value) {
      if (!virtualclass.vutil.checkUserRole()) {
        console.log('setting comp qA ', value);
        const controlsElem = document.querySelector('#askQuestion');
        if (controlsElem) {
          if (value === true) {
            document.querySelector('#askQuestion').dataset.answer = 'enable';
          } else if (value === false) {
            document.querySelector('#askQuestion').dataset.answer = 'disable';
          }
        }
      }
    },

    qaComment(value) {
      if (!virtualclass.vutil.checkUserRole()) {
        const controlsElem = document.querySelector('#askQuestion');
        if (controlsElem) {
          if (value === true) {
            document.querySelector('#askQuestion').dataset.comment = 'enable';
          } else if (value === false) {
            document.querySelector('#askQuestion').dataset.comment = 'disable';
          }
        }
      }
    },

    qaUpvote(value) {
      if (!virtualclass.vutil.checkUserRole()) {
        const controlsElem = document.querySelector('#askQuestion');
        if (controlsElem) {
          if (value === true) {
            document.querySelector('#askQuestion').dataset.upvote = 'enable';
          } else if (value === false) {
            document.querySelector('#askQuestion').dataset.upvote = 'disable';
          }
        }
      }
    },

    upcomingSetting() {
      // nothing to do
    },

    recordingSettings(obj) {
      const buttonStatus = virtualclass.settings.recording.recordingStatus(obj);
      virtualclass.settings.recording.showRecordingButton(buttonStatus);
    },

    recording: {
      recordingButton: 0, // 0 - Do not show button, 1 - show button but no click, 2 - show button and clickable
      attendeeButtonAction: true,

      init() { // recording status, button show or hide, override setting
        const buttonSettings = JSON.parse(localStorage.getItem('recordingButton'));
        if (buttonSettings === null) {
          this.recordingButton = this.recordingStatus();
        } else {
          this.recordingButton = buttonSettings;
        }

        const atbuttonSettings = JSON.parse(localStorage.getItem('attendeeButtonAction'));
        if (atbuttonSettings !== null) {
          this.attendeeButtonAction = atbuttonSettings;
        }

        this.showRecordingButton();
      },

      toggleRecordingButton() {
        if (this.recordingButton === 21) {
          this.recordingButton = 11;
        } else if (this.recordingButton === 11) {
          this.recordingButton = 21;
        }
        ioAdapter.setRecording();
        localStorage.setItem('recordingButton', this.recordingButton);
        this.showRecordingButton();
        if (roles.hasControls()) {
          ioAdapter.mustSend({ ac: this.recordingButton, cf: 'recs' });
        } else if (this.recordingButton === 21) {
          this.attendeeButtonAction = true;
          localStorage.setItem('attendeeButtonAction', true);
        } else {
          this.attendeeButtonAction = false;
          localStorage.setItem('attendeeButtonAction', false);
        }
      },

      showRecordingButton(buttonStatus) { // recording button button show or hide
        if (typeof buttonStatus !== 'undefined') {
          this.recordingButton = buttonStatus;
        }
        const recordingButton = virtualclass.getTemplate('recordingButton');
        let context;
        this.removeButton();
        switch (this.recordingButton) {
          case 10:
            context = { ten: 'ten' };
            break;
          case 11:
            context = { eleven: 'eleven' };
            break;
          case 20:
            context = { twenty: 'twenty' };
            break;
          case 21:
            context = { twentyone: 'twentyone' };
            break;
          default:
            return;
        }
        const temp = recordingButton(context);
        const elem = document.querySelector('#virtualclassAppFooterPanel #networkStatusContainer');
        // this.removeButton();
        elem.insertAdjacentHTML('afterend', temp);
        const recording = document.getElementById('recording');
        if (this.recordingButton === 21 || this.recordingButton === 11) {
          this.attachHandler(recording);
        }
      },

      removeButton() {
        const recording = document.getElementById('recording');
        if (recording !== null) {
          recording.remove();
        }
      },

      attachHandler(recording) {
        recording.addEventListener('click', this.recordingButtonAction.bind(this, recording));
      },

      recordingButtonAction() { // On recording button action send to student
        if (this.recordingButton === 21 || this.recordingButton === 11) {
          this.toggleRecordingButton();
        }
      },

      recordingStatus(obj) {
        let settingsInfo;
        if (typeof obj !== 'undefined') {
          settingsInfo = obj;
        } else {
          settingsInfo = virtualclass.settings.info;
        }
        if (!settingsInfo.enableRecording) {
          if (roles.hasControls()) {
            if (settingsInfo.recShowPresentorRecordingStatus) {
              return 10;
            }
          } else if (settingsInfo.showAttendeeRecordingStatus) {
            return 10;
          }
          return 0;
        }
        if (roles.hasControls()) {
          if (settingsInfo.recAllowpresentorAVcontrol) {
            return 21;
          }
          if (settingsInfo.recShowPresentorRecordingStatus) {
            return 20;
          }
          return 22;
        }
        if (settingsInfo.attendeerecording) {
          if (settingsInfo.attendeeAV) {
            if (settingsInfo.recallowattendeeAVcontrol) {
              return 21;
            }
            if (settingsInfo.showAttendeeRecordingStatus) {
              return 20;
            }
            return 22;
          }
          if (settingsInfo.showAttendeeRecordingStatus) {
            return 10;
          }
          return 0;
        }
        return 0;
      },

      sendYesOrNo() {
        if (this.recordingButton === 20 || this.recordingButton === 21 || this.recordingButton === 22) {
          return 'yes';
        }
        return 'no';
      },

      triggerSetting(message) {
        if (roles.isStudent()) {
          if (!virtualclass.settings.info.attendeeAV) {
            this.recordingButton = 0;
            ioAdapter.setRecording();
            this.showRecordingButton();
            return;
          }
          switch (message.ac) {
            case 11:
              this.recordingButton = 10;
              break;
            case 21:
              if (virtualclass.settings.info.recallowattendeeAVcontrol) {
                if (this.attendeeButtonAction) {
                  this.recordingButton = 21;
                } else {
                  this.recordingButton = 11;
                }
              } else {
                this.recordingButton = 20;
              }
              break;
            default:
              return;
          }

          ioAdapter.setRecording();
          localStorage.setItem('recordingButton', this.recordingButton);
          if (virtualclass.settings.info.showAttendeeRecordingStatus) {
            this.showRecordingButton();
          }
        }
      },
    },

    userAudioIcon() {
      if ((virtualclass.settings.info.studentaudio === false)) {
        virtualclass.gObj.audioEnable = false;
        virtualclass.user.control.audioDisable(true);
      } else if (virtualclass.settings.info.studentaudio === true) {
        virtualclass.gObj.audioEnable = true;
        virtualclass.user.control.audioWidgetEnable(true);
      } else if (virtualclass.settings.info.studentaudio !== true) {
        virtualclass.user.control.audioDisable();
      }
    },

    userVideoIcon() {
      if (virtualclass.settings.info.studentvideo === false && roles.isStudent()) {
        virtualclass.vutil.videoHandler('off');
        virtualclass.user.control.videoDisable();
      } else {
        if (roles.isStudent() && virtualclass.settings.info.studentvideo !== true) { // todo, check it properly on page refresh
          if (virtualclass.settings.info.studentvideo !== undefined) {
            virtualclass.vutil.videoHandler('off');
            virtualclass.videoHost.toggleVideoMsg('disable');
          }
        } else {
          virtualclass.user.control.videoEnable();
          if (roles.isStudent()) {
            // after refresh video disable when user enable his video etc.
            virtualclass.vutil.videoHandler('off');
          }
        }
        if (virtualclass.settings.info.studentvideo === true) {
          virtualclass.user.control.videoEnable();
        }
      }
    },
  };
  window.settings = settings;
}(window));
