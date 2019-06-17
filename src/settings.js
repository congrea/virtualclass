(function (window) {
  const settings = {
    info: {},
    user: {},
    init() { // default settings applyed from here
      let coreSettings = localStorage.getItem('settings');
      if (coreSettings === null) {
        coreSettings = virtualclassSetting.settings;
        localStorage.setItem('settings', coreSettings);
      }

      virtualclass.settings.info = virtualclass.settings.parseSettings(coreSettings);

      const userSetting = localStorage.getItem('userSettings');
      if (userSetting) {
        virtualclass.settings.user = JSON.parse(userSetting);
      }

      this.recording.init();
    },

    // settings object values assign to array for get a hax code
    settingsToHex(s) {
      const localSettings = [];
      localSettings[0] = +s.allowoverride;
      localSettings[1] = +s.studentaudio;
      localSettings[2] = +s.studentvideo;
      localSettings[3] = +s.studentpc;
      localSettings[4] = +s.studentgc;
      localSettings[5] = +s.raisehand;
      localSettings[6] = +s.userlist;
      localSettings[7] = +s.enableRecording;
      localSettings[8] = +s.recAllowpresentorAVcontrol;
      localSettings[9] = +s.recShowPresentorRecordingStatus;
      localSettings[10] = +s.attendeeAV;
      localSettings[11] = +s.recallowattendeeAVcontrol;
      localSettings[12] = +s.showAttendeeRecordingStatus;
      localSettings[13] = +s.trimRecordings;
      localSettings[14] = +s.attendeerecording;
      localSettings[15] = +s.x6;
      return virtualclass.settings.binaryToHex(localSettings.join(''));
    },

    // return data into true, false
    // student side
    parseSettings(s) {
      const parsedSettings = {};
      let localSettings = virtualclass.settings.hexToBinary(s);
      localSettings = localSettings.split('');
      parsedSettings.allowoverride = !!+localSettings[0];
      parsedSettings.studentaudio = !!+localSettings[1];
      parsedSettings.studentvideo = !!+localSettings[2];
      parsedSettings.studentpc = !!+localSettings[3];
      parsedSettings.studentgc = !!+localSettings[4];
      parsedSettings.raisehand = !!+localSettings[5];
      parsedSettings.userlist = !!+localSettings[6];
      parsedSettings.enableRecording = !!+localSettings[7];
      parsedSettings.recAllowpresentorAVcontrol = !!+localSettings[8];
      parsedSettings.recShowPresentorRecordingStatus = !!+localSettings[9];
      parsedSettings.attendeeAV = !!+localSettings[10];
      parsedSettings.recallowattendeeAVcontrol = !!+localSettings[11];
      parsedSettings.showAttendeeRecordingStatus = !!+localSettings[12];
      parsedSettings.trimRecordings = !!+localSettings[13];
      parsedSettings.attendeerecording = !!+localSettings[14];
      parsedSettings.x6 = !!+localSettings[15];
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
        if (lookupTable.hasOwnProperty(s[i])) {
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
      const obj = {};
      obj[settingName] = value;
      this._applySettings(obj, userId);
    },

    _applySettings(obj, userId) {
      if (roles.hasControls()) {
        const settingName = Object.keys(obj)[0];
        const value = obj[settingName];
        if ((value === true || value === false) && virtualclass.settings.info.hasOwnProperty(settingName)) {
          if (typeof userId === 'undefined') {
            const userList = virtualclass.connectedUsers;
            for (let i = 0; i < userList.length; i++) {
              if (userList[i].role === 's') {
                virtualclass.user.control.changeAttribute(userList[i].userid,
                  virtualclass.gObj.testChatDiv.shadowRoot.getElementById(userList[i].userid + 'contrAudImg'),
                  virtualclass.settings.info.studentaudio, 'audio', 'aud');
                virtualclass.user.control.changeAttribute(userList[i].userid,
                  virtualclass.gObj.testChatDiv.shadowRoot.getElementById(userList[i].userid + 'contrChatImg'),
                  true, 'chat', 'chat');
              }
            }
            localStorage.removeItem('userSettings');
            virtualclass.settings.user = {};
            virtualclass.settings.info[settingName] = value;
            const str = virtualclass.settings.settingsToHex(virtualclass.settings.info);
            virtualclass.settings.send(str, userId);
            localStorage.setItem('settings', str);
          } else {
            let specificSettings;
            if (virtualclass.settings.user.hasOwnProperty(userId)) {
              const user = virtualclass.settings.user[userId];
              const setting = virtualclass.settings.parseSettings(user);
              setting[settingName] = value;
              specificSettings = virtualclass.settings.settingsToHex(setting);
            } else {
              let individualSetting = {};
              individualSetting = virtualclass.settings.info;
              individualSetting[settingName] = value;
              specificSettings = virtualclass.settings.settingsToHex(individualSetting);
            }
            virtualclass.settings.send(specificSettings, userId);
            virtualclass.settings.user[userId] = specificSettings;
            localStorage.setItem('userSettings', JSON.stringify(virtualclass.settings.user));
          }
          return true;
        }
        return false;
      }
      for (const propname in obj) {
        virtualclass.settings.info[propname] = obj[propname];
        if (propname !== 'trimRecordings') { // avoid trim recordings
          virtualclass.settings[propname](obj[propname]);
        }
      }
      const str = virtualclass.settings.settingsToHex(obj);
      localStorage.setItem('settings', str);
    },

    // Message send to student
    send(value, userId) {
      if (roles.hasControls()) {
        if (typeof userId !== 'undefined') {
          virtualclass.vutil.beforeSend({ cf: 'settings', Hex: value, toUser: userId }, userId);
        } else {
          virtualclass.vutil.beforeSend({ cf: 'settings', Hex: value });
        }
      }
    },

    // Apply settings on student side
    onMessage(msg) {
      if (typeof msg === 'string') {
        if (roles.isStudent()) {
          const stdSettings = virtualclass.settings.parseSettings(msg);
          this._applySettings(stdSettings);
        }
      } else {
        this.recording.triggerSetting(msg);
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
      console.log('TO DO');
    },

    studentpc(value) { // student chat enable/disable
      console.log('TO DO');
      if (value === true) {
        virtualclass.user.control.allChatEnable();
        virtualclass.gObj.chatEnable = true;
        document.querySelector('#chatWidget').classList.remove('chat_disabled');
        document.querySelector('#chat_div').classList.remove('chat_disabled');
      } else if (value === false) {
        virtualclass.user.control.allChatDisable();
        virtualclass.gObj.chatEnable = false;
      }
    },

    studentgc() {
      console.log('TO DO');
    },

    studentvideo(value) { // All student video enable, disable
      if (roles.isStudent()) {
        const sw = document.querySelector('.videoSwitchCont #videoSwitch');
        if (sw.classList.contains('off') && value === false) {
          console.log('do nothing');
        } else if (sw.classList.contains('on') && value === true) {
          console.log('do nothing');
        } else if (sw.classList.contains('on') && value === false) {
          virtualclass.vutil.videoHandler('off');
        }
        const action = (value === false) ? 'disable' : 'enable';
        virtualclass.videoHost.toggleVideoMsg(action);
      }
    },

    raisehand() {
      console.log('TO DO');
    },

    userlist() {
      console.log('TO DO');
    },

    attendeerecording() {
      console.log('TO DO');
    },

    enableRecording() {
      console.log('TO DO');
    },

    recAllowpresentorAVcontrol() {
      console.log('TO DO');
    },

    recShowPresentorRecordingStatus() {
      console.log('TO DO');
    },

    attendeeAV() {
      console.log('TO DO');
    },

    recallowattendeeAVcontrol() {
      console.log('TO DO');
    },

    showAttendeeRecordingStatus() {
      console.log('TO DO');
    },

    x6() {
      console.log('TO DO');
    },

    recording: {
      recordingButton: 0, // 0 - Do not show button, 1 - show button but no click, 2 - show button and clickable
      attendeeButtonAction: true,

      init() { // recording status, button show or hide, override setting
        const buttonSettings = JSON.parse(localStorage.getItem('recordingButton'));
        if (buttonSettings === null) {
          this.recordingButton = this.recordingStatus();
          localStorage.setItem('recordingButton', this.recordingButton);
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
          if (virtualclass.settings.info.attendeeAV) {
            ioAdapter.mustSend({ ac: this.recordingButton, cf: 'recs' });
          }
        } else {
          if (this.recordingButton === 21) {
            this.attendeeButtonAction = true;
            localStorage.setItem('attendeeButtonAction', true);
          } else {
            this.attendeeButtonAction = false;
            localStorage.setItem('attendeeButtonAction', false);
          }
        }
      },

      showRecordingButton() { // recording button button show or hide
        const recordingButton = virtualclass.getTemplate('recordingButton');
        let context;
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
        const elem = document.querySelector('#docShareNav');
        let recording = document.getElementById('recording');
        if (recording !== null) {
          recording.remove();
        }
        elem.insertAdjacentHTML('afterend', temp);
        recording = document.getElementById('recording');
        if (this.recordingButton === 21 || this.recordingButton === 11) {
          this.attachHandler(recording);
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

      recordingStatus() {
        if (!virtualclass.settings.info.enableRecording) {
          if (roles.hasControls()) {
            if (virtualclass.settings.info.recShowPresentorRecordingStatus) {
              return 10;
            }
          } else {
            if (virtualclass.settings.info.showAttendeeRecordingStatus) {
              return 10;
            }
          }
          return 0;
        } else {
          if (roles.hasControls()) {
            if (virtualclass.settings.info.recAllowpresentorAVcontrol) {
              return 21;
            } else {
              if (virtualclass.settings.info.recShowPresentorRecordingStatus) {
                return 20;
              }
              return 22;
            }
          } else {
            if (virtualclass.settings.info.attendeerecording) {
              if (virtualclass.settings.info.attendeeAV) {
                if (virtualclass.settings.info.recallowattendeeAVcontrol) {
                  return 21;
                } else {
                  if (virtualclass.settings.info.showAttendeeRecordingStatus) {
                    return 20;
                  }
                  return 22;
                }
              } else {
                if (virtualclass.settings.info.showAttendeeRecordingStatus) {
                  return 10;
                }
                return 0;
              }
            } else {
              return 0;
            }
          }
        }
      },

      sendYesOrNo() {
        if (this.recordingButton === 20 || this.recordingButton === 21 || this.recordingButton === 22) {
          return 'yes';
        }
        return 'no';
      },

      triggerSetting(message) {
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
        if (roles.isStudent() && virtualclass.settings.info.studentvideo !== true) {
          virtualclass.vutil.videoHandler('off');
          virtualclass.videoHost.toggleVideoMsg('disable');
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
