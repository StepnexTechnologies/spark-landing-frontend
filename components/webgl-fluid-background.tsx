// webgl-fluid-background.tsx
"use client"
import {useEffect, useRef} from 'react';

// Defer the WebGL library + simulation start to idle time so initial paint/TBT
// isn't blocked by canvas setup and shader compilation.

interface FluidSimulation {
  start: () => void;
  stop: () => void;
}

export function WebGLFluidBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let simulation: FluidSimulation | null = null;

    const boot = async () => {
      const mod = await import('webgl-fluid-enhanced');
      if (cancelled || !containerRef.current) return;
      const WebGLFluidEnhanced = mod.default as unknown as new (el: HTMLElement) => FluidSimulation;
      simulation = new WebGLFluidEnhanced(containerRef.current);
      (window as unknown as { fluidSimulation?: FluidSimulation }).fluidSimulation = simulation;
      simulation.start();
    };

    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    const timeoutId = ric ? ric(() => { void boot(); }, { timeout: 2000 }) : window.setTimeout(() => { void boot(); }, 400);

    return () => {
      cancelled = true;
      if (!ric) clearTimeout(timeoutId);
      if (simulation) simulation.stop();
      delete (window as unknown as { fluidSimulation?: FluidSimulation }).fluidSimulation;
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}