// Suraj Shanbhag Personal Website JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initSmoothScrolling();
  initContactForm();
  initScrollEffects();
});

// Global reCAPTCHA callback (already defined in HTML head)
// window.onRecaptchaSuccess = ...

// Navigation functionality
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });
    document.addEventListener("click", function (event) {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
  window.addEventListener("scroll", updateActiveNavLink);
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const navHeight = document.querySelector(".nav").offsetHeight;
        const topOffset = targetSection.offsetTop - navHeight - 20;
        window.scrollTo({ top: topOffset, behavior: "smooth" });
      }
    });
  });
}

// Update active navigation link based on scroll
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const navHeight = document.querySelector(".nav").offsetHeight;
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - navHeight - 100;
    const height = section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
    const inputs = contactForm.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
      input.addEventListener("blur", validateField);
      input.addEventListener("input", clearFieldError);
    });
  }
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const obj = {};
  for (let [k, v] of formData.entries()) obj[k] = v;
  const valid = validateForm(form);
  if (valid) {
    const btn = form.querySelector("button[type='submit']");
    const orig = btn.textContent;
    btn.textContent = "Sending...";
    btn.disabled = true;
    setTimeout(() => {
      showFormSuccess();
      form.reset();
      btn.textContent = orig;
      btn.disabled = false;
    }, 2000);
  }
}

// Validate entire form
function validateForm(form) {
  const required = form.querySelectorAll("[required]");
  let ok = true;
  required.forEach((field) => {
    if (!validateField({ target: field })) ok = false;
  });
  return ok;
}

// Validate individual field
function validateField(e) {
  const field = e.target;
  const val = field.value.trim();
  const type = field.type;
  const name = field.name;
  clearFieldError({ target: field });
  let ok = true, msg = "";
  if (field.hasAttribute("required") && !val) {
    ok = false;
    msg = `${getFieldLabel(name)} is required`;
  } else if (type === "email" && val && !isValidEmail(val)) {
    ok = false;
    msg = "Please enter a valid email address";
  } else if (name === "message" && val && val.length < 10) {
    ok = false;
    msg = "Message must be at least 10 characters long";
  }
  if (!ok) showFieldError(field, msg);
  return ok;
}

// Show field error
function showFieldError(field, message) {
  field.classList.add("error");
  const err = document.createElement("div");
  err.className = "field-error";
  err.textContent = message;
  err.style.color = "var(--color-error)";
  err.style.fontSize = "var(--font-size-sm)";
  err.style.marginTop = "var(--space-4)";
  field.parentNode.appendChild(err);
}

// Clear field error
function clearFieldError(e) {
  const field = e.target;
  field.classList.remove("error");
  const ex = field.parentNode.querySelector(".field-error");
  if (ex) ex.remove();
}

// Get field label
function getFieldLabel(name) {
  const labels = {
    name: "Full Name",
    email: "Email Address",
    company: "Company",
    service: "Service Interest",
    message: "Message",
  };
  return labels[name] || name;
}

// Email format check
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show form success message
function showFormSuccess() {
  const msg = document.createElement("div");
  msg.className = "form-success";
  msg.innerHTML = `
    <div style="
      background: rgba(var(--color-success-rgb),0.1);
      border:1px solid rgba(var(--color-success-rgb),0.3);
      color:var(--color-success);
      padding:var(--space-16);
      border-radius:var(--radius-base);
      margin-bottom:var(--space-16);
      text-align:center;
    ">
      <strong>Thank you for your message!</strong><br>
      I'll get back to you within 24 hours.
    </div>
  `;
  const form = document.getElementById("contactForm");
  if (form) {
    form.parentNode.insertBefore(msg, form);
    setTimeout(() => msg.remove(), 5000);
    msg.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Scroll effects
function initScrollEffects() {
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  });
  if ("IntersectionObserver" in window) initScrollAnimations();
}

// Scroll animations
function initScrollAnimations() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("animate-in");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document
    .querySelectorAll(".service-card, .deal-card, .timeline-item, .credential-card")
    .forEach((el) => {
      el.classList.add("animate-element");
      obs.observe(el);
    });
}

// Debounce utility
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

// Smooth scroll polyfill
function smoothScrollPolyfill() {
  if (!("scrollBehavior" in document.documentElement.style)) {
    const s = document.createElement("script");
    s.src =
      "https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@1.4.10/dist/smoothscroll.min.js";
    document.head.appendChild(s);
  }
}
smoothScrollPolyfill();
