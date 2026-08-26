// @ts-nocheck
// src/components/BackgroundFSS.jsx
import React, { useRef, useEffect } from 'react';
import { FSS } from '../../../../utils/fss-lib';

// --- Helper Functions ---

const createMesh = (store, cfg, width, height) => {
  if (store.mesh) store.scene.remove(store.mesh);

  store.renderer.clear();

  // Create new geometry
  store.geometry = new FSS.Plane(
    width * cfg.width,
    height * cfg.height,
    cfg.segments,
    cfg.slices
  );

  store.material = new FSS.Material(cfg.meshAmbient, cfg.meshDiffuse);
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

  // 1. Create Background Lights (The standard ones)
  for (let i = 0; i < cfg.lightCount; i++) {
    let amb = i === 0 ? cfg.light1Ambient : cfg.light2Ambient;
    let diff = i === 0 ? cfg.light1Diffuse : cfg.light2Diffuse;

    const light = new FSS.Light(amb, diff);
    
    // Initial Random placement 
    light.position = FSS.Vector3.create(
      Math.randomInRange(-store.renderer.width/2, store.renderer.width/2),
      Math.randomInRange(-store.renderer.height/2, store.renderer.height/2),
      cfg.zOffset
    );

    store.scene.add(light);
    store.backgroundLights.push(light);
  }

  // 2. Create Cursor Light (If enabled)
  if (cfg.enableCursorLight) {
    // Pure black ambient to prevent washing out colors, uses specific Diffuse color
    const cursorLight = new FSS.Light('#000000', cfg.cursorLightColor);
    
    // Start at center
    cursorLight.position = FSS.Vector3.create(0, 0, cfg.zOffset);
    
    store.scene.add(cursorLight);
    store.cursorLight = cursorLight;
  }
};

const update = (store, cfg) => {
  const { renderer, geometry } = store;

  // --- 1. Update Specific Cursor Light (Always follows mouse if enabled) ---
  if (store.cursorLight && cfg.enableCursorLight) {
    const worldX = store.mouse.x - (renderer.width / 2);
    const worldY = (renderer.height / 2) - store.mouse.y;
    FSS.Vector3.set(store.cursorLight.position, worldX, worldY, cfg.zOffset);
  }

  // --- 2. Update Background Lights ---
  if (cfg.autopilot) {
    // >> AUTOPILOT ON: Mathematical Sine Wave Animation
    const bounds = FSS.Vector3.create(renderer.width, renderer.height, cfg.zOffset);
    const timeSpeed = cfg.speed * 0.001; 
    
    for (let l = 0; l < store.backgroundLights.length; l++) {
      const light = store.backgroundLights[l];
      FSS.Vector3.setZ(light.position, cfg.zOffset);

      const boundX = bounds[0];
      const boundY = bounds[1];
      
      const ox = Math.sin(store.now * timeSpeed * 0.7 + l);
      const oy = Math.cos(store.now * timeSpeed * 0.5 + l);

      FSS.Vector3.set(
        light.position,
        (boundX / 3) * ox,
        (boundY / 3) * oy,
        cfg.zOffset
      );
    }
  } 
  
  // --- 3. Animate Mesh Vertices (Only if Autopilot is ON) ---
  if (cfg.autopilot) {
    const vLen = geometry.vertices.length;
    const depth = cfg.depth; 
    const oscSpeed = cfg.speed * 0.002;

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


const BackgroundFSS = ({ config }) => {
  const containerRef = useRef(null);
  const outputRef = useRef(null);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

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

    store.start = Date.now();
    
    // Initial Mouse Center
    store.mouse.x = container.offsetWidth / 2;
    store.mouse.y = container.offsetHeight / 2;

    store.renderer = new FSS.CanvasRenderer();
    store.renderer.setSize(container.offsetWidth, container.offsetHeight);
    output.appendChild(store.renderer.element);

    store.scene = new FSS.Scene();

    createMesh(store, configRef.current, container.offsetWidth, container.offsetHeight);
    createLights(store, configRef.current);

    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      store.renderer.setSize(w, h);
      createMesh(store, configRef.current, w, h);
      createLights(store, configRef.current);
    };

    // --- Pointer Move Handler ---
    const handlePointerMove = (e) => {
      const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
      
      store.mouse.x = clientX;
      store.mouse.y = clientY;

      // >> AUTOPILOT OFF: INTERACTIVE MODE
      // Move background lights relative to cursor (Scatter Effect)
      if (configRef.current && !configRef.current.autopilot) {
        const w = store.renderer.width;
        const h = store.renderer.height;
        
        // Convert to World Coords
        const worldX = clientX - (w / 2);
        const worldY = (h / 2) - clientY;
        const z = configRef.current.zOffset;

        const count = store.backgroundLights.length;
        // Spread calculation (scatter lights around the cursor)
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
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    handleResize();

    const animate = () => {
      store.now = Date.now() - store.start;
      update(store, configRef.current);
      store.renderer.render(store.scene);
      store.animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(store.animationId);
      if (output && store.renderer && store.renderer.element && output.contains(store.renderer.element)) {
        output.removeChild(store.renderer.element);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Structural/Color updates
  useEffect(() => {
    const store = fssRef.current;
    if (!store.mesh) return;

    store.mesh.material.ambient.set(config.meshAmbient);
    store.mesh.material.diffuse.set(config.meshDiffuse);

    // Rebuild Geometry if needed
    if (
      store.geometry.segments !== config.segments ||
      store.geometry.slices !== config.slices ||
      store.geometry.width !== config.width || 
      store.geometry.height !== config.height
    ) {
      createMesh(store, config, store.renderer.width, store.renderer.height);
    }

    // Rebuild Lights if count changed or toggle changed
    const needsLightRebuild = 
      store.backgroundLights.length !== config.lightCount ||
      (config.enableCursorLight && !store.cursorLight) || 
      (!config.enableCursorLight && store.cursorLight);

    if (needsLightRebuild) {
      createLights(store, config);
    } else {
      // Update Colors "On the Fly" (Crucial for the subtle color shift animation)
      store.backgroundLights.forEach((light, index) => {
        if (index === 0) {
          light.ambient.set(config.light1Ambient);
          light.diffuse.set(config.light1Diffuse);
        } else {
          light.ambient.set(config.light2Ambient);
          light.diffuse.set(config.light2Diffuse);
        }
        FSS.Vector3.setZ(light.position, config.zOffset);
      });

      // Update Cursor Light Color
      if (store.cursorLight && config.enableCursorLight) {
        store.cursorLight.diffuse.set(config.cursorLightColor);
      }
    }
  }, [config]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: '#111'
      }}
    >
      <div ref={outputRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default BackgroundFSS;