'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_FIREWORK_COLORS = [
  '#FF2D78',
  '#7B61FF',
  '#00E5FF',
  '#FFBE0B',
  '#00F5D4',
  '#FF5722',
  '#70E000',
  '#FF007F',
  '#9D4EDD',
  '#38BDF8',
  '#FF1744',
  '#FFEA00',
  '#FFFFFF',
];

const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const randColor = (): string =>
  DEFAULT_FIREWORK_COLORS[randInt(0, DEFAULT_FIREWORK_COLORS.length)];

type ParticleType = {
  x: number;
  y: number;
  color: string;
  speed: number;
  direction: number;
  vx: number;
  vy: number;
  gravity: number;
  friction: number;
  alpha: number;
  decay: number;
  size: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
  isAlive: () => boolean;
};

function createParticle(
  x: number,
  y: number,
  color: string,
  speed: number,
  direction: number,
  gravity: number,
  friction: number,
  size: number,
): ParticleType {
  const vx = Math.cos(direction) * speed;
  const vy = Math.sin(direction) * speed;
  const alpha = 1;
  const decay = rand(0.007, 0.022);

  return {
    x,
    y,
    color,
    speed,
    direction,
    vx,
    vy,
    gravity,
    friction,
    alpha,
    decay,
    size,
    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    },
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    },
    isAlive() {
      return this.alpha > 0;
    },
  };
}

type FireworkType = {
  x: number;
  y: number;
  targetY: number;
  color: string;
  speed: number;
  size: number;
  angle: number;
  vx: number;
  vy: number;
  trail: { x: number; y: number }[];
  trailLength: number;
  exploded: boolean;
  update: () => boolean;
  explode: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};

function createFirework(
  x: number,
  y: number,
  targetY: number,
  color: string,
  speed: number,
  size: number,
  particleSpeed: { min: number; max: number } | number,
  particleSize: { min: number; max: number } | number,
  palette: string[],
  multicolor: boolean,
  onExplode: (particles: ParticleType[]) => void,
): FireworkType {
  const angle = -Math.PI / 2 + rand(-0.25, 0.25);
  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const trail: { x: number; y: number }[] = [];
  const trailLength = randInt(12, 24);

  return {
    x,
    y,
    targetY,
    color,
    speed,
    size,
    angle,
    vx,
    vy,
    trail,
    trailLength,
    exploded: false,
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.02;
      if (this.vy >= 0 || this.y <= this.targetY) {
        this.explode();
        return false;
      }
      return true;
    },
    explode() {
      const numParticles = randInt(60, 130);
      const particles: ParticleType[] = [];
      const burstType = randInt(0, 3);
      const secondaryColor = palette.length > 1 ? palette[randInt(0, palette.length)] : randColor();

      for (let i = 0; i < numParticles; i++) {
        const particleAngle = rand(0, Math.PI * 2);
        const localParticleSpeed = getValueByRange(particleSpeed);
        const localParticleSize = getValueByRange(particleSize);

        let particleColor = this.color;
        if (multicolor) {
          if (burstType === 0) {
            particleColor = palette.length > 0 ? palette[randInt(0, palette.length)] : randColor();
          } else if (burstType === 1) {
            particleColor = Math.random() < 0.5 ? this.color : secondaryColor;
          } else {
            particleColor = Math.random() < 0.2 ? '#FFFFFF' : this.color;
          }
        }

        particles.push(
          createParticle(
            this.x,
            this.y,
            particleColor,
            localParticleSpeed,
            particleAngle,
            0.05,
            0.98,
            localParticleSize,
          ),
        );
      }
      onExplode(particles);
    },
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.beginPath();
      if (this.trail.length > 1) {
        ctx.moveTo(this.trail[0]?.x ?? this.x, this.trail[0]?.y ?? this.y);
        for (const point of this.trail) {
          ctx.lineTo(point.x, point.y);
        }
      } else {
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y);
      }
      ctx.strokeStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore();
    },
  };
}

function getValueByRange(range: { min: number; max: number } | number): number {
  if (typeof range === 'number') {
    return range;
  }
  return rand(range.min, range.max);
}

function getColorFromPalette(palette: string[], colorProp?: string | string[]): string {
  if (typeof colorProp === 'string') {
    return colorProp;
  }
  if (Array.isArray(colorProp) && colorProp.length > 0) {
    return colorProp[randInt(0, colorProp.length)];
  }
  return palette[randInt(0, palette.length)] ?? randColor();
}

type FireworksBackgroundProps = Omit<React.ComponentProps<'div'>, 'color'> & {
  canvasProps?: React.ComponentProps<'canvas'>;
  population?: number;
  color?: string | string[];
  fireworkSpeed?: { min: number; max: number } | number;
  fireworkSize?: { min: number; max: number } | number;
  particleSpeed?: { min: number; max: number } | number;
  particleSize?: { min: number; max: number } | number;
  multicolor?: boolean;
};

function FireworksBackground({
  ref,
  className,
  canvasProps,
  population = 1,
  color,
  fireworkSpeed = { min: 4, max: 8 },
  fireworkSize = { min: 2, max: 5 },
  particleSpeed = { min: 2, max: 7 },
  particleSize = { min: 1.5, max: 4.5 },
  multicolor = true,
  ...props
}: FireworksBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  const palette = React.useMemo(() => {
    if (Array.isArray(color) && color.length > 0) {
      return color;
    }
    if (typeof color === 'string') {
      return [color, ...DEFAULT_FIREWORK_COLORS];
    }
    return DEFAULT_FIREWORK_COLORS;
  }, [color]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let animationFrameId: number;

    let maxX = container.clientWidth || window.innerWidth;
    let maxY = container.clientHeight || window.innerHeight;
    canvas.width = maxX;
    canvas.height = maxY;

    const setCanvasSize = () => {
      if (!canvas || !container) return;
      maxX = container.clientWidth || window.innerWidth;
      maxY = container.clientHeight || window.innerHeight;
      canvas.width = maxX;
      canvas.height = maxY;
    };

    window.addEventListener('resize', setCanvasSize);

    const explosions: ParticleType[] = [];
    const fireworks: FireworkType[] = [];

    const handleExplosion = (particles: ParticleType[]) => {
      explosions.push(...particles);
    };

    const launchFirework = () => {
      if (!isMounted) return;
      const x = rand(maxX * 0.1, maxX * 0.9);
      const y = maxY;
      const targetY = rand(maxY * 0.1, maxY * 0.45);
      const fireworkColor = getColorFromPalette(palette, color);
      const speed = getValueByRange(fireworkSpeed);
      const size = getValueByRange(fireworkSize);

      fireworks.push(
        createFirework(
          x,
          y,
          targetY,
          fireworkColor,
          speed,
          size,
          particleSpeed,
          particleSize,
          palette,
          multicolor,
          handleExplosion,
        ),
      );

      const timeout = rand(350, 850) / population;
      timeoutId = setTimeout(launchFirework, timeout);
    };

    launchFirework();

    const animate = () => {
      ctx.clearRect(0, 0, maxX, maxY);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const firework = fireworks[i];
        if (!firework?.update()) {
          fireworks.splice(i, 1);
        } else {
          firework.draw(ctx);
        }
      }

      for (let i = explosions.length - 1; i >= 0; i--) {
        const particle = explosions[i];
        particle?.update();
        if (particle?.isAlive()) {
          particle.draw(ctx);
        } else {
          explosions.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, [role="button"], [role="dialog"]')) {
        return;
      }
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = maxY;
      const targetY = Math.max(maxY * 0.08, event.clientY - rect.top);
      const fireworkColor = getColorFromPalette(palette, color);
      const speed = getValueByRange(fireworkSpeed);
      const size = getValueByRange(fireworkSize);

      fireworks.push(
        createFirework(
          x,
          y,
          targetY,
          fireworkColor,
          speed,
          size,
          particleSpeed,
          particleSize,
          palette,
          multicolor,
          handleExplosion,
        ),
      );
    };

    window.addEventListener('click', handleClick);

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    population,
    color,
    palette,
    multicolor,
    fireworkSpeed,
    fireworkSize,
    particleSpeed,
    particleSize,
  ]);

  return (
    <div
      ref={containerRef}
      data-slot="fireworks-background"
      className={cn('relative size-full overflow-hidden', className)}
      {...props}
    >
      <canvas
        {...canvasProps}
        ref={canvasRef}
        className={cn('absolute inset-0 size-full pointer-events-none', canvasProps?.className)}
      />
    </div>
  );
}

export { FireworksBackground, type FireworksBackgroundProps };
