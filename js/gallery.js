
// Dynamic Image Import using Vite
const modules = import.meta.glob('/src/assets/galeria/*.{jpg,jpeg,png,svg}', { eager: true });

const galleryTrack = document.getElementById('gallery-track');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

let images = [];

// 1. Render Gallery (Marquee)
function renderGallery() {
    if (!galleryTrack) return;

    // Load images
    Object.values(modules).forEach((module) => {
        images.push(module.default);
    });

    if (images.length === 0) return;

    // For infinite marquee, duplicate the list enough times to fill width + buffer
    // Simplest approach: Duplicate list X times. 
    // The CSS animation moves -50%, so we need at least 2 full sets.

    // Create first set
    images.forEach(src => createItem(src));
    // Create duplicate set
    images.forEach(src => createItem(src));
    // Another one for good measure on wide screens
    images.forEach(src => createItem(src));
}

function createItem(src) {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = "Galería Magallanes";
    img.loading = "lazy";

    // Click to Open Lightbox
    item.addEventListener('click', () => openLightbox(src));

    item.appendChild(img);
    galleryTrack.appendChild(item);
}

// 2. Lightbox Logic
function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Init
document.addEventListener('DOMContentLoaded', renderGallery);
