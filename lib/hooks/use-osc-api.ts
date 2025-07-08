"use client"

import { useState, useCallback } from "react"
import { OSCsService } from "../api/services/oscs"

interface OSC {
  id: number
  name: string
  cnpj: string
  tipo: string
  full_address: string
  cidade: string
  uf: string
  phone?: string
  email?: string
  responsable_name?: string
  descricao?: string
  status: number
  created_at: string
}

interface OSCFilters {
  search?: string
  status?: string
  uf?: string
}

export function useOSCApi() {
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const oscService = new OSCsService()

  const fetchOSCs = useCallback(async (page = 1, filters: OSCFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      let filteredOSCs = await oscService.getAll()

      if (filters.search) {
        filteredOSCs = filteredOSCs.filter(
          (osc) => osc.nome.toLowerCase().includes(filters.search!.toLowerCase()) || osc.cnpj.includes(filters.search!),
        )
      }

      if (filters.status && filters.status !== "all") {
        filteredOSCs = filteredOSCs.filter((osc) => osc.status === filters.status)
      }

      if (filters.uf && filters.uf !== "all") {
        filteredOSCs = filteredOSCs.filter((osc) => osc.uf === filters.uf)
      }

      setOSCs(filteredOSCs)
    } catch (err) {
      setError("Erro ao carregar OSCs")
    } finally {
      setLoading(false)
    }
  }, [])

  const createOSC = useCallback(async (osc: OSC) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await oscService.create(osc)
    } catch (err) {
      setError("Erro ao carregar OSCs")
    } finally {
      setLoading(false)
    }
  }, [])
  
  const changeStatus = useCallback(async (osc: OSC) => {
    // setLoading(true)
    setError(null)

    osc.status = (osc.status == 2) ? 0 : osc.status + 1

    try {
      // Simulate API delay
      await oscService.update(osc.id, osc)
      let filteredOSCs = await oscService.getAll()
      setOSCs(filteredOSCs)
    } catch (err) {
      setError("Erro ao carregar OSCs")
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    oscs,
    loading,
    error,
    fetchOSCs,
    changeStatus,
    createOSC
  }
}
