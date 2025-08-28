//event listener.
document.querySelector(".login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  // get values entered by the user
  let storedUserName = document.getElementById("user_name").value.trim();
  let storedPassword = document.getElementById("password").value.trim();
  let rememberMe = document.getElementById("remember").checked; // true if box is ticked
  let errorMessages = document.getElementById("erroMsg");


  function displayError(message) {
    errorMessages.textContent = message;
    errorMessages.style.color = "red";
    errorMessages.style.textAlign = "center";
    errorMessages.style.margin = "10px 0";
  }

  function clearError() {
    errorMessages.textContent = "";
  }


  // clears erro if any.
  clearError();

  // check empty username
  if (!storedUserName) {
    displayError("Username is required");
    document.getElementById("user_name").focus();
    return;
  }

  // checks if password is empty
  if (!storedPassword) {
    displayError("Password is required");
    document.getElementById("password").focus();
    return;
  }

  // fetch stored user data from localStorage (set during signup)
  let usersArray = JSON.parse(localStorage.getItem("usersArray")) || [];


  // Try to find a matching user in the array
  let registeredUser = usersArray.find(
    (user) => user.userName === storedUserName && user.userPassword === storedPassword
  );

  // Check if user exists in storage
  if (!registeredUser) {
    displayError("Invalid username or password"); 
    return;
  }
 

  // If login successful
  errorMessages.textContent = "Login successful! Redirecting to profile..."; 
  errorMessages.style.color = "green"; 
  errorMessages.style.textAlign = "center"; 


    // Handle "Remember Me" feature
    if (rememberMe) {
      localStorage.setItem("rememberme", JSON.stringify({ userName: storedUserName }));
    } else {
      localStorage.removeItem("rememberme");
    }

    //  edirects based on stored role.
    setTimeout(() => {
      if (registeredUser.role === "Doctor") {
        window.location.href = "doctorprofile.html";
      } else {
        window.location.href = "profile.html";
      }
    }, 1000);
});


// Pre-fill the login form if "Remember Me" was previously checked
window.addEventListener("load", function () {
  let getRememberMe = JSON.parse(localStorage.getItem("rememberme"));

  if (getRememberMe) {
    document.getElementById("user_name").value = getRememberMe.userName;
    document.getElementById("remember").checked = true; // keep box ticked
  }
});