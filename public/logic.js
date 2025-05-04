const canvas = document.getElementById("hexCanvas");
canvas.width = window.innerWidth - 500;
canvas.height = 400;

const ctx = canvas.getContext("2d");
const blueInput = document.getElementById("bluePos");
const orangeInput = document.getElementById("orangePos");

const hexRadius = 10;
const hexHeight = Math.sqrt(3) * hexRadius;
const hexWidth = 2 * hexRadius;
const vertDist = hexHeight;
const horizDist = (3 / 4) * hexWidth;

const grid = [];

const hardTerrianColor = "#e0e0e0";
const easyTerrianColor = "#ffffff";

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
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const { x, y, isDifficultTerrian } = grid[col][row];
            let color = isDifficultTerrian ? hardTerrianColor : easyTerrianColor;
            drawHex(x, y, hexRadius, color);
        }
    }
}

function getNeighbors(col, row) {
    const directions = [
        [+1, 0], [-1, 0], [0, +1], [0, -1],
        [col % 2 === 0 ? -1 : +1, -1],
        [col % 2 === 0 ? -1 : +1, +1],
    ];
    return directions
        .map(([dc, dr]) => [col + dc, row + dr])
        .filter(([c, r]) => c >= 0 && c < grid.length && r >= 0 && r < grid[c].length);
}

function randomNeighbor(col, row) {
    const neighbors = getNeighbors(col, row);
    return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function drawShapes() {
    drawGrid();

    orcs.forEach((orc, index) => {
        const { x, y } = grid[orc.col][orc.row];
        ctx.beginPath();
        ctx.arc(x, y, hexRadius, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();
        if (blueInput && index === 0) {
            blueInput.value = `(${orc.col}, ${orc.row})`;
        }
    });

    const { x: x2, y: y2 } = grid[shape2.col][shape2.row];
    ctx.fillStyle = "orange";
    const size = hexRadius * 1.5;
    ctx.fillRect(x2 - size / 2, y2 - size / 2, size, size);

    if (orangeInput) {
        orangeInput.value = `(${shape2.col}, ${shape2.row})`;
    }
}

function blueMove() {
    orcs.forEach(orc => {
        [orc.col, orc.row] = randomNeighbor(orc.col, orc.row);
    });
    drawShapes();
}

function orangeMove() {
    [shape2.col, shape2.row] = randomNeighbor(shape2.col, shape2.row);
    drawShapes();
}

buildGrid();

// Create three orcs
const orcs = [];
for (let i = 0; i < 3; i++) {
    const orc = new Orc(200);
    orc.col = Math.floor(Math.random() * (grid.length - 4)) + 2;
    orc.row = Math.floor(Math.random() * (grid[0].length - 4)) + 2;
    orcs.push(orc);
}

const shape2 = {
    col: Math.floor(Math.random() * (grid.length - 4)) + 2,
    row: Math.floor(Math.random() * (grid[0].length - 4)) + 2,
};

drawShapes();
