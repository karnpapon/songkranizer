export const DEFAULT_SHADER_CODE = require('./shader.frag');
export const DEFAULT_SHADER = {
  id: '0',
  name: 'Songkranizer',
  code: DEFAULT_SHADER_CODE,
  blend: 'multiply',
};

export const EMPTY_SHADER_CODE = `
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D image;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  gl_FragColor = 1. - texture2D(image, uv);
}
`.trim();
