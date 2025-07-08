// Serviços para API de Lojas
import { apiClient, type ApiResponse, type PaginatedResponse } from "@/lib/api/client"
import type { Store, CreateStoreData, UpdateStoreData, StatusChangeData } from "@/lib/api/types"

export class StoresService {
  private endpoint = "/store/"

  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    uf?: string
    bandeira?: string
  }): Promise<PaginatedResponse<Store>> {
    const queryParams = params
      ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
      : undefined

    return apiClient.get<Store[]>(this.endpoint, queryParams)
  }

  async getById(id: number): Promise<ApiResponse<Store>> {
    return apiClient.get<Store>(`${this.endpoint}/${id}`)
  }

  async create(data: CreateStoreData): Promise<ApiResponse<Store>> {
    return apiClient.post<Store>(this.endpoint, data)
  }

  async update(id: number, data: UpdateStoreData): Promise<ApiResponse<Store>> {
    return apiClient.put<Store>(`${this.endpoint}${id}/`, data)
  }

  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.endpoint}${id}/`)
  }

  async changeStatus(data: StatusChangeData): Promise<ApiResponse<Store>> {
    return apiClient.patch<Store>(`${this.endpoint}${data.entityId}/status`, {
      status: data.novoStatus,
      responsavel: data.responsavel,
      descricao: data.descricao,
    })
  }

  async getByRegion(uf: string): Promise<ApiResponse<Store[]>> {
    return apiClient.get<Store[]>(`${this.endpoint}/region/${uf}`)
  }

  async getBandeiras(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>(`${this.endpoint}/bandeiras`)
  }

  async getStats(): Promise<
    ApiResponse<{
      total: number
      ativas: number
      inativas: number
      pendentes: number
      porUF: Record<string, number>
      porBandeira: Record<string, number>
    }>
  > {
    return apiClient.get(`${this.endpoint}/stats`)
  }
}

export const storesService = new StoresService()
