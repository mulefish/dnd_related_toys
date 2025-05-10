from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
import math

app = Flask(__name__)
CORS(app)
@app.route('/grid-params', methods=['POST'])
def calculate_grid():
    try:
        data = request.json
        print("Received data:", data)

        viewportWidth = data['viewportWidth']
        viewportHeight = data['viewportHeight']
        hexCols = data['hexCols']
        hexRows = data['hexRows']

        maxRadiusX = viewportWidth / (((hexCols - 1) * 3) / 2 + 2)
        maxRadiusY = viewportHeight / ((hexRows - 1) * math.sqrt(3) + 1)
        hexRadius = min(maxRadiusX, maxRadiusY)

        result = {
            'hexRadius': int(round(hexRadius)),
            'hexWidth': int(round(hexRadius * 2)),
            'hexHeight': int(round(math.sqrt(3) * hexRadius)),
            'horizSpacing': int(round(1.5 * hexRadius)),
            'vertSpacing': int(round(math.sqrt(3) * hexRadius)),
            'offsetX': 0,
            'offsetY': 20
        }

        return jsonify(result)
    
    except Exception as e:
        print("Error processing request:", e)
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
