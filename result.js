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
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
};

// fetch('http://127.0.0.1:5000/edge')
//     .then(response => {
//         if (response.status !== 200) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         const resultBox = document.getElementById('resultbox');data.forEach(doc => {
//             const edgeInfo = document.createElement('div');
//             edgeInfo.innerHTML = `
//                 <h3>Departure: ${doc.departure}</h3>
//                 <h3>Destination: ${doc.destination}</h3>
//                 <p>Total Weight: ${doc.nilai_edge}</p>
//             `;

//             resultBox.appendChild(edgeInfo);
//         });
//     })
//     .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//     });

// Get the start and goal nodes from the local storage
const start = localStorage.getItem('startDropdown');
const goal = localStorage.getItem('goalDropdown');

fetch(`http://127.0.0.1:5000/astar?start=${start}&goal=${goal}`)
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const resultBox = document.getElementById('resultbox');

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
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });