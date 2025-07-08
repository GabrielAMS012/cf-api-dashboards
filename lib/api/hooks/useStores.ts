// Hook personalizado para gerenciar estado das lojas
"use client"

import { useState, useEffect } from "react"
import { storesService } from "@/lib/api/services"
import type { Store, CreateStoreData, UpdateStoreData } from "@/lib/api/types"

export function useStores(params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  uf?: string
  bandeira?: string
}) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await storesService.getAll(params)

      if (response.success) {
        setStores(response.data)
        if ("pagination" in response) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.message || "Erro ao carregar lojas")
      }
    } catch (err) {
      setError("Erro de conexão com a API")
      console.error("Error fetching stores:", err)
    } finally {
      setLoading(false)
    }
  }

  const createStore = async (data: CreateStoreData) => {
    try {
      const response = await storesService.create(data)
      if (response.success) {
        await fetchStores() // Recarregar lista
        return response.data
      } else {
        throw new Error(response.message || "Erro ao criar loja")
      }
    } catch (err) {
      console.error("Error creating store:", err)
      throw err
    }
  }

  const updateStore = async (id: number, data: UpdateStoreData) => {
    try {
      const response = await storesService.update(id, data)
      if (response.success) {
        await fetchStores() // Recarregar lista
        return response.data
      } else {
        throw new Error(response.message || "Erro ao atualizar loja")
      }
    } catch (err) {
      console.error("Error updating store:", err)
      throw err
    }
  }

  const deleteStore = async (id: number) => {
    try {
      const response = await storesService.delete(id)
      if (response.success) {
        await fetchStores() // Recarregar lista
      } else {
        throw new Error(response.message || "Erro ao deletar loja")
      }
    } catch (err) {
      console.error("Error deleting store:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchStores()
  }, [params?.page, params?.limit, params?.search, params?.status, params?.uf, params?.bandeira])

  return {
    stores,
    loading,
    error,
    pagination,
    refetch: fetchStores,
    createStore,
    updateStore,
    deleteStore,
  }
}
