import { apiClient } from './api.ts';
import { HealthCheckData, ApiResponse } from '../types/template.types.ts';

export const healthService = {
  async getHealth(): Promise<HealthCheckData> {
    const res = await apiClient.get<ApiResponse<HealthCheckData>>('/health');
    return res.data.data;
  },
};
