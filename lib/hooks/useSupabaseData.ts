"use client"

import { useState, useEffect } from "react"
import { lojasService, oscsService, parceriasService } from "@/lib/supabase/services"
import type { Loja, OSC } from "@/lib/supabase/types"

// Hook para lojas
export function useLojas(filters?: {
  status?: boolean
  uf?: string
  bandeira?: string
  search?: string
}) {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLojas = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await lojasService.getAll(filters)
      setLojas(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar lojas")
      console.error("Error fetching lojas:", err)
    } finally {
      setLoading(false)
    }
  }

  const createLoja = async (loja: Omit<Loja, "id" | "created_at">) => {
    try {
      const newLoja = await lojasService.create(loja)
      setLojas((prev) => [newLoja, ...prev])
      return newLoja
    } catch (err) {
      throw err
    }
  }

  const updateLoja = async (id: string, updates: Partial<Omit<Loja, "id" | "created_at">>) => {
    try {
      const updatedLoja = await lojasService.update(id, updates)
      setLojas((prev) => prev.map((loja) => (loja.id === id ? updatedLoja : loja)))
      return updatedLoja
    } catch (err) {
      throw err
    }
  }

  const deleteLoja = async (id: string) => {
    try {
      await lojasService.delete(id)
      setLojas((prev) => prev.filter((loja) => loja.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchLojas()
  }, [filters?.status, filters?.uf, filters?.bandeira, filters?.search])

  return {
    lojas,
    loading,
    error,
    refetch: fetchLojas,
    createLoja,
    updateLoja,
    deleteLoja,
  }
}

// Hook para OSCs
export function useOSCs(filters?: {
  status?: boolean
  uf?: string
  search?: string
}) {
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOSCs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await oscsService.getAll(filters)
      setOSCs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar OSCs")
      console.error("Error fetching OSCs:", err)
    } finally {
      setLoading(false)
    }
  }

  const createOSC = async (osc: Omit<OSC, "id" | "created_at">) => {
    try {
      const newOSC = await oscsService.create(osc)
      setOSCs((prev) => [newOSC, ...prev])
      return newOSC
    } catch (err) {
      throw err
    }
  }

  const updateOSC = async (id: string, updates: Partial<Omit<OSC, "id" | "created_at">>) => {
    try {
      const updatedOSC = await oscsService.update(id, updates)
      setOSCs((prev) => prev.map((osc) => (osc.id === id ? updatedOSC : osc)))
      return updatedOSC
    } catch (err) {
      throw err
    }
  }

  const deleteOSC = async (id: string) => {
    try {
      await oscsService.delete(id)
      setOSCs((prev) => prev.filter((osc) => osc.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchOSCs()
  }, [filters?.status, filters?.uf, filters?.search])

  return {
    oscs,
    loading,
    error,
    refetch: fetchOSCs,
    createOSC,
    updateOSC,
    deleteOSC,
  }
}

// Hook para parcerias com lojas
export function useLojasComParcerias() {
  const [lojasComParcerias, setLojasComParcerias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLojasComParcerias = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await lojasService.getWithParcerias()
      setLojasComParcerias(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar lojas com parcerias")
      console.error("Error fetching lojas com parcerias:", err)
    } finally {
      setLoading(false)
    }
  }

  const addOSCsToLoja = async (lojaId: string, oscIds: string[]) => {
    try {
      await parceriasService.addOSCsToLoja(lojaId, oscIds)
      await fetchLojasComParcerias() // Recarregar dados
    } catch (err) {
      throw err
    }
  }

  const removeParceria = async (parceriaId: string) => {
    try {
      await parceriasService.delete(parceriaId)
      await fetchLojasComParcerias() // Recarregar dados
    } catch (err) {
      throw err
    }
  }

  const setFavorita = async (lojaId: string, oscId: string) => {
    try {
      await parceriasService.setFavorita(lojaId, oscId)
      await fetchLojasComParcerias() // Recarregar dados
    } catch (err) {
      throw err
    }
  }

  const updateParceriaStatus = async (parceriaId: string, status: boolean) => {
    try {
      await parceriasService.update(parceriaId, { status })
      await fetchLojasComParcerias() // Recarregar dados
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchLojasComParcerias()
  }, [])

  return {
    lojasComParcerias,
    loading,
    error,
    refetch: fetchLojasComParcerias,
    addOSCsToLoja,
    removeParceria,
    setFavorita,
    updateParceriaStatus,
  }
}
