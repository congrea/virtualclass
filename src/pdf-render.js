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
            xhr : new CommonXHR(),
            xhrNext : new CommonXHR(),
            init : function (canvas, currNote){
                var virtualclasElem = document.querySelector('#virtualclassCont');
                // if(virtualclasElem != null){
                //    // virtualclasElem.classList.add('pdfRendering');
                //     // console.log('Add pdf rendering');
                // }

                io.globallock = false;
                virtualclass.gObj.firstNormalRender = false;
                if(typeof currNote != 'undefined'){
                    var note = virtualclass.dts.getNote(currNote);
                    this.url = note.pdf;
                }else {
                    this.url = whiteboardPath + 'resources/sample.pdf';
                } 

                this.loadPdf(this.url, canvas, currNote);

            },
            
            prefechPdf (noteId) {
                var note = virtualclass.dts.getNote(noteId);
                this.xhrNext.send(note.pdf, this.afterPdfPrefetch.bind(this, noteId), 'arraybuffer');
            },
            
            afterPdfPrefetch (noteId, data) {
                virtualclass.gObj.next = {};
                virtualclass.gObj.next[noteId] = data ;
            },


            async loadPdf (url, canvas, currNote){
                // console.log('====PDF, Init1 load ',  virtualclass.gObj.currWb, url);
                if(virtualclass.gObj.hasOwnProperty('getDocumentTimeout')){
                    clearTimeout(virtualclass.gObj.getDocumentTimeout);
                }
                if (virtualclass.gObj.getDocumentTimer == null || virtualclass.gObj.getDocumentTimer == false) {

                    this._loadPdf(url, canvas, currNote);
                    virtualclass.gObj.getDocumentTimer = true;
                    virtualclass.gObj.getDocumentTimeout = setTimeout(() => {
                        virtualclass.gObj.getDocumentTimer = false;
                    },1000);
                } else {
                    virtualclass.gObj.getDocumentTimeout = setTimeout(() => {
                        // console.log('====PDF, Init1 load final',  url);
                        this._loadPdf(url, canvas, currNote);
                        virtualclass.gObj.getDocumentTimer = false;
                    },1000);
                }
            },

            _loadPdf  (url, canvas, currNote){
                // console.log('====PDF, Init2 load ' + virtualclass.gObj.currWb);
                if(virtualclass.gObj.next.hasOwnProperty(currNote)){
                     this.afterPdfLoad(canvas, currNote, virtualclass.gObj.next[currNote]);
                } else {
                    this.xhr.send(url, this.afterPdfLoad.bind(this, canvas, currNote), 'arraybuffer');
                }

                // if(typeof virtualclass.gObj.currWb != 'undefined' && virtualclass.gObj.currWb != null){
                //     var note = document.querySelector('#note'+currNote);
                //     if(note != null && note.nextElementSibling != null){
                //         var preFetchSlide =  note.nextElementSibling.dataset.slide;
                //         virtualclass.pdfRender[virtualclass.gObj.currWb].prefechPdf(preFetchSlide);
                //     }
                // }
            },
            
            async afterPdfLoad (canvas, currNote, data){
                // console.log('====PDF, After PDF load' + virtualclass.gObj.currWb);
                this.canvasWrapper = document.querySelector('#canvasWrapper'+virtualclass.gObj.currWb);
                this.canvas = canvas;
                var doc = {};
                doc.data = data;
                // doc.currwb = virtualclass.gObj.currWb;
                if (virtualclass.gObj.myworker != null) {
                    doc.worker = virtualclass.gObj.myworker;
                }

                var that = this;
                var prvApp = virtualclass.currApp;  
                var prvWhiteboard = virtualclass.gObj.currWb;


                /** Avoids the PDF which would be different for current app
                 * to reproduce the problem without condition, page refresh on docuemnt share
                 * without load pdf click on whiteboard and again on document share and finally on whiteboard,
                 * */
                if(prvApp == virtualclass.currApp){
                    if(typeof currNote == 'undefined'){
                        that.wbId = virtualclass.gObj.currWb;
                    }else {
                         that.wbId = currNote;
                    }

                    console.log('-----------START ' +virtualclass.currApp+'----------');
                    console.log('PDF render request to pdf.js 1');
                    PDFJS.workerSrc = whiteboardPath + "build/src/pdf.worker.min.js";
                    PDFJS.getDocument(doc).then(function (pdf) {
                        if (virtualclass.gObj.myworker == null) {
                            virtualclass.gObj.myworker = pdf.loadingTask._worker; // Contain the single pdf worker for all PDFS
                        }
                        that.displayPage(pdf, 1, function (){},true);
                        that.shownPdf = pdf;
                        // console.log('====PDF, placed at shown PDF '  + doc.currwb);
                        if(!roles.hasControls()){
                            that.topPosY = 0;
                            that.leftPosX = 0;
                        }
                        that.scrollEvent();
                    });
                }else {
                    if(virtualclass.currApp == 'DocumentShare'){
                        // virtualclasElem.classList.remove('pdfRendering');
                        virtualclass.wbCommon.deleteWhiteboard(prvWhiteboard);
                    }
                }

                if(typeof virtualclass.gObj.currWb != 'undefined' && virtualclass.gObj.currWb != null){
                    var note = document.querySelector('#note'+currNote);
                    if(note != null && note.nextElementSibling != null){
                        var preFetchSlide =  note.nextElementSibling.dataset.slide;
                        virtualclass.pdfRender[virtualclass.gObj.currWb].prefechPdf(preFetchSlide);
                    }
                }

            },

            updateScrollPosition : function (pos, type){
                // console.log('Update scroll type ' + type + ' ' + pos);
                var tp = type;
                if(typeof this.scroll[tp] == 'object' && this.scroll[tp].hasOwnProperty('b')){
                    this.scroll[tp].b = pos;
                    this.scroll[tp].c = this.scroll[tp].b  + this.scroll[tp].studentVPm;
                }else {
                    console.log('Scroll b is undefined');
                }
            },

            // For Teacher
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

            onScroll : function (elem, resetScroll){
                var topPosY = elem.scrollTop;
                var leftPosX = elem.scrollLeft;

                var topPosY, leftPosX;


                topPosY = elem.scrollTop;
                leftPosX = elem.scrollLeft;


                if(topPosY > 0 || typeof resetScroll !== 'undefined'){
                    this._scroll(leftPosX, topPosY, elem, 'Y');
                }

                if(leftPosX > 0 || typeof resetScroll !== 'undefined' ){
                    this._scroll(leftPosX, topPosY, elem, 'X')
                }


                if(!roles.hasControls()){
                    virtualclass.pdfRender[virtualclass.gObj.currWb].setScrollPosition({scX : leftPosX, scY : topPosY});
                }
            },

            _scroll : function (leftPosX, topPosY, elem, type){
                if(roles.hasControls()){
                    this.topPosY = topPosY;
                    this.leftPosX = leftPosX;
                    // console.log("==== top position y " + this.topPosY);
                    // console.log("==== top position x" + this.leftPosX);
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

            renderPage : async function  (page, firstTime)  {
                console.log("#### render page");
                if(virtualclass.gObj.currWb != null){
                    var scale = this.pdfScale;
                    if(virtualclass.zoom.canvasScale != null && virtualclass.zoom.canvasScale != ''){
                        if(virtualclass.zoom.canvasScale > 0){
                            scale = virtualclass.zoom.canvasScale;
                        }else {
                            console.log('Why negative value');
                        }
                    }

                    if(virtualclass.currApp == 'Whiteboard' && this.wbId != null && virtualclass.gObj.currWb != this.wbId){
                        var wb = (this.wbId.indexOf('_doc_') > -1) ? this.wbId : '_doc_'+this.wbId+'_'+this.wbId;
                    }else {
                        var wb = virtualclass.gObj.currWb;
                    }
            
                    var canvas = virtualclass.wb[wb].vcan.main.canvas;
                    var viewport;


                    if(virtualclass.gObj.hasOwnProperty('fitToScreen')){
                        canvas.width = window.innerWidth - virtualclass.zoom.getReduceValueForCanvas();
                        console.log("==== a canvas width fit to screen");
                        if(!roles.hasControls()){
                            canvas.width += 50; // add left bar's width on canvas width for student
                        }
                    } else if(virtualclass.zoom.hasOwnProperty('performZoom')){
                        canvas.width = virtualclass.zoom.canvasDimension.width;
                        delete virtualclass.zoom.performZoom;

                    } else if(virtualclass.zoom.hasOwnProperty('canvasDimension')){
                        console.log("==== a canvas width dimension " + virtualclass.zoom.canvasDimension.width + ' scale=' + virtualclass.zoom.canvasScale);
                        canvas.width = virtualclass.zoom.canvasDimension.width;
                    // } else if(canvas.offsetWidth === 0 && document.querySelector('#virtualclassApp').style.display === "none"){
                    } else if(canvas.offsetWidth === 0){
                        canvas.width = window.innerWidth - 382;
                        console.log("==== a canvas width click to continue");
                    }else if(virtualclass.isPlayMode){
                        canvas.width = window.innerWidth - 382;
                        console.log("==== a canvas width");
                    }

                    if(this.firstTime){
                        this.firstTime = false;
                        console.log("## WHITEBOARD Canvas = ", virtualclass.zoom.prvCanvasScale, " ID ", virtualclass.gObj.currWb);
                        if(virtualclass.zoom.canvasScale == null){
                            viewport = page.getViewport((canvas.width) / page.getViewport(1.0).width);
                            // virtualclass.zoom.canvasScale =  viewport.scale;
                        }else {
                            viewport = page.getViewport(scale);
                        }
                    }  else {
                        viewport = page.getViewport((canvas.width) / page.getViewport(1.0).width);
                    }

                    virtualclass.zoom.prvCanvasScale = virtualclass.zoom.canvasScale;
                    virtualclass.zoom.canvasScale =  viewport.scale;

                    canvas.height  = viewport.height;

                    var pdfCanvas = canvas.nextSibling;
                    pdfCanvas.width = canvas.width;
                    pdfCanvas.height = canvas.height;

                    virtualclass.zoom.canvasDimension = {};
                    virtualclass.zoom.canvasDimension.width =  canvas.width;
                    virtualclass.zoom.canvasDimension.height =  canvas.height;
                    console.log("==== canvas dimension ", virtualclass.zoom.canvasDimension.width);

                    if(virtualclass.gObj.hasOwnProperty('fitToScreen')){
                        let canvasWrapper = document.querySelector('#canvasWrapper'+virtualclass.gObj.currWb);
                        if(canvasWrapper != null){
                            if((canvasWrapper.scrollHeight <= canvasWrapper.clientHeight) || (canvasWrapper.scrollWidth <= canvasWrapper.clientWidth)){
                                virtualclass.pdfRender[virtualclass.gObj.currWb].onScroll(canvasWrapper, true);
                            }
                        }
                    }

                    delete virtualclass.gObj.fitToScreen;
            
                    var context = pdfCanvas.getContext('2d');
            
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
            
                    var that = this;
                    console.log('PDF render initiate to display pdf on canvas 3');
                    page.render(renderContext).then(
                        function (){
            
                            console.log('PDF render DONE 4');
                            console.log('-----------END----------');
            
                            canvas.parentNode.dataset.pdfrender = true;
                            // canvas.style.backgroundRepeat = 'no-repeat';
                            that[wb] = {pdfrender : true};
            
                            // virtualclass.dts[virtualclass.gObj.currWb].showZoom();
            
                            virtualclass.vutil.showZoom();
            
                            if(firstTime != undefined){
                                if(virtualclass.gObj.currWb != null ){
                                    that.initWhiteboardData(virtualclass.gObj.currWb);
                                }
                            }
            
                            displayCb();
                            if (typeof that.shownPdf == "object") {
                                io.globallock = false;
                                io.onRecJson(null);

                                if(virtualclass.gObj.hasOwnProperty('pdfNormalTimeout')){
                                    clearTimeout(virtualclass.gObj.pdfNormalTimeout);
                                }

                                if(!virtualclass.gObj.firstNormalRender){
                                    if(virtualclass.gObj.currWb != null){
                                        if(document.querySelector('#canvas' + virtualclass.gObj.currWb+ '_pdf') != null){
                                            /* Always run first document with Normal render*/
                                            // virtualclass.zoom.adjustScreenOnDifferentPdfWidthRender(page);
                                            virtualclass.zoom.adjustScreenOnDifferentPdfWidth(page);
                                            virtualclass.gObj.firstNormalRender = true;
                                        }
                                    }

                                }
                                virtualclass.vutil.removeClass('virtualclassCont', 'resizeWindow');
            
                            } else {
                                console.log("We should have a PDF here");
                            }
                        }
                    );
                }
            },

            displayPage : function (pdf, num, cb, firstTime) {
                displayCb = cb;
                this._displayPage(pdf, num, cb, firstTime);
            },

            _displayPage : async function (pdf, num, cb, firstTime){
                let page = await pdf.getPage(num);
                virtualclass.pdfRender[virtualclass.gObj.currWb].page = page;
                console.log("==== to be display ", virtualclass.pdfRender[virtualclass.gObj.currWb].page, virtualclass.gObj.currWb);
                if(typeof firstTime !== 'undefined'){
                    await this.renderPage(page, firstTime);
                } else {
                    await this.renderPage(page, null);
                }
            },

            fitToScreenIfNeed : function (){
                if(virtualclass.currApp == 'DocumentShare' && !virtualclass.gObj.docPdfFirstTime){
                    virtualclass.gObj.docPdfFirstTime = true;
                    virtualclass.zoom.zoomAction('fitToScreen');
                }
            },

            initWhiteboardData : async function (wb){
                await virtualclass.storage.getWbData(wb);
                if (typeof virtualclass.gObj.tempReplayObjs[wb] === 'object' && virtualclass.gObj.tempReplayObjs[wb].length > 0) {
                    console.log('Start whiteboard replay from local storage');
                    virtualclass.wb[wb].utility.replayFromLocalStroage(virtualclass.gObj.tempReplayObjs[wb])
                }
            },

            _zoom : function (canvas, canvasWidth, canvasHeight, normalZoom){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);

                var that = this;
                this.displayPage(this.shownPdf,  1, function (){
                    if(typeof normalZoom === 'undefined' ){
                        console.log('Zooming whiteboard');
                        for(let wid in virtualclass.pdfRender){
                            that.zoomwhiteboardObjects(wid);
                        }
                    }else {

                        /* Following is normal case where we don't need to zoom the
                           whiteboard objects, but only shows the pdf at passed canvas-scale */
                        if(virtualclass.gObj.currWb != null){
                            var vcan = virtualclass.wb[virtualclass.gObj.currWb].vcan;
                            vcan.renderAll();
                            //that.displayNormalWhiteboards(virtualclass.gObj.currWb);
                        }
                    }
                    if(canvasWidth > wrapperWidth){
                        wrapper.classList.add('scrollX');
                    }
                });
            },


            fitWhiteboardAtScale (wId) {
                //console.log("## WHITEBOARD SCALE CALLED", wId);
                if(typeof virtualclass.wb[wId] === 'object'){
                    let vcan = virtualclass.wb[wId].vcan;
                    let objects = vcan.main.children;
                    if(objects.length > 0){
                        for (let i in objects) {
                            let scaleX = objects[i].scaleX;
                            let scaleY = objects[i].scaleY;

                            let left = objects[i].x;
                            let top = objects[i].y;

                            let orginalX = left / objects[i].scaleX;
                            let orginalY = top / objects[i].scaleY;

                            let tempScaleX = (( scaleX / virtualclass.zoom.prvCanvasScale ) * virtualclass.zoom.canvasScale);
                            let tempScaleY = (( scaleY / virtualclass.zoom.prvCanvasScale ) * virtualclass.zoom.canvasScale);

                            let tempLeft = tempScaleX * orginalX;
                            let tempTop = tempScaleY * orginalY;

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


            zoomwhiteboardObjects : function (wId){
                this.fitWhiteboardAtScale(wId);
            },

            zoomOutWhiteboardObjects : function (wid){
                this.fitWhiteboardAtScale(wid);
            },

            fitToScreenWhiteboardObjects : function (wid){
                this.fitWhiteboardAtScale(wid);
            },

            _zoomOut : function (canvas, actualWidth, actualHeight, normalZoom){
                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, actualHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, actualWidth);
                var that = this;
                this.displayPage(this.shownPdf,  1, function (){
                    // that.zoomOutWhiteboardObjects(virtualclass.gObj.currWb);
                    for(wid in virtualclass.pdfRender){
                        that.zoomOutWhiteboardObjects(wid);
                    }
                });
            },




            _fitToScreen : function (canvas, canvasWidth, canvasHeight){
                console.log('==== Current whiteboard id ' + virtualclass.gObj.currWb);

                virtualclass.vutil.setHeight(virtualclass.gObj.currWb, canvas, canvasHeight);
                virtualclass.vutil.setWidth(virtualclass.gObj.currWb, canvas, canvasWidth);

                var wrapper = canvas.parentNode;
                // var wrapperWidth = virtualclass.vutil.getValueWithoutPixel(wrapper.style.width);
                var wrapperWidth = wrapper.offsetWidth;

                var that = this;

                if(this.shownPdf !== " "){
                    this.displayPage(this.shownPdf,  1, function (){
                        for(wid in virtualclass.pdfRender){
                            that.fitToScreenWhiteboardObjects(wid);
                        }

                        //that.zoomOutWhiteboardObjects(virtualclass.gObj.currWb);

                        if(canvasWidth > wrapperWidth && ((canvasWidth - wrapperWidth) > 55)){
                            wrapper.classList.add('scrollX');
                        } else {
                            wrapper.classList.remove('scrollX');
                        }
                    });
                }else {
                    console.log("ERROR : shown pdf is not available");
                }
            },


            isBiggerCanvasHeight : function (canvaS){
                var canvasWrapper = canvas.parentNode;
            },

            isBiggerCanvasWidth : function (canvas){
                var canvasWrapper = canvas.parentNode;
            },

            /**
             *
             * **/

            calculateScaleAtFirst : function (page, canvas){
                //var viewport = page.getViewport((window.innerWidth - 362) / page.getViewport(1.0).width);
                var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width);
                this.firstTime = false;
                return viewport;
            },

            isWhiteboardAlreadyExist : function (note){
                return (this.canvas != null);
            },

            defaultScroll : function (){
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