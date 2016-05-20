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
            if (typeof pptData == 'string') {
                var pptData = JSON.parse(event.data);
                virtualclass.sharePt.state = pptData.state;
            } else {
                var pptData = event.data;
                virtualclass.sharePt.state = pptData.state;
            }
            if (pptData.eventName == 'ready') {
                setTimeout(function() {
                    if (frame != null) {
                        frame.contentWindow.postMessage(JSON.stringify({method: "toggleAutoSlide"}), '*');
                    }
                }, 1500)
            }
            if (roles.hasView()) {
                if (pptData.eventName == 'ready') {
                    virtualclass.sharePt.studentPptReadyFlag = 1;
                    setTimeout(function() {
                   virtualclass.sharePt.removeControls();
                }, 100)
                    
                }
                if (virtualclass.sharePt.studentPptReadyFlag && virtualclass.sharePt.studentPpt) {
                    virtualclass.sharePt.setSlideState(virtualclass.sharePt.studentPpt);
                    virtualclass.sharePt.studentPpt = 0;
                    virtualclass.sharePt.studentPptReadyFlag = 0;
                }
            }

            if (roles.hasControls()) {
                console.log(pptData.eventName);
                if (typeof pptData.eventName != 'undefined') {
                    virtualclass.sharePt[pptData.eventName].call(virtualclass.sharePt, pptData);
                }
            }
        } else {
            if (frame) {
                frame.removeAttribute("src");
            }
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
            studentPptReadyFlag: 0,
            studentPpt: 0,
            /*
             * Initalizes and creates ppt layout at student's and teacheh's ends 
             * @param app sharePresentation
             * @param cusEvent byclick event 
             */
            init: function(app, cusEvent) {
                //debugger;
                this.studentPptReadyFlag = 0;
                this.autoSlideFlag = 0;
                this.autoSlideTime = 0;
                this.autoSlideResumed = 0;
                if (typeof virtualclass.previous != 'undefined') {
                    if (typeof cusEvent != 'undefined' && cusEvent == "byclick") {
                        if (roles.hasControls()) {
                            virtualclass.vutil.beforeSend({'ppt': true, cf: 'ppt', presentation: true});
                        }
                    }
                }

                var elem = document.getElementById('virtualclassSharePresentation')
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                }
                var frame = document.getElementById('pptiframe');
                if (frame != null) {
                    frame.parentNode.removeChild(frame);
                }
                this.UI.container();
                var msz = document.getElementById('pptMessageLayout');

                if (roles.hasControls()) {
                    var that = this;
                    this.UI.createUrlContainer();
                    var urlCont = document.getElementById('urlcontainer');
                    if (msz != null) {
                        msz.style.display = "none";
                    }
                    urlCont.style.display = "block";

                    var btn = document.getElementById("submitpurl");
                    btn.addEventListener("click", that.playPpt);

                }
                if (roles.hasView()) {
                    var urlCont = document.getElementById('urlcontainer');
                    this.UI.messageDisplay();
                    document.getElementById('pptMessageLayout').style.display = "block";
                    if (urlCont != null) {
                        urlCont.style.display = "none";
                    }
                }
                var frame = document.getElementById('pptiframe');
                if (frame != null) {
                    frame.contentWindow.addEventListener('message', function(event) {
                        console.log("event" + event);
                    });
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
                            var url = mdata['init'];

                            if (url) {
                                //  debugger;
                                this.localStoragFlag = true;
                                this.pptUrl = JSON.parse(localStorage.getItem('pptUrl'));
                                if (roles.hasControls()) {
                                    virtualclass.vutil.beforeSend({pptMsg: this.pptUrl, cf: 'ppt', uid: wbUser.id, flag: "url", presentation: true, onrefresh: true});
                                }
                                if (typeof mdata != 'undefined') {
                                    var startFrom = mdata['startFrom'];
                                    if (startFrom != null) {
                                        this.localStoragFlag = true;
                                        var state = startFrom;
                                    }
                                }
                            }
                        }
                        if (this.localStoragFlag) {
                            this.fromLocalStorage(state);
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
                var elem = document.getElementById('pptiframe');
                if (elem == null) {
                    this.UI.createIframe();
                }
                var elem = document.getElementById("iframecontainer");
                elem.style.display = "block";
                var iframe = document.getElementById("pptiframe");
                if (this.pptUrl.search("postMessage") < 0) {
                    iframe.setAttribute("src", this.pptUrl + "?postMessage=true&postMessageEvents=true");
                } else {
                    iframe.setAttribute("src", this.pptUrl);
                }
                this.slideConfig();

                var mszCont = document.getElementById('pptMessageLayout');
                if (mszCont != null) {
                    document.getElementById('pptMessageLayout').innerHTML = "";
                    mszCont.style.display = "none";
                }
                var pptContainer = document.getElementById(this.UI.id);
                var pos = pptContainer.className.search("pptSharing");
                if (pos < 0) {
                    pptContainer.className = pptContainer.className + " pptSharing";
                }
                if (typeof state != 'undefined') {
                    setTimeout(
                            function() {
                                if (iframe != null && iframe.contentWindow != null) {
                                    iframe.contentWindow.postMessage(JSON.stringify({method: 'slide', args: [state.indexh, state.indexv, state.indexf]}), '*');
                                }
                            }, 2000
                            );
                }

            },
            /*
             *Sets configuration and auto slide time in case slide state, url and autoslide time is retrived from the local storage 
             
             */
            slideConfig: function() {
                document.getElementById("pptiframe").onload = function() {
                    if (localStorage.getItem('autoSlideTime')) {
                        //debugger;
                        virtualclass.sharePt.autoSlideTime = JSON.parse(localStorage.getItem('autoSlideTime'));
                        virtualclass.sharePt.autoSlideFlag = JSON.parse(localStorage.getItem('autoSlideFlag'));
                    }
                    if (roles.hasView()) {
                        var frame = document.getElementById("pptiframe")
                        if (virtualclass.sharePt.viewFlag == 0) {
                            frame.contentWindow.postMessage(JSON.stringify({method: "configure", args: [{controls: false,autoSlide: 0,keyboard: false,progress: false,touch: false}]}), '*');
                            virtualclass.sharePt.viewFlag = 1;
                        }
                    }
                }
            },
            /*
             * student receives ppt message
             * @param  msg ppt msg from the sender
             
             */
            onmessage: function(msg) {
                if (msg.hasOwnProperty('autoSlide')) {
                    //debugger;
                    this.autoSlideTime = msg.autoSlide;
                }
                if (typeof virtualclass.sharePt != 'undefined') {
                    var mszCont = document.getElementById('pptMessageLayout');
                    if (mszCont != null) {
                        document.getElementById('pptMessageLayout').innerHTML = "";
                    }
                    virtualclass.system.setAppDimension(virtualclass.currApp);
                    this.onPptMsgReceive(msg);
                    var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                    var n = pptContainer.className.search("pptSharing");
                    if (n < 0) {
                        pptContainer.className = pptContainer.className + " pptSharing";
                    }
                }
            },
            ready: function(pptData) {
                console.log("teacher ready for ppt ");
                // virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
            },
            /*
             * function to be called when slidechange event fired at teacher's end
             * @param  pptData event data
             */
            slidechanged: function(pptData) {
                if (this.autoSlideFlag && this.autoSlideResumed) {
                    //debugger;
                    if (!this.autoSlideTime) {
                        this.calculateAutoSlideTime(pptData);

                    }
                }
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, autoSlide: this.autoSlideTime, presentation: true});

            },
            /*
             * function to calculate auto slide time if not calculated at teacher's end
             * @param  pptData event data 
             
             */
            calculateAutoSlideTime: function(pptData) {
                this.eventsObj.push({name: pptData.eventName, time: Date.now()});
                if (this.eventsObj.length >= 2) {
                    if (this.eventsObj[0].name == 'slidechanged' && this.eventsObj[1].name == 'slidechanged') {
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
                this.autoSlideFlag = 1;
                this.autoSlideResumed = 0;
                console.log(this.pause);
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
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
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});

            },
            /*
             * function to be called when fragment shown event fired at teacher's end
             * @param  pptData event data
             */
            fragmentshown: function(pptData) {
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
            },
            /*
             * function to be called when fragment hidden event fired  at teacher's end
             * @param  pptData event data
             */
            fragmenthidden: function(pptData) {
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
            },
            /*
             * function to be called when overview shown event fired at  teacher's end
             * @param  pptData event data
             */
            overviewshown: function(pptData) {
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
            },
            /*
             * function to be called when overview hidden event fired  at teacher's end
             * @param  pptData event data
             */
            overviewhidden: function(pptData) {
                virtualclass.vutil.beforeSend({pptMsg: pptData, cf: 'ppt', uid: wbUser.id, presentation: true});
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
            /*
             * Creates the layout at the  student's side
             * Sets Url of the slide and after that sets state on receiveing changed state from the sender
             * @param receivemsg  received message by the student 
             */
            onPptMsgReceive: function(receivemsg) {
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
                    if (receivemsg.pptMsg == "displayframe") {
                        this.displayFrame(receivemsg);

                    } else if (typeof receivemsg.urlFlag != 'undefined') {
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
                    } else if (typeof receivemsg.pptMsg.eventName != 'undefined') {
                        if (frame != null) {
                            virtualclass.sharePt.setSlideState(receivemsg.pptMsg);
                        }
                        this.state = receivemsg.pptMsg.state;
                    }
                }
            },
            /*
             * calls function to create the ppt container at students end 
             * @param  receivemsg ppt data recevied from the teacher
             */
            displayFrame: function(receivemsg) {
                virtualclass.system.setAppDimension(virtualclass.currApp);
                var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                var pos = pptContainer.className.search("pptSharing");
                if (pos < 0) {
                    pptContainer.className = pptContainer.className + " pptSharing";
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
                if (receivemsg.pptMsg.search("postMessage") < 0) {
                    console.log("setUrl");
                    iframe.setAttribute("src", receivemsg.pptMsg + "?postMessage=true&postMessageEvents=true");
                } else {
                    iframe.setAttribute("src", receivemsg.pptMsg);
                }
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
                        console.log('PPt:-  ready');
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
                }
            },
            /*
             *event handler on click of submit button of the url at teacher's end
             *Calls function to set up the url 
             *calls function to validate the entered url 
             * @param receivemsg  received message by the student 
             */
            playPpt: function(event) {
                var that = this;
                virtualclass.sharePt.autoSlideTime = 0;
                virtualclass.sharePt.eventsObj = [];
                virtualclass.sharePt.autoSlideFlag = 0;
                localStorage.removeItem('autoSlideTime');
                localStorage.removeItem('autoSlideFlag');
                var ct = document.getElementById("iframecontainer");
                if (ct == null) {
                    console.log("call of iframe creater from onclick event handler");
                    virtualclass.sharePt.UI.createIframe();
                }
                var frame = document.getElementById("pptiframe");
                var pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
                var pospptsharing = pptContainer.className.search("pptSharing");
                if (pospptsharing < 0) {
                    pptContainer.className = pptContainer.className + " pptSharing";
                }
                virtualclass.sharePt.urlValue = document.getElementById("presentationurl").value;
                if (virtualclass.sharePt.checkIp(virtualclass.sharePt.urlValue)) {
                    //debugger;
                    var posHttps = virtualclass.sharePt.urlValue.search("https");
                    var posHttp = virtualclass.sharePt.urlValue.search("http");
                    if (posHttp >= 0 && posHttps < 0) {
                        virtualclass.sharePt.urlValue = virtualclass.sharePt.urlValue.replace("http", "https");
                    } else {
                        virtualclass.sharePt.urlValue = "https://" + virtualclass.sharePt.urlValue;
                    }
                    if (/\/$/.test(virtualclass.sharePt.urlValue)) {
                        var urlValue = virtualclass.sharePt.urlValue;
                    } else {
                         var urlValue = virtualclass.sharePt.urlValue + "/";
                    }
                        virtualclass.sharePt.setPptUrl(urlValue);
                } else if (virtualclass.sharePt.validURL(virtualclass.sharePt.urlValue)) {
                    //debugger;
                    var cleanedUrl = virtualclass.sharePt.cleanupUrl(virtualclass.sharePt.urlValue);
                    var urlValue = virtualclass.sharePt.completeUrl(cleanedUrl);
                    virtualclass.sharePt.setPptUrl(urlValue);
                } else if (virtualclass.sharePt.urlValue.search("iframe") > 0) {
                    var etUrl = virtualclass.sharePt.extractUrl(virtualclass.sharePt.urlValue);
                    var urlValue = "https:" + etUrl;
                    virtualclass.sharePt.setPptUrl(urlValue);
                } else {
                    alert("Invalid URL");
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
                //https://192.168.1.105/revealjs/index.html#/?postMessage=true&postMessageEvents=true
                frame.setAttribute("src", virtualclass.sharePt.pptUrl);
                virtualclass.vutil.beforeSend({pptMsg: "displayframe", cf: 'ppt', uid: wbUser.id, user: "all", presentation: true});
                virtualclass.vutil.beforeSend({pptMsg: urlValue, cf: 'ppt', uid: wbUser.id, user: "all", urlFlag: "url", presentation: true});
                frame.style.display = "visible";

            },
            /*
             * Validate url 
             * @param str url to validate
             */
            validURL: function(str) {
                //debugger;
                var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                if (!regex.test(str)) {
                    return false;
                } else {
                    return true;
                }
            },
            /*
             * adding embed and https if not present in the url
             * @param str completing the url 
             */
            completeUrl: function(str) {
                //debugger;
                var posHttps = str.search("https");
                var posHttp = str.search("http");
                if (posHttps >= 0) {
                    if (str.search("slides.com") > 0) {
                        var posEmbed = str.search("embed");
                        if (posEmbed < 0) {
                            var str = str + "/embed";
                            return str;
                        }
                    } else {
                        return str;
                    }
                } else if (posHttp >= 0) {
                    var str = str.replace("http", "https");
                    if (str.search("slides.com") > 0) {
                        var posEmbed = str.search("embed");
                        if (posEmbed < 0) {
                            var str = str + "/embed";
                        }
                        return str;
                    } else {
                        return str;
                    }
                }
            },
            /*
             * extract url from the complete iframe text
             * @param str complete embedded iframe text is entered in the textbox
             */
            extractUrl: function(str) {
                var posSrc = str.search("src");
                if (posSrc > 2) {
                    var pos = str.match(/"(.*?)"/);
                }
                if (typeof pos != 'undefined') {
                    var str1 = pos[0];
                    str1 = JSON.parse(str1);
                    return str1;
                }
            },
            /*
             * if entered url is an ip address return true else return false
             * @param str to check for an ip 
             */
            checkIp: function(str) {
                //;
                var posHttps = str.search("https");
                var posHttp = str.search("http");
                if (posHttps >= 0) {
                    str.slice(0, 5);
                }
                else if (posHttp >= 0)
                {
                    str.slice(0, 4);
                }
                if (/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(str))
                {
                    return (true);
                }
                return (false);
            },
            /*
             * Save the previous  objet in the localstorag on page refresh
             * @param prvAppObj previous object it shareppt object 
             */
            saveIntoLocalStorage: function(prvAppObj) {
                //debugger;
                if (this.validURL(prvAppObj.metaData.init)) {
                    localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
                    console.log(prvAppObj);
                    localStorage.setItem('ppt' + '_state', JSON.stringify(prvAppObj.metaData.startFrom));
                    console.log("savinlocal");
                    localStorage.setItem('pptUrl', JSON.stringify(prvAppObj.metaData.init));
                    localStorage.setItem('autoSlideTime', JSON.stringify(virtualclass.sharePt.autoSlideTime));
                    localStorage.setItem('autoSlideFlag', JSON.stringify(virtualclass.sharePt.autoSlideFlag));
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
                    console.log("test create ppt  iframe");
                    //debugger;
                    var pptCtr = document.getElementById("virtualclassSharePresentation");
                    if (pptCtr != null) {
                        var contDiv = document.createElement("div");
                        pptCtr.appendChild(contDiv);
                        contDiv.style.display = "none";
                        var width = pptCtr.style.clientWidth;
                        var height = pptCtr.style.clientHeight;
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
                    var urlc = document.createElement("div");
                    if (document.getElementById('urlcontainer') == null) {
                        urlc.setAttribute("id", "urlcontainer");
                        pptCont.appendChild(urlc);
                        var url = document.createElement("input");
                        url.setAttribute("id", "presentationurl");
                        url.setAttribute("placeholder", "place presentation url here");
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
                 * remove url container
                 */
                removeUrlContainer: function() {
                    var child = document.getElementById('urlcontainer');
                    if (child != null) {
                        var target = document.getElementById(this.id);
                        if (target.hasChildNodes())
                        {
                            var children = new Array();
                            children = target.childNodes;
                            for (child in children)
                            {
                                target.removeChild[child];
                            }
                        }
                    }
                },
                /*
                 * 
                 * display message on student's screen that ppt is going to be shared
                 */
                messageDisplay: function() {
                    var pptContainer = document.getElementById("virtualclassSharePresentation");
                    var messageLayoutId = 'pptMessageLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var studentMessage = document.createElement('p');
                        studentMessage.id = messageLayoutId;
                        studentMessage.innerHTML = virtualclass.lang.getString('pptscreenstudent');
                        pptContainer.appendChild(studentMessage);
                    }
                },
                /*
                 * remove the message from the student's screen that ppt is going to be shared
                 */
                removeMessage: function() {
                    //debugger;
                    var child = document.getElementById('pptMessageLayout');
                    if (child != null) {
                        var target = document.getElementById("virtualclassSharePresentation");
                        if (target.hasChildNodes())
                        {
                            var children = new Array();
                            children = target.childNodes;
                            for (child in children)
                            {
                                target.removeChild[child];
                            }
                        }
                    }
                }
            }
        };
    }
    window.sharePt = sharePt;

})(window);