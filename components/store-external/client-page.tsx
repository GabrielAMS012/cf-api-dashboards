"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Eye, Edit, Trash, Plus } from "lucide-react"

// Mock data para demonstração
const mockStores = [
  {
    id: 1,
    name: "Supermercado Central",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    phone: "(11) 99999-9999",
    email: "contato@central.com.br",
    manager: "João Silva",
    status: "active" as const,
    type: "Supermercado",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: 2,
    name: "Mercado do Bairro",
    address: "Av. Principal, 456",
    city: "Rio de Janeiro",
    state: "RJ",
    zipCode: "20000-000",
    phone: "(21) 88888-8888",
    email: "mercado@bairro.com.br",
    manager: "Maria Santos",
    status: "active" as const,
    type: "Mercado",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
  },
  {
    id: 3,
    name: "Atacadão Norte",
    address: "Rod. Norte, 789",
    city: "Belo Horizonte",
    state: "MG",
    zipCode: "30000-000",
    phone: "(31) 77777-7777",
    email: "atacadao@norte.com.br",
    manager: "Pedro Costa",
    status: "inactive" as const,
    type: "Atacado",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-15",
  },
  {
    id: 4,
    name: "Loja Conveniência 24h",
    address: "Rua da Esquina, 321",
    city: "Porto Alegre",
    state: "RS",
    zipCode: "90000-000",
    phone: "(51) 66666-6666",
    email: "conveniencia@24h.com.br",
    manager: "Ana Oliveira",
    status: "pending" as const,
    type: "Conveniência",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-22",
  },
  {
    id: 5,
    name: "Hipermercado Sul",
    address: "Av. Sul, 987",
    city: "Curitiba",
    state: "PR",
    zipCode: "80000-000",
    phone: "(41) 55555-5555",
    email: "hiper@sul.com.br",
    manager: "Carlos Ferreira",
    status: "active" as const,
    type: "Hipermercado",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
  },
]

export function StoreExternalClientPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("all")
  const [selectedStore, setSelectedStore] = useState<(typeof mockStores)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filtrar dados localmente
  const filteredStores = mockStores.filter((store) => {
    const matchesSearch =
      searchTerm === "" ||
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.manager.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || store.status === statusFilter
    const matchesState = stateFilter === "all" || store.state === stateFilter

    return matchesSearch && matchesStatus && matchesState
  })

  const handleViewDetails = (store: (typeof mockStores)[0]) => {
    setSelectedStore(store)
    setIsModalOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativa</Badge>
      case "inactive":
        return <Badge variant="secondary">Inativa</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  // Estatísticas
  const totalStores = mockStores.length
  const activeStores = mockStores.filter((store) => store.status === "active").length
  const inactiveStores = mockStores.filter((store) => store.status === "inactive").length
  const pendingStores = mockStores.filter((store) => store.status === "pending").length

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lojas Externas</h1>
            <p className="text-gray-600">Visualize e gerencie lojas externas cadastradas</p>
          </div>
          <Button className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Loja Externa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Lojas</p>
                <p className="text-2xl font-bold">{totalStores}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lojas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{activeStores}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Lojas Inativas</p>
                <p className="text-2xl font-bold text-red-600">{inactiveStores}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingStores}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar lojas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Inativa</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setStateFilter("all")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{store.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{store.type}</p>
                  {getStatusBadge(store.status)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="font-medium w-16">Local:</span>
                  <span className="text-gray-600">
                    {store.city}, {store.state}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-16">Gestor:</span>
                  <span className="text-gray-600">{store.manager}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-16">Telefone:</span>
                  <span className="text-gray-600">{store.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="font-medium w-16">Cadastro:</span>
                  <span className="text-gray-600">{formatDate(store.createdAt)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(store)} className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredStores.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma loja encontrada</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Não encontramos lojas que correspondam aos filtros aplicados. Tente ajustar os critérios de busca.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Store Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedStore?.name}
              {selectedStore && getStatusBadge(selectedStore.status)}
            </DialogTitle>
            <DialogDescription>Detalhes completos da loja externa</DialogDescription>
          </DialogHeader>

          {selectedStore && (
            <div className="grid gap-6">
              {/* Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nome</label>
                    <p className="text-sm">{selectedStore.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                    <p className="text-sm">{selectedStore.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                    <p className="text-sm">{selectedStore.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                    <p className="text-sm">{selectedStore.email}</p>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                    <p className="text-sm">{selectedStore.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                    <p className="text-sm">{selectedStore.city}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <p className="text-sm">{selectedStore.state}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">CEP</label>
                    <p className="text-sm">{selectedStore.zipCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gestor</label>
                    <p className="text-sm">{selectedStore.manager}</p>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Informações Adicionais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                    <p className="text-sm">{formatDate(selectedStore.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                    <p className="text-sm">{formatDate(selectedStore.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
