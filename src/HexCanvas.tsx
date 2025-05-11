import { useRef, useEffect, useState, JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import './index.css';
import { } from 'react-redux';
import { setActiveCreature } from './store/creatureSlice';


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
  const activeIndex = useSelector((state: RootState) => state.creatures.activeIndex);
  const dispatch = useDispatch();

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !params) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const nearest = findNearestCreature(x, y);
      if (nearest?.creature) {
        console.log('Clicked creature:', nearest.creature);
        dispatch(setActiveCreature(nearest.index));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, [params, creatures]);

  function findNearestCreature(x: number, y: number) {
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < creatures.length; i++) {
      const c = creatures[i];
      const cx = params!.offsetX + c.col * params!.horizSpacing + params!.hexRadius;
      const cy =
        params!.offsetY +
        c.row * params!.vertSpacing +
        (c.col % 2 === 0 ? 0 : params!.vertSpacing / 2);
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        nearest = { x: cx, y: cy, creature: c, index: i };
      }
    }

    return nearest;
  }

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
        ctx.fillStyle = '#ff0000';
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
      type: string,
      name: string,
      hitpoints: number,
      damage: number
    ) {
      const size = hexRadius * 0.8;
      const remainingHP = Math.max(hitpoints - damage, 0);
      const maxLineWidth = size;
      const hpRatio = Math.min(1, remainingHP / hitpoints);
      const lineWidth = maxLineWidth * hpRatio;

      ctx.fillStyle = '#000';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(name, x, y - size / 1.2);

      ctx.beginPath();
      // ctx.strokeStyle = hpRatio > 0.6 ? '#44aa44' : hpRatio > 0.3 ? '#ffaa00' : '#cc2222';
      ctx.strokeStyle = hpRatio > 0.6 ? '#44aa44' : hpRatio > 0.3 ? '#ffaa00' : '#cc2222';
      ctx.lineWidth = 3;
      const lineY = y - size * 0.8;
      ctx.moveTo(x - lineWidth / 2, lineY);
      ctx.lineTo(x + lineWidth / 2, lineY);
      ctx.stroke();

      if (type === 'ELF') {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        ctx.fillStyle = '#90ee90';
        ctx.fill();
        ctx.strokeStyle = '#006400';
        ctx.stroke();
      } else if (type === 'ORC') {
        ctx.beginPath();
        ctx.fillStyle = 'orange';
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
        ctx.strokeStyle = '#8b4513';
        ctx.strokeRect(x - size / 2, y - size / 2, size, size);
      }
    }



    function drawGrid(ctx: CanvasRenderingContext2D) {
      for (const row of grid) {
        for (const tile of row) {
          const { col, row: r, cost } = tile;
          const x = offsetX + col * horizSpacing + hexRadius;
          const y =
            offsetY +
            r * vertSpacing +
            (col % 2 === 0 ? 0 : vertSpacing / 2);

          let color = cost === 30 ? '#e0e0e0' : '#ffffff';
          const activeCreature = creatures[activeIndex ?? -1];
          if (activeCreature && activeCreature.row === r && activeCreature.col === col) {
            color = 'yellow';
          }

          const label = showLabels ? `${col} ${r} ${cost}` : '';
          drawHex(ctx, x, y, hexRadius - 0.5, color, label);
        }
      }
    }

    drawGrid(ctx);

    // Draw lines from creatures to their targets
    for (const creature of creatures) {
      if (creature.target !== null && creature.target >= 0 && creature.target < creatures.length) {
        const target = creatures[creature.target];

        const x1 = offsetX + creature.col * horizSpacing + hexRadius;
        const y1 = offsetY + creature.row * vertSpacing + (creature.col % 2 === 0 ? 0 : vertSpacing / 2);
        const x2 = offsetX + target.col * horizSpacing + hexRadius;
        const y2 = offsetY + target.row * vertSpacing + (target.col % 2 === 0 ? 0 : vertSpacing / 2);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }



    for (const creature of creatures) {
      const { col, row, species, name, hitpoints, damage } = creature;
      const x = offsetX + col * horizSpacing + hexRadius;
      const y = offsetY + row * vertSpacing + (col % 2 === 0 ? 0 : vertSpacing / 2);
      drawCreature(ctx, x, y, species, name, hitpoints, damage);
    }

    if (mousePos) {
      const nearest = findNearestCreature(mousePos.x, mousePos.y);
      if (nearest) {
        ctx.beginPath();
        ctx.moveTo(mousePos.x, mousePos.y);
        ctx.lineTo(nearest.x, nearest.y);
        ctx.strokeStyle = '#ff6633';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [params, grid, showLabels, creatures, activeIndex, width, height, mousePos]);

  return <canvas ref={canvasRef} />;
}
