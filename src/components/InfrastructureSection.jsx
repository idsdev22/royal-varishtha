import React from 'react';
import { 
  Zap, 
  Droplets, 
  CloudRain, 
  Milestone, 
  SunMedium, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { propertyData } from '../data/propertyData';

const infraIcons = [
  Zap,
  Droplets,
  CloudRain,
  Milestone,
  SunMedium,
  ShieldCheck
];

export const InfrastructureSection = () => {
  const { infrastructurePoints } = propertyData;

  return (
    <section className="section infra-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <ShieldCheck size={14} />
            <span>Built To Last</span>
          </div>
          <h2 className="section-title">
            Built For <span className="text-burgundy">Comfort & Safety</span>
          </h2>
          <p className="section-description">
            At Regal Arch, world-class infrastructure has been meticulously engineered below and above ground to guarantee lifelong peace of mind, pristine aesthetics, and flood-resilient safety.
          </p>
        </div>

        <div className="infra-grid">
          {infrastructurePoints.map((point, idx) => {
            const IconComp = infraIcons[idx % infraIcons.length];
            return (
              <div key={idx} className="infra-card">
                <div className="infra-icon-wrap">
                  <IconComp size={24} className="infra-icon" />
                </div>
                <div className="infra-content">
                  <h4 className="infra-title">{point.title}</h4>
                  <p className="infra-text">{point.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
