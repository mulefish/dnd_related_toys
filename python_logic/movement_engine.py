import random
from .globals import ROWS, COLS

def move_creature_randomly(creatures, grid, active_index):


    if not (0 <= active_index < len(creatures)):
        print(f"IFF index={active_index} and {len(creatures)}")
        return creatures  # invalid index, do nothing
    else:
        print(f"--- index={active_index} and {len(creatures)}")

    creature = creatures[active_index]

    row, col = creature['row'], creature['col']
    movement = creature.get('movement', 0)

    # Directions: N, S, E, W, NE, NW, SE, SW
    directions = [
        (-1, 0), (+1, 0), (0, -1), (0, +1),
        (-1, +1), (-1, -1), (+1, +1), (+1, -1)
    ]

    random.shuffle(directions)  # try directions in random order

    for dr, dc in directions:
        new_row = row + dr
        new_col = col + dc
        if 0 <= new_row < ROWS and 0 <= new_col < COLS:
            tile_cost = grid[new_row][new_col]['cost']
            tile_cost = max(tile_cost, 10)  # ensure minimum move cost is 10

            if movement >= tile_cost:
                creature['row'] = new_row
                creature['col'] = new_col
                creature['movement'] -= tile_cost
                break  # move successful

    return creatures
