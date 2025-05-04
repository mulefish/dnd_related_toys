const elfSyllables = [
    "Leaf",
    "Grass",
    "Moon",
    "Ocean",
    "Sky",
    "Jupiter",
    "Dusk",
    "Eve",
    "Rain",
    "Mist",
    "Cliff",
    "Dirt",
    "ButterFly",
    "Starry",
    "Dew",
    "Warm",
    "Sun",
  ];
  const orcSyllables = [
    "Gor",
    "Thrak",
    "Urg",
    "Zug",
    "Mok",
    "Krul",
    "Vrag",
    "Dum",
    "Shar",
    "Grish",
  ];
  const seenNames = new Map();
  
  function generateOrcName() {
    const syllableCount = Math.floor(Math.random() * 4) + 1;
    const name = generateName(orcSyllables, syllableCount);
    return name;
  }
  function generateElfName() {
    const syllableCount = 1 + Math.floor(Math.random() * 2) + 1;
    const name = generateName(elfSyllables, syllableCount);
    return name;
  }

  
  
  class Creature {
    constructor(total_points) {
        this.name = ""
      // this.name = generateElfName();
      // this.selfPreservation and this.goalDriven will be in conflict
      this.selfPreservation = 0;
      this.goalDriven = 50;
      this.attack = 0; // Damage done per attack: A random number up to this value
      this.hitpoints = 0; // HP
      this.movement = 0; // Pixels movement across the board
      this.sight = 0; // Ablity to see across the board, in Pixels
      this.initiative = 0;
      this.range = 0;
      // Keep track of 'score' for genetic algo across generations
      // Will figure the cross generation stuff later - right now this is here as a note to myself
      this.range = 0; 
      this.breedableScore = 0;
      this.col = 0;
      this.row = 0;
      assignPoints(this, total_points);

      this.specialFeatures()
    }
    specialFeatures() {
        // This is here to be @Override
    }
  
    displayStats() {
      console.log("Orc Stats:", this);
    }
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

function generateName(syllables, syllableCount) {
    // In hindsight I think I've put too much effort into the names. Lol. 
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

// NOTE: '_attributes' is globally available only for the TDD elf-test - otherwise it would be inide the assignPoints func: JS doesn't have the concepyt of 'protected'
const _attributes = [
  "selfPreservation",
  "attack",
  "hitpoints",
  "movement",
  "initiative"
];
function assignPoints(orc, total_points) {
  // This is a '2 pass state machine'.
  // First pass will distributes baseline valuesto each member of the class
  // Second pass will pass the 'spice' to each member of the class.
  // Each member in the '_attributes' array to get AT LEAST 10 and NO MORE than 100.
  // Except 'sight' which will be more than 'movement' and might well be up to 150.
  const _attributes = [
    "selfPreservation",
    "attack",
    "hitpoints",
    "movement",
    "initiative",
  ];
  let remainingPoints = total_points;

  _attributes.forEach((attribute) => {
    let allocatedPoints = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
    allocatedPoints = Math.min(allocatedPoints, remainingPoints);

    orc[attribute] = Math.min(100, (orc[attribute] || 0) + allocatedPoints);
    remainingPoints -= allocatedPoints;
  });

  while (remainingPoints > 0) {
    let attribute = _attributes[Math.floor(Math.random() * _attributes.length)];
    let allocatedPoints = Math.floor(Math.random() * (70 - 0 + 1));

    allocatedPoints = Math.min(allocatedPoints, remainingPoints);

    orc[attribute] = Math.min(100, (orc[attribute] || 0) + allocatedPoints);
    remainingPoints -= allocatedPoints;
  }
  orc.sight = orc.movement + Math.floor(orc.movement * 0.5);
}
if (require.main === module) {
  // TDD self-test!
  // TODO: Move into a unit-test I suppose. Modern node has nice unit tests framework,
  // but I am both used to Jest AND I hate hate hate jest... Anyhow - I will unit-test and CICD up later
  // For now, because I do not yet have a CICD pipeline set up, this is OK
  function log( msg ) { 
    console.log("[LOG] " + msg)
  }
  function checkIt(creatures, msg) {
    // Goals:
    // - No name is duplicated
    // - All _attributes (except sight) are between 10 and 100
    // - Sight is allowed to exceed 100 up to 150
    const seenNames = new Set();
    let isOk = true;

    creatures.forEach((creature) => {
      if (seenNames.has(creature.name)) {
        log(`FAILBOT! name check dupe! "${creature.name}"`, "TDD Name Dupe test for " + msg);
        isOk = false;
      } else {
        seenNames.add(creature.name);
      }

      _attributes.forEach((attribute) => {
        if (
          attribute !== "sight" &&
          (creature[attribute] < 10 || creature[attribute] > 100)
        ) {
          log("FAILBOT attribute check: ${attribute} = ${orc[attribute]} for " + msg );
          isOk = false;
        }
      });
      if (creature.sight < 10 || creature.sight > 150) {
        log("FAILBOT sight for " + msg );
        isOk = false;
      }
    });

    if (isOk) {
      log("PASS: " + msg + " TDD says 'OK'!");
    } else {
      log("FAIL! " + msg + " Check it!");
    }
  }
  const orcs = [];
  for (let i = 0; i < 3; i++) {
    const someOrc = new Orc(200);
    orcs.push(someOrc);

  }
  checkIt(orcs,"Orc")

  const elves = [];
  for (let i = 0; i < 3; i++) {
    const someElf = new Elf(200);
    elves.push(someElf);
  }
  checkIt(elves,"Elf")

  const elfName = generateElfName()
  const orcName = generateOrcName()

  if ( elfName !== undefined && elfName.length > 0 && orcName !== undefined && orcName.length > 0 ) {
    log("PASS: name check with " + elfName + " and " + orcName );
  } else {
    log("FAIL: name check with " + elfName + " and " + orcName );
  }
}
