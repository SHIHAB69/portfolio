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
