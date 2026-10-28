import React from 'react';
import {
  GraduationCap,
  School,
  Cross,
  ShoppingBag,
  Plane,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Navigation
} from 'lucide-react';
import { propertyData } from '../data/propertyData';

const categoryIconMap = {
  schools: School,
  colleges: GraduationCap,
  hospitals: Cross,
  shopping: ShoppingBag,
  transit: Plane
};

export const NearbyConnectivity = ({ onOpenEnquiry }) => {
  const { nearbyLocations, projectInfo } = propertyData;

  return (
    <section className="section nearby-section" id="location">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            {/* <Sparkles size={13} /> */}
            <span>Strategic Location</span>
          </div>
          <h2 className="section-title">
            Prime Connectivity &amp; <span className="text-emerald">Key Distances</span>
          </h2>
          <p className="section-description">
            {nearbyLocations.description || "Situated in Kurumbapalayam near Sathy Road, Royal Varishtaa places premier schools, colleges, IT corridors, and transit within comfortable reach."}
          </p>
        </div>

        <div className="nearby-categories-grid">
          {nearbyLocations.categories.map((category) => {
            const CatIcon = categoryIconMap[category.id] || MapPin;
            return (
              <div key={category.id} className="nearby-category-card">
                <div className="category-header-wrap">
                  <div className="category-icon-box">
                    <CatIcon size={20} className="cat-icon" />
                  </div>
                  <h3 className="category-title">{category.name}</h3>
                </div>

                <div className="landmarks-items-list">
                  {category.items.map((item, idx) => (
                    <div key={idx} className="landmark-item-row">
                      <div className="landmark-meta">
                        <h4 className="landmark-title">{item.name}</h4>
                        <span className="landmark-type-label">{item.landmark}</span>
                      </div>
                      <div className="landmark-metrics-wrap">
                        <div className="metric-pill metric-dist">
                          <MapPin size={12} />
                          <span>{item.distance}</span>
                        </div>
                        <div className="metric-pill metric-time">
                          <Clock size={12} />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Location Advantage Map Action Bar */}
        <div className="nearby-map-action-card">
          <div className="map-action-info">
            <div className="map-icon-box">
              <Navigation size={24} className="text-emerald" />
            </div>
            <div>
              <h4>Ready to Visit Royal Varishtaa in Person?</h4>
              <p>Kurumbapalayam, Sathy Road Corridor, Coimbatore - Site Experience Centre is open daily from 9 AM to 6 PM.</p>
            </div>
          </div>
          <div className="map-action-btns">
            <a
              href={projectInfo.googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <ExternalLink size={15} />
              <span>GET DIRECTIONS</span>
            </a>
            <button
              type="button"
              className="btn-primary"
              onClick={onOpenEnquiry}
            >
              <span>ENQUIRY NOW</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
