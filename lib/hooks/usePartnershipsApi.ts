"use client"

import { useState, useCallback } from "react"
import { partnershipsService } from "@/lib/api/services/partnerships"

export interface Partnership {
  id: number
  osc: string
  loja: string
  dataInicio: string
  dataVencimento: string
  status: string
  campanhas: number
  storeId: number // NEW: ID da loja para operações de API
  oscId: number // NEW: ID da OSC para operações de API
}

interface UsePartnershipsApiReturn {
  partnerships: Partnership[]
  loading: boolean
  error: string | null
  fetchPartnerships: (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    storeId?: number
    oscId?: number
  }) => Promise<void>
  createPartnership: (partnership: Omit<Partnership, "id" | "campanhas">) => Promise<void>
  updatePartnership: (id: number, updates: Partial<Partnership>) => Promise<void>
}

export const usePartnershipsApi = (): UsePartnershipsApiReturn => {
  const [partnerships, setPartnerships] = useState<Partnership[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPartnerships = useCallback(
    async (params?: {
      page?: number
      limit?: number
      search?: string
      status?: string
      storeId?: number
      oscId?: number
    }) => {
      setLoading(true)
      setError(null)
      try {
        // Direct call to service, expecting a bare array of Partnership objects
        const partnershipsArray = await partnershipsService.getAll(params)
        setPartnerships(partnershipsArray)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao buscar parcerias"
        setError(errorMessage)
        console.error("Error fetching partnerships:", err)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const createPartnership = useCallback(async (partnership: Omit<Partnership, "id" | "campanhas">) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const newPartnership = await partnershipsService.create(partnership)
      setPartnerships((prev) => [...prev, newPartnership])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar parceria"
      setError(errorMessage)
      console.error("Error creating partnership:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePartnership = useCallback(async (id: number, updates: Partial<Partnership>) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate delay
      const updatedPartnership = await partnershipsService.update(id, updates)
      setPartnerships((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedPartnership } : item)))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar parceria"
      setError(errorMessage)
      console.error("Error updating partnership:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    partnerships,
    loading,
    error,
    fetchPartnerships,
    createPartnership,
    updatePartnership,
  }
}
