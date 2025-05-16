import random
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
