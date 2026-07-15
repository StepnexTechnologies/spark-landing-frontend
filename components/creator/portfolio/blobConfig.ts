// Config for the decorative background blobs on the portfolio landing page,
// consumed by LandingBlobs. Adjust the values in LANDING_BLOBS below to
// reposition / recolour the blobs.

import type { CSSProperties } from "react";

export interface BlobConfig {
  id: string;
  // Full CSS gradient string (paint of the blob).
  gradient: string;
  // Position of the blob's top-left in pixels, from the top-left of the blob
  // layer. Negative values push the blob partly off-screen (usually desired).
  top: number; // px
  left: number; // px
  // Size in pixels.
  width: number;
  height: number;
  rotate: number; // deg
  blur: number; // px
  opacity: number; // 0..1
  // Corner rounding as a percentage (50 = perfect ellipse/circle).
  borderRadius: number; // %
}

// The three gradients supplied for the portfolio landing page.
const GRADIENT_A = "linear-gradient(312.38deg, #DD2A7B -30.82%, #520078 88.29%)";
const GRADIENT_B = "linear-gradient(61.78deg, #DD2A7B -4.18%, #520078 48.58%)";
const GRADIENT_C = "linear-gradient(312.38deg, #DD2A7B -30.82%, #520078 88.29%)";

// Starting positions (px) — tune these on the playground. Spread top → middle
// → bottom so colour follows the scroll down the page.
export const LANDING_BLOBS: BlobConfig[] = [
  {
    id: "blob-1",
    gradient: GRADIENT_A,
    top: 300,
    left: -160,
    width: 470,
    height: 430,
    rotate: 0,
    blur: 100,
    opacity: 0.75,
    borderRadius: 50,
  },
  {
    id: "blob-2",
    gradient: GRADIENT_B,
    top: 370,
    left: 180,
    width: 380,
    height: 280,
    rotate: 0,
    blur: 101,
    opacity: 0.65,
    borderRadius: 50,
  },
  {
    id: "blob-3",
    gradient: GRADIENT_C,
    top: 850,
    left: -1200,
    width: 1950,
    height: 1300,
    rotate: 0,
    blur: 100,
    opacity: 0.6,
    borderRadius: 50,
  },
];

// Turn one blob config into the inline style object used to render it. Shared
// by LandingBlobs and the playground so both render identically.
export function blobStyle(b: BlobConfig): CSSProperties {
  return {
    position: "absolute",
    top: `${b.top}px`,
    left: `${b.left}px`,
    width: `${b.width}px`,
    height: `${b.height}px`,
    background: b.gradient,
    borderRadius: `${b.borderRadius}%`,
    filter: `blur(${b.blur}px)`,
    opacity: b.opacity,
    transform: `rotate(${b.rotate}deg) translate3d(0,0,0)`,
    willChange: "transform",
    WebkitBackfaceVisibility: "hidden",
    pointerEvents: "none",
  };
}
