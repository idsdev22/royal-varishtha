import React, { useState, useEffect } from 'react';
import { Phone, MessageSquareText, ArrowUp } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const StickyActions = ({ onOpenEnquiry }) => {
  const { projectInfo } = propertyData;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 320) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* DESKTOP RIGHT-SIDE VERTICAL FLOATING ACTIONS */}
      <div className="vertical-floating-actions d-none-mobile">
        <a
          href={`tel:${projectInfo.phone}`}
          className="vertical-action-btn call-now-btn"
          title={`Call Sales Team: ${projectInfo.phoneDisplay}`}
        >
          <Phone size={16} className="vertical-icon" />
          <span className="vertical-text">CALL NOW</span>
        </a>

        <button
          type="button"
          onClick={onOpenEnquiry}
          className="vertical-action-btn enquire-now-btn"
          title="Enquire Now"
        >
          <MessageSquareText size={16} className="vertical-icon" />
          <span className="vertical-text">ENQUIRE NOW</span>
        </button>
      </div>

      {/* MOBILE STICKY BOTTOM 50/50 BAR */}
      <div className="mobile-sticky-bottom-bar d-flex-mobile">
        <a
          href={`tel:${projectInfo.phone}`}
          className="mobile-bar-btn mobile-call-btn"
          title="Call Now"
        >
          <Phone size={17} />
          <span>CALL NOW</span>
        </a>

        <button
          type="button"
          onClick={onOpenEnquiry}
          className="mobile-bar-btn mobile-enquire-btn"
          title="Enquire Now"
        >
          <MessageSquareText size={17} />
          <span>ENQUIRE NOW</span>
        </button>
      </div>

      {/* Floating Scroll to Top FAB */}
      {showScrollTop && (
        <button
          type="button"
          className="floating-scroll-top animate-fade-in"
          onClick={scrollToTop}
          title="Back to top"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
};
