import React, { useState } from 'react';
import { X, Presentation, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { Template, SlideItem } from '../../types/template.types.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface PptxPreviewModalProps {
  template: Template | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export const PptxPreviewModal: React.FC<PptxPreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}) => {
  const { t, translateCategory } = useLanguage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  if (!isOpen || !template) return null;

  const slides: SlideItem[] = (template.previewData as { slides?: SlideItem[] })?.slides || [];
  const currentSlide = slides[currentSlideIndex] || {
    slideNumber: 1,
    title: template.name,
    subtitle: template.description,
    bullets: ['Standard OpenXML 16:9 Presentation Deck'],
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-base">{template.name}</h3>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  {t.pptxModal.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t.pptxModal.slidesCount.replace('{count}', String(slides.length))} • {t.pptxModal.widescreen} • {t.docxModal.category}: {translateCategory(template.category)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUseTemplate(template)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.pptxModal.clonePresentation}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Stage */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex flex-col items-center justify-center">
          {/* 16:9 Slide Canvas */}
          <div className="relative w-full max-w-2xl aspect-[16/9] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 sm:p-10 text-white shadow-2xl flex flex-col justify-between border border-slate-700">
            {/* Slide Header & Pill */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {t.pptxModal.slideIndicator
                      .replace('{current}', String(currentSlideIndex + 1))
                      .replace('{total}', String(slides.length || 1))}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{t.pptxModal.openxmlNotice}</span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Bullets Breakdown */}
            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <ul className="space-y-2 mt-4">
                {currentSlide.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Bottom Footer Accent */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate max-w-[280px]">{template.name}</span>
              <span>Slide {currentSlide.slideNumber}</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t.pptxModal.prevSlide}</span>
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center space-x-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlideIndex === i
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <span>{t.pptxModal.nextSlide}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Outline Breakdown Tab */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.pptxModal.slideBreakdown}
            </h4>
            <span className="text-xs text-slate-400">
              {slides.length} {t.common.slides.toLowerCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-32 overflow-y-auto pr-1">
            {slides.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  currentSlideIndex === idx
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 truncate">
                    #{s.slideNumber}: {s.title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {s.subtitle || s.bullets?.[0] || t.pptxModal.noBullets}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5 text-emerald-700 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.pptxModal.footerGuarantee}</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-medium border border-slate-200"
          >
            {t.docxModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
