import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Users, MapPin, Calendar, FileText, ChevronRight, PhoneCall } from 'lucide-react';
import dcpOfficialLogo from '../assets/images/dcp_official_logo_hd_1786025213182.jpg';

interface NavbarProps {
  onOpenCountyModal: () => void;
  onOpenRegister: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCountyModal,
  onOpenRegister,
  activeSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2027-08-10T00:00:00+03:00').getTime();
    const calculate = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setDaysLeft(Math.ceil(difference / (1000 * 60 * 60 * 24)));
      } else {
        setDaysLeft(0);
      }
    };
    calculate();
    const interval = setInterval(calculate, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Bar Banner */}
      <div className="bg-slate-900 text-white text-[11px] font-medium tracking-wider py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Official Party Portal
            </span>
            <span className="text-slate-300 hidden sm:inline">Registered in Kenya · Certificate No. 103</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-300">
            <button 
              onClick={onOpenCountyModal}
              className="hover:text-emerald-400 flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>47 County Offices</span>
            </button>
            <span className="text-slate-600">|</span>
            <a href="tel:+254700123456" className="hover:text-emerald-400 flex items-center space-x-1 transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>+254 700 123 456</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Taller container for prominent logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24 lg:h-28 py-2">
          
          {/* Prominent Official DCP Logo with Youth League Badge */}
          <div className="flex flex-col items-center cursor-pointer py-1 group" onClick={() => scrollTo('hero')}>
            <img 
              src={dcpOfficialLogo} 
              alt="Democracy for the Citizens Party (DCP) Logo" 
              className="h-14 sm:h-16 lg:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md -mt-1 shadow-2xs">
              YOUTH LEAGUE
            </span>
          </div>

          {/* Desktop Nav Links - Centered with Pill Active State */}
          <nav className="hidden md:flex space-x-2 lg:space-x-3 items-center">
            <button
              onClick={() => scrollTo('hero')}
              className={`text-sm transition-all duration-200 cursor-pointer ${
                activeSection === 'hero' 
                  ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-sm' 
                  : 'px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-semibold'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => scrollTo('pillars')}
              className={`text-sm transition-all duration-200 cursor-pointer ${
                activeSection === 'pillars' 
                  ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-sm' 
                  : 'px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-semibold'
              }`}
            >
              About
            </button>

            <button
              onClick={() => scrollTo('leadership')}
              className={`text-sm transition-all duration-200 cursor-pointer ${
                activeSection === 'leadership' 
                  ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-sm' 
                  : 'px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-semibold'
              }`}
            >
              Leadership
            </button>

            <button
              onClick={() => scrollTo('rally')}
              className={`text-sm transition-all duration-200 cursor-pointer flex items-center ${
                activeSection === 'rally' 
                  ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-sm' 
                  : 'px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-semibold'
              }`}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Events
            </button>

            <button
              onClick={() => scrollTo('registration')}
              className={`text-sm transition-all duration-200 cursor-pointer ${
                activeSection === 'registration' 
                  ? 'bg-green-100 text-gray-900 px-4 py-2 rounded-lg font-bold shadow-sm' 
                  : 'px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg font-semibold'
              }`}
            >
              Membership
            </button>

            <button
              onClick={onOpenCountyModal}
              className="text-sm font-semibold px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
            >
              County Offices
            </button>
          </nav>

          {/* CTA Action Button & Days Countdown Pill */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="hidden md:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 mr-2 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-extrabold text-green-800 tracking-tight">{daysLeft} Days</span>
              <span className="text-xs font-semibold text-green-600/80 uppercase tracking-wider hidden lg:inline">To General elections</span>
            </div>
            <button
              onClick={() => scrollTo('registration')}
              className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Register as a Member</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => scrollTo('registration')}
              className="sm:hidden text-xs bg-green-600 text-white font-bold px-3 py-1.5 rounded-md shadow-sm"
            >
              Register
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Decorative 3px Kenyan Flag Color Stripe */}
      <div className="flex w-full h-[3px]">
        <div className="w-1/3 bg-black"></div>
        <div className="w-1/3 bg-red-600"></div>
        <div className="w-1/3 bg-green-600"></div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="p-3 bg-green-50 rounded-xl border border-green-100 mb-2">
            <p className="text-xs font-bold text-green-900">Skiza Wakenya Movement</p>
            <p className="text-xs text-green-700">Justice, Unity and Progress for every Kenyan citizen.</p>
          </div>

          <button
            onClick={() => scrollTo('hero')}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('pillars')}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Focus Areas (11 Pillars)</span>
            <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">11 Areas</span>
          </button>
          <button
            onClick={() => scrollTo('leadership')}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Party Leadership</span>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Exec & Youth</span>
          </button>
          <button
            onClick={() => scrollTo('rally')}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100 flex items-center justify-between"
          >
            <span>Events</span>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">Past & Upcoming</span>
          </button>
          <button
            onClick={() => scrollTo('registration')}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100"
          >
            Membership Registration (KES 100)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCountyModal();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
          >
            <MapPin className="w-4 h-4 text-green-600" />
            <span>47 County Offices Directory</span>
          </button>

          <div className="pt-2">
            <button
              onClick={() => scrollTo('registration')}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl text-center shadow-md flex items-center justify-center space-x-2"
            >
              <Users className="w-5 h-5" />
              <span>Register as a DCP Member</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
