/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function(window) {
    "use strict";
    io = window.io;
    /*
     * It handles  message event fired on changing state of the slides
     * Message event  can be fired by  using postMessage or by changing 
     * state of the slides.
     *and teacher  broadcasts the state to the students
     *@param  message event received
     */
    window.addEventListener('message', function(event) {
        if (virtualclass.currApp == "SharePresentation") {
            var frame = document.getElementById("pptiframe");
            var pptData = event.data;
            var pptData = (typeof pptData == 'string') ? JSON.parse(event.data) : event.data;


            if(pptData.hasOwnProperty('namespace') && pptData.namespace == 'reveal'){
                   virtualclass.sharePt.state = pptData.state;
            }
            // only proceed ahead if the namespace is revealjs paramter, if found another case instead of revealjs
            // we need to add over here 

            if (pptData.eventName == 'ready') {

                //TODO validate startFromFlag and localStoragFlag nirmala
                if(virtualclass.sharePt.localStoragFlag && !virtualclass.sharePt.startFromFlag) {
                    var state=virtualclass.sharePt.stateLocalStorage;
                    frame.contentWindow.postMessage(JSON.stringify({method: 'slide', args: [state.indexh,state.indexv,state.indexf]}), '*');
                    virtualclass.sharePt.localStoragFlag=0;
                }else if(virtualclass.sharePt.startFromFlag){
                    //debugger;
                    frame.contentWindow.postMessage(JSON.stringify({method: 'slide', args:virtualclass.sharePt.startFrom }), '*'); 
                }
                
                /** 
                 * To know the auto slide is enable or not 
                 * There is no good way to find this, will explore it about later
                 * TODO remove time and test properly Nirmala
                 * **/
                setTimeout(function() {
                    if (frame != null) {
                        if(frame.contentWindow != null) {
                            frame.contentWindow.postMessage(JSON.stringify({method: "toggleAutoSlide"}), '*');
                        }
                    }
                }, 1500);
                
            }
            
            if (roles.hasView()) {
                if (pptData.eventName == 'ready') {
                    //virtualclass.sharePt.studentPptReadyFlag = 1;
                    /** Need bit delay **/
                    setTimeout(function() {
                       virtualclass.sharePt.removeControls();
                    }, 100);
                    
                    if(virtualclass.sharePt.studentPpt){
                        virtualclass.sharePt.setSlideState(virtualclass.sharePt.studentPpt);
                        virtualclass.sharePt.studentPpt = 0;
                        //virtualclass.sharePt.studentPptReadyFlag = 0;
                    }
                }
                /** TODO need proper test NIRMALA **/
//                if (virtualclass.sharePt.studentPptReadyFlag && virtualclass.sharePt.studentPpt) {
//                    virtualclass.sharePt.setSlideState(virtualclass.sharePt.studentPpt);
//                    virtualclass.sharePt.studentPpt = 0;
//                    virtualclass.sharePt.studentPptReadyFlag = 0;
//                }
            } else if (roles.hasControls()) {
                console.log(pptData.eventName);
                if (typeof pptData.eventName != 'undefined') {
                    virtualclass.sharePt[pptData.eventName].call(virtualclass.sharePt, pptData);
                    virtualclass.sharePt.state = pptData.state;
                }
            }
        } else if(frame != null){
            frame.removeAttribute("src");
        }
        
    });


    var sharePt = function() {
        return {
            pptUrl: "",
            state: {},
            urlValue: "",
            localStoragFlag: false,
            eventsObj: [],
            autoSlideTime: 0,
            viewFlag: 0,
            controlFlag: 0,
            autoSlideFlag: 0,
            autoSlideResumed: 0,
            //studentPptReadyFlag: 0,
            studentPpt: 0,
            startFromFlag:0,
            startFrom:0,
            /*
             * Initalizes and creates ppt layout at student's and teacheh's ends 
             * @param app sharePresentation
             * @param cusEvent byclick event 
             */
            init: function(app, cusEvent) {
                //debugger;
                //this.studentPptReadyFlag = 0;
                this.autoSlideFlag = 0;
                this.autoSlideTime = 0;
                this.autoSlideResumed = 0;
                if (typeof virtualclass.previous != 'undefined') {
                    if (typeof cusEvent != 'undefined' && cusEvent == "byclick") {
                        if (roles.hasControls()) {
                            virtualclass.vutil.beforeSend({'ppt': true,init:'makeAppReady', cf: 'ppt'});
                        }
                    }
                }

                var elem = document.getElementById('virtualclassSharePresentation')
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                }

                this.UI.container();
                var messageContainer = document.getElementById('pptMessageLayout');

                if (roles.hasControls()) {
                    var that = this;
                    this.UI.createUrlContainer();
                    var urlCont = document.getElementById('urlcontainer');
                    if (messageContainer != null) {
                        messageContainer.style.display = "none";
                    }
                    urlCont.style.display = "block";
                    
                    virtualclass.sharePt.attachEvent("submitpurl", "click", virtualclass.sharePt.initNewPpt);
                    
                    

                }else if (roles.hasView()) {
                    var urlCont = document.getElementById('urlcontainer');
                    this.UI.messageDisplay();
                    if (messageContainer != null) {
                        messageContainer.style.display = "block";
                    }
                    if (urlCont != null) {
                        urlCont.style.display = "none";
                    }
                }

                this.findInStorage();
            },
            /* 
             *if there is refresh/reload find url and state from the localStorage and sets the control
             */
            findInStorage: function() {
                //debugger;
                var pApp = localStorage.getItem("prevApp");
                console.log("test pApp" + typeof pApp);
                console.log(pApp);
                if (pApp != null) {
                    var pApp = JSON.parse(pApp);
                    if (pApp.name == "SharePresentation") {
                        //var url = localStorage.getItem('pptUrl');
                        var mdata = pApp["metaData"];
                        if (mdata != null) {
                            // Todo check by nirmal
                            var url = mdata['init'];
                            if (url) {
                                //  debugger;
                                this.localStoragFlag = true;
                                this.pptUrl = JSON.parse(localStorage.getItem('pptUrl'));
                                
                                  // TODO nirmala do more testing
//                                if (roles.hasControls()) {
//                                    ioAdapter.mustSend({pptMsg: this.pptUrl, cf: 'ppt', uid: wbUser.id, flag: "url", onrefresh: true});
//                                }
                               
                                if (mdata['startFrom'] != null) {
                                    virtualclass.sharePt.stateLocalStorage = mdata['startFrom'];
                                }
                               
                            }
                        }
                        // TODO this should be checked propery and should located inside nested function
                        if (this.localStoragFlag) {
                            this.fromLocalStorage(virtualclass.sharePt.state);
                        }
                    }
                }

                virtualclass.previrtualclass = 'virtualclass' + virtualclass.currApp;
            },
            /*
             * set state ,state retrieved from localStorage   
             * @param  state ,saved state in local storage
             */

            fromLocalStorage: function(state) {
                var elemIframe = document.getElementById('pptiframe');
                if (elemIframe == null) {
                    this.UI.createIframe();
                }
                var iframeContainer = document.getElementById("iframecontainer");
                iframeContainer.style.display = "block";
                var iframe = document.getElementById("pptiframe");
                var pptUrl = (this.pptUrl.search("postMessage") < 0) ? this.pptUrl + "?postMessage=true&postMessageEvents=true" : this.pptUrl;
                iframe.setAttribute("src", pptUrl);
                
                this.setAutoSlideConfig();

                var msgCont = document.getElementById('pptMessageLayout');
                if (msgCont != null) {
                    console.log("message block");
                    msgCont.style.display = "none";
                }
                var pptContainer = document.getElementById(this.UI.id);
                if (!pptContainer.classList.contains("pptSharing")) {
                    pptContainer.classList.add("pptSharing");
                }
            },
            
            /*
            * Set the autoslide configation value from local storage to iniline variables 
            */
            
            setAutoSlideConfig: function() {
                if (localStorage.getItem('autoSlideTime')) {
                    virtualclass.sharePt.autoSlideTime = JSON.parse(localStorage.getItem('autoSlideTime'));
                    virtualclass.sharePt.autoSlideFlag = JSON.parse(localStorage.getItem('autoSlideFlag'));
                }
            },
            /*
             * student receives ppt message
             * @param  msg ppt msg from the sender
             
             */
            onmessage: function(msg) {
                if (msg.hasOwnProperty('autoSlide')) {
                    this.autoSlideTime = msg.autoSlide;
                }
                if (typeof virtualclass.sharePt != 'undefined') {
                    virtualclass.system.setAppDimension(virtualclass.currApp);
                    this.onPptMsgReceive(msg);
                    var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                    if (!pptContainer.classList.contains("pptSharing")) {
                        pptContainer.classList.add("pptSharing");
                    }
                }
            },
            ready: function(pptData) {
                console.log("teacher ready for ppt ");
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            /*
             * function to be called when slidechange event fired at teacher's end
             * @param  pptData event data
             */
            slidechanged: function(pptData) {
                if (this.autoSlideFlag && this.autoSlideResumed && !this.autoSlideTime) {
                    this.calculateAutoSlideTime(pptData);
                }
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', autoSlide: this.autoSlideTime, cfpt : 'setPEvent'});
            },
            
            /*
             * We are calculating the autoslide time based on automatic slide changed
                for example at very first, the auto slide is paused, after that if presenter resume the auto slide and slidechanged event
                is occured then the below function caculated autoslide time, It does not caculate the time when autolide is paused and
                use click on next/prev slide button to change the slide, in that time we give the default time is 6 second.
                This time is required when student become presenter, we are storing two time stamps for compare
             */
            calculateAutoSlideTime: function(pptData) {
                this.eventsObj.push({name: pptData.eventName, time: Date.now()});
                if (this.eventsObj.length >= 2) {
                    if (this.eventsObj[0].name == 'slidechanged' && this.eventsObj[1].name == 'slidechanged') {
                        // perform only in rearest case, 
                        this.autoSlideTime = this.eventsObj[1].time - this.eventsObj[0].time;
                        console.log("auto slide time withoutpause" + this.autoSlideTime);
                    } else if (this.eventsObj[0].name == 'autoslideresumed' && this.eventsObj[1].name == 'slidechanged') {
                        this.autoSlideTime = this.eventsObj[1].time - this.eventsObj[0].time;
                        console.log("withpause" + this.autoSlideTime);
                    }
                    console.log(this.eventsObj);
                    console.log(this.autoSlideTime);
                }
            },
            /*
             * function to be called when auto slide paused
             * @param  pptData paused event data
             
             */
            autoslidepaused: function(pptData) {
                this.autoSlideFlag = 1; // To find that autoSlide is enabled or not
                this.autoSlideResumed = 0; // To konw auto slide is resumed or not
                console.log(this.pause);
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            /*
             * function to be called when auto slide resumed at teacher's end
             * @param  pptData event data
             */
            autoslideresumed: function(pptData) {
                //this.autoSlideResumed
                this.autoSlideFlag = 1; 
                this.autoSlideResumed = 1;
                this.eventsObj = [];
                this.eventsObj.push({name: pptData.eventName, time: Date.now()});
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});

            },
            /*
             * function to be called when fragment shown event fired at teacher's end
             * @param  pptData event data
             */
            fragmentshown: function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            /*
             * function to be called when fragment hidden event fired  at teacher's end
             * @param  pptData event data
             */
            fragmenthidden: function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            /*
             * function to be called when overview shown event fired at  teacher's end
             * @param  pptData event data
             */
            overviewshown: function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            /*
             * function to be called when overview hidden event fired  at teacher's end
             * @param  pptData event data
             */
            overviewhidden: function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },

            paused:function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },
            resumed:function(pptData) {
                ioAdapter.mustSend({pptMsg: pptData, cf: 'ppt', cfpt : 'setPEvent'});
            },

            /*
             *Removes control from student's end 
             *and removes auto slide also 
             * 
             */
            removeControls: function() {
                setTimeout(function() {
                    var frame = document.getElementById("pptiframe");
                    frame.contentWindow.postMessage(JSON.stringify({method: "configure", args: [{controls: false,autoSlide: 0,keyboard: false,progress: false,touch: false}]}), '*');
                }, 100);

            },
            // custom function presentation
            cfpt : {
                displayFrame : function (){
                    this.displayFrame();
                },
                
                setUrl : function (receivemsg){
                    
                    virtualclass.sharePt.localStoragFlag = 0;
                    virtualclass.sharePt.stateLocalStorage = {};
                    virtualclass.sharePt.state = {indexh : 0, indexv : 0, indexf : 0};
                    this.setSlideUrl(receivemsg);
                    var frame = document.getElementById("pptiframe");
                    frame.onload = function() {
                        if (roles.hasView()) {
                            if (frame.contentWindow != null) {
                                if (typeof receivemsg.pptMsg.state != 'undefined') {
                                    frame.contentWindow.postMessage(JSON.stringify({method: 'setState', args: [receivemsg.pptMsg.state]}), '*');
                                }
                            }
                        }
                    }
                },
                
                setPEvent : function (receivemsg){
                    var frame= document.getElementById('pptiframe') 
                    if (frame != null) {
                        virtualclass.sharePt.setSlideState(receivemsg.pptMsg);
                    }
                    this.state = receivemsg.pptMsg.state;
                }
            },
         
            /*
             * Creates the layout at the  student's side
             * Sets Url of the slide and after that sets state on receiveing changed state from the sender
             * @param receivemsg  received message by the student 
             */
            onPptMsgReceive: function(receivemsg) {
                      
                if( typeof receivemsg.ppt != 'undefined') {
                    if( typeof receivemsg.ppt.startFrom != 'undefined') {
                        virtualclass.sharePt.startFromFlag=1;
                        var frame= document.getElementById('pptiframe') 
                        if(frame !=null){
                            if (receivemsg.ppt.init.search("postMessage") < 0) {
                                    frame.setAttribute("src", receivemsg.ppt.init+ "?postMessage=true&postMessageEvents=true");
                            } else {
                                frame.setAttribute("src", receivemsg.ppt.init);
                            }   
                            virtualclass.sharePt.startFrom=[receivemsg.ppt.startFrom.indexh,receivemsg.ppt.startFrom.indexv,receivemsg.ppt.startFrom.indexf];
                       }
                    }
                    
                }

                if (typeof receivemsg.pptMsg != 'undefined') {
                    
                    var frame = document.getElementById("pptiframe");
                    var msgLayout = document.getElementById('pptMessageLayout');
                    if (frame != null) {
                        frame.onload = function() {
                            if (roles.hasView()) {
                                if (frame.contentWindow != null) {
                                    if (typeof receivemsg.pptMsg.state != 'undefined') {
                                        frame.contentWindow.postMessage(JSON.stringify({method: 'setState', args: [receivemsg.pptMsg.state]}), '*');
                                    }
                                }
                            }
                        }
                    }
                    if (msgLayout != null) {
                        msgLayout.style.display = "none";
                    }
                    
                    
                    
                    if(receivemsg.hasOwnProperty('cfpt') && typeof receivemsg.cfpt != 'undefined' && typeof virtualclass.sharePt.cfpt[receivemsg.cfpt] != 'undefined'){
                        virtualclass.sharePt.cfpt[receivemsg.cfpt].call(virtualclass.sharePt, receivemsg);
                    }
                }
            },
            /*
             * calls function to create the ppt container at students end 
             * @param  receivemsg ppt data recevied from the teacher
             */
            displayFrame: function() {
                //virtualclass.sharePt.localStoragFlag=0;
                virtualclass.system.setAppDimension(virtualclass.currApp);
                var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                if (!pptContainer.classList.contains("pptSharing")) {
                    pptContainer.classList.add("pptSharing");
                }
            },
            /*
             * Set url of the slide at student's side
             * @param receivemsg received message from the sender containg the url of the slide
             */
            setSlideUrl: function(receivemsg) {
                virtualclass.sharePt.studentPpt = 0;
                console.log('PPT:- invoke setSlideUrl');
                this.viewFlag = 0;
                this.autoSlideFlag = 0
                this.autoSlideTime = 0;
                var iframe = document.getElementById('pptiframe');
                if (iframe != null) {
                    iframe.parentNode.removeChild(iframe);
                }
                console.log("create iframe from setslide url")
                this.UI.createIframe();
                var elem = document.getElementById("iframecontainer");
                elem.style.display = "block";
                var iframe = document.getElementById('pptiframe');
                iframe.setAttribute("src", (receivemsg.pptMsg.search("postMessage") < 0) ? receivemsg.pptMsg + "?postMessage=true&postMessageEvents=true" : receivemsg.pptMsg);
                console.log("test url is set");
                this.pptUrl = receivemsg.pptMsg;
            },
            /*
             * sets state at student's end as it is changed on teacher's end
             * @param  receivemsg contains event received corresponding to state change on teacher's side
             
             */
            setSlideState: function(msg) {
                var frame = document.getElementById("pptiframe").contentWindow;
                var indexArg = [msg.state.indexh, msg.state.indexv, msg.state.indexf];
                var stateArg = [msg.state];
                var eventReceived = msg.eventName;
                switch (eventReceived) {
                    case 'ready':
                        frame.postMessage(JSON.stringify({method: 'setState', args: stateArg}), '*');
                        break;
                    case 'slidechanged':
                        virtualclass.sharePt.studentPpt = msg;
                        console.log('test PPt:-  changed');
                        frame.postMessage(JSON.stringify({method: 'slide', args: indexArg}), '*');
                        break;
                    case "autoslidepaused":
                        this.autoSlideFlag = 1;
                        frame.postMessage(JSON.stringify({method: "toggleAutoSlide"}), '*');
                        break;
                    case 'autoslideresumed':
                        this.autoSlideFlag = 1;
                        frame.postMessage(JSON.stringify({method: "toggleAutoSlide"}), '*');
                        break;
                    case 'fragmentshown':
                        frame.postMessage(JSON.stringify({method: 'slide', args: indexArg}), '*');
                        break;
                    case'fragmenthidden':
                        frame.postMessage(JSON.stringify({method: 'slide', args: indexArg}), '*');
                        break;
                    case 'overviewshown':
                        frame.postMessage(JSON.stringify({method: 'setState', args: stateArg}), '*');
                        break;
                    case 'overviewhidden':
                        frame.postMessage(JSON.stringify({method: 'setState', args: stateArg}), '*');
                        frame.postMessage(JSON.stringify({method: 'slide', args: indexArg}), '*');
                    default : 
                        console.log('There is no event is occured');
                }
            },
            
            toProtocolRelativeUrl : function (){
                var url = virtualclass.sharePt.urlValue;
                if(url.indexOf('http') >= 0){
                    return url.replace(/http:\/\/|https:\/\//, '//');
                } else {
                    return ('//' + url);
                }
                
            },

            /**
             * validate the url and return validated url
             * @returns {*}
             */
            validUrl : function (){
                if (virtualclass.sharePt.isUrlip(virtualclass.sharePt.urlValue)) {
                    return virtualclass.sharePt.cleanupUrl(virtualclass.sharePt.urlValue);
                } else if (virtualclass.sharePt.urlValue.search("<iframe") > 0) {
                    return virtualclass.sharePt.extractUrl(virtualclass.sharePt.urlValue);
                }  else if (virtualclass.sharePt.validURLWithDomain(virtualclass.sharePt.urlValue)) {
                    return virtualclass.sharePt.completeUrl(virtualclass.sharePt.cleanupUrl(virtualclass.sharePt.urlValue));
                }
                return false;
            },

              /*
             *event handler on click of submit button of the url at teacher's end
             *Calls function to set up the url 
             *calls function to validate the entered url 
             * @param receivemsg  received message by the student 
             */
            initNewPpt : function() {
                virtualclass.sharePt.urlValue = document.getElementById("presentationurl").value;
                virtualclass.sharePt.urlValue =   virtualclass.sharePt.toProtocolRelativeUrl();

                var vUrl = virtualclass.sharePt.validUrl();
                if(vUrl){
                    virtualclass.sharePt.autoSlideTime = 0;
                    virtualclass.sharePt.autoSlideFlag = 0;
                    virtualclass.sharePt.localStoragFlag = 0;
                    virtualclass.sharePt.startFromFlag=0;

                    virtualclass.sharePt.eventsObj = [];
                    virtualclass.sharePt.state = {indexh : 0, indexv : 0, indexf : 0};
                    virtualclass.sharePt.stateLocalStorage = {};

                    localStorage.removeItem('autoSlideTime');
                    localStorage.removeItem('autoSlideFlag');

                    var iframecontainer = document.getElementById("iframecontainer");
                    if (iframecontainer == null) {
                        console.log("call of iframe creater from onclick event handler");
                        virtualclass.sharePt.UI.createIframe();
                    }

                    var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                    if (!pptContainer.classList.contains("pptSharing")) {
                        pptContainer.classList.add("pptSharing");
                    }

                    virtualclass.sharePt.setPptUrl(vUrl);

                    virtualclass.system.setAppDimension(); // add just the height of screen container
                } else {
                    alert('Invalid Url');
                }
            },
            /*
             * Removes unnessary characters from the entered url, url copied from slides.com may contain hash  
             * @param hashedUrl url entered by the user
             */
            cleanupUrl: function(hashedUrl) {
                var hashPos = hashedUrl.search('#');
                if (hashPos > 0) {
                    var hashedUrl = hashedUrl.slice(0, hashPos);
                }
                return hashedUrl;
            },
            /*
             * Assign frame's src as the url of the slide 
             * @param urlValue of the slide to be set in appropriate format
             */
            setPptUrl: function(urlValue) {
                console.log("test+set ppt url function");
                var elem = document.getElementById("iframecontainer");
                elem.style.display = "block";
                
                var frame = document.getElementById("pptiframe");
                console.log("completeurl" + urlValue);
                virtualclass.sharePt.pptUrl = urlValue + "?postMessage=true&postMessageEvents=true";
                
                frame.setAttribute("src", virtualclass.sharePt.pptUrl);
                ioAdapter.mustSend({pptMsg: "displayframe", cf: 'ppt', user: "all", cfpt : 'displayframe'});
                ioAdapter.mustSend({pptMsg: urlValue, cf: 'ppt',  user: "all", cfpt : 'setUrl'});
                frame.style.display = "visible";

            },
            /*
             * Validate url 
             * @param str url to validate
             */
            validURLWithDomain: function(str) {
                var regex = /^\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                return regex.test(str);
            },
            /*
             * adding embed and https if not present in the url
             * @param str completing the url 
             */
            completeUrl: function(str) {
                if (str.search("slides.com") > 0 && str.search("embed") < 0) {
                    str = str + "/embed";
                }
                return str;
            },
            
           
            /*
             * extract url from the complete iframe text
             * @param str complete embedded iframe text is entered in the textbox
             */
            
            extractUrl: function(str) {
                if (str.search("src") > 0) {
                    var pos = str.match(/"(.*?)"/);
                    if(pos.length > 0){
                        return JSON.parse(pos[0]);
                    }
                }
                return str;
            },
           
            /*
             * if entered url is an ip address return true else return false
             * @param str to check for an ip 
             */
            isUrlip: function(str) {
                // removing // from url
                str.slice(0, 2);
                return (/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(str));
            },
            /*
             * Save the previous  objet in the localstorag on page refresh
             * @param prvAppObj previous object it shareppt object 
             */
            saveIntoLocalStorage: function(prvAppObj) {
                //debugger;
                if (this.validURLWithDomain(prvAppObj.metaData.init) || this.isUrlip(prvAppObj.metaData.init)) {
                    localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
                    console.log('ppt_state', prvAppObj.metaData.startFrom);
                    localStorage.setItem('ppt_state', JSON.stringify(prvAppObj.metaData.startFrom));
                    console.log("savinlocal");
                    
                    localStorage.setItem('pptUrl', JSON.stringify(prvAppObj.metaData.init));
                    localStorage.setItem('autoSlideTime', JSON.stringify(virtualclass.sharePt.autoSlideTime));
                    localStorage.setItem('autoSlideFlag', JSON.stringify(virtualclass.sharePt.autoSlideFlag));
                }
            },
            initTeacherLayout : function (){
                var frame = document.getElementById("pptiframe");
                if (document.getElementById("pptiframe") != null) {
                    var configValues = {controls: true,keyboard:true,progress:true,touch:true};
                    var autoSlideTime;
                    
                    if(virtualclass.sharePt.autoSlideTime && virtualclass.sharePt.autoSlideFlag){
                        autoSlideTime = virtualclass.sharePt.autoSlideTime;
                    } else if(virtualclass.sharePt.autoSlideFlag){
                       autoSlideTime =  6000;
                    }
                    
                    if(typeof autoSlideTime != 'undefined' && autoSlideTime > 1000){
                        configValues.autoSlide = autoSlideTime;
                    }
                    
                    
                    //frame.contentWindow.postMessage(JSON.stringify({method: "configure", args: [{controls: true,keyboard:true,progress:true,touch:true}]}), '*');

                    frame.contentWindow.postMessage(JSON.stringify({method: "configure", args : [configValues]}), '*');
                    
                    frame.contentWindow.postMessage(JSON.stringify({method: "toggleAutoSlide"}), '*');
                }
                var pptMessageLayout = document.getElementById('pptMessageLayout');
                if (pptMessageLayout != null) {
                    pptMessageLayout.style.display = "none";
                }
                virtualclass.sharePt.UI.createUrlContainer();
                document.getElementById('urlcontainer').style.display = "block";
                virtualclass.sharePt.eventsObj = [];
            },
            
            
            initStudentLayout : function (){
                var frame = document.getElementById("pptiframe");
                virtualclass.sharePt.eventsObj = [];
                virtualclass.sharePt.UI.messageDisplay();


                if (document.getElementById("pptiframe") != null) {
                    if(frame.src !=""){
                       virtualclass.sharePt.hideElement('pptMessageLayout');
                    }
                    frame.contentWindow.postMessage(JSON.stringify({method: "configure", args: [{controls: false,autoSlide: 0,autoSlideStoppable: true,keyboard: false,progress: false,touch: false}]}), '*');
                }else {
                    virtualclass.sharePt.displayElement('pptMessageLayout');
                }
                virtualclass.sharePt.hideElement('urlcontainer');
            },
            
            
            hideElement : function (id){
                var element = document.getElementById(id);
                if(element != null){
                    element.style.display = 'none';
                }
            },
            
            displayElement : function (id){
                var element = document.getElementById(id);
                if(element != null){
                    element.style.display = 'block';
                }
            },
            
            
            attachEvent : function (id, eventName, handler){
              var  elem = document.getElementById(id);
                if(elem != null){
                    elem.addEventListener(eventName, handler)
                }
            },
            
            UI: {
                id: 'virtualclassSharePresentation',
                class: 'virtualclass',
                /*
                 * Creates container for the ppt 
                 */
                container: function() {
                    console.log("test create main  container with id virtualclassSharePresentation");
                    var that = this;
                    var pptCont = document.getElementById(that.id);
                    if (pptCont != null) {
                        pptCont.parentNode.removeChild(pptCont);
                    }
                    var divppt = document.createElement('div');
                    divppt.id = that.id;
                    divppt.className = that.class;
                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
                    console.log(beforeAppend.parentNode);
                    beforeAppend.parentNode.insertBefore(divppt, beforeAppend);
                },
                /*
                 * 
                 * Creates iframecontainer and iframe for the ppt
                 */
                createIframe: function() {
                    var ct = document.getElementById("iframecontainer");
                    if(ct !=null) {
                        ct.parentNode.removeChild(ct);
                    }
                    console.log("test create ppt  iframe");
                    //debugger;
                    var pptCtr = document.getElementById("virtualclassSharePresentation");
                    if (pptCtr != null) {
                        var contDiv = document.createElement("div");
                        pptCtr.appendChild(contDiv);
                        contDiv.style.display = "none";
                    }
                    
                    var elem = document.createElement("div");
                    elem.setAttribute("id", "iframecontainer");
                    elem.style.height = '100%';
                    elem.style.width = '100%';
                    pptCtr.insertBefore(elem, pptCtr.firstChild);
                    elem.style.display = "none";
                    
                    var ct = document.getElementById("iframecontainer");
                    var frame = document.createElement("iframe");
                    ct.appendChild(frame);
                    frame.setAttribute("id", "pptiframe");
                    frame.style.height = '100%';
                    frame.style.width = '100%';
                },
                /*
                 * 
                 * Create container for the text box to enter url and for submit button
                 */
                createUrlContainer: function() {
                    var pptCont = document.getElementById("virtualclassSharePresentation");
                    if (document.getElementById('urlcontainer') == null) {
                        var urlc = document.createElement("div");
                        
                        urlc.setAttribute("id", "urlcontainer");
                        pptCont.appendChild(urlc);
                        
                        var url = document.createElement("input");
                        url.setAttribute("id", "presentationurl");

                        url.setAttribute("placeholder", virtualclass.lang.getString('ppturl'));
                        urlc.appendChild(url);
                     
                        var btn = document.createElement("input");
                        btn.setAttribute("type", "submit");
                        btn.setAttribute("id", "submitpurl");
                        btn.setAttribute("value", "submit");
                        urlc.appendChild(btn);
                    }
                },
          
                /*
                 * 
                 * display message on student's screen that ppt is going to be shared
                 */
                messageDisplay: function() {
                    var messageLayoutId = 'pptMessageLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var pptContainer = document.getElementById("virtualclassSharePresentation");
                        var studentMessage = document.createElement('p');
                        studentMessage.id = messageLayoutId;
                        studentMessage.innerHTML = virtualclass.lang.getString('pptscreenstudent');
                        pptContainer.appendChild(studentMessage);
                    }
                },
                
                removeIframe : function (){
                    var elem = document.getElementById('pptiframe')
                    if(elem) {
                        elem.parentNode.removeChild(elem);
                    }
                }
                
            }
        };
    }
    window.sharePt = sharePt;

})(window);