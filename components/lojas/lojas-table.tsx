"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { StoreStatusDropdown } from "@/components/ui/store-status-dropdown"

// Mock data
const mockLojas = [
  {
    id: 1,
    name: "Supermercado Central",
    cnpj: "12.345.678/0001-90",
    estado: "SP",
    cidade: "São Paulo",
    status: 1,
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Padaria do Bairro",
    cnpj: "98.765.432/0001-10",
    estado: "RJ",
    cidade: "Rio de Janeiro",
    status: 1,
    updatedAt: "2024-01-14T15:45:00Z",
  },
  {
    id: 3,
    name: "Mercado Popular",
    cnpj: "11.222.333/0001-44",
    estado: "MG",
    cidade: "Belo Horizonte",
    status: 0,
    updatedAt: "2024-01-13T09:20:00Z",
  },
  {
    id: 4,
    name: "Açougue Premium",
    cnpj: "55.666.777/0001-88",
    estado: "RS",
    cidade: "Porto Alegre",
    status: 1,
    updatedAt: "2024-01-12T14:10:00Z",
  },
  {
    id: 5,
    name: "Hortifruti Orgânico",
    cnpj: "99.888.777/0001-66",
    estado: "PR",
    cidade: "Curitiba",
    status: 1,
    updatedAt: "2024-01-11T11:55:00Z",
  },
]

export function LojasTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showOnlyActive, setShowOnlyActive] = useState(false)

  const filteredLojas = mockLojas.filter((loja) => {
    const matchesSearch =
      loja.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loja.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loja.cnpj.includes(searchTerm)

    const matchesStatus = !showOnlyActive || loja.status === 1

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, cidade ou CNPJ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showOnlyActive"
            checked={showOnlyActive}
            onChange={(e) => setShowOnlyActive(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="showOnlyActive" className="text-sm">
            Exibir apenas ativas
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLojas.map((loja) => (
              <TableRow key={loja.id}>
                <TableCell className="font-medium">{loja.id}</TableCell>
                <TableCell>{loja.name}</TableCell>
                <TableCell>{loja.cnpj}</TableCell>
                <TableCell>{loja.estado}</TableCell>
                <TableCell>{loja.cidade}</TableCell>
                <TableCell>
                  <StoreStatusDropdown storeId={loja.id} storeName={loja.name} currentStatus={loja.status} />
                </TableCell>
                <TableCell>{formatDate(loja.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Link href={`/lojas/${loja.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/lojas/${loja.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLojas.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhuma loja encontrada com os filtros aplicados.</div>
      )}
    </div>
  )
}
