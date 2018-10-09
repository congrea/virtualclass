(function (window) {
    function zoomWhiteboard() {
        return {
            init : function (){
                if(document.querySelector(' .zoomControler') ==  null){
                    var parent = document.querySelector("#virtualclassAppLeftPanel");
                    if(parent != null){
                        //if(roles.hasControls()){
                            var zoomControler = virtualclass.getTemplate('zoomControl');
                            var zoomControlerhtml = zoomControler({hasControls: roles.hasControls()});
                            parent.insertAdjacentHTML('beforeend', zoomControlerhtml);
                            this._initScaleController();
                        //}

                        var canvasScale = localStorage.getItem('wbcScale');
                        if(canvasScale != null){
                            this.canvasScale = canvasScale;
                            console.log('Canvas pdf scale ' + this.canvasScale);
                        }
                    }
                }
                var reload = document.querySelector("#virtualclassAppLeftPanel .zoomControler .reloadNote span");
                 if(reload){
                     if(virtualclass.currApp =="Whiteboard"){
                        reload.setAttribute("data-title","Reload whiteboard")
                     }else{
                        reload.setAttribute("data-title", virtualclass.lang.getString('reloadDoc'))
                     }                                                   
                 }
            },

            _initScaleController : function (){
                var elem = document.querySelector('.zoomControler');
                var that = this;

                var that = this;
                var zoomIn = elem.querySelector('.zoomIn');
                zoomIn.addEventListener('click', function (){
                    that.zoomAction('zoomIn');
                });

                var zoomOut = elem.querySelector('.zoomOut');
                zoomOut.addEventListener('click', function (){
                    that.zoomAction('zoomOut');
                });

                var fitScreen = elem.querySelector('.fitScreen');
                fitScreen.addEventListener('click', function (){
                    that.zoomAction('fitToScreen');
                });

                var reload = elem.querySelector('.reloadNote');
                reload.addEventListener('click', function (){
                    that.zoomAction('reload');
                });

            },


            zoomAction : function (fnName){
                var cthis = this;
                if(virtualclass.gObj.hasOwnProperty('zoomActionTime')){
                   clearTimeout(virtualclass.gObj.zoomActionTime);
                }
                virtualclass.gObj.zoomActionTime = setTimeout(
                    function (){
                        if(virtualclass.currApp == 'ScreenShare'){
                            virtualclass.studentScreen[fnName].call(virtualclass.studentScreen);
                        }else {
                            cthis[fnName].call(cthis);
                        }

                    },200
                );
            },

            zoomIn : function (normalZoom){
                var wid = virtualclass.gObj.currWb;
                if(typeof virtualclass.wb[wid] == 'object'){
                    var canvas = virtualclass.wb[wid].vcan.main.canvas;
                    // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
                    var wrapperWidth = canvas.parentNode.offsetWidth;

                    this.prvCanvasScale = this.canvasScale;
                   // alert('canvas scale');
                    this.canvasScale = this.canvasScale * SCALE_FACTOR;

                    console.log('Canvas pdf scale ' + this.canvasScale);

                    var actualWidth = virtualclass.vutil.getWidth(canvas) * SCALE_FACTOR;
                    var actualHeight = virtualclass.vutil.getHeight(canvas) * SCALE_FACTOR;

                    if(typeof normalZoom != 'undefined'){
                        virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight, normalZoom);
                    }else {
                        virtualclass.pdfRender[wid]._zoom.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
                    }
                }
            },

            zoomOut : function (){
                var wid = virtualclass.gObj.currWb;
                // var wrapper = this.canvasWrapper;
                var canvas = virtualclass.wb[wid].vcan.main.canvas;
                var wrapper = canvas.parentNode;
                //var canvas = this.canvas;
                // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width);
                var wrapperWidth = canvas.parentNode.offsetWidth;

                this.prvCanvasScale = this.canvasScale;

                this.canvasScale = this.canvasScale / SCALE_FACTOR;
                console.log('Canvas pdf scale ' + this.canvasScale);

                var actualWidth  = virtualclass.vutil.getWidth(canvas) * (1 / SCALE_FACTOR);
                var actualHeight = virtualclass.vutil.getHeight(canvas) * (1 / SCALE_FACTOR);

                if(actualWidth <= wrapperWidth){
                    wrapper.classList.remove('scrollX');
                }

                virtualclass.pdfRender[wid]._zoomOut.call(virtualclass.pdfRender[wid], canvas, actualWidth, actualHeight);
            },

            fitToScreen : function (){
                var wid = virtualclass.gObj.currWb;
                if(typeof virtualclass.pdfRender[wid] != 'undefined'){
                    var page = virtualclass.pdfRender[wid].page;
                    var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;

                    // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(canvas.parentNode.style.width) + 50;

                   // var wrapperWidth = canvas.parentNode.offsetWidth;
                    // 380 = right side bar (320) + left bar (60)

                    var virtualclassCont = document.querySelector('#virtualclassCont');
                    if(virtualclassCont != null){
                        var containerWidth = virtualclassCont.offsetWidth;
                    }else {
                        var containerWidth = window.innerWidth;
                    }

                    var wrapperWidth = (containerWidth - 380);

                    try {
                        var viewport = page.getViewport((+(wrapperWidth)-100) / page.getViewport(1.0).width);
                        this.prvCanvasScale = this.canvasScale;
                        // alert('canvas scale 2');
                        this.canvasScale = viewport.scale;
                        console.log('Canvas pdf scale ' + this.canvasScale);
                        virtualclass.pdfRender[wid]._fitToScreen.call(virtualclass.pdfRender[wid], canvas, wrapperWidth, canvas.height);
                    }catch (error){
                        console.log('Error ' + error);
                    }
                }
            },
            reload:function(){
                virtualclass.zoom.normalRender();
            },

            normalRender : function (){
                var wid = virtualclass.gObj.currWb;
                if(typeof virtualclass.pdfRender[wid].shownPdf == 'object'){
                    if(virtualclass.zoom.canvasScale != null){
                        virtualclass.zoom.canvasScale = virtualclass.zoom.canvasScale / SCALE_FACTOR;
                        console.log('Canvas pdf scale ' + this.canvasScale);
                        virtualclass.zoom.zoomIn('normalRender');
                    } else {
                        console.log('canvasScale is not defined yet.');
                    }
                }
            },

            removeZoomController : function (){
                var zoomControler = document.querySelector('#virtualclassApp .zoomControler');
                if(zoomControler != null && virtualclass.gObj.studentSSstatus.mesharing){
                    zoomControler.parentNode.removeChild(zoomControler);
                }
            }
        };
    }
    window.zoomWhiteboard = zoomWhiteboard;
})(window);
