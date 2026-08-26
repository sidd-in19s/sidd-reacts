import { RegistryItem } from './types';

// Import all 15 Button Components
import CyberShatterButton from './components/buttons/cyber-shatter-button/CyberShatterButton';
import HolographicFoilButton from './components/buttons/holographic-foil-button/HolographicFoilButton';
import ArcadePixelButton from './components/buttons/arcade-pixel-button/ArcadePixelButton';
import LiquidMercuryButton from './components/buttons/liquid-mercury-button/LiquidMercuryButton';
import ElectricArcButton from './components/buttons/electric-arc-button/ElectricArcButton';
import OrigamiFoldButton from './components/buttons/origami-fold-button/OrigamiFoldButton';
import CosmicOrbitButton from './components/buttons/cosmic-orbit-button/CosmicOrbitButton';
import BiometricScanButton from './components/buttons/biometric-scan-button/BiometricScanButton';
import TypewriterKeyButton from './components/buttons/typewriter-key-button/TypewriterKeyButton';
import ThermalHeatmapButton from './components/buttons/thermal-heatmap-button/ThermalHeatmapButton';
import WaxSealButton from './components/buttons/wax-seal-button/WaxSealButton';
import AuroraGradientButton from './components/buttons/aurora-gradient-button/AuroraGradientButton';
import VhsRewindButton from './components/buttons/vhs-rewind-button/VhsRewindButton';
import SoundwaveEqButton from './components/buttons/soundwave-eq-button/SoundwaveEqButton';
import FloatingLevitationButton from './components/buttons/floating-levitation-button/FloatingLevitationButton';

export const BUTTON_COMPONENTS: RegistryItem[] = [
  {
    id: 'cyber-shatter-button',
    name: 'Cyberpunk Glitch & Shard Shatter Button',
    category: 'buttons',
    badge: 'HOT',
    description: 'Futuristic sci-fi button with RGB chromatic aberration and explosive geometric shard shattering with instant CRT recovery.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add cyber-shatter-button',
    propsConfig: [
      { name: 'label', label: 'Primary Label', type: 'text', defaultValue: 'SYSTEM OVERRIDE' },
      { name: 'subtext', label: 'Telemetry Subtext', type: 'text', defaultValue: 'SECURITY LEVEL: 05' },
      { name: 'cyanColor', label: 'Neon Cyan Color', type: 'color', defaultValue: '#06b6d4' },
      { name: 'magentaColor', label: 'Neon Magenta Color', type: 'color', defaultValue: '#ec4899' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'SYSTEM OVERRIDE'", description: 'Primary header text' },
      { name: 'cyanColor', type: 'string', default: "'#06b6d4'", description: 'RGB split cyan channel color' },
      { name: 'magentaColor', type: 'string', default: "'#ec4899'", description: 'RGB split magenta channel color' },
    ],
    component: CyberShatterButton,
    codeTSX: `// CyberShatterButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<CyberShatterButton label="EMERGENCY SHUTDOWN" cyanColor="#06b6d4" />`,
  },

  {
    id: 'holographic-foil-button',
    name: 'Holographic Foil Refraction Button',
    category: 'buttons',
    badge: 'POPULAR',
    description: 'Metallic badge with multi-layer specular highlights and cursor-tracking iridescent rainbow diffraction light leak.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add holographic-foil-button',
    propsConfig: [
      { name: 'label', label: 'Badge Label', type: 'text', defaultValue: 'CLAIM FOUNDER BADGE' },
      { name: 'subtext', label: 'Edition Label', type: 'text', defaultValue: 'EDITION #001 // RARE' },
      { name: 'baseColor', label: 'Core Base Color', type: 'color', defaultValue: '#0f172a' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'CLAIM FOUNDER BADGE'", description: 'Button primary text' },
      { name: 'baseColor', type: 'string', default: "'#0f172a'", description: 'Background base color of the foil button' },
    ],
    component: HolographicFoilButton,
    codeTSX: `// HolographicFoilButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<HolographicFoilButton label="UNLOCK PASS" baseColor="#0f172a" />`,
  },

  {
    id: 'arcade-pixel-button',
    name: 'Retro Pixel-Art / Arcade 8-Bit Button',
    category: 'buttons',
    badge: 'NEW',
    description: 'Authentic 8-bit chunky pixelated border with crisp hard-edge shadows, deep 4px tactile press, and floating score popup.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add arcade-pixel-button',
    propsConfig: [
      { name: 'label', label: 'Arcade Label', type: 'text', defaultValue: 'START GAME' },
      { name: 'scoreText', label: 'Score Popup Text', type: 'text', defaultValue: '+100 PTS' },
      { name: 'btnColor', label: 'Button Color', type: 'color', defaultValue: '#e11d48' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'START GAME'", description: 'Arcade button title' },
      { name: 'scoreText', type: 'string', default: "'+100 PTS'", description: 'Floating point bonus popup text' },
    ],
    component: ArcadePixelButton,
    codeTSX: `// ArcadePixelButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<ArcadePixelButton label="INSERT COIN" btnColor="#e11d48" />`,
  },

  {
    id: 'liquid-mercury-button',
    name: 'Interactive Fluid Mercury / Liquid Metal Button',
    category: 'buttons',
    badge: 'SPRING',
    description: 'Chrome molten metal pill shape using SVG gooey filters and specular gradient reflections that pulls toward pointer.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add liquid-mercury-button',
    propsConfig: [
      { name: 'label', label: 'Metal Label', type: 'text', defaultValue: 'LIQUID MERCURY' },
      { name: 'metalTint', label: 'Chrome Tint', type: 'color', defaultValue: '#e2e8f0' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'LIQUID MERCURY'", description: 'Button text' },
      { name: 'metalTint', type: 'string', default: "'#e2e8f0'", description: 'Liquid metal reflective highlight tint' },
    ],
    component: LiquidMercuryButton,
    codeTSX: `// LiquidMercuryButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<LiquidMercuryButton label="MOLTEN CORE" metalTint="#e2e8f0" />`,
  },

  {
    id: 'electric-arc-button',
    name: 'Glowing Neon Wire / Electric Arc Button',
    category: 'buttons',
    badge: 'HOT',
    description: 'Dark glass container with active electrical laser spark racing around the perimeter border track with outward voltage crackles.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add electric-arc-button',
    propsConfig: [
      { name: 'label', label: 'Terminal Label', type: 'text', defaultValue: 'HIGH VOLTAGE ENGAGE' },
      { name: 'subtext', label: 'Voltage Readout', type: 'text', defaultValue: '240,000 VOLTS ACTIVE' },
      { name: 'voltageColor', label: 'Laser Glow Color', type: 'color', defaultValue: '#38bdf8' },
    ],
    apiDocs: [
      { name: 'voltageColor', type: 'string', default: "'#38bdf8'", description: 'Color of perimeter spark laser beam' },
    ],
    component: ElectricArcButton,
    codeTSX: `// ElectricArcButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<ElectricArcButton label="ACTIVATE LASER" voltageColor="#38bdf8" />`,
  },

  {
    id: 'origami-fold-button',
    name: '3D Origami / Geometric Polygon Fold Button',
    category: 'buttons',
    badge: 'NEW',
    description: 'Multi-faceted geometric faceted button with 3D polygon facets that unfold in sequence on hover with spring dampening.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add origami-fold-button',
    propsConfig: [
      { name: 'label', label: 'Matrix Label', type: 'text', defaultValue: 'FOLD MATRIX' },
      { name: 'subtext', label: 'Prism Subtext', type: 'text', defaultValue: '3D POLYGON PRISM' },
      { name: 'facetColorA', label: 'Facet Color A', type: 'color', defaultValue: '#6366f1' },
      { name: 'facetColorB', label: 'Facet Color B', type: 'color', defaultValue: '#8b5cf6' },
    ],
    apiDocs: [
      { name: 'facetColorA', type: 'string', default: "'#6366f1'", description: 'First facet tint' },
      { name: 'facetColorB', type: 'string', default: "'#8b5cf6'", description: 'Second facet tint' },
    ],
    component: OrigamiFoldButton,
    codeTSX: `// OrigamiFoldButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<OrigamiFoldButton label="UNFOLD PRISM" facetColorA="#6366f1" />`,
  },

  {
    id: 'cosmic-orbit-button',
    name: 'Cosmic Stardust / Gravity Orbit Button',
    category: 'buttons',
    badge: 'CANVAS',
    description: 'Deep space gradient button surrounded by orbiting stardust particles that react to cursor proximity with supernova shockwave.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add cosmic-orbit-button',
    propsConfig: [
      { name: 'label', label: 'Cosmic Label', type: 'text', defaultValue: 'WARP SPEED JUMP' },
      { name: 'subtext', label: 'Gravity Well Status', type: 'text', defaultValue: 'GRAVITY WELL LOCKED' },
      { name: 'starColor', label: 'Stardust Color', type: 'color', defaultValue: '#38bdf8' },
    ],
    apiDocs: [
      { name: 'starColor', type: 'string', default: "'#38bdf8'", description: 'Color of orbiting stardust particles' },
    ],
    component: CosmicOrbitButton,
    codeTSX: `// CosmicOrbitButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<CosmicOrbitButton label="ENGAGE HYPERDRIVE" starColor="#38bdf8" />`,
  },

  {
    id: 'biometric-scan-button',
    name: 'Biometric Fingerprint / Retina Scan Button',
    category: 'buttons',
    badge: 'PRO',
    description: 'High-tech security terminal with embedded laser scanner line and animated biometric authorization verification state.',
    dependencies: ['framer-motion', 'lucide-react'],
    cliCommand: 'npx sidd-reacts add biometric-scan-button',
    propsConfig: [
      { name: 'label', label: 'Security Prompt', type: 'text', defaultValue: 'AUTHENTICATE ACCESS' },
      { name: 'scannerColor', label: 'Laser Scan Color', type: 'color', defaultValue: '#06b6d4' },
      { name: 'successColor', label: 'Granted Glow Color', type: 'color', defaultValue: '#22c55e' },
    ],
    apiDocs: [
      { name: 'scannerColor', type: 'string', default: "'#06b6d4'", description: 'Color of scanning laser beam' },
      { name: 'successColor', type: 'string', default: "'#22c55e'", description: 'Color when authorization is granted' },
    ],
    component: BiometricScanButton,
    codeTSX: `// BiometricScanButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<BiometricScanButton label="VERIFY RETINA" scannerColor="#06b6d4" />`,
  },

  {
    id: 'typewriter-key-button',
    name: 'Vintage Mechanical Typewriter Key Button',
    category: 'buttons',
    badge: 'NEW',
    description: 'Circular vintage typewriter key with polished chrome rim, aged ivory face, and deep physical mechanical strike-bar press.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add typewriter-key-button',
    propsConfig: [
      { name: 'char', label: 'Key Character', type: 'text', defaultValue: 'Q' },
      { name: 'sublabel', label: 'Caption Subtext', type: 'text', defaultValue: 'TYPEWRITER KEY' },
      { name: 'keyColor', label: 'Ivory Key Face', type: 'color', defaultValue: '#fefce8' },
      { name: 'rimColor', label: 'Chrome Rim Tint', type: 'color', defaultValue: '#94a3b8' },
    ],
    apiDocs: [
      { name: 'char', type: 'string', default: "'Q'", description: 'Primary typewriter character engraved on key' },
    ],
    component: TypewriterKeyButton,
    codeTSX: `// TypewriterKeyButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<TypewriterKeyButton char="A" keyColor="#fefce8" />`,
  },

  {
    id: 'thermal-heatmap-button',
    name: 'Thermal Heatmap / Infrared Touch Button',
    category: 'buttons',
    badge: 'CANVAS',
    description: 'Matte dark polymer slate that paints real-time thermal gradient heat signatures with progressive cooling dissipation.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add thermal-heatmap-button',
    propsConfig: [
      { name: 'label', label: 'Sensor Title', type: 'text', defaultValue: 'INFRARED SENSOR' },
      { name: 'subtext', label: 'Thermal Status', type: 'text', defaultValue: 'TOUCH HEATMAP ACTIVE' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'INFRARED SENSOR'", description: 'Button primary text' },
    ],
    component: ThermalHeatmapButton,
    codeTSX: `// ThermalHeatmapButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<ThermalHeatmapButton label="HEAT SIGNATURE" />`,
  },

  {
    id: 'wax-seal-button',
    name: 'Luxury Gold Foil Emboss / Wax Seal Button',
    category: 'buttons',
    badge: 'PRO',
    description: 'Circular crimson wax medallion with deep engraved monogram patterns, gold leaf edging, and candlelight glimmer.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add wax-seal-button',
    propsConfig: [
      { name: 'monogram', label: 'Wax Monogram', type: 'text', defaultValue: 'SR' },
      { name: 'sealColor', label: 'Wax Base Color', type: 'color', defaultValue: '#991b1b' },
      { name: 'goldColor', label: 'Gold Leaf Color', type: 'color', defaultValue: '#fbbf24' },
    ],
    apiDocs: [
      { name: 'monogram', type: 'string', default: "'SR'", description: 'Engraved letters or emblem' },
      { name: 'sealColor', type: 'string', default: "'#991b1b'", description: 'Crimson wax base color' },
    ],
    component: WaxSealButton,
    codeTSX: `// WaxSealButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<WaxSealButton monogram="VIP" sealColor="#991b1b" />`,
  },

  {
    id: 'aurora-gradient-button',
    name: 'Aurora Borealis Morphing Mesh Gradient Button',
    category: 'buttons',
    badge: 'HOT',
    description: 'Translucent frosted glass button with vibrant multi-stop northern lights colors that drift and undulate continuously.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add aurora-gradient-button',
    propsConfig: [
      { name: 'label', label: 'Aurora Title', type: 'text', defaultValue: 'NORTHERN LIGHTS' },
      { name: 'subtext', label: 'Shader Subtext', type: 'text', defaultValue: 'AURORA MESH GRADIENT' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'NORTHERN LIGHTS'", description: 'Button primary text' },
    ],
    component: AuroraGradientButton,
    codeTSX: `// AuroraGradientButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<AuroraGradientButton label="EXPLORE AURORA" />`,
  },

  {
    id: 'vhs-rewind-button',
    name: 'Retro Cassette / VHS Glitch Rewind Button',
    category: 'buttons',
    badge: 'NEW',
    description: '90s camcorder aesthetic with monospaced tracking font, "REC ●" blinking indicator, and fast-forward tape warp on click.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add vhs-rewind-button',
    propsConfig: [
      { name: 'label', label: 'Tape Label', type: 'text', defaultValue: 'REWIND TAPE ◄◄' },
      { name: 'timestamp', label: 'Timecode', type: 'text', defaultValue: 'SP 0:24:18' },
      { name: 'accentColor', label: 'Rec Glow Red', type: 'color', defaultValue: '#ef4444' },
    ],
    apiDocs: [
      { name: 'label', type: 'string', default: "'REWIND TAPE ◄◄'", description: 'Button title' },
    ],
    component: VhsRewindButton,
    codeTSX: `// VhsRewindButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<VhsRewindButton label="PLAY CASSETTE" />`,
  },

  {
    id: 'soundwave-eq-button',
    name: 'Soundwave / Audio Equalizer Reactive Button',
    category: 'buttons',
    badge: 'SPRING',
    description: 'Audio capsule containing integrated vertical equalizer frequency bars that actively dance to sound waves on hover.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add soundwave-eq-button',
    propsConfig: [
      { name: 'label', label: 'Track Title', type: 'text', defaultValue: 'PLAY SOUNDTRACK' },
      { name: 'subtext', label: 'Frequency Readout', type: 'text', defaultValue: 'FREQUENCY SPECTRUM 48kHz' },
      { name: 'waveColor', label: 'Equalizer Color', type: 'color', defaultValue: '#38bdf8' },
    ],
    apiDocs: [
      { name: 'waveColor', type: 'string', default: "'#38bdf8'", description: 'Color of dancing equalizer spectrum bars' },
    ],
    component: SoundwaveEqButton,
    codeTSX: `// SoundwaveEqButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<SoundwaveEqButton label="STREAM AUDIO" waveColor="#38bdf8" />`,
  },

  {
    id: 'floating-levitation-button',
    name: 'Magnetic Floating Levitation Button',
    category: 'buttons',
    badge: 'SPRING',
    description: 'Minimalist pill elevated in mid-air with gentle vertical levitation, full 3D magnetic tilt pull, and spring bounce.',
    dependencies: ['framer-motion'],
    cliCommand: 'npx sidd-reacts add floating-levitation-button',
    propsConfig: [
      { name: 'label', label: 'Levitation Title', type: 'text', defaultValue: 'MAGNETIC LEVITATION' },
      { name: 'subtext', label: 'Field Status', type: 'text', defaultValue: 'ZERO-GRAVITY FIELD' },
      { name: 'glowColor', label: 'Magnetic Glow Tint', type: 'color', defaultValue: '#6366f1' },
    ],
    apiDocs: [
      { name: 'glowColor', type: 'string', default: "'#6366f1'", description: 'Color of magnetic levitation shadow' },
    ],
    component: FloatingLevitationButton,
    codeTSX: `// FloatingLevitationButton.tsx implementation`,
    codeJSX: `// JSX version available`,
    demoUsage: `<FloatingLevitationButton label="ZERO GRAVITY" glowColor="#6366f1" />`,
  },
];
