import { useRef, useEffect } from "react";

const STAR_COUNT = 3000;
const NEBULA_COUNT = 120;
const SPEED = 0.1;

const STAR_COLORS = [
  [180, 220, 255], // cool white-blue
  [140, 180, 255], // soft blue
  [100, 140, 255], // medium blue
  [160, 100, 255], // purple
  [200, 140, 255], // light purple
  [255, 200, 220], // warm pink-white
  [80, 200, 255], // cyan
  [255, 255, 255], // pure white
];

class WarpStar {
  x = 0;
  y = 0;
  z = 0;
  pz = 0;
  color: number[];

  constructor() {
    this.color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
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
    this.baseAlpha = 0.025;

    const r = Math.random();
    this.hue =
      r < 0.35
        ? 200 + Math.random() * 40 // blue
        : r < 0.65
          ? 240 + Math.random() * 40 // indigo-purple
          : r < 0.85
            ? 280 + Math.random() * 30 // magenta
            : 170 + Math.random() * 30; // teal
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

  draw(ctx: CanvasRenderingContext2D) {
    if (this.opacity <= 0) return;
    const alpha = this.baseAlpha * this.opacity;
    const color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${alpha})`;
    const grad = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius,
    );
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    );
  }
}

export default function AnimatedStars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<WarpStar[]>([]);
  const nebulaRef = useRef<NebulaParticle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Initialize stars
    starsRef.current = Array.from({ length: STAR_COUNT }, () => new WarpStar());

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
      ctx.scale(dpr, dpr);

      // Reinit nebula on resize
      nebulaRef.current = Array.from(
        { length: NEBULA_COUNT },
        () => new NebulaParticle(width, height, true),
      );
    };

    const frame = (timestamp: number) => {
      timeRef.current = timestamp;

      const speed = SPEED;

      const cx = width / 2;
      const cy = height / 2;

      // Fade trail
      ctx.fillStyle = "rgba(3, 4, 12, 0.12)";
      ctx.fillRect(0, 0, width, height);

      // Draw nebula clouds
      for (const nebula of nebulaRef.current) {
        nebula.update(timestamp);
        nebula.draw(ctx);
      }

      // Draw warp stars
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.update(speed);

        // Project to screen
        const sx = (star.x / star.z) * width * 0.5 + cx;
        const sy = (star.y / star.z) * height * 0.5 + cy;
        const psx = (star.x / star.pz) * width * 0.5 + cx;
        const psy = (star.y / star.pz) * height * 0.5 + cy;

        // Skip if off-screen
        if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
          star.reset();
          continue;
        }

        // Size & brightness based on depth
        const size = (1 - star.z) * 3;
        const brightness = Math.min(1, (1 - star.z) * 1.5);

        // Trail length increases with speed
        const [r, g, b] = star.color;
        const trailLen = Math.hypot(sx - psx, sy - psy);

        if (trailLen > 0.5) {
          // Draw the star trail
          const gradient = ctx.createLinearGradient(psx, psy, sx, sy);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${brightness})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.max(0.5, size * 0.8);
          ctx.beginPath();
          ctx.moveTo(psx, psy);
          ctx.lineTo(sx, sy);
          ctx.stroke();
        }

        // Draw bright star head
        if (size > 0.8) {
          ctx.beginPath();
          ctx.arc(sx, sy, size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}, ${brightness})`;
          ctx.fill();

          // Glow for bright stars
          if (brightness > 0.6 && size > 1.5) {
            ctx.beginPath();
            ctx.arc(sx, sy, size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${brightness * 0.1})`;
            ctx.fill();
          }
        }
      }

      // Subtle vignette
      const vignetteSize = Math.max(width, height) * 0.8;
      const vignette = ctx.createRadialGradient(
        cx,
        cy,
        vignetteSize * 0.3,
        cx,
        cy,
        vignetteSize,
      );
      vignette.addColorStop(0, "transparent");
      vignette.addColorStop(1, "rgba(0, 0, 5, 0.4)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      rafRef.current = requestAnimationFrame(frame);
    };

    resize();
    // First frame: fill with dark background
    ctx.fillStyle = "rgb(3, 4, 12)";
    ctx.fillRect(0, 0, width, height);

    rafRef.current = requestAnimationFrame(frame);

    const resizeObserver = new ResizeObserver(() => {
      ctx.resetTransform();
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
