import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  onReset,
  actionLabel,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title || t.home.noTemplatesTitle}</h3>
      <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{description || t.home.noTemplatesDesc}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-5 inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{actionLabel || t.home.clearFilters}</span>
        </button>
      )}
    </div>
  );
};
