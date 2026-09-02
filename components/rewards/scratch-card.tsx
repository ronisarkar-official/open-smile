'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScratchCardProps {
  width?: number;
  height?: number;
  finishPercent?: number;
  brushSize?: number;
  isScratched?: boolean;
  onComplete?: () => void;
  onScratchAttempt?: () => boolean;
  children: React.ReactNode;
  className?: string;
  coverText?: string;
  coverColor?: string;
}

export function ScratchCard({
  width = 310,
  height = 360,
  finishPercent = 45,
  brushSize = 22,
  isScratched = false,
  onComplete,
  onScratchAttempt,
  children,
  className,
  coverText = 'SCRATCH TO REVEAL',
  coverColor = '#FF2D78',
}: ScratchCardProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [completed, setCompleted] = React.useState(isScratched);
  const [revealed, setRevealed] = React.useState(isScratched);
  const completedRef = React.useRef(isScratched);
  const isDrawingRef = React.useRef(false);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
  const checkThrottleRef = React.useRef<number>(0);
  const percentScratchedRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (isScratched) {
      completedRef.current = true;
      setCompleted(true);
      setRevealed(true);
    }
  }, [isScratched]);

  const initCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || completedRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    const stripeWidth = 24;
    for (let x = -height; x < width + height; x += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height, height);
      ctx.lineTo(x + height + stripeWidth, height);
      ctx.lineTo(x + stripeWidth, 0);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.fillStyle = '#000000';
    ctx.font = '900 24px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('OPEN SMILE', width / 2, height / 2 - 40);

    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 10, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width / 2 - 8, height / 2 + 6, 3, 0, Math.PI * 2);
    ctx.arc(width / 2 + 8, height / 2 + 6, 3, 0, Math.PI * 2);
    ctx.fillStyle = coverColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 10, 14, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = coverColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#000000';
    ctx.font = '700 13px "Space Mono", monospace';
    ctx.fillText(coverText, width / 2, height / 2 + 65);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.font = '600 10px "Space Mono", monospace';
    ctx.fillText('★ SURPRISE REWARD INSIDE ★', width / 2, height / 2 + 90);
  }, [width, height, coverColor, coverText]);

  React.useEffect(() => {
    if (!completed) {
      initCanvas();
    }
  }, [initCanvas, completed]);

  const triggerCompletion = React.useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    setTimeout(() => {
      setRevealed(true);
      onComplete?.();
    }, 300);
  }, [onComplete]);

  const calculateScratchPercentage = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || completedRef.current) return 0;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 0;

    const sampleWidth = Math.floor(canvas.width / 4);
    const sampleHeight = Math.floor(canvas.height / 4);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = sampleWidth;
    tempCanvas.height = sampleHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return 0;

    tempCtx.drawImage(canvas, 0, 0, sampleWidth, sampleHeight);
    const imageData = tempCtx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imageData.data;

    let transparentPixels = 0;
    const totalPixels = data.length / 4;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) {
        transparentPixels++;
      }
    }

    const currentPercent = (transparentPixels / totalPixels) * 100;
    percentScratchedRef.current = currentPercent;
    return currentPercent;
  }, []);

  const cleanupListenersRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    return () => {
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current();
      }
    };
  }, []);

  const getPositionFromClient = React.useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  const scratch = React.useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || completedRef.current) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();

    lastPointRef.current = { x, y };

    const now = Date.now();
    if (now - checkThrottleRef.current > 120) {
      checkThrottleRef.current = now;
      const currentPercent = calculateScratchPercentage();
      if (currentPercent >= 85) {
        triggerCompletion();
      }
    }
  }, [brushSize, calculateScratchPercentage, triggerCompletion]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (completedRef.current) return;
    if (onScratchAttempt && !onScratchAttempt()) return;
    isDrawingRef.current = true;
    const pos = getPositionFromClient(e.clientX, e.clientY);
    lastPointRef.current = pos;
    scratch(pos.x, pos.y);

    const removeListeners = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      cleanupListenersRef.current = null;
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!isDrawingRef.current || completedRef.current) return;
      const movePos = getPositionFromClient(ev.clientX, ev.clientY);
      scratch(movePos.x, movePos.y);
    };

    const onPointerUp = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      lastPointRef.current = null;
      removeListeners();

      const currentPercent = calculateScratchPercentage();
      if (currentPercent >= finishPercent) {
        triggerCompletion();
      }
    };

    cleanupListenersRef.current = removeListeners;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className={cn(
        'relative select-none overflow-hidden border-[length:var(--border-width)] border-black rounded-xl bg-card shadow-brutal-lg touch-none',
        className
      )}
    >
      <div className="absolute inset-0 z-0 flex size-full items-center justify-center p-4">
        {children}
      </div>

      {!revealed && (
        <canvas
          ref={canvasRef}
          style={{ width, height }}
          onPointerDown={handlePointerDown}
          className={cn(
            'absolute inset-0 z-10 size-full cursor-grab active:cursor-grabbing transition-opacity duration-500 touch-none',
            completed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        />
      )}
    </div>
  );
}
