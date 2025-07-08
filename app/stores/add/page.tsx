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
import { useStoreApi } from "@/lib/hooks/use-store-api"

export default function AddStorePage() {
  const [storeData, setStoreData] = useState({
    store_code: "",
    name: "",
    flag: "",
    city: "",
    uf: "",
    neighborhood: "",
    inauguration: "",
    status: "",
  })
  const { createStore } = useStoreApi()

  const handleInputChange = (field: string, value: string) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    // Validação básica
    const requiredFields = ["store_code", "name", "flag", "city", "uf", "neighborhood", "inauguration", "status"]
    const missingFields = requiredFields.filter((field) => !storeData[field as keyof typeof storeData])

    if (missingFields.length > 0) {
      alert(`Por favor, preencha os campos obrigatórios: ${missingFields.join(", ")}`)
      return
    }

    // Aqui você implementaria a lógica para salvar os dados
    // console.log("Salvando nova name:", storeData)
    await createStore(storeData)
    alert("Loja cadastrada com sucesso!")

    // Reset form
    setStoreData({
      store_code: "",
      name: "",
      flag: "",
      city: "",
      uf: "",
      neighborhood: "",
      inauguration: "",
      status: "",
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/lojas">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adicionar Nova Loja</h1>
              <p className="text-gray-600">Preencha todos os campos obrigatórios</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-[#E8772E] hover:bg-[#d16b26]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Loja
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
                <Label htmlFor="store_code">Código *</Label>
                <Input
                  id="store_code"
                  value={storeData.store_code}
                  onChange={(e) => handleInputChange("store_code", e.target.value)}
                  placeholder="Ex: 001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja *</Label>
                <Input
                  id="name"
                  value={storeData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ex: Supermercado Central"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flag">Bandeira *</Label>
                <Input
                  id="flag"
                  value={storeData.flag}
                  onChange={(e) => handleInputChange("flag", e.target.value)}
                  placeholder="Ex: Rede XPTO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade *</Label>
                <Input
                  id="city"
                  value={storeData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Ex: São Paulo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uf">UF *</Label>
                <Select value={storeData.uf} onValueChange={(value) => handleInputChange("uf", value)}>
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

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro *</Label>
                <Input
                  id="neighborhood"
                  value={storeData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  placeholder="Ex: Centro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inauguration">Data de Inauguração *</Label>
                <Input
                  id="inauguration"
                  type="date"
                  value={storeData.inauguration}
                  onChange={(e) => handleInputChange("inauguration", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={storeData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="0">Inativo</SelectItem>
                    {/* <SelectItem value="2">Pendente</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">* Campos obrigatórios</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
