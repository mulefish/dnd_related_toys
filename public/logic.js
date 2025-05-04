// logic.js
import { Elf, Orc } from './Combatants.js';

export class Hexagon {
  constructor(x, y, col, row, isDifficultTerrian = false) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
    this.isDifficultTerrian = isDifficultTerrian;
    this.cost = isDifficultTerrian ? 30 : 10 // Cost to traverse this Hexagon
  }
}

export const grid = [];

export let hexRadius;
let canvas;

export function buildGrid(targetCanvas) {
  canvas = targetCanvas;
  const ctx = canvas.getContext("2d");

  const dpr = window.devicePixelRatio || 1;
  const sidebarOffset = 50;
  const cssWidth = window.innerWidth - sidebarOffset;
  const cssHeight = 600;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  hexRadius = cssWidth / (40 * 1.5);
  const hexHeight = Math.sqrt(3) * hexRadius;
  const hexWidth = 2 * hexRadius;
  const vertDist = hexHeight;
  const horizDist = (3 / 4) * hexWidth;

  const rows = Math.floor(canvas.height / vertDist) + 2;
  const cols = Math.floor(canvas.width / horizDist) + 2;

  for (let col = 0; col < cols; col++) {
    grid[col] = [];
    for (let row = 0; row < rows; row++) {
      const x = col * horizDist;
      const y = row * vertDist + (col % 2) * (vertDist / 2);
      const isDifficultTerrian = Math.random() < 0.05;
      grid[col][row] = new Hexagon(x, y, col, row, isDifficultTerrian);
    }
  }

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      if (grid[col][row].isDifficultTerrian) {
        let neighbors = getNeighbors(col, row);
        neighbors.forEach(([c, r]) => {
          if (!grid[c][r].isDifficultTerrian && Math.random() < 0.2) {
            grid[c][r].isDifficultTerrian = true;
          }
        });
      }
    }
  }
}

export function drawHex(ctx, x, y, radius, color) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i;
    const x_i = x + radius * Math.cos(angle);
    const y_i = y + radius * Math.sin(angle);
    ctx.lineTo(x_i, y_i);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#ccc";
  ctx.stroke();
}

export function drawGrid(ctx, debug = false) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "8px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const hex = grid[col][row];
      const color = hex.isDifficultTerrian ? "#e0e0e0" : "#ffffff";
      drawHex(ctx, hex.x, hex.y, hexRadius, color);
      if (debug) {
        ctx.fillStyle = "#555";
        ctx.fillText(`(${col},${row})`, hex.x, hex.y);
      }
    }
  }
}

export function drawTrails(ctx, orcs, elves) {
  const orcTrailColor = "#a0c4ff";
  const elfTrailColor = "#ffd6a5";
  orcs.forEach((orc) => {
    if (orc.prevCol !== undefined && orc.prevRow !== undefined) {
      const hex = grid[orc.prevCol][orc.prevRow];
      drawHex(ctx, hex.x, hex.y, hexRadius, orcTrailColor);
    }
  });
  elves.forEach((elf) => {
    if (elf.prevCol !== undefined && elf.prevRow !== undefined) {
      const hex = grid[elf.prevCol][elf.prevRow];
      drawHex(ctx, hex.x, hex.y, hexRadius, elfTrailColor);
    }
  });
}

export function getNeighbors(col, row) {
  const directions = [
    [+1, 0], [-1, 0], [0, +1], [0, -1],
    [col % 2 === 0 ? -1 : +1, -1],
    [col % 2 === 0 ? -1 : +1, +1],
  ];
  return directions.map(([dc, dr]) => [col + dc, row + dr])
    .filter(([c, r]) => c >= 0 && c < grid.length && r >= 0 && r < grid[c].length);
}

export function randomNeighbor(col, row) {
  const neighbors = getNeighbors(col, row);
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

export { Elf, Orc };
