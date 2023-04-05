console.log('test');
const preChoice = document.querySelector('.preChoice');
const loginForm = document.querySelector('.loginForm');
const loginButton = document.querySelector('.loginButton');
const registerButton = document.querySelector('.registerButton');

function logIn() {
    preChoice.classList.toggle('displaynone');
    loginForm.classList.toggle('displaynone');
    console.log("test1");
}

loginButton.addEventListener("click", logIn);
registerButton.addEventListener("click", logIn);