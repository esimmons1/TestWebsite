// Enhanced JavaScript for Ellis Simmons Portfolio
// Multi-page structure with animated map graphic and smooth interactions

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupParticleBackground();
        this.setupAnimatedMap();
        this.setupMobileMenu();
        this.setupLightbox();
        this.setupIntersectionObserver();
    }

    // Navigation System for Multi-page Structure
    setupNavigation() {
        // Handle mobile menu
        const navToggle = document.querySelector(".nav-toggle");
        const navMenu = document.querySelector(".nav-menu");

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => {
                navToggle.classList.toggle("active");
                navMenu.classList.toggle("active");
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navToggle.classList.remove("active");
                    navMenu.classList.remove("active");
                });
            });

            // Close menu when clicking outside
            document.addEventListener("click", (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            });
        }
    }

    // Particle Background System (only for home page)
    setupParticleBackground() {
        const canvas = document.getElementById("background-canvas");
        if (!canvas) return; // Only run on home page
        
        const ctx = canvas.getContext("2d");
        
        let particles = [];
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                color: Math.random() > 0.5 ? "#4A90E2" : "#7F8C8D"
            };
        };

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 15000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(createParticle());
            }
        };

        const updateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around edges
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                // Subtle pulsing effect
                particle.opacity += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01;
                particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));
            });
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Draw connections between nearby particles
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.save();
                        ctx.globalAlpha = (100 - distance) / 100 * 0.1;
                        ctx.strokeStyle = "#4A90E2";
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
            });
        };

        const animate = () => {
            updateParticles();
            drawParticles();
            animationId = requestAnimationFrame(animate);
        };

        // Initialize
        resizeCanvas();
        initParticles();
        animate();

        // Handle resize
        window.addEventListener("resize", () => {
            resizeCanvas();
            initParticles();
        });

        // Pause animation when page is not visible
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    // Animated Map System (only for home page)
    setupAnimatedMap() {
        const mapContainer = document.querySelector(".map-container");
        if (!mapContainer) return; // Only run on home page

        // Enhanced SVG animation system
        this.createAdvancedCircuitAnimation();
    }

    // Creates racing track animation with progressive drawing effect
    // This system mimics anime.js createMotionPath functionality
    createAdvancedCircuitAnimation() {
        const svg = document.querySelector(".circuit-svg");
        if (!svg) return;

        // Get the racing track elements
        const motionPath = svg.querySelector("#racing-track-path");
        const progressiveTrack = svg.querySelector("#progressive-track");
        const racingCar = svg.querySelector("#racing-car");
        
        if (!motionPath || !progressiveTrack || !racingCar) {
            console.log("Missing elements:", { motionPath, progressiveTrack, racingCar });
            return;
        }

        // Get the total length of the path for animation calculations
        const pathLength = progressiveTrack.getTotalLength();
        
        // Set up the progressive track drawing effect
        progressiveTrack.style.strokeDasharray = pathLength;
        progressiveTrack.style.strokeDashoffset = pathLength;
        
        // Animation duration in milliseconds
        const duration = 16000;
        // Animation pause duration in milliseconds
        const pauseDuration = 48000;
        let startTime = null;
        
        // Animation function that runs each frame
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            
            // Calculate progress (0 to 1)
            const elapsed = currentTime - startTime;
            const progress = (elapsed % duration) / duration;
            
            // Update progressive track drawing
            const drawLength = pathLength * progress;
            progressiveTrack.style.strokeDashoffset = pathLength - drawLength;
            
            // Get the current position on the path for the car
            const point = progressiveTrack.getPointAtLength(drawLength);
            
            // Get the next point to calculate rotation
            const nextPoint = progressiveTrack.getPointAtLength(
                drawLength + 1 < pathLength ? drawLength + 1 : 0
            );
            
            // Calculate the angle for car rotation
            const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;
            
            // Position and rotate the car
            racingCar.setAttribute("transform", 
                `translate(${point.x}, ${point.y}) rotate(${angle})`
            );
            
            // Continue the animation
            requestAnimationFrame(animate);
        };
        
        // Start the animation
        requestAnimationFrame(animate);
        
        // Add click interaction to restart animation
        svg.addEventListener("click", () => {
            startTime = null;
        });
        
        // Add hover effects
        svg.addEventListener("mouseenter", () => {
            svg.style.transform = "scale(1.02)";
            svg.style.transition = "transform 0.3s ease";
        });

        svg.addEventListener("mouseleave", () => {
            svg.style.transform = "scale(1)";
        });
    }

    // Mobile Menu System
    setupMobileMenu() {
        const navToggle = document.querySelector(".nav-toggle");
        const navMenu = document.querySelector(".nav-menu");

        if (navToggle && navMenu) {
            navToggle.addEventListener("click", () => {
                navToggle.classList.toggle("active");
                navMenu.classList.toggle("active");
            });

            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll(".nav-link");
            navLinks.forEach(link => {
                link.addEventListener("click", () => {
                    navToggle.classList.remove("active");
                    navMenu.classList.remove("active");
                });
            });

            // Close menu when clicking outside
            document.addEventListener("click", (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.classList.remove("active");
                    navMenu.classList.remove("active");
                }
            });
        }
    }

    // Lightbox for Photography (only on photography page)
    setupLightbox() {
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const closeBtn = document.querySelector(".lightbox .close");

        if (!lightbox || !lightboxImg || !closeBtn) return; // Only run on photography page

        document.querySelectorAll(".gallery-item").forEach((img) => {
            img.addEventListener("click", () => {
                lightbox.style.display = "block";
                lightboxImg.src = img.src;
            });
        });

        closeBtn.addEventListener("click", () => {
            lightbox.style.display = "none";
        });

        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg) {
                lightbox.style.display = "none";
            }
        });

        // Close lightbox with Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.style.display === "block") {
                lightbox.style.display = "none";
            }
        });
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("animate-in");
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(".project-btn, .gallery-item, .skill-category");
        animateElements.forEach(el => observer.observe(el));

        // Add CSS for animations
        const style = document.createElement("style");
        style.textContent = `
            .project-btn, .gallery-item, .skill-category {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Enhanced utility functions for animations
class AnimationUtils {
    static createMotionPath(selector) {
        const element = document.querySelector(selector);
        if (!element) return null;

        return {
            element,
            path: element.getAttribute("d"),
            length: element.getTotalLength ? element.getTotalLength() : 0
        };
    }

    static createDrawable(selector) {
        const element = document.querySelector(selector);
        if (!element) return null;

        const length = element.getTotalLength ? element.getTotalLength() : 0;
        element.style.strokeDasharray = length;
        element.style.strokeDashoffset = length;

        return {
            element,
            length,
            draw: (progress) => {
                const offset = length * (1 - progress);
                element.style.strokeDashoffset = offset;
            }
        };
    }

    static morphTo(fromSelector, toSelector) {
        const fromElement = document.querySelector(fromSelector);
        const toElement = document.querySelector(toSelector);
        
        if (!fromElement || !toElement) return null;

        const fromPath = fromElement.getAttribute("d");
        const toPath = toElement.getAttribute("d");

        return {
            from: fromPath,
            to: toPath,
            animate: (duration = 1000) => {
                fromElement.style.transition = `d ${duration}ms ease`;
                fromElement.setAttribute("d", toPath);
            }
        };
    }
}

// Expose animation utilities globally for anime.js style animations
window.animate = (selector, options) => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!element) return;

    // Handle motion path animation with anime.js style
    if (options.ease && options.duration && options.loop) {
        if (typeof selector === 'string' && selector === '.car') {
            // Car motion path animation
            const pathElement = document.querySelector('#motionPath');
            if (pathElement && pathElement.getTotalLength) {
                const pathLength = pathElement.getTotalLength();
                let progress = 0;
                
                const animateMotion = () => {
                    progress += 1 / (options.duration / 16); // 60fps approximation
                    if (progress > 1) progress = 0; // Loop
                    
                    const point = pathElement.getPointAtLength(progress * pathLength);
                    element.style.transform = `translate(${point.x - 50}px, ${point.y - 300}px)`;
                    
                    if (options.loop) {
                        requestAnimationFrame(animateMotion);
                    }
                };
                animateMotion();
            }
        }
    }

    // Handle draw animation with anime.js style
    if (options.draw && options.ease && options.duration && options.loop) {
        const pathElement = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (pathElement && pathElement.getTotalLength) {
            const length = pathElement.getTotalLength();
            pathElement.style.strokeDasharray = length;
            pathElement.style.strokeDashoffset = length;
            
            let progress = 0;
            const animateDraw = () => {
                progress += 1 / (options.duration / 16); // 60fps approximation
                if (progress > 1) progress = 0; // Loop
                
                const offset = length * (1 - progress);
                pathElement.style.strokeDashoffset = offset;
                
                if (options.loop) {
                    requestAnimationFrame(animateDraw);
                }
            };
            animateDraw();
        }
    }
};

// Create svg namespace for anime.js compatibility
window.svg = {
    createMotionPath: (pathElement) => {
        return {}; // Return empty object for spread operator
    },
    createDrawable: (pathElement) => {
        return pathElement; // Return the actual element for chaining
    }
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new PortfolioApp();
    
    // Anime.js style animation code (only on home page)
    if (document.querySelector(".circuit-svg")) {
        setTimeout(() => {
            // Apply motion path to .car
            animate('.car', {
                ease: 'linear',
                duration: 8000,
                loop: true,
                ...svg.createMotionPath(document.querySelector('#motionPath'))
            });

            // Optional: draw the path
            animate(svg.createDrawable(document.querySelector('#motionPath')), {
                draw: '0 1',
                ease: 'linear',
                duration: 8000,
                loop: true
            });
        }, 1000);
    }
});

// Performance optimization
window.addEventListener("load", () => {
    // Preload any additional resources
    const preloadImages = () => {
        // Add any image preloading logic here
    };
    
    preloadImages();
});

// Export for potential module usage
if (typeof module !== "undefined" && module.exports) {
    module.exports = { PortfolioApp, AnimationUtils };
}

