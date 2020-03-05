/*
 /*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function (window) {
  const { io } = window;
  /*
   * It handles  message event fired on changing state of the slides
   * Message event  can be fired by  using postMessage or by changing
   * state of the slides.
   *and teacher  broadcasts the state to the students
   *@param  message event received
   */

  const sharePt = function () {
    let pptfirst = false;
    return {
      pptUrl: '',
      state: {},
      urlValue: '',
      localStoragFlag: false,
      eventsObj: [],
      autoSlideTime: 0,
      viewFlag: 0,
      controlFlag: 0,
      autoSlideFlag: 0,
      autoSlideResumed: 0,
      // studentPptReadyFlag: 0,
      studentPpt: 0,
      startFromFlag: 0,
      startFrom: 0,
      currId: '',
      order: [],

      /*
       * Initalizes and creates ppt layout at student's and teacheh's ends
       * @param app sharePresentation
       * @param cusEvent byclick event
       */
      init(app, cusEvent) {
        if (!virtualclass.orderList[virtualclass.currApp]) {
          virtualclass.orderList[virtualclass.currApp] = new OrderedList();
        }

        this.pages = {};
        this.order = [];
        this.autoSlideFlag = 0;
        this.autoSlideTime = 0;
        this.autoSlideResumed = 0;

        if (typeof virtualclass.previous !== 'undefined' && typeof cusEvent !== 'undefined'
          && cusEvent === 'byclick' && roles.hasControls()) {
          virtualclass.vutil.beforeSend({ ppt: true, init: 'makeAppReady', cf: 'ppt' });
        }

        const elem = document.getElementById('virtualclassSharePresentation');
        if (elem !== null) {
          elem.parentNode.removeChild(elem);
        }

        // console.log('====> PPT SLIDE UI CREATE 1');
        this.UI.container();

        const messageContainer = document.getElementById('pptMessageLayout');
        const urlCont = document.getElementById('urlcontainer');
        if (roles.hasControls()) {
          if (messageContainer != null) {
            messageContainer.style.display = 'none';
          }
          if (urlCont) {
            urlCont.style.display = 'block';
          }
          virtualclass.vutil.requestOrder(() => {});
          this.getPptList();
        } else {
          this.UI.messageDisplay();
          if (messageContainer) {
            messageContainer.style.display = 'block';
          }
          if (urlCont) {
            urlCont.style.display = 'none';
          }
        }

        // if (roles.hasControls()) {
        //   this.getPptList();
        // }

        // console.log('====> PPT SLIDE UI CREATE 1.0 init');
        virtualclass.sharePt.attachMessageEvent('message', virtualclass.sharePt.pptMessageEventHandler);
      },

      createPageModule() {
        if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
          virtualclass.sharePt.ppts.forEach((pptObj, i) => {
            const idPostfix = pptObj.fileuuid;
            // var docId = 'docs' + doc;
            virtualclass.sharePt.pages[idPostfix] = new virtualclass.page('pptListContainer', 'ppt', 'virtualclassSharePresentation', 'sharePt', pptObj.status);
          });
        }
      },

      _rearrange(order) {
        this.order = order;
        this.reArrangeElements(order);
        // this.sendOrder(this.order);
        this.finallySendPptOrder(order);
        // virtualclass.vutil.sendOrder('presentation', order);
      },

      // not needed
      sendOrder(order) {
        const data = {
          content_order: order.toString(),
          content_order_type: '3',
          live_class_id: virtualclass.gObj.congCourse,
        };
        virtualclass.vutil.xhrSendWithForm(data, 'congrea_page_order');
      },


      reArrangeElements(order) {
        const container = document.getElementById('listppt');
        const tmpdiv = document.createElement('div');
        tmpdiv.id = 'listppt';
        tmpdiv.className = 'ppts';
        let orderChange = false;

        for (let j = 0; j < virtualclass.sharePt.activeppts.length; j++) {
          if (order.indexOf(virtualclass.sharePt.activeppts[j].fileuuid) <= -1) {
            order.push(virtualclass.sharePt.activeppts[j].fileuuid);
            orderChange = true;
          }
        }

        for (let i = 0; i < order.length; i++) {
          const elem = document.getElementById(`linkppt${order[i]}`);
          if (elem) {
            tmpdiv.appendChild(elem);
          }
        }

        container.parentNode.replaceChild(tmpdiv, container);
        if (orderChange) {
          // virtualclass.sharePt.order = order;
          virtualclass.orderList[virtualclass.currApp].ol.order = response;
          this.finallySendPptOrder();
          orderChange = false;
        }
      },

      finallySendPptOrder() {
        virtualclass.vutil.sendOrder('presentation', virtualclass.orderList[virtualclass.currApp].ol.order);
      },


      delete(id) {
        // var form_data = new FormData();
        // var data = {lc_content_id: id, action: 'delete', user: virtualclass.gObj.uid};
        // var form_data = new FormData();
        // for (var key in data) {
        //     form_data.append(key, data[key]);
        //     console.log(data[key]);
        // }

        const data = {
          uuid: id,
          action: 'delete',
          page: 0,
        };
        // var videoid = id;
        const url = virtualclass.api.UpdateDocumentStatus;
        const that = this;
        virtualclass.xhrn.vxhrn.post(url, data).then((msg) => {
          that.afterDeletePtCallback(msg.data, id);
        });

      },
      afterDeletePtCallback(msg, id) {
        if (msg !== 'ERROR') {
          const elem = document.getElementById(`linkppt${id}`);
          if (elem) {
            elem.parentNode.removeChild(elem);
            // virtualclass.videoUl.order=[];
            if (virtualclass.sharePt.ppts.length) {
              virtualclass.sharePt.ppts.forEach((ppt, index) => {
                if (ppt.fileuuid === id) {
                  const pptIndex = virtualclass.sharePt.ppts.indexOf(ppt);
                  if (pptIndex >= 0) {
                    virtualclass.sharePt.ppts.splice(pptIndex, 1);
                    // console.log(virtualclass.sharePt.ppts);
                  }
                }
              });
              const idIndex = virtualclass.orderList[virtualclass.currApp].ol.order.indexOf(id);
              if (idIndex >= 0) {
                virtualclass.orderList[virtualclass.currApp].ol.order.splice(idIndex, 1);
                // console.log(virtualclass.sharePt.order);
                // virtualclass.vutil.sendOrder('presentation', virtualclass.orderList[virtualclass.currApp].ol.order);
                this.finallySendPptOrder(virtualclass.orderList[virtualclass.currApp].ol.order);
              }
              const slide = document.querySelector('.congrea #pptiframe');
              if (slide && slide.getAttribute('src')) {
                virtualclass.vutil.showFinishBtn();
              } else {
                virtualclass.vutil.removeFinishBtn();
              }
            }
            if (virtualclass.sharePt.currId === id) {
              // if(type !="yts"){
              const ptCont = document.querySelector('#pptiframe');
              if (ptCont) {
                ptCont.removeAttribute('src');
                ioAdapter.mustSend({
                  pptMsg: 'deletePrt',
                  cf: 'ppt',
                  currId: virtualclass.sharePt.currId,
                });
                virtualclass.sharePt.currId = null;
                virtualclass.sharePt.pptUrl = null;
                virtualclass.vutil.removeFinishBtn();
              }
            }

          }
        }
      },


      /*
       * Set the autoslide configation value from local storage to iniline variables
       */
      isPptEventDefined(pptData) {
        return (typeof pptData.eventName !== 'undefined'
        && typeof virtualclass.sharePt[pptData.eventName] !== 'undefined');
      },

      pptMessageEventHandler(event) {
        virtualclass.sharePt.actualPptMessageEventHandler(event);
      },

      actualPptMessageEventHandler(event) {
        // console.log('====> PPT SLIDE receive ', event.data);
        // console.log('====> dashboard init 2');
        if (virtualclass.currApp === 'SharePresentation') {
          const pptData = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
          console.log('====> ppt event ', pptData.eventName);
          if (typeof pptData !== 'undefined') {
            if (Object.prototype.hasOwnProperty.call(pptData, 'namespace') && pptData.namespace === 'reveal') {
              this.state = pptData.state;
            }

            if (pptData.eventName === 'ready') {
              if (this.lastSlideChanged) {
                // Set the last changed slide if revealjs failed to load that
                // eg, send if user passes slide 5 and revealjs returns slide 0
                this.setSlideState(this.lastSlideChanged);
              } else if (roles.hasControls()) {
                this[pptData.eventName].call(this, pptData);
                this.state = pptData.state;
              }
              if (roles.isStudent()) this.removeControls();
            } else if (pptData.eventName === 'slidechanged' && roles.hasControls()
              && virtualclass.config.makeWebSocketReady
              && (this.isPptEventDefined(pptData) && (!this.lastSlideChanged
              || (this.lastSlideChanged && (this.isVerticalSlideChanged(pptData)
              || this.isHorizontalSlideChanged(pptData)))))) {
              // Send slide only if there is difference between changed and recevied slide
              this[pptData.eventName].call(this, pptData);
              this.state = pptData.state;
              delete this.lastSlideChanged;
            } else if (roles.hasControls() && this[pptData.eventName]) {
              this[pptData.eventName].call(this, pptData);
            }
          } else {
            const frame = document.getElementById('pptiframe');
            if (frame !== null) {
              frame.removeAttribute('src');
            }
          }

          if (pptData.eventName === 'slidechanged') {
            virtualclass.userInteractivity.makeReadyContext();
          }
        }
      },

      isVerticalSlideChanged(pptData) {
        return (virtualclass.sharePt.lastSlideChanged.state.indexh === pptData.state.indexh
        && virtualclass.sharePt.lastSlideChanged.state.indexv !== pptData.state.indexv);
      },

      isHorizontalSlideChanged(pptData) {
        return (virtualclass.sharePt.lastSlideChanged.state.indexv === pptData.state.indexv
        && virtualclass.sharePt.lastSlideChanged.state.indexh !== pptData.state.indexh);
      },

      setAutoSlideConfig() {
        if (localStorage.getItem('autoSlideTime')) {
          virtualclass.sharePt.autoSlideTime = JSON.parse(localStorage.getItem('autoSlideTime'));
          virtualclass.sharePt.autoSlideFlag = JSON.parse(localStorage.getItem('autoSlideFlag'));
        }
      },
      /*
       * student receives ppt message
       * @param  msg ppt msg from the sender

       */
      onmessage(msg) {
        if (Object.prototype.hasOwnProperty.call(msg, 'autoSlide')) {
          this.autoSlideTime = msg.autoSlide;
        }
        if (typeof virtualclass.sharePt !== 'undefined') {
          this.onPptMsgReceive(msg);
          const pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
          if (!pptContainer.classList.contains('pptSharing')) {
            pptContainer.classList.add('pptSharing');
          }
        }
      },
      ready(pptData) {
        // console.log('teacher ready for ppt ');
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when slidechange event fired at teacher's end
       * @param  pptData event data
       */
      slidechanged(pptData) {
        if (this.autoSlideFlag && this.autoSlideResumed && !this.autoSlideTime) {
          this.calculateAutoSlideTime(pptData);
        }
        ioAdapter.mustSend({
          pptMsg: pptData, cf: 'ppt', autoSlide: this.autoSlideTime, cfpt: 'setPEvent',
        });
      },

      /*
       * We are calculating the autoslide time based on automatic slide changed
       for example at very first, the auto slide is paused, after that if presenter resume the auto slide and slidechanged event
       is occured then the below function caculated autoslide time, It does not caculate the time when autolide is paused and
       use click on next/prev slide button to change the slide, in that time we give the default time is 6 second.
       This time is required when student become presenter, we are storing two time stamps for compare
       */
      calculateAutoSlideTime(pptData) {
        this.eventsObj.push({ name: pptData.eventName, time: Date.now() });
        if (this.eventsObj.length >= 2) {
          if (this.eventsObj[0].name === 'slidechanged' && this.eventsObj[1].name === 'slidechanged') {
            // perform only in rearest case,
            this.autoSlideTime = this.eventsObj[1].time - this.eventsObj[0].time;
            // console.log(`auto slide time withoutpause${this.autoSlideTime}`);
          } else if (this.eventsObj[0].name === 'autoslideresumed' && this.eventsObj[1].name === 'slidechanged') {
            this.autoSlideTime = this.eventsObj[1].time - this.eventsObj[0].time;
            // console.log(`withpause${this.autoSlideTime}`);
          }
          // console.log(this.eventsObj);
          // console.log(this.autoSlideTime);
        }
      },
      /*
       * function to be called when auto slide paused
       * @param  pptData paused event data

       */
      autoslidepaused(pptData) {
        this.autoSlideFlag = 1; // To find that autoSlide is enabled or not
        this.autoSlideResumed = 0; // To konw auto slide is resumed or not
        // console.log(this.pause);
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when auto slide resumed at teacher's end
       * @param  pptData event data
       */
      autoslideresumed(pptData) {
        // this.autoSlideResumed
        this.autoSlideFlag = 1;
        this.autoSlideResumed = 1;
        this.eventsObj = [];
        this.eventsObj.push({ name: pptData.eventName, time: Date.now() });
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when fragment shown event fired at teacher's end
       * @param  pptData event data
       */
      fragmentshown(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when fragment hidden event fired  at teacher's end
       * @param  pptData event data
       */
      fragmenthidden(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when overview shown event fired at  teacher's end
       * @param  pptData event data
       */
      overviewshown(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      /*
       * function to be called when overview hidden event fired  at teacher's end
       * @param  pptData event data
       */
      overviewhidden(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },

      paused(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },
      resumed(pptData) {
        ioAdapter.mustSend({ pptMsg: pptData, cf: 'ppt', cfpt: 'setPEvent' });
      },

      /*
       *Removes control from student's end
       *and removes auto slide also
       *
       */
      removeControls() {
        setTimeout(() => {
          const frame = document.getElementById('pptiframe');
          // console.log('====> PPT SLIDE POST');
          frame.contentWindow.postMessage(JSON.stringify({
            method: 'configure',
            args: [{
              controls: false, autoSlide: 0, keyboard: false, progress: false, touch: false,
            }],
          }), '*');
        }, 100);
      },
      // custom function presentation
      cfpt: {
        displayframe() {
          this.displayFrame();
        },

        setUrl(receivemsg) {
          virtualclass.sharePt.currId = receivemsg.pptId;
          console.log('====> PPT SLIDE SET URL');
          // virtualclass.sharePt.localStoragFlag = 0;
          virtualclass.sharePt.stateLocalStorage = {};
          virtualclass.sharePt.state = { indexh: 0, indexv: 0, indexf: 0 };
          this.setSlideUrl(receivemsg);
          const frame = document.getElementById('pptiframe');
          frame.onload = function () {
            if (roles.hasView() && frame.contentWindow != null && (typeof receivemsg.pptMsg.state !== 'undefined')) {
              frame.contentWindow.postMessage(JSON.stringify({
                method: 'setState',
                args: [receivemsg.pptMsg.state],
              }), '*');

            }
            virtualclass.userInteractivity.makeReadyContext();
          };
        },

        setPEvent(receivemsg) {
          const frame = document.getElementById('pptiframe');
          if (frame != null) {
            virtualclass.sharePt.setSlideState(receivemsg.pptMsg);
          }
          this.state = receivemsg.pptMsg.state;
        },
      },

      /*
       * Creates the layout at the  student's side
       * Sets Url of the slide and after that sets state on receiveing changed state from the sender
       * @param receivemsg  received message by the student
       */


      onPptMsgReceive(receivemsg) {
        // console.log('====> PPT SLIDE ONRECEIVE MSG');
        const pptIframe = document.getElementById('pptiframe');
        const msgLayout = document.getElementById('pptMessageLayout');

        if (typeof receivemsg.ppt !== 'undefined' && typeof receivemsg.ppt.startFrom !== 'undefined') {
          virtualclass.sharePt.startFromFlag = 1;
          if (pptIframe !== null) {
            // console.log('====> PPT SLIDE POST');
            if (receivemsg.ppt.init.search('postMessage') < 0) {
              pptIframe.setAttribute('src', `${receivemsg.ppt.init}?postMessage=true&postMessageEvents=true`);
            } else {
              pptIframe.setAttribute('src', receivemsg.ppt.init);
            }
          }
        }

        if (typeof receivemsg.pptMsg !== 'undefined') {

          if (receivemsg.pptMsg === 'deletePrt') {
            if (pptIframe !== null) {
              pptIframe.removeAttribute('src');
              virtualclass.sharePt.currId = null;
              virtualclass.sharePt.pptUrl = null;

              if (msgLayout !== null) {
                msgLayout.style.display = 'block';
              }
            }
          } else if (pptIframe !== null) {
            pptIframe.onload = function () {
              if (roles.hasView() || !virtualclass.gObj.makeWebSocketReady) {
                if (pptIframe.contentWindow != null && typeof receivemsg.pptMsg.state !== 'undefined') {
                  // console.log('====> PPT SLIDE POST ', receivemsg.pptMsg.state);
                  pptIframe.contentWindow.postMessage(JSON.stringify({
                    method: 'setState',
                    args: [receivemsg.pptMsg.state],
                  }), '*');
                  virtualclass.userInteractivity.makeReadyContext();
                }
              }
            };
          }

          if (msgLayout != null) {
            msgLayout.style.display = 'none';
          }

          if (Object.prototype.hasOwnProperty.call(receivemsg, 'cfpt') && typeof receivemsg.cfpt !== 'undefined'
            && typeof virtualclass.sharePt.cfpt[receivemsg.cfpt] !== 'undefined') {
            virtualclass.sharePt.cfpt[receivemsg.cfpt].call(virtualclass.sharePt, receivemsg);
          }
        }
      },

      /*
       * calls function to create the ppt container at students end
       * @param  receivemsg ppt data recevied from the teacher
       */
      displayFrame() {
        // console.log('====> PPT SLIDE UI CREATE 2');
        // virtualclass.sharePt.localStoragFlag=0;
        const pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
        if (!pptContainer.classList.contains('pptSharing')) {
          pptContainer.classList.add('pptSharing');
          virtualclass.dashboard.close();
        }

      },
      /*
       * Set url of the slide at student's side
       * @param receivemsg received message from the sender containg the url of the slide
       */
      setSlideUrl(receivemsg) {
        if (receivemsg.pptMsg != null && receivemsg.pptMsg) {
          virtualclass.sharePt.studentPpt = 0;
          // console.log('PPT:- invoke setSlideUrl');
          this.viewFlag = 0;
          this.autoSlideFlag = 0;
          this.autoSlideTime = 0;
          const iframe = document.getElementById('pptiframe');
          if (iframe != null) {
            iframe.parentNode.removeChild(iframe);
          }
          // console.log('create iframe from setslide url');
          this.UI.createIframe();
          const elem = document.getElementById('iframecontainer');
          elem.style.display = 'block';
          const pptiframe = document.getElementById('pptiframe');
          // console.log('====> PPT SLIDE POST');
          pptiframe.setAttribute('src', (receivemsg.pptMsg.search('postMessage') < 0) ? `${receivemsg.pptMsg}?postMessage=true&postMessageEvents=true` : receivemsg.pptMsg);
          // console.log('test url is set');
          this.pptUrl = receivemsg.pptMsg;
        }

        // virtualclass.sharePt.localStoragFlag = 0;
        virtualclass.sharePt.startFromFlag = 0;
      },
      /*
       * sets state at student's end as it is changed on teacher's end
       * @param  receivemsg contains event received corresponding to state change on teacher's side

       */
      setSlideState(msg) {
        // console.log('====> PPT SLIDE set slide');
        const frame = document.getElementById('pptiframe').contentWindow;
        const indexArg = [msg.state.indexh, msg.state.indexv, msg.state.indexf];
        const stateArg = [msg.state];
        const eventReceived = msg.eventName;
        // console.log('====> PPT SLIDE POST');
        switch (eventReceived) {
          case 'ready':
            frame.postMessage(JSON.stringify({ method: 'setState', args: stateArg }), '*');
            break;
          case 'slidechanged':
            console.log('===> slide being changed');
            virtualclass.sharePt.studentPpt = msg;
            virtualclass.sharePt.lastSlideChanged = msg;
            frame.postMessage(JSON.stringify({ method: 'slide', args: indexArg }), '*');
            break;
          case 'autoslidepaused':
            this.autoSlideFlag = 1;
            frame.postMessage(JSON.stringify({ method: 'toggleAutoSlide' }), '*');
            break;
          case 'autoslideresumed':
            this.autoSlideFlag = 1;
            frame.postMessage(JSON.stringify({ method: 'toggleAutoSlide' }), '*');
            break;
          case 'fragmentshown':
            // console.log('====> PPT SLIDE CHANGED 2b v=', msg.state.indexv, ' =h', msg.state.indexh);
            frame.postMessage(JSON.stringify({ method: 'slide', args: indexArg }), '*');
            break;
          case 'fragmenthidden':
            frame.postMessage(JSON.stringify({ method: 'slide', args: indexArg }), '*');
            break;
          case 'overviewshown':
            frame.postMessage(JSON.stringify({ method: 'setState', args: stateArg }), '*');
            break;
          case 'overviewhidden':
            frame.postMessage(JSON.stringify({ method: 'setState', args: stateArg }), '*');
            frame.postMessage(JSON.stringify({ method: 'slide', args: indexArg }), '*');
          default:
          // console.log('There is no event is occured');
        }
      },

      toProtocolRelativeUrl() {
        const url = virtualclass.sharePt.urlValue;
        if (url.indexOf('http') >= 0) {
          return url.replace(/http:\/\/|https:\/\//, '//');
        }
        return (`//${url}`);
      },
      /**
       * validate the url and return validated url
       * @returns {*}
       */
      validUrl() {
        if (virtualclass.sharePt.isUrlip(virtualclass.sharePt.urlValue)) {
          return virtualclass.sharePt.cleanupUrl(virtualclass.sharePt.urlValue);
        } if (virtualclass.sharePt.urlValue.search('<iframe') > 0) {
          return virtualclass.sharePt.extractUrl(virtualclass.sharePt.urlValue);
        } if (virtualclass.sharePt.validURLWithDomain(virtualclass.sharePt.urlValue)) {
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
      initNewPpt() {
        virtualclass.sharePt.urlValue = document.getElementById('presentationurl').value;
        virtualclass.sharePt.urlValue = virtualclass.sharePt.toProtocolRelativeUrl();
        const vUrl = virtualclass.sharePt.validUrl();
        if (vUrl) {
          virtualclass.sharePt.savePptUrl(vUrl);
          document.getElementById('presentationurl').value = '';
        } else {
          virtualclass.popup.validateurlPopup('presentation');
          // alert('Please enter a valid URL');
        }
      },
      savePptUrl(vUrl) {
        const id = virtualclass.vutil.createHashString(vUrl) + virtualclass.vutil.randomString(32).slice(1, -1);
        const pptObj = {};
        pptObj.uuid = id;
        pptObj.URL = vUrl;
        pptObj.title = vUrl;
        const url = virtualclass.api.addURL;
        pptObj.type = 'presentation';
        const that = this;

        virtualclass.xhrn.vxhrn.post(url, pptObj).then(() => {
          if (Object.prototype.hasOwnProperty.call(virtualclass.sharePt, 'activeppts')) {
            const ppts = virtualclass.sharePt.activeppts.map(ppt => ppt.fileuuid);
            if (ppts.length !== virtualclass.orderList[virtualclass.currApp].ol.order.length) {
              // virtualclass.sharePt.order = ppts;
              virtualclass.orderList[virtualclass.currApp].ol.order = ppts;
            }
          }

          virtualclass.orderList[virtualclass.currApp].ol.order.push(pptObj.uuid);
          // virtualclass.vutil.sendOrder('presentation', virtualclass.orderList[virtualclass.currApp].ol.order);
          that.finallySendPptOrder(virtualclass.orderList[virtualclass.currApp].ol.order);
          virtualclass.sharePt.getPptList();
          virtualclass.serverData.syncComplete = false;
          virtualclass.serverData.syncAllData().then(() => {
            virtualclass.sharePt.awsPresentationList(virtualclass.serverData.rawData.ppt);
          });
          // that.fetchAllData();

          // // TODO, Critical this need be re-enable
          // virtualclass.videoUl.xhrOrderSend(virtualclass.videoUl.order);
        });
      },

      // fetchAllData() {
      //   virtualclass.serverData.fetchAllData(() => {
      //     virtualclass.sharePt.awsPresentationList(virtualclass.serverData.rawData.ppt);
      //   });
      // },

      awsPresentationList(ppts) {
        virtualclass.sharePt.ppts = [];
        virtualclass.sharePt.ppts = ppts;

        const db = document.querySelector('#SharePresentationDashboard .dbContainer');
        if (db == null) {
          document.querySelector('#SharePresentationDashboard').innerHTML = virtualclass.vutil.getPptDashBoard('SharePresentation');
          virtualclass.sharePt.attachEvent('submitpurl', 'click', virtualclass.sharePt.initNewPpt);
        }

        virtualclass.sharePt.createPageModule();
        virtualclass.sharePt.showPpts();
        virtualclass.vutil.requestOrder((response) => {
          if (virtualclass.vutil.isResponseAvailable(response)) {
            // virtualclass.orderList[virtualclass.currApp].ol.order = response;
            if (virtualclass.orderList[virtualclass.currApp].ol.order
              && virtualclass.orderList[virtualclass.currApp].ol.order.length > 0) {
              virtualclass.sharePt.reArrangeElements(virtualclass.orderList[virtualclass.currApp].ol.order);
            }
          }
        });

        // virtualclass.sharePt.retrieveOrder();



        // console.log(videos);
        // virtualclass.videoUl.videos = videos;

        // virtualclass.videoUl.allPages = content;
        // var type = "video";
        // var firstId = "congrea" + type + "ContBody";
        // var secondId = "congreaShareVideoUrlCont";
        // var elemArr = [firstId, secondId];
        // virtualclass.videoUl.showVideos(videos);
        // virtualclass.videoUl.retrieveOrder();
      },

      afterPptSaved(pptObj) {
        const idPostfix = pptObj.fileuuid;
        // var docId = 'docs' + doc;

        if (Object.prototype.hasOwnProperty.call(pptObj, 'disabled')) {
          pptObj.status = 0;
        } else {
          pptObj.status = 1;
        }

        const shareppt = 'virtualclassSharePresentation';
        this.pages[idPostfix] = new virtualclass.page('pptListContainer', 'ppt', shareppt, 'sharePt', pptObj.status);
        this.pages[idPostfix].init(idPostfix, pptObj.URL);
        this.pptClickHandler(pptObj);
        const ppt = document.getElementById(`linkppt${pptObj.fileuuid}`);
        const titleCont = document.getElementById(`pptTitle${pptObj.fileuuid}`);
        const title = this.extractTitle(pptObj.URL);

        if (titleCont) {
          if (title) {
            titleCont.innerHTML = title;
          } else {
            let ul = pptObj.URL;
            ul = `https:${ul}`;
            const urlPattern = /^(?:https?:\/\/)?(?:w{3}\.)?([a-z\d\.-]+)\.(?:[a-z\.]{2,10})(?:[/\w\.-]*)*/;
            const domainPattern = ul.match(urlPattern);
            const extractDomain = domainPattern[1];

            titleCont.innerHTML = extractDomain;
          }
        }
        titleCont.setAttribute('data-toogle', 'tooltip');
        titleCont.setAttribute('data-placement', 'bottom');
        titleCont.setAttribute('title', pptObj.URL);

        if (Object.prototype.hasOwnProperty.call(pptObj, 'disabled')) {
          this.disable(pptObj.fileuuid);
          if (ppt) {
            ppt.classList.add('disable');
          }
        } else {
          this.enable(pptObj.fileuuid);
          if (ppt) {
            ppt.classList.add('enable');
          }
        }
        if (virtualclass.sharePt.currId === pptObj.fileuuid) {
          ppt.classList.add('playing');
        }
      },
      extractTitle(url) {
        let title;
        if (url.indexOf('//') > -1) {
          title = url.split('/')[4];
        } else {
          title = url.split('/')[2];
        }

        return title;
      },
      pptClickHandler(pptObj) {
        const ppt = document.getElementById(`mainpppt${pptObj.fileuuid}`);
        if (ppt) {
          ppt.addEventListener('click', () => {
            virtualclass.sharePt.playPptUrl(pptObj.URL, pptObj.fileuuid);
            virtualclass.dashboard.close();
            virtualclass.sharePt.currId = pptObj.fileuuid;
            virtualclass.sharePt.activePrs(pptObj.fileuuid);
          });
        }
      },
      activePrs(id) {
        const otherElems = document.querySelectorAll('#virtualclassCont.congrea .linkppt');
        for (let i = 0; i < otherElems.length; i++) {
          if (otherElems[i].classList.contains('playing')) {
            otherElems[i].classList.remove('playing');
          }
        }

        const currentPpt = document.querySelector(`#virtualclassCont.congrea #linkppt${id}`);
        if (currentPpt && !currentPpt.classList.contains('playing')) {
          currentPpt.classList.add('playing');
        }
      },

      disable(_id) {
        const ppt = document.getElementById(`mainpppt${_id}`);
        ppt.style.opacity = 0.3;
        ppt.style.pointerEvents = 'none';

        const link = document.querySelector(`#linkppt${_id}`);
        if (link.classList.contains('enable')) {
          link.classList.remove('enable');
        }
        link.classList.add('disable');


        if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
          virtualclass.sharePt.ppts.forEach((elem, i) => {
            if (elem.fileuuid === _id) {
              elem.disabled = 0;
              elem.status = 0;
            }
          });
        }
      },

      /*
       * to enable  ppt in the pptlist
       */
      enable(_id) {
        const link = document.querySelector(`#linkppt${_id}`);
        if (link.classList.contains('disable')) {
          link.classList.remove('diable');
        }
        link.classList.add('enable');


        const ppt = document.getElementById(`mainpppt${_id}`);
        if (ppt) {
          ppt.style.opacity = 1;
          ppt.style.pointerEvents = 'auto';
          if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
            virtualclass.sharePt.ppts.forEach((elem, i) => {
              if (elem.fileuuid === _id) {
                delete (elem.disabled);
                elem.status = 1;
              }
            });
          }
        }
      },

      getPptList() {
        if (virtualclass.gObj.fetchedData) {
          virtualclass.sharePt.awsPresentationList(virtualclass.serverData.rawData.ppt);
        } else {
          // this.fetchAllData();
          virtualclass.serverData.syncAllData().then(() => {
            virtualclass.sharePt.awsPresentationList(virtualclass.serverData.rawData.ppt);
          });
        }
      },

      showPpts() {
        // var list = document.getElementById("videoList");
        const elem = document.getElementById('listppt');
        if (elem) {
          for (let i = 0; i < elem.childNodes.length - 1; i++) {
            elem.childNodes[i].parentNode.removeChild(elem.childNodes[i]);
          }
        }

        if (virtualclass.sharePt.ppts && virtualclass.sharePt.ppts.length) {
          virtualclass.sharePt.activeppts = [];
          virtualclass.sharePt.ppts.forEach((pptObj, i) => {
            if (!Object.prototype.hasOwnProperty.call(pptObj, 'deleted')) {
              virtualclass.sharePt.activeppts.push(pptObj);
              const elem = document.querySelector(`#linkppt${pptObj.fileuuid}`);
              if (elem != null) {
                elem.classList.remove('noPpt');
              }
              virtualclass.sharePt.afterPptSaved(pptObj);
            }
            // virtualclass.sharePt.afterPptSaved(pptObj);
          });

          if (virtualclass.config.makeWebSocketReady) {
            this.finallySendPptOrder(virtualclass.orderList[virtualclass.currApp].ol.order);
          }
          // virtualclass.vutil.sendOrder('presentation', virtualclass.orderList[virtualclass.currApp].ol.order);
        }

        const slide = document.querySelector('.congrea #pptiframe');
        if (slide && slide.getAttribute('src')) {
          virtualclass.vutil.showFinishBtn();
        }

        // todo to verify this
        // virtualclass.vutil.makeElementDeactive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
        virtualclass.vutil.makeElementActive('#listvideo');
      },

      retrieveOrder() {
        const rdata = new FormData();
        rdata.append('live_class_id', virtualclass.gObj.congCourse);
        rdata.append('content_order_type', '3');
        this.requestOrder(rdata);
      },

      requestOrder(rdata) {
        virtualclass.vutil.requestOrder((data) => {
          // console.log(data);
          if (virtualclass.vutil.isResponseAvailable(data)) {
            // virtualclass.orderList[virtualclass.currApp].ol.order = data;
            if (virtualclass.orderList[virtualclass.currApp].ol.order.length > 0) {
              virtualclass.sharePt.reArrangeElements(virtualclass.orderList[virtualclass.currApp].ol.order);
            }
          }
        });
      },

      playPptUrl(vUrl, pptId) {
        virtualclass.sharePt.autoSlideTime = 0;
        virtualclass.sharePt.autoSlideFlag = 0;
        // virtualclass.sharePt.localStoragFlag = 0;
        virtualclass.sharePt.startFromFlag = 0;

        virtualclass.sharePt.eventsObj = [];
        virtualclass.sharePt.state = { indexh: 0, indexv: 0, indexf: 0 };
        virtualclass.sharePt.stateLocalStorage = {};

        localStorage.removeItem('autoSlideTime');
        localStorage.removeItem('autoSlideFlag');

        const iframecontainer = document.getElementById('iframecontainer');
        if (iframecontainer == null) {
          // console.log('call of iframe creater from onclick event handler');
          virtualclass.sharePt.UI.createIframe();
        }

        const pptContainer = document.getElementById(virtualclass.sharePt.UI.id);
        if (!pptContainer.classList.contains('pptSharing')) {
          pptContainer.classList.add('pptSharing');
        }
        virtualclass.sharePt.setPptUrl(vUrl, pptId);
      },
      /*
       * Removes unnessary characters from the entered url, url copied from slides.com may contain hash
       * @param hashedUrl url entered by the user
       */
      cleanupUrl(hashedUrl) {
        let url = hashedUrl;
        const hashPos = url.search('#');
        if (hashPos > 0) {
          url = url.slice(0, hashPos);
        }
        return url;
      },
      /*
       * Assign frame's src as the url of the slide
       * @param urlValue of the slide to be set in appropriate format
       */
      setPptUrl(urlValue, pptId) {
        console.log('===> ppt share ', urlValue);
        // console.log('test+set ppt url function');
        const elem = document.getElementById('iframecontainer');
        elem.style.display = 'block';

        const frame = document.getElementById('pptiframe');
        // console.log(`completeurl${urlValue}`);
        // console.log('====> PPT SLIDE POST');
        virtualclass.sharePt.pptUrl = `${urlValue}?postMessage=true&postMessageEvents=true`;

        frame.setAttribute('src', virtualclass.sharePt.pptUrl);
        ioAdapter.mustSend({
          pptMsg: 'displayframe', cf: 'ppt', user: 'all', cfpt: 'displayframe',
        });
        ioAdapter.mustSend({
          pptMsg: urlValue, cf: 'ppt', user: 'all', cfpt: 'setUrl', pptId,
        });
        frame.style.display = 'visible';

        const btn = document.querySelector('.congrea  #dashboardContainer .modal-header button.enable');
        if (!btn) {
          virtualclass.vutil.showFinishBtn();
        }
        virtualclass.sharePt.currId = pptId;
        virtualclass.userInteractivity.makeReadyContext();
      },
      /*
       * Validate url
       * @param str url to validate
       */
      validURLWithDomain(str) {
        return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
        // var regex = /((http|https)?:\/\/)?(slides.com)\/{1,255}\s*/;
        // return regex.test(str);
      },
      /*
       * adding embed and https if not present in the url
       * @param str completing the url
       */
      completeUrl(str) {
        if (str.search('slides.com') > 0 && str.search('embed') < 0) {
          str += '/embed';
        }
        return str;
      },


      /*
       * extract url from the complete iframe text
       * @param str complete embedded iframe text is entered in the textbox
       */

      extractUrl(str) {
        if (str.search('src') > 0) {
          const pos = str.match(/"(.*?)"/);
          if (pos.length > 0) {
            return JSON.parse(pos[0]);
          }
        }
        return str;
      },

      /*
       * if entered url is an ip address return true else return false
       * @param str to check for an ip
       */
      isUrlip(str) {
        // removing // from url
        str.slice(0, 2);
        return (/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(str));
      },
      /*
       * Save the previous  objet in the localstorag on page refresh
       * @param prvAppObj previous object it shareppt object
       */
      saveIntoLocalStorage(prvAppObj) {
        // if (this.validURLWithDomain(prvAppObj.metaData.init) || this.isUrlip(prvAppObj.metaData.init)) {
        //   localStorage.setItem('prevApp', JSON.stringify(prvAppObj));
        //   console.log('ppt_state', prvAppObj.metaData.startFrom);
        //   localStorage.setItem('ppt_state', JSON.stringify(prvAppObj.metaData.startFrom));
        //   console.log('savinlocal');
        //
        //   localStorage.setItem('pptUrl', JSON.stringify(prvAppObj.metaData.init));
        //   localStorage.setItem('autoSlideTime', JSON.stringify(virtualclass.sharePt.autoSlideTime));
        //   localStorage.setItem('autoSlideFlag', JSON.stringify(virtualclass.sharePt.autoSlideFlag));
        // }
      },
      initTeacherLayout() {
        const frame = document.getElementById('pptiframe');
        if (document.getElementById('pptiframe') != null) {
          const configValues = {
            controls: true, keyboard: true, progress: true, touch: true,
          };
          let autoSlideTime;

          if (virtualclass.sharePt.autoSlideTime && virtualclass.sharePt.autoSlideFlag) {
            autoSlideTime = virtualclass.sharePt.autoSlideTime;
          } else if (virtualclass.sharePt.autoSlideFlag) {
            autoSlideTime = 6000;
          }

          if (typeof autoSlideTime !== 'undefined' && autoSlideTime > 1000) {
            configValues.autoSlide = autoSlideTime;
          }

          // console.log('====> PPT SLIDE POST');

          // frame.contentWindow.postMessage(JSON.stringify({method: "configure", args: [{controls: true,keyboard:true,progress:true,touch:true}]}), '*');
          frame.contentWindow.postMessage(JSON.stringify({ method: 'configure', args: [configValues] }), '*');
          frame.contentWindow.postMessage(JSON.stringify({ method: 'toggleAutoSlide' }), '*');
        }
        const pptMessageLayout = document.getElementById('pptMessageLayout');
        if (pptMessageLayout != null) {
          pptMessageLayout.style.display = 'none';
        }
        // virtualclass.sharePt.UI.createUrlContainer();
        if (document.getElementById('urlcontainer')) {
          document.getElementById('urlcontainer').style.display = 'block';
        }

        virtualclass.sharePt.eventsObj = [];
      },


      initStudentLayout() {
        const frame = document.getElementById('pptiframe');
        virtualclass.sharePt.eventsObj = [];
        virtualclass.sharePt.UI.messageDisplay();


        if (document.getElementById('pptiframe') != null) {
          if (frame.src) {
            virtualclass.sharePt.hideElement('pptMessageLayout');
          }
          // console.log('====> PPT SLIDE POST');
          frame.contentWindow.postMessage(JSON.stringify({
            method: 'configure',
            args: [{
              controls: false,
              autoSlide: 0,
              autoSlideStoppable: true,
              keyboard: false,
              progress: false,
              touch: false,
            }],
          }), '*');
        } else {
          virtualclass.sharePt.displayElement('pptMessageLayout');
        }
        virtualclass.sharePt.hideElement('urlcontainer');
      },


      hideElement(id) {
        const element = document.getElementById(id);
        if (element != null) {
          element.style.display = 'none';
        }
      },

      displayElement(id) {
        const element = document.getElementById(id);
        if (element != null) {
          element.style.display = 'block';
        }
      },


      attachEvent(id, eventName, handler) {
        const elem = document.getElementById(id);
        if (elem != null) {
          elem.addEventListener(eventName, handler);
        }
      },
      attachMessageEvent(eventName, messageHandler) {
        window.addEventListener(eventName, messageHandler);
      },

      UI: {
        id: 'virtualclassSharePresentation',
        class: 'virtualclass',
        /*
         * Creates container for the ppt
         */
        container() {
          const control = !!roles.hasControls();
          const data = { control };
          const template = virtualclass.getTemplate('ppt', 'ppt');
          // $('#virtualclassAppLeftPanel').append(template(data));
          virtualclass.vutil.insertAppLayout(template(data));
          // var btn = document.querySelector("#virtualclassCont #pptuploadContainer #submitpurl");
          // btn.addEventListener('click',function(){
          //     virtualclass.sharePt.initNewPpt();
          // })
        },
        /*
         *
         * Creates iframecontainer and iframe for the ppt
         */
        createIframe() {
          const ct = document.getElementById('iframecontainer');
          if (ct != null) {
            ct.parentNode.removeChild(ct);
          }

          const template = virtualclass.getTemplate('pptiframe', 'ppt');


          const pptCont = document.querySelector('#virtualclassSharePresentation');
          pptCont.insertAdjacentHTML('beforeend', template());
          // $('#virtualclassSharePresentation').append(template)
        },


        /*
         *
         * display message on student's screen that ppt is going to be shared
         */
        messageDisplay() {
          const msg = document.getElementById('pptMessageLayout');
          if (msg) {
            msg.parentNode.removeChild(msg);
          }

          const template = virtualclass.getTemplate('mszdisplay', 'ppt');
          const pptCont = document.querySelector('#virtualclassSharePresentation');
          pptCont.insertAdjacentHTML('beforeend', template());
        },

        removeIframe() {
          const elem = document.getElementById('pptiframe');
          if (elem) {
            elem.parentNode.removeChild(elem);
          }
        },

      },

      remvovePLayClass() {
        const listPpt = document.querySelector('#listppt .playing');
        if (listPpt !== null) {
          listPpt.classList.remove('playing');
        }
      },
    };
  };
  window.sharePt = sharePt;
}(window));
