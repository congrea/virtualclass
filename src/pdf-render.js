(function (window) {
    function pdfRender(){
        return {
            firstTime : true,
            shownPdf: "",
            canvasWrapper : null,
            canvasId: null,
            canvas : null,
            pdfScale : 1,
            url : "",
            init : function (canvas, currNote){
                console.log('PDF render init');
                var virtualclasElem = document.querySelector('#virtualclassCont');
                if(virtualclasElem != null){
                    virtualclasElem.classList.add('pdfRendering');
                    console.log('Add pdf rendering');
                }

                io.globallock = false;
                virtualclass.gObj.firstNormalRender = false;
                if(typeof currNote != 'undefined'){
                    var note = virtualclass.dts.getNote(currNote);
                    this.url = note.pdf;
                }else {
                    this.url = whiteboardPath + 'example/sample.pdf';
                    // this.url = 'https://media.congrea.net/yJaR3lEhER3470dI88CMD5s0eCUJRINc2lcjKCu2/12323/0b5b11ce-7204-4771-a997-a0fb3f9ccc7d/pdf/001.pdf';
                }

                this.canvasWrapper = document.querySelector('#canvasWrapper'+virtualclass.gObj.currWb);

                // TODO, this shoud be ENABLE suman
                /*
                var canvasScale = localStorage.getItem('wbcScale');
                if(canvasScale != null){
                    // virtualclass.zoom.canvasScale = canvasScale;
                    virtualclass.zoom.canvasScale = canvasScale;
                    this.firstTime = false;
                } */

                this.canvas = canvas;
                var that = this;
                var doc = {};
                doc.url = this.url;
                doc.withCredentials = true;
                doc.disableAutoFetch = true;

                if(virtualclass.gObj.hasOwnProperty('getDocumentTimeout')){
                    clearTimeout(virtualclass.gObj.getDocumentTimeout);
                }
                virtualclass.gObj.getDocumentTimeout = setTimeout(
                    function (){
                        console.log('PDF render initiate 1');
                        PDFJS.getDocument(doc).then(function (pdf) {
                            that.displayPage(pdf, 1, function (){
                                //console.log('Pdf share : put in main children');
                                },
                                true);
                            // that.displayPage(pdf, 1, true);
                            that.shownPdf = pdf;
                        });

                        if(!roles.hasControls()){
                            that.topPosY = 0;
                            that.leftPosX = 0;
                        }
                        that.scrollEvent();

                    },1000
                );
            },

            updateScrollPosition : function (pos, type){
                var tp = type;
                if(typeof this.scroll[tp] == 'object' && this.scroll[tp].hasOwnProperty('b')){
                    this.scroll[tp].b = pos;
                    this.scroll[tp].c = this.scroll[tp].b  + this.scroll[tp].studentVPm;
                }else {
                    console.log('Scroll b is undefined');
                }
            },

            // for teacher
            scrollEvent : function (){
                // document.querySelector('#canvasWrapper'+virtualclass.gObj.currWb);
                var elem = this.canvasWrapper;
                var topPosY = elem.scrollTop;
                var leftPosX = elem.scrollLeft;
                 // using for text box wrapper on whiteboard
                 virtualclass.topPosY = topPosY;
                 virtualclass.leftPosX = leftPosX;

                this.topPosY = topPosY;
                this.leftPosX = leftPosX;

                var that =  this;
                elem.onscroll = function (){
                    that.onScroll(elem);
                }
            },

            onScroll : function (elem, defaultCall){
                var topPosY = elem.scrollTop;
                var leftPosX = elem.scrollLeft;

                var topPosY, leftPosX;


                topPosY = elem.scrollTop;
                leftPosX = elem.scrollLeft;

                //var sendData = null;

                // if(topPosY > 0){
                //     // sendData = that._scrollTop(leftPosX, topPosY, elem, 'X');
                //     var tempData = this._scroll(leftPosX, topPosY, elem, 'Y');
                //     if(tempData != null){
                //         sendData  = tempData;
                //     }
                // }

                if(topPosY > 0){
                    this._scroll(leftPosX, topPosY, elem, 'Y');
                }

                if(leftPosX > 0){
                    this._scroll(leftPosX, topPosY, elem, 'X')
                }


                // if(leftPosX > 0){
                //     var resX = this._scroll(leftPosX, topPosY, elem, 'X');
                //     if(sendData != null){
                //         // Merging the object resX with sendData
                //         if(resX != null){
                //             sendData = Object.assign(sendData, resX);
                //         }
                //     }
                // }

                // if(sendData != null){
                //     this.currentScroll = sendData;
                // }

                if(!roles.hasControls()){
                    virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition({scX : leftPosX, scY : topPosY});
                }
            },

            _scroll : function (leftPosX, topPosY, elem, type){
                if(roles.hasControls()){
                    this.topPosY = topPosY;
                    this.leftPosX = leftPosX;
                    return this.scrollPosition(elem, type);
                } else {
                    if(type == 'Y'){
                        var pos = topPosY;
                    } else if(type == 'X'){
                        var pos = leftPosX;
                    }
                    this.updateScrollPosition(pos, type);
                }
                return null;
            },

            scrollPosition : function (elem, type){
                // var canvas = virtualclass.wb[virtualclass.gObj.currWb].vcan.main.canvas;
                var canvas = this.canvas;
                var tp = type;

                if(tp == 'Y'){
                    var pos = elem.scrollTop;
                    var canvasM = canvas.height;
                } else if(tp == 'X'){
                    var pos = elem.scrollLeft;
                    var canvasM = canvas.width;
                }


                this['scrollPos'+tp] = (pos / canvasM) * 100;

                var canvasInner = 'canvas'+virtualclass.gObj.currWb;
                var wrapper = 'canvasWrapper'+virtualclass.gObj.currWb;

                var viewPortM = virtualclass.vutil.getElemM(wrapper, tp);

                this['actualVp'+ tp] = viewPortM;
                this['viewPort'+tp] = (viewPortM / canvasM) * 100;

                var result = {};
                result['vp'+tp] = this['viewPort'+tp];
                result['sc'+tp] = this['scrollPos'+tp];

                return result;

            },

            /** In below code tp represents scroll type
             * X and Y
             */
            scroll : {
                caclculatePosition : function (pos, canvas, type){
                    this.type = type;

                    var tp = this.type;
                    if(this[tp] == null){
                        this[tp] = {};
                    }
                    this[tp].a = 0;
                    this[tp].d = canvas; // Canvas's with or height

                    var wrapperId = 'canvasWrapper'+virtualclass.gObj.currWb;
                    var studentWrapper = document.querySelector('#'+wrapperId);
                    if(studentWrapper != null){
                        if(this.type == 'X'){
                            this[tp].b = studentWrapper.scrollLeft;
                        }else if(this.type == 'Y'){
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

            //for student
            setScrollPosition : function (obj){
                if(obj.hasOwnProperty('scY') && obj.scY != null){
                    this.scroll.caclculatePosition(obj.scY, this.canvas.height, 'Y');
                }
                if(obj.hasOwnProperty('scX') && obj.scX != null){
                    this.scroll.caclculatePosition(obj.scX, this.canvas.width, 'X');
                }
            },


            customMoustPointer : function (obj, tp, pos){

//                console.log('custom mouse pointer ay=' + this.scroll[tp].a + ' by=' + this.scroll[tp].b + ' cy=' + this.scroll[tp].c + ' dy=' + this.scroll[tp].d + ' ey' + this.scroll[tp].e);
                this.scroll[tp].e = pos;
                //  e is mouse's position
                // console.log('Scroll '  + tp + ' a ' + this.scroll[tp].a);
                // console.log('Scroll '  + tp + ' b ' + this.scroll[tp].b);
                // console.log('Scroll '  + tp + ' c ' + this.scroll[tp].c);
                // console.log('Scroll '  + tp + ' d ' + this.scroll[tp].d);
                // console.log('Scroll '  + tp + ' e ' + this.scroll[tp].e);

                if(this.scroll[tp].e > this.scroll[tp].c){
                    var scrollPos = this.scroll[tp].b + (this.scroll[tp].d - this.scroll[tp].c);
                    if (scrollPos > this.scroll[tp].e) {
                        scrollPos = this.scroll[tp].e - ((this.scroll[tp].b + this.scroll[tp].c) / 2);
                    }
                    console.log('custom mouse down pointer ay=' + this.scroll[tp].a + ' by=' + this.scroll[tp].b + ' cy=' + this.scroll[tp].c + ' dy=' + this.scroll[tp].d + ' ey' + this.scroll[tp].e + ' scrollPos=' + scrollPos);
                    // var canvasWrapper = document.querySelector('#canvasWrapper' + virtualclass.gObj.currWb);
                    if(tp == 'Y'){
                       this.canvasWrapper.scrollTop = scrollPos;
                    } else {
                        this.canvasWrapper.scrollLeft = scrollPos
                        console.log('Scroll left ' + this.canvasWrapper.scrollLeft);
                    }

                    this.scroll[tp].b = scrollPos;
                    // this.scroll[tp].c = this.scroll[tp].b + this.studentVPheight;
                    this.scroll[tp].c = this.scroll[tp].b + this.scroll[tp].studentVPm;

                }else if(this.scroll[tp].e < this.scroll[tp].b){

                    var scrollPos = this.scroll[tp].b - this.scroll[tp].a;
                    if ((this.scroll[tp].c - scrollPos) < this.scroll[tp].e) {
                        scrollPos = ((this.scroll[tp].b + this.scroll[tp].c) / 2) - this.scroll[tp].e;
                    }
                    // console.log('custom mouse up pointer ay=' + this.scroll[tp].a + ' by=' + this.scroll[tp].b + ' cy=' + this.scroll[tp].c + ' dy=' + this.scroll[tp].d + ' ey' + this.scroll[tp].e + ' scrollPos=' + scrollPos);
                    // var canvasWrapper = document.querySelector('#canvasWrapper' + virtualclass.gObj.currWb);
                    if(tp == 'Y'){
                        this.canvasWrapper.scrollTop = this.canvasWrapper.scrollTop - scrollPos;
                    }else {
                        this.canvasWrapper.scrollLeft = this.canvasWrapper.scrollLeft - scrollPos;
                    }

                    this.scroll[tp].b = scrollPos;
                    this.scroll[tp].c = this.scroll[tp].b + this.scroll[tp].studentVPm;
                    // this.scroll[tp].c = this.scroll[tp].b + this.studentVPheight;
                }
            },


            setCustomMoustPointer : function (obj, tp){
                var idPrefix = 'scrollDiv'+tp + virtualclass.gObj.currWb;
                var mousePointer  = document.querySelector('#' + idPrefix + 'mousePointer');
                    if(mousePointer == null) {
                    var mousePointer = document.createElement('div');
                    mousePointer.className = 'mousepointer';
                    mousePointer.id = idPrefix + 'mousePointer';
                    var scrollWrapper = document.querySelector('#scrollDiv'+tp + virtualclass.gObj.currWb);
                    if(scrollWrapper !=  null){
                        scrollWrapper.appendChild(mousePointer);
                    }
                }

                if(tp == 'Y'){
                    mousePointer.style.top = (obj.y - this.scroll[tp].a) +  'px'
                }else if(tp == 'X'){
                    mousePointer.style.left = (obj.x - this.scroll[tp].a) +  'px';
                }
            },

            // Send default scroll to all.
            sendScroll : function (){
                virtualclass.vutil.setDefaultScroll();
                // var cursor  = {cf : "sc", pr : true, scY : 0, scX:0};
                // virtualclass.vutil.beforeSend(cursor);
                console.log('Send scroll to everyone ');
            },

            // Send current scroll to particular user.

            sendCurrentScroll : function (toUser){
                var scrollPos = {};
                if(this.currentScroll !=  null){
                    scrollPos = Object.assign(scrollPos, this.currentScroll);
                    console.log('Send scroll first time ' + this.currentScroll);
                    var that = this;
                    that.currentScrolltoUser = toUser;
                    // scrollPos.cf = 'scf';
                    // scrollPos.ouser = toUser;
                    // virtualclass.vutil.beforeSend(scrollPos, toUser);

                    setTimeout(
                        function (){
                            that.currentScrolltoUser = toUser;
                            scrollPos.cf = 'scf';
                            scrollPos.toUser = toUser;
                          //  virtualclass.vutil.beforeSend(scrollPos, toUser);
                            virtualclass.vutil.beforeSend({toUser: toUser, 'cf' : 'scf', scY : scrollPos.scY, vpY: scrollPos.vpY}, toUser);
                            console.log('Send scroll ' + scrollPos +'to user ' + toUser );
                            console.log('Send scroll ' + scrollPos);
                        }, 2000
                    );
                }
            },

            renderPage : function  (page, firstTime)  {
                if(virtualclass.gObj.currWb != null){

                    //virtualclass.zoom.canvasScale = canvasScale;
                    var scale = this.pdfScale;
                    if(virtualclass.zoom.canvasScale != null && virtualclass.zoom.canvasScale != ''){
                        if(virtualclass.zoom.canvasScale > 0){
                            scale = virtualclass.zoom.canvasScale;
                        }else {
                            console.log('Why negative value');
                        }
                    }

                    var wb = virtualclass.gObj.currWb;

                    // var canvas = document.getElementById('canvas'+wb);
                    //  var canvas = this.canvas;
                    var canvas = virtualclass.wb[wb].vcan.main.canvas;

                    if(this.firstTime){
                        var viewport = this.calculateScaleAtFirst(page, canvas);
                        virtualclass.zoom.prvCanvasScale = virtualclass.zoom.canvasScale;
                        if(virtualclass.zoom.canvasScale == null){
                            virtualclass.zoom.canvasScale =  viewport.scale;
                        }else {
                            var viewport = page.getViewport(scale);
                        }
                    }else  {
                        var viewport = page.getViewport(scale);
                    }

                    var context = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width + (80); // The view port provides less width(90)
                    console.log('Pdf Canvas width ' + canvas.width);
                    console.log('Pdf Canvas height ' + canvas.height);
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    var that = this;

                    page.render(renderContext).then(
                        function (){
                            console.log('PDF rendered actual 2');
                            var url = canvas.toDataURL('image/jpeg');
                            canvas.style.background = 'url(' + url + ')';
                            canvas.parentNode.dataset.pdfrender = true;
                            canvas.style.backgroundRepeat = 'no-repeat';
                            that[wb] = {pdfrender : true};

                            if(firstTime != undefined){
                                setTimeout(
                                    function (){
                                        that.initWhiteboardData(virtualclass.gObj.currWb);
                                        var virtualclasElem = document.querySelector('#virtualclassCont');
                                        if(virtualclasElem != null){
                                            virtualclasElem.classList.remove('pdfRendering');
                                            console.log('Remove pdf rendering');
                                        } 
                                    },500
                                );
                            }

                            displayCb();
                            if (typeof that.shownPdf == "object") {
                                setTimeout(
                                    function (){
                                        io.globallock = false;
                                        // remove class from main container
                                       /*if(firstTime != null){
                                         var virtualclasElem = document.querySelector('#virtualclassCont');
                                         if(virtualclasElem != null){
                                            virtualclasElem.classList.remove('pdfRendering');
                                            console.log('Remove pdf rendering');
                                         }  
                                       } */
                                       /* var virtualclasElem = document.querySelector('#virtualclassCont');
                                        if(virtualclasElem != null){
                                            virtualclasElem.classList.remove('pdfRendering');
                                        } */
                                        io.onRecJson(null);

                                        if(virtualclass.gObj.hasOwnProperty('pdfNormalTimeout')){
                                            clearTimeout(virtualclass.gObj.pdfNormalTimeout);
                                        }

                                        if(!virtualclass.gObj.firstNormalRender){
                                            virtualclass.gObj.pdfNormalTimeout =  setTimeout(
                                                function (){
                                                    console.log('pdfNormal render');
                                                    if(document.querySelector('#canvas' + virtualclass.gObj.currWb) != null){
                                                        virtualclass.zoom.normalRender();
                                                        virtualclass.gObj.firstNormalRender = true;
                                                        //virtualclass.vutil.setDefaultScroll();
                                                        var scrollObj = {scX : 1, scY : 1}
                                                        virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition(scrollObj);
                                                    }

                                                }, 10 // 10 earlier
                                            );
                                        }
                                        virtualclass.vutil.removeClass('virtualclassCont', 'resizeWindow');
                                    },10
                                );
                                // virtualclass.zoom.normalRender();
                            } else {
                                console.log("We should have a PDF here");
                            }
                        }
                    );
                }
            },

            // displayPage : function (pdf, num, firstTime) {
            displayPage : function (pdf, num, cb, firstTime) {

                displayCb = cb;
                var that = this;
                pdf.getPage(num).then(function getPage(page) {
                    console.log('PDF is being rendered first time');
                    that.page = page
                    if(typeof firstTime != 'undefined'){
                        that.renderPage(page, firstTime);
                    } else {
                        that.renderPage(page);
                    }

                    // if(typeof firstTime != 'undefined'){
                    //     var wb = virtualclass.gObj.currWb;
                    //     that.initWhiteboardData(wb);
                    // }

                });
            },

            initWhiteboardData : function (wb){
                /** Below condition is satisfied only if the whiteboard data is...
                 ..available in indexDB **/
                if(typeof virtualclass.gObj.tempReplayObjs[wb] == 'object'){
                    if(virtualclass.gObj.tempReplayObjs[wb].length <= 0){
                        var that = this;
                        setTimeout(
                            function (){
                                that.initWhiteboardData(wb);
                            },500
                        );
                    } else {
                        console.log('Pdf test, init whiteboard ');
                        console.log('Start whiteboard replay from local storage');
                        virtualclass.wb[wb].utility.replayFromLocalStroage(virtualclass.gObj.tempReplayObjs[wb]);
                    }
                } else {
                    virtualclass.storage.getWbData(wb, function (){
                        if (typeof virtualclass.gObj.tempReplayObjs[wb] == 'object' && virtualclass.gObj.tempReplayObjs[wb].length > 0) {
                            console.log('Start whiteboard replay from local storage');
                            virtualclass.wb[wb].utility.replayFromLocalStroage(virtualclass.gObj.tempReplayObjs[wb])
                        }
                    });
                }
            },

            _zoom : function (canvas, canvasWidth, canvasHeight, normalZoom){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                if(canvasWidth > wrapperWidth){
                    wrapper.classList.add('scrollX');
                }

                var that = this;
                this.displayPage(this.shownPdf,  1, function (){
                    if(typeof normalZoom == 'undefined' ){
                        console.log('Zooming whiteboard');
                        for(wid in virtualclass.pdfRender){
                            that.zoomwhiteboardObjects(wid);
                        }
                    }else {
                        /* Following is normal case where we don't need to zoom the
                           whiteboard objects, but only shows the pdf at passed canvas-scale */
                        var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                        vcan.renderAll();
                    }
                });
            },

            zoomwhiteboardObjects : function (wId){
                var vcan = virtualclass.wb[wId].vcan;
                var objects = vcan.main.children;

                if(objects.length == 0){
                    if( virtualclass.wb[wId].scale != null){
                        virtualclass.wb[wId].scale *=   SCALE_FACTOR;
                    }else {
                        virtualclass.wb[wId].scale = 1 * SCALE_FACTOR;
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

                        virtualclass.wb[wId].scale = tempScaleX;
                        //virtualclass.wb[virtualclass.gObj.currWb].scale = 1;

                        objects[i].setCoords();
                    }
                }
                vcan.renderAll();
            },



            _zoomOut : function (canvas, actualWidth, actualHeight, normalZoom){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, actualHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, actualWidth);
                var that = this;

                this.displayPage(this.shownPdf,  1, function (){
                    for(wid in virtualclass.pdfRender){
                        that.zoomOutWhiteboardObjects(wid);
                    }
                });
            },

            zoomOutWhiteboardObjects : function (wid){
                var vcan = virtualclass.wb[wid].vcan;
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
                    virtualclass.wb[wid].scale = tempScaleX;
                }
                vcan.renderAll();
            },


            _fitToScreen : function (canvas, canvasWidth, canvasHeight){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);


                var that = this;
                this.displayPage(this.shownPdf,  1, function (){
                    for(wid in virtualclass.pdfRender){
                        that.fitToScreenWhiteboardObjects(wid);
                    }
                });
                setTimeout(
                    function (){
                        if(canvasWidth > wrapperWidth && ((canvasWidth - wrapperWidth) > 55)){
                            wrapper.classList.add('scrollX');
                        }else {
                            wrapper.classList.remove('scrollX');
                        }
                    },500
                );


            },

            fitToScreenWhiteboardObjects : function (wid){
                var vcan = virtualclass.wb[wid].vcan;
                var objects = vcan.main.children;
                if(objects.length > 0){
                    for (var i in objects) {
                        var scaleX = objects[i].scaleX;
                        var scaleY = objects[i].scaleY;

                        var scaleFactor = ((virtualclass.zoom.canvasScale * 1)/(virtualclass.zoom.prvCanvasScale * 1));
                        //  console.log('Fit-to-screen, sc('+virtualclass.zoom.canvasScale+' * 1) / psc('+virtualclass.prvCanvasScale+' * 1) = ' + scaleFactor);

                        var left = objects[i].x;
                        var top = objects[i].y;

                        // if (scaleFactor >= 1) {
                        var tempLeft = left  * (scaleFactor );
                        var tempTop = top  * (scaleFactor );

                        objects[i].scaleX = scaleX * (scaleFactor );
                        objects[i].scaleY = scaleY * (scaleFactor);

                        objects[i].x = tempLeft;
                        objects[i].y = tempTop;

                        objects[i].setCoords();
                        virtualclass.wb[wid].scale = scaleX;
                    }
                }

                vcan.renderAll();
            },

            isBiggerCanvasHeight : function (canvaS){
                var canvasWrapper = canvas.parentNode;
            },

            isBiggerCanvasWidth : function (canvas){
                var canvasWrapper = canvas.parentNode;
            },

            calculateScaleAtFirst : function (page, canvas){
              //  var viewport = page.getViewport((+(canvas.parentNode.offsetWidth)-100) / page.getViewport(1.0).width);
                // 380 = right side bar (320) + left bar (60)

                var virtualclassCont = document.querySelector('#virtualclassCont');
                if(virtualclassCont != null){
                    var containerWidth = virtualclassCont.offsetWidth;
                }else {
                    var containerWidth = window.innerWidth;
                }

                var viewport = page.getViewport((+(containerWidth - 480) / page.getViewport(1.0).width));
                this.firstTime = false;
                return viewport;
            },

            isWhiteboardAlreadyExist : function (note){
                return (this.canvas != null);
            },

            defaultScroll : function (){
                alert("hello guys");
                var wb = virtualclass.gObj.currWb;
                if(wb != null){
                    // Defualt scroll trigger
                    this.canvasWrapper.scrollTop = 1;
                }
            }
        }
    }
    window.pdfRender = pdfRender;
})(window);