import { useEffect, useRef } from 'react';
import WebGLFluidEnhanced from 'webgl-fluid-enhanced';

function WebGLFluidBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("WebGL Simulation Starting...");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const simulation = new WebGLFluidEnhanced(containerRef.current);
    simulation.start();

    setInterval(() => {simulation.multipleSplats(6)}, 4000);

    return () => {
      console.log("WebGL Simulation Stopping...");
      simulation.stop();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}

export { WebGLFluidBackground };
