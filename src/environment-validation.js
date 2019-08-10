// This file is part of Vidyamantra - http:www.vidyamantra.com/
/** @Copyright 2014  Vidya Mantra EduSystems Pvt. Ltd.
 * @author  Suman Bogati <http://www.vidyamantra.com>
 * This file looks for the environmment support for the virtual claas and its apis
 */
(function (window) {
  var system = {
    /*
     * Initializing webRtc and browser
     * @return system object
     */
    init() {
      this.wbRtc = {};
      this.wbRtc.className = 'webrtcCont';
      this.mybrowser = {};
      return this;
    },
    // TODO function need to be revised
    isCanvasSupport(navigator, browserName, version) {
      // console.log('is canvas support');
      // console.log(navigator);
      // console.log(browserName);
      if (browserName == 'MSIE') {
        return version == 9;
      }
      return !(!window.CanvasRenderingContext2D);
    },
    /*
     * To check whether  webSocket is supported  or not
     *
     */
    // TODO parameter passed are not being used
    isWebSocketSupport(navigator, browser, version) {
      if (typeof window.WebSocket !== 'undefined' && (typeof window.WebSocket === 'function' || typeof window.WebSocket === 'object') && Object.prototype.hasOwnProperty.call(window.WebSocket, 'OPEN')) {
        return true;
      }
      return false;
    },
    /*
     * To check whether local storage is supported or not
     *
     */
    isLocalStorageSupport() {
      return (Storage !== void (0));
    },
    /*
     * to test for getUSerMedia support
     */
    // TODO browser and version is not being supported
    isGetUserMediaSupport(browser, version) {
      navigator.getUserMedia = (navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia);

      return !!(navigator.getUserMedia);
    },
    /*
     * Test for showned db support
     *
     */
    isIndexedDbSupport() {
      return !!((window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB));
    },
    /*
     * function to test  whether worker is supported or not
     *
     */
    isWorkerSupport() {
      return !!window.Worker;
    },
    /*
     * to test wheter audio api is supported
     */
    isAudioApiSupport() {
      return !!((window.AudioContext || window.webkitAudioContext));
    },
    /*
     * to check for typed aray support
     */
    isTypedArraySupport() {
      return !!('ArrayBuffer' in window);
    },
    /*
     *
     * @param bname browser name
     * @param bversion browser version
     */
    isScreenShareSupport(bname, bversion) {
      if (bname == 'Firefox') {
        return (bversion >= 34);
      } if (bname == 'Chrome') {
        return (bversion >= 39);
      }
      return false;
    },
    /*
     *
     * @param key: property of the object
     * @param value: value of the property
     */
    setValue(key, value) {
      this[key] = value;
    },
    /*
     * Setting the api properties to true or false based on whether they are supported
     * or not by the environment
     * @param bname browser name
     * @param bversion browser version
     */
    checkBrowserFunctions(bname, bversion) {
      this.setValue('canvas', this.isCanvasSupport());
      this.setValue('webSocket', this.isWebSocketSupport());
      this.setValue('getusermedia', this.isGetUserMediaSupport());
      this.setValue('indexeddb', this.isIndexedDbSupport());
      this.setValue('webworker', this.isWorkerSupport());
      this.setValue('webaudio', this.isAudioApiSupport());
      this.setValue('typedarray', this.isTypedArraySupport());
      this.setValue('screenshare', this.isScreenShareSupport(bname, bversion));
      this.setValue('localstorage', this.isLocalStorageSupport());
    },
    /*
     * Measuring the resolution of virtual class container
     * @param resolution : an object containing inner width and inner height of window
     */
    measureResoultion(resolution) {
      if (!Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'measureDimension')) {
        const element = document.getElementById('virtualclassCont');
        const offset = virtualclass.vutil.getElementOffset(element);
        const offsetLeft = offset.x;
        if (resolution.width < 1024) {
          var width = 1024 - (offsetLeft + 10);
        } else {
          var width = resolution.width - (offsetLeft + 350);
        }
        const height = resolution.height - (offset.y);
        virtualclass.gObj.measureDimension = { width, height };
      }
      return virtualclass.gObj.measureDimension;
    },


    /*
     * setting dimension of the application
     */
    setAppDimension(id, canvasWrapper) {
      return;
      const measureRes = this.measureResoultion({ width: window.innerWidth, height: window.innerHeight });

      // var mainWrapper =  document.getElementById('virtualclassCont');
      virtualclass.vutil.setContainerWidth(measureRes, virtualclass.currApp);
      if (virtualclass.currApp == 'Whiteboard' || virtualclass.currApp == 'DocumentSharing') {
        var id = virtualclass.gObj.currWb;
        if (typeof canvasWrapper !== 'undefined') {
          system.setCanvasWrapperDimension(measureRes, id);
        } else {
          system.setCanvasDimension(measureRes, id);
        }
      }
    },

    setDocCanvasDimension(width, height, id) {
      const elem = document.querySelector(`#canvas${id}`);
      if (elem != null) {
        elem.width = width;
        elem.height = height;
      }
    },

    /*   TODO, this funciton should be merged with, setCanvasWrapperDimension
     * Setting dimension of the canvas
     */
    setCanvasDimension(measureRes, id) {
      if (typeof virtualclass.wb[id] === 'object') {
        const { vcan } = virtualclass.wb[id];

        if (typeof vcan.main.canvas !== 'undefined') {
          const { canvas } = vcan.main;
          ctx = vcan.main.canvas.getContext('2d');
          canvas.width = measureRes.width;

          const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);

          canvasWrapper.style.width = `${canvas.width}px`;

          // for handle the scroll on whiteboard during the play mode
          const rHeight = (virtualclass.isPlayMode) ? 85 : 15;

          const toolWrapperHeight = (roles.hasControls() || roles.hasAdmin()) ? 100 : ((virtualclass.currApp == 'Whiteboard') ? rHeight + 30 : rHeight);
          canvas.height = measureRes.height - toolWrapperHeight;

          // canvas.parentNode.height = canvas.height + 'px';

          canvasWrapper.style.height = `${canvas.height - 30}px`;
          // console.log(`canvasWrapper height${canvasWrapper.style.height}`);

          // console.log(`canvas width ${canvas.width}`);
          // var element = document.getElementById('canvas');
          const offset = vcan.utility.getElementOffset(document.getElementById(`canvas${id}`));

          vcan.main.offset.x = offset.x;
          // console.log(`canvas offset x=${vcan.main.offset.x} canvas offset y=${offset.y}`);
        }
      }
    },

    /** Handle container dimension 1* */
    setCanvasWrapperDimension(measureRes, id) {
      // console.log('Width of canvas wrapper, not seeting ');
      return;
      const { vcan } = virtualclass.wb[id];
      if (typeof vcan.main.canvas !== 'undefined') {
        const { canvas } = vcan.main;
        let { width } = measureRes;

        const canvasWrapper = document.querySelector(`#canvasWrapper${virtualclass.gObj.currWb}`);

        let reduceWidth = 50;


        let reduceHeight = 40;
        if (virtualclass.currApp == 'Whiteboard') {
          reduceWidth = 40;
        } else if (!roles.hasControls() && (virtualclass.currApp == 'DocumentShare')) {
          reduceWidth = 0;
          reduceHeight = 50;
        }

        width -= reduceWidth;

        canvasWrapper.style.width = `${width}px`; // 37

        const rHeight = (virtualclass.isPlayMode) ? 85 : reduceHeight;

        let toolWrapperHeight = (roles.hasControls() || roles.hasAdmin()) ? 100 : rHeight;
        if (virtualclass.currApp == 'DocumentShare') {
          toolWrapperHeight += 40;
        }

        const canWrapperHeight = measureRes.height - (toolWrapperHeight + 20);

        // canvas wrapper height 1
        canvasWrapper.style.height = `${canWrapperHeight}px`;
        // console.log(`canvasWrapper width${canvasWrapper.style.width}`);
        // console.log(`canvasWrapper height${canvasWrapper.style.height}`);
      }
    },
    // TODO this function is not being invoked
    getResoultion(windowWidth) {
      const resolution = {};
      if (windowWidth < 1280) {
        resolution.width = 1024;
        resolution.height = 768;
      } else if (windowWidth >= 1280 && windowWidth < 1366) {
        resolution.width = 1280;
        resolution.height = 1024;
      } else if (windowWidth >= 1366 && windowWidth < 1920) {
        resolution.width = 1366;
        resolution.height = 768;
      } else if (windowWidth >= 1920) {
        resolution.width = 1920;
        resolution.height = 1080;
      }
      return resolution;
    },
    /*
     *Getting application support for the user and if there  are errors they will be pushed in an array error
     *@param user user role
     */
    reportBrowser(user) {
      const errors = this.getErrors(user);
      if (errors.length > 1) {
        virtualclass.error.push(`${errors.join(',')} are disabled in your browser.`);
      } else if (errors.length == 1) {
        virtualclass.error.push(`${errors} is disabled in your browser.`);
      }
    },
    /*
     * Test for the apis availability and if test fails corresponding api error will be pused into an array called errors
     * @param user user role
     * @return errors : An array of generated errors if apis are not available
     */
    getErrors(user) {
      const errors = [];
      // webSocket to websocket
      const apis = ['canvas', 'webSocket', 'getusermedia', 'webaudio', 'indexeddb', 'localstorage', 'typedarray'];
      if (user == 't' || user == 'e') apis.push('webworker', 'screenshare');
      for (let i = 0; i < apis.length; i++) {
        if (!this[apis[i]]) {
          if (apis[i] == 'screenshare') {
            virtualclass.gObj.errNotScreenShare = true;
          }
          errors.push(virtualclass.lang.getString(`err${apis[i]}`));
        }
      }
      return errors;
    },
    /*
     * To check Whether the device is apple device
     * @return return apple device version
     */
    isiOSDevice() {
      const iOSVersion = parseFloat(
        (`${(/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1]}`)
          .replace('undefined', '3_2').replace('_', '.').replace('_', ''),
      ) || false;
      return iOSVersion;
    },
    /*
     * To test for the android device
     * @return return true if the device is android device
     */
    isAndroid() {
      const ua = navigator.userAgent.toLowerCase();
      return ua.indexOf('android') > -1;
    },

    isIPad() {
      return (/(iPad)/g.test(navigator.userAgent));
    },

    setBrowserDetails() {
      const iOS = this.isiOSDevice();
      this.device = 'desktop';
      if (iOS) {
        var bname = 'iOS';
        var bversion = iOS;
        this.device = 'mobTab';
      } else {
        const vendor = this.mybrowser.detection();
        var bname = vendor[0];
        var bversion = parseFloat(vendor[1]);
      }

      this.mybrowser.name = bname;
      this.mybrowser.version = bversion;
    },

    /*
     * to check for  the support of virtual class and it's api in  browsers and versions
     * for unsupported browsers virtual class will be disabled and erroe
     * will be generated
     *
     */
    check() {
      // TODO this should be normal
      const iOS = this.isiOSDevice();
      this.device = 'desktop';
      const addAttr = document.getElementById('virtualclassCont');

      if (iOS) {
        var bname = 'iOS';
        var bversion = iOS;
        this.device = 'mobTab';
      } else {
        var androidDevice = this.isAndroid();
        const vendor = this.mybrowser.detection();
        var bname = vendor[0];
        var bversion = parseFloat(vendor[1]);
      }

      this.mybrowser.name = bname;
      this.mybrowser.version = bversion;

      this.checkBrowserFunctions(bname, bversion);
      if ((typeof androidDevice !== 'undefined' && androidDevice)) {
        this.device = 'mobTab';
        addAttr.setAttribute('device', 'mobile');
        addAttr.classList.add('android');

        if (androidDevice) {
          if (bname == 'Chrome') {
            if (bversion < 40) {
              virtualclass.error.push(virtualclass.error.push(virtualclass.lang.getString('chFireBrowsersIssue', [bname, bversion])));
              virtualclass.vutil.initDisableVirtualClass();
            } else if (bversion >= 40 && bversion < 67) {
              //     DO : Disable Audio Controls and Cam Support for this user
              virtualclass.vutil.initDisableAudVid();
            }
          } else {
            virtualclass.error.push(virtualclass.error.push(virtualclass.lang.getString('chFireBrowsersIssue', [bname, bversion])));

            virtualclass.vutil.initDisableVirtualClass();
          }
        }
      } else if ((bname == 'Chrome' && bversion >= 40) || (bname == 'Firefox' && bversion >= 35)
        || (roles.isStudent() && bname == bversion < 'OPR' >= 26)) {
        this.reportBrowser(virtualclass.gObj.uRole);
      } else if ((bname == 'Chrome' && bversion < 40) || (bname == 'Firefox' && bversion < 35)
        || (roles.isStudent() && bname == 'OPR' && bversion < 26)) {
        this.reportBrowser(virtualclass.gObj.uRole);

        virtualclass.error.push(virtualclass.lang.getString('chFireBrowsersIssue', [bname, bversion]));
      } else if (bname == 'OPR' && bversion >= 26) {
        this.reportBrowser(virtualclass.gObj.uRole);
        if (roles.hasControls()) {
          virtualclass.error.push(virtualclass.lang.getString('operaBrowserIssue', [bname, bversion]));
        }
      } else if (bname == 'SafarisupportedOld') {
        if (bversion >= 8) {
          if (roles.hasControls()) {
            virtualclass.vutil.initDisableVirtualClass();
            virtualclass.error.push(virtualclass.lang.getString('teacherSafariBrowserIssue', [bname, bversion]));
          } else {
            virtualclass.vutil.initDisableAudVid();
            virtualclass.error.push(virtualclass.lang.getString('studentSafariBrowserIssue', [bname, bversion]));
            virtualclass.user.control.mediaWidgetDisable();
          }
        } else {
          virtualclass.vutil.initDisableVirtualClass();
          virtualclass.error.push(virtualclass.lang.getString('safariBrowserIssue', [bname, bversion]));
        }

        // DO : Disable Audio Controls and Cam Support for this user.
      } else if (bname == 'iOS') {
        addAttr.setAttribute('device', 'mobile');
        addAttr.classList.add('ios');
        // var iPad = /(iPad)/g.test(navigator.userAgent);
        if (this.isIPad()) {
          if (roles.isStudent()) {
            if (bversion >= 8) {
              // console.log('do nothing');
              // var audioWrapper = document.getElementById('audioWidget');
              // audioWrapper.parentNode.insertBefore(iosAudTrigger, audioWrapper.nextSibling);
            } else {
              virtualclass.vutil.initDisableVirtualClass();
              virtualclass.error.push(virtualclass.lang.getString('ios7support'));
            }
          } else {
            // virtualclass.vutil.initDisableVirtualClass();
            // virtualclass.error.push(virtualclass.lang.getString('supportDesktop'));
          }
        } else {
          // virtualclass.vutil.initDisableVirtualClass();
          // virtualclass.error.push(virtualclass.lang.getString('notSupportIphone'));
        }
        // here bversion is version of operating system
        // we have to disable the audio compability
      } else {
        if (this.mybrowser.detectIE()) {
          virtualclass.gObj.errIE = true;
          virtualclass.error.push(virtualclass.lang.getString('ieBrowserIssue'));
          virtualclass.vutil.initDisableVirtualClass();
        } else {
          //  virtualclass.error.push(virtualclass.lang.getString('commonBrowserIssue', [bname, bversion]));
          //  virtualclass.vutil.initDisableVirtualClass();
        }
        //                    virtualclass.error.push( bname +  ' ' + bversion + ' ' + virtualclass.lang.getString('commonBrowserIssue'));
      }
    },


    mediaDevices: {
      webcamErr: [],
      async getMediaDeviceInfo() {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          // Firefox 38+ seems having support of enumerateDevicesx
          navigator.enumerateDevices = async function () {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices;
          };
        }

        let MediaDevices = [];
        const isHTTPs = location.protocol === 'https:';
        let canEnumerate = false;

        if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
          canEnumerate = true;
        } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
          canEnumerate = true;
        }

        this.hasMicrophone = false;
        this.hasSpeakers = false;
        this.hasWebcam = false;

        let isMicrophoneAlreadyCaptured = false;
        let isWebcamAlreadyCaptured = false;

        const that = this;

        if (!canEnumerate) {
          return;
        }

        if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
          navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
        }

        if (!navigator.enumerateDevices && navigator.enumerateDevices) {
          navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
        }

        if (!navigator.enumerateDevices) {
          if (callback) {
            callback();
          }
          return;
        }

        MediaDevices = [];
        let devices;
        try {
          devices = await navigator.enumerateDevices();
        } catch (err) {
          // console.log(err);
        }


        devices.forEach((_device) => {
          const device = {};
          for (const d in _device) {
            device[d] = _device[d];
          }

          if (device.kind === 'audio') {
            device.kind = 'audioinput';
          }

          if (device.kind === 'video') {
            device.kind = 'videoinput';
          }

          let skip;
          MediaDevices.forEach((d) => {
            if (d.id === device.id && d.kind === device.kind) {
              skip = true;
            }
          });

          if (skip) {
            return;
          }

          if (!device.deviceId) {
            device.deviceId = device.id;
          }

          if (!device.id) {
            device.id = device.deviceId;
          }

          if (!device.label) {
            device.label = 'Please invoke getUserMedia once.';
            if (!isHTTPs) {
              device.label = `HTTPs is required to get label of this ${device.kind} device.`;
            }
          } else {
            if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
              isWebcamAlreadyCaptured = true;
            }

            if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
              isMicrophoneAlreadyCaptured = true;
            }
          }

          if (device.kind === 'audioinput') {
            that.hasMicrophone = true;
          }

          if (device.kind === 'audiooutput') {
            that.hasSpeakers = true;
          }

          if (device.kind === 'videoinput') {
            that.hasWebcam = true;
          }
          // there is no 'videoouput' in the spec.
          MediaDevices.push(device);
        });
      },
    },

    webpInit() {
      virtualclass.modernizr.on('webp', (result) => {
        if (virtualclass.system.mybrowser.name === 'Firefox' || virtualclass.system.mybrowser.name === 'Edge') {
          virtualclass.system.webpSupport = false;
        } else {
          virtualclass.system.webpSupport = !!(result);
        }
      });
    },

    initResize() {
      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'measureDimension')) {
        delete virtualclass.gObj.measureDimension;
      }

      if (Object.prototype.hasOwnProperty.call(virtualclass.gObj, 'initResize')) {
        clearTimeout(virtualclass.gObj.initResize);
      }

      virtualclass.gObj.initResize = setTimeout(() => {
        virtualclass.vutil.addClass('virtualclassCont', 'resizeWindow');
        system.setAppDimension(null, 'resize');
        virtualclass.view.window.resize();
      }, 50);
    },

    _initResize() {
      virtualclass.vutil.addClass('virtualclassCont', 'resizeWindow');
      system.setAppDimension(null, 'resize');
      virtualclass.view.window.resize();
    },
  };

  system = system.init();
  // There could be the problem
  // TODO two event listener for the same event resize
  window.addEventListener('resize',
    () => {
      system.initResize();
    });


  // TODO this function is not being invoked
  system.mybrowser.detectIE = function () {
    const ua = window.navigator.userAgent;

    const msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    const trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      const rv = ua.indexOf('rv:');
      return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    const edge = ua.indexOf('Edge/');
    if (edge >= 17) {
      // IE 12 => return version number
      // We are supporting on edge 17 or higher
      return false;
    }
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);


    // other browser
    return false;
  },

  // TODO this function is not being invoked
  system.mybrowser.detection = function () {
    /**  The code is taking from
       https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser/5916928
       answered by Brandon
       * */

    let browser;
    const ua = navigator.userAgent; let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      browser = { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        browser = { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
      browser = { name: M[0], version: M[1] };
    }
    if (typeof browser !== 'undefined') {
      return [browser.name, browser.version];
    }
    return M;
  };

  system.isCompatibleCPU = function () {
    if (window.navigator.hardwareConcurrency) {
      return !(window.navigator.hardwareConcurrency < 4);
    }
    return true;
  };

  system.isCompatibleRAM = function () {
    if (window.navigator.deviceMemory) {
      return !(window.navigator.deviceMemory < 6);
    }
    return true;
  };


  window.system = system;
}(window));
