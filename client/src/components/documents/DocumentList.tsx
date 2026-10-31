import React, { useState } from 'react';
import { FileText, Presentation, Download, Trash2, Calendar, HardDrive, Search, Loader2 } from 'lucide-react';
import { GeneratedDocument, TemplateType } from '../../types/template.types.ts';
import { EmptyState } from '../common/EmptyState.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

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
  const { t } = useLanguage();
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
    if (!window.confirm(t.myFiles.confirmDelete.replace('{title}', item.title))) {
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Type Filter Pills */}
        <div className="flex items-center space-x-2">
          {(['ALL', 'DOCUMENT', 'PRESENTATION'] as const).map((tType) => (
            <button
              key={tType}
              onClick={() => setFilterType(tType)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === tType
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tType === 'ALL'
                ? t.myFiles.filterAll
                : tType === 'DOCUMENT'
                ? t.myFiles.filterDocx
                : t.myFiles.filterPptx}
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
            placeholder={t.home.searchFilesPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={t.myFiles.emptyTitle}
          description={t.myFiles.emptyDesc}
          onReset={onNavigateToTemplates}
          actionLabel={t.myFiles.browseCatalogBtn}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredItems.map((item) => {
            const isDoc = item.type === 'DOCUMENT';
            const sizeKb = (item.fileSize / 1024).toFixed(1);
            const formattedDate = new Date(item.createdAt).toLocaleString();
            const isDownloading = downloadingId === item.id;
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isDoc ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {isDoc ? <FileText className="w-5 h-5" /> : <Presentation className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDoc ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {isDoc ? 'DOCX' : 'PPTX'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                      {item.template && (
                        <span>
                          {t.myFiles.templateSource}{' '}
                          <span className="font-semibold text-slate-700">{item.template.name}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sizeKb} KB</span>
                      </span>
                    </div>

                    {(item.metadata as { notes?: string })?.notes && (
                      <p className="mt-1.5 text-xs text-slate-600 italic bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 line-clamp-1">
                        "{ (item.metadata as { notes?: string }).notes }"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading || isDeleting}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>{isDownloading ? t.myFiles.downloadingBtn : t.myFiles.downloadBtn}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item)}
                    disabled={isDownloading || isDeleting}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
                    title={t.myFiles.deleteBtn}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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
