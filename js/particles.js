/**
 * Digital Data Flow (Floating Binary)
 * Pofessional IT/IS Themed Background.
 * Features:
 * - Floating Binary digits (0, 1) and Code Symbols
 * - Monospace font for "Tech" look
 * - Gentle, slow movement (Data in the cloud)
 * - Subtle interaction
 * - Palette: Professional UBP Blue & Cool Gray
 */

const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Dimensions
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Mouse State
let mouse = {
    x: null,
    y: null,
    radius: 100 // Interaction radius
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color, symbol) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.symbol = symbol;
    }

    // Method to draw individual particle
    draw() {
        ctx.font = 'bold ' + this.size + 'px "Courier New", monospace';
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }

    // Update position
    update() {
        // Wall collision (wrap around for "Flow" feel)
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Mouse Collision (Subtle Repel)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            const moveX = Math.cos(angle) * force * 2; // Gentle push
            const moveY = Math.sin(angle) * force * 2;
            
            this.x -= moveX;
            this.y -= moveY;
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    // Clean density
    let numberOfParticles = (canvas.height * canvas.width) / 10000; 
    
    // Safety cap
    if (numberOfParticles > 150) numberOfParticles = 150;

    const symbols = ['0', '1', '0', '1', '1', '0', '{ }', '</>', ';;', '#_'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 10) + 10; // 10px to 20px
        
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        
        // Very slow, consistent drift
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Professional Palette: Cool Grays and UBP Blues
        // Kept very subtle (low opacity) to not distract from content
        const colors = [
            'rgba(14, 165, 233, 0.25)', // Brand Cyan
            'rgba(30, 64, 175, 0.2)',  // Brand Blue
            'rgba(148, 163, 184, 0.3)' // Cool Gray (Code comment color)
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];
        let symbol = symbols[Math.floor(Math.random() * symbols.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color, symbol));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

// Resize Event
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Mouse out
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();
