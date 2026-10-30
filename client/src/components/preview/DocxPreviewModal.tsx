import React from 'react';
import { X, FileText, Plus, Check } from 'lucide-react';
import { Template } from '../../types/template.types.ts';

interface DocxPreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export const DocxPreviewModal: React.FC<DocxPreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}) => {
  if (!isOpen || !template) return null;

  const previewHtml = (template.previewData as { html?: string })?.html || '';
  const sizeKb = (template.fileSize / 1024).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">{template.name}</h3>
                <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
                  DOCX Preview
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Category: <span className="font-semibold text-slate-700">{template.category}</span> • Size: {sizeKb} KB
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUseTemplate(template)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Use This Template</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content Paper */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100 flex justify-center">
          <div className="document-paper w-full max-w-2xl bg-white p-8 sm:p-12 rounded-lg border border-slate-200 shadow-sm text-slate-800">
            {previewHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: previewHtml }}
                className="prose prose-slate max-w-none text-sm leading-relaxed"
              />
            ) : (
              <div className="text-center py-16 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Generating document outline...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1 text-emerald-600 font-medium">
            <Check className="w-4 h-4" />
            <span>Preserved OpenXML DOCX standard. Compatible with Microsoft Word & LibreOffice.</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
