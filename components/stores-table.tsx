"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, ChevronDown } from "lucide-react"
import Link from "next/link"

interface Store {
  id: number
  codigo: string
  loja: string
  bandeira: string
  parcerias: number
  cidade: string
  uf: string
  bairro: string
  inauguracao: string
  status: string
}

interface StoresTableProps {
  stores: Store[]
  onStatusChange: (storeId: number, currentStatus: string) => void
}

export function StoresTable({ stores, onStatusChange }: StoresTableProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Código</TableHead>
            <TableHead className="font-semibold text-gray-700">Loja</TableHead>
            <TableHead className="font-semibold text-gray-700">Bandeira</TableHead>
            <TableHead className="font-semibold text-gray-700">#Parcerias</TableHead>
            <TableHead className="font-semibold text-gray-700">Cidade</TableHead>
            <TableHead className="font-semibold text-gray-700">UF</TableHead>
            <TableHead className="font-semibold text-gray-700">Bairro</TableHead>
            <TableHead className="font-semibold text-gray-700">Inauguração</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="font-semibold text-gray-700">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{store.codigo}</TableCell>
              <TableCell>{store.loja}</TableCell>
              <TableCell>{store.bandeira}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
                  {store.parcerias}
                </Badge>
              </TableCell>
              <TableCell>{store.cidade}</TableCell>
              <TableCell>{store.uf}</TableCell>
              <TableCell>{store.bairro}</TableCell>
              <TableCell>{formatDate(store.inauguracao)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 p-2">
                      <Badge className={getStatusColor(store.status)}>{store.status}</Badge>
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onStatusChange(store.id, store.status)}>
                      Alterar para Ativo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(store.id, store.status)}>
                      Alterar para Inativo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(store.id, store.status)}>
                      Alterar para Pendente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <Link href={`/stores/${store.id}/edit`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[#E8772E] hover:bg-[#E8772E] hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
