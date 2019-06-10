(function (window) {
  function Bootstrap() {}

  Bootstrap.prototype.loadData = function (window) {
    window.earlierWidth = window.innerWidth;
    window.earlierHeight = window.innerHeight;
    window.wbUser = wbUser;
    window.pageEnter = new Date().getTime();

    const virtualclass = new window.virtualclass();

    virtualclass.config.data = {};

    virtualclass.virtualclassIDBOpen = window.virtualclassOpenDB;

    window.virtualclass = virtualclass; // Need virtualclass object in each file

    virtualclass.gObj.displayError = 1;
    virtualclass.lang = {};
    virtualclass.lang.getString = window.getString;
    virtualclass.lang.message = window.message;

    // TODO, this has to be performed afte loaded the data from local storage and default

    virtualclass.createMainContainer();

    virtualclass.gObj.sessionClear = false;
    virtualclass.settings = window.settings;
    virtualclass.settings.init();
    virtualclass.handleCurrentUserWithPrevious();
    virtualclass.ioEventApi = ioEventApi;

    virtualclass.gObj.mobileVchOffset = vhCheck();
    localStorage.setItem("settings", virtualclass.settings.temp);
    let wIds = localStorage.getItem('wIds');
    if (wIds != null) {
      wIds = JSON.parse(wIds);
      virtualclass.gObj.wids = wIds;
      virtualclass.gObj.wbCount = wIds.length - 1;
    }

    const anypresenter = localStorage.getItem('anyp');
    if (anypresenter == null) {
      localStorage.setItem('anyp', wbUser.anyonepresenter);
    } else {
      if (anypresenter != wbUser.anyonepresenter) {
        localStorage.removeItem('uRole');
        localStorage.setItem('anyp', wbUser.anyonepresenter);
      }
    }

    wbUser.virtualclassPlay = parseInt(wbUser.virtualclassPlay, 10);
    if (wbUser.virtualclassPlay) {
      virtualclass.gObj.sessionClear = true;
      virtualclass.gObj.role = 's';
      localStorage.removeItem('teacherId');
      wbUser.id = 99955551230;
      virtualclass.gObj.uid = wbUser.id;
    }


    const capitalizeFirstLetter = function (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const previousApp = JSON.parse(localStorage.getItem('prevApp'));
    virtualclass.gObj.prevApp = previousApp;


    if (previousApp != null) {
      virtualclass.previousApp = previousApp;
      var appIs = capitalizeFirstLetter(previousApp.name);

      if (previousApp.name == 'Yts' || (previousApp.name == 'DocumentShare')) {
        if (previousApp.metaData == null) {
          var videoObj = null;
        } else {
          var videoObj = previousApp.metaData;
          videoObj.fromReload = true;
        }
      } else if (previousApp.name == 'Video') {
        if (previousApp.metaData == null || previousApp.metaData.init == null) {
          var videoObj = null;
        } else {
          var videoObj = previousApp.metaData;
          videoObj.fromReload = true;
        }
      } else if (previousApp.name == 'Whiteboard') {
        if (wIds == null) {
          virtualclass.gObj.wbCount = previousApp.wbn;
        }

        const currSlide = localStorage.getItem('currSlide');
        if (currSlide != null) {
          virtualclass.gObj.currSlide = currSlide;
        }
      }
    } else {
      var appIs = virtualclass.gObj.defaultApp;
    }

    if (typeof videoObj === 'undefined') {
      var videoObj = null;
    }

    virtualclass.precheck = localStorage.getItem('precheck');
    var isPrecheck = localStorage.getItem('precheck');
    if (isPrecheck != null) {
      virtualclass.isPrecheck = JSON.parse(isPrecheck);
    }

    if (wbUser.virtualclassPlay) {
      virtualclass.isPrecheck = false;
      virtualclass.enablePreCheck = false;
    } else {
      virtualclass.precheck = localStorage.getItem('precheck');

      virtualclass.enablePreCheck = true;

      var isPrecheck = localStorage.getItem('precheck');
      if (isPrecheck != null) {
        virtualclass.isPrecheck = JSON.parse(isPrecheck);
      }
    }

    virtualclass.popup = new PopUp({
      showOverlay: true,
    });

    if (virtualclass.enablePreCheck && (virtualclass.isPrecheck == null || !virtualclass.isPrecheck)) {
      virtualclass.makePreCheckAvailable = true;
    } else {
      virtualclass.makePreCheckAvailable = false;
      virtualclass.popup.waitMsg('refresh');
    }

    if (localStorage.getItem('beTeacher') != null) {
      // Set flag for delete the session when
      // new student become teacher
      virtualclass.gObj.doEndSession = true;
      virtualclass.gObj.beTeacher = true;
      wbUser.role = 't';
      virtualclass.gObj.uRole = 't';
      localStorage.setItem('uRole', 't');
      localStorage.removeItem('beTeacher');
      console.log('From locastorage:- beteacher found');
    }
    virtualclass.gObj.fromPageRefresh = true;
    virtualclass.config.data.appIs = appIs;
    virtualclass.config.data.videoObj = videoObj;
  };

  Bootstrap.prototype.appInit = async function () {

    if (!virtualclass.isPlayMode && localStorage.getItem('mySession') === 'thisismyplaymode') {
      localStorage.clear();
      virtualclass.init(wbUser.role, virtualclass.config.data.appIs, virtualclass.config.data.videoObj);
      await virtualclass.storage.config.endSession();
    } else {
      await virtualclass.init(wbUser.role, virtualclass.config.data.appIs, virtualclass.config.data.videoObj);
    }

    if (virtualclass.system.mybrowser.name === 'Edge') {
      const virtualclassContainer = document.getElementById('virtualclassCont');
      if (virtualclassContainer != null) {
        virtualclassContainer.classList.add('edge');
      }
    }

    // TODO this both setinterval functions should be merged into one\
    if (!wbUser.virtualclassPlay) {
      virtualclass.editorRich.veryInit();
      virtualclass.editorCode.veryInit();
    }
  };

  Bootstrap.prototype.setUpData = function (window) {
    if (virtualclass.vutil.isMiniFileIncluded('wb.min')) {
      virtualclass.gObj.displayError = 0;
    }

    if (window.virtualclass.error.length > 2) {
      window.virtualclass.error = [];
      return;
    }

    virtualclass.vutil.initDefaultInfo(wbUser.role, virtualclass.config.data.appIs);


    if (roles.isStudent()) {
      const audioEnable = localStorage.getItem('audEnable');
      if (audioEnable !== null) {
        if (audioEnable.ac === 'false') {
          virtualclass.user.control.mediaWidgetDisable();
          virtualclass.gObj.audioEnable = false;
        }
      }
    }

    virtualclass.gObj.memberlistpending = [];
    virtualclass.gObj.veryFirstJoin = true;
    virtualclass.gObj.testChatDiv = document.querySelector('#chat_div');
    virtualclass.gObj.testChatDiv.attachShadow({ mode: 'open' });
  }

  Bootstrap.prototype.readyToGo = function (){
    virtualclass.vutil.attachClickOutSideCanvas();
    if (virtualclass.vutil.isPlayMode()) {
      virtualclass.vutil.clearEverthing();
    }

    if (virtualclass.isPrecheck != null) {
      if (typeof virtualclass.videoHost.gObj.MYSPEED === 'undefined') {
        virtualclass.videoHost.gObj.MYSPEED = 1;
      }
      virtualclass.videoHost.afterSessionJoin();
    }
  }
  window.Bootstrap = Bootstrap;
}(window));
