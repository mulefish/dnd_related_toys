import random
from flask import jsonify

def generate_hex_grid(rows=25, cols=50):
    grid = []

    # Step 1: create base grid with default cost of 5, 5% chance of 15
    for i in range(rows):
        row = []
        for j in range(cols):
            cost = 15 if random.random() < 0.05 else 5
            row.append({'row': i, 'col': j, 'i': i, 'j': j, 'cost': cost})
        grid.append(row)

    # Step 2: flip cost to 15 if any neighbor has cost > 5
    def neighbors(i, j):
        # Offset logic for hex grid with even-q vertical layout
        offsets_even = [(-1, 0), (-1, 1), (0, -1), (0, 1), (1, 0), (1, 1)]
        offsets_odd = [(-1, -1), (-1, 0), (0, -1), (0, 1), (1, -1), (1, 0)]
        offsets = offsets_even if j % 2 == 0 else offsets_odd

        for di, dj in offsets:
            ni, nj = i + di, j + dj
            if 0 <= ni < rows and 0 <= nj < cols:
                yield grid[ni][nj]

    for i in range(rows):
        for j in range(cols):
            if grid[i][j]['cost'] == 5:
                if any(n['cost'] > 5 for n in neighbors(i, j)):
                    grid[i][j]['cost'] = 15

    return grid

# Flask-compatible endpoint to return the grid
def get_hex_grid():
    grid = generate_hex_grid()
    return jsonify({'hex_grid': grid})
