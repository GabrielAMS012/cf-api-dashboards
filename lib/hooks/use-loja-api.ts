"use client"

import { useState, useCallback } from "react"
import { AuthService } from "@/lib/api/auth"
import type { Loja, LojaFilters, LojaPagination } from "@/lib/types/loja"

interface UseLojaApiReturn {
  lojas: Loja[]
  loading: boolean
  error: string | null
  pagination: LojaPagination
  fetchLojas: (filters?: LojaFilters, page?: number) => Promise<void>
  getStats: () => { total: number; ativas: number; inativas: number; pendentes: number }
}

export function useLojaApi(): UseLojaApiReturn {
  const [lojas, setLojas] = useState<Loja[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<LojaPagination>({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
  })
  const authService = AuthService.getInstance()

  const fetchLojas = useCallback(async (filters: LojaFilters = {}, page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const token = await authService.getToken()
      if (!token) {
        throw new Error("Token de autenticação não encontrado")
      }

      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.estado) params.append("estado", filters.estado)
      if (filters.status) params.append("status", filters.status)
      if (filters.tipo) params.append("tipo", filters.tipo)
      params.append("page", page.toString())

      const response = await fetch(
        `https://hml-arrecadacaoback-ckf3cncbehb2cacd.brazilsouth-01.azurewebsites.net/api/loja/?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      setLojas(data.results || [])
      setPagination({
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
        currentPage: page,
        totalPages: Math.ceil((data.count || 0) / 20),
      })
    } catch (err) {
      console.error("Erro ao buscar lojas:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }, [])

  const getStats = useCallback(() => {
    return {
      total: lojas.length,
      ativas: lojas.filter((loja) => loja.status === "Ativa").length,
      inativas: lojas.filter((loja) => loja.status === "Inativa").length,
      pendentes: lojas.filter((loja) => loja.status === "Pendente").length,
    }
  }, [lojas])

  return {
    lojas,
    loading,
    error,
    pagination,
    fetchLojas,
    getStats,
  }
}
