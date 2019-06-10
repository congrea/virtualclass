(function (window) {
  function zoomWhiteboard() {
    // var zoomScaleWidth, zoomScaleHeight;
    return {
      init() {
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
          that.zoomAction('fitToScreen');
        });

        // var reload = elem.querySelector('.reloadNote');
        // reload.addEventListener('click', function (){
        //     that.zoomAction('reload');
        // });
      },


      zoomAction(fnName) {
        if (virtualclass.currApp === 'ScreenShare') {
          virtualclass.studentScreen[fnName].call(virtualclass.studentScreen);
        } else {
          virtualclass.zoom.prvCanvasScale = this.canvasScale;
          this[fnName].call(this);
        }
      },

      zoomIn(normalZoom) {
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
          //     zoomScaleWidth = document.querySelector('#canvas' + virtualclass.gObj.currWb).width * virtualclass.gObj.SCALE_FACTOR;
          //     zoomScaleHeight = document.querySelector('#canvas' + virtualclass.gObj.currWb).height *  virtualclass.gObj.SCALE_FACTOR;
          // }
        }
      },

      zoomOut() {
        const wid = virtualclass.gObj.currWb;
        // var wrapper = this.canvasWrapper;
        const { canvas } = virtualclass.wb[wid].vcan.main;
        const wrapper = canvas.parentNode;
        // var canvas = this.canvas;
        // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
        const wrapperWidth = canvas.parentNode.offsetWidth;


        // this.canvasScale = this.canvasScale / virtualclass.gObj.SCALE_FACTOR;
        console.log(`Canvas pdf scale ${this.canvasScale}`);


        const actualWidth = virtualclass.zoom.canvasDimension.width * (1 / virtualclass.gObj.SCALE_FACTOR);
        const actualHeight = virtualclass.zoom.canvasDimension.height * (1 / virtualclass.gObj.SCALE_FACTOR);

        virtualclass.zoom.canvasDimension.width = actualWidth;
        virtualclass.zoom.canvasDimension.height = actualHeight;


        if (actualWidth <= wrapperWidth) {
          wrapper.classList.remove('scrollX');
        }

        virtualclass.pdfRender[wid]._zoomOut.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);

        // if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
        //     zoomScaleWidth = document.querySelector('#canvas' + virtualclass.gObj.currWb).width / virtualclass.gObj.SCALE_FACTOR;
        //     zoomScaleHeight = document.querySelector('#canvas' + virtualclass.gObj.currWb).height / virtualclass.gObj.SCALE_FACTOR;
        // }
        //
      },

      adjustScreenOnDifferentPdfWidth(page) {
        if (this.hasOwnProperty('adjustScreenOnDifferentPdfWidthTime')) {
          clearTimeout(this.adjustScreenOnDifferentPdfWidthTime);
        }
        this.adjustScreenOnDifferentPdfWidthTime = setTimeout(() => {
          this._adjustScreenOnDifferentPdfWidth(); // To control the reverse document
        }, 400);
      },

      _adjustScreenOnDifferentPdfWidth(page) {
        page = page || virtualclass.pdfRender[virtualclass.gObj.currWb].page;
        if (page != null) {
          const viewPort = page.getViewport(1);
          const newPdfWidth = viewPort.width;
          const newPdfHeight = viewPort.height;

          if (virtualclass.zoom.hasOwnProperty('prevPdfWidth') && newPdfWidth !== virtualclass.zoom.prevPdfWidth) {
            virtualclass.zoom.canvasDimension.width = virtualclass.zoom.canvasScale * newPdfWidth;
            virtualclass.zoom.canvasDimension.height = virtualclass.zoom.canvasScale * newPdfHeight;
            if (virtualclass.zoom.hasOwnProperty('fitToScreenWidth')) {
              virtualclass.zoom.fitToScreen();
            } else {
              virtualclass.zoom.normalRender();
            }
          } else {
            virtualclass.zoom.normalRender();
          }
          virtualclass.zoom.prevPdfWidth = newPdfWidth;
        } else {
          console.log('Page is null');
        }
      },

      getReduceValueForCanvas() {
        const canvas = document.querySelector(`#canvas${virtualclass.gObj.currWb}`);
        if (canvas != null && canvas.parentNode != null) {
          // 382 = rightside bar + scroll + left app bar
          // 372 = rightside bar + left app bar
          return (canvas.parentNode.scrollHeight > canvas.parentNode.clientHeight) ? 382 : 372;
        }
      },

      fitToScreen() {
        virtualclass.gObj.fitToScreen = true;
        delete virtualclass.zoom.performZoom;
        const wid = virtualclass.gObj.currWb;
        if (typeof virtualclass.pdfRender[wid] !== 'undefined') {
          console.log('--Pdf render start----------');
          const { page } = virtualclass.pdfRender[wid];
          const { canvas } = virtualclass.wb[virtualclass.gObj.currWb].vcan.main;

          const virtualclassCont = document.querySelector('#virtualclassCont');
          if (virtualclassCont != null) {
            var containerWidth = virtualclassCont.offsetWidth;
          } else {
            var containerWidth = window.innerWidth;
          }

          const wrapperWidth = (containerWidth - this.getReduceValueForCanvas());
          console.log(`==== wrapperWidth ${wrapperWidth}`);
          try {
            const tempviewport = page.getViewport(1);
            virtualclass.zoom.fitToScreenWidth = tempviewport.width;
            virtualclass.zoom.prvWhiteboard = virtualclass.gObj.currWb;

            const viewport = page.getViewport((+(wrapperWidth)) / page.getViewport(1.0).width);
            console.log(`==== PDF width => ${viewport.width} PDF height => ${viewport.height} scale => ${viewport.scale}`);
            console.log(`==== PDF temp width => ${tempviewport.width} PDF height => ${tempviewport.height} scale => ${tempviewport.scale}, after scale=${this.canvasScale}`);
            virtualclass.pdfRender[wid]._fitToScreen.call(virtualclass.pdfRender[wid], canvas, wrapperWidth, canvas.height);
          } catch (error) {
            console.log(`Error ${error}`);
          }
        }
      },

      reload() {
        virtualclass.zoom.normalRender();
      },

      normalRender(zoomWhiteboard) {
        console.log(`--Pdf Render Start ${virtualclass.currApp} ------------`);
        console.log('Pdf render normal view');
        console.log('--Pdf render------------');
        const wid = virtualclass.gObj.currWb;
        delete virtualclass.zoom.performZoom;
        if (typeof virtualclass.pdfRender[wid].shownPdf === 'object') {
          if (virtualclass.zoom.canvasScale != null) {
            // virtualclass.zoom.canvasScale = virtualclass.zoom.canvasScale / virtualclass.gObj.SCALE_FACTOR;
            virtualclass.zoom.canvasDimension.width = virtualclass.zoom.canvasDimension.width / virtualclass.gObj.SCALE_FACTOR;
            virtualclass.zoom.canvasDimension.height = virtualclass.zoom.canvasDimension.height / virtualclass.gObj.SCALE_FACTOR;
            console.log(`Canvas pdf scale ${this.canvasScale}`);
            // if(zoomWhiteboard == null){
            //     virtualclass.zoom.zoomIn('normalRender');
            // }else {
            //     virtualclass.zoom.zoomIn();
            // }
            virtualclass.zoom.zoomIn('normalRender');
          } else {
            console.log('canvasScale is not defined yet.');
          }
        }
      },


      removeZoomController() {
        const zoomControler = document.querySelector('#virtualclassApp .zoomControler');
        if (zoomControler != null && virtualclass.gObj.studentSSstatus.mesharing) {
          zoomControler.parentNode.removeChild(zoomControler);
        }
      },
    };
  }

  window.zoomWhiteboard = zoomWhiteboard;
}(window));
