import React from 'react';
import { Landmark, Home, Trees, Sparkles, Navigation2, Plane } from 'lucide-react';
import { propertyData } from '../data/propertyData';

const iconMap = {
  LandPlot: Landmark,
  Home: Home,
  Trees: Trees,
  Sparkles: Sparkles,
  Route: Navigation2,
  Plane: Plane
};

export const StatsCounter = () => {
  const { keyStats } = propertyData;

  return (
    <section className="stats-strip-section">
      <div className="container">
        <div className="stats-grid">
          {keyStats.map((stat, idx) => {
            const IconComponent = iconMap[stat.icon] || Sparkles;
            return (
              <div key={idx} className="stat-card">
                <div className="stat-icon-wrap">
                  <IconComponent size={22} className="stat-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-number-wrap">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-unit">{stat.unit}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
