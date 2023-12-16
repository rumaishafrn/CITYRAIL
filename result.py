from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
from queue import PriorityQueue
import os

app = Flask(__name__)
CORS(app)

# Define the A* search algorithm
def astar_search(start, goal):
    # Define the heuristic function (Euclidean distance as an example)
    def heuristic(node, goal):
        return ((node[0] - goal[0]) ** 2 + (node[1] - goal[1]) ** 2) ** 0.5

    # Initialize priority queue
    open_set = PriorityQueue()
    open_set.put((0, start))

    # Initialize costs and parents
    g_costs = {start: 0}
    parents = {start: None}

    while not open_set.empty():
        _, current_node = open_set.get()

        if current_node == goal:
            # Reconstruct the path
            path = []
            while current_node is not None:
                path.append(current_node)
                current_node = parents[current_node]
            return path[::-1]

        # Explore neighbors
        for neighbor in get_neighbors(current_node):  # Replace with your function to get neighbors
            tentative_g_cost = g_costs[current_node] + 1  # Assuming uniform cost for simplicity

            if neighbor not in g_costs or tentative_g_cost < g_costs[neighbor]:
                g_costs[neighbor] = tentative_g_cost
                f_cost = tentative_g_cost + heuristic(neighbor, goal)
                open_set.put((f_cost, neighbor))
                parents[neighbor] = current_node

    # No path found
    return None

# Example function to get neighboring nodes (replace this with your actual implementation)
def get_neighbors(node):
    x, y = node
    neighbors = [(x+1, y), (x-1, y), (x, y+1), (x, y-1)]
    # Add any additional logic to filter valid neighbors based on your problem
    return neighbors

@app.route('/')
def home():
    return "Hello, World!"

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/fetch_data', methods=['GET'])
def fetch_data():
    api_url = 'https://train-database-production.up.railway.app/api/Heuristic'  # Replace with your API endpoint

    try:
        # Assuming you have coordinates for start and goal points
        start_point = (0, 0)  # Replace with your actual start point
        goal_point = (10, 10)  # Replace with your actual goal point

        # Use A* search to find the path
        path = astar_search(start_point, goal_point)

        if path is not None:
            # You can now use the path or any other information retrieved from the API
            data = {'path': path, 'other_data': '...'}
            return jsonify(data)
        else:
            return jsonify({'error': 'No path found'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

@app.route('/heuristic', methods=['GET'])
def get_heuristic():
    api_url = 'https://train-database-production.up.railway.app/api/Heuristic'
    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an exception if the request was unsuccessful
        data = response.json()  # Parse the JSON response
        return jsonify(data)  # Return the data as JSON
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500  # Return an error message if the request failed

if __name__ == '__main__':
    app.run(debug=True)