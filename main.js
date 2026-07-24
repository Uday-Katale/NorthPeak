// Initialize Lucide Icons
lucide.createIcons();

// Hero Title Animation (Infinite Typewriter with Synced Bottom Text)
const revealText = document.getElementById('reveal-text');
const revealBottom = document.getElementById('reveal-bottom');
if (revealText && revealBottom) {
  const phrases = [
    { top: "Engineering the next generation of", bottom: "digital products" },
    { top: "Designing the future of", bottom: "web experiences" },
    { top: "Building world-class", bottom: "SaaS platforms" },
    { top: "Scaling high-performance", bottom: "cloud architectures" }
  ];
  let currentPhraseIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const currentTop = phrases[currentPhraseIndex].top;
    
    if (isDeleting) {
      revealText.innerText = currentTop.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      revealText.innerText = currentTop.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }
    
    let typeSpeed = isDeleting ? 30 : 60;
    
    if (!isDeleting && currentCharIndex === currentTop.length) {
      typeSpeed = 2500; // Pause at the end of the phrase
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
      typeSpeed = 500; // Pause before starting the next phrase
      
      // Animate the bottom text out
      revealBottom.style.opacity = '0';
      revealBottom.style.transform = 'translateY(10px)';
      
      // Animate the bottom text in with the new word shortly after
      setTimeout(() => {
        revealBottom.innerText = phrases[currentPhraseIndex].bottom;
        revealBottom.style.opacity = '1';
        revealBottom.style.transform = 'translateY(0)';
      }, 400);
    }
    
    setTimeout(typeWriter, typeSpeed);
  }
  
  // Start the typing effect
  setTimeout(typeWriter, 500);
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.documentElement.classList.add('light-mode');
  if (themeToggle) {
    themeToggle.innerHTML = `<i data-lucide="moon" id="themeIcon"></i>`;
    lucide.createIcons();
  }
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update Icon by re-injecting the <i> tag so Lucide picks it up
    themeToggle.innerHTML = `<i data-lucide="${isLight ? 'moon' : 'sun'}" id="themeIcon"></i>`;
    lucide.createIcons();
  });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Menu Toggle (Basic toggle logic)
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.getElementById('navLinks');

if (mobileMenuToggle && navLinks) {
  mobileMenuToggle.addEventListener('click', () => {
    // A simple approach for mobile: toggle display
    if (navLinks.style.display === 'flex') {
      navLinks.style.display = 'none';
    } else {
      navLinks.style.display = 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = 'rgba(15, 23, 42, 0.95)';
      navLinks.style.backdropFilter = 'blur(16px)';
      navLinks.style.padding = '2rem';
      navLinks.style.borderRadius = '0';
      navLinks.style.border = 'none';
      navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

// Intersection Observer for Scroll Reveal Animations
const revealElements = document.querySelectorAll('.reveal');

const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Trigger counter animation if it's the results section
      const counters = entry.target.querySelectorAll('.stat-number');
      if (counters.length > 0) {
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const duration = 2000; // ms
          const start = 0;
          let startTime = null;

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            
            // Ease out quad
            const easeOut = progress * (2 - progress);
            const current = (easeOut * target).toFixed(target % 1 !== 0 ? 1 : 0);
            
            counter.innerText = current + (target === 99.9 ? '%' : target === 150 ? '+' : '');
            
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        });
      }
      
      // Unobserve after revealing to animate only once
      observer.unobserve(entry.target);
    }
  });
};

const revealOptions = {
  root: null,
  rootMargin: '0px 0px -100px 0px',
  threshold: 0.1
};

const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// Parallax effect for Hero section
const parallaxScene = document.getElementById('parallax-scene');
if (parallaxScene && window.innerWidth > 1024) {
  document.addEventListener('mousemove', (e) => {
    const cards = parallaxScene.querySelectorAll('[data-speed]');
    const x = (window.innerWidth - e.pageX * 2) / 100;
    const y = (window.innerHeight - e.pageY * 2) / 100;

    cards.forEach(card => {
      const speed = card.getAttribute('data-speed');
      const translateX = x * speed;
      const translateY = y * speed;
      
      // Keep center card mostly stable, move floating cards more
      if (card.classList.contains('center-card')) {
        card.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px))`;
      } else {
        card.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    });
  });
}

// Client-side Form Validation
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Name validation
    const nameInput = document.getElementById('name');
    if (!nameInput.value.trim()) {
      nameInput.closest('.modern-input').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.modern-input').classList.remove('has-error');
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.modern-input').classList.add('has-error');
      isValid = false;
    } else {
      emailInput.closest('.modern-input').classList.remove('has-error');
    }
    
    // Message validation
    const messageInput = document.getElementById('message');
    if (!messageInput.value.trim()) {
      messageInput.closest('.modern-input').classList.add('has-error');
      isValid = false;
    } else {
      messageInput.closest('.modern-input').classList.remove('has-error');
    }
    
    if (isValid) {
      const btn = document.getElementById('submitBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      
      setTimeout(() => {
        document.getElementById('successMessage').style.display = 'flex';
        contactForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        setTimeout(() => {
          document.getElementById('successMessage').style.display = 'none';
        }, 5000);
      }, 1500);
    }
  });

  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      input.closest('.modern-input').classList.remove('has-error');
    });
  });
}
