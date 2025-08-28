     document.querySelectorAll(".each-question").forEach(
      question =>{
        let toggleAnswer = question.querySelector(".questions");

        toggleAnswer.addEventListener("click", ()=>{
          question.classList.toggle("active");
        })
      }
    )

  
let currentIndex = 0;
const carousel = document.getElementById('carousel');
const dots = document.querySelectorAll('.dot');
const totalSlides = document.querySelectorAll('.slide').length;

let startX = 0;
let isDragging = false;
let wasSmallScreen = window.innerWidth <= 768;

// === Update Carousel Position ===
function updateCarousel() {
  const isSmallScreen = window.innerWidth <= 768;

  if (isSmallScreen) {
    carousel.style.transform = 'none';
    dots.forEach(dot => dot.classList.remove('active'));
    return;
  }

  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();

  wasSmallScreen = isSmallScreen;
}

// === Update Active Dot ===
function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  if (dots[currentIndex]) {
    dots[currentIndex].classList.add('active');
  }
}

// === Change Slide Programmatically ===
function goToSlide(index) {
  currentIndex = (index + totalSlides) % totalSlides; // wrap around
  updateCarousel();
}

// === Handle Swipe Start ===
function handleSwipeStart(e) {
  if (window.innerWidth <= 768) return;

  isDragging = true;
  startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
}

// === Optional: Handle Swipe Move (for visual drag) ===
function handleSwipeMove(e) {
  // You can implement visual dragging here if needed
}

// === Handle Swipe End ===
function handleSwipeEnd(e) {
  if (!isDragging || window.innerWidth <= 768) return;

  const endX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
  const diffX = endX - startX;

  if (Math.abs(diffX) > 50) {
    if (diffX < 0) {
      goToSlide(currentIndex + 1); // Swipe left
    } else {
      goToSlide(currentIndex - 1); // Swipe right
    }
  }

  isDragging = false;
}

// === Add Event Listeners ===
// Dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => goToSlide(index));
});

// Swipe - Mouse
carousel.addEventListener('mousedown', handleSwipeStart);
carousel.addEventListener('mousemove', handleSwipeMove);
carousel.addEventListener('mouseup', handleSwipeEnd);
carousel.addEventListener('mouseleave', () => { isDragging = false; });

// Swipe - Touch
carousel.addEventListener('touchstart', handleSwipeStart);
carousel.addEventListener('touchmove', handleSwipeMove);
carousel.addEventListener('touchend', handleSwipeEnd);

// Resize with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateCarousel, 150);
});

// === Initialize ===
updateCarousel();
