// Preloader Logic -- CRITICAL FIX
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    // Add fade-out class to trigger CSS transition
    preloader.classList.add('fade-out');
    
    // Trigger entrance animations for the page content
    document.body.classList.add('loaded');

    // Remove from DOM/Display after transition
    setTimeout(() => {
        preloader.style.display = 'none';
        
        // Backup: Ensure loaded class is added even if race condition occurs
        if (!document.body.classList.contains('loaded')) {
             document.body.classList.add('loaded');
        }
    }, 500); 
  } else {
    // Fallback if no preloader exists
    document.body.classList.add('loaded');
  }
});

// Mobile Menu Toggle
const navbarToggle = document.getElementById("navbarToggle");
const navbarMenu = document.getElementById("navbarMenu");
const navbar = document.getElementById("navbar");

if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");
    navbarToggle.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
    }
  });

  const navbarLinks = navbarMenu.querySelectorAll(".navbar-link");
  navbarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbarMenu.classList.remove("active");
      navbarToggle.classList.remove("active");
    });
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar shadow & hide on scroll
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (navbar) {
    // Add shadow
    if (scrollTop > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide on scroll down, show on scroll up
    if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
      // Scroll Down
      navbar.classList.add("hidden");
    } else {
      // Scroll Up
      navbar.classList.remove("hidden");
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Back to Top Button
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add("active"); // Changed from 'show' to 'active'
    } else {
      backToTopBtn.classList.remove("active");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Kegiatan Slider
const slider = document.getElementById("kegiatanSlider");
const slides = slider ? slider.querySelectorAll(".slide") : [];
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  if (index >= slides.length) currentSlide = 0;
  else if (index < 0) currentSlide = slides.length - 1;
  else currentSlide = index;

  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === currentSlide) {
      slide.classList.add("active");
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.remove("active");
    if (i === currentSlide) {
      dot.classList.add("active");
    }
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    stopAutoSlide();
    startAutoSlide();
  });
});

if (slider) {
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
}

if (slides.length > 0) {
  startAutoSlide();
}

// Touch Swipe support
let touchStartX = 0;
let touchEndX = 0;

if (slider) {
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
}

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  }
  if (touchEndX > touchStartX + 50) {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  }
}
