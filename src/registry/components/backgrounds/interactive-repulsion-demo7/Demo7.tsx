// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

const radians = (degrees) => (degrees * Math.PI) / 180;
const distance = (x1, y1, x2, y2) => Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

export interface BoxRepulsionProps {
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
  meshColor = '#00f0ff',
  ambientColor = '#0a00b8',
  spotColor = '#00ffff',
  rectColor = '#ff0066',
  backgroundColor = '#070a14',
  metalness = 0.72,
  roughness = 0.12,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const mCol = meshColor || config?.meshColor || config?.demo7MeshColor || '#00f0ff';
  const ambCol = ambientColor || config?.ambientColor || config?.demo7AmbientColor || '#0a00b8';
  const spCol = spotColor || config?.spotColor || config?.demo7SpotColor || '#00ffff';
  const rcCol = rectColor || config?.rectColor || config?.demo7RectColor || '#ff0066';
  const bgCol = backgroundColor || config?.backgroundColor || config?.demo7BgColor || '#070a14';
  const met = metalness !== undefined ? metalness : (config?.metalness ?? config?.demo7Metalness ?? 0.72);
  const rough = roughness !== undefined ? roughness : (config?.roughness ?? config?.demo7Roughness ?? 0.12);

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

    // Top-down camera pointing directly at (0, 0, 0)
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 32, 0);
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

    // Lights setup matching portfolio
    const ambientLight = new THREE.AmbientLight(new THREE.Color(livePropsRef.current.ambientColor), 1.5);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(new THREE.Color(livePropsRef.current.spotColor), 3.0, 1000);
    spotLight.position.set(0, 28, 0);
    spotLight.decay = 0;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 50;
    spotLight.shadow.bias = -0.001;
    scene.add(spotLight);

    const rectLight = new THREE.RectAreaLight(new THREE.Color(livePropsRef.current.rectColor), 12.0, 2000, 2000);
    rectLight.position.set(5, 50, 50);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

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
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0;
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Geometric Templates
    const boxGeo = new RoundedBoxGeometry(1, 1, 1, 4, 0.12);
    const coneGeo = new THREE.ConeGeometry(0.5, 1, 32);
    const torusGeo = new THREE.TorusGeometry(0.4, 0.22, 16, 32);

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
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });

    // Adequate gutter spacing so objects never overlap or intersect when scaled up
    const gutter = { size: 1.6 };
    const stepSize = 1 + gutter.size;

    const getFrustumGrid = (w, h) => {
      const vHeight = 2 * Math.tan((45 * Math.PI) / 360) * 32;
      const vWidth = vHeight * (w / h);
      const c = Math.max(6, Math.floor((vWidth - 3) / stepSize));
      const r = Math.max(4, Math.floor((vHeight - 3) / stepSize));
      return { cols: c, rows: r };
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
            col * stepSize,
            0,
            row * stepSize
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

      const centerX = ((numCols - 1) * stepSize) * 0.5;
      const centerZ = ((numRows - 1) * stepSize) * 0.5;
      groupMesh.position.set(-centerX, 0, -centerZ);
    };

    buildGrid(cols, rows);
    scene.add(groupMesh);

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

    mount.addEventListener('mousemove', onPointerMove, { passive: true });
    mount.addEventListener('touchmove', onPointerMove, { passive: true });

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

            // Objects pop UP towards camera lens (in front of background and other objects)
            const yDist = map(mouseDistance, 5.5, 0, 0, 8.5);
            const targetY = yDist < 0.2 ? 0 : yDist;

            gsap.to(mesh.position, {
              duration: 0.22,
              y: targetY,
              overwrite: 'auto',
            });

            // Smooth scale factor capped to prevent overlapping
            const scaleFactor = 1 + (targetY / 8.5) * 0.7;
            const scale = targetY === 0 ? 1 : scaleFactor;

            gsap.to(mesh.scale, {
              duration: 0.35,
              ease: 'expo.out',
              x: scale,
              y: scale,
              z: scale,
              overwrite: 'auto',
            });

            gsap.to(mesh.rotation, {
              duration: 0.45,
              ease: 'expo.out',
              x: map(targetY, 0, 8.5, mesh.initialRotation.x, radians(45)),
              z: map(targetY, 0, 8.5, mesh.initialRotation.z, radians(-90)),
              y: map(targetY, 0, 8.5, mesh.initialRotation.y, radians(90)),
              overwrite: 'auto',
            });
          }
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