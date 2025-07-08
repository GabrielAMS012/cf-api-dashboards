"use client"

import { useState, useCallback } from "react"
import { campaignsService } from "@/lib/api/services/campaigns"

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

interface UseCampaignsApiReturn {
  campaigns: Campaign[]
  loading: boolean
  error: string | null
  fetchCampaigns: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    tipo?: string
  }) => Promise<void>
  createCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">) => Promise<void>
  updateCampaign: (id: number, updates: Partial<Campaign>) => Promise<void>
  deleteCampaign: (id: number) => Promise<void>
  addStoresToCampaign: (campaignId: number, storeIds: number[]) => Promise<void>
  removeStoresFromCampaign: (campaignId: number, storeIds: number[]) => Promise<void>
  addOSCsToCampaign: (campaignId: number, oscIds: number[]) => Promise<void>
  removeOSCsFromCampaign: (campaignId: number, oscIds: number[]) => Promise<void>
}

export const useCampaignsApi = (): UseCampaignsApiReturn => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCampaigns = useCallback(
    async (params?: {
      page?: number
      limit?: number
      search?: string
      status?: string
      tipo?: string
    }) => {
      setLoading(true)
      setError(null)
      try {
        // Direct call to service, expecting a bare array of Campaign objects
        const campaignsArray = await campaignsService.getAll(params)
        setCampaigns(campaignsArray)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar campanhas"
        setError(errorMessage)
        console.error("Error fetching campaigns:", err)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const createCampaign = useCallback(async (campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const newCampaign = await campaignsService.create(campaign)
      setCampaigns((prev) => [...prev, newCampaign])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar campanha"
      setError(errorMessage)
      console.error("Error creating campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCampaign = useCallback(async (id: number, updates: Partial<Campaign>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedCampaign = await campaignsService.update(id, updates)
      setCampaigns((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedCampaign } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar campanha"
      setError(errorMessage)
      console.error("Error updating campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCampaign = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      await campaignsService.delete(id)
      setCampaigns((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar campanha"
      setError(errorMessage)
      console.error("Error deleting campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const addStoresToCampaign = useCallback(async (campaignId: number, storeIds: number[]) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedCampaign = await campaignsService.addStoresToCampaign(campaignId, storeIds)
      setCampaigns((prev) => prev.map((item) => (item.id === campaignId ? { ...item, ...updatedCampaign } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar lojas à campanha"
      setError(errorMessage)
      console.error("Error adding stores to campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeStoresFromCampaign = useCallback(async (campaignId: number, storeIds: number[]) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedCampaign = await campaignsService.removeStoresFromCampaign(campaignId, storeIds)
      setCampaigns((prev) => prev.map((item) => (item.id === campaignId ? { ...item, ...updatedCampaign } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao remover lojas da campanha"
      setError(errorMessage)
      console.error("Error removing stores from campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const addOSCsToCampaign = useCallback(async (campaignId: number, oscIds: number[]) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedCampaign = await campaignsService.addOSCsToCampaign(campaignId, oscIds)
      setCampaigns((prev) => prev.map((item) => (item.id === campaignId ? { ...item, ...updatedCampaign } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao adicionar OSCs à campanha"
      setError(errorMessage)
      console.error("Error adding OSCs to campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const removeOSCsFromCampaign = useCallback(async (campaignId: number, oscIds: number[]) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedCampaign = await campaignsService.removeOSCsFromCampaign(campaignId, oscIds)
      setCampaigns((prev) => prev.map((item) => (item.id === campaignId ? { ...item, ...updatedCampaign } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao remover OSCs da campanha"
      setError(errorMessage)
      console.error("Error removing OSCs from campaign:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    campaigns,
    loading,
    error,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    addStoresToCampaign,
    removeStoresFromCampaign,
    addOSCsToCampaign,
    removeOSCsFromCampaign,
  }
}
