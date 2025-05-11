import math
import random
from python_logic.globals import ROWS, COLS  # Import shared dimensions

def generate_hex_grid(base_prob=0.05, neighbor_boost=0.3):
    low = 5
    high = 15
    hexRows, hexCols = ROWS, COLS
    grid = [[{'row': r, 'col': c, 'cost': low, 'isDifficult': False} for c in range(hexCols)] for r in range(hexRows)]

    def get_neighbors(r, c):
        directions_even = [(-1, 0), (-1, +1), (0, -1), (0, +1), (+1, 0), (+1, +1)]
        directions_odd  = [(-1, -1), (-1, 0), (0, -1), (0, +1), (+1, -1), (+1, 0)]
        directions = directions_even if r % 2 == 0 else directions_odd
        neighbors = []
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < hexRows and 0 <= nc < hexCols:
                neighbors.append((nr, nc))
        return neighbors
    
    # First and Second pass are to create little islands of difficultly
    # First pass: set seeds!
    for r in range(hexRows):
        for c in range(hexCols):
            if random.random() < base_prob:
                grid[r][c]['cost'] = high
                grid[r][c]['isDifficult'] = True

    # Second pass: use the seeds!
    for r in range(hexRows):
        for c in range(hexCols):
            if grid[r][c]['cost'] == high:
                for nr, nc in get_neighbors(r, c):
                    if grid[nr][nc]['cost'] == low and random.random() < neighbor_boost:
                        grid[nr][nc]['cost'] = high
                        grid[nr][nc]['isDifficult'] = True
    return grid
