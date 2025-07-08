"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"
import { toast } from "sonner"

interface StoreStatusDropdownProps {
  storeId: number
  storeName: string
  currentStatus: number
}

const statusOptions = [
  { value: 1, label: "Ativa", variant: "default" as const },
  { value: 0, label: "Inativa", variant: "secondary" as const },
  { value: 2, label: "Em implantação", variant: "outline" as const },
  { value: 3, label: "Pausada", variant: "destructive" as const },
]

export function StoreStatusDropdown({ storeId, storeName, currentStatus }: StoreStatusDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [responsavel, setResponsavel] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const currentStatusOption = statusOptions.find((option) => option.value === currentStatus)
  const selectedStatusOption = statusOptions.find((option) => option.value === selectedStatus)

  const handleStatusSelect = (newStatus: number) => {
    if (newStatus === currentStatus) return

    setSelectedStatus(newStatus)
    setIsModalOpen(true)
    setResponsavel("")
    setConfirmText("")
  }

  const handleConfirm = async () => {
    if (!responsavel.trim() || confirmText !== "CONFIRMO") return

    setIsLoading(true)

    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`Status da loja "${storeName}" alterado com sucesso!`)
      setIsModalOpen(false)

      // Aqui você faria a atualização real do status
      // await updateStoreStatus(storeId, selectedStatus, responsavel)
    } catch (error) {
      toast.error("Erro ao alterar status da loja")
    } finally {
      setIsLoading(false)
    }
  }

  const isConfirmEnabled = responsavel.trim() !== "" && confirmText === "CONFIRMO"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-auto p-2">
            <Badge variant={currentStatusOption?.variant}>{currentStatusOption?.label}</Badge>
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              className={currentStatus === option.value ? "bg-gray-100" : ""}
            >
              <Badge variant={option.variant} className="mr-2">
                {option.label}
              </Badge>
              {currentStatus === option.value && "(Atual)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar alteração de status</DialogTitle>
            <DialogDescription>
              Deseja alterar o status da loja <strong>{storeName}</strong> para{" "}
              <strong>{selectedStatusOption?.label}</strong>?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável pela mudança</Label>
              <Input
                id="responsavel"
                placeholder="Digite seu nome"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Digite "CONFIRMO" para prosseguir</Label>
              <Input
                id="confirm"
                placeholder="CONFIRMO"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!isConfirmEnabled || isLoading}>
              {isLoading ? "Confirmando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
