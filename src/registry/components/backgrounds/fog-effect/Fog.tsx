// @ts-nocheck
// src/components/ThreeBackgrounds/Fog.jsx
import React, { useEffect, useRef, useState } from 'react';
import FOG from '../../../../utils/vanta.fog.custom'; // Importing the utility we created in Step 1

const Fog = ({ config }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // 1. Initialize Vanta Effect on Mount
  useEffect(() => {
    if (!vantaRef.current) return;

    // Default values if config isn't fully loaded yet
    const effect = FOG({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.0,
      scaleMobile: 1.0,
      // Initial Config
      highlightColor: config?.highlightColor || 0xffc300,
      midtoneColor: config?.midtoneColor || 0xff1f00,
      lowlightColor: config?.lowlightColor || 0x2d00ff,
      baseColor: config?.baseColor || 0xffebeb,
      blurFactor: config?.blurFactor || 0.6,
      speed: config?.speed || 1.0,
      zoom: config?.zoom || 1.0
    });

    setVantaEffect(effect);

    // Cleanup on Unmount
    return () => {
      if (effect) effect.destroy();
    };
  }, []); // Run once on mount

  // 2. Update Effect when Config Changes (Real-time Admin Control)
  useEffect(() => {
    if (vantaEffect && config) {
      vantaEffect.setOptions({
        highlightColor: config.highlightColor,
        midtoneColor: config.midtoneColor,
        lowlightColor: config.lowlightColor,
        baseColor: config.baseColor,
        blurFactor: config.blurFactor,
        speed: config.speed,
        zoom: config.zoom
      });
    }
  }, [vantaEffect, config]);

  return (
    <div 
      ref={vantaRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1,
        // Fallback background color while loading
        background: '#000' 
      }} 
    />
  );
};

export default Fog;