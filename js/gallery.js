console.log("Gallery Script Loaded");

// Image paths relative to the public root
const galleryImages = [
    'assets/galeria/2.jpg',
    'assets/galeria/3.jpg',
    'assets/galeria/4.jpg',
    'assets/galeria/65-1024x769.jpg'
];

function initGallery() {
    console.log("Initializing gallery...");
    const galleryTrack = document.getElementById('gallery-track');

    if (!galleryTrack) {
        console.error("Error: Element 'gallery-track' not found!");
        return;
    }

    // Clear track
    galleryTrack.innerHTML = '';

    // If no images defined, show placeholder
    if (galleryImages.length === 0) {
        console.warn("No images in galleryImages array.");
        return;
    }

    // Duplicate sets for infinite marquee effect
    // We need enough items to fill the screen twice
    const setsToCreate = 4;

    for (let i = 0; i < setsToCreate; i++) {
        galleryImages.forEach(src => {
            const item = document.createElement('div');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            // Use relative path
            img.src = src;
            img.alt = "Galería Magallanes";
            img.loading = "lazy";

            img.onerror = () => {
                console.error("Failed to load image:", img.src);
            };

            item.appendChild(img);
            item.onclick = () => openLightbox(img.src);
            galleryTrack.appendChild(item);
        });
    }

    console.log("Gallery populated with", galleryTrack.children.length, "items.");
}

function openLightbox(src) {
    console.log("Opening lightbox for:", src);
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) {
        console.error("Lightbox elements not found");
        return;
    }

    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Global Event Listeners for Lightbox
function setupLightboxListeners() {
    const lightbox = document.getElementById('lightbox');
    const closeBtn = document.querySelector('.lightbox-close');

    if (closeBtn) {
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeLightbox();
        };
    }

    if (lightbox) {
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
}

// Init
// ES Modules are deferred, but we check readyState to be safe
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initGallery();
    setupLightboxListeners();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        initGallery();
        setupLightboxListeners();
    });
}
