"use client";

import type React from "react";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: Particle[];
    // particles = [];

    const MAX_PARTICLES = 500;

    const createParticle = (x: number, y: number) => {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }

      const size = Math.random() * 5 + 1;
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      const speedX = Math.random() * 3 - 1.5;
      const speedY = Math.random() * 3 - 1.5;

      particles.push({ x, y, size, color, speedX, speedY });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move and shrink particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.size -= 0.05;
      });

      // Keep only particles that are still visible
      particles = particles.filter((particle) => particle.size > 0.3);

      // Draw particles
      particles.forEach((particle) => {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        createParticle(event.x, event.y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default InteractiveBackground;
