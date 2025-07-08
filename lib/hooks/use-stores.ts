"use client"

import { useState, useEffect, useCallback } from "react"
import type { Store, OSC } from "@/lib/types/parcerias"

// Mock data for demonstration
const initialMockStores: Store[] = [
  {
    id: 1,
    code: "001",
    name: "Supermercado Central",
    city: "São Paulo",
    state: "SP",
    cnpj: "12.345.678/0001-90",
    osc_count: 3,
    osc_active_count: 2,
    oscs: [
      {
        id: 1,
        name: "Instituto Alimentar Solidário",
        cnpj: "98.765.432/0001-10",
        email: "contato@alimentarsolidario.org",
        responsable_name: "Maria Silva Santos",
        city: "São Paulo",
        state: "SP",
        is_active: true,
        is_favorite: true,
        partnership_active: true,
      },
      {
        id: 2,
        name: "Rede Contra Fome",
        cnpj: "11.222.333/0001-44",
        email: "admin@redecontrafome.org",
        responsable_name: "João Carlos Oliveira",
        city: "São Paulo",
        state: "SP",
        is_active: true,
        is_favorite: false,
        partnership_active: true,
      },
      {
        id: 3,
        name: "Fundação Mesa Brasil",
        cnpj: "55.666.777/0001-88",
        email: "fundacao@mesabrasil.org",
        responsable_name: "Carlos Eduardo Lima",
        city: "São Paulo",
        state: "SP",
        is_active: false,
        is_favorite: false,
        partnership_active: false,
      },
    ],
  },
  {
    id: 2,
    code: "002",
    name: "Mercado do Bairro",
    city: "Rio de Janeiro",
    state: "RJ",
    cnpj: "98.765.432/0001-10",
    osc_count: 1,
    osc_active_count: 1,
    oscs: [
      {
        id: 4,
        name: "Associação Prato Cheio",
        cnpj: "33.444.555/0001-22",
        email: "contato@pratocheio.org",
        responsable_name: "Ana Paula Costa",
        city: "Rio de Janeiro",
        state: "RJ",
        is_active: true,
        is_favorite: true,
        partnership_active: true,
      },
    ],
  },
  {
    id: 3,
    code: "003",
    name: "Atacadão Norte",
    city: "Belo Horizonte",
    state: "MG",
    cnpj: "44.555.666/0001-77",
    osc_count: 0,
    osc_active_count: 0,
    oscs: [],
  },
]

export function useStores() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(initialMockStores)
      setLoading(false)
    }, 1000)
  }, [])

  const updateStore = useCallback((storeId: number, updates: Partial<Store>) => {
    setStores((prevStores) => prevStores.map((store) => (store.id === storeId ? { ...store, ...updates } : store)))
  }, [])

  const updateOSCInStore = useCallback((storeId: number, oscId: number, updates: Partial<OSC>) => {
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.id === storeId && store.oscs) {
          const updatedOSCs = store.oscs.map((osc) => (osc.id === oscId ? { ...osc, ...updates } : osc))

          // Recalculate counts
          const osc_count = updatedOSCs.length
          const osc_active_count = updatedOSCs.filter((osc) => osc.partnership_active).length

          return {
            ...store,
            oscs: updatedOSCs,
            osc_count,
            osc_active_count,
          }
        }
        return store
      }),
    )
  }, [])

  const addOSCsToStore = useCallback((storeId: number, newOSCs: OSC[]) => {
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.id === storeId) {
          const existingOSCs = store.oscs || []
          const updatedOSCs = [...existingOSCs, ...newOSCs]

          // Recalculate counts
          const osc_count = updatedOSCs.length
          const osc_active_count = updatedOSCs.filter((osc) => osc.partnership_active).length

          return {
            ...store,
            oscs: updatedOSCs,
            osc_count,
            osc_active_count,
          }
        }
        return store
      }),
    )
  }, [])

  const removeOSCFromStore = useCallback((storeId: number, oscId: number) => {
    setStores((prevStores) =>
      prevStores.map((store) => {
        if (store.id === storeId && store.oscs) {
          const updatedOSCs = store.oscs.filter((osc) => osc.id !== oscId)

          // Recalculate counts
          const osc_count = updatedOSCs.length
          const osc_active_count = updatedOSCs.filter((osc) => osc.partnership_active).length

          return {
            ...store,
            oscs: updatedOSCs,
            osc_count,
            osc_active_count,
          }
        }
        return store
      }),
    )
  }, [])

  const mutateStore = useCallback((storeId: number) => {
    // This function can be used to trigger a refresh if needed
    console.log(`Refreshing store ${storeId}`)
  }, [])

  return {
    stores,
    setStores,
    loading,
    mutateStore,
    updateStore,
    updateOSCInStore,
    addOSCsToStore,
    removeOSCFromStore,
  }
}
