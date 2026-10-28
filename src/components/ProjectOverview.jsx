import React from 'react';
import { CheckCircle2, ShieldCheck, Award, Calendar, Sparkles, Trees, MessageSquare } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const ProjectOverview = ({ onOpenEnquiry }) => {
  const { overview, projectInfo } = propertyData;

  const quickFeatures = [
    { label: "DTCP & RERA Approved Layout", icon: ShieldCheck },
    { label: "12.5 Acres Gated Plotted Community", icon: Trees },
    { label: "Plot Sizes: 1.5 Cents to 6.0 Cents", icon: Award },
    { label: "40ft & 30ft Cambered Tar Roads", icon: CheckCircle2 },
    { label: "100% Underground Electricity & Water", icon: CheckCircle2 },
    { label: "Ready for Immediate Registration", icon: Calendar }
  ];

  return (
    <section className="section overview-section" id="overview">
      <div className="container">
        <div className="overview-grid">
          {/* Left Column: Visual Collage with Floating Badges */}
          <div className="overview-visual-col">
            <div className="visual-card primary-visual">
              <img
                src={overview.imagePrimary}
                alt={`${projectInfo.name} Plotted Community`}
                className="overview-img"
                loading="lazy"
                decoding="async"
              />
              <div className="visual-badge-floating">
                <div className="badge-icon-box">
                  <ShieldCheck size={22} className="text-emerald" />
                </div>
                <div className="badge-text-box">
                  <div className="badge-title">100% DTCP Approved</div>
                  <div className="badge-subtitle">Kurumbapalayam, Coimbatore</div>
                </div>
              </div>
            </div>

            <div className="visual-card secondary-visual d-none-mobile">
              <img
                src={overview.imageSecondary}
                alt={`${projectInfo.name} Architecture`}
                className="overview-img-secondary"
                loading="lazy"
                decoding="async"
              />
              <div className="visual-overlay-stat">
                <div className="stat-highlight">100%</div>
                <div className="stat-text">Vasthu Compliant</div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative, Key Features & Single Enquire Now CTA */}
          <div className="overview-content-col">
            <div className="section-tag gold">
              {/* <Sparkles size={13} /> */}
              <span>{overview.subtitle || "PREMIUM GATED COMMUNITY"}</span>
            </div>

            <h2 className="section-title">
              {overview.title || "Royal Varishtaa, Kurumbapalayam"}
            </h2>

            <p className="overview-lead">
              {overview.leadText}
            </p>

            {overview.paragraphs.map((p, idx) => (
              <p key={idx} className="overview-paragraph">
                {p}
              </p>
            ))}

            {/* Quick Feature Badges Grid */}
            <div className="overview-features-grid">
              {quickFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="feature-pill-card">
                    <div className="feature-pill-icon">
                      <Icon size={16} />
                    </div>
                    <span className="feature-pill-text">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Single Enquire Now Action Button */}
            <div className="overview-action-buttons">
              <button
                type="button"
                className="btn-primary"
                onClick={onOpenEnquiry}
                title="Enquire Now"
              >
                <MessageSquare size={16} />
                <span>ENQUIRE NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
