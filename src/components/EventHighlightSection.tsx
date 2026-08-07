import React, { useState } from 'react';
import { MapPin, Building2, Users, X } from 'lucide-react';
import crowdBg from '../assets/images/regenerated_image_1786108471770.png';
import galleryImg2 from '../assets/images/regenerated_image_1786111282999.jpg';
import rallyBg from '../assets/images/dcp_rally_event_1786021697345.jpg';
import heroCrowdBg from '../assets/images/dcp_hero_crowd_bg_1786026045655.jpg';
import heroCampaignBg from '../assets/images/regenerated_image_1786106702811.png';
import altMeetingBg from '../assets/images/dcp_hero_campaign_bg_1786021682934.jpg';
import nyeriBg from '../assets/images/regenerated_image_1786111625658.png';

interface EventHighlightSectionProps {
  onOpenRallyPass?: () => void;
  onOpenCountyModal?: () => void;
}

interface EventItemData {
  id: string;
  status: 'UPCOMING' | 'PAST' | 'ONGOING';
  // For Upcoming horizontal layout
  dateBox?: {
    month: string;
    day: string;
    year: string;
  };
  county?: string;
  meta?: string;
  // Common fields
  date: string;
  title: string;
  location: string;
  description: string;
  buttonText: string;
  image?: string;
}

const eventsList: EventItemData[] = [
  {
    id: '1',
    status: 'UPCOMING',
    dateBox: {
      month: 'AUG',
      day: '14',
      year: '2026',
    },
    date: 'AUGUST 14, 2026',
    title: 'Youth Policy Forum',
    location: 'Moi University, Uasin Gishu',
    county: 'Uasin Gishu County',
    meta: 'Open to public',
    description: 'A DCP-organized listening event bringing citizens and leaders together for open dialogue.',
    buttonText: 'Register as a Member',
  },
  {
    id: '2',
    status: 'UPCOMING',
    dateBox: {
      month: 'AUG',
      day: '23',
      year: '2026',
    },
    date: 'AUGUST 23, 2026',
    title: 'Coastal Region Town Hall',
    location: 'Mombasa Cultural Centre',
    county: 'Mombasa County',
    meta: 'Open to public',
    description: 'A DCP-organized listening event bringing citizens and leaders together for open dialogue.',
    buttonText: 'Register as a Member',
  },
  {
    id: '3',
    status: 'PAST',
    date: 'NOVEMBER 5, 2025',
    title: 'Unveiling the DCP Youth Agenda',
    location: 'DCP Headquarters, Nairobi',
    description: 'Unveiling a nationwide youth-driven strategy to transform political engagement and organize for 2027 across all 47 counties.',
    image: crowdBg,
    buttonText: 'View Gallery',
  },
  {
    id: '4',
    status: 'PAST',
    date: 'APRIL 11, 2026',
    title: 'Launch of the Nyeri Youth League',
    location: 'DCP County Offices, Nyeri Town',
    description: 'A high-voltage political event mobilizing local youth and building a unified platform for grassroots governance in the Mt. Kenya region.',
    image: nyeriBg,
    buttonText: 'View Gallery',
  },
];

export const EventHighlightSection: React.FC<EventHighlightSectionProps> = () => {
  // Agenda event states
  const [isAgendaGalleryOpen, setIsAgendaGalleryOpen] = useState(false);
  const [agendaSelectedImage, setAgendaSelectedImage] = useState<string | null>(null);
  const [agendaGalleryImages, setAgendaGalleryImages] = useState([
    { url: crowdBg, alt: 'Unveiling the DCP Youth Agenda Main Rally' },
    { url: galleryImg2, alt: 'Youth Leaders & Supporters' },
    { url: heroCrowdBg, alt: 'DCP Youth Convention Hall' },
    { url: heroCampaignBg, alt: 'Grassroots Mobilization Drive' },
    { url: altMeetingBg, alt: 'National Executive Youth Meeting' },
  ]);
  const [agendaUploadIndex, setAgendaUploadIndex] = useState<number>(0);

  // Nyeri event states
  const [isNyeriGalleryOpen, setIsNyeriGalleryOpen] = useState(false);
  const [nyeriSelectedImage, setNyeriSelectedImage] = useState<string | null>(null);
  const [nyeriGalleryImages, setNyeriGalleryImages] = useState([
    { url: nyeriBg, alt: 'Launch of the Nyeri Youth League Main Event' },
    { url: heroCampaignBg, alt: 'Grassroots Mobilization in Nyeri' },
    { url: heroCrowdBg, alt: 'Nyeri Youth Delegation Hall' },
    { url: altMeetingBg, alt: 'DCP Executive Leadership Meeting' },
    { url: crowdBg, alt: 'Supporters & Youth Delegates' },
  ]);
  const [nyeriUploadIndex, setNyeriUploadIndex] = useState<number>(0);

  // Isolated Image Upload Handler for Agenda Card
  const handleAgendaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAgendaGalleryImages((prev) => {
        const updated = [...prev];
        const idx = agendaUploadIndex < updated.length ? agendaUploadIndex : 0;
        updated[idx] = { ...updated[idx], url: imageUrl };
        return updated;
      });
    }
  };

  // Isolated Image Upload Handler for Nyeri Card
  const handleNyeriUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNyeriGalleryImages((prev) => {
        const updated = [...prev];
        const idx = nyeriUploadIndex < updated.length ? nyeriUploadIndex : 0;
        updated[idx] = { ...updated[idx], url: imageUrl };
        return updated;
      });
    }
  };

  return (
    <section id="rally" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
          Past & Upcoming Events
        </h2>

        {/* Upcoming / Ongoing Events List */}
        <div className="flex flex-col gap-6 max-w-5xl mx-auto mb-6">
          {eventsList.filter((event) => event.status !== 'PAST').map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Left Column (Date Box) */}
              <div className="bg-green-50 border border-green-200 rounded-lg w-24 h-24 flex flex-col items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  {event.dateBox?.month}
                </span>
                <span className="text-3xl font-extrabold text-green-800 leading-none my-1">
                  {event.dateBox?.day}
                </span>
                <span className="text-xs text-gray-500">
                  {event.dateBox?.year}
                </span>
              </div>

              {/* Middle Column (Content) */}
              <div className="flex-grow md:px-6 py-4 md:py-0 w-full">
                <h3 className="text-xl font-bold text-gray-900">
                  {event.title}
                </h3>

                {/* Meta Info Row */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    {event.location}
                  </span>
                  {event.county && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                      {event.county}
                    </span>
                  )}
                  {event.meta && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400 shrink-0" />
                      {event.meta}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {event.description}
                </p>
              </div>

              {/* Right Column (Action Button) */}
              <div className="shrink-0 w-full md:w-auto">
                <span className="block text-[11px] text-gray-400 italic mb-1 text-center md:text-right">
                  Required for non-members
                </span>
                <a
                  href="#registration"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-block text-center bg-green-800 hover:bg-green-700 text-white font-semibold py-2.5 px-4 text-sm rounded-lg transition-colors whitespace-nowrap w-full md:w-auto cursor-pointer"
                >
                  {event.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Past Events 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
          {eventsList.filter((event) => event.status === 'PAST').map((event) => {
            const isNyeri = event.id === '4';
            const cardCover = isNyeri 
              ? (nyeriGalleryImages[0]?.url || event.image) 
              : (agendaGalleryImages[0]?.url || event.image);

            return (
              <div key={event.id} className="bg-white p-6 rounded-3xl shadow-xl flex flex-col justify-between gap-4 w-full relative">
                {/* Isolated File Upload Input & Label for Card */}
                {isNyeri ? (
                  <>
                    <input
                      type="file"
                      id="nyeri-gallery-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleNyeriUpload}
                    />
                    <label htmlFor="nyeri-gallery-upload" className="hidden" id="nyeri-upload-label">
                      Change Nyeri Photo
                    </label>
                  </>
                ) : (
                  <>
                    <input
                      type="file"
                      id="agenda-gallery-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAgendaUpload}
                    />
                    <label htmlFor="agenda-gallery-upload" className="hidden" id="agenda-upload-label">
                      Change Agenda Photo
                    </label>
                  </>
                )}

                {/* Image Area with Past Badge */}
                <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={cardCover}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-t-xl"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-4 right-4 bg-gray-800/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    PAST
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    {/* Date */}
                    <span className="font-bold text-green-700 text-sm uppercase mb-1 block">
                      {event.date}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl font-extrabold text-gray-950 mb-2 leading-snug">
                      {event.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{event.location}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-base leading-relaxed mb-4">
                      {event.description}
                    </p>
                  </div>

                  {/* Ghost Button */}
                  <button
                    onClick={() => {
                      if (event.id === '4') {
                        setIsNyeriGalleryOpen(true);
                      } else {
                        setIsAgendaGalleryOpen(true);
                      }
                    }}
                    className="w-full text-center border-2 border-green-600 text-green-600 font-semibold py-2.5 px-6 rounded-xl hover:bg-green-50 transition-colors cursor-pointer mt-auto"
                  >
                    {event.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Agenda Gallery & Manifesto Modal */}
      {isAgendaGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col p-6 md:p-8">
            {/* Isolated File Upload Input for Agenda Modal */}
            <input
              type="file"
              id="agenda-gallery-modal-upload"
              accept="image/*"
              className="hidden"
              onChange={handleAgendaUpload}
            />
            <label htmlFor="agenda-gallery-modal-upload" className="hidden">
              Change Agenda Modal Photo
            </label>

            {/* Close Button */}
            <button
              onClick={() => setIsAgendaGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Event Photo Gallery (Top Section) */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Photo 1 (Featured) */}
                <div
                  className="col-span-2 row-span-2 aspect-square md:aspect-auto bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm relative group"
                  onClick={() => setAgendaSelectedImage(agendaGalleryImages[0].url)}
                >
                  <img
                    src={agendaGalleryImages[0].url}
                    alt={agendaGalleryImages[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Photos 2, 3, 4, 5 */}
                {agendaGalleryImages.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="col-span-1 aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm relative group"
                    onClick={() => setAgendaSelectedImage(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Text (Bottom Section) */}
            <div className="border-t border-gray-200 pt-8 mt-4">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">The DCP Youth 2027 Strategy</h2>
              <p className="text-gray-700 mb-6 border-l-4 border-green-600 pl-4 italic font-medium">Under H.E. Rigathi Gachagua’s vision, the DCP Youth League is mobilizing for 2027. As National Youth Leader Wanjiku Thiga declared: "Our revolution will not be televised; it will be organized."</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Core Agenda:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li><strong>The Training Manual:</strong> Launching our "political Bible" to build unbought, unstoppable leaders.</li>
                    <li><strong>Reclaiming Seats:</strong> Currently, only 52 of 330 MPs are youth. We are coming for the spaces where decisions are made.</li>
                    <li><strong>Waived Fees:</strong> Leadership isn't for sale. Youth candidates will earn nominations via grassroots member recruitment, not fees.</li>
                    <li><strong>Championing Women:</strong> With only 12 young female MCAs out of 1,450, enforcing the gender rule is our moral duty.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The 2027 Blueprint:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Train 300+ youth aspirants.</li>
                    <li>Establish offices in all 47 counties.</li>
                    <li>Mobilize 3 million youth votes.</li>
                    <li>Launch active campus chapters nationwide.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Agenda Lightbox Overlay */}
      {agendaSelectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setAgendaSelectedImage(null)}
        >
          <button
            onClick={() => setAgendaSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[70] p-2 bg-black/50 rounded-full cursor-pointer transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={agendaSelectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Nyeri Gallery & Manifesto Modal */}
      {isNyeriGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col p-6 md:p-8">
            {/* Isolated File Upload Input for Nyeri Modal */}
            <input
              type="file"
              id="nyeri-gallery-modal-upload"
              accept="image/*"
              className="hidden"
              onChange={handleNyeriUpload}
            />
            <label htmlFor="nyeri-gallery-modal-upload" className="hidden">
              Change Nyeri Modal Photo
            </label>

            {/* Close Button */}
            <button
              onClick={() => setIsNyeriGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Event Photo Gallery (Top Section) */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Event Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Photo 1 (Featured) */}
                <div
                  className="col-span-2 row-span-2 aspect-square md:aspect-auto bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm relative group"
                  onClick={() => setNyeriSelectedImage(nyeriGalleryImages[0].url)}
                >
                  <img
                    src={nyeriGalleryImages[0].url}
                    alt={nyeriGalleryImages[0].alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Photos 2, 3, 4, 5 */}
                {nyeriGalleryImages.slice(1).map((img, index) => (
                  <div
                    key={index}
                    className="col-span-1 aspect-square bg-gray-200 rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity shadow-sm relative group"
                    onClick={() => setNyeriSelectedImage(img.url)}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Text Content (Bottom Section) */}
            <div className="border-t border-gray-200 pt-8 mt-4">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">DCP Unveils Nyeri Youth League</h2>
              <p className="text-gray-700 mb-6 border-l-4 border-green-600 pl-4 italic font-medium">The Democracy for Citizens Party (DCP) has officially launched its Nyeri Youth League chapter, marking a tactical and calculated escalation to consolidate the Mt. Kenya region ahead of the 2027 General Election.</p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">A Strategic Foothold:</h3>
              <ul className="list-disc pl-5 space-y-3 text-gray-700">
                <li><strong>Grassroots Mobilization:</strong> Hundreds of youth turned Nyeri into a focal point of political action, translating the party's "Skiza Wakenya" slogan into local power.</li>
                <li><strong>Capturing the Youth Vote:</strong> We are transforming the youth demographic from passive voters into a highly mobilized, volatile force ready to dictate the region's political rhythm.</li>
                <li><strong>The 2026 Plan of Action:</strong> This robust youth structure proves the DCP is aggressively expanding its footprint, securing the mountain's youth vote, and negotiating from a position of absolute dominance.</li>
              </ul>
            </div>

          </div>
        </div>
      )}

      {/* Nyeri Lightbox Overlay */}
      {nyeriSelectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setNyeriSelectedImage(null)}
        >
          <button
            onClick={() => setNyeriSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[70] p-2 bg-black/50 rounded-full cursor-pointer transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={nyeriSelectedImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};
