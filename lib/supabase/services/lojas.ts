import { supabase } from "../client"
import type { Loja } from "../types"

export class LojasService {
  // Buscar todas as lojas
  async getAll(filters?: {
    status?: boolean
    uf?: string
    bandeira?: string
    search?: string
  }) {
    let query = supabase.from("lojas").select("*").order("nome")

    if (filters?.status !== undefined) {
      query = query.eq("status", filters.status)
    }

    if (filters?.uf) {
      query = query.eq("uf", filters.uf)
    }

    if (filters?.bandeira) {
      query = query.eq("bandeira", filters.bandeira)
    }

    if (filters?.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,codigo.ilike.%${filters.search}%,cidade.ilike.%${filters.search}%`,
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as Loja[]
  }

  // Buscar loja por ID
  async getById(id: string) {
    const { data, error } = await supabase.from("lojas").select("*").eq("id", id).single()

    if (error) throw error
    return data as Loja
  }

  // Buscar lojas com suas parcerias
  async getWithParcerias(lojaId?: string) {
    let query = supabase
      .from("lojas")
      .select(`
        *,
        parcerias (
          *,
          osc:oscs (*)
        )
      `)
      .order("nome")

    if (lojaId) {
      query = query.eq("id", lojaId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // Criar nova loja
  async create(loja: Omit<Loja, "id" | "created_at">) {
    const { data, error } = await supabase.from("lojas").insert(loja).select().single()

    if (error) throw error
    return data as Loja
  }

  // Atualizar loja
  async update(id: string, updates: Partial<Omit<Loja, "id" | "created_at">>) {
    const { data, error } = await supabase.from("lojas").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Loja
  }

  // Deletar loja
  async delete(id: string) {
    const { error } = await supabase.from("lojas").delete().eq("id", id)

    if (error) throw error
    return true
  }

  // Buscar bandeiras únicas
  async getBandeiras() {
    const { data, error } = await supabase
      .from("lojas")
      .select("bandeira")
      .not("bandeira", "is", null)
      .order("bandeira")

    if (error) throw error

    const bandeiras = [...new Set(data.map((item) => item.bandeira).filter(Boolean))]
    return bandeiras
  }

  // Buscar UFs únicas
  async getUFs() {
    const { data, error } = await supabase.from("lojas").select("uf").not("uf", "is", null).order("uf")

    if (error) throw error

    const ufs = [...new Set(data.map((item) => item.uf).filter(Boolean))]
    return ufs
  }

  // Estatísticas das lojas
  async getStats() {
    const { data, error } = await supabase.from("lojas").select("status, uf, bandeira")

    if (error) throw error

    const total = data.length
    const ativas = data.filter((loja) => loja.status).length
    const inativas = total - ativas

    const porUF = data.reduce((acc: Record<string, number>, loja) => {
      if (loja.uf) {
        acc[loja.uf] = (acc[loja.uf] || 0) + 1
      }
      return acc
    }, {})

    const porBandeira = data.reduce((acc: Record<string, number>, loja) => {
      if (loja.bandeira) {
        acc[loja.bandeira] = (acc[loja.bandeira] || 0) + 1
      }
      return acc
    }, {})

    return {
      total,
      ativas,
      inativas,
      porUF,
      porBandeira,
    }
  }
}

export const lojasService = new LojasService()
