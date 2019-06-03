(function (window) {
    "use strict"
    function zoomWhiteboard() {
        // var zoomScaleWidth, zoomScaleHeight;
        return {
            init: function () {

                if (document.querySelector('.zoomControler') == null) {
                    var parent = document.querySelector("#virtualclassAppLeftPanel");
                    if (parent != null) {
                        //if(roles.hasControls()){
                        var zoomControler = virtualclass.getTemplate('zoomControl');
                        var zoomControlerhtml = zoomControler({hasControls: roles.hasControls()});
                        parent.insertAdjacentHTML('beforeend', zoomControlerhtml);
                        this._initScaleController();
                        //}

                        // var canvasScale = localStorage.getItem('wbcScale');
                        // if(canvasScale != null){
                        //     this.canvasScale = canvasScale;
                        //     console.log('Canvas pdf scale ' + this.canvasScale);
                        // }

                        var canvasDimension = localStorage.getItem('canvasDimension');
                        if (canvasDimension != null) {
                            virtualclass.zoom.canvasDimension = JSON.parse(canvasDimension);
                        }
                    }
                }
            },

            _initScaleController: function () {
                var elem = document.querySelector('.zoomControler');
                var that = this;

                var that = this;
                var zoomIn = elem.querySelector('.zoomIn');
                zoomIn.addEventListener('click', function () {
                    virtualclass.zoom.performZoom = true;
                    delete virtualclass.zoom.fitToScreenWidth;
                    delete virtualclass.zoom.prvWhiteboard;
                    that.zoomAction('zoomIn');
                });

                var zoomOut = elem.querySelector('.zoomOut');
                zoomOut.addEventListener('click', function () {
                    delete virtualclass.zoom.fitToScreenWidth;
                    delete virtualclass.zoom.prvWhiteboard;
                    virtualclass.zoom.performZoom = true;
                    that.zoomAction('zoomOut');
                });

                var fitScreen = elem.querySelector('.fitScreen');
                fitScreen.addEventListener('click', function () {
                    that.zoomAction('fitToScreen');
                });

                // var reload = elem.querySelector('.reloadNote');
                // reload.addEventListener('click', function (){
                //     that.zoomAction('reload');
                // });

            },


            zoomAction: function (fnName) {
                if (virtualclass.currApp === 'ScreenShare') {
                    virtualclass.studentScreen[fnName].call(virtualclass.studentScreen);
                } else {
                    virtualclass.zoom.prvCanvasScale = this.canvasScale;
                    this[fnName].call(this);
                }
            },

            zoomIn: function (normalZoom) {
                var wid = virtualclass.gObj.currWb;
                if (typeof virtualclass.wb[wid] == 'object') {
                    var canvas = virtualclass.wb[wid].vcan.main.canvas;
                    // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
                    var wrapperWidth = canvas.parentNode.offsetWidth;


                    // this.canvasScale = this.canvasScale * SCALE_FACTOR;

                    // console.log('Canvas pdf scale ' + this.canvasScale);

                    // var actualWidth = virtualclass.vutil.getWidth(canvas) * SCALE_FACTOR;
                    // var actualHeight = virtualclass.vutil.getHeight(canvas) * SCALE_FACTOR;

                    var actualWidth = virtualclass.zoom.canvasDimension.width * SCALE_FACTOR;
                    var actualHeight = virtualclass.zoom.canvasDimension.height * SCALE_FACTOR;

                    virtualclass.zoom.canvasDimension.width = actualWidth;
                    virtualclass.zoom.canvasDimension.height = actualHeight;

                    if (typeof normalZoom != 'undefined') {
                        virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight, normalZoom);
                    } else {
                        virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
                    }
                    // if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
                    //     zoomScaleWidth = document.querySelector('#canvas' + virtualclass.gObj.currWb).width * SCALE_FACTOR;
                    //     zoomScaleHeight = document.querySelector('#canvas' + virtualclass.gObj.currWb).height *  SCALE_FACTOR;
                    // }

                }
            },

            zoomOut: function () {
                var wid = virtualclass.gObj.currWb;
                // var wrapper = this.canvasWrapper;
                var canvas = virtualclass.wb[wid].vcan.main.canvas;
                var wrapper = canvas.parentNode;
                //var canvas = this.canvas;
                // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
                var wrapperWidth = canvas.parentNode.offsetWidth;


                // this.canvasScale = this.canvasScale / SCALE_FACTOR;
                console.log('Canvas pdf scale ' + this.canvasScale);


                var actualWidth = virtualclass.zoom.canvasDimension.width * (1 / SCALE_FACTOR);
                var actualHeight = virtualclass.zoom.canvasDimension.height * (1 / SCALE_FACTOR);

                virtualclass.zoom.canvasDimension.width = actualWidth;
                virtualclass.zoom.canvasDimension.height = actualHeight;


                if (actualWidth <= wrapperWidth) {
                    wrapper.classList.remove('scrollX');
                }

                virtualclass.pdfRender[wid]._zoomOut.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);

                // if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
                //     zoomScaleWidth = document.querySelector('#canvas' + virtualclass.gObj.currWb).width / SCALE_FACTOR;
                //     zoomScaleHeight = document.querySelector('#canvas' + virtualclass.gObj.currWb).height / SCALE_FACTOR;
                // }
                //
            },

            adjustScreenOnDifferentPdfWidth (page){
                if (this.hasOwnProperty('adjustScreenOnDifferentPdfWidthTime')) {
                    clearTimeout(this.adjustScreenOnDifferentPdfWidthTime);
                }
                this.adjustScreenOnDifferentPdfWidthTime = setTimeout(() => {
                    this._adjustScreenOnDifferentPdfWidth(); // To control the reverse document
                }, 400);
            },

            _adjustScreenOnDifferentPdfWidth (page) {
                page = page || virtualclass.pdfRender[virtualclass.gObj.currWb].page;
                if (page != null) {
                    let viewPort = page.getViewport(1);
                    let newPdfWidth = viewPort.width;
                    let newPdfHeight = viewPort.height;

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
                    console.log("Page is null");
                }
            },

            getReduceValueForCanvas (){
                var canvas = document.querySelector("#canvas" + virtualclass.gObj.currWb);
                if (canvas != null && canvas.parentNode != null) {
                    // 382 = rightside bar + scroll + left app bar
                    // 372 = rightside bar + left app bar
                    return (canvas.parentNode.scrollHeight > canvas.parentNode.clientHeight) ? 382 : 372;
                }
            },

            fitToScreen: function () {
                virtualclass.gObj.fitToScreen = true;
                delete virtualclass.zoom.performZoom;
                var wid = virtualclass.gObj.currWb;
                if (typeof virtualclass.pdfRender[wid] != 'undefined') {
                    console.log('--Pdf render start----------');
                    var page = virtualclass.pdfRender[wid].page;
                    var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;

                    var virtualclassCont = document.querySelector('#virtualclassCont');
                    if (virtualclassCont != null) {
                        var containerWidth = virtualclassCont.offsetWidth;
                    } else {
                        var containerWidth = window.innerWidth;
                    }

                    var wrapperWidth = (containerWidth - this.getReduceValueForCanvas());
                    console.log('==== wrapperWidth ' + wrapperWidth);
                    try {
                        var tempviewport = page.getViewport(1);
                        virtualclass.zoom.fitToScreenWidth = tempviewport.width;
                        virtualclass.zoom.prvWhiteboard = virtualclass.gObj.currWb;

                        var viewport = page.getViewport((+(wrapperWidth)) / page.getViewport(1.0).width);
                        console.log('==== PDF width => ' + viewport.width + ' PDF height => ' + viewport.height + ' scale => ' + viewport.scale);
                        console.log('==== PDF temp width => ' + tempviewport.width + ' PDF height => ' + tempviewport.height + ' scale => ' + tempviewport.scale + ", after scale=" + this.canvasScale);
                        virtualclass.pdfRender[wid]._fitToScreen.call(virtualclass.pdfRender[wid], canvas, wrapperWidth, canvas.height);
                    } catch (error) {
                        console.log('Error ' + error);
                    }
                }
            },

            reload: function () {
                virtualclass.zoom.normalRender();
            },

            normalRender: function (zoomWhiteboard) {
                console.log('--Pdf Render Start ' + virtualclass.currApp + ' ------------');
                console.log('Pdf render normal view');
                console.log('--Pdf render------------');
                var wid = virtualclass.gObj.currWb;
                delete virtualclass.zoom.performZoom;
                if (typeof virtualclass.pdfRender[wid].shownPdf == 'object') {
                    if (virtualclass.zoom.canvasScale != null) {
                        // virtualclass.zoom.canvasScale = virtualclass.zoom.canvasScale / SCALE_FACTOR;
                        virtualclass.zoom.canvasDimension.width = virtualclass.zoom.canvasDimension.width / SCALE_FACTOR;
                        virtualclass.zoom.canvasDimension.height = virtualclass.zoom.canvasDimension.height / SCALE_FACTOR;
                        console.log('Canvas pdf scale ' + this.canvasScale);
                        // if(zoomWhiteboard == null){
                        //     virtualclass.zoom.zoomIn('normalRender');
                        // }else {
                        //     virtualclass.zoom.zoomIn();
                        // }
                        virtualclass.zoom.zoomIn('normalRender')


                    } else {
                        console.log('canvasScale is not defined yet.');
                    }
                }
            },


            removeZoomController: function () {
                var zoomControler = document.querySelector('#virtualclassApp .zoomControler');
                if (zoomControler != null && virtualclass.gObj.studentSSstatus.mesharing) {
                    zoomControler.parentNode.removeChild(zoomControler);
                }
            }
        };
    }

    window.zoomWhiteboard = zoomWhiteboard;
})(window);
