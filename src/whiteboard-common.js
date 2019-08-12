/**
 * @author(Current)  Suman Bogati <http://www.vidyamantra.com>
 */

(function (window) {
  let wbCommon = {
    order: [0],
    wbInd: 0,

    initNavHandler() {
      const nextButton = document.querySelector('#virtualclassWhiteboard.whiteboard .next');
      nextButton.addEventListener('click', virtualclass.vutil.navWhiteboard.bind(virtualclass.vutil, this, this.next));

      const prevButton = document.querySelector('#virtualclassWhiteboard.whiteboard .prev');
      prevButton.addEventListener('click', virtualclass.vutil.navWhiteboard.bind(virtualclass.vutil, this, this.prev));
    },

    initNav(wIds) {
      if (typeof this.indexNav === 'undefined') {
        this.indexNav = new pageIndexNav('WB');
      }

      const currentPageNumber = virtualclass.gObj.currIndex || wIds.length;

      this.indexNav.init();
      if (!this.createWbNavigation) {
        this.indexNav.UI.createNewPageButton();
        this.createWbNavigation = true;
        //console.log('====> page init 2');
      }
      if (roles.hasControls()) {
        // let wbOrder = localStorage.getItem('wbOrder');
        // if (wbOrder != null) {
        //   wbOrder = JSON.parse(wbOrder);
        //   virtualclass.wbCommon.order = wbOrder;
        // }

        // if (this.order.length > 1) {
        //   virtualclass.wbCommon.rearrangeNav(this.order);
        //   this.rearrange(this.order);
        //   const currentIndex = localStorage.getItem('currIndex');
        //   if (currentIndex !== null) {
        //     currentPageNumber = currentIndex;
        //   }
        // }
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
      this.identifyLastNote(wid);

      // if (!roles.hasControls()) {
      //   if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
      //     const curr = virtualclass.gObj.currIndex || virtualclass.gObj.currSlide;
      //    virtualclass.wbCommon.indexNav.studentWBPagination(curr);
      //   }
      // } else if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
      //   virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
      //   virtualclass.wbCommon.indexNav.setTotalPages((virtualclass.orderList.Whiteboard.ol.order.length));
      // }
    },

    hideElement() {
      const prevElem = document.querySelector('#virtualclassWhiteboard.whiteboard .current');
      if (prevElem != null) {
        // console.log('Whiteboard slide remove');
        prevElem.classList.remove('current');
      }
    },

    next() {
      this.hideElement();
      const next = virtualclass.orderList.Whiteboard.getNextByID(virtualclass.gObj.currWb);
      if (next) {
        const wid = next.id;
        this.readyCurrentWhiteboard(wid);
        this.setCurrSlideNumber(wid);
        virtualclass.wbCommon.indexNav.addActiveNavigation(wid);
        virtualclass.wbCommon.indexNav.UI.pageNavHandler('right');
        const currIndex = virtualclass.orderList.Whiteboard.ol.order.indexOf(wid);

        this.identifyLastNote(wid);
        virtualclass.gObj.currWb = wid;
        virtualclass.gObj.currIndex = currIndex + 1;
        virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
        virtualclass.vutil.beforeSend({
          cf: 'cwb', diswb: true, wid, currIndex: virtualclass.gObj.currIndex,
        });
        this.identifyFirstNote(wid);
      } else {
        console.log('No element found');
      }
    },

    prev() {
      this.hideElement();
      const prev = virtualclass.orderList.Whiteboard.getPreviousByID(virtualclass.gObj.currWb);
      if (prev) {
        const wid = prev.id;
        this.readyCurrentWhiteboard(wid);
        this.setCurrSlideNumber(wid);
        virtualclass.wbCommon.indexNav.addActiveNavigation(wid);
        virtualclass.wbCommon.indexNav.UI.pageNavHandler('left');
        const currIndex = virtualclass.orderList.Whiteboard.ol.order.indexOf(wid);
        virtualclass.gObj.currIndex = currIndex + 1;
        virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
        virtualclass.vutil.beforeSend({
          cf: 'cwb', diswb: true, wid, currIndex: virtualclass.gObj.currIndex,
        });
        this.identifyLastNote(wid);
      } else {
        console.log('No element found');
      }
    },

    newPage() {
      this.hideElement();
      virtualclass.gObj.wbCount++;
      let whiteboardPos = virtualclass.gObj.wbCount;

      const wid = `${'_doc_0_'}${virtualclass.gObj.wbCount}`;
      // const wb = virtualclass.gObj.currWb;
      const prevIndex = virtualclass.gObj.currWb;
      let whiteboardNext = null;
     // const whiteboardNext = this.whiteboardWrapperExist('next');
      if (virtualclass.orderList.Whiteboard.ol.order.length > 0) {
        const currPosition = virtualclass.orderList.Whiteboard.getCurrentPosition(virtualclass.gObj.currWb);
        if (currPosition + 1 !== virtualclass.orderList.Whiteboard.ol.order.length ) {
          whiteboardNext = true;
        }
      }

      this.displaySlide(wid);
      let newIndex;
      let currPageNumber;

      if (whiteboardNext === null) {
        newIndex = virtualclass.orderList.Whiteboard.ol.order.length;
        currPageNumber = newIndex + 1;
        // virtualclass.wbCommon.indexNav.createWbNavigationNumber(newIndex);
        virtualclass.vutil.createWhiteBoard(wid, whiteboardPos);
      } else {
        newIndex = virtualclass.orderList.Whiteboard.ol.order.indexOf(prevIndex);
        whiteboardPos = newIndex + 1;
        currPageNumber = whiteboardPos + 1;
        virtualclass.vutil.createWhiteBoard(wid, whiteboardPos);
        this.rearrange(virtualclass.orderList.Whiteboard.ol.order);
        virtualclass.vutil.beforeSend({ cf: 'rearrangeWb', order: virtualclass.orderList.Whiteboard.ol.order });
      }

      virtualclass.gObj.currIndex = currPageNumber;
      virtualclass.wbCommon.indexNav.createWbNavigationNumber(currPageNumber);
      virtualclass.vutil.beforeSend({ cf: 'cwb', wbCount: virtualclass.gObj.wbCount, currIndex: currPageNumber });
      // this.setCurrSlideNumber(wid);

      this.identifyLastNote(wid);
    },


    // newPage() {
    //   this.hideElement();
    //   virtualclass.gObj.wbCount += 1;
    //   const wid = `${'_doc_0_'}${virtualclass.gObj.wbCount}`;
    //   this.displaySlide(wid);
    //   virtualclass.vutil.createWhiteBoard(wid);
    //   const currPageNumber = virtualclass.gObj.wbCount + 1;
    //   virtualclass.gObj.currIndex = currPageNumber;
    //
    //   virtualclass.wbCommon.indexNav.createWbNavigationNumber(currPageNumber);
    //   virtualclass.vutil.beforeSend({ cf: 'cwb', wbCount: virtualclass.gObj.wbCount, currIndex: currPageNumber });
    //   this.setCurrSlideNumber(wid);
    //   this.identifyLastNote(wid);
    // },

    rearrange(order) {
      const container = document.getElementsByClassName('whiteboardContainer')[0];
      const tmpdiv = document.createElement('div');
      // tmpdiv.id = "listppt";
      tmpdiv.className = 'whiteboardContainer';

      for (let i = 0; i < order.length; i++) {
        const elem = document.getElementById(`note${order[i]}`);
        if (elem) {
          tmpdiv.appendChild(elem);
        }
      }
      container.parentNode.replaceChild(tmpdiv, container);
    },

    // rearrangeNav(order) {
    //   const e = document.querySelector('#dcPaging');
    //   e.innerHTML = '';
    //
    //   // for (let i = 0; i <= virtualclass.gObj.wbCount; i++) {
    //   //   virtualclass.wbCommon.indexNav.createWbNavigationNumber(order[i], i);
    //   // }
    //
    //   // virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.currIndex);
    //   // virtualclass.wbCommon.indexNav.createWbNavigationNumber(virtualclass.gObj.wbCount+1);
    //   // virtualclass.wbCommon.indexNav.addActiveNavigation(this.indexNav.order.indexOf(virtualclass.gObj.currWb), virtualclass.gObj.currWb)
    //
    //   if (virtualclass.currApp == 'Whiteboard') {
    //     var n1 = virtualclass.gObj.currWb.split('doc_0_')[1];
    //   }
    //   const num = this.order.indexOf(n1);
    //   var index = document.querySelector('.congrea #dcPaging .noteIndex.active');
    //   if (index) {
    //     index.classList.remove('active');
    //   }
    //   // var curr = virtualclass.dts.docs.currNote;
    //   const curr = num;
    //   var index = document.querySelector(`#index${n1}`);
    //   if (index) {
    //     index.classList.add('active');
    //     index.selected = 'selected';
    //   }
    //   const rActive = document.querySelector('#dcPaging .hid.right.active');
    //   const lActive = document.querySelector('#dcPaging .hid.left.active');
    //   if (rActive || lActive) {
    //     var currIndex;
    //     let dir;
    //     if (rActive) {
    //       currIndex = rActive.title;
    //       dir = 'right';
    //     } else {
    //       currIndex = lActive.title;
    //       dir = 'left';
    //     }
    //     // this.adjustPageNavigation(parseInt(currIndex), dir);
    //   }
    //
    //   if (virtualclass.currApp == 'Whiteboard') {
    //     this.index = (+curr) + 1;
    //   } else {
    //     this.index = (currIndex != null) ? currIndex : (index != null && typeof index !== 'undefined') ? index.title : 1;
    //     if (!virtualclass.orderList['DocumentShare'].ol.order.length) {
    //       this.index = 0;
    //     }
    //     const nav = document.querySelector('#docShareNav');
    //     if (!this.index) {
    //       nav.classList.add('hide');
    //       nav.classList.remove('show');
    //     } else {
    //       nav.classList.add('show');
    //       nav.classList.remove('hide');
    //     }
    //   }
    // },


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
      } else {
        alert('Elemennt is NULL');
      }
    },

    whiteboardExist(wid) {
      return (virtualclass.wb[wid] === 'object' && document.querySelector(`#canvas${wid}`) != null);
    },

    whiteboardWrapperExist(elemtype) {
      let whiteboard;
      let wid = null;
      const currWhiteboard = virtualclass.gObj.currWb;
      if (currWhiteboard !== null) {
        const elem = document.querySelector(`#note${currWhiteboard}`);
        if (elemtype === 'prev') {
          whiteboard = elem.previousElementSibling;
        } else if (elemtype === 'next') {
          whiteboard = elem.nextElementSibling;
        }

        if (whiteboard !== null) {
           wid = whiteboard.dataset.wbId;
        }
        return wid;
      }
    },

    readyElements(wids) {
      const whiteboardWrapper = document.querySelector('#virtualclassWhiteboard .whiteboardContainer');
      let note;
      for (let i = 0; i < wids.length; i++) {
        // const wId = `_doc_0_${wids[i]}`;
        const wId = wids[i];
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
        id = `note_${order[i]}`;
        dnode = document.getElementById(id);
        if (tmpdiv != null && dnode != null) {
          tmpdiv.appendChild(dnode);
        } else {
          // console.log(`Error temp div is null ${tmpdiv}`);
        }
      }
      container.parentNode.replaceChild(tmpdiv, container);
    },

    identifyFirstNote(wid) {
      const elem = document.querySelector('#virtualclassWhiteboard');
      if (wid === '_doc_0_0') {
        elem.classList.add('firstNote');
      } else {
        elem.classList.remove('firstNote');
      }
    },

    identifyLastNote(wid) {
      const elem = document.querySelector('#virtualclassWhiteboard');
      const index = virtualclass.orderList.Whiteboard.ol.order.indexOf(wid);
      if ((index + 1 === virtualclass.orderList.Whiteboard.ol.order.length)
        || (wid === '_doc_0_0' && virtualclass.orderList.Whiteboard.ol.order.length === 1)) {
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
      const dc = document.getElementById('dcPaging');
      if (dc !== null) {
        while (dc.firstChild) {
          dc.removeChild(dc.firstChild);
        }

        if (virtualclass.wbCommon.indexNav != null) {
          if (roles.hasControls()) {
            virtualclass.wbCommon.indexNav.createWbNavigationNumber(0, 0);
            const wb = document.querySelector('#virtualclassWhiteboard');
            wb.classList.add('lastNote');
          } else {
            const pageNo = document.createElement('span');
            pageNo.id = 'stdPageNo';
            dc.appendChild(pageNo);
            virtualclass.wbCommon.indexNav.studentWBPagination(0);
          }
        }
      }
    },

    deleteWhiteboard(wbId) {
      delete virtualclass.wb[wbId];
      console.log('JAI 2')
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
