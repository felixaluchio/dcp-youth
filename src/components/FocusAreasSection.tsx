import React, { useState } from 'react';
import { Pillar } from '../types';
import { ELEVEN_PILLARS } from '../data/kenyaData';
import { 
  GraduationCap, 
  HeartPulse, 
  Sprout, 
  Briefcase, 
  Building2, 
  Landmark, 
  Cpu, 
  Users, 
  Home, 
  ShieldCheck, 
  Handshake,
  Search,
  ArrowRight,
  Filter,
  CheckCircle
} from 'lucide-react';

interface FocusAreasSectionProps {
  onSelectPillar: (pillar: Pillar) => void;
}

export const FocusAreasSection: React.FC<FocusAreasSectionProps> = ({ onSelectPillar }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Icon Resolver
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-7 h-7 text-emerald-600" />;
      case 'HeartPulse': return <HeartPulse className="w-7 h-7 text-rose-600" />;
      case 'Sprout': return <Sprout className="w-7 h-7 text-emerald-600" />;
      case 'Briefcase': return <Briefcase className="w-7 h-7 text-amber-600" />;
      case 'Building2': return <Building2 className="w-7 h-7 text-blue-600" />;
      case 'Landmark': return <Landmark className="w-7 h-7 text-indigo-600" />;
      case 'Cpu': return <Cpu className="w-7 h-7 text-cyan-600" />;
      case 'Users': return <Users className="w-7 h-7 text-purple-600" />;
      case 'Home': return <Home className="w-7 h-7 text-teal-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-7 h-7 text-emerald-700" />;
      case 'Handshake': return <Handshake className="w-7 h-7 text-red-600" />;
      default: return <CheckCircle className="w-7 h-7 text-emerald-600" />;
    }
  };

  const categories = ['All', 'Social', 'Economic', 'Infrastructure', 'Governance'];

  const filteredPillars = ELEVEN_PILLARS.filter(pillar => {
    const matchesCategory = selectedCategory === 'All' || pillar.category === selectedCategory;
    const matchesSearch = pillar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pillar.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pillar.fullDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="pillars" className="py-20 bg-slate-50 text-slate-900 relative">
      
      {/* Decorative background visual elements */}
      <div className="absolute top-0 inset-x-0 h-1 kenya-flag-strip" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center gap-3 justify-center mb-2">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">11 Core Pillars</span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
            HOW WE PLAN TO BUILD A <span className="text-[#00843D]">BETTER KENYA</span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            Discover DCP's 11 core policy pillars guiding our commitment to accountable governance, youth empowerment, and national development.
          </p>
        </div>

        {/* Controls Bar: Search & Category Filter */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 hidden lg:inline flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search policy pillars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>

        </div>

        {/* 11 Pillars Grid (Responsive: 1 col mobile, 2 sm, 3 or 4 cols desktop) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => onSelectPillar(pillar)}
              className="group bg-white rounded-lg p-5 border-2 border-slate-200 hover:border-black shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 inset-x-0 h-1 bg-black opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Pillar Icon & Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
                    {getIcon(pillar.icon)}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-sm bg-slate-100 text-slate-800">
                    {pillar.category}
                  </span>
                </div>

                {/* Pillar Title */}
                <h3 className="text-base font-black text-slate-900 group-hover:text-[#00843D] transition-colors mb-2 uppercase tracking-tight">
                  {pillar.title}
                </h3>

                {/* Pillar Description */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-medium">
                  {pillar.shortDescription}
                </p>
              </div>

              {/* Card Footer Link */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#00843D]">
                <span>View Full Plan</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>

        {filteredPillars.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 mt-8">
            <p className="text-slate-500 text-base">No policy pillars match your search query "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
