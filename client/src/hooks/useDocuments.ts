import { useState, useCallback, useEffect } from 'react';
import { GeneratedDocument, TemplateType } from '../types/template.types.ts';
import { documentService } from '../services/document.service.ts';
import { presentationService } from '../services/presentation.service.ts';

export function useDocuments() {
  const [documents, setDocuments] = useState<GeneratedDocument[]>([]);
  const [presentations, setPresentations] = useState<GeneratedDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [docsRes, presRes] = await Promise.all([
        documentService.getDocuments(1, 50),
        presentationService.getPresentations(1, 50),
      ]);
      setDocuments(docsRes.data);
      setPresentations(presRes.data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const downloadFile = async (id: string, type: TemplateType, title: string) => {
    if (type === 'DOCUMENT') {
      await documentService.downloadDocument(id, `${title}.docx`);
    } else {
      await presentationService.downloadPresentation(id, `${title}.pptx`);
    }
  };

  const deleteFile = async (id: string, type: TemplateType) => {
    if (type === 'DOCUMENT') {
      await documentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } else {
      await presentationService.deletePresentation(id);
      setPresentations((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return {
    documents,
    presentations,
    loading,
    error,
    refresh: loadDocuments,
    downloadFile,
    deleteFile,
  };
}
