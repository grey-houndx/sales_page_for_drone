// Main JavaScript file for AeroVision Studios Landing Page

document.addEventListener('DOMContentLoaded', () => {
    console.log('AeroVision Studios landing page scripts loaded.');
    const heroContent = document.querySelector('#hero .hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.5s ease-in-out';
            heroContent.style.opacity = '1';
        }, 100); // Slight delay to ensure transition is applied
    }

    // Smooth scroll for anchor links (if any are added later)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) { // Check if it's more than just "#"
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Contact Form Validation
    const quoteForm = document.getElementById('quoteForm');
    const formMessages = document.getElementById('formMessages');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent actual submission for now
            formMessages.textContent = ''; // Clear previous messages
            formMessages.className = ''; // Reset classes

            let isValid = true;
            let message = '';

            // Basic Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const projectDetails = document.getElementById('projectDetails').value.trim();

            if (name === '') {
                isValid = false;
                message = 'Full Name is required.';
            } else if (email === '') {
                isValid = false;
                message = 'Email Address is required.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                message = 'Please enter a valid Email Address.';
            } else if (projectDetails === '') {
                isValid = false;
                message = 'Project Details are required.';
            }

            if (isValid) {
                formMessages.textContent = 'Thank you for your request! We'll be in touch soon. (Demo submission)';
                formMessages.classList.add('success');
                quoteForm.reset(); // Clear the form
            } else {
                formMessages.textContent = message;
                formMessages.classList.add('error');
            }
        });
    }

    // Set current year in footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Dark/Light Mode Toggle Functionality
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;
    const sunIcon = "☀️"; // Icon for switching to light mode
    const moonIcon = "🌙"; // Icon for switching to dark mode

    // Function to apply theme based on preference
    const applyTheme = (theme) => {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            if (darkModeToggle) { // Check if toggle button exists
                darkModeToggle.textContent = sunIcon;
                darkModeToggle.setAttribute("aria-label", "Switch to light mode");
                darkModeToggle.setAttribute("title", "Switch to light mode");
            }
        } else {
            body.classList.remove("dark-mode");
            if (darkModeToggle) { // Check if toggle button exists
                darkModeToggle.textContent = moonIcon;
                darkModeToggle.setAttribute("aria-label", "Switch to dark mode");
                darkModeToggle.setAttribute("title", "Switch to dark mode");
            }
        }
    };

    // Check for saved theme preference on load
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to light mode if no preference or system preference check is not implemented
        applyTheme("light");
    }

    // Event listener for the toggle button
    if (darkModeToggle) { // Check if toggle button exists before adding listener
        darkModeToggle.addEventListener("click", () => {
            let newTheme;
            if (body.classList.contains("dark-mode")) {
                newTheme = "light";
            } else {
                newTheme = "dark";
            }
            applyTheme(newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
});
