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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 28);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class AudioStore {

  constructor() {
    this.createFilterNode = (context, frequency, ql, gainValue) => {
      var filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = frequency;
      filter.gain.value = gainValue;
      filter.Q.value = ql;
      return filter;
    };

    this.createPannerNode = (context, pan) => {
      var pannerNode = context.createStereoPanner();
      pannerNode.pan.value = pan;
      return pannerNode;
    };

    this.createDelayNode = (context, time) => {
      var delayNode = context.createDelay();
      delayNode.delayTime.value = time;
      return delayNode;
    };

    this.createGainNode = (context, val) => {
      var gainNode = context.createGain();
      gainNode.gain.value = val;
      return gainNode;
    };

    this.context = new AudioContext();
    this.filt = this.createFilterNode(this.context, 333.25, 13.5, 12);
    this.panner = this.createPannerNode(this.context, -0.43);
    this.delay = this.createDelayNode(this.context, 0.125);
    this.feedback = this.createGainNode(this.context, 0.35);
  }

}
exports.default = AudioStore;

/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _audiostore = __webpack_require__(1);

var _audiostore2 = _interopRequireDefault(_audiostore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.chrome.runtime.onMessage.addListener(msg => {

  // var audio = new AudioStore()

  // const { context,filt,panner,delay,feedback } = audio
  // const constraints = {
  //     audio : true,
  //     video : false 
  // }
  console.log("tabCapture", msg);

  // tabCapture.capture(constraints, (stream)  => {
  //   var source = context.createMediaStreamSource(stream);
  //   source.connect(filt)
  //   .connect(panner) 
  //   .connect(delay).connect(feedback).connect(delay)
  //   .connect(context.destination); 
  // });
});

/***/ })

/******/ });