import { RegistryItem } from './types';

// Import the 11 Portfolio Background Components
import BackgroundFSS from './components/backgrounds/flat-surface-mesh/BackgroundFSS';
import Demo1 from './components/backgrounds/galaxy-demo1/Demo1';
import Demo2 from './components/backgrounds/interactive-sphere-demo2/Demo2';
import Demo3 from './components/backgrounds/silk-waves-demo3/Demo3';
import Demo4 from './components/backgrounds/scanning-lines-demo4/Demo4';
import Ballpit from './components/backgrounds/ballpit-3d/Ballpit';
import Demo6 from './components/backgrounds/wave-sphere-demo6/Demo6';
import Demo7 from './components/backgrounds/interactive-repulsion-demo7/Demo7';
import Fog from './components/backgrounds/fog-effect/Fog';
import Waves from './components/backgrounds/waves-vanta/Waves';
import PixelBlast from './components/backgrounds/pixel-blast-canvas/PixelBlast';

export const PORTFOLIO_BACKGROUNDS: RegistryItem[] = [
  {
    id: 'flat-surface-mesh',
    name: 'Flat Surface Shader (FSS Mesh)',
    category: 'backgrounds',
    badge: 'POPULAR',
    description: 'Dynamic 3D geometric polygon terrain with multi-source ambient lighting, specular shadows, and cursor gravity attraction.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add flat-surface-mesh',
    propsConfig: [
      { name: 'meshAmbient', label: 'Mesh Ambient Tint', type: 'color', defaultValue: '#424447' },
      { name: 'meshDiffuse', label: 'Mesh Diffuse Color', type: 'color', defaultValue: '#F6F6F6' },
      { name: 'light1Ambient', label: 'Light 1 Ambient', type: 'color', defaultValue: '#111BDB' },
      { name: 'light1Diffuse', label: 'Light 1 Diffuse', type: 'color', defaultValue: '#545454' },
      { name: 'segments', label: 'Mesh Segments', type: 'slider', defaultValue: 16, min: 6, max: 32, step: 2 },
      { name: 'slices', label: 'Mesh Slices', type: 'slider', defaultValue: 8, min: 4, max: 28, step: 2 },
      { name: 'speed', label: 'Wave Flow Speed', type: 'slider', defaultValue: 0.001, min: 0.0005, max: 0.005, step: 0.0005 },
    ],
    apiDocs: [
      { name: 'meshAmbient', type: 'string', default: "'#424447'", description: 'Base ambient color of the polygon mesh' },
      { name: 'meshDiffuse', type: 'string', default: "'#F6F6F6'", description: 'Base diffuse highlight color of the polygon mesh' },
      { name: 'light1Ambient', type: 'string', default: "'#111BDB'", description: 'Primary light source ambient color' },
      { name: 'light1Diffuse', type: 'string', default: "'#545454'", description: 'Primary light source diffuse highlight' },
    ],
    component: BackgroundFSS,
    codeTSX: `import React from 'react';
import { BackgroundFSS } from './BackgroundFSS';

export default function Demo() {
  return (
    <BackgroundFSS
      meshAmbient="#424447"
      meshDiffuse="#F6F6F6"
      light1Ambient="#111BDB"
      light1Diffuse="#545454"
      segments={16}
      slices={8}
    />
  );
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<BackgroundFSS meshAmbient="#334155" light1Ambient="#6366f1" />`,
  },

  {
    id: 'galaxy-demo1',
    name: 'Galaxy Starfield (Demo 1)',
    category: 'backgrounds',
    badge: 'HOT',
    description: 'Volumetric cosmic galaxy simulation rendered with custom GLSL shaders and deep space particle clouds.',
    dependencies: ['three', 'gsap'],
    cliCommand: 'npx sidd-reacts add galaxy-demo1',
    propsConfig: [],
    apiDocs: [],
    component: Demo1,
    codeTSX: `import React from 'react';
import { Demo1 } from './Demo1';

export default function Demo() {
  return <Demo1 />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo1 />`,
  },

  {
    id: 'interactive-sphere-demo2',
    name: 'Interactive Particle Sphere (Demo 2)',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Morphing particle sphere with mouse displacement physics and custom GPU vertex shaders.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add interactive-sphere-demo2',
    propsConfig: [],
    apiDocs: [],
    component: Demo2,
    codeTSX: `import React from 'react';
import { Demo2 } from './Demo2';

export default function Demo() {
  return <Demo2 />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo2 />`,
  },

  {
    id: 'silk-waves-demo3',
    name: 'Silk Waves (Demo 3)',
    category: 'backgrounds',
    badge: 'SPRING',
    description: 'Undulating silk fabric wave simulation in Three.js with real-time procedural noise dispersion.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add silk-waves-demo3',
    propsConfig: [
      { name: 'speed', label: 'Wave Flow Speed', type: 'slider', defaultValue: 5, min: 1, max: 15, step: 0.5 },
      { name: 'scale', label: 'Silk Scale', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.2 },
      { name: 'color', label: 'Silk Color', type: 'color', defaultValue: '#7B7481' },
      { name: 'noiseIntensity', label: 'Noise Intensity', type: 'slider', defaultValue: 1.5, min: 0.2, max: 4, step: 0.2 },
    ],
    apiDocs: [
      { name: 'speed', type: 'number', default: '5', description: 'Flow velocity of the silk waves' },
      { name: 'color', type: 'string', default: "'#7B7481'", description: 'Color tint of the silk surface' },
    ],
    component: Demo3,
    codeTSX: `import React from 'react';
import { Demo3 } from './Demo3';

export default function Demo() {
  return <Demo3 speed={5} color="#7B7481" />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo3 speed={5} color="#7B7481" />`,
  },

  {
    id: 'scanning-lines-demo4',
    name: 'Scanning Perlin Lines (Demo 4)',
    category: 'backgrounds',
    badge: 'NEW',
    description: 'Topographic contour scan lines animated with procedural 3D Perlin noise and cursor deflection.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add scanning-lines-demo4',
    propsConfig: [
      { name: 'lineColor', label: 'Contour Line Color', type: 'color', defaultValue: '#fe0e55' },
      { name: 'linesAmount', label: 'Number of Lines', type: 'slider', defaultValue: 20, min: 8, max: 45, step: 1 },
      { name: 'radius', label: 'Sphere Radius', type: 'slider', defaultValue: 90, min: 40, max: 150, step: 5 },
      { name: 'speed', label: 'Wave Scan Speed', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.1 },
      { name: 'noiseIntensity', label: 'Noise Turbulence', type: 'slider', defaultValue: 15, min: 2, max: 40, step: 1 },
    ],
    apiDocs: [
      { name: 'lineColor', type: 'string', default: "'#fe0e55'", description: 'Hex color of the animated scanning lines' },
      { name: 'linesAmount', type: 'number', default: '20', description: 'Total vertical slices' },
    ],
    component: Demo4,
    codeTSX: `import React from 'react';
import { Demo4 } from './Demo4';

export default function Demo() {
  return <Demo4 lineColor="#fe0e55" linesAmount={20} />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo4 lineColor="#fe0e55" linesAmount={20} />`,
  },

  {
    id: 'ballpit-3d',
    name: 'Interactive 3D Ballpit',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Physics-based 3D ballpit with bouncing spheres, gravity fields, wall restitution, and cursor ball collision.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add ballpit-3d',
    propsConfig: [
      { name: 'count', label: 'Ball Count', type: 'slider', defaultValue: 100, min: 20, max: 250, step: 10 },
      { name: 'gravity', label: 'Gravity', type: 'slider', defaultValue: 0.5, min: 0, max: 2, step: 0.05 },
      { name: 'friction', label: 'Friction', type: 'slider', defaultValue: 0.9975, min: 0.95, max: 0.9999, step: 0.0005 },
      { name: 'wallBounce', label: 'Wall Bounce', type: 'slider', defaultValue: 0.95, min: 0.5, max: 1.1, step: 0.05 },
      { name: 'color1', label: 'Ball Color 1', type: 'color', defaultValue: '#4f46e5' },
      { name: 'color2', label: 'Ball Color 2', type: 'color', defaultValue: '#ffffff' },
      { name: 'color3', label: 'Ball Color 3', type: 'color', defaultValue: '#ea580c' },
      { name: 'color4', label: 'Ball Color 4', type: 'color', defaultValue: '#22c55e' },
      { name: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#0c0c12' },
      { name: 'followCursor', label: 'Display Cursor', type: 'boolean', defaultValue: true },
    ],
    apiDocs: [
      { name: 'count', type: 'number', default: '100', description: 'Number of spheres in the ballpit' },
      { name: 'gravity', type: 'number', default: '0.5', description: 'Controls the gravity affecting the balls' },
      { name: 'friction', type: 'number', default: '0.9975', description: 'Sets the friction applied to ball movement' },
      { name: 'wallBounce', type: 'number', default: '0.95', description: 'Determines how much balls bounce off walls' },
      { name: 'colors', type: 'string[]', default: "['#4f46e5', '#ffffff', '#ea580c', '#22c55e']", description: 'Colors of the balls' },
      { name: 'followCursor', type: 'boolean', default: 'true', description: 'Enables or disables the sphere following the cursor' },
    ],
    component: Ballpit,
    codeTSX: `import React from 'react';
import { Ballpit } from './Ballpit';

export default function Demo() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', width: '100%' }}>
      <Ballpit
        count={100}
        gravity={0.5}
        friction={0.9975}
        wallBounce={0.95}
        followCursor={true}
        colors={['#4f46e5', '#ffffff', '#ea580c', '#22c55e']}
      />
    </div>
  );
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Ballpit count={100} gravity={0.5} colors={['#4f46e5', '#ffffff', '#ea580c', '#22c55e']} />`,
  },

  {
    id: 'wave-sphere-demo6',
    name: 'Wave Sphere (Demo 6)',
    category: 'backgrounds',
    badge: 'HOT',
    description: 'Interactive wireframe wave sphere pulsating with audio-reactive sinusoidal frequencies in 3D space.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add wave-sphere-demo6',
    propsConfig: [
      { name: 'color1', label: 'Line Color 1', type: 'color', defaultValue: '#fe0e55' },
      { name: 'color2', label: 'Line Color 2', type: 'color', defaultValue: '#0077ff' },
      { name: 'linesCount', label: 'Wave Lines Count', type: 'slider', defaultValue: 30, min: 10, max: 60, step: 2 },
      { name: 'speed', label: 'Pulsation Speed', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.1 },
    ],
    apiDocs: [
      { name: 'color1', type: 'string', default: "'#fe0e55'", description: 'Primary sinusoidal wire color' },
      { name: 'color2', type: 'string', default: "'#0077ff'", description: 'Secondary sinusoidal wire color' },
    ],
    component: Demo6,
    codeTSX: `import React from 'react';
import { Demo6 } from './Demo6';

export default function Demo() {
  return <Demo6 color1="#fe0e55" color2="#0077ff" linesCount={30} />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo6 color1="#fe0e55" color2="#0077ff" />`,
  },

  {
    id: 'interactive-repulsion-demo7',
    name: 'Interactive Box Repulsion Grid (Demo 7)',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Matrix of 3D rounded cubes that repel away from cursor proximity with spring dampening physics.',
    dependencies: ['three', 'gsap'],
    cliCommand: 'npx sidd-reacts add interactive-repulsion-demo7',
    propsConfig: [
      { name: 'meshColor', label: 'Mesh Geometry Color', type: 'color', defaultValue: '#ff00ff' },
      { name: 'ambientColor', label: 'Ambient Light Color', type: 'color', defaultValue: '#2900af' },
      { name: 'spotColor', label: 'Spotlight Beam Color', type: 'color', defaultValue: '#e000ff' },
      { name: 'rectColor', label: 'Rectangular Light Color', type: 'color', defaultValue: '#0077ff' },
      { name: 'metalness', label: 'Surface Metalness', type: 'slider', defaultValue: 0.58, min: 0, max: 1, step: 0.05 },
      { name: 'roughness', label: 'Surface Roughness', type: 'slider', defaultValue: 0.18, min: 0, max: 1, step: 0.05 },
      { name: 'backgroundColor', label: 'Scene Floor Tint', type: 'color', defaultValue: '#121218' },
    ],
    apiDocs: [
      { name: 'meshColor', type: 'string', default: "'#ff00ff'", description: 'Color of the 3D repulsive cubes and prisms' },
      { name: 'spotColor', type: 'string', default: "'#e000ff'", description: 'Color of the overhead spotlight' },
    ],
    component: Demo7,
    codeTSX: `import React from 'react';
import { Demo7 } from './Demo7';

export default function Demo() {
  return <Demo7 meshColor="#ff00ff" ambientColor="#2900af" spotColor="#e000ff" />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Demo7 meshColor="#ff00ff" spotColor="#e000ff" />`,
  },

  {
    id: 'fog-effect',
    name: 'Volumetric Fog Effect (Vanta)',
    category: 'backgrounds',
    badge: 'POPULAR',
    description: 'Soft multi-layered volumetric fog simulation with smooth procedural color blending and atmospheric depth.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add fog-effect',
    propsConfig: [
      { name: 'highlightColor', label: 'Highlight Glow', type: 'color', defaultValue: '#c084fc' },
      { name: 'midtoneColor', label: 'Midtone Color', type: 'color', defaultValue: '#6366f1' },
      { name: 'lowlightColor', label: 'Lowlight Color', type: 'color', defaultValue: '#1e1b4b' },
      { name: 'baseColor', label: 'Base Floor Color', type: 'color', defaultValue: '#090a0f' },
      { name: 'speed', label: 'Fog Drift Speed', type: 'slider', defaultValue: 1.5, min: 0.5, max: 4, step: 0.2 },
    ],
    apiDocs: [
      { name: 'highlightColor', type: 'string', default: "'#c084fc'", description: 'Upper atmospheric highlight tint' },
    ],
    component: Fog,
    codeTSX: `import React from 'react';
import { Fog } from './Fog';

export default function Demo() {
  return <Fog highlightColor="#c084fc" midtoneColor="#6366f1" speed={1.5} />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Fog highlightColor="#c084fc" midtoneColor="#6366f1" speed={1.5} />`,
  },

  {
    id: 'waves-vanta',
    name: 'Ocean Waves (Vanta)',
    category: 'backgrounds',
    badge: 'HOT',
    description: 'Interactive 3D ocean wave mesh with dynamic wave height, surface shininess, and fluid mouse ripples.',
    dependencies: ['three'],
    cliCommand: 'npx sidd-reacts add waves-vanta',
    propsConfig: [
      { name: 'wavesColor', label: 'Ocean Water Color', type: 'color', defaultValue: '#005588' },
      { name: 'wavesShininess', label: 'Surface Specular', type: 'slider', defaultValue: 30, min: 5, max: 80, step: 5 },
      { name: 'waveHeight', label: 'Wave Peak Height', type: 'slider', defaultValue: 15, min: 5, max: 40, step: 1 },
      { name: 'waveSpeed', label: 'Wave Speed', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.1 },
    ],
    apiDocs: [
      { name: 'wavesColor', type: 'string', default: "'#005588'", description: 'Primary ocean wave hex color' },
    ],
    component: Waves,
    codeTSX: `import React from 'react';
import { Waves } from './Waves';

export default function Demo() {
  return <Waves wavesColor="#005588" waveHeight={15} />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<Waves wavesColor="#005588" waveHeight={15} />`,
  },

  {
    id: 'pixel-blast-canvas',
    name: 'Pixel Blast Dither Canvas',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Bayer-dithered particle blast canvas with post-processing shaders, liquid ripples, and interactive touch displacement.',
    dependencies: ['three', 'postprocessing'],
    cliCommand: 'npx sidd-reacts add pixel-blast-canvas',
    propsConfig: [
      { name: 'variant', label: 'Particle Shape', type: 'select', defaultValue: 'square', options: [
        { label: 'Square', value: 'square' },
        { label: 'Circle', value: 'circle' },
        { label: 'Triangle', value: 'triangle' },
        { label: 'Diamond', value: 'diamond' }
      ] },
      { name: 'pixelSize', label: 'Pixel Size', type: 'slider', defaultValue: 6, min: 2, max: 18, step: 1 },
      { name: 'color', label: 'Pixel Tint', type: 'color', defaultValue: '#B19EEF' },
      { name: 'patternScale', label: 'Pattern Scale', type: 'slider', defaultValue: 3, min: 1, max: 8, step: 0.5 },
      { name: 'liquidStrength', label: 'Liquid Strength', type: 'slider', defaultValue: 0.1, min: 0, max: 0.5, step: 0.05 },
      { name: 'enableRipples', label: 'Enable Click Ripples', type: 'boolean', defaultValue: true },
    ],
    apiDocs: [
      { name: 'variant', type: "'square' | 'circle' | 'triangle' | 'diamond'", default: "'square'", description: 'Geometry type of dithered particles' },
      { name: 'color', type: 'string', default: "'#B19EEF'", description: 'Color tint of pixel blast particles' },
    ],
    component: PixelBlast,
    codeTSX: `import React from 'react';
import { PixelBlast } from './PixelBlast';

export default function Demo() {
  return <PixelBlast variant="square" pixelSize={6} color="#B19EEF" />;
}`,
    codeJSX: `// JSX version available`,
    demoUsage: `<PixelBlast variant="square" pixelSize={6} color="#B19EEF" />`,
  },
];
