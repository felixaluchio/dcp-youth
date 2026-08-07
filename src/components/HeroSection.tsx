import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroBgDefault from '../assets/images/dcp_hero_crowd_bg_1786026045655.jpg';

interface HeroSectionProps {
  onExploreClick: () => void;
  onRegisterClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onRegisterClick
}) => {
  // Completely isolated state for the Hero background image
  const [heroBgImage, setHeroBgImage] = useState<string>(heroBgDefault);

  const handleHeroBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newUrl = URL.createObjectURL(file);
      setHeroBgImage(newUrl);
    }
  };

  return (
    <section id="hero" className="relative min-h-[75vh] lg:min-h-[82vh] w-full overflow-hidden flex items-center px-6 sm:px-12 py-20 lg:py-32 bg-slate-950 text-white">
      {/* Background Crowd Photo */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBgImage})` }}
      >
        <img
          src={heroBgImage}
          alt="DCP Supporters and Members Rally"
          className="w-full h-full object-cover object-center bg-cover bg-center bg-no-repeat opacity-100"
          referrerPolicy="no-referrer"
        />
        {/* Dark center-focused overlay ensuring centered text is crisp and readable over the background photograph */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 pointer-events-none" />
      </div>

      {/* Hidden file input for isolated hero background upload */}
      <input
        type="file"
        id="hero-bg-upload"
        accept="image/*"
        className="hidden"
        onChange={handleHeroBgUpload}
      />

      {/* Flag stripe top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-black z-20"></div>
      <div className="absolute top-1 left-0 w-full h-1 bg-red-600 z-20"></div>
      <div className="absolute top-2 left-0 w-full h-1 bg-white z-20"></div>
      <div className="absolute top-3 left-0 w-full h-1 bg-emerald-600 z-20"></div>
      
      {/* Hero Content - Centered Layout */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center justify-center text-center px-4">


        {/* Main Headline */}
        <h1 className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white uppercase drop-shadow-lg leading-none mb-2">
          SKIZA WAKENYA
        </h1>

        {/* Sub-headline */}
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl text-gray-200 font-medium italic mt-4 drop-shadow-md">
          Justice, Unity and Progress
        </h2>

        {/* Description Paragraph */}
        <p className="text-center max-w-2xl text-gray-100 text-base md:text-lg leading-relaxed mt-4 font-normal drop-shadow-sm">
          Discover DCP's leadership, principles, and commitment to citizen participation, accountable governance and inclusive national development across all 47 counties.
        </p>

        {/* Centered CTA Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 w-full">
          <button
            onClick={onRegisterClick}
            className="inline-flex items-center justify-center px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 cursor-pointer border-b-2 border-emerald-800 active:scale-95"
          >
            <span>Register as a Member</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          <button
            onClick={onExploreClick}
            className="inline-flex items-center justify-center px-7 py-3.5 border-2 border-white text-white font-bold uppercase tracking-wider text-xs sm:text-sm rounded-lg hover:bg-white/10 transition-all duration-300 cursor-pointer shadow-sm active:scale-95"
          >
            <span>Explore DCP & 11 Pillars</span>
          </button>
        </div>
      </div>
    </section>
  );
};

