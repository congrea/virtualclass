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
                    //that.next();
                    virtualclass.vutil.navWhiteboard(that, that.next);

                    if(wbCommon.hasOwnProperty('setNextWhiteboardTime')){
                        clearTimeout(wbCommon.setNextWhiteboardTime);
                    }

                    if(virtualclass.currApp == 'Whiteboard'){
                        wbCommon.setNextWhiteboardTime = setTimeout(
                            function (){
                                /** We can not run zoomControlerFitToScreen as we need to retain canvas scale **/
                                virtualclass.zoom.normalRender();
                            }, 500
                        );
                    }
                }
            }
            var prevButton = document.querySelector('#virtualclassWhiteboard.whiteboard .prev');
            if (prevButton != null) {
                prevButton.onclick = function () {
                    // that.prev();
                    virtualclass.vutil.navWhiteboard(that, that.prev);
                    /** to set the dimension of whiteboard during window is resized **/
                    var currWb = virtualclass.wb[virtualclass.gObj.currWb];
                    if(typeof currWb == 'object'){
                        /* To handle the dimension of whiteboard on previous click, */
                        setTimeout(
                            function (){
                                console.log('whiteboard zoom normal render');
                                virtualclass.zoom.normalRender();
                                // system.setAppDimension(null, 'resize');
                                // virtualclass.view.window.resize();
                            },500
                        );
                    }
                }
            }
        },
        initNav:function(wIds){
            if (typeof this.indexNav == 'undefined') {
                this.indexNav = new pageIndexNav("WB")
            }

            this.indexNav.init();
            if (roles.hasControls()) {
                for (var i = 0; i < wIds.length; i++) {
                    virtualclass.wbCommon.indexNav.createWbIndex(wIds[i])
                }
            }
            // virtualclass.gObj.wbCount = wIds.length;
            virtualclass.wbCommon.indexNav.setTotalPages(wIds.length);

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
            this.identifyFirstNote(wid);
            if (!roles.hasControls()) {
                if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
                    virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currSlide);
                }
            }
            
           
        },

        hideElement : function (){
            var prevElem = document.querySelector('#virtualclassWhiteboard.whiteboard .current');
            if (prevElem != null) {
                console.log('Whiteboard slide remove');
                prevElem.classList.remove('current');
            }
        },
        currentWhiteboard : function (wid){
            var whiteboard = document.querySelector('#canvas' + wid);
            if(whiteboard == null){
                 this.hideElement();
                virtualclass.vutil.createWhiteBoard(wid);
                this.displaySlide(wid);
                virtualclass.gObj.currWb = wid;
            }
        },

        next: function () {
            this.hideElement();
            var wid = this.whiteboardWrapperExist('next');
            if (wid == null) {
                virtualclass.gObj.wbCount++;
                virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
                
                wid = '_doc_0' + '_' + virtualclass.gObj.wbCount;

                if(!this.whiteboardExist(wid)){
                    virtualclass.vutil.createWhiteBoard(wid);
                }
                virtualclass.wbCommon.indexNav.createWbIndex(virtualclass.gObj.wbCount);
                virtualclass.vutil.beforeSend({'cf': 'cwb', wbCount : virtualclass.gObj.wbCount});
                
            } else {
                if(!this.whiteboardExist(wid)){
                    virtualclass.vutil.createWhiteBoard(wid);
                }else {
                   //virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : wid});
                }
                virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : wid});
            }
            
            
            this.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveClass(wid)
            virtualclass.wbCommon.indexNav.UI.pageNavHandler("right");
            this.displaySlide(wid);
            virtualclass.gObj.currWb = wid;
        },

        setCurrSlideNumber : function (wid){
           var idn = wid.split('_');
            if(idn.length > 0){
               virtualclass.gObj.currSlide = idn[idn.length-1];
                if (!roles.hasControls()) {
                    if(typeof virtualclass.wbCommon.indexNav !== 'undefined'){
                        virtualclass.wbCommon.indexNav.studentWBPagination(virtualclass.gObj.currSlide);
                    }
                }
            } 
        },

        prev: function () {
            this.hideElement();
            var wid = this.whiteboardWrapperExist('prev');

            this.readyCurrentWhiteboard(wid);
            this.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveClass(wid)
            virtualclass.wbCommon.indexNav.UI.pageNavHandler("left");
        },

        readyCurrentWhiteboard : function (wid){
            if (wid != null) {
                if(!this.whiteboardExist(wid)){
                    virtualclass.vutil.createWhiteBoard(wid);
                    this.displaySlide(wid);
                    virtualclass.gObj.currWb = wid;

                }else {
                    this.displaySlide(wid);
                    virtualclass.gObj.currWb = wid;

                }
                virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : virtualclass.gObj.currWb});

                console.log('whiteboard slide send=' + virtualclass.gObj.currWb);
            } else {
                alert('Elemennt is NULL');
            }
        },

        whiteboardExist : function (wid){
            return (document.querySelector("#canvas" + wid) != null);
        },
        

        whiteboardWrapperExist: function (elemtype) {
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
            var note;
            for(var i=0; i< wids.length; i++){
                var wId = "_doc_0_"+wids[i];
                note  = document.querySelector('#note'+wId);
                if(note == null){
                    var myDiv = document.createElement('div');
                    myDiv.id = 'note'+wId;
                    myDiv.dataset.wbId =wId;
                    myDiv.className = "canvasContainer";
                    whiteboardWrapper.appendChild(myDiv);
                }
            }
            
            // this.reArrangeElements(wids)
        },
         /** this is only for whitebaord not for docs **/
         reArrangeElements : function (order){
            var container = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
            var tmpdiv = document.createElement('div');
                tmpdiv.className  = "whiteboardContainer";
            var id, dnode;
            for (var i = 0; i < order.length; i++) {
                id = 'note_doc_0_'+order[i];
                dnode = document.getElementById(id);
                if(tmpdiv != null && dnode != null){
                    tmpdiv.appendChild(dnode);
                } else {
                    console.log("Error temp div is null " + tmpdiv);
                }
            }
            container.parentNode.replaceChild(tmpdiv, container);
        },

        identifyFirstNote : function (wid){
            var elem = document.querySelector('#virtualclassWhiteboard');
            if(wid == '_doc_0_0'){
                elem.classList.add('firstNote');
            }else {
                elem.classList.remove('firstNote');
            }
        },

        removeAllContainers : function (){
            var allContainers = document.querySelectorAll('#virtualclassWhiteboard .whiteboardContainer .canvasContainer');
            var node;
            for (var i=0; i<allContainers.length; i++){
                node = allContainers[i];
                node.parentNode.removeChild(node);
            }
        },

        clearNavigation : function (){
            var dc = document.getElementById("dcPaging");
            while (dc.firstChild) {
                dc.removeChild(dc.firstChild);
            }

            virtualclass.wbCommon.indexNav.createWbIndex(0)
            // delete virtualclass.wbCommon.indexNav;
            //
            // if(virtualclass.hasOwnProperty('dts')){
            //     delete virtualclass.dts.indexNav;
            // }

        }
    }
    window.wbCommon = wbCommon;
})(window);