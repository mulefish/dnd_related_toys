import random
from python_logic.globals import viewport_width, viewport_height, hex_size
from collections import defaultdict

seen_names = defaultdict(int)

elf_syllables = ["Leaf", "Grass", "Moon", "Sky", "Rain", "Dew"]
orc_syllables = ["Gor", "Thrak", "Urg", "Mok", "Zug"]

def generate_name(syllables, count):
    name_parts = [random.choice(syllables) for _ in range(count)]
    name = ''.join(name_parts)
    seen_names[name] += 1
    if seen_names[name] > 1:
        name += str(seen_names[name])
    return name



def roll_dice(num):
    return sum(random.randint(1, 6) for _ in range(num))

class Creature:
    def __init__(self):
        self.name = "tbd"
        self.str = 0
        self.int = 0
        self.wis = 0
        self.dex = 0
        self.con = 0
        self.movement = 5
        self.sight = 100
        self.range = 1
        self.hitpoints = 0
        self.damage = 0
        self.angle = 180
        self.attack = 0
        self.initiative = 0
        self.x = 0
        self.y = 0
        self.special_features()

class Elf(Creature):
    def special_features(self):
        self.name = generate_name(elf_syllables, random.randint(2, 3))
        self.race = "ELF"
        self.str = 8
        self.int = 16
        self.dex = 12
        self.con = 8
        self.angle = 0
        self.movement = 3 * hex_size
        self.range = 3 * hex_size
        self.hitpoints = 20 + (self.con - 10) // 2
        self.attack = 2 + (self.str - 10) // 2
        self.initiative = roll_dice(3) + (self.dex - 10)
        self.y = random.randint(10, viewport_height - 10)
        self.x = random.randint(10, viewport_width // 3 - 10)

class Orc(Creature):
    def special_features(self):
        self.name = generate_name(orc_syllables, random.randint(1, 3))
        self.race = "ORC"
        self.str = 16
        self.int = 10
        self.dex = 10
        self.con = 14
        self.angle = 180
        self.movement = 6 * hex_size
        self.range = 1 * hex_size
        self.hitpoints = 20 + (self.con - 10) // 2
        self.attack = 2 + (self.str - 10) // 2
        self.initiative = roll_dice(3) + (self.dex - 10) // 2
        self.y = random.randint(10, viewport_height - 10)
        self.x = random.randint(viewport_width * 2 // 3, viewport_width - 10)

def load_creatures(num_elves=1, num_orcs=3):
    elves = {i: Elf() for i in range(num_elves)}
    orcs = {i: Orc() for i in range(num_orcs)}
    return elves, orcs
