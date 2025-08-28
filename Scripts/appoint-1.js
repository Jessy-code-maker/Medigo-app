// ===============================
// appoint-1.js
// Script to handle appointment booking system
// Handles date selection, time selection, form validation, and booked doctor display
// ===============================


/* ===============================
   VARIABLE DECLARATIONS
   =============================== */

// Appointment system state
let selectedTime = "";
let currentStartDate = new Date(2025, 7, 14); // August is month 7 (zero-based index)
let selectedDate = new Date(currentStartDate); // clone

// Date-related DOM elements
const selectedDateEl = document.getElementById("selectedDate");
const dateButtonsContainer = document.querySelector(".date-btn");
const leftArrow = document.querySelector(".arrow-btn:first-of-type");
const rightArrow = document.querySelector(".arrow-btn:last-of-type");

// Time-related DOM elements
const timeButtonsContainer = document.querySelector(".time-btns");

// Form-related DOM elements
const preferenceForm = document.getElementById("preferenceForm");
const appointmentDateInput = document.getElementById("appointmentDate");
const appointmentTimeInput = document.getElementById("appointmentTime");

// Doctor booking DOM elements
const bookedDoctorName = document.querySelector("#doctor-name");
const bookedDoctorSpecialty = document.querySelector("#doctor-specialty");
const bookedDoctorImage = document.querySelector('#doctor-image')

// Appointment array (persisted in localStorage)
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];


/* ===============================
   FUNCTION DEFINITIONS
   =============================== */

/**
 * Format a given date as "DD Month YYYY"
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  return `${date.getDate()} ${date.toLocaleString("default", {
    month: "long",
  })} ${date.getFullYear()}`;
}

/**
 * Render a week (Mon–Sun) of date buttons starting from a given date
 * @param {Date} startDate
 */
function renderWeek(startDate) {
  // Clear previous buttons
  dateButtonsContainer.innerHTML = "";
  const DAYS_TO_SHOW = 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const btn = document.createElement("button");
    btn.type = "button"
    const dayName = date.toLocaleDateString("default", { weekday: "short" });
    const dayNum = date.getDate();

    btn.innerHTML = `${dayName}<br>${dayNum}`;
    btn.dataset.date = date.toISOString();

    let isDisabled = false;

    // Disable past dates
    if (date < today) isDisabled = true;

    // Disable weekends
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (dayOfWeek === 0 || dayOfWeek === 6) isDisabled = true;

    // Disable custom dates
    const disabledDates = ["2025-08-15", "2025-08-19"];
    if (disabledDates.includes(date.toISOString().split("T")[0])) {
      isDisabled = true;
    }

    if (isDisabled) {
      btn.classList.add("disabled");
      btn.disabled = true;
    } else {
      // Date button click handler
      btn.addEventListener("click", () => {
        // Remove 'active' from all buttons
        [...dateButtonsContainer.querySelectorAll("button")].forEach((btn) =>
          btn.classList.remove("active")
        );

        // Set selected date and update display
        selectedDate = new Date(date);
        updateSelectedDateDisplay();

        // Highlight clicked button
        btn.classList.add("active");
      });
    }

    // Highlight if it's the selected date
    if (!isDisabled && selectedDate.toDateString() === date.toDateString()) {
      btn.classList.add("active");
    }

    dateButtonsContainer.appendChild(btn);
  }
}

/**
 * Update the visible selected date text and hidden input
 */
function updateSelectedDateDisplay() {
  selectedDateEl.textContent = formatDate(selectedDate);

  if (appointmentDateInput) {
    appointmentDateInput.value = selectedDate.toISOString().split("T")[0];
  }
}

/**
 * Handle booked doctor details from localStorage
 */
function getBookedDoctor() {
  const bookedDoctor = JSON.parse(localStorage.getItem("booked-doctor"));
  if (bookedDoctor) {
    bookedDoctorName.innerText = bookedDoctor.name;
    bookedDoctorSpecialty.innerText = `${bookedDoctor.specialty} specialist`;
    bookedDoctorImage.src = bookedDoctor.image
  }
}

/**
 * Save appointment to localStorage
 */
function saveAppointment() {
  const newAppointment = {
    doctorName: bookedDoctorName.innerText,
    doctorSpecialty: bookedDoctorSpecialty.innerText,
    date: appointmentDateInput.value,
    time: appointmentTimeInput.value,
    status: "active",
  };

  appointments.push(newAppointment);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  console.log("Appointments saved:", appointments);
}

/**
 * Validate appointment form before submission
 * Ensures at least one reminder preference is checked,
 * and that both a date and time are selected
 */
function validateForm(e) {
  e.preventDefault(); // Always prevent default form submission

  const checkboxes = document.querySelectorAll('input[name="reminder"]');
  const isChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);

  const date = appointmentDateInput.value;
  const time = appointmentTimeInput.value;

  if (!isChecked) {
    alert("Please select at least one reminder preference.");
    return;
  }

  if (!date || !time) {
    alert("Please select both a date and time for your appointment.");
    return;
  }

  // ✅ Save appointment to localStorage
  saveAppointment();

  // ✅ If all validations pass, redirect to next page
  window.location.href = "../HTML/appoint-2.html";
}


/* ===============================
   INITIAL SETUP (runs on page load)
   =============================== */
updateSelectedDateDisplay();
renderWeek(currentStartDate);
getBookedDoctor();


/* ===============================
   EVENT LISTENERS
   =============================== */

// Navigation arrows for date selection
leftArrow.addEventListener("click", () => {
  currentStartDate.setDate(currentStartDate.getDate() - 7);
  selectedDate = new Date(currentStartDate);
  updateSelectedDateDisplay();
  renderWeek(currentStartDate);
});

rightArrow.addEventListener("click", () => {
  currentStartDate.setDate(currentStartDate.getDate() + 7);
  selectedDate = new Date(currentStartDate);
  updateSelectedDateDisplay();
  renderWeek(currentStartDate);
});

// Time button selection
timeButtonsContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    [...timeButtonsContainer.querySelectorAll("button")].forEach((btn) =>
      btn.classList.remove("selected")
    );

    e.target.classList.add("selected");
    selectedTime = e.target.textContent.trim();
    appointmentTimeInput.value = selectedTime;
    console.log("Selected time:", selectedTime);
  }
});

// Form submission validation
preferenceForm.addEventListener("submit", validateForm);