"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StoreExternalFilters } from "@/lib/types/store-external"

interface DataTableToolbarProps {
  filters: StoreExternalFilters
  onFiltersChange: (filters: Partial<StoreExternalFilters>) => void
  onClearFilters: () => void
  onRefresh: () => void
  loading?: boolean
}

export function DataTableToolbar({
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
  loading,
}: DataTableToolbarProps) {
  const isFiltered = Object.values(filters).some((value) => value !== undefined && value !== "")

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Buscar lojas..."
          value={filters.search ?? ""}
          onChange={(event) => onFiltersChange({ search: event.target.value })}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select
          value={filters.status ?? ""}
          onValueChange={(value) => onFiltersChange({ status: value === "all" ? "" : value })}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.state ?? ""}
          onValueChange={(value) => onFiltersChange({ state: value === "all" ? "" : value })}
        >
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="SP">São Paulo</SelectItem>
            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
            <SelectItem value="MG">Minas Gerais</SelectItem>
            <SelectItem value="RS">Rio Grande do Sul</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button variant="ghost" onClick={onClearFilters} className="h-8 px-2 lg:px-3">
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading} className="h-8 bg-transparent">
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  )
}
