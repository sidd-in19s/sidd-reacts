// @ts-nocheck
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export interface SilkWavesProps {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  className?: string;
}

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  if (!hex) return [0.48, 0.45, 0.5];
  const cleanHex = hex.replace('#', '');
  return [
    parseInt(cleanHex.slice(0, 2), 16) / 255,
    parseInt(cleanHex.slice(2, 4), 16) / 255,
    parseInt(cleanHex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vPosition = position;
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uSpeed;
  uniform float uScale;
  uniform float uRotation;
  uniform float uNoiseIntensity;
  
  const float e = 2.71828182845904523536;
  
  float noise(vec2 texCoord) {
    float G = e;
    vec2  r = (G * sin(G * texCoord));
    return fract(r.x * r.y * (1.0 + texCoord.x));
  }
  
  vec2 rotateUvs(vec2 uv, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    mat2  rot = mat2(c, -s, s, c);
    return rot * uv;
  }
  
  void main() {
    float rnd        = noise(gl_FragCoord.xy);
    vec2  uv         = rotateUvs(vUv * uScale, uRotation);
    vec2  tex        = uv * uScale;
    float tOffset    = uSpeed * uTime;
    
    tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
    float pattern = 0.6 +                  
                    0.4 * sin(5.0 * (tex.x + tex.y +                                   
                                     cos(3.0 * tex.x + 5.0 * tex.y) +                                   
                                     0.02 * tOffset) +                           
                             sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
    
    vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
    col.a = 1.0;
    gl_FragColor = col;
  }
`;

export const Demo3: React.FC<SilkWavesProps> = ({
  speed = 5,
  scale = 1,
  color = '#7B7481',
  noiseIntensity = 1.5,
  rotation = 0,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const [r, g, b] = hexToNormalizedRGB(color);

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new THREE.Color(r, g, b) },
      uRotation: { value: rotation },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      uniforms.uTime.value += 0.05 * clock.getDelta() * speed;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed, scale, color, noiseIntensity, rotation]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[400px] overflow-hidden rounded-2xl ${className}`}
    />
  );
};

export default Demo3;