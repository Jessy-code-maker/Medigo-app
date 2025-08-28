//modal reciept
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent actual form submission

    // Show the modal
    document.getElementById('receipt-modal').style.display = 'block';
  });

  // Close modal
  document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('receipt-modal').style.display = 'none';
  });

  // Optional: close modal on outside click
  window.addEventListener('click', function (e) {
    const modal = document.getElementById('receipt-modal');
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
