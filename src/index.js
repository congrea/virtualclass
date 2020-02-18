/** *
 * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 ** */
$.uiBackCompat = false;
(function (window) {
  window.onload = async function () {
    const bootStraper = new window.Bootstrap();
    await bootStraper.setBasicData(window);
    await bootStraper.validDateSession();
    await bootStraper.loadData();
    await bootStraper.appInit();
    await bootStraper.setUpMedia();
    await bootStraper.readyToGo();
    await bootStraper.cache();
    virtualclass.serverData.syncComplete = false;
    await virtualclass.serverData.syncAllData().then(() => {
      if (virtualclass.currApp === 'DocumentShare' && virtualclass.dts) {
        virtualclass.dts.updateScreen();
      } else if (virtualclass.currApp === 'Video' && typeof virtualclass.videoUl.UI.rawVideoList() === 'object') {
        virtualclass.videoUl.UI.rawVideoList();
      } else if (virtualclass.currApp === 'SharePresentation' && virtualclass.serverData.rawData.ppt.length > 0) {
        virtualclass.sharePt.awsPresentationList(virtualclass.serverData.rawData.ppt);
      }

      virtualclass.vutil.requestOrder(() => {});
    });
    bootStraper.notifyAboutCPU();
    if (virtualclass.isPlayMode) {
      virtualclass.settings.triggerSettings();
    }
  };
}(window));
