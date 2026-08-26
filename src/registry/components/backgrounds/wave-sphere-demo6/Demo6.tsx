// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface WaveSphereProps {
  color1?: string;
  color2?: string;
  linesCount?: number;
  speed?: number;
  className?: string;
  config?: any;
}

export const Demo6: React.FC<WaveSphereProps> = ({
  color1 = '#fe0e55',
  color2 = '#0077ff',
  linesCount = 30,
  speed = 1,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const c1 = color1 || config?.color1 || '#fe0e55';
  const c2 = color2 || config?.color2 || '#0077ff';
  const count = linesCount || config?.linesCount || 30;
  const spd = speed || config?.speed || 1;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || 800;
    let height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c0c12');

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const mat1 = new THREE.LineBasicMaterial({ color: new THREE.Color(c1), linewidth: 2 });
    const mat2 = new THREE.LineBasicMaterial({ color: new THREE.Color(c2), linewidth: 2 });

    const radius = 100;
    const verticesAmount = 64;

    const baseGeometryData = [];
    for (let i = 0; i <= verticesAmount; i++) {
      const angle = (i / verticesAmount) * Math.PI * 2;
      baseGeometryData.push({
        x: Math.cos(angle),
        z: Math.sin(angle),
      });
    }

    for (let j = 0; j < count; j++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((verticesAmount + 1) * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(geometry, j % 2 === 0 ? mat1 : mat2);
      line.userData = { y: (j / count) * radius * 2 };
      sphereGroup.add(line);
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    mount.addEventListener('mousemove', handleMouseMove);

    const start = Date.now();
    let animationId: number;

    const animate = () => {
      const now = Date.now() - start;

      sphereGroup.rotation.y += 0.002 * spd;
      sphereGroup.rotation.x += (mouseY * 0.5 - sphereGroup.rotation.x) * 0.05;
      sphereGroup.rotation.z += (mouseX * 0.5 - sphereGroup.rotation.z) * 0.05;

      sphereGroup.children.forEach((line) => {
        const data = line.userData;
        data.y += 0.4 * spd;
        if (data.y > radius * 2) {
          data.y = 0;
        }

        const val = data.y * (2 * radius - data.y);
        const radiusHeight = Math.sqrt(val > 0 ? val : 0);
        const positions = line.geometry.attributes.position.array;

        for (let i = 0; i <= verticesAmount; i++) {
          const base = baseGeometryData[i];
          const wave = Math.sin(i * 0.2 + now * 0.003 * spd + data.y * 0.05) * 8;
          const finalRadius = radiusHeight + wave;

          positions[i * 3] = base.x * finalRadius;
          positions[i * 3 + 1] = data.y - radius;
          positions[i * 3 + 2] = base.z * finalRadius;
        }

        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth || 800;
      height = mount.clientHeight || 500;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount) {
        mount.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      sphereGroup.children.forEach((c) => c.geometry.dispose());
      mat1.dispose();
      mat2.dispose();
      renderer.dispose();
    };
  }, [c1, c2, count, spd]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl bg-[#0c0c12] ${className}`}
    />
  );
};

export default Demo6;