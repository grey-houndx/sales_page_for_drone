// Main JavaScript file for AeroVision Studios Landing Page

document.addEventListener('DOMContentLoaded', () => {
    console.log('AeroVision Studios landing page scripts loaded.'); // Keep this initial log
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
                // Ensure the apostrophe is escaped here
                formMessages.textContent = 'Thank you for your request! We\'ll be in touch soon. (Demo submission)';
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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme("light"); // Default to light mode
    }
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

    // Portfolio Video Custom Play Button Functionality
    const portfolioItems = document.querySelectorAll(".portfolio-item");
    if (portfolioItems.length > 0) {
        portfolioItems.forEach(item => {
            const video = item.querySelector("video");
            const playButton = item.querySelector(".custom-play-button");

            if (video && playButton) {
                // Show play button initially
                playButton.style.display = "flex"; // Matches CSS display for centering icon

                playButton.addEventListener("click", () => {
                    video.play();
                    playButton.style.display = "none";
                    video.setAttribute("controls", "true"); // Show default controls once playing
                });

                video.addEventListener("ended", () => {
                    playButton.style.display = "flex";
                    video.removeAttribute("controls");
                    // video.load(); // Consider if needed: Resets video to show poster frame.
                                  // load() can be heavy. currentTime = 0 might be enough if poster is set.
                    video.currentTime = 0; // Rewind to beginning to show poster
                });

                video.addEventListener("pause", () => {
                    if (!video.ended && video.hasAttribute("controls")) {
                        setTimeout(() => {
                            if (!video.ended && video.paused) { // Double check paused state after timeout
                                playButton.style.display = "flex";
                            }
                        }, 50);
                    }
                });

                video.addEventListener("click", () => {
                    if (!video.hasAttribute("controls") && video.paused) {
                        video.play();
                        playButton.style.display = "none";
                        video.setAttribute("controls", "true");
                    }
                });
            }
        });
    }

    // Portfolio Carousel Functionality
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
        const carouselWrapper = portfolioSection.querySelector(".portfolio-carousel-wrapper");
        const portfolioGrid = portfolioSection.querySelector(".portfolio-grid");
        const portfolioItems = portfolioSection.querySelectorAll(".portfolio-item");
        const prevArrow = portfolioSection.querySelector(".carousel-arrow.prev");
        const nextArrow = portfolioSection.querySelector(".carousel-arrow.next");
        const dotsContainer = portfolioSection.querySelector(".carousel-dots");

        if (carouselWrapper && portfolioGrid && portfolioItems.length > 0 && prevArrow && nextArrow && dotsContainer) {
            console.log("Initializing Portfolio Carousel with Autoplay..."); // Debug log
            let currentIndex = 0;
            const totalItems = portfolioItems.length;
            let autoplayInterval = null;
            const autoplayDelay = 7000; // 7 seconds

            // Create dots
            for (let i = 0; i < totalItems; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                dot.setAttribute("data-index", i);
                dot.addEventListener("click", () => {
                    stopAutoplay();
                    goToSlide(i);
                    startAutoplay(); // Restart autoplay after manual interaction
                });
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll(".dot");

            function updateDots(index) {
                if (dots.length > 0) {
                    dots.forEach(d => d.classList.remove("active"));
                    if (dots[index]) {
                        dots[index].classList.add("active");
                    }
                }
            }

            function goToSlide(index) {
                console.log(`Carousel: Going to slide ${index}`); // Debug log
                currentIndex = index;
                const newTransformValue = -currentIndex * (100 / totalItems);
                portfolioGrid.style.transform = `translateX(${newTransformValue}%)`;
                updateDots(currentIndex);
            }

            function startAutoplay() {
                stopAutoplay();
                console.log("Carousel: Starting autoplay..."); // Debug log
                autoplayInterval = setInterval(() => {
                    let nextIndex = currentIndex + 1;
                    if (nextIndex >= totalItems) {
                        nextIndex = 0;
                    }
                    goToSlide(nextIndex);
                }, autoplayDelay);
            }

            function stopAutoplay() {
                if (autoplayInterval) {
                    console.log("Carousel: Stopping autoplay."); // Debug log
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }

            nextArrow.addEventListener("click", () => {
                stopAutoplay();
                let nextIndex = currentIndex + 1;
                if (nextIndex >= totalItems) {
                    nextIndex = 0;
                }
                goToSlide(nextIndex);
                startAutoplay();
            });

            prevArrow.addEventListener("click", () => {
                stopAutoplay();
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = totalItems - 1;
                }
                goToSlide(prevIndex);
                startAutoplay();
            });

            carouselWrapper.addEventListener("mouseenter", stopAutoplay);
            carouselWrapper.addEventListener("mouseleave", startAutoplay);

            // Initial setup
            if (dots.length > 0) {
                 goToSlide(0);
            }
            startAutoplay(); // Start autoplay initially
        } else {
            console.warn("Portfolio carousel elements not fully found. Carousel JS not initialized.");
        }
    } // End of if (portfolioSection)
});
