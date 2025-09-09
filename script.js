// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ========== NAVIGATION ENHANCEMENTS ==========
  // Mobile menu close on link click
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelectorAll('.site-nav a');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle.checked) {
        navToggle.checked = false;
      }
    });
  });

  // ========== SMOOTH SCROLLING ==========
  // Smooth scrolling with offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== PRICING PREFERENCE ==========
  // Remember pricing preference
  const billingToggle = document.getElementById('billing');
  
  // Load saved preference
  const savedPreference = localStorage.getItem('billingPreference');
  if (savedPreference === 'yearly') {
    billingToggle.checked = true;
  }
  
  // Save preference on change
  billingToggle.addEventListener('change', function() {
    localStorage.setItem('billingPreference', this.checked ? 'yearly' : 'monthly');
  });

  // ========== DEMO SECTION ENHANCEMENTS ==========
  // Auto-advance demo steps
  const demoSteps = document.querySelectorAll('input[name="step"]');
  let currentStep = 0;
  let demoInterval;
  
  function startDemo() {
    demoInterval = setInterval(() => {
      currentStep = (currentStep + 1) % demoSteps.length;
      demoSteps[currentStep].checked = true;
    }, 3000);
  }
  
  // Start auto-advance on page load
  startDemo();
  
  // Pause on user interaction
  const stepLabels = document.querySelectorAll('.step-select label');
  stepLabels.forEach(label => {
    label.addEventListener('click', () => {
      clearInterval(demoInterval);
      setTimeout(startDemo, 10000); // Restart after 10s
    });
  });

  // ========== DEPLOYMENT SIMULATION ==========
  const deployButtons = document.querySelectorAll('a[href="#deploy"]');
  
  deployButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Show loading state
      const originalText = this.textContent;
      this.innerHTML = '<span class="spinner"></span> Deploying...';
      this.classList.add('deploying');
      
      // Simulate deployment process
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% success rate
          showToast('Deployment successful! Your app is now live.', 'success');
        } else {
          showToast('Deployment failed. Please check your configuration.', 'error');
        }
        
        // Reset button
        this.textContent = originalText;
        this.classList.remove('deploying');
      }, 2000);
    });
  });

  // ========== FORM VALIDATION ==========
  const contactForm = document.querySelector('form[name="contact"]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const email = this.querySelector('[name="email"]');
      const message = this.querySelector('[name="message"]');
      let isValid = true;
      
      if (!validateEmail(email.value)) {
        showInputError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      if (message.value.length < 10) {
        showInputError(message, 'Message must be at least 10 characters');
        isValid = false;
      }
      
      if (isValid) {
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
          showToast('Message sent successfully! We\'ll contact you soon.', 'success');
          this.reset();
          submitButton.textContent = 'Send Message';
          submitButton.disabled = false;
        }, 1500);
      }
    });
    
    // Clear errors on input
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearInputError(input);
      });
    });
  }
  
  // ========== AUTHENTICATION ENHANCEMENTS ==========
  // Update UI based on auth status
  function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButtons = document.querySelectorAll('a[href="login.html"], a[href="#login"]');
    
    if (isLoggedIn) {
      loginButtons.forEach(button => {
        button.textContent = 'Dashboard';
        button.href = 'dashboard.html';
      });
    }
  }

  // Initialize auth UI
  updateAuthUI();

  // ========== PASSWORD STRENGTH METER ==========
  // This would be used on signup pages
  function initPasswordStrengthMeter() {
    const passwordInput = document.getElementById('new-password');
    if (!passwordInput) return;
    
    const meter = document.createElement('div');
    meter.className = 'password-strength';
    meter.innerHTML = `
      <div class="strength-bar">
        <div class="strength-fill"></div>
      </div>
      <div class="strength-text">Password strength: <span>None</span></div>
    `;
    passwordInput.parentNode.appendChild(meter);
    
    passwordInput.addEventListener('input', function() {
      const strength = calculatePasswordStrength(this.value);
      updateStrengthMeter(meter, strength);
    });
  }

  function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5); // Max strength of 5
  }

  function updateStrengthMeter(meter, strength) {
    const fill = meter.querySelector('.strength-fill');
    const text = meter.querySelector('.strength-text span');
    
    // Update width
    fill.style.width = `${strength * 20}%`;
    
    // Update color and text
    const classes = ['weak', 'fair', 'good', 'strong', 'very-strong'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
    
    fill.className = 'strength-fill';
    if (strength > 0) {
      fill.classList.add(classes[strength - 1]);
    }
    
    text.textContent = strength > 0 ? labels[strength - 1] : 'None';
  }

  // ========== DARK MODE TOGGLE ==========
  function initDarkModeToggle() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Create toggle button if it doesn't exist
    if (!document.getElementById('theme-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.id = 'theme-toggle';
      toggleBtn.className = 'btn btn-subtle';
      toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <span class="visually-hidden">Toggle dark mode</span>
      `;
      
      // Add to header if it exists
      const headerCtAs = document.querySelector('.header-ctas');
      if (headerCtAs) {
        headerCtAs.prepend(toggleBtn);
      }
      
      toggleBtn.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }
      });
    }
  }

  // Initialize when DOM is loaded
  initDarkModeToggle();
  
  // Add CSS for dark mode if not already present
  if (!document.querySelector('style[data-dark-mode]')) {
    const darkModeCSS = `
      [data-theme="dark"] {
        --bg: 224, 32%, 12%;
        --surface: 224, 32%, 18%;
        --surface-2: 224, 32%, 24%;
        --text: 220, 14%, 90%;
        --text-weak: 220, 14%, 70%;
        --text-strong: 220, 20%, 98%;
        --border: 224, 32%, 30%;
      }
      
      .password-strength {
        margin-top: 0.5rem;
      }
      
      .strength-bar {
        height: 6px;
        background: hsl(var(--surface-2));
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }
      
      .strength-fill {
        height: 100%;
        width: 0;
        transition: width 0.3s ease;
      }
      
      .strength-fill.weak { background: hsl(var(--error)); }
      .strength-fill.fair { background: orange; }
      .strength-fill.good { background: yellow; }
      .strength-fill.strong { background: limegreen; }
      .strength-fill.very-strong { background: hsl(var(--success)); }
      
      .strength-text {
        font-size: 0.875rem;
        color: hsl(var(--text-weak));
      }
    `;
    
    const style = document.createElement('style');
    style.setAttribute('data-dark-mode', 'true');
    style.textContent = darkModeCSS;
    document.head.appendChild(style);
  }
  
  // ========== HELPER FUNCTIONS ==========
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showInputError(input, message) {
    clearInputError(input);
    const error = document.createElement('p');
    error.className = 'input-error';
    error.textContent = message;
    input.parentNode.appendChild(error);
    input.classList.add('error');
  }
  
  function clearInputError(input) {
    const error = input.parentNode.querySelector('.input-error');
    if (error) error.remove();
    input.classList.remove('error');
  }
  
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 5000);
  }
});