  // Check login status
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // If not logged in, change links and buttons
  if (!isLoggedIn) {
    // Change all <a> tags that are not for about-us or signup
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      // If href exists and does not contain about-us.html and does not contain indexSignUp.html, change to index.html
      if (href && !href.includes('about-us.html') && !href.includes('indexSignUp.html')) {
        link.setAttribute('href', 'index.html');
      }
    });

    // Handle Sign up buttons
    const signUpButtons = document.querySelectorAll('button');
    signUpButtons.forEach(button => {
      if (button.textContent.trim() === 'Sign up') {
        button.onclick = function() {
          window.location.href = 'indexSignUp.html';
        };
      }
    });

    // Handle Login buttons
    const loginButtons = document.querySelectorAll('button');
    loginButtons.forEach(button => {
      if (button.textContent.trim() === 'Login') {
        button.onclick = function() {
          window.location.href = 'index.html';
        };
      }
    });
  } else {
    // User is logged in
    // Set Book Appointment links to appoint.html
    const bookAppointmentLinks = document.querySelectorAll('a');
    bookAppointmentLinks.forEach(link => {
      if (link.textContent.trim() === 'Book Appointment') {
        link.setAttribute('href', 'appoint.html');
      }
    });

    // Set Consult Online links to Thealth.html
    const consultOnlineLinks = document.querySelectorAll('a');
    consultOnlineLinks.forEach(link => {
      if (link.textContent.trim() === 'Consult Online') {
        link.setAttribute('href', 'Thealth.html');
      }
    });
    
    // Keep signup and login buttons functional even when logged in
    const signUpButtons = document.querySelectorAll('button');
    signUpButtons.forEach(button => {
      if (button.textContent.trim() === 'Sign up') {
        button.onclick = function() {
          window.location.href = 'indexSignUp.html';
        };
      }
    });

    const loginButtons = document.querySelectorAll('button');
    loginButtons.forEach(button => {
      if (button.textContent.trim() === 'Login') {
        button.onclick = function() {
          window.location.href = 'index.html';
        };
      }
    });
  }

  // Handle logout link
  const logoutLinks = document.querySelectorAll('a[href*="index.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.trim() === 'Log-out') {
      link.onclick = function() {
        localStorage.setItem("isLoggedIn", "false");
        // The href will navigate to index.html anyway
      };
    }
  });