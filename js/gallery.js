/**
 * MAGALLANES AERO - DYNAMIC PRESENTATION GALLERY
 * Clean, dynamic display with active stage, interactive thumbnails, counter, navigation & lightbox.
 * No artificial or fabricated text.
 */

const galleryList = [
  'assets/galeria/2.jpg',
  'assets/galeria/3.jpg',
  'assets/galeria/4.jpg',
  'assets/galeria/65-1024x769.jpg'
];

let activeIndex = 0;
let autoPlayInterval = null;

function initDynamicGallery() {
  const mainStageImg = document.getElementById('gallery-stage-img');
  const thumbsContainer = document.getElementById('gallery-thumbs-track');
  const counterCurrent = document.getElementById('gallery-counter-current');
  const counterTotal = document.getElementById('gallery-counter-total');
  const prevBtn = document.getElementById('gallery-prev-btn');
  const nextBtn = document.getElementById('gallery-next-btn');
  const fullscreenBtn = document.getElementById('gallery-fullscreen-btn');
  const stageFrame = document.getElementById('gallery-stage-frame');

  if (!mainStageImg || !thumbsContainer) return;

  if (counterTotal) counterTotal.textContent = String(galleryList.length).padStart(2, '0');

  // Build interactive thumbnails
  thumbsContainer.innerHTML = '';
  galleryList.forEach((src, idx) => {
    const thumbBtn = document.createElement('button');
    thumbBtn.type = 'button';
    thumbBtn.className = `gallery-thumb-item ${idx === 0 ? 'active' : ''}`;
    thumbBtn.setAttribute('aria-label', `Imagen ${idx + 1}`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Motor Magallanes ${idx + 1}`;
    img.loading = 'lazy';

    thumbBtn.appendChild(img);
    thumbBtn.addEventListener('click', () => {
      setSlide(idx);
      resetAutoPlay();
    });

    thumbsContainer.appendChild(thumbBtn);
  });

  function setSlide(idx) {
    if (idx < 0 || idx >= galleryList.length) return;
    activeIndex = idx;

    // Smooth transition
    mainStageImg.style.opacity = '0';
    mainStageImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      mainStageImg.src = galleryList[activeIndex];
      mainStageImg.style.opacity = '1';
      mainStageImg.style.transform = 'scale(1)';
    }, 180);

    if (counterCurrent) counterCurrent.textContent = String(activeIndex + 1).padStart(2, '0');

    // Update active thumb
    const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb-item');
    thumbs.forEach((th, i) => {
      th.classList.toggle('active', i === activeIndex);
    });
  }

  function nextSlide() {
    const nextIdx = (activeIndex + 1) % galleryList.length;
    setSlide(nextIdx);
  }

  function prevSlide() {
    const prevIdx = (activeIndex - 1 + galleryList.length) % galleryList.length;
    setSlide(prevIdx);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      openLightbox(galleryList[activeIndex]);
    });
  }

  if (stageFrame) {
    stageFrame.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        openLightbox(galleryList[activeIndex]);
      }
    });

    // Pause autoplay on mouse hover
    stageFrame.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    stageFrame.addEventListener('mouseleave', () => startAutoPlay());
  }

  // Keyboard navigation when gallery is in view
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
      nextSlide();
      resetAutoPlay();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
      resetAutoPlay();
    }
  });

  function startAutoPlay() {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  // Initial load
  setSlide(0);
  startAutoPlay();
}

// Lightbox logic
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (!lightbox || !lightboxImg) return;

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

// Initialize
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initDynamicGallery();
  setupLightboxListeners();
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initDynamicGallery();
    setupLightboxListeners();
  });
}
