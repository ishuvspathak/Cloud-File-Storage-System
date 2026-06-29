/**
 * Cloud File Storage System - Dashboard Interactivity & Animation Logic
 * Student: Ishu Pathak (Reg No: 2303717620521021)
 * Week 2 Web Technology Lab Assignment
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initClock();
  initThemeSwitcher();
  initStatsCounters();
  initImageSlider();
  initNotificationPanel();
  initFormValidation();
  initScrollToTop();
  initTypingEffect();
});

/* ==========================================================================
   1. DIGITAL CLOCK & DATE DISPLAY
   ========================================================================== */
function initClock() {
  const clockContainer = document.getElementById('live-clock');
  if (!clockContainer) return;

  function updateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', optionsDate);
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    const hoursStr = String(hours).padStart(2, '0');
    
    clockContainer.innerHTML = `
      <span class="clock-date">${dateStr}</span>
      <span class="clock-separator">|</span>
      <span class="clock-time">${hoursStr}:${minutes}:${seconds} ${ampm}</span>
    `;
  }
  
  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. THEME SWITCHER (Light / Dark Mode)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  // Check stored preference or default to System preferences
  const storedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-theme');
    updateThemeIcon(true);
  } else {
    document.body.classList.remove('dark-theme');
    updateThemeIcon(false);
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDarkNow = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
    updateThemeIcon(isDarkNow);
    
    // Trigger dynamic statistic counters again on theme change for clean aesthetics
    initStatsCounters();
  });

  function updateThemeIcon(isDark) {
    // Change toggle button icon: Sun for Light Mode, Moon for Dark Mode
    themeToggleBtn.innerHTML = isDark 
      ? '<span class="theme-btn-icon">&#9788;</span> <span class="theme-btn-text">Light Mode</span>' 
      : '<span class="theme-btn-icon">&#9790;</span> <span class="theme-btn-text">Dark Mode</span>';
  }
}

/* ==========================================================================
   3. DYNAMIC STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounters() {
  const stats = [
    { id: 'stat-total-users', target: 12540, prefix: '', suffix: '' },
    { id: 'stat-active-users', target: 8245, prefix: '', suffix: '' },
    { id: 'stat-revenue', target: 475000, prefix: '₹', suffix: '' },
    { id: 'stat-transactions', target: 15320, prefix: '', suffix: '' },
    { id: 'stat-notifications', target: 18, prefix: '', suffix: '' },
    { id: 'stat-pending-tasks', target: 6, prefix: '', suffix: '' }
  ];

  stats.forEach(stat => {
    const el = document.getElementById(stat.id);
    if (!el) return;

    const duration = 1200; // Animation duration in milliseconds
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad) for professional deceleration
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * stat.target);
      
      // Format number based on regional locale
      let formattedValue = currentValue.toLocaleString('en-IN');
      el.textContent = `${stat.prefix}${formattedValue}${stat.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Guarantee final exact number at completion
        el.textContent = `${stat.prefix}${stat.target.toLocaleString('en-IN')}${stat.suffix}`;
      }
    }

    requestAnimationFrame(step);
  });
}

/* ==========================================================================
   4. IMAGE SLIDER / CAROUSEL (Vector Dashboard Art)
   ========================================================================== */
function initImageSlider() {
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let slideInterval;
  const intervalDuration = 5000; // Auto-slide every 5 seconds

  function showSlide(index) {
    // Wrap index boundaries
    if (index >= slides.length) currentIdx = 0;
    else if (index < 0) currentIdx = slides.length - 1;
    else currentIdx = index;

    // Reset classes
    slides.forEach((slide, i) => {
      slide.classList.remove('active');
      dots[i].classList.remove('active');
    });

    slides[currentIdx].classList.add('active');
    dots[currentIdx].classList.add('active');
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      showSlide(currentIdx + 1);
    }, intervalDuration);
  }

  function stopAutoSlide() {
    if (slideInterval) clearInterval(slideInterval);
  }

  // Next / Prev Button events
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIdx + 1);
      startAutoSlide(); // Reset timer
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIdx - 1);
      startAutoSlide(); // Reset timer
    });
  }

  // Dots indicator events
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoSlide(); // Reset timer
    });
  });

  // Pause slider on mouse hover to improve user experience
  const sliderContainer = document.querySelector('.slider-wrapper');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Initialize first slide and start loop
  showSlide(0);
  startAutoSlide();
}

/* ==========================================================================
   5. SHOW/HIDE NOTIFICATION PANEL
   ========================================================================== */
function initNotificationPanel() {
  const notifyTrigger = document.getElementById('notify-trigger');
  const notifyPanel = document.getElementById('notification-panel');
  const closeNotifyBtn = document.getElementById('close-notify-panel');
  const clearNotifyBtn = document.getElementById('clear-notify-btn');
  const notifyItemsCount = document.getElementById('notify-badge-count');

  if (!notifyTrigger || !notifyPanel) return;

  // Toggle notification panel visibility
  notifyTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    notifyPanel.classList.toggle('show');
  });

  if (closeNotifyBtn) {
    closeNotifyBtn.addEventListener('click', () => {
      notifyPanel.classList.remove('show');
    });
  }

  // Click outside the panel to close it
  document.addEventListener('click', (e) => {
    if (!notifyPanel.contains(e.target) && e.target !== notifyTrigger) {
      notifyPanel.classList.remove('show');
    }
  });

  // Clear notifications list
  if (clearNotifyBtn) {
    clearNotifyBtn.addEventListener('click', () => {
      const notifyList = document.querySelector('.notification-list');
      if (notifyList) {
        notifyList.innerHTML = '<li class="no-notifications-item">No new notifications.</li>';
      }
      if (notifyItemsCount) {
        notifyItemsCount.style.display = 'none';
      }
      // Set counter card notifications number to 0
      const statCardNotify = document.getElementById('stat-notifications');
      if (statCardNotify) statCardNotify.textContent = '0';
    });
  }
}

/* ==========================================================================
   6. REGISTRATION FORM VALIDATION
   ========================================================================== */
function initFormValidation() {
  const form = document.querySelector('.register-form');
  if (!form) return;

  const fields = [
    { id: 'reg-name', validate: validateName },
    { id: 'reg-email', validate: validateEmail },
    { id: 'reg-phone', validate: validatePhone },
    { id: 'reg-password', validate: validatePassword },
    { id: 'reg-dob', validate: validateDOB },
    { id: 'reg-address', validate: validateAddress }
  ];

  // Add real-time event validation (on typing)
  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;
    
    input.addEventListener('input', () => {
      field.validate(input);
    });
  });

  // Form submit handler
  form.addEventListener('submit', (e) => {
    let isFormValid = true;

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        const isValid = field.validate(input);
        if (!isValid) isFormValid = false;
      }
    });

    // Check gender selection (Radio buttons)
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const genderError = document.getElementById('gender-error');
    let genderSelected = false;
    
    genderRadios.forEach(radio => {
      if (radio.checked) genderSelected = true;
    });

    if (!genderSelected) {
      isFormValid = false;
      showError(genderError, 'Please select your gender');
    } else {
      clearError(genderError);
    }

    if (!isFormValid) {
      e.preventDefault(); // Block submit
      // Scroll to the first error element
      const firstError = document.querySelector('.error-msg.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      // Correct submit simulation
      alert('Registration Successful! Redirecting to secure storage workspace...');
    }
  });

  // Handle Form Reset to clean error visuals
  form.addEventListener('reset', () => {
    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        input.classList.remove('input-error', 'input-success');
        const errSpan = document.getElementById(`${field.id}-error`);
        if (errSpan) clearError(errSpan);
      }
    });
    const genderError = document.getElementById('gender-error');
    if (genderError) clearError(genderError);
  });

  /* Individual Validation Functions */
  function validateName(input) {
    const errSpan = document.getElementById('reg-name-error');
    const val = input.value.trim();
    if (val.length < 3) {
      showError(errSpan, 'Name must be at least 3 characters long', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  function validateEmail(input) {
    const errSpan = document.getElementById('reg-email-error');
    const val = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      showError(errSpan, 'Please enter a valid email address (e.g. name@example.com)', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  function validatePhone(input) {
    const errSpan = document.getElementById('reg-phone-error');
    const val = input.value.trim();
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
    if (!phoneRegex.test(val)) {
      showError(errSpan, 'Phone number must be exactly 10 digits', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  function validatePassword(input) {
    const errSpan = document.getElementById('reg-password-error');
    const val = input.value;
    
    // Password rules: 8+ chars, 1 uppercase letter, 1 number, 1 special character
    const lengthValid = val.length >= 8;
    const numValid = /[0-9]/.test(val);
    const upperValid = /[A-Z]/.test(val);
    const specialValid = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    if (!lengthValid || !numValid || !upperValid || !specialValid) {
      showError(errSpan, 'Password must be 8+ characters and contain 1 uppercase letter, 1 number, and 1 special symbol', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  function validateDOB(input) {
    const errSpan = document.getElementById('reg-dob-error');
    const val = input.value;
    if (!val) {
      showError(errSpan, 'Please select your Date of Birth', input);
      return false;
    }
    
    const dobDate = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }

    if (dobDate > today) {
      showError(errSpan, 'Date of Birth cannot be in the future', input);
      return false;
    } else if (age < 16) {
      showError(errSpan, 'You must be at least 16 years old to register', input);
      return false;
    }

    showSuccess(errSpan, input);
    return true;
  }

  function validateAddress(input) {
    const errSpan = document.getElementById('reg-address-error');
    const val = input.value.trim();
    if (val.length < 10) {
      showError(errSpan, 'Address is too short. Please provide details (min 10 characters)', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  // Visual Helper Utilities
  function showError(span, msg, input = null) {
    if (span) {
      span.textContent = msg;
      span.classList.add('visible');
    }
    if (input) {
      input.classList.remove('input-success');
      input.classList.add('input-error');
    }
  }

  function showSuccess(span, input = null) {
    if (span) {
      span.textContent = '';
      span.classList.remove('visible');
    }
    if (input) {
      input.classList.remove('input-error');
      input.classList.add('input-success');
    }
  }

  function clearError(span) {
    if (span) {
      span.textContent = '';
      span.classList.remove('visible');
    }
  }
}

/* ==========================================================================
   7. SCROLL-TO-TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (!scrollTopBtn) return;

  // Show button when scrolling beyond 300px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  // Smooth scroll back to top
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. TYPING EFFECT (Web Animation)
   ========================================================================== */
function initTypingEffect() {
  const taglineEl = document.querySelector('.typing-tagline');
  if (!taglineEl) return;

  const phrase = "Secure. Store. Access Anywhere.";
  let currentText = "";
  let idx = 0;
  const typingSpeed = 100; // Milliseconds per character

  function type() {
    if (idx < phrase.length) {
      currentText += phrase.charAt(idx);
      taglineEl.textContent = currentText;
      idx++;
      setTimeout(type, typingSpeed);
    }
  }

  // Start the typing effect
  taglineEl.textContent = "";
  setTimeout(type, 800);
}
