"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateParceriaCampanhaModal } from "@/components/create-parceria-campanha-modal"
import {
  Calendar,
  MapPin,
  Building,
  Users,
  CheckCircle,
  Clock,
  Handshake,
  Plus,
  Loader2,
  Search,
  Filter,
  User,
} from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"
import type { ParceriaCampanhaCompleta } from "@/lib/supabase/types"

// Mock data for development
const mockParcerias: ParceriaCampanhaCompleta[] = [
  {
    id: "1",
    campanha_id: "1",
    loja_id: "1",
    osc_id: "1",
    data_inicio: "2024-02-01",
    data_fim: "2024-11-30",
    status: "Ativa",
    created_at: "2024-02-01T00:00:00Z",
    campanha: {
      id: "1",
      nome: "Campanha Solidária 2024",
      criador: "Maria Silva",
      data_inicio: "2024-01-01",
      data_fim: "2024-12-31",
      created_at: "2024-01-01T00:00:00Z",
    },
    loja: {
      id: "1",
      codigo: "001",
      nome: "Supermercado Central",
      cidade: "São Paulo",
      uf: "SP",
      status: true,
      created_at: "2024-01-01T00:00:00Z",
    },
    osc: {
      id: "1",
      nome: "Instituto Alimentar Solidário",
      cnpj: "12.345.678/0001-90",
      responsavel: "Maria Silva Santos",
      cidade: "São Paulo",
      uf: "SP",
      status: true,
      created_at: "2024-01-01T00:00:00Z",
    },
  },
]

interface CampanhaDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  campanha: any
  onRefresh?: () => void
}

export function CampanhaDetailsModal({ isOpen, onClose, campanha, onRefresh }: CampanhaDetailsModalProps) {
  const [parcerias, setParcerias] = useState<ParceriaCampanhaCompleta[]>([])
  const [loading, setLoading] = useState(false)
  const [createParceriaModalOpen, setCreateParceriaModalOpen] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "Ativa" | "Concluída">("all")
  const [sortBy, setSortBy] = useState<"loja" | "osc" | "data_inicio" | "data_fim">("data_inicio")

  useEffect(() => {
    if (isOpen && campanha) {
      fetchParcerias()
    }
  }, [isOpen, campanha])

  const fetchParcerias = async () => {
    if (!campanha) return

    try {
      setLoading(true)

      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured) {
        console.warn("Using mock data - Supabase not configured")
        setParcerias(mockParcerias.filter((p) => p.campanha_id === campanha.id))
        return
      }

      const { data, error } = await supabase
        .from("parcerias_campanhas")
        .select(`
          *,
          loja:lojas (*),
          osc:oscs (*)
        `)
        .eq("campanha_id", campanha.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setParcerias(data as ParceriaCampanhaCompleta[])
    } catch (err) {
      console.error("Error fetching parcerias:", err)
      // Fallback to mock data on error
      setParcerias(mockParcerias.filter((p) => p.campanha_id === campanha.id))
    } finally {
      setLoading(false)
    }
  }

  const handleCreateParceria = async () => {
    await fetchParcerias()
    if (onRefresh) onRefresh()
  }

  // Filtrar e ordenar parcerias
  const filteredAndSortedParcerias = parcerias
    .filter((parceria) => {
      // Filtro por texto
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const searchNumbers = searchTerm.replace(/\D/g, "")

        const lojaMatch = parceria.loja.nome.toLowerCase().includes(searchLower)
        const oscMatch = parceria.osc.nome.toLowerCase().includes(searchLower)
        const cnpjNumbers = parceria.osc.cnpj.replace(/\D/g, "")
        const cnpjMatch = searchNumbers.length >= 3 && cnpjNumbers.includes(searchNumbers)

        if (!lojaMatch && !oscMatch && !cnpjMatch) return false
      }

      // Filtro por status
      if (statusFilter !== "all" && parceria.status !== statusFilter) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "loja":
          return a.loja.nome.localeCompare(b.loja.nome)
        case "osc":
          return a.osc.nome.localeCompare(b.osc.nome)
        case "data_inicio":
          return new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime()
        case "data_fim":
          return new Date(b.data_fim).getTime() - new Date(a.data_fim).getTime()
        default:
          return 0
      }
    })

  if (!campanha) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const getStatusIcon = (status: string) => {
    return status === "Ativa" ? (
      <Clock className="w-4 h-4 text-green-600" />
    ) : (
      <CheckCircle className="w-4 h-4 text-gray-600" />
    )
  }

  const getStatusColor = (status: string) => {
    return status === "Ativa" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const getCampanhaStatus = () => {
    if (!campanha.data_fim) return "Ativa"
    const hoje = new Date()
    const fim = new Date(campanha.data_fim)
    return fim < hoje ? "Concluída" : "Ativa"
  }

  const parceriasAtivas = parcerias.filter((p) => p.status === "Ativa").length
  const parceriasConcluidas = parcerias.filter((p) => p.status === "Concluída").length
  const campanhaStatus = getCampanhaStatus()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#E8772E]" />
              <span>Detalhes da Campanha</span>
            </DialogTitle>
            <DialogDescription>Visualize e gerencie todas as parcerias desta campanha</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Campaign Info */}
            <div className="bg-gradient-to-r from-[#E8772E] to-[#d16b26] text-white p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{campanha.nome}</h2>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Criador: {campanha.criador}</span>
                    </div>
                  </div>
                  {campanha.descricao && <p className="text-orange-100 mb-4">{campanha.descricao}</p>}
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Início: {formatDate(campanha.data_inicio)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Fim: {formatDate(campanha.data_fim)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(campanhaStatus)}
                  <Badge
                    className={`${getStatusColor(campanhaStatus)} border-white`}
                    variant={campanhaStatus === "Ativa" ? "default" : "secondary"}
                  >
                    {campanhaStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de Parcerias</p>
                    <p className="text-2xl font-bold text-gray-900">{parcerias.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Parcerias Ativas</p>
                    <p className="text-2xl font-bold text-green-600">{parceriasAtivas}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Parcerias Concluídas</p>
                    <p className="text-2xl font-bold text-gray-600">{parceriasConcluidas}</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Buscar por loja, OSC ou CNPJ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="Ativa">Ativas</SelectItem>
                      <SelectItem value="Concluída">Concluídas</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="data_inicio">Data de Início</SelectItem>
                      <SelectItem value="data_fim">Data de Fim</SelectItem>
                      <SelectItem value="loja">Nome da Loja</SelectItem>
                      <SelectItem value="osc">Nome da OSC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => setCreateParceriaModalOpen(true)}
                  className="bg-[#E8772E] hover:bg-[#d16b26] w-full sm:w-auto"
                  disabled={campanhaStatus === "Concluída"}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Parceria
                </Button>
              </div>

              {/* Results Count */}
              {(searchTerm || statusFilter !== "all") && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Mostrando {filteredAndSortedParcerias.length} de {parcerias.length} parcerias
                    {searchTerm && <span className="font-medium"> para "{searchTerm}"</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Parcerias Table */}
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
                <p className="text-gray-500">Carregando parcerias...</p>
              </div>
            ) : filteredAndSortedParcerias.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 mb-2">
                  {parcerias.length === 0
                    ? "Nenhuma parceria cadastrada para esta campanha"
                    : "Nenhuma parceria encontrada com os filtros aplicados"}
                </p>
                <p className="text-sm text-gray-400">
                  {parcerias.length === 0
                    ? "Clique em 'Adicionar Parceria' para começar"
                    : "Tente ajustar os filtros de busca"}
                </p>
              </div>
            ) : (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Loja</TableHead>
                        <TableHead className="font-semibold text-gray-700">OSC</TableHead>
                        <TableHead className="font-semibold text-gray-700">CNPJ</TableHead>
                        <TableHead className="font-semibold text-gray-700">Data Início</TableHead>
                        <TableHead className="font-semibold text-gray-700">Data Fim</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedParcerias.map((parceria, index) => (
                        <TableRow
                          key={parceria.id}
                          className={`
                            ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                            ${parceria.status === "Concluída" ? "opacity-75" : ""}
                          `}
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{parceria.loja.nome}</div>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="font-mono">Cód: {parceria.loja.codigo}</span>
                                {parceria.loja.cidade && parceria.loja.uf && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {parceria.loja.cidade}, {parceria.loja.uf}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium text-gray-900">{parceria.osc.nome}</div>
                              <div className="text-xs text-gray-500">
                                {parceria.osc.responsavel && (
                                  <div className="flex items-center space-x-1 mb-1">
                                    <Users className="w-3 h-3" />
                                    <span>{parceria.osc.responsavel}</span>
                                  </div>
                                )}
                                {parceria.osc.cidade && parceria.osc.uf && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>
                                      {parceria.osc.cidade}, {parceria.osc.uf}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="font-mono text-sm text-gray-600">{formatCNPJ(parceria.osc.cnpj)}</span>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{formatDate(parceria.data_inicio)}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600">{formatDate(parceria.data_fim)}</span>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex items-center justify-center space-x-2">
                              {getStatusIcon(parceria.status)}
                              <Badge className={getStatusColor(parceria.status)} variant="secondary">
                                {parceria.status}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Parceria Modal */}
      <CreateParceriaCampanhaModal
        isOpen={createParceriaModalOpen}
        onClose={() => setCreateParceriaModalOpen(false)}
        onConfirm={handleCreateParceria}
        campanha={campanha}
      />
    </>
  )
}
