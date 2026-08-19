import React, { useState, useEffect } from 'react';
import { Loader2, MapPin, Play } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './AdminDashboard';

export interface VideoEventItem {
  id: string;
  type?: string;
  title: string;
  description: string;
  event_date: string;
  videoUrl?: string;
  youtube_url?: string;
  category?: string;
  location?: string;
}

const getYouTubeEmbedUrl = (url?: string | null) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const formatDateDisplay = (dateString?: string) => {
  if (!dateString) return 'DCP MEDIA';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).toUpperCase();
  } catch {
    return dateString;
  }
};

export const VideoLibrarySection: React.FC = () => {
  const [events, setEvents] = useState<VideoEventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchVideoEvents = async () => {
      try {
        console.log('[VIDEO LIBRARY] Fetching events from Firestore...');
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetched: VideoEventItem[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const videoUrlVal = data.videoUrl || data.youtube_url || data.youtubeUrl || data.video_url;

          if (data.type === 'video' || videoUrlVal) {
            fetched.push({
              id: doc.id,
              type: 'video',
              title: data.title || 'DCP Video Coverage',
              description: data.description || data.snippet || 'DCP Youth League media coverage.',
              event_date: data.event_date || data.date || '',
              videoUrl: videoUrlVal,
              youtube_url: videoUrlVal,
              category: data.category || 'EVENTS',
              location: data.location || data.category || 'Kenya',
            });
          }
        });

        // Sort by event_date descending if available
        fetched.sort((a, b) => {
          if (!a.event_date) return 1;
          if (!b.event_date) return -1;
          return new Date(b.event_date).getTime() - new Date(a.event_date).getTime();
        });

        if (isMounted) {
          setEvents(fetched);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[VIDEO LIBRARY] Error loading videos from Firestore:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchVideoEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const videoEvents = events.filter((event) => event.type === 'video');

  return (
    <section id="video-library" className="w-full max-w-7xl mx-auto px-4 py-12 bg-slate-50 scroll-mt-24">
      {/* SECTION HEADING */}
      <div className="mb-8 border-l-4 border-green-600 pl-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Video Library</h2>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">Speeches, Rallies & Campaign Coverage</p>
      </div>

      {/* VIDEO GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-2" />
          <p className="text-sm font-medium">Loading Video Library...</p>
        </div>
      ) : videoEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200/60 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">No videos published in the Video Library yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events
            .filter((event) => event.type === 'video')
            .map((event) => {
              const videoSrc = event.videoUrl || event.youtube_url;
              const embedUrl = getYouTubeEmbedUrl(videoSrc);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col group"
                >
                  {/* YouTube Embed Player */}
                  <div className="relative w-full h-52 bg-gray-900 overflow-hidden">
                    {embedUrl ? (
                      <iframe
                        className="w-full h-full object-cover"
                        src={embedUrl}
                        title={event.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 p-4 text-center">
                        <Play className="w-10 h-10 text-green-500 mb-2" />
                        <span className="text-xs font-semibold">Video Link Unavailable</span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-green-700 text-white text-[10px] font-black px-2.5 py-1 uppercase tracking-wider rounded-sm z-10 shadow-sm pointer-events-none">
                      {event.category || 'EVENTS'}
                    </div>
                  </div>

                  {/* Card Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2.5 h-[2px] bg-green-600"></span>
                        {formatDateDisplay(event.event_date)}
                      </p>
                      <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2 leading-snug mb-2">
                        {event.title}
                      </h3>
                      {event.location && event.location !== event.category && (
                        <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
};

export default VideoLibrarySection;
