document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Update ARIA expanded state
            const expanded = this.getAttribute('aria-expanded') === 'true' || false;
            this.setAttribute('aria-expanded', !expanded);
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Accessibility features
    const contrastToggle = document.getElementById('contrast-toggle');
    const fontIncrease = document.getElementById('font-increase');
    const fontDecrease = document.getElementById('font-decrease');
    
    // High contrast mode toggle
    if (contrastToggle) {
        contrastToggle.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            
            // Save preference to localStorage
            if (document.body.classList.contains('high-contrast')) {
                localStorage.setItem('high-contrast', 'true');
            } else {
                localStorage.setItem('high-contrast', 'false');
            }
        });
    }
    
    // Check if high contrast was previously enabled
    if (localStorage.getItem('high-contrast') === 'true') {
        document.body.classList.add('high-contrast');
    }
    
    // Font size adjustments
    if (fontIncrease) {
        fontIncrease.addEventListener('click', function() {
            changeFontSize(1);
        });
    }
    
    if (fontDecrease) {
        fontDecrease.addEventListener('click', function() {
            changeFontSize(-1);
        });
    }
    
    function changeFontSize(direction) {
        // Get current font size
        let currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        
        // Don't let font get too small or too large
        if ((direction > 0 && currentSize < 24) || (direction < 0 && currentSize > 12)) {
            // Change font size
            document.documentElement.style.fontSize = (currentSize + direction) + 'px';
            
            // Save to localStorage
            localStorage.setItem('font-size', document.documentElement.style.fontSize);
        }
    }
    
    // Check if font size was previously changed
    if (localStorage.getItem('font-size')) {
        document.documentElement.style.fontSize = localStorage.getItem('font-size');
    }
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
            
            // Scroll to the target element
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Offset for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    
                    window.scrollTo({
                        top: targetPosition - headerHeight,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form submission handling (for demo purposes)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Get multiple checkbox values
            formValues.interests = formData.getAll('interests');
            
            // In a real application, you would send this data to your server
            console.log('Form submitted with values:', formValues);
            
            // Show success message
            const formElement = this;
            formElement.innerHTML = `
                <div class="success-message" style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--secondary-color); margin-bottom: 20px;"></i>
                    <h3>Thanks for joining THRIVE!</h3>
                    <p>We've received your information and will be in touch soon.</p>
                </div>
            `;
        });
    }
    
    // Add animation on scroll
    const animateOnScroll = function() {
        // Animate cards and sections
        const elements = document.querySelectorAll('.problem-card, .feature-card, .testimonial, .step');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
        
        // Animate headings with word-by-word effect
        const headings = document.querySelectorAll('h2[data-animated="false"], h3[data-animated="false"]');
        
        headings.forEach(heading => {
            const elementPosition = heading.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 50) {
                // Mark as animated
                heading.setAttribute('data-animated', 'true');
                
                // Get the heading text
                const text = heading.innerText;
                const words = text.split(' ');
                
                // Clear the current text
                heading.innerHTML = '';
                
                // Add each word with a span and animation delay
                words.forEach((word, index) => {
                    const span = document.createElement('span');
                    span.innerText = word + ' ';
                    span.style.display = 'inline-block';
                    span.style.opacity = '0';
                    span.style.transform = 'translateY(20px)';
                    span.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    span.style.transitionDelay = `${index * 0.1}s`;
                    
                    heading.appendChild(span);
                    
                    // Trigger the animation
                    setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    }, 50);
                });
            }
        });
    };
    
    // Add phone hover effect functionality
    const phones = document.querySelectorAll('.phone');
    phones.forEach((phone, index) => {
        phone.addEventListener('mouseenter', function() {
            // Make this phone stand out
            this.style.transform = 'scale(1.05)';
            this.style.zIndex = '10';
            
            // Make other phones slightly transparent
            phones.forEach((otherPhone, otherIndex) => {
                if (otherIndex !== index) {
                    otherPhone.style.opacity = '0.7';
                    otherPhone.style.transform = otherPhone.classList.contains('phone-1') ? 
                        'translateX(-50%) rotate(-8deg)' : 
                        otherPhone.classList.contains('phone-3') ? 
                        'translateX(50%) rotate(8deg)' : 
                        'scale(0.95)';
                }
            });
        });
        
        phone.addEventListener('mouseleave', function() {
            // Reset all phones
            this.style.zIndex = '';
            phones.forEach((otherPhone) => {
                otherPhone.style.opacity = '1';
                otherPhone.style.transform = otherPhone.classList.contains('phone-1') ? 
                    'translateX(-50%) rotate(-5deg)' : 
                    otherPhone.classList.contains('phone-3') ? 
                    'translateX(50%) rotate(5deg)' : 
                    'none';
            });
        });
    });
    
    // Add hover effect to features
    const features = document.querySelectorAll('.app-feature, .feature-card, .problem-card');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('app-feature') ? 'translateX(10px)' : 'translateY(-15px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Animate section backgrounds on scroll
    const animateSectionBackground = function() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const scrollPosition = window.scrollY;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrollPosition > sectionTop - windowHeight && scrollPosition < sectionTop + sectionHeight) {
                const scrollPercentage = (scrollPosition - (sectionTop - windowHeight)) / (sectionHeight + windowHeight);
                section.style.backgroundPosition = `${scrollPercentage * 50}% ${scrollPercentage * 50}%`;
            }
        });
    };
    
    // Add parallax scrolling effect
    const parallaxScroll = function() {
        const scrollY = window.scrollY;
        
        // Parallax for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        
        // Parallax for floating elements
        document.querySelectorAll('.floating-element').forEach((el, index) => {
            const speed = 0.1 + (index * 0.05);
            el.style.transform = `translateY(${scrollY * speed}px) translateX(${scrollY * speed * 0.5}px)`;
        });
    };
    
    // Animate counters
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 20)); // Update every
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = Math.ceil(target / (duration / 20)); // Update every 20ms
            
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = current.toLocaleString();
                }
            }, 20);
        });
    }
    
    // Set initial styles for animation
    document.querySelectorAll('.problem-card, .feature-card, .testimonial, .step').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Mark all h2 and h3 elements for animation
    document.querySelectorAll('h2, h3').forEach(heading => {
        heading.setAttribute('data-animated', 'false');
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', function() {
        animateOnScroll();
        
        // Check if counters are in view and animate them
        const counterSection = document.querySelector('.community-counter');
        if (counterSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
            
            observer.observe(counterSection);
        }
        
        // Add subtle entrance animation to hero elements
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 300);
        }
    });
    
    window.addEventListener('scroll', function() {
        animateOnScroll();
        parallaxScroll();
        animateSectionBackground();
        
        // Back to top button visibility
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            if (window.scrollY > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
    });
    
    // Back to top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
