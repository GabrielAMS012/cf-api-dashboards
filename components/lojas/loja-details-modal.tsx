"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Loja } from "./types"

interface LojaDetailsModalProps {
  loja: Loja
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LojaDetailsModal({ loja, open, onOpenChange }: LojaDetailsModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Loja</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-sm">{loja.nome}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Código</label>
                <p className="text-sm font-mono">{loja.codigo}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bandeira</label>
                <p className="text-sm">{loja.bandeira}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <p className="text-sm font-mono">{loja.cnpj}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="mt-1">
                  <Badge variant={loja.status === 1 ? "default" : "secondary"}>
                    {loja.status === 1 ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Parcerias</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-[#E8772E] border-[#E8772E]">
                    {loja.parcerias}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Localização */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Localização</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                <p className="text-sm">{loja.cidade}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <p className="text-sm">{loja.uf}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bairro</label>
                <p className="text-sm">{loja.bairro}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                <p className="text-sm">{loja.endereco}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contato</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                <p className="text-sm">{loja.telefone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{loja.email}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Datas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Datas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Inauguração</label>
                <p className="text-sm">{new Date(loja.inauguracao).toLocaleDateString("pt-BR")}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Criado em</label>
                <p className="text-sm">{formatDate(loja.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Última atualização</label>
                <p className="text-sm">{formatDate(loja.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
