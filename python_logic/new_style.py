import math
import random
from collections import defaultdict
from globals import viewport_width,viewport_height,goal_x,goal_y,hex_size, elf_goal,orc_goal,rows,cols

# # Dear future: 
# # angle 180 is pointing to the left. 
# # angle 90 is up
# # angle 0 is right
# viewport_width = 1000
# viewport_height = 500
# goal_x = viewport_width // 2
# goal_y = viewport_height // 2
# hex_size = 1000 // 50
# elf_goal = "reach center and occupy as long as possible"
# orc_goal = "kill elves"
# rows = viewport_height // hex_size
# cols = viewport_width // hex_size
seen_names = defaultdict(int)

elf_syllables = [
    "Leaf", "Grass", "Moon", "Ocean", "Sky", "Jupiter", "Dusk",
    "Eve", "Rain", "Mist", "Cliff", "Dirt", "ButterFly", "Starry", "Dew", "Warm", "Sun"
]

orc_syllables = [
    "Gor", "Thrak", "Urg", "Zug", "Mok", "Krul", "Vrag", "Dum", "Shar", "Grish"
]


def generate_name(syllables, syllable_count):
    name_parts = [random.choice(syllables) for _ in range(syllable_count)]
    name = ''.join(name_parts)
    seen_names[name] += 1
    if seen_names[name] > 1:
        name += str(seen_names[name])
    return name




class Creature:
    def __init__(self):
        self.name = "tbd"
        self.str = 0
        self.int = 0
        self.wis = 0
        self.dex = 0
        self.con = 0
        self.movement = 5 # 5 hexes
        self.sight = 100 # 100 hexes
        self.range = 1 # 1 hex
        self.hitpoints = 0
        self.damage = 0
        self.angle = 180
        self.attack = 0
        self.initiative = 0 
        self.x = 0
        self.y = 0
        self.special_features() # last call
    def set_target(self, target_name):
        self.target = target_name

    def special_features(self):
        pass
    def display_stats(self, stat_name: str = None):
        if stat_name is None:
            print("Stats:", vars(self))
        else:
            try:
                value = getattr(self, stat_name)
                print(f"{stat_name}: {value}")
            except AttributeError:
                print(f"Failbot! '{stat_name}'")


def roll_dice(num_of_dice):
    sides = 6
    sum = 0
    for i in range(num_of_dice):
        sum += random.randint(1, sides)
    return sum

class Elf(Creature):
    def special_features(self):
        self.name = generate_name(elf_syllables, random.randint(2, 3))
        self.race = "ELF"
        self.str = 8
        self.int = 16
        self.wis = 10
        self.dex = 12
        self.con = 8
        self.movement = 3 * hex_size
        self.range = 3 * hex_size
        self.angle = 0 # go to the right
        self.hitpoints = 20 + (self.con - 10 ) // 2
        self.attack = 2 + (self.str - 10 ) // 2
        self.initiative = roll_dice(3) + (self.dex - 10 ) # 2
        self.y = random.randint(10, viewport_height - 10) # pixel 
        one_third = viewport_width // 3
        self.x = random.randint(10, (one_third - 10) ) # pixel 

class Orc(Creature):
    def special_features(self):
        self.name = generate_name(orc_syllables, random.randint(1, 4))
        self.race = "ORC"
        self.str = 16
        self.int = 10
        self.wis = 10
        self.dex = 10
        self.con = 14
        self.movement = 6 * hex_size
        self.range = 1 * hex_size
        self.angle = 180 # go to the left
        self.hitpoints = 20 + (self.con - 10 ) // 2
        self.attack = 2 + (self.str - 10 ) // 2
        self.initiative = roll_dice(3) + (self.dex - 10 ) // 2
        self.y = random.randint(10, viewport_height - 10) # pixel 
        one_third = viewport_width // 3
        self.x = random.randint(10, (one_third - 10) ) # pixel 


elves = {}
orcs = {}
for i in range(3):
    orc = Orc()
    orcs[i] = orc

for i in range(1):
    elf = Elf()
    elves[i] = elf


def find_new_point(x, y, angle, distance):
    result = {}
    radians = math.radians(angle)  # Convert degrees to radians

    result['x'] = round(math.cos(radians) * distance + x)
    result['y'] = round(math.sin(radians) * distance + y)

    return result


# (keep your constants and classes up through find_new_point)

def move(creature):
    global elves, orcs

    def euclid(a, b):
        return math.hypot(a.x - b.x, a.y - b.y)

    if creature.race == "ORC":
        # 1. Find closest elf
        living_elves = [e for e in elves.values() if e.hitpoints > 0]
        if not living_elves:
            return  # nothing to do
        target = min(living_elves, key=lambda e: euclid(creature, e))

        # 2. Compute angle to it
        dx, dy = target.x - creature.x, target.y - creature.y
        angle = math.degrees(math.atan2(dy, dx))
        creature.angle = angle

        # 3. Move towards it
        new_pt = find_new_point(creature.x, creature.y, angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']

        # 4. If within range, attack
        distance = euclid(creature, target)
        if distance <= creature.range:
            dmg = roll_dice(creature.attack)
            target.hitpoints -= dmg
            print(f"{creature.race} at ({creature.x},{creature.y}) hits ELF for {dmg} dmg → HP now {target.hitpoints} {target.name}")

    elif creature.race == "ELF":
        # 1. Find closest orc
        living_orcs = [o for o in orcs.values() if o.hitpoints > 0]
        if not living_orcs:
            return
        nearest = min(living_orcs, key=lambda o: euclid(creature, o))

        # 2. Build a flee+approach vector
        #    approach center:
        to_goal = (goal_x - creature.x, goal_y - creature.y)
        #    flee orc:
        away_orc = (creature.x - nearest.x, creature.y - nearest.y)
        # combine (you can tweak weights)
        dx = to_goal[0] + away_orc[0]
        dy = to_goal[1] + away_orc[1]
        angle = math.degrees(math.atan2(dy, dx))
        creature.angle = angle

        # 3. Move
        new_pt = find_new_point(creature.x, creature.y, angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']

        # 4. If any orc within range, attack
        dist = euclid(creature, nearest)
        if dist <= creature.range:
            dmg = roll_dice(creature.attack)
            nearest.hitpoints -= dmg
            print(f"{creature.race} at ({creature.x},{creature.y}) strikes ORC for {dmg} dmg → HP now {nearest.hitpoints} {orc.name}")

    else:
        print(f"Failbot! Unknown race {creature.race}")


if __name__ == '__main__':
    all_creatures = list(elves.values()) + list(orcs.values())
    sorted_by_initiative = sorted(all_creatures, key=lambda c: c.initiative, reverse=True)

    print("BEFORE")
    for i in elves:
        elf = elves[i]
        print(f"{i}  {elf.race} damage={elf.damage}   x={elf.x}   y={elf.y}  hp={elf.hitpoints} {elf.name}")

    print("---")
    for i in orcs:
        orc = orcs[i]
        print(f"{i}    {orc.race} damage={orc.damage}   x={orc.x}   y={orc.y}  hp={orc.hitpoints} {orc.name}")



    for loop in range(3):
        for i in range(len(sorted_by_initiative)):
            creature = sorted_by_initiative[i]
            move(creature)

    print("AFTER")

    for i in elves:
        elf = elves[i]
        print(f"{i}    {elf.race} damage={elf.damage}   x={elf.x}   y={elf.y}  hp={elf.hitpoints} {elf.name}")

    print("---")

    for i in orcs:
        orc = orcs[i]
        print(f"{i}    {orc.race} damage={orc.damage}   x={orc.x}   y={orc.y}  hp={orc.hitpoints} {orc.name}")



    print(f"rows={rows} cols={cols}")