import React, { useState, useEffect } from 'react';
import { Shield, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import dcpLogo from '../assets/images/dcp_official_logo_hd_1786025213182.jpg';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dcp_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const DEFAULT_PASSCODE = 'dcp2027'; // Simple admin passcode for mock auth

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim() === 'admin') {
        localStorage.setItem('dcp_admin_auth', 'true');
        setIsAuthenticated(true);
      } else {
        setError(`Invalid access code. (Hint: Use "${DEFAULT_PASSCODE}" or click Demo Access)`);
      }
      setLoading(false);
    }, 400);
  };

  const handleDemoLogin = () => {
    localStorage.setItem('dcp_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
        {/* Top Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-600 via-amber-500 to-green-700" />

        {/* Header Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8 pt-2">
          <img
            src={dcpLogo}
            alt="DCP Official Logo"
            className="w-20 h-20 object-contain rounded-2xl shadow-md border border-slate-100 p-1 mb-3 bg-white"
          />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase tracking-widest mb-2">
            <Shield className="w-3.5 h-3.5" />
            Youth League Admin
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">Protected Dashboard</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Democracy for Citizens Party · Content Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Admin Access Code
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (e.g. dcp2027)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white text-sm transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-green-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Access */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 mb-3">
            Passcode hint: <code className="bg-slate-100 px-2 py-0.5 rounded text-green-700 font-bold">dcp2027</code>
          </p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-800 hover:underline cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            Quick Demo Auto-Login
          </button>
        </div>

        {/* Back to Public Site */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Return to Main Public Portal
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminProtectedRoute;
