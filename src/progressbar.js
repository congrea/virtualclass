// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2015  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */


let prvTimeout;
const progressBar = {
  prvVal: '',
  currVal: '',

  /** *
   After each  progress of XHR, there would check difference
   between current and previous value. Will provide the download link
   if found the differences, Otherwise initialize function  progressInit()
   for trigger it after five minute.

   */

  progressInit() {
    const that = this;
    if (typeof prvTimeout !== 'undefined') {
      clearTimeout(prvTimeout);
    }
    prvTimeout = setTimeout(
      () => {
        if (that.prvVal === that.currVal
          && Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'downloadProgress')) {
          virtualclass.recorder.initMakeAvailDownloadFile();
        } else {
          that.prvVal = that.currVal;
          that.progressInit();
        }
      }, 50000,
    );
  },

  renderProgressBar(totalVal, portion, pbar, pval) {
    // console.log('===== totalVal ==== ' + totalVal + '; portion' + portion);

    if (portion > totalVal) {
      portion = totalVal;
      document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('playsessionmsg');
    }

    const totalProgress = (totalVal === 0 && portion === 0) ? 0 : Math.round((portion * 100) / totalVal);

    const pbarElem = document.getElementById(pbar);
    if (pbarElem != null) {
      pbarElem.style.width = `${totalProgress}%`;
    }

    if (pval >= 100) {
      const closeButton = document.getElementById('recordingClose');
      recordingClose.style.display = 'block';
      closeButton.addEventListener('click', () => {
        virtualclass.popup.closeElem();
      });
    }
  },

};
