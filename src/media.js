// This file is part of Vidyamantra - http:www.vidyamantra.com/
/**@Copyright 2014  Vidyamantra Edusystems. Pvt.Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
  */
(
    function(window) {
        repMode = false;
        var io = window.io;
        function convertFloat32ToInt16(buffer) {
            l = buffer.length;
            buf = new Int16Array(l);
            while (l--) {
              buf[l] = Math.min(1, buffer[l])*0x7FFF;
            }
            return buf;
        }
        var responseErorr = function() {
            console.log("this error is come when the create and answer is occurring");
        }
      
        var ar = 0;
        var audioWasSent = 0;
        var preAudioSamp = 0;
        var preAvg=0
        var curAvg=0;
        var minthreshold=65535;
        var maxthreshold=0;
        var audiotime=0;

        var  media = function() {
            return {
                isChannelReady: '',
                isInitiator: false,
                isStarted: '',
                localStream: '',
                pc: [],
                cn: 0,
                ba: false,
                bb: false,
                bc: false,
                bNotRender: false,
                remoteStream: '',
                turnReady: '',
                oneExecuted: false,
                videoControlId: 'videoContainer',
                videoContainerId: "videos",
                
                audio : {
                    
                  audioStreamArr : [],
                  tempAudioStreamArr :  [],
                  recordingLength : 0,
                  bufferSize : 0,
                  encMode : "alaw",
                  recordAudio : false,
                  resampler : new Resampler(44100, 8000, 1, 4096),
                  rec : '',
                  otherSound : false,
//                  an : - 1,
                  audioNodes : [],
                  sd : false,
                //  tempAudArr : [],
                   
                   Html5Audio : {audioContext : new AudioContext()},
                   init : function (){
                        //if(vApp.gObj.uRole == 't'){
                        if(localStorage.getItem('orginalTeacherId') != null){    
                            vApp.gObj.audMouseDown = true; 
                            //can be critical
                            //this.clickOnceSpeaker('speakerPressOnce');
                        }  

                        this.graph = {
                            height : 56, 
                            width : 4, 
                            average : 0,
                            
                            display : function (){
                                var cvideo = cthis.video;
                                if(vApp.gObj.uRole == 't'){
                                    var avg = this.height - (this.height*this.average)/100;   
                                    this._display(cvideo.tempVidCont, avg);
                                }
                            },
                            
                            _display : function (context, avg){
                                context.beginPath();
                                context.moveTo(this.width, this.height);
                                context.lineTo(this.width, avg);
                                context.lineWidth = this.width;
                                context.strokeStyle = "rgba(32, 37, 247, 0.8)";
                                context.closePath();
                                context.stroke();
                            },
                            
                            canvasForVideo : function (){
                                var videoParent = cthis.video.myVideo.parentNode;
                                var graphCanvas = document.createElement("canvas");
                                graphCanvas.width = this.width + 3;
                                graphCanvas.height = this.height;

                                graphCanvas.id = "graphCanvas";   
                                videoParent.style.position = "relative"
                                graphCanvas.style.position = "absolute"
                                graphCanvas.style.left = 0;
                                graphCanvas.style.top = -7;
                                videoParent.appendChild(graphCanvas);
                            }
                        };
                        
                        this.attachFunctionsToAudioWidget();
                    },
                    
                    slienceDetection : function (send, leftSix){
                        var vol = 0;
                        var sum=0;
                        var rate=0;

                        for (i=0;i<leftSix.length;i++) {
                            var a = Math.abs(leftSix[i]);
                            if (vol < a) { vol = a; }
                            sum=sum+a;
                        }

                        curAvg=sum/leftSix.length;
                        rate= Math.abs(curAvg^2 - preAvg^2);
                        preAvg=curAvg;

                        if (minthreshold>vol) { minthreshold=vol; }
                        if (maxthreshold<vol) { maxthreshold=vol; }
                        if (minthreshold*10 < maxthreshold)  { minthreshold=minthreshold*2; }
                        if (maxthreshold/10 > minthreshold) { maxthreshold=vol; }
                        if (rate < 5) { minthreshold=vol; } // If rate is close to zero, it is likely to be noise.
                        var thdiff = maxthreshold/minthreshold;

                        switch(true) {
                            case (thdiff>8):
                                var th = 2.5;
                                break;
                            case (thdiff>5):
                                var th = 2.0;
                                break;
                            case (thdiff>3):
                                var th = 1.2;
                                break;
                            default:
                                th=1;
                        }

                        if (thdiff >= 2 && vol>=minthreshold*th) {
                     //       console.log('Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff+' th '+th);
                            if (audioWasSent==0 && preAudioSamp != 0) { // Send previous sound sample to avoid clicking noise
                                vApp.wb.utility.audioSend(preAudioSamp);
                            }
                            vApp.wb.utility.audioSend(send);
                            audioWasSent=1;
                        }else if ( audioWasSent == 1){
                            vApp.wb.utility.audioSend(send);  // Send next sound sample to avoid clicking noise
                            audioWasSent=0;
                        }else if (thdiff < 2) {
                       //     console.log('Current '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff);
                            vApp.wb.utility.audioSend(send);
                        }else {
                        //    console.log('NOT SENT Vol '+vol+' Min '+minthreshold+' Max '+maxthreshold+' rate '+rate+' thdiff '+thdiff);
                            preAudioSamp = send;;
                        }
                        
                        return send;
                    },
                            
                    makeIconNotDraggable : function (id, imgName){
                        var canvas = document.getElementById(id, imgName);
                        var context = canvas.getContext('2d');
                        var imageObj = new Image();

                        imageObj.onload = function() {
                            context.drawImage(imageObj, 0, 0);
                        };
                        imageObj.src = window.whiteboardPath + "images/" + imgName;
                    },
                    
                    
                    attachFunctionsToAudioWidget : function (){
                        var audioWiget = document.getElementById('audioWidget');  
                        var allAudTools = audioWiget.getElementsByClassName('audioTool');
                        var that = this;
                        for(var i=0; i<allAudTools.length; i++){
                            //allAudTools[i].addEventListener('click', function (){ that.audioToolInit.call(that,  allAudTools[i])});
                            
                            if(allAudTools[i].id == 'speakerPressOnce'){
                                //allAudTools[i].setAttribute('data-audio-playing', "false");
                            }else if (allAudTools[i].id == 'speakerPressing'){
                                this.attachSpeakToStudent(allAudTools[i].id);
                            }
                            
                            if (allAudTools[i].id != 'speakerPressing'){
                                allAudTools[i].addEventListener('click', that.audioToolInit);
                            }
                        }
                    },
                    
                    
                    audioToolInit : function (){
                        var that = vApp.gObj.video.audio;
                        if(this.id == 'speakerPressOnce'){
                            that.clickOnceSpeaker(this.id);
                        }else if(this.id == 'audioTest'){
                            if(confirm (vApp.lang.getString('audioTest'))){
                              that.testInit(this.id);
                            }
                        }else if(this.id == 'silenceDetect'){
                            var a = this.getElementsByTagName('a')[0];
                            var img = this.getElementsByTagName('img')[0];
                            
                            if(that.sd){
                               that.sd = false; 
                               this.className = this.className + " sdDisable";
                               img.src = window.whiteboardPath+"images/silencedetectdisable.png";
                               
                            }else{
                               that.sd = true;
                               this.className = this.className + " sdEnable";
                               var img = this.getElementsByTagName('img')[0];
                               img.src = window.whiteboardPath+"images/silencedetectenable.png";
                            }
                        }
                    },
                    
                    attachSpeakToStudent : function (id){
                        var that = this;
                        var speakerStudent  = document.getElementById(id);
                        speakerStudent.addEventListener('mousedown', function (){ that.studentSpeak(speakerStudent)});
                        speakerStudent.addEventListener('mouseup', function (){  that.studentNotSpeak(speakerStudent)});
                    },
                    
                    attachAudioPressOnce : function (){
                        var speakerPressOnce  = document.getElementById('speakerPressOnce');
                        speakerPressOnce.setAttribute('data-audio-playing', "false");
                        var that = this;
                        speakerPressOnce.addEventListener('click', function (){ that.clickOnceSpeaker.call(that, speakerPressOnce.id)});
                    },
                    
                    clickOnceSpeaker : function (id, alwaysDisable){
//                        alert('suman bogati');
//                        debugger;
                        var tag = document.getElementById(id);
                        if(tag.getAttribute('data-audio-playing') == 'false' && typeof alwaysDisable == 'undefined'){
                            this.studentSpeak();
                            tag.setAttribute('data-audio-playing', "true");
                            tag.className =   "audioTool active";
                        }else {
                            this.studentNotSpeak();
                            tag.setAttribute('data-audio-playing', "false");
                            tag.className = "audioTool deactive";
                        }
                    },
                    
                    studentSpeak : function (elem){
                        if(typeof elem != 'undefined'){
                            elem.classList.remove('deactive');
                            elem.classList.add('active');
                        }
                        vApp.gObj.audMouseDown = true;
                        vApp.wb.utility.beforeSend({'sad': true});
                    },
                    
                    studentNotSpeak : function (elem){
                        if(vApp.gObj.hasOwnProperty('audMouseDown') &&  vApp.gObj.audMouseDown){
                            if(typeof elem != 'undefined'){
                                elem.classList.remove('active');
                                elem.classList.add('deactive');
                            }
                            
                            var tag = document.getElementById("speakerPressOnce");
                            tag.setAttribute('data-audio-playing', "false");
                            tag.className = "audioTool deactive";

                            vApp.gObj.audMouseDown = false;
                            vApp.wb.utility.beforeSend({'sad': false});
                        }
                    },
                    
                    ab2str : function (buf) {
                        return String.fromCharCode.apply(null, new Int8Array(buf));
                    },
                    
                    str2ab : function (str) {
                        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                        var bufView = new Int8Array(buf);
                        for (var i=0, strLen=str.length; i<strLen; i++) {
                          bufView[i] = str.charCodeAt(i);
                        }
                        return bufView;
                    },
                    
                    recorderProcess : function (e) {
                        var currTime = new Date().getTime();
                        //console.log("out of recording");
                        if(!repMode){
                          //  console.log("Audio recording");
                            this.calcAverage();
                            var left = e.inputBuffer.getChannelData(0);
                            var samples = this.resampler.resampler(left);

                            if(!this.recordAudio){
                                //this.audioNodes.push(new Float32Array(samples));
                                this.recordingLength += this.bufferSize;
                            }

                            var leftSix = convertFloat32ToInt16(samples);

                            var send = this.audioInLocalStorage(leftSix);

                            if(this.hasOwnProperty('storeAudio') && this.storeAudio){
                                this.audioForTesting(leftSix);
                            }

                            if(this.sd){
                                this.slienceDetection(send, leftSix);
                            }else{
                                vApp.wb.utility.audioSend(send);
                            }
                        }
                    },
                    
                    audioInLocalStorage : function (leftSix){
                        var encoded = G711.encode(leftSix, {
                            alaw: this.encMode == "alaw" ? true : false
                        });  
                        return encoded;
                    },
                    
                    testInit : function (id){
                        var audioTestElem = document.getElementById(id);
                            audioTestElem.classList.add("audioIsTesting");
                        
                        this.studentNotSpeak();
                        
                        vApp.gObj.audioForTest = [];
                        this.storeAudio = true;
                        var that = this;  
                        
                        
                        that.otherSound = true;
                        if(that.hasOwnProperty('testAudio')){
                            clearTimeout(that.testAudio);
                        }
                        var totTestTime = 5000;
                          
                        that.testAudio = setTimeout(function (){
                            console.log("set time out is invoking");
                            that.playRecordedAudio();
                        }, totTestTime);
                        
                        setTimeout (
                            function (){
                                audioTestElem.classList.remove("audioIsTesting");
                                that.otherSound = false;
                            }, ((totTestTime * 2)  + 1000  )
                        )
                        
                    },
                    
                    audioForTesting : function (leftSix){
                        var encoded = G711.encode(leftSix, {
                            alaw: this.encMode == "alaw" ? true : false
                        });  
                        
                        vApp.gObj.audioForTest.push(encoded);
                    },
                    
                    playRecordedAudio : function (){
                        this.myaudioNodes = [];
                        this.recordingLength = 0;
                        for(var i=0; i<vApp.gObj.audioForTest.length; i++){
                            clip = vApp.gObj.audioForTest[i];
                            samples = G711.decode(clip, {
                                alaw: this.encMode == "alaw" ? true : false,
                                floating_point : true,
                                Eight : true
                             });
                             
                             this.myaudioNodes.push(new Float32Array(samples));
                             this.recordingLength += 16384;
                        }
                        
                        var samples = this.mergeBuffers(this.myaudioNodes);
                        vApp.gObj.video.audio.playTestAudio(samples, 0 , 0);
                       
                    },
                    
                    playTestAudio : function (receivedAudio, inHowLong, offset){
                        var samples = receivedAudio;   
                        var when = this.Html5Audio.audioContext.currentTime + inHowLong;

                        var newBuffer = this.Html5Audio.audioContext.createBuffer(1, samples.length, 8000);
                        newBuffer.getChannelData(0).set(samples);

                        var newSource = this.Html5Audio.audioContext.createBufferSource();
                        newSource.buffer = newBuffer;
                        newSource.connect(this.Html5Audio.audioContext.destination);
                        newSource.start(when, offset);
                    },
                    
                    calcAverage : function (){
                        var array =  new Uint8Array(analyser.frequencyBinCount);
                        analyser.getByteFrequencyData(array);
                        var values = 0;

                        var length = array.length;
                        for (var i = 0; i < length; i++) {
                            values += array[i];
                        }
                        this.graph.average = values / length;
                    },
                    
                    //this is not using right now
                    audioInGraph : function (){
                        var cvideo = cthis.video;
                        if(vApp.gObj.uRole == 't'){
                            var avg = this.graph.height - (this.graph.height*this.graph.average)/100;   
                            cvideo.tempVidCont.beginPath();
                            cvideo.tempVidCont.moveTo(cvideo.tempVid.width-this.graph.width, this.graph.height);
                            
                            cvideo.tempVidCont.lineTo(cvideo.tempVid.width-this.graph.width, avg);
                            cvideo.tempVidCont.lineWidth = this.graph.width;
                            cvideo.tempVidCont.strokeStyle = "rgba(247, 25, 77, 1)";
                            cvideo.tempVidCont.closePath();
                            cvideo.tempVidCont.stroke();
                        }
                    },
                    
                    play : function (receivedAudio, inHowLong, offset){
                        var clip = receivedAudio;
                        var samples = G711.decode(clip, {
                            alaw: this.encMode == "alaw" ? true : false,
                            floating_point : true,
                            Eight : true
                        });

                        var when = this.Html5Audio.audioContext.currentTime + inHowLong;

                        var newBuffer = this.Html5Audio.audioContext.createBuffer(1, samples.length, 8000);
                        newBuffer.getChannelData(0).set(samples);

                        var newSource = this.Html5Audio.audioContext.createBufferSource();
                        newSource.buffer = newBuffer;

                        newSource.connect(this.Html5Audio.audioContext.destination);
                        newSource.start(when, offset);
                    }, 
                    
                    replayInit : function (){
                        vApp.storage.getAllObjs(["audioData"], repCallback); 
                        function repCallback(){
                            vApp.gObj.video.audio.replay(0, 0)
                        }
                    }, 
                    replay : function (inHowLong, offset){
                        repMode = true;
                        
                        var samples,whenTime,newBuffer,newSource, totArr8;
                            if(this.audioNodes.length > 0){
                                samples =  this.mergeBuffers(this.audioNodes);
                                
                                whenTime = this.Html5Audio.audioContext.currentTime + inHowLong;
                                newBuffer = this.Html5Audio.audioContext.createBuffer(1, samples.length, 7800)
                                newBuffer.getChannelData(0).set(samples);

                                newSource = this.Html5Audio.audioContext.createBufferSource();
                                newSource.buffer = newBuffer;

                                newSource.connect(this.Html5Audio.audioContext.destination);
                                newSource.start(whenTime, offset); 
                            }
                    },
                    
                    mergeBuffers : function(channelBuffer){
                        var result = new Float32Array(this.recordingLength);
                        var offset = 0;
                        var lng = channelBuffer.length;
                        for (var i = 0; i < lng; i++){
                          var buffer = channelBuffer[i];
                          console.log("bf Length " + buffer.length);
                          result.set(buffer, offset);
                          offset += buffer.length;
                        }
                        return result;
                    },
                    
                    assignFromLocal : function (arrStream, audioRep) {
                        this.init();
                        for(var i=0; i<arrStream.length; i++){
                             var rec1 = LZString.decompressFromBase64(arrStream[i]);
                             var clip = this.str2ab(rec1);

                             samples = G711.decode(clip, {
                                alaw: this.encMode == "alaw" ? true : false,
                                floating_point : true,
                                Eight : true
                             });
                             
                             this.audioNodes.push(new Float32Array(samples));
                             this.recordingLength += 16384;
                        }
                        
                        if(typeof audioRep != 'undefined'){
                            audioRep();
                        }
                    }, 
                    
                    manuPulateStream : function (){
                        var stream = cthis.stream;
                        if(!vApp.vutil.chkValueInLocalStorage('recordStart')){
                            vApp.wb.recordStarted = new Date().getTime();
                            localStorage.setItem('recordStart', vApp.wb.recordStarted);
                        }else{
                            vApp.wb.recordStarted = localStorage.getItem('recordStart');
                        }

                        var audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
                        var context = new audioContext();
                         analyser = context.createAnalyser();

                        var audioInput = context.createMediaStreamSource(stream);
                        cthis.audio.bufferSize = 16384;
                            
                        cthis.audio.rec = context.createScriptProcessor(cthis.audio.bufferSize, 1, 1);
              
                     //   cthis.audio.initAudioNode();
                        // NOTE, WARNING
                        // THIS SHOULD BE DISPLAY
                        // below code should be enable
                        cthis.audio.rec.onaudioprocess = cthis.audio.recorderProcess.bind(cthis.audio);
                        
                        audioInput.connect(analyser);
                        analyser.connect(cthis.audio.rec);
                        cthis.audio.rec.connect(context.destination);
                    },
                    
//                    initAudioNode : function (){
//                        var ctTime = new Date().getTime();
////                        cthis.audio.an++;
////                        localStorage.setItem('an', cthis.audio.an);
//                        
////                        cthis.audio.audioNodes[cthis.audio.an] = {mt : ctTime, adArr : []};
////                        cthis.audio.tempAudArr[cthis.audio.an] = {mt : ctTime, adArr : []};
//                        
////                        cthis.audio.audioNodes = [];
////                        cthis.audio.tempAudArr = [];
//                        
//                    },
                    
                    updateInfo : function (){
                        this.audioStreamArr = [];
                        vApp.wb.pageEnteredTime = vApp.wb.recordStarted =  new Date().getTime();
                        this.recordAudio = false;
                        repMode = false;
                    }
                },
                
                video : {
                    width : 75,
                    height : 56,
                    tempVid : "",
                    tempVidCont : "",
                    myVideo : "",
                    remoteVid : "",
                    remoteVidCont : "", 
                    maxHeight : 250,
                    
                    init : function (){  
                        this.videoCont = document.getElementById("allVideosCont");
                        if(this.videoCont !=  null){
                            this.videoCont.style.maxHeight = this.maxHeight + "px";
                        }
                    },
                    
                    calcDimension : function (){
                        this.myVideo.width= this.width;
                        this.myVideo.height= this.height;
                    },
                    
                    removeUser : function (id){
                        var element = document.getElementById('user' + id);
                        if(element !=  null){
                            element.parentNode.removeChild(element);
                        }
                    },
                    
                    //createVideo
                    createElement : function (user){
                        var videoWrapper = document.createElement('div');
                        videoWrapper.className = "videoWrapper";

                        var videoSubWrapper = document.createElement('div');
                        videoSubWrapper.className = "videoSubWrapper";
                        videoSubWrapper.id = "user" + user.id;
                        videoWrapper.appendChild(videoSubWrapper);
                                        
                        vidId = user.id;
                        var video = document.createElement('canvas');
                        video.id = "video"+ vidId;
                        video.className = "userVideos";
                        video.width = this.width;
                        video.height = this.height;
                        
                        var videoCont = this.videoCont;
                        videoSubWrapper.appendChild(video);
                        
                        videoCont =  videoWrapper;
                        cthis.video.imageReplaceWithVideo(user.id, videoCont);
                    },
                    
                    updateHightInSideBar : function (videoHeight){
                        //TODO this is not to do every time a function is called
                        var sidebar = document.getElementById('widgetRightSide');
                        var sidebarHeight = sidebar.offsetHeight;
                        var chatBox = document.getElementById("chatContainer");
                        var chatBoxHeight = sidebarHeight - videoHeight;
                        chatBox.style.height = chatBoxHeight + "px";
                    },
                    
                    send : function (){
                        if(vApp.gObj.video.hasOwnProperty('smallVid')){
                            clearInterval(vApp.gObj.video.smallVid);
                        }
                        var cvideo = this;
                        var frame;
                        randomTime = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
                        var totalMembers = -1;
                        
                        function sendSmallVideo (){
                                
                                
                               //clearInterval(vApp.gObj.video.smallVid)
                                //clearInterval(vApp.gObj.video.smallVid);
                                 
                                    //canvasContext.clearRect(0, 0, canvas.width, canvas.height);	
                                // intervalTime = (5000 * vApp.gObj.totalUser.length) + randomTime;
                                
                                
                                if(vApp.gObj.uRole == 't'){
                                    if(typeof graphCanvas == "undefined"){
                                        var graphCanvas = document.getElementById("graphCanvas");
                                        if(graphCanvas != null){
                                            cthis.audio.graph.cvCont = graphCanvas.getContext('2d');
                                        }
                                    }
                                    if(graphCanvas != null){
                                        cthis.audio.graph.cvCont.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
                                    }
                                }

                                cvideo.tempVidCont.clearRect(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);
                                
                                if(window.navigator.userAgent.match('Firefox')){
                                    drawVideoForFireFox();
                                }else{
                                    cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);
                                }
                                
                                 //Firefox issue, the video is not available for image at early stage
                                function drawVideoForFireFox() {
                                    try {
                                        cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);
                                    } catch (e) {
                                      if (e.name == "NS_ERROR_NOT_AVAILABLE") {
                                        // Wait a bit before trying again; you may wish to change the
                                        // length of this delay.
                                            setTimeout(drawVideoForFireFox, 100);
                                       } else {
                                            throw e;
                                       }
                                    }
                                }
                                  
                                  

                               // cvideo.tempVidCont.drawImage(cvideo.myVideo, 0, 0, cvideo.width, cvideo.height);


                              //cthis.audio.audioInGraph();
                              if(vApp.gObj.uRole == 't'){
                                  cthis.audio.graph.display();
                              }


                             //frame = cvideo.tempVid.toDataURL("image/jpg", 0.2);
                             
                             var user = {
                                 name : vApp.gObj.uName,
                                 id : vApp.gObj.uid
                             }

                             if(vApp.gObj.uRole == 't'){
                                 user.role = vApp.gObj.uRole;
                             }
                            
                            vApp.wb.utility.beforeSend({videoByImage : user});
                            var frame = cvideo.tempVidCont.getImageData(0, 0, cvideo.tempVid.width, cvideo.tempVid.height);

                            var encodedframe = vApp.dirtyCorner.encodeRGB(frame.data)
                    
                            var uid = breakintobytes(vApp.gObj.uid,8);
                            var scode = new Uint8ClampedArray( [11, uid[0], uid[1], uid[2], uid[3] ] );

                            var sendmsg = new Uint8ClampedArray(encodedframe.length + scode.length);
                            sendmsg.set(scode);
                            sendmsg.set(encodedframe, scode.length); 
                            io.sendBinary(sendmsg);
                            
                            clearInterval(vApp.gObj.video.smallVid);
                            
                            var d = 2000+ (vApp.gObj.totalUser.length * 2500);
                            if (totalMembers != vApp.gObj.totalUser) {
                                totalMembers = vApp.gObj.totalUser.length;
                                var p = vApp.gObj.totalUser.indexOf(vApp.gObj.uId);
                                var td = d/totalMembers;
                                var md =  p*td;
                                vApp.gObj.video.smallVid =  setInterval(sendSmallVideo, (d + md));
                                //console.log("send time " + (d + md) + new Date().getSeconds());
                            } else {
                                vApp.gObj.video.smallVid =  setInterval(sendSmallVideo, d);
                                //console.log("send time " + d + new Date().getSeconds());
                            }
                        }

                        vApp.gObj.video.smallVid =  setInterval(sendSmallVideo, 300);

                        function breakintobytes (val,l) {
                            var numstring = val.toString();
                            for (var i=numstring.length; i < l; i++) {
                                numstring = '0'+numstring;
                            }
                            var parts = numstring.match(/[\S]{1,2}/g) || [];
                            return parts;
                        }
                     },

                     startToStream : function (){
                        cthis.video.calcDimension();
                        cthis.video.send();
                     },

                     playWithoutSlice : function(uid,msg){
                        this.remoteVid = document.getElementById("video" + uid);
                        this.remoteVidCont =  this.remoteVid.getContext('2d');

                        var imgData = vApp.dirtyCorner.decodeRGB(msg, this.remoteVidCont,  this.remoteVid);
                        this.remoteVidCont.putImageData(imgData, 0, 0);
                      },
                    
                    justForDemo : function (){
                        var maxHeight = 250;
                        var num  = 0;
                        var videoCont = document.getElementById("allVideosCont");
                        videoCont.style.maxHeight = maxHeight + "px";
                        
                        setInterval(
                            function (){
                                if(++num <= 20){
                                    
                                    videoCont = document.getElementById("allVideosCont");
                                    
                                    var videoWrapper = document.createElement('div');
                                        videoWrapper.className = "videoWrapper";
//                                        videoWrapper.setAttribute("data-uname", "suman" + num);
                                        
                                    var videoSubWrapper = document.createElement('div');
                                        videoSubWrapper.className = "videoSubWrapper";
                                        videoSubWrapper.setAttribute("data-uname", "suman" + num);
                                        videoWrapper.appendChild(videoSubWrapper);
                                        
                                    var prvContHeight = videoCont.offsetHeight;
                                    var video = document.createElement('video');
                                    video.className = "userVideo";
                                    video.src ="http://html5demos.com/assets/dizzy.mp4";
                                    
                                    videoSubWrapper.appendChild(video);
                                    videoCont.appendChild(videoWrapper);
                                    var newContHeight = videoCont.offsetHeight;
                                    //rightsidebar
//                                    if(newContHeight != prvContHeight){
//                                        cthis.video.updateHightInSideBar(newContHeight);
//                                    }
                                    
                                    if(videoCont.offsetHeight >= maxHeight){
                                        if(videoCont.style.overflowY != 'undefined' && videoCont.style.overflowY != "scroll"){
                                            videoCont.style.overflowY = "scroll";
                                            document.getElementById(vApp.gObj.chat.mainChatBoxId).style.borderTop = "3px solid #bbb";
                                        }
                                    }
                                }
                            },
                            200
                        );
                    },
                    
                    
                    
                    createVideoElement : function (){
                        var vTag = "video";
                        
                        var parElement = document.createElement('div');
                        parElement.className = 'videoWrapper';
                        
                        var childElement  = document.createElement('div');
                        childElement.className = 'videoSubWrapper';
                        parElement.appendChild(childElement);
                        
                        var videoTag = document.createElement(vTag);
                        videoTag.id = "video" + vApp.gObj.uid;
                        videoTag.autoplay = true;
                        childElement.appendChild(videoTag);
                        
                        return parElement;
                                
                    },
                  
                    
                    imageReplaceWithVideo : function (id, vidCont){
                        var chatUser = document.getElementById("ml" + id);
                        var childTag = chatUser.getElementsByTagName('a')[0];
                        var imgTag = childTag.getElementsByTagName('img')[0];
                        childTag.replaceChild(vidCont, imgTag);
                    },
                    
                    insertTempVideo : function (beforeInsert){
                        var tempVideo = document.createElement('canvas');
                        tempVideo.id = 'tempVideo';
                        beforeInsert.parentNode.insertBefore(tempVideo, beforeInsert);
                    }, 
                    
                    tempVideoInit : function (){
                        cthis.video.tempVid = document.getElementById('tempVideo');
                        cthis.video.tempVid.width = cthis.video.width;
                        cthis.video.tempVid.height = cthis.video.height;
                        cthis.video.tempVidCont = cthis.video.tempVid.getContext('2d');  
                    }
                },
                
                init: function(vbool) {
                    cthis = this; //TODO there should be done work for cthis
                    vcan.oneExecuted = true;
                    var audio =  true;
                    var session = {
                        audio : audio,
                        video: true
                    };
                    
                    cthis.video.init();
                    vApp.adpt = new vApp.adapter();
                    
                    var cNavigator =  vApp.adpt.init(navigator);
                    cNavigator.getUserMedia(session, this.handleUserMedia, this.handleUserMediaError);
                    
                    if (vApp.system.wbRtc.peerCon) {
                        if (typeof localStorage.wbrtcMsg == 'undefined') {
                            vApp.wb.view.multiMediaMsg('WebRtc');
                            localStorage.wbrtcMsg = true;
                        }
                    }
                },
                
                handleUserMedia : function(stream){
                    var audioWiget = document.getElementById('audioWidget');
                    if(audioWiget.hasOwnProperty('classList') && audioWiget.classList.contains('deactive')){
                        vApp.user.control.audioWidgetEnable();
                    }
                    
                    cthis.video.tempStream = stream;
                    cthis.audio.init();
                    var userDiv = document.getElementById("ml" + vApp.gObj.uid);
                    if(userDiv != null){
                        var vidTag = userDiv.getElementsByTagName('video');
                        if(vidTag != null){
                            cthis._handleUserMedia(vApp.gObj.uid);
                        }
                    }
                },
                
                addUserRole : function (id, role){
                    var userDiv = document.getElementById("ml" + id);
                    userDiv.setAttribute("data-role", role);
                    var userType = (role == 's') ? 'student' : 'teacher';
                    userDiv.classList.add(userType);
                },
                
                _handleUserMedia: function(userid) {
                    
                    
                    var userMainDiv = document.getElementById(userid);
                    var  stream = cthis.video.tempStream ;

                    var userDiv = document.getElementById("ml" + vApp.gObj.uid);
                    if(userDiv !=  null){
                       userDiv.classList.add("mySelf");
                    }

                    if(typeof stream != 'undefined'){
                        var vidContainer = cthis.video.createVideoElement();

                        cthis.video.imageReplaceWithVideo(vApp.gObj.uid, vidContainer);
                        cthis.video.insertTempVideo(vidContainer);
                        cthis.video.tempVideoInit();

                        cthis.video.myVideo = document.getElementById("video"+ vApp.gObj.uid);
                        vApp.adpt.attachMediaStream(cthis.video.myVideo, stream);
                        cthis.video.myVideo.muted = true;
                        //todo this should be removed    
                        stream.ontimeupdate = function () {
                            console.log("raja" + stream.currentTime);
                        };

                        if(vApp.jId == vApp.gObj.uid){
                            cthis.stream = stream;
                            cthis.audio.manuPulateStream();
                            cthis.audio.graph.canvasForVideo();
                        }
                        cthis.video.myVideo.onloadedmetadata = function (){
                            cthis.video.startToStream();
                        }
                    }

                    userMedia = true;
                    
                },
                
                updateVidContHeight : function (){
                    var elem = document.getElementById("vAppCont");
                    var offset = vcan.utility.getElementOffset(elem);
                    var mh = window.innerHeight - (offset.y + 75);
                    document.getElementById("chat_div").style.maxHeight = mh + "px";
                },
                
//                //Todo this funciton should be removed  
//                createDemoUserList : function (){
//                    var dumUserArr = [];
//                    var dummyUser;
//                    for(var i=5; i<15; i++){
//                         dummyUser = {
//                            img : "./images/quality-support.png",
//                            name : "Student " + i,
//                            userid : 100 + i
//                        }
//                        memberUpdate({message : [dummyUser]});
//                    }
//                    return dumUserArr;
//                },
//                
                close : function (){
                    if(vApp.gObj.video.hasOwnProperty('smallVid')){
                        clearInterval(vApp.gObj.video.smallVid);
                    }
                },
                
                dispAllVideo : function (id){
                    setTimeout(
                        function (){
                            var chatCont = document.getElementById(id);
                            if(chatCont != null){
                                var allVideos = chatCont.getElementsByTagName("video");
                                for(var i=0; i<allVideos.length; i++){
                                    allVideos[i].play();
                                }
                            }
                        },
                        1040
                    );
                },
			    
                sendMessage: function(message) {
                    if (arguments.length > 1) {
                        vApp.wb.utility.beforeSend({'video': message}, arguments[1]);
                    } else {
                        vApp.wb.utility.beforeSend({'video': message});
                    }
                },
                
                existVideoContainer : function(user){
                    var allVideos = document.getElementsByClassName('userVideos');
                    for(var i=0; i<allVideos.length; i++ ){
                        if(allVideos[i].id == "video" + user.id){
                            return true;
                        }
                    }
                    return false;
                },
                
                handleUserMediaError: function(error) {
                    vApp.user.control.audioWidgetDisable();
                    
                    if(error.hasOwnProperty('name')){
                        alert("media error:- " + vApp.lang.getString(error.name));
                    }else{
                        alert("media error:- " + vApp.lang.getString(error));
                    }
                    
                    
                    vApp.wb.view.disappearBox('WebRtc');
                    console.log('navigator.getUserMedia error: ', error);
                }
            }
            
        };
    window.media = media;
})(window);
