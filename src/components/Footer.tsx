import React, { useState } from 'react';
import { Shield, Mail, Phone, MapPin, Send, CheckCircle2, ArrowUpRight, Twitter, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  onOpenCountyModal: () => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCountyModal,
  onOpenRegister
}) => {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscribeEmail.trim()) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
      setSubscribeEmail('');
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-black text-white px-6 sm:px-12 py-10 flex flex-col gap-8 border-t border-slate-900 relative">
      
      {/* Flag stripe top accent */}
      <div className="flex w-full h-1 absolute top-0 left-0">
        <div className="w-1/4 bg-black"></div>
        <div className="w-1/4 bg-red-600"></div>
        <div className="w-1/4 bg-white"></div>
        <div className="w-1/4 bg-[#00843D]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
        <div className="space-y-3">
          <div className="text-xl font-black tracking-tighter uppercase">
            DCP | <span className="text-[#00843D]">SKIZA WAKENYA</span>
          </div>
          <p className="text-xs leading-relaxed opacity-70">
            A citizen-centred political party committed to listening, justice, accountability, and inclusive national development across Kenya.
          </p>
          <p className="text-xs opacity-50 font-mono">Musa Gitau Road, Nairobi | info@dcp.or.ke | +254 700 123 456</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Quick Links</span>
            <button onClick={() => scrollTo('registration')} className="text-xs text-left opacity-70 hover:opacity-100 cursor-pointer">Membership</button>
            <button onClick={() => scrollTo('hero')} className="text-xs text-left opacity-70 hover:opacity-100 cursor-pointer">About DCP</button>
            <button onClick={onOpenCountyModal} className="text-xs text-left opacity-70 hover:opacity-100 cursor-pointer">County Offices</button>
            <button onClick={() => scrollTo('rally')} className="text-xs text-left opacity-70 hover:opacity-100 cursor-pointer">Events & Rallies</button>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Legal & Governance</span>
            <span className="text-xs opacity-70">Privacy Policy</span>
            <span className="text-xs opacity-70">Membership Terms</span>
            <span className="text-xs opacity-70">Party Constitution</span>
            <span className="text-xs opacity-70">Accessibility</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black mb-3 block uppercase tracking-widest text-slate-300">Stay Updated</span>
          <form onSubmit={handleSubscribe} className="flex gap-0 mb-4">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              required
              className="bg-white/10 border-none p-2.5 text-xs flex-1 rounded-l text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Email address..."
            />
            <button type="submit" className="bg-[#00843D] hover:bg-[#006f33] px-4 py-2.5 text-xs font-black rounded-r uppercase tracking-wider text-white cursor-pointer">
              Join
            </button>
          </form>
          {isSubscribed && (
            <p className="text-[11px] text-emerald-400 mb-4 font-bold">Subscribed successfully!</p>
          )}

          <div className="pt-2">
            <span className="text-[10px] font-black mb-2.5 block uppercase tracking-widest text-slate-300">Connect With Us</span>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00843D] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00843D] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#00843D] flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-sm"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-white/10 text-slate-400 gap-2">
        <span className="text-[10px] uppercase tracking-widest font-bold">© 2026 Democracy for the Citizens Party. All rights reserved.</span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Reg: Feb 3, 2025 · Certificate No 103</span>
      </div>
    </footer>
  );
};
