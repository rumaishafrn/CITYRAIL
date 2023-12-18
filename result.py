from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from queue import PriorityQueue
from flask import Flask, request, jsonify
import requests
import os
import json
import math

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
    api_url = 'https://train-database-production.up.railway.app/api/Edge'  # Replace with your API endpoint

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

@app.route('/edge', methods=['GET'])
def get_edge():
    api_url = 'https://train-database-production.up.railway.app/api/Edge'
    page = 1
    all_data = []

    while True:
        try:
            response = requests.get(f"{api_url}?page={page}")
            response.raise_for_status()  # Raise an exception if the request was unsuccessful
            data = response.json()  # Parse the JSON response

            all_data.extend(data['docs'])

            if not data['hasNextPage']:
                break

            page += 1

        except requests.exceptions.RequestException as e:
            return jsonify({'error': str(e)}), 500  # Return an error message if the request failed

    return jsonify(all_data)  # Return all data as JSON

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    start = tuple(data['start'])
    goal = tuple(data['goal'])
    path, weight = astar_search(start, goal)
    return jsonify({'path': path, 'weight': weight})

@app.route('/astar', methods=['GET'])
def astar_search():
    # Get the start and goal nodes from the query parameters
    start = request.args.get('start')
    goal = request.args.get('goal')

    # Get the heuristic data from the three API endpoints
    heuristic_argowilis = {'Lebak Bulus Grab': 224, 'Fatmawati Indomaret': 217, 'Cipete Raya': 197, 'Haji Nawi': 206, 'Blok A': 175, 'Blok M BCA': 135, 'ASEAN': 111, 'Senayan': 83, 'Istora Mandiri': 104, 'Bendungan Hilir': 65, 'Setiabudi Astra': 35, 'Dukuh Atas BNI': 69, 'Bundaran HI': 0}
    heuristic_bromoanggrek = {'Lebak Bulus Grab': 223, 'Fatmawati Indomaret': 213, 'Cipete Raya': 194, 'Haji Nawi': 205, 'Blok A': 173, 'Blok M BCA': 134, 'ASEAN': 110, 'Senayan': 81, 'Istora Mandiri': 105, 'Bendungan Hilir': 66, 'Setiabudi Astra': 34, 'Dukuh Atas BNI': 68, 'Bundaran HI': 0}
    heuristic_pandaluwungan = {'Lebak Bulus Grab': 221, 'Fatmawati Indomaret': 216, 'Cipete Raya': 195, 'Haji Nawi': 209, 'Blok A': 177, 'Blok M BCA': 136, 'ASEAN': 114, 'Senayan': 85, 'Istora Mandiri': 103, 'Bendungan Hilir': 64, 'Setiabudi Astra': 36, 'Dukuh Atas BNI': 67, 'Bundaran HI': 0}
    
    # Fetch the edge data from the /edge endpoint
    edge_data = {
        ("Lebak Bulus Grab", "Fatmawati Indomaret"): 32,
        ("Lebak Bulus Grab", "Cipete Raya"): 30,
        ("Fatmawati Indomaret", "Cipete Raya"): 22,
        ("Cipete Raya", "Blok A"): 23,
        ("Cipete Raya", "Haji Nawi"): 29,
        ("Haji Nawi", "Blok A"): 34,
        ("Blok A", "Blok M BCA"): 42,
        ("Blok M BCA", "ASEAN"): 25,
        ("ASEAN", "Senayan"): 31,
        ("Senayan", "Istora Mandiri"): 17,
        ("Senayan", "Setiabudi Astra"): 50,
        ("Istora Mandiri", "Bendungan Hilir"): 40,
        ("Bendungan Hilir", "Setiabudi Astra"): 33,
        ("Setiabudi Astra", "Bundaran HI"): 37,
        ("Setiabudi Astra", "Dukuh Atas BNI"): 44,
        ("Dukuh Atas BNI", "Bundaran HI"): 70,
    }

    # Construct the graph from the edge data
    graph = {
        # Construct the graph from the edge data
        'Lebak Bulus Grab': ['Fatmawati Indomaret', 'Cipete Raya'],
        'Fatmawati Indomaret': ['Lebak Bulus Grab', 'Cipete Raya'],
        'Cipete Raya' : ['Lebak Bulus Grab', 'Fatmawati Indomaret', 'Haji Nawi', 'Blok A'],
        'Haji Nawi' : ['Cipete Raya', 'Blok A'],
        'Blok A' : ['Cipete Raya', 'Haji Nawi', 'Blok M BCA'],
        'Blok M BCA' : ['Blok A', 'ASEAN'],
        'ASEAN' : ['Blok M BCA', 'Senayan'],
        'Senayan' : ['ASEAN', 'Istora Mandiri', 'Setiabudi Astra'],
        'Istora Mandiri' : ['Senayan', 'Bendungan Hilir'],
        'Bendungan Hilir' : ['Istora Mandiri', 'Setiabudi Astra', 'Dukuh Atas BNI'],
        'Setiabudi Astra' : ['Senayan', 'Bendungan Hilir', 'Dukuh Atas BNI', 'Bundaran HI'],
        'Dukuh Atas BNI' : ['Bendungan Hilir', 'Setiabudi Astra', 'Bundaran HI'],
        'Bundaran HI' : ['Setiabudi Astra', 'Dukuh Atas BNI'],
    }
    
    if edge_data is not None:
        for edge in edge_data:
            if isinstance(edge, dict) and 'source' in edge and 'target' in edge:
                if edge['source'] not in graph:
                    graph[edge['source']] = []
                graph[edge['source']].append(edge['target'])

    # Define your heuristic function
    def heuristic(node):
        min_value = min(heuristic_argowilis[node], heuristic_bromoanggrek[node], heuristic_pandaluwungan[node])
        if min_value == heuristic_argowilis[node]:
            print(f"For node {node}, heuristic_argowilis has the minimum value: {min_value}")
        elif min_value == heuristic_bromoanggrek[node]:
            print(f"For node {node}, heuristic_bromoanggrek has the minimum value: {min_value}")
        else:
            print(f"For node {node}, heuristic_pandaluwungan has the minimum value: {min_value}")
        return min_value

    # Initialize the priority queue with the start node
    frontier = PriorityQueue()
    frontier.put(start, 0)

    # Initialize the cost so far and the path with the start node
    cost_so_far = {start: 0}
    came_from = {start: None}

    while not frontier.empty():
        current = frontier.get()

        if current == goal:
            break

        if current in graph:
            for next in graph[current]:
                if current in cost_so_far:  # Add this line
                    new_cost = cost_so_far[current] + 1
                    if next not in cost_so_far or new_cost < cost_so_far[next]:
                        cost_so_far[next] = new_cost
                        priority = new_cost + heuristic(next)
                        frontier.put(next, priority)
                        came_from[next] = current

    # Reconstruct the path
    if goal in came_from:
        current = goal
        path = []
        while current is not None:
            path.append(current)
            current = came_from[current]
        path.reverse()
    else:
        path = None

    return jsonify(path)  # Return the path as JSON

if __name__ == '__main__':
    app.run(debug=True)