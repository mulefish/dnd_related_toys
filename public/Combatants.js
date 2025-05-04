// creature.js

const elfSyllables = [
    "Leaf", "Grass", "Moon", "Ocean", "Sky", "Jupiter", "Dusk",
    "Eve", "Rain", "Mist", "Cliff", "Dirt", "ButterFly",
    "Starry", "Dew", "Warm", "Sun",
  ];
  
  const orcSyllables = [
    "Gor", "Thrak", "Urg", "Zug", "Mok", "Krul", "Vrag",
    "Dum", "Shar", "Grish",
  ];
  
  const seenNames = new Map();
  
  function generateOrcName() {
    const syllableCount = Math.floor(Math.random() * 4) + 1;
    return generateName(orcSyllables, syllableCount);
  }
  
  function generateElfName() {
    const syllableCount = 1 + Math.floor(Math.random() * 2) + 1;
    return generateName(elfSyllables, syllableCount);
  }
  
  function generateName(syllables, syllableCount) {
    const nameParts = [];
    for (let i = 0; i < syllableCount; i++) {
      const syllable = syllables[Math.floor(Math.random() * syllables.length)];
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
  
  const _attributes = [
    "selfPreservation", "attack", "hitpoints", "movement", "initiative"
  ];
  
  function assignPoints(creature, total_points) {
    let remainingPoints = total_points;
    _attributes.forEach((attr) => {
      let points = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
      points = Math.min(points, remainingPoints);
      creature[attr] = Math.min(100, (creature[attr] || 0) + points);
      remainingPoints -= points;
    });
    while (remainingPoints > 0) {
      const attr = _attributes[Math.floor(Math.random() * _attributes.length)];
      let points = Math.floor(Math.random() * 71);
      points = Math.min(points, remainingPoints);
      creature[attr] = Math.min(100, (creature[attr] || 0) + points);
      remainingPoints -= points;
    }
    creature.sight = creature.movement + Math.floor(creature.movement * 0.5);
  }
  
  class Creature {
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
  
  class Elf extends Creature {
    specialFeatures() {
      this.name = generateElfName();
      this.range = this.movement + Math.floor(this.movement * 0.25);
    }
  }
  
  class Orc extends Creature {
    specialFeatures() {
      this.name = generateOrcName();
    }
  }
  
  module.exports = { Elf, Orc, generateElfName, generateOrcName, _attributes };
  