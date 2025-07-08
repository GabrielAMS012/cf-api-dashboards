import { apiClient } from "@/lib/api/client"

// Backend API response interface - reflects exact structure from API
interface BackendCampaignApiItem {
  id: number
  nome: string
  descricao: string
  data_inicio: string // ISO date string
  data_fim: string // ISO date string
  tipo: string
  status: number // Numeric status from API
  stores: number[] // Array of store IDs
  oscs: number[] // Array of OSC IDs
  created_at: string
  updated_at: string
}

// Frontend DTO interface
export interface Campaign {
  id: number
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
  tipo: string
  status: "Ativo" | "Inativo" | "Finalizado"
  stores: number[]
  oscs: number[]
  createdAt: string
  updatedAt: string
}

export class CampaignsService {
  private endpoint = "/campaign/"

  // Private helper for status mapping
  private mapStatusNumberToString(statusNum: number): "Ativo" | "Inativo" | "Finalizado" {
    switch (statusNum) {
      case 1:
        return "Ativo"
      case 0:
        return "Inativo"
      case 2:
        return "Finalizado"
      default:
        return "Inativo"
    }
  }

  // Private helper for reverse status mapping
  private mapStatusStringToNumber(statusStr: string): number {
    switch (statusStr.toLowerCase()) {
      case "ativo":
        return 1
      case "finalizado":
        return 2
      case "inativo":
        return 0
      default:
        return 0
    }
  }

  // Private helper for transforming raw backend item to frontend Campaign
  private mapRawCampaignToFrontend(raw: BackendCampaignApiItem): Campaign {
    return {
      id: raw.id,
      nome: raw.nome,
      descricao: raw.descricao,
      dataInicio: raw.data_inicio.split("T")[0], // Convert ISO to YYYY-MM-DD
      dataFim: raw.data_fim.split("T")[0], // Convert ISO to YYYY-MM-DD
      tipo: raw.tipo,
      status: this.mapStatusNumberToString(raw.status),
      stores: raw.stores,
      oscs: raw.oscs,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    }
  }

  // Private helper for transforming frontend data to backend format
  private mapFrontendCampaignToBackend(frontendData: Partial<Campaign>): Partial<BackendCampaignApiItem> {
    const backendData: Partial<BackendCampaignApiItem> = {}

    if (frontendData.nome !== undefined) backendData.nome = frontendData.nome
    if (frontendData.descricao !== undefined) backendData.descricao = frontendData.descricao
    if (frontendData.dataInicio !== undefined) backendData.data_inicio = frontendData.dataInicio + "T00:00:00Z"
    if (frontendData.dataFim !== undefined) backendData.data_fim = frontendData.dataFim + "T23:59:59Z"
    if (frontendData.tipo !== undefined) backendData.tipo = frontendData.tipo
    if (frontendData.status !== undefined) backendData.status = this.mapStatusStringToNumber(frontendData.status)
    if (frontendData.stores !== undefined) backendData.stores = frontendData.stores
    if (frontendData.oscs !== undefined) backendData.oscs = frontendData.oscs

    return backendData
  }

  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    tipo?: string
  }): Promise<Campaign[]> {
    const queryParams = params
      ? Object.fromEntries(
          Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, String(value)]),
        )
      : undefined

    const rawDataArray = await apiClient.get<BackendCampaignApiItem[]>(this.endpoint, queryParams)

    if (!rawDataArray) {
      throw new Error("Resposta vazia ou inválida da API ao buscar campanhas.")
    }

    return rawDataArray.map((item) => this.mapRawCampaignToFrontend(item))
  }

  async create(data: Omit<Campaign, "id" | "createdAt" | "updatedAt">): Promise<Campaign> {
    const rawDataToSend = this.mapFrontendCampaignToBackend(data)

    // Filter out undefined properties
    const filteredRawDataToSend = Object.fromEntries(
      Object.entries(rawDataToSend).filter(([, value]) => value !== undefined),
    )

    const rawData = await apiClient.post<BackendCampaignApiItem>(this.endpoint, filteredRawDataToSend)

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao criar campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async update(id: number, data: Partial<Campaign>): Promise<Campaign> {
    const rawDataToSend = this.mapFrontendCampaignToBackend(data)

    // Filter out undefined properties
    const filteredRawDataToSend = Object.fromEntries(
      Object.entries(rawDataToSend).filter(([, value]) => value !== undefined),
    )

    const rawData = await apiClient.put<BackendCampaignApiItem>(`${this.endpoint}${id}/`, filteredRawDataToSend)

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao atualizar campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}${id}/`)
  }

  async getById(id: number): Promise<Campaign> {
    const rawData = await apiClient.get<BackendCampaignApiItem>(`${this.endpoint}${id}/`)

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao buscar campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async addStoresToCampaign(campaignId: number, storeIds: number[]): Promise<Campaign> {
    const rawData = await apiClient.post<BackendCampaignApiItem>(`${this.endpoint}${campaignId}/stores/`, {
      store_ids: storeIds,
    })

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao adicionar lojas à campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async removeStoresFromCampaign(campaignId: number, storeIds: number[]): Promise<Campaign> {
    const rawData = await apiClient.delete<BackendCampaignApiItem>(`${this.endpoint}${campaignId}/stores/`, {
      store_ids: storeIds,
    })

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao remover lojas da campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async addOSCsToCampaign(campaignId: number, oscIds: number[]): Promise<Campaign> {
    const rawData = await apiClient.post<BackendCampaignApiItem>(`${this.endpoint}${campaignId}/oscs/`, {
      osc_ids: oscIds,
    })

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao adicionar OSCs à campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }

  async removeOSCsFromCampaign(campaignId: number, oscIds: number[]): Promise<Campaign> {
    const rawData = await apiClient.delete<BackendCampaignApiItem>(`${this.endpoint}${campaignId}/oscs/`, {
      osc_ids: oscIds,
    })

    if (!rawData) {
      throw new Error("Resposta vazia ou inválida da API ao remover OSCs da campanha.")
    }

    return this.mapRawCampaignToFrontend(rawData)
  }
}

export const campaignsService = new CampaignsService()
