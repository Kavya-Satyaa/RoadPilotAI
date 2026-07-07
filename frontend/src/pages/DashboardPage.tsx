import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.error('Logout request failed', e);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      {/* Premium subtle backgrounds */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] rounded-full bg-accent-indigo/5 blur-[120px] pointer-events-none" />

      {/* Sleek Navigation Bar */}
      <nav className="glass-panel border-b border-white/5 py-4 px-6 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 shadow-glow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RoadPilot AI</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold uppercase text-sm">
              {user?.username.substring(0, 2)}
            </div>
            <span className="text-sm font-medium text-slate-300 hidden md:inline">{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300 text-sm font-semibold rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 z-10 animate-fade-in">
        {/* Welcome header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Welcome back, {user?.username}!</h2>
          <p className="text-slate-400 mt-2">Milestone 1 foundation is running end to end.</p>
        </div>

        {/* Milestone status cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: JWT Auth */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass relative">
            <div className="flex items-center justify-between mb-4">
              <span className="p-3 rounded-xl bg-brand-500/10 text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">Active</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Secure JWT Session</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your session is authenticated via JWT access token and refresh token rotation.
            </p>
          </div>

          {/* Card 2: Spring Boot Backend */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <span className="p-3 rounded-xl bg-brand-500/10 text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">Active</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Spring Boot API</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              REST Controller architecture backed by Spring Security stateless filters.
            </p>
          </div>

          {/* Card 3: Database schema */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <span className="p-3 rounded-xl bg-brand-500/10 text-brand-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0v3.75m-16.5-3.75v3.75" />
                </svg>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">Validated</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Flyway Schema</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              JPA schemas automatically versioned and validated via Flyway DB migrations.
            </p>
          </div>
        </div>

        {/* Milestone 2 preview */}
        <div className="glass-panel p-8 rounded-2xl border border-brand-500/10 shadow-glass relative flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[200%] bg-radial-gradient from-brand-500/5 to-transparent pointer-events-none" />
          <div className="flex-1 relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Up Next: Milestone 2 (Core Product)</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              We'll be adding the trip creation dashboard, integrating Leaflet interactive map overlays, calling the OSRM endpoint for fast routing polyline generation, and showing local weather forecasts from Open-Meteo.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <button
              onClick={() => alert('Starting Milestone 2 compilation is next!')}
              className="px-6 py-3 bg-brand-500 hover:bg-brand-600 hover:shadow-brand-500/20 text-slate-950 font-bold rounded-xl shadow-glow transition-all"
            >
              Configure Milestone 2
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
