// logic.js
export const grid = [];

export class Hexagon {
  constructor(x, y, col, row, isDifficultTerrian = false) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.row = row;
    this.isDifficultTerrian = isDifficultTerrian;
    this.cost = isDifficultTerrian ? 3 : 1;
  }
}

export class Creature {
  constructor(total_points) {
    this.name = "";
    this.selfPreservation = 0;
    this.goalDriven = 50;
    this.attack = 0;
    this.hitpoints = 0;
    this.movement = 0;
    this.sight = 0;
    this.initiative = 0;
    this.range = 0;
    this.breedableScore = 0;
    this.col = 0;
    this.row = 0;
    assignPoints(this, total_points);
    this.specialFeatures();
  }

  specialFeatures() {}
}

export class Elf extends Creature {
  specialFeatures() {
    this.name = generateElfName();
  }
}

export class Orc extends Creature {
  specialFeatures() {
    this.name = generateOrcName();
  }
}

const elfSyllables = ["Leaf", "Grass", "Moon", "Ocean", "Sky", "Jupiter", "Dusk", "Eve", "Rain", "Mist", "Cliff", "Dirt", "ButterFly", "Starry", "Dew", "Warm", "Sun"];
const orcSyllables = ["Gor", "Thrak", "Urg", "Zug", "Mok", "Krul", "Vrag", "Dum", "Shar", "Grish"];
const seenNames = new Map();

function generateName(syllables, count) {
  const parts = Array.from({ length: count }, () => syllables[Math.floor(Math.random() * syllables.length)]);
  let name = parts.join("");
  if (seenNames.has(name)) {
    name += seenNames.get(name);
    seenNames.set(name, seenNames.get(name) + 1);
  } else {
    seenNames.set(name, 1);
  }
  return name;
}

export function generateElfName() {
  return generateName(elfSyllables, 1 + Math.floor(Math.random() * 2) + 1);
}

export function generateOrcName() {
  return generateName(orcSyllables, Math.floor(Math.random() * 4) + 1);
}

function assignPoints(creature, total) {
  const attrs = ["selfPreservation", "attack", "hitpoints", "movement", "initiative"];
  let remaining = total;
  for (const attr of attrs) {
    const base = Math.floor(Math.random() * 21) + 10;
    creature[attr] = Math.min(100, (creature[attr] || 0) + base);
    remaining -= base;
  }
  while (remaining > 0) {
    const attr = attrs[Math.floor(Math.random() * attrs.length)];
    const bonus = Math.floor(Math.random() * 71);
    const alloc = Math.min(bonus, remaining);
    creature[attr] = Math.min(100, creature[attr] + alloc);
    remaining -= alloc;
  }
  creature.sight = creature.movement + Math.floor(creature.movement * 0.5);
}

export function buildGrid(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = window.innerWidth - 50;
  const cssHeight = 600;
  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width = cssWidth + "px";
  canvas.style.height = cssHeight + "px";

  const hexWidth = cssWidth / 50 * 1.5;
  const hexRadius = hexWidth / 2;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const vertDist = hexHeight;
  const horizDist = (3 / 4) * hexWidth;

  const rows = Math.floor(canvas.height / dpr / vertDist) + 2;
  const cols = Math.floor(canvas.width / dpr / horizDist) + 2;

  for (let col = 0; col < cols; col++) {
    grid[col] = [];
    for (let row = 0; row < rows; row++) {
      const x = col * horizDist;
      const y = row * vertDist + (col % 2) * (vertDist / 2);
      const isHard = Math.random() < 0.05;
      grid[col][row] = new Hexagon(x, y, col, row, isHard);
    }
  }
}

export function drawGrid(ctx, debug = false) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const hex = grid[col][row];
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x_i = hex.x + 8 * Math.cos(angle);
        const y_i = hex.y + 8 * Math.sin(angle);
        ctx.lineTo(x_i, y_i);
      }
      ctx.closePath();
      ctx.fillStyle = hex.isDifficultTerrian ? "#e0e0e0" : "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#ccc";
      ctx.stroke();

      if (debug) {
        ctx.fillStyle = "#888";
        ctx.font = "6px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`(${hex.col},${hex.row})`, hex.x, hex.y);
      }
    }
  }
}

export function drawTrails(ctx, orcs, elves) {
  [...orcs, ...elves].forEach(c => {
    if (c.prevCol != null && c.prevRow != null) {
      const hex = grid[c.prevCol][c.prevRow];
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x_i = hex.x + 8 * Math.cos(angle);
        const y_i = hex.y + 8 * Math.sin(angle);
        ctx.lineTo(x_i, y_i);
      }
      ctx.closePath();
      ctx.fillStyle = c instanceof Orc ? "#a0c4ff" : "#ffd6a5";
      ctx.fill();
    }
  });
}

export function drawTargets(ctx, orcs, elves) {
  ctx.strokeStyle = "red";
  [...orcs, ...elves].forEach(c => {
    if (c.target) {
      const from = grid[c.col][c.row];
      const to = grid[c.target.col][c.target.row];
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  });
}

function euclidean(a, b) {
  return Math.sqrt((a.col - b.col) ** 2 + (a.row - b.row) ** 2);
}

export function orcMoveTowardElves(orc, elves, lookOnly = false) {
  const visible = elves.filter(e => euclidean(orc, e) <= orc.sight);
  if (visible.length === 0) return;
  visible.sort((a, b) => euclidean(orc, a) - euclidean(orc, b));
  const target = visible[0];
  orc.target = target;
  if (lookOnly) return;

  moveToward(orc, target);
}

export function elfMoveTowardOrcs(elf, orcs, lookOnly = false) {
  const visible = orcs.filter(o => euclidean(elf, o) <= elf.sight);
  if (visible.length === 0) return;
  visible.sort((a, b) => euclidean(elf, a) - euclidean(elf, b));
  const target = visible[0];
  elf.target = target;
  if (lookOnly) return;

  moveToward(elf, target);
}

function moveToward(creature, target) {
  let remaining = creature.movement;
  let { col, row } = creature;

  while (remaining > 0 && (col !== target.col || row !== target.row)) {
    const neighbors = getNeighbors(col, row);
    neighbors.sort((a, b) => euclidean(a, target) - euclidean(b, target));

    let moved = false;
    for (const n of neighbors) {
      const hex = grid[n.col][n.row];
      const cost = hex.cost;
      if (cost <= remaining) {
        remaining -= cost;
        col = n.col;
        row = n.row;
        moved = true;
        break;
      }
    }
    if (!moved) break;
  }

  creature.col = col;
  creature.row = row;
}

function getNeighbors(col, row) {
  const even = col % 2 === 0;
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [even ? -1 : 1, -1], [even ? -1 : 1, 1]
  ];
  return directions
    .map(([dc, dr]) => ({ col: col + dc, row: row + dr }))
    .filter(p => p.col >= 0 && p.col < grid.length && p.row >= 0 && p.row < grid[p.col].length);
}
