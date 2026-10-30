import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar.tsx';
import { Sidebar, ActiveView } from './components/common/Sidebar.tsx';
import { SearchBar } from './components/common/SearchBar.tsx';
import { CategoryFilter } from './components/common/CategoryFilter.tsx';
import { TemplateGrid } from './components/templates/TemplateGrid.tsx';
import { DocxPreviewModal } from './components/preview/DocxPreviewModal.tsx';
import { PptxPreviewModal } from './components/preview/PptxPreviewModal.tsx';
import { CreateDocumentModal } from './components/dialogs/CreateDocumentModal.tsx';
import { DocumentList } from './components/documents/DocumentList.tsx';
import { EmptyState } from './components/common/EmptyState.tsx';
import { ErrorState } from './components/common/ErrorState.tsx';
import { Toast, ToastMessage } from './components/common/Toast.tsx';
import { useTemplates } from './hooks/useTemplates.ts';
import { useDocuments } from './hooks/useDocuments.ts';
import { Template, TemplateType } from './types/template.types.ts';
import { ChevronLeft, ChevronRight, FileText, Presentation } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('DOCUMENTS');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [createTargetTemplate, setCreateTargetTemplate] = useState<Template | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hook for templates (filtered by activeView type)
  const templateType: TemplateType = activeView === 'PRESENTATIONS' ? 'PRESENTATION' : 'DOCUMENT';
  const {
    templates,
    categories,
    pagination,
    loading,
    error,
    category,
    search,
    page,
    setCategory,
    setSearch,
    setPage,
    setType,
    retry,
  } = useTemplates({ initialType: templateType });

  // Hook for generated documents
  const {
    documents,
    presentations,
    loading: docsLoading,
    refresh: refreshDocs,
    downloadFile,
    deleteFile,
  } = useDocuments();

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSelectView = (view: ActiveView) => {
    setActiveView(view);
    if (view === 'DOCUMENTS') {
      setType('DOCUMENT');
    } else if (view === 'PRESENTATIONS') {
      setType('PRESENTATION');
    } else if (view === 'MY_FILES') {
      refreshDocs();
    }
  };

  const handleOpenPreview = (tpl: Template) => {
    setPreviewTemplate(tpl);
  };

  const handleOpenUseTemplate = (tpl: Template) => {
    setPreviewTemplate(null);
    setCreateTargetTemplate(tpl);
  };

  const handleCreateSuccess = (_documentId: string, title: string, _type: TemplateType) => {
    addToast(
      'success',
      'Document created successfully!',
      `"${title}" was instantiated from template and is ready.`
    );
    refreshDocs();
  };

  const handleCreateError = (errorMsg: string) => {
    addToast('error', 'Failed to generate document', errorMsg);
  };

  const totalMyFiles = documents.length + presentations.length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={handleSelectView}
          documentCount={5}
          presentationCount={3}
          myFilesCount={totalMyFiles}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'MY_FILES' ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  My Generated Documents
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Isolated physical copies created from templates. Download DOCX or PPTX at any time.
                </p>
              </div>

              <DocumentList
                documents={documents}
                presentations={presentations}
                loading={docsLoading}
                onDownload={async (id, type, title) => {
                  try {
                    await downloadFile(id, type, title);
                    addToast('success', 'Download started', `${title}.${type === 'DOCUMENT' ? 'docx' : 'pptx'}`);
                  } catch (err) {
                    addToast('error', 'Download failed', (err as Error).message);
                  }
                }}
                onDelete={async (id, type) => {
                  try {
                    await deleteFile(id, type);
                    addToast('info', 'Document removed', 'Physical file and database entry deleted.');
                  } catch (err) {
                    addToast('error', 'Delete failed', (err as Error).message);
                  }
                }}
                onNavigateToTemplates={() => handleSelectView('DOCUMENTS')}
              />
            </div>
          ) : (
            <div>
              {/* Header Title & Description */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    {activeView === 'DOCUMENTS' ? (
                      <FileText className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Presentation className="w-6 h-6 text-emerald-600" />
                    )}
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {activeView === 'DOCUMENTS'
                        ? 'Document Template Library'
                        : 'Presentation Template Library'}
                    </h1>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {activeView === 'DOCUMENTS'
                      ? 'Select from validated OpenXML DOCX business proposals, contracts, and reports.'
                      : 'Explore multi-slide PowerPoint decks, company profiles, and technical review slides.'}
                  </p>
                </div>

                {/* Search Bar */}
                <SearchBar
                  value={search}
                  onChange={setSearch}
                  placeholder={`Search ${activeView === 'DOCUMENTS' ? 'DOCX' : 'PPTX'} templates...`}
                />
              </div>

              {/* Category Filter Pills */}
              <div className="mb-6">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={category}
                  onSelectCategory={setCategory}
                />
              </div>

              {/* Templates Content State */}
              {error ? (
                <ErrorState message={error} onRetry={retry} />
              ) : !loading && templates.length === 0 ? (
                <EmptyState
                  title="No templates match your search"
                  description="Try resetting your keyword or selecting 'All Categories'."
                  onReset={() => {
                    setSearch('');
                    setCategory('');
                  }}
                />
              ) : (
                <TemplateGrid
                  templates={templates}
                  loading={loading}
                  onPreview={handleOpenPreview}
                  onUseTemplate={handleOpenUseTemplate}
                />
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-xs text-slate-500">
                    Showing page <span className="font-semibold text-slate-800">{pagination.page}</span> of{' '}
                    <span className="font-semibold text-slate-800">{pagination.totalPages}</span> (
                    {pagination.total} templates total)
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!pagination.hasNextPage}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* DOCX Preview Modal */}
      {previewTemplate?.type === 'DOCUMENT' && (
        <DocxPreviewModal
          template={previewTemplate}
          isOpen={true}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={handleOpenUseTemplate}
        />
      )}

      {/* PPTX Preview Modal */}
      {previewTemplate?.type === 'PRESENTATION' && (
        <PptxPreviewModal
          template={previewTemplate}
          isOpen={true}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={handleOpenUseTemplate}
        />
      )}

      {/* Create Document / Presentation Modal */}
      <CreateDocumentModal
        template={createTargetTemplate}
        isOpen={Boolean(createTargetTemplate)}
        onClose={() => setCreateTargetTemplate(null)}
        onSuccess={handleCreateSuccess}
        onError={handleCreateError}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
export default App;
