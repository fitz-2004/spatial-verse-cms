"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  GLSL Shaders (extracted from DeepSeek Harness hero background)     */
/* ------------------------------------------------------------------ */

const FLOW_VERT = `#version 300 es
in vec4 a_position;
out vec2 vUv;
void main() {
  vUv = a_position.xy * 0.5 + 0.5;
  gl_Position = a_position;
}
`;

const FLOW_FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D u_prev;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_brushRadius;
uniform float u_brushStrength;
uniform float u_decay;
out vec4 fragColor;

void main() {
  vec4 prev = texture(u_prev, vUv);

  prev.r *= u_decay;
  prev.gb = mix(vec2(0.5), prev.gb, u_decay);

  float dist = distance(vUv, u_mouse);

  float influence = exp(-dist * dist / (u_brushRadius * u_brushRadius * 0.5));
  influence = max(0.0, influence - 0.01);

  float speed = length(u_velocity);
  float presenceStrength = u_brushStrength * 0.3;
  float velBonus = min(speed * 3.0, 0.7) * u_brushStrength;
  float totalStrength = presenceStrength + velBonus;

  prev.r = max(prev.r, influence * totalStrength);
  float blendAmt = influence * min(totalStrength, 0.4) * 0.3;
  prev.g = mix(prev.g, clamp(u_velocity.x * 2.0 + 0.5, 0.0, 1.0), blendAmt);
  prev.b = mix(prev.b, clamp(u_velocity.y * 2.0 + 0.5, 0.0, 1.0), blendAmt);

  fragColor = prev;
}
`;

const FLUID_RENDER_FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_c1, u_c2, u_c3, u_c4, u_c5;
uniform float u_scale;
uniform vec2 u_offset;
uniform float u_grain;
uniform float u_speed;
uniform sampler2D u_flowmap;
uniform float u_distortBoost;
uniform float u_swirlBoost;
uniform float u_glowIntensity;
uniform vec3 u_glowColor1;
uniform vec3 u_glowColor2;
uniform vec3 u_glowColor3;
uniform vec2 u_lightPos;
uniform float u_lightCore;
uniform float u_lightHalo;
uniform float u_vignette;
uniform float u_bloomThreshold;
uniform float u_bloomRange;
uniform float u_bloomStrength;
out vec4 fragColor;

vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289v3(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float hash(vec2 p){
  vec3 p3=fract(vec3(p.xyx)*.1031);
  p3+=dot(p3,p3.yzx+33.33);
  return fract((p3.x+p3.y)*p3.z);
}

float fbm(vec3 p){
  float v=0.,amp=.6;vec3 shift=vec3(100.);
  for(int i=0;i<1;i++){v+=amp*snoise(p);p=p*2.+shift;amp*=.4;}
  return v;
}

float fluidNoise(vec2 uv,float t){
  float n1=fbm(vec3(uv*.6,t*.06));
  float n2=fbm(vec3(uv*.6+5.2,t*.06+1.3));
  vec2 w1=vec2(n1,n2)*.6;
  float n3=fbm(vec3((uv+w1)*.7+1.7,t*.05+3.1));
  float n4=fbm(vec3((uv+w1)*.7+9.2,t*.05+5.7));
  vec2 w2=vec2(n3,n4)*.5;
  return fbm(vec3((uv+w1+w2)*.5,t*.04));
}

vec2 curlish(vec2 uv,float t){
  float eps=.02;
  float n=snoise(vec3(uv*.8,t));
  float nx=snoise(vec3((uv+vec2(eps,0.))*.8,t));
  float ny=snoise(vec3((uv+vec2(0.,eps))*.8,t));
  return vec2(-(ny-n)/eps,(nx-n)/eps)*.003;
}

void main(){
  float aspect=u_resolution.x/u_resolution.y;
  vec2 uv=gl_FragCoord.xy/u_resolution;
  vec2 suv=vec2(uv.x*aspect, uv.y) * u_scale + u_offset;
  float t=u_time;

  // Mouse interaction via flowmap
  vec4 flow = texture(u_flowmap, uv);
  float influence = flow.r;
  vec2 flowDir = (flow.gb - 0.5) * 2.0;

  // Apply mouse distortion to UV
  suv += flowDir * influence * u_distortBoost * 0.8;
  // Apply mouse swirl
  float swirlAngle = influence * u_swirlBoost * 2.5;
  float cs = cos(swirlAngle), sn = sin(swirlAngle);
  vec2 delta = suv - vec2(uv.x * aspect, uv.y) * u_scale;
  suv += (mat2(cs, sn, -sn, cs) * delta - delta) * influence;

  vec2 curl=curlish(suv,t*.04);
  vec2 uvD=suv+curl*12.;
  float f=fluidNoise(uvD,t);
  float swirl=snoise(vec3(uvD*.8+f*1.5,t*.035))*.5+.5;
  float n=f*.5+.5;
  vec3 col=mix(u_c1,u_c2,smoothstep(.2,.5,n));
  col=mix(col,u_c3,smoothstep(.35,.65,n+swirl*.25));
  col=mix(col,u_c4,smoothstep(.6,.85,swirl)*.55);
  col=mix(col,u_c5,smoothstep(.5,.8,n*swirl)*.35);

  // Mouse proximity color shift: 3-color glow
  float glow = smoothstep(0.0, 0.8, influence);
  float glowNoise = snoise(vec3(uvD * 1.5, t * 0.08)) * 0.5 + 0.5;
  float glowDist = smoothstep(0.0, 1.0, influence);
  vec3 glowMix = mix(u_glowColor3, u_glowColor2, glowDist);
  glowMix = mix(glowMix, u_glowColor1, glowDist * glowNoise);
  col = mix(col, glowMix, glow * u_glowIntensity);

  if(u_grain>0.0){
    vec2 flowOffset = (uvD - suv) * u_resolution.y;
    vec2 gp = floor((gl_FragCoord.xy + flowOffset) / 5.0);
    float gr=hash(gp)*2.-1.;
    col+=gr*u_grain;
  }

  // Self-luminance bloom
  float luma=dot(col,vec3(.299,.587,.114));
  float bloom=smoothstep(u_bloomThreshold-u_bloomRange,u_bloomThreshold+u_bloomRange,luma);
  col+=(col*.85+vec3(.15,.145,.13))*bloom*u_bloomStrength;

  // Virtual light source
  float ld=length((uv-u_lightPos)*vec2(aspect,1.));
  float core=exp(-ld*ld*4.5);
  float halo=exp(-ld*1.8);
  col+=vec3(1.,.97,.9)*core*u_lightCore+vec3(.72,.8,1.)*halo*u_lightHalo;

  float vig=1.-smoothstep(.35,.75,length(uv-.5));
  col=mix(col*(1.-u_vignette),col,vig);
  fragColor=vec4(col,1.);
}
`;

/* ------------------------------------------------------------------ */
/*  Utility: parse hex color to normalized rgb                         */
/* ------------------------------------------------------------------ */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

/* ------------------------------------------------------------------ */
/*  Fluid background configuration (tuned to SpatialVerse palette)     */
/* ------------------------------------------------------------------ */

export interface FluidBackgroundParams {
  mouseRadius: number;
  mouseStrength: number;
  mouseSmoothing: number;
  mouseVelocity: number;
  decay: number;
  distortBoost: number;
  noiseBoost: number;
  swirlBoost: number;
  glowIntensity: number;
  glowColors: string[];
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  scale: number;
  rotation: number;
  proportion: number;
  softness: number;
  shapeScale: number;
  offsetX: number;
  offsetY: number;
  grain: number;
  colors: string[];
  lightX: number;
  lightY: number;
  lightCore: number;
  lightHalo: number;
  vignette: number;
  lightFollow: number;
  bloomThreshold: number;
  bloomRange: number;
  bloomStrength: number;
}

export const spatialVerseFluidParams: FluidBackgroundParams = {
  mouseRadius: 0.09,
  mouseStrength: 1.8,
  mouseSmoothing: 0.1,
  mouseVelocity: 0.2,
  decay: 0.925,
  distortBoost: 2.2,
  noiseBoost: 0.3,
  swirlBoost: 0.8,
  glowIntensity: 0.16,
  glowColors: ["#D7FFF3", "#29F5D1", "#7C5CFF"],
  speed: 28,
  distortion: 18,
  swirl: 20,
  swirlIterations: 12,
  scale: 1.55,
  rotation: 15,
  proportion: 60,
  softness: 80,
  shapeScale: 0,
  offsetX: -90,
  offsetY: -45,
  grain: 0.005,
  colors: ["#020406", "#123F2E", "#0F3F4E", "#9DF4DC", "#020406"],
  lightX: 0.28,
  lightY: 0.44,
  lightCore: 0.12,
  lightHalo: 0.2,
  vignette: 0.42,
  lightFollow: 0.63,
  bloomThreshold: 0.61,
  bloomRange: 0.18,
  bloomStrength: 0.4,
};

/* ------------------------------------------------------------------ */
/*  WebGL2 Fluid Canvas                                                */
/* ------------------------------------------------------------------ */

export function FluidCanvas({
  params = spatialVerseFluidParams,
  className,
  style,
}: {
  params?: FluidBackgroundParams;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef(params);
  const pointerRef = useRef({ x: 0.5, y: 0.5, smoothX: 0.5, smoothY: 0.5, vx: 0, vy: 0, svx: 0, svy: 0 });
  const visibleRef = useRef(false);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS)
        ? shader
        : (console.error("Shader error:", gl.getShaderInfoLog(shader)), null);
    };

    const createProgram = (fragSource: string) => {
      const vert = compileShader(gl.VERTEX_SHADER, FLOW_VERT);
      const frag = compileShader(gl.FRAGMENT_SHADER, fragSource);
      if (!vert || !frag) return null;
      const program = gl.createProgram()!;
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.linkProgram(program);
      return gl.getProgramParameter(program, gl.LINK_STATUS)
        ? program
        : (console.error("Link error:", gl.getProgramInfoLog(program)), null);
    };

    const flowProgram = createProgram(FLOW_FRAG);
    const renderProgram = createProgram(FLUID_RENDER_FRAG);
    if (!flowProgram || !renderProgram) return;

    const uFlow = {
      prev: gl.getUniformLocation(flowProgram, "u_prev"),
      mouse: gl.getUniformLocation(flowProgram, "u_mouse"),
      velocity: gl.getUniformLocation(flowProgram, "u_velocity"),
      brushRadius: gl.getUniformLocation(flowProgram, "u_brushRadius"),
      brushStrength: gl.getUniformLocation(flowProgram, "u_brushStrength"),
      decay: gl.getUniformLocation(flowProgram, "u_decay"),
    };

    const uRender = {
      time: gl.getUniformLocation(renderProgram, "u_time"),
      resolution: gl.getUniformLocation(renderProgram, "u_resolution"),
      scale: gl.getUniformLocation(renderProgram, "u_scale"),
      offset: gl.getUniformLocation(renderProgram, "u_offset"),
      grain: gl.getUniformLocation(renderProgram, "u_grain"),
      speed: gl.getUniformLocation(renderProgram, "u_speed"),
      flowmap: gl.getUniformLocation(renderProgram, "u_flowmap"),
      distortBoost: gl.getUniformLocation(renderProgram, "u_distortBoost"),
      swirlBoost: gl.getUniformLocation(renderProgram, "u_swirlBoost"),
      glowIntensity: gl.getUniformLocation(renderProgram, "u_glowIntensity"),
      glowColor1: gl.getUniformLocation(renderProgram, "u_glowColor1"),
      glowColor2: gl.getUniformLocation(renderProgram, "u_glowColor2"),
      glowColor3: gl.getUniformLocation(renderProgram, "u_glowColor3"),
      c1: gl.getUniformLocation(renderProgram, "u_c1"),
      c2: gl.getUniformLocation(renderProgram, "u_c2"),
      c3: gl.getUniformLocation(renderProgram, "u_c3"),
      c4: gl.getUniformLocation(renderProgram, "u_c4"),
      c5: gl.getUniformLocation(renderProgram, "u_c5"),
      lightPos: gl.getUniformLocation(renderProgram, "u_lightPos"),
      lightCore: gl.getUniformLocation(renderProgram, "u_lightCore"),
      lightHalo: gl.getUniformLocation(renderProgram, "u_lightHalo"),
      vignette: gl.getUniformLocation(renderProgram, "u_vignette"),
      bloomThreshold: gl.getUniformLocation(renderProgram, "u_bloomThreshold"),
      bloomRange: gl.getUniformLocation(renderProgram, "u_bloomRange"),
      bloomStrength: gl.getUniformLocation(renderProgram, "u_bloomStrength"),
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const bindQuad = (program: WebGLProgram) => {
      const loc = gl.getAttribLocation(program, "a_position");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    const makeTarget = (w: number, h: number, data?: Uint8Array) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA,
        data ? gl.UNSIGNED_BYTE : gl.UNSIGNED_BYTE, data ?? null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fbo: fbo!, tex };
    };

    let cssW = 0;
    let cssH = 0;
    let bufferW = 0;
    let bufferH = 0;
    let flowW = 0;
    let flowH = 0;
    let frame = 0;
    let mouseEnabled = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    cssW = canvas.clientWidth;
    cssH = canvas.clientHeight;
    bufferW = Math.round(cssW * dpr);
    bufferH = Math.round(cssH * dpr);
    canvas.width = bufferW;
    canvas.height = bufferH;

    flowW = Math.round(bufferW / 4);
    flowH = Math.round(bufferH / 4);

    const neutral = new Uint8Array(flowW * flowH * 4);
    for (let i = 0; i < flowW * flowH; i++) {
      neutral[4 * i] = 0;
      neutral[4 * i + 1] = 128;
      neutral[4 * i + 2] = 128;
      neutral[4 * i + 3] = 255;
    }
    const flowA = makeTarget(flowW, flowH, neutral);
    const flowB = makeTarget(flowW, flowH, neutral);

    // Pointer handling — enable mouse interaction on all desktop platforms
    const coarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    mouseEnabled = !coarsePointer;

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (event.clientX - rect.left) / rect.width;
      pointerRef.current.y = 1 - (event.clientY - rect.top) / rect.height;
    };
    if (mouseEnabled) window.addEventListener("mousemove", onMouseMove, { passive: true });

    const startTime = performance.now();
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;
    let rafId = 0;

    const render = (now: number) => {
      rafId = requestAnimationFrame(render);
      if (!visibleRef.current || now - lastFrameTime < frameInterval) return;
      lastFrameTime = now - ((now - lastFrameTime) % frameInterval);

      const newCssW = canvas.clientWidth;
      const newCssH = canvas.clientHeight;
      if (newCssW !== cssW || newCssH !== cssH) {
        cssW = newCssW;
        cssH = newCssH;
        bufferW = Math.round(cssW * dpr);
        bufferH = Math.round(cssH * dpr);
        canvas.width = bufferW;
        canvas.height = bufferH;
      }

      const p = paramsRef.current;
      const ptr = pointerRef.current;

      ptr.smoothX += (ptr.x - ptr.smoothX) * p.mouseSmoothing;
      ptr.smoothY += (ptr.y - ptr.smoothY) * p.mouseSmoothing;
      ptr.svx += ((ptr.x - ptr.smoothX) * 0.5 - ptr.svx) * p.mouseVelocity;
      ptr.svy += ((ptr.y - ptr.smoothY) * 0.5 - ptr.svy) * p.mouseVelocity;

      // ---- Step 1: draw mouse into flowmap ----
      const readTarget = frame % 2 === 0 ? flowA : flowB;
      const writeTarget = frame % 2 === 0 ? flowB : flowA;
      frame++;

      gl.bindFramebuffer(gl.FRAMEBUFFER, writeTarget.fbo);
      gl.viewport(0, 0, flowW, flowH);
      gl.useProgram(flowProgram);
      bindQuad(flowProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, readTarget.tex);
      gl.uniform1i(uFlow.prev, 0);
      gl.uniform2f(uFlow.mouse, ptr.smoothX, ptr.smoothY);
      gl.uniform2f(uFlow.velocity, ptr.svx, ptr.svy);
      gl.uniform1f(uFlow.brushRadius, p.mouseRadius);
      gl.uniform1f(uFlow.brushStrength, mouseEnabled ? p.mouseStrength : 0);
      gl.uniform1f(uFlow.decay, p.decay);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // ---- Step 2: render fluid to screen ----
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, bufferW, bufferH);
      const elapsed = (performance.now() - startTime) * 0.001 * (p.speed / 100);

      gl.useProgram(renderProgram);
      bindQuad(renderProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, writeTarget.tex);
      gl.uniform1i(uRender.flowmap, 0);
      gl.uniform1f(uRender.time, elapsed);
      gl.uniform2f(uRender.resolution, bufferW, bufferH);
      gl.uniform1f(uRender.scale, p.scale);
      gl.uniform2f(uRender.offset, p.offsetX / 100, p.offsetY / 100);
      gl.uniform1f(uRender.grain, p.grain);
      gl.uniform1f(uRender.distortBoost, p.distortBoost);
      gl.uniform1f(uRender.swirlBoost, p.swirlBoost);

      const moveLight = mouseEnabled && p.lightFollow > 0;
      gl.uniform2f(
        uRender.lightPos,
        p.lightX + (ptr.smoothX - p.lightX) * (moveLight ? p.lightFollow : 0),
        p.lightY
      );
      gl.uniform1f(uRender.lightCore, coarsePointer ? 0 : p.lightCore);
      gl.uniform1f(uRender.lightHalo, coarsePointer ? 0 : p.lightHalo);
      gl.uniform1f(uRender.vignette, p.vignette);
      gl.uniform1f(uRender.bloomThreshold, p.bloomThreshold);
      gl.uniform1f(uRender.bloomRange, p.bloomRange);
      gl.uniform1f(uRender.bloomStrength, p.bloomStrength);
      gl.uniform1f(uRender.glowIntensity, p.glowIntensity);

      const glow = p.glowColors;
      const g1 = hexToRgb(glow[0] || "#ffffff");
      const g2 = hexToRgb(glow[1] || glow[0] || "#ffffff");
      const g3 = hexToRgb(glow[2] || glow[0] || "#ffffff");
      gl.uniform3f(uRender.glowColor1, g1[0], g1[1], g1[2]);
      gl.uniform3f(uRender.glowColor2, g2[0], g2[1], g2[2]);
      gl.uniform3f(uRender.glowColor3, g3[0], g3[1], g3[2]);

      const colors = p.colors;
      const cUniforms = [uRender.c1, uRender.c2, uRender.c3, uRender.c4, uRender.c5];
      for (let i = 0; i < 5; i++) {
        const c = hexToRgb(colors[i] || colors[colors.length - 1] || "#000000");
        gl.uniform3f(cUniforms[i], c[0], c[1], c[2]);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    rafId = requestAnimationFrame(render);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
    visibleRef.current = true;

    return () => {
      cancelAnimationFrame(rafId);
      if (mouseEnabled) window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", ...style }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  2D Particle Field (repulsion + spring back)                        */
/* ------------------------------------------------------------------ */

interface ParticlePoint {
  restX: number;
  restY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function DotGridCanvas({
  lineColor = "rgba(167, 255, 233,",
  dotColor = "rgba(167, 255, 233,",
  lineOpacity = 0.1,
  dotOpacity = 0.2,
  isStatic = false,
  showLines = true,
  shapeSrc,
  shapeSize = 420,
  className,
  style,
}: {
  lineColor?: string;
  dotColor?: string;
  lineOpacity?: number;
  dotOpacity?: number;
  isStatic?: boolean;
  /** Draw connecting lines between particles */
  showLines?: boolean;
  /** When provided, particles form this image's shape instead of full screen */
  shapeSrc?: string;
  /** Render size of the shape image (particle field), default 420 */
  shapeSize?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(true);
  const pointRef = useRef({ x: 0, y: 0 });
  const shapeRef = useRef<HTMLImageElement | null>(null);
  const [shapeReady, setShapeReady] = useState(false);

  // Flag that forces particle-grid rebuild on next tick (deps-independent)
  const needsRebuildRef = useRef(false);

  // Load shape image (logo) when provided
  useEffect(() => {
    if (!shapeSrc) {
      shapeRef.current = null;
      needsRebuildRef.current = true;
      return;
    }
    const img = new Image();
    img.onload = () => {
      shapeRef.current = img;
      // Notify React asynchronously (from image callback) so effects re-run
      setShapeReady(true);
    };
    img.src = shapeSrc;
    return () => {
      img.onload = null;
    };
  }, [shapeSrc]);

  // Force grid rebuild once shape is ready (late dependencies)
  useEffect(() => {
    if (shapeSrc && shapeReady) {
      needsRebuildRef.current = true;
    }
  }, [shapeSrc, shapeReady]);

  useEffect(() => {
    if (shapeSrc && !shapeReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points: ParticlePoint[] = [];
    let cols = 0;
    let rows = 0;
    let cssW = 0;
    let cssH = 0;
    let active = false;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    const buildGrid = () => {
      needsRebuildRef.current = false;
      const shapeImg = shapeSrc ? shapeRef.current : null;
      if (shapeImg) {
        // Icon-shaped particle field: sample image alpha, keep particles
        // only inside the shape, centered on the canvas.
        const size = shapeSize;
        const off = document.createElement("canvas");
        off.width = size;
        off.height = size;
        const octx = off.getContext("2d");
        if (octx) {
          octx.clearRect(0, 0, size, size);
          const iw = shapeImg.naturalWidth || shapeImg.width;
          const ih = shapeImg.naturalHeight || shapeImg.height;
          const scale = Math.min(size / iw, size / ih);
          const w = iw * scale;
          const h = ih * scale;
          octx.drawImage(shapeImg, (size - w) / 2, (size - h) / 2, w, h);
          const data = octx.getImageData(0, 0, size, size).data;
          const spacing = 9;
          const cx = cssW / 2;
          const cy = cssH / 2;
          const half = size / 2;
          points = [];
          for (let py = 0; py <= size; py += spacing) {
            for (let px = 0; px <= size; px += spacing) {
              const sy = Math.min(Math.floor(py), size - 1);
              const sx = Math.min(Math.floor(px), size - 1);
              const alpha = data[(sy * size + sx) * 4 + 3];
              if (alpha > 40) {
                const restX = cx - half + px;
                const restY = cy - half + py;
                points.push({ restX, restY, x: restX, y: restY, vx: 0, vy: 0 });
              }
            }
          }
          cols = 0;
          rows = 0;
          return;
        }
      }

      // Fallback dense particle field across the whole canvas
      const area = cssW * cssH;
      const spacing = area > 2700000 ? 34 : 26;
      cols = Math.ceil(cssW / spacing) + 1;
      rows = Math.ceil(cssH / spacing) + 1;
      const offsetX = (cssW - (cols - 1) * spacing) / 2;
      const offsetY = (cssH - (rows - 1) * spacing) / 2;
      points = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const restX = offsetX + spacing * c;
          const restY = offsetY + spacing * r;
          points.push({ restX, restY, x: restX, y: restY, vx: 0, vy: 0 });
        }
      }
    };

    cssW = canvas.clientWidth;
    cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();

    const wake = () => {
      if (!active) {
        active = true;
        rafId = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(rafId);
    };

    const onMouseMove = (event: MouseEvent) => {
      if (isStatic) return;
      const rect = canvas.getBoundingClientRect();
      pointRef.current.x = event.clientX - rect.left;
      pointRef.current.y = event.clientY - rect.top;
      wake();
    };
    if (!isStatic) window.addEventListener("mousemove", onMouseMove, { passive: true });

    let lastTick = 0;
    const tickInterval = 1000 / 30;
    let rafId = 0;

    const tick = (now: number) => {
      if (!visibleRef.current) {
        cancelAnimationFrame(rafId);
        active = false;
        return;
      }
      if (now - lastTick < tickInterval) {
        rafId = requestAnimationFrame(tick);
        return;
      }
      lastTick = now - ((now - lastTick) % tickInterval);

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w !== cssW || h !== cssH) {
        cssW = w;
        cssH = h;
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildGrid, 150);
      }

      // Rebuild when shape image finishes loading
      if (needsRebuildRef.current) {
        buildGrid();
        ctx.clearRect(0, 0, cssW, cssH);
      }

      ctx.clearRect(0, 0, cssW, cssH);

      const mx = pointRef.current.x;
      const my = pointRef.current.y;
      let maxSpeed = 0;

      // Update physics
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160 && dist > 0.1) {
          const force = (1 - dist / 160) * 34;
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * force * 0.12;
          p.vy += ny * force * 0.12;
        }

        const rx = p.restX - p.x;
        const ry = p.restY - p.y;
        p.vx += 0.06 * rx;
        p.vy += 0.06 * ry;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        if (speed > maxSpeed) maxSpeed = speed;
      }

      if (showLines) {
        ctx.strokeStyle = `${lineColor} ${lineOpacity})`;
        ctx.lineWidth = 0.5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const a = points[r * cols + c];
            const b = points[r * cols + c + 1];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) continue;
            ctx.beginPath();
            ctx.moveTo(a.x + 10 * (dx / dist), a.y + 10 * (dy / dist));
            ctx.lineTo(b.x - 10 * (dx / dist), b.y - 10 * (dy / dist));
            ctx.stroke();
          }
        }
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows - 1; r++) {
            const a = points[r * cols + c];
            const b = points[(r + 1) * cols + c];
            if (a.x === 0 && a.y === 0) continue;
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) continue;
            ctx.beginPath();
            ctx.moveTo(a.x + 10 * (dx / dist), a.y + 10 * (dy / dist));
            ctx.lineTo(b.x - 10 * (dx / dist), b.y - 10 * (dy / dist));
            ctx.stroke();
          }
        }
      }

      // Draw particles — always-visible bright core, mouse adds glow
      ctx.fillStyle = `${dotColor} ${dotOpacity})`;
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        let size = 2.8;
        let alpha = dotOpacity;
        if (!isNaN(mx) && !isNaN(my)) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const close = Math.max(0, 1 - dist / 160);
          size = 2.8 + 1.6 * close;
          alpha = Math.min(1, dotOpacity + 0.5 * close);
        }
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x - size, p.y - size, size * 2, size * 2);
      }
      ctx.globalAlpha = 1;

      if (maxSpeed < 0.01 && isStatic) {
        stop();
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !active) wake();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (!isStatic) window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, [isStatic, showLines, lineColor, dotColor, lineOpacity, dotOpacity, shapeSrc, shapeSize, shapeReady]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "transparent", ...style }}
      aria-hidden="true"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Combined Background - DeepSeek harness style interaction           */
/* ------------------------------------------------------------------ */

export default function DeepSeekHarnessBackground({
  fluidParams = spatialVerseFluidParams,
  lineColor = "rgba(167, 255, 233,",
  dotColor = "rgba(41, 245, 209,",
  lineOpacity = 0.08,
  dotOpacity = 0.16,
  dotGrid = true,
  showLines = true,
  shapeSrc,
  shapeSize = 420,
  fluid = true,
  className,
  style,
  mask,
}: {
  fluidParams?: FluidBackgroundParams;
  lineColor?: string;
  dotColor?: string;
  lineOpacity?: number;
  dotOpacity?: number;
  dotGrid?: boolean;
  /** Draw connecting lines between particles */
  showLines?: boolean;
  /** When provided, particles form this image's shape */
  shapeSrc?: string;
  /** Render size of the shape image (particle field), default 420 */
  shapeSize?: number;
  fluid?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** CSS mask (gradient) applied to the background container */
  mask?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        mask,
        WebkitMask: mask,
        ...style,
      }}
      aria-hidden="true"
    >
      {fluid && <FluidCanvas params={fluidParams} />}
      {dotGrid && (
        <DotGridCanvas
          lineColor={lineColor}
          dotColor={dotColor}
          lineOpacity={lineOpacity}
          dotOpacity={dotOpacity}
          showLines={showLines}
          shapeSrc={shapeSrc}
          shapeSize={shapeSize}
        />
      )}
    </div>
  );
}
