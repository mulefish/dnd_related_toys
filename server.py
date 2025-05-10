# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from python_logic.grid_generator import generate_hex_grid
from python_logic.creature_generator import CreatureGenerator

import traceback
traceback.print_exc()
app = Flask(__name__)
CORS(app)

@app.route('/grid-params', methods=['POST'])
def calculate_grid():
    try:
        data = request.json
        print("Received data:", data)

        grid = generate_hex_grid()

        return jsonify(grid)

    except Exception as e:
        print("Error processing request:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400
    
@app.route('/combatants', methods=['GET'])
def get_combatants():
    try:
        generator = CreatureGenerator()
        creatures = generator.generate()
        creature_dicts = [vars(c) for c in creatures]
        return jsonify(creature_dicts)
    except Exception as e:
        print("Error generating creatures:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
