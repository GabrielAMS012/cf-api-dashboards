"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { AuthService } from "@/lib/api/auth"

interface UseApiOptions {
  endpoint: string
  searchQuery?: string
  filters?: Record<string, any>
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

interface PaginationInfo {
  page: number
  totalPages: number
  totalCount: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  startItem: number
  endItem: number
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
}

export function useApi<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  })
  const authService = AuthService.getInstance()

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await authService.makeAuthenticatedRequest(url, {
        method: "GET",
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { ...state, refetch: fetchData }
}

export function usePaginatedApi<T>(baseUrl: string, filters: Record<string, any> = {}, pageSize = 20) {
  const [currentPage, setCurrentPage] = useState(1)
  const [state, setState] = useState<ApiState<PaginatedResponse<T>>>({
    data: null,
    loading: true,
    error: null,
  })
  const authService = AuthService.getInstance()

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams()

    // Add pagination
    params.append("page", currentPage.toString())
    params.append("page_size", pageSize.toString())

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString())
      }
    })

    return `${baseUrl}?${params.toString()}`
  }, [baseUrl, currentPage, pageSize, filters])

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const url = buildUrl()
      const response = await authService.makeAuthenticatedRequest(url, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      })
    }
  }, [buildUrl])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const pagination: PaginationInfo = {
    page: currentPage,
    totalPages: state.data ? Math.ceil(state.data.count / pageSize) : 0,
    totalCount: state.data?.count || 0,
    pageSize,
    hasNextPage: !!state.data?.next,
    hasPreviousPage: !!state.data?.previous,
    startItem: state.data ? (currentPage - 1) * pageSize + 1 : 0,
    endItem: state.data ? Math.min(currentPage * pageSize, state.data.count) : 0,
    nextPage: () => {
      if (state.data?.next) {
        setCurrentPage((prev) => prev + 1)
      }
    },
    previousPage: () => {
      if (state.data?.previous) {
        setCurrentPage((prev) => prev - 1)
      }
    },
    goToPage: (page: number) => {
      const totalPages = state.data ? Math.ceil(state.data.count / pageSize) : 0
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page)
      }
    },
  }

  return {
    data: state.data?.results || [],
    loading: state.loading,
    error: state.error,
    pagination,
    refetch: fetchData,
    rawApiData: state.data, // For debugging
  }
}

export async function updateApiData<T>(
  url: string,
  data: Partial<T>,
  method: "PUT" | "PATCH" | "POST" = "PUT",
): Promise<T> {
  const response = await authService.makeAuthenticatedRequest(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  const authService = AuthService.getInstance()

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function useApiOld<T>({ endpoint, searchQuery = "", filters = {} }: UseApiOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  const fetchData = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, value.toString())
        }
      })

      const url = `${endpoint}${params.toString() ? `?${params.toString()}` : ""}`

      // Use authenticated request through authService
      const response = await authService.makeAuthenticatedRequest(url)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
      toast.error("Erro ao carregar dados")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint, searchQuery, JSON.stringify(filters)])

  const create = async (item: Partial<T>) => {
    try {
      const response = await authService.makeAuthenticatedRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(item),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newItem = await response.json()
      setData((prev) => [...prev, newItem])
      toast.success("Item criado com sucesso!")
      return newItem
    } catch (err) {
      toast.error("Erro ao criar item")
      throw err
    }
  }

  const update = async (id: number, updates: Partial<T>) => {
    try {
      const response = await authService.makeAuthenticatedRequest(`${endpoint}${id}/`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const updatedItem = await response.json()
      setData((prev) => prev.map((item) => ((item as any).id === id ? updatedItem : item)))
      toast.success("Item atualizado com sucesso!")
      return updatedItem
    } catch (err) {
      toast.error("Erro ao atualizar item")
      throw err
    }
  }

  const remove = async (id: number) => {
    try {
      const response = await authService.makeAuthenticatedRequest(`${endpoint}${id}/`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setData((prev) => prev.filter((item) => (item as any).id !== id))
      toast.success("Item removido com sucesso!")
    } catch (err) {
      toast.error("Erro ao remover item")
      throw err
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
    update,
    remove,
  }
}
