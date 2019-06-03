/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
    var wbCommon = {
        order: [0],
        wbInd: 0,
        initNavHandler: function () {
            var that = this;
            var nextButton = document.querySelector('#virtualclassWhiteboard.whiteboard .next');


            if (nextButton != null) {
                nextButton.onclick = function () {
                    virtualclass.vutil.navWhiteboard(that, that.next);
                    if (wbCommon.hasOwnProperty('setNextWhiteboardTime')) {
                        clearTimeout(wbCommon.setNextWhiteboardTime);
                    }
                    if (virtualclass.currApp == 'Whiteboard') {
                        wbCommon.setNextWhiteboardTime = setTimeout(
                            function () {
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
                    if (typeof currWb == 'object') {
                        /* To handle the dimension of whiteboard on previous click, */
                        setTimeout(
                            function () {
                                console.log('whiteboard zoom normal render');
                                // virtualclass.zoom.normalRender();
                                // system.setAppDimension(null, 'resize');
                                //  virtualclass.view.window.resize();
                                virtualclass.zoom.normalRender();
                            }, 500
                        );
                    }
                }
            }
        },
        initNav: function (wIds) {
            if (typeof this.indexNav == 'undefined') {
                this.indexNav = new pageIndexNav("WB")
            }

            this.indexNav.init();
            if (roles.hasControls()) {
                for (var i = 0; i < wIds.length; i++) {
                    virtualclass.wbCommon.indexNav.createWbNavigationNumber(wIds[i], wIds[i])
                }
                virtualclass.wbCommon.indexNav.addActiveNavigation(virtualclass.gObj.currWb);

                var wbOrder = localStorage.getItem('wbOrder');
                if (wbOrder != null) {
                    wbOrder = JSON.parse(wbOrder);
                    virtualclass.wbCommon.order = wbOrder;
                }

                if (this.order.length > 1) {
                    virtualclass.wbCommon.rearrangeNav(this.order);
                    this.rearrange(this.order)
                }

            } else {
                var curr = virtualclass.gObj.currIndex - 1 || virtualclass.gObj.currSlide;
                virtualclass.wbCommon.indexNav.studentWBPagination(curr);
            }
            var dc = document.querySelector("#dcPaging")
            dc.onchange = function () {
                //alert(this.value);
                virtualclass.wbCommon.setCurrSlideNumber(this.value);
                virtualclass.wbCommon.indexNav.addActiveNavigation(this.value)
                virtualclass.wbCommon.readyCurrentWhiteboard(this.value);
                virtualclass.gObj.currWb = this.value;
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
            this.identifyLastNote(wid);
            if (!roles.hasControls()) {
                if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
                    var curr = virtualclass.gObj.currIndex - 1 || virtualclass.gObj.currSlide;
                    virtualclass.wbCommon.indexNav.studentWBPagination(curr);
                }
            }


        },

        hideElement: function () {
            var prevElem = document.querySelector('#virtualclassWhiteboard.whiteboard .current');
            if (prevElem != null) {
                console.log('Whiteboard slide remove');
                prevElem.classList.remove('current');
            }
        },
        currentWhiteboard: function (wid) {
            var whiteboard = document.querySelector('#canvas' + wid);
            if (whiteboard == null) {
                this.hideElement();
                virtualclass.vutil.createWhiteBoard(wid);
                this.displaySlide(wid);
                virtualclass.gObj.currWb = wid;
            }
        },

        next: function () {
            this.hideElement();
            var wid = this.whiteboardWrapperExist('next');
//            if (wid == null) {
//                virtualclass.gObj.wbCount++;
//                virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
//                wid = '_doc_0' + '_' + virtualclass.gObj.wbCount;
//                var currIndex = this.order.indexOf(virtualclass.gObj.wbCount)
//                if(!this.whiteboardExist(wid)){
//                    virtualclass.vutil.createWhiteBoard(wid,currIndex);
//                }

            virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.wbCount);
            virtualclass.vutil.beforeSend({'cf': 'cwb', wbCount: virtualclass.gObj.wbCount, currIndex: currIndex});

            // } else {
            var i = wid.slice(7);
            var currIndex = this.order.indexOf(i)
            if (!this.whiteboardExist(wid)) {
                virtualclass.vutil.createWhiteBoard(wid, currIndex);
            } else {
                //virtualclass.vutil.beforeSend({'cf': 'cwb', diswb : true, wid : wid});
            }

            virtualclass.vutil.beforeSend({'cf': 'cwb', diswb: true, wid: wid, currIndex: currIndex});
            //}

            this.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveNavigation(wid)
            virtualclass.wbCommon.indexNav.UI.pageNavHandler("right");
            this.displaySlide(wid);

            virtualclass.gObj.currWb = wid;

        },
        newPage: function () {
            this.hideElement();
            var wb = virtualclass.gObj.currWb;
            var i = wb.slice(7);


            virtualclass.gObj.wbCount++;
            var widn = this.whiteboardWrapperExist('next');
            if (virtualclass.gObj.hasOwnProperty('currSlide') && virtualclass.gObj.wIds.indexOf(Number(virtualclass.gObj.wbCount)) == -1) {
                console.log('wids, From virtualclass ');
                virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
            }

            var wid = '_doc_0' + '_' + virtualclass.gObj.wbCount;
            //this.order(virtualclass.gObj.wbCount)
            var currIndex = this.order.indexOf(i)
            if (!this.whiteboardExist(wid)) {
                virtualclass.vutil.createWhiteBoard(wid, currIndex);
            }


            this.setCurrSlideNumber(wid);

            virtualclass.wbCommon.indexNav.UI.pageNavHandler("right");
            this.displaySlide(wid);

            //var ch = document.querySelector('#note' + wb)
            //var ch2 = document.querySelector('#note' + '_doc_0' + '_' + virtualclass.gObj.wbCount);
            //ch.parentNode.insertBefore(ch2, ch.nextSibling)


            var ind = 0;
            if (widn == null) {
                this.order.push(virtualclass.gObj.wbCount)
                virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.wbCount, virtualclass.gObj.wbCount);
                ind = this.order.length
                virtualclass.wbCommon.identifyLastNote(virtualclass.gObj.currWb);
            } else {
                var ind = this.order.indexOf(i);
                this.order.splice(ind + 1, 0, virtualclass.gObj.wbCount);
                this.rearrange(this.order)
                this.indexNav.index = ind + 1;
                this.rearrangeNav(this.order);
                //virtualclass.gObj.wIds

            }
            this.wbInd = ind + 1;
            virtualclass.vutil.beforeSend({'cf': 'cwb', wbCount: virtualclass.gObj.wbCount, currIndex: ind + 1});
            virtualclass.gObj.currWb = wid;
            this.indexNav.setTotalPages(virtualclass.gObj.wIds.length);
            //virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.wbCount,n);

            virtualclass.wbCommon.indexNav.addActiveNavigation(virtualclass.gObj.currWb)
            var dc = document.querySelector("#dcPaging")
            dc.onchange = function () {
                //alert(this.value);
                virtualclass.wbCommon.setCurrSlideNumber(this.value);
                virtualclass.wbCommon.indexNav.addActiveNavigation(this.value)
                virtualclass.wbCommon.readyCurrentWhiteboard(this.value);
                virtualclass.gObj.currWb = this.value;
            }
        },

        rearrange: function (order) {
            var container = document.getElementsByClassName('whiteboardContainer')[0],
                tmpdiv = document.createElement('div');
            //tmpdiv.id = "listppt";
            tmpdiv.className = "whiteboardContainer";
            //var orderChange = false;

//            for (var j = 0; j < virtualclass.sharePt.activeppts.length; j++) {
//                if (order.indexOf(virtualclass.sharePt.activeppts[j].fileuuid) <= -1) {
//                    order.push(virtualclass.sharePt.activeppts[j].fileuuid);
//                    orderChange = true;
//                }
//            }

            for (var i = 0; i < order.length; i++) {
                var elem = document.getElementById('note_doc_0_' + order[i])
                if (elem) {
                    tmpdiv.appendChild(elem);
                }
            }

            container.parentNode.replaceChild(tmpdiv, container);

            //if (orderChange) {
            //  virtualclass.wbCommon.order = order;
            //virtualclass.vutil.sendOrder("presentation", virtualclass.sharePt.order);
            // orderChange = false;
            // }
        },
        rearrangeNav: function (order) {
            var e = document.querySelector("#dcPaging");
            e.innerHTML = "";

            for (var i = 0; i <= virtualclass.gObj.wbCount; i++) {
                virtualclass.wbCommon.indexNav.createWbNavigationNumber(order[i], i);

            }
            //virtualclass.wbCommon.indexNav.addActiveNavigation(this.indexNav.order.indexOf(virtualclass.gObj.currWb), virtualclass.gObj.currWb)

            if (virtualclass.currApp == "Whiteboard") {
                var n1 = virtualclass.gObj.currWb.split("doc_0_")[1];
            }
            var num = this.order.indexOf(n1);
            var index = document.querySelector(".congrea #dcPaging .noteIndex.active");
            if (index) {
                index.classList.remove("active");
            }
            //var curr = virtualclass.dts.docs.currNote;
            var curr = num
            var index = document.querySelector("#index" + n1);
            if (index) {
                index.classList.add("active");
                index.selected = "selected"
            }
            var rActive = document.querySelector("#dcPaging .hid.right.active");
            var lActive = document.querySelector("#dcPaging .hid.left.active");
            if (rActive || lActive) {
                var currIndex;
                var dir;
                if (rActive) {
                    currIndex = rActive.title;
                    dir = "right"
                } else {
                    currIndex = lActive.title;
                    dir = "left"
                }
                //this.adjustPageNavigation(parseInt(currIndex), dir);
            }

            if (virtualclass.currApp == 'Whiteboard') {
                this.index = (+curr) + 1;
            } else {
                this.index = (currIndex != null) ? currIndex : (index != null && typeof index != 'undefined') ? index.title : 1;
                if (!virtualclass.dts.order.length) {
                    this.index = 0
                }
                var nav = document.querySelector("#docShareNav");
                if (!this.index) {
                    nav.classList.add('hide');
                    nav.classList.remove('show');
                } else {
                    nav.classList.add('show');
                    nav.classList.remove('hide');
                }
            }

        },


        setCurrSlideNumber: function (wid) {
            var idn = wid.split('_');
            if (idn.length > 0) {
                virtualclass.gObj.currSlide = idn[idn.length - 1];
                if (!roles.hasControls()) {
                    if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
                        var curr = virtualclass.gObj.currIndex - 1 || virtualclass.gObj.currSlide;
                        virtualclass.wbCommon.indexNav.studentWBPagination(curr);
                    }
                }
            }
        },

        prev: function () {
            this.hideElement();
            var wid = this.whiteboardWrapperExist('prev');
            this.readyCurrentWhiteboard(wid);
            this.setCurrSlideNumber(wid);
            virtualclass.wbCommon.indexNav.addActiveNavigation(wid)
            virtualclass.wbCommon.indexNav.UI.pageNavHandler("left");
            var prvsTool = document.querySelector("#" + virtualclass.wb[wid].prvTool);
            if (prvsTool != null && !prvsTool.classList.contains("active")) {
                prvsTool.classList.add("active");
            }
        },

        readyCurrentWhiteboard: function (wid) {
            if (wid != null) {
                if (!this.whiteboardExist(wid)) {
                    virtualclass.vutil.createWhiteBoard(wid);
                    this.displaySlide(wid);
                    virtualclass.gObj.currWb = wid;
                } else {
                    this.displaySlide(wid);
                    virtualclass.gObj.currWb = wid;
                }
                virtualclass.vutil.beforeSend({'cf': 'cwb', diswb: true, wid: virtualclass.gObj.currWb});

                console.log('whiteboard slide send=' + virtualclass.gObj.currWb);
            } else {
                alert('Elemennt is NULL');
            }
        },

        whiteboardExist: function (wid) {
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

        readyElements: function (wids) {
            var whiteboardWrapper = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
            var note;
            for (var i = 0; i < wids.length; i++) {
                var wId = "_doc_0_" + wids[i];
                note = document.querySelector('#note' + wId);
                if (note == null) {
                    var myDiv = document.createElement('div');
                    myDiv.id = 'note' + wId;
                    myDiv.dataset.wbId = wId;
                    myDiv.className = "canvasContainer";
                    whiteboardWrapper.appendChild(myDiv);
                }
            }

            // this.reArrangeElements(wids)
        },
        /** this is only for whitebaord not for docs **/
        reArrangeElements: function (order) {
            var container = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
            var tmpdiv = document.createElement('div');
            tmpdiv.className = "whiteboardContainer";
            var id, dnode;
            for (var i = 0; i < order.length; i++) {
                id = 'note_doc_0_' + order[i];
                dnode = document.getElementById(id);
                if (tmpdiv != null && dnode != null) {
                    tmpdiv.appendChild(dnode);
                } else {
                    console.log("Error temp div is null " + tmpdiv);
                }
            }
            container.parentNode.replaceChild(tmpdiv, container);
        },

        identifyFirstNote: function (wid) {
            var elem = document.querySelector('#virtualclassWhiteboard');
            if (wid == '_doc_0_0') {
                elem.classList.add('firstNote');
            } else {
                elem.classList.remove('firstNote');
            }
        },
        identifyLastNote: function (wid) {
            var elem = document.querySelector('#virtualclassWhiteboard');
            var index = this.order.indexOf(wid.slice(7));
            if (index + 1 == this.order.length) {
                elem.classList.add('lastNote');
            } else {
                elem.classList.remove('lastNote');
            }
        },


        removeAllContainers: function () {
            var allContainers = document.querySelectorAll('#virtualclassWhiteboard .whiteboardContainer .canvasContainer');
            var node;
            for (var i = 0; i < allContainers.length; i++) {
                node = allContainers[i];
                node.parentNode.removeChild(node);
            }
        },

        clearNavigation: function () {
            var dc = document.getElementById("dcPaging");
            while (dc.firstChild) {
                dc.removeChild(dc.firstChild);
            }

            if (roles.hasControls()) {
                virtualclass.wbCommon.indexNav.createWbNavigationNumber(0, 0);
            } else {

                var pageNo = document.createElement('span')
                pageNo.id = "stdPageNo";
                dc.appendChild(pageNo);
                virtualclass.wbCommon.indexNav.studentWBPagination(0);
            }
        },

        deleteWhiteboard: function (wbId) {
            delete virtualclass.wb[wbId];
            delete virtualclass.pdfRender[wbId];
            if (virtualclass.currApp == 'Whiteboard') {
                var containerWb_doc = document.querySelector('#containerWb' + wbId);
                if (containerWb_doc != null) {
                    containerWb_doc.parentNode.removeChild(containerWb_doc);
                }
            }
        }
    }
    window.wbCommon = wbCommon;
})(window);