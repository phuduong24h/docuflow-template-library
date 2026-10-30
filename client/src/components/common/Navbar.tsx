import React, { useEffect, useState } from 'react';
import { Layers, Activity, Server, Database } from 'lucide-react';
import { healthService } from '../../services/health.service.ts';
import { HealthCheckData } from '../../types/template.types.ts';

export const Navbar: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckData | null>(null);

  useEffect(() => {
    healthService
      .getHealth()
      .then(setHealth)
      .catch((err) => console.error('Health check failed:', err));
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">DocuFlow</span>
              <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-2 py-0.5 rounded-full border border-brand-200">
                v1.0 SaaS
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Enterprise Document & Presentation Template Library</p>
          </div>
        </div>

        {/* System Health Status Indicator */}
        <div className="flex items-center space-x-4">
          {health ? (
            <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 border border-slate-200/60">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="flex items-center space-x-1">
                <Database className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">PostgreSQL:</span>
                <span className="text-emerald-700 font-semibold">{health.services.database}</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center space-x-1">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Storage:</span>
                <span className="text-emerald-700 font-semibold">{health.services.storage}</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>Connecting services...</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
