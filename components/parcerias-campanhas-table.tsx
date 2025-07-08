"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Building, Users, Eye, CheckCircle, Clock, Loader2 } from "lucide-react"
import type { ParceriaCampanhaCompleta } from "@/lib/supabase/types"

interface ParceriasCampanhasTableProps {
  parcerias: ParceriaCampanhaCompleta[]
  onViewCampanhaDetails: (campanha: any) => void
  loading?: boolean
}

export function ParceriasCampanhasTable({ parcerias, onViewCampanhaDetails, loading }: ParceriasCampanhasTableProps) {
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Carregando parcerias...</h3>
          <p className="text-gray-500">Aguarde enquanto buscamos os dados.</p>
        </div>
      </div>
    )
  }

  if (parcerias.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="text-center py-12">
          <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma parceria encontrada</h3>
          <p className="text-gray-500">Não há parcerias que correspondam aos filtros aplicados.</p>
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
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">Campanha</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[180px]">Loja</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">OSC</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[140px]">CNPJ</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Data Início</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Data Fim</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcerias.map((parceria, index) => (
              <TableRow
                key={parceria.id}
                className={`
                  ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  ${parceria.status === "Concluída" ? "opacity-75" : ""}
                  hover:bg-blue-50 transition-colors
                `}
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900">{parceria.campanha.nome}</div>
                    {parceria.campanha.data_inicio && parceria.campanha.data_fim && (
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {formatDate(parceria.campanha.data_inicio)} - {formatDate(parceria.campanha.data_fim)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>

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

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
                    onClick={() => onViewCampanhaDetails(parceria.campanha)}
                    title="Ver detalhes da campanha"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
