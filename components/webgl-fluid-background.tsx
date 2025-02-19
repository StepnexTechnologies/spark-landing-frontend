import { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

function WebGLFluidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("WebGL Simulation Starting...");
    const simulation = new WebGLFluidEnhanced(containerRef.current);
    simulation.start();

    return () => {
      console.log("WebGL Simulation Stopping...");
      simulation.stop();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export { WebGLFluidBackground };
