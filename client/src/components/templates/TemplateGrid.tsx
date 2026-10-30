import React from 'react';
import { Template } from '../../types/template.types.ts';
import { TemplateCard } from './TemplateCard.tsx';
import { SkeletonCard } from '../common/SkeletonCard.tsx';

interface TemplateGridProps {
  templates: Template[];
  loading: boolean;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  loading,
  onPreview,
  onUseTemplate,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onUseTemplate={onUseTemplate}
        />
      ))}
    </div>
  );
};
