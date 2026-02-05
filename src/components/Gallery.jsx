import { useState, useEffect } from 'react';
import './Gallery.css';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        // glob import from src/assets/galeria
        const imageModules = import.meta.glob('../assets/galeria/*.{png,jpg,jpeg,svg,webp}', {
            eager: true,
            query: '?url',
            import: 'default'
        });

        const loadedImages = Object.values(imageModules);
        setImages(loadedImages);
    }, []);

    const openLightbox = (imageSrc) => {
        setSelectedImage(imageSrc);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    return (
        <div id="gallery" className="gallery-container">
            <h2 className="gallery-title">Galería de Imágenes</h2>

            <div className="gallery-grid">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="gallery-item"
                        onClick={() => openLightbox(src)}
                    >
                        <img
                            src={src}
                            alt={`Gallery item ${index + 1}`}
                            className="gallery-image"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="lightbox-close" onClick={closeLightbox}>
                            &times;
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full screen view"
                            className="lightbox-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
