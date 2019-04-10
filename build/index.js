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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
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
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _store = __webpack_require__(5);

var _store2 = _interopRequireDefault(_store);

var _audiostore = __webpack_require__(1);

var _audiostore2 = _interopRequireDefault(_audiostore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const store = new _store2.default();
const audio = new _audiostore2.default();
const { context, filt, panner, delay, feedback } = audio;

const capture = tab => {
  chrome.tabs.captureVisibleTab(null, { format: 'png' }, imageUrl => {
    var option = {
      type: 'songkranizer:load',
      imageUrl: imageUrl,
      shader: store.getActiveShader()
    };
    chrome.tabs.sendMessage(tab.id, option);
  });
};

const constraints = {
  audio: true,
  video: false
};

const captureCurrentTab = () => {
  console.log('reqeusted current tab');
  chrome.tabs.query({ active: true }, function (tab) {
    console.log('got current tab');

    chrome.tabCapture.capture({
      audio: true,
      video: false
    }, handleCapture);
  });
};

chrome.browserAction.onClicked.addListener(activeTab => {

  capture(activeTab);
  chrome.tabs.executeScript(activeTab.id, { file: 'content.js' });

  chrome.tabCapture.capture(constraints, stream => {
    if (!stream) {
      console.error('Couldn\'t obtain stream.', context);
      return;
    }

    var source = context.createMediaStreamSource(stream);
    source.connect(filt).connect(panner).connect(delay).connect(feedback).connect(delay).connect(context.destination);
  });

  // chrome.tabs.query({audible:true},(tab) => {

  //   console.log("tab", tab)
  //   if(tab.length > 0){
  //     chrome.tabCapture.getMediaStreamId({ targetTabId:tab[0].id }, (streamId) => {
  //       console.log("streamId", streamId)
  //     })
  //   }
  //     var option = {
  //       type: 'audio enabled!',
  //       tabCapture: window.chrome.tabCapture
  //     }
  //   chrome.tabs.sendMessage(tab[0].id, option);
  //   chrome.tabs.executeScript(tab[0].id,{ file: 'audiocontent.js'});
  // })
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _constants = __webpack_require__(6);

/* @flow */
const prefix = '____SONGKRANIZER____';


const DEFAULT_SHADERS = { '0': _constants.DEFAULT_SHADER };

class Store {
  constructor() {
    const shaders = this._get('shaders');
    if (!shaders) {
      this._set('shaders', DEFAULT_SHADERS);
    }

    const activeShaderId = this._get('activeShaderId');
    if (activeShaderId == null) {
      this._set('activeShaderId', _constants.DEFAULT_SHADER.id);
    }
  }

  getShaders() {
    return this._get('shaders') || DEFAULT_SHADERS;
  }

  getActiveShader() {
    const shaders = this.getShaders();
    const activeShaderId = this._get('activeShaderId') || _constants.DEFAULT_SHADER.id;
    return shaders[activeShaderId];
  }

  save(shader) {
    const shaders = this.getShaders();
    this._set('shaders', _extends({}, shaders, {
      [shader.id]: shader
    }));
  }

  delete(shader) {
    const shaders = this._get('shaders') || {};

    delete shaders[shader.id];
    if (Object.keys(shaders).length === 0) {
      shaders[_constants.DEFAULT_SHADER.id] = _constants.DEFAULT_SHADER;
    }
    this._set('shaders', shaders);

    const activeShaderId = this._get('activeShaderId');
    if (activeShaderId === shader.id) {
      this._set('activeShaderId', _constants.DEFAULT_SHADER.id);
    }
  }

  useThis(shader) {
    this._set('activeShaderId', shader.id);
  }

  _get(key) {
    try {
      const item = localStorage.getItem(prefix + key);
      if (item) {
        return JSON.parse(item);
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  _set(key, value) {

    try {
      localStorage.setItem(prefix + key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }
}
exports.default = Store;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const DEFAULT_SHADER_CODE = exports.DEFAULT_SHADER_CODE = __webpack_require__(7);
const DEFAULT_SHADER = exports.DEFAULT_SHADER = {
  id: '0',
  name: 'Songkranizer',
  code: DEFAULT_SHADER_CODE,
  blend: 'multiply'
};

const EMPTY_SHADER_CODE = exports.EMPTY_SHADER_CODE = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D image;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = 1. - texture2D(image, uv);
}
`.trim();

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "precision mediump float;\nuniform float time;\nuniform vec2 resolution;\nuniform sampler2D image;\nuniform sampler2D backbuffer;\n\n\n#define      PI 3.14159265358979323846264338327950288419716939937511 // mm pie\n#define     TAU 6.28318530717958647692528676655900576839433879875021 // pi * 2\n#define HALF_PI 1.57079632679489661923132169163975144209858469968755 // pi / 2\n\n// credits\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nfloat random(in vec2 p) {\n  return fract(sin(dot(p, vec2(5395.3242, 38249.2348))) * 248.24);\n}\n\nvec3 mod289(vec3 x) {\n    return x - floor(x * (1. / 289.)) * 289.;\n}\n\nvec2 mod289(vec2 x) {\n    return x - floor(x * (1. / 289.)) * 289.;\n}\n\nvec3 permute(vec3 x) {\n    return mod289(((x * 34.) + 1.) * x);\n}\n\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);\n  vec2 i  = floor(v + dot(v, C.yy) );\n  vec2 x0 = v -   i + dot(i, C.xx);\n  vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod289(i);\n  vec3 p = permute( permute( i.y + vec3(0., i1.y, 1. )) + i.x + vec3(0., i1.x, 1. ));\n  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);\n  m = m*m;\n  m = m*m;\n  vec3 x = 2. * fract(p * C.www) - 1.;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - .85373472095314 * ( a0*a0 + h*h );\n  vec3 g;\n  g.x  = a0.x  * x0.x  + h.x  * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130. * dot(m, g);\n}\n\nvec2 pq(vec2 uv) {\n  return vec2(atan(uv.x, uv.y) / TAU + .5, length(uv));;\n}\n\nvec4 glorb(vec2 uv, vec2 offset, float radius) {\n  vec2 pq = pq(uv + offset);\n  float r = radius * snoise(uv + time * .3);\n  float s = 8. / resolution.x;\n  float m = smoothstep(r + s, r - s, pq.y);\n  vec3 c = vec3(0.6, .6, .6);\n  return vec4(c, 1.) * m;\n}\n\nvec4 field(vec2 uv, vec2 offset, float radius) {\n  vec4 c0 = glorb(uv, offset, radius);\n  vec4 c1 = glorb(uv, offset, radius * .92);\n  return c0 - c1;\n}\n\n// -------------------------------------------------\n\n\n\nfloat noise (in vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n\n    float a = random(i);\n    float b = random(i + vec2(1.0, 0.0));\n    float c = random(i + vec2(0.0, 1.0));\n    float d = random(i + vec2(1.0, 1.0));\n    vec2 u = f*f*(3.0-2.0*f);\n\n    return mix(a, b, u.x) +\n            (c - a)* u.y * (1.0 - u.x) +\n            (d - b) * u.x * u.y;\n}\n\n// Util functions copied from http://glslsandbox.com/e#43153.1\nmat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}\nmat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);\nfloat tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}\nvec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}\n\nfloat triNoise2d(in vec2 p, float spd)\n{\n  float z=.3;\n  float z2=2.5;\n  float rz = 0.;\n  p *= mm2(p.x*0.06);\n  vec2 bp = p;\n  for (float i=0.; i<5.; i++ )\n  {\n    vec2 dg = tri2(bp*1.85)*.75;\n    dg *= mm2(time*spd);\n    p -= dg/z2;\n\n    bp *= 1.3;\n    z2 *= .45;\n    z *= .42;\n    p *= 1.21 + (rz-1.0)*.02;\n\n    rz += tri(p.x+tri(p.y))*z;\n    p*= -m2;\n  }\n  return clamp(1./pow(rz*29., 1.3),0.,.55);\n}\n\nvoid main() {\n    vec2 uv = gl_FragCoord.xy / resolution;\n    vec2 uv0 = (uv - .5) * 1. + .5;\n\n    float z = 13.01;\n    float t = time * 1.;\n    vec2 uv1 = uv0 + vec2(noise(uv0 * z + t), noise(uv0 * z + t)) * .03 ;\n    vec2 uv2 = uv1 + vec2(noise(uv1 * z - t)*sin(uv.y+t+.2), noise(uv1 * z + t)) * .04 * cos(time * .04 + .3);\n    vec2 uv3 = uv0 + vec2(noise(uv * z - t), noise(uv0 + t));\n\n    // ----------------------\n\n    vec2 uv00 = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;\n    vec4 r0 = field(uv00, vec2( .0, .22), 1.66);\n    vec4 r1 = field(uv00, vec2( .33, .33), .66);\n    vec4 r2 = field(uv00, vec2( .33, -.33), .66);\n    vec4 r3 = field(uv00, vec2(-.33, -.33), .66);\n    vec4 r4 = field(uv00, vec2(.33, .2), 1.66);\n\n    // ----------------------\n\n    gl_FragColor = mix(vec4(\n      texture2D(image, uv2).r,\n      texture2D(image, uv2).g,\n      texture2D(image, uv2).b,\n      1.\n    ), vec4(0,0,0,0) - r0+r1+r2+r3+r4, .4);\n\n}\n"

/***/ })
/******/ ]);