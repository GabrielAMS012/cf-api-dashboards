"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { LoginPage } from "@/components/auth/login-page"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Network, Search, Filter, Plus, Handshake, Megaphone } from "lucide-react"
import { useState } from "react"

function ParceriasCampanhasContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(false)

  // Mock data para demonstração
  const mockParceriasCampanhas = [
    {
      id: 1,
      parceria: "Supermercado Central + Instituto Alimentar",
      campanha: "Natal Solidário 2024",
      tipo: "Arrecadação de Alimentos",
      status: "Ativa",
      dataInicio: "2024-11-01",
      meta: "500 cestas básicas",
      progresso: "65%",
    },
    {
      id: 2,
      parceria: "Padaria do Bairro + Fundação Mesa Brasil",
      campanha: "Páscoa Compartilhada",
      tipo: "Distribuição de Doces",
      status: "Finalizada",
      dataInicio: "2024-03-01",
      meta: "200 kits de Páscoa",
      progresso: "100%",
    },
    {
      id: 3,
      parceria: "Restaurante Popular + ONG Solidária",
      campanha: "Inverno Aquecido",
      tipo: "Refeições Quentes",
      status: "Planejamento",
      dataInicio: "2024-05-01",
      meta: "1000 refeições",
      progresso: "0%",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      Ativa: "default",
      Finalizada: "secondary",
      Planejamento: "outline",
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || "secondary"}>{status}</Badge>
  }

  const getProgressBadge = (progresso: string) => {
    const progress = Number.parseInt(progresso)
    if (progress === 100) return <Badge className="bg-green-100 text-green-800">{progresso}</Badge>
    if (progress >= 50) return <Badge className="bg-yellow-100 text-yellow-800">{progresso}</Badge>
    return <Badge className="bg-gray-100 text-gray-800">{progresso}</Badge>
  }

  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parcerias & Campanhas - Versão Antiga</h1>
            <p className="text-gray-600 mt-2">Gestão de parcerias vinculadas a campanhas</p>
          </div>
          <Button className="bg-[#f26b26] hover:bg-[#e55a1f]">
            <Plus className="mr-2 h-4 w-4" />
            Nova Vinculação
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockParceriasCampanhas.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativas</CardTitle>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockParceriasCampanhas.filter((pc) => pc.status === "Ativa").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {mockParceriasCampanhas.filter((pc) => pc.status === "Finalizada").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Planejamento</CardTitle>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockParceriasCampanhas.filter((pc) => pc.status === "Planejamento").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Buscar por parceria ou campanha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Finalizada">Finalizada</SelectItem>
                  <SelectItem value="Planejamento">Planejamento</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="Arrecadação de Alimentos">Arrecadação de Alimentos</SelectItem>
                  <SelectItem value="Distribuição de Doces">Distribuição de Doces</SelectItem>
                  <SelectItem value="Refeições Quentes">Refeições Quentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Parcerias & Campanhas</CardTitle>
            <CardDescription>Visualize e gerencie todas as vinculações entre parcerias e campanhas</CardDescription>
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
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parceria</TableHead>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Meta</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Data Início</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockParceriasCampanhas.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Handshake className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{item.parceria}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Megaphone className="h-4 w-4 text-orange-600" />
                          <span>{item.campanha}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.tipo}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.meta}</TableCell>
                      <TableCell>{getProgressBadge(item.progresso)}</TableCell>
                      <TableCell>{new Date(item.dataInicio).toLocaleDateString("pt-BR")}</TableCell>
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

export default function ParceriasCampanhasPage() {
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
      <ParceriasCampanhasContent />
    </div>
  )
}
