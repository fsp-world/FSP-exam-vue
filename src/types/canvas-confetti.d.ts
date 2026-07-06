declare module 'canvas-confetti' {
  interface ConfettiOptions {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    startVelocity?: number;
    ticks?: number;
    drift?: number;
    gravity?: number;
    decay?: number;
  }

  function confetti(options?: ConfettiOptions): Promise<null>;
  export default confetti;
}
