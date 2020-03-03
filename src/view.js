// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
(function (window) {
  let doit;
  let view = {
    /**
     * Initializing the view
     * @returns view object
     */
    init() {
      this.msgBoxClass = 'msgBox';
      this.window = {};
      this.virtualWindow = {};
      return this;
    },
    /**
     *
     * @param  msg message to be displayed
     * @param  id id of the container
     * @param  className of the container
     * @param intoAppend element to which message box is appended
     * @param  imageTag  boolean value
     */
    displayMessage(msg, id, className, intoAppend, imageTag, wid) {
      let msgBox;
      if (typeof imageTag === 'undefined') {
        msgBox = this.createMsgBox(msg, id, className);
      } else {
        msgBox = this.createMsgBox(msg, id, className, imageTag);
      }
      const parTag = document.getElementById(`vcanvas${wid}`);
      if (typeof intoAppend !== 'undefined') {
        document.getElementById(intoAppend + wid).appendChild(msgBox);
      } else {
        parTag.insertBefore(msgBox, parTag.childNodes[0]);
      }
    },
    /**
     * Generating error message
     * @param  msg Message to be displayed as an error
     * @param  contId id of the error container
     * @param  addBefore id of the containere before which error container to be placed
     * @return errorCont.id id of the error container
     */
    createErrorMsg(msg, contId, addBefore, attribute) {
      const cpuNotCompatible = document.querySelector('#errorContainer .notcompatiblecpu');
      if (cpuNotCompatible !== null) { // HIGH PRIORITY ERROR
        return;
      }
      let classes = 'error';
      let errorCont = document.getElementById(contId);
      let closebutton;
      if (errorCont == null) {
        errorCont = document.createElement('div');
        errorCont.id = contId;
        errorCont.innerHTML = `<span className="${classes}">${msg}</span>`;
      } else {

        if (attribute != null) {
          if (Object.prototype.hasOwnProperty.call(attribute, 'className')) {
            const elem = document.querySelector(`#${contId}.${attribute.className}`);
            if (elem != null) {
              elem.parentNode.removeChild(elem);
            }
            classes += ` ${attribute.className}`;
          }
        }

        const spanMsg = `<span className="${classes}">${msg}</span>`;

        errorCont.innerHTML = spanMsg;
      }

      const msgId = 'closeMsg';
      closebutton = document.querySelector(`#${msgId}`);

      if (closebutton == null) {
        closebutton = document.createElement('span');
        closebutton.id = 'closeMsg';
        closebutton.innerHTML = 'x';
        errorCont.appendChild(closebutton);
      }

      closebutton.onclick = function () {
        const parentelem = document.querySelector(`#${contId}`);
        parentelem.parentNode.removeChild(parentelem);
      };

      const addBeforeElem = document.getElementById(addBefore);
      if (addBeforeElem !== null) {
        addBeforeElem.parentNode.insertBefore(errorCont, addBeforeElem);
      }
      return errorCont.id;
    },

    createAskQuestionMsg(msg, contId, addBefore, attribute) {
      const cpuNotCompatible = document.querySelector('#msgContainer');
      if (cpuNotCompatible !== null) { // HIGH PRIORITY ERROR
        return;
      }
      let classes = 'askQuestionMsg';
      let cont = document.getElementById(contId);
      if (cont == null) {
        cont = document.createElement('div');
        cont.id = contId;
        cont.innerHTML = `<span className="${classes}">${msg}</span>`;
      } else {
        if (attribute != null) {
          if (Object.prototype.hasOwnProperty.call(attribute, 'className')) {
            const elem = document.querySelector(`#${contId}.${attribute.className}`);
            if (elem != null) {
              elem.parentNode.removeChild(elem);
            }
            classes += ` ${attribute.className}`;
          }
        }
        const spanMsg = `<span className="${classes}">${msg}</span>`;

        cont.innerHTML = spanMsg;
      }

      const msgId = 'closeAskQuestionMsg';
      let closebutton = document.querySelector(`#${msgId}`);

      if (closebutton == null) {
        closebutton = document.createElement('span');
        closebutton.id = 'closeAskQuestionMsg';
        closebutton.innerHTML = 'X';
        cont.appendChild(closebutton);
      }

      closebutton.onclick = function () {
        const parentelem = document.querySelector(`#${contId}`);
        parentelem.parentNode.removeChild(parentelem);
      };

      const addBeforeElem = document.querySelector(`.${addBefore}`);
      if (addBeforeElem !== null) {
        addBeforeElem.parentNode.insertBefore(cont, addBeforeElem);
      }
      return cont.id;
    },
    /**
     * Removes the error message
     * @param  id of the error container
     * @param  onlyLatest boolean value  true or false
     * @returns doesnt return anything
     */
    removeErrorMsg(id, onlyLatest) {
      const delNode = document.getElementById(id);
      if (typeof onlyLatest !== 'undefined') {
        const errMsgArr = delNode.innerHTML.split(/<br>|<br\\>/);
        if (errMsgArr.length > 1) {
          errMsgArr.shift();
          delNode.innerHTML = errMsgArr.join();
          return;
        }
      }
      delNode.parentNode.removeChild(delNode);
    },
    // Todo no need of this function
    removeErrorContainer(id) {
      const element = document.getElementById(id);
      element.parentNode.removeChild(element);
    },
    /**
     * Creating HTML element
     * @param  tagName tag to be created
     * @param  id id of the tag name
     * @param className classname of the tag
     * @returns  tag return tag name
     */
    customCreateElement(tagName, id, className) {
      const tag = document.createElement(tagName);
      if (typeof id !== 'undefined' && id) {
        tag.id = id;
      }

      if (typeof className !== 'undefined') {
        tag.className = className;
      }
      return tag;
    },
    /**
     * creating the message box to be displayed
     * @param  msg message to be displayed
     * @param id id of the container
     * @param  className class of the container
     * @param imageTag boolean value
     * @returns returns the container for the message
     */
    createMsgBox(msg, id, className, imageTag) {
      const divTag = this.customCreateElement('div', id, className);
      if (typeof imageTag === 'undefined') {
        const imageHolder = this.customCreateElement('div', `${id}img`, `${className}img`);
        divTag.appendChild(imageHolder);
      }
      const pTag = this.customCreateElement('p', `${id}Para`);
      pTag.innerHTML = msg;
      divTag.appendChild(pTag);
      return divTag;
    },
    /**
     * Removing  message boxes those are not needed on selection of an api application.
     * @param classname classname of the message box that are not needed
     */
    disappearBox(className) {
      const allDivs = document.getElementsByClassName(this.msgBoxClass + className);
      if (allDivs[0] != null) {
        allDivs[0].parentNode.removeChild(allDivs[0]);
      }
    },
    /**
     * Checking for the availability of webRtc
     * @param classname class webRtc
     */
    multiMediaMsg(className) {
      let msg;
      if (virtualclass.system.mybrowser.name === 'Firefox') {
        msg = virtualclass.lang.getString('wbrtcMsgFireFox');
        // Todo handle sthis is in better way
        // this.displayMessage(msg, "fireFoxWebrtcCont", this.msgBoxClass + className);
      } else if (virtualclass.system.mybrowser.name === 'Chrome') {
        msg = virtualclass.lang.getString('wbrtcMsgChrome');
        // Todo handle this is in better way
        // this.displayMessage(msg, "chormeWebrtcCont", this.msgBoxClass + className);
      }
    },
    /**
     * displaying the message on canvas drawing
     * @param  className
     */
    canvasDrawMsg(className, id) {
      let msg;
      const mainContainer = document.getElementById(`vcanvas${id}`);
      mainContainer.classList.add('canvasMsgBoxParent');
      if (virtualclass.system.mybrowser.name === 'Firefox') {
        msg = virtualclass.lang.getString('canvasDrawMsg');
        this.displayMessage(msg, 'canvasDrawMsgContFirefox', this.msgBoxClass + className, 'containerWb');
      } else if (virtualclass.system.mybrowser.name === 'Chrome') {
        msg = virtualclass.lang.getString('canvasDrawMsg');
        this.displayMessage(msg, 'canvasDrawMsgContChrome', this.msgBoxClass + className, 'containerWb', null, id);
      }
    },
    /**
     * Drawing the label
     * @param className class of the label

     */
    drawLabel(className, id) {
      const msg = virtualclass.lang.getString('drawArea');
      this.displayMessage(msg, 'canvasDrawArea', this.msgBoxClass + className, 'containerWb', false, id);
    },
    /**
     * displaying message
     * @param  id   id of the element
     * @param  msg message to be displayed
     */
    displayMsgBox(id, msg) {
      const div = this.customCreateElement('div', id);
      const p = this.customCreateElement('p', `${id}Para`);
      p.innerHTML = virtualclass.lang.getString(msg);
      div.appendChild(p);
      const a = this.customCreateElement('a', `${id}Anchor`);
      // Given full path on here could be a problem at l.vidya.io
      // when presenter resize the window with whiteboard and reload the application
      a.href = '#';
      // a.href = window.location;
      a.innerHTML = virtualclass.lang.getString('reload');
      a.onclick = function () {
        window.location.reload();
      };
      div.appendChild(a);
      const panelId = (id === 'divForReloadMsg') ? 'virtualclassCont' : 'virtualclassAppLeftPanel';
      const virtualclassCont = document.getElementById(panelId);
      virtualclassCont.insertBefore(div, virtualclassCont.firstChild);
    },
    /**
     * Displaying server errors
     * @param id    id of the container to display message
     * @param msg   message to be displayed

     */
    displayServerError(id, msg) {
      const div = this.customCreateElement('div', id);
      div.innerHTML = msg;
      const vcanvas = document.getElementById('vcanvas');
      vcanvas.parentNode.insertBefore(div, vcanvas);
    },
    /**
     *
     * @param  id id of the element to be removed
     * @returns
     */
    removeElement(id) {
      const errorDiv = document.getElementById(id);
      if (errorDiv != null) {
        errorDiv.parentNode.removeChild(errorDiv);
      }
    },
    /**
     * Disabling screen share user interface if screen share is not available
     */
    disableSSUI() {
      const sTool = document.getElementById('virtualclassScreenShareTool');
      if (sTool != null) {
        sTool.style.opacity = '0.5';
        sTool.style.pointerEvents = 'none';
      }
    },
    /**
     * Disabling  left application bar if there is an error and virtual class need to be disabled
     *
     */
    disableLeftAppBar() {
      // debugger;
      const lefAppBar = document.getElementById('virtualclassOptionsCont');
      if (lefAppBar != null) {
        lefAppBar.style.opacity = '0.5';
        lefAppBar.style.pointerEvents = 'none';
      }
    },

  };
  view = view.init();

  view.window.resizeFinished = (function () {
    let timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  }());

  // Set container dimension (width and height)
  view.window.resize = function (wid) {
    const res = virtualclass.system.measureResoultion({ width: window.innerWidth, height: window.innerHeight });
    if (virtualclass.currApp === 'DocumentShare') {
      res.width -= 10;
      if (roles.hasControls()) {
        res.height -= 100;
      } else {
        res.height -= 40;
      }
    }

    const cwb = virtualclass.gObj.currWb;
    if (typeof cwb !== 'undefined' && (typeof virtualclass.wb[cwb] !== 'undefined')
      && Object.prototype.hasOwnProperty.call(virtualclass.wb[cwb], 'vcan')) {
      virtualclass.wb[cwb].vcan.renderAll();
    }
    view.windowResizeFinished();
  },

  // this funciton is triggered when
  // resize is finished
  // nirmala
  view.windowResizeFinished = function () {
    clearTimeout(doit);
    doit = setTimeout(() => {
      view._windowResizeFinished();
    }, 100);
  };
  // change by nirmala
  view._windowResizeFinished = function () {
    if (virtualclass.system.device === 'mobTab') {
      vhCheck();
    }

    if (((virtualclass.currApp == 'Whiteboard' || virtualclass.currApp === 'DocumentShare')
      && virtualclass.gObj.currWb != null && typeof virtualclass.gObj.currWb !== 'undefined'
    ) || virtualclass.currApp === 'ScreenShare') {
      /** * Remove black screen on resizing of doucmet sharing window * */
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'fitToScreenOnResize')) {
        clearTimeout(virtualclass.gObj.fitToScreenOnResize);
      }

      virtualclass.gObj.fitToScreenOnResize = setTimeout(
        () => {
          if (virtualclass.currApp === 'ScreenShare') {
            virtualclass.ss.triggerFitToScreen();
          } else {
            const fitToscreen = document.querySelector('.zoomControler .fitScreen');
            if (fitToscreen != null) {
              // fitToscreen.click();
              virtualclass.zoom.zoomAction('fitToScreen');
            }
          }
        }, 700,
      );
    }

    virtualclass.chat.calculateViewPortForMessageBox();

    if (virtualclass.gObj.inputFocusHandler) {
      clearTimeout(virtualclass.gObj.inputFocusHandler);
    }
    virtualclass.gObj.inputFocusHandler = setTimeout(() => {
      console.log('===> triger input focus');
      if (!virtualclass.gObj.notHandleInputFocusHandler) {

        if (document.getElementById('virtualclassCont').dataset.currwindow === 'normal') {
          // const virtualclassCont = document.querySelector('#virtualclassCont.focusInput');
          if (window.innerHeight >= virtualclass.gObj.initHeight) {
            virtualclass.vutil.inputFocusOutHandler();
          } else {
            virtualclass.vutil.inputFocusHandler();
          }
        }
        if (window.innerWidth > window.innerHeight) { // Apply only on landscape mode
          virtualclass.gObj.initHeight = window.innerHeight;
        }
      }
      delete virtualclass.gObj.notHandleInputFocusHandler;
    }, 1100);

    // virtualclass.stickybarWidth();
    // virtualclass.chatBarTabWidth();
  };

  window.view = view;
}(window));
