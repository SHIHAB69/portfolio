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

// Scroll Progress Indicator
function initScrollProgress() {
  const progressDots = document.querySelectorAll('.progress-dot');
  const sections = document.querySelectorAll('section');
  
  // Create a map of section IDs to their corresponding dots
  const sectionMap = new Map();
  progressDots.forEach(dot => {
    const sectionId = dot.getAttribute('data-section');
    sectionMap.set(sectionId, dot);
  });
  
  // Add click functionality to dots
  progressDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionId = dot.getAttribute('data-section');
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Update active dot based on scroll position
  function updateActiveSection() {
    let currentSection = '';
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    // Update active dot
    progressDots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    if (currentSection && sectionMap.has(currentSection)) {
      sectionMap.get(currentSection).classList.add('active');
    }
  }
  
  // Listen for scroll events
  window.addEventListener('scroll', updateActiveSection);
  
  // Initialize on page load
  updateActiveSection();
}

// 3D Background System
class Background3D {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        if (!this.canvas) {
            console.error('Canvas not found');
            return;
        }
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        
        this.particles = [];
        this.floatingShapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }
    
    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Setup camera
        this.camera.position.z = 5;
        
        // Create particles
        this.createParticles();
        
        // Create floating shapes
        this.createFloatingShapes();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xff6a00, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    
    createParticles() {
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
            
            const color = new THREE.Color();
            color.setHSL(0.1 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.08,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }
    
    createFloatingShapes() {
        const shapes = [
            { type: 'box', size: 0.4, color: 0xff6a00 },
            { type: 'sphere', size: 0.3, color: 0xff9800 },
            { type: 'torus', size: 0.25, color: 0xffb74d }
        ];
        
        for (let i = 0; i < 8; i++) {
            const shapeData = shapes[i % shapes.length];
            let geometry;
            
            switch (shapeData.type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(shapeData.size, shapeData.size, shapeData.size);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(shapeData.size, 8, 6);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(shapeData.size, shapeData.size * 0.3, 8, 6);
                    break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                transparent: true,
                opacity: 0.3,
                wireframe: true,
                emissive: shapeData.color,
                emissiveIntensity: 0.2
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 12;
            mesh.position.y = (Math.random() - 0.5) * 12;
            mesh.position.z = (Math.random() - 0.5) * 8;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            this.scene.add(mesh);
            this.floatingShapes.push(mesh);
            
            this.animateShape(mesh, i);
        }
    }
    
    animateShape(mesh, index) {
        const duration = 3 + Math.random() * 2;
        const delay = index * 0.5;
        
        gsap.to(mesh.position, {
            y: mesh.position.y + (Math.random() - 0.5) * 2,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI * 2,
            duration: duration * 2,
            delay: delay,
            repeat: -1,
            ease: "none"
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate particles
        this.particles.forEach((particles, index) => {
            particles.rotation.y += 0.002;
            particles.rotation.x += 0.001;
        });
        
        // Rotate floating shapes
        this.floatingShapes.forEach((shape, index) => {
            shape.rotation.x += 0.005;
            shape.rotation.z += 0.003;
        });
        
        // Mouse interaction
        this.camera.position.x += (this.mouseX * 0.02 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY * 0.02 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    handleMouseMove() {
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
  animateOnScroll();
  initScrollProgress();
  
  // Initialize 3D background
  if (typeof THREE !== 'undefined') {
    new Background3D();
  } else {
    console.error('Three.js not loaded');
  }
});


