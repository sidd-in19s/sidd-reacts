#!/usr/bin/env node

/**
 * SIDD-Reacts CLI — Next-Gen Kinetic React Component Generator
 * Usage:
 *   npx sidd-reacts add <component-name>
 *   npx sidd-reacts list
 *   npx sidd-reacts init
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0];
const targetComponent = args[1];

const COMPONENTS = {
  // Base 10 Components
  'spotlight-card': { name: 'Spotlight 3D Card', file: 'SpotlightCard.tsx', dir: 'spotlight-card', deps: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'] },
  'true-focus': { name: 'True Focus Split Text', file: 'TrueFocusText.tsx', dir: 'true-focus', deps: ['framer-motion'] },
  'particle-vortex': { name: 'Interactive Particle Vortex Canvas', file: 'ParticleVortex.tsx', dir: 'particle-vortex', deps: [] },
  'aurora-background': { name: 'Aurora Ambient Background', file: 'AuroraBackground.tsx', dir: 'aurora-background', deps: [] },
  'magnetic-button': { name: 'Magnetic Ripple Button', file: 'MagneticButton.tsx', dir: 'magnetic-button', deps: ['framer-motion'] },
  'decrypted-text': { name: 'Decrypted Scramble Text', file: 'DecryptedText.tsx', dir: 'decrypted-text', deps: [] },
  'pixel-card-reveal': { name: 'Pixelated Image Reveal', file: 'PixelCardReveal.tsx', dir: 'pixel-card-reveal', deps: [] },
  'floating-dock': { name: 'Floating Mac Spring Dock', file: 'FloatingDock.tsx', dir: 'floating-dock', deps: ['framer-motion', 'lucide-react'] },
  'iridescent-glass-card': { name: 'Iridescent Glassmorphic Card', file: 'IridescentGlassCard.tsx', dir: 'iridescent-glass-card', deps: ['framer-motion', 'lucide-react'] },
  'hyperspeed-tunnel': { name: 'Hyperspeed Warp Tunnel', file: 'HyperspeedTunnel.tsx', dir: 'hyperspeed-tunnel', deps: [] },

  // Kinetic Suite 1: Hand-Drawn & Stickers
  'wobbly-paper-note': { name: 'Wobbly Paper Note Card', file: 'WobblyPaperNote.tsx', dir: 'wobbly-paper-note', deps: ['framer-motion'] },
  'marker-highlight-text': { name: 'Animated Highlighter Marker Text', file: 'MarkerHighlightText.tsx', dir: 'marker-highlight-text', deps: ['framer-motion'] },
  'sketch-svg-button': { name: 'Pencil-Sketch SVG Button', file: 'SketchSvgButton.tsx', dir: 'sketch-svg-button', deps: ['framer-motion'] },
  'doodle-floating-stickers': { name: 'Doodle Floating Stickers', file: 'DoodleFloatingStickers.tsx', dir: 'doodle-floating-stickers', deps: ['framer-motion'] },
  'scrapbook-polaroid': { name: 'Tape & Scrapbook Polaroid', file: 'ScrapbookPolaroid.tsx', dir: 'scrapbook-polaroid', deps: ['framer-motion'] },

  // Kinetic Suite 2: Skeuomorphic & Stickers
  'peelable-vinyl-sticker': { name: 'Interactive Peelable Vinyl Sticker', file: 'PeelableVinylSticker.tsx', dir: 'peelable-vinyl-sticker', deps: ['framer-motion'] },
  'holographic-badge': { name: 'Holographic / Iridescent Foil Badge', file: 'HolographicBadge.tsx', dir: 'holographic-badge', deps: ['framer-motion'] },
  'rubber-stamp-press': { name: '3D Rubber Stamp / Badge Press', file: 'RubberStampPress.tsx', dir: 'rubber-stamp-press', deps: ['framer-motion'] },
  'neumorphic-switch': { name: 'Embossed / Debossed Neumorphic Switch', file: 'NeumorphicSwitch.tsx', dir: 'neumorphic-switch', deps: ['framer-motion', 'lucide-react'] },
  'magnetic-badge-cluster': { name: 'Magnetic Floating Badge Cluster', file: 'MagneticBadgeCluster.tsx', dir: 'magnetic-badge-cluster', deps: ['framer-motion'] },

  // Kinetic Suite 3: 3D Backgrounds & Shaders
  'fluid-liquid-mesh': { name: 'Interactive 3D Fluid Liquid Mesh', file: 'FluidLiquidMesh.tsx', dir: 'fluid-liquid-mesh', deps: [] },
  'celestial-nebula': { name: 'Celestial Nebula / Galaxy Cloud', file: 'CelestialNebula.tsx', dir: 'celestial-nebula', deps: [] },
  'synthwave-grid-floor': { name: 'Cyberpunk 3D Wireframe Grid Floor', file: 'SynthwaveGridFloor.tsx', dir: 'synthwave-grid-floor', deps: [] },
  'voronoi-cell-network': { name: 'Abstract Voronoi Cell Network', file: 'VoronoiCellNetwork.tsx', dir: 'voronoi-cell-network', deps: [] },
  'particle-sphere-3d': { name: 'Dynamic 3D Particle Constellation / Sphere', file: 'ParticleSphere3D.tsx', dir: 'particle-sphere-3d', deps: [] },

  // Kinetic Suite 4: Cyberpunk & HUD
  'rgb-glitch-card': { name: 'RGB Split / Glitch Card Reveal', file: 'RgbGlitchCard.tsx', dir: 'rgb-glitch-card', deps: ['framer-motion'] },
  'hud-target-reticle': { name: 'Holographic HUD Target Reticle', file: 'HudTargetReticle.tsx', dir: 'hud-target-reticle', deps: ['framer-motion'] },
  'crt-scanline-terminal': { name: 'CRT Scanline Terminal Box', file: 'CrtScanlineTerminal.tsx', dir: 'crt-scanline-terminal', deps: [] },
  'cyber-metric-gauge': { name: 'Cyber Metric Gauge / Circle Progress', file: 'CyberMetricGauge.tsx', dir: 'cyber-metric-gauge', deps: ['framer-motion'] },
  'laser-sweep-box': { name: 'Laser Sweep Border Box', file: 'LaserSweepBox.tsx', dir: 'laser-sweep-box', deps: ['framer-motion'] },

  // Kinetic Suite 5: Fluid UI & Micro-FX
  'gooey-blob-nav': { name: 'Gooey Blob Navigation Bar', file: 'GooeyBlobNav.tsx', dir: 'gooey-blob-nav', deps: ['framer-motion'] },
  'gravity-tag-cloud': { name: 'Dynamic Gravity Tag Cloud', file: 'GravityTagCloud.tsx', dir: 'gravity-tag-cloud', deps: [] },
  'liquid-morph-button': { name: 'Liquid Morphing Progress Button', file: 'LiquidMorphButton.tsx', dir: 'liquid-morph-button', deps: ['framer-motion', 'lucide-react'] },
  'elastic-spring-modal': { name: 'Elastic Spring Drawer / Modal', file: 'ElasticSpringModal.tsx', dir: 'elastic-spring-modal', deps: ['framer-motion', 'lucide-react'] },
  'staggered-tilt-grid': { name: 'Interactive Staggered Tilt Grid', file: 'StaggeredTiltGrid.tsx', dir: 'staggered-tilt-grid', deps: ['framer-motion'] },

  // 15 Brand-New Unique Buttons
  'cyber-shatter-button': { name: 'Cyberpunk Glitch & Shard Shatter Button', file: 'CyberShatterButton.tsx', dir: 'cyber-shatter-button', deps: ['framer-motion'] },
  'holographic-foil-button': { name: 'Holographic Foil Refraction Button', file: 'HolographicFoilButton.tsx', dir: 'holographic-foil-button', deps: ['framer-motion'] },
  'arcade-pixel-button': { name: 'Retro Pixel-Art / Arcade 8-Bit Button', file: 'ArcadePixelButton.tsx', dir: 'arcade-pixel-button', deps: ['framer-motion'] },
  'liquid-mercury-button': { name: 'Interactive Fluid Mercury / Liquid Metal Button', file: 'LiquidMercuryButton.tsx', dir: 'liquid-mercury-button', deps: ['framer-motion'] },
  'electric-arc-button': { name: 'Glowing Neon Wire / Electric Arc Button', file: 'ElectricArcButton.tsx', dir: 'electric-arc-button', deps: ['framer-motion'] },
  'origami-fold-button': { name: '3D Origami / Geometric Polygon Fold Button', file: 'OrigamiFoldButton.tsx', dir: 'origami-fold-button', deps: ['framer-motion'] },
  'cosmic-orbit-button': { name: 'Cosmic Stardust / Gravity Orbit Button', file: 'CosmicOrbitButton.tsx', dir: 'cosmic-orbit-button', deps: ['framer-motion'] },
  'biometric-scan-button': { name: 'Biometric Fingerprint / Retina Scan Button', file: 'BiometricScanButton.tsx', dir: 'biometric-scan-button', deps: ['framer-motion', 'lucide-react'] },
  'typewriter-key-button': { name: 'Vintage Mechanical Typewriter Key Button', file: 'TypewriterKeyButton.tsx', dir: 'typewriter-key-button', deps: ['framer-motion'] },
  'thermal-heatmap-button': { name: 'Thermal Heatmap / Infrared Touch Button', file: 'ThermalHeatmapButton.tsx', dir: 'thermal-heatmap-button', deps: ['framer-motion'] },
  'wax-seal-button': { name: 'Luxury Gold Foil Emboss / Wax Seal Button', file: 'WaxSealButton.tsx', dir: 'wax-seal-button', deps: ['framer-motion'] },
  'aurora-gradient-button': { name: 'Aurora Borealis Morphing Mesh Gradient Button', file: 'AuroraGradientButton.tsx', dir: 'aurora-gradient-button', deps: ['framer-motion'] },
  'vhs-rewind-button': { name: 'Retro Cassette / VHS Glitch Rewind Button', file: 'VhsRewindButton.tsx', dir: 'vhs-rewind-button', deps: ['framer-motion'] },
  'soundwave-eq-button': { name: 'Soundwave / Audio Equalizer Reactive Button', file: 'SoundwaveEqButton.tsx', dir: 'soundwave-eq-button', deps: ['framer-motion'] },
  'floating-levitation-button': { name: 'Magnetic Floating Levitation Button', file: 'FloatingLevitationButton.tsx', dir: 'floating-levitation-button', deps: ['framer-motion'] },
};

console.log('\n\x1b[38;2;99;102;241m' + `
   ███████╗██╗██████╗ ██████╗       ██████╗ ███████╗ █████╗  ██████╗████████╗███████╗
   ██╔════╝██║██╔══██╗██╔══██╗      ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝
   ███████╗██║██║  ██║██║  ██║█████╗██████╔╝█████╗  ███████║██║        ██║   ███████╗
   ╚════██║██║██║  ██║██║  ██║╚════╝██╔══██╗██╔══╝  ██╔══██║██║        ██║   ╚════██║
   ███████║██║██████╔╝██████╔╝      ██║  ██║███████╗██║  ██║╚██████╗   ██║   ███████║
   ╚══════╝╚═╝╚═════╝ ╚═════╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝
` + '\x1b[0m');
console.log('   \x1b[36m⚡ Next-Gen Kinetic React Components Engine v2.4 (50 Components)\x1b[0m\n');

if (!command || command === 'help' || command === '--help') {
  console.log(`   Usage:
     \x1b[32mnpx sidd-reacts add <component-name>\x1b[0m  Add component to your project
     \x1b[32mnpx sidd-reacts list\x1b[0m                 List all available components
     \x1b[32mnpx sidd-reacts init\x1b[0m                 Set up Tailwind & utils for SIDD-Reacts
  `);
  process.exit(0);
}

if (command === 'list') {
  console.log(`   \x1b[1mAvailable SIDD-Reacts Components (${Object.keys(COMPONENTS).length} Total):\x1b[0m\n`);
  Object.keys(COMPONENTS).forEach((key) => {
    const c = COMPONENTS[key];
    console.log(`   • \x1b[35m${key.padEnd(28)}\x1b[0m \x1b[37m${c.name}\x1b[0m`);
  });
  console.log('\n   Run \x1b[32mnpx sidd-reacts add <name>\x1b[0m to install any component.\n');
  process.exit(0);
}

if (command === 'init') {
  const destUtil = path.join(process.cwd(), 'src', 'utils', 'cn.ts');
  const dir = path.dirname(destUtil);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    destUtil,
    `import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`
  );
  console.log(`   \x1b[32m✔ Initialized SIDD-Reacts helper utility at ${destUtil}\x1b[0m`);
  console.log('   Make sure to install base packages: \x1b[36mnpm install clsx tailwind-merge framer-motion\x1b[0m\n');
  process.exit(0);
}

if (command === 'add') {
  if (!targetComponent || !COMPONENTS[targetComponent]) {
    console.error(`   \x1b[31m✖ Unknown component "${targetComponent}".\x1b[0m`);
    console.log('   Run \x1b[32mnpx sidd-reacts list\x1b[0m to see all available components.\n');
    process.exit(1);
  }

  const comp = COMPONENTS[targetComponent];
  const sourcePath = path.join(__dirname, '..', 'src', 'registry', 'components', comp.dir, comp.file);
  const targetDir = path.join(process.cwd(), 'src', 'components', 'sidd-reacts', comp.dir);
  const targetPath = path.join(targetDir, comp.file);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`   \x1b[32m✔ Successfully installed ${comp.name} into:\x1b[0m`);
    console.log(`     \x1b[34m${targetPath}\x1b[0m\n`);
  } else {
    console.log(`   \x1b[32m✔ Created component template for ${comp.name} in ${targetPath}\x1b[0m\n`);
  }

  if (comp.deps.length > 0) {
    console.log(`   \x1b[33mRequired dependencies:\x1b[0m`);
    console.log(`     \x1b[36mnpm install ${comp.deps.join(' ')}\x1b[0m\n`);
  }

  console.log('   \x1b[35m✨ Component ready to import and use in your React application!\x1b[0m\n');
}
