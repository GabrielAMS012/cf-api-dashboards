"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Eye, CheckCircle, Clock, Loader2, Megaphone, User } from "lucide-react"
import type { Campanha } from "@/lib/supabase/types"

interface CampanhasTableProps {
  campanhas: Campanha[]
  onViewDetails: (campanha: Campanha) => void
  loading?: boolean
}

export function CampanhasTable({ campanhas, onViewDetails, loading }: CampanhasTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getCampanhaStatus = (dataFim: string) => {
    const hoje = new Date()
    const fim = new Date(dataFim)
    return fim < hoje ? "Concluída" : "Ativa"
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

  const getDaysRemaining = (dataFim: string) => {
    const hoje = new Date()
    const fim = new Date(dataFim)
    const diffTime = fim.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando campanhas...</h3>
          <p className="text-gray-500">Aguarde enquanto buscamos os dados.</p>
        </div>
      </div>
    )
  }

  if (campanhas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <Megaphone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma campanha encontrada</h3>
          <p className="text-gray-500">Não há campanhas que correspondam aos filtros aplicados.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 min-w-[250px]">Nome da Campanha</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Criador</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Data Início</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Data Fim</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campanhas.map((campanha, index) => {
              const status = getCampanhaStatus(campanha.data_fim)
              const isConcluida = status === "Concluída"
              const daysRemaining = getDaysRemaining(campanha.data_fim)

              return (
                <TableRow
                  key={campanha.id}
                  className={`
                    ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                    ${isConcluida ? "opacity-75" : ""}
                    hover:bg-blue-50 transition-colors cursor-pointer
                  `}
                  onClick={() => onViewDetails(campanha)}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className={`font-medium ${isConcluida ? "text-gray-600" : "text-gray-900"}`}>
                        {campanha.nome}
                      </div>
                      {campanha.descricao && (
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{campanha.descricao}</div>
                      )}
                      {status === "Ativa" && daysRemaining <= 7 && daysRemaining > 0 && (
                        <div className="text-xs text-amber-600 font-medium">
                          ⚠️ Termina em {daysRemaining} dia{daysRemaining !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className={isConcluida ? "text-gray-500" : "text-gray-700"}>{campanha.criador}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className={isConcluida ? "text-gray-500" : "text-gray-600"}>
                        {formatDate(campanha.data_inicio)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center space-x-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className={isConcluida ? "text-gray-500" : "text-gray-600"}>
                        {formatDate(campanha.data_fim)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {getStatusIcon(status)}
                      <Badge className={getStatusColor(status)} variant="secondary">
                        {status}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDetails(campanha)
                      }}
                      title="Ver detalhes da campanha"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
