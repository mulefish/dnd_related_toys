// node --test .\unit-tests.js

import assert from "node:assert/strict";
import test from "node:test";
import { Elf, Orc, generateElfName, generateOrcName } from "./Combatants.js";
import { buildGrid, getNeighbors, grid, Hexagon } from "./logic.js";
import { dice } from "./globals.js";

////////////////// - Combatants.js - ///////////////////////////////////////
const _attributes = [
  "selfPreservation",
  "attack",
  "hitpoints",
  "movement",
  "initiative",
];

test("Elf and Orc names should not be empty", () => {
  const elfName = generateElfName();
  const orcName = generateOrcName();
  assert.ok(elfName.length > 0, "Elf name should not be empty");
  assert.ok(orcName.length > 0, "Orc name should not be empty");
  assert.notStrictEqual(elfName, orcName, "Names should not be identical");
});

test("Elves have valid attribute ranges", () => {
  const elves = Array.from({ length: 3 }, () => new Elf(200));
  for (const elf of elves) {
    for (const attr of _attributes) {
      assert.ok(
        elf[attr] >= 10 && elf[attr] <= 100,
        `Elf ${attr} invalid: ${elf[attr]}`
      );
    }
    assert.ok(
      elf.sight >= 10 && elf.sight <= 150,
      `Elf sight invalid: ${elf.sight}`
    );
  }
});

test("Orcs have valid attribute ranges", () => {
  const orcs = Array.from({ length: 3 }, () => new Orc(200));
  for (const orc of orcs) {
    for (const attr of _attributes) {
      assert.ok(
        orc[attr] >= 10 && orc[attr] <= 100,
        `Orc ${attr} invalid: ${orc[attr]}`
      );
    }
    assert.ok(
      orc.sight >= 10 && orc.sight <= 150,
      `Orc sight invalid: ${orc.sight}`
    );
  }
});

////////////////// - logic.js - ///////////////////////////////////////
test("Grid is built with Hexagon instances", () => {
  // Create a mock canvas for logic.js to use
  const dummyCanvas = {
    width: 800,
    height: 600,
    style: {},
    getContext: () => ({ setTransform: () => {} }),
  };
  global.window = { devicePixelRatio: 1, innerWidth: 800 }; // Needed for buildGrid
  buildGrid(dummyCanvas);

  assert.ok(grid.length > 0, "Grid should have columns");
  assert.ok(grid[0].length > 0, "Grid should have rows");
  assert.ok(
    grid[0][0] instanceof Hexagon,
    "Each cell should be a Hexagon instance"
  );
});

test("getNeighbors returns valid neighbors", () => {
  const col = 2,
    row = 2;
  const neighbors = getNeighbors(col, row);

  assert.ok(neighbors.length > 0, "Should return some neighbors");
  for (const [c, r] of neighbors) {
    assert.ok(
      grid[c] && grid[c][r],
      `Neighbor at (${c},${r}) should exist in grid`
    );
  }
});

////////////////// - globals.js - ///////////////////////////////////////

test("make sure the dice works", () => {
  const veryLowResult = dice(-1); // should be false!
  const veryHighResult = dice(101); // should be true!

  let t = 0;
  let f = 0;
  const trials = 1000;

  for (let i = 0; i < trials; i++) {
    const x = dice(50);
    if (x === true) t++;
    else f++;
  }
  // This will yield incorrect answer about 0.2 percent of the time ( 3 or 4 standard deviations away from 50/50)
  const percentTrue = t / trials;
  const isBalanced = percentTrue >= 0.45 && percentTrue <= 0.55;

  const isOk = veryLowResult === false && veryHighResult === true && isBalanced;
  assert.ok(isOk);
});
