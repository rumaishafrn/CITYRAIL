window.onload = function() {
    // Get the selected values from the local storage
    const start = localStorage.getItem('startDropdown');
    const goal = localStorage.getItem('goalDropdown');

    // Log the selected values to the console
    console.log(`Start: ${start}`);
    console.log(`Goal: ${goal}`);

    // Make a GET request to the /astar endpoint with the start and goal nodes as query parameters
    fetch(`http://127.0.0.1:5000/astar?start=${start}&goal=${goal}`)
        .then(response => response.json())
        .then(data => {
            const resultBox = document.getElementById('resultbox');

            // Create a div to display the path
            const pathInfo = document.createElement('div');
            if (data !== null) {
                pathInfo.innerHTML = `
                    <h3>Departure: ${start}</h3>
                    <h3>Destination: ${goal}</h3>
                    <h3>Path:</h3>
                    <p>${data.join(' -> ')}</p>
                `;
            } else {
                pathInfo.innerHTML = `
                    <h3>Departure: ${start}</h3>
                    <h3>Destination: ${goal}</h3>
                    <h3>No path found</h3>
                `;
            }

            resultBox.appendChild(pathInfo);
        })
        .catch(error => console.error('Error:', error));
 
};

const start = localStorage.getItem('startDropdown');
const goal = localStorage.getItem('goalDropdown');

fetch(`http://127.0.0.1:5000/astar`)
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const resultBox = document.getElementById('resultbox');

        // Get the start and goal from the input fields
        const start = document.getElementById('startDropdown').value;
        const goal = document.getElementById('goalDropdown').value;

        // Create a div to display the start, goal, and the path
        const pathInfo = document.createElement('div');
        if (data !== null) {
            pathInfo.innerHTML = `
                <h3>Departure: ${start}</h3>
                <h3>Destination: ${goal}</h3>
                <p>Path: ${data.join(' -> ')}</p>
            `;
        } else {
            pathInfo.innerHTML = `
                <h3>Departure: ${start}</h3>
                <h3>Destination: ${goal}</h3>
                <p>No path found</p>
            `;
        }

        resultBox.appendChild(pathInfo);
    });

fetch(`http://127.0.0.1:5000/search`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({start: start, goal: goal}),
})
.then(response => response.json())
.then(data => {
    const resultBox = document.getElementById('resultbox');

    // Create a div to display the path and the weight
    const pathInfo = document.createElement('div');
    if (data.path !== null) {
        pathInfo.innerHTML = `
            <h3>Path:</h3>
            <p>${data.path.join(' -> ')}</p>
            <h3>Weight:</h3>
            <p>${data.weight}</p>
        `;
    } else {
        pathInfo.innerHTML = `
            <h3>No path found</h3>
        `;
    }

    resultBox.appendChild(pathInfo);
})
.catch(error => console.error('Error:', error));