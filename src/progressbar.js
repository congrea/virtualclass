// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2015  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 */

var progressBar = {
    prvVal: '',
    currVal: '',


    /***
        After each  progress of XHR, there would check difference
        between current and previous value. Will provide the download link
        if found the differences, Otherwise initialize function  progressInit()
        for trigger it after five minute.

   */

    progressInit: function () {

        var that = this;
        if (typeof prvTimeout != 'undefined') {
            clearTimeout(prvTimeout);
        }

        prvTimeout = setTimeout(
            function () {
                if (that.prvVal == that.currVal) {
                    if(!virtualclass.recorder.alreadyDownload){
                        virtualclass.recorder.makeAvailDownloadFile();
                    }

                } else {
                    that.prvVal = that.currVal;
                    that.progressInit();
                }
            }, 50000
        );
    },

    renderProgressBar: function (totalVal, portion, pbar, pval) {
        if (portion > totalVal) {
            portion = totalVal;
            document.getElementById('askplayMessage').innerHTML = virtualclass.lang.getString('playsessionmsg');
        }

        if (totalVal == 0 && portion == 0) {
            var totalProgress = 0;
        } else {
            var totalProgress = Math.round((portion * 100) / totalVal);
        }

        var pbarElem = document.getElementById(pbar);
        if (pbarElem != null) {
            pbarElem.style.width = totalProgress + '%';
        }

        var pvalElem = document.getElementById(pval);
        if (pvalElem != null) {
            pvalElem.innerHTML = totalProgress + '%';
        }

        if (pval >= 100) {
            var closeButton = document.getElementById('recordingClose');
            recordingClose.style.display = 'block';
            closeButton.addEventListener('click', function () {
                virtualclass.popup.closeElem();

            });
        }
    }
};