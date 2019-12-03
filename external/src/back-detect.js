/* eslint-env es5 */
/* eslint no-undef: 0 */
/* eslint no-var: 0 */
/* eslint prefer-template: 0 */
/* eslint prefer-arrow-callback: 0 */


(function backDection(jQuery) {
  var $ = jQuery;
  var win = typeof window !== 'undefined' && window;
  var backDetectValues = {
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
  };

  /**
   * Back Detect
   *
   * @param function callback
   * @param int delay
   */
  $.fn.backDetect = function detectBackClick(callback, delay) {
    console.log('===> callback ', callback);
    console.log('===> delay ', delay);

    backDetectValues.frameThis = this;
    backDetectValues.frameCallBack = callback;
    if (delay !== null) {
      backDetectValues.frameDelay = delay;
    }
    if (backDetectValues.frameNavigator.indexOf('MSIE ') > -1 || backDetectValues.frameNavigator.indexOf('Trident') > -1) {
      setTimeout(function loadFrameIE() {
        $('<iframe src="' + backDetectValues.frameDataSrc + '?loading" style="display:none;" id="backDetectFrame" onload="jQuery.fn.frameInit();""></iframe>').appendTo(backDetectValues.frameThis);
      }, backDetectValues.frameDelay);
    } else {
      setTimeout(function loadFrame() {
        $("<iframe src='about:blank?loading' style='display:none;' id='backDetectFrame' onload='jQuery.fn.frameInit();'></iframe>").appendTo(backDetectValues.frameThis);
      }, backDetectValues.frameDelay);
    }
  };

  /**
   * Initialize Frame
   */
  $.fn.frameInit = function initFrame() {
    backDetectValues.frameDetect = document.getElementById('backDetectFrame');
    if (backDetectValues.frameLoaded > 1) {
      if (backDetectValues.frameLoaded === 2) {
        backDetectValues.frameCallBack.call(this);
        win.history.go(-1);
      }
    }
    backDetectValues.frameLoaded += 1;
    if (backDetectValues.frameLoaded === 1) {
      backDetectValues.frameTime = setTimeout(function beginFrameSetup() {
        jQuery.fn.setupFrames();
      }, 500);
    }
  };

  /**
   * Frame Setup
   */
  $.fn.setupFrames = function frameSetup() {
    clearTimeout(backDetectValues.frameTime);
    backDetectValues.frameSrc = backDetectValues.frameDetect.src;
    if (backDetectValues.frameLoaded === 1 && backDetectValues.frameSrc.indexOf('historyLoaded') === -1) {
      if (backDetectValues.frameNavigator.indexOf('MSIE ') > -1 || backDetectValues.frameNavigator.indexOf('Trident') > -1) {
        backDetectValues.frameDetect.src = backDetectValues.frameDataSrc + '?historyLoaded';
      } else {
        backDetectValues.frameDetect.src = 'about:blank?historyLoaded';
      }
    }
  };
}(jQuery));
