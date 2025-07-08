"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { User, Calendar } from "lucide-react"
import Link from "next/link"

interface OSC {
  id: number
  nome: string
  cnpj: string
  responsavel: string
  parcerias: number
  email: string
  bairro: string
  cidade: string
  uf: string
  ipaCode: string
  vencimento: string
  inicioParceria: string
  status: string
}

interface OSCsTableProps {
  oscs: OSC[]
  onStatusChange: (oscId: number, currentStatus: string) => void
}

export function OSCsTable({ oscs, onStatusChange }: OSCsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ativo":
        return "bg-green-100 text-green-800"
      case "inativo":
        return "bg-red-100 text-red-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  const isVencimentoProximo = (vencimento: string) => {
    const hoje = new Date()
    const dataVencimento = new Date(vencimento)
    const diasRestantes = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diasRestantes <= 30 && diasRestantes > 0
  }

  const isVencido = (vencimento: string) => {
    const hoje = new Date()
    const dataVencimento = new Date(vencimento)
    return dataVencimento < hoje
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">Nome</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[140px]">CNPJ</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[150px]">Responsável</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">#Parcerias</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[200px]">Email</TableHead>
              <TableHead className="font-semibold text-gray-700">Bairro</TableHead>
              <TableHead className="font-semibold text-gray-700">Cidade</TableHead>
              <TableHead className="font-semibold text-gray-700">UF</TableHead>
              <TableHead className="font-semibold text-gray-700">IPA Code</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[120px]">Vencimento</TableHead>
              <TableHead className="font-semibold text-gray-700 min-w-[130px]">Início Parceria</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oscs.map((osc, index) => (
              <TableRow key={osc.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <TableCell className="font-medium">{osc.nome}</TableCell>
                <TableCell className="font-mono text-sm">{formatCNPJ(osc.cnpj)}</TableCell>
                <TableCell>{osc.responsavel}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
                    {osc.parcerias}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{osc.email}</TableCell>
                <TableCell>{osc.bairro}</TableCell>
                <TableCell>{osc.cidade}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {osc.uf}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{osc.ipaCode}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span
                      className={`text-sm ${
                        isVencido(osc.vencimento)
                          ? "text-red-600 font-semibold"
                          : isVencimentoProximo(osc.vencimento)
                            ? "text-yellow-600 font-semibold"
                            : "text-gray-600"
                      }`}
                    >
                      {formatDate(osc.vencimento)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{formatDate(osc.inicioParceria)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Switch
                      checked={osc.status === "Ativo"}
                      onCheckedChange={() => onStatusChange(osc.id, osc.status)}
                      className="data-[state=checked]:bg-[#E8772E]"
                    />
                    <Badge className={getStatusColor(osc.status)} variant="secondary">
                      {osc.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/oscs/${osc.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
                      title="Visualizar/Editar OSC"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
