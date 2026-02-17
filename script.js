// ===========================
// Load Projects from JSON
// ===========================
async function loadProjects() {
    try {
        console.log('Loading projects from data/projects.json...');
        const response = await fetch('data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Projects data loaded:', data);
        
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (!projectsGrid) {
            console.error('Projects grid element not found!');
            return;
        }
        
        // Remove test items when loading real data
        const testItems = projectsGrid.querySelectorAll('.test-item');
        testItems.forEach(item => item.remove());
        
        // Filter featured projects or show all
        const projects = data.projects.filter(p => p.featured);
        console.log(`Displaying ${projects.length} featured projects`);
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; grid-column: 1/-1;">No featured projects found. Edit data/projects.json to add your projects.</p>';
            return;
        }
        
        projects.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
        
        // Reinitialize observers for new elements
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('fade-in');
            observer.observe(card);
            
            // Add tilt effect
            addTiltEffect(card);
        });
        
        console.log('✓ Projects loaded successfully');
        
    } catch (error) {
        console.error('Error loading projects:', error);
        console.log('Keeping test project visible as fallback');
        // Test item will remain visible
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const imageStyle = project.image ? `background-image: url('${project.image}')` : '';
    
    card.innerHTML = `
        <div class="project-image" style="${imageStyle}">
            <div class="project-overlay">
                <a href="${project.link}" class="project-link" target="_blank" rel="noopener">View Project</a>
                ${project.github ? `<a href="${project.github}" class="project-link github-link" target="_blank" rel="noopener">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                </a>` : ''}
            </div>
        </div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    return card;
}

// ===========================
// Load Gallery from JSON
// ===========================
async function loadGallery() {
    try {
        console.log('Loading gallery from data/gallery.json...');
        const response = await fetch('data/gallery.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Gallery data loaded:', data);
        
        const galleryGrid = document.querySelector('.gallery-grid');
        
        if (!galleryGrid) {
            console.error('Gallery grid element not found!');
            return;
        }
        
        // Remove test items when loading real data
        const testItems = galleryGrid.querySelectorAll('.test-item');
        testItems.forEach(item => item.remove());
        
        if (data.gallery.length === 0) {
            galleryGrid.innerHTML = '<p style="color: var(--color-text-muted); text-align: center; grid-column: 1/-1;">No gallery items found. Edit data/gallery.json to add your media.</p>';
            return;
        }
        
        data.gallery.forEach(item => {
            const galleryItem = createGalleryItem(item);
            galleryGrid.appendChild(galleryItem);
        });
        
        console.log(`✓ Loaded ${data.gallery.length} gallery items`);
        
        // Reinitialize gallery functionality
        initGalleryFilters();
        initLightbox();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        console.log('Keeping test gallery items visible as fallback');
        
        // Initialize filters even with test items
        initGalleryFilters();
    }
}

function createGalleryItem(item) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', item.category);
    
    const isVideo = item.type === 'video';
    const mediaSource = isVideo ? item.videoUrl : item.fullImage;
    const isCertification = item.category === 'certifications';
    
    galleryItem.innerHTML = `
        <div class="gallery-image ${isVideo ? 'video-thumb' : ''}">
            <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
            ${isVideo ? `
                <div class="video-play-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="10" fill="rgba(255, 107, 53, 0.9)"/>
                        <path d="M10 8l6 4-6 4V8z" fill="white"/>
                    </svg>
                </div>
            ` : ''}
            <div class="gallery-overlay">
                <button class="gallery-view-btn" data-type="${item.type}" data-src="${mediaSource}" data-item='${JSON.stringify(item)}'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${isVideo ? 
                            '<polygon points="5 3 19 12 5 21 5 3"></polygon>' : 
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>'
                        }
                    </svg>
                    ${isVideo ? 'Play' : 'View'}
                </button>
            </div>
        </div>
        <div class="gallery-info">
            <h3 class="gallery-title">${item.title}</h3>
            <p class="gallery-category">${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
            ${isCertification && item.issuer ? `
                <p class="cert-issuer">Issued by: ${item.issuer}</p>
                ${item.credentialUrl ? `<a href="${item.credentialUrl}" target="_blank" class="cert-verify">Verify Credential</a>` : ''}
            ` : ''}
        </div>
    `;
    
    return galleryItem;
}

// ===========================
// Smooth Scroll & Navigation
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Mobile Menu Toggle
// ===========================
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
}

// ===========================
// Navbar Background on Scroll
// ===========================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Intersection Observer for Animations
// ===========================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger skill bars animation
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .project-card, .skill-category, .highlight-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===========================
// Skill Bars Animation
// ===========================
let skillsAnimated = false;

function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;
    
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }, index * 100);
    });
}

// ===========================
// Contact Form Handling
// ===========================
const contactForm = document.getElementById('contactForm');
const formMessage = document.querySelector('.form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Send to PHP backend
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                contactForm.reset();
            } else {
                formMessage.textContent = result.message || 'Something went wrong. Please try again.';
                formMessage.className = 'form-message error';
            }
        } catch (error) {
            formMessage.textContent = 'Network error. Please check your connection and try again.';
            formMessage.className = 'form-message error';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    });
}

// ===========================
// Parallax Effect for Hero Background
// ===========================
const heroBackground = document.querySelector('.hero-background');

window.addEventListener('scroll', () => {
    if (window.pageYOffset < window.innerHeight) {
        const scrolled = window.pageYOffset;
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ===========================
// Typing Effect for Hero Subtitle (Optional)
// ===========================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect
// const heroSubtitle = document.querySelector('.hero-subtitle');
// if (heroSubtitle) {
//     const originalText = heroSubtitle.textContent;
//     typeWriter(heroSubtitle, originalText, 30);
// }

// ===========================
// Cursor Trail Effect (Optional)
// ===========================
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) { // Only on desktop
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        
        document.body.appendChild(trail);
        cursorTrail.push(trail);
        
        setTimeout(() => {
            trail.remove();
            cursorTrail.shift();
        }, 500);
        
        if (cursorTrail.length > trailLength) {
            cursorTrail[0].remove();
            cursorTrail.shift();
        }
    }
});

// Add cursor trail styles dynamically
const style = document.createElement('style');
style.textContent = `
    .cursor-trail {
        position: absolute;
        width: 5px;
        height: 5px;
        background-color: var(--color-accent);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.6;
        animation: fadeOut 0.5s ease forwards;
        z-index: 9999;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);

// ===========================
// Project Cards Tilt Effect
// ===========================
function addTiltEffect(card) {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// Apply to initially loaded project cards (if any)
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    addTiltEffect(card);
});

// ===========================
// Initialize Data Loading
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // CRITICAL: Make sure all gallery items are visible IMMEDIATELY
    const allGalleryItems = document.querySelectorAll('.gallery-item');
    allGalleryItems.forEach(item => {
        item.style.display = 'block';
        item.style.visibility = 'visible';
        item.style.opacity = '1';
    });
    
    console.log(`Made ${allGalleryItems.length} gallery items visible on page load`);
    
    // Load projects and gallery from JSON
    loadProjects();
    loadGallery();
});

// ===========================
// Active Navigation Link
// ===========================
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinksAll.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===========================
// Gallery Filter
// ===========================
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // SIMPLE: Just show all items - no hiding
    galleryItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('hidden');
    });

    // Simple filter on button click
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Show or hide based on filter
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===========================
// Lightbox Functionality
// ===========================
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxVideo = document.getElementById('lightbox-video');
    const lightboxIframe = document.getElementById('lightbox-iframe');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryViewBtns = document.querySelectorAll('.gallery-view-btn');

    let currentMediaIndex = 0;
    let currentMediaArray = [];

    // Open lightbox
    galleryViewBtns.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-type');
            const src = btn.getAttribute('data-src');
            const itemData = btn.getAttribute('data-item');
            
            // Build array of all visible media items
            currentMediaArray = Array.from(galleryViewBtns)
                .filter(b => !b.closest('.gallery-item').classList.contains('hidden'))
                .map(b => ({
                    type: b.getAttribute('data-type'),
                    src: b.getAttribute('data-src'),
                    data: b.getAttribute('data-item')
                }));
            
            // Find current index in visible items
            currentMediaIndex = currentMediaArray.findIndex(item => item.src === src);
            
            openLightbox(type, src, itemData);
        });
    });

    function openLightbox(type, src, itemData) {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Hide all media elements
        lightboxImage.classList.remove('active');
        lightboxVideo.classList.remove('active');
        lightboxIframe.classList.remove('active');
        
        // Stop video if playing
        if (!lightboxVideo.paused) {
            lightboxVideo.pause();
        }
        
        // Show appropriate media
        if (type === 'image') {
            lightboxImage.src = src;
            lightboxImage.classList.add('active');
        } else if (type === 'video') {
            if (src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com')) {
                // Handle YouTube/Vimeo videos
                lightboxIframe.src = src;
                lightboxIframe.classList.add('active');
            } else {
                // Handle local videos
                lightboxVideo.querySelector('source').src = src;
                lightboxVideo.load();
                lightboxVideo.classList.add('active');
            }
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Stop video
        if (!lightboxVideo.paused) {
            lightboxVideo.pause();
        }
        
        // Clear iframe
        lightboxIframe.src = '';
    }

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
            navigateLightbox('prev');
        }
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
            navigateLightbox('next');
        }
    });

    // Navigate between media
    function navigateLightbox(direction) {
        if (direction === 'prev') {
            currentMediaIndex = (currentMediaIndex - 1 + currentMediaArray.length) % currentMediaArray.length;
        } else {
            currentMediaIndex = (currentMediaIndex + 1) % currentMediaArray.length;
        }
        
        const media = currentMediaArray[currentMediaIndex];
        openLightbox(media.type, media.src, media.data);
    }

    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
}

// Initial call removed - will be called after loading gallery

// ===========================
// Page Load Animation
// ===========================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===========================
// Add smooth reveal for hero content
// ===========================
const heroContent = document.querySelector('.hero-content');
if (heroContent) {
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
}

// ===========================
// Performance: Debounce scroll events
// ===========================
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
const debouncedScroll = debounce(() => {
    activateNavLink();
}, 10);

window.addEventListener('scroll', debouncedScroll);

console.log('Portfolio loaded successfully! ✨');
