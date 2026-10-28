import React from 'react';
import {
  ShieldCheck,
  Milestone,
  Zap,
  Droplets,
  Trees,
  Trophy,
  Activity,
  Sun,
  Sparkles
} from 'lucide-react';
import { propertyData } from '../data/propertyData';

const iconMap = {
  ShieldCheck: ShieldCheck,
  Milestone: Milestone,
  Zap: Zap,
  Droplets: Droplets,
  Trees: Trees,
  Trophy: Trophy,
  Activity: Activity,
  Sun: Sun
};

export const Amenities = () => {
  const { amenities } = propertyData;

  return (
    <section className="section amenities-section" id="amenities">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            {/* <Sparkles size={13} /> */}
            <span>World-Class Living</span>
          </div>
          <h2 className="section-title">
            Curated Community <span className="text-emerald">Amenities</span>
          </h2>
          <p className="section-description">
            Experience curated lifestyle conveniences, sports facilities, and underground infrastructure engineered for high-comfort gated community living.
          </p>
        </div>

        <div className="amenities-icon-grid">
          {amenities.map((item, idx) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div key={item.id || idx} className="amenity-icon-card">
                <div className="amenity-icon-box">
                  <IconComponent size={24} className="amenity-svg-icon" />
                </div>
                <div className="amenity-info">
                  <h4 className="amenity-card-text-title">{item.title}</h4>
                  <span className="amenity-subtext">Integrated Infrastructure</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
