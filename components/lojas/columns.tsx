"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { LojasRowActions } from "./data-table-row-actions"
import type { Loja } from "./types"

export const columns: ColumnDef<Loja>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "nome",
    header: "Nome da Loja",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="font-medium">{row.getValue("nome")}</div>
          <div className="text-sm text-muted-foreground">{row.original.codigo}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "bandeira",
    header: "Bandeira",
    cell: ({ row }) => <div>{row.getValue("bandeira")}</div>,
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("cnpj")}</div>,
  },
  {
    accessorKey: "cidade",
    header: "Cidade",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div>{row.getValue("cidade")}</div>
          <div className="text-sm text-muted-foreground">{row.original.uf}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as number
      return <Badge variant={status === 1 ? "default" : "secondary"}>{status === 1 ? "Ativa" : "Inativa"}</Badge>
    },
  },
  {
    accessorKey: "parcerias",
    header: "Parcerias",
    cell: ({ row }) => {
      const parcerias = row.getValue("parcerias") as number
      return (
        <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
          {parcerias}
        </Badge>
      )
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Última Atualização",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return <div className="text-sm">{date.toLocaleDateString("pt-BR")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <LojasRowActions row={row} />,
  },
]
