// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../../../../utils/perlin';

export interface ScanningLinesProps {
  lineColor?: string;
  linesAmount?: number;
  radius?: number;
  speed?: number;
  noiseIntensity?: number;
  className?: string;
  config?: any;
}

export const Demo4: React.FC<ScanningLinesProps> = ({
  lineColor = '#fe0e55',
  linesAmount = 20,
  radius = 90,
  speed = 1,
  noiseIntensity = 15,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const colorHex = lineColor || config?.lineColor || '#fe0e55';
  const amount = linesAmount || config?.linesAmount || 20;
  const rad = radius || config?.radius || 90;
  const spd = speed || config?.speed || 1;
  const noiseScale = noiseIntensity || config?.noiseIntensity || 15;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const height = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0c0c12');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 350);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(colorHex),
      linewidth: 2,
    });

    const verticesAmount = 60;
    const baseGeometryData = [];
    for (let i = 0; i <= verticesAmount; i++) {
      const angle = (i / verticesAmount) * Math.PI * 2;
      baseGeometryData.push({
        x: Math.cos(angle),
        z: Math.sin(angle),
      });
    }

    for (let j = 0; j < amount; j++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((verticesAmount + 1) * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const line = new THREE.Line(geometry, material);
      line.userData = { y: (j / amount) * rad * 2 };
      sphereGroup.add(line);
    }

    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    mount.addEventListener('mousemove', handleMouseMove);

    const start = Date.now();
    let animationId: number;

    const animate = () => {
      const now = Date.now() - start;

      targetRotation.x = mouse.y * 0.6;
      targetRotation.y = mouse.x * 0.6;

      sphereGroup.rotation.x += (targetRotation.x - sphereGroup.rotation.x) * 0.05;
      sphereGroup.rotation.y += (targetRotation.y - sphereGroup.rotation.y) * 0.05;

      const dynamicNoise = noiseScale + Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 8;

      sphereGroup.children.forEach((line) => {
        const data = line.userData;
        data.y += 0.35 * spd;
        if (data.y > rad * 2) {
          data.y = 0;
        }

        const val = data.y * (2 * rad - data.y);
        const radiusHeight = Math.sqrt(val > 0 ? val : 0);
        const positions = line.geometry.attributes.position.array;

        if (window.noise && window.noise.simplex3) {
          for (let i = 0; i <= verticesAmount; i++) {
            const base = baseGeometryData[i];
            const px = base.x * radiusHeight;
            const pz = base.z * radiusHeight;
            const py = data.y;

            const ratio =
              window.noise.simplex3(
                px * 0.009,
                pz * 0.009 + now * 0.0006 * spd,
                py * 0.009
              ) * dynamicNoise;

            const finalRadius = radiusHeight + ratio;
            positions[i * 3] = base.x * finalRadius;
            positions[i * 3 + 1] = data.y - rad;
            positions[i * 3 + 2] = base.z * finalRadius;
          }
        }
        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
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
      window.removeEventListener('resize', handleResize);
      if (mount) {
        mount.removeEventListener('mousemove', handleMouseMove);
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      sphereGroup.children.forEach((line) => line.geometry.dispose());
      material.dispose();
      renderer.dispose();
    };
  }, [colorHex, amount, rad, spd, noiseScale]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl bg-[#0c0c12] ${className}`}
    />
  );
};

export default Demo4;