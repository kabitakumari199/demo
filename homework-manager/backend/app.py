from flask import Flask, jsonify, request
from flask_cors import CORS # Import CORS

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# In-memory store for homework assignments
homework_assignments = [
    {"id": 1, "title": "Math Homework", "subject": "Math", "dueDate": "2024-03-10", "completed": False},
    {"id": 2, "title": "History Essay", "subject": "History", "dueDate": "2024-03-15", "completed": True},
]
next_id = 3

@app.route('/api/homework', methods=['GET'])
def get_homework_list():
    return jsonify(homework_assignments)

@app.route('/api/homework', methods=['POST'])
def add_homework():
    global next_id
    data = request.get_json()
    if not data or not data.get('title') or not data.get('subject') or not data.get('dueDate'):
        return jsonify({"error": "Missing data"}), 400

    new_homework = {
        "id": next_id,
        "title": data['title'],
        "subject": data['subject'],
        "dueDate": data['dueDate'],
        "completed": data.get('completed', False) # Default to False if not provided
    }
    homework_assignments.append(new_homework)
    next_id += 1
    return jsonify(new_homework), 201

@app.route('/api/homework/<int:homework_id>', methods=['PUT'])
def update_homework(homework_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing data"}), 400

    homework = next((hw for hw in homework_assignments if hw['id'] == homework_id), None)
    if homework is None:
        return jsonify({"error": "Homework not found"}), 404

    # Update fields if provided
    if 'title' in data:
        homework['title'] = data['title']
    if 'subject' in data:
        homework['subject'] = data['subject']
    if 'dueDate' in data:
        homework['dueDate'] = data['dueDate']
    if 'completed' in data:
        homework['completed'] = data['completed']

    return jsonify(homework)

@app.route('/api/homework/<int:homework_id>', methods=['DELETE'])
def delete_homework(homework_id):
    global homework_assignments
    homework = next((hw for hw in homework_assignments if hw['id'] == homework_id), None)
    if homework is None:
        return jsonify({"error": "Homework not found"}), 404

    homework_assignments = [hw for hw in homework_assignments if hw['id'] != homework_id]
    return jsonify({"message": "Homework deleted successfully"}), 200

if __name__ == '__main__':
    # It's good practice to specify host and port for development
    # The proxy in frontend/package.json is set to localhost:5000
    app.run(host='0.0.0.0', port=5000, debug=True)
