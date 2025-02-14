"use client";
import { useEffect, useRef, useState } from "react";
import { useMousePosition } from "@/lib/hooks/use-mouse-position";

interface SparklesProps {
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  canvasWidth: number;
  canvasHeight: number;
  color: string;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    minSize: number,
    maxSize: number,
    color: string
  ) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * this.canvasWidth;
    this.y = Math.random() * this.canvasHeight;
    this.size = Math.random() * (maxSize - minSize) + minSize;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = color;
  }

  update(mouseX: number, mouseY: number) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around screen
    if (this.x > this.canvasWidth) {
      this.x = 0;
    }
    if (this.x < 0) {
      this.x = this.canvasWidth;
    }
    if (this.y > this.canvasHeight) {
      this.y = 0;
    }
    if (this.y < 0) {
      this.y = this.canvasHeight;
    }

    // Mouse interaction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 100) {
      const angle = Math.atan2(dy, dx);
      this.x -= Math.cos(angle) * 1;
      this.y -= Math.sin(angle) * 1;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export const SparklesCore = ({
  id = "tsparticles",
  background = "transparent",
  minSize = 0.6,
  maxSize = 1.4,
  particleDensity = 100,
  className = "h-full w-full",
  particleColor = "#FFFFFF",
}: SparklesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Handle client-side initialization
  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle canvas and animation
  useEffect(() => {
    if (!isClient) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles
    particlesRef.current = Array.from(
      { length: particleDensity },
      () =>
        new Particle(
          dimensions.width,
          dimensions.height,
          minSize,
          maxSize,
          particleColor
        )
    );

    const animate = () => {
      if (!ctx || !canvas) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.update(mousePosition.x || 0, mousePosition.y || 0);
        particle.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isClient,
    dimensions,
    maxSize,
    minSize,
    mousePosition.x,
    mousePosition.y,
    particleDensity,
    particleColor,
  ]);

  if (!isClient) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        background,
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  );
};
