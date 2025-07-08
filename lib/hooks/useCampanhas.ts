"use client"

import { useState, useEffect } from "react"
import type { Campanha } from "@/lib/supabase/types"

export function useCampanhas() {
  const [campanhas, setCampanhas] = useState<Campanha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCampanhas = async () => {
    try {
      setLoading(true)
      setError(null)

      // Dados mock para demonstração
      const mockCampanhas: Campanha[] = [
        {
          id: 1,
          nome: "Campanha de Natal 2024",
          descricao: "Arrecadação de alimentos para famílias carentes durante o Natal",
          data_inicio: "2024-12-01",
          data_fim: "2024-12-25",
          status: "ativa",
          meta_arrecadacao: 10000,
          total_arrecadado: 7500,
          created_at: "2024-11-01T00:00:00Z",
          updated_at: "2024-11-15T00:00:00Z",
        },
        {
          id: 2,
          nome: "Páscoa Solidária",
          descricao: "Distribuição de cestas básicas para a Páscoa",
          data_inicio: "2024-03-15",
          data_fim: "2024-04-01",
          status: "concluida",
          meta_arrecadacao: 5000,
          total_arrecadado: 5200,
          created_at: "2024-02-01T00:00:00Z",
          updated_at: "2024-04-02T00:00:00Z",
        },
        {
          id: 3,
          nome: "Volta às Aulas",
          descricao: "Arrecadação de material escolar para crianças carentes",
          data_inicio: "2024-01-15",
          data_fim: "2024-02-15",
          status: "concluida",
          meta_arrecadacao: 8000,
          total_arrecadado: 6800,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-02-16T00:00:00Z",
        },
        {
          id: 4,
          nome: "Inverno Solidário",
          descricao: "Arrecadação de agasalhos e cobertores",
          data_inicio: "2024-06-01",
          data_fim: "2024-08-31",
          status: "ativa",
          meta_arrecadacao: 12000,
          total_arrecadado: 9200,
          created_at: "2024-05-15T00:00:00Z",
          updated_at: "2024-07-20T00:00:00Z",
        },
      ]

      setCampanhas(mockCampanhas)
    } catch (err) {
      setError("Erro ao carregar campanhas")
      console.error("Error fetching campanhas:", err)
    } finally {
      setLoading(false)
    }
  }

  const createCampanha = async (data: Omit<Campanha, "id" | "created_at" | "updated_at">) => {
    try {
      // Simular criação
      const newCampanha: Campanha = {
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setCampanhas((prev) => [newCampanha, ...prev])
      return newCampanha
    } catch (err) {
      console.error("Error creating campanha:", err)
      throw err
    }
  }

  const updateCampanha = async (id: number, data: Partial<Campanha>) => {
    try {
      setCampanhas((prev) =>
        prev.map((campanha) =>
          campanha.id === id ? { ...campanha, ...data, updated_at: new Date().toISOString() } : campanha,
        ),
      )
    } catch (err) {
      console.error("Error updating campanha:", err)
      throw err
    }
  }

  const deleteCampanha = async (id: number) => {
    try {
      setCampanhas((prev) => prev.filter((campanha) => campanha.id !== id))
    } catch (err) {
      console.error("Error deleting campanha:", err)
      throw err
    }
  }

  useEffect(() => {
    fetchCampanhas()
  }, [])

  return {
    campanhas,
    loading,
    error,
    createCampanha,
    updateCampanha,
    deleteCampanha,
    refetch: fetchCampanhas,
  }
}
