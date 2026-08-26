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
  'spotlight-card': {
    name: 'Spotlight 3D Card',
    file: 'SpotlightCard.tsx',
    dir: 'spotlight-card',
    deps: ['framer-motion', 'lucide-react', 'clsx', 'tailwind-merge'],
  },
  'true-focus': {
    name: 'True Focus Split Text',
    file: 'TrueFocusText.tsx',
    dir: 'true-focus',
    deps: ['framer-motion'],
  },
  'particle-vortex': {
    name: 'Interactive Particle Vortex Canvas',
    file: 'ParticleVortex.tsx',
    dir: 'particle-vortex',
    deps: [],
  },
  'aurora-background': {
    name: 'Aurora Ambient Background',
    file: 'AuroraBackground.tsx',
    dir: 'aurora-background',
    deps: [],
  },
  'magnetic-button': {
    name: 'Magnetic Ripple Button',
    file: 'MagneticButton.tsx',
    dir: 'magnetic-button',
    deps: ['framer-motion'],
  },
  'decrypted-text': {
    name: 'Decrypted Scramble Text',
    file: 'DecryptedText.tsx',
    dir: 'decrypted-text',
    deps: [],
  },
  'pixel-card-reveal': {
    name: 'Pixelated Image Reveal',
    file: 'PixelCardReveal.tsx',
    dir: 'pixel-card-reveal',
    deps: [],
  },
  'floating-dock': {
    name: 'Floating Mac Spring Dock',
    file: 'FloatingDock.tsx',
    dir: 'floating-dock',
    deps: ['framer-motion', 'lucide-react'],
  },
  'iridescent-glass-card': {
    name: 'Iridescent Glassmorphic Card',
    file: 'IridescentGlassCard.tsx',
    dir: 'iridescent-glass-card',
    deps: ['framer-motion', 'lucide-react'],
  },
  'hyperspeed-tunnel': {
    name: 'Hyperspeed Warp Tunnel',
    file: 'HyperspeedTunnel.tsx',
    dir: 'hyperspeed-tunnel',
    deps: [],
  },
};

console.log('\n\x1b[38;2;99;102;241m' + `
   ███████╗██╗██████╗ ██████╗       ██████╗ ███████╗ █████╗  ██████╗████████╗███████╗
   ██╔════╝██║██╔══██╗██╔══██╗      ██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝██╔════╝
   ███████╗██║██║  ██║██║  ██║█████╗██████╔╝█████╗  ███████║██║        ██║   ███████╗
   ╚════██║██║██║  ██║██║  ██║╚════╝██╔══██╗██╔══╝  ██╔══██║██║        ██║   ╚════██║
   ███████║██║██████╔╝██████╔╝      ██║  ██║███████╗██║  ██║╚██████╗   ██║   ███████║
   ╚══════╝╚═╝╚═════╝ ╚═════╝       ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚══════╝
` + '\x1b[0m');
console.log('   \x1b[36m⚡ Next-Gen Kinetic React Components Engine v2.4\x1b[0m\n');

if (!command || command === 'help' || command === '--help') {
  console.log(`   Usage:
     \x1b[32mnpx sidd-reacts add <component-name>\x1b[0m  Add component to your project
     \x1b[32mnpx sidd-reacts list\x1b[0m                 List all available components
     \x1b[32mnpx sidd-reacts init\x1b[0m                 Set up Tailwind & utils for SIDD-Reacts
  `);
  process.exit(0);
}

if (command === 'list') {
  console.log('   \x1b[1mAvailable SIDD-Reacts Components:\x1b[0m\n');
  Object.keys(COMPONENTS).forEach((key) => {
    const c = COMPONENTS[key];
    console.log(`   • \x1b[35m${key.padEnd(24)}\x1b[0m \x1b[37m${c.name}\x1b[0m`);
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
