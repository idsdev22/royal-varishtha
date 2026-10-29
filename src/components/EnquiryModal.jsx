import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { submitLead } from '../services/leadService';

export const EnquiryModal = ({ isOpen, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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

    const sourceContext = initialData?.title || 'Modal Enquiry';

    try {
      await submitLead({
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        phone: cleanPhone,
        phoneNumber: cleanPhone,
        city: formData.city.trim(),
        address: formData.city.trim(),
        leadSource: 'Google Ads',
        source: sourceContext
      });
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // Fallback
      }
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={handleClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          title="Close Modal (Esc)"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="modal-success-view animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle2 size={52} className="text-emerald" />
            </div>
            <h3 className="modal-success-title">Enquiry Received!</h3>
            <p className="modal-success-text">
              Thank you, <strong>{formData.name}</strong>. Our senior property advisor will reach out to you at <strong>+91 {formData.phone}</strong> with the requested layout plan, pricing sheet, and pre-launch benefits.
            </p>
            <button
              type="button"
              className="btn-primary w-100 mt-4"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="modal-form-view">
            <div className="modal-header">
              <div className="modal-tag">PRE-LAUNCH ENQUIRY</div>
              <h3 className="modal-title">Enquire Now</h3>
              <p className="modal-subtitle">
                Share your details below and our senior property team will assist you shortly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <div className="phone-input-wrap">
                  <span className="phone-prefix">+91</span>
                  <input
                    type="tel"
                    className="form-input phone-field"
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

              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your City *"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn w-100 btn-shimmer"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>SUBMITTING...</span>
                ) : (
                  <>
                    <span>ENQUIRE NOW</span>
                    <Send size={15} />
                  </>
                )}
              </button>

              <div className="modal-footer-security">
                <ShieldCheck size={14} className="text-emerald" />
                <span>Zero Spam • 100% Privacy • Direct Official Connect</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
