import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import { JSX } from 'react/jsx-runtime';
import './index.css';


type HexCanvasProps = {
  showLabels: boolean;
  width: number;
  height: number;
};
//const viewportWidth = 1000;
// const viewportHeight = 1000;

export default function HexCanvas({ showLabels, width, height }: HexCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const params = useSelector((state: RootState) => state.grid.params);
  const grid = useSelector((state: RootState) => state.grid.grid);

  useEffect(() => {
    if (!params || grid.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { hexRadius, horizSpacing, vertSpacing, offsetX, offsetY } = params;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.clearRect(0, 0, width, height);

    // canvas.width = viewportWidth * dpr;
    // canvas.height = viewportHeight * dpr;
    // canvas.style.width = `${viewportWidth}px`;
    // canvas.style.height = `${viewportHeight}px`;
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
      ctx.clearRect(0, 0, width, height);


      for (const row of grid) {
        for (const tile of row) {
          const { col, row: r, cost } = tile;
          const x = offsetX + col * horizSpacing + hexRadius;
          const y =
            offsetY +
            r * vertSpacing +
            (col % 2 === 0 ? 0 : vertSpacing / 2);

          const color = cost === 30 ? '#ffcccc' : '#ffffff'; // red tint if high cost
          const label = showLabels ? `${col},${r}` : '';

          drawHex(ctx, x, y, hexRadius - 0.5, color, label);
        }
      }
    }

    drawGrid(ctx);
  }, [params, grid, showLabels]);

  return <canvas ref={canvasRef} />;
}
