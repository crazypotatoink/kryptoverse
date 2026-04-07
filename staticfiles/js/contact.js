<<<<<<< HEAD
// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', handleContactSubmit);

function handleContactSubmit(e) {
    e.preventDefault();
    removeErrorMessages();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form
    let isValid = true;

    if (name.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (subject.trim().length < 3) {
        showError('subject', 'Subject must be at least 3 characters long');
        isValid = false;
    }

    if (message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }

    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
            
            // Insert success message before form
            contactForm.parentElement.insertBefore(successMessage, contactForm);

            // Reset form and button
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.classList.add('input-error');
    if (input.tagName === 'TEXTAREA') {
        input.parentElement.appendChild(errorDiv);
    } else {
        input.parentElement.parentElement.appendChild(errorDiv);
    }
}

function removeErrorMessages() {
    // Remove all error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
}

// Add smooth scroll for map section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animate info cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
=======
// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', handleContactSubmit);

function handleContactSubmit(e) {
    e.preventDefault();
    removeErrorMessages();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form
    let isValid = true;

    if (name.trim().length < 2) {
        showError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }

    if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    if (subject.trim().length < 3) {
        showError('subject', 'Subject must be at least 3 characters long');
        isValid = false;
    }

    if (message.trim().length < 10) {
        showError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }

    if (isValid) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
            
            // Insert success message before form
            contactForm.parentElement.insertBefore(successMessage, contactForm);

            // Reset form and button
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        }, 1500);
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.classList.add('input-error');
    if (input.tagName === 'TEXTAREA') {
        input.parentElement.appendChild(errorDiv);
    } else {
        input.parentElement.parentElement.appendChild(errorDiv);
    }
}

function removeErrorMessages() {
    // Remove all error messages
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
}

// Add smooth scroll for map section
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Animate info cards on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.info-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
>>>>>>> 8a403ac6486f07d47d61e4f52108f2923cc21c68
});