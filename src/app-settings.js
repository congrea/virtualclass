(function (window, document) {
  /**
   * This is the main object which has properties and methods
   * Through this properties and methods all the front stuff is happening
   * eg:- creating, storing and replaying the objects
   */

  const appSetting = function () {
    return {
      init() {
        const toggle = document.getElementById('appSettingCtrl');
        if (toggle) {
          toggle.addEventListener('click', () => {
            const appSettingDetail = document.getElementById('appSettingDetail');
            if (appSettingDetail.classList.contains('active')) {
              appSettingDetail.classList.remove('active');
            } else {
              appSettingDetail.classList.add('active');
            }
          });
        }
      },
    };
  };
  window.appSetting = appSetting();
}(window, document));
