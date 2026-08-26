// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

class Engine {
  canvas;
  camera;
  cameraMinAspect;
  cameraMaxAspect;
  cameraFov;
  scene;
  renderer;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  onBeforeRender = () => {};
  onAfterRender = () => {};
  onAfterResize = () => {};
  isDisposed = false;

  #running = false;
  #timer = new THREE.Timer();
  #timeData = { elapsed: 0, delta: 0 };
  #animId = null;
  #resizeTimer = null;
  #resizeObserver = null;
  #intersectionObserver = null;
  #boundResize = this.#onResizeDebounced.bind(this);
  #boundVisibilityChange = this.#onVisibilityChange.bind(this);

  constructor(options = {}) {
    this.options = { ...options };
    this.camera = new THREE.PerspectiveCamera();
    this.cameraFov = this.camera.fov;
    this.scene = new THREE.Scene();

    this.canvas = options.canvas || document.createElement('canvas');
    this.canvas.style.display = 'block';

    const rendererOptions = {
      canvas: this.canvas,
      powerPreference: 'high-performance',
      antialias: true,
      alpha: true,
      ...(options.rendererOptions || {}),
    };

    try {
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
    } catch (e) {
      console.error('WebGLRenderer initialization fallback:', e);
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.resize();
    this.#setupListeners();
  }

  #setupListeners() {
    window.addEventListener('resize', this.#boundResize);
    if (this.canvas.parentNode) {
      this.#resizeObserver = new ResizeObserver(this.#onResizeDebounced.bind(this));
      this.#resizeObserver.observe(this.canvas.parentNode);
    }

    this.#intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.start();
      } else {
        this.stop();
      }
    }, { root: null, threshold: 0 });
    this.#intersectionObserver.observe(this.canvas);

    document.addEventListener('visibilitychange', this.#boundVisibilityChange);
  }

  #onVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }
  }

  #onResizeDebounced() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = setTimeout(() => this.resize(), 60);
  }

  resize() {
    if (this.isDisposed) return;
    let width, height;

    if (this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth || 800;
      height = this.canvas.parentNode.offsetHeight || 500;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    this.size.width = width || 800;
    this.size.height = height || 500;
    this.size.ratio = this.size.width / this.size.height;

    this.camera.aspect = this.size.ratio;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        const t = Math.tan(THREE.MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / this.cameraMinAspect);
        this.camera.fov = 2 * THREE.MathUtils.radToDeg(Math.atan(t));
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();

    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.length();
    this.size.wWidth = this.size.wHeight * this.camera.aspect;

    this.renderer.setSize(this.size.width, this.size.height, false);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;

    this.onAfterResize(this.size);
  }

  start() {
    if (this.#running || this.isDisposed) return;
    this.#running = true;
    this.#timer.reset();

    const loop = () => {
      if (!this.#running) return;
      this.#animId = requestAnimationFrame(loop);
      this.#timer.update();
      this.#timeData.delta = Math.min(this.#timer.getDelta(), 0.1);
      this.#timeData.elapsed += this.#timeData.delta;

      this.onBeforeRender(this.#timeData);
      this.renderer.render(this.scene, this.camera);
      this.onAfterRender(this.#timeData);
    };

    loop();
  }

  stop() {
    if (this.#animId) {
      cancelAnimationFrame(this.#animId);
      this.#animId = null;
    }
    this.#running = false;
  }

  clear() {
    this.scene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.isDisposed = true;
    this.stop();
    window.removeEventListener('resize', this.#boundResize);
    document.removeEventListener('visibilitychange', this.#boundVisibilityChange);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    this.clear();
    this.renderer.dispose();
  }
}

// Global Touch / Pointer Event Tracking
const activePointers = new Map();
const tempVec2 = new THREE.Vector2();
let isGlobalPointerListening = false;

function setupPointerTracker(options) {
  const tracker = {
    position: new THREE.Vector2(),
    nPosition: new THREE.Vector2(),
    hover: false,
    touching: false,
    onMove: () => {},
    onLeave: () => {},
    ...options,
  };

  const el = options.domElement;
  activePointers.set(el, tracker);

  if (!isGlobalPointerListening) {
    window.addEventListener('pointermove', onGlobalPointerMove, { passive: true });
    window.addEventListener('pointerleave', onGlobalPointerLeave, { passive: true });
    window.addEventListener('touchmove', onGlobalTouchMove, { passive: false });
    window.addEventListener('touchend', onGlobalTouchEnd, { passive: true });
    isGlobalPointerListening = true;
  }

  tracker.dispose = () => {
    activePointers.delete(el);
    if (activePointers.size === 0) {
      window.removeEventListener('pointermove', onGlobalPointerMove);
      window.removeEventListener('pointerleave', onGlobalPointerLeave);
      window.removeEventListener('touchmove', onGlobalTouchMove);
      window.removeEventListener('touchend', onGlobalTouchEnd);
      isGlobalPointerListening = false;
    }
  };

  return tracker;
}

function onGlobalPointerMove(e) {
  tempVec2.set(e.clientX, e.clientY);
  for (const [el, tracker] of activePointers) {
    const rect = el.getBoundingClientRect();
    if (
      tempVec2.x >= rect.left &&
      tempVec2.x <= rect.right &&
      tempVec2.y >= rect.top &&
      tempVec2.y <= rect.bottom
    ) {
      tracker.position.x = tempVec2.x - rect.left;
      tracker.position.y = tempVec2.y - rect.top;
      tracker.nPosition.x = (tracker.position.x / rect.width) * 2 - 1;
      tracker.nPosition.y = -(tracker.position.y / rect.height) * 2 + 1;
      if (!tracker.hover) {
        tracker.hover = true;
      }
      tracker.onMove(tracker);
    } else if (tracker.hover) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  }
}

function onGlobalPointerLeave() {
  for (const tracker of activePointers.values()) {
    if (tracker.hover) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  }
}

function onGlobalTouchMove(e) {
  if (e.touches.length > 0) {
    tempVec2.set(e.touches[0].clientX, e.touches[0].clientY);
    for (const [el, tracker] of activePointers) {
      const rect = el.getBoundingClientRect();
      if (
        tempVec2.x >= rect.left &&
        tempVec2.x <= rect.right &&
        tempVec2.y >= rect.top &&
        tempVec2.y <= rect.bottom
      ) {
        tracker.position.x = tempVec2.x - rect.left;
        tracker.position.y = tempVec2.y - rect.top;
        tracker.nPosition.x = (tracker.position.x / rect.width) * 2 - 1;
        tracker.nPosition.y = -(tracker.position.y / rect.height) * 2 + 1;
        tracker.touching = true;
        tracker.hover = true;
        tracker.onMove(tracker);
      }
    }
  }
}

function onGlobalTouchEnd() {
  for (const tracker of activePointers.values()) {
    if (tracker.touching) {
      tracker.touching = false;
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  }
}

// Physics & Collision Simulation
const { randFloat: rndF, randFloatSpread: rndSpread } = THREE.MathUtils;
const posF = new THREE.Vector3();
const posI = new THREE.Vector3();
const posO = new THREE.Vector3();
const velV = new THREE.Vector3();
const velB = new THREE.Vector3();
const velN = new THREE.Vector3();
const deltaVec = new THREE.Vector3();
const pushJ = new THREE.Vector3();
const impH = new THREE.Vector3();
const impT = new THREE.Vector3();

class BallpitPhysics {
  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new THREE.Vector3();
    this.resetPositions();
    this.setSizes();
  }

  resetPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const s = 3 * i;
      positionData[s] = rndSpread(2 * config.maxX);
      positionData[s + 1] = rndSpread(2 * config.maxY);
      positionData[s + 2] = rndSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = rndF(config.minSize, config.maxSize);
    }
  }

  update(timeData) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;

    if (config.controlSphere0) {
      startIndex = 1;
      posF.fromArray(positionData, 0);
      posF.lerp(center, 0.15).toArray(positionData, 0);
      velV.set(0, 0, 0).toArray(velocityData, 0);
    }

    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      posI.fromArray(positionData, base);
      velB.fromArray(velocityData, base);

      // Gentle float & slow gravity drop (scaled smoothly so low gravity floats gracefully)
      const gravFactor = timeData.delta * (config.gravity * 0.35) * sizeData[idx];
      velB.y -= gravFactor;

      // Micro float oscillation when gravity is low
      if (config.gravity < 0.3) {
        const floatWave = Math.sin(timeData.elapsed * 1.8 + idx * 0.5) * 0.0006 * (1 - config.gravity * 3);
        velB.y += floatWave;
      }

      velB.multiplyScalar(config.friction);
      velB.clampLength(0, config.maxVelocity);

      posI.add(velB);
      posI.toArray(positionData, base);
      velB.toArray(velocityData, base);
    }

    for (let idx = startIndex; idx < config.count; idx++) {
      const base = 3 * idx;
      posI.fromArray(positionData, base);
      velB.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        posO.fromArray(positionData, otherBase);
        velN.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];

        deltaVec.copy(posO).sub(posI);
        const dist = deltaVec.length();
        const sumRadius = radius + otherRadius;

        if (dist < sumRadius && dist > 0.001) {
          const overlap = sumRadius - dist;
          pushJ.copy(deltaVec).normalize().multiplyScalar(0.5 * overlap);
          impH.copy(pushJ).multiplyScalar(Math.max(velB.length(), 1));
          impT.copy(pushJ).multiplyScalar(Math.max(velN.length(), 1));

          posI.sub(pushJ);
          velB.sub(impH);
          posI.toArray(positionData, base);
          velB.toArray(velocityData, base);

          posO.add(pushJ);
          velN.add(impT);
          posO.toArray(positionData, otherBase);
          velN.toArray(velocityData, otherBase);
        }
      }

      if (config.controlSphere0) {
        deltaVec.copy(posF).sub(posI);
        const dist = deltaVec.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0 && dist > 0.001) {
          const diff = sumRadius0 - dist;
          pushJ.copy(deltaVec.normalize()).multiplyScalar(diff);
          impH.copy(pushJ).multiplyScalar(Math.max(velB.length(), 2));
          posI.sub(pushJ);
          velB.sub(impH);
        }
      }

      if (Math.abs(posI.x) + radius > config.maxX) {
        posI.x = Math.sign(posI.x) * (config.maxX - radius);
        velB.x = -velB.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(posI.y) + radius > config.maxY) {
          posI.y = Math.sign(posI.y) * (config.maxY - radius);
          velB.y = -velB.y * config.wallBounce;
        }
      } else if (posI.y - radius < -config.maxY) {
        posI.y = -config.maxY + radius;
        velB.y = -velB.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(posI.z) + radius > maxBoundary) {
        posI.z = Math.sign(posI.z) * (config.maxZ - radius);
        velB.z = -velB.z * config.wallBounce;
      }

      posI.toArray(positionData, base);
      velB.toArray(velocityData, base);
    }
  }
}

// Subsurface Scattering Material
class SubsurfaceMaterial extends THREE.MeshPhysicalMaterial {
  constructor(params = {}) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines = { USE_UV: '' };

    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }
        void main() {
        `
      );

      if (shader.fragmentShader.includes('RE_Direct(')) {
        shader.fragmentShader = shader.fragmentShader.replace(
          /RE_Direct\(\s*directLight,\s*geometryPosition,\s*geometryNormal,\s*geometryViewDir,\s*geometryClearcoatNormal,\s*material,\s*reflectedLight\s*\);/g,
          `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
          `
        );
      }
    };
  }
}

const DEFAULT_CONFIG = {
  count: 100,
  colors: ['#4f46e5', '#ffffff', '#ea580c', '#22c55e'],
  ambientColor: 0xffffff,
  ambientIntensity: 1.2,
  lightIntensity: 250,
  materialParams: {
    metalness: 0.35,
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  },
  minSize: 0.5,
  maxSize: 1.1,
  size0: 1.2,
  gravity: 0.1,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const dummyObj = new THREE.Object3D();

class BallpitGroup extends THREE.InstancedMesh {
  constructor(renderer, userConfig = {}) {
    const config = { ...DEFAULT_CONFIG, ...userConfig };

    let envTexture = null;
    try {
      if (renderer && renderer.capabilities && !renderer.capabilities.isWebGL2 === false) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const target = pmrem.fromScene(room, 0.04);
        envTexture = target.texture;
        pmrem.dispose();
      }
    } catch (e) {
      console.warn('PMREM environment generation skipped safely:', e);
    }

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new SubsurfaceMaterial({
      envMap: envTexture,
      ...config.materialParams,
    });
    if (envTexture) material.envMapRotation.x = -Math.PI / 2;

    super(geometry, material, config.count);
    this.config = config;
    this.physics = new BallpitPhysics(config);

    this.ambientLight = new THREE.AmbientLight(this.config.ambientColor, this.config.ambientIntensity);
    this.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    this.dirLight.position.set(10, 20, 15);
    this.add(this.dirLight);

    this.cursorLight = new THREE.PointLight(this.config.colors[0] || 0xffffff, this.config.lightIntensity);
    this.add(this.cursorLight);

    this.setColors(this.config.colors);
  }

  setColors(colorList) {
    if (Array.isArray(colorList) && colorList.length > 0) {
      const colors = colorList.map((c) => new THREE.Color(c));
      const outColor = new THREE.Color();

      for (let idx = 0; idx < this.count; idx++) {
        const ratio = idx / Math.max(1, this.count - 1);
        const scaled = ratio * (colors.length - 1);
        const i = Math.floor(scaled);
        const start = colors[i];
        if (i >= colors.length - 1) {
          outColor.copy(start);
        } else {
          const alpha = scaled - i;
          outColor.copy(start).lerp(colors[i + 1], alpha);
        }

        this.setColorAt(idx, outColor);
        if (idx === 0 && this.cursorLight) {
          this.cursorLight.color.copy(outColor);
        }
      }
      if (this.instanceColor) this.instanceColor.needsUpdate = true;
    }
  }

  update(timeData) {
    this.physics.update(timeData);
    for (let idx = 0; idx < this.count; idx++) {
      dummyObj.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        dummyObj.scale.setScalar(0);
      } else {
        dummyObj.scale.setScalar(this.physics.sizeData[idx]);
      }
      dummyObj.updateMatrix();
      this.setMatrixAt(idx, dummyObj.matrix);
      if (idx === 0 && this.cursorLight) {
        this.cursorLight.position.copy(dummyObj.position);
      }
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas, userConfig = {}) {
  const engine = new Engine({
    canvas,
    rendererOptions: { antialias: true, alpha: true },
  });

  engine.camera.position.set(0, 0, 20);
  engine.camera.lookAt(0, 0, 0);
  engine.cameraMaxAspect = 1.5;
  engine.resize();

  let ballGroup = null;

  function initGroup(cfg) {
    if (ballGroup) {
      engine.clear();
      engine.scene.remove(ballGroup);
    }
    ballGroup = new BallpitGroup(engine.renderer, cfg);
    engine.scene.add(ballGroup);
  }

  initGroup(userConfig);

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectPoint = new THREE.Vector3();

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';

  const pointerTracker = setupPointerTracker({
    domElement: canvas,
    onMove() {
      if (!ballGroup) return;
      raycaster.setFromCamera(pointerTracker.nPosition, engine.camera);
      engine.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectPoint);
      ballGroup.physics.center.copy(intersectPoint);
      ballGroup.config.controlSphere0 = true;
    },
    onLeave() {
      if (ballGroup) ballGroup.config.controlSphere0 = false;
    },
  });

  engine.onBeforeRender = (timeData) => {
    if (ballGroup) ballGroup.update(timeData);
  };

  engine.onAfterResize = (size) => {
    if (ballGroup) {
      ballGroup.config.maxX = size.wWidth / 2;
      ballGroup.config.maxY = size.wHeight / 2;
    }
  };

  engine.start();

  return {
    engine,
    updateConfig(newProps) {
      if (!ballGroup) return;
      if (newProps.count !== undefined && newProps.count !== ballGroup.config.count) {
        initGroup({ ...ballGroup.config, ...newProps });
      } else {
        Object.assign(ballGroup.config, newProps);
        if (newProps.colors) {
          ballGroup.setColors(ballGroup.config.colors);
        }
        if (newProps.minSize !== undefined || newProps.maxSize !== undefined || newProps.size0 !== undefined) {
          ballGroup.physics.setSizes();
        }
      }
    },
    dispose() {
      pointerTracker.dispose();
      engine.dispose();
    },
  };
}

export interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  colors?: string[] | number[];
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  bgColor?: string;
  minSize?: number;
  maxSize?: number;
  size0?: number;
  className?: string;
  config?: any;
}

export const Ballpit: React.FC<BallpitProps> = ({
  className = '',
  followCursor = true,
  count = 100,
  gravity = 0.1,
  friction = 0.9975,
  wallBounce = 0.95,
  colors,
  color1,
  color2,
  color3,
  color4,
  bgColor = '#0c0c12',
  minSize = 0.5,
  maxSize = 1.1,
  size0 = 1.2,
  ...restProps
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef(null);
  const isFirst = useRef(true);

  const effectiveColors = colors || [
    color1 || '#4f46e5',
    color2 || '#ffffff',
    color3 || '#ea580c',
    color4 || '#22c55e',
  ];

  const fullProps = {
    count,
    gravity,
    friction,
    wallBounce,
    followCursor,
    colors: effectiveColors,
    minSize,
    maxSize,
    size0,
    ...restProps,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    instanceRef.current = createBallpit(canvas, fullProps);

    return () => {
      if (instanceRef.current) {
        instanceRef.current.dispose();
        instanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (instanceRef.current) {
      instanceRef.current.updateConfig(fullProps);
    }
  }, [count, gravity, friction, wallBounce, followCursor, color1, color2, color3, color4, minSize, maxSize, size0]);

  return (
    <div
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: bgColor || '#0c0c12' }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default Ballpit;
