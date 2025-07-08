"use client"

import { useState, useEffect, useCallback } from "react"
import type { Store, StoreFilters, StoreStats } from "@/lib/types/store"
import { StoresService } from "../api/services/stores"


export function useStoreApi() {
  const [stores, setStores] = useState<Store[]>([])
  const [filteredStores, setFilteredStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StoreStats>({
    total: 0,
    active: 0,
    inactive: 0,
    states: 0,
  })
  const [filters, setFilters] = useState<StoreFilters>({
    search: "",
    status: "all",
    uf: "",
    flag: "",
  })
  const [updatingStores, setUpdatingStores] = useState<Set<number>>(new Set())

  const storeStervice = new StoresService()

  const fetchStores = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const storeResponse = await storeStervice.getAll()

      console.log(storeResponse)

      console.log("Lojas carregadas:", storeResponse.length)

      setStores(storeResponse)
      calculateStats(storeResponse)
    } catch (error) {
      console.error("Erro ao buscar lojas:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar lojas")
    } finally {
      setLoading(false)
    }
  }, [])
    
    const createStore = useCallback(async (store: Store) => {
      setLoading(true)
      setError(null)
  
      try {
        // Simulate API delay
        await storeStervice.create(store)
      } catch (err) {
        setError("Erro ao carregar OSCs")
      } finally {
        setLoading(false)
      }
    }, [])

  const calculateStats = (storeList: Store[]) => {
    const total = storeList.length
    const active = storeList.filter((store) => store.status === 1).length
    const inactive = total - active
    const states = new Set(storeList.map((store) => store.uf).filter(Boolean)).size

    setStats({ total, active, inactive, states })
  }

  const applyFilters = useCallback(() => {
    let filtered = [...stores]

    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (store) =>
          store.name.toLowerCase().includes(searchLower) ||
          store.store_code.toString().includes(searchLower) ||
          (store.city && store.city.toLowerCase().includes(searchLower)),
      )
    }

    // Filtro de status
    if (filters.status !== "all") {
      const statusValue = filters.status === "active" ? 1 : 0
      filtered = filtered.filter((store) => store.status === statusValue)
    }

    // Filtro de UF
    if (filters.uf) {
      filtered = filtered.filter((store) => store.uf === filters.uf)
    }

    // Filtro de bandeira
    if (filters.flag) {
      filtered = filtered.filter((store) => store.flag === filters.flag)
    }

    setFilteredStores(filtered)
  }, [stores, filters])

  const updateStoreStatus = async (storeId: number, storeCode: number, newStatus: 0 | 1) => {
    try {
      setUpdatingStores((prev) => new Set(prev).add(storeId))

      const requestBody = {
        store_code: storeCode,
        status: newStatus,
      }

      console.log(`Atualizando loja ${storeId}:`, requestBody)

      await storeStervice.update(storeId, requestBody)

      // Atualizar o estado local
      setStores((prev) => prev.map((store) => (store.id === storeId ? { ...store, status: newStatus } : store)))

      console.log(`Status da loja ${storeId} atualizado para ${newStatus}`)
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      throw error
    } finally {
      setUpdatingStores((prev) => {
        const newSet = new Set(prev)
        newSet.delete(storeId)
        return newSet
      })
    }
  }

  const updateFilters = (newFilters: Partial<StoreFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      uf: "",
      flag: "",
    })
  }

  const getUniqueValues = (field: keyof Store) => {
    return Array.from(new Set(stores.map((store) => store[field]).filter(Boolean)))
  }

  useEffect(() => {
    fetchStores()
  }, [fetchStores])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  useEffect(() => {
    calculateStats(filteredStores)
  }, [filteredStores])

  return {
    stores: filteredStores,
    loading,
    error,
    stats,
    filters,
    updatingStores,
    updateStoreStatus,
    updateFilters,
    clearFilters,
    refreshStores: fetchStores,
    getUniqueValues,
    createStore,
  }
}
