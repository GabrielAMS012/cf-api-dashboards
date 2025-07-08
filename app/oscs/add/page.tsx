"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Building, Mail, MapPin, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { useOSCApi } from "@/lib/hooks/use-osc-api"

export default function AddOSCPage() {
  const [oscData, setOscData] = useState({
    name: "",
    cnpj: "",
    responsable_name: "",
    email: "",
    phone: "",
    full_address: "",
    neighborhood: "",
    city: "",
    uf: "",
    cep: "",
    ipa_code: "",
    due_date: "",
    partnership_init_date: "",
    status: "",
    observacoes: "",
  })
const { createOSC } = useOSCApi()
  

  const handleInputChange = (field: string, value: string) => {
    setOscData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    // Validação básica
    const requiredFields = [
      "name",
      "cnpj",
      "responsable_name",
      "email",
      "neighborhood",
      "city",
      "uf",
      "ipa_code",
      "due_date",
      "partnership_init_date",
      "status",
    ]
    const missingFields = requiredFields.filter((field) => !oscData[field as keyof typeof oscData])

    if (missingFields.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(", ")}`)
      return
    }

    // Aqui você implementaria a lógica para salvar os dados
    await createOSC(oscData)
    // console.log("Salvando nova OSC:", oscData)
    alert("OSC cadastrada com sucesso!")

    // Reset form
    setOscData({
      name: "",
      cnpj: "",
      responsable_name: "",
      email: "",
      phone: "",
      full_address: "",
      neighborhood: "",
      city: "",
      uf: "",
      cep: "",
      ipa_code: "",
      due_date: "",
      partnership_init_date: "",
      status: "",
      observacoes: "",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/oscs">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cadastrar Nova OSC</h1>
              <p className="text-gray-600">Preencha todos os campos obrigatórios</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-[#E8772E] hover:bg-[#d16b26]">
            <Save className="w-4 h-4 mr-2" />
            Salvar OSC
          </Button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-[#E8772E]" />
                  <span>Informações da OSC</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da OSC *</Label>
                    <Input
                      id="name"
                      value={oscData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ex: Instituto Alimentar Solidário"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={oscData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsable_name">Responsável *</Label>
                    <Input
                      id="responsable_name"
                      value={oscData.responsable_name}
                      onChange={(e) => handleInputChange("responsable_name", e.target.value)}
                      placeholder="Ex: Maria Silva Santos"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipa_code">IPA Code *</Label>
                    <Input
                      id="ipa_code"
                      value={oscData.ipa_code}
                      onChange={(e) => handleInputChange("ipa_code", e.target.value)}
                      placeholder="Ex: IPA001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-[#E8772E]" />
                  <span>Contato</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={oscData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="contato@osc.org.br"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={oscData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-[#E8772E]" />
                  <span>Endereço</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="full_address">Endereço</Label>
                    <Input
                      id="full_address"
                      value={oscData.full_address}
                      onChange={(e) => handleInputChange("full_address", e.target.value)}
                      placeholder="Rua, número"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro *</Label>
                    <Input
                      id="neighborhood"
                      value={oscData.neighborhood}
                      onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                      placeholder="Ex: Vila Madalena"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={oscData.cep}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      value={oscData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Ex: São Paulo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uf">UF *</Label>
                    <Select value={oscData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações adicionais */}
          <div className="space-y-6">
            {/* Datas e Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-[#E8772E]" />
                  <span>Datas e Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partnership_init_date">Início da Parceria *</Label>
                  <Input
                    id="partnership_init_date"
                    type="date"
                    value={oscData.partnership_init_date}
                    onChange={(e) => handleInputChange("partnership_init_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Vencimento *</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={oscData.due_date}
                    onChange={(e) => handleInputChange("due_date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={oscData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="0">Inativo</SelectItem>
                      <SelectItem value="2">Pendente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#E8772E]" />
                  <span>Observações</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={oscData.observacoes}
                    onChange={(e) => handleInputChange("observacoes", e.target.value)}
                    placeholder="Informações adicionais sobre a OSC"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Informações importantes */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-2">Campos obrigatórios:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Nome, CNPJ, Responsável</li>
                    <li>Email, Bairro, Cidade, UF</li>
                    <li>IPA Code, Vencimento</li>
                    <li>Início Parceria, Status</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
