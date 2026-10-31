import React from 'react';
import { Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
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
                {t.nav.tag}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">{t.common.appSubtitle}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setLanguage('vi')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              language === 'vi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Chuyển sang Tiếng Việt"
          >
            <span className="text-sm">🇻🇳</span>
            <span>Tiếng Việt</span>
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              language === 'en'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Switch to English"
          >
            <span className="text-sm">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      </div>
    </header>
  );
};
