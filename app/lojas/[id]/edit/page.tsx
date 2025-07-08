"use client"

import type React from "react"

import { useState, use } from "react";
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Contact {
  id?: number
  nome: string
  cargo: string
  email: string
  telefone: string
}

interface Store {
  id: number
  name: string
  cnpj: string
  estado: string
  endereco: string
  status: number
  contacts: Contact[]
}

// Estados brasileiros
const estados = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
]

export default function EditStorePage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Mock data para a loja
  const [store, setStore] = useState<Store>({
    id: Number.parseInt(params.id),
    name: "Supermercado Central",
    cnpj: "12.345.678/0001-90",
    estado: "SP",
    endereco: "Rua das Flores, 123 - Centro - São Paulo/SP",
    status: 1,
    contacts: [
      {
        id: 1,
        nome: "João Silva",
        cargo: "Gerente",
        email: "joao@supermercado.com",
        telefone: "(11) 99999-9999",
      },
      {
        id: 2,
        nome: "Maria Santos",
        cargo: "Supervisora",
        email: "maria@supermercado.com",
        telefone: "(11) 88888-8888",
      },
    ],
  })

  const handleStoreChange = (field: keyof Store, value: any) => {
    setStore((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updatedContacts = [...store.contacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    setStore((prev) => ({ ...prev, contacts: updatedContacts }))
  }

  const addContact = () => {
    const newContact: Contact = {
      nome: "",
      cargo: "",
      email: "",
      telefone: "",
    }
    setStore((prev) => ({ ...prev, contacts: [...prev.contacts, newContact] }))
  }

  const removeContact = (index: number) => {
    const updatedContacts = store.contacts.filter((_, i) => i !== index)
    setStore((prev) => ({ ...prev, contacts: updatedContacts }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simular chamada para API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Loja atualizada com sucesso!")
      router.push("/lojas")
    } catch (error) {
      toast.error("Erro ao atualizar loja")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/lojas">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Loja</h1>
          <p className="text-muted-foreground">Atualize as informações da loja</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados da Loja */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Loja</CardTitle>
            <CardDescription>Informações básicas da loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja</Label>
                <Input
                  id="name"
                  value={store.name}
                  onChange={(e) => handleStoreChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={store.cnpj}
                  onChange={(e) => handleStoreChange("cnpj", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={store.estado} onValueChange={(value) => handleStoreChange("estado", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem key={estado} value={estado}>
                        {estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={store.status.toString()}
                  onValueChange={(value) => handleStoreChange("status", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativa</SelectItem>
                    <SelectItem value="0">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea
                id="endereco"
                value={store.endereco}
                onChange={(e) => handleStoreChange("endereco", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contatos</CardTitle>
                <CardDescription>Gerencie os contatos da loja</CardDescription>
              </div>
              <Button type="button" variant="outline" onClick={addContact}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Contato
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {store.contacts.map((contact, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Contato {index + 1}</h4>
                  {store.contacts.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`contact-nome-${index}`}>Nome</Label>
                    <Input
                      id={`contact-nome-${index}`}
                      value={contact.nome}
                      onChange={(e) => handleContactChange(index, "nome", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-cargo-${index}`}>Cargo</Label>
                    <Input
                      id={`contact-cargo-${index}`}
                      value={contact.cargo}
                      onChange={(e) => handleContactChange(index, "cargo", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-email-${index}`}>E-mail</Label>
                    <Input
                      id={`contact-email-${index}`}
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, "email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`contact-telefone-${index}`}>Telefone</Label>
                    <Input
                      id={`contact-telefone-${index}`}
                      value={contact.telefone}
                      onChange={(e) => handleContactChange(index, "telefone", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end space-x-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/lojas">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Salvando..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
