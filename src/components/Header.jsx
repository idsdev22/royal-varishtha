import React from 'react';
import { ShieldCheck, PhoneCall, Download } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const Header = ({ onOpenBrochure }) => {
  const { projectInfo } = propertyData;

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Brand Logo & Title */}
        <a href="#home" className="brand-logo-wrap" title="Royal Varishtaa by Ananya Homes">
          <div className="brand-crest">
            <span className="crest-symbol">🏛️</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">{projectInfo.name}</span>
            <span className="brand-subtitle">{projectInfo.developer}</span>
          </div>
        </a>

        {/* Center DTCP Approval Badge (Desktop) */}
        <div className="header-badge-rera d-none-mobile">
          <ShieldCheck size={16} className="rera-icon" />
          <span><strong>{projectInfo.approvalBadge || "APPROVED DTCP"}</strong> • Kurumbapalayam</span>
        </div>

        {/* Right CTA Actions - Fast & Clean */}
        <div className="header-actions">
          <a
            href={`tel:${projectInfo.phone}`}
            className="header-phone-btn"
            title="Call Sales Team"
          >
            <PhoneCall size={15} />
            <span className="d-none-mobile">{projectInfo.phoneDisplay}</span>
          </a>

          <button
            type="button"
            onClick={onOpenBrochure}
            className="btn-header-cta"
            title="Download Master Plan & Brochure"
          >
            <Download size={15} />
            <span>Brochure</span>
          </button>
        </div>
      </div>
    </header>
  );
};
