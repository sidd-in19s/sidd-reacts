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
  meshColor = '#ff00ff',
  ambientColor = '#2900af',
  spotColor = '#e000ff',
  rectColor = '#0077ff',
  backgroundColor = '#121218',
  metalness = 0.58,
  roughness = 0.18,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const mCol = meshColor || config?.meshColor || config?.demo7MeshColor || '#ff00ff';
  const ambCol = ambientColor || config?.ambientColor || config?.demo7AmbientColor || '#2900af';
  const spCol = spotColor || config?.spotColor || config?.demo7SpotColor || '#e000ff';
  const rcCol = rectColor || config?.rectColor || config?.demo7RectColor || '#0077ff';
  const bgCol = backgroundColor || config?.backgroundColor || config?.demo7BgColor || '#121218';
  const met = metalness !== undefined ? metalness : (config?.metalness ?? config?.demo7Metalness ?? 0.58);
  const rough = roughness !== undefined ? roughness : (config?.roughness ?? config?.demo7Roughness ?? 0.18);

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

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 30, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    // Grid Setup
    const gutter = { size: 1.2 };
    const meshSize = 1.6;
    const groupMesh = new THREE.Object3D();
    const rows = 10;
    const cols = 16;
    const meshes = [];

    const boxGeo = new RoundedBoxGeometry(meshSize, meshSize, meshSize, 4, 0.1);
    const coneGeo = new THREE.ConeGeometry(meshSize * 0.7, meshSize * 1.2, 32);
    const torusGeo = new THREE.TorusGeometry(meshSize * 0.5, 0.25, 16, 32);

    const geometries = [boxGeo, coneGeo, torusGeo];

    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(livePropsRef.current.meshColor),
      metalness: livePropsRef.current.metalness,
      roughness: livePropsRef.current.roughness,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
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
        mesh.initialRotation = {
          x: Math.random() * Math.PI,
          y: Math.random() * Math.PI,
          z: Math.random() * Math.PI,
        };
        groupMesh.add(mesh);
        meshes[row][col] = mesh;
      }
    }

    const xMid = ((cols - 1) * (meshSize + gutter.size)) / 2;
    const zMid = ((rows - 1) * (meshSize + gutter.size)) / 2;
    groupMesh.position.set(-xMid, 0, -zMid);
    scene.add(groupMesh);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(200, 200);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);

    // Lighting
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color(livePropsRef.current.ambientColor),
      2.0
    );
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(
      new THREE.Color(livePropsRef.current.spotColor),
      800
    );
    spotLight.position.set(0, 40, 20);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const rectLight = new THREE.RectAreaLight(
      new THREE.Color(livePropsRef.current.rectColor),
      15,
      40,
      40
    );
    rectLight.position.set(0, 25, 0);
    rectLight.rotation.x = radians(90);
    scene.add(rectLight);

    const raycaster = new THREE.Raycaster();
    const mouse3D = new THREE.Vector2(-1000, -1000);

    const onPointerMove = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse3D.set(x, y);
    };

    mount.addEventListener('mousemove', onPointerMove);

    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const { backgroundColor: currentBg, ambientColor: currentAmb, spotColor: currentSpot, rectColor: currentRect, meshColor: currentMesh, metalness: currentMetal, roughness: currentRough } = livePropsRef.current;

      scene.background.set(currentBg);
      ambientLight.color.set(currentAmb);
      spotLight.color.set(currentSpot);
      rectLight.color.set(currentRect);
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

            const yDist = map(mouseDistance, 7, 0, 0, 8);
            const targetY = yDist < 0 ? 0 : yDist;

            gsap.to(mesh.position, {
              duration: 0.25,
              y: targetY,
              overwrite: 'auto',
            });

            const scaleFactor = 1 + targetY * 0.15;
            gsap.to(mesh.scale, {
              duration: 0.25,
              x: scaleFactor,
              y: scaleFactor,
              z: scaleFactor,
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