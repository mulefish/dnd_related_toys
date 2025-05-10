# grid_generator.py
import math
import random

def generate_hex_grid(hexRows, hexCols, base_prob=0.05, neighbor_boost=0.3):
    grid = [[{'row': r, 'col': c, 'cost': 0} for c in range(hexCols)] for r in range(hexRows)]

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

    # First pass: base chance
    for r in range(hexRows):
        for c in range(hexCols):
            if random.random() < base_prob:
                grid[r][c]['cost'] = 30

    # Second pass: boost neighbors
    for r in range(hexRows):
        for c in range(hexCols):
            if grid[r][c]['cost'] == 30:
                for nr, nc in get_neighbors(r, c):
                    if grid[nr][nc]['cost'] == 0 and random.random() < neighbor_boost:
                        grid[nr][nc]['cost'] = 30

    return grid
