'use client';

import type { ReactNode } from 'react';
import { useId, useRef, useEffect, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DrawInputProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  canvasClassName?: string;
  id?: string;
  disabled?: boolean;
  clearButtonLabel?: string;
}

/**
 * DrawInput component with canvas-based drawing area for signatures
 * @param label - Label text (required)
 * @param value - Base64 data URL of the current drawing (controlled)
 * @param onChange - Callback called with data URL after each stroke
 * @param className - Additional CSS classes for the container
 * @param canvasClassName - Additional CSS classes for the canvas wrapper
 * @param id - Optional custom id for the canvas
 * @param disabled - Whether drawing is disabled
 * @param clearButtonLabel - Label for the clear button
 * @returns ReactNode
 */
export function DrawInput({
  label,
  value,
  onChange,
  className,
  canvasClassName,
  id,
  disabled = false,
  clearButtonLabel = 'Clear',
}: DrawInputProps): ReactNode {
  const generatedId = useId();
  const canvasId = id || generatedId;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef<boolean>(false);
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size based on container
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Configure drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Restore value if provided
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasDrawing(true);
      };
      img.src = value;
    }
  }, [value]);

  // Get canvas coordinates from pointer event
  const getCanvasCoordinates = useCallback(
    (event: PointerEvent | React.PointerEvent): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in event ? (event as unknown as TouchEvent).touches[0]?.clientX ?? 0 : (event as PointerEvent).clientX;
      const clientY = 'touches' in event ? (event as unknown as TouchEvent).touches[0]?.clientY ?? 0 : (event as PointerEvent).clientY;

      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    []
  );

  // Handle pointer down (start drawing)
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): void => {
      if (disabled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      isDrawingRef.current = true;

      const coords = getCanvasCoordinates(event);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    },
    [disabled, getCanvasCoordinates]
  );

  // Handle pointer move (draw line)
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>): void => {
      if (!isDrawingRef.current || disabled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const coords = getCanvasCoordinates(event);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    },
    [disabled, getCanvasCoordinates]
  );

  // Handle pointer up (end drawing and emit value)
  const handlePointerUp = useCallback((): void => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    setHasDrawing(true);
    onChange?.(dataUrl);
  }, [onChange]);

  // Handle clear button
  const handleClear = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    onChange?.('');
  }, [onChange]);

  // Handle touch events to prevent scrolling while drawing
  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>): void => {
      if (disabled) return;
      event.preventDefault();
      handlePointerDown(event as unknown as React.PointerEvent<HTMLCanvasElement>);
    },
    [disabled, handlePointerDown]
  );

  const handleTouchMove = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>): void => {
      if (disabled) return;
      event.preventDefault();
      handlePointerMove(event as unknown as React.PointerEvent<HTMLCanvasElement>);
    },
    [disabled, handlePointerMove]
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLCanvasElement>): void => {
      if (disabled) return;
      event.preventDefault();
      handlePointerUp();
    },
    [disabled, handlePointerUp]
  );

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={canvasId} className="text-white text-xs">
        {label}
      </Label>
      <div
        className={cn(
          'relative rounded-lg border border-gray-300 bg-white overflow-hidden',
          canvasClassName
        )}
      >
        <canvas
          ref={canvasRef}
          id={canvasId}
          className={cn(
            'w-full h-32 touch-none',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          aria-label={label}
        />
        {hasDrawing && !disabled && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute top-2 right-2 text-xs"
            type="button"
          >
            {clearButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
