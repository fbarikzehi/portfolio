// Utility function to select elements safely
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}


// Mobile menu toggle functionality
function initMobileMenu() {
    // Create hamburger menu button if it doesn't exist
    const nav = $('nav');
    const navList = $('nav ul');

    if (!$('.hamburger-menu')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-menu';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        nav.insertBefore(hamburger, navList);
    }

    const hamburger = $('.hamburger-menu');

    hamburger.addEventListener('click', toggleMenu);
}

function toggleMenu() {
    const hamburger = $('.hamburger-menu');
    const navList = $('nav ul');
    const isOpen = navList.classList.contains('nav-open');

    navList.classList.toggle('nav-open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);

    // Close menu when clicking outside
    if (!isOpen) {
        document.addEventListener('click', closeMenuOnOutsideClick);
    } else {
        document.removeEventListener('click', closeMenuOnOutsideClick);
    }
}

function closeMenuOnOutsideClick(event) {
    const nav = $('nav');
    if (!nav.contains(event.target)) {
        const navList = $('nav ul');
        const hamburger = $('.hamburger-menu');

        navList.classList.remove('nav-open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = $$('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = $('#' + targetId);

            if (targetSection) {
                const headerHeight = $('header').offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navList = $('nav ul');
                const hamburger = $('.hamburger-menu');
                if (navList.classList.contains('nav-open')) {
                    navList.classList.remove('nav-open');
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }

                // Update active navigation state
                updateActiveNavigation(targetId);
            }
        });
    });
}

// Update active navigation based on scroll position
function updateActiveNavigation(activeId = null) {
    const navLinks = $$('nav a[href^="#"]');

    if (activeId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href').substring(1);
            if (href === activeId) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
        return;
    }

    // Auto-detect active section based on scroll position
    const sections = $$('section[id]');
    const scrollPosition = window.scrollY + 100;

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.setAttribute('aria-current', 'page');
            link.classList.add('active');
        } else {
            link.removeAttribute('aria-current');
            link.classList.remove('active');
        }
    });
}

// =======================
// PROJECT FILTERING
// =======================

function initProjectFiltering() {
    const projectsSection = $('#projects');
    const projectsGrid = $('.projects-grid');

    if (!projectsGrid) return;

    // Create filter buttons
    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filters';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">All Projects</button>
        <button class="filter-btn" data-filter="react">React</button>
        <button class="filter-btn" data-filter="vue">Vue.js</button>
        <button class="filter-btn" data-filter="javascript">JavaScript</button>
        <button class="filter-btn" data-filter="fullstack">Full Stack</button>
    `;

    projectsSection.insertBefore(filterContainer, projectsGrid);

    // Add event listeners to filter buttons
    const filterButtons = $$('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.dataset.filter;
            filterProjects(filter);

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function filterProjects(category) {
    const projects = $$('.project-card');

    projects.forEach(project => {
        const techTags = project.querySelectorAll('.tech-tag');
        const techList = Array.from(techTags).map(tag => tag.textContent.toLowerCase());

        let shouldShow = false;

        if (category === 'all') {
            shouldShow = true;
        } else if (category === 'react') {
            shouldShow = techList.some(tech => tech.includes('react'));
        } else if (category === 'vue') {
            shouldShow = techList.some(tech => tech.includes('vue'));
        } else if (category === 'javascript') {
            shouldShow = techList.some(tech => tech.includes('javascript'));
        } else if (category === 'fullstack') {
            shouldShow = techList.some(tech =>
                tech.includes('node') || tech.includes('mongodb') || tech.includes('express')
            );
        }

        if (shouldShow) {
            project.style.display = 'block';
            project.style.opacity = '0';
            setTimeout(() => {
                project.style.opacity = '1';
            }, 50);
        } else {
            project.style.opacity = '0';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

function initLightbox() {
    const projectImages = $$('.project-card figure img');

    // Create lightbox HTML
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay">
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <img src="" alt="" class="lightbox-image">
                <div class="lightbox-caption"></div>
                <div class="lightbox-navigation">
                    <button class="lightbox-prev" aria-label="Previous image">&#8249;</button>
                    <button class="lightbox-next" aria-label="Next image">&#8250;</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    let currentImageIndex = 0;
    const images = Array.from(projectImages);

    // Add click events to project images
    projectImages.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', function () {
            currentImageIndex = index;
            openLightbox(this);
        });
    });

    // Lightbox event listeners
    $('.lightbox-close').addEventListener('click', closeLightbox);
    $('.lightbox-overlay').addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    $('.lightbox-prev').addEventListener('click', function () {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    });

    $('.lightbox-next').addEventListener('click', function () {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                $('.lightbox-prev').click();
                break;
            case 'ArrowRight':
                $('.lightbox-next').click();
                break;
        }
    });

    function openLightbox(clickedImg) {
        const lightboxImg = $('.lightbox-image');
        const lightboxCaption = $('.lightbox-caption');

        lightboxImg.src = clickedImg.src;
        lightboxImg.alt = clickedImg.alt;
        lightboxCaption.textContent = clickedImg.closest('figure').querySelector('figcaption').textContent;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        const img = images[currentImageIndex];
        const lightboxImg = $('.lightbox-image');
        const lightboxCaption = $('.lightbox-caption');

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = img.closest('figure').querySelector('figcaption').textContent;
    }
}


function initFormValidation() {
    const form = $('#contact-form');
    if (!form) return;

    const fields = {
        name: $('#name'),
        email: $('#email'),
        subject: $('#subject'),
        message: $('#message')
    };

    // Real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName, field));
        }
    });

    // Form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateForm()) {
            submitForm();
        }
    });
}

function validateField(fieldName, field) {
    const value = field.value.trim();
    const errorElement = $('#' + fieldName + '-error');

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Please select a subject';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }

    if (errorElement) {
        if (isValid) {
            errorElement.textContent = '';
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            errorElement.textContent = errorMessage;
            field.classList.add('error');
            field.classList.remove('valid');
        }
    }

    return isValid;
}

function clearFieldError(fieldName) {
    const field = $('#' + fieldName);
    const errorElement = $('#' + fieldName + '-error');

    if (field.value.trim() && errorElement) {
        field.classList.remove('error');
        errorElement.textContent = '';
    }
}

function validateForm() {
    const fields = ['name', 'email', 'subject', 'message'];
    let isFormValid = true;

    fields.forEach(fieldName => {
        const field = $('#' + fieldName);
        if (field && !validateField(fieldName, field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function submitForm() {
    const form = $('#contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Show success message
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');

        // Reset form
        form.reset();

        // Clear validation states
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'error');
        });

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

    }, 2000);
}

function showFormMessage(message, type) {
    // Create or update message element
    let messageElement = $('.form-message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'form-message';
        $('#contact-form').appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    messageElement.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections and project cards
    const elementsToAnimate = $$('section, .project-card, .skill-category');
    elementsToAnimate.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}


// Lazy loading for images
function initLazyLoading() {
    const images = $$('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        return;
    }

    // Fallback for browsers without native lazy loading
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

function handleError(error, context) {
    console.error(`Error in ${context}:`, error);

    // You can add user-friendly error notifications here
    if (context === 'form-submission') {
        showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    }
}

function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    try {
        debugLog('Initializing portfolio website...');

        // Initialize all components
        initMobileMenu();
        initSmoothScrolling();
        initProjectFiltering();
        initLightbox();
        initFormValidation();
        initScrollAnimations();
        initLazyLoading();

        debugLog('Portfolio website initialized successfully');

    } catch (error) {
        handleError(error, 'initialization');
    }
});

// Global error handler
window.addEventListener('error', function (e) {
    handleError(e.error, 'global');
});

// Export functions for potential external use
window.PortfolioJS = {
    toggleMenu,
    filterProjects,
    validateForm,
    debugLog
};