// display.js
import {
    buildGrid,
    drawGrid,
    drawTrails,
    randomNeighbor,
    grid,
    Elf,
    Orc, 
    searchForEnemy
  } from './logic.js';
  
  const canvas = document.getElementById("hexCanvas");
  const ctx = canvas.getContext("2d");
  
  let debug = false;
  export let elves = [];
  export let orcs = [];
  window.elves = elves; 
  
  
  window.toggleDebug = function () {
    debug = !debug;
    document.getElementById("isDebug").innerText = debug ? "O" : "X";
    drawEverything();
  };
  
  function drawEverything() {
    drawGrid(ctx, debug);
    drawTrails(ctx, orcs, elves);
  
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
  
    orcs.forEach((orc, index) => {
      const { x, y } = grid[orc.col][orc.row];
      ctx.fillStyle = "blue";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.fillText(orc.name, x, y - 10);
      // if (index === 0) {
      //   document.getElementById("bluePos").value = `(${orc.col}, ${orc.row})`;
      // }
    });
  
    elves.forEach((elf, index) => {
      const { x, y } = grid[elf.col][elf.row];
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.fillText(elf.name, x, y - 10);
    });
  }
  window.elfLooks = function () { 
    elves.forEach((elf) => {
      searchForEnemy(elf)
    }); 
  }; 

  window.orcLooks = function () { 
    orcs.forEach((orc)=>{ 
      searchForEnemy(orc) 
    })
  }; 
  
  window.elfMoves = function () {
    elves.forEach((elf) => {
      elf.prevCol = elf.col;
      elf.prevRow = elf.row;
      [elf.col, elf.row] = randomNeighbor(elf.col, elf.row);
    });
    drawEverything();
  };
  
  window.orcMoves = function () {
    orcs.forEach((orc) => {
      orc.prevCol = orc.col;
      orc.prevRow = orc.row;
      [orc.col, orc.row] = randomNeighbor(orc.col, orc.row);
    });
    drawEverything();
  };
  
  // INITIALIZE
  buildGrid(canvas);
  
  for (let i = 0; i < 20; i++) {
    const orc = new Orc(200);
    orc.col = 25 + Math.floor(Math.random() * 10);
    orc.row = 1 + Math.floor(Math.random() * 15);
    orcs.push(orc);
  }
  
  for (let i = 0; i < 10; i++) {
    const elf = new Elf(200);
    elf.col = 1 + Math.floor(Math.random() * 10);
    elf.row = 1 + Math.floor(Math.random() * 15);
    elves.push(elf);
  }
  
  drawEverything();
  