/***
 * @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
***/
$.uiBackCompat = false;
(function (window) {
  window.onload = async function () {
    const bootStraper = new window.Bootstrap();
    await bootStraper.loadData(window);
    await bootStraper.appInit();
    await bootStraper.setUpData(window);
    await bootStraper.readyToGo();
  };
}(window));
