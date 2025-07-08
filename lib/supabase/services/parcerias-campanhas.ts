import { supabase } from "../client"

export const parceriasCampanhasService = {
  async getAll() {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").select("*")

      return { data: data || [], error }
    } catch (error) {
      return { data: [], error }
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").select("*").eq("id", id).single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  async create(parceriaCampanha: any) {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").insert(parceriaCampanha).select().single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  async update(id: string, updates: any) {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").update(updates).eq("id", id).select().single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  async delete(id: string) {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").delete().eq("id", id)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  async exists(parceriaId: string, campanhaId: string) {
    try {
      const { data, error } = await supabase
        .from("parcerias_campanhas")
        .select("id")
        .eq("parceria_id", parceriaId)
        .eq("campanha_id", campanhaId)
        .single()

      return { data: !!data, error }
    } catch (error) {
      return { data: false, error }
    }
  },

  async getStats() {
    try {
      const { data, error } = await supabase.from("parcerias_campanhas").select("status")

      if (error) return { data: { total: 0, active: 0, inactive: 0 }, error }

      const total = data?.length || 0
      const active = data?.filter((item) => item.status === "active").length || 0
      const inactive = total - active

      return { data: { total, active, inactive }, error: null }
    } catch (error) {
      return { data: { total: 0, active: 0, inactive: 0 }, error }
    }
  },
}
