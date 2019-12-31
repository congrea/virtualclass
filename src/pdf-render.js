(function (window) {
  // let displayCb = null;

  function pdfRender() {
    return {
      firstTime: true,
      firstTimeScroll: true,
      shownPdf: '',
      canvasWrapper: null,
      canvasId: null,
      canvas: null,
      pdfScale: 1,
      url: '',
      axhr: axios.create({
        timeout: 5000,
        withCredentials: true,
        responseType: 'arraybuffer',
      }),
      init(canvas, currNote) {
        io.globallock = false;
        virtualclass.gObj.firstNormalRender = false;
        let currWhiteBoard;
        if (typeof currNote !== 'undefined') {
          const note = virtualclass.dts.getNote(currNote);
          this.url = note.pdf;
          currWhiteBoard = '_doc_' + currNote + '_' + currNote;
        } else {
          this.url = `${whiteboardPath}resources/sample.pdf`;
          currWhiteBoard = virtualclass.gObj.currWb;
        }

        this.loadPdf(this.url, canvas, currWhiteBoard);
      },

      prefechPdf(noteId) {
        const note = virtualclass.dts.getNote(noteId);
        this.axhr.get(note.pdf)
          .then((response) => { virtualclass.vutil.afterPdfPrefetch(note.id, response.data); })
          .catch((error) => { console.error('Request failed with error ', error); });
      },

      loadPdf(url, canvas, currWhiteBoard) {
        if (Object.prototype.hasOwnProperty.call(virtualclass.gObj.nextPdf, currWhiteBoard)) {
          this.afterPdfLoad(canvas, currWhiteBoard, virtualclass.gObj.nextPdf[currWhiteBoard]);
        } else {
          this.axhr.get(url)
            .then(async (response) => {
              await virtualclass.pdfRender[currWhiteBoard].afterPdfLoad(canvas, currWhiteBoard, response.data);
            })
            .catch((error) => {
              console.error('Request failed with error ', error);
              setTimeout(() => {
                virtualclass.pdfRender[currWhiteBoard].loadPdf(url, canvas, currWhiteBoard);
              }, 1000);
            });
        }
      },

      async afterPdfLoad(canvas, currNote, data) {
        // this.wbId = '_doc_' + currNote + '_' + currNote;
        this.wbId = currNote;
        this.canvas = canvas;
        // console.log('====JAI, After PDF currNote' + currNote);
        // this.canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
        this.canvasWrapper = canvas.parentNode;
        const doc = {};
        doc.data = data;
        // doc.currwb = virtualclass.gObj.currWb;
        if (virtualclass.gObj.myworker != null) {
          doc.worker = virtualclass.gObj.myworker;
        }

        PDFJS.workerSrc = `${whiteboardPath}build/src/pdf.worker.min.js`;
        PDFJS.cMapUrl = `${whiteboardPath}build/cmaps/`;
        PDFJS.cMapPacked = true;

        const pdf = await PDFJS.getDocument(doc);
        pdf.wbId = this.wbId;
        this.shownPdf = pdf;

        // console.log('====> shown pdf id 2 fp ', pdf.pdfInfo.fingerprint, ' wb', this.wbId);

        if (virtualclass.gObj.myworker == null) {
          virtualclass.gObj.myworker = pdf.loadingTask._worker; // Contain the single pdf worker for all PDFS
        }

        await virtualclass.pdfRender[this.wbId].displayPage(pdf, 1, true);

        if (!roles.hasControls()) {
          this.topPosY = 0;
          this.leftPosX = 0;
        }
        this.scrollEvent();


        if (typeof this.wbId !== 'undefined' && this.wbId != null) {
          const cN = currNote.split('_');
          const note = document.querySelector(`#note${cN[2]}_${cN[3]}`);
          if (note != null && note.nextElementSibling != null) {
            const preFetchSlide = note.nextElementSibling.dataset.slide;
            virtualclass.pdfRender[this.wbId].prefechPdf(preFetchSlide);
          }
        }
      },

      updateScrollPosition(pos, type) {
        // console.log('Update scroll type ' + type + ' ' + pos);
        const tp = type;
        if (typeof this.scroll[tp] === 'object' && Object.prototype.hasOwnProperty.call(this.scroll[tp], 'b')) {
          this.scroll[tp].b = pos;
          this.scroll[tp].c = this.scroll[tp].b + this.scroll[tp].studentVPm;
        } else {
          // console.log('Scroll b is undefined');
        }
      },

      // For Teacher
      scrollEvent() {
        // document.querySelector('#canvasWrapper'+virtualclass.gObj.currWb);
        const elem = this.canvasWrapper;
        const topPosY = elem.scrollTop;
        const leftPosX = elem.scrollLeft;
        // using for text box wrapper on whiteboard
        virtualclass.topPosY = topPosY;
        virtualclass.leftPosX = leftPosX;

        this.topPosY = topPosY;
        this.leftPosX = leftPosX;

        const that = this;
        elem.onscroll = function () {
          that.onScroll(elem);
        };
      },

      onScroll(elem, resetScroll) {
        let topPosY = elem.scrollTop;
        let leftPosX = elem.scrollLeft;

        if (topPosY > 0 || typeof resetScroll !== 'undefined') {
          this._scroll(leftPosX, topPosY, elem, 'Y');
        }

        if (leftPosX > 0 || typeof resetScroll !== 'undefined') {
          this._scroll(leftPosX, topPosY, elem, 'X');
        }

        if (!roles.hasControls() && typeof virtualclass.pdfRender[virtualclass.gObj.currWb] === 'object') {
          virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition({ scX: leftPosX, scY: topPosY });
        } else if (roles.isStudent()) {
          console.log("Could not call scroll function for student");
        }
      },

      _scroll(leftPosX, topPosY, elem, type) {
        if (roles.hasControls()) {
          this.topPosY = topPosY;
          this.leftPosX = leftPosX;
          // console.log("==== top position y " + this.topPosY);
          // console.log("==== top position x" + this.leftPosX);
          return this.scrollPosition(elem, type);
        }
        if (type === 'Y') {
          var pos = topPosY;
        } else if (type === 'X') {
          var pos = leftPosX;
        }
        this.updateScrollPosition(pos, type);

        return null;
      },

      scrollPosition(elem, type) {
        // var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
        const { canvas } = this;
        const tp = type;

        if (tp === 'Y') {
          var pos = elem.scrollTop;
          var canvasM = canvas.height;
        } else if (tp === 'X') {
          var pos = elem.scrollLeft;
          var canvasM = canvas.width;
        }


        this[`scrollPos${tp}`] = (pos / canvasM) * 100;

        const canvasInner = `canvas${virtualclass.gObj.currWb}`;
        const wrapper = `canvasWrapper${virtualclass.gObj.currWb}`;

        const viewPortM = virtualclass.vutil.getElemM(wrapper, tp);

        this[`actualVp${tp}`] = viewPortM;
        this[`viewPort${tp}`] = (viewPortM / canvasM) * 100;

        const result = {};
        result[`vp${tp}`] = this[`viewPort${tp}`];
        result[`sc${tp}`] = this[`scrollPos${tp}`];

        return result;
      },

      /** In below code tp represents scroll type
       * X and Y
       */
      scroll: {
        caclculatePosition(pos, canvas, type) {
          this.type = type;

          const tp = this.type;
          if (this[tp] == null) {
            this[tp] = {};
          }
          this[tp].a = 0;
          this[tp].d = canvas; // Canvas's with or height

          const wrapperId = `canvasWrapper${virtualclass.gObj.currWb}`;
          const studentWrapper = document.querySelector(`#${wrapperId}`);
          if (studentWrapper != null) {
            if (this.type === 'X') {
              this[tp].b = studentWrapper.scrollLeft;
            } else if (this.type === 'Y') {
              // console.log('Scroll position Y ' + studentWrapper.scrollTop);
              this[tp].b = studentWrapper.scrollTop;
            }

            this[tp].studentVPm = virtualclass.vutil.getElemM(wrapperId, tp);
            this[tp].c = this[tp].b + this[tp].studentVPm;
          }

          // console.log('Scroll custom ' + tp + ' a ' + this[tp].a);
          // console.log('Scroll custom ' + tp + ' b ' + this[tp].b);
          // console.log('Scroll custom ' + tp + ' c ' + this[tp].c);
          // console.log('Scroll custom ' + tp + ' d ' + this[tp].d);
          // console.log('Scroll custom ' + tp + ' e ' + this[tp].e);
        },

      },

      // for student
      setScrollPosition(obj) {
        if (Object.prototype.hasOwnProperty.call(obj, 'scY') && obj.scY != null && this.canvas != null) {
          this.scroll.caclculatePosition(obj.scY, this.canvas.height, 'Y');
        }

        if (Object.prototype.hasOwnProperty.call(obj, 'scX') && obj.scX != null && this.canvas != null) {
          this.scroll.caclculatePosition(obj.scX, this.canvas.width, 'X');
        }
      },


      customMoustPointer(obj, tp, pos) {
        // console.log('custom mouse pointer ay=' + this.scroll[tp].a + ' by=' + this.scroll[tp].b + ' cy=' + this.scroll[tp].c + ' dy=' + this.scroll[tp].d + ' ey' + this.scroll[tp].e);
        this.scroll[tp].e = pos;
        //  e is mouse's position
        // console.log('Scroll '  + tp + ' a ' + this.scroll[tp].a);
        // console.log('Scroll '  + tp + ' b ' + this.scroll[tp].b);
        // console.log('Scroll '  + tp + ' c ' + this.scroll[tp].c);
        // console.log('Scroll '  + tp + ' d ' + this.scroll[tp].d);
        // console.log('Scroll '  + tp + ' e ' + this.scroll[tp].e);

        if (this.scroll[tp].e > this.scroll[tp].c) {
          var scrollPos = this.scroll[tp].b + (this.scroll[tp].d - this.scroll[tp].c);
          if (scrollPos > this.scroll[tp].e) {
            scrollPos = this.scroll[tp].e - ((this.scroll[tp].b + this.scroll[tp].c) / 2);
          }
          // console.log(`custom mouse down pointer ay=${this.scroll[tp].a} by=${this.scroll[tp].b} cy=${this.scroll[tp].c} dy=${this.scroll[tp].d} ey${this.scroll[tp].e} scrollPos=${scrollPos}`);
          // var canvasWrapper = document.querySelector('#canvasWrapper' + virtualclass.gObj.currWb);
          if (tp == 'Y') {
            this.canvasWrapper.scrollTop = scrollPos;
          } else {
            this.canvasWrapper.scrollLeft = scrollPos;
            // console.log(`Scroll left ${this.canvasWrapper.scrollLeft}`);
          }

          this.scroll[tp].b = scrollPos;
          // this.scroll[tp].c = this.scroll[tp].b + this.studentVPheight;
          this.scroll[tp].c = this.scroll[tp].b + this.scroll[tp].studentVPm;
        } else if (this.scroll[tp].e < this.scroll[tp].b) {
          var scrollPos = this.scroll[tp].b - this.scroll[tp].a;
          if ((this.scroll[tp].c - scrollPos) < this.scroll[tp].e) {
            scrollPos = ((this.scroll[tp].b + this.scroll[tp].c) / 2) - this.scroll[tp].e;
          }
          // console.log('custom mouse up pointer ay=' + this.scroll[tp].a + ' by=' + this.scroll[tp].b + ' cy=' + this.scroll[tp].c + ' dy=' + this.scroll[tp].d + ' ey' + this.scroll[tp].e + ' scrollPos=' + scrollPos);
          // var canvasWrapper = document.querySelector('#canvasWrapper' + virtualclass.gObj.currWb);
          if (tp === 'Y') {
            this.canvasWrapper.scrollTop = this.canvasWrapper.scrollTop - scrollPos;
          } else {
            this.canvasWrapper.scrollLeft = this.canvasWrapper.scrollLeft - scrollPos;
          }

          this.scroll[tp].b = scrollPos;
          this.scroll[tp].c = this.scroll[tp].b + this.scroll[tp].studentVPm;
          // this.scroll[tp].c = this.scroll[tp].b + this.studentVPheight;
        }
      },


      setCustomMoustPointer(obj, tp) {
        const idPrefix = `scrollDiv${tp}${virtualclass.gObj.currWb}`;
        var mousePointer = document.querySelector(`#${idPrefix}mousePointer`);
        if (mousePointer == null) {
          var mousePointer = document.createElement('div');
          mousePointer.className = 'mousepointer';
          mousePointer.id = `${idPrefix}mousePointer`;
          const scrollWrapper = document.querySelector(`#scrollDiv${tp}${virtualclass.gObj.currWb}`);
          if (scrollWrapper != null) {
            scrollWrapper.appendChild(mousePointer);
          }
        }

        if (tp === 'Y') {
          mousePointer.style.top = `${obj.y - this.scroll[tp].a}px`;
        } else if (tp === 'X') {
          mousePointer.style.left = `${obj.x - this.scroll[tp].a}px`;
        }
      },

      // Send default scroll to all.
      sendScroll() {
        virtualclass.vutil.setDefaultScroll();
      },

      // Send current scroll to particular user.

      sendCurrentScroll(toUser) {
        // TODO Why do we need to send Scroll?
        let scrollPos = {};
        if (this.currentScroll != null) {
          scrollPos = Object.assign(scrollPos, this.currentScroll);
          // console.log(`Send scroll first time ${this.currentScroll}`);
          const that = this;
          that.currentScrolltoUser = toUser;
          // scrollPos.cf = 'scf';
          // scrollPos.ouser = toUser;
          // virtualclass.vutil.beforeSend(scrollPos, toUser);

          setTimeout(
            () => {
              that.currentScrolltoUser = toUser;
              scrollPos.cf = 'scf';
              scrollPos.toUser = toUser;
              //  virtualclass.vutil.beforeSend(scrollPos, toUser);
              virtualclass.vutil.beforeSend({
                toUser,
                cf: 'scf',
                scY: scrollPos.scY,
                vpY: scrollPos.vpY,
              }, toUser);
              // console.log(`Send scroll ${scrollPos}to user ${toUser}`);
              // console.log(`Send scroll ${scrollPos}`);
            }, 2000,
          );
        }
      },

      setDefaultCanvasWidth(wb, canvas) {
        if (wb === '_doc_0_0' && (canvas.parentNode.offsetWidth === 0 || canvas.parentNode.offsetWidth === 300)) {
          let canvasContainer;
          if (virtualclass.currApp === 'Whiteboard') {
            canvasContainer = document.querySelector('#virtualclassWhiteboard.canvasContainer.current');
          } else if (virtualclass.currApp === 'DocumentShare') {
            canvasContainer = document.querySelector('#screen-docs.current');
          } else {
            canvasContainer = document.querySelector('#virtualclassAppContainer');
          }
          canvas.width = canvasContainer.offsetWidth - 6;
        } else {
          canvas.width = canvas.parentNode.offsetWidth - 6; // Subtracting 6 of scrollbar width
        }
      },

      calculateViewPort(canvas, page) {
        let viewport;
        const container = document.getElementById('virtualclassAppContainer');
        const pageWidthScale = container.clientWidth / canvas.width * virtualclass.zoom.canvasScale;
        const pageHeightScale = container.clientHeight / canvas.height * virtualclass.zoom.canvasScale;
        const tempScale = Math.min(pageWidthScale, pageHeightScale);
        const tempViewport = page.getViewport(tempScale);
        if (tempViewport.width < container.offsetWidth) {
          viewport = tempViewport;
        } else {
          viewport = page.getViewport((canvas.width) / page.getViewport(1.0).width);
        }
        return viewport;
      },

      async renderPage(page, firstTime) {
        // In case of changing the different pdf width

        if (virtualclass.zoom.prvPdfDimension && virtualclass.zoom.prvPdfDimension[2] !== page.view[2]) {
          virtualclass.gObj.fitToScreen = true;
          if (this.firstTime) {
            virtualclass.gObj.pdfWidthChanged = true;
          }
        }

        if (virtualclass.gObj.currWb != null) {
          let scale = this.pdfScale;
          if (virtualclass.zoom.canvasScale != null && virtualclass.zoom.canvasScale != '') {
            if (virtualclass.zoom.canvasScale > 0) {
              scale = virtualclass.zoom.canvasScale;
            }
          }
          let wb;
          if (virtualclass.currApp === 'Whiteboard' && this.wbId != null && virtualclass.gObj.currWb !== this.wbId) {
            wb = (this.wbId.indexOf('_doc_') > -1) ? this.wbId : `_doc_${this.wbId}_${this.wbId}`;
          } else {
            wb = page.wbId;
          }

          const { canvas } = virtualclass.wb[wb].vcan.main;
          let viewport;
          if (Object.prototype.hasOwnProperty.call(virtualclass.zoom, 'diffrentDocumentWidth')) {
            canvas.width = virtualclass.zoom.diffrentDocumentWidth;
            console.log('==== a canvas width ', canvas.width);
            delete virtualclass.zoom.diffrentDocumentWidth;
          } else if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'fitToScreen')) {
            if (canvas.parentNode.offsetWidth === 300 || canvas.parentNode.offsetWidth === 0) {
              // Todo, later, we have to use only offset width of virtualclassAppContainer for width
              canvas.width = document.querySelector('#virtualclassAppContainer').offsetWidth;
            } else {
              canvas.width = canvas.parentNode.offsetWidth - 6;
            }
            if (virtualclass.currApp === 'DocumentShare') {
              virtualclass.zoom.fitToElementTooltip('fitToToPage');
            }
          } else if (Object.prototype.hasOwnProperty.call(virtualclass.zoom, 'performZoom')) {
            canvas.width = virtualclass.zoom.canvasDimension.width;
            console.log('==== a canvas width performZoom ', canvas.width);
            delete virtualclass.zoom.performZoom;
          } else if (Object.prototype.hasOwnProperty.call(virtualclass.zoom, 'canvasDimension')) {
            canvas.width = virtualclass.zoom.canvasDimension.width;
            console.log('==== a canvas width  ', canvas.width);
          } else if (canvas.offsetWidth === 0 || canvas.offsetWidth === 300 || virtualclass.isPlayMode) {
            this.setDefaultCanvasWidth(wb, canvas);
          } else {
            canvas.width = canvas.parentNode.offsetWidth - 6; // Subtracting 6 of scrollbar width
          }

          if (this.firstTime) {
            this.firstTime = false;
            if (virtualclass.zoom.canvasScale == null || virtualclass.gObj.fitToScreen) {
              viewport = page.getViewport((canvas.width) / page.getViewport(1.0).width);
              console.log('==== a canvas width scale', canvas.width);
            } else {
              viewport = page.getViewport(scale);
            }

            // virtualclass.zoom.doOpposite = true;
            // virtualclass.zoom.triggerFitToScreen();
          } else if (virtualclass.zoom.performFitToPage) {
            // this.fitElementToolTipChange('fitToScreen');
            viewport = this.calculateViewPort(canvas, page);
            // delete virtualclass.zoom.performFitToPage;
          } else {
            viewport = page.getViewport((canvas.width) / page.getViewport(1.0).width);
          }

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          virtualclass.zoom.prvCanvasScale = virtualclass.zoom.canvasScale;
          virtualclass.zoom.canvasScale = viewport.scale;
          virtualclass.zoom.prvPdfDimension = page.view;

          const pdfCanvas = canvas.nextSibling;
          pdfCanvas.width = canvas.width;
          pdfCanvas.height = canvas.height;

          virtualclass.zoom.canvasDimension = {};
          virtualclass.zoom.canvasDimension.width = canvas.width;
          virtualclass.zoom.canvasDimension.height = canvas.height;

          if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'fitToScreen')) {
            const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);
            if (canvasWrapper !== null) {
              if ((canvasWrapper.scrollHeight <= canvasWrapper.clientHeight)
                || (canvasWrapper.scrollWidth <= canvasWrapper.clientWidth)) {
                virtualclass.pdfRender[virtualclass.gObj.currWb].onScroll(canvasWrapper, true);
              }
            }
          }

          if (virtualclass.gObj.fitToScreen && virtualclass.gObj.pdfWidthChanged) {
            // Scaling all whiteboards
            for (const wid in virtualclass.pdfRender) {
              this.zoomwhiteboardObjects(wid);
            }
            delete virtualclass.gObj.pdfWidthChanged;
          }

          delete virtualclass.gObj.fitToScreen;

          const context = pdfCanvas.getContext('2d');

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext);
          canvas.parentNode.dataset.pdfrender = true;
          this[wb] = { pdfrender: true };
          virtualclass.vutil.showZoom();

          if (firstTime != null && virtualclass.gObj.currWb != null) {
            // this.initWhiteboardData(page.wbId);
            this.initWhiteboardData(page.wbId);
          }

          // displayCb();
          if (typeof this.shownPdf === 'object') {
            io.globallock = false;
            virtualclass.vutil.removeClass('virtualclassCont', 'resizeWindow');
          }
          if (this.firstTimeScroll && roles.isStudent() && typeof virtualclass.pdfRender[virtualclass.gObj.currWb] === 'object'){
            virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition({ scX: 0, scY: 0 });
            this.firstTimeScroll = false;
          }
        }
      },


      async displayPage(pdf, num, firstTime) {
        // displayCb = cb;
        const page = await pdf.getPage(num);
        page.wbId = pdf.wbId;
        virtualclass.pdfRender[pdf.wbId].page = page;
        if (typeof firstTime !== 'undefined') {
          await this.renderPage(page, firstTime);
        } else {
          await this.renderPage(page, null);
        }
      },

      async initWhiteboardData(wb) {
        if (typeof virtualclass.gObj.wbData[wb] === 'object' && virtualclass.gObj.wbData[wb]
          && virtualclass.gObj.wbData[wb].length > 0) {
          virtualclass.wb[wb].utility.replayFromLocalStroage(virtualclass.gObj.wbData[wb], wb);
        }
      },

      async _zoom(canvas, canvasWidth, canvasHeight) {
        virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
        virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

        const wrapper = canvas.parentNode;
        const wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

        await virtualclass.pdfRender[virtualclass.gObj.currWb].displayPage(this.shownPdf, 1);
        // scaling all whiteboards
        for (const wid in virtualclass.pdfRender) {
          this.zoomwhiteboardObjects(wid);
        }

        if (canvasWidth > wrapperWidth) {
          wrapper.classList.add('scrollX');
        }
      },

      async innerFitToPage(wid) {
        if (this.shownPdf !== ' ' && this.shownPdf !== '') {
          await virtualclass.pdfRender[wid].displayPage(this.shownPdf, 1);
          for (const wid in virtualclass.pdfRender) {
            this.fitToScreenWhiteboardObjects(wid);
          }
        }
      },

      fitWhiteboardAtScale(wId) {
        // console.log("## WHITEBOARD SCALE CALLED", wId);
        if (typeof virtualclass.wb[wId] === 'object') {
          const { vcan } = virtualclass.wb[wId];
          const objects = vcan.main.children;
          if (objects.length > 0) {
            // console.log('====> FIT to screen 3 whiteboard ', wId);
            for (const i in objects) {
              const { scaleX } = objects[i];
              const { scaleY } = objects[i];

              const left = objects[i].x;
              const top = objects[i].y;

              const orginalX = left / objects[i].scaleX;
              const orginalY = top / objects[i].scaleY;

              const tempScaleX = ((scaleX / virtualclass.zoom.prvCanvasScale) * virtualclass.zoom.canvasScale);
              const tempScaleY = ((scaleY / virtualclass.zoom.prvCanvasScale) * virtualclass.zoom.canvasScale);

              const tempLeft = tempScaleX * orginalX;
              const tempTop = tempScaleY * orginalY;

              objects[i].scaleX = tempScaleX;
              objects[i].scaleY = tempScaleY;

              objects[i].x = tempLeft;
              objects[i].y = tempTop;

              objects[i].setCoords();
              // console.log("## WHITEBOARD scaleX", objects[i].scaleX)
            }
          }
          vcan.renderAll();
        }
      },


      zoomwhiteboardObjects(wId) {
        this.fitWhiteboardAtScale(wId);
      },

      zoomOutWhiteboardObjects(wid) {
        this.fitWhiteboardAtScale(wid);
      },

      fitToScreenWhiteboardObjects(wid) {
        this.fitWhiteboardAtScale(wid);
      },

      normalViewWhiteboardObjects(wid) {
        this.fitWhiteboardAtScale(wid);
      },

      async _zoomOut(canvas, actualWidth, actualHeight) {
        virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, actualHeight);
        virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, actualWidth);
        await virtualclass.pdfRender[virtualclass.gObj.currWb].displayPage(this.shownPdf, 1);
        for (const wid in virtualclass.pdfRender) {
          this.zoomOutWhiteboardObjects(wid);
        }
      },


      async _fitToScreen(canvas, canvasWidth) {
        const canvasHeight = canvas.height;
        // console.log(`==== Current whiteboard id ${virtualclass.gObj.currWb}`);

        virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
        virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

        const wrapper = canvas.parentNode;
        // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);
        const wrapperWidth = wrapper.offsetWidth;

        // const that = this;

        if (this.shownPdf !== ' ') {
          await virtualclass.pdfRender[virtualclass.gObj.currWb].displayPage(this.shownPdf, 1);
          for (const wid in virtualclass.pdfRender) {
            this.fitToScreenWhiteboardObjects(wid);
          }

          if (canvasWidth > wrapperWidth && ((canvasWidth - wrapperWidth) > 55)) {
            wrapper.classList.add('scrollX');
          } else {
            wrapper.classList.remove('scrollX');
          }

        } else {
          // console.log('ERROR : shown pdf is not available');
        }
      },


      /**
       *
       * * */

      calculateScaleAtFirst(page, canvas) {
        // var viewport = page.getViewport((window.innerWidth - 362) / page.getViewport(1.0).width);
        const viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
        this.firstTime = false;
        return viewport;
      },

      isWhiteboardAlreadyExist(note) {
        return (this.canvas != null);
      },

      defaultScroll() {
        const wb = virtualclass.gObj.currWb;
        if (wb != null) {
          // Defualt scroll trigger
          this.canvasWrapper.scrollTop = 1;
        }
      },
    };
  }

  window.pdfRender = pdfRender;
}(window));
