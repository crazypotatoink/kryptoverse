// Mobile Sidebar Functionality
// document.addEventListener('DOMContentLoaded', () => {
//     const sidebar = document.querySelector('.sidebar');
//     const mobileMenuBtn = document.querySelector('.mobile-menu');
//     let sidebarOverlay;

//     // Create and append overlay if it doesn't exist
//     if (!document.querySelector('.sidebar-overlay')) {
//         sidebarOverlay = document.createElement('div');
//         sidebarOverlay.className = 'sidebar-overlay';
//         document.body.appendChild(sidebarOverlay);
//     } else {
//         sidebarOverlay = document.querySelector('.sidebar-overlay');
//     }

//     // Toggle sidebar
//     function toggleSidebar() {
//         sidebar.classList.toggle('active');
//         sidebarOverlay.classList.toggle('active');
//         document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
//     }

//     // Event listeners
//     mobileMenuBtn.addEventListener('click', (e) => {
//         e.stopPropagation();
//         toggleSidebar();
//         // Update menu icon
//         const menuIcon = mobileMenuBtn.querySelector('i');
//         menuIcon.classList.toggle('fa-bars');
//         menuIcon.classList.toggle('fa-times');
//     });

//     // Close sidebar when clicking overlay
//     sidebarOverlay.addEventListener('click', () => {
//         if (sidebar.classList.contains('active')) {
//             toggleSidebar();
//             const menuIcon = mobileMenuBtn.querySelector('i');
//             menuIcon.classList.remove('fa-times');
//             menuIcon.classList.add('fa-bars');
//         }
//     });

//     // Close sidebar when clicking a link
//     sidebar.addEventListener('click', (e) => {
//         if (e.target.tagName === 'A' && window.innerWidth <= 768) {
//             toggleSidebar();
//             const menuIcon = mobileMenuBtn.querySelector('i');
//             menuIcon.classList.remove('fa-times');
//             menuIcon.classList.add('fa-bars');
//         }
//     });

//     sidebar.addEventListener('touchmove', (e) => {
//         if (sidebar.classList.contains('show')) {
//             e.preventDefault();
//         }
//     }, { passive: false });

//     // Close sidebar on window resize
//     window.addEventListener('resize', () => {
//         if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
//             toggleSidebar();
//             const menuIcon = mobileMenuBtn.querySelector('i');
//             menuIcon.classList.remove('fa-times');
//             menuIcon.classList.add('fa-bars');
//         }
//     });
// });

// Theme Toggle Functionality
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
    updateThemeIcon();
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    updateThemeIcon();
    // Save theme preference
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode');
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    navLinks.classList.toggle('show');
    // Update menu icon
    const menuIcon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('show')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('show');
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a nav link
navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
        navLinks.classList.remove('show');
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu on window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('show');
        const menuIcon = mobileMenuBtn.querySelector('i');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Prevent scrolling when mobile menu is open
navLinks.addEventListener('touchmove', (e) => {
    if (navLinks.classList.contains('show')) {
        e.preventDefault();
    }
}, { passive: false });