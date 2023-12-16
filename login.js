document.addEventListener('DOMContentLoaded', (event) => {
    authenticate();
    getData();
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

document.getElementById('submitbuttonlogin').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var email = document.getElementById('email').value;
    var password = document.getElementById('floatingPassword').value;

    const token = localStorage.getItem('token');

    await loginData(email, password);
    console.log(email, password);
});

const getData = async () => {
    try {
        const token = localStorage.getItem('token');

        const req = await fetch('https://train-database-production.up.railway.app/api/Account/', {
          method: "GET", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        })
        const text = await req.json();
        console.log(text);

        for (let i = 0; i < text.length; i++) {
            if (text[i].email === email && text[i].pass === password) {
                console.log('Login successful: Email and password are present in the API.');
                return;
            }
        }

    } catch (err) {
        console.log(err)
    }
}

const loginData = async (email, password) => {
    try {
        const token = localStorage.getItem('token');

        const req = await fetch('https://train-database-production.up.railway.app/api/Account/', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!req.ok) {
            throw new Error(`HTTP error! status: ${req.status}`);
        }

        const docs = await req.json();

        for (let i = 0; i < docs.length; i++) {
            if (docs[i].docs.email === email && docs[i].docs.pass === password) {
                console.log('Login successful: Email and password are present in the API.');
                return;
            }
        }

        console.error('Invalid email or password.');
    } catch (error) {
        console.error('Error:', error);
    }
};