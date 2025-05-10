# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
from python_logic.grid_generator import generate_hex_grid
import traceback
traceback.print_exc()

app = Flask(__name__)
CORS(app)

@app.route('/grid-params', methods=['POST'])
def calculate_grid():
    try:
        data = request.json
        print("Received data:", data)

        hexCols = data['hexCols']
        hexRows = data['hexRows']

        grid = generate_hex_grid(hexRows, hexCols)
        return jsonify(grid)

    except Exception as e:
        print("Error processing request:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
