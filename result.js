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
                let secondWord = data.heuristic[1];

                let imageSrc;
                if (secondWord === 'Bromo Anggrek') {
                    imageSrc = 'images/kereta bromo anggrek.jpeg';
                } else if (secondWord === 'Argo Wilis') {
                    imageSrc = 'images/kereta argo wilis.jpg';
                } else {
                    imageSrc = 'images/kereta pandaluwungan.jpg';
                }

                // Create a div to display the path
                const pathInfo = document.createElement('div');
                if (data.path !== null) {
                    pathInfo.innerHTML = `
                        <div class="row">
                            <div class="col" id="colresult">
                                <h3>Departure: </h3>
                                <h5>${start}</h5>
                                <h3>Destination: </h3>
                                <h5>${goal}</h5>
                                <h3>Path:</h3>
                                <h5 id="path">${data.path.join(' - ')}</h5>
                            </div>
                            <div class="col" id="containerkeretabaru">
                                <div class="container" id="containerwilis">
                                    <img src="${imageSrc}">
                                </div>
                                <div class="container" id="namabaru">
                                    <p>${secondWord}</p>
                                </div>
                            </div>
                        </div>
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