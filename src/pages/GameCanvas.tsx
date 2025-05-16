import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCommunication } from '../hooks/useCommunication';

export default function GameCanvas() {
  const { startGame, runTurn } = useCommunication();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const globals = useSelector((state: RootState) => state.globals);
  const showHexIds = globals.isShowHexIds;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !globals.data) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = globals.data.cols;
    const rows = globals.data.rows;
    const hex_size = globals.data.hex_size;

    const hexHeight = Math.sqrt(3) * hex_size;
    const hexWidth = 2 * hex_size;
    const vertSpacing = hexHeight;
    const horizSpacing = 0.75 * hexWidth;

    const canvasWidth = cols * horizSpacing + hex_size;
    const canvasHeight = rows * vertSpacing + hexHeight / 2;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const drawHex = (x: number, y: number, size: number, label: string | null) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = '#999';
      ctx.stroke();

      if (label && showHexIds) {
        ctx.font = '10px sans-serif';
        ctx.fillStyle = '#444';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y + 4);
      }
    };

    const drawCreature = (c: any, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(c.x, c.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();

      const angleRad = (Math.PI / 180) * c.angle;
      const lineX = c.x + Math.cos(angleRad) * (c.movement ?? 20);
      const lineY = c.y + Math.sin(angleRad) * (c.movement ?? 20);
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(lineX, lineY);
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * horizSpacing + hex_size;
        const y = row * vertSpacing + (col % 2 === 0 ? 0 : vertSpacing / 2);
        const label = `${row},${col}`;
        drawHex(x, y, hex_size, label);
      }
    }

    Object.values(globals.elves).forEach((e: any) => drawCreature(e, 'green'));
    Object.values(globals.orcs).forEach((o: any) => drawCreature(o, 'red'));
  }, [globals]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc' }} />
      <div style={{ marginTop: '1rem' }}>
        <button onClick={startGame}>Start Game</button>
        <button onClick={runTurn}>Run Turn</button>
      </div>
    </div>
  );
}
