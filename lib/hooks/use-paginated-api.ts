"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "./use-debounce"
import { useAuthenticatedFetch } from "./use-api-preload"

interface UsePaginatedApiOptions {
  initialPage?: number
  initialLimit?: number
  enabled?: boolean
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function usePaginatedApi<T, F = Record<string, any>>(baseUrl: string, options: UsePaginatedApiOptions = {}) {
  const { initialPage = 1, initialLimit = 10, enabled = true } = options
  const { makeRequest } = useAuthenticatedFetch()

  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [filters, setFilters] = useState<F>({} as F)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce dos filtros para evitar muitas requisições
  const debouncedFilters = useDebounce(filters, 500)

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    // Adicionar filtros à URL
    Object.entries(debouncedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value))
      }
    })

    return `${baseUrl}?${params.toString()}`
  }, [baseUrl, page, limit, debouncedFilters])

  const fetchData = useCallback(async () => {
    if (!enabled) return

    try {
      setIsLoading(true)
      setError(null)

      const url = buildUrl()
      const response: PaginatedResponse<T> = await makeRequest(url)

      setData(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar dados"
      setError(errorMessage)
      console.error("Erro na requisição paginada:", err)
    } finally {
      setIsLoading(false)
    }
  }, [enabled, buildUrl, makeRequest])

  // Recarregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateFilters = useCallback((newFilters: Partial<F>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1) // Reset para primeira página ao filtrar
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({} as F)
    setPage(1)
  }, [])

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)))
    },
    [totalPages],
  )

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Reset para primeira página ao mudar limite
  }, [])

  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    total,
    totalPages,
    page,
    limit,
    filters,
    isLoading,
    error,
    updateFilters,
    clearFilters,
    goToPage,
    changeLimit,
    refresh,
  }
}
