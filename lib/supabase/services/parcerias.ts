import { supabase } from "../client"
import type { Parceria } from "../types"

export class ParceriasService {
  // Buscar todas as parcerias
  async getAll(filters?: {
    lojaId?: string
    oscId?: string
    status?: boolean
  }) {
    let query = supabase
      .from("parcerias")
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)
      .order("created_at", { ascending: false })

    if (filters?.lojaId) {
      query = query.eq("loja_id", filters.lojaId)
    }

    if (filters?.oscId) {
      query = query.eq("osc_id", filters.oscId)
    }

    if (filters?.status !== undefined) {
      query = query.eq("status", filters.status)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  // Buscar parceria por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from("parcerias")
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  // Criar nova parceria
  async create(parceria: Omit<Parceria, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("parcerias")
      .insert(parceria)
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Atualizar parceria
  async update(id: string, updates: Partial<Omit<Parceria, "id" | "created_at">>) {
    const { data, error } = await supabase
      .from("parcerias")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Deletar parceria
  async delete(id: string) {
    const { error } = await supabase.from("parcerias").delete().eq("id", id)

    if (error) throw error
    return true
  }

  // Adicionar múltiplas OSCs a uma loja
  async addOSCsToLoja(lojaId: string, oscIds: string[]) {
    const parcerias = oscIds.map((oscId) => ({
      loja_id: lojaId,
      osc_id: oscId,
      status: true,
      favorita: false,
    }))

    const { data, error } = await supabase
      .from("parcerias")
      .insert(parcerias)
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)

    if (error) throw error
    return data
  }

  // Definir OSC favorita para uma loja (remove favorita das outras)
  async setFavorita(lojaId: string, oscId: string) {
    // Primeiro, remove favorita de todas as OSCs da loja
    await supabase.from("parcerias").update({ favorita: false }).eq("loja_id", lojaId)

    // Depois, define a OSC específica como favorita
    const { data, error } = await supabase
      .from("parcerias")
      .update({ favorita: true })
      .eq("loja_id", lojaId)
      .eq("osc_id", oscId)
      .select(`
        *,
        loja:lojas (*),
        osc:oscs (*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Verificar se parceria já existe
  async exists(lojaId: string, oscId: string) {
    const { data, error } = await supabase.from("parcerias").select("id").eq("loja_id", lojaId).eq("osc_id", oscId)

    if (error) throw error
    return data.length > 0
  }

  // Estatísticas das parcerias
  async getStats() {
    const { data, error } = await supabase.from("parcerias").select("status, favorita")

    if (error) throw error

    const total = data.length
    const ativas = data.filter((p) => p.status).length
    const inativas = total - ativas
    const favoritas = data.filter((p) => p.favorita).length

    return {
      total,
      ativas,
      inativas,
      favoritas,
    }
  }
}

export const parceriasService = new ParceriasService()
