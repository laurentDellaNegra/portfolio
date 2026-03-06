import { useRef, useEffect } from "react";

const STAR_COUNT = 1500;
const NEBULA_COUNT = 40;
const SPEED = 0.1;

const STAR_COLORS = [
  [0, 240, 255],   // neon cyan
  [0, 200, 255],   // electric blue
  [176, 0, 255],   // neon purple
  [255, 0, 229],   // neon magenta
  [255, 45, 123],  // neon pink
  [100, 160, 255], // soft blue
  [200, 140, 255], // light purple
  [255, 255, 255], // pure white
];

class WarpStar {
  x = 0;
  y = 0;
  z = 0;
  pz = 0;
  color: number[];
  headColor: string;

  constructor() {
    this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    const [r, g, b] = this.color;
    this.headColor = `rgb(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)})`;
    this.reset(true);
  }

  reset(initial = false) {
    this.x = (Math.random() - 0.5) * 2;
    this.y = (Math.random() - 0.5) * 2;
    this.z = initial ? Math.random() : 1;
    this.pz = this.z;
  }

  update(speed: number) {
    this.pz = this.z;
    this.z -= speed * 0.01;
    if (this.z <= 0) {
      this.reset();
    }
  }
}

class NebulaParticle {
  x: number;
  y: number;
  radius: number;
  hue: number;
  saturation: number;
  lightness: number;
  baseAlpha: number;
  drift: number;
  phase: number;
  opacity: number;
  fadeSpeed: number;
  fadingIn: boolean;
  w: number;
  h: number;

  constructor(w: number, h: number, initial = false) {
    this.w = w;
    this.h = h;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = 100 + Math.random() * 300;
    this.drift = 0.05 + Math.random() * 0.15;
    this.phase = Math.random() * Math.PI * 2;
    this.opacity = initial ? Math.random() : 0;
    this.fadingIn = true;
    this.fadeSpeed = 0.002 + Math.random() * 0.004;
    this.baseAlpha = 0.06;

    const r = Math.random();
    this.hue =
      r < 0.3
        ? 180 + Math.random() * 20
        : r < 0.55
          ? 270 + Math.random() * 30
          : r < 0.8
            ? 300 + Math.random() * 30
            : 200 + Math.random() * 40;
    this.saturation = 60 + Math.random() * 30;
    this.lightness = 30 + Math.random() * 20;
  }

  respawn() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.radius = 100 + Math.random() * 300;
    this.phase = Math.random() * Math.PI * 2;
    this.fadeSpeed = 0.002 + Math.random() * 0.004;
    this.opacity = 0;
    this.fadingIn = true;

    const r = Math.random();
    this.hue =
      r < 0.35
        ? 200 + Math.random() * 40
        : r < 0.65
          ? 240 + Math.random() * 40
          : r < 0.85
            ? 280 + Math.random() * 30
            : 170 + Math.random() * 30;
    this.saturation = 60 + Math.random() * 30;
    this.lightness = 30 + Math.random() * 20;
  }

  update(time: number) {
    this.x += Math.sin(time * 0.00005 + this.phase) * this.drift;
    this.y += Math.cos(time * 0.00003 + this.phase) * this.drift * 0.5;

    if (this.fadingIn) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 1) {
        this.opacity = 1;
        this.fadingIn = false;
      }
    } else {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0) {
        this.respawn();
      }
    }
  }
}

export default function AnimatedStars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const stars = Array.from({ length: STAR_COUNT }, () => new WarpStar());
    let nebulas: NebulaParticle[] = [];

    // Offscreen canvases for expensive layers
    let nebulaCanvas: HTMLCanvasElement | null = null;
    let nebulaCtx: CanvasRenderingContext2D | null = null;
    let vignetteCanvas: HTMLCanvasElement | null = null;
    let nebulaFrameCounter = 0;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nebulas = Array.from(
        { length: NEBULA_COUNT },
        () => new NebulaParticle(width, height, true),
      );

      // Offscreen nebula layer
      nebulaCanvas = document.createElement("canvas");
      nebulaCanvas.width = width * dpr;
      nebulaCanvas.height = height * dpr;
      nebulaCtx = nebulaCanvas.getContext("2d")!;
      nebulaCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nebulaFrameCounter = 0;

      // Pre-render vignette
      vignetteCanvas = document.createElement("canvas");
      vignetteCanvas.width = width * dpr;
      vignetteCanvas.height = height * dpr;
      const vCtx = vignetteCanvas.getContext("2d")!;
      vCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const vignetteSize = Math.max(width, height) * 0.8;
      const cx = width / 2;
      const cy = height / 2;
      const vignette = vCtx.createRadialGradient(cx, cy, vignetteSize * 0.3, cx, cy, vignetteSize);
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 5, 0.4)");
      vCtx.fillStyle = vignette;
      vCtx.fillRect(0, 0, width, height);
    };

    const frame = (timestamp: number) => {
      const cx = width / 2;
      const cy = height / 2;

      // Fade trail
      ctx.fillStyle = "rgba(3, 4, 12, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Redraw nebula layer every 6 frames (~10fps) — they move slowly anyway
      if (nebulaCtx && nebulaCanvas) {
        nebulaFrameCounter++;
        if (nebulaFrameCounter >= 6) {
          nebulaFrameCounter = 0;
          nebulaCtx.clearRect(0, 0, width, height);
          for (let i = 0; i < nebulas.length; i++) {
            const n = nebulas[i];
            n.update(timestamp);
            if (n.opacity <= 0) continue;
            const alpha = n.baseAlpha * n.opacity;
            const color = `hsla(${n.hue},${n.saturation}%,${n.lightness}%,${alpha})`;
            const grad = nebulaCtx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
            grad.addColorStop(0, color);
            grad.addColorStop(1, "transparent");
            nebulaCtx.fillStyle = grad;
            nebulaCtx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
          }
        }
        ctx.drawImage(nebulaCanvas, 0, 0, width, height);
      }

      // Draw warp stars — batch by color to reduce state changes
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.update(SPEED);

        const sx = (star.x / star.z) * width * 0.5 + cx;
        const sy = (star.y / star.z) * height * 0.5 + cy;

        // Skip if off-screen
        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
          star.reset();
          continue;
        }

        const psx = (star.x / star.pz) * width * 0.5 + cx;
        const psy = (star.y / star.pz) * height * 0.5 + cy;

        const size = (1 - star.z) * 3;
        const brightness = Math.min(1, (1 - star.z) * 1.5);
        const [r, g, b] = star.color;

        // Draw trail as simple line (no gradient — major perf win)
        ctx.globalAlpha = brightness;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.lineWidth = Math.max(0.5, size * 0.6);
        ctx.beginPath();
        ctx.moveTo(psx, psy);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Draw star head
        if (size > 0.8) {
          ctx.fillStyle = star.headColor;
          ctx.beginPath();
          ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Draw pre-rendered vignette
      if (vignetteCanvas) {
        ctx.drawImage(vignetteCanvas, 0, 0, width, height);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    resize();
    ctx.fillStyle = "rgb(3, 4, 12)";
    ctx.fillRect(0, 0, width, height);

    rafRef.current = requestAnimationFrame(frame);

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas ref={canvasRef} />
    </div>
  );
}
