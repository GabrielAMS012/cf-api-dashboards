"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { StoreExternal } from "@/lib/types/store-external"
import { StoreDetailsModal } from "./store-details-modal"
import { useState } from "react"

function ActionsCell({ store }: { store: StoreExternal }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StoreDetailsModal store={store} open={showDetails} onOpenChange={setShowDetails} />
    </>
  )
}

export const columns: ColumnDef<StoreExternal>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("cnpj")}</div>,
  },
  {
    accessorKey: "city",
    header: "Cidade",
  },
  {
    accessorKey: "state",
    header: "Estado",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge variant={status === "active" ? "default" : status === "inactive" ? "destructive" : "secondary"}>
          {status === "active" ? "Ativo" : status === "inactive" ? "Inativo" : "Pendente"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell store={row.original} />,
  },
]
