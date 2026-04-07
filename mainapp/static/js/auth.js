// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-eye');
            this.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye-slash');
            this.classList.add('fa-eye');
        }
    });
});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show success message if redirected after registration
if (window.location.search.includes('registered=true')) {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = '<i class="fas fa-check-circle"></i> Registration successful! Please log in.';
    document.querySelector('.auth-card').insertBefore(message, document.querySelector('.auth-form'));
}