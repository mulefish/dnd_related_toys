from flask import Flask, jsonify
from flask_cors import CORS # type: ignore
from python_logic.loader import load_creatures
from python_logic.creatures import roll_dice
from python_logic.combat import move
from python_logic.hexgrid import get_hex_grid
from python_logic.globals import goal_x, goal_y, hex_size

app = Flask(__name__)
CORS(app)
elves, orcs = {}, {}

def serialize(c):
    return {
        "name": c.name,
        "race": c.race,
        "x": c.x,
        "y": c.y,
        "hp": c.hitpoints,
        "angle": c.angle
    }

@app.route("/start-game", methods=["POST"])
def start_game():
    try:
        global elves, orcs
        elves, orcs = load_creatures(num_elves=1, num_orcs=3)
        return jsonify({
            "elves": {i: serialize(e) for i, e in elves.items()},
            "orcs": {i: serialize(o) for i, o in orcs.items()}
        })
    except Exception as e:
        return jsonify({"error": "Failed to start game", "details": str(e)}), 500


@app.route("/get-globals")
def get_globals():
    try:
        from python_logic import globals as g
        return jsonify({
            "viewport_width": g.viewport_width,
            "viewport_height": g.viewport_height,
            "goal_x": g.goal_x,
            "goal_y": g.goal_y,
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

@app.route("/hex-grid")
def hex_grid():
    return get_hex_grid()

@app.route("/run-turn", methods=["POST"])
def run_turn():
    try:
        all_creatures = list(elves.values()) + list(orcs.values())
        sorted_creatures = sorted(all_creatures, key=lambda c: c.initiative, reverse=True)
        for c in sorted_creatures:
            move(c, elves, orcs, goal_x, goal_y, hex_size, roll_dice)

        return jsonify({
            "elves": {i: serialize(e) for i, e in elves.items()},
            "orcs": {i: serialize(o) for i, o in orcs.items()}
        })
    except Exception as e:
        return jsonify({"error": "Failed to run turn", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
