"use client"

import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { Store } from "@/lib/types/parcerias"

type Props = {
  store: Store
  onUpdateOSC: (storeId: number, oscId: number, updates: any) => void
  onRemoveOSC: (storeId: number, oscId: number) => void
}

export default function OSCDataTable({ store, onUpdateOSC, onRemoveOSC }: Props) {
  async function toggleActive(oscId: number, active: boolean) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onUpdateOSC(store.id, oscId, { partnership_active: active })
      toast.success(`Parceria ${active ? "ativada" : "desativada"} com sucesso`)
    } catch (error) {
      toast.error("Erro ao atualizar parceria")
    }
  }

  async function toggleFavorite(oscId: number, favorite: boolean) {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onUpdateOSC(store.id, oscId, { is_favorite: favorite })
      toast.success(`OSC ${favorite ? "marcada como favorita" : "removida dos favoritos"}`)
    } catch (error) {
      toast.error("Erro ao atualizar favorito")
    }
  }

  async function removeOsc(oscId: number) {
    if (!confirm("Tem certeza que deseja remover esta OSC da loja?")) {
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      onRemoveOSC(store.id, oscId)
      toast.success("OSC removida com sucesso")
    } catch (error) {
      toast.error("Erro ao remover OSC")
    }
  }

  if (!store.oscs || store.oscs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg">
        <p>Nenhuma OSC associada a esta loja.</p>
        <p className="text-sm mt-1">Use o botão "Adicionar OSCs" para começar.</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>OSC</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Parceria</TableHead>
            <TableHead>Favorita</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {store.oscs.map((osc) => (
            <TableRow key={osc.id} className={osc.is_favorite ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{osc.name}</span>
                  <span className="text-xs text-muted-foreground">{osc.email}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{osc.cnpj}</TableCell>
              <TableCell>{osc.responsable_name}</TableCell>
              <TableCell>
                {osc.city}, {osc.state}
              </TableCell>
              <TableCell>
                <Badge variant={osc.is_active ? "default" : "secondary"}>{osc.is_active ? "Ativa" : "Inativa"}</Badge>
              </TableCell>
              <TableCell>
                <Switch checked={osc.partnership_active} onCheckedChange={(v) => toggleActive(osc.id, v)} />
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => toggleFavorite(osc.id, !osc.is_favorite)}>
                  <Star
                    className={`h-4 w-4 ${
                      osc.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOsc(osc.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
