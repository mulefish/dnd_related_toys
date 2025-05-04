const assert = require('assert');
const { test } = require('node:test');
const { Elf, Orc, generateElfName, generateOrcName, _attributes } = require('./Combatants.js');

test('Elf and Orc names should not be empty', () => {
  const elfName = generateElfName();
  const orcName = generateOrcName();
  assert.ok(elfName.length > 0, 'Elf name should not be empty');
  assert.ok(orcName.length > 0, 'Orc name should not be empty');
  assert.notStrictEqual(elfName, orcName, 'Names should not be identical');
});

test('Elves have valid attribute ranges', () => {
  const elves = Array.from({ length: 3 }, () => new Elf(200));
  for (const elf of elves) {
    for (const attr of _attributes) {
      assert.ok(elf[attr] >= 10 && elf[attr] <= 100, `Elf ${attr} invalid: ${elf[attr]}`);
    }
    assert.ok(elf.sight >= 10 && elf.sight <= 150, `Elf sight invalid: ${elf.sight}`);
  }
});

test('Orcs have valid attribute ranges', () => {
  const orcs = Array.from({ length: 3 }, () => new Orc(200));
  for (const orc of orcs) {
    for (const attr of _attributes) {
      assert.ok(orc[attr] >= 10 && orc[attr] <= 100, `Orc ${attr} invalid: ${orc[attr]}`);
    }
    assert.ok(orc.sight >= 10 && orc.sight <= 150, `Orc sight invalid: ${orc.sight}`);
  }
});
