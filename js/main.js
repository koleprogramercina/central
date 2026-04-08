// Language toggle
let currentLang = localStorage.getItem('lang') || 'sr';

// Apply saved language on page load
document.addEventListener('DOMContentLoaded', function() {
    if (currentLang === 'en') {
        applyLanguage('en');
    }
    const langButton = document.querySelector('.lang-switch');
    if (langButton) {
        langButton.textContent = currentLang === 'sr' ? 'EN' : 'SR';
    }
});

function toggleLanguage() {
    currentLang = currentLang === 'sr' ? 'en' : 'sr';
    localStorage.setItem('lang', currentLang);
    const langButton = document.querySelector('.lang-switch');
    langButton.textContent = currentLang === 'sr' ? 'EN' : 'SR';
    applyLanguage(currentLang);
}

function applyLanguage(lang) {
    document.querySelectorAll('[data-sr]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else {
                // Preserve child elements (like <strong>, <i>, <span>)
                const childElements = element.querySelectorAll('i, strong, span.price, span');
                if (childElements.length === 0 || element.children.length === 0) {
                    element.textContent = text;
                } else {
                    // Only replace text nodes
                    for (let node of element.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            node.textContent = text;
                            break;
                        }
                    }
                }
            }
        }
    });
    // Update html lang attribute
    document.documentElement.lang = lang === 'sr' ? 'sr' : 'en';
}

// Menu toggle
function toggleMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const hamburger = document.querySelector('.hamburger');
    
    menuOverlay.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Spreči scroll kad je meni otvoren
    if (menuOverlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

function closeMenu() {
    const menuOverlay = document.getElementById('menuOverlay');
    const hamburger = document.querySelector('.hamburger');
    
    menuOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navbar scroll efekat
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll za anchor linkove
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

// Intersection Observer za animacije sekcija
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Posmatraj sve page-section elemente
document.querySelectorAll('.page-section').forEach(section => {
    observer.observe(section);
});

// Gallery Lightbox
function openLightbox(element) {
    const lightbox = document.getElementById('lightbox');
    const content = document.getElementById('lightboxContent');
    
    if (lightbox && content) {
        content.innerHTML = element.innerHTML;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Zatvori lightbox i meni sa ESC tasterom
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeMenu();
    }
});

// Contact forma handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Simuliraj slanje forme
    const button = event.target.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    
    button.textContent = 'Slanje...';
    button.disabled = true;
    
    setTimeout(() => {
        alert('Hvala! Vaša poruka je poslata. Kontaktiraćemo vas uskoro.');
        event.target.reset();
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
    
    return false;
}

// Highlight trenutne stranice u navigaciji
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = 'var(--primary-gold)';
        }
    });
});

// Dodaj smooth scroll behavior globalno
document.documentElement.style.scrollBehavior = 'smooth';

// Spreci zatvaranje menija ako se klikne van linka
document.querySelector('.menu-overlay')?.addEventListener('click', (e) => {
    if (e.target.classList.contains('menu-overlay')) {
        closeMenu();
    }
});

// Individual review translation toggle
function toggleReviewTranslation(btn) {
    const card = btn.closest('.review-card');
    const textEl = card.querySelector('.review-text');
    const btnSpan = btn.querySelector('span');
    const showing = btn.getAttribute('data-showing');
    const originalLang = textEl.getAttribute('data-original');

    if (showing === 'original') {
        // Show translated version
        const targetLang = originalLang === 'en' ? 'sr' : 'en';
        textEl.textContent = textEl.getAttribute('data-' + targetLang);
        btn.setAttribute('data-showing', 'translated');
        btnSpan.textContent = currentLang === 'sr' ? 'Prikaži original' : 'Show original';
    } else {
        // Show original
        textEl.textContent = textEl.getAttribute('data-' + originalLang);
        btn.setAttribute('data-showing', 'original');
        if (originalLang === 'en') {
            btnSpan.textContent = currentLang === 'sr' ? 'Prevedi na srpski' : 'Translate to Serbian';
        } else {
            btnSpan.textContent = currentLang === 'sr' ? 'Prevedi na engleski' : 'Translate to English';
        }
    }
}

// Console welcome message
console.log('%c💪 CENTRAL GYM 💪', 'font-size: 24px; font-weight: bold; color: #FFD700;');
console.log('%cPostani jači nego juče!', 'font-size: 16px; color: #b0b0b0;');