var pageNum = 1;
var pdfScale = 1;
var shownPdf = "";
var url = 'https://local.vidya.io/virtualclass/example/sample.pdf';
var canvas;

(function (window) {
    function pdfRender(){
        return {
            init : function (canvas){
                canvas = canvas;
                var that = this;
                PDFJS.getDocument(url).then(function (pdf) {
                    that.displayPage(pdf, 1, function (){
                        var currWb = virtualclass.gObj.currWb;
                        var pdfData = {'name' : 'sample', data : 'pdfData', 'type':"pdf"};

                        // virtualclass.wb[currWb].vcan.main.children.unshift(pdfData);
                        virtualclass.wb[currWb].pdfChild = pdfData;

                        console.log('Pdf share : put in main children');
                    });

                    shownPdf = pdf;
                    that.shownPdf = shownPdf;

                });

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

                var viewport = page.getViewport(scale);
                var canvas = document.getElementById('canvas_doc_0_0');
                context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };

                page.render(renderContext).then(
                    function (){
                        var url = canvas.toDataURL('image/jpeg');
                        canvas.style.background = 'url(' + url + ')';
                        canvas.style.backgroundRepeat = 'no-repeat';
                        displayCb();
                    }
                );

            },

            displayPage : function (pdf, num, cb) {
                var canvas = document.getElementById('canvas_doc_0_0');
                context = canvas.getContext('2d');
                context.clearRect(0,0,2000,2000);

                displayCb = cb;
                var that = this;

                pdf.getPage(num).then(function getPage(page) {
                    that.renderPage(page);

                });
            },

            zoomIn : function (){
                var wrapper = document.querySelector('#canvasWrapper'+  virtualclass.gObj.currWb);
                var wrapperWidth = parseInt(wrapper.style.width, 10);
                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;

                // canvasScale = virtualclass.canvasScale * SCALE_FACTOR;

                // virtualclass.canvasScale = canvasScale;

                virtualclass.canvasScale = virtualclass.canvasScale * SCALE_FACTOR;

                console.log('Canvas scale ' + virtualclass.canvasScale);

                var actualWidth = virtualclass.vutil.getWidth(canvas) * SCALE_FACTOR;
                var actualHeight = virtualclass.vutil.getHeight(canvas) * SCALE_FACTOR;

                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, actualHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, actualWidth);

                if(actualWidth > wrapperWidth){
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

                        var tempScaleX = scaleX * SCALE_FACTOR;
                        var tempScaleY = scaleY * SCALE_FACTOR;

                        var tempLeft = left * SCALE_FACTOR;
                        var tempTop = top * SCALE_FACTOR;

                        objects[i].scaleX = tempScaleX;
                        objects[i].scaleY = tempScaleY;

                        objects[i].x = tempLeft;
                        objects[i].y = tempTop;

                        objects[i].setCoords();
                    }

                    vcan.renderAll();

                });
            },

            zoomOut : function (){
                var wrapper = document.querySelector('#canvasWrapper'+  virtualclass.gObj.currWb);

                var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
                var wrapperWidth = parseInt(wrapper.style.width, 10);

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
                    }

                    vcan.renderAll();
                });
            },
        }
    }
    window.pdfRender = pdfRender;

})(window);