from typing import List
from .combatants import Orc, Elf # relative imports! I did not know about this. Duh.

class CreatureGenerator:
    def __init__(self, orc_count: int = 20, elf_count: int = 10, total_points: int = 100):
        self.orc_count = orc_count
        self.elf_count = elf_count
        self.total_points = total_points

    def generate(self) -> List:
        combatants = []

        for _ in range(self.orc_count):
            combatants.append(Orc(self.total_points))

        for _ in range(self.elf_count):
            combatants.append(Elf(self.total_points))

        return combatants

if __name__ == "__main__":
    # self test!
    orcs = 3 
    elves = 2
    total_points = 200
    generator = CreatureGenerator(orcs, elves, total_points)
    creatures = generator.generate()
    for c in creatures:
        c.display_stats()
