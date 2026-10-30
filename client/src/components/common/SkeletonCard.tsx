import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm animate-pulse">
      {/* Thumbnail placeholder */}
      <div className="h-44 bg-slate-200 w-full" />
      {/* Content placeholder */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-200 rounded w-16" />
        </div>
        <div className="h-6 bg-slate-200 rounded w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-5/6" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-9 bg-slate-200 rounded-lg w-24" />
          <div className="h-9 bg-slate-200 rounded-lg w-28" />
        </div>
      </div>
    </div>
  );
};
