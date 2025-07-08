export interface Loja {
  id: string
  name: string
  cnpj: string
  estado: string
  status: "ativa" | "inativa" | "em_implantacao" | "pausada"
  endereco?: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface LojaContact {
  id: number
  loja_id: number
  nome: string
  cargo: string
  email: string
  telefone: string
  created_at: string
  updated_at: string
}

export interface OSC {
  id: string
  name: string
  cnpj: string
  responsavel: string
  email: string
  telefone: string
  endereco: string
  status: number
  created_at: string
  updated_at: string
  area_atuacao: string
  parcerias_count: number
}

export interface Parceria {
  id: string
  loja_id: string
  osc_id: string
  status: "ativa" | "inativa" | "pendente"
  data_inicio: string
  data_fim?: string
  observacoes?: string
  created_at: string
  updated_at: string
  loja?: Loja
  osc?: OSC
}

export interface Campanha {
  id: string
  nome: string
  descricao: string
  data_inicio: string
  data_fim: string
  status: "ativa" | "inativa" | "planejada" | "finalizada"
  meta_arrecadacao?: number
  arrecadacao_atual?: number
  created_at: string
  updated_at: string
}

export interface CampanhaLoja {
  id: string
  campanha_id: number
  loja_id: number
}

export interface CampanhaLojaOSC {
  id: string
  campanha_id: number
  loja_id: number
  osc_id: number
  favorita: boolean
}

// Tipo para Parcerias por Campanha
export interface ParceriaCampanha {
  id: string
  parceria_id: string
  campanha_id: string
  status: "ativa" | "inativa"
  created_at: string
  updated_at: string
  parceria?: Parceria
  campanha?: Campanha
}

// Tipos para views com joins
export interface ParceriaCampanhaCompleta extends ParceriaCampanha {
  campanha: Campanha
  loja: Loja
  osc: OSC
}

export interface StoreExternal {
  id: number
  store_code: string
  name: string
  flag: string
  city: string
  neighborhood: string
  uf: string
  full_address: string
  status: number
  partnership_count: number
  updated_at: string
  cnpj?: string
}

export interface ExternalStore {
  id: number
  name: string
  code?: string
  flag: string
  group_email: string
  email: string
  responsable_name: string
  status: 0 | 1
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          name: string
          cnpj: string
          estado: string
          cidade: string
          endereco: string
          status: number
          created_at: string
          updated_at: string
          updated_by?: string
        }
        Insert: {
          id?: string
          name: string
          cnpj: string
          estado: string
          cidade: string
          endereco: string
          status?: number
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string
          estado?: string
          cidade?: string
          endereco?: string
          status?: number
          created_at?: string
          updated_at?: string
          updated_by?: string
        }
      }
      store_contacts: {
        Row: {
          id: string
          store_id: string
          nome: string
          cargo: string
          email: string
          telefone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          nome: string
          cargo: string
          email: string
          telefone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          nome?: string
          cargo?: string
          email?: string
          telefone?: string
          created_at?: string
          updated_at?: string
        }
      }
      loja_contacts: {
        Row: {
          id: number
          loja_id: number
          nome: string
          cargo: string
          email: string
          telefone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          loja_id: number
          nome: string
          cargo: string
          email: string
          telefone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          loja_id?: number
          nome?: string
          cargo?: string
          email?: string
          telefone?: string
          created_at?: string
          updated_at?: string
        }
      }
      oscs: {
        Row: {
          id: string
          name: string
          cnpj: string
          responsavel: string
          email: string
          telefone: string
          endereco: string
          status: number
          created_at: string
          updated_at: string
          area_atuacao: string
          parcerias_count: number
        }
        Insert: {
          id?: string
          name: string
          cnpj: string
          responsavel: string
          email: string
          telefone: string
          endereco: string
          status?: number
          created_at?: string
          updated_at?: string
          area_atuacao?: string
          parcerias_count?: number
        }
        Update: {
          id?: string
          name?: string
          cnpj?: string
          responsavel?: string
          email?: string
          telefone?: string
          endereco?: string
          status?: number
          created_at?: string
          updated_at?: string
          area_atuacao?: string
          parcerias_count?: number
        }
      }
      parcerias: {
        Row: {
          id: string
          loja_id: string
          osc_id: string
          status: string
          data_inicio: string
          data_fim?: string
          observacoes?: string
          created_at: string
          updated_at: string
          loja?: Loja
          osc?: OSC
        }
        Insert: {
          id?: string
          loja_id: string
          osc_id: string
          status?: string
          data_inicio: string
          data_fim?: string
          observacoes?: string
          created_at?: string
          updated_at?: string
          loja?: Loja
          osc?: OSC
        }
        Update: {
          id?: string
          loja_id?: string
          osc_id?: string
          status?: string
          data_inicio?: string
          data_fim?: string
          observacoes?: string
          created_at?: string
          updated_at?: string
          loja?: Loja
          osc?: OSC
        }
      }
      campanhas: {
        Row: {
          id: string
          nome: string
          descricao: string
          data_inicio: string
          data_fim: string
          status: string
          meta_arrecadacao?: number
          arrecadacao_atual?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nome: string
          descricao?: string
          data_inicio: string
          data_fim: string
          status?: string
          meta_arrecadacao?: number
          arrecadacao_atual?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nome?: string
          descricao?: string
          data_inicio?: string
          data_fim?: string
          status?: string
          meta_arrecadacao?: number
          arrecadacao_atual?: number
          created_at?: string
          updated_at?: string
        }
      }
      parcerias_campanhas: {
        Row: {
          id: string
          parceria_id: string
          campanha_id: string
          status: string
          created_at: string
          updated_at: string
          parceria?: Parceria
          campanha?: Campanha
        }
        Insert: {
          id?: string
          parceria_id: string
          campanha_id: string
          status?: string
          created_at?: string
          updated_at?: string
          parceria?: Parceria
          campanha?: Campanha
        }
        Update: {
          id?: string
          parceria_id?: string
          campanha_id?: string
          status?: string
          created_at?: string
          updated_at?: string
          parceria?: Parceria
          campanha?: Campanha
        }
      }
    }
  }
}

export type Store = Database["public"]["Tables"]["stores"]["Row"]
export type StoreContactRow = Database["public"]["Tables"]["store_contacts"]["Row"]
export type LojaContactRow = Database["public"]["Tables"]["loja_contacts"]["Row"]
export type OSCRow = Database["public"]["Tables"]["oscs"]["Row"]
export type ParceriaRow = Database["public"]["Tables"]["parcerias"]["Row"]
export type CampanhaRow = Database["public"]["Tables"]["campanhas"]["Row"]
export type ParceriaCampanhaRow = Database["public"]["Tables"]["parcerias_campanhas"]["Row"]
