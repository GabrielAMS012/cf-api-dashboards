"use client"

import { useState } from "react"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal, Eye, ToggleLeft, ToggleRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { LojaDetailsModal } from "./loja-details-modal"
import type { Loja } from "./types"

interface LojasRowActionsProps<TData> {
  row: Row<TData>
}

export function LojasRowActions<TData>({ row }: LojasRowActionsProps<TData>) {
  const loja = row.original as Loja
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    setIsUpdating(true)

    // Simular chamada de API
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newStatus = loja.status === 1 ? 0 : 1
      const action = newStatus === 1 ? "ativada" : "desativada"

      toast.success(`Loja ${loja.nome} foi ${action} com sucesso!`)

      // Aqui você atualizaria os dados reais
      // mutate() // se estivesse usando SWR
    } catch (error) {
      toast.error("Erro ao alterar status da loja")
    } finally {
      setIsUpdating(false)
      setShowStatusDialog(false)
    }
  }

  const getStatusAction = () => {
    return loja.status === 1 ? "desativar" : "ativar"
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowDetailsModal(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Mais detalhes
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowStatusDialog(true)}>
            {loja.status === 1 ? <ToggleLeft className="mr-2 h-4 w-4" /> : <ToggleRight className="mr-2 h-4 w-4" />}
            {loja.status === 1 ? "Desativar" : "Ativar"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar alteração de status</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja {getStatusAction()} a loja <strong>{loja.nome}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button onClick={handleStatusChange} disabled={isUpdating}>
              {isUpdating ? "Alterando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LojaDetailsModal loja={loja} open={showDetailsModal} onOpenChange={setShowDetailsModal} />
    </>
  )
}
