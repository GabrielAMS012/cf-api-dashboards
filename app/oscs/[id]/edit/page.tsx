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
import { useParams } from "next/navigation"

export default function EditOSCPage() {
  const params = useParams()
  const oscId = params.id

  // Dados de exemplo - em uma aplicação real, estes viriam de uma API
  const [oscData, setOscData] = useState({
    nome: "Instituto Alimentar Solidário",
    cnpj: "12.345.678/0001-90",
    responsavel: "Maria Silva Santos",
    email: "contato@alimentarsolidario.org.br",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123",
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    uf: "SP",
    cep: "05432-000",
    ipaCode: "IPA001",
    vencimento: "2024-12-31",
    inicioParceria: "2022-03-15",
    status: "Ativo",
    observacoes: "OSC com excelente histórico de parcerias e grande impacto social na região.",
  })

  const handleInputChange = (field: string, value: string) => {
    setOscData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar os dados
    console.log("Salvando dados da OSC:", oscData)
    alert("Dados salvos com sucesso!")
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
              <h1 className="text-2xl font-bold text-gray-900">Editar OSC</h1>
              <p className="text-gray-600">ID: {oscId}</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-[#E8772E] hover:bg-[#d16b26]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
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
                    <Label htmlFor="nome">Nome da OSC *</Label>
                    <Input
                      id="nome"
                      value={oscData.nome}
                      onChange={(e) => handleInputChange("nome", e.target.value)}
                      placeholder="Nome da organização"
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
                    <Label htmlFor="responsavel">Responsável *</Label>
                    <Input
                      id="responsavel"
                      value={oscData.responsavel}
                      onChange={(e) => handleInputChange("responsavel", e.target.value)}
                      placeholder="Nome do responsável"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ipaCode">IPA Code *</Label>
                    <Input
                      id="ipaCode"
                      value={oscData.ipaCode}
                      onChange={(e) => handleInputChange("ipaCode", e.target.value)}
                      placeholder="IPA001"
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
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={oscData.telefone}
                      onChange={(e) => handleInputChange("telefone", e.target.value)}
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
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={oscData.endereco}
                      onChange={(e) => handleInputChange("endereco", e.target.value)}
                      placeholder="Rua, número"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro *</Label>
                    <Input
                      id="bairro"
                      value={oscData.bairro}
                      onChange={(e) => handleInputChange("bairro", e.target.value)}
                      placeholder="Bairro"
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
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      value={oscData.cidade}
                      onChange={(e) => handleInputChange("cidade", e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uf">UF *</Label>
                    <Select value={oscData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
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
                  <Label htmlFor="inicioParceria">Início da Parceria *</Label>
                  <Input
                    id="inicioParceria"
                    type="date"
                    value={oscData.inicioParceria}
                    onChange={(e) => handleInputChange("inicioParceria", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vencimento">Vencimento *</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={oscData.vencimento}
                    onChange={(e) => handleInputChange("vencimento", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={oscData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                      <SelectItem value="Pendente">Pendente</SelectItem>
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
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
