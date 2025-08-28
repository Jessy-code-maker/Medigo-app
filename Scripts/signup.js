//Adds event listener for form submission
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    let role = document.querySelector('input[name="role"]:checked');

    // getting values from input fields
    let userName = document.getElementById("name").value.trim();
    let userEmail = document.getElementById("email").value.trim();
    let userNumber = document.querySelector('#phone').value.trim();
    let userPassword = document.getElementById("password").value.trim();
    let userConfirmPassword = document.getElementById("confirm-password").value.trim();
    let erroMessage = document.getElementById("erroMsg");

    function displayError(message) {
        erroMessage.textContent = message;
        erroMessage.style.color = "red";
        erroMessage.style.textAlign = "center";
        erroMessage.style.margin = "10px 0";
    }

    function clearError() {
        erroMessage.textContent = "";
    }

    //checks if a role was selected.
    if (!role) {
        displayError("Please select a role (Patient or Doctor)");
        return;
    }

    let userNameRegex = /^[A-Z][a-z]+(?: [A-Z][a-z]+)+$/; 
    let userEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let userPasswordRegex = /^.{5,}$/; // ≥5 characters
    let userNumberRegex = /^(?:\+234|234|0)(70|80|81|90|91|701|702|703|704|705|706|707|708|709|810|811|812|813|814|815|816|817|818|819|901|902|903|904|905|906|907|908|909|911)\d{6,7}$/;

    // Validate name
    if (!userName) {
        displayError("Name is required");
        document.getElementById("name").focus();
        return;
    } else if (!userNameRegex.test(userName)) {
        displayError("Please enter full name (e.g., Tony Eze)");
        document.getElementById("name").focus();
        return;
    }

    // Validate Email
    if (!userEmail) {
        displayError("Email is required");
        document.getElementById("email").focus();
        return;
    } else if (!userEmailRegex.test(userEmail)) {
        displayError("Please enter a valid email address");
        document.getElementById("email").focus();
        return;
    }

    // Validate Phone
    if (!userNumber) {
        displayError("Phone number is required");
        document.getElementById("phone").focus();
        return;
    } else if (!userNumberRegex.test(userNumber)) {
        displayError("Please enter a valid Nigerian phone number");
        document.getElementById("phone").focus();
        return;
    }

    // Validate Password
    if (!userPassword) {
        displayError("Password is required");
        document.getElementById("password").focus();
        return;
    } else if (!userPasswordRegex.test(userPassword)) {
        displayError("Password must be more than 4 characters");
        document.getElementById("password").focus();
        return;
    }

    // Validate Confirm Password
    if (!userConfirmPassword) {
        displayError("Confirm password is required");
        document.getElementById("confirm-password").focus();
        return;
    } else if (userConfirmPassword !== userPassword) {
        displayError("Passwords do not match");
        document.getElementById("confirm-password").focus();
        return;
    }

    // ✅ Validate Terms & Conditions
    let termsChecked = document.getElementById("terms").checked;
    if (!termsChecked) {
        displayError("You must agree to the Terms and Conditions before signing up");
        document.getElementById("terms").focus();
        return;
    }

    // Clear error if everything passed
    clearError();

    let newUserData = {
        userName: userName,
        userEmail: userEmail,
        userNumber: userNumber,
        userPassword: userPassword,
        role: role.value 
    };

    let usersArray = JSON.parse(localStorage.getItem("usersArray")) || [];
    usersArray.push(newUserData);
    localStorage.setItem("usersArray", JSON.stringify(usersArray));

    erroMessage.textContent = "Signup successful! Redirecting to login...";
    erroMessage.style.color = "green";
    erroMessage.style.textAlign = "center";
    erroMessage.style.margin = "10px 0";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);
});