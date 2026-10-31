import React, { useState, useEffect } from 'react';
import { X, Copy, Loader2, Sparkles, FileText, Presentation } from 'lucide-react';
import { Template } from '../../types/template.types.ts';
import { documentService } from '../../services/document.service.ts';
import { presentationService } from '../../services/presentation.service.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

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
  const { t } = useLanguage();
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
      onError((err as Error).message || t.toasts.createErrorTitle);
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
                {isDoc ? t.createModal.createDocTitle : t.createModal.createPresTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.createModal.fromTemplate} <span className="font-semibold text-slate-700">{template.name}</span>
              </p>
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
              {t.createModal.titleLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.createModal.titlePlaceholder}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {t.createModal.notesLabel}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.createModal.notesPlaceholder}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800"
            />
          </div>

          {/* Download Toggle Option */}
          <div className="flex items-center space-x-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <input
              type="checkbox"
              id="autoDownload"
              checked={autoDownload}
              onChange={(e) => setAutoDownload(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
            />
            <label htmlFor="autoDownload" className="text-xs text-slate-700 font-medium cursor-pointer">
              {t.createModal.autoDownloadLabel}
            </label>
          </div>

          {/* Immutability Guarantee Note */}
          <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-brand-50/60 border border-brand-100 text-[11px] text-brand-900 leading-relaxed">
            <Copy className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">{t.createModal.immutabilityNoteTitle}: </span>
              {t.createModal.immutabilityNoteDesc}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {t.createModal.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm shadow-brand-500/20 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.createModal.creating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{isDoc ? t.createModal.createDocBtn : t.createModal.createPresBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
