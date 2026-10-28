import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const MasterPlanGallery = ({ onOpenEnquiry }) => {
  const images = propertyData.galleryImages || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Touch swipe state for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 45;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation for Lightbox & Main Gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev + 1) % images.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
        } else if (e.key === 'Escape') {
          setLightboxIndex(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, images.length]);

  // Touch handlers for mobile swipe
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentItem = images[currentIndex] || images[0];

  return (
    <section className="section gallery-section modern-gallery-theme" id="gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag gold">
            {/* <Sparkles size={13} /> */}
            <span>Visual Showcase</span>
          </div>
          <h2 className="section-title">
            Project &amp; <span className="text-gold">Site Gallery</span>
          </h2>
          <p className="section-description">
            Explore high-resolution captures of the DTCP approved layout, grand entrance arch, wide blacktop boulevards, sports arena, and green parks.
          </p>
        </div>

        {/* MODERN SWIPE SLIDER */}
        {currentItem && (
          <div className="modern-gallery-showcase">
            {/* Main Featured Slide Stage */}
            <div
              className="gallery-slide-stage"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="gallery-image-wrapper">
                <img
                  src={currentItem.image}
                  alt={currentItem.title || "Royal Varishtaa Layout"}
                  className="gallery-slide-img"
                  key={currentItem.id}
                  onClick={() => setLightboxIndex(currentIndex)}
                  loading="lazy"
                  decoding="async"
                />

                {/* Top Controls Overlay */}
                <div className="gallery-top-controls">
                  <div className="gallery-counter-pill">
                    <span className="current-num">{String(currentIndex + 1).padStart(2, '0')}</span>
                    <span className="sep-slash">/</span>
                    <span className="total-num">{String(images.length).padStart(2, '0')}</span>
                  </div>

                  <button
                    type="button"
                    className="gallery-fullscreen-btn"
                    onClick={() => setLightboxIndex(currentIndex)}
                    title="Open Fullscreen Preview"
                  >
                    <Maximize2 size={15} />
                    <span className="d-none-mobile">View Full Size</span>
                  </button>
                </div>

                {/* Navigation Arrows */}
                <button
                  type="button"
                  className="gallery-nav-btn prev-btn"
                  onClick={handlePrev}
                  title="Previous image"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  className="gallery-nav-btn next-btn"
                  onClick={handleNext}
                  title="Next image"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Minimal Caption Bar Below Image */}
              <div className="gallery-caption-bar">
                <div className="caption-text-wrap">
                  <span className="caption-label">ROYAL VARISHTAA • KURUMBAPALAYAM</span>
                  <h4 className="caption-title">{currentItem.title}</h4>
                </div>
                <div className="gallery-swipe-hint">
                  <span>← Swipe or Click to browse →</span>
                </div>
              </div>
            </div>

            {/* Quick Thumbnail Strip (Desktop & Tablet) */}
            <div className="gallery-thumb-strip-wrapper">
              <div className="gallery-thumb-track">
                {images.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    type="button"
                    className={`gallery-thumb-card ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(idx)}
                    title={item.title}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="thumb-img"
                      loading="lazy"
                    />
                    <span className="thumb-idx">{String(idx + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sanctioned Plan Enquiry CTA Bar */}
            <div className="gallery-cta-strip">
              <div className="cta-strip-text">
                <h4>Interested in Sanctioned Layout Drawing &amp; Available Plots?</h4>
                <p>Connect with our senior property advisory team for sanctioned plot availability and pricing.</p>
              </div>
              <button
                type="button"
                className="btn-gold"
                onClick={onOpenEnquiry}
                title="Enquire Now"
              >
                <MessageSquare size={16} />
                <span>ENQUIRE NOW</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Clean Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="lightbox-backdrop" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setLightboxIndex(null)}
              title="Close Preview (Esc)"
            >
              <X size={22} />
            </button>

            {/* Lightbox Nav Arrows */}
            <button
              type="button"
              className="lightbox-arrow lb-prev"
              onClick={() => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length)}
              title="Previous"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              className="lightbox-arrow lb-next"
              onClick={() => setLightboxIndex((prev) => (prev + 1) % images.length)}
              title="Next"
            >
              <ChevronRight size={28} />
            </button>

            {/* Lightbox Image */}
            <div className="lightbox-image-container">
              <img
                src={images[lightboxIndex].image}
                alt={images[lightboxIndex].title}
                className="lightbox-img"
              />
            </div>

            {/* Lightbox Caption Footer */}
            <div className="lightbox-footer">
              <div className="footer-title-wrap">
                <span className="footer-project-tag">ROYAL VARISHTAA • ANANYA HOMES</span>
                <h3 className="footer-title">{images[lightboxIndex].title}</h3>
              </div>
              <div className="footer-counter">
                {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
