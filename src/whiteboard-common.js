/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var wbCommon = {
        initNavHandler: function () {
            var that = this;
            var nextButton = document.querySelector('#virtualclassWhiteboard.whiteboard .next');
            if (nextButton != null) {
                nextButton.onclick = function () {
                    that.next(this);
                }
            }
            var prevButton = document.querySelector('#virtualclassWhiteboard.whiteboard .prev');
            if (prevButton != null) {
                prevButton.onclick = function () {
                    that.prev();
                }
            }
        },

        /**
         * TODO, this should be merged with dislaySlide on document-share.js
         *
         */
        displaySlide: function (wid) {
            this.hideElement();
            var whiteboardContainer = document.querySelector('#note' + wid);
            if (whiteboardContainer != null) {
                whiteboardContainer.classList.add('current');
                virtualclass.gObj.currWb = wid;
            }
        },

        hideElement : function (){
            var prevElem = document.querySelector('#virtualclassWhiteboard.whiteboard .current');
            if (prevElem != null) {
                console.log('Whiteboard slide remove');
                prevElem.classList.remove('current');
            }
        },

        next: function (cthis) {
            this.hideElement();
            var wid = this.whiteboardExist('next');
            if (wid == null) {
                virtualclass.gObj.wbCount++;
                virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
                wid = '_doc_0' + '_' + virtualclass.gObj.wbCount;
                virtualclass.vutil.createWhiteBoard(wid);
            }else {
                virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : wid});
            }
            this.displaySlide(wid);
            virtualclass.gObj.currWb = wid;
        },

        prev: function () {
            this.hideElement();
            var wid = this.whiteboardExist('prev');
            if (wid != null) {
                this.displaySlide(wid);
                virtualclass.gObj.currWb = wid;
                virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : virtualclass.gObj.currWb});
                console.log('whiteboard slide send=' + virtualclass.gObj.currWb);
            } else {
                alert('Elemennt is NULL');
            }
        },

        whiteboardExist: function (elemtype) {
            var currWhiteboard = virtualclass.gObj.currWb;
            if (currWhiteboard != null) {
                var elem = document.querySelector("#note" + currWhiteboard);
                if (elemtype == 'prev') {
                    var whiteboard = elem.previousElementSibling;
                } else if (elemtype == 'next') {
                    var whiteboard = elem.nextElementSibling;
                }

                if (whiteboard != null) {
                    var wid = whiteboard.dataset.wbId;
                    return wid;
                }
                return null;
            }
        },

        readyElements : function (wids){
            
            var whiteboardWrapper = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
            var noteId;
            for(var i=0; i< wids.length; i++){
                var wId = "_doc_"+wids[i]+"_+"+wids[i];
                var myDiv = document.createElement('div');
                myDiv.id = 'note'+wId;
                myDiv.dataset.wbId =wId;
                myDiv.className = "canvasContainer";
                whiteboardWrapper.appendChild(myDiv);
            }
        }
    }

    window.wbCommon = wbCommon;
})(window);