// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import FOG from '../../../../utils/vanta.fog.custom';

export const Fog = ({
  config = {},
  highlightColor,
  midtoneColor,
  lowlightColor,
  baseColor,
  speed,
  className = '',
}) => {
  const cfg = {
    highlightColor: highlightColor || config?.highlightColor || 0xc084fc,
    midtoneColor: midtoneColor || config?.midtoneColor || 0x6366f1,
    lowlightColor: lowlightColor || config?.lowlightColor || 0x1e1b4b,
    baseColor: baseColor || config?.baseColor || 0x090a0f,
    speed: speed || config?.speed || 1.5,
    zoom: config?.zoom || 1.2,
    blurFactor: config?.blurFactor || 0.6,
  };

  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    if (!vantaRef.current) return;

    try {
      effectRef.current = FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.0,
        scaleMobile: 1.0,
        highlightColor: typeof cfg.highlightColor === 'string' ? parseInt(cfg.highlightColor.replace('#', '0x'), 16) : cfg.highlightColor,
        midtoneColor: typeof cfg.midtoneColor === 'string' ? parseInt(cfg.midtoneColor.replace('#', '0x'), 16) : cfg.midtoneColor,
        lowlightColor: typeof cfg.lowlightColor === 'string' ? parseInt(cfg.lowlightColor.replace('#', '0x'), 16) : cfg.lowlightColor,
        baseColor: typeof cfg.baseColor === 'string' ? parseInt(cfg.baseColor.replace('#', '0x'), 16) : cfg.baseColor,
        blurFactor: cfg.blurFactor,
        speed: cfg.speed,
        zoom: cfg.zoom,
      });
    } catch (e) {
      console.warn('Fog initialization caught safe error:', e);
    }

    return () => {
      if (effectRef.current && typeof effectRef.current.destroy === 'function') {
        try {
          effectRef.current.destroy();
        } catch (e) {
          // Ignore unmount error
        }
      }
    };
  }, [highlightColor, midtoneColor, lowlightColor, baseColor, speed]);

  return (
    <div 
      ref={vantaRef} 
      className={`relative w-full h-full min-h-[450px] overflow-hidden rounded-2xl ${className}`}
      style={{ 
        backgroundColor: '#090a0f',
      }}
    />
  );
};

export default Fog;