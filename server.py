from flask import Flask, jsonify
from flask_cors import CORS # type: ignore
from python_logic.creatures import roll_dice, load_creatures
from python_logic.combat import move
from python_logic.background import create_background
from python_logic.globals import goals, hex_size

app = Flask(__name__)
CORS(app)
elves, orcs = {}, {}

def serialize(c):
    return {
        "name": c.name,
        "race": c.race,
        "x": c.x,
        "y": c.y,
        "hitpoints": c.hitpoints,
        "angle": c.angle
    }



@app.route("/start-game", methods=["POST"])
def start_game():
    print("start_game")
    try:
        global elves, orcs
        elves, orcs = load_creatures(num_elves=10, num_orcs=20)
        return jsonify({
            "elves": {i: serialize(e) for i, e in elves.items()},
            "orcs": {i: serialize(o) for i, o in orcs.items()}
        })
    except Exception as e:
        return jsonify({"error": "Failed to start game", "details": str(e)}), 500


@app.route("/get-globals")
def get_globals():
    print("get_globals")

    try:
        from python_logic import globals as g
        return jsonify({
            "viewport_width": g.viewport_width,
            "viewport_height": g.viewport_height,
            "goals": g.goals,
            "hex_size": g.hex_size,
            "elf_goal": g.elf_goal,
            "orc_goal": g.orc_goal,
            "rows": g.rows,
            "cols": g.cols,
            "elf_flag": g.elf_flag,
            "orc_flag": g.orc_flag
        })
    except Exception as e:
        return jsonify({"error": "Failed to load globals", "details": str(e)}), 500

@app.route("/create-background", methods=['POST'])
def create_background_route():
    print("create_background_route")
    from python_logic import globals as g
    return create_background(g.rows,g.cols)

@app.route("/run-turn", methods=["POST"])
def run_turn():
    print("run_turn")
    try:
        all_creatures = list(elves.values()) + list(orcs.values())
        sorted_creatures = sorted(all_creatures, key=lambda c: c.initiative, reverse=True)
        for c in sorted_creatures:
            if c.hitpoints > 0: 
                move(c, elves, orcs, goals, hex_size, roll_dice)

        for i in elves: 
            obj = elves[i]
            obj.desc() 

#         elves = remove_dead(elves)
        # orcs = remove_dead(orcs)

        return jsonify({
            "elves": {i: serialize(e) for i, e in elves.items()},
            "orcs": {i: serialize(o) for i, o in orcs.items()}
        })
    except Exception as e:
        print("IT FAILED!")
        print(str(e))
        return jsonify({"error": "Failed to run turn", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
