"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePartnershipsApi } from "@/lib/hooks/usePartnershipsApi"
import { oscsService } from "@/lib/api/services/oscs"
import { campaignsService } from "@/lib/api/services/campaigns"
import { storesService } from "@/lib/api/services/stores"
import { AuthProvider } from "@/lib/hooks/use-auth"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"

function AddPartnershipContent() {
  const router = useRouter()
  const { createPartnership } = usePartnershipsApi()

  const [oscCnpj, setOscCnpj] = useState("")
  const [storeCode, setStoreCode] = useState("")
  const [campaignId, setCampaignId] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // CNPJ formatting utilities (only for OSC)
  const formatCnpj = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "")

    // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
    if (digits.length <= 12)
      return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`
  }

  const unformatCnpj = (value: string): string => {
    return value.replace(/\D/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      // Input validation
      if (!oscCnpj || !storeCode || !campaignId) {
        setErrorMessage("Preencha todos os campos obrigatórios.")
        return
      }

      // Convert store code and campaign ID to numbers and validate
      const storeCodeNumber = Number(storeCode)
      if (isNaN(storeCodeNumber)) {
        setErrorMessage("Código da Loja deve ser um número válido.")
        return
      }

      const campaignIdNumber = Number(campaignId)
      if (isNaN(campaignIdNumber)) {
        setErrorMessage("ID da Campanha deve ser um número válido.")
        return
      }

      // CNPJ format validation (only for OSC)
      const unmaskedOscCnpj = unformatCnpj(oscCnpj)

      if (unmaskedOscCnpj.length !== 14) {
        setErrorMessage("CNPJ da OSC deve conter 14 dígitos.")
        return
      }

      // OSC Validation (by CNPJ)
      let oscsFound
      try {
        oscsFound = await oscsService.getAll({ cnpj: oscCnpj })
      } catch (error) {
        setErrorMessage("Erro ao buscar OSC. Verifique o CNPJ informado.")
        return
      }

      if (!oscsFound || oscsFound.length !== 1) {
        setErrorMessage("CNPJ da OSC não encontrado ou ambíguo.")
        return
      }

      const oscIdNumber = oscsFound[0].id

      // Store Validation (by store_code)
      let storesFound
      try {
        storesFound = await storesService.getAll({ store_code: storeCodeNumber })
      } catch (error) {
        setErrorMessage("Erro ao buscar Loja. Verifique o código informado.")
        return
      }

      if (!storesFound || storesFound.length !== 1) {
        setErrorMessage("Código da Loja não encontrado ou ambíguo.")
        return
      }

      const storeIdNumber = storesFound[0].id

      // Campaign Validation (by ID)
      try {
        const campaignData = await campaignsService.getById(campaignIdNumber)
        if (!campaignData) {
          setErrorMessage("ID da Campanha não encontrado.")
          return
        }
      } catch (error) {
        setErrorMessage("ID da Campanha não encontrado.")
        return
      }

      // Create Partnership
      await createPartnership({
        oscId: oscIdNumber,
        storeId: storeIdNumber,
        campanhas: campaignIdNumber,
        osc: "", // Will be populated by the API response
        loja: "", // Will be populated by the API response
        dataInicio: "", // Will be populated by the API response
        dataVencimento: "", // Will be populated by the API response
        status: "pendente", // Default status
      })

      // Success - navigate back to partnerships list
      router.push("/parcerias")
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erro ao criar parceria."
      setErrorMessage(errorMsg)
      console.error("Error creating partnership:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/parcerias")
  }

  const handleOscCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCnpj(e.target.value)
    setOscCnpj(formatted)
  }

  return (
    <div className="flex-1 md:ml-64">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nova Parceria</h1>
              <p className="text-muted-foreground mt-2">
                Crie uma nova parceria associando uma Organização da Sociedade Civil (OSC), Loja e Campanha.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Dados da Parceria</CardTitle>
            <CardDescription>
              Insira o CNPJ da OSC, código da Loja e ID da Campanha para criar uma nova parceria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="oscCnpj">CNPJ da OSC</Label>
                  <Input
                    id="oscCnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={oscCnpj}
                    onChange={handleOscCnpjChange}
                    disabled={loading}
                    maxLength={18}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeCode">Código da Loja</Label>
                  <Input
                    id="storeCode"
                    type="number"
                    placeholder="Digite o código da loja"
                    value={storeCode}
                    onChange={(e) => setStoreCode(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaignId">ID da Campanha</Label>
                <Input
                  id="campaignId"
                  type="number"
                  placeholder="Digite o ID da Campanha"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="bg-[#f26b26] hover:bg-[#e55a1f]"
                  disabled={loading || !oscCnpj || !storeCode || !campaignId}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AddPartnershipPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <AppSidebar />
        <AddPartnershipContent />
      </div>
    </AuthProvider>
  )
}
