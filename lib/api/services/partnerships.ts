import { apiClient } from "../client"
import type { Partnership } from "@/lib/hooks/usePartnershipsApi"

// Backend API Response Interface
interface BackendPartnershipApiItem {
  id: number
  status: number // API status: 1 for active, 2 for inactive
  is_favorite: boolean
  created_at: string // "Data Início" from API
  updated_at: string // "Atualizado em" from API
  campaign: number | null // Campaign ID
  store: {
    id: number
    store_code: number
    name: string
    partnership_count: number
    flag: string
  }
  osc: {
    id: number
    cnpj: string
    name: string
    partnership_count: number
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface GetPartnershipsParams {
  search?: string
  status?: string
  page?: number
  limit?: number
}

interface CreatePartnershipData {
  storeId: number
  oscId: number
  status?: string
}

interface UpdatePartnershipData {
  status?: string
  storeId?: number
  oscId?: number
}

export class PartnershipsService {
  private readonly endpoint = "/partnership/"

  // Data Transformation Helpers
  private mapStatusNumberToString(statusNum: number): "ativa" | "inativa" | "pendente" {
    switch (statusNum) {
      case 1:
        return "ativa"
      case 2:
        return "inativa"
      case 0:
        return "pendente"
      default:
        return "pendente"
    }
  }

  private mapRawPartnershipToFrontend(raw: BackendPartnershipApiItem): Partnership {
    return {
      id: raw.id,
      osc: raw.osc.name,
      loja: raw.store.name,
      dataInicio: raw.created_at,
      dataVencimento: raw.updated_at,
      status: this.mapStatusNumberToString(raw.status),
      campanhas: raw.campaign || 0,
      storeId: raw.store.id,
      oscId: raw.osc.id,
    }
  }

  async getAll(queryParams?: GetPartnershipsParams): Promise<Partnership[]> {
    try {
      // Filter out undefined/null values from queryParams
      const filteredParams = queryParams
        ? Object.fromEntries(Object.entries(queryParams).filter(([_, value]) => value !== undefined && value !== null))
        : {}

      const apiResponse = await apiClient.get<ApiResponse<BackendPartnershipApiItem[]>>(this.endpoint, filteredParams)

      // Handle ApiResponse wrapper internally
      if (!apiResponse) {
        throw new Error(apiResponse.message || "Failed to fetch partnerships")
      }

      // Transform raw data to frontend DTOs
      return apiResponse.map((raw) => this.mapRawPartnershipToFrontend(raw))
    } catch (error) {
      console.error("Error fetching partnerships:", error)
      throw error
    }
  }

  async create(data: CreatePartnershipData): Promise<Partnership> {
    try {
      const apiResponse = await apiClient.post<ApiResponse<BackendPartnershipApiItem>>(this.endpoint, data as any)

      // Handle ApiResponse wrapper internally
      if (!apiResponse) {
        throw new Error(apiResponse.message || "Failed to create partnership")
      }

      // Transform raw data to frontend DTO
      return this.mapRawPartnershipToFrontend(apiResponse)
    } catch (error) {
      console.error("Error creating partnership:", error)
      throw error
    }
  }

  async update(id: number, data: UpdatePartnershipData): Promise<Partnership> {
    try {
      const apiResponse = await apiClient.put<ApiResponse<BackendPartnershipApiItem>>(
        `${this.endpoint}${id}`,
        data as any,
      )

      // Handle ApiResponse wrapper internally
      if (!apiResponse) {
        throw new Error(apiResponse.message || "Failed to update partnership")
      }

      // Transform raw data to frontend DTO
      return this.mapRawPartnershipToFrontend(apiResponse)
    } catch (error) {
      console.error("Error updating partnership:", error)
      throw error
    }
  }
}

export const partnershipsService = new PartnershipsService()
