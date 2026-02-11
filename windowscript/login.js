// const { ipcRenderer } = require("electron");

const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");
const label = document.getElementById("label");
const errorMessage = document.getElementById("error_message");
const loginBtn = document.getElementById("login_btn");

// console.log(navigator.onLine);

form.addEventListener("submit", async (e) => {
  let errors = [];

  errors = getLoginFormErrors(email.value, password.value);

  if (errors.length > 0) {
    e.preventDefault();
    errorMessage.innerText = errors.join(". ");
  } else {
    loginBtn.classList.remove("bg-blue-700");
    loginBtn.classList.add("bg-gray-500");
    const data = { email: email.value, password: password.value };
    window.electronApi.ipcSend("login-user", data);
  }
});

function getLoginFormErrors(emaill, passwordd) {
  let errors = [];

  if (emaill === "" || emaill === null) {
    errors.push("Email is required");
    email.classList.add("border-red-600");
  }
  if (passwordd === "" || passwordd === null) {
    errors.push("Password is required");
    password.classList.add("border-red-600");
  }

  return errors;
}

const allInputs = [email, password];

allInputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.classList.contains("border-red-600")) {
      input.classList.remove("border-red-600");
      errorMessage.innerText = "";
    }
  });
});

// window.electronApi.ipcReceive("get-all-products", async (event, data) => {
//   console.log("here in login baby");
//   console.log(data);

// });
