import math

def find_new_point(x, y, angle, distance):
    radians = math.radians(angle)
    return {
        'x': round(math.cos(radians) * distance + x),
        'y': round(math.sin(radians) * distance + y)
    } 
# [{'row': 10, 'col': 10}, {'row': 16, 'col': 16}, {'row': 16, 'col': 10}, {'row': 22, 'col': 9}] 


def remove_dead(creatures: dict) -> dict:
    return {i: c for i, c in creatures.items() if c.hitpoints > 0}

def move(creature, elves, orcs, elf_goals, hex_size, roll_dice):
    def euclid(a, b):
        return math.hypot(a.x - b.x, a.y - b.y)

    def euclid_coords(x1, y1, x2, y2):
        return math.hypot(x2 - x1, y2 - y1)

    if creature.race == "ORC":
        targets = [e for e in elves.values() if e.hitpoints > 0]
        if not targets:
            return
        target = min(targets, key=lambda e: euclid(creature, e))
        dx, dy = target.x - creature.x, target.y - creature.y
        creature.angle = math.degrees(math.atan2(dy, dx))
        new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']
        if euclid(creature, target) <= creature.range:
            target.hitpoints -= roll_dice(creature.attack)

    elif creature.race == "ELF":
        threats = [o for o in orcs.values() if o.hitpoints > 0]
        if not threats:
            return

        # Evaluate each goal: score = closeness - 0.5 * orc proximity (the higher, the better)
        def goal_score(goal):
            gx = goal['col'] * hex_size
            gy = goal['row'] * hex_size
            dist_to_goal = euclid_coords(creature.x, creature.y, gx, gy)
            orc_penalty = sum(
                1 / (euclid_coords(o.x, o.y, gx, gy) + 1)  # +1 avoids div by 0
                for o in threats
            )
            return dist_to_goal + 10 * orc_penalty  # Higher penalty means less desirable

        best_goal = min(elf_goals, key=goal_score)
        gx = best_goal['col'] * hex_size
        gy = best_goal['row'] * hex_size

        # Move away from nearest orc, toward best goal
        nearest_orc = min(threats, key=lambda o: euclid(creature, o))
        to_goal = (gx - creature.x, gy - creature.y)
        from_orc = (creature.x - nearest_orc.x, creature.y - nearest_orc.y)

        # Combine vectors: move slightly away from orc, mostly toward goal
        dx = to_goal[0] * 0.7 + from_orc[0] * 0.3
        dy = to_goal[1] * 0.7 + from_orc[1] * 0.3

        creature.angle = math.degrees(math.atan2(dy, dx))
        new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']

        if euclid(creature, nearest_orc) <= creature.range:
            nearest_orc.hitpoints -= roll_dice(creature.attack)



# def move(creature, elves, orcs, elf_goals, hex_size, roll_dice):


# def move(creature, elves, orcs, goal_x, goal_y, hex_size, roll_dice):
#     def euclid(a, b):
#         return math.hypot(a.x - b.x, a.y - b.y)

#     if creature.race == "ORC":
#         targets = [e for e in elves.values() if e.hitpoints > 0]
#         if not targets: return
#         target = min(targets, key=lambda e: euclid(creature, e))
#         dx, dy = target.x - creature.x, target.y - creature.y
#         creature.angle = math.degrees(math.atan2(dy, dx))
#         new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
#         creature.x, creature.y = new_pt['x'], new_pt['y']
#         if euclid(creature, target) <= creature.range:
#             target.hitpoints -= roll_dice(creature.attack)

#     elif creature.race == "ELF":
#         threats = [o for o in orcs.values() if o.hitpoints > 0]
#         if not threats: return
#         near = min(threats, key=lambda o: euclid(creature, o))
#         to_center = (goal_x - creature.x, goal_y - creature.y)
#         from_orc = (creature.x - near.x, creature.y - near.y)
#         dx = to_center[0] + from_orc[0]
#         dy = to_center[1] + from_orc[1]
#         creature.angle = math.degrees(math.atan2(dy, dx))
#         new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
#         creature.x, creature.y = new_pt['x'], new_pt['y']
#         if euclid(creature, near) <= creature.range:
#             near.hitpoints -= roll_dice(creature.attack)
