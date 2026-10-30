import { apiClient } from './api.ts';
import { GeneratedDocument, ApiResponse } from '../types/template.types.ts';

export const presentationService = {
  async createFromTemplate(
    templateId: string,
    title?: string,
    metadata?: Record<string, unknown>
  ): Promise<GeneratedDocument> {
    const res = await apiClient.post<ApiResponse<GeneratedDocument>>(
      `/presentations/from-template/${templateId}`,
      { title, metadata }
    );
    return res.data.data;
  },

  async getPresentations(page = 1, limit = 20, search?: string): Promise<ApiResponse<GeneratedDocument[]>> {
    const res = await apiClient.get<ApiResponse<GeneratedDocument[]>>('/presentations', {
      params: { page, limit, search },
    });
    return res.data;
  },

  async getPresentationById(id: string): Promise<GeneratedDocument> {
    const res = await apiClient.get<ApiResponse<GeneratedDocument>>(`/presentations/${id}`);
    return res.data.data;
  },

  async downloadPresentation(id: string, filenameFallback = 'presentation.pptx'): Promise<void> {
    const res = await apiClient.get(`/presentations/${id}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;

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

  async deletePresentation(id: string): Promise<void> {
    await apiClient.delete(`/presentations/${id}`);
  },
};
