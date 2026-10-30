import { apiClient } from './api.ts';
import { GeneratedDocument, ApiResponse } from '../types/template.types.ts';

export const documentService = {
  async createFromTemplate(
    templateId: string,
    title?: string,
    metadata?: Record<string, unknown>
  ): Promise<GeneratedDocument> {
    const res = await apiClient.post<ApiResponse<GeneratedDocument>>(
      `/documents/from-template/${templateId}`,
      { title, metadata }
    );
    return res.data.data;
  },

  async getDocuments(page = 1, limit = 20, search?: string): Promise<ApiResponse<GeneratedDocument[]>> {
    const res = await apiClient.get<ApiResponse<GeneratedDocument[]>>('/documents', {
      params: { page, limit, search },
    });
    return res.data;
  },

  async getDocumentById(id: string): Promise<GeneratedDocument> {
    const res = await apiClient.get<ApiResponse<GeneratedDocument>>(`/documents/${id}`);
    return res.data.data;
  },

  async updateDocument(id: string, title?: string, metadata?: Record<string, unknown>): Promise<GeneratedDocument> {
    const res = await apiClient.patch<ApiResponse<GeneratedDocument>>(`/documents/${id}`, {
      title,
      metadata,
    });
    return res.data.data;
  },

  async downloadDocument(id: string, filenameFallback = 'document.docx'): Promise<void> {
    const res = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extract filename from Content-Disposition if present
    const disposition = res.headers['content-disposition'];
    let filename = filenameFallback;
    if (disposition && disposition.indexOf('filename=') !== -1) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  async deleteDocument(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },
};
