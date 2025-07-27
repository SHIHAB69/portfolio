// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  // Optionally, save theme preference to localStorage
  if (body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

// On page load, set theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark');
  }
});

// Contact form handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  // Simple feedback message
  formMessage.textContent = 'Thank you for reaching out! I will get back to you soon.';
  formMessage.style.color = '#ff9800';
  contactForm.reset();
});

// CV Download and Preview Functionality
const downloadCVBtn = document.getElementById('downloadCV');
const previewCVBtn = document.getElementById('previewCV');
const cvModal = document.getElementById('cvModal');
const closeModal = document.getElementById('closeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const downloadFromModal = document.getElementById('downloadFromModal');

// Function to download CV
function downloadCV() {
  const link = document.createElement('a');
  link.href = 'Sihab_CV_2025 v2.pdf';
  link.download = 'Sihab_Howladar_CV_2025.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Function to open CV preview modal
function openCVModal() {
  cvModal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close CV preview modal
function closeCVModal() {
  cvModal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore background scrolling
}

// Event listeners
downloadCVBtn.addEventListener('click', downloadCV);
previewCVBtn.addEventListener('click', openCVModal);
closeModal.addEventListener('click', closeCVModal);
closeModalBtn.addEventListener('click', closeCVModal);
downloadFromModal.addEventListener('click', downloadCV);

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === cvModal) {
    closeCVModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && cvModal.style.display === 'block') {
    closeCVModal();
  }
});


