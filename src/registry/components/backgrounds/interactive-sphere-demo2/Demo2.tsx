// @ts-nocheck
// src/components/ThreeBackgrounds/Demo2.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Vertex Shader
const demo2VertexShader = `
  attribute float size;
  attribute vec3 customPosition;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(customPosition, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment Shader
const demo2FragmentShader = `
  uniform sampler2D uTexture;
  
  void main() {
    vec4 texColor = texture2D(uTexture, gl_PointCoord);
    if (texColor.a < 0.1) discard;
    // Set color to white (1.0, 1.0, 1.0) with texture alpha
    gl_FragColor = vec4(1.0, 1.0, 1.0, texColor.a);
  }
`;

const Demo2 = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 80);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: false, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    
    // CHANGED: Set background to Black (0x000000)
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // --- GENERATE TEXTURE ---
    const getDotTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, 2 * Math.PI);
      // Dots are White
      ctx.fillStyle = 'white';
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    // --- OPTIMIZED SPHERE CREATION ---
    const radius = 145;
    
    // LOD System: Reduce detail based on performance
    const getOptimalDetail = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isLowEnd = navigator.hardwareConcurrency <= 4;
      
      if (isMobile || isLowEnd) return 28; 
      return 50; 
    };
    
    const detail = getOptimalDetail();
    const baseGeometry = new THREE.IcosahedronGeometry(radius, detail);
    const count = baseGeometry.attributes.position.count;

    console.log(`Rendering ${count} dots with detail level ${detail}`);

    // Use typed arrays for better performance
    const originalPositions = new Float32Array(count * 3);
    const customPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const animationData = new Array(count);

    // Determine dot size based on device
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const dotSize = isMobile ? 1.0 : 0.4;

    // Pre-calculate all animation parameters
    for (let i = 0; i < count; i++) {
      const x = baseGeometry.attributes.position.getX(i);
      const y = baseGeometry.attributes.position.getY(i);
      const z = baseGeometry.attributes.position.getZ(i);

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      customPositions[i * 3] = x;
      customPositions[i * 3 + 1] = y;
      customPositions[i * 3 + 2] = z;

      sizes[i] = dotSize;

      // Store animation state
      animationData[i] = {
        originalX: x,
        originalY: y,
        originalZ: z,
        phase: 0,
        delay: Math.abs(y * 0.025),
        startTime: performance.now() + (Math.abs(y * 0.025) * 1000)
      };
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('customPosition', new THREE.BufferAttribute(customPositions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: getDotTexture() }
      },
      vertexShader: demo2VertexShader,
      fragmentShader: demo2FragmentShader,
      transparent: true,
      depthTest: false,
      blending: THREE.AdditiveBlending // Makes white dots glow slightly against black
    });

    const dotsMesh = new THREE.Points(geometry, material);
    scene.add(dotsMesh);

    // --- OPTIMIZED ANIMATION FUNCTION ---
    const animationDuration = 4000; // 4 seconds
    const easingFunction = (t) => {
      // Back.out(1.7) easing approximation
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const updateAnimations = (currentTime) => {
      const customPosAttr = geometry.attributes.customPosition;
      let needsUpdate = false;

      for (let i = 0; i < count; i++) {
        const data = animationData[i];
        
        if (currentTime < data.startTime) continue;

        const elapsed = currentTime - data.startTime;
        const cycleTime = elapsed % (animationDuration * 2);
        
        let progress;
        if (cycleTime < animationDuration) {
          progress = cycleTime / animationDuration;
        } else {
          progress = 1 - ((cycleTime - animationDuration) / animationDuration);
        }

        const eased = easingFunction(progress);
        
        // Animate towards center
        const targetX = 0;
        const targetZ = 0;
        
        const newX = data.originalX + (targetX - data.originalX) * eased;
        const newZ = data.originalZ + (targetZ - data.originalZ) * eased;

        customPosAttr.setXYZ(i, newX, data.originalY, newZ);
        needsUpdate = true;
      }

      if (needsUpdate) {
        customPosAttr.needsUpdate = true;
      }
    };

    // --- INTERACTION ---
    const mouse = new THREE.Vector2(0.8, 0.5);
    const targetRotation = { x: 0, z: 0 };
    const currentRotation = { x: 0, z: 0 };

    const handleResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = (e.clientY / window.innerHeight) - 0.5;

      targetRotation.x = mouse.y * Math.PI * 0.5;
      targetRotation.z = mouse.x * Math.PI * 0.2;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // --- OPTIMIZED ANIMATION LOOP ---
    let animationId;
    let lastTime = performance.now();
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      
      // Throttle to target FPS
      if (deltaTime < frameInterval) return;
      
      lastTime = currentTime - (deltaTime % frameInterval);

      // Smooth rotation interpolation
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.z += (targetRotation.z - currentRotation.z) * 0.05;
      
      dotsMesh.rotation.x = currentRotation.x;
      dotsMesh.rotation.z = currentRotation.z;

      // Update wave animation
      updateAnimations(currentTime);

      renderer.render(scene, camera);
    };

    animate(performance.now());

    // --- CLEANUP ---
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      baseGeometry.dispose();
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
        // CHANGED: Set CSS background to Black
        background: '#000000' 
      }} 
    />
  );
};

export default Demo2;