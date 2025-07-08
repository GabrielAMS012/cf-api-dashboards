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
import { Search, AlertTriangle, Building, Users, Loader2 } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"
import type { Loja, OSC } from "@/lib/supabase/types"

// Mock data for development
const mockLojas: Loja[] = [
  {
    id: "1",
    codigo: "001",
    nome: "Supermercado Central",
    cidade: "São Paulo",
    uf: "SP",
    status: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    codigo: "002",
    nome: "Mercado do Bairro",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    status: true,
    created_at: "2024-01-01T00:00:00Z",
  },
]

const mockOSCs: OSC[] = [
  {
    id: "1",
    nome: "Instituto Alimentar Solidário",
    cnpj: "12.345.678/0001-90",
    responsavel: "Maria Silva Santos",
    cidade: "São Paulo",
    uf: "SP",
    status: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    nome: "Rede Contra Fome",
    cnpj: "98.765.432/0001-10",
    responsavel: "João Carlos Oliveira",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    status: true,
    created_at: "2024-01-01T00:00:00Z",
  },
]

interface CreateParceriaCampanhaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  campanha: any
}

export function CreateParceriaCampanhaModal({
  isOpen,
  onClose,
  onConfirm,
  campanha,
}: CreateParceriaCampanhaModalProps) {
  const [formData, setFormData] = useState({
    lojaId: "",
    oscId: "",
    dataInicio: "",
    dataFim: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [lojas, setLojas] = useState<Loja[]>([])
  const [oscs, setOSCs] = useState<OSC[]>([])
  const [oscSearch, setOscSearch] = useState("")
  const [filteredOSCs, setFilteredOSCs] = useState<OSC[]>([])

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      loadData()
      // Definir datas padrão baseadas na campanha
      if (campanha) {
        setFormData((prev) => ({
          ...prev,
          dataInicio: campanha.data_inicio || "",
          dataFim: campanha.data_fim || "",
        }))
      }
    }
  }, [isOpen, campanha])

  // Filter OSCs based on search
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

  const loadData = async () => {
    try {
      setLoading(true)

      // If Supabase is not configured, use mock data
      if (!isSupabaseConfigured) {
        console.warn("Using mock data - Supabase not configured")
        setLojas(mockLojas)
        setOSCs(mockOSCs)
        setFilteredOSCs(mockOSCs)
        return
      }

      const [lojasResponse, oscsResponse] = await Promise.all([
        supabase.from("lojas").select("*").eq("status", true).order("nome"),
        supabase.from("oscs").select("*").eq("status", true).order("nome"),
      ])

      if (lojasResponse.error) throw lojasResponse.error
      if (oscsResponse.error) throw oscsResponse.error

      setLojas(lojasResponse.data as Loja[])
      setOSCs(oscsResponse.data as OSC[])
      setFilteredOSCs(oscsResponse.data as OSC[])
    } catch (err) {
      console.error("Error loading data:", err)
      setErrors({ submit: "Erro ao carregar dados" })
      // Fallback to mock data on error
      setLojas(mockLojas)
      setOSCs(mockOSCs)
      setFilteredOSCs(mockOSCs)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

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

  const checkDuplicate = async () => {
    // If Supabase is not configured, simulate no duplicates
    if (!isSupabaseConfigured) {
      return false
    }

    const { data, error } = await supabase
      .from("parcerias_campanhas")
      .select("id")
      .eq("campanha_id", campanha.id)
      .eq("loja_id", formData.lojaId)
      .eq("osc_id", formData.oscId)

    if (error) throw error
    return data.length > 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)

      // Check for duplicates
      const isDuplicate = await checkDuplicate()
      if (isDuplicate) {
        setErrors({ submit: "Esta parceria já existe para esta campanha" })
        return
      }

      // If Supabase is not configured, simulate success
      if (!isSupabaseConfigured) {
        console.warn("Simulating parceria creation - Supabase not configured")
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
        await onConfirm()
        handleClose()
        return
      }

      // Create parceria
      const { error } = await supabase.from("parcerias_campanhas").insert({
        campanha_id: campanha.id,
        loja_id: formData.lojaId,
        osc_id: formData.oscId,
        data_inicio: formData.dataInicio,
        data_fim: formData.dataFim,
      })

      if (error) throw error

      await onConfirm()
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

  if (!campanha) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Parceria</DialogTitle>
          <DialogDescription>
            Adicionar uma nova parceria à campanha: <strong>{campanha.nome}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
            <p className="text-gray-500">Carregando dados...</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Submit Error */}
            {errors.submit && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{errors.submit}</AlertDescription>
              </Alert>
            )}

            {/* Development Notice */}
            {!isSupabaseConfigured && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Modo de Desenvolvimento:</strong> Usando dados simulados. Configure o Supabase para dados
                  reais.
                </AlertDescription>
              </Alert>
            )}

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

            {/* Dica sobre duplicatas */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">⚠️ Prevenção de Duplicatas:</p>
                <p className="text-xs">
                  O sistema não permite múltiplas parcerias da mesma loja com a mesma OSC na mesma campanha.
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-[#E8772E] hover:bg-[#d16b26]" disabled={submitting || loading}>
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
