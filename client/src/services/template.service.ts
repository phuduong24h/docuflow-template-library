import { apiClient } from './api.ts';
import { Template, TemplateType, ApiResponse } from '../types/template.types.ts';

export interface TemplateQueryParams {
  type?: TemplateType;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const templateService = {
  async getTemplates(params: TemplateQueryParams = {}): Promise<ApiResponse<Template[]>> {
    const res = await apiClient.get<ApiResponse<Template[]>>('/templates', { params });
    return res.data;
  },

  async getTemplateById(id: string): Promise<Template> {
    const res = await apiClient.get<ApiResponse<Template>>(`/templates/${id}`);
    return res.data.data;
  },

  async getTemplatePreview(id: string): Promise<Template> {
    const res = await apiClient.get<ApiResponse<Template>>(`/templates/${id}/preview`);
    return res.data.data;
  },

  async getCategories(type?: TemplateType): Promise<string[]> {
    const res = await apiClient.get<ApiResponse<string[]>>('/templates/categories', {
      params: type ? { type } : undefined,
    });
    return res.data.data;
  },
};
