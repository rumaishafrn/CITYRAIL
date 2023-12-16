document.addEventListener('DOMContentLoaded', (event) => {
    authenticate();
    setupDropdownSelection();
    setupButtonNavigation();
});

// authentication api to website
const authenticate = async () => {
    const response = await fetch('https://train-database-production.up.railway.app/api/Users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'emailtest@gmail.com',
            password: 'helloworld'
        })
    });

    const data = await response.json();
    localStorage.setItem('token', data.token);
};

// account login
const login = async (email, password) => {
    const response = await fetch('https://train-database-production.up.railway.app/api/collections/account', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const accounts = await response.json();
    const account = accounts.find(account => account.Email === email && account.Password === password);

    return account ? account : null;
};

// setup dropdown selection
const setupDropdownSelection = () => {
    // Get all dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    // Add click event listener to each dropdown item
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get the parent dropdown of the clicked item
            const dropdown = this.closest('.dropdown');
            // Get the dropdown button
            const dropdownButton = dropdown.querySelector('.dropdown-toggle');
            // Update the text of the dropdown button
            dropdownButton.textContent = this.textContent;
            // Save the selected value in the local storage
            localStorage.setItem('selectedDropdownValue', this.textContent);
        });
    });
};

// setup button navigation
const setupButtonNavigation = () => {
    document.getElementById('tombolmain').addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'result.html';
    });
};