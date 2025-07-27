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

// Contact Form Modal Functionality
const hireMeBtn = document.getElementById('hireMe');
const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const closeContactModalBtn = document.getElementById('closeContactModalBtn');
const submitHireMe = document.getElementById('submitHireMe');
const hireMeForm = document.getElementById('hireMeForm');

// Toast Notification Functionality
const toast = document.getElementById('toast');
const toastClose = document.getElementById('toastClose');

// Function to show toast notification
function showToast() {
  toast.classList.add('show');
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideToast();
  }, 5000);
}

// Function to hide toast notification
function hideToast() {
  toast.classList.remove('show');
}

// Function to open contact form modal
function openContactModal() {
  contactModal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close contact form modal
function closeContactModalFunc() {
  contactModal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore background scrolling
  hireMeForm.reset(); // Reset form when closing
}

// Function to handle form submission
function submitHireMeForm() {
  const formData = new FormData(hireMeForm);
  const data = Object.fromEntries(formData);
  
  // Create email body
  const emailBody = `
New Project Inquiry from Portfolio Website

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not specified'}
Phone: ${data.phone || 'Not specified'}

Project Type: ${data.subject}
Budget Range: ${data.budget}
Timeline: ${data.timeline}

Project Details:
${data.message}

---
This inquiry was submitted from your portfolio website.
  `.trim();

  // Create mailto link
  const mailtoLink = `mailto:sihab2305341203@diu.edu.bd?subject=Project Inquiry - ${encodeURIComponent(data.subject)}&body=${encodeURIComponent(emailBody)}`;
  
  // Open email client
  window.open(mailtoLink);
  
  // Close modal
  closeContactModalFunc();
  
  // Show toast notification
  showToast();
}

// Event listeners for contact modal
hireMeBtn.addEventListener('click', openContactModal);
closeContactModal.addEventListener('click', closeContactModalFunc);
closeContactModalBtn.addEventListener('click', closeContactModalFunc);
submitHireMe.addEventListener('click', submitHireMeForm);

// Close contact modal when clicking outside of it
window.addEventListener('click', function(event) {
  if (event.target === contactModal) {
    closeContactModalFunc();
  }
});

// Close contact modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && contactModal.style.display === 'block') {
    closeContactModalFunc();
  }
});

// Toast close button event listener
toastClose.addEventListener('click', hideToast);

// === Modern Scroll-triggered Animations ===
function animateOnScroll() {
  const fadeEls = document.querySelectorAll('.fade-in');
  const staggerEls = document.querySelectorAll('.stagger-item');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  // Staggered animation for grid/list items
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = Array.from(entry.target.querySelectorAll('.stagger-item'));
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 120);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  // Observe parent grids for staggered effect
  document.querySelectorAll('.portfolio-grid, .services-grid').forEach(grid => {
    staggerObserver.observe(grid);
  });
}

window.addEventListener('DOMContentLoaded', animateOnScroll);


