import React from 'react';
import { FileText, Presentation, FolderGit2, Sparkles } from 'lucide-react';

export type ActiveView = 'DOCUMENTS' | 'PRESENTATIONS' | 'MY_FILES';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  documentCount?: number;
  presentationCount?: number;
  myFilesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  documentCount = 5,
  presentationCount = 3,
  myFilesCount = 0,
}) => {
  const navItems = [
    {
      id: 'DOCUMENTS' as ActiveView,
      label: 'Document Templates',
      icon: FileText,
      badge: `${documentCount} DOCX`,
      badgeColor: 'bg-blue-100 text-blue-700',
      description: 'Word proposals, contracts, reports',
    },
    {
      id: 'PRESENTATIONS' as ActiveView,
      label: 'Presentation Templates',
      icon: Presentation,
      badge: `${presentationCount} PPTX`,
      badgeColor: 'bg-emerald-100 text-emerald-700',
      description: 'PowerPoint pitch decks & slides',
    },
    {
      id: 'MY_FILES' as ActiveView,
      label: 'My Generated Documents',
      icon: FolderGit2,
      badge: `${myFilesCount}`,
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Cloned files ready for download',
    },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-r border-slate-200 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Product Catalogs
          </span>
          <nav className="mt-2 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-900 font-semibold shadow-sm border border-brand-200/70'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-brand-600' : 'text-slate-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm truncate">{item.label}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Feature Highlights Card */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 p-3.5 text-white shadow-md">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-brand-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Immutable Templates</span>
          </div>
          <p className="mt-1 text-xs text-slate-300 leading-relaxed">
            All template originals are physically preserved. Every clone generates an isolated OpenXML copy.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 px-2">
        <p>Clean Architecture Monolith</p>
        <p className="text-[10px] text-slate-400 mt-0.5">PostgreSQL • Express • React</p>
      </div>
    </aside>
  );
};
