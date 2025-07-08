"use client"

import { useState, useEffect } from "react"
import { parceriasCampanhasService } from "@/lib/supabase/services"
import { supabase } from "@/lib/supabase/client"
import type { ParceriaCampanhaCompleta, Campanha, Loja, OSC } from "@/lib/supabase/types"

interface ParceriaFilters {
  search?: string
  status?: string
  uf?: string
}

export function useParceriasCampanhas() {
  const [parcerias, setParcerias] = useState<ParceriaCampanhaCompleta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchParcerias = async (filters: ParceriaFilters = {}) => {
    try {
      setLoading(true)
      setError(null)
      const data = await parceriasCampanhasService.getAll(filters)
      setParcerias(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar parcerias")
      console.error("Error fetching parcerias campanhas:", err)
    } finally {
      setLoading(false)
    }
  }

  const createParceria = async (parceria: {
    campanha_id: string
    loja_id: string
    osc_id: string
    data_inicio: string
    data_fim: string
  }) => {
    try {
      const novaParceria = await parceriasCampanhasService.create(parceria)
      setParcerias((prev) => [novaParceria, ...prev])
      return novaParceria
    } catch (err) {
      throw err
    }
  }

  const updateParceria = async (
    id: string,
    updates: {
      data_inicio?: string
      data_fim?: string
      status?: "Ativa" | "Concluída"
    },
  ) => {
    try {
      const updatedParceria = await parceriasCampanhasService.update(id, updates)
      setParcerias((prev) => prev.map((p) => (p.id === id ? updatedParceria : p)))
      return updatedParceria
    } catch (err) {
      throw err
    }
  }

  const deleteParceria = async (id: string) => {
    try {
      await parceriasCampanhasService.delete(id)
      setParcerias((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      throw err
    }
  }

  const checkDuplicate = async (campanhaId: string, lojaId: string, oscId: string) => {
    try {
      return await parceriasCampanhasService.exists(campanhaId, lojaId, oscId)
    } catch (err) {
      console.error("Error checking duplicate:", err)
      return false
    }
  }

  useEffect(() => {
    fetchParcerias()
  }, [filters?.campanhaId, filters?.lojaId, filters?.oscId, filters?.status, filters?.search])

  return {
    parcerias,
    loading,
    error,
    refetch: fetchParcerias,
    createParceria,
    updateParceria,
    deleteParceria,
    checkDuplicate,
  }
}

// Hook para buscar dados auxiliares (campanhas, lojas, OSCs)
export function useAuxiliarData() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [lojas, setLojas] = useState<Loja[]>([])
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar campanhas diretamente do Supabase
  const fetchCampanhas = async (): Promise<Campanha[]> => {
    const { data, error } = await supabase.from("campanhas").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Campanha[]
  }

  // Função para buscar lojas diretamente do Supabase
  const fetchLojas = async (): Promise<Loja[]> => {
    const { data, error } = await supabase.from("lojas").select("*").eq("status", true).order("nome")

    if (error) throw error
    return data as Loja[]
  }

  // Função para buscar OSCs diretamente do Supabase
  const fetchOSCs = async (): Promise<OSC[]> => {
    const { data, error } = await supabase.from("oscs").select("*").eq("status", true).order("nome")

    if (error) throw error
    return data as OSC[]
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [campanhasData, lojasData, oscsData] = await Promise.all([fetchCampanhas(), fetchLojas(), fetchOSCs()])

        setCampanhas(campanhasData)
        setLojas(lojasData)
        setOSCs(oscsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados auxiliares")
        console.error("Error fetching auxiliar data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    campanhas,
    lojas,
    oscs,
    loading,
    error,
  }
}
