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

  window.addEventListener("DOMContentLoaded", () => {
    setupResponsiveFilter();
    setupCategoryButtons();

    // Show the first tab by default (or "appointment")
    showCategory('schedule');
  });

// Code for handling message icon toggle and close button
    function closeCard(btn) {
    const card = btn.closest('.M-2');
    card.style.display = 'none';
  }

  function toggleMessageInput(icon) {
    const card = icon.closest('.M-2');
    card.classList.toggle('message-active');
  }
