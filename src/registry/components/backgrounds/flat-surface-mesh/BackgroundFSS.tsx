// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import { FSS } from '../../../../utils/fss-lib';

// Math helpers
Math.PIM2 = Math.PI * 2;
Math.randomInRange = (min, max) => min + (max - min) * Math.random();

const createMesh = (store, cfg, width, height) => {
  if (store.mesh) store.scene.remove(store.mesh);
  store.renderer.clear();

  store.geometry = new FSS.Plane(
    (width || 800) * (cfg.width || 1.2),
    (height || 500) * (cfg.height || 1.2),
    cfg.segments || 16,
    cfg.slices || 8
  );

  store.material = new FSS.Material(cfg.meshAmbient || '#334155', cfg.meshDiffuse || '#64748b');
  store.mesh = new FSS.Mesh(store.geometry, store.material);
  store.scene.add(store.mesh);

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
  for (let l = store.scene.lights.length - 1; l >= 0; l--) {
    store.scene.remove(store.scene.lights[l]);
  }
  store.cursorLight = null;
  store.backgroundLights = [];
  store.renderer.clear();

  const count = cfg.lightCount || 4;
  for (let i = 0; i < count; i++) {
    const amb = cfg.light1Ambient || '#6366f1';
    const diff = cfg.light1Diffuse || '#ec4899';

    const light = new FSS.Light(amb, diff);
    light.position = FSS.Vector3.create(
      Math.randomInRange(-store.renderer.width / 2, store.renderer.width / 2),
      Math.randomInRange(-store.renderer.height / 2, store.renderer.height / 2),
      cfg.zOffset || 100
    );
    light.step = FSS.Vector3.create(
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0),
      Math.randomInRange(0.2, 1.0)
    );
    light.time = Math.randomInRange(0, Math.PIM2);
    
    store.scene.add(light);
    store.backgroundLights.push(light);
  }
};

const update = (store, cfg) => {
  if (!store.renderer || !store.scene || !cfg) return;

  const width = store.renderer.width || 800;
  const height = store.renderer.height || 500;

  if (cfg.autopilot) {
    const lLen = store.backgroundLights.length;
    for (let l = 0; l < lLen; l++) {
      const light = store.backgroundLights[l];
      const ox = Math.sin(light.time + light.step[0] * store.now * (cfg.speed || 0.001));
      const oy = Math.cos(light.time + light.step[1] * store.now * (cfg.speed || 0.001));

      FSS.Vector3.set(
        light.position,
        (cfg.xRange || 0.8) * width / 2 * ox,
        (cfg.yRange || 0.1) * height / 2 * oy,
        cfg.zOffset || 100
      );
    }
  }

  const geometry = store.geometry;
  if (geometry) {
    const vLen = geometry.vertices.length;
    const oscSpeed = cfg.speed || 0.001;
    const depth = cfg.depth || 10;

    for (let v = 0; v < vLen; v++) {
      const vertex = geometry.vertices[v];
      const ox = Math.sin(vertex.time + vertex.step[0] * store.now * oscSpeed);
      const oy = Math.cos(vertex.time + vertex.step[1] * store.now * oscSpeed);
      const oz = Math.sin(vertex.time + vertex.step[2] * store.now * oscSpeed);

      FSS.Vector3.set(
        vertex.position,
        (cfg.xRange || 0.8) * geometry.segmentWidth * ox,
        (cfg.yRange || 0.1) * geometry.sliceHeight * oy,
        depth * oz
      );
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }
    geometry.dirty = true;
  }
};

export const BackgroundFSS: React.FC<any> = ({
  config = {},
  meshAmbient = '#334155',
  meshDiffuse = '#64748b',
  light1Ambient = '#6366f1',
  light1Diffuse = '#ec4899',
  segments = 16,
  slices = 8,
  speed = 0.001,
  className = '',
}) => {
  const effectiveConfig = {
    meshAmbient: meshAmbient || config?.meshAmbient || '#334155',
    meshDiffuse: meshDiffuse || config?.meshDiffuse || '#64748b',
    light1Ambient: light1Ambient || config?.light1Ambient || '#6366f1',
    light1Diffuse: light1Diffuse || config?.light1Diffuse || '#ec4899',
    lightCount: config?.lightCount || 4,
    zOffset: config?.zOffset || 100,
    width: config?.width || 1.2,
    height: config?.height || 1.2,
    depth: config?.depth || 10,
    segments: segments || config?.segments || 16,
    slices: slices || config?.slices || 8,
    xRange: config?.xRange || 0.8,
    yRange: config?.yRange || 0.1,
    speed: speed || config?.speed || 0.001,
    autopilot: config?.autopilot || false,
    enableCursorLight: config?.enableCursorLight || false,
    cursorLightColor: config?.cursorLightColor || '#FFFFFF',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const configRef = useRef(effectiveConfig);

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
    animationId: null,
  });

  // Mount effect
  useEffect(() => {
    const container = containerRef.current;
    const output = outputRef.current;
    const store = fssRef.current;
    if (!container || !output) return;

    store.start = Date.now();
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 500;

    store.mouse.x = w / 2;
    store.mouse.y = h / 2;

    store.renderer = new FSS.CanvasRenderer();
    store.renderer.setSize(w, h);
    output.appendChild(store.renderer.element);

    store.scene = new FSS.Scene();

    createMesh(store, configRef.current, w, h);
    createLights(store, configRef.current);

    const handleResize = () => {
      if (!container || !store.renderer) return;
      const rw = container.clientWidth || 800;
      const rh = container.clientHeight || 500;
      store.renderer.setSize(rw, rh);
      createMesh(store, configRef.current, rw, rh);
      createLights(store, configRef.current);
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      store.mouse.x = clientX;
      store.mouse.y = clientY;

      if (configRef.current && !configRef.current.autopilot && store.renderer) {
        const sw = store.renderer.width || 800;
        const sh = store.renderer.height || 500;
        const worldX = clientX - sw / 2;
        const worldY = sh / 2 - clientY;
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

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handlePointerMove);

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
      }
      if (store.animationId) {
        cancelAnimationFrame(store.animationId);
      }
      if (output && store.renderer?.element && output.contains(store.renderer.element)) {
        output.removeChild(store.renderer.element);
      }
    };
  }, []);

  // Real-time prop updates (live controls color, segments, slices, speed)
  useEffect(() => {
    configRef.current = effectiveConfig;
    const store = fssRef.current;
    if (!store || !store.material || !store.renderer) return;

    if (store.material.ambient) store.material.ambient.set(effectiveConfig.meshAmbient);
    if (store.material.diffuse) store.material.diffuse.set(effectiveConfig.meshDiffuse);

    if (store.backgroundLights && store.backgroundLights.length > 0) {
      store.backgroundLights.forEach((light) => {
        if (light.ambient) light.ambient.set(effectiveConfig.light1Ambient);
        if (light.diffuse) light.diffuse.set(effectiveConfig.light1Diffuse);
      });
    }

    if (containerRef.current) {
      createMesh(store, effectiveConfig, containerRef.current.clientWidth || 800, containerRef.current.clientHeight || 500);
    }
  }, [meshAmbient, meshDiffuse, light1Ambient, light1Diffuse, segments, slices, speed]);

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