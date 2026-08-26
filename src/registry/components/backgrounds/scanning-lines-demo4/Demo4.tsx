// @ts-nocheck
// src/components/ThreeBackgrounds/Demo4.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../../../../utils/perlin'; 

const Demo4 = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 350);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    
    // Transparent background for canvas so the Grey Div + SVG show through
    renderer.setClearColor(0x000000, 0); 

    // Explicitly position the canvas on top
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.zIndex = '2'; // Top Layer
    
    mount.appendChild(renderer.domElement);

    // --- SPHERE LINES CREATION ---
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const material = new THREE.LineBasicMaterial({
      color: 0xfe0e55, // Pinkish Red
      linewidth: 2     // Request thicker lines (Note: WebGL limitation on some browsers may keep this at 1px)
    });

    const linesAmount = 20;
    const radius = 100;
    const verticesAmount = 50;

    // Pre-calculate Unit Circle
    const baseGeometryData = []; 
    for(let i = 0; i <= verticesAmount; i++) {
      const angle = (i / verticesAmount) * Math.PI * 2;
      baseGeometryData.push({
        x: Math.cos(angle),
        z: Math.sin(angle)
      });
    }

    // Initialize Lines
    for (let j = 0; j < linesAmount; j++) {
      const index = j;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array((verticesAmount + 1) * 3);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const line = new THREE.Line(geometry, material);
      
      line.userData = {
        y: (index / linesAmount) * radius * 2
      };

      sphereGroup.add(line);
    }

    // --- INTERACTION VARIABLES ---
    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);
    const rotationSensitivity = 0.5; 
    let noiseIntensity = 15; 

    // --- HANDLERS ---
    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // --- RENDER LOOP ---
    const start = Date.now();
    let animationId;

    const animate = () => {
      const now = Date.now() - start;
      
      // 1. Smooth Rotation
      targetRotation.x = mouse.y * rotationSensitivity;
      targetRotation.y = mouse.x * rotationSensitivity;

      sphereGroup.rotation.x += (targetRotation.x - sphereGroup.rotation.x) * 0.05;
      sphereGroup.rotation.y += (targetRotation.y - sphereGroup.rotation.y) * 0.05;

      // 2. Dynamic Noise Intensity
      const mouseDist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
      const targetIntensity = 15 + (mouseDist * 10); 
      noiseIntensity += (targetIntensity - noiseIntensity) * 0.1;

      // 3. Update Lines
      sphereGroup.children.forEach(line => {
        const data = line.userData;
        
        // Move line upwards
        data.y += 0.3;
        if (data.y > radius * 2) {
          data.y = 0;
        }

        // Sphere equation
        const val = data.y * (2 * radius - data.y);
        const radiusHeight = Math.sqrt(val > 0 ? val : 0);

        const positions = line.geometry.attributes.position.array;
        
        if (window.noise && window.noise.simplex3) {
          for (let i = 0; i <= verticesAmount; i++) {
            const base = baseGeometryData[i];
            
            const px = base.x * radiusHeight;
            const pz = base.z * radiusHeight;
            const py = data.y;

            // FIX: Using 'now' (Time) instead of 'a'
            const ratio = window.noise.simplex3(
              px * 0.009, 
              pz * 0.009 + now * 0.0006, 
              py * 0.009
            ) * noiseIntensity; 

            const finalRadius = radiusHeight + ratio;

            positions[i * 3]     = base.x * finalRadius;
            positions[i * 3 + 1] = data.y - radius; 
            positions[i * 3 + 2] = base.z * finalRadius;
          }
        }
        
        line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      sphereGroup.children.forEach(line => line.geometry.dispose());
      material.dispose();
      renderer.dispose();
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
        backgroundColor: '#202020ff', // Layer 1: Grey Background
        overflow: 'hidden'
      }} 
    >
      {/* Layer 2: Black SVG Image */}
      <img 
        src="/img/X.svg" 
        alt="" 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: '80vmin', 
          width: 'auto',
          zIndex: 1, // Middle Layer
          pointerEvents: 'none',
          display: 'block' // Ensure no extra spacing
        }}
      />
      {/* Layer 3: Canvas (Added via JS with zIndex: 2) */}
    </div>
  );
};

export default Demo4;