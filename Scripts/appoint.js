// doctors' data
const doctorListData = [
 {
  name: "Dr. Martha",
  specialty: "Cardiology",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Martha.png",
  index: 0
 }, {
  name: "Dr. Smith",
  specialty: "Endocrinology",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Smith.png", 
  index: 1
 }, {
  name: "Dr. Johnson",
  specialty: "Orthopedic",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Johnson.png",
  index: 2
 }, {
  name: "Dr. Garcia",
  specialty: "General Medicine",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Garcia.png",
  index: 3
 }, {
  name: "Dr. Lee",
  specialty: "Cardiology",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Lee.png",
  index: 4
 }, {
  name: "Dr. Kelvin Smith",
  specialty: "Cardiology",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Kelvin Smith.png",
  index: 5
 }, {
  name: "Dr. Mary",
  specialty: "Cardiology",
  location: "Enugu",
  lowestPrice: 300,
  highestPrice: 2500,
  image: "../appoint-doctor/Dr Mary.png",
  index: 6
 }
]


/* ---- VARIABLE DEFINITIONS ---- */
const doctorList = document.querySelector('#doctor-list')
const searchBar = document.querySelector('#search-bar')
const checkBox = document.querySelector('#assign-doctor-checkbox')
const spinner = document.querySelector("#spinner-section")
const paginationArrow = document.querySelectorAll('.page-control-arrow')

// --- PAGINATION ---
// how many doctors per page
const doctorsPerPage = 3
// current page number
let currentPage = 1
// list of doctors currently being shown (updated on search)
//let currentList = doctorListData
// pagination container (add <div id="pagination"></div> in your HTML)
const pagination = document.querySelector("#pagination")



/* ---- RUN ON PAGE LOAD ---- */
renderDoctorList(doctorListData)



/* ---- FUNCTION DEFINITIONS ---- */

// renders the list of doctors on the page
function renderDoctorList(list){
  doctorList.innerHTML = "" // clear existing doctors

  // --- PAGINATION ---
  // calculate start and end index for slicing
  const start = (currentPage - 1) * doctorsPerPage
  const end = start + doctorsPerPage
  const paginatedList = list.slice(start, end)

  paginatedList.forEach((doctor) => {
    const doctorDiv = `
      <div class="doctor" data-department="${doctor.specialty}">
        <div class="doctor-header">
          <p>${doctor.specialty}</p>
          <p class="Price">Price ₦${doctor.lowestPrice} - ₦${doctor.highestPrice}</p>
        </div>  
        <div class="content">
          <div class="content-flex">
            <img class="doctor-img" src="${doctor.image}" alt="${doctor.name}">
            <div class="doctor-text">
              <p class="name">${doctor.name}</p>
              <p class="location">
                <img class="location-img" src="../elements/map-marker.png" alt="location-icon">
                ${doctor.location}
              </p>
            </div>
          </div>  
          <div class="doctor-button">
            <button class="availability-button" data-doctor-index = "${doctor.index}">Check Availability</button>
          </div>
        </div>
      </div>
    `
    doctorList.innerHTML += doctorDiv
  })

  // --- PAGINATION ---
  renderPaginationControls(list.length)
}

// --- PAGINATION ---
// builds page number buttons
function renderPaginationControls(totalItems){
  pagination.innerHTML = "" // clear old controls
  const totalPages = Math.ceil(totalItems / doctorsPerPage)
  
  if (currentPage > totalPages)
  {
   currentPage -= 1
   renderDoctorList(doctorListData)
  } // prevents forward arrow going beyond available pages
  
  else 
  
  {
   for (let i = 1; i <= totalPages; i++){
     const btn = document.createElement("button")
     btn.innerText = i
     btn.className = "pagination-btn"
     
     if (i === currentPage){
      btn.classList.add('active')
     } // ensures only current page shoes active
     
     btn.addEventListener("click", () => {
      currentPage = i
      renderDoctorList(doctorListData)
    })
    pagination.appendChild(btn)
   }
  }
}

// makes the pagination arrow buttons functional
function flipPage(direction){
 if (direction === "<"){
  if (currentPage > 1){
   currentPage -= 1
   renderDoctorList(doctorListData)
  } else {
   renderDoctorList(doctorListData)
  }
 } else {
  currentPage += 1
  renderDoctorList(doctorListData)
 }
}

// makes the search bar functional 
function searchDoctorList(searchTerm){
 const results = doctorListData.filter((doctor)=>{
  if (
   doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
   doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) || 
   doctor.location.toLowerCase().includes(searchTerm.toLowerCase())
  ){return true}
 })
 
 // --- PAGINATION ---
 list = results  // update active list
 currentPage = 1        // reset to first page
 renderDoctorList(list)
}

// makes check availability buttons functional 
function checkAvailability(button){
 button.style.display = "none"
 const randomPick = Math.random()
 loader = document.createElement("div")
 loader.className = "loader"
 parentDiv = button.parentNode
 parentDiv.appendChild(loader)
 setTimeout(() => {
  parentDiv.removeChild(loader)
  if (randomPick < 1/2){
   displayStatus("Available", button)
  } else {
   displayStatus(`<p>Sorry</p> <p>Not available</p>`, button)
  }
 }, 1500)
}

// displays if doctor is available or not
function displayStatus(message, button){
 if (message === "Available"){
  bookingButton = document.createElement('button')
  bookingButton.innerText = "Book appointment "
  bookingButton.className = "booking-button"
  bookingButton.dataset.doctorIndex = button.dataset.doctorIndex
  parentDiv = button.parentNode
  parentDiv.appendChild(bookingButton)
 } 
 else {
  statusMessage = document.createElement('div')
  statusMessage.className = "status-message"
  statusMessage.innerHTML = `${message}`
  parentDiv = button.parentNode
  parentDiv.appendChild(statusMessage)
  setTimeout(() => {
   parentDiv.removeChild(statusMessage)
   button.style.display = "block"
  },1500)
 }
}

// assigns doctor when assign doctor checkbox is checked 
function assignDoctor(checkbox){
  localStorage.removeItem("booked-doctor");
  
  if (checkbox.checked){
    spinner.style.display = "flex";

    setTimeout(() => {
      spinner.style.display = "none";

      // 🎲 randomly pick one doctor from the list
      const randomIndex = Math.floor(Math.random() * doctorListData.length);
      const randomDoctor = doctorListData[randomIndex];

      // save the chosen doctor to localStorage
      localStorage.setItem("booked-doctor", JSON.stringify(randomDoctor));

      // redirect to booking page with assigned doctor
      window.location.href = "../HTML/appoint-1.html";
    }, 2000);
  }
}

// books doctor and saves it to local storage
function bookDoctor(doctorIndex){
 bookedDoctor = doctorListData[doctorIndex]
 localStorage.removeItem("booked-doctor")
 localStorage.setItem("booked-doctor", JSON.stringify(bookedDoctor))
 window.location.href = "../HTML/appoint-1.html"
}

/* ---- EVENT LISTENERS --- */

// event listener for search bar
searchBar.addEventListener("input", (e)=>{
 searchDoctorList(e.target.value)
})

// event listener for check availability button
doctorList.addEventListener("click", (e) => {
 if (e.target.classList.contains("availability-button")) {
  checkAvailability(e.target)
 }
})

// event listener for book appointment button
doctorList.addEventListener("click", (e) => {
 if (e.target.classList.contains("booking-button")) {
  bookDoctor(e.target.dataset.doctorIndex)
 }
})

// event listener for assign doctor checkbox
checkBox.addEventListener("change", (e) => {
 assignDoctor(e.target)
})


// event listener for pagination control arrow
paginationArrow.forEach(arrow => {
  const direction = arrow.innerText
  arrow.addEventListener("click", ()=> {
   flipPage(direction)
  })
})
