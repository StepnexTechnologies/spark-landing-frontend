"use client";
import React, { useEffect, useState } from "react";

const NotFound: React.FC = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const countdown = setInterval(() => {
      setCount((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    setTimeout(() => {
      const simulationInstance = (
        window as unknown as Window & { fluidSimulation: any }
      ).fluidSimulation;
      if (simulationInstance) {
        simulationInstance.multipleSplats(10);
      }
    }, 500);

    setTimeout(() => {
      window.location.href = `/`;
    }, 3000);

    return () => clearInterval(countdown);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center z-50 pointer-events-none min-h-screen space-y-8">
      <h1 className="text-xl xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
        Lost in the spark? Let’s get you back on track!
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium mt-2">
        Redirecting in {count}...
      </p>
    </div>
  );
};

export default NotFound;
