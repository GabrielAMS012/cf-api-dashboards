"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Loader2 } from "lucide-react"
import { useOSCs } from "@/lib/hooks/use-oscs"
import type { Store } from "@/lib/types/parcerias"

type Props = {
  store: Store | null
  open: boolean
  onClose: () => void
  onConfirm: (oscIds: number[]) => void
}

export default function AddOscDialog({ store, open, onClose, onConfirm }: Props) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<number[]>([])
  const { oscs, loading } = useOSCs(query)

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setQuery("")
      setSelected([])
    }
  }, [open])

  function toggle(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  function handleConfirm() {
    onConfirm(selected)
    setSelected([])
  }

  // Filter out OSCs that are already associated with this store
  const availableOSCs = oscs.filter((osc) => {
    if (!store?.oscs) return true
    return !store.oscs.some((storeOsc) => storeOsc.id === osc.id)
  })

  if (!store) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar OSCs à Loja</DialogTitle>
          <DialogDescription>
            Loja: {store.name} (Código: {store.code}) – {store.city}, {store.state}
          </DialogDescription>
        </DialogHeader>

        {/* Search field */}
        <div className="relative mt-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CNPJ, responsável ou cidade..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* List */}
        <ScrollArea className="h-[300px] mt-4 pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Buscando OSCs...</span>
            </div>
          ) : availableOSCs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {query ? "Nenhuma OSC encontrada para esta busca" : "Todas as OSCs já estão associadas a esta loja"}
            </div>
          ) : (
            availableOSCs.map((osc) => (
              <div key={osc.id} className="flex items-start gap-3 py-3 border-b last:border-b-0">
                <Checkbox checked={selected.includes(osc.id)} onCheckedChange={() => toggle(osc.id)} />
                <div className="flex flex-col gap-1 text-sm flex-1">
                  <span className="font-medium">{osc.name}</span>
                  <span className="text-muted-foreground font-mono text-xs">{osc.cnpj}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={osc.is_active ? "default" : "secondary"} className="text-xs">
                      {osc.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {osc.responsable_name} • {osc.city}, {osc.state}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-xs">{osc.email}</span>
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!selected.length} onClick={handleConfirm}>
            Adicionar OSCs Selecionadas ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
