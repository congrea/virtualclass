/* exported PopUp */
/**
 * PopUp.
 * @namespace
 */
// RvVanillaModal
const PopUp = (function (window, undefined) {
  const confirmbox = false;
  'use strict';
  /**
   * Modal constructor.
   * @constructor
   * @param {Object} options
   * @returns: {Object} this with public methods
   */
  function PopUp(options) {
    this.init(options);
    return this;
  }

  /**
   * @public: inits application.
   * @param: {Object} options
   */
  PopUp.prototype.init = function (options) {
    const defaults = {
      selector: '[data-rv-vanilla-modal]',
      modalSelector: '.rv-vanilla-modal',
      closeSelector: '.rv-vanilla-modal-close',
      showModalClassName: 'rv-vanilla-modal-is-open',
      showOverlay: true,
    };
    const self = this;

    /**
     * {Object} settings - stores global options
     */
    this.settings = extend(defaults, options);

    /**
     * {Array} of modal wrapper elements
     */
    this.modalElements = docQSA(this.settings.modalSelector);

    /**
     * {Array} of modal trigger elements
     */
    this.triggers = docQSA(this.settings.selector);

    /**
     * Checks if overlay option is enabled.
     */
    if (this.settings.showOverlay) {
      setupOverlay(() => {
        /**
         * {Object} modal overlay element
         */
        self.overlayElement = docQS('.rv-vanilla-modal-overlay');
      });
    }
  };

  /**
   * Closes modal.
   *
   * @public: closes modal
   * @param: {Object} targetElement
   */
  PopUp.prototype.close = function (targetElement) {
    targetElement.classList.remove(this.settings.showModalClassName);
    document.getElementById('popupContainer').style.display = 'none';

    if (this.settings.showOverlay) {
      this.overlayElement.classList.remove('is-shown');
    }
  };

  /**
   * @public: opens modal
   * @param: {Object} targetElement
   */
  PopUp.prototype.open = function (targetElement) {
    document.getElementById('popupContainer').style.display = 'block';

    this.sendBackOtherElems();

    // can be critical
    // var playButton = document.getElementById("playButton"); //inject code
    // if (playButton != null) {
    //    playButton.style.display = 'none'
    // }

    this.closeShownModal();
    targetElement.classList.add(this.settings.showModalClassName);

    if (this.settings.showOverlay) {
      this.overlayElement.classList.add('is-shown');
    }
  };

  /**
   * @public: loops through list of triggers and fires a callback
   * @returns: callback
   */
  PopUp.prototype.each = function (callback) {
    const array = [];
    array.forEach.call(this.triggers, (element) => {
      if (typeof callback === 'function') {
        callback(element);
      }
    });
  };

  /**
   * @public: closes modal if any is shown
   */
  PopUp.prototype.closeShownModal = function () {
    const array = [];
    const { showModalClassName } = this.settings;
    array.forEach.call(this.modalElements, (element) => {
      if (element.classList.contains(showModalClassName)) {
        element.classList.remove(showModalClassName);
      }
    });
  };

  PopUp.prototype.closeElem = function () {
    const mainModelCont = document.getElementById('popupContainer');
    mainModelCont.classList.remove('playPopup', 'loading');

    // console.log('close popup');
    if (virtualclass.recorder.waitServer === false) {
      const virtualclassToolCont = document.getElementById('virtualclassOptionsCont');
      if (virtualclassToolCont != null) {
        virtualclassToolCont.style.zIndex = 100;
      }

      const stickBar = document.getElementById('stickybar');
      if (stickBar != null) {
        stickBar.style.zIndex = 1000;
      }

      const commandToolsWrapper = document.getElementById('commandToolsWrapper');
      if (commandToolsWrapper != null) {
        commandToolsWrapper.style.pointerEvents = 'visible';
      }

      const mainPopCont = document.getElementById('about-modal');
      if (mainPopCont != null) {
        virtualclass.popup.close(mainPopCont);
      }

      const sessionEndCont = document.getElementById('sessionEndMsgCont');
      sessionEndCont.dataset.displaying = 'false';

      const endsessionvalidateurl = document.getElementById('uploadvideourl');
      endsessionvalidateurl.dataset.displaying = 'false';

      const pptvalidateurl = document.getElementById('uploadppturl');
      pptvalidateurl.dataset.displaying = 'false';


      const chatRoom = document.getElementById('chatrm');
      if (chatRoom != null) {
        // console.log('zIndex performing');
        chatRoom.style.zIndex = 1;
      }
      console.log('====> Removing connecting class');
      // remove connecting class
      const virtualclassContConatiner = document.querySelector('#virtualclassCont');
      const networkStatusContainer = document.querySelector('#networkStatusContainer');
      networkStatusContainer.classList.remove('connecting-room');
      virtualclassContConatiner.classList.remove('connecting');
      const connt = document.querySelector('#virtualclassApp');
      connt.classList.remove('try-to-connect');
      if (roles.hasControls()) {
        virtualclass.userInteractivity.triggerInitFirebaseOperation();
      } else {
        if (localStorage.getItem('mySession') != null) {
          const virtualclassCont = document.getElementById('virtualclassCont');
          virtualclassCont.classList.add('readyForNote');
          virtualclass.userInteractivity.triggerInitFirebaseOperation();
        }
      }
    }
  },

  PopUp.prototype.waitBlock = function () {
    // alert('suman bogati');
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();

    const recordPlay = document.getElementById('recordPlay');
    recordPlay.style.display = 'block';
    virtualclass.popup.replayWindowAction('none');
  };

  PopUp.prototype.waitBlockAction = function (action) {
    const wait = document.getElementById('recordPlay');
    wait.style.display = action;
  };


  // TODO this function should be improve
  PopUp.prototype.sendBackOtherElems = function (action) {
    const virtualclassToolCont = document.getElementById('virtualclassOptionsCont');

    if (virtualclassToolCont != null) {
      virtualclassToolCont.style.zIndex = 0;
    }

    const commandToolsWrapper = document.getElementById('commandToolsWrapper');

    if (commandToolsWrapper != null) {
      commandToolsWrapper.style.pointerEvents = 'none';
    }

    const stickBar = document.getElementById('stickybar');
    if (stickBar != null) {
      stickBar.style.zIndex = 0;
    }

    const chatrm = document.getElementById('chatrm');
    if (chatrm != null) {
      if (!virtualclass.isPlayMode) {
        chatrm.style.zIndex = 0;
      }
    }

    const audioWidget = document.getElementById('audioWidget');
    if (audioWidget != null) {
      audioWidget.style.zIndex = 0;
    }

    const chatWidget = document.getElementById('memlist');
    if (chatWidget != null) {
      chatWidget.style.zIndex = 0;
    }
  };


  PopUp.prototype.openProgressBar = function (nfile) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);

    this.hideAllPopups();

    document.getElementById('recordingContainer').style.display = 'block';
  };

  PopUp.prototype.replayWindow = function () {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();
    virtualclass.popup.replayWindowAction('block');
  };


  PopUp.prototype.sesseionEndWindow = function () {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();
    const sessionEndMsg = document.getElementById('sessionEndMsgCont');
    sessionEndMsg.style.display = 'block';
    sessionEndMsg.dataset.displaying = true;

    const sessionEndClose = document.getElementById('sessionEndClose');
    sessionEndClose.addEventListener('click',
      () => {
        virtualclass.popup.closeElem();
        window.close();
      });
  };

  PopUp.prototype.validateurlPopup = function (type) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();
    let mszPopup; let
      popupClose;
    if (type === 'video') {
      mszPopup = document.querySelector('#virtualclassCont.congrea #popupContainer #uploadvideourl');
      popupClose = document.querySelector('#virtualclassCont.congrea #popupContainer #vidPopupClose');
    } else if (type === 'presentation') {
      mszPopup = document.querySelector('#virtualclassCont.congrea #popupContainer #uploadppturl');
      popupClose = document.querySelector('#virtualclassCont.congrea #popupContainer #pptPopupClose');
    } else {
      // console.log('popup works for video and presentation');
    }
    mszPopup.style.display = 'block';
    mszPopup.dataset.displaying = true;

    popupClose.addEventListener('click',
      () => {
        virtualclass.popup.closeElem();
      });
  };
  PopUp.prototype.replayWindowAction = function (action) {
    const replayContainer = document.getElementById('replayContainer');
    replayContainer.style.display = action;
  };

  PopUp.prototype.progressBarAction = function (action) {
    const recordingContainer = document.getElementById('recordingContainer');
    recordingContainer.style.display = action;
  };

  /**
   * For confirm dialouge box,
   * @param message expects the message
   */
  PopUp.prototype.confirmInput = function (message, cb, label, type, index, id) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);

    this.hideAllPopups();

    const confirmId = 'confirm';

    const confirm = document.getElementById(confirmId);
    confirm.style.display = 'block';


    const allConfirmChildrens = confirm.getElementsByClassName('confirmChild');
    if (allConfirmChildrens.length > 0) {
      while (allConfirmChildrens.length >= 1) {
        allConfirmChildrens[0].parentNode.removeChild(allConfirmChildrens[0]);
      }
    }

    const confirmMessage = document.createElement('div');
    confirmMessage.id = `${confirmId}Message`;
    confirmMessage.className = 'confirmChild';

    confirmMessage.innerHTML = message;

    confirm.appendChild(confirmMessage);
    const that = this;

    const attachConfirmInit = function () {
      that.confirmInit(this.id, cb, label, type, index, id);
    };
    const confirmOkDiv = document.createElement('div');
    confirmOkDiv.id = 'confirmOk';
    confirmOkDiv.className = 'confirmButton confirmChild';
    confirmOkDiv.addEventListener('click', attachConfirmInit);

    const confirmOkButton = document.createElement('button');
    confirmOkButton.id = 'confirmOkButton';
    confirmOkButton.className = 'icon-check';
    // confirmOkButton.innerHTML  = 'Ok';
    confirmOkButton.innerHTML = virtualclass.lang.getString('confirmOk');

    confirmOkDiv.appendChild(confirmOkButton);
    confirm.appendChild(confirmOkDiv);


    const confirmCancelDiv = document.createElement('div');
    confirmCancelDiv.id = 'confirmCancel';
    confirmCancelDiv.className = 'confirmButton confirmChild';
    confirmCancelDiv.addEventListener('click', attachConfirmInit);

    const confirmCancelButton = document.createElement('button');
    confirmCancelButton.id = 'confirmCancelButton';
    confirmCancelButton.className = 'icon-close';
    confirmCancelButton.innerHTML = virtualclass.lang.getString('confirmCancel');
    confirmCancelDiv.appendChild(confirmCancelButton);
    confirm.appendChild(confirmCancelDiv);
  };

  PopUp.prototype.pollPopUp = function (cb, label) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);

    this.hideAllPopups();

    const confirmId = 'editPollCont';

    const confirm = document.getElementById(confirmId);
    confirm.style.display = 'block';

    const that = this;

    const attachConfirmInit = function () {
      // console.log(this.id);
      that.action(this.id, cb, label);
    };

    const elem = document.getElementById('pollCancel');
    if (elem == null) {
      const confirmCancelDiv = document.createElement('div');
      confirmCancelDiv.id = 'pollCancel';
      confirmCancelDiv.className = 'cancelBtn';
      confirmCancelDiv.addEventListener('click', attachConfirmInit);

      const confirmCancelButton = document.createElement('button');
      confirmCancelButton.id = 'confirmCancelButton';
      confirmCancelButton.className = 'icon-close';

      // confirmCancelButton.innerHTML = "Cancel";

      confirmCancelButton.innerHTML = virtualclass.lang.getString('pollCancel');


      confirmCancelDiv.appendChild(confirmCancelButton);
      confirm.appendChild(confirmCancelDiv);
    }

    const reset = document.getElementById('resetPoll');
    reset.addEventListener('click', attachConfirmInit);

    const addOpt = document.getElementById('addMoreOption');
    addOpt.addEventListener('click', attachConfirmInit);

    const save = document.getElementById('etSave');
    save.addEventListener('click', attachConfirmInit);
    const publish = document.getElementById('saveNpublish');
    publish.addEventListener('click', attachConfirmInit);
  };

  PopUp.prototype.action = function (userInput, cb, label, type, index, id) {
    cb(userInput);
  };

  PopUp.prototype.confirmInit = function (userInput, cb, label, type, index, id) {
    virtualclass.popup.closeElem();
    const confirm = (userInput === 'confirmOk') ? virtualclass.popup.confirmOk() : virtualclass.popup.confirmCancel();
    cb(confirm, label, type, index, id);
  };

  PopUp.prototype.confirmCancel = function () {
    return false;
  };

  PopUp.prototype.confirmOk = function () {
    return true;
  };


  PopUp.prototype.waitMsg = function (pageLoad) {
    let time = 0;
    if (typeof pageLoad !== 'undefined') {
      time = 1300;
    }
    setTimeout(() => {
      virtualclass.network.netWorkElementIsReady();
    }, time);

    if (typeof virtualclass.vutil === 'undefined' || !virtualclass.vutil.sesionEndMsgBoxIsExisting()) {
      this.hideAllPopups();
    }

    return;
    if (typeof virtualclass.vutil === 'undefined' || !virtualclass.vutil.sesionEndMsgBoxIsExisting()) {
      const element = document.getElementById('about-modal');
      virtualclass.popup.open(element);
      this.hideAllPopups();
      document.getElementById('waitMsgCont').style.display = 'block';
      const networkStatusContainer = document.querySelector('#networkStatusContainer');
    }
  };


  PopUp.prototype.chromeExtMissing = function () {
    const element = document.getElementById('about-modal');
    element.dataset.currPopup = 'chromeExt';
    virtualclass.popup.open(element);
    this.hideAllPopups();
    const sessionEndMsg = document.getElementById('chromeExtMiss');
    sessionEndMsg.style.display = 'block';

    if (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing) {
      virtualclass.gObj.studentSSstatus.mesharing = false;
    }

    const sessionEndClose = document.getElementById('chromeExtClose');
    sessionEndClose.addEventListener('click',
      () => {
        // if (roles.isStudent() && virtualclass.gObj.studentSSstatus.mesharing) {
        //   virtualclass.gObj.studentSSstatus.mesharing = false;
        // }
        virtualclass.popup.closeElem();
        element.dataset.currPopup = '';
      });
  };

  PopUp.prototype.generalMsg = function (msg) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();
    const sessionEndMsg = document.getElementById('generalMessage');
    sessionEndMsg.style.display = 'block';

    // sessionEndMsg.innnerHTML = msg;

    const msgCont = document.querySelector('#generalMessageMsg');
    msgCont.innerHTML = msg;

    const generalMessageClose = document.getElementById('generalMessageClose');

    generalMessageClose.addEventListener('click',
      () => {
        virtualclass.popup.closeElem();
      });
  };

  PopUp.prototype.infoMsg = function (msg) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();
    const sessionEndMsg = document.getElementById('infoMessage');
    sessionEndMsg.style.display = 'block';
    const msgCont = document.querySelector('#infoMessageMsg');
    msgCont.innerHTML = msg;
    const displayBtn = document.getElementById('infoMessageOk');
    displayBtn.innerHTML = 'ok';
    const generalMessageClose = document.getElementById('infoMessageOk');

    generalMessageClose.addEventListener('click',
      () => {
        virtualclass.popup.closeElem();
      });
  };

  PopUp.prototype.generalMsgButton = function (msg) {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();

    const msgCont = document.querySelector('#generalMessageButton');
    if (msgCont != null) {
      msgCont.style.display = 'block;';
      const msgButton = document.querySelector('#generalMessageButton .button');
      msgButton.addEventListener('click', () => {
        virtualclass.popup.closeElem();
      });
    }
  };

  PopUp.prototype.hideAllPopups = function () {
    const allPopuContainer = document.getElementsByClassName('popupWindow');
    for (let i = 0; i < allPopuContainer.length; i++) {
      allPopuContainer[i].style.display = 'none';
    }
  };

  PopUp.prototype.closePopup = function () {
    virtualclass.popup.closeElem();
    const sessionEndCont = document.getElementById('sessionEndMsgCont');
    if (sessionEndCont.dataset.displaying === 'true') {
      this.sesseionEndWindow();
    }
  };

  PopUp.prototype.loadingWindow = function () {
    const element = document.getElementById('about-modal');
    virtualclass.popup.open(element);
    this.hideAllPopups();

    const loadingWindow = document.querySelector('#loadingWindowCont');
    if (loadingWindow != null) {
      loadingWindow.style.display = 'block';
      element.parentNode.classList.add('loading');
    }
  };

  /**
   * @private: short version of querySelectorAll
   * @param: {string} selector - css-like
   * @returns: {Array|NodeList} selector list
   */
  function docQSA(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * @private: short version of querySelector
   * @param: css-like selector
   * @returns: {Object} first DOM selector
   */
  function docQS(selector) {
    return document.querySelector(selector);
  }

  /**
   * @private: merge defaults with user options
   * @param: defaults settings and user options
   * @returns: merged values of defaults and options
   */
  function extend(defaults, options) {
    const extended = {};
    let prop;
    for (prop in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
        extended[prop] = defaults[prop];
      }
    }
    for (prop in options) {
      if (Object.prototype.hasOwnProperty.call(options, prop)) {
        extended[prop] = options[prop];
      }
    }
    return extended;
  }

  /**
   * @private: creates overlay element
   * @param: callback - on finish
   * @returns: callback
   */
  function setupOverlay(callback) {
    const div = document.createElement('div');
    div.classList.add('rv-vanilla-modal-overlay');
    docQS('body').appendChild(div);
    if (typeof callback === 'function') {
      callback();
    }
  }

  return PopUp;
}(window));
