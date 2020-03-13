// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2020  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */
class Rightbar {
  handleRightBar(action){
    if (action) {
      action === 'open' ? virtualclass.vutil.openRightbar() : virtualclass.vutil.closedRightbar();
    } else {
      const elem = document.getElementById('virtualclassApp');
      if (elem.classList.contains('openRightbar')) {
        virtualclass.vutil.closedRightbar();
      } else {
        virtualclass.vutil.openRightbar();
      }
    }

    if (virtualclass.currApp === 'ScreenShare') {
      if ((roles.isStudent() && !virtualclass.gObj.studentSSstatus.mesharing)
        || (roles.isTeacher() && virtualclass.gObj.studentSSstatus.mesharing)) {
        virtualclass.studentScreen.doOpposite = true;
        virtualclass.studentScreen.triggerFitControl();
        virtualclass.ss.triggerFitToScreen();
      }
    } else {
      virtualclass.zoom.doOpposite = true;
      virtualclass.zoom.triggerFitToScreen();
    }
  }

  handleDisplayRightBar(selector){
    const activeElement = document.querySelectorAll('#rightSubContainer .rightContainer.active');
    for (let i = 0; i < activeElement.length; i++) {
      if (activeElement[i]) activeElement[i].classList.remove('active');
    }
    // const element = document.querySelector('#virtualclassCont.congrea #askQuestion');
    const element = document.querySelector(selector);
    if (element) element.classList.add('active');
    this.handleChatWidget();
  }

  handleChatWidget() {
    const memlist = document.getElementById('memlist');
    if (memlist) {
      memlist.classList.remove('enable');
      if (!memlist.classList.contains('disable')) {
        memlist.classList.add('disable');
      }
    }

    const searchbox = document.getElementById('congreaUserSearch');
    if (searchbox) {
      searchbox.style.display = 'none';
    }

    const chatroom = document.getElementById('chatrm');
    if (chatroom) {
      if (chatroom.classList.contains('enable')) {
        chatroom.classList.remove('enable');
        chatroom.classList.add('disable');
      }
    }

    const taChrm = document.getElementById('ta_chrm2');
    if (taChrm) {
      taChrm.style.display = 'none';
    }
  }

  handleDisplayBottomRightBar(element) {
    console.log('====> click right bar ');
    const stickycontainer = document.querySelector('#stickycontainer .bottomright.active');
    if (stickycontainer) stickycontainer.classList.remove('active');
    element.classList.add('active');
    this.handlerHeader(element.dataset.headerid);
    const virtualclassAppRightPanel = document.getElementById('virtualclassAppRightPanel');
    if (virtualclassAppRightPanel != null) virtualclassAppRightPanel.dataset.currwindow = element.dataset.headerid;
  }

  handlerHeader(selector) {
    const activeRightBarHeader = document.querySelector('#rightBarHeader .active');
    if (activeRightBarHeader) activeRightBarHeader.classList.remove('active');

    const elementToBeActive = document.querySelector(`#${selector}`);
    if (elementToBeActive) elementToBeActive.classList.add('active');
  }
}
