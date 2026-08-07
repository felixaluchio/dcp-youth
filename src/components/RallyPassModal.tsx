import React, { useState } from 'react';
import { X, Ticket, QrCode, Download, CheckCircle2, Sparkles } from 'lucide-react';

interface RallyPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RallyPassModal: React.FC<RallyPassModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [passGenerated, setPassGenerated] = useState(false);
  const [passId, setPassId] = useState('');

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setPassId(`PASS-UHURU-${Math.floor(10000 + Math.random() * 90000)}`);
      setPassGenerated(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden">
        
        {/* Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 kenya-flag-strip" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {!passGenerated ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase">
              <Ticket className="w-4 h-4" />
              <span>Free Admission Ticket</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              Get Uhuru Park Rally Pass
            </h3>

            <p className="text-xs text-slate-600">
              Grand Skiza Wakenya Rally · Saturday, Aug 22, 2026 · 9:00 AM EAT. Generate your personal QR entry ticket instantly.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Juma Kiprono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g., 0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your County</label>
                <input
                  type="text"
                  placeholder="e.g., Nairobi, Machakos, Kiambu"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm shadow-md transition-all mt-4 cursor-pointer"
            >
              Generate Digital Rally Pass
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-slate-900">Your Rally Pass is Ready!</h3>

            {/* Ticket Graphic */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl border border-emerald-500/40 text-left relative overflow-hidden space-y-4 my-2">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Skiza Wakenya Rally Pass</span>
                  <p className="font-extrabold text-sm text-white">Uhuru Park Grounds, Nairobi</p>
                </div>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Attendee</p>
                  <p className="font-bold text-white text-base">{name}</p>
                  <p className="text-xs text-slate-300">{county} County</p>
                  <p className="text-xs font-mono text-emerald-400 mt-1">{passId}</p>
                </div>

                <div className="bg-white p-2 rounded-xl text-slate-900">
                  <QrCode className="w-12 h-12" />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex justify-between">
                <span>Aug 22, 2026 · 9:00 AM</span>
                <span>Gate Priority Access</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert(`Rally Pass downloaded for ${name}`)}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save Pass to Phone</span>
              </button>
              <button
                onClick={() => { setPassGenerated(false); onClose(); }}
                className="py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
