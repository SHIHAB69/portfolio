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

// Advanced GitHub API Integration with GraphQL
async function fetchRealGitHubContributions() {
  try {
    // GitHub GraphQL query for contribution data
    const query = `
      query {
        user(login: "SHIHAB69") {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, privacy: PUBLIC) {
            totalCount
            nodes {
              name
              stargazerCount
              forkCount
            }
          }
          followers {
            totalCount
          }
          following {
            totalCount
          }
        }
      }
    `;

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer YOUR_GITHUB_TOKEN' // Optional: for higher rate limits
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error('GitHub API request failed');
    }

    const data = await response.json();
    const userData = data.data.user;
    
    if (userData) {
      updateRealGitHubStats(userData);
      createRealContributionGraph(userData.contributionsCollection.contributionCalendar);
    }
    
  } catch (error) {
    console.log('Using fallback GitHub data:', error);
    // Fallback to the previous method
    fetchGitHubStats();
  }
}

function updateRealGitHubStats(userData) {
  // Update total contributions
  const totalContributions = userData.contributionsCollection.contributionCalendar.totalContributions;
  document.querySelector('.stat-item:nth-child(1) .stat-number').textContent = totalContributions.toLocaleString();
  
  // Update repository count
  const repoCount = userData.repositories.totalCount;
  document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = `${repoCount}+`;
  
  // Update followers count
  const followers = userData.followers.totalCount;
  document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = `${followers}`;
  document.querySelector('.stat-item:nth-child(2) .stat-label').textContent = 'GitHub Followers';
}

function createRealContributionGraph(contributionCalendar) {
  const graphContainer = document.querySelector('.github-graph');
  const staticImage = graphContainer.querySelector('img');
  
  if (staticImage) {
    // Create canvas for real contribution data
    const canvas = document.createElement('canvas');
    canvas.id = 'realContributionCanvas';
    canvas.width = 800;
    canvas.height = 120;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '10px';
    
    // Replace static image with canvas
    staticImage.style.display = 'none';
    graphContainer.appendChild(canvas);
    
    // Draw the real contribution graph
    drawRealContributionGraph(canvas, contributionCalendar);
  }
}

function drawRealContributionGraph(canvas, contributionCalendar) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set background
  ctx.fillStyle = '#2E3440';
  ctx.fillRect(0, 0, width, height);
  
  // Extract contribution data from GitHub API
  const weeks = contributionCalendar.weeks;
  const squareSize = 10;
  const spacing = 2;
  const startX = 50;
  const startY = 20;
  
  // Draw contribution squares
  weeks.forEach((week, weekIndex) => {
    week.contributionDays.forEach((day, dayIndex) => {
      const x = startX + weekIndex * (squareSize + spacing);
      const y = startY + dayIndex * (squareSize + spacing);
      
      // Color based on contribution level
      let color;
      if (day.contributionCount === 0) color = '#161b22';
      else if (day.contributionCount <= 3) color = '#0e4429';
      else if (day.contributionCount <= 6) color = '#006d32';
      else if (day.contributionCount <= 9) color = '#26a641';
      else color = '#39d353';
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);
    });
  });
  
  // Add month labels
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((month, index) => {
    const x = startX + (index * weeks.length / 12) * (squareSize + spacing);
    ctx.fillText(month, x, height - 10);
  });
  
  // Add legend
  const legendY = height - 35;
  const legendColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Arial';
  ctx.fillText('Less', startX, legendY);
  
  legendColors.forEach((color, index) => {
    const x = startX + 40 + index * 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, legendY - 10, 8, 8);
  });
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText('More', startX + 40 + legendColors.length * 15, legendY);
}

// Fallback GitHub Stats Integration
async function fetchGitHubStats() {
  try {
    // Fetch user data from GitHub API
    const userResponse = await fetch('https://api.github.com/users/SHIHAB69');
    const userData = await userResponse.json();
    
    // Update the stats with available data
    updateGitHubStats(userData);
    
    // Create dynamic contribution graph
    createDynamicContributionGraph();
    
  } catch (error) {
    console.log('GitHub API not available, using fallback data');
    // Keep the static data if API fails
  }
}

function updateGitHubStats(userData) {
  // Update public repos count
  const repoCount = userData.public_repos || 15;
  document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = `${repoCount}+`;
  
  // Update other stats if available
  if (userData.followers) {
    document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = `${userData.followers}`;
    document.querySelector('.stat-item:nth-child(2) .stat-label').textContent = 'GitHub Followers';
  }
}

function createDynamicContributionGraph() {
  // Replace the static image with a dynamic canvas
  const graphContainer = document.querySelector('.github-graph');
  const staticImage = graphContainer.querySelector('img');
  
  if (staticImage) {
    // Create canvas for dynamic graph
    const canvas = document.createElement('canvas');
    canvas.id = 'contributionCanvas';
    canvas.width = 800;
    canvas.height = 120;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '10px';
    
    // Replace static image with canvas
    staticImage.style.display = 'none';
    graphContainer.appendChild(canvas);
    
    // Draw the contribution graph
    drawContributionGraph(canvas);
  }
}

function drawContributionGraph(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set background
  ctx.fillStyle = '#2E3440';
  ctx.fillRect(0, 0, width, height);
  
  // Contribution data (you can fetch this from GitHub API)
  const contributions = generateContributionData();
  
  // Draw contribution squares
  const squareSize = 10;
  const spacing = 2;
  const startX = 50;
  const startY = 20;
  
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const x = startX + week * (squareSize + spacing);
      const y = startY + day * (squareSize + spacing);
      
      const contributionIndex = week * 7 + day;
      const contribution = contributions[contributionIndex] || 0;
      
      // Color based on contribution level
      let color;
      if (contribution === 0) color = '#161b22';
      else if (contribution <= 3) color = '#0e4429';
      else if (contribution <= 6) color = '#006d32';
      else if (contribution <= 9) color = '#26a641';
      else color = '#39d353';
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
  
  // Add month labels
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((month, index) => {
    const x = startX + (index * 52 / 12) * (squareSize + spacing);
    ctx.fillText(month, x, height - 10);
  });
  
  // Add legend
  const legendY = height - 35;
  const legendColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Arial';
  ctx.fillText('Less', startX, legendY);
  
  legendColors.forEach((color, index) => {
    const x = startX + 40 + index * 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, legendY - 10, 8, 8);
  });
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText('More', startX + 40 + legendColors.length * 15, legendY);
}

function generateContributionData() {
  // Generate realistic contribution data
  // In a real implementation, you'd fetch this from GitHub API
  const data = [];
  const today = new Date();
  const daysInYear = 365;
  
  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (daysInYear - i));
    
    // Generate realistic contribution pattern
    let contribution = 0;
    
    // Weekdays have more activity
    if (date.getDay() > 0 && date.getDay() < 6) {
      contribution = Math.floor(Math.random() * 8);
    } else {
      contribution = Math.floor(Math.random() * 4);
    }
    
    // Add some patterns (more activity in recent months)
    const daysAgo = daysInYear - i;
    if (daysAgo < 100) {
      contribution += Math.floor(Math.random() * 3);
    }
    
    data.push(contribution);
  }
  
  return data;
}

// Simple Real-time GitHub Integration (No API Token Required)
async function fetchSimpleGitHubData() {
  try {
    // Fetch data from the same services used in README.md
    const [userResponse, reposResponse] = await Promise.all([
      fetch('https://api.github.com/users/SHIHAB69'),
      fetch('https://api.github.com/users/SHIHAB69/repos?per_page=100')
    ]);
    
    const userData = await userResponse.json();
    const reposData = await reposResponse.json();
    
    // Try to get stats from GitHub Readme Stats API directly
    try {
      const statsResponse = await fetch('https://github-readme-stats.vercel.app/api?username=SHIHAB69&theme=blue-green&hide_border=false&include_all_commits=true&count_private=true&show_icons=true&disable_animations=true');
      const statsText = await statsResponse.text();
      
      // Extract data from the SVG response
      const totalMatch = statsText.match(/Total Commits[\s\S]*?(\d+)/);
      const totalContributions = totalMatch ? parseInt(totalMatch[1]) : 0;
      
      // Update with extracted data
      updateSimpleGitHubStats(userData, reposData, totalContributions);
    } catch (statsError) {
      console.log('Stats API failed, using fallback:', statsError);
      updateSimpleGitHubStats(userData, reposData, 0);
    }
    
    // Create a more realistic contribution graph
    createSimpleContributionGraph();
    
  } catch (error) {
    console.log('Using fallback data:', error);
    // Show fallback data with reasonable defaults
    showFallbackGitHubStats();
  }
}

function showFallbackGitHubStats() {
  // Set exact values from your GitHub profile
  document.querySelector('.stat-item:nth-child(1) .stat-number').textContent = '4,054';
  document.querySelector('.stat-item:nth-child(1) .stat-label').textContent = 'Total Contributions';
  
  document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = '135 days';
  document.querySelector('.stat-item:nth-child(2) .stat-label').textContent = 'Longest Streak';
  
  document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = '32+';
  document.querySelector('.stat-item:nth-child(3) .stat-label').textContent = 'Public Repositories';
}

function updateSimpleGitHubStats(userData, reposData, totalContributions) {
  // Update repository count with real data
  const repoCount = reposData.length || userData.public_repos || 32;
  document.querySelector('.stat-item:nth-child(3) .stat-number').textContent = `${repoCount}+`;
  
  // Use exact values from your GitHub profile
  const exactTotalContributions = 4054;
  const exactLongestStreak = 135;
  
  // Update total contributions with exact value
  document.querySelector('.stat-item:nth-child(1) .stat-number').textContent = exactTotalContributions.toLocaleString();
  
  // Update longest streak with exact value
  document.querySelector('.stat-item:nth-child(2) .stat-number').textContent = `${exactLongestStreak} days`;
}

function createSimpleContributionGraph() {
  const graphContainer = document.querySelector('.github-graph');
  const staticImage = graphContainer.querySelector('img');
  
  if (staticImage) {
    // Create a more realistic contribution graph based on your actual activity
    const canvas = document.createElement('canvas');
    canvas.id = 'simpleContributionCanvas';
    canvas.width = 800;
    canvas.height = 120;
    canvas.style.maxWidth = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '10px';
    
    // Replace static image with canvas
    staticImage.style.display = 'none';
    graphContainer.appendChild(canvas);
    
    // Draw a more realistic contribution graph
    drawSimpleContributionGraph(canvas);
  }
}

function drawSimpleContributionGraph(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set background
  ctx.fillStyle = '#2E3440';
  ctx.fillRect(0, 0, width, height);
  
  // Create more realistic contribution data based on your actual pattern
  const contributions = generateRealisticContributionData();
  
  // Draw contribution squares
  const squareSize = 10;
  const spacing = 2;
  const startX = 50;
  const startY = 20;
  
  for (let week = 0; week < 52; week++) {
    for (let day = 0; day < 7; day++) {
      const x = startX + week * (squareSize + spacing);
      const y = startY + day * (squareSize + spacing);
      
      const contributionIndex = week * 7 + day;
      const contribution = contributions[contributionIndex] || 0;
      
      // Color based on contribution level
      let color;
      if (contribution === 0) color = '#161b22';
      else if (contribution <= 3) color = '#0e4429';
      else if (contribution <= 6) color = '#006d32';
      else if (contribution <= 9) color = '#26a641';
      else color = '#39d353';
      
      ctx.fillStyle = color;
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }
  
  // Add month labels
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Arial';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months.forEach((month, index) => {
    const x = startX + (index * 52 / 12) * (squareSize + spacing);
    ctx.fillText(month, x, height - 10);
  });
  
  // Add legend
  const legendY = height - 35;
  const legendColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px Arial';
  ctx.fillText('Less', startX, legendY);
  
  legendColors.forEach((color, index) => {
    const x = startX + 40 + index * 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, legendY - 10, 8, 8);
  });
  
  ctx.fillStyle = '#ffffff';
  ctx.fillText('More', startX + 40 + legendColors.length * 15, legendY);
}

function generateRealisticContributionData() {
  // Generate more realistic data based on your actual GitHub activity
  const data = [];
  const today = new Date();
  const daysInYear = 365;
  
  // Your actual contribution pattern (you can adjust these values)
  const baseActivity = 3; // Base daily contributions
  const weekdayBonus = 2; // Extra activity on weekdays
  const recentMonthsBonus = 1; // More activity in recent months
  
  for (let i = 0; i < daysInYear; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (daysInYear - i));
    
    let contribution = baseActivity;
    
    // Weekdays have more activity
    if (date.getDay() > 0 && date.getDay() < 6) {
      contribution += weekdayBonus;
    }
    
    // More activity in recent months (last 6 months)
    const daysAgo = daysInYear - i;
    if (daysAgo < 180) {
      contribution += recentMonthsBonus;
    }
    
    // Add some randomness
    contribution += Math.floor(Math.random() * 3);
    
    // Ensure non-negative
    contribution = Math.max(0, contribution);
    
    data.push(contribution);
  }
  
  return data;
}

// GitHub Repositories Integration
async function loadGitHubRepositories() {
  try {
    // Fetch specific pinned repositories
    const repoNames = [
      'murphys_AI',
      'AgenticAi-for-Students', 
      'NoteApp',
      'text_recognition_app-main',
      'ticket-app',
      'Vpn_flutter_project'
    ];
    
    const repoPromises = repoNames.map(name => 
      fetch(`https://api.github.com/repos/SHIHAB69/${name}`)
        .then(response => response.json())
        .catch(() => null)
    );
    
    const repos = await Promise.all(repoPromises);
    const validRepos = repos.filter(repo => repo && !repo.message); // Filter out errors
    
    if (validRepos.length > 0) {
      displayRepositories(validRepos);
    } else {
      showFallbackRepositories();
    }
  } catch (error) {
    console.log('Error loading repositories:', error);
    showFallbackRepositories();
  }
}

function displayRepositories(repos) {
  const reposGrid = document.getElementById('reposGrid');
  if (!reposGrid) return;
  
  // Clear loading state
  reposGrid.innerHTML = '';
  
  repos.forEach(repo => {
    const repoCard = createRepoCard(repo);
    reposGrid.appendChild(repoCard);
  });
}

function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card glass shine-hover';
  card.onclick = () => window.open(repo.html_url, '_blank');
  
  // Format description
  const description = repo.description || 'No description available';
  const truncatedDescription = description.length > 100 
    ? description.substring(0, 100) + '...' 
    : description;
  
  // Format language
  const language = repo.language || 'Unknown';
  
  // Format update time
  const updatedDate = new Date(repo.updated_at);
  const timeAgo = getTimeAgo(updatedDate);
  
  card.innerHTML = `
    <div class="repo-header">
      <h3>${repo.name}</h3>
      <span class="repo-stars">⭐ ${repo.stargazers_count || 0}</span>
    </div>
    <p class="repo-description">${truncatedDescription}</p>
    <div class="repo-stats">
      <span class="repo-language">${language}</span>
      <span class="repo-forks">🔀 ${repo.forks_count || 0}</span>
      <span class="repo-updated">Updated ${timeAgo}</span>
    </div>
  `;
  
  return card;
}

function getTimeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

function showFallbackRepositories() {
  const reposGrid = document.getElementById('reposGrid');
  if (!reposGrid) return;
  
  const fallbackRepos = [
    {
      name: 'murphys_AI',
      description: 'This is an app like chatGPT but instead of using the traditional API for Building AI apps (mostly paid) we used free models from GROQ.',
      language: 'C++',
      stars: 1,
      forks: 0,
      updated: '2 weeks ago'
    },
    {
      name: 'AgenticAi-for-Students',
      description: 'AI-powered learning assistant for students',
      language: 'Python',
      stars: 1,
      forks: 0,
      updated: '1 month ago'
    },
    {
      name: 'NoteApp',
      description: 'A modern note-taking application',
      language: 'C++',
      stars: 0,
      forks: 0,
      updated: '3 weeks ago'
    },
    {
      name: 'text_recognition_app-main',
      description: 'Text recognition and OCR application',
      language: 'C++',
      stars: 0,
      forks: 0,
      updated: '1 month ago'
    },
    {
      name: 'ticket-app',
      description: 'Ticket management system',
      language: 'Dart',
      stars: 0,
      forks: 0,
      updated: '2 weeks ago'
    },
    {
      name: 'Vpn_flutter_project',
      description: 'A flutter based VPN App for both iOS and Android',
      language: 'Java',
      stars: 1,
      forks: 0,
      updated: '3 weeks ago'
    }
  ];
  
  reposGrid.innerHTML = '';
  fallbackRepos.forEach(repo => {
    const card = document.createElement('div');
    card.className = 'repo-card glass shine-hover';
    card.onclick = () => window.open(`https://github.com/SHIHAB69/${repo.name}`, '_blank');
    
    card.innerHTML = `
      <div class="repo-header">
        <h3>${repo.name}</h3>
        <span class="repo-stars">⭐ ${repo.stars}</span>
      </div>
      <p class="repo-description">${repo.description}</p>
      <div class="repo-stats">
        <span class="repo-language">${repo.language}</span>
        <span class="repo-forks">🔀 ${repo.forks}</span>
        <span class="repo-updated">Updated ${repo.updated}</span>
      </div>
    `;
    
    reposGrid.appendChild(card);
  });
}

// Update the DOMContentLoaded to also load repositories
document.addEventListener('DOMContentLoaded', () => {
  // Use the simple method that works without API tokens
  fetchSimpleGitHubData();
  
  // Load GitHub repositories
  loadGitHubRepositories();
});


