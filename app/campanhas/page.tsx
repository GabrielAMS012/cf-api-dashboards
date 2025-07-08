"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { useCampaignsApi } from "@/lib/hooks/useCampaignsApi"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Megaphone, Search, Filter, Plus, Calendar, Building2, AlertCircle, X } from "lucide-react"
import { useState, useEffect } from "react"

function CampanhasContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [tipoFilter, setTipoFilter] = useState("all")

  const debouncedSearch = useDebounce(searchTerm, 500)
  const { campaigns, loading, error, fetchCampaigns } = useCampaignsApi()

  // Fetch campaigns when filters change
  useEffect(() => {
    fetchCampaigns({
      search: debouncedSearch || undefined,
      status: statusFilter === "all" ? undefined : statusFilter,
      tipo: tipoFilter === "all" ? undefined : tipoFilter,
    })
  }, [debouncedSearch, statusFilter, tipoFilter, fetchCampaigns])

  // Initial fetch
  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const getStatusBadge = (status: string) => {
    const variants = {
      Ativo: "default",
      Inativo: "destructive",
      Finalizado: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setTipoFilter("all")
  }

  // Calculate stats from real data
  const totalCampanhas = campaigns.length
  const campanhasAtivas = campaigns.filter((c) => c.status === "Ativo").length
  const campanhasInativas = campaigns.filter((c) => c.status === "Inativo").length
  const campanhasFinalizadas = campaigns.filter((c) => c.status === "Finalizado").length

  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campanhas</h1>
            <p className="text-gray-600 mt-2">Gestão de Campanhas do Sistema</p>
          </div>
          <Button className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{totalCampanhas}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativas</CardTitle>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold text-green-600">{campanhasAtivas}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inativas</CardTitle>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold text-red-600">{campanhasInativas}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold text-blue-600">{campanhasFinalizadas}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
              {(searchTerm || statusFilter !== "all" || tipoFilter !== "all") && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
                  <X className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por nome ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon" disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Promocional">Promocional</SelectItem>
                  <SelectItem value="Educativa">Educativa</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Ambiental">Ambiental</SelectItem>
                </SelectContent>
              </Select>

              <div className="text-sm text-gray-500 flex items-center">
                {campaigns.length > 0 && `${campaigns.length} resultado(s) encontrado(s)`}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Campanhas</CardTitle>
            <CardDescription>Visualize e gerencie todas as campanhas cadastradas</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-8">
                <Megaphone className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
                <p className="text-gray-500">
                  {campaigns.length === 0
                    ? "Não há campanhas cadastradas no sistema."
                    : "Nenhuma campanha corresponde aos filtros aplicados."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data Início</TableHead>
                    <TableHead>Data Fim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Lojas</TableHead>
                    <TableHead className="text-center">OSCs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campanha) => (
                    <TableRow key={campanha.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{campanha.nome}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{campanha.descricao}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[#f26b26] border-[#f26b26]">
                          {campanha.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{formatDate(campanha.dataInicio)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{formatDate(campanha.dataFim)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(campanha.status)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{campanha.stores.length}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{campanha.oscs.length}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CampanhasPage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#f26b26] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <CampanhasContent />
    </div>
  )
}
