import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';
import './index.css';

type HexCanvasProps = {
  width: number;
  height: number;
};

export default function HexCanvas({ width, height }: HexCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const showLabels = useSelector((state: RootState) => state.grid.showLabels);
  const params = useSelector((state: RootState) => state.grid.params);
  const grid = useSelector((state: RootState) => state.grid.grid);
  const creatures = useSelector((state: RootState) => state.creatures.creatures);

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

    function drawCreature(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      type: string
    ) {
      const size = hexRadius * 0.6;

      if (type === 'ELF') {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#90ee90'; // light green
        ctx.fill();
        ctx.strokeStyle = '#006400'; // dark green border
        ctx.stroke();
      } else if (type === 'ORC') {
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.strokeStyle = '#8b4513'; // dark brown border
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
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

          const color = cost === 30 ? '#e0e0e0' : '#ffffff';
          const label = showLabels ? `${col},${r}` : '';

          drawHex(ctx, x, y, hexRadius - 0.5, color, label);
        }
      }
    }

    drawGrid(ctx);

    for (const creature of creatures) {
      const { col, row, species } = creature;
      const x = offsetX + col * horizSpacing + hexRadius;
      const y = offsetY + row * vertSpacing + (col % 2 === 0 ? 0 : vertSpacing / 2);
      drawCreature(ctx, x, y, species);
    }
  }, [params, grid, showLabels, creatures, width, height]);

  return <canvas ref={canvasRef} />;
}
