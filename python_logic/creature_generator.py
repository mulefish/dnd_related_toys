from typing import List, Tuple
from .combatants import Orc, Elf
from .globals import ROWS, COLS
import random

class CreatureGenerator:
    def __init__(self, orc_count: int = 20, elf_count: int = 10, total_points: int = 100):
        self.orc_count = orc_count
        self.elf_count = elf_count
        self.total_points = total_points
        self.used_positions = set()

    def get_random_position(self, col_range: Tuple[int, int], max_attempts=10) -> Tuple[int, int]:
        """Try to find a non-occupied (row, col) in the given column range."""
        for _ in range(max_attempts):
            row = random.randint(0, ROWS - 1)
            col = random.randint(col_range[0], col_range[1])
            if (row, col) not in self.used_positions:
                self.used_positions.add((row, col))
                return row, col
        # Fallback: allow a collision if necessary
        return row, col

    def generate(self) -> List:
        combatants = []

        # Define left, middle, right column ranges
        # gap_size = max(2, COLS // 6)
        third = COLS // 3
        elf_col_range = (0, third - 1)
        orc_col_range = (COLS - third, COLS - 1)

        for _ in range(self.elf_count):
            elf = Elf(self.total_points)
            elf.row, elf.col = self.get_random_position(elf_col_range)
            combatants.append(elf)

        for _ in range(self.orc_count):
            orc = Orc(self.total_points)
            orc.row, orc.col = self.get_random_position(orc_col_range)
            combatants.append(orc)

        combatants.sort(key=lambda c: c.initiative, reverse=True)

        return combatants


if __name__ == "__main__":
    generator = CreatureGenerator(3, 2, 200)
    creatures = generator.generate()
    for c in creatures:
        c.display_stats()
