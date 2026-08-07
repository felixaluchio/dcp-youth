import React, { useState } from 'react';
import { COUNTY_OFFICES } from '../data/kenyaData';
import { X, MapPin, Phone, Mail, Search, Building, User } from 'lucide-react';

interface CountyOfficesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CountyOfficesModal: React.FC<CountyOfficesModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredOffices = COUNTY_OFFICES.filter(o => 
    o.county.toLowerCase().includes(search.toLowerCase()) ||
    o.town.toLowerCase().includes(search.toLowerCase()) ||
    o.coordinator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 kenya-flag-strip" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-4">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full uppercase">
            Grassroots Secretariat Directory
          </span>
          <h3 className="text-2xl font-black text-slate-900">47 County Offices</h3>
          <p className="text-xs text-slate-500">Find your regional DCP coordinator, secretariat office, and county townhall schedule.</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by County name or Town..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
          />
        </div>

        {/* Directory List */}
        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {filteredOffices.map((office) => (
            <div key={office.county} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    County 0{office.code}
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{office.county} County Secretariat</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {office.town}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Coordinator: <strong>{office.coordinator}</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{office.email}</span>
                </div>
              </div>
            </div>
          ))}

          {filteredOffices.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No county office found matching "{search}".
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
