import random
import math
from .globals import ROWS, COLS

def move_creature_randomly(creatures, grid, active_index):
    if not (0 <= active_index < len(creatures)):
        return creatures

    def get_pixel_position(creature):
        col = creature["col"]
        row = creature["row"]
        offset_x = 0
        offset_y = 20
        hex_radius = 20
        horiz_spacing = 1.5 * hex_radius
        vert_spacing = math.sqrt(3) * hex_radius
        x = offset_x + col * horiz_spacing + hex_radius
        y = offset_y + row * vert_spacing + (col % 2) * (vert_spacing / 2)
        return x, y

    def compute_angle(from_creature, to_creature):
        x1, y1 = get_pixel_position(from_creature)
        x2, y2 = get_pixel_position(to_creature)
        angle = math.atan2(y2 - y1, x2 - x1)
        return math.degrees(angle)

    creature = creatures[active_index]
    if creature.get("movement", 0) <= 0:
        return creatures

    my_x, my_y = get_pixel_position(creature)

    # Find nearby enemy targets
    targets = []
    for i, c in enumerate(creatures):
        if i == active_index:
            continue
        if c["species"] != creature["species"]:
            cx, cy = get_pixel_position(c)
            dist = math.sqrt((my_x - cx) ** 2 + (my_y - cy) ** 2)
            if dist < 1001:
                targets.append((dist, i, c))

    if not targets:
        return creatures

    targets.sort(key=lambda t: t[0])
    closest_dist, target_index, target = targets[0]

    creature["target"] = target_index
    creature["angle"] = round(compute_angle(creature, target), 2)

    def distance_to_target(r, c):
        x = 0 + c * 1.5 * 20 + 20
        y = 20 + r * math.sqrt(3) * 20 + (c % 2) * ((math.sqrt(3) * 20) / 2)
        tx, ty = get_pixel_position(target)
        return math.sqrt((x - tx) ** 2 + (y - ty) ** 2)

    directions_even = [(-1, 0), (-1, +1), (0, -1), (0, +1), (+1, 0), (+1, +1)]
    directions_odd = [(-1, -1), (-1, 0), (0, -1), (0, +1), (+1, -1), (+1, 0)]

    while creature["movement"] > 0:
        current_row, current_col = creature["row"], creature["col"]
        best_move = None
        best_dist = distance_to_target(current_row, current_col)
        directions = directions_even if current_row % 2 == 0 else directions_odd

        for dr, dc in directions:
            nr, nc = current_row + dr, current_col + dc
            if 0 <= nr < ROWS and 0 <= nc < COLS:
                tile_cost = max(10, grid[nr][nc]["cost"])
                if creature["movement"] >= tile_cost:
                    dist = distance_to_target(nr, nc)
                    if dist < best_dist:
                        best_move = (nr, nc, tile_cost)
                        best_dist = dist

        if best_move:
            nr, nc, cost = best_move
            creature["row"] = nr
            creature["col"] = nc
            creature["movement"] -= cost
        else:
            break  # can't move further

    # Reset movement points for next turn
    creature["movement"] = 0

    return creatures


# import random
# from .globals import ROWS, COLS

# def move_creature_randomly(creatures, grid, active_index):


#     if not (0 <= active_index < len(creatures)):
#         print(f"IFF index={active_index} and {len(creatures)}")
#         return creatures  # invalid index, do nothing
#     else:
#         print(f"--- index={active_index} and {len(creatures)}")

#     creature = creatures[active_index]

#     row, col = creature['row'], creature['col']
#     movement = creature.get('movement', 0)

#     # Directions: N, S, E, W, NE, NW, SE, SW
#     directions = [
#         (-1, 0), (+1, 0), (0, -1), (0, +1),
#         (-1, +1), (-1, -1), (+1, +1), (+1, -1)
#     ]

#     random.shuffle(directions)  # try directions in random order

#     for dr, dc in directions:
#         new_row = row + dr
#         new_col = col + dc
#         if 0 <= new_row < ROWS and 0 <= new_col < COLS:
#             tile_cost = grid[new_row][new_col]['cost']
#             tile_cost = max(tile_cost, 10)  # ensure minimum move cost is 10

#             if movement >= tile_cost:
#                 creature['row'] = new_row
#                 creature['col'] = new_col
#                 creature['movement'] -= tile_cost
#                 break  # move successful

#     return creatures
