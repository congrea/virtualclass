// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2019  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */


function Config() {
}

Config.prototype.setNewSession = function (session) {
  console.log('====> hi helllo 1');
  localStorage.setItem('mySession', session);
  if (!virtualclass.isPlayMode) {
    if (roles.hasControls()) {
      const currTime = new Date().getTime();
      const configData = JSON.stringify({ createdDate: currTime });
      localStorage.setItem('myConfig', configData);
    } else {
      console.log('Invoke firebase operation');
      virtualclass.userInteractivity.triggerInitFirebaseOperation('note');
    }
  }
};


Config.prototype.endSession = async function (onlyStoredData) {
  //console.log('==== End the session here');
  delete virtualclass.connectedUsers;
  if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'memberUpdateDelayTimer')) {
    clearTimeout(virtualclass.gObj.memberUpdateDelayTimer);
    virtualclass.gObj.memberlistpending.length = 0;
    delete virtualclass.gObj.memberUpdateDelayTimer;
  }

  if (Object.prototype.hasOwnProperty.call(virtualclass, 'poll') && virtualclass.poll !== '') {
    virtualclass.poll.pollState = {};
    virtualclass.poll.dataRec = {};
  }

  const congrealogo = document.getElementById('congrealogo');
  if (congrealogo != null) {
    congrealogo.classList.remove('disbaleOnmousedown');
  }

  $('#chatroom_bt2').removeClass('ui-state-highlight');

  if (typeof virtualclass.videoUl === 'object' && Object.prototype.hasOwnProperty.call(virtualclass.videoUl, 'player')
    && typeof virtualclass.videoUl.player === 'object' && virtualclass.videoUl.player.player_ != null

  ) {
    virtualclass.videoUl.destroyPlayer();
  }

  if (virtualclass.gObj.CDTimer != null) {
    clearInterval(virtualclass.gObj.CDTimer);
  }

  const currApp = document.querySelector(`#virtualclass${virtualclass.currApp}`);
  if (currApp != null) {
    currApp.style.display = 'none';
  }

  if (Object.prototype.hasOwnProperty.call(virtualclass, 'media')) {
    virtualclass.media.audio.muteButtonToogle();
  }

  // Remove all chat user list
  const chatUsers = chatContainerEvent.elementFromShadowDom('.ui-memblist-usr', 'all');
  if (chatUsers != null && chatUsers.length > 0) {
    for (let i = 0; i < chatUsers.length; i++) {
      if (chatUsers[i] != null) {
        chatUsers[i].parentNode.removeChild(chatUsers[i]);
      }
    }
  }

  if (virtualclass.gObj.precheckScrn) {
    virtualclass.vutil.prechkScrnShare();
  }

  // virtualclass.raiseHand.raisehand();
  virtualclass.gObj.audioEnable = (roles.hasControls()) ? true : virtualclass.gObj.stdaudioEnable;
  const precheck = localStorage.getItem('precheck');
  // localStorage.clear();
  if (virtualclass.chat != null) {
    delete virtualclass.chat.vmstorage;
    virtualclass.chat.vmstorage = {};
    virtualclass.chat.removeChatHighLight('chatrm');
  }
  virtualclass.recorder.items = [];
  virtualclass.recorder.totalSent = 0;
  virtualclass.gObj.tempReplayObjs.length = 0;
  virtualclass.wb = ''; // make white board empty
  delete virtualclass.gObj.currWb; // deleting current whiteboard
  virtualclass.gObj.studentSSstatus.mesharing = false;
  virtualclass.removeSharingClass();
  virtualclass.gObj.studentSSstatus.shareToAll = false;
  virtualclass.gObj.studentSSstatus.sharing = false;
  delete virtualclass.gObj.whoIsSharing;
  if (virtualclass.videoHost != null) {
    virtualclass.videoHost.gObj.stdStopSmallVid = false;
    virtualclass.videoHost.gObj.allStdVideoOff = false;
  }

  virtualclass.gObj.wbTool = {};

  // virtualclass.recorder.rnum = 1; // set file to 1

  if (Object.prototype.hasOwnProperty.call(virtualclass.recorder, 'startUpload')) {
    delete virtualclass.recorder.startUpload;
  }

  if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'downloadProgress')) {
    delete virtualclass.gObj.downloadProgress;
  }

  if (!onlyStoredData) {
    if (typeof virtualclass.wb === 'object') {
      alert('Clear all whiteboard');
      virtualclass.wb[virtualclass.gObj.currWb].utility.t_clearallInit();
      virtualclass.wb[virtualclass.gObj.currWb].utility.makeDefaultValue(undefined, virtualclass.gObj.currWb);
      if (typeof virtualclass.wb[virtualclass.gObj.currWb].replay === 'object') {
        virtualclass.wb[virtualclass.gObj.currWb].replay.rendering = false;
      }
    }

    // virtualclass.clearAllChat();
    if (virtualclass.editorRich != null) {
      virtualclass.editorRich.removeEditorData();
    }
    virtualclass.pdfRender = {};
  }

  virtualclass.vutil.removeClass('audioWidget', 'fixed');
  await virtualclass.storage.clearStorageData();


  virtualclass.wbCommon.removeAllContainers();
  virtualclass.gObj.wbCount = 0;
  virtualclass.gObj.currSlide = 0;

  // var prvAppObj = {name : "EditorRich"};
  virtualclass.currApp = virtualclass.gObj.defaultApp; // default app

  // hasMicrophone is true if audio is avaialble on hardware but the audio/video is disabled by user
  if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'disableCamByUser')) {
    virtualclass.user.control.audioWidgetEnable(true);
  } else {
    virtualclass.user.control.audioDisable(); // Enable the audio if disabled
  }

  virtualclass.user.control.allChatEnable(); // Enabble all chat if disabled
  virtualclass.user.control.resetmediaSetting();

  if (roles.isStudent()) {
    const teacherVid = document.getElementById('videoHostContainer');
    if (teacherVid !== null) {
      teacherVid.style.display = 'none';
    }
    const leftPanel = document.getElementById('virtualclassAppRightPanel');
    if (leftPanel !== null && leftPanel.classList.contains('vidShow')) {
      leftPanel.classList.remove('vidShow');
    }
  } else {
    const sessionEndTool = document.getElementById('virtualclassSessionEndTool');
    if (sessionEndTool !== null) {
      sessionEndTool.className = virtualclass.vutil.removeClassFromElement('virtualclassSessionEndTool', 'active');
    }
  }

  if (typeof virtualclass.yts === 'object') {
    clearInterval(virtualclass.yts.tsc); // Clear If youTube seekChange interval is exist
  }

  if (typeof virtualclass.sharePt === 'object') {
    virtualclass.sharePt.UI.removeIframe();
  }

  // console.log('Session End.');

  virtualclass.previous = `virtualclass${virtualclass.currApp}`;

  // True when fethcing data from indexeddb, there would not data store into table of indexeddb if it is true
  //  so need to do false
  virtualclass.getContent = false;
  virtualclass.recorder.storeDone = 0;


  workerIO.postMessage({ cmd: 'sessionEndClose' });
  if (precheck != null) {
    localStorage.setItem('precheck', JSON.parse(precheck));
  }

  // console.log(`New role before clear ${virtualclass.gObj.uRole}`);
  virtualclass.settings.user = {};

  const virtualclassWhiteboard = document.querySelector('#virtualclassWhiteboard');
  if (virtualclassWhiteboard !== null) {
    virtualclassWhiteboard.style.display = 'none';
  }

  const virtualclassCont = document.querySelector('#virtualclassCont');
  if (virtualclassCont !== null) {
    virtualclassCont.classList.remove('loading');
  }

  localStorage.clear();

  // TODO, CHECK WHERE WE NEED TO PUT BELOW CREATENEWFUNCTION()
  // that.config.createNewSession();

  if (virtualclass.videoHost && roles.isStudent() && !virtualclass.isPlayMode) {
    const rightPanelElem = document.querySelector('#virtualclassAppRightPanel');
    if (rightPanelElem !== null && !rightPanelElem.classList.contains('vidHide')) {
      rightPanelElem.classList.add('vidHide');
    }
  }

  // console.log(`New role after clear ${virtualclass.gObj.uRole}`);
  if (!virtualclass.enablePreCheck) {
    // Only popup the message, if the precheck is not enabled
    virtualclass.popup.waitMsg();
  }

  if (typeof virtualclass.dts === 'object' && virtualclass.dts != null) {
    virtualclass.dts.destroyDts();
  }

  if (typeof virtualclass.raiseHand === 'object' && virtualclass.raiseHand != null) {
    if (!roles.hasControls()) {
      const rh = document.querySelector('.congrea .handRaise.disable');
      if (rh) {
        rh.classList.remove('disable');
        rh.classList.add('enable');
        rh.setAttribute('data-title', virtualclass.lang.getString('RaiseHandStdEnabled'));
        const icon = document.querySelector('.congrea .handRaise #icHr');
        icon.setAttribute('data-action', 'enable');
        virtualclass.raiseHand.stdRhEnable = 'enabled';
      }
    } else {
      virtualclass.raiseHand.rhCount = 0;
      virtualclass.raiseHand.rhCountR = 0;
      const handBt = document.querySelector('.congrea .vmchat_bar_button .hand_bt.highlight');
      if (handBt) {
        handBt.classList.remove('highlight');
      }
      const text = document.querySelector('.congrea .vmchat_bar_button .hand_bt #notifyText');
      if (text) {
        text.innerHTML = '';
      }
    }
  }

  const chatDiv = document.getElementById('chat_div');
  if (chatDiv !== null) {
    const chatHighlight = chatContainerEvent.elementFromShadowDom('.vmchat_room_bt.ui-state-highlight');
    if (chatHighlight) {
      chatHighlight.classList.remove('ui-state-highlight');
    }

    const videOff = document.querySelector('#virtualclassCont.congrea.student');
    if (videOff && videOff.classList.contains('videoff')) {
      videOff.classList.remove('videoff');
    }
    const userList = document.querySelector('#virtualclassCont #memlist');
    const chatrm = document.querySelector('#virtualclassCont #chatrm');

    const listTab = document.querySelector('#user_list');
    const chatroomTab = document.querySelector('#chatroom_bt2');


    if (userList && !userList.classList.contains('enable')) {
      userList.classList.add('enable');
      userList.classList.remove('disable');
      if (chatrm) {
        chatrm.classList.add('disable');
        chatrm.classList.remove('enable');
      }
    }

    if (chatroomTab !== null) {
      if (!listTab.classList.contains('active')) {
        listTab.classList.add('active');
      }
      chatroomTab.classList.remove('active');
    }

    virtualclass.chat.removeCommonChatNodes();
  }

  // if (virtualclass.serverData != null) {
  //   virtualclass.serverData.rawData = { video: [], ppt: [], docs: [] };
  //   if (roles.hasAdmin()) {
  //     virtualclass.serverData.fetchAllData();
  //   }
  // }

  // virtualclass.gObj.wIds = [0];
  virtualclass.wbCommon.order = [0];
  virtualclass.gObj.wbCount = 0;
  virtualclass.wbCommon.clearNavigation();
  if (typeof virtualclass.wb === 'object') {
    delete virtualclass.wb[virtualclass.gObj.currWb].activeToolColor;
  }
  virtualclass.gObj.currIndex = 1;
};
