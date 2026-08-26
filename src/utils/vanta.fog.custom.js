// src/utils/vanta.fog.custom.js
import * as THREE from 'three';

// --- HELPERS ---
Number.prototype.clamp = function(min, max) { return Math.min(Math.max(this, min), max) }

function mobileCheck(){
  if (typeof navigator !== 'undefined') {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 600
  }
  return null
}

const color2Hex = (color) => {
  if (typeof color == 'number'){
    return '#' +  ('00000' + color.toString(16)).slice(-6)
  } else return color
}

function clearThree(obj) {
  while (obj.children && obj.children.length > 0) {
    clearThree(obj.children[0])
    obj.remove(obj.children[0])
  }
  if (obj.geometry) obj.geometry.dispose()
  if (obj.material) { 
    Object.keys(obj.material).forEach(prop => {
      if (!obj.material[prop]) return
      if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function') {
        obj.material[prop].dispose()
      }
    })
    obj.material.dispose()
  }
}

// --- BASE CLASS ---
class VantaBase {
  constructor(userOptions = {}) {
    this.windowMouseMoveWrapper = this.windowMouseMoveWrapper.bind(this)
    this.windowTouchWrapper = this.windowTouchWrapper.bind(this)
    this.resize = this.resize.bind(this)
    this.animationLoop = this.animationLoop.bind(this)
    this.restart = this.restart.bind(this)

    const defaultOptions = (typeof this.getDefaultOptions === 'function') ? this.getDefaultOptions() : this.defaultOptions
    this.options = Object.assign({
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
    }, defaultOptions)

    if (userOptions instanceof HTMLElement || typeof userOptions === 'string') {
      userOptions = {el: userOptions}
    }
    Object.assign(this.options, userOptions)

    this.el = this.options.el
    if (this.el == null) {
      console.error("Instance needs \"el\" param!")
      return
    }

    this.prepareEl()
    this.initThree()
    this.setSize()

    try {
      this.init()
    } catch (e) {
      console.error('Init error', e)
      if (this.renderer && this.renderer.domElement) {
        this.el.removeChild(this.renderer.domElement)
      }
      return
    }

    this.initMouse()
    this.resize()
    this.animationLoop()

    const ad = window.addEventListener
    ad('resize', this.resize)
    window.requestAnimationFrame(this.resize)

    if (this.options.mouseControls) {
      ad('scroll', this.windowMouseMoveWrapper)
      ad('mousemove', this.windowMouseMoveWrapper)
    }
    if (this.options.touchControls) {
      ad('touchstart', this.windowTouchWrapper)
      ad('touchmove', this.windowTouchWrapper)
    }
  }

  setOptions(userOptions={}){
    Object.assign(this.options, userOptions)
    this.triggerMouseMove()
  }

  prepareEl() {
    let i, child
    if (typeof Node !== 'undefined' && Node.TEXT_NODE) {
      for (i = 0; i < this.el.childNodes.length; i++) {
        const n = this.el.childNodes[i]
        if (n.nodeType === Node.TEXT_NODE) {
          const s = document.createElement('span')
          s.textContent = n.textContent
          n.parentElement.insertBefore(s, n)
          n.remove()
        }
      }
    }
    for (i = 0; i < this.el.children.length; i++) {
      child = this.el.children[i]
      if (getComputedStyle(child).position === 'static') {
        child.style.position = 'relative'
      }
      if (getComputedStyle(child).zIndex === 'auto') {
        child.style.zIndex = 1
      }
    }
    if (getComputedStyle(this.el).position === 'static') {
      this.el.style.position = 'relative'
    }
  }

  applyCanvasStyles(canvasEl, opts={}){
    Object.assign(canvasEl.style, {
      position: 'absolute',
      zIndex: 0,
      top: 0,
      left: 0,
      background: '',
    })
    Object.assign(canvasEl.style, opts)
    canvasEl.classList.add('vanta-canvas')
  }

  initThree() {
    // OPTIMIZATION: Disable antialias on mobile for performance
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !mobileCheck()
    })
    this.el.appendChild(this.renderer.domElement)
    this.applyCanvasStyles(this.renderer.domElement)
    if (isNaN(this.options.backgroundAlpha)) {
      this.options.backgroundAlpha = 1
    }
    this.scene = new THREE.Scene()
  }

  getCanvasElement() {
    if (this.renderer) return this.renderer.domElement
  }

  getCanvasRect() {
    const canvas = this.getCanvasElement()
    if (!canvas) return false
    return canvas.getBoundingClientRect()
  }

  windowMouseMoveWrapper(e){
    const rect = this.getCanvasRect()
    if (!rect) return false
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (x>=0 && y>=0 && x<=rect.width && y<=rect.height) {
      this.mouseX = x
      this.mouseY = y
      if (!this.options.mouseEase) this.triggerMouseMove(x, y)
    }
  }
  windowTouchWrapper(e){
    const rect = this.getCanvasRect()
    if (!rect) return false
    if (e.touches.length === 1) {
      const x = e.touches[0].clientX - rect.left
      const y = e.touches[0].clientY - rect.top
      if (x>=0 && y>=0 && x<=rect.width && y<=rect.height) {
        this.mouseX = x
        this.mouseY = y
        if (!this.options.mouseEase) this.triggerMouseMove(x, y)
      }
    }
  }

  triggerMouseMove(x, y) {
    if (x === undefined && y === undefined) {
      if (this.options.mouseEase) {
        x = this.mouseEaseX
        y = this.mouseEaseY
      } else {
        x = this.mouseX
        y = this.mouseY
      }
    }
    if (this.uniforms) {
      this.uniforms.iMouse.value.x = x / this.scale
      this.uniforms.iMouse.value.y = y / this.scale
    }
    const xNorm = x / this.width
    const yNorm = y / this.height
    typeof this.onMouseMove === "function" ? this.onMouseMove(xNorm, yNorm) : void 0
  }

  setSize() {
    this.scale || (this.scale = 1)
    if (mobileCheck() && this.options.scaleMobile) {
      this.scale = this.options.scaleMobile
    } else if (this.options.scale) {
      this.scale = this.options.scale
    }
    this.width = Math.max(this.el.offsetWidth, this.options.minWidth)
    this.height = Math.max(this.el.offsetHeight, this.options.minHeight)
  }
  initMouse() {
    if ((!this.mouseX && !this.mouseY) ||
      (this.mouseX === this.options.minWidth/2 && this.mouseY === this.options.minHeight/2)) {
      this.mouseX = this.width/2
      this.mouseY = this.height/2
      this.triggerMouseMove(this.mouseX, this.mouseY)
    }
  }

  resize() {
    this.setSize()
    if (this.camera) {
      this.camera.aspect = this.width / this.height
      if (typeof this.camera.updateProjectionMatrix === "function") {
        this.camera.updateProjectionMatrix()
      }
    }
    if (this.renderer) {
      this.renderer.setSize(this.width, this.height)
      this.renderer.setPixelRatio(window.devicePixelRatio / this.scale)
    }
    typeof this.onResize === "function" ? this.onResize() : void 0
  }

  isOnScreen() {
    const elHeight = this.el.offsetHeight
    const elRect = this.el.getBoundingClientRect()
    const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
    const offsetTop = elRect.top + scrollTop
    const minScrollTop = offsetTop - window.innerHeight
    const maxScrollTop = offsetTop + elHeight
    return minScrollTop <= scrollTop && scrollTop <= maxScrollTop
  }

  animationLoop() {
    // OPTIMIZATION: Frame throttling for mobile (cap at ~30fps)
    this.frame = (this.frame || 0) + 1;
    if (mobileCheck() && this.frame % 2 === 1) { 
       return this.req = window.requestAnimationFrame(this.animationLoop);
    }

    this.t || (this.t = 0)
    this.t2 || (this.t2 = 0)

    const now = performance.now()
    if (this.prevNow) {
      let elapsedTime = (now-this.prevNow) / (1000/60)
      elapsedTime = Math.max(0.2, Math.min(elapsedTime, 5))
      this.t += elapsedTime

      this.t2 += (this.options.speed || 1) * elapsedTime
      if (this.uniforms) {
        this.uniforms.iTime.value = this.t2 * 0.016667
      }
    }
    this.prevNow = now

    if (this.options.mouseEase) {
      this.mouseEaseX = this.mouseEaseX || this.mouseX || 0
      this.mouseEaseY = this.mouseEaseY || this.mouseY || 0
      if (Math.abs(this.mouseEaseX-this.mouseX) + Math.abs(this.mouseEaseY-this.mouseY) > 0.1) {
        this.mouseEaseX += (this.mouseX - this.mouseEaseX) * 0.05
        this.mouseEaseY += (this.mouseY - this.mouseEaseY) * 0.05
        this.triggerMouseMove(this.mouseEaseX, this.mouseEaseY)
      }
    }

    if (this.isOnScreen() || this.options.forceAnimate) {
      if (typeof this.onUpdate === "function") {
        this.onUpdate()
      }
      if (this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
        this.renderer.setClearColor(this.options.backgroundColor, this.options.backgroundAlpha)
      }
    }
    return this.req = window.requestAnimationFrame(this.animationLoop)
  }

  restart() {
    if (this.scene) {
      while (this.scene.children.length) {
        this.scene.remove(this.scene.children[0])
      }
    }
    if (typeof this.onRestart === "function") {
      this.onRestart()
    }
    this.init()
  }

  init() {
    if (typeof this.onInit === "function") {
      this.onInit()
    }
  }

  destroy() {
    if (typeof this.onDestroy === "function") {
      this.onDestroy()
    }
    const rm = window.removeEventListener
    rm('touchstart', this.windowTouchWrapper)
    rm('touchmove', this.windowTouchWrapper)
    rm('scroll', this.windowMouseMoveWrapper)
    rm('mousemove', this.windowMouseMoveWrapper)
    rm('resize', this.resize)
    window.cancelAnimationFrame(this.req)

    const scene = this.scene
    if (scene && scene.children) {
      clearThree(scene)
    }
    if (this.renderer) {
      if (this.renderer.domElement) {
        this.el.removeChild(this.renderer.domElement)
      }
      this.renderer = null
      this.scene = null
    }
  }
}

// --- SHADER BASE ---
class ShaderBase extends VantaBase {
  constructor(userOptions) {
    super(userOptions)
    this.updateUniforms = this.updateUniforms.bind(this)
  }
  init(){
    this.mode = 'shader'
    this.uniforms = {
      iTime: {
        type: "f",
        value: 1.0
      },
      iResolution: {
        type: "v2",
        value: new THREE.Vector2(1, 1)
      },
      iDpr: {
        type: "f",
        value: window.devicePixelRatio || 1
      },
      iMouse: {
        type: "v2",
        value: new THREE.Vector2(this.mouseX || 0, this.mouseY || 0)
      }
    }
    
    // OPTIMIZATION: On mobile, force shader to use fewer octaves (3 instead of 6) for performance
    if (mobileCheck() && this.fragmentShader) {
       this.fragmentShader = this.fragmentShader.replace('#define NUM_OCTAVES 6', '#define NUM_OCTAVES 3');
    }

    super.init()
    if (this.fragmentShader) {
      this.initBasicShader()
    }
  }
  setOptions(userOptions){
    super.setOptions(userOptions)
    this.updateUniforms()
  }
  initBasicShader(fragmentShader = this.fragmentShader, vertexShader = this.vertexShader) {
    if (!vertexShader) {
      vertexShader = "uniform float uTime;\nuniform vec2 uResolution;\nvoid main() {\n  gl_Position = vec4( position, 1.0 );\n}"
    }
    this.updateUniforms()
    if (typeof this.valuesChanger === "function") {
      this.valuesChanger() 
    }
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    })
    const texPath = this.options.texturePath
    if (texPath) {
      this.uniforms.iTex = {
        type: "t",
        value: new THREE.TextureLoader().load(texPath)
      }
    }
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    this.scene.add(mesh)
    this.camera = new THREE.Camera()
    this.camera.position.z = 1
  }

  updateUniforms() {
    const newUniforms = {}
    let k, v
    for (k in this.options) {
      v = this.options[k]
      if (k.toLowerCase().indexOf('color') !== -1) {
        newUniforms[k] = {
          type: "v3",
          value: new THREE.Color(v) 
        }
      } else if (typeof v === 'number') {
        newUniforms[k] = {
          type: "f",
          value: v
        }
      }
    }
    Object.assign(this.uniforms, newUniforms)
  }
  resize(){
    super.resize()
    this.uniforms.iResolution.value.x = this.width / this.scale
    this.uniforms.iResolution.value.y = this.height / this.scale
  }
}

// --- FOG EFFECT ---
class Fog extends ShaderBase {}

Fog.prototype.defaultOptions = {
  highlightColor: 0xffc300,
  midtoneColor: 0xff1f00,
  lowlightColor: 0x2d00ff,
  baseColor: 0xffebeb,
  blurFactor: 0.6,
  speed: 1.0,
  zoom: 1.0,
  scale: 2,
  scaleMobile: 4
};

Fog.prototype.fragmentShader = `\
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

uniform float blurFactor;
uniform vec3 baseColor;
uniform vec3 lowlightColor;
uniform vec3 midtoneColor;
uniform vec3 highlightColor;
uniform float zoom;

float random (in vec2 _st) {
  return fract(sin(dot(_st.xy,
                     vec2(0.129898,0.78233)))*
        437.585453123);
}

float noise (in vec2 _st) {
  vec2 i = floor(_st);
  vec2 f = fract(_st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
          (c - a)* u.y * (1.0 - u.x) +
          (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 6

float fbm ( in vec2 _st) {
  float v = 0.0;
  float a = blurFactor;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(_st);
      _st = rot * _st * 2.0 + shift;
      a *= (1. - blurFactor);
  }
  return v;
}

void main() {
  vec2 st = gl_FragCoord.xy / iResolution.xy*3.;
  st.x *= 0.7 * iResolution.x / iResolution.y ; 
  st *= zoom;

  vec3 color = vec3(0.0);

  vec2 q = vec2(0.);
  q.x = fbm( st + 0.00*iTime);
  q.y = fbm( st + vec2(1.0));

  vec2 dir = vec2(0.15,0.126);
  vec2 r = vec2(0.);
  r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ dir.x*iTime );
  r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ dir.y*iTime);

  float f = fbm(st+r);

  color = mix(baseColor,
              lowlightColor,
              clamp((f*f)*4.0,0.0,1.0));

  color = mix(color,
              midtoneColor,
              clamp(length(q),0.0,1.0));

  color = mix(color,
              highlightColor,
              clamp(length(r.x),0.0,1.0));

  vec3 finalColor = mix(baseColor, color, f*f*f+.6*f*f+.5*f);
  gl_FragColor = vec4(finalColor,1.0);
}
`;

export default (options) => new Fog(options)