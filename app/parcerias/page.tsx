"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePartnershipsApi } from "@/lib/hooks/usePartnershipsApi"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Plus, Search, Filter } from "lucide-react"

interface Partnership {
  id: number
  osc: string
  loja: string
  dataInicio: string
  dataVencimento: string
  status: string
  campanhas: number
  storeId: number
  oscId: number
}

function ParceriasContent() {
  const router = useRouter()
  const { partnerships, loading, error, fetchPartnerships, updatePartnership } = usePartnershipsApi()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filteredPartnerships, setFilteredPartnerships] = useState<Partnership[]>([])

  useEffect(() => {
    fetchPartnerships()
  }, [fetchPartnerships])

  useEffect(() => {
    let filtered = partnerships

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (parceria) =>
          parceria.osc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parceria.loja.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((parceria) => parceria.status.toLowerCase() === statusFilter)
    }

    setFilteredPartnerships(filtered)
  }, [partnerships, searchTerm, statusFilter])

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("pt-BR")
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      ativa: "default",
      inativa: "destructive",
      pendente: "outline",
    } as const

    return (
      <Badge variant={variants[status.toLowerCase() as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getStatusButtonVariant = (status: string) => {
    const variants = {
      ativa: "default",
      inativa: "destructive",
      pendente: "outline",
    } as const

    return variants[status.toLowerCase() as keyof typeof variants] || "secondary"
  }

  const handleStatusToggle = async (partnership: Partnership) => {
    const currentStatus = partnership.status.toLowerCase()

    // Only allow toggle between "ativa" and "inativa"
    if (currentStatus !== "ativa" && currentStatus !== "inativa") {
      return
    }

    const newStatus = currentStatus === "ativa" ? "inativa" : "ativa"

    try {
      await updatePartnership(partnership.id, {
        status: newStatus,
        storeId: partnership.storeId,
        oscId: partnership.oscId,
      })
      // Refresh the partnerships list
      fetchPartnerships()
    } catch (error) {
      console.error("Error updating partnership status:", error)
    }
  }

  const handleNewPartnership = () => {
    router.push("/parcerias/add")
  }

  // Calculate stats
  const parceriasAtivas = partnerships.filter((p) => p.status.toLowerCase() === "ativa").length
  const parceriasInativas = partnerships.filter((p) => p.status.toLowerCase() === "inativa").length
  const parceriasPendentes = partnerships.filter((p) => p.status.toLowerCase() === "pendente").length
  const totalParcerias = partnerships.length

  if (error) {
    return (
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar parcerias: {error}</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parcerias</h1>
            <p className="text-muted-foreground mt-2">Gerencie as parcerias entre OSCs, lojas e campanhas</p>
          </div>
          <Button onClick={handleNewPartnership} className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Parceria
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="h-4 w-4 rounded-full bg-blue-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParcerias}</div>
              <p className="text-xs text-blue-600">Parcerias cadastradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativas</CardTitle>
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parceriasAtivas}</div>
              <p className="text-xs text-green-600">Em funcionamento</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativas</CardTitle>
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parceriasInativas}</div>
              <p className="text-xs text-red-600">Desativadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parceriasPendentes}</div>
              <p className="text-xs text-yellow-600">Aguardando aprovação</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por OSC ou loja..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="ativa">Ativa</SelectItem>
                    <SelectItem value="inativa">Inativa</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OSC</TableHead>
                  <TableHead>Loja</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#f26b26] border-t-transparent rounded-full animate-spin mr-2"></div>
                        Carregando parcerias...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredPartnerships.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {partnerships.length === 0
                        ? "Nenhuma parceria encontrada"
                        : "Nenhuma parceria corresponde aos filtros aplicados"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPartnerships.map((parceria) => (
                    <TableRow key={parceria.id}>
                      <TableCell className="font-medium">{parceria.osc}</TableCell>
                      <TableCell>{parceria.loja}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(parceria.dataInicio)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{formatDate(parceria.dataVencimento)}</TableCell>
                      <TableCell>{getStatusBadge(parceria.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">#{parceria.campanhas}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={getStatusButtonVariant(parceria.status)}
                          size="sm"
                          onClick={() => handleStatusToggle(parceria)}
                          disabled={
                            loading ||
                            (parceria.status.toLowerCase() !== "ativa" && parceria.status.toLowerCase() !== "inativa")
                          }
                        >
                          {parceria.status.toLowerCase() === "ativa" ? "Desativar" : "Ativar"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ParceriasPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppSidebar />
        <ParceriasContent />
      </div>
    </AuthProvider>
  )
}
