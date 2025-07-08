"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface Filter {
  key: string
  label: string
  type: "select" | "switch"
  options?: { value: string; label: string }[]
}

interface DataTableGenericProps {
  data: any[]
  columns: Column[]
  filters?: Filter[]
  onEdit?: (item: any) => void
  onDelete?: (id: number) => void
  onToggle?: (id: number, field: string, value: boolean) => void
  loading?: boolean
}

export function DataTableGeneric({
  data,
  columns,
  filters = [],
  onEdit,
  onDelete,
  onToggle,
  loading = false,
}: DataTableGenericProps) {
  const [search, setSearch] = useState("")
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [detailsItem, setDetailsItem] = useState<any>(null)
  const [deleteItem, setDeleteItem] = useState<any>(null)

  // Filtrar dados
  const filteredData = data.filter((item) => {
    // Busca
    const searchMatch =
      search === "" || Object.values(item).some((value) => String(value).toLowerCase().includes(search.toLowerCase()))

    // Filtros
    const filterMatch = Object.entries(filterValues).every(([key, value]) => {
      if (value === undefined || value === "") return true
      return item[key] === value
    })

    return searchMatch && filterMatch
  })

  // Ordenar dados
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginar dados
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize)
  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const formatPhone = (phone: string) => {
    if (!phone) return ""
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  const renderCellValue = (column: Column, row: any) => {
    const value = row[column.key]

    if (column.render) {
      return column.render(value, row)
    }

    // Formatações especiais
    if (column.key === "phone") {
      return formatPhone(value)
    }

    if (typeof value === "boolean") {
      return <Switch checked={value} onCheckedChange={(checked) => onToggle?.(row.id, column.key, checked)} />
    }

    return value
  }

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />

          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-1">
              <label className="text-sm font-medium">{filter.label}</label>
              {filter.type === "select" && (
                <Select
                  value={filterValues[filter.key] || "default"}
                  onValueChange={(value) => setFilterValues((prev) => ({ ...prev, [filter.key]: value }))}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Todos</SelectItem>
                    {filter.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Exibir</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm">linhas</span>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border bg-gray-50">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      {column.label}
                      {sortField === column.key &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-1 h-4 w-4" />
                        ))}
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-100"
                  onDoubleClick={() => setDetailsItem(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>{renderCellValue(column, row)}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(row)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteItem(row)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {startIndex + 1} a {Math.min(startIndex + pageSize, sortedData.length)} de {sortedData.length}{" "}
            resultados
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={!!detailsItem} onOpenChange={() => setDetailsItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Item</DialogTitle>
          </DialogHeader>
          {detailsItem && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(detailsItem).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm font-medium capitalize">{key.replace(/_/g, " ")}</label>
                  <div className="text-sm text-muted-foreground">
                    {typeof value === "boolean" ? (value ? "Sim" : "Não") : String(value)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteItem && onDelete) {
                  onDelete(deleteItem.id)
                }
                setDeleteItem(null)
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
