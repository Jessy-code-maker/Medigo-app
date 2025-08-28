// Expiry Check (24hrs) 
function checkDataExpiry() {
  const lastSaved = localStorage.getItem("lastSavedTime");
  const now = Date.now();

  if (!lastSaved || (now - parseInt(lastSaved, 10)) > 24 * 60 * 60 * 1000) {
    // More than 24hrs passed → clear storage
    localStorage.removeItem("appointments");
    localStorage.removeItem("medications");
  }

  // Always update timestamp
  localStorage.setItem("lastSavedTime", now.toString());
}

//code for handling tab navigation and responsive dropdown filtering
function showCategory(category, event = null) {
  const allTabs = document.querySelectorAll('.tab');
  const buttons = document.querySelectorAll('.category-nav button');

  // Show the matching tab and hide the others
  allTabs.forEach(tab => {
    tab.style.display = tab.dataset.category === category ? 'block' : 'none';
  });

  // Highlight the active button
  buttons.forEach(btn => btn.classList.remove('active'));
  if (event && event.target && event.target.tagName === 'BUTTON') {
    event.target.classList.add('active');
  }

  // Sync dropdown selection
  const select = document.getElementById('category-select');
  if (select && select.value !== category) {
    select.value = category;
  }
}

function filterByDropdown() {
  const selectedCategory = document.getElementById('category-select').value;
  showCategory(selectedCategory);
}

function setupResponsiveFilter() {
  const categorySelect = document.getElementById("category-select");
  const mediaQuery = window.matchMedia("(max-width: 768px)");

  function handleScreenChange(e) {
    if (e.matches) {
      categorySelect.addEventListener("change", filterByDropdown);
      filterByDropdown();
    } else {
      categorySelect.removeEventListener("change", filterByDropdown);
    }
  }

  handleScreenChange(mediaQuery);
  mediaQuery.addEventListener("change", handleScreenChange);
}

function setupCategoryButtons() {
  const buttons = document.querySelectorAll(".category-nav button");
  buttons.forEach(button => {
    if (!button.dataset.listenerAttached) {
      button.addEventListener("click", (event) => {
        const category = button.getAttribute("data-category");
        showCategory(category, event);
      });
      button.dataset.listenerAttached = "true";
    }
  });
}

// Toggle edit mode for profile
function toggleEditSave(button) {
  const displayElements = document.querySelectorAll('.display-only');
  const editableElements = document.querySelectorAll('.editable');
  const isEditing = button.textContent === "Edit Profile";

  // Toggle visibility
  displayElements.forEach(el => el.style.display = isEditing ? 'none' : 'block');
  editableElements.forEach(el => el.style.display = isEditing ? 'block' : 'none');

  if (isEditing) {
    button.textContent = "Save Profile";
  } else {
    // Update display fields with form values
    document.getElementById('out-name').textContent = document.getElementById('name').value;
    document.getElementById('out-healthID').textContent = document.getElementById('health-ID').value;
    document.getElementById('out-gender').textContent = document.getElementById('gender').value;
    document.getElementById('out-age').textContent = document.getElementById('age').value;
    document.getElementById('out-bloodGroup').textContent = document.getElementById('bloodGroup').value;
    button.textContent = "Edit Profile";
  }
}

// APPOINTMENTS

function formatDate(date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

//Array of Appointments
function loadAppointments() {
  const stored = JSON.parse(localStorage.getItem("appointments"));
  if (!stored || stored.length === 0) {
    return [
      { doctor: "Dr. Garcia Joseph", spec: "Medical Consultation", date: "20/08/2025", time: "14:00", status: "Upcoming", joinLink: "https://zoom.us/j/111111111" },
      { doctor: "Dr. Lee", spec: "Cardiology", date: "11/07/2025", time: "15:00", status: "Upcoming", joinLink: "https://meet.google.com/lee-123" },
      { doctor: "Dr. Smith", spec: "Dermatology", date: "05/09/2025", time: "10:30", status: "Upcoming", joinLink: "https://teams.microsoft.com/l/dermatology" },
      { doctor: "Dr. Angela White", spec: "Neurology", date: "28/06/2025", time: "09:00", status: "Cancelled", joinLink: "https://zoom.us/j/444444444" },
      { doctor: "Dr. Thompson", spec: "Orthopedics", date: "10/10/2025", time: "16:45", status: "Completed", joinLink: "https://meet.google.com/ortho-789" }
    ];
  }
  return stored;
}

// Persist to local storage
function saveAppointments(appts) {
  localStorage.setItem("appointments", JSON.stringify(appts));
}

// Loop through the array and pass each object into the appointment table
function renderAppointments() {
  const appts = loadAppointments();

  // Dynamic TABLE
  const tbody = document.querySelector(".tab[data-category='appointment'] tbody");
  tbody.innerHTML = "";
  appts.forEach(appt => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="../profile-doctor/lee.png"><p>${appt.doctorName}</p></td>
      <td>${appt.doctorSpecialty}</td>
      <td>${appt.date}</td>
      <td>${appt.time}</td>
      <td><div class="stat-indicator-${appt.status.toLowerCase()}">${appt.status}</div></td>
    `;
    tbody.appendChild(row);
  });

  // ==== UPCOMING APPOINTMENT CARD (displays only earliest appointments) ====
  const upcomingContainer = document.querySelector(".upcoming-list");
  upcomingContainer.innerHTML = "";

  const upcoming = appts
    .filter(a => a.status === "Upcoming")
    .sort((a, b) => {
      const [d1, m1, y1] = a.date.split("/").map(Number);
      const [d2, m2, y2] = b.date.split("/").map(Number);
      const t1 = new Date(y1, m1 - 1, d1, ...a.time.split(":").map(Number));
      const t2 = new Date(y2, m2 - 1, d2, ...b.time.split(":").map(Number));
      return t1 - t2;
    })[0]; // take only the first (earliest one)
  
  // Condition to handle how upcoming appointments are displayed  
  if (upcoming) {
    const card = document.createElement("div");
    card.className = "U-App-1";
    card.innerHTML = `
      <div class="card-container">
        <div class="image-holder">
          <img src="../profile-doctor/doctor 1.png" alt="doctor profile-picture">
        </div>
        <div class="text-holder">
          <h3>${upcoming.doctor}</h3>
          <p>${upcoming.spec}</p>
          <p>Online - Video Consultation <br>${upcoming.date} ${upcoming.time}</p>
        </div>
      </div>
      <div class="U-App-btn-container">
        <button class="join-btn" data-link="${upcoming.joinLink}">Join Consultation</button>
        <button class="U-App-btn">Reschedule</button>
        <button class="U-App-btn-cancel">Cancel</button>
      </div>
    `;
    upcomingContainer.appendChild(card);
  } else {
    // No upcoming appointments
    upcomingContainer.innerHTML = "<p class='no-upcoming'>No upcoming appointment.</p>";
  }


  // reattach button handlers
  setupAppointmentButtons();
}

// Upcoming appointments buttons handler
function setupAppointmentButtons() {
  // Reschedule
  document.querySelectorAll(".U-App-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".U-App-1, .U-App-2, .U-App-3");
      let dateInput = parent.querySelector(".reschedule-input");

      if (!dateInput) {
        // Show input for first time
        dateInput = document.createElement("input");
        dateInput.type = "datetime-local";
        dateInput.className = "reschedule-input";

        btn.insertAdjacentElement("afterend", dateInput);
        btn.textContent = "Confirm";
      } else {
        // Confirm new date/time
        if (dateInput.value) {
          const date = new Date(dateInput.value);
          const newDate = formatDate(date);
          const newTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Update UI
          const textHolder = parent.querySelector(".text-holder p:last-of-type");
          textHolder.innerHTML = `Online - Video Consultation <br>${newDate} ${newTime}`;

          // Save change
          const appts = loadAppointments();
          const doctorName = parent.querySelector("h3").textContent;
          const appt = appts.find(a => a.doctor === doctorName && a.status === "Upcoming");
          if (appt) {
            appt.date = newDate;
            appt.time = newTime;
          }
          saveAppointments(appts);
          renderAppointments();
        }

        // remove input
        dateInput.remove();
        btn.textContent = "Reschedule";
      }
    });
  });

  // Cancel (custom modal)
  document.querySelectorAll(".U-App-btn-cancel").forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById("cancelModal");
      modal.style.display = "flex";

      // Handle confirmation
      const confirmBtn = document.getElementById("confirmCancel");
      const closeBtn = document.getElementById("closeModal");

      // Avoid multiple event stacking
      confirmBtn.onclick = () => {
        const parent = btn.closest(".U-App-card");
        const btnContainer = parent.querySelector(".U-App-btn-container");

        btnContainer.innerHTML = "<p class='cancelled-text'>Cancelled</p><button class='U-App-btn-undo'>Undo</button>";

        const appts = loadAppointments();
        const doctorName = parent.querySelector("h3").textContent;
        const appt = appts.find(a => a.doctor === doctorName);
        if (appt) {
          appt.status = "Canceled";
          saveAppointments(appts);
        }
        renderAppointments();

        modal.style.display = "none";
      };

      closeBtn.onclick = () => {
        modal.style.display = "none";
      };
    });
  });

  // Join Consultation
  document.querySelectorAll(".join-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const link = btn.dataset.link || "https://zoom.us";
      window.open(link, "_blank");
    });
  });
}


// MEDICATION
function setupMedicationCheckboxes() {
  const medCheckboxes = document.querySelectorAll(".confirmSubmit");

  // Load saved state
  const saved = JSON.parse(localStorage.getItem("medications")) || {};

  medCheckboxes.forEach((checkbox, index) => {
    const label = checkbox.closest("label");

    // Use index as ID (in case medication names change)
    const medId = `med-${index}`;

    // Restore saved state
    if (saved[medId]) {
      checkbox.checked = true;
      // Return "Taken" when checkbox is checked
      if (!label.querySelector(".taken-label")) {
        const taken = document.createElement("span");
        taken.textContent = "Taken ";
        taken.className = "taken-label";
        label.insertBefore(taken, checkbox);
      }
    }

    // On change, update UI + save state
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        if (!label.querySelector(".taken-label")) {
          const taken = document.createElement("span");
          taken.textContent = "Taken ";
          taken.className = "taken-label";
          taken.style.color = "green"
          label.insertBefore(taken, checkbox);
        }
        saved[medId] = true;
      } else {
        const taken = label.querySelector(".taken-label");
        if (taken) taken.remove();
        saved[medId] = false;
      }
      localStorage.setItem("medications", JSON.stringify(saved));
    });
  });
}


// INIT
window.addEventListener("DOMContentLoaded", () => {
  checkDataExpiry(); // 🔥 run expiry check first

  setupResponsiveFilter();
  setupCategoryButtons();

  showCategory("appointment");
  document.querySelector(".category-nav .appointment").classList.add("active");

  renderAppointments();
  setupMedicationCheckboxes();
});

