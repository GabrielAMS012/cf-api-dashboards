"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function EditStorePage() {
  const params = useParams()
  const storeId = params.id

  // Dados de exemplo - em uma aplicação real, estes viriam de uma API
  const [storeData, setStoreData] = useState({
    codigo: "001",
    loja: "Supermercado Central",
    bandeira: "Rede A",
    cidade: "São Paulo",
    uf: "SP",
    bairro: "Centro",
    inauguracao: "2020-01-15",
    status: "Ativo",
  })

  const handleInputChange = (field: string, value: string) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar os dados
    console.log("Salvando dados:", storeData)
    alert("Dados salvos com sucesso!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Editar Loja</h1>
              <p className="text-gray-600">ID: {storeId}</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-[#E8772E] hover:bg-[#d16b26]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={storeData.codigo}
                  onChange={(e) => handleInputChange("codigo", e.target.value)}
                  placeholder="Código da loja"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loja">Nome da Loja *</Label>
                <Input
                  id="loja"
                  value={storeData.loja}
                  onChange={(e) => handleInputChange("loja", e.target.value)}
                  placeholder="Nome da loja"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bandeira">Bandeira *</Label>
                <Select value={storeData.bandeira} onValueChange={(value) => handleInputChange("bandeira", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a bandeira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rede A">Rede A</SelectItem>
                    <SelectItem value="Rede B">Rede B</SelectItem>
                    <SelectItem value="Rede C">Rede C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={storeData.cidade}
                  onChange={(e) => handleInputChange("cidade", e.target.value)}
                  placeholder="Cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uf">UF *</Label>
                <Select value={storeData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
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

              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={storeData.bairro}
                  onChange={(e) => handleInputChange("bairro", e.target.value)}
                  placeholder="Bairro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inauguracao">Data de Inauguração *</Label>
                <Input
                  id="inauguracao"
                  type="date"
                  value={storeData.inauguracao}
                  onChange={(e) => handleInputChange("inauguracao", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={storeData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
