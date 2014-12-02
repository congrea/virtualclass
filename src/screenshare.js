/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(
    function (window){
    var screenShare = function (config){
        return {
            
            prevStream : false,
            init : function (screen){
                this.type = screen.type;
                this.ssByClick =  true;
                this.manualStop = false; 
                //if(vApp.gObj.uRole == 't' && !vApp.hasOwnProperty('repType')){
                if(vApp.gObj.uRole == 't' && !vApp.recorder.recImgPlay){
                    //if(!vApp.hasOwnProperty('repType')){
                    this.readyTostart(screen.app);
                    //}
                }else{
                    this._init();
                }
            },
            
            //called when user select the screencall
            _init : function (){
//                alert('screen share init');
                if(vApp.previous != config.id){
                    document.getElementById(vApp.previous).style.display = 'none';    
                    vApp.previous = config.id;
                }
                
                var ss = document.getElementById(config.id);
                if(ss != null){
                    ss.style.display = 'block';
                }
                
                if(!this.hasOwnProperty('id')){
                    
                    this.dc = window.dirtyCorner;
                    //this.sutil = window.sutil;
                    
                    this.postFix = "Cont";
                    this.id =  config.hasOwnProperty('id') ? config.id  : "vAppScreenShare";
                    this.className = "vmApp";
                    this.label = "Local",

                    this.local = this.id + this.label;
                    this.localTemp = this.id + this.label + "Temp";

                    this.classes =  config.hasOwnProperty('class') ? config.classes : "";

                    this.prevImageSlices = [];
                    
                    var ssUI = document.getElementById(this.id);
                    
//                    if(ssUI == null){
//                        ssUI = this.html.UI.call(this, vApp.gObj.uRole);
//                    }

                      if(ssUI != null){
                          ssUI.parentNode.removeChild(ssUI);
                      }
                      ssUI = this.html.UI.call(this, vApp.gObj.uRole);
                    
                     //ssUI = this.html.UI.call(this, vApp.gObj.uRole);
                     //alert(ssUI.id);
                    //critical
                    if(vApp.gObj.uRole == 't'){
                        var beforeAppend = document.getElementById(vApp.rWidgetConfig.id);
                    }else{
                        var beforeAppend = document.getElementById("speakerStudent");
                    }
                    
                    
                    document.getElementById(vApp.html.id).insertBefore(ssUI, beforeAppend);
                    
                   // if(vApp.gObj.uRole == 't' && !vApp.hasOwnProperty('repType')){
                    if(vApp.gObj.uRole == 't' && !vApp.recorder.recImgPlay){
//                        this.localtempCanvas = document.getElementById(this.localTemp+"Video");
//                        this.localtempCont =  this.localtempCanvas.getContext('2d');
                          vApp.vutil.initLocCanvasCont(this.localTemp+"Video");
                    }
                }
            },

            readyTostart : function (app){
                if(app == vApp.apps[1]){
                    this.getScreen();
                }else if(app == vApp.apps[2]){
                    this.wholeScreen(); 
                }
            },
            
            onError : function (e){
                console.log("Error " +  e);
            },

            getScreen : function (){
                //this set timeout is triggered
                //only when the extension is not available
                var pending = window.setTimeout(function () {
                    error = new Error('NavigatorUserMediaError');
                    error.name = 'EXTENSION_UNAVAILABLE';
                    vApp.vutil.initInstallChromeExt(error);
                }, 1000);

                window.postMessage({ type: 'getScreen', id: pending }, '*');
            },    
               
            wholeScreen : function (){
                var  constraints = constraints || {audio: false, video: {
                    mandatory: {
                        chromeMediaSource: 'screen',
                        maxWidth: 1440,
                        maxHeight: 9999
                    },

                    optional: [
//                        {maxWidth: window.screen.width},
//                        {maxHeight: window.screen.height},
                        {maxFrameRate: 3}
                    ]
                
                    }
                };
                
                if(typeof vApp.adpt != 'object'){
                    vApp.adpt = new vApp.adapter();
                }
                
                navigator2 =  vApp.adpt.init(navigator);
                navigator2.getUserMedia(constraints, function (stream){
                    vApp.wss._init();   
                    vApp.wss.initializeRecorder.call(vApp.wss, stream);   
                }, function (e){
                    vApp.wss.onError.call(vApp.ss, e);   
                });
            
            },
            
            
            unShareScreen : function (){    
                this.video.src = "";
                this.localtempCont.clearRect(0, 0, this.localtempCanvas.width, this.localtempCanvas.height);
                clearInterval(vApp.clear);
                this.prevImageSlices = [];
                
                if(this.hasOwnProperty('currentStream')){
                    this.currentStream.stop(); 
                }
                
                vApp.wb.utility.beforeSend({'unshareScreen' : true, st : this.type});
            },
            
            removeStream : function(){
                this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
            },

            initializeRecorder : function (stream){
                changeonresize = 1;

                if(this.prevStream){
                    this.ssByClick = false;
                }
                
                if(typeof vApp.prevScreen != 'undefined'){
                    if(vApp.prevScreen.hasOwnProperty('currentStream')){
                       vApp.prevScreen.unShareScreen();
                    }
                }
                
                this.video = document.getElementById(this.local+"Video");
                
                if(this.video.tagName != "VIDEO"){
                    var earlierVideo = this.video;
                    var video = document.createElement('video');
                    video.id = earlierVideo.id;
                    this.video.parentNode.replaceChild(video,  this.video);
                    
                    this.video = document.getElementById(this.local+"Video");
                    this.video.autoplay = true;
                    vApp.vutil.createLocalTempVideo("vAppScreenShare", this.local + "Temp");
                    vApp.vutil.initLocCanvasCont(this.local + "Temp" + "Video");
                }
                
                
                
//                if(this.video.tagName !=  "VIDEO"){
//                    
//                } 

                this.currentStream = stream;
                var that = this;
                
                console.log("video changed");
                
                vApp.adpt.attachMediaStream(this.video, stream);
                this.prevStream = true;
                
                this.currentStream.onended = function (name){
                    if(that.ssByClick){
                        that.video.src = "";
                        that.localtempCont.clearRect(0, 0, that.localtempCanvas.width, that.localtempCanvas.height);
                        clearInterval(vApp.clear);
                        that.prevImageSlices = [];
                        vApp.wb.utility.beforeSend({'unshareScreen' : true, st : that.type});
                        that.prevStream = false;
                        that.prevScreen = "";
                    }else{
                        that.ssByClick = true;
                    }
                }
                
                var container = {};
                container.width = window.innerWidth;
                container.height = window.innerHeight - 140;
                
                var vidContainer = document.getElementById(this.local);
                var dimension =  this.html.getDimension(container);
                
                
                
                //dimension.width = dimension.width - 100;
                //dimension.width = dimension.width;
                
                vidContainer.style.width = Math.round(dimension.width) + "px";
                vidContainer.style.height = Math.round(dimension.height) + "px";

                //setStyleToElement(vidContainer, width, height);
                var that = this;
                var video;
                this.video.onloadedmetadata = function (){
                   /* if(dimension.width < that.video.offsetWidth){
                        that.width = dimension.width;
                        that.height = dimension.height;
                        
//                        that.video.style.maxWidth = (that.width - 5)  + "px";
                        
                    }else{
                        var  video = document.getElementById(that.local+"Video");
                        that.width = video.clientWidth;
                        that.height = video.clientHeight;
                    }*/
                    
//                    that.localtempCanvas.width = that.width;
//                    that.localtempCanvas.height = that.height;
                    
                    
                    that.width = dimension.width;
                    that.height = dimension.height;
                    
                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                                        
                    
                    //that.localtempCanvas.width = 1000;
                    //that.localtempCanvas.height = 500;   
                    vApp.prevScreen = that;
                    
                    var res = vApp.system.measureResoultion({'width': window.innerWidth, 'height': window.innerHeight});
                    
                    //that.initAfterImg();
                    that.sharing();
                    vApp.vutil.setContainerWidth(res);
                    
                    if(vApp.gObj.uRole == 't'){
						vApp.vutil.makeActiveApp(that.id, vApp.prevApp);
					}
                    
                    vApp.prevApp = that.id;
                    
                }
                
                
            },
            
            sharing : function (){
                var tempObj, encodedData, stringData, d, matched, imgData;
                this.latestScreen = [];
                //this.localtempCanvas = [];
                var resA = Math.round(this.localtempCanvas.height/12);
                var resB = Math.round(this.localtempCanvas.width/12);

                this.imageSlices = this.dc.getImageSlices(resA, resB, this);
                var that = this;
                var uniqcount = 0;
                var uniqmax = (resA * resB)/5;
                var sendObj;
                //var changeonresize=1;
                randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                if(vApp.hasOwnProperty('wholeImage')){
                    clearInterval(vApp.wholeImage);
                }
                //*TODO this should be handle according to screen
                // should create different instance for each screen
                vApp.wholeImage = setInterval(
                     function (){
                         if(typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined'){
                             if(prvVWidth != that.video.offsetWidth || prvVHeight != that.video.offsetHeight){
                                 changeonresize=1;
                             }
                         }
                        prvVWidth = that.video.offsetWidth;
                        prvVHeight = that.video.offsetHeight;

                        //prvCWidth = that.localtempCont.width;
                        //prvCHeight = that.localtempCont.height;
                     },
                     2000
                   //  1000
                );
                
                if(vApp.hasOwnProperty('clear')){
                    clearInterval(vApp.clear);
                }
                
                var screenIntervalTime=1000;
                var pscreenIntervalTime=1000;
                function myFunction2 (){
                    clearInterval(vApp.clear);
                    vresize = false;
                    if (changeonresize == 1) {
                        if(typeof that.localtempCont.width != 'undefined'){ //todo check if required
                            that.localtempCont.clearRect(0, 0, that.localtempCont.width, that.localtempCont.height);
                        }
                        vresize = true;
                        that.prevImageSlices = [];
                        resA = Math.round(that.localtempCanvas.height/12);
                        resB = Math.round(that.localtempCanvas.width/12);
                        that.imageSlices = that.dc.getImageSlices(resA, resB, that);
//                            changeonresize = 0;
                    }

                    that.localtempCanvas.width = that.video.offsetWidth;
                    that.localtempCanvas.height = that.video.offsetHeight;
                    that.localtempCont.drawImage(that.video, 0, 0, that.video.offsetWidth, that.video.offsetHeight);

                    sendobj = [];
                    for (sl=0; sl<(resA * resB); sl++) {
                        d = that.imageSlices[sl];

                        imgData = that.localtempCont.getImageData(d.x,d.y,d.w,d.h);

                        if(typeof that.prevImageSlices[sl] != 'undefined'){
                             matched = that.dc.matchWithPrevious(imgData.data, that.prevImageSlices[sl], d.w);
//                                if(!matched || ( sl >= ((uniqcount*5)-4) && sl <= (uniqcount*5) )){
                            if(!matched){
                                //console.log("second");
                                that.prevImageSlices[sl] = imgData.data;
                                //conslice.putImageData(imgData, d.x, d.y);
                                encodedData = that.dc.encodeRGB(imgData.data);
                                stringData = vApp.vutil.ab2str(encodedData);

                                tempObj = {'si' : stringData, 'd' : d};
                                sendobj.push(tempObj);    
                                that.latestScreen[sl] = tempObj; 
                            }
                        }else{
                            that.prevImageSlices[sl] = imgData.data;
                            encodedData = that.dc.encodeRGB(imgData.data);
                            stringData = vApp.vutil.ab2str(encodedData);
                            tempObj = {'si' : stringData, 'd' : d};
                            sendobj.push(tempObj);    
                            that.latestScreen[sl] = tempObj; 
                        }
                    }

                    uniqcount++;
                    if (uniqmax == uniqcount) {
                        uniqcount=0;
                    }

                    if(sl ==  resA * resB){
                        if(sendobj.length > 0){
                            //var encodedString = LZString.compressToBase64(JSON.stringify(sendobj));
                            var encodedString = JSON.stringify(sendobj);
                            var contDimension = that.getContainerDimension();
                            var madeTime = new Date().getTime();
                            if (changeonresize == 1) {
                                if(typeof prvVWidth != 'undefined' && typeof prvVHeight != 'undefined'){
                                    var imgObj = {'si' : encodedString, 'st' : that.type, d : {w:prvVWidth, h:prvVHeight}, vc : {w:contDimension.width, h:2000}};
                                }else{
                                    var imgObj = {'si' : encodedString, 'st' : that.type, d : {w:that.video.offsetWidth, h:that.video.offsetHeight}, vc : {w:contDimension.width, h:contDimension.height}};
                                }
                                changeonresize=0;
                            } else {
                                var imgObj = {'si' : encodedString, 'st' : that.type};
                            }
                            // Calculate Bandwidth in Kbps
                            var localBandwidth = ((encodedString.length/128) / (screenIntervalTime/1000))
                            // Shape Bandwidth
                            if (localBandwidth <= 300) {
                                screenIntervalTime = 300;
                            }else if (localBandwidth >= 10000) {
                                screenIntervalTime=localBandwidth/2;
                            } 
                            else{
                                screenIntervalTime=localBandwidth;
                            }
                            // Avoid Sharp Curve
                            if ((pscreenIntervalTime * 4) < screenIntervalTime ) {
                                screenIntervalTime = pscreenIntervalTime * 4;
                            }
                            pscreenIntervalTime = screenIntervalTime;
//                            console.log('Bandwidth '+localBandwidth+ ' Interval '+screenIntervalTime);
                            vApp.storage.wholeStore(imgObj);
                            vApp.wb.utility.beforeSend(imgObj);                 
                            sendobj=[];
                        }
                    }
                    
                    vApp.clear = setInterval(myFunction2, screenIntervalTime);
//                   vApp.clear = setInterval(myFunction2, 300);
                   console.log('image is sending');
                }
                
              //  alert('ssss')
                
			  // vApp.clear = setInterval(myFunction2, 300);

                vApp.clear = setInterval(myFunction2, screenIntervalTime);
                
            },
            
            getContainerDimension : function (){
                var vidCont = document.getElementById(this.id + "Local");
                return {width : vidCont.offsetWidth, height:vidCont.offsetHeight};
            },

            drawImages : function (rec, local){
                
//                if(typeof local != 'undefined'){
//                    this.localCanvas = document.getElementById('canvas3');
//                    this.localCont = this.localCanvas.getContext('2d');
//                }
                
                //var imgDataArr = LZString.decompressFromBase64(rec);
                var imgDataArr = rec;
                imgDataArr = JSON.parse(imgDataArr);
                for (i=0;i<imgDataArr.length;i++){
                     this.drawSingleImage(imgDataArr[i].si, imgDataArr[i].d);
                }
            },

            drawSingleImage : function(imgDataArr, d){
                var imgData = this.dc.decodeRGB(vApp.vutil.str2ab(imgDataArr), this.localCont, d);
                this.localCont.putImageData(imgData, d.x, d.y);
            },
            
            dimensionStudentScreen : function (msg, vtype){
                    // alert(this.vac);
                  //  if(typeof this.vac == 'undefined'){
                if(!this.hasOwnProperty('vac')){
                    this.vac = true;
                    this.localCanvas = document.getElementById(vApp[app].local+"Video");
                    this.localCont = vApp[app].localCanvas.getContext('2d');
                }
                
                if (msg.hasOwnProperty('d')) {
                    this.localCont.clearRect(0, 0, this.localCanvas.width, this.localCanvas.height);
                    
                    this.localCanvas.width = msg.d.w;
                    this.localCanvas.height = msg.d.h;
                }
                
                
                if(msg.hasOwnProperty('vc')){
                    var vc  = document.getElementById(vApp[app].local);
                    vc.style.width = msg.vc.w + "px";
                    vc.style.height = msg.vc.h + "px";
                }
                
                if(vApp.previous != 'vAppWhiteboard'){
                    vApp.vutil.setScreenInnerTagsWidth(vApp.previous);
                }
            },
           
            html : {
                
               UI : function (user){
                   var mainCont =  vApp.vutil.createDOM("div", this.id, [this.className]);
                   var locVidCont =  vApp.vutil.createDOM("div", this.local, [this.label]);
                   if((user == 't')){
                       
                       //if(vApp.hasOwnProperty('repType')){
                       if(vApp.recorder.recImgPlay){
                           var vidCont =  vApp.vutil.createDOM("canvas", this.local+"Video");
                           //vidCont.setAttribute("autoplay", true);
                           
                       }else{
                           var vidCont =  vApp.vutil.createDOM("video", this.local+"Video");
                           vidCont.setAttribute("autoplay", true);
                       }
                       
                       css(locVidCont, "position:relative");
                       
                       //css(vidCont, "position : absolute; height : 99%");
                       //css(vidCont, "position : absolute; height : 99%");
                       
                   }else{
                       var vidCont =  vApp.vutil.createDOM("canvas", this.local+"Video");
                   }
                   
                   //var vidCont =  vApp.vutil.createDOM("canvas", this.id+label+"Video");

                   locVidCont.appendChild(vidCont);
                   mainCont.appendChild(locVidCont);

                //   if(user == 't' && !vApp.hasOwnProperty('repType')){
                   if(user == 't' && !vApp.recorder.recImgPlay){ 
                        //alert(mainCont.id);
                        vApp.vutil.createLocalTempVideo(mainCont, this.localTemp);
                       
//                       var locVidContTemp =  vApp.vutil.createDOM("div", this.localTemp);
//                       var vidContTemp =  vApp.vutil.createDOM("canvas", this.localTemp+"Video");
//                       locVidContTemp.appendChild(vidContTemp);
//                       mainCont.appendChild(locVidContTemp);
                   }
                   
                   function css(element, styles){
                        if(typeof styles == 'string'){
                            element.style.cssText += ';' + styles;
                        }
                   }
                   return mainCont;
               },
               
              
               
               getDimension : function (container, aspectRatio){
                   var aspectRatio = aspectRatio || (3 / 4),
                        height = (container.width * aspectRatio),
                        res = {};
                
                    return {
                            height: container.height,
                            width: container.width
                        };
/*
                    if (height > container.height) {
                        return {
                            height: container.height,
                            width: container.height / aspectRatio
                        };
                    } else {
                        return {
                            width: container.width,
                            height: container.width * aspectRatio
                        };
                    }*/
               }
               
            },
            
            sendPackets : function (user){
            //    var encodedString = LZString.compressToBase64(JSON.stringify(this.latestScreen));
                var encodedString =JSON.stringify(this.latestScreen);
                var contDimension = this.getContainerDimension();
                vApp.wb.utility.beforeSend({'resimg' : true, 'si' : encodedString, 'st' : this.type, d : {w:this.width, h:this.height}, vc : {w:contDimension.width, h:contDimension.height}, 'byRequest' : user });                                      
            }
        }
    }
    window.screenShare  = screenShare;
})(window);
