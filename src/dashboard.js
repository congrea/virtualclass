/**
 * This class dashboard is use to  create common behaviours(methods)
 * for following features Document, Video and Presentation Sharing
 * */

const dashboard = {
  userConfirmation(msg, cb) {
    virtualclass.popup.confirmInput(msg, (confirm) => {
      cb(confirm);
    });
  },

  init(currApp, hidepopup) {
    if (currApp === 'SharePresentation') {
      const dbcont = document.querySelector('#pptDbCont');
      if (!dbcont) {
        if (document.querySelector('.docsDbCont') == null) {
          document.querySelector('#SharePresentationDashboard').innerHTML = virtualclass.vutil.getPptDashBoard('SharePresentation');
        }
        virtualclass.sharePt.attachEvent('submitpurl', 'click', virtualclass.sharePt.initNewPpt);
        if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
          virtualclass.sharePt.showPpts(virtualclass.sharePt.ppts);
          virtualclass.sharePt.retrieveOrder();
        }
      }
    }
    const allDbContainer = document.querySelectorAll('#congdashboard .dbContainer');
    for (let i = 0; i < allDbContainer.length; i++) {
      if (allDbContainer[i].dataset.app === virtualclass.currApp) {
        allDbContainer[i].style.display = 'block';
      } else {
        allDbContainer[i].style.display = 'none';
      }
    }

    // console.log(`Dashboard is created for ${virtualclass.currApp}`);
    if (currApp === 'DocumentShare') {
      if (typeof hidepopup === 'undefined') {
        this.open();
      }

      if (virtualclass.dts.noteExist()) {
        virtualclass.vutil.hideUploadMsg('docsuploadContainer'); // file uploader container
      }
      //  virtualclass.vutil.attachEventToUploadTab();
    } else if (currApp === 'Video') {
      if (typeof hidepopup === 'undefined') {
        virtualclass.modal.showModal();
      }
    } else {
      virtualclass.modal.showModal();
    }

    virtualclass.dashboard.actualCloseHandler();
    this.displayHeaderText();
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
    }
  },

  open() {
    virtualclass.modal.showModal();
    virtualclass.dashboard.clickCloseButton();
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
          dashboard.dashBoardClickTooltip(Dtype);
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
    const dt = 'data-title';
    if (virtualclass.currApp === 'Video') {
      dashBoardButton.parentNode.setAttribute(dt, virtualclass.lang.getString(`${Dtype}videoDashboard`));
    } else if (virtualclass.currApp === 'SharePresentation') {
      dashBoardButton.parentNode.setAttribute(dt, virtualclass.lang.getString(`${Dtype}SharePresentationdbHeading`));
    } else if (virtualclass.currApp === 'DocumentShare') {
      dashBoardButton.parentNode.setAttribute(dt, virtualclass.lang.getString(`${Dtype}dsDbheading`));
    } else {
      // console.log('dashboard tooltip not working properly');
    }
  },

  dashBoardNavHandler() {
    const app = document.querySelector('.congrea #virtualclassApp');
    if (this.classList.contains('clicked')) {
      virtualclass.dashboard.close();
      if (app) {
        if (app.classList.contains('dashboard')) {
          app.classList.remove('dashboard');
        }
      }
    } else {
      if (app && !app.classList.contains('dashboard')) app.classList.add('dashboard');

      virtualclass.dashboard.init(virtualclass.currApp);
      this.classList.add('clicked');
      const Dtype = 'close';
      virtualclass.dashboard.dashBoardClickTooltip(Dtype);

      if (virtualclass.currApp === 'DocumentShare' && Object.prototype.hasOwnProperty.call(virtualclass, 'dts')) {
        virtualclass.dts.moveProgressbar();
        if (virtualclass.dts.docs.currNote != null) {
          virtualclass.dts.setCurrentNav(virtualclass.dts.docs.currNote);
        }

        const notes = document.querySelector('.dbContainer #listnotes .linknotes');
        if (notes) {
          const btn = document.querySelector('.congrea.teacher  #dashboardContainer .modal-header button.enable');
          if (!btn) {
            virtualclass.vutil.showFinishBtn();
          }
        } else {
          virtualclass.vutil.removeFinishBtn();
        }
      }
    }
  },
  initDashboardNav(currVideo) {
    if (roles.hasControls()) {
      let dashboardnav = document.querySelector('#dashboardnav button');

      if (dashboardnav == null) {
        const dbNavTemp = virtualclass.getTemplate('dashboardNav');
        const context = { app: virtualclass.currApp };
        const dbNavHtml = dbNavTemp(context);

        const virtualclassAppOptionsCont = document.querySelector('#virtualclassAppOptionsCont');
        virtualclassAppOptionsCont.insertAdjacentHTML('beforeend', dbNavHtml);

        dashboardnav = document.querySelector('#dashboardnav button');
        if (dashboardnav != null) {
          dashboardnav.addEventListener('click', this.dashBoardNavHandler);
          if (currVideo) {
            virtualclass.dashboard.readyDashboard(currVideo);
          }
        }
      }

      if (virtualclass.currApp === 'DocumentShare') {
        if (!virtualclass.dts.noteExist()) {
          this.readyDashboard();
          const virtualclassApp = document.getElementById('virtualclassApp');
          if (virtualclassApp) virtualclassApp.classList.add('dashboard');
          // console.log('====> DOCUMENT SHARE SUMAN 10.00');
        } else {
          // console.log('====> DOCUMENT SHARE SUMAN 10.01');
          if (!virtualclass.dts.isUploaderExist()) {
            virtualclass.vutil.modalPopup('docs', ['docsuploadContainer']);
          }
          const dtitle = document.getElementById('dashboardnav');
          dtitle.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
        }
      } else if (virtualclass.currApp === 'Video') {
        if (typeof currVideo === 'undefined') {
          this.readyDashboard();
          this.displayHeaderText();
        }
        const videoPlaying = document.querySelector('.congrea #listvideo .linkvideo.playing');
        if (!videoPlaying) {
          virtualclass.vutil.removeFinishBtn();
        }
      } else {
        this.readyDashboard();
        this.displayHeaderText();
        const sharing = document.querySelector('.congrea .pptSharing');
        if (sharing) {
          virtualclass.dashboard.close();
        }
      }
    } else {
      virtualclass.dts.init();
    }

    if (virtualclass.currApp === 'DocumentShare' && Object.prototype.hasOwnProperty.call(virtualclass, 'dts')) {
      virtualclass.dts.moveProgressbar();
    }
  },

  readyDashboard(currVideo) {
    let dashboardNavgation;
    let createElem;
    let cont;
    let dbHtml;
    let hidepopup;
    const { currApp } = virtualclass;
    if (document.querySelector('#congdashboard') === null) {
      const dashboardTemp = virtualclass.getTemplate('dashboard');
      document.querySelector('#dashboardContainer').innerHTML = dashboardTemp({ app: currApp });
      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null) {
        dashboardnav.classList.add('clicked');
      }
    }

    this.modalCloseHandler();
    dashboardNavgation = document.getElementById('dashboardnav');

    // in any other application we can handle
    // dashoard content in own style
    // console.log('====> DOCUMENT SHARE SUMAN 1.0');
    if (currApp === 'DocumentShare') {
      dashboardNavgation.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        createElem = document.createElement('div');
        cont = document.querySelector('#congdashboard .modal-body');
        cont.appendChild(createElem);
        createElem.id = `${currApp}Dashboard`;
      }
      const docsDbCont = document.querySelector('#docsDbCont');
      if (docsDbCont) {
        docsDbCont.parentNode.removeChild(docsDbCont);
      }

      document.querySelector(`#${currApp}Dashboard`).innerHTML = virtualclass.vutil.getDocsDashBoard(currApp);
      virtualclass.dts.init();
      virtualclass.vutil.attachEventToUploadTab();
      if (!virtualclass.dts.isUploaderExist()) {
        virtualclass.vutil.modalPopup('docs', ['docsuploadContainer']);
      }
      virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
      virtualclass.vutil.makeElementActive('#listnotes');
    } else if (currApp === 'Video') {
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        createElem = document.createElement('div');
        cont = document.querySelector('#congdashboard .modal-body');
        cont.appendChild(createElem);
        createElem.id = `${currApp}Dashboard`;
      }

      const videocont = document.querySelector('#videoPopup');
      if (!videocont) {
        const videoDashboard = virtualclass.getTemplate('popup', 'videoupload');
        dbHtml = videoDashboard();
        const videodb = document.querySelector('#VideoDashboard');
        videodb.insertAdjacentHTML('beforeend', dbHtml);
        // $('#VideoDashboard').append(dbHtml);
        const msz = document.querySelector('#videoPopup  #uploadMsz div');
        if (msz) {
          msz.parentNode.removeChild(msz);
        }
        virtualclass.vutil.attachEventToUpload();
        virtualclass.videoUl.UI.inputUrl();
      }
      /* modal need to be created again and old one to be deleted, to remove conflict
       with events of drag drops */
      virtualclass.videoUl.UI.popup(currVideo);
      virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
      virtualclass.vutil.makeElementActive('#listvideo');

      if (currVideo && currVideo.init.videoUrl) {
        hidepopup = true;
      }

      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null && !hidepopup && !virtualclass.vutil.isDashboardOpened()) {
        dashboardnav.click();
      }
    } else if (currApp === 'SharePresentation') {
      dashboardNavgation.setAttribute('data-title', virtualclass.lang.getString('SharePresentationdbHeading'));
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        const dashboardContainer = document.createElement('div');
        const congdashboardModal = document.querySelector('#congdashboard .modal-body');
        congdashboardModal.appendChild(dashboardContainer);
        dashboardContainer.id = `${currApp}Dashboard`;
      }
      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null && !virtualclass.vutil.isDashboardOpened()) {
        dashboardnav.click();
      }
    }
    // in case dashboard already created and button is enabled in previous app
  },

  modalCloseHandler() {
    if (!this.attachModalCloseHandler) {
      const finish = document.querySelector('.congrea .dashboardContainer .modal-header .close');
      if (finish) {
        this.attachModalCloseHandler = true
        // console.log('====> modal init handler');
        finish.addEventListener('click', () => {
          const app = document.querySelector('.congrea #virtualclassApp');
          if (app.classList.contains('dashboard')) {
            app.classList.remove('dashboard');
          }
          finish.setAttribute('data-dismiss', 'modal');
          virtualclass.modal.hideModal();
        });
      }
    }
  },

  displayHeaderText() {
    const moodleHeader = document.querySelector('#congdashboard .modal-header h4');
    if (moodleHeader != null) {
      moodleHeader.innerHTML = virtualclass.lang.getString(`${virtualclass.currApp}dbHeading`);
    }
  },
};
