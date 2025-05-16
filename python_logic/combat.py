import math

def find_new_point(x, y, angle, distance):
    radians = math.radians(angle)
    return {
        'x': round(math.cos(radians) * distance + x),
        'y': round(math.sin(radians) * distance + y)
    }

def move(creature, elves, orcs, goal_x, goal_y, hex_size, roll_dice):
    def euclid(a, b):
        return math.hypot(a.x - b.x, a.y - b.y)

    if creature.race == "ORC":
        targets = [e for e in elves.values() if e.hitpoints > 0]
        if not targets: return
        target = min(targets, key=lambda e: euclid(creature, e))
        dx, dy = target.x - creature.x, target.y - creature.y
        creature.angle = math.degrees(math.atan2(dy, dx))
        new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']
        if euclid(creature, target) <= creature.range:
            target.hitpoints -= roll_dice(creature.attack)

    elif creature.race == "ELF":
        threats = [o for o in orcs.values() if o.hitpoints > 0]
        if not threats: return
        near = min(threats, key=lambda o: euclid(creature, o))
        to_center = (goal_x - creature.x, goal_y - creature.y)
        from_orc = (creature.x - near.x, creature.y - near.y)
        dx = to_center[0] + from_orc[0]
        dy = to_center[1] + from_orc[1]
        creature.angle = math.degrees(math.atan2(dy, dx))
        new_pt = find_new_point(creature.x, creature.y, creature.angle, creature.movement)
        creature.x, creature.y = new_pt['x'], new_pt['y']
        if euclid(creature, near) <= creature.range:
            near.hitpoints -= roll_dice(creature.attack)
