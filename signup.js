document.addEventListener('DOMContentLoaded', (event) => {
    authenticate();
});

// authentication api to website
const authenticate = async () => {
    try {
        const req = await fetch('https://train-database-production.up.railway.app/api/Users/login', {
            method: "POST", 
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: "emailtest@gmail.com",
                password: "helloworld"
            }),
        });

        if (!req.ok) {
            throw new Error(`HTTP error! status: ${req.status}`);
        }

        const data = await req.json();
        console.log(data);

        localStorage.setItem('token', data.token);
    } catch (error) {
        console.error('Fetch Error:', error);
    }
};

document.getElementById('submitbutton').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var fullName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('floatingPassword').value;

    const token = localStorage.getItem('token');

    // Call postData function with the form values and the token
    await postData(fullName, email, password, token);
    console.log(fullName, email, password, confirmPassword);
});

const postData = async (fullName, email, password) => {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const req = await fetch('https://train-database-production.up.railway.app/api/Account', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                fullname: fullName,
                email: email,
                pass: password
            }),
        });

        if (!req.ok) {
            if (req.status === 403) {
                console.error('403 Forbidden: You do not have permission to perform this action.');
                // Handle the 403 error
                // You might want to redirect the user to a login page, or show an error message
            } else {
                throw new Error(`HTTP error! status: ${req.status}`);
            }
        }

        const data = await req.json();
        console.log('req data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};