"use client"

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTableToolbar } from "./data-table-toolbar"
import { DataTablePagination } from "./data-table-pagination"
import type { StoreExternal, StoreExternalFilters } from "@/lib/types/store-external"

interface DataTableProps {
  columns: ColumnDef<StoreExternal>[]
  data: StoreExternal[]
  loading?: boolean
  pagination: {
    page: number
    totalPages: number
    totalCount: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    startItem: number
    endItem: number
    nextPage: () => void
    previousPage: () => void
    goToPage: (page: number) => void
  }
  filters: StoreExternalFilters
  onFiltersChange: (filters: Partial<StoreExternalFilters>) => void
  onClearFilters: () => void
  onRefresh: () => void
}

export function DataTable({
  columns,
  data,
  loading,
  pagination,
  filters,
  onFiltersChange,
  onClearFilters,
  onRefresh,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        onRefresh={onRefresh}
        loading={loading}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {loading ? "Carregando..." : "Nenhum resultado encontrado."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination pagination={pagination} />
    </div>
  )
}
