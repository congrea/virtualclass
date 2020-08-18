/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/ogv-support.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/classCallCheck.js":
/*!***************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/classCallCheck.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _classCallCheck(instance, Constructor) {\n  if (!(instance instanceof Constructor)) {\n    throw new TypeError(\"Cannot call a class as a function\");\n  }\n}\n\nmodule.exports = _classCallCheck;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/classCallCheck.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/createClass.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/createClass.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _defineProperties(target, props) {\n  for (var i = 0; i < props.length; i++) {\n    var descriptor = props[i];\n    descriptor.enumerable = descriptor.enumerable || false;\n    descriptor.configurable = true;\n    if (\"value\" in descriptor) descriptor.writable = true;\n    Object.defineProperty(target, descriptor.key, descriptor);\n  }\n}\n\nfunction _createClass(Constructor, protoProps, staticProps) {\n  if (protoProps) _defineProperties(Constructor.prototype, protoProps);\n  if (staticProps) _defineProperties(Constructor, staticProps);\n  return Constructor;\n}\n\nmodule.exports = _createClass;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/createClass.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/interopRequireDefault.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/interopRequireDefault.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _interopRequireDefault(obj) {\n  return obj && obj.__esModule ? obj : {\n    default: obj\n  };\n}\n\nmodule.exports = _interopRequireDefault;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/interopRequireDefault.js?");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/typeof.js":
/*!*******************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/typeof.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function _typeof2(obj) { if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof2(obj); }\n\nfunction _typeof(obj) {\n  if (typeof Symbol === \"function\" && _typeof2(Symbol.iterator) === \"symbol\") {\n    module.exports = _typeof = function _typeof(obj) {\n      return _typeof2(obj);\n    };\n  } else {\n    module.exports = _typeof = function _typeof(obj) {\n      return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : _typeof2(obj);\n    };\n  }\n\n  return _typeof(obj);\n}\n\nmodule.exports = _typeof;\n\n//# sourceURL=webpack:///./node_modules/@babel/runtime/helpers/typeof.js?");

/***/ }),

/***/ "./src/js/BogoSlow.js":
/*!****************************!*\
  !*** ./src/js/BogoSlow.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n/**\n * A quick CPU/JS engine benchmark to guesstimate whether we're\n * fast enough to handle 360p video in JavaScript.\n */\n\nfunction BogoSlow() {\n  var self = this;\n  var timer; // FIXME: avoid to use window scope here\n\n  if (window.performance && window.performance.now) {\n    timer = function timer() {\n      return window.performance.now();\n    };\n  } else {\n    timer = function timer() {\n      return Date.now();\n    };\n  }\n\n  var savedSpeed = null;\n\n  function run() {\n    var ops = 0;\n\n    var fibonacci = function fibonacci(n) {\n      ops++;\n\n      if (n < 2) {\n        return n;\n      } else {\n        return fibonacci(n - 2) + fibonacci(n - 1);\n      }\n    };\n\n    var start = timer();\n    fibonacci(30);\n    var delta = timer() - start;\n    savedSpeed = ops / delta;\n  }\n  /**\n   * Return a scale value of operations/sec from the benchmark.\n   * If the benchmark has already been run, uses a memoized result.\n   *\n   * @property {number}\n   */\n\n\n  Object.defineProperty(self, 'speed', {\n    get: function get() {\n      if (savedSpeed === null) {\n        run();\n      }\n\n      return savedSpeed;\n    }\n  });\n  /**\n   * Return the defined cutoff speed value for 'slow' devices,\n   * based on results measured from some test devices.\n   *\n   * @property {number}\n   */\n\n  Object.defineProperty(self, 'slowCutoff', {\n    get: function get() {\n      // 2012 Retina MacBook Pro (Safari 7)  ~150,000\n      // 2009 Dell T5500         (IE 11)     ~100,000\n      // iPad Air                (iOS 7)      ~65,000\n      // 2010 MBP / OS X 10.9    (Safari 7)   ~62,500\n      // 2010 MBP / Win7 VM      (IE 11)      ~50,000+-\n      //   ^ these play 360p ok\n      // ----------- line of moderate doom ----------\n      return 50000; //   v these play 160p ok\n      // iPad Mini non-Retina    (iOS 8 beta) ~25,000\n      // Dell Inspiron Duo       (IE 11)      ~25,000\n      // Surface RT              (IE 11)      ~18,000\n      // iPod Touch 5th-gen      (iOS 8 beta) ~16,000\n    }\n  });\n  /**\n   * Return the defined cutoff speed value for 'too slow' devices,\n   * based on results measured from some test devices.\n   *\n   * No longer used.\n   *\n   * @property {number}\n   * @deprecated\n   */\n\n  Object.defineProperty(self, 'tooSlowCutoff', {\n    get: function get() {\n      return 0;\n    }\n  });\n  /**\n   * 'Slow' devices can play audio and should sorta play our\n   * extra-tiny Wikimedia 160p15 transcodes\n   *\n   * @property {boolean}\n   */\n\n  Object.defineProperty(self, 'slow', {\n    get: function get() {\n      return self.speed < self.slowCutoff;\n    }\n  });\n  /**\n   * 'Too slow' devices aren't reliable at all\n   *\n   * @property {boolean}\n   */\n\n  Object.defineProperty(self, 'tooSlow', {\n    get: function get() {\n      return self.speed < self.tooSlowCutoff;\n    }\n  });\n}\n\nmodule.exports = BogoSlow;\n\n//# sourceURL=webpack:///./src/js/BogoSlow.js?");

/***/ }),

/***/ "./src/js/OGVCompat.js":
/*!*****************************!*\
  !*** ./src/js/OGVCompat.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nvar _classCallCheck2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ \"./node_modules/@babel/runtime/helpers/classCallCheck.js\"));\n\nvar _createClass2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/createClass */ \"./node_modules/@babel/runtime/helpers/createClass.js\"));\n\nvar _BogoSlow = _interopRequireDefault(__webpack_require__(/*! ./BogoSlow.js */ \"./src/js/BogoSlow.js\"));\n\nvar OGVCompat = new (\n/*#__PURE__*/\nfunction () {\n  function _class() {\n    (0, _classCallCheck2.default)(this, _class);\n    this.benchmark = new _BogoSlow.default();\n  }\n\n  (0, _createClass2.default)(_class, [{\n    key: \"hasTypedArrays\",\n    value: function hasTypedArrays() {\n      // emscripten-compiled code requires typed arrays\n      return !!window.Uint32Array;\n    }\n  }, {\n    key: \"hasWebAudio\",\n    value: function hasWebAudio() {\n      return !!(window.AudioContext || window.webkitAudioContext);\n    }\n  }, {\n    key: \"hasFlash\",\n    value: function hasFlash() {\n      if (navigator.userAgent.indexOf('Trident') !== -1) {\n        // We only do the ActiveX test because we only need Flash in\n        // Internet Explorer 10/11. Other browsers use Web Audio directly\n        // (Edge, Safari) or native playback, so there's no need to test\n        // other ways of loading Flash.\n        try {\n          var obj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');\n          return true;\n        } catch (e) {\n          return false;\n        }\n      }\n\n      return false;\n    }\n  }, {\n    key: \"hasAudio\",\n    value: function hasAudio() {\n      return this.hasWebAudio() || this.hasFlash();\n    }\n  }, {\n    key: \"isBlacklisted\",\n    value: function isBlacklisted(userAgent) {\n      // JIT bugs in old Safari versions\n      var blacklist = [/\\(i.* OS [6789]_.* like Mac OS X\\).* Mobile\\/.* Safari\\//, /\\(Macintosh.* Version\\/6\\..* Safari\\/\\d/];\n      var blacklisted = false;\n      blacklist.forEach(function (regex) {\n        if (userAgent.match(regex)) {\n          blacklisted = true;\n        }\n      });\n      return blacklisted;\n    }\n  }, {\n    key: \"isSlow\",\n    value: function isSlow() {\n      return this.benchmark.slow;\n    }\n  }, {\n    key: \"isTooSlow\",\n    value: function isTooSlow() {\n      return this.benchmark.tooSlow;\n    }\n  }, {\n    key: \"supported\",\n    value: function supported(component) {\n      if (component === 'OGVDecoder') {\n        return this.hasTypedArrays() && !this.isBlacklisted(navigator.userAgent);\n      }\n\n      if (component === 'OGVPlayer') {\n        return this.supported('OGVDecoder') && this.hasAudio() && !this.isTooSlow();\n      }\n\n      return false;\n    }\n  }]);\n  return _class;\n}())();\nvar _default = OGVCompat;\nexports.default = _default;\n\n//# sourceURL=webpack:///./src/js/OGVCompat.js?");

/***/ }),

/***/ "./src/js/ogv-support.js":
/*!*******************************!*\
  !*** ./src/js/ogv-support.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ \"./node_modules/@babel/runtime/helpers/interopRequireDefault.js\");\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nObject.defineProperty(exports, \"OGVCompat\", {\n  enumerable: true,\n  get: function get() {\n    return _OGVCompat.default;\n  }\n});\nexports.OGVVersion = void 0;\n\nvar _typeof2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/typeof */ \"./node_modules/@babel/runtime/helpers/typeof.js\"));\n\nvar _OGVCompat = _interopRequireDefault(__webpack_require__(/*! ./OGVCompat.js */ \"./src/js/OGVCompat.js\"));\n\n//\n// -- ogv-support.js\n// https://github.com/brion/ogv.js\n// Copyright (c) 2013-2019 Brion Vibber\n//\nvar OGVVersion = undefined;\nexports.OGVVersion = OGVVersion;\n\nif ((typeof window === \"undefined\" ? \"undefined\" : (0, _typeof2.default)(window)) === 'object') {\n  // 1.0-compat globals\n  window.OGVCompat = _OGVCompat.default;\n  window.OGVVersion = OGVVersion;\n}\n\n//# sourceURL=webpack:///./src/js/ogv-support.js?");

/***/ })

/******/ });