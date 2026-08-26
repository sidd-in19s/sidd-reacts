import { RegistryItem } from './types';

// Category 1: Hand-Drawn / Diary Doodle Style
import WobblyPaperNote from './components/wobbly-paper-note/WobblyPaperNote';
import MarkerHighlightText from './components/marker-highlight-text/MarkerHighlightText';
import SketchSvgButton from './components/sketch-svg-button/SketchSvgButton';
import DoodleFloatingStickers from './components/doodle-floating-stickers/DoodleFloatingStickers';
import ScrapbookPolaroid from './components/scrapbook-polaroid/ScrapbookPolaroid';

// Category 2: Interactive Sticker / Skeuomorphic Vinyl Peel
import PeelableVinylSticker from './components/peelable-vinyl-sticker/PeelableVinylSticker';
import HolographicBadge from './components/holographic-badge/HolographicBadge';
import RubberStampPress from './components/rubber-stamp-press/RubberStampPress';
import NeumorphicSwitch from './components/neumorphic-switch/NeumorphicSwitch';
import MagneticBadgeCluster from './components/magnetic-badge-cluster/MagneticBadgeCluster';

// Category 3: 3D & Immersive Animated Backgrounds
import FluidLiquidMesh from './components/fluid-liquid-mesh/FluidLiquidMesh';
import CelestialNebula from './components/celestial-nebula/CelestialNebula';
import SynthwaveGridFloor from './components/synthwave-grid-floor/SynthwaveGridFloor';
import VoronoiCellNetwork from './components/voronoi-cell-network/VoronoiCellNetwork';
import ParticleSphere3D from './components/particle-sphere-3d/ParticleSphere3D';

// Category 4: Retro Cyberpunk & Glitch HUD
import RgbGlitchCard from './components/rgb-glitch-card/RgbGlitchCard';
import HudTargetReticle from './components/hud-target-reticle/HudTargetReticle';
import CrtScanlineTerminal from './components/crt-scanline-terminal/CrtScanlineTerminal';
import CyberMetricGauge from './components/cyber-metric-gauge/CyberMetricGauge';
import LaserSweepBox from './components/laser-sweep-box/LaserSweepBox';

// Category 5: Kinetic Micro-Interactions & Fluid UI
import GooeyBlobNav from './components/gooey-blob-nav/GooeyBlobNav';
import GravityTagCloud from './components/gravity-tag-cloud/GravityTagCloud';
import LiquidMorphButton from './components/liquid-morph-button/LiquidMorphButton';
import ElasticSpringModal from './components/elastic-spring-modal/ElasticSpringModal';
import StaggeredTiltGrid from './components/staggered-tilt-grid/StaggeredTiltGrid';

export const NEW_COMPONENTS: RegistryItem[] = [
  // ==================== Category 1: Hand-Drawn / Diary Doodle Style ====================
  {
    id: 'wobbly-paper-note',
    name: 'Wobbly Paper Note Card',
    category: 'sketch',
    badge: 'NEW',
    description: 'Sticky note card with torn paper clip path, realistic drop-shadow, and Framer Motion spring wobble and drag physics.',
    dependencies: ['framer-motion', 'clsx', 'tailwind-merge'],
    cliCommand: 'npx sidd-reacts add wobbly-paper-note',
    propsConfig: [
      { name: 'title', label: 'Note Title', type: 'text', defaultValue: 'Design Notes & Ideas ✏️' },
      { name: 'paperColor', label: 'Paper Color', type: 'color', defaultValue: '#fef08a' },
      { name: 'pinColor', label: 'Pin Color', type: 'color', defaultValue: '#ef4444' },
      { name: 'tiltAngle', label: 'Tilt Angle (°)', type: 'slider', defaultValue: -3, min: -15, max: 15, step: 1 },
      { name: 'wobbleIntensity', label: 'Wobble Intensity', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.2 },
    ],
    apiDocs: [
      { name: 'title', type: 'string', default: "'Design Notes & Ideas ✏️'", description: 'Title header displayed on the paper note' },
      { name: 'content', type: 'string', default: "'...'", description: 'Note message body text' },
      { name: 'paperColor', type: 'string', default: "'#fef08a'", description: 'Background color of the paper note' },
      { name: 'tiltAngle', type: 'number', default: '-3', description: 'Resting tilt angle in degrees' },
    ],
    component: WobblyPaperNote,
    codeTSX: `import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const WobblyPaperNote = ({ title = 'Design Notes & Ideas ✏️', paperColor = '#fef08a' }) => {
  return (
    <motion.div
      drag
      whileDrag={{ scale: 1.05 }}
      className="p-6 rounded-sm shadow-2xl"
      style={{ backgroundColor: paperColor }}
    >
      <h3 className="font-mono font-bold text-zinc-900">{title}</h3>
    </motion.div>
  );
};`,
    codeJSX: `// JSX version available`,
    demoUsage: `<WobblyPaperNote title="Product Brainstorm 💡" paperColor="#fef08a" />`,
  },

  {
    id: 'marker-highlight-text',
    name: 'Animated Highlighter Marker Text',
    category: 'sketch',
    badge: 'HOT',
    description: 'Kinetic typography with animated SVG hand-drawn marker highlight streak that paints across keywords on hover/scroll.',
    dependencies: ['framer-motion', 'clsx'],
    cliCommand: 'npx sidd-reacts add marker-highlight-text',
    propsConfig: [
      { name: 'prefixText', label: 'Prefix Text', type: 'text', defaultValue: 'Build interfaces that feel' },
      { name: 'highlightText', label: 'Highlighted Text', type: 'text', defaultValue: 'alive and truly organic' },
      { name: 'suffixText', label: 'Suffix Text', type: 'text', defaultValue: 'with kinetic animations.' },
      { name: 'highlightColor', label: 'Marker Color', type: 'color', defaultValue: '#facc15' },
      { name: 'strokeHeight', label: 'Stroke Height (px)', type: 'slider', defaultValue: 18, min: 10, max: 30, step: 2 },
    ],
    apiDocs: [
      { name: 'highlightText', type: 'string', default: "'alive and truly organic'", description: 'Target word highlighted by the animated marker' },
      { name: 'highlightColor', type: 'string', default: "'#facc15'", description: 'Hex or RGBA color of the marker streak' },
    ],
    component: MarkerHighlightText,
    codeTSX: `// MarkerHighlightText.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<MarkerHighlightText highlightText="super intuitive" highlightColor="#facc15" />`,
  },

  {
    id: 'sketch-svg-button',
    name: 'Pencil-Sketch SVG Button',
    category: 'sketch',
    badge: 'NEW',
    description: 'Interactive button with animated, looping sketchy border paths using SVG stroke-dashoffset drawing effects on hover.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add sketch-svg-button',
    propsConfig: [
      { name: 'label', label: 'Button Label', type: 'text', defaultValue: 'Sketch Project Idea' },
      { name: 'strokeColor', label: 'Pencil Stroke Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'bgColor', label: 'Background Color', type: 'color', defaultValue: '#090a14' },
      { name: 'textColor', label: 'Text Color', type: 'color', defaultValue: '#ffffff' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'Sketch Project Idea'", description: 'Button primary text' },
      { name: 'strokeColor', type: 'string', default: "'#38bdf8'", description: 'Color of the sketchy pencil SVG border' },
    ],
    component: SketchSvgButton,
    codeTSX: `// SketchSvgButton.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<SketchSvgButton label="Explore Features" strokeColor="#38bdf8" />`,
  },

  {
    id: 'doodle-floating-stickers',
    name: 'Doodle Floating Stickers',
    category: 'sketch',
    badge: 'SPRING',
    description: 'Physics-enabled cartoon stickers (stars, arrows, smileys) with spring recoil, rotation, and drag inertia on release.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add doodle-floating-stickers',
    propsConfig: [
      { name: 'glowColor', label: 'Glow Hue', type: 'color', defaultValue: '#6366f1' },
    ],
    apiDocs: [
      { name: 'glowColor', type: 'string', default: "'#6366f1'", description: 'Ambient glow color around the doodle board' },
    ],
    component: DoodleFloatingStickers,
    codeTSX: `// DoodleFloatingStickers.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<DoodleFloatingStickers glowColor="#6366f1" />`,
  },

  {
    id: 'scrapbook-polaroid',
    name: 'Tape & Scrapbook Polaroid',
    category: 'sketch',
    badge: 'NEW',
    description: 'Polaroid card taped with textured semi-transparent washi tape that peels up realistically on cursor hover.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add scrapbook-polaroid',
    propsConfig: [
      { name: 'title', label: 'Photo Title', type: 'text', defaultValue: 'Neon Horizons 🌆' },
      { name: 'caption', label: 'Caption', type: 'text', defaultValue: 'Shot on 35mm film • Kyoto 2026' },
      { name: 'tapeColor', label: 'Washi Tape Color', type: 'color', defaultValue: '#fbbf24' },
      { name: 'tiltAngle', label: 'Resting Tilt (°)', type: 'slider', defaultValue: 4, min: -15, max: 15, step: 1 },
    ],
    apiDocs: [
      { name: 'title', type: 'string', default: "'Neon Horizons 🌆'", description: 'Photo caption title' },
      { name: 'tapeColor', type: 'string', default: "'#fbbf24'", description: 'Color of the washi tape overlay' },
    ],
    component: ScrapbookPolaroid,
    codeTSX: `// ScrapbookPolaroid.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<ScrapbookPolaroid title="Cyber Skyline" tapeColor="#fbbf24" />`,
  },

  // ==================== Category 2: Interactive Sticker / Skeuomorphic Vinyl Peel ====================
  {
    id: 'peelable-vinyl-sticker',
    name: 'Interactive Peelable Vinyl Sticker',
    category: 'stickers',
    badge: 'HOT',
    description: 'Realistic 3D sticker with dynamic curl geometry that follows cursor position and peel drag vectors.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add peelable-vinyl-sticker',
    propsConfig: [
      { name: 'title', label: 'Sticker Title', type: 'text', defaultValue: 'SIDD-REACTS' },
      { name: 'badgeColor', label: 'Vinyl Base Color', type: 'color', defaultValue: '#6366f1' },
      { name: 'peelAmount', label: 'Peel Threshold', type: 'slider', defaultValue: 60, min: 20, max: 100, step: 5 },
    ],
    apiDocs: [
      { name: 'title', type: 'string', default: "'SIDD-REACTS'", description: 'Sticker branding title' },
      { name: 'badgeColor', type: 'string', default: "'#6366f1'", description: 'Base vinyl sticker gradient tint' },
    ],
    component: PeelableVinylSticker,
    codeTSX: `// PeelableVinylSticker.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<PeelableVinylSticker title="PRO EDITION" badgeColor="#6366f1" />`,
  },

  {
    id: 'holographic-badge',
    name: 'Holographic / Iridescent Foil Badge',
    category: 'stickers',
    badge: 'POPULAR',
    description: 'Shiny foil badge with dynamic rainbow diffraction, specular glare reflections, and 3D mouse spring tilt physics.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add holographic-badge',
    propsConfig: [
      { name: 'label', label: 'Badge Label', type: 'text', defaultValue: 'MASTER DEVELOPER' },
      { name: 'badgeCode', label: 'Badge Serial Code', type: 'text', defaultValue: 'SR-8921-X' },
      { name: 'tier', label: 'Tier Rank', type: 'text', defaultValue: 'HOLOGRAPHIC FOIL' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'MASTER DEVELOPER'", description: 'Badge title text' },
      { name: 'badgeCode', type: 'string', default: "'SR-8921-X'", description: 'Unique identification code' },
    ],
    component: HolographicBadge,
    codeTSX: `// HolographicBadge.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<HolographicBadge label="FOUNDER PASS" badgeCode="SR-0001" />`,
  },

  {
    id: 'rubber-stamp-press',
    name: '3D Rubber Stamp / Badge Press',
    category: 'stickers',
    badge: 'NEW',
    description: 'Clickable tactile badge that stamps down with heavy spring physics, ink scatter, and tactile haptic feel.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add rubber-stamp-press',
    propsConfig: [
      { name: 'stampText', label: 'Stamp Text', type: 'text', defaultValue: 'APPROVED' },
      { name: 'stampSubtext', label: 'Subtext', type: 'text', defaultValue: 'SIDD-REACTS QA VERIFIED' },
      { name: 'inkColor', label: 'Ink Color', type: 'color', defaultValue: '#ef4444' },
    ],
    apiDocs: [
      { name: 'stampText', type: 'string', default: "'APPROVED'", description: 'Primary stamp text' },
      { name: 'inkColor', type: 'string', default: "'#ef4444'", description: 'Color of the rubber stamp ink' },
    ],
    component: RubberStampPress,
    codeTSX: `// RubberStampPress.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<RubberStampPress stampText="CONFIDENTIAL" inkColor="#ef4444" />`,
  },

  {
    id: 'neumorphic-switch',
    name: 'Embossed / Debossed Neumorphic Switch',
    category: 'stickers',
    badge: 'SPRING',
    description: 'Skeuomorphic tactile toggle that presses into and raises out of the surface with dual dynamic shadows.',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add neumorphic-switch',
    propsConfig: [
      { name: 'label', label: 'Switch Label', type: 'text', defaultValue: 'Quantum Power Engine' },
      { name: 'activeColor', label: 'Active Glow Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'defaultChecked', label: 'Default Checked', type: 'boolean', defaultValue: true },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'Quantum Power Engine'", description: 'Label displayed next to the switch' },
      { name: 'activeColor', type: 'string', default: "'#38bdf8'", description: 'Accent power glow color' },
    ],
    component: NeumorphicSwitch,
    codeTSX: `// NeumorphicSwitch.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<NeumorphicSwitch label="Hyperdrive Engine" activeColor="#38bdf8" />`,
  },

  {
    id: 'magnetic-badge-cluster',
    name: 'Magnetic Floating Badge Cluster',
    category: 'stickers',
    badge: 'NEW',
    description: 'Cluster of branded badges that scatter apart when the cursor approaches and snap back with magnetic spring physics.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add magnetic-badge-cluster',
    propsConfig: [
      { name: 'centerLabel', label: 'Center Emblem Label', type: 'text', defaultValue: 'SIDD-REACTS' },
      { name: 'clusterRadius', label: 'Cluster Radius (px)', type: 'slider', defaultValue: 120, min: 60, max: 200, step: 10 },
    ],
    apiDocs: [
      { name: 'centerLabel', type: 'string', default: "'SIDD-REACTS'", description: 'Text shown on central core badge' },
    ],
    component: MagneticBadgeCluster,
    codeTSX: `// MagneticBadgeCluster.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<MagneticBadgeCluster centerLabel="KINETIC CORE" />`,
  },

  // ==================== Category 3: 3D & Immersive Animated Backgrounds ====================
  {
    id: 'fluid-liquid-mesh',
    name: 'Interactive 3D Fluid Liquid Mesh',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Interactive dynamic fluid wave surface reacting to cursor ripples with ambient color blending.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add fluid-liquid-mesh',
    propsConfig: [
      { name: 'colorA', label: 'Color Wave A', type: 'color', defaultValue: '#6366f1' },
      { name: 'colorB', label: 'Color Wave B', type: 'color', defaultValue: '#ec4899' },
      { name: 'colorC', label: 'Color Wave C', type: 'color', defaultValue: '#38bdf8' },
      { name: 'waveSpeed', label: 'Wave Speed', type: 'slider', defaultValue: 1, min: 0.2, max: 3, step: 0.2 },
    ],
    apiDocs: [
      { name: 'colorA', type: 'string', default: "'#6366f1'", description: 'Primary wave gradient color' },
      { name: 'waveSpeed', type: 'number', default: '1', description: 'Speed multiplier for wave flow' },
    ],
    component: FluidLiquidMesh,
    codeTSX: `// FluidLiquidMesh.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<FluidLiquidMesh colorA="#6366f1" colorB="#ec4899" colorC="#38bdf8" />`,
  },

  {
    id: 'celestial-nebula',
    name: 'Celestial Nebula / Galaxy Cloud',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Volumetric particle cloud simulator with drifting cosmic space dust and slow rotating star clusters.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add celestial-nebula',
    propsConfig: [
      { name: 'nebulaColor1', label: 'Nebula Primary Glow', type: 'color', defaultValue: '#6366f1' },
      { name: 'nebulaColor2', label: 'Nebula Accent Glow', type: 'color', defaultValue: '#ec4899' },
      { name: 'starCount', label: 'Starfield Density', type: 'slider', defaultValue: 140, min: 50, max: 400, step: 20 },
      { name: 'rotationSpeed', label: 'Orbit Rotation Speed', type: 'slider', defaultValue: 0.002, min: 0.0005, max: 0.01, step: 0.0005 },
    ],
    apiDocs: [
      { name: 'starCount', type: 'number', default: '140', description: 'Total stars in 3D perspective field' },
      { name: 'nebulaColor1', type: 'string', default: "'#6366f1'", description: 'Primary radial nebula bloom tint' },
    ],
    component: CelestialNebula,
    codeTSX: `// CelestialNebula.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<CelestialNebula nebulaColor1="#6366f1" nebulaColor2="#ec4899" />`,
  },

  {
    id: 'synthwave-grid-floor',
    name: 'Cyberpunk 3D Wireframe Grid Floor',
    category: 'backgrounds',
    badge: 'HOT',
    description: 'Retro 80s infinite synthwave perspective grid moving forward with neon horizon sun and wave terrain displacement.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add synthwave-grid-floor',
    propsConfig: [
      { name: 'gridColor', label: 'Grid Wireframe Color', type: 'color', defaultValue: '#ec4899' },
      { name: 'horizonGlowColor', label: 'Horizon Laser Glow', type: 'color', defaultValue: '#06b6d4' },
      { name: 'speed', label: 'Grid Forward Speed', type: 'slider', defaultValue: 1.2, min: 0.4, max: 4, step: 0.2 },
      { name: 'sunSize', label: 'Retro Sun Radius', type: 'slider', defaultValue: 90, min: 40, max: 160, step: 10 },
    ],
    apiDocs: [
      { name: 'gridColor', type: 'string', default: "'#ec4899'", description: 'Perspective grid wire color' },
      { name: 'speed', type: 'number', default: '1.2', description: 'Forward terrain movement velocity' },
    ],
    component: SynthwaveGridFloor,
    codeTSX: `// SynthwaveGridFloor.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<SynthwaveGridFloor gridColor="#ec4899" horizonGlowColor="#06b6d4" />`,
  },

  {
    id: 'voronoi-cell-network',
    name: 'Abstract Voronoi Cell Network',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: 'Morphing biological Voronoi diagram and Delaunay triangulation network shifting organic cell boundaries over time.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add voronoi-cell-network',
    propsConfig: [
      { name: 'pointCount', label: 'Cell Node Count', type: 'slider', defaultValue: 35, min: 15, max: 80, step: 5 },
      { name: 'cellColor', label: 'Node Point Color', type: 'color', defaultValue: '#3b82f6' },
      { name: 'wireColor', label: 'Mesh Wire Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'speed', label: 'Node Drift Speed', type: 'slider', defaultValue: 0.8, min: 0.2, max: 2.5, step: 0.1 },
    ],
    apiDocs: [
      { name: 'pointCount', type: 'number', default: '35', description: 'Total connected nodes in the organic mesh' },
      { name: 'cellColor', type: 'string', default: "'#3b82f6'", description: 'Node point fill color' },
    ],
    component: VoronoiCellNetwork,
    codeTSX: `// VoronoiCellNetwork.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<VoronoiCellNetwork pointCount={40} cellColor="#3b82f6" />`,
  },

  {
    id: 'particle-sphere-3d',
    name: 'Dynamic 3D Particle Constellation / Sphere',
    category: 'backgrounds',
    badge: 'CANVAS',
    description: '3D sphere of interconnected Fibonacci points rotating smoothly in space with dynamic mouse proximity expansion.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add particle-sphere-3d',
    propsConfig: [
      { name: 'pointCount', label: 'Particle Count', type: 'slider', defaultValue: 280, min: 100, max: 600, step: 20 },
      { name: 'sphereRadius', label: 'Sphere Radius (px)', type: 'slider', defaultValue: 160, min: 80, max: 260, step: 10 },
      { name: 'particleColor', label: 'Point Glow Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'rotationSpeed', label: '3D Spin Speed', type: 'slider', defaultValue: 0.008, min: 0.001, max: 0.03, step: 0.002 },
    ],
    apiDocs: [
      { name: 'pointCount', type: 'number', default: '280', description: 'Fibonacci points mapped across 3D sphere' },
      { name: 'sphereRadius', type: 'number', default: '160', description: 'Radius of the 3D spherical mesh' },
    ],
    component: ParticleSphere3D,
    codeTSX: `// ParticleSphere3D.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<ParticleSphere3D pointCount={300} particleColor="#38bdf8" />`,
  },

  // ==================== Category 4: Retro Cyberpunk & Glitch HUD ====================
  {
    id: 'rgb-glitch-card',
    name: 'RGB Split / Glitch Card Reveal',
    category: 'cyberpunk',
    badge: 'HOT',
    description: 'Card component triggering realistic chromatic RGB split and digital slicing displacement on hover.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add rgb-glitch-card',
    propsConfig: [
      { name: 'title', label: 'Card Title', type: 'text', defaultValue: 'CYBERNETIC DISPLACEMENT' },
      { name: 'tag', label: 'Category Tag', type: 'text', defaultValue: 'RGB GLITCH FX' },
      { name: 'glitchColorA', label: 'RGB Channel A', type: 'color', defaultValue: '#06b6d4' },
      { name: 'glitchColorB', label: 'RGB Channel B', type: 'color', defaultValue: '#ec4899' },
    ],
    apiDocs: [
      { name: 'title', type: 'string', default: "'CYBERNETIC DISPLACEMENT'", description: 'Title header' },
      { name: 'glitchColorA', type: 'string', default: "'#06b6d4'", description: 'First RGB split chromatic tint' },
    ],
    component: RgbGlitchCard,
    codeTSX: `// RgbGlitchCard.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<RgbGlitchCard title="NEURAL MATRIX" glitchColorA="#06b6d4" glitchColorB="#ec4899" />`,
  },

  {
    id: 'hud-target-reticle',
    name: 'Holographic HUD Target Reticle',
    category: 'cyberpunk',
    badge: 'NEW',
    description: 'Futuristic crosshair targeting reticle that follows cursor movement, locks onto hovered elements, and displays real-time telemetry.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add hud-target-reticle',
    propsConfig: [
      { name: 'targetName', label: 'Telemetry Target ID', type: 'text', defaultValue: 'HOSTILE_DRONE_ALPHA' },
      { name: 'reticleColor', label: 'HUD Laser Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'reticleSize', label: 'Crosshair Radius (px)', type: 'slider', defaultValue: 90, min: 50, max: 150, step: 5 },
    ],
    apiDocs: [
      { name: 'reticleColor', type: 'string', default: "'#38bdf8'", description: 'Color of the holographic targeting crosshair' },
    ],
    component: HudTargetReticle,
    codeTSX: `// HudTargetReticle.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<HudTargetReticle reticleColor="#38bdf8" />`,
  },

  {
    id: 'crt-scanline-terminal',
    name: 'CRT Scanline Terminal Box',
    category: 'cyberpunk',
    badge: 'POPULAR',
    description: 'Retro-terminal container complete with spherical screen curve distortion, glowing phosphor text, and subtle horizontal scanlines.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add crt-scanline-terminal',
    propsConfig: [
      { name: 'systemName', label: 'Terminal OS Name', type: 'text', defaultValue: 'SIDD-OS v2.4 (TERMINAL_01)' },
      { name: 'phosphorColor', label: 'Phosphor Green/Amber', type: 'color', defaultValue: '#22c55e' },
      { name: 'initialCommand', label: 'Default Command', type: 'text', defaultValue: 'npx sidd-reacts init --engine=kinetic' },
    ],
    apiDocs: [
      { name: 'phosphorColor', type: 'string', default: "'#22c55e'", description: 'Color of CRT phosphor glow and scanlines' },
    ],
    component: CrtScanlineTerminal,
    codeTSX: `// CrtScanlineTerminal.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<CrtScanlineTerminal systemName="MAINFRAME_01" phosphorColor="#22c55e" />`,
  },

  {
    id: 'cyber-metric-gauge',
    name: 'Cyber Metric Gauge / Circle Progress',
    category: 'cyberpunk',
    badge: 'NEW',
    description: 'Animated radial telemetry ring with segmented dashes and real-time ticking values.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add cyber-metric-gauge',
    propsConfig: [
      { name: 'label', label: 'Metric Title', type: 'text', defaultValue: 'CORE QUANTUM FLUX' },
      { name: 'metricValue', label: 'Metric Value (%)', type: 'slider', defaultValue: 84, min: 0, max: 100, step: 1 },
      { name: 'unit', label: 'Unit Symbol', type: 'text', defaultValue: '%' },
      { name: 'gaugeColor', label: 'Gauge Arc Color', type: 'color', defaultValue: '#06b6d4' },
    ],
    apiDocs: [
      { name: 'metricValue', type: 'number', default: '84', description: 'Progress percentage (0 - 100)' },
      { name: 'gaugeColor', type: 'string', default: "'#06b6d4'", description: 'Color of the illuminated progress arc' },
    ],
    component: CyberMetricGauge,
    codeTSX: `// CyberMetricGauge.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<CyberMetricGauge metricValue={92} gaugeColor="#06b6d4" />`,
  },

  {
    id: 'laser-sweep-box',
    name: 'Laser Sweep Border Box',
    category: 'cyberpunk',
    badge: 'SPRING',
    description: 'Container with high-intensity glowing laser beam orbiting continuously around its perimeter borders.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add laser-sweep-box',
    propsConfig: [
      { name: 'title', label: 'Vault Title', type: 'text', defaultValue: 'QUANTUM SECURE VAULT' },
      { name: 'laserColor', label: 'Laser Beam Color', type: 'color', defaultValue: '#38bdf8' },
      { name: 'sweepDuration', label: 'Orbit Speed (seconds)', type: 'slider', defaultValue: 4, min: 1, max: 10, step: 0.5 },
    ],
    apiDocs: [
      { name: 'laserColor', type: 'string', default: "'#38bdf8'", description: 'Color of the orbiting perimeter laser' },
      { name: 'sweepDuration', type: 'number', default: '4', description: 'Duration in seconds for one full orbit' },
    ],
    component: LaserSweepBox,
    codeTSX: `// LaserSweepBox.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<LaserSweepBox title="SECURE WALLET" laserColor="#38bdf8" />`,
  },

  // ==================== Category 5: Kinetic Micro-Interactions & Fluid UI ====================
  {
    id: 'gooey-blob-nav',
    name: 'Gooey Blob Navigation Bar',
    category: 'kinetic',
    badge: 'HOT',
    description: 'Tab navigation bar with fluid SVG gooey filter merging and stretching the active indicator between tabs.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add gooey-blob-nav',
    propsConfig: [
      { name: 'blobColor', label: 'Active Blob Color', type: 'color', defaultValue: '#6366f1' },
    ],
    apiDocs: [
      { name: 'blobColor', type: 'string', default: "'#6366f1'", description: 'Color of fluid moving gooey pill' },
    ],
    component: GooeyBlobNav,
    codeTSX: `// GooeyBlobNav.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<GooeyBlobNav blobColor="#6366f1" />`,
  },

  {
    id: 'gravity-tag-cloud',
    name: 'Dynamic Gravity Tag Cloud',
    category: 'kinetic',
    badge: 'CANVAS',
    description: 'Interactive 2D physics tag cloud where chips fall with gravity, pile on each other, and bounce with cursor momentum.',
    dependencies: ['clsx'],
    cliCommand: 'npx sidd-reacts add gravity-tag-cloud',
    propsConfig: [
      { name: 'gravity', label: 'Gravity Force', type: 'slider', defaultValue: 0.45, min: 0.1, max: 1.2, step: 0.05 },
      { name: 'bounce', label: 'Restitution Bounce', type: 'slider', defaultValue: 0.65, min: 0.2, max: 0.95, step: 0.05 },
    ],
    apiDocs: [
      { name: 'gravity', type: 'number', default: '0.45', description: 'Downward gravitational acceleration' },
      { name: 'bounce', type: 'number', default: '0.65', description: 'Bounciness factor on collisions' },
    ],
    component: GravityTagCloud,
    codeTSX: `// GravityTagCloud.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<GravityTagCloud gravity={0.5} bounce={0.7} />`,
  },

  {
    id: 'liquid-morph-button',
    name: 'Liquid Morphing Progress Button',
    category: 'kinetic',
    badge: 'SPRING',
    description: 'Submit button that morphs into a circular spinner, fills with liquid level, and transforms into a checkmark on success.',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add liquid-morph-button',
    propsConfig: [
      { name: 'label', label: 'Initial Label', type: 'text', defaultValue: 'Deploy to Production' },
      { name: 'successLabel', label: 'Success Message', type: 'text', defaultValue: 'Deployed Successfully!' },
      { name: 'fillColor', label: 'Liquid Fill Color', type: 'color', defaultValue: '#10b981' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'Deploy to Production'", description: 'Button resting label' },
      { name: 'fillColor', type: 'string', default: "'#10b981'", description: 'Color of rising liquid fill' },
    ],
    component: LiquidMorphButton,
    codeTSX: `// LiquidMorphButton.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<LiquidMorphButton label="Upgrade Plan" fillColor="#10b981" />`,
  },

  {
    id: 'elastic-spring-modal',
    name: 'Elastic Spring Drawer / Modal',
    category: 'kinetic',
    badge: 'NEW',
    description: 'Sheet modal dialog with exaggerated bouncy spring physics and drag-to-dismiss momentum.',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add elastic-spring-modal',
    propsConfig: [
      { name: 'buttonText', label: 'Trigger Button Text', type: 'text', defaultValue: 'Open Elastic Modal' },
      { name: 'modalTitle', label: 'Modal Title', type: 'text', defaultValue: 'Kinetic Sheet Modal ✨' },
      { name: 'accentColor', label: 'Accent Glow Color', type: 'color', defaultValue: '#6366f1' },
    ],
    apiDocs: [
      { name: 'modalTitle', type: 'string', default: "'Kinetic Sheet Modal ✨'", description: 'Header text inside modal' },
    ],
    component: ElasticSpringModal,
    codeTSX: `// ElasticSpringModal.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<ElasticSpringModal buttonText="Open Dialog" modalTitle="Welcome to SIDD-Reacts" />`,
  },

  {
    id: 'staggered-tilt-grid',
    name: 'Interactive Staggered Tilt Grid',
    category: 'kinetic',
    badge: 'SPRING',
    description: 'Grid gallery where neighboring cards subtly tilt and scale toward the specific card being hovered.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add staggered-tilt-grid',
    propsConfig: [
      { name: 'cardCount', label: 'Number of Cards', type: 'slider', defaultValue: 4, min: 2, max: 4, step: 1 },
      { name: 'hoverGlowColor', label: 'Hover Glow Tint', type: 'color', defaultValue: '#6366f1' },
    ],
    apiDocs: [
      { name: 'cardCount', type: 'number', default: '4', description: 'Number of cards displayed in the tilt grid' },
    ],
    component: StaggeredTiltGrid,
    codeTSX: `// StaggeredTiltGrid.tsx implementation`,
    codeJSX: `// JSX implementation`,
    demoUsage: `<StaggeredTiltGrid cardCount={4} hoverGlowColor="#6366f1" />`,
  },
];
