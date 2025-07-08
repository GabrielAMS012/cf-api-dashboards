export interface OSC {
  id: number
  nome: string
  cnpj: string
  telefone?: string
  email?: string
  endereco: string
  cidade: string
  uf: string
  cep?: string
  responsavel?: string
  descricao?: string
  tipo: string
  status: "ativo" | "inativo" | "pendente"
  data_cadastro?: string
  data_atualizacao?: string
  parcerias?: number
  data_parceria?: string
}

export interface OSCFilters {
  search?: string
  status?: string
  uf?: string
  tipo?: string
}

export interface OSCStats {
  total: number
  ativas: number
  inativas: number
  pendentes: number
  percentualAtivas: number
  percentualInativas: number
  estados: number
}

export interface OSCApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: OSC[]
}

export interface OSCPagination {
  currentPage: number
  totalPages: number
  count: number
  next: string | null
  previous: string | null
}
