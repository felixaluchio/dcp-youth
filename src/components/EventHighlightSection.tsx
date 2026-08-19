import React, { useState, useEffect } from 'react';
import { MapPin, Building2, Users, X, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './AdminDashboard';
import crowdBg from '../assets/images/regenerated_image_1786108471770.png';
import galleryImg2 from '../assets/images/regenerated_image_1786111282999.jpg';
import heroCrowdBg from '../assets/images/dcp_hero_crowd_bg_1786026045655.jpg';
import heroCampaignBg from '../assets/images/regenerated_image_1786106702811.png';
import altMeetingBg from '../assets/images/dcp_hero_campaign_bg_1786021682934.jpg';
import nyeriBg from '../assets/images/regenerated_image_1786111625658.png';

interface EventHighlightSectionProps {
  onOpenRallyPass?: () => void;
  onOpenCountyModal?: () => void;
}

interface UpcomingEventData {
  id: string;
  status: 'UPCOMING';
  dateBox: {
    month: string;
    day: string;
    year: string;
  };
  county?: string;
  meta?: string;
  date: string;
  title: string;
  location: string;
  description: string;
  buttonText: string;
}

interface FirestorePastEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  image_urls?: string[];
  imageUrl?: string;
  videoUrl?: string;
  youtube_url?: string;
  type?: 'photo' | 'video' | 'upcoming' | 'text' | string;
  timing?: 'past' | 'upcoming' | string;
  location?: string;
  county?: string;
  category?: string;
  buttonText?: string;
}

const getYouTubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

// Date Parsing Helper for Upcoming Events Date Box
const parseDateBox = (dateStr?: string) => {
  if (!dateStr) {
    return { month: 'AUG', day: '14', year: '2026' };
  }
  try {
    const parts = dateStr.trim().split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const mIdx = parseInt(parts[1], 10) - 1;
      return {
        month: monthNames[mIdx] || 'AUG',
        day: parseInt(parts[2], 10).toString().padStart(2, '0'),
        year: parts[0],
      };
    }

    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return { month: 'AUG', day: '14', year: '2026' };
    }

    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    return { month, day, year };
  } catch {
    return { month: 'AUG', day: '14', year: '2026' };
  }
};

export const EventHighlightSection: React.FC<EventHighlightSectionProps> = () => {
  const [pastEvents, setPastEvents] = useState<FirestorePastEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [selectedEventModal, setSelectedEventModal] = useState<FirestorePastEvent | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Helper to format date nicely
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'RECENT EVENT';
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr.toUpperCase();
    return parsed.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).toUpperCase();
  };

  // Fetch past events from Firestore collection 'events' with timeout safety
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        console.log('[PUBLIC UI] Fetching events from Firestore "events" collection...');
        
        // Race getDocs against an 8s timeout to ensure UI never hangs on network latency
        const queryPromise = getDocs(collection(db, 'events'));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore connection timeout')), 8000)
        );

        const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);
        const fetched: FirestorePastEvent[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const rawDate = data.event_date || data.date || '';
          const videoUrlVal = data.videoUrl || data.youtube_url || data.youtubeUrl || data.video_url;
          const timingVal = data.timing || (data.type === 'upcoming' || data.type === 'text' ? 'upcoming' : 'past');

          if (timingVal === 'upcoming' || data.type === 'upcoming' || data.type === 'text') {
            fetched.push({
              id: doc.id,
              timing: 'upcoming',
              type: 'upcoming',
              title: data.title || 'DCP Upcoming Rally',
              description: data.description || 'Join our upcoming DCP mobilization session.',
              event_date: rawDate,
              location: data.location || 'Kenya',
              county: data.county || '',
              category: data.category || 'Open to public',
              buttonText: data.buttonText || 'Register as a Member',
            });
          } else if (data.type === 'video' || videoUrlVal) {
            fetched.push({
              id: doc.id,
              timing: 'past',
              type: 'video',
              title: data.title || 'DCP Video Coverage',
              description: data.description || data.snippet || 'DCP Youth League media coverage.',
              event_date: rawDate,
              videoUrl: videoUrlVal,
              youtube_url: videoUrlVal,
              location: data.location || data.category || 'DCP Video',
              category: data.category,
            });
          } else {
            const imgList: string[] = data.image_urls && Array.isArray(data.image_urls) && data.image_urls.length > 0
              ? data.image_urls
              : (data.image_url ? [data.image_url] : (data.imageUrl ? [data.imageUrl] : []));
            
            const primaryImg = imgList[0] || data.imageUrl || data.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';

            fetched.push({
              id: doc.id,
              timing: 'past',
              type: 'photo',
              title: data.title || 'DCP Youth Event',
              description: data.description || 'DCP Youth League event and mobilization drive.',
              event_date: rawDate,
              image_urls: imgList.length > 0 ? imgList : [primaryImg],
              imageUrl: primaryImg,
              location: data.location || data.category || 'DCP Event',
              category: data.category,
            });
          }
        });

        // Sort by event_date in descending order so newest events appear first
        fetched.sort((a, b) => {
          const timeA = new Date(a.event_date || 0).getTime();
          const timeB = new Date(b.event_date || 0).getTime();
          return timeB - timeA;
        });

        if (isMounted) {
          setPastEvents(fetched);
        }
      } catch (err) {
        console.warn('[PUBLIC UI] Error fetching events from Firestore:', err);
      } finally {
        if (isMounted) {
          setIsLoadingEvents(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingEvents = pastEvents.filter((event) => event.timing === 'upcoming');
  const pastPhotoEvents = pastEvents.filter((event) => event.timing !== 'upcoming' && (event.type === 'photo' || !event.type));

  return (
    <section id="rally" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upcoming Events Section Header */}
        <div className="mb-8 border-l-4 border-green-600 pl-4 max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Upcoming Events</h2>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">Join Our Next Rallies & Mobilization Sessions</p>
        </div>

        {/* Upcoming / Ongoing Events List (Horizontal Text Cards - NO images or videos) */}
        {upcomingEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-sm max-w-5xl mx-auto mb-12">
            <p className="text-gray-500 text-sm font-medium">No upcoming events scheduled at this time.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-5xl mx-auto mb-12">
            {upcomingEvents.map((event) => {
              const { month, day, year } = parseDateBox(event.event_date);

              return (
                <div
                  key={event.id}
                  className="flex flex-col md:flex-row items-center bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow gap-4 md:gap-6"
                >
                  {/* LEFT BLOCK: Light green bordered box containing vertically stacked date */}
                  <div className="bg-green-50 border border-green-200 rounded-xl w-24 h-24 flex flex-col items-center justify-center shrink-0 shadow-inner">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {month}
                    </span>
                    <span className="text-3xl font-extrabold text-green-800 leading-none my-1">
                      {day}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {year}
                    </span>
                  </div>

                  {/* CENTER BLOCK: Title, icons for Location/Category, and Description */}
                  <div className="flex-grow md:px-2 py-1 md:py-0 w-full">
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                      {event.title}
                    </h3>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2 mb-2.5">
                      {event.location && (
                        <span className="flex items-center gap-1.5 font-semibold text-gray-700">
                          <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                          {event.location}{event.county ? `, ${event.county}` : ''}
                        </span>
                      )}
                      {event.category && (
                        <span className="flex items-center gap-1.5 font-medium text-gray-600">
                          <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                          {event.category}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* RIGHT BLOCK: Required for non-members + Register button */}
                  <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end justify-center pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <span className="text-[11px] text-gray-400 italic mb-1.5 text-center md:text-right">
                      Required for non-members
                    </span>
                    <a
                      href="#registration"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-block text-center bg-green-800 hover:bg-green-700 text-white font-bold py-2.5 px-5 text-sm rounded-xl transition-all whitespace-nowrap w-full md:w-auto cursor-pointer shadow-md shadow-green-900/10"
                    >
                      {event.buttonText || 'Register as a Member'}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Past Events (Photo Gallery) */}
        <div id="past-events" className="scroll-mt-28 w-full max-w-5xl mx-auto pt-8">
          <div className="mb-8 border-l-4 border-green-600 pl-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Past Events (Photo Gallery)</h2>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">DCP Youth League Events & Mobilization</p>
          </div>

          {isLoadingEvents ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-3xl shadow-sm border border-gray-100">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-2" />
              <p className="text-sm font-medium">Loading events from Firestore...</p>
            </div>
          ) : pastPhotoEvents.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-sm w-full max-w-5xl mx-auto">
              <p className="text-gray-500 text-sm font-medium">No past events to display.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
              {pastPhotoEvents.map((event) => {
                  const cardCover = (event.image_urls && event.image_urls[0]) || event.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';

                  return (
                    <div key={event.id} className="bg-white p-6 rounded-3xl shadow-xl flex flex-col justify-between gap-4 w-full relative">
                      {/* Photo Area */}
                      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={cardCover}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-t-xl"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 right-4 bg-gray-800/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10 pointer-events-none">
                          PAST
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          {/* Date */}
                          <span className="font-bold text-green-700 text-sm uppercase mb-1 block">
                            {formatDateDisplay(event.event_date)}
                          </span>

                          {/* Title */}
                          <h3 className="text-2xl font-extrabold text-gray-950 mb-2 leading-snug">
                            {event.title}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>{event.location || event.category || 'Kenya'}</span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-700 text-base leading-relaxed mb-4">
                            {event.description}
                          </p>
                        </div>

                        {/* View Gallery Button */}
                        {event.image_urls && event.image_urls.length > 0 && (
                          <button
                            onClick={() => setSelectedEventModal(event)}
                            className="w-full text-center border-2 border-green-600 text-green-600 font-semibold py-2.5 px-6 rounded-xl hover:bg-green-50 transition-colors cursor-pointer mt-auto"
                          >
                            View Gallery ({event.image_urls.length})
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>



      </div>

      {/* Photo Gallery Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative flex flex-col p-6 md:p-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEventModal(null)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 cursor-pointer transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Event Header */}
            <div className="mb-6 border-b border-gray-100 pb-4 pr-10">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider block mb-1">
                {formatDateDisplay(selectedEventModal.event_date)}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                {selectedEventModal.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {selectedEventModal.description}
              </p>
            </div>

            {/* Event Photo Gallery Grid */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
                Event Photo Gallery ({selectedEventModal.image_urls.length} Photo{selectedEventModal.image_urls.length === 1 ? '' : 's'})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedEventModal.image_urls.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity shadow-sm relative group"
                    onClick={() => setLightboxImage(imgUrl)}
                  >
                    <img
                      src={imgUrl}
                      alt={`${selectedEventModal.title} photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-[70] p-2 bg-black/50 rounded-full cursor-pointer transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

