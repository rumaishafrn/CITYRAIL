@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    start = tuple(data['start'])
    goal = tuple(data['goal'])
    path, weight, heuristic_name = astar_search(start, goal)
    return jsonify({'path': path, 'weight': weight, 'heuristic_name': heuristic_name})