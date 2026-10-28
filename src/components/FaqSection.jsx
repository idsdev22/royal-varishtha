import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { propertyData } from '../data/propertyData';

export const FaqSection = () => {
  const { faqs } = propertyData;
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section className="section faq-section" id="faqs">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-title">
            Frequently Asked <span className="text-burgundy">Questions</span>
          </h2>
          <p className="section-description">
            Find immediate answers regarding project approvals, plot dimensions, bank loans, and the registration process.
          </p>
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className={`faq-card ${isOpen ? 'active' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-question-text">{faq.q}</h4>
                  <div className="faq-toggle-icon">
                    <ChevronDown size={20} />
                  </div>
                </div>

                {isOpen && (
                  <div className="faq-answer-row animate-fade-in">
                    <p className="faq-answer-text">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
