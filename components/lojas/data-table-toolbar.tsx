"use client"

import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface LojasDataTableToolbarProps<TData> {
  table: Table<TData>
  activeOnly: boolean
  onActiveFilterChange: (active: boolean) => void
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function LojasDataTableToolbar<TData>({
  table,
  activeOnly,
  onActiveFilterChange,
  globalFilter,
  onGlobalFilterChange,
}: LojasDataTableToolbarProps<TData>) {
  const isFiltered = activeOnly || globalFilter.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filtrar lojas..."
          value={globalFilter}
          onChange={(event) => onGlobalFilterChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex items-center space-x-2">
          <Checkbox
            id="active-only"
            checked={activeOnly}
            onCheckedChange={(checked) => onActiveFilterChange(!!checked)}
          />
          <label
            htmlFor="active-only"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Exibir apenas ativas
          </label>
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onGlobalFilterChange("")
              onActiveFilterChange(false)
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
