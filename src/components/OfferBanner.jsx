import React, { useState, useEffect } from 'react';
import { Gift, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const OfferBanner = ({ onOpenEnquiry }) => {
  const { preLaunchOffer, projectInfo } = propertyData;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="offer-strip-section" id="offers">
      <div className="container">
        <div className="offer-banner-card">
          <div className="offer-badge-pill">
            {/* <Sparkles size={14} /> */}
            <span>{preLaunchOffer.badge}</span>
          </div>

          <div className="offer-content-grid">
            {/* Left: Offer Details */}
            <div className="offer-info-col">
              <h2 className="offer-headline">{preLaunchOffer.headline}</h2>
              <p className="offer-subheadline">{preLaunchOffer.subheadline}</p>

              <div className="offer-perks-list">
                {preLaunchOffer.perks.map((perk, idx) => (
                  <div key={idx} className="offer-perk-item">
                    <CheckCircle2 size={16} className="text-gold" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Countdown & CTA */}
            <div className="offer-timer-col">
              <div className="countdown-card">
                <div className="timer-header">
                  <Clock size={16} className="text-gold" />
                  <span>PRE-LAUNCH PRICE LOCK EXPIRES IN</span>
                </div>

                <div className="timer-digits-row">
                  <div className="timer-unit-box">
                    <span className="digit">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="unit-label">Days</span>
                  </div>
                  <span className="timer-colon">:</span>
                  <div className="timer-unit-box">
                    <span className="digit">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="unit-label">Hours</span>
                  </div>
                  <span className="timer-colon">:</span>
                  <div className="timer-unit-box">
                    <span className="digit">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="unit-label">Mins</span>
                  </div>
                  <span className="timer-colon">:</span>
                  <div className="timer-unit-box">
                    <span className="digit">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="unit-label">Secs</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-gold w-100 mt-3"
                  onClick={onOpenEnquiry}
                >
                  <span>Claim Pre-Launch Price Lock</span>
                  <ArrowRight size={16} />
                </button>

                <p className="timer-disclaimer">*Applicable for first 25 bookings only. Terms & Conditions apply.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
