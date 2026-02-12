import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export function useResponsiveScale(panelBase = 1200, cardBase = 1400) {
  const { viewport } = useThree();
  const aspect = viewport.aspect;

  const [scales, setScales] = useState({
    orb: aspect < 0.75 ? 0.4 : 0.5, // keep your original orb logic
    panel: 1,
    card: 1,
  });

  useEffect(() => {
    const updateScales = () => {
      const base = Math.min(window.innerWidth, window.innerHeight);
      setScales({
        orb: aspect < 0.75 ? 0.4 : 0.5, // original orb rule preserved
        panel: base / panelBase,
        card: base / cardBase,
      });
    };

    updateScales();
    window.addEventListener('resize', updateScales);
    return () => window.removeEventListener('resize', updateScales);
  }, [aspect, panelBase, cardBase]);

  return scales;
}