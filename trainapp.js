document.addEventListener('DOMContentLoaded', (event) => {
    authenticate();
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