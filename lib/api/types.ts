// Tipos para as APIs
export interface Store {
  id: number
  codigo: string
  loja: string
  bandeira: string
  parcerias: number
  cidade: string
  uf: string
  bairro: string
  cep?: string
  endereco?: string
  telefone?: string
  email?: string
  inauguracao: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Regional {
  id: number
  nome: string
  codigo: string
  estados: string[]
  responsavel: string
  email: string
  telefone: string
  status: "Ativo" | "Inativo"
  createdAt: string
  updatedAt: string
}

export interface OSC {
  id: number
  nome: string
  cnpj: string
  tipo: string
  cidade: string
  uf: string
  responsavel: string
  email: string
  telefone: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Partnership {
  id: number
  storeId: number
  oscId: number
  tipo: string
  dataInicio: string
  dataFim?: string
  status: "Ativo" | "Inativo" | "Finalizado"
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface Campaign {
  id: number
  nome: string
  descricao: string
  dataInicio: string
  dataFim: string
  tipo: string
  status: "Ativo" | "Inativo" | "Finalizado"
  stores: number[]
  oscs: number[]
  createdAt: string
  updatedAt: string
}

export interface StatusChangeLog {
  id: number
  entityType: "store" | "regional" | "osc" | "partnership" | "campaign"
  entityId: number
  statusAnterior: string
  statusNovo: string
  responsavel: string
  descricao: string
  createdAt: string
}

// Tipos para formulários
export interface CreateStoreData {
  codigo: string
  loja: string
  bandeira: string
  cidade: string
  uf: string
  bairro: string
  cep?: string
  endereco?: string
  telefone?: string
  email?: string
  inauguracao: string
  status: "Ativo" | "Inativo" | "Pendente"
}

export interface UpdateStoreData extends Partial<CreateStoreData> {
  id: number
}

export interface StatusChangeData {
  entityType: "store" | "regional" | "osc" | "partnership" | "campaign"
  entityId: number
  novoStatus: string
  responsavel: string
  descricao: string
}
