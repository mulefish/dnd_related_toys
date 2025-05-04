class Orc {
    constructor(total_points) {
        this.name = generateOrcName();        
        // this.selfPreservation and this.goalDriven will be in conflict
        this.selfPreservation = 0;
        this.goalDriven = 50;
        this.attack = 0; // Damage done per attack: A random number up to this value 
        this.hitpoints = 0; // HP
        this.movement = 0; // Pixels movement across the board
        this.sight = 0; // Ablity to see across the board, in Pixels
        // Keep track of 'score' for genetic algo across generations
        // Will figure the cross generation stuff later - right now this is here as a note to myself
        this.breedableScore = 0; 
        this.x = 0;
        this.y = 0; 
        assignPoints(this, total_points);
    }

    displayStats() {
        console.log("Orc Stats:", this);
    }
}
const syllables = ["Gor", "Thrak", "Urg", "Zug", "Mok", "Krul", "Vrag", "Dum", "Shar", "Grish"];
const seenNames = new Map();

function generateOrcName() {
    let nameParts = [];
    let numSyllables = Math.floor(Math.random() * 4) + 1; // Picks between 1 and 4 syllables

    for (let i = 0; i < numSyllables; i++) {
        let syllable = syllables[Math.floor(Math.random() * syllables.length)];
        nameParts.push(syllable);
    }

    let name = nameParts.join("");

    // Ensure name uniqueness
    if (seenNames.has(name)) {
        seenNames.set(name, seenNames.get(name) + 1);
        name += seenNames.get(name); // Append number
    } else {
        seenNames.set(name, 1);
    }

    return name;
}

function assignPoints(orc, total_points) {
    const attributes = ["selfPreservation", "attack", "hitpoints", "movement"];
    let remainingPoints = total_points;

    // First pass: Assign each attribute between 10 and 30 points
    attributes.forEach(attribute => {
        let allocatedPoints = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
        allocatedPoints = Math.min(allocatedPoints, remainingPoints);
        orc[attribute] += allocatedPoints;
        remainingPoints -= allocatedPoints;
    });

    // Ensure sight starts greater than movement
    orc.sight = orc.movement + Math.floor(orc.movement * 0.5);
    remainingPoints -= orc.sight - orc.movement;

    // Second pass: Distribute remaining points (0 to 70) randomly
    while (remainingPoints > 0) {
        let attribute = ["selfPreservation", "attack", "hitpoints", "movement", "sight"]
            [Math.floor(Math.random() * 5)];
        let allocatedPoints = Math.floor(Math.random() * (70 - 0 + 1));

        allocatedPoints = Math.min(allocatedPoints, remainingPoints);
        orc[attribute] += allocatedPoints;
        remainingPoints -= allocatedPoints;
    }
}

// Example usage
let myOrc = new Orc(200);
myOrc.displayStats();