export interface StoreExternal {
  id: number
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  manager: string
  status: "active" | "inactive" | "pending"
  type: string
  createdAt: string
  updatedAt: string
}

export interface StoreExternalFilters {
  search?: string
  status?: string
  state?: string
  type?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
