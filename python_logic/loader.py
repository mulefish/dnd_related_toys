from python_logic.creatures import Elf, Orc

def load_creatures(num_elves=1, num_orcs=3):
    elves = {i: Elf() for i in range(num_elves)}
    orcs = {i: Orc() for i in range(num_orcs)}
    return elves, orcs
