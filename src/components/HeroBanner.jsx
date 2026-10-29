import React, { useState } from 'react';
import { propertyData } from '../data/propertyData';
import { ShieldCheck, CheckCircle2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import heroBg from '../assets/banner.jpg';
import mobileHeroBg from '../assets/mobile_banner.jpg';
import { submitLead } from '../services/leadService';
import './HeroBanner.css';

export const HeroBanner = ({ onFormSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { projectInfo } = propertyData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      const numericVal = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        phone: numericVal
      }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone) {
      alert('Please fill in your name and phone number.');
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s()-]/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        phone: cleanPhone,
        phoneNumber: cleanPhone,
        city: formData.city.trim(),
        address: formData.city.trim(),
        leadSource: 'Google Ads',
        source: 'Hero Banner Form'
      });
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if canvas-confetti is not loaded
      }
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onFormSuccess) onFormSuccess(formData);
    }
  };

  return (
    <section className="hero-custom-banner-section" id="home">
      {/* Banner Graphic Wrapper */}
      <div className="hero-banner-media-container">
        <picture className="hero-banner-picture">
          <source media="(max-width: 768px)" srcSet={mobileHeroBg} />
          <source media="(min-width: 769px)" srcSet={heroBg} />
          <img
            src={heroBg}
            alt={`${projectInfo?.name || 'Royal Varishtaa'} - ${projectInfo?.tagline || 'Premium DTCP Plots'}`}
            className="hero-banner-img"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Desktop / Tablet Floating Enquiry Form Overlay */}
        <div className="hero-enquiry-overlay-wrapper">
          <div className="hero-enquiry-box">
            <div className="enquiry-box-header">
              <span className="enquiry-badge">
                {/* <Sparkles size={12} className="badge-sparkle" /> */}
                <span>PRE-LAUNCH PRIVILEGE</span>
              </span>
              <h3 className="enquiry-title">Enquire Now</h3>
              <p className="enquiry-subtitle">
                Get instant layout plan, plot availability &amp; special pre-launch pricing.
              </p>
            </div>

            {isSubmitted ? (
              <div className="enquiry-success-msg animate-fade-in">
                <div className="success-icon-wrap">
                  <CheckCircle2 size={44} className="text-emerald" />
                </div>
                <h4>Enquiry Received!</h4>
                <p>Our Senior Property Advisor will connect with you via Call / WhatsApp shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="enquiry-form">
                <div className="form-group-hero">
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>

                <div className="form-group-hero">
                  <div className="hero-phone-input-wrap">
                    <span className="hero-phone-prefix">+91</span>
                    <input
                      type="tel"
                      className="hero-phone-field"
                      placeholder="10-Digit Mobile Number *"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <div className="form-group-hero">
                  <input
                    type="text"
                    placeholder="Your City *"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    autoComplete="address-level2"
                    required
                  />
                </div>

                <button type="submit" className="enquiry-submit btn-shimmer" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'SENDING...' : 'GET INSTANT DETAILS'}</span>
                  <Send size={15} />
                </button>

                <div className="hero-form-footer-badge">
                  <ShieldCheck size={14} className="shield-safe-icon" />
                  <span>100% Privacy Assured • Direct Developer Connect</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-dedicated Enquiry Card (Smoothly positioned directly below the banner) */}
      <div className="hero-mobile-enquiry-section">
        <div className="hero-enquiry-box mobile-card-hero">
          <div className="enquiry-box-header">
            <span className="enquiry-badge">
              {/* <Sparkles size={12} className="badge-sparkle" /> */}
              <span>PRE-LAUNCH PRIVILEGE</span>
            </span>
            <h3 className="enquiry-title">Enquire Now</h3>
            <p className="enquiry-subtitle">
              Get instant layout plan, plot availability &amp; special pre-launch pricing.
            </p>
          </div>

          {isSubmitted ? (
            <div className="enquiry-success-msg animate-fade-in">
              <div className="success-icon-wrap">
                <CheckCircle2 size={44} className="text-emerald" />
              </div>
              <h4>Enquiry Received!</h4>
              <p>Our Senior Property Advisor will connect with you via Call / WhatsApp shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-group-hero">
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group-hero">
                <div className="hero-phone-input-wrap">
                  <span className="hero-phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="hero-phone-field"
                    placeholder="10-Digit Mobile Number *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="form-group-hero">
                <input
                  type="text"
                  placeholder="Your City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />
              </div>

              <button type="submit" className="enquiry-submit btn-shimmer" disabled={isSubmitting}>
                <span>{isSubmitting ? 'SENDING...' : 'GET INSTANT DETAILS'}</span>
                <Send size={15} />
              </button>

              <div className="hero-form-footer-badge">
                <ShieldCheck size={14} className="shield-safe-icon" />
                <span>100% Privacy Assured • Direct Developer Connect</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
