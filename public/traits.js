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
        this.initiative = 0;
        // Keep track of 'score' for genetic algo across generations
        // Will figure the cross generation stuff later - right now this is here as a note to myself
        this.breedableScore = 0; 
        this.col = 0;
        this.row = 0; 
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
// NOTE: '_attributes' is globally available only for the TDD elf-test - otherwise it would be inide the assignPoints func: JS doesn't have the concepyt of 'protected'
const _attributes = ["selfPreservation", "attack", "hitpoints", "movement", "initiative"];
function assignPoints(orc, total_points) {
    // This is a '2 pass state machine'. First will distributes baseline valuesto each member of the class
    // And the second pass will pass the 'spice' to each member of the class. 
    // Each member in the '_attributes' array to get AT LEAST 10 and NO MORE than 100. 
    // Except 'sight' which will be more than 'movement' and might well be up to 150. 
    const _attributes = ["selfPreservation", "attack", "hitpoints", "movement", "initiative"];
    let remainingPoints = total_points;

    _attributes.forEach(attribute => {
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
    const orcs = [];
    for (let i = 0; i < 100; i++) {
        const someOrc = new Orc(200);
        orcs.push(someOrc);
    }

    // Goals:
    // - No name is duplicated
    // - All _attributes (except sight) are between 10 and 100
    // - Sight is allowed to exceed 100 up to 150

    const seenNames = new Set();
    let isOk = true;

    orcs.forEach((orc) => {
        if (seenNames.has(orc.name)) {
            console.log(`FAILBOT! name check dupe! "${orc.name}"`);
            isOk = false;
        } else {
            seenNames.add(orc.name);
        }

        _attributes.forEach((attribute) => {
            if (attribute !== "sight" && (orc[attribute] < 10 || orc[attribute] > 100)) {
                console.log(`FAILBOT attribute check: ${attribute} = ${orc[attribute]} (should be between 10 and 100)`);
                isOk = false;
            }
        });
        if ( orc.sight < 10 || orc.sight > 150 ) {
            console.log(`FAILBOT sight ought be to movement + movement * 0.5 and more than 10 and less than 151`);
            isOk = false;
        }
   });

    if (isOk) {
        console.log("PASS: TDD says 'OK'!");
    } else {
        console.log("FAIL! Check it!");
    }
}