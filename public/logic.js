const canvas = document.getElementById("hexCanvas");
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

const blueInput = document.getElementById("bluePos");
const orangeInput = document.getElementById("orangePos");

const hexRadius = cssWidth / (40 * 1.5); // 50 hexes per row! Yes, the viewport will show only a fraction
const hexHeight = Math.sqrt(3) * hexRadius;
const hexWidth = 2 * hexRadius;
const vertDist = hexHeight;
const horizDist = (3 / 4) * hexWidth;

const grid = [];

const hardTerrianColor = "#e0e0e0";
const easyTerrianColor = "#ffffff";
const orcTrailColor = "#a0c4ff";
const elfTrailColor = "#ffd6a5";

function drawHex(x, y, radius, color) {
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

function buildGrid() {
  const rows = Math.floor(canvas.height / vertDist) + 2;
  const cols = Math.floor(canvas.width / horizDist) + 2;

  for (let col = 0; col < cols; col++) {
    grid[col] = [];
    for (let row = 0; row < rows; row++) {
      const x = col * horizDist;
      const y = row * vertDist + (col % 2) * (vertDist / 2);
      let isDifficultTerrian = Math.random() < 0.05;
      grid[col][row] = { x, y, isDifficultTerrian };
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

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "8px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const { x, y, isDifficultTerrian } = grid[col][row];
      let color = isDifficultTerrian ? hardTerrianColor : easyTerrianColor;
      drawHex(x, y, hexRadius, color);
      if ( debug ) {
        ctx.fillStyle = "#555";
        ctx.fillText(`(${col},${row})`, x, y);
      }
    }
  }
}

function drawTrails() {
  orcs.forEach((orc) => {
    if (orc.prevCol !== undefined && orc.prevRow !== undefined) {
      const { x, y } = grid[orc.prevCol][orc.prevRow];
      drawHex(x, y, hexRadius, orcTrailColor);
    }
  });
  elves.forEach((elf) => {
    if (elf.prevCol !== undefined && elf.prevRow !== undefined) {
      const { x, y } = grid[elf.prevCol][elf.prevRow];
      drawHex(x, y, hexRadius, elfTrailColor);
    }
  });
}

function getNeighbors(col, row) {
  const directions = [
    [+1, 0], [-1, 0], [0, +1], [0, -1],
    [col % 2 === 0 ? -1 : +1, -1],
    [col % 2 === 0 ? -1 : +1, +1],
  ];
  return directions.map(([dc, dr]) => [col + dc, row + dr])
    .filter(([c, r]) => c >= 0 && c < grid.length && r >= 0 && r < grid[c].length);
}

function randomNeighbor(col, row) {
  const neighbors = getNeighbors(col, row);
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function drawShapes() {
  drawGrid();
  drawTrails();
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  orcs.forEach((orc, index) => {
    const { x, y } = grid[orc.col][orc.row];
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, hexRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(orc.name, x, y - hexRadius - 2);
    if (blueInput && index === 0) {
      blueInput.value = `(${orc.col}, ${orc.row})`;
    }
  });
  elves.forEach((elf, index) => {
    const { x, y } = grid[elf.col][elf.row];
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(x, y, hexRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.fillText(elf.name, x, y - hexRadius - 2);
    if (orangeInput && index === 0) {
      orangeInput.value = `(${elf.col}, ${elf.row})`;
    }
  });
}

function orcMoves() {
  orcs.forEach((orc) => {
    orc.prevCol = orc.col;
    orc.prevRow = orc.row;
    [orc.col, orc.row] = randomNeighbor(orc.col, orc.row);
  });
  drawShapes();
}

function elfMoves() {
  elves.forEach((elf) => {
    elf.prevCol = elf.col;
    elf.prevRow = elf.row;
    [elf.col, elf.row] = randomNeighbor(elf.col, elf.row);
  });
  drawShapes();
}

buildGrid();

const orcs = [];
for (let i = 0; i < 3; i++) {
  const orc = new Orc(200);
    // DUmb hack to make sure every orc is visible on the viewport - needed because my math with the window.devicePixelRatio vs. actual pixel width is weak
  // See hexRadius in the above because that will impact this. 
  orc.col = Math.floor(Math.random() * 10) + 20;
  orc.row = Math.floor(Math.random() * 10) + 1;
  orcs.push(orc);

}

const elves = [];
for (let i = 0; i < 3; i++) {
  const elf = new Elf(200);
  // DUmb hack to make sure every elf is visible on the viewport - needed because my math with the window.devicePixelRatio vs. actual pixel width is weak
  // See hexRadius in the above because that will impact this. 
  
  elf.col = Math.floor(Math.random() * 10) + 1;
  elf.row = Math.floor(Math.random() * 15) + 1;
  elves.push(elf);
}

drawShapes();
