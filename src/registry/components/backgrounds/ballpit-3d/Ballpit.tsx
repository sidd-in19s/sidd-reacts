// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface BallpitProps {
  count?: number;
  gravity?: number;
  friction?: number;
  wallBounce?: number;
  followCursor?: boolean;
  color1?: string;
  color2?: string;
  color3?: string;
  color4?: string;
  bgColor?: string;
  className?: string;
  config?: any;
}

export const Ballpit: React.FC<BallpitProps> = ({
  count = 100,
  gravity = 0.012,
  friction = 0.995,
  wallBounce = 0.92,
  followCursor = true,
  color1 = '#a855f7',
  color2 = '#ec4899',
  color3 = '#3b82f6',
  color4 = '#06b6d4',
  bgColor = '#060608',
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const numSpheres = count || config?.bpCount || 100;
  const grav = gravity || config?.bpGravity || 0.012;
  const frict = friction || config?.bpFriction || 0.995;
  const bounce = wallBounce || config?.bpWallBounce || 0.92;
  const palette = [
    color1 || config?.bpColor1 || '#a855f7',
    color2 || config?.bpColor2 || '#ec4899',
    color3 || config?.bpColor3 || '#3b82f6',
    color4 || config?.bpColor4 || '#06b6d4',
  ];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor || '#060608');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(20, 40, 30);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xa855f7, 3.0, 100);
    pointLight.position.set(-20, -20, 20);
    scene.add(pointLight);

    // Physical Instanced Spheres
    const sphereRadius = 1.0;
    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const instancedMesh = new THREE.InstancedMesh(geometry, material, numSpheres);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    // Particle Physics State
    const positions = new Float32Array(numSpheres * 3);
    const velocities = new Float32Array(numSpheres * 3);
    const radii = new Float32Array(numSpheres);

    const dummy = new THREE.Object3D();
    const colorObj = new THREE.Color();

    const boundX = 22;
    const boundY = 13;
    const boundZ = 12;

    for (let i = 0; i < numSpheres; i++) {
      const radScale = 0.6 + Math.random() * 0.7;
      radii[i] = sphereRadius * radScale;

      positions[i * 3] = (Math.random() - 0.5) * boundX * 1.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boundY * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * boundZ;

      velocities[i * 3] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      colorObj.set(palette[i % palette.length]);
      instancedMesh.setColorAt(i, colorObj);
    }
    if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

    // Mouse pointer interactive tracking
    const mouse = new THREE.Vector3(0, 0, 0);
    const handleMouseMove = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.set(normX * boundX, normY * boundY, 2);
    };

    mount.addEventListener('mousemove', handleMouseMove);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      for (let i = 0; i < numSpheres; i++) {
        const idx = i * 3;
        const r = radii[i];

        // Apply Gravity
        velocities[idx + 1] -= grav;

        // Apply Friction
        velocities[idx] *= frict;
        velocities[idx + 1] *= frict;
        velocities[idx + 2] *= frict;

        // Cursor Repulsion / Stirring
        if (followCursor) {
          const dx = positions[idx] - mouse.x;
          const dy = positions[idx + 1] - mouse.y;
          const dz = positions[idx + 2] - mouse.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < 45 && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / Math.sqrt(45)) * 0.4;
            velocities[idx] += (dx / dist) * force;
            velocities[idx + 1] += (dy / dist) * force;
            velocities[idx + 2] += (dz / dist) * force;
          }
        }

        // Update Positions
        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];

        // Box Wall Collisions
        if (positions[idx] + r > boundX) {
          positions[idx] = boundX - r;
          velocities[idx] = -velocities[idx] * bounce;
        } else if (positions[idx] - r < -boundX) {
          positions[idx] = -boundX + r;
          velocities[idx] = -velocities[idx] * bounce;
        }

        if (positions[idx + 1] + r > boundY) {
          positions[idx + 1] = boundY - r;
          velocities[idx + 1] = -velocities[idx + 1] * bounce;
        } else if (positions[idx + 1] - r < -boundY) {
          positions[idx + 1] = -boundY + r;
          velocities[idx + 1] = -velocities[idx + 1] * bounce;
        }

        if (positions[idx + 2] + r > boundZ) {
          positions[idx + 2] = boundZ - r;
          velocities[idx + 2] = -velocities[idx + 2] * bounce;
        } else if (positions[idx + 2] - r < -boundZ) {
          positions[idx + 2] = -boundZ + r;
          velocities[idx + 2] = -velocities[idx + 2] * bounce;
        }

        // Set Instance Matrix
        dummy.position.set(positions[idx], positions[idx + 1], positions[idx + 2]);
        dummy.scale.set(radii[i], radii[i], radii[i]);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 800;
      const h = mount.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mount) {
        mount.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [numSpheres, grav, frict, bounce, followCursor, color1, color2, color3, color4, bgColor]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
    />
  );
};

export default Ballpit;
