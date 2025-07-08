"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Filter, Users, MapPin, Phone, Mail, Eye, Pen, Plus } from "lucide-react"
import { useOSCApi } from "@/lib/hooks/use-osc-api"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useRouter } from "next/navigation"


export function OSCsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ufFilter, setUfFilter] = useState("all")
  const [selectedOSC, setSelectedOSC] = useState<any>(null)

  const debouncedSearch = useDebounce(searchTerm, 300)
  const { oscs, loading, fetchOSCs, changeStatus } = useOSCApi()
  const router = useRouter()

  React.useEffect(() => {
    fetchOSCs(1, {
      search: debouncedSearch,
      status: statusFilter === "all" ? undefined : statusFilter,
      uf: ufFilter === "all" ? undefined : ufFilter,
    })
  }, [debouncedSearch, statusFilter, ufFilter, fetchOSCs])

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
  }

  const oscStatusEnum = ["inativo", "ativo", "pendente"]
  const totalOSCs = oscs.length
  const activeOSCs = oscs.filter((osc) => oscStatusEnum[osc.status] === "ativo").length
  const inactiveOSCs = totalOSCs - activeOSCs
  const uniqueStates = [...new Set(oscs.map((osc) => osc.uf))].length


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">OSCs</h1>
            <p className="text-muted-foreground">Gerenciamento de Organizações da Sociedade Civil</p>
        </div>
        <Button className="bg-[#f26b26] hover:bg-[#e55a1f]" onClick={() => {router.push("oscs/add")}}>
            <Plus className="mr-2 h-4 w-4" />
            Nova OSC
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de OSCs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOSCs}</div>
            <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OSCs Ativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOSCs}</div>
            <p className="text-xs text-muted-foreground">
              {totalOSCs > 0 ? Math.round((activeOSCs / totalOSCs) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OSCs Inativas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveOSCs}</div>
            <p className="text-xs text-muted-foreground">
              {totalOSCs > 0 ? Math.round((inactiveOSCs / totalOSCs) * 100) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estados</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueStates}</div>
            <p className="text-xs text-muted-foreground">Com OSCs cadastradas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CNPJ..."
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ufFilter} onValueChange={setUfFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado (UF)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* OSCs Grid */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando OSCs...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {oscs.map((osc) => (
            <Card key={osc.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{osc.name}</CardTitle>
                    <CardDescription>{osc.tipo}</CardDescription>
                  </div>
                  <Badge variant={oscStatusEnum[osc.status] === "ativo" ? "default" : "secondary"}>
                    {oscStatusEnum[osc.status] === "ativo" ? "Ativo" : oscStatusEnum[osc.status] === "inativo" ? "Inativo" : "Pendente"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{formatCNPJ(osc.cnpj)}</span>
                  </div>
                  {osc.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{formatPhone(osc.phone)}</span>
                    </div>
                  )}
                  {osc.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{osc.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {osc.full_address}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => setSelectedOSC(osc)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent mt-2"
                        onClick={() => changeStatus(osc)}
                      >
                        <Pen className="h-4 w-4 mr-2" />
                        Alterar Status
                      </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{selectedOSC?.name}</DialogTitle>
                        <DialogDescription>Detalhes da OSC</DialogDescription>
                      </DialogHeader>
                      {selectedOSC && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">CNPJ</label>
                              <p className="text-sm text-muted-foreground font-mono">{formatCNPJ(selectedOSC.cnpj)}</p>
                            </div>
                          </div>
                          {(selectedOSC.phone || selectedOSC.email) && (
                            <div className="grid grid-cols-2 gap-4">
                              {selectedOSC.phone && (
                                <div>
                                  <label className="text-sm font-medium">phone</label>
                                  <p className="text-sm text-muted-foreground">{formatPhone(selectedOSC.phone)}</p>
                                </div>
                              )}
                              {selectedOSC.email && (
                                <div>
                                  <label className="text-sm font-medium">Email</label>
                                  <p className="text-sm text-muted-foreground">{selectedOSC.email}</p>
                                </div>
                              )}
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium">Endereço</label>
                            <p className="text-sm text-muted-foreground">{selectedOSC.full_address}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Cidade</label>
                              <p className="text-sm text-muted-foreground">{selectedOSC.city}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">UF</label>
                              <p className="text-sm text-muted-foreground">{selectedOSC.uf}</p>
                            </div>
                          </div>
                          {selectedOSC.responsable_name && (
                            <div>
                              <label className="text-sm font-medium">Responsável</label>
                              <p className="text-sm text-muted-foreground">{selectedOSC.responsable_name}</p>
                            </div>
                          )}
                          {selectedOSC.descricao && (
                            <div>
                              <label className="text-sm font-medium">Descrição</label>
                              <p className="text-sm text-muted-foreground">{selectedOSC.descricao}</p>
                            </div>
                          )}
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <div className="mt-1">
                                <Badge variant={oscStatusEnum[osc.status] === "ativo" ? "default" : "secondary"}>
                                    {oscStatusEnum[osc.status] === "ativo" ? "Ativo" : oscStatusEnum[osc.status] === "inativo" ? "Inativo" : "Pendente"}
                                </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && oscs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma OSC encontrada</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros para encontrar OSCs.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
