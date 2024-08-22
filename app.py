from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

def run_algorithm(executable):
    result = subprocess.run([f'./{executable}'], capture_output=True, text=True)
    return result.stdout

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    algorithm = data.get('algorithm')

    # Map algorithm names to corresponding executables
    executables = {
        'fcfs': 'fcfs',
        'sjf': 'sjf',
        'priority': 'priority',
        'rr': 'roundrobin'
    }

    if algorithm in executables:
        output = run_algorithm(executables[algorithm])
        return jsonify({"output": output})
    else:
        return jsonify({"error": "Algorithm not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
