//phone validation script
// This script checks if the phone number and its confirmation match before form submission.
  document.querySelector('.consultation-form').addEventListener('submit', function (e) {
    const phone = document.getElementById('phone').value;
    const confirm = document.getElementById('phoneconfirm').value;
    if (phone !== confirm) {
      e.preventDefault();
      alert('Phone numbers do not match.');
    }
  });

// File size validation script
// This script checks if the uploaded file size is less than 2MB before form submission.
  document.getElementById('Patient-file').addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      this.value = '';
    }
  });

// Disease-specific heading script
// This script updates the consultation heading based on the disease query parameter in the URL.
  // Get query parameter
  const params = new URLSearchParams(window.location.search);
  const disease = params.get('disease');

  // List of accepted diseases
  const validDiseases = [
    "Diabetes",
    "Hypertension",
    "Asthma",
    "Joint Pain",
    "Migraine",
    "Flu",
    "Skin Rash",
    "Back Pain",
    "Heartburn"
  ];

  // Update heading if valid
  if (disease && validDiseases.includes(disease)) {
    document.getElementById('consult-title').textContent = `${disease}`;
  }

