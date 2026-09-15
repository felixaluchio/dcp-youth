import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Filter, 
  MapPin, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2, 
  RefreshCw, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './AdminDashboard';

export interface RegisteredMemberItem {
  id: string;
  memberId: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  county: string;
  constituency?: string;
  ward?: string;
  occupation?: string;
  membershipType?: string;
  joinDate: string;
  rawCreatedAt?: any;
}

// 5 Realistic Mock Kenyan Users for Design Preview & Layout Verification
export const MOCK_KENYAN_MEMBERS: RegisteredMemberItem[] = [
  {
    id: 'mock-1',
    memberId: 'DCP-KEN-849201',
    fullName: 'Kamau Wa Mbiu',
    mobileNumber: '0712 345 678',
    email: 'kamau.mbiu@gmail.com',
    county: 'Nyeri',
    constituency: 'Tetu',
    ward: 'Dedan Kimathi',
    occupation: 'Agribusiness Entrepreneur',
    membershipType: 'Free Citizen Member',
    joinDate: '12 Sep 2026',
  },
  {
    id: 'mock-2',
    memberId: 'DCP-KEN-938214',
    fullName: 'Grace Njengo',
    mobileNumber: '0722 890 123',
    email: 'grace.njengo@yahoo.com',
    county: 'Nairobi',
    constituency: 'Westlands',
    ward: 'Parklands/Highridge',
    occupation: 'Youth League Legal Advisor',
    membershipType: 'Free Citizen Member',
    joinDate: '14 Sep 2026',
  },
  {
    id: 'mock-3',
    memberId: 'DCP-KEN-512093',
    fullName: 'James Wa Hawker',
    mobileNumber: '0733 456 789',
    email: 'james.hawker@gmail.com',
    county: 'Nakuru',
    constituency: 'Nakuru Town East',
    ward: 'Biashara',
    occupation: 'SME / Informal Sector Leader',
    membershipType: 'Free Citizen Member',
    joinDate: '11 Sep 2026',
  },
  {
    id: 'mock-4',
    memberId: 'DCP-KEN-774910',
    fullName: 'Wanjiku Thiga',
    mobileNumber: '0701 234 567',
    email: 'wanjiku.thiga@outlook.com',
    county: 'Kiambu',
    constituency: 'Ruiru',
    ward: 'Githurai',
    occupation: 'Community Organizer',
    membershipType: 'Free Citizen Member',
    joinDate: '09 Sep 2026',
  },
  {
    id: 'mock-5',
    memberId: 'DCP-KEN-628405',
    fullName: 'Parsed Lekakeny',
    mobileNumber: '0715 678 901',
    email: 'lekakeny.p@gmail.com',
    county: 'Kajiado',
    constituency: 'Kajiado Central',
    ward: 'Dalalekutuk',
    occupation: 'Youth Pastoralist Delegate',
    membershipType: 'Free Citizen Member',
    joinDate: '05 Sep 2026',
  },
];

const POPULAR_COUNTIES = [
  'All Counties',
  'Nairobi',
  'Nyeri',
  'Nakuru',
  'Kiambu',
  'Mombasa',
  'Kisumu',
  'Uasin Gishu',
  'Machakos',
  'Meru',
  'Kajiado',
  'Murang\'a',
  'Kirinyaga',
  'Kilifi',
  'Kakamega'
];

export const RegisteredMembers: React.FC = () => {
  const [members, setMembers] = useState<RegisteredMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('All Counties');
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Fetch registered members from Firestore with fallback to Mock data for design preview
  const fetchMembers = async (showLoadingState = true) => {
    if (showLoadingState) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setErrorNotice(null);

    try {
      const membersRef = collection(db, 'members');
      const querySnapshot = await getDocs(membersRef);

      if (!querySnapshot.empty) {
        const fetchedList: RegisteredMemberItem[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          
          // Format join date nicely
          let formattedDate = 'Recently';
          if (data.registeredAt?.toDate) {
            formattedDate = data.registeredAt.toDate().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          } else if (data.registeredAt && typeof data.registeredAt === 'string') {
            formattedDate = new Date(data.registeredAt).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          } else if (data.paymentTimestamp) {
            formattedDate = new Date(data.paymentTimestamp).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });
          }

          return {
            id: docSnap.id,
            memberId: data.memberId || `DCP-${docSnap.id.substring(0, 8).toUpperCase()}`,
            fullName: data.fullName || 'Citizen Member',
            mobileNumber: data.mobileNumber || data.phone || 'N/A',
            email: data.email || 'N/A',
            county: data.county || 'Unspecified',
            constituency: data.constituency || '',
            ward: data.ward || '',
            occupation: data.occupation || 'Member',
            membershipType: data.membershipType || 'Free Citizen Member',
            joinDate: formattedDate,
            rawCreatedAt: data.registeredAt || data.paymentTimestamp,
          };
        });

        setMembers(fetchedList);
      } else {
        // If collection is empty in Firestore, load realistic mock members so the layout is immediately viewable
        setMembers(MOCK_KENYAN_MEMBERS);
      }
    } catch (err: any) {
      console.warn("Firestore fetch notice (using mock Kenyan dataset for layout preview):", err);
      setErrorNotice("Note: Displaying preview dataset (Firestore empty or offline).");
      setMembers(MOCK_KENYAN_MEMBERS);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMembers(true);
  }, []);

  // Filter members by search input and county/chapter
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        member.fullName.toLowerCase().includes(q) ||
        member.memberId.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.mobileNumber.toLowerCase().includes(q);

      const matchesCounty = 
        selectedCounty === 'All Counties' ||
        member.county.toLowerCase() === selectedCounty.toLowerCase();

      return matchesSearch && matchesCounty;
    });
  }, [members, searchQuery, selectedCounty]);

  // Export current members to CSV
  const handleExportCSV = () => {
    if (filteredMembers.length === 0) return;

    const headers = ['Member ID', 'Full Name', 'Phone', 'Email', 'County', 'Constituency', 'Ward', 'Occupation', 'Join Date'];
    const rows = filteredMembers.map((m) => [
      `"${m.memberId}"`,
      `"${m.fullName.replace(/"/g, '""')}"`,
      `"${m.mobileNumber}"`,
      `"${m.email}"`,
      `"${m.county}"`,
      `"${m.constituency || ''}"`,
      `"${m.ward || ''}"`,
      `"${m.occupation || ''}"`,
      `"${m.joinDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DCP_Youth_League_Registered_Members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header with Title, Count Badge, and Export to CSV Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Registered Members
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-green-500/20 text-green-400 border border-green-500/30">
                {isLoading ? '...' : `${members.length} Total`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              DCP Youth League & Citizen grassroots membership registry across all 47 counties.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => fetchMembers(false)}
            disabled={isRefreshing || isLoading}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Member List"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-green-400' : ''}`} />
          </button>

          <button
            id="btn-export-members-csv"
            onClick={handleExportCSV}
            disabled={isLoading || filteredMembers.length === 0}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-700 hover:bg-green-600 active:scale-98 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-green-900/30 transition-all cursor-pointer border-b-2 border-green-900 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
            <span className="hidden md:inline-block text-[10px] bg-green-900/60 px-2 py-0.5 rounded uppercase font-mono">
              Excel / Sheets
            </span>
          </button>
        </div>
      </div>

      {errorNotice && (
        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => fetchMembers(true)}
            className="text-green-400 hover:underline font-bold text-[11px]"
          >
            Retry Firestore
          </button>
        </div>
      )}

      {/* 2. Search & Filters Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        
        {/* Search Input */}
        <div className="md:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by full name, Member ID, phone or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* County/Chapter Dropdown Filter */}
        <div className="md:col-span-4 relative">
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer appearance-none"
            >
              {POPULAR_COUNTIES.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c === 'All Counties' ? 'County / Chapter: All' : `County: ${c}`}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

      </div>

      {/* 3. Data Table with Loading Skeleton State & Empty Handling */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Table summary bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredMembers.length}</strong> members</span>
            {selectedCounty !== 'All Counties' && (
              <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 text-[10px] font-bold">
                {selectedCounty}
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                Matching "{searchQuery}"
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline-block">
            Auto-synced with DCP Portal
          </span>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3">Member ID</th>
                <th scope="col" className="py-4 px-4">Full Name</th>
                <th scope="col" className="py-4 px-4">Email / Phone</th>
                <th scope="col" className="py-4 px-4">County / Ward</th>
                <th scope="col" className="py-4 px-4">Join Date</th>
                <th scope="col" className="py-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-800/60">
              {/* LOADING SKELETON STATE */}
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skeleton-${idx}`} className="animate-pulse bg-slate-900/20">
                    <td className="py-4 pl-6 pr-3">
                      <div className="h-4 w-24 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-36 bg-slate-800 rounded mb-1.5"></div>
                      <div className="h-3 w-20 bg-slate-800/60 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-32 bg-slate-800 rounded mb-1.5"></div>
                      <div className="h-3 w-24 bg-slate-800/60 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-slate-800 rounded mb-1.5"></div>
                      <div className="h-3 w-16 bg-slate-800/60 rounded"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-slate-800 rounded"></div>
                    </td>
                    <td className="py-4 pr-6 text-right">
                      <div className="h-5 w-16 bg-slate-800 rounded-full ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    <UserCheck className="w-10 h-10 mx-auto mb-3 text-slate-600 opacity-60" />
                    <p className="text-base font-bold text-slate-300">No registered members found</p>
                    <p className="text-xs mt-1">Try adjusting your search query or county filter.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCounty('All Counties');
                      }}
                      className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-green-400 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-slate-900/50 transition-colors group"
                  >
                    {/* Member ID */}
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                        {member.memberId}
                      </span>
                    </td>

                    {/* Full Name */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold text-white group-hover:text-green-300 transition-colors">
                        {member.fullName}
                      </div>
                      {member.occupation && (
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {member.occupation}
                        </div>
                      )}
                    </td>

                    {/* Email / Phone */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-200">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-mono">{member.mobileNumber}</span>
                      </div>
                    </td>

                    {/* County / Ward */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                        <MapPin className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span>{member.county}</span>
                      </div>
                      {(member.constituency || member.ward) && (
                        <div className="text-[11px] text-slate-400 mt-0.5 pl-5">
                          {[member.constituency, member.ward].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </td>

                    {/* Join Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{member.joinDate}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with summary note */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>Live membership status governed under Chapter 6 & Political Parties Act</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Showing {filteredMembers.length} of {members.length} records
          </div>
        </div>

      </div>

    </div>
  );
};

export default RegisteredMembers;
