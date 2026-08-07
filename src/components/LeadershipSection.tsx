import React from 'react';
import { Users, Shield, MapPin, Sparkles } from 'lucide-react';
import gachaguaPortrait from '../assets/images/regenerated_image_1786085851914.webp';
import malalaPortrait from '../assets/images/regenerated_image_1786085853750.jpg';
import parseinaPortrait from '../assets/images/regenerated_image_1786086572072.png';
import obagaPortrait from '../assets/images/obaga_official_portrait_1786086922128.jpg';
import thigaPortrait from '../assets/images/wanjiku_thiga_portrait_1786087758019.jpg';
import miriamMarikiPortrait from '../assets/images/regenerated_image_1786088644048.png';
import mablyOwinoPortrait from '../assets/images/regenerated_image_1786089111936.png';
import alvinaKaburaPortrait from '../assets/images/regenerated_image_1786089818254.png';
import jamesWaHawkerPortrait from '../assets/images/regenerated_image_1786090513791.jpg';
import graceNjengoPortrait from '../assets/images/grace_njengo_portrait.jpg';
import thiongoPortrait from '../assets/images/thiongo_samwel_portrait_1786090359617.jpg';

interface LeaderItem {
  name: string;
  initials: string;
  title: string;
  location: string;
  description?: string;
  imageUrl?: string;
}

const nationalLeaders: LeaderItem[] = [
  {
    name: 'H.E. Rigathi Gachagua',
    initials: 'RG',
    title: 'Party Leader',
    location: 'Nyeri County',
    description: 'Founding leader of the Democracy for the Citizens Party.',
    imageUrl: gachaguaPortrait,
  },
  {
    name: 'Cleophas Malala',
    initials: 'CM',
    title: 'Deputy Party Leader',
    location: 'Kakamega County',
    description: 'Strategist and long-serving public representative.',
    imageUrl: malalaPortrait,
  },
  {
    name: 'David Mingati Parseina',
    initials: 'MP',
    title: 'National Chairperson',
    location: 'Narok County',
    description: 'Chairs the National Executive Committee.',
    imageUrl: parseinaPortrait,
  },
  {
    name: 'Hezron Obaga',
    initials: 'HO',
    title: 'Secretary-General',
    location: 'Kisii County',
    description: 'Oversees party administration and coordination.',
    imageUrl: obagaPortrait,
  },
];

const youthLeaders: LeaderItem[] = [
  {
    name: 'Wanjiku Thiga',
    initials: 'WT',
    title: 'National Youth Leader',
    location: 'National Chapter',
    imageUrl: thigaPortrait,
  },
  {
    name: 'Miriam Mariki',
    initials: 'MM',
    title: 'National Deputy Youth Leader',
    location: 'Organizing Secretary',
    imageUrl: miriamMarikiPortrait,
  },
  {
    name: 'Mably Owino',
    initials: 'MO',
    title: 'National Deputy Youth Leader',
    location: 'Chairperson Operations',
    imageUrl: mablyOwinoPortrait,
  },
  {
    name: 'Alvina Kabura',
    initials: 'AK',
    title: 'Secretary',
    location: 'International Affairs',
    imageUrl: alvinaKaburaPortrait,
  },
  {
    name: 'James Wa Hawker',
    initials: 'JH',
    title: 'Youth Chairperson',
    location: 'Nairobi Chapter',
    imageUrl: jamesWaHawkerPortrait,
  },
  {
    name: 'Grace Njengo',
    initials: 'GN',
    title: 'Youth Chairperson',
    location: 'Nyeri Chapter',
    imageUrl: graceNjengoPortrait,
  },
  {
    name: "Thiong'o Samwel Muiruri",
    initials: 'TM',
    title: 'Youth Chairperson',
    location: 'Gilgil Chapter',
    imageUrl: thiongoPortrait,
  },
];

const FeaturedLeaderCard: React.FC<{ leader: LeaderItem }> = ({ leader }) => (
  <div className="relative group col-span-1 md:col-span-2 md:row-span-2 bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col h-full transform hover:-translate-y-1.5 transition-all duration-300 z-10">
    {/* Top Image Container (80% Height) */}
    <div className="relative w-full h-[80%] overflow-hidden rounded-t-xl bg-emerald-900 flex items-center justify-center">
      {/* Featured Badge */}
      <div className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white text-[10px] sm:text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10">
        <Sparkles className="w-3.5 h-3.5 fill-white text-white" />
        <span>FEATURED LEADER</span>
      </div>

      {/* Photo */}
      {leader.imageUrl ? (
        <img
          src={leader.imageUrl}
          alt={leader.name}
          className="object-cover w-full h-full object-top group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="border-2 border-white/40 rounded-full h-24 w-24 flex items-center justify-center text-white text-3xl font-extrabold shadow-md bg-white/10 backdrop-blur-md">
          {leader.initials}
        </div>
      )}

      {/* Location Badge */}
      <div className="absolute bottom-4 left-4 bg-gray-800/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 uppercase z-10">
        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{leader.location}</span>
      </div>
    </div>

    {/* Content Container (Bottom 20% Height) */}
    <div className="bg-white p-4 w-full h-[20%] flex flex-col justify-center rounded-b-xl border-x border-b border-gray-200 relative overflow-hidden">
      <div>
        <span className="text-[10px] md:text-xs font-bold text-teal-600 uppercase tracking-wider mb-0.5 block">
          CHAIRPERSON - DCP YOUTH LEAGUE
        </span>
        <h4 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
          {leader.name}
        </h4>
        <p className="text-xs sm:text-sm font-bold text-teal-700">
          National Youth Leader
        </p>
      </div>

      {/* Highlighted Description Box */}
      <div className="bg-green-50/50 border border-green-200/60 rounded-xl p-2 mt-1.5">
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
          Spearheading the nationwide DCP Youth League movement to mobilize young Kenyans across all 47 counties and drive grassroots youth leadership.
        </p>
      </div>
    </div>
  </div>
);

const LeaderCard: React.FC<{ leader: LeaderItem }> = ({ leader }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
    {/* Square Photo Placeholder / Container */}
    <div className="w-full aspect-square bg-green-800 relative flex items-center justify-center overflow-hidden">
      {leader.imageUrl ? (
        <img 
          src={leader.imageUrl} 
          alt={leader.name}
          className="w-full h-full object-cover object-top"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="border border-white/30 rounded-full h-16 w-16 flex items-center justify-center text-white text-xl font-bold shadow-sm bg-white/10 backdrop-blur-2xs">
          {leader.initials}
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 z-10">
        <MapPin className="w-3 h-3 text-emerald-400" />
        <span>{leader.location}</span>
      </div>
    </div>

    {/* Text Area */}
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-bold text-gray-900">{leader.name}</h4>
        <p className="text-sm font-semibold text-green-700 mt-1">{leader.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{leader.location}</p>
      </div>
      {leader.description && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          {leader.description}
        </p>
      )}
    </div>
  </div>
);

export const LeadershipSection: React.FC = () => {
  return (
    <section id="leadership" className="py-20 bg-slate-100 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-[11px] uppercase tracking-widest rounded-full mb-4">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Party Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Guiding DCP Towards Progress
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mt-4 leading-relaxed">
            Meet the visionary national leaders and dynamic youth champions driving the Democracy for the Citizens Party agenda across Kenya.
          </p>
        </div>

        {/* Group 1: Key Youth Leadership */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">
                Key Youth Leadership
              </span>
              <h3 className="text-2xl font-black text-gray-900">
                Youth League Leadership
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Youth Champions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {youthLeaders.map((leader, index) => {
              if (leader.name === 'Wanjiku Thiga') {
                return <FeaturedLeaderCard key={index} leader={leader} />;
              }
              return <LeaderCard key={index} leader={leader} />;
            })}
          </div>
        </div>

        {/* Group 2: National Leadership */}
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">
                National Leadership
              </span>
              <h3 className="text-2xl font-black text-gray-900">
                National Executive Council
              </h3>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Executive Committee</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nationalLeaders.map((leader, index) => (
              <LeaderCard key={index} leader={leader} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
