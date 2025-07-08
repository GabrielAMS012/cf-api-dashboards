"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { StoreExternal } from "@/lib/types/store-external"

interface StoreDetailsModalProps {
  store: StoreExternal
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StoreDetailsModal({ store, open, onOpenChange }: StoreDetailsModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Ativo</Badge>
      case "inactive":
        return <Badge variant="destructive">Inativo</Badge>
      case "pending":
        return <Badge variant="secondary">Pendente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {store.name}
            {getStatusBadge(store.status)}
          </DialogTitle>
          <DialogDescription>Detalhes completos da loja externa</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Informações Básicas */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-sm">{store.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                <p className="text-sm font-mono">{store.cnpj}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                <p className="text-sm">{store.phone || "Não informado"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                <p className="text-sm">{store.email || "Não informado"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Endereço */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Endereço</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Endereço</label>
                <p className="text-sm">{store.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                <p className="text-sm">{store.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <p className="text-sm">{store.state}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Adicionais */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Informações Adicionais</h3>
            <div className="grid grid-cols-2 gap-4">
              {store.contact_person && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pessoa de Contato</label>
                  <p className="text-sm">{store.contact_person}</p>
                </div>
              )}
              {store.region && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Região</label>
                  <p className="text-sm">{store.region}</p>
                </div>
              )}
              {store.store_type && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Loja</label>
                  <p className="text-sm">{store.store_type}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                <p className="text-sm">{formatDate(store.created_at)}</p>
              </div>
            </div>
            {store.observations && (
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">Observações</label>
                <p className="text-sm mt-1 p-3 bg-muted rounded-md">{store.observations}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
