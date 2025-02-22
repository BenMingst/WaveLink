const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginBttn = document.getElementById('login-button');
const signupBttn = document.getElementById('signup-button');
const loginUserInput = document.getElementById('login-username');
const loginPassInput = document.getElementById('login-password');
const errorMessage = document.getElementById('error-message');

setInterval(createFish, 1000);

// Toggle between login and signup pages
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.classList.add('hidden');
    signupPage.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

const container = document.querySelector('.container');

function createFish() {
    const fish = document.createElement('img');
    fish.src = 'https://i.ibb.co/7rL6Nnq/fish.png';
    fish.className = 'fish';
    fish.alt = "Fish";

    const topPosition = Math.random() * window.innerHeight;
    fish.style.top = `${topPosition}px`;

    const zIndex = Math.random() < 0.5 ? 2 : 5;
    fish.style.zIndex = zIndex;

    const duration = Math.random() * 5 + 5;
    fish.style.animationDuration = `${duration}s`;

    container.appendChild(fish);

    fish.addEventListener('animationend', () => {
        fish.remove();
    });
}

/* endpoint is our api endpoint (ex http://cop4331-team26.xyz/LAMPIAPI/Login.php), payload is 
   the json file we send and callback sends the response we get back up to caller */
function makeRequest(endpoint, payload, callback) {
    const url = urlBase + endpoint + extension; 
    const xhr = new XMLHttpRequest(); 

    xhr.open('POST', url, true); 
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    const jsonPayload = JSON.stringify(payload);

    xhr.send(jsonPayload);
}

// Function to show the toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Set the message
    toastMessage.textContent = message;

    // Show the toast
    toast.style.display = 'block';
    toast.classList.add('show');

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.display = 'none';
    }, 3000);
}

// login api
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 
    const data = {
        login: document.getElementById('login-username').value,
        password: document.getElementById('password').value,
    };

    makeRequest('Login', data, (response) => {
        if (response.error)
        {

		errorMessage.textContent = "Wrong username or password. Please try again.";
		errorMessage.style.display = "block";

        }
        else
        {
            const { id, firstName, lastName } = response;
            localStorage.setItem('userId', id);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            // Redirect to main page
            window.location.href = 'main.html';
        }
    });
});

// signup api
document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        login: document.getElementById('signup-username').value,
        password: document.getElementById('signup-password').value,
        firstName: document.getElementById('signup-firstname').value,
        lastName: document.getElementById('signup-lastname').value,
    };

    makeRequest('Signup', data, (response) => {
        if (response.error)
        {
            showToast("Signup Unseccessful");
        }
        else
        {
            const { id, firstName, lastName } = response;
            localStorage.setItem('userId', id);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            
            showToast("Signup successful! You are now logged in.");
            window.location.href = 'main.html';
        }
    });

});

document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const toggleButton = this;

    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle the icon
    toggleButton.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

