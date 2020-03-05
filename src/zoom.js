(function (window) {
  function zoomWhiteboard() {
    // var zoomScaleWidth, zoomScaleHeight;
    return {
      init() {
        // Incase of not setting canvasScale = 1, there will be NaN value for drawn object on page refresh
        // At very first, there is no canvas scale to draw the shapes on whiteboard
        // this.canvasScale = this.canvasScale || 1;
        if (document.querySelector('.zoomControler') == null) {
          const parent = document.querySelector('#virtualclassAppLeftPanel');
          if (parent != null) {
            // if(roles.hasControls()){
            const zoomControler = virtualclass.getTemplate('zoomControl');
            const zoomControlerhtml = zoomControler({ hasControls: roles.hasControls() });
            parent.insertAdjacentHTML('beforeend', zoomControlerhtml);
            this._initScaleController();
            // }

            // var canvasScale = localStorage.getItem('wbcScale');
            // if(canvasScale != null){
            //     this.canvasScale = canvasScale;
            //     console.log('Canvas pdf scale ' + this.canvasScale);
            // }

            const canvasDimension = localStorage.getItem('canvasDimension');
            if (canvasDimension != null) {
              virtualclass.zoom.canvasDimension = JSON.parse(canvasDimension);
            }
          }
        }
      },

      _initScaleController() {
        const elem = document.querySelector('.zoomControler');
        var that = this;
        const zoomIn = elem.querySelector('.zoomIn');
        zoomIn.addEventListener('click', () => {
          virtualclass.zoom.performZoom = true;
          delete virtualclass.zoom.fitToScreenWidth;
          delete virtualclass.zoom.prvWhiteboard;
          that.zoomAction('zoomIn');
        });

        const zoomOut = elem.querySelector('.zoomOut');
        zoomOut.addEventListener('click', () => {
          delete virtualclass.zoom.fitToScreenWidth;
          delete virtualclass.zoom.prvWhiteboard;
          virtualclass.zoom.performZoom = true;
          that.zoomAction('zoomOut');
        });

        const fitScreen = elem.querySelector('.fitScreen');
        fitScreen.addEventListener('click', () => {
          that.triggerFitToScreen();
        });
      },

      triggerFitToScreen() {
        const zoomControler = document.querySelector('#virtualclassAppLeftPanel .zoomControler .fitScreen');
        if (zoomControler != null) {
          if (virtualclass.currApp === 'Whiteboard') {
            this.zoomAction('fitToScreen');
          } else {
            if (this.doOpposite) {
              this.lastFitAction = (zoomControler.dataset.currstate === 'fittopage') ? 'fitToScreen' : 'fitToPage';
            } else {
              this.lastFitAction = (zoomControler.dataset.currstate === 'fittopage') ? 'fitToPage' : 'fitToScreen';
            }
            this.zoomAction(this.lastFitAction);
            delete this.doOpposite;
          }
        }
      },

      zoomAction(fnName) {
        if (virtualclass.currApp === 'ScreenShare') {
          virtualclass.studentScreen[fnName].call(virtualclass.studentScreen);
        } else {
          virtualclass.zoom.prvCanvasScale = this.canvasScale;
          console.log('previous canvas scale ', virtualclass.zoom.prvCanvasScale);
          this[fnName].call(this);
        }
      },

      zoomIn(normalZoom) {
        delete virtualclass.zoom.performFitToPage;
        const wid = virtualclass.gObj.currWb;
        if (typeof virtualclass.wb[wid] === 'object') {
          const { canvas } = virtualclass.wb[wid].vcan.main;
          // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
          const wrapperWidth = canvas.parentNode.offsetWidth;


          // this.canvasScale = this.canvasScale * virtualclass.gObj.SCALE_FACTOR;

          // console.log('Canvas pdf scale ' + this.canvasScale);

          // var actualWidth = virtualclass.vutil.getWidth(canvas) * virtualclass.gObj.SCALE_FACTOR;
          // var actualHeight = virtualclass.vutil.getHeight(canvas) * virtualclass.gObj.SCALE_FACTOR;

          const actualWidth = virtualclass.zoom.canvasDimension.width * virtualclass.gObj.SCALE_FACTOR;
          const actualHeight = virtualclass.zoom.canvasDimension.height * virtualclass.gObj.SCALE_FACTOR;

          virtualclass.zoom.canvasDimension.width = actualWidth;
          virtualclass.zoom.canvasDimension.height = actualHeight;

          if (typeof normalZoom !== 'undefined') {
            virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight, normalZoom);
          } else {
            virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
          }
          // if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
          // zoomScaleWidth = document.querySelector(
          // '#canvas' + virtualclass.gObj.currWb).width * virtualclass.gObj.SCALE_FACTOR;
          // zoomScaleHeight = document.querySelector(
          // '#canvas' + virtualclass.gObj.currWb).height *  virtualclass.gObj.SCALE_FACTOR;
          // }
        }
      },

      zoomOut() {
        delete virtualclass.zoom.performFitToPage;
        const wid = virtualclass.gObj.currWb;
        // var wrapper = this.canvasWrapper;
        const { canvas } = virtualclass.wb[wid].vcan.main;
        const wrapper = canvas.parentNode;
        // var canvas = this.canvas;
        // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
        const wrapperWidth = canvas.parentNode.offsetWidth;


        // this.canvasScale = this.canvasScale / virtualclass.gObj.SCALE_FACTOR;
        // console.log(`Canvas pdf scale ${this.canvasScale}`);


        const actualWidth = virtualclass.zoom.canvasDimension.width * (1 / virtualclass.gObj.SCALE_FACTOR);
        const actualHeight = virtualclass.zoom.canvasDimension.height * (1 / virtualclass.gObj.SCALE_FACTOR);

        virtualclass.zoom.canvasDimension.width = actualWidth;
        virtualclass.zoom.canvasDimension.height = actualHeight;


        if (actualWidth <= wrapperWidth) {
          wrapper.classList.remove('scrollX');
        }
        virtualclass.pdfRender[wid]._zoomOut.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);

        // if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
        // zoomScaleWidth = document.querySelector(
        // '#canvas' + virtualclass.gObj.currWb).width / virtualclass.gObj.SCALE_FACTOR;
        // zoomScaleHeight = document.querySelector(
        // '#canvas' + virtualclass.gObj.currWb).height / virtualclass.gObj.SCALE_FACTOR;
        // }
        //
      },

      fitToScreen() {
        virtualclass.gObj.fitToScreen = true;
        delete virtualclass.zoom.performFitToPage;
        delete virtualclass.zoom.performZoom;
        const wid = virtualclass.gObj.currWb;
        if (typeof virtualclass.pdfRender[wid] !== 'undefined') {
          const { canvas } = virtualclass.wb[virtualclass.gObj.currWb].vcan.main;
          const wrapperWidth = document.querySelector(".canvasWrapper").offsetWidth;
          // console.log(`==== wrapperWidth ${wrapperWidth}`);
          try {
            virtualclass.pdfRender[wid]._fitToScreen.call(virtualclass.pdfRender[wid], canvas, wrapperWidth);
            if (virtualclass.currApp === 'DocumentShare') {
              this.fitToElementTooltip('fitToToPage');
            }
          } catch (error) {
            // console.log(`Error ${error}`);
          }
        }
      },

      fitToPage() {
        virtualclass.zoom.performFitToPage = true;
        const wid = virtualclass.gObj.currWb;
        virtualclass.pdfRender[wid].innerFitToPage.call(virtualclass.pdfRender[wid], wid);
        if (virtualclass.currApp === 'DocumentShare') {
          this.fitToElementTooltip('fitToScreen');
        }
      },

      reload() {
        virtualclass.zoom.normalRender();
      },

      normalRender() {
        const wid = virtualclass.gObj.currWb;
        delete virtualclass.zoom.performZoom;
        const canvasDim = virtualclass.zoom.canvasDimension;
        if (virtualclass.pdfRender[wid] && typeof virtualclass.pdfRender[wid].shownPdf === 'object'
          && virtualclass.zoom.canvasScale != null && virtualclass.zoom.canvasDimension) {
          canvasDim.width = canvasDim.width / virtualclass.gObj.SCALE_FACTOR;
          canvasDim.height = canvasDim.height / virtualclass.gObj.SCALE_FACTOR;

          if (virtualclass.gObj.normalZoomTime) {
            clearTimeout(virtualclass.gObj.normalZoomTime);
          }
          virtualclass.gObj.normalZoomTime = setTimeout(() => {
            virtualclass.zoom.zoomIn('normalRender');
          }, 100);
        }
      },

      removeZoomController() {
        const zoomControler = document.querySelector('#virtualclassApp .zoomControler');
        if (zoomControler != null && virtualclass.gObj.studentSSstatus.mesharing) {
          zoomControler.parentNode.removeChild(zoomControler);
        }
      },

      // fitElementToolTipChange(fitElement) {
      fitToElementTooltip(fitElement) {
        const fitScreenTooltip = document.querySelector('#virtualclassAppLeftPanel .zoomControler .fitScreen');
        const notesContainer = document.getElementById('notesContainer');
        if (fitElement === 'fitToScreen') {
          if (fitScreenTooltip) {
            fitScreenTooltip.dataset.currstate = 'fittoscreen';
            const congtooltip = document.querySelector('#virtualclassAppLeftPanel .fitScreen.congtooltip');
            congtooltip.dataset.title = 'Fit to Screen';
          }

          if (notesContainer) {
            notesContainer.dataset.currstate = 'fittotpage';
          }
        } else {
          if (fitScreenTooltip) {
            fitScreenTooltip.dataset.currstate = 'fittopage';
            const congtooltip = document.querySelector('#virtualclassAppLeftPanel .fitScreen.congtooltip');
            congtooltip.dataset.title = virtualclass.lang.getString('fitToPage');
          }

          if (notesContainer) {
            notesContainer.dataset.currstate = 'fittoscreen';
          }
        }
      },
    };
  }

  window.zoomWhiteboard = zoomWhiteboard;
}(window));
