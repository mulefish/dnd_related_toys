import React, { useRef, useEffect } from 'react';
import { JSX } from 'react/jsx-runtime';

type HexCanvasProps = {
  showLabels: boolean;
};

export default function HexCanvas({ showLabels }: HexCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const viewportWidth = 1000;
    const viewportHeight = 1000;
    const hexCols = 30;
    const hexRows = 20;

    const maxRadiusX = viewportWidth / (((hexCols - 1) * 3) / 2 + 2);
    const maxRadiusY = viewportHeight / ((hexRows - 1) * Math.sqrt(3) + 1);
    const hexRadius = Math.min(maxRadiusX, maxRadiusY);

    const hexWidth = hexRadius * 2;
    const hexHeight = Math.sqrt(3) * hexRadius;
    const horizSpacing = (3 / 2) * hexRadius;
    const vertSpacing = hexHeight;

    const offsetX = 0;
    const offsetY = 20;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewportWidth * dpr;
    canvas.height = viewportHeight * dpr;
    canvas.style.width = `${viewportWidth}px`;
    canvas.style.height = `${viewportHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    function drawHex(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string = '#fff',
      label: string = ''
    ) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const xi = x + radius * Math.cos(angle);
        const yi = y + radius * Math.sin(angle);
        ctx.lineTo(xi, yi);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ccc';
      ctx.stroke();

      if (showLabels && label) {
        ctx.fillStyle = '#333';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x, y);
      }
    }

    function drawGrid(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, viewportWidth, viewportHeight);
      for (let col = 0; col < hexCols; col++) {
        for (let row = 0; row < hexRows; row++) {
          const x = offsetX + col * horizSpacing + hexRadius;
          const y = offsetY + row * vertSpacing + (col % 2 === 0 ? 0 : vertSpacing / 2);
          drawHex(ctx, x, y, hexRadius - 0.5, '#ffffff', `(${col},${row})`);
        }
      }
    }

    drawGrid(ctx);
  }, [showLabels]);

  return <canvas ref={canvasRef} />;
}
