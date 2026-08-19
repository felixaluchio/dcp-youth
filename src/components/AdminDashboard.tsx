import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, collection, addDoc, getDocs, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, setPersistence, browserSessionPersistence } from 'firebase/auth';
import {
  Camera,
  Video,
  Plus,
  Upload,
  Calendar,
  Type,
  FileText,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  ExternalLink,
  LogOut,
  ArrowLeft,
  Image as ImageIcon,
  Film,
  Sparkles,
  Search,
  Tag,
  Loader2,
  Database,
  AlertTriangle,
  Pencil,
  X,
  Layers,
  Clock,
  MapPin,
  Building2
} from 'lucide-react';
import dcpLogo from '../assets/images/dcp_official_logo_hd_1786025213182.jpg';

// ============================================================================
// FIREBASE CONFIGURATION
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCeXJ8eJQoaFKpFfxzjRaSHsW0J6EeePDk",
  authDomain: "youth-league-app-e3eaf.firebaseapp.com",
  projectId: "youth-league-app-e3eaf",
  storageBucket: "youth-league-app-e3eaf.firebasestorage.app",
  messagingSenderId: "738592898815",
  appId: "1:738592898815:web:18a7b28818aef7c23156ca"
};

// Initialize Firebase App safely for React SPA environments
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
    });
  } catch (_e) {
    return getFirestore(app);
  }
})();

// Data Interfaces
interface PhotoGalleryAdminItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrls: string[];
  imageUrl?: string;
  category?: string;
  location?: string;
  county?: string;
  timing?: 'past' | 'upcoming';
  type?: string;
  createdAt?: string;
}

interface VideoAdminItem {
  id: string;
  title: string;
  category: string;
  date: string;
  youtubeUrl: string;
  snippet?: string;
  createdAt?: string;
}

export const AdminDashboard: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'gallery' | 'videos' | 'upcoming'>('gallery');

  // Photo / Event State
  const [photoItems, setPhotoItems] = useState<PhotoGalleryAdminItem[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDate, setPhotoDate] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoCategory, setPhotoCategory] = useState('CHURCH SERVICES');
  const [eventLocation, setEventLocation] = useState('');
  
  // Multi-file state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState(false);

  // Upcoming Event State
  const [upcomingTitle, setUpcomingTitle] = useState('');
  const [upcomingDate, setUpcomingDate] = useState('');
  const [upcomingLocation, setUpcomingLocation] = useState('');
  const [upcomingCounty, setUpcomingCounty] = useState('');
  const [upcomingCategory, setUpcomingCategory] = useState('MOBILIZATION RALLY');
  const [upcomingDescription, setUpcomingDescription] = useState('');
  const [isSubmittingUpcoming, setIsSubmittingUpcoming] = useState(false);
  const [editingUpcomingId, setEditingUpcomingId] = useState<string | null>(null);

  // Video State
  const [videoItems, setVideoItems] = useState<VideoAdminItem[]>([]);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('EVENTS');
  const [videoDate, setVideoDate] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoSnippet, setVideoSnippet] = useState('');
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    setIsLoggingIn(true);
    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, authEmail, authPassword);
      showToast('Successfully logged in!');
    } catch (err: any) {
      console.error('[DCP ADMIN] Login error:', err);
      showToast(`Login failed: ${err.message || 'Invalid credentials'}`, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showToast('Logged out successfully.');
    } catch (err: any) {
      console.error('[DCP ADMIN] Logout error:', err);
      showToast(`Logout failed: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  // Fetch events from Firestore
  useEffect(() => {
    let isMounted = true;

    const fetchFirestoreEvents = async () => {
      try {
        console.log('[DCP ADMIN] Fetching events from Firestore "events" collection...');
        const queryPromise = getDocs(collection(db, 'events'));
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Firestore connection timeout')), 8000)
        );

        const querySnapshot = await Promise.race([queryPromise, timeoutPromise]);
        
        const fetchedEvents: PhotoGalleryAdminItem[] = [];
        const fetchedVideos: VideoAdminItem[] = [];

        querySnapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const eventDate = data.event_date || data.date || '';
          const videoUrlVal = data.videoUrl || data.youtube_url || data.youtubeUrl || data.video_url;

          if (data.type === 'video' || videoUrlVal) {
            fetchedVideos.push({
              id: docSnap.id,
              title: data.title || 'Untitled Video',
              category: data.category || 'EVENTS',
              date: eventDate,
              youtubeUrl: videoUrlVal || '',
              snippet: data.description || data.snippet || '',
              createdAt: eventDate,
            });
          } else {
            const imgList: string[] = data.image_urls && Array.isArray(data.image_urls) && data.image_urls.length > 0
              ? data.image_urls
              : (data.image_url ? [data.image_url] : (data.imageUrl ? [data.imageUrl] : []));
            const primaryImg = imgList[0] || data.imageUrl || data.image_url || '';

            fetchedEvents.push({
              id: docSnap.id,
              title: data.title || 'Untitled Event',
              date: eventDate,
              description: data.description || '',
              imageUrls: imgList,
              imageUrl: primaryImg,
              category: data.category || 'EVENT',
              location: data.location || '',
              county: data.county || '',
              timing: data.timing === 'upcoming' || data.type === 'upcoming' || data.type === 'text' ? 'upcoming' : 'past',
              type: data.type || (data.timing === 'upcoming' ? 'text' : 'photo'),
              createdAt: eventDate,
            });
          }
        });

        // Sort by event_date descending
        fetchedEvents.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        fetchedVideos.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

        if (isMounted) {
          setPhotoItems(fetchedEvents);
          setVideoItems(fetchedVideos);
        }
      } catch (err) {
        console.warn('[DCP ADMIN] Error fetching events from Firestore:', err);
      }
    };

    fetchFirestoreEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const isError = type === 'error' || /failed|error|alert|please fill|cancelled/i.test(msg);
    setToast({ message: msg, type: isError ? 'error' : 'success' });
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  // Multi Image File Select
  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
      files.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemovePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // EDIT HANDLER (Populate Photo Form)
  const handleEdit = (event: PhotoGalleryAdminItem) => {
    setEditingEventId(event.id);
    setPhotoTitle(event.title);
    setPhotoDate(event.date);
    setPhotoDescription(event.description);
    setPhotoCategory(event.category || 'CHURCH SERVICES');
    setEventLocation(event.location || '');
    setSelectedFiles([]);
    const urls = event.imageUrls && event.imageUrls.length > 0
      ? event.imageUrls
      : event.imageUrl
        ? [event.imageUrl]
        : [];
    setImagePreviews(urls);

    // Smooth scroll to top of page so user sees populated form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEditPhoto = handleEdit;

  const handleCancelEdit = () => {
    resetPhotoForm();
    showToast('Editing cancelled.');
  };

  // ImgBB Upload Helper Function
  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const apiKey = "831824fca12923abc68ae37cefc266e0"; 
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error("ImgBB upload failed. Aborting Firestore save.");
    }
    
    return data.data.url;
  };

  // Save/Update Photo Event (ImgBB Storage + Firestore DB)
  const handleSavePhotoEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle || !photoDate || !photoDescription) {
      showToast('Please fill in all required event fields.');
      return;
    }

    setIsSubmittingPhoto(true);

    try {
      let uploadedUrls: string[] = [];
      if (selectedFiles.length > 0) {
        console.log(`[DCP ADMIN] Uploading ${selectedFiles.length} file(s) to ImgBB...`);
        const uploadPromises = selectedFiles.map((file) => uploadToImgBB(file));
        uploadedUrls = await Promise.all(uploadPromises);
        console.log(`[DCP ADMIN] ImgBB upload complete! Received ${uploadedUrls.length} URL(s).`, uploadedUrls);
      }

      const existingWebUrls = imagePreviews.filter(
        (p) => p.startsWith('http://') || p.startsWith('https://')
      );

      let finalUrls: string[] = [];
      if (uploadedUrls.length > 0) {
        finalUrls = [...existingWebUrls, ...uploadedUrls];
      } else if (existingWebUrls.length > 0) {
        finalUrls = existingWebUrls;
      } else {
        finalUrls = ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'];
      }

      const primaryImageUrl = finalUrls[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800';

      const updatePayload = {
        title: photoTitle,
        description: photoDescription,
        event_date: photoDate,
        date: photoDate,
        type: 'photo',
        timing: 'past',
        image_urls: finalUrls,
        image_url: primaryImageUrl,
        imageUrl: primaryImageUrl,
        category: photoCategory,
        location: eventLocation,
      };

      if (editingEventId) {
        // UPDATE Existing Event in Firestore
        console.log('[DCP ADMIN] Updating event in Firestore "events":', editingEventId);
        const eventDocRef = doc(db, 'events', editingEventId);
        await updateDoc(eventDocRef, updatePayload);

        showToast('Photo event updated successfully!');

        // Update local state array
        setPhotoItems((prev) =>
          prev.map((item) =>
            item.id === editingEventId
              ? {
                  ...item,
                  title: photoTitle,
                  date: photoDate,
                  description: photoDescription,
                  category: photoCategory,
                  location: eventLocation,
                  timing: 'past',
                  type: 'photo',
                  imageUrls: finalUrls,
                  imageUrl: primaryImageUrl,
                }
              : item
          )
        );
      } else {
        // INSERT New Event into Firestore
        console.log('[DCP ADMIN] Saving event document to Firestore "events" collection...');
        const eventsRef = collection(db, 'events');
        const docRef = await addDoc(eventsRef, {
          ...updatePayload,
          createdAt: serverTimestamp(),
        });

        console.log('[DCP ADMIN] Firestore Event Document created with ID:', docRef.id);
        showToast(`Photo event successfully saved! (${finalUrls.length} photo(s))`);

        const localNewPhotoEvent: PhotoGalleryAdminItem = {
          id: docRef.id || `pg-${Date.now()}`,
          title: photoTitle,
          date: photoDate,
          description: photoDescription,
          category: photoCategory,
          location: eventLocation,
          timing: 'past',
          type: 'photo',
          imageUrls: finalUrls,
          imageUrl: primaryImageUrl,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setPhotoItems((prev) => [localNewPhotoEvent, ...prev]);
      }

      resetPhotoForm();
    } catch (err: any) {
      console.error('[DCP ADMIN] Event Submit Exception:', err);
      showToast(`Upload / Save Failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  const resetPhotoForm = () => {
    setEditingEventId(null);
    setPhotoTitle('');
    setPhotoDate('');
    setPhotoDescription('');
    setEventLocation('');
    setSelectedFiles([]);
    setImagePreviews([]);
  };

  // UPCOMING EVENTS HANDLERS
  const resetUpcomingForm = () => {
    setUpcomingTitle('');
    setUpcomingDate('');
    setUpcomingLocation('');
    setUpcomingCounty('');
    setUpcomingCategory('MOBILIZATION RALLY');
    setUpcomingDescription('');
    setEditingUpcomingId(null);
  };

  const handleEditUpcoming = (item: PhotoGalleryAdminItem) => {
    setEditingUpcomingId(item.id);
    setUpcomingTitle(item.title);
    setUpcomingDate(item.date);
    setUpcomingLocation(item.location || '');
    setUpcomingCounty(item.county || '');
    setUpcomingCategory(item.category || 'MOBILIZATION RALLY');
    setUpcomingDescription(item.description);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveUpcomingEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upcomingTitle || !upcomingDate || !upcomingDescription) {
      showToast('Please fill in required fields (Title, Date, Description).', 'error');
      return;
    }

    setIsSubmittingUpcoming(true);

    try {
      const payload = {
        title: upcomingTitle,
        event_date: upcomingDate,
        date: upcomingDate,
        location: upcomingLocation,
        county: upcomingCounty,
        category: upcomingCategory || 'MOBILIZATION RALLY',
        description: upcomingDescription,
        timing: 'upcoming',
        type: 'text',
        buttonText: 'Register as a Member',
      };

      if (editingUpcomingId) {
        console.log('[DCP ADMIN] Updating upcoming event document in Firestore:', editingUpcomingId);
        const docRef = doc(db, 'events', editingUpcomingId);
        await updateDoc(docRef, payload);
        showToast('Upcoming event successfully updated!');

        setPhotoItems((prev) =>
          prev.map((item) =>
            item.id === editingUpcomingId
              ? {
                  ...item,
                  title: upcomingTitle,
                  date: upcomingDate,
                  description: upcomingDescription,
                  location: upcomingLocation,
                  county: upcomingCounty,
                  category: upcomingCategory,
                  timing: 'upcoming',
                  type: 'text',
                }
              : item
          )
        );
      } else {
        console.log('[DCP ADMIN] Saving upcoming event to Firestore "events" collection...');
        const eventsRef = collection(db, 'events');
        const docRef = await addDoc(eventsRef, {
          ...payload,
          createdAt: serverTimestamp(),
        });

        showToast('Upcoming event successfully published!');

        const newItem: PhotoGalleryAdminItem = {
          id: docRef.id || `up-${Date.now()}`,
          title: upcomingTitle,
          date: upcomingDate,
          description: upcomingDescription,
          category: upcomingCategory,
          location: upcomingLocation,
          county: upcomingCounty,
          timing: 'upcoming',
          type: 'text',
          imageUrls: [],
          imageUrl: '',
          createdAt: new Date().toISOString().split('T')[0],
        };

        setPhotoItems((prev) => [newItem, ...prev]);
      }

      resetUpcomingForm();
    } catch (err: any) {
      console.error('[DCP ADMIN] Save upcoming event error:', err);
      showToast(`Save failed: ${err.message || 'Unknown error'}`, 'error');
    } finally {
      setIsSubmittingUpcoming(false);
    }
  };

  // Save Video Item
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle || !videoDate || !videoUrl) {
      showToast('Please fill in all required video fields.');
      return;
    }

    setIsSubmittingVideo(true);

    try {
      console.log('[DCP ADMIN] Saving video event document to Firestore "events" collection...');
      const eventsRef = collection(db, 'events');
      const docRef = await addDoc(eventsRef, {
        title: videoTitle,
        category: videoCategory,
        youtube_url: videoUrl,
        event_date: videoDate,
        type: 'video',
        createdAt: serverTimestamp(),
      });

      console.log('[DCP ADMIN] Video Document created in Firestore with ID:', docRef.id);

      const localVideo: VideoAdminItem = {
        id: docRef.id || `v-${Date.now()}`,
        title: videoTitle,
        category: videoCategory,
        date: videoDate,
        youtubeUrl: videoUrl,
        snippet: videoSnippet || 'DCP Youth League media coverage.',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setVideoItems((prev) => [localVideo, ...prev]);

      showToast('Video event saved to Firestore!');
      resetVideoForm();
    } catch (err: any) {
      console.error('[DCP ADMIN] Save Video Exception:', err);
      showToast(`Error saving video item: ${err.message || 'Operation failed'}`);
    } finally {
      setIsSubmittingVideo(false);
    }
  };

  const resetVideoForm = () => {
    setVideoTitle('');
    setVideoDate('');
    setVideoUrl('');
    setVideoSnippet('');
  };

  // DELETE HANDLER (Firestore DB + Local State)
  const handleDelete = async (eventId: string) => {
    console.log("Attempting to delete event ID:", eventId);
    if (!eventId) {
      console.error("Delete failed: eventId is undefined! The ID was not mapped properly in getDocs.");
      showToast("Delete failed: Event ID is missing.", 'error');
      return;
    }

    try {
      await deleteDoc(doc(db, "events", eventId));
      console.log("Successfully deleted from Firestore.");

      // Remove the deleted event from the local UI state instantly
      setPhotoItems((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

      showToast("Event deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting document:", error);
      showToast(`Error deleting document: ${error?.message || 'Unknown error'}`, 'error');
    }
  };

  const handleDeletePhoto = handleDelete;

  const handleDeleteVideo = async (id: string) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "events", id));
      setVideoItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Video item removed from Video Library.');
    } catch (error: any) {
      console.error("Error deleting video document:", error);
      showToast(`Error deleting video: ${error?.message || 'Unknown error'}`, 'error');
    }
  };

  // Auth Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center font-sans p-4">
        <Loader2 className="w-10 h-10 animate-spin text-green-500 mb-4" />
        <p className="text-sm font-medium text-slate-400 tracking-wide">Verifying Admin Session...</p>
      </div>
    );
  }

  // Unauthenticated Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Toast Notification Alert */}
        {toast && (
          <div
            className={`fixed top-5 right-5 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce ${
              toast.type === 'error'
                ? 'bg-red-600 border-red-500'
                : 'bg-green-800 border-green-600'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-200 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
            )}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
          {/* Header Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-white p-1 rounded-2xl border border-slate-700 shadow-md mb-4 flex items-center justify-center">
              <img
                src={dcpLogo}
                alt="DCP Logo"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">DCP Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Sign in with your administrator account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="admin@dcp.or.ke"
                className="w-full bg-slate-900 border border-slate-800 focus:border-green-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-800 focus:border-green-500 text-white rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2 mt-6"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Login to Admin Portal</span>
              )}
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-8 pt-6 border-t border-slate-900 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 text-white px-5 py-3.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce ${
            toast.type === 'error'
              ? 'bg-red-600 border-red-500'
              : 'bg-green-800 border-green-600'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-red-200 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-300 shrink-0" />
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <img
                src={dcpLogo}
                alt="DCP Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl border border-slate-700 bg-white p-0.5 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    DCP Youth League
                  </h1>
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border border-green-500/30">
                    Admin CMS
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400">Content Management & Media Portal</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-green-700 hover:bg-green-600 border border-green-600 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-3">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5 hidden lg:block">
              Management Modules
            </p>

            <nav className="flex flex-row lg:flex-col overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('gallery')}
                className={`shrink-0 w-auto lg:w-full flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-green-700 text-white shadow-lg shadow-green-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Photo Gallery</span>
                <span className="ml-auto bg-slate-900/60 text-xs px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                  {photoItems.filter((i) => i.timing !== 'upcoming').length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`shrink-0 w-auto lg:w-full flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-green-700 text-white shadow-lg shadow-green-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Video Library</span>
                <span className="ml-auto bg-slate-900/60 text-xs px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                  {videoItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('upcoming')}
                className={`shrink-0 w-auto lg:w-full flex items-center gap-2.5 sm:gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-green-700 text-white shadow-lg shadow-green-900/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Manage Upcoming Events</span>
                <span className="ml-auto bg-slate-900/60 text-xs px-2 py-0.5 rounded-full border border-white/10 shrink-0">
                  {photoItems.filter((i) => i.timing === 'upcoming').length}
                </span>
              </button>
            </nav>
          </div>

          {/* Media Storage Status Card */}
          <div className="bg-slate-950/80 border border-green-800/50 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-green-400">
              <Database className="w-4 h-4" />
              <span>Hybrid Backend Active</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Photos upload to ImgBB & full event records save directly to the <code className="text-green-300">events</code> collection in Firestore.
            </p>
          </div>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 space-y-8">
          
          {/* TAB 1: MANAGE PHOTO GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              
              {/* Form Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {editingEventId ? 'Edit Photo Gallery Event' : 'Upload New Photo Gallery Event'}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {editingEventId ? 'Modify event details and attach extra images.' : 'Add past events, town halls, or rallies to the photo showcase.'}
                      </p>
                    </div>
                  </div>

                  {editingEventId && (
                    <button
                      onClick={handleCancelEdit}
                      type="button"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSavePhotoEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Title */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-green-400" />
                        Event Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={photoTitle}
                        onChange={(e) => setPhotoTitle(e.target.value)}
                        placeholder="e.g. Youth Leadership Conference"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Event Date */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Event Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={photoDate}
                        onChange={(e) => setPhotoDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Location */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        Event Location / Venue
                      </label>
                      <input
                        type="text"
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                        placeholder="e.g. Moi University, Uasin Gishu"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* Event Category */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-green-400" />
                        Category
                      </label>
                      <select
                        value={photoCategory}
                        onChange={(e) => setPhotoCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="CHURCH SERVICES">CHURCH SERVICES</option>
                        <option value="RALLIES">RALLIES</option>
                        <option value="TOWN HALLS">TOWN HALLS</option>
                        <option value="YOUTH SUMMITS">YOUTH SUMMITS</option>
                        <option value="COMMUNITY ENGAGEMENT">COMMUNITY ENGAGEMENT</option>
                      </select>
                    </div>
                  </div>

                  {/* Attach Photos input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-blue-400" />
                      Attach Photos (Multiple Allowed)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesChange}
                        id="photo-upload-input"
                        className="hidden"
                      />
                      <label
                        htmlFor="photo-upload-input"
                        className="w-full px-4 py-3 bg-slate-900 border border-dashed border-slate-700 hover:border-green-500 rounded-xl text-slate-400 hover:text-white text-sm flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="truncate">
                          {selectedFiles.length > 0
                            ? `${selectedFiles.length} new photo file(s) selected`
                            : imagePreviews.length > 0
                            ? `${imagePreviews.length} photo(s) attached`
                            : 'Select image file(s) from computer'}
                        </span>
                        <ImageIcon className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                      </label>
                    </div>
                  </div>

                  {/* Multi Image Preview Grid */}
                  {imagePreviews.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-green-400" />
                        Attached Photos ({imagePreviews.length})
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {imagePreviews.map((previewUrl, idx) => (
                          <div key={idx} className="relative group h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                            <img
                              src={previewUrl}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePreview(idx)}
                              className="absolute top-1.5 right-1.5 bg-black/80 hover:bg-red-600 text-white p-1 rounded-md transition-colors"
                              title="Remove Photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description / Paragraphs */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      Description / Paragraphs <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                      rows={3}
                      placeholder="Enter detailed description or highlights of the photo gallery event..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {editingEventId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingPhoto}
                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-green-900/40 flex items-center gap-2 transition-all cursor-pointer text-sm disabled:opacity-50"
                    >
                      {isSubmittingPhoto ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading to Firebase & Saving...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{editingEventId ? 'Update Event' : 'Save Event'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Photo Gallery Items Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Camera className="w-5 h-5 text-green-400" />
                    <span>Existing Photo Gallery Items ({photoItems.length})</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 tracking-wider">
                        <th className="pb-3 font-bold">Image</th>
                        <th className="pb-3 font-bold">Event title</th>
                        <th className="pb-3 font-bold">Category</th>
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {photoItems.map((item) => {
                        const isUpcoming = item.timing === 'upcoming';
                        const thumbUrl = (item.imageUrls && item.imageUrls[0]) || item.imageUrl;
                        const extraPhotosCount = item.imageUrls && item.imageUrls.length > 1 ? item.imageUrls.length - 1 : 0;

                        return (
                          <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="py-4 pr-4">
                              {isUpcoming ? (
                                <div className="w-16 h-12 rounded-lg border border-green-800/60 bg-green-950/40 flex flex-col items-center justify-center text-green-400">
                                  <Clock className="w-5 h-5" />
                                  <span className="text-[8px] font-bold uppercase mt-0.5">TEXT CARD</span>
                                </div>
                              ) : (
                                <div className="relative inline-block">
                                  <img
                                    src={thumbUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
                                    alt={item.title}
                                    className="w-16 h-12 object-cover rounded-lg border border-slate-700 bg-slate-900"
                                  />
                                  {extraPhotosCount > 0 && (
                                    <span className="absolute -bottom-1 -right-1 bg-green-700 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-green-500 shadow">
                                      +{extraPhotosCount}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                                {isUpcoming && (
                                  <span className="bg-green-500/20 text-green-300 font-extrabold text-[9px] px-2 py-0.5 rounded border border-green-500/30 uppercase tracking-wider">
                                    UPCOMING
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-400 text-xs line-clamp-1">{item.description}</p>
                              {item.location && (
                                <p className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />
                                  <span>{item.location}</span>
                                </p>
                              )}
                            </td>
                            <td className="py-4 pr-4">
                              <span className="bg-amber-500/10 text-amber-400 font-bold px-2.5 py-1 rounded-md border border-amber-500/20 text-[10px]">
                                {item.category || 'EVENT'}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-slate-300 font-medium whitespace-nowrap">
                              {item.date}
                            </td>
                            <td className="py-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleEdit(item)}
                                  className="p-2 text-blue-400 hover:text-white hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Event"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-2 text-red-400 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MANAGE VIDEO LIBRARY */}
          {activeTab === 'videos' && (
            <div className="space-y-8">
              
              {/* Video Form Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center gap-3 pb-6 border-b border-slate-800 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add New Video to Library</h2>
                    <p className="text-xs text-slate-400">Link speeches, rallies, town halls, or short clips from YouTube.</p>
                  </div>
                </div>

                <form onSubmit={handleSaveVideo} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Video Title */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-green-400" />
                        Video Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        placeholder="e.g. FULL SPEECH: H.E. Rigathi Gachagua at DCP Youth Launch"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={videoCategory}
                        onChange={(e) => setVideoCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="EVENTS">EVENTS</option>
                        <option value="RALLIES">RALLIES</option>
                        <option value="SHORTS / REELS">SHORTS / REELS</option>
                        <option value="TOWN HALLS">TOWN HALLS</option>
                        <option value="YOUTH SUMMITS">YOUTH SUMMITS</option>
                        <option value="SPEECHES">SPEECHES</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Event Date */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        Event Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={videoDate}
                        onChange={(e) => setVideoDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* YouTube URL */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-red-400" />
                        YouTube URL <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Description Snippet */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      Summary / Snippet
                    </label>
                    <textarea
                      value={videoSnippet}
                      onChange={(e) => setVideoSnippet(e.target.value)}
                      rows={3}
                      placeholder="Provide a brief snippet summarizing key highlights of the video..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Save Video Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingVideo}
                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-green-900/40 flex items-center gap-2 transition-all cursor-pointer text-sm disabled:opacity-50"
                    >
                      {isSubmittingVideo ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Video...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Save Video</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Video Items Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-green-400" />
                    <span>Existing Video Library Items ({videoItems.length})</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 tracking-wider">
                        <th className="pb-3 font-bold">Category</th>
                        <th className="pb-3 font-bold">Event title</th>
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold">Link</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {videoItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 pr-4">
                            <span className="bg-green-500/10 text-green-400 font-bold px-2.5 py-1 rounded-md border border-green-500/20 text-[10px]">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-4 pr-4">
                            <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                            <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{item.snippet}</p>
                          </td>
                          <td className="py-4 pr-4 text-slate-300 font-medium whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="py-4 pr-4">
                            <a
                              href={item.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 hover:underline"
                            >
                              <span>YouTube</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => handleDeleteVideo(item.id)}
                              className="p-2 text-red-400 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Video"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: MANAGE UPCOMING EVENTS */}
          {activeTab === 'upcoming' && (
            <div className="space-y-8">
              
              {/* Form Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {editingUpcomingId ? 'Edit Upcoming Event' : 'Add New Upcoming Event'}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Schedule upcoming party rallies & mobilization sessions for the horizontal text row layout.
                      </p>
                    </div>
                  </div>

                  {editingUpcomingId && (
                    <button
                      type="button"
                      onClick={resetUpcomingForm}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveUpcomingEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Event Title */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-green-400" />
                        Event Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={upcomingTitle}
                        onChange={(e) => setUpcomingTitle(e.target.value)}
                        placeholder="e.g. Uasin Gishu Youth Mobilization Drive"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    {/* 2. Event Date */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        Event Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={upcomingDate}
                        onChange={(e) => setUpcomingDate(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 3. Location */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        Location (e.g. Venue)
                      </label>
                      <input
                        type="text"
                        value={upcomingLocation}
                        onChange={(e) => setUpcomingLocation(e.target.value)}
                        placeholder="e.g. Moi University Annex"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* 4. County */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-400" />
                        County
                      </label>
                      <input
                        type="text"
                        value={upcomingCounty}
                        onChange={(e) => setUpcomingCounty(e.target.value)}
                        placeholder="e.g. Uasin Gishu"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    {/* 5. Category (Dropdown) */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-emerald-400" />
                        Category
                      </label>
                      <select
                        value={upcomingCategory}
                        onChange={(e) => setUpcomingCategory(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold"
                      >
                        <option value="MOBILIZATION RALLY">MOBILIZATION RALLY</option>
                        <option value="YOUTH FORUM">YOUTH FORUM</option>
                        <option value="POLICY DIALOGUE">POLICY DIALOGUE</option>
                        <option value="TOWN HALL">TOWN HALL</option>
                        <option value="CHURCH SERVICES">CHURCH SERVICES</option>
                        <option value="Open to public">Open to public</option>
                      </select>
                    </div>
                  </div>

                  {/* 6. Description / Summary */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-green-400" />
                      Description / Summary <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={upcomingDescription}
                      onChange={(e) => setUpcomingDescription(e.target.value)}
                      rows={4}
                      placeholder="Enter details for this upcoming event..."
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {editingUpcomingId && (
                      <button
                        type="button"
                        onClick={resetUpcomingForm}
                        className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmittingUpcoming}
                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-green-900/40 flex items-center gap-2 transition-all cursor-pointer text-sm disabled:opacity-50"
                    >
                      {isSubmittingUpcoming ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Event...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{editingUpcomingId ? 'Update Upcoming Event' : 'Save Upcoming Event'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Published Upcoming Events Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span>Upcoming Events ({photoItems.filter((i) => i.timing === 'upcoming').length})</span>
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 tracking-wider">
                        <th className="pb-3 font-bold">Event title</th>
                        <th className="pb-3 font-bold">Location</th>
                        <th className="pb-3 font-bold">Category</th>
                        <th className="pb-3 font-bold">Date</th>
                        <th className="pb-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {photoItems.filter((i) => i.timing === 'upcoming').length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-500 text-sm font-medium">
                            No upcoming events published yet.
                          </td>
                        </tr>
                      ) : (
                        photoItems
                          .filter((item) => item.timing === 'upcoming')
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                              <td className="py-4 pr-4">
                                <p className="font-bold text-white text-sm line-clamp-1">{item.title}</p>
                                <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">{item.description}</p>
                              </td>
                              <td className="py-4 pr-4">
                                <div className="flex items-center gap-1 text-slate-300 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                  <span>{item.location || 'Kenya'}{item.county ? `, ${item.county}` : ''}</span>
                                </div>
                              </td>
                              <td className="py-4 pr-4">
                                <span className="bg-green-500/10 text-green-400 font-bold px-2.5 py-1 rounded-md border border-green-500/20 text-[10px]">
                                  {item.category || 'Open to public'}
                                </span>
                              </td>
                              <td className="py-4 pr-4 text-slate-300 font-bold whitespace-nowrap">
                                {item.date}
                              </td>
                              <td className="py-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleEditUpcoming(item)}
                                    className="p-2 text-blue-400 hover:text-white hover:bg-blue-900/50 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Upcoming Event"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-red-400 hover:text-white hover:bg-red-900/50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Upcoming Event"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
