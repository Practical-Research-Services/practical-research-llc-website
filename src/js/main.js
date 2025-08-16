/**
 * RESILIENT WEB DESIGN - PROGRESSIVE ENHANCEMENT JAVASCRIPT
 * 
 * This JavaScript follows progressive enhancement principles:
 * - Site works completely without JavaScript
 * - JavaScript only enhances the experience
 * - All functionality degrades gracefully
 * - Performance-conscious with minimal dependencies
 */

(function() {
    'use strict';
    
    // Only run if browser supports essential APIs
    if (!document.querySelector || !document.addEventListener) {
        return;
    }
    
    /**
     * NAVIGATION ENHANCEMENTS
     * Smooth scrolling and active section highlighting
     */
    function enhanceNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .toc-list a');
        const sections = document.querySelectorAll('.chapter');
        
        // Smooth scrolling for internal links
        navLinks.forEach(link => {
            // Only enhance internal links
            if (link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        e.preventDefault();
                        
                        // Use native smooth scrolling if supported
                        if ('scrollBehavior' in document.documentElement.style) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        } else {
                            // Fallback for older browsers
                            targetElement.scrollIntoView();
                        }
                        
                        // Update URL without jumping
                        if (history.pushState) {
                            history.pushState(null, null, this.getAttribute('href'));
                        }
                        
                        // Focus target for accessibility
                        targetElement.focus();
                    }
                });
            }
        });
        
        // Highlight current section in navigation
        function highlightCurrentSection() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('current');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('current');
                }
            });
        }
        
        // Throttled scroll listener for performance
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    highlightCurrentSection();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial highlight
        highlightCurrentSection();
    }
    
    /**
     * ENHANCED INTERACTIVE ELEMENTS
     * Add keyboard navigation and ARIA improvements
     */
    function enhanceInteractivity() {
        // Enhance details/summary elements with keyboard navigation
        const detailsElements = document.querySelectorAll('details');
        
        detailsElements.forEach(details => {
            const summary = details.querySelector('summary');
            
            if (summary) {
                // Add ARIA attributes for better accessibility
                summary.setAttribute('aria-expanded', details.open);
                
                // Update ARIA when toggled
                details.addEventListener('toggle', function() {
                    summary.setAttribute('aria-expanded', this.open);
                });
                
                // Keyboard enhancement (Space key support)
                summary.addEventListener('keydown', function(e) {
                    if (e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            }
        });
    }
    
    /**
     * SCROLL FADE-IN ANIMATIONS
     * Simple fade-in effect for content sections as they enter viewport
     */
    function enhanceScrollFadeIn() {
        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            return; // Skip animations if user prefers reduced motion
        }
        
        // Only proceed if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) return;
        
        const chapters = document.querySelectorAll('.chapter');
        
        // Create observer to trigger fade-in/out when chapters enter/leave viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const chapter = entry.target;
                
                if (entry.isIntersecting) {
                    // Fade in when entering viewport
                    chapter.style.opacity = '1';
                    chapter.style.transform = 'translateY(0)';
                }
                // Remove the aggressive fade-out behavior
                // Content should remain visible even when not in viewport
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
        });
        
        // Start observing all chapters
        chapters.forEach(chapter => observer.observe(chapter));
    }

    /**
     * PERFORMANCE ENHANCEMENTS
     * Lazy loading and resource optimization
     */
    function enhancePerformance() {
        // Lazy load images using Intersection Observer if supported
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Only add fade-in effect if image isn't already loaded
                        if (!img.complete) {
                            img.style.opacity = '0';
                            img.style.transition = 'opacity 0.3s ease';
                            
                            img.onload = function() {
                                this.style.opacity = '1';
                            };
                        }
                        
                        observer.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
        
        // Preload critical resources on hover (progressive enhancement)
        const criticalLinks = document.querySelectorAll('a[href^="#"]');
        criticalLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                const target = document.querySelector(href);
                if (target) {
                    // Prepare section for faster navigation
                    target.style.willChange = 'scroll-position';
                    setTimeout(() => {
                        target.style.willChange = 'auto';
                    }, 1000);
                }
            });
        });
    }
    
    /**
     * ACCESSIBILITY ENHANCEMENTS
     * Additional keyboard navigation and screen reader support
     */
    function enhanceAccessibility() {
        // Add skip navigation within long content
        const chapters = document.querySelectorAll('.chapter');
        
        chapters.forEach((chapter, index) => {
            const nextChapter = chapters[index + 1];
            if (nextChapter) {
                const skipLink = document.createElement('a');
                skipLink.href = '#' + nextChapter.getAttribute('id');
                skipLink.className = 'skip-to-next';
                skipLink.textContent = 'Skip to next chapter';
                skipLink.style.cssText = `
                    position: absolute;
                    left: -9999px;
                    background: var(--color-text);
                    color: var(--color-background);
                    padding: 0.5rem;
                    text-decoration: none;
                    border-radius: 4px;
                `;
                
                skipLink.addEventListener('focus', function() {
                    this.style.left = '10px';
                    this.style.top = '10px';
                });
                
                skipLink.addEventListener('blur', function() {
                    this.style.left = '-9999px';
                });
                
                chapter.style.position = 'relative';
                chapter.appendChild(skipLink);
            }
        });
        
        // Announce page changes to screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'visually-hidden';
        document.body.appendChild(announcer);
        
        // Announce section changes
        window.addEventListener('hashchange', function() {
            const targetId = location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const title = targetElement.querySelector('h2');
                if (title) {
                    announcer.textContent = 'Navigated to ' + title.textContent;
                }
            }
        });
    }
    
    /**
     * PROGRESSIVE LOADING
     * Load enhancements only when needed
     */
    function progressiveLoad() {
        // Load enhancements based on user interaction
        let interactionStarted = false;
        
        function loadFullEnhancements() {
            if (interactionStarted) return;
            interactionStarted = true;
            
            enhanceNavigation();
            enhanceInteractivity();
            enhancePerformance();
            enhanceAccessibility();
            enhanceScrollFadeIn();
        }
        
        // Load on first user interaction
        ['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(event => {
            document.addEventListener(event, loadFullEnhancements, { once: true, passive: true });
        });
        
        // Load after a delay as fallback
        setTimeout(loadFullEnhancements, 2000);
    }
    
    /**
     * ERROR HANDLING
     * Graceful degradation if JavaScript fails
     */
    function setupErrorHandling() {
        window.addEventListener('error', function(e) {
            // Log error but don't break the experience
            console.warn('Enhancement failed:', e.error);
            
            // Remove any broken enhancements
            document.querySelectorAll('.enhanced').forEach(el => {
                el.classList.remove('enhanced');
            });
        });
    }
    
    /**
     * INITIALIZATION
     * Start progressive enhancements when DOM is ready
     */
    function init() {
        setupErrorHandling();
        
        // Use progressive loading for better performance
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', progressiveLoad);
        } else {
            progressiveLoad();
        }
    }
    
    // Start the enhancements
    init();
    
})(); 