/**
 * Mengatur animasi yang dapat berulang saat elemen masuk dan keluar dari viewport.
 * Ini menggunakan sistem class yang ada dari components.css (.animate) dan main.css (.fade-in).
 */
const setupRepeatingAnimation = () => {
  // Elemen yang dianimasikan oleh .animate (dari components.css)
  const componentElements = document.querySelectorAll(
    ".card, .stat-card, .visi-box, .himasi-logo-box, .himasi-info"
  );

  // Elemen yang dianimasikan oleh .fade-in + .animate (dari main.css)
  const fadeElements = document.querySelectorAll(
    ".section .text-center, .cta-section"
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      } else {
        // Jangan reset animasi untuk stat-card agar counter tidak berulang
        if (!entry.target.classList.contains('stat-card')) {
            entry.target.classList.remove("animate");
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Amati semua elemen komponen
  componentElements.forEach((el) => observer.observe(el));

  // Tambahkan class .fade-in dan amati elemen fade
  fadeElements.forEach((el) => {
    if (!el.matches('.card, .stat-card, .visi-box, .himasi-logo-box, .himasi-info')) {
        el.classList.add("fade-in");
        observer.observe(el);
    }
  });
};

/**
 * Mengatur efek parallax pada background hero section.
 */
const setupParallax = () => {
  const heroBackground = document.querySelector(".hero-background");
  if (!heroBackground) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    if (scrolled < window.innerHeight) {
      heroBackground.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
  });
};

/**
 * Mengatur animasi hitung naik pada statistik dan hanya berjalan sekali.
 */
const setupStatsCounter = () => {
  const statCards = document.querySelectorAll(".stat-card");
  if (!statCards.length) return;

  const animateValue = (element, start, end, duration, originalText) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);

      if (originalText.includes('+')) {
        element.textContent = value + '+';
      } else {
        element.textContent = value;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  };

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted'); // Tandai sudah dihitung
          const statNumberEl = entry.target.querySelector(".stat-number");
          if (statNumberEl) {
            const originalText = statNumberEl.textContent.trim();
            const numericValue = parseInt(originalText.replace(/\D/g, ''));

            if (!isNaN(numericValue)) {
              animateValue(statNumberEl, 0, numericValue, 2000, originalText);
            }
          }
        }
      });
    },
    { threshold: 0.8 }
  );

  statCards.forEach((card) => {
    statsObserver.observe(card);
  });
};

// Jalankan semua fungsi setelah DOM loaded
document.addEventListener("DOMContentLoaded", () => {
  setupParallax();
  setupStatsCounter();
  setupRepeatingAnimation();
});
