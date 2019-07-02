/***
 * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
***/
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
  };
}(window));
