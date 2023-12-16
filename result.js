fetch('http://127.0.0.1:5000/fetch_data')
    .then(response => response.json())
    .then(data => {
        // Your existing code to handle the fetch_data response goes here
    })
    .catch(error => console.error('Error:', error));

fetch('http://127.0.0.1:5000/heuristic')
    .then(response => {
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Now you have access to your data in your JavaScript
        const heuristic = data.heuristic;

        // You can use the heuristic variable here
        console.log('Heuristic:', heuristic);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });

function displayHeuristic(heuristic) {
    const resultBox = document.getElementById('resultbox');
    resultBox.textContent = `Heuristic: ${heuristic}`;
}