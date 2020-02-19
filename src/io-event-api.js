function processImage(msg, vtype) {
  const data_pack = new Uint8ClampedArray(msg);
  const recmsg = data_pack.subarray(2, data_pack.length);
  if (vtype == 1) {
    var b64encoded = `data:image/webp;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
    var imgType = 'webp';
  } else {
    var b64encoded = `data:image/jpeg;base64,${btoa(virtualclass.videoHost.Uint8ToString(recmsg))}`;
    var imgType = 'jpeg';
  }
  const teacherVideoContainer = document.getElementById('videoHostContainer');
  if (roles.isStudent() &&  teacherVideoContainer.classList.contains('displayInterrupt')) {
    teacherVideoContainer.classList.remove('displayInterrupt');
  }
  virtualclass.videoHost.drawReceivedImage(b64encoded, imgType, { x: 0, y: 0 });
}

function isAnyOnePresenter() {
  const isPresenter = parseInt(wbUser.anyonepresenter, 10);
  return (isPresenter === 1);
}

function joinAsTeacher(jId) {
  virtualclass.gObj.veryFirstJoin = false;
  if (!virtualclass.vutil.isOrginalTeacherExist(jId)) {
    overrideOperation('t');
    // console.log('Member add :- join as teacher');
  }
}

/**
 * By this funciton overriding the role and
 * and adjusting the layout/html according to the given role
 * @param role
 */
var overrideOperation = function (role) {
  if (role === 's') {
    virtualclass.view.disappearBox('drawArea'); // remove draw message box
    removeAppsDom();
    // if (typeof virtualclass.wb === 'object') {
    //   // make canvas disable if there canvas is disabled
    //   virtualclass.wb[virtualclass.gObj.currWb].utility.makeCanvasDisable();
    // }
  }
  virtualclass.vutil.overrideRoles(role);

  // io.disconnect();
  //
  // virtualclass.vutil.overrideRoles(role);
  // /** If we invoke io.init() without time(1500 miliseconds), then
  //  * teacher received both events member_joined and member_removed
  //  * at same time, only time difference is 2 or 3 miliseconds,
  //  * the sequence of event is incorrect member_added and user_logout ,
  //  * After delay some time, event sequence is correct user_logout and member_added,
  //  * * */
  // io.init(virtualclass.uInfo);
};


function getPosition(connectedUsers, uid) {
  const index = connectedUsers.findIndex(o => o.userid === uid);
  return index;
}

const ioEventApi = {
  readyto_member_add(e) {
    if (typeof e.joinUser === 'object') {

      const te = {};
      let i = 0;

      for (const key in e.joinUser) {
        if (wbUser.id !== key) {
          // console.log('Don t join');
          te.joinUser = { key };
          te.message = e.message[i];
          te.newuser = e.newuser;
          te.type = e.type;
          te.user = e.user;
          i++;
          this.member_added(te);
        }
      }
    } else {
      this.member_added(e);
    }
  },

  member_added(e) {
    // console.log('===== JOIN user ' + e.message.length);
    // console.log('===== JOIN user ' + e.message);
    let sType;
    if (typeof virtualclass.connectedUsers === 'undefined') {
      virtualclass.connectedUsers = [];
    }
    // console.log('===== JOIN user member_added call ');
    if (Object.prototype.hasOwnProperty.call(e, 'user')) {
      const joinUserObj = e.message;
      virtualclass.jId = joinUserObj.userid;

      // console.log(`===== JOIN users ${virtualclass.jId}`);


      const upos = getPosition(virtualclass.connectedUsers, virtualclass.jId);
      if (upos !== -1) {
        virtualclass.connectedUsers.splice(upos, 1);
      }
      virtualclass.gObj.allUserObj[virtualclass.jId] = joinUserObj;
      virtualclass.connectedUsers.push(joinUserObj);

      // Get the new joinecr user id and object
      virtualclass.joinUser = joinUserObj;
    } else if (Object.prototype.hasOwnProperty.call(e, 'users')) {
      virtualclass.jId = e.joinUser;
      // console.log(`===== JOIN users ${virtualclass.jId}`);

      virtualclass.connectedUsers = e.message;
      for (var i = 0; i < virtualclass.connectedUsers.length; i++) {
        virtualclass.gObj.allUserObj[virtualclass.connectedUsers[i].userid] = virtualclass.connectedUsers[i];
      }
      virtualclass.joinUser = this.getJoinUser(virtualclass.connectedUsers, virtualclass.jId);
    } else {
      // console.log('User packet is not receving');
    }

    // set the default value related about video quality, internet latency and frame rate
    if (virtualclass.jId === virtualclass.gObj.uid) {
      let speed;
      // var speed = roles.hasAdmin() ? 1 :  0;
      if (typeof virtualclass.videoHost.gObj.MYSPEED === 'undefined') {
        speed = 1;
      } else {
        speed = virtualclass.videoHost.gObj.MYSPEED;
      }
      virtualclass.videoHost.setDefaultValue(speed);
      virtualclass.vutil.setDefaultScroll();

      // if (localStorage.getItem('settings') != null) {
      //   // console.log('====> Settings apply mark and note');
      //   if (virtualclass.vutil.checkUserRole()) { virtualclass.settings.triggerSettings(); }
      // }

      if (roles.hasControls()) { // settings send to students when teacher change his browser
        if (!virtualclass.gObj.toBeSendSession && !localStorage.getItem('userSettings')) {
          const settings = virtualclass.settings.settingsToHex(virtualclass.settings.info);
          ioAdapter.mustSend({ cf: 'settings', Hex: settings, time: Date.now() });
        } else if (virtualclass.gObj.toBeSendSession) {
          ioAdapter.mustSend({ cf: 'settings', Hex: virtualclassSetting.settings, time: Date.now() });
          // console.log('====> Settings send', virtualclassSetting.settings);
          virtualclass.settings.info = virtualclass.settings.parseSettings(virtualclassSetting.settings);
          delete virtualclass.gObj.toBeSendSession;
        } else {
          // console.log('====> Settings current, not sending', virtualclassSetting.settings);
        }
        const recordingButton = localStorage.getItem('recordingButton');
        if (recordingButton !== null) {
          ioAdapter.mustSend({ ac: JSON.parse(recordingButton), cf: 'recs' });
        }

        if (localStorage.getItem('prvUser') != null) {
          // console.log('====> Settings apply mark and note');
          if (virtualclass.vutil.checkUserRole()) { virtualclass.settings.triggerSettings(); }
        }
        // virtualclass.setPrvUser();
      }

    }

    // virtualclass.gObj.mySetTime = virtualclass.vutil.getMySetTime(virtualclass.connectedUsers);
    virtualclass.gObj.mySetTime = 2000;

    // console.log('==== Add users');
    defaultOperation(e, sType);

    if (roles.hasControls()) {
      virtualclass.poll.updateUsersOnPoll(e);
    }

    if (typeof virtualclass.quiz !== 'undefined') {
      if ((virtualclass.quiz.uniqueUsers.indexOf(virtualclass.jId) < 0)) {
        virtualclass.quiz.uniqueUsers.push(virtualclass.jId);

        for (var i in io.uniquesids) {
          if (virtualclass.quiz.uniqueUsers.indexOf(i) < 0) {
            virtualclass.quiz.uniqueUsers.push(i);
          }
        }
      }
    }

    if (virtualclass.joinUser.role === 's' && virtualclass.gObj.has_ts_capability) {
      ioAdapter.mustSend({ uid: virtualclass.gObj.uid, ac: true, cf: 'tsr' });
    }

    if (virtualclass.gObj.uid !== virtualclass.jId && virtualclass.gObj.meetingMode) {
      virtualclass.multiVideo.onUserJoin(virtualclass.jId);
    }

    if (!roles.hasControls()) {
      if (e.message[0].role === 't' || ((virtualclass.gObj.uid === virtualclass.jId) && virtualclass.vutil.whoIsTeacher())) {
        const vcCont = document.getElementById('virtualclassCont');
        if (!vcCont.classList.contains('tr_available')) {
          vcCont.classList.add('tr_available');

          if (virtualclass.gObj.teacherAvailableTime) {
            clearTimeout(virtualclass.gObj.teacherAvailableTime);
          }

          virtualclass.gObj.teacherAvailableTime = setTimeout(() => {
            if (virtualclass.settings.info.askQuestion) {
              virtualclass.settings.askQuestion(true);
            }
            if (virtualclass.currApp === 'editorRich') {
              virtualclass.editorRich.cm.setOption('readOnly', false);
            }
          }, 3000);
        }
      }
    }

    // if (virtualclass.vutil.selfJoin(virtualclass.jId)
    //   && (roles.hasControls() || localStorage.getItem('mySession') != null)) {
    //   virtualclass.userInteractivity.init();
    // }
  },

  newmessage(e) {
    const recMsg = e.message;
    if (Object.prototype.hasOwnProperty.call(recMsg, 'cf')) {
      if (typeof receiveFunctions[recMsg.cf] === 'function') {
        receiveFunctions[recMsg.cf](e);
      } else {
        // console.log(`CF ${recMsg.cf} is not a function of receiveFunctions`);
      }
    }
  },

  readyto_user_logout(msg) {
    let e = {};
    for (const uid in msg.action) {
      e = { type: 'user_logout', fromUser: uid, message: 'offline' };
      virtualclass.ioEventApi.user_logout(e);
    }
  },

  user_logout(e) {
    if (!roles.hasControls()) {
      if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'whoIsTeacher')) {
        virtualclass.gObj.whoIsTeacher = virtualclass.vutil.whoIsTeacher();
      }

      // if teacher is log out
      if (virtualclass.gObj.whoIsTeacher === e.fromUser) {
        const vcCont = document.getElementById('virtualclassCont');
        virtualclass.settings.askQuestion(false);
        if (vcCont && vcCont.classList.contains('tr_available')) {
          vcCont.classList.remove('tr_available');
          if (virtualclass.currApp === 'EditorRich' && roles.isStudent()) {
            virtualclass.editorRich.cm.setOption('readOnly', 'nocursor');
          }
        }
      }
    }


    // virtualclass.media.video.removeUser(e.fromUser.userid);
    // virtualclass.media.video.removeUser(e.fromUser);
    // TODO this should be update accordiing to new user

    // if (virtualclass.chat.isTechSupportExist(e.fromUser)) {
    //   virtualclass.chat.disableTechSupport(e.fromUser);
    // }

    const removeUser = e.fromUser;
    delete virtualclass.gObj.allUserObj[removeUser];
    const userPos = getPosition(virtualclass.connectedUsers, removeUser);
    if (userPos !== -1) {
      virtualclass.connectedUsers.splice(userPos, 1);
    }
    var e = { removeUser };

    memberUpdateWithDelay(e, 'removed');

    if (virtualclass.gObj.meetingMode) {
      virtualclass.multiVideo.onUserRemove(removeUser);
    }

    /** Update users in user list until total user is more than 500 * */
    if (virtualclass.connectedUsers.length < virtualclass.gObj.userToBeDisplay) {
      virtualclass.gObj.insertUser = true;
    }
  },
  error(e) {
    if (virtualclass.gObj.displayError) {
      virtualclass.view.removeElement('serverErrorCont');
      if (typeof e.message === 'undefined') {
        // console.log('Error ', e.message);
      } else {
        if (typeof e.message.stack !== 'undefined') {
          virtualclass.view.displayServerError('serverErrorCont', e.message.stack);
        } else {
          // console.log(`Error message ${e.message.stack} could not display`);
        }

        if (typeof e.message !== 'object') {
          display_error(e.message.stack);
        }
      }
    } else if (typeof e.message !== 'object') {
      // console.log(e.message.stack);
    }
  },

  Text_Limit_Exeed(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Text_Limit_Exeed'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Text_Limit_Exeed' });
  },

  Binary_Limit_Exeed(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Binary_Limit_Exeed'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Binary_Limit_Exeed' });
  },

  Unauthenticated(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Unauthenticated'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Unauthenticated' });
    virtualclass.vutil.stopConnection();
  },

  Multiple_login(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Multiple_login'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Multiple_login' });
    virtualclass.vutil.stopConnection();
  },

  Max_rooms(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_rooms'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Max_rooms' });
  },

  Max_users(e) {
    virtualclass.view.createErrorMsg(virtualclass.lang.getString('Max_users'), 'errorContainer', 'virtualclassAppFooterPanel', { className: 'Max_users' });
  },

  PONG(e) {
    virtualclass.network.latency = Date.now() - e.message;
    virtualclass.network.initToPing(1000);
  },

  authentication_failed(e) {
    virtualclass.chat.removeCookieUserInfo(e);
  },

  connectionclose(e) {
    if (Object.prototype.hasOwnProperty.call(virtualclass, 'recorder') && virtualclass.recorder.startUpload) {
      // console.log('During the upload process there would not any other popup box.');
    } else if (virtualclass.recorder.smallData && Object.prototype.hasOwnProperty.call(virtualclass.recorder, 'rdlength') && virtualclass.recorder.rdlength < 100000) {
      // console.log('Do not show the waiting popupbox if there small chunks of data');
    } else {
      virtualclass.popup.waitMsg();
    }
    virtualclass.chat.makeUserListEmpty();
  },

  connectionopen(e) {
    // TODO Do we need this?
    virtualclass.gObj.invalidlogin = false;
    let setTimeReady = 6000;
    // There will take more time to connect socket when teacher will
    // Come from become Teacher
    if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'doEndSession')) {
      // console.log('From Become Teacher');
      setTimeReady = 10000;
    }
    setTimeout(
      () => {
        if (!virtualclass.vutil.sesionEndMsgBoxIsExisting() && !Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'downloadProgress') && !(virtualclass.recorder.startUpload)) {
          virtualclass.popup.closePopup();
          virtualclass.vutil.setDefaultScroll();
          const popupContainer = document.getElementById('popupContainer');
          if (popupContainer != null) {
            popupContainer.style.display = 'none';
          }

          // console.log('Popup box Close All');
        } else {
          // console.log('Popup box Could not close');
        }
      }, setTimeReady, // Wait for everything is to be ready

    );
  },
  binrec(e) {
    // TODO here should be eith unit8clampped array or unit8array
    const dataPack = new Uint8Array(e.message);
    const stype = 'ss';
    const sTool = 'ScreenShare';
    switch (dataPack[0]) {
      case 102:
      case 103:
      case 104:
      case 202:
      case 203:
      case 204:
        if (roles.hasControls()) {
          virtualclass.gObj.studentSSstatus.mesharing = true;
          const virtualclassCont = document.querySelector('#virtualclassCont');
          if (virtualclassCont !== '') {
            virtualclassCont.classList.add('studentScreenSharing');
            /** Remove following statement after fully support of SHADOW DOM * */
            document.querySelector('#chat_div').classList.add('studentScreenSharing');
          }
        }

        if (!Object.prototype.hasOwnProperty.call(virtualclass, 'studentScreen')) {
          // eslint-disable-next-line new-cap,no-undef
          virtualclass.studentScreen = new studentScreen();
        }

        // We can't call below statement
        // precheck would  be hidden on continuous reciving of screen
        // if (virtualclass.gObj.precheckScrn) {
        //  virtualclass.vutil.prechkScrnShare();
        // }

        // The binary data is coming on teacher when user download the session
        // which actually should not, workaround for now

        if (!roles.hasControls() || virtualclass.gObj.studentSSstatus.mesharing) {
          virtualclass.studentScreen.ssProcess(e.message, stype, sTool);
        }

        if (virtualclass.gObj.studentSSstatus.sharing && roles.isStudent()) {
          const elem = document.getElementById('virtualclassScreenShareLocal');
          if (virtualclass.gObj.studentSSstatus.shareToAll) {
            if (elem != null) {
              elem.style.display = 'block';
            }
          } else if (elem != null) {
            elem.style.display = 'none';
          }
        }

        break;
      case 11: // user video image
        virtualclass.media.video.process(e.message);
        break;
      case 21: // teacher big video
        processImage(e.message, dataPack[1]);
    }
  },

  getJoinUser(users, uid) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].userid === uid) {
        return users[i];
      }
    }
  },

};
