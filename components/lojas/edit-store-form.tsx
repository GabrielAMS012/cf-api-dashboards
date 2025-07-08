"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContactFields } from "@/components/ui/contact-fields"
import { Plus, Save } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const storeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter 14 dígitos"),
  estado: z.string().min(2, "Estado é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  status: z.enum(["Ativa", "Inativa", "Em implantação", "Pausada"]),
  contacts: z.array(
    z.object({
      nome: z.string().min(1, "Nome é obrigatório"),
      cargo: z.string().min(1, "Cargo é obrigatório"),
      email: z.string().email("Email inválido"),
      telefone: z.string().min(1, "Telefone é obrigatório"),
    }),
  ),
})

type StoreFormData = z.infer<typeof storeSchema>

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

const statusOptions = ["Ativa", "Inativa", "Em implantação", "Pausada"]

interface EditStoreFormProps {
  store: {
    id: number
    name: string
    cnpj: string
    estado: string
    endereco: string
    status: string
    contacts: Array<{
      id: number
      nome: string
      cargo: string
      email: string
      telefone: string
    }>
  }
}

export function EditStoreForm({ store }: EditStoreFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store.name,
      cnpj: store.cnpj,
      estado: store.estado,
      endereco: store.endereco,
      status: store.status as any,
      contacts: store.contacts.map((contact) => ({
        nome: contact.nome,
        cargo: contact.cargo,
        email: contact.email,
        telefone: contact.telefone,
      })),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "contacts",
  })

  const onSubmit = async (data: StoreFormData) => {
    setIsLoading(true)
    try {
      // Aqui seria a chamada para o Supabase
      console.log("Dados para salvar:", data)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success("Loja atualizada com sucesso!")
      router.push("/lojas")
    } catch (error) {
      toast.error("Erro ao atualizar loja")
    } finally {
      setIsLoading(false)
    }
  }

  const addContact = () => {
    append({
      nome: "",
      cargo: "",
      email: "",
      telefone: "",
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Dados da Loja */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Loja</CardTitle>
            <CardDescription>Informações básicas da loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input id="name" {...form.register("name")} placeholder="Nome da loja" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input id="cnpj" {...form.register("cnpj")} placeholder="00.000.000/0000-00" />
              {form.formState.errors.cnpj && (
                <p className="text-sm text-destructive">{form.formState.errors.cnpj.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Select value={form.watch("estado")} onValueChange={(value) => form.setValue("estado", value)}>
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
              {form.formState.errors.estado && (
                <p className="text-sm text-destructive">{form.formState.errors.estado.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço *</Label>
              <Input id="endereco" {...form.register("endereco")} placeholder="Endereço completo" />
              {form.formState.errors.endereco && (
                <p className="text-sm text-destructive">{form.formState.errors.endereco.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-destructive">{form.formState.errors.status.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Contatos
              <Button type="button" variant="outline" size="sm" onClick={addContact}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </CardTitle>
            <CardDescription>Contatos da loja</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <ContactFields
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum contato adicionado. Clique em "Adicionar" para incluir um contato.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            "Salvando..."
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
