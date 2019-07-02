/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  var wbCommon = {
    order: [0],
    wbInd: 0,
    initNavHandler() {
      const that = this;
      const nextButton = document.querySelector('#virtualclassWhiteboard.whiteboard .next');


      if (nextButton != null) {
        nextButton.onclick = function () {
          virtualclass.vutil.navWhiteboard(that, that.next);
          if (wbCommon.hasOwnProperty('setNextWhiteboardTime')) {
            clearTimeout(wbCommon.setNextWhiteboardTime);
          }
          if (virtualclass.currApp == 'Whiteboard') {
            wbCommon.setNextWhiteboardTime = setTimeout(
              () => {
                /** We can not run zoomControlerFitToScreen as we need to retain canvas scale * */
                virtualclass.zoom.normalRender();
              }, 500,
            );
          }
        };
      }
      const prevButton = document.querySelector('#virtualclassWhiteboard.whiteboard .prev');
      if (prevButton != null) {
        prevButton.onclick = function () {
          // that.prev();
          virtualclass.vutil.navWhiteboard(that, that.prev);
          /** to set the dimension of whiteboard during window is resized * */
          const currWb = virtualclass.wb[virtualclass.gObj.currWb];
          if (typeof currWb === 'object') {
            /* To handle the dimension of whiteboard on previous click, */
            setTimeout(
              () => {
                console.log('whiteboard zoom normal render');
                // virtualclass.zoom.normalRender();
                // system.setAppDimension(null, 'resize');
                //  virtualclass.view.window.resize();
                virtualclass.zoom.normalRender();
              }, 500,
            );
          }
        };
      }
    },

    initNav(wIds) {
      if (typeof this.indexNav === 'undefined') {
        this.indexNav = new pageIndexNav('WB');
      }
      let currentPageNumber = virtualclass.gObj.currIndex ||  wIds.length;

      this.indexNav.init();
      if (roles.hasControls()) {
        let wbOrder = localStorage.getItem('wbOrder');
        if (wbOrder != null) {
          wbOrder = JSON.parse(wbOrder);
          virtualclass.wbCommon.order = wbOrder;
        }

        if (this.order.length > 1) {
          virtualclass.wbCommon.rearrangeNav(this.order);
          this.rearrange(this.order);
          let currentIndex = localStorage.getItem('currIndex');
          if (currentIndex !==  null) {
            currentPageNumber = currentIndex;
          }
        }
        virtualclass.wbCommon.indexNav.createWbNavigationNumber(currentPageNumber);
        virtualclass.wbCommon.indexNav.addActiveNavigation(virtualclass.gObj.currWb);

      } else {
        const curr = virtualclass.gObj.currIndex || virtualclass.gObj.currSlide;
        virtualclass.wbCommon.indexNav.studentWBPagination(curr);
      }

      virtualclass.wbCommon.indexNav.setTotalPages(wIds.length);
    },

    /**
     * TODO, this should be merged with dislaySlide on document-share.js
     *
     */
    displaySlide(wid) {
      this.hideElement();
      const whiteboardContainer = document.querySelector(`#note${wid}`);
      if (whiteboardContainer != null) {
        whiteboardContainer.classList.add('current');
        virtualclass.gObj.currWb = wid;
      }
      this.identifyFirstNote(wid);
      // this.identifyLastNote(wid);
      if (!roles.hasControls()) {
        if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
          const curr = virtualclass.gObj.currIndex || virtualclass.gObj.currSlide;
          virtualclass.wbCommon.indexNav.studentWBPagination(curr);
        }
      }
    },

    hideElement() {
      const prevElem = document.querySelector('#virtualclassWhiteboard.whiteboard .current');
      if (prevElem != null) {
        console.log('Whiteboard slide remove');
        prevElem.classList.remove('current');
      }
    },
    currentWhiteboard(wid) {
      const whiteboard = document.querySelector(`#canvas${wid}`);
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
      if (wid !== null) {
        this.readyCurrentWhiteboard(wid);
        this.setCurrSlideNumber(wid);
        virtualclass.wbCommon.indexNav.addActiveNavigation(wid)
        virtualclass.wbCommon.indexNav.UI.pageNavHandler("right");
        let currIndex = this.order.indexOf(wid.slice(7));

        this.identifyLastNote(wid);
        virtualclass.gObj.currWb = wid;

        virtualclass.gObj.currIndex = currIndex+1;

        virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
        virtualclass.vutil.beforeSend({'cf': 'cwb', diswb: true, wid: wid, currIndex: virtualclass.gObj.currIndex});
        // localStorage.setItem('currIndex', virtualclass.gObj.currIndex);
      }

      console.log('==== current slide ', virtualclass.gObj.currSlide);
      this.identifyFirstNote(wid);

      // virtualclass.vutil.beforeSend({'cf': 'cwb', wbCount : virtualclass.gObj.wbCount});
    },

    prev() {
      this.hideElement();
      const wid = this.whiteboardWrapperExist('prev');
      const currIndex = +(wid.split('_doc_0_')[1]);

      this.readyCurrentWhiteboard(wid);
      this.setCurrSlideNumber(wid);

      virtualclass.wbCommon.indexNav.addActiveNavigation(wid);
      virtualclass.wbCommon.indexNav.UI.pageNavHandler('left');
      const prvsTool = document.querySelector(`#${virtualclass.wb[wid].prvTool}`);
      if (prvsTool != null && !prvsTool.classList.contains('active')) {
        prvsTool.classList.add('active');
      }
      virtualclass.gObj.currIndex = this.order.indexOf(currIndex)+1;
      virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
      console.log('==== current slide ', virtualclass.gObj.currSlide);
      virtualclass.vutil.beforeSend({'cf': 'cwb', diswb: true, wid: wid, currIndex: virtualclass.gObj.currIndex});
      // virtualclass.vutil.beforeSend({'cf': 'cwb', wbCount : virtualclass.gObj.wbCount});
      this.identifyLastNote(wid);
      // localStorage.setItem('currIndex', virtualclass.gObj.currIndex);
    },

    newPage : async function  () {
      this.hideElement();
      virtualclass.gObj.wbCount++;

      if (virtualclass.gObj.wIds.indexOf(virtualclass.gObj.wbCount) <= -1) {
        virtualclass.gObj.wIds.push(virtualclass.gObj.wbCount);
      }

      const wid = `${'_doc_0_'}${virtualclass.gObj.wbCount}`;
      const wb = virtualclass.gObj.currWb;
      const prevIndex = wb.slice(7);
      const currIndex = this.order.indexOf(prevIndex);
      const whiteboardNext = this.whiteboardWrapperExist('next');

      await virtualclass.vutil.createWhiteBoard(wid, currIndex);
      this.displaySlide(wid);
      let newIndex;
      let currPageNumber;

      if (whiteboardNext == null) {
        if (this.order.indexOf(virtualclass.gObj.wbCount) <= -1) {
          this.order.push(virtualclass.gObj.wbCount);
        }
        newIndex = this.order.length;
        virtualclass.wbCommon.indexNav.createWbNavigationNumber(newIndex);
        currPageNumber = newIndex;
      } else {
        newIndex = this.order.indexOf(prevIndex);
        this.order.splice(newIndex + 1, 0, virtualclass.gObj.wbCount);
        this.rearrange(this.order);
        this.rearrangeNav(this.order);
        currPageNumber = newIndex + 2;
        virtualclass.wbCommon.indexNav.createWbNavigationNumber(currPageNumber);
      }
      virtualclass.vutil.beforeSend({cf: 'cwb', wbCount : virtualclass.gObj.wbCount, currIndex : currPageNumber});
      this.setCurrSlideNumber(wid);
      virtualclass.gObj.currIndex = currPageNumber;
      console.log('==== current slide ', virtualclass.gObj.currSlide);
      this.identifyLastNote(wid);

      // localStorage.setItem('currIndex', virtualclass.gObj.currIndex);
      // localStorage.setItem('wbOrder', JSON.stringify(this.order));
    },

    rearrange(order) {
      const container = document.getElementsByClassName('whiteboardContainer')[0];
      const tmpdiv = document.createElement('div');
      // tmpdiv.id = "listppt";
      tmpdiv.className = 'whiteboardContainer';

      for (let i = 0; i < order.length; i++) {
        const elem = document.getElementById(`note_doc_0_${order[i]}`);
        if (elem) {
          tmpdiv.appendChild(elem);
        }
      }

      container.parentNode.replaceChild(tmpdiv, container);
    },

    rearrangeNav(order) {
      const e = document.querySelector('#dcPaging');
      e.innerHTML = '';

      // for (let i = 0; i <= virtualclass.gObj.wbCount; i++) {
      //   virtualclass.wbCommon.indexNav.createWbNavigationNumber(order[i], i);
      // }

      //virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.currIndex);
      //virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.wbCount+1);
      // virtualclass.wbCommon.indexNav.addActiveNavigation(this.indexNav.order.indexOf(virtualclass.gObj.currWb), virtualclass.gObj.currWb)

      if (virtualclass.currApp == 'Whiteboard') {
        var n1 = virtualclass.gObj.currWb.split('doc_0_')[1];
      }
      const num = this.order.indexOf(n1);
      var index = document.querySelector('.congrea #dcPaging .noteIndex.active');
      if (index) {
        index.classList.remove('active');
      }
      // var curr = virtualclass.dts.docs.currNote;
      const curr = num;
      var index = document.querySelector(`#index${n1}`);
      if (index) {
        index.classList.add('active');
        index.selected = 'selected';
      }
      const rActive = document.querySelector('#dcPaging .hid.right.active');
      const lActive = document.querySelector('#dcPaging .hid.left.active');
      if (rActive || lActive) {
        var currIndex;
        let dir;
        if (rActive) {
          currIndex = rActive.title;
          dir = 'right';
        } else {
          currIndex = lActive.title;
          dir = 'left';
        }
        // this.adjustPageNavigation(parseInt(currIndex), dir);
      }

      if (virtualclass.currApp == 'Whiteboard') {
        this.index = (+curr) + 1;
      } else {
        this.index = (currIndex != null) ? currIndex : (index != null && typeof index !== 'undefined') ? index.title : 1;
        if (!virtualclass.dts.order.length) {
          this.index = 0;
        }
        const nav = document.querySelector('#docShareNav');
        if (!this.index) {
          nav.classList.add('hide');
          nav.classList.remove('show');
        } else {
          nav.classList.add('show');
          nav.classList.remove('hide');
        }
      }
    },


    setCurrSlideNumber(wid) {
      const idn = wid.split('_');
      if (idn.length > 0) {
        virtualclass.gObj.currSlide = idn[idn.length - 1];

        if (!roles.hasControls()) {
          if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
            const curr = virtualclass.gObj.currIndex || virtualclass.gObj.currSlide;
            virtualclass.wbCommon.indexNav.studentWBPagination(curr);
          }
        }
      }
    },

    readyCurrentWhiteboard(wid) {
      if (wid != null) {
        if (!this.whiteboardExist(wid)) {
          virtualclass.vutil.createWhiteBoard(wid);
          this.displaySlide(wid);
          virtualclass.gObj.currWb = wid;
        } else {
          this.displaySlide(wid);
          virtualclass.gObj.currWb = wid;
        }
        // virtualclass.vutil.beforeSend({cf: 'cwb', diswb: true, wid: virtualclass.gObj.currWb});

        console.log(`whiteboard slide send=${virtualclass.gObj.currWb}`);
      } else {
        alert('Elemennt is NULL');
      }
    },

    whiteboardExist(wid) {
      return (document.querySelector(`#canvas${wid}`) != null);
    },


    whiteboardWrapperExist(elemtype) {
      const currWhiteboard = virtualclass.gObj.currWb;
      if (currWhiteboard != null) {
        const elem = document.querySelector(`#note${currWhiteboard}`);
        if (elemtype == 'prev') {
          var whiteboard = elem.previousElementSibling;
        } else if (elemtype == 'next') {
          var whiteboard = elem.nextElementSibling;
        }

        if (whiteboard != null) {
          const wid = whiteboard.dataset.wbId;
          return wid;
        }
        return null;
      }
    },

    readyElements(wids) {
      const whiteboardWrapper = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
      let note;
      for (let i = 0; i < wids.length; i++) {
        const wId = `_doc_0_${wids[i]}`;
        note = document.querySelector(`#note${wId}`);
        if (note == null) {
          const myDiv = document.createElement('div');
          myDiv.id = `note${wId}`;
          myDiv.dataset.wbId = wId;
          myDiv.className = 'canvasContainer';
          whiteboardWrapper.appendChild(myDiv);
        }
      }

      // this.reArrangeElements(wids)
    },

    /** this is only for whitebaord not for docs * */
    reArrangeElements(order) {
      const container = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
      const tmpdiv = document.createElement('div');
      tmpdiv.className = 'whiteboardContainer';
      let id;
      let dnode;
      for (let i = 0; i < order.length; i++) {
        id = `note_doc_0_${order[i]}`;
        dnode = document.getElementById(id);
        if (tmpdiv != null && dnode != null) {
          tmpdiv.appendChild(dnode);
        } else {
          console.log(`Error temp div is null ${tmpdiv}`);
        }
      }
      container.parentNode.replaceChild(tmpdiv, container);
    },

    identifyFirstNote(wid) {
      const elem = document.querySelector('#virtualclassWhiteboard');
      if (wid == '_doc_0_0') {
        elem.classList.add('firstNote');
      } else {
        elem.classList.remove('firstNote');
      }
    },
    identifyLastNote(wid) {
      let elem = document.querySelector('#virtualclassWhiteboard');
      const extractId = +(wid.slice(7));
      let index = this.order.indexOf(extractId);
      if ((index + 1 == this.order.length) || (wid == '_doc_0_0' && virtualclass.gObj.wIds.length == 1)) {
        elem.classList.add('lastNote');
      } else {
        elem.classList.remove('lastNote');
      }
    },


    removeAllContainers() {
      const allContainers = document.querySelectorAll('#virtualclassWhiteboard .whiteboardContainer .canvasContainer');
      let node;
      for (let i = 0; i < allContainers.length; i++) {
        node = allContainers[i];
        node.parentNode.removeChild(node);
      }
    },

    clearNavigation() {
      const dc = document.getElementById("dcPaging");
      if (dc !== null) {
        while (dc.firstChild) {
          dc.removeChild(dc.firstChild);
        }

        if (virtualclass.wbCommon.indexNav != null) {
          if (roles.hasControls()) {
            virtualclass.wbCommon.indexNav.createWbNavigationNumber(0, 0);
            const wb = document.querySelector('#virtualclassWhiteboard')
            wb.classList.add('lastNote');
          } else {
            const pageNo = document.createElement('span')
            pageNo.id = 'stdPageNo';
            dc.appendChild(pageNo);
            virtualclass.wbCommon.indexNav.studentWBPagination(0);
          }
        }

      }
    },

    deleteWhiteboard(wbId) {
      delete virtualclass.wb[wbId];
      delete virtualclass.pdfRender[wbId];
      if (virtualclass.currApp === 'Whiteboard') {
        const containerWbDoc = document.querySelector(`#containerWb${wbId}`);
        if (containerWbDoc !== null) {
          containerWbDoc.parentNode.removeChild(containerWbDoc);
        }
      }
    },
  };
  window.wbCommon = wbCommon;
}(window));
