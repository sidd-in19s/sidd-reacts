// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

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
  meshColor = '#a855f7',
  ambientColor = '#2900af',
  spotColor = '#00f0ff',
  rectColor = '#ec4899',
  backgroundColor = '#0c0c12',
  metalness = 0.45,
  roughness = 0.2,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const mCol = meshColor || config?.meshColor || config?.demo7MeshColor || '#a855f7';
  const ambCol = ambientColor || config?.ambientColor || config?.demo7AmbientColor || '#2900af';
  const spCol = spotColor || config?.spotColor || config?.demo7SpotColor || '#00f0ff';
  const rcCol = rectColor || config?.rectColor || config?.demo7RectColor || '#ec4899';
  const bgCol = backgroundColor || config?.backgroundColor || config?.demo7BgColor || '#0c0c12';
  const met = metalness !== undefined ? metalness : (config?.metalness ?? config?.demo7Metalness ?? 0.45);
  const rough = roughness !== undefined ? roughness : (config?.roughness ?? config?.demo7Roughness ?? 0.2);

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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(livePropsRef.current.backgroundColor);

    // Position camera with beautiful perspective viewing the 3D grid
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 24, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    // Grid Setup
    const gutter = { size: 1.1 };
    const meshSize = 1.5;
    const groupMesh = new THREE.Object3D();
    const rows = 9;
    const cols = 15;
    const meshes = [];

    const boxGeo = new RoundedBoxGeometry(meshSize, meshSize, meshSize, 4, 0.15);
    const coneGeo = new THREE.ConeGeometry(meshSize * 0.7, meshSize * 1.2, 32);
    const torusGeo = new THREE.TorusGeometry(meshSize * 0.5, 0.25, 16, 32);

    const geometries = [boxGeo, coneGeo, torusGeo];

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(livePropsRef.current.meshColor),
      metalness: livePropsRef.current.metalness,
      roughness: livePropsRef.current.roughness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
    });

    for (let row = 0; row < rows; row++) {
      meshes[row] = [];
      for (let col = 0; col < cols; col++) {
        const geoIndex = (row + col) % geometries.length;
        const mesh = new THREE.Mesh(geometries[geoIndex], material);
        mesh.position.set(
          col * (meshSize + gutter.size),
          0,
          row * (meshSize + gutter.size)
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI / 6;
        groupMesh.add(mesh);
        meshes[row][col] = mesh;
      }
    }

    const xMid = ((cols - 1) * (meshSize + gutter.size)) / 2;
    const zMid = ((rows - 1) * (meshSize + gutter.size)) / 2;
    groupMesh.position.set(-xMid, 0, -zMid);
    scene.add(groupMesh);

    // Floor Plane for shadow & raycasting
    const floorGeo = new THREE.PlaneGeometry(150, 150);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Multi-Light Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(20, 35, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const spotLight = new THREE.PointLight(
      new THREE.Color(livePropsRef.current.spotColor),
      80,
      60
    );
    spotLight.position.set(0, 20, 10);
    scene.add(spotLight);

    const fillLight = new THREE.PointLight(
      new THREE.Color(livePropsRef.current.rectColor),
      60,
      60
    );
    fillLight.position.set(-15, 15, -10);
    scene.add(fillLight);

    const raycaster = new THREE.Raycaster();
    const mouse3D = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 + 1);
      mouse3D.set(x, y);
    };

    mount.addEventListener('mousemove', onPointerMove);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const { backgroundColor: currentBg, spotColor: currentSpot, rectColor: currentRect, meshColor: currentMesh, metalness: currentMetal, roughness: currentRough } = livePropsRef.current;

      scene.background.set(currentBg);
      spotLight.color.set(currentSpot);
      fillLight.color.set(currentRect);
      material.color.set(currentMesh);
      material.metalness = currentMetal;
      material.roughness = currentRough;

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

            const yDist = map(mouseDistance, 8, 0, 0, 6.5);
            const targetY = yDist < 0 ? 0 : yDist;

            gsap.to(mesh.position, {
              duration: 0.3,
              y: targetY,
              overwrite: 'auto',
            });

            const scaleFactor = 1 + targetY * 0.18;
            gsap.to(mesh.scale, {
              duration: 0.3,
              x: scaleFactor,
              y: scaleFactor,
              z: scaleFactor,
              overwrite: 'auto',
            });

            gsap.to(mesh.rotation, {
              duration: 0.4,
              y: targetY * 0.5,
              overwrite: 'auto',
            });
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 800;
      height = mount.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (mount) {
        mount.removeEventListener('mousemove', onPointerMove);
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
    />
  );
};

export default Demo7;