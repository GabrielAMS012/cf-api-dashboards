export interface Loja {
  id: number
  codigo: string
  nome: string
  bandeira: string
  cnpj: string
  cidade: string
  uf: string
  bairro: string
  endereco: string
  telefone: string
  email: string
  status: 0 | 1
  inauguracao: string
  parcerias: number
  createdAt: string
  updatedAt: string
}
