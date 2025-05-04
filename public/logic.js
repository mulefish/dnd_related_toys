  const canvas = document.getElementById("hexCanvas");
  const ctx = canvas.getContext("2d");
  const blueInput = document.getElementById("bluePos");
  const orangeInput = document.getElementById("orangePos");

  const hexRadius = 30;
  const hexHeight = Math.sqrt(3) * hexRadius;
  const hexWidth = 2 * hexRadius;
  const vertDist = hexHeight;
  const horizDist = (3 / 4) * hexWidth;

  const grid = [];

  function drawHex(x, y, radius, col, row) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x_i = x + radius * Math.cos(angle);
      const y_i = y + radius * Math.sin(angle);
      ctx.lineTo(x_i, y_i);
    }
    ctx.closePath();
    ctx.strokeStyle = "#ccc";
    ctx.stroke();

    // Draw label
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#555";
    ctx.textAlign = "center";
    ctx.fillText(`(${col},${row})`, x, y + 3);
  }

  function buildGrid() {
    const rows = Math.floor(canvas.height / vertDist) + 2;
    const cols = Math.floor(canvas.width / horizDist) + 2;

    for (let col = 0; col < cols; col++) {
      grid[col] = [];
      for (let row = 0; row < rows; row++) {
        const x = col * horizDist;
        const y = row * vertDist + (col % 2) * (vertDist / 2);
        grid[col][row] = { x, y };
      }
    }
  }

  function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let col = 0; col < grid.length; col++) {
      for (let row = 0; row < grid[col].length; row++) {
        const { x, y } = grid[col][row];
        drawHex(x, y, hexRadius, col, row);
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
      .filter(
        ([c, r]) =>
          c >= 0 && c < grid.length && r >= 0 && r < grid[c].length
      );
  }

  function randomNeighbor(col, row) {
    const neighbors = getNeighbors(col, row);
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  function drawShapes() {
    drawGrid();

    const { x: x1, y: y1 } = grid[shape1.col][shape1.row];
    ctx.beginPath();
    ctx.arc(x1, y1, hexRadius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();

    const { x: x2, y: y2 } = grid[shape2.col][shape2.row];
    ctx.fillStyle = "orange";
    const size = hexRadius / 1.5;
    ctx.fillRect(x2 - size / 2, y2 - size / 2, size, size);

    blueInput.value = `(${shape1.col}, ${shape1.row})`;
    orangeInput.value = `(${shape2.col}, ${shape2.row})`;
  }

  function blueMove() {
    [shape1.col, shape1.row] = randomNeighbor(shape1.col, shape1.row);
    drawShapes();
  }
  
  function orangeMove() {
    [shape2.col, shape2.row] = randomNeighbor(shape2.col, shape2.row);
    drawShapes();
  }
  buildGrid();

  const shape1 = {
    col: Math.floor(Math.random() * grid.length),
    row: Math.floor(Math.random() * grid[0].length),
  };
  const shape2 = {
    col: Math.floor(Math.random() * grid.length),
    row: Math.floor(Math.random() * grid[0].length),
  };

  drawShapes();
