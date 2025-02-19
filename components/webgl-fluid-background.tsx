"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

interface WebGLFluidBackgroundProps {
  mousePosition?: { x: number; y: number };
}

const WebGLFluidBackground: React.FC<WebGLFluidBackgroundProps> = ({
  mousePosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<WebGLFluidEnhanced | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    try {
      simulationRef.current = new WebGLFluidEnhanced(containerRef.current, {
        SPLAT_RADIUS: 0.3,
        PRESSURE_DISSIPATION: 0.85,
        VELOCITY_DISSIPATION: 0.98,
        CURL: 30,
        SPEED: 1000,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.8,
        BLOOM_THRESHOLD: 0.6,
        BLOOM_SOFT_KNEE: 0.7,
      });

      simulationRef.current.multipleSplats(3);
      simulationRef.current.start();
    } catch (error) {
      console.error("Error initializing WebGL:", error);
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !simulationRef.current || !mousePosition) {
      return;
    }

    const container = containerRef.current;
    const x = mousePosition.x * container.clientWidth;
    const y = mousePosition.y * container.clientHeight;

    try {
      simulationRef.current.splatAtLocation(x, y, 1000, 1000);
    } catch (error) {
      console.error("Error updating simulation:", error);
    }
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full"
      style={{
        zIndex: 1,
        background: "#000",
      }}
      aria-hidden="true"
    />
  );
};

export default WebGLFluidBackground;
