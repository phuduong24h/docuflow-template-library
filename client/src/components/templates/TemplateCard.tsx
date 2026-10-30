import React from 'react';
import { Eye, Plus, FileText, Presentation } from 'lucide-react';
import { Template } from '../../types/template.types.ts';

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onUseTemplate,
}) => {
  const isDoc = template.type === 'DOCUMENT';
  const sizeKb = (template.fileSize / 1024).toFixed(1);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Thumbnail Header */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
          <img
            src={template.thumbnailUrl}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Type Badge */}
          <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm backdrop-blur-md bg-white/90 text-slate-800">
            {isDoc ? (
              <FileText className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Presentation className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{isDoc ? 'DOCX' : 'PPTX'}</span>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/70 text-white backdrop-blur-sm">
            {template.category}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline justify-between">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-1">
              {template.name}
            </h3>
          </div>

          <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {template.description}
          </p>

          <div className="mt-3.5 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Size: {sizeKb} KB</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              Immutable Original
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center space-x-2 mt-2">
        <button
          onClick={() => onPreview(template)}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => onUseTemplate(template)}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-brand-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Use Template</span>
        </button>
      </div>
    </div>
  );
};
