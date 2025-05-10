import random
from collections import defaultdict
from .globals import ELF_FLAG, ORC_FLAG, NULL  # relative imports! I did not know about this. Duh.

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


def generate_elf_name():
    return generate_name(elf_syllables, random.randint(2, 3))


def generate_orc_name():
    return generate_name(orc_syllables, random.randint(1, 4))


def assign_points(creature, total_points):
    attributes = ["self_preservation", "attack", "hitpoints", "movement", "initiative"]
    remaining_points = total_points

    for attr in attributes:
        allocated = random.randint(10, 30)
        allocated = min(allocated, remaining_points)
        current = getattr(creature, attr)
        setattr(creature, attr, min(100, current + allocated))
        remaining_points -= allocated

    while remaining_points > 0:
        attr = random.choice(attributes)
        bonus = min(remaining_points, random.randint(0, 70))
        current = getattr(creature, attr)
        setattr(creature, attr, min(100, current + bonus))
        remaining_points -= bonus

    creature.sight = creature.movement + int(creature.movement * 0.5)


class Creature:
    def __init__(self, total_points):
        self.name = NULL
        self.self_preservation = 0
        self.goal_driven = 50
        self.attack = 0
        self.hitpoints = 0
        self.damage = 0
        self.movement = 0
        self.sight = 0
        self.initiative = 0
        self.range = 0
        self.breedable_score = 0
        self.col = 0
        self.row = 0
        self.species = NULL
        self.target = NULL
        self.angle = 0

        assign_points(self, total_points)
        self.special_features()

    def set_target(self, target_name):
        self.target = target_name

    def special_features(self):
        pass  # To be overridden by subclasses

    def display_stats(self):
        print("Stats:", vars(self))


class Elf(Creature):
    def special_features(self):
        self.name = generate_elf_name()
        self.range = self.movement + int(self.movement * 0.25)
        self.species = ELF_FLAG


class Orc(Creature):
    def special_features(self):
        self.name = generate_orc_name()
        self.species = ORC_FLAG
