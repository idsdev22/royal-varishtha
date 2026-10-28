import React, { useState } from 'react';
import { HeroBanner } from './components/HeroBanner';
import { ProjectOverview } from './components/ProjectOverview';
import { Amenities } from './components/Amenities';
import { MasterPlanGallery } from './components/MasterPlanGallery';
import { NearbyConnectivity } from './components/NearbyConnectivity';
import { StickyActions } from './components/StickyActions';
import { EnquiryModal } from './components/EnquiryModal';
import { propertyData } from './data/propertyData';
import './App.css';

function App() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    initialData: {}
  });

  const handleOpenEnquiry = (initialData = {}) => {
    setModalState({
      isOpen: true,
      initialData
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const { projectInfo } = propertyData;

  return (
    <div className="app-container">
      <main>
        {/* Hero Banner with Integrated Direct Enquiry Form */}
        <HeroBanner
          onFormSuccess={() => { }}
          onOpenEnquiry={() => handleOpenEnquiry({ title: 'Hero Banner Enquiry' })}
        />

        {/* Project Overview & Key Highlights */}
        <ProjectOverview
          onOpenEnquiry={() => handleOpenEnquiry({ title: 'Project Overview Enquiry' })}
        />

        {/* Curated Community Amenities */}
        <Amenities />

        {/* Master Plan & Visual Showcase Gallery */}
        <MasterPlanGallery
          onOpenEnquiry={() => handleOpenEnquiry({ title: 'Gallery Layout Enquiry' })}
        />

        {/* Location Advantage & Strategic Distances */}
        <NearbyConnectivity
          onOpenEnquiry={() => handleOpenEnquiry({ title: 'Location Advantage Enquiry' })}
        />
      </main>

      {/* Modern Minimal Footer */}
      <footer className="simple-footer">
        <div className="container simple-footer-container">
          <div className="footer-left">
            <div className="footer-brand">{projectInfo.name} by {projectInfo.developer}</div>
            <div className="footer-copyright">© {new Date().getFullYear()} {projectInfo.developer}. All rights reserved.</div>
          </div>
          <div className="footer-right">
            <span className="footer-rera-note">
              {projectInfo.approvalBadge} • Kurumbapalayam, Coimbatore
            </span>
          </div>
        </div>
      </footer>

      {/* Desktop Vertical Tabs & Mobile 50/50 Bottom Sticky Bar */}
      <StickyActions onOpenEnquiry={() => handleOpenEnquiry({ title: 'Sticky Action Enquiry' })} />

      {/* Global Lead Enquiry Modal */}
      <EnquiryModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        initialData={modalState.initialData}
      />
    </div>
  );
}

export default App;
