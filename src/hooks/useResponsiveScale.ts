import { useEffect, useMemo, useState } from "react";

type DeviceClass = "phone" | "tablet" | "desktop";

type ResponsiveScale = {
  device: DeviceClass;
  isPhone: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  layout: "stacked" | "floating";
  width: number;
  height: number;
  orb: number;
  panel: number;
  card: number;
  spacing: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function readViewport() {
  if (typeof window === "undefined") {
    return { width: 1440, height: 900 };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function buildScales(
  width: number,
  height: number,
  panelBase: number,
  cardBase: number
): ResponsiveScale {
  const shortestSide = Math.min(width, height);
  const aspect = width / Math.max(height, 1);
  const device: DeviceClass = width < 768 ? "phone" : width < 1180 ? "tablet" : "desktop";
  const basePanelScale = shortestSide / panelBase;
  const baseCardScale = shortestSide / cardBase;

  if (device === "phone") {
    return {
      device,
      isPhone: true,
      isTablet: false,
      isDesktop: false,
      layout: "stacked",
      width,
      height,
      orb: aspect > 0.7 ? 0.34 : 0.38,
      panel: clamp(basePanelScale * 1.1, 0.78, 0.98),
      card: clamp(baseCardScale * 1.12, 0.82, 1),
      spacing: 14,
    };
  }

  if (device === "tablet") {
    return {
      device,
      isPhone: false,
      isTablet: true,
      isDesktop: false,
      layout: "floating",
      width,
      height,
      orb: aspect < 0.9 ? 0.43 : 0.46,
      panel: clamp(basePanelScale, 0.88, 1.02),
      card: clamp(baseCardScale, 0.86, 0.98),
      spacing: 20,
    };
  }

  return {
    device,
    isPhone: false,
    isTablet: false,
    isDesktop: true,
    layout: "floating",
    width,
    height,
    orb: aspect < 0.75 ? 0.45 : 0.5,
    panel: clamp(basePanelScale, 0.94, 1.08),
    card: clamp(baseCardScale, 0.9, 1.02),
    spacing: 24,
  };
}

export function useResponsiveScale(panelBase = 1200, cardBase = 1400) {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    const updateViewport = () => {
      setViewport(readViewport());
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return useMemo(
    () => buildScales(viewport.width, viewport.height, panelBase, cardBase),
    [viewport.width, viewport.height, panelBase, cardBase]
  );
}
