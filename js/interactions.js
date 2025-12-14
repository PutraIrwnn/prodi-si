/**
 * Ultimate Interactions
 * Handles: 3D Tilt, Spotlight, Scramble Text, Magnetic Buttons
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PRELOADER ---
    const preloader = document.getElementById('preloader');
    // FIX: Use querySelector because it's a class in HTML, or ensure ID matches.
    // HTML has <div class="loading-text">, so use querySelector.
    const loadingText = document.querySelector('.loading-text'); 
    
    // Fake loading sequence
    const phrases = ["CONNECTING...", "LOADING ASSETS...", "DECRYPTING...", "ACCESS GRANTED"];
    let i = 0;
    
    // Safety check to prevent errors
    if (preloader && loadingText) {
        const interval = setInterval(() => {
            if(i < phrases.length) {
                loadingText.innerText = phrases[i];
                i++;
            } else {
                clearInterval(interval);
                finishLoading();
            }
        }, 500);
    } else {
        // Fallback: if elements missing, just finish
        if (preloader) finishLoading();
    }

    function finishLoading() {
        if (!preloader) return;
        
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            // Start Hero Animations
            triggerHeroAnimations();
        }, 500);
    }

    // --- 2. 3D TILT & SPOTLIGHT ---
    const cards = document.querySelectorAll('.card, .stat-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Spotlight Position (CSS Variable)
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Tilt Calculation
            // Center of card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Mouse offset from center
            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
             // Reset
             card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
        });
    });

    // --- 3. MAGNETIC BUTTONS ---
    const buttons = document.querySelectorAll('.btn-magnetic');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly towards mouse
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- 4. SCRAMBLE TEXT EFFECT ---
    function triggerHeroAnimations() {
        const glitchElement = document.querySelector('.glitch-text .scramble-text');
        
        // Safety check
        if (!glitchElement) return;

        const originalText = glitchElement.getAttribute('data-text') || glitchElement.innerText;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        let iterations = 0;
        
        const scrambleInterval = setInterval(() => {
            glitchElement.innerText = originalText.split("")
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join("");
            
            if (iterations >= originalText.length) {
                clearInterval(scrambleInterval);
            }
            
            iterations += 1 / 3; // Speed
        }, 30);
    }
});
