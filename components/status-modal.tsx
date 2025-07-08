"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StatusModalProps {
  isOpen: boolean
  currentStatus: string
  onClose: () => void
  onConfirm: (newStatus: string, responsavel: string, descricao: string) => void
}

export function StatusModal({ isOpen, currentStatus, onClose, onConfirm }: StatusModalProps) {
  const [newStatus, setNewStatus] = useState("")
  const [responsavel, setResponsavel] = useState("")
  const [descricao, setDescricao] = useState("")
  const [confirmText, setConfirmText] = useState("")

  const handleSubmit = () => {
    if (confirmText === "texto" && newStatus && responsavel && descricao) {
      onConfirm(newStatus, responsavel, descricao)
      // Reset form
      setNewStatus("")
      setResponsavel("")
      setDescricao("")
      setConfirmText("")
    }
  }

  const handleClose = () => {
    setNewStatus("")
    setResponsavel("")
    setDescricao("")
    setConfirmText("")
    onClose()
  }

  const isFormValid = confirmText === "texto" && newStatus && responsavel && descricao

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Status da Loja</DialogTitle>
          <DialogDescription>
            Status atual: <span className="font-semibold">{currentStatus}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="responsavel">Responsável pela Modificação</Label>
            <Input
              id="responsavel"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              placeholder="Nome do responsável"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="descricao">Descrição da Alteração</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o motivo da alteração"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm">
              Confirmação <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Digite 'texto' para confirmar"
            />
            <p className="text-sm text-gray-500">
              Para confirmar a alteração, digite exatamente: <span className="font-mono font-semibold">texto</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid} className="bg-[#E8772E] hover:bg-[#d16b26]">
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
