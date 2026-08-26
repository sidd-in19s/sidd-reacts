// @ts-nocheck
// src/components/ThreeBackgrounds/Demo1.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

/* =========================================
   CUSTOM SHADERS (HIGH VISIBILITY VERSION)
   ========================================= */

const galaxyVertexShader = `
  uniform float uTime;
  uniform float uSize;
  
  attribute float aScale;
  attribute vec3 aRandomness;
  
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    
    // Intense Twinkling: Faster and more variation
    float twinkle = 1.0 + sin(uTime * 3.0 + aRandomness.x * 100.0) * 0.5;
    
    // Size attenuation
    gl_PointSize = (uSize * aScale * twinkle) * (400.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const galaxyFragmentShader = `
  varying vec3 vColor;
  uniform sampler2D uTexture;
  
  void main() {
    // Sample texture
    vec4 textureColor = texture2D(uTexture, gl_PointCoord);

    // Harder discard for cleaner, sharper stars
    if (textureColor.a < 0.5) discard;

    // Boost brightness
    gl_FragColor = vec4(vColor, 1.0) * textureColor;
  }
`;

// --- Helper: Generate a High-Contrast Glow Texture ---
const getGlowTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 64; // Higher resolution texture
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Sharp radial gradient for "Hot Star" look
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.9)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.premultiplyAlpha = true; 
  return texture;
};

const Demo1 = ({ config = {}, className = '' }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();
    
    // Deep fog to hide the very far edges
    scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    // Adjusted Camera: Closer and tilted to fill the screen
    camera.position.set(0, 0, 180); 
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
        antialias: false, // Disable AA for sharper stars and performance
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    mount.appendChild(renderer.domElement);

    // --- GALAXY PARAMETERS (MASSIVE SCALE) ---
    const parameters = {
        count: 20000,        // High density
        size: 8,             // Larger stars
        radius: 140,         // Huge radius to fill screen
        branches: 3,         // Fewer branches = More distinct "Black Portions" between them
        spin: 1,
        randomness: 0.2,
        randomnessPower: 5,  // High power = Tighter arms, cleaner voids
        insideColor: '#ff8833', // Bright Gold/Orange Core
        outsideColor: '#3366ff' // Electric Blue Outer Arms
    };

    let geometry = null;
    let material = null;
    let points = null;
    
    const dotStates = [];

    const generateGalaxy = () => {
        if(points !== null) {
            geometry.dispose();
            material.dispose();
            scene.remove(points);
        }

        geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const scales = new Float32Array(parameters.count);
        const randomness = new Float32Array(parameters.count * 3);

        const colorInside = new THREE.Color(parameters.insideColor);
        const colorOutside = new THREE.Color(parameters.outsideColor);

        for(let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // --- SPIRAL MATH ---
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;
            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

            positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
            // Increased vertical spread slightly for 3D volume
            positions[i3 + 1] = randomY * 4 + (Math.random() - 0.5) * 10; 
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

            // --- COLOR MIXING ---
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, radius / parameters.radius);

            colors[i3    ] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // --- ATTRIBUTES ---
            scales[i] = Math.random(); 
            randomness[i3] = Math.random();
            randomness[i3+1] = Math.random();
            randomness[i3+2] = Math.random();

            dotStates[i] = {
                baseScale: scales[i],
                currentScale: scales[i],
                isHovered: false
            };
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1)); 
        geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

        // --- SHADER MATERIAL ---
        material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            uniforms: {
                uTime: { value: 0 },
                uSize: { value: parameters.size * renderer.getPixelRatio() },
                uTexture: { value: getGlowTexture() }
            },
            vertexShader: galaxyVertexShader,
            fragmentShader: galaxyFragmentShader
        });

        points = new THREE.Points(geometry, material);
        // Tilt the whole galaxy slightly to face camera better
        points.rotation.x = 0.2; 
        scene.add(points);
    };

    generateGalaxy();

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 3.0; // Easier to hover
    
    const mouse = new THREE.Vector2(-100, -100); 
    const targetRotation = { x: 0.2, y: 0 };

    const handleMouseMove = (e) => {
        const rect = mount.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;

        // Interactive Tilt
        targetRotation.x = 0.2 - mouse.y * 0.1; 
        targetRotation.y = mouse.x * 0.1;
    };

    const handleResize = () => {
        width = mount.clientWidth;
        height = mount.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        
        if(material) {
            material.uniforms.uSize.value = parameters.size * renderer.getPixelRatio();
        }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // --- HOVER EFFECTS ---
    // Find this function and replace it completely
    const onDotHover = (index) => {
        const state = dotStates[index];
        if (state.isHovered) return;
        state.isHovered = true;

        gsap.to(state, {
            currentScale: 4.0,      // Target size
            duration: 0.4,
            ease: "back.out(1.7)",
            
            // --- ADDED SETTINGS ---
            yoyo: true,             // Go back to original size automatically
            repeat: 1,              // Run the cycle once (Up -> Wait -> Down)
            repeatDelay: 0,       // Wait 1.5 seconds before shrinking back
            // ----------------------

            onUpdate: () => {
                // Update the Three.js geometry
                geometry.attributes.aScale.setX(index, state.currentScale);
                geometry.attributes.aScale.needsUpdate = true;
            },
            onComplete: () => {
                // Reset flag so it can pop again if you re-hover later
                state.isHovered = false; 
            }
        });
    };

    const onDotLeave = (index) => {
        const state = dotStates[index];
        if (!state.isHovered) return;
        state.isHovered = false;

        gsap.to(state, {
            currentScale: state.baseScale,
            duration: 0.3,
            ease: "power2.out",
            onUpdate: () => {
                geometry.attributes.aScale.setX(index, state.currentScale);
                geometry.attributes.aScale.needsUpdate = true;
            }
        });
    };

    // --- ANIMATION LOOP ---
    let animationId;
    let lastIntersects = [];
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        if (material) {
            material.uniforms.uTime.value = elapsedTime;
        }

        if (points) {
            // Slower, majestic spin
            points.rotation.y = elapsedTime * 0.05;
            
            // Mouse Parallax Tilt
            points.rotation.x += (targetRotation.x - points.rotation.x) * 0.05;
            points.rotation.z += (targetRotation.y - points.rotation.z) * 0.05;
        }

        if (mouse.x > -1.1 && mouse.x < 1.1) {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(points);

            if (intersects.length > 0) {
                const hitIndex = intersects[0].index;
                if(lastIntersects.length === 0 || lastIntersects[0].index !== hitIndex) {
                    if(lastIntersects.length > 0) onDotLeave(lastIntersects[0].index);
                    onDotHover(hitIndex);
                }
                lastIntersects = intersects;
            } else if (lastIntersects.length > 0) {
                onDotLeave(lastIntersects[0].index);
                lastIntersects = [];
            }
        }

        renderer.render(scene, camera);
        animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        
        if (mount) mount.removeChild(renderer.domElement);
        
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        dotStates.forEach(state => gsap.killTweensOf(state));
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl bg-black ${className}`} 
    />
  );
};

export default Demo1;