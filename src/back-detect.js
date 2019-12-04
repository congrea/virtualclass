/**
 * This module is used to detect the back press button of browser,
 * inspired from http://www.vvaves.net/jquery-backDetect/
 */
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
    this.backDetectValues.frameThis = document.querySelector(selector);
    this.window = window;
    this.backDetectValues.frameCallBack = callback;
    if (delay !== null) {
      this.backDetectValues.frameDelay = delay;
    }
    let frameSrc = 'about:blank?loading';
    if (this.backDetectValues.frameNavigator.indexOf('MSIE ') > -1
      || this.backDetectValues.frameNavigator.indexOf('Trident') > -1) {
      frameSrc = `${this.backDetectValues.frameDataSrc}?loading`;
    }
    setTimeout(() => {
      const iframeHtml = `<iframe src=${frameSrc} style='display:none;' id='backDetectFrame' onload='backDection.frameInit();'></iframe>`;
      this.backDetectValues.frameThis.insertAdjacentHTML('beforeEnd', iframeHtml);
    }, this.backDetectValues.frameDelay);
  },

  frameInit() {
    this.backDetectValues.frameDetect = document.getElementById('backDetectFrame');
    if (this.backDetectValues.frameLoaded === 2) {
      this.backDetectValues.frameCallBack.call(this);
      this.window.history.go(-1);
    }
    this.backDetectValues.frameLoaded += 1;
    if (this.backDetectValues.frameLoaded === 1) {
      this.backDetectValues.frameTime = setTimeout(() => {
        backDection.setupFrames();
      }, 500);
    }
  },

  setupFrames() {
    clearTimeout(this.backDetectValues.frameTime);
    this.backDetectValues.frameSrc = this.backDetectValues.frameDetect.src;
    if (this.backDetectValues.frameLoaded === 1 && this.backDetectValues.frameSrc.indexOf('historyLoaded') === -1) {
      if (this.backDetectValues.frameNavigator.indexOf('MSIE ') > -1
        || this.backDetectValues.frameNavigator.indexOf('Trident') > -1) {
        this.backDetectValues.frameDetect.src = `${this.backDetectValues.frameDataSrc}'?historyLoaded`;
      } else {
        this.backDetectValues.frameDetect.src = 'about:blank?historyLoaded';
      }
    }
  },
};
