// @ts-nocheck
// src/components/ThreeBackgrounds/Demo6.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Demo6 = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 280);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    
    // FIX: Set background to original Dark Grey color
    renderer.setClearColor(0x191919, 1);
    
    mount.appendChild(renderer.domElement);

    // --- SPHERE CREATION ---
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Two materials for slight color variation (Dark Grey & Indigo)
    const mat1 = new THREE.LineBasicMaterial({ color: 0x4a4a4a });
    const mat2 = new THREE.LineBasicMaterial({ color: 0x3F51B5 }); 

    const radius = 100;
    const lines = 50;
    const dots = 50;

    for (let i = 0; i < lines; i++) {
      // Create BufferGeometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(dots * 3);
      
      // Randomize ring properties
      const lineRadius = Math.floor(radius + (Math.random() - 0.5) * (radius * 0.2));
      const speed = Math.random() * 300 + 250;
      
      // We need to store the initial X positions to calculate the sine wave frame-by-frame
      // without accumulating errors or needing to read back from the GPU buffer.
      const initialX = [];

      // Initialize dots
      for (let j = 0; j < dots; j++) {
        // x calculation: distrubute dots across the diameter
        const x = ((j / dots) * lineRadius * 2) - lineRadius;
        initialX.push(x);
        
        positions[j * 3] = x;     // x
        positions[j * 3 + 1] = 0; // y (will be animated)
        positions[j * 3 + 2] = 0; // z
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Create Line
      const material = (Math.random() > 0.2) ? mat1 : mat2;
      const line = new THREE.Line(geometry, material);
      
      // Store props for animation
      line.userData = {
        radius: lineRadius,
        speed: speed,
        dots: dots,
        initialX: initialX // Save for reference in animation loop
      };

      // Random initial rotation to create the sphere shape
      line.rotation.x = Math.random() * Math.PI;
      line.rotation.y = Math.random() * Math.PI;
      line.rotation.z = Math.random() * Math.PI;

      sphereGroup.add(line);
    }

    // --- INTERACTION ---
    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    const start = Date.now();
    let animationId;

    const animate = () => {
      const now = Date.now() - start;

      // Update Lines
      sphereGroup.children.forEach(line => {
        const { radius, speed, dots, initialX } = line.userData;
        const positions = line.geometry.attributes.position.array;

        for (let j = 0; j < dots; j++) {
          const ix = j * 3;     // Index for X
          const iy = j * 3 + 1; // Index for Y
          
          // Read stable X from our JS array
          const x = initialX[j];
          
          // Wave Logic
          // ratio ensures the wave amplitude tapers off at the edges of the circle (where x is large)
          const ratio = 1 - ((radius - Math.abs(x)) / radius);
          
          // Sine wave calculation
          const y = Math.sin(now / speed + j * 0.15) * 12 * ratio;

          // Update Y in the buffer
          positions[iy] = y;
        }
        
        // Flag geometry for update
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Rotate entire sphere slowly
      sphereGroup.rotation.y = (now * 0.0001);
      sphereGroup.rotation.x = (-now * 0.0001);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mount) mount.removeChild(renderer.domElement);
      
      // Memory cleanup
      sphereGroup.children.forEach(c => c.geometry.dispose());
      mat1.dispose();
      mat2.dispose();
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
        background: '#191919' 
      }} 
    />
  );
};

export default Demo6;