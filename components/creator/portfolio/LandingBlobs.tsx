import { blobStyle, LANDING_BLOBS, type BlobConfig } from "./blobConfig";

interface LandingBlobsProps {
  // Override the default config (used by the playground for live preview).
  blobs?: BlobConfig[];
  className?: string;
}

// Decorative background layer for the portfolio landing page: 3 blurred
// gradient blobs on top of the page's bg-black. Rendered in an absolute,
// pointer-events-none, overflow-hidden layer so blobs can bleed off the edges
// without adding scroll. Keep this behind the content (page wraps content in a
// sibling `relative z-10`).
export default function LandingBlobs({ blobs = LANDING_BLOBS, className }: LandingBlobsProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className ?? ""}`}
    >
      {blobs.map((b) => (
        <div key={b.id} style={blobStyle(b)} />
      ))}
    </div>
  );
}
