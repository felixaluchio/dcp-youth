/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SystemAccessCounter } from './components/SystemAccessCounter';
import { FocusAreasSection } from './components/FocusAreasSection';
import { LeadershipSection } from './components/LeadershipSection';
import { EventHighlightSection } from './components/EventHighlightSection';
import VideoLibrarySection from './components/VideoLibrarySection';
import { RegistrationStepperSection } from './components/RegistrationStepperSection';
import ElectionCountdown from './components/ElectionCountdown';
import { Footer } from './components/Footer';

import { Pillar } from './types';
import { PillarDetailModal } from './components/PillarDetailModal';
import { CountyOfficesModal } from './components/CountyOfficesModal';
import { RallyPassModal } from './components/RallyPassModal';

import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './components/AdminDashboard';

function PublicPortal() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [isCountyModalOpen, setIsCountyModalOpen] = useState<boolean>(false);
  const [isRallyPassModalOpen, setIsRallyPassModalOpen] = useState<boolean>(false);

  // Track active scroll section for navbar highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'pillars', 'leadership', 'rally', 'registration'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegistration = () => {
    const el = document.getElementById('registration');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPillars = () => {
    const el = document.getElementById('pillars');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        onOpenCountyModal={() => setIsCountyModalOpen(true)}
        onOpenRegister={scrollToRegistration}
        activeSection={activeSection}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        
        {/* SECTION 1: HERO */}
        <HeroSection
          onExploreClick={scrollToPillars}
          onRegisterClick={scrollToRegistration}
        />

        {/* SECTION 2: FOCUS AREAS (11 Pillars) */}
        <FocusAreasSection
          onSelectPillar={(pillar) => setSelectedPillar(pillar)}
        />

        {/* SECTION 3: LEADERSHIP */}
        <LeadershipSection />

        {/* SECTION 4: EVENT HIGHLIGHT (Rally Banner) */}
        <EventHighlightSection
          onOpenRallyPass={() => setIsRallyPassModalOpen(true)}
          onOpenCountyModal={() => setIsCountyModalOpen(true)}
        />

        {/* VIDEO LIBRARY SECTION */}
        <VideoLibrarySection />

        {/* SECTION 5: MEMBERSHIP REGISTRATION (5-Step Form) */}
        <RegistrationStepperSection />

        {/* ROAD TO 2027 GENERAL ELECTIONS COUNTDOWN */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 my-8">
          <ElectionCountdown />
        </div>

        {/* SYSTEM ACCESS / CITIZEN ENGAGEMENT COUNTER */}
        <SystemAccessCounter onJoinClick={scrollToRegistration} />

      </main>

      {/* SECTION 5: FOOTER (Dark Theme) */}
      <Footer
        onOpenCountyModal={() => setIsCountyModalOpen(true)}
        onOpenRegister={scrollToRegistration}
      />

      {/* MODALS */}
      <PillarDetailModal
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
        onOpenRegister={scrollToRegistration}
      />

      <CountyOfficesModal
        isOpen={isCountyModalOpen}
        onClose={() => setIsCountyModalOpen(false)}
      />

      <RallyPassModal
        isOpen={isRallyPassModalOpen}
        onClose={() => setIsRallyPassModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPortal />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

