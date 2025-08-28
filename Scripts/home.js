	const hamburger = document.querySelector(".hamburger");
	const sideBar= document.querySelector(".sidebar");
	const navBar = document.querySelector(".nav-bar");

hamburger.addEventListener('click', function(){

sideBar.style.display = "flex";
hamburger.style.display ="none"

})

const closeSideBar = document.querySelector(".closeSideBar");
closeSideBar.addEventListener('click', function(){
sideBar.style.display= "none";
hamburger.style.display ="block";


})

const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const dotsNav = document.querySelector('.carousel-nav');
const dots = Array.from(dotsNav.children);

let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;
let currentIndex = 0;

// Set up slide width
function getSlideWidth() {
  return slides[0].getBoundingClientRect().width;
}

// Move to specific slide
function moveToSlide(index) {
  const slideWidth = getSlideWidth();
  currentTranslate = -slideWidth * index;
  prevTranslate = currentTranslate;
  setSliderPosition();
  updateDots(index);
  currentIndex = index;
}

// Update dot indicators
function updateDots(index) {
  dots.forEach(dot => {
    dot.classList.remove('current-dot');
    dot.setAttribute('aria-selected', 'false');
  });
  dots[index].classList.add('current-dot');
  dots[index].setAttribute('aria-selected', 'true');
}

// Touch/mouse drag functions
function touchStart(index) {
  return function(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    track.classList.add('grabbing');
  }
}

function touchMove(event) {
  if (!isDragging) return;
  const currentPosition = getPositionX(event);
  currentTranslate = prevTranslate + currentPosition - startPos;
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  track.classList.remove('grabbing');

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex++;
  }

  if (movedBy > 100 && currentIndex > 0) {
    currentIndex--;
  }

  moveToSlide(currentIndex);
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPosition() {
  track.style.transform = `translateX(${currentTranslate}px)`;
}

// Add event listeners to each slide
slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');

  // Touch events
  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchmove', touchMove);
  slide.addEventListener('touchend', touchEnd);

  // Mouse events
  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mousemove', touchMove);
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', () => {
    if (isDragging) touchEnd();
  });
});

// Dots click events
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    moveToSlide(index);
  });
});

// On resize, reposition
window.addEventListener('resize', () => {
  moveToSlide(currentIndex);
});

// Initial position
moveToSlide(0);
