// @ts-nocheck
// src/components/ThreeBackgrounds/Demo7.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

// Helpers from original interactive repulsive demo
const radians = (degrees) => (degrees * Math.PI) / 180;
const distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

const Demo7 = ({ config = {} }) => {
  const mountRef = useRef(null);

  // Extract config props with exact defaults from the original demo
  const backgroundColor = config.demo7BgColor || config.repulsiveBgColor || '#1b1b1b';
  const ambientColor = config.demo7AmbientColor || config.repulsiveAmbientColor || '#2900af';
  const spotColor = config.demo7SpotColor || config.repulsiveSpotColor || '#e000ff';
  const rectColor = config.demo7RectColor || config.repulsiveRectColor || '#0077ff';
  const meshColor = config.demo7MeshColor || config.repulsiveMeshColor || '#ff00ff';
  const metalness = Number(config.demo7Metalness ?? config.repulsiveMetalness ?? 0.58);
  const roughness = Number(config.demo7Roughness ?? config.repulsiveRoughness ?? 0.18);

  // Keep live references for colors & material so props update without scene recreation
  const livePropsRef = useRef({
    backgroundColor,
    ambientColor,
    spotColor,
    rectColor,
    meshColor,
    metalness,
    roughness
  });

  useEffect(() => {
    livePropsRef.current = {
      backgroundColor,
      ambientColor,
      spotColor,
      rectColor,
      meshColor,
      metalness,
      roughness
    };
  }, [backgroundColor, ambientColor, spotColor, rectColor, meshColor, metalness, roughness]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    // Initialize RectAreaLight uniforms
    try {
      RectAreaLightUniformsLib.init();
    } catch (e) {
      // already initialized
    }

    // --- SETUP SCENE & RENDERER ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(livePropsRef.current.backgroundColor);

    // Exact Camera positioning from demo
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 30, 0);
    camera.lookAt(0, 0, 0);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Keep tone mapping clean so magenta and ambient neon colors match original demo
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // --- LIGHTS MATCHING ORIGINAL REPO ---
    // 1. Ambient Light (Deep purple/indigo)
    const ambientLight = new THREE.AmbientLight(livePropsRef.current.ambientColor, 1.2);
    scene.add(ambientLight);

    // 2. Spot Light (Vibrant magenta pointing directly onto the grid)
    const spotLight = new THREE.SpotLight(livePropsRef.current.spotColor, 2.5, 1000);
    spotLight.position.set(0, 27, 0);
    spotLight.decay = 0;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 50;
    spotLight.shadow.bias = -0.001;
    scene.add(spotLight);

    // 3. Rect Area Light (Sky blue light for metallic edge highlights)
    const rectLight = new THREE.RectAreaLight(livePropsRef.current.rectColor, 10.0, 2000, 2000);
    rectLight.position.set(5, 50, 50);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // 4. Point Lights (Warm yellow & green rim accents from original demo)
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

    // --- FLOOR FOR SHADOWS & RAYCASTING ---
    const floorGeo = new THREE.PlaneGeometry(2000, 2000);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0;
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- GEOMETRIES ---
    const boxGeo = new RoundedBoxGeometry(0.5, 0.5, 0.5, 2, 0.04);
    const coneGeo = new THREE.ConeGeometry(0.3, 0.5, 32);
    const torusGeo = new THREE.TorusGeometry(0.3, 0.12, 24, 64);

    const geometryTemplates = [
      { geom: boxGeo, rotationX: 0, rotationY: 0, rotationZ: 0 },
      { geom: torusGeo, rotationX: radians(90), rotationY: 0, rotationZ: 0 },
      { geom: coneGeo, rotationX: 0, rotationY: 0, rotationZ: radians(-180) }
    ];

    const getRandomTemplate = () =>
      geometryTemplates[Math.floor(Math.random() * geometryTemplates.length)];

    // --- MESH MATERIAL WITH TRUE METALLIC HIGHLIGHTS ---
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(livePropsRef.current.meshColor),
      metalness: livePropsRef.current.metalness,
      roughness: livePropsRef.current.roughness,
      emissive: new THREE.Color('#000000'),
      clearcoat: 0.4,
      clearcoatRoughness: 0.1
    });

    // --- DYNAMIC FULL-SCREEN GRID COMPUTATION ---
    // Calculate visible frustum dimensions at y = 0 to cover the whole screen with a small margin
    const gutter = { size: 1.2 };
    const stepSize = 1 + gutter.size; // 2.2 units per cell

    const getFrustumGrid = (w, h) => {
      const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 30; // ~24.85
      const vWidth = vHeight * (w / h);
      // Small margin of ~3-4 units from screen boundaries
      const cols = Math.max(7, Math.floor((vWidth - 3) / stepSize));
      const rows = Math.max(5, Math.floor((vHeight - 3) / stepSize));
      return { cols, rows };
    };

    let { cols, rows } = getFrustumGrid(width, height);
    let meshes = [];
    let groupMesh = new THREE.Object3D();

    const buildGrid = (numCols, numRows) => {
      // Clean previous meshes
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
            z: tmpl.rotationZ
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

    // --- INTERACTION & RAYCASTING ---
    const raycaster = new THREE.Raycaster();
    const mouse3D = new THREE.Vector2(-999, -999);

    const onPointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = mount.getBoundingClientRect();
      mouse3D.x = ((clientX - rect.left) / width) * 2 - 1;
      mouse3D.y = -((clientY - rect.top) / height) * 2 + 1;
    };

    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      // Rebuild grid if screen proportions changed
      const newGrid = getFrustumGrid(width, height);
      if (newGrid.cols !== cols || newGrid.rows !== rows) {
        cols = newGrid.cols;
        rows = newGrid.rows;
        buildGrid(cols, rows);
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    // Initial center trigger
    onPointerMove({ clientX: width / 2, clientY: height / 2 });

    // --- ANIMATION LOOP ---
    let animationId;

    const animate = () => {
      // Live update material and light colors from props
      const {
        backgroundColor: bgCol,
        ambientColor: ambCol,
        spotColor: spCol,
        rectColor: rcCol,
        meshColor: mCol,
        metalness: met,
        roughness: rough
      } = livePropsRef.current;

      if (scene.background.getHexString() !== new THREE.Color(bgCol).getHexString()) {
        scene.background.set(bgCol);
      }
      if (ambientLight.color.getHexString() !== new THREE.Color(ambCol).getHexString()) {
        ambientLight.color.set(ambCol);
      }
      if (spotLight.color.getHexString() !== new THREE.Color(spCol).getHexString()) {
        spotLight.color.set(spCol);
      }
      if (rectLight.color.getHexString() !== new THREE.Color(rcCol).getHexString()) {
        rectLight.color.set(rcCol);
      }
      if (material.color.getHexString() !== new THREE.Color(mCol).getHexString()) {
        material.color.set(mCol);
      }
      if (material.metalness !== met) {
        material.metalness = met;
      }
      if (material.roughness !== rough) {
        material.roughness = rough;
      }

      // Raycasting for repulsive hover effect
      raycaster.setFromCamera(mouse3D, camera);
      const intersects = raycaster.intersectObjects([floor]);

      if (intersects.length > 0) {
        const { x, z } = intersects[0].point;

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const mesh = meshes[row] && meshes[row][col];
            if (!mesh) continue;

            const mouseDistance = distance(
              x,
              z,
              mesh.position.x + groupMesh.position.x,
              mesh.position.z + groupMesh.position.z
            );

            // Exact repulsive physics formula from the original demo
            const yDist = map(mouseDistance, 6, 0, 0, 10);
            const targetY = yDist < 1 ? 1 : yDist;

            gsap.to(mesh.position, {
              duration: 0.2,
              y: targetY,
              overwrite: 'auto'
            });

            const scaleFactor = mesh.position.y / 2.5;
            const scale = scaleFactor < 1 ? 1 : scaleFactor;

            gsap.to(mesh.scale, {
              duration: 0.4,
              ease: 'expo.out',
              x: scale,
              y: scale,
              z: scale,
              overwrite: 'auto'
            });

            gsap.to(mesh.rotation, {
              duration: 0.5,
              ease: 'expo.out',
              x: map(mesh.position.y, -1, 1, radians(45), mesh.initialRotation.x),
              z: map(mesh.position.y, -1, 1, radians(-90), mesh.initialRotation.z),
              y: map(mesh.position.y, -1, 1, radians(90), mesh.initialRotation.y),
              overwrite: 'auto'
            });
          }
        }
      }

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);

      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      renderer.dispose();
      boxGeo.dispose();
      coneGeo.dispose();
      torusGeo.dispose();
      floorGeo.dispose();
      material.dispose();
      floorMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: backgroundColor
      }}
    />
  );
};

export default Demo7;