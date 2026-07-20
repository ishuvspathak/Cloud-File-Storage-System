/**
 * Cloud File Storage System - Dashboard Interactivity & Animation Logic
 * Student: Ishu Pathak (Reg No: 2303717620521021)
 * Week 3 Web Technology Lab Assignment - Optimized Supabase Cloud Edition
 */

// Initialize Supabase Client (Renamed to supabaseClient to avoid name conflict with CDN global)
const supabaseUrl = 'https://toehtsuhbswcaawrnfgx.supabase.co';
const supabaseKey = 'sb_publishable_GuIabkO0pJUd4bboVSKliQ_EhgxgLvN';
let supabaseClient = null;

try {
  if (window.supabase) {
    const { createClient } = window.supabase;
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
} catch (err) {
  console.error('Supabase initialization failed:', err);
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules with safety try-catch wrappers to prevent script-wide crashes
  const modules = [
    { name: 'Clock', init: initClock },
    { name: 'Theme', init: initThemeSwitcher },
    { name: 'Stats', init: initStatsCounters },
    { name: 'Slider', init: initImageSlider },
    { name: 'Notify', init: initNotificationPanel },
    { name: 'Validation', init: initFormValidation },
    { name: 'Scroll', init: initScrollToTop },
    { name: 'Typing', init: initTypingEffect },
    { name: 'Orbit', init: initOrbitMap },
    { name: 'Profile', init: initProfileDropdown },
    { name: 'CloudFiles', init: initCloudFilesExplorer },
    { name: 'StorageSandbox', init: initHtml5Sandbox }
  ];

  modules.forEach(m => {
    try {
      m.init();
    } catch (err) {
      console.error(`Error initializing module [${m.name}]:`, err);
    }
  });

  // Simple active top navigation item highlights (Assignment 5)
  const navItems = document.querySelectorAll('.top-nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
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
   6. REGISTRATION FORM VALIDATION & CLOUD STORAGE SAVES
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent standard page reloading
    
    let isFormValid = true;

    // Validate fields
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
    let genderValue = '';
    
    genderRadios.forEach(radio => {
      if (radio.checked) {
        genderSelected = true;
        genderValue = radio.value;
      }
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
    let skillsArray = [];

    skillsCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        skillSelected = true;
        skillsArray.push(checkbox.value);
      }
    });

    if (!skillSelected) {
      isFormValid = false;
      showError(skillsError, 'Please check at least one skill or interest');
    } else {
      clearError(skillsError);
    }

    if (!isFormValid) {
      const firstError = document.querySelector('.error-msg.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit to Supabase database profiles table
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Saving Enrollment to Cloud...';
    submitBtn.disabled = true;

    try {
      if (!supabaseClient) {
        throw new Error('Supabase client could not be loaded.');
      }

      const profileData = {
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value, 
        dob: document.getElementById('reg-dob').value,
        age: parseInt(document.getElementById('reg-age').value, 10),
        pref_time: document.getElementById('reg-time').value,
        gender: genderValue,
        skills: skillsArray,
        address: document.getElementById('reg-address').value.trim()
      };

      const { data, error } = await supabaseClient
        .from('profiles')
        .insert([profileData]);

      if (error) {
        throw error;
      }

      alert('Enrollment Successful! Your storage workspace has been allocated in the cloud.');
      form.reset();
      
      fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) input.classList.remove('input-success');
      });
      
    } catch (err) {
      alert(`Enrollment Failed: ${err.message}`);
    } finally {
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
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
      showError(errSpan, 'Please enter a valid email address', input);
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
      showError(errSpan, 'Please select an enrollment date', input);
      return false;
    }
    showSuccess(errSpan, input);
    return true;
  }

  function validateAge(input) {
    const errSpan = document.getElementById('reg-age-error');
    const val = parseInt(input.value, 10);
    
    if (isNaN(val)) {
      showError(errSpan, 'Please enter number of devices', input);
      return false;
    } else if (val < 1 || val > 20) {
      showError(errSpan, 'Devices count must be between 1 and 20', input);
      return false;
    }
    
    showSuccess(errSpan, input);
    return true;
  }

  function validateTime(input) {
    const errSpan = document.getElementById('reg-time-error');
    const val = input.value;
    
    if (!val) {
      showError(errSpan, 'Please select a sync check-in time', input);
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
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });
  
  document.addEventListener('click', (e) => {
    if (!trigger.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });
  
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

/* ==========================================================================
   11. SUPABASE CLOUD FILE UPLOADS & METADATA SYNC
   ========================================================================== */
function initCloudFilesExplorer() {
  const uploadBtn = document.getElementById('btn-cloud-upload');
  const fileInput = document.getElementById('cloud-file-input');
  const statusEl = document.getElementById('upload-status');
  
  if (!supabaseClient) {
    const tbody = document.getElementById('files-table-body');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" class="no-files-placeholder error-text">Error: Supabase is not configured. Check script.js configuration.</td></tr>`;
    }
    return;
  }
  
  // Fetch and display already uploaded files
  loadFilesFromSupabase();

  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', async () => {
      const file = fileInput.files[0];
      if (!file) {
        statusEl.textContent = 'Warning: Please select a file first.';
        statusEl.className = 'upload-status-text error-msg visible';
        return;
      }

      statusEl.textContent = `Streaming "${file.name}" to Cloud Storage...`;
      statusEl.className = 'upload-status-text info-msg visible';

      try {
        // 1. Upload the file to Supabase bucket 'file-uploads'
        const fileExt = file.name.split('.').pop();
        const fileNameOnly = file.name.replace(/\.[^/.]+$/, "");
        const cleanPath = `uploads/${Date.now()}_${fileNameOnly}.${fileExt}`;

        const { data, error } = await supabaseClient
          .storage
          .from('file-uploads')
          .upload(cleanPath, file);

        if (error) {
          throw error;
        }

        // 2. Retrieve Public Download Link
        const { data: urlData } = supabaseClient
          .storage
          .from('file-uploads')
          .getPublicUrl(cleanPath);

        const publicUrl = urlData.publicUrl;

        // 3. Log Metadata in 'file_metadata' table
        const { error: dbError } = await supabaseClient
          .from('file_metadata')
          .insert([
            { name: file.name, size: file.size, download_url: publicUrl }
          ]);

        if (dbError) {
          throw dbError;
        }

        statusEl.textContent = `Success: "${file.name}" uploaded and logged inside cloud.`;
        statusEl.className = 'upload-status-text success-text visible';
        fileInput.value = ''; // Reset file input

        // Reload lists in real-time
        loadFilesFromSupabase();

      } catch (err) {
        console.error('Upload Process Failed:', err.message);
        statusEl.textContent = `Upload Failed: ${err.message}`;
        statusEl.className = 'upload-status-text error-msg visible';
      }
    });
  }
}

async function loadFilesFromSupabase() {
  const tbody = document.getElementById('files-table-body');
  if (!tbody || !supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from('file_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="no-files-placeholder">No files in cloud bucket. Upload a file above to begin!</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(file => {
      const sizeKB = (file.size / 1024).toFixed(1);
      // Formatting time neatly
      const dateStr = new Date(file.created_at).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return `
        <tr>
          <td><strong>${escapeHtml(file.name)}</strong></td>
          <td>${sizeKB} KB</td>
          <td>${dateStr}</td>
          <td><a href="${file.download_url}" target="_blank" rel="noopener noreferrer" class="download-link-btn">&#8595; Download</a></td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Error fetching files:', err.message);
    tbody.innerHTML = `<tr><td colspan="4" class="no-files-placeholder error-text">Could not load files: ${err.message}</td></tr>`;
  }
}

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* ==========================================================================
   12. HTML5 DRAG & DROP AND WEB STORAGE SANDBOX (Assignment 4)
   ========================================================================== */
function initHtml5Sandbox() {
  // --- DRAG & DROP API ---
  const securityToken = document.getElementById('security-token');
  const encryptionVault = document.getElementById('encryption-vault');
  const dragStatus = document.getElementById('drag-status');

  if (securityToken && encryptionVault && dragStatus) {
    // 1. Drag Start: Store token data and apply styling
    securityToken.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', 'AES-256-TOKEN-KEY');
      e.dataTransfer.effectAllowed = 'move';
      securityToken.classList.add('dragging');
      dragStatus.textContent = 'Status: Dragging token key...';
    });

    // End drag
    securityToken.addEventListener('dragend', () => {
      securityToken.classList.remove('dragging');
      if (!encryptionVault.contains(securityToken)) {
        dragStatus.textContent = 'Status: Vault Locked. Key is outside.';
        dragStatus.className = 'sandbox-status-text';
      }
    });

    // 2. Drag Over: Required to allow dropping
    encryptionVault.addEventListener('dragover', (e) => {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = 'move';
    });

    // 3. Drag Enter: Visual highlight
    encryptionVault.addEventListener('dragenter', (e) => {
      e.preventDefault();
      encryptionVault.classList.add('drag-active');
      dragStatus.textContent = 'Status: Hovering over the Vault...';
    });

    // 4. Drag Leave: Remove visual highlight
    encryptionVault.addEventListener('dragleave', () => {
      encryptionVault.classList.remove('drag-active');
      dragStatus.textContent = 'Status: Dragging token key...';
    });

    // 5. Drop Event: Perform docking and unlock actions
    encryptionVault.addEventListener('drop', (e) => {
      e.preventDefault();
      encryptionVault.classList.remove('drag-active');
      
      const tokenData = e.dataTransfer.getData('text/plain');
      
      if (tokenData === 'AES-256-TOKEN-KEY') {
        // Dock the key inside the dropzone
        encryptionVault.appendChild(securityToken);
        
        // Update statuses and show success
        dragStatus.textContent = 'Status: SUCCESS! Vault Unlocked. Advanced Encryption Enabled.';
        dragStatus.className = 'sandbox-status-text success-text';
        encryptionVault.classList.add('unlocked');
        encryptionVault.querySelector('.vault-icon').innerHTML = '🔓';
        encryptionVault.querySelector('.vault-text').textContent = 'Vault Slot: Active';
        
        // Push a live notification to the system notification list
        pushLiveNotification('Success: Advanced hardware security vault unlocked.');
      }
    });
  }

  // Helper to push a notification dynamically in browser
  function pushLiveNotification(message) {
    const notifyList = document.querySelector('.notification-list');
    const badge = document.getElementById('notify-badge-count');

    if (notifyList) {
      // Remove placeholder "No notifications"
      const emptyPlaceholder = notifyList.querySelector('.no-notifications-item');
      if (emptyPlaceholder) emptyPlaceholder.remove();

      const li = document.createElement('li');
      li.className = 'notify-item success-notify animate-slide-in-top';
      li.innerHTML = `
        <span class="notify-bullet">🔓</span>
        <div>
          <strong>Security Sandbox:</strong> ${message}
          <p class="notify-time-ago">Just now</p>
        </div>
      `;
      notifyList.insertBefore(li, notifyList.firstChild);

      // Increment badge count
      if (badge) {
        let count = parseInt(badge.textContent, 10) || 0;
        count++;
        badge.textContent = count;
        badge.style.display = 'flex';
      }
    }
  }

  // --- WEB STORAGE API ---
  const localInput = document.getElementById('local-input');
  const sessionInput = document.getElementById('session-input');
  
  const btnSave = document.getElementById('btn-save-storage');
  const btnRetrieve = document.getElementById('btn-retrieve-storage');
  const btnClear = document.getElementById('btn-clear-storage');
  
  const localOutput = document.getElementById('local-output-val');
  const sessionOutput = document.getElementById('session-output-val');

  // Pre-load draft data from storage (UX polish)
  if (localInput && localStorage.getItem('userNickname')) {
    localInput.value = localStorage.getItem('userNickname');
  }
  if (sessionInput && sessionStorage.getItem('sessionFilterKey')) {
    sessionInput.value = sessionStorage.getItem('sessionFilterKey');
  }

  // Save Event
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const localVal = localInput ? localInput.value.trim() : '';
      const sessionVal = sessionInput ? sessionInput.value.trim() : '';

      // Save permanently to localStorage
      if (localVal) {
        localStorage.setItem('userNickname', localVal);
      } else {
        localStorage.removeItem('userNickname');
      }

      // Save temporarily to sessionStorage
      if (sessionVal) {
        sessionStorage.setItem('sessionFilterKey', sessionVal);
      } else {
        sessionStorage.removeItem('sessionFilterKey');
      }

      alert('Web Storage Synced Successfully!\n\n- Local Storage (Permanent) Updated\n- Session Storage (Temporary) Updated');
    });
  }

  // Retrieve & Display Event
  if (btnRetrieve) {
    btnRetrieve.addEventListener('click', () => {
      const localVal = localStorage.getItem('userNickname');
      const sessionVal = sessionStorage.getItem('sessionFilterKey');

      if (localOutput) {
        if (localVal) {
          localOutput.textContent = `"${localVal}" (Saved permanently)`;
          localOutput.className = 'val-saved';
        } else {
          localOutput.textContent = 'Empty';
          localOutput.className = 'empty-val';
        }
      }

      if (sessionOutput) {
        if (sessionVal) {
          sessionOutput.textContent = `"${sessionVal}" (Active tab session only)`;
          sessionOutput.className = 'val-saved';
        } else {
          sessionOutput.textContent = 'Empty';
          sessionOutput.className = 'empty-val';
        }
      }
    });
  }

  // Clear Event
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all data in Local Storage and Session Storage?')) {
        // Clear items
        localStorage.removeItem('userNickname');
        sessionStorage.removeItem('sessionFilterKey');

        // Reset inputs
        if (localInput) localInput.value = '';
        if (sessionInput) sessionInput.value = '';

        // Reset badges
        if (localOutput) {
          localOutput.textContent = 'Wiped / Empty';
          localOutput.className = 'empty-val';
        }
        if (sessionOutput) {
          sessionOutput.textContent = 'Wiped / Empty';
          sessionOutput.className = 'empty-val';
        }

        alert('Web Storage Cleared successfully.');
      }
    });
  }
}
