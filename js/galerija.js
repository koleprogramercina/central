// Gallery Configuration
const galleryImages = [
    {
        src: 'assets/galerija1.jpg',
        title: 'Central Gym 1',
        alt: 'Central Gym foto 1'
    },
    {
        src: 'assets/galerija2.jpg',
        title: 'Central Gym 2',
        alt: 'Central Gym foto 2'
    },
    {
        src: 'assets/galerija3.jpg',
        title: 'Central Gym 3',
        alt: 'Central Gym foto 3'
    },
    {
        src: 'assets/galerija4.jpg',
        title: 'Central Gym 4',
        alt: 'Central Gym foto 4'
    },
    {
        src: 'assets/galerija5.jpg',
        title: 'Central Gym 5',
        alt: 'Central Gym foto 5'
    },
    {
        src: 'assets/galerija6.jpg',
        title: 'Central Gym 6',
        alt: 'Central Gym foto 6'
    },
    {
        src: 'assets/galerija7.jpg',
        title: 'Central Gym 7',
        alt: 'Central Gym foto 7'
    },
    {
        src: 'assets/galerija8.jpg',
        title: 'Central Gym 8',
        alt: 'Central Gym foto 8'
    },
    {
        src: 'assets/galerija9.jpg',
        title: 'Central Gym 9',
        alt: 'Central Gym foto 9'
    },
    {
        src: 'assets/galerija10.jpg',
        title: 'Central Gym 10',
        alt: 'Central Gym foto 10'
    },
    {
        src: 'assets/galerija11.jpg',
        title: 'Central Gym 11',
        alt: 'Central Gym foto 11'
    },
    {
        src: 'assets/galerija12.jpg',
        title: 'Central Gym 12',
        alt: 'Central Gym foto 12'
    },
    {
        src: 'assets/galerija13.jpg',
        title: 'Central Gym 13',
        alt: 'Central Gym foto 13'
    }
];

let currentImageIndex = 0;

// Generate gallery on page load
function generateGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';

    galleryImages.forEach((image, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.onclick = () => openLightbox(index);

        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.loading = 'lazy';

        const overlay = document.createElement('div');
        overlay.className = 'gallery-overlay';
        overlay.innerHTML = `
            <i class="fas fa-search-plus"></i>
            <p>${image.title}</p>
        `;

        galleryItem.appendChild(img);
        galleryItem.appendChild(overlay);
        galleryGrid.appendChild(galleryItem);
    });
}

// Open lightbox
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (lightbox && lightboxImage) {
        lightboxImage.src = galleryImages[index].src;
        lightboxImage.alt = galleryImages[index].alt;
        lightboxCaption.textContent = galleryImages[index].title;
        lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Next image
function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

// Previous image
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Update lightbox image
function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');

    if (lightboxImage) {
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = galleryImages[currentImageIndex].src;
            lightboxImage.alt = galleryImages[currentImageIndex].alt;
            lightboxCaption.textContent = galleryImages[currentImageIndex].title;
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
            
            // Fade in
            lightboxImage.style.opacity = '1';
        }, 300);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Initialize gallery
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateGallery);
} else {
    generateGallery();
}