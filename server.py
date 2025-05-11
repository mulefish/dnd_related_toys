# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from python_logic.grid_generator import generate_hex_grid
from python_logic.creature_generator import CreatureGenerator
from python_logic.movement_engine import move_creature_randomly

import traceback
traceback.print_exc()
app = Flask(__name__)
CORS(app)

active_index = 0
creatures_cache = []
grid_cache = []

@app.route('/grid-params', methods=['POST'])
def calculate_grid():   
    global grid_cache
    grid_cache = generate_hex_grid()
    return jsonify(grid_cache)    

@app.route('/combatants', methods=['GET'])
def get_combatants():
    global creatures_cache, active_index

    elves_count = 3
    orcs_count = 6
    total_points = 200

    generator = CreatureGenerator(orcs_count, elves_count, total_points)
    creatures_cache = [vars(c) for c in generator.generate()]
    active_index = 0
    return jsonify(creatures_cache)

@app.route('/makeTheNextCreatureMove', methods=['POST'])
def make_the_next_creature_move():
    global creatures_cache, grid_cache

    data = request.get_json(force=True)
    active_index = data.get('activeIndex')

    if active_index is None:
        return jsonify({'error': 'activeIndex missing'}), 400

    creatures_cache = move_creature_randomly(creatures_cache, grid_cache, active_index)
    creature_dicts = [vars(c) if not isinstance(c, dict) else c for c in creatures_cache]
    return jsonify(creature_dicts)


if __name__ == '__main__':
    app.run(port=5000, debug=True)
