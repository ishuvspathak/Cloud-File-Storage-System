/**
 * Cloud File Storage System - Dashboard Interactivity & Animation Logic
 * Student: Ishu Pathak (Reg No: 2303717620521021)
 * Week 3 Web Technology Lab Assignment - Optimized Portfolio Edition
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
  initOrbitMap();
  initProfileDropdown(); // New Profile Dropdown Module
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
    hours = hours ? hours : 12; 
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
   2. THEME SWITCHER (Light Mode by default)
   ========================================================================== */
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (!themeToggleBtn) return;

  const storedTheme = localStorage.getItem('theme');
  
  // Default to Light Mode on load unless dark theme was explicitly selected
  if (storedTheme === 'dark') {
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
    initStatsCounters(); 
  });

  function updateThemeIcon(isDark) {
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

    const duration = 1200; 
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress); 
      const currentValue = Math.floor(easeProgress * stat.target);
      
      let formattedValue = currentValue.toLocaleString('en-IN');
      el.textContent = `${stat.prefix}${formattedValue}${stat.suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${stat.prefix}${stat.target.toLocaleString('en-IN')}${stat.suffix}`;
      }
    }

    requestAnimationFrame(step);
  });
}

/* ==========================================================================
   4. IMAGE SLIDER / CAROUSEL
   ========================================================================== */
function initImageSlider() {
  const slides = document.querySelectorAll('.slide-item');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slide-prev');
  const nextBtn = document.getElementById('slide-next');
  
  if (slides.length === 0) return;
  
  let currentIdx = 0;
  let slideInterval;
  const intervalDuration = 5000;

  function showSlide(index) {
    if (index >= slides.length) currentIdx = 0;
    else if (index < 0) currentIdx = slides.length - 1;
    else currentIdx = index;

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

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIdx + 1);
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIdx - 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoSlide();
    });
  });

  const sliderContainer = document.querySelector('.slider-wrapper');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

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

  notifyTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    notifyPanel.classList.toggle('show');
  });

  if (closeNotifyBtn) {
    closeNotifyBtn.addEventListener('click', () => {
      notifyPanel.classList.remove('show');
    });
  }

  document.addEventListener('click', (e) => {
    if (!notifyPanel.contains(e.target) && e.target !== notifyTrigger) {
      notifyPanel.classList.remove('show');
    }
  });

  if (clearNotifyBtn) {
    clearNotifyBtn.addEventListener('click', () => {
      const notifyList = document.querySelector('.notification-list');
      if (notifyList) {
        notifyList.innerHTML = '<li class="no-notifications-item">No new notifications.</li>';
      }
      if (notifyItemsCount) {
        notifyItemsCount.style.display = 'none';
      }
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
    { id: 'reg-age', validate: validateAge },
    { id: 'reg-time', validate: validateTime },
    { id: 'reg-address', validate: validateAddress }
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.id);
    if (!input) return;
    
    input.addEventListener('input', () => {
      field.validate(input);
    });
  });

  const cancelBtn = document.getElementById('btn-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (confirm('Cancel registration? All entered data will be reset.')) {
        form.reset();
        fields.forEach(f => {
          const input = document.getElementById(f.id);
          if (input) input.classList.remove('input-error', 'input-success');
          const errSpan = document.getElementById(`${f.id}-error`);
          if (errSpan) {
            errSpan.textContent = '';
            errSpan.classList.remove('visible');
          }
        });
        const genderError = document.getElementById('gender-error');
        if (genderError) {
          genderError.textContent = '';
          genderError.classList.remove('visible');
        }
        const skillsError = document.getElementById('skills-error');
        if (skillsError) {
          skillsError.textContent = '';
          skillsError.classList.remove('visible');
        }
        window.location.hash = '#welcome';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    let isFormValid = true;

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        const isValid = field.validate(input);
        if (!isValid) isFormValid = false;
      }
    });

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

    const skillsCheckboxes = document.querySelectorAll('input[name="skills"]');
    const skillsError = document.getElementById('skills-error');
    let skillSelected = false;

    skillsCheckboxes.forEach(checkbox => {
      if (checkbox.checked) skillSelected = true;
    });

    if (!skillSelected) {
      isFormValid = false;
      showError(skillsError, 'Please check at least one skill or interest');
    } else {
      clearError(skillsError);
    }

    if (!isFormValid) {
      e.preventDefault(); 
      const firstError = document.querySelector('.error-msg.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      alert('Registration Successful! Redirecting to secure storage workspace...');
    }
  });

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
    const skillsError = document.getElementById('skills-error');
    if (skillsError) clearError(skillsError);
  });

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
    const phoneRegex = /^[0-9]{10}$/; 
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
    
    if (dobDate > today) {
      showError(errSpan, 'Date of Birth cannot be in the future', input);
      return false;
    }

    showSuccess(errSpan, input);
    return true;
  }

  function validateAge(input) {
    const errSpan = document.getElementById('reg-age-error');
    const val = parseInt(input.value, 10);
    
    if (isNaN(val)) {
      showError(errSpan, 'Please enter a numeric age', input);
      return false;
    } else if (val < 16 || val > 100) {
      showError(errSpan, 'Age must be between 16 and 100', input);
      return false;
    }
    
    showSuccess(errSpan, input);
    return true;
  }

  function validateTime(input) {
    const errSpan = document.getElementById('reg-time-error');
    const val = input.value;
    
    if (!val) {
      showError(errSpan, 'Please select a preferred meeting time', input);
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

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

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
  const typingSpeed = 100;

  function type() {
    if (idx < phrase.length) {
      currentText += phrase.charAt(idx);
      taglineEl.textContent = currentText;
      idx++;
      setTimeout(type, typingSpeed);
    }
  }

  taglineEl.textContent = "";
  setTimeout(type, 800);
}

/* ==========================================================================
   9. INTERACTIVE FEATURE ORBIT MAP
   ========================================================================== */
function initOrbitMap() {
  const nodes = document.querySelectorAll('.orbit-node');
  const coreHub = document.querySelector('.core-hub');
  const coreTitle = document.getElementById('core-title');
  const coreDesc = document.getElementById('core-description');
  
  if (nodes.length === 0 || !coreHub) return;
  
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      
      const title = node.getAttribute('data-title');
      const desc = node.getAttribute('data-desc');
      
      coreHub.classList.add('pulse-hub');
      setTimeout(() => coreHub.classList.remove('pulse-hub'), 300);
      
      coreTitle.textContent = title;
      coreDesc.textContent = desc;
    });
  });
}

/* ==========================================================================
   10. USER PROFILE DROPDOWN MENU
   ========================================================================== */
function initProfileDropdown() {
  const trigger = document.getElementById('profile-trigger');
  const dropdown = document.getElementById('profile-dropdown');
  const editBtn = document.getElementById('profile-edit-btn');
  const switchBtn = document.getElementById('profile-switch-btn');
  const registerBtn = document.getElementById('profile-register-btn');
  const logoutBtn = document.getElementById('profile-logout-btn');
  
  const userNameEl = document.getElementById('display-user-name');
  const avatarEl = document.getElementById('avatar-letters');
  
  if (!trigger || !dropdown) return;
  
  // Toggle dropdown
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });
  
  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
  
  // Edit details action (Scroll and focus)
  if (editBtn) {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.remove('show');
      const formSection = document.getElementById('registration');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameInput = document.getElementById('reg-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 800); 
        }
      }
    });
  }
  
  // Switch User action (Mock toggle between Ishu Pathak and Guest Account)
  let isGuest = false;
  if (switchBtn) {
    switchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.remove('show');
      
      isGuest = !isGuest;
      if (isGuest) {
        if (userNameEl) userNameEl.textContent = 'Guest Account';
        if (avatarEl) avatarEl.textContent = 'GA';
        switchBtn.innerHTML = '&#128257; Switch to Ishu Pathak';
        alert('Switched to Guest Account view.');
      } else {
        if (userNameEl) userNameEl.textContent = 'Ishu Pathak';
        if (avatarEl) avatarEl.textContent = 'IP';
        switchBtn.innerHTML = '&#128257; Switch to Guest Account';
        alert('Switched back to Ishu Pathak account.');
      }
    });
  }
  
  // Register New User action (Scroll and focus name)
  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.remove('show');
      const formSection = document.getElementById('registration');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const form = document.querySelector('.register-form');
        if (form) form.reset();
        const nameInput = document.getElementById('reg-name');
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 800);
        }
      }
    });
  }
  
  // Logout action
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.remove('show');
      if (confirm('Are you sure you want to log out of the dashboard?')) {
        alert('Logged out successfully. Returning to public workspace view.');
        if (userNameEl) userNameEl.textContent = 'Public Workspace';
        if (avatarEl) avatarEl.textContent = 'PW';
      }
    });
  }
}
