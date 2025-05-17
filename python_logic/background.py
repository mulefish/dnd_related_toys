import random
from .globals import goals

def create_background(rows, cols): 
    grid = []
    for r in range(rows):
        row = []
        for c in range(cols):
            cost = 5 if random.random() < 0.05 else 1
            row.append({'cost': cost, 'row':r, 'col':c, 'isGoal':False})
        grid.append(row)

    # Step 2: Copy for mutation phase
    new_grid = [[cell.copy() for cell in row] for row in grid]

    # Directions for all 8 neighbors (including diagonals)
    neighbor_offsets = [(-1, -1), (-1, 0), (-1, 1),
                        (0, -1),           (0, 1),
                        (1, -1),  (1, 0),  (1, 1)]

    # Step 3: Propagate cost=5 with 50% chance to neighbors
    for r in range(rows):
        for c in range(cols):
            if grid[r][c]['cost'] == 5:
                for dr, dc in neighbor_offsets:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols:
                        if new_grid[nr][nc]['cost'] != 5 and random.random() < 0.5:
                            new_grid[nr][nc]['cost'] = 5


    for goal in goals:
        row = goal['row']
        col = goal['col']
        new_grid[row][col]['isGoal']=True



    grid = new_grid
    return grid 

if __name__ == "__main__":
    # self test 
    land = create_background(2,3)
    i = len(land)
    j = len(land[0])
    # for x in range(i):
    #     for y in range(j):
    #         print(land[x][y])
            