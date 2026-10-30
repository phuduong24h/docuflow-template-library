import React, { useState, useEffect } from 'react';
import { X, Copy, Loader2, Sparkles, FileText, Presentation } from 'lucide-react';
import { Template } from '../../types/template.types.ts';
import { documentService } from '../../services/document.service.ts';
import { presentationService } from '../../services/presentation.service.ts';

interface CreateDocumentModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (documentId: string, title: string, type: 'DOCUMENT' | 'PRESENTATION') => void;
  onError: (errorMsg: string) => void;
}

export const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  template,
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [title, setTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [autoDownload, setAutoDownload] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (template) {
      const today = new Date().toISOString().split('T')[0];
      setTitle(`${template.name} - ${today}`);
      setNotes('');
      setAutoDownload(true);
    }
  }, [template]);

  if (!isOpen || !template) return null;

  const isDoc = template.type === 'DOCUMENT';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isDoc) {
        const created = await documentService.createFromTemplate(template.id, title.trim(), {
          notes: notes.trim(),
          sourceTemplate: template.name,
        });

        if (autoDownload) {
          await documentService.downloadDocument(created.id, `${created.title}.docx`);
        }

        onSuccess(created.id, created.title, 'DOCUMENT');
      } else {
        const created = await presentationService.createFromTemplate(template.id, title.trim(), {
          notes: notes.trim(),
          sourceTemplate: template.name,
        });

        if (autoDownload) {
          await presentationService.downloadPresentation(created.id, `${created.title}.pptx`);
        }

        onSuccess(created.id, created.title, 'PRESENTATION');
      }
      onClose();
    } catch (err) {
      onError((err as Error).message || 'Failed to create document from template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDoc ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {isDoc ? <FileText className="w-5 h-5" /> : <Presentation className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {isDoc ? 'Create Document Copy' : 'Create Presentation Copy'}
              </h3>
              <p className="text-xs text-slate-500">From template: {template.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Metadata / Purpose Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add project notes, recipient details, or version memo..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Auto Download Checkbox */}
          <div className="flex items-center space-x-2.5 pt-1">
            <input
              type="checkbox"
              id="autoDownload"
              checked={autoDownload}
              onChange={(e) => setAutoDownload(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <label htmlFor="autoDownload" className="text-xs font-medium text-slate-600 cursor-pointer">
              Automatically download {isDoc ? 'DOCX' : 'PPTX'} file upon creation
            </label>
          </div>

          {/* Security & Immutability Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start space-x-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <p>
              The original template remains completely untouched. An isolated physical file copy will be
              instantiated in storage with unique ID tracking.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className={`inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white rounded-xl shadow-md transition-all ${
                isDoc
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cloning file...</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Create {isDoc ? 'Document' : 'Presentation'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
