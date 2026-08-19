import React, { useState, useEffect } from 'react';
import { Users, ArrowRight } from 'lucide-react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from './AdminDashboard';

interface SystemAccessCounterProps {
  onJoinClick?: () => void;
}

export const SystemAccessCounter: React.FC<SystemAccessCounterProps> = ({ onJoinClick }) => {
  const [memberCount, setMemberCount] = useState<number>(0);

  useEffect(() => {
    const fetchMemberCount = async () => {
      console.log("🔍 Attempting to fetch member count...");
      try {
        const coll = collection(db, "members"); 
        const snapshot = await getCountFromServer(coll);
        const realCount = snapshot.data().count;
        console.log("✅ Successfully fetched real count:", realCount);
        
        // Set baseline of 150 + actual database count
        setMemberCount(150 + realCount);
      } catch (error: any) {
        console.error("❌ FIREBASE FETCH ERROR:", error?.message || error);
        setMemberCount(150);
      }
    };
    
    fetchMemberCount();
  }, []);

  const handleJoinClick = () => {
    if (onJoinClick) {
      onJoinClick();
    } else {
      const el = document.getElementById('registration');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-950 text-white rounded-2xl p-6 md:p-8 shadow-2xl border border-green-800/50 max-w-6xl mx-auto my-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Subtle background glow effect */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-green-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 space-y-3 z-10 w-full">
          {/* Live Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-green-400 uppercase">
              LIVE SYSTEM COUNTER • REAL-TIME CITIZEN ACCESS
            </span>
          </div>

          {/* Counter Display & Typography */}
          <div className="flex items-baseline space-x-3">
            <div className="text-4xl sm:text-6xl font-black text-white tracking-tight font-mono">
              {memberCount.toLocaleString()}
            </div>
            <Users className="w-6 h-6 text-green-400 shrink-0 self-center hidden sm:block opacity-80" />
          </div>

          <p className="text-sm md:text-base text-gray-300 font-medium">
            Kenyans across 47 counties have accessed and engaged with the DCP platform.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="shrink-0 w-full md:w-auto z-10 flex justify-center md:justify-end">
          <button
            onClick={handleJoinClick}
            className="w-full sm:w-auto bg-green-500 hover:bg-green-400 text-gray-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Join the Movement</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
