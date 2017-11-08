var pageNum = 1;
var pdfScale = 1;
var shownPdf = ""; // TODO, this blank space need to be eliminated
var url = 'https://local.vidya.io/virtualclass/example/sample.pdf';
var canvas;

(function (window) {
    function pdfRender(){
        return {
            firstTime : true,
            init : function (canvas){
                var canvasScale = localStorage.getItem('wbcScale');
                if(canvasScale != null){
                    virtualclass.canvasScale = canvasScale;
                    this.firstTime = false;
                }
                canvas = canvas;
                var that = this;
                PDFJS.getDocument(url).then(function (pdf) {
                    that.displayPage(pdf, 1, function (){ console.log('Pdf share : put in main children');}, true);
                    shownPdf = pdf;
                    that.shownPdf = shownPdf;
                });
                if(roles.hasControls()){
                    this.scrollEvent();

                }else {
                    virtualclass.topPosY = 0;
                    virtualclass.leftPosX = 0;
                }


            },

            scrollEvent : function (){
                var elem = document.querySelector('#canvasWrapper_doc_0_0');
                var topPosY = elem.scrollTop;
                var leftPosX = elem.scrollLeft;
                 // virtualclass.topPosY = 79;
                 virtualclass.topPosY = topPosY;
                 virtualclass.leftPosX = leftPosX;

                elem.onscroll = function (){
                     topPosY = elem.scrollTop;
                     leftPosX = elem.scrollLeft;
                    virtualclass.topPosY = topPosY;
                    virtualclass.leftPosX = leftPosX;
                }
            },

            initScaleController : function (){
                var zoomController = document.createElement('div');
                zoomController.id = 'zoomControler';

                var zoomIn = document.createElement('button');
                zoomIn.id = 'zoomIn';
                zoomIn.innerHTML = 'ZOOM in';
                var that = this;
                zoomIn.addEventListener('click', function (){
                    that.zoomIn();
                });

                zoomController.appendChild(zoomIn);

                var zoomOut = document.createElement('button');
                zoomOut.id = 'zoomOut';
                zoomOut.innerHTML = 'ZOOM out';
                var that = this;
                zoomOut.addEventListener('click', function (){
                    that.zoomOut();
                });

                zoomController.appendChild(zoomOut);


                var fitScreen = document.createElement('button');
                fitScreen.id = 'fitScreen';
                fitScreen.innerHTML = 'Fit to Screen';
                var that = this;
                fitScreen.addEventListener('click', function (){
                    that.fitToScreen(that.page);
                });

                zoomController.appendChild(fitScreen);

                var zoomControler = document.querySelector('#zoomControler');
                if(zoomControler != null){
                    zoomControler.parentNode.removeChild(zoomControler);
                }

                var virtualclassWhiteboard =  document.querySelector('#virtualclassWhiteboard');
                virtualclassWhiteboard.appendChild(zoomController);
            },

            renderPage : function  (page)  {
                //virtualclass.canvasScale = canvasScale;
                var scale = virtualclass.hasOwnProperty('canvasScale') ? virtualclass.canvasScale : pdfScale; // render with global pdfScale variable

                var wb = virtualclass.gObj.currWb;
                var canvas = document.getElementById('canvas'+wb);

                if(this.firstTime){
                    var viewport = this.calculateScaleAtFirst(page, canvas);
                    virtualclass.prvCanvasScale = virtualclass.canvasScale;
                    virtualclass.canvasScale =  viewport.scale;

                }else  {
                    var viewport = page.getViewport(scale);
                }

                context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);
                var wrapperHeight = virtualclass.vutil.getValueWithoutPixel(wrapper.style.height);
                if( canvas.width  > wrapperWidth){
                    wrapper.classList.add('cscrollX');
                }else {
                    wrapper.classList.remove('cscrollX');
                }

                var wrapperHeight = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.height);

                if(canvas.height > wrapperHeight){
                    wrapper.classList.add('cscrollY');
                }else {
                    wrapper.classList.remove('cscrollY');
                }

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                var that = this;
                page.render(renderContext).then(
                    function (){
                        var url = canvas.toDataURL('image/jpeg');
                        canvas.style.background = 'url(' + url + ')';
                        canvas.style.backgroundRepeat = 'no-repeat';
                            displayCb();
                        that[wb] = {pdfrender : true}
                    }
                );

            },

            displayPage : function (pdf, num, cb, firstTime) {
               displayCb = cb;
                var that = this;
                pdf.getPage(num).then(function getPage(page) {
                    console.log('PDF is being rendered first time');
                    that.page = page
                    that.renderPage(page);
                    if(typeof firstTime != 'undefined'){
                        var wb = virtualclass.gObj.currWb;
                        that.initWhiteboardData(wb);
                    }
                });
            },

            initWhiteboardData : function (wb){
                // Below condition is satisfied only if the whiteboard data is...
                // ...available in indexDB
                if(typeof virtualclass.gObj.tempReplayObjs[wb] == 'object' ){
                    if(virtualclass.gObj.tempReplayObjs[wb].length <= 0){
                        var that = this;
                        setTimeout(
                            function (){
                                that.initWhiteboardData(wb);
                            },500
                        );
                    } else {
                        virtualclass.wb[wb].utility.replayFromLocalStroage(virtualclass.gObj.tempReplayObjs[wb]);
                    }
                }

            },

            zoomIn : function (){
                var wrapper = document.querySelector('#canvasWrapper'+  virtualclass.gObj.currWb);
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);
                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;

                virtualclass.prvCanvasScale = virtualclass.canvasScale;

                // SCALE_FACTOR = (((virtualclass.canvasScale * 1) + 0.05) / virtualclass.canvasScale);

                virtualclass.canvasScale = virtualclass.canvasScale * SCALE_FACTOR;

                console.log('Canvas scale ' + virtualclass.canvasScale);

                var actualWidth = virtualclass.vutil.getWidth(canvas) * SCALE_FACTOR;
                var actualHeight = virtualclass.vutil.getHeight(canvas) * SCALE_FACTOR;

                this._zoom(canvas, actualWidth, actualHeight);

            },



            _zoom : function (canvas, canvasWidth, canvasHeight){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                if(canvasWidth > wrapperWidth){
                    wrapper.classList.add('scrollX');
                }

                virtualclass.pdfRender.displayPage(virtualclass.pdfRender.shownPdf,  1, function (){
                    var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                    var objects = vcan.main.children;

                    if(objects.length == 0){
                        if( virtualclass.wb[virtualclass.gObj.currWb].scale != null){
                            virtualclass.wb[virtualclass.gObj.currWb].scale *=   SCALE_FACTOR;
                        }else {
                            virtualclass.wb[virtualclass.gObj.currWb].scale = 1 * SCALE_FACTOR;
                        }

                    } else {
                        for (var i in objects) {
                            var scaleX = objects[i].scaleX;
                            var scaleY = objects[i].scaleY;

                            var left = objects[i].x;
                            var top = objects[i].y;

                            var tempScaleX = scaleX * SCALE_FACTOR;
                            var tempScaleY = scaleY * SCALE_FACTOR;

                            var tempLeft = left * SCALE_FACTOR;
                            var tempTop = top * SCALE_FACTOR;

                            objects[i].scaleX = tempScaleX;
                            objects[i].scaleY = tempScaleY;

                            objects[i].x = tempLeft;
                            objects[i].y = tempTop;

                            virtualclass.wb[virtualclass.gObj.currWb].scale = tempScaleX;
                            //virtualclass.wb[virtualclass.gObj.currWb].scale = 1;

                            objects[i].setCoords();
                        }
                    }



                    vcan.renderAll();

                });
            },

            zoomOut : function (){
                var wrapper = document.querySelector('#canvasWrapper'+  virtualclass.gObj.currWb);

                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                virtualclass.prvCanvasScale = virtualclass.canvasScale;

                // SCALE_FACTOR = (1 - (((virtualclass.canvasScale * 1) - 0.05) / virtualclass.canvasScale)) + 1;


                virtualclass.canvasScale = virtualclass.canvasScale / SCALE_FACTOR;

                var actualWidth  = virtualclass.vutil.getWidth(canvas) * (1 / SCALE_FACTOR);
                var actualHeight = virtualclass.vutil.getHeight(canvas) * (1 / SCALE_FACTOR);

                if(actualWidth <= wrapperWidth){
                    wrapper.classList.remove('scrollX');
                }

                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, actualHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, actualWidth);
                virtualclass.pdfRender.displayPage(virtualclass.pdfRender.shownPdf,  1, function (){
                    var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                    var objects = vcan.main.children;
                    for (var i in objects) {
                        var scaleX = objects[i].scaleX;
                        var scaleY = objects[i].scaleY;
                        var left = objects[i].x;
                        var top = objects[i].y;

                        var tempScaleX = scaleX * (1 / SCALE_FACTOR);
                        var tempScaleY = scaleY * (1 / SCALE_FACTOR);
                        var tempLeft = left * (1 / SCALE_FACTOR);

                        var tempTop = top * (1 / SCALE_FACTOR);

                        objects[i].scaleX = tempScaleX;
                        objects[i].scaleY = tempScaleY;
                        objects[i].x = tempLeft;
                        objects[i].y = tempTop;

                        objects[i].setCoords();

                        virtualclass.wb[virtualclass.gObj.currWb].scale = tempScaleX;
                       // virtualclass.wb[virtualclass.gObj.currWb].scale = 1;
                    }

                    vcan.renderAll();
                });
            },

            fitToScreen : function (page){
                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width) + 50;
                var viewport = page.getViewport((+(wrapperWidth)-100) / page.getViewport(1.0).width);
                virtualclass.prvCanvasScale = virtualclass.canvasScale;
                virtualclass.canvasScale = viewport.scale;

                this._fitToScreen(canvas, wrapperWidth, canvas.height);

            },

            _fitToScreenOld : function (canvas, canvasWidth, canvasHeight){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                if(canvasWidth > wrapperWidth){
                    wrapper.classList.add('scrollX');
                }

                virtualclass.pdfRender.displayPage(virtualclass.pdfRender.shownPdf,  1, function (){
                    var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                    var objects = vcan.main.children;

                    for (var i in objects) {
                        var scaleX = objects[i].scaleX;
                        var scaleY = objects[i].scaleY;

                        var left = objects[i].x;
                        var top = objects[i].y;

                        var tempScaleX = 1;
                        var tempScaleY = 1;

                        var tempLeft = left  / scaleX;
                        var tempTop = top  / scaleY;

                        objects[i].scaleX = tempScaleX;
                        objects[i].scaleY = tempScaleY;

                        objects[i].x = tempLeft;
                        objects[i].y = tempTop;

                        objects[i].setCoords();

                        virtualclass.wb[virtualclass.gObj.currWb].scale = tempScaleX;
                    }

                    vcan.renderAll();

                });
            },

            _fitToScreen : function (canvas, canvasWidth, canvasHeight){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                if(canvasWidth > wrapperWidth){
                    wrapper.classList.add('scrollX');
                }

                virtualclass.pdfRender.displayPage(virtualclass.pdfRender.shownPdf,  1, function (){
                    var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                    var objects = vcan.main.children;

                    // for (var i in objects) {
                    //     var scaleX = objects[i].scaleX;
                    //     var scaleY = objects[i].scaleY;
                    //
                    //     var scalFactor = (virtualclass.canvasScale - objects[i].scaleX);
                    //
                    //     var left = objects[i].x;
                    //     var top = objects[i].y;
                    //
                    //     var tempLeft = left  * scalFactor;
                    //     var tempTop = top  * scalFactor;
                    //
                    //     objects[i].scaleX = scaleX * scalFactor ;
                    //     objects[i].scaleY = scaleY * scalFactor;
                    //
                    //     objects[i].x = tempLeft;
                    //     objects[i].y = tempTop;
                    //
                    //     objects[i].setCoords();
                    //
                    //     virtualclass.wb[virtualclass.gObj.currWb].scale = scaleX;
                    // }

                    for (var i in objects) {
                        var scaleX = objects[i].scaleX;
                        var scaleY = objects[i].scaleY;

                        var scaleFactor = ((virtualclass.canvasScale * 1)/(virtualclass.prvCanvasScale * 1));


                        var left = objects[i].x;
                        var top = objects[i].y;

                        // if (scaleFactor >= 1) {
                            var tempLeft = left  * (scaleFactor );
                            var tempTop = top  * (scaleFactor );

                            objects[i].scaleX = scaleX * (scaleFactor );
                            objects[i].scaleY = scaleY * (scaleFactor);
                        //
                        // } else {
                        //     var tempLeft = left * ( scaleFactor);
                        //     var tempTop = top * ( scaleFactor);
                        //
                        //     objects[i].scaleX = scaleX  * ( scaleFactor);
                        //     objects[i].scaleY = scaleY * ( scaleFactor);
                        // }

                        objects[i].x = tempLeft;
                        objects[i].y = tempTop;

                        objects[i].setCoords();

                        virtualclass.wb[virtualclass.gObj.currWb].scale = scaleX;
                    }

                    vcan.renderAll();

                });
            },

            isBiggerCanvasHeight : function (canvaS){
                var canvasWrapper = canvas.parentNode;

            },

            isBiggerCanvasWidth : function (canvas){
                var canvasWrapper = canvas.parentNode;
            },

            calculateScaleAtFirst : function (page, canvas){
                var viewport = page.getViewport((+(canvas.width)-100) / page.getViewport(1.0).width);
                this.firstTime = false;
                return viewport;
            }
        }
    }
    window.pdfRender = pdfRender;

})(window);