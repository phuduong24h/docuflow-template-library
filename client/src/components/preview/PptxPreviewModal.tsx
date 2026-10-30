import React, { useState } from 'react';
import { X, Presentation, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { Template, SlideItem } from '../../types/template.types.ts';

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
                  PPTX Slides Deck
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {slides.length} Slides • 16:9 Widescreen • Category: {template.category}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onUseTemplate(template)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Clone Presentation</span>
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
                    Slide {currentSlideIndex + 1} of {slides.length || 1}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">16:9 OpenXML</span>
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

            {/* Bullets List */}
            {currentSlide.bullets && currentSlide.bullets.length > 0 && (
              <div className="my-auto py-2">
                <ul className="space-y-2.5">
                  {currentSlide.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Slide Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{template.name}</span>
              <span className="font-mono text-[11px]">Nova Solutions SaaS</span>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="mt-5 flex items-center space-x-4">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slide dots */}
            <div className="flex items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex ? 'w-8 bg-emerald-500' : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              title="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center space-x-1.5 text-slate-600">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>PowerPoint compatible (.pptx binary clone with complete styling).</span>
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
