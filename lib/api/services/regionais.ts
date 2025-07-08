// Serviços para API de Regionais
import { apiClient, type ApiResponse, type PaginatedResponse } from "@/lib/api/client"
import type { Regional } from "@/lib/api/types"

export class RegionaisService {
  private endpoint = "/regionais"

  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
  }): Promise<PaginatedResponse<Regional>> {
    const queryParams = params
      ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
      : undefined

    return apiClient.get<Regional[]>(this.endpoint, queryParams)
  }

  async getById(id: number): Promise<ApiResponse<Regional>> {
    return apiClient.get<Regional>(`${this.endpoint}/${id}`)
  }

  async create(data: Omit<Regional, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Regional>> {
    return apiClient.post<Regional>(this.endpoint, data)
  }

  async update(id: number, data: Partial<Regional>): Promise<ApiResponse<Regional>> {
    return apiClient.put<Regional>(`${this.endpoint}/${id}`, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}/${id}`)
  }
}

export const regionaisService = new RegionaisService()
