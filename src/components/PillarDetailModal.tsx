import React from 'react';
import { Pillar } from '../types';
import { X, CheckCircle2, Shield, ArrowRight, Compass } from 'lucide-react';

interface PillarDetailModalProps {
  pillar: Pillar | null;
  onClose: () => void;
  onOpenRegister: () => void;
}

export const PillarDetailModal: React.FC<PillarDetailModalProps> = ({
  pillar,
  onClose,
  onOpenRegister
}) => {
  if (!pillar) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-1.5 kenya-flag-strip" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full uppercase">
            Pillar #{pillar.id} · {pillar.category}
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
          {pillar.title}
        </h3>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-medium">
          {pillar.fullDescription}
        </p>

        {/* Key Targets & Legislative Commitments */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            Key Deliverables & Legislative Commitments
          </h4>

          <div className="space-y-2">
            {pillar.keyGoals.map((goal, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Have ideas for this pillar? Join local county townhalls.
          </p>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-md"
            >
              <span>Support This Pillar (Register)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
