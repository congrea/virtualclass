const backDection = {
  backDetectValues: {
    frameLoaded: 0,
    frameTry: 0,
    frameTime: 0,
    frameDetect: null,
    frameSrc: null,
    frameCallBack: null,
    frameThis: null,
    frameNavigator: window.navigator.userAgent,
    frameDelay: 0,
    frameDataSrc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
  },

  backDetect(selector, callback, delay) {
    backDection.backDetectValues.frameThis = document.querySelector(selector);
    backDection.window = window;
    backDection.backDetectValues.frameCallBack = callback;
    if (delay !== null) {
      backDection.backDetectValues.frameDelay = delay;
    }
    if (backDection.backDetectValues.frameNavigator.indexOf('MSIE ') > -1 || backDection.backDetectValues.frameNavigator.indexOf('Trident') > -1) {
      setTimeout(function loadFrameIE() {
        const iframeHtml = '<iframe src="' + backDection.backDetectValues.frameDataSrc + '?loading" style="display:none;" id="backDetectFrame" onload="backDection.frameInit();""></iframe>';
        backDection.backDetectValues.frameThis.insertAdjacentHTM('beforeEnd', iframeHtml);
      }, backDection.backDetectValues.frameDelay);
    } else {
      setTimeout(function loadFrame() {
        const iframeHtml = "<iframe src='about:blank?loading' style='display:none;' id='backDetectFrame' onload='backDection.frameInit();'></iframe>";
        backDection.backDetectValues.frameThis.insertAdjacentHTML('beforeEnd', iframeHtml);
      }, backDection.backDetectValues.frameDelay);
    }
  },

  frameInit() {
    backDection.backDetectValues.frameDetect = document.getElementById('backDetectFrame');
    if (backDection.backDetectValues.frameLoaded > 1) {
      if (backDection.backDetectValues.frameLoaded === 2) {
        backDection.backDetectValues.frameCallBack.call(this);
        backDection.window.history.go(-1);
      }
    }
    backDection.backDetectValues.frameLoaded += 1;
    if (backDection.backDetectValues.frameLoaded === 1) {
      backDection.backDetectValues.frameTime = setTimeout(function beginFrameSetup() {
        backDection.setupFrames();
      }, 500);
    }
  },

  setupFrames() {
    clearTimeout(backDection.backDetectValues.frameTime);
    backDection.backDetectValues.frameSrc = backDection.backDetectValues.frameDetect.src;
    if (backDection.backDetectValues.frameLoaded === 1 && backDection.backDetectValues.frameSrc.indexOf('historyLoaded') === -1) {
      if (backDection.backDetectValues.frameNavigator.indexOf('MSIE ') > -1 || backDection.backDetectValues.frameNavigator.indexOf('Trident') > -1) {
        backDection.backDetectValues.frameDetect.src = backDection.backDetectValues.frameDataSrc + '?historyLoaded';
      } else {
        backDection.backDetectValues.frameDetect.src = 'about:blank?historyLoaded';
      }
    }
  },
}
