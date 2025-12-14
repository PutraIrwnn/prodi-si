/**
 * Ultimate Animations
 * Handles Scroll Reveal using Intersection Observer
 */

document.addEventListener('DOMContentLoaded', () => {

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class when in view
                entry.target.classList.add('animate');
                
                // If it has stats, trigger count up
                if (entry.target.classList.contains('stat-card')) {
                    const numberEl = entry.target.querySelector('.stat-number');
                    if (numberEl) animateValue(numberEl);
                }
            } else {
                // Remove animate class when out of view (Allows replay on scroll up)
                entry.target.classList.remove('animate');
            }
        });
    }, observerOptions);

    // Elements to observe
    const animatedElements = document.querySelectorAll(
        '.card, .stat-card, .visi-box, .himasi-logo-box, .himasi-info, .reveal-text, .section h2, .cta-section, .career-pill'
    );

    animatedElements.forEach((el, index) => {
        // Add stagger delay for grids
        if (el.parentElement && (
            el.parentElement.classList.contains('keunggulan-grid') || 
            el.parentElement.classList.contains('stats-grid') ||
            el.parentElement.classList.contains('profil-grid'))) {
            el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
    });

    // --- SLIDER LOGIC ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    
    // Safety check if slider exists
    if(slides.length > 0) {
        function showSlide(n) {
            // Remove active classes
            slides.forEach(slide => slide.classList.remove('active'));
            if(dots) dots.forEach(dot => dot.classList.remove('active'));
            
            // Calculate Index
            currentSlide = (n + slides.length) % slides.length;
            
            // Add active classes
            slides[currentSlide].classList.add('active');
            if(dots && dots[currentSlide]) dots[currentSlide].classList.add('active');
        }
    
        if(prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        if(nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        
        // Dots
        if(dots) {
            dots.forEach((dot, idx) => {
                dot.addEventListener('click', () => showSlide(idx));
            });
        }
        
        // Auto slide
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }
});

// Count Up Animation
function animateValue(obj) {
    // 1. Store the original value in a data attribute if not already there
    // This ensures we remember "2014" even if the text currently says "0"
    if (!obj.dataset.value) {
        obj.dataset.value = obj.innerText;
    }

    // 2. Read from the stable data-value, NOT the changing innerText
    const originalText = obj.dataset.value;
    const end = parseInt(originalText.replace(/\D/g, '')); // Extract number
    
    // If not a number (e.g., "UNGGUL"), do nothing
    if(isNaN(end)) return;

    let startTimestamp = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Calculate current number
        let current = Math.floor(progress * end);
        
        // Append '+' if the original text had it (e.g., "12+")
        if (originalText.includes('+')) {
            obj.innerHTML = current + '+';
        } else {
            obj.innerHTML = current;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
             // Ensure it ends exactly on the original text
             obj.innerHTML = originalText;
        }
    };
    window.requestAnimationFrame(step);
}
