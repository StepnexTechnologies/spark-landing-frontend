declare module "webgl-fluid-enhanced" {
  interface WebGLFluidConfig {
    SPLAT_RADIUS: number;
    PRESSURE_DISSIPATION: number;
    VELOCITY_DISSIPATION: number;
    CURL: number;
    SPEED: number;
    BLOOM: boolean;
    BLOOM_ITERATIONS: number;
    BLOOM_RESOLUTION: number;
    BLOOM_INTENSITY: number;
    BLOOM_THRESHOLD: number;
    BLOOM_SOFT_KNEE: number;
  }

  export default class WebGLFluidEnhanced {
    constructor(config: *);
    start(): void;
    stop(): void;
    multipleSplats(n: number): void;
    splatAtLocation(x: number, y: number, dx: number, dy: number): void;
  }
}
