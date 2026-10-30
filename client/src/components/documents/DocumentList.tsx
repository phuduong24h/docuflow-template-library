import React, { useState } from 'react';
import { FileText, Presentation, Download, Trash2, Calendar, HardDrive, Search, Loader2 } from 'lucide-react';
import { GeneratedDocument, TemplateType } from '../../types/template.types.ts';
import { EmptyState } from '../common/EmptyState.tsx';

interface DocumentListProps {
  documents: GeneratedDocument[];
  presentations: GeneratedDocument[];
  loading?: boolean;
  onDownload: (id: string, type: TemplateType, title: string) => Promise<void>;
  onDelete: (id: string, type: TemplateType) => Promise<void>;
  onNavigateToTemplates: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  presentations,
  onDownload,
  onDelete,
  onNavigateToTemplates,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'DOCUMENT' | 'PRESENTATION'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const allItems = [...documents, ...presentations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredItems = allItems.filter((item) => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.template?.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDownload = async (item: GeneratedDocument) => {
    setDownloadingId(item.id);
    try {
      await onDownload(item.id, item.type, item.title);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (item: GeneratedDocument) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }
    setDeletingId(item.id);
    try {
      await onDelete(item.id, item.type);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Type Filter Pills */}
        <div className="flex items-center space-x-2">
          {(['ALL', 'DOCUMENT', 'PRESENTATION'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === t
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Files' : t === 'DOCUMENT' ? 'DOCX Documents' : 'PPTX Slides'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search generated files..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title="No generated files yet"
          description="You haven't cloned any documents or presentations from templates yet. Browse our library to instantiate files!"
          onReset={onNavigateToTemplates}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => {
            const isDoc = item.type === 'DOCUMENT';
            const sizeKb = (item.fileSize / 1024).toFixed(1);
            const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });
            const isDownloading = downloadingId === item.id;
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isDoc ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {isDoc ? <FileText className="w-5 h-5" /> : <Presentation className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-slate-500">
                          Template: <span className="text-slate-700 font-medium">{item.template?.name || 'Custom'}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDoc ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isDoc ? '.DOCX' : '.PPTX'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span>{sizeKb} KB</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleDelete(item)}
                    disabled={isDeleting}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete document"
                  >
                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white shadow-sm transition-all ${
                      isDoc
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download {isDoc ? 'DOCX' : 'PPTX'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
