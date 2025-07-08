import { supabase } from "../client"
import type { Campanha } from "../types"

export class CampanhasService {
  // Buscar todas as campanhas
  async getAll() {
    const { data, error } = await supabase.from("campanhas").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Campanha[]
  }

  // Buscar campanha por ID
  async getById(id: string) {
    const { data, error } = await supabase.from("campanhas").select("*").eq("id", id).single()

    if (error) throw error
    return data as Campanha
  }

  // Buscar campanha completa com lojas e OSCs
  async getCompleta(id: string) {
    const { data, error } = await supabase
      .from("campanhas")
      .select(`
        *,
        campanhas_lojas (
          *,
          loja:lojas (*),
          campanhas_lojas_oscs (
            *,
            osc:oscs (*)
          )
        )
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  // Criar nova campanha
  async create(campanha: Omit<Campanha, "id" | "created_at">) {
    const { data, error } = await supabase.from("campanhas").insert(campanha).select().single()

    if (error) throw error
    return data as Campanha
  }

  // Atualizar campanha
  async update(id: string, updates: Partial<Omit<Campanha, "id" | "created_at">>) {
    const { data, error } = await supabase.from("campanhas").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Campanha
  }

  // Deletar campanha
  async delete(id: string) {
    const { error } = await supabase.from("campanhas").delete().eq("id", id)

    if (error) throw error
    return true
  }

  // Adicionar lojas à campanha
  async addLojas(campanhaId: string, lojaIds: string[]) {
    const campanhaLojas = lojaIds.map((lojaId) => ({
      campanha_id: campanhaId,
      loja_id: lojaId,
    }))

    const { data, error } = await supabase.from("campanhas_lojas").insert(campanhaLojas).select()

    if (error) throw error
    return data
  }

  // Remover lojas da campanha
  async removeLojas(campanhaId: string, lojaIds: string[]) {
    const { error } = await supabase
      .from("campanhas_lojas")
      .delete()
      .eq("campanha_id", campanhaId)
      .in("loja_id", lojaIds)

    if (error) throw error
    return true
  }

  // Adicionar OSCs a uma loja na campanha
  async addOSCsToLoja(campanhaId: string, lojaId: string, oscIds: string[]) {
    const campanhaLojaOSCs = oscIds.map((oscId) => ({
      campanha_id: campanhaId,
      loja_id: lojaId,
      osc_id: oscId,
      favorita: false,
    }))

    const { data, error } = await supabase
      .from("campanhas_lojas_oscs")
      .insert(campanhaLojaOSCs)
      .select(`
        *,
        osc:oscs (*)
      `)

    if (error) throw error
    return data
  }

  // Remover OSCs de uma loja na campanha
  async removeOSCsFromLoja(campanhaId: string, lojaId: string, oscIds: string[]) {
    const { error } = await supabase
      .from("campanhas_lojas_oscs")
      .delete()
      .eq("campanha_id", campanhaId)
      .eq("loja_id", lojaId)
      .in("osc_id", oscIds)

    if (error) throw error
    return true
  }

  // Definir OSC favorita para uma loja na campanha
  async setOSCFavorita(campanhaId: string, lojaId: string, oscId: string) {
    // Primeiro, remove favorita de todas as OSCs da loja na campanha
    await supabase
      .from("campanhas_lojas_oscs")
      .update({ favorita: false })
      .eq("campanha_id", campanhaId)
      .eq("loja_id", lojaId)

    // Depois, define a OSC específica como favorita
    const { data, error } = await supabase
      .from("campanhas_lojas_oscs")
      .update({ favorita: true })
      .eq("campanha_id", campanhaId)
      .eq("loja_id", lojaId)
      .eq("osc_id", oscId)
      .select(`
        *,
        osc:oscs (*)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Buscar lojas de uma campanha
  async getLojasByCampanha(campanhaId: string) {
    const { data, error } = await supabase
      .from("campanhas_lojas")
      .select(`
        *,
        loja:lojas (*),
        campanhas_lojas_oscs (
          *,
          osc:oscs (*)
        )
      `)
      .eq("campanha_id", campanhaId)

    if (error) throw error
    return data
  }
}

export const campanhasService = new CampanhasService()
