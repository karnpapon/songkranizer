precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D image;
uniform sampler2D backbuffer;


#define      PI 3.14159265358979323846264338327950288419716939937511 // mm pie
#define     TAU 6.28318530717958647692528676655900576839433879875021 // pi * 2
#define HALF_PI 1.57079632679489661923132169163975144209858469968755 // pi / 2

// credits
//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

float random(in vec2 p) {
  return fract(sin(dot(p, vec2(5395.3242, 38249.2348))) * 248.24);
}

vec3 mod289(vec3 x) {
    return x - floor(x * (1. / 289.)) * 289.;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1. / 289.)) * 289.;
}

vec3 permute(vec3 x) {
    return mod289(((x * 34.) + 1.) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0., i1.y, 1. )) + i.x + vec3(0., i1.x, 1. ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - .85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

vec2 pq(vec2 uv) {
  return vec2(atan(uv.x, uv.y) / TAU + .5, length(uv));;
}

vec4 glorb(vec2 uv, vec2 offset, float radius) {
  vec2 pq = pq(uv + offset);
  float r = radius * snoise(uv + time * .3);
  float s = 8. / resolution.x;
  float m = smoothstep(r + s, r - s, pq.y);
  vec3 c = vec3(0.6, .6, .6);
  return vec4(c, 1.) * m;
}

vec4 field(vec2 uv, vec2 offset, float radius) {
  vec4 c0 = glorb(uv, offset, radius);
  vec4 c1 = glorb(uv, offset, radius * .92);
  return c0 - c1;
}

// -------------------------------------------------



float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

// Util functions copied from http://glslsandbox.com/e#43153.1
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
mat2 m2 = mat2(0.95534, 0.29552, -0.29552, 0.95534);
float tri(in float x){return clamp(abs(fract(x)-.5),0.01,0.49);}
vec2 tri2(in vec2 p){return vec2(tri(p.x)+tri(p.y),tri(p.y+tri(p.x)));}

float triNoise2d(in vec2 p, float spd)
{
  float z=.3;
  float z2=2.5;
  float rz = 0.;
  p *= mm2(p.x*0.06);
  vec2 bp = p;
  for (float i=0.; i<5.; i++ )
  {
    vec2 dg = tri2(bp*1.85)*.75;
    dg *= mm2(time*spd);
    p -= dg/z2;

    bp *= 1.3;
    z2 *= .45;
    z *= .42;
    p *= 1.21 + (rz-1.0)*.02;

    rz += tri(p.x+tri(p.y))*z;
    p*= -m2;
  }
  return clamp(1./pow(rz*29., 1.3),0.,.55);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution;
    vec2 uv0 = (uv - .5) * 1. + .5;

    float z = 13.01;
    float t = time * 1.;
    vec2 uv1 = uv0 + vec2(noise(uv0 * z + t), noise(uv0 * z + t)) * .03 ;
    vec2 uv2 = uv1 + vec2(noise(uv1 * z - t)*sin(uv.y+t+.2), noise(uv1 * z + t)) * .04 * cos(time * .04 + .3);
    vec2 uv3 = uv0 + vec2(noise(uv * z - t), noise(uv0 + t));

    // ----------------------

    vec2 uv00 = (2. * gl_FragCoord.xy - resolution.xy) / resolution.y;
    vec4 r0 = field(uv00, vec2( .0, .22), 1.66);
    vec4 r1 = field(uv00, vec2( .33, .33), .66);
    vec4 r2 = field(uv00, vec2( .33, -.33), .66);
    vec4 r3 = field(uv00, vec2(-.33, -.33), .66);
    vec4 r4 = field(uv00, vec2(.33, .2), 1.66);

    // ----------------------

    gl_FragColor = mix(vec4(
      texture2D(image, uv2).r,
      texture2D(image, uv2).g,
      texture2D(image, uv2).b,
      1.
    ), vec4(0,0,0,0) - r0+r1+r2+r3+r4, .4);

}
