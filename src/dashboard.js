/**
 * This class dashBoard is use to  create common behaviours(methods)
 * for following features Document, Video and Presentation Sharing
 * */

var dashBoard = {
  userConfirmation(msg, cb) {
    virtualclass.popup.confirmInput(msg, (confirm) => {
      cb(confirm);
    });
  },

  close() {
    // console.log('Close dashboard');
    const closeButton = document.querySelector('#congdashboard .modal-content button.close');
    if (closeButton != null) {
      closeButton.classList.remove('clicked');
      closeButton.click();
      const navButton = document.querySelector('#dashboardnav button');
      if (navButton != null) {
        navButton.classList.remove('clicked');
      }
      virtualclass.modal.hideModal();
      // closeButton.classList.remove('clicked');
    }
  },

  isDashBoardExit(app) {
    return (document.querySelector(`#${app}Dashboard`) != null);
  },

  isDashBoardNavExist() {
    return (document.querySelector('#dashboardnav') != null);
  },

  actualCloseHandler() {
    const closeButton = document.querySelector('#congdashboard .modal-content button.close');
    if (closeButton != null) {
      closeButton.addEventListener('click', () => {
        const navButton = document.querySelector('#dashboardnav button');
        if (navButton != null) {
          navButton.classList.remove('clicked');
          const Dtype = 'open';
          dashBoard.dashBoardClickTooltip(Dtype);
        }
      });
    }
  },

  clickCloseButton() {
    const navButton = document.querySelector('#dashboardnav button');
    if (navButton != null) {
      navButton.classList.add('clicked');
    }
  },

  dashBoardClickTooltip(Dtype) {
    const dashBoardButton = document.querySelector('#dashboardnav button');
    if (virtualclass.currApp == 'Video') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}videoDashboard`));
    } else if (virtualclass.currApp == 'SharePresentation') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}SharePresentationdbHeading`));
    } else if (virtualclass.currApp == 'DocumentShare') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}dsDbheading`));
    } else {
      // console.log('dashboard tooltip not working properly');
    }
  },
};
