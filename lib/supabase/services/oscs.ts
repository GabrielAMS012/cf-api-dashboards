import { supabase } from "../client"
import type { OSC } from "../types"

export class OSCsService {
  // Buscar todas as OSCs
  async getAll(filters?: {
    status?: boolean
    uf?: string
    search?: string
  }) {
    let query = supabase.from("oscs").select("*").order("nome")

    if (filters?.status !== undefined) {
      query = query.eq("status", filters.status)
    }

    if (filters?.uf) {
      query = query.eq("uf", filters.uf)
    }

    if (filters?.search) {
      query = query.or(
        `nome.ilike.%${filters.search}%,cnpj.ilike.%${filters.search}%,responsavel.ilike.%${filters.search}%,cidade.ilike.%${filters.search}%`,
      )
    }

    const { data, error } = await query

    if (error) throw error
    return data as OSC[]
  }

  // Buscar OSC por ID
  async getById(id: string) {
    const { data, error } = await supabase.from("oscs").select("*").eq("id", id).single()

    if (error) throw error
    return data as OSC
  }

  // Buscar OSCs com suas parcerias
  async getWithParcerias(oscId?: string) {
    let query = supabase
      .from("oscs")
      .select(`
        *,
        parcerias (
          *,
          loja:lojas (*)
        )
      `)
      .order("nome")

    if (oscId) {
      query = query.eq("id", oscId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // Criar nova OSC
  async create(osc: Omit<OSC, "id" | "created_at">) {
    const { data, error } = await supabase.from("oscs").insert(osc).select().single()

    if (error) throw error
    return data as OSC
  }

  // Atualizar OSC
  async update(id: string, updates: Partial<Omit<OSC, "id" | "created_at">>) {
    const { data, error } = await supabase.from("oscs").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as OSC
  }

  // Deletar OSC
  async delete(id: string) {
    const { error } = await supabase.from("oscs").delete().eq("id", id)

    if (error) throw error
    return true
  }

  // Validar CNPJ único
  async validateCNPJ(cnpj: string, excludeId?: string) {
    let query = supabase.from("oscs").select("id").eq("cnpj", cnpj)

    if (excludeId) {
      query = query.neq("id", excludeId)
    }

    const { data, error } = await query

    if (error) throw error
    return data.length === 0
  }

  // Buscar OSCs com vencimento próximo
  async getVencimentoProximo(dias = 30) {
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + dias)

    const { data, error } = await supabase
      .from("oscs")
      .select("*")
      .eq("status", true)
      .lte("data_vencimento", dataLimite.toISOString().split("T")[0])
      .order("data_vencimento")

    if (error) throw error
    return data as OSC[]
  }

  // Estatísticas das OSCs
  async getStats() {
    const { data, error } = await supabase.from("oscs").select("status, uf, data_vencimento")

    if (error) throw error

    const total = data.length
    const ativas = data.filter((osc) => osc.status).length
    const inativas = total - ativas

    const hoje = new Date()
    const em30Dias = new Date()
    em30Dias.setDate(hoje.getDate() + 30)

    const vencendoEm30Dias = data.filter((osc) => {
      if (!osc.data_vencimento) return false
      const vencimento = new Date(osc.data_vencimento)
      return vencimento >= hoje && vencimento <= em30Dias
    }).length

    const vencidas = data.filter((osc) => {
      if (!osc.data_vencimento) return false
      const vencimento = new Date(osc.data_vencimento)
      return vencimento < hoje
    }).length

    const porUF = data.reduce((acc: Record<string, number>, osc) => {
      if (osc.uf) {
        acc[osc.uf] = (acc[osc.uf] || 0) + 1
      }
      return acc
    }, {})

    return {
      total,
      ativas,
      inativas,
      vencendoEm30Dias,
      vencidas,
      porUF,
    }
  }
}

export const oscsService = new OSCsService()
