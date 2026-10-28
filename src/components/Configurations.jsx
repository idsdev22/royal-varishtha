import React from 'react';
import { Layers, ArrowRight, Check, Sparkles, Building, Ruler } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const Configurations = ({ onSelectPlot }) => {
  const { configurations, projectInfo } = propertyData;

  return (
    <section className="section config-section" id="configurations">
      <div className="container">
        <div className="section-header">
          <div className="section-tag gold">
            <Layers size={14} />
            <span>Plot & Villa Options</span>
          </div>
          <h2 className="section-title">
            Tailored Configurations For <span className="text-burgundy">Every Lifestyle</span>
          </h2>
          <p className="section-description">
            Choose from a diverse selection of DTCP & RERA approved premium villa plots ranging from 1.47 Cents to 5.50 Cents, designed for maximum space efficiency and Vasthu compliance.
          </p>
        </div>

        <div className="config-grid">
          {configurations.map((config) => (
            <div
              key={config.id}
              className={`config-card ${config.popular ? 'popular-card' : ''}`}
            >
              {config.popular && (
                <div className="popular-badge">
                  {/* <Sparkles size={12} /> */}
                  <span>MOST PREFERRED</span>
                </div>
              )}

              <div className="config-header">
                <div className="config-cent-pill">{config.cent}</div>
                <h3 className="config-type-title">{config.type}</h3>
                <div className="config-sqft-text">
                  <Ruler size={14} />
                  <span>{config.sqft} ({config.dimension})</span>
                </div>
              </div>

              <div className="config-body">
                <div className="config-ideal">
                  <span className="ideal-label">Recommended Build:</span>
                  <p className="ideal-value">{config.idealFor}</p>
                </div>

                <div className="config-pricing-box">
                  <span className="price-title">Starting At</span>
                  <span className="price-figure">{config.price}</span>
                </div>

                <div className="config-features-list">
                  {config.features.map((feat, idx) => (
                    <div key={idx} className="feature-row">
                      <Check size={14} className="feature-check text-gold" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="config-footer">
                <button
                  type="button"
                  className={`btn-config-action ${config.popular ? 'btn-primary' : 'btn-outline'} w-100`}
                  onClick={() => onSelectPlot(config)}
                >
                  <span>Request Price Breakdown</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Villa Construction Note */}
        <div className="custom-construction-banner">
          <div className="custom-banner-content">
            <Building size={28} className="custom-icon text-gold" />
            <div>
              <h4>Looking for Turnkey British Villa Construction?</h4>
              <p>We also offer customized architectural design and British-themed construction solutions tailored to your plot.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-gold"
            onClick={() => onSelectPlot({ type: "Custom Villa Construction" })}
          >
            <span>Consult Architect</span>
          </button>
        </div>
      </div>
    </section>
  );
};
