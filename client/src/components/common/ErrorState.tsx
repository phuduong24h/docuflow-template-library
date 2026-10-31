import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-md mx-auto my-8">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-rose-900">{t.home.errorTitle}</h3>
      <p className="mt-1 text-xs text-rose-600 leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>{t.home.errorRetry}</span>
      </button>
    </div>
  );
};
