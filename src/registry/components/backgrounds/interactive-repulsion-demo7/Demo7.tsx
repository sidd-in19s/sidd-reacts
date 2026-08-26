// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

const radians = (degrees) => (degrees * Math.PI) / 180;
const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

export const DEMO7_PRESETS: Record<string, {
  name: string;
  bg: string;
  amb: string;
  spot: string;
  rect: string;
  mesh: string;
  met: number;
  rough: number;
}> = {
  'cyber-neon': {
    name: 'Cyber Neon',
    bg: '#070a14',
    amb: '#0a00b8',
    spot: '#00ffff',
    rect: '#ff0066',
    mesh: '#00f0ff',
    met: 0.72,
    rough: 0.12,
  },
  'original-default': {
    name: 'Original / Default',
    bg: '#1b1b1b',
    amb: '#2900af',
    spot: '#e000ff',
    rect: '#0077ff',
    mesh: '#ff00ff',
    met: 0.58,
    rough: 0.18,
  },
  'emerald-glow': {
    name: 'Emerald Glow',
    bg: '#06130c',
    amb: '#003318',
    spot: '#00ff88',
    rect: '#00d2ff',
    mesh: '#10b981',
    met: 0.65,
    rough: 0.20,
  },
  'gold-luxury': {
    name: 'Gold Luxury',
    bg: '#140f09',
    amb: '#421f00',
    spot: '#ffb700',
    rect: '#ff9100',
    mesh: '#ffd700',
    met: 0.85,
    rough: 0.15,
  },
  'midnight-violet': {
    name: 'Midnight Violet',
    bg: '#0a0514',
    amb: '#3b0764',
    spot: '#d946ef',
    rect: '#8b5cf6',
    mesh: '#c084fc',
    met: 0.60,
    rough: 0.15,
  },
};

export interface BoxRepulsionProps {
  preset?: string;
  meshColor?: string;
  ambientColor?: string;
  spotColor?: string;
  rectColor?: string;
  backgroundColor?: string;
  metalness?: number;
  roughness?: number;
  className?: string;
  config?: any;
}

export const Demo7: React.FC<BoxRepulsionProps> = ({
  preset = 'cyber-neon',
  meshColor,
  ambientColor,
  spotColor,
  rectColor,
  backgroundColor,
  metalness,
  roughness,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const activePreset = DEMO7_PRESETS[preset] || DEMO7_PRESETS['cyber-neon'];

  const mCol = meshColor || config?.meshColor || activePreset.mesh;
  const ambCol = ambientColor || config?.ambientColor || activePreset.amb;
  const spCol = spotColor || config?.spotColor || activePreset.spot;
  const rcCol = rectColor || config?.rectColor || activePreset.rect;
  const bgCol = backgroundColor || config?.backgroundColor || activePreset.bg;
  const met = metalness !== undefined ? metalness : (config?.metalness ?? activePreset.met);
  const rough = roughness !== undefined ? roughness : (config?.roughness ?? activePreset.rough);

  const livePropsRef = useRef({
    backgroundColor: bgCol,
    ambientColor: ambCol,
    spotColor: spCol,
    rectColor: rcCol,
    meshColor: mCol,
    metalness: met,
    roughness: rough,
  });

  useEffect(() => {
    livePropsRef.current = {
      backgroundColor: bgCol,
      ambientColor: ambCol,
      spotColor: spCol,
      rectColor: rcCol,
      meshColor: mCol,
      metalness: met,
      roughness: rough,
    };
  }, [bgCol, ambCol, spCol, rcCol, mCol, met, rough]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 500;

    try {
      RectAreaLightUniformsLib.init();
    } catch (e) {
      // already initialized
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(livePropsRef.current.backgroundColor);

    // Exact Camera positioning from Demo 2
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 30, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // --- LIGHTS MATCHING OFFICIAL DEMO 2 ---
    // 1. Ambient Light
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(livePropsRef.current.ambientColor),
      1.2
    );
    scene.add(ambientLight);

    // 2. Spot Light (Pointing directly onto the grid from top)
    const spotLight = new THREE.SpotLight(
      new THREE.Color(livePropsRef.current.spotColor),
      2.5,
      1000
    );
    spotLight.position.set(0, 27, 0);
    spotLight.decay = 0;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 50;
    spotLight.shadow.bias = -0.001;
    scene.add(spotLight);

    // 3. Rect Area Light (For metallic edge highlights)
    const rectLight = new THREE.RectAreaLight(
      new THREE.Color(livePropsRef.current.rectColor),
      10.0,
      2000,
      2000
    );
    rectLight.position.set(5, 50, 50);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // 4. Point Lights (Warm yellow & green rim accents)
    const pLight1 = new THREE.PointLight(0xfff000, 0.6, 1000);
    pLight1.position.set(0, 10, -100);
    pLight1.decay = 0;
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0xfff000, 0.6, 1000);
    pLight2.position.set(100, 10, 0);
    pLight2.decay = 0;
    scene.add(pLight2);

    const pLight3 = new THREE.PointLight(0x00ff00, 0.5, 1000);
    pLight3.position.set(20, 5, 20);
    pLight3.decay = 0;
    scene.add(pLight3);

    // Floor for shadows & raycasting
    const floorGeo = new THREE.PlaneGeometry(2000, 2000);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0;
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Geometries & Template Variations from Demo 2
    const boxGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.1);
    const coneGeo = new THREE.ConeGeometry(0.5, 1, 32);
    const torusGeo = new THREE.TorusGeometry(0.4, 0.25, 16, 32);

    const geometryTemplates = [
      { geom: boxGeo, rotationX: 0, rotationY: 0, rotationZ: 0 },
      { geom: boxGeo, rotationX: 0, rotationY: radians(45), rotationZ: 0 },
      { geom: boxGeo, rotationX: radians(45), rotationY: 0, rotationZ: 0 },
      { geom: torusGeo, rotationX: radians(90), rotationY: 0, rotationZ: 0 },
      { geom: coneGeo, rotationX: 0, rotationY: 0, rotationZ: radians(-180) },
    ];

    const getRandomTemplate = () =>
      geometryTemplates[Math.floor(Math.random() * geometryTemplates.length)];

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(livePropsRef.current.meshColor),
      metalness: livePropsRef.current.metalness,
      roughness: livePropsRef.current.roughness,
      emissive: new THREE.Color('#000000'),
      clearcoat: 0.4,
      clearcoatRoughness: 0.1,
    });

    const gutter = { size: 1.2 };
    const stepSize = 1 + gutter.size;

    const getFrustumGrid = (w, h) => {
      const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 30;
      const vWidth = vHeight * (w / h);
      const cols = Math.max(7, Math.floor((vWidth - 3) / stepSize));
      const rows = Math.max(5, Math.floor((vHeight - 3) / stepSize));
      return { cols, rows };
    };

    let { cols, rows } = getFrustumGrid(width, height);
    let meshes = [];
    const groupMesh = new THREE.Object3D();

    const buildGrid = (numCols, numRows) => {
      while (groupMesh.children.length > 0) {
        groupMesh.remove(groupMesh.children[0]);
      }
      meshes = [];

      for (let row = 0; row < numRows; row++) {
        meshes[row] = [];
        for (let col = 0; col < numCols; col++) {
          const tmpl = getRandomTemplate();
          const mesh = new THREE.Mesh(tmpl.geom, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          mesh.position.set(
            col + col * gutter.size,
            0,
            row + row * gutter.size
          );
          mesh.rotation.x = tmpl.rotationX;
          mesh.rotation.y = tmpl.rotationY;
          mesh.rotation.z = tmpl.rotationZ;

          mesh.initialRotation = {
            x: tmpl.rotationX,
            y: tmpl.rotationY,
            z: tmpl.rotationZ,
          };

          groupMesh.add(mesh);
          meshes[row][col] = mesh;
        }
      }

      const centerX = (numCols - 1 + (numCols - 1) * gutter.size) * 0.5;
      const centerZ = (numRows - 1 + (numRows - 1) * gutter.size) * 0.5;
      groupMesh.position.set(-centerX, 0, -centerZ);
    };

    buildGrid(cols, rows);
    scene.add(groupMesh);

    // Raycasting & Pointer Tracking
    const raycaster = new THREE.Raycaster();
    const mouse3D = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const clientX = 'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
      mouse3D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse3D.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerLeave = () => {
      mouse3D.set(-999, -999);
    };

    mount.addEventListener('mousemove', onPointerMove, { passive: true });
    mount.addEventListener('touchmove', onPointerMove, { passive: true });
    mount.addEventListener('mouseleave', onPointerLeave, { passive: true });

    onPointerMove({ clientX: width / 2, clientY: height / 2 });

    let animationId: number;

    const animate = () => {
      const {
        backgroundColor: bg,
        ambientColor: amb,
        spotColor: sp,
        rectColor: rc,
        meshColor: mc,
        metalness: metVal,
        roughness: roughVal,
      } = livePropsRef.current;

      scene.background.set(bg);
      ambientLight.color.set(amb);
      spotLight.color.set(sp);
      rectLight.color.set(rc);
      material.color.set(mc);
      material.metalness = metVal;
      material.roughness = roughVal;

      raycaster.setFromCamera(mouse3D, camera);
      const intersects = raycaster.intersectObjects([floor]);

      const hasPoint = intersects.length > 0;
      const px = hasPoint ? intersects[0].point.x : -9999;
      const pz = hasPoint ? intersects[0].point.z : -9999;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const mesh = meshes[row] && meshes[row][col];
          if (!mesh) continue;

          let targetY = 1;
          if (hasPoint) {
            const mouseDistance = distance(
              px,
              pz,
              mesh.position.x + groupMesh.position.x,
              mesh.position.z + groupMesh.position.z
            );
            const yDist = map(mouseDistance, 6, 0, 0, 10);
            targetY = yDist < 1 ? 1 : yDist;
          }

          gsap.to(mesh.position, {
            duration: 0.2,
            y: targetY,
            overwrite: 'auto',
          });

          const scaleFactor = targetY / 2.5;
          const scale = scaleFactor < 1 ? 1 : scaleFactor;

          gsap.to(mesh.scale, {
            duration: 0.4,
            ease: 'expo.out',
            x: scale,
            y: scale,
            z: scale,
            overwrite: 'auto',
          });

          gsap.to(mesh.rotation, {
            duration: 0.5,
            ease: 'expo.out',
            x: map(targetY, -1, 1, radians(45), mesh.initialRotation.x),
            z: map(targetY, -1, 1, radians(-90), mesh.initialRotation.z),
            y: map(targetY, -1, 1, radians(90), mesh.initialRotation.y),
            overwrite: 'auto',
          });
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 800;
      height = mount.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const newGrid = getFrustumGrid(width, height);
      if (newGrid.cols !== cols || newGrid.rows !== rows) {
        cols = newGrid.cols;
        rows = newGrid.rows;
        buildGrid(cols, rows);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      if (mount) {
        mount.removeEventListener('mousemove', onPointerMove);
        mount.removeEventListener('touchmove', onPointerMove);
        mount.removeEventListener('mouseleave', onPointerLeave);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      boxGeo.dispose();
      coneGeo.dispose();
      torusGeo.dispose();
      floorGeo.dispose();
      material.dispose();
      floorMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
      style={{ background: bgCol }}
    />
  );
};

export default Demo7;