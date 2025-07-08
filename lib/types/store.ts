export interface Store {
  id: number
  store_code: number
  name: string
  city: string | null
  uf: string | null
  flag: string | null
  status: 0 | 1
  created_at: string
  updated_at: string
}

export interface StoreFilters {
  search: string
  status: "all" | "active" | "inactive"
  uf: string
  flag: string
}

export interface StoreStats {
  total: number
  active: number
  inactive: number
  states: number
}
