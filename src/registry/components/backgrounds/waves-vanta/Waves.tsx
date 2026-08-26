// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';

const Waves = ({ config }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  
  // Load Scripts Helper
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(); 
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initVanta = async () => {
      try {
        // Load Three.js r134 (Safe for Vanta)
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        // Load Vanta Waves
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js');
        
        if (!vantaEffect && window.VANTA && window.VANTA.WAVES) {
             const effect = window.VANTA.WAVES({
              el: myRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              // Force string parsing or number conversion just in case
              color: config.wavesColor ? parseInt(String(config.wavesColor).replace('#', '0x'), 16) : 0x005588,
              shininess: config.wavesShininess ?? 30,
              waveHeight: config.wavesHeight ?? 15,
              waveSpeed: config.wavesSpeed ?? 1,
              zoom: config.wavesZoom ?? 1
            });
            setVantaEffect(effect);
        }
      } catch (err) {
        console.error("Failed to load Vanta Scripts", err);
      }
    };

    initVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Handle Dynamic Updates
  useEffect(() => {
    if (vantaEffect) {
      vantaEffect.setOptions({
        color: config.wavesColor ? parseInt(String(config.wavesColor).replace('#', '0x'), 16) : 0x005588,
        shininess: config.wavesShininess ?? 30,
        waveHeight: config.wavesHeight ?? 15,
        waveSpeed: config.wavesSpeed ?? 1,
        zoom: config.wavesZoom ?? 1
      });
    }
  }, [config, vantaEffect]);

  return (
    <div 
      ref={myRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        // pointerEvents must be auto/none?
        // Vanta usually attaches mouse listeners to window, so pointerEvents on div might effectively be background.
        // But if we want the user to be able to click links ON TOP, this must be behind.
        // So zIndex: -1 is correct.
      }}
    />
  );
};

export default Waves;
