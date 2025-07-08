"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, AlertTriangle, Calendar, Building, Users, Loader2 } from "lucide-react"
import type { Campanha, Loja, OSC } from "@/lib/supabase/types"

interface CreateParceriaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (parceria: {
    campanhaId: string
    lojaId: string
    oscId: string
    dataInicio: string
    dataFim: string
  }) => Promise<void>
  campanhas: Campanha[]
  lojas: Loja[]
  oscs: OSC[]
}

export function CreateParceriaModal({ isOpen, onClose, onConfirm, campanhas, lojas, oscs }: CreateParceriaModalProps) {
  const [formData, setFormData] = useState({
    campanhaId: "",
    lojaId: "",
    oscId: "",
    dataInicio: "",
    dataFim: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [oscSearch, setOscSearch] = useState("")
  const [filteredOSCs, setFilteredOSCs] = useState(oscs)
  const [submitting, setSubmitting] = useState(false)

  // Filtrar OSCs baseado na busca
  useEffect(() => {
    if (oscSearch.trim() === "") {
      setFilteredOSCs(oscs)
    } else {
      const searchLower = oscSearch.toLowerCase()
      const searchNumbers = oscSearch.replace(/\D/g, "")

      const filtered = oscs.filter((osc) => {
        const nameMatch = osc.nome.toLowerCase().includes(searchLower)
        const cnpjNumbers = osc.cnpj.replace(/\D/g, "")
        const cnpjMatch = searchNumbers.length >= 3 && cnpjNumbers.includes(searchNumbers)
        const responsavelMatch = osc.responsavel?.toLowerCase().includes(searchLower)

        return nameMatch || cnpjMatch || responsavelMatch
      })

      setFilteredOSCs(filtered)
    }
  }, [oscSearch, oscs])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.campanhaId) {
      newErrors.campanhaId = "Selecione uma campanha"
    }

    if (!formData.lojaId) {
      newErrors.lojaId = "Selecione uma loja"
    }

    if (!formData.oscId) {
      newErrors.oscId = "Selecione uma OSC"
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Informe a data de início"
    }

    if (!formData.dataFim) {
      newErrors.dataFim = "Informe a data de término"
    }

    if (formData.dataInicio && formData.dataFim) {
      const dataInicio = new Date(formData.dataInicio)
      const dataFim = new Date(formData.dataFim)

      if (dataFim < dataInicio) {
        newErrors.dataFim = "A data de término deve ser igual ou posterior à data de início"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)
      await onConfirm({
        campanhaId: formData.campanhaId,
        lojaId: formData.lojaId,
        oscId: formData.oscId,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
      })
      handleClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar parceria"
      setErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      campanhaId: "",
      lojaId: "",
      oscId: "",
      dataInicio: "",
      dataFim: "",
    })
    setErrors({})
    setOscSearch("")
    setSubmitting(false)
    onClose()
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Parceria</DialogTitle>
          <DialogDescription>
            Preencha todos os campos para criar uma nova parceria entre loja e OSC em uma campanha.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Submit Error */}
          {errors.submit && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* Campanha */}
          <div className="space-y-2">
            <Label htmlFor="campanha" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-[#E8772E]" />
              <span>Campanha *</span>
            </Label>
            <Select value={formData.campanhaId} onValueChange={(value) => handleInputChange("campanhaId", value)}>
              <SelectTrigger className={errors.campanhaId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma campanha" />
              </SelectTrigger>
              <SelectContent>
                {campanhas.map((campanha) => (
                  <SelectItem key={campanha.id} value={campanha.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{campanha.nome}</span>
                      {campanha.data_inicio && campanha.data_fim && (
                        <span className="text-xs text-gray-500">
                          {new Date(campanha.data_inicio).toLocaleDateString("pt-BR")} -{" "}
                          {new Date(campanha.data_fim).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.campanhaId && <p className="text-sm text-red-500">{errors.campanhaId}</p>}
          </div>

          {/* Loja */}
          <div className="space-y-2">
            <Label htmlFor="loja" className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-[#E8772E]" />
              <span>Loja *</span>
            </Label>
            <Select value={formData.lojaId} onValueChange={(value) => handleInputChange("lojaId", value)}>
              <SelectTrigger className={errors.lojaId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma loja" />
              </SelectTrigger>
              <SelectContent>
                {lojas.map((loja) => (
                  <SelectItem key={loja.id} value={loja.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{loja.nome}</span>
                      <span className="text-xs text-gray-500">
                        Cód: {loja.codigo} • {loja.cidade}, {loja.uf}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lojaId && <p className="text-sm text-red-500">{errors.lojaId}</p>}
          </div>

          {/* OSC Search */}
          <div className="space-y-2">
            <Label htmlFor="oscSearch" className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#E8772E]" />
              <span>Buscar OSC</span>
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, CNPJ ou responsável..."
                value={oscSearch}
                onChange={(e) => setOscSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* OSC */}
          <div className="space-y-2">
            <Label htmlFor="osc">OSC *</Label>
            <Select value={formData.oscId} onValueChange={(value) => handleInputChange("oscId", value)}>
              <SelectTrigger className={errors.oscId ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma OSC" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {filteredOSCs.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>Nenhuma OSC encontrada</p>
                    {oscSearch && <p className="text-xs">para "{oscSearch}"</p>}
                  </div>
                ) : (
                  filteredOSCs.map((osc) => (
                    <SelectItem key={osc.id} value={osc.id}>
                      <div className="flex flex-col py-1">
                        <span className="font-medium">{osc.nome}</span>
                        <span className="text-xs text-gray-500 font-mono">{formatCNPJ(osc.cnpj)}</span>
                        <span className="text-xs text-gray-500">
                          {osc.responsavel} • {osc.cidade}, {osc.uf}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.oscId && <p className="text-sm text-red-500">{errors.oscId}</p>}
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início *</Label>
              <Input
                id="dataInicio"
                type="date"
                value={formData.dataInicio}
                onChange={(e) => handleInputChange("dataInicio", e.target.value)}
                className={errors.dataInicio ? "border-red-500" : ""}
              />
              {errors.dataInicio && <p className="text-sm text-red-500">{errors.dataInicio}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Término *</Label>
              <Input
                id="dataFim"
                type="date"
                value={formData.dataFim}
                onChange={(e) => handleInputChange("dataFim", e.target.value)}
                className={errors.dataFim ? "border-red-500" : ""}
              />
              {errors.dataFim && <p className="text-sm text-red-500">{errors.dataFim}</p>}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[#E8772E] hover:bg-[#d16b26]" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Parceria"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
