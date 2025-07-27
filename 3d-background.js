import * as THREE from 'three';
import { gsap } from 'gsap';

class Background3D {
    constructor() {
        this.canvas = document.getElementById('bgCanvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            alpha: true,
            antialias: true 
        });
        
        this.particles = [];
        this.floatingShapes = [];
        this.scrollShapes = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = 0;
        
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
        
        // Create scroll-reactive shapes
        this.createScrollShapes();
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xff6a00, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    
    createParticles() {
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Position
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // Color (orange theme)
            const color = new THREE.Color();
            color.setHSL(0.1 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.particles.push(particles);
    }
    
    createFloatingShapes() {
        const shapes = [
            { type: 'box', size: 0.3, color: 0xff6a00 },
            { type: 'sphere', size: 0.2, color: 0xff9800 },
            { type: 'torus', size: 0.15, color: 0xffb74d },
            { type: 'octahedron', size: 0.25, color: 0xffcc02 },
            { type: 'icosahedron', size: 0.2, color: 0xff8a65 }
        ];
        
        for (let i = 0; i < 12; i++) {
            const shapeData = shapes[i % shapes.length];
            let geometry;
            
            switch (shapeData.type) {
                case 'box':
                    geometry = new THREE.BoxGeometry(shapeData.size, shapeData.size, shapeData.size);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(shapeData.size, 12, 8);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(shapeData.size, shapeData.size * 0.3, 12, 8);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(shapeData.size);
                    break;
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(shapeData.size);
                    break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                transparent: true,
                opacity: 0.2,
                wireframe: true,
                emissive: shapeData.color,
                emissiveIntensity: 0.1
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Random position
            mesh.position.x = (Math.random() - 0.5) * 20;
            mesh.position.y = (Math.random() - 0.5) * 20;
            mesh.position.z = (Math.random() - 0.5) * 15;
            
            // Random rotation
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Store original position for animation
            mesh.userData = {
                originalY: mesh.position.y,
                originalX: mesh.position.x,
                speed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(mesh);
            this.floatingShapes.push(mesh);
            
            // Animate floating
            this.animateShape(mesh, i);
        }
    }
    
    createScrollShapes() {
        // Create shapes that react to scroll position
        const scrollShapes = [
            { type: 'ring', size: 0.8, color: 0xff6a00 },
            { type: 'star', size: 0.6, color: 0xff9800 },
            { type: 'diamond', size: 0.5, color: 0xffb74d }
        ];
        
        for (let i = 0; i < 6; i++) {
            const shapeData = scrollShapes[i % scrollShapes.length];
            let geometry;
            
            switch (shapeData.type) {
                case 'ring':
                    geometry = new THREE.TorusGeometry(shapeData.size, shapeData.size * 0.1, 16, 32);
                    break;
                case 'star':
                    geometry = new THREE.OctahedronGeometry(shapeData.size);
                    break;
                case 'diamond':
                    geometry = new THREE.TetrahedronGeometry(shapeData.size);
                    break;
            }
            
            const material = new THREE.MeshPhongMaterial({
                color: shapeData.color,
                transparent: true,
                opacity: 0.1,
                wireframe: true,
                emissive: shapeData.color,
                emissiveIntensity: 0.05
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position based on scroll sections
            const section = Math.floor(i / 2);
            mesh.position.x = (Math.random() - 0.5) * 10;
            mesh.position.y = section * 8 - 20;
            mesh.position.z = (Math.random() - 0.5) * 5;
            
            mesh.userData = {
                section: section,
                originalY: mesh.position.y,
                scrollSpeed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(mesh);
            this.scrollShapes.push(mesh);
        }
    }
    
    animateShape(mesh, index) {
        const duration = 4 + Math.random() * 3;
        const delay = index * 0.3;
        
        // Floating animation
        gsap.to(mesh.position, {
            y: mesh.userData.originalY + (Math.random() - 0.5) * 3,
            duration: duration,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Horizontal drift
        gsap.to(mesh.position, {
            x: mesh.userData.originalX + (Math.random() - 0.5) * 2,
            duration: duration * 1.5,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
        
        // Rotation animation
        gsap.to(mesh.rotation, {
            y: mesh.rotation.y + Math.PI * 2,
            duration: duration * 2,
            delay: delay,
            repeat: -1,
            ease: "none"
        });
        
        // Scale animation
        gsap.to(mesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: duration * 0.8,
            delay: delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate particles with wave effect
        this.particles.forEach((particles, index) => {
            particles.rotation.y += 0.001;
            particles.rotation.x += 0.0005;
            
            // Add wave motion to particles
            const wave = Math.sin(time + index * 0.1) * 0.1;
            particles.position.y += wave * 0.01;
        });
        
        // Enhanced floating shapes animation
        this.floatingShapes.forEach((shape, index) => {
            // Continuous rotation
            shape.rotation.x += 0.003 * shape.userData.speed;
            shape.rotation.z += 0.002 * shape.userData.speed;
            
            // Subtle wave motion
            const wave = Math.sin(time + index * 0.5) * 0.05;
            shape.position.y += wave * 0.01;
            
            // Color pulsing
            const colorPulse = Math.sin(time + index * 0.3) * 0.1 + 0.9;
            shape.material.emissiveIntensity = 0.1 * colorPulse;
        });
        
        // Scroll-reactive shapes animation
        this.scrollShapes.forEach((shape, index) => {
            // Rotate based on scroll position
            shape.rotation.y += 0.01 * shape.userData.scrollSpeed;
            shape.rotation.x += 0.005 * shape.userData.scrollSpeed;
            
            // Move based on scroll
            const scrollOffset = this.scrollY * 0.001;
            shape.position.y = shape.userData.originalY - scrollOffset * shape.userData.scrollSpeed;
            
            // Scale based on scroll position
            const scrollProgress = (this.scrollY / (document.body.scrollHeight - window.innerHeight)) || 0;
            const scale = 0.8 + scrollProgress * 0.4;
            shape.scale.setScalar(scale);
            
            // Opacity based on scroll
            const opacity = 0.1 + scrollProgress * 0.2;
            shape.material.opacity = opacity;
        });
        
        // Enhanced mouse interaction with parallax effect
        const targetX = this.mouseX * 0.02;
        const targetY = -this.mouseY * 0.02;
        
        this.camera.position.x += (targetX - this.camera.position.x) * 0.03;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
        
        // Add subtle camera movement
        this.camera.position.x += Math.sin(time * 0.5) * 0.001;
        this.camera.position.y += Math.cos(time * 0.3) * 0.001;
        
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
        
        // Handle scroll events
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }
}

// Initialize 3D background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Background3D();
});

export default Background3D; 