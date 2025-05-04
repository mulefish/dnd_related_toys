// Combatants.js
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

  specialFeatures() {
    // meant to be overridden
  }

  displayStats() {
    console.log("Stats:", this);
  }
}

export class Elf extends Creature {
  specialFeatures() {
    this.name = generateElfName();
    this.range = this.movement + Math.floor(this.movement * 0.25);
  }
}

export class Orc extends Creature {
  specialFeatures() {
    this.name = generateOrcName();
  }
}

const elfSyllables = [
  "Leaf", "Grass", "Moon", "Ocean", "Sky", "Jupiter", "Dusk",
  "Eve", "Rain", "Mist", "Cliff", "Dirt", "ButterFly", "Starry", "Dew", "Warm", "Sun"
];
const orcSyllables = [
  "Gor", "Thrak", "Urg", "Zug", "Mok", "Krul", "Vrag", "Dum", "Shar", "Grish"
];
const seenNames = new Map();

function generateName(syllables, syllableCount) {
  let nameParts = [];
  for (let i = 0; i < syllableCount; i++) {
    let syllable = syllables[Math.floor(Math.random() * syllables.length)];
    nameParts.push(syllable);
  }
  let name = nameParts.join("");
  if (seenNames.has(name)) {
    seenNames.set(name, seenNames.get(name) + 1);
    name += seenNames.get(name);
  } else {
    seenNames.set(name, 1);
  }
  return name;
}

function generateOrcName() {
  return generateName(orcSyllables, Math.floor(Math.random() * 4) + 1);
}

function generateElfName() {
  return generateName(elfSyllables, 1 + Math.floor(Math.random() * 2) + 1);
}

function assignPoints(creature, total_points) {
  const attributes = ["selfPreservation", "attack", "hitpoints", "movement", "initiative"];
  let remainingPoints = total_points;
  attributes.forEach((attribute) => {
    let allocated = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
    allocated = Math.min(allocated, remainingPoints);
    creature[attribute] = Math.min(100, (creature[attribute] || 0) + allocated);
    remainingPoints -= allocated;
  });
  while (remainingPoints > 0) {
    let attr = attributes[Math.floor(Math.random() * attributes.length)];
    let bonus = Math.floor(Math.random() * 71);
    bonus = Math.min(bonus, remainingPoints);
    creature[attr] = Math.min(100, (creature[attr] || 0) + bonus);
    remainingPoints -= bonus;
  }
  creature.sight = creature.movement + Math.floor(creature.movement * 0.5);
}

export { generateElfName, generateOrcName, assignPoints };
