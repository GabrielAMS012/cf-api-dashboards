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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, AlertTriangle, Loader2, User } from "lucide-react"

interface CreateCampanhaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (campanha: {
    nome: string
    criador: string
    descricao?: string
    dataInicio: string
    dataFim: string
  }) => Promise<void>
}

export function CreateCampanhaModal({ isOpen, onClose, onConfirm }: CreateCampanhaModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    criador: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome da campanha é obrigatório"
    }

    if (!formData.criador.trim()) {
      newErrors.criador = "Nome do criador é obrigatório"
    }

    if (!formData.dataInicio) {
      newErrors.dataInicio = "Data de início é obrigatória"
    }

    if (!formData.dataFim) {
      newErrors.dataFim = "Data de término é obrigatória"
    }

    if (formData.dataInicio && formData.dataFim) {
      const dataInicio = new Date(formData.dataInicio)
      const dataFim = new Date(formData.dataFim)

      if (dataFim < dataInicio) {
        newErrors.dataFim = "A data de término deve ser igual ou posterior à data de início"
      }

      // Verificar se a data de início não é muito antiga
      const hoje = new Date()
      const umAnoAtras = new Date()
      umAnoAtras.setFullYear(hoje.getFullYear() - 1)

      if (dataInicio < umAnoAtras) {
        newErrors.dataInicio = "A data de início não pode ser anterior a um ano atrás"
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
        nome: formData.nome.trim(),
        criador: formData.criador.trim(),
        descricao: formData.descricao.trim() || undefined,
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
      })
      handleClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar campanha"
      setErrors({ submit: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      nome: "",
      criador: "",
      descricao: "",
      dataInicio: "",
      dataFim: "",
    })
    setErrors({})
    setSubmitting(false)
    onClose()
  }

  // Sugerir data de início como hoje
  const hoje = new Date().toISOString().split("T")[0]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#E8772E]" />
            <span>Criar Nova Campanha</span>
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para criar uma nova campanha. Todos os campos marcados com * são obrigatórios.
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

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Campanha *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange("nome", e.target.value)}
              placeholder="Ex: Campanha Solidária 2024"
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
          </div>

          {/* Criador */}
          <div className="space-y-2">
            <Label htmlFor="criador" className="flex items-center space-x-2">
              <User className="w-4 h-4 text-[#E8772E]" />
              <span>Criador da Campanha *</span>
            </Label>
            <Input
              id="criador"
              value={formData.criador}
              onChange={(e) => handleInputChange("criador", e.target.value)}
              placeholder="Ex: Maria Silva"
              className={errors.criador ? "border-red-500" : ""}
            />
            {errors.criador && <p className="text-sm text-red-500">{errors.criador}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (Opcional)</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange("descricao", e.target.value)}
              placeholder="Descreva os objetivos e detalhes da campanha..."
              rows={3}
              className={errors.descricao ? "border-red-500" : ""}
            />
            {errors.descricao && <p className="text-sm text-red-500">{errors.descricao}</p>}
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
                min={hoje}
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
                min={formData.dataInicio || hoje}
                className={errors.dataFim ? "border-red-500" : ""}
              />
              {errors.dataFim && <p className="text-sm text-red-500">{errors.dataFim}</p>}
            </div>
          </div>

          {/* Dica sobre datas */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">💡 Dicas para as datas:</p>
              <ul className="text-xs space-y-1">
                <li>• A data de início pode ser hoje ou no futuro</li>
                <li>• A data de término deve ser posterior à data de início</li>
                <li>• Campanhas são automaticamente marcadas como "Concluídas" após a data de término</li>
              </ul>
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
              "Criar Campanha"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
