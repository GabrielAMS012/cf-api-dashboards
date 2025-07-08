// Tipos para as novas APIs
export interface Regional {
  id: number
  name: string
  flag: string
  email_regional: string
  assistant_regional: string
  status: boolean
}

export interface OSC {
  id: number
  name: string
  cnpj: string
  city: string
  uf: string
  status: boolean
  partnership_count: number
  is_favorite?: boolean
}

export interface Partnership {
  id: number
  status: number
  is_favorite: boolean
  campaign: number
  store: {
    store_code: number
    name: string
    flag: string
  }
  osc: {
    cnpj: string
    name: string
  }
}

export interface Campaign {
  id: number
  name: string
  goal_tons: number
  collected_tons: number
  started_at: string
  status: "completed" | "pending"
}

export interface Contact {
  id: number
  responsable_name: string
  phone: string
  email: string | null
  active: boolean
  is_etl: boolean
  regional: number
}

export interface Store {
  id: number
  store_code: number
  name: string
  flag: string
  city: string
  neighborhood: string
  uf: string
  status: number
  partnership_count: number
  regional: number
}
