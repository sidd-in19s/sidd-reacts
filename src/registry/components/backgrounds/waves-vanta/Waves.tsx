// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface WavesProps {
  wavesColor?: string;
  wavesShininess?: number;
  waveHeight?: number;
  waveSpeed?: number;
  className?: string;
  config?: any;
}

export const Waves: React.FC<WavesProps> = ({
  wavesColor = '#005588',
  wavesShininess = 30,
  waveHeight = 15,
  waveSpeed = 1,
  className = '',
  config = {},
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const color = wavesColor || config?.wavesColor || '#005588';
  const speed = waveSpeed || config?.wavesSpeed || 1;
  const height = waveHeight || config?.waveHeight || 15;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 800;
    const h = mount.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    scene.fog = new THREE.FogExp2('#030712', 0.002);

    const camera = new THREE.PerspectiveCamera(55, width / h, 1, 1000);
    camera.position.set(0, 120, 260);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Directional & Ambient Lights
    const ambient = new THREE.AmbientLight('#ffffff', 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight('#ffffff', 1.2);
    dirLight.position.set(100, 300, 100);
    scene.add(dirLight);

    // 3D Plane Mesh for Waves
    const geomWidth = 500;
    const geomHeight = 400;
    const segmentsX = 64;
    const segmentsY = 64;

    const geometry = new THREE.PlaneGeometry(geomWidth, geomHeight, segmentsX, segmentsY);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color).multiplyScalar(0.2),
      shininess: wavesShininess || 30,
      wireframe: false,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    const waveMesh = new THREE.Mesh(geometry, material);
    scene.add(waveMesh);

    const posAttr = geometry.attributes.position;
    const initialPositions = posAttr.array.slice();

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    mount.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02 * speed;

      const pos = posAttr.array;
      for (let i = 0; i < pos.length; i += 3) {
        const x = initialPositions[i];
        const z = initialPositions[i + 2];

        // Multi-frequency sinusoidal wave equation
        const wave1 = Math.sin(x * 0.03 + time * 1.5) * (height * 0.6);
        const wave2 = Math.cos(z * 0.04 + time * 1.2) * (height * 0.4);
        const wave3 = Math.sin((x + z) * 0.02 + time) * (height * 0.3);
        const mouseRepulsion = Math.exp(-((x - mouseX * 200) ** 2 + (z - mouseY * 150) ** 2) / 6000) * 18;

        pos[i + 1] = wave1 + wave2 + wave3 + mouseRepulsion;
      }

      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Gentle camera sway
      camera.position.x += (mouseX * 40 - camera.position.x) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 800;
      const h_new = mount.clientHeight || 500;
      camera.aspect = w / h_new;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h_new);
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
  }, [color, speed, height, wavesShininess]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
    />
  );
};

export default Waves;
