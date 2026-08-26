// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { FSS } from '../../../../utils/fss-lib';

// --- Helper Functions ---

const createMesh = (store, cfg, width, height) => {
  if (store.mesh) store.scene.remove(store.mesh);

  store.renderer.clear();

  // Create new geometry
  store.geometry = new FSS.Plane(
    width * (cfg.width || 1.2),
    height * (cfg.height || 1.2),
    cfg.segments || 16,
    cfg.slices || 12
  );

  store.material = new FSS.Material(cfg.meshAmbient || '#334155', cfg.meshDiffuse || '#64748b');
  store.mesh = new FSS.Mesh(store.geometry, store.material);
  store.scene.add(store.mesh);

  // Augment vertices for animation
  const vLen = store.geometry.vertices.length;
  for (let v = 0; v < vLen; v++) {
    const vertex = store.geometry.vertices[v];
    vertex.anchor = FSS.Vector3.clone(vertex.position);
    vertex.step = FSS.Vector3.create(
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0)
    );
    vertex.time = Math.randomInRange(0, Math.PIM2);
  }
};

const createLights = (store, cfg) => {
  // Clear existing lights
  for (let l = store.scene.lights.length - 1; l >= 0; l--) {
    store.scene.remove(store.scene.lights[l]);
  }
  store.cursorLight = null; // Reset cursor light ref
  store.backgroundLights = []; // Reset bg lights tracker

  store.renderer.clear();

  const count = cfg.lightCount || 4;
  for (let i = 0; i < count; i++) {
    let amb = i === 0 ? (cfg.light1Ambient || '#6366f1') : (cfg.light2Ambient || '#3b82f6');
    let diff = i === 0 ? (cfg.light1Diffuse || '#ec4899') : (cfg.light2Diffuse || '#10b981');

    const light = new FSS.Light(amb, diff);
    
    light.position = FSS.Vector3.create(
      Math.randomInRange(-store.renderer.width/2, store.renderer.width/2),
      Math.randomInRange(-store.renderer.height/2, store.renderer.height/2),
      cfg.zOffset || 100
    );
    
    // Setup light speed / step vectors
    light.step = FSS.Vector3.create(
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0)
    );
    light.time = Math.randomInRange(0, Math.PIM2);
    
    store.scene.add(light);
    store.backgroundLights.push(light);
  }

  // 2. Create Cursor Light (Optionally)
  if (cfg.enableCursorLight) {
    const cLight = new FSS.Light(cfg.cursorLightColor || '#FFFFFF', cfg.cursorLightColor || '#FFFFFF');
    FSS.Vector3.setZ(cLight.position, cfg.zOffset || 100);
    store.scene.add(cLight);
    store.cursorLight = cLight;
  }
};

// Math helpers
Math.PIM2 = Math.PI * 2;
Math.randomInRange = (min, max) => min + (max - min) * Math.random();

const update = (store, cfg) => {
  if (!store.renderer || !store.scene || !cfg) return;

  const width = store.renderer.width;
  const height = store.renderer.height;

  // 1. Update Background Lights (Autopilot Animation)
  if (cfg.autopilot) {
    const lLen = store.backgroundLights.length;
    for (let l = 0; l < lLen; l++) {
      const light = store.backgroundLights[l];
      const ox = Math.sin(light.time + light.step[0] * store.now * cfg.speed);
      const oy = Math.cos(light.time + light.step[1] * store.now * cfg.speed);

      FSS.Vector3.set(
        light.position,
        cfg.xRange * width / 2 * ox,
        cfg.yRange * height / 2 * oy,
        cfg.zOffset
      );
    }
  }

  // 2. Update Vertices (Dynamic Mesh Oscillation)
  const geometry = store.geometry;
  if (geometry) {
    const vLen = geometry.vertices.length;
    const oscSpeed = cfg.speed;
    const depth = cfg.depth;

    for (let v = 0; v < vLen; v++) {
      const vertex = geometry.vertices[v];
      const ox = Math.sin(vertex.time + vertex.step[0] * store.now * oscSpeed);
      const oy = Math.cos(vertex.time + vertex.step[1] * store.now * oscSpeed);
      const oz = Math.sin(vertex.time + vertex.step[2] * store.now * oscSpeed);

      FSS.Vector3.set(
        vertex.position,
        cfg.xRange * geometry.segmentWidth * ox,
        cfg.yRange * geometry.sliceHeight * oy,
        depth * oz
      );
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }
    geometry.dirty = true;
  }
};

export const BackgroundFSS = ({
  config = {},
  meshAmbient,
  meshDiffuse,
  light1Ambient,
  light1Diffuse,
  segments,
  slices,
  className = '',
}) => {
  const effectiveConfig = {
    meshAmbient: meshAmbient || config?.meshAmbient || '#334155',
    meshDiffuse: meshDiffuse || config?.meshDiffuse || '#64748b',
    light1Ambient: light1Ambient || config?.light1Ambient || '#6366f1',
    light1Diffuse: light1Diffuse || config?.light1Diffuse || '#ec4899',
    light2Ambient: config?.light2Ambient || '#3b82f6',
    light2Diffuse: config?.light2Diffuse || '#10b981',
    lightCount: config?.lightCount || 4,
    zOffset: config?.zOffset || 100,
    width: config?.width || 1.2,
    height: config?.height || 1.2,
    depth: config?.depth || 10,
    segments: segments || config?.segments || 16,
    slices: slices || config?.slices || 12,
    xRange: config?.xRange || 0.8,
    yRange: config?.yRange || 0.1,
    speed: config?.speed || 0.001,
    autopilot: config?.autopilot || false,
    enableCursorLight: config?.enableCursorLight || false,
    cursorLightColor: config?.cursorLightColor || '#FFFFFF',
  };

  const containerRef = useRef(null);
  const outputRef = useRef(null);
  const configRef = useRef(effectiveConfig);

  useEffect(() => {
    configRef.current = effectiveConfig;
  }, [meshAmbient, meshDiffuse, light1Ambient, light1Diffuse, segments, slices, config]);

  const fssRef = useRef({
    renderer: null,
    scene: null,
    mesh: null,
    geometry: null,
    material: null,
    cursorLight: null,
    backgroundLights: [],
    mouse: { x: 0, y: 0 },
    now: 0,
    start: 0,
    animationId: null
  });

  useEffect(() => {
    const container = containerRef.current;
    const output = outputRef.current;
    const store = fssRef.current;
    if (!container || !output) return;

    store.start = Date.now();
    
    // Initial Mouse Center
    store.mouse.x = container.offsetWidth / 2;
    store.mouse.y = container.offsetHeight / 2;

    store.renderer = new FSS.CanvasRenderer();
    store.renderer.setSize(container.offsetWidth || 800, container.offsetHeight || 500);
    output.appendChild(store.renderer.element);

    store.scene = new FSS.Scene();

    createMesh(store, configRef.current, container.offsetWidth || 800, container.offsetHeight || 500);
    createLights(store, configRef.current);

    const handleResize = () => {
      if (!container) return;
      const w = container.offsetWidth || 800;
      const h = container.offsetHeight || 500;
      store.renderer.setSize(w, h);
      createMesh(store, configRef.current, w, h);
      createLights(store, configRef.current);
    };

    // --- Pointer Move Handler ---
    const handlePointerMove = (e) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = (e.touches && e.touches[0]) ? (e.touches[0].clientX - rect.left) : (e.clientX - rect.left);
      const clientY = (e.touches && e.touches[0]) ? (e.touches[0].clientY - rect.top) : (e.clientY - rect.top);
      
      store.mouse.x = clientX;
      store.mouse.y = clientY;

      // >> AUTOPILOT OFF: INTERACTIVE MODE
      if (configRef.current && !configRef.current.autopilot) {
        const w = store.renderer.width;
        const h = store.renderer.height;
        
        const worldX = clientX - (w / 2);
        const worldY = (h / 2) - clientY;
        const z = configRef.current.zOffset || 100;

        const count = store.backgroundLights.length;
        const spread = Math.max(0, Math.min(120, Math.floor(40 + (count - 1) * 8))); 

        for (let i = 0; i < count; i++) {
          const light = store.backgroundLights[i];
          const idxOffset = i - (count - 1) / 2;
          const spreadX = idxOffset * (spread / Math.max(1, count));
          const spreadY = Math.sin(i * 0.6) * (spread / Math.max(2, count));
          
          FSS.Vector3.set(light.position, worldX + spreadX, worldY + spreadY, z);
        }
      }
    };

    const handleTouchMove = (e) => {
      handlePointerMove(e);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    handleResize();

    const animate = () => {
      store.now = Date.now() - store.start;
      update(store, configRef.current);
      if (store.renderer && store.scene) {
        store.renderer.render(store.scene);
      }
      store.animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handlePointerMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      if (store.animationId) {
        cancelAnimationFrame(store.animationId);
      }
      if (output && store.renderer && store.renderer.element && output.contains(store.renderer.element)) {
        output.removeChild(store.renderer.element);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
      style={{ background: '#090a0f' }}
    >
      <div ref={outputRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default BackgroundFSS;