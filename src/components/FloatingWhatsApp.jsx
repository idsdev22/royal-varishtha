import React, { useState, useEffect } from 'react';
import { propertyData } from '../data/propertyData';

export const FloatingWhatsApp = () => {
  const { projectInfo } = propertyData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show after slight delay or right away
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const whatsappUrl = `https://wa.me/${projectInfo.whatsappNumber}?text=${encodeURIComponent(projectInfo.whatsappMessage)}`;

  return (
    <div className={`floating-whatsapp-wrapper ${isVisible ? 'visible' : ''}`}>
      {/* WhatsApp Floating Action Link */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-whatsapp-btn"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        {/* Animated Radar Pulse Waves */}
        <span className="wa-pulse-wave wa-wave-1" aria-hidden="true" />
        <span className="wa-pulse-wave wa-wave-2" aria-hidden="true" />
        <span className="wa-pulse-wave wa-wave-3" aria-hidden="true" />

        {/* Animated Status Pill */}
        <span className="wa-chat-pill">
          <span className="wa-online-dot" />
          <span className="wa-pill-text">Chat on WhatsApp</span>
        </span>

        {/* WhatsApp Circular Icon Container */}
        <div className="wa-icon-circle">
          <svg 
            className="wa-svg-icon" 
            viewBox="0 0 32 32" 
            width="28" 
            height="28" 
            fill="currentColor"
          >
            <path d="M16 2a13.9 13.9 0 0 0-12 21L2 30l7.3-1.9A13.9 13.9 0 1 0 16 2zm0 25.5c-2.3 0-4.6-.6-6.6-1.8l-.5-.3-4.4 1.1 1.2-4.2-.3-.5a11.5 11.5 0 1 1 10.6 5.7zm6.4-8.5c-.3-.2-2-.1-2.3-1.1-.3-1.1-.6-1.1-.9-1.1h-.8c-.3 0-.7.1-1 .4s-1.3 1.2-1.3 3 1.3 3.5 1.5 3.7 2.6 4 6.3 5.6c.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8s.3-1.6.2-1.8c-.1-.1-.4-.2-.9-.4z"/>
          </svg>
        </div>
      </a>
    </div>
  );
};
