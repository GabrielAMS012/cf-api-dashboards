export interface Loja {
  id: number
  nome: string
  cnpj: string
  endereco: {
    rua: string
    numero: string
    bairro: string
    cidade: string
    estado: string
    cep: string
  }
  contato: {
    telefone: string
    email: string
    responsavel: string
  }
  tipo: string
  status: "Ativa" | "Inativa" | "Pendente"
  created_at: string
  updated_at: string
}

export interface LojaFilters {
  search?: string
  estado?: string
  status?: string
  tipo?: string
}

export interface LojaPagination {
  count: number
  next: string | null
  previous: string | null
  currentPage: number
  totalPages: number
}
