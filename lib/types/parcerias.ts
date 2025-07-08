export type OSC = {
  id: number
  name: string
  cnpj: string
  email: string
  responsable_name: string
  city: string
  state: string
  is_active: boolean
  is_favorite: boolean
  partnership_active: boolean
}

export type Store = {
  id: number
  code: string
  name: string
  city: string
  state: string
  cnpj: string
  osc_count: number
  osc_active_count: number
  oscs?: OSC[]
}
