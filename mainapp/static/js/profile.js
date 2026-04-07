// Generate and set user initials
function generateInitials(name) {
    if (!name) return 'KV';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (name.substring(0, 2)).toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {
    const userAvatar = document.querySelector('.user-avatar');
    if (!userAvatar) return; // Exit if element not found

    const userName = document.querySelector('.user-name')?.textContent || 'KryptoVerse User';

    // Remove existing icon if present
    const existingIcon = userAvatar.querySelector('i');
    if (existingIcon) {
        existingIcon.remove();
    }

    // Create and add initials
    const initialsSpan = document.createElement('span');
    initialsSpan.textContent = generateInitials(userName);
    initialsSpan.classList.add('user-initials');
    userAvatar.appendChild(initialsSpan);

    // Add click handler for logout
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            // The link now uses Django URL routing, no need for JavaScript handling
            // This is just for any additional logout logic you might want
            console.log('Logging out...');
        });
    }
});

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
}

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    document.body.classList.add('dark-mode');
}

// Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('depositModal');
    const depositBtns = document.querySelectorAll('.deposit-btn');
    const closeBtn = modal.querySelector('.close');
    const copyBtn = modal.querySelector('.copy-btn');
    const addressInput = modal.querySelector('.address-copy input');

    function showModal() {
        modal.style.display = 'block';
        // Trigger reflow
        modal.offsetHeight;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }

    depositBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const crypto = btn.closest('.crypto-deposit').dataset.crypto;
            const selectedCrypto = modal.querySelector('#selectedCrypto');
            const selectedCryptoWarning = modal.querySelector('#selectedCryptoWarning');

            selectedCrypto.textContent = crypto;
            selectedCryptoWarning.textContent = crypto;
            showModal();
        });
    });

    closeBtn.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    copyBtn.addEventListener('click', () => {
        addressInput.select();
        document.execCommand('copy');

        // Show feedback
        const icon = copyBtn.querySelector('i');
        const originalClass = icon.className;
        icon.className = 'fas fa-check';
        copyBtn.style.backgroundColor = 'var(--success-color)';

        setTimeout(() => {
            icon.className = originalClass;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            hideModal();
        }
    });
});

// Deposit Modal
const depositModal = document.getElementById('depositModal');
const depositBtns = document.querySelectorAll('.deposit-btn');
const closeModal = document.querySelector('.close-modal');

depositBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const crypto = btn.parentElement.getAttribute('data-crypto');
        const cryptoName = btn.parentElement.querySelector('h3').textContent;

        // Update modal content
        document.querySelectorAll('.crypto-name').forEach(el => {
            el.textContent = cryptoName;
        });

        // Show modal
        depositModal.style.display = 'block';
    });
});

closeModal.addEventListener('click', () => {
    depositModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === depositModal) {
        depositModal.style.display = 'none';
    }
});

// Copy wallet address
const copyBtn = document.querySelector('.copy-btn');
copyBtn.addEventListener('click', () => {
    const addressInput = document.querySelector('.address-copy input');
    addressInput.select();
    document.execCommand('copy');

    // Show feedback
    copyBtn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    }, 2000);
});

// Handle transfer form submission
const transferForm = document.getElementById('transferForm');
if (transferForm) {
    transferForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = transferForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        // Simulate transfer process
        setTimeout(() => {
            alert('Transfer initiated successfully!');
            transferForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Handle settings form submission
const settingsForm = document.getElementById('settingsForm');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = settingsForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        submitBtn.disabled = true;

        // Simulate saving settings
        setTimeout(() => {
            alert('Settings updated successfully!');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}
