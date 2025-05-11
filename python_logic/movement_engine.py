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

    # CLEVER logic
    clever_roll = random.randint(0, 100)
    if clever_roll <= creature.get("clever", 0):
        # Target the weakest enemy
        targets.sort(key=lambda t: (t[2].get("hitpoints", 0) - t[2].get("damage", 0)))
    else:
        # Target the closest enemy
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
    temp_movement = creature["movement"]

    while temp_movement > 0:
        current_row, current_col = creature["row"], creature["col"]
        best_move = None
        best_dist = distance_to_target(current_row, current_col)
        directions = directions_even if current_row % 2 == 0 else directions_odd

        for dr, dc in directions:
            nr, nc = current_row + dr, current_col + dc
            if 0 <= nr < ROWS and 0 <= nc < COLS:
                tile_cost = grid[nr][nc]["cost"]
                if temp_movement >= tile_cost:
                    dist = distance_to_target(nr, nc)
                    if dist < best_dist:
                        best_move = (nr, nc, tile_cost)
                        best_dist = dist

        if best_move:
            nr, nc, cost = best_move
            creature["row"] = nr
            creature["col"] = nc
            temp_movement -= cost
        else:
            break

    return creatures
