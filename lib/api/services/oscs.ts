// Serviços para API de OSCs
import { apiClient, type ApiResponse, type PaginatedResponse } from "@/lib/api/client"
import type { OSC } from "@/lib/api/types"

export class OSCsService {
  private endpoint = "/osc/"

  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    uf?: string
    tipo?: string
    cnpj?: string
  }): Promise<PaginatedResponse<OSC>> {
    console.log(params)
    const queryParams = params
      ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
      : undefined
    console.log(queryParams)
    return apiClient.get<OSC[]>(this.endpoint, queryParams)
  }

  async getById(id: number): Promise<ApiResponse<OSC>> {
    return apiClient.get<OSC>(`${this.endpoint}${id}`)
  }

  async create(data: Omit<OSC, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<OSC>> {
    return apiClient.post<OSC>(this.endpoint, data)
  }

  async update(id: number, data: Partial<OSC>): Promise<ApiResponse<OSC>> {
    return apiClient.put<OSC>(`${this.endpoint}${id}/`, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}${id}/`)
  }

  async validateCNPJ(cnpj: string): Promise<ApiResponse<{ valid: boolean; data?: any }>> {
    return apiClient.post(`${this.endpoint}validate-cnpj/`, { cnpj })
  }
}

export const oscsService = new OSCsService()
