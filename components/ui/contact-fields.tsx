"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

interface ContactFieldsProps {
  index: number
  form: UseFormReturn<any>
  onRemove: () => void
  canRemove: boolean
}

export function ContactFields({ index, form, onRemove, canRemove }: ContactFieldsProps) {
  const errors = form.formState.errors.contacts?.[index]

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Contato {index + 1}</h4>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`contacts.${index}.nome`}>Nome *</Label>
            <Input
              id={`contacts.${index}.nome`}
              {...form.register(`contacts.${index}.nome`)}
              placeholder="Nome do contato"
            />
            {errors?.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`contacts.${index}.cargo`}>Cargo *</Label>
            <Input
              id={`contacts.${index}.cargo`}
              {...form.register(`contacts.${index}.cargo`)}
              placeholder="Cargo do contato"
            />
            {errors?.cargo && <p className="text-sm text-destructive">{errors.cargo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`contacts.${index}.email`}>E-mail *</Label>
            <Input
              id={`contacts.${index}.email`}
              type="email"
              {...form.register(`contacts.${index}.email`)}
              placeholder="email@exemplo.com"
            />
            {errors?.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`contacts.${index}.telefone`}>Telefone *</Label>
            <Input
              id={`contacts.${index}.telefone`}
              {...form.register(`contacts.${index}.telefone`)}
              placeholder="(11) 99999-9999"
            />
            {errors?.telefone && <p className="text-sm text-destructive">{errors.telefone.message}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
