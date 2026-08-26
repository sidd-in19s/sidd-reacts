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
  // Text Animations (3)
  'true-focus': { name: 'True Focus Split Text', file: 'TrueFocusText.tsx', section: 'text', dir: 'true-focus', deps: ['framer-motion'] },
  'decrypted-text': { name: 'Decrypted Scramble Text', file: 'DecryptedText.tsx', section: 'text', dir: 'decrypted-text', deps: [] },
  'marker-highlight-text': { name: 'Animated Highlighter Marker Text', file: 'MarkerHighlightText.tsx', section: 'text', dir: 'marker-highlight-text', deps: ['framer-motion'] },

  // Buttons (21)
  'magnetic-button': { name: 'Magnetic Ripple Button', file: 'MagneticButton.tsx', section: 'buttons', dir: 'magnetic-button', deps: ['framer-motion'] },
  'sketch-svg-button': { name: 'Pencil-Sketch SVG Button', file: 'SketchSvgButton.tsx', section: 'buttons', dir: 'sketch-svg-button', deps: ['framer-motion'] },
  'liquid-morph-button': { name: 'Liquid Morphing Progress Button', file: 'LiquidMorphButton.tsx', section: 'buttons', dir: 'liquid-morph-button', deps: ['framer-motion', 'lucide-react'] },
  'rubber-stamp-press': { name: '3D Rubber Stamp / Badge Press', file: 'RubberStampPress.tsx', section: 'buttons', dir: 'rubber-stamp-press', deps: ['framer-motion'] },
  'neumorphic-switch': { name: 'Embossed / Debossed Neumorphic Switch', file: 'NeumorphicSwitch.tsx', section: 'buttons', dir: 'neumorphic-switch', deps: ['framer-motion', 'lucide-react'] },
  'peelable-vinyl-sticker': { name: 'Interactive Peelable Vinyl Sticker', file: 'PeelableVinylSticker.tsx', section: 'buttons', dir: 'peelable-vinyl-sticker', deps: ['framer-motion'] },
  'cyber-shatter-button': { name: 'Cyberpunk Glitch & Shard Shatter Button', file: 'CyberShatterButton.tsx', section: 'buttons', dir: 'cyber-shatter-button', deps: ['framer-motion'] },
  'holographic-foil-button': { name: 'Holographic Foil Refraction Button', file: 'HolographicFoilButton.tsx', section: 'buttons', dir: 'holographic-foil-button', deps: ['framer-motion'] },
  'arcade-pixel-button': { name: 'Retro Pixel-Art / Arcade 8-Bit Button', file: 'ArcadePixelButton.tsx', section: 'buttons', dir: 'arcade-pixel-button', deps: ['framer-motion'] },
  'liquid-mercury-button': { name: 'Interactive Fluid Mercury / Liquid Metal Button', file: 'LiquidMercuryButton.tsx', section: 'buttons', dir: 'liquid-mercury-button', deps: ['framer-motion'] },
  'electric-arc-button': { name: 'Glowing Neon Wire / Electric Arc Button', file: 'ElectricArcButton.tsx', section: 'buttons', dir: 'electric-arc-button', deps: ['framer-motion'] },
  'origami-fold-button': { name: '3D Origami / Geometric Polygon Fold Button', file: 'OrigamiFoldButton.tsx', section: 'buttons', dir: 'origami-fold-button', deps: ['framer-motion'] },
  'cosmic-orbit-button': { name: 'Cosmic Stardust / Gravity Orbit Button', file: 'CosmicOrbitButton.tsx', section: 'buttons', dir: 'cosmic-orbit-button', deps: ['framer-motion'] },
  'biometric-scan-button': { name: 'Biometric Fingerprint / Retina Scan Button', file: 'BiometricScanButton.tsx', section: 'buttons', dir: 'biometric-scan-button', deps: ['framer-motion', 'lucide-react'] },
  'typewriter-key-button': { name: 'Vintage Mechanical Typewriter Key Button', file: 'TypewriterKeyButton.tsx', section: 'buttons', dir: 'typewriter-key-button', deps: ['framer-motion'] },
  'thermal-heatmap-button': { name: 'Thermal Heatmap / Infrared Touch Button', file: 'ThermalHeatmapButton.tsx', section: 'buttons', dir: 'thermal-heatmap-button', deps: ['framer-motion'] },
  'wax-seal-button': { name: 'Luxury Gold Foil Emboss / Wax Seal Button', file: 'WaxSealButton.tsx', section: 'buttons', dir: 'wax-seal-button', deps: ['framer-motion'] },
  'aurora-gradient-button': { name: 'Aurora Borealis Morphing Mesh Gradient Button', file: 'AuroraGradientButton.tsx', section: 'buttons', dir: 'aurora-gradient-button', deps: ['framer-motion'] },
  'vhs-rewind-button': { name: 'Retro Cassette / VHS Glitch Rewind Button', file: 'VhsRewindButton.tsx', section: 'buttons', dir: 'vhs-rewind-button', deps: ['framer-motion'] },
  'soundwave-eq-button': { name: 'Soundwave / Audio Equalizer Reactive Button', file: 'SoundwaveEqButton.tsx', section: 'buttons', dir: 'soundwave-eq-button', deps: ['framer-motion'] },
  'floating-levitation-button': { name: 'Magnetic Floating Levitation Button', file: 'FloatingLevitationButton.tsx', section: 'buttons', dir: 'floating-levitation-button', deps: ['framer-motion'] },

  // Backgrounds (8)
  'aurora-background': { name: 'Aurora Ambient Background', file: 'AuroraBackground.tsx', section: 'backgrounds', dir: 'aurora-background', deps: [] },
  'particle-vortex': { name: 'Interactive Particle Vortex Canvas', file: 'ParticleVortex.tsx', section: 'backgrounds', dir: 'particle-vortex', deps: [] },
  'fluid-liquid-mesh': { name: 'Interactive 3D Fluid Liquid Mesh', file: 'FluidLiquidMesh.tsx', section: 'backgrounds', dir: 'fluid-liquid-mesh', deps: [] },
  'celestial-nebula': { name: 'Celestial Nebula / Galaxy Cloud', file: 'CelestialNebula.tsx', section: 'backgrounds', dir: 'celestial-nebula', deps: [] },
  'synthwave-grid-floor': { name: 'Cyberpunk 3D Wireframe Grid Floor', file: 'SynthwaveGridFloor.tsx', section: 'backgrounds', dir: 'synthwave-grid-floor', deps: [] },
  'voronoi-cell-network': { name: 'Abstract Voronoi Cell Network', file: 'VoronoiCellNetwork.tsx', section: 'backgrounds', dir: 'voronoi-cell-network', deps: [] },
  'particle-sphere-3d': { name: 'Dynamic 3D Particle Constellation / Sphere', file: 'ParticleSphere3D.tsx', section: 'backgrounds', dir: 'particle-sphere-3d', deps: [] },
  'hyperspeed-tunnel': { name: 'Hyperspeed Warp Tunnel', file: 'HyperspeedTunnel.tsx', section: 'backgrounds', dir: 'hyperspeed-tunnel', deps: [] },

  // Cards & Containers (8)
  'spotlight-card': { name: 'Spotlight 3D Card', file: 'SpotlightCard.tsx', section: 'cards', dir: 'spotlight-card', deps: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'] },
  'iridescent-glass-card': { name: 'Iridescent Glassmorphic Card', file: 'IridescentGlassCard.tsx', section: 'cards', dir: 'iridescent-glass-card', deps: ['framer-motion', 'lucide-react'] },
  'wobbly-paper-note': { name: 'Wobbly Paper Note Card', file: 'WobblyPaperNote.tsx', section: 'cards', dir: 'wobbly-paper-note', deps: ['framer-motion'] },
  'scrapbook-polaroid': { name: 'Tape & Scrapbook Polaroid', file: 'ScrapbookPolaroid.tsx', section: 'cards', dir: 'scrapbook-polaroid', deps: ['framer-motion'] },
  'rgb-glitch-card': { name: 'RGB Split / Glitch Card Reveal', file: 'RgbGlitchCard.tsx', section: 'cards', dir: 'rgb-glitch-card', deps: ['framer-motion'] },
  'laser-sweep-box': { name: 'Laser Sweep Border Box', file: 'LaserSweepBox.tsx', section: 'cards', dir: 'laser-sweep-box', deps: ['framer-motion'] },
  'staggered-tilt-grid': { name: 'Interactive Staggered Tilt Grid', file: 'StaggeredTiltGrid.tsx', section: 'cards', dir: 'staggered-tilt-grid', deps: ['framer-motion'] },
  'holographic-badge': { name: 'Holographic / Iridescent Foil Badge', file: 'HolographicBadge.tsx', section: 'cards', dir: 'holographic-badge', deps: ['framer-motion'] },

  // Components (6)
  'floating-dock': { name: 'Floating Mac Spring Dock', file: 'FloatingDock.tsx', section: 'components', dir: 'floating-dock', deps: ['framer-motion', 'lucide-react'] },
  'gooey-blob-nav': { name: 'Gooey Blob Navigation Bar', file: 'GooeyBlobNav.tsx', section: 'components', dir: 'gooey-blob-nav', deps: ['framer-motion'] },
  'elastic-spring-modal': { name: 'Elastic Spring Drawer / Modal', file: 'ElasticSpringModal.tsx', section: 'components', dir: 'elastic-spring-modal', deps: ['framer-motion', 'lucide-react'] },
  'hud-target-reticle': { name: 'Holographic HUD Target Reticle', file: 'HudTargetReticle.tsx', section: 'components', dir: 'hud-target-reticle', deps: ['framer-motion'] },
  'crt-scanline-terminal': { name: 'CRT Scanline Terminal Box', file: 'CrtScanlineTerminal.tsx', section: 'components', dir: 'crt-scanline-terminal', deps: [] },
  'cyber-metric-gauge': { name: 'Cyber Metric Gauge / Circle Progress', file: 'CyberMetricGauge.tsx', section: 'components', dir: 'cyber-metric-gauge', deps: ['framer-motion'] },

  // Animations & FX (4)
  'pixel-card-reveal': { name: 'Pixelated Image Reveal', file: 'PixelCardReveal.tsx', section: 'animations', dir: 'pixel-card-reveal', deps: [] },
  'gravity-tag-cloud': { name: 'Dynamic Gravity Tag Cloud', file: 'GravityTagCloud.tsx', section: 'animations', dir: 'gravity-tag-cloud', deps: [] },
  'doodle-floating-stickers': { name: 'Doodle Floating Stickers', file: 'DoodleFloatingStickers.tsx', section: 'animations', dir: 'doodle-floating-stickers', deps: ['framer-motion'] },
  'magnetic-badge-cluster': { name: 'Magnetic Floating Badge Cluster', file: 'MagneticBadgeCluster.tsx', section: 'animations', dir: 'magnetic-badge-cluster', deps: ['framer-motion'] },
};

console.log('\n\x1b[38;2;99;102;241m' + `
   ███████╗██╗██████╗ ██████╗       ██████╗ ███████╗ █████╗  ██████╗████████╗███████╗
   ██╔════╝██║██╔══██╗██╔══██╗      ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝
   ███████╗██║██║  ██║██║  ██║█████╗██████╔╝█████╗  ███████║██║        ██║   ███████╗
   ╚════██║██║██║  ██║██║  ██║╚════╝██╔══██╗██╔══╝  ██╔══██║██║        ██║   ╚════██║
   ███████║██║██████╔╝██████╔╝      ██║  ██║███████╗██║  ██║╚██████╗   ██║   ███████║
   ╚══════╝╚═╝╚═════╝ ╚═════╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝
` + '\x1b[0m');
console.log('   \x1b[36m⚡ Next-Gen Kinetic React Components Engine v2.4 (50 Components across 6 Sections)\x1b[0m\n');

if (!command || command === 'help' || command === '--help') {
  console.log(`   Usage:
     \x1b[32mnpx sidd-reacts add <component-name>\x1b[0m  Add component to your project
     \x1b[32mnpx sidd-reacts list\x1b[0m                 List all available components
     \x1b[32mnpx sidd-reacts init\x1b[0m                 Set up Tailwind & utils for SIDD-Reacts
  `);
  process.exit(0);
}

if (command === 'list') {
  console.log(`   \x1b[1mAvailable SIDD-Reacts Components (${Object.keys(COMPONENTS).length} Total across 6 Sections):\x1b[0m\n`);
  Object.keys(COMPONENTS).forEach((key) => {
    const c = COMPONENTS[key];
    console.log(`   • \x1b[35m${key.padEnd(28)}\x1b[0m \x1b[33m[${c.section.padEnd(11)}]\x1b[0m \x1b[37m${c.name}\x1b[0m`);
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
  const sourcePath = path.join(__dirname, '..', 'src', 'registry', 'components', comp.section, comp.dir, comp.file);
  const targetDir = path.join(process.cwd(), 'src', 'components', 'sidd-reacts', comp.section, comp.dir);
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
