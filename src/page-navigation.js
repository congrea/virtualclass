/**
 *  Create Navigation for whitboard and Document sharing
 * @param {type} window
 * @param {type} document
 * @returns {undefined}
 *
 */

(function (window, document) {
  const pageIndexNav = function (app) {
    // this.shownPages = 6;
    this.app = app;
    // this.createContainer = false;
    // this.createWbNavigation = false;
    // console.log('====> page init');
  };

  /* Create the UI container and measure dimension(width) for navigation */
  pageIndexNav.prototype.init = function () {


    // if (!this.createWbNavigation) {
    //   this.UI.createNewPageButton();
    //   this.createWbNavigation = true;
    //   //console.log('====> page init 2');
    // }

    // const res = virtualclass.system.measureResoultion({
    //   width: window.innerWidth,
    //   height: window.innerHeight,
    // });
    let navContainer = document.getElementById('ancCont'); // Todo, this should not handle this way
    if (navContainer === null) {
      this.UI.container();

    }
    this.subCont = document.querySelector('#virtualclassCont.congrea #dcPaging');
    // this.width = res.width;
    // this.shownPages = this.countNumberOfNavigation(this.width);
  };

  /* create the pagination */
  pageIndexNav.prototype.createIndex = function () {
    // this.init();
    // for (let i = 0; i < virtualclass.orderList['DocumentShare'].ol.order.length; i++) {
    //   this.createDocNavigationNumber(virtualclass.orderList['DocumentShare'].ol.order[i], i);
    // }
    this.shownPage(this.width);
    this.addActiveNavigation();
    this.setTotalPages(virtualclass.orderList['DocumentShare'].ol.order.length);
  };

  pageIndexNav.prototype.setCurrentIndex = function (index) {
    // console.log('==== page, set current index');
    document.querySelector('#currIndex').innerHTML = index;
  };

  pageIndexNav.prototype.setTotalPages = function (length) {
    const cont = document.querySelector('#docShareNav #totalPages');
    if (cont) {
      cont.innerHTML = ` of ${length}`;
      const nav = document.querySelector('#docShareNav');
      if (!length) {
        nav.classList.add('hide');
        nav.classList.remove('show');
      } else {
        // console.log('Hide number show');
        nav.classList.add('show');
        nav.classList.remove('hide');
      }
    }
  };

  /**
   * This function adjust navigation, like if you click on previous
   * and next button, we need to hide and dislay page number,
   * So, it adjusts page navigation
   */
  pageIndexNav.prototype.adjustPageNavigation = function (currIndex, dir) {
    if (dir === 'right') {
      const nodes = document.querySelectorAll('.noteIndex.shw');
      if (nodes.length) {
        var rl = nodes[nodes.length - 1];
        var shw = parseInt(rl.getAttribute('data-set'));
      }

      for (let i = shw; i < currIndex; i++) {
        if (virtualclass.currApp === 'DocumentShare') {
          virtualclass.dts.indexNav.UI.setClassPrevNext();
        }
        var elem = document.querySelector('.noteIndex.hid.right');
        if (elem) {
          elem.classList.remove('hid', 'right');
          elem.classList.add('shw');
          const lft = document.querySelector('.noteIndex.shw');
          if (lft) {
            lft.classList.remove('shw');
            lft.classList.add('hid', 'left');
          }
        }
      }

      if (virtualclass.currApp === 'DocumentShare') {
        var curr = virtualclass.dts.docs.currNote;
        var index = document.querySelector(`.congrea #dcPaging #index${curr}`);
        if (index && !index.classList.contains('active')) {
          index.classList.add('active');
        }
      }
    } else {
      var nodes = document.querySelector('.noteIndex.shw');
      if (nodes) {
        var shw = parseInt(nodes.getAttribute('data-set'));
      }

      for (let i = shw; i > currIndex; i--) {
        if (virtualclass.currApp === 'DocumentShare') {
          virtualclass.dts.indexNav.UI.setClassPrevNext();
        }
        var nodes = document.querySelectorAll('.noteIndex.hid.left');
        if (nodes.length) {
          var elem = nodes[nodes.length - 1];
        }
        if (elem) {
          elem.classList.remove('hid', 'left');
          elem.classList.add('shw');
          var nodes = document.querySelectorAll('.noteIndex.shw');
          if (nodes.length) {
            var rl = nodes[nodes.length - 1];
          }
          if (rl) {AnnotationList
            rl.classList.remove('shw');
            rl.classList.add('hid', 'right');
          }
        }
      }
      if (virtualclass.currApp === 'DocumentShare') {
        var curr = virtualclass.dts.docs.currNote;
        var index = document.querySelector(`.congrea #dcPaging #index${curr}`);
        if (index && !index.classList.contains('active')) {
          index.classList.add('active');
          index.setAttribute('selected', 'selected');
        }
      }
    }
  };

  pageIndexNav.prototype.removeNav = function () {
    const dc = document.getElementById('docShareNav');
    while (dc.firstChild) {
      dc.removeChild(dc.firstChild);
    }
  };

  pageIndexNav.prototype.addActiveNavigation = function (wbCurr) {
    this.addActiveClass(wbCurr);

    const rightNavPage = document.querySelector('#rightNavPage.disable');
    const isNextNode = this.UI.isNodeAvailable('.noteIndex.shw.active', 'next');
    if (isNextNode) {
      if (rightNavPage != null) {
        if (virtualclass.currApp === 'Whiteboard') {
          this.UI.setArrowStatus('rightNavPage', 'enable');
        } else if (virtualclass.currApp === 'DocumentShare') {
          virtualclass.dts.indexNav.UI.setArrowStatusDocs(document.getElementById('rightNavPage'), 'enable', 'disable');
        }
      }
    } else if (virtualclass.currApp === 'Whiteboard') {
      this.UI.setArrowStatus('rightNavPage', 'disable');
    } else {
      virtualclass.dts.indexNav.UI.setArrowStatusDocs(document.getElementById('rightNavPage'), 'disable', 'enable');
    }

    const leftNavPage = document.querySelector('#leftNavPage.disable');
    const isPrevNode = this.UI.isNodeAvailable('.noteIndex.shw.active', 'prev');
    if (isPrevNode) {
      if (leftNavPage != null) {
        if (virtualclass.currApp === 'Whiteboard') {
          this.UI.setArrowStatus('leftNavPage', 'enable');
        } else {
          virtualclass.dts.indexNav.UI.setArrowStatusDocs(document.getElementById('leftNavPage'), 'enable', 'disable');
        }
      }
    } else if (virtualclass.currApp === 'Whiteboard') {
      this.UI.setArrowStatus('leftNavPage', 'disable');
    } else if (virtualclass.currApp === 'DocumentShare') {
      virtualclass.dts.indexNav.UI.setArrowStatusDocs(document.getElementById('leftNavPage'), 'disable', 'enable');
    }
  };


  /** Add active class for current active Note* */
  pageIndexNav.prototype.addActiveClass = function () {
    let pages;
    if (virtualclass.currApp === 'Whiteboard') {
      pages = virtualclass.gObj.wbCount + 1;
    } else if (virtualclass.currApp === 'DocumentShare') {
      if (Array.isArray(virtualclass.orderList[virtualclass.dts.appName].ol.order)) {
        pages = virtualclass.orderList[virtualclass.dts.appName].ol.order.length;
        const currPage = virtualclass.orderList[virtualclass.dts.appName].ol.order.indexOf(virtualclass.dts.docs.currNote);
        this.setCurrentIndex(currPage + 1);
      } else {
        pages = 1;
      }
    }
    this.setTotalPages(pages);
  };


  /** Re-arrange the Page Navigation * */
  pageIndexNav.prototype.rearrangePageNavigation = function (order) {
    const container = document.getElementById('dcPaging');
    if (container) {
      const tmpdiv = document.createElement('div');
      tmpdiv.id = 'dcPaging';
      if (tmpdiv != null) {
        const old = [];
        if (this.oldOrder) {
          for (let i = 0; i < this.oldOrder.length; i++) {
            const j = this.oldOrder[i];
            old[j] = document.getElementById(`index${this.oldOrder[i]}`).className;
          }
        }

        for (let i = 0; i < order.length; i++) {
          const tempElem = document.getElementById(`index${order[i]}`);
          if (this.oldOrder) {
            // move eleement but retain old class
            const j = this.oldOrder[i];
            tempElem.className = old[j];
          }

          tmpdiv.appendChild(tempElem);
          tempElem.innerHTML = i + 1;
          tempElem.value = i + 1;
        }
        container.parentNode.replaceChild(tmpdiv, container);
      }
    }

    this.UI.setClassPrevNext();
    this.addActiveNavigation();
  };

  /** setNavigationDisplay * */
  pageIndexNav.prototype.shownPage = function (width) {
    const pages = document.querySelectorAll('.noteIndex');
    const n = this.countNumberOfNavigation(width);
    for (let i = 0; i < pages.length; i++) {
      if (i > n) {
        pages[i].className = 'noteIndex hid right';
      } else {
        pages[i].className = 'noteIndex shw';
      }
    }
  };

  /**
   * Display the number of navigation based on Width
   * */
  pageIndexNav.prototype.countNumberOfNavigation = function (width) {
    if (width >= 1200) {
      return 8;
    }
    if (width >= 700) {
      return 5;
    }
    if (width >= 500) {
      return 4;
    }
    return 2;
  };

  /* setClasses */
  pageIndexNav.prototype.movePageIndex = function (direction) {
    virtualclass.dts.indexNav.addActiveNavigation();
    virtualclass.dts.indexNav.UI.setClassPrevNext();
    virtualclass.dts.indexNav.UI.pageNavHandler(direction);
  };


  /** Create navigation for teacher on document sharing * */
  pageIndexNav.prototype.createDocNavigationNumber = function (order, i) {
    const template = virtualclass.getTemplate('docIndex', 'navigation');
    const navHtml = template({ app: virtualclass.currApp, id: order, page: i + 1 });
    this.subCont.insertAdjacentHTML('beforeend', navHtml);
    const sn = document.querySelector(`#index${order}`);
    if (virtualclass.dts.docs.currNote === order) {
      sn.classList.add('active');
      this.setCurrentIndex(i);
    }
    this.index = i + 1;
    sn.onclick = virtualclass.dts.docs.goToNavs(order);
  };


  /** Create navigation for teacher  on  Whiteboard * */
  pageIndexNav.prototype.createWbNavigationNumber = function (index) {
    const wid = `_doc_0_${index}`;
    const template = virtualclass.getTemplate('wbIndex', 'navigation');
    const navHtml = template({
      app: virtualclass.currApp, id: index, order: index, wid,
    });
    this.subCont.insertAdjacentHTML('beforeend', navHtml);

    virtualclass.wbCommon.indexNav.addActiveNavigation(wid);
    this.setCurrentIndex(index);
  };

  pageIndexNav.prototype.newWbpage = function () {
    virtualclass.vutil.navWhiteboard(virtualclass.wbCommon, virtualclass.wbCommon.newPage);
  };

  /** Navigation for student on Document Sharing * */
  pageIndexNav.prototype.studentDocNavigation = function (id) {
    if (virtualclass.orderList[virtualclass.dts.appName].ol.order) {
      const index = virtualclass.orderList[virtualclass.dts.appName].ol.order.indexOf(id);
      const nav = document.querySelector('#docShareNav');
      if (index === -1) {
        nav.classList.add('hide');
        nav.classList.remove('show');
      } else {
        nav.classList.add('show');
        nav.classList.remove('hide');
      }
      const cont = document.getElementById('stdPageNo');
      if (cont) {
        cont.innerHTML = index + 1;
      }
      this.setTotalPages(virtualclass.orderList[virtualclass.dts.appName].ol.order.length);
      // setTimeout(() => {
      //   this.setTotalPages(virtualclass.orderList[virtualclass.dts.appName].ol.order.length);
      // }, 100);
    }
  };

  /** Navigation for student on Whiteboard Sharing * */
  pageIndexNav.prototype.studentWBPagination = function (index) {
    const cont = document.getElementById('stdPageNo');
    if (cont) {
      // console.log('==== student page navigation');
      // cont.innerHTML = parseInt(index) + 1;
      cont.innerHTML = +(index);
      this.setTotalPages(virtualclass.orderList.Whiteboard.ol.order.length);
      // setTimeout(() => {
      //   this.setTotalPages((virtualclass.gObj.wbCount + 1));
      // }, 100);
    }
  };

  pageIndexNav.prototype.updateNavigation = function () {
    if (virtualclass.currApp === 'Whiteboard') {
      if (!roles.hasControls()) {
        if (typeof virtualclass.wbCommon.indexNav !== 'undefined') {
          const curr = virtualclass.gObj.currIndex || virtualclass.gObj.currSlide;
          virtualclass.wbCommon.indexNav.studentWBPagination(curr);
        }
      } else if (roles.hasControls() && !virtualclass.config.makeWebSocketReady) {
        virtualclass.wbCommon.indexNav.setCurrentIndex(virtualclass.gObj.currIndex);
        virtualclass.wbCommon.indexNav.setTotalPages((virtualclass.orderList.Whiteboard.ol.order.length));
      }
    } else if (virtualclass.currApp === 'DocumentShare' && virtualclass.dts.noteExist()) {
      this.setCurrentIndex(virtualclass.gObj.currIndex);
      this.setTotalPages((virtualclass.orderList.Documentshare.ol.order.length));
    }
  };

  /** Create navigation */
  pageIndexNav.prototype.UI = {
    // container() {
    //   //console.log('===> create navigation');
    //   /** TODO Use handlebars* */
    //
    //   const dc = document.getElementById('docShareNav');
    //   while (dc.firstChild) {
    //     dc.removeChild(dc.firstChild);
    //   }
    //
    //   const template = virtualclass.getTemplate('navMain', 'navigation');
    //   const navHtml = template({ app: virtualclass.currApp, control: roles.hasControls() });
    //   dc.innerHTML = navHtml;
    //
    //   if (roles.hasControls()) {
    //     const cont = document.querySelector('.congrea #docShareNav');
    //     const anc = document.querySelector('#currIndex');
    //     anc.addEventListener('click', () => {
    //       const elem = document.querySelector('#dcPaging');
    //       if (elem) {
    //         elem.classList.toggle('close');
    //         elem.classList.toggle('open');
    //       }
    //     });
    //
    //     if (virtualclass.currApp === 'Whiteboard') {
    //       const addCont = document.createElement('span');
    //       addCont.id = 'addNewPage';
    //       addCont.className = 'newPage';
    //       cont.appendChild(addCont);
    //
    //       const add = document.createElement('span');
    //       addCont.appendChild(add);
    //       add.className = 'icon-newPage congtooltip'; // to be removed
    //       add.setAttribute('data-title', virtualclass.lang.getString('newPage'));
    //       add.addEventListener('click', function () {
    //         virtualclass.wbCommon.indexNav.newWbpage(this.type);
    //       });
    //     }
    //
    //     const subCont = document.querySelector('#dcPaging');
    //     cont.addEventListener('mouseover', () => {
    //       subCont.classList.add('open');
    //       subCont.classList.remove('close');
    //     });
    //     cont.addEventListener('mouseout', () => {
    //       subCont.classList.add('close');
    //       subCont.classList.remove('open');
    //     });
    //     const that = this;
    //     const left = document.querySelector('#leftNavPage');
    //     left.addEventListener('click', () => {
    //       if (virtualclass.currApp == 'Whiteboard') {
    //         if (that.isNodeAvailable('.noteIndex.shw.active', 'prev')) {
    //           document.querySelector('#virtualclassWhiteboard .prev').click();
    //         } else {
    //           that.setArrowStatus('leftNavPage', 'disable');
    //         }
    //       } else {
    //         document.getElementById('docsprev').click();
    //         that.setArrowStatus('leftNavPage', 'disable');
    //       }
    //     });
    //
    //     const right = document.querySelector('#rightNavPage');
    //     right.addEventListener('click', function () {
    //       if (virtualclass.currApp == 'Whiteboard') {
    //         if (that.isNodeAvailable('.noteIndex.shw.active', 'next')) {
    //           document.querySelector('#virtualclassWhiteboard .next').click();
    //           const num = virtualclass.gObj.currWb.split('_doc_0')[1];
    //           if (num > this.shownPages) {
    //             const shw = document.querySelector('.noteIndex.shw');
    //             shw.className = 'noteIndex hid left';
    //           }
    //         } else {
    //           that.setArrowStatus('rightNavPage', 'disable');
    //         }
    //       } else {
    //         document.getElementById('docsnext').click();
    //         that.setArrowStatus('rightNavPage', 'disable');
    //       }
    //     });
    //   }
    // },

    container() {
      // console.log('===> create navigation');
      const dc = document.getElementById('docShareNav');
      const template = virtualclass.getTemplate('navMain', 'navigation');
      const navHtml = template({ app: virtualclass.currApp, control: roles.hasControls()});
      dc.innerHTML = navHtml;
    },

    createNewPageButton() {
      if (roles.hasControls() && virtualclass.currApp === 'Whiteboard') {
        const cont = document.querySelector('.congrea #docShareNav');
        const addCont = document.createElement('span');
        addCont.id = 'addNewPage';
        addCont.className = 'newPage';
        cont.insertBefore(addCont,cont.firstChild);

        const add = document.createElement('span');
        addCont.appendChild(add);
        add.className = 'icon-newPage congtooltip'; // to be removed
        add.setAttribute('data-title', virtualclass.lang.getString('newPage'));
        add.addEventListener('click', function () {
          if (virtualclass.gObj.readyToCreate) {
            virtualclass.gObj.readyToCreate = false;
            virtualclass.wbCommon.indexNav.newWbpage(this.type);
          }
        });
      }
    },

    /** Set enable/disable class for previous or next button when required */
    setClassPrevNext() {
      let prevSlide;
      let nxtSlide;
      const currNodeId = virtualclass.dts.docs.currNote;
      const currElem = document.querySelector(`#documentScreen #note${currNodeId}`);
      if (currElem != null) {
        prevSlide = currElem.previousElementSibling;
        nxtSlide = currElem.nextElementSibling;
      }
      const lna = document.querySelector('#leftNavPage');
      if (lna) {
        (prevSlide) ? this.setArrowStatus('leftNavPage', 'enable') : this.setArrowStatus('leftNavPage', 'disable');
      }

      const na = document.querySelector('#rightNavPage');
      if (na) {
        (nxtSlide) ? this.setArrowStatus('rightNavPage', 'enable') : this.setArrowStatus('rightNavPage', 'disable');
      }
    },

    pageNavHandler(navType, that) {
      let elem;
      if (navType === 'right') {elem = document.querySelector('.noteIndex.hid.right.active');
        if (elem) {
          elem.classList.remove('hid');
          elem.classList.remove('right');
          elem.classList.add('shw');
          const lft = document.querySelector('.noteIndex.shw');
          if (lft) {
            lft.classList.remove('shw');
            lft.classList.add('hid', 'left');
          }
        }
      } else {
        let rl;
        elem = document.querySelector('.noteIndex.hid.left.active');
        if (elem) {
          elem.classList.remove('hid');
          elem.classList.remove('left');
          elem.classList.add('shw');
          const nodes = document.querySelectorAll('.noteIndex.shw');
          if (nodes.length) {
            rl = nodes[nodes.length - 1];
          }

          if (rl) {
            rl.classList.remove('shw');
            rl.classList.add('hid');
            rl.classList.add('right');
          }
        }
      }
    },

    setArrowStatus(element, action) {
      const removeClass = (action === 'disable') ? 'enable' : 'disable';

      const nr = document.getElementById(element);
      if (virtualclass.currApp === 'Whiteboard') {
        nr.classList.add(action);
        nr.classList.remove(removeClass);
      } else {
        const currNodeId = virtualclass.dts.docs.currNote;
        const lastElement = virtualclass.orderList['DocumentShare'].ol.order[virtualclass.orderList['DocumentShare'].ol.order.length - 1];
        if (currNodeId === lastElement) {
          this.setArrowStatusDocs(nr, action, removeClass);
        }
      }
    },

    setArrowStatusDocs(nr, action, removeClass) {
      nr.classList.add(action);
      nr.classList.remove(removeClass);
    },

    isNodeAvailable(selector, whichNode) {
      const nodeType = (whichNode === 'next') ? 'nextSibling' : 'previousSibling';
      const elem = document.querySelector(selector);
      return elem && elem[nodeType] != null;
    },
  };
  window.pageIndexNav = pageIndexNav;
}(window, document));
